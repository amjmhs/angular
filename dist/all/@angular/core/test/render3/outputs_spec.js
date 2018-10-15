"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var index_1 = require("../../src/render3/index");
var instructions_1 = require("../../src/render3/instructions");
var render_util_1 = require("./render_util");
describe('outputs', function () {
    var buttonToggle;
    var destroyComp;
    var buttonDir;
    var ButtonToggle = /** @class */ (function () {
        function ButtonToggle() {
            this.change = new core_1.EventEmitter();
            this.resetStream = new core_1.EventEmitter();
        }
        ButtonToggle.ngComponentDef = index_1.defineComponent({
            type: ButtonToggle,
            selectors: [['button-toggle']],
            template: function (rf, ctx) { },
            factory: function () { return buttonToggle = new ButtonToggle(); },
            outputs: { change: 'change', resetStream: 'reset' }
        });
        return ButtonToggle;
    }());
    var otherDir;
    var OtherDir = /** @class */ (function () {
        function OtherDir() {
            this.changeStream = new core_1.EventEmitter();
        }
        OtherDir.ngDirectiveDef = index_1.defineDirective({
            type: OtherDir,
            selectors: [['', 'otherDir', '']],
            factory: function () { return otherDir = new OtherDir; },
            outputs: { changeStream: 'change' }
        });
        return OtherDir;
    }());
    var DestroyComp = /** @class */ (function () {
        function DestroyComp() {
            this.events = [];
        }
        DestroyComp.prototype.ngOnDestroy = function () { this.events.push('destroy'); };
        DestroyComp.ngComponentDef = index_1.defineComponent({
            type: DestroyComp,
            selectors: [['destroy-comp']],
            template: function (rf, ctx) { },
            factory: function () { return destroyComp = new DestroyComp(); }
        });
        return DestroyComp;
    }());
    /** <button myButton (click)="onClick()">Click me</button> */
    var MyButton = /** @class */ (function () {
        function MyButton() {
            this.click = new core_1.EventEmitter();
        }
        MyButton.ngDirectiveDef = index_1.defineDirective({
            type: MyButton,
            selectors: [['', 'myButton', '']],
            factory: function () { return buttonDir = new MyButton; },
            outputs: { click: 'click' }
        });
        return MyButton;
    }());
    var deps = [ButtonToggle, OtherDir, DestroyComp, MyButton];
    it('should call component output function when event is emitted', function () {
        /** <button-toggle (change)="onChange()"></button-toggle> */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'button-toggle');
                {
                    instructions_1.listener('change', function () { return ctx.onChange(); });
                }
                instructions_1.elementEnd();
            }
        }
        var counter = 0;
        var ctx = { onChange: function () { return counter++; } };
        render_util_1.renderToHtml(Template, ctx, deps);
        buttonToggle.change.next();
        expect(counter).toEqual(1);
        buttonToggle.change.next();
        expect(counter).toEqual(2);
    });
    it('should support more than 1 output function on the same node', function () {
        /** <button-toggle (change)="onChange()" (reset)="onReset()"></button-toggle> */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'button-toggle');
                {
                    instructions_1.listener('change', function () { return ctx.onChange(); });
                    instructions_1.listener('reset', function () { return ctx.onReset(); });
                }
                instructions_1.elementEnd();
            }
        }
        var counter = 0;
        var resetCounter = 0;
        var ctx = { onChange: function () { return counter++; }, onReset: function () { return resetCounter++; } };
        render_util_1.renderToHtml(Template, ctx, deps);
        buttonToggle.change.next();
        expect(counter).toEqual(1);
        buttonToggle.resetStream.next();
        expect(resetCounter).toEqual(1);
    });
    it('should eval component output expression when event is emitted', function () {
        /** <button-toggle (change)="counter++"></button-toggle> */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'button-toggle');
                {
                    instructions_1.listener('change', function () { return ctx.counter++; });
                }
                instructions_1.elementEnd();
            }
        }
        var ctx = { counter: 0 };
        render_util_1.renderToHtml(Template, ctx, deps);
        buttonToggle.change.next();
        expect(ctx.counter).toEqual(1);
        buttonToggle.change.next();
        expect(ctx.counter).toEqual(2);
    });
    it('should unsubscribe from output when view is destroyed', function () {
        /**
         * % if (condition) {
         *   <button-toggle (change)="onChange()"></button-toggle>
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
                            instructions_1.elementStart(0, 'button-toggle');
                            {
                                instructions_1.listener('change', function () { return ctx.onChange(); });
                            }
                            instructions_1.elementEnd();
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        }
        var counter = 0;
        var ctx = { onChange: function () { return counter++; }, condition: true };
        render_util_1.renderToHtml(Template, ctx, deps);
        buttonToggle.change.next();
        expect(counter).toEqual(1);
        ctx.condition = false;
        render_util_1.renderToHtml(Template, ctx, deps);
        buttonToggle.change.next();
        expect(counter).toEqual(1);
    });
    it('should unsubscribe from output in nested view', function () {
        /**
         * % if (condition) {
         *   % if (condition2) {
         *     <button-toggle (change)="onChange()"></button-toggle>
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
                            instructions_1.container(0);
                        }
                        instructions_1.containerRefreshStart(0);
                        {
                            if (ctx.condition2) {
                                var rf1_1 = instructions_1.embeddedViewStart(0);
                                if (rf1_1 & 1 /* Create */) {
                                    instructions_1.elementStart(0, 'button-toggle');
                                    {
                                        instructions_1.listener('change', function () { return ctx.onChange(); });
                                    }
                                    instructions_1.elementEnd();
                                }
                                instructions_1.embeddedViewEnd();
                            }
                        }
                        instructions_1.containerRefreshEnd();
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        }
        var counter = 0;
        var ctx = { onChange: function () { return counter++; }, condition: true, condition2: true };
        render_util_1.renderToHtml(Template, ctx, deps);
        buttonToggle.change.next();
        expect(counter).toEqual(1);
        ctx.condition = false;
        render_util_1.renderToHtml(Template, ctx, deps);
        buttonToggle.change.next();
        expect(counter).toEqual(1);
    });
    it('should work properly when view also has listeners and destroys', function () {
        /**
         * % if (condition) {
         *   <button (click)="onClick()">Click me</button>
         *   <button-toggle (change)="onChange()"></button-toggle>
         *   <destroy-comp></destroy-comp>
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
                                instructions_1.listener('click', function () { return ctx.onClick(); });
                                instructions_1.text(1, 'Click me');
                            }
                            instructions_1.elementEnd();
                            instructions_1.elementStart(2, 'button-toggle');
                            {
                                instructions_1.listener('change', function () { return ctx.onChange(); });
                            }
                            instructions_1.elementEnd();
                            instructions_1.elementStart(3, 'destroy-comp');
                            instructions_1.elementEnd();
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        }
        var clickCounter = 0;
        var changeCounter = 0;
        var ctx = { condition: true, onChange: function () { return changeCounter++; }, onClick: function () { return clickCounter++; } };
        render_util_1.renderToHtml(Template, ctx, deps);
        buttonToggle.change.next();
        expect(changeCounter).toEqual(1);
        expect(clickCounter).toEqual(0);
        var button = render_util_1.containerEl.querySelector('button');
        button.click();
        expect(changeCounter).toEqual(1);
        expect(clickCounter).toEqual(1);
        ctx.condition = false;
        render_util_1.renderToHtml(Template, ctx, deps);
        expect(destroyComp.events).toEqual(['destroy']);
        buttonToggle.change.next();
        button.click();
        expect(changeCounter).toEqual(1);
        expect(clickCounter).toEqual(1);
    });
    it('should fire event listeners along with outputs if they match', function () {
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'button', ['myButton', '']);
                {
                    instructions_1.listener('click', function () { return ctx.onClick(); });
                }
                instructions_1.elementEnd();
            }
        }
        var counter = 0;
        render_util_1.renderToHtml(Template, { counter: counter, onClick: function () { return counter++; } }, deps);
        // To match current Angular behavior, the click listener is still
        // set up in addition to any matching outputs.
        var button = render_util_1.containerEl.querySelector('button');
        button.click();
        expect(counter).toEqual(1);
        buttonDir.click.next();
        expect(counter).toEqual(2);
    });
    it('should work with two outputs of the same name', function () {
        /** <button-toggle (change)="onChange()" otherDir></button-toggle> */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'button-toggle', ['otherDir', '']);
                {
                    instructions_1.listener('change', function () { return ctx.onChange(); });
                }
                instructions_1.elementEnd();
            }
        }
        var counter = 0;
        render_util_1.renderToHtml(Template, { counter: counter, onChange: function () { return counter++; } }, deps);
        buttonToggle.change.next();
        expect(counter).toEqual(1);
        otherDir.changeStream.next();
        expect(counter).toEqual(2);
    });
    it('should work with an input and output of the same name', function () {
        var otherDir;
        var OtherChangeDir = /** @class */ (function () {
            function OtherChangeDir() {
            }
            OtherChangeDir.ngDirectiveDef = index_1.defineDirective({
                type: OtherChangeDir,
                selectors: [['', 'otherChangeDir', '']],
                factory: function () { return otherDir = new OtherChangeDir; },
                inputs: { change: 'change' }
            });
            return OtherChangeDir;
        }());
        /** <button-toggle (change)="onChange()" otherChangeDir [change]="change"></button-toggle> */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'button-toggle', ['otherChangeDir', '']);
                {
                    instructions_1.listener('change', function () { return ctx.onChange(); });
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.elementProperty(0, 'change', instructions_1.bind(ctx.change));
            }
        }
        var counter = 0;
        var deps = [ButtonToggle, OtherChangeDir];
        render_util_1.renderToHtml(Template, { counter: counter, onChange: function () { return counter++; }, change: true }, deps);
        expect(otherDir.change).toEqual(true);
        render_util_1.renderToHtml(Template, { counter: counter, onChange: function () { return counter++; }, change: false }, deps);
        expect(otherDir.change).toEqual(false);
        buttonToggle.change.next();
        expect(counter).toEqual(1);
    });
    it('should work with outputs at same index in if block', function () {
        /**
         * <button (click)="onClick()">Click me</button>             // outputs: null
         * % if (condition) {
         *   <button-toggle (change)="onChange()"></button-toggle>   // outputs: {change: [0, 'change']}
         * % } else {
         *   <div otherDir (change)="onChange()"></div>             // outputs: {change: [0,
         * 'changeStream']}
         * % }
         */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'button');
                {
                    instructions_1.listener('click', function () { return ctx.onClick(); });
                    instructions_1.text(1, 'Click me');
                }
                instructions_1.elementEnd();
                instructions_1.container(2);
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(2);
                {
                    if (ctx.condition) {
                        var rf1 = instructions_1.embeddedViewStart(0);
                        if (rf1 & 1 /* Create */) {
                            instructions_1.elementStart(0, 'button-toggle');
                            {
                                instructions_1.listener('change', function () { return ctx.onChange(); });
                            }
                            instructions_1.elementEnd();
                        }
                        instructions_1.embeddedViewEnd();
                    }
                    else {
                        if (instructions_1.embeddedViewStart(1)) {
                            instructions_1.elementStart(0, 'div', ['otherDir', '']);
                            {
                                instructions_1.listener('change', function () { return ctx.onChange(); });
                            }
                            instructions_1.elementEnd();
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        }
        var counter = 0;
        var ctx = { condition: true, onChange: function () { return counter++; }, onClick: function () { } };
        render_util_1.renderToHtml(Template, ctx, deps);
        buttonToggle.change.next();
        expect(counter).toEqual(1);
        ctx.condition = false;
        render_util_1.renderToHtml(Template, ctx, deps);
        expect(counter).toEqual(1);
        otherDir.changeStream.next();
        expect(counter).toEqual(2);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0c19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3JlbmRlcjMvb3V0cHV0c19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQTJDO0FBRTNDLGlEQUF5RTtBQUN6RSwrREFBME07QUFFMU0sNkNBQXdEO0FBRXhELFFBQVEsQ0FBQyxTQUFTLEVBQUU7SUFDbEIsSUFBSSxZQUEwQixDQUFDO0lBQy9CLElBQUksV0FBd0IsQ0FBQztJQUM3QixJQUFJLFNBQW1CLENBQUM7SUFFeEI7UUFBQTtZQUNFLFdBQU0sR0FBRyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztZQUM1QixnQkFBVyxHQUFHLElBQUksbUJBQVksRUFBRSxDQUFDO1FBU25DLENBQUM7UUFQUSwyQkFBYyxHQUFHLHVCQUFlLENBQUM7WUFDdEMsSUFBSSxFQUFFLFlBQVk7WUFDbEIsU0FBUyxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM5QixRQUFRLEVBQUUsVUFBUyxFQUFlLEVBQUUsR0FBUSxJQUFHLENBQUM7WUFDaEQsT0FBTyxFQUFFLGNBQU0sT0FBQSxZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsRUFBakMsQ0FBaUM7WUFDaEQsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFDO1NBQ2xELENBQUMsQ0FBQztRQUNMLG1CQUFDO0tBQUEsQUFYRCxJQVdDO0lBRUQsSUFBSSxRQUFrQixDQUFDO0lBRXZCO1FBQUE7WUFDRSxpQkFBWSxHQUFHLElBQUksbUJBQVksRUFBRSxDQUFDO1FBUXBDLENBQUM7UUFOUSx1QkFBYyxHQUFHLHVCQUFlLENBQUM7WUFDdEMsSUFBSSxFQUFFLFFBQVE7WUFDZCxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFD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LElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFNLEdBQUcsR0FBRyxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLGNBQU0sT0FBQSxPQUFPLEVBQUUsRUFBVCxDQUFTLEVBQUUsT0FBTyxFQUFFLGNBQU8sQ0FBQyxFQUFDLENBQUM7UUFDNUUsMEJBQVksQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWxDLFlBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDN0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUzQixHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN0QiwwQkFBWSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUzQixRQUFVLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0IsQ0FBQyxDQUFDLENBQUM7QUFFTCxDQUFDLENBQUMsQ0FBQyJ9