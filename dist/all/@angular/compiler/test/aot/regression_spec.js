"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var test_util_1 = require("./test_util");
describe('regressions', function () {
    var angularFiles = test_util_1.setup();
    it('should compile components with empty templates', function () {
        var appDir = {
            'app.module.ts': "\n        import { Component, NgModule } from '@angular/core';\n\n        @Component({template: ''})\n        export class EmptyComp {}\n\n        @NgModule({declarations: [EmptyComp]})\n        export class MyModule {}\n      "
        };
        var rootDir = { 'app': appDir };
        var genFiles = test_util_1.compile([rootDir, angularFiles], { postCompile: test_util_1.expectNoDiagnostics }, { noUnusedLocals: true, noUnusedParameters: true }).genFiles;
        expect(genFiles.find(function (f) { return f.genFileUrl === '/app/app.module.ngfactory.ts'; })).toBeTruthy();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVncmVzc2lvbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9hb3QvcmVncmVzc2lvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgseUNBQStFO0FBRS9FLFFBQVEsQ0FBQyxhQUFhLEVBQUU7SUFDdEIsSUFBSSxZQUFZLEdBQUcsaUJBQUssRUFBRSxDQUFDO0lBRTNCLEVBQUUsQ0FBQyxnREFBZ0QsRUFBRTtRQUNuRCxJQUFNLE1BQU0sR0FBRztZQUNiLGVBQWUsRUFBRSxxT0FRaEI7U0FDRixDQUFDO1FBQ0YsSUFBTSxPQUFPLEdBQUcsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFDLENBQUM7UUFDekIsSUFBQSxzS0FBUSxDQUV1QztRQUN0RCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxVQUFVLEtBQUssOEJBQThCLEVBQS9DLENBQStDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzdGLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==