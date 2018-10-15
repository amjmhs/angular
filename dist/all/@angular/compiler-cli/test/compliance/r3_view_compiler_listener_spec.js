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
/* These tests are codified version of the tests in compiler_canonical_spec.ts. Every
  * test in compiler_canonical_spec.ts should have a corresponding test here.
  */
describe('compiler compliance: listen()', function () {
    var angularFiles = test_util_1.setup({
        compileAngular: true,
        compileAnimations: false,
        compileCommon: true,
    });
    it('should create listener instruction on element', function () {
        var files = {
            app: {
                'spec.ts': "\n              import {Component, NgModule} from '@angular/core';\n\n              @Component({\n                selector: 'my-component',\n                template: `<div (click)=\"onClick($event); 1 == 2\"></div>`\n              })\n              export class MyComponent {\n                onClick(event: any) {}\n              }\n\n              @NgModule({declarations: [MyComponent]})\n              export class MyModule {}\n          "
            }
        };
        // The template should look like this (where IDENT is a wild card for an identifier):
        var template = "\n        template: function MyComponent_Template(rf, ctx) {\n          if (rf & 1) {\n            $r3$.\u0275E(0, \"div\");\n            $r3$.\u0275L(\"click\", function MyComponent_Template_div_click_listener($event) {\n              ctx.onClick($event);\n              return (1 == 2);\n            });\n            $r3$.\u0275e();\n          }\n        }\n        ";
        var result = mock_compile_1.compile(files, angularFiles);
        mock_compile_1.expectEmit(result.source, template, 'Incorrect template');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfdmlld19jb21waWxlcl9saXN0ZW5lcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3Rlc3QvY29tcGxpYW5jZS9yM192aWV3X2NvbXBpbGVyX2xpc3RlbmVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxrRUFBMEU7QUFDMUUsK0NBQW1EO0FBRW5EOztJQUVJO0FBQ0osUUFBUSxDQUFDLCtCQUErQixFQUFFO0lBQ3hDLElBQU0sWUFBWSxHQUFHLGlCQUFLLENBQUM7UUFDekIsY0FBYyxFQUFFLElBQUk7UUFDcEIsaUJBQWlCLEVBQUUsS0FBSztRQUN4QixhQUFhLEVBQUUsSUFBSTtLQUNwQixDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsK0NBQStDLEVBQUU7UUFDbEQsSUFBTSxLQUFLLEdBQUc7WUFDWixHQUFHLEVBQUU7Z0JBQ0gsU0FBUyxFQUFFLDZiQWFSO2FBQ0o7U0FDRixDQUFDO1FBRUYscUZBQXFGO1FBQ3JGLElBQU0sUUFBUSxHQUFHLGtYQVdaLENBQUM7UUFFTixJQUFNLE1BQU0sR0FBRyxzQkFBTyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztRQUU1Qyx5QkFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLG9CQUFvQixDQUFDLENBQUM7SUFDNUQsQ0FBQyxDQUFDLENBQUM7QUFFTCxDQUFDLENBQUMsQ0FBQyJ9