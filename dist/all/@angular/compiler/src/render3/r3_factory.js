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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9yZW5kZXIzL3IzX2ZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzREFBa0Q7QUFDbEQsd0RBQXdFO0FBR3hFLDhDQUEyQztBQUMzQyx3Q0FBMEM7QUFDMUMsNERBQTREO0FBRzVELG9DQUF3QztBQXlDeEM7Ozs7Ozs7R0FPRztBQUNILElBQVksd0JBcUNYO0FBckNELFdBQVksd0JBQXdCO0lBQ2xDOztPQUVHO0lBQ0gseUVBQVMsQ0FBQTtJQUVUOzs7O09BSUc7SUFDSCxpRkFBYSxDQUFBO0lBRWI7O09BRUc7SUFDSCwrRUFBWSxDQUFBO0lBRVo7O09BRUc7SUFDSCxtRkFBYyxDQUFBO0lBRWQ7O09BRUc7SUFDSCxxRkFBZSxDQUFBO0lBRWY7O09BRUc7SUFDSCwrRkFBb0IsQ0FBQTtJQUVwQjs7T0FFRztJQUNILGlHQUFxQixDQUFBO0FBQ3ZCLENBQUMsRUFyQ1csd0JBQXdCLEdBQXhCLGdDQUF3QixLQUF4QixnQ0FBd0IsUUFxQ25DO0FBc0NEOztHQUVHO0FBQ0gsZ0NBQXVDLElBQXVCO0lBQzVELGtFQUFrRTtJQUNsRSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLHVCQUF1QixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQTNDLENBQTJDLENBQUMsQ0FBQztJQUUvRSxxRkFBcUY7SUFDckYsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMs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