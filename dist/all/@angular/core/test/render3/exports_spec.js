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
var render_util_1 = require("./render_util");
describe('exports', function () {
    it('should support export of DOM element', function () {
        /** <input value="one" #myInput> {{ myInput.value }} */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'input', ['value', 'one'], ['myInput', '']);
                instructions_1.elementEnd();
                instructions_1.text(2);
            }
            var tmp;
            if (rf & 2 /* Update */) {
                tmp = instructions_1.load(1);
                instructions_1.textBinding(2, tmp.value);
            }
        }
        expect(render_util_1.renderToHtml(Template, {})).toEqual('<input value="one">one');
    });
    it('should support basic export of component', function () {
        /** <comp #myComp></comp> {{ myComp.name }} */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'comp', null, ['myComp', '']);
                instructions_1.elementEnd();
                instructions_1.text(2);
            }
            var tmp;
            if (rf & 2 /* Update */) {
                tmp = instructions_1.load(1);
                instructions_1.textBinding(2, tmp.name);
            }
        }
        var MyComponent = /** @class */ (function () {
            function MyComponent() {
                this.name = 'Nancy';
            }
            MyComponent.ngComponentDef = index_1.defineComponent({
                type: MyComponent,
                selectors: [['comp']],
                template: function () { },
                factory: function () { return new MyComponent; }
            });
            return MyComponent;
        }());
        expect(render_util_1.renderToHtml(Template, {}, [MyComponent])).toEqual('<comp></comp>Nancy');
    });
    it('should support component instance fed into directive', function () {
        var myComponent;
        var myDir;
        var MyComponent = /** @class */ (function () {
            function MyComponent() {
                myComponent = this;
            }
            MyComponent.ngComponentDef = index_1.defineComponent({
                type: MyComponent,
                selectors: [['comp']],
                template: function () { },
                factory: function () { return new MyComponent; }
            });
            return MyComponent;
        }());
        var MyDir = /** @class */ (function () {
            function MyDir() {
                myDir = this;
            }
            MyDir.ngDirectiveDef = index_1.defineDirective({
                type: MyDir,
                selectors: [['', 'myDir', '']],
                factory: function () { return new MyDir; },
                inputs: { myDir: 'myDir' }
            });
            return MyDir;
        }());
        var defs = [MyComponent, MyDir];
        /** <comp #myComp></comp> <div [myDir]="myComp"></div> */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'comp', null, ['myComp', '']);
                instructions_1.elementEnd();
                instructions_1.elementStart(2, 'div', ['myDir', '']);
                instructions_1.elementEnd();
            }
            var tmp;
            if (rf & 2 /* Update */) {
                tmp = instructions_1.load(1);
                instructions_1.elementProperty(2, 'myDir', instructions_1.bind(tmp));
            }
        }
        render_util_1.renderToHtml(Template, {}, defs);
        expect(myDir.myDir).toEqual(myComponent);
    });
    it('should work with directives with exportAs set', function () {
        /** <div someDir #myDir="someDir"></div> {{ myDir.name }} */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'div', ['someDir', ''], ['myDir', 'someDir']);
                instructions_1.elementEnd();
                instructions_1.text(2);
            }
            var tmp;
            if (rf & 2 /* Update */) {
                tmp = instructions_1.load(1);
                instructions_1.textBinding(2, tmp.name);
            }
        }
        var SomeDir = /** @class */ (function () {
            function SomeDir() {
                this.name = 'Drew';
            }
            SomeDir.ngDirectiveDef = index_1.defineDirective({
                type: SomeDir,
                selectors: [['', 'someDir', '']],
                factory: function () { return new SomeDir; },
                exportAs: 'someDir'
            });
            return SomeDir;
        }());
        expect(render_util_1.renderToHtml(Template, {}, [SomeDir])).toEqual('<div somedir=""></div>Drew');
    });
    it('should throw if export name is not found', function () {
        /** <div #myDir="someDir"></div> */
        var App = render_util_1.createComponent('app', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'div', null, ['myDir', 'someDir']);
                instructions_1.elementEnd();
            }
        });
        expect(function () {
            var fixture = new render_util_1.ComponentFixture(App);
        }).toThrowError(/Export of name 'someDir' not found!/);
    });
    describe('forward refs', function () {
        it('should work with basic text bindings', function () {
            /** {{ myInput.value}} <input value="one" #myInput> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.text(0);
                    instructions_1.elementStart(1, 'input', ['value', 'one'], ['myInput', '']);
                    instructions_1.elementEnd();
                }
                var tmp = instructions_1.load(2);
                if (rf & 2 /* Update */) {
                    instructions_1.textBinding(0, instructions_1.bind(tmp.value));
                }
            }
            expect(render_util_1.renderToHtml(Template, {})).toEqual('one<input value="one">');
        });
        it('should work with element properties', function () {
            /** <div [title]="myInput.value"</div> <input value="one" #myInput> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div');
                    instructions_1.elementEnd();
                    instructions_1.elementStart(1, 'input', ['value', 'one'], ['myInput', '']);
                    instructions_1.elementEnd();
                }
                var tmp = instructions_1.load(2);
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'title', instructions_1.bind(tmp.value));
                }
            }
            expect(render_util_1.renderToHtml(Template, {})).toEqual('<div title="one"></div><input value="one">');
        });
        it('should work with element attrs', function () {
            /** <div [attr.aria-label]="myInput.value"</div> <input value="one" #myInput> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div');
                    instructions_1.elementEnd();
                    instructions_1.elementStart(1, 'input', ['value', 'one'], ['myInput', '']);
                    instructions_1.elementEnd();
                }
                var tmp = instructions_1.load(2);
                if (rf & 2 /* Update */) {
                    instructions_1.elementAttribute(0, 'aria-label', instructions_1.bind(tmp.value));
                }
            }
            expect(render_util_1.renderToHtml(Template, {})).toEqual('<div aria-label="one"></div><input value="one">');
        });
        it('should work with element classes', function () {
            /** <div [class.red]="myInput.checked"</div> <input type="checkbox" checked #myInput> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div');
                    instructions_1.elementStyling([1 /* VALUES_MODE */, 'red', true]);
                    instructions_1.elementEnd();
                    instructions_1.elementStart(1, 'input', ['type', 'checkbox', 'checked', 'true'], ['myInput', '']);
                    instructions_1.elementEnd();
                }
                var tmp = instructions_1.load(2);
                if (rf & 2 /* Update */) {
                    instructions_1.elementClassProp(0, 0, tmp.checked);
                    instructions_1.elementStylingApply(0);
                }
            }
            expect(render_util_1.renderToHtml(Template, {}))
                .toEqual('<div class="red"></div><input checked="true" type="checkbox">');
        });
        it('should work with component refs', function () {
            var myComponent;
            var myDir;
            var MyComponent = /** @class */ (function () {
                function MyComponent() {
                    myComponent = this;
                }
                MyComponent.ngComponentDef = index_1.defineComponent({
                    type: MyComponent,
                    selectors: [['comp']],
                    template: function (rf, ctx) { },
                    factory: function () { return new MyComponent; }
                });
                return MyComponent;
            }());
            var MyDir = /** @class */ (function () {
                function MyDir() {
                    myDir = this;
                }
                MyDir.ngDirectiveDef = index_1.defineDirective({
                    type: MyDir,
                    selectors: [['', 'myDir', '']],
                    factory: function () { return new MyDir; },
                    inputs: { myDir: 'myDir' }
                });
                return MyDir;
            }());
            /** <div [myDir]="myComp"></div><comp #myComp></comp> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['myDir', '']);
                    instructions_1.elementEnd();
                    instructions_1.elementStart(1, 'comp', null, ['myComp', '']);
                    instructions_1.elementEnd();
                }
                var tmp;
                if (rf & 2 /* Update */) {
                    tmp = instructions_1.load(2);
                    instructions_1.elementProperty(0, 'myDir', instructions_1.bind(tmp));
                }
            }
            render_util_1.renderToHtml(Template, {}, [MyComponent, MyDir]);
            expect(myDir.myDir).toEqual(myComponent);
        });
        it('should work with multiple forward refs', function () {
            /** {{ myInput.value }} {{ myComp.name }} <comp #myComp></comp> <input value="one" #myInput>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.text(0);
                    instructions_1.text(1);
                    instructions_1.elementStart(2, 'comp', null, ['myComp', '']);
                    instructions_1.elementEnd();
                    instructions_1.elementStart(4, 'input', ['value', 'one'], ['myInput', '']);
                    instructions_1.elementEnd();
                }
                var tmp1;
                var tmp2;
                if (rf & 2 /* Update */) {
                    tmp1 = instructions_1.load(3);
                    tmp2 = instructions_1.load(5);
                    instructions_1.textBinding(0, instructions_1.bind(tmp2.value));
                    instructions_1.textBinding(1, instructions_1.bind(tmp1.name));
                }
            }
            var myComponent;
            var MyComponent = /** @class */ (function () {
                function MyComponent() {
                    this.name = 'Nancy';
                    myComponent = this;
                }
                MyComponent.ngComponentDef = index_1.defineComponent({
                    type: MyComponent,
                    selectors: [['comp']],
                    template: function () { },
                    factory: function () { return new MyComponent; }
                });
                return MyComponent;
            }());
            expect(render_util_1.renderToHtml(Template, {}, [MyComponent]))
                .toEqual('oneNancy<comp></comp><input value="one">');
        });
        it('should work inside a view container', function () {
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
                                var tmp = void 0;
                                if (rf1 & 1 /* Create */) {
                                    instructions_1.text(0);
                                    instructions_1.elementStart(1, 'input', ['value', 'one'], ['myInput', '']);
                                    instructions_1.elementEnd();
                                }
                                if (rf1 & 2 /* Update */) {
                                    tmp = instructions_1.load(2);
                                    instructions_1.textBinding(0, instructions_1.bind(tmp.value));
                                }
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            expect(render_util_1.renderToHtml(Template, {
                condition: true
            })).toEqual('<div>one<input value="one"></div>');
            expect(render_util_1.renderToHtml(Template, { condition: false })).toEqual('<div></div>');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0c19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3JlbmRlcjMvZXhwb3J0c19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsaURBQXlFO0FBQ3pFLCtEQUE0UjtBQUc1Uiw2Q0FBOEU7QUFFOUUsUUFBUSxDQUFDLFNBQVMsRUFBRTtJQUNsQixFQUFFLENBQUMsc0NBQXNDLEVBQUU7UUFFekMsdURBQXVEO1FBQ3ZELGtCQUFrQixFQUFlLEVBQUUsR0FBUTtZQUN6QyxJQUFJLEVBQUUsaUJBQXFCLEVBQUU7Z0JBQzNCLDJCQUFZLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUM1RCx5QkFBVSxFQUFFLENBQUM7Z0JBQ2IsbUJBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNUO1lBQ0QsSUFBSSxHQUFRLENBQUM7WUFDYixJQUFJLEVBQUUsaUJBQXFCLEVBQUU7Z0JBQzNCLEdBQUcsR0FBRyxtQkFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNkLDBCQUFXLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUMzQjtRQUNILENBQUM7UUFFRCxNQUFNLENBQUMsMEJBQVksQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztJQUN2RSxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywwQ0FBMEMsRUFBRTtRQUU3Qyw4Q0FBOEM7UUFDOUMsa0JBQWtCLEVBQWUsRUFBRSxHQUFRO1lBQ3pDLElBQUksRUFBRSxpQkFBcUIsRUFBRTtnQkFDM0IsMkJBQVksQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxD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