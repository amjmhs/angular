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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("../../../src/core");
var $r3$ = require("../../../src/core_render3_private_export");
var render_util_1 = require("../render_util");
/// See: `normative.md`
describe('template variables', function () {
    var ForOfDirective = /** @class */ (function () {
        function ForOfDirective(view, template) {
            this.view = view;
            this.template = template;
        }
        ForOfDirective_1 = ForOfDirective;
        ForOfDirective.prototype.ngOnChanges = function (simpleChanges) {
            if ('forOf' in simpleChanges) {
                this.update();
            }
        };
        ForOfDirective.prototype.ngDoCheck = function () {
            var previous = this.previous;
            var current = this.forOf;
            if (!previous || previous.length != current.length ||
                previous.some(function (value, index) { return current[index] !== previous[index]; })) {
                this.update();
            }
        };
        ForOfDirective.prototype.update = function () {
            // TODO(chuckj): Not implemented yet
            // this.view.clear();
            if (this.forOf) {
                var current = this.forOf;
                for (var i = 0; i < current.length; i++) {
                    var context = { $implicit: current[i], index: i, even: i % 2 == 0, odd: i % 2 == 1 };
                    // TODO(chuckj): Not implemented yet
                    // this.view.createEmbeddedView(this.template, context);
                }
                this.previous = this.forOf.slice();
            }
        };
        var ForOfDirective_1;
        // NORMATIVE
        ForOfDirective.ngDirectiveDef = $r3$.ɵdefineDirective({
            type: ForOfDirective_1,
            selectors: [['', 'forOf', '']],
            factory: function ForOfDirective_Factory() {
                return new ForOfDirective_1($r3$.ɵinjectViewContainerRef(), $r3$.ɵinjectTemplateRef());
            },
            // TODO(chuckj): Enable when ngForOf enabling lands.
            // features: [NgOnChangesFeature],
            inputs: { forOf: 'forOf' }
        });
        __decorate([
            core_1.Input(),
            __metadata("design:type", Array)
        ], ForOfDirective.prototype, "forOf", void 0);
        ForOfDirective = ForOfDirective_1 = __decorate([
            core_1.Directive({ selector: '[forOf]' }),
            __metadata("design:paramtypes", [core_1.ViewContainerRef, core_1.TemplateRef])
        ], ForOfDirective);
        return ForOfDirective;
    }());
    it('should support a let variable and reference', function () {
        var MyComponent = /** @class */ (function () {
            function MyComponent() {
                this.items = [{ name: 'one' }, { name: 'two' }];
                // /NORMATIVE
            }
            MyComponent_1 = MyComponent;
            var MyComponent_1;
            // NORMATIVE
            MyComponent.ngComponentDef = $r3$.ɵdefineComponent({
                type: MyComponent_1,
                selectors: [['my-component']],
                factory: function MyComponent_Factory() { return new MyComponent_1(); },
                template: function MyComponent_Template(rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵE(0, 'ul');
                        $r3$.ɵC(1, MyComponent_ForOfDirective_Template_1, '', ['forOf', '']);
                        $r3$.ɵe();
                    }
                    if (rf & 2) {
                        $r3$.ɵp(1, 'forOf', $r3$.ɵb(ctx.items));
                        $r3$.ɵcR(1);
                        $r3$.ɵcr();
                    }
                    function MyComponent_ForOfDirective_Template_1(rf, ctx1) {
                        if (rf & 1) {
                            $r3$.ɵE(0, 'li');
                            $r3$.ɵT(1);
                            $r3$.ɵe();
                        }
                        var $l0_item$;
                        if (rf & 2) {
                            $l0_item$ = ctx1.$implicit;
                            $r3$.ɵt(1, $r3$.ɵi1('', $l0_item$.name, ''));
                        }
                    }
                }
            });
            MyComponent = MyComponent_1 = __decorate([
                core_1.Component({
                    selector: 'my-component',
                    template: "<ul><li *for=\"let item of items\">{{item.name}}</li></ul>"
                })
            ], MyComponent);
            return MyComponent;
        }());
        // NON-NORMATIVE
        MyComponent.ngComponentDef.directiveDefs =
            [ForOfDirective.ngDirectiveDef];
        // /NON-NORMATIVE
        // TODO(chuckj): update when the changes to enable ngForOf lands.
        expect(render_util_1.toHtml(render_util_1.renderComponent(MyComponent))).toEqual('<ul></ul>');
    });
    it('should support accessing parent template variables', function () {
        var MyComponent = /** @class */ (function () {
            function MyComponent() {
                this.items = [
                    { name: 'one', infos: [{ description: '11' }, { description: '12' }] },
                    { name: 'two', infos: [{ description: '21' }, { description: '22' }] }
                ];
                // /NORMATIVE
            }
            MyComponent_2 = MyComponent;
            var MyComponent_2;
            // NORMATIVE
            MyComponent.ngComponentDef = $r3$.ɵdefineComponent({
                type: MyComponent_2,
                selectors: [['my-component']],
                factory: function MyComponent_Factory() { return new MyComponent_2(); },
                template: function MyComponent_Template(rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵE(0, 'ul');
                        $r3$.ɵC(1, MyComponent_ForOfDirective_Template_1, '', ['forOf', '']);
                        $r3$.ɵe();
                    }
                    if (rf & 2) {
                        $r3$.ɵp(1, 'forOf', $r3$.ɵb(ctx.items));
                        $r3$.ɵcR(1);
                        $r3$.ɵcr();
                    }
                    function MyComponent_ForOfDirective_Template_1(rf1, ctx1) {
                        if (rf & 1) {
                            $r3$.ɵE(0, 'li');
                            $r3$.ɵE(1, 'div');
                            $r3$.ɵT(2);
                            $r3$.ɵe();
                            $r3$.ɵE(3, 'ul');
                            $r3$.ɵC(4, MyComponent_ForOfDirective_ForOfDirective_Template_3, '', ['forOf', '']);
                            $r3$.ɵe();
                            $r3$.ɵe();
                        }
                        var $l0_item$;
                        if (rf & 2) {
                            $l0_item$ = ctx1.$implicit;
                            $r3$.ɵp(4, 'forOf', $r3$.ɵb($l0_item$.infos));
                            $r3$.ɵt(2, $r3$.ɵi1('', $l0_item$.name, ''));
                            $r3$.ɵcR(4);
                            $r3$.ɵcr();
                        }
                        function MyComponent_ForOfDirective_ForOfDirective_Template_3(rf2, ctx2) {
                            if (rf & 1) {
                                $r3$.ɵE(0, 'li');
                                $r3$.ɵT(1);
                                $r3$.ɵe();
                            }
                            var $l0_info$;
                            if (rf & 2) {
                                $l0_info$ = ctx2.$implicit;
                                $r3$.ɵt(1, $r3$.ɵi2(' ', $l0_item$.name, ': ', $l0_info$.description, ' '));
                            }
                        }
                    }
                }
            });
            MyComponent = MyComponent_2 = __decorate([
                core_1.Component({
                    selector: 'my-component',
                    template: "\n        <ul>\n          <li *for=\"let item of items\">\n            <div>{{item.name}}</div>\n            <ul>\n              <li *for=\"let info of item.infos\">\n                {{item.name}}: {{info.description}}\n              </li>\n            </ul>\n          </li>\n        </ul>"
                })
            ], MyComponent);
            return MyComponent;
        }());
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfdmFyaWFibGVzX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVuZGVyMy9jb21waWxlcl9jYW5vbmljYWwvdGVtcGxhdGVfdmFyaWFibGVzX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCwwQ0FBc1Q7QUFDdFQsK0RBQWlFO0FBRWpFLDhDQUF1RDtBQUd2RCx1QkFBdUI7QUFDdkIsUUFBUSxDQUFDLG9CQUFvQixFQUFFO0lBYTdCO1FBSUUsd0JBQW9CLElBQXNCLEVBQVUsUUFBMEI7WUFBMUQsU0FBSSxHQUFKLElBQUksQ0FBa0I7WUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFrQjtRQUFHLENBQUM7MkJBSjlFLGNBQWM7UUFTbEIsb0NBQVcsR0FBWCxVQUFZLGFBQTRCO1lBQ3RDLElBQUksT0FBTyxJQUFJLGFBQWEsRUFBRTtnQkFDNUIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ2Y7UUFDSCxDQUFDO1FBRUQsa0NBQVMsR0FBVDtZQUNFLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDL0IsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUMzQixJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLE1BQU07Z0JBQzlDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBQyxLQUFVLEVBQUUsS0FBYSxJQUFLLE9BQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBbEMsQ0FBa0MsQ0FBQyxFQUFFO2dCQUNwRixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDZjtRQUNILENBQUM7UUFFTywrQkFBTSxHQUFkO1lBQ0Usb0NBQW9DO1lBQ3BDLHFCQUFxQjtZQUNyQixJQUFJLElB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