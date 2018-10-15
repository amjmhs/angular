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
var testing_1 = require("@angular/private/testing");
var core_1 = require("../../src/core");
var component_1 = require("../../src/render3/component");
var index_1 = require("../../src/render3/index");
var instructions_1 = require("../../src/render3/instructions");
var render_util_1 = require("./render_util");
describe('change detection', function () {
    describe('markDirty, detectChanges, whenRendered, getRenderedText', function () {
        var MyComponent = /** @class */ (function () {
            function MyComponent() {
                this.value = 'works';
                this.doCheckCount = 0;
            }
            MyComponent.prototype.ngDoCheck = function () { this.doCheckCount++; };
            MyComponent.ngComponentDef = index_1.defineComponent({
                type: MyComponent,
                selectors: [['my-comp']],
                factory: function () { return new MyComponent(); },
                template: function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'span');
                        instructions_1.text(1);
                        instructions_1.elementEnd();
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.textBinding(1, instructions_1.bind(ctx.value));
                    }
                }
            });
            return MyComponent;
        }());
        it('should mark a component dirty and schedule change detection', testing_1.withBody('my-comp', function () {
            var myComp = render_util_1.renderComponent(MyComponent, { hostFeatures: [index_1.LifecycleHooksFeature] });
            expect(component_1.getRenderedText(myComp)).toEqual('works');
            myComp.value = 'updated';
            instructions_1.markDirty(myComp);
            expect(component_1.getRenderedText(myComp)).toEqual('works');
            render_util_1.requestAnimationFrame.flush();
            expect(component_1.getRenderedText(myComp)).toEqual('updated');
        }));
        it('should detectChanges on a component', testing_1.withBody('my-comp', function () {
            var myComp = render_util_1.renderComponent(MyComponent, { hostFeatures: [index_1.LifecycleHooksFeature] });
            expect(component_1.getRenderedText(myComp)).toEqual('works');
            myComp.value = 'updated';
            instructions_1.detectChanges(myComp);
            expect(component_1.getRenderedText(myComp)).toEqual('updated');
        }));
        it('should detectChanges only once if markDirty is called multiple times', testing_1.withBody('my-comp', function () {
            var myComp = render_util_1.renderComponent(MyComponent, { hostFeatures: [index_1.LifecycleHooksFeature] });
            expect(component_1.getRenderedText(myComp)).toEqual('works');
            expect(myComp.doCheckCount).toBe(1);
            myComp.value = 'ignore';
            instructions_1.markDirty(myComp);
            myComp.value = 'updated';
            instructions_1.markDirty(myComp);
            expect(component_1.getRenderedText(myComp)).toEqual('works');
            render_util_1.requestAnimationFrame.flush();
            expect(component_1.getRenderedText(myComp)).toEqual('updated');
            expect(myComp.doCheckCount).toBe(2);
        }));
        it('should notify whenRendered', testing_1.withBody('my-comp', function () { return __awaiter(_this, void 0, void 0, function () {
            var myComp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myComp = render_util_1.renderComponent(MyComponent, { hostFeatures: [index_1.LifecycleHooksFeature] });
                        return [4 /*yield*/, component_1.whenRendered(myComp)];
                    case 1:
                        _a.sent();
                        myComp.value = 'updated';
                        instructions_1.markDirty(myComp);
                        setTimeout(render_util_1.requestAnimationFrame.flush, 0);
                        return [4 /*yield*/, component_1.whenRendered(myComp)];
                    case 2:
                        _a.sent();
                        expect(component_1.getRenderedText(myComp)).toEqual('updated');
                        return [2 /*return*/];
                }
            });
        }); }));
    });
    describe('onPush', function () {
        var comp;
        var MyComponent = /** @class */ (function () {
            function MyComponent() {
                /* @Input() */
                this.name = 'Nancy';
                this.doCheckCount = 0;
            }
            MyComponent.prototype.ngDoCheck = function () { this.doCheckCount++; };
            MyComponent.prototype.onClick = function () { };
            MyComponent.ngComponentDef = index_1.defineComponent({
                type: MyComponent,
                selectors: [['my-comp']],
                factory: function () { return comp = new MyComponent(); },
                /**
                 * {{ doCheckCount }} - {{ name }}
                 * <button (click)="onClick()"></button>
                 */
                template: function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.text(0);
                        instructions_1.elementStart(1, 'button');
                        {
                            instructions_1.listener('click', function () { ctx.onClick(); });
                        }
                        instructions_1.elementEnd();
                    }
                    instructions_1.textBinding(0, instructions_1.interpolation2('', ctx.doCheckCount, ' - ', ctx.name, ''));
                },
                changeDetection: core_1.ChangeDetectionStrategy.OnPush,
                inputs: { name: 'name' }
            });
            return MyComponent;
        }());
        var MyApp = /** @class */ (function () {
            function MyApp() {
                this.name = 'Nancy';
            }
            MyApp.ngComponentDef = index_1.defineComponent({
                type: MyApp,
                selectors: [['my-app']],
                factory: function () { return new MyApp(); },
                /** <my-comp [name]="name"></my-comp> */
                template: function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'my-comp');
                        instructions_1.elementEnd();
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.elementProperty(0, 'name', instructions_1.bind(ctx.name));
                    }
                },
                directives: function () { return [MyComponent]; }
            });
            return MyApp;
        }());
        it('should check OnPush components on initialization', function () {
            var myApp = render_util_1.renderComponent(MyApp);
            expect(component_1.getRenderedText(myApp)).toEqual('1 - Nancy');
        });
        it('should call doCheck even when OnPush components are not dirty', function () {
            var myApp = render_util_1.renderComponent(MyApp);
            instructions_1.tick(myApp);
            expect(comp.doCheckCount).toEqual(2);
            instructions_1.tick(myApp);
            expect(comp.doCheckCount).toEqual(3);
        });
        it('should skip OnPush components in update mode when they are not dirty', function () {
            var myApp = render_util_1.renderComponent(MyApp);
            instructions_1.tick(myApp);
            // doCheckCount is 2, but 1 should be rendered since it has not been marked dirty.
            expect(component_1.getRenderedText(myApp)).toEqual('1 - Nancy');
            instructions_1.tick(myApp);
            // doCheckCount is 3, but 1 should be rendered since it has not been marked dirty.
            expect(component_1.getRenderedText(myApp)).toEqual('1 - Nancy');
        });
        it('should check OnPush components in update mode when inputs change', function () {
            var myApp = render_util_1.renderComponent(MyApp);
            myApp.name = 'Bess';
            instructions_1.tick(myApp);
            expect(component_1.getRenderedText(myApp)).toEqual('2 - Bess');
            myApp.name = 'George';
            instructions_1.tick(myApp);
            expect(component_1.getRenderedText(myApp)).toEqual('3 - George');
            instructions_1.tick(myApp);
            expect(component_1.getRenderedText(myApp)).toEqual('3 - George');
        });
        it('should check OnPush components in update mode when component events occur', function () {
            var myApp = render_util_1.renderComponent(MyApp);
            expect(component_1.getRenderedText(myApp)).toEqual('1 - Nancy');
            var button = render_util_1.containerEl.querySelector('button');
            button.click();
            render_util_1.requestAnimationFrame.flush();
            expect(component_1.getRenderedText(myApp)).toEqual('2 - Nancy');
            instructions_1.tick(myApp);
            expect(component_1.getRenderedText(myApp)).toEqual('2 - Nancy');
        });
        it('should not check OnPush components in update mode when parent events occur', function () {
            function noop() { }
            var ButtonParent = render_util_1.createComponent('button-parent', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'my-comp');
                    instructions_1.elementEnd();
                    instructions_1.elementStart(1, 'button', ['id', 'parent']);
                    {
                        instructions_1.listener('click', function () { return noop(); });
                    }
                    instructions_1.elementEnd();
                }
            }, [MyComponent]);
            var buttonParent = render_util_1.renderComponent(ButtonParent);
            expect(component_1.getRenderedText(buttonParent)).toEqual('1 - Nancy');
            var button = render_util_1.containerEl.querySelector('button#parent');
            button.click();
            render_util_1.requestAnimationFrame.flush();
            expect(component_1.getRenderedText(buttonParent)).toEqual('1 - Nancy');
        });
        it('should check parent OnPush components in update mode when child events occur', function () {
            var parent;
            var ButtonParent = /** @class */ (function () {
                function ButtonParent() {
                    this.doCheckCount = 0;
                }
                ButtonParent.prototype.ngDoCheck = function () { this.doCheckCount++; };
                ButtonParent.ngComponentDef = index_1.defineComponent({
                    type: ButtonParent,
                    selectors: [['button-parent']],
                    factory: function () { return parent = new ButtonParent(); },
                    /** {{ doCheckCount }} - <my-comp></my-comp> */
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.text(0);
                            instructions_1.elementStart(1, 'my-comp');
                            instructions_1.elementEnd();
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.textBinding(0, instructions_1.interpolation1('', ctx.doCheckCount, ' - '));
                        }
                    },
                    directives: function () { return [MyComponent]; },
                    changeDetection: core_1.ChangeDetectionStrategy.OnPush
                });
                return ButtonParent;
            }());
            var MyButtonApp = render_util_1.createComponent('my-button-app', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'button-parent');
                    instructions_1.elementEnd();
                }
            }, [ButtonParent]);
            var myButtonApp = render_util_1.renderComponent(MyButtonApp);
            expect(parent.doCheckCount).toEqual(1);
            expect(comp.doCheckCount).toEqual(1);
            expect(component_1.getRenderedText(myButtonApp)).toEqual('1 - 1 - Nancy');
            instructions_1.tick(myButtonApp);
            expect(parent.doCheckCount).toEqual(2);
            // parent isn't checked, so child doCheck won't run
            expect(comp.doCheckCount).toEqual(1);
            expect(component_1.getRenderedText(myButtonApp)).toEqual('1 - 1 - Nancy');
            var button = render_util_1.containerEl.querySelector('button');
            button.click();
            render_util_1.requestAnimationFrame.flush();
            expect(parent.doCheckCount).toEqual(3);
            expect(comp.doCheckCount).toEqual(2);
            expect(component_1.getRenderedText(myButtonApp)).toEqual('3 - 2 - Nancy');
        });
    });
    describe('ChangeDetectorRef', function () {
        describe('detectChanges()', function () {
            var myComp;
            var dir;
            var MyComp = /** @class */ (function () {
                function MyComp(cdr) {
                    this.cdr = cdr;
                    this.doCheckCount = 0;
                    this.name = 'Nancy';
                }
                MyComp.prototype.ngDoCheck = function () { this.doCheckCount++; };
                MyComp.ngComponentDef = index_1.defineComponent({
                    type: MyComp,
                    selectors: [['my-comp']],
                    factory: function () { return myComp = new MyComp(index_1.injectChangeDetectorRef()); },
                    /** {{ name }} */
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.text(0);
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.textBinding(0, instructions_1.bind(ctx.name));
                        }
                    },
                    changeDetection: core_1.ChangeDetectionStrategy.OnPush
                });
                return MyComp;
            }());
            var ParentComp = /** @class */ (function () {
                function ParentComp(cdr) {
                    this.cdr = cdr;
                    this.doCheckCount = 0;
                }
                ParentComp.prototype.ngDoCheck = function () { this.doCheckCount++; };
                ParentComp.ngComponentDef = index_1.defineComponent({
                    type: ParentComp,
                    selectors: [['parent-comp']],
                    factory: function () { return new ParentComp(index_1.injectChangeDetectorRef()); },
                    /**
                     * {{ doCheckCount}} -
                     * <my-comp></my-comp>
                     */
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.text(0);
                            instructions_1.elementStart(1, 'my-comp');
                            instructions_1.elementEnd();
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.textBinding(0, instructions_1.interpolation1('', ctx.doCheckCount, ' - '));
                        }
                    },
                    directives: function () { return [MyComp]; }
                });
                return ParentComp;
            }());
            var Dir = /** @class */ (function () {
                function Dir(cdr) {
                    this.cdr = cdr;
                }
                Dir.ngDirectiveDef = index_1.defineDirective({
                    type: Dir,
                    selectors: [['', 'dir', '']],
                    factory: function () { return dir = new Dir(index_1.injectChangeDetectorRef()); }
                });
                return Dir;
            }());
            it('should check the component view when called by component (even when OnPush && clean)', function () {
                var comp = render_util_1.renderComponent(MyComp, { hostFeatures: [index_1.LifecycleHooksFeature] });
                expect(component_1.getRenderedText(comp)).toEqual('Nancy');
                comp.name = 'Bess'; // as this is not an Input, the component stays clean
                comp.cdr.detectChanges();
                expect(component_1.getRenderedText(comp)).toEqual('Bess');
            });
            it('should NOT call component doCheck when called by a component', function () {
                var comp = render_util_1.renderComponent(MyComp, { hostFeatures: [index_1.LifecycleHooksFeature] });
                expect(comp.doCheckCount).toEqual(1);
                // NOTE: in current Angular, detectChanges does not itself trigger doCheck, but you
                // may see doCheck called in some cases bc of the extra CD run triggered by zone.js.
                // It's important not to call doCheck to allow calls to detectChanges in that hook.
                comp.cdr.detectChanges();
                expect(comp.doCheckCount).toEqual(1);
            });
            it('should NOT check the component parent when called by a child component', function () {
                var parentComp = render_util_1.renderComponent(ParentComp, { hostFeatures: [index_1.LifecycleHooksFeature] });
                expect(component_1.getRenderedText(parentComp)).toEqual('1 - Nancy');
                parentComp.doCheckCount = 100;
                myComp.cdr.detectChanges();
                expect(parentComp.doCheckCount).toEqual(100);
                expect(component_1.getRenderedText(parentComp)).toEqual('1 - Nancy');
            });
            it('should check component children when called by component if dirty or check-always', function () {
                var parentComp = render_util_1.renderComponent(ParentComp, { hostFeatures: [index_1.LifecycleHooksFeature] });
                expect(parentComp.doCheckCount).toEqual(1);
                myComp.name = 'Bess';
                parentComp.cdr.detectChanges();
                expect(parentComp.doCheckCount).toEqual(1);
                expect(myComp.doCheckCount).toEqual(2);
                // OnPush child is not dirty, so its change isn't rendered.
                expect(component_1.getRenderedText(parentComp)).toEqual('1 - Nancy');
            });
            it('should not group detectChanges calls (call every time)', function () {
                var parentComp = render_util_1.renderComponent(ParentComp, { hostFeatures: [index_1.LifecycleHooksFeature] });
                expect(myComp.doCheckCount).toEqual(1);
                parentComp.cdr.detectChanges();
                parentComp.cdr.detectChanges();
                expect(myComp.doCheckCount).toEqual(3);
            });
            it('should check component view when called by directive on component node', function () {
                /** <my-comp dir></my-comp> */
                var MyApp = render_util_1.createComponent('my-app', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'my-comp', ['dir', '']);
                        instructions_1.elementEnd();
                    }
                }, [MyComp, Dir]);
                var app = render_util_1.renderComponent(MyApp);
                expect(component_1.getRenderedText(app)).toEqual('Nancy');
                myComp.name = 'George';
                dir.cdr.detectChanges();
                expect(component_1.getRenderedText(app)).toEqual('George');
            });
            it('should check host component when called by directive on element node', function () {
                /**
                 * {{ name }}
                 * <div dir></div>
                 */
                var MyApp = render_util_1.createComponent('my-app', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.text(0);
                        instructions_1.elementStart(1, 'div', ['dir', '']);
                        instructions_1.elementEnd();
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.textBinding(1, instructions_1.bind(ctx.value));
                    }
                }, [Dir]);
                var app = render_util_1.renderComponent(MyApp);
                app.value = 'Frank';
                instructions_1.tick(app);
                expect(component_1.getRenderedText(app)).toEqual('Frank');
                app.value = 'Joe';
                dir.cdr.detectChanges();
                expect(component_1.getRenderedText(app)).toEqual('Joe');
            });
            it('should check the host component when called from EmbeddedViewRef', function () {
                var MyApp = /** @class */ (function () {
                    function MyApp(cdr) {
                        this.cdr = cdr;
                        this.showing = true;
                        this.name = 'Amelia';
                    }
                    MyApp.ngComponentDef = index_1.defineComponent({
                        type: MyApp,
                        selectors: [['my-app']],
                        factory: function () { return new MyApp(index_1.injectChangeDetectorRef()); },
                        /**
                         * {{ name}}
                         * % if (showing) {
                       *   <div dir></div>
                       * % }
                         */
                        template: function (rf, ctx) {
                            if (rf & 1 /* Create */) {
                                instructions_1.text(0);
                                instructions_1.container(1);
                            }
                            if (rf & 2 /* Update */) {
                                instructions_1.textBinding(0, instructions_1.bind(ctx.name));
                                instructions_1.containerRefreshStart(1);
                                {
                                    if (ctx.showing) {
                                        var rf0 = instructions_1.embeddedViewStart(0);
                                        if (rf0 & 1 /* Create */) {
                                            instructions_1.elementStart(0, 'div', ['dir', '']);
                                            instructions_1.elementEnd();
                                        }
                                    }
                                    instructions_1.embeddedViewEnd();
                                }
                                instructions_1.containerRefreshEnd();
                            }
                        },
                        directives: [Dir]
                    });
                    return MyApp;
                }());
                var app = render_util_1.renderComponent(MyApp);
                expect(component_1.getRenderedText(app)).toEqual('Amelia');
                app.name = 'Emerson';
                dir.cdr.detectChanges();
                expect(component_1.getRenderedText(app)).toEqual('Emerson');
            });
            it('should support call in ngOnInit', function () {
                var DetectChangesComp = /** @class */ (function () {
                    function DetectChangesComp(cdr) {
                        this.cdr = cdr;
                        this.value = 0;
                    }
                    DetectChangesComp.prototype.ngOnInit = function () {
                        this.value++;
                        this.cdr.detectChanges();
                    };
                    DetectChangesComp.ngComponentDef = index_1.defineComponent({
                        type: DetectChangesComp,
                        selectors: [['detect-changes-comp']],
                        factory: function () { return new DetectChangesComp(index_1.injectChangeDetectorRef()); },
                        /** {{ value }} */
                        template: function (rf, ctx) {
                            if (rf & 1 /* Create */) {
                                instructions_1.text(0);
                            }
                            if (rf & 2 /* Update */) {
                                instructions_1.textBinding(0, instructions_1.bind(ctx.value));
                            }
                        }
                    });
                    return DetectChangesComp;
                }());
                var comp = render_util_1.renderComponent(DetectChangesComp, { hostFeatures: [index_1.LifecycleHooksFeature] });
                expect(component_1.getRenderedText(comp)).toEqual('1');
            });
            it('should support call in ngDoCheck', function () {
                var DetectChangesComp = /** @class */ (function () {
                    function DetectChangesComp(cdr) {
                        this.cdr = cdr;
                        this.doCheckCount = 0;
                    }
                    DetectChangesComp.prototype.ngDoCheck = function () {
                        this.doCheckCount++;
                        this.cdr.detectChanges();
                    };
                    DetectChangesComp.ngComponentDef = index_1.defineComponent({
                        type: DetectChangesComp,
                        selectors: [['detect-changes-comp']],
                        factory: function () { return new DetectChangesComp(index_1.injectChangeDetectorRef()); },
                        /** {{ doCheckCount }} */
                        template: function (rf, ctx) {
                            if (rf & 1 /* Create */) {
                                instructions_1.text(0);
                            }
                            if (rf & 2 /* Update */) {
                                instructions_1.textBinding(0, instructions_1.bind(ctx.doCheckCount));
                            }
                        }
                    });
                    return DetectChangesComp;
                }());
                var comp = render_util_1.renderComponent(DetectChangesComp, { hostFeatures: [index_1.LifecycleHooksFeature] });
                expect(component_1.getRenderedText(comp)).toEqual('1');
            });
        });
        describe('attach/detach', function () {
            var comp;
            var MyApp = /** @class */ (function () {
                function MyApp(cdr) {
                    this.cdr = cdr;
                }
                MyApp.ngComponentDef = index_1.defineComponent({
                    type: MyApp,
                    selectors: [['my-app']],
                    factory: function () { return new MyApp(index_1.injectChangeDetectorRef()); },
                    /** <detached-comp></detached-comp> */
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.elementStart(0, 'detached-comp');
                            instructions_1.elementEnd();
                        }
                    },
                    directives: function () { return [DetachedComp]; }
                });
                return MyApp;
            }());
            var DetachedComp = /** @class */ (function () {
                function DetachedComp(cdr) {
                    this.cdr = cdr;
                    this.value = 'one';
                    this.doCheckCount = 0;
                }
                DetachedComp.prototype.ngDoCheck = function () { this.doCheckCount++; };
                DetachedComp.ngComponentDef = index_1.defineComponent({
                    type: DetachedComp,
                    selectors: [['detached-comp']],
                    factory: function () { return comp = new DetachedComp(index_1.injectChangeDetectorRef()); },
                    /** {{ value }} */
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.text(0);
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.textBinding(0, instructions_1.bind(ctx.value));
                        }
                    }
                });
                return DetachedComp;
            }());
            it('should not check detached components', function () {
                var app = render_util_1.renderComponent(MyApp);
                expect(component_1.getRenderedText(app)).toEqual('one');
                comp.cdr.detach();
                comp.value = 'two';
                instructions_1.tick(app);
                expect(component_1.getRenderedText(app)).toEqual('one');
            });
            it('should check re-attached components', function () {
                var app = render_util_1.renderComponent(MyApp);
                expect(component_1.getRenderedText(app)).toEqual('one');
                comp.cdr.detach();
                comp.value = 'two';
                comp.cdr.reattach();
                instructions_1.tick(app);
                expect(component_1.getRenderedText(app)).toEqual('two');
            });
            it('should call lifecycle hooks on detached components', function () {
                var app = render_util_1.renderComponent(MyApp);
                expect(comp.doCheckCount).toEqual(1);
                comp.cdr.detach();
                instructions_1.tick(app);
                expect(comp.doCheckCount).toEqual(2);
            });
            it('should check detached component when detectChanges is called', function () {
                var app = render_util_1.renderComponent(MyApp);
                expect(component_1.getRenderedText(app)).toEqual('one');
                comp.cdr.detach();
                comp.value = 'two';
                instructions_1.detectChanges(comp);
                expect(component_1.getRenderedText(app)).toEqual('two');
            });
            it('should not check detached component when markDirty is called', function () {
                var app = render_util_1.renderComponent(MyApp);
                expect(component_1.getRenderedText(app)).toEqual('one');
                comp.cdr.detach();
                comp.value = 'two';
                instructions_1.markDirty(comp);
                render_util_1.requestAnimationFrame.flush();
                expect(component_1.getRenderedText(app)).toEqual('one');
            });
            it('should detach any child components when parent is detached', function () {
                var app = render_util_1.renderComponent(MyApp);
                expect(component_1.getRenderedText(app)).toEqual('one');
                app.cdr.detach();
                comp.value = 'two';
                instructions_1.tick(app);
                expect(component_1.getRenderedText(app)).toEqual('one');
                app.cdr.reattach();
                instructions_1.tick(app);
                expect(component_1.getRenderedText(app)).toEqual('two');
            });
            it('should detach OnPush components properly', function () {
                var onPushComp;
                var OnPushComp = /** @class */ (function () {
                    function OnPushComp(cdr) {
                        this.cdr = cdr;
                    }
                    OnPushComp.ngComponentDef = index_1.defineComponent({
                        type: OnPushComp,
                        selectors: [['on-push-comp']],
                        factory: function () { return onPushComp = new OnPushComp(index_1.injectChangeDetectorRef()); },
                        /** {{ value }} */
                        template: function (rf, ctx) {
                            if (rf & 1 /* Create */) {
                                instructions_1.text(0);
                            }
                            if (rf & 2 /* Update */) {
                                instructions_1.textBinding(0, instructions_1.bind(ctx.value));
                            }
                        },
                        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
                        inputs: { value: 'value' }
                    });
                    return OnPushComp;
                }());
                /** <on-push-comp [value]="value"></on-push-comp> */
                var OnPushApp = render_util_1.createComponent('on-push-app', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'on-push-comp');
                        instructions_1.elementEnd();
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.elementProperty(0, 'value', instructions_1.bind(ctx.value));
                    }
                }, [OnPushComp]);
                var app = render_util_1.renderComponent(OnPushApp);
                app.value = 'one';
                instructions_1.tick(app);
                expect(component_1.getRenderedText(app)).toEqual('one');
                onPushComp.cdr.detach();
                app.value = 'two';
                instructions_1.tick(app);
                expect(component_1.getRenderedText(app)).toEqual('one');
                onPushComp.cdr.reattach();
                instructions_1.tick(app);
                expect(component_1.getRenderedText(app)).toEqual('two');
            });
        });
        describe('markForCheck()', function () {
            var comp;
            var OnPushComp = /** @class */ (function () {
                function OnPushComp(cdr) {
                    this.cdr = cdr;
                    this.value = 'one';
                    this.doCheckCount = 0;
                }
                OnPushComp.prototype.ngDoCheck = function () { this.doCheckCount++; };
                OnPushComp.ngComponentDef = index_1.defineComponent({
                    type: OnPushComp,
                    selectors: [['on-push-comp']],
                    factory: function () { return comp = new OnPushComp(index_1.injectChangeDetectorRef()); },
                    /** {{ value }} */
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.text(0);
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.textBinding(0, instructions_1.bind(ctx.value));
                        }
                    },
                    changeDetection: core_1.ChangeDetectionStrategy.OnPush
                });
                return OnPushComp;
            }());
            var OnPushParent = /** @class */ (function () {
                function OnPushParent() {
                    this.value = 'one';
                }
                OnPushParent.ngComponentDef = index_1.defineComponent({
                    type: OnPushParent,
                    selectors: [['on-push-parent']],
                    factory: function () { return new OnPushParent(); },
                    /**
                     * {{ value }} -
                     * <on-push-comp></on-push-comp>
                     */
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.text(0);
                            instructions_1.elementStart(1, 'on-push-comp');
                            instructions_1.elementEnd();
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.textBinding(0, instructions_1.interpolation1('', ctx.value, ' - '));
                        }
                    },
                    directives: function () { return [OnPushComp]; },
                    changeDetection: core_1.ChangeDetectionStrategy.OnPush
                });
                return OnPushParent;
            }());
            it('should schedule check on OnPush components', function () {
                var parent = render_util_1.renderComponent(OnPushParent);
                expect(component_1.getRenderedText(parent)).toEqual('one - one');
                comp.value = 'two';
                instructions_1.tick(parent);
                expect(component_1.getRenderedText(parent)).toEqual('one - one');
                comp.cdr.markForCheck();
                render_util_1.requestAnimationFrame.flush();
                expect(component_1.getRenderedText(parent)).toEqual('one - two');
            });
            it('should only run change detection once with multiple calls to markForCheck', function () {
                render_util_1.renderComponent(OnPushParent);
                expect(comp.doCheckCount).toEqual(1);
                comp.cdr.markForCheck();
                comp.cdr.markForCheck();
                comp.cdr.markForCheck();
                comp.cdr.markForCheck();
                comp.cdr.markForCheck();
                render_util_1.requestAnimationFrame.flush();
                expect(comp.doCheckCount).toEqual(2);
            });
            it('should schedule check on ancestor OnPush components', function () {
                var parent = render_util_1.renderComponent(OnPushParent);
                expect(component_1.getRenderedText(parent)).toEqual('one - one');
                parent.value = 'two';
                instructions_1.tick(parent);
                expect(component_1.getRenderedText(parent)).toEqual('one - one');
                comp.cdr.markForCheck();
                render_util_1.requestAnimationFrame.flush();
                expect(component_1.getRenderedText(parent)).toEqual('two - one');
            });
            it('should schedule check on OnPush components in embedded views', function () {
                var EmbeddedViewParent = /** @class */ (function () {
                    function EmbeddedViewParent() {
                        this.value = 'one';
                        this.showing = true;
                    }
                    EmbeddedViewParent.ngComponentDef = index_1.defineComponent({
                        type: EmbeddedViewParent,
                        selectors: [['embedded-view-parent']],
                        factory: function () { return new EmbeddedViewParent(); },
                        /**
                         * {{ value }} -
                         * % if (ctx.showing) {
                         *   <on-push-comp></on-push-comp>
                         * % }
                         */
                        template: function (rf, ctx) {
                            if (rf & 1 /* Create */) {
                                instructions_1.text(0);
                                instructions_1.container(1);
                            }
                            if (rf & 2 /* Update */) {
                                instructions_1.textBinding(0, instructions_1.interpolation1('', ctx.value, ' - '));
                                instructions_1.containerRefreshStart(1);
                                {
                                    if (ctx.showing) {
                                        var rf0 = instructions_1.embeddedViewStart(0);
                                        if (rf0 & 1 /* Create */) {
                                            instructions_1.elementStart(0, 'on-push-comp');
                                            instructions_1.elementEnd();
                                        }
                                        instructions_1.embeddedViewEnd();
                                    }
                                }
                                instructions_1.containerRefreshEnd();
                            }
                        },
                        directives: function () { return [OnPushComp]; },
                        changeDetection: core_1.ChangeDetectionStrategy.OnPush
                    });
                    return EmbeddedViewParent;
                }());
                var parent = render_util_1.renderComponent(EmbeddedViewParent);
                expect(component_1.getRenderedText(parent)).toEqual('one - one');
                comp.value = 'two';
                instructions_1.tick(parent);
                expect(component_1.getRenderedText(parent)).toEqual('one - one');
                comp.cdr.markForCheck();
                render_util_1.requestAnimationFrame.flush();
                expect(component_1.getRenderedText(parent)).toEqual('one - two');
                parent.value = 'two';
                instructions_1.tick(parent);
                expect(component_1.getRenderedText(parent)).toEqual('one - two');
                comp.cdr.markForCheck();
                render_util_1.requestAnimationFrame.flush();
                expect(component_1.getRenderedText(parent)).toEqual('two - two');
            });
            // TODO(kara): add test for dynamic views once bug fix is in
        });
        describe('checkNoChanges', function () {
            var comp;
            var NoChangesComp = /** @class */ (function () {
                function NoChangesComp(cdr) {
                    this.cdr = cdr;
                    this.value = 1;
                    this.doCheckCount = 0;
                    this.contentCheckCount = 0;
                    this.viewCheckCount = 0;
                }
                NoChangesComp.prototype.ngDoCheck = function () { this.doCheckCount++; };
                NoChangesComp.prototype.ngAfterContentChecked = function () { this.contentCheckCount++; };
                NoChangesComp.prototype.ngAfterViewChecked = function () { this.viewCheckCount++; };
                NoChangesComp.ngComponentDef = index_1.defineComponent({
                    type: NoChangesComp,
                    selectors: [['no-changes-comp']],
                    factory: function () { return comp = new NoChangesComp(index_1.injectChangeDetectorRef()); },
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.text(0);
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.textBinding(0, instructions_1.bind(ctx.value));
                        }
                    }
                });
                return NoChangesComp;
            }());
            var AppComp = /** @class */ (function () {
                function AppComp(cdr) {
                    this.cdr = cdr;
                    this.value = 1;
                }
                AppComp.ngComponentDef = index_1.defineComponent({
                    type: AppComp,
                    selectors: [['app-comp']],
                    factory: function () { return new AppComp(index_1.injectChangeDetectorRef()); },
                    /**
                     * {{ value }} -
                     * <no-changes-comp></no-changes-comp>
                     */
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.text(0);
                            instructions_1.elementStart(1, 'no-changes-comp');
                            instructions_1.elementEnd();
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.textBinding(0, instructions_1.interpolation1('', ctx.value, ' - '));
                        }
                    },
                    directives: function () { return [NoChangesComp]; }
                });
                return AppComp;
            }());
            it('should throw if bindings in current view have changed', function () {
                var comp = render_util_1.renderComponent(NoChangesComp, { hostFeatures: [index_1.LifecycleHooksFeature] });
                expect(function () { return comp.cdr.checkNoChanges(); }).not.toThrow();
                comp.value = 2;
                expect(function () { return comp.cdr.checkNoChanges(); })
                    .toThrowError(/ExpressionChangedAfterItHasBeenCheckedError: .+ Previous value: '1'. Current value: '2'/gi);
            });
            it('should throw if interpolations in current view have changed', function () {
                var app = render_util_1.renderComponent(AppComp);
                expect(function () { return app.cdr.checkNoChanges(); }).not.toThrow();
                app.value = 2;
                expect(function () { return app.cdr.checkNoChanges(); })
                    .toThrowError(/ExpressionChangedAfterItHasBeenCheckedError: .+ Previous value: '1'. Current value: '2'/gi);
            });
            it('should throw if bindings in children of current view have changed', function () {
                var app = render_util_1.renderComponent(AppComp);
                expect(function () { return app.cdr.checkNoChanges(); }).not.toThrow();
                comp.value = 2;
                expect(function () { return app.cdr.checkNoChanges(); })
                    .toThrowError(/ExpressionChangedAfterItHasBeenCheckedError: .+ Previous value: '1'. Current value: '2'/gi);
            });
            it('should throw if bindings in embedded view have changed', function () {
                var EmbeddedViewApp = /** @class */ (function () {
                    function EmbeddedViewApp(cdr) {
                        this.cdr = cdr;
                        this.value = 1;
                        this.showing = true;
                    }
                    EmbeddedViewApp.ngComponentDef = index_1.defineComponent({
                        type: EmbeddedViewApp,
                        selectors: [['embedded-view-app']],
                        factory: function () { return new EmbeddedViewApp(index_1.injectChangeDetectorRef()); },
                        /**
                         * % if (showing) {
                         *  {{ value }}
                         * %}
                         */
                        template: function (rf, ctx) {
                            if (rf & 1 /* Create */) {
                                instructions_1.container(0);
                            }
                            if (rf & 2 /* Update */) {
                                instructions_1.containerRefreshStart(0);
                                {
                                    if (ctx.showing) {
                                        var rf0 = instructions_1.embeddedViewStart(0);
                                        if (rf0 & 1 /* Create */) {
                                            instructions_1.text(0);
                                        }
                                        if (rf0 & 2 /* Update */) {
                                            instructions_1.textBinding(0, instructions_1.bind(ctx.value));
                                        }
                                        instructions_1.embeddedViewEnd();
                                    }
                                }
                                instructions_1.containerRefreshEnd();
                            }
                        }
                    });
                    return EmbeddedViewApp;
                }());
                var app = render_util_1.renderComponent(EmbeddedViewApp);
                expect(function () { return app.cdr.checkNoChanges(); }).not.toThrow();
                app.value = 2;
                expect(function () { return app.cdr.checkNoChanges(); })
                    .toThrowError(/ExpressionChangedAfterItHasBeenCheckedError: .+ Previous value: '1'. Current value: '2'/gi);
            });
            it('should NOT call lifecycle hooks', function () {
                var app = render_util_1.renderComponent(AppComp);
                expect(comp.doCheckCount).toEqual(1);
                expect(comp.contentCheckCount).toEqual(1);
                expect(comp.viewCheckCount).toEqual(1);
                comp.value = 2;
                expect(function () { return app.cdr.checkNoChanges(); }).toThrow();
                expect(comp.doCheckCount).toEqual(1);
                expect(comp.contentCheckCount).toEqual(1);
                expect(comp.viewCheckCount).toEqual(1);
            });
            it('should NOT throw if bindings in ancestors of current view have changed', function () {
                var app = render_util_1.renderComponent(AppComp);
                app.value = 2;
                expect(function () { return comp.cdr.checkNoChanges(); }).not.toThrow();
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlX2RldGVjdGlvbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3JlbmRlcjMvY2hhbmdlX2RldGVjdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILGlCQTBoQ0E7O0FBMWhDQSxvREFBa0Q7QUFFbEQsdUNBQW1GO0FBQ25GLHlEQUEwRTtBQUMxRSxpREFBeUg7QUFDekgsK0RBQXVSO0FBRXZSLDZDQUFtRztBQUVuRyxRQUFRLENBQUMsa0JBQWtCLEVBQUU7SUFFM0IsUUFBUSxDQUFDLHlEQUF5RCxFQUFFO1FBQ2xFO1lBQUE7Z0JBQ0UsVUFBSyxHQUFXLE9BQU8sQ0FBQztnQkFDeEIsaUJBQVksR0FBRyxDQUFDLENBQUM7WUFrQm5CLENBQUM7WUFqQkMsK0JBQVMsR0FBVCxjQUFvQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRW5DLDBCQUFjLEdBQUcsdUJBQWUsQ0FBQztnQkFDdEMsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLFNBQVMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3hCLE9BQU8sRUFBRSxjQUFNLE9BQUEsSUFBSSxXQUFXLEVBQUUsRUFBakIsQ0FBaUI7Z0JBQ2hDLFFBQVEsRUFBRSxVQUFDLEVBQWUsRUFBRSxHQUFnQjtvQkFDMUMsSUFBSSxFQUFFLGlCQUFxQixFQUFFO3dCQUMzQiwyQkFBWSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQzt3QkFDeEIsbUJBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDUix5QkFBVSxFQUFFLENBQUM7cUJBQ2Q7b0JBQ0QsSUFBSSxFQUFFLGlCQUFxQixFQUFFO3dCQUMzQiwwQkFBVyxDQUFDLENBQUMsRUFBRSxtQkFBSSxDQUFDLEdBQUcsQ0FBQyxL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