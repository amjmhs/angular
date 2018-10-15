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
var host_1 = require("../../host");
/**
 * reflector.ts implements static reflection of declarations using the TypeScript `ts.TypeChecker`.
 */
var TypeScriptReflectionHost = /** @class */ (function () {
    function TypeScriptReflectionHost(checker) {
        this.checker = checker;
    }
    TypeScriptReflectionHost.prototype.getDecoratorsOfDeclaration = function (declaration) {
        var _this = this;
        if (declaration.decorators === undefined || declaration.decorators.length === 0) {
            return null;
        }
        return declaration.decorators.map(function (decorator) { return _this._reflectDecorator(decorator); })
            .filter(function (dec) { return dec !== null; });
    };
    TypeScriptReflectionHost.prototype.getMembersOfClass = function (declaration) {
        var _this = this;
        var clazz = castDeclarationToClassOrDie(declaration);
        return clazz.members.map(function (member) { return _this._reflectMember(member); })
            .filter(function (member) { return member !== null; });
    };
    TypeScriptReflectionHost.prototype.getConstructorParameters = function (declaration) {
        var _this = this;
        var clazz = castDeclarationToClassOrDie(declaration);
        // First, find the constructor.
        var ctor = clazz.members.find(ts.isConstructorDeclaration);
        if (ctor === undefined) {
            return null;
        }
        return ctor.parameters.map(function (node) {
            // The name of the parameter is easy.
            var name = parameterName(node.name);
            var decorators = _this.getDecoratorsOfDeclaration(node);
            // It may or may not be possible to write an expression that refers to the value side of the
            // type named for the parameter.
            var typeValueExpr = null;
            // It's not possible to get a value expression if the parameter doesn't even have a type.
            if (node.type !== undefined) {
                // It's only valid to convert a type reference to a value reference if the type actually has
                // a
                // value declaration associated with it.
                var type = _this.checker.getTypeFromTypeNode(node.type);
                if (type.symbol !== undefined && type.symbol.valueDeclaration !== undefined) {
                    // The type points to a valid value declaration. Rewrite the TypeReference into an
                    // Expression
                    // which references the value pointed to by the TypeReference, if possible.
                    typeValueExpr = typeNodeToValueExpr(node.type);
                }
            }
            return {
                name: name,
                nameNode: node.name,
                type: typeValueExpr, decorators: decorators,
            };
        });
    };
    TypeScriptReflectionHost.prototype.getImportOfIdentifier = function (id) {
        var symbol = this.checker.getSymbolAtLocation(id);
        if (symbol === undefined || symbol.declarations === undefined ||
            symbol.declarations.length !== 1) {
            return null;
        }
        // Ignore decorators that are defined locally (not imported).
        var decl = symbol.declarations[0];
        if (!ts.isImportSpecifier(decl)) {
            return null;
        }
        // Walk back from the specifier to find the declaration, which carries the module specifier.
        var importDecl = decl.parent.parent.parent;
        // The module specifier is guaranteed to be a string literal, so this should always pass.
        if (!ts.isStringLiteral(importDecl.moduleSpecifier)) {
            // Not allowed to happen in TypeScript ASTs.
            return null;
        }
        // Read the module specifier.
        var from = importDecl.moduleSpecifier.text;
        // Compute the name by which the decorator was exported, not imported.
        var name = (decl.propertyName !== undefined ? decl.propertyName : decl.name).text;
        return { from: from, name: name };
    };
    TypeScriptReflectionHost.prototype.getExportsOfModule = function (node) {
        var _this = this;
        // In TypeScript code, modules are only ts.SourceFiles. Throw if the node isn't a module.
        if (!ts.isSourceFile(node)) {
            throw new Error("getDeclarationsOfModule() called on non-SourceFile in TS code");
        }
        var map = new Map();
        // Reflect the module to a Symbol, and use getExportsOfModule() to get a list of exported
        // Symbols.
        var symbol = this.checker.getSymbolAtLocation(node);
        if (symbol === undefined) {
            return null;
        }
        this.checker.getExportsOfModule(symbol).forEach(function (exportSymbol) {
            // Map each exported Symbol to a Declaration and add it to the map.
            var decl = _this._getDeclarationOfSymbol(exportSymbol);
            if (decl !== null) {
                map.set(exportSymbol.name, decl);
            }
        });
        return map;
    };
    TypeScriptReflectionHost.prototype.isClass = function (node) {
        // In TypeScript code, classes are ts.ClassDeclarations.
        return ts.isClassDeclaration(node);
    };
    TypeScriptReflectionHost.prototype.getDeclarationOfIdentifier = function (id) {
        // Resolve the identifier to a Symbol, and return the declaration of that.
        var symbol = this.checker.getSymbolAtLocation(id);
        if (symbol === undefined) {
            return null;
        }
        return this._getDeclarationOfSymbol(symbol);
    };
    /**
     * Resolve a `ts.Symbol` to its declaration, keeping track of the `viaModule` along the way.
     *
     * @internal
     */
    TypeScriptReflectionHost.prototype._getDeclarationOfSymbol = function (symbol) {
        var viaModule = null;
        // Look through the Symbol's immediate declarations, and see if any of them are import-type
        // statements.
        if (symbol.declarations !== undefined && symbol.declarations.length > 0) {
            for (var i = 0; i < symbol.declarations.length; i++) {
                var decl = symbol.declarations[i];
                if (ts.isImportSpecifier(decl) && decl.parent !== undefined &&
                    decl.parent.parent !== undefined && decl.parent.parent.parent !== undefined) {
                    // Find the ImportDeclaration that imported this Symbol.
                    var importDecl = decl.parent.parent.parent;
                    // The moduleSpecifier should always be a string.
                    if (ts.isStringLiteral(importDecl.moduleSpecifier)) {
                        // Check if the moduleSpecifier is absolute. If it is, this symbol comes from an
                        // external module, and the import path becomes the viaModule.
                        var moduleSpecifier = importDecl.moduleSpecifier.text;
                        if (!moduleSpecifier.startsWith('.')) {
                            viaModule = moduleSpecifier;
                            break;
                        }
                    }
                }
            }
        }
        // Now, resolve the Symbol to its declaration by following any and all aliases.
        while (symbol.flags & ts.SymbolFlags.Alias) {
            symbol = this.checker.getAliasedSymbol(symbol);
        }
        // Look at the resolved Symbol's declarations and pick one of them to return. Value declarations
        // are given precedence over type declarations.
        if (symbol.valueDeclaration !== undefined) {
            return {
                node: symbol.valueDeclaration,
                viaModule: viaModule,
            };
        }
        else if (symbol.declarations !== undefined && symbol.declarations.length > 0) {
            return {
                node: symbol.declarations[0],
                viaModule: viaModule,
            };
        }
        else {
            return null;
        }
    };
    TypeScriptReflectionHost.prototype._reflectDecorator = function (node) {
        // Attempt to resolve the decorator expression into a reference to a concrete Identifier. The
        // expression may contain a call to a function which returns the decorator function, in which
        // case we want to return the arguments.
        var decoratorExpr = node.expression;
        var args = null;
        // Check for call expressions.
        if (ts.isCallExpression(decoratorExpr)) {
            args = Array.from(decoratorExpr.arguments);
            decoratorExpr = decoratorExpr.expression;
        }
        // The final resolved decorator should be a `ts.Identifier` - if it's not, then something is
        // wrong and the decorator can't be resolved statically.
        if (!ts.isIdentifier(decoratorExpr)) {
            return null;
        }
        var importDecl = this.getImportOfIdentifier(decoratorExpr);
        return {
            name: decoratorExpr.text,
            import: importDecl, node: node, args: args,
        };
    };
    TypeScriptReflectionHost.prototype._reflectMember = function (node) {
        var kind = null;
        var value = null;
        var name = null;
        var nameNode = null;
        if (ts.isPropertyDeclaration(node)) {
            kind = host_1.ClassMemberKind.Property;
            value = node.initializer || null;
        }
        else if (ts.isGetAccessorDeclaration(node)) {
            kind = host_1.ClassMemberKind.Getter;
        }
        else if (ts.isSetAccessorDeclaration(node)) {
            kind = host_1.ClassMemberKind.Setter;
        }
        else if (ts.isMethodDeclaration(node)) {
            kind = host_1.ClassMemberKind.Method;
        }
        else if (ts.isConstructorDeclaration(node)) {
            kind = host_1.ClassMemberKind.Constructor;
        }
        else {
            return null;
        }
        if (ts.isConstructorDeclaration(node)) {
            name = 'constructor';
        }
        else if (ts.isIdentifier(node.name)) {
            name = node.name.text;
            nameNode = node.name;
        }
        else {
            return null;
        }
        var decorators = this.getDecoratorsOfDeclaration(node);
        var isStatic = node.modifiers !== undefined &&
            node.modifiers.some(function (mod) { return mod.kind === ts.SyntaxKind.StaticKeyword; });
        return {
            node: node,
            implementation: node, kind: kind,
            type: node.type || null, name: name, nameNode: nameNode, decorators: decorators, value: value, isStatic: isStatic,
        };
    };
    return TypeScriptReflectionHost;
}());
exports.TypeScriptReflectionHost = TypeScriptReflectionHost;
function reflectNameOfDeclaration(decl) {
    var id = reflectIdentifierOfDeclaration(decl);
    return id && id.text || null;
}
exports.reflectNameOfDeclaration = reflectNameOfDeclaration;
function reflectIdentifierOfDeclaration(decl) {
    if (ts.isClassDeclaration(decl) || ts.isFunctionDeclaration(decl)) {
        return decl.name || null;
    }
    else if (ts.isVariableDeclaration(decl)) {
        if (ts.isIdentifier(decl.name)) {
            return decl.name;
        }
    }
    return null;
}
exports.reflectIdentifierOfDeclaration = reflectIdentifierOfDeclaration;
function reflectTypeEntityToDeclaration(type, checker) {
    var realSymbol = checker.getSymbolAtLocation(type);
    if (realSymbol === undefined) {
        throw new Error("Cannot resolve type entity to symbol");
    }
    while (realSymbol.flags & ts.SymbolFlags.Alias) {
        realSymbol = checker.getAliasedSymbol(realSymbol);
    }
    var node = null;
    if (realSymbol.valueDeclaration !== undefined) {
        node = realSymbol.valueDeclaration;
    }
    else if (realSymbol.declarations !== undefined && realSymbol.declarations.length === 1) {
        node = realSymbol.declarations[0];
    }
    else {
        throw new Error("Cannot resolve type entity symbol to declaration");
    }
    if (ts.isQualifiedName(type)) {
        if (!ts.isIdentifier(type.left)) {
            throw new Error("Cannot handle qualified name with non-identifier lhs");
        }
        var symbol = checker.getSymbolAtLocation(type.left);
        if (symbol === undefined || symbol.declarations === undefined ||
            symbol.declarations.length !== 1) {
            throw new Error("Cannot resolve qualified type entity lhs to symbol");
        }
        var decl = symbol.declarations[0];
        if (ts.isNamespaceImport(decl)) {
            var clause = decl.parent;
            var importDecl = clause.parent;
            if (!ts.isStringLiteral(importDecl.moduleSpecifier)) {
                throw new Error("Module specifier is not a string");
            }
            return { node: node, from: importDecl.moduleSpecifier.text };
        }
        else {
            throw new Error("Unknown import type?");
        }
    }
    else {
        return { node: node, from: null };
    }
}
exports.reflectTypeEntityToDeclaration = reflectTypeEntityToDeclaration;
function filterToMembersWithDecorator(members, name, module) {
    return members.filter(function (member) { return !member.isStatic; })
        .map(function (member) {
        if (member.decorators === null) {
            return null;
        }
        var decorators = member.decorators.filter(function (dec) {
            if (dec.import !== null) {
                return dec.import.name === name && (module === undefined || dec.import.from === module);
            }
            else {
                return dec.name === name && module === undefined;
            }
        });
        if (decorators.length === 0) {
            return null;
        }
        return { member: member, decorators: decorators };
    })
        .filter(function (value) { return value !== null; });
}
exports.filterToMembersWithDecorator = filterToMembersWithDecorator;
function findMember(members, name, isStatic) {
    if (isStatic === void 0) { isStatic = false; }
    return members.find(function (member) { return member.isStatic === isStatic && member.name === name; }) || null;
}
exports.findMember = findMember;
function reflectObjectLiteral(node) {
    var map = new Map();
    node.properties.forEach(function (prop) {
        if (ts.isPropertyAssignment(prop)) {
            var name_1 = propertyNameToString(prop.name);
            if (name_1 === null) {
                return;
            }
            map.set(name_1, prop.initializer);
        }
        else if (ts.isShorthandPropertyAssignment(prop)) {
            map.set(prop.name.text, prop.name);
        }
        else {
            return;
        }
    });
    return map;
}
exports.reflectObjectLiteral = reflectObjectLiteral;
function castDeclarationToClassOrDie(declaration) {
    if (!ts.isClassDeclaration(declaration)) {
        throw new Error("Reflecting on a " + ts.SyntaxKind[declaration.kind] + " instead of a ClassDeclaration.");
    }
    return declaration;
}
function parameterName(name) {
    if (ts.isIdentifier(name)) {
        return name.text;
    }
    else {
        return null;
    }
}
function typeNodeToValueExpr(node) {
    if (ts.isTypeReferenceNode(node)) {
        return entityNameToValue(node.typeName);
    }
    else {
        return null;
    }
}
function entityNameToValue(node) {
    if (ts.isQualifiedName(node)) {
        var left = entityNameToValue(node.left);
        return left !== null ? ts.createPropertyAccess(left, node.right) : null;
    }
    else if (ts.isIdentifier(node)) {
        return ts.getMutableClone(node);
    }
    else {
        return null;
    }
}
function propertyNameToString(node) {
    if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) {
        return node.text;
    }
    else {
        return null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9tZXRhZGF0YS9zcmMvcmVmbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0JBQWlDO0FBRWpDLG1DQUFtSDtBQUVuSDs7R0FFRztBQUVIO0lBQ0Usa0NBQXNCLE9BQXVCO1FBQXZCLFlBQU8sR0FBUCxPQUFPLENBQWdCO0lBQUcsQ0FBQztJQUVqRCw2REFBMEIsR0FBMUIsVUFBMkIsV0FBMkI7UUFBdEQsaUJBTUM7UUFMQyxJQUFJLFdBQVcsQ0FBQyxVQUFVLEtBQUssU0FBUyxJQUFJLFdBQVcsQ0FBQyxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMvRSxPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsT0FBTyxXQUFXLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFBLFNBQVMsSUFBSSxPQUFBLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsRUFBakMsQ0FBaUMsQ0FBQzthQUM1RSxNQUFNLENBQUMsVUFBQyxHQUFHLElBQXVCLE9BQUEsR0FBRyxLQUFLLElBQUksRUFBWixDQUFZLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsb0RBQWlCLEdBQWpCLFVBQWtCLFdBQTJCO1FBQTdDLGlCQUlDO1FBSEMsSUFBTSxLQUFLLEdBQUcsMkJBQTJCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdkQsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLEtBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQTNCLENBQTJCLENBQUM7YUFDMUQsTUFBTSxDQUFDLFVBQUMsTUFBTSxJQUE0QixPQUFBLE1BQU0sS0FBSyxJQUFJLEVBQWYsQ0FBZSxDQUFDLENBQUM7SUFDbEUs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