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
var by_1 = require("@angular/platform-browser/src/dom/debug/by");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
{
    describe('ngIf directive', function () {
        var fixture;
        function getComponent() { return fixture.componentInstance; }
        afterEach(function () { fixture = null; });
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [TestComponent],
                imports: [common_1.CommonModule],
            });
        });
        it('should work in a template attribute', testing_1.async(function () {
            var template = '<span *ngIf="booleanCondition">hello</span>';
            fixture = createTestComponent(template);
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(1);
            matchers_1.expect(fixture.nativeElement).toHaveText('hello');
        }));
        it('should work on a template element', testing_1.async(function () {
            var template = '<ng-template [ngIf]="booleanCondition">hello2</ng-template>';
            fixture = createTestComponent(template);
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('hello2');
        }));
        it('should toggle node when condition changes', testing_1.async(function () {
            var template = '<span *ngIf="booleanCondition">hello</span>';
            fixture = createTestComponent(template);
            getComponent().booleanCondition = false;
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(0);
            matchers_1.expect(fixture.nativeElement).toHaveText('');
            getComponent().booleanCondition = true;
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(1);
            matchers_1.expect(fixture.nativeElement).toHaveText('hello');
            getComponent().booleanCondition = false;
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(0);
            matchers_1.expect(fixture.nativeElement).toHaveText('');
        }));
        it('should handle nested if correctly', testing_1.async(function () {
            var template = '<div *ngIf="booleanCondition"><span *ngIf="nestedBooleanCondition">hello</span></div>';
            fixture = createTestComponent(template);
            getComponent().booleanCondition = false;
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(0);
            matchers_1.expect(fixture.nativeElement).toHaveText('');
            getComponent().booleanCondition = true;
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(1);
            matchers_1.expect(fixture.nativeElement).toHaveText('hello');
            getComponent().nestedBooleanCondition = false;
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(0);
            matchers_1.expect(fixture.nativeElement).toHaveText('');
            getComponent().nestedBooleanCondition = true;
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(1);
            matchers_1.expect(fixture.nativeElement).toHaveText('hello');
            getComponent().booleanCondition = false;
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(0);
            matchers_1.expect(fixture.nativeElement).toHaveText('');
        }));
        it('should update several nodes with if', testing_1.async(function () {
            var template = '<span *ngIf="numberCondition + 1 >= 2">helloNumber</span>' +
                '<span *ngIf="stringCondition == \'foo\'">helloString</span>' +
                '<span *ngIf="functionCondition(stringCondition, numberCondition)">helloFunction</span>';
            fixture = createTestComponent(template);
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(3);
            matchers_1.expect(dom_adapter_1.getDOM().getText(fixture.nativeElement))
                .toEqual('helloNumberhelloStringhelloFunction');
            getComponent().numberCondition = 0;
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(1);
            matchers_1.expect(fixture.nativeElement).toHaveText('helloString');
            getComponent().numberCondition = 1;
            getComponent().stringCondition = 'bar';
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.queryAll(by_1.By.css('span')).length).toEqual(1);
            matchers_1.expect(fixture.nativeElement).toHaveText('helloNumber');
        }));
        it('should not add the element twice if the condition goes from truthy to truthy', testing_1.async(function () {
            var template = '<span *ngIf="numberCondition">hello</span>';
            fixture = createTestComponent(template);
            fixture.detectChanges();
            var els = fixture.debugElement.queryAll(by_1.By.css('span'));
            matchers_1.expect(els.length).toEqual(1);
            dom_adapter_1.getDOM().addClass(els[0].nativeElement, 'marker');
            matchers_1.expect(fixture.nativeElement).toHaveText('hello');
            getComponent().numberCondition = 2;
            fixture.detectChanges();
            els = fixture.debugElement.queryAll(by_1.By.css('span'));
            matchers_1.expect(els.length).toEqual(1);
            matchers_1.expect(dom_adapter_1.getDOM().hasClass(els[0].nativeElement, 'marker')).toBe(true);
            matchers_1.expect(fixture.nativeElement).toHaveText('hello');
        }));
        describe('then/else templates', function () {
            it('should support else', testing_1.async(function () {
                var template = '<span *ngIf="booleanCondition; else elseBlock">TRUE</span>' +
                    '<ng-template #elseBlock>FALSE</ng-template>';
                fixture = createTestComponent(template);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('TRUE');
                getComponent().booleanCondition = false;
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('FALSE');
            }));
            it('should support then and else', testing_1.async(function () {
                var template = '<span *ngIf="booleanCondition; then thenBlock; else elseBlock">IGNORE</span>' +
                    '<ng-template #thenBlock>THEN</ng-template>' +
                    '<ng-template #elseBlock>ELSE</ng-template>';
                fixture = createTestComponent(template);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('THEN');
                getComponent().booleanCondition = false;
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('ELSE');
            }));
            it('should support removing the then/else templates', function () {
                var template = "<span *ngIf=\"booleanCondition;\n            then nestedBooleanCondition ? tplRef : null;\n            else nestedBooleanCondition ? tplRef : null\"></span>\n        <ng-template #tplRef>Template</ng-template>";
                fixture = createTestComponent(template);
                var comp = fixture.componentInstance;
                // then template
                comp.booleanCondition = true;
                comp.nestedBooleanCondition = true;
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('Template');
                comp.nestedBooleanCondition = false;
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('');
                // else template
                comp.booleanCondition = true;
                comp.nestedBooleanCondition = true;
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('Template');
                comp.nestedBooleanCondition = false;
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('');
            });
            it('should support dynamic else', testing_1.async(function () {
                var template = '<span *ngIf="booleanCondition; else nestedBooleanCondition ? b1 : b2">TRUE</span>' +
                    '<ng-template #b1>FALSE1</ng-template>' +
                    '<ng-template #b2>FALSE2</ng-template>';
                fixture = createTestComponent(template);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('TRUE');
                getComponent().booleanCondition = false;
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('FALSE1');
                getComponent().nestedBooleanCondition = false;
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('FALSE2');
            }));
            it('should support binding to variable using let', testing_1.async(function () {
                var template = '<span *ngIf="booleanCondition; else elseBlock; let v">{{v}}</span>' +
                    '<ng-template #elseBlock let-v>{{v}}</ng-template>';
                fixture = createTestComponent(template);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('true');
                getComponent().booleanCondition = false;
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('false');
            }));
            it('should support binding to variable using as', testing_1.async(function () {
                var template = '<span *ngIf="booleanCondition as v; else elseBlock">{{v}}</span>' +
                    '<ng-template #elseBlock let-v>{{v}}</ng-template>';
                fixture = createTestComponent(template);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('true');
                getComponent().booleanCondition = false;
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('false');
            }));
        });
        describe('Type guarding', function () {
            it('should throw when then block is not template', testing_1.async(function () {
                var template = '<span *ngIf="booleanCondition; then thenBlock">IGNORE</span>' +
                    '<div #thenBlock>THEN</div>';
                fixture = createTestComponent(template);
                matchers_1.expect(function () { return fixture.detectChanges(); })
                    .toThrowError(/ngIfThen must be a TemplateRef, but received/);
            }));
            it('should throw when else block is not template', testing_1.async(function () {
                var template = '<span *ngIf="booleanCondition; else elseBlock">IGNORE</span>' +
                    '<div #elseBlock>ELSE</div>';
                fixture = createTestComponent(template);
                matchers_1.expect(function () { return fixture.detectChanges(); })
                    .toThrowError(/ngIfElse must be a TemplateRef, but received/);
            }));
        });
    });
}
var TestComponent = /** @class */ (function () {
    function TestComponent() {
        this.booleanCondition = true;
        this.nestedBooleanCondition = true;
        this.numberCondition = 1;
        this.stringCondition = 'foo';
        this.functionCondition = function (s, n) { return s == 'foo' && n == 1; };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfaWZfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi90ZXN0L2RpcmVjdGl2ZXMvbmdfaWZfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILDBDQUE2QztBQUM3QyxzQ0FBd0M7QUFDeEMsaURBQXVFO0FBQ3ZFLGlFQUE4RDtBQUM5RCw2RUFBcUU7QUFDckUsMkVBQXNFO0FBRXRFO0lBQ0UsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1FBQ3pCLElBQUksT0FBOEIsQ0FBQztRQUVuQywwQkFBeUMsT0FBTyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1FBRTVFLFNBQVMsQ0FBQyxjQUFRLE9BQU8sR0FBRyxJQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV2QyxVQUFVLENBQUM7WUFDVCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDO2dCQUM3QixZQUFZLEVBQUUsQ0FBQyxhQUFhLENBQUM7Z0JBQzdCLE9BQU8sRUFBRSxDQUFDLHFCQUFZLENBQUM7YUFDeEIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQUUsZUFBSyxDQUFDO1lBQzNDLElBQU0sUUFBUSxHQUFHLDZDQUE2QyxDQUFDO1lBQy9ELE9BQU8sR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN4QyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDeEIsaUJBQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxPQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hFLGlCQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FB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