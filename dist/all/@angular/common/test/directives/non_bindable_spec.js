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
var element_ref_1 = require("@angular/core/src/linker/element_ref");
var testing_1 = require("@angular/core/testing");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
{
    describe('non-bindable', function () {
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [TestComponent, TestDirective],
            });
        });
        it('should not interpolate children', testing_1.async(function () {
            var template = '<div>{{text}}<span ngNonBindable>{{text}}</span></div>';
            var fixture = createTestComponent(template);
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('foo{{text}}');
        }));
        it('should ignore directives on child nodes', testing_1.async(function () {
            var template = '<div ngNonBindable><span id=child test-dec>{{text}}</span></div>';
            var fixture = createTestComponent(template);
            fixture.detectChanges();
            // We must use getDOM().querySelector instead of fixture.query here
            // since the elements inside are not compiled.
            var span = dom_adapter_1.getDOM().querySelector(fixture.nativeElement, '#child');
            matchers_1.expect(dom_adapter_1.getDOM().hasClass(span, 'compiled')).toBeFalsy();
        }));
        it('should trigger directives on the same node', testing_1.async(function () {
            var template = '<div><span id=child ngNonBindable test-dec>{{text}}</span></div>';
            var fixture = createTestComponent(template);
            fixture.detectChanges();
            var span = dom_adapter_1.getDOM().querySelector(fixture.nativeElement, '#child');
            matchers_1.expect(dom_adapter_1.getDOM().hasClass(span, 'compiled')).toBeTruthy();
        }));
    });
}
var TestDirective = /** @class */ (function () {
    function TestDirective(el) {
        dom_adapter_1.getDOM().addClass(el.nativeElement, 'compiled');
    }
    TestDirective = __decorate([
        core_1.Directive({ selector: '[test-dec]' }),
        __metadata("design:paramtypes", [element_ref_1.ElementRef])
    ], TestDirective);
    return TestDirective;
}());
var TestComponent = /** @class */ (function () {
    function TestComponent() {
        this.text = 'foo';
    }
    TestComponent = __decorate([
        core_1.Component({ selector: 'test-cmp', template: '' }),
        __metadata("design:paramtypes", [])
    ], TestComponent);
    return TestComponent;
}());
function createTestComponent(template) {
    return testing_1.TestBed.overrideComponent(TestComponent, { set: { template: template } })
        .createComponent(TestComponent);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9uX2JpbmRhYmxlX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vdGVzdC9kaXJlY3RpdmVzL25vbl9iaW5kYWJsZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQW1EO0FBQ25ELG9FQUFnRTtBQUNoRSxpREFBdUU7QUFDdkUsNkVBQXFFO0FBQ3JFLDJFQUFzRTtBQUV0RTtJQUNFLFFBQVEsQ0FBQyxjQUFjLEVBQUU7UUFFdkIsVUFBVSxDQUFDO1lBQ1QsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQztnQkFDN0IsWUFBWSxFQUFFLENBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQzthQUM3QyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRSxlQUFLLENBQUM7WUFDdkMsSUFBTSxRQUFRLEdBQUcsd0RBQXdELENBQUM7WUFDMUUsSUFBTSxPQUFPLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFOUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3hCLGlCQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMxRCxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAsRUFBRSxDQUFDLHlDQUF5QyxFQUFFLGVBQUssQ0FBQztZQUMvQyxJQUFNLFFBQVEsR0FBRyxrRUFBa0UsQ0FBQztZQUNwRixJQUFNLE9BQU8sR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM5QyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7WUFFeEIsbUVBQW1FO1lBQ25FLDhDQUE4QztZQUM5QyxJQUFNLElBQUksR0FBRyxvQkFBTSxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDckUsaUJBQU0sQ0FBQyxvQkFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzFELENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxFQUFFLENBQUMsNENBQTRDLEVBQUUsZUFBSyxDQUFDO1lBQ2xELElBQU0sUUFBUSxHQUFHLGtFQUFrRSxDQUFDO1lBQ3BGLElBQU0sT0FBTyxHQUFHLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN4QixJQUFNLElBQUksR0FBRyxvQkFBTSxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDckUsaUJBQU0sQ0FBQyxvQkFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzNELENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztDQUNKO0FBR0Q7SUFDRSx1QkFBWSxFQUFjO1FBQUksb0JBQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQUMsQ0FBQztJQUQ1RSxhQUFhO1FBRGxCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsWUFBWSxFQUFDLENBQUM7eUNBRWxCLHdCQUFVO09BRHRCLGFBQWEsQ0FFbEI7SUFBRCxvQkFBQztDQUFBLEFBRkQsSUFFQztBQUdEO0lBRUU7UUFBZ0IsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7SUFBQyxDQUFDO0lBRmhDLGFBQWE7UUFEbEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBQyxDQUFDOztPQUMxQyxhQUFhLENBR2xCO0lBQUQsb0JBQUM7Q0FBQSxBQUhELElBR0M7QUFFRCw2QkFBNkIsUUFBZ0I7SUFDM0MsT0FBTyxpQkFBTyxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxFQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUMsRUFBQyxDQUFDO1NBQ3ZFLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN0QyxDQUFDIn0=