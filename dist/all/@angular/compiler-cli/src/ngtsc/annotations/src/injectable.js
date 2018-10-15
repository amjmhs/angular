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
var metadata_1 = require("../../metadata");
var util_1 = require("./util");
/**
 * Adapts the `compileIvyInjectable` compiler for `@Injectable` decorators to the Ivy compiler.
 */
var InjectableDecoratorHandler = /** @class */ (function () {
    function InjectableDecoratorHandler(reflector, isCore) {
        this.reflector = reflector;
        this.isCore = isCore;
    }
    InjectableDecoratorHandler.prototype.detect = function (decorator) {
        var _this = this;
        return decorator.find(function (decorator) { return decorator.name === 'Injectable' && (_this.isCore || util_1.isAngularCore(decorator)); });
    };
    InjectableDecoratorHandler.prototype.analyze = function (node, decorator) {
        return {
            analysis: extractInjectableMetadata(node, decorator, this.reflector, this.isCore),
        };
    };
    InjectableDecoratorHandler.prototype.compile = function (node, analysis) {
        var res = compiler_1.compileInjectable(analysis);
        return {
            name: 'ngInjectableDef',
            initializer: res.expression,
            statements: [],
            type: res.type,
        };
    };
    return InjectableDecoratorHandler;
}());
exports.InjectableDecoratorHandler = InjectableDecoratorHandler;
/**
 * Read metadata from the `@Injectable` decorator and produce the `IvyInjectableMetadata`, the input
 * metadata needed to run `compileIvyInjectable`.
 */
function extractInjectableMetadata(clazz, decorator, reflector, isCore) {
    if (clazz.name === undefined) {
        throw new Error("@Injectables must have names");
    }
    var name = clazz.name.text;
    var type = new compiler_1.WrappedNodeExpr(clazz.name);
    if (decorator.args === null) {
        throw new Error("@Injectable must be called");
    }
    if (decorator.args.length === 0) {
        return {
            name: name,
            type: type,
            providedIn: new compiler_1.LiteralExpr(null),
            deps: util_1.getConstructorDependencies(clazz, reflector, isCore),
        };
    }
    else if (decorator.args.length === 1) {
        var metaNode = decorator.args[0];
        // Firstly make sure the decorator argument is an inline literal - if not, it's illegal to
        // transport references from one location to another. This is the problem that lowering
        // used to solve - if this restriction proves too undesirable we can re-implement lowering.
        if (!ts.isObjectLiteralExpression(metaNode)) {
            throw new Error("In Ivy, decorator metadata must be inline.");
        }
        // Resolve the fields of the literal into a map of field name to expression.
        var meta = metadata_1.reflectObjectLiteral(metaNode);
        var providedIn = new compiler_1.LiteralExpr(null);
        if (meta.has('providedIn')) {
            providedIn = new compiler_1.WrappedNodeExpr(meta.get('providedIn'));
        }
        if (meta.has('useValue')) {
            return { name: name, type: type, providedIn: providedIn, useValue: new compiler_1.WrappedNodeExpr(meta.get('useValue')) };
        }
        else if (meta.has('useExisting')) {
            return { name: name, type: type, providedIn: providedIn, useExisting: new compiler_1.WrappedNodeExpr(meta.get('useExisting')) };
        }
        else if (meta.has('useClass')) {
            return { name: name, type: type, providedIn: providedIn, useClass: new compiler_1.WrappedNodeExpr(meta.get('useClass')) };
        }
        else if (meta.has('useFactory')) {
            // useFactory is special - the 'deps' property must be analyzed.
            var factory = new compiler_1.WrappedNodeExpr(meta.get('useFactory'));
            var deps = [];
            if (meta.has('deps')) {
                var depsExpr = meta.get('deps');
                if (!ts.isArrayLiteralExpression(depsExpr)) {
                    throw new Error("In Ivy, deps metadata must be inline.");
                }
                if (depsExpr.elements.length > 0) {
                    throw new Error("deps not yet supported");
                }
                deps.push.apply(deps, depsExpr.elements.map(function (dep) { return getDep(dep, reflector); }));
            }
            return { name: name, type: type, providedIn: providedIn, useFactory: factory, deps: deps };
        }
        else {
            var deps = util_1.getConstructorDependencies(clazz, reflector, isCore);
            return { name: name, type: type, providedIn: providedIn, deps: deps };
        }
    }
    else {
        throw new Error("Too many arguments to @Injectable");
    }
}
function getDep(dep, reflector) {
    var meta = {
        token: new compiler_1.WrappedNodeExpr(dep),
        host: false,
        resolved: compiler_1.R3ResolvedDependencyType.Token,
        optional: false,
        self: false,
        skipSelf: false,
    };
    function maybeUpdateDecorator(dec, reflector, token) {
        var source = reflector.getImportOfIdentifier(dec);
        if (source === null || source.from !== '@angular/core') {
            return;
        }
        switch (source.name) {
            case 'Inject':
                if (token !== undefined) {
                    meta.token = new compiler_1.WrappedNodeExpr(token);
                }
                break;
            case 'Optional':
                meta.optional = true;
                break;
            case 'SkipSelf':
                meta.skipSelf = true;
                break;
            case 'Self':
                meta.self = true;
                break;
        }
    }
    if (ts.isArrayLiteralExpression(dep)) {
        dep.elements.forEach(function (el) {
            if (ts.isIdentifier(el)) {
                maybeUpdateDecorator(el, reflector);
            }
            else if (ts.isNewExpression(el) && ts.isIdentifier(el.expression)) {
                var token = el.arguments && el.arguments.length > 0 && el.arguments[0] || undefined;
                maybeUpdateDecorator(el.expression, reflector, token);
            }
        });
    }
    return meta;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0YWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvYW5ub3RhdGlvbnMvc3JjL2luamVjdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBNEw7QUFDNUwsK0JBQWlDO0FBR2pDLDJDQUFvRDtBQUdwRCwrQkFBaUU7QUFHakU7O0dBRUc7QUFDSDtJQUNFLG9DQUFvQixTQUF5QixFQUFVLE1BQWU7UUFBbEQsY0FBUyxHQUFULFNBQVMsQ0FBZ0I7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFTO0lBQUcsQ0FBQztJQUUxRSwyQ0FBTSxHQUFOLFVBQU8sU0FBc0I7UUFBN0IsaUJBR0M7UUFGQyxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQ2pCLFVBQUEsU0FBUyxJQUFJLE9BQUEsU0FBUyxDQUFDLElBQUksS0FBSyxZQUFZLElBQUksQ0FBQyxLQUFJLENBQUMsTUFBTSxJQUFJLG9CQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBNUUsQ0FBNEUsQ0FBQyxDQUFDO0lBQ2pHLENBQUM7SUFFRCw0Q0FBTyxHQUFQLFVBQVEsSUFBeUIsRUFBRSxTQUFvQjtRQUNyRCxPQUFPO1lBQ0wsUUFBUSxFQUFFLHlCQUF5QixDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQ2xGLENBQUM7SUFDSixDQUFDO0lBRUQsNENBQU8sR0FBUCxVQUFRLElBQXlCLEVBQUUsUUFBOEI7UUFDL0QsSUFBTSxHQUFHLEdBQUcsNEJBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0MsT0FBTztZQUNMLElBQUksRUFBRSxpQkFBaUI7WUFDdkIsV0FBVyxFQUFFLEdBQUcsQ0FBQyxVQUFVO1lBQzNCLFVBQVUsRUFBRSxFQUFFO1lBQ2QsSUFBSSxFQUFFLEdB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