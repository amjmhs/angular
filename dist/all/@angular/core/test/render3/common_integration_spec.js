"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var di_1 = require("../../src/render3/di");
var index_1 = require("../../src/render3/index");
var instructions_1 = require("../../src/render3/instructions");
var common_with_def_1 = require("./common_with_def");
var render_util_1 = require("./render_util");
describe('@angular/common integration', function () {
    describe('NgForOf', function () {
        it('should update a loop', function () {
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.items = ['first', 'second'];
                }
                MyApp.ngComponentDef = index_1.defineComponent({
                    type: MyApp,
                    factory: function () { return new MyApp(); },
                    selectors: [['my-app']],
                    // <ul>
                    //   <li *ngFor="let item of items">{{item}}</li>
                    // </ul>
                    template: function (rf, myApp) {
                        if (rf & 1 /* Create */) {
                            instructions_1.elementStart(0, 'ul');
                            {
                                instructions_1.container(1, liTemplate, undefined, ['ngForOf', '']);
                            }
                            instructions_1.elementEnd();
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.elementProperty(1, 'ngForOf', instructions_1.bind(myApp.items));
                        }
                        function liTemplate(rf1, row) {
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'li');
                                {
                                    instructions_1.text(1);
                                }
                                instructions_1.elementEnd();
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
            expect(fixture.html).toEqual('<ul><li>first</li><li>second</li></ul>');
            // change detection cycle, no model changes
            fixture.update();
            expect(fixture.html).toEqual('<ul><li>first</li><li>second</li></ul>');
            // remove the last item
            fixture.component.items.length = 1;
            fixture.update();
            expect(fixture.html).toEqual('<ul><li>first</li></ul>');
            // change an item
            fixture.component.items[0] = 'one';
            fixture.update();
            expect(fixture.html).toEqual('<ul><li>one</li></ul>');
            // add an item
            fixture.component.items.push('two');
            fixture.update();
            expect(fixture.html).toEqual('<ul><li>one</li><li>two</li></ul>');
        });
        it('should support ngForOf context variables', function () {
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.items = ['first', 'second'];
                }
                MyApp.ngComponentDef = index_1.defineComponent({
                    type: MyApp,
                    factory: function () { return new MyApp(); },
                    selectors: [['my-app']],
                    // <ul>
                    //   <li *ngFor="let item of items">{{index}} of {{count}}: {{item}}</li>
                    // </ul>
                    template: function (rf, myApp) {
                        if (rf & 1 /* Create */) {
                            instructions_1.elementStart(0, 'ul');
                            {
                                instructions_1.container(1, liTemplate, undefined, ['ngForOf', '']);
                            }
                            instructions_1.elementEnd();
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.elementProperty(1, 'ngForOf', instructions_1.bind(myApp.items));
                        }
                        function liTemplate(rf1, row) {
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'li');
                                {
                                    instructions_1.text(1);
                                }
                                instructions_1.elementEnd();
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.textBinding(1, instructions_1.interpolation3('', row.index, ' of ', row.count, ': ', row.$implicit, ''));
                            }
                        }
                    },
                    directives: function () { return [common_with_def_1.NgForOf]; }
                });
                return MyApp;
            }());
            var fixture = new render_util_1.ComponentFixture(MyApp);
            expect(fixture.html).toEqual('<ul><li>0 of 2: first</li><li>1 of 2: second</li></ul>');
            fixture.component.items.splice(1, 0, 'middle');
            fixture.update();
            expect(fixture.html)
                .toEqual('<ul><li>0 of 3: first</li><li>1 of 3: middle</li><li>2 of 3: second</li></ul>');
        });
        it('should retain parent view listeners when the NgFor destroy views', function () {
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this._data = [1, 2, 3];
                    this.items = [];
                }
                MyApp.prototype.toggle = function () {
                    if (this.items.length) {
                        this.items = [];
                    }
                    else {
                        this.items = this._data;
                    }
                };
                MyApp.ngComponentDef = index_1.defineComponent({
                    type: MyApp,
                    factory: function () { return new MyApp(); },
                    selectors: [['my-app']],
                    // <button (click)="toggle()">Toggle List</button>
                    // <ul>
                    //   <li *ngFor="let item of items">{{index}}</li>
                    // </ul>
                    template: function (rf, myApp) {
                        if (rf & 1 /* Create */) {
                            instructions_1.elementStart(0, 'button');
                            {
                                instructions_1.listener('click', function () { return myApp.toggle(); });
                                instructions_1.text(1, 'Toggle List');
                            }
                            instructions_1.elementEnd();
                            instructions_1.elementStart(2, 'ul');
                            {
                                instructions_1.container(3, liTemplate, undefined, ['ngForOf', '']);
                            }
                            instructions_1.elementEnd();
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.elementProperty(3, 'ngForOf', instructions_1.bind(myApp.items));
                        }
                        function liTemplate(rf1, row) {
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'li');
                                {
                                    instructions_1.text(1);
                                }
                                instructions_1.elementEnd();
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.textBinding(1, instructions_1.interpolation1('', row.$implicit, ''));
                            }
                        }
                    },
                    directives: function () { return [common_with_def_1.NgForOf]; }
                });
                return MyApp;
            }());
            var fixture = new render_util_1.ComponentFixture(MyApp);
            var button = fixture.hostElement.querySelector('button');
            expect(fixture.html).toEqual('<button>Toggle List</button><ul></ul>');
            // this will fill the list
            fixture.component.toggle();
            fixture.update();
            expect(fixture.html)
                .toEqual('<button>Toggle List</button><ul><li>1</li><li>2</li><li>3</li></ul>');
            button.click();
            fixture.update();
            expect(fixture.html).toEqual('<button>Toggle List</button><ul></ul>');
            button.click();
            fixture.update();
            expect(fixture.html)
                .toEqual('<button>Toggle List</button><ul><li>1</li><li>2</li><li>3</li></ul>');
        });
        it('should support multiple levels of embedded templates', function () {
            /**
             * <ul *ngFor="let outterItem of items.">
             *   <li *ngFor="let item of items">
             *      <span>{{item}}</span>
             *   </li>
             * </ul>
             */
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.items = ['1', '2'];
                }
                MyApp.ngComponentDef = index_1.defineComponent({
                    type: MyApp,
                    factory: function () { return new MyApp(); },
                    selectors: [['my-app']],
                    template: function (rf, myApp) {
                        if (rf & 1 /* Create */) {
                            instructions_1.elementStart(0, 'ul');
                            {
                                instructions_1.container(1, liTemplate, null, ['ngForOf', '']);
                            }
                            instructions_1.elementEnd();
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.elementProperty(1, 'ngForOf', instructions_1.bind(myApp.items));
                        }
                        function liTemplate(rf1, row) {
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'li');
                                {
                                    instructions_1.container(1, spanTemplate, null, ['ngForOf', '']);
                                }
                                instructions_1.elementEnd();
                            }
                            if (rf1 & 2 /* Update */) {
                                instructions_1.elementProperty(1, 'ngForOf', instructions_1.bind(myApp.items));
                            }
                        }
                        function spanTemplate(rf1, row) {
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'span');
                                {
                                    instructions_1.text(1);
                                }
                                instructions_1.elementEnd();
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
            // Change detection cycle, no model changes
            fixture.update();
            expect(fixture.html)
                .toEqual('<ul><li><span>1</span><span>2</span></li><li><span>1</span><span>2</span></li></ul>');
            // Remove the last item
            fixture.component.items.length = 1;
            fixture.update();
            expect(fixture.html).toEqual('<ul><li><span>1</span></li></ul>');
            // Change an item
            fixture.component.items[0] = 'one';
            fixture.update();
            expect(fixture.html).toEqual('<ul><li><span>one</span></li></ul>');
            // Add an item
            fixture.component.items.push('two');
            fixture.update();
            expect(fixture.html)
                .toEqual('<ul><li><span>one</span><span>two</span></li><li><span>one</span><span>two</span></li></ul>');
        });
    });
    describe('ngIf', function () {
        it('should support sibling ngIfs', function () {
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.showing = true;
                    this.valueOne = 'one';
                    this.valueTwo = 'two';
                }
                MyApp.ngComponentDef = index_1.defineComponent({
                    type: MyApp,
                    factory: function () { return new MyApp(); },
                    selectors: [['my-app']],
                    /**
                     * <div *ngIf="showing">{{ valueOne }}</div>
                     * <div *ngIf="showing">{{ valueTwo }}</div>
                     */
                    template: function (rf, myApp) {
                        if (rf & 1 /* Create */) {
                            instructions_1.container(0, templateOne, undefined, ['ngIf', '']);
                            instructions_1.container(1, templateTwo, undefined, ['ngIf', '']);
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.elementProperty(0, 'ngIf', instructions_1.bind(myApp.showing));
                            instructions_1.elementProperty(1, 'ngIf', instructions_1.bind(myApp.showing));
                        }
                        function templateOne(rf, ctx) {
                            if (rf & 1 /* Create */) {
                                instructions_1.elementStart(0, 'div');
                                {
                                    instructions_1.text(1);
                                }
                                instructions_1.elementEnd();
                            }
                            if (rf & 2 /* Update */) {
                                instructions_1.textBinding(1, instructions_1.bind(myApp.valueOne));
                            }
                        }
                        function templateTwo(rf, ctx) {
                            if (rf & 1 /* Create */) {
                                instructions_1.elementStart(0, 'div');
                                {
                                    instructions_1.text(1);
                                }
                                instructions_1.elementEnd();
                            }
                            if (rf & 2 /* Update */) {
                                instructions_1.textBinding(1, instructions_1.bind(myApp.valueTwo));
                            }
                        }
                    },
                    directives: function () { return [common_with_def_1.NgIf]; }
                });
                return MyApp;
            }());
            var fixture = new render_util_1.ComponentFixture(MyApp);
            expect(fixture.html).toEqual('<div>one</div><div>two</div>');
            fixture.component.valueOne = '$$one$$';
            fixture.component.valueTwo = '$$two$$';
            fixture.update();
            expect(fixture.html).toEqual('<div>$$one$$</div><div>$$two$$</div>');
        });
    });
    describe('NgTemplateOutlet', function () {
        it('should create and remove embedded views', function () {
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.showing = false;
                }
                MyApp.ngComponentDef = index_1.defineComponent({
                    type: MyApp,
                    factory: function () { return new MyApp(); },
                    selectors: [['my-app']],
                    /**
                     * <ng-template #tpl>from tpl</ng-template>
                     * <ng-template [ngTemplateOutlet]="showing ? tpl : null"></ng-template>
                     */
                    template: function (rf, myApp) {
                        if (rf & 1 /* Create */) {
                            instructions_1.container(0, function (rf1) {
                                if (rf1 & 1 /* Create */) {
                                    instructions_1.text(0, 'from tpl');
                                }
                            }, undefined, undefined, ['tpl', '']);
                            instructions_1.container(2, undefined, null, [1 /* SelectOnly */, 'ngTemplateOutlet']);
                        }
                        if (rf & 2 /* Update */) {
                            var tplRef = di_1.getOrCreateTemplateRef(di_1.getOrCreateNodeInjectorForNode(instructions_1.load(0)));
                            instructions_1.elementProperty(2, 'ngTemplateOutlet', instructions_1.bind(myApp.showing ? tplRef : null));
                        }
                    },
                    directives: function () { return [common_with_def_1.NgTemplateOutlet]; }
                });
                return MyApp;
            }());
            var fixture = new render_util_1.ComponentFixture(MyApp);
            expect(fixture.html).toEqual('');
            fixture.component.showing = true;
            fixture.update();
            expect(fixture.html).toEqual('from tpl');
            fixture.component.showing = false;
            fixture.update();
            expect(fixture.html).toEqual('');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uX2ludGVncmF0aW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVuZGVyMy9jb21tb25faW50ZWdyYXRpb25fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUlILDJDQUE0RjtBQUM1RixpREFBeUU7QUFDekUsK0RBQTZLO0FBRzdLLHFEQUFrRTtBQUNsRSw2Q0FBK0M7QUFFL0MsUUFBUSxDQUFDLDZCQUE2QixFQUFFO0lBRXRDLFFBQVEsQ0FBQyxTQUFTLEVBQUU7UUFDbEIsRUFBRSxDQUFDLHNCQUFzQixFQUFFO1lBQ3pCO2dCQUFBO29CQUNFLFVBQUssR0FBYSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFnQ3hDLENBQUM7Z0JBOUJRLG9CQUFjLEdBQUcsdUJBQWUsQ0FBQztvQkFDdEMsSUFBSSxFQUFFLEtBQUs7b0JBQ1gsT0FBTyxFQUFFLGNBQU0sT0FBQSxJQUFJLEtBQUssRUFBRSxFQUFYLENBQVc7b0JBQzFCLFNBQVMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3ZCLE9BQU87b0JBQ1AsaURBQWlEO29CQUNqRCxRQUFRO29CQUNSLFFBQVEsRUFBRSxVQUFDLEVBQWUsRUFBRSxLQUFZO3dCQUN0QyxJQUFJLEVBQUUsaUJBQXFCLEVBQUU7NEJBQzNCLDJCQUFZLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDOzRCQUN0QjtnQ0FBRSx3QkFBUyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7NkJBQUU7NEJBQ3pELHlCQUFVLEVBQUUsQ0FBQzt5QkFDZDt3QkFDRCxJQUFJLEVBQUUsaUJBQXFCLEVBQUU7NEJBQzNCLDhCQUFlLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxtQkFBSSxDQUFDLEtB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