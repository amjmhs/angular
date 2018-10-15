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
var TRANSLATION_NAME_REGEXP = /^MSG_[A-Z0-9]+/;
describe('i18n support in the view compiler', function () {
    var angularFiles = test_util_1.setup({
        compileAngular: true,
        compileAnimations: false,
        compileCommon: true,
    });
    describe('single text nodes', function () {
        it('should translate single text nodes with the i18n attribute', function () {
            var files = {
                app: {
                    'spec.ts': "\n            import {Component, NgModule} from '@angular/core';\n\n            @Component({\n              selector: 'my-component',\n              template: `\n                <div i18n>Hello world</div>\n                <div>&</div>\n                <div i18n>farewell</div>\n                <div i18n>farewell</div>\n              `\n            })\n            export class MyComponent {}\n\n            @NgModule({declarations: [MyComponent]})\n            export class MyModule {}\n        "
                }
            };
            var template = "\n      const $msg_1$ = goog.getMsg(\"Hello world\");\n      const $msg_2$ = goog.getMsg(\"farewell\");\n      \u2026\n      template: function MyComponent_Template(rf, ctx) {\n        if (rf & 1) {\n          \u2026\n          $r3$.\u0275T(1, $msg_1$);\n          \u2026\n          $r3$.\u0275T(3,\"&\");\n          \u2026\n          $r3$.\u0275T(5, $msg_2$);\n          \u2026\n          $r3$.\u0275T(7, $msg_2$);\n          \u2026\n        }\n      }\n    ";
            var result = mock_compile_1.compile(files, angularFiles);
            mock_compile_1.expectEmit(result.source, template, 'Incorrect template', {
                '$msg_1$': TRANSLATION_NAME_REGEXP,
                '$msg_2$': TRANSLATION_NAME_REGEXP,
            });
        });
        it('should add the meaning and description as JsDoc comments', function () {
            var files = {
                app: {
                    'spec.ts': "\n            import {Component, NgModule} from '@angular/core';\n\n            @Component({\n              selector: 'my-component',\n              template: `\n                <div i18n=\"meaning|desc@@id\" i18n-title=\"desc\" title=\"introduction\">Hello world</div>\n              `\n            })\n            export class MyComponent {}\n\n            @NgModule({declarations: [MyComponent]})\n            export class MyModule {}\n        "
                }
            };
            var template = "\n      /**\n       * @desc desc\n       */\n      const $msg_1$ = goog.getMsg(\"introduction\");\n      const $c1$ = [\"title\", $msg_1$];\n      \u2026\n      /**\n       * @desc desc\n       * @meaning meaning\n       */\n      const $msg_2$ = goog.getMsg(\"Hello world\");\n      \u2026\n      template: function MyComponent_Template(rf, ctx) {\n        if (rf & 1) {\n          $r3$.\u0275E(0, \"div\", $c1$);\n          $r3$.\u0275T(1, $msg_2$);\n          $r3$.\u0275e();\n        }\n      }\n      ";
            var result = mock_compile_1.compile(files, angularFiles);
            mock_compile_1.expectEmit(result.source, template, 'Incorrect template', {
                '$msg_1$': TRANSLATION_NAME_REGEXP,
            });
        });
    });
    describe('static attributes', function () {
        it('should translate static attributes', function () {
            var files = {
                app: {
                    'spec.ts': "\n            import {Component, NgModule} from '@angular/core';\n\n            @Component({\n              selector: 'my-component',\n              template: `\n                <div i18n id=\"static\" i18n-title=\"m|d\" title=\"introduction\"></div>\n              `\n            })\n            export class MyComponent {}\n\n            @NgModule({declarations: [MyComponent]})\n            export class MyModule {}\n        "
                }
            };
            var template = "\n      /**\n       * @desc d\n       * @meaning m\n       */\n      const $msg_1$ = goog.getMsg(\"introduction\");\n      const $c1$ = [\"id\", \"static\", \"title\", $msg_1$];\n      \u2026\n      template: function MyComponent_Template(rf, ctx) {\n        if (rf & 1) {\n          $r3$.\u0275Ee(0, \"div\", $c1$);\n        }\n      }\n    ";
            var result = mock_compile_1.compile(files, angularFiles);
            mock_compile_1.expectEmit(result.source, template, 'Incorrect template', {
                '$msg_1$': TRANSLATION_NAME_REGEXP,
            });
        });
    });
    // TODO(vicb): this feature is not supported yet
    xdescribe('nested nodes', function () {
        it('should generate the placeholders maps', function () {
            var files = {
                app: {
                    'spec.ts': "\n            import {Component, NgModule} from '@angular/core';\n\n            @Component({\n              selector: 'my-component',\n              template: `\n                <div i18n>Hello <b>{{name}}<i>!</i><i>!</i></b></div>\n                <div>Other</div>\n                <div i18n>2nd</div>\n                <div i18n><i>3rd</i></div>\n              `\n            })\n            export class MyComponent {}\n\n            @NgModule({declarations: [MyComponent]})\n            export class MyModule {}\n        "
                }
            };
            var template = "\n      const $r1$ = {\"b\":[2], \"i\":[4, 6]};\n      const $r2$ = {\"i\":[13]};\n    ";
            var result = mock_compile_1.compile(files, angularFiles);
            mock_compile_1.expectEmit(result.source, template, 'Incorrect template');
        });
    });
    describe('errors', function () {
        it('should throw on nested i18n sections', function () {
            var files = {
                app: {
                    'spec.ts': "\n            import {Component, NgModule} from '@angular/core';\n\n            @Component({\n              selector: 'my-component',\n              template: `\n                <div i18n><div i18n></div></div>\n              `\n            })\n            export class MyComponent {}\n\n            @NgModule({declarations: [MyComponent]})\n            export class MyModule {}\n        "
                }
            };
            expect(function () { return mock_compile_1.compile(files, angularFiles); })
                .toThrowError('Could not mark an element as translatable inside of a translatable section');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfdmlld19jb21waWxlcl9pMThuX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvdGVzdC9jb21wbGlhbmNlL3IzX3ZpZXdfY29tcGlsZXJfaTE4bl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsa0VBQTBFO0FBQzFFLCtDQUFtRDtBQUVuRCxJQUFNLHVCQUF1QixHQUFHLGdCQUFnQixDQUFDO0FBRWpELFFBQVEsQ0FBQyxtQ0FBbUMsRUFBRTtJQUM1QyxJQUFNLFlBQVksR0FBRyxpQkFBSyxDQUFDO1FBQ3pCLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLGlCQUFpQixFQUFFLEtBQUs7UUFDeEIsYUFBYSxFQUFFLElBQUk7S0FDcEIsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLG1CQUFtQixFQUFFO1FBQzVCLEVBQUUsQ0FBQyw0REFBNEQsRUFBRTtZQUMvRCxJQUFNLEtBQUssR0FBRztnQkFDWixHQUFHLEVBQUU7b0JBQ0gsU0FBUyxFQUFFLG1mQWdCWjtpQkFDQTthQUNGLENBQUM7WUFFRixJQUFNLFFBQVEsR0FBRyw2Y0FpQmxCLENBQUM7WUFFQSxJQUFNLE1BQU0sR0FBRyxzQkFBTyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztZQUM1Qyx5QkFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLG9CQUFvQixFQUFFO2dCQUN4RCxTQUFTLEVBQUUsdUJBQXVCO2dCQUNsQyxTQUFTLEVBQUUsdUJBQXVCO2FBQ25DLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBEQUEwRCxFQUFFO1lBQzdELElBQU0sS0FBSyxHQUFHO2dCQUNaLEdBQUcsRUFBRTtvQkFDSCxTQUFTLEVBQUUsaWNBYVo7aUJBQ0E7YUFDRixDQUFDO1lBRUYsSUFBTSxRQUFRLEdBQUcsNGZBb0JoQixDQUFDO1lBRUYsSUFBTSxNQUFNLEdBQUcsc0JBQU8sQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDNUMseUJBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxvQkFBb0IsRUFBRTtnQkFDeEQsU0FBUyxFQUFFLHVCQUF1QjthQUNuQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLG1CQUFtQixFQUFFO1FBQzVCLEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRTtZQUN2QyxJQUFNLEtBQUssR0FBRztnQkFDWixHQUFHLEVBQUU7b0JBQ0gsU0FBUyxFQUFFLDhhQWFaO2lCQUNBO2FBQ0YsQ0FBQztZQUVGLElBQU0sUUFBUSxHQUFHLHdWQWFsQixDQUFDO1lBRUEsSUFBTSxNQUFNLEdBQUcsc0JBQU8sQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDNUMseUJBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxvQkFBb0IsRUFBRTtnQkFDeEQsU0FBUyxFQUFFLHVCQUF1QjthQUNuQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsZ0RBQWdEO0lBQ2hELFNBQVMsQ0FBQyxjQUFjLEVBQUU7UUFDeEIsRUFBRSxDQUFDLHVDQUF1QyxFQUFFO1lBQzFDLElBQU0sS0FBSyxHQUFHO2dCQUNaLEdBQUcsRUFBRTtvQkFDSCxTQUFTLEVBQUUsOGdCQWdCWjtpQkFDQTthQUNGLENBQUM7WUFFRixJQUFNLFFBQVEsR0FBRyx5RkFHbEIsQ0FBQztZQUVBLElBQU0sTUFBTSxHQUFHLHNCQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQzVDLHlCQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFFBQVEsRUFBRTtRQUNqQixFQUFFLENBQUMsc0NBQXNDLEVBQUU7WUFDekMsSUFBTSxLQUFLLEdBQUc7Z0JBQ1osR0FBRyxFQUFFO29CQUNILFNBQVMsRUFBRSxzWUFhWjtpQkFDQTthQUNGLENBQUM7WUFFRixNQUFNLENBQUMsY0FBTSxPQUFBLHNCQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxFQUE1QixDQUE0QixDQUFDO2lCQUNyQyxZQUFZLENBQ1QsNEVBQTRFLENBQUMsQ0FBQztRQUN4RixDQUFDLENBQUMsQ0FBQztJQUVMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==