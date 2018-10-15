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
var imported_renderer2_1 = require("./imported_renderer2");
var render_util_1 = require("./render_util");
describe('event listeners', function () {
    var comps = [];
    var MyComp = /** @class */ (function () {
        function MyComp() {
            this.showing = true;
            this.counter = 0;
        }
        MyComp.prototype.onClick = function () { this.counter++; };
        MyComp.ngComponentDef = index_1.defineComponent({
            type: MyComp,
            selectors: [['comp']],
            /** <button (click)="onClick()"> Click me </button> */
            template: function CompTemplate(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'button');
                    {
                        instructions_1.listener('click', function () { return ctx.onClick(); });
                        instructions_1.text(1, 'Click me');
                    }
                    instructions_1.elementEnd();
                }
            },
            factory: function () {
                var comp = new MyComp();
                comps.push(comp);
                return comp;
            }
        });
        return MyComp;
    }());
    var PreventDefaultComp = /** @class */ (function () {
        function PreventDefaultComp() {
            this.handlerReturnValue = true;
        }
        PreventDefaultComp.prototype.onClick = function (e) {
            this.event = e;
            // stub preventDefault() to check whether it's called
            Object.defineProperty(this.event, 'preventDefault', { value: jasmine.createSpy('preventDefault'), writable: true });
            return this.handlerReturnValue;
        };
        PreventDefaultComp.ngComponentDef = index_1.defineComponent({
            type: PreventDefaultComp,
            selectors: [['prevent-default-comp']],
            factory: function () { return new PreventDefaultComp(); },
            /** <button (click)="onClick($event)">Click</button> */
            template: function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'button');
                    {
                        instructions_1.listener('click', function ($event) { return ctx.onClick($event); });
                        instructions_1.text(1, 'Click');
                    }
                    instructions_1.elementEnd();
                }
            }
        });
        return PreventDefaultComp;
    }());
    beforeEach(function () { comps = []; });
    it('should call function on event emit', function () {
        var comp = render_util_1.renderComponent(MyComp);
        var button = render_util_1.containerEl.querySelector('button');
        button.click();
        expect(comp.counter).toEqual(1);
        button.click();
        expect(comp.counter).toEqual(2);
    });
    it('should retain event handler return values using document', function () {
        var preventDefaultComp = render_util_1.renderComponent(PreventDefaultComp);
        var button = render_util_1.containerEl.querySelector('button');
        button.click();
        expect(preventDefaultComp.event.preventDefault).not.toHaveBeenCalled();
        preventDefaultComp.handlerReturnValue = undefined;
        button.click();
        expect(preventDefaultComp.event.preventDefault).not.toHaveBeenCalled();
        preventDefaultComp.handlerReturnValue = false;
        button.click();
        expect(preventDefaultComp.event.preventDefault).toHaveBeenCalled();
    });
    it('should retain event handler return values with renderer2', function () {
        var preventDefaultComp = render_util_1.renderComponent(PreventDefaultComp, { rendererFactory: imported_renderer2_1.getRendererFactory2(document) });
        var button = render_util_1.containerEl.querySelector('button');
        button.click();
        expect(preventDefaultComp.event.preventDefault).not.toHaveBeenCalled();
        preventDefaultComp.handlerReturnValue = undefined;
        button.click();
        expect(preventDefaultComp.event.preventDefault).not.toHaveBeenCalled();
        preventDefaultComp.handlerReturnValue = false;
        button.click();
        expect(preventDefaultComp.event.preventDefault).toHaveBeenCalled();
    });
    it('should call function chain on event emit', function () {
        /** <button (click)="onClick(); onClick2(); "> Click me </button> */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'button');
                {
                    instructions_1.listener('click', function () {
                        ctx.onClick();
                        return ctx.onClick2();
                    });
                    instructions_1.text(1, 'Click me');
                }
                instructions_1.elementEnd();
            }
        }
        var ctx = {
            counter: 0,
            counter2: 0,
            onClick: function () { this.counter++; },
            onClick2: function () { this.counter2++; }
        };
        render_util_1.renderToHtml(Template, ctx);
        var button = render_util_1.containerEl.querySelector('button');
        button.click();
        expect(ctx.counter).toBe(1);
        expect(ctx.counter2).toBe(1);
        button.click();
        expect(ctx.counter).toBe(2);
        expect(ctx.counter2).toBe(2);
    });
    it('should evaluate expression on event emit', function () {
        /** <button (click)="showing=!showing"> Click me </button> */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'button');
                {
                    instructions_1.listener('click', function () { return ctx.showing = !ctx.showing; });
                    instructions_1.text(1, 'Click me');
                }
                instructions_1.elementEnd();
            }
        }
        var ctx = { showing: false };
        render_util_1.renderToHtml(Template, ctx);
        var button = render_util_1.containerEl.querySelector('button');
        button.click();
        expect(ctx.showing).toBe(true);
        button.click();
        expect(ctx.showing).toBe(false);
    });
    it('should support listeners in views', function () {
        /**
         * % if (ctx.showing) {
           *  <button (click)="onClick()"> Click me </button>
           * % }
         */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.container(0);
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(0);
                {
                    if (ctx.showing) {
                        if (instructions_1.embeddedViewStart(1)) {
                            instructions_1.elementStart(0, 'button');
                            {
                                instructions_1.listener('click', function () { return ctx.onClick(); });
                                instructions_1.text(1, 'Click me');
                            }
                            instructions_1.elementEnd();
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        }
        var comp = new MyComp();
        render_util_1.renderToHtml(Template, comp);
        var button = render_util_1.containerEl.querySelector('button');
        button.click();
        expect(comp.counter).toEqual(1);
        button.click();
        expect(comp.counter).toEqual(2);
        // the listener should be removed when the view is removed
        comp.showing = false;
        render_util_1.renderToHtml(Template, comp);
        button.click();
        expect(comp.counter).toEqual(2);
    });
    it('should destroy listeners in views with renderer2', function () {
        /**
         * % if (ctx.showing) {
           *  <button (click)="onClick()"> Click me </button>
           * % }
         */
        var AppComp = /** @class */ (function () {
            function AppComp() {
                this.counter = 0;
                this.showing = true;
            }
            AppComp.prototype.onClick = function () { this.counter++; };
            AppComp.ngComponentDef = index_1.defineComponent({
                type: AppComp,
                selectors: [['app-comp']],
                factory: function () { return new AppComp(); },
                template: function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.container(0);
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.containerRefreshStart(0);
                        {
                            if (ctx.showing) {
                                if (instructions_1.embeddedViewStart(0)) {
                                    instructions_1.elementStart(0, 'button');
                                    {
                                        instructions_1.listener('click', function () { return ctx.onClick(); });
                                        instructions_1.text(1, 'Click me');
                                    }
                                    instructions_1.elementEnd();
                                }
                                instructions_1.embeddedViewEnd();
                            }
                        }
                        instructions_1.containerRefreshEnd();
                    }
                }
            });
            return AppComp;
        }());
        var fixture = new render_util_1.ComponentFixture(AppComp, { rendererFactory: imported_renderer2_1.getRendererFactory2(document) });
        var comp = fixture.component;
        var button = fixture.hostElement.querySelector('button');
        button.click();
        expect(comp.counter).toEqual(1);
        button.click();
        expect(comp.counter).toEqual(2);
        // the listener should be removed when the view is removed
        comp.showing = false;
        fixture.update();
        button.click();
        expect(comp.counter).toEqual(2);
    });
    it('should destroy listeners in for loops', function () {
        /**
         * % for (let i = 0; i < ctx.buttons; i++) {
           *  <button (click)="onClick(i)"> Click me </button>
           * % }
         */
        var AppComp = /** @class */ (function () {
            function AppComp() {
                this.buttons = 2;
                this.counters = [0, 0];
            }
            AppComp.prototype.onClick = function (index) { this.counters[index]++; };
            AppComp.ngComponentDef = index_1.defineComponent({
                type: AppComp,
                selectors: [['app-comp']],
                factory: function () { return new AppComp(); },
                template: function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.container(0);
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.containerRefreshStart(0);
                        {
                            var _loop_1 = function (i) {
                                if (instructions_1.embeddedViewStart(0)) {
                                    instructions_1.elementStart(0, 'button');
                                    {
                                        instructions_1.listener('click', function () { return ctx.onClick(i); });
                                        instructions_1.text(1, 'Click me');
                                    }
                                    instructions_1.elementEnd();
                                }
                                instructions_1.embeddedViewEnd();
                            };
                            for (var i = 0; i < ctx.buttons; i++) {
                                _loop_1(i);
                            }
                        }
                        instructions_1.containerRefreshEnd();
                    }
                }
            });
            return AppComp;
        }());
        var fixture = new render_util_1.ComponentFixture(AppComp);
        var comp = fixture.component;
        var buttons = fixture.hostElement.querySelectorAll('button');
        buttons[0].click();
        expect(comp.counters).toEqual([1, 0]);
        buttons[1].click();
        expect(comp.counters).toEqual([1, 1]);
        // the listener should be removed when the view is removed
        comp.buttons = 0;
        fixture.update();
        buttons[0].click();
        buttons[1].click();
        expect(comp.counters).toEqual([1, 1]);
    });
    it('should destroy listeners in for loops with renderer2', function () {
        /**
         * % for (let i = 0; i < ctx.buttons; i++) {
           *  <button (click)="onClick(i)"> Click me </button>
           * % }
         */
        var AppComp = /** @class */ (function () {
            function AppComp() {
                this.buttons = 2;
                this.counters = [0, 0];
            }
            AppComp.prototype.onClick = function (index) { this.counters[index]++; };
            AppComp.ngComponentDef = index_1.defineComponent({
                type: AppComp,
                selectors: [['app-comp']],
                factory: function () { return new AppComp(); },
                template: function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.container(0);
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.containerRefreshStart(0);
                        {
                            var _loop_2 = function (i) {
                                if (instructions_1.embeddedViewStart(1)) {
                                    instructions_1.elementStart(0, 'button');
                                    {
                                        instructions_1.listener('click', function () { return ctx.onClick(i); });
                                        instructions_1.text(1, 'Click me');
                                    }
                                    instructions_1.elementEnd();
                                }
                                instructions_1.embeddedViewEnd();
                            };
                            for (var i = 0; i < ctx.buttons; i++) {
                                _loop_2(i);
                            }
                        }
                        instructions_1.containerRefreshEnd();
                    }
                }
            });
            return AppComp;
        }());
        var fixture = new render_util_1.ComponentFixture(AppComp, { rendererFactory: imported_renderer2_1.getRendererFactory2(document) });
        var comp = fixture.component;
        var buttons = fixture.hostElement.querySelectorAll('button');
        buttons[0].click();
        expect(comp.counters).toEqual([1, 0]);
        buttons[1].click();
        expect(comp.counters).toEqual([1, 1]);
        // the listener should be removed when the view is removed
        comp.buttons = 0;
        fixture.update();
        buttons[0].click();
        buttons[1].click();
        expect(comp.counters).toEqual([1, 1]);
    });
    it('should support host listeners', function () {
        var events = [];
        var HostListenerDir = /** @class */ (function () {
            function HostListenerDir() {
            }
            /* @HostListener('click') */
            HostListenerDir.prototype.onClick = function () { events.push('click!'); };
            HostListenerDir.ngDirectiveDef = index_1.defineDirective({
                type: HostListenerDir,
                selectors: [['', 'hostListenerDir', '']],
                factory: function HostListenerDir_Factory() {
                    var $dir$ = new HostListenerDir();
                    instructions_1.listener('click', function () { return $dir$.onClick(); });
                    return $dir$;
                },
            });
            return HostListenerDir;
        }());
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'button', ['hostListenerDir', '']);
                instructions_1.text(1, 'Click');
                instructions_1.elementEnd();
            }
        }
        render_util_1.renderToHtml(Template, {}, [HostListenerDir]);
        var button = render_util_1.containerEl.querySelector('button');
        button.click();
        expect(events).toEqual(['click!']);
        button.click();
        expect(events).toEqual(['click!', 'click!']);
    });
    it('should destroy listeners in nested views', function () {
        /**
         * % if (showing) {
           *    Hello
           *    % if (button) {
           *      <button (click)="onClick()"> Click </button>
           *    % }
           * % }
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
                            instructions_1.text(0, 'Hello');
                            instructions_1.container(1);
                        }
                        if (rf1 & 2 /* Update */) {
                            instructions_1.containerRefreshStart(1);
                            {
                                if (ctx.button) {
                                    var rf1_1 = instructions_1.embeddedViewStart(0);
                                    if (rf1_1 & 1 /* Create */) {
                                        instructions_1.elementStart(0, 'button');
                                        {
                                            instructions_1.listener('click', function () { return ctx.onClick(); });
                                            instructions_1.text(1, 'Click');
                                        }
                                        instructions_1.elementEnd();
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
        var comp = { showing: true, counter: 0, button: true, onClick: function () { this.counter++; } };
        render_util_1.renderToHtml(Template, comp);
        var button = render_util_1.containerEl.querySelector('button');
        button.click();
        expect(comp.counter).toEqual(1);
        // the child view listener should be removed when the parent view is removed
        comp.showing = false;
        render_util_1.renderToHtml(Template, comp);
        button.click();
        expect(comp.counter).toEqual(1);
    });
    it('should destroy listeners in component views', function () {
        /**
         * % if (showing) {
           *    Hello
           *    <comp></comp>
           *    <comp></comp>
           * % }
         *
         * comp:
         * <button (click)="onClick()"> Click </button>
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
                            instructions_1.text(0, 'Hello');
                            instructions_1.elementStart(1, 'comp');
                            instructions_1.elementEnd();
                            instructions_1.elementStart(2, 'comp');
                            instructions_1.elementEnd();
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        }
        var ctx = { showing: true };
        render_util_1.renderToHtml(Template, ctx, [MyComp]);
        var buttons = render_util_1.containerEl.querySelectorAll('button');
        buttons[0].click();
        expect(comps[0].counter).toEqual(1);
        buttons[1].click();
        expect(comps[1].counter).toEqual(1);
        // the child view listener should be removed when the parent view is removed
        ctx.showing = false;
        render_util_1.renderToHtml(Template, ctx, [MyComp]);
        buttons[0].click();
        buttons[1].click();
        expect(comps[0].counter).toEqual(1);
        expect(comps[1].counter).toEqual(1);
    });
    it('should support listeners with sibling nested containers', function () {
        /**
         * % if (condition) {
         *   Hello
         *   % if (sub1) {
         *     <button (click)="counter1++">there</button>
         *   % }
         *
         *   % if (sub2) {
         *    <button (click)="counter2++">world</button>
         *   % }
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
                            instructions_1.text(0, 'Hello');
                            instructions_1.container(1);
                            instructions_1.container(2);
                        }
                        if (rf1 & 2 /* Update */) {
                            instructions_1.containerRefreshStart(1);
                            {
                                if (ctx.sub1) {
                                    var rf1_2 = instructions_1.embeddedViewStart(0);
                                    if (rf1_2 & 1 /* Create */) {
                                        instructions_1.elementStart(0, 'button');
                                        {
                                            instructions_1.listener('click', function () { return ctx.counter1++; });
                                            instructions_1.text(1, 'Click');
                                        }
                                        instructions_1.elementEnd();
                                    }
                                    instructions_1.embeddedViewEnd();
                                }
                            }
                            instructions_1.containerRefreshEnd();
                            instructions_1.containerRefreshStart(2);
                            {
                                if (ctx.sub2) {
                                    var rf1_3 = instructions_1.embeddedViewStart(0);
                                    if (rf1_3 & 1 /* Create */) {
                                        instructions_1.elementStart(0, 'button');
                                        {
                                            instructions_1.listener('click', function () { return ctx.counter2++; });
                                            instructions_1.text(1, 'Click');
                                        }
                                        instructions_1.elementEnd();
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
        var ctx = { condition: true, counter1: 0, counter2: 0, sub1: true, sub2: true };
        render_util_1.renderToHtml(Template, ctx);
        var buttons = render_util_1.containerEl.querySelectorAll('button');
        buttons[0].click();
        expect(ctx.counter1).toEqual(1);
        buttons[1].click();
        expect(ctx.counter2).toEqual(1);
        // the child view listeners should be removed when the parent view is removed
        ctx.condition = false;
        render_util_1.renderToHtml(Template, ctx);
        buttons[0].click();
        buttons[1].click();
        expect(ctx.counter1).toEqual(1);
        expect(ctx.counter2).toEqual(1);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdGVuZXJzX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVuZGVyMy9saXN0ZW5lcnNfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILGlEQUF5RTtBQUN6RSwrREFBbUw7QUFFbkwsMkRBQXlEO0FBQ3pELDZDQUEyRjtBQUczRixRQUFRLENBQUMsaUJBQWlCLEVBQUU7SUFDMUIsSUFBSSxLQUFLLEdBQWEsRUFBRSxDQUFDO0lBRXpCO1FBQUE7WUFDRSxZQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ2YsWUFBTyxHQUFHLENBQUMsQ0FBQztRQXdCZCxDQUFDO1FBdEJDLHdCQUFPLEdBQVAsY0FBWSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXRCLHFCQUFjLEdBQUcsdUJBQWUsQ0FBQztZQUN0QyxJQUFJLEVBQUUsTUFBTTtZQUNaLFNBQVMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckIsc0RBQXNEO1lBQ3RELFFBQVEsRUFBRSxzQkFBc0IsRUFBZSxFQUFFLEdBQVE7Z0JBQ3ZELElBQUksRUFBRSxpQkFBcUIsRUFBRTtvQkFDM0IsMkJBQVksQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBQzFCO3dCQUNFLHVCQUFRLENBQUMsT0FBTyxFQUFFLGNBQWEsT0FBTyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDeEQsbUJBQUksQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7cUJBQ3JCO29CQUNELHlCQUFVLEVBQUUsQ0FBQztpQkFDZDtZQUNILENBQUM7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxJQUFJLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztnQkFDeEIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztn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