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
import { StaticSymbol } from '../aot/static_symbol';
import { tokenReference } from '../compile_metadata';
import { Identifiers } from '../identifiers';
import * as o from '../output/output_ast';
import { Identifiers as R3 } from '../render3/r3_identifiers';
import { unsupported } from './view/util';
/**
 * Metadata required by the factory generator to generate a `factory` function for a type.
 * @record
 */
export function R3FactoryMetadata() { }
/**
 * String name of the type being generated (used to name the factory function).
 * @type {?}
 */
R3FactoryMetadata.prototype.name;
/**
 * An expression representing the function (or constructor) which will instantiate the requested
 * type.
 *
 * This could be a reference to a constructor type, or to a user-defined factory function. The
 * `useNew` property determines whether it will be called as a constructor or not.
 * @type {?}
 */
R3FactoryMetadata.prototype.fnOrClass;
/**
 * Regardless of whether `fnOrClass` is a constructor function or a user-defined factory, it
 * may have 0 or more parameters, which will be injected according to the `R3DependencyMetadata`
 * for those parameters.
 * @type {?}
 */
R3FactoryMetadata.prototype.deps;
/**
 * Whether to interpret `fnOrClass` as a constructor function (`useNew: true`) or as a factory
 * (`useNew: false`).
 * @type {?}
 */
R3FactoryMetadata.prototype.useNew;
/**
 * An expression for the function which will be used to inject dependencies. The API of this
 * function could be different, and other options control how it will be invoked.
 * @type {?}
 */
R3FactoryMetadata.prototype.injectFn;
/** @enum {number} */
var R3ResolvedDependencyType = {
    /**
       * A normal token dependency.
       */
    Token: 0,
    /**
       * The dependency is for an attribute.
       *
       * The token expression is a string representing the attribute name.
       */
    Attribute: 1,
    /**
       * The dependency is for the `Injector` type itself.
       */
    Injector: 2,
    /**
       * The dependency is for `ElementRef`.
       */
    ElementRef: 3,
    /**
       * The dependency is for `TemplateRef`.
       */
    TemplateRef: 4,
    /**
       * The dependency is for `ViewContainerRef`.
       */
    ViewContainerRef: 5,
    /**
       * The dependency is for `ChangeDetectorRef`.
       */
    ChangeDetectorRef: 6,
};
export { R3ResolvedDependencyType };
R3ResolvedDependencyType[R3ResolvedDependencyType.Token] = 'Token';
R3ResolvedDependencyType[R3ResolvedDependencyType.Attribute] = 'Attribute';
R3ResolvedDependencyType[R3ResolvedDependencyType.Injector] = 'Injector';
R3ResolvedDependencyType[R3ResolvedDependencyType.ElementRef] = 'ElementRef';
R3ResolvedDependencyType[R3ResolvedDependencyType.TemplateRef] = 'TemplateRef';
R3ResolvedDependencyType[R3ResolvedDependencyType.ViewContainerRef] = 'ViewContainerRef';
R3ResolvedDependencyType[R3ResolvedDependencyType.ChangeDetectorRef] = 'ChangeDetectorRef';
/**
 * Metadata representing a single dependency to be injected into a constructor or function call.
 * @record
 */
export function R3DependencyMetadata() { }
/**
 * An expression representing the token or value to be injected.
 * @type {?}
 */
R3DependencyMetadata.prototype.token;
/**
 * An enum indicating whether this dependency has special meaning to Angular and needs to be
 * injected specially.
 * @type {?}
 */
R3DependencyMetadata.prototype.resolved;
/**
 * Whether the dependency has an \@Host qualifier.
 * @type {?}
 */
R3DependencyMetadata.prototype.host;
/**
 * Whether the dependency has an \@Optional qualifier.
 * @type {?}
 */
R3DependencyMetadata.prototype.optional;
/**
 * Whether the dependency has an \@Self qualifier.
 * @type {?}
 */
R3DependencyMetadata.prototype.self;
/**
 * Whether the dependency has an \@SkipSelf qualifier.
 * @type {?}
 */
R3DependencyMetadata.prototype.skipSelf;
/**
 * Construct a factory function expression for the given `R3FactoryMetadata`.
 * @param {?} meta
 * @return {?}
 */
export function compileFactoryFunction(meta) {
    /** @type {?} */
    var args = meta.deps.map(function (dep) { return compileInjectDependency(dep, meta.injectFn); });
    /** @type {?} */
    var expr = meta.useNew ? new o.InstantiateExpr(meta.fnOrClass, args) :
        new o.InvokeFunctionExpr(meta.fnOrClass, args);
    return o.fn([], [new o.ReturnStatement(expr)], o.INFERRED_TYPE, undefined, meta.name + "_Factory");
}
/**
 * @param {?} dep
 * @param {?} injectFn
 * @return {?}
 */
function compileInjectDependency(dep, injectFn) {
    // Interpret the dependency according to its resolved type.
    switch (dep.resolved) {
        case R3ResolvedDependencyType.Token:
        case R3ResolvedDependencyType.Injector: {
            /** @type {?} */
            var flags = 0 /* Default */ | (dep.self ? 2 /* Self */ : 0) |
                (dep.skipSelf ? 4 /* SkipSelf */ : 0) | (dep.host ? 1 /* Host */ : 0) |
                (dep.optional ? 8 /* Optional */ : 0);
            /** @type {?} */
            var token = dep.token;
            if (dep.resolved === R3ResolvedDependencyType.Injector) {
                token = o.importExpr(Identifiers.INJECTOR);
            }
            /** @type {?} */
            var injectArgs = [token];
            // If this dependency is optional or otherwise has non-default flags, then additional
            // parameters describing how to inject the dependency must be passed to the inject function
            // that's being used.
            if (flags !== 0 /* Default */ || dep.optional) {
                injectArgs.push(o.literal(flags));
            }
            return o.importExpr(injectFn).callFn(injectArgs);
        }
        case R3ResolvedDependencyType.Attribute:
            // In the case of attributes, the attribute name in question is given as the token.
            return o.importExpr(R3.injectAttribute).callFn([dep.token]);
        case R3ResolvedDependencyType.ElementRef:
            return o.importExpr(R3.injectElementRef).callFn([]);
        case R3ResolvedDependencyType.TemplateRef:
            return o.importExpr(R3.injectTemplateRef).callFn([]);
        case R3ResolvedDependencyType.ViewContainerRef:
            return o.importExpr(R3.injectViewContainerRef).callFn([]);
        case R3ResolvedDependencyType.ChangeDetectorRef:
            return o.importExpr(R3.injectChangeDetectorRef).callFn([]);
        default:
            return unsupported("Unknown R3ResolvedDependencyType: " + R3ResolvedDependencyType[dep.resolved]);
    }
}
/**
 * A helper function useful for extracting `R3DependencyMetadata` from a Render2
 * `CompileTypeMetadata` instance.
 * @param {?} type
 * @param {?} outputCtx
 * @param {?} reflector
 * @return {?}
 */
export function dependenciesFromGlobalMetadata(type, outputCtx, reflector) {
    /** @type {?} */
    var elementRef = reflector.resolveExternalReference(Identifiers.ElementRef);
    /** @type {?} */
    var templateRef = reflector.resolveExternalReference(Identifiers.TemplateRef);
    /** @type {?} */
    var viewContainerRef = reflector.resolveExternalReference(Identifiers.ViewContainerRef);
    /** @type {?} */
    var injectorRef = reflector.resolveExternalReference(Identifiers.Injector);
    /** @type {?} */
    var deps = [];
    for (var _i = 0, _a = type.diDeps; _i < _a.length; _i++) {
        var dependency = _a[_i];
        if (dependency.token) {
            /** @type {?} */
            var tokenRef = tokenReference(dependency.token);
            /** @type {?} */
            var resolved = R3ResolvedDependencyType.Token;
            if (tokenRef === elementRef) {
                resolved = R3ResolvedDependencyType.ElementRef;
            }
            else if (tokenRef === templateRef) {
                resolved = R3ResolvedDependencyType.TemplateRef;
            }
            else if (tokenRef === viewContainerRef) {
                resolved = R3ResolvedDependencyType.ViewContainerRef;
            }
            else if (tokenRef === injectorRef) {
                resolved = R3ResolvedDependencyType.Injector;
            }
            else if (dependency.isAttribute) {
                resolved = R3ResolvedDependencyType.Attribute;
            }
            /** @type {?} */
            var token = tokenRef instanceof StaticSymbol ? outputCtx.importExpr(tokenRef) : o.literal(tokenRef);
            // Construct the dependency.
            deps.push({
                token: token,
                resolved: resolved,
                host: !!dependency.isHost,
                optional: !!dependency.isOptional,
                self: !!dependency.isSelf,
                skipSelf: !!dependency.isSkipSelf,
            });
        }
        else {
            unsupported('dependency without a token');
        }
    }
    return deps;
}
//# sourceMappingURL=r3_factory.js.map