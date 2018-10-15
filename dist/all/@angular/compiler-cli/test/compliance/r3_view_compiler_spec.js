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
describe('r3_view_compiler', function () {
    var angularFiles = test_util_1.setup({
        compileAngular: true,
        compileAnimations: false,
        compileCommon: true,
    });
    describe('hello world', function () {
        it('should be able to generate the hello world component', function () {
            var files = {
                app: {
                    'hello.ts': "\n           import {Component, NgModule} from '@angular/core';\n\n           @Component({\n             selector: 'hello-world',\n             template: 'Hello, world!'\n           })\n           export class HelloWorldComponent {\n\n           }\n\n           @NgModule({\n             declarations: [HelloWorldComponent]\n           })\n           export class HelloWorldModule {}\n        "
                }
            };
            mock_compile_1.compile(files, angularFiles);
        });
    });
    it('should be able to generate the example', function () {
        var files = {
            app: {
                'example.ts': "\n        import {Component, OnInit, OnDestroy, ElementRef, Input, NgModule} from '@angular/core';\n        import {CommonModule} from '@angular/common';\n\n        @Component({\n          selector: 'my-app',\n          template: '<todo [data]=\"list\"></todo>'\n        })\n        export class MyApp implements OnInit {\n\n          list: any[] = [];\n\n          constructor(public elementRef: ElementRef) {}\n\n          ngOnInit(): void {\n          }\n        }\n\n        @Component({\n          selector: 'todo',\n          template: '<ul class=\"list\" [title]=\"myTitle\"><li *ngFor=\"let item of data\">{{data}}</li></ul>'\n        })\n        export class TodoComponent implements OnInit, OnDestroy {\n\n          @Input()\n          data: any[] = [];\n\n          myTitle: string;\n\n          constructor(public elementRef: ElementRef) {}\n\n          ngOnInit(): void {}\n\n          ngOnDestroy(): void {}\n        }\n\n        @NgModule({\n          declarations: [TodoComponent, MyApp],\n          imports: [CommonModule]\n        })\n        export class TodoModule{}\n        "
            }
        };
        var result = mock_compile_1.compile(files, angularFiles);
        expect(result.source).toContain('@angular/core');
    });
    describe('interpolations', function () {
        // Regression #21927
        it('should generate a correct call to bV with more than 8 interpolations', function () {
            var files = {
                app: {
                    'example.ts': "\n          import {Component, NgModule} from '@angular/core';\n\n          @Component({\n            selector: 'my-app',\n            template: ' {{list[0]}} {{list[1]}} {{list[2]}} {{list[3]}} {{list[4]}} {{list[5]}} {{list[6]}} {{list[7]}} {{list[8]}} '\n          })\n          export class MyApp {\n            list: any[] = [];\n          }\n\n          @NgModule({declarations: [MyApp]})\n          export class MyModule {}"
                }
            };
            var bV_call = "$r3$.\u0275iV([\" \",ctx.list[0],\" \",ctx.list[1],\" \",ctx.list[2],\" \",ctx.list[3],\n        \" \",ctx.list[4],\" \",ctx.list[5],\" \",ctx.list[6],\" \",ctx.list[7],\" \",ctx.list[8],\n        \" \"])";
            var result = mock_compile_1.compile(files, angularFiles);
            mock_compile_1.expectEmit(result.source, bV_call, 'Incorrect bV call');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfdmlld19jb21waWxlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3Rlc3QvY29tcGxpYW5jZS9yM192aWV3X2NvbXBpbGVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxrRUFBMEU7QUFDMUUsK0NBQW1EO0FBRW5ELFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtJQUMzQixJQUFNLFlBQVksR0FBRyxpQkFBSyxDQUFDO1FBQ3pCLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLGlCQUFpQixFQUFFLEtBQUs7UUFDeEIsYUFBYSxFQUFFLElBQUk7S0FDcEIsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGFBQWEsRUFBRTtRQUN0QixFQUFFLENBQUMsc0RBQXNELEVBQUU7WUFDekQsSUFBTSxLQUFLLEdBQWtCO2dCQUMzQixHQUFHLEVBQUU7b0JBQ0gsVUFBVSxFQUFFLDJZQWViO2lCQUNBO2FBQ0YsQ0FBQztZQUNGLHNCQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsd0NBQXdDLEVBQUU7UUFDM0MsSUFBTSxLQUFLLEdBQWtCO1lBQzNCLEdBQUcsRUFBRTtnQkFDSCxZQUFZLEVBQUUsMGtDQXlDYjthQUNGO1NBQ0YsQ0FBQztRQUNGLElBQU0sTUFBTSxHQUFHLHNCQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1FBQ3pCLG9CQUFvQjtRQUNwQixFQUFFLENBQUMsc0VBQXNFLEVBQUU7WUFDekUsSUFBTSxLQUFLLEdBQWtCO2dCQUMzQixHQUFHLEVBQUU7b0JBQ0gsWUFBWSxFQUFFLGdiQVlXO2lCQUMxQjthQUNGLENBQUM7WUFFRixJQUFNLE9BQU8sR0FBRyw4TUFFUixDQUFDO1lBQ1QsSUFBTSxNQUFNLEdBQUcsc0JBQU8sQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDNUMseUJBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQzFELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9