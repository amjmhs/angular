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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
{
    describe('NgTemplateOutlet', function () {
        var fixture;
        function setTplRef(value) { fixture.componentInstance.currentTplRef = value; }
        function detectChangesAndExpectText(text) {
            fixture.detectChanges();
            matchers_1.expect(fixture.debugElement.nativeElement).toHaveText(text);
        }
        afterEach(function () { fixture = null; });
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [TestComponent, CaptureTplRefs, DestroyableCmpt],
                imports: [common_1.CommonModule],
                providers: [DestroyedSpyService]
            });
        });
        // https://github.com/angular/angular/issues/14778
        it('should accept the component as the context', testing_1.async(function () {
            var template = "<ng-container *ngTemplateOutlet=\"tpl; context: this\"></ng-container>" +
                "<ng-template #tpl>{{context.foo}}</ng-template>";
            fixture = createTestComponent(template);
            detectChangesAndExpectText('bar');
        }));
        it('should do nothing if templateRef is `null`', testing_1.async(function () {
            var template = "<ng-container [ngTemplateOutlet]=\"null\"></ng-container>";
            fixture = createTestComponent(template);
            detectChangesAndExpectText('');
        }));
        it('should insert content specified by TemplateRef', testing_1.async(function () {
            var template = "<ng-template #tpl>foo</ng-template>" +
                "<ng-container [ngTemplateOutlet]=\"tpl\"></ng-container>";
            fixture = createTestComponent(template);
            detectChangesAndExpectText('foo');
        }));
        it('should clear content if TemplateRef becomes `null`', testing_1.async(function () {
            var template = "<tpl-refs #refs=\"tplRefs\"><ng-template>foo</ng-template></tpl-refs>" +
                "<ng-container [ngTemplateOutlet]=\"currentTplRef\"></ng-container>";
            fixture = createTestComponent(template);
            fixture.detectChanges();
            var refs = fixture.debugElement.children[0].references['refs'];
            setTplRef(refs.tplRefs.first);
            detectChangesAndExpectText('foo');
            setTplRef(null);
            detectChangesAndExpectText('');
        }));
        it('should swap content if TemplateRef changes', testing_1.async(function () {
            var template = "<tpl-refs #refs=\"tplRefs\"><ng-template>foo</ng-template><ng-template>bar</ng-template></tpl-refs>" +
                "<ng-container [ngTemplateOutlet]=\"currentTplRef\"></ng-container>";
            fixture = createTestComponent(template);
            fixture.detectChanges();
            var refs = fixture.debugElement.children[0].references['refs'];
            setTplRef(refs.tplRefs.first);
            detectChangesAndExpectText('foo');
            setTplRef(refs.tplRefs.last);
            detectChangesAndExpectText('bar');
        }));
        it('should display template if context is `null`', testing_1.async(function () {
            var template = "<ng-template #tpl>foo</ng-template>" +
                "<ng-container *ngTemplateOutlet=\"tpl; context: null\"></ng-container>";
            fixture = createTestComponent(template);
            detectChangesAndExpectText('foo');
        }));
        it('should reflect initial context and changes', testing_1.async(function () {
            var template = "<ng-template let-foo=\"foo\" #tpl>{{foo}}</ng-template>" +
                "<ng-container *ngTemplateOutlet=\"tpl; context: context\"></ng-container>";
            fixture = createTestComponent(template);
            fixture.detectChanges();
            detectChangesAndExpectText('bar');
            fixture.componentInstance.context.foo = 'alter-bar';
            detectChangesAndExpectText('alter-bar');
        }));
        it('should reflect user defined `$implicit` property in the context', testing_1.async(function () {
            var template = "<ng-template let-ctx #tpl>{{ctx.foo}}</ng-template>" +
                "<ng-container *ngTemplateOutlet=\"tpl; context: context\"></ng-container>";
            fixture = createTestComponent(template);
            fixture.componentInstance.context = { $implicit: { foo: 'bra' } };
            detectChangesAndExpectText('bra');
        }));
        it('should reflect context re-binding', testing_1.async(function () {
            var template = "<ng-template let-shawshank=\"shawshank\" #tpl>{{shawshank}}</ng-template>" +
                "<ng-container *ngTemplateOutlet=\"tpl; context: context\"></ng-container>";
            fixture = createTestComponent(template);
            fixture.componentInstance.context = { shawshank: 'brooks' };
            detectChangesAndExpectText('brooks');
            fixture.componentInstance.context = { shawshank: 'was here' };
            detectChangesAndExpectText('was here');
        }));
        it('should update but not destroy embedded view when context values change', function () {
            var template = "<ng-template let-foo=\"foo\" #tpl><destroyable-cmpt></destroyable-cmpt>:{{foo}}</ng-template>" +
                "<ng-template [ngTemplateOutlet]=\"tpl\" [ngTemplateOutletContext]=\"{foo: value}\"></ng-template>";
            fixture = createTestComponent(template);
            var spyService = fixture.debugElement.injector.get(DestroyedSpyService);
            detectChangesAndExpectText('Content to destroy:bar');
            matchers_1.expect(spyService.destroyed).toBeFalsy();
            fixture.componentInstance.value = 'baz';
            detectChangesAndExpectText('Content to destroy:baz');
            matchers_1.expect(spyService.destroyed).toBeFalsy();
        });
        it('should recreate embedded view when context shape changes', function () {
            var template = "<ng-template let-foo=\"foo\" #tpl><destroyable-cmpt></destroyable-cmpt>:{{foo}}</ng-template>" +
                "<ng-template [ngTemplateOutlet]=\"tpl\" [ngTemplateOutletContext]=\"context\"></ng-template>";
            fixture = createTestComponent(template);
            var spyService = fixture.debugElement.injector.get(DestroyedSpyService);
            detectChangesAndExpectText('Content to destroy:bar');
            matchers_1.expect(spyService.destroyed).toBeFalsy();
            fixture.componentInstance.context = { foo: 'baz', other: true };
            detectChangesAndExpectText('Content to destroy:baz');
            matchers_1.expect(spyService.destroyed).toBeTruthy();
        });
        it('should destroy embedded view when context value changes and templateRef becomes undefined', function () {
            var template = "<ng-template let-foo=\"foo\" #tpl><destroyable-cmpt></destroyable-cmpt>:{{foo}}</ng-template>" +
                "<ng-template [ngTemplateOutlet]=\"value === 'bar' ? tpl : undefined\" [ngTemplateOutletContext]=\"{foo: value}\"></ng-template>";
            fixture = createTestComponent(template);
            var spyService = fixture.debugElement.injector.get(DestroyedSpyService);
            detectChangesAndExpectText('Content to destroy:bar');
            matchers_1.expect(spyService.destroyed).toBeFalsy();
            fixture.componentInstance.value = 'baz';
            detectChangesAndExpectText('');
            matchers_1.expect(spyService.destroyed).toBeTruthy();
        });
        it('should not try to update null / undefined context when context changes but template stays the same', function () {
            var template = "<ng-template let-foo=\"foo\" #tpl>{{foo}}</ng-template>" +
                "<ng-template [ngTemplateOutlet]=\"tpl\" [ngTemplateOutletContext]=\"value === 'bar' ? null : undefined\"></ng-template>";
            fixture = createTestComponent(template);
            detectChangesAndExpectText('');
            fixture.componentInstance.value = 'baz';
            detectChangesAndExpectText('');
        });
        it('should not try to update null / undefined context when template changes', function () {
            var template = "<ng-template let-foo=\"foo\" #tpl1>{{foo}}</ng-template>" +
                "<ng-template let-foo=\"foo\" #tpl2>{{foo}}</ng-template>" +
                "<ng-template [ngTemplateOutlet]=\"value === 'bar' ? tpl1 : tpl2\" [ngTemplateOutletContext]=\"value === 'bar' ? null : undefined\"></ng-template>";
            fixture = createTestComponent(template);
            detectChangesAndExpectText('');
            fixture.componentInstance.value = 'baz';
            detectChangesAndExpectText('');
        });
        it('should not try to update context on undefined view', function () {
            var template = "<ng-template let-foo=\"foo\" #tpl>{{foo}}</ng-template>" +
                "<ng-template [ngTemplateOutlet]=\"value === 'bar' ? null : undefined\" [ngTemplateOutletContext]=\"{foo: value}\"></ng-template>";
            fixture = createTestComponent(template);
            detectChangesAndExpectText('');
            fixture.componentInstance.value = 'baz';
            detectChangesAndExpectText('');
        });
    });
}
var DestroyedSpyService = /** @class */ (function () {
    function DestroyedSpyService() {
        this.destroyed = false;
    }
    DestroyedSpyService = __decorate([
        core_1.Injectable()
    ], DestroyedSpyService);
    return DestroyedSpyService;
}());
var DestroyableCmpt = /** @class */ (function () {
    function DestroyableCmpt(_spyService) {
        this._spyService = _spyService;
    }
    DestroyableCmpt.prototype.ngOnDestroy = function () { this._spyService.destroyed = true; };
    DestroyableCmpt = __decorate([
        core_1.Component({ selector: 'destroyable-cmpt', template: 'Content to destroy' }),
        __metadata("design:paramtypes", [DestroyedSpyService])
    ], DestroyableCmpt);
    return DestroyableCmpt;
}());
var CaptureTplRefs = /** @class */ (function () {
    function CaptureTplRefs() {
    }
    __decorate([
        core_1.ContentChildren(core_1.TemplateRef),
        __metadata("design:type", core_1.QueryList)
    ], CaptureTplRefs.prototype, "tplRefs", void 0);
    CaptureTplRefs = __decorate([
        core_1.Directive({ selector: 'tpl-refs', exportAs: 'tplRefs' })
    ], CaptureTplRefs);
    return CaptureTplRefs;
}());
var TestComponent = /** @class */ (function () {
    function TestComponent() {
        this.context = { foo: 'bar' };
        this.value = 'bar';
    }
    TestComponent = __decorate([
        core_1.Component({ selector: 'test-cmp', template: '' })
    ], TestComponent);
    return TestComponent;
}());
function createTestComponent(template) {
    return testing_1.TestBed.overrideComponent(TestComponent, { set: { template: template } })
        .configureTestingModule({ schemas: [core_1.NO_ERRORS_SCHEMA] })
        .createComponent(TestComponent);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfdGVtcGxhdGVfb3V0bGV0X3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vdGVzdC9kaXJlY3RpdmVzL25nX3RlbXBsYXRlX291dGxldF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsMENBQTZDO0FBQzdDLHNDQUFxSTtBQUNySSxpREFBdUU7QUFDdkUsMkVBQXNFO0FBRXRFO0lBQ0UsUUFBUSxDQUFDLGtCQUFrQixFQUFFO1FBQzNCLElBQUksT0FBOEIsQ0FBQztRQUVuQyxtQkFBbUIsS0FBVSxJQUFVLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUV6RixvQ0FBb0MsSUFBWTtZQUM5QyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDeEIsaUJBQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5RCxDQUFDO1FBRUQsU0FBUyxDQUFDLGNBQVEsT0FBTyxHQUFHLElBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTVDLFVBQVUsQ0FBQztZQUNULGlCQUFPLENBQUMsc0JBQXNCLENBQUM7Z0JBQzdCLFlBQVksRUFBRSxDQUFDLGFBQWEsRUFBRSxjQUFjLEVBQUUsZUFBZSxDQUFDO2dCQUM5RCxPQUFPLEVBQUUsQ0FBQyxxQkFBWSxDQUFDO2dCQUN2QixTQUFTLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQzthQUNqQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILGtEQUFrRDtRQUNsRCxFQUFFLENBQUMsNENBQTRDLEVBQUUsZUFBSyxDQUFDO1lBQ2xELElBQU0sUUFBUSxHQUFHLHdFQUFzRTtnQkFDbkYsaURBQWlELENBQUM7WUFFdEQsT0FBTyxHQUFHLG1CQUFt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