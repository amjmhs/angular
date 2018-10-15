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
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
{
    describe('di metadata examples', function () {
        describe('Inject', function () {
            it('works', function () {
                // #docregion Inject
                var Engine = /** @class */ (function () {
                    function Engine() {
                    }
                    return Engine;
                }());
                var Car = /** @class */ (function () {
                    function Car(engine) {
                        this.engine = engine;
                    }
                    Car = __decorate([
                        core_1.Injectable(),
                        __param(0, core_1.Inject('MyEngine')),
                        __metadata("design:paramtypes", [Engine])
                    ], Car);
                    return Car;
                }());
                var injector = core_1.ReflectiveInjector.resolveAndCreate([{ provide: 'MyEngine', useClass: Engine }, Car]);
                expect(injector.get(Car).engine instanceof Engine).toBe(true);
                // #enddocregion
            });
            it('works without decorator', function () {
                // #docregion InjectWithoutDecorator
                var Engine = /** @class */ (function () {
                    function Engine() {
                    }
                    return Engine;
                }());
                var Car = /** @class */ (function () {
                    function Car(engine) {
                        this.engine = engine;
                    } // same as constructor(@Inject(Engine) engine:Engine)
                    Car = __decorate([
                        core_1.Injectable(),
                        __metadata("design:paramtypes", [Engine])
                    ], Car);
                    return Car;
                }());
                var injector = core_1.ReflectiveInjector.resolveAndCreate([Engine, Car]);
                expect(injector.get(Car).engine instanceof Engine).toBe(true);
                // #enddocregion
            });
        });
        describe('Optional', function () {
            it('works', function () {
                // #docregion Optional
                var Engine = /** @class */ (function () {
                    function Engine() {
                    }
                    return Engine;
                }());
                var Car = /** @class */ (function () {
                    function Car(engine) {
                        this.engine = engine;
                    }
                    Car = __decorate([
                        core_1.Injectable(),
                        __param(0, core_1.Optional()),
                        __metadata("design:paramtypes", [Engine])
                    ], Car);
                    return Car;
                }());
                var injector = core_1.ReflectiveInjector.resolveAndCreate([Car]);
                expect(injector.get(Car).engine).toBeNull();
                // #enddocregion
            });
        });
        describe('Injectable', function () {
            it('works', function () {
                // #docregion Injectable
                var UsefulService = /** @class */ (function () {
                    function UsefulService() {
                    }
                    UsefulService = __decorate([
                        core_1.Injectable()
                    ], UsefulService);
                    return UsefulService;
                }());
                var NeedsService = /** @class */ (function () {
                    function NeedsService(service) {
                        this.service = service;
                    }
                    NeedsService = __decorate([
                        core_1.Injectable(),
                        __metadata("design:paramtypes", [UsefulService])
                    ], NeedsService);
                    return NeedsService;
                }());
                var injector = core_1.ReflectiveInjector.resolveAndCreate([NeedsService, UsefulService]);
                expect(injector.get(NeedsService).service instanceof UsefulService).toBe(true);
                // #enddocregion
            });
            it('throws without Injectable', function () {
                // #docregion InjectableThrows
                var UsefulService = /** @class */ (function () {
                    function UsefulService() {
                    }
                    return UsefulService;
                }());
                var NeedsService = /** @class */ (function () {
                    function NeedsService(service) {
                        this.service = service;
                    }
                    return NeedsService;
                }());
                expect(function () { return core_1.ReflectiveInjector.resolveAndCreate([NeedsService, UsefulService]); }).toThrow();
                // #enddocregion
            });
        });
        describe('Self', function () {
            it('works', function () {
                // #docregion Self
                var Dependency = /** @class */ (function () {
                    function Dependency() {
                    }
                    return Dependency;
                }());
                var NeedsDependency = /** @class */ (function () {
                    function NeedsDependency(dependency) {
                        this.dependency = dependency;
                    }
                    NeedsDependency = __decorate([
                        core_1.Injectable(),
                        __param(0, core_1.Self()),
                        __metadata("design:paramtypes", [Dependency])
                    ], NeedsDependency);
                    return NeedsDependency;
                }());
                var inj = core_1.ReflectiveInjector.resolveAndCreate([Dependency, NeedsDependency]);
                var nd = inj.get(NeedsDependency);
                expect(nd.dependency instanceof Dependency).toBe(true);
                inj = core_1.ReflectiveInjector.resolveAndCreate([Dependency]);
                var child = inj.resolveAndCreateChild([NeedsDependency]);
                expect(function () { return child.get(NeedsDependency); }).toThrowError();
                // #enddocregion
            });
        });
        describe('SkipSelf', function () {
            it('works', function () {
                // #docregion SkipSelf
                var Dependency = /** @class */ (function () {
                    function Dependency() {
                    }
                    return Dependency;
                }());
                var NeedsDependency = /** @class */ (function () {
                    function NeedsDependency(dependency) {
                        this.dependency = dependency;
                        this.dependency = dependency;
                    }
                    NeedsDependency = __decorate([
                        core_1.Injectable(),
                        __param(0, core_1.SkipSelf()),
                        __metadata("design:paramtypes", [Dependency])
                    ], NeedsDependency);
                    return NeedsDependency;
                }());
                var parent = core_1.ReflectiveInjector.resolveAndCreate([Dependency]);
                var child = parent.resolveAndCreateChild([NeedsDependency]);
                expect(child.get(NeedsDependency).dependency instanceof Dependency).toBe(true);
                var inj = core_1.ReflectiveInjector.resolveAndCreate([Dependency, NeedsDependency]);
                expect(function () { return inj.get(NeedsDependency); }).toThrowError();
                // #enddocregion
            });
        });
        describe('Host', function () {
            it('works', function () {
                // #docregion Host
                var OtherService = /** @class */ (function () {
                    function OtherService() {
                    }
                    return OtherService;
                }());
                var HostService = /** @class */ (function () {
                    function HostService() {
                    }
                    return HostService;
                }());
                var ChildDirective = /** @class */ (function () {
                    function ChildDirective(os, hs) {
                        this.logs = [];
                        // os is null: true
                        this.logs.push("os is null: " + (os === null));
                        // hs is an instance of HostService: true
                        this.logs.push("hs is an instance of HostService: " + (hs instanceof HostService));
                    }
                    ChildDirective = __decorate([
                        core_1.Directive({ selector: 'child-directive' }),
                        __param(0, core_1.Optional()), __param(0, core_1.Host()), __param(1, core_1.Optional()), __param(1, core_1.Host()),
                        __metadata("design:paramtypes", [OtherService, HostService])
                    ], ChildDirective);
                    return ChildDirective;
                }());
                var ParentCmp = /** @class */ (function () {
                    function ParentCmp() {
                    }
                    ParentCmp = __decorate([
                        core_1.Component({
                            selector: 'parent-cmp',
                            viewProviders: [HostService],
                            template: '<child-directive></child-directive>',
                        })
                    ], ParentCmp);
                    return ParentCmp;
                }());
                var App = /** @class */ (function () {
                    function App() {
                    }
                    App = __decorate([
                        core_1.Component({
                            selector: 'app',
                            viewProviders: [OtherService],
                            template: '<parent-cmp></parent-cmp>',
                        })
                    ], App);
                    return App;
                }());
                // #enddocregion
                testing_1.TestBed.configureTestingModule({
                    declarations: [App, ParentCmp, ChildDirective],
                });
                var cmp = undefined;
                expect(function () { return cmp = testing_1.TestBed.createComponent(App); }).not.toThrow();
                expect(cmp.debugElement.children[0].children[0].injector.get(ChildDirective).logs).toEqual([
                    'os is null: true',
                    'hs is an instance of HostService: true',
                ]);
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGFfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2NvcmUvZGkvdHMvbWV0YWRhdGFfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztBQUVILHNDQUEySDtBQUMzSCxpREFBZ0U7QUFFaEU7SUFDRSxRQUFRLENBQUMsc0JBQXNCLEVBQUU7UUFDL0IsUUFBUSxDQUFDLFFBQVEsRUFBRTtZQUNqQixFQUFFLENBQUMsT0FBTyxFQUFFO2dCQUNWLG9CQUFvQjtnQkFDcEI7b0JBQUE7b0JBQWMsQ0FBQztvQkFBRCxhQUFDO2dCQUFELENBQUMsQUFBZixJQUFlO2dCQUdmO29CQUNFLGFBQXVDLE1BQWM7d0JBQWQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtvQkFBRyxDQUFDO29CQURyRCxHQUFHO3dCQURSLGlCQUFVLEVBQUU7d0JBRUUsV0FBQSxhQUFNLENBQUMsVUFBVSxDQUFDLENBQUE7eURBQWdCLE1BQU07dUJBRGpELEdBQUcsQ0FFUjtvQkFBRCxVQUFDO2lCQUFBLEFBRkQsSUFFQztnQkFFRCxJQUFNLFFBQVEsR0FDVix5QkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFFeEYsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxZQUFZLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDOUQsZ0JBQWdCO1lBQ2xCLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLHlCQUF5QixFQUFFO2dCQUM1QixvQ0FBb0M7Z0JBQ3BDO29CQUFBO29CQUFjLENBQUM7b0JBQUQsYUFBQztnQkFBRCxDQUFDLEFBQWYsSUFBZTtnQkFHZjtvQkFDRSxhQUFtQixNQUFjO3dCQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7b0JBQ2pDLENBQUMsQ0FBRSxxREFBcUQ7b0JBRnBELEdBQUc7d0JBRFIsaUJBQVUsRUFBRTt5REFFZ0IsTUFBTTt1QkFEN0IsR0FBRyxDQUdSO29CQUFELFVBQUM7aUJBQUEsQUFIRCxJQUdDO2dCQUVELElBQU0sUUFBUSxHQUFHLHlCQUFrQixDQUFDLGdCQUFnQixDQUFDLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sWUFBWSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzlELGdCQUFnQjtZQUNsQixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLFVBQVUsRUFBRTtZQUNuQixFQUFFLENBQUMsT0FBTyxFQUFFO2dCQUNWLHNCQUFzQjtnQkFDdEI7b0JBQUE7b0JBQWMsQ0FBQztvQkFBRCxhQUFDO2dCQUFELENBQUMsQUFBZixJQUFlO2dCQUdmO29CQUNFLGFBQStCLE1BQWM7d0JBQWQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtvQkFBRyxDQUFDO29CQUQ3QyxHQUFHO3dCQURSLGlCQUFVLEVBQUU7d0JBRUUsV0FBQSxlQUFRLEVBQUUsQ0FBQTt5REFBZ0IsTUFBTTt1QkFEekMsR0FBRyxDQUVSO29CQUFELFVBQUM7aUJBQUEsQUFGRCxJQUVDO2dCQUVELElBQU0sUUFBUSxHQUFHLHlCQUFrQixDQUFDLGdCQUFnQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDNUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQzVDLGdCQUFnQjtZQUNsQixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLFlBQVksRUFBRTtZQUNyQixFQUFFLENBQUMsT0FBTyxFQUFFO2dCQUNWLHdCQUF3QjtnQkFFeEI7b0JBQUE7b0JBQ0EsQ0FBQztvQkFESyxhQUFhO3dCQURsQixpQkFBVSxFQUFFO3VCQUNQLGFBQWEsQ0FDbEI7b0JBQUQsb0JBQUM7aUJBQUEsQUFERCxJQUNDO2dCQUdEO29CQUNFLHNCQUFtQixPQUFzQjt3QkFBdEIsWUFBTyxHQUFQLE9BQU8sQ0FBZTtvQkFBRyxDQUFDO29CQUR6QyxZQUFZO3dCQURqQixpQkFBVSxFQUFFO3lEQUVpQixhQUFhO3VCQURyQyxZQUFZLENBRWpCO29CQUFELG1CQUFDO2lCQUFBLEFBRkQsSUFFQztnQkFFRCxJQUFNLFFBQVEsR0FBRyx5QkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNwRixNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLFlBQVksYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMvRSxnQkFBZ0I7WUFDbEIsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsMkJBQTJCLEVBQUU7Z0JBQzlCLDhCQUE4QjtnQkFDOUI7b0JBQUE7b0JBQXFCLENBQUM7b0JBQUQsb0JBQUM7Z0JBQUQsQ0FBQyxBQUF0QixJQUFzQjtnQkFFdEI7b0JBQ0Usc0JBQW1CLE9BQXNCO3dCQUF0QixZQUFPLEdBQVAsT0FBTyxDQUFlO29CQUFHLENBQUM7b0JBQy9DLG1CQUFDO2dCQUFELENBQUMsQUFGRCxJQUVDO2dCQUVELE1BQU0sQ0FBQyxjQUFNLE9BQUEseUJBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUMsRUFBbEUsQ0FBa0UsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUMzRixnQkFBZ0I7WUFDbEIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDZixFQUFFLENBQUMsT0FBTyxFQUFFO2dCQUNWLGtCQUFrQjtnQkFDbEI7b0JBQUE7b0JBQWtCLENBQUM7b0JBQUQsaUJBQUM7Z0JBQUQsQ0FBQyxBQUFuQixJQUFtQjtnQkFHbkI7b0JBQ0UseUJBQTJCLFVBQXNCO3dCQUF0QixlQUFVLEdBQVYsVUFBVSxDQUFZO29CQUFHLENBQUM7b0JBRGpELGVBQWU7d0JBRHBCLGlCQUFVLEVBQUU7d0JBRUUsV0FBQSxXQUFJLEVBQUUsQ0FBQTt5REFBb0IsVUFBVTt1QkFEN0MsZUFBZSxDQUVwQjtvQkFBRCxzQkFBQztpQkFBQSxBQUZELElBRUM7Z0JBRUQsSUFBSSxHQUFHLEdBQUcseUJBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDN0UsSUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFFcEMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLFlBQVksVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUV2RCxHQUFHLEdBQUcseUJBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxJQUFNLEtBQUssR0FBRyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLENBQUMsY0FBTSxPQUFBLEtBQUssQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEVBQTFCLENBQTBCLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDeEQsZ0JBQWdCO1lBQ2xCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsVUFBVSxFQUFFO1lBQ25CLEVBQUUsQ0FBQyxPQUFPLEVBQUU7Z0JBQ1Ysc0JBQXNCO2dCQUN0QjtvQkFBQTtvQkFBa0IsQ0FBQztvQkFBRCxpQkFBQztnQkFBRCxDQUFDLEFBQW5CLElBQW1CO2dCQUduQjtvQkFDRSx5QkFBK0IsVUFBc0I7d0JBQXRCLGVBQVUsR0FBVixVQUFVLENBQVk7d0JBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7b0JBQUMsQ0FBQztvQkFEcEYsZUFBZTt3QkFEcEIsaUJBQVUsRUFBRTt3QkFFRSxXQUFBLGVBQVEsRUFBRSxDQUFBO3lEQUFvQixVQUFVO3VCQURqRCxlQUFlLENBRXBCO29CQUFELHNCQUFDO2lCQUFBLEFBRkQsSUFFQztnQkFFRCxJQUFNLE1BQU0sR0FBRyx5QkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pFLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0JBQzlELE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLFVBQVUsWUFBWSxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRS9FLElBQU0sR0FBRyxHQUFHLHlCQUFrQixDQUFDLGdCQUFnQixDQUFDLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0JBQy9FLE1BQU0sQ0FBQyxjQUFNLE9BQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUN0RCxnQkFBZ0I7WUFDbEIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDZixFQUFFLENBQUMsT0FBTyxFQUFFO2dCQUNWLGtCQUFrQjtnQkFDbEI7b0JBQUE7b0JBQW9CLENBQUM7b0JBQUQsbUJBQUM7Z0JBQUQsQ0FBQyxBQUFyQixJQUFxQjtnQkFDckI7b0JBQUE7b0JBQW1CLENBQUM7b0JBQUQsa0JBQUM7Z0JBQUQsQ0FBQyxBQUFwQixJQUFvQjtnQkFHcEI7b0JBR0Usd0JBQWdDLEVBQWdCLEVBQXNCLEVBQWU7d0JBRnJGLFNBQUksR0FBYSxFQUFFLENBQUM7d0JBR2xCLG1CQUFtQjt3QkFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWUsRUFBRSxLQUFLLElBQUksQ0FBRSxDQUFDLENBQUM7d0JBQzdDLHlDQUF5Qzt3QkFDekMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsd0NBQXFDLEVBQUUsWUFBWSxXQUFXLENBQUUsQ0FBQyxDQUFDO29CQUNuRixDQUFDO29CQVJHLGNBQWM7d0JBRG5CLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsQ0FBQzt3QkFJMUIsV0FBQSxlQUFRLEVBQUUsQ0FBQSxFQUFFLFdBQUEsV0FBSSxFQUFFLENBQUEsRUFBb0IsV0FBQSxlQUFRLEVBQUUsQ0FBQSxFQUFFLFdBQUEsV0FBSSxFQUFFLENBQUE7eURBQWpDLFlBQVksRUFBMEIsV0FBVzt1QkFIakYsY0FBYyxDQVNuQjtvQkFBRCxxQkFBQztpQkFBQSxBQVRELElBU0M7Z0JBT0Q7b0JBQUE7b0JBQ0EsQ0FBQztvQkFESyxTQUFTO3dCQUxkLGdCQUFTLENBQUM7NEJBQ1QsUUFBUSxFQUFFLFlBQVk7NEJBQ3RCLGFBQWEsRUFBRSxDQUFDLFdBQVcsQ0FBQzs0QkFDNUIsUUFBUSxFQUFFLHFDQUFxQzt5QkFDaEQsQ0FBQzt1QkFDSSxTQUFTLENBQ2Q7b0JBQUQsZ0JBQUM7aUJBQUEsQUFERCxJQUNDO2dCQU9EO29CQUFBO29CQUNBLENBQUM7b0JBREssR0FBRzt3QkFMUixnQkFBUyxDQUFDOzRCQUNULFFBQVEsRUFBRSxLQUFLOzRCQUNmLGFBQWEsRUFBRSxDQUFDLFlBQVksQ0FBQzs0QkFDN0IsUUFBUSxFQUFFLDJCQUEyQjt5QkFDdEMsQ0FBQzt1QkFDSSxHQUFHLENBQ1I7b0JBQUQsVUFBQztpQkFBQSxBQURELElBQ0M7Z0JBQ0QsZ0JBQWdCO2dCQUVoQixpQkFBTyxDQUFDLHNCQUFzQixDQUFDO29CQUM3QixZQUFZLEVBQUUsQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLGNBQWMsQ0FBQztpQkFDL0MsQ0FBQyxDQUFDO2dCQUVILElBQUksR0FBRyxHQUEwQixTQUFXLENBQUM7Z0JBQzdDLE1BQU0sQ0FBQyxjQUFNLE9BQUEsR0FBRyxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxFQUFsQyxDQUFrQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUUvRCxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDO29CQUN6RixrQkFBa0I7b0JBQ2xCLHdDQUF3QztpQkFDekMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUVMLENBQUMsQ0FBQyxDQUFDO0NBQ0oifQ==