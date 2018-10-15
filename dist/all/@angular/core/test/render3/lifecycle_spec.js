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
var common_with_def_1 = require("./common_with_def");
var render_util_1 = require("./render_util");
describe('lifecycles', function () {
    function getParentTemplate(name) {
        return function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, name);
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.elementProperty(0, 'val', instructions_1.bind(ctx.val));
            }
        };
    }
    describe('onInit', function () {
        var events;
        beforeEach(function () { events = []; });
        var Comp = createOnInitComponent('comp', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.projection(1);
                }
                instructions_1.elementEnd();
            }
        });
        var Parent = createOnInitComponent('parent', getParentTemplate('comp'), [Comp]);
        var ProjectedComp = createOnInitComponent('projected', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.text(0, 'content');
            }
        });
        function createOnInitComponent(name, template, directives) {
            if (directives === void 0) { directives = []; }
            var _a;
            return _a = /** @class */ (function () {
                    function Component() {
                        this.val = '';
                    }
                    Component.prototype.ngOnInit = function () { events.push("" + name + this.val); };
                    return Component;
                }()),
                _a.ngComponentDef = index_1.defineComponent({
                    type: _a,
                    selectors: [[name]],
                    factory: function () { return new _a(); },
                    inputs: { val: 'val' }, template: template,
                    directives: directives
                }),
                _a;
        }
        var Directive = /** @class */ (function () {
            function Directive() {
            }
            Directive.prototype.ngOnInit = function () { events.push('dir'); };
            Directive.ngDirectiveDef = index_1.defineDirective({ type: Directive, selectors: [['', 'dir', '']], factory: function () { return new Directive(); } });
            return Directive;
        }());
        var directives = [Comp, Parent, ProjectedComp, Directive];
        it('should call onInit method after inputs are set in creation mode (and not in update mode)', function () {
            /** <comp [val]="val"></comp> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp');
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val', instructions_1.bind(ctx.val));
                }
            }
            render_util_1.renderToHtml(Template, { val: '1' }, directives);
            expect(events).toEqual(['comp1']);
            render_util_1.renderToHtml(Template, { val: '2' }, directives);
            expect(events).toEqual(['comp1']);
        });
        it('should be called on root component in creation mode', function () {
            var comp = render_util_1.renderComponent(Comp, { hostFeatures: [index_1.LifecycleHooksFeature] });
            expect(events).toEqual(['comp']);
            instructions_1.markDirty(comp);
            render_util_1.requestAnimationFrame.flush();
            expect(events).toEqual(['comp']);
        });
        it('should call parent onInit before child onInit', function () {
            /**
             * <parent></parent>
             * parent temp: <comp></comp>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'parent');
                    instructions_1.elementEnd();
                }
            }
            render_util_1.renderToHtml(Template, {}, directives);
            expect(events).toEqual(['parent', 'comp']);
        });
        it('should call all parent onInits across view before calling children onInits', function () {
            /**
             * <parent [val]="1"></parent>
             * <parent [val]="2"></parent>
             *
             * parent temp: <comp [val]="val"></comp>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'parent');
                    instructions_1.elementEnd();
                    instructions_1.elementStart(1, 'parent');
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val', 1);
                    instructions_1.elementProperty(1, 'val', 2);
                }
            }
            render_util_1.renderToHtml(Template, {}, directives);
            expect(events).toEqual(['parent1', 'parent2', 'comp1', 'comp2']);
        });
        it('should call onInit every time a new view is created (if block)', function () {
            /**
             * % if (condition) {
             *   <comp></comp>
             * % }
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
                                instructions_1.elementStart(0, 'comp');
                                instructions_1.elementEnd();
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            render_util_1.renderToHtml(Template, { condition: true }, directives);
            expect(events).toEqual(['comp']);
            render_util_1.renderToHtml(Template, { condition: false }, directives);
            expect(events).toEqual(['comp']);
            render_util_1.renderToHtml(Template, { condition: true }, directives);
            expect(events).toEqual(['comp', 'comp']);
        });
        it('should call onInit in hosts before their content children', function () {
            /**
             * <comp>
             *   <projected></projected>
             * </comp>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp');
                    {
                        instructions_1.elementStart(1, 'projected');
                    }
                    instructions_1.elementEnd();
                }
            }
            render_util_1.renderToHtml(Template, {}, directives);
            expect(events).toEqual(['comp', 'projected']);
        });
        it('should call onInit in host and its content children before next host', function () {
            /**
             * <comp [val]="1">
             *   <projected [val]="1"></projected>
             * </comp>
             * <comp [val]="2">
             *   <projected [val]="1"></projected>
             * </comp>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp');
                    {
                        instructions_1.elementStart(1, 'projected');
                    }
                    instructions_1.elementEnd();
                    instructions_1.elementStart(2, 'comp');
                    {
                        instructions_1.elementStart(3, 'projected');
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val', 1);
                    instructions_1.elementProperty(1, 'val', 1);
                    instructions_1.elementProperty(2, 'val', 2);
                    instructions_1.elementProperty(3, 'val', 2);
                }
            }
            render_util_1.renderToHtml(Template, {}, directives);
            expect(events).toEqual(['comp1', 'projected1', 'comp2', 'projected2']);
        });
        it('should be called on directives after component', function () {
            /** <comp directive></comp> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp', ['dir', '']);
                    instructions_1.elementEnd();
                }
            }
            render_util_1.renderToHtml(Template, {}, directives);
            expect(events).toEqual(['comp', 'dir']);
            render_util_1.renderToHtml(Template, {}, directives);
            expect(events).toEqual(['comp', 'dir']);
        });
        it('should be called on directives on an element', function () {
            /** <div directive></div> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['dir', '']);
                    instructions_1.elementEnd();
                }
            }
            render_util_1.renderToHtml(Template, {}, directives);
            expect(events).toEqual(['dir']);
            render_util_1.renderToHtml(Template, {}, directives);
            expect(events).toEqual(['dir']);
        });
        it('should call onInit properly in for loop', function () {
            /**
             *  <comp [val]="1"></comp>
             * % for (let j = 2; j < 5; j++) {
             *   <comp [val]="j"></comp>
             * % }
             *  <comp [val]="5"></comp>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp');
                    instructions_1.elementEnd();
                    instructions_1.container(1);
                    instructions_1.elementStart(2, 'comp');
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val', 1);
                    instructions_1.elementProperty(2, 'val', 5);
                    instructions_1.containerRefreshStart(1);
                    {
                        for (var j = 2; j < 5; j++) {
                            var rf1 = instructions_1.embeddedViewStart(0);
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'comp');
                                instructions_1.elementEnd();
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.elementProperty(0, 'val', j);
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            render_util_1.renderToHtml(Template, {}, directives);
            // onInit is called top to bottom, so top level comps (1 and 5) are called
            // before the comps inside the for loop's embedded view (2, 3, and 4)
            expect(events).toEqual(['comp1', 'comp5', 'comp2', 'comp3', 'comp4']);
        });
        it('should call onInit properly in for loop with children', function () {
            /**
             *  <parent [val]="1"></parent>
             * % for (let j = 2; j < 5; j++) {
             *   <parent [val]="j"></parent>
             * % }
             *  <parent [val]="5"></parent>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'parent');
                    instructions_1.elementEnd();
                    instructions_1.container(1);
                    instructions_1.elementStart(2, 'parent');
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val', 1);
                    instructions_1.elementProperty(2, 'val', 5);
                    instructions_1.containerRefreshStart(1);
                    {
                        for (var j = 2; j < 5; j++) {
                            var rf1 = instructions_1.embeddedViewStart(0);
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'parent');
                                instructions_1.elementEnd();
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.elementProperty(0, 'val', j);
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            render_util_1.renderToHtml(Template, {}, directives);
            // onInit is called top to bottom, so top level comps (1 and 5) are called
            // before the comps inside the for loop's embedded view (2, 3, and 4)
            expect(events).toEqual([
                'parent1', 'parent5', 'parent2', 'comp2', 'parent3', 'comp3', 'parent4', 'comp4', 'comp1',
                'comp5'
            ]);
        });
    });
    describe('doCheck', function () {
        var events;
        var allEvents;
        beforeEach(function () {
            events = [];
            allEvents = [];
        });
        var Comp = createDoCheckComponent('comp', function (rf, ctx) { });
        var Parent = createDoCheckComponent('parent', getParentTemplate('comp'), [Comp]);
        function createDoCheckComponent(name, template, directives) {
            if (directives === void 0) { directives = []; }
            var _a;
            return _a = /** @class */ (function () {
                    function Component() {
                    }
                    Component.prototype.ngDoCheck = function () {
                        events.push(name);
                        allEvents.push('check ' + name);
                    };
                    Component.prototype.ngOnInit = function () { allEvents.push('init ' + name); };
                    return Component;
                }()),
                _a.ngComponentDef = index_1.defineComponent({
                    type: _a,
                    selectors: [[name]],
                    factory: function () { return new _a(); }, template: template,
                    directives: directives
                }),
                _a;
        }
        var Directive = /** @class */ (function () {
            function Directive() {
            }
            Directive.prototype.ngDoCheck = function () { events.push('dir'); };
            Directive.ngDirectiveDef = index_1.defineDirective({ type: Directive, selectors: [['', 'dir', '']], factory: function () { return new Directive(); } });
            return Directive;
        }());
        var directives = [Comp, Parent, Directive];
        it('should call doCheck on every refresh', function () {
            /** <comp></comp> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp');
                    instructions_1.elementEnd();
                }
            }
            render_util_1.renderToHtml(Template, {}, directives);
            expect(events).toEqual(['comp']);
            render_util_1.renderToHtml(Template, {}, directives);
            expect(events).toEqual(['comp', 'comp']);
        });
        it('should be called on root component', function () {
            var comp = render_util_1.renderComponent(Comp, { hostFeatures: [index_1.LifecycleHooksFeature] });
            expect(events).toEqual(['comp']);
            instructions_1.markDirty(comp);
            render_util_1.requestAnimationFrame.flush();
            expect(events).toEqual(['comp', 'comp']);
        });
        it('should call parent doCheck before child doCheck', function () {
            /**
             * <parent></parent>
             * parent temp: <comp></comp>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'parent');
                    instructions_1.elementEnd();
                }
            }
            render_util_1.renderToHtml(Template, {}, directives);
            expect(events).toEqual(['parent', 'comp']);
        });
        it('should call ngOnInit before ngDoCheck if creation mode', function () {
            /** <comp></comp> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp');
                    instructions_1.elementEnd();
                }
            }
            render_util_1.renderToHtml(Template, {}, directives);
            expect(allEvents).toEqual(['init comp', 'check comp']);
            render_util_1.renderToHtml(Template, {}, directives);
            expect(allEvents).toEqual(['init comp', 'check comp', 'check comp']);
        });
        it('should be called on directives after component', function () {
            /** <comp directive></comp> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp', ['dir', '']);
                    instructions_1.elementEnd();
                }
            }
            render_util_1.renderToHtml(Template, {}, directives);
            expect(events).toEqual(['comp', 'dir']);
            render_util_1.renderToHtml(Template, {}, directives);
            expect(events).toEqual(['comp', 'dir', 'comp', 'dir']);
        });
        it('should be called on directives on an element', function () {
            /** <div directive></div> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['dir', '']);
                    instructions_1.elementEnd();
                }
            }
            render_util_1.renderToHtml(Template, {}, directives);
            expect(events).toEqual(['dir']);
            render_util_1.renderToHtml(Template, {}, directives);
            expect(events).toEqual(['dir', 'dir']);
        });
    });
    describe('afterContentInit', function () {
        var events;
        var allEvents;
        beforeEach(function () {
            events = [];
            allEvents = [];
        });
        var Comp = createAfterContentInitComp('comp', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.projection(0);
            }
        });
        var Parent = createAfterContentInitComp('parent', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.elementStart(0, 'comp');
                {
                    instructions_1.projection(1);
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.elementProperty(0, 'val', instructions_1.bind(ctx.val));
            }
        }, [Comp]);
        var ProjectedComp = createAfterContentInitComp('projected', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.projection(0);
            }
        });
        function createAfterContentInitComp(name, template, directives) {
            if (directives === void 0) { directives = []; }
            var _a;
            return _a = /** @class */ (function () {
                    function Component() {
                        this.val = '';
                    }
                    Component.prototype.ngAfterContentInit = function () {
                        events.push("" + name + this.val);
                        allEvents.push("" + name + this.val + " init");
                    };
                    Component.prototype.ngAfterContentChecked = function () { allEvents.push("" + name + this.val + " check"); };
                    return Component;
                }()),
                _a.ngComponentDef = index_1.defineComponent({
                    type: _a,
                    selectors: [[name]],
                    factory: function () { return new _a(); },
                    inputs: { val: 'val' },
                    template: template,
                    directives: directives
                }),
                _a;
        }
        var Directive = /** @class */ (function () {
            function Directive() {
            }
            Directive.prototype.ngAfterContentInit = function () { events.push('init'); };
            Directive.prototype.ngAfterContentChecked = function () { events.push('check'); };
            Directive.ngDirectiveDef = index_1.defineDirective({ type: Directive, selectors: [['', 'dir', '']], factory: function () { return new Directive(); } });
            return Directive;
        }());
        function ForLoopWithChildrenTemplate(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'parent');
                {
                    instructions_1.text(1, 'content');
                }
                instructions_1.elementEnd();
                instructions_1.container(2);
                instructions_1.elementStart(3, 'parent');
                {
                    instructions_1.text(4, 'content');
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.elementProperty(0, 'val', 1);
                instructions_1.elementProperty(3, 'val', 4);
                instructions_1.containerRefreshStart(2);
                {
                    for (var i = 2; i < 4; i++) {
                        var rf1 = instructions_1.embeddedViewStart(0);
                        if (rf1 & 1 /* Create */) {
                            instructions_1.elementStart(0, 'parent');
                            {
                                instructions_1.text(1, 'content');
                            }
                            instructions_1.elementEnd();
                        }
                        if (rf1 & 2 /* Update */) {
                            instructions_1.elementProperty(0, 'val', i);
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        }
        var directives = [Comp, Parent, ProjectedComp, Directive];
        it('should be called only in creation mode', function () {
            /** <comp>content</comp> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp');
                    {
                        instructions_1.text(1, 'content');
                    }
                    instructions_1.elementEnd();
                }
            }
            render_util_1.renderToHtml(Template, {}, directives);
            expect(events).toEqual(['comp']);
            render_util_1.renderToHtml(Template, {}, directives);
            expect(events).toEqual(['comp']);
        });
        it('should be called on root component in creation mode', function () {
            var comp = render_util_1.renderComponent(Comp, { hostFeatures: [index_1.LifecycleHooksFeature] });
            expect(events).toEqual(['comp']);
            instructions_1.markDirty(comp);
            render_util_1.requestAnimationFrame.flush();
            expect(events).toEqual(['comp']);
        });
        it('should be called on every init (if blocks)', function () {
            /**
             * % if (condition) {
             *   <comp>content</comp>
             * % }
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
                                instructions_1.elementStart(0, 'comp');
                                {
                                    instructions_1.text(1, 'content');
                                }
                                instructions_1.elementEnd();
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            render_util_1.renderToHtml(Template, { condition: true }, directives);
            expect(events).toEqual(['comp']);
            render_util_1.renderToHtml(Template, { condition: false }, directives);
            expect(events).toEqual(['comp']);
            render_util_1.renderToHtml(Template, { condition: true }, directives);
            expect(events).toEqual(['comp', 'comp']);
        });
        it('should be called in parents before children', function () {
            /**
             * <parent>content</parent>
             *
             * parent template: <comp><ng-content></ng-content></comp>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'parent');
                    {
                        instructions_1.text(1, 'content');
                    }
                    instructions_1.elementEnd();
                }
            }
            render_util_1.renderToHtml(Template, {}, directives);
            expect(events).toEqual(['parent', 'comp']);
        });
        it('should be called breadth-first in entire parent subtree before any children', function () {
            /**
             * <parent [val]="1">content</parent>
             * <parent [val]="2">content</parent>
             *
             * parent template: <comp [val]="val"><ng-content></ng-content></comp>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'parent');
                    {
                        instructions_1.text(1, 'content');
                    }
                    instructions_1.elementEnd();
                    instructions_1.elementStart(2, 'parent');
                    {
                        instructions_1.text(3, 'content');
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val', 1);
                    instructions_1.elementProperty(2, 'val', 2);
                }
            }
            render_util_1.renderToHtml(Template, {}, directives);
            expect(events).toEqual(['parent1', 'parent2', 'comp1', 'comp2']);
        });
        it('should be called in projected components before their hosts', function () {
            /**
             * <parent>
             *   <projected>content</projected>
             * </parent>
             *
             * parent template:
             * <comp><ng-content></ng-content></comp>
             *
             * projected comp: <ng-content></ng-content>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'parent');
                    {
                        instructions_1.elementStart(1, 'projected');
                        {
                            instructions_1.text(2, 'content');
                        }
                        instructions_1.elementEnd();
                    }
                    instructions_1.elementEnd();
                }
            }
            render_util_1.renderToHtml(Template, {}, directives);
            expect(events).toEqual(['projected', 'parent', 'comp']);
        });
        it('should be called in projected components and hosts before children', function () {
            /**
             * <parent [val]="1">
             *   <projected [val]="1">content</projected>
             * </parent>
             * * <parent [val]="2">
             *   <projected [val]="2">content</projected>
             * </parent>
             *
             * parent template:
             * <comp [val]="val"><ng-content></ng-content></comp>
             *
             * projected comp: <ng-content></ng-content>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'parent');
                    {
                        instructions_1.elementStart(1, 'projected');
                        {
                            instructions_1.text(2, 'content');
                        }
                        instructions_1.elementEnd();
                    }
                    instructions_1.elementEnd();
                    instructions_1.elementStart(3, 'parent');
                    {
                        instructions_1.elementStart(4, 'projected');
                        {
                            instructions_1.text(5, 'content');
                        }
                        instructions_1.elementEnd();
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val', 1);
                    instructions_1.elementProperty(1, 'val', 1);
                    instructions_1.elementProperty(3, 'val', 2);
                    instructions_1.elementProperty(4, 'val', 2);
                }
            }
            render_util_1.renderToHtml(Template, {}, directives);
            expect(events).toEqual(['projected1', 'parent1', 'projected2', 'parent2', 'comp1', 'comp2']);
        });
        it('should be called in correct order in a for loop', function () {
            /**
             * <comp [val]="1">content</comp>
             * % for(let i = 2; i < 4; i++) {
             *   <comp [val]="i">content</comp>
             * % }
             * <comp [val]="4">content</comp>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp');
                    {
                        instructions_1.text(1, 'content');
                    }
                    instructions_1.elementEnd();
                    instructions_1.container(2);
                    instructions_1.elementStart(3, 'comp');
                    {
                        instructions_1.text(4, 'content');
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val', 1);
                    instructions_1.elementProperty(3, 'val', 4);
                    instructions_1.containerRefreshStart(2);
                    {
                        for (var i = 2; i < 4; i++) {
                            var rf1 = instructions_1.embeddedViewStart(0);
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'comp');
                                {
                                    instructions_1.text(1, 'content');
                                }
                                instructions_1.elementEnd();
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.elementProperty(0, 'val', i);
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            render_util_1.renderToHtml(Template, {}, directives);
            expect(events).toEqual(['comp2', 'comp3', 'comp1', 'comp4']);
        });
        it('should be called in correct order in a for loop with children', function () {
            /**
             * <parent [val]="1">content</parent>
             * % for(let i = 2; i < 4; i++) {
             *   <parent [val]="i">content</parent>
             * % }
             * <parent [val]="4">content</parent>
             */
            render_util_1.renderToHtml(ForLoopWithChildrenTemplate, {}, directives);
            expect(events).toEqual(['parent2', 'comp2', 'parent3', 'comp3', 'parent1', 'parent4', 'comp1', 'comp4']);
        });
        describe('ngAfterContentChecked', function () {
            it('should be called every change detection run after afterContentInit', function () {
                /** <comp>content</comp> */
                function Template(rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'comp');
                        {
                            instructions_1.text(1, 'content');
                        }
                        instructions_1.elementEnd();
                    }
                }
                render_util_1.renderToHtml(Template, {}, directives);
                expect(allEvents).toEqual(['comp init', 'comp check']);
                render_util_1.renderToHtml(Template, {}, directives);
                expect(allEvents).toEqual(['comp init', 'comp check', 'comp check']);
            });
            it('should be called on root component', function () {
                var comp = render_util_1.renderComponent(Comp, { hostFeatures: [index_1.LifecycleHooksFeature] });
                expect(allEvents).toEqual(['comp init', 'comp check']);
                instructions_1.markDirty(comp);
                render_util_1.requestAnimationFrame.flush();
                expect(allEvents).toEqual(['comp init', 'comp check', 'comp check']);
            });
        });
        describe('directives', function () {
            it('should be called on directives after component', function () {
                /** <comp directive></comp> */
                function Template(rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'comp', ['dir', '']);
                        instructions_1.elementEnd();
                    }
                }
                render_util_1.renderToHtml(Template, {}, directives);
                expect(events).toEqual(['comp', 'init', 'check']);
            });
            it('should be called on directives on an element', function () {
                /** <div directive></div> */
                function Template(rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'div', ['dir', '']);
                        instructions_1.elementEnd();
                    }
                }
                render_util_1.renderToHtml(Template, {}, directives);
                expect(events).toEqual(['init', 'check']);
            });
        });
    });
    describe('afterViewInit', function () {
        var events;
        var allEvents;
        beforeEach(function () {
            events = [];
            allEvents = [];
        });
        var Comp = createAfterViewInitComponent('comp', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.projection(1);
                }
                instructions_1.elementEnd();
            }
        });
        var Parent = createAfterViewInitComponent('parent', getParentTemplate('comp'), [Comp]);
        var ProjectedComp = createAfterViewInitComponent('projected', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.text(0, 'content');
            }
        });
        function createAfterViewInitComponent(name, template, directives) {
            if (directives === void 0) { directives = []; }
            var _a;
            return _a = /** @class */ (function () {
                    function Component() {
                        this.val = '';
                    }
                    Component.prototype.ngAfterViewInit = function () {
                        events.push("" + name + this.val);
                        allEvents.push("" + name + this.val + " init");
                    };
                    Component.prototype.ngAfterViewChecked = function () { allEvents.push("" + name + this.val + " check"); };
                    return Component;
                }()),
                _a.ngComponentDef = index_1.defineComponent({
                    type: _a,
                    selectors: [[name]],
                    factory: function () { return new _a(); },
                    inputs: { val: 'val' },
                    template: template,
                    directives: directives
                }),
                _a;
        }
        var Directive = /** @class */ (function () {
            function Directive() {
            }
            Directive.prototype.ngAfterViewInit = function () { events.push('init'); };
            Directive.prototype.ngAfterViewChecked = function () { events.push('check'); };
            Directive.ngDirectiveDef = index_1.defineDirective({ type: Directive, selectors: [['', 'dir', '']], factory: function () { return new Directive(); } });
            return Directive;
        }());
        var defs = [Comp, Parent, ProjectedComp, Directive];
        it('should be called on init and not in update mode', function () {
            /** <comp></comp> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp');
                    instructions_1.elementEnd();
                }
            }
            render_util_1.renderToHtml(Template, {}, defs);
            expect(events).toEqual(['comp']);
            render_util_1.renderToHtml(Template, {}, defs);
            expect(events).toEqual(['comp']);
        });
        it('should be called on root component in creation mode', function () {
            var comp = render_util_1.renderComponent(Comp, { hostFeatures: [index_1.LifecycleHooksFeature] });
            expect(events).toEqual(['comp']);
            instructions_1.markDirty(comp);
            render_util_1.requestAnimationFrame.flush();
            expect(events).toEqual(['comp']);
        });
        it('should be called every time a view is initialized (if block)', function () {
            /*
            * % if (condition) {
            *   <comp></comp>
            * % }
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
                                instructions_1.elementStart(0, 'comp');
                                instructions_1.elementEnd();
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            render_util_1.renderToHtml(Template, { condition: true }, defs);
            expect(events).toEqual(['comp']);
            render_util_1.renderToHtml(Template, { condition: false }, defs);
            expect(events).toEqual(['comp']);
            render_util_1.renderToHtml(Template, { condition: true }, defs);
            expect(events).toEqual(['comp', 'comp']);
        });
        it('should be called in children before parents', function () {
            /**
             * <parent></parent>
             *
             * parent temp: <comp></comp>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'parent');
                    instructions_1.elementEnd();
                }
            }
            render_util_1.renderToHtml(Template, {}, defs);
            expect(events).toEqual(['comp', 'parent']);
        });
        it('should be called for entire subtree before being called in any parent view comps', function () {
            /**
             * <parent [val]="1"></parent>
             * <parent [val]="2"></parent>
             *
             *  parent temp: <comp [val]="val"></comp>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'parent');
                    instructions_1.elementEnd();
                    instructions_1.elementStart(1, 'parent');
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val', 1);
                    instructions_1.elementProperty(1, 'val', 2);
                }
            }
            render_util_1.renderToHtml(Template, {}, defs);
            expect(events).toEqual(['comp1', 'comp2', 'parent1', 'parent2']);
        });
        it('should be called in projected components before their hosts', function () {
            /**
             * <comp>
             *   <projected></projected>
             * </comp>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp');
                    {
                        instructions_1.elementStart(1, 'projected');
                        instructions_1.elementEnd();
                    }
                    instructions_1.elementEnd();
                }
            }
            render_util_1.renderToHtml(Template, {}, defs);
            expect(events).toEqual(['projected', 'comp']);
        });
        it('should call afterViewInit in content children and host before next host', function () {
            /**
             * <comp [val]="1">
             *   <projected [val]="1"></projected>
             * </comp>
             * <comp [val]="2">
             *   <projected [val]="2"></projected>
             * </comp>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp');
                    {
                        instructions_1.elementStart(1, 'projected');
                        instructions_1.elementEnd();
                    }
                    instructions_1.elementEnd();
                    instructions_1.elementStart(2, 'comp');
                    {
                        instructions_1.elementStart(3, 'projected');
                        instructions_1.elementEnd();
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val', 1);
                    instructions_1.elementProperty(1, 'val', 1);
                    instructions_1.elementProperty(2, 'val', 2);
                    instructions_1.elementProperty(3, 'val', 2);
                }
            }
            render_util_1.renderToHtml(Template, {}, defs);
            expect(events).toEqual(['projected1', 'comp1', 'projected2', 'comp2']);
        });
        it('should call afterViewInit in content children and hosts before parents', function () {
            /*
             * <comp [val]="val">
             *   <projected [val]="val"></projected>
             * </comp>
             */
            var ParentComp = createAfterViewInitComponent('parent', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp');
                    {
                        instructions_1.elementStart(1, 'projected');
                        instructions_1.elementEnd();
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val', instructions_1.bind(ctx.val));
                    instructions_1.elementProperty(1, 'val', instructions_1.bind(ctx.val));
                }
            }, [Comp, ProjectedComp]);
            /**
             * <parent [val]="1"></parent>
             * <parent [val]="2"></parent>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'parent');
                    instructions_1.elementEnd();
                    instructions_1.elementStart(1, 'parent');
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val', 1);
                    instructions_1.elementProperty(1, 'val', 2);
                }
            }
            render_util_1.renderToHtml(Template, {}, [ParentComp]);
            expect(events).toEqual(['projected1', 'comp1', 'projected2', 'comp2', 'parent1', 'parent2']);
        });
        it('should be called in correct order with for loops', function () {
            /**
             * <comp [val]="1"></comp>
             * % for (let i = 0; i < 4; i++) {
             *  <comp [val]="i"></comp>
             * % }
             * <comp [val]="4"></comp>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp');
                    instructions_1.elementEnd();
                    instructions_1.container(1);
                    instructions_1.elementStart(2, 'comp');
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val', 1);
                    instructions_1.elementProperty(2, 'val', 4);
                    instructions_1.containerRefreshStart(1);
                    {
                        for (var i = 2; i < 4; i++) {
                            var rf1 = instructions_1.embeddedViewStart(0);
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'comp');
                                instructions_1.elementEnd();
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.elementProperty(0, 'val', i);
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            render_util_1.renderToHtml(Template, {}, defs);
            expect(events).toEqual(['comp2', 'comp3', 'comp1', 'comp4']);
        });
        it('should be called in correct order with for loops with children', function () {
            /**
             * <parent [val]="1"></parent>
             * % for(let i = 0; i < 4; i++) {
             *  <parent [val]="i"></parent>
             * % }
             * <parent [val]="4"></parent>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'parent');
                    instructions_1.elementEnd();
                    instructions_1.container(1);
                    instructions_1.elementStart(2, 'parent');
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val', 1);
                    instructions_1.elementProperty(2, 'val', 4);
                    instructions_1.containerRefreshStart(1);
                    {
                        for (var i = 2; i < 4; i++) {
                            var rf1 = instructions_1.embeddedViewStart(0);
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'parent');
                                instructions_1.elementEnd();
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.elementProperty(0, 'val', i);
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            render_util_1.renderToHtml(Template, {}, defs);
            expect(events).toEqual(['comp2', 'parent2', 'comp3', 'parent3', 'comp1', 'comp4', 'parent1', 'parent4']);
        });
        describe('ngAfterViewChecked', function () {
            it('should call ngAfterViewChecked every update', function () {
                /** <comp></comp> */
                function Template(rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'comp');
                        instructions_1.elementEnd();
                    }
                }
                render_util_1.renderToHtml(Template, {}, defs);
                expect(allEvents).toEqual(['comp init', 'comp check']);
                render_util_1.renderToHtml(Template, {}, defs);
                expect(allEvents).toEqual(['comp init', 'comp check', 'comp check']);
            });
            it('should be called on root component', function () {
                var comp = render_util_1.renderComponent(Comp, { hostFeatures: [index_1.LifecycleHooksFeature] });
                expect(allEvents).toEqual(['comp init', 'comp check']);
                instructions_1.markDirty(comp);
                render_util_1.requestAnimationFrame.flush();
                expect(allEvents).toEqual(['comp init', 'comp check', 'comp check']);
            });
            it('should call ngAfterViewChecked with bindings', function () {
                /** <comp [val]="myVal"></comp> */
                function Template(rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'comp');
                        instructions_1.elementEnd();
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.elementProperty(0, 'val', instructions_1.bind(ctx.myVal));
                    }
                }
                render_util_1.renderToHtml(Template, { myVal: 5 }, defs);
                expect(allEvents).toEqual(['comp5 init', 'comp5 check']);
                render_util_1.renderToHtml(Template, { myVal: 6 }, defs);
                expect(allEvents).toEqual(['comp5 init', 'comp5 check', 'comp6 check']);
            });
            it('should be called in correct order with for loops with children', function () {
                /**
                 * <parent [val]="1"></parent>
                 * % for(let i = 0; i < 4; i++) {
               *  <parent [val]="i"></parent>
               * % }
                 * <parent [val]="4"></parent>
                 */
                function Template(rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'parent');
                        instructions_1.elementEnd();
                        instructions_1.container(1);
                        instructions_1.elementStart(2, 'parent');
                        instructions_1.elementEnd();
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.elementProperty(0, 'val', 1);
                        instructions_1.elementProperty(2, 'val', 4);
                        instructions_1.containerRefreshStart(1);
                        {
                            for (var i = 2; i < 4; i++) {
                                var rf1 = instructions_1.embeddedViewStart(0);
                                if (rf1 & 1 /* Create */) {
                                    instructions_1.elementStart(0, 'parent');
                                    instructions_1.elementEnd();
                                }
                                if (rf1 & 2 /* Update */) {
                                    instructions_1.elementProperty(0, 'val', i);
                                }
                                instructions_1.embeddedViewEnd();
                            }
                        }
                        instructions_1.containerRefreshEnd();
                    }
                }
                render_util_1.renderToHtml(Template, {}, defs);
                expect(allEvents).toEqual([
                    'comp2 init', 'comp2 check', 'parent2 init', 'parent2 check', 'comp3 init', 'comp3 check',
                    'parent3 init', 'parent3 check', 'comp1 init', 'comp1 check', 'comp4 init', 'comp4 check',
                    'parent1 init', 'parent1 check', 'parent4 init', 'parent4 check'
                ]);
            });
        });
        describe('directives', function () {
            it('should be called on directives after component', function () {
                /** <comp directive></comp> */
                function Template(rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'comp', ['dir', '']);
                        instructions_1.elementEnd();
                    }
                }
                render_util_1.renderToHtml(Template, {}, defs);
                expect(events).toEqual(['comp', 'init', 'check']);
            });
            it('should be called on directives on an element', function () {
                /** <div directive></div> */
                function Template(rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'div', ['dir', '']);
                        instructions_1.elementEnd();
                    }
                }
                render_util_1.renderToHtml(Template, {}, defs);
                expect(events).toEqual(['init', 'check']);
            });
        });
    });
    describe('onDestroy', function () {
        var events;
        beforeEach(function () { events = []; });
        var Comp = createOnDestroyComponent('comp', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.projection(0);
            }
        });
        var Parent = createOnDestroyComponent('parent', getParentTemplate('comp'), [Comp]);
        function createOnDestroyComponent(name, template, directives) {
            if (directives === void 0) { directives = []; }
            var _a;
            return _a = /** @class */ (function () {
                    function Component() {
                        this.val = '';
                    }
                    Component.prototype.ngOnDestroy = function () { events.push("" + name + this.val); };
                    return Component;
                }()),
                _a.ngComponentDef = index_1.defineComponent({
                    type: _a,
                    selectors: [[name]],
                    factory: function () { return new _a(); },
                    inputs: { val: 'val' },
                    template: template,
                    directives: directives
                }),
                _a;
        }
        var Grandparent = createOnDestroyComponent('grandparent', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'parent');
                instructions_1.elementEnd();
            }
        }, [Parent]);
        var ProjectedComp = createOnDestroyComponent('projected', function (rf, ctx) { });
        var Directive = /** @class */ (function () {
            function Directive() {
            }
            Directive.prototype.ngOnDestroy = function () { events.push('dir'); };
            Directive.ngDirectiveDef = index_1.defineDirective({ type: Directive, selectors: [['', 'dir', '']], factory: function () { return new Directive(); } });
            return Directive;
        }());
        var defs = [Comp, Parent, Grandparent, ProjectedComp, Directive];
        it('should call destroy when view is removed', function () {
            /**
             * % if (condition) {
             *   <comp></comp>
             * % }
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
                                instructions_1.elementStart(0, 'comp');
                                instructions_1.elementEnd();
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            render_util_1.renderToHtml(Template, { condition: true }, defs);
            render_util_1.renderToHtml(Template, { condition: false }, defs);
            expect(events).toEqual(['comp']);
        });
        it('should call destroy when multiple views are removed', function () {
            /**
             * % if (condition) {
             *   <comp [val]="1"></comp>
             *   <comp [val]="2"></comp>
             * % }
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
                                instructions_1.elementStart(0, 'comp');
                                instructions_1.elementEnd();
                                instructions_1.elementStart(1, 'comp');
                                instructions_1.elementEnd();
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.elementProperty(0, 'val', instructions_1.bind('1'));
                                instructions_1.elementProperty(1, 'val', instructions_1.bind('2'));
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            render_util_1.renderToHtml(Template, { condition: true }, defs);
            render_util_1.renderToHtml(Template, { condition: false }, defs);
            expect(events).toEqual(['comp1', 'comp2']);
        });
        it('should be called in child components before parent components', function () {
            /**
             * % if (condition) {
             *   <parent></parent>
             * % }
             *
             * parent template: <comp></comp>
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
                                instructions_1.elementStart(0, 'parent');
                                instructions_1.elementEnd();
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            render_util_1.renderToHtml(Template, { condition: true }, defs);
            render_util_1.renderToHtml(Template, { condition: false }, defs);
            expect(events).toEqual(['comp', 'parent']);
        });
        it('should be called bottom up with children nested 2 levels deep', function () {
            /**
             * % if (condition) {
             *   <grandparent></grandparent>
             * % }
             *
             * grandparent template: <parent></parent>
             * parent template: <comp></comp>
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
                                instructions_1.elementStart(0, 'grandparent');
                                instructions_1.elementEnd();
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            render_util_1.renderToHtml(Template, { condition: true }, defs);
            render_util_1.renderToHtml(Template, { condition: false }, defs);
            expect(events).toEqual(['comp', 'parent', 'grandparent']);
        });
        it('should be called in projected components before their hosts', function () {
            /**
             * % if (showing) {
             *   <comp [val]="1">
             *     <projected [val]="1"></projected>
             *   </comp>
             *   <comp [val]="2">
             *     <projected [val]="2"></projected>
             *   </comp>
             * }
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.container(0);
                }
                if (rf & 2 /* Update */) {
                    instructions_1.containerRefreshStart(0);
                    {
                        if (ctx.showing) {
                            var rf1 = instructions_1.embeddedViewStart(0);
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'comp');
                                {
                                    instructions_1.elementStart(1, 'projected');
                                    instructions_1.elementEnd();
                                }
                                instructions_1.elementEnd();
                                instructions_1.elementStart(2, 'comp');
                                {
                                    instructions_1.elementStart(3, 'projected');
                                    instructions_1.elementEnd();
                                }
                                instructions_1.elementEnd();
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.elementProperty(0, 'val', 1);
                                instructions_1.elementProperty(1, 'val', 1);
                                instructions_1.elementProperty(2, 'val', 2);
                                instructions_1.elementProperty(3, 'val', 2);
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            render_util_1.renderToHtml(Template, { showing: true }, defs);
            render_util_1.renderToHtml(Template, { showing: false }, defs);
            expect(events).toEqual(['projected1', 'comp1', 'projected2', 'comp2']);
        });
        it('should be called in consistent order if views are removed and re-added', function () {
            /**
             * % if (condition) {
             *   <comp [val]="1"></comp>
             *   % if (condition2) {
             *     <comp [val]="2"></comp>
             *   % }
             *   <comp [val]="3"></comp>
             * % }
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
                                instructions_1.elementStart(0, 'comp');
                                instructions_1.elementEnd();
                                instructions_1.container(1);
                                instructions_1.elementStart(2, 'comp');
                                instructions_1.elementEnd();
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.elementProperty(0, 'val', instructions_1.bind('1'));
                                instructions_1.elementProperty(2, 'val', instructions_1.bind('3'));
                                instructions_1.containerRefreshStart(1);
                                {
                                    if (ctx.condition2) {
                                        var rf2 = instructions_1.embeddedViewStart(0);
                                        if (rf2 & 1 /* Create */) {
                                            instructions_1.elementStart(0, 'comp');
                                            instructions_1.elementEnd();
                                        }
                                        if (rf2 & 2 /* Update */) {
                                            instructions_1.elementProperty(0, 'val', instructions_1.bind('2'));
                                        }
                                        instructions_1.embeddedViewEnd();
                                    }
                                }
                                instructions_1.containerRefreshEnd();
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            render_util_1.renderToHtml(Template, { condition: true, condition2: true }, defs);
            render_util_1.renderToHtml(Template, { condition: false }, defs);
            /**
             * Current angular will process in this same order (root is the top-level removed view):
             *
             * root.child (comp1 view) onDestroy: null
             * root.child.next (container) -> embeddedView
             * embeddedView.child (comp2 view) onDestroy: null
             * embeddedView onDestroy: [comp2]
             * root.child.next.next (comp3 view) onDestroy: null
             * root onDestroy: [comp1, comp3]
             */
            expect(events).toEqual(['comp2', 'comp1', 'comp3']);
            events = [];
            render_util_1.renderToHtml(Template, { condition: true, condition2: false }, defs);
            render_util_1.renderToHtml(Template, { condition: false }, defs);
            expect(events).toEqual(['comp1', 'comp3']);
            events = [];
            render_util_1.renderToHtml(Template, { condition: true, condition2: true }, defs);
            render_util_1.renderToHtml(Template, { condition: false }, defs);
            expect(events).toEqual(['comp2', 'comp1', 'comp3']);
        });
        it('should be called in every iteration of a destroyed for loop', function () {
            /**
             * % if (condition) {
             *   <comp [val]="1"></comp>
             *   % for (let i = 2; i < len; i++) {
             *       <comp [val]="i"></comp>
             *   % }
             *   <comp [val]="5"></comp>
             * % }
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
                                instructions_1.elementStart(0, 'comp');
                                instructions_1.elementEnd();
                                instructions_1.container(1);
                                instructions_1.elementStart(2, 'comp');
                                instructions_1.elementEnd();
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.elementProperty(0, 'val', instructions_1.bind('1'));
                                instructions_1.elementProperty(2, 'val', instructions_1.bind('5'));
                                instructions_1.containerRefreshStart(1);
                                {
                                    for (var j = 2; j < ctx.len; j++) {
                                        var rf2 = instructions_1.embeddedViewStart(0);
                                        if (rf2 & 1 /* Create */) {
                                            instructions_1.elementStart(0, 'comp');
                                            instructions_1.elementEnd();
                                        }
                                        if (rf2 & 2 /* Update */) {
                                            instructions_1.elementProperty(0, 'val', instructions_1.bind(j));
                                        }
                                        instructions_1.embeddedViewEnd();
                                    }
                                }
                                instructions_1.containerRefreshEnd();
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            /**
             * Current angular will process in this same order (root is the top-level removed view):
             *
             * root.child (comp1 view) onDestroy: null
             * root.child.next (container) -> embeddedView (children[0].data)
             * embeddedView.child (comp2 view) onDestroy: null
             * embeddedView onDestroy: [comp2]
             * embeddedView.next.child (comp3 view) onDestroy: null
             * embeddedView.next onDestroy: [comp3]
             * embeddedView.next.next.child (comp4 view) onDestroy: null
             * embeddedView.next.next onDestroy: [comp4]
             * embeddedView.next.next -> container -> root
             * root onDestroy: [comp1, comp5]
             */
            render_util_1.renderToHtml(Template, { condition: true, len: 5 }, defs);
            render_util_1.renderToHtml(Template, { condition: false }, defs);
            expect(events).toEqual(['comp2', 'comp3', 'comp4', 'comp1', 'comp5']);
            events = [];
            render_util_1.renderToHtml(Template, { condition: true, len: 4 }, defs);
            render_util_1.renderToHtml(Template, { condition: false }, defs);
            expect(events).toEqual(['comp2', 'comp3', 'comp1', 'comp5']);
            events = [];
            render_util_1.renderToHtml(Template, { condition: true, len: 5 }, defs);
            render_util_1.renderToHtml(Template, { condition: false }, defs);
            expect(events).toEqual(['comp2', 'comp3', 'comp4', 'comp1', 'comp5']);
        });
        it('should call destroy properly if view also has listeners', function () {
            /**
             * % if (condition) {
             *   <button (click)="onClick()">Click me</button>
             *   <comp></comp>
             *   <button (click)="onClick()">Click me</button>
             * % }
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
                                instructions_1.elementStart(0, 'button');
                                {
                                    instructions_1.listener('click', ctx.onClick.bind(ctx));
                                    instructions_1.text(1, 'Click me');
                                }
                                instructions_1.elementEnd();
                                instructions_1.elementStart(2, 'comp');
                                instructions_1.elementEnd();
                                instructions_1.elementStart(3, 'button');
                                {
                                    instructions_1.listener('click', ctx.onClick.bind(ctx));
                                    instructions_1.text(4, 'Click me');
                                }
                                instructions_1.elementEnd();
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            var App = /** @class */ (function () {
                function App() {
                    this.counter = 0;
                    this.condition = true;
                }
                App.prototype.onClick = function () { this.counter++; };
                return App;
            }());
            var ctx = new App();
            render_util_1.renderToHtml(Template, ctx, defs);
            var buttons = render_util_1.containerEl.querySelectorAll('button');
            buttons[0].click();
            expect(ctx.counter).toEqual(1);
            buttons[1].click();
            expect(ctx.counter).toEqual(2);
            render_util_1.renderToHtml(Template, { condition: false }, defs);
            buttons[0].click();
            buttons[1].click();
            expect(events).toEqual(['comp']);
            expect(ctx.counter).toEqual(2);
        });
        it('should be called on directives after component', function () {
            /**
             * % if (condition) {
             *   <comp></comp>
             * % }
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
                                instructions_1.elementStart(0, 'comp', ['dir', '']);
                                instructions_1.elementEnd();
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            render_util_1.renderToHtml(Template, { condition: true }, defs);
            expect(events).toEqual([]);
            render_util_1.renderToHtml(Template, { condition: false }, defs);
            expect(events).toEqual(['comp', 'dir']);
        });
        it('should be called on directives on an element', function () {
            /**
             * % if (condition) {
             *   <div directive></div>
             * % }
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
                                instructions_1.elementStart(0, 'div', ['dir', '']);
                                instructions_1.elementEnd();
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            render_util_1.renderToHtml(Template, { condition: true }, defs);
            expect(events).toEqual([]);
            render_util_1.renderToHtml(Template, { condition: false }, defs);
            expect(events).toEqual(['dir']);
        });
    });
    describe('onChanges', function () {
        var events;
        beforeEach(function () { events = []; });
        var Comp = createOnChangesComponent('comp', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.projection(1);
                }
                instructions_1.elementEnd();
            }
        });
        var Parent = createOnChangesComponent('parent', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'comp');
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.elementProperty(0, 'val1', instructions_1.bind(ctx.a));
                instructions_1.elementProperty(0, 'publicName', instructions_1.bind(ctx.b));
            }
        }, [Comp]);
        var ProjectedComp = createOnChangesComponent('projected', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.text(0, 'content');
            }
        });
        function createOnChangesComponent(name, template, directives) {
            if (directives === void 0) { directives = []; }
            var _a;
            return _a = /** @class */ (function () {
                    function Component() {
                        // @Input() val1: string;
                        // @Input('publicName') val2: string;
                        this.a = 'wasVal1BeforeMinification';
                        this.b = 'wasVal2BeforeMinification';
                    }
                    Component.prototype.ngOnChanges = function (simpleChanges) {
                        events.push("comp=" + name + " val1=" + this.a + " val2=" + this.b + " - changed=[" + Object.getOwnPropertyNames(simpleChanges).join(',') + "]");
                    };
                    return Component;
                }()),
                _a.ngComponentDef = index_1.defineComponent({
                    type: _a,
                    selectors: [[name]],
                    factory: function () { return new _a(); },
                    features: [index_1.NgOnChangesFeature],
                    inputs: { a: 'val1', b: ['publicName', 'val2'] }, template: template,
                    directives: directives
                }),
                _a;
        }
        var Directive = /** @class */ (function () {
            function Directive() {
                // @Input() val1: string;
                // @Input('publicName') val2: string;
                this.a = 'wasVal1BeforeMinification';
                this.b = 'wasVal2BeforeMinification';
            }
            Directive.prototype.ngOnChanges = function (simpleChanges) {
                events.push("dir - val1=" + this.a + " val2=" + this.b + " - changed=[" + Object.getOwnPropertyNames(simpleChanges).join(',') + "]");
            };
            Directive.ngDirectiveDef = index_1.defineDirective({
                type: Directive,
                selectors: [['', 'dir', '']],
                factory: function () { return new Directive(); },
                features: [index_1.NgOnChangesFeature],
                inputs: { a: 'val1', b: ['publicName', 'val2'] }
            });
            return Directive;
        }());
        var defs = [Comp, Parent, Directive, ProjectedComp];
        it('should call onChanges method after inputs are set in creation and update mode', function () {
            /** <comp [val1]="val1" [publicName]="val2"></comp> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp');
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val1', instructions_1.bind(ctx.val1));
                    instructions_1.elementProperty(0, 'publicName', instructions_1.bind(ctx.val2));
                }
            }
            render_util_1.renderToHtml(Template, { val1: '1', val2: 'a' }, defs);
            expect(events).toEqual(['comp=comp val1=1 val2=a - changed=[val1,val2]']);
            events.length = 0;
            render_util_1.renderToHtml(Template, { val1: '2', val2: 'b' }, defs);
            expect(events).toEqual(['comp=comp val1=2 val2=b - changed=[val1,val2]']);
        });
        it('should call parent onChanges before child onChanges', function () {
            /**
             * <parent></parent>
             * parent temp: <comp></comp>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'parent');
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val1', instructions_1.bind(ctx.val1));
                    instructions_1.elementProperty(0, 'publicName', instructions_1.bind(ctx.val2));
                }
            }
            render_util_1.renderToHtml(Template, { val1: '1', val2: 'a' }, defs);
            expect(events).toEqual([
                'comp=parent val1=1 val2=a - changed=[val1,val2]',
                'comp=comp val1=1 val2=a - changed=[val1,val2]'
            ]);
        });
        it('should call all parent onChanges across view before calling children onChanges', function () {
            /**
             * <parent [val]="1"></parent>
             * <parent [val]="2"></parent>
             *
             * parent temp: <comp [val]="val"></comp>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'parent');
                    instructions_1.elementEnd();
                    instructions_1.elementStart(1, 'parent');
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val1', instructions_1.bind(1));
                    instructions_1.elementProperty(0, 'publicName', instructions_1.bind(1));
                    instructions_1.elementProperty(1, 'val1', instructions_1.bind(2));
                    instructions_1.elementProperty(1, 'publicName', instructions_1.bind(2));
                }
            }
            render_util_1.renderToHtml(Template, {}, defs);
            expect(events).toEqual([
                'comp=parent val1=1 val2=1 - changed=[val1,val2]',
                'comp=parent val1=2 val2=2 - changed=[val1,val2]',
                'comp=comp val1=1 val2=1 - changed=[val1,val2]',
                'comp=comp val1=2 val2=2 - changed=[val1,val2]'
            ]);
        });
        it('should call onChanges every time a new view is created (if block)', function () {
            /**
             * % if (condition) {
             *   <comp></comp>
             * % }
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
                                instructions_1.elementStart(0, 'comp');
                                instructions_1.elementEnd();
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.elementProperty(0, 'val1', instructions_1.bind(1));
                                instructions_1.elementProperty(0, 'publicName', instructions_1.bind(1));
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            render_util_1.renderToHtml(Template, { condition: true }, defs);
            expect(events).toEqual(['comp=comp val1=1 val2=1 - changed=[val1,val2]']);
            render_util_1.renderToHtml(Template, { condition: false }, defs);
            expect(events).toEqual(['comp=comp val1=1 val2=1 - changed=[val1,val2]']);
            render_util_1.renderToHtml(Template, { condition: true }, defs);
            expect(events).toEqual([
                'comp=comp val1=1 val2=1 - changed=[val1,val2]',
                'comp=comp val1=1 val2=1 - changed=[val1,val2]'
            ]);
        });
        it('should call onChanges in hosts before their content children', function () {
            /**
             * <comp>
             *   <projected></projected>
             * </comp>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp');
                    {
                        instructions_1.elementStart(1, 'projected');
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val1', instructions_1.bind(1));
                    instructions_1.elementProperty(0, 'publicName', instructions_1.bind(1));
                    instructions_1.elementProperty(1, 'val1', instructions_1.bind(2));
                    instructions_1.elementProperty(1, 'publicName', instructions_1.bind(2));
                }
            }
            render_util_1.renderToHtml(Template, {}, defs);
            expect(events).toEqual([
                'comp=comp val1=1 val2=1 - changed=[val1,val2]',
                'comp=projected val1=2 val2=2 - changed=[val1,val2]'
            ]);
        });
        it('should call onChanges in host and its content children before next host', function () {
            /**
             * <comp [val]="1">
             *   <projected [val]="1"></projected>
             * </comp>
             * <comp [val]="2">
             *   <projected [val]="1"></projected>
             * </comp>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp');
                    {
                        instructions_1.elementStart(1, 'projected');
                    }
                    instructions_1.elementEnd();
                    instructions_1.elementStart(2, 'comp');
                    {
                        instructions_1.elementStart(3, 'projected');
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val1', instructions_1.bind(1));
                    instructions_1.elementProperty(0, 'publicName', instructions_1.bind(1));
                    instructions_1.elementProperty(1, 'val1', instructions_1.bind(2));
                    instructions_1.elementProperty(1, 'publicName', instructions_1.bind(2));
                    instructions_1.elementProperty(2, 'val1', instructions_1.bind(3));
                    instructions_1.elementProperty(2, 'publicName', instructions_1.bind(3));
                    instructions_1.elementProperty(3, 'val1', instructions_1.bind(4));
                    instructions_1.elementProperty(3, 'publicName', instructions_1.bind(4));
                }
            }
            render_util_1.renderToHtml(Template, {}, defs);
            expect(events).toEqual([
                'comp=comp val1=1 val2=1 - changed=[val1,val2]',
                'comp=projected val1=2 val2=2 - changed=[val1,val2]',
                'comp=comp val1=3 val2=3 - changed=[val1,val2]',
                'comp=projected val1=4 val2=4 - changed=[val1,val2]'
            ]);
        });
        it('should be called on directives after component', function () {
            /** <comp directive></comp> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp', ['dir', '']);
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val1', instructions_1.bind(1));
                    instructions_1.elementProperty(0, 'publicName', instructions_1.bind(1));
                }
            }
            render_util_1.renderToHtml(Template, {}, defs);
            expect(events).toEqual([
                'comp=comp val1=1 val2=1 - changed=[val1,val2]', 'dir - val1=1 val2=1 - changed=[val1,val2]'
            ]);
            render_util_1.renderToHtml(Template, {}, defs);
            expect(events).toEqual([
                'comp=comp val1=1 val2=1 - changed=[val1,val2]', 'dir - val1=1 val2=1 - changed=[val1,val2]'
            ]);
        });
        it('should be called on directives on an element', function () {
            /** <div directive></div> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['dir', '']);
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val1', instructions_1.bind(1));
                    instructions_1.elementProperty(0, 'publicName', instructions_1.bind(1));
                }
            }
            render_util_1.renderToHtml(Template, {}, defs);
            expect(events).toEqual(['dir - val1=1 val2=1 - changed=[val1,val2]']);
            render_util_1.renderToHtml(Template, {}, defs);
            expect(events).toEqual(['dir - val1=1 val2=1 - changed=[val1,val2]']);
        });
        it('should call onChanges properly in for loop', function () {
            /**
             *  <comp [val]="1"></comp>
             * % for (let j = 2; j < 5; j++) {
             *   <comp [val]="j"></comp>
             * % }
             *  <comp [val]="5"></comp>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp');
                    instructions_1.elementEnd();
                    instructions_1.container(1);
                    instructions_1.elementStart(2, 'comp');
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val1', instructions_1.bind(1));
                    instructions_1.elementProperty(0, 'publicName', instructions_1.bind(1));
                    instructions_1.elementProperty(2, 'val1', instructions_1.bind(5));
                    instructions_1.elementProperty(2, 'publicName', instructions_1.bind(5));
                    instructions_1.containerRefreshStart(1);
                    {
                        for (var j = 2; j < 5; j++) {
                            var rf1 = instructions_1.embeddedViewStart(0);
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'comp');
                                instructions_1.elementEnd();
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.elementProperty(0, 'val1', instructions_1.bind(j));
                                instructions_1.elementProperty(0, 'publicName', instructions_1.bind(j));
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            render_util_1.renderToHtml(Template, {}, defs);
            // onChanges is called top to bottom, so top level comps (1 and 5) are called
            // before the comps inside the for loop's embedded view (2, 3, and 4)
            expect(events).toEqual([
                'comp=comp val1=1 val2=1 - changed=[val1,val2]',
                'comp=comp val1=5 val2=5 - changed=[val1,val2]',
                'comp=comp val1=2 val2=2 - changed=[val1,val2]',
                'comp=comp val1=3 val2=3 - changed=[val1,val2]',
                'comp=comp val1=4 val2=4 - changed=[val1,val2]'
            ]);
        });
        it('should call onChanges properly in for loop with children', function () {
            /**
             *  <parent [val]="1"></parent>
             * % for (let j = 2; j < 5; j++) {
             *   <parent [val]="j"></parent>
             * % }
             *  <parent [val]="5"></parent>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'parent');
                    instructions_1.elementEnd();
                    instructions_1.container(1);
                    instructions_1.elementStart(2, 'parent');
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val1', instructions_1.bind(1));
                    instructions_1.elementProperty(0, 'publicName', instructions_1.bind(1));
                    instructions_1.elementProperty(2, 'val1', instructions_1.bind(5));
                    instructions_1.elementProperty(2, 'publicName', instructions_1.bind(5));
                    instructions_1.containerRefreshStart(1);
                    {
                        for (var j = 2; j < 5; j++) {
                            var rf1 = instructions_1.embeddedViewStart(0);
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'parent');
                                instructions_1.elementEnd();
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.elementProperty(0, 'val1', instructions_1.bind(j));
                                instructions_1.elementProperty(0, 'publicName', instructions_1.bind(j));
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            render_util_1.renderToHtml(Template, {}, defs);
            // onChanges is called top to bottom, so top level comps (1 and 5) are called
            // before the comps inside the for loop's embedded view (2, 3, and 4)
            expect(events).toEqual([
                'comp=parent val1=1 val2=1 - changed=[val1,val2]',
                'comp=parent val1=5 val2=5 - changed=[val1,val2]',
                'comp=parent val1=2 val2=2 - changed=[val1,val2]',
                'comp=comp val1=2 val2=2 - changed=[val1,val2]',
                'comp=parent val1=3 val2=3 - changed=[val1,val2]',
                'comp=comp val1=3 val2=3 - changed=[val1,val2]',
                'comp=parent val1=4 val2=4 - changed=[val1,val2]',
                'comp=comp val1=4 val2=4 - changed=[val1,val2]',
                'comp=comp val1=1 val2=1 - changed=[val1,val2]',
                'comp=comp val1=5 val2=5 - changed=[val1,val2]'
            ]);
        });
    });
    describe('hook order', function () {
        var events;
        beforeEach(function () { events = []; });
        function createAllHooksComponent(name, template, directives) {
            if (directives === void 0) { directives = []; }
            var _a;
            return _a = /** @class */ (function () {
                    function Component() {
                        this.val = '';
                    }
                    Component.prototype.ngOnChanges = function () { events.push("changes " + name + this.val); };
                    Component.prototype.ngOnInit = function () { events.push("init " + name + this.val); };
                    Component.prototype.ngDoCheck = function () { events.push("check " + name + this.val); };
                    Component.prototype.ngAfterContentInit = function () { events.push("contentInit " + name + this.val); };
                    Component.prototype.ngAfterContentChecked = function () { events.push("contentCheck " + name + this.val); };
                    Component.prototype.ngAfterViewInit = function () { events.push("viewInit " + name + this.val); };
                    Component.prototype.ngAfterViewChecked = function () { events.push("viewCheck " + name + this.val); };
                    return Component;
                }()),
                _a.ngComponentDef = index_1.defineComponent({
                    type: _a,
                    selectors: [[name]],
                    factory: function () { return new _a(); },
                    inputs: { val: 'val' }, template: template,
                    features: [index_1.NgOnChangesFeature],
                    directives: directives
                }),
                _a;
        }
        it('should call all hooks in correct order', function () {
            var Comp = createAllHooksComponent('comp', function (rf, ctx) { });
            /**
             * <comp [val]="1"></comp>
             * <comp [val]="2"></comp>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp');
                    instructions_1.elementEnd();
                    instructions_1.elementStart(1, 'comp');
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val', 1);
                    instructions_1.elementProperty(1, 'val', 2);
                }
            }
            var defs = [Comp];
            render_util_1.renderToHtml(Template, {}, defs);
            expect(events).toEqual([
                'changes comp1', 'init comp1', 'check comp1', 'changes comp2', 'init comp2', 'check comp2',
                'contentInit comp1', 'contentCheck comp1', 'contentInit comp2', 'contentCheck comp2',
                'viewInit comp1', 'viewCheck comp1', 'viewInit comp2', 'viewCheck comp2'
            ]);
            events = [];
            render_util_1.renderToHtml(Template, {}, defs);
            expect(events).toEqual([
                'changes comp1', 'check comp1', 'changes comp2', 'check comp2', 'contentCheck comp1',
                'contentCheck comp2', 'viewCheck comp1', 'viewCheck comp2'
            ]);
        });
        it('should call all hooks in correct order with children', function () {
            var Comp = createAllHooksComponent('comp', function (rf, ctx) { });
            /** <comp [val]="val"></comp> */
            var Parent = createAllHooksComponent('parent', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp');
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val', instructions_1.bind(ctx.val));
                }
            }, [Comp]);
            /**
             * <parent [val]="1"></parent>
             * <parent [val]="2"></parent>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'parent');
                    instructions_1.elementEnd();
                    instructions_1.elementStart(1, 'parent');
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val', 1);
                    instructions_1.elementProperty(1, 'val', 2);
                }
            }
            var defs = [Parent];
            render_util_1.renderToHtml(Template, {}, defs);
            expect(events).toEqual([
                'changes parent1', 'init parent1', 'check parent1',
                'changes parent2', 'init parent2', 'check parent2',
                'contentInit parent1', 'contentCheck parent1', 'contentInit parent2',
                'contentCheck parent2', 'changes comp1', 'init comp1',
                'check comp1', 'contentInit comp1', 'contentCheck comp1',
                'viewInit comp1', 'viewCheck comp1', 'changes comp2',
                'init comp2', 'check comp2', 'contentInit comp2',
                'contentCheck comp2', 'viewInit comp2', 'viewCheck comp2',
                'viewInit parent1', 'viewCheck parent1', 'viewInit parent2',
                'viewCheck parent2'
            ]);
            events = [];
            render_util_1.renderToHtml(Template, {}, defs);
            expect(events).toEqual([
                'changes parent1', 'check parent1', 'changes parent2', 'check parent2',
                'contentCheck parent1', 'contentCheck parent2', 'check comp1', 'contentCheck comp1',
                'viewCheck comp1', 'check comp2', 'contentCheck comp2', 'viewCheck comp2',
                'viewCheck parent1', 'viewCheck parent2'
            ]);
        });
        // Angular 5 reference: https://stackblitz.com/edit/lifecycle-hooks-ng
        it('should call all hooks in correct order with view and content', function () {
            var Content = createAllHooksComponent('content', function (rf, ctx) { });
            var View = createAllHooksComponent('view', function (rf, ctx) { });
            /** <ng-content></ng-content><view [val]="val"></view> */
            var Parent = createAllHooksComponent('parent', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.projectionDef();
                    instructions_1.projection(0);
                    instructions_1.elementStart(1, 'view');
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(1, 'val', instructions_1.bind(ctx.val));
                }
            }, [View]);
            /**
             * <parent [val]="1">
             *   <content [val]="1"></content>
             * </parent>
             * <parent [val]="2">
             *   <content [val]="2"></content>
             * </parent>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'parent');
                    {
                        instructions_1.elementStart(1, 'content');
                        instructions_1.elementEnd();
                    }
                    instructions_1.elementEnd();
                    instructions_1.elementStart(2, 'parent');
                    {
                        instructions_1.elementStart(3, 'content');
                        instructions_1.elementEnd();
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'val', instructions_1.bind(1));
                    instructions_1.elementProperty(1, 'val', instructions_1.bind(1));
                    instructions_1.elementProperty(2, 'val', instructions_1.bind(2));
                    instructions_1.elementProperty(3, 'val', instructions_1.bind(2));
                }
            }
            var defs = [Parent, Content];
            render_util_1.renderToHtml(Template, {}, defs);
            expect(events).toEqual([
                'changes parent1', 'init parent1',
                'check parent1', 'changes content1',
                'init content1', 'check content1',
                'changes parent2', 'init parent2',
                'check parent2', 'changes content2',
                'init content2', 'check content2',
                'contentInit content1', 'contentCheck content1',
                'contentInit parent1', 'contentCheck parent1',
                'contentInit content2', 'contentCheck content2',
                'contentInit parent2', 'contentCheck parent2',
                'changes view1', 'init view1',
                'check view1', 'contentInit view1',
                'contentCheck view1', 'viewInit view1',
                'viewCheck view1', 'changes view2',
                'init view2', 'check view2',
                'contentInit view2', 'contentCheck view2',
                'viewInit view2', 'viewCheck view2',
                'viewInit content1', 'viewCheck content1',
                'viewInit parent1', 'viewCheck parent1',
                'viewInit content2', 'viewCheck content2',
                'viewInit parent2', 'viewCheck parent2'
            ]);
            events = [];
            render_util_1.renderToHtml(Template, {}, defs);
            expect(events).toEqual([
                'check parent1', 'check content1', 'check parent2', 'check content2',
                'contentCheck content1', 'contentCheck parent1', 'contentCheck content2',
                'contentCheck parent2', 'check view1', 'contentCheck view1', 'viewCheck view1',
                'check view2', 'contentCheck view2', 'viewCheck view2', 'viewCheck content1',
                'viewCheck parent1', 'viewCheck content2', 'viewCheck parent2'
            ]);
        });
    });
    describe('non-regression', function () {
        it('should call lifecycle hooks for directives active on <ng-template>', function () {
            var destroyed = false;
            var OnDestroyDirective = /** @class */ (function () {
                function OnDestroyDirective() {
                }
                OnDestroyDirective.prototype.ngOnDestroy = function () { destroyed = true; };
                OnDestroyDirective.ngDirectiveDef = index_1.defineDirective({
                    type: OnDestroyDirective,
                    selectors: [['', 'onDestroyDirective', '']],
                    factory: function () { return new OnDestroyDirective(); }
                });
                return OnDestroyDirective;
            }());
            function conditionTpl(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.container(0, cmptTpl, null, [1 /* SelectOnly */, 'onDestroyDirective']);
                }
            }
            /**
             * <ng-template [ngIf]="condition">
             *  <ng-template onDestroyDirective></ng-template>
             * </ng-template>
             */
            function cmptTpl(rf, cmpt) {
                if (rf & 1 /* Create */) {
                    instructions_1.container(0, conditionTpl, null, [1 /* SelectOnly */, 'ngIf']);
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'ngIf', instructions_1.bind(cmpt.showing));
                }
            }
            var Cmpt = /** @class */ (function () {
                function Cmpt() {
                    this.showing = true;
                }
                Cmpt.ngComponentDef = index_1.defineComponent({
                    type: Cmpt,
                    factory: function () { return new Cmpt(); },
                    selectors: [['cmpt']],
                    template: cmptTpl,
                    directives: [common_with_def_1.NgIf, OnDestroyDirective]
                });
                return Cmpt;
            }());
            var fixture = new render_util_1.ComponentFixture(Cmpt);
            expect(destroyed).toBeFalsy();
            fixture.component.showing = false;
            fixture.update();
            expect(destroyed).toBeTruthy();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlmZWN5Y2xlX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVuZGVyMy9saWZlY3ljbGVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILGlEQUF3SjtBQUN4SiwrREFBdVA7QUFHdlAscURBQXVDO0FBQ3ZDLDZDQUFtSTtBQUVuSSxRQUFRLENBQUMsWUFBWSxFQUFFO0lBRXJCLDJCQUEyQixJQUFZO1FBQ3JDLE9BQU8sVUFBQyxFQUFlLEVBQUUsR0FBUTtZQUMvQixJQUFJLEVBQUUsaUJBQXFCLEVBQUU7Z0JBQzNCLDJCQUFZLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN0Qix5QkFBVSxFQUFFLENBQUM7YUFDZDtZQUNELElBQUksRUFBRSxpQkFBcUIsRUFBRTtnQkFDM0IsOEJBQWUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLG1CQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDMUM7UUFDSCxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsUUFBUSxDQUFDLFFBQVEsRUFBRTtRQUNqQixJQUFJLE1BQWdCLENBQUM7UUFFckIsVUFBVSxDQUFDLGNBQVEsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRW5DLElBQUksSUFBSSxHQUFHLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxVQUFDLEVBQWUsRUFBRSxHQUFRO1lBQ2pFLElBQUksRUFBRSxpQkFBcUIsRUFBRTtnQkFDM0IsNEJBQWEsRUFBRSxDQUFDO2dCQUNoQiwyQkFBWSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDdkI7b0JBQUUseUJBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFBRTtnQkFDbEIseUJBQVUsRUFBRSxDQUFDO2FBQ2Q7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILElB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