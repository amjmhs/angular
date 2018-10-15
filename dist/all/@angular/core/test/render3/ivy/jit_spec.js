"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var defs_1 = require("@angular/core/src/di/defs");
var injectable_1 = require("@angular/core/src/di/injectable");
var injector_1 = require("@angular/core/src/di/injector");
var ivy_switch_1 = require("@angular/core/src/ivy_switch");
var directives_1 = require("@angular/core/src/metadata/directives");
var ng_module_1 = require("@angular/core/src/metadata/ng_module");
ivy_switch_1.ivyEnabled && describe('render3 jit', function () {
    var injector;
    beforeAll(function () { injector = injector_1.setCurrentInjector(null); });
    afterAll(function () { injector_1.setCurrentInjector(injector); });
    it('compiles a component', function () {
        var SomeCmp = /** @class */ (function () {
            function SomeCmp() {
            }
            SomeCmp = __decorate([
                directives_1.Component({
                    template: 'test',
                    selector: 'test-cmp',
                })
            ], SomeCmp);
            return SomeCmp;
        }());
        var SomeCmpAny = SomeCmp;
        expect(SomeCmpAny.ngComponentDef).toBeDefined();
        expect(SomeCmpAny.ngComponentDef.factory() instanceof SomeCmp).toBe(true);
    });
    it('compiles an injectable with a type provider', function () {
        var Service = /** @class */ (function () {
            function Service() {
            }
            Service = __decorate([
                injectable_1.Injectable({ providedIn: 'root' })
            ], Service);
            return Service;
        }());
        var ServiceAny = Service;
        expect(ServiceAny.ngInjectableDef).toBeDefined();
        expect(ServiceAny.ngInjectableDef.providedIn).toBe('root');
        expect(injector_1.inject(Service) instanceof Service).toBe(true);
    });
    it('compiles an injectable with a useValue provider', function () {
        var Service = /** @class */ (function () {
            function Service() {
            }
            Service = __decorate([
                injectable_1.Injectable({ providedIn: 'root', useValue: 'test' })
            ], Service);
            return Service;
        }());
        expect(injector_1.inject(Service)).toBe('test');
    });
    it('compiles an injectable with a useExisting provider', function () {
        var Existing = /** @class */ (function () {
            function Existing() {
            }
            Existing = __decorate([
                injectable_1.Injectable({ providedIn: 'root', useValue: 'test' })
            ], Existing);
            return Existing;
        }());
        var Service = /** @class */ (function () {
            function Service() {
            }
            Service = __decorate([
                injectable_1.Injectable({ providedIn: 'root', useExisting: Existing })
            ], Service);
            return Service;
        }());
        expect(injector_1.inject(Service)).toBe('test');
    });
    it('compiles an injectable with a useFactory provider, without deps', function () {
        var Service = /** @class */ (function () {
            function Service() {
            }
            Service = __decorate([
                injectable_1.Injectable({ providedIn: 'root', useFactory: function () { return 'test'; } })
            ], Service);
            return Service;
        }());
        expect(injector_1.inject(Service)).toBe('test');
    });
    it('compiles an injectable with a useFactory provider, with deps', function () {
        var Existing = /** @class */ (function () {
            function Existing() {
            }
            Existing = __decorate([
                injectable_1.Injectable({ providedIn: 'root', useValue: 'test' })
            ], Existing);
            return Existing;
        }());
        var Service = /** @class */ (function () {
            function Service() {
            }
            Service = __decorate([
                injectable_1.Injectable({ providedIn: 'root', useFactory: function (existing) { return existing; }, deps: [Existing] })
            ], Service);
            return Service;
        }());
        expect(injector_1.inject(Service)).toBe('test');
    });
    it('compiles an injectable with a useClass provider, with deps', function () {
        var Existing = /** @class */ (function () {
            function Existing() {
            }
            Existing = __decorate([
                injectable_1.Injectable({ providedIn: 'root', useValue: 'test' })
            ], Existing);
            return Existing;
        }());
        var Other = /** @class */ (function () {
            function Other(value) {
                this.value = value;
            }
            return Other;
        }());
        var Service = /** @class */ (function () {
            function Service() {
            }
            Object.defineProperty(Service.prototype, "value", {
                get: function () { return null; },
                enumerable: true,
                configurable: true
            });
            Service = __decorate([
                injectable_1.Injectable({ providedIn: 'root', useClass: Other, deps: [Existing] })
            ], Service);
            return Service;
        }());
        var ServiceAny = Service;
        expect(injector_1.inject(Service).value).toBe('test');
    });
    it('compiles an injectable with a useClass provider, without deps', function () {
        var _value = 1;
        var Existing = /** @class */ (function () {
            function Existing() {
                this.value = _value++;
            }
            Existing = __decorate([
                injectable_1.Injectable({ providedIn: 'root' })
            ], Existing);
            return Existing;
        }());
        var Service = /** @class */ (function () {
            function Service() {
            }
            Object.defineProperty(Service.prototype, "value", {
                get: function () { return 0; },
                enumerable: true,
                configurable: true
            });
            Service = __decorate([
                injectable_1.Injectable({ providedIn: 'root', useClass: Existing })
            ], Service);
            return Service;
        }());
        expect(injector_1.inject(Existing).value).toBe(1);
        var injected = injector_1.inject(Service);
        expect(injected instanceof Existing).toBe(true);
        expect(injected.value).toBe(2);
    });
    it('compiles a module to a definition', function () {
        var Cmp = /** @class */ (function () {
            function Cmp() {
            }
            Cmp = __decorate([
                directives_1.Component({
                    template: 'foo',
                    selector: 'foo',
                })
            ], Cmp);
            return Cmp;
        }());
        var Module = /** @class */ (function () {
            function Module() {
            }
            Module = __decorate([
                ng_module_1.NgModule({
                    declarations: [Cmp],
                })
            ], Module);
            return Module;
        }());
        var moduleDef = Module.ngModuleDef;
        expect(moduleDef).toBeDefined();
        expect(moduleDef.declarations.length).toBe(1);
        expect(moduleDef.declarations[0]).toBe(Cmp);
    });
    it('compiles a module to an ngInjectorDef with the providers', function () {
        var Token = /** @class */ (function () {
            function Token() {
            }
            Token.ngInjectableDef = defs_1.defineInjectable({
                providedIn: 'root',
                factory: function () { return 'default'; },
            });
            return Token;
        }());
        var Module = /** @class */ (function () {
            function Module(token) {
                this.token = token;
            }
            Module = __decorate([
                ng_module_1.NgModule({
                    providers: [{ provide: Token, useValue: 'test' }],
                }),
                __metadata("design:paramtypes", [Token])
            ], Module);
            return Module;
        }());
        var injectorDef = Module.ngInjectorDef;
        var instance = injectorDef.factory();
        // Since the instance was created outside of an injector using the module, the
        // injection will use the default provider, not the provider from the module.
        expect(instance.token).toBe('default');
        expect(injectorDef.providers).toEqual([{ provide: Token, useValue: 'test' }]);
    });
    it('patches a module onto the component', function () {
        var Cmp = /** @class */ (function () {
            function Cmp() {
            }
            Cmp = __decorate([
                directives_1.Component({
                    template: 'foo',
                    selector: 'foo',
                })
            ], Cmp);
            return Cmp;
        }());
        var cmpDef = Cmp.ngComponentDef;
        expect(cmpDef.directiveDefs).toBeNull();
        var Module = /** @class */ (function () {
            function Module() {
            }
            Module = __decorate([
                ng_module_1.NgModule({
                    declarations: [Cmp],
                })
            ], Module);
            return Module;
        }());
        var moduleDef = Module.ngModuleDef;
        expect(cmpDef.directiveDefs instanceof Function).toBe(true);
        expect(cmpDef.directiveDefs()).toEqual([cmpDef]);
    });
    it('should add hostbindings and hostlisteners', function () {
        var Cmp = /** @class */ (function () {
            function Cmp() {
                this.green = false;
            }
            Cmp.prototype.onChange = function (event) { };
            __decorate([
                directives_1.HostBinding('class.green'),
                __metadata("design:type", Boolean)
            ], Cmp.prototype, "green", void 0);
            __decorate([
                directives_1.HostListener('change', ['$event']),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", [Object]),
                __metadata("design:returntype", void 0)
            ], Cmp.prototype, "onChange", null);
            Cmp = __decorate([
                directives_1.Component({
                    template: 'foo',
                    selector: 'foo',
                    host: {
                        '[class.red]': 'isRed',
                        '(click)': 'onClick()',
                    },
                })
            ], Cmp);
            return Cmp;
        }());
        var cmpDef = Cmp.ngComponentDef;
        expect(cmpDef.hostBindings).toBeDefined();
        expect(cmpDef.hostBindings.length).toBe(2);
    });
    it('should compile @Pipes without errors', function () {
        var P = /** @class */ (function () {
            function P() {
            }
            P = __decorate([
                directives_1.Pipe({ name: 'test-pipe', pure: false })
            ], P);
            return P;
        }());
        var pipeDef = P.ngPipeDef;
        expect(pipeDef.name).toBe('test-pipe');
        expect(pipeDef.pure).toBe(false, 'pipe should not be pure');
        expect(pipeDef.factory() instanceof P)
            .toBe(true, 'factory() should create an instance of the pipe');
    });
    it('should default @Pipe to pure: true', function () {
        var P = /** @class */ (function () {
            function P() {
            }
            P = __decorate([
                directives_1.Pipe({ name: 'test-pipe' })
            ], P);
            return P;
        }());
        var pipeDef = P.ngPipeDef;
        expect(pipeDef.pure).toBe(true, 'pipe should be pure');
    });
});
it('ensure at least one spec exists', function () { });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaml0X3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVuZGVyMy9pdnkvaml0X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCw0QkFBMEI7QUFFMUIsa0RBQXdFO0FBQ3hFLDhEQUEyRDtBQUMzRCwwREFBeUU7QUFDekUsMkRBQXdEO0FBQ3hELG9FQUFpRztBQUNqRyxrRUFBbUY7QUFHbkYsdUJBQVUsSUFBSSxRQUFRLENBQUMsYUFBYSxFQUFFO0lBQ3BDLElBQUksUUFBYSxDQUFDO0lBQ2xCLFNBQVMsQ0FBQyxjQUFRLFFBQVEsR0FBRyw2QkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTFELFFBQVEsQ0FBQyxjQUFRLDZCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbEQsRUFBRSxDQUFDLHNCQUFzQixFQUFFO1FBS3pCO1lBQUE7WUFDQSxDQUFDO1lBREssT0FBTztnQkFKWixzQkFBUyxDQUFDO29CQUNULFFBQVEsRUFBRSxNQUFNO29CQUNoQixRQUFRLEVBQUUsVUFBVTtpQkFDckIsQ0FBQztlQUNJLE9BQU8sQ0FDWjtZQUFELGNBQUM7U0FBQSxBQURELElBQ0M7UUFDRCxJQUFNLFVBQVUsR0FBRyxPQUFjLENBQUM7UUFFbEMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNoRCxNQUFNLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsWUFBWSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNkNBQTZDLEVBQUU7UUFFaEQ7WUFBQTtZQUNBLENBQUM7WUFESyxPQUFPO2dC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