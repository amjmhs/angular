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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var util_1 = require("../../src/util");
var Engine = /** @class */ (function () {
    function Engine() {
    }
    Engine.PROVIDER = { provide: Engine, useClass: Engine, deps: [] };
    return Engine;
}());
var BrokenEngine = /** @class */ (function () {
    function BrokenEngine() {
        throw new Error('Broken Engine');
    }
    BrokenEngine.PROVIDER = { provide: Engine, useClass: BrokenEngine, deps: [] };
    return BrokenEngine;
}());
var DashboardSoftware = /** @class */ (function () {
    function DashboardSoftware() {
    }
    DashboardSoftware.PROVIDER = { provide: DashboardSoftware, useClass: DashboardSoftware, deps: [] };
    return DashboardSoftware;
}());
var Dashboard = /** @class */ (function () {
    function Dashboard(software) {
    }
    Dashboard.PROVIDER = { provide: Dashboard, useClass: Dashboard, deps: [DashboardSoftware] };
    return Dashboard;
}());
var TurboEngine = /** @class */ (function (_super) {
    __extends(TurboEngine, _super);
    function TurboEngine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TurboEngine.PROVIDER = { provide: Engine, useClass: TurboEngine, deps: [] };
    return TurboEngine;
}(Engine));
var Car = /** @class */ (function () {
    function Car(engine) {
        this.engine = engine;
    }
    Car.PROVIDER = { provide: Car, useClass: Car, deps: [Engine] };
    return Car;
}());
var CarWithOptionalEngine = /** @class */ (function () {
    function CarWithOptionalEngine(engine) {
        this.engine = engine;
    }
    CarWithOptionalEngine.PROVIDER = {
        provide: CarWithOptionalEngine,
        useClass: CarWithOptionalEngine,
        deps: [[new core_1.Optional(), Engine]]
    };
    return CarWithOptionalEngine;
}());
var CarWithDashboard = /** @class */ (function () {
    function CarWithDashboard(engine, dashboard) {
        this.engine = engine;
        this.dashboard = dashboard;
    }
    CarWithDashboard.PROVIDER = {
        provide: CarWithDashboard,
        useClass: CarWithDashboard,
        deps: [Engine, Dashboard]
    };
    return CarWithDashboard;
}());
var SportsCar = /** @class */ (function (_super) {
    __extends(SportsCar, _super);
    function SportsCar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SportsCar.PROVIDER = { provide: Car, useClass: SportsCar, deps: [Engine] };
    return SportsCar;
}(Car));
var CyclicEngine = /** @class */ (function () {
    function CyclicEngine(car) {
    }
    CyclicEngine.PROVIDER = { provide: Engine, useClass: CyclicEngine, deps: [Car] };
    return CyclicEngine;
}());
var NoAnnotations = /** @class */ (function () {
    function NoAnnotations(secretDependency) {
    }
    return NoAnnotations;
}());
function factoryFn(a) { }
{
    var dynamicProviders = [
        { provide: 'provider0', useValue: 1 }, { provide: 'provider1', useValue: 1 },
        { provide: 'provider2', useValue: 1 }, { provide: 'provider3', useValue: 1 },
        { provide: 'provider4', useValue: 1 }, { provide: 'provider5', useValue: 1 },
        { provide: 'provider6', useValue: 1 }, { provide: 'provider7', useValue: 1 },
        { provide: 'provider8', useValue: 1 }, { provide: 'provider9', useValue: 1 },
        { provide: 'provider10', useValue: 1 }
    ];
    describe("StaticInjector", function () {
        it('should instantiate a class without dependencies', function () {
            var injector = core_1.Injector.create([Engine.PROVIDER]);
            var engine = injector.get(Engine);
            matchers_1.expect(engine).toBeAnInstanceOf(Engine);
        });
        it('should resolve dependencies based on type information', function () {
            var injector = core_1.Injector.create([Engine.PROVIDER, Car.PROVIDER]);
            var car = injector.get(Car);
            matchers_1.expect(car).toBeAnInstanceOf(Car);
            matchers_1.expect(car.engine).toBeAnInstanceOf(Engine);
        });
        it('should cache instances', function () {
            var injector = core_1.Injector.create([Engine.PROVIDER]);
            var e1 = injector.get(Engine);
            var e2 = injector.get(Engine);
            matchers_1.expect(e1).toBe(e2);
        });
        it('should provide to a value', function () {
            var injector = core_1.Injector.create([{ provide: Engine, useValue: 'fake engine' }]);
            var engine = injector.get(Engine);
            matchers_1.expect(engine).toEqual('fake engine');
        });
        it('should inject dependencies instance of InjectionToken', function () {
            var TOKEN = new core_1.InjectionToken('token');
            var injector = core_1.Injector.create([
                { provide: TOKEN, useValue: 'by token' },
                { provide: Engine, useFactory: function (v) { return v; }, deps: [[TOKEN]] },
            ]);
            var engine = injector.get(Engine);
            matchers_1.expect(engine).toEqual('by token');
        });
        it('should provide to a factory', function () {
            function sportsCarFactory(e) { return new SportsCar(e); }
            var injector = core_1.Injector.create([Engine.PROVIDER, { provide: Car, useFactory: sportsCarFactory, deps: [Engine] }]);
            var car = injector.get(Car);
            matchers_1.expect(car).toBeAnInstanceOf(SportsCar);
            matchers_1.expect(car.engine).toBeAnInstanceOf(Engine);
        });
        it('should supporting provider to null', function () {
            var injector = core_1.Injector.create([{ provide: Engine, useValue: null }]);
            var engine = injector.get(Engine);
            matchers_1.expect(engine).toBeNull();
        });
        it('should provide to an alias', function () {
            var injector = core_1.Injector.create([
                Engine.PROVIDER, { provide: SportsCar, useClass: SportsCar, deps: [Engine] },
                { provide: Car, useExisting: SportsCar }
            ]);
            var car = injector.get(Car);
            var sportsCar = injector.get(SportsCar);
            matchers_1.expect(car).toBeAnInstanceOf(SportsCar);
            matchers_1.expect(car).toBe(sportsCar);
        });
        it('should support multiProviders', function () {
            var injector = core_1.Injector.create([
                Engine.PROVIDER, { provide: Car, useClass: SportsCar, deps: [Engine], multi: true },
                { provide: Car, useClass: CarWithOptionalEngine, deps: [Engine], multi: true }
            ]);
            var cars = injector.get(Car);
            matchers_1.expect(cars.length).toEqual(2);
            matchers_1.expect(cars[0]).toBeAnInstanceOf(SportsCar);
            matchers_1.expect(cars[1]).toBeAnInstanceOf(CarWithOptionalEngine);
        });
        it('should support multiProviders that are created using useExisting', function () {
            var injector = core_1.Injector.create([
                Engine.PROVIDER, { provide: SportsCar, useClass: SportsCar, deps: [Engine] },
                { provide: Car, useExisting: SportsCar, multi: true }
            ]);
            var cars = injector.get(Car);
            matchers_1.expect(cars.length).toEqual(1);
            matchers_1.expect(cars[0]).toBe(injector.get(SportsCar));
        });
        it('should throw when the aliased provider does not exist', function () {
            var injector = core_1.Injector.create([{ provide: 'car', useExisting: SportsCar }]);
            var e = "StaticInjectorError[car -> " + util_1.stringify(SportsCar) + "]: \n  NullInjectorError: No provider for " + util_1.stringify(SportsCar) + "!";
            matchers_1.expect(function () { return injector.get('car'); }).toThrowError(e);
        });
        it('should handle forwardRef in useExisting', function () {
            var injector = core_1.Injector.create([
                { provide: 'originalEngine', useClass: core_1.forwardRef(function () { return Engine; }), deps: [] }, {
                    provide: 'aliasedEngine',
                    useExisting: core_1.forwardRef(function () { return 'originalEngine'; }),
                    deps: []
                }
            ]);
            matchers_1.expect(injector.get('aliasedEngine')).toBeAnInstanceOf(Engine);
        });
        it('should support overriding factory dependencies', function () {
            var injector = core_1.Injector.create([
                Engine.PROVIDER,
                { provide: Car, useFactory: function (e) { return new SportsCar(e); }, deps: [Engine] }
            ]);
            var car = injector.get(Car);
            matchers_1.expect(car).toBeAnInstanceOf(SportsCar);
            matchers_1.expect(car.engine).toBeAnInstanceOf(Engine);
        });
        it('should support optional dependencies', function () {
            var injector = core_1.Injector.create([CarWithOptionalEngine.PROVIDER]);
            var car = injector.get(CarWithOptionalEngine);
            matchers_1.expect(car.engine).toBeNull();
        });
        it('should flatten passed-in providers', function () {
            var injector = core_1.Injector.create([[[Engine.PROVIDER, Car.PROVIDER]]]);
            var car = injector.get(Car);
            matchers_1.expect(car).toBeAnInstanceOf(Car);
        });
        it('should use the last provider when there are multiple providers for same token', function () {
            var injector = core_1.Injector.create([
                { provide: Engine, useClass: Engine, deps: [] },
                { provide: Engine, useClass: TurboEngine, deps: [] }
            ]);
            matchers_1.expect(injector.get(Engine)).toBeAnInstanceOf(TurboEngine);
        });
        it('should use non-type tokens', function () {
            var injector = core_1.Injector.create([{ provide: 'token', useValue: 'value' }]);
            matchers_1.expect(injector.get('token')).toEqual('value');
        });
        it('should throw when given invalid providers', function () {
            matchers_1.expect(function () { return core_1.Injector.create(['blah']); })
                .toThrowError('StaticInjectorError[blah]: Unexpected provider');
        });
        it('should throw when missing deps', function () {
            matchers_1.expect(function () { return core_1.Injector.create([{ provide: Engine, useClass: Engine }]); })
                .toThrowError('StaticInjectorError[{provide:Engine, useClass:Engine}]: \'deps\' required');
        });
        it('should throw when using reflective API', function () {
            matchers_1.expect(function () { return core_1.Injector.create([Engine]); })
                .toThrowError('StaticInjectorError[Engine]: Function/Class not supported');
        });
        it('should throw when unknown provider shape API', function () {
            matchers_1.expect(function () { return core_1.Injector.create([{ provide: 'abc', deps: [Engine] }]); })
                .toThrowError('StaticInjectorError[{provide:"abc", deps:[Engine]}]: StaticProvider does not have [useValue|useFactory|useExisting|useClass] or [provide] is not newable');
        });
        it('should throw when given invalid providers and serialize the provider', function () {
            matchers_1.expect(function () { return core_1.Injector.create([{ foo: 'bar', bar: Car }]); })
                .toThrowError('StaticInjectorError[{foo:"bar", bar:Car}]: Unexpected provider');
        });
        it('should provide itself', function () {
            var parent = core_1.Injector.create([]);
            var child = core_1.Injector.create([], parent);
            matchers_1.expect(child.get(core_1.Injector)).toBe(child);
        });
        it('should throw when no provider defined', function () {
            var injector = core_1.Injector.create([]);
            matchers_1.expect(function () { return injector.get('NonExisting'); })
                .toThrowError('StaticInjectorError[NonExisting]: \n  NullInjectorError: No provider for NonExisting!');
        });
        it('should show the full path when no provider', function () {
            var injector = core_1.Injector.create([CarWithDashboard.PROVIDER, Engine.PROVIDER, Dashboard.PROVIDER]);
            matchers_1.expect(function () { return injector.get(CarWithDashboard); })
                .toThrowError("StaticInjectorError[" + util_1.stringify(CarWithDashboard) + " -> " + util_1.stringify(Dashboard) + " -> DashboardSoftware]: \n" +
                '  NullInjectorError: No provider for DashboardSoftware!');
        });
        it('should throw when trying to instantiate a cyclic dependency', function () {
            var injector = core_1.Injector.create([Car.PROVIDER, CyclicEngine.PROVIDER]);
            matchers_1.expect(function () { return injector.get(Car); })
                .toThrowError("StaticInjectorError[" + util_1.stringify(Car) + " -> " + util_1.stringify(Engine) + " -> " + util_1.stringify(Car) + "]: Circular dependency");
        });
        it('should show the full path when error happens in a constructor', function () {
            var error = new Error('MyError');
            var injector = core_1.Injector.create([Car.PROVIDER, { provide: Engine, useFactory: function () { throw error; }, deps: [] }]);
            try {
                injector.get(Car);
                throw 'Must throw';
            }
            catch (e) {
                matchers_1.expect(e).toBe(error);
                matchers_1.expect(e.message).toContain("StaticInjectorError[" + util_1.stringify(Car) + " -> Engine]: \n  MyError");
                matchers_1.expect(e.ngTokenPath[0]).toEqual(Car);
                matchers_1.expect(e.ngTokenPath[1]).toEqual(Engine);
            }
        });
        it('should instantiate an object after a failed attempt', function () {
            var isBroken = true;
            var injector = core_1.Injector.create([
                Car.PROVIDER, {
                    provide: Engine,
                    useFactory: (function () { return isBroken ? new BrokenEngine() : new Engine(); }),
                    deps: []
                }
            ]);
            matchers_1.expect(function () { return injector.get(Car); })
                .toThrowError('StaticInjectorError[Car -> Engine]: \n  Broken Engine');
            isBroken = false;
            matchers_1.expect(injector.get(Car)).toBeAnInstanceOf(Car);
        });
        it('should support null/undefined values', function () {
            var injector = core_1.Injector.create([
                { provide: 'null', useValue: null },
                { provide: 'undefined', useValue: undefined },
            ]);
            matchers_1.expect(injector.get('null')).toBe(null);
            matchers_1.expect(injector.get('undefined')).toBe(undefined);
        });
    });
    describe('child', function () {
        it('should load instances from parent injector', function () {
            var parent = core_1.Injector.create([Engine.PROVIDER]);
            var child = core_1.Injector.create([], parent);
            var engineFromParent = parent.get(Engine);
            var engineFromChild = child.get(Engine);
            matchers_1.expect(engineFromChild).toBe(engineFromParent);
        });
        it('should not use the child providers when resolving the dependencies of a parent provider', function () {
            var parent = core_1.Injector.create([Car.PROVIDER, Engine.PROVIDER]);
            var child = core_1.Injector.create([TurboEngine.PROVIDER], parent);
            var carFromChild = child.get(Car);
            matchers_1.expect(carFromChild.engine).toBeAnInstanceOf(Engine);
        });
        it('should create new instance in a child injector', function () {
            var parent = core_1.Injector.create([Engine.PROVIDER]);
            var child = core_1.Injector.create([TurboEngine.PROVIDER], parent);
            var engineFromParent = parent.get(Engine);
            var engineFromChild = child.get(Engine);
            matchers_1.expect(engineFromParent).not.toBe(engineFromChild);
            matchers_1.expect(engineFromChild).toBeAnInstanceOf(TurboEngine);
        });
        it('should give access to parent', function () {
            var parent = core_1.Injector.create([]);
            var child = core_1.Injector.create([], parent);
            matchers_1.expect(child.parent).toBe(parent);
        });
    });
    describe('instantiate', function () {
        it('should instantiate an object in the context of the injector', function () {
            var inj = core_1.Injector.create([Engine.PROVIDER]);
            var childInj = core_1.Injector.create([Car.PROVIDER], inj);
            var car = childInj.get(Car);
            matchers_1.expect(car).toBeAnInstanceOf(Car);
            matchers_1.expect(car.engine).toBe(inj.get(Engine));
        });
    });
    describe('dependency resolution', function () {
        describe('@Self()', function () {
            it('should return a dependency from self', function () {
                var inj = core_1.Injector.create([
                    Engine.PROVIDER,
                    { provide: Car, useFactory: function (e) { return new Car(e); }, deps: [[Engine, new core_1.Self()]] }
                ]);
                matchers_1.expect(inj.get(Car)).toBeAnInstanceOf(Car);
            });
            it('should throw when not requested provider on self', function () {
                var parent = core_1.Injector.create([Engine.PROVIDER]);
                var child = core_1.Injector.create([{ provide: Car, useFactory: function (e) { return new Car(e); }, deps: [[Engine, new core_1.Self()]] }], parent);
                matchers_1.expect(function () { return child.get(Car); })
                    .toThrowError("StaticInjectorError[" + util_1.stringify(Car) + " -> " + util_1.stringify(Engine) + "]: \n" +
                    '  NullInjectorError: No provider for Engine!');
            });
        });
        describe('default', function () {
            it('should skip self', function () {
                var parent = core_1.Injector.create([Engine.PROVIDER]);
                var child = core_1.Injector.create([
                    TurboEngine.PROVIDER,
                    { provide: Car, useFactory: function (e) { return new Car(e); }, deps: [[core_1.SkipSelf, Engine]] }
                ], parent);
                matchers_1.expect(child.get(Car).engine).toBeAnInstanceOf(Engine);
            });
        });
    });
    describe('resolve', function () {
        it('should throw when mixing multi providers with regular providers', function () {
            matchers_1.expect(function () {
                core_1.Injector.create([{ provide: Engine, useClass: BrokenEngine, deps: [], multi: true }, Engine.PROVIDER]);
            }).toThrowError(/Cannot mix multi providers and regular providers/);
            matchers_1.expect(function () {
                core_1.Injector.create([Engine.PROVIDER, { provide: Engine, useClass: BrokenEngine, deps: [], multi: true }]);
            }).toThrowError(/Cannot mix multi providers and regular providers/);
        });
        it('should resolve forward references', function () {
            var injector = core_1.Injector.create([
                [{ provide: core_1.forwardRef(function () { return BrokenEngine; }), useClass: core_1.forwardRef(function () { return Engine; }), deps: [] }], {
                    provide: core_1.forwardRef(function () { return String; }),
                    useFactory: function (e) { return e; },
                    deps: [core_1.forwardRef(function () { return BrokenEngine; })]
                }
            ]);
            matchers_1.expect(injector.get(String)).toBeAnInstanceOf(Engine);
            matchers_1.expect(injector.get(BrokenEngine)).toBeAnInstanceOf(Engine);
        });
        it('should support overriding factory dependencies with dependency annotations', function () {
            var injector = core_1.Injector.create([
                Engine.PROVIDER,
                { provide: 'token', useFactory: function (e) { return e; }, deps: [[new core_1.Inject(Engine)]] }
            ]);
            matchers_1.expect(injector.get('token')).toBeAnInstanceOf(Engine);
        });
    });
    describe('displayName', function () {
        it('should work', function () {
            matchers_1.expect(core_1.Injector.create([Engine.PROVIDER, { provide: BrokenEngine, useValue: null }]).toString())
                .toEqual('StaticInjector[Injector, InjectionToken INJECTOR, Engine, BrokenEngine]');
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljX2luamVjdG9yX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvZGkvc3RhdGljX2luamVjdG9yX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQW9IO0FBRXBILDJFQUFzRTtBQUV0RSx1Q0FBeUM7QUFFekM7SUFBQTtJQUVBLENBQUM7SUFEUSxlQUFRLEdBQUcsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQyxDQUFDO0lBQ2xFLGFBQUM7Q0FBQSxBQUZELElBRUM7QUFFRDtJQUVFO1FBQWdCLE1BQU0sSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7SUFBQyxDQUFDO0lBRDVDLHFCQUFRLEdBQUcsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQyxDQUFDO0lBRXhFLG1CQUFDO0NBQUEsQUFIRCxJQUdDO0FBRUQ7SUFBQTtJQUVBLENBQUM7SUFEUSwwQkFBUSxHQUFHLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDLENBQUM7SUFDeEYsd0JBQUM7Q0FBQSxBQUZELElBRUM7QUFFRDtJQUVFLG1CQUFZLFFBQTJCO0lBQUcsQ0FBQztJQURwQyxrQkFBUSxHQUFHLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLGlCQUFpQixDQUFDLEVBQUMsQ0FBQztJQUV6RixnQkFBQztDQUFBLEFBSEQsSUFHQztBQUVEO0lBQTBCLCtCQUFNO0lBQWhDOztJQUVBLENBQUM7SUFEUSxvQkFBUSxHQUFHLEVBQUMsT0FBTyxFQUFFLE1BQU0s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