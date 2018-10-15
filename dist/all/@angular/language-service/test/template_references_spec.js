"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var language_service_1 = require("../src/language_service");
var typescript_host_1 = require("../src/typescript_host");
var test_data_1 = require("./test_data");
var test_utils_1 = require("./test_utils");
describe('references', function () {
    var documentRegistry = ts.createDocumentRegistry();
    var mockHost;
    var service;
    var program;
    var ngHost;
    var ngService = language_service_1.createLanguageService(undefined);
    beforeEach(function () {
        mockHost = new test_utils_1.MockTypescriptHost(['/app/main.ts', '/app/parsing-cases.ts'], test_data_1.toh);
        service = ts.createLanguageService(mockHost, documentRegistry);
        program = service.getProgram();
        ngHost = new typescript_host_1.TypeScriptServiceHost(mockHost, service);
        ngService = language_service_1.createLanguageService(ngHost);
        ngHost.setSite(ngService);
    });
    it('should be able to get template references', function () { expect(function () { return ngService.getTemplateReferences(); }).not.toThrow(); });
    it('should be able to determine that test.ng is a template reference', function () { expect(ngService.getTemplateReferences()).toContain('/app/test.ng'); });
    it('should be able to get template references for an invalid project', function () {
        var moduleCode = "\n      import {NgModule} from '@angular/core';\n      import {NewClass} from './test.component';\n\n      @NgModule({declarations: [NewClass]}) export class TestModule {}";
        var classCode = "\n      export class NewClass {}\n\n      @Component({})\n      export class SomeComponent {}\n    ";
        mockHost.addScript('/app/test.module.ts', moduleCode);
        mockHost.addScript('/app/test.component.ts', classCode);
        expect(function () { ngService.getTemplateReferences(); }).not.toThrow();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfcmVmZXJlbmNlc19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbGFuZ3VhZ2Utc2VydmljZS90ZXN0L3RlbXBsYXRlX3JlZmVyZW5jZXNfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtCQUFpQztBQUVqQyw0REFBOEQ7QUFFOUQsMERBQTZEO0FBRTdELHlDQUFnQztBQUNoQywyQ0FBZ0Q7QUFFaEQsUUFBUSxDQUFDLFlBQVksRUFBRTtJQUNyQixJQUFJLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBQ25ELElBQUksUUFBNEIsQ0FBQztJQUNqQyxJQUFJLE9BQTJCLENBQUM7SUFDaEMsSUFBSSxPQUFtQixDQUFDO0lBQ3hCLElBQUksTUFBNkIsQ0FBQztJQUNsQyxJQUFJLFNBQVMsR0FBb0Isd0NBQXFCLENBQUMsU0FBVyxDQUFDLENBQUM7SUFFcEUsVUFBVSxDQUFDO1FBQ1QsUUFBUSxHQUFHLElBQUksK0JBQWtCLENBQUMsQ0FBQyxjQUFjLEVBQUUsdUJBQXVCLENBQUMsRUFBRSxlQUFHLENBQUMsQ0FBQztRQUNsRixPQUFPLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQy9ELE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDL0IsTUFBTSxHQUFHLElBQUksdUNBQXFCLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3RELFNBQVMsR0FBRyx3Q0FBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzVCLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDJDQUEyQyxFQUMzQyxjQUFRLE1BQU0sQ0FBQyxjQUFNLE9BQUEsU0FBUyxDQUFDLHFCQUFxQixFQUFFLEVBQWpDLENBQWlDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU3RSxFQUFFLENBQUMsa0VBQWtFLEVBQ2xFLGNBQVEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbkYsRUFBRSxDQUFDLGtFQUFrRSxFQUFFO1FBQ3JFLElBQU0sVUFBVSxHQUFHLDZLQUlnRCxDQUFDO1FBQ3BFLElBQU0sU0FBUyxHQUFHLHFHQUtqQixDQUFDO1FBQ0YsUUFBUSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN0RCxRQUFRLENBQUMsU0FBUyxDQUFDLHdCQUF3QixFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sQ0FBQyxjQUFRLFNBQVMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3JFLENBQUMsQ0FBQyxDQUFDO0FBRUwsQ0FBQyxDQUFDLENBQUMifQ==