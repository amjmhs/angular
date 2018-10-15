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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var static_1 = require("@angular/upgrade/static");
var angular = require("@angular/upgrade/static/src/common/angular1");
var test_helpers_1 = require("../test_helpers");
test_helpers_1.withEachNg1Version(function () {
    describe('scope/component change-detection', function () {
        beforeEach(function () { return core_1.destroyPlatform(); });
        afterEach(function () { return core_1.destroyPlatform(); });
        it('should interleave scope and component expressions', testing_1.async(function () {
            var log = [];
            var l = function (value) {
                log.push(value);
                return value + ';';
            };
            var Ng1aComponent = /** @class */ (function (_super) {
                __extends(Ng1aComponent, _super);
                function Ng1aComponent(elementRef, injector) {
                    return _super.call(this, 'ng1a', elementRef, injector) || this;
                }
                Ng1aComponent = __decorate([
                    core_1.Directive({ selector: 'ng1a' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1aComponent);
                return Ng1aComponent;
            }(static_1.UpgradeComponent));
            var Ng1bComponent = /** @class */ (function (_super) {
                __extends(Ng1bComponent, _super);
                function Ng1bComponent(elementRef, injector) {
                    return _super.call(this, 'ng1b', elementRef, injector) || this;
                }
                Ng1bComponent = __decorate([
                    core_1.Directive({ selector: 'ng1b' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1bComponent);
                return Ng1bComponent;
            }(static_1.UpgradeComponent));
            var Ng2Component = /** @class */ (function () {
                function Ng2Component() {
                    this.l = l;
                }
                Ng2Component = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: "{{l('2A')}}<ng1a></ng1a>{{l('2B')}}<ng1b></ng1b>{{l('2C')}}"
                    })
                ], Ng2Component);
                return Ng2Component;
            }());
            var Ng2Module = /** @class */ (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1aComponent, Ng1bComponent, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            var ng1Module = angular.module('ng1', [])
                .directive('ng1a', function () { return ({ template: '{{ l(\'ng1a\') }}' }); })
                .directive('ng1b', function () { return ({ template: '{{ l(\'ng1b\') }}' }); })
                .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                .run(function ($rootScope) {
                $rootScope.l = l;
                $rootScope.reset = function () { return log.length = 0; };
            });
            var element = test_helpers_1.html('<div>{{reset(); l(\'1A\');}}<ng2>{{l(\'1B\')}}</ng2>{{l(\'1C\')}}</div>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(document.body.textContent).toEqual('1A;2A;ng1a;2B;ng1b;2C;1C;');
                expect(log).toEqual(['1A', '1C', '2A', '2B', '2C', 'ng1a', 'ng1b']);
            });
        }));
        it('should propagate changes to a downgraded component inside the ngZone', testing_1.async(function () {
            var appComponent;
            var AppComponent = /** @class */ (function () {
                function AppComponent() {
                    appComponent = this;
                }
                AppComponent = __decorate([
                    core_1.Component({ selector: 'my-app', template: '<my-child [value]="value"></my-child>' }),
                    __metadata("design:paramtypes", [])
                ], AppComponent);
                return AppComponent;
            }());
            var ChildComponent = /** @class */ (function () {
                function ChildComponent(zone) {
                    this.zone = zone;
                }
                Object.defineProperty(ChildComponent.prototype, "value", {
                    set: function (v) { expect(core_1.NgZone.isInAngularZone()).toBe(true); },
                    enumerable: true,
                    configurable: true
                });
                ChildComponent.prototype.ngOnChanges = function (changes) {
                    var _this = this;
                    if (changes['value'].isFirstChange())
                        return;
                    this.zone.onMicrotaskEmpty.subscribe(function () { expect(element.textContent).toEqual('5'); });
                    Promise.resolve().then(function () { return _this.valueFromPromise = changes['value'].currentValue; });
                };
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Number),
                    __metadata("design:paramtypes", [Number])
                ], ChildComponent.prototype, "value", null);
                ChildComponent = __decorate([
                    core_1.Component({
                        selector: 'my-child',
                        template: '<div>{{ valueFromPromise }}</div>',
                    }),
                    __metadata("design:paramtypes", [core_1.NgZone])
                ], ChildComponent);
                return ChildComponent;
            }());
            var Ng2Module = /** @class */ (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [AppComponent, ChildComponent],
                        entryComponents: [AppComponent],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            var ng1Module = angular.module('ng1', []).directive('myApp', static_1.downgradeComponent({ component: AppComponent }));
            var element = test_helpers_1.html('<my-app></my-app>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                appComponent.value = 5;
            });
        }));
        // This test demonstrates https://github.com/angular/angular/issues/6385
        // which was invalidly fixed by https://github.com/angular/angular/pull/6386
        // it('should not trigger $digest from an async operation in a watcher', async(() => {
        //      @Component({selector: 'my-app', template: ''})
        //      class AppComponent {
        //      }
        //      @NgModule({declarations: [AppComponent], imports: [BrowserModule]})
        //      class Ng2Module {
        //      }
        //      const adapter: UpgradeAdapter = new UpgradeAdapter(forwardRef(() => Ng2Module));
        //      const ng1Module = angular.module('ng1', []).directive(
        //          'myApp', adapter.downgradeNg2Component(AppComponent));
        //      const element = html('<my-app></my-app>');
        //      adapter.bootstrap(element, ['ng1']).ready((ref) => {
        //        let doTimeout = false;
        //        let timeoutId: number;
        //        ref.ng1RootScope.$watch(() => {
        //          if (doTimeout && !timeoutId) {
        //            timeoutId = window.setTimeout(function() {
        //              timeoutId = null;
        //            }, 10);
        //          }
        //        });
        //        doTimeout = true;
        //      });
        //    }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlX2RldGVjdGlvbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvdXBncmFkZS90ZXN0L3N0YXRpYy9pbnRlZ3JhdGlvbi9jaGFuZ2VfZGV0ZWN0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQWdKO0FBQ2hKLGlEQUE0QztBQUM1Qyw4REFBd0Q7QUFDeEQsOEVBQXlFO0FBQ3pFLGtEQUE0RjtBQUM1RixxRUFBdUU7QUFFdkUsZ0RBQW9FO0FBRXBFLGlDQUFrQixDQUFDO0lBQ2pCLFFBQVEsQ0FBQyxrQ0FBa0MsRUFBRTtRQUMzQyxVQUFVLENBQUMsY0FBTSxPQUFBLHNCQUFlLEVBQUUsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO1FBQ3BDLFNBQVMsQ0FBQyxjQUFNLE9BQUEsc0JBQWUsRUFBRSxFQUFqQixDQUFpQixDQUFDLENBQUM7UUFFbkMsRUFBRSxDQUFDLG1EQUFtRCxFQUFFLGVBQUssQ0FBQztZQUN6RCxJQUFNLEdBQUcsR0FBYSxFQUFFLENBQUM7WUFDekIsSUFBTSxDQUFDLEdBQUcsVUFBQyxLQUFhO2dCQUN0QixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNoQixPQUFPLEtBQUssR0FBRyxHQUFHLENBQUM7WUFDckIsQ0FBQyxDQUFDO1lBR0Y7Z0JBQTRCLGlDQUFnQjtnQkFDMUMsdUJBQVksVUFBc0IsRUFBRSxRQUFrQjsyQkFDcEQsa0JBQU0sTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUM7Z0JBQ3JDLENBQUM7Z0JBSEcsYUFBYTtvQkFEbEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUMsQ0FBQztxREFFSixpQkFBVSxFQUFZLGVBQVE7bUJBRGxELGFBQWEsQ0FJbEI7Z0JBQUQsb0JBQUM7YUFBQSxBQUpELENBQTRCLHlCQUFnQixHQUkzQztZQUdEO2dCQUE0QixpQ0FBZ0I7Z0JBQzFDLHVCQUFZLFVBQXNCLEVBQUUsUUFBa0I7MkJBQ3BELGtCQUFNLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDO2dCQUNyQyxDQUFDO2dCQUhHLGFBQWE7b0JBRGxCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDLENBQUM7cURBRUosaUJBQVUsRUFBWSxlQUFRO21CQURsRCxhQUFhLENBSWxCO2dCQUFELG9CQUFDO2FBQUEsQUFKRCxDQUE0Qix5QkFBZ0IsR0FJM0M7WUFNRDtnQkFKQTtvQkFLRSxNQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNSLENBQUM7Z0JBRkssWUFBWTtvQkFKakIsZ0JBQVMsQ0FBQzt3QkFDVCxRQUFRLEVBQUUsS0FBSzt3QkFDZixRQUFRLEVBQUUsNkRBQTZEO3FCQUN4RSxDQUFDO21CQUNJLFlBQVksQ0FFakI7Z0JBQUQsbUJBQUM7YUFBQSxBQUZELElBRUM7WUFPRDtnQkFBQTtnQkFFQSxDQUFDO2dCQURDLGlDQUFhLEdBQWIsY0FBaUIsQ0FBQztnQkFEZCxTQUFTO29CQUxkLGVBQVEsQ0FBQzt3QkFDUixZQUFZLEVBQUUsQ0FBQyxhQUFhLEVBQUUsYUFBYSxFQUFFLFlBQVksQ0FBQzt3QkFDMUQsZUFBZSxFQUFFLENBQUMsWUFBWSxDQUFDO3dCQUMvQixPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxFQUFFLHNCQUFhLENBQUM7cUJBQ3hDLENBQUM7bUJBQ0ksU0FBUyxDQUVkO2dCQUFELGdCQUFDO2FBQUEsQUFGRCxJQUVDO1lBRUQsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO2lCQUNwQixTQUFTLENBQUMsTUFBTSxFQUFFLGNBQU0sT0FBQSxDQUFDLEVBQUMsUUFBUSxFQUFFLG1CQUFtQixFQUFDLENBQUMsRUFBakMsQ0FBaUMsQ0FBQztpQkFDMUQsU0FBUyxDQUFDLE1BQU0sRUFBRSxjQUFNLE9BQUEsQ0FBQyxFQUFDLFFBQVEsRUFBRSxtQkFBbUIsRUFBQyxDQUFDLEVBQWpDLENBQWlDLENBQUM7aUJBQzFELFNBQVMsQ0FBQyxLQUFLLEVBQUUsMkJBQWtCLENBQUMsRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FBQztpQkFDL0QsR0FBRyxDQUFDLFVBQUMsVUFBcUM7Z0JBQ3pDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQixVQUFVLENBQUMsS0FBSyxHQUFHLGNBQU0sT0FBQSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBZCxDQUFjLENBQUM7WUFDMUMsQ0FBQyxDQUFDLENBQUM7WUFFekIsSUFBTSxPQUFPLEdBQ1QsbUJBQUksQ0FBQyx5RUFBeUUsQ0FBQyxDQUFDO1lBQ3BGLHdCQUFTLENBQUMsaURBQXNCLEVBQUUsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLE9BQU87Z0JBQzlFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO2dCQUN2RSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN0RSxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxFQUFFLENBQUMsc0VBQXNFLEVBQUUsZUFBSyxDQUFDO1lBQzVFLElBQUksWUFBMEIsQ0FBQztZQUcvQjtnQkFHRTtvQkFBZ0IsWUFBWSxHQUFHLElBQUksQ0FBQztnQkFBQyxDQUFDO2dCQUhsQyxZQUFZO29CQURqQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsdUNBQXVDLEVBQUMsQ0FBQzs7bUJBQzdFLFlBQVksQ0FJakI7Z0JBQUQsbUJBQUM7YUFBQSxBQUpELElBSUM7WUFNRDtnQkFNRSx3QkFBb0IsSUFBWTtvQkFBWixTQUFJLEdBQUosSUFBSSxDQUFRO2dCQUFHLENBQUM7Z0JBRnBDLHNCQUFJLGlDQUFLO3lCQUFULFVBQVUsQ0FBUyxJQUFJLE1BQU0sQ0FBQyxhQUFNLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7bUJBQUE7Z0JBSXJFLG9DQUFXLEdBQVgsVUFBWSxPQUFzQjtvQkFBbEMsaUJBT0M7b0JBTkMsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxFQUFFO3dCQUFFLE9BQU87b0JBRTdDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUNoQyxjQUFRLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRXpELE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxFQUFyRCxDQUFxRCxDQUFDLENBQUM7Z0JBQ3RGLENBQUM7Z0JBWEQ7b0JBREMsWUFBSyxFQUFFOzs7MkRBQzZEO2dCQUpqRSxjQUFjO29CQUpuQixnQkFBUyxDQUFDO3dCQUNULFFBQVEsRUFBRSxVQUFVO3dCQUNwQixRQUFRLEVBQUUsbUNBQW1DO3FCQUM5QyxDQUFDO3FEQU8wQixhQUFNO21CQU41QixjQUFjLENBZ0JuQjtnQkFBRCxxQkFBQzthQUFBLEFBaEJELElBZ0JDO1lBT0Q7Z0JBQUE7Z0JBRUEsQ0FBQztnQkFEQyxpQ0FBYSxHQUFiLGNBQWlCLENBQUM7Z0JBRGQsU0FBUztvQkFMZCxlQUFRLENBQUM7d0JBQ1IsWUFBWSxFQUFFLENBQUMsWUFBWSxFQUFFLGNBQWMsQ0FBQzt3QkFDNUMsZUFBZSxFQUFFLENBQUMsWUFBWSxDQUFDO3dCQUMvQixPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxFQUFFLHNCQUFhLENBQUM7cUJBQ3hDLENBQUM7bUJBQ0ksU0FBUyxDQUVkO2dCQUFELGdCQUFDO2FBQUEsQUFGRCxJQUVDO1lBRUQsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUNqRCxPQUFPLEVBQUUsMkJBQWtCLENBQUMsRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBRzVELElBQU0sT0FBTyxHQUFHLG1CQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUUxQyx3QkFBUyxDQUFDLGlEQUFzQixFQUFFLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxPQUFPO2dCQUM5RSxZQUFZLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUN6QixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCx3RUFBd0U7UUFDeEUsNEVBQTRFO1FBQzVFLHNGQUFzRjtRQUN0RixzREFBc0Q7UUFDdEQsNEJBQTRCO1FBQzVCLFNBQVM7UUFFVCwyRUFBMkU7UUFDM0UseUJBQXlCO1FBQ3pCLFNBQVM7UUFFVCx3RkFBd0Y7UUFDeEYsOERBQThEO1FBQzlELGtFQUFrRTtRQUVsRSxrREFBa0Q7UUFFbEQsNERBQTREO1FBQzVELGdDQUFnQztRQUNoQyxnQ0FBZ0M7UUFDaEMseUNBQXlDO1FBQ3pDLDBDQUEwQztRQUMxQyx3REFBd0Q7UUFDeEQsaUNBQWlDO1FBQ2pDLHFCQUFxQjtRQUNyQixhQUFhO1FBQ2IsYUFBYTtRQUNiLDJCQUEyQjtRQUMzQixXQUFXO1FBQ1gsVUFBVTtJQUNaLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==