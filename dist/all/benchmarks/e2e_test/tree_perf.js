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
var tree_data_1 = require("./tree_data");
describe('tree benchmark perf', function () {
    var _oldRootEl;
    beforeEach(function () { return _oldRootEl = protractor_1.browser.rootEl; });
    afterEach(function () {
        protractor_1.browser.rootEl = _oldRootEl;
        perf_util_1.verifyNoBrowserErrors();
    });
    tree_data_1.Benchmarks.forEach(function (benchmark) {
        describe(benchmark.id, function () {
            // This is actually a destroyOnly benchmark
            it('should work for createOnly', function (done) {
                runTreeBenchmark({
                    id: 'createOnly',
                    benchmark: benchmark,
                    prepare: function () { return protractor_1.$(tree_data_1.CreateBtn).click(); },
                    work: function () { return protractor_1.$(tree_data_1.DestroyBtn).click(); }
                }).then(done, done.fail);
            });
            it('should work for createOnlyForReal', function (done) {
                runTreeBenchmark({
                    id: 'createOnlyForReal',
                    benchmark: benchmark,
                    prepare: function () { return protractor_1.$(tree_data_1.DestroyBtn).click(); },
                    work: function () { return protractor_1.$(tree_data_1.CreateBtn).click(); }
                }).then(done, done.fail);
            });
            it('should work for createDestroy', function (done) {
                runTreeBenchmark({
                    id: 'createDestroy',
                    benchmark: benchmark,
                    work: function () {
                        protractor_1.$(tree_data_1.DestroyBtn).click();
                        protractor_1.$(tree_data_1.CreateBtn).click();
                    }
                }).then(done, done.fail);
            });
            it('should work for update', function (done) {
                runTreeBenchmark({ id: 'update', benchmark: benchmark, work: function () { return protractor_1.$(tree_data_1.CreateBtn).click(); } })
                    .then(done, done.fail);
            });
            if (benchmark.buttons.indexOf(tree_data_1.DetectChangesBtn) !== -1) {
                it('should work for detectChanges', function (done) {
                    runTreeBenchmark({
                        id: 'detectChanges',
                        benchmark: benchmark,
                        work: function () { return protractor_1.$(tree_data_1.DetectChangesBtn).click(); },
                        setup: function () { return protractor_1.$(tree_data_1.DestroyBtn).click(); }
                    }).then(done, done.fail);
                });
            }
        });
    });
});
function runTreeBenchmark(_a) {
    var id = _a.id, benchmark = _a.benchmark, prepare = _a.prepare, setup = _a.setup, work = _a.work;
    var params = [{ name: 'depth', value: 11 }];
    if (benchmark.extraParams) {
        params = params.concat(benchmark.extraParams);
    }
    protractor_1.browser.rootEl = tree_data_1.RootEl;
    return perf_util_1.runBenchmark({
        id: benchmark.id + "." + id,
        url: benchmark.url,
        ignoreBrowserSynchronization: benchmark.ignoreBrowserSynchronization,
        params: params,
        work: work,
        prepare: prepare,
        setup: setup
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZV9wZXJmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbW9kdWxlcy9iZW5jaG1hcmtzL2UyZV90ZXN0L3RyZWVfcGVyZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILGdEQUF1RTtBQUN2RSx5Q0FBc0M7QUFFdEMseUNBQW1HO0FBRW5HLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtJQUU5QixJQUFJLFVBQWUsQ0FBQztJQUNwQixVQUFVLENBQUMsY0FBTSxPQUFBLFVBQVUsR0FBRyxvQkFBTyxDQUFDLE1BQU0sRUFBM0IsQ0FBMkIsQ0FBQyxDQUFDO0lBRTlDLFNBQVMsQ0FBQztRQUNSLG9CQUFPLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztRQUM1QixpQ0FBcUIsRUFBRSxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDO0lBRUgsc0JBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQSxTQUFTO1FBQzFCLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFO1lBQ3JCLDJDQUEyQztZQUMzQyxFQUFFLENBQUMsNEJBQTRCLEVBQUUsVUFBQSxJQUFJO2dCQUNuQyxnQkFBZ0IsQ0FBQztvQkFDZixFQUFFLEVBQUUsWUFBWTtvQkFDaEIsU0FBUyxXQUFBO29CQUNULE9BQU8sRUFBRSxjQUFNLE9BQUEsY0FBQyxDQUFDLHFCQUFTLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBcEIsQ0FBb0I7b0JBQ25DLElBQUksRUFBRSxjQUFNLE9BQUEsY0FBQyxDQUFDLHNCQUFVLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBckIsQ0FBcUI7aUJBQ2xDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRSxVQUFBLElBQUk7Z0JBQzFDLGdCQUFnQixDQUFDO29CQUNmLEVBQUUsRUFBRSxt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