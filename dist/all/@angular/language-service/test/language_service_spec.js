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
describe('service without angular', function () {
    var mockHost = new test_utils_1.MockTypescriptHost(['/app/main.ts', '/app/parsing-cases.ts'], test_data_1.toh);
    mockHost.forgetAngular();
    var service = ts.createLanguageService(mockHost);
    var ngHost = new typescript_host_1.TypeScriptServiceHost(mockHost, service);
    var ngService = language_service_1.createLanguageService(ngHost);
    var fileName = '/app/test.ng';
    var position = mockHost.getMarkerLocations(fileName)['h1-content'];
    it('should not crash a get template references', function () { return expect(function () { return ngService.getTemplateReferences(); }); });
    it('should not crash a get diagnostics', function () { return expect(function () { return ngService.getDiagnostics(fileName); }).not.toThrow(); });
    it('should not crash a completion', function () { return expect(function () { return ngService.getCompletionsAt(fileName, position); }).not.toThrow(); });
    it('should not crash a get definition', function () { return expect(function () { return ngService.getDefinitionAt(fileName, position); }).not.toThrow(); });
    it('should not crash a hover', function () { return expect(function () { return ngService.getHoverAt(fileName, position); }); });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZ3VhZ2Vfc2VydmljZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbGFuZ3VhZ2Utc2VydmljZS90ZXN0L2xhbmd1YWdlX3NlcnZpY2Vfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtCQUFpQztBQUVqQyw0REFBOEQ7QUFFOUQsMERBQTZEO0FBRTdELHlDQUFnQztBQUNoQywyQ0FBZ0Q7QUFFaEQsUUFBUSxDQUFDLHlCQUF5QixFQUFFO0lBQ2xDLElBQUksUUFBUSxHQUFHLElBQUksK0JBQWtCLENBQUMsQ0FBQyxjQUFjLEVBQUUsdUJBQXVCLENBQUMsRUFBRSxlQUFHLENBQUMsQ0FBQztJQUN0RixRQUFRLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDekIsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pELElBQUksTUFBTSxHQUFHLElBQUksdUNBQXFCLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzFELElBQUksU0FBUyxHQUFHLHdDQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlDLElBQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQztJQUNoQyxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7SUFFckUsRUFBRSxDQUFDLDRDQUE0QyxFQUM1QyxjQUFNLE9BQUEsTUFBTSxDQUFDLGNBQU0sT0FBQSxTQUFTLENBQUMscUJBQXFCLEVBQUUsRUFBakMsQ0FBaUMsQ0FBQyxFQUEvQyxDQUErQyxDQUFDLENBQUM7SUFDMUQsRUFBRSxDQUFDLG9DQUFvQyxFQUNwQyxjQUFNLE9BQUEsTUFBTSxDQUFDLGNBQU0sT0FBQSxTQUFTLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFsQyxDQUFrQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUE5RCxDQUE4RCxDQUFDLENBQUM7SUFDekUsRUFBRSxDQUFDLCtCQUErQixFQUMvQixjQUFNLE9BQUEsTUFBTSxDQUFDLGNBQU0sT0FBQSxTQUFTLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxFQUE5QyxDQUE4QyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUExRSxDQUEwRSxDQUFDLENBQUM7SUFDckYsRUFBRSxDQUFDLG1DQUFtQyxFQUNuQyxjQUFNLE9BQUEsTUFBTSxDQUFDLGNBQU0sT0FBQSxTQUFTLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFBN0MsQ0FBNkMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBekUsQ0FBeUUsQ0FBQyxDQUFDO0lBQ3BGLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSxjQUFNLE9BQUEsTUFBTSxDQUFDLGNBQU0sT0FBQSxTQUFTLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFBeEMsQ0FBd0MsQ0FBQyxFQUF0RCxDQUFzRCxDQUFDLENBQUM7QUFDL0YsQ0FBQyxDQUFDLENBQUMifQ==