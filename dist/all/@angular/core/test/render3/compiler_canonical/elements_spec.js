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
var core_1 = require("../../../src/core");
var $r3$ = require("../../../src/core_render3_private_export");
var render_util_1 = require("../render_util");
/// See: `normative.md`
describe('elements', function () {
    it('should translate DOM structure', function () {
        // Important: keep arrays outside of function to not create new instances.
        var $e0_attrs$ = ['class', 'my-app', 'title', 'Hello'];
        var MyComponent = /** @class */ (function () {
            function MyComponent() {
            }
            MyComponent_1 = MyComponent;
            var MyComponent_1;
            // NORMATIVE
            MyComponent.ngComponentDef = $r3$.ɵdefineComponent({
                type: MyComponent_1,
                selectors: [['my-component']],
                factory: function () { return new MyComponent_1(); },
                template: function (rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵE(0, 'div', $e0_attrs$);
                        $r3$.ɵT(1, 'Hello ');
                        $r3$.ɵE(2, 'b');
                        $r3$.ɵT(3, 'World');
                        $r3$.ɵe();
                        $r3$.ɵT(4, '!');
                        $r3$.ɵe();
                    }
                }
            });
            MyComponent = MyComponent_1 = __decorate([
                core_1.Component({
                    selector: 'my-component',
                    template: "<div class=\"my-app\" title=\"Hello\">Hello <b>World</b>!</div>"
                })
            ], MyComponent);
            return MyComponent;
        }());
        expect(render_util_1.toHtml(render_util_1.renderComponent(MyComponent)))
            .toEqual('<div class="my-app" title="Hello">Hello <b>World</b>!</div>');
    });
    it('should support local refs', function () {
        var Dir = /** @class */ (function () {
            function Dir() {
                this.value = 'one';
            }
            Dir.ngDirectiveDef = $r3$.ɵdefineDirective({
                type: Dir,
                selectors: [['', 'dir', '']],
                factory: function DirA_Factory() { return new Dir(); },
                exportAs: 'dir'
            });
            return Dir;
        }());
        // NORMATIVE
        var $e0_attrs$ = ['dir', ''];
        var $e0_locals$ = ['dir', 'dir', 'foo', ''];
        // /NORMATIVE
        var LocalRefComp = /** @class */ (function () {
            function LocalRefComp() {
            }
            LocalRefComp_1 = LocalRefComp;
            var LocalRefComp_1;
            // NORMATIVE
            LocalRefComp.ngComponentDef = $r3$.ɵdefineComponent({
                type: LocalRefComp_1,
                selectors: [['local-ref-comp']],
                factory: function LocalRefComp_Factory() { return new LocalRefComp_1(); },
                template: function LocalRefComp_Template(rf, ctx) {
                    var $tmp$;
                    var $tmp_2$;
                    if (rf & 1) {
                        $r3$.ɵEe(0, 'div', $e0_attrs$, $e0_locals$);
                        $r3$.ɵT(3);
                    }
                    if (rf & 2) {
                        $tmp$ = $r3$.ɵld(1);
                        $tmp_2$ = $r3$.ɵld(2);
                        $r3$.ɵt(3, $r3$.ɵi2(' ', $tmp$.value, ' - ', $tmp_2$.tagName, ''));
                    }
                }
            });
            LocalRefComp = LocalRefComp_1 = __decorate([
                core_1.Component({
                    selector: 'local-ref-comp',
                    template: "\n        <div dir #dir=\"dir\" #foo></div>\n        {{ dir.value }} - {{ foo.tagName }}\n      "
                })
            ], LocalRefComp);
            return LocalRefComp;
        }());
        // NON-NORMATIVE
        LocalRefComp.ngComponentDef.directiveDefs =
            function () { return [Dir.ngDirectiveDef]; };
        // /NON-NORMATIVE
        var fixture = new render_util_1.ComponentFixture(LocalRefComp);
        expect(fixture.html).toEqual("<div dir=\"\"></div> one - DIV");
    });
    it('should support listeners', function () {
        var ListenerComp = /** @class */ (function () {
            function ListenerComp() {
            }
            ListenerComp_1 = ListenerComp;
            ListenerComp.prototype.onClick = function () { };
            ListenerComp.prototype.onPress = function (e) { };
            ListenerComp.prototype.onPress2 = function (e) { };
            var ListenerComp_1;
            // NORMATIVE
            ListenerComp.ngComponentDef = $r3$.ɵdefineComponent({
                type: ListenerComp_1,
                selectors: [['listener-comp']],
                factory: function ListenerComp_Factory() { return new ListenerComp_1(); },
                template: function ListenerComp_Template(rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵE(0, 'button');
                        $r3$.ɵL('click', function ListenerComp_click_Handler() { return ctx.onClick(); });
                        $r3$.ɵL('keypress', function ListenerComp_keypress_Handler($event) {
                            ctx.onPress($event);
                            return ctx.onPress2($event);
                        });
                        $r3$.ɵT(1, 'Click');
                        $r3$.ɵe();
                    }
                }
            });
            ListenerComp = ListenerComp_1 = __decorate([
                core_1.Component({
                    selector: 'listener-comp',
                    template: "<button (click)=\"onClick()\" (keypress)=\"onPress($event); onPress2($event)\">Click</button>"
                })
            ], ListenerComp);
            return ListenerComp;
        }());
        var listenerComp = render_util_1.renderComponent(ListenerComp);
        expect(render_util_1.toHtml(listenerComp)).toEqual('<button>Click</button>');
    });
    it('should support namespaced attributes', function () {
        // Important: keep arrays outside of function to not create new instances.
        var $e0_attrs$ = [
            // class="my-app"
            'class',
            'my-app',
            0 /* NamespaceURI */,
            'http://someuri/foo',
            'foo:bar',
            'baz',
            // title="Hello"
            'title',
            'Hello',
            0 /* NamespaceURI */,
            'http://someuri/foo',
            'foo:qux',
            'quacks',
        ];
        var MyComponent = /** @class */ (function () {
            function MyComponent() {
            }
            MyComponent_2 = MyComponent;
            var MyComponent_2;
            // NORMATIVE
            MyComponent.ngComponentDef = $r3$.ɵdefineComponent({
                type: MyComponent_2,
                selectors: [['my-component']],
                factory: function () { return new MyComponent_2(); },
                template: function (rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵE(0, 'div', $e0_attrs$);
                        $r3$.ɵT(1, 'Hello ');
                        $r3$.ɵE(2, 'b');
                        $r3$.ɵT(3, 'World');
                        $r3$.ɵe();
                        $r3$.ɵT(4, '!');
                        $r3$.ɵe();
                    }
                }
            });
            MyComponent = MyComponent_2 = __decorate([
                core_1.Component({
                    selector: 'my-component',
                    template: "<div xmlns:foo=\"http://someuri/foo\" class=\"my-app\" foo:bar=\"baz\" title=\"Hello\" foo:qux=\"quacks\">Hello <b>World</b>!</div>"
                })
            ], MyComponent);
            return MyComponent;
        }());
        expect(render_util_1.toHtml(render_util_1.renderComponent(MyComponent)))
            .toEqual('<div class="my-app" foo:bar="baz" foo:qux="quacks" title="Hello">Hello <b>World</b>!</div>');
    });
    describe('bindings', function () {
        it('should bind to property', function () {
            var MyComponent = /** @class */ (function () {
                function MyComponent() {
                    this.someProperty = 'initial';
                    // /NORMATIVE
                }
                MyComponent_3 = MyComponent;
                var MyComponent_3;
                // NORMATIVE
                MyComponent.ngComponentDef = $r3$.ɵdefineComponent({
                    type: MyComponent_3,
                    selectors: [['my-component']],
                    factory: function MyComponent_Factory() { return new MyComponent_3(); },
                    template: function MyComponent_Template(rf, ctx) {
                        if (rf & 1) {
                            $r3$.ɵEe(0, 'div');
                        }
                        if (rf & 2) {
                            $r3$.ɵp(0, 'id', $r3$.ɵb(ctx.someProperty));
                        }
                    }
                });
                MyComponent = MyComponent_3 = __decorate([
                    core_1.Component({ selector: 'my-component', template: "<div [id]=\"someProperty\"></div>" })
                ], MyComponent);
                return MyComponent;
            }());
            var comp = render_util_1.renderComponent(MyComponent);
            expect(render_util_1.toHtml(comp)).toEqual('<div id="initial"></div>');
            comp.someProperty = 'changed';
            $r3$.ɵdetectChanges(comp);
            expect(render_util_1.toHtml(comp)).toEqual('<div id="changed"></div>');
        });
        it('should bind to attribute', function () {
            var MyComponent = /** @class */ (function () {
                function MyComponent() {
                    this.someAttribute = 'initial';
                    // /NORMATIVE
                }
                MyComponent_4 = MyComponent;
                var MyComponent_4;
                // NORMATIVE
                MyComponent.ngComponentDef = $r3$.ɵdefineComponent({
                    type: MyComponent_4,
                    selectors: [['my-component']],
                    factory: function MyComponent_Factory() { return new MyComponent_4(); },
                    template: function MyComponent_Template(rf, ctx) {
                        if (rf & 1) {
                            $r3$.ɵEe(0, 'div');
                        }
                        if (rf & 2) {
                            $r3$.ɵa(0, 'title', $r3$.ɵb(ctx.someAttribute));
                        }
                    }
                });
                MyComponent = MyComponent_4 = __decorate([
                    core_1.Component({ selector: 'my-component', template: "<div [attr.title]=\"someAttribute\"></div>" })
                ], MyComponent);
                return MyComponent;
            }());
            var comp = render_util_1.renderComponent(MyComponent);
            expect(render_util_1.toHtml(comp)).toEqual('<div title="initial"></div>');
            comp.someAttribute = 'changed';
            $r3$.ɵdetectChanges(comp);
            expect(render_util_1.toHtml(comp)).toEqual('<div title="changed"></div>');
        });
        it('should bind to a specific class', function () {
            var c1 = ['foo'];
            var MyComponent = /** @class */ (function () {
                function MyComponent() {
                    this.someFlag = false;
                    // /NORMATIVE
                }
                MyComponent_5 = MyComponent;
                var MyComponent_5;
                // NORMATIVE
                MyComponent.ngComponentDef = $r3$.ɵdefineComponent({
                    type: MyComponent_5,
                    selectors: [['my-component']],
                    factory: function MyComponent_Factory() { return new MyComponent_5(); },
                    template: function MyComponent_Template(rf, ctx) {
                        if (rf & 1) {
                            $r3$.ɵE(0, 'div');
                            $r3$.ɵs(c1);
                            $r3$.ɵe();
                        }
                        if (rf & 2) {
                            $r3$.ɵcp(0, 0, ctx.someFlag);
                            $r3$.ɵsa(0);
                        }
                    }
                });
                MyComponent = MyComponent_5 = __decorate([
                    core_1.Component({ selector: 'my-component', template: "<div [class.foo]=\"someFlag\"></div>" })
                ], MyComponent);
                return MyComponent;
            }());
            var comp = render_util_1.renderComponent(MyComponent);
            expect(render_util_1.toHtml(comp)).toEqual('<div></div>');
            comp.someFlag = true;
            $r3$.ɵdetectChanges(comp);
            expect(render_util_1.toHtml(comp)).toEqual('<div class="foo"></div>');
        });
        it('should bind to a specific style', function () {
            var c0 = ['color', 'width'];
            var MyComponent = /** @class */ (function () {
                function MyComponent() {
                    this.someColor = 'red';
                    this.someWidth = 50;
                    // /NORMATIVE
                }
                MyComponent_6 = MyComponent;
                var MyComponent_6;
                // NORMATIVE
                MyComponent.ngComponentDef = $r3$.ɵdefineComponent({
                    type: MyComponent_6,
                    selectors: [['my-component']],
                    factory: function MyComponent_Factory() { return new MyComponent_6(); },
                    template: function MyComponent_Template(rf, ctx) {
                        if (rf & 1) {
                            $r3$.ɵE(0, 'div');
                            $r3$.ɵs(null, c0);
                            $r3$.ɵe();
                        }
                        if (rf & 2) {
                            $r3$.ɵsp(0, 0, ctx.someColor);
                            $r3$.ɵsp(0, 1, ctx.someWidth, 'px');
                            $r3$.ɵsa(0);
                        }
                    }
                });
                MyComponent = MyComponent_6 = __decorate([
                    core_1.Component({
                        selector: 'my-component',
                        template: "<div [style.color]=\"someColor\" [style.width.px]=\"someWidth\"></div>"
                    })
                ], MyComponent);
                return MyComponent;
            }());
            var comp = render_util_1.renderComponent(MyComponent);
            expect(render_util_1.toHtml(comp)).toEqual('<div style="color: red; width: 50px;"></div>');
            comp.someColor = 'blue';
            comp.someWidth = 100;
            $r3$.ɵdetectChanges(comp);
            expect(render_util_1.toHtml(comp)).toEqual('<div style="color: blue; width: 100px;"></div>');
        });
        it('should bind to many and keep order', function () {
            var c0 = ['foo'];
            var c1 = ['color', 1 /* VALUES_MODE */, 'color', 'red'];
            var MyComponent = /** @class */ (function () {
                function MyComponent() {
                    this.someString = 'initial';
                    // /NORMATIVE
                }
                MyComponent_7 = MyComponent;
                var MyComponent_7;
                // NORMATIVE
                MyComponent.ngComponentDef = $r3$.ɵdefineComponent({
                    type: MyComponent_7,
                    selectors: [['my-component']],
                    factory: function MyComponent_Factory() { return new MyComponent_7(); },
                    template: function MyComponent_Template(rf, ctx) {
                        if (rf & 1) {
                            $r3$.ɵE(0, 'div');
                            $r3$.ɵs(c0, c1);
                            $r3$.ɵe();
                        }
                        if (rf & 2) {
                            $r3$.ɵp(0, 'id', $r3$.ɵb(ctx.someString + 1));
                            $r3$.ɵcp(0, 0, ctx.someString == 'initial');
                            $r3$.ɵsa(0);
                        }
                    }
                });
                MyComponent = MyComponent_7 = __decorate([
                    core_1.Component({
                        selector: 'my-component',
                        template: "<div [id]=\"someString+1\" [class.foo]=\"someString=='initial'\" [attr.style]=\"'color: red;'\"></div>"
                    })
                ], MyComponent);
                return MyComponent;
            }());
            var comp = render_util_1.renderComponent(MyComponent);
            expect(render_util_1.toHtml(comp)).toEqual('<div class="foo" id="initial1" style="color: red;"></div>');
            comp.someString = 'changed';
            $r3$.ɵdetectChanges(comp);
            expect(render_util_1.toHtml(comp)).toEqual('<div class="" id="changed1" style="color: red;"></div>');
        });
        it('should bind [class] and [style] to the element', function () {
            var StyleComponent = /** @class */ (function () {
                function StyleComponent() {
                    this.classExp = 'some-name';
                    this.styleExp = { 'background-color': 'red' };
                    // /NORMATIVE
                }
                StyleComponent_1 = StyleComponent;
                var StyleComponent_1;
                // NORMATIVE
                StyleComponent.ngComponentDef = $r3$.ɵdefineComponent({
                    type: StyleComponent_1,
                    selectors: [['style-comp']],
                    factory: function StyleComponent_Factory() { return new StyleComponent_1(); },
                    template: function StyleComponent_Template(rf, ctx) {
                        if (rf & 1) {
                            $r3$.ɵE(0, 'div');
                            $r3$.ɵs();
                            $r3$.ɵe();
                        }
                        if (rf & 2) {
                            $r3$.ɵsm(0, ctx.classExp, ctx.styleExp);
                            $r3$.ɵsa(0);
                        }
                    }
                });
                StyleComponent = StyleComponent_1 = __decorate([
                    core_1.Component({ selector: 'style-comp', template: "<div [class]=\"classExp\" [style]=\"styleExp\"></div>" })
                ], StyleComponent);
                return StyleComponent;
            }());
            var styleFixture = new render_util_1.ComponentFixture(StyleComponent);
            expect(styleFixture.html)
                .toEqual("<div class=\"some-name\" style=\"background-color: red;\"></div>");
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudHNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9yZW5kZXIzL2NvbXBpbGVyX2Nhbm9uaWNhbC9lbGVtZW50c19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsMENBQTRDO0FBQzVDLCtEQUFpRTtBQUdqRSw4Q0FBeUU7QUFHekUsdUJBQXVCO0FBQ3ZCLFFBQVEsQ0FBQyxVQUFVLEVBQUU7SUFLbkIsRUFBRSxDQUFDLGdDQUFnQyxFQUFFO1FBR25DLDBFQUEwRTtRQUMxRSxJQUFNLFVBQVUsR0FBRyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBTXpEO1lBQUE7WUFtQkEsQ0FBQzs0QkFuQkssV0FBVzs7WUFDZixZQUFZO1lBQ0wsMEJBQWMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7Z0JBQzVDLElBQUksRUFBRSxhQUFXO2dCQUNqQixTQUFTLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUM3QixPQUFPLEVBQUUsY0FBTSxPQUFBLElBQUksYUFBVyxFQUFFLEVBQWpCLENBQWlCO2dCQUNoQyxRQUFRLEVBQUUsVUFBUyxFQUFpQixFQUFFLEdBQWtCO29CQUN0RCxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7d0JBQ1YsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO3dCQUM5QixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQzt3QkFDckIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ2hCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO3dCQUNwQixJQUFJLENBQUMsRUFBRSxF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