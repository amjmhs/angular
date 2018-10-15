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
//# sourceMappingURL=injectable_compiler_2.js.map