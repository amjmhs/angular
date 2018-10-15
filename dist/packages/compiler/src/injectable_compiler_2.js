/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Identifiers } from './identifiers';
import * as o from './output/output_ast';
import { compileFactoryFunction } from './render3/r3_factory';
import { mapToMapExpression } from './render3/util';
/**
 * @record
 */
export function InjectableDef() { }
/** @type {?} */
InjectableDef.prototype.expression;
/** @type {?} */
InjectableDef.prototype.type;
/**
 * @record
 */
export function R3InjectableMetadata() { }
/** @type {?} */
R3InjectableMetadata.prototype.name;
/** @type {?} */
R3InjectableMetadata.prototype.type;
/** @type {?} */
R3InjectableMetadata.prototype.providedIn;
/** @type {?|undefined} */
R3InjectableMetadata.prototype.useClass;
/** @type {?|undefined} */
R3InjectableMetadata.prototype.useFactory;
/** @type {?|undefined} */
R3InjectableMetadata.prototype.useExisting;
/** @type {?|undefined} */
R3InjectableMetadata.prototype.useValue;
/** @type {?|undefined} */
R3InjectableMetadata.prototype.deps;
/**
 * @param {?} meta
 * @return {?}
 */
export function compileInjectable(meta) {
    /** @type {?} */
    let factory = o.NULL_EXPR;
    /**
     * @param {?} ret
     * @return {?}
     */
    function makeFn(ret) {
        return o.fn([], [new o.ReturnStatement(ret)], undefined, undefined, `${meta.name}_Factory`);
    }
    if (meta.useClass !== undefined || meta.useFactory !== undefined) {
        // First, handle useClass and useFactory together, since both involve a similar call to
        // `compileFactoryFunction`. Either dependencies are explicitly specified, in which case
        // a factory function call is generated, or they're not specified and the calls are special-
        // cased.
        if (meta.deps !== undefined) {
            /** @type {?} */
            const fnOrClass = meta.useClass || /** @type {?} */ ((meta.useFactory));
            /** @type {?} */
            const useNew = meta.useClass !== undefined;
            factory = compileFactoryFunction({
                name: meta.name,
                fnOrClass,
                useNew,
                injectFn: Identifiers.inject,
                deps: meta.deps,
            });
        }
        else if (meta.useClass !== undefined) {
            // Special case for useClass where the factory from the class's ngInjectableDef is used.
            if (meta.useClass.isEquivalent(meta.type)) {
                // For the injectable compiler, useClass represents a foreign type that should be
                // instantiated to satisfy construction of the given type. It's not valid to specify
                // useClass === type, since the useClass type is expected to already be compiled.
                throw new Error(`useClass is the same as the type, but no deps specified, which is invalid.`);
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
        factory = makeFn(o.importExpr(Identifiers.inject).callFn([meta.useExisting]));
    }
    else {
        // A strict type is compiled according to useClass semantics, except the dependencies are
        // required.
        if (meta.deps === undefined) {
            throw new Error(`Type compilation of an injectable requires dependencies.`);
        }
        factory = compileFactoryFunction({
            name: meta.name,
            fnOrClass: meta.type,
            useNew: true,
            injectFn: Identifiers.inject,
            deps: meta.deps,
        });
    }
    /** @type {?} */
    const token = meta.type;
    /** @type {?} */
    const providedIn = meta.providedIn;
    /** @type {?} */
    const expression = o.importExpr(Identifiers.defineInjectable).callFn([mapToMapExpression({ token, factory, providedIn })]);
    /** @type {?} */
    const type = new o.ExpressionType(o.importExpr(Identifiers.InjectableDef, [new o.ExpressionType(meta.type)]));
    return {
        expression, type,
    };
}
//# sourceMappingURL=injectable_compiler_2.js.map