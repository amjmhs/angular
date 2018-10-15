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
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var by_1 = require("@angular/platform-browser/src/dom/debug/by");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
{
    describe('integration tests', function () {
        var fixture;
        describe('directives', function () {
            it('should support dotted selectors', testing_1.async(function () {
                var MyDir = /** @class */ (function () {
                    function MyDir() {
                    }
                    __decorate([
                        core_1.Input('dot.name'),
                        __metadata("design:type", String)
                    ], MyDir.prototype, "value", void 0);
                    MyDir = __decorate([
                        core_1.Directive({ selector: '[dot.name]' })
                    ], MyDir);
                    return MyDir;
                }());
                testing_1.TestBed.configureTestingModule({
                    declarations: [
                        MyDir,
                        TestComponent,
                    ],
                });
                var template = "<div [dot.name]=\"'foo'\"></div>";
                fixture = createTestComponent(template);
                fixture.detectChanges();
                var myDir = fixture.debugElement.query(by_1.By.directive(MyDir)).injector.get(MyDir);
                matchers_1.expect(myDir.value).toEqual('foo');
            }));
        });
        describe('ng-container', function () {
            if (browser_util_1.browserDetection.isChromeDesktop) {
                it('should work regardless the namespace', testing_1.async(function () {
                    var MyCmp = /** @class */ (function () {
                        function MyCmp() {
                        }
                        MyCmp = __decorate([
                            core_1.Component({
                                selector: 'comp',
                                template: '<svg><ng-container *ngIf="1"><rect x="10" y="10" width="30" height="30"></rect></ng-container></svg>',
                            })
                        ], MyCmp);
                        return MyCmp;
                    }());
                    var f = testing_1.TestBed.configureTestingModule({ declarations: [MyCmp] }).createComponent(MyCmp);
                    f.detectChanges();
                    matchers_1.expect(f.nativeElement.children[0].children[0].tagName).toEqual('rect');
                }));
            }
        });
    });
}
var TestComponent = /** @class */ (function () {
    function TestComponent() {
    }
    TestComponent = __decorate([
        core_1.Component({ selector: 'test-cmp', template: '' })
    ], TestComponent);
    return TestComponent;
}());
function createTestComponent(template) {
    return testing_1.TestBed.overrideComponent(TestComponent, { set: { template: template } })
        .createComponent(TestComponent);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWdyYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvaW50ZWdyYXRpb25fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUEwRDtBQUMxRCxpREFBdUU7QUFDdkUsaUVBQThEO0FBQzlELG1GQUFvRjtBQUNwRiwyRUFBc0U7QUFFdEU7SUFDRSxRQUFRLENBQUMsbUJBQW1CLEVBQUU7UUFDNUIsSUFBSSxPQUF3QyxDQUFDO1FBRTdDLFFBQVEsQ0FBQyxZQUFZLEVBQUU7WUFDckIsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLGVBQUssQ0FBQztnQkFFdkM7b0JBQUE7b0JBR0EsQ0FBQztvQkFEb0I7d0JBQWxCLFlBQUssQ0FBQyxVQUFVLENBQUM7O3dEQUFpQjtvQkFGL0IsS0FBSzt3QkFEVixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFlBQVksRUFBQyxDQUFDO3VCQUM5QixLQUFLLENBR1Y7b0JBQUQsWUFBQztpQkFBQSxBQUhELElBR0M7Z0JBRUQsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQztvQkFDN0IsWUFBWSxFQUFFO3dCQUNaLEtBQUs7d0JBQ0wsYUFBYTtxQkFDZDtpQkFDRixDQUFDLENBQUM7Z0JBRUgsSUFBTSxRQUFRLEdBQUcsa0NBQWdDLENBQUM7Z0JBQ2xELE9BQU8sR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDeEMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN4QixJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxPQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbEYsaUJBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxjQUFjLEVBQUU7WUFDdkIsSUFBSSwrQkFBZ0IsQ0FBQyxlQUFlLEVBQUU7Z0JBQ3BDLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxlQUFLLENBQUM7b0JBTTVDO3dCQUFBO3dCQUNBLENBQUM7d0JBREssS0FBSzs0QkFMVixnQkFBUyxDQUFDO2dDQUNULFFBQVEsRUFBRSxNQUFNO2dDQUNoQixRQUFRLEVBQ0osc0dBQXNHOzZCQUMzRyxDQUFDOzJCQUNJLEtBQUssQ0FDVjt3QkFBRCxZQUFDO3FCQUFBLEFBREQsSUFDQztvQkFFRCxJQUFNLENBQUMsR0FDSCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDbkYsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO29CQUVsQixpQkFBTSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzFFLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDUjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7Q0FDSjtBQUdEO0lBQUE7SUFDQSxDQUFDO0lBREssYUFBYTtRQURsQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDLENBQUM7T0FDMUMsYUFBYSxDQUNsQjtJQUFELG9CQUFDO0NBQUEsQUFERCxJQUNDO0FBRUQsNkJBQTZCLFFBQWdCO0lBQzNDLE9BQU8saUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFDLEVBQUMsQ0FBQztTQUN2RSxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDdEMsQ0FBQyJ9