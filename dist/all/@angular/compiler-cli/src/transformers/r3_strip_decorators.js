"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var metadata_1 = require("../metadata");
function getDecoratorStripTransformerFactory(coreDecorators, reflector, checker) {
    return function (context) {
        return function (sourceFile) {
            var stripDecoratorsFromClassDeclaration = function (node) {
                if (node.decorators === undefined) {
                    return node;
                }
                var decorators = node.decorators.filter(function (decorator) {
                    var callExpr = decorator.expression;
                    if (ts.isCallExpression(callExpr)) {
                        var id = callExpr.expression;
                        if (ts.isIdentifier(id)) {
                            var symbol = resolveToStaticSymbol(id, sourceFile.fileName, reflector, checker);
                            return symbol && coreDecorators.has(symbol);
                        }
                    }
                    return true;
                });
                if (decorators.length !== node.decorators.length) {
                    return ts.updateClassDeclaration(node, decorators, node.modifiers, node.name, node.typeParameters, node.heritageClauses || [], node.members);
                }
                return node;
            };
            var stripDecoratorPropertyAssignment = function (node) {
                return ts.visitEachChild(node, function (member) {
                    if (!ts.isPropertyDeclaration(member) || !isDecoratorAssignment(member) ||
                        !member.initializer || !ts.isArrayLiteralExpression(member.initializer)) {
                        return member;
                    }
                    var newInitializer = ts.visitEachChild(member.initializer, function (decorator) {
                        if (!ts.isObjectLiteralExpression(decorator)) {
                            return decorator;
                        }
                        var type = lookupProperty(decorator, 'type');
                        if (!type || !ts.isIdentifier(type)) {
                            return decorator;
                        }
                        var symbol = resolveToStaticSymbol(type, sourceFile.fileName, reflector, checker);
                        if (!symbol || !coreDecorators.has(symbol)) {
                            return decorator;
                        }
                        return undefined;
                    }, context);
                    if (newInitializer === member.initializer) {
                        return member;
                    }
                    else if (newInitializer.elements.length === 0) {
                        return undefined;
                    }
                    else {
                        return ts.updateProperty(member, member.decorators, member.modifiers, member.name, member.questionToken, member.type, newInitializer);
                    }
                }, context);
            };
            return ts.visitEachChild(sourceFile, function (stmt) {
                if (ts.isClassDeclaration(stmt)) {
                    var decl = stmt;
                    if (stmt.decorators) {
                        decl = stripDecoratorsFromClassDeclaration(stmt);
                    }
                    return stripDecoratorPropertyAssignment(decl);
                }
                return stmt;
            }, context);
        };
    };
}
exports.getDecoratorStripTransformerFactory = getDecoratorStripTransformerFactory;
function isDecoratorAssignment(member) {
    if (!ts.isPropertyDeclaration(member)) {
        return false;
    }
    if (!member.modifiers ||
        !member.modifiers.some(function (mod) { return mod.kind === ts.SyntaxKind.StaticKeyword; })) {
        return false;
    }
    if (!ts.isIdentifier(member.name) || member.name.text !== 'decorators') {
        return false;
    }
    if (!member.initializer || !ts.isArrayLiteralExpression(member.initializer)) {
        return false;
    }
    return true;
}
function lookupProperty(expr, prop) {
    var decl = expr.properties.find(function (elem) { return !!elem.name && ts.isIdentifier(elem.name) && elem.name.text === prop; });
    if (decl === undefined || !ts.isPropertyAssignment(decl)) {
        return undefined;
    }
    return decl.initializer;
}
function resolveToStaticSymbol(id, containingFile, reflector, checker) {
    var res = checker.getSymbolAtLocation(id);
    if (!res || !res.declarations || res.declarations.length === 0) {
        return null;
    }
    var decl = res.declarations[0];
    if (!ts.isImportSpecifier(decl)) {
        return null;
    }
    var moduleSpecifier = decl.parent.parent.parent.moduleSpecifier;
    if (!ts.isStringLiteral(moduleSpecifier)) {
        return null;
    }
    return reflector.tryFindDeclaration(moduleSpecifier.text, id.text, containingFile);
}
var StripDecoratorsMetadataTransformer = /** @class */ (function () {
    function StripDecoratorsMetadataTransformer(coreDecorators, reflector) {
        this.coreDecorators = coreDecorators;
        this.reflector = reflector;
    }
    StripDecoratorsMetadataTransformer.prototype.start = function (sourceFile) {
        var _this = this;
        return function (value, node) {
            if (metadata_1.isClassMetadata(value) && ts.isClassDeclaration(node) && value.decorators) {
                value.decorators = value.decorators.filter(function (d) {
                    if (metadata_1.isMetadataSymbolicCallExpression(d) &&
                        metadata_1.isMetadataImportedSymbolReferenceExpression(d.expression)) {
                        var declaration = _this.reflector.tryFindDeclaration(d.expression.module, d.expression.name, sourceFile.fileName);
                        if (declaration && _this.coreDecorators.has(declaration)) {
                            return false;
                        }
                    }
                    return true;
                });
            }
            return value;
        };
    };
    return StripDecoratorsMetadataTransformer;
}());
exports.StripDecoratorsMetadataTransformer = StripDecoratorsMetadataTransformer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfc3RyaXBfZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvdHJhbnNmb3JtZXJzL3IzX3N0cmlwX2RlY29yYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCwrQkFBaUM7QUFFakMsd0NBQTBJO0FBTzFJLDZDQUNJLGNBQWlDLEVBQUUsU0FBMEIsRUFDN0QsT0FBdUI7SUFDekIsT0FBTyxVQUFTLE9BQWlDO1FBQy9DLE9BQU8sVUFBUyxVQUF5QjtZQUN2QyxJQUFNLG1DQUFtQyxHQUNyQyxVQUFDLElBQXlCO2dCQUN4QixJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFO29CQUNqQyxPQUFPLElBQUksQ0FBQztpQkFDYjtnQkFDRCxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFBLFNBQVM7b0JBQ2pELElBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUM7b0JBQ3RDLElBQUksRUFBRSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxFQUFFO3dCQUNqQyxJQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDO3dCQUMvQixJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEVBQUU7NEJBQ3ZCLElBQU0sTUFBTSxHQUFHLHFCQUFxQixDQUFDLEVBQUUsRUFBRSxVQUFVLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQzs0QkFDbEYsT0FBTyxNQUFNLElBQUksY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzt5QkFDN0M7cUJBQ0Y7b0JBQ0QsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO29CQUNoRCxPQUFPLEVBQUUsQ0FBQyxzQkFBc0IsQ0FDNUIsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFDaEUsSUFBSSxDQUFDLGVBQWUsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBRyxDQUFDO2lCQUNqRDtnQkFDRCxPQUFPLElBQUksQ0FBQztZQUNkLENBQUMsQ0FBQztZQUVOLElBQU0sZ0NBQWdDLEdBQUcsVUFBQyxJQUF5QjtnQkFDakUsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxVQUFBLE1BQU07b0JBQ25DLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUM7d0JBQ25FLENBQUMsTUFBTSxDQUFDLFdBQVcsSUFBSSxDQUFDLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUU7d0JBQzNFLE9BQU8sTUFBTSxDQUFDO3FCQUNmO29CQUVELElBQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxVQUFBLFNBQVM7d0JBQ3BFLElBQUksQ0FBQyxFQUFFLENBQUMseUJBQXlCLENBQUMsU0FBUyxDQUFDLEVBQUU7NEJBQzVDLE9BQU8sU0FBUyxDQUFDO3lCQUNsQjt3QkFDRCxJQUFNLElBQUksR0FBRyxjQUFjLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO3dCQUMvQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRTs0QkFDbkMsT0FBTyxTQUFTLENBQUM7eUJBQ2xCO3dCQUNELElBQU0sTUFBTSxHQUFHLHFCQUFxQixDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQzt3QkFDcEYsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7NEJBQzFDLE9BQU8sU0FBUyxDQUFDO3lCQUNsQjt3QkFDRCxPQUFPLFNBQVMsQ0FBQztvQkFDbkIsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUVaLElBQUksY0FBYyxLQUFLLE1BQU0sQ0FBQyxXQUFXLEVBQUU7d0JBQ3pDLE9BQU8sTUFBTSxDQUFDO3FCQUNmO3lCQUFNLElBQUksY0FBYyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO3dCQUMvQyxPQUFPLFNBQVMsQ0FBQztxQkFDbEI7eUJBQU07d0JBQ0wsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUNwQixNQUFNLEVBQUUsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLGFBQWEsRUFDOUUsTUFBTSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQztxQkFDbEM7Z0JBQ0gsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2QsQ0FBQyxDQUFDO1lBRUYsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxVQUFBLElBQUk7Z0JBQ3ZDLElBQUksRUFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFFO29CQUMvQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7b0JBQ2hCLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTt3QkFDbkIsSUFBSSxHQUFHLG1DQUFtQyxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUNsRDtvQkFDRCxPQUFPLGdDQUFnQyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUMvQztnQkFDRCxPQUFPLElBQUksQ0FBQztZQUNkLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNkLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQztBQUNKLENBQUM7QUEzRUQsa0ZBMkVDO0FBRUQsK0JBQStCLE1BQXVCO0lBQ3BELElBQUksQ0FBQyxFQUFFLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDckMsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUNELElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUztRQUNqQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBeEMsQ0FBd0MsQ0FBQyxFQUFFO1FBQzNFLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFDRCxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssWUFBWSxFQUFFO1FBQ3RFLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsSUFBSSxDQUFDLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUU7UUFDM0UsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELHdCQUF3QixJQUFnQyxFQUFFLElBQVk7SUFDcEUsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQzdCLFVBQUEsSUFBSSxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFwRSxDQUFvRSxDQUFDLENBQUM7SUFDbEYsSUFBSSxJQUFJLEtBQUssU0FBUyxJQUFJLENBQUMsRUFBRSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3hELE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBQ0QsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0FBQzFCLENBQUM7QUFFRCwrQkFDSSxFQUFpQixFQUFFLGNBQXNCLEVBQUUsU0FBMEIsRUFDckUsT0FBdUI7SUFDekIsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUM5RCxPQUFPLElBQUksQ0FBQztLQUNiO0lBQ0QsSUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQyxJQUFJLENBQUMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFO1FBQy9CLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFDRCxJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBUSxDQUFDLE1BQVEsQ0FBQyxNQUFRLENBQUMsZUFBZSxDQUFDO0lBQ3hFLElBQUksQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxFQUFFO1FBQ3hDLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFDRCxPQUFPLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDckYsQ0FBQztBQUVEO0lBQ0UsNENBQW9CLGNBQWlDLEVBQVUsU0FBMEI7UUFBckUsbUJBQWMsR0FBZCxjQUFjLENBQW1CO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBaUI7SUFBRyxDQUFDO0lBRTdGLGtEQUFLLEdBQUwsVUFBTSxVQUF5QjtRQUEvQixpQkFpQkM7UUFoQkMsT0FBTyxVQUFDLEtBQW9CLEVBQUUsSUFBYTtZQUN6QyxJQUFJLDBCQUFlLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7Z0JBQzdFLEtBQUssQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDO29CQUMxQyxJQUFJLDJDQUFnQyxDQUFDLENBQUMsQ0FBQzt3QkFDbkMsc0RBQTJDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFO3dCQUM3RCxJQUFNLFdBQVcsR0FBRyxLQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUNqRCxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ2pFLElBQUksV0FBVyxJQUFJLEtBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFOzRCQUN2RCxPQUFPLEtBQUssQ0FBQzt5QkFDZDtxQkFDRjtvQkFDRCxPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDLENBQUMsQ0FBQzthQUNKO1lBQ0QsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDLENBQUM7SUFDSixDQUFDO0lBQ0gseUNBQUM7QUFBRCxDQUFDLEFBckJELElBcUJDO0FBckJZLGdGQUFrQyJ9