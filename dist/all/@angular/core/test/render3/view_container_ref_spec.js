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
var core_1 = require("../../src/core");
var di_1 = require("../../src/render3/di");
var index_1 = require("../../src/render3/index");
var instructions_1 = require("../../src/render3/instructions");
var ng_module_ref_1 = require("../../src/render3/ng_module_ref");
var pipe_1 = require("../../src/render3/pipe");
var imported_renderer2_1 = require("./imported_renderer2");
var render_util_1 = require("./render_util");
describe('ViewContainerRef', function () {
    var directiveInstance;
    beforeEach(function () { directiveInstance = null; });
    var DirectiveWithVCRef = /** @class */ (function () {
        // injecting a ViewContainerRef to create a dynamic container in which embedded views will be
        // created
        function DirectiveWithVCRef(vcref, cfr) {
            this.vcref = vcref;
            this.cfr = cfr;
        }
        DirectiveWithVCRef.ngDirectiveDef = index_1.defineDirective({
            type: DirectiveWithVCRef,
            selectors: [['', 'vcref', '']],
            factory: function () { return directiveInstance = new DirectiveWithVCRef(index_1.injectViewContainerRef(), index_1.injectComponentFactoryResolver()); },
            inputs: { tplRef: 'tplRef' }
        });
        return DirectiveWithVCRef;
    }());
    describe('API', function () {
        function embeddedTemplate(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.text(0);
            }
            if (rf & 2 /* Update */) {
                instructions_1.textBinding(0, instructions_1.bind(ctx.name));
            }
        }
        function createView(s, index) {
            return directiveInstance.vcref.createEmbeddedView(directiveInstance.tplRef, { name: s }, index);
        }
        /**
         * <ng-template #foo>
         *   {{name}}
         * </ng-template>
         * <p vcref="" [tplRef]="foo">
         * </p>
         */
        function createTemplate() {
            instructions_1.container(0, embeddedTemplate);
            instructions_1.elementStart(1, 'p', ['vcref', '']);
            instructions_1.elementEnd();
        }
        function updateTemplate() {
            var tplRef = di_1.getOrCreateTemplateRef(di_1.getOrCreateNodeInjectorForNode(instructions_1.load(0)));
            instructions_1.elementProperty(1, 'tplRef', instructions_1.bind(tplRef));
        }
        describe('createEmbeddedView (incl. insert)', function () {
            it('should work on elements', function () {
                function createTemplate() {
                    instructions_1.container(0, embeddedTemplate);
                    instructions_1.elementStart(1, 'header', ['vcref', '']);
                    instructions_1.elementEnd();
                    instructions_1.elementStart(2, 'footer');
                    instructions_1.elementEnd();
                }
                var fixture = new render_util_1.TemplateFixture(createTemplate, updateTemplate, [DirectiveWithVCRef]);
                expect(fixture.html).toEqual('<header vcref=""></header><footer></footer>');
                createView('A');
                fixture.update();
                expect(fixture.html).toEqual('<header vcref=""></header>A<footer></footer>');
                createView('B');
                createView('C');
                fixture.update();
                expect(fixture.html).toEqual('<header vcref=""></header>ABC<footer></footer>');
                createView('Y', 0);
                fixture.update();
                expect(fixture.html).toEqual('<header vcref=""></header>YABC<footer></footer>');
                expect(function () { createView('Z', -1); }).toThrow();
                expect(function () { createView('Z', 5); }).toThrow();
            });
            it('should work on components', function () {
                var HeaderComponent = render_util_1.createComponent('header-cmp', function (rf, ctx) { });
                function createTemplate() {
                    instructions_1.container(0, embeddedTemplate);
                    instructions_1.elementStart(1, 'header-cmp', ['vcref', '']);
                    instructions_1.elementEnd();
                    instructions_1.elementStart(2, 'footer');
                    instructions_1.elementEnd();
                }
                var fixture = new render_util_1.TemplateFixture(createTemplate, updateTemplate, [HeaderComponent, DirectiveWithVCRef]);
                expect(fixture.html).toEqual('<header-cmp vcref=""></header-cmp><footer></footer>');
                createView('A');
                fixture.update();
                expect(fixture.html).toEqual('<header-cmp vcref=""></header-cmp>A<footer></footer>');
                createView('B');
                createView('C');
                fixture.update();
                expect(fixture.html).toEqual('<header-cmp vcref=""></header-cmp>ABC<footer></footer>');
                createView('Y', 0);
                fixture.update();
                expect(fixture.html).toEqual('<header-cmp vcref=""></header-cmp>YABC<footer></footer>');
                expect(function () { createView('Z', -1); }).toThrow();
                expect(function () { createView('Z', 5); }).toThrow();
            });
            it('should work with multiple instances with vcrefs', function () {
                var firstDir;
                var secondDir;
                function createTemplate() {
                    instructions_1.container(0, embeddedTemplate);
                    instructions_1.elementStart(1, 'div', ['vcref', '']);
                    instructions_1.elementEnd();
                    instructions_1.elementStart(2, 'div', ['vcref', '']);
                    instructions_1.elementEnd();
                    // for testing only:
                    firstDir = instructions_1.loadDirective(0);
                    secondDir = instructions_1.loadDirective(1);
                }
                function update() {
                    // Hack until we can create local refs to templates
                    var tplRef = di_1.getOrCreateTemplateRef(di_1.getOrCreateNodeInjectorForNode(instructions_1.load(0)));
                    instructions_1.elementProperty(1, 'tplRef', instructions_1.bind(tplRef));
                    instructions_1.elementProperty(2, 'tplRef', instructions_1.bind(tplRef));
                }
                var fixture = new render_util_1.TemplateFixture(createTemplate, update, [DirectiveWithVCRef]);
                expect(fixture.html).toEqual('<div vcref=""></div><div vcref=""></div>');
                firstDir.vcref.createEmbeddedView(firstDir.tplRef, { name: 'A' });
                secondDir.vcref.createEmbeddedView(secondDir.tplRef, { name: 'B' });
                fixture.update();
                expect(fixture.html).toEqual('<div vcref=""></div>A<div vcref=""></div>B');
            });
            it('should work on containers', function () {
                function createTemplate() {
                    instructions_1.container(0, embeddedTemplate, undefined, ['vcref', '']);
                    instructions_1.elementStart(1, 'footer');
                    instructions_1.elementEnd();
                }
                function updateTemplate() {
                    var tplRef = di_1.getOrCreateTemplateRef(di_1.getOrCreateNodeInjectorForNode(instructions_1.load(0)));
                    instructions_1.elementProperty(0, 'tplRef', instructions_1.bind(tplRef));
                    instructions_1.containerRefreshStart(0);
                    instructions_1.containerRefreshEnd();
                }
                var fixture = new render_util_1.TemplateFixture(createTemplate, updateTemplate, [DirectiveWithVCRef]);
                expect(fixture.html).toEqual('<footer></footer>');
                createView('A');
                fixture.update();
                expect(fixture.html).toEqual('A<footer></footer>');
                createView('B');
                createView('C');
                fixture.update();
                expect(fixture.html).toEqual('ABC<footer></footer>');
                createView('Y', 0);
                fixture.update();
                expect(fixture.html).toEqual('YABC<footer></footer>');
                expect(function () { createView('Z', -1); }).toThrow();
                expect(function () { createView('Z', 5); }).toThrow();
            });
            it('should add embedded views at the right position in the DOM tree (ng-template next to other ng-template)', function () {
                var directiveInstances = [];
                var TestDirective = /** @class */ (function () {
                    function TestDirective(_vcRef, _tplRef) {
                        this._vcRef = _vcRef;
                        this._tplRef = _tplRef;
                    }
                    TestDirective.prototype.insertTpl = function (ctx) { this._vcRef.createEmbeddedView(this._tplRef, ctx); };
                    TestDirective.prototype.remove = function (index) { this._vcRef.remove(index); };
                    TestDirective.ngDirectiveDef = index_1.defineDirective({
                        type: TestDirective,
                        selectors: [['', 'testdir', '']],
                        factory: function () {
                            var instance = new TestDirective(index_1.injectViewContainerRef(), index_1.injectTemplateRef());
                            directiveInstances.push(instance);
                            return instance;
                        }
                    });
                    return TestDirective;
                }());
                function EmbeddedTemplateA(rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.text(0, 'A');
                    }
                }
                function EmbeddedTemplateB(rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.text(0, 'B');
                    }
                }
                /**
                 * before|
                 * <ng-template directive>A<ng-template>
                 * <ng-template directive>B<ng-template>
                 * |after
                 */
                var TestComponent = /** @class */ (function () {
                    function TestComponent() {
                    }
                    TestComponent.ngComponentDef = index_1.defineComponent({
                        type: TestComponent,
                        selectors: [['test-cmp']],
                        factory: function () { return new TestComponent(); },
                        template: function (rf, cmp) {
                            if (rf & 1 /* Create */) {
                                instructions_1.text(0, 'before|');
                                instructions_1.container(1, EmbeddedTemplateA, undefined, ['testdir', '']);
                                instructions_1.container(2, EmbeddedTemplateB, undefined, ['testdir', '']);
                                instructions_1.text(3, '|after');
                            }
                        },
                        directives: [TestDirective]
                    });
                    return TestComponent;
                }());
                var fixture = new render_util_1.ComponentFixture(TestComponent);
                expect(fixture.html).toEqual('before||after');
                directiveInstances[1].insertTpl({});
                expect(fixture.html).toEqual('before|B|after');
                directiveInstances[0].insertTpl({});
                expect(fixture.html).toEqual('before|AB|after');
            });
            it('should add embedded views at the right position in the DOM tree (ng-template next to a JS block)', function () {
                var directiveInstance;
                var TestDirective = /** @class */ (function () {
                    function TestDirective(_vcRef, _tplRef) {
                        this._vcRef = _vcRef;
                        this._tplRef = _tplRef;
                    }
                    TestDirective.prototype.insertTpl = function (ctx) { this._vcRef.createEmbeddedView(this._tplRef, ctx); };
                    TestDirective.prototype.insertTpl2 = function (ctx) {
                        var viewRef = this._tplRef.createEmbeddedView(ctx);
                        this._vcRef.insert(viewRef);
                    };
                    TestDirective.prototype.remove = function (index) { this._vcRef.remove(index); };
                    TestDirective.ngDirectiveDef = index_1.defineDirective({
                        type: TestDirective,
                        selectors: [['', 'testdir', '']],
                        factory: function () { return directiveInstance =
                            new TestDirective(index_1.injectViewContainerRef(), index_1.injectTemplateRef()); }
                    });
                    return TestDirective;
                }());
                function EmbeddedTemplateA(rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.text(0, 'A');
                    }
                }
                /**
                 * before|
                 * <ng-template testDir>A<ng-template>
                 * % if (condition) {
                 *  B
                 * % }
                 * |after
                 */
                var TestComponent = /** @class */ (function () {
                    function TestComponent() {
                        this.condition = false;
                    }
                    TestComponent.ngComponentDef = index_1.defineComponent({
                        type: TestComponent,
                        selectors: [['test-cmp']],
                        factory: function () { return new TestComponent(); },
                        template: function (rf, cmp) {
                            if (rf & 1 /* Create */) {
                                instructions_1.text(0, 'before|');
                                instructions_1.container(1, EmbeddedTemplateA, undefined, ['testdir', '']);
                                instructions_1.container(2);
                                instructions_1.text(3, '|after');
                            }
                            if (rf & 2 /* Update */) {
                                instructions_1.containerRefreshStart(2);
                                {
                                    if (cmp.condition) {
                                        var rf1 = instructions_1.embeddedViewStart(0);
                                        {
                                            if (rf1 & 1 /* Create */) {
                                                instructions_1.text(0, 'B');
                                            }
                                        }
                                        instructions_1.embeddedViewEnd();
                                    }
                                }
                                instructions_1.containerRefreshEnd();
                            }
                        },
                        directives: [TestDirective]
                    });
                    return TestComponent;
                }());
                var fixture = new render_util_1.ComponentFixture(TestComponent);
                expect(fixture.html).toEqual('before||after');
                fixture.component.condition = true;
                fixture.update();
                expect(fixture.html).toEqual('before|B|after');
                directiveInstance.insertTpl({});
                expect(fixture.html).toEqual('before|AB|after');
                fixture.component.condition = false;
                fixture.update();
                expect(fixture.html).toEqual('before|A|after');
                directiveInstance.insertTpl2({});
                expect(fixture.html).toEqual('before|AA|after');
                fixture.component.condition = true;
                fixture.update();
                expect(fixture.html).toEqual('before|AAB|after');
            });
            it('should apply directives and pipes of the host view to the TemplateRef', function () {
                var Child = /** @class */ (function () {
                    function Child() {
                    }
                    Child_1 = Child;
                    var Child_1;
                    Child.ngComponentDef = index_1.defineComponent({
                        type: Child_1,
                        selectors: [['child']],
                        factory: function () { return new Child_1(); },
                        template: function (rf, cmp) {
                            if (rf & 1 /* Create */) {
                                instructions_1.text(0);
                            }
                            if (rf & 2 /* Update */) {
                                instructions_1.textBinding(0, instructions_1.interpolation1('', cmp.name, ''));
                            }
                        },
                        inputs: { name: 'name' }
                    });
                    Child = Child_1 = __decorate([
                        core_1.Component({ selector: 'child', template: "{{name}}" })
                    ], Child);
                    return Child;
                }());
                var StarPipe = /** @class */ (function () {
                    function StarPipe() {
                    }
                    StarPipe_1 = StarPipe;
                    StarPipe.prototype.transform = function (value) { return "**" + value + "**"; };
                    var StarPipe_1;
                    StarPipe.ngPipeDef = index_1.definePipe({
                        name: 'starPipe',
                        type: StarPipe_1,
                        factory: function StarPipe_Factory() { return new StarPipe_1(); },
                    });
                    StarPipe = StarPipe_1 = __decorate([
                        core_1.Pipe({ name: 'starPipe' })
                    ], StarPipe);
                    return StarPipe;
                }());
                var SomeComponent = /** @class */ (function () {
                    function SomeComponent() {
                    }
                    SomeComponent_1 = SomeComponent;
                    var SomeComponent_1;
                    SomeComponent.ngComponentDef = index_1.defineComponent({
                        type: SomeComponent_1,
                        selectors: [['some-comp']],
                        factory: function () { return new SomeComponent_1(); },
                        template: function (rf, cmp) {
                            if (rf & 1 /* Create */) {
                                instructions_1.container(0, function (rf, ctx) {
                                    if (rf & 1 /* Create */) {
                                        instructions_1.elementStart(0, 'child');
                                        instructions_1.elementEnd();
                                        pipe_1.pipe(1, 'starPipe');
                                        instructions_1.reserveSlots(2);
                                    }
                                    if (rf & 2 /* Update */) {
                                        instructions_1.elementProperty(0, 'name', instructions_1.bind(pipe_1.pipeBind1(1, 2, 'C')));
                                    }
                                });
                                pipe_1.pipe(1, 'starPipe');
                                instructions_1.elementStart(2, 'child', ['vcref', '']);
                                instructions_1.elementEnd();
                                pipe_1.pipe(3, 'starPipe');
                                instructions_1.elementStart(4, 'child');
                                instructions_1.elementEnd();
                                instructions_1.reserveSlots(4);
                            }
                            if (rf & 2 /* Update */) {
                                var tplRef = di_1.getOrCreateTemplateRef(di_1.getOrCreateNodeInjectorForNode(instructions_1.load(0)));
                                instructions_1.elementProperty(2, 'tplRef', instructions_1.bind(tplRef));
                                instructions_1.elementProperty(2, 'name', instructions_1.bind(pipe_1.pipeBind1(1, 2, 'A')));
                                instructions_1.elementProperty(4, 'name', instructions_1.bind(pipe_1.pipeBind1(1, 4, 'B')));
                            }
                        },
                        directives: [Child, DirectiveWithVCRef],
                        pipes: [StarPipe]
                    });
                    SomeComponent = SomeComponent_1 = __decorate([
                        core_1.Component({
                            template: "\n            <ng-template #foo>\n              <child [name]=\"'C' | starPipe\"></child>\n            </ng-template>\n            <child vcref [tplRef]=\"foo\" [name]=\"'A' | starPipe\"></child>\n            <child [name]=\"'B' | starPipe\"></child>\n          "
                        })
                    ], SomeComponent);
                    return SomeComponent;
                }());
                var fixture = new render_util_1.ComponentFixture(SomeComponent);
                directiveInstance.vcref.createEmbeddedView(directiveInstance.tplRef, fixture.component);
                directiveInstance.vcref.createEmbeddedView(directiveInstance.tplRef, fixture.component);
                fixture.update();
                expect(fixture.html)
                    .toEqual('<child vcref="">**A**</child><child>**C**</child><child>**C**</child><child>**B**</child>');
            });
        });
        var rendererFactory = imported_renderer2_1.getRendererFactory2(document);
        describe('detach', function () {
            it('should detach the right embedded view when an index is specified', function () {
                var fixture = new render_util_1.TemplateFixture(createTemplate, updateTemplate, [DirectiveWithVCRef], null, null, rendererFactory);
                var viewA = createView('A');
                createView('B');
                createView('C');
                var viewD = createView('D');
                createView('E');
                fixture.update();
                expect(fixture.html).toEqual('<p vcref=""></p>ABCDE');
                directiveInstance.vcref.detach(3);
                fixture.update();
                expect(fixture.html).toEqual('<p vcref=""></p>ABCE');
                expect(viewD.destroyed).toBeFalsy();
                directiveInstance.vcref.detach(0);
                fixture.update();
                expect(fixture.html).toEqual('<p vcref=""></p>BCE');
                expect(viewA.destroyed).toBeFalsy();
                expect(function () { directiveInstance.vcref.detach(-1); }).toThrow();
                expect(function () { directiveInstance.vcref.detach(42); }).toThrow();
                expect(ngDevMode).toHaveProperties({ rendererDestroyNode: 0 });
            });
            it('should detach the last embedded view when no index is specified', function () {
                var fixture = new render_util_1.TemplateFixture(createTemplate, updateTemplate, [DirectiveWithVCRef], null, null, rendererFactory);
                createView('A');
                createView('B');
                createView('C');
                createView('D');
                var viewE = createView('E');
                fixture.update();
                expect(fixture.html).toEqual('<p vcref=""></p>ABCDE');
                directiveInstance.vcref.detach();
                fixture.update();
                expect(fixture.html).toEqual('<p vcref=""></p>ABCD');
                expect(viewE.destroyed).toBeFalsy();
                expect(ngDevMode).toHaveProperties({ rendererDestroyNode: 0 });
            });
        });
        describe('remove', function () {
            it('should remove the right embedded view when an index is specified', function () {
                var fixture = new render_util_1.TemplateFixture(createTemplate, updateTemplate, [DirectiveWithVCRef], null, null, rendererFactory);
                var viewA = createView('A');
                createView('B');
                createView('C');
                var viewD = createView('D');
                createView('E');
                fixture.update();
                expect(fixture.html).toEqual('<p vcref=""></p>ABCDE');
                directiveInstance.vcref.remove(3);
                fixture.update();
                expect(fixture.html).toEqual('<p vcref=""></p>ABCE');
                expect(viewD.destroyed).toBeTruthy();
                directiveInstance.vcref.remove(0);
                fixture.update();
                expect(fixture.html).toEqual('<p vcref=""></p>BCE');
                expect(viewA.destroyed).toBeTruthy();
                expect(function () { directiveInstance.vcref.remove(-1); }).toThrow();
                expect(function () { directiveInstance.vcref.remove(42); }).toThrow();
                expect(ngDevMode).toHaveProperties({ rendererDestroyNode: 2 });
            });
            it('should remove the last embedded view when no index is specified', function () {
                var fixture = new render_util_1.TemplateFixture(createTemplate, updateTemplate, [DirectiveWithVCRef], null, null, rendererFactory);
                createView('A');
                createView('B');
                createView('C');
                createView('D');
                var viewE = createView('E');
                fixture.update();
                expect(fixture.html).toEqual('<p vcref=""></p>ABCDE');
                directiveInstance.vcref.remove();
                fixture.update();
                expect(fixture.html).toEqual('<p vcref=""></p>ABCD');
                expect(viewE.destroyed).toBeTruthy();
                expect(ngDevMode).toHaveProperties({ rendererDestroyNode: 1 });
            });
            it('should throw when trying to insert a removed or destroyed view', function () {
                var fixture = new render_util_1.TemplateFixture(createTemplate, updateTemplate, [DirectiveWithVCRef], null, null, rendererFactory);
                var viewA = createView('A');
                var viewB = createView('B');
                fixture.update();
                directiveInstance.vcref.remove();
                fixture.update();
                expect(function () { return directiveInstance.vcref.insert(viewB); }).toThrow();
                viewA.destroy();
                fixture.update();
                expect(function () { return directiveInstance.vcref.insert(viewA); }).toThrow();
            });
        });
        describe('length', function () {
            it('should return the number of embedded views', function () {
                var fixture = new render_util_1.TemplateFixture(createTemplate, updateTemplate, [DirectiveWithVCRef]);
                expect(directiveInstance.vcref.length).toEqual(0);
                createView('A');
                createView('B');
                createView('C');
                fixture.update();
                expect(directiveInstance.vcref.length).toEqual(3);
                directiveInstance.vcref.detach(1);
                fixture.update();
                expect(directiveInstance.vcref.length).toEqual(2);
                directiveInstance.vcref.clear();
                fixture.update();
                expect(directiveInstance.vcref.length).toEqual(0);
            });
        });
        describe('get and indexOf', function () {
            it('should retrieve a ViewRef from its index, and vice versa', function () {
                var fixture = new render_util_1.TemplateFixture(createTemplate, updateTemplate, [DirectiveWithVCRef]);
                createView('A');
                createView('B');
                createView('C');
                fixture.update();
                var viewRef = directiveInstance.vcref.get(0);
                expect(directiveInstance.vcref.indexOf(viewRef)).toEqual(0);
                viewRef = directiveInstance.vcref.get(1);
                expect(directiveInstance.vcref.indexOf(viewRef)).toEqual(1);
                viewRef = directiveInstance.vcref.get(2);
                expect(directiveInstance.vcref.indexOf(viewRef)).toEqual(2);
            });
            it('should handle out of bounds cases', function () {
                var fixture = new render_util_1.TemplateFixture(createTemplate, updateTemplate, [DirectiveWithVCRef]);
                createView('A');
                fixture.update();
                expect(directiveInstance.vcref.get(-1)).toBeNull();
                expect(directiveInstance.vcref.get(42)).toBeNull();
                var viewRef = directiveInstance.vcref.get(0);
                directiveInstance.vcref.remove(0);
                expect(directiveInstance.vcref.indexOf(viewRef)).toEqual(-1);
            });
        });
        describe('move', function () {
            it('should move embedded views and associated DOM nodes without recreating them', function () {
                var fixture = new render_util_1.TemplateFixture(createTemplate, updateTemplate, [DirectiveWithVCRef]);
                createView('A');
                createView('B');
                createView('C');
                fixture.update();
                expect(fixture.html).toEqual('<p vcref=""></p>ABC');
                // The DOM is manually modified here to ensure that the text node is actually moved
                fixture.hostElement.childNodes[2].nodeValue = '**A**';
                expect(fixture.html).toEqual('<p vcref=""></p>**A**BC');
                var viewRef = directiveInstance.vcref.get(0);
                directiveInstance.vcref.move(viewRef, 2);
                fixture.update();
                expect(fixture.html).toEqual('<p vcref=""></p>BC**A**');
                directiveInstance.vcref.move(viewRef, 0);
                fixture.update();
                expect(fixture.html).toEqual('<p vcref=""></p>**A**BC');
                directiveInstance.vcref.move(viewRef, 1);
                fixture.update();
                expect(fixture.html).toEqual('<p vcref=""></p>B**A**C');
                expect(function () { directiveInstance.vcref.move(viewRef, -1); }).toThrow();
                expect(function () { directiveInstance.vcref.move(viewRef, 42); }).toThrow();
            });
        });
        describe('createComponent', function () {
            var templateExecutionCounter = 0;
            var EmbeddedComponent = /** @class */ (function () {
                function EmbeddedComponent() {
                }
                EmbeddedComponent.ngComponentDef = index_1.defineComponent({
                    type: EmbeddedComponent,
                    selectors: [['embedded-cmp']],
                    factory: function () { return new EmbeddedComponent(); },
                    template: function (rf, cmp) {
                        templateExecutionCounter++;
                        if (rf & 1 /* Create */) {
                            instructions_1.text(0, 'foo');
                        }
                    }
                });
                return EmbeddedComponent;
            }());
            it('should work without Injector and NgModuleRef', function () {
                templateExecutionCounter = 0;
                var fixture = new render_util_1.TemplateFixture(createTemplate, updateTemplate, [DirectiveWithVCRef]);
                expect(fixture.html).toEqual('<p vcref=""></p>');
                expect(templateExecutionCounter).toEqual(0);
                var componentRef = directiveInstance.vcref.createComponent(directiveInstance.cfr.resolveComponentFactory(EmbeddedComponent));
                fixture.update();
                expect(fixture.html).toEqual('<p vcref=""></p><embedded-cmp>foo</embedded-cmp>');
                expect(templateExecutionCounter).toEqual(2);
                directiveInstance.vcref.detach(0);
                fixture.update();
                expect(fixture.html).toEqual('<p vcref=""></p>');
                expect(templateExecutionCounter).toEqual(2);
                directiveInstance.vcref.insert(componentRef.hostView);
                fixture.update();
                expect(fixture.html).toEqual('<p vcref=""></p><embedded-cmp>foo</embedded-cmp>');
                expect(templateExecutionCounter).toEqual(3);
            });
            it('should work with NgModuleRef and Injector', function () {
                var MyAppModule = /** @class */ (function () {
                    function MyAppModule() {
                    }
                    MyAppModule.ngInjectorDef = core_1.defineInjector({
                        factory: function () { return new MyAppModule(); },
                        imports: [],
                        providers: [
                            { provide: core_1.ɵAPP_ROOT, useValue: true },
                            { provide: core_1.RendererFactory2, useValue: imported_renderer2_1.getRendererFactory2(document) }
                        ]
                    });
                    MyAppModule.ngModuleDef = { bootstrap: [] };
                    return MyAppModule;
                }());
                var myAppModuleFactory = new ng_module_ref_1.NgModuleFactory(MyAppModule);
                var ngModuleRef = myAppModuleFactory.create(null);
                var SomeModule = /** @class */ (function () {
                    function SomeModule() {
                    }
                    SomeModule.ngInjectorDef = core_1.defineInjector({
                        factory: function () { return new SomeModule(); },
                        providers: [{ provide: core_1.NgModuleRef, useValue: ngModuleRef }]
                    });
                    return SomeModule;
                }());
                var injector = core_1.createInjector(SomeModule);
                templateExecutionCounter = 0;
                var fixture = new render_util_1.TemplateFixture(createTemplate, updateTemplate, [DirectiveWithVCRef]);
                expect(fixture.html).toEqual('<p vcref=""></p>');
                expect(templateExecutionCounter).toEqual(0);
                directiveInstance.vcref.createComponent(directiveInstance.cfr.resolveComponentFactory(EmbeddedComponent), 0, injector);
                fixture.update();
                expect(fixture.html).toEqual('<p vcref=""></p><embedded-cmp>foo</embedded-cmp>');
                expect(templateExecutionCounter).toEqual(2);
                directiveInstance.vcref.createComponent(directiveInstance.cfr.resolveComponentFactory(EmbeddedComponent), 0, undefined, undefined, ngModuleRef);
                fixture.update();
                expect(fixture.html)
                    .toEqual('<p vcref=""></p><embedded-cmp>foo</embedded-cmp><embedded-cmp>foo</embedded-cmp>');
                expect(templateExecutionCounter).toEqual(5);
            });
            var EmbeddedComponentWithNgContent = /** @class */ (function () {
                function EmbeddedComponentWithNgContent() {
                }
                EmbeddedComponentWithNgContent.ngComponentDef = index_1.defineComponent({
                    type: EmbeddedComponentWithNgContent,
                    selectors: [['embedded-cmp-with-ngcontent']],
                    factory: function () { return new EmbeddedComponentWithNgContent(); },
                    template: function (rf, cmp) {
                        if (rf & 1 /* Create */) {
                            instructions_1.projectionDef();
                            instructions_1.projection(0, 0);
                            instructions_1.element(1, 'hr');
                            instructions_1.projection(2, 1);
                        }
                    }
                });
                return EmbeddedComponentWithNgContent;
            }());
            it('should support projectable nodes', function () {
                var fixture = new render_util_1.TemplateFixture(createTemplate, updateTemplate, [DirectiveWithVCRef]);
                expect(fixture.html).toEqual('<p vcref=""></p>');
                var myNode = document.createElement('div');
                var myText = document.createTextNode('bar');
                var myText2 = document.createTextNode('baz');
                myNode.appendChild(myText);
                myNode.appendChild(myText2);
                directiveInstance.vcref.createComponent(directiveInstance.cfr.resolveComponentFactory(EmbeddedComponentWithNgContent), 0, undefined, [[myNode]]);
                fixture.update();
                expect(fixture.html)
                    .toEqual('<p vcref=""></p><embedded-cmp-with-ngcontent><div>barbaz</div><hr></embedded-cmp-with-ngcontent>');
            });
            it('should support reprojection of projectable nodes', function () {
                var Reprojector = /** @class */ (function () {
                    function Reprojector() {
                    }
                    Reprojector.ngComponentDef = index_1.defineComponent({
                        type: Reprojector,
                        selectors: [['reprojector']],
                        factory: function () { return new Reprojector(); },
                        template: function (rf, cmp) {
                            if (rf & 1 /* Create */) {
                                instructions_1.projectionDef();
                                instructions_1.elementStart(0, 'embedded-cmp-with-ngcontent');
                                {
                                    instructions_1.projection(1, 0);
                                }
                                instructions_1.elementEnd();
                            }
                        },
                        directives: [EmbeddedComponentWithNgContent]
                    });
                    return Reprojector;
                }());
                var fixture = new render_util_1.TemplateFixture(createTemplate, updateTemplate, [DirectiveWithVCRef]);
                expect(fixture.html).toEqual('<p vcref=""></p>');
                var myNode = document.createElement('div');
                var myText = document.createTextNode('bar');
                var myText2 = document.createTextNode('baz');
                myNode.appendChild(myText);
                myNode.appendChild(myText2);
                directiveInstance.vcref.createComponent(directiveInstance.cfr.resolveComponentFactory(Reprojector), 0, undefined, [[myNode]]);
                fixture.update();
                expect(fixture.html)
                    .toEqual('<p vcref=""></p><reprojector><embedded-cmp-with-ngcontent><div>barbaz</div><hr></embedded-cmp-with-ngcontent></reprojector>');
            });
            it('should support many projectable nodes with many slots', function () {
                var fixture = new render_util_1.TemplateFixture(createTemplate, updateTemplate, [DirectiveWithVCRef]);
                expect(fixture.html).toEqual('<p vcref=""></p>');
                directiveInstance.vcref.createComponent(directiveInstance.cfr.resolveComponentFactory(EmbeddedComponentWithNgContent), 0, undefined, [
                    [document.createTextNode('1'), document.createTextNode('2')],
                    [document.createTextNode('3'), document.createTextNode('4')]
                ]);
                fixture.update();
                expect(fixture.html)
                    .toEqual('<p vcref=""></p><embedded-cmp-with-ngcontent>12<hr>34</embedded-cmp-with-ngcontent>');
            });
        });
    });
    describe('projection', function () {
        function embeddedTemplate(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'span');
                instructions_1.text(1);
                instructions_1.elementEnd();
            }
            instructions_1.textBinding(1, ctx.name);
        }
        it('should project the ViewContainerRef content along its host, in an element', function () {
            var Child = /** @class */ (function () {
                function Child() {
                }
                Child_2 = Child;
                var Child_2;
                Child.ngComponentDef = index_1.defineComponent({
                    type: Child_2,
                    selectors: [['child']],
                    factory: function () { return new Child_2(); },
                    template: function (rf, cmp) {
                        if (rf & 1 /* Create */) {
                            instructions_1.projectionDef();
                            instructions_1.elementStart(0, 'div');
                            {
                                instructions_1.projection(1);
                            }
                            instructions_1.elementEnd();
                        }
                    }
                });
                Child = Child_2 = __decorate([
                    core_1.Component({ selector: 'child', template: '<div><ng-content></ng-content></div>' })
                ], Child);
                return Child;
            }());
            var Parent = /** @class */ (function () {
                function Parent() {
                    this.name = 'bar';
                }
                Parent_1 = Parent;
                var Parent_1;
                Parent.ngComponentDef = index_1.defineComponent({
                    type: Parent_1,
                    selectors: [['parent']],
                    factory: function () { return new Parent_1(); },
                    template: function (rf, cmp) {
                        if (rf & 1 /* Create */) {
                            instructions_1.container(0, embeddedTemplate);
                            instructions_1.elementStart(1, 'child');
                            instructions_1.elementStart(2, 'header', ['vcref', '']);
                            instructions_1.text(3, 'blah');
                            instructions_1.elementEnd();
                            instructions_1.elementEnd();
                        }
                        var tplRef;
                        if (rf & 2 /* Update */) {
                            tplRef = di_1.getOrCreateTemplateRef(di_1.getOrCreateNodeInjectorForNode(instructions_1.load(0)));
                            instructions_1.elementProperty(2, 'tplRef', instructions_1.bind(tplRef));
                            instructions_1.elementProperty(2, 'name', instructions_1.bind(cmp.name));
                        }
                    },
                    directives: [Child, DirectiveWithVCRef]
                });
                Parent = Parent_1 = __decorate([
                    core_1.Component({
                        selector: 'parent',
                        template: "\n          <ng-template #foo>\n              <span>{{name}}</span>\n          </ng-template>\n          <child><header vcref [tplRef]=\"foo\" [name]=\"name\">blah</header></child>"
                    })
                ], Parent);
                return Parent;
            }());
            var fixture = new render_util_1.ComponentFixture(Parent);
            expect(fixture.html).toEqual('<child><div><header vcref="">blah</header></div></child>');
            directiveInstance.vcref.createEmbeddedView(directiveInstance.tplRef, fixture.component);
            fixture.update();
            expect(fixture.html)
                .toEqual('<child><div><header vcref="">blah</header><span>bar</span></div></child>');
        });
        it('should project the ViewContainerRef content along its host, in a view', function () {
            var ChildWithView = /** @class */ (function () {
                function ChildWithView() {
                    this.show = true;
                }
                ChildWithView_1 = ChildWithView;
                var ChildWithView_1;
                ChildWithView.ngComponentDef = index_1.defineComponent({
                    type: ChildWithView_1,
                    selectors: [['child-with-view']],
                    factory: function () { return new ChildWithView_1(); },
                    template: function (rf, cmp) {
                        if (rf & 1 /* Create */) {
                            instructions_1.projectionDef();
                            instructions_1.text(0, 'Before (inside)-');
                            instructions_1.container(1);
                            instructions_1.text(2, 'After (inside)');
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.containerRefreshStart(1);
                            if (cmp.show) {
                                var rf0 = instructions_1.embeddedViewStart(0);
                                if (rf0 & 1 /* Create */) {
                                    instructions_1.projection(0);
                                }
                                instructions_1.embeddedViewEnd();
                            }
                            instructions_1.containerRefreshEnd();
                        }
                    }
                });
                ChildWithView = ChildWithView_1 = __decorate([
                    core_1.Component({
                        selector: 'child-with-view',
                        template: "\n          Before (inside)-\n          % if (show) {\n            <ng-content></ng-content>\n          % }\n          After (inside)\n        "
                    })
                ], ChildWithView);
                return ChildWithView;
            }());
            var Parent = /** @class */ (function () {
                function Parent() {
                    this.name = 'bar';
                }
                Parent_2 = Parent;
                var Parent_2;
                Parent.ngComponentDef = index_1.defineComponent({
                    type: Parent_2,
                    selectors: [['parent']],
                    factory: function () { return new Parent_2(); },
                    template: function (rf, cmp) {
                        if (rf & 1 /* Create */) {
                            instructions_1.container(0, embeddedTemplate);
                            instructions_1.elementStart(1, 'child-with-view');
                            instructions_1.text(2, 'Before projected');
                            instructions_1.elementStart(3, 'header', ['vcref', '']);
                            instructions_1.text(4, 'blah');
                            instructions_1.elementEnd();
                            instructions_1.text(5, 'After projected-');
                            instructions_1.elementEnd();
                        }
                        if (rf & 2 /* Update */) {
                            var tplRef = di_1.getOrCreateTemplateRef(di_1.getOrCreateNodeInjectorForNode(instructions_1.load(0)));
                            instructions_1.elementProperty(3, 'tplRef', instructions_1.bind(tplRef));
                            instructions_1.elementProperty(3, 'name', instructions_1.bind(cmp.name));
                        }
                    },
                    directives: [ChildWithView, DirectiveWithVCRef]
                });
                Parent = Parent_2 = __decorate([
                    core_1.Component({
                        selector: 'parent',
                        template: "\n          <ng-template #foo>\n              <span>{{name}}</span>\n          </ng-template>\n          <child-with-view>\n            Before projected\n            <header vcref [tplRef]=\"foo\" [name]=\"name\">blah</header>\n            After projected\n          </child-with-view>"
                    })
                ], Parent);
                return Parent;
            }());
            var fixture = new render_util_1.ComponentFixture(Parent);
            expect(fixture.html)
                .toEqual('<child-with-view>Before (inside)-Before projected<header vcref="">blah</header>After projected-After (inside)</child-with-view>');
            directiveInstance.vcref.createEmbeddedView(directiveInstance.tplRef, fixture.component);
            fixture.update();
            expect(fixture.html)
                .toEqual('<child-with-view>Before (inside)-Before projected<header vcref="">blah</header><span>bar</span>After projected-After (inside)</child-with-view>');
        });
        describe('with select', function () {
            var ChildWithSelector = /** @class */ (function () {
                function ChildWithSelector() {
                }
                ChildWithSelector_1 = ChildWithSelector;
                var ChildWithSelector_1;
                ChildWithSelector.ngComponentDef = index_1.defineComponent({
                    type: ChildWithSelector_1,
                    selectors: [['child-with-selector']],
                    factory: function () { return new ChildWithSelector_1(); },
                    template: function (rf, cmp) {
                        if (rf & 1 /* Create */) {
                            instructions_1.projectionDef([[['header']]], ['header']);
                            instructions_1.elementStart(0, 'first');
                            {
                                instructions_1.projection(1, 1);
                            }
                            instructions_1.elementEnd();
                            instructions_1.elementStart(2, 'second');
                            {
                                instructions_1.projection(3);
                            }
                            instructions_1.elementEnd();
                        }
                    },
                    directives: [ChildWithSelector_1, DirectiveWithVCRef]
                });
                ChildWithSelector = ChildWithSelector_1 = __decorate([
                    core_1.Component({
                        selector: 'child-with-selector',
                        template: "\n          <first><ng-content select=\"header\"></ng-content></first>\n          <second><ng-content></ng-content></second>"
                    })
                ], ChildWithSelector);
                return ChildWithSelector;
            }());
            it('should project the ViewContainerRef content along its host, when the host matches a selector', function () {
                var Parent = /** @class */ (function () {
                    function Parent() {
                        this.name = 'bar';
                    }
                    Parent_3 = Parent;
                    var Parent_3;
                    Parent.ngComponentDef = index_1.defineComponent({
                        type: Parent_3,
                        selectors: [['parent']],
                        factory: function () { return new Parent_3(); },
                        template: function (rf, cmp) {
                            var tplRef;
                            if (rf & 1 /* Create */) {
                                instructions_1.container(0, embeddedTemplate);
                                instructions_1.elementStart(1, 'child-with-selector');
                                instructions_1.elementStart(2, 'header', ['vcref', '']);
                                instructions_1.text(3, 'blah');
                                instructions_1.elementEnd();
                                instructions_1.elementEnd();
                            }
                            if (rf & 2 /* Update */) {
                                tplRef = di_1.getOrCreateTemplateRef(di_1.getOrCreateNodeInjectorForNode(instructions_1.load(0)));
                                instructions_1.elementProperty(2, 'tplRef', instructions_1.bind(tplRef));
                                instructions_1.elementProperty(2, 'name', instructions_1.bind(cmp.name));
                            }
                        },
                        directives: [ChildWithSelector, DirectiveWithVCRef]
                    });
                    Parent = Parent_3 = __decorate([
                        core_1.Component({
                            selector: 'parent',
                            template: "\n            <ng-template #foo>\n                <span>{{name}}</span>\n              </ng-template>\n            <child-with-selector><header vcref [tplRef]=\"foo\" [name]=\"name\">blah</header></child-with-selector>"
                        })
                    ], Parent);
                    return Parent;
                }());
                var fixture = new render_util_1.ComponentFixture(Parent);
                expect(fixture.html)
                    .toEqual('<child-with-selector><first><header vcref="">blah</header></first><second></second></child-with-selector>');
                directiveInstance.vcref.createEmbeddedView(directiveInstance.tplRef, fixture.component);
                fixture.update();
                expect(fixture.html)
                    .toEqual('<child-with-selector><first><header vcref="">blah</header><span>bar</span></first><second></second></child-with-selector>');
            });
            it('should not project the ViewContainerRef content, when the host does not match a selector', function () {
                var Parent = /** @class */ (function () {
                    function Parent() {
                        this.name = 'bar';
                    }
                    Parent_4 = Parent;
                    var Parent_4;
                    Parent.ngComponentDef = index_1.defineComponent({
                        type: Parent_4,
                        selectors: [['parent']],
                        factory: function () { return new Parent_4(); },
                        template: function (rf, cmp) {
                            var tplRef;
                            if (rf & 1 /* Create */) {
                                instructions_1.container(0, embeddedTemplate);
                                instructions_1.elementStart(1, 'child-with-selector');
                                instructions_1.elementStart(2, 'footer', ['vcref', '']);
                                instructions_1.text(3, 'blah');
                                instructions_1.elementEnd();
                                instructions_1.elementEnd();
                            }
                            if (rf & 2 /* Update */) {
                                tplRef = di_1.getOrCreateTemplateRef(di_1.getOrCreateNodeInjectorForNode(instructions_1.load(0)));
                                instructions_1.elementProperty(2, 'tplRef', instructions_1.bind(tplRef));
                                instructions_1.elementProperty(2, 'name', instructions_1.bind(cmp.name));
                            }
                        },
                        directives: [ChildWithSelector, DirectiveWithVCRef]
                    });
                    Parent = Parent_4 = __decorate([
                        core_1.Component({
                            selector: 'parent',
                            template: "\n            <ng-template #foo>\n                <span>{{name}}</span>\n              </ng-template>\n            <child-with-selector><footer vcref [tplRef]=\"foo\" [name]=\"name\">blah</footer></child-with-selector>"
                        })
                    ], Parent);
                    return Parent;
                }());
                var fixture = new render_util_1.ComponentFixture(Parent);
                expect(fixture.html)
                    .toEqual('<child-with-selector><first></first><second><footer vcref="">blah</footer></second></child-with-selector>');
                directiveInstance.vcref.createEmbeddedView(directiveInstance.tplRef, fixture.component);
                fixture.update();
                expect(fixture.html)
                    .toEqual('<child-with-selector><first></first><second><footer vcref="">blah</footer><span>bar</span></second></child-with-selector>');
            });
        });
    });
    describe('life cycle hooks', function () {
        // Angular 5 reference: https://stackblitz.com/edit/lifecycle-hooks-vcref
        var log = [];
        var ComponentWithHooks = /** @class */ (function () {
            function ComponentWithHooks() {
            }
            ComponentWithHooks_1 = ComponentWithHooks;
            ComponentWithHooks.prototype.log = function (msg) { log.push(msg); };
            ComponentWithHooks.prototype.ngOnChanges = function () { this.log('onChanges-' + this.name); };
            ComponentWithHooks.prototype.ngOnInit = function () { this.log('onInit-' + this.name); };
            ComponentWithHooks.prototype.ngDoCheck = function () { this.log('doCheck-' + this.name); };
            ComponentWithHooks.prototype.ngAfterContentInit = function () { this.log('afterContentInit-' + this.name); };
            ComponentWithHooks.prototype.ngAfterContentChecked = function () { this.log('afterContentChecked-' + this.name); };
            ComponentWithHooks.prototype.ngAfterViewInit = function () { this.log('afterViewInit-' + this.name); };
            ComponentWithHooks.prototype.ngAfterViewChecked = function () { this.log('afterViewChecked-' + this.name); };
            ComponentWithHooks.prototype.ngOnDestroy = function () { this.log('onDestroy-' + this.name); };
            var ComponentWithHooks_1;
            ComponentWithHooks.ngComponentDef = index_1.defineComponent({
                type: ComponentWithHooks_1,
                selectors: [['hooks']],
                factory: function () { return new ComponentWithHooks_1(); },
                template: function (rf, cmp) {
                    if (rf & 1 /* Create */) {
                        instructions_1.text(0);
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.textBinding(0, instructions_1.interpolation1('', cmp.name, ''));
                    }
                },
                features: [index_1.NgOnChangesFeature],
                inputs: { name: 'name' }
            });
            ComponentWithHooks = ComponentWithHooks_1 = __decorate([
                core_1.Component({ selector: 'hooks', template: "{{name}}" })
            ], ComponentWithHooks);
            return ComponentWithHooks;
        }());
        it('should call all hooks in correct order when creating with createEmbeddedView', function () {
            var SomeComponent = /** @class */ (function () {
                function SomeComponent() {
                }
                SomeComponent_2 = SomeComponent;
                var SomeComponent_2;
                SomeComponent.ngComponentDef = index_1.defineComponent({
                    type: SomeComponent_2,
                    selectors: [['some-comp']],
                    factory: function () { return new SomeComponent_2(); },
                    template: function (rf, cmp) {
                        if (rf & 1 /* Create */) {
                            instructions_1.container(0, function (rf, ctx) {
                                if (rf & 1 /* Create */) {
                                    instructions_1.elementStart(0, 'hooks');
                                    instructions_1.elementEnd();
                                }
                                if (rf & 2 /* Update */) {
                                    instructions_1.elementProperty(0, 'name', instructions_1.bind('C'));
                                }
                            });
                            instructions_1.elementStart(1, 'hooks', ['vcref', '']);
                            instructions_1.elementEnd();
                            instructions_1.elementStart(2, 'hooks');
                            instructions_1.elementEnd();
                        }
                        if (rf & 2 /* Update */) {
                            var tplRef = di_1.getOrCreateTemplateRef(di_1.getOrCreateNodeInjectorForNode(instructions_1.load(0)));
                            instructions_1.elementProperty(1, 'tplRef', instructions_1.bind(tplRef));
                            instructions_1.elementProperty(1, 'name', instructions_1.bind('A'));
                            instructions_1.elementProperty(2, 'name', instructions_1.bind('B'));
                        }
                    },
                    directives: [ComponentWithHooks, DirectiveWithVCRef]
                });
                SomeComponent = SomeComponent_2 = __decorate([
                    core_1.Component({
                        template: "\n          <ng-template #foo>\n            <hooks [name]=\"'C'\"></hooks>\n          </ng-template>\n          <hooks vcref [tplRef]=\"foo\" [name]=\"'A'\"></hooks>\n          <hooks [name]=\"'B'\"></hooks>\n        "
                    })
                ], SomeComponent);
                return SomeComponent;
            }());
            log.length = 0;
            var fixture = new render_util_1.ComponentFixture(SomeComponent);
            expect(log).toEqual([
                'onChanges-A', 'onInit-A', 'doCheck-A', 'onChanges-B', 'onInit-B', 'doCheck-B',
                'afterContentInit-A', 'afterContentChecked-A', 'afterContentInit-B',
                'afterContentChecked-B', 'afterViewInit-A', 'afterViewChecked-A', 'afterViewInit-B',
                'afterViewChecked-B'
            ]);
            log.length = 0;
            fixture.update();
            expect(log).toEqual([
                'doCheck-A', 'doCheck-B', 'afterContentChecked-A', 'afterContentChecked-B',
                'afterViewChecked-A', 'afterViewChecked-B'
            ]);
            log.length = 0;
            directiveInstance.vcref.createEmbeddedView(directiveInstance.tplRef, fixture.component);
            expect(fixture.html).toEqual('<hooks vcref="">A</hooks><hooks></hooks><hooks>B</hooks>');
            expect(log).toEqual([]);
            log.length = 0;
            fixture.update();
            expect(fixture.html).toEqual('<hooks vcref="">A</hooks><hooks>C</hooks><hooks>B</hooks>');
            expect(log).toEqual([
                'doCheck-A', 'doCheck-B', 'onChanges-C', 'onInit-C', 'doCheck-C', 'afterContentInit-C',
                'afterContentChecked-C', 'afterViewInit-C', 'afterViewChecked-C', 'afterContentChecked-A',
                'afterContentChecked-B', 'afterViewChecked-A', 'afterViewChecked-B'
            ]);
            log.length = 0;
            fixture.update();
            expect(log).toEqual([
                'doCheck-A', 'doCheck-B', 'doCheck-C', 'afterContentChecked-C', 'afterViewChecked-C',
                'afterContentChecked-A', 'afterContentChecked-B', 'afterViewChecked-A', 'afterViewChecked-B'
            ]);
            log.length = 0;
            var viewRef = directiveInstance.vcref.detach(0);
            fixture.update();
            expect(log).toEqual([
                'doCheck-A', 'doCheck-B', 'afterContentChecked-A', 'afterContentChecked-B',
                'afterViewChecked-A', 'afterViewChecked-B'
            ]);
            log.length = 0;
            directiveInstance.vcref.insert(viewRef);
            fixture.update();
            expect(log).toEqual([
                'doCheck-A', 'doCheck-B', 'doCheck-C', 'afterContentChecked-C', 'afterViewChecked-C',
                'afterContentChecked-A', 'afterContentChecked-B', 'afterViewChecked-A', 'afterViewChecked-B'
            ]);
            log.length = 0;
            directiveInstance.vcref.remove(0);
            fixture.update();
            expect(log).toEqual([
                'onDestroy-C', 'doCheck-A', 'doCheck-B', 'afterContentChecked-A', 'afterContentChecked-B',
                'afterViewChecked-A', 'afterViewChecked-B'
            ]);
        });
        it('should call all hooks in correct order when creating with createComponent', function () {
            var SomeComponent = /** @class */ (function () {
                function SomeComponent() {
                }
                SomeComponent_3 = SomeComponent;
                var SomeComponent_3;
                SomeComponent.ngComponentDef = index_1.defineComponent({
                    type: SomeComponent_3,
                    selectors: [['some-comp']],
                    factory: function () { return new SomeComponent_3(); },
                    template: function (rf, cmp) {
                        if (rf & 1 /* Create */) {
                            instructions_1.elementStart(0, 'hooks', ['vcref', '']);
                            instructions_1.elementEnd();
                            instructions_1.elementStart(1, 'hooks');
                            instructions_1.elementEnd();
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.elementProperty(0, 'name', instructions_1.bind('A'));
                            instructions_1.elementProperty(1, 'name', instructions_1.bind('B'));
                        }
                    },
                    directives: [ComponentWithHooks, DirectiveWithVCRef]
                });
                SomeComponent = SomeComponent_3 = __decorate([
                    core_1.Component({
                        template: "\n          <hooks vcref [name]=\"'A'\"></hooks>\n          <hooks [name]=\"'B'\"></hooks>\n        "
                    })
                ], SomeComponent);
                return SomeComponent;
            }());
            log.length = 0;
            var fixture = new render_util_1.ComponentFixture(SomeComponent);
            expect(log).toEqual([
                'onChanges-A', 'onInit-A', 'doCheck-A', 'onChanges-B', 'onInit-B', 'doCheck-B',
                'afterContentInit-A', 'afterContentChecked-A', 'afterContentInit-B',
                'afterContentChecked-B', 'afterViewInit-A', 'afterViewChecked-A', 'afterViewInit-B',
                'afterViewChecked-B'
            ]);
            log.length = 0;
            fixture.update();
            expect(log).toEqual([
                'doCheck-A', 'doCheck-B', 'afterContentChecked-A', 'afterContentChecked-B',
                'afterViewChecked-A', 'afterViewChecked-B'
            ]);
            log.length = 0;
            var componentRef = directiveInstance.vcref.createComponent(directiveInstance.cfr.resolveComponentFactory(ComponentWithHooks));
            expect(fixture.html).toEqual('<hooks vcref="">A</hooks><hooks></hooks><hooks>B</hooks>');
            expect(log).toEqual([]);
            componentRef.instance.name = 'D';
            log.length = 0;
            fixture.update();
            expect(fixture.html).toEqual('<hooks vcref="">A</hooks><hooks>D</hooks><hooks>B</hooks>');
            expect(log).toEqual([
                'doCheck-A', 'doCheck-B', 'onChanges-D', 'onInit-D', 'doCheck-D', 'afterContentInit-D',
                'afterContentChecked-D', 'afterViewInit-D', 'afterViewChecked-D', 'afterContentChecked-A',
                'afterContentChecked-B', 'afterViewChecked-A', 'afterViewChecked-B'
            ]);
            log.length = 0;
            fixture.update();
            expect(log).toEqual([
                'doCheck-A', 'doCheck-B', 'doCheck-D', 'afterContentChecked-D', 'afterViewChecked-D',
                'afterContentChecked-A', 'afterContentChecked-B', 'afterViewChecked-A', 'afterViewChecked-B'
            ]);
            log.length = 0;
            var viewRef = directiveInstance.vcref.detach(0);
            fixture.update();
            expect(log).toEqual([
                'doCheck-A', 'doCheck-B', 'afterContentChecked-A', 'afterContentChecked-B',
                'afterViewChecked-A', 'afterViewChecked-B'
            ]);
            log.length = 0;
            directiveInstance.vcref.insert(viewRef);
            fixture.update();
            expect(log).toEqual([
                'doCheck-A', 'doCheck-B', 'doCheck-D', 'afterContentChecked-D', 'afterViewChecked-D',
                'afterContentChecked-A', 'afterContentChecked-B', 'afterViewChecked-A', 'afterViewChecked-B'
            ]);
            log.length = 0;
            directiveInstance.vcref.remove(0);
            fixture.update();
            expect(log).toEqual([
                'onDestroy-D', 'doCheck-A', 'doCheck-B', 'afterContentChecked-A', 'afterContentChecked-B',
                'afterViewChecked-A', 'afterViewChecked-B'
            ]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19jb250YWluZXJfcmVmX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVuZGVyMy92aWV3X2NvbnRhaW5lcl9yZWZfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHVDQUFzUTtBQUN0USwyQ0FBNEY7QUFDNUYsaURBQW9MO0FBQ3BMLCtEQUFvUztBQUVwUyxpRUFBZ0U7QUFDaEUsK0NBQXVEO0FBRXZELDJEQUF5RDtBQUN6RCw2Q0FBaUY7QUFFakYsUUFBUSxDQUFDLGtCQUFrQixFQUFFO0lBQzNCLElBQUksaUJBQTBDLENBQUM7SUFFL0MsVUFBVSxDQUFDLGNBQVEsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFaEQ7UUFZRSw2RkFBNkY7UUFDN0YsVUFBVTtRQUNWLDRCQUFtQixLQUF1QixFQUFTLEdBQTZCO1lBQTdELFVBQUssR0FBTCxLQUFLLENBQWtCO1lBQVMsUUFBRyxHQUFILEdBQUcsQ0FBMEI7UUFBRyxDQUFDO1FBYjdFLGlDQUFjLEdBQUcsdUJBQWUsQ0FBQztZQUN0QyxJQUFJLEVBQUUsa0JBQWtCO1lBQ3hCLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM5QixPQUFPLEVBQUUsY0FBTSxPQUFBLGlCQUFpQixHQUFHLElBQUksa0JBQWtCLENBQzVDLDhCQUFzQixFQUFFLEVBQUUsc0NBQThCLEVBQUUsQ0FBQyxFQUR6RCxDQUN5RDtZQUN4RSxNQUFNLEVBQUUsRUFBQyxNQUFNLEVBQUUsUUFBUSxFQUFDO1NBQzNCLENBQUMsQ0FBQztRQVFMLHlCQUFDO0tBQUEsQUFmRCxJQWVDO0lBRUQsUUFBUSxDQUFDLEtBQUssRUFBRTtRQUNkLDBCQUEwQixFQUFlLEVBQUUsR0FBUTtZQUNqRCxJQUFJLEVBQUUs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