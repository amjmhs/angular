"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../src/render3/index");
var instructions_1 = require("../../src/render3/instructions");
var view_1 = require("../../src/render3/interfaces/view");
var sanitization_1 = require("../../src/sanitization/sanitization");
var render_util_1 = require("./render_util");
describe('render3 integration test', function () {
    describe('render', function () {
        it('should render basic template', function () {
            expect(render_util_1.renderToHtml(Template, {})).toEqual('<span title="Hello">Greetings</span>');
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'span', ['title', 'Hello']);
                    {
                        instructions_1.text(1, 'Greetings');
                    }
                    instructions_1.elementEnd();
                }
            }
            expect(ngDevMode).toHaveProperties({
                firstTemplatePass: 1,
                tNode: 3,
                tView: 1,
                rendererCreateElement: 1,
            });
        });
        it('should render and update basic "Hello, World" template', function () {
            expect(render_util_1.renderToHtml(Template, 'World')).toEqual('<h1>Hello, World!</h1>');
            expect(render_util_1.renderToHtml(Template, 'New World')).toEqual('<h1>Hello, New World!</h1>');
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'h1');
                    {
                        instructions_1.text(1);
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.textBinding(1, instructions_1.interpolation1('Hello, ', ctx, '!'));
                }
            }
        });
    });
    describe('text bindings', function () {
        it('should render "undefined" as "" when used with `bind()`', function () {
            function Template(rf, name) {
                if (rf & 1 /* Create */) {
                    instructions_1.text(0);
                }
                if (rf & 2 /* Update */) {
                    instructions_1.textBinding(0, instructions_1.bind(name));
                }
            }
            expect(render_util_1.renderToHtml(Template, 'benoit')).toEqual('benoit');
            expect(render_util_1.renderToHtml(Template, undefined)).toEqual('');
            expect(ngDevMode).toHaveProperties({
                firstTemplatePass: 0,
                tNode: 2,
                tView: 1,
                rendererSetText: 2,
            });
        });
        it('should render "null" as "" when used with `bind()`', function () {
            function Template(rf, name) {
                if (rf & 1 /* Create */) {
                    instructions_1.text(0);
                }
                if (rf & 2 /* Update */) {
                    instructions_1.textBinding(0, instructions_1.bind(name));
                }
            }
            expect(render_util_1.renderToHtml(Template, 'benoit')).toEqual('benoit');
            expect(render_util_1.renderToHtml(Template, null)).toEqual('');
            expect(ngDevMode).toHaveProperties({
                firstTemplatePass: 0,
                tNode: 2,
                tView: 1,
                rendererSetText: 2,
            });
        });
        it('should support creation-time values in text nodes', function () {
            function Template(rf, value) {
                if (rf & 1 /* Create */) {
                    instructions_1.text(0);
                }
                if (rf & 2 /* Update */) {
                    instructions_1.textBinding(0, rf & 1 /* Create */ ? value : instructions_1.NO_CHANGE);
                }
            }
            expect(render_util_1.renderToHtml(Template, 'once')).toEqual('once');
            expect(render_util_1.renderToHtml(Template, 'twice')).toEqual('once');
            expect(ngDevMode).toHaveProperties({
                firstTemplatePass: 0,
                tNode: 2,
                tView: 1,
                rendererSetText: 1,
            });
        });
    });
    describe('Siblings update', function () {
        it('should handle a flat list of static/bound text nodes', function () {
            function Template(rf, name) {
                if (rf & 1 /* Create */) {
                    instructions_1.text(0, 'Hello ');
                    instructions_1.text(1);
                    instructions_1.text(2, '!');
                }
                if (rf & 2 /* Update */) {
                    instructions_1.textBinding(1, instructions_1.bind(name));
                }
            }
            expect(render_util_1.renderToHtml(Template, 'world')).toEqual('Hello world!');
            expect(render_util_1.renderToHtml(Template, 'monde')).toEqual('Hello monde!');
        });
        it('should handle a list of static/bound text nodes as element children', function () {
            function Template(rf, name) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'b');
                    {
                        instructions_1.text(1, 'Hello ');
                        instructions_1.text(2);
                        instructions_1.text(3, '!');
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.textBinding(2, instructions_1.bind(name));
                }
            }
            expect(render_util_1.renderToHtml(Template, 'world')).toEqual('<b>Hello world!</b>');
            expect(render_util_1.renderToHtml(Template, 'mundo')).toEqual('<b>Hello mundo!</b>');
        });
        it('should render/update text node as a child of a deep list of elements', function () {
            function Template(rf, name) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'b');
                    {
                        instructions_1.elementStart(1, 'b');
                        {
                            instructions_1.elementStart(2, 'b');
                            {
                                instructions_1.elementStart(3, 'b');
                                {
                                    instructions_1.text(4);
                                }
                                instructions_1.elementEnd();
                            }
                            instructions_1.elementEnd();
                        }
                        instructions_1.elementEnd();
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.textBinding(4, instructions_1.interpolation1('Hello ', name, '!'));
                }
            }
            expect(render_util_1.renderToHtml(Template, 'world')).toEqual('<b><b><b><b>Hello world!</b></b></b></b>');
            expect(render_util_1.renderToHtml(Template, 'mundo')).toEqual('<b><b><b><b>Hello mundo!</b></b></b></b>');
        });
        it('should update 2 sibling elements', function () {
            function Template(rf, id) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'b');
                    {
                        instructions_1.elementStart(1, 'span');
                        instructions_1.elementEnd();
                        instructions_1.elementStart(2, 'span', ['class', 'foo']);
                        { }
                        instructions_1.elementEnd();
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementAttribute(2, 'id', instructions_1.bind(id));
                }
            }
            expect(render_util_1.renderToHtml(Template, 'foo'))
                .toEqual('<b><span></span><span class="foo" id="foo"></span></b>');
            expect(render_util_1.renderToHtml(Template, 'bar'))
                .toEqual('<b><span></span><span class="foo" id="bar"></span></b>');
        });
        it('should handle sibling text node after element with child text node', function () {
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'p');
                    {
                        instructions_1.text(1, 'hello');
                    }
                    instructions_1.elementEnd();
                    instructions_1.text(2, 'world');
                }
            }
            expect(render_util_1.renderToHtml(Template, null)).toEqual('<p>hello</p>world');
        });
    });
    describe('basic components', function () {
        var TodoComponent = /** @class */ (function () {
            function TodoComponent() {
                this.value = ' one';
            }
            TodoComponent.ngComponentDef = index_1.defineComponent({
                type: TodoComponent,
                selectors: [['todo']],
                template: function TodoTemplate(rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'p');
                        {
                            instructions_1.text(1, 'Todo');
                            instructions_1.text(2);
                        }
                        instructions_1.elementEnd();
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.textBinding(2, instructions_1.bind(ctx.value));
                    }
                },
                factory: function () { return new TodoComponent; }
            });
            return TodoComponent;
        }());
        var defs = [TodoComponent];
        it('should support a basic component template', function () {
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'todo');
                    instructions_1.elementEnd();
                }
            }
            expect(render_util_1.renderToHtml(Template, null, defs)).toEqual('<todo><p>Todo one</p></todo>');
        });
        it('should support a component template with sibling', function () {
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'todo');
                    instructions_1.elementEnd();
                    instructions_1.text(1, 'two');
                }
            }
            expect(render_util_1.renderToHtml(Template, null, defs)).toEqual('<todo><p>Todo one</p></todo>two');
        });
        it('should support a component template with component sibling', function () {
            /**
             * <todo></todo>
             * <todo></todo>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'todo');
                    instructions_1.elementEnd();
                    instructions_1.elementStart(1, 'todo');
                    instructions_1.elementEnd();
                }
            }
            expect(render_util_1.renderToHtml(Template, null, defs))
                .toEqual('<todo><p>Todo one</p></todo><todo><p>Todo one</p></todo>');
        });
        it('should support a component with binding on host element', function () {
            var cmptInstance;
            var TodoComponentHostBinding = /** @class */ (function () {
                function TodoComponentHostBinding() {
                    this.title = 'one';
                }
                TodoComponentHostBinding.ngComponentDef = index_1.defineComponent({
                    type: TodoComponentHostBinding,
                    selectors: [['todo']],
                    template: function TodoComponentHostBindingTemplate(rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.text(0);
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.textBinding(0, instructions_1.bind(ctx.title));
                        }
                    },
                    factory: function () { return cmptInstance = new TodoComponentHostBinding; },
                    hostBindings: function (directiveIndex, elementIndex) {
                        // host bindings
                        instructions_1.elementProperty(elementIndex, 'title', instructions_1.bind(instructions_1.loadDirective(directiveIndex).title));
                    }
                });
                return TodoComponentHostBinding;
            }());
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'todo');
                    instructions_1.elementEnd();
                }
            }
            var defs = [TodoComponentHostBinding];
            expect(render_util_1.renderToHtml(Template, {}, defs)).toEqual('<todo title="one">one</todo>');
            cmptInstance.title = 'two';
            expect(render_util_1.renderToHtml(Template, {}, defs)).toEqual('<todo title="two">two</todo>');
        });
        it('should support root component with host attribute', function () {
            var HostAttributeComp = /** @class */ (function () {
                function HostAttributeComp() {
                }
                HostAttributeComp.ngComponentDef = index_1.defineComponent({
                    type: HostAttributeComp,
                    selectors: [['host-attr-comp']],
                    factory: function () { return new HostAttributeComp(); },
                    template: function (rf, ctx) { },
                    attributes: ['role', 'button']
                });
                return HostAttributeComp;
            }());
            var fixture = new render_util_1.ComponentFixture(HostAttributeComp);
            expect(fixture.hostElement.getAttribute('role')).toEqual('button');
        });
        it('should support component with bindings in template', function () {
            /** <p> {{ name }} </p>*/
            var MyComp = /** @class */ (function () {
                function MyComp() {
                    this.name = 'Bess';
                }
                MyComp.ngComponentDef = index_1.defineComponent({
                    type: MyComp,
                    selectors: [['comp']],
                    template: function MyCompTemplate(rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.elementStart(0, 'p');
                            {
                                instructions_1.text(1);
                            }
                            instructions_1.elementEnd();
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.textBinding(1, instructions_1.bind(ctx.name));
                        }
                    },
                    factory: function () { return new MyComp; }
                });
                return MyComp;
            }());
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp');
                    instructions_1.elementEnd();
                }
            }
            expect(render_util_1.renderToHtml(Template, null, [MyComp])).toEqual('<comp><p>Bess</p></comp>');
        });
        it('should support a component with sub-views', function () {
            /**
             * % if (condition) {
             *   <div>text</div>
             * % }
             */
            var MyComp = /** @class */ (function () {
                function MyComp() {
                }
                MyComp.ngComponentDef = index_1.defineComponent({
                    type: MyComp,
                    selectors: [['comp']],
                    template: function MyCompTemplate(rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.container(0);
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.containerRefreshStart(0);
                            {
                                if (ctx.condition) {
                                    var rf1 = instructions_1.embeddedViewStart(0);
                                    if (rf1 & 1 /* Create */) {
                                        instructions_1.elementStart(0, 'div');
                                        {
                                            instructions_1.text(1, 'text');
                                        }
                                        instructions_1.elementEnd();
                                    }
                                    instructions_1.embeddedViewEnd();
                                }
                            }
                            instructions_1.containerRefreshEnd();
                        }
                    },
                    factory: function () { return new MyComp; },
                    inputs: { condition: 'condition' }
                });
                return MyComp;
            }());
            /** <comp [condition]="condition"></comp> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp');
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'condition', instructions_1.bind(ctx.condition));
                }
            }
            var defs = [MyComp];
            expect(render_util_1.renderToHtml(Template, { condition: true }, defs))
                .toEqual('<comp><div>text</div></comp>');
            expect(render_util_1.renderToHtml(Template, { condition: false }, defs)).toEqual('<comp></comp>');
        });
    });
    describe('tree', function () {
        function showLabel(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.container(0);
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(0);
                {
                    if (ctx.label != null) {
                        var rf1 = instructions_1.embeddedViewStart(0);
                        if (rf1 & 1 /* Create */) {
                            instructions_1.text(0);
                        }
                        if (rf1 & 2 /* Update */) {
                            instructions_1.textBinding(0, instructions_1.bind(ctx.label));
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        }
        function showTree(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.container(0);
                instructions_1.container(1);
                instructions_1.container(2);
            }
            instructions_1.containerRefreshStart(0);
            {
                var rf0 = instructions_1.embeddedViewStart(0);
                {
                    showLabel(rf0, { label: ctx.tree.beforeLabel });
                }
                instructions_1.embeddedViewEnd();
            }
            instructions_1.containerRefreshEnd();
            instructions_1.containerRefreshStart(1);
            {
                for (var _i = 0, _a = ctx.tree.subTrees || []; _i < _a.length; _i++) {
                    var subTree = _a[_i];
                    var rf0 = instructions_1.embeddedViewStart(0);
                    {
                        showTree(rf0, { tree: subTree });
                    }
                    instructions_1.embeddedViewEnd();
                }
            }
            instructions_1.containerRefreshEnd();
            instructions_1.containerRefreshStart(2);
            {
                var rf0 = instructions_1.embeddedViewStart(0);
                {
                    showLabel(rf0, { label: ctx.tree.afterLabel });
                }
                instructions_1.embeddedViewEnd();
            }
            instructions_1.containerRefreshEnd();
        }
        var ChildComponent = /** @class */ (function () {
            function ChildComponent() {
            }
            ChildComponent.ngComponentDef = index_1.defineComponent({
                selectors: [['child']],
                type: ChildComponent,
                template: function ChildComponentTemplate(rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.projectionDef();
                        instructions_1.container(0);
                        instructions_1.projection(1);
                        instructions_1.container(2);
                    }
                    instructions_1.containerRefreshStart(0);
                    {
                        var rf0 = instructions_1.embeddedViewStart(0);
                        {
                            showTree(rf0, { tree: ctx.beforeTree });
                        }
                        instructions_1.embeddedViewEnd();
                    }
                    instructions_1.containerRefreshEnd();
                    instructions_1.containerRefreshStart(2);
                    {
                        var rf0 = instructions_1.embeddedViewStart(0);
                        {
                            showTree(rf0, { tree: ctx.afterTree });
                        }
                        instructions_1.embeddedViewEnd();
                    }
                    instructions_1.containerRefreshEnd();
                },
                factory: function () { return new ChildComponent; },
                inputs: { beforeTree: 'beforeTree', afterTree: 'afterTree' }
            });
            return ChildComponent;
        }());
        function parentTemplate(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'child');
                {
                    instructions_1.container(1);
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.elementProperty(0, 'beforeTree', instructions_1.bind(ctx.beforeTree));
                instructions_1.elementProperty(0, 'afterTree', instructions_1.bind(ctx.afterTree));
                instructions_1.containerRefreshStart(1);
                {
                    var rf0 = instructions_1.embeddedViewStart(0);
                    {
                        showTree(rf0, { tree: ctx.projectedTree });
                    }
                    instructions_1.embeddedViewEnd();
                }
                instructions_1.containerRefreshEnd();
            }
        }
        it('should work with a tree', function () {
            var ctx = {
                beforeTree: { subTrees: [{ beforeLabel: 'a' }] },
                projectedTree: { beforeLabel: 'p' },
                afterTree: { afterLabel: 'z' }
            };
            var defs = [ChildComponent];
            expect(render_util_1.renderToHtml(parentTemplate, ctx, defs)).toEqual('<child>apz</child>');
            ctx.projectedTree = { subTrees: [{}, {}, { subTrees: [{}, {}] }, {}] };
            ctx.beforeTree.subTrees.push({ afterLabel: 'b' });
            expect(render_util_1.renderToHtml(parentTemplate, ctx, defs)).toEqual('<child>abz</child>');
            ctx.projectedTree.subTrees[1].afterLabel = 'h';
            expect(render_util_1.renderToHtml(parentTemplate, ctx, defs)).toEqual('<child>abhz</child>');
            ctx.beforeTree.subTrees.push({ beforeLabel: 'c' });
            expect(render_util_1.renderToHtml(parentTemplate, ctx, defs)).toEqual('<child>abchz</child>');
            // To check the context easily:
            // console.log(JSON.stringify(ctx));
        });
    });
    describe('element bindings', function () {
        describe('elementAttribute', function () {
            it('should support attribute bindings', function () {
                var ctx = { title: 'Hello' };
                function Template(rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'span');
                        instructions_1.elementEnd();
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.elementAttribute(0, 'title', instructions_1.bind(ctx.title));
                    }
                }
                // initial binding
                expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<span title="Hello"></span>');
                // update binding
                ctx.title = 'Hi!';
                expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<span title="Hi!"></span>');
                // remove attribute
                ctx.title = null;
                expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<span></span>');
            });
            it('should stringify values used attribute bindings', function () {
                var ctx = { title: NaN };
                function Template(rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'span');
                        instructions_1.elementEnd();
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.elementAttribute(0, 'title', instructions_1.bind(ctx.title));
                    }
                }
                expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<span title="NaN"></span>');
                ctx.title = { toString: function () { return 'Custom toString'; } };
                expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<span title="Custom toString"></span>');
            });
            it('should update bindings', function () {
                function Template(rf, c) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'b');
                        instructions_1.elementEnd();
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.elementAttribute(0, 'a', instructions_1.interpolationV(c));
                        instructions_1.elementAttribute(0, 'a0', instructions_1.bind(c[1]));
                        instructions_1.elementAttribute(0, 'a1', instructions_1.interpolation1(c[0], c[1], c[16]));
                        instructions_1.elementAttribute(0, 'a2', instructions_1.interpolation2(c[0], c[1], c[2], c[3], c[16]));
                        instructions_1.elementAttribute(0, 'a3', instructions_1.interpolation3(c[0], c[1], c[2], c[3], c[4], c[5], c[16]));
                        instructions_1.elementAttribute(0, 'a4', instructions_1.interpolation4(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[16]));
                        instructions_1.elementAttribute(0, 'a5', instructions_1.interpolation5(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8], c[9], c[16]));
                        instructions_1.elementAttribute(0, 'a6', instructions_1.interpolation6(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8], c[9], c[10], c[11], c[16]));
                        instructions_1.elementAttribute(0, 'a7', instructions_1.interpolation7(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8], c[9], c[10], c[11], c[12], c[13], c[16]));
                        instructions_1.elementAttribute(0, 'a8', instructions_1.interpolation8(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8], c[9], c[10], c[11], c[12], c[13], c[14], c[15], c[16]));
                    }
                }
                var args = ['(', 0, 'a', 1, 'b', 2, 'c', 3, 'd', 4, 'e', 5, 'f', 6, 'g', 7, ')'];
                expect(render_util_1.renderToHtml(Template, args))
                    .toEqual('<b a="(0a1b2c3d4e5f6g7)" a0="0" a1="(0)" a2="(0a1)" a3="(0a1b2)" a4="(0a1b2c3)" a5="(0a1b2c3d4)" a6="(0a1b2c3d4e5)" a7="(0a1b2c3d4e5f6)" a8="(0a1b2c3d4e5f6g7)"></b>');
                args = args.reverse();
                expect(render_util_1.renderToHtml(Template, args))
                    .toEqual('<b a=")7g6f5e4d3c2b1a0(" a0="7" a1=")7(" a2=")7g6(" a3=")7g6f5(" a4=")7g6f5e4(" a5=")7g6f5e4d3(" a6=")7g6f5e4d3c2(" a7=")7g6f5e4d3c2b1(" a8=")7g6f5e4d3c2b1a0("></b>');
                args = args.reverse();
                expect(render_util_1.renderToHtml(Template, args))
                    .toEqual('<b a="(0a1b2c3d4e5f6g7)" a0="0" a1="(0)" a2="(0a1)" a3="(0a1b2)" a4="(0a1b2c3)" a5="(0a1b2c3d4)" a6="(0a1b2c3d4e5)" a7="(0a1b2c3d4e5f6)" a8="(0a1b2c3d4e5f6g7)"></b>');
            });
            it('should not update DOM if context has not changed', function () {
                var ctx = { title: 'Hello' };
                function Template(rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'span');
                        instructions_1.container(1);
                        instructions_1.elementEnd();
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.elementAttribute(0, 'title', instructions_1.bind(ctx.title));
                        instructions_1.containerRefreshStart(1);
                        {
                            if (true) {
                                var rf1 = instructions_1.embeddedViewStart(1);
                                {
                                    if (rf1 & 1 /* Create */) {
                                        instructions_1.elementStart(0, 'b');
                                        { }
                                        instructions_1.elementEnd();
                                    }
                                    instructions_1.elementAttribute(0, 'title', instructions_1.bind(ctx.title));
                                }
                                instructions_1.embeddedViewEnd();
                            }
                        }
                        instructions_1.containerRefreshEnd();
                    }
                }
                // initial binding
                expect(render_util_1.renderToHtml(Template, ctx))
                    .toEqual('<span title="Hello"><b title="Hello"></b></span>');
                // update DOM manually
                render_util_1.containerEl.querySelector('b').setAttribute('title', 'Goodbye');
                // refresh with same binding
                expect(render_util_1.renderToHtml(Template, ctx))
                    .toEqual('<span title="Hello"><b title="Goodbye"></b></span>');
                // refresh again with same binding
                expect(render_util_1.renderToHtml(Template, ctx))
                    .toEqual('<span title="Hello"><b title="Goodbye"></b></span>');
            });
            it('should support host attribute bindings', function () {
                var hostBindingDir;
                var HostBindingDir = /** @class */ (function () {
                    function HostBindingDir() {
                        /* @HostBinding('attr.aria-label') */
                        this.label = 'some label';
                    }
                    HostBindingDir.ngDirectiveDef = index_1.defineDirective({
                        type: HostBindingDir,
                        selectors: [['', 'hostBindingDir', '']],
                        factory: function HostBindingDir_Factory() {
                            return hostBindingDir = new HostBindingDir();
                        },
                        hostBindings: function HostBindingDir_HostBindings(dirIndex, elIndex) {
                            instructions_1.elementAttribute(elIndex, 'aria-label', instructions_1.bind(instructions_1.loadDirective(dirIndex).label));
                        }
                    });
                    return HostBindingDir;
                }());
                function Template(rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'div', ['hostBindingDir', '']);
                        instructions_1.elementEnd();
                    }
                }
                var defs = [HostBindingDir];
                expect(render_util_1.renderToHtml(Template, {}, defs))
                    .toEqual("<div aria-label=\"some label\" hostbindingdir=\"\"></div>");
                hostBindingDir.label = 'other label';
                expect(render_util_1.renderToHtml(Template, {}, defs))
                    .toEqual("<div aria-label=\"other label\" hostbindingdir=\"\"></div>");
            });
        });
        describe('elementStyle', function () {
            it('should support binding to styles', function () {
                function Template(rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'span');
                        instructions_1.elementStyling(null, ['border-color']);
                        instructions_1.elementEnd();
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.elementStyleProp(0, 0, ctx);
                        instructions_1.elementStylingApply(0);
                    }
                }
                expect(render_util_1.renderToHtml(Template, 'red')).toEqual('<span style="border-color: red;"></span>');
                expect(render_util_1.renderToHtml(Template, 'green'))
                    .toEqual('<span style="border-color: green;"></span>');
                expect(render_util_1.renderToHtml(Template, null)).toEqual('<span></span>');
            });
            it('should support binding to styles with suffix', function () {
                function Template(rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'span');
                        instructions_1.elementStyling(null, ['font-size']);
                        instructions_1.elementEnd();
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.elementStyleProp(0, 0, ctx, 'px');
                        instructions_1.elementStylingApply(0);
                    }
                }
                expect(render_util_1.renderToHtml(Template, '100')).toEqual('<span style="font-size: 100px;"></span>');
                expect(render_util_1.renderToHtml(Template, 200)).toEqual('<span style="font-size: 200px;"></span>');
                expect(render_util_1.renderToHtml(Template, null)).toEqual('<span></span>');
            });
        });
        describe('elementClass', function () {
            it('should support CSS class toggle', function () {
                function Template(rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'span');
                        instructions_1.elementStyling(['active']);
                        instructions_1.elementEnd();
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.elementClassProp(0, 0, ctx);
                        instructions_1.elementStylingApply(0);
                    }
                }
                expect(render_util_1.renderToHtml(Template, true)).toEqual('<span class="active"></span>');
                expect(render_util_1.renderToHtml(Template, false)).toEqual('<span class=""></span>');
                // truthy values
                expect(render_util_1.renderToHtml(Template, 'a_string')).toEqual('<span class="active"></span>');
                expect(render_util_1.renderToHtml(Template, 10)).toEqual('<span class="active"></span>');
                // falsy values
                expect(render_util_1.renderToHtml(Template, '')).toEqual('<span class=""></span>');
                expect(render_util_1.renderToHtml(Template, 0)).toEqual('<span class=""></span>');
            });
            it('should work correctly with existing static classes', function () {
                function Template(rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'span');
                        instructions_1.elementStyling(['existing', 'active', 1 /* VALUES_MODE */, 'existing', true]);
                        instructions_1.elementEnd();
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.elementClassProp(0, 1, ctx);
                        instructions_1.elementStylingApply(0);
                    }
                }
                expect(render_util_1.renderToHtml(Template, true)).toEqual('<span class="existing active"></span>');
                expect(render_util_1.renderToHtml(Template, false)).toEqual('<span class="existing"></span>');
            });
        });
    });
    describe('template data', function () {
        it('should re-use template data and node data', function () {
            /**
             *  % if (condition) {
             *    <div></div>
             *  % }
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.container(0);
                }
                if (rf & 2 /* Update */) {
                    instructions_1.containerRefreshStart(0);
                    {
                        if (ctx.condition) {
                            var rf1 = instructions_1.embeddedViewStart(0);
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'div');
                                instructions_1.elementEnd();
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            expect(Template.ngPrivateData).toBeUndefined();
            render_util_1.renderToHtml(Template, { condition: true });
            var oldTemplateData = Template.ngPrivateData;
            var oldContainerData = oldTemplateData.data[view_1.HEADER_OFFSET];
            var oldElementData = oldContainerData.tViews[0][view_1.HEADER_OFFSET];
            expect(oldContainerData).not.toBeNull();
            expect(oldElementData).not.toBeNull();
            render_util_1.renderToHtml(Template, { condition: false });
            render_util_1.renderToHtml(Template, { condition: true });
            var newTemplateData = Template.ngPrivateData;
            var newContainerData = oldTemplateData.data[view_1.HEADER_OFFSET];
            var newElementData = oldContainerData.tViews[0][view_1.HEADER_OFFSET];
            expect(newTemplateData === oldTemplateData).toBe(true);
            expect(newContainerData === oldContainerData).toBe(true);
            expect(newElementData === oldElementData).toBe(true);
        });
    });
    describe('sanitization', function () {
        it('should sanitize data using the provided sanitization interface', function () {
            var SanitizationComp = /** @class */ (function () {
                function SanitizationComp() {
                    this.href = '';
                }
                SanitizationComp.prototype.updateLink = function (href) { this.href = href; };
                SanitizationComp.ngComponentDef = index_1.defineComponent({
                    type: SanitizationComp,
                    selectors: [['sanitize-this']],
                    factory: function () { return new SanitizationComp(); },
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.elementStart(0, 'a');
                            instructions_1.elementEnd();
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.elementProperty(0, 'href', instructions_1.bind(ctx.href), sanitization_1.sanitizeUrl);
                        }
                    }
                });
                return SanitizationComp;
            }());
            var sanitizer = new LocalSanitizer(function (value) { return 'http://bar'; });
            var fixture = new render_util_1.ComponentFixture(SanitizationComp, { sanitizer: sanitizer });
            fixture.component.updateLink('http://foo');
            fixture.update();
            var element = fixture.hostElement.querySelector('a');
            expect(element.getAttribute('href')).toEqual('http://bar');
            fixture.component.updateLink(sanitizer.bypassSecurityTrustUrl('http://foo'));
            fixture.update();
            expect(element.getAttribute('href')).toEqual('http://foo');
        });
    });
});
var LocalSanitizedValue = /** @class */ (function () {
    function LocalSanitizedValue(value) {
        this.value = value;
    }
    LocalSanitizedValue.prototype.toString = function () { return this.value; };
    return LocalSanitizedValue;
}());
var LocalSanitizer = /** @class */ (function () {
    function LocalSanitizer(_interceptor) {
        this._interceptor = _interceptor;
    }
    LocalSanitizer.prototype.sanitize = function (context, value) {
        if (value instanceof LocalSanitizedValue) {
            return value.toString();
        }
        return this._interceptor(value);
    };
    LocalSanitizer.prototype.bypassSecurityTrustHtml = function (value) { };
    LocalSanitizer.prototype.bypassSecurityTrustStyle = function (value) { };
    LocalSanitizer.prototype.bypassSecurityTrustScript = function (value) { };
    LocalSanitizer.prototype.bypassSecurityTrustResourceUrl = function (value) { };
    LocalSanitizer.prototype.bypassSecurityTrustUrl = function (value) { return new LocalSanitizedValue(value); };
    return LocalSanitizer;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWdyYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9yZW5kZXIzL2ludGVncmF0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFJSCxpREFBeUU7QUFDekUsK0RBQW1mO0FBRW5mLDBEQUFnRTtBQUNoRSxvRUFBZ0U7QUFHaEUsNkNBQTBFO0FBRTFFLFFBQVEsQ0FBQywwQkFBMEIsRUFBRTtJQUVuQyxRQUFRLENBQUMsUUFBUSxFQUFFO1FBRWpCLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRTtZQUNqQyxNQUFNLENBQUMsMEJBQVksQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsc0NBQXNDLENBQUMsQ0FBQztZQUVuRixrQkFBa0IsRUFBZSxFQUFFLEdBQVE7Z0JBQ3pDLElBQUksRUFBRSxpQkFBcUIsRUFBRTtvQkFDM0IsMkJBQVksQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQzVDO3dCQUFFLG1CQUFJLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO3FCQUFFO29CQUN6Qix5QkFBVSxFQUFFLENBQUM7aUJBQ2Q7WUFDSCxDQUFDO1lBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDO2dCQUNqQyxpQkFBaUIsRUFBRSxDQUFDO2dCQUNwQixLQUFLLEVBQUUsQ0FBQztnQkFDUixLQUFLLEVBQUUsQ0FBQztnQkFDUixxQkFBcUIsRUFBRSxDQUFDO2FBQ3pCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHdEQUF3RCxFQUFFO1lBQzNELE1BQU0sQ0FBQywwQkFBWSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx3QkFBd0Is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QUMsRUFBRSxJQUFJLEVBQUUsbUJBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN0QywrQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLDZCQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM3RCwrQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLDZCQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3pFLCtCQUFnQixDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsNkJBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNyRiwrQkFBZ0IsQ0FDWixDQUFDLEVBQUUsSUFBSSxFQUFFLDZCQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwRiwrQkFBZ0IsQ0FDWixDQUFDLEVBQUUsSUFBSSxFQUNQLDZCQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3ZGLCtCQUFnQixDQUNaLENBQUMsRUFBRSxJQUFJLEVBQUUsNkJBQWMsQ0FDVixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUNqRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDaEMsK0JBQWdCLENBQ1osQ0FBQyxFQUFFLElBQUksRUFBRSw2QkFBYyxDQUNWLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQ2pFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzlDLCtCQUFnQixDQUNaLENBQUMsRUFBRSxJQUFJLEVBQUUsNkJBQWMsQ0FDVixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUNqRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQzdEO2dCQUNILENBQUM7Z0JBQ0QsSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFF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