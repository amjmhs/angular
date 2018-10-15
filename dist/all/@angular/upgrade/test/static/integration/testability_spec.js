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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ng_zone_1 = require("@angular/core/src/zone/ng_zone");
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var static_1 = require("@angular/upgrade/static");
var angular = require("@angular/upgrade/static/src/common/angular1");
var test_helpers_1 = require("../test_helpers");
test_helpers_1.withEachNg1Version(function () {
    describe('testability', function () {
        beforeEach(function () { return core_1.destroyPlatform(); });
        afterEach(function () { return core_1.destroyPlatform(); });
        var Ng2Module = /** @class */ (function () {
            function Ng2Module() {
            }
            Ng2Module.prototype.ngDoBootstrap = function () { };
            Ng2Module = __decorate([
                core_1.NgModule({ imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule] })
            ], Ng2Module);
            return Ng2Module;
        }());
        it('should handle deferred bootstrap', testing_1.fakeAsync(function () {
            var applicationRunning = false;
            var stayedInTheZone = undefined;
            var ng1Module = angular.module('ng1', []).run(function () {
                applicationRunning = true;
                stayedInTheZone = ng_zone_1.NgZone.isInAngularZone();
            });
            var element = test_helpers_1.html('<div></div>');
            window.name = 'NG_DEFER_BOOTSTRAP!' + window.name;
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module);
            setTimeout(function () { window.angular.resumeBootstrap(); }, 100);
            expect(applicationRunning).toEqual(false);
            testing_1.tick(100);
            expect(applicationRunning).toEqual(true);
            expect(stayedInTheZone).toEqual(true);
        }));
        it('should propagate return value of resumeBootstrap', testing_1.fakeAsync(function () {
            var ng1Module = angular.module('ng1', []);
            var a1Injector;
            ng1Module.run([
                '$injector', function ($injector) { a1Injector = $injector; }
            ]);
            var element = test_helpers_1.html('<div></div>');
            window.name = 'NG_DEFER_BOOTSTRAP!' + window.name;
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module);
            testing_1.tick(100);
            var value = window.angular.resumeBootstrap();
            expect(value).toBe(a1Injector);
            testing_1.flush();
        }));
        it('should wait for ng2 testability', testing_1.fakeAsync(function () {
            var ng1Module = angular.module('ng1', []);
            var element = test_helpers_1.html('<div></div>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                var ng2Testability = upgrade.injector.get(core_1.Testability);
                ng2Testability.increasePendingRequestCount();
                var ng2Stable = false;
                var ng1Stable = false;
                angular.getTestability(element).whenStable(function () { ng1Stable = true; });
                setTimeout(function () {
                    ng2Stable = true;
                    ng2Testability.decreasePendingRequestCount();
                }, 100);
                expect(ng1Stable).toEqual(false);
                expect(ng2Stable).toEqual(false);
                testing_1.tick(100);
                expect(ng1Stable).toEqual(true);
                expect(ng2Stable).toEqual(true);
            });
        }));
        it('should not wait for $interval', testing_1.fakeAsync(function () {
            var ng1Module = angular.module('ng1', []);
            var element = test_helpers_1.html('<div></div>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                var ng2Testability = upgrade.injector.get(core_1.Testability);
                var $interval = upgrade.$injector.get('$interval');
                var ng2Stable = false;
                var intervalDone = false;
                var id = $interval(function (arg) {
                    // should only be called once
                    expect(intervalDone).toEqual(false);
                    intervalDone = true;
                    expect(ng_zone_1.NgZone.isInAngularZone()).toEqual(true);
                    expect(arg).toEqual('passed argument');
                }, 200, 0, true, 'passed argument');
                ng2Testability.whenStable(function () { ng2Stable = true; });
                testing_1.tick(100);
                expect(intervalDone).toEqual(false);
                expect(ng2Stable).toEqual(true);
                testing_1.tick(200);
                expect(intervalDone).toEqual(true);
                expect($interval.cancel(id)).toEqual(true);
                // Interval should not fire after cancel
                testing_1.tick(200);
            });
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGFiaWxpdHlfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvdGVzdC9zdGF0aWMvaW50ZWdyYXRpb24vdGVzdGFiaWxpdHlfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNDQUFxRTtBQUNyRSwwREFBc0Q7QUFDdEQsaURBQTZEO0FBQzdELDhEQUF3RDtBQUN4RCw4RUFBeUU7QUFDekUsa0RBQXNEO0FBQ3RELHFFQUF1RTtBQUV2RSxnREFBb0U7QUFFcEUsaUNBQWtCLENBQUM7SUFDakIsUUFBUSxDQUFDLGFBQWEsRUFBRTtRQUV0QixVQUFVLENBQUMsY0FBTSxPQUFBLHNCQUFlLEVBQUUsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO1FBQ3BDLFNBQVMsQ0FBQyxjQUFNLE9BQUEsc0JBQWUsRUFBRSxFQUFqQixDQUFpQixDQUFDLENBQUM7UUFHbkM7WUFBQTtZQUVBLENBQUM7WUFEQyxpQ0FBYSxHQUFiLGNBQWlCLENBQUM7WUFEZCxTQUFTO2dCQURkLGVBQVEsQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLGdDQUFhLEVBQUUsc0JBQWEsQ0FBQyxFQUFDLENBQUM7ZUFDOUMsU0FBUyxDQUVkO1lBQUQsZ0JBQUM7U0FBQSxBQUZELElBRUM7UUFFRCxFQUFFLENBQUMsa0NBQWtDLEVBQUUsbUJBQVMsQ0FBQztZQUM1QyxJQUFJLGtCQUFrQixHQUFHLEtBQUssQ0FBQztZQUMvQixJQUFJLGVBQWUsR0FBWSxTQUFXLENBQUM7WUFDM0MsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDO2dCQUM5QyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7Z0JBQzFCLGVBQWUsR0FBRyxnQkFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQzdDLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBTSxPQUFPLEdBQUcsbUJBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsSUFBSSxHQUFHLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFFbEQsd0JBQVMsQ0FBQyxpREFBc0IsRUFBRSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFFbkUsVUFBVSxDQUFDLGNBQWMsTUFBTyxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUVwRSxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1YsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVQLEVBQUUsQ0FBQyxrREFBa0QsRUFBRSxtQkFBUyxDQUFDO1lBQzVELElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLElBQUksVUFBOEMsQ0FBQztZQUNuRCxTQUFTLENBQUMsR0FBRyxDQUFDO2dCQUNaLFdBQVcsRUFBRSxVQUFTLFNBQW1DLElBQUksVUFBVSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUM7YUFDdkYsQ0FBQyxDQUFDO1lBQ0gsSUFBTSxPQUFPLEdBQUcsbUJBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsSUFBSSxHQUFHLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFFbEQsd0JBQVMsQ0FBQyxpREFBc0IsRUFBRSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFFbkUsY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRVYsSUFBTSxLQUFLLEdBQVMsTUFBTyxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN0RCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRS9CLGVBQUssRUFBRSxDQUFDO1FBQ1YsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVQLEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRSxtQkFBUyxDQUFDO1lBQzNDLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLElBQU0sT0FBTyxHQUFHLG1CQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFcEMsd0JBQVMsQ0FBQyxpREFBc0IsRUFBRSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsT0FBTztnQkFFOUUsSUFBTSxjQUFjLEdBQWdCLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGtCQUFXLENBQUMsQ0FBQztnQkFDdEUsY0FBYyxDQUFDLDJCQUEyQixFQUFFLENBQUM7Z0JBQzdDLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztnQkFDdEIsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO2dCQUV0QixPQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxjQUFRLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFeEUsVUFBVSxDQUFDO29CQUNULFNBQVMsR0FBRyxJQUFJLENBQUM7b0JBQ2pCLGNBQWMsQ0FBQywyQkFBMkIsRUFBRSxDQUFDO2dCQUMvQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBRVIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDakMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDakMsY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNWLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAsRUFBRSxDQUFDLCtCQUErQixFQUFFLG1CQUFTLENBQUM7WUFDekMsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDNUMsSUFBTSxPQUFPLEdBQUcsbUJBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUVwQyx3QkFBUyxDQUFDLGlEQUFzQixFQUFFLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxPQUFPO2dCQUU5RSxJQUFNLGNBQWMsR0FBZ0IsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsa0JBQVcsQ0FBQyxDQUFDO2dCQUN0RSxJQUFNLFNBQVMsR0FBNkIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBRS9FLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztnQkFDdEIsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO2dCQUV6QixJQUFNLEVBQUUsR0FBRyxTQUFTLENBQUMsVUFBQyxHQUFXO29CQUMvQiw2QkFBNkI7b0JBQzdCLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBRXBDLFlBQVksR0FBRyxJQUFJLENBQUM7b0JBQ3BCLE1BQU0sQ0FBQyxnQkFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMvQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3pDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO2dCQUVwQyxjQUFjLENBQUMsVUFBVSxDQUFDLGNBQVEsU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUV2RCxjQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRVYsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDcEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFaEMsY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNWLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ25DLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUUzQyx3Q0FBd0M7Z0JBQ3hDLGNBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNaLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNULENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==