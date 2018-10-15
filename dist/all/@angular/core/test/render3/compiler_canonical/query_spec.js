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
describe('queries', function () {
    var someDir;
    var SomeDirective = /** @class */ (function () {
        function SomeDirective() {
        }
        SomeDirective_1 = SomeDirective;
        var SomeDirective_1;
        SomeDirective.ngDirectiveDef = $r3$.ɵdefineDirective({
            type: SomeDirective_1,
            selectors: [['', 'someDir', '']],
            factory: function SomeDirective_Factory() { return someDir = new SomeDirective_1(); },
            features: [$r3$.ɵPublicFeature]
        });
        SomeDirective = SomeDirective_1 = __decorate([
            core_1.Directive({
                selector: '[someDir]',
            })
        ], SomeDirective);
        return SomeDirective;
    }());
    it('should support view queries', function () {
        // NORMATIVE
        var $e1_attrs$ = ['someDir', ''];
        // /NORMATIVE
        var ViewQueryComponent = /** @class */ (function () {
            function ViewQueryComponent() {
            }
            ViewQueryComponent_1 = ViewQueryComponent;
            var ViewQueryComponent_1;
            // NORMATIVE
            ViewQueryComponent.ngComponentDef = $r3$.ɵdefineComponent({
                type: ViewQueryComponent_1,
                selectors: [['view-query-component']],
                factory: function ViewQueryComponent_Factory() { return new ViewQueryComponent_1(); },
                template: function ViewQueryComponent_Template(rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵEe(2, 'div', $e1_attrs$);
                    }
                },
                viewQuery: function ViewQueryComponent_Query(rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵQ(0, SomeDirective, false);
                        $r3$.ɵQ(1, SomeDirective, false);
                    }
                    if (rf & 2) {
                        var $tmp$ = void 0;
                        $r3$.ɵqR($tmp$ = $r3$.ɵld(0)) && (ctx.someDir = $tmp$.first);
                        $r3$.ɵqR($tmp$ = $r3$.ɵld(1)) &&
                            (ctx.someDirList = $tmp$);
                    }
                }
            });
            __decorate([
                core_1.ViewChild(SomeDirective),
                __metadata("design:type", SomeDirective)
            ], ViewQueryComponent.prototype, "someDir", void 0);
            __decorate([
                core_1.ViewChildren(SomeDirective),
                __metadata("design:type", core_1.QueryList)
            ], ViewQueryComponent.prototype, "someDirList", void 0);
            ViewQueryComponent = ViewQueryComponent_1 = __decorate([
                core_1.Component({
                    selector: 'view-query-component',
                    template: "\n      <div someDir></div>\n    "
                })
            ], ViewQueryComponent);
            return ViewQueryComponent;
        }());
        // NON-NORMATIVE
        ViewQueryComponent.ngComponentDef.directiveDefs =
            [SomeDirective.ngDirectiveDef];
        // /NON-NORMATIVE
        var viewQueryComp = render_util_1.renderComponent(ViewQueryComponent);
        expect(viewQueryComp.someDir).toEqual(someDir);
        expect(viewQueryComp.someDirList.toArray()).toEqual([someDir]);
    });
    it('should support content queries', function () {
        var contentQueryComp;
        var ContentQueryComponent = /** @class */ (function () {
            function ContentQueryComponent() {
            }
            ContentQueryComponent_1 = ContentQueryComponent;
            var ContentQueryComponent_1;
            // NORMATIVE
            ContentQueryComponent.ngComponentDef = $r3$.ɵdefineComponent({
                type: ContentQueryComponent_1,
                selectors: [['content-query-component']],
                factory: function ContentQueryComponent_Factory() { return new ContentQueryComponent_1(); },
                contentQueries: function ContentQueryComponent_ContentQueries() {
                    $r3$.ɵQr($r3$.ɵQ(null, SomeDirective, false));
                    $r3$.ɵQr($r3$.ɵQ(null, SomeDirective, false));
                },
                contentQueriesRefresh: function ContentQueryComponent_ContentQueriesRefresh(dirIndex, queryStartIndex) {
                    var $tmp$;
                    var $instance$ = $r3$.ɵd(dirIndex);
                    $r3$.ɵqR($tmp$ = $r3$.ɵql(queryStartIndex)) && ($instance$.someDir = $tmp$.first);
                    $r3$.ɵqR($tmp$ = $r3$.ɵql(queryStartIndex + 1)) && ($instance$.someDirList = $tmp$);
                },
                template: function ContentQueryComponent_Template(rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵpD();
                        $r3$.ɵE(0, 'div');
                        $r3$.ɵP(1);
                        $r3$.ɵe();
                    }
                }
            });
            __decorate([
                core_1.ContentChild(SomeDirective),
                __metadata("design:type", SomeDirective)
            ], ContentQueryComponent.prototype, "someDir", void 0);
            __decorate([
                core_1.ContentChildren(SomeDirective),
                __metadata("design:type", core_1.QueryList)
            ], ContentQueryComponent.prototype, "someDirList", void 0);
            ContentQueryComponent = ContentQueryComponent_1 = __decorate([
                core_1.Component({
                    selector: 'content-query-component',
                    template: "\n        <div><ng-content></ng-content></div>\n      "
                })
            ], ContentQueryComponent);
            return ContentQueryComponent;
        }());
        var $e2_attrs$ = ['someDir', ''];
        var MyApp = /** @class */ (function () {
            function MyApp() {
            }
            MyApp_1 = MyApp;
            var MyApp_1;
            // NON-NORMATIVE
            MyApp.ngComponentDef = $r3$.ɵdefineComponent({
                type: MyApp_1,
                selectors: [['my-app']],
                factory: function MyApp_Factory() { return new MyApp_1(); },
                template: function MyApp_Template(rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵE(0, 'content-query-component');
                        contentQueryComp = $r3$.ɵd(0);
                        $r3$.ɵEe(1, 'div', $e2_attrs$);
                        $r3$.ɵe();
                    }
                }
            });
            MyApp = MyApp_1 = __decorate([
                core_1.Component({
                    selector: 'my-app',
                    template: "\n        <content-query-component>\n          <div someDir></div>\n        </content-query-component>\n      "
                })
            ], MyApp);
            return MyApp;
        }());
        // NON-NORMATIVE
        MyApp.ngComponentDef.directiveDefs =
            [ContentQueryComponent.ngComponentDef, SomeDirective.ngDirectiveDef];
        // /NON-NORMATIVE
        expect(render_util_1.toHtml(render_util_1.renderComponent(MyApp)))
            .toEqual("<content-query-component><div><div somedir=\"\"></div></div></content-query-component>");
        expect(contentQueryComp.someDir).toEqual(someDir);
        expect(contentQueryComp.someDirList.toArray()).toEqual([
            someDir
        ]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnlfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9yZW5kZXIzL2NvbXBpbGVyX2Nhbm9uaWNhbC9xdWVyeV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsMENBQXNUO0FBQ3RULCtEQUFpRTtBQUVqRSw4Q0FBdUQ7QUFHdkQsdUJBQXVCO0FBQ3ZCLFFBQVEsQ0FBQyxTQUFTLEVBQUU7SUFHbEIsSUFBSSxPQUFzQixDQUFDO0lBSzNCO1FBQUE7UUFPQSxDQUFDOzBCQVBLLGFBQWE7O1FBQ1YsNEJBQWMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7WUFDNUMsSUFBSSxFQUFFLGVBQWE7WUFDbkIsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2hDLE9BQU8sRUFBRSxtQ0FBbUMsT0FBTyxPQUFPLEdBQUcsSUFBSSxlQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkYsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztTQUNoQyxDQUFDLENBQUM7UUFOQyxhQUFhO1lBSGxCLGdCQUFTLENBQUM7Z0JBQ1QsUUFBUSxFQUFFLFdBQVc7YUFDdEIsQ0FBQztXQUNJLGFBQWEsQ0FPbEI7UUFBRCxvQkFBQztLQUFBLEFBUEQsSUFPQztJQUVELEVBQUUsQ0FBQyw2QkFBNkIsRUFBRTtRQUdoQyxZQUFZO1FBQ1osSUFBTSxVQUFVLEdBQUcsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbkMsYUFBYTtRQVFiO1lBQUE7WUErQkEsQ0FBQzttQ0EvQkssa0JBQWtCOztZQU10QixZQUFZO1lBQ0wsaUNBQWMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7Z0JBQzVDLElBQUksRUFBRSxvQkFBa0I7Z0JBQ3hCLFNBQVMsRUFBRSxD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