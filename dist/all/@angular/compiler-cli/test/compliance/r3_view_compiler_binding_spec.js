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
describe('compiler compliance: bindings', function () {
    var angularFiles = test_util_1.setup({
        compileAngular: true,
        compileAnimations: false,
        compileCommon: false,
    });
    describe('text bindings', function () {
        it('should generate interpolation instruction', function () {
            var files = {
                app: {
                    'example.ts': "\n          import {Component, NgModule} from '@angular/core';\n          @Component({\n            selector: 'my-component',\n            template: `\n              <div>Hello {{ name }}</div>`\n          })\n          export class MyComponent {\n            name = 'World';\n          }\n          @NgModule({declarations: [MyComponent]})\n          export class MyModule {}\n          "
                }
            };
            var template = "\n      template:function MyComponent_Template(rf, $ctx$){\n        if (rf & 1) {\n          $i0$.\u0275E(0, \"div\");\n          $i0$.\u0275T(1);\n          $i0$.\u0275e();\n        }\n        if (rf & 2) {\n          $i0$.\u0275t(1, $i0$.\u0275i1(\"Hello \", $ctx$.name, \"\"));\n        }\n      }";
            var result = mock_compile_1.compile(files, angularFiles);
            mock_compile_1.expectEmit(result.source, template, 'Incorrect interpolated text binding');
        });
    });
    describe('property bindings', function () {
        it('should generate bind instruction', function () {
            var files = {
                app: {
                    'example.ts': "\n          import {Component, NgModule} from '@angular/core';\n\n          @Component({\n            selector: 'my-app',\n            template: '<a [title]=\"title\"></a>'\n          })\n          export class MyComponent {\n            title = 'Hello World';\n          }\n\n          @NgModule({declarations: [MyComponent]})\n          export class MyModule {}"
                }
            };
            var template = "\n      template:function MyComponent_Template(rf, $ctx$){\n        if (rf & 1) {\n          $i0$.\u0275Ee(0, \"a\");\n        }\n        if (rf & 2) {\n          $i0$.\u0275p(0, \"title\", $i0$.\u0275b($ctx$.title));\n        }\n      }";
            var result = mock_compile_1.compile(files, angularFiles);
            mock_compile_1.expectEmit(result.source, template, 'Incorrect property binding');
        });
        it('should generate interpolation instruction for {{...}} bindings', function () {
            var files = {
                app: {
                    'example.ts': "\n          import {Component, NgModule} from '@angular/core';\n          @Component({\n            selector: 'my-component',\n            template: `\n              <a title=\"Hello {{name}}\"></a>`\n          })\n          export class MyComponent {\n            name = 'World';\n          }\n          @NgModule({declarations: [MyComponent]})\n          export class MyModule {}\n          "
                }
            };
            var template = "\n      template:function MyComponent_Template(rf, $ctx$){\n        if (rf & 1) {\n          $i0$.\u0275Ee(0, \"a\");\n        }\n        if (rf & 2) {\n          $i0$.\u0275p(0, \"title\", $i0$.\u0275i1(\"Hello \", $ctx$.name, \"\"));\n        }\n      }";
            var result = mock_compile_1.compile(files, angularFiles);
            mock_compile_1.expectEmit(result.source, template, 'Incorrect interpolated property binding');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfdmlld19jb21waWxlcl9iaW5kaW5nX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvdGVzdC9jb21wbGlhbmNlL3IzX3ZpZXdfY29tcGlsZXJfYmluZGluZ19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsa0VBQTBFO0FBQzFFLCtDQUFtRDtBQUVuRCxRQUFRLENBQUMsK0JBQStCLEVBQUU7SUFDeEMsSUFBTSxZQUFZLEdBQUcsaUJBQUssQ0FBQztRQUN6QixjQUFjLEVBQUUsSUFBSTtRQUNwQixpQkFBaUIsRUFBRSxLQUFLO1FBQ3hCLGFBQWEsRUFBRSxLQUFLO0tBQ3JCLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxlQUFlLEVBQUU7UUFDeEIsRUFBRSxDQUFDLDJDQUEyQyxFQUFFO1lBQzlDLElBQU0sS0FBSyxHQUFrQjtnQkFDM0IsR0FBRyxFQUFFO29CQUNILFlBQVksRUFBRSxzWUFZYjtpQkFDRjthQUNGLENBQUM7WUFFRixJQUFNLFFBQVEsR0FBRyw4U0FVZixDQUFDO1lBQ0gsSUFBTSxNQUFNLEdBQUcsc0JBQU8sQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDNUMseUJBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxxQ0FBcUMsQ0FBQyxDQUFDO1FBQzdFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsbUJBQW1CLEVBQUU7UUFDNUIsRUFBRSxDQUFDLGtDQUFrQyxFQUFFO1lBQ3JDLElBQU0sS0FBSyxHQUFrQjtnQkFDM0IsR0FBRyxFQUFFO29CQUNILFlBQVksRUFBRSw2V0FZVztpQkFDMUI7YUFDRixDQUFDO1lBRUYsSUFBTSxRQUFRLEdBQUcsK09BUWYsQ0FBQztZQUNILElBQU0sTUFBTSxHQUFHLHNCQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQzVDLHlCQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztRQUNwRSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxnRUFBZ0UsRUFBRTtZQUNuRSxJQUFNLEtBQUssR0FBa0I7Z0JBQzNCLEdBQUcsRUFBRTtvQkFDSCxZQUFZLEVBQUUsMllBWWI7aUJBQ0Y7YUFDRixDQUFDO1lBRUYsSUFBTSxRQUFRLEdBQUcsaVFBUWYsQ0FBQztZQUNILElBQU0sTUFBTSxHQUFHLHNCQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQzVDLHlCQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUseUNBQXlDLENBQUMsQ0FBQztRQUNqRixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUwsQ0FBQyxDQUFDLENBQUMifQ==