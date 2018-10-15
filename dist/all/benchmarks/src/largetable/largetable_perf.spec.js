"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var perf_util_1 = require("../../../e2e_util/perf_util");
var CreateOnlyWorker = {
    id: 'createOnly',
    prepare: function () { return protractor_1.$('#destroyDom').click(); },
    work: function () { return protractor_1.$('#createDom').click(); }
};
var CreateAndDestroyWorker = {
    id: 'createDestroy',
    work: function () {
        protractor_1.$('#createDom').click();
        protractor_1.$('#destroyDom').click();
    }
};
var UpdateWorker = {
    id: 'update',
    work: function () { return protractor_1.$('#createDom').click(); }
};
describe('largetable benchmark perf', function () {
    afterEach(perf_util_1.verifyNoBrowserErrors);
    [CreateOnlyWorker, CreateAndDestroyWorker, UpdateWorker].forEach(function (worker) {
        describe(worker.id, function () {
            it('should run for render3', function (done) {
                runTableBenchmark({
                    id: "largeTable.render3." + worker.id,
                    url: 'index.html',
                    ignoreBrowserSynchronization: true,
                    worker: worker
                }).then(done, done.fail);
            });
        });
    });
    function runTableBenchmark(config) {
        return perf_util_1.runBenchmark({
            id: config.id,
            url: config.url,
            ignoreBrowserSynchronization: config.ignoreBrowserSynchronization,
            params: [{ name: 'cols', value: 40 }, { name: 'rows', value: 200 }],
            prepare: config.worker.prepare,
            work: config.worker.work
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFyZ2V0YWJsZV9wZXJmLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2JlbmNobWFya3Mvc3JjL2xhcmdldGFibGUvbGFyZ2V0YWJsZV9wZXJmLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCx5Q0FBNkI7QUFFN0IseURBQWdGO0FBUWhGLElBQU0sZ0JBQWdCLEdBQVc7SUFDL0IsRUFBRSxFQUFFLFlBQVk7SUFDaEIsT0FBTyxFQUFFLGNBQU0sT0FBQSxjQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQXhCLENBQXdCO0lBQ3ZDLElBQUksRUFBRSxjQUFNLE9BQUEsY0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUF2QixDQUF1QjtDQUNwQyxDQUFDO0FBRUYsSUFBTSxzQkFBc0IsR0FBVztJQUNyQyxFQUFFLEVBQUUsZUFBZTtJQUNuQixJQUFJLEVBQUU7UUFDSixjQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDeEIsY0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzNCLENBQUM7Q0FDRixDQUFDO0FBRUYsSUFBTSxZQUFZLEdBQVc7SUFDM0IsRUFBRSxFQUFFLFFBQVE7SUFDWixJQUFJLEVBQUUsY0FBTSxPQUFBLGNBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBdkIsQ0FBdUI7Q0FDcEMsQ0FBQztBQUVGLFFBQVEsQ0FBQywyQkFBMkIsRUFBRTtJQUVwQyxTQUFTLENBQUMsaUNBQXFCLENBQUMsQ0FBQztJQUVqQyxDQUFDLGdCQUFnQixFQUFFLHNCQUFzQixFQUFFLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU07UUFDdEUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUU7WUFDbEIsRUFBRSxDQUFDLHdCQUF3QixFQUFFLFVBQUEsSUFBSTtnQkFDL0IsaUJBQWlCLENBQUM7b0JBQ2hCLEVBQUUsRUFBRSx3QkFBc0IsTUFBTSxDQUFDLEVBQUk7b0JBQ3JDLEdBQUcsRUFBRSxZQUFZO29CQUNqQiw0QkFBNEIsRUFBRSxJQUFJO29CQUNsQyxNQUFNLEVBQUUsTUFBTTtpQkFDZixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsMkJBQ0ksTUFBeUY7UUFDM0YsT0FBTyx3QkFBWSxDQUFDO1lBQ2xCLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNiLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRztZQUNmLDRCQUE0QixFQUFFLE1BQU0sQ0FBQyw0QkFBNEI7WUFDakUsTUFBTSxFQUFFLENBQUMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBQyxDQUFDO1lBQy9ELE9BQU8sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU87WUFDOUIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSTtTQUN6QixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQyxDQUFDLENBQUMifQ==