"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var perf_util_1 = require("e2e_util/perf_util");
var protractor_1 = require("protractor");
var CreateAndDestroyWorker = {
    id: 'createDestroy',
    work: function () {
        protractor_1.$('#createDom').click();
        protractor_1.$('#destroyDom').click();
    }
};
describe('largeform benchmark perf', function () {
    afterEach(perf_util_1.verifyNoBrowserErrors);
    [CreateAndDestroyWorker].forEach(function (worker) {
        describe(worker.id, function () {
            it('should run for ng2', function (done) {
                runLargeFormBenchmark({
                    id: "largeform.ng2." + worker.id,
                    url: 'all/benchmarks/src/largeform/ng2/index.html',
                    worker: worker
                }).then(done, done.fail);
            });
        });
    });
    function runLargeFormBenchmark(config) {
        return perf_util_1.runBenchmark({
            id: config.id,
            url: config.url,
            params: [{ name: 'copies', value: 8 }],
            ignoreBrowserSynchronization: config.ignoreBrowserSynchronization,
            prepare: config.worker.prepare,
            work: config.worker.work
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFyZ2Vmb3JtX3BlcmYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9tb2R1bGVzL2JlbmNobWFya3MvZTJlX3Rlc3QvbGFyZ2Vmb3JtX3BlcmYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxnREFBdUU7QUFDdkUseUNBQTZCO0FBUTdCLElBQU0sc0JBQXNCLEdBQVc7SUFDckMsRUFBRSxFQUFFLGVBQWU7SUFDbkIsSUFBSSxFQUFFO1FBQ0osY0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3hCLGNBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMzQixDQUFDO0NBQ0YsQ0FBQztBQUVGLFFBQVEsQ0FBQywwQkFBMEIsRUFBRTtJQUVuQyxTQUFTLENBQUMsaUNBQXFCLENBQUMsQ0FBQztJQUVqQyxDQUFDLHNCQUFzQixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTTtRQUN0QyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRTtZQUNsQixFQUFFLENBQUMsb0JBQW9CLEVBQUUsVUFBQSxJQUFJO2dCQUMzQixxQkFBcUIsQ0FBQztvQkFDcEIsRUFBRSxFQUFFLG1CQUFpQixNQUFNLENBQUMsRUFBSTtvQkFDaEMsR0FBRyxFQUFFLDZDQUE2QztvQkFDbEQsTUFBTSxFQUFFLE1BQU07aUJBQ2YsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILCtCQUNJLE1BQXlGO1FBQzNGLE9BQU8sd0JBQVksQ0FBQztZQUNsQixFQUFFLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDYixHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUc7WUFDZixNQUFNLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBQyxDQUFDO1lBQ3BDLDRCQUE0QixFQUFFLE1BQU0sQ0FBQyw0QkFBNEI7WUFDakUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTztZQUM5QixJQUFJLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJO1NBQ3pCLENBQUMsQ0FBQztJQUNMLENBQUM7QUFDSCxDQUFDLENBQUMsQ0FBQyJ9