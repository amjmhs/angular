"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var reflection_1 = require("../reflection/reflection");
var type_1 = require("../type");
var forward_ref_1 = require("./forward_ref");
var injection_token_1 = require("./injection_token");
var metadata_1 = require("./metadata");
var reflective_errors_1 = require("./reflective_errors");
var reflective_key_1 = require("./reflective_key");
/**
 * `Dependency` is used by the framework to extend DI.
 * This is internal to Angular and should not be used directly.
 */
var ReflectiveDependency = /** @class */ (function () {
    function ReflectiveDependency(key, optional, visibility) {
        this.key = key;
        this.optional = optional;
        this.visibility = visibility;
    }
    ReflectiveDependency.fromKey = function (key) {
        return new ReflectiveDependency(key, false, null);
    };
    return ReflectiveDependency;
}());
exports.ReflectiveDependency = ReflectiveDependency;
var _EMPTY_LIST = [];
var ResolvedReflectiveProvider_ = /** @class */ (function () {
    function ResolvedReflectiveProvider_(key, resolvedFactories, multiProvider) {
        this.key = key;
        this.resolvedFactories = resolvedFactories;
        this.multiProvider = multiProvider;
        this.resolvedFactory = this.resolvedFactories[0];
    }
    return ResolvedReflectiveProvider_;
}());
exports.ResolvedReflectiveProvider_ = ResolvedReflectiveProvider_;
/**
 * An internal resolved representation of a factory function created by resolving `Provider`.
 * @experimental
 */
var ResolvedReflectiveFactory = /** @class */ (function () {
    function ResolvedReflectiveFactory(
    /**
     * Factory function which can return an instance of an object represented by a key.
     */
    factory, 
    /**
     * Arguments (dependencies) to the `factory` function.
     */
    dependencies) {
        this.factory = factory;
        this.dependencies = dependencies;
    }
    return ResolvedReflectiveFactory;
}());
exports.ResolvedReflectiveFactory = ResolvedReflectiveFactory;
/**
 * Resolve a single provider.
 */
function resolveReflectiveFactory(provider) {
    var factoryFn;
    var resolvedDeps;
    if (provider.useClass) {
        var useClass = forward_ref_1.resolveForwardRef(provider.useClass);
        factoryFn = reflection_1.reflector.factory(useClass);
        resolvedDeps = _dependenciesFor(useClass);
    }
    else if (provider.useExisting) {
        factoryFn = function (aliasInstance) { return aliasInstance; };
        resolvedDeps = [ReflectiveDependency.fromKey(reflective_key_1.ReflectiveKey.get(provider.useExisting))];
    }
    else if (provider.useFactory) {
        factoryFn = provider.useFactory;
        resolvedDeps = constructDependencies(provider.useFactory, provider.deps);
    }
    else {
        factoryFn = function () { return provider.useValue; };
        resolvedDeps = _EMPTY_LIST;
    }
    return new ResolvedReflectiveFactory(factoryFn, resolvedDeps);
}
/**
 * Converts the `Provider` into `ResolvedProvider`.
 *
 * `Injector` internally only uses `ResolvedProvider`, `Provider` contains convenience provider
 * syntax.
 */
function resolveReflectiveProvider(provider) {
    return new ResolvedReflectiveProvider_(reflective_key_1.ReflectiveKey.get(provider.provide), [resolveReflectiveFactory(provider)], provider.multi || false);
}
/**
 * Resolve a list of Providers.
 */
function resolveReflectiveProviders(providers) {
    var normalized = _normalizeProviders(providers, []);
    var resolved = normalized.map(resolveReflectiveProvider);
    var resolvedProviderMap = mergeResolvedReflectiveProviders(resolved, new Map());
    return Array.from(resolvedProviderMap.values());
}
exports.resolveReflectiveProviders = resolveReflectiveProviders;
/**
 * Merges a list of ResolvedProviders into a list where each key is contained exactly once and
 * multi providers have been merged.
 */
function mergeResolvedReflectiveProviders(providers, normalizedProvidersMap) {
    for (var i = 0; i < providers.length; i++) {
        var provider = providers[i];
        var existing = normalizedProvidersMap.get(provider.key.id);
        if (existing) {
            if (provider.multiProvider !== existing.multiProvider) {
                throw reflective_errors_1.mixingMultiProvidersWithRegularProvidersError(existing, provider);
            }
            if (provider.multiProvider) {
                for (var j = 0; j < provider.resolvedFactories.length; j++) {
                    existing.resolvedFactories.push(provider.resolvedFactories[j]);
                }
            }
            else {
                normalizedProvidersMap.set(provider.key.id, provider);
            }
        }
        else {
            var resolvedProvider = void 0;
            if (provider.multiProvider) {
                resolvedProvider = new ResolvedReflectiveProvider_(provider.key, provider.resolvedFactories.slice(), provider.multiProvider);
            }
            else {
                resolvedProvider = provider;
            }
            normalizedProvidersMap.set(provider.key.id, resolvedProvider);
        }
    }
    return normalizedProvidersMap;
}
exports.mergeResolvedReflectiveProviders = mergeResolvedReflectiveProviders;
function _normalizeProviders(providers, res) {
    providers.forEach(function (b) {
        if (b instanceof type_1.Type) {
            res.push({ provide: b, useClass: b });
        }
        else if (b && typeof b == 'object' && b.provide !== undefined) {
            res.push(b);
        }
        else if (b instanceof Array) {
            _normalizeProviders(b, res);
        }
        else {
            throw reflective_errors_1.invalidProviderError(b);
        }
    });
    return res;
}
function constructDependencies(typeOrFunc, dependencies) {
    if (!dependencies) {
        return _dependenciesFor(typeOrFunc);
    }
    else {
        var params_1 = dependencies.map(function (t) { return [t]; });
        return dependencies.map(function (t) { return _extractToken(typeOrFunc, t, params_1); });
    }
}
exports.constructDependencies = constructDependencies;
function _dependenciesFor(typeOrFunc) {
    var params = reflection_1.reflector.parameters(typeOrFunc);
    if (!params)
        return [];
    if (params.some(function (p) { return p == null; })) {
        throw reflective_errors_1.noAnnotationError(typeOrFunc, params);
    }
    return params.map(function (p) { return _extractToken(typeOrFunc, p, params); });
}
function _extractToken(typeOrFunc, metadata, params) {
    var token = null;
    var optional = false;
    if (!Array.isArray(metadata)) {
        if (metadata instanceof metadata_1.Inject) {
            return _createDependency(metadata.token, optional, null);
        }
        else {
            return _createDependency(metadata, optional, null);
        }
    }
    var visibility = null;
    for (var i = 0; i < metadata.length; ++i) {
        var paramMetadata = metadata[i];
        if (paramMetadata instanceof type_1.Type) {
            token = paramMetadata;
        }
        else if (paramMetadata instanceof metadata_1.Inject) {
            token = paramMetadata.token;
        }
        else if (paramMetadata instanceof metadata_1.Optional) {
            optional = true;
        }
        else if (paramMetadata instanceof metadata_1.Self || paramMetadata instanceof metadata_1.SkipSelf) {
            visibility = paramMetadata;
        }
        else if (paramMetadata instanceof injection_token_1.InjectionToken) {
            token = paramMetadata;
        }
    }
    token = forward_ref_1.resolveForwardRef(token);
    if (token != null) {
        return _createDependency(token, optional, visibility);
    }
    else {
        throw reflective_errors_1.noAnnotationError(typeOrFunc, params);
    }
}
function _createDependency(token, optional, visibility) {
    return new ReflectiveDependency(reflective_key_1.ReflectiveKey.get(token), optional, visibility);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdGl2ZV9wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2RpL3JlZmxlY3RpdmVfcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCx1REFBbUQ7QUFDbkQsZ0NBQTZCO0FBRTdCLDZDQUFnRDtBQUNoRCxxREFBaUQ7QUFDakQsdUNBQTREO0FBRTVELHlEQUEySDtBQUMzSCxtREFBK0M7QUFNL0M7OztHQUdHO0FBQ0g7SUFDRSw4QkFDVyxHQUFrQixFQUFTLFFBQWlCLEVBQVMsVUFBOEI7UUFBbkYsUUFBRyxHQUFILEdBQUcsQ0FBZTtRQUFTLGFBQVEsR0FBUixRQUFRLENBQVM7UUFBUyxlQUFVLEdBQVYsVUFBVSxDQUFvQjtJQUFHLENBQUM7SUFFM0YsNEJBQU8sR0FBZCxVQUFlLEdBQWtCO1FBQy9CLE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFDSCwyQkFBQztBQUFELENBQUMsQUFQRCxJQU9DO0FBUFksb0RBQW9CO0FBU2pDLElBQU0sV0FBVyxHQUFVLEVBQUUsQ0FBQztBQXNDOUI7SUFHRSxxQ0FDVyxHQUFrQixFQUFTLGlCQUE4QyxFQUN6RSxhQUFzQjtRQUR0QixRQUFHLEdBQUgsR0FBRyxDQUFlO1FBQVMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUE2QjtRQUN6RSxrQkFBYSxHQUFiLGFBQWEsQ0FBUztRQUMvQixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBQ0gsa0NBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQVJZLGtFQUEyQjtBQVV4Qzs7O0dBR0c7QUFDSDtJQUNFO0lBQ0k7O09BRUc7SUFDSSxPQUFpQjtJQUV4Qjs7T0FFRztJQUNJLFlB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