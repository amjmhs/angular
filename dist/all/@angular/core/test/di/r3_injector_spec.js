"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var defs_1 = require("../../src/di/defs");
var injection_token_1 = require("../../src/di/injection_token");
var injector_1 = require("../../src/di/injector");
var r3_injector_1 = require("../../src/di/r3_injector");
describe('InjectorDef-based createInjector()', function () {
    var CircularA = /** @class */ (function () {
        function CircularA() {
        }
        CircularA.ngInjectableDef = defs_1.defineInjectable({
            providedIn: null,
            factory: function () { return injector_1.inject(CircularB); },
        });
        return CircularA;
    }());
    var CircularB = /** @class */ (function () {
        function CircularB() {
        }
        CircularB.ngInjectableDef = defs_1.defineInjectable({
            providedIn: null,
            factory: function () { return injector_1.inject(CircularA); },
        });
        return CircularB;
    }());
    var Service = /** @class */ (function () {
        function Service() {
        }
        Service.ngInjectableDef = defs_1.defineInjectable({
            providedIn: null,
            factory: function () { return new Service(); },
        });
        return Service;
    }());
    var StaticService = /** @class */ (function () {
        function StaticService(dep) {
            this.dep = dep;
        }
        return StaticService;
    }());
    var SERVICE_TOKEN = new injection_token_1.InjectionToken('SERVICE_TOKEN');
    var STATIC_TOKEN = new injection_token_1.InjectionToken('STATIC_TOKEN');
    var LOCALE = new injection_token_1.InjectionToken('LOCALE');
    var ServiceWithDep = /** @class */ (function () {
        function ServiceWithDep(service) {
            this.service = service;
        }
        ServiceWithDep.ngInjectableDef = defs_1.defineInjectable({
            providedIn: null,
            factory: function () { return new ServiceWithDep(injector_1.inject(Service)); },
        });
        return ServiceWithDep;
    }());
    var ServiceWithMultiDep = /** @class */ (function () {
        function ServiceWithMultiDep(locale) {
            this.locale = locale;
        }
        ServiceWithMultiDep.ngInjectableDef = defs_1.defineInjectable({
            providedIn: null,
            factory: function () { return new ServiceWithMultiDep(injector_1.inject(LOCALE)); },
        });
        return ServiceWithMultiDep;
    }());
    var ServiceTwo = /** @class */ (function () {
        function ServiceTwo() {
        }
        ServiceTwo.ngInjectableDef = defs_1.defineInjectable({
            providedIn: null,
            factory: function () { return new ServiceTwo(); },
        });
        return ServiceTwo;
    }());
    var deepServiceDestroyed = false;
    var DeepService = /** @class */ (function () {
        function DeepService() {
        }
        DeepService.prototype.ngOnDestroy = function () { deepServiceDestroyed = true; };
        DeepService.ngInjectableDef = defs_1.defineInjectable({
            providedIn: null,
            factory: function () { return new DeepService(); },
        });
        return DeepService;
    }());
    var eagerServiceCreated = false;
    var EagerService = /** @class */ (function () {
        function EagerService() {
            eagerServiceCreated = true;
        }
        EagerService.ngInjectableDef = defs_1.defineInjectable({
            providedIn: undefined,
            factory: function () { return new EagerService(); },
        });
        return EagerService;
    }());
    var deepModuleCreated = false;
    var DeepModule = /** @class */ (function () {
        function DeepModule(eagerService) {
            deepModuleCreated = true;
        }
        DeepModule.safe = function () {
            return {
                ngModule: DeepModule,
                providers: [{ provide: DeepService }],
            };
        };
        DeepModule.ngInjectorDef = defs_1.defineInjector({
            factory: function () { return new DeepModule(injector_1.inject(EagerService)); },
            imports: undefined,
            providers: [
                EagerService,
                { provide: DeepService, useFactory: function () { throw new Error('Not overridden!'); } },
            ],
        });
        return DeepModule;
    }());
    var IntermediateModule = /** @class */ (function () {
        function IntermediateModule() {
        }
        IntermediateModule.ngInjectorDef = defs_1.defineInjector({
            factory: function () { return new IntermediateModule(); },
            imports: [DeepModule.safe()],
            providers: [],
        });
        return IntermediateModule;
    }());
    var Module = /** @class */ (function () {
        function Module() {
        }
        Module.ngInjectorDef = defs_1.defineInjector({
            factory: function () { return new Module(); },
            imports: [IntermediateModule],
            providers: [
                ServiceWithDep,
                ServiceWithMultiDep,
                { provide: LOCALE, multi: true, useValue: 'en' },
                { provide: LOCALE, multi: true, useValue: 'es' },
                Service,
                { provide: SERVICE_TOKEN, useExisting: Service },
                CircularA,
                CircularB,
                { provide: STATIC_TOKEN, useClass: StaticService, deps: [Service] },
            ],
        });
        return Module;
    }());
    var OtherModule = /** @class */ (function () {
        function OtherModule() {
        }
        OtherModule.ngInjectorDef = defs_1.defineInjector({
            factory: function () { return new OtherModule(); },
            imports: undefined,
            providers: [],
        });
        return OtherModule;
    }());
    var NotAModule = /** @class */ (function () {
        function NotAModule() {
        }
        return NotAModule;
    }());
    var ImportsNotAModule = /** @class */ (function () {
        function ImportsNotAModule() {
        }
        ImportsNotAModule.ngInjectorDef = defs_1.defineInjector({
            factory: function () { return new ImportsNotAModule(); },
            imports: [NotAModule],
            providers: [],
        });
        return ImportsNotAModule;
    }());
    var ScopedService = /** @class */ (function () {
        function ScopedService() {
        }
        ScopedService.ngInjectableDef = defs_1.defineInjectable({
            providedIn: Module,
            factory: function () { return new ScopedService(); },
        });
        return ScopedService;
    }());
    var WrongScopeService = /** @class */ (function () {
        function WrongScopeService() {
        }
        WrongScopeService.ngInjectableDef = defs_1.defineInjectable({
            providedIn: OtherModule,
            factory: function () { return new WrongScopeService(); },
        });
        return WrongScopeService;
    }());
    var injector;
    beforeEach(function () {
        deepModuleCreated = eagerServiceCreated = deepServiceDestroyed = false;
        injector = r3_injector_1.createInjector(Module);
    });
    it('injects a simple class', function () {
        var instance = injector.get(Service);
        expect(instance instanceof Service).toBeTruthy();
        expect(injector.get(Service)).toBe(instance);
    });
    it('throws an error when a token is not found', function () { expect(function () { return injector.get(ServiceTwo); }).toThrow(); });
    it('returns the default value if a provider isn\'t present', function () { expect(injector.get(ServiceTwo, null)).toBeNull(); });
    it('injects a service with dependencies', function () {
        var instance = injector.get(ServiceWithDep);
        expect(instance instanceof ServiceWithDep);
        expect(instance.service).toBe(injector.get(Service));
    });
    it('injects a service with dependencies on multi-providers', function () {
        var instance = injector.get(ServiceWithMultiDep);
        expect(instance instanceof ServiceWithMultiDep);
        expect(instance.locale).toEqual(['en', 'es']);
    });
    it('injects a token with useExisting', function () {
        var instance = injector.get(SERVICE_TOKEN);
        expect(instance).toBe(injector.get(Service));
    });
    it('instantiates a class with useClass and deps', function () {
        var instance = injector.get(STATIC_TOKEN);
        expect(instance instanceof StaticService).toBeTruthy();
        expect(instance.dep).toBe(injector.get(Service));
    });
    it('throws an error on circular deps', function () { expect(function () { return injector.get(CircularA); }).toThrow(); });
    it('allows injecting itself via INJECTOR', function () { expect(injector.get(injector_1.INJECTOR)).toBe(injector); });
    it('allows injecting itself via Injector', function () { expect(injector.get(injector_1.Injector)).toBe(injector); });
    it('allows injecting a deeply imported service', function () { expect(injector.get(DeepService) instanceof DeepService).toBeTruthy(); });
    it('allows injecting a scoped service', function () {
        var instance = injector.get(ScopedService);
        expect(instance instanceof ScopedService).toBeTruthy();
        expect(instance).toBe(injector.get(ScopedService));
    });
    it('does not create instances of a service not in scope', function () { expect(injector.get(WrongScopeService, null)).toBeNull(); });
    it('eagerly instantiates the injectordef types', function () {
        expect(deepModuleCreated).toBe(true, 'DeepModule not instantiated');
        expect(eagerServiceCreated).toBe(true, 'EagerSerivce not instantiated');
    });
    it('calls ngOnDestroy on services when destroyed', function () {
        injector.get(DeepService);
        injector.destroy();
        expect(deepServiceDestroyed).toBe(true, 'DeepService not destroyed');
    });
    it('does not allow injection after destroy', function () {
        injector.destroy();
        expect(function () { return injector.get(DeepService); }).toThrowError('Injector has already been destroyed.');
    });
    it('does not allow double destroy', function () {
        injector.destroy();
        expect(function () { return injector.destroy(); })
            .toThrowError('Injector has already been destroyed.');
    });
    it('should not crash when importing something that has no ngInjectorDef', function () {
        injector = r3_injector_1.createInjector(ImportsNotAModule);
        expect(injector.get(ImportsNotAModule)).toBeDefined();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfaW5qZWN0b3Jfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9kaS9yM19pbmplY3Rvcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMENBQW1FO0FBQ25FLGdFQUE0RDtBQUM1RCxrREFBaUU7QUFDakUsd0RBQW9FO0FBRXBFLFFBQVEsQ0FBQyxvQ0FBb0MsRUFBRTtJQUM3QztRQUFBO1FBS0EsQ0FBQztRQUpRLHlCQUFlLEdBQUcsdUJBQWdCLENBQUM7WUFDeEMsVUFBVSxFQUFFLElBQUk7WUFDaEIsT0FBTyxFQUFFLGNBQU0sT0FBQSxpQkFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFqQixDQUFpQjtTQUNqQyxDQUFDLENBQUM7UUFDTCxnQkFBQztLQUFBLEFBTEQsSUFLQztJQUVEO1FBQUE7UUFLQSxDQUFDO1FBSlEseUJBQWUsR0FBRyx1QkFBZ0IsQ0FBQztZQUN4QyxVQUFVLEVBQUUsSUFBSTtZQUNoQixPQUFPLEVBQUUsY0FBTSxPQUFBLGlCQUFNLENBQUMsU0FBUyxDQUFDLEVBQWpCLENBQWlCO1NBQ2pDLENBQUMsQ0FBQztRQUNMLGdCQUFDO0tBQUEsQUFMRCxJQUtDO0lBRUQ7UUFBQTtRQUtBLENBQUM7UUFKUSx1QkFBZSxHQUFHLHVCQUFnQixDQUFDO1lBQ3hDLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLE9BQU8sRUFBRSxjQUFNLE9BQUEsSUFBSSxPQUFPLEVBQUUsRUFBYixDQUFhO1NBQzdCLENBQUMsQ0FBQztRQUNMLGNBQUM7S0FBQSxBQUxELElBS0M7SUFFRDtRQUNFLHVCQUFxQixHQUFZO1lBQVosUUFBRyxHQUFILEdBQUcsQ0FBUztRQUFHLENBQUM7UUFDdkMsb0JBQUM7SUFBRCxDQUFDLEFBRkQsSUFFQztJQUVELElBQU0sYUFBYSxHQUFHLElBQUksZ0NBQWMsQ0FBVSxlQUFlLENBQUMsQ0FBQztJQUVuRSxJ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