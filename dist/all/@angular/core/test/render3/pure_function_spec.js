"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var index_1 = require("../../src/render3/index");
var instructions_1 = require("../../src/render3/instructions");
var pure_function_1 = require("../../src/render3/pure_function");
var render_util_1 = require("../../test/render3/render_util");
describe('array literals', function () {
    var myComp;
    var MyComp = /** @class */ (function () {
        function MyComp() {
        }
        MyComp.ngComponentDef = index_1.defineComponent({
            type: MyComp,
            selectors: [['my-comp']],
            factory: function MyComp_Factory() { return myComp = new MyComp(); },
            template: function MyComp_Template(rf, ctx) { },
            inputs: { names: 'names' }
        });
        return MyComp;
    }());
    var directives = [MyComp];
    it('should support an array literal with a binding', function () {
        var e0_ff = function (v) { return ['Nancy', v, 'Bess']; };
        /** <my-comp [names]="['Nancy', customName, 'Bess']"></my-comp> */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'my-comp');
                instructions_1.elementEnd();
                instructions_1.reserveSlots(2);
            }
            if (rf & 2 /* Update */) {
                instructions_1.elementProperty(0, 'names', instructions_1.bind(pure_function_1.pureFunction1(2, e0_ff, ctx.customName)));
            }
        }
        render_util_1.renderToHtml(Template, { customName: 'Carson' }, directives);
        var firstArray = myComp.names;
        expect(firstArray).toEqual(['Nancy', 'Carson', 'Bess']);
        render_util_1.renderToHtml(Template, { customName: 'Carson' }, directives);
        expect(myComp.names).toEqual(['Nancy', 'Carson', 'Bess']);
        expect(firstArray).toBe(myComp.names);
        render_util_1.renderToHtml(Template, { customName: 'Hannah' }, directives);
        expect(myComp.names).toEqual(['Nancy', 'Hannah', 'Bess']);
        // Identity must change if binding changes
        expect(firstArray).not.toBe(myComp.names);
        // The property should not be set if the exp value is the same, so artificially
        // setting the property to ensure it's not overwritten.
        myComp.names = ['should not be overwritten'];
        render_util_1.renderToHtml(Template, { customName: 'Hannah' }, directives);
        expect(myComp.names).toEqual(['should not be overwritten']);
    });
    it('should support multiple array literals passed through to one node', function () {
        var manyPropComp;
        var ManyPropComp = /** @class */ (function () {
            function ManyPropComp() {
            }
            ManyPropComp.ngComponentDef = index_1.defineComponent({
                type: ManyPropComp,
                selectors: [['many-prop-comp']],
                factory: function ManyPropComp_Factory() { return manyPropComp = new ManyPropComp(); },
                template: function ManyPropComp_Template(rf, ctx) { },
                inputs: { names1: 'names1', names2: 'names2' }
            });
            return ManyPropComp;
        }());
        var e0_ff = function (v) { return ['Nancy', v]; };
        var e0_ff_1 = function (v) { return [v]; };
        /**
         * <many-prop-comp [names1]="['Nancy', customName]" [names2]="[customName2]">
         * </many-prop-comp>
         */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'many-prop-comp');
                instructions_1.elementEnd();
                instructions_1.reserveSlots(4);
            }
            if (rf & 2 /* Update */) {
                instructions_1.elementProperty(0, 'names1', instructions_1.bind(pure_function_1.pureFunction1(2, e0_ff, ctx.customName)));
                instructions_1.elementProperty(0, 'names2', instructions_1.bind(pure_function_1.pureFunction1(4, e0_ff_1, ctx.customName2)));
            }
        }
        var defs = [ManyPropComp];
        render_util_1.renderToHtml(Template, { customName: 'Carson', customName2: 'George' }, defs);
        expect(manyPropComp.names1).toEqual(['Nancy', 'Carson']);
        expect(manyPropComp.names2).toEqual(['George']);
        render_util_1.renderToHtml(Template, { customName: 'George', customName2: 'Carson' }, defs);
        expect(manyPropComp.names1).toEqual(['Nancy', 'George']);
        expect(manyPropComp.names2).toEqual(['Carson']);
    });
    it('should support an array literals inside fn calls', function () {
        var myComps = [];
        var e0_ff = function (v) { return ['Nancy', v]; };
        /** <my-comp [names]="someFn(['Nancy', customName])"></my-comp> */
        var ParentComp = /** @class */ (function () {
            function ParentComp() {
                this.customName = 'Bess';
            }
            ParentComp.prototype.someFn = function (arr) {
                arr[0] = arr[0].toUpperCase();
                return arr;
            };
            ParentComp.ngComponentDef = index_1.defineComponent({
                type: ParentComp,
                selectors: [['parent-comp']],
                factory: function () { return new ParentComp(); },
                template: function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'my-comp');
                        myComps.push(instructions_1.loadDirective(0));
                        instructions_1.elementEnd();
                        instructions_1.reserveSlots(2);
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.elementProperty(0, 'names', instructions_1.bind(ctx.someFn(pure_function_1.pureFunction1(2, e0_ff, ctx.customName))));
                    }
                },
                directives: directives
            });
            return ParentComp;
        }());
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'parent-comp');
                instructions_1.elementEnd();
                instructions_1.elementStart(1, 'parent-comp');
                instructions_1.elementEnd();
            }
        }
        render_util_1.renderToHtml(Template, {}, [ParentComp]);
        var firstArray = myComps[0].names;
        var secondArray = myComps[1].names;
        expect(firstArray).toEqual(['NANCY', 'Bess']);
        expect(secondArray).toEqual(['NANCY', 'Bess']);
        expect(firstArray).not.toBe(secondArray);
        render_util_1.renderToHtml(Template, {}, [ParentComp]);
        expect(firstArray).toEqual(['NANCY', 'Bess']);
        expect(secondArray).toEqual(['NANCY', 'Bess']);
        expect(firstArray).toBe(myComps[0].names);
        expect(secondArray).toBe(myComps[1].names);
    });
    it('should support an array literal with more than 1 binding', function () {
        var e0_ff = function (v1, v2) { return ['Nancy', v1, 'Bess', v2]; };
        /** <my-comp [names]="['Nancy', customName, 'Bess', customName2]"></my-comp> */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'my-comp');
                instructions_1.elementEnd();
                instructions_1.reserveSlots(3);
            }
            if (rf & 2 /* Update */) {
                instructions_1.elementProperty(0, 'names', instructions_1.bind(pure_function_1.pureFunction2(3, e0_ff, ctx.customName, ctx.customName2)));
            }
        }
        render_util_1.renderToHtml(Template, { customName: 'Carson', customName2: 'Hannah' }, directives);
        var firstArray = myComp.names;
        expect(firstArray).toEqual(['Nancy', 'Carson', 'Bess', 'Hannah']);
        render_util_1.renderToHtml(Template, { customName: 'Carson', customName2: 'Hannah' }, directives);
        expect(myComp.names).toEqual(['Nancy', 'Carson', 'Bess', 'Hannah']);
        expect(firstArray).toBe(myComp.names);
        render_util_1.renderToHtml(Template, { customName: 'George', customName2: 'Hannah' }, directives);
        expect(myComp.names).toEqual(['Nancy', 'George', 'Bess', 'Hannah']);
        expect(firstArray).not.toBe(myComp.names);
        render_util_1.renderToHtml(Template, { customName: 'Frank', customName2: 'Ned' }, directives);
        expect(myComp.names).toEqual(['Nancy', 'Frank', 'Bess', 'Ned']);
        // The property should not be set if the exp value is the same, so artificially
        // setting the property to ensure it's not overwritten.
        myComp.names = ['should not be overwritten'];
        render_util_1.renderToHtml(Template, { customName: 'Frank', customName2: 'Ned' }, directives);
        expect(myComp.names).toEqual(['should not be overwritten']);
    });
    it('should work up to 8 bindings', function () {
        var f3Comp;
        var f4Comp;
        var f5Comp;
        var f6Comp;
        var f7Comp;
        var f8Comp;
        var e0_ff = function (v1, v2, v3) { return ['a', 'b', 'c', 'd', 'e', v1, v2, v3]; };
        var e2_ff = function (v1, v2, v3, v4) { return ['a', 'b', 'c', 'd', v1, v2, v3, v4]; };
        var e4_ff = function (v1, v2, v3, v4, v5) { return ['a', 'b', 'c', v1, v2, v3, v4, v5]; };
        var e6_ff = function (v1, v2, v3, v4, v5, v6) { return ['a', 'b', v1, v2, v3, v4, v5, v6]; };
        var e8_ff = function (v1, v2, v3, v4, v5, v6, v7) { return ['a', v1, v2, v3, v4, v5, v6, v7]; };
        var e10_ff = function (v1, v2, v3, v4, v5, v6, v7, v8) { return [v1, v2, v3, v4, v5, v6, v7, v8]; };
        function Template(rf, c) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'my-comp');
                f3Comp = instructions_1.loadDirective(0);
                instructions_1.elementEnd();
                instructions_1.elementStart(1, 'my-comp');
                f4Comp = instructions_1.loadDirective(1);
                instructions_1.elementEnd();
                instructions_1.elementStart(2, 'my-comp');
                f5Comp = instructions_1.loadDirective(2);
                instructions_1.elementEnd();
                instructions_1.elementStart(3, 'my-comp');
                f6Comp = instructions_1.loadDirective(3);
                instructions_1.elementEnd();
                instructions_1.elementStart(4, 'my-comp');
                f7Comp = instructions_1.loadDirective(4);
                instructions_1.elementEnd();
                instructions_1.elementStart(5, 'my-comp');
                f8Comp = instructions_1.loadDirective(5);
                instructions_1.elementEnd();
                instructions_1.reserveSlots(39);
            }
            if (rf & 2 /* Update */) {
                instructions_1.elementProperty(0, 'names', instructions_1.bind(pure_function_1.pureFunction3(4, e0_ff, c[5], c[6], c[7])));
                instructions_1.elementProperty(1, 'names', instructions_1.bind(pure_function_1.pureFunction4(9, e2_ff, c[4], c[5], c[6], c[7])));
                instructions_1.elementProperty(2, 'names', instructions_1.bind(pure_function_1.pureFunction5(15, e4_ff, c[3], c[4], c[5], c[6], c[7])));
                instructions_1.elementProperty(3, 'names', instructions_1.bind(pure_function_1.pureFunction6(22, e6_ff, c[2], c[3], c[4], c[5], c[6], c[7])));
                instructions_1.elementProperty(4, 'names', instructions_1.bind(pure_function_1.pureFunction7(30, e8_ff, c[1], c[2], c[3], c[4], c[5], c[6], c[7])));
                instructions_1.elementProperty(5, 'names', instructions_1.bind(pure_function_1.pureFunction8(39, e10_ff, c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7])));
            }
        }
        render_util_1.renderToHtml(Template, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'], directives);
        expect(f3Comp.names).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
        expect(f4Comp.names).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
        expect(f5Comp.names).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
        expect(f6Comp.names).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
        expect(f7Comp.names).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
        expect(f8Comp.names).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
        render_util_1.renderToHtml(Template, ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1', 'i1'], directives);
        expect(f3Comp.names).toEqual(['a', 'b', 'c', 'd', 'e', 'f1', 'g1', 'h1']);
        expect(f4Comp.names).toEqual(['a', 'b', 'c', 'd', 'e1', 'f1', 'g1', 'h1']);
        expect(f5Comp.names).toEqual(['a', 'b', 'c', 'd1', 'e1', 'f1', 'g1', 'h1']);
        expect(f6Comp.names).toEqual(['a', 'b', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1']);
        expect(f7Comp.names).toEqual(['a', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1']);
        expect(f8Comp.names).toEqual(['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1']);
        render_util_1.renderToHtml(Template, ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h2', 'i1'], directives);
        expect(f3Comp.names).toEqual(['a', 'b', 'c', 'd', 'e', 'f1', 'g1', 'h2']);
        expect(f4Comp.names).toEqual(['a', 'b', 'c', 'd', 'e1', 'f1', 'g1', 'h2']);
        expect(f5Comp.names).toEqual(['a', 'b', 'c', 'd1', 'e1', 'f1', 'g1', 'h2']);
        expect(f6Comp.names).toEqual(['a', 'b', 'c1', 'd1', 'e1', 'f1', 'g1', 'h2']);
        expect(f7Comp.names).toEqual(['a', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h2']);
        expect(f8Comp.names).toEqual(['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h2']);
    });
    it('should work with pureFunctionV for 9+ bindings', function () {
        var e0_ff = function (v0, v1, v2, v3, v4, v5, v6, v7, v8) { return ['start', v0, v1, v2, v3, v4, v5, v6, v7, v8, 'end']; };
        var e0_ff_1 = function (v) { return "modified_" + v; };
        render_util_1.renderToHtml(Template, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'], directives);
        /**
         * <my-comp [names]="['start', v0, v1, v2, v3, `modified_${v4}`, v5, v6, v7, v8, 'end']">
         * </my-comp>
         */
        function Template(rf, c) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'my-comp');
                instructions_1.elementEnd();
                instructions_1.reserveSlots(12);
            }
            if (rf & 2 /* Update */) {
                instructions_1.elementProperty(0, 'names', instructions_1.bind(pure_function_1.pureFunctionV(12, e0_ff, [
                    c[0], c[1], c[2], c[3], pure_function_1.pureFunction1(2, e0_ff_1, c[4]), c[5], c[6], c[7], c[8]
                ])));
            }
        }
        expect(myComp.names).toEqual([
            'start', 'a', 'b', 'c', 'd', 'modified_e', 'f', 'g', 'h', 'i', 'end'
        ]);
        render_util_1.renderToHtml(Template, ['a1', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'], directives);
        expect(myComp.names).toEqual([
            'start', 'a1', 'b', 'c', 'd', 'modified_e', 'f', 'g', 'h', 'i', 'end'
        ]);
        render_util_1.renderToHtml(Template, ['a1', 'b', 'c', 'd', 'e5', 'f', 'g', 'h', 'i'], directives);
        expect(myComp.names).toEqual([
            'start', 'a1', 'b', 'c', 'd', 'modified_e5', 'f', 'g', 'h', 'i', 'end'
        ]);
    });
});
describe('object literals', function () {
    var objectComp;
    var ObjectComp = /** @class */ (function () {
        function ObjectComp() {
        }
        ObjectComp.ngComponentDef = index_1.defineComponent({
            type: ObjectComp,
            selectors: [['object-comp']],
            factory: function ObjectComp_Factory() { return objectComp = new ObjectComp(); },
            template: function ObjectComp_Template(rf, ctx) { },
            inputs: { config: 'config' }
        });
        return ObjectComp;
    }());
    var defs = [ObjectComp];
    it('should support an object literal', function () {
        var e0_ff = function (v) { return { duration: 500, animation: v }; };
        /** <object-comp [config]="{duration: 500, animation: name}"></object-comp> */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'object-comp');
                instructions_1.elementEnd();
                instructions_1.reserveSlots(2);
            }
            if (rf & 2 /* Update */) {
                instructions_1.elementProperty(0, 'config', instructions_1.bind(pure_function_1.pureFunction1(2, e0_ff, ctx.name)));
            }
        }
        render_util_1.renderToHtml(Template, { name: 'slide' }, defs);
        var firstObj = objectComp.config;
        expect(objectComp.config).toEqual({ duration: 500, animation: 'slide' });
        render_util_1.renderToHtml(Template, { name: 'slide' }, defs);
        expect(objectComp.config).toEqual({ duration: 500, animation: 'slide' });
        expect(firstObj).toBe(objectComp.config);
        render_util_1.renderToHtml(Template, { name: 'tap' }, defs);
        expect(objectComp.config).toEqual({ duration: 500, animation: 'tap' });
        // Identity must change if binding changes
        expect(firstObj).not.toBe(objectComp.config);
    });
    it('should support expressions nested deeply in object/array literals', function () {
        var e0_ff = function (v1, v2) { return { animation: v1, actions: v2 }; };
        var e0_ff_1 = function (v) { return [{ opacity: 0, duration: 0 }, v]; };
        var e0_ff_2 = function (v) { return { opacity: 1, duration: v }; };
        /**
         * <object-comp [config]="{animation: name, actions: [{ opacity: 0, duration: 0}, {opacity: 1,
         * duration: duration }]}">
         * </object-comp>
         */
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'object-comp');
                instructions_1.elementEnd();
                instructions_1.reserveSlots(7);
            }
            if (rf & 2 /* Update */) {
                instructions_1.elementProperty(0, 'config', instructions_1.bind(pure_function_1.pureFunction2(7, e0_ff, ctx.name, pure_function_1.pureFunction1(4, e0_ff_1, pure_function_1.pureFunction1(2, e0_ff_2, ctx.duration)))));
            }
        }
        render_util_1.renderToHtml(Template, { name: 'slide', duration: 100 }, defs);
        expect(objectComp.config).toEqual({
            animation: 'slide',
            actions: [{ opacity: 0, duration: 0 }, { opacity: 1, duration: 100 }]
        });
        var firstConfig = objectComp.config;
        render_util_1.renderToHtml(Template, { name: 'slide', duration: 100 }, defs);
        expect(objectComp.config).toEqual({
            animation: 'slide',
            actions: [{ opacity: 0, duration: 0 }, { opacity: 1, duration: 100 }]
        });
        expect(objectComp.config).toBe(firstConfig);
        render_util_1.renderToHtml(Template, { name: 'slide', duration: 50 }, defs);
        expect(objectComp.config).toEqual({
            animation: 'slide',
            actions: [{ opacity: 0, duration: 0 }, { opacity: 1, duration: 50 }]
        });
        expect(objectComp.config).not.toBe(firstConfig);
        render_util_1.renderToHtml(Template, { name: 'tap', duration: 50 }, defs);
        expect(objectComp.config).toEqual({
            animation: 'tap',
            actions: [{ opacity: 0, duration: 0 }, { opacity: 1, duration: 50 }]
        });
        render_util_1.renderToHtml(Template, { name: 'drag', duration: 500 }, defs);
        expect(objectComp.config).toEqual({
            animation: 'drag',
            actions: [{ opacity: 0, duration: 0 }, { opacity: 1, duration: 500 }]
        });
        // The property should not be set if the exp value is the same, so artificially
        // setting the property to ensure it's not overwritten.
        objectComp.config = ['should not be overwritten'];
        render_util_1.renderToHtml(Template, { name: 'drag', duration: 500 }, defs);
        expect(objectComp.config).toEqual(['should not be overwritten']);
    });
    it('should support multiple view instances with multiple bindings', function () {
        var objectComps = [];
        /**
         * % for(let i = 0; i < 2; i++) {
         *   <object-comp [config]="{opacity: configs[i].opacity, duration: configs[i].duration}">
         *   </object-comp>
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
                            instructions_1.elementStart(0, 'object-comp');
                            objectComps.push(instructions_1.loadDirective(0));
                            instructions_1.elementEnd();
                            instructions_1.reserveSlots(3);
                        }
                        if (rf1 & 2 /* Update */) {
                            instructions_1.elementProperty(0, 'config', instructions_1.bind(pure_function_1.pureFunction2(3, e0_ff, ctx.configs[i].opacity, ctx.configs[i].duration)));
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        }
        var e0_ff = function (v1, v2) { return { opacity: v1, duration: v2 }; };
        var configs = [{ opacity: 0, duration: 500 }, { opacity: 1, duration: 600 }];
        render_util_1.renderToHtml(Template, { configs: configs }, defs);
        expect(objectComps[0].config).toEqual({ opacity: 0, duration: 500 });
        expect(objectComps[1].config).toEqual({ opacity: 1, duration: 600 });
        configs[0].duration = 1000;
        render_util_1.renderToHtml(Template, { configs: configs }, defs);
        expect(objectComps[0].config).toEqual({ opacity: 0, duration: 1000 });
        expect(objectComps[1].config).toEqual({ opacity: 1, duration: 600 });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVyZV9mdW5jdGlvbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3JlbmRlcjMvcHVyZV9mdW5jdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsaURBQXdEO0FBQ3hELCtEQUE2TjtBQUU3TixpRUFBc0w7QUFDdEwsOERBQTREO0FBRTVELFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6QixJQUFJLE1BQWMsQ0FBQztJQUVuQjtRQUFBO1FBV0EsQ0FBQztRQVBRLHFCQUFjLEdBQUcsdUJBQWUsQ0FBQztZQUN0QyxJQUFJLEVBQUUsTUFBTTtZQUNaLFNBQVMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDeEIsT0FBTyxFQUFFLDRCQUE0QixPQUFPLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwRSxRQUFRLEVBQUUseUJBQXlCLEVBQWUsRUFBRSxHQUFXLElBQUcsQ0FBQztZQUNuRSxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDO1NBQ3pCLENBQUMsQ0FBQztRQUNMLGFBQUM7S0FBQSxBQVhELElBV0M7SUFFRCxJQUFNLFVBQVUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRTVCLEVBQUUsQ0FBQyxnREFBZ0QsRUFBRTtRQUNuRCxJQUFNLEtBQUssR0FBRyxVQUFDLENBQU0sSUFBSyxPQUFBLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQztRQUUvQyxrRUFBa0U7UUFDbEUsa0JBQWtCLEVBQWUsRUFBRSxHQUFRO1lBQ3pDLElBQUksRUFBRSxpQkFBcUIsRUFBRTtnQkFDM0IsMkJBQVksQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQzNCLHlCQUFVLEVBQUUsQ0FBQztnQkFDYiwyQkFBWSxDQUFD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QUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDbEYsTUFBTSxDQUFDLE1BQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6RSxNQUFNLENBQUMsTUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLE1BQU0sQ0FBQyxNQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekUsTUFBTSxDQUFDLE1BQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6RSxNQUFNLENBQUMsTUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLE1BQU0sQ0FBQyxNQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFekUsMEJBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzNGLE1BQU0sQ0FBQyxNQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDNUUsTUFBTSxDQUFDLE1BQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM3RSxNQUFNLENBQUMsTUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzlFLE1BQU0sQ0FBQyxNQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDL0UsTUFBTSxDQUFDLE1BQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNoRixNQUFNLENBQUMsTUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRWpGLDBCQUFZLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMzRixNQUFNLENBQUMsTUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzVFLE1BQU0sQ0FBQyxNQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDN0UsTUFBTSxDQUFDLE1BQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM5RSxNQUFNLENBQUMsTUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQy9FLE1BQU0sQ0FBQyxNQUFRLENBQUMsS0FBSyxDQUFDLENBQUMs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