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
var common_with_def_1 = require("../common_with_def");
/// See: `normative.md`
describe('i18n', function () {
    it('should support html', function () {
        var $msg_1$ = "{$START_P}contenu{$END_P}";
        var $i18n_1$ = $r3$.ɵiM($msg_1$, [{ START_P: 1 }]);
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
                        $r3$.ɵE(0, 'div');
                        $r3$.ɵE(1, 'p');
                        $r3$.ɵe();
                        $r3$.ɵe();
                        $r3$.ɵiA(1, $i18n_1$[0]);
                    }
                }
            });
            MyApp = MyApp_1 = __decorate([
                core_1.Component({ selector: 'my-app', template: "<div i18n><p>content</p></div>" })
            ], MyApp);
            return MyApp;
        }());
    });
    it('should support expressions', function () {
        var $msg_1$ = "contenu: {$EXP_1}";
        var $i18n_1$ = $r3$.ɵiM($msg_1$, null, [{ EXP_1: 1 }]);
        var MyApp = /** @class */ (function () {
            function MyApp() {
                this.exp1 = '1';
            }
            MyApp_2 = MyApp;
            var MyApp_2;
            MyApp.ngComponentDef = $r3$.ɵdefineComponent({
                type: MyApp_2,
                selectors: [['my-app']],
                factory: function () { return new MyApp_2(); },
                template: function (rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵE(0, 'div');
                        $r3$.ɵT(1);
                        $r3$.ɵe();
                        $r3$.ɵiA(1, $i18n_1$[0]);
                    }
                    if (rf & 2) {
                        $r3$.ɵt(3, $r3$.ɵb(ctx.exp1));
                    }
                }
            });
            MyApp = MyApp_2 = __decorate([
                core_1.Component({ selector: 'my-app', template: "<div i18n>content: {{exp1}}</div>" })
            ], MyApp);
            return MyApp;
        }());
    });
    it('should support expressions in attributes', function () {
        var $msg_1$ = "titre: {$EXP_1}";
        var $i18n_1$ = $r3$.ɵiEM($msg_1$, { EXP_1: 1 });
        var MyApp = /** @class */ (function () {
            function MyApp() {
                this.exp1 = '1';
            }
            MyApp_3 = MyApp;
            var MyApp_3;
            MyApp.ngComponentDef = $r3$.ɵdefineComponent({
                type: MyApp_3,
                selectors: [['my-app']],
                factory: function () { return new MyApp_3(); },
                template: function (rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵE(0, 'div');
                        $r3$.ɵE(1, 'p');
                        $r3$.ɵe();
                        $r3$.ɵe();
                    }
                    if (rf & 2) {
                        $r3$.ɵp(0, 'title', $r3$.ɵiI1($i18n_1$, ctx.exp1));
                    }
                }
            });
            MyApp = MyApp_3 = __decorate([
                core_1.Component({ selector: 'my-app', template: "<div i18n><p title=\"title: {{exp1}}\"></p></div>" })
            ], MyApp);
            return MyApp;
        }());
    });
    it('should support embedded templates', function () {
        var $msg_1$ = "{$START_LI}valeur: {$EXP_1}!{$END_LI}";
        var $i18n_1$ = $r3$.ɵiM($msg_1$, [{ START_LI: 1 }, { START_LI: 0 }], [null, { EXP_1: 1 }], ['START_LI']);
        var MyApp = /** @class */ (function () {
            function MyApp() {
                this.items = ['1', '2'];
            }
            MyApp_4 = MyApp;
            var MyApp_4;
            MyApp.ngComponentDef = $r3$.ɵdefineComponent({
                type: MyApp_4,
                factory: function () { return new MyApp_4(); },
                selectors: [['my-app']],
                template: function (rf, myApp) {
                    if (rf & 1) {
                        $r3$.ɵE(0, 'ul');
                        $r3$.ɵC(1, liTemplate, null, ['ngForOf', '']);
                        $r3$.ɵe();
                        $r3$.ɵiA(1, $i18n_1$[0]);
                    }
                    if (rf & 2) {
                        $r3$.ɵp(1, 'ngForOf', $r3$.ɵb(myApp.items));
                    }
                    function liTemplate(rf1, row) {
                        if (rf1 & 1) {
                            $r3$.ɵE(0, 'li');
                            $r3$.ɵT(1);
                            $r3$.ɵe();
                            $r3$.ɵiA(0, $i18n_1$[1]);
                        }
                        if (rf1 & 2) {
                            $r3$.ɵt(1, $r3$.ɵb(row.$implicit));
                        }
                    }
                },
                directives: function () { return [common_with_def_1.NgForOf]; }
            });
            MyApp = MyApp_4 = __decorate([
                core_1.Component({
                    selector: 'my-app',
                    template: "<ul i18n><li *ngFor=\"let item of items\">value: {{item}}</li></ul>"
                })
            ], MyApp);
            return MyApp;
        }());
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3JlbmRlcjMvY29tcGlsZXJfY2Fub25pY2FsL2kxOG5fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUdILDBDQUE0QztBQUM1QywrREFBaUU7QUFDakUsc0RBQTJDO0FBRTNDLHVCQUF1QjtBQUN2QixRQUFRLENBQUMsTUFBTSxFQUFFO0lBR2YsRUFBRSxDQUFDLHFCQUFxQixFQUFFO1FBRXhCLElBQU0sT0FBTyxHQUFHLDJCQUEyQixDQUFDO1FBQzVDLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1FBR25EO1lBQUE7WUFlQSxDQUFDO3NCQWZLLEtBQUs7O1lBQ0Ysb0JBQWMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7Z0JBQzVDLElBQUksRUFBRSxPQUFLO2dCQUNYLFNBQVMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3ZCLE9BQU8sRUFBRSxjQUFNLE9BQUEsSUFBSSxPQUFLLEVBQUUsRUFBWCxDQUFXO2dCQUMxQixRQUFRLEVBQUUsVUFBUyxFQUFpQixFQUFFLEdBQVk7b0JBQ2hELElBQUksRUFBRSxHQUFHLENBQUMsRUFBRTt3QkFDVixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzt3QkFDbEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ2hCLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQzt3QkFDVixJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7d0JBQ1YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FB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