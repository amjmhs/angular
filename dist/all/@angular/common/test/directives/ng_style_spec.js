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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
{
    describe('NgStyle', function () {
        var fixture;
        function getComponent() { return fixture.componentInstance; }
        function expectNativeEl(fixture) {
            return expect(fixture.debugElement.children[0].nativeElement);
        }
        afterEach(function () { fixture = null; });
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({ declarations: [TestComponent], imports: [common_1.CommonModule] });
        });
        it('should add styles specified in an object literal', testing_1.async(function () {
            var template = "<div [ngStyle]=\"{'max-width': '40px'}\"></div>";
            fixture = createTestComponent(template);
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'max-width': '40px' });
        }));
        it('should add and change styles specified in an object expression', testing_1.async(function () {
            var template = "<div [ngStyle]=\"expr\"></div>";
            fixture = createTestComponent(template);
            getComponent().expr = { 'max-width': '40px' };
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'max-width': '40px' });
            var expr = getComponent().expr;
            expr['max-width'] = '30%';
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'max-width': '30%' });
        }));
        it('should add and remove styles specified using style.unit notation', testing_1.async(function () {
            var template = "<div [ngStyle]=\"{'max-width.px': expr}\"></div>";
            fixture = createTestComponent(template);
            getComponent().expr = '40';
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'max-width': '40px' });
            getComponent().expr = null;
            fixture.detectChanges();
            expectNativeEl(fixture).not.toHaveCssStyle('max-width');
        }));
        // https://github.com/angular/angular/issues/21064
        it('should add and remove styles which names are not dash-cased', testing_1.async(function () {
            fixture = createTestComponent("<div [ngStyle]=\"{'color': expr}\"></div>");
            getComponent().expr = 'green';
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'color': 'green' });
            getComponent().expr = null;
            fixture.detectChanges();
            expectNativeEl(fixture).not.toHaveCssStyle('color');
        }));
        it('should update styles using style.unit notation when unit changes', testing_1.async(function () {
            var template = "<div [ngStyle]=\"expr\"></div>";
            fixture = createTestComponent(template);
            getComponent().expr = { 'max-width.px': '40' };
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'max-width': '40px' });
            getComponent().expr = { 'max-width.em': '40' };
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'max-width': '40em' });
        }));
        // keyValueDiffer is sensitive to key order #9115
        it('should change styles specified in an object expression', testing_1.async(function () {
            var template = "<div [ngStyle]=\"expr\"></div>";
            fixture = createTestComponent(template);
            getComponent().expr = {
                // height, width order is important here
                height: '10px',
                width: '10px'
            };
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'height': '10px', 'width': '10px' });
            getComponent().expr = {
                // width, height order is important here
                width: '5px',
                height: '5px',
            };
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'height': '5px', 'width': '5px' });
        }));
        it('should remove styles when deleting a key in an object expression', testing_1.async(function () {
            var template = "<div [ngStyle]=\"expr\"></div>";
            fixture = createTestComponent(template);
            getComponent().expr = { 'max-width': '40px' };
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'max-width': '40px' });
            delete getComponent().expr['max-width'];
            fixture.detectChanges();
            expectNativeEl(fixture).not.toHaveCssStyle('max-width');
        }));
        it('should co-operate with the style attribute', testing_1.async(function () {
            var template = "<div style=\"font-size: 12px\" [ngStyle]=\"expr\"></div>";
            fixture = createTestComponent(template);
            getComponent().expr = { 'max-width': '40px' };
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'max-width': '40px', 'font-size': '12px' });
            delete getComponent().expr['max-width'];
            fixture.detectChanges();
            expectNativeEl(fixture).not.toHaveCssStyle('max-width');
            expectNativeEl(fixture).toHaveCssStyle({ 'font-size': '12px' });
        }));
        it('should co-operate with the style.[styleName]="expr" special-case in the compiler', testing_1.async(function () {
            var template = "<div [style.font-size.px]=\"12\" [ngStyle]=\"expr\"></div>";
            fixture = createTestComponent(template);
            getComponent().expr = { 'max-width': '40px' };
            fixture.detectChanges();
            expectNativeEl(fixture).toHaveCssStyle({ 'max-width': '40px', 'font-size': '12px' });
            delete getComponent().expr['max-width'];
            fixture.detectChanges();
            expectNativeEl(fixture).not.toHaveCssStyle('max-width');
            expectNativeEl(fixture).toHaveCssStyle({ 'font-size': '12px' });
        }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfc3R5bGVfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi90ZXN0L2RpcmVjdGl2ZXMvbmdfc3R5bGVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILDBDQUE2QztBQUM3QyxzQ0FBd0M7QUFDeEMsaURBQXVFO0FBRXZFO0lBQ0UsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNsQixJQUFJLE9BQThCLENBQUM7UUFFbkMsMEJBQXlDLE9BQU8sT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztRQUU1RSx3QkFBd0IsT0FBOEI7WUFDcEQsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDaEUsQ0FBQztRQUVELFNBQVMsQ0FBQyxjQUFRLE9BQU8sR0FBRyxJQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV2QyxVQUFVLENBQUM7WUFDVCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMscUJBQVksQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUMzRixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxrREFBa0QsRUFBRSxlQUFLLENBQUM7WUFDeEQsSUFBTSxRQUFRLEdBQUcsaURBQStDLENBQUM7WUFDakUsT0FBTyxHQUFHLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3hDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN4QixjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsY0FBYyxDQUFDLEVBQUMsV0FBVyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFDaEUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVQLEVBQUUsQ0FBQyxnRUFB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