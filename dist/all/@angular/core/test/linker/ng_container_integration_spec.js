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
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
{
    describe('jit', function () { declareTests({ useJit: true }); });
    describe('no jit', function () { declareTests({ useJit: false }); });
}
function declareTests(_a) {
    var useJit = _a.useJit;
    describe('<ng-container>', function () {
        beforeEach(function () {
            testing_1.TestBed.configureCompiler({ useJit: useJit });
            testing_1.TestBed.configureTestingModule({
                declarations: [
                    MyComp,
                    NeedsContentChildren,
                    NeedsViewChildren,
                    TextDirective,
                    Simple,
                ],
            });
        });
        it('should support the "i18n" attribute', function () {
            var template = '<ng-container i18n>foo</ng-container>';
            testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(MyComp);
            fixture.detectChanges();
            var el = fixture.nativeElement;
            matchers_1.expect(el).toHaveText('foo');
        });
        it('should be rendered as comment with children as siblings', function () {
            var template = '<ng-container><p></p></ng-container>';
            testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(MyComp);
            fixture.detectChanges();
            var el = fixture.nativeElement;
            var children = dom_adapter_1.getDOM().childNodes(el);
            matchers_1.expect(children.length).toBe(2);
            matchers_1.expect(dom_adapter_1.getDOM().isCommentNode(children[0])).toBe(true);
            matchers_1.expect(dom_adapter_1.getDOM().tagName(children[1]).toUpperCase()).toEqual('P');
        });
        it('should support nesting', function () {
            var template = '<ng-container>1</ng-container><ng-container><ng-container>2</ng-container></ng-container>';
            testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(MyComp);
            fixture.detectChanges();
            var el = fixture.nativeElement;
            var children = dom_adapter_1.getDOM().childNodes(el);
            matchers_1.expect(children.length).toBe(5);
            matchers_1.expect(dom_adapter_1.getDOM().isCommentNode(children[0])).toBe(true);
            matchers_1.expect(children[1]).toHaveText('1');
            matchers_1.expect(dom_adapter_1.getDOM().isCommentNode(children[2])).toBe(true);
            matchers_1.expect(dom_adapter_1.getDOM().isCommentNode(children[3])).toBe(true);
            matchers_1.expect(children[4]).toHaveText('2');
        });
        it('should group inner nodes', function () {
            var template = '<ng-container *ngIf="ctxBoolProp"><p></p><b></b></ng-container>';
            testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(MyComp);
            fixture.componentInstance.ctxBoolProp = true;
            fixture.detectChanges();
            var el = fixture.nativeElement;
            var children = dom_adapter_1.getDOM().childNodes(el);
            matchers_1.expect(children.length).toBe(4);
            // ngIf anchor
            matchers_1.expect(dom_adapter_1.getDOM().isCommentNode(children[0])).toBe(true);
            // ng-container anchor
            matchers_1.expect(dom_adapter_1.getDOM().isCommentNode(children[1])).toBe(true);
            matchers_1.expect(dom_adapter_1.getDOM().tagName(children[2]).toUpperCase()).toEqual('P');
            matchers_1.expect(dom_adapter_1.getDOM().tagName(children[3]).toUpperCase()).toEqual('B');
            fixture.componentInstance.ctxBoolProp = false;
            fixture.detectChanges();
            matchers_1.expect(children.length).toBe(1);
            matchers_1.expect(dom_adapter_1.getDOM().isCommentNode(children[0])).toBe(true);
        });
        it('should work with static content projection', function () {
            var template = "<simple><ng-container><p>1</p><p>2</p></ng-container></simple>";
            testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(MyComp);
            fixture.detectChanges();
            var el = fixture.nativeElement;
            matchers_1.expect(el).toHaveText('SIMPLE(12)');
        });
        it('should support injecting the container from children', function () {
            var template = "<ng-container [text]=\"'container'\"><p></p></ng-container>";
            testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(MyComp);
            fixture.detectChanges();
            var dir = fixture.debugElement.children[0].injector.get(TextDirective);
            matchers_1.expect(dir).toBeAnInstanceOf(TextDirective);
            matchers_1.expect(dir.text).toEqual('container');
        });
        it('should contain all direct child directives in a <ng-container> (content dom)', function () {
            var template = '<needs-content-children #q><ng-container><div text="foo"></div></ng-container></needs-content-children>';
            testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(MyComp);
            fixture.detectChanges();
            var q = fixture.debugElement.children[0].references['q'];
            fixture.detectChanges();
            matchers_1.expect(q.textDirChildren.length).toEqual(1);
            matchers_1.expect(q.numberOfChildrenAfterContentInit).toEqual(1);
        });
        it('should contain all child directives in a <ng-container> (view dom)', function () {
            var template = '<needs-view-children #q></needs-view-children>';
            testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(MyComp);
            fixture.detectChanges();
            var q = fixture.debugElement.children[0].references['q'];
            fixture.detectChanges();
            matchers_1.expect(q.textDirChildren.length).toEqual(1);
            matchers_1.expect(q.numberOfChildrenAfterViewInit).toEqual(1);
        });
    });
}
var TextDirective = /** @class */ (function () {
    function TextDirective() {
        this.text = null;
    }
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], TextDirective.prototype, "text", void 0);
    TextDirective = __decorate([
        core_1.Directive({ selector: '[text]' })
    ], TextDirective);
    return TextDirective;
}());
var NeedsContentChildren = /** @class */ (function () {
    function NeedsContentChildren() {
    }
    NeedsContentChildren.prototype.ngAfterContentInit = function () { this.numberOfChildrenAfterContentInit = this.textDirChildren.length; };
    __decorate([
        core_1.ContentChildren(TextDirective),
        __metadata("design:type", core_1.QueryList)
    ], NeedsContentChildren.prototype, "textDirChildren", void 0);
    NeedsContentChildren = __decorate([
        core_1.Component({ selector: 'needs-content-children', template: '' })
    ], NeedsContentChildren);
    return NeedsContentChildren;
}());
var NeedsViewChildren = /** @class */ (function () {
    function NeedsViewChildren() {
    }
    NeedsViewChildren.prototype.ngAfterViewInit = function () { this.numberOfChildrenAfterViewInit = this.textDirChildren.length; };
    __decorate([
        core_1.ViewChildren(TextDirective),
        __metadata("design:type", core_1.QueryList)
    ], NeedsViewChildren.prototype, "textDirChildren", void 0);
    NeedsViewChildren = __decorate([
        core_1.Component({ selector: 'needs-view-children', template: '<div text></div>' })
    ], NeedsViewChildren);
    return NeedsViewChildren;
}());
var Simple = /** @class */ (function () {
    function Simple() {
    }
    Simple = __decorate([
        core_1.Component({ selector: 'simple', template: 'SIMPLE(<ng-content></ng-content>)' })
    ], Simple);
    return Simple;
}());
var MyComp = /** @class */ (function () {
    function MyComp() {
        this.ctxBoolProp = false;
    }
    MyComp = __decorate([
        core_1.Component({ selector: 'my-comp', template: '' })
    ], MyComp);
    return MyComp;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udGFpbmVyX2ludGVncmF0aW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvbGlua2VyL25nX2NvbnRhaW5lcl9pbnRlZ3JhdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBR0gsc0NBQXFJO0FBQ3JJLGlEQUE4QztBQUM5Qyw2RUFBcUU7QUFDckUsMkVBQXNFO0FBRXRFO0lBQ0UsUUFBUSxDQUFDLEtBQUssRUFBRSxjQUFRLFlBQVksQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekQsUUFBUSxDQUFDLFFBQVEsRUFBRSxjQUFRLFlBQVksQ0FBQyxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDOUQ7QUFFRCxzQkFBc0IsRUFBMkI7UUFBMUIsa0JBQU07SUFDM0IsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1FBRXpCLFVBQVUsQ0FBQztZQUNULGlCQUFPLENBQUMsaUJBQWlCLENBQUMsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztZQUM1QyxpQkFBTyxDQUFDLHNCQUFzQixDQUFDO2dCQUM3QixZQUFZLEVBQUU7b0JBQ1osTUFBTTtvQkFDTixvQkFBb0I7b0JBQ3BCLGlCQUFpQjtvQkFDakIsYUFBYTtvQkFDYixNQUFNO2lCQUNQO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQUU7WUFDeEMsSUFBTSxRQUFRLEdBQUcsdUNBQXVDLENBQUM7WUFDekQsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLFVBQUEsRUFBQyxFQUFDLENBQUMsQ0FBQztZ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