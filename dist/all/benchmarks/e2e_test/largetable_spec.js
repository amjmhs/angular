"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var e2e_util_1 = require("e2e_util/e2e_util");
var protractor_1 = require("protractor");
describe('largetable benchmark spec', function () {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    it('should work for ng2', function () {
        testTableBenchmark({
            url: 'all/benchmarks/src/largetable/ng2/index.html',
        });
    });
    it('should work for ng2 switch', function () {
        testTableBenchmark({
            url: 'all/benchmarks/src/largetable/ng2_switch/index.html',
        });
    });
    it('should work for render3', function () {
        testTableBenchmark({
            url: 'all/benchmarks/src/largetable/render3/index.html',
            ignoreBrowserSynchronization: true,
        });
    });
    it('should work for iv', function () {
        testTableBenchmark({
            url: 'all/benchmarks/src/largetable/iv/index.html',
            ignoreBrowserSynchronization: true,
        });
    });
    it('should work for the baseline', function () {
        testTableBenchmark({
            url: 'all/benchmarks/src/largetable/baseline/index.html',
            ignoreBrowserSynchronization: true,
        });
    });
    it('should work for the incremental-dom', function () {
        testTableBenchmark({
            url: 'all/benchmarks/src/largetable/incremental_dom/index.html',
            ignoreBrowserSynchronization: true,
        });
    });
    function testTableBenchmark(openConfig) {
        e2e_util_1.openBrowser({
            url: openConfig.url,
            ignoreBrowserSynchronization: openConfig.ignoreBrowserSynchronization,
            params: [{ name: 'cols', value: 5 }, { name: 'rows', value: 5 }],
        });
        protractor_1.$('#createDom').click();
        expect(protractor_1.$('#root').getText()).toContain('0/0');
        protractor_1.$('#createDom').click();
        expect(protractor_1.$('#root').getText()).toContain('A/A');
        protractor_1.$('#destroyDom').click();
        expect(protractor_1.$('#root').getText()).toEqual('');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFyZ2V0YWJsZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbW9kdWxlcy9iZW5jaG1hcmtzL2UyZV90ZXN0L2xhcmdldGFibGVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDhDQUFxRTtBQUNyRSx5Q0FBNkI7QUFFN0IsUUFBUSxDQUFDLDJCQUEyQixFQUFFO0lBRXBDLFNBQVMsQ0FBQyxnQ0FBcUIsQ0FBQyxDQUFDO0lBRWpDLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRTtRQUN4QixrQkFBa0IsQ0FBQztZQUNqQixHQUFHLEVBQUUsOENBQThDO1NBQ3BELENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDRCQUE0QixFQUFFO1FBQy9CLGtCQUFrQixDQUFDO1lBQ2pCLEdBQUcsRUFBRSxxREFBcUQ7U0FDM0QsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMseUJBQXlCLEVBQUU7UUFDNUIsa0JBQWtCLENBQUM7WUFDakIsR0FBRyxFQUFFLGtEQUFrRDtZQUN2RCw0QkFBNEIsRUFBRSxJQUFJO1NBQ25DLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG9CQUFvQixFQUFFO1FBQ3ZCLGtCQUFrQixDQUFDO1lBQ2pCLEdBQUcsRUFBRSw2Q0FBNkM7WUFDbEQsNEJBQTRCLEVBQUUsSUFBSTtTQUNuQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw4QkFBOEIsRUFBRTtRQUNqQyxrQkFBa0IsQ0FBQztZQUNqQixHQUFHLEVBQUUsbURBQW1EO1lBQ3hELDRCQUE0QixFQUFFLElBQUk7U0FDbkMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQUU7UUFDeEMsa0JBQWtCLENBQUM7WUFDakIsR0FBRyxFQUFFLDBEQUEwRDtZQUMvRCw0QkFBNEIsRUFBRSxJQUFJO1NBQ25DLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsNEJBQTRCLFVBQWlFO1FBQzNGLHNCQUFXLENBQUM7WUFDVixHQUFHLEVBQUUsVUFBVSxDQUFDLEdBQUc7WUFDbkIsNEJBQTRCLEVBQUUsVUFBVSxDQUFDLDRCQUE0QjtZQUNyRSxNQUFNLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFDLENBQUM7U0FDN0QsQ0FBQyxDQUFDO1FBQ0gsY0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxjQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsY0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxjQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsY0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxjQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDM0MsQ0FBQztBQUNILENBQUMsQ0FBQyxDQUFDIn0=