"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compile_metadata_1 = require("./compile_metadata");
var identifiers_1 = require("./identifiers");
var o = require("./output/output_ast");
var value_util_1 = require("./output/value_util");
function mapEntry(key, value) {
    return { key: key, value: value, quoted: false };
}
var InjectableCompiler = /** @class */ (function () {
    function InjectableCompiler(reflector, alwaysGenerateDef) {
        this.reflector = reflector;
        this.alwaysGenerateDef = alwaysGenerateDef;
        this.tokenInjector = reflector.resolveExternalReference(identifiers_1.Identifiers.Injector);
    }
    InjectableCompiler.prototype.depsArray = function (deps, ctx) {
        var _this = this;
        return deps.map(function (dep) {
            var token = dep;
            var args = [token];
            var flags = 0 /* Default */;
            if (Array.isArray(dep)) {
                for (var i = 0; i < dep.length; i++) {
                    var v = dep[i];
                    if (v) {
                        if (v.ngMetadataName === 'Optional') {
                            flags |= 8 /* Optional */;
                        }
                        else if (v.ngMetadataName === 'SkipSelf') {
                            flags |= 4 /* SkipSelf */;
                        }
                        else if (v.ngMetadataName === 'Self') {
                            flags |= 2 /* Self */;
                        }
                        else if (v.ngMetadataName === 'Inject') {
                            token = v.token;
                        }
                        else {
                            token = v;
                        }
                    }
                }
            }
            var tokenExpr;
            if (typeof token === 'string') {
                tokenExpr = o.literal(token);
            }
            else if (token === _this.tokenInjector) {
                tokenExpr = o.importExpr(identifiers_1.Identifiers.INJECTOR);
            }
            else {
                tokenExpr = ctx.importExpr(token);
            }
            if (flags !== 0 /* Default */) {
                args = [tokenExpr, o.literal(flags)];
            }
            else {
                args = [tokenExpr];
            }
            return o.importExpr(identifiers_1.Identifiers.inject).callFn(args);
        });
    };
    InjectableCompiler.prototype.factoryFor = function (injectable, ctx) {
        var retValue;
        if (injectable.useExisting) {
            retValue = o.importExpr(identifiers_1.Identifiers.inject).callFn([ctx.importExpr(injectable.useExisting)]);
        }
        else if (injectable.useFactory) {
            var deps = injectable.deps || [];
            if (deps.length > 0) {
                retValue = ctx.importExpr(injectable.useFactory).callFn(this.depsArray(deps, ctx));
            }
            else {
                return ctx.importExpr(injectable.useFactory);
            }
        }
        else if (injectable.useValue) {
            retValue = value_util_1.convertValueToOutputAst(ctx, injectable.useValue);
        }
        else {
            var clazz = injectable.useClass || injectable.symbol;
            var depArgs = this.depsArray(this.reflector.parameters(clazz), ctx);
            retValue = new o.InstantiateExpr(ctx.importExpr(clazz), depArgs);
        }
        return o.fn([], [new o.ReturnStatement(retValue)], undefined, undefined, injectable.symbol.name + '_Factory');
    };
    InjectableCompiler.prototype.injectableDef = function (injectable, ctx) {
        var providedIn = o.NULL_EXPR;
        if (injectable.providedIn !== undefined) {
            if (injectable.providedIn === null) {
                providedIn = o.NULL_EXPR;
            }
            else if (typeof injectable.providedIn === 'string') {
                providedIn = o.literal(injectable.providedIn);
            }
            else {
                providedIn = ctx.importExpr(injectable.providedIn);
            }
        }
        var def = [
            mapEntry('factory', this.factoryFor(injectable, ctx)),
            mapEntry('token', ctx.importExpr(injectable.type.reference)),
            mapEntry('providedIn', providedIn),
        ];
        return o.importExpr(identifiers_1.Identifiers.defineInjectable).callFn([o.literalMap(def)]);
    };
    InjectableCompiler.prototype.compile = function (injectable, ctx) {
        if (this.alwaysGenerateDef || injectable.providedIn !== undefined) {
            var className = compile_metadata_1.identifierName(injectable.type);
            var clazz = new o.ClassStmt(className, null, [
                new o.ClassField('ngInjectableDef', o.INFERRED_TYPE, [o.StmtModifier.Static], this.injectableDef(injectable, ctx)),
            ], [], new o.ClassMethod(null, [], []), []);
            ctx.statements.push(clazz);
        }
    };
    return InjectableCompiler;
}());
exports.InjectableCompiler = InjectableCompiler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0YWJsZV9jb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9pbmplY3RhYmxlX2NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsdURBQStIO0FBRy9ILDZDQUEwQztBQUMxQyx1Q0FBeUM7QUFDekMsa0RBQTREO0FBYTVELGtCQUFrQixHQUFXLEVBQUUsS0FBbUI7SUFDaEQsT0FBTyxFQUFDLEdBQUcsS0FBQSxFQUFFLEtBQUssT0FBQSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQztBQUNyQyxDQUFDO0FBRUQ7SUFFRSw0QkFBb0IsU0FBMkIsRUFBVSxpQkFBMEI7UUFBL0QsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFBVSxzQkFBaUIsR0FBakIsaUJBQWlCLENBQVM7UUFDakYsSUFBSSxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUMsd0JBQXdCLENBQUMseUJBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBRU8sc0NBQVMsR0FBakIsVUFBa0IsSUFBVyxFQUFFLEdBQWtCO1FBQWpELGlCQXdDQztRQXZDQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHO1lBQ2pCLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQztZQUNoQixJQUFJLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25CLElBQUksS0FBSyxrQkFBbUMsQ0FBQztZQUM3QyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3RCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNuQyxJQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pCLElBQUksQ0FBQyxF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