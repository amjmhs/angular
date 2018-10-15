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
/// See: `normative.md`
describe('content projection', function () {
    it('should support content projection', function () {
        var SimpleComponent = /** @class */ (function () {
            function SimpleComponent() {
            }
            SimpleComponent_1 = SimpleComponent;
            var SimpleComponent_1;
            // NORMATIVE
            SimpleComponent.ngComponentDef = $r3$.ɵdefineComponent({
                type: SimpleComponent_1,
                selectors: [['simple']],
                factory: function () { return new SimpleComponent_1(); },
                template: function (rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵpD();
                        $r3$.ɵEe(0, 'div');
                        $r3$.ɵP(1);
                    }
                }
            });
            SimpleComponent = SimpleComponent_1 = __decorate([
                core_1.Component({ selector: 'simple', template: "<div><ng-content></ng-content></div>" })
            ], SimpleComponent);
            return SimpleComponent;
        }());
        // NORMATIVE
        var $pD_0P$ = [[['span', 'title', 'toFirst']], [['span', 'title', 'toSecond']]];
        var $pD_0R$ = ['span[title=toFirst]', 'span[title=toSecond]'];
        // /NORMATIVE
        var ComplexComponent = /** @class */ (function () {
            function ComplexComponent() {
            }
            ComplexComponent_1 = ComplexComponent;
            var ComplexComponent_1;
            // NORMATIVE
            ComplexComponent.ngComponentDef = $r3$.ɵdefineComponent({
                type: ComplexComponent_1,
                selectors: [['complex']],
                factory: function () { return new ComplexComponent_1(); },
                template: function (rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵpD($pD_0P$, $pD_0R$);
                        $r3$.ɵEe(0, 'div', ['id', 'first']);
                        $r3$.ɵP(1, 1);
                        $r3$.ɵEe(2, 'div', ['id', 'second']);
                        $r3$.ɵP(3, 2);
                    }
                }
            });
            ComplexComponent = ComplexComponent_1 = __decorate([
                core_1.Component({
                    selector: 'complex',
                    template: "\n      <div id=\"first\"><ng-content select=\"span[title=toFirst]\"></ng-content></div>\n      <div id=\"second\"><ng-content select=\"span[title=toSecond]\"></ng-content></div>"
                })
            ], ComplexComponent);
            return ComplexComponent;
        }());
        var MyApp = /** @class */ (function () {
            function MyApp() {
            }
            MyApp_1 = MyApp;
            var MyApp_1;
            MyApp.ngComponentDef = $r3$.ɵdefineComponent({
                type: MyApp_1,
                selectors: [['my-app']],
                factory: function () { return new MyApp_1(); },
                template: function (rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵE(0, 'simple');
                        $r3$.ɵT(1, 'content');
                        $r3$.ɵe();
                    }
                },
                directives: function () { return [SimpleComponent]; }
            });
            MyApp = MyApp_1 = __decorate([
                core_1.Component({
                    selector: 'my-app',
                    template: "<simple>content</simple>\n      <complex></complex>"
                })
            ], MyApp);
            return MyApp;
        }());
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudF9wcm9qZWN0aW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVuZGVyMy9jb21waWxlcl9jYW5vbmljYWwvY29udGVudF9wcm9qZWN0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCwwQ0FBc1Q7QUFDdFQsK0RBQWlFO0FBRWpFLHVCQUF1QjtBQUN2QixRQUFRLENBQUMsb0JBQW9CLEVBQUU7SUFHN0IsRUFBRSxDQUFDLG1DQUFtQyxFQUFFO1FBTXRDO1lBQUE7WUFlQSxDQUFDO2dDQWZLLGVBQWU7O1lBQ25CLFlBQVk7WUFDTCw4QkFBYyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDNUMsSUFBSSxFQUFFLGlCQUFlO2dCQUNyQixTQUFTLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN2QixPQUFPLEVBQUUsY0FBTSxPQUFBLElBQUksaUJBQWUsRUFBRSxFQUFyQixDQUFxQjtnQkFDcEMsUUFBUSxFQUFFLFVBQVMsRUFBaUIsRUFBRSxHQUFzQjtvQkFDMUQsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO3dCQUNWLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQzt3QkFDWCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzt3QkFDbkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDWjtnQkFDSCxDQUFDO2FBQ0YsQ0FBQyxDQUFDO1lBYkMsZUFBZTtnQkFEcEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLHNDQUFzQyxFQUFDLENBQUM7ZUFDNUUsZUFBZSxDQWVwQjtZQUFELHNCQUFDO1NBQUEsQUFmRCxJQWVDO1FBRUQsWUFBWTtRQUNaLElBQU0sT0FBTyxHQUNULENBQUMs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