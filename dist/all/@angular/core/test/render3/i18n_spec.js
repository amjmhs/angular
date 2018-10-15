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
var definition_1 = require("../../src/render3/definition");
var i18n_4 = require("../../src/render3/i18n");
var instructions_1 = require("../../src/render3/instructions");
var common_with_def_1 = require("./common_with_def");
var render_util_1 = require("./render_util");
describe('Runtime i18n', function () {
    it('should support html elements', function () {
        // Html tags are replaced by placeholders.
        // Open tag placeholders are never re-used (closing tag placeholders can be).
        var MSG_DIV_SECTION_1 = "{$START_C}trad 1{$END_C}{$START_A}trad 2{$START_B}trad 3{$END_B}{$END_A}";
        var i18n_1;
        // Initial template:
        // <div i18n>
        //  <a>
        //    <b></b>
        //    <remove-me></remove-me>
        //  </a>
        //  <c></c>
        // </div>
        // Translated to:
        // <div i18n>
        //  <c>trad 1</c>
        //  <a>
        //    trad 2
        //    <b>trad 3</b>
        //  </a>
        // </div>
        function createTemplate() {
            if (!i18n_1) {
                i18n_1 = i18n_4.i18nMapping(MSG_DIV_SECTION_1, [{ 'START_A': 1, 'START_B': 2, 'START_REMOVE_ME': 3, 'START_C': 4 }]);
            }
            instructions_1.elementStart(0, 'div');
            { // Start of translated section 1
                // - i18n sections do not contain any text() instruction
                instructions_1.elementStart(1, 'a'); // START_A
                {
                    instructions_1.element(2, 'b'); // START_B
                    instructions_1.element(3, 'remove-me'); // START_REMOVE_ME
                }
                instructions_1.elementEnd();
                instructions_1.element(4, 'c'); // START_C
            } // End of translated section 1
            instructions_1.elementEnd();
            i18n_4.i18nApply(1, i18n_1[0]);
        }
        var fixture = new render_util_1.TemplateFixture(createTemplate);
        expect(fixture.html).toEqual('<div><c>trad 1</c><a>trad 2<b>trad 3</b></a></div>');
    });
    it('should support expressions', function () {
        var MSG_DIV_SECTION_1 = "start {$EXP_2} middle {$EXP_1} end";
        var i18n_1;
        var MyApp = /** @class */ (function () {
            function MyApp() {
                this.exp1 = '1';
                this.exp2 = '2';
            }
            MyApp.ngComponentDef = definition_1.defineComponent({
                type: MyApp,
                factory: function () { return new MyApp(); },
                selectors: [['my-app']],
                // Initial template:
                // <div i18n>
                //  {{exp1}} {{exp2}}
                // </div>
                // Translated to:
                // <div i18n>
                //  start {{exp2}} middle {{exp1}} end
                // </div>
                template: function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        if (!i18n_1) {
                            i18n_1 = i18n_4.i18nMapping(MSG_DIV_SECTION_1, null, [{ 'EXP_1': 1, 'EXP_2': 2 }]);
                        }
                        instructions_1.elementStart(0, 'div');
                        {
                            // Start of translated section 1
                            // One text node is added per expression in the interpolation
                            instructions_1.text(1); // EXP_1
                            instructions_1.text(2); // EXP_2
                            // End of translated section 1
                        }
                        instructions_1.elementEnd();
                        i18n_4.i18nApply(1, i18n_1[0]);
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.textBinding(1, instructions_1.bind(ctx.exp1));
                        instructions_1.textBinding(2, instructions_1.bind(ctx.exp2));
                    }
                }
            });
            return MyApp;
        }());
        var fixture = new render_util_1.ComponentFixture(MyApp);
        expect(fixture.html).toEqual('<div>start 2 middle 1 end</div>');
        // Change detection cycle, no model changes
        fixture.update();
        expect(fixture.html).toEqual('<div>start 2 middle 1 end</div>');
        // Change the expressions
        fixture.component.exp1 = 'expr 1';
        fixture.component.exp2 = 'expr 2';
        fixture.update();
        expect(fixture.html).toEqual('<div>start expr 2 middle expr 1 end</div>');
    });
    it('should support expressions on removed nodes', function () {
        var MSG_DIV_SECTION_1 = "message";
        var i18n_1;
        var MyApp = /** @class */ (function () {
            function MyApp() {
                this.exp1 = '1';
            }
            MyApp.ngComponentDef = definition_1.defineComponent({
                type: MyApp,
                factory: function () { return new MyApp(); },
                selectors: [['my-app']],
                // Initial template:
                // <div i18n>
                //  {{exp1}}
                // </div>
                // Translated to:
                // <div i18n>
                //   message
                // </div>
                template: function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        if (!i18n_1) {
                            i18n_1 = i18n_4.i18nMapping(MSG_DIV_SECTION_1, null, [{ 'EXP_1': 1 }]);
                        }
                        instructions_1.elementStart(0, 'div');
                        {
                            // Start of translated section 1
                            instructions_1.text(1); // EXP_1 will be removed
                            // End of translated section 1
                        }
                        instructions_1.elementEnd();
                        i18n_4.i18nApply(1, i18n_1[0]);
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.textBinding(1, instructions_1.bind(ctx.exp1));
                    }
                }
            });
            return MyApp;
        }());
        var fixture = new render_util_1.ComponentFixture(MyApp);
        expect(fixture.html).toEqual('<div>message</div>');
        // Change detection cycle, no model changes
        fixture.update();
        expect(fixture.html).toEqual('<div>message</div>');
        // Change the expressions
        fixture.component.exp1 = 'expr 1';
        fixture.update();
        expect(fixture.html).toEqual('<div>message</div>');
    });
    it('should support expressions in attributes', function () {
        var MSG_DIV_SECTION_1 = "start {$EXP_2} middle {$EXP_1} end";
        var i18n_1 = i18n_4.i18nExpMapping(MSG_DIV_SECTION_1, { 'EXP_1': 0, 'EXP_2': 1 });
        var MyApp = /** @class */ (function () {
            function MyApp() {
                this.exp1 = '1';
                this.exp2 = '2';
            }
            MyApp.ngComponentDef = definition_1.defineComponent({
                type: MyApp,
                factory: function () { return new MyApp(); },
                selectors: [['my-app']],
                // Initial template:
                // <div i18n i18n-title title="{{exp1}}{{exp2}}"></div>
                // Translated to:
                // <div i18n i18n-title title="start {{exp2}} middle {{exp1}} end"></div>
                template: function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.element(0, 'div'); // translated section 1
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.elementProperty(0, 'title', i18n_4.i18nInterpolation2(i18n_1, ctx.exp1, ctx.exp2));
                    }
                }
            });
            return MyApp;
        }());
        var fixture = new render_util_1.ComponentFixture(MyApp);
        expect(fixture.html).toEqual('<div title="start 2 middle 1 end"></div>');
        // Change detection cycle, no model changes
        fixture.update();
        expect(fixture.html).toEqual('<div title="start 2 middle 1 end"></div>');
        // Change the expressions
        fixture.component.exp1 = function test() { };
        fixture.component.exp2 = null;
        fixture.update();
        expect(fixture.html).toEqual('<div title="start  middle test end"></div>');
    });
    it('should support both html elements, expressions and expressions in attributes', function () {
        var MSG_DIV_SECTION_1 = "{$EXP_1} {$START_P}trad {$EXP_2}{$END_P}";
        var MSG_ATTR_1 = "start {$EXP_2} middle {$EXP_1} end";
        var i18n_1;
        var i18n_2;
        var MyApp = /** @class */ (function () {
            function MyApp() {
                this.exp1 = '1';
                this.exp2 = '2';
                this.exp3 = '3';
            }
            MyApp.ngComponentDef = definition_1.defineComponent({
                type: MyApp,
                factory: function () { return new MyApp(); },
                selectors: [['my-app']],
                // Initial template:
                // <div i18n i18n-title title="{{exp1}}{{exp2}}">
                //  {{exp1}}
                //  <remove-me-1>
                //    <remove-me-2></remove-me-2>
                //    <remove-me-3></remove-me-3>
                //  </remove-me-1>
                //  <p>
                //    {{exp2}}
                //  </p>
                //  {{exp3}}
                // </div>
                // Translated to:
                // <div i18n i18n-title title="start {{exp2}} middle {{exp1}} end">
                //  {{exp1}}
                //  <p>
                //    trad {{exp2}}
                //  </p>
                // </div>
                template: function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        if (!i18n_1) {
                            i18n_1 = i18n_4.i18nMapping(MSG_DIV_SECTION_1, [{
                                    'START_REMOVE_ME_1': 2,
                                    'START_REMOVE_ME_2': 3,
                                    'START_REMOVE_ME_3': 4,
                                    'START_P': 5
                                }], [{ 'EXP_1': 1, 'EXP_2': 6, 'EXP_3': 7 }]);
                        }
                        if (!i18n_2) {
                            i18n_2 = i18n_4.i18nExpMapping(MSG_ATTR_1, { 'EXP_1': 0, 'EXP_2': 1 });
                        }
                        instructions_1.elementStart(0, 'div');
                        {
                            // Start of translated section 1
                            instructions_1.text(1); // EXP_1
                            instructions_1.elementStart(2, 'remove-me-1'); // START_REMOVE_ME_1
                            {
                                instructions_1.element(3, 'remove-me-2'); // START_REMOVE_ME_2
                                instructions_1.element(4, 'remove-me-3'); // START_REMOVE_ME_3
                            }
                            instructions_1.elementEnd();
                            instructions_1.elementStart(5, 'p'); // START_P
                            {
                                instructions_1.text(6);
                            } // EXP_2
                            instructions_1.elementEnd();
                            instructions_1.text(7); // EXP_3
                            // End of translated section 1
                        }
                        instructions_1.elementEnd();
                        i18n_4.i18nApply(1, i18n_1[0]);
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.textBinding(1, instructions_1.bind(ctx.exp1));
                        instructions_1.textBinding(6, instructions_1.bind(ctx.exp2));
                        instructions_1.textBinding(7, instructions_1.bind(ctx.exp3));
                        instructions_1.elementProperty(0, 'title', i18n_4.i18nInterpolation2(i18n_2, ctx.exp1, ctx.exp2));
                    }
                }
            });
            return MyApp;
        }());
        var fixture = new render_util_1.ComponentFixture(MyApp);
        expect(fixture.html).toEqual('<div title="start 2 middle 1 end">1 <p>trad 2</p></div>');
        // Change detection cycle, no model changes
        fixture.update();
        expect(fixture.html).toEqual('<div title="start 2 middle 1 end">1 <p>trad 2</p></div>');
        // Change the expressions
        fixture.component.exp1 = 'expr 1';
        fixture.component.exp2 = 'expr 2';
        fixture.update();
        expect(fixture.html)
            .toEqual('<div title="start expr 2 middle expr 1 end">expr 1 <p>trad expr 2</p></div>');
    });
    it('should support multiple i18n elements', function () {
        var MSG_DIV_SECTION_1 = "trad {$EXP_1}";
        var MSG_DIV_SECTION_2 = "{$START_C}trad{$END_C}";
        var MSG_ATTR_1 = "start {$EXP_2} middle {$EXP_1} end";
        var i18n_1;
        var i18n_2;
        var i18n_3;
        var MyApp = /** @class */ (function () {
            function MyApp() {
                this.exp1 = '1';
                this.exp2 = '2';
            }
            MyApp.ngComponentDef = definition_1.defineComponent({
                type: MyApp,
                factory: function () { return new MyApp(); },
                selectors: [['my-app']],
                // Initial template:
                // <div>
                //  <a i18n>
                //    {{exp1}}
                //  </a>
                //  hello
                //  <b i18n i18n-title title="{{exp1}}{{exp2}}">
                //    <c></c>
                //  </b>
                // </div>
                // Translated to:
                // <div>
                //  <a i18n>
                //    trad {{exp1}}
                //  </a>
                //  hello
                //  <b i18n i18n-title title="start {{exp2}} middle {{exp1}} end">
                //    <c>trad</c>
                //  </b>
                // </div>
                template: function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        if (!i18n_1) {
                            i18n_1 = i18n_4.i18nMapping(MSG_DIV_SECTION_1, null, [{ 'EXP_1': 2 }]);
                        }
                        if (!i18n_2) {
                            i18n_2 = i18n_4.i18nMapping(MSG_DIV_SECTION_2, [{ 'START_C': 5 }]);
                        }
                        if (!i18n_3) {
                            i18n_3 = i18n_4.i18nExpMapping(MSG_ATTR_1, { 'EXP_1': 0, 'EXP_2': 1 });
                        }
                        instructions_1.elementStart(0, 'div');
                        {
                            instructions_1.elementStart(1, 'a');
                            {
                                // Start of translated section 1
                                instructions_1.text(2); // EXP_1
                                // End of translated section 1
                            }
                            instructions_1.elementEnd();
                            instructions_1.text(3, 'hello');
                            instructions_1.elementStart(4, 'b');
                            {
                                // Start of translated section 2
                                instructions_1.element(5, 'c'); // START_C
                                // End of translated section 2
                            }
                            instructions_1.elementEnd();
                        }
                        instructions_1.elementEnd();
                        i18n_4.i18nApply(2, i18n_1[0]);
                        i18n_4.i18nApply(5, i18n_2[0]);
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.textBinding(2, instructions_1.bind(ctx.exp1));
                        instructions_1.elementProperty(4, 'title', i18n_4.i18nInterpolation2(i18n_3, ctx.exp1, ctx.exp2));
                    }
                }
            });
            return MyApp;
        }());
        var fixture = new render_util_1.ComponentFixture(MyApp);
        expect(fixture.html)
            .toEqual('<div><a>trad 1</a>hello<b title="start 2 middle 1 end"><c>trad</c></b></div>');
        // Change detection cycle, no model changes
        fixture.update();
        expect(fixture.html)
            .toEqual('<div><a>trad 1</a>hello<b title="start 2 middle 1 end"><c>trad</c></b></div>');
        // Change the expressions
        fixture.component.exp1 = 'expr 1';
        fixture.component.exp2 = 'expr 2';
        fixture.update();
        expect(fixture.html)
            .toEqual('<div><a>trad expr 1</a>hello<b title="start expr 2 middle expr 1 end"><c>trad</c></b></div>');
    });
    describe('view containers / embedded templates', function () {
        it('should support containers', function () {
            var MSG_DIV_SECTION_1 = "valeur: {$EXP_1}";
            // The indexes are based on the main template function
            var i18n_1;
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.exp1 = '1';
                }
                MyApp.ngComponentDef = definition_1.defineComponent({
                    type: MyApp,
                    factory: function () { return new MyApp(); },
                    selectors: [['my-app']],
                    // Initial template:
                    // before (
                    // % if (condition) { // with i18n
                    //   value: {{exp1}}
                    // % }
                    // ) after
                    // Translated :
                    // before (
                    // % if (condition) { // with i18n
                    //   valeur: {{exp1}}
                    // % }
                    // ) after
                    template: function (rf, myApp) {
                        if (rf & 1 /* Create */) {
                            if (!i18n_1) {
                                i18n_1 = i18n_4.i18nMapping(MSG_DIV_SECTION_1, null, [{ 'EXP_1': 0 }]);
                            }
                            instructions_1.text(0, 'before (');
                            instructions_1.container(1);
                            instructions_1.text(2, ') after');
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.containerRefreshStart(1);
                            {
                                var rf0 = instructions_1.embeddedViewStart(0);
                                if (rf0 & 1 /* Create */) {
                                    // Start of translated section 1
                                    instructions_1.text(0); // EXP_1
                                    // End of translated section 1
                                    i18n_4.i18nApply(0, i18n_1[0]);
                                }
                                if (rf0 & 2 /* Update */) {
                                    instructions_1.textBinding(0, instructions_1.bind(myApp.exp1));
                                }
                                instructions_1.embeddedViewEnd();
                            }
                            instructions_1.containerRefreshEnd();
                        }
                    }
                });
                return MyApp;
            }());
            var fixture = new render_util_1.ComponentFixture(MyApp);
            expect(fixture.html).toEqual('before (valeur: 1) after');
            // Change detection cycle, no model changes
            fixture.update();
            expect(fixture.html).toEqual('before (valeur: 1) after');
        });
        it('should support ng-container', function () {
            var MSG_DIV_SECTION_1 = "{$START_B}{$END_B}";
            // With ng-container the i18n node doesn't create any element at runtime which means that
            // its children are not the only children of their parent, some nodes which are not
            // translated might also be the children of the same parent.
            // This is why we need to pass the `lastChildIndex` to `i18nMapping`
            var i18n_1;
            // Initial template:
            // <div i18n>
            //  <a></a>
            //  <ng-container i18n>
            //    <b></b>
            //    <c></c>
            //  </ng-container>
            //  <d></d>
            // </div>
            // Translated to:
            // <div i18n>
            //  <a></a>
            //  <ng-container i18n>
            //    <b></b>
            //  </ng-container>
            //  <d></d>
            // </div>
            function createTemplate() {
                if (!i18n_1) {
                    i18n_1 = i18n_4.i18nMapping(MSG_DIV_SECTION_1, [{ 'START_B': 2, 'START_C': 3 }], null, null, 4);
                }
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.element(1, 'a');
                    {
                        // Start of translated section 1
                        instructions_1.element(2, 'b'); // START_B
                        instructions_1.element(3, 'c'); // START_C
                        // End of translated section 1
                    }
                    instructions_1.element(4, 'd');
                }
                instructions_1.elementEnd();
                i18n_4.i18nApply(2, i18n_1[0]);
            }
            var fixture = new render_util_1.TemplateFixture(createTemplate);
            expect(fixture.html).toEqual('<div><a></a><b></b><d></d></div>');
        });
        it('should support embedded templates', function () {
            var MSG_DIV_SECTION_1 = "{$START_LI}valeur: {$EXP_1}!{$END_LI}";
            // The indexes are based on each template function
            var i18n_1;
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.items = ['1', '2'];
                }
                MyApp.ngComponentDef = definition_1.defineComponent({
                    type: MyApp,
                    factory: function () { return new MyApp(); },
                    selectors: [['my-app']],
                    // Initial template:
                    // <ul i18n>
                    //   <li *ngFor="let item of items">value: {{item}}</li>
                    // </ul>
                    // Translated to:
                    // <ul i18n>
                    //   <li *ngFor="let item of items">valeur: {{item}}!</li>
                    // </ul>
                    template: function (rf, myApp) {
                        if (rf & 1 /* Create */) {
                            if (!i18n_1) {
                                i18n_1 = i18n_4.i18nMapping(MSG_DIV_SECTION_1, [{ 'START_LI': 1 }, { 'START_LI': 0 }], [null, { 'EXP_1': 1 }], ['START_LI']);
                            }
                            instructions_1.elementStart(0, 'ul');
                            {
                                // Start of translated section 1
                                instructions_1.container(1, liTemplate, null, ['ngForOf', '']); // START_LI
                                // End of translated section 1
                            }
                            instructions_1.elementEnd();
                            i18n_4.i18nApply(1, i18n_1[0]);
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.elementProperty(1, 'ngForOf', instructions_1.bind(myApp.items));
                        }
                        function liTemplate(rf1, row) {
                            if (rf1 & 1 /* Create */) {
                                // This is a container so the whole template is a translated section
                                // Start of translated section 2
                                instructions_1.elementStart(0, 'li'); // START_LI
                                {
                                    instructions_1.text(1);
                                } // EXP_1
                                instructions_1.elementEnd();
                                // End of translated section 2
                                i18n_4.i18nApply(0, i18n_1[1]);
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.textBinding(1, instructions_1.bind(row.$implicit));
                            }
                        }
                    },
                    directives: function () { return [common_with_def_1.NgForOf]; }
                });
                return MyApp;
            }());
            var fixture = new render_util_1.ComponentFixture(MyApp);
            expect(fixture.html).toEqual('<ul><li>valeur: 1!</li><li>valeur: 2!</li></ul>');
            // Change detection cycle, no model changes
            fixture.update();
            expect(fixture.html).toEqual('<ul><li>valeur: 1!</li><li>valeur: 2!</li></ul>');
            // Remove the last item
            fixture.component.items.length = 1;
            fixture.update();
            expect(fixture.html).toEqual('<ul><li>valeur: 1!</li></ul>');
            // Change an item
            fixture.component.items[0] = 'one';
            fixture.update();
            expect(fixture.html).toEqual('<ul><li>valeur: one!</li></ul>');
            // Add an item
            fixture.component.items.push('two');
            fixture.update();
            expect(fixture.html).toEqual('<ul><li>valeur: one!</li><li>valeur: two!</li></ul>');
        });
        it('should support sibling embedded templates', function () {
            var MSG_DIV_SECTION_1 = "{$START_LI_0}valeur: {$EXP_1}!{$END_LI_0}{$START_LI_1}valeur bis: {$EXP_2}!{$END_LI_1}";
            // The indexes are based on each template function
            var i18n_1;
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.items = ['1', '2'];
                }
                MyApp.ngComponentDef = definition_1.defineComponent({
                    type: MyApp,
                    factory: function () { return new MyApp(); },
                    selectors: [['my-app']],
                    // Initial template:
                    // <ul i18n>
                    //   <li *ngFor="let item of items">value: {{item}}</li>
                    //   <li *ngFor="let item of items">value bis: {{item}}</li>
                    // </ul>
                    // Translated to:
                    // <ul i18n>
                    //   <li *ngFor="let item of items">valeur: {{item}}!</li>
                    //   <li *ngFor="let item of items">valeur bis: {{item}}!</li>
                    // </ul>
                    template: function (rf, myApp) {
                        if (rf & 1 /* Create */) {
                            if (!i18n_1) {
                                i18n_1 = i18n_4.i18nMapping(MSG_DIV_SECTION_1, [{ 'START_LI_0': 1, 'START_LI_1': 2 }, { 'START_LI_0': 0 }, { 'START_LI_1': 0 }], [null, { 'EXP_1': 1 }, { 'EXP_2': 1 }], ['START_LI_0', 'START_LI_1']);
                            }
                            instructions_1.elementStart(0, 'ul');
                            {
                                // Start of translated section 1
                                instructions_1.container(1, liTemplate, null, ['ngForOf', '']); // START_LI_0
                                instructions_1.container(2, liTemplateBis, null, ['ngForOf', '']); // START_LI_1
                                // End of translated section 1
                            }
                            instructions_1.elementEnd();
                            i18n_4.i18nApply(1, i18n_1[0]);
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.elementProperty(1, 'ngForOf', instructions_1.bind(myApp.items));
                            instructions_1.elementProperty(2, 'ngForOf', instructions_1.bind(myApp.items));
                        }
                        function liTemplate(rf1, row) {
                            if (rf1 & 1 /* Create */) {
                                // This is a container so the whole template is a translated section
                                // Start of translated section 2
                                instructions_1.elementStart(0, 'li'); // START_LI_0
                                {
                                    instructions_1.text(1);
                                } // EXP_1
                                instructions_1.elementEnd();
                                // End of translated section 2
                                i18n_4.i18nApply(0, i18n_1[1]);
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.textBinding(1, instructions_1.bind(row.$implicit));
                            }
                        }
                        function liTemplateBis(rf1, row) {
                            if (rf1 & 1 /* Create */) {
                                // This is a container so the whole template is a translated section
                                // Start of translated section 3
                                instructions_1.elementStart(0, 'li'); // START_LI_1
                                {
                                    instructions_1.text(1);
                                } // EXP_2
                                instructions_1.elementEnd();
                                // End of translated section 3
                                i18n_4.i18nApply(0, i18n_1[2]);
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.textBinding(1, instructions_1.bind(row.$implicit));
                            }
                        }
                    },
                    directives: function () { return [common_with_def_1.NgForOf]; }
                });
                return MyApp;
            }());
            var fixture = new render_util_1.ComponentFixture(MyApp);
            expect(fixture.html)
                .toEqual('<ul><li>valeur: 1!</li><li>valeur: 2!</li><li>valeur bis: 1!</li><li>valeur bis: 2!</li></ul>');
            // Change detection cycle, no model changes
            fixture.update();
            expect(fixture.html)
                .toEqual('<ul><li>valeur: 1!</li><li>valeur: 2!</li><li>valeur bis: 1!</li><li>valeur bis: 2!</li></ul>');
            // Remove the last item
            fixture.component.items.length = 1;
            fixture.update();
            expect(fixture.html).toEqual('<ul><li>valeur: 1!</li><li>valeur bis: 1!</li></ul>');
            // Change an item
            fixture.component.items[0] = 'one';
            fixture.update();
            expect(fixture.html).toEqual('<ul><li>valeur: one!</li><li>valeur bis: one!</li></ul>');
            // Add an item
            fixture.component.items.push('two');
            fixture.update();
            expect(fixture.html)
                .toEqual('<ul><li>valeur: one!</li><li>valeur: two!</li><li>valeur bis: one!</li><li>valeur bis: two!</li></ul>');
        });
        it('should support changing the order of multiple template roots in the same template', function () {
            var MSG_DIV_SECTION_1 = "{$START_LI_1}valeur bis: {$EXP_2}!{$END_LI_1}{$START_LI_0}valeur: {$EXP_1}!{$END_LI_0}";
            // The indexes are based on each template function
            var i18n_1;
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.items = ['1', '2'];
                }
                MyApp.ngComponentDef = definition_1.defineComponent({
                    type: MyApp,
                    factory: function () { return new MyApp(); },
                    selectors: [['my-app']],
                    // Initial template:
                    // <ul i18n>
                    //   <li *ngFor="let item of items">value: {{item}}</li>
                    //   <li *ngFor="let item of items">value bis: {{item}}</li>
                    // </ul>
                    // Translated to:
                    // <ul i18n>
                    //   <li *ngFor="let item of items">valeur bis: {{item}}!</li>
                    //   <li *ngFor="let item of items">valeur: {{item}}!</li>
                    // </ul>
                    template: function (rf, myApp) {
                        if (rf & 1 /* Create */) {
                            if (!i18n_1) {
                                i18n_1 = i18n_4.i18nMapping(MSG_DIV_SECTION_1, [{ 'START_LI_0': 1, 'START_LI_1': 2 }, { 'START_LI_0': 0 }, { 'START_LI_1': 0 }], [null, { 'EXP_1': 1 }, { 'EXP_2': 1 }], ['START_LI_0', 'START_LI_1']);
                            }
                            instructions_1.elementStart(0, 'ul');
                            {
                                // Start of translated section 1
                                instructions_1.container(1, liTemplate, null, ['ngForOf', '']); // START_LI_0
                                instructions_1.container(2, liTemplateBis, null, ['ngForOf', '']); // START_LI_1
                                // End of translated section 1
                            }
                            instructions_1.elementEnd();
                            i18n_4.i18nApply(1, i18n_1[0]);
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.elementProperty(1, 'ngForOf', instructions_1.bind(myApp.items));
                            instructions_1.elementProperty(2, 'ngForOf', instructions_1.bind(myApp.items));
                        }
                        function liTemplate(rf1, row) {
                            if (rf1 & 1 /* Create */) {
                                // This is a container so the whole template is a translated section
                                // Start of translated section 2
                                instructions_1.elementStart(0, 'li'); // START_LI_0
                                {
                                    instructions_1.text(1);
                                } // EXP_1
                                instructions_1.elementEnd();
                                // End of translated section 2
                                i18n_4.i18nApply(0, i18n_1[1]);
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.textBinding(1, instructions_1.bind(row.$implicit));
                            }
                        }
                        function liTemplateBis(rf1, row) {
                            if (rf1 & 1 /* Create */) {
                                // This is a container so the whole template is a translated section
                                // Start of translated section 3
                                instructions_1.elementStart(0, 'li'); // START_LI_1
                                {
                                    instructions_1.text(1);
                                } // EXP_2
                                instructions_1.elementEnd();
                                // End of translated section 3
                                i18n_4.i18nApply(0, i18n_1[2]);
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.textBinding(1, instructions_1.bind(row.$implicit));
                            }
                        }
                    },
                    directives: function () { return [common_with_def_1.NgForOf]; }
                });
                return MyApp;
            }());
            var fixture = new render_util_1.ComponentFixture(MyApp);
            expect(fixture.html)
                .toEqual('<ul><li>valeur bis: 1!</li><li>valeur bis: 2!</li><li>valeur: 1!</li><li>valeur: 2!</li></ul>');
            // Change detection cycle, no model changes
            fixture.update();
            expect(fixture.html)
                .toEqual('<ul><li>valeur bis: 1!</li><li>valeur bis: 2!</li><li>valeur: 1!</li><li>valeur: 2!</li></ul>');
            // Remove the last item
            fixture.component.items.length = 1;
            fixture.update();
            expect(fixture.html).toEqual('<ul><li>valeur bis: 1!</li><li>valeur: 1!</li></ul>');
            // Change an item
            fixture.component.items[0] = 'one';
            fixture.update();
            expect(fixture.html).toEqual('<ul><li>valeur bis: one!</li><li>valeur: one!</li></ul>');
            // Add an item
            fixture.component.items.push('two');
            fixture.update();
            expect(fixture.html)
                .toEqual('<ul><li>valeur bis: one!</li><li>valeur bis: two!</li><li>valeur: one!</li><li>valeur: two!</li></ul>');
        });
        it('should support nested embedded templates', function () {
            var MSG_DIV_SECTION_1 = "{$START_LI}{$START_SPAN}valeur: {$EXP_1}!{$END_SPAN}{$END_LI}";
            // The indexes are based on each template function
            var i18n_1;
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.items = ['1', '2'];
                }
                MyApp.ngComponentDef = definition_1.defineComponent({
                    type: MyApp,
                    factory: function () { return new MyApp(); },
                    selectors: [['my-app']],
                    // Initial template:
                    // <ul i18n>
                    //   <li *ngFor="let item of items">
                    //     <span *ngFor="let item of items">value: {{item}}</span>
                    //   </li>
                    // </ul>
                    // Translated to:
                    // <ul i18n>
                    //   <li *ngFor="let item of items">
                    //     <span *ngFor="let item of items">valeur: {{item}}!</span>
                    //   </li>
                    // </ul>
                    template: function (rf, myApp) {
                        if (rf & 1 /* Create */) {
                            if (!i18n_1) {
                                i18n_1 = i18n_4.i18nMapping(MSG_DIV_SECTION_1, [{ 'START_LI': 1 }, { 'START_LI': 0, 'START_SPAN': 1 }, { 'START_SPAN': 0 }], [null, null, { 'EXP_1': 1 }], ['START_LI', 'START_SPAN']);
                            }
                            instructions_1.elementStart(0, 'ul');
                            {
                                // Start of translated section 1
                                instructions_1.container(1, liTemplate, null, ['ngForOf', '']); // START_LI
                                // End of translated section 1
                            }
                            instructions_1.elementEnd();
                            i18n_4.i18nApply(1, i18n_1[0]);
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.elementProperty(1, 'ngForOf', instructions_1.bind(myApp.items));
                        }
                        function liTemplate(rf1, row) {
                            if (rf1 & 1 /* Create */) {
                                // This is a container so the whole template is a translated section
                                // Start of translated section 2
                                instructions_1.elementStart(0, 'li'); // START_LI
                                {
                                    instructions_1.container(1, spanTemplate, null, ['ngForOf', '']); // START_SPAN
                                }
                                instructions_1.elementEnd();
                                // End of translated section 2
                                i18n_4.i18nApply(0, i18n_1[1]);
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.elementProperty(1, 'ngForOf', instructions_1.bind(myApp.items));
                            }
                        }
                        function spanTemplate(rf1, row) {
                            if (rf1 & 1 /* Create */) {
                                // This is a container so the whole template is a translated section
                                // Start of translated section 3
                                instructions_1.elementStart(0, 'span'); // START_SPAN
                                {
                                    instructions_1.text(1);
                                } // EXP_1
                                instructions_1.elementEnd();
                                // End of translated section 3
                                i18n_4.i18nApply(0, i18n_1[2]);
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.textBinding(1, instructions_1.bind(row.$implicit));
                            }
                        }
                    },
                    directives: function () { return [common_with_def_1.NgForOf]; }
                });
                return MyApp;
            }());
            var fixture = new render_util_1.ComponentFixture(MyApp);
            expect(fixture.html)
                .toEqual('<ul><li><span>valeur: 1!</span><span>valeur: 2!</span></li><li><span>valeur: 1!</span><span>valeur: 2!</span></li></ul>');
            // Change detection cycle, no model changes
            fixture.update();
            expect(fixture.html)
                .toEqual('<ul><li><span>valeur: 1!</span><span>valeur: 2!</span></li><li><span>valeur: 1!</span><span>valeur: 2!</span></li></ul>');
            // Remove the last item
            fixture.component.items.length = 1;
            fixture.update();
            expect(fixture.html).toEqual('<ul><li><span>valeur: 1!</span></li></ul>');
            // Change an item
            fixture.component.items[0] = 'one';
            fixture.update();
            expect(fixture.html).toEqual('<ul><li><span>valeur: one!</span></li></ul>');
            // Add an item
            fixture.component.items.push('two');
            fixture.update();
            expect(fixture.html)
                .toEqual('<ul><li><span>valeur: one!</span><span>valeur: two!</span></li><li><span>valeur: one!</span><span>valeur: two!</span></li></ul>');
        });
        it('should be able to move template roots around', function () {
            var MSG_DIV_SECTION_1 = "{$START_LI_0}d\u00E9but{$END_LI_0}{$START_LI_1}valeur: {$EXP_1}{$END_LI_1}fin";
            // The indexes are based on each template function
            var i18n_1;
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.items = ['first', 'second'];
                }
                MyApp.ngComponentDef = definition_1.defineComponent({
                    type: MyApp,
                    factory: function () { return new MyApp(); },
                    selectors: [['my-app']],
                    // Initial template:
                    // <ul i18n>
                    //   <li>start</li>
                    //   <li *ngFor="let item of items">value: {{item}}</li>
                    //   <li>delete me</li>
                    // </ul>
                    // Translated to:
                    // <ul i18n>
                    //   <li>début</li>
                    //   <li *ngFor="let item of items">valeur: {{item}}</li>
                    //   fin
                    // </ul>
                    template: function (rf, myApp) {
                        if (rf & 1 /* Create */) {
                            if (!i18n_1) {
                                i18n_1 = i18n_4.i18nMapping(MSG_DIV_SECTION_1, [{ 'START_LI_0': 1, 'START_LI_1': 2, 'START_LI_2': 3 }, { 'START_LI_1': 0 }], [null, { 'EXP_1': 1 }], ['START_LI_1']);
                            }
                            instructions_1.elementStart(0, 'ul');
                            {
                                // Start of translated section 1
                                instructions_1.element(1, 'li'); // START_LI_0
                                instructions_1.container(2, liTemplate, null, ['ngForOf', '']); // START_LI_1
                                instructions_1.elementStart(3, 'li'); // START_LI_2
                                {
                                    instructions_1.text(4, 'delete me');
                                }
                                instructions_1.elementEnd();
                                // End of translated section 1
                            }
                            instructions_1.elementEnd();
                            i18n_4.i18nApply(1, i18n_1[0]);
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.elementProperty(2, 'ngForOf', instructions_1.bind(myApp.items));
                        }
                        function liTemplate(rf1, row) {
                            if (rf1 & 1 /* Create */) {
                                // This is a container so the whole template is a translated section
                                // Start of translated section 2
                                instructions_1.elementStart(0, 'li'); // START_LI_1
                                {
                                    instructions_1.text(1);
                                } // EXP_1
                                instructions_1.elementEnd();
                                // End of translated section 2
                                i18n_4.i18nApply(0, i18n_1[1]);
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.textBinding(1, instructions_1.bind(row.$implicit));
                            }
                        }
                    },
                    directives: function () { return [common_with_def_1.NgForOf]; }
                });
                return MyApp;
            }());
            var fixture = new render_util_1.ComponentFixture(MyApp);
            expect(fixture.html)
                .toEqual('<ul><li>début</li><li>valeur: first</li><li>valeur: second</li>fin</ul>');
            // Change detection cycle, no model changes
            fixture.update();
            expect(fixture.html)
                .toEqual('<ul><li>début</li><li>valeur: first</li><li>valeur: second</li>fin</ul>');
            // Remove the last item
            fixture.component.items.length = 1;
            fixture.update();
            expect(fixture.html).toEqual('<ul><li>début</li><li>valeur: first</li>fin</ul>');
            // Change an item
            fixture.component.items[0] = 'one';
            fixture.update();
            expect(fixture.html).toEqual('<ul><li>début</li><li>valeur: one</li>fin</ul>');
            // Add an item
            fixture.component.items.push('two');
            fixture.update();
            expect(fixture.html)
                .toEqual('<ul><li>début</li><li>valeur: one</li><li>valeur: two</li>fin</ul>');
        });
        it('should be able to remove template roots', function () {
            var MSG_DIV_SECTION_1 = "loop";
            // The indexes are based on each template function
            var i18n_1;
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.items = ['first', 'second'];
                }
                MyApp.ngComponentDef = definition_1.defineComponent({
                    type: MyApp,
                    factory: function () { return new MyApp(); },
                    selectors: [['my-app']],
                    // Initial template:
                    // <ul i18n>
                    //   <li *ngFor="let item of items">value: {{item}}</li>
                    // </ul>
                    // Translated to:
                    // <ul i18n>
                    //   loop
                    // </ul>
                    template: function (rf, myApp) {
                        if (rf & 1 /* Create */) {
                            if (!i18n_1) {
                                i18n_1 = i18n_4.i18nMapping(MSG_DIV_SECTION_1, [{ 'START_LI': 1 }, { 'START_LI': 0 }], [null, { 'EXP_1': 1 }], ['START_LI']);
                            }
                            instructions_1.elementStart(0, 'ul');
                            {
                                // Start of translated section 1
                                instructions_1.container(1, liTemplate, undefined, ['ngForOf', '']); // START_LI
                                // End of translated section 1
                            }
                            instructions_1.elementEnd();
                            i18n_4.i18nApply(1, i18n_1[0]);
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.elementProperty(1, 'ngForOf', instructions_1.bind(myApp.items));
                        }
                        function liTemplate(rf1, row) {
                            if (rf1 & 1 /* Create */) {
                                // This is a container so the whole template is a translated section
                                // Start of translated section 2
                                instructions_1.elementStart(0, 'li'); // START_LI
                                {
                                    instructions_1.text(1);
                                } // EXP_1
                                instructions_1.elementEnd();
                                // End of translated section 2
                                i18n_4.i18nApply(0, i18n_1[1]);
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.textBinding(1, instructions_1.bind(row.$implicit));
                            }
                        }
                    },
                    directives: function () { return [common_with_def_1.NgForOf]; }
                });
                return MyApp;
            }());
            var fixture = new render_util_1.ComponentFixture(MyApp);
            expect(fixture.html).toEqual('<ul>loop</ul>');
            // Change detection cycle, no model changes
            fixture.update();
            expect(fixture.html).toEqual('<ul>loop</ul>');
            // Remove the last item
            fixture.component.items.length = 1;
            fixture.update();
            expect(fixture.html).toEqual('<ul>loop</ul>');
            // Change an item
            fixture.component.items[0] = 'one';
            fixture.update();
            expect(fixture.html).toEqual('<ul>loop</ul>');
            // Add an item
            fixture.component.items.push('two');
            fixture.update();
            expect(fixture.html).toEqual('<ul>loop</ul>');
        });
    });
    describe('projection', function () {
        it('should project the translations', function () {
            var Child = /** @class */ (function () {
                function Child() {
                }
                Child_1 = Child;
                var Child_1;
                Child.ngComponentDef = definition_1.defineComponent({
                    type: Child_1,
                    selectors: [['child']],
                    factory: function () { return new Child_1(); },
                    template: function (rf, cmp) {
                        if (rf & 1 /* Create */) {
                            instructions_1.projectionDef();
                            instructions_1.elementStart(0, 'p');
                            {
                                instructions_1.projection(1);
                            }
                            instructions_1.elementEnd();
                        }
                    }
                });
                Child = Child_1 = __decorate([
                    core_1.Component({ selector: 'child', template: '<p><ng-content></ng-content></p>' })
                ], Child);
                return Child;
            }());
            var MSG_DIV_SECTION_1 = "{$START_CHILD}Je suis projet\u00E9 depuis {$START_B}{$EXP_1}{$END_B}{$END_CHILD}";
            var i18n_1;
            var MSG_ATTR_1 = "Enfant de {$EXP_1}";
            var i18n_2;
            var Parent = /** @class */ (function () {
                function Parent() {
                    this.name = 'Parent';
                }
                Parent_1 = Parent;
                var Parent_1;
                Parent.ngComponentDef = definition_1.defineComponent({
                    type: Parent_1,
                    selectors: [['parent']],
                    directives: [Child],
                    factory: function () { return new Parent_1(); },
                    template: function (rf, cmp) {
                        if (rf & 1 /* Create */) {
                            if (!i18n_1) {
                                i18n_1 = i18n_4.i18nMapping(MSG_DIV_SECTION_1, [{
                                        'START_CHILD': 1,
                                        'START_B': 2,
                                        'START_REMOVE_ME_1': 4,
                                        'START_REMOVE_ME_2': 5,
                                        'START_REMOVE_ME_3': 6
                                    }], [{ 'EXP_1': 3 }]);
                            }
                            if (!i18n_2) {
                                i18n_2 = i18n_4.i18nExpMapping(MSG_ATTR_1, { 'EXP_1': 0 });
                            }
                            instructions_1.elementStart(0, 'div');
                            {
                                // Start of translated section 1
                                instructions_1.elementStart(1, 'child'); // START_CHILD
                                {
                                    instructions_1.elementStart(2, 'b'); // START_B
                                    {
                                        instructions_1.text(3); // EXP_1
                                        instructions_1.element(4, 'remove-me-1'); // START_REMOVE_ME_1
                                    }
                                    instructions_1.elementEnd();
                                    instructions_1.element(5, 'remove-me-2'); // START_REMOVE_ME_2
                                }
                                instructions_1.elementEnd();
                                instructions_1.element(6, 'remove-me-3'); // START_REMOVE_ME_3
                                // End of translated section 1
                            }
                            instructions_1.elementEnd();
                            i18n_4.i18nApply(1, i18n_1[0]);
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.elementProperty(2, 'title', i18n_4.i18nInterpolation1(i18n_2, cmp.name));
                            instructions_1.textBinding(3, instructions_1.bind(cmp.name));
                        }
                    }
                });
                Parent = Parent_1 = __decorate([
                    core_1.Component({
                        selector: 'parent',
                        template: "\n        <div i18n>\n          <child>I am projected from <b i18n-title title=\"Child of {{name}}\">{{name}}<remove-me-1></remove-me-1></b><remove-me-2></remove-me-2></child>\n          <remove-me-3></remove-me-3>\n        </div>"
                        // Translated to:
                        // <div i18n>
                        //   <child>
                        //     Je suis projeté depuis <b i18n-title title="Enfant de {{name}}">{{name}}</b>
                        //   </child>
                        // </div>
                    })
                ], Parent);
                return Parent;
            }());
            var fixture = new render_util_1.ComponentFixture(Parent);
            expect(fixture.html)
                .toEqual('<div><child><p>Je suis projeté depuis <b title="Enfant de Parent">Parent</b></p></child></div>');
        });
        it('should project a translated i18n block', function () {
            var Child = /** @class */ (function () {
                function Child() {
                }
                Child_2 = Child;
                var Child_2;
                Child.ngComponentDef = definition_1.defineComponent({
                    type: Child_2,
                    selectors: [['child']],
                    factory: function () { return new Child_2(); },
                    template: function (rf, cmp) {
                        if (rf & 1 /* Create */) {
                            instructions_1.projectionDef();
                            instructions_1.elementStart(0, 'p');
                            {
                                instructions_1.projection(1);
                            }
                            instructions_1.elementEnd();
                        }
                    }
                });
                Child = Child_2 = __decorate([
                    core_1.Component({ selector: 'child', template: '<p><ng-content></ng-content></p>' })
                ], Child);
                return Child;
            }());
            var MSG_DIV_SECTION_1 = "Je suis projet\u00E9 depuis {$EXP_1}";
            var i18n_1;
            var MSG_ATTR_1 = "Enfant de {$EXP_1}";
            var i18n_2;
            var Parent = /** @class */ (function () {
                function Parent() {
                    this.name = 'Parent';
                }
                Parent_2 = Parent;
                var Parent_2;
                Parent.ngComponentDef = definition_1.defineComponent({
                    type: Parent_2,
                    selectors: [['parent']],
                    directives: [Child],
                    factory: function () { return new Parent_2(); },
                    template: function (rf, cmp) {
                        if (rf & 1 /* Create */) {
                            if (!i18n_1) {
                                i18n_1 = i18n_4.i18nMapping(MSG_DIV_SECTION_1, null, [{ 'EXP_1': 4 }]);
                            }
                            if (!i18n_2) {
                                i18n_2 = i18n_4.i18nExpMapping(MSG_ATTR_1, { 'EXP_1': 0 });
                            }
                            instructions_1.elementStart(0, 'div');
                            {
                                instructions_1.elementStart(1, 'child');
                                {
                                    instructions_1.element(2, 'any');
                                    instructions_1.elementStart(3, 'b');
                                    {
                                        // Start of translated section 1
                                        instructions_1.text(4); // EXP_1
                                        // End of translated section 1
                                    }
                                    instructions_1.elementEnd();
                                    instructions_1.element(5, 'any');
                                }
                                instructions_1.elementEnd();
                            }
                            instructions_1.elementEnd();
                            i18n_4.i18nApply(4, i18n_1[0]);
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.elementProperty(3, 'title', i18n_4.i18nInterpolation1(i18n_2, cmp.name));
                            instructions_1.textBinding(4, instructions_1.bind(cmp.name));
                        }
                    }
                });
                Parent = Parent_2 = __decorate([
                    core_1.Component({
                        selector: 'parent',
                        template: "\n        <div>\n          <child><any></any><b i18n i18n-title title=\"Child of {{name}}\">I am projected from {{name}}</b><any></any></child>\n        </div>"
                        // Translated to:
                        // <div>
                        //   <child>
                        //     <any></any>
                        //     <b i18n i18n-title title="Enfant de {{name}}">Je suis projeté depuis {{name}}</b>
                        //     <any></any>
                        //   </child>
                        // </div>
                    })
                ], Parent);
                return Parent;
            }());
            var fixture = new render_util_1.ComponentFixture(Parent);
            expect(fixture.html)
                .toEqual('<div><child><p><any></any><b title="Enfant de Parent">Je suis projeté depuis Parent</b><any></any></p></child></div>');
        });
        it('should re-project translations when multiple projections', function () {
            var GrandChild = /** @class */ (function () {
                function GrandChild() {
                }
                GrandChild_1 = GrandChild;
                var GrandChild_1;
                GrandChild.ngComponentDef = definition_1.defineComponent({
                    type: GrandChild_1,
                    selectors: [['grand-child']],
                    factory: function () { return new GrandChild_1(); },
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
                GrandChild = GrandChild_1 = __decorate([
                    core_1.Component({ selector: 'grand-child', template: '<div><ng-content></ng-content></div>' })
                ], GrandChild);
                return GrandChild;
            }());
            var Child = /** @class */ (function () {
                function Child() {
                }
                Child_3 = Child;
                var Child_3;
                Child.ngComponentDef = definition_1.defineComponent({
                    type: Child_3,
                    selectors: [['child']],
                    directives: [GrandChild],
                    factory: function () { return new Child_3(); },
                    template: function (rf, cmp) {
                        if (rf & 1 /* Create */) {
                            instructions_1.projectionDef();
                            instructions_1.elementStart(0, 'grand-child');
                            {
                                instructions_1.projection(1);
                            }
                            instructions_1.elementEnd();
                        }
                    }
                });
                Child = Child_3 = __decorate([
                    core_1.Component({ selector: 'child', template: '<grand-child><ng-content></ng-content></grand-child>' })
                ], Child);
                return Child;
            }());
            var MSG_DIV_SECTION_1 = "{$START_B}Bonjour{$END_B} Monde!";
            var i18n_1;
            var Parent = /** @class */ (function () {
                function Parent() {
                    this.name = 'Parent';
                }
                Parent_3 = Parent;
                var Parent_3;
                Parent.ngComponentDef = definition_1.defineComponent({
                    type: Parent_3,
                    selectors: [['parent']],
                    directives: [Child],
                    factory: function () { return new Parent_3(); },
                    template: function (rf, cmp) {
                        if (rf & 1 /* Create */) {
                            if (!i18n_1) {
                                i18n_1 = i18n_4.i18nMapping(MSG_DIV_SECTION_1, [{ 'START_B': 1 }]);
                            }
                            instructions_1.elementStart(0, 'child');
                            {
                                // Start of translated section 1
                                instructions_1.element(1, 'b'); // START_B
                                // End of translated section 1
                            }
                            instructions_1.elementEnd();
                            i18n_4.i18nApply(1, i18n_1[0]);
                        }
                    }
                });
                Parent = Parent_3 = __decorate([
                    core_1.Component({
                        selector: 'parent',
                        template: "<child i18n><b>Hello</b> World!</child>"
                        // Translated to:
                        // <child i18n><grand-child><div><b>Bonjour</b> Monde!</div></grand-child></child>
                    })
                ], Parent);
                return Parent;
            }());
            var fixture = new render_util_1.ComponentFixture(Parent);
            expect(fixture.html)
                .toEqual('<child><grand-child><div><b>Bonjour</b> Monde!</div></grand-child></child>');
        });
        it('should project translations with selectors', function () {
            var Child = /** @class */ (function () {
                function Child() {
                }
                Child_4 = Child;
                var Child_4;
                Child.ngComponentDef = definition_1.defineComponent({
                    type: Child_4,
                    selectors: [['child']],
                    factory: function () { return new Child_4(); },
                    template: function (rf, cmp) {
                        if (rf & 1 /* Create */) {
                            instructions_1.projectionDef([[['span']]], ['span']);
                            instructions_1.projection(0, 1);
                        }
                    }
                });
                Child = Child_4 = __decorate([
                    core_1.Component({
                        selector: 'child',
                        template: "\n          <ng-content select=\"span\"></ng-content>\n        "
                    })
                ], Child);
                return Child;
            }());
            var MSG_DIV_SECTION_1 = "{$START_SPAN_0}Contenu{$END_SPAN_0}";
            var i18n_1;
            var Parent = /** @class */ (function () {
                function Parent() {
                }
                Parent_4 = Parent;
                var Parent_4;
                Parent.ngComponentDef = definition_1.defineComponent({
                    type: Parent_4,
                    selectors: [['parent']],
                    directives: [Child],
                    factory: function () { return new Parent_4(); },
                    template: function (rf, cmp) {
                        if (rf & 1 /* Create */) {
                            if (!i18n_1) {
                                i18n_1 = i18n_4.i18nMapping(MSG_DIV_SECTION_1, [{ 'START_SPAN_0': 1, 'START_SPAN_1': 2 }]);
                            }
                            instructions_1.elementStart(0, 'child');
                            {
                                // Start of translated section 1
                                instructions_1.element(1, 'span', ['title', 'keepMe']); // START_SPAN_0
                                instructions_1.element(2, 'span', ['title', 'deleteMe']); // START_SPAN_1
                                // End of translated section 1
                            }
                            instructions_1.elementEnd();
                            i18n_4.i18nApply(1, i18n_1[0]);
                        }
                    }
                });
                Parent = Parent_4 = __decorate([
                    core_1.Component({
                        selector: 'parent',
                        template: "\n          <child i18n>\n            <span title=\"keepMe\"></span>\n            <span title=\"deleteMe\"></span>\n          </child>\n        "
                        // Translated to:
                        // <child i18n><span title="keepMe">Contenu</span></child>
                    })
                ], Parent);
                return Parent;
            }());
            var fixture = new render_util_1.ComponentFixture(Parent);
            expect(fixture.html).toEqual('<child><span title="keepMe">Contenu</span></child>');
        });
    });
    describe('i18nInterpolation', function () {
        it('i18nInterpolation should return the same value as i18nInterpolationV', function () {
            var MSG_DIV_SECTION_1 = "start {$EXP_2} middle {$EXP_1} end";
            var i18n_1 = i18n_4.i18nExpMapping(MSG_DIV_SECTION_1, { 'EXP_1': 0, 'EXP_2': 1 });
            var interpolation;
            var interpolationV;
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.exp1 = '1';
                    this.exp2 = '2';
                }
                MyApp.ngComponentDef = definition_1.defineComponent({
                    type: MyApp,
                    factory: function () { return new MyApp(); },
                    selectors: [['my-app']],
                    // Initial template:
                    // <div i18n i18n-title title="{{exp1}}{{exp2}}"></div>
                    // Translated to:
                    // <div i18n i18n-title title="start {{exp2}} middle {{exp1}} end"></div>
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.element(0, 'div'); // translated section 1
                        }
                        if (rf & 2 /* Update */) {
                            interpolation = i18n_4.i18nInterpolation2(i18n_1, ctx.exp1, ctx.exp2);
                            interpolationV = i18n_4.i18nInterpolationV(i18n_1, [ctx.exp1, ctx.exp2]);
                            instructions_1.elementProperty(0, 'title', interpolation);
                        }
                    }
                });
                return MyApp;
            }());
            var fixture = new render_util_1.ComponentFixture(MyApp);
            expect(interpolation).toBeDefined();
            expect(interpolation).toEqual(interpolationV);
        });
        it('i18nInterpolation3 should work', function () {
            var MSG_DIV_SECTION_1 = "start {$EXP_1} _ {$EXP_2} _ {$EXP_3} end";
            var i18n_1 = i18n_4.i18nExpMapping(MSG_DIV_SECTION_1, { 'EXP_1': 0, 'EXP_2': 1, 'EXP_3': 2 });
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.exp1 = '1';
                    this.exp2 = '2';
                    this.exp3 = '3';
                }
                MyApp.ngComponentDef = definition_1.defineComponent({
                    type: MyApp,
                    factory: function () { return new MyApp(); },
                    selectors: [['my-app']],
                    // Initial template:
                    // <div i18n i18n-title title="{{exp1}}{{exp2}}{{exp3}}"></div>
                    // Translated to:
                    // <div i18n i18n-title title="start {{exp1}} _ {{exp2}} _ {{exp3}} end"></div>
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.element(0, 'div'); // translated section 1
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.elementProperty(0, 'title', i18n_4.i18nInterpolation3(i18n_1, ctx.exp1, ctx.exp2, ctx.exp3));
                        }
                    }
                });
                return MyApp;
            }());
            var fixture = new render_util_1.ComponentFixture(MyApp);
            expect(fixture.html).toEqual('<div title="start 1 _ 2 _ 3 end"></div>');
        });
        it('i18nInterpolation4 should work', function () {
            var MSG_DIV_SECTION_1 = "start {$EXP_1} _ {$EXP_2} _ {$EXP_3} _ {$EXP_4} end";
            var i18n_1 = i18n_4.i18nExpMapping(MSG_DIV_SECTION_1, { 'EXP_1': 0, 'EXP_2': 1, 'EXP_3': 2, 'EXP_4': 3 });
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.exp1 = '1';
                    this.exp2 = '2';
                    this.exp3 = '3';
                    this.exp4 = '4';
                }
                MyApp.ngComponentDef = definition_1.defineComponent({
                    type: MyApp,
                    factory: function () { return new MyApp(); },
                    selectors: [['my-app']],
                    // Initial template:
                    // <div i18n i18n-title title="{{exp1}}{{exp2}}{{exp3}}{{exp4}}"></div>
                    // Translated to:
                    // <div i18n i18n-title title="start {{exp1}} _ {{exp2}} _ {{exp3}} _ {{exp4}} end"></div>
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.element(0, 'div'); // translated section 1
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.elementProperty(0, 'title', i18n_4.i18nInterpolation4(i18n_1, ctx.exp1, ctx.exp2, ctx.exp3, ctx.exp4));
                        }
                    }
                });
                return MyApp;
            }());
            var fixture = new render_util_1.ComponentFixture(MyApp);
            expect(fixture.html).toEqual('<div title="start 1 _ 2 _ 3 _ 4 end"></div>');
        });
        it('i18nInterpolation5 should work', function () {
            var MSG_DIV_SECTION_1 = "start {$EXP_1} _ {$EXP_2} _ {$EXP_3} _ {$EXP_4} _ {$EXP_5} end";
            var i18n_1 = i18n_4.i18nExpMapping(MSG_DIV_SECTION_1, { 'EXP_1': 0, 'EXP_2': 1, 'EXP_3': 2, 'EXP_4': 3, 'EXP_5': 4 });
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.exp1 = '1';
                    this.exp2 = '2';
                    this.exp3 = '3';
                    this.exp4 = '4';
                    this.exp5 = '5';
                }
                MyApp.ngComponentDef = definition_1.defineComponent({
                    type: MyApp,
                    factory: function () { return new MyApp(); },
                    selectors: [['my-app']],
                    // Initial template:
                    // <div i18n i18n-title title="{{exp1}}{{exp2}}{{exp3}}{{exp4}}{{exp5}}"></div>
                    // Translated to:
                    // <div i18n i18n-title title="start {{exp1}} _ {{exp2}} _ {{exp3}} _ {{exp4}} _ {{exp5}}
                    // end"></div>
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.element(0, 'div'); // translated section 1
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.elementProperty(0, 'title', i18n_4.i18nInterpolation5(i18n_1, ctx.exp1, ctx.exp2, ctx.exp3, ctx.exp4, ctx.exp5));
                        }
                    }
                });
                return MyApp;
            }());
            var fixture = new render_util_1.ComponentFixture(MyApp);
            expect(fixture.html).toEqual('<div title="start 1 _ 2 _ 3 _ 4 _ 5 end"></div>');
        });
        it('i18nInterpolation6 should work', function () {
            var MSG_DIV_SECTION_1 = "start {$EXP_1} _ {$EXP_2} _ {$EXP_3} _ {$EXP_4} _ {$EXP_5} _ {$EXP_6} end";
            var i18n_1 = i18n_4.i18nExpMapping(MSG_DIV_SECTION_1, { 'EXP_1': 0, 'EXP_2': 1, 'EXP_3': 2, 'EXP_4': 3, 'EXP_5': 4, 'EXP_6': 5 });
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.exp1 = '1';
                    this.exp2 = '2';
                    this.exp3 = '3';
                    this.exp4 = '4';
                    this.exp5 = '5';
                    this.exp6 = '6';
                }
                MyApp.ngComponentDef = definition_1.defineComponent({
                    type: MyApp,
                    factory: function () { return new MyApp(); },
                    selectors: [['my-app']],
                    // Initial template:
                    // <div i18n i18n-title title="{{exp1}}{{exp2}}{{exp3}}{{exp4}}{{exp5}}{{exp6}}"></div>
                    // Translated to:
                    // <div i18n i18n-title title="start {{exp1}} _ {{exp2}} _ {{exp3}} _ {{exp4}} _ {{exp5}}
                    // _ {{exp6}} end"></div>
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.element(0, 'div'); // translated section 1
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.elementProperty(0, 'title', i18n_4.i18nInterpolation6(i18n_1, ctx.exp1, ctx.exp2, ctx.exp3, ctx.exp4, ctx.exp5, ctx.exp6));
                        }
                    }
                });
                return MyApp;
            }());
            var fixture = new render_util_1.ComponentFixture(MyApp);
            expect(fixture.html).toEqual('<div title="start 1 _ 2 _ 3 _ 4 _ 5 _ 6 end"></div>');
        });
        it('i18nInterpolation7 should work', function () {
            var MSG_DIV_SECTION_1 = "start {$EXP_1} _ {$EXP_2} _ {$EXP_3} _ {$EXP_4} _ {$EXP_5} _ {$EXP_6} _ {$EXP_7} end";
            var i18n_1 = i18n_4.i18nExpMapping(MSG_DIV_SECTION_1, { 'EXP_1': 0, 'EXP_2': 1, 'EXP_3': 2, 'EXP_4': 3, 'EXP_5': 4, 'EXP_6': 5, 'EXP_7': 6 });
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.exp1 = '1';
                    this.exp2 = '2';
                    this.exp3 = '3';
                    this.exp4 = '4';
                    this.exp5 = '5';
                    this.exp6 = '6';
                    this.exp7 = '7';
                }
                MyApp.ngComponentDef = definition_1.defineComponent({
                    type: MyApp,
                    factory: function () { return new MyApp(); },
                    selectors: [['my-app']],
                    // Initial template:
                    // <div i18n i18n-title
                    // title="{{exp1}}{{exp2}}{{exp3}}{{exp4}}{{exp5}}{{exp6}}{{exp7}}"></div>
                    // Translated to:
                    // <div i18n i18n-title title="start {{exp1}} _ {{exp2}} _ {{exp3}} _ {{exp4}} _ {{exp5}}
                    // _ {{exp6}} _ {{exp7}} end"></div>
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.element(0, 'div'); // translated section 1
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.elementProperty(0, 'title', i18n_4.i18nInterpolation7(i18n_1, ctx.exp1, ctx.exp2, ctx.exp3, ctx.exp4, ctx.exp5, ctx.exp6, ctx.exp7));
                        }
                    }
                });
                return MyApp;
            }());
            var fixture = new render_util_1.ComponentFixture(MyApp);
            expect(fixture.html).toEqual('<div title="start 1 _ 2 _ 3 _ 4 _ 5 _ 6 _ 7 end"></div>');
        });
        it('i18nInterpolation8 should work', function () {
            var MSG_DIV_SECTION_1 = "start {$EXP_1} _ {$EXP_2} _ {$EXP_3} _ {$EXP_4} _ {$EXP_5} _ {$EXP_6} _ {$EXP_7} _ {$EXP_8} end";
            var i18n_1 = i18n_4.i18nExpMapping(MSG_DIV_SECTION_1, {
                'EXP_1': 0,
                'EXP_2': 1,
                'EXP_3': 2,
                'EXP_4': 3,
                'EXP_5': 4,
                'EXP_6': 5,
                'EXP_7': 6,
                'EXP_8': 7
            });
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.exp1 = '1';
                    this.exp2 = '2';
                    this.exp3 = '3';
                    this.exp4 = '4';
                    this.exp5 = '5';
                    this.exp6 = '6';
                    this.exp7 = '7';
                    this.exp8 = '8';
                }
                MyApp.ngComponentDef = definition_1.defineComponent({
                    type: MyApp,
                    factory: function () { return new MyApp(); },
                    selectors: [['my-app']],
                    // Initial template:
                    // <div i18n i18n-title
                    // title="{{exp1}}{{exp2}}{{exp3}}{{exp4}}{{exp5}}{{exp6}}{{exp7}}{{exp8}}"></div>
                    // Translated to:
                    // <div i18n i18n-title title="start {{exp1}} _ {{exp2}} _ {{exp3}} _ {{exp4}} _ {{exp5}}
                    // _ {{exp6}} _ {{exp7}} _ {{exp8}} end"></div>
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.element(0, 'div'); // translated section 1
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.elementProperty(0, 'title', i18n_4.i18nInterpolation8(i18n_1, ctx.exp1, ctx.exp2, ctx.exp3, ctx.exp4, ctx.exp5, ctx.exp6, ctx.exp7, ctx.exp8));
                        }
                    }
                });
                return MyApp;
            }());
            var fixture = new render_util_1.ComponentFixture(MyApp);
            expect(fixture.html).toEqual('<div title="start 1 _ 2 _ 3 _ 4 _ 5 _ 6 _ 7 _ 8 end"></div>');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3JlbmRlcjMvaTE4bl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBR0gsdUNBQXlDO0FBQ3pDLDJEQUE2RDtBQUM3RCwrQ0FBdVM7QUFDdlMsK0RBQWlQO0FBRWpQLHFEQUEwQztBQUMxQyw2Q0FBZ0U7QUFFaEUsUUFBUSxDQUFDLGNBQWMsRUFBRTtJQUN2QixFQUFFLENBQUMsOEJBQThCLEVBQUU7UUFDakMsMENBQTBDO1FBQzFDLDZFQUE2RTtRQUM3RSxJQUFNLGlCQUFpQixHQUNuQiwwRUFBMEUsQ0FBQztRQUMvRSxJQUFJLE1BQTJCLENBQUM7UUFDaEMsb0JBQW9CO1FBQ3BCLGFBQWE7UUFDYixPQUFPO1FBQ1AsYUFBYTtRQUNiLDZCQUE2QjtRQUM3QixRQUFRO1FBQ1IsV0FBVztRQUNYLFNBQVM7UUFFVCxpQkFBaUI7UUFDakIsYUFBYTtRQUNiLGlCQUFpQjtRQUNqQixPQUFPO1FBQ1AsWUFBWTtRQUNaLG1CQUFtQjtRQUNuQixRQUFRO1FBQ1IsU0FBUztRQUNUO1lBQ0UsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDWCxNQUFNLEdBQUcsa0JBQVcsQ0FDaEIsaUJBQWlCLEVBQUUsQ0FBQyxFQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxpQkFBaUIsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQzthQUM1RjtZQUVELDJCQUFZLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3ZCLEVBQUcsZ0NBQWdDO2dCQUNqQyx3REFBd0Q7Z0JBQ3hELDJCQUFZLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUUsVUFBVTtnQkFDakM7b0JBQ0Usc0JBQU8sQ0FBQyxDQUFDLEVB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