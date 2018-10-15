"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var test_util_1 = require("@angular/compiler/test/aot/test_util");
var mock_compile_1 = require("./mock_compile");
describe('compiler compliance: template', function () {
    var angularFiles = test_util_1.setup({
        compileAngular: true,
        compileAnimations: false,
        compileCommon: true,
    });
    it('should correctly bind to context in nested template', function () {
        var files = {
            app: {
                'spec.ts': "\n              import {Component, NgModule} from '@angular/core';\n              import {CommonModule} from '@angular/common';\n\n              @Component({\n                selector: 'my-component',\n                template: `\n                  <ul *ngFor=\"let outer of items\">\n                    <li *ngFor=\"let middle of outer.items\">\n                      <div *ngFor=\"let inner of items\"\n                           (click)=\"onClick(outer, middle, inner)\"\n                           [title]=\"format(outer, middle, inner, component)\"\n                           >\n                        {{format(outer, middle, inner, component)}}\n                      </div>\n                    </li>\n                  </ul>`\n              })\n              export class MyComponent {\n                component = this;\n                format(outer: any, middle: any, inner: any) { }\n                onClick(outer: any, middle: any, inner: any) { }\n              }\n\n              @NgModule({declarations: [MyComponent], imports: [CommonModule]})\n              export class MyModule {}\n          "
            }
        };
        // The template should look like this (where IDENT is a wild card for an identifier):
        var template = "\n      const $c0$ = [\"ngFor\",\"\",\"ngForOf\",\"\"];\n      // ...\n      template:function MyComponent_Template(rf, $ctx$){\n        if (rf & 1) {\n          $i0$.\u0275C(0, MyComponent_ul_Template_0, null, _c0);\n        }\n        if (rf & 2) {\n          $i0$.\u0275p(0, \"ngForOf\", $i0$.\u0275b($ctx$.items));\n        }\n\n        function MyComponent_ul_Template_0(rf, $ctx0$) {\n          if (rf & 1) {\n            $i0$.\u0275E(0, \"ul\");\n            $i0$.\u0275C(1, MyComponent_ul_li_Template_1, null, _c0);\n            $i0$.\u0275e();\n          }\n          if (rf & 2) {\n            const $outer$ = $ctx0$.$implicit;\n            $i0$.\u0275p(1, \"ngForOf\", $i0$.\u0275b($outer$.items));\n          }\n          function MyComponent_ul_li_Template_1(rf, $ctx1$) {\n            if (rf & 1) {\n              $i0$.\u0275E(0, \"li\");\n              $i0$.\u0275C(1, MyComponent_ul_li_div_Template_1, null, _c0);\n              $i0$.\u0275e();\n            }\n            if (rf & 2) {\n              $i0$.\u0275p(1, \"ngForOf\", $i0$.\u0275b($ctx$.items));\n            }\n            function MyComponent_ul_li_div_Template_1(rf, $ctx2$) {\n              if (rf & 1) {\n                $i0$.\u0275E(0, \"div\");\n                $i0$.\u0275L(\"click\", function MyComponent_ul_li_div_Template_1_div_click_listener($event){\n                  const $outer$ = $ctx0$.$implicit;\n                  const $middle$ = $ctx1$.$implicit;\n                  const $inner$ = $ctx2$.$implicit;\n                  return ctx.onClick($outer$, $middle$, $inner$);\n                });\n                $i0$.\u0275T(1);\n                $i0$.\u0275e();\n              }\n              if (rf & 2) {\n                const $outer$ = $ctx0$.$implicit;\n                const $middle$ = $ctx1$.$implicit;\n                const $inner$ = $ctx2$.$implicit;\n                $i0$.\u0275p(0, \"title\", $i0$.\u0275b(ctx.format($outer$, $middle$, $inner$, $ctx$.component)));\n                $i0$.\u0275t(1, $i0$.\u0275i1(\" \", ctx.format($outer$, $middle$, $inner$, $ctx$.component), \" \"));\n              }\n            }\n          }\n        }\n      }";
        var result = mock_compile_1.compile(files, angularFiles);
        mock_compile_1.expectEmit(result.source, template, 'Incorrect template');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfdmlld19jb21waWxlcl90ZW1wbGF0ZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3Rlc3QvY29tcGxpYW5jZS9yM192aWV3X2NvbXBpbGVyX3RlbXBsYXRlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxrRUFBMEU7QUFDMUUsK0NBQW1EO0FBRW5ELFFBQVEsQ0FBQywrQkFBK0IsRUFBRTtJQUN4QyxJQUFNLFlBQVksR0FBRyxpQkFBSyxDQUFDO1FBQ3pCLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLGlCQUFpQixFQUFFLEtBQUs7UUFDeEIsYUFBYSxFQUFFLElBQUk7S0FDcEIsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHFEQUFxRCxFQUFFO1FBQ3hELElBQU0sS0FBSyxHQUFHO1lBQ1osR0FBRyxFQUFFO2dCQUNILFNBQVMsRUFBRSw0bENBMEJSO2FBQ0o7U0FDRixDQUFDO1FBRUYscUZBQXFGO1FBQ3JGLElBQU0sUUFBUSxHQUFHLCttRUFvRGIsQ0FBQztRQUVMLElBQU0sTUFBTSxHQUFHLHNCQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRTVDLHlCQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztJQUM1RCxDQUFDLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDIn0=