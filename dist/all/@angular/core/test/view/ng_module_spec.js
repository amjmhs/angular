"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var defs_1 = require("@angular/core/src/di/defs");
var injector_1 = require("@angular/core/src/di/injector");
var ng_module_1 = require("@angular/core/src/view/ng_module");
var refs_1 = require("@angular/core/src/view/refs");
var util_1 = require("@angular/core/src/view/util");
var scope_1 = require("../../src/di/scope");
var Foo = /** @class */ (function () {
    function Foo() {
    }
    return Foo;
}());
var MyModule = /** @class */ (function () {
    function MyModule() {
    }
    return MyModule;
}());
var MyChildModule = /** @class */ (function () {
    function MyChildModule() {
    }
    return MyChildModule;
}());
var NotMyModule = /** @class */ (function () {
    function NotMyModule() {
    }
    return NotMyModule;
}());
var Bar = /** @class */ (function () {
    function Bar() {
    }
    Bar.ngInjectableDef = defs_1.defineInjectable({
        factory: function () { return new Bar(); },
        providedIn: MyModule,
    });
    return Bar;
}());
var Baz = /** @class */ (function () {
    function Baz() {
    }
    Baz.ngInjectableDef = defs_1.defineInjectable({
        factory: function () { return new Baz(); },
        providedIn: NotMyModule,
    });
    return Baz;
}());
var HasNormalDep = /** @class */ (function () {
    function HasNormalDep(foo) {
        this.foo = foo;
    }
    HasNormalDep.ngInjectableDef = defs_1.defineInjectable({
        factory: function () { return new HasNormalDep(injector_1.inject(Foo)); },
        providedIn: MyModule,
    });
    return HasNormalDep;
}());
var HasDefinedDep = /** @class */ (function () {
    function HasDefinedDep(bar) {
        this.bar = bar;
    }
    HasDefinedDep.ngInjectableDef = defs_1.defineInjectable({
        factory: function () { return new HasDefinedDep(injector_1.inject(Bar)); },
        providedIn: MyModule,
    });
    return HasDefinedDep;
}());
var HasOptionalDep = /** @class */ (function () {
    function HasOptionalDep(baz) {
        this.baz = baz;
    }
    HasOptionalDep.ngInjectableDef = defs_1.defineInjectable({
        factory: function () { return new HasOptionalDep(injector_1.inject(Baz, 8 /* Optional */)); },
        providedIn: MyModule,
    });
    return HasOptionalDep;
}());
var ChildDep = /** @class */ (function () {
    function ChildDep() {
    }
    ChildDep.ngInjectableDef = defs_1.defineInjectable({
        factory: function () { return new ChildDep(); },
        providedIn: MyChildModule,
    });
    return ChildDep;
}());
var FromChildWithOptionalDep = /** @class */ (function () {
    function FromChildWithOptionalDep(baz) {
        this.baz = baz;
    }
    FromChildWithOptionalDep.ngInjectableDef = defs_1.defineInjectable({
        factory: function () { return new FromChildWithOptionalDep(injector_1.inject(Baz, 0 /* Default */)); },
        providedIn: MyChildModule,
    });
    return FromChildWithOptionalDep;
}());
var FromChildWithSkipSelfDep = /** @class */ (function () {
    function FromChildWithSkipSelfDep(skipSelfChildDep, selfChildDep, optionalSelfBar) {
        this.skipSelfChildDep = skipSelfChildDep;
        this.selfChildDep = selfChildDep;
        this.optionalSelfBar = optionalSelfBar;
    }
    FromChildWithSkipSelfDep.ngInjectableDef = defs_1.defineInjectable({
        factory: function () { return new FromChildWithSkipSelfDep(injector_1.inject(ChildDep, 4 /* SkipSelf */ | 8 /* Optional */), injector_1.inject(ChildDep, 2 /* Self */), injector_1.inject(Bar, 2 /* Self */ | 8 /* Optional */)); },
        providedIn: MyChildModule,
    });
    return FromChildWithSkipSelfDep;
}());
var UsesInject = /** @class */ (function () {
    function UsesInject() {
        injector_1.inject(injector_1.INJECTOR);
    }
    return UsesInject;
}());
function makeProviders(classes, modules) {
    var providers = classes.map(function (token, index) { return ({
        index: index,
        deps: [],
        flags: 512 /* TypeClassProvider */ | 4096 /* LazyProvider */, token: token,
        value: token,
    }); });
    return makeModule(modules, providers);
}
function makeFactoryProviders(factories, modules) {
    var providers = factories.map(function (factory, index) { return ({
        index: index,
        deps: [],
        flags: 1024 /* TypeFactoryProvider */ | 4096 /* LazyProvider */,
        token: factory.token,
        value: factory.factory,
    }); });
    return makeModule(modules, providers);
}
function makeModule(modules, providers) {
    var providersByKey = {};
    providers.forEach(function (provider) { return providersByKey[util_1.tokenKey(provider.token)] = provider; });
    return { factory: null, providers: providers, providersByKey: providersByKey, modules: modules, isRoot: true };
}
describe('NgModuleRef_ injector', function () {
    var ref;
    var childRef;
    beforeEach(function () {
        ref = refs_1.createNgModuleRef(MyModule, injector_1.Injector.NULL, [], makeProviders([MyModule, Foo, UsesInject], [MyModule]));
        childRef = refs_1.createNgModuleRef(MyChildModule, ref.injector, [], makeProviders([MyChildModule], [MyChildModule]));
    });
    it('injects a provided value', function () { expect(ref.injector.get(Foo) instanceof Foo).toBeTruthy(); });
    it('injects an InjectableDef value', function () { expect(ref.injector.get(Bar) instanceof Bar).toBeTruthy(); });
    it('caches InjectableDef values', function () { expect(ref.injector.get(Bar)).toBe(ref.injector.get(Bar)); });
    it('injects provided deps properly', function () {
        var instance = ref.injector.get(HasNormalDep);
        expect(instance instanceof HasNormalDep).toBeTruthy();
        expect(instance.foo).toBe(ref.injector.get(Foo));
    });
    it('injects defined deps properly', function () {
        var instance = ref.injector.get(HasDefinedDep);
        expect(instance instanceof HasDefinedDep).toBeTruthy();
        expect(instance.bar).toBe(ref.injector.get(Bar));
    });
    it('injects optional deps properly', function () {
        var instance = ref.injector.get(HasOptionalDep);
        expect(instance instanceof HasOptionalDep).toBeTruthy();
        expect(instance.baz).toBeNull();
    });
    it('injects skip-self and self deps across injectors properly', function () {
        var instance = childRef.injector.get(FromChildWithSkipSelfDep);
        expect(instance instanceof FromChildWithSkipSelfDep).toBeTruthy();
        expect(instance.skipSelfChildDep).toBeNull();
        expect(instance.selfChildDep instanceof ChildDep).toBeTruthy();
        expect(instance.optionalSelfBar).toBeNull();
    });
    it('does not inject something not scoped to the module', function () { expect(ref.injector.get(Baz, null)).toBeNull(); });
    it('injects with the current injector always set', function () { expect(function () { return ref.injector.get(UsesInject); }).not.toThrow(); });
    it('calls ngOnDestroy on services created via factory', function () {
        var Module = /** @class */ (function () {
            function Module() {
            }
            return Module;
        }());
        var Service = /** @class */ (function () {
            function Service() {
            }
            Service.prototype.ngOnDestroy = function () { Service.destroyed++; };
            Service.destroyed = 0;
            return Service;
        }());
        var ref = refs_1.createNgModuleRef(Module, injector_1.Injector.NULL, [], makeFactoryProviders([{
                token: Service,
                factory: function () { return new Service(); },
            }], [Module]));
        expect(ref.injector.get(Service)).toBeDefined();
        expect(Service.destroyed).toBe(0);
        ref.destroy();
        expect(Service.destroyed).toBe(1);
    });
    it('only calls ngOnDestroy once per instance', function () {
        var Module = /** @class */ (function () {
            function Module() {
            }
            return Module;
        }());
        var Service = /** @class */ (function () {
            function Service() {
            }
            Service.prototype.ngOnDestroy = function () { Service.destroyed++; };
            Service.destroyed = 0;
            return Service;
        }());
        var OtherToken = /** @class */ (function () {
            function OtherToken() {
            }
            return OtherToken;
        }());
        var instance = new Service();
        var ref = refs_1.createNgModuleRef(Module, injector_1.Injector.NULL, [], makeFactoryProviders([
            {
                token: Service,
                factory: function () { return instance; },
            },
            {
                token: OtherToken,
                factory: function () { return instance; },
            }
        ], [Module]));
        expect(ref.injector.get(Service)).toBe(instance);
        expect(ref.injector.get(OtherToken)).toBe(instance);
        expect(Service.destroyed).toBe(0);
        ref.destroy();
        expect(Service.destroyed).toBe(1);
    });
    describe('moduleDef', function () {
        function createProvider(token, value) {
            return {
                index: 0,
                flags: 256 /* TypeValueProvider */ | 4096 /* LazyProvider */,
                deps: [], token: token, value: value
            };
        }
        it('sets isRoot to `true` when APP_ROOT is `true`', function () {
            var def = ng_module_1.moduleDef([createProvider(scope_1.APP_ROOT, true)]);
            expect(def.isRoot).toBe(true);
        });
        it('sets isRoot to `false` when APP_ROOT is absent', function () {
            var def = ng_module_1.moduleDef([]);
            expect(def.isRoot).toBe(false);
        });
        it('sets isRoot to `false` when APP_ROOT is `false`', function () {
            var def = ng_module_1.moduleDef([createProvider(scope_1.APP_ROOT, false)]);
            expect(def.isRoot).toBe(false);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3Qvdmlldy9uZ19tb2R1bGVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILGtEQUEwRTtBQUMxRSwwREFBc0Y7QUFHdEYsOERBQWlHO0FBQ2pHLG9EQUE4RDtBQUM5RCxvREFBcUQ7QUFDckQsNENBQTRDO0FBRTVDO0lBQUE7SUFBVyxDQUFDO0lBQUQsVUFBQztBQUFELENBQUMsQUFBWixJQUFZO0FBRVo7SUFBQTtJQUFnQixDQUFDO0lBQUQsZUFBQztBQUFELENBQUMsQUFBakIsSUFBaUI7QUFFakI7SUFBQTtJQUFxQixDQUFDO0lBQUQsb0JBQUM7QUFBRCxDQUFDLEFBQXRCLElBQXNCO0FBRXRCO0lBQUE7SUFBbUIsQ0FBQztJQUFELGtCQUFDO0FBQUQsQ0FBQyxBQUFwQixJQUFvQjtBQUVwQjtJQUFBO0lBS0EsQ0FBQztJQUpRLG1CQUFlLEdBQXVCLHVCQUFnQixDQUFDO1FBQzVELE9BQU8sRUFBRSxjQUFNLE9BQUEsSUFBSSxHQUFHLEVBQUUsRUFBVCxDQUFTO1FBQ3hCLFVBQVUsRUFBRSxRQUFRO0tBQ3JCLENBQUMsQ0FBQztJQUNMLFVBQUM7Q0FBQSxBQUxELElBS0M7QUFFRDtJQUFBO0lBS0EsQ0FBQztJQUpRLG1CQUFlLEdBQXVCLHVCQUFnQixDQUFDO1FBQzVELE9BQU8sRUFBRSxjQUFNLE9BQUEsSUFBSSxHQUFHLEVBQUUsRUFBVCxDQUFTO1FBQ3hCLFVBQVUsRUFBRSxXQUFXO0tBQ3hCLENBQUMsQ0FBQztJQUNMLFVBQUM7Q0FBQSxBQUxELElBS0M7QUFFRDtJQUNFLHNCQUFtQixHQUFRO1FBQVIsUUFBRyxHQUFILEdBQUcsQ0FBSztJQUFHLENBQUM7SUFFeEIsNEJBQWUsR0FBZ0MsdUJBQWdCLENBQUM7UUFDckUsT0FBTyxFQUFFLGNBQU0sT0FBQSxJ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