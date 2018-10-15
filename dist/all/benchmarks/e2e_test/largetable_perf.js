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
            it('should run for ng2', function (done) {
                runTableBenchmark({
                    id: "largeTable.ng2." + worker.id,
                    url: 'all/benchmarks/src/largetable/ng2/index.html',
                    worker: worker
                }).then(done, done.fail);
            });
            it('should run for ng2 with ngSwitch', function (done) {
                runTableBenchmark({
                    id: "largeTable.ng2_switch." + worker.id,
                    url: 'all/benchmarks/src/largetable/ng2_switch/index.html',
                    worker: worker
                }).then(done, done.fail);
            });
            it('should run for render3', function (done) {
                runTableBenchmark({
                    id: "largeTable.render3." + worker.id,
                    url: 'all/benchmarks/src/largetable/render3/index.html',
                    ignoreBrowserSynchronization: true,
                    worker: worker
                }).then(done, done.fail);
            });
            it('should run for iv', function (done) {
                runTableBenchmark({
                    id: "largeTable.iv." + worker.id,
                    url: 'all/benchmarks/src/largetable/iv/index.html',
                    ignoreBrowserSynchronization: true,
                    worker: worker
                }).then(done, done.fail);
            });
            it('should run for the baseline', function (done) {
                runTableBenchmark({
                    id: "largeTable.baseline." + worker.id,
                    url: 'all/benchmarks/src/largetable/baseline/index.html',
                    ignoreBrowserSynchronization: true,
                    worker: worker
                }).then(done, done.fail);
            });
            it('should run for incremental-dom', function (done) {
                runTableBenchmark({
                    id: "largeTable.incremental_dom." + worker.id,
                    url: 'all/benchmarks/src/largetable/incremental_dom/index.html',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFyZ2V0YWJsZV9wZXJmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbW9kdWxlcy9iZW5jaG1hcmtzL2UyZV90ZXN0L2xhcmdldGFibGVfcGVyZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILGdEQUF1RTtBQUN2RSx5Q0FBNkI7QUFRN0IsSUFBTSxnQkFBZ0IsR0FBVztJQUMvQixFQUFFLEVBQUUsWUFBWTtJQUNoQixPQUFPLEVBQUUsY0FBTSxPQUFBLGNBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBeEIsQ0FBd0I7SUFDdkMsSUFBSSxFQUFFLGNBQU0sT0FBQSxjQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQXZCLENBQXVCO0NBQ3BDLENBQUM7QUFFRixJQUFNLHNCQUFzQixHQUFXO0lBQ3JDLEVBQUUsRUFBRSxlQUFlO0lBQ25CLElBQUksRUFBRTtRQUNKLGNBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN4QixjQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDM0IsQ0FBQztDQUNGLENBQUM7QUFFRixJQUFNLFlBQVksR0FBVztJQUMzQixFQUFFLEVBQUUsUUFBUTtJQUNaLElBQUksRUFBRSxjQUFNLE9BQUEsY0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUF2QixDQUF1QjtDQUNwQyxDQUFDO0FBRUYsUUFBUSxDQUFDLDJCQUEyQixFQUFFO0lBRXBDLFNBQVMsQ0FBQyxpQ0FBcUIsQ0FBQyxDQUFDO0lBRWpDLENBQUMsZ0JBQWdCLEVBQUUsc0JBQXNCLEVBQUUsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTTtRQUN0RSxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRTtZQUNsQixFQUFFLENBQUMsb0JBQW9CLEVBQUUsVUFBQSxJQUFJO2dCQUMz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