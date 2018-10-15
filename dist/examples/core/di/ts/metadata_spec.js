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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const testing_1 = require("@angular/core/testing");
{
    describe('di metadata examples', () => {
        describe('Inject', () => {
            it('works', () => {
                // #docregion Inject
                class Engine {
                }
                let Car = class Car {
                    constructor(engine) {
                        this.engine = engine;
                    }
                };
                Car = __decorate([
                    core_1.Injectable(),
                    __param(0, core_1.Inject('MyEngine')),
                    __metadata("design:paramtypes", [Engine])
                ], Car);
                const injector = core_1.ReflectiveInjector.resolveAndCreate([{ provide: 'MyEngine', useClass: Engine }, Car]);
                expect(injector.get(Car).engine instanceof Engine).toBe(true);
                // #enddocregion
            });
            it('works without decorator', () => {
                // #docregion InjectWithoutDecorator
                class Engine {
                }
                let Car = class Car {
                    constructor(engine) {
                        this.engine = engine;
                    } // same as constructor(@Inject(Engine) engine:Engine)
                };
                Car = __decorate([
                    core_1.Injectable(),
                    __metadata("design:paramtypes", [Engine])
                ], Car);
                const injector = core_1.ReflectiveInjector.resolveAndCreate([Engine, Car]);
                expect(injector.get(Car).engine instanceof Engine).toBe(true);
                // #enddocregion
            });
        });
        describe('Optional', () => {
            it('works', () => {
                // #docregion Optional
                class Engine {
                }
                let Car = class Car {
                    constructor(engine) {
                        this.engine = engine;
                    }
                };
                Car = __decorate([
                    core_1.Injectable(),
                    __param(0, core_1.Optional()),
                    __metadata("design:paramtypes", [Engine])
                ], Car);
                const injector = core_1.ReflectiveInjector.resolveAndCreate([Car]);
                expect(injector.get(Car).engine).toBeNull();
                // #enddocregion
            });
        });
        describe('Injectable', () => {
            it('works', () => {
                // #docregion Injectable
                let UsefulService = class UsefulService {
                };
                UsefulService = __decorate([
                    core_1.Injectable()
                ], UsefulService);
                let NeedsService = class NeedsService {
                    constructor(service) {
                        this.service = service;
                    }
                };
                NeedsService = __decorate([
                    core_1.Injectable(),
                    __metadata("design:paramtypes", [UsefulService])
                ], NeedsService);
                const injector = core_1.ReflectiveInjector.resolveAndCreate([NeedsService, UsefulService]);
                expect(injector.get(NeedsService).service instanceof UsefulService).toBe(true);
                // #enddocregion
            });
            it('throws without Injectable', () => {
                // #docregion InjectableThrows
                class UsefulService {
                }
                class NeedsService {
                    constructor(service) {
                        this.service = service;
                    }
                }
                expect(() => core_1.ReflectiveInjector.resolveAndCreate([NeedsService, UsefulService])).toThrow();
                // #enddocregion
            });
        });
        describe('Self', () => {
            it('works', () => {
                // #docregion Self
                class Dependency {
                }
                let NeedsDependency = class NeedsDependency {
                    constructor(dependency) {
                        this.dependency = dependency;
                    }
                };
                NeedsDependency = __decorate([
                    core_1.Injectable(),
                    __param(0, core_1.Self()),
                    __metadata("design:paramtypes", [Dependency])
                ], NeedsDependency);
                let inj = core_1.ReflectiveInjector.resolveAndCreate([Dependency, NeedsDependency]);
                const nd = inj.get(NeedsDependency);
                expect(nd.dependency instanceof Dependency).toBe(true);
                inj = core_1.ReflectiveInjector.resolveAndCreate([Dependency]);
                const child = inj.resolveAndCreateChild([NeedsDependency]);
                expect(() => child.get(NeedsDependency)).toThrowError();
                // #enddocregion
            });
        });
        describe('SkipSelf', () => {
            it('works', () => {
                // #docregion SkipSelf
                class Dependency {
                }
                let NeedsDependency = class NeedsDependency {
                    constructor(dependency) {
                        this.dependency = dependency;
                        this.dependency = dependency;
                    }
                };
                NeedsDependency = __decorate([
                    core_1.Injectable(),
                    __param(0, core_1.SkipSelf()),
                    __metadata("design:paramtypes", [Dependency])
                ], NeedsDependency);
                const parent = core_1.ReflectiveInjector.resolveAndCreate([Dependency]);
                const child = parent.resolveAndCreateChild([NeedsDependency]);
                expect(child.get(NeedsDependency).dependency instanceof Dependency).toBe(true);
                const inj = core_1.ReflectiveInjector.resolveAndCreate([Dependency, NeedsDependency]);
                expect(() => inj.get(NeedsDependency)).toThrowError();
                // #enddocregion
            });
        });
        describe('Host', () => {
            it('works', () => {
                // #docregion Host
                class OtherService {
                }
                class HostService {
                }
                let ChildDirective = class ChildDirective {
                    constructor(os, hs) {
                        this.logs = [];
                        // os is null: true
                        this.logs.push(`os is null: ${os === null}`);
                        // hs is an instance of HostService: true
                        this.logs.push(`hs is an instance of HostService: ${hs instanceof HostService}`);
                    }
                };
                ChildDirective = __decorate([
                    core_1.Directive({ selector: 'child-directive' }),
                    __param(0, core_1.Optional()), __param(0, core_1.Host()), __param(1, core_1.Optional()), __param(1, core_1.Host()),
                    __metadata("design:paramtypes", [OtherService, HostService])
                ], ChildDirective);
                let ParentCmp = class ParentCmp {
                };
                ParentCmp = __decorate([
                    core_1.Component({
                        selector: 'parent-cmp',
                        viewProviders: [HostService],
                        template: '<child-directive></child-directive>',
                    })
                ], ParentCmp);
                let App = class App {
                };
                App = __decorate([
                    core_1.Component({
                        selector: 'app',
                        viewProviders: [OtherService],
                        template: '<parent-cmp></parent-cmp>',
                    })
                ], App);
                // #enddocregion
                testing_1.TestBed.configureTestingModule({
                    declarations: [App, ParentCmp, ChildDirective],
                });
                let cmp = undefined;
                expect(() => cmp = testing_1.TestBed.createComponent(App)).not.toThrow();
                expect(cmp.debugElement.children[0].children[0].injector.get(ChildDirective).logs).toEqual([
                    'os is null: true',
                    'hs is an instance of HostService: true',
                ]);
            });
        });
    });
}
//# sourceMappingURL=metadata_spec.js.map