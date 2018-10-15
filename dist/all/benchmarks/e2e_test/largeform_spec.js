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
describe('largeform benchmark spec', function () {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    it('should work for ng2', function () {
        testLargeformBenchmark({
            url: 'all/benchmarks/src/largeform/ng2/index.html',
        });
    });
    function testLargeformBenchmark(openConfig) {
        e2e_util_1.openBrowser({
            url: openConfig.url,
            params: [{ name: 'copies', value: 1 }],
            ignoreBrowserSynchronization: openConfig.ignoreBrowserSynchronization,
        });
        protractor_1.$('#createDom').click();
        expect(protractor_1.element.all(protractor_1.By.css('input[name=value0]')).get(0).getAttribute('value'))
            .toBe('someValue0');
        protractor_1.$('#destroyDom').click();
        expect(protractor_1.element.all(protractor_1.By.css('input[name=value0]')).count()).toBe(0);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFyZ2Vmb3JtX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9tb2R1bGVzL2JlbmNobWFya3MvZTJlX3Rlc3QvbGFyZ2Vmb3JtX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBcUU7QUFDckUseUNBQTBDO0FBRTFDLFFBQVEsQ0FBQywwQkFBMEIsRUFBRTtJQUVuQyxTQUFTLENBQUMsZ0NBQXFCLENBQUMsQ0FBQztJQUVqQyxFQUFFLENBQUMscUJBQXFCLEVBQUU7UUFDeEIsc0JBQXNCLENBQUM7WUFDckIsR0FBRyxFQUFFLDZDQUE2QztTQUNuRCxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILGdDQUNJLFVBQWlFO1FBQ25FLHNCQUFXLENBQUM7WUFDVixHQUFHLEVBQUUsVUFBVSxDQUFDLEdBQUc7WUFDbkIsTUFBTSxFQUFFLENBQUMsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUMsQ0FBQztZQUNwQyw0QkFBNEIsRUFBRSxVQUFVLENBQUMsNEJBQTRCO1NBQ3RFLENBQUMsQ0FBQztRQUNILGNBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN4QixNQUFNLENBQUMsb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUN6RSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDeEIsY0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRSxDQUFDO0FBQ0gsQ0FBQyxDQUFDLENBQUMifQ==