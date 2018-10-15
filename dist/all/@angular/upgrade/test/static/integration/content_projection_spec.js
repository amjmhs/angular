"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var static_1 = require("@angular/upgrade/static");
var angular = require("@angular/upgrade/static/src/common/angular1");
var test_helpers_1 = require("../test_helpers");
test_helpers_1.withEachNg1Version(function () {
    describe('content projection', function () {
        beforeEach(function () { return core_1.destroyPlatform(); });
        afterEach(function () { return core_1.destroyPlatform(); });
        it('should instantiate ng2 in ng1 template and project content', testing_1.async(function () {
            // the ng2 component that will be used in ng1 (downgraded)
            var Ng2Component = /** @class */ (function () {
                function Ng2Component() {
                    this.prop = 'NG2';
                    this.ngContent = 'ng2-content';
                }
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: "{{ prop }}(<ng-content></ng-content>)" })
                ], Ng2Component);
                return Ng2Component;
            }());
            // our upgrade module to host the component to downgrade
            var Ng2Module = /** @class */ (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                Ng2Module = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        declarations: [Ng2Component],
                        entryComponents: [Ng2Component]
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            // the ng1 app module that will consume the downgraded component
            var ng1Module = angular
                .module('ng1', [])
                // create an ng1 facade of the ng2 component
                .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                .run(function ($rootScope) {
                $rootScope['prop'] = 'NG1';
                $rootScope['ngContent'] = 'ng1-content';
            });
            var element = test_helpers_1.html('<div>{{ \'ng1[\' }}<ng2>~{{ ngContent }}~</ng2>{{ \']\' }}</div>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(document.body.textContent).toEqual('ng1[NG2(~ng1-content~)]');
            });
        }));
        it('should correctly project structural directives', testing_1.async(function () {
            var Ng2Component = /** @class */ (function () {
                function Ng2Component() {
                }
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", String)
                ], Ng2Component.prototype, "itemId", void 0);
                Ng2Component = __decorate([
                    core_1.Component({ selector: 'ng2', template: 'ng2-{{ itemId }}(<ng-content></ng-content>)' })
                ], Ng2Component);
                return Ng2Component;
            }());
            var Ng2Module = /** @class */ (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                Ng2Module = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule],
                        declarations: [Ng2Component],
                        entryComponents: [Ng2Component]
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            var ng1Module = angular.module('ng1', [])
                .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                .run(function ($rootScope) {
                $rootScope['items'] = [
                    { id: 'a', subitems: [1, 2, 3] }, { id: 'b', subitems: [4, 5, 6] },
                    { id: 'c', subitems: [7, 8, 9] }
                ];
            });
            var element = test_helpers_1.html("\n           <ng2 ng-repeat=\"item in items\" [item-id]=\"item.id\">\n             <div ng-repeat=\"subitem in item.subitems\">{{ subitem }}</div>\n           </ng2>\n         ");
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(test_helpers_1.multiTrim(document.body.textContent))
                    .toBe('ng2-a( 123 )ng2-b( 456 )ng2-c( 789 )');
            });
        }));
        it('should instantiate ng1 in ng2 template and project content', testing_1.async(function () {
            var Ng2Component = /** @class */ (function () {
                function Ng2Component() {
                    this.prop = 'ng2';
                    this.transclude = 'ng2-transclude';
                }
                Ng2Component = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: "{{ 'ng2(' }}<ng1>{{ transclude }}</ng1>{{ ')' }}",
                    })
                ], Ng2Component);
                return Ng2Component;
            }());
            var Ng1WrapperComponent = /** @class */ (function (_super) {
                __extends(Ng1WrapperComponent, _super);
                function Ng1WrapperComponent(elementRef, injector) {
                    return _super.call(this, 'ng1', elementRef, injector) || this;
                }
                Ng1WrapperComponent = __decorate([
                    core_1.Directive({ selector: 'ng1' }),
                    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
                ], Ng1WrapperComponent);
                return Ng1WrapperComponent;
            }(static_1.UpgradeComponent));
            var Ng2Module = /** @class */ (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng1WrapperComponent, Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            var ng1Module = angular.module('ng1', [])
                .directive('ng1', function () { return ({
                transclude: true,
                template: '{{ prop }}(<ng-transclude></ng-transclude>)'
            }); })
                .directive('ng2', static_1.downgradeComponent({ component: Ng2Component }))
                .run(function ($rootScope) {
                $rootScope['prop'] = 'ng1';
                $rootScope['transclude'] = 'ng1-transclude';
            });
            var element = test_helpers_1.html('<div>{{ \'ng1(\' }}<ng2></ng2>{{ \')\' }}</div>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(document.body.textContent).toEqual('ng1(ng2(ng1(ng2-transclude)))');
            });
        }));
        it('should support multi-slot projection', testing_1.async(function () {
            var Ng2Component = /** @class */ (function () {
                function Ng2Component() {
                }
                Ng2Component = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        template: '2a(<ng-content select=".ng1a"></ng-content>)' +
                            '2b(<ng-content select=".ng1b"></ng-content>)'
                    }),
                    __metadata("design:paramtypes", [])
                ], Ng2Component);
                return Ng2Component;
            }());
            var Ng2Module = /** @class */ (function () {
                function Ng2Module() {
                }
                Ng2Module.prototype.ngDoBootstrap = function () { };
                Ng2Module = __decorate([
                    core_1.NgModule({
                        declarations: [Ng2Component],
                        entryComponents: [Ng2Component],
                        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
                    })
                ], Ng2Module);
                return Ng2Module;
            }());
            var ng1Module = angular.module('ng1', []).directive('ng2', static_1.downgradeComponent({ component: Ng2Component }));
            // The ng-if on one of the projected children is here to make sure
            // the correct slot is targeted even with structural directives in play.
            var element = test_helpers_1.html('<ng2><div ng-if="true" class="ng1a">1a</div><div' +
                ' class="ng1b">1b</div></ng2>');
            test_helpers_1.bootstrap(platform_browser_dynamic_1.platformBrowserDynamic(), Ng2Module, element, ng1Module).then(function (upgrade) {
                expect(document.body.textContent).toEqual('2a(1a)2b(1b)');
            });
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudF9wcm9qZWN0aW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3Rlc3Qvc3RhdGljL2ludGVncmF0aW9uL2NvbnRlbnRfcHJvamVjdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHNDQUEyRztBQUMzRyxpREFBNEM7QUFDNUMsOERBQXdEO0FBQ3hELDhFQUF5RTtBQUN6RSxrREFBNEY7QUFDNUYscUVBQXVFO0FBRXZFLGdEQUErRTtBQUUvRSxpQ0FBa0IsQ0FBQztJQUNqQixRQUFRLENBQUMsb0JBQW9CLEVBQUU7UUFFN0IsVUFBVSxDQUFDLGNBQU0sT0FBQSxzQkFBZSxFQUFFLEVBQWpCLENBQWlCLENBQUMsQ0FBQztRQUNwQyxTQUFTLENBQUMsY0FBTSxPQUFBLHNCQUFlLEVBQUUsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO1FBRW5DLEVBQUUsQ0FBQyw0REFBNEQsRUFBRSxlQUFLLENBQUM7WUFFbEUsMERBQTBEO1lBRTFEO2dCQURBO29CQUVFLFNBQUksR0FBRyxLQUFLLENBQUM7b0JBQ2IsY0FBUyxHQUFHLGFBQWEsQ0FBQztnQkFDNUIsQ0FBQztnQkFISyxZQUFZO29CQURqQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsdUNBQXVDLEVBQUMsQ0FBQzttQkFDMUUsWUFBWSxDQUdqQjtnQkFBRCxtQkFBQzthQUFBLEFBSEQsSUFHQztZQUVELHdEQUF3RDtZQU14RDtnQkFBQTtnQkFFQSxDQUFDO2dCQURDLGlDQUFhLEdBQWIsY0FBaUIsQ0FBQztnQkFEZCxTQUFTO29CQUxkLGVBQVEsQ0FBQzt3QkFDUixPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxFQUFFLHNCQUFhLENBQUM7d0JBQ3ZDLFlBQVksRUFBRSxDQUFDLFlBQVksQ0FBQzt3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