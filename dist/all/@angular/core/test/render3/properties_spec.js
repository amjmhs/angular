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
describe('elementProperty', function () {
    it('should support bindings to properties', function () {
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'span');
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.elementProperty(0, 'id', instructions_1.bind(ctx));
            }
        }
        expect(render_util_1.renderToHtml(Template, 'testId')).toEqual('<span id="testId"></span>');
        expect(render_util_1.renderToHtml(Template, 'otherId')).toEqual('<span id="otherId"></span>');
    });
    it('should support creation time bindings to properties', function () {
        function expensive(ctx) {
            if (ctx === 'cheapId') {
                return ctx;
            }
            else {
                throw 'Too expensive!';
            }
        }
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'span');
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.elementProperty(0, 'id', rf & 1 /* Create */ ? expensive(ctx) : instructions_1.NO_CHANGE);
            }
        }
        expect(render_util_1.renderToHtml(Template, 'cheapId')).toEqual('<span id="cheapId"></span>');
        expect(render_util_1.renderToHtml(Template, 'expensiveId')).toEqual('<span id="cheapId"></span>');
    });
    it('should support interpolation for properties', function () {
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'span');
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.elementProperty(0, 'id', instructions_1.interpolation1('_', ctx, '_'));
            }
        }
        expect(render_util_1.renderToHtml(Template, 'testId')).toEqual('<span id="_testId_"></span>');
        expect(render_util_1.renderToHtml(Template, 'otherId')).toEqual('<span id="_otherId_"></span>');
    });
    it('should support host bindings on root component', function () {
        var HostBindingComp = /** @class */ (function () {
            function HostBindingComp() {
                this.id = 'my-id';
            }
            HostBindingComp.ngComponentDef = index_1.defineComponent({
                type: HostBindingComp,
                selectors: [['host-binding-comp']],
                factory: function () { return new HostBindingComp(); },
                hostBindings: function (dirIndex, elIndex) {
                    var instance = instructions_1.loadDirective(dirIndex);
                    instructions_1.elementProperty(elIndex, 'id', instructions_1.bind(instance.id));
                },
                template: function (rf, ctx) { }
            });
            return HostBindingComp;
        }());
        var fixture = new render_util_1.ComponentFixture(HostBindingComp);
        expect(fixture.hostElement.id).toBe('my-id');
        fixture.component.id = 'other-id';
        index_1.tick(fixture.component);
        expect(fixture.hostElement.id).toBe('other-id');
    });
    describe('input properties', function () {
        var button;
        var otherDir;
        var otherDisabledDir;
        var idDir;
        var MyButton = /** @class */ (function () {
            function MyButton() {
            }
            MyButton.ngDirectiveDef = index_1.defineDirective({
                type: MyButton,
                selectors: [['', 'myButton', '']],
                factory: function () { return button = new MyButton(); },
                inputs: { disabled: 'disabled' }
            });
            return MyButton;
        }());
        var OtherDir = /** @class */ (function () {
            function OtherDir() {
                this.clickStream = new core_1.EventEmitter();
            }
            OtherDir.ngDirectiveDef = index_1.defineDirective({
                type: OtherDir,
                selectors: [['', 'otherDir', '']],
                factory: function () { return otherDir = new OtherDir(); },
                inputs: { id: 'id' },
                outputs: { clickStream: 'click' }
            });
            return OtherDir;
        }());
        var OtherDisabledDir = /** @class */ (function () {
            function OtherDisabledDir() {
            }
            OtherDisabledDir.ngDirectiveDef = index_1.defineDirective({
                type: OtherDisabledDir,
                selectors: [['', 'otherDisabledDir', '']],
                factory: function () { return otherDisabledDir = new OtherDisabledDir(); },
                inputs: { disabled: 'disabled' }
            });
            return OtherDisabledDir;
        }());
        var IdDir = /** @class */ (function () {
            function IdDir() {
            }
            IdDir.ngDirectiveDef = index_1.defineDirective({
                type: IdDir,
                selectors: [['', 'idDir', '']],
                factory: function () { return idDir = new IdDir(); },
                inputs: { idNumber: 'id' }
            });
            return IdDir;
        }());
        var deps = [MyButton, OtherDir, OtherDisabledDir, IdDir];
        it('should check input properties before setting (directives)', function () {
            /** <button myButton otherDir [id]="id" [disabled]="isDisabled">Click me</button> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'button', ['otherDir', '', 'myButton', '']);
                    {
                        instructions_1.text(1, 'Click me');
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'disabled', instructions_1.bind(ctx.isDisabled));
                    instructions_1.elementProperty(0, 'id', instructions_1.bind(ctx.id));
                }
            }
            var ctx = { isDisabled: true, id: 0 };
            expect(render_util_1.renderToHtml(Template, ctx, deps))
                .toEqual("<button mybutton=\"\" otherdir=\"\">Click me</button>");
            expect(button.disabled).toEqual(true);
            expect(otherDir.id).toEqual(0);
            ctx.isDisabled = false;
            ctx.id = 1;
            expect(render_util_1.renderToHtml(Template, ctx, deps))
                .toEqual("<button mybutton=\"\" otherdir=\"\">Click me</button>");
            expect(button.disabled).toEqual(false);
            expect(otherDir.id).toEqual(1);
        });
        it('should support mixed element properties and input properties', function () {
            /** <button myButton [id]="id" [disabled]="isDisabled">Click me</button> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'button', ['myButton', '']);
                    {
                        instructions_1.text(1, 'Click me');
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'disabled', instructions_1.bind(ctx.isDisabled));
                    instructions_1.elementProperty(0, 'id', instructions_1.bind(ctx.id));
                }
            }
            var ctx = { isDisabled: true, id: 0 };
            expect(render_util_1.renderToHtml(Template, ctx, deps))
                .toEqual("<button id=\"0\" mybutton=\"\">Click me</button>");
            expect(button.disabled).toEqual(true);
            ctx.isDisabled = false;
            ctx.id = 1;
            expect(render_util_1.renderToHtml(Template, ctx, deps))
                .toEqual("<button id=\"1\" mybutton=\"\">Click me</button>");
            expect(button.disabled).toEqual(false);
        });
        it('should check that property is not an input property before setting (component)', function () {
            var comp;
            var Comp = /** @class */ (function () {
                function Comp() {
                }
                Comp.ngComponentDef = index_1.defineComponent({
                    type: Comp,
                    selectors: [['comp']],
                    template: function (rf, ctx) { },
                    factory: function () { return comp = new Comp(); },
                    inputs: { id: 'id' }
                });
                return Comp;
            }());
            /** <comp [id]="id"></comp> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp');
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'id', instructions_1.bind(ctx.id));
                }
            }
            var deps = [Comp];
            expect(render_util_1.renderToHtml(Template, { id: 1 }, deps)).toEqual("<comp></comp>");
            expect(comp.id).toEqual(1);
            expect(render_util_1.renderToHtml(Template, { id: 2 }, deps)).toEqual("<comp></comp>");
            expect(comp.id).toEqual(2);
        });
        it('should support two input properties with the same name', function () {
            /** <button myButton otherDisabledDir [disabled]="isDisabled">Click me</button> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'button', ['myButton', '', 'otherDisabledDir', '']);
                    {
                        instructions_1.text(1, 'Click me');
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'disabled', instructions_1.bind(ctx.isDisabled));
                }
            }
            var ctx = { isDisabled: true };
            expect(render_util_1.renderToHtml(Template, ctx, deps))
                .toEqual("<button mybutton=\"\" otherdisableddir=\"\">Click me</button>");
            expect(button.disabled).toEqual(true);
            expect(otherDisabledDir.disabled).toEqual(true);
            ctx.isDisabled = false;
            expect(render_util_1.renderToHtml(Template, ctx, deps))
                .toEqual("<button mybutton=\"\" otherdisableddir=\"\">Click me</button>");
            expect(button.disabled).toEqual(false);
            expect(otherDisabledDir.disabled).toEqual(false);
        });
        it('should set input property if there is an output first', function () {
            /** <button otherDir [id]="id" (click)="onClick()">Click me</button> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'button', ['otherDir', '']);
                    {
                        instructions_1.listener('click', ctx.onClick.bind(ctx));
                        instructions_1.text(1, 'Click me');
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'id', instructions_1.bind(ctx.id));
                }
            }
            var counter = 0;
            var ctx = { id: 1, onClick: function () { return counter++; } };
            expect(render_util_1.renderToHtml(Template, ctx, deps)).toEqual("<button otherdir=\"\">Click me</button>");
            expect(otherDir.id).toEqual(1);
            otherDir.clickStream.next();
            expect(counter).toEqual(1);
            ctx.id = 2;
            render_util_1.renderToHtml(Template, ctx, deps);
            expect(otherDir.id).toEqual(2);
        });
        it('should support unrelated element properties at same index in if-else block', function () {
            /**
             * <button idDir [id]="id1">Click me</button>             // inputs: {'id': [0, 'idNumber']}
             * % if (condition) {
             *   <button [id]="id2">Click me too</button>             // inputs: null
             * % } else {
             *   <button otherDir [id]="id3">Click me too</button>   // inputs: {'id': [0, 'id']}
             * % }
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'button', ['idDir', '']);
                    {
                        instructions_1.text(1, 'Click me');
                    }
                    instructions_1.elementEnd();
                    instructions_1.container(2);
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'id', instructions_1.bind(ctx.id1));
                    instructions_1.containerRefreshStart(2);
                    {
                        if (ctx.condition) {
                            var rf0 = instructions_1.embeddedViewStart(0);
                            if (rf0 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'button');
                                {
                                    instructions_1.text(1, 'Click me too');
                                }
                                instructions_1.elementEnd();
                            }
                            if (rf0 & 2 /* Update */) {
                                instructions_1.elementProperty(0, 'id', instructions_1.bind(ctx.id2));
                            }
                            instructions_1.embeddedViewEnd();
                        }
                        else {
                            var rf1 = instructions_1.embeddedViewStart(1);
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'button', ['otherDir', '']);
                                {
                                    instructions_1.text(1, 'Click me too');
                                }
                                instructions_1.elementEnd();
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.elementProperty(0, 'id', instructions_1.bind(ctx.id3));
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            expect(render_util_1.renderToHtml(Template, { condition: true, id1: 'one', id2: 'two', id3: 3 }, deps))
                .toEqual("<button iddir=\"\">Click me</button><button id=\"two\">Click me too</button>");
            expect(idDir.idNumber).toEqual('one');
            expect(render_util_1.renderToHtml(Template, { condition: false, id1: 'four', id2: 'two', id3: 3 }, deps))
                .toEqual("<button iddir=\"\">Click me</button><button otherdir=\"\">Click me too</button>");
            expect(idDir.idNumber).toEqual('four');
            expect(otherDir.id).toEqual(3);
        });
    });
    describe('attributes and input properties', function () {
        var myDir;
        var MyDir = /** @class */ (function () {
            function MyDir() {
                this.changeStream = new core_1.EventEmitter();
            }
            MyDir.ngDirectiveDef = index_1.defineDirective({
                type: MyDir,
                selectors: [['', 'myDir', '']],
                factory: function () { return myDir = new MyDir(); },
                inputs: { role: 'role', direction: 'dir' },
                outputs: { changeStream: 'change' },
                exportAs: 'myDir'
            });
            return MyDir;
        }());
        var dirB;
        var MyDirB = /** @class */ (function () {
            function MyDirB() {
            }
            MyDirB.ngDirectiveDef = index_1.defineDirective({
                type: MyDirB,
                selectors: [['', 'myDirB', '']],
                factory: function () { return dirB = new MyDirB(); },
                inputs: { roleB: 'role' }
            });
            return MyDirB;
        }());
        var deps = [MyDir, MyDirB];
        it('should set input property based on attribute if existing', function () {
            /** <div role="button" myDir></div> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['role', 'button', 'myDir', '']);
                    instructions_1.elementEnd();
                }
            }
            expect(render_util_1.renderToHtml(Template, {}, deps)).toEqual("<div mydir=\"\" role=\"button\"></div>");
            expect(myDir.role).toEqual('button');
        });
        it('should set input property and attribute if both defined', function () {
            /** <div role="button" [role]="role" myDir></div> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['role', 'button', 'myDir', '']);
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'role', instructions_1.bind(ctx.role));
                }
            }
            expect(render_util_1.renderToHtml(Template, { role: 'listbox' }, deps))
                .toEqual("<div mydir=\"\" role=\"button\"></div>");
            expect(myDir.role).toEqual('listbox');
            render_util_1.renderToHtml(Template, { role: 'button' }, deps);
            expect(myDir.role).toEqual('button');
        });
        it('should set two directive input properties based on same attribute', function () {
            /** <div role="button" myDir myDirB></div> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['role', 'button', 'myDir', '', 'myDirB', '']);
                    instructions_1.elementEnd();
                }
            }
            expect(render_util_1.renderToHtml(Template, {}, deps))
                .toEqual("<div mydir=\"\" mydirb=\"\" role=\"button\"></div>");
            expect(myDir.role).toEqual('button');
            expect(dirB.roleB).toEqual('button');
        });
        it('should process two attributes on same directive', function () {
            /** <div role="button" dir="rtl" myDir></div> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['role', 'button', 'dir', 'rtl', 'myDir', '']);
                    instructions_1.elementEnd();
                }
            }
            expect(render_util_1.renderToHtml(Template, {}, deps))
                .toEqual("<div dir=\"rtl\" mydir=\"\" role=\"button\"></div>");
            expect(myDir.role).toEqual('button');
            expect(myDir.direction).toEqual('rtl');
        });
        it('should process attributes and outputs properly together', function () {
            /** <div role="button" (change)="onChange()" myDir></div> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['role', 'button', 'myDir', '']);
                    {
                        instructions_1.listener('change', ctx.onChange.bind(ctx));
                    }
                    instructions_1.elementEnd();
                }
            }
            var counter = 0;
            expect(render_util_1.renderToHtml(Template, { onChange: function () { return counter++; } }, deps))
                .toEqual("<div mydir=\"\" role=\"button\"></div>");
            expect(myDir.role).toEqual('button');
            myDir.changeStream.next();
            expect(counter).toEqual(1);
        });
        it('should process attributes properly for directives with later indices', function () {
            /**
             * <div role="button" dir="rtl" myDir></div>
             * <div role="listbox" myDirB></div>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['role', 'button', 'dir', 'rtl', 'myDir', '']);
                    instructions_1.elementEnd();
                    instructions_1.elementStart(1, 'div', ['role', 'listbox', 'myDirB', '']);
                    instructions_1.elementEnd();
                }
            }
            expect(render_util_1.renderToHtml(Template, {}, deps))
                .toEqual("<div dir=\"rtl\" mydir=\"\" role=\"button\"></div><div mydirb=\"\" role=\"listbox\"></div>");
            expect(myDir.role).toEqual('button');
            expect(myDir.direction).toEqual('rtl');
            expect(dirB.roleB).toEqual('listbox');
        });
        it('should support attributes at same index inside an if-else block', function () {
            /**
             * <div role="listbox" myDir></div>          // initialInputs: [['role', 'listbox']]
             *
             * % if (condition) {
             *   <div role="button" myDirB></div>       // initialInputs: [['role', 'button']]
             * % } else {
             *   <div role="menu"></div>               // initialInputs: [null]
             * % }
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['role', 'listbox', 'myDir', '']);
                    instructions_1.elementEnd();
                    instructions_1.container(1);
                }
                if (rf & 2 /* Update */) {
                    instructions_1.containerRefreshStart(1);
                    {
                        if (ctx.condition) {
                            var rf1 = instructions_1.embeddedViewStart(0);
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'div', ['role', 'button', 'myDirB', '']);
                                instructions_1.elementEnd();
                            }
                            instructions_1.embeddedViewEnd();
                        }
                        else {
                            var rf2 = instructions_1.embeddedViewStart(1);
                            if (rf2 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'div', ['role', 'menu']);
                                instructions_1.elementEnd();
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            expect(render_util_1.renderToHtml(Template, { condition: true }, deps))
                .toEqual("<div mydir=\"\" role=\"listbox\"></div><div mydirb=\"\" role=\"button\"></div>");
            expect(myDir.role).toEqual('listbox');
            expect(dirB.roleB).toEqual('button');
            expect(dirB.role).toBeUndefined();
            expect(render_util_1.renderToHtml(Template, { condition: false }, deps))
                .toEqual("<div mydir=\"\" role=\"listbox\"></div><div role=\"menu\"></div>");
            expect(myDir.role).toEqual('listbox');
        });
        it('should process attributes properly inside a for loop', function () {
            var Comp = /** @class */ (function () {
                function Comp() {
                }
                Comp.ngComponentDef = index_1.defineComponent({
                    type: Comp,
                    selectors: [['comp']],
                    /** <div role="button" dir #dir="myDir"></div> {{ dir.role }} */
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.elementStart(0, 'div', ['role', 'button', 'myDir', ''], ['dir', 'myDir']);
                            instructions_1.elementEnd();
                            instructions_1.text(2);
                        }
                        if (rf & 2 /* Update */) {
                            var tmp = instructions_1.load(1);
                            instructions_1.textBinding(2, instructions_1.bind(tmp.role));
                        }
                    },
                    factory: function () { return new Comp(); },
                    directives: function () { return [MyDir]; }
                });
                return Comp;
            }());
            /**
             * % for (let i = 0; i < 3; i++) {
             *     <comp></comp>
             * % }
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.container(0);
                }
                if (rf & 2 /* Update */) {
                    instructions_1.containerRefreshStart(0);
                    {
                        for (var i = 0; i < 2; i++) {
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
            expect(render_util_1.renderToHtml(Template, {}, [Comp]))
                .toEqual("<comp><div mydir=\"\" role=\"button\"></div>button</comp><comp><div mydir=\"\" role=\"button\"></div>button</comp>");
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllc19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3JlbmRlcjMvcHJvcGVydGllc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQTJDO0FBRTNDLGlEQUErRTtBQUMvRSwrREFBdVE7QUFFdlEsNkNBQTZEO0FBRTdELFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtJQUUxQixFQUFFLENBQUMsdUNBQXVDLEVBQUU7UUFDMUMsa0JBQWtCLEVBQWUsRUFBRSxHQUFRO1lBQ3pDLElBQUksRUFBRSxpQkFBcUIsRUFBRTtnQkFDM0IsMkJBQVksQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ3hCLHlCQUFVLEVBQUUsQ0FBQzthQUNkO1lBQ0QsSUFBSSxFQUFFLGlCQUFxQixFQUFFO2dCQUMzQiw4QkFBZSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsbUJBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ3JDO1FBQ0gsQ0FBQztRQUVELE1BQU0sQ0FBQywwQkFBWSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBQzlFLE1BQU0sQ0FBQywwQkFBWSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBQ2xGLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHFEQUFxRCxFQUFFO1FBQ3hELG1CQUFtQixHQUFXO1lBQzVCLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtnQkFDckIsT0FBTyxHQUFHLENBQUM7YUFDWjtpQkFBTTtnQkFDTCxNQUFNLGdCQUFnQixDQUFDO2FBQ3hCO1FBQ0gsQ0FBQztRQUVELGtCQUFrQixFQUFlLEVBQUUsR0FBVztZQUM1QyxJQUFJLEVBQUUs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