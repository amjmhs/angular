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
describe('mock_compiler', function () {
    // This produces a MockDirectory of the file needed to compile an Angular application.
    // This setup is performed in a beforeAll which populates the map returned.
    var angularFiles = test_util_1.setup({
        compileAngular: true,
        compileAnimations: false,
        compileCommon: true,
    });
    describe('compiling', function () {
        // To use compile you need to supply the files in a MockDirectory that can be merged
        // with a set of "environment" files such as the angular files.
        it('should be able to compile a simple application', function () {
            var files = {
                app: {
                    'hello.component.ts': "\n            import {Component, Input} from '@angular/core';\n\n            @Component({template: 'Hello {{name}}!'})\n            export class HelloComponent {\n              @Input() name: string = 'world';\n            }\n          ",
                    'hello.module.ts': "\n            import {NgModule} from '@angular/core';\n            import {HelloComponent} from './hello.component';\n\n            @NgModule({declarations: [HelloComponent]})\n            export class HelloModule {}\n          "
                }
            };
            var result = mock_compile_1.compile(files, angularFiles);
            // result.source contains just the emitted factory declarations regardless of the original
            // module.
            expect(result.source).toContain('Hello');
        });
    });
    describe('expecting emitted output', function () {
        it('should be able to find a simple expression in the output', function () {
            var files = {
                app: {
                    'hello.component.ts': "\n            import {Component, Input} from '@angular/core';\n\n            @Component({template: 'Hello {{name}}! Your name as {{name.length}} characters'})\n            export class HelloComponent {\n              @Input() name: string = 'world';\n            }\n          ",
                    'hello.module.ts': "\n            import {NgModule} from '@angular/core';\n            import {HelloComponent} from './hello.component';\n\n            @NgModule({declarations: [HelloComponent]})\n            export class HelloModule {}\n          "
                }
            };
            var result = mock_compile_1.compile(files, angularFiles);
            // The expression can expected directly.
            mock_compile_1.expectEmit(result.source, 'name.length', 'name length expression not found');
            // Whitespace is not significant
            mock_compile_1.expectEmit(result.source, 'name   \n\n   .  \n    length', 'name length expression not found (whitespace)');
        });
    });
    it('should be able to skip untested regions (… and // ...)', function () {
        var files = {
            app: {
                'hello.component.ts': "\n          import {Component, Input} from '@angular/core';\n\n          @Component({template: 'Hello {{name}}! Your name as {{name.length}} characters'})\n          export class HelloComponent {\n            @Input() name: string = 'world';\n          }\n        ",
                'hello.module.ts': "\n          import {NgModule} from '@angular/core';\n          import {HelloComponent} from './hello.component';\n\n          @NgModule({declarations: [HelloComponent]})\n          export class HelloModule {}\n        "
            }
        };
        var result = mock_compile_1.compile(files, angularFiles);
        // The special character … means anything can be generated between the two sections allowing
        // skipping sections of the output that are not under test. The ellipsis unicode char (…) is
        // used instead of '...' because '...' is legal JavaScript (the spread operator) and might
        // need to be tested. `// ...` could also be used in place of `…`.
        mock_compile_1.expectEmit(result.source, 'ctx.name … ctx.name.length', 'could not find correct length access');
        mock_compile_1.expectEmit(result.source, 'ctx.name // ... ctx.name.length', 'could not find correct length access');
    });
    it('should be able to skip TODO comments (// TODO)', function () {
        var files = {
            app: {
                'hello.component.ts': "\n          import {Component, Input} from '@angular/core';\n\n          @Component({template: 'Hello!'})\n          export class HelloComponent { }\n        ",
                'hello.module.ts': "\n          import {NgModule} from '@angular/core';\n          import {HelloComponent} from './hello.component';\n\n          @NgModule({declarations: [HelloComponent]})\n          export class HelloModule {}\n        "
            }
        };
        var result = mock_compile_1.compile(files, angularFiles);
        mock_compile_1.expectEmit(result.source, "\n    // TODO: this comment should not be taken into account\n    $r3$.\u0275T(0, \"Hello!\");\n    // TODO: this comment should not be taken into account\n    ", 'todo comments should be ignored');
    });
    it('should be able to enforce consistent identifiers', function () {
        var files = {
            app: {
                'hello.component.ts': "\n          import {Component, Input} from '@angular/core';\n\n          @Component({template: 'Hello {{name}}! Your name as {{name.length}} characters'})\n          export class HelloComponent {\n            @Input() name: string = 'world';\n          }\n        ",
                'hello.module.ts': "\n          import {NgModule} from '@angular/core';\n          import {HelloComponent} from './hello.component';\n\n          @NgModule({declarations: [HelloComponent]})\n          export class HelloModule {}\n        "
            }
        };
        var result = mock_compile_1.compile(files, angularFiles);
        // IDENT can be used a wild card for any identifier
        mock_compile_1.expectEmit(result.source, 'IDENT.name', 'could not find context access');
        // $<ident>$ can be used as a wild-card but all the content matched by the identifiers must
        // match each other.
        // This is useful if the code generator is free to invent a name but should use the name
        // consistently.
        mock_compile_1.expectEmit(result.source, '$ctx$.$name$ … $ctx$.$name$.length', 'could not find correct length access');
    });
    it('should be able to enforce that identifiers match a regexp', function () {
        var files = {
            app: {
                'hello.component.ts': "\n          import {Component, Input} from '@angular/core';\n\n          @Component({template: 'Hello {{name}}! Your name as {{name.length}} characters'})\n          export class HelloComponent {\n            @Input() name: string = 'world';\n          }\n        ",
                'hello.module.ts': "\n          import {NgModule} from '@angular/core';\n          import {HelloComponent} from './hello.component';\n\n          @NgModule({declarations: [HelloComponent]})\n          export class HelloModule {}\n        "
            }
        };
        var result = mock_compile_1.compile(files, angularFiles);
        // Pass: `$n$` ends with `ME` in the generated code
        mock_compile_1.expectEmit(result.source, '$ctx$.$n$ … $ctx$.$n$.length', 'Match names', { '$n$': /ME$/i });
        // Fail: `$n$` does not match `/(not)_(\1)/` in the generated code
        expect(function () {
            mock_compile_1.expectEmit(result.source, '$ctx$.$n$ … $ctx$.$n$.length', 'Match names', { '$n$': /(not)_(\1)/ });
        }).toThrowError(/"\$n\$" is "name" which doesn't match \/\(not\)_\(\\1\)\//);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9ja19jb21waWxlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3Rlc3QvY29tcGxpYW5jZS9tb2NrX2NvbXBpbGVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCxrRUFBMEU7QUFDMUUsK0NBQW1EO0FBRW5ELFFBQVEsQ0FBQyxlQUFlLEVBQUU7SUFDeEIsc0ZBQXNGO0lBQ3RGLDJFQUEyRTtJQUMzRSxJQUFNLFlBQVksR0FBRyxpQkFBSyxDQUFDO1FBQ3pCLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLGlCQUFpQixFQUFFLEtBQUs7UUFDeEIsYUFBYSxFQUFFLElBQUk7S0FDcEIsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUNwQixvRkFBb0Y7UUFDcEYsK0RBQStEO1FBQy9ELEVBQUUsQ0FBQyxnREFBZ0QsRUFBRTtZQUNuRCxJQUFNLEtBQUssR0FBRztnQkFDWixHQUFHLEVBQUU7b0JBQ0gsb0JBQW9CLEVBQUUsOE9BT3JCO29CQUNELGlCQUFpQixFQUFFLHNPQU1sQjtpQkFDRjthQUNGLENBQUM7WUFDRixJQUFNLE1BQU0sR0FBRyxzQkFBTyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztZQUU1QywwRkFBMEY7WUFDMUYsVUFBVTtZQUNWLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsMEJBQTBCLEVBQUU7UUFDbkMsRUFBRSxDQUFDLDBEQUEwRCxFQUFFO1lBQzdELElBQU0sS0FBSyxHQUFHO2dCQUNaLEdBQUcsRUFBRTtvQkFDSCxvQkFBb0IsRUFBRSxzUkFPckI7b0JBQ0QsaUJBQWlCLEVBQUUsc09BTWxCO2lCQUNGO2FBQ0YsQ0FBQztZQUVGLElBQU0sTUFBTSxHQUFHLHNCQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBRTVDLHdDQUF3QztZQUN4Qyx5QkFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsYUFBYSxFQUFFLGtDQUFrQyxDQUFDLENBQUM7WUFFN0UsZ0NBQWdDO1lBQ2hDLHlCQUFVLENBQ04sTUFBTSxDQUFDLE1BQU0sRUFBRSwrQkFBK0IsRUFDOUMsK0NBQStDLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHdEQUF3RCxFQUFFO1FBQzNELElBQU0sS0FBSyxHQUFHO1lBQ1osR0FBRyxFQUFFO2dCQUNILG9CQUFvQixFQUFFLDBRQU9yQjtnQkFDRCxpQkFBaUIsRUFBRSw0TkFNbEI7YUFDRjtTQUNGLENBQUM7UUFFRixJQUFNLE1BQU0sR0FBRyxzQkFBTyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztRQUU1Qyw0RkFBNEY7UUFDNUYsNEZBQTRGO1FBQzVGLDBGQUEwRjtRQUMxRixrRUFBa0U7UUFDbEUseUJBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLDRCQUE0QixFQUFFLHNDQUFzQyxDQUFDLENBQUM7UUFDaEcseUJBQVUsQ0FDTixNQUFNLENBQUMsTUFBTSxFQUFFLGlDQUFpQyxFQUFFLHNDQUFzQyxDQUFDLENBQUM7SUFDaEcsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZ0RBQWdELEVBQUU7UUFDbkQsSUFBTSxLQUFLLEdBQUc7WUFDWixHQUFHLEVBQUU7Z0JBQ0gsb0JBQW9CLEVBQUUsZ0tBS3JCO2dCQUNELGlCQUFpQixFQUFFLDROQU1sQjthQUNGO1NBQ0YsQ0FBQztRQUVGLElBQU0sTUFBTSxHQUFHLHNCQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRTVDLHlCQUFVLENBQ04sTUFBTSxDQUFDLE1BQU0sRUFBRSxrS0FJbEIsRUFDRyxpQ0FBaUMsQ0FBQyxDQUFDO0lBQ3pDLENBQUMsQ0FBQyxDQUFDO0lBR0gsRUFBRSxDQUFDLGtEQUFrRCxFQUFFO1FBQ3JELElBQU0sS0FBSyxHQUFHO1lBQ1osR0FBRyxFQUFFO2dCQUNILG9CQUFvQixFQUFFLDBRQU9yQjtnQkFDRCxpQkFBaUIsRUFBRSw0TkFNbEI7YUFDRjtTQUNGLENBQUM7UUFFRixJQUFNLE1BQU0sR0FBRyxzQkFBTyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztRQUU1QyxtREFBbUQ7UUFDbkQseUJBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSwrQkFBK0IsQ0FBQyxDQUFDO1FBRXpFLDJGQUEyRjtRQUMzRixvQkFBb0I7UUFDcEIsd0ZBQXdGO1FBQ3hGLGdCQUFnQjtRQUNoQix5QkFBVSxDQUNOLE1BQU0sQ0FBQyxNQUFNLEVBQUUsb0NBQW9DLEVBQ25ELHNDQUFzQyxDQUFDLENBQUM7SUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMkRBQTJELEVBQUU7UUFDOUQsSUFBTSxLQUFLLEdBQUc7WUFDWixHQUFHLEVBQUU7Z0JBQ0gsb0JBQW9CLEVBQUUsMFFBT3JCO2dCQUNELGlCQUFpQixFQUFFLDROQU1sQjthQUNGO1NBQ0YsQ0FBQztRQUVGLElBQU0sTUFBTSxHQUFHLHNCQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRTVDLG1EQUFtRDtRQUNuRCx5QkFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsOEJBQThCLEVBQUUsYUFBYSxFQUFFLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFFMUYsa0VBQWtFO1FBQ2xFLE1BQU0sQ0FBQztZQUNMLHlCQUFVLENBQ04sTUFBTSxDQUFDLE1BQU0sRUFBRSw4QkFBOEIsRUFBRSxhQUFhLEVBQUUsRUFBQyxLQUFLLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FBQztRQUMzRixDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsMkRBQTJELENBQUMsQ0FBQztJQUMvRSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=