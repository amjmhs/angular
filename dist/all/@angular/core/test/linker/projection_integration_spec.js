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
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
{
    describe('projection', function () {
        beforeEach(function () { return testing_1.TestBed.configureTestingModule({ declarations: [MainComp, OtherComp, Simple] }); });
        it('should support simple components', function () {
            var template = '<simple><div>A</div></simple>';
            testing_1.TestBed.overrideComponent(MainComp, { set: { template: template } });
            var main = testing_1.TestBed.createComponent(MainComp);
            matchers_1.expect(main.nativeElement).toHaveText('SIMPLE(A)');
        });
        it('should support simple components with text interpolation as direct children', function () {
            var template = '{{\'START(\'}}<simple>' +
                '{{text}}' +
                '</simple>{{\')END\'}}';
            testing_1.TestBed.overrideComponent(MainComp, { set: { template: template } });
            var main = testing_1.TestBed.createComponent(MainComp);
            main.componentInstance.text = 'A';
            main.detectChanges();
            matchers_1.expect(main.nativeElement).toHaveText('START(SIMPLE(A))END');
        });
        it('should support projecting text interpolation to a non bound element', function () {
            testing_1.TestBed.overrideComponent(Simple, { set: { template: 'SIMPLE(<div><ng-content></ng-content></div>)' } });
            testing_1.TestBed.overrideComponent(MainComp, { set: { template: '<simple>{{text}}</simple>' } });
            var main = testing_1.TestBed.createComponent(MainComp);
            main.componentInstance.text = 'A';
            main.detectChanges();
            matchers_1.expect(main.nativeElement).toHaveText('SIMPLE(A)');
        });
        it('should support projecting text interpolation to a non bound element with other bound elements after it', function () {
            testing_1.TestBed.overrideComponent(Simple, {
                set: {
                    template: 'SIMPLE(<div><ng-content></ng-content></div><div [tabIndex]="0">EL</div>)'
                }
            });
            testing_1.TestBed.overrideComponent(MainComp, { set: { template: '<simple>{{text}}</simple>' } });
            var main = testing_1.TestBed.createComponent(MainComp);
            main.componentInstance.text = 'A';
            main.detectChanges();
            matchers_1.expect(main.nativeElement).toHaveText('SIMPLE(AEL)');
        });
        it('should project content components', function () {
            testing_1.TestBed.overrideComponent(Simple, { set: { template: 'SIMPLE({{0}}|<ng-content></ng-content>|{{2}})' } });
            testing_1.TestBed.overrideComponent(OtherComp, { set: { template: '{{1}}' } });
            testing_1.TestBed.overrideComponent(MainComp, { set: { template: '<simple><other></other></simple>' } });
            var main = testing_1.TestBed.createComponent(MainComp);
            main.detectChanges();
            matchers_1.expect(main.nativeElement).toHaveText('SIMPLE(0|1|2)');
        });
        it('should not show the light dom even if there is no content tag', function () {
            testing_1.TestBed.configureTestingModule({ declarations: [Empty] });
            testing_1.TestBed.overrideComponent(MainComp, { set: { template: '<empty>A</empty>' } });
            var main = testing_1.TestBed.createComponent(MainComp);
            matchers_1.expect(main.nativeElement).toHaveText('');
        });
        it('should support multiple content tags', function () {
            testing_1.TestBed.configureTestingModule({ declarations: [MultipleContentTagsComponent] });
            testing_1.TestBed.overrideComponent(MainComp, {
                set: {
                    template: '<multiple-content-tags>' +
                        '<div>B</div>' +
                        '<div>C</div>' +
                        '<div class="left">A</div>' +
                        '</multiple-content-tags>'
                }
            });
            var main = testing_1.TestBed.createComponent(MainComp);
            matchers_1.expect(main.nativeElement).toHaveText('(A, BC)');
        });
        it('should redistribute only direct children', function () {
            testing_1.TestBed.configureTestingModule({ declarations: [MultipleContentTagsComponent] });
            testing_1.TestBed.overrideComponent(MainComp, {
                set: {
                    template: '<multiple-content-tags>' +
                        '<div>B<div class="left">A</div></div>' +
                        '<div>C</div>' +
                        '</multiple-content-tags>'
                }
            });
            var main = testing_1.TestBed.createComponent(MainComp);
            matchers_1.expect(main.nativeElement).toHaveText('(, BAC)');
        });
        it('should redistribute direct child viewcontainers when the light dom changes', function () {
            testing_1.TestBed.configureTestingModule({ declarations: [MultipleContentTagsComponent, ManualViewportDirective] });
            testing_1.TestBed.overrideComponent(MainComp, {
                set: {
                    template: '<multiple-content-tags>' +
                        '<ng-template manual class="left"><div>A1</div></ng-template>' +
                        '<div>B</div>' +
                        '</multiple-content-tags>'
                }
            });
            var main = testing_1.TestBed.createComponent(MainComp);
            var viewportDirectives = main.debugElement.children[0]
                .childNodes.filter(by_1.By.directive(ManualViewportDirective))
                .map(function (de) { return de.injector.get(ManualViewportDirective); });
            matchers_1.expect(main.nativeElement).toHaveText('(, B)');
            viewportDirectives.forEach(function (d) { return d.show(); });
            main.detectChanges();
            matchers_1.expect(main.nativeElement).toHaveText('(A1, B)');
            viewportDirectives.forEach(function (d) { return d.hide(); });
            main.detectChanges();
            matchers_1.expect(main.nativeElement).toHaveText('(, B)');
        });
        it('should support nested components', function () {
            testing_1.TestBed.configureTestingModule({ declarations: [OuterWithIndirectNestedComponent] });
            testing_1.TestBed.overrideComponent(MainComp, {
                set: {
                    template: '<outer-with-indirect-nested>' +
                        '<div>A</div>' +
                        '<div>B</div>' +
                        '</outer-with-indirect-nested>'
                }
            });
            var main = testing_1.TestBed.createComponent(MainComp);
            matchers_1.expect(main.nativeElement).toHaveText('OUTER(SIMPLE(AB))');
        });
        it('should support nesting with content being direct child of a nested component', function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [InnerComponent, InnerInnerComponent, OuterComponent, ManualViewportDirective]
            });
            testing_1.TestBed.overrideComponent(MainComp, {
                set: {
                    template: '<outer>' +
                        '<ng-template manual class="left"><div>A</div></ng-template>' +
                        '<div>B</div>' +
                        '<div>C</div>' +
                        '</outer>'
                }
            });
            var main = testing_1.TestBed.createComponent(MainComp);
            var viewportDirective = main.debugElement.queryAllNodes(by_1.By.directive(ManualViewportDirective))[0].injector.get(ManualViewportDirective);
            matchers_1.expect(main.nativeElement).toHaveText('OUTER(INNER(INNERINNER(,BC)))');
            viewportDirective.show();
            matchers_1.expect(main.nativeElement).toHaveText('OUTER(INNER(INNERINNER(A,BC)))');
        });
        it('should redistribute when the shadow dom changes', function () {
            testing_1.TestBed.configureTestingModule({ declarations: [ConditionalContentComponent, ManualViewportDirective] });
            testing_1.TestBed.overrideComponent(MainComp, {
                set: {
                    template: '<conditional-content>' +
                        '<div class="left">A</div>' +
                        '<div>B</div>' +
                        '<div>C</div>' +
                        '</conditional-content>'
                }
            });
            var main = testing_1.TestBed.createComponent(MainComp);
            var viewportDirective = main.debugElement.queryAllNodes(by_1.By.directive(ManualViewportDirective))[0].injector.get(ManualViewportDirective);
            matchers_1.expect(main.nativeElement).toHaveText('(, BC)');
            viewportDirective.show();
            main.detectChanges();
            matchers_1.expect(main.nativeElement).toHaveText('(A, BC)');
            viewportDirective.hide();
            main.detectChanges();
            matchers_1.expect(main.nativeElement).toHaveText('(, BC)');
        });
        // GH-2095 - https://github.com/angular/angular/issues/2095
        // important as we are removing the ng-content element during compilation,
        // which could skrew up text node indices.
        it('should support text nodes after content tags', function () {
            testing_1.TestBed.overrideComponent(MainComp, { set: { template: '<simple stringProp="text"></simple>' } });
            testing_1.TestBed.overrideComponent(Simple, { set: { template: '<ng-content></ng-content><p>P,</p>{{stringProp}}' } });
            var main = testing_1.TestBed.createComponent(MainComp);
            main.detectChanges();
            matchers_1.expect(main.nativeElement).toHaveText('P,text');
        });
        // important as we are moving style tags around during compilation,
        // which could skrew up text node indices.
        it('should support text nodes after style tags', function () {
            testing_1.TestBed.overrideComponent(MainComp, { set: { template: '<simple stringProp="text"></simple>' } });
            testing_1.TestBed.overrideComponent(Simple, { set: { template: '<style></style><p>P,</p>{{stringProp}}' } });
            var main = testing_1.TestBed.createComponent(MainComp);
            main.detectChanges();
            matchers_1.expect(main.nativeElement).toHaveText('P,text');
        });
        it('should support moving non projected light dom around', function () {
            var sourceDirective = undefined;
            var ManualViewportDirective = /** @class */ (function () {
                function ManualViewportDirective(templateRef) {
                    this.templateRef = templateRef;
                    sourceDirective = this;
                }
                ManualViewportDirective = __decorate([
                    core_1.Directive({ selector: '[manual]' }),
                    __metadata("design:paramtypes", [core_1.TemplateRef])
                ], ManualViewportDirective);
                return ManualViewportDirective;
            }());
            testing_1.TestBed.configureTestingModule({ declarations: [Empty, ProjectDirective, ManualViewportDirective] });
            testing_1.TestBed.overrideComponent(MainComp, {
                set: {
                    template: '<empty>' +
                        ' <ng-template manual><div>A</div></ng-template>' +
                        '</empty>' +
                        'START(<div project></div>)END'
                }
            });
            var main = testing_1.TestBed.createComponent(MainComp);
            var projectDirective = main.debugElement.queryAllNodes(by_1.By.directive(ProjectDirective))[0].injector.get(ProjectDirective);
            matchers_1.expect(main.nativeElement).toHaveText('START()END');
            projectDirective.show(sourceDirective.templateRef);
            matchers_1.expect(main.nativeElement).toHaveText('START(A)END');
        });
        it('should support moving projected light dom around', function () {
            testing_1.TestBed.configureTestingModule({ declarations: [Empty, ProjectDirective, ManualViewportDirective] });
            testing_1.TestBed.overrideComponent(MainComp, {
                set: {
                    template: '<simple><ng-template manual><div>A</div></ng-template></simple>' +
                        'START(<div project></div>)END'
                }
            });
            var main = testing_1.TestBed.createComponent(MainComp);
            var sourceDirective = main.debugElement.queryAllNodes(by_1.By.directive(ManualViewportDirective))[0].injector.get(ManualViewportDirective);
            var projectDirective = main.debugElement.queryAllNodes(by_1.By.directive(ProjectDirective))[0].injector.get(ProjectDirective);
            matchers_1.expect(main.nativeElement).toHaveText('SIMPLE()START()END');
            projectDirective.show(sourceDirective.templateRef);
            matchers_1.expect(main.nativeElement).toHaveText('SIMPLE()START(A)END');
        });
        it('should support moving ng-content around', function () {
            testing_1.TestBed.configureTestingModule({ declarations: [ConditionalContentComponent, ProjectDirective, ManualViewportDirective] });
            testing_1.TestBed.overrideComponent(MainComp, {
                set: {
                    template: '<conditional-content>' +
                        '<div class="left">A</div>' +
                        '<div>B</div>' +
                        '</conditional-content>' +
                        'START(<div project></div>)END'
                }
            });
            var main = testing_1.TestBed.createComponent(MainComp);
            var sourceDirective = main.debugElement.queryAllNodes(by_1.By.directive(ManualViewportDirective))[0].injector.get(ManualViewportDirective);
            var projectDirective = main.debugElement.queryAllNodes(by_1.By.directive(ProjectDirective))[0].injector.get(ProjectDirective);
            matchers_1.expect(main.nativeElement).toHaveText('(, B)START()END');
            projectDirective.show(sourceDirective.templateRef);
            matchers_1.expect(main.nativeElement).toHaveText('(, B)START(A)END');
            // Stamping ng-content multiple times should not produce the content multiple
            // times...
            projectDirective.show(sourceDirective.templateRef);
            matchers_1.expect(main.nativeElement).toHaveText('(, B)START(A)END');
        });
        // Note: This does not use a ng-content element, but
        // is still important as we are merging proto views independent of
        // the presence of ng-content elements!
        it('should still allow to implement a recursive trees', function () {
            testing_1.TestBed.configureTestingModule({ declarations: [Tree, ManualViewportDirective] });
            testing_1.TestBed.overrideComponent(MainComp, { set: { template: '<tree></tree>' } });
            var main = testing_1.TestBed.createComponent(MainComp);
            main.detectChanges();
            var manualDirective = main.debugElement.queryAllNodes(by_1.By.directive(ManualViewportDirective))[0].injector.get(ManualViewportDirective);
            matchers_1.expect(main.nativeElement).toHaveText('TREE(0:)');
            manualDirective.show();
            main.detectChanges();
            matchers_1.expect(main.nativeElement).toHaveText('TREE(0:TREE(1:))');
        });
        // Note: This does not use a ng-content element, but
        // is still important as we are merging proto views independent of
        // the presence of ng-content elements!
        it('should still allow to implement a recursive trees via multiple components', function () {
            testing_1.TestBed.configureTestingModule({ declarations: [Tree, Tree2, ManualViewportDirective] });
            testing_1.TestBed.overrideComponent(MainComp, { set: { template: '<tree></tree>' } });
            testing_1.TestBed.overrideComponent(Tree, { set: { template: 'TREE({{depth}}:<tree2 *manual [depth]="depth+1"></tree2>)' } });
            var main = testing_1.TestBed.createComponent(MainComp);
            main.detectChanges();
            matchers_1.expect(main.nativeElement).toHaveText('TREE(0:)');
            var tree = main.debugElement.query(by_1.By.directive(Tree));
            var manualDirective = tree.queryAllNodes(by_1.By.directive(ManualViewportDirective))[0].injector.get(ManualViewportDirective);
            manualDirective.show();
            main.detectChanges();
            matchers_1.expect(main.nativeElement).toHaveText('TREE(0:TREE2(1:))');
            var tree2 = main.debugElement.query(by_1.By.directive(Tree2));
            manualDirective = tree2.queryAllNodes(by_1.By.directive(ManualViewportDirective))[0].injector.get(ManualViewportDirective);
            manualDirective.show();
            main.detectChanges();
            matchers_1.expect(main.nativeElement).toHaveText('TREE(0:TREE2(1:TREE(2:)))');
        });
        if (dom_adapter_1.getDOM().supportsNativeShadowDOM()) {
            it('should support native content projection and isolate styles per component', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [SimpleNative1, SimpleNative2] });
                testing_1.TestBed.overrideComponent(MainComp, {
                    set: {
                        template: '<simple-native1><div>A</div></simple-native1>' +
                            '<simple-native2><div>B</div></simple-native2>'
                    }
                });
                var main = testing_1.TestBed.createComponent(MainComp);
                var childNodes = dom_adapter_1.getDOM().childNodes(main.nativeElement);
                matchers_1.expect(childNodes[0]).toHaveText('div {color: red}SIMPLE1(A)');
                matchers_1.expect(childNodes[1]).toHaveText('div {color: blue}SIMPLE2(B)');
                main.destroy();
            });
        }
        if (dom_adapter_1.getDOM().supportsDOMEvents()) {
            it('should support non emulated styles', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [OtherComp] });
                testing_1.TestBed.overrideComponent(MainComp, {
                    set: {
                        template: '<div class="redStyle"></div>',
                        styles: ['.redStyle { color: red}'],
                        encapsulation: core_1.ViewEncapsulation.None,
                    }
                });
                var main = testing_1.TestBed.createComponent(MainComp);
                var mainEl = main.nativeElement;
                var div1 = dom_adapter_1.getDOM().firstChild(mainEl);
                var div2 = dom_adapter_1.getDOM().createElement('div');
                dom_adapter_1.getDOM().setAttribute(div2, 'class', 'redStyle');
                dom_adapter_1.getDOM().appendChild(mainEl, div2);
                matchers_1.expect(dom_adapter_1.getDOM().getComputedStyle(div1).color).toEqual('rgb(255, 0, 0)');
                matchers_1.expect(dom_adapter_1.getDOM().getComputedStyle(div2).color).toEqual('rgb(255, 0, 0)');
            });
            it('should support emulated style encapsulation', function () {
                testing_1.TestBed.configureTestingModule({ declarations: [OtherComp] });
                testing_1.TestBed.overrideComponent(MainComp, {
                    set: {
                        template: '<div></div>',
                        styles: ['div { color: red}'],
                        encapsulation: core_1.ViewEncapsulation.Emulated,
                    }
                });
                var main = testing_1.TestBed.createComponent(MainComp);
                var mainEl = main.nativeElement;
                var div1 = dom_adapter_1.getDOM().firstChild(mainEl);
                var div2 = dom_adapter_1.getDOM().createElement('div');
                dom_adapter_1.getDOM().appendChild(mainEl, div2);
                matchers_1.expect(dom_adapter_1.getDOM().getComputedStyle(div1).color).toEqual('rgb(255, 0, 0)');
                matchers_1.expect(dom_adapter_1.getDOM().getComputedStyle(div2).color).toEqual('rgb(0, 0, 0)');
            });
        }
        it('should support nested conditionals that contain ng-contents', function () {
            testing_1.TestBed.configureTestingModule({ declarations: [ConditionalTextComponent, ManualViewportDirective] });
            testing_1.TestBed.overrideComponent(MainComp, { set: { template: "<conditional-text>a</conditional-text>" } });
            var main = testing_1.TestBed.createComponent(MainComp);
            matchers_1.expect(main.nativeElement).toHaveText('MAIN()');
            var viewportElement = main.debugElement.queryAllNodes(by_1.By.directive(ManualViewportDirective))[0];
            viewportElement.injector.get(ManualViewportDirective).show();
            matchers_1.expect(main.nativeElement).toHaveText('MAIN(FIRST())');
            viewportElement = main.debugElement.queryAllNodes(by_1.By.directive(ManualViewportDirective))[1];
            viewportElement.injector.get(ManualViewportDirective).show();
            matchers_1.expect(main.nativeElement).toHaveText('MAIN(FIRST(SECOND(a)))');
        });
        it('should allow to switch the order of nested components via ng-content', function () {
            testing_1.TestBed.configureTestingModule({ declarations: [CmpA, CmpB, CmpD, CmpC] });
            testing_1.TestBed.overrideComponent(MainComp, { set: { template: "<cmp-a><cmp-b></cmp-b></cmp-a>" } });
            var main = testing_1.TestBed.createComponent(MainComp);
            main.detectChanges();
            matchers_1.expect(dom_adapter_1.getDOM().getInnerHTML(main.nativeElement))
                .toEqual('<cmp-a><cmp-b><cmp-d><i>cmp-d</i></cmp-d></cmp-b>' +
                '<cmp-c><b>cmp-c</b></cmp-c></cmp-a>');
        });
        it('should create nested components in the right order', function () {
            testing_1.TestBed.configureTestingModule({ declarations: [CmpA1, CmpA2, CmpB11, CmpB12, CmpB21, CmpB22] });
            testing_1.TestBed.overrideComponent(MainComp, { set: { template: "<cmp-a1></cmp-a1><cmp-a2></cmp-a2>" } });
            var main = testing_1.TestBed.createComponent(MainComp);
            main.detectChanges();
            matchers_1.expect(dom_adapter_1.getDOM().getInnerHTML(main.nativeElement))
                .toEqual('<cmp-a1>a1<cmp-b11>b11</cmp-b11><cmp-b12>b12</cmp-b12></cmp-a1>' +
                '<cmp-a2>a2<cmp-b21>b21</cmp-b21><cmp-b22>b22</cmp-b22></cmp-a2>');
        });
        it('should project filled view containers into a view container', function () {
            testing_1.TestBed.configureTestingModule({ declarations: [ConditionalContentComponent, ManualViewportDirective] });
            testing_1.TestBed.overrideComponent(MainComp, {
                set: {
                    template: '<conditional-content>' +
                        '<div class="left">A</div>' +
                        '<ng-template manual class="left">B</ng-template>' +
                        '<div class="left">C</div>' +
                        '<div>D</div>' +
                        '</conditional-content>'
                }
            });
            var main = testing_1.TestBed.createComponent(MainComp);
            var conditionalComp = main.debugElement.query(by_1.By.directive(ConditionalContentComponent));
            var viewViewportDir = conditionalComp.queryAllNodes(by_1.By.directive(ManualViewportDirective))[0].injector.get(ManualViewportDirective);
            matchers_1.expect(main.nativeElement).toHaveText('(, D)');
            matchers_1.expect(main.nativeElement).toHaveText('(, D)');
            viewViewportDir.show();
            main.detectChanges();
            matchers_1.expect(main.nativeElement).toHaveText('(AC, D)');
            var contentViewportDir = conditionalComp.queryAllNodes(by_1.By.directive(ManualViewportDirective))[1].injector.get(ManualViewportDirective);
            contentViewportDir.show();
            main.detectChanges();
            matchers_1.expect(main.nativeElement).toHaveText('(ABC, D)');
            // hide view viewport, and test that it also hides
            // the content viewport's views
            viewViewportDir.hide();
            main.detectChanges();
            matchers_1.expect(main.nativeElement).toHaveText('(, D)');
        });
    });
}
var MainComp = /** @class */ (function () {
    function MainComp() {
        this.text = '';
    }
    MainComp = __decorate([
        core_1.Component({ selector: 'main', template: '' })
    ], MainComp);
    return MainComp;
}());
var OtherComp = /** @class */ (function () {
    function OtherComp() {
        this.text = '';
    }
    OtherComp = __decorate([
        core_1.Component({ selector: 'other', template: '' })
    ], OtherComp);
    return OtherComp;
}());
var Simple = /** @class */ (function () {
    function Simple() {
        this.stringProp = '';
    }
    Simple = __decorate([
        core_1.Component({
            selector: 'simple',
            inputs: ['stringProp'],
            template: 'SIMPLE(<ng-content></ng-content>)',
        })
    ], Simple);
    return Simple;
}());
var SimpleNative1 = /** @class */ (function () {
    function SimpleNative1() {
    }
    SimpleNative1 = __decorate([
        core_1.Component({
            selector: 'simple-native1',
            template: 'SIMPLE1(<content></content>)',
            encapsulation: core_1.ViewEncapsulation.Native,
            styles: ['div {color: red}']
        })
    ], SimpleNative1);
    return SimpleNative1;
}());
var SimpleNative2 = /** @class */ (function () {
    function SimpleNative2() {
    }
    SimpleNative2 = __decorate([
        core_1.Component({
            selector: 'simple-native2',
            template: 'SIMPLE2(<content></content>)',
            encapsulation: core_1.ViewEncapsulation.Native,
            styles: ['div {color: blue}']
        })
    ], SimpleNative2);
    return SimpleNative2;
}());
var Empty = /** @class */ (function () {
    function Empty() {
    }
    Empty = __decorate([
        core_1.Component({ selector: 'empty', template: '' })
    ], Empty);
    return Empty;
}());
var MultipleContentTagsComponent = /** @class */ (function () {
    function MultipleContentTagsComponent() {
    }
    MultipleContentTagsComponent = __decorate([
        core_1.Component({
            selector: 'multiple-content-tags',
            template: '(<ng-content SELECT=".left"></ng-content>, <ng-content></ng-content>)',
        })
    ], MultipleContentTagsComponent);
    return MultipleContentTagsComponent;
}());
var ManualViewportDirective = /** @class */ (function () {
    function ManualViewportDirective(vc, templateRef) {
        this.vc = vc;
        this.templateRef = templateRef;
    }
    ManualViewportDirective.prototype.show = function () { this.vc.createEmbeddedView(this.templateRef); };
    ManualViewportDirective.prototype.hide = function () { this.vc.clear(); };
    ManualViewportDirective = __decorate([
        core_1.Directive({ selector: '[manual]' }),
        __metadata("design:paramtypes", [core_1.ViewContainerRef, core_1.TemplateRef])
    ], ManualViewportDirective);
    return ManualViewportDirective;
}());
var ProjectDirective = /** @class */ (function () {
    function ProjectDirective(vc) {
        this.vc = vc;
    }
    ProjectDirective.prototype.show = function (templateRef) { this.vc.createEmbeddedView(templateRef); };
    ProjectDirective.prototype.hide = function () { this.vc.clear(); };
    ProjectDirective = __decorate([
        core_1.Directive({ selector: '[project]' }),
        __metadata("design:paramtypes", [core_1.ViewContainerRef])
    ], ProjectDirective);
    return ProjectDirective;
}());
var OuterWithIndirectNestedComponent = /** @class */ (function () {
    function OuterWithIndirectNestedComponent() {
    }
    OuterWithIndirectNestedComponent = __decorate([
        core_1.Component({
            selector: 'outer-with-indirect-nested',
            template: 'OUTER(<simple><div><ng-content></ng-content></div></simple>)',
        })
    ], OuterWithIndirectNestedComponent);
    return OuterWithIndirectNestedComponent;
}());
var OuterComponent = /** @class */ (function () {
    function OuterComponent() {
    }
    OuterComponent = __decorate([
        core_1.Component({
            selector: 'outer',
            template: 'OUTER(<inner><ng-content select=".left" class="left"></ng-content><ng-content></ng-content></inner>)',
        })
    ], OuterComponent);
    return OuterComponent;
}());
var InnerComponent = /** @class */ (function () {
    function InnerComponent() {
    }
    InnerComponent = __decorate([
        core_1.Component({
            selector: 'inner',
            template: 'INNER(<innerinner><ng-content select=".left" class="left"></ng-content><ng-content></ng-content></innerinner>)',
        })
    ], InnerComponent);
    return InnerComponent;
}());
var InnerInnerComponent = /** @class */ (function () {
    function InnerInnerComponent() {
    }
    InnerInnerComponent = __decorate([
        core_1.Component({
            selector: 'innerinner',
            template: 'INNERINNER(<ng-content select=".left"></ng-content>,<ng-content></ng-content>)',
        })
    ], InnerInnerComponent);
    return InnerInnerComponent;
}());
var ConditionalContentComponent = /** @class */ (function () {
    function ConditionalContentComponent() {
    }
    ConditionalContentComponent = __decorate([
        core_1.Component({
            selector: 'conditional-content',
            template: '<div>(<div *manual><ng-content select=".left"></ng-content></div>, <ng-content></ng-content>)</div>',
        })
    ], ConditionalContentComponent);
    return ConditionalContentComponent;
}());
var ConditionalTextComponent = /** @class */ (function () {
    function ConditionalTextComponent() {
    }
    ConditionalTextComponent = __decorate([
        core_1.Component({
            selector: 'conditional-text',
            template: 'MAIN(<ng-template manual>FIRST(<ng-template manual>SECOND(<ng-content></ng-content>)</ng-template>)</ng-template>)',
        })
    ], ConditionalTextComponent);
    return ConditionalTextComponent;
}());
var Tab = /** @class */ (function () {
    function Tab() {
    }
    Tab = __decorate([
        core_1.Component({
            selector: 'tab',
            template: '<div><div *manual>TAB(<ng-content></ng-content>)</div></div>',
        })
    ], Tab);
    return Tab;
}());
var Tree2 = /** @class */ (function () {
    function Tree2() {
        this.depth = 0;
    }
    Tree2 = __decorate([
        core_1.Component({
            selector: 'tree2',
            inputs: ['depth'],
            template: 'TREE2({{depth}}:<tree *manual [depth]="depth+1"></tree>)',
        })
    ], Tree2);
    return Tree2;
}());
var Tree = /** @class */ (function () {
    function Tree() {
        this.depth = 0;
    }
    Tree = __decorate([
        core_1.Component({
            selector: 'tree',
            inputs: ['depth'],
            template: 'TREE({{depth}}:<tree *manual [depth]="depth+1"></tree>)',
        })
    ], Tree);
    return Tree;
}());
var CmpD = /** @class */ (function () {
    function CmpD(elementRef) {
        this.tagName = dom_adapter_1.getDOM().tagName(elementRef.nativeElement).toLowerCase();
    }
    CmpD = __decorate([
        core_1.Component({ selector: 'cmp-d', template: "<i>{{tagName}}</i>" }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], CmpD);
    return CmpD;
}());
var CmpC = /** @class */ (function () {
    function CmpC(elementRef) {
        this.tagName = dom_adapter_1.getDOM().tagName(elementRef.nativeElement).toLowerCase();
    }
    CmpC = __decorate([
        core_1.Component({ selector: 'cmp-c', template: "<b>{{tagName}}</b>" }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], CmpC);
    return CmpC;
}());
var CmpB = /** @class */ (function () {
    function CmpB() {
    }
    CmpB = __decorate([
        core_1.Component({ selector: 'cmp-b', template: "<ng-content></ng-content><cmp-d></cmp-d>" })
    ], CmpB);
    return CmpB;
}());
var CmpA = /** @class */ (function () {
    function CmpA() {
    }
    CmpA = __decorate([
        core_1.Component({ selector: 'cmp-a', template: "<ng-content></ng-content><cmp-c></cmp-c>" })
    ], CmpA);
    return CmpA;
}());
var CmpB11 = /** @class */ (function () {
    function CmpB11() {
    }
    CmpB11 = __decorate([
        core_1.Component({ selector: 'cmp-b11', template: "{{'b11'}}" })
    ], CmpB11);
    return CmpB11;
}());
var CmpB12 = /** @class */ (function () {
    function CmpB12() {
    }
    CmpB12 = __decorate([
        core_1.Component({ selector: 'cmp-b12', template: "{{'b12'}}" })
    ], CmpB12);
    return CmpB12;
}());
var CmpB21 = /** @class */ (function () {
    function CmpB21() {
    }
    CmpB21 = __decorate([
        core_1.Component({ selector: 'cmp-b21', template: "{{'b21'}}" })
    ], CmpB21);
    return CmpB21;
}());
var CmpB22 = /** @class */ (function () {
    function CmpB22() {
    }
    CmpB22 = __decorate([
        core_1.Component({ selector: 'cmp-b22', template: "{{'b22'}}" })
    ], CmpB22);
    return CmpB22;
}());
var CmpA1 = /** @class */ (function () {
    function CmpA1() {
    }
    CmpA1 = __decorate([
        core_1.Component({
            selector: 'cmp-a1',
            template: "{{'a1'}}<cmp-b11></cmp-b11><cmp-b12></cmp-b12>",
        })
    ], CmpA1);
    return CmpA1;
}());
var CmpA2 = /** @class */ (function () {
    function CmpA2() {
    }
    CmpA2 = __decorate([
        core_1.Component({
            selector: 'cmp-a2',
            template: "{{'a2'}}<cmp-b21></cmp-b21><cmp-b22></cmp-b22>",
        })
    ], CmpA2);
    return CmpA2;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdGlvbl9pbnRlZ3JhdGlvbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2xpbmtlci9wcm9qZWN0aW9uX2ludGVncmF0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBaUg7QUFDakgsaURBQThDO0FBQzlDLGlFQUE4RDtBQUM5RCw2RUFBcUU7QUFDckUsMkVBQXNFO0FBRXRFO0lBQ0UsUUFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixVQUFVLENBQUMsY0FBTSxPQUFBLGlCQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxFQUFDLENBQUMsRUFBN0UsQ0FBNkUsQ0FBQyxDQUFDO1FBRWhHLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRTtZQUNyQyxJQUFNLFFBQVEsR0FBRywrQkFBK0IsQ0FBQztZQUNqRCxpQkFBTyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxFQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsVUFBQSxFQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQ3ZELElBQU0sSUFBSSxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRS9DLGlCQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw2RUFBNkUsRUFBRTtZQUNoRixJQUFNLFFBQVEsR0FBRyx3QkFBd0I7Z0JBQ3JDLFVBQVU7Z0JBQ1YsdUJBQXVCLENBQUM7WUFDNUIsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLFVBQUEsRUFBQyxFQUFDLENBQUMsQ0FB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