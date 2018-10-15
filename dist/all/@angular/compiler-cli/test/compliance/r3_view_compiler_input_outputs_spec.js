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
describe('compiler compliance: listen()', function () {
    var angularFiles = test_util_1.setup({
        compileAngular: true,
        compileAnimations: false,
        compileCommon: true,
    });
    it('should create declare inputs/outputs', function () {
        var files = {
            app: {
                'spec.ts': "\n              import {Component, Directive, NgModule, Input, Output} from '@angular/core';\n\n              @Component({\n                selector: 'my-component',\n                template: ``\n              })\n              export class MyComponent {\n                @Input() componentInput;\n                @Input('renamedComponentInput') originalComponentInput;\n\n                @Output() componentOutput;\n                @Output('renamedComponentOutput') originalComponentOutput;\n              }\n\n              @Directive({\n                selector: '[my-directive]',\n              })\n              export class MyDirective {\n                @Input() directiveInput;\n                @Input('renamedDirectiveInput') originalDirectiveInput;\n\n                @Output() directiveOutput;\n                @Output('renamedDirectiveOutput') originalDirectiveOutput;\n              }\n\n              @NgModule({declarations: [MyComponent, MyDirective]})\n              export class MyModule {}\n          "
            }
        };
        var componentDef = "\n      MyComponent.ngComponentDef = IDENT.\u0275defineComponent({\n          \u2026\n          inputs:{\n            componentInput: \"componentInput\",\n            originalComponentInput: \"renamedComponentInput\"\n          },\n          outputs: {\n            componentOutput: \"componentOutput\",\n            originalComponentOutput: \"renamedComponentOutput\"\n          }\n          \u2026\n        });";
        var directiveDef = "\n      MyDirective.ngDirectiveDef = IDENT.\u0275defineDirective({\n        \u2026\n        inputs:{\n          directiveInput: \"directiveInput\",\n          originalDirectiveInput: \"renamedDirectiveInput\"\n        },\n        outputs: {\n          directiveOutput: \"directiveOutput\",\n          originalDirectiveOutput: \"renamedDirectiveOutput\"\n        }\n        \u2026\n      });";
        var result = mock_compile_1.compile(files, angularFiles);
        mock_compile_1.expectEmit(result.source, componentDef, 'Incorrect component definition');
        mock_compile_1.expectEmit(result.source, directiveDef, 'Incorrect directive definition');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfdmlld19jb21waWxlcl9pbnB1dF9vdXRwdXRzX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvdGVzdC9jb21wbGlhbmNlL3IzX3ZpZXdfY29tcGlsZXJfaW5wdXRfb3V0cHV0c19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsa0VBQTBFO0FBQzFFLCtDQUFtRDtBQUVuRCxRQUFRLENBQUMsK0JBQStCLEVBQUU7SUFDeEMsSUFBTSxZQUFZLEdBQUcsaUJBQUssQ0FBQztRQUN6QixjQUFjLEVBQUUsSUFBSTtRQUNwQixpQkFBaUIsRUFBRSxLQUFLO1FBQ3hCLGFBQWEsRUFBRSxJQUFJO0tBQ3BCLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRTtRQUN6QyxJQUFNLEtBQUssR0FBRztZQUNaLEdBQUcsRUFBRTtnQkFDSCxTQUFTLEVBQUUsKy9CQTRCUjthQUNKO1NBQ0YsQ0FBQztRQUVGLElBQU0sWUFBWSxHQUFHLDhaQVliLENBQUM7UUFFVCxJQUFNLFlBQVksR0FBRyx3WUFZZixDQUFDO1FBR1AsSUFBTSxNQUFNLEdBQUcsc0JBQU8sQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFNUMseUJBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQzFFLHlCQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztJQUM1RSxDQUFDLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDIn0=