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
describe('compiler compliance: dependency injection', function () {
    var angularFiles = test_util_1.setup({
        compileAngular: true,
        compileAnimations: false,
        compileCommon: true,
    });
    it('should create factory methods', function () {
        var files = {
            app: {
                'spec.ts': "\n              import {Component, NgModule, Injectable, Attribute, Host, SkipSelf, Self, Optional} from '@angular/core';\n              import {CommonModule} from '@angular/common';\n\n              @Injectable()\n              export class MyService {}\n\n              @Component({\n                selector: 'my-component',\n                template: ``\n              })\n              export class MyComponent {\n                constructor(\n                  @Attribute('name') name:string,\n                  s1: MyService, \n                  @Host() s2: MyService,\n                  @Self() s4: MyService,\n                  @SkipSelf() s3: MyService,\n                  @Optional() s5: MyService,\n                  @Self() @Optional() s6: MyService,\n                ) {}\n              }\n\n              @NgModule({declarations: [MyComponent], imports: [CommonModule], providers: [MyService]})\n              export class MyModule {}\n          "
            }
        };
        var factory = "\n      factory: function MyComponent_Factory() {\n        return new MyComponent(\n          $r3$.\u0275injectAttribute('name'),\n          $r3$.\u0275directiveInject(MyService), \n          $r3$.\u0275directiveInject(MyService, 1),\n          $r3$.\u0275directiveInject(MyService, 2),\n          $r3$.\u0275directiveInject(MyService, 4),\n          $r3$.\u0275directiveInject(MyService, 8),\n          $r3$.\u0275directiveInject(MyService, 10)\n        );\n      }";
        var result = mock_compile_1.compile(files, angularFiles);
        mock_compile_1.expectEmit(result.source, factory, 'Incorrect factory');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfdmlld19jb21waWxlcl9kaV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3Rlc3QvY29tcGxpYW5jZS9yM192aWV3X2NvbXBpbGVyX2RpX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxrRUFBMEU7QUFDMUUsK0NBQW1EO0FBRW5ELFFBQVEsQ0FBQywyQ0FBMkMsRUFBRTtJQUNwRCxJQUFNLFlBQVksR0FBRyxpQkFBSyxDQUFDO1FBQ3pCLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLGlCQUFpQixFQUFFLEtBQUs7UUFDeEIsYUFBYSxFQUFFLElBQUk7S0FDcEIsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLCtCQUErQixFQUFFO1FBQ2xDLElBQU0sS0FBSyxHQUFHO1lBQ1osR0FBRyxFQUFFO2dCQUNILFNBQVMsRUFBRSxtOEJBeUJSO2FBQ0o7U0FDRixDQUFDO1FBRUYsSUFBTSxPQUFPLEdBQUcsb2RBV1osQ0FBQztRQUdMLElBQU0sTUFBTSxHQUFHLHNCQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRTVDLHlCQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUMxRCxDQUFDLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDIn0=