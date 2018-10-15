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
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var util_1 = require("../../src/util");
{
    describe('Query API', function () {
        beforeEach(function () { return testing_1.TestBed.configureTestingModule({
            declarations: [
                MyComp0,
                NeedsQuery,
                NeedsQueryDesc,
                NeedsQueryByLabel,
                NeedsQueryByTwoLabels,
                NeedsQueryAndProject,
                NeedsViewQuery,
                NeedsViewQueryIf,
                NeedsViewQueryNestedIf,
                NeedsViewQueryOrder,
                NeedsViewQueryByLabel,
                NeedsViewQueryOrderWithParent,
                NeedsContentChildren,
                NeedsViewChildren,
                NeedsViewChild,
                NeedsStaticContentAndViewChild,
                NeedsContentChild,
                DirectiveNeedsContentChild,
                NeedsTpl,
                NeedsNamedTpl,
                TextDirective,
                InertDirective,
                NeedsFourQueries,
                NeedsContentChildrenWithRead,
                NeedsContentChildWithRead,
                NeedsViewChildrenWithRead,
                NeedsViewChildWithRead,
                NeedsContentChildTemplateRef,
                NeedsContentChildTemplateRefApp,
                NeedsViewContainerWithRead,
                ManualProjecting
            ]
        }); });
        describe('querying by directive type', function () {
            it('should contain all direct child directives in the light dom (constructor)', function () {
                var template = '<div text="1"></div>' +
                    '<needs-query text="2"><div text="3">' +
                    '<div text="too-deep"></div>' +
                    '</div></needs-query>' +
                    '<div text="4"></div>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                matchers_1.expect(core_1.asNativeElements(view.debugElement.children)).toHaveText('2|3|');
            });
            it('should contain all direct child directives in the content dom', function () {
                var template = '<needs-content-children #q><div text="foo"></div></needs-content-children>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                view.detectChanges();
                matchers_1.expect(q.textDirChildren.length).toEqual(1);
                matchers_1.expect(q.numberOfChildrenAfterContentInit).toEqual(1);
            });
            it('should contain the first content child', function () {
                var template = '<needs-content-child #q><div *ngIf="shouldShow" text="foo"></div></needs-content-child>';
                var view = createTestCmp(MyComp0, template);
                view.componentInstance.shouldShow = true;
                view.detectChanges();
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.logs).toEqual([['setter', 'foo'], ['init', 'foo'], ['check', 'foo']]);
                view.componentInstance.shouldShow = false;
                view.detectChanges();
                matchers_1.expect(q.logs).toEqual([
                    ['setter', 'foo'], ['init', 'foo'], ['check', 'foo'], ['setter', null], ['check', null]
                ]);
            });
            it('should contain the first content child when target is on <ng-template> with embedded view (issue #16568)', function () {
                var template = '<div directive-needs-content-child><ng-template text="foo" [ngIf]="true"><div text="bar"></div></ng-template></div>' +
                    '<needs-content-child #q><ng-template text="foo" [ngIf]="true"><div text="bar"></div></ng-template></needs-content-child>';
                var view = createTestCmp(MyComp0, template);
                view.detectChanges();
                var q = view.debugElement.children[1].references['q'];
                matchers_1.expect(q.child.text).toEqual('foo');
                var directive = view.debugElement.children[0].injector.get(DirectiveNeedsContentChild);
                matchers_1.expect(directive.child.text).toEqual('foo');
            });
            it('should contain the first view child', function () {
                var template = '<needs-view-child #q></needs-view-child>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.logs).toEqual([['setter', 'foo'], ['init', 'foo'], ['check', 'foo']]);
                q.shouldShow = false;
                view.detectChanges();
                matchers_1.expect(q.logs).toEqual([
                    ['setter', 'foo'], ['init', 'foo'], ['check', 'foo'], ['setter', null], ['check', null]
                ]);
            });
            it('should set static view and content children already after the constructor call', function () {
                var template = '<needs-static-content-view-child #q><div text="contentFoo"></div></needs-static-content-view-child>';
                var view = createTestCmp(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.contentChild.text).toBeFalsy();
                matchers_1.expect(q.viewChild.text).toBeFalsy();
                view.detectChanges();
                matchers_1.expect(q.contentChild.text).toEqual('contentFoo');
                matchers_1.expect(q.viewChild.text).toEqual('viewFoo');
            });
            it('should contain the first view child across embedded views', function () {
                testing_1.TestBed.overrideComponent(MyComp0, { set: { template: '<needs-view-child #q></needs-view-child>' } });
                testing_1.TestBed.overrideComponent(NeedsViewChild, {
                    set: {
                        template: '<div *ngIf="true"><div *ngIf="shouldShow" text="foo"></div></div><div *ngIf="shouldShow2" text="bar"></div>'
                    }
                });
                var view = testing_1.TestBed.createComponent(MyComp0);
                view.detectChanges();
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.logs).toEqual([['setter', 'foo'], ['init', 'foo'], ['check', 'foo']]);
                q.shouldShow = false;
                q.shouldShow2 = true;
                q.logs = [];
                view.detectChanges();
                matchers_1.expect(q.logs).toEqual([['setter', 'bar'], ['check', 'bar']]);
                q.shouldShow = false;
                q.shouldShow2 = false;
                q.logs = [];
                view.detectChanges();
                matchers_1.expect(q.logs).toEqual([['setter', null], ['check', null]]);
            });
            it('should contain all directives in the light dom when descendants flag is used', function () {
                var template = '<div text="1"></div>' +
                    '<needs-query-desc text="2"><div text="3">' +
                    '<div text="4"></div>' +
                    '</div></needs-query-desc>' +
                    '<div text="5"></div>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                matchers_1.expect(core_1.asNativeElements(view.debugElement.children)).toHaveText('2|3|4|');
            });
            it('should contain all directives in the light dom', function () {
                var template = '<div text="1"></div>' +
                    '<needs-query text="2"><div text="3"></div></needs-query>' +
                    '<div text="4"></div>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                matchers_1.expect(core_1.asNativeElements(view.debugElement.children)).toHaveText('2|3|');
            });
            it('should reflect dynamically inserted directives', function () {
                var template = '<div text="1"></div>' +
                    '<needs-query text="2"><div *ngIf="shouldShow" [text]="\'3\'"></div></needs-query>' +
                    '<div text="4"></div>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                matchers_1.expect(core_1.asNativeElements(view.debugElement.children)).toHaveText('2|');
                view.componentInstance.shouldShow = true;
                view.detectChanges();
                matchers_1.expect(core_1.asNativeElements(view.debugElement.children)).toHaveText('2|3|');
            });
            it('should be cleanly destroyed when a query crosses view boundaries', function () {
                var template = '<div text="1"></div>' +
                    '<needs-query text="2"><div *ngIf="shouldShow" [text]="\'3\'"></div></needs-query>' +
                    '<div text="4"></div>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                view.componentInstance.shouldShow = true;
                view.detectChanges();
                view.destroy();
            });
            it('should reflect moved directives', function () {
                var template = '<div text="1"></div>' +
                    '<needs-query text="2"><div *ngFor="let  i of list" [text]="i"></div></needs-query>' +
                    '<div text="4"></div>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                matchers_1.expect(core_1.asNativeElements(view.debugElement.children)).toHaveText('2|1d|2d|3d|');
                view.componentInstance.list = ['3d', '2d'];
                view.detectChanges();
                matchers_1.expect(core_1.asNativeElements(view.debugElement.children)).toHaveText('2|3d|2d|');
            });
            it('should throw with descriptive error when query selectors are not present', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [MyCompBroken0, HasNullQueryCondition] });
                var template = '<has-null-query-condition></has-null-query-condition>';
                testing_1.TestBed.overrideComponent(MyCompBroken0, { set: { template: template } });
                matchers_1.expect(function () { return testing_1.TestBed.createComponent(MyCompBroken0); })
                    .toThrowError("Can't construct a query for the property \"errorTrigger\" of \"" + util_1.stringify(HasNullQueryCondition) + "\" since the query selector wasn't defined.");
            });
        });
        describe('query for TemplateRef', function () {
            it('should find TemplateRefs in the light and shadow dom', function () {
                var template = '<needs-tpl><ng-template><div>light</div></ng-template></needs-tpl>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var needsTpl = view.debugElement.children[0].injector.get(NeedsTpl);
                matchers_1.expect(needsTpl.vc.createEmbeddedView(needsTpl.query.first).rootNodes[0])
                    .toHaveText('light');
                matchers_1.expect(needsTpl.vc.createEmbeddedView(needsTpl.viewQuery.first).rootNodes[0])
                    .toHaveText('shadow');
            });
            it('should find named TemplateRefs', function () {
                var template = '<needs-named-tpl><ng-template #tpl><div>light</div></ng-template></needs-named-tpl>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var needsTpl = view.debugElement.children[0].injector.get(NeedsNamedTpl);
                matchers_1.expect(needsTpl.vc.createEmbeddedView(needsTpl.contentTpl).rootNodes[0])
                    .toHaveText('light');
                matchers_1.expect(needsTpl.vc.createEmbeddedView(needsTpl.viewTpl).rootNodes[0]).toHaveText('shadow');
            });
        });
        describe('read a different token', function () {
            it('should contain all content children', function () {
                var template = '<needs-content-children-read #q text="ca"><div #q text="cb"></div></needs-content-children-read>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var comp = view.debugElement.children[0].injector.get(NeedsContentChildrenWithRead);
                matchers_1.expect(comp.textDirChildren.map(function (textDirective) { return textDirective.text; })).toEqual(['ca', 'cb']);
            });
            it('should contain the first content child', function () {
                var template = '<needs-content-child-read><div #q text="ca"></div></needs-content-child-read>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var comp = view.debugElement.children[0].injector.get(NeedsContentChildWithRead);
                matchers_1.expect(comp.textDirChild.text).toEqual('ca');
            });
            it('should contain the first descendant content child', function () {
                var template = '<needs-content-child-read>' +
                    '<div dir><div #q text="ca"></div></div>' +
                    '</needs-content-child-read>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var comp = view.debugElement.children[0].injector.get(NeedsContentChildWithRead);
                matchers_1.expect(comp.textDirChild.text).toEqual('ca');
            });
            it('should contain the first descendant content child templateRef', function () {
                var template = '<needs-content-child-template-ref-app>' +
                    '</needs-content-child-template-ref-app>';
                var view = createTestCmp(MyComp0, template);
                // can't execute checkNoChanges as our view modifies our content children (via a query).
                view.detectChanges(false);
                matchers_1.expect(view.nativeElement).toHaveText('OUTER');
            });
            it('should contain the first view child', function () {
                var template = '<needs-view-child-read></needs-view-child-read>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var comp = view.debugElement.children[0].injector.get(NeedsViewChildWithRead);
                matchers_1.expect(comp.textDirChild.text).toEqual('va');
            });
            it('should contain all child directives in the view', function () {
                var template = '<needs-view-children-read></needs-view-children-read>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var comp = view.debugElement.children[0].injector.get(NeedsViewChildrenWithRead);
                matchers_1.expect(comp.textDirChildren.map(function (textDirective) { return textDirective.text; })).toEqual(['va', 'vb']);
            });
            it('should support reading a ViewContainer', function () {
                var template = '<needs-viewcontainer-read><ng-template>hello</ng-template></needs-viewcontainer-read>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var comp = view.debugElement.children[0].injector.get(NeedsViewContainerWithRead);
                comp.createView();
                matchers_1.expect(view.debugElement.children[0].nativeElement).toHaveText('hello');
            });
        });
        describe('changes', function () {
            it('should notify query on change', testing_1.async(function () {
                var template = '<needs-query #q>' +
                    '<div text="1"></div>' +
                    '<div *ngIf="shouldShow" text="2"></div>' +
                    '</needs-query>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                q.query.changes.subscribe({
                    next: function () {
                        matchers_1.expect(q.query.first.text).toEqual('1');
                        matchers_1.expect(q.query.last.text).toEqual('2');
                    }
                });
                view.componentInstance.shouldShow = true;
                view.detectChanges();
            }));
            it('should correctly clean-up when destroyed together with the directives it is querying', function () {
                var template = '<needs-query #q *ngIf="shouldShow"><div text="foo"></div></needs-query>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                view.componentInstance.shouldShow = true;
                view.detectChanges();
                var isQueryListCompleted = false;
                var q = view.debugElement.children[0].references['q'];
                var changes = q.query.changes;
                matchers_1.expect(q.query.length).toEqual(1);
                matchers_1.expect(changes.closed).toBeFalsy();
                changes.subscribe(function () { }, function () { }, function () { isQueryListCompleted = true; });
                view.componentInstance.shouldShow = false;
                view.detectChanges();
                matchers_1.expect(changes.closed).toBeTruthy();
                matchers_1.expect(isQueryListCompleted).toBeTruthy();
                view.componentInstance.shouldShow = true;
                view.detectChanges();
                var q2 = view.debugElement.children[0].references['q'];
                matchers_1.expect(q2.query.length).toEqual(1);
                matchers_1.expect(changes.closed).toBeTruthy();
                matchers_1.expect(q2.query.changes.closed).toBeFalsy();
            });
        });
        describe('querying by var binding', function () {
            it('should contain all the child directives in the light dom with the given var binding', function () {
                var template = '<needs-query-by-ref-binding #q>' +
                    '<div *ngFor="let item of list" [text]="item" #textLabel="textDir"></div>' +
                    '</needs-query-by-ref-binding>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                view.componentInstance.list = ['1d', '2d'];
                view.detectChanges();
                matchers_1.expect(q.query.first.text).toEqual('1d');
                matchers_1.expect(q.query.last.text).toEqual('2d');
            });
            it('should support querying by multiple var bindings', function () {
                var template = '<needs-query-by-ref-bindings #q>' +
                    '<div text="one" #textLabel1="textDir"></div>' +
                    '<div text="two" #textLabel2="textDir"></div>' +
                    '</needs-query-by-ref-bindings>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query.first.text).toEqual('one');
                matchers_1.expect(q.query.last.text).toEqual('two');
            });
            it('should support dynamically inserted directives', function () {
                var template = '<needs-query-by-ref-binding #q>' +
                    '<div *ngFor="let item of list" [text]="item" #textLabel="textDir"></div>' +
                    '</needs-query-by-ref-binding>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                view.componentInstance.list = ['1d', '2d'];
                view.detectChanges();
                view.componentInstance.list = ['2d', '1d'];
                view.detectChanges();
                matchers_1.expect(q.query.last.text).toEqual('1d');
            });
            it('should contain all the elements in the light dom with the given var binding', function () {
                var template = '<needs-query-by-ref-binding #q>' +
                    '<div *ngFor="let item of list">' +
                    '<div #textLabel>{{item}}</div>' +
                    '</div>' +
                    '</needs-query-by-ref-binding>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                view.componentInstance.list = ['1d', '2d'];
                view.detectChanges();
                matchers_1.expect(q.query.first.nativeElement).toHaveText('1d');
                matchers_1.expect(q.query.last.nativeElement).toHaveText('2d');
            });
            it('should contain all the elements in the light dom even if they get projected', function () {
                var template = '<needs-query-and-project #q>' +
                    '<div text="hello"></div><div text="world"></div>' +
                    '</needs-query-and-project>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                matchers_1.expect(core_1.asNativeElements(view.debugElement.children)).toHaveText('hello|world|');
            });
            it('should support querying the view by using a view query', function () {
                var template = '<needs-view-query-by-ref-binding #q></needs-view-query-by-ref-binding>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query.first.nativeElement).toHaveText('text');
            });
            it('should contain all child directives in the view dom', function () {
                var template = '<needs-view-children #q></needs-view-children>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.textDirChildren.length).toEqual(1);
                matchers_1.expect(q.numberOfChildrenAfterViewInit).toEqual(1);
            });
        });
        describe('querying in the view', function () {
            it('should contain all the elements in the view with that have the given directive', function () {
                var template = '<needs-view-query #q><div text="ignoreme"></div></needs-view-query>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query.map(function (d) { return d.text; })).toEqual(['1', '2', '3', '4']);
            });
            it('should not include directive present on the host element', function () {
                var template = '<needs-view-query #q text="self"></needs-view-query>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query.map(function (d) { return d.text; })).toEqual(['1', '2', '3', '4']);
            });
            it('should reflect changes in the component', function () {
                var template = '<needs-view-query-if #q></needs-view-query-if>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query.length).toBe(0);
                q.show = true;
                view.detectChanges();
                matchers_1.expect(q.query.length).toBe(1);
                matchers_1.expect(q.query.first.text).toEqual('1');
            });
            it('should not be affected by other changes in the component', function () {
                var template = '<needs-view-query-nested-if #q></needs-view-query-nested-if>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query.length).toEqual(1);
                matchers_1.expect(q.query.first.text).toEqual('1');
                q.show = false;
                view.detectChanges();
                matchers_1.expect(q.query.length).toEqual(1);
                matchers_1.expect(q.query.first.text).toEqual('1');
            });
            it('should maintain directives in pre-order depth-first DOM order after dynamic insertion', function () {
                var template = '<needs-view-query-order #q></needs-view-query-order>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query.map(function (d) { return d.text; })).toEqual(['1', '2', '3', '4']);
                q.list = ['-3', '2'];
                view.detectChanges();
                matchers_1.expect(q.query.map(function (d) { return d.text; })).toEqual(['1', '-3', '2', '4']);
            });
            it('should maintain directives in pre-order depth-first DOM order after dynamic insertion', function () {
                var template = '<needs-view-query-order-with-p #q></needs-view-query-order-with-p>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query.map(function (d) { return d.text; })).toEqual(['1', '2', '3', '4']);
                q.list = ['-3', '2'];
                view.detectChanges();
                matchers_1.expect(q.query.map(function (d) { return d.text; })).toEqual(['1', '-3', '2', '4']);
            });
            it('should handle long ngFor cycles', function () {
                var template = '<needs-view-query-order #q></needs-view-query-order>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                // no significance to 50, just a reasonably large cycle.
                for (var i = 0; i < 50; i++) {
                    var newString = i.toString();
                    q.list = [newString];
                    view.detectChanges();
                    matchers_1.expect(q.query.map(function (d) { return d.text; })).toEqual(['1', newString, '4']);
                }
            });
            it('should support more than three queries', function () {
                var template = '<needs-four-queries #q><div text="1"></div></needs-four-queries>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query1).toBeDefined();
                matchers_1.expect(q.query2).toBeDefined();
                matchers_1.expect(q.query3).toBeDefined();
                matchers_1.expect(q.query4).toBeDefined();
            });
        });
        describe('query over moved templates', function () {
            it('should include manually projected templates in queries', function () {
                var template = '<manual-projecting #q><ng-template><div text="1"></div></ng-template></manual-projecting>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query.length).toBe(0);
                q.create();
                view.detectChanges();
                matchers_1.expect(q.query.map(function (d) { return d.text; })).toEqual(['1']);
                q.destroy();
                view.detectChanges();
                matchers_1.expect(q.query.length).toBe(0);
            });
            // Note: This tests is just document our current behavior, which we do
            // for performance reasons.
            it('should not affected queries for projected templates if views are detached or moved', function () {
                var template = '<manual-projecting #q><ng-template let-x="x"><div [text]="x"></div></ng-template></manual-projecting>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                matchers_1.expect(q.query.length).toBe(0);
                var view1 = q.vc.createEmbeddedView(q.template, { 'x': '1' });
                var view2 = q.vc.createEmbeddedView(q.template, { 'x': '2' });
                view.detectChanges();
                matchers_1.expect(q.query.map(function (d) { return d.text; })).toEqual(['1', '2']);
                q.vc.detach(1);
                q.vc.detach(0);
                view.detectChanges();
                matchers_1.expect(q.query.map(function (d) { return d.text; })).toEqual(['1', '2']);
                q.vc.insert(view2);
                q.vc.insert(view1);
                view.detectChanges();
                matchers_1.expect(q.query.map(function (d) { return d.text; })).toEqual(['1', '2']);
            });
            it('should remove manually projected templates if their parent view is destroyed', function () {
                var template = "\n          <manual-projecting #q><ng-template #tpl><div text=\"1\"></div></ng-template></manual-projecting>\n          <div *ngIf=\"shouldShow\">\n            <ng-container [ngTemplateOutlet]=\"tpl\"></ng-container>\n          </div>\n        ";
                var view = createTestCmp(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                view.componentInstance.shouldShow = true;
                view.detectChanges();
                matchers_1.expect(q.query.length).toBe(1);
                view.componentInstance.shouldShow = false;
                view.detectChanges();
                matchers_1.expect(q.query.length).toBe(0);
            });
            it('should not throw if a content template is queried and created in the view during change detection', function () {
                var AutoProjecting = /** @class */ (function () {
                    function AutoProjecting() {
                    }
                    __decorate([
                        core_1.ContentChild(core_1.TemplateRef),
                        __metadata("design:type", core_1.TemplateRef)
                    ], AutoProjecting.prototype, "content", void 0);
                    __decorate([
                        core_1.ContentChildren(TextDirective),
                        __metadata("design:type", core_1.QueryList)
                    ], AutoProjecting.prototype, "query", void 0);
                    AutoProjecting = __decorate([
                        core_1.Component({ selector: 'auto-projecting', template: '<div *ngIf="true; then: content"></div>' })
                    ], AutoProjecting);
                    return AutoProjecting;
                }());
                testing_1.TestBed.configureTestingModule({ declarations: [AutoProjecting] });
                var template = '<auto-projecting #q><ng-template><div text="1"></div></ng-template></auto-projecting>';
                var view = createTestCmpAndDetectChanges(MyComp0, template);
                var q = view.debugElement.children[0].references['q'];
                // This should be 1, but due to
                // https://github.com/angular/angular/issues/15117 this is 0.
                matchers_1.expect(q.query.length).toBe(0);
            });
        });
    });
}
var TextDirective = /** @class */ (function () {
    function TextDirective() {
    }
    TextDirective = __decorate([
        core_1.Directive({ selector: '[text]', inputs: ['text'], exportAs: 'textDir' }),
        __metadata("design:paramtypes", [])
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
var NeedsContentChild = /** @class */ (function () {
    function NeedsContentChild() {
        this.logs = [];
    }
    Object.defineProperty(NeedsContentChild.prototype, "child", {
        get: function () { return this._child; },
        set: function (value) {
            this._child = value;
            this.logs.push(['setter', value ? value.text : null]);
        },
        enumerable: true,
        configurable: true
    });
    NeedsContentChild.prototype.ngAfterContentInit = function () { this.logs.push(['init', this.child ? this.child.text : null]); };
    NeedsContentChild.prototype.ngAfterContentChecked = function () { this.logs.push(['check', this.child ? this.child.text : null]); };
    __decorate([
        core_1.ContentChild(TextDirective),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], NeedsContentChild.prototype, "child", null);
    NeedsContentChild = __decorate([
        core_1.Component({ selector: 'needs-content-child', template: '' })
    ], NeedsContentChild);
    return NeedsContentChild;
}());
var DirectiveNeedsContentChild = /** @class */ (function () {
    function DirectiveNeedsContentChild() {
    }
    __decorate([
        core_1.ContentChild(TextDirective),
        __metadata("design:type", TextDirective)
    ], DirectiveNeedsContentChild.prototype, "child", void 0);
    DirectiveNeedsContentChild = __decorate([
        core_1.Directive({ selector: '[directive-needs-content-child]' })
    ], DirectiveNeedsContentChild);
    return DirectiveNeedsContentChild;
}());
var NeedsViewChild = /** @class */ (function () {
    function NeedsViewChild() {
        this.shouldShow = true;
        this.shouldShow2 = false;
        this.logs = [];
    }
    Object.defineProperty(NeedsViewChild.prototype, "child", {
        get: function () { return this._child; },
        set: function (value) {
            this._child = value;
            this.logs.push(['setter', value ? value.text : null]);
        },
        enumerable: true,
        configurable: true
    });
    NeedsViewChild.prototype.ngAfterViewInit = function () { this.logs.push(['init', this.child ? this.child.text : null]); };
    NeedsViewChild.prototype.ngAfterViewChecked = function () { this.logs.push(['check', this.child ? this.child.text : null]); };
    __decorate([
        core_1.ViewChild(TextDirective),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], NeedsViewChild.prototype, "child", null);
    NeedsViewChild = __decorate([
        core_1.Component({ selector: 'needs-view-child', template: "<div *ngIf=\"shouldShow\" text=\"foo\"></div>" })
    ], NeedsViewChild);
    return NeedsViewChild;
}());
function createTestCmp(type, template) {
    var view = testing_1.TestBed.overrideComponent(type, { set: { template: template } }).createComponent(type);
    return view;
}
function createTestCmpAndDetectChanges(type, template) {
    var view = createTestCmp(type, template);
    view.detectChanges();
    return view;
}
var NeedsStaticContentAndViewChild = /** @class */ (function () {
    function NeedsStaticContentAndViewChild() {
    }
    __decorate([
        core_1.ContentChild(TextDirective),
        __metadata("design:type", TextDirective)
    ], NeedsStaticContentAndViewChild.prototype, "contentChild", void 0);
    __decorate([
        core_1.ViewChild(TextDirective),
        __metadata("design:type", TextDirective)
    ], NeedsStaticContentAndViewChild.prototype, "viewChild", void 0);
    NeedsStaticContentAndViewChild = __decorate([
        core_1.Component({ selector: 'needs-static-content-view-child', template: "<div text=\"viewFoo\"></div>" })
    ], NeedsStaticContentAndViewChild);
    return NeedsStaticContentAndViewChild;
}());
var InertDirective = /** @class */ (function () {
    function InertDirective() {
    }
    InertDirective = __decorate([
        core_1.Directive({ selector: '[dir]' })
    ], InertDirective);
    return InertDirective;
}());
var NeedsQuery = /** @class */ (function () {
    function NeedsQuery() {
    }
    __decorate([
        core_1.ContentChildren(TextDirective),
        __metadata("design:type", core_1.QueryList)
    ], NeedsQuery.prototype, "query", void 0);
    NeedsQuery = __decorate([
        core_1.Component({
            selector: 'needs-query',
            template: '<div text="ignoreme"></div><b *ngFor="let  dir of query">{{dir.text}}|</b>'
        })
    ], NeedsQuery);
    return NeedsQuery;
}());
var NeedsFourQueries = /** @class */ (function () {
    function NeedsFourQueries() {
    }
    __decorate([
        core_1.ContentChild(TextDirective),
        __metadata("design:type", TextDirective)
    ], NeedsFourQueries.prototype, "query1", void 0);
    __decorate([
        core_1.ContentChild(TextDirective),
        __metadata("design:type", TextDirective)
    ], NeedsFourQueries.prototype, "query2", void 0);
    __decorate([
        core_1.ContentChild(TextDirective),
        __metadata("design:type", TextDirective)
    ], NeedsFourQueries.prototype, "query3", void 0);
    __decorate([
        core_1.ContentChild(TextDirective),
        __metadata("design:type", TextDirective)
    ], NeedsFourQueries.prototype, "query4", void 0);
    NeedsFourQueries = __decorate([
        core_1.Component({ selector: 'needs-four-queries', template: '' })
    ], NeedsFourQueries);
    return NeedsFourQueries;
}());
var NeedsQueryDesc = /** @class */ (function () {
    function NeedsQueryDesc() {
    }
    __decorate([
        core_1.ContentChildren(TextDirective, { descendants: true }),
        __metadata("design:type", core_1.QueryList)
    ], NeedsQueryDesc.prototype, "query", void 0);
    NeedsQueryDesc = __decorate([
        core_1.Component({
            selector: 'needs-query-desc',
            template: '<ng-content></ng-content><div *ngFor="let  dir of query">{{dir.text}}|</div>'
        })
    ], NeedsQueryDesc);
    return NeedsQueryDesc;
}());
var NeedsQueryByLabel = /** @class */ (function () {
    function NeedsQueryByLabel() {
    }
    __decorate([
        core_1.ContentChildren('textLabel', { descendants: true }),
        __metadata("design:type", core_1.QueryList)
    ], NeedsQueryByLabel.prototype, "query", void 0);
    NeedsQueryByLabel = __decorate([
        core_1.Component({ selector: 'needs-query-by-ref-binding', template: '<ng-content>' })
    ], NeedsQueryByLabel);
    return NeedsQueryByLabel;
}());
var NeedsViewQueryByLabel = /** @class */ (function () {
    function NeedsViewQueryByLabel() {
    }
    __decorate([
        core_1.ViewChildren('textLabel'),
        __metadata("design:type", core_1.QueryList)
    ], NeedsViewQueryByLabel.prototype, "query", void 0);
    NeedsViewQueryByLabel = __decorate([
        core_1.Component({ selector: 'needs-view-query-by-ref-binding', template: '<div #textLabel>text</div>' })
    ], NeedsViewQueryByLabel);
    return NeedsViewQueryByLabel;
}());
var NeedsQueryByTwoLabels = /** @class */ (function () {
    function NeedsQueryByTwoLabels() {
    }
    __decorate([
        core_1.ContentChildren('textLabel1,textLabel2', { descendants: true }),
        __metadata("design:type", core_1.QueryList)
    ], NeedsQueryByTwoLabels.prototype, "query", void 0);
    NeedsQueryByTwoLabels = __decorate([
        core_1.Component({ selector: 'needs-query-by-ref-bindings', template: '<ng-content>' })
    ], NeedsQueryByTwoLabels);
    return NeedsQueryByTwoLabels;
}());
var NeedsQueryAndProject = /** @class */ (function () {
    function NeedsQueryAndProject() {
    }
    __decorate([
        core_1.ContentChildren(TextDirective),
        __metadata("design:type", core_1.QueryList)
    ], NeedsQueryAndProject.prototype, "query", void 0);
    NeedsQueryAndProject = __decorate([
        core_1.Component({
            selector: 'needs-query-and-project',
            template: '<div *ngFor="let  dir of query">{{dir.text}}|</div><ng-content></ng-content>'
        })
    ], NeedsQueryAndProject);
    return NeedsQueryAndProject;
}());
var NeedsViewQuery = /** @class */ (function () {
    function NeedsViewQuery() {
    }
    __decorate([
        core_1.ViewChildren(TextDirective),
        __metadata("design:type", core_1.QueryList)
    ], NeedsViewQuery.prototype, "query", void 0);
    NeedsViewQuery = __decorate([
        core_1.Component({
            selector: 'needs-view-query',
            template: '<div text="1"><div text="2"></div></div><div text="3"></div><div text="4"></div>'
        })
    ], NeedsViewQuery);
    return NeedsViewQuery;
}());
var NeedsViewQueryIf = /** @class */ (function () {
    function NeedsViewQueryIf() {
        this.show = false;
    }
    __decorate([
        core_1.ViewChildren(TextDirective),
        __metadata("design:type", core_1.QueryList)
    ], NeedsViewQueryIf.prototype, "query", void 0);
    NeedsViewQueryIf = __decorate([
        core_1.Component({ selector: 'needs-view-query-if', template: '<div *ngIf="show" text="1"></div>' })
    ], NeedsViewQueryIf);
    return NeedsViewQueryIf;
}());
var NeedsViewQueryNestedIf = /** @class */ (function () {
    function NeedsViewQueryNestedIf() {
        this.show = true;
    }
    __decorate([
        core_1.ViewChildren(TextDirective),
        __metadata("design:type", core_1.QueryList)
    ], NeedsViewQueryNestedIf.prototype, "query", void 0);
    NeedsViewQueryNestedIf = __decorate([
        core_1.Component({
            selector: 'needs-view-query-nested-if',
            template: '<div text="1"><div *ngIf="show"><div dir></div></div></div>'
        })
    ], NeedsViewQueryNestedIf);
    return NeedsViewQueryNestedIf;
}());
var NeedsViewQueryOrder = /** @class */ (function () {
    function NeedsViewQueryOrder() {
        this.list = ['2', '3'];
    }
    __decorate([
        core_1.ViewChildren(TextDirective),
        __metadata("design:type", core_1.QueryList)
    ], NeedsViewQueryOrder.prototype, "query", void 0);
    NeedsViewQueryOrder = __decorate([
        core_1.Component({
            selector: 'needs-view-query-order',
            template: '<div text="1"></div>' +
                '<div *ngFor="let  i of list" [text]="i"></div>' +
                '<div text="4"></div>'
        })
    ], NeedsViewQueryOrder);
    return NeedsViewQueryOrder;
}());
var NeedsViewQueryOrderWithParent = /** @class */ (function () {
    function NeedsViewQueryOrderWithParent() {
        this.list = ['2', '3'];
    }
    __decorate([
        core_1.ViewChildren(TextDirective),
        __metadata("design:type", core_1.QueryList)
    ], NeedsViewQueryOrderWithParent.prototype, "query", void 0);
    NeedsViewQueryOrderWithParent = __decorate([
        core_1.Component({
            selector: 'needs-view-query-order-with-p',
            template: '<div dir><div text="1"></div>' +
                '<div *ngFor="let  i of list" [text]="i"></div>' +
                '<div text="4"></div></div>'
        })
    ], NeedsViewQueryOrderWithParent);
    return NeedsViewQueryOrderWithParent;
}());
var NeedsTpl = /** @class */ (function () {
    function NeedsTpl(vc) {
        this.vc = vc;
    }
    __decorate([
        core_1.ViewChildren(core_1.TemplateRef),
        __metadata("design:type", core_1.QueryList)
    ], NeedsTpl.prototype, "viewQuery", void 0);
    __decorate([
        core_1.ContentChildren(core_1.TemplateRef),
        __metadata("design:type", core_1.QueryList)
    ], NeedsTpl.prototype, "query", void 0);
    NeedsTpl = __decorate([
        core_1.Component({ selector: 'needs-tpl', template: '<ng-template><div>shadow</div></ng-template>' }),
        __metadata("design:paramtypes", [core_1.ViewContainerRef])
    ], NeedsTpl);
    return NeedsTpl;
}());
var NeedsNamedTpl = /** @class */ (function () {
    function NeedsNamedTpl(vc) {
        this.vc = vc;
    }
    __decorate([
        core_1.ViewChild('tpl'),
        __metadata("design:type", core_1.TemplateRef)
    ], NeedsNamedTpl.prototype, "viewTpl", void 0);
    __decorate([
        core_1.ContentChild('tpl'),
        __metadata("design:type", core_1.TemplateRef)
    ], NeedsNamedTpl.prototype, "contentTpl", void 0);
    NeedsNamedTpl = __decorate([
        core_1.Component({ selector: 'needs-named-tpl', template: '<ng-template #tpl><div>shadow</div></ng-template>' }),
        __metadata("design:paramtypes", [core_1.ViewContainerRef])
    ], NeedsNamedTpl);
    return NeedsNamedTpl;
}());
var NeedsContentChildrenWithRead = /** @class */ (function () {
    function NeedsContentChildrenWithRead() {
    }
    __decorate([
        core_1.ContentChildren('q', { read: TextDirective }),
        __metadata("design:type", core_1.QueryList)
    ], NeedsContentChildrenWithRead.prototype, "textDirChildren", void 0);
    __decorate([
        core_1.ContentChildren('nonExisting', { read: TextDirective }),
        __metadata("design:type", core_1.QueryList)
    ], NeedsContentChildrenWithRead.prototype, "nonExistingVar", void 0);
    NeedsContentChildrenWithRead = __decorate([
        core_1.Component({ selector: 'needs-content-children-read', template: '' })
    ], NeedsContentChildrenWithRead);
    return NeedsContentChildrenWithRead;
}());
var NeedsContentChildWithRead = /** @class */ (function () {
    function NeedsContentChildWithRead() {
    }
    __decorate([
        core_1.ContentChild('q', { read: TextDirective }),
        __metadata("design:type", TextDirective)
    ], NeedsContentChildWithRead.prototype, "textDirChild", void 0);
    __decorate([
        core_1.ContentChild('nonExisting', { read: TextDirective }),
        __metadata("design:type", TextDirective)
    ], NeedsContentChildWithRead.prototype, "nonExistingVar", void 0);
    NeedsContentChildWithRead = __decorate([
        core_1.Component({ selector: 'needs-content-child-read', template: '' })
    ], NeedsContentChildWithRead);
    return NeedsContentChildWithRead;
}());
var NeedsContentChildTemplateRef = /** @class */ (function () {
    function NeedsContentChildTemplateRef() {
    }
    __decorate([
        core_1.ContentChild(core_1.TemplateRef),
        __metadata("design:type", core_1.TemplateRef)
    ], NeedsContentChildTemplateRef.prototype, "templateRef", void 0);
    NeedsContentChildTemplateRef = __decorate([
        core_1.Component({
            selector: 'needs-content-child-template-ref',
            template: '<div [ngTemplateOutlet]="templateRef"></div>'
        })
    ], NeedsContentChildTemplateRef);
    return NeedsContentChildTemplateRef;
}());
var NeedsContentChildTemplateRefApp = /** @class */ (function () {
    function NeedsContentChildTemplateRefApp() {
    }
    NeedsContentChildTemplateRefApp = __decorate([
        core_1.Component({
            selector: 'needs-content-child-template-ref-app',
            template: '<needs-content-child-template-ref>' +
                '<ng-template>OUTER<ng-template>INNER</ng-template></ng-template>' +
                '</needs-content-child-template-ref>'
        })
    ], NeedsContentChildTemplateRefApp);
    return NeedsContentChildTemplateRefApp;
}());
var NeedsViewChildrenWithRead = /** @class */ (function () {
    function NeedsViewChildrenWithRead() {
    }
    __decorate([
        core_1.ViewChildren('q,w', { read: TextDirective }),
        __metadata("design:type", core_1.QueryList)
    ], NeedsViewChildrenWithRead.prototype, "textDirChildren", void 0);
    __decorate([
        core_1.ViewChildren('nonExisting', { read: TextDirective }),
        __metadata("design:type", core_1.QueryList)
    ], NeedsViewChildrenWithRead.prototype, "nonExistingVar", void 0);
    NeedsViewChildrenWithRead = __decorate([
        core_1.Component({
            selector: 'needs-view-children-read',
            template: '<div #q text="va"></div><div #w text="vb"></div>',
        })
    ], NeedsViewChildrenWithRead);
    return NeedsViewChildrenWithRead;
}());
var NeedsViewChildWithRead = /** @class */ (function () {
    function NeedsViewChildWithRead() {
    }
    __decorate([
        core_1.ViewChild('q', { read: TextDirective }),
        __metadata("design:type", TextDirective)
    ], NeedsViewChildWithRead.prototype, "textDirChild", void 0);
    __decorate([
        core_1.ViewChild('nonExisting', { read: TextDirective }),
        __metadata("design:type", TextDirective)
    ], NeedsViewChildWithRead.prototype, "nonExistingVar", void 0);
    NeedsViewChildWithRead = __decorate([
        core_1.Component({
            selector: 'needs-view-child-read',
            template: '<div #q text="va"></div>',
        })
    ], NeedsViewChildWithRead);
    return NeedsViewChildWithRead;
}());
var NeedsViewContainerWithRead = /** @class */ (function () {
    function NeedsViewContainerWithRead() {
    }
    NeedsViewContainerWithRead.prototype.createView = function () { this.vc.createEmbeddedView(this.template); };
    __decorate([
        core_1.ViewChild('q', { read: core_1.ViewContainerRef }),
        __metadata("design:type", core_1.ViewContainerRef)
    ], NeedsViewContainerWithRead.prototype, "vc", void 0);
    __decorate([
        core_1.ViewChild('nonExisting', { read: core_1.ViewContainerRef }),
        __metadata("design:type", core_1.ViewContainerRef)
    ], NeedsViewContainerWithRead.prototype, "nonExistingVar", void 0);
    __decorate([
        core_1.ContentChild(core_1.TemplateRef),
        __metadata("design:type", core_1.TemplateRef)
    ], NeedsViewContainerWithRead.prototype, "template", void 0);
    NeedsViewContainerWithRead = __decorate([
        core_1.Component({ selector: 'needs-viewcontainer-read', template: '<div #q></div>' })
    ], NeedsViewContainerWithRead);
    return NeedsViewContainerWithRead;
}());
var HasNullQueryCondition = /** @class */ (function () {
    function HasNullQueryCondition() {
    }
    __decorate([
        core_1.ContentChildren(null),
        __metadata("design:type", Object)
    ], HasNullQueryCondition.prototype, "errorTrigger", void 0);
    HasNullQueryCondition = __decorate([
        core_1.Component({ selector: 'has-null-query-condition', template: '<div></div>' })
    ], HasNullQueryCondition);
    return HasNullQueryCondition;
}());
var MyComp0 = /** @class */ (function () {
    function MyComp0() {
        this.shouldShow = false;
        this.list = ['1d', '2d', '3d'];
    }
    MyComp0 = __decorate([
        core_1.Component({ selector: 'my-comp', template: '' })
    ], MyComp0);
    return MyComp0;
}());
var MyCompBroken0 = /** @class */ (function () {
    function MyCompBroken0() {
    }
    MyCompBroken0 = __decorate([
        core_1.Component({ selector: 'my-comp', template: '' })
    ], MyCompBroken0);
    return MyCompBroken0;
}());
var ManualProjecting = /** @class */ (function () {
    function ManualProjecting() {
    }
    ManualProjecting.prototype.create = function () { this.vc.createEmbeddedView(this.template); };
    ManualProjecting.prototype.destroy = function () { this.vc.clear(); };
    __decorate([
        core_1.ContentChild(core_1.TemplateRef),
        __metadata("design:type", core_1.TemplateRef)
    ], ManualProjecting.prototype, "template", void 0);
    __decorate([
        core_1.ViewChild('vc', { read: core_1.ViewContainerRef }),
        __metadata("design:type", core_1.ViewContainerRef)
    ], ManualProjecting.prototype, "vc", void 0);
    __decorate([
        core_1.ContentChildren(TextDirective),
        __metadata("design:type", core_1.QueryList)
    ], ManualProjecting.prototype, "query", void 0);
    ManualProjecting = __decorate([
        core_1.Component({ selector: 'manual-projecting', template: '<div #vc></div>' })
    ], ManualProjecting);
    return ManualProjecting;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnlfaW50ZWdyYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9saW5rZXIvcXVlcnlfaW50ZWdyYXRpb25fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUFxUDtBQUNyUCxpREFBdUU7QUFDdkUsMkVBQXNFO0FBSXRFLHVDQUF5QztBQUV6QztJQUNFLFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFFcEIsVUFBVSxDQUFDLGNBQU0sT0FBQSxpQkFBTyxDQUFDLHNCQUFzQixDQUFDO1lBQzlDLFlBQVksRUFBRTtnQkFDWixPQUFPO2dCQUNQLFVBQVU7Z0JBQ1YsY0FBYztnQkFDZCxpQkFBaUI7Z0JBQ2pCLHFCQUFxQjtnQkFDckIsb0JBQW9CO2dCQUNwQixjQUFjO2dCQUNkLGdCQUFnQjtnQkFDaEIsc0JBQXNCO2dCQUN0QixtQkFBbUI7Z0JBQ25CLHFCQUFxQjtnQkFDckIsNkJBQTZCO2dCQUM3QixvQkFBb0I7Z0JBQ3BCLGlCQUFpQjtnQkFDakIsY0FBYztnQkFDZCw4QkFBOEI7Z0JBQzlCLGlCQUFpQjtnQkFDakIsMEJBQTBCO2dCQUMxQixRQUFRO2dCQUNSLGFBQWE7Z0JBQ2IsYUFBYTtnQkFDYixjQUFjO2dCQUNkLGdCQUFnQjtnQkFDaEIsNEJBQTRCO2dCQUM1Qix5QkFBeUI7Z0JBQ3pCLHlCQUF5QjtnQkFDekIsc0JBQXNCO2dCQUN0Qiw0QkFBNEI7Z0JBQzVCLCtCQUErQjtnQkFDL0IsMEJBQTBCO2dCQUMxQixnQkFBZ0I7YUFDakI7U0FDRixDQUFDLEVBbENlLENBa0NmLENBQUMsQ0FBQztRQUVKLFFBQVEsQ0FBQyw0QkFBNEIsRUFBRTtZQUNyQyxFQUFFLENBQUMsMkVBQTJFLEVBQUU7Z0JBQzlFLElBQU0sUUFBUSxHQUFHLHNCQUFzQjtvQkFDbkMsc0NBQXNDO29CQUN0Qyw2QkFBNkI7b0JBQzdCLHNCQUFzQjtvQkFDdEIsc0JBQXNCLENBQUM7Z0JBQzNCLElBQU0sSUFBSSxHQUFHLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFFOUQsaUJBQU0sQ0FBQyx1QkFBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFFLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLCtEQUErRCxFQUFFO2dCQUNsRSxJQUFNLFFBQVEsR0FDViw0RUFBNEUsQ0FBQztnQkFDakYsSUFBTSxJQUFJLEdBQUcsNkJBQTZCLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUU5RCxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzFELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDckIsaUJBQU0sQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUMsaUJBQU0sQ0FBQyxDQUFDLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsd0NBQXdDLEVBQUU7Z0JBQzNDLElBQU0sUUFBUSxHQUNWLHlGQUF5RixDQUFDO2dCQUM5RixJQUFNLElBQUksR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDekMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNyQixJQUFNLENBQUMsR0FBc0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM3RSxpQkFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRS9FLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO2dCQUMxQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3JCLGlCQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQztvQkFDckIsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDO2lCQUN4RixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywwR0FBMEcsRUFDMUc7Z0JBQ0UsSUFBTSxRQUFRLEdBQ1YscUhBQXFIO29CQUNySCwwSEFBMEgsQ0FBQztnQkFDL0gsSUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNyQixJQUFNLENBQUMsR0FBc0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM3RSxpQkFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNwQyxJQUFNLFNBQVMsR0FDWCxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7Z0JBQzNFLGlCQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUMsQ0FBQyxDQUFDLENBQUM7WUFFTixFQUFFLENBQUMscUNBQXFDLEVBQUU7Z0JBQ3hDLElBQU0sUUFBUSxHQUFHLDBDQUEwQyxDQUFDO2dCQUM1RCxJQUFNLElBQUksR0FBRyw2QkFBNkIsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRTlELElBQU0sQ0FBQyxHQUFtQixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzFFLGlCQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFL0UsQ0FBQyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDckIsaUJBQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDO29CQUNyQixDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUM7aUJBQ3hGLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLGdGQUFnRixFQUFFO2dCQUNuRixJQUFNLFFBQVEsR0FDVixxR0FBcUcsQ0FBQztnQkFDMUcsSUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDOUMsSUFBTSxDQUFDLEdBQW1DLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDMUYsaUJBQU0sQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUN4QyxpQkFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBRXJDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDckIsaUJBQU0sQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDbEQsaUJBQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM5QyxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywyREFBMkQsRUFBRTtnQkFDOUQsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FDckIsT0FBTyxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxFQUFFLDBDQUEwQyxFQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUM1RSxpQkFBTyxDQUFDLGlCQUFpQixDQUFDLGNBQWMsRUFBRTtvQkFDeEMsR0FBRyxFQUFFO3dCQUNILFFBQVEsRUFDSiw2R0FBNkc7cUJBQ2xIO2lCQUNGLENBQUMsQ0FBQztnQkFDSCxJQUFNLElBQUksR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFOUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNyQixJQUFNLENBQUMsR0FBbUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMxRSxpQkFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRS9FLENBQUMsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO2dCQUNyQixDQUFDLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztnQkFDckIsQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBQ1osSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNyQixpQkFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRTlELENBQUMsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO2dCQUNyQixDQUFDLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztnQkFDdEIsQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBQ1osSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNyQixpQkFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsOEVBQThFLEVBQUU7Z0JBQ2pGLElBQU0sUUFBUSxHQUFHLHNCQUFzQjtvQkFDbkMsMkNBQTJDO29CQUMzQyxzQkFBc0I7b0JBQ3RCLDJCQUEyQjtvQkFDM0Isc0JBQXNCLENBQUM7Z0JBQzNCLElBQU0sSUFBSSxHQUFHLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFFOUQsaUJBQU0sQ0FBQyx1QkFBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVFLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLGdEQUFnRCxFQUFFO2dCQUNuRCxJQUFNLFFBQVEsR0FBRyxzQkFBc0I7b0JBQ25DLDBEQUEwRDtvQkFDMUQsc0JBQXNCLENBQUM7Z0JBQzNCLElBQU0sSUFBSSxHQUFHLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFFOUQsaUJBQU0sQ0FBQyx1QkFBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFFLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLGdEQUFnRCxFQUFFO2dCQUNuRCxJQUFNLFFBQVEsR0FBRyxzQkFBc0I7b0JBQ25DLG1GQUFtRjtvQkFDbkYsc0JBQXNCLENBQUM7Z0JBQzNCLElBQU0sSUFBSSxHQUFHLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDOUQsaUJBQU0sQ0FBQyx1QkFBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUV0RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDekMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNyQixpQkFBTSxDQUFDLHVCQUFnQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUUsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsa0VBQWtFLEVBQUU7Z0JBQ3JFLElBQU0sUUFBUSxHQUFHLHNCQUFzQjtvQkFDbkMsbUZBQW1GO29CQUNuRixzQkFBc0IsQ0FBQztnQkFDM0IsSUFBTSxJQUFJLEdBQUcsNkJBQTZCLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUU5RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDekMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNyQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDakIsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsaUNBQWlDLEVBQUU7Z0JBQ3BDLElBQU0sUUFBUSxHQUFHLHNCQUFzQjtvQkFDbkMsb0ZBQW9GO29CQUNwRixzQkFBc0IsQ0FBQztnQkFDM0IsSUFBTSxJQUFJLEdBQUcsNkJBQTZCLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM5RCxpQkFBTSxDQUFDLHVCQUFnQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBRS9FLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDckIsaUJBQU0sQ0FBQyx1QkFBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlFLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDBFQUEwRSxFQUFFO2dCQUM3RSxpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsYUFBYSxFQUFFLHFCQUFxQixDQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUN2RixJQUFNLFFBQVEsR0FBRyx1REFBdUQsQ0FBQztnQkFDekUsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLFVBQUEsRUFBQyxFQUFDLENBQUMsQ0FBQztnQkFDNUQsaUJBQU0sQ0FBQyxjQUFNLE9BQUEsaUJBQU8sQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLEVBQXRDLENBQXNDLENBQUM7cUJBQy9DLFlBQVksQ0FDVCxvRUFBK0QsZ0JBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxnREFBNEMsQ0FBQyxDQUFDO1lBQ3ZKLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsdUJBQXVCLEVBQUU7WUFDaEMsRUFBRSxDQUFDLHNEQUFzRCxFQUFFO2dCQUN6RCxJQUFNLFFBQVEsR0FBRyxvRUFBb0UsQ0FBQztnQkFDdEYsSUFBTSxJQUFJLEdBQUcsNkJBQTZCLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM5RCxJQUFNLFFBQVEsR0FBYSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUVoRixpQkFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3BFLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDekIsaUJBQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN4RSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsZ0NBQWdDLEVBQUU7Z0JBQ25DLElBQU0sUUFBUSxHQUNWLHFGQUFxRixDQUFDO2dCQUMxRixJQUFNLElBQUksR0FBRyw2QkFBNkIsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQzlELElBQU0sUUFBUSxHQUFrQixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUMxRixpQkFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDbkUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN6QixpQkFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM3RixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLHdCQUF3QixFQUFFO1lBQ2pDLEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRTtnQkFDeEMsSUFBTSxRQUFRLEdBQ1Ysa0dBQWtHLENBQUM7Z0JBQ3ZHLElBQU0sSUFBSSxHQUFHLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFFOUQsSUFBTSxJQUFJLEdBQ04sSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO2dCQUM3RSxpQkFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQUEsYUFBYSxJQUFJLE9BQUEsYUFBYSxDQUFDLElBQUksRUFBbEIsQ0FBa0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDOUYsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsd0NBQXdDLEVBQUU7Z0JBQzNDLElBQU0sUUFBUSxHQUNWLCtFQUErRSxDQUFDO2dCQUNwRixJQUFNLElBQUksR0FBRyw2QkFBNkIsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRTlELElBQU0sSUFBSSxHQUNOLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztnQkFDMUUsaUJBQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQyxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxtREFBbUQsRUFBRTtnQkFDdEQsSUFBTSxRQUFRLEdBQUcsNEJBQTRCO29CQUN6Qyx5Q0FBeUM7b0JBQ3pDLDZCQUE2QixDQUFDO2dCQUNsQyxJQUFNLElBQUksR0FBRyw2QkFBNkIsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRTlELElBQU0sSUFBSSxHQUNOLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztnQkFDMUUsaUJBQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQyxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywrREFBK0QsRUFBRTtnQkFDbEUsSUFBTSxRQUFRLEdBQUcsd0NBQXdDO29CQUNyRCx5Q0FBeUMsQ0FBQztnQkFDOUMsSUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFFOUMsd0ZBQXdGO2dCQUN4RixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMxQixpQkFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDakQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQUU7Z0JBQ3hDLElBQU0sUUFBUSxHQUFHLGlEQUFpRCxDQUFDO2dCQUNuRSxJQUFNLElBQUksR0FBRyw2QkFBNkIsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRTlELElBQU0sSUFBSSxHQUNOLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztnQkFDdkUsaUJBQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQyxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxpREFBaUQsRUFBRTtnQkFDcEQsSUFBTSxRQUFRLEdBQUcsdURBQXVELENBQUM7Z0JBQ3pFLElBQU0sSUFBSSxHQUFHLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFFOUQsSUFBTSxJQUFJLEdBQ04sSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO2dCQUMxRSxpQkFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQUEsYUFBYSxJQUFJLE9BQUEsYUFBYSxDQUFDLElBQUksRUFBbEIsQ0FBa0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDOUYsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsd0NBQXdDLEVBQUU7Z0JBQzNDLElBQU0sUUFBUSxHQUNWLHVGQUF1RixDQUFDO2dCQUM1RixJQUFNLElBQUksR0FBRyw2QkFBNkIsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRTlELElBQU0sSUFBSSxHQUNOLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztnQkFDM0UsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUNsQixpQkFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMxRSxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLFNBQVMsRUFBRTtZQUNsQixFQUFFLENBQUMsK0JBQStCLEVBQUUsZUFBSyxDQUFDO2dCQUNyQyxJQUFNLFFBQVEsR0FBRyxrQkFBa0I7b0JBQy9CLHNCQUFzQjtvQkFDdEIseUNBQXlDO29CQUN6QyxnQkFBZ0IsQ0FBQztnQkFDckIsSUFBTSxJQUFJLEdBQUcsNkJBQTZCLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUU5RCxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRTFELENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztvQkFDeEIsSUFBSSxFQUFFO3dCQUNKLGlCQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUN4QyxpQkFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDekMsQ0FBQztpQkFDRixDQUFDLENBQUM7Z0JBRUgsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN2QixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRVAsRUFBRSxDQUFDLHNGQUFzRixFQUN0RjtnQkFDRSxJQUFNLFFBQVEsR0FDVix5RUFBeUUsQ0FBQztnQkFDOUUsSUFBTSxJQUFJLEdBQUcsNkJBQTZCLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM5RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDekMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUVyQixJQUFJLG9CQUFvQixHQUFHLEtBQUssQ0FBQztnQkFFakMsSUFBTSxDQUFDLEdBQWUsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN0RSxJQUFNLE9BQU8sR0FBaUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7Z0JBQzlDLGlCQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLGlCQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNuQyxPQUFPLENBQUMsU0FBUyxDQUFDLGNBQU8sQ0FBQyxFQUFFLGNBQU8sQ0FBQyxFQUFFLGNBQVEsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRTlFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO2dCQUMxQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3JCLGlCQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUNwQyxpQkFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBRTFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO2dCQUN6QyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3JCLElBQU0sRUFBRSxHQUFlLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFdkUsaUJBQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsaUJBQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ3BDLGlCQUFNLENBQWdCLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQzlELENBQUMsQ0FBQyxDQUFDO1FBQ1IsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMseUJBQXlCLEVBQUU7WUFDbEMsRUFBRSxDQUFDLHFGQUFxRixFQUNyRjtnQkFDRSxJQUFNLFFBQVEsR0FBRyxpQ0FBaUM7b0JBQzlDLDBFQUEwRTtvQkFDMUUsK0JBQStCLENBQUM7Z0JBQ3BDLElBQU0sSUFBSSxHQUFHLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDOUQsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUUxRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3JCLGlCQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN6QyxpQkFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxQyxDQUFDLENBQUMsQ0FBQztZQUVOLEVBQUUsQ0FBQyxrREFBa0QsRUFBRTtnQkFDckQsSUFBTSxRQUFRLEdBQUcsa0NBQWtDO29CQUMvQyw4Q0FBOEM7b0JBQzlDLDhDQUE4QztvQkFDOUMsZ0NBQWdDLENBQUM7Z0JBQ3JDLElBQU0sSUFBSSxHQUFHLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDOUQsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUUxRCxpQkFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDMUMsaUJBQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0MsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsZ0RBQWdELEVBQUU7Z0JBQ25ELElBQU0sUUFBUSxHQUFHLGlDQUFpQztvQkFDOUMsMEVBQTBFO29CQUMxRSwrQkFBK0IsQ0FBQztnQkFDcEMsSUFBTSxJQUFJLEdBQUcsNkJBQTZCLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM5RCxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRTFELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDckIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNyQixpQkFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxQyxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyw2RUFBNkUsRUFBRTtnQkFDaEYsSUFBTSxRQUFRLEdBQUcsaUNBQWlDO29CQUM5QyxpQ0FBaUM7b0JBQ2pDLGdDQUFnQztvQkFDaEMsUUFBUTtvQkFDUiwrQkFBK0IsQ0FBQztnQkFDcEMsSUFBTSxJQUFJLEdBQUcsNkJBQTZCLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM5RCxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRTFELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDckIsaUJBQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3JELGlCQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDZFQUE2RSxFQUFFO2dCQUNoRixJQUFNLFFBQVEsR0FBRyw4QkFBOEI7b0JBQzNDLGtEQUFrRDtvQkFDbEQsNEJBQTRCLENBQUM7Z0JBQ2pDLElBQU0sSUFBSSxHQUFHLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFFOUQsaUJBQU0sQ0FBQyx1QkFBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ2xGLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLHdEQUF3RCxFQUFFO2dCQUMzRCxJQUFNLFFBQVEsR0FBRyx3RUFBd0UsQ0FBQztnQkFDMUYsSUFBTSxJQUFJLEdBQUcsNkJBQTZCLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUU5RCxJQUFNLENBQUMsR0FBMEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqRixpQkFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN6RCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxxREFBcUQsRUFBRTtnQkFDeEQsSUFBTSxRQUFRLEdBQUcsZ0RBQWdELENBQUM7Z0JBQ2xFLElBQU0sSUFBSSxHQUFHLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDOUQsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMxRCxpQkFBTSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxpQkFBTSxDQUFDLENBQUMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyRCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLHNCQUFzQixFQUFFO1lBQy9CLEVBQUUsQ0FBQyxnRkFBZ0YsRUFBRTtnQkFDbkYsSUFBTSxRQUFRLEdBQUcscUVBQXFFLENBQUM7Z0JBQ3ZGLElBQU0sSUFBSSxHQUFHLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDOUQsSUFBTSxDQUFDLEdBQW1CLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDMUUsaUJBQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQWdCLElBQUssT0FBQSxDQUFDLENBQUMsSUFBSSxFQUFOLENBQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsRixDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywwREFBMEQsRUFBRTtnQkFDN0QsSUFBTSxRQUFRLEdBQUcsc0RBQXNELENBQUM7Z0JBQ3hFLElBQU0sSUFBSSxHQUFHLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDOUQsSUFBTSxDQUFDLEdBQW1CLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDMUUsaUJBQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQWdCLElBQUssT0FBQSxDQUFDLENBQUMsSUFBSSxFQUFOLENBQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsRixDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRTtnQkFDNUMsSUFBTSxRQUFRLEdBQUcsZ0RBQWdELENBQUM7Z0JBQ2xFLElBQU0sSUFBSSxHQUFHLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDOUQsSUFBTSxDQUFDLEdBQXFCLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUUsaUJBQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFL0IsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQ2QsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNyQixpQkFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixpQkFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQyxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywwREFBMEQsRUFBRTtnQkFDN0QsSUFBTSxRQUFRLEdBQUcsOERBQThELENBQUM7Z0JBQ2hGLElBQU0sSUFBSSxHQUFHLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDOUQsSUFBTSxDQUFDLEdBQTJCLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFbEYsaUJBQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsaUJBQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRXhDLENBQUMsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO2dCQUNmLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDckIsaUJBQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsaUJBQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDMUMsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsdUZBQXVGLEVBQ3ZGO2dCQUNFLElBQU0sUUFBUSxHQUFHLHNEQUFzRCxDQUFDO2dCQUN4RSxJQUFNLElBQUksR0FBRyw2QkFBNkIsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQzlELElBQU0sQ0FBQyxHQUF3QixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRS9FLGlCQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFnQixJQUFLLE9BQUEsQ0FBQyxDQUFDLElBQUksRUFBTixDQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBRWhGLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDckIsaUJBQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQWdCLElBQUssT0FBQSxDQUFDLENBQUMsSUFBSSxFQUFOLENBQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNuRixDQUFDLENBQUMsQ0FBQztZQUVOLEVBQUUsQ0FBQyx1RkFBdUYsRUFDdkY7Z0JBQ0UsSUFBTSxRQUFRLEdBQUcsb0VBQW9FLENBQUM7Z0JBQ3RGLElBQU0sSUFBSSxHQUFHLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDOUQsSUFBTSxDQUFDLEdBQWtDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDekYsaUJBQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQWdCLElBQUssT0FBQSxDQUFDLENBQUMsSUFBSSxFQUFOLENBQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFFaEYsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDckIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNyQixpQkFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBZ0IsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEVBQU4sQ0FBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ25GLENBQUMsQ0FBQyxDQUFDO1lBRU4sRUFBRSxDQUFDLGlDQUFpQyxFQUFFO2dCQUNwQyxJQUFNLFFBQVEsR0FBRyxzREFBc0QsQ0FBQztnQkFDeEUsSUFBTSxJQUFJLEdBQUcsNkJBQTZCLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM5RCxJQUFNLENBQUMsR0FBd0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUUvRSx3REFBd0Q7Z0JBQ3hELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQzNCLElBQU0sU0FBUyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDL0IsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNyQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQ3JCLGlCQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFnQixJQUFLLE9BQUEsQ0FBQyxDQUFDLElBQUksRUFBTixDQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDbEY7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtnQkFDM0MsSUFBTSxRQUFRLEdBQUcsa0VBQWtFLENBQUM7Z0JBQ3BGLElBQU0sSUFBSSxHQUFHLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDOUQsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMxRCxpQkFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDL0IsaUJBQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQy9CLGlCQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUMvQixpQkFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNqQyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLDRCQUE0QixFQUFFO1lBQ3JDLEVBQUUsQ0FBQyx3REFBd0QsRUFBRTtnQkFDM0QsSUFBTSxRQUFRLEdBQ1YsMkZBQTJGLENBQUM7Z0JBQ2hHLElBQU0sSUFBSSxHQUFHLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDOUQsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMxRCxpQkFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUUvQixDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ1gsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNyQixpQkFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBZ0IsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEVBQU4sQ0FBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUVqRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ1osSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNyQixpQkFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLENBQUMsQ0FBQyxDQUFDO1lBRUgsc0VBQXNFO1lBQ3RFLDJCQUEyQjtZQUMzQixFQUFFLENBQUMsb0ZBQW9GLEVBQUU7Z0JBQ3ZGLElBQU0sUUFBUSxHQUNWLHVHQUF1RyxDQUFDO2dCQUM1RyxJQUFNLElBQUksR0FBRyw2QkFBNkIsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQzlELElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVksQ0FBQyxHQUFHLENBQXFCLENBQUM7Z0JBQzlFLGlCQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRS9CLElBQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDO2dCQUM5RCxJQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztnQkFDOUQsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNyQixpQkFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBZ0IsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEVBQU4sQ0FBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFFdEUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRWYsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNyQixpQkFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBZ0IsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEVBQU4sQ0FBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFFdEUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ25CLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUVuQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3JCLGlCQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFnQixJQUFLLE9BQUEsQ0FBQyxDQUFDLElBQUksRUFBTixDQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3hFLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDhFQUE4RSxFQUFFO2dCQUNqRixJQUFNLFFBQVEsR0FBRyxzUEFLaEIsQ0FBQztnQkFDRixJQUFNLElBQUksR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM5QyxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzFELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO2dCQUN6QyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBRXJCLGlCQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRS9CLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO2dCQUMxQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3JCLGlCQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsbUdBQW1HLEVBQ25HO2dCQUdFO29CQUFBO29CQVFBLENBQUM7b0JBTEM7d0JBREMsbUJBQVksQ0FBQyxrQkFBVyxDQUFDO2tEQUNmLGtCQUFXO21FQUFNO29CQUk1Qjt3QkFEQyxzQkFBZSxDQUFDLGFBQWEsQ0FBQztrREFDdEIsZ0JBQVM7aUVBQWdCO29CQVA5QixjQUFjO3dCQUZuQixnQkFBUyxDQUNOLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFFLFFBQVEsRUFBRSx5Q0FBeUMsRUFBQyxDQUFDO3VCQUNqRixjQUFjLENBUW5CO29CQUFELHFCQUFDO2lCQUFBLEFBUkQsSUFRQztnQkFFRCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsY0FBYyxDQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUNqRSxJQUFNLFFBQVEsR0FDVix1RkFBdUYsQ0FBQztnQkFDNUYsSUFBTSxJQUFJLEdBQUcsNkJBQTZCLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUU5RCxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzFELCtCQUErQjtnQkFDL0IsNkRBQTZEO2dCQUM3RCxpQkFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLENBQUMsQ0FBQyxDQUFDO1FBRVIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztDQUNKO0FBR0Q7SUFHRTtJQUFlLENBQUM7SUFIWixhQUFhO1FBRGxCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUMsQ0FBQzs7T0FDakUsYUFBYSxDQUlsQjtJQUFELG9CQUFDO0NBQUEsQUFKRCxJQUlDO0FBR0Q7SUFBQTtJQU9BLENBQUM7SUFEQyxpREFBa0IsR0FBbEIsY0FBdUIsSUFBSSxDQUFDLGdDQUFnQyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUo3RDtRQUEvQixzQkFBZSxDQUFDLGFBQWEsQ0FBQztrQ0FBb0IsZ0JBQVM7aUVBQWdCO0lBRnhFLG9CQUFvQjtRQUR6QixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLHdCQUF3QixFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUMsQ0FBQztPQUN4RCxvQkFBb0IsQ0FPekI7SUFBRCwyQkFBQztDQUFBLEFBUEQsSUFPQztBQUdEO0lBQUE7SUFPQSxDQUFDO0lBREMsMkNBQWUsR0FBZixjQUFvQixJQUFJLENBQUMsNkJBQTZCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBSjFEO1FBQTVCLG1CQUFZLENBQUMsYUFBYSxDQUFDO2tDQUFvQixnQkFBUzs4REFBZ0I7SUFGckUsaUJBQWlCO1FBRHRCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUscUJBQXFCLEVBQUUsUUFBUSxFQUFFLGtCQUFrQixFQUFDLENBQUM7T0FDckUsaUJBQWlCLENBT3RCO0lBQUQsd0JBQUM7Q0FBQSxBQVBELElBT0M7QUFHRDtJQURBO1FBYUUsU0FBSSxHQUE0QixFQUFFLENBQUM7SUFLckMsQ0FBQztJQVhDLHNCQUFJLG9DQUFLO2FBS1QsY0FBYyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2FBTG5DLFVBQVUsS0FBSztZQUNiLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN4RCxDQUFDOzs7T0FBQTtJQUtELDhDQUFrQixHQUFsQixjQUF1QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFdkYsaURBQXFCLEdBQXJCLGNBQTBCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQVYzRjtRQURDLG1CQUFZLENBQUMsYUFBYSxDQUFDOzs7a0RBSTNCO0lBVEcsaUJBQWlCO1FBRHRCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUscUJBQXFCLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBQyxDQUFDO09BQ3JELGlCQUFpQixDQWlCdEI7SUFBRCx3QkFBQztDQUFBLEFBakJELElBaUJDO0FBR0Q7SUFBQTtJQUdBLENBQUM7SUFEOEI7UUFBNUIsbUJBQVksQ0FBQyxhQUFhLENBQUM7a0NBQVUsYUFBYTs2REFBQztJQUZoRCwwQkFBMEI7UUFEL0IsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxpQ0FBaUMsRUFBQyxDQUFDO09BQ25ELDBCQUEwQixDQUcvQjtJQUFELGlDQUFDO0NBQUEsQUFIRCxJQUdDO0FBR0Q7SUFEQTtRQUVFLGVBQVUsR0FBWSxJQUFJLENBQUM7UUFDM0IsZ0JBQVcsR0FBWSxLQUFLLENBQUM7UUFZN0IsU0FBSSxHQUE0QixFQUFFLENBQUM7SUFLckMsQ0FBQztJQVhDLHNCQUFJLGlDQUFLO2FBS1QsY0FBYyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2FBTG5DLFVBQVUsS0FBSztZQUNiLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN4RCxDQUFDOzs7T0FBQTtJQUtELHdDQUFlLEdBQWYsY0FBb0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXBGLDJDQUFrQixHQUFsQixjQUF1QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFWeEY7UUFEQyxnQkFBUyxDQUFDLGFBQWEsQ0FBQzs7OytDQUl4QjtJQVhHLGNBQWM7UUFEbkIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsK0NBQTJDLEVBQUMsQ0FBQztPQUMzRixjQUFjLENBbUJuQjtJQUFELHFCQUFDO0NBQUEsQUFuQkQsSUFtQkM7QUFFRCx1QkFBMEIsSUFBYSxFQUFFLFFBQWdCO0lBQ3ZELElBQU0sSUFBSSxHQUFHLGlCQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUMsUUFBUSxVQUFBLEVBQUMsRUFBQyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RGLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUdELHVDQUEwQyxJQUFhLEVBQUUsUUFBZ0I7SUFDdkUsSUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMzQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDckIsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBR0Q7SUFBQTtJQUtBLENBQUM7SUFIOEI7UUFBNUIsbUJBQVksQ0FBQyxhQUFhLENBQUM7a0NBQWlCLGFBQWE7d0VBQUM7SUFFakM7UUFBekIsZ0JBQVMsQ0FBQyxhQUFhLENBQUM7a0NBQWMsYUFBYTtxRUFBQztJQUpqRCw4QkFBOEI7UUFEbkMsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxpQ0FBaUMsRUFBRSxRQUFRLEVBQUUsOEJBQTRCLEVBQUMsQ0FBQztPQUMzRiw4QkFBOEIsQ0FLbkM7SUFBRCxxQ0FBQztDQUFBLEFBTEQsSUFLQztBQUdEO0lBQUE7SUFDQSxDQUFDO0lBREssY0FBYztRQURuQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBQyxDQUFDO09BQ3pCLGNBQWMsQ0FDbkI7SUFBRCxxQkFBQztDQUFBLEFBREQsSUFDQztBQU1EO0lBQUE7SUFHQSxDQUFDO0lBRGlDO1FBQS9CLHNCQUFlLENBQUMsYUFBYSxDQUFDO2tDQUFVLGdCQUFTOzZDQUFnQjtJQUY5RCxVQUFVO1FBSmYsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLFFBQVEsRUFBRSw0RUFBNEU7U0FDdkYsQ0FBQztPQUNJLFVBQVUsQ0FHZjtJQUFELGlCQUFDO0NBQUEsQUFIRCxJQUdDO0FBR0Q7SUFBQTtJQVNBLENBQUM7SUFQOEI7UUFBNUIsbUJBQVksQ0FBQyxhQUFhLENBQUM7a0NBQVcsYUFBYTtvREFBQztJQUV4QjtRQUE1QixtQkFBWSxDQUFDLGFBQWEsQ0FBQztrQ0FBVyxhQUFhO29EQUFDO0lBRXhCO1FBQTVCLG1CQUFZLENBQUMsYUFBYSxDQUFDO2tDQUFXLGFBQWE7b0RBQUM7SUFFeEI7UUFBNUIsbUJBQVksQ0FBQyxhQUFhLENBQUM7a0NBQVcsYUFBYTtvREFBQztJQVJqRCxnQkFBZ0I7UUFEckIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxvQkFBb0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDLENBQUM7T0FDcEQsZ0JBQWdCLENBU3JCO0lBQUQsdUJBQUM7Q0FBQSxBQVRELElBU0M7QUFNRDtJQUFBO0lBR0EsQ0FBQztJQURzRDtRQUFwRCxzQkFBZSxDQUFDLGFBQWEsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUMsQ0FBQztrQ0FBVSxnQkFBUztpREFBZ0I7SUFGbkYsY0FBYztRQUpuQixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGtCQUFrQjtZQUM1QixRQUFRLEVBQUUsOEVBQThFO1NBQ3pGLENBQUM7T0FDSSxjQUFjLENBR25CO0lBQUQscUJBQUM7Q0FBQSxBQUhELElBR0M7QUFHRDtJQUFBO0lBR0EsQ0FBQztJQURvRDtRQUFsRCxzQkFBZSxDQUFDLFdBQVcsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUMsQ0FBQztrQ0FBVSxnQkFBUztvREFBTTtJQUZ2RSxpQkFBaUI7UUFEdEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSw0QkFBNEIsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFDLENBQUM7T0FDeEUsaUJBQWlCLENBR3RCO0lBQUQsd0JBQUM7Q0FBQSxBQUhELElBR0M7QUFHRDtJQUFBO0lBR0EsQ0FBQztJQUQ0QjtRQUExQixtQkFBWSxDQUFDLFdBQVcsQ0FBQztrQ0FBVSxnQkFBUzt3REFBTTtJQUYvQyxxQkFBcUI7UUFEMUIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxpQ0FBaUMsRUFBRSxRQUFRLEVBQUUsNEJBQTRCLEVBQUMsQ0FBQztPQUMzRixxQkFBcUIsQ0FHMUI7SUFBRCw0QkFBQztDQUFBLEFBSEQsSUFHQztBQUdEO0lBQUE7SUFHQSxDQUFDO0lBRGdFO1FBQTlELHNCQUFlLENBQUMsdUJBQXVCLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDLENBQUM7a0NBQVUsZ0JBQVM7d0RBQU07SUFGbkYscUJBQXFCO1FBRDFCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsNkJBQTZCLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBQyxDQUFDO09BQ3pFLHFCQUFxQixDQUcxQjtJQUFELDRCQUFDO0NBQUEsQUFIRCxJQUdDO0FBTUQ7SUFBQTtJQUdBLENBQUM7SUFEaUM7UUFBL0Isc0JBQWUsQ0FBQyxhQUFhLENBQUM7a0NBQVUsZ0JBQVM7dURBQWdCO0lBRjlELG9CQUFvQjtRQUp6QixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLHlCQUF5QjtZQUNuQyxRQUFRLEVBQUUsOEVBQThFO1NBQ3pGLENBQUM7T0FDSSxvQkFBb0IsQ0FHekI7SUFBRCwyQkFBQztDQUFBLEFBSEQsSUFHQztBQU1EO0lBQUE7SUFHQSxDQUFDO0lBRDhCO1FBQTVCLG1CQUFZLENBQUMsYUFBYSxDQUFDO2tDQUFVLGdCQUFTO2lEQUFnQjtJQUYzRCxjQUFjO1FBSm5CLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsa0JBQWtCO1lBQzVCLFFBQVEsRUFBRSxrRkFBa0Y7U0FDN0YsQ0FBQztPQUNJLGNBQWMsQ0FHbkI7SUFBRCxxQkFBQztDQUFBLEFBSEQsSUFHQztBQUdEO0lBREE7UUFFRSxTQUFJLEdBQVksS0FBSyxDQUFDO0lBR3hCLENBQUM7SUFEOEI7UUFBNUIsbUJBQVksQ0FBQyxhQUFhLENBQUM7a0NBQVUsZ0JBQVM7bURBQWdCO0lBSDNELGdCQUFnQjtRQURyQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLHFCQUFxQixFQUFFLFFBQVEsRUFBRSxtQ0FBbUMsRUFBQyxDQUFDO09BQ3RGLGdCQUFnQixDQUlyQjtJQUFELHVCQUFDO0NBQUEsQUFKRCxJQUlDO0FBTUQ7SUFKQTtRQUtFLFNBQUksR0FBWSxJQUFJLENBQUM7SUFHdkIsQ0FBQztJQUQ4QjtRQUE1QixtQkFBWSxDQUFDLGFBQWEsQ0FBQztrQ0FBVSxnQkFBUzt5REFBZ0I7SUFIM0Qsc0JBQXNCO1FBSjNCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsNEJBQTRCO1lBQ3RDLFFBQVEsRUFBRSw2REFBNkQ7U0FDeEUsQ0FBQztPQUNJLHNCQUFzQixDQUkzQjtJQUFELDZCQUFDO0NBQUEsQUFKRCxJQUlDO0FBUUQ7SUFOQTtRQVNFLFNBQUksR0FBYSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRjhCO1FBQTVCLG1CQUFZLENBQUMsYUFBYSxDQUFDO2tDQUFVLGdCQUFTO3NEQUFnQjtJQUYzRCxtQkFBbUI7UUFOeEIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSx3QkFBd0I7WUFDbEMsUUFBUSxFQUFFLHNCQUFzQjtnQkFDNUIsZ0RBQWdEO2dCQUNoRCxzQkFBc0I7U0FDM0IsQ0FBQztPQUNJLG1CQUFtQixDQUl4QjtJQUFELDBCQUFDO0NBQUEsQUFKRCxJQUlDO0FBUUQ7SUFOQTtRQVNFLFNBQUksR0FBYSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRjhCO1FBQTVCLG1CQUFZLENBQUMsYUFBYSxDQUFDO2tDQUFVLGdCQUFTO2dFQUFnQjtJQUYzRCw2QkFBNkI7UUFObEMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSwrQkFBK0I7WUFDekMsUUFBUSxFQUFFLCtCQUErQjtnQkFDckMsZ0RBQWdEO2dCQUNoRCw0QkFBNEI7U0FDakMsQ0FBQztPQUNJLDZCQUE2QixDQUlsQztJQUFELG9DQUFDO0NBQUEsQUFKRCxJQUlDO0FBR0Q7SUFLRSxrQkFBbUIsRUFBb0I7UUFBcEIsT0FBRSxHQUFGLEVBQUUsQ0FBa0I7SUFBRyxDQUFDO0lBSGhCO1FBQTFCLG1CQUFZLENBQUMsa0JBQVcsQ0FBQztrQ0FBYyxnQkFBUzsrQ0FBc0I7SUFFekM7UUFBN0Isc0JBQWUsQ0FBQyxrQkFBVyxDQUFDO2tDQUFVLGdCQUFTOzJDQUFzQjtJQUpsRSxRQUFRO1FBRGIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLDhDQUE4QyxFQUFDLENBQUM7eUNBTXBFLHVCQUFnQjtPQUxuQyxRQUFRLENBTWI7SUFBRCxlQUFDO0NBQUEsQUFORCxJQU1DO0FBSUQ7SUFLRSx1QkFBbUIsRUFBb0I7UUFBcEIsT0FBRSxHQUFGLEVBQUUsQ0FBa0I7SUFBRyxDQUFDO0lBSHpCO1FBQWpCLGdCQUFTLENBQUMsS0FBSyxDQUFDO2tDQUFZLGtCQUFXO2tEQUFTO0lBRTVCO1FBQXBCLG1CQUFZLENBQUMsS0FBSyxDQUFDO2tDQUFlLGtCQUFXO3FEQUFTO0lBSm5ELGFBQWE7UUFGbEIsZ0JBQVMsQ0FDTixFQUFDLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsbURBQW1ELEVBQUMsQ0FBQzt5Q0FNeEUsdUJBQWdCO09BTG5DLGFBQWEsQ0FNbEI7SUFBRCxvQkFBQztDQUFBLEFBTkQsSUFNQztBQUdEO0lBQUE7SUFLQSxDQUFDO0lBSDhDO1FBQTVDLHNCQUFlLENBQUMsR0FBRyxFQUFFLEVBQUMsSUFBSSxFQUFFLGFBQWEsRUFBQyxDQUFDO2tDQUFvQixnQkFBUzt5RUFBZ0I7SUFFbEM7UUFBdEQsc0JBQWUsQ0FBQyxhQUFhLEVBQUUsRUFBQyxJQUFJLEVBQUUsYUFBYSxFQUFDLENBQUM7a0NBQW1CLGdCQUFTO3dFQUFnQjtJQUo5Riw0QkFBNEI7UUFEakMsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSw2QkFBNkIsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDLENBQUM7T0FDN0QsNEJBQTRCLENBS2pDO0lBQUQsbUNBQUM7Q0FBQSxBQUxELElBS0M7QUFHRDtJQUFBO0lBS0EsQ0FBQztJQUgyQztRQUF6QyxtQkFBWSxDQUFDLEdBQUcsRUFBRSxFQUFDLElBQUksRUFBRSxhQUFhLEVBQUMsQ0FBQztrQ0FBaUIsYUFBYTttRUFBQztJQUVwQjtRQUFuRCxtQkFBWSxDQUFDLGFBQWEsRUFBRSxFQUFDLElBQUksRUFBRSxhQUFhLEVBQUMsQ0FBQztrQ0FBbUIsYUFBYTtxRUFBQztJQUpoRix5QkFBeUI7UUFEOUIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSwwQkFBMEIsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDLENBQUM7T0FDMUQseUJBQXlCLENBSzlCO0lBQUQsZ0NBQUM7Q0FBQSxBQUxELElBS0M7QUFNRDtJQUFBO0lBR0EsQ0FBQztJQUQ0QjtRQUExQixtQkFBWSxDQUFDLGtCQUFXLENBQUM7a0NBQWdCLGtCQUFXO3FFQUFNO0lBRnZELDRCQUE0QjtRQUpqQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGtDQUFrQztZQUM1QyxRQUFRLEVBQUUsOENBQThDO1NBQ3pELENBQUM7T0FDSSw0QkFBNEIsQ0FHakM7SUFBRCxtQ0FBQztDQUFBLEFBSEQsSUFHQztBQVFEO0lBQUE7SUFDQSxDQUFDO0lBREssK0JBQStCO1FBTnBDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsc0NBQXNDO1lBQ2hELFFBQVEsRUFBRSxvQ0FBb0M7Z0JBQzFDLGtFQUFrRTtnQkFDbEUscUNBQXFDO1NBQzFDLENBQUM7T0FDSSwrQkFBK0IsQ0FDcEM7SUFBRCxzQ0FBQztDQUFBLEFBREQsSUFDQztBQU1EO0lBQUE7SUFLQSxDQUFDO0lBSDZDO1FBQTNDLG1CQUFZLENBQUMsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLGFBQWEsRUFBQyxDQUFDO2tDQUFvQixnQkFBUztzRUFBZ0I7SUFFcEM7UUFBbkQsbUJBQVksQ0FBQyxhQUFhLEVBQUUsRUFBQyxJQUFJLEVBQUUsYUFBYSxFQUFDLENBQUM7a0NBQW1CLGdCQUFTO3FFQUFnQjtJQUozRix5QkFBeUI7UUFKOUIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSwwQkFBMEI7WUFDcEMsUUFBUSxFQUFFLGtEQUFrRDtTQUM3RCxDQUFDO09BQ0kseUJBQXlCLENBSzlCO0lBQUQsZ0NBQUM7Q0FBQSxBQUxELElBS0M7QUFNRDtJQUFBO0lBS0EsQ0FBQztJQUh3QztRQUF0QyxnQkFBUyxDQUFDLEdBQUcsRUFBRSxFQUFDLElBQUksRUFBRSxhQUFhLEVBQUMsQ0FBQztrQ0FBaUIsYUFBYTtnRUFBQztJQUVwQjtRQUFoRCxnQkFBUyxDQUFDLGFBQWEsRUFBRSxFQUFDLElBQUksRUFBRSxhQUFhLEVBQUMsQ0FBQztrQ0FBbUIsYUFBYTtrRUFBQztJQUo3RSxzQkFBc0I7UUFKM0IsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSx1QkFBdUI7WUFDakMsUUFBUSxFQUFFLDBCQUEwQjtTQUNyQyxDQUFDO09BQ0ksc0JBQXNCLENBSzNCO0lBQUQsNkJBQUM7Q0FBQSxBQUxELElBS0M7QUFHRDtJQUFBO0lBU0EsQ0FBQztJQURDLCtDQUFVLEdBQVYsY0FBZSxJQUFJLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFOakI7UUFBekMsZ0JBQVMsQ0FBQyxHQUFHLEVBQUUsRUFBQyxJQUFJLEVBQUUsdUJBQWdCLEVBQUMsQ0FBQztrQ0FBTyx1QkFBZ0I7MERBQUM7SUFFYjtRQUFuRCxnQkFBUyxDQUFDLGFBQWEsRUFBRSxFQUFDLElBQUksRUFBRSx1QkFBZ0IsRUFBQyxDQUFDO2tDQUFtQix1QkFBZ0I7c0VBQUM7SUFFNUQ7UUFBMUIsbUJBQVksQ0FBQyxrQkFBVyxDQUFDO2tDQUFhLGtCQUFXO2dFQUFTO0lBTnZELDBCQUEwQjtRQUQvQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLDBCQUEwQixFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBQyxDQUFDO09BQ3hFLDBCQUEwQixDQVMvQjtJQUFELGlDQUFDO0NBQUEsQUFURCxJQVNDO0FBR0Q7SUFBQTtJQUVBLENBQUM7SUFEMEI7UUFBeEIsc0JBQWUsQ0FBQyxJQUFNLENBQUM7OytEQUFtQjtJQUR2QyxxQkFBcUI7UUFEMUIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSwwQkFBMEIsRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFDLENBQUM7T0FDckUscUJBQXFCLENBRTFCO0lBQUQsNEJBQUM7Q0FBQSxBQUZELElBRUM7QUFHRDtJQURBO1FBRUUsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUM1QixTQUFJLEdBQWEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFISyxPQUFPO1FBRFosZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBQyxDQUFDO09BQ3pDLE9BQU8sQ0FHWjtJQUFELGNBQUM7Q0FBQSxBQUhELElBR0M7QUFHRDtJQUFBO0lBQ0EsQ0FBQztJQURLLGFBQWE7UUFEbEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBQyxDQUFDO09BQ3pDLGFBQWEsQ0FDbEI7SUFBRCxvQkFBQztDQUFBLEFBREQsSUFDQztBQUdEO0lBQUE7SUFlQSxDQUFDO0lBSEMsaUNBQU0sR0FBTixjQUFXLElBQUksQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV2RCxrQ0FBTyxHQUFQLGNBQVksSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFaSDtRQUExQixtQkFBWSxDQUFDLGtCQUFXLENBQUM7a0NBQWEsa0JBQVc7c0RBQU07SUFJeEQ7UUFEQyxnQkFBUyxDQUFDLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSx1QkFBZ0IsRUFBQyxDQUFDO2tDQUNwQyx1QkFBZ0I7Z0RBQUM7SUFJdkI7UUFEQyxzQkFBZSxDQUFDLGFBQWEsQ0FBQztrQ0FDdEIsZ0JBQVM7bURBQWdCO0lBVjlCLGdCQUFnQjtRQURyQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLG1CQUFtQixFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBQyxDQUFDO09BQ2xFLGdCQUFnQixDQWVyQjtJQUFELHVCQUFDO0NBQUEsQUFmRCxJQWVDIn0=