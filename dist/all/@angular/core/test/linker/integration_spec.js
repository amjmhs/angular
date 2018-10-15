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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var change_detection_1 = require("@angular/core/src/change_detection/change_detection");
var errors_1 = require("@angular/core/src/errors");
var component_factory_resolver_1 = require("@angular/core/src/linker/component_factory_resolver");
var element_ref_1 = require("@angular/core/src/linker/element_ref");
var query_list_1 = require("@angular/core/src/linker/query_list");
var template_ref_1 = require("@angular/core/src/linker/template_ref");
var view_container_ref_1 = require("@angular/core/src/linker/view_container_ref");
var metadata_1 = require("@angular/core/src/metadata");
var testing_1 = require("@angular/core/testing");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var dom_tokens_1 = require("@angular/platform-browser/src/dom/dom_tokens");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var util_1 = require("../../src/util");
var ANCHOR_ELEMENT = new core_1.InjectionToken('AnchorElement');
{
    describe('jit', function () { declareTests({ useJit: true }); });
    describe('no jit', function () { declareTests({ useJit: false }); });
}
function declareTests(_a) {
    var useJit = _a.useJit;
    describe('integration tests', function () {
        beforeEach(function () { testing_1.TestBed.configureCompiler({ useJit: useJit }); });
        describe('react to record changes', function () {
            it('should consume text node changes', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = '<div>{{ctxProp}}</div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'Hello World!';
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('Hello World!');
            });
            it('should update text node with a blank string when interpolation evaluates to null', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = '<div>{{null}}{{ctxProp}}</div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = null;
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('');
            });
            it('should allow both null and undefined in expressions', function () {
                var template = '<div>{{null == undefined}}|{{null === undefined}}</div>';
                var fixture = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] })
                    .overrideComponent(MyComp, { set: { template: template } })
                    .createComponent(MyComp);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('true|false');
            });
            it('should support an arbitrary number of interpolations in an element', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = "<div>before{{'0'}}a{{'1'}}b{{'2'}}c{{'3'}}d{{'4'}}e{{'5'}}f{{'6'}}g{{'7'}}h{{'8'}}i{{'9'}}j{{'10'}}after</div>";
                var fixture = testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } }).createComponent(MyComp);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('before0a1b2c3d4e5f6g7h8i9j10after');
            });
            it('should use a blank string when interpolation evaluates to null or undefined with an arbitrary number of interpolations', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = "<div>0{{null}}a{{undefined}}b{{null}}c{{undefined}}d{{null}}e{{undefined}}f{{null}}g{{undefined}}h{{null}}i{{undefined}}j{{null}}1</div>";
                var fixture = testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } }).createComponent(MyComp);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('0abcdefghij1');
            });
            it('should consume element binding changes', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = '<div [id]="ctxProp"></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'Hello World!';
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getProperty(fixture.debugElement.children[0].nativeElement, 'id'))
                    .toEqual('Hello World!');
            });
            it('should consume binding to aria-* attributes', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = '<div [attr.aria-label]="ctxProp"></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'Initial aria label';
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getAttribute(fixture.debugElement.children[0].nativeElement, 'aria-label'))
                    .toEqual('Initial aria label');
                fixture.componentInstance.ctxProp = 'Changed aria label';
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getAttribute(fixture.debugElement.children[0].nativeElement, 'aria-label'))
                    .toEqual('Changed aria label');
            });
            it('should remove an attribute when attribute expression evaluates to null', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = '<div [attr.foo]="ctxProp"></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'bar';
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getAttribute(fixture.debugElement.children[0].nativeElement, 'foo'))
                    .toEqual('bar');
                fixture.componentInstance.ctxProp = null;
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().hasAttribute(fixture.debugElement.children[0].nativeElement, 'foo'))
                    .toBeFalsy();
            });
            it('should remove style when when style expression evaluates to null', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = '<div [style.height.px]="ctxProp"></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = '10';
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getStyle(fixture.debugElement.children[0].nativeElement, 'height'))
                    .toEqual('10px');
                fixture.componentInstance.ctxProp = null;
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getStyle(fixture.debugElement.children[0].nativeElement, 'height'))
                    .toEqual('');
            });
            it('should consume binding to property names where attr name and property name do not match', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = '<div [tabindex]="ctxNumProp"></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getProperty(fixture.debugElement.children[0].nativeElement, 'tabIndex'))
                    .toEqual(0);
                fixture.componentInstance.ctxNumProp = 5;
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getProperty(fixture.debugElement.children[0].nativeElement, 'tabIndex'))
                    .toEqual(5);
            });
            it('should consume binding to camel-cased properties', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = '<input [readOnly]="ctxBoolProp">';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getProperty(fixture.debugElement.children[0].nativeElement, 'readOnly'))
                    .toBeFalsy();
                fixture.componentInstance.ctxBoolProp = true;
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getProperty(fixture.debugElement.children[0].nativeElement, 'readOnly'))
                    .toBeTruthy();
            });
            it('should consume binding to innerHtml', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = '<div innerHtml="{{ctxProp}}"></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'Some <span>HTML</span>';
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getInnerHTML(fixture.debugElement.children[0].nativeElement))
                    .toEqual('Some <span>HTML</span>');
                fixture.componentInstance.ctxProp = 'Some other <div>HTML</div>';
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getInnerHTML(fixture.debugElement.children[0].nativeElement))
                    .toEqual('Some other <div>HTML</div>');
            });
            it('should consume binding to className using class alias', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = '<div class="initial" [class]="ctxProp"></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var nativeEl = fixture.debugElement.children[0].nativeElement;
                fixture.componentInstance.ctxProp = 'foo bar';
                fixture.detectChanges();
                matchers_1.expect(nativeEl).toHaveCssClass('foo');
                matchers_1.expect(nativeEl).toHaveCssClass('bar');
                matchers_1.expect(nativeEl).not.toHaveCssClass('initial');
            });
            it('should consume binding to htmlFor using for alias', function () {
                var template = '<label [for]="ctxProp"></label>';
                var fixture = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] })
                    .overrideComponent(MyComp, { set: { template: template } })
                    .createComponent(MyComp);
                var nativeEl = fixture.debugElement.children[0].nativeElement;
                fixture.debugElement.componentInstance.ctxProp = 'foo';
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getProperty(nativeEl, 'htmlFor')).toBe('foo');
            });
            it('should consume directive watch expression change.', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, MyDir] });
                var template = '<span>' +
                    '<div my-dir [elprop]="ctxProp"></div>' +
                    '<div my-dir elprop="Hi there!"></div>' +
                    '<div my-dir elprop="Hi {{\'there!\'}}"></div>' +
                    '<div my-dir elprop="One more {{ctxProp}}"></div>' +
                    '</span>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'Hello World!';
                fixture.detectChanges();
                var containerSpan = fixture.debugElement.children[0];
                matchers_1.expect(containerSpan.children[0].injector.get(MyDir).dirProp).toEqual('Hello World!');
                matchers_1.expect(containerSpan.children[1].injector.get(MyDir).dirProp).toEqual('Hi there!');
                matchers_1.expect(containerSpan.children[2].injector.get(MyDir).dirProp).toEqual('Hi there!');
                matchers_1.expect(containerSpan.children[3].injector.get(MyDir).dirProp)
                    .toEqual('One more Hello World!');
            });
            describe('pipes', function () {
                it('should support pipes in bindings', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, MyDir, DoublePipe] });
                    var template = '<div my-dir #dir="mydir" [elprop]="ctxProp | double"></div>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    fixture.componentInstance.ctxProp = 'a';
                    fixture.detectChanges();
                    var dir = fixture.debugElement.children[0].references['dir'];
                    matchers_1.expect(dir.dirProp).toEqual('aa');
                });
            });
            it('should support nested components.', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, ChildComp] });
                var template = '<child-cmp></child-cmp>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('hello');
            });
            // GH issue 328 - https://github.com/angular/angular/issues/328
            it('should support different directive types on a single node', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, ChildComp, MyDir] });
                var template = '<child-cmp my-dir [elprop]="ctxProp"></child-cmp>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'Hello World!';
                fixture.detectChanges();
                var tc = fixture.debugElement.children[0];
                matchers_1.expect(tc.injector.get(MyDir).dirProp).toEqual('Hello World!');
                matchers_1.expect(tc.injector.get(ChildComp).dirProp).toEqual(null);
            });
            it('should support directives where a binding attribute is not given', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, MyDir] });
                var template = '<p my-dir></p>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
            });
            it('should execute a given directive once, even if specified multiple times', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DuplicateDir, DuplicateDir, [DuplicateDir, [DuplicateDir]]] });
                var template = '<p no-duplicate></p>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                matchers_1.expect(fixture.nativeElement).toHaveText('noduplicate');
            });
            it('should support directives where a selector matches property binding', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, IdDir] });
                var template = '<p [id]="ctxProp"></p>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var tc = fixture.debugElement.children[0];
                var idDir = tc.injector.get(IdDir);
                fixture.componentInstance.ctxProp = 'some_id';
                fixture.detectChanges();
                matchers_1.expect(idDir.id).toEqual('some_id');
                fixture.componentInstance.ctxProp = 'other_id';
                fixture.detectChanges();
                matchers_1.expect(idDir.id).toEqual('other_id');
            });
            it('should support directives where a selector matches event binding', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, EventDir] });
                var template = '<p (customEvent)="doNothing()"></p>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var tc = fixture.debugElement.children[0];
                matchers_1.expect(tc.injector.get(EventDir)).not.toBeNull();
            });
            it('should read directives metadata from their binding token', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, PrivateImpl, NeedsPublicApi] });
                var template = '<div public-api><div needs-public-api></div></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
            });
            it('should support template directives via `<ng-template>` elements.', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, SomeViewport] });
                var template = '<ng-template some-viewport let-greeting="someTmpl"><span>{{greeting}}</span></ng-template>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                var childNodesOfWrapper = dom_adapter_1.getDOM().childNodes(fixture.nativeElement);
                // 1 template + 2 copies.
                matchers_1.expect(childNodesOfWrapper.length).toBe(3);
                matchers_1.expect(childNodesOfWrapper[1]).toHaveText('hello');
                matchers_1.expect(childNodesOfWrapper[2]).toHaveText('again');
            });
            it('should not share empty context for template directives - issue #10045', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, PollutedContext, NoContext] });
                var template = '<ng-template pollutedContext let-foo="bar">{{foo}}</ng-template><ng-template noContext let-foo="bar">{{foo}}</ng-template>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('baz');
            });
            it('should not detach views in ViewContainers when the parent view is destroyed.', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, SomeViewport] });
                var template = '<div *ngIf="ctxBoolProp"><ng-template some-viewport let-greeting="someTmpl"><span>{{greeting}}</span></ng-template></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxBoolProp = true;
                fixture.detectChanges();
                var ngIfEl = fixture.debugElement.children[0];
                var someViewport = ngIfEl.childNodes[0].injector.get(SomeViewport);
                matchers_1.expect(someViewport.container.length).toBe(2);
                matchers_1.expect(ngIfEl.children.length).toBe(2);
                fixture.componentInstance.ctxBoolProp = false;
                fixture.detectChanges();
                matchers_1.expect(someViewport.container.length).toBe(2);
                matchers_1.expect(fixture.debugElement.children.length).toBe(0);
            });
            it('should use a comment while stamping out `<ng-template>` elements.', function () {
                var fixture = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] })
                    .overrideComponent(MyComp, { set: { template: '<ng-template></ng-template>' } })
                    .createComponent(MyComp);
                var childNodesOfWrapper = dom_adapter_1.getDOM().childNodes(fixture.nativeElement);
                matchers_1.expect(childNodesOfWrapper.length).toBe(1);
                matchers_1.expect(dom_adapter_1.getDOM().isCommentNode(childNodesOfWrapper[0])).toBe(true);
            });
            it('should allow to transplant TemplateRefs into other ViewContainers', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [
                        MyComp, SomeDirective, CompWithHost, ToolbarComponent, ToolbarViewContainer, ToolbarPart
                    ],
                    imports: [common_1.CommonModule],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = '<some-directive><toolbar><ng-template toolbarpart let-toolbarProp="toolbarProp">{{ctxProp}},{{toolbarProp}},<cmp-with-host></cmp-with-host></ng-template></toolbar></some-directive>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'From myComp';
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement)
                    .toHaveText('TOOLBAR(From myComp,From toolbar,Component with an injected host)');
            });
            describe('reference bindings', function () {
                it('should assign a component to a ref-', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, ChildComp] });
                    var template = '<p><child-cmp ref-alice></child-cmp></p>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    matchers_1.expect(fixture.debugElement.children[0].children[0].references['alice'])
                        .toBeAnInstanceOf(ChildComp);
                });
                it('should assign a directive to a ref-', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, ExportDir] });
                    var template = '<div><div export-dir #localdir="dir"></div></div>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    matchers_1.expect(fixture.debugElement.children[0].children[0].references['localdir'])
                        .toBeAnInstanceOf(ExportDir);
                });
                it('should assign a directive to a ref when it has multiple exportAs names', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveWithMultipleExportAsNames] });
                    var template = '<div multiple-export-as #x="dirX" #y="dirY"></div>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    matchers_1.expect(fixture.debugElement.children[0].references['x'])
                        .toBeAnInstanceOf(DirectiveWithMultipleExportAsNames);
                    matchers_1.expect(fixture.debugElement.children[0].references['y'])
                        .toBeAnInstanceOf(DirectiveWithMultipleExportAsNames);
                });
                it('should make the assigned component accessible in property bindings, even if they were declared before the component', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, ChildComp] });
                    var template = '<ng-template [ngIf]="true">{{alice.ctxProp}}</ng-template>|{{alice.ctxProp}}|<child-cmp ref-alice></child-cmp>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    fixture.detectChanges();
                    matchers_1.expect(fixture.nativeElement).toHaveText('hello|hello|hello');
                });
                it('should assign two component instances each with a ref-', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, ChildComp] });
                    var template = '<p><child-cmp ref-alice></child-cmp><child-cmp ref-bob></child-cmp></p>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    var pEl = fixture.debugElement.children[0];
                    var alice = pEl.children[0].references['alice'];
                    var bob = pEl.children[1].references['bob'];
                    matchers_1.expect(alice).toBeAnInstanceOf(ChildComp);
                    matchers_1.expect(bob).toBeAnInstanceOf(ChildComp);
                    matchers_1.expect(alice).not.toBe(bob);
                });
                it('should assign the component instance to a ref- with shorthand syntax', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, ChildComp] });
                    var template = '<child-cmp #alice></child-cmp>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    matchers_1.expect(fixture.debugElement.children[0].references['alice'])
                        .toBeAnInstanceOf(ChildComp);
                });
                it('should assign the element instance to a user-defined variable', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                    var template = '<div><div ref-alice><i>Hello</i></div></div>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    var value = fixture.debugElement.children[0].children[0].references['alice'];
                    matchers_1.expect(value).not.toBe(null);
                    matchers_1.expect(value.tagName.toLowerCase()).toEqual('div');
                });
                it('should assign the TemplateRef to a user-defined variable', function () {
                    var fixture = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] })
                        .overrideComponent(MyComp, { set: { template: '<ng-template ref-alice></ng-template>' } })
                        .createComponent(MyComp);
                    var value = fixture.debugElement.childNodes[0].references['alice'];
                    matchers_1.expect(value.createEmbeddedView).toBeTruthy();
                });
                it('should preserve case', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, ChildComp] });
                    var template = '<p><child-cmp ref-superAlice></child-cmp></p>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    matchers_1.expect(fixture.debugElement.children[0].children[0].references['superAlice'])
                        .toBeAnInstanceOf(ChildComp);
                });
            });
            describe('variables', function () {
                it('should allow to use variables in a for loop', function () {
                    var template = '<ng-template ngFor [ngForOf]="[1]" let-i><child-cmp-no-template #cmp></child-cmp-no-template>{{i}}-{{cmp.ctxProp}}</ng-template>';
                    var fixture = testing_1.TestBed.configureTestingModule({ declarations: [MyComp, ChildCompNoTemplate] })
                        .overrideComponent(MyComp, { set: { template: template } })
                        .createComponent(MyComp);
                    fixture.detectChanges();
                    // Get the element at index 2, since index 0 is the <ng-template>.
                    matchers_1.expect(dom_adapter_1.getDOM().childNodes(fixture.nativeElement)[2]).toHaveText('1-hello');
                });
            });
            describe('OnPush components', function () {
                it('should use ChangeDetectorRef to manually request a check', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, [[PushCmpWithRef]]] });
                    var template = '<push-cmp-with-ref #cmp></push-cmp-with-ref>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    var cmp = fixture.debugElement.children[0].references['cmp'];
                    fixture.detectChanges();
                    matchers_1.expect(cmp.numberOfChecks).toEqual(1);
                    fixture.detectChanges();
                    matchers_1.expect(cmp.numberOfChecks).toEqual(1);
                    cmp.propagate();
                    fixture.detectChanges();
                    matchers_1.expect(cmp.numberOfChecks).toEqual(2);
                });
                it('should be checked when its bindings got updated', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, PushCmp, EventCmp], imports: [common_1.CommonModule] });
                    var template = '<push-cmp [prop]="ctxProp" #cmp></push-cmp>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    var cmp = fixture.debugElement.children[0].references['cmp'];
                    fixture.componentInstance.ctxProp = 'one';
                    fixture.detectChanges();
                    matchers_1.expect(cmp.numberOfChecks).toEqual(1);
                    fixture.componentInstance.ctxProp = 'two';
                    fixture.detectChanges();
                    matchers_1.expect(cmp.numberOfChecks).toEqual(2);
                });
                if (dom_adapter_1.getDOM().supportsDOMEvents()) {
                    it('should allow to destroy a component from within a host event handler', testing_1.fakeAsync(function () {
                        testing_1.TestBed.configureTestingModule({ declarations: [MyComp, [[PushCmpWithHostEvent]]] });
                        var template = '<push-cmp-with-host-event></push-cmp-with-host-event>';
                        testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                        var fixture = testing_1.TestBed.createComponent(MyComp);
                        testing_1.tick();
                        fixture.detectChanges();
                        var cmpEl = fixture.debugElement.children[0];
                        var cmp = cmpEl.injector.get(PushCmpWithHostEvent);
                        cmp.ctxCallback = function (_) { return fixture.destroy(); };
                        matchers_1.expect(function () { return cmpEl.triggerEventHandler('click', {}); }).not.toThrow();
                    }));
                }
                it('should be checked when an event is fired', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, PushCmp, EventCmp], imports: [common_1.CommonModule] });
                    var template = '<push-cmp [prop]="ctxProp" #cmp></push-cmp>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    var cmpEl = fixture.debugElement.children[0];
                    var cmp = cmpEl.componentInstance;
                    fixture.detectChanges();
                    fixture.detectChanges();
                    matchers_1.expect(cmp.numberOfChecks).toEqual(1);
                    // regular element
                    cmpEl.children[0].triggerEventHandler('click', {});
                    fixture.detectChanges();
                    fixture.detectChanges();
                    matchers_1.expect(cmp.numberOfChecks).toEqual(2);
                    // element inside of an *ngIf
                    cmpEl.children[1].triggerEventHandler('click', {});
                    fixture.detectChanges();
                    fixture.detectChanges();
                    matchers_1.expect(cmp.numberOfChecks).toEqual(3);
                    // element inside a nested component
                    cmpEl.children[2].children[0].triggerEventHandler('click', {});
                    fixture.detectChanges();
                    fixture.detectChanges();
                    matchers_1.expect(cmp.numberOfChecks).toEqual(4);
                    // host element
                    cmpEl.triggerEventHandler('click', {});
                    fixture.detectChanges();
                    fixture.detectChanges();
                    matchers_1.expect(cmp.numberOfChecks).toEqual(5);
                });
                it('should not affect updating properties on the component', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, [[PushCmpWithRef]]] });
                    var template = '<push-cmp-with-ref [prop]="ctxProp" #cmp></push-cmp-with-ref>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    var cmp = fixture.debugElement.children[0].references['cmp'];
                    fixture.componentInstance.ctxProp = 'one';
                    fixture.detectChanges();
                    matchers_1.expect(cmp.prop).toEqual('one');
                    fixture.componentInstance.ctxProp = 'two';
                    fixture.detectChanges();
                    matchers_1.expect(cmp.prop).toEqual('two');
                });
                if (dom_adapter_1.getDOM().supportsDOMEvents()) {
                    it('should be checked when an async pipe requests a check', testing_1.fakeAsync(function () {
                        testing_1.TestBed.configureTestingModule({ declarations: [MyComp, PushCmpWithAsyncPipe], imports: [common_1.CommonModule] });
                        var template = '<push-cmp-with-async #cmp></push-cmp-with-async>';
                        testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                        var fixture = testing_1.TestBed.createComponent(MyComp);
                        testing_1.tick();
                        var cmp = fixture.debugElement.children[0].references['cmp'];
                        fixture.detectChanges();
                        matchers_1.expect(cmp.numberOfChecks).toEqual(1);
                        fixture.detectChanges();
                        fixture.detectChanges();
                        matchers_1.expect(cmp.numberOfChecks).toEqual(1);
                        cmp.resolve(2);
                        testing_1.tick();
                        fixture.detectChanges();
                        matchers_1.expect(cmp.numberOfChecks).toEqual(2);
                    }));
                }
            });
            it('should create a component that injects an @Host', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [MyComp, SomeDirective, CompWithHost],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = "\n            <some-directive>\n              <p>\n                <cmp-with-host #child></cmp-with-host>\n              </p>\n            </some-directive>";
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var childComponent = fixture.debugElement.children[0].children[0].children[0].references['child'];
                matchers_1.expect(childComponent.myHost).toBeAnInstanceOf(SomeDirective);
            });
            it('should create a component that injects an @Host through viewcontainer directive', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [MyComp, SomeDirective, CompWithHost],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = "\n            <some-directive>\n              <p *ngIf=\"true\">\n                <cmp-with-host #child></cmp-with-host>\n              </p>\n            </some-directive>";
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                var tc = fixture.debugElement.children[0].children[0].children[0];
                var childComponent = tc.references['child'];
                matchers_1.expect(childComponent.myHost).toBeAnInstanceOf(SomeDirective);
            });
            it('should support events via EventEmitter on regular elements', testing_1.async(function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveEmittingEvent, DirectiveListeningEvent] });
                var template = '<div emitter listener></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var tc = fixture.debugElement.children[0];
                var emitter = tc.injector.get(DirectiveEmittingEvent);
                var listener = tc.injector.get(DirectiveListeningEvent);
                matchers_1.expect(listener.msg).toEqual('');
                var eventCount = 0;
                emitter.event.subscribe({
                    next: function () {
                        eventCount++;
                        if (eventCount === 1) {
                            matchers_1.expect(listener.msg).toEqual('fired !');
                            fixture.destroy();
                            emitter.fireEvent('fired again !');
                        }
                        else {
                            matchers_1.expect(listener.msg).toEqual('fired !');
                        }
                    }
                });
                emitter.fireEvent('fired !');
            }));
            it('should support events via EventEmitter on template elements', testing_1.async(function () {
                var fixture = testing_1.TestBed
                    .configureTestingModule({ declarations: [MyComp, DirectiveEmittingEvent, DirectiveListeningEvent] })
                    .overrideComponent(MyComp, {
                    set: {
                        template: '<ng-template emitter listener (event)="ctxProp=$event"></ng-template>'
                    }
                })
                    .createComponent(MyComp);
                var tc = fixture.debugElement.childNodes[0];
                var emitter = tc.injector.get(DirectiveEmittingEvent);
                var myComp = fixture.debugElement.injector.get(MyComp);
                var listener = tc.injector.get(DirectiveListeningEvent);
                myComp.ctxProp = '';
                matchers_1.expect(listener.msg).toEqual('');
                emitter.event.subscribe({
                    next: function () {
                        matchers_1.expect(listener.msg).toEqual('fired !');
                        matchers_1.expect(myComp.ctxProp).toEqual('fired !');
                    }
                });
                emitter.fireEvent('fired !');
            }));
            it('should support [()] syntax', testing_1.async(function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveWithTwoWayBinding] });
                var template = '<div [(control)]="ctxProp" two-way></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var tc = fixture.debugElement.children[0];
                var dir = tc.injector.get(DirectiveWithTwoWayBinding);
                fixture.componentInstance.ctxProp = 'one';
                fixture.detectChanges();
                matchers_1.expect(dir.control).toEqual('one');
                dir.controlChange.subscribe({ next: function () { matchers_1.expect(fixture.componentInstance.ctxProp).toEqual('two'); } });
                dir.triggerChange('two');
            }));
            it('should support render events', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveListeningDomEvent] });
                var template = '<div listener></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var tc = fixture.debugElement.children[0];
                var listener = tc.injector.get(DirectiveListeningDomEvent);
                browser_util_1.dispatchEvent(tc.nativeElement, 'domEvent');
                matchers_1.expect(listener.eventTypes).toEqual([
                    'domEvent', 'body_domEvent', 'document_domEvent', 'window_domEvent'
                ]);
                fixture.destroy();
                listener.eventTypes = [];
                browser_util_1.dispatchEvent(tc.nativeElement, 'domEvent');
                matchers_1.expect(listener.eventTypes).toEqual([]);
            });
            it('should support render global events', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveListeningDomEvent] });
                var template = '<div listener></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var doc = testing_1.TestBed.get(dom_tokens_1.DOCUMENT);
                var tc = fixture.debugElement.children[0];
                var listener = tc.injector.get(DirectiveListeningDomEvent);
                browser_util_1.dispatchEvent(dom_adapter_1.getDOM().getGlobalEventTarget(doc, 'window'), 'domEvent');
                matchers_1.expect(listener.eventTypes).toEqual(['window_domEvent']);
                listener.eventTypes = [];
                browser_util_1.dispatchEvent(dom_adapter_1.getDOM().getGlobalEventTarget(doc, 'document'), 'domEvent');
                matchers_1.expect(listener.eventTypes).toEqual(['document_domEvent', 'window_domEvent']);
                fixture.destroy();
                listener.eventTypes = [];
                browser_util_1.dispatchEvent(dom_adapter_1.getDOM().getGlobalEventTarget(doc, 'body'), 'domEvent');
                matchers_1.expect(listener.eventTypes).toEqual([]);
            });
            it('should support updating host element via hostAttributes on root elements', function () {
                var ComponentUpdatingHostAttributes = /** @class */ (function () {
                    function ComponentUpdatingHostAttributes() {
                    }
                    ComponentUpdatingHostAttributes = __decorate([
                        metadata_1.Component({ host: { 'role': 'button' }, template: '' })
                    ], ComponentUpdatingHostAttributes);
                    return ComponentUpdatingHostAttributes;
                }());
                testing_1.TestBed.configureTestingModule({ declarations: [ComponentUpdatingHostAttributes] });
                var fixture = testing_1.TestBed.createComponent(ComponentUpdatingHostAttributes);
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getAttribute(fixture.debugElement.nativeElement, 'role')).toEqual('button');
            });
            it('should support updating host element via hostAttributes on host elements', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveUpdatingHostAttributes] });
                var template = '<div update-host-attributes></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getAttribute(fixture.debugElement.children[0].nativeElement, 'role'))
                    .toEqual('button');
            });
            it('should support updating host element via hostProperties', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveUpdatingHostProperties] });
                var template = '<div update-host-properties></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var tc = fixture.debugElement.children[0];
                var updateHost = tc.injector.get(DirectiveUpdatingHostProperties);
                updateHost.id = 'newId';
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getProperty(tc.nativeElement, 'id')).toEqual('newId');
            });
            it('should not use template variables for expressions in hostProperties', function () {
                var DirectiveWithHostProps = /** @class */ (function () {
                    function DirectiveWithHostProps() {
                        this.id = 'one';
                    }
                    DirectiveWithHostProps = __decorate([
                        metadata_1.Directive({ selector: '[host-properties]', host: { '[id]': 'id', '[title]': 'unknownProp' } })
                    ], DirectiveWithHostProps);
                    return DirectiveWithHostProps;
                }());
                var fixture = testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveWithHostProps] })
                    .overrideComponent(MyComp, { set: { template: "<div *ngFor=\"let id of ['forId']\" host-properties></div>" } })
                    .createComponent(MyComp);
                fixture.detectChanges();
                var tc = fixture.debugElement.children[0];
                matchers_1.expect(tc.properties['id']).toBe('one');
                matchers_1.expect(tc.properties['title']).toBe(undefined);
            });
            it('should not allow pipes in hostProperties', function () {
                var DirectiveWithHostProps = /** @class */ (function () {
                    function DirectiveWithHostProps() {
                    }
                    DirectiveWithHostProps = __decorate([
                        metadata_1.Directive({ selector: '[host-properties]', host: { '[id]': 'id | uppercase' } })
                    ], DirectiveWithHostProps);
                    return DirectiveWithHostProps;
                }());
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveWithHostProps] });
                var template = '<div host-properties></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                matchers_1.expect(function () { return testing_1.TestBed.createComponent(MyComp); })
                    .toThrowError(/Host binding expression cannot contain pipes/);
            });
            it('should not use template variables for expressions in hostListeners', function () {
                var DirectiveWithHostListener = /** @class */ (function () {
                    function DirectiveWithHostListener() {
                        this.id = 'one';
                    }
                    DirectiveWithHostListener.prototype.doIt = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        this.receivedArgs = args;
                    };
                    DirectiveWithHostListener = __decorate([
                        metadata_1.Directive({ selector: '[host-listener]', host: { '(click)': 'doIt(id, unknownProp)' } })
                    ], DirectiveWithHostListener);
                    return DirectiveWithHostListener;
                }());
                var fixture = testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveWithHostListener] })
                    .overrideComponent(MyComp, { set: { template: "<div *ngFor=\"let id of ['forId']\" host-listener></div>" } })
                    .createComponent(MyComp);
                fixture.detectChanges();
                var tc = fixture.debugElement.children[0];
                tc.triggerEventHandler('click', {});
                var dir = tc.injector.get(DirectiveWithHostListener);
                matchers_1.expect(dir.receivedArgs).toEqual(['one', undefined]);
            });
            it('should not allow pipes in hostListeners', function () {
                var DirectiveWithHostListener = /** @class */ (function () {
                    function DirectiveWithHostListener() {
                    }
                    DirectiveWithHostListener = __decorate([
                        metadata_1.Directive({ selector: '[host-listener]', host: { '(click)': 'doIt() | somePipe' } })
                    ], DirectiveWithHostListener);
                    return DirectiveWithHostListener;
                }());
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveWithHostListener] });
                var template = '<div host-listener></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                matchers_1.expect(function () { return testing_1.TestBed.createComponent(MyComp); })
                    .toThrowError(/Cannot have a pipe in an action expression/);
            });
            if (dom_adapter_1.getDOM().supportsDOMEvents()) {
                it('should support preventing default on render events', function () {
                    testing_1.TestBed.configureTestingModule({
                        declarations: [MyComp, DirectiveListeningDomEventPrevent, DirectiveListeningDomEventNoPrevent]
                    });
                    var template = '<input type="checkbox" listenerprevent><input type="checkbox" listenernoprevent>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    var dispatchedEvent = dom_adapter_1.getDOM().createMouseEvent('click');
                    var dispatchedEvent2 = dom_adapter_1.getDOM().createMouseEvent('click');
                    dom_adapter_1.getDOM().dispatchEvent(fixture.debugElement.children[0].nativeElement, dispatchedEvent);
                    dom_adapter_1.getDOM().dispatchEvent(fixture.debugElement.children[1].nativeElement, dispatchedEvent2);
                    matchers_1.expect(dom_adapter_1.getDOM().isPrevented(dispatchedEvent)).toBe(true);
                    matchers_1.expect(dom_adapter_1.getDOM().isPrevented(dispatchedEvent2)).toBe(false);
                    matchers_1.expect(dom_adapter_1.getDOM().getChecked(fixture.debugElement.children[0].nativeElement)).toBeFalsy();
                    matchers_1.expect(dom_adapter_1.getDOM().getChecked(fixture.debugElement.children[1].nativeElement)).toBeTruthy();
                });
            }
            it('should support render global events from multiple directives', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveListeningDomEvent, DirectiveListeningDomEventOther] });
                var template = '<div *ngIf="ctxBoolProp" listener listenerother></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var doc = testing_1.TestBed.get(dom_tokens_1.DOCUMENT);
                globalCounter = 0;
                fixture.componentInstance.ctxBoolProp = true;
                fixture.detectChanges();
                var tc = fixture.debugElement.children[0];
                var listener = tc.injector.get(DirectiveListeningDomEvent);
                var listenerother = tc.injector.get(DirectiveListeningDomEventOther);
                browser_util_1.dispatchEvent(dom_adapter_1.getDOM().getGlobalEventTarget(doc, 'window'), 'domEvent');
                matchers_1.expect(listener.eventTypes).toEqual(['window_domEvent']);
                matchers_1.expect(listenerother.eventType).toEqual('other_domEvent');
                matchers_1.expect(globalCounter).toEqual(1);
                fixture.componentInstance.ctxBoolProp = false;
                fixture.detectChanges();
                browser_util_1.dispatchEvent(dom_adapter_1.getDOM().getGlobalEventTarget(doc, 'window'), 'domEvent');
                matchers_1.expect(globalCounter).toEqual(1);
                fixture.componentInstance.ctxBoolProp = true;
                fixture.detectChanges();
                browser_util_1.dispatchEvent(dom_adapter_1.getDOM().getGlobalEventTarget(doc, 'window'), 'domEvent');
                matchers_1.expect(globalCounter).toEqual(2);
                // need to destroy to release all remaining global event listeners
                fixture.destroy();
            });
            describe('ViewContainerRef', function () {
                beforeEach(function () {
                    // we need a module to declarate ChildCompUsingService as an entryComponent otherwise the
                    // factory doesn't get created
                    var MyModule = /** @class */ (function () {
                        function MyModule() {
                        }
                        MyModule = __decorate([
                            core_1.NgModule({
                                declarations: [MyComp, DynamicViewport, ChildCompUsingService],
                                entryComponents: [ChildCompUsingService],
                                schemas: [core_1.NO_ERRORS_SCHEMA],
                            })
                        ], MyModule);
                        return MyModule;
                    }());
                    testing_1.TestBed.configureTestingModule({ imports: [MyModule] });
                    testing_1.TestBed.overrideComponent(MyComp, { add: { template: '<div><dynamic-vp #dynamic></dynamic-vp></div>' } });
                });
                describe('.createComponent', function () {
                    it('should allow to create a component at any bound location', testing_1.async(function () {
                        var fixture = testing_1.TestBed.configureTestingModule({ schemas: [core_1.NO_ERRORS_SCHEMA] })
                            .createComponent(MyComp);
                        var tc = fixture.debugElement.children[0].children[0];
                        var dynamicVp = tc.injector.get(DynamicViewport);
                        dynamicVp.create();
                        fixture.detectChanges();
                        matchers_1.expect(fixture.debugElement.children[0].children[1].nativeElement)
                            .toHaveText('dynamic greet');
                    }));
                    it('should allow to create multiple components at a location', testing_1.async(function () {
                        var fixture = testing_1.TestBed.configureTestingModule({ schemas: [core_1.NO_ERRORS_SCHEMA] })
                            .createComponent(MyComp);
                        var tc = fixture.debugElement.children[0].children[0];
                        var dynamicVp = tc.injector.get(DynamicViewport);
                        dynamicVp.create();
                        dynamicVp.create();
                        fixture.detectChanges();
                        matchers_1.expect(fixture.debugElement.children[0].children[1].nativeElement)
                            .toHaveText('dynamic greet');
                        matchers_1.expect(fixture.debugElement.children[0].children[2].nativeElement)
                            .toHaveText('dynamic greet');
                    }));
                    it('should create a component that has been freshly compiled', function () {
                        var RootComp = /** @class */ (function () {
                            function RootComp(vc) {
                                this.vc = vc;
                            }
                            RootComp = __decorate([
                                metadata_1.Component({ template: '' }),
                                __metadata("design:paramtypes", [view_container_ref_1.ViewContainerRef])
                            ], RootComp);
                            return RootComp;
                        }());
                        var RootModule = /** @class */ (function () {
                            function RootModule() {
                            }
                            RootModule = __decorate([
                                core_1.NgModule({
                                    declarations: [RootComp],
                                    providers: [{ provide: 'someToken', useValue: 'someRootValue' }],
                                })
                            ], RootModule);
                            return RootModule;
                        }());
                        var MyComp = /** @class */ (function () {
                            function MyComp(someToken) {
                                this.someToken = someToken;
                            }
                            MyComp = __decorate([
                                metadata_1.Component({ template: '' }),
                                __param(0, core_1.Inject('someToken')),
                                __metadata("design:paramtypes", [String])
                            ], MyComp);
                            return MyComp;
                        }());
                        var MyModule = /** @class */ (function () {
                            function MyModule() {
                            }
                            MyModule = __decorate([
                                core_1.NgModule({
                                    declarations: [MyComp],
                                    providers: [{ provide: 'someToken', useValue: 'someValue' }],
                                })
                            ], MyModule);
                            return MyModule;
                        }());
                        var compFixture = testing_1.TestBed.configureTestingModule({ imports: [RootModule] }).createComponent(RootComp);
                        var compiler = testing_1.TestBed.get(core_1.Compiler);
                        var myCompFactory = compiler.compileModuleAndAllComponentsSync(MyModule)
                            .componentFactories[0];
                        // Note: the ComponentFactory was created directly via the compiler, i.e. it
                        // does not have an association to an NgModuleRef.
                        // -> expect the providers of the module that the view container belongs to.
                        var compRef = compFixture.componentInstance.vc.createComponent(myCompFactory);
                        matchers_1.expect(compRef.instance.someToken).toBe('someRootValue');
                    });
                    it('should create a component with the passed NgModuleRef', function () {
                        var RootComp = /** @class */ (function () {
                            function RootComp(vc) {
                                this.vc = vc;
                            }
                            RootComp = __decorate([
                                metadata_1.Component({ template: '' }),
                                __metadata("design:paramtypes", [view_container_ref_1.ViewContainerRef])
                            ], RootComp);
                            return RootComp;
                        }());
                        var MyComp = /** @class */ (function () {
                            function MyComp(someToken) {
                                this.someToken = someToken;
                            }
                            MyComp = __decorate([
                                metadata_1.Component({ template: '' }),
                                __param(0, core_1.Inject('someToken')),
                                __metadata("design:paramtypes", [String])
                            ], MyComp);
                            return MyComp;
                        }());
                        var RootModule = /** @class */ (function () {
                            function RootModule() {
                            }
                            RootModule = __decorate([
                                core_1.NgModule({
                                    declarations: [RootComp, MyComp],
                                    entryComponents: [MyComp],
                                    providers: [{ provide: 'someToken', useValue: 'someRootValue' }],
                                })
                            ], RootModule);
                            return RootModule;
                        }());
                        var MyModule = /** @class */ (function () {
                            function MyModule() {
                            }
                            MyModule = __decorate([
                                core_1.NgModule({ providers: [{ provide: 'someToken', useValue: 'someValue' }] })
                            ], MyModule);
                            return MyModule;
                        }());
                        var compFixture = testing_1.TestBed.configureTestingModule({ imports: [RootModule] }).createComponent(RootComp);
                        var compiler = testing_1.TestBed.get(core_1.Compiler);
                        var myModule = compiler.compileModuleSync(MyModule).create(testing_1.TestBed.get(core_1.NgModuleRef));
                        var myCompFactory = testing_1.TestBed.get(component_factory_resolver_1.ComponentFactoryResolver)
                            .resolveComponentFactory(MyComp);
                        // Note: MyComp was declared as entryComponent in the RootModule,
                        // but we pass MyModule to the createComponent call.
                        // -> expect the providers of MyModule!
                        var compRef = compFixture.componentInstance.vc.createComponent(myCompFactory, undefined, undefined, undefined, myModule);
                        matchers_1.expect(compRef.instance.someToken).toBe('someValue');
                    });
                    it('should create a component with the NgModuleRef of the ComponentFactoryResolver', function () {
                        var RootComp = /** @class */ (function () {
                            function RootComp(vc) {
                                this.vc = vc;
                            }
                            RootComp = __decorate([
                                metadata_1.Component({ template: '' }),
                                __metadata("design:paramtypes", [view_container_ref_1.ViewContainerRef])
                            ], RootComp);
                            return RootComp;
                        }());
                        var RootModule = /** @class */ (function () {
                            function RootModule() {
                            }
                            RootModule = __decorate([
                                core_1.NgModule({
                                    declarations: [RootComp],
                                    providers: [{ provide: 'someToken', useValue: 'someRootValue' }],
                                })
                            ], RootModule);
                            return RootModule;
                        }());
                        var MyComp = /** @class */ (function () {
                            function MyComp(someToken) {
                                this.someToken = someToken;
                            }
                            MyComp = __decorate([
                                metadata_1.Component({ template: '' }),
                                __param(0, core_1.Inject('someToken')),
                                __metadata("design:paramtypes", [String])
                            ], MyComp);
                            return MyComp;
                        }());
                        var MyModule = /** @class */ (function () {
                            function MyModule() {
                            }
                            MyModule = __decorate([
                                core_1.NgModule({
                                    declarations: [MyComp],
                                    entryComponents: [MyComp],
                                    providers: [{ provide: 'someToken', useValue: 'someValue' }],
                                })
                            ], MyModule);
                            return MyModule;
                        }());
                        var compFixture = testing_1.TestBed.configureTestingModule({ imports: [RootModule] })
                            .createComponent(RootComp);
                        var compiler = testing_1.TestBed.get(core_1.Compiler);
                        var myModule = compiler.compileModuleSync(MyModule).create(testing_1.TestBed.get(core_1.NgModuleRef));
                        var myCompFactory = myModule.componentFactoryResolver.resolveComponentFactory(MyComp);
                        // Note: MyComp was declared as entryComponent in MyModule,
                        // and we don't pass an explicit ModuleRef to the createComponent call.
                        // -> expect the providers of MyModule!
                        var compRef = compFixture.componentInstance.vc.createComponent(myCompFactory);
                        matchers_1.expect(compRef.instance.someToken).toBe('someValue');
                    });
                });
                describe('.insert', function () {
                    it('should throw with destroyed views', testing_1.async(function () {
                        var fixture = testing_1.TestBed.configureTestingModule({ schemas: [core_1.NO_ERRORS_SCHEMA] })
                            .createComponent(MyComp);
                        var tc = fixture.debugElement.children[0].children[0];
                        var dynamicVp = tc.injector.get(DynamicViewport);
                        var ref = dynamicVp.create();
                        fixture.detectChanges();
                        ref.destroy();
                        matchers_1.expect(function () {
                            dynamicVp.insert(ref.hostView);
                        }).toThrowError('Cannot insert a destroyed View in a ViewContainer!');
                    }));
                });
                describe('.move', function () {
                    it('should throw with destroyed views', testing_1.async(function () {
                        var fixture = testing_1.TestBed.configureTestingModule({ schemas: [core_1.NO_ERRORS_SCHEMA] })
                            .createComponent(MyComp);
                        var tc = fixture.debugElement.children[0].children[0];
                        var dynamicVp = tc.injector.get(DynamicViewport);
                        var ref = dynamicVp.create();
                        fixture.detectChanges();
                        ref.destroy();
                        matchers_1.expect(function () {
                            dynamicVp.move(ref.hostView, 1);
                        }).toThrowError('Cannot move a destroyed View in a ViewContainer!');
                    }));
                });
            });
            it('should support static attributes', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, NeedsAttribute] });
                var template = '<input static type="text" title>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var tc = fixture.debugElement.children[0];
                var needsAttribute = tc.injector.get(NeedsAttribute);
                matchers_1.expect(needsAttribute.typeAttribute).toEqual('text');
                matchers_1.expect(needsAttribute.staticAttribute).toEqual('');
                matchers_1.expect(needsAttribute.fooAttribute).toBeNull();
            });
            it('should support custom interpolation', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [
                        MyComp, ComponentWithCustomInterpolationA, ComponentWithCustomInterpolationB,
                        ComponentWithDefaultInterpolation
                    ]
                });
                var template = "<div>{{ctxProp}}</div>\n<cmp-with-custom-interpolation-a></cmp-with-custom-interpolation-a>\n<cmp-with-custom-interpolation-b></cmp-with-custom-interpolation-b>";
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'Default Interpolation';
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement)
                    .toHaveText('Default InterpolationCustom Interpolation ACustom Interpolation B (Default Interpolation)');
            });
        });
        describe('dependency injection', function () {
            it('should support bindings', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [MyComp, DirectiveProvidingInjectable, DirectiveConsumingInjectable],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = "\n            <directive-providing-injectable >\n              <directive-consuming-injectable #consuming>\n              </directive-consuming-injectable>\n            </directive-providing-injectable>\n          ";
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var comp = fixture.debugElement.children[0].children[0].references['consuming'];
                matchers_1.expect(comp.injectable).toBeAnInstanceOf(InjectableService);
            });
            it('should support viewProviders', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [MyComp, DirectiveProvidingInjectableInView, DirectiveConsumingInjectable],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = "\n              <directive-consuming-injectable #consuming>\n              </directive-consuming-injectable>\n          ";
                testing_1.TestBed.overrideComponent(DirectiveProvidingInjectableInView, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(DirectiveProvidingInjectableInView);
                var comp = fixture.debugElement.children[0].references['consuming'];
                matchers_1.expect(comp.injectable).toBeAnInstanceOf(InjectableService);
            });
            it('should support unbounded lookup', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [
                        MyComp, DirectiveProvidingInjectable, DirectiveContainingDirectiveConsumingAnInjectable,
                        DirectiveConsumingInjectableUnbounded
                    ],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = "\n            <directive-providing-injectable>\n              <directive-containing-directive-consuming-an-injectable #dir>\n              </directive-containing-directive-consuming-an-injectable>\n            </directive-providing-injectable>\n          ";
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                testing_1.TestBed.overrideComponent(DirectiveContainingDirectiveConsumingAnInjectable, {
                    set: {
                        template: "\n            <directive-consuming-injectable-unbounded></directive-consuming-injectable-unbounded>\n          "
                    }
                });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var comp = fixture.debugElement.children[0].children[0].references['dir'];
                matchers_1.expect(comp.directive.injectable).toBeAnInstanceOf(InjectableService);
            });
            it('should support the event-bus scenario', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [
                        MyComp, GrandParentProvidingEventBus, ParentProvidingEventBus, ChildConsumingEventBus
                    ],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = "\n            <grand-parent-providing-event-bus>\n              <parent-providing-event-bus>\n                <child-consuming-event-bus>\n                </child-consuming-event-bus>\n              </parent-providing-event-bus>\n            </grand-parent-providing-event-bus>\n          ";
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var gpComp = fixture.debugElement.children[0];
                var parentComp = gpComp.children[0];
                var childComp = parentComp.children[0];
                var grandParent = gpComp.injector.get(GrandParentProvidingEventBus);
                var parent = parentComp.injector.get(ParentProvidingEventBus);
                var child = childComp.injector.get(ChildConsumingEventBus);
                matchers_1.expect(grandParent.bus.name).toEqual('grandparent');
                matchers_1.expect(parent.bus.name).toEqual('parent');
                matchers_1.expect(parent.grandParentBus).toBe(grandParent.bus);
                matchers_1.expect(child.bus).toBe(parent.bus);
            });
            it('should instantiate bindings lazily', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [MyComp, DirectiveConsumingInjectable, ComponentProvidingLoggingInjectable],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = "\n              <component-providing-logging-injectable #providing>\n                <directive-consuming-injectable *ngIf=\"ctxBoolProp\">\n                </directive-consuming-injectable>\n              </component-providing-logging-injectable>\n          ";
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                var providing = fixture.debugElement.children[0].references['providing'];
                matchers_1.expect(providing.created).toBe(false);
                fixture.componentInstance.ctxBoolProp = true;
                fixture.detectChanges();
                matchers_1.expect(providing.created).toBe(true);
            });
        });
        describe('corner cases', function () {
            it('should remove script tags from templates', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = "\n            <script>alert(\"Ooops\");</script>\n            <div>before<script>alert(\"Ooops\");</script><span>inside</span>after</div>";
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                matchers_1.expect(dom_adapter_1.getDOM().querySelectorAll(fixture.nativeElement, 'script').length).toEqual(0);
            });
            it('should throw when using directives without selector', function () {
                var SomeDirective = /** @class */ (function () {
                    function SomeDirective() {
                    }
                    SomeDirective = __decorate([
                        metadata_1.Directive({})
                    ], SomeDirective);
                    return SomeDirective;
                }());
                var SomeComponent = /** @class */ (function () {
                    function SomeComponent() {
                    }
                    SomeComponent = __decorate([
                        metadata_1.Component({ selector: 'comp', template: '' })
                    ], SomeComponent);
                    return SomeComponent;
                }());
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, SomeDirective, SomeComponent] });
                matchers_1.expect(function () { return testing_1.TestBed.createComponent(MyComp); })
                    .toThrowError("Directive " + util_1.stringify(SomeDirective) + " has no selector, please add it!");
            });
            it('should use a default element name for components without selectors', function () {
                var noSelectorComponentFactory = undefined;
                var NoSelectorComponent = /** @class */ (function () {
                    function NoSelectorComponent() {
                    }
                    NoSelectorComponent = __decorate([
                        metadata_1.Component({ template: '----' })
                    ], NoSelectorComponent);
                    return NoSelectorComponent;
                }());
                var SomeComponent = /** @class */ (function () {
                    function SomeComponent(componentFactoryResolver) {
                        // grab its own component factory
                        noSelectorComponentFactory =
                            componentFactoryResolver.resolveComponentFactory(NoSelectorComponent);
                    }
                    SomeComponent = __decorate([
                        metadata_1.Component({ selector: 'some-comp', template: '', entryComponents: [NoSelectorComponent] }),
                        __metadata("design:paramtypes", [component_factory_resolver_1.ComponentFactoryResolver])
                    ], SomeComponent);
                    return SomeComponent;
                }());
                testing_1.TestBed.configureTestingModule({ declarations: [SomeComponent, NoSelectorComponent] });
                // get the factory
                testing_1.TestBed.createComponent(SomeComponent);
                matchers_1.expect(noSelectorComponentFactory.selector).toBe('ng-component');
                matchers_1.expect(dom_adapter_1.getDOM()
                    .nodeName(noSelectorComponentFactory.create(core_1.Injector.NULL).location.nativeElement)
                    .toLowerCase())
                    .toEqual('ng-component');
            });
        });
        describe('error handling', function () {
            it('should report a meaningful error when a directive is missing annotation', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, SomeDirectiveMissingAnnotation] });
                matchers_1.expect(function () { return testing_1.TestBed.createComponent(MyComp); })
                    .toThrowError("Unexpected value '" + util_1.stringify(SomeDirectiveMissingAnnotation) + "' declared by the module 'DynamicTestModule'. Please add a @Pipe/@Directive/@Component annotation.");
            });
            it('should report a meaningful error when a component is missing view annotation', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, ComponentWithoutView] });
                try {
                    testing_1.TestBed.createComponent(ComponentWithoutView);
                    matchers_1.expect(true).toBe(false);
                }
                catch (e) {
                    matchers_1.expect(e.message).toContain("No template specified for component " + util_1.stringify(ComponentWithoutView));
                }
            });
            it('should provide an error context when an error happens in DI', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [MyComp, DirectiveThrowingAnError],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = "<directive-throwing-error></directive-throwing-error>";
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                try {
                    testing_1.TestBed.createComponent(MyComp);
                    throw 'Should throw';
                }
                catch (e) {
                    var c = errors_1.getDebugContext(e);
                    matchers_1.expect(dom_adapter_1.getDOM().nodeName(c.componentRenderElement).toUpperCase()).toEqual('DIV');
                    matchers_1.expect(c.injector.get).toBeTruthy();
                }
            });
            it('should provide an error context when an error happens in change detection', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveThrowingAnError] });
                var template = "<input [value]=\"one.two.three\" #local>";
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                try {
                    fixture.detectChanges();
                    throw 'Should throw';
                }
                catch (e) {
                    var c = errors_1.getDebugContext(e);
                    matchers_1.expect(dom_adapter_1.getDOM().nodeName(c.renderNode).toUpperCase()).toEqual('INPUT');
                    matchers_1.expect(dom_adapter_1.getDOM().nodeName(c.componentRenderElement).toUpperCase()).toEqual('DIV');
                    matchers_1.expect(c.injector.get).toBeTruthy();
                    matchers_1.expect(c.context).toBe(fixture.componentInstance);
                    matchers_1.expect(c.references['local']).toBeDefined();
                }
            });
            it('should provide an error context when an error happens in change detection (text node)', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = "<div>{{one.two.three}}</div>";
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                try {
                    fixture.detectChanges();
                    throw 'Should throw';
                }
                catch (e) {
                    var c = errors_1.getDebugContext(e);
                    matchers_1.expect(c.renderNode).toBeTruthy();
                }
            });
            if (dom_adapter_1.getDOM().supportsDOMEvents()) { // this is required to use fakeAsync
                it('should provide an error context when an error happens in an event handler', testing_1.fakeAsync(function () {
                    testing_1.TestBed.configureTestingModule({
                        declarations: [MyComp, DirectiveEmittingEvent, DirectiveListeningEvent],
                        schemas: [core_1.NO_ERRORS_SCHEMA],
                    });
                    var template = "<span emitter listener (event)=\"throwError()\" #local></span>";
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    testing_1.tick();
                    var tc = fixture.debugElement.children[0];
                    var errorHandler = tc.injector.get(core_1.ErrorHandler);
                    var err;
                    spyOn(errorHandler, 'handleError').and.callFake(function (e) { return err = e; });
                    tc.injector.get(DirectiveEmittingEvent).fireEvent('boom');
                    matchers_1.expect(err).toBeTruthy();
                    var c = errors_1.getDebugContext(err);
                    matchers_1.expect(dom_adapter_1.getDOM().nodeName(c.renderNode).toUpperCase()).toEqual('SPAN');
                    matchers_1.expect(dom_adapter_1.getDOM().nodeName(c.componentRenderElement).toUpperCase()).toEqual('DIV');
                    matchers_1.expect(c.injector.get).toBeTruthy();
                    matchers_1.expect(c.context).toBe(fixture.componentInstance);
                    matchers_1.expect(c.references['local']).toBeDefined();
                }));
            }
        });
        it('should support imperative views', function () {
            testing_1.TestBed.configureTestingModule({ declarations: [MyComp, SimpleImperativeViewComponent] });
            var template = '<simple-imp-cmp></simple-imp-cmp>';
            testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
            var fixture = testing_1.TestBed.createComponent(MyComp);
            matchers_1.expect(fixture.nativeElement).toHaveText('hello imp view');
        });
        it('should support moving embedded views around', function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [MyComp, SomeImperativeViewport],
                providers: [{ provide: ANCHOR_ELEMENT, useValue: browser_util_1.el('<div></div>') }],
            });
            var template = '<div><div *someImpvp="ctxBoolProp">hello</div></div>';
            testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
            var anchorElement = testing_1.getTestBed().get(ANCHOR_ELEMENT);
            var fixture = testing_1.TestBed.createComponent(MyComp);
            fixture.detectChanges();
            matchers_1.expect(anchorElement).toHaveText('');
            fixture.componentInstance.ctxBoolProp = true;
            fixture.detectChanges();
            matchers_1.expect(anchorElement).toHaveText('hello');
            fixture.componentInstance.ctxBoolProp = false;
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText('');
        });
        describe('Property bindings', function () {
            it('should throw on bindings to unknown properties', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                var template = '<div unknown="{{ctxProp}}"></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                try {
                    testing_1.TestBed.createComponent(MyComp);
                    throw 'Should throw';
                }
                catch (e) {
                    matchers_1.expect(e.message).toMatch(/Template parse errors:\nCan't bind to 'unknown' since it isn't a known property of 'div'. \("<div \[ERROR ->\]unknown="{{ctxProp}}"><\/div>"\): .*MyComp.html@0:5/);
                }
            });
            it('should not throw for property binding to a non-existing property when there is a matching directive property', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, MyDir] });
                var template = '<div my-dir [elprop]="ctxProp"></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                matchers_1.expect(function () { return testing_1.TestBed.createComponent(MyComp); }).not.toThrow();
            });
            it('should not be created when there is a directive with the same property', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveWithTitle] });
                var template = '<span [title]="ctxProp"></span>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'TITLE';
                fixture.detectChanges();
                var el = dom_adapter_1.getDOM().querySelector(fixture.nativeElement, 'span');
                matchers_1.expect(el.title).toBeFalsy();
            });
            it('should work when a directive uses hostProperty to update the DOM element', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, DirectiveWithTitleAndHostProperty] });
                var template = '<span [title]="ctxProp"></span>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'TITLE';
                fixture.detectChanges();
                var el = dom_adapter_1.getDOM().querySelector(fixture.nativeElement, 'span');
                matchers_1.expect(dom_adapter_1.getDOM().getProperty(el, 'title')).toEqual('TITLE');
            });
        });
        describe('logging property updates', function () {
            it('should reflect property values as attributes', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, MyDir] });
                var template = '<div>' +
                    '<div my-dir [elprop]="ctxProp"></div>' +
                    '</div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.componentInstance.ctxProp = 'hello';
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getInnerHTML(fixture.nativeElement))
                    .toContain('ng-reflect-dir-prop="hello"');
            });
            it("should work with prop names containing '$'", function () {
                testing_1.TestBed.configureTestingModule({ declarations: [ParentCmp, SomeCmpWithInput] });
                var fixture = testing_1.TestBed.createComponent(ParentCmp);
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getInnerHTML(fixture.nativeElement)).toContain('ng-reflect-test_="hello"');
            });
            it('should reflect property values on template comments', function () {
                var fixture = testing_1.TestBed.configureTestingModule({ declarations: [MyComp] })
                    .overrideComponent(MyComp, { set: { template: '<ng-template [ngIf]="ctxBoolProp"></ng-template>' } })
                    .createComponent(MyComp);
                fixture.componentInstance.ctxBoolProp = true;
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getInnerHTML(fixture.nativeElement))
                    .toContain('"ng\-reflect\-ng\-if"\: "true"');
            });
            it('should indicate when toString() throws', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyComp, MyDir] });
                var template = '<div my-dir [elprop]="toStringThrow"></div>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getInnerHTML(fixture.nativeElement)).toContain('[ERROR]');
            });
        });
        describe('property decorators', function () {
            it('should support property decorators', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [MyComp, DirectiveWithPropDecorators],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = '<with-prop-decorators elProp="aaa"></with-prop-decorators>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                var dir = fixture.debugElement.children[0].injector.get(DirectiveWithPropDecorators);
                matchers_1.expect(dir.dirProp).toEqual('aaa');
            });
            it('should support host binding decorators', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [MyComp, DirectiveWithPropDecorators],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = '<with-prop-decorators></with-prop-decorators>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                var dir = fixture.debugElement.children[0].injector.get(DirectiveWithPropDecorators);
                dir.myAttr = 'aaa';
                fixture.detectChanges();
                matchers_1.expect(dom_adapter_1.getDOM().getOuterHTML(fixture.debugElement.children[0].nativeElement))
                    .toContain('my-attr="aaa"');
            });
            if (dom_adapter_1.getDOM().supportsDOMEvents()) {
                it('should support event decorators', testing_1.fakeAsync(function () {
                    testing_1.TestBed.configureTestingModule({
                        declarations: [MyComp, DirectiveWithPropDecorators],
                        schemas: [core_1.NO_ERRORS_SCHEMA],
                    });
                    var template = "<with-prop-decorators (elEvent)=\"ctxProp='called'\">";
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    testing_1.tick();
                    var emitter = fixture.debugElement.children[0].injector.get(DirectiveWithPropDecorators);
                    emitter.fireEvent('fired !');
                    testing_1.tick();
                    matchers_1.expect(fixture.componentInstance.ctxProp).toEqual('called');
                }));
                it('should support host listener decorators', function () {
                    testing_1.TestBed.configureTestingModule({
                        declarations: [MyComp, DirectiveWithPropDecorators],
                        schemas: [core_1.NO_ERRORS_SCHEMA],
                    });
                    var template = '<with-prop-decorators></with-prop-decorators>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    fixture.detectChanges();
                    var dir = fixture.debugElement.children[0].injector.get(DirectiveWithPropDecorators);
                    var native = fixture.debugElement.children[0].nativeElement;
                    dom_adapter_1.getDOM().dispatchEvent(native, dom_adapter_1.getDOM().createMouseEvent('click'));
                    matchers_1.expect(dir.target).toBe(native);
                });
            }
            it('should support defining views in the component decorator', function () {
                testing_1.TestBed.configureTestingModule({
                    declarations: [MyComp, ComponentWithTemplate],
                    imports: [common_1.CommonModule],
                    schemas: [core_1.NO_ERRORS_SCHEMA],
                });
                var template = '<component-with-template></component-with-template>';
                testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(MyComp);
                fixture.detectChanges();
                var native = fixture.debugElement.children[0].nativeElement;
                matchers_1.expect(native).toHaveText('No View Decorator: 123');
            });
        });
        describe('whitespaces in templates', function () {
            it('should not remove whitespaces by default', testing_1.async(function () {
                var MyCmp = /** @class */ (function () {
                    function MyCmp() {
                    }
                    MyCmp = __decorate([
                        metadata_1.Component({
                            selector: 'comp',
                            template: '<span>foo</span>  <span>bar</span>',
                        })
                    ], MyCmp);
                    return MyCmp;
                }());
                var f = testing_1.TestBed.configureTestingModule({ declarations: [MyCmp] }).createComponent(MyCmp);
                f.detectChanges();
                matchers_1.expect(f.nativeElement.childNodes.length).toBe(2);
            }));
            it('should not remove whitespaces when explicitly requested not to do so', testing_1.async(function () {
                var MyCmp = /** @class */ (function () {
                    function MyCmp() {
                    }
                    MyCmp = __decorate([
                        metadata_1.Component({
                            selector: 'comp',
                            template: '<span>foo</span>  <span>bar</span>',
                            preserveWhitespaces: true,
                        })
                    ], MyCmp);
                    return MyCmp;
                }());
                var f = testing_1.TestBed.configureTestingModule({ declarations: [MyCmp] }).createComponent(MyCmp);
                f.detectChanges();
                matchers_1.expect(f.nativeElement.childNodes.length).toBe(3);
            }));
            it('should remove whitespaces when explicitly requested to do so', testing_1.async(function () {
                var MyCmp = /** @class */ (function () {
                    function MyCmp() {
                    }
                    MyCmp = __decorate([
                        metadata_1.Component({
                            selector: 'comp',
                            template: '<span>foo</span>  <span>bar</span>',
                            preserveWhitespaces: false,
                        })
                    ], MyCmp);
                    return MyCmp;
                }());
                var f = testing_1.TestBed.configureTestingModule({ declarations: [MyCmp] }).createComponent(MyCmp);
                f.detectChanges();
                matchers_1.expect(f.nativeElement.childNodes.length).toBe(2);
            }));
        });
        if (dom_adapter_1.getDOM().supportsDOMEvents()) {
            describe('svg', function () {
                it('should support svg elements', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                    var template = '<svg><use xlink:href="Port" /></svg>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    var el = fixture.nativeElement;
                    var svg = dom_adapter_1.getDOM().childNodes(el)[0];
                    var use = dom_adapter_1.getDOM().childNodes(svg)[0];
                    matchers_1.expect(dom_adapter_1.getDOM().getProperty(svg, 'namespaceURI'))
                        .toEqual('http://www.w3.org/2000/svg');
                    matchers_1.expect(dom_adapter_1.getDOM().getProperty(use, 'namespaceURI'))
                        .toEqual('http://www.w3.org/2000/svg');
                    var firstAttribute = dom_adapter_1.getDOM().getProperty(use, 'attributes')[0];
                    matchers_1.expect(firstAttribute.name).toEqual('xlink:href');
                    matchers_1.expect(firstAttribute.namespaceURI).toEqual('http://www.w3.org/1999/xlink');
                });
                it('should support foreignObjects with document fragments', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp] });
                    var template = '<svg><foreignObject><xhtml:div><p>Test</p></xhtml:div></foreignObject></svg>';
                    testing_1.TestBed.overrideComponent(MyComp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(MyComp);
                    var el = fixture.nativeElement;
                    var svg = dom_adapter_1.getDOM().childNodes(el)[0];
                    var foreignObject = dom_adapter_1.getDOM().childNodes(svg)[0];
                    var p = dom_adapter_1.getDOM().childNodes(foreignObject)[0];
                    matchers_1.expect(dom_adapter_1.getDOM().getProperty(svg, 'namespaceURI'))
                        .toEqual('http://www.w3.org/2000/svg');
                    matchers_1.expect(dom_adapter_1.getDOM().getProperty(foreignObject, 'namespaceURI'))
                        .toEqual('http://www.w3.org/2000/svg');
                    matchers_1.expect(dom_adapter_1.getDOM().getProperty(p, 'namespaceURI'))
                        .toEqual('http://www.w3.org/1999/xhtml');
                });
            });
            describe('attributes', function () {
                it('should support attributes with namespace', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, SomeCmp] });
                    var template = '<svg:use xlink:href="#id" />';
                    testing_1.TestBed.overrideComponent(SomeCmp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(SomeCmp);
                    var useEl = dom_adapter_1.getDOM().firstChild(fixture.nativeElement);
                    matchers_1.expect(dom_adapter_1.getDOM().getAttributeNS(useEl, 'http://www.w3.org/1999/xlink', 'href'))
                        .toEqual('#id');
                });
                it('should support binding to attributes with namespace', function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [MyComp, SomeCmp] });
                    var template = '<svg:use [attr.xlink:href]="value" />';
                    testing_1.TestBed.overrideComponent(SomeCmp, { set: { template: template } });
                    var fixture = testing_1.TestBed.createComponent(SomeCmp);
                    var cmp = fixture.componentInstance;
                    var useEl = dom_adapter_1.getDOM().firstChild(fixture.nativeElement);
                    cmp.value = '#id';
                    fixture.detectChanges();
                    matchers_1.expect(dom_adapter_1.getDOM().getAttributeNS(useEl, 'http://www.w3.org/1999/xlink', 'href'))
                        .toEqual('#id');
                    cmp.value = null;
                    fixture.detectChanges();
                    matchers_1.expect(dom_adapter_1.getDOM().hasAttributeNS(useEl, 'http://www.w3.org/1999/xlink', 'href'))
                        .toEqual(false);
                });
            });
        }
    });
}
var ComponentWithDefaultInterpolation = /** @class */ (function () {
    function ComponentWithDefaultInterpolation() {
        this.text = 'Default Interpolation';
    }
    ComponentWithDefaultInterpolation = __decorate([
        metadata_1.Component({ selector: 'cmp-with-default-interpolation', template: "{{text}}" })
    ], ComponentWithDefaultInterpolation);
    return ComponentWithDefaultInterpolation;
}());
var ComponentWithCustomInterpolationA = /** @class */ (function () {
    function ComponentWithCustomInterpolationA() {
        this.text = 'Custom Interpolation A';
    }
    ComponentWithCustomInterpolationA = __decorate([
        metadata_1.Component({
            selector: 'cmp-with-custom-interpolation-a',
            template: "<div>{%text%}</div>",
            interpolation: ['{%', '%}']
        })
    ], ComponentWithCustomInterpolationA);
    return ComponentWithCustomInterpolationA;
}());
var ComponentWithCustomInterpolationB = /** @class */ (function () {
    function ComponentWithCustomInterpolationB() {
        this.text = 'Custom Interpolation B';
    }
    ComponentWithCustomInterpolationB = __decorate([
        metadata_1.Component({
            selector: 'cmp-with-custom-interpolation-b',
            template: "<div>{**text%}</div> (<cmp-with-default-interpolation></cmp-with-default-interpolation>)",
            interpolation: ['{**', '%}']
        })
    ], ComponentWithCustomInterpolationB);
    return ComponentWithCustomInterpolationB;
}());
var MyService = /** @class */ (function () {
    function MyService() {
        this.greeting = 'hello';
    }
    MyService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], MyService);
    return MyService;
}());
var SimpleImperativeViewComponent = /** @class */ (function () {
    function SimpleImperativeViewComponent(self) {
        var hostElement = self.nativeElement;
        dom_adapter_1.getDOM().appendChild(hostElement, browser_util_1.el('hello imp view'));
    }
    SimpleImperativeViewComponent = __decorate([
        metadata_1.Component({ selector: 'simple-imp-cmp', template: '' }),
        __metadata("design:paramtypes", [element_ref_1.ElementRef])
    ], SimpleImperativeViewComponent);
    return SimpleImperativeViewComponent;
}());
var DynamicViewport = /** @class */ (function () {
    function DynamicViewport(vc, componentFactoryResolver) {
        this.vc = vc;
        var myService = new MyService();
        myService.greeting = 'dynamic greet';
        this.injector = core_1.Injector.create([{ provide: MyService, useValue: myService }], vc.injector);
        this.componentFactory =
            componentFactoryResolver.resolveComponentFactory(ChildCompUsingService);
    }
    DynamicViewport.prototype.create = function () {
        return this.vc.createComponent(this.componentFactory, this.vc.length, this.injector);
    };
    DynamicViewport.prototype.insert = function (viewRef, index) { return this.vc.insert(viewRef, index); };
    DynamicViewport.prototype.move = function (viewRef, currentIndex) {
        return this.vc.move(viewRef, currentIndex);
    };
    DynamicViewport = __decorate([
        metadata_1.Directive({ selector: 'dynamic-vp' }),
        __metadata("design:paramtypes", [view_container_ref_1.ViewContainerRef, component_factory_resolver_1.ComponentFactoryResolver])
    ], DynamicViewport);
    return DynamicViewport;
}());
var MyDir = /** @class */ (function () {
    function MyDir() {
        this.dirProp = '';
    }
    MyDir = __decorate([
        metadata_1.Directive({ selector: '[my-dir]', inputs: ['dirProp: elprop'], exportAs: 'mydir' }),
        __metadata("design:paramtypes", [])
    ], MyDir);
    return MyDir;
}());
var DirectiveWithTitle = /** @class */ (function () {
    function DirectiveWithTitle() {
    }
    DirectiveWithTitle = __decorate([
        metadata_1.Directive({ selector: '[title]', inputs: ['title'] })
    ], DirectiveWithTitle);
    return DirectiveWithTitle;
}());
var DirectiveWithTitleAndHostProperty = /** @class */ (function () {
    function DirectiveWithTitleAndHostProperty() {
    }
    DirectiveWithTitleAndHostProperty = __decorate([
        metadata_1.Directive({ selector: '[title]', inputs: ['title'], host: { '[title]': 'title' } })
    ], DirectiveWithTitleAndHostProperty);
    return DirectiveWithTitleAndHostProperty;
}());
var EventCmp = /** @class */ (function () {
    function EventCmp() {
    }
    EventCmp.prototype.noop = function () { };
    EventCmp = __decorate([
        metadata_1.Component({ selector: 'event-cmp', template: '<div (click)="noop()"></div>' })
    ], EventCmp);
    return EventCmp;
}());
var PushCmp = /** @class */ (function () {
    function PushCmp() {
        this.numberOfChecks = 0;
    }
    PushCmp.prototype.noop = function () { };
    Object.defineProperty(PushCmp.prototype, "field", {
        get: function () {
            this.numberOfChecks++;
            return 'fixed';
        },
        enumerable: true,
        configurable: true
    });
    PushCmp = __decorate([
        metadata_1.Component({
            selector: 'push-cmp',
            inputs: ['prop'],
            host: { '(click)': 'true' },
            changeDetection: change_detection_1.ChangeDetectionStrategy.OnPush,
            template: '{{field}}<div (click)="noop()"></div><div *ngIf="true" (click)="noop()"></div><event-cmp></event-cmp>'
        }),
        __metadata("design:paramtypes", [])
    ], PushCmp);
    return PushCmp;
}());
var PushCmpWithRef = /** @class */ (function () {
    function PushCmpWithRef(ref) {
        this.numberOfChecks = 0;
        this.ref = ref;
    }
    Object.defineProperty(PushCmpWithRef.prototype, "field", {
        get: function () {
            this.numberOfChecks++;
            return 'fixed';
        },
        enumerable: true,
        configurable: true
    });
    PushCmpWithRef.prototype.propagate = function () { this.ref.markForCheck(); };
    PushCmpWithRef = __decorate([
        metadata_1.Component({
            selector: 'push-cmp-with-ref',
            inputs: ['prop'],
            changeDetection: change_detection_1.ChangeDetectionStrategy.OnPush,
            template: '{{field}}'
        }),
        __metadata("design:paramtypes", [change_detection_1.ChangeDetectorRef])
    ], PushCmpWithRef);
    return PushCmpWithRef;
}());
var PushCmpWithHostEvent = /** @class */ (function () {
    function PushCmpWithHostEvent() {
        this.ctxCallback = function (_) { };
    }
    PushCmpWithHostEvent = __decorate([
        metadata_1.Component({
            selector: 'push-cmp-with-host-event',
            host: { '(click)': 'ctxCallback($event)' },
            changeDetection: change_detection_1.ChangeDetectionStrategy.OnPush,
            template: ''
        })
    ], PushCmpWithHostEvent);
    return PushCmpWithHostEvent;
}());
var PushCmpWithAsyncPipe = /** @class */ (function () {
    function PushCmpWithAsyncPipe() {
        var _this = this;
        this.numberOfChecks = 0;
        this.promise = new Promise(function (resolve) { _this.resolve = resolve; });
    }
    Object.defineProperty(PushCmpWithAsyncPipe.prototype, "field", {
        get: function () {
            this.numberOfChecks++;
            return this.promise;
        },
        enumerable: true,
        configurable: true
    });
    PushCmpWithAsyncPipe = __decorate([
        metadata_1.Component({
            selector: 'push-cmp-with-async',
            changeDetection: change_detection_1.ChangeDetectionStrategy.OnPush,
            template: '{{field | async}}'
        }),
        __metadata("design:paramtypes", [])
    ], PushCmpWithAsyncPipe);
    return PushCmpWithAsyncPipe;
}());
var MyComp = /** @class */ (function () {
    function MyComp() {
        this.toStringThrow = { toString: function () { throw 'boom'; } };
        this.ctxProp = 'initial value';
        this.ctxNumProp = 0;
        this.ctxBoolProp = false;
    }
    MyComp.prototype.throwError = function () { throw 'boom'; };
    MyComp = __decorate([
        metadata_1.Component({ selector: 'my-comp', template: '' }),
        __metadata("design:paramtypes", [])
    ], MyComp);
    return MyComp;
}());
var ChildComp = /** @class */ (function () {
    function ChildComp(service) {
        this.ctxProp = service.greeting;
        this.dirProp = null;
    }
    ChildComp = __decorate([
        metadata_1.Component({
            selector: 'child-cmp',
            inputs: ['dirProp'],
            viewProviders: [MyService],
            template: '{{ctxProp}}'
        }),
        __metadata("design:paramtypes", [MyService])
    ], ChildComp);
    return ChildComp;
}());
var ChildCompNoTemplate = /** @class */ (function () {
    function ChildCompNoTemplate() {
        this.ctxProp = 'hello';
    }
    ChildCompNoTemplate = __decorate([
        metadata_1.Component({ selector: 'child-cmp-no-template', template: '' })
    ], ChildCompNoTemplate);
    return ChildCompNoTemplate;
}());
var ChildCompUsingService = /** @class */ (function () {
    function ChildCompUsingService(service) {
        this.ctxProp = service.greeting;
    }
    ChildCompUsingService = __decorate([
        metadata_1.Component({ selector: 'child-cmp-svc', template: '{{ctxProp}}' }),
        __metadata("design:paramtypes", [MyService])
    ], ChildCompUsingService);
    return ChildCompUsingService;
}());
var SomeDirective = /** @class */ (function () {
    function SomeDirective() {
    }
    SomeDirective = __decorate([
        metadata_1.Directive({ selector: 'some-directive' })
    ], SomeDirective);
    return SomeDirective;
}());
var SomeDirectiveMissingAnnotation = /** @class */ (function () {
    function SomeDirectiveMissingAnnotation() {
    }
    return SomeDirectiveMissingAnnotation;
}());
var CompWithHost = /** @class */ (function () {
    function CompWithHost(someComp) {
        this.myHost = someComp;
    }
    CompWithHost = __decorate([
        metadata_1.Component({
            selector: 'cmp-with-host',
            template: '<p>Component with an injected host</p>',
        }),
        __param(0, core_1.Host()),
        __metadata("design:paramtypes", [SomeDirective])
    ], CompWithHost);
    return CompWithHost;
}());
var ChildComp2 = /** @class */ (function () {
    function ChildComp2(service) {
        this.ctxProp = service.greeting;
        this.dirProp = null;
    }
    ChildComp2 = __decorate([
        metadata_1.Component({ selector: '[child-cmp2]', viewProviders: [MyService] }),
        __metadata("design:paramtypes", [MyService])
    ], ChildComp2);
    return ChildComp2;
}());
var SomeViewportContext = /** @class */ (function () {
    function SomeViewportContext(someTmpl) {
        this.someTmpl = someTmpl;
    }
    return SomeViewportContext;
}());
var SomeViewport = /** @class */ (function () {
    function SomeViewport(container, templateRef) {
        this.container = container;
        container.createEmbeddedView(templateRef, new SomeViewportContext('hello'));
        container.createEmbeddedView(templateRef, new SomeViewportContext('again'));
    }
    SomeViewport = __decorate([
        metadata_1.Directive({ selector: '[some-viewport]' }),
        __metadata("design:paramtypes", [view_container_ref_1.ViewContainerRef, template_ref_1.TemplateRef])
    ], SomeViewport);
    return SomeViewport;
}());
var PollutedContext = /** @class */ (function () {
    function PollutedContext(tplRef, vcRef) {
        this.tplRef = tplRef;
        this.vcRef = vcRef;
        var evRef = this.vcRef.createEmbeddedView(this.tplRef);
        evRef.context.bar = 'baz';
    }
    PollutedContext = __decorate([
        metadata_1.Directive({ selector: '[pollutedContext]' }),
        __metadata("design:paramtypes", [template_ref_1.TemplateRef, view_container_ref_1.ViewContainerRef])
    ], PollutedContext);
    return PollutedContext;
}());
var NoContext = /** @class */ (function () {
    function NoContext(tplRef, vcRef) {
        this.tplRef = tplRef;
        this.vcRef = vcRef;
        this.vcRef.createEmbeddedView(this.tplRef);
    }
    NoContext = __decorate([
        metadata_1.Directive({ selector: '[noContext]' }),
        __metadata("design:paramtypes", [template_ref_1.TemplateRef, view_container_ref_1.ViewContainerRef])
    ], NoContext);
    return NoContext;
}());
var DoublePipe = /** @class */ (function () {
    function DoublePipe() {
    }
    DoublePipe.prototype.ngOnDestroy = function () { };
    DoublePipe.prototype.transform = function (value) { return "" + value + value; };
    DoublePipe = __decorate([
        metadata_1.Pipe({ name: 'double' })
    ], DoublePipe);
    return DoublePipe;
}());
var DirectiveEmittingEvent = /** @class */ (function () {
    function DirectiveEmittingEvent() {
        this.msg = '';
        this.event = new core_1.EventEmitter();
    }
    DirectiveEmittingEvent.prototype.fireEvent = function (msg) { this.event.emit(msg); };
    DirectiveEmittingEvent = __decorate([
        metadata_1.Directive({ selector: '[emitter]', outputs: ['event'] }),
        __metadata("design:paramtypes", [])
    ], DirectiveEmittingEvent);
    return DirectiveEmittingEvent;
}());
var DirectiveUpdatingHostAttributes = /** @class */ (function () {
    function DirectiveUpdatingHostAttributes() {
    }
    DirectiveUpdatingHostAttributes = __decorate([
        metadata_1.Directive({ selector: '[update-host-attributes]', host: { 'role': 'button' } })
    ], DirectiveUpdatingHostAttributes);
    return DirectiveUpdatingHostAttributes;
}());
var DirectiveUpdatingHostProperties = /** @class */ (function () {
    function DirectiveUpdatingHostProperties() {
        this.id = 'one';
    }
    DirectiveUpdatingHostProperties = __decorate([
        metadata_1.Directive({ selector: '[update-host-properties]', host: { '[id]': 'id' } }),
        __metadata("design:paramtypes", [])
    ], DirectiveUpdatingHostProperties);
    return DirectiveUpdatingHostProperties;
}());
var DirectiveListeningEvent = /** @class */ (function () {
    function DirectiveListeningEvent() {
        this.msg = '';
    }
    DirectiveListeningEvent.prototype.onEvent = function (msg) { this.msg = msg; };
    DirectiveListeningEvent = __decorate([
        metadata_1.Directive({ selector: '[listener]', host: { '(event)': 'onEvent($event)' } }),
        __metadata("design:paramtypes", [])
    ], DirectiveListeningEvent);
    return DirectiveListeningEvent;
}());
var DirectiveListeningDomEvent = /** @class */ (function () {
    function DirectiveListeningDomEvent() {
        this.eventTypes = [];
    }
    DirectiveListeningDomEvent.prototype.onEvent = function (eventType) { this.eventTypes.push(eventType); };
    DirectiveListeningDomEvent.prototype.onWindowEvent = function (eventType) { this.eventTypes.push('window_' + eventType); };
    DirectiveListeningDomEvent.prototype.onDocumentEvent = function (eventType) { this.eventTypes.push('document_' + eventType); };
    DirectiveListeningDomEvent.prototype.onBodyEvent = function (eventType) { this.eventTypes.push('body_' + eventType); };
    DirectiveListeningDomEvent = __decorate([
        metadata_1.Directive({
            selector: '[listener]',
            host: {
                '(domEvent)': 'onEvent($event.type)',
                '(window:domEvent)': 'onWindowEvent($event.type)',
                '(document:domEvent)': 'onDocumentEvent($event.type)',
                '(body:domEvent)': 'onBodyEvent($event.type)'
            }
        })
    ], DirectiveListeningDomEvent);
    return DirectiveListeningDomEvent;
}());
var globalCounter = 0;
var DirectiveListeningDomEventOther = /** @class */ (function () {
    function DirectiveListeningDomEventOther() {
        this.eventType = '';
    }
    DirectiveListeningDomEventOther.prototype.onEvent = function (eventType) {
        globalCounter++;
        this.eventType = 'other_' + eventType;
    };
    DirectiveListeningDomEventOther = __decorate([
        metadata_1.Directive({ selector: '[listenerother]', host: { '(window:domEvent)': 'onEvent($event.type)' } }),
        __metadata("design:paramtypes", [])
    ], DirectiveListeningDomEventOther);
    return DirectiveListeningDomEventOther;
}());
var DirectiveListeningDomEventPrevent = /** @class */ (function () {
    function DirectiveListeningDomEventPrevent() {
    }
    DirectiveListeningDomEventPrevent.prototype.onEvent = function (event) { return false; };
    DirectiveListeningDomEventPrevent = __decorate([
        metadata_1.Directive({ selector: '[listenerprevent]', host: { '(click)': 'onEvent($event)' } })
    ], DirectiveListeningDomEventPrevent);
    return DirectiveListeningDomEventPrevent;
}());
var DirectiveListeningDomEventNoPrevent = /** @class */ (function () {
    function DirectiveListeningDomEventNoPrevent() {
    }
    DirectiveListeningDomEventNoPrevent.prototype.onEvent = function (event) { return true; };
    DirectiveListeningDomEventNoPrevent = __decorate([
        metadata_1.Directive({ selector: '[listenernoprevent]', host: { '(click)': 'onEvent($event)' } })
    ], DirectiveListeningDomEventNoPrevent);
    return DirectiveListeningDomEventNoPrevent;
}());
var IdDir = /** @class */ (function () {
    function IdDir() {
    }
    IdDir = __decorate([
        metadata_1.Directive({ selector: '[id]', inputs: ['id'] })
    ], IdDir);
    return IdDir;
}());
var EventDir = /** @class */ (function () {
    function EventDir() {
        this.customEvent = new core_1.EventEmitter();
    }
    EventDir.prototype.doSomething = function () { };
    __decorate([
        metadata_1.Output(),
        __metadata("design:type", Object)
    ], EventDir.prototype, "customEvent", void 0);
    EventDir = __decorate([
        metadata_1.Directive({ selector: '[customEvent]' })
    ], EventDir);
    return EventDir;
}());
var NeedsAttribute = /** @class */ (function () {
    function NeedsAttribute(typeAttribute, staticAttribute, fooAttribute) {
        this.typeAttribute = typeAttribute;
        this.staticAttribute = staticAttribute;
        this.fooAttribute = fooAttribute;
    }
    NeedsAttribute = __decorate([
        metadata_1.Directive({ selector: '[static]' }),
        __param(0, metadata_1.Attribute('type')), __param(1, metadata_1.Attribute('static')),
        __param(2, metadata_1.Attribute('foo')),
        __metadata("design:paramtypes", [String, String, String])
    ], NeedsAttribute);
    return NeedsAttribute;
}());
var PublicApi = /** @class */ (function () {
    function PublicApi() {
    }
    PublicApi = __decorate([
        core_1.Injectable()
    ], PublicApi);
    return PublicApi;
}());
var PrivateImpl = /** @class */ (function (_super) {
    __extends(PrivateImpl, _super);
    function PrivateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PrivateImpl_1 = PrivateImpl;
    var PrivateImpl_1;
    PrivateImpl = PrivateImpl_1 = __decorate([
        metadata_1.Directive({
            selector: '[public-api]',
            providers: [{ provide: PublicApi, useExisting: PrivateImpl_1, deps: [] }]
        })
    ], PrivateImpl);
    return PrivateImpl;
}(PublicApi));
var NeedsPublicApi = /** @class */ (function () {
    function NeedsPublicApi(api) {
        matchers_1.expect(api instanceof PrivateImpl).toBe(true);
    }
    NeedsPublicApi = __decorate([
        metadata_1.Directive({ selector: '[needs-public-api]' }),
        __param(0, core_1.Host()),
        __metadata("design:paramtypes", [PublicApi])
    ], NeedsPublicApi);
    return NeedsPublicApi;
}());
var ToolbarContext = /** @class */ (function () {
    function ToolbarContext(toolbarProp) {
        this.toolbarProp = toolbarProp;
    }
    return ToolbarContext;
}());
var ToolbarPart = /** @class */ (function () {
    function ToolbarPart(templateRef) {
        this.templateRef = templateRef;
    }
    ToolbarPart = __decorate([
        metadata_1.Directive({ selector: '[toolbarpart]' }),
        __metadata("design:paramtypes", [template_ref_1.TemplateRef])
    ], ToolbarPart);
    return ToolbarPart;
}());
var ToolbarViewContainer = /** @class */ (function () {
    function ToolbarViewContainer(vc) {
        this.vc = vc;
    }
    Object.defineProperty(ToolbarViewContainer.prototype, "toolbarVc", {
        set: function (part) {
            this.vc.createEmbeddedView(part.templateRef, new ToolbarContext('From toolbar'), 0);
        },
        enumerable: true,
        configurable: true
    });
    ToolbarViewContainer = __decorate([
        metadata_1.Directive({ selector: '[toolbarVc]', inputs: ['toolbarVc'] }),
        __metadata("design:paramtypes", [view_container_ref_1.ViewContainerRef])
    ], ToolbarViewContainer);
    return ToolbarViewContainer;
}());
var ToolbarComponent = /** @class */ (function () {
    function ToolbarComponent() {
        this.ctxProp = 'hello world';
    }
    __decorate([
        metadata_1.ContentChildren(ToolbarPart),
        __metadata("design:type", query_list_1.QueryList)
    ], ToolbarComponent.prototype, "query", void 0);
    ToolbarComponent = __decorate([
        metadata_1.Component({
            selector: 'toolbar',
            template: 'TOOLBAR(<div *ngFor="let  part of query" [toolbarVc]="part"></div>)',
        }),
        __metadata("design:paramtypes", [])
    ], ToolbarComponent);
    return ToolbarComponent;
}());
var DirectiveWithTwoWayBinding = /** @class */ (function () {
    function DirectiveWithTwoWayBinding() {
        this.controlChange = new core_1.EventEmitter();
        this.control = null;
    }
    DirectiveWithTwoWayBinding.prototype.triggerChange = function (value) { this.controlChange.emit(value); };
    DirectiveWithTwoWayBinding = __decorate([
        metadata_1.Directive({ selector: '[two-way]', inputs: ['control'], outputs: ['controlChange'] })
    ], DirectiveWithTwoWayBinding);
    return DirectiveWithTwoWayBinding;
}());
var InjectableService = /** @class */ (function () {
    function InjectableService() {
    }
    InjectableService = __decorate([
        core_1.Injectable()
    ], InjectableService);
    return InjectableService;
}());
function createInjectableWithLogging(inj) {
    inj.get(ComponentProvidingLoggingInjectable).created = true;
    return new InjectableService();
}
var ComponentProvidingLoggingInjectable = /** @class */ (function () {
    function ComponentProvidingLoggingInjectable() {
        this.created = false;
    }
    ComponentProvidingLoggingInjectable = __decorate([
        metadata_1.Component({
            selector: 'component-providing-logging-injectable',
            providers: [{ provide: InjectableService, useFactory: createInjectableWithLogging, deps: [core_1.Injector] }],
            template: ''
        })
    ], ComponentProvidingLoggingInjectable);
    return ComponentProvidingLoggingInjectable;
}());
var DirectiveProvidingInjectable = /** @class */ (function () {
    function DirectiveProvidingInjectable() {
    }
    DirectiveProvidingInjectable = __decorate([
        metadata_1.Directive({ selector: 'directive-providing-injectable', providers: [[InjectableService]] })
    ], DirectiveProvidingInjectable);
    return DirectiveProvidingInjectable;
}());
var DirectiveProvidingInjectableInView = /** @class */ (function () {
    function DirectiveProvidingInjectableInView() {
    }
    DirectiveProvidingInjectableInView = __decorate([
        metadata_1.Component({
            selector: 'directive-providing-injectable',
            viewProviders: [[InjectableService]],
            template: ''
        })
    ], DirectiveProvidingInjectableInView);
    return DirectiveProvidingInjectableInView;
}());
var DirectiveProvidingInjectableInHostAndView = /** @class */ (function () {
    function DirectiveProvidingInjectableInHostAndView() {
    }
    DirectiveProvidingInjectableInHostAndView = __decorate([
        metadata_1.Component({
            selector: 'directive-providing-injectable',
            providers: [{ provide: InjectableService, useValue: 'host' }],
            viewProviders: [{ provide: InjectableService, useValue: 'view' }],
            template: ''
        })
    ], DirectiveProvidingInjectableInHostAndView);
    return DirectiveProvidingInjectableInHostAndView;
}());
var DirectiveConsumingInjectable = /** @class */ (function () {
    function DirectiveConsumingInjectable(injectable) {
        this.injectable = injectable;
    }
    DirectiveConsumingInjectable = __decorate([
        metadata_1.Component({ selector: 'directive-consuming-injectable', template: '' }),
        __param(0, core_1.Host()), __param(0, core_1.Inject(InjectableService)),
        __metadata("design:paramtypes", [Object])
    ], DirectiveConsumingInjectable);
    return DirectiveConsumingInjectable;
}());
var DirectiveContainingDirectiveConsumingAnInjectable = /** @class */ (function () {
    function DirectiveContainingDirectiveConsumingAnInjectable() {
    }
    DirectiveContainingDirectiveConsumingAnInjectable = __decorate([
        metadata_1.Component({ selector: 'directive-containing-directive-consuming-an-injectable' })
    ], DirectiveContainingDirectiveConsumingAnInjectable);
    return DirectiveContainingDirectiveConsumingAnInjectable;
}());
var DirectiveConsumingInjectableUnbounded = /** @class */ (function () {
    function DirectiveConsumingInjectableUnbounded(injectable, parent) {
        this.injectable = injectable;
        parent.directive = this;
    }
    DirectiveConsumingInjectableUnbounded = __decorate([
        metadata_1.Component({ selector: 'directive-consuming-injectable-unbounded', template: '' }),
        __param(1, core_1.SkipSelf()),
        __metadata("design:paramtypes", [InjectableService,
            DirectiveContainingDirectiveConsumingAnInjectable])
    ], DirectiveConsumingInjectableUnbounded);
    return DirectiveConsumingInjectableUnbounded;
}());
var EventBus = /** @class */ (function () {
    function EventBus(parentEventBus, name) {
        this.parentEventBus = parentEventBus;
        this.name = name;
    }
    return EventBus;
}());
var GrandParentProvidingEventBus = /** @class */ (function () {
    function GrandParentProvidingEventBus(bus) {
        this.bus = bus;
    }
    GrandParentProvidingEventBus = __decorate([
        metadata_1.Directive({
            selector: 'grand-parent-providing-event-bus',
            providers: [{ provide: EventBus, useValue: new EventBus(null, 'grandparent') }]
        }),
        __metadata("design:paramtypes", [EventBus])
    ], GrandParentProvidingEventBus);
    return GrandParentProvidingEventBus;
}());
function createParentBus(peb) {
    return new EventBus(peb, 'parent');
}
var ParentProvidingEventBus = /** @class */ (function () {
    function ParentProvidingEventBus(bus, grandParentBus) {
        this.bus = bus;
        this.grandParentBus = grandParentBus;
    }
    ParentProvidingEventBus = __decorate([
        metadata_1.Component({
            selector: 'parent-providing-event-bus',
            providers: [{ provide: EventBus, useFactory: createParentBus, deps: [[EventBus, new core_1.SkipSelf()]] }],
            template: "<child-consuming-event-bus></child-consuming-event-bus>"
        }),
        __param(1, core_1.SkipSelf()),
        __metadata("design:paramtypes", [EventBus, EventBus])
    ], ParentProvidingEventBus);
    return ParentProvidingEventBus;
}());
var ChildConsumingEventBus = /** @class */ (function () {
    function ChildConsumingEventBus(bus) {
        this.bus = bus;
    }
    ChildConsumingEventBus = __decorate([
        metadata_1.Directive({ selector: 'child-consuming-event-bus' }),
        __param(0, core_1.SkipSelf()),
        __metadata("design:paramtypes", [EventBus])
    ], ChildConsumingEventBus);
    return ChildConsumingEventBus;
}());
var SomeImperativeViewport = /** @class */ (function () {
    function SomeImperativeViewport(vc, templateRef, anchor) {
        this.vc = vc;
        this.templateRef = templateRef;
        this.view = null;
        this.anchor = anchor;
    }
    Object.defineProperty(SomeImperativeViewport.prototype, "someImpvp", {
        set: function (value) {
            if (this.view) {
                this.vc.clear();
                this.view = null;
            }
            if (value) {
                this.view = this.vc.createEmbeddedView(this.templateRef);
                var nodes = this.view.rootNodes;
                for (var i = 0; i < nodes.length; i++) {
                    dom_adapter_1.getDOM().appendChild(this.anchor, nodes[i]);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    SomeImperativeViewport = __decorate([
        metadata_1.Directive({ selector: '[someImpvp]', inputs: ['someImpvp'] }),
        __param(2, core_1.Inject(ANCHOR_ELEMENT)),
        __metadata("design:paramtypes", [view_container_ref_1.ViewContainerRef, template_ref_1.TemplateRef, Object])
    ], SomeImperativeViewport);
    return SomeImperativeViewport;
}());
var ExportDir = /** @class */ (function () {
    function ExportDir() {
    }
    ExportDir = __decorate([
        metadata_1.Directive({ selector: '[export-dir]', exportAs: 'dir' })
    ], ExportDir);
    return ExportDir;
}());
var DirectiveWithMultipleExportAsNames = /** @class */ (function () {
    function DirectiveWithMultipleExportAsNames() {
    }
    DirectiveWithMultipleExportAsNames = __decorate([
        metadata_1.Directive({ selector: '[multiple-export-as]', exportAs: 'dirX, dirY' })
    ], DirectiveWithMultipleExportAsNames);
    return DirectiveWithMultipleExportAsNames;
}());
exports.DirectiveWithMultipleExportAsNames = DirectiveWithMultipleExportAsNames;
var ComponentWithoutView = /** @class */ (function () {
    function ComponentWithoutView() {
    }
    ComponentWithoutView = __decorate([
        metadata_1.Component({ selector: 'comp' })
    ], ComponentWithoutView);
    return ComponentWithoutView;
}());
var DuplicateDir = /** @class */ (function () {
    function DuplicateDir(elRef) {
        dom_adapter_1.getDOM().setText(elRef.nativeElement, dom_adapter_1.getDOM().getText(elRef.nativeElement) + 'noduplicate');
    }
    DuplicateDir = __decorate([
        metadata_1.Directive({ selector: '[no-duplicate]' }),
        __metadata("design:paramtypes", [element_ref_1.ElementRef])
    ], DuplicateDir);
    return DuplicateDir;
}());
var OtherDuplicateDir = /** @class */ (function () {
    function OtherDuplicateDir(elRef) {
        dom_adapter_1.getDOM().setText(elRef.nativeElement, dom_adapter_1.getDOM().getText(elRef.nativeElement) + 'othernoduplicate');
    }
    OtherDuplicateDir = __decorate([
        metadata_1.Directive({ selector: '[no-duplicate]' }),
        __metadata("design:paramtypes", [element_ref_1.ElementRef])
    ], OtherDuplicateDir);
    return OtherDuplicateDir;
}());
var DirectiveThrowingAnError = /** @class */ (function () {
    function DirectiveThrowingAnError() {
        throw new Error('BOOM');
    }
    DirectiveThrowingAnError = __decorate([
        metadata_1.Directive({ selector: 'directive-throwing-error' }),
        __metadata("design:paramtypes", [])
    ], DirectiveThrowingAnError);
    return DirectiveThrowingAnError;
}());
var ComponentWithTemplate = /** @class */ (function () {
    function ComponentWithTemplate() {
        this.items = [1, 2, 3];
    }
    ComponentWithTemplate = __decorate([
        metadata_1.Component({
            selector: 'component-with-template',
            template: "No View Decorator: <div *ngFor=\"let item of items\">{{item}}</div>"
        })
    ], ComponentWithTemplate);
    return ComponentWithTemplate;
}());
var DirectiveWithPropDecorators = /** @class */ (function () {
    function DirectiveWithPropDecorators() {
        this.event = new core_1.EventEmitter();
    }
    DirectiveWithPropDecorators.prototype.onClick = function (target) { this.target = target; };
    DirectiveWithPropDecorators.prototype.fireEvent = function (msg) { this.event.emit(msg); };
    __decorate([
        metadata_1.Input('elProp'),
        __metadata("design:type", String)
    ], DirectiveWithPropDecorators.prototype, "dirProp", void 0);
    __decorate([
        metadata_1.Output('elEvent'),
        __metadata("design:type", Object)
    ], DirectiveWithPropDecorators.prototype, "event", void 0);
    __decorate([
        metadata_1.HostBinding('attr.my-attr'),
        __metadata("design:type", String)
    ], DirectiveWithPropDecorators.prototype, "myAttr", void 0);
    __decorate([
        metadata_1.HostListener('click', ['$event.target']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], DirectiveWithPropDecorators.prototype, "onClick", null);
    DirectiveWithPropDecorators = __decorate([
        metadata_1.Directive({ selector: 'with-prop-decorators' })
    ], DirectiveWithPropDecorators);
    return DirectiveWithPropDecorators;
}());
var SomeCmp = /** @class */ (function () {
    function SomeCmp() {
    }
    SomeCmp = __decorate([
        metadata_1.Component({ selector: 'some-cmp' })
    ], SomeCmp);
    return SomeCmp;
}());
var ParentCmp = /** @class */ (function () {
    function ParentCmp() {
        this.name = 'hello';
    }
    ParentCmp = __decorate([
        metadata_1.Component({
            selector: 'parent-cmp',
            template: "<cmp [test$]=\"name\"></cmp>",
        })
    ], ParentCmp);
    return ParentCmp;
}());
exports.ParentCmp = ParentCmp;
var SomeCmpWithInput = /** @class */ (function () {
    function SomeCmpWithInput() {
    }
    __decorate([
        metadata_1.Input(),
        __metadata("design:type", Object)
    ], SomeCmpWithInput.prototype, "test$", void 0);
    SomeCmpWithInput = __decorate([
        metadata_1.Component({ selector: 'cmp', template: '' })
    ], SomeCmpWithInput);
    return SomeCmpWithInput;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWdyYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9saW5rZXIvaW50ZWdyYXRpb25fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCwwQ0FBNkM7QUFFN0Msc0NBQThOO0FBQzlOLHdGQUE4SDtBQUM5SCxtREFBeUQ7QUFDekQsa0dBQTZGO0FBQzdGLG9FQUFnRTtBQUNoRSxrRUFBOEQ7QUFDOUQsc0VBQWtFO0FBQ2xFLGtGQUE2RTtBQUU3RSx1REFBNEk7QUFDNUksaURBQWtGO0FBQ2xGLDZFQUFxRTtBQUNyRSwyRUFBc0U7QUFDdEUsbUZBQXFGO0FBQ3JGLDJFQUFzRTtBQUV0RSx1Q0FBeUM7QUFFekMsSUFBTSxjQUFjLEdBQUcsSUFBSSxxQkFBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRTNEO0lBQ0UsUUFBUSxDQUFDLEtBQUssRUFBRSxjQUFRLFlBQVksQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFekQsUUFBUSxDQUFDLFFBQVEsRUFBRSxjQUFRLFlBQVksQ0FBQyxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDOUQ7QUFHRCxzQkFBc0IsRUFBMkI7UUFBMUIsa0JBQU07SUFDM0IsUUFBUSxDQUFDLG1CQUFtQixFQUFFO1FBRTVCLFVBQVUsQ0FBQyxjQUFRLGlCQUFPLENBQUMsaUJBQWlCLENBQUMsRUFBQyxNQUFNLFFBQUEsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUzRCxRQUFRLENBQUMseUJBQXlCLEVBQUU7WUFDbEMsRUFBRSxDQUFDLGtDQUFrQyxFQUFFO2dCQUNyQyxpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVB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