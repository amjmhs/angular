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
var core_1 = require("../../../src/core");
var $r3$ = require("../../../src/core_render3_private_export");
var render_util_1 = require("../render_util");
/// See: `normative.md`
describe('injection', function () {
    describe('directives', function () {
        // Directives (and Components) should use `directiveInject`
        it('should inject ChangeDetectorRef', function () {
            var MyComp = /** @class */ (function () {
                function MyComp(cdr) {
                    this.cdr = cdr;
                    this.value = cdr.constructor.name;
                }
                MyComp_1 = MyComp;
                var MyComp_1;
                // NORMATIVE
                MyComp.ngComponentDef = $r3$.ɵdefineComponent({
                    type: MyComp_1,
                    selectors: [['my-comp']],
                    factory: function MyComp_Factory() {
                        return new MyComp_1($r3$.ɵinjectChangeDetectorRef());
                    },
                    template: function MyComp_Template(rf, ctx) {
                        if (rf & 1) {
                            $r3$.ɵT(0);
                        }
                        if (rf & 2) {
                            $r3$.ɵt(0, $r3$.ɵb(ctx.value));
                        }
                    }
                });
                MyComp = MyComp_1 = __decorate([
                    core_1.Component({ selector: 'my-comp', template: "{{ value }}" }),
                    __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
                ], MyComp);
                return MyComp;
            }());
            var MyApp = /** @class */ (function () {
                function MyApp() {
                }
                MyApp.ngComponentDef = $r3$.ɵdefineComponent({
                    type: MyApp,
                    selectors: [['my-app']],
                    factory: function MyApp_Factory() { return new MyApp(); },
                    /** <my-comp></my-comp> */
                    template: function MyApp_Template(rf, ctx) {
                        if (rf & 1) {
                            $r3$.ɵEe(0, 'my-comp');
                        }
                    },
                    directives: function () { return [MyComp]; }
                });
                return MyApp;
            }());
            var app = render_util_1.renderComponent(MyApp);
            // ChangeDetectorRef is the token, ViewRef is historically the constructor
            expect(render_util_1.toHtml(app)).toEqual('<my-comp>ViewRef</my-comp>');
        });
        it('should inject attributes', function () {
            var MyComp = /** @class */ (function () {
                function MyComp(title) {
                    this.title = title;
                }
                MyComp_2 = MyComp;
                var MyComp_2;
                // NORMATIVE
                MyComp.ngComponentDef = $r3$.ɵdefineComponent({
                    type: MyComp_2,
                    selectors: [['my-comp']],
                    factory: function MyComp_Factory() { return new MyComp_2($r3$.ɵinjectAttribute('title')); },
                    template: function MyComp_Template(rf, ctx) {
                        if (rf & 1) {
                            $r3$.ɵT(0);
                        }
                        if (rf & 2) {
                            $r3$.ɵt(0, $r3$.ɵb(ctx.title));
                        }
                    }
                });
                MyComp = MyComp_2 = __decorate([
                    core_1.Component({ selector: 'my-comp', template: "{{ title }}" }),
                    __param(0, core_1.Attribute('title')),
                    __metadata("design:paramtypes", [Object])
                ], MyComp);
                return MyComp;
            }());
            var MyApp = /** @class */ (function () {
                function MyApp() {
                }
                MyApp.ngComponentDef = $r3$.ɵdefineComponent({
                    type: MyApp,
                    selectors: [['my-app']],
                    factory: function MyApp_Factory() { return new MyApp(); },
                    /** <my-comp></my-comp> */
                    template: function MyApp_Template(rf, ctx) {
                        if (rf & 1) {
                            $r3$.ɵEe(0, 'my-comp', e0_attrs);
                        }
                    },
                    directives: function () { return [MyComp]; }
                });
                return MyApp;
            }());
            var e0_attrs = ['title', 'WORKS'];
            var app = render_util_1.renderComponent(MyApp);
            // ChangeDetectorRef is the token, ViewRef is historically the constructor
            expect(render_util_1.toHtml(app)).toEqual('<my-comp title="WORKS">WORKS</my-comp>');
        });
        // TODO(misko): enable once `providers` and `viewProvdires` are implemented.
        xit('should inject into an injectable', function () {
            var ServiceA = /** @class */ (function () {
                function ServiceA() {
                }
                ServiceA_1 = ServiceA;
                var ServiceA_1;
                // NORMATIVE
                ServiceA.ngInjectableDef = core_1.defineInjectable({
                    factory: function ServiceA_Factory() { return new ServiceA_1(); },
                });
                ServiceA = ServiceA_1 = __decorate([
                    core_1.Injectable()
                ], ServiceA);
                return ServiceA;
            }());
            var ServiceB = /** @class */ (function () {
                function ServiceB() {
                }
                ServiceB_1 = ServiceB;
                var ServiceB_1;
                // NORMATIVE
                ServiceB.ngInjectableDef = core_1.defineInjectable({
                    factory: function ServiceA_Factory() { return new ServiceB_1(); },
                });
                ServiceB = ServiceB_1 = __decorate([
                    core_1.Injectable()
                ], ServiceB);
                return ServiceB;
            }());
            var MyApp = /** @class */ (function () {
                function MyApp(serviceA, serviceB, injector) {
                }
                MyApp_1 = MyApp;
                var MyApp_1;
                MyApp.ngComponentDef = $r3$.ɵdefineComponent({
                    type: MyApp_1,
                    selectors: [['my-app']],
                    factory: function MyApp_Factory() {
                        return new MyApp_1($r3$.ɵdirectiveInject(ServiceA), $r3$.ɵdirectiveInject(ServiceB), core_1.inject(core_1.INJECTOR));
                    },
                    template: function MyApp_Template(rf, ctx) { },
                    providers: [ServiceA],
                    viewProviders: [ServiceB],
                });
                MyApp = MyApp_1 = __decorate([
                    core_1.Component({
                        template: '',
                        providers: [ServiceA],
                        viewProviders: [ServiceB],
                    }),
                    __metadata("design:paramtypes", [ServiceA, ServiceB, core_1.Injector])
                ], MyApp);
                return MyApp;
            }());
            var e0_attrs = ['title', 'WORKS'];
            var app = render_util_1.renderComponent(MyApp);
            // ChangeDetectorRef is the token, ViewRef is historically the constructor
            expect(render_util_1.toHtml(app)).toEqual('<my-comp title="WORKS">WORKS</my-comp>');
        });
    });
    describe('services', function () {
        // Services should use `inject`
        var ServiceA = /** @class */ (function () {
            function ServiceA(name, injector) {
            }
            ServiceA_2 = ServiceA;
            var ServiceA_2;
            // NORMATIVE
            ServiceA.ngInjectableDef = core_1.defineInjectable({
                factory: function ServiceA_Factory() {
                    return new ServiceA_2(core_1.inject(String), core_1.inject(core_1.INJECTOR));
                },
            });
            ServiceA = ServiceA_2 = __decorate([
                core_1.Injectable(),
                __param(0, core_1.Inject(String)),
                __metadata("design:paramtypes", [String, core_1.Injector])
            ], ServiceA);
            return ServiceA;
        }());
        var ServiceB = /** @class */ (function () {
            function ServiceB(serviceA, injector) {
            }
            ServiceB_2 = ServiceB;
            var ServiceB_2;
            // NORMATIVE
            ServiceB.ngInjectableDef = core_1.defineInjectable({
                factory: function ServiceA_Factory() {
                    return new ServiceB_2(core_1.inject(ServiceA), core_1.inject(core_1.INJECTOR, 4 /* SkipSelf */));
                },
            });
            ServiceB = ServiceB_2 = __decorate([
                core_1.Injectable(),
                __param(1, core_1.SkipSelf()),
                __metadata("design:paramtypes", [ServiceA, core_1.Injector])
            ], ServiceB);
            return ServiceB;
        }());
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0aW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVuZGVyMy9jb21waWxlcl9jYW5vbmljYWwvaW5qZWN0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7QUFFSCwwQ0FBOFo7QUFDOVosK0RBQWlFO0FBQ2pFLDhDQUF1RDtBQUl2RCx1QkFBdUI7QUFDdkIsUUFBUSxDQUFDLFdBQVcsRUFBRTtJQUdwQixRQUFRLENBQUMsWUFBWSxFQUFFO1FBQ3JCLDJEQUEyRDtRQUMzRCxFQUFFLENBQUMsaUNBQWlDLEVBQUU7WUFLcEM7Z0JBRUUsZ0JBQW1CLEdBQXNCO29CQUF0QixRQUFHLEdBQUgsR0FBRyxDQUFtQjtvQkFBSSxJQUFJLENBQUMsS0FBSyxHQUFJLEdBQUcsQ0FBQyxXQUFtQixDQUFDLElBQUksQ0FBQztnQkFBQyxDQUFDOzJCQUZ0RixNQUFNOztnQkFJVixZQUFZO2dCQUNMLHFCQUFjLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO29CQUM1QyxJQUFJLEVBQUUsUUFBTTtvQkFDWixTQUFTLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUN4QixPQUFPLEVBQUU7d0JBQ1AsT0FBTyxJQUFJLFFBQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxDQUFDO29CQUNyRCxDQUFDO29CQUNELFFBQVEsRUFBRSx5QkFBeUIsRUFBaUIsRUFBRSxHQUFhO3dCQUNqRSxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7NEJBQ1YsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDWjt3QkFDRCxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7NEJBQ1YsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMs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