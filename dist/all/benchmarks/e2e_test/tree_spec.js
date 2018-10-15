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
var tree_data_1 = require("./tree_data");
describe('tree benchmark spec', function () {
    var _oldRootEl;
    beforeEach(function () { return _oldRootEl = protractor_1.browser.rootEl; });
    afterEach(function () {
        protractor_1.browser.rootEl = _oldRootEl;
        e2e_util_1.verifyNoBrowserErrors();
    });
    tree_data_1.Benchmarks.forEach(function (benchmark) {
        describe(benchmark.id, function () {
            it('should work for createDestroy', function () {
                openTreeBenchmark(benchmark);
                protractor_1.$(tree_data_1.CreateBtn).click();
                expect(protractor_1.$(tree_data_1.RootEl).getText()).toContain('0');
                protractor_1.$(tree_data_1.DestroyBtn).click();
                expect(protractor_1.$(tree_data_1.RootEl).getText()).toEqual('');
            });
            it('should work for update', function () {
                openTreeBenchmark(benchmark);
                protractor_1.$(tree_data_1.CreateBtn).click();
                protractor_1.$(tree_data_1.CreateBtn).click();
                expect(protractor_1.$(tree_data_1.RootEl).getText()).toContain('A');
            });
            if (benchmark.buttons.indexOf(tree_data_1.DetectChangesBtn) !== -1) {
                it('should work for detectChanges', function () {
                    openTreeBenchmark(benchmark);
                    protractor_1.$(tree_data_1.DetectChangesBtn).click();
                    expect(protractor_1.$(tree_data_1.NumberOfChecksEl).getText()).toContain('10');
                });
            }
        });
    });
    function openTreeBenchmark(benchmark) {
        var params = [{ name: 'depth', value: 4 }];
        if (benchmark.extraParams) {
            params = params.concat(benchmark.extraParams);
        }
        protractor_1.browser.rootEl = tree_data_1.RootEl;
        e2e_util_1.openBrowser({
            url: benchmark.url,
            ignoreBrowserSynchronization: benchmark.ignoreBrowserSynchronization,
            params: params,
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbW9kdWxlcy9iZW5jaG1hcmtzL2UyZV90ZXN0L3RyZWVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDhDQUFxRTtBQUNyRSx5Q0FBc0M7QUFFdEMseUNBQXFIO0FBRXJILFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtJQUU5QixJQUFJLFVBQWUsQ0FBQztJQUNwQixVQUFVLENBQUMsY0FBTSxPQUFBLFVBQVUsR0FBRyxvQkFBTyxDQUFDLE1BQU0sRUFBM0IsQ0FBMkIsQ0FBQyxDQUFDO0lBRTlDLFNBQVMsQ0FBQztRQUNSLG9CQUFPLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztRQUM1QixnQ0FBcUIsRUFBRSxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDO0lBRUgsc0JBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQSxTQUFTO1FBQzFCLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFO1lBQ3JCLEVBQUUsQ0FBQywrQkFBK0IsRUFBRTtnQkFDbEMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzdCLGNBQUMsQ0FBQyxxQkFBUyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ3JCLE1BQU0sQ0FBQyxjQUFDLENBQUMsa0JBQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMzQyxjQUFDLENBQUMsc0JBQVUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUN0QixNQUFNLENBQUMsY0FBQyxDQUFDLGtCQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMxQyxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyx3QkFBd0IsRUFBRTtnQkFDM0IsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzdCLGNBQUMsQ0FBQyxxQkFBUyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ3JCLGNBQUMsQ0FBQyxxQkFBUyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ3JCLE1BQU0sQ0FBQyxjQUFDLENBQUMsa0JBQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdDLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyw0QkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUN0RCxFQUFFLENBQUMsK0JBQStCLEVBQUU7b0JBQ2xDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUM3QixjQUFDLENBQUMsNEJBQWdCLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDNUIsTUFBTSxDQUFDLGNBQUMsQ0FBQyw0QkFBZ0IsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN4RCxDQUFDLENBQUMsQ0FBQzthQUNKO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILDJCQUEyQixTQUFvQjtRQUM3QyxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUN6QyxJQUFJLFNBQVMsQ0FBQyxXQUFXLEVBQUU7WUFDekIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQy9DO1FBQ0Qsb0JBQU8sQ0FBQyxNQUFNLEdBQUcsa0JBQU0sQ0FBQztRQUN4QixzQkFBVyxDQUFDO1lBQ1YsR0FBRyxFQUFFLFNBQVMsQ0FBQyxHQUFHO1lBQ2xCLDRCQUE0QixFQUFFLFNBQVMsQ0FBQyw0QkFBNEI7WUFDcEUsTUFBTSxFQUFFLE1BQU07U0FDZixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQyxDQUFDLENBQUMifQ==