"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var static_symbol_1 = require("../aot/static_symbol");
var compile_metadata_1 = require("../compile_metadata");
var identifiers_1 = require("../identifiers");
var o = require("../output/output_ast");
var r3_identifiers_1 = require("../render3/r3_identifiers");
var util_1 = require("./view/util");
/**
 * Resolved type of a dependency.
 *
 * Occasionally, dependencies will have special significance which is known statically. In that
 * case the `R3ResolvedDependencyType` informs the factory generator that a particular dependency
 * should be generated specially (usually by calling a special injection function instead of the
 * standard one).
 */
var R3ResolvedDependencyType;
(function (R3ResolvedDependencyType) {
    /**
     * A normal token dependency.
     */
    R3ResolvedDependencyType[R3ResolvedDependencyType["Token"] = 0] = "Token";
    /**
     * The dependency is for an attribute.
     *
     * The token expression is a string representing the attribute name.
     */
    R3ResolvedDependencyType[R3ResolvedDependencyType["Attribute"] = 1] = "Attribute";
    /**
     * The dependency is for the `Injector` type itself.
     */
    R3ResolvedDependencyType[R3ResolvedDependencyType["Injector"] = 2] = "Injector";
    /**
     * The dependency is for `ElementRef`.
     */
    R3ResolvedDependencyType[R3ResolvedDependencyType["ElementRef"] = 3] = "ElementRef";
    /**
     * The dependency is for `TemplateRef`.
     */
    R3ResolvedDependencyType[R3ResolvedDependencyType["TemplateRef"] = 4] = "TemplateRef";
    /**
     * The dependency is for `ViewContainerRef`.
     */
    R3ResolvedDependencyType[R3ResolvedDependencyType["ViewContainerRef"] = 5] = "ViewContainerRef";
    /**
     * The dependency is for `ChangeDetectorRef`.
     */
    R3ResolvedDependencyType[R3ResolvedDependencyType["ChangeDetectorRef"] = 6] = "ChangeDetectorRef";
})(R3ResolvedDependencyType = exports.R3ResolvedDependencyType || (exports.R3ResolvedDependencyType = {}));
/**
 * Construct a factory function expression for the given `R3FactoryMetadata`.
 */
function compileFactoryFunction(meta) {
    // Each dependency becomes an invocation of an inject*() function.
    var args = meta.deps.map(function (dep) { return compileInjectDependency(dep, meta.injectFn); });
    // The overall result depends on whether this is construction or function invocation.
    var expr = meta.useNew ? new o.InstantiateExpr(meta.fnOrClass, args) :
        new o.InvokeFunctionExpr(meta.fnOrClass, args);
    return o.fn([], [new o.ReturnStatement(expr)], o.INFERRED_TYPE, undefined, meta.name + "_Factory");
}
exports.compileFactoryFunction = compileFactoryFunction;
function compileInjectDependency(dep, injectFn) {
    // Interpret the dependency according to its resolved type.
    switch (dep.resolved) {
        case R3ResolvedDependencyType.Token:
        case R3ResolvedDependencyType.Injector: {
            // Build up the injection flags according to the metadata.
            var flags = 0 /* Default */ | (dep.self ? 2 /* Self */ : 0) |
                (dep.skipSelf ? 4 /* SkipSelf */ : 0) | (dep.host ? 1 /* Host */ : 0) |
                (dep.optional ? 8 /* Optional */ : 0);
            // Determine the token used for injection. In almost all cases this is the given token, but
            // if the dependency is resolved to the `Injector` then the special `INJECTOR` token is used
            // instead.
            var token = dep.token;
            if (dep.resolved === R3ResolvedDependencyType.Injector) {
                token = o.importExpr(identifiers_1.Identifiers.INJECTOR);
            }
            // Build up the arguments to the injectFn call.
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
            return o.importExpr(r3_identifiers_1.Identifiers.injectAttribute).callFn([dep.token]);
        case R3ResolvedDependencyType.ElementRef:
            return o.importExpr(r3_identifiers_1.Identifiers.injectElementRef).callFn([]);
        case R3ResolvedDependencyType.TemplateRef:
            return o.importExpr(r3_identifiers_1.Identifiers.injectTemplateRef).callFn([]);
        case R3ResolvedDependencyType.ViewContainerRef:
            return o.importExpr(r3_identifiers_1.Identifiers.injectViewContainerRef).callFn([]);
        case R3ResolvedDependencyType.ChangeDetectorRef:
            return o.importExpr(r3_identifiers_1.Identifiers.injectChangeDetectorRef).callFn([]);
        default:
            return util_1.unsupported("Unknown R3ResolvedDependencyType: " + R3ResolvedDependencyType[dep.resolved]);
    }
}
/**
 * A helper function useful for extracting `R3DependencyMetadata` from a Render2
 * `CompileTypeMetadata` instance.
 */
function dependenciesFromGlobalMetadata(type, outputCtx, reflector) {
    // Use the `CompileReflector` to look up references to some well-known Angular types. These will
    // be compared with the token to statically determine whether the token has significance to
    // Angular, and set the correct `R3ResolvedDependencyType` as a result.
    var elementRef = reflector.resolveExternalReference(identifiers_1.Identifiers.ElementRef);
    var templateRef = reflector.resolveExternalReference(identifiers_1.Identifiers.TemplateRef);
    var viewContainerRef = reflector.resolveExternalReference(identifiers_1.Identifiers.ViewContainerRef);
    var injectorRef = reflector.resolveExternalReference(identifiers_1.Identifiers.Injector);
    // Iterate through the type's DI dependencies and produce `R3DependencyMetadata` for each of them.
    var deps = [];
    for (var _i = 0, _a = type.diDeps; _i < _a.length; _i++) {
        var dependency = _a[_i];
        if (dependency.token) {
            var tokenRef = compile_metadata_1.tokenReference(dependency.token);
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
            // In the case of most dependencies, the token will be a reference to a type. Sometimes,
            // however, it can be a string, in the case of older Angular code or @Attribute injection.
            var token = tokenRef instanceof static_symbol_1.StaticSymbol ? outputCtx.importExpr(tokenRef) : o.literal(tokenRef);
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
            util_1.unsupported('dependency without a token');
        }
    }
    return deps;
}
exports.dependenciesFromGlobalMetadata = dependenciesFromGlobalMetadata;
//# sourceMappingURL=r3_factory.js.map