"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_cli_1 = require("@angular/compiler-cli");
var path = require("path");
var ts = require("typescript");
var test_support_1 = require("./test_support");
describe('ngtools_api (deprecated)', function () {
    var testSupport;
    beforeEach(function () { testSupport = test_support_1.setup(); });
    function createProgram(rootNames) {
        var options = testSupport.createCompilerOptions();
        var host = ts.createCompilerHost(options, true);
        var program = ts.createProgram(rootNames.map(function (p) { return path.resolve(testSupport.basePath, p); }), options, host);
        return { program: program, host: host, options: options };
    }
    function writeSomeRoutes() {
        testSupport.writeFiles({
            'src/main.ts': "\n        import {NgModule, Component} from '@angular/core';\n        import {RouterModule} from '@angular/router';\n\n        // Component with metadata errors.\n        @Component(() => {if (1==1) return null as any;})\n        export class ErrorComp2 {}\n\n        @NgModule({\n          declarations: [ErrorComp2, NonExistentComp],\n          imports: [RouterModule.forRoot([{loadChildren: './child#ChildModule'}])]\n        })\n        export class MainModule {}\n      ",
            'src/child.ts': "\n        import {NgModule} from '@angular/core';\n        import {RouterModule} from '@angular/router';\n\n        @NgModule({\n          imports: [RouterModule.forChild([{loadChildren: './child2#ChildModule2'}])]\n        })\n        export class ChildModule {}\n      ",
            'src/child2.ts': "\n        import {NgModule} from '@angular/core';\n\n        @NgModule()\n        export class ChildModule2 {}\n      ",
        });
    }
    it('should list lazy routes recursively', function () {
        writeSomeRoutes();
        var _a = createProgram(['src/main.ts']), program = _a.program, host = _a.host, options = _a.options;
        var routes = compiler_cli_1.__NGTOOLS_PRIVATE_API_2.listLazyRoutes({
            program: program,
            host: host,
            angularCompilerOptions: options,
            entryModule: 'src/main#MainModule',
        });
        expect(routes).toEqual({
            './child#ChildModule': path.resolve(testSupport.basePath, 'src/child.ts'),
            './child2#ChildModule2': path.resolve(testSupport.basePath, 'src/child2.ts'),
        });
    });
    it('should allow to emit the program after analyzing routes', function () {
        writeSomeRoutes();
        var _a = createProgram(['src/main.ts']), program = _a.program, host = _a.host, options = _a.options;
        compiler_cli_1.__NGTOOLS_PRIVATE_API_2.listLazyRoutes({
            program: program,
            host: host,
            angularCompilerOptions: options,
            entryModule: 'src/main#MainModule',
        });
        program.emit();
        testSupport.shouldExist('built/src/main.js');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd0b29sc19hcGlfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS90ZXN0L25ndG9vbHNfYXBpX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzREFBMEY7QUFDMUYsMkJBQTZCO0FBQzdCLCtCQUFpQztBQUVqQywrQ0FBa0Q7QUFFbEQsUUFBUSxDQUFDLDBCQUEwQixFQUFFO0lBQ25DLElBQUksV0FBd0IsQ0FBQztJQUU3QixVQUFVLENBQUMsY0FBUSxXQUFXLEdBQUcsb0JBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFN0MsdUJBQXVCLFNBQW1CO1FBQ3hDLElBQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ3BELElBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbEQsSUFBTSxPQUFPLEdBQ1QsRUFBRSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFyQyxDQUFxQyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQy9GLE9BQU8sRUFBQyxPQUFPLFNBQUEsRUFBRSxJQUFJLE1BQUEsRUFBRSxPQUFPLFNBQUEsRUFBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRDtRQUNFLFdBQVcsQ0FBQyxVQUFVLENBQUM7WUFDckIsYUFBYSxFQUFFLDZkQWFkO1lBQ0QsY0FBYyxFQUFFLGlSQVFmO1lBQ0QsZUFBZSxFQUFFLHdIQUtoQjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxFQUFFLENBQUMscUNBQXFDLEVBQUU7UUFDeEMsZUFBZSxFQUFFLENBQUM7UUFDWixJQUFBLG1DQUF5RCxFQUF4RCxvQkFBTyxFQUFFLGNBQUksRUFBRSxvQkFBTyxDQUFtQztRQUNoRSxJQUFNLE1BQU0sR0FBRyxzQ0FBd0IsQ0FBQyxjQUFjLENBQUM7WUFDckQsT0FBTyxTQUFBO1lBQ1AsSUFBSSxNQUFBO1lBQ0osc0JBQXNCLEVBQUUsT0FBTztZQUMvQixXQUFXLEVBQUUscUJBQXFCO1NBQ25DLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDckIscUJBQXFCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQztZQUN6RSx1QkFBdUIsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDO1NBQzdFLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHlEQUF5RCxFQUFFO1FBQzVELGVBQWUsRUFBRSxDQUFDO1FBQ1osSUFBQSxtQ0FBeUQsRUFBeEQsb0JBQU8sRUFBRSxjQUFJLEVBQUUsb0JBQU8sQ0FBbUM7UUFDaEUsc0NBQXdCLENBQUMsY0FBYyxDQUFDO1lBQ3RDLE9BQU8sU0FBQTtZQUNQLElBQUksTUFBQTtZQUNKLHNCQUFzQixFQUFFLE9BQU87WUFDL0IsV0FBVyxFQUFFLHFCQUFxQjtTQUNuQyxDQUFDLENBQUM7UUFDSCxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZixXQUFXLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9