"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var visitor_1 = require("../../util/src/visitor");
var translator_1 = require("./translator");
var NO_DECORATORS = new Set();
function ivyTransformFactory(compilation, reflector, coreImportsFrom) {
    return function (context) {
        return function (file) {
            return transformIvySourceFile(compilation, context, reflector, coreImportsFrom, file);
        };
    };
}
exports.ivyTransformFactory = ivyTransformFactory;
var IvyVisitor = /** @class */ (function (_super) {
    __extends(IvyVisitor, _super);
    function IvyVisitor(compilation, reflector, importManager, isCore) {
        var _this = _super.call(this) || this;
        _this.compilation = compilation;
        _this.reflector = reflector;
        _this.importManager = importManager;
        _this.isCore = isCore;
        return _this;
    }
    IvyVisitor.prototype.visitClassDeclaration = function (node) {
        var _this = this;
        // Determine if this class has an Ivy field that needs to be added, and compile the field
        // to an expression if so.
        var res = this.compilation.compileIvyFieldFor(node);
        if (res !== undefined) {
            // There is at least one field to add.
            var statements_1 = [];
            var members_1 = node.members.slice();
            res.forEach(function (field) {
                // Translate the initializer for the field into TS nodes.
                var exprNode = translator_1.translateExpression(field.initializer, _this.importManager);
                // Create a static property declaration for the new field.
                var property = ts.createProperty(undefined, [ts.createToken(ts.SyntaxKind.StaticKeyword)], field.name, undefined, undefined, exprNode);
                field.statements.map(function (stmt) { return translator_1.translateStatement(stmt, _this.importManager); })
                    .forEach(function (stmt) { return statements_1.push(stmt); });
                members_1.push(property);
            });
            // Replace the class declaration with an updated version.
            node = ts.updateClassDeclaration(node, 
            // Remove the decorator which triggered this compilation, leaving the others alone.
            maybeFilterDecorator(node.decorators, this.compilation.ivyDecoratorFor(node).node), node.modifiers, node.name, node.typeParameters, node.heritageClauses || [], 
            // Map over the class members and remove any Angular decorators from them.
            members_1.map(function (member) { return _this._stripAngularDecorators(member); }));
            return { node: node, before: statements_1 };
        }
        return { node: node };
    };
    /**
     * Return all decorators on a `Declaration` which are from @angular/core, or an empty set if none
     * are.
     */
    IvyVisitor.prototype._angularCoreDecorators = function (decl) {
        var _this = this;
        var decorators = this.reflector.getDecoratorsOfDeclaration(decl);
        if (decorators === null) {
            return NO_DECORATORS;
        }
        var coreDecorators = decorators.filter(function (dec) { return _this.isCore || isFromAngularCore(dec); })
            .map(function (dec) { return dec.node; });
        if (coreDecorators.length > 0) {
            return new Set(coreDecorators);
        }
        else {
            return NO_DECORATORS;
        }
    };
    /**
     * Given a `ts.Node`, filter the decorators array and return a version containing only non-Angular
     * decorators.
     *
     * If all decorators are removed (or none existed in the first place), this method returns
     * `undefined`.
     */
    IvyVisitor.prototype._nonCoreDecoratorsOnly = function (node) {
        // Shortcut if the node has no decorators.
        if (node.decorators === undefined) {
            return undefined;
        }
        // Build a Set of the decorators on this node from @angular/core.
        var coreDecorators = this._angularCoreDecorators(node);
        if (coreDecorators.size === node.decorators.length) {
            // If all decorators are to be removed, return `undefined`.
            return undefined;
        }
        else if (coreDecorators.size === 0) {
            // If no decorators need to be removed, return the original decorators array.
            return node.decorators;
        }
        // Filter out the core decorators.
        var filtered = node.decorators.filter(function (dec) { return !coreDecorators.has(dec); });
        // If no decorators survive, return `undefined`. This can only happen if a core decorator is
        // repeated on the node.
        if (filtered.length === 0) {
            return undefined;
        }
        // Create a new `NodeArray` with the filtered decorators that sourcemaps back to the original.
        var array = ts.createNodeArray(filtered);
        array.pos = node.decorators.pos;
        array.end = node.decorators.end;
        return array;
    };
    /**
     * Remove Angular decorators from a `ts.Node` in a shallow manner.
     *
     * This will remove decorators from class elements (getters, setters, properties, methods) as well
     * as parameters of constructors.
     */
    IvyVisitor.prototype._stripAngularDecorators = function (node) {
        var _this = this;
        if (ts.isParameter(node)) {
            // Strip decorators from parameters (probably of the constructor).
            node = ts.updateParameter(node, this._nonCoreDecoratorsOnly(node), node.modifiers, node.dotDotDotToken, node.name, node.questionToken, node.type, node.initializer);
        }
        else if (ts.isMethodDeclaration(node) && node.decorators !== undefined) {
            // Strip decorators of methods.
            node = ts.updateMethod(node, this._nonCoreDecoratorsOnly(node), node.modifiers, node.asteriskToken, node.name, node.questionToken, node.typeParameters, node.parameters, node.type, node.body);
        }
        else if (ts.isPropertyDeclaration(node) && node.decorators !== undefined) {
            // Strip decorators of properties.
            node = ts.updateProperty(node, this._nonCoreDecoratorsOnly(node), node.modifiers, node.name, node.questionToken, node.type, node.initializer);
        }
        else if (ts.isGetAccessor(node)) {
            // Strip decorators of getters.
            node = ts.updateGetAccessor(node, this._nonCoreDecoratorsOnly(node), node.modifiers, node.name, node.parameters, node.type, node.body);
        }
        else if (ts.isSetAccessor(node)) {
            // Strip decorators of setters.
            node = ts.updateSetAccessor(node, this._nonCoreDecoratorsOnly(node), node.modifiers, node.name, node.parameters, node.body);
        }
        else if (ts.isConstructorDeclaration(node)) {
            // For constructors, strip decorators of the parameters.
            var parameters = node.parameters.map(function (param) { return _this._stripAngularDecorators(param); });
            node =
                ts.updateConstructor(node, node.decorators, node.modifiers, parameters, node.body);
        }
        return node;
    };
    return IvyVisitor;
}(visitor_1.Visitor));
/**
 * A transformer which operates on ts.SourceFiles and applies changes from an `IvyCompilation`.
 */
function transformIvySourceFile(compilation, context, reflector, coreImportsFrom, file) {
    var importManager = new translator_1.ImportManager(coreImportsFrom !== null);
    // Recursively scan through the AST and perform any updates requested by the IvyCompilation.
    var sf = visitor_1.visit(file, new IvyVisitor(compilation, reflector, importManager, coreImportsFrom !== null), context);
    // Generate the import statements to prepend.
    var imports = importManager.getAllImports(file.fileName, coreImportsFrom).map(function (i) {
        return ts.createImportDeclaration(undefined, undefined, ts.createImportClause(undefined, ts.createNamespaceImport(ts.createIdentifier(i.as))), ts.createLiteral(i.name));
    });
    // Prepend imports if needed.
    if (imports.length > 0) {
        sf.statements = ts.createNodeArray(imports.concat(sf.statements));
    }
    return sf;
}
function maybeFilterDecorator(decorators, toRemove) {
    if (decorators === undefined) {
        return undefined;
    }
    var filtered = decorators.filter(function (dec) { return ts.getOriginalNode(dec) !== toRemove; });
    if (filtered.length === 0) {
        return undefined;
    }
    return ts.createNodeArray(filtered);
}
function isFromAngularCore(decorator) {
    return decorator.import !== null && decorator.import.from === '@angular/core';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy90cmFuc2Zvcm0vc3JjL3RyYW5zZm9ybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFHSCwrQkFBaUM7QUFJakMsa0RBQTRFO0FBSTVFLDJDQUFvRjtBQUVwRixJQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBZ0IsQ0FBQztBQUU5Qyw2QkFDSSxXQUEyQixFQUFFLFNBQXlCLEVBQ3RELGVBQXFDO0lBQ3ZDLE9BQU8sVUFBQyxPQUFpQztRQUN2QyxPQUFPLFVBQUMsSUFBbUI7WUFDekIsT0FBTyxzQkFBc0IsQ0FBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEYsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQVJELGtEQVFDO0FBRUQ7SUFBeUIsOEJBQU87SUFDOUIsb0JBQ1ksV0FBMkIsRUFBVSxTQUF5QixFQUM5RCxhQUE0QixFQUFVLE1BQWU7UUFGakUsWUFHRSxpQkFBTyxTQUNSO1FBSFcsaUJBQVcsR0FBWCxXQUFXLENBQWdCO1FBQVUsZUFBUyxHQUFULFNBQVMsQ0FBZ0I7UUFDOUQsbUJBQWEsR0FBYixhQUFhLENBQWU7UUFBVSxZQUFNLEdBQU4sTUFBTSxDQUFTOztJQUVqRSxDQUFDO0lBRUQsMENBQXFCLEdBQXJCLFVBQXNCLElBQXlCO1FBQS9DLGlCQXVDQztRQXJDQyx5RkFBeUY7UUFDekYsMEJBQTBCO1FBQzFCLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdEQsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO1lBQ3JCLHNDQUFzQztZQUN0QyxJQUFNLFlBQVUsR0FB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