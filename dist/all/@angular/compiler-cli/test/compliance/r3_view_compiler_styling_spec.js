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
describe('compiler compliance: styling', function () {
    var angularFiles = test_util_1.setup({
        compileAngular: true,
        compileAnimations: false,
        compileCommon: true,
    });
    describe('[style] and [style.prop]', function () {
        it('should create style instructions on the element', function () {
            var files = {
                app: {
                    'spec.ts': "\n                import {Component, NgModule} from '@angular/core';\n\n                @Component({\n                  selector: 'my-component',\n                  template: `<div [style]=\"myStyleExp\"></div>`\n                })\n                export class MyComponent {\n                  myStyleExp = [{color:'red'}, {color:'blue', duration:1000}]\n                }\n\n                @NgModule({declarations: [MyComponent]})\n                export class MyModule {}\n            "
                }
            };
            var template = "\n          template: function MyComponent_Template(rf, $ctx$) {\n            if (rf & 1) {\n              $r3$.\u0275E(0, \"div\");\n              $r3$.\u0275s(null, null, $r3$.\u0275zss);\n              $r3$.\u0275e();\n            }\n            if (rf & 2) {\n              $r3$.\u0275sm(0, null, $ctx$.myStyleExp);\n              $r3$.\u0275sa(0);\n            }\n          }\n          ";
            var result = mock_compile_1.compile(files, angularFiles);
            mock_compile_1.expectEmit(result.source, template, 'Incorrect template');
        });
        it('should place initial, multi, singular and application followed by attribute style instructions in the template code in that order', function () {
            var files = {
                app: {
                    'spec.ts': "\n                import {Component, NgModule} from '@angular/core';\n\n                @Component({\n                  selector: 'my-component',\n                  template: `<div style=\"opacity:1\"\n                                   [attr.style]=\"'border-width: 10px'\"\n                                   [style.width]=\"myWidth\"\n                                   [style]=\"myStyleExp\"\n                                   [style.height]=\"myHeight\"></div>`\n                })\n                export class MyComponent {\n                  myStyleExp = [{color:'red'}, {color:'blue', duration:1000}]\n                  myWidth = '100px';\n                  myHeight = '100px';\n                }\n\n                @NgModule({declarations: [MyComponent]})\n                export class MyModule {}\n            "
                }
            };
            var template = "\n          const _c0 = [\"opacity\",\"width\",\"height\"," + 1 /* VALUES_MODE */ + ",\"opacity\",\"1\"];\n          \u2026\n          MyComponent.ngComponentDef = i0.\u0275defineComponent({\n              type: MyComponent,\n              selectors:[[\"my-component\"]],\n              factory:function MyComponent_Factory(){\n                return new MyComponent();\n              },\n              template: function MyComponent_Template(rf, $ctx$) {\n                if (rf & 1) {\n                  $r3$.\u0275E(0, \"div\");\n                  $r3$.\u0275s(null, _c0, $r3$.\u0275zss);\n                  $r3$.\u0275e();\n                }\n                if (rf & 2) {\n                  $r3$.\u0275sm(0, null, $ctx$.myStyleExp);\n                  $r3$.\u0275sp(0, 1, $ctx$.myWidth);\n                  $r3$.\u0275sp(0, 2, $ctx$.myHeight);\n                  $r3$.\u0275sa(0);\n                  $r3$.\u0275a(0, \"style\", $r3$.\u0275b(\"border-width: 10px\"), $r3$.\u0275zs);\n                }\n              }\n            });\n        ";
            var result = mock_compile_1.compile(files, angularFiles);
            mock_compile_1.expectEmit(result.source, template, 'Incorrect template');
        });
        it('should assign a sanitizer instance to the element style allocation instruction if any url-based properties are detected', function () {
            var files = {
                app: {
                    'spec.ts': "\n                import {Component, NgModule} from '@angular/core';\n\n                @Component({\n                  selector: 'my-component',\n                  template: `<div [style.background-image]=\"myImage\">`\n                })\n                export class MyComponent {\n                  myImage = 'url(foo.jpg)';\n                }\n\n                @NgModule({declarations: [MyComponent]})\n                export class MyModule {}\n            "
                }
            };
            var template = "\n          const _c0 = [\"background-image\"];\n          export class MyComponent {\n              constructor() {\n                  this.myImage = 'url(foo.jpg)';\n              }\n          }\n\n          MyComponent.ngComponentDef = i0.\u0275defineComponent({\n            type: MyComponent,\n            selectors: [[\"my-component\"]],\n            factory: function MyComponent_Factory() {\n              return new MyComponent();\n            },\n            template: function MyComponent_Template(rf, ctx) {\n              if (rf & 1) {\n                i0.\u0275E(0, \"div\");\n                i0.\u0275s(null, _c0, i0.\u0275zss);\n                i0.\u0275e();\n              }\n              if (rf & 2) {\n                i0.\u0275sp(0, 0, ctx.myImage);\n                i0.\u0275sa(0);\n              }\n            }\n          });\n        ";
            var result = mock_compile_1.compile(files, angularFiles);
            mock_compile_1.expectEmit(result.source, template, 'Incorrect template');
        });
    });
    describe('[class]', function () {
        it('should create class styling instructions on the element', function () {
            var files = {
                app: {
                    'spec.ts': "\n                import {Component, NgModule} from '@angular/core';\n\n                @Component({\n                  selector: 'my-component',\n                  template: `<div [class]=\"myClassExp\"></div>`\n                })\n                export class MyComponent {\n                  myClassExp = {'foo':true}\n                }\n\n                @NgModule({declarations: [MyComponent]})\n                export class MyModule {}\n            "
                }
            };
            var template = "\n          template: function MyComponent_Template(rf, $ctx$) {\n            if (rf & 1) {\n              $r3$.\u0275E(0, \"div\");\n              $r3$.\u0275s();\n              $r3$.\u0275e();\n            }\n            if (rf & 2) {\n              $r3$.\u0275sm(0,$ctx$.myClassExp);\n              $r3$.\u0275sa(0);\n            }\n          }\n          ";
            var result = mock_compile_1.compile(files, angularFiles);
            mock_compile_1.expectEmit(result.source, template, 'Incorrect template');
        });
        it('should place initial, multi, singular and application followed by attribute class instructions in the template code in that order', function () {
            var files = {
                app: {
                    'spec.ts': "\n                import {Component, NgModule} from '@angular/core';\n\n                @Component({\n                  selector: 'my-component',\n                  template: `<div class=\"grape\"\n                                   [attr.class]=\"'banana'\"\n                                   [class.apple]=\"yesToApple\"\n                                   [class]=\"myClassExp\"\n                                   [class.orange]=\"yesToOrange\"></div>`\n                })\n                export class MyComponent {\n                  myClassExp = {a:true, b:true};\n                  yesToApple = true;\n                  yesToOrange = true;\n                }\n\n                @NgModule({declarations: [MyComponent]})\n                export class MyModule {}\n            "
                }
            };
            var template = "\n          const _c0 = [\"grape\",\"apple\",\"orange\"," + 1 /* VALUES_MODE */ + ",\"grape\",true];\n          \u2026\n          MyComponent.ngComponentDef = i0.\u0275defineComponent({\n              type: MyComponent,\n              selectors:[[\"my-component\"]],\n              factory:function MyComponent_Factory(){\n                return new MyComponent();\n              },\n              template: function MyComponent_Template(rf, $ctx$) {\n                if (rf & 1) {\n                  $r3$.\u0275E(0, \"div\");\n                  $r3$.\u0275s(_c0);\n                  $r3$.\u0275e();\n                }\n                if (rf & 2) {\n                  $r3$.\u0275sm(0, $ctx$.myClassExp);\n                  $r3$.\u0275cp(0, 1, $ctx$.yesToApple);\n                  $r3$.\u0275cp(0, 2, $ctx$.yesToOrange);\n                  $r3$.\u0275sa(0);\n                  $r3$.\u0275a(0, \"class\", $r3$.\u0275b(\"banana\"));\n                }\n              }\n            });\n        ";
            var result = mock_compile_1.compile(files, angularFiles);
            mock_compile_1.expectEmit(result.source, template, 'Incorrect template');
        });
        it('should not generate the styling apply instruction if there are only static style/class attributes', function () {
            var files = {
                app: {
                    'spec.ts': "\n                import {Component, NgModule} from '@angular/core';\n\n                @Component({\n                  selector: 'my-component',\n                  template: `<div class=\"foo\"\n                                   style=\"width:100px\"\n                                   [attr.class]=\"'round'\"\n                                   [attr.style]=\"'height:100px'\"></div>`\n                })\n                export class MyComponent {}\n\n                @NgModule({declarations: [MyComponent]})\n                export class MyModule {}\n            "
                }
            };
            var template = "\n          const _c0 = [\"foo\"," + 1 /* VALUES_MODE */ + ",\"foo\",true];\n          const _c1 = [\"width\"," + 1 /* VALUES_MODE */ + ",\"width\",\"100px\"];\n          \u2026\n          MyComponent.ngComponentDef = i0.\u0275defineComponent({\n              type: MyComponent,\n              selectors:[[\"my-component\"]],\n              factory:function MyComponent_Factory(){\n                return new MyComponent();\n              },\n              template: function MyComponent_Template(rf, $ctx$) {\n                if (rf & 1) {\n                  $r3$.\u0275E(0, \"div\");\n                  $r3$.\u0275s(_c0, _c1);\n                  $r3$.\u0275e();\n                }\n                if (rf & 2) {\n                  $r3$.\u0275a(0, \"class\", $r3$.\u0275b(\"round\"));\n                  $r3$.\u0275a(0, \"style\", $r3$.\u0275b(\"height:100px\"), $r3$.\u0275zs);\n                }\n              }\n            });\n        ";
            var result = mock_compile_1.compile(files, angularFiles);
            mock_compile_1.expectEmit(result.source, template, 'Incorrect template');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfdmlld19jb21waWxlcl9zdHlsaW5nX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvdGVzdC9jb21wbGlhbmNlL3IzX3ZpZXdfY29tcGlsZXJfc3R5bGluZ19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsa0VBQTBFO0FBRTFFLCtDQUFtRDtBQUVuRCxRQUFRLENBQUMsOEJBQThCLEVBQUU7SUFDdkMsSUFBTSxZQUFZLEdBQUcsaUJBQUssQ0FBQztRQUN6QixjQUFjLEVBQUUsSUFBSTtRQUNwQixpQkFBaUIsRUFBRSxLQUFLO1FBQ3hCLGFBQWEsRUFBRSxJQUFJO0tBQ3BCLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQywwQkFBMEIsRUFBRTtRQUNuQyxFQUFFLENBQUMsaURBQWlELEVBQUU7WUFDcEQsSUFBTSxLQUFLLEdBQUc7Z0JBQ1osR0FBRyxFQUFFO29CQUNILFNBQVMsRUFBRSwyZUFhUjtpQkFDSjthQUNGLENBQUM7WUFFRixJQUFNLFFBQVEsR0FBRywwWUFZWixDQUFDO1lBRU4sSUFBTSxNQUFNLEdBQUcsc0JBQU8sQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDNUMseUJBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1FBQzVELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG1JQUFtSSxFQUNuSTtZQUNFLElBQU0sS0FBSyxHQUFHO2dCQUNaLEdBQUcsRUFBRTtvQkFDSCxTQUFTLEVBQUUsd3pCQW1CWDtpQkFDRDthQUNGLENBQUM7WUFFRixJQUFNLFFBQVEsR0FBRywwaENBd0JqQixDQUFDO1lBRUQsSUFBTSxNQUFNLEdBQUcsc0JBQU8sQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDNUMseUJBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1FBQzVELENBQUMsQ0FBQyxDQUFDO1FBRU4sRUFBRSxDQUFDLHlIQUF5SCxFQUN6SDtZQUNFLElBQU0sS0FBSyxHQUFHO2dCQUNaLEdBQUcsRUFBRTtvQkFDSCxTQUFTLEVBQUUsaWRBYVg7aUJBQ0Q7YUFDRixDQUFDO1lBRUYsSUFBTSxRQUFRLEdBQUcsNjFCQTBCakIsQ0FBQztZQUVELElBQU0sTUFBTSxHQUFHLHNCQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQzVDLHlCQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNsQixFQUFFLENBQUMseURBQXlELEVBQUU7WUFDNUQsSUFBTSxLQUFLLEdBQUc7Z0JBQ1osR0FBRyxFQUFFO29CQUNILFNBQVMsRUFBRSx5Y0FhUjtpQkFDSjthQUNGLENBQUM7WUFFRixJQUFNLFFBQVEsR0FBRyx5V0FZWixDQUFDO1lBRU4sSUFBTSxNQUFNLEdBQUcsc0JBQU8sQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDNUMseUJBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1FBQzVELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG1JQUFtSSxFQUNuSTtZQUNFLElBQU0sS0FBSyxHQUFHO2dCQUNaLEdBQUcsRUFBRTtvQkFDSCxTQUFTLEVBQUUsaXhCQW1CWDtpQkFDRDthQUNGLENBQUM7WUFFRixJQUFNLFFBQVEsR0FBRyxvK0JBd0JqQixDQUFDO1lBRUQsSUFBTSxNQUFNLEdBQUcsc0JBQU8sQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDNUMseUJBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1FBQzVELENBQUMsQ0FBQyxDQUFDO1FBRU4sRUFBRSxDQUFDLG1HQUFtRyxFQUNuRztZQUNFLElBQU0sS0FBSyxHQUFHO2dCQUNaLEdBQUcsRUFBRTtvQkFDSCxTQUFTLEVBQUUsNGpCQWNYO2lCQUNEO2FBQ0YsQ0FBQztZQUVGLElBQU0sUUFBUSxHQUFHLGc3QkFzQmpCLENBQUM7WUFFRCxJQUFNLE1BQU0sR0FBRyxzQkFBTyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztZQUM1Qyx5QkFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=