"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var identifiers_1 = require("./identifiers");
var o = require("./output/output_ast");
var r3_factory_1 = require("./render3/r3_factory");
var util_1 = require("./render3/util");
function compileInjectable(meta) {
    var factory = o.NULL_EXPR;
    function makeFn(ret) {
        return o.fn([], [new o.ReturnStatement(ret)], undefined, undefined, meta.name + "_Factory");
    }
    if (meta.useClass !== undefined || meta.useFactory !== undefined) {
        // First, handle useClass and useFactory together, since both involve a similar call to
        // `compileFactoryFunction`. Either dependencies are explicitly specified, in which case
        // a factory function call is generated, or they're not specified and the calls are special-
        // cased.
        if (meta.deps !== undefined) {
            // Either call `new meta.useClass(...)` or `meta.useFactory(...)`.
            var fnOrClass = meta.useClass || meta.useFactory;
            // useNew: true if meta.useClass, false for meta.useFactory.
            var useNew = meta.useClass !== undefined;
            factory = r3_factory_1.compileFactoryFunction({
                name: meta.name,
                fnOrClass: fnOrClass,
                useNew: useNew,
                injectFn: identifiers_1.Identifiers.inject,
                deps: meta.deps,
            });
        }
        else if (meta.useClass !== undefined) {
            // Special case for useClass where the factory from the class's ngInjectableDef is used.
            if (meta.useClass.isEquivalent(meta.type)) {
                // For the injectable compiler, useClass represents a foreign type that should be
                // instantiated to satisfy construction of the given type. It's not valid to specify
                // useClass === type, since the useClass type is expected to already be compiled.
                throw new Error("useClass is the same as the type, but no deps specified, which is invalid.");
            }
            factory =
                makeFn(new o.ReadPropExpr(new o.ReadPropExpr(meta.useClass, 'ngInjectableDef'), 'factory')
                    .callFn([]));
        }
        else if (meta.useFactory !== undefined) {
            // Special case for useFactory where no arguments are passed.
            factory = meta.useFactory.callFn([]);
        }
        else {
            // Can't happen - outer conditional guards against both useClass and useFactory being
            // undefined.
            throw new Error('Reached unreachable block in injectable compiler.');
        }
    }
    else if (meta.useValue !== undefined) {
        // Note: it's safe to use `meta.useValue` instead of the `USE_VALUE in meta` check used for
        // client code because meta.useValue is an Expression which will be defined even if the actual
        // value is undefined.
        factory = makeFn(meta.useValue);
    }
    else if (meta.useExisting !== undefined) {
        // useExisting is an `inject` call on the existing token.
        factory = makeFn(o.importExpr(identifiers_1.Identifiers.inject).callFn([meta.useExisting]));
    }
    else {
        // A strict type is compiled according to useClass semantics, except the dependencies are
        // required.
        if (meta.deps === undefined) {
            throw new Error("Type compilation of an injectable requires dependencies.");
        }
        factory = r3_factory_1.compileFactoryFunction({
            name: meta.name,
            fnOrClass: meta.type,
            useNew: true,
            injectFn: identifiers_1.Identifiers.inject,
            deps: meta.deps,
        });
    }
    var token = meta.type;
    var providedIn = meta.providedIn;
    var expression = o.importExpr(identifiers_1.Identifiers.defineInjectable).callFn([util_1.mapToMapExpression({ token: token, factory: factory, providedIn: providedIn })]);
    var type = new o.ExpressionType(o.importExpr(identifiers_1.Identifiers.InjectableDef, [new o.ExpressionType(meta.type)]));
    return {
        expression: expression, type: type,
    };
}
exports.compileInjectable = compileInjectable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0YWJsZV9jb21waWxlcl8yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL2luamVjdGFibGVfY29tcGlsZXJfMi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILDZDQUEwQztBQUMxQyx1Q0FBeUM7QUFDekMsbURBQWtGO0FBQ2xGLHVDQUFrRDtBQWtCbEQsMkJBQWtDLElBQTBCO0lBQzFELElBQUksT0FBTyxHQUFpQixDQUFDLENBQUMsU0FBUyxDQUFDO0lBRXhDLGdCQUFnQixHQUFpQjtRQUMvQixPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBSyxJQUFJLENBQUMsSUFBSSxhQUFVLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBRUQsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRTtRQUNoRSx1RkFBdUY7UUFDdkYsd0ZBQXdGO1FBQ3hGLDRGQUE0RjtRQUM1RixTQUFTO1FBQ1QsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUMzQixrRUFBa0U7WUFDbEUsSUFBTSxTQUFTLEdBQWlCLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFVBQVksQ0FBQztZQUVuRSw0REFBNEQ7WUFDNUQsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUM7WUFFM0MsT0FBTyxHQUFHLG1DQUFzQixDQUFDO2dCQUMvQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsU0FBUyxXQUFBO2dCQUNULE1BQU0sUUFBQTtnQkFDTixRQUFRLEVBQUUseUJBQVcsQ0FBQyxNQUFNO2dCQUM1QixJQUFJLEVB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