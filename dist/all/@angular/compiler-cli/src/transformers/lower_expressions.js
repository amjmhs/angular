"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var ts = require("typescript");
var index_1 = require("../metadata/index");
function toMap(items, select) {
    return new Map(items.map(function (i) { return [select(i), i]; }));
}
// We will never lower expressions in a nested lexical scope so avoid entering them.
// This also avoids a bug in TypeScript 2.3 where the lexical scopes get out of sync
// when using visitEachChild.
function isLexicalScope(node) {
    switch (node.kind) {
        case ts.SyntaxKind.ArrowFunction:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.ClassExpression:
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.FunctionType:
        case ts.SyntaxKind.TypeLiteral:
        case ts.SyntaxKind.ArrayType:
            return true;
    }
    return false;
}
function transformSourceFile(sourceFile, requests, context) {
    var inserts = [];
    // Calculate the range of interesting locations. The transform will only visit nodes in this
    // range to improve the performance on large files.
    var locations = Array.from(requests.keys());
    var min = Math.min.apply(Math, locations);
    var max = Math.max.apply(Math, locations);
    // Visit nodes matching the request and synthetic nodes added by tsickle
    function shouldVisit(pos, end) {
        return (pos <= max && end >= min) || pos == -1;
    }
    function visitSourceFile(sourceFile) {
        function topLevelStatement(node) {
            var declarations = [];
            function visitNode(node) {
                // Get the original node before tsickle
                var _a = ts.getOriginalNode(node), pos = _a.pos, end = _a.end, kind = _a.kind, originalParent = _a.parent;
                var nodeRequest = requests.get(pos);
                if (nodeRequest && nodeRequest.kind == kind && nodeRequest.end == end) {
                    // This node is requested to be rewritten as a reference to the exported name.
                    if (originalParent && originalParent.kind === ts.SyntaxKind.VariableDeclaration) {
                        // As the value represents the whole initializer of a variable declaration,
                        // just refer to that variable. This e.g. helps to preserve closure comments
                        // at the right place.
                        var varParent = originalParent;
                        if (varParent.name.kind === ts.SyntaxKind.Identifier) {
                            var varName = varParent.name.text;
                            var exportName_1 = nodeRequest.name;
                            declarations.push({
                                name: exportName_1,
                                node: ts.createIdentifier(varName),
                                order: 1 /* AfterStmt */
                            });
                            return node;
                        }
                    }
                    // Record that the node needs to be moved to an exported variable with the given name
                    var exportName = nodeRequest.name;
                    declarations.push({ name: exportName, node: node, order: 0 /* BeforeStmt */ });
                    return ts.createIdentifier(exportName);
                }
                var result = node;
                if (shouldVisit(pos, end) && !isLexicalScope(node)) {
                    result = ts.visitEachChild(node, visitNode, context);
                }
                return result;
            }
            // Get the original node before tsickle
            var _a = ts.getOriginalNode(node), pos = _a.pos, end = _a.end;
            var resultStmt;
            if (shouldVisit(pos, end)) {
                resultStmt = ts.visitEachChild(node, visitNode, context);
            }
            else {
                resultStmt = node;
            }
            if (declarations.length) {
                inserts.push({ relativeTo: resultStmt, declarations: declarations });
            }
            return resultStmt;
        }
        var newStatements = sourceFile.statements.map(topLevelStatement);
        if (inserts.length) {
            // Insert the declarations relative to the rewritten statement that references them.
            var insertMap_1 = toMap(inserts, function (i) { return i.relativeTo; });
            var tmpStatements_1 = [];
            newStatements.forEach(function (statement) {
                var insert = insertMap_1.get(statement);
                if (insert) {
                    var before = insert.declarations.filter(function (d) { return d.order === 0 /* BeforeStmt */; });
                    if (before.length) {
                        tmpStatements_1.push(createVariableStatementForDeclarations(before));
                    }
                    tmpStatements_1.push(statement);
                    var after = insert.declarations.filter(function (d) { return d.order === 1 /* AfterStmt */; });
                    if (after.length) {
                        tmpStatements_1.push(createVariableStatementForDeclarations(after));
                    }
                }
                else {
                    tmpStatements_1.push(statement);
                }
            });
            // Insert an exports clause to export the declarations
            tmpStatements_1.push(ts.createExportDeclaration(
            /* decorators */ undefined, 
            /* modifiers */ undefined, ts.createNamedExports(inserts
                .reduce(function (accumulator, insert) { return accumulator.concat(insert.declarations); }, [])
                .map(function (declaration) { return ts.createExportSpecifier(
            /* propertyName */ undefined, declaration.name); }))));
            newStatements = tmpStatements_1;
        }
        // Note: We cannot use ts.updateSourcefile here as
        // it does not work well with decorators.
        // See https://github.com/Microsoft/TypeScript/issues/17384
        var newSf = ts.getMutableClone(sourceFile);
        if (!(sourceFile.flags & ts.NodeFlags.Synthesized)) {
            newSf.flags &= ~ts.NodeFlags.Synthesized;
        }
        newSf.statements = ts.setTextRange(ts.createNodeArray(newStatements), sourceFile.statements);
        return newSf;
    }
    return visitSourceFile(sourceFile);
}
function createVariableStatementForDeclarations(declarations) {
    var varDecls = declarations.map(function (i) { return ts.createVariableDeclaration(i.name, /* type */ undefined, i.node); });
    return ts.createVariableStatement(
    /* modifiers */ undefined, ts.createVariableDeclarationList(varDecls, ts.NodeFlags.Const));
}
function getExpressionLoweringTransformFactory(requestsMap, program) {
    // Return the factory
    return function (context) { return function (sourceFile) {
        // We need to use the original SourceFile for reading metadata, and not the transformed one.
        var originalFile = program.getSourceFile(sourceFile.fileName);
        if (originalFile) {
            var requests = requestsMap.getRequests(originalFile);
            if (requests && requests.size) {
                return transformSourceFile(sourceFile, requests, context);
            }
        }
        return sourceFile;
    }; };
}
exports.getExpressionLoweringTransformFactory = getExpressionLoweringTransformFactory;
function isEligibleForLowering(node) {
    if (node) {
        switch (node.kind) {
            case ts.SyntaxKind.SourceFile:
            case ts.SyntaxKind.Decorator:
                // Lower expressions that are local to the module scope or
                // in a decorator.
                return true;
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.InterfaceDeclaration:
            case ts.SyntaxKind.EnumDeclaration:
            case ts.SyntaxKind.FunctionDeclaration:
                // Don't lower expressions in a declaration.
                return false;
            case ts.SyntaxKind.VariableDeclaration:
                // Avoid lowering expressions already in an exported variable declaration
                return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) == 0;
        }
        return isEligibleForLowering(node.parent);
    }
    return true;
}
function isPrimitive(value) {
    return Object(value) !== value;
}
function isRewritten(value) {
    return index_1.isMetadataGlobalReferenceExpression(value) && compiler_1.isLoweredSymbol(value.name);
}
function isLiteralFieldNamed(node, names) {
    if (node.parent && node.parent.kind == ts.SyntaxKind.PropertyAssignment) {
        var property = node.parent;
        if (property.parent && property.parent.kind == ts.SyntaxKind.ObjectLiteralExpression &&
            property.name && property.name.kind == ts.SyntaxKind.Identifier) {
            var propertyName = property.name;
            return names.has(propertyName.text);
        }
    }
    return false;
}
var LowerMetadataTransform = /** @class */ (function () {
    function LowerMetadataTransform(lowerableFieldNames) {
        this.requests = new Map();
        this.lowerableFieldNames = new Set(lowerableFieldNames);
    }
    // RequestMap
    LowerMetadataTransform.prototype.getRequests = function (sourceFile) {
        var result = this.requests.get(sourceFile.fileName);
        if (!result) {
            // Force the metadata for this source file to be collected which
            // will recursively call start() populating the request map;
            this.cache.getMetadata(sourceFile);
            // If we still don't have the requested metadata, the file is not a module
            // or is a declaration file so return an empty map.
            result = this.requests.get(sourceFile.fileName) || new Map();
        }
        return result;
    };
    // MetadataTransformer
    LowerMetadataTransform.prototype.connect = function (cache) { this.cache = cache; };
    LowerMetadataTransform.prototype.start = function (sourceFile) {
        var _this = this;
        var identNumber = 0;
        var freshIdent = function () { return compiler_1.createLoweredSymbol(identNumber++); };
        var requests = new Map();
        this.requests.set(sourceFile.fileName, requests);
        var replaceNode = function (node) {
            var name = freshIdent();
            requests.set(node.pos, { name: name, kind: node.kind, location: node.pos, end: node.end });
            return { __symbolic: 'reference', name: name };
        };
        var isExportedSymbol = (function () {
            var exportTable;
            return function (node) {
                if (node.kind == ts.SyntaxKind.Identifier) {
                    var ident = node;
                    if (!exportTable) {
                        exportTable = createExportTableFor(sourceFile);
                    }
                    return exportTable.has(ident.text);
                }
                return false;
            };
        })();
        var isExportedPropertyAccess = function (node) {
            if (node.kind === ts.SyntaxKind.PropertyAccessExpression) {
                var pae = node;
                if (isExportedSymbol(pae.expression)) {
                    return true;
                }
            }
            return false;
        };
        var hasLowerableParentCache = new Map();
        var shouldBeLowered = function (node) {
            if (node === undefined) {
                return false;
            }
            var lowerable = false;
            if ((node.kind === ts.SyntaxKind.ArrowFunction ||
                node.kind === ts.SyntaxKind.FunctionExpression) &&
                isEligibleForLowering(node)) {
                lowerable = true;
            }
            else if (isLiteralFieldNamed(node, _this.lowerableFieldNames) && isEligibleForLowering(node) &&
                !isExportedSymbol(node) && !isExportedPropertyAccess(node)) {
                lowerable = true;
            }
            return lowerable;
        };
        var hasLowerableParent = function (node) {
            if (node === undefined) {
                return false;
            }
            if (!hasLowerableParentCache.has(node)) {
                hasLowerableParentCache.set(node, shouldBeLowered(node.parent) || hasLowerableParent(node.parent));
            }
            return hasLowerableParentCache.get(node);
        };
        var isLowerable = function (node) {
            if (node === undefined) {
                return false;
            }
            return shouldBeLowered(node) && !hasLowerableParent(node);
        };
        return function (value, node) {
            if (!isPrimitive(value) && !isRewritten(value) && isLowerable(node)) {
                return replaceNode(node);
            }
            return value;
        };
    };
    return LowerMetadataTransform;
}());
exports.LowerMetadataTransform = LowerMetadataTransform;
function createExportTableFor(sourceFile) {
    var exportTable = new Set();
    // Lazily collect all the exports from the source file
    ts.forEachChild(sourceFile, function scan(node) {
        switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.FunctionDeclaration:
            case ts.SyntaxKind.InterfaceDeclaration:
                if ((ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) != 0) {
                    var classDeclaration = node;
                    var name_1 = classDeclaration.name;
                    if (name_1)
                        exportTable.add(name_1.text);
                }
                break;
            case ts.SyntaxKind.VariableStatement:
                var variableStatement = node;
                for (var _i = 0, _a = variableStatement.declarationList.declarations; _i < _a.length; _i++) {
                    var declaration = _a[_i];
                    scan(declaration);
                }
                break;
            case ts.SyntaxKind.VariableDeclaration:
                var variableDeclaration = node;
                if ((ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) != 0 &&
                    variableDeclaration.name.kind == ts.SyntaxKind.Identifier) {
                    var name_2 = variableDeclaration.name;
                    exportTable.add(name_2.text);
                }
                break;
            case ts.SyntaxKind.ExportDeclaration:
                var exportDeclaration = node;
                var moduleSpecifier = exportDeclaration.moduleSpecifier, exportClause = exportDeclaration.exportClause;
                if (!moduleSpecifier && exportClause) {
                    exportClause.elements.forEach(function (spec) { exportTable.add(spec.name.text); });
                }
        }
    });
    return exportTable;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG93ZXJfZXhwcmVzc2lvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL3RyYW5zZm9ybWVycy9sb3dlcl9leHByZXNzaW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDhDQUF1RTtBQUN2RSwrQkFBaUM7QUFFakMsMkNBQTBJO0FBeUIxSSxlQUFxQixLQUFVLEVBQUUsTUFBc0I7SUFDckQsT0FBTyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFTLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQWQsQ0FBYyxDQUFDLENBQUMsQ0FBQztBQUN6RCxDQUFDO0FBRUQsb0ZBQW9GO0FBQ3BGLG9GQUFvRjtBQUNwRiw2QkFBNkI7QUFDN0Isd0JBQXdCLElBQWE7SUFDbkMsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ2pCLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7UUFDakMsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDO1FBQ3RDLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQztRQUN2QyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDO1FBQ25DLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztRQUNwQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDO1FBQ2hDLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUM7UUFDL0IsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVM7WUFDMUIsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVELDZCQUNJLFVBQXlCLEVBQUUsUUFBNEIs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