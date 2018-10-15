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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
{
    describe('NgSwitch', function () {
        var fixture;
        function getComponent() { return fixture.componentInstance; }
        function detectChangesAndExpectText(text) {
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText(text);
        }
        afterEach(function () { fixture = null; });
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [TestComponent],
                imports: [common_1.CommonModule],
            });
        });
        describe('switch value changes', function () {
            it('should switch amongst when values', function () {
                var template = '<ul [ngSwitch]="switchValue">' +
                    '<li *ngSwitchCase="\'a\'">when a</li>' +
                    '<li *ngSwitchCase="\'b\'">when b</li>' +
                    '</ul>';
                fixture = createTestComponent(template);
                detectChangesAndExpectText('');
                getComponent().switchValue = 'a';
                detectChangesAndExpectText('when a');
                getComponent().switchValue = 'b';
                detectChangesAndExpectText('when b');
            });
            it('should switch amongst when values with fallback to default', function () {
                var template = '<ul [ngSwitch]="switchValue">' +
                    '<li *ngSwitchCase="\'a\'">when a</li>' +
                    '<li *ngSwitchDefault>when default</li>' +
                    '</ul>';
                fixture = createTestComponent(template);
                detectChangesAndExpectText('when default');
                getComponent().switchValue = 'a';
                detectChangesAndExpectText('when a');
                getComponent().switchValue = 'b';
                detectChangesAndExpectText('when default');
                getComponent().switchValue = 'c';
                detectChangesAndExpectText('when default');
            });
            it('should support multiple whens with the same value', function () {
                var template = '<ul [ngSwitch]="switchValue">' +
                    '<li *ngSwitchCase="\'a\'">when a1;</li>' +
                    '<li *ngSwitchCase="\'b\'">when b1;</li>' +
                    '<li *ngSwitchCase="\'a\'">when a2;</li>' +
                    '<li *ngSwitchCase="\'b\'">when b2;</li>' +
                    '<li *ngSwitchDefault>when default1;</li>' +
                    '<li *ngSwitchDefault>when default2;</li>' +
                    '</ul>';
                fixture = createTestComponent(template);
                detectChangesAndExpectText('when default1;when default2;');
                getComponent().switchValue = 'a';
                detectChangesAndExpectText('when a1;when a2;');
                getComponent().switchValue = 'b';
                detectChangesAndExpectText('when b1;when b2;');
            });
        });
        describe('when values changes', function () {
            it('should switch amongst when values', function () {
                var template = '<ul [ngSwitch]="switchValue">' +
                    '<li *ngSwitchCase="when1">when 1;</li>' +
                    '<li *ngSwitchCase="when2">when 2;</li>' +
                    '<li *ngSwitchDefault>when default;</li>' +
                    '</ul>';
                fixture = createTestComponent(template);
                getComponent().when1 = 'a';
                getComponent().when2 = 'b';
                getComponent().switchValue = 'a';
                detectChangesAndExpectText('when 1;');
                getComponent().switchValue = 'b';
                detectChangesAndExpectText('when 2;');
                getComponent().switchValue = 'c';
                detectChangesAndExpectText('when default;');
                getComponent().when1 = 'c';
                detectChangesAndExpectText('when 1;');
                getComponent().when1 = 'd';
                detectChangesAndExpectText('when default;');
            });
        });
        describe('corner cases', function () {
            it('should not create the default case if another case matches', function () {
                var log = [];
                var TestDirective = /** @class */ (function () {
                    function TestDirective(test) {
                        log.push(test);
                    }
                    TestDirective = __decorate([
                        core_1.Directive({ selector: '[test]' }),
                        __param(0, core_1.Attribute('test')),
                        __metadata("design:paramtypes", [String])
                    ], TestDirective);
                    return TestDirective;
                }());
                var template = '<div [ngSwitch]="switchValue">' +
                    '<div *ngSwitchCase="\'a\'" test="aCase"></div>' +
                    '<div *ngSwitchDefault test="defaultCase"></div>' +
                    '</div>';
                testing_1.TestBed.configureTestingModule({ declarations: [TestDirective] });
                testing_1.TestBed.overrideComponent(TestComponent, { set: { template: template } })
                    .createComponent(TestComponent);
                var fixture = testing_1.TestBed.createComponent(TestComponent);
                fixture.componentInstance.switchValue = 'a';
                fixture.detectChanges();
                matchers_1.expect(log).toEqual(['aCase']);
            });
            it('should create the default case if there is no other case', function () {
                var template = '<ul [ngSwitch]="switchValue">' +
                    '<li *ngSwitchDefault>when default1;</li>' +
                    '<li *ngSwitchDefault>when default2;</li>' +
                    '</ul>';
                fixture = createTestComponent(template);
                detectChangesAndExpectText('when default1;when default2;');
            });
            it('should allow defaults before cases', function () {
                var template = '<ul [ngSwitch]="switchValue">' +
                    '<li *ngSwitchDefault>when default1;</li>' +
                    '<li *ngSwitchDefault>when default2;</li>' +
                    '<li *ngSwitchCase="\'a\'">when a1;</li>' +
                    '<li *ngSwitchCase="\'b\'">when b1;</li>' +
                    '<li *ngSwitchCase="\'a\'">when a2;</li>' +
                    '<li *ngSwitchCase="\'b\'">when b2;</li>' +
                    '</ul>';
                fixture = createTestComponent(template);
                detectChangesAndExpectText('when default1;when default2;');
                getComponent().switchValue = 'a';
                detectChangesAndExpectText('when a1;when a2;');
                getComponent().switchValue = 'b';
                detectChangesAndExpectText('when b1;when b2;');
            });
        });
    });
}
var TestComponent = /** @class */ (function () {
    function TestComponent() {
        this.switchValue = null;
        this.when1 = null;
        this.when2 = null;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfc3dpdGNoX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vdGVzdC9kaXJlY3RpdmVzL25nX3N3aXRjaF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0FBRUgsMENBQTZDO0FBQzdDLHNDQUE4RDtBQUM5RCxpREFBZ0U7QUFDaEUsMkVBQXNFO0FBRXRFO0lBQ0UsUUFBUSxDQUFDLFVBQVUsRUFBRTtRQUNuQixJQUFJLE9BQThCLENBQUM7UUFFbkMsMEJBQXlDLE9BQU8sT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztRQUU1RSxvQ0FBb0MsSUFBWTtZQUM5QyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDeEIsaUJBQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pELENBQUM7UUFFRCxTQUFTLENBQUMsY0FBUSxPQUFPLEdBQUcsSUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdkMsVUFBVSxDQUFDO1lBQ1QsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQztnQkFDN0IsWUFBWSxFQUFFLENBQUMsYUFBYSxDQUFDO2dCQUM3QixPQUFPLEVBQUUsQ0FBQyxxQkFBWSxDQUFDO2FBQ3hCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLHNCQUFzQixFQUFFO1lBQy9CLEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRTtnQkFDdEMsSUFBTSxRQUFRLEdBQUcsK0JBQStCO29CQUM1Qyx1Q0FBdUM7b0JBQ3ZDLHVDQUF1QztvQkFDdkMsT0FBTyxDQUFDO2dCQUVaLE9BQU8sR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFeEMsMEJBQTBCLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBRS9CLFlBQVksRUFBRSxD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