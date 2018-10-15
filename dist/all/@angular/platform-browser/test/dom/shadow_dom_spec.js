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
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
function supportsShadowDOMV1() {
    var testEl = document.createElement('div');
    return (typeof customElements !== 'undefined') && (typeof testEl.attachShadow !== 'undefined');
}
if (supportsShadowDOMV1()) {
    describe('ShadowDOM Support', function () {
        var testContainer;
        beforeEach(function () { testing_1.TestBed.configureTestingModule({ imports: [TestModule] }); });
        it('should attach and use a shadowRoot when ViewEncapsulation.Native is set', function () {
            var compEl = testing_1.TestBed.createComponent(ShadowComponent).nativeElement;
            matchers_1.expect(compEl.shadowRoot.textContent).toEqual('Hello World');
        });
        it('should use the shadow root to encapsulate styles', function () {
            var compEl = testing_1.TestBed.createComponent(StyledShadowComponent).nativeElement;
            matchers_1.expect(window.getComputedStyle(compEl).border).toEqual('1px solid rgb(0, 0, 0)');
            var redDiv = compEl.shadowRoot.querySelector('div.red');
            matchers_1.expect(window.getComputedStyle(redDiv).border).toEqual('1px solid rgb(255, 0, 0)');
        });
        it('should allow the usage of <slot> elements', function () {
            var el = testing_1.TestBed.createComponent(ShadowSlotComponent).nativeElement;
            var projectedContent = document.createTextNode('Hello Slot!');
            el.appendChild(projectedContent);
            var slot = el.shadowRoot.querySelector('slot');
            matchers_1.expect(slot.assignedNodes().length).toBe(1);
            matchers_1.expect(slot.assignedNodes()[0].textContent).toBe('Hello Slot!');
        });
        it('should allow the usage of named <slot> elements', function () {
            var el = testing_1.TestBed.createComponent(ShadowSlotsComponent).nativeElement;
            var headerContent = document.createElement('h1');
            headerContent.setAttribute('slot', 'header');
            headerContent.textContent = 'Header Text!';
            var articleContent = document.createElement('span');
            articleContent.setAttribute('slot', 'article');
            articleContent.textContent = 'Article Text!';
            var articleSubcontent = document.createElement('span');
            articleSubcontent.setAttribute('slot', 'article');
            articleSubcontent.textContent = 'Article Subtext!';
            el.appendChild(headerContent);
            el.appendChild(articleContent);
            el.appendChild(articleSubcontent);
            var headerSlot = el.shadowRoot.querySelector('slot[name=header]');
            var articleSlot = el.shadowRoot.querySelector('slot[name=article]');
            matchers_1.expect(headerSlot.assignedNodes().length).toBe(1);
            matchers_1.expect(headerSlot.assignedNodes()[0].textContent).toBe('Header Text!');
            matchers_1.expect(headerContent.assignedSlot).toBe(headerSlot);
            matchers_1.expect(articleSlot.assignedNodes().length).toBe(2);
            matchers_1.expect(articleSlot.assignedNodes()[0].textContent).toBe('Article Text!');
            matchers_1.expect(articleSlot.assignedNodes()[1].textContent).toBe('Article Subtext!');
            matchers_1.expect(articleContent.assignedSlot).toBe(articleSlot);
            matchers_1.expect(articleSubcontent.assignedSlot).toBe(articleSlot);
        });
    });
}
var ShadowComponent = /** @class */ (function () {
    function ShadowComponent() {
    }
    ShadowComponent = __decorate([
        core_1.Component({ selector: 'shadow-comp', template: 'Hello World', encapsulation: core_1.ViewEncapsulation.ShadowDom })
    ], ShadowComponent);
    return ShadowComponent;
}());
var StyledShadowComponent = /** @class */ (function () {
    function StyledShadowComponent() {
    }
    StyledShadowComponent = __decorate([
        core_1.Component({
            selector: 'styled-shadow-comp',
            template: '<div class="red"></div>',
            encapsulation: core_1.ViewEncapsulation.ShadowDom,
            styles: [":host { border: 1px solid black; } .red { border: 1px solid red; }"]
        })
    ], StyledShadowComponent);
    return StyledShadowComponent;
}());
var ShadowSlotComponent = /** @class */ (function () {
    function ShadowSlotComponent() {
    }
    ShadowSlotComponent = __decorate([
        core_1.Component({
            selector: 'shadow-slot-comp',
            template: '<slot></slot>',
            encapsulation: core_1.ViewEncapsulation.ShadowDom
        })
    ], ShadowSlotComponent);
    return ShadowSlotComponent;
}());
var ShadowSlotsComponent = /** @class */ (function () {
    function ShadowSlotsComponent() {
    }
    ShadowSlotsComponent = __decorate([
        core_1.Component({
            selector: 'shadow-slots-comp',
            template: '<header><slot name="header"></slot></header><article><slot name="article"></slot></article>',
            encapsulation: core_1.ViewEncapsulation.ShadowDom
        })
    ], ShadowSlotsComponent);
    return ShadowSlotsComponent;
}());
var TestModule = /** @class */ (function () {
    function TestModule() {
    }
    TestModule.prototype.ngDoBootstrap = function () { };
    TestModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule],
            declarations: [ShadowComponent, ShadowSlotComponent, ShadowSlotsComponent, StyledShadowComponent],
            entryComponents: [ShadowComponent, ShadowSlotComponent, ShadowSlotsComponent, StyledShadowComponent],
        })
    ], TestModule);
    return TestModule;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhZG93X2RvbV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci90ZXN0L2RvbS9zaGFkb3dfZG9tX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCxzQ0FBd0k7QUFDeEksaURBQThDO0FBQzlDLDhEQUF3RDtBQUN4RCwyRUFBc0U7QUFFdEU7SUFDRSxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdDLE9BQU8sQ0FBQyxPQUFPLGNBQWMsS0FBSyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sTUFBTSxDQUFDLFlBQVksS0FBSyxXQUFXLENBQUMsQ0FBQztBQUNqRyxDQUFDO0FBRUQsSUFBSSxtQkFBbUIsRUFBRSxFQUFFO0lBQ3pCLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtRQUU1QixJQUFJLGFBQTZCLENBQUM7UUFFbEMsVUFBVSxDQUFDLGNBQVEsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRS9FLEVBQUUsQ0FBQyx5RUFBeUUsRUFBRTtZQUM1RSxJQUFNLE1BQU0sR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxhQUFhLENBQUM7WUFDdEUsaUJBQU0sQ0FBQyxNQUFNLENBQUMsVUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNqRSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxrREFBa0QsRUFBRTtZQUNyRCxJQUFNLE1BQU0sR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLGFBQWEsQ0FBQztZQUM1RSxpQkFBTSxDQUFDLE1BQU0s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