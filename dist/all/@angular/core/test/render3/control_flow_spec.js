"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var definition_1 = require("../../src/render3/definition");
var instructions_1 = require("../../src/render3/instructions");
var render_util_1 = require("./render_util");
describe('JS control flow', function () {
    it('should work with if block', function () {
        var ctx = { message: 'Hello', condition: true };
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.container(1);
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(1);
                {
                    if (ctx.condition) {
                        var rf1 = instructions_1.embeddedViewStart(1);
                        {
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'span');
                                {
                                    instructions_1.text(1);
                                }
                                instructions_1.elementEnd();
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.textBinding(1, instructions_1.bind(ctx.message));
                            }
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
            }
            instructions_1.containerRefreshEnd();
        }
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div><span>Hello</span></div>');
        ctx.condition = false;
        ctx.message = 'Hi!';
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div></div>');
        ctx.condition = true;
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div><span>Hi!</span></div>');
    });
    it('should work with nested if blocks', function () {
        var ctx = { condition: true, condition2: true };
        /**
         * <div>
         *   % if(ctx.condition) {
         *     <span>
         *       % if(ctx.condition2) {
         *          Hello
         *       % }
         *     </span>
         *   % }
         * </div>
         */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.container(1);
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(1);
                {
                    if (ctx.condition) {
                        var rf1 = instructions_1.embeddedViewStart(1);
                        {
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'span');
                                {
                                    instructions_1.container(1);
                                }
                                instructions_1.elementEnd();
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.containerRefreshStart(1);
                                {
                                    if (ctx.condition2) {
                                        var rf2 = instructions_1.embeddedViewStart(2);
                                        {
                                            if (rf2 & 1 /* Create */) {
                                                instructions_1.text(0, 'Hello');
                                            }
                                        }
                                        instructions_1.embeddedViewEnd();
                                    }
                                }
                                instructions_1.containerRefreshEnd();
                            }
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        }
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div><span>Hello</span></div>');
        ctx.condition = false;
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div></div>');
        ctx.condition = true;
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div><span>Hello</span></div>');
        ctx.condition2 = false;
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div><span></span></div>');
        ctx.condition2 = true;
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div><span>Hello</span></div>');
        ctx.condition2 = false;
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div><span></span></div>');
        ctx.condition = false;
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div></div>');
        ctx.condition = true;
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div><span></span></div>');
        ctx.condition2 = true;
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div><span>Hello</span></div>');
    });
    it('should work with nested adjacent if blocks', function () {
        var ctx = { condition: true, condition2: false, condition3: true };
        /**
         * % if(ctx.condition) {
         *   % if(ctx.condition2) {
         *     Hello
         *   % }
         *   % if(ctx.condition3) {
         *     World
         *   % }
         * % }
         */
        function createTemplate() { instructions_1.container(0); }
        function updateTemplate() {
            instructions_1.containerRefreshStart(0);
            {
                if (ctx.condition) {
                    var rf1 = instructions_1.embeddedViewStart(1);
                    {
                        if (rf1 & 1 /* Create */) {
                            {
                                instructions_1.container(0);
                            }
                            {
                                instructions_1.container(1);
                            }
                        }
                        if (rf1 & 2 /* Update */) {
                            instructions_1.containerRefreshStart(0);
                            {
                                if (ctx.condition2) {
                                    var rf2 = instructions_1.embeddedViewStart(2);
                                    {
                                        if (rf2 & 1 /* Create */) {
                                            instructions_1.text(0, 'Hello');
                                        }
                                    }
                                    instructions_1.embeddedViewEnd();
                                }
                            }
                            instructions_1.containerRefreshEnd();
                            instructions_1.containerRefreshStart(1);
                            {
                                if (ctx.condition3) {
                                    var rf2 = instructions_1.embeddedViewStart(2);
                                    {
                                        if (rf2 & 1 /* Create */) {
                                            instructions_1.text(0, 'World');
                                        }
                                    }
                                    instructions_1.embeddedViewEnd();
                                }
                            }
                            instructions_1.containerRefreshEnd();
                        }
                    }
                    instructions_1.embeddedViewEnd();
                }
            }
            instructions_1.containerRefreshEnd();
        }
        var fixture = new render_util_1.TemplateFixture(createTemplate, updateTemplate);
        expect(fixture.html).toEqual('World');
        ctx.condition2 = true;
        fixture.update();
        expect(fixture.html).toEqual('HelloWorld');
    });
    it('should work with adjacent if blocks managing views in the same container', function () {
        var ctx = { condition1: true, condition2: true, condition3: true };
        /**
        *   % if(ctx.condition1) {
        *     1
        *   % }; if(ctx.condition2) {
        *     2
        *   % }; if(ctx.condition3) {
        *     3
        *   % }
        */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.container(0);
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(0);
                if (ctx.condition1) {
                    var rf1 = instructions_1.embeddedViewStart(1);
                    if (rf1 & 1 /* Create */) {
                        instructions_1.text(0, '1');
                    }
                    instructions_1.embeddedViewEnd();
                } // can't have ; here due linting rules
                if (ctx.condition2) {
                    var rf2 = instructions_1.embeddedViewStart(2);
                    if (rf2 & 1 /* Create */) {
                        instructions_1.text(0, '2');
                    }
                    instructions_1.embeddedViewEnd();
                } // can't have ; here due linting rules
                if (ctx.condition3) {
                    var rf3 = instructions_1.embeddedViewStart(3);
                    if (rf3 & 1 /* Create */) {
                        instructions_1.text(0, '3');
                    }
                    instructions_1.embeddedViewEnd();
                }
                instructions_1.containerRefreshEnd();
            }
        }
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('123');
        ctx.condition2 = false;
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('13');
    });
    it('should work with containers with views as parents', function () {
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.text(1, 'hello');
                }
                instructions_1.elementEnd();
                instructions_1.container(2);
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(2);
                {
                    if (ctx.condition1) {
                        var rf0 = instructions_1.embeddedViewStart(0);
                        {
                            if (rf0 & 1 /* Create */) {
                                instructions_1.container(0);
                            }
                            if (rf0 & 2 /* Update */) {
                                instructions_1.containerRefreshStart(0);
                                {
                                    if (ctx.condition2) {
                                        var rf0_1 = instructions_1.embeddedViewStart(0);
                                        {
                                            if (rf0_1 & 1 /* Create */) {
                                                instructions_1.text(0, 'world');
                                            }
                                        }
                                        instructions_1.embeddedViewEnd();
                                    }
                                }
                                instructions_1.containerRefreshEnd();
                            }
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        }
        expect(render_util_1.renderToHtml(Template, { condition1: true, condition2: true }))
            .toEqual('<div>hello</div>world');
        expect(render_util_1.renderToHtml(Template, { condition1: false, condition2: false }))
            .toEqual('<div>hello</div>');
    });
    it('should work with loop block', function () {
        var ctx = { data: ['a', 'b', 'c'] };
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'ul');
                {
                    instructions_1.container(1);
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(1);
                {
                    for (var i = 0; i < ctx.data.length; i++) {
                        var rf1 = instructions_1.embeddedViewStart(1);
                        {
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'li');
                                {
                                    instructions_1.text(1);
                                }
                                instructions_1.elementEnd();
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.textBinding(1, instructions_1.bind(ctx.data[i]));
                            }
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        }
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<ul><li>a</li><li>b</li><li>c</li></ul>');
        ctx.data = ['e', 'f'];
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<ul><li>e</li><li>f</li></ul>');
        ctx.data = [];
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<ul></ul>');
        ctx.data = ['a', 'b', 'c'];
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<ul><li>a</li><li>b</li><li>c</li></ul>');
        ctx.data.push('d');
        expect(render_util_1.renderToHtml(Template, ctx))
            .toEqual('<ul><li>a</li><li>b</li><li>c</li><li>d</li></ul>');
        ctx.data = ['e'];
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<ul><li>e</li></ul>');
    });
    it('should work with nested loop blocks', function () {
        var ctx = { data: [['a', 'b', 'c'], ['m', 'n']] };
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'ul');
                {
                    instructions_1.container(1);
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(1);
                {
                    var _loop_1 = function (i) {
                        var rf1 = instructions_1.embeddedViewStart(1);
                        {
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'li');
                                {
                                    instructions_1.container(1);
                                }
                                instructions_1.elementEnd();
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.containerRefreshStart(1);
                                {
                                    ctx.data[1].forEach(function (value, ind) {
                                        var rf2 = instructions_1.embeddedViewStart(2);
                                        if (rf2 & 1 /* Create */) {
                                            instructions_1.text(0);
                                        }
                                        if (rf2 & 2 /* Update */) {
                                            instructions_1.textBinding(0, instructions_1.bind(ctx.data[0][i] + value));
                                        }
                                        instructions_1.embeddedViewEnd();
                                    });
                                }
                                instructions_1.containerRefreshEnd();
                            }
                        }
                        instructions_1.embeddedViewEnd();
                    };
                    for (var i = 0; i < ctx.data[0].length; i++) {
                        _loop_1(i);
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        }
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<ul><li>aman</li><li>bmbn</li><li>cmcn</li></ul>');
        ctx.data = [[], []];
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<ul></ul>');
    });
    it('should work with nested loop blocks where nested container is a root node', function () {
        /**
         * <div>
         *   Before
         *   % for (let i = 0; i < cafes.length; i++) {
         *      <h2> {{ cafes[i].name }} </h2>
         *      % for (let j = 0; j < cafes[i].entrees; j++) {
         *        {{ cafes[i].entrees[j] }}
         *      % }
         *      -
         *   % }
         *   After
         * <div>
         */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.text(1, 'Before');
                    instructions_1.container(2);
                    instructions_1.text(3, 'After');
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(2);
                {
                    for (var i = 0; i < ctx.cafes.length; i++) {
                        var rf1 = instructions_1.embeddedViewStart(1);
                        {
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'h2');
                                {
                                    instructions_1.text(1);
                                }
                                instructions_1.elementEnd();
                                instructions_1.container(2);
                                instructions_1.text(3, '-');
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.textBinding(1, instructions_1.bind(ctx.cafes[i].name));
                                instructions_1.containerRefreshStart(2);
                                {
                                    for (var j = 0; j < ctx.cafes[i].entrees.length; j++) {
                                        var rf2 = instructions_1.embeddedViewStart(2);
                                        if (rf2 & 1 /* Create */) {
                                            instructions_1.text(0);
                                        }
                                        if (rf2 & 2 /* Update */) {
                                            instructions_1.textBinding(0, instructions_1.bind(ctx.cafes[i].entrees[j]));
                                        }
                                        instructions_1.embeddedViewEnd();
                                    }
                                }
                                instructions_1.containerRefreshEnd();
                            }
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        }
        var ctx = {
            cafes: [
                { name: '1', entrees: ['a', 'b', 'c'] }, { name: '2', entrees: ['d', 'e', 'f'] },
                { name: '3', entrees: ['g', 'h', 'i'] }
            ]
        };
        expect(render_util_1.renderToHtml(Template, ctx))
            .toEqual('<div>Before<h2>1</h2>abc-<h2>2</h2>def-<h2>3</h2>ghi-After</div>');
        ctx.cafes = [];
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div>BeforeAfter</div>');
        ctx.cafes = [
            { name: '1', entrees: ['a', 'c'] },
            { name: '2', entrees: ['d', 'e'] },
        ];
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div>Before<h2>1</h2>ac-<h2>2</h2>de-After</div>');
    });
    it('should work with loop blocks nested three deep', function () {
        /**
         * <div>
         *   Before
         *   % for (let i = 0; i < cafes.length; i++) {
           *      <h2> {{ cafes[i].name }} </h2>
           *      % for (let j = 0; j < cafes[i].entrees.length; j++) {
           *        <h3>  {{ cafes[i].entrees[j].name }} </h3>
           *        % for (let k = 0; k < cafes[i].entrees[j].foods.length; k++) {
           *          {{ cafes[i].entrees[j].foods[k] }}
           *        % }
           *      % }
           *      -
           *   % }
         *   After
         * <div>
         */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.text(1, 'Before');
                    instructions_1.container(2);
                    instructions_1.text(3, 'After');
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(2);
                {
                    for (var i = 0; i < ctx.cafes.length; i++) {
                        var rf1 = instructions_1.embeddedViewStart(1);
                        {
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'h2');
                                {
                                    instructions_1.text(1);
                                }
                                instructions_1.elementEnd();
                                instructions_1.container(2);
                                instructions_1.text(3, '-');
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.textBinding(1, instructions_1.bind(ctx.cafes[i].name));
                                instructions_1.containerRefreshStart(2);
                                {
                                    for (var j = 0; j < ctx.cafes[i].entrees.length; j++) {
                                        var rf1_1 = instructions_1.embeddedViewStart(1);
                                        {
                                            if (rf1_1 & 1 /* Create */) {
                                                instructions_1.elementStart(0, 'h3');
                                                {
                                                    instructions_1.text(1);
                                                }
                                                instructions_1.elementEnd();
                                                instructions_1.container(2);
                                            }
                                            if (rf1_1 & 2 /* Update */) {
                                                instructions_1.textBinding(1, instructions_1.bind(ctx.cafes[i].entrees[j].name));
                                                instructions_1.containerRefreshStart(2);
                                                {
                                                    for (var k = 0; k < ctx.cafes[i].entrees[j].foods.length; k++) {
                                                        var rf2 = instructions_1.embeddedViewStart(1);
                                                        if (rf2 & 1 /* Create */) {
                                                            instructions_1.text(0);
                                                        }
                                                        if (rf2 & 2 /* Update */) {
                                                            instructions_1.textBinding(0, instructions_1.bind(ctx.cafes[i].entrees[j].foods[k]));
                                                        }
                                                        instructions_1.embeddedViewEnd();
                                                    }
                                                }
                                                instructions_1.containerRefreshEnd();
                                            }
                                        }
                                        instructions_1.embeddedViewEnd();
                                    }
                                }
                                instructions_1.containerRefreshEnd();
                            }
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        }
        var ctx = {
            cafes: [
                {
                    name: '1',
                    entrees: [{ name: 'a', foods: [1, 2] }, { name: 'b', foods: [3, 4] }, { name: 'c', foods: [5, 6] }]
                },
                {
                    name: '2',
                    entrees: [
                        { name: 'd', foods: [1, 2] }, { name: 'e', foods: [3, 4] }, { name: 'f', foods: [5, 6] }
                    ]
                }
            ]
        };
        expect(render_util_1.renderToHtml(Template, ctx))
            .toEqual('<div>' +
            'Before' +
            '<h2>1</h2><h3>a</h3>12<h3>b</h3>34<h3>c</h3>56-' +
            '<h2>2</h2><h3>d</h3>12<h3>e</h3>34<h3>f</h3>56-' +
            'After' +
            '</div>');
        ctx.cafes = [];
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div>BeforeAfter</div>');
    });
    it('should work with if/else blocks', function () {
        var ctx = { message: 'Hello', condition: true };
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.container(1);
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(1);
                {
                    if (ctx.condition) {
                        var rf1 = instructions_1.embeddedViewStart(1);
                        {
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'span');
                                {
                                    instructions_1.text(1, 'Hello');
                                }
                                instructions_1.elementEnd();
                            }
                        }
                        instructions_1.embeddedViewEnd();
                    }
                    else {
                        var rf2 = instructions_1.embeddedViewStart(2);
                        {
                            if (rf2) {
                                instructions_1.elementStart(0, 'div');
                                {
                                    instructions_1.text(1, 'Goodbye');
                                }
                                instructions_1.elementEnd();
                            }
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        }
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div><span>Hello</span></div>');
        ctx.condition = false;
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div><div>Goodbye</div></div>');
        ctx.condition = true;
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div><span>Hello</span></div>');
    });
    it('should work with sibling if blocks with children', function () {
        var log = [];
        // Intentionally duplicating the templates in test below so we are
        // testing the behavior on firstTemplatePass for each of these tests
        var Comp = /** @class */ (function () {
            function Comp() {
            }
            Comp.ngComponentDef = definition_1.defineComponent({
                type: Comp,
                selectors: [['comp']],
                factory: function () {
                    log.push('comp!');
                    return new Comp();
                },
                template: function (rf, ctx) { }
            });
            return Comp;
        }());
        var App = /** @class */ (function () {
            function App() {
                this.condition = true;
                this.condition2 = true;
            }
            App.ngComponentDef = definition_1.defineComponent({
                type: App,
                selectors: [['app']],
                factory: function () { return new App(); },
                template: function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'div');
                        instructions_1.elementEnd();
                        instructions_1.container(1);
                        instructions_1.container(2);
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.containerRefreshStart(1);
                        {
                            if (ctx.condition) {
                                var rf1 = instructions_1.embeddedViewStart(0);
                                if (rf1 & 1 /* Create */) {
                                    instructions_1.elementStart(0, 'comp');
                                    instructions_1.elementEnd();
                                }
                                instructions_1.embeddedViewEnd();
                            }
                        }
                        instructions_1.containerRefreshEnd();
                        instructions_1.containerRefreshStart(2);
                        {
                            if (ctx.condition2) {
                                var rf1 = instructions_1.embeddedViewStart(0);
                                if (rf1 & 1 /* Create */) {
                                    instructions_1.elementStart(0, 'comp');
                                    instructions_1.elementEnd();
                                }
                                instructions_1.embeddedViewEnd();
                            }
                        }
                        instructions_1.containerRefreshEnd();
                    }
                },
                directives: function () { return [Comp]; }
            });
            return App;
        }());
        var fixture = new render_util_1.ComponentFixture(App);
        expect(log).toEqual(['comp!', 'comp!']);
    });
    it('should work with a sibling if block that starts closed', function () {
        var log = [];
        // Intentionally duplicating the templates from above so we are
        // testing the behavior on firstTemplatePass for each of these tests
        var Comp = /** @class */ (function () {
            function Comp() {
            }
            Comp.ngComponentDef = definition_1.defineComponent({
                type: Comp,
                selectors: [['comp']],
                factory: function () {
                    log.push('comp!');
                    return new Comp();
                },
                template: function (rf, ctx) { }
            });
            return Comp;
        }());
        var App = /** @class */ (function () {
            function App() {
                this.condition = false;
                this.condition2 = true;
            }
            App.ngComponentDef = definition_1.defineComponent({
                type: App,
                selectors: [['app']],
                factory: function () { return new App(); },
                template: function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'div');
                        instructions_1.elementEnd();
                        instructions_1.container(1);
                        instructions_1.container(2);
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.containerRefreshStart(1);
                        {
                            if (ctx.condition) {
                                var rf1 = instructions_1.embeddedViewStart(0);
                                if (rf1 & 1 /* Create */) {
                                    instructions_1.elementStart(0, 'comp');
                                    instructions_1.elementEnd();
                                }
                                instructions_1.embeddedViewEnd();
                            }
                        }
                        instructions_1.containerRefreshEnd();
                        instructions_1.containerRefreshStart(2);
                        {
                            if (ctx.condition2) {
                                var rf1 = instructions_1.embeddedViewStart(0);
                                if (rf1 & 1 /* Create */) {
                                    instructions_1.elementStart(0, 'comp');
                                    instructions_1.elementEnd();
                                }
                                instructions_1.embeddedViewEnd();
                            }
                        }
                        instructions_1.containerRefreshEnd();
                    }
                },
                directives: function () { return [Comp]; }
            });
            return App;
        }());
        var fixture = new render_util_1.ComponentFixture(App);
        expect(log).toEqual(['comp!']);
        fixture.component.condition = true;
        fixture.update();
        expect(log).toEqual(['comp!', 'comp!']);
    });
});
describe('JS for loop', function () {
    it('should work with sibling for blocks', function () {
        var ctx = { data1: ['a', 'b', 'c'], data2: [1, 2] };
        /**
         * <div>
         *    % for (let i = 0; i < ctx.data1.length; i++) {
         *        {{data1[i]}}
         *    % } for (let j = 0; j < ctx.data2.length; j++) {
         *        {{data1[j]}}
         *    % }
         * </div>
         */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.container(1);
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(1);
                {
                    for (var i = 0; i < ctx.data1.length; i++) {
                        var rf2 = instructions_1.embeddedViewStart(1);
                        if (rf2 & 1 /* Create */) {
                            instructions_1.text(0);
                        }
                        if (rf2 & 2 /* Update */) {
                            instructions_1.textBinding(0, instructions_1.bind(ctx.data1[i]));
                        }
                        instructions_1.embeddedViewEnd();
                    }
                    for (var j = 0; j < ctx.data2.length; j++) {
                        var rf2 = instructions_1.embeddedViewStart(1);
                        if (rf2 & 1 /* Create */) {
                            instructions_1.text(0);
                        }
                        if (rf2 & 2 /* Update */) {
                            instructions_1.textBinding(0, instructions_1.bind(ctx.data2[j]));
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        }
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div>abc12</div>');
        ctx.data1 = ['e', 'f'];
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div>ef12</div>');
        ctx.data2 = [8];
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div>ef8</div>');
        ctx.data1 = ['x', 'y'];
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div>xy8</div>');
    });
});
describe('function calls', function () {
    it('should work', function () {
        var ctx = { data: ['foo', 'bar'] };
        function spanify(rf, ctx) {
            var message = ctx.message;
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'span');
                {
                    instructions_1.text(1);
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.textBinding(1, instructions_1.bind(message));
            }
        }
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.text(1, 'Before');
                    instructions_1.container(2);
                    instructions_1.container(3);
                    instructions_1.text(4, 'After');
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(2);
                {
                    var rf0 = instructions_1.embeddedViewStart(0);
                    {
                        spanify(rf0, { message: ctx.data[0] });
                    }
                    instructions_1.embeddedViewEnd();
                }
                instructions_1.containerRefreshEnd();
                instructions_1.containerRefreshStart(3);
                {
                    var rf0 = instructions_1.embeddedViewStart(0);
                    {
                        spanify(rf0, { message: ctx.data[1] });
                    }
                    instructions_1.embeddedViewEnd();
                }
                instructions_1.containerRefreshEnd();
            }
        }
        expect(render_util_1.renderToHtml(Template, ctx))
            .toEqual('<div>Before<span>foo</span><span>bar</span>After</div>');
        ctx.data = [];
        expect(render_util_1.renderToHtml(Template, ctx)).toEqual('<div>Before<span></span><span></span>After</div>');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbF9mbG93X3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVuZGVyMy9jb250cm9sX2Zsb3dfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDJEQUE2RDtBQUM3RCwrREFBNEw7QUFFNUwsNkNBQStGO0FBRS9GLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtJQUMxQixFQUFFLENBQUMsMkJBQTJCLEVBQUU7UUFDOUIsSUFBTSxHQUFHLEdBQWlELEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFFOUYsa0JBQWtCLEVBQWUsRUFBRSxHQUFRO1lBQ3pDLElBQUksRUFBRSxpQkFBcUIsRUFBRTtnQkFDM0IsMkJBQVksQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ3ZCO29CQUFFLHdCQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQUU7Z0JBQ2pCLHlCQUFVLEVBQUUsQ0FBQzthQUNkO1lBQ0QsSUFBSSxFQUFFLGlCQUFxQixFQUFFO2dCQUMzQixvQ0FBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekI7b0JBQ0UsSUFBSSxHQUFHLENBQUMsU0FBUyxFQUFFO3dCQUNqQixJQUFJLEdBQUcsR0FBRyxnQ0FBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDL0I7NEJBQ0UsSUFBSSxHQUFHLGlCQUFxQixFQUFFO2dDQUM1QiwyQkFBWSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQ0FDeEI7b0NBQUUsbUJBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztpQ0FBRTtnQ0FDWix5QkFBVSxFQUFFLENBQUM7NkJBQ2Q7NEJBQ0QsSUFBSSxHQUFHLGlCQUFxQixFQUFFO2dDQUM1QiwwQkFBVyxDQUFDLENBQUMsRUFBRSxtQkFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENB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