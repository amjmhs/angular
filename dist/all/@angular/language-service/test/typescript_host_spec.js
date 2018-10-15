"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var ts = require("typescript");
var typescript_host_1 = require("../src/typescript_host");
var test_data_1 = require("./test_data");
var test_utils_1 = require("./test_utils");
describe('completions', function () {
    var host;
    var service;
    var ngHost;
    beforeEach(function () {
        host = new test_utils_1.MockTypescriptHost(['/app/main.ts'], test_data_1.toh);
        service = ts.createLanguageService(host);
    });
    it('should be able to create a typescript host', function () { expect(function () { return new typescript_host_1.TypeScriptServiceHost(host, service); }).not.toThrow(); });
    beforeEach(function () { ngHost = new typescript_host_1.TypeScriptServiceHost(host, service); });
    it('should be able to analyze modules', function () { expect(ngHost.getAnalyzedModules()).toBeDefined(); });
    it('should be able to analyze modules in without a tsconfig.json file', function () {
        host = new test_utils_1.MockTypescriptHost(['foo.ts'], test_data_1.toh);
        service = ts.createLanguageService(host);
        ngHost = new typescript_host_1.TypeScriptServiceHost(host, service);
        expect(ngHost.getAnalyzedModules()).toBeDefined();
    });
    it('should not throw if there is no script names', function () {
        host = new test_utils_1.MockTypescriptHost([], test_data_1.toh);
        service = ts.createLanguageService(host);
        ngHost = new typescript_host_1.TypeScriptServiceHost(host, service);
        expect(function () { return ngHost.getAnalyzedModules(); }).not.toThrow();
    });
    it('should clear the caches if program changes', function () {
        // First create a TypescriptHost with empty script names
        host = new test_utils_1.MockTypescriptHost([], test_data_1.toh);
        service = ts.createLanguageService(host);
        ngHost = new typescript_host_1.TypeScriptServiceHost(host, service);
        expect(ngHost.getAnalyzedModules().ngModules).toEqual([]);
        // Now add a script, this would change the program
        var fileName = '/app/main.ts';
        var content = host.getFileContent(fileName);
        host.addScript(fileName, content);
        // If the caches are not cleared, we would get back an empty array.
        // But if the caches are cleared then the analyzed modules will be non-empty.
        expect(ngHost.getAnalyzedModules().ngModules.length).not.toEqual(0);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXNjcmlwdF9ob3N0X3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sYW5ndWFnZS1zZXJ2aWNlL3Rlc3QvdHlwZXNjcmlwdF9ob3N0X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw0QkFBMEI7QUFDMUIsK0JBQWlDO0FBRWpDLDBEQUE2RDtBQUU3RCx5Q0FBZ0M7QUFDaEMsMkNBQWdEO0FBR2hELFFBQVEsQ0FBQyxhQUFhLEVBQUU7SUFDdEIsSUFBSSxJQUE0QixDQUFDO0lBQ2pDLElBQUksT0FBMkIsQ0FBQztJQUNoQyxJQUFJLE1BQTZCLENBQUM7SUFFbEMsVUFBVSxDQUFDO1FBQ1QsSUFBSSxHQUFHLElBQUksK0JBQWtCLENBQUMsQ0FBQyxjQUFjLENBQUMsRUFBRSxlQUFHLENBQUMsQ0FBQztRQUNyRCxPQUFPLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUM1QyxjQUFRLE1BQU0sQ0FBQyxjQUFNLE9BQUEsSUFBSSx1Q0FBcUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQXhDLENBQXdDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVwRixVQUFVLENBQUMsY0FBUSxNQUFNLEdBQUcsSUFBSSx1Q0FBcUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV6RSxFQUFFLENBQUMsbUNBQW1DLEVBQ25DLGNBQVEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVqRSxFQUFFLENBQUMsbUVBQW1FLEVBQUU7UUFDdEUsSUFBSSxHQUFHLElBQUksK0JBQWtCLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxlQUFHLENBQUMsQ0FBQztRQUMvQyxPQUFPLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sR0FBRyxJQUFJLHVDQUFxQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRCxNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNwRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtRQUNqRCxJQUFJLEdBQUcsSUFBSSwrQkFBa0IsQ0FBQyxFQUFFLEVBQUUsZUFBRyxDQUFDLENBQUM7UUFDdkMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QyxNQUFNLEdBQUcsSUFBSSx1Q0FBcUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEQsTUFBTSxDQUFDLGNBQU0sT0FBQSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsRUFBM0IsQ0FBMkIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMxRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtRQUMvQyx3REFBd0Q7UUFDeEQsSUFBSSxHQUFHLElBQUksK0JBQWtCLENBQUMsRUFBRSxFQUFFLGVBQUcsQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sR0FBRyxFQUFFLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsTUFBTSxHQUFHLElBQUksdUNBQXFCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELE1BQU0sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUQsa0RBQWtEO1FBQ2xELElBQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQztRQUNoQyxJQUFNLE9BQU8sR0FBSSxJQUEyQixDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUcsQ0FBQztRQUN2RSxJQUEyQixDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDMUQsbUVBQW1FO1FBQ25FLDZFQUE2RTtRQUM3RSxNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEUsQ0FBQyxDQUFDLENBQUM7QUFFTCxDQUFDLENBQUMsQ0FBQyJ9