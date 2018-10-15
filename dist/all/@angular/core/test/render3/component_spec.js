"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("../../src/core");
var component_1 = require("../../src/render3/component");
var index_1 = require("../../src/render3/index");
var instructions_1 = require("../../src/render3/instructions");
var index_2 = require("../../src/view/index");
var imported_renderer2_1 = require("./imported_renderer2");
var render_util_1 = require("./render_util");
describe('component', function () {
    var CounterComponent = /** @class */ (function () {
        function CounterComponent() {
            this.count = 0;
        }
        CounterComponent.prototype.increment = function () { this.count++; };
        CounterComponent.ngComponentDef = index_1.defineComponent({
            type: CounterComponent,
            selectors: [['counter']],
            template: function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.text(0);
                }
                if (rf & 2 /* Update */) {
                    instructions_1.textBinding(0, instructions_1.bind(ctx.count));
                }
            },
            factory: function () { return new CounterComponent; },
            inputs: { count: 'count' },
        });
        return CounterComponent;
    }());
    describe('renderComponent', function () {
        it('should render on initial call', function () {
            render_util_1.renderComponent(CounterComponent);
            expect(render_util_1.toHtml(render_util_1.containerEl)).toEqual('0');
        });
        it('should re-render on input change or method invocation', function () {
            var component = render_util_1.renderComponent(CounterComponent);
            expect(render_util_1.toHtml(render_util_1.containerEl)).toEqual('0');
            component.count = 123;
            index_1.markDirty(component);
            expect(render_util_1.toHtml(render_util_1.containerEl)).toEqual('0');
            render_util_1.requestAnimationFrame.flush();
            expect(render_util_1.toHtml(render_util_1.containerEl)).toEqual('123');
            component.increment();
            index_1.markDirty(component);
            expect(render_util_1.toHtml(render_util_1.containerEl)).toEqual('123');
            render_util_1.requestAnimationFrame.flush();
            expect(render_util_1.toHtml(render_util_1.containerEl)).toEqual('124');
        });
        var MyService = /** @class */ (function () {
            function MyService(value) {
                this.value = value;
            }
            MyService.ngInjectableDef = core_1.defineInjectable({ providedIn: 'root', factory: function () { return new MyService('no-injector'); } });
            return MyService;
        }());
        var MyComponent = /** @class */ (function () {
            function MyComponent(myService) {
                this.myService = myService;
            }
            MyComponent.ngComponentDef = index_1.defineComponent({
                type: MyComponent,
                selectors: [['my-component']],
                factory: function () { return new MyComponent(index_1.directiveInject(MyService)); },
                template: function (fs, ctx) {
                    if (fs & 1 /* Create */) {
                        instructions_1.text(0);
                    }
                    if (fs & 2 /* Update */) {
                        instructions_1.textBinding(0, instructions_1.bind(ctx.myService.value));
                    }
                }
            });
            return MyComponent;
        }());
        var MyModule = /** @class */ (function () {
            function MyModule() {
            }
            MyModule.ngInjectorDef = core_1.defineInjector({
                factory: function () { return new MyModule(); },
                providers: [{ provide: MyService, useValue: new MyService('injector') }]
            });
            return MyModule;
        }());
        it('should support bootstrapping without injector', function () {
            var fixture = new render_util_1.ComponentFixture(MyComponent);
            expect(fixture.html).toEqual('no-injector');
        });
        it('should support bootstrapping with injector', function () {
            var fixture = new render_util_1.ComponentFixture(MyComponent, { injector: core_1.createInjector(MyModule) });
            expect(fixture.html).toEqual('injector');
        });
    });
});
describe('component with a container', function () {
    function showItems(rf, ctx) {
        if (rf & 1 /* Create */) {
            instructions_1.container(0);
        }
        if (rf & 2 /* Update */) {
            instructions_1.containerRefreshStart(0);
            {
                for (var _i = 0, _a = ctx.items; _i < _a.length; _i++) {
                    var item = _a[_i];
                    var rf0 = instructions_1.embeddedViewStart(0);
                    {
                        if (rf0 & 1 /* Create */) {
                            instructions_1.text(0);
                        }
                        if (rf0 & 2 /* Update */) {
                            instructions_1.textBinding(0, instructions_1.bind(item));
                        }
                    }
                    instructions_1.embeddedViewEnd();
                }
            }
            instructions_1.containerRefreshEnd();
        }
    }
    var WrapperComponent = /** @class */ (function () {
        function WrapperComponent() {
        }
        WrapperComponent.ngComponentDef = index_1.defineComponent({
            type: WrapperComponent,
            selectors: [['wrapper']],
            template: function ChildComponentTemplate(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.container(0);
                }
                if (rf & 2 /* Update */) {
                    instructions_1.containerRefreshStart(0);
                    {
                        var rf0 = instructions_1.embeddedViewStart(0);
                        {
                            showItems(rf0, { items: ctx.items });
                        }
                        instructions_1.embeddedViewEnd();
                    }
                    instructions_1.containerRefreshEnd();
                }
            },
            factory: function () { return new WrapperComponent; },
            inputs: { items: 'items' }
        });
        return WrapperComponent;
    }());
    function template(rf, ctx) {
        if (rf & 1 /* Create */) {
            instructions_1.elementStart(0, 'wrapper');
            instructions_1.elementEnd();
        }
        if (rf & 2 /* Update */) {
            instructions_1.elementProperty(0, 'items', instructions_1.bind(ctx.items));
        }
    }
    var defs = [WrapperComponent];
    it('should re-render on input change', function () {
        var ctx = { items: ['a'] };
        expect(render_util_1.renderToHtml(template, ctx, defs)).toEqual('<wrapper>a</wrapper>');
        ctx.items = ctx.items.concat(['b']);
        expect(render_util_1.renderToHtml(template, ctx, defs)).toEqual('<wrapper>ab</wrapper>');
    });
});
// TODO: add tests with Native once tests are run in real browser (domino doesn't support shadow
// root)
describe('encapsulation', function () {
    var WrapperComponent = /** @class */ (function () {
        function WrapperComponent() {
        }
        WrapperComponent.ngComponentDef = index_1.defineComponent({
            type: WrapperComponent,
            selectors: [['wrapper']],
            template: function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'encapsulated');
                    instructions_1.elementEnd();
                }
            },
            factory: function () { return new WrapperComponent; },
            directives: function () { return [EncapsulatedComponent]; }
        });
        return WrapperComponent;
    }());
    var EncapsulatedComponent = /** @class */ (function () {
        function EncapsulatedComponent() {
        }
        EncapsulatedComponent.ngComponentDef = index_1.defineComponent({
            type: EncapsulatedComponent,
            selectors: [['encapsulated']],
            template: function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.text(0, 'foo');
                    instructions_1.elementStart(1, 'leaf');
                    instructions_1.elementEnd();
                }
            },
            factory: function () { return new EncapsulatedComponent; },
            rendererType: index_2.createRendererType2({ encapsulation: core_1.ViewEncapsulation.Emulated, styles: [], data: {} }),
            directives: function () { return [LeafComponent]; }
        });
        return EncapsulatedComponent;
    }());
    var LeafComponent = /** @class */ (function () {
        function LeafComponent() {
        }
        LeafComponent.ngComponentDef = index_1.defineComponent({
            type: LeafComponent,
            selectors: [['leaf']],
            template: function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'span');
                    {
                        instructions_1.text(1, 'bar');
                    }
                    instructions_1.elementEnd();
                }
            },
            factory: function () { return new LeafComponent; },
        });
        return LeafComponent;
    }());
    it('should encapsulate children, but not host nor grand children', function () {
        render_util_1.renderComponent(WrapperComponent, { rendererFactory: imported_renderer2_1.getRendererFactory2(document) });
        expect(render_util_1.containerEl.outerHTML)
            .toMatch(/<div host=""><encapsulated _nghost-c(\d+)="">foo<leaf _ngcontent-c\1=""><span>bar<\/span><\/leaf><\/encapsulated><\/div>/);
    });
    it('should encapsulate host', function () {
        render_util_1.renderComponent(EncapsulatedComponent, { rendererFactory: imported_renderer2_1.getRendererFactory2(document) });
        expect(render_util_1.containerEl.outerHTML)
            .toMatch(/<div host="" _nghost-c(\d+)="">foo<leaf _ngcontent-c\1=""><span>bar<\/span><\/leaf><\/div>/);
    });
    it('should encapsulate host and children with different attributes', function () {
        var WrapperComponentWith = /** @class */ (function () {
            function WrapperComponentWith() {
            }
            WrapperComponentWith.ngComponentDef = index_1.defineComponent({
                type: WrapperComponentWith,
                selectors: [['wrapper']],
                template: function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'leaf');
                        instructions_1.elementEnd();
                    }
                },
                factory: function () { return new WrapperComponentWith; },
                rendererType: index_2.createRendererType2({ encapsulation: core_1.ViewEncapsulation.Emulated, styles: [], data: {} }),
                directives: function () { return [LeafComponentwith]; }
            });
            return WrapperComponentWith;
        }());
        var LeafComponentwith = /** @class */ (function () {
            function LeafComponentwith() {
            }
            LeafComponentwith.ngComponentDef = index_1.defineComponent({
                type: LeafComponentwith,
                selectors: [['leaf']],
                template: function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'span');
                        {
                            instructions_1.text(1, 'bar');
                        }
                        instructions_1.elementEnd();
                    }
                },
                factory: function () { return new LeafComponentwith; },
                rendererType: index_2.createRendererType2({ encapsulation: core_1.ViewEncapsulation.Emulated, styles: [], data: {} }),
            });
            return LeafComponentwith;
        }());
        render_util_1.renderComponent(WrapperComponentWith, { rendererFactory: imported_renderer2_1.getRendererFactory2(document) });
        expect(render_util_1.containerEl.outerHTML)
            .toMatch(/<div host="" _nghost-c(\d+)=""><leaf _ngcontent-c\1="" _nghost-c(\d+)=""><span _ngcontent-c\2="">bar<\/span><\/leaf><\/div>/);
    });
});
describe('recursive components', function () {
    var events = [];
    var count = 0;
    var TreeNode = /** @class */ (function () {
        function TreeNode(value, depth, left, right) {
            this.value = value;
            this.depth = depth;
            this.left = left;
            this.right = right;
        }
        return TreeNode;
    }());
    var TreeComponent = /** @class */ (function () {
        function TreeComponent() {
            this.data = _buildTree(0);
        }
        TreeComponent.prototype.ngDoCheck = function () { events.push('check' + this.data.value); };
        TreeComponent.ngComponentDef = index_1.defineComponent({
            type: TreeComponent,
            selectors: [['tree-comp']],
            factory: function () { return new TreeComponent(); },
            template: function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.text(0);
                    instructions_1.container(1);
                    instructions_1.container(2);
                }
                if (rf & 2 /* Update */) {
                    instructions_1.textBinding(0, instructions_1.bind(ctx.data.value));
                    instructions_1.containerRefreshStart(1);
                    {
                        if (ctx.data.left != null) {
                            var rf0 = instructions_1.embeddedViewStart(0);
                            if (rf0 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'tree-comp');
                                instructions_1.elementEnd();
                            }
                            if (rf0 & 2 /* Update */) {
                                instructions_1.elementProperty(0, 'data', instructions_1.bind(ctx.data.left));
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                    instructions_1.containerRefreshStart(2);
                    {
                        if (ctx.data.right != null) {
                            var rf0 = instructions_1.embeddedViewStart(0);
                            if (rf0 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'tree-comp');
                                instructions_1.elementEnd();
                            }
                            if (rf0 & 2 /* Update */) {
                                instructions_1.elementProperty(0, 'data', instructions_1.bind(ctx.data.right));
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            },
            inputs: { data: 'data' }
        });
        return TreeComponent;
    }());
    TreeComponent.ngComponentDef.directiveDefs =
        function () { return [TreeComponent.ngComponentDef]; };
    function _buildTree(currDepth) {
        var children = currDepth < 2 ? _buildTree(currDepth + 1) : null;
        var children2 = currDepth < 2 ? _buildTree(currDepth + 1) : null;
        return new TreeNode(count++, currDepth, children, children2);
    }
    it('should check each component just once', function () {
        var comp = render_util_1.renderComponent(TreeComponent, { hostFeatures: [index_1.LifecycleHooksFeature] });
        expect(component_1.getRenderedText(comp)).toEqual('6201534');
        expect(events).toEqual(['check6', 'check2', 'check0', 'check1', 'check5', 'check3', 'check4']);
        events = [];
        instructions_1.tick(comp);
        expect(events).toEqual(['check6', 'check2', 'check0', 'check1', 'check5', 'check3', 'check4']);
    });
    it('should map inputs minified & unminified names', function () { return __awaiter(_this, void 0, void 0, function () {
        var TestInputsComponent, testInputsComponentFactory;
        return __generator(this, function (_a) {
            TestInputsComponent = /** @class */ (function () {
                function TestInputsComponent() {
                }
                TestInputsComponent.ngComponentDef = index_1.defineComponent({
                    type: TestInputsComponent,
                    selectors: [['test-inputs']],
                    inputs: { minifiedName: 'unminifiedName' },
                    factory: function () { return new TestInputsComponent(); },
                    template: function (rf, ctx) {
                        // Template not needed for this test
                    }
                });
                return TestInputsComponent;
            }());
            testInputsComponentFactory = new index_1.ComponentFactory(TestInputsComponent.ngComponentDef);
            expect([
                { propName: 'minifiedName', templateName: 'unminifiedName' }
            ]).toEqual(testInputsComponentFactory.inputs);
            return [2 /*return*/];
        });
    }); });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50X3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVuZGVyMy9jb21wb25lbnRfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHSCxpQkErWEE7O0FBL1hBLHVDQUE0RztBQUM1Ryx5REFBNEQ7QUFDNUQsaURBQTZIO0FBQzdILCtEQUFtTjtBQUVuTiw4Q0FBeUQ7QUFFekQsMkRBQXlEO0FBQ3pELDZDQUEwSDtBQUUxSCxRQUFRLENBQUMsV0FBVyxFQUFFO0lBQ3BCO1FBQUE7WUFDRSxVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBa0JaLENBQUM7UUFoQkMsb0NBQVMsR0FBVCxjQUFjLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFdEIsK0JBQWMsR0FBRyx1QkFBZSxDQUFDO1lBQ3RDLElBQUksRUFBRSxnQkFBZ0I7WUFDdEIsU0FBUyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN4QixRQUFRLEVBQUUsVUFBUyxFQUFlLEVBQUUsR0FBcUI7Z0JBQ3ZELElBQUksRUFBRSxpQkFBcUIsRUFBRTtvQkFDM0IsbUJBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDVDtnQkFDRCxJQUFJLEVBQUUsaUJBQXFCLEVBQUU7b0JBQzNCLDBCQUFXLENBQUMsQ0FBQyxFQUFFLG1CQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7aUJBQ2pDO1lBQ0gsQ0FBQztZQUNELE9BQU8sRUFBRSxjQUFNLE9BQUEsSUFBSSxnQkFBZ0IsRUFBcEIsQ0FBb0I7WUFDbkMsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQztTQUN6QixDQUFDLENBQUM7UUFDTCx1QkFBQztLQUFBLEFBbkJELElBbUJDO0lBRUQsUUFBUSxDQUFD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