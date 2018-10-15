"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var reflective_injector_1 = require("@angular/core/src/di/reflective_injector");
var reflective_provider_1 = require("@angular/core/src/di/reflective_provider");
var errors_1 = require("@angular/core/src/errors");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var util_1 = require("../../src/util");
var Engine = /** @class */ (function () {
    function Engine() {
    }
    return Engine;
}());
var BrokenEngine = /** @class */ (function () {
    function BrokenEngine() {
        throw new Error('Broken Engine');
    }
    return BrokenEngine;
}());
var DashboardSoftware = /** @class */ (function () {
    function DashboardSoftware() {
    }
    return DashboardSoftware;
}());
var Dashboard = /** @class */ (function () {
    function Dashboard(software) {
    }
    Dashboard = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [DashboardSoftware])
    ], Dashboard);
    return Dashboard;
}());
var TurboEngine = /** @class */ (function (_super) {
    __extends(TurboEngine, _super);
    function TurboEngine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TurboEngine;
}(Engine));
var Car = /** @class */ (function () {
    function Car(engine) {
        this.engine = engine;
    }
    Car = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [Engine])
    ], Car);
    return Car;
}());
var CarWithOptionalEngine = /** @class */ (function () {
    function CarWithOptionalEngine(engine) {
        this.engine = engine;
    }
    CarWithOptionalEngine = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Optional()),
        __metadata("design:paramtypes", [Engine])
    ], CarWithOptionalEngine);
    return CarWithOptionalEngine;
}());
var CarWithDashboard = /** @class */ (function () {
    function CarWithDashboard(engine, dashboard) {
        this.engine = engine;
        this.dashboard = dashboard;
    }
    CarWithDashboard = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [Engine, Dashboard])
    ], CarWithDashboard);
    return CarWithDashboard;
}());
var SportsCar = /** @class */ (function (_super) {
    __extends(SportsCar, _super);
    function SportsCar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SportsCar = __decorate([
        core_1.Injectable()
    ], SportsCar);
    return SportsCar;
}(Car));
var CarWithInject = /** @class */ (function () {
    function CarWithInject(engine) {
        this.engine = engine;
    }
    CarWithInject = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(TurboEngine)),
        __metadata("design:paramtypes", [Engine])
    ], CarWithInject);
    return CarWithInject;
}());
var CyclicEngine = /** @class */ (function () {
    function CyclicEngine(car) {
    }
    CyclicEngine = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [Car])
    ], CyclicEngine);
    return CyclicEngine;
}());
var NoAnnotations = /** @class */ (function () {
    function NoAnnotations(secretDependency) {
    }
    return NoAnnotations;
}());
function factoryFn(a) { }
(function () {
    var dynamicProviders = [
        { provide: 'provider0', useValue: 1 }, { provide: 'provider1', useValue: 1 },
        { provide: 'provider2', useValue: 1 }, { provide: 'provider3', useValue: 1 },
        { provide: 'provider4', useValue: 1 }, { provide: 'provider5', useValue: 1 },
        { provide: 'provider6', useValue: 1 }, { provide: 'provider7', useValue: 1 },
        { provide: 'provider8', useValue: 1 }, { provide: 'provider9', useValue: 1 },
        { provide: 'provider10', useValue: 1 }
    ];
    function createInjector(providers, parent) {
        var resolvedProviders = core_1.ReflectiveInjector.resolve(providers.concat(dynamicProviders));
        if (parent != null) {
            return parent.createChildFromResolved(resolvedProviders);
        }
        else {
            return core_1.ReflectiveInjector.fromResolvedProviders(resolvedProviders);
        }
    }
    describe("injector", function () {
        it('should instantiate a class without dependencies', function () {
            var injector = createInjector([Engine]);
            var engine = injector.get(Engine);
            matchers_1.expect(engine).toBeAnInstanceOf(Engine);
        });
        it('should resolve dependencies based on type information', function () {
            var injector = createInjector([Engine, Car]);
            var car = injector.get(Car);
            matchers_1.expect(car).toBeAnInstanceOf(Car);
            matchers_1.expect(car.engine).toBeAnInstanceOf(Engine);
        });
        it('should resolve dependencies based on @Inject annotation', function () {
            var injector = createInjector([TurboEngine, Engine, CarWithInject]);
            var car = injector.get(CarWithInject);
            matchers_1.expect(car).toBeAnInstanceOf(CarWithInject);
            matchers_1.expect(car.engine).toBeAnInstanceOf(TurboEngine);
        });
        it('should throw when no type and not @Inject (class case)', function () {
            matchers_1.expect(function () { return createInjector([NoAnnotations]); })
                .toThrowError('Cannot resolve all parameters for \'NoAnnotations\'(?). ' +
                'Make sure that all the parameters are decorated with Inject or have valid type annotations ' +
                'and that \'NoAnnotations\' is decorated with Injectable.');
        });
        it('should throw when no type and not @Inject (factory case)', function () {
            matchers_1.expect(function () { return createInjector([{ provide: 'someToken', useFactory: factoryFn }]); })
                .toThrowError('Cannot resolve all parameters for \'factoryFn\'(?). ' +
                'Make sure that all the parameters are decorated with Inject or have valid type annotations ' +
                'and that \'factoryFn\' is decorated with Injectable.');
        });
        it('should cache instances', function () {
            var injector = createInjector([Engine]);
            var e1 = injector.get(Engine);
            var e2 = injector.get(Engine);
            matchers_1.expect(e1).toBe(e2);
        });
        it('should provide to a value', function () {
            var injector = createInjector([{ provide: Engine, useValue: 'fake engine' }]);
            var engine = injector.get(Engine);
            matchers_1.expect(engine).toEqual('fake engine');
        });
        it('should inject dependencies instance of InjectionToken', function () {
            var TOKEN = new core_1.InjectionToken('token');
            var injector = createInjector([
                { provide: TOKEN, useValue: 'by token' },
                { provide: Engine, useFactory: function (v) { return v; }, deps: [[TOKEN]] },
            ]);
            var engine = injector.get(Engine);
            matchers_1.expect(engine).toEqual('by token');
        });
        it('should provide to a factory', function () {
            function sportsCarFactory(e) { return new SportsCar(e); }
            var injector = createInjector([Engine, { provide: Car, useFactory: sportsCarFactory, deps: [Engine] }]);
            var car = injector.get(Car);
            matchers_1.expect(car).toBeAnInstanceOf(SportsCar);
            matchers_1.expect(car.engine).toBeAnInstanceOf(Engine);
        });
        it('should supporting provider to null', function () {
            var injector = createInjector([{ provide: Engine, useValue: null }]);
            var engine = injector.get(Engine);
            matchers_1.expect(engine).toBeNull();
        });
        it('should provide to an alias', function () {
            var injector = createInjector([
                Engine, { provide: SportsCar, useClass: SportsCar }, { provide: Car, useExisting: SportsCar }
            ]);
            var car = injector.get(Car);
            var sportsCar = injector.get(SportsCar);
            matchers_1.expect(car).toBeAnInstanceOf(SportsCar);
            matchers_1.expect(car).toBe(sportsCar);
        });
        it('should support multiProviders', function () {
            var injector = createInjector([
                Engine, { provide: Car, useClass: SportsCar, multi: true },
                { provide: Car, useClass: CarWithOptionalEngine, multi: true }
            ]);
            var cars = injector.get(Car);
            matchers_1.expect(cars.length).toEqual(2);
            matchers_1.expect(cars[0]).toBeAnInstanceOf(SportsCar);
            matchers_1.expect(cars[1]).toBeAnInstanceOf(CarWithOptionalEngine);
        });
        it('should support multiProviders that are created using useExisting', function () {
            var injector = createInjector([Engine, SportsCar, { provide: Car, useExisting: SportsCar, multi: true }]);
            var cars = injector.get(Car);
            matchers_1.expect(cars.length).toEqual(1);
            matchers_1.expect(cars[0]).toBe(injector.get(SportsCar));
        });
        it('should throw when the aliased provider does not exist', function () {
            var injector = createInjector([{ provide: 'car', useExisting: SportsCar }]);
            var e = "No provider for " + util_1.stringify(SportsCar) + "! (car -> " + util_1.stringify(SportsCar) + ")";
            matchers_1.expect(function () { return injector.get('car'); }).toThrowError(e);
        });
        it('should handle forwardRef in useExisting', function () {
            var injector = createInjector([
                { provide: 'originalEngine', useClass: core_1.forwardRef(function () { return Engine; }) },
                { provide: 'aliasedEngine', useExisting: core_1.forwardRef(function () { return 'originalEngine'; }) }
            ]);
            matchers_1.expect(injector.get('aliasedEngine')).toBeAnInstanceOf(Engine);
        });
        it('should support overriding factory dependencies', function () {
            var injector = createInjector([Engine, { provide: Car, useFactory: function (e) { return new SportsCar(e); }, deps: [Engine] }]);
            var car = injector.get(Car);
            matchers_1.expect(car).toBeAnInstanceOf(SportsCar);
            matchers_1.expect(car.engine).toBeAnInstanceOf(Engine);
        });
        it('should support optional dependencies', function () {
            var injector = createInjector([CarWithOptionalEngine]);
            var car = injector.get(CarWithOptionalEngine);
            matchers_1.expect(car.engine).toEqual(null);
        });
        it('should flatten passed-in providers', function () {
            var injector = createInjector([[[Engine, Car]]]);
            var car = injector.get(Car);
            matchers_1.expect(car).toBeAnInstanceOf(Car);
        });
        it('should use the last provider when there are multiple providers for same token', function () {
            var injector = createInjector([{ provide: Engine, useClass: Engine }, { provide: Engine, useClass: TurboEngine }]);
            matchers_1.expect(injector.get(Engine)).toBeAnInstanceOf(TurboEngine);
        });
        it('should use non-type tokens', function () {
            var injector = createInjector([{ provide: 'token', useValue: 'value' }]);
            matchers_1.expect(injector.get('token')).toEqual('value');
        });
        it('should throw when given invalid providers', function () {
            matchers_1.expect(function () { return createInjector(['blah']); })
                .toThrowError('Invalid provider - only instances of Provider and Type are allowed, got: blah');
        });
        it('should provide itself', function () {
            var parent = createInjector([]);
            var child = parent.resolveAndCreateChild([]);
            matchers_1.expect(child.get(core_1.Injector)).toBe(child);
        });
        it('should throw when no provider defined', function () {
            var injector = createInjector([]);
            matchers_1.expect(function () { return injector.get('NonExisting'); }).toThrowError('No provider for NonExisting!');
        });
        it('should show the full path when no provider', function () {
            var injector = createInjector([CarWithDashboard, Engine, Dashboard]);
            matchers_1.expect(function () { return injector.get(CarWithDashboard); })
                .toThrowError("No provider for DashboardSoftware! (" + util_1.stringify(CarWithDashboard) + " -> " + util_1.stringify(Dashboard) + " -> DashboardSoftware)");
        });
        it('should throw when trying to instantiate a cyclic dependency', function () {
            var injector = createInjector([Car, { provide: Engine, useClass: CyclicEngine }]);
            matchers_1.expect(function () { return injector.get(Car); })
                .toThrowError("Cannot instantiate cyclic dependency! (" + util_1.stringify(Car) + " -> " + util_1.stringify(Engine) + " -> " + util_1.stringify(Car) + ")");
        });
        it('should show the full path when error happens in a constructor', function () {
            var providers = core_1.ReflectiveInjector.resolve([Car, { provide: Engine, useClass: BrokenEngine }]);
            var injector = new reflective_injector_1.ReflectiveInjector_(providers);
            try {
                injector.get(Car);
                throw 'Must throw';
            }
            catch (e) {
                matchers_1.expect(e.message).toContain("Error during instantiation of Engine! (" + util_1.stringify(Car) + " -> Engine)");
                matchers_1.expect(errors_1.getOriginalError(e) instanceof Error).toBeTruthy();
                matchers_1.expect(e.keys[0].token).toEqual(Engine);
            }
        });
        it('should instantiate an object after a failed attempt', function () {
            var isBroken = true;
            var injector = createInjector([
                Car, { provide: Engine, useFactory: (function () { return isBroken ? new BrokenEngine() : new Engine(); }) }
            ]);
            matchers_1.expect(function () { return injector.get(Car); })
                .toThrowError('Broken Engine: Error during instantiation of Engine! (Car -> Engine).');
            isBroken = false;
            matchers_1.expect(injector.get(Car)).toBeAnInstanceOf(Car);
        });
        it('should support null values', function () {
            var injector = createInjector([{ provide: 'null', useValue: null }]);
            matchers_1.expect(injector.get('null')).toBe(null);
        });
    });
    describe('child', function () {
        it('should load instances from parent injector', function () {
            var parent = core_1.ReflectiveInjector.resolveAndCreate([Engine]);
            var child = parent.resolveAndCreateChild([]);
            var engineFromParent = parent.get(Engine);
            var engineFromChild = child.get(Engine);
            matchers_1.expect(engineFromChild).toBe(engineFromParent);
        });
        it('should not use the child providers when resolving the dependencies of a parent provider', function () {
            var parent = core_1.ReflectiveInjector.resolveAndCreate([Car, Engine]);
            var child = parent.resolveAndCreateChild([{ provide: Engine, useClass: TurboEngine }]);
            var carFromChild = child.get(Car);
            matchers_1.expect(carFromChild.engine).toBeAnInstanceOf(Engine);
        });
        it('should create new instance in a child injector', function () {
            var parent = core_1.ReflectiveInjector.resolveAndCreate([Engine]);
            var child = parent.resolveAndCreateChild([{ provide: Engine, useClass: TurboEngine }]);
            var engineFromParent = parent.get(Engine);
            var engineFromChild = child.get(Engine);
            matchers_1.expect(engineFromParent).not.toBe(engineFromChild);
            matchers_1.expect(engineFromChild).toBeAnInstanceOf(TurboEngine);
        });
        it('should give access to parent', function () {
            var parent = core_1.ReflectiveInjector.resolveAndCreate([]);
            var child = parent.resolveAndCreateChild([]);
            matchers_1.expect(child.parent).toBe(parent);
        });
    });
    describe('resolveAndInstantiate', function () {
        it('should instantiate an object in the context of the injector', function () {
            var inj = core_1.ReflectiveInjector.resolveAndCreate([Engine]);
            var car = inj.resolveAndInstantiate(Car);
            matchers_1.expect(car).toBeAnInstanceOf(Car);
            matchers_1.expect(car.engine).toBe(inj.get(Engine));
        });
        it('should not store the instantiated object in the injector', function () {
            var inj = core_1.ReflectiveInjector.resolveAndCreate([Engine]);
            inj.resolveAndInstantiate(Car);
            matchers_1.expect(function () { return inj.get(Car); }).toThrowError();
        });
    });
    describe('instantiate', function () {
        it('should instantiate an object in the context of the injector', function () {
            var inj = core_1.ReflectiveInjector.resolveAndCreate([Engine]);
            var car = inj.instantiateResolved(core_1.ReflectiveInjector.resolve([Car])[0]);
            matchers_1.expect(car).toBeAnInstanceOf(Car);
            matchers_1.expect(car.engine).toBe(inj.get(Engine));
        });
    });
    describe('depedency resolution', function () {
        describe('@Self()', function () {
            it('should return a dependency from self', function () {
                var inj = core_1.ReflectiveInjector.resolveAndCreate([
                    Engine,
                    { provide: Car, useFactory: function (e) { return new Car(e); }, deps: [[Engine, new core_1.Self()]] }
                ]);
                matchers_1.expect(inj.get(Car)).toBeAnInstanceOf(Car);
            });
            it('should throw when not requested provider on self', function () {
                var parent = core_1.ReflectiveInjector.resolveAndCreate([Engine]);
                var child = parent.resolveAndCreateChild([{ provide: Car, useFactory: function (e) { return new Car(e); }, deps: [[Engine, new core_1.Self()]] }]);
                matchers_1.expect(function () { return child.get(Car); })
                    .toThrowError("No provider for Engine! (" + util_1.stringify(Car) + " -> " + util_1.stringify(Engine) + ")");
            });
        });
        describe('default', function () {
            it('should not skip self', function () {
                var parent = core_1.ReflectiveInjector.resolveAndCreate([Engine]);
                var child = parent.resolveAndCreateChild([
                    { provide: Engine, useClass: TurboEngine },
                    { provide: Car, useFactory: function (e) { return new Car(e); }, deps: [Engine] }
                ]);
                matchers_1.expect(child.get(Car).engine).toBeAnInstanceOf(TurboEngine);
            });
        });
    });
    describe('resolve', function () {
        it('should resolve and flatten', function () {
            var providers = core_1.ReflectiveInjector.resolve([Engine, [BrokenEngine]]);
            providers.forEach(function (b) {
                if (!b)
                    return; // the result is a sparse array
                matchers_1.expect(b instanceof reflective_provider_1.ResolvedReflectiveProvider_).toBe(true);
            });
        });
        it('should support multi providers', function () {
            var provider = core_1.ReflectiveInjector.resolve([
                { provide: Engine, useClass: BrokenEngine, multi: true },
                { provide: Engine, useClass: TurboEngine, multi: true }
            ])[0];
            matchers_1.expect(provider.key.token).toBe(Engine);
            matchers_1.expect(provider.multiProvider).toEqual(true);
            matchers_1.expect(provider.resolvedFactories.length).toEqual(2);
        });
        it('should support providers as hash', function () {
            var provider = core_1.ReflectiveInjector.resolve([
                { provide: Engine, useClass: BrokenEngine, multi: true },
                { provide: Engine, useClass: TurboEngine, multi: true }
            ])[0];
            matchers_1.expect(provider.key.token).toBe(Engine);
            matchers_1.expect(provider.multiProvider).toEqual(true);
            matchers_1.expect(provider.resolvedFactories.length).toEqual(2);
        });
        it('should support multi providers with only one provider', function () {
            var provider = core_1.ReflectiveInjector.resolve([{ provide: Engine, useClass: BrokenEngine, multi: true }])[0];
            matchers_1.expect(provider.key.token).toBe(Engine);
            matchers_1.expect(provider.multiProvider).toEqual(true);
            matchers_1.expect(provider.resolvedFactories.length).toEqual(1);
        });
        it('should throw when mixing multi providers with regular providers', function () {
            matchers_1.expect(function () {
                core_1.ReflectiveInjector.resolve([{ provide: Engine, useClass: BrokenEngine, multi: true }, Engine]);
            }).toThrowError(/Cannot mix multi providers and regular providers/);
            matchers_1.expect(function () {
                core_1.ReflectiveInjector.resolve([Engine, { provide: Engine, useClass: BrokenEngine, multi: true }]);
            }).toThrowError(/Cannot mix multi providers and regular providers/);
        });
        it('should resolve forward references', function () {
            var providers = core_1.ReflectiveInjector.resolve([
                core_1.forwardRef(function () { return Engine; }),
                [{ provide: core_1.forwardRef(function () { return BrokenEngine; }), useClass: core_1.forwardRef(function () { return Engine; }) }], {
                    provide: core_1.forwardRef(function () { return String; }),
                    useFactory: function () { return 'OK'; },
                    deps: [core_1.forwardRef(function () { return Engine; })]
                }
            ]);
            var engineProvider = providers[0];
            var brokenEngineProvider = providers[1];
            var stringProvider = providers[2];
            matchers_1.expect(engineProvider.resolvedFactories[0].factory() instanceof Engine).toBe(true);
            matchers_1.expect(brokenEngineProvider.resolvedFactories[0].factory() instanceof Engine).toBe(true);
            matchers_1.expect(stringProvider.resolvedFactories[0].dependencies[0].key)
                .toEqual(core_1.ReflectiveKey.get(Engine));
        });
        it('should support overriding factory dependencies with dependency annotations', function () {
            var providers = core_1.ReflectiveInjector.resolve([{
                    provide: 'token',
                    useFactory: function (e /** TODO #9100 */) { return 'result'; },
                    deps: [[new core_1.Inject('dep')]]
                }]);
            var provider = providers[0];
            matchers_1.expect(provider.resolvedFactories[0].dependencies[0].key.token).toEqual('dep');
        });
        it('should allow declaring dependencies with flat arrays', function () {
            var resolved = core_1.ReflectiveInjector.resolve([{ provide: 'token', useFactory: function (e) { return e; }, deps: [new core_1.Inject('dep')] }]);
            var nestedResolved = core_1.ReflectiveInjector.resolve([{ provide: 'token', useFactory: function (e) { return e; }, deps: [[new core_1.Inject('dep')]] }]);
            matchers_1.expect(resolved[0].resolvedFactories[0].dependencies[0].key.token)
                .toEqual(nestedResolved[0].resolvedFactories[0].dependencies[0].key.token);
        });
    });
    describe('displayName', function () {
        it('should work', function () {
            matchers_1.expect(core_1.ReflectiveInjector.resolveAndCreate([Engine, BrokenEngine])
                .displayName)
                .toEqual('ReflectiveInjector(providers: [ "Engine" ,  "BrokenEngine" ])');
        });
    });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdGl2ZV9pbmplY3Rvcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2RpL3JlZmxlY3RpdmVfaW5qZWN0b3Jfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBb0o7QUFDcEosZ0ZBQTZFO0FBQzdFLGdGQUFxRjtBQUNyRixtREFBMEQ7QUFDMUQsMkVBQXNFO0FBQ3RFLHVDQUF5QztBQUV6QztJQUFBO0lBQWMsQ0FBQztJQUFELGFBQUM7QUFBRCxDQUFDLEFBQWYsSUFBZTtBQUVmO0lBQ0U7UUFBZ0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUFDLENBQUM7SUFDckQsbUJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUVEO0lBQUE7SUFBeUIsQ0FBQztJQUFELHdCQUFDO0FBQUQsQ0FBQyxBQUExQixJQUEwQjtBQUcxQjtJQUNFLG1CQUFZLFFBQTJCO0lBQUcsQ0FBQztJQUR2QyxTQUFTO1FBRGQsaUJBQVUsRUFBRTt5Q0FFVyxpQkFBaUI7T0FEbkMsU0FBUyxDQUVkO0lBQUQsZ0JBQUM7Q0FBQSxBQUZELElBRUM7QUFFRDtJQUEwQiwrQkFBTTtJQUFoQzs7SUFBa0MsQ0FBQztJQUFELGtCQUFDO0FBQUQsQ0FBQyxBQUFuQyxDQUEwQixNQUFNLEdBQUc7QUFHbkM7SUFDRSxhQUFtQixNQUFjO1FBQWQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUFHLENBQUM7SUFEakMsR0FBRztRQURSLGlCQUFVLEVBQUU7eUNBRWdCLE1BQU07T0FEN0IsR0FBRyxDQUVSO0lBQUQsVUFBQztDQUFBLEFBRkQsSUFFQztBQUdEO0lBQ0UsK0JBQStCLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQUcsQ0FBQztJQUQ3QyxxQkFBcUI7UUFEMUIsaUJBQVUsRUFB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