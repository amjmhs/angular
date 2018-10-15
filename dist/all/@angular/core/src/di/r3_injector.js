"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var forward_ref_1 = require("./forward_ref");
var injection_token_1 = require("./injection_token");
var injector_1 = require("./injector");
var scope_1 = require("./scope");
/**
 * Marker which indicates that a value has not yet been created from the factory function.
 */
var NOT_YET = {};
/**
 * Marker which indicates that the factory function for a token is in the process of being called.
 *
 * If the injector is asked to inject a token with its value set to CIRCULAR, that indicates
 * injection of a dependency has recursively attempted to inject the original token, and there is
 * a circular dependency among the providers.
 */
var CIRCULAR = {};
var EMPTY_ARRAY = [];
/**
 * A lazily initialized NullInjector.
 */
var NULL_INJECTOR = undefined;
function getNullInjector() {
    if (NULL_INJECTOR === undefined) {
        NULL_INJECTOR = new injector_1.NullInjector();
    }
    return NULL_INJECTOR;
}
/**
 * Create a new `Injector` which is configured using a `defType` of `InjectorType<any>`s.
 *
 * @experimental
 */
function createInjector(defType, parent, additionalProviders) {
    if (parent === void 0) { parent = null; }
    if (additionalProviders === void 0) { additionalProviders = null; }
    parent = parent || getNullInjector();
    return new R3Injector(defType, additionalProviders, parent);
}
exports.createInjector = createInjector;
var R3Injector = /** @class */ (function () {
    function R3Injector(def, additionalProviders, parent) {
        var _this = this;
        this.parent = parent;
        /**
         * Map of tokens to records which contain the instances of those tokens.
         */
        this.records = new Map();
        /**
         * The transitive set of `InjectorType`s which define this injector.
         */
        this.injectorDefTypes = new Set();
        /**
         * Set of values instantiated by this injector which contain `ngOnDestroy` lifecycle hooks.
         */
        this.onDestroy = new Set();
        /**
         * Flag indicating that this injector was previously destroyed.
         */
        this.destroyed = false;
        // Start off by creating Records for every provider declared in every InjectorType
        // included transitively in `def`.
        deepForEach([def], function (injectorDef) { return _this.processInjectorType(injectorDef, new Set()); });
        additionalProviders &&
            deepForEach(additionalProviders, function (provider) { return _this.processProvider(provider); });
        // Make sure the INJECTOR token provides this injector.
        this.records.set(injector_1.INJECTOR, makeRecord(undefined, this));
        // Detect whether this injector has the APP_ROOT_SCOPE token and thus should provide
        // any injectable scoped to APP_ROOT_SCOPE.
        this.isRootInjector = this.records.has(scope_1.APP_ROOT);
        // Eagerly instantiate the InjectorType classes themselves.
        this.injectorDefTypes.forEach(function (defType) { return _this.get(defType); });
    }
    /**
     * Destroy the injector and release references to every instance or provider associated with it.
     *
     * Also calls the `OnDestroy` lifecycle hooks of every instance that was created for which a
     * hook was found.
     */
    R3Injector.prototype.destroy = function () {
        this.assertNotDestroyed();
        // Set destroyed = true first, in case lifecycle hooks re-enter destroy().
        this.destroyed = true;
        try {
            // Call all the lifecycle hooks.
            this.onDestroy.forEach(function (service) { return service.ngOnDestroy(); });
        }
        finally {
            // Release all references.
            this.records.clear();
            this.onDestroy.clear();
            this.injectorDefTypes.clear();
        }
    };
    R3Injector.prototype.get = function (token, notFoundValue, flags) {
        if (notFoundValue === void 0) { notFoundValue = injector_1.THROW_IF_NOT_FOUND; }
        if (flags === void 0) { flags = 0 /* Default */; }
        this.assertNotDestroyed();
        // Set the injection context.
        var previousInjector = injector_1.setCurrentInjector(this);
        try {
            // Check for the SkipSelf flag.
            if (!(flags & 4 /* SkipSelf */)) {
                // SkipSelf isn't set, check if the record belongs to this injector.
                var record = this.records.get(token);
                if (record === undefined) {
                    // No record, but maybe the token is scoped to this injector. Look for an ngInjectableDef
                    // with a scope matching this injector.
                    var def = couldBeInjectableType(token) &&
                        token.ngInjectableDef ||
                        undefined;
                    if (def !== undefined && this.injectableDefInScope(def)) {
                        // Found an ngInjectableDef and it's scoped to this injector. Pretend as if it was here
                        // all along.
                        record = injectableDefRecord(token);
                        this.records.set(token, record);
                    }
                }
                // If a record was found, get the instance for it and return it.
                if (record !== undefined) {
                    return this.hydrate(token, record);
                }
            }
            // Select the next injector based on the Self flag - if self is set, the next injector is
            // the NullInjector, otherwise it's the parent.
            var next = !(flags & 2 /* Self */) ? this.parent : getNullInjector();
            return this.parent.get(token, notFoundValue);
        }
        finally {
            // Lastly, clean up the state by restoring the previous injector.
            injector_1.setCurrentInjector(previousInjector);
        }
    };
    R3Injector.prototype.assertNotDestroyed = function () {
        if (this.destroyed) {
            throw new Error('Injector has already been destroyed.');
        }
    };
    /**
     * Add an `InjectorType` or `InjectorDefTypeWithProviders` and all of its transitive providers
     * to this injector.
     */
    R3Injector.prototype.processInjectorType = function (defOrWrappedDef, parents) {
        var _this = this;
        defOrWrappedDef = forward_ref_1.resolveForwardRef(defOrWrappedDef);
        // Either the defOrWrappedDef is an InjectorType (with ngInjectorDef) or an
        // InjectorDefTypeWithProviders (aka ModuleWithProviders). Detecting either is a megamorphic
        // read, so care is taken to only do the read once.
        // First attempt to read the ngInjectorDef.
        var def = defOrWrappedDef.ngInjectorDef;
        // If that's not present, then attempt to read ngModule from the InjectorDefTypeWithProviders.
        var ngModule = (def == null) && defOrWrappedDef.ngModule || undefined;
        // Determine the InjectorType. In the case where `defOrWrappedDef` is an `InjectorType`,
        // then this is easy. In the case of an InjectorDefTypeWithProviders, then the definition type
        // is the `ngModule`.
        var defType = (ngModule === undefined) ? defOrWrappedDef : ngModule;
        // If defOrWrappedType was an InjectorDefTypeWithProviders, then .providers may hold some
        // extra providers.
        var providers = (ngModule !== undefined) && defOrWrappedDef.providers ||
            EMPTY_ARRAY;
        // Finally, if defOrWrappedType was an `InjectorDefTypeWithProviders`, then the actual
        // `InjectorDef` is on its `ngModule`.
        if (ngModule !== undefined) {
            def = ngModule.ngInjectorDef;
        }
        // If no definition was found, it might be from exports. Remove it.
        if (def == null) {
            return;
        }
        // Check for circular dependencies.
        if (parents.has(defType)) {
            throw new Error("Circular dependency: type " + util_1.stringify(defType) + " ends up importing itself.");
        }
        // Track the InjectorType and add a provider for it.
        this.injectorDefTypes.add(defType);
        this.records.set(defType, makeRecord(def.factory));
        // Add providers in the same way that @NgModule resolution did:
        // First, include providers from any imports.
        if (def.imports != null) {
            // Before processing defType's imports, add it to the set of parents. This way, if it ends
            // up deeply importing itself, this can be detected.
            parents.add(defType);
            try {
                deepForEach(def.imports, function (imported) { return _this.processInjectorType(imported, parents); });
            }
            finally {
                // Remove it from the parents set when finished.
                parents.delete(defType);
            }
        }
        // Next, include providers listed on the definition itself.
        if (def.providers != null) {
            deepForEach(def.providers, function (provider) { return _this.processProvider(provider); });
        }
        // Finally, include providers from an InjectorDefTypeWithProviders if there was one.
        deepForEach(providers, function (provider) { return _this.processProvider(provider); });
    };
    /**
     * Process a `SingleProvider` and add it.
     */
    R3Injector.prototype.processProvider = function (provider) {
        // Determine the token from the provider. Either it's its own token, or has a {provide: ...}
        // property.
        provider = forward_ref_1.resolveForwardRef(provider);
        var token = isTypeProvider(provider) ? provider : forward_ref_1.resolveForwardRef(provider.provide);
        // Construct a `Record` for the provider.
        var record = providerToRecord(provider);
        if (!isTypeProvider(provider) && provider.multi === true) {
            // If the provider indicates that it's a multi-provider, process it specially.
            // First check whether it's been defined already.
            var multiRecord_1 = this.records.get(token);
            if (multiRecord_1) {
                // It has. Throw a nice error if
                if (multiRecord_1.multi === undefined) {
                    throw new Error("Mixed multi-provider for " + token + ".");
                }
            }
            else {
                multiRecord_1 = makeRecord(undefined, NOT_YET, true);
                multiRecord_1.factory = function () { return injector_1.injectArgs(multiRecord_1.multi); };
                this.records.set(token, multiRecord_1);
            }
            token = provider;
            multiRecord_1.multi.push(provider);
        }
        else {
            var existing = this.records.get(token);
            if (existing && existing.multi !== undefined) {
                throw new Error("Mixed multi-provider for " + util_1.stringify(token));
            }
        }
        this.records.set(token, record);
    };
    R3Injector.prototype.hydrate = function (token, record) {
        if (record.value === CIRCULAR) {
            throw new Error("Circular dep for " + util_1.stringify(token));
        }
        else if (record.value === NOT_YET) {
            record.value = CIRCULAR;
            record.value = record.factory();
        }
        if (typeof record.value === 'object' && record.value && hasOnDestroy(record.value)) {
            this.onDestroy.add(record.value);
        }
        return record.value;
    };
    R3Injector.prototype.injectableDefInScope = function (def) {
        if (!def.providedIn) {
            return false;
        }
        else if (typeof def.providedIn === 'string') {
            return def.providedIn === 'any' || (def.providedIn === 'root' && this.isRootInjector);
        }
        else {
            return this.injectorDefTypes.has(def.providedIn);
        }
    };
    return R3Injector;
}());
exports.R3Injector = R3Injector;
function injectableDefRecord(token) {
    var def = token.ngInjectableDef;
    if (def === undefined) {
        if (token instanceof injection_token_1.InjectionToken) {
            throw new Error("Token " + util_1.stringify(token) + " is missing an ngInjectableDef definition.");
        }
        // TODO(alxhub): there should probably be a strict mode which throws here instead of assuming a
        // no-args constructor.
        return makeRecord(function () { return new token(); });
    }
    return makeRecord(def.factory);
}
function providerToRecord(provider) {
    var token = forward_ref_1.resolveForwardRef(provider);
    var value = NOT_YET;
    var factory = undefined;
    if (isTypeProvider(provider)) {
        return injectableDefRecord(provider);
    }
    else {
        token = forward_ref_1.resolveForwardRef(provider.provide);
        if (isValueProvider(provider)) {
            value = provider.useValue;
        }
        else if (isExistingProvider(provider)) {
            factory = function () { return injector_1.inject(provider.useExisting); };
        }
        else if (isFactoryProvider(provider)) {
            factory = function () { return provider.useFactory.apply(provider, injector_1.injectArgs(provider.deps || [])); };
        }
        else {
            var classRef_1 = provider.useClass || token;
            if (hasDeps(provider)) {
                factory = function () { return new ((classRef_1).bind.apply((classRef_1), [void 0].concat(injector_1.injectArgs(provider.deps))))(); };
            }
            else {
                return injectableDefRecord(classRef_1);
            }
        }
    }
    return makeRecord(factory, value);
}
function makeRecord(factory, value, multi) {
    if (value === void 0) { value = NOT_YET; }
    if (multi === void 0) { multi = false; }
    return {
        factory: factory,
        value: value,
        multi: multi ? [] : undefined,
    };
}
function deepForEach(input, fn) {
    input.forEach(function (value) { return Array.isArray(value) ? deepForEach(value, fn) : fn(value); });
}
function isValueProvider(value) {
    return injector_1.USE_VALUE in value;
}
function isExistingProvider(value) {
    return !!value.useExisting;
}
function isFactoryProvider(value) {
    return !!value.useFactory;
}
function isClassProvider(value) {
    return !!value.useClass;
}
function isTypeProvider(value) {
    return typeof value === 'function';
}
function hasDeps(value) {
    return !!value.deps;
}
function hasOnDestroy(value) {
    return typeof value === 'object' && value != null && value.ngOnDestroy &&
        typeof value.ngOnDestroy === 'function';
}
function couldBeInjectableType(value) {
    return (typeof value === 'function') ||
        (typeof value === 'object' && value instanceof injection_token_1.InjectionToken);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfaW5qZWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9kaS9yM19pbmplY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUlILGdDQUFrQztBQUdsQyw2Q0FBZ0Q7QUFDaEQscURBQXFFO0FBQ3JFLHVDQUFnSjtBQUVoSixpQ0FBaUM7QUFVakM7O0dBRUc7QUFDSCxJQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFFbkI7Ozs7OztHQU1HO0FBQ0gsSUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBRXBCLElBQU0sV0FBVyxHQUFHLEVBQVcsQ0FBQztBQUVoQzs7R0FFRztBQUNILElBQUksYUFBYSxHQUF1QixTQUFTLENBQUM7QUFFbEQ7SUFDRSxJQUFJLGFBQWEsS0FBSyxTQUFTLEVBQUU7UUFDL0IsYUFBYSxHQUFHLElBQUksdUJBQVksRUFBRSxDQUFDO0tBQ3BDO0lBQ0QsT0FBTyxhQUFhLENBQUM7QUFDdkIsQ0FBQztBQVlEOzs7O0dBSUc7QUFDSCx3QkFDSSxPQUFvQyxFQUFFLE1BQThCLEVBQ3BFLG1CQUFtRDtJQURiLHVCQUFBLEVBQUEsYUFBOEI7SUFDcEUsb0NBQUEsRUFBQSwwQkFBbUQ7SUFDckQsTUFBTSxHQUFHLE1BQU0sSUFBSSxlQUFlLEVBQUUsQ0FBQztJQUNyQyxPQUFPLElBQUksVUFBVSxDQUFDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM5RCxDQUFDO0FBTEQsd0NBS0M7QUFFRDtJQTJCRSxvQkFDSSxHQUFzQixFQUFFLG1CQUEwQyxFQUN6RCxNQUFnQjtRQUY3QixpQkFxQkM7UUFuQlksV0FBTSxHQUFOLE1BQU0sQ0FBVTtRQTVCN0I7O1dBRUc7UUFDSyxZQUFPLEdBQUcsSUFBSSxHQUFHLEVBQThDLENBQUM7UUFFeEU7O1dBRUc7UUFDSyxxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFB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