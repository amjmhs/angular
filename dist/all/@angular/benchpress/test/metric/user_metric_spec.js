"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var index_1 = require("../../index");
(function () {
    var wdAdapter;
    function createMetric(perfLogs, perfLogFeatures, _a) {
        var userMetrics = (_a === void 0 ? {} : _a).userMetrics;
        if (!perfLogFeatures) {
            perfLogFeatures =
                new index_1.PerfLogFeatures({ render: true, gc: true, frameCapture: true, userTiming: true });
        }
        if (!userMetrics) {
            userMetrics = {};
        }
        wdAdapter = new MockDriverAdapter();
        var providers = [
            index_1.Options.DEFAULT_PROVIDERS, index_1.UserMetric.PROVIDERS,
            { provide: index_1.Options.USER_METRICS, useValue: userMetrics },
            { provide: index_1.WebDriverAdapter, useValue: wdAdapter }
        ];
        return core_1.Injector.create(providers).get(index_1.UserMetric);
    }
    testing_internal_1.describe('user metric', function () {
        testing_internal_1.it('should describe itself based on userMetrics', function () {
            testing_internal_1.expect(createMetric([[]], new index_1.PerfLogFeatures(), {
                userMetrics: { 'loadTime': 'time to load' }
            }).describe())
                .toEqual({ 'loadTime': 'time to load' });
        });
        testing_internal_1.describe('endMeasure', function () {
            testing_internal_1.it('should stop measuring when all properties have numeric values', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var metric = createMetric([[]], new index_1.PerfLogFeatures(), { userMetrics: { 'loadTime': 'time to load', 'content': 'time to see content' } });
                metric.beginMeasure().then(function () { return metric.endMeasure(true); }).then(function (values) {
                    testing_internal_1.expect(values['loadTime']).toBe(25);
                    testing_internal_1.expect(values['content']).toBe(250);
                    async.done();
                });
                wdAdapter.data['loadTime'] = 25;
                // Wait before setting 2nd property.
                setTimeout(function () { wdAdapter.data['content'] = 250; }, 50);
            }), 600);
        });
    });
})();
var MockDriverAdapter = /** @class */ (function (_super) {
    __extends(MockDriverAdapter, _super);
    function MockDriverAdapter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = {};
        return _this;
    }
    MockDriverAdapter.prototype.executeScript = function (script) {
        // Just handles `return window.propName` ignores `delete window.propName`.
        if (script.indexOf('return window.') == 0) {
            var metricName = script.substring('return window.'.length);
            return Promise.resolve(this.data[metricName]);
        }
        else if (script.indexOf('delete window.') == 0) {
            return Promise.resolve(null);
        }
        else {
            return Promise.reject("Unexpected syntax: " + script);
        }
    };
    return MockDriverAdapter;
}(index_1.WebDriverAdapter));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcl9tZXRyaWNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3MvdGVzdC9tZXRyaWMvdXNlcl9tZXRyaWNfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBdUQ7QUFDdkQsK0VBQTRHO0FBRTVHLHFDQUFpRztBQUVqRyxDQUFDO0lBQ0MsSUFBSSxTQUE0QixDQUFDO0lBRWpDLHNCQUNJLFFBQXdCLEVBQUUsZUFBZ0MsRUFDMUQsRUFBMkQ7WUFBMUQsbURBQVc7UUFDZCxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3BCLGVBQWU7Z0JBQ1gsSUFBSSx1QkFBZSxDQUFDLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7U0FDekY7UUFDRCxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2hCLFdBQVcsR0FBRyxFQUFFLENBQUM7U0FDbEI7UUFDRCxTQUFTLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO1FBQ3BDLElBQU0sU0FBUyxHQUFxQjtZQUNsQyxlQUFPLENBQUMsaUJBQWlCLEVBQUUsa0JBQVUsQ0FBQyxTQUFTO1lBQy9DLEVBQUMsT0FBTyxFQUFFLGVBQU8sQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBQztZQUN0RCxFQUFDLE9BQU8sRUFBRSx3QkFBZ0IsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFDO1NBQ2pELENBQUM7UUFDRixPQUFPLGVBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLGtCQUFVLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQsMkJBQVEsQ0FBQyxhQUFhLEVBQUU7UUFFdEIscUJBQUUsQ0FBQyw2Q0FBNkMsRUFBRTtZQUNoRCx5QkFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksdUJBQWUsRUFBRSxFQUFFO2dCQUN4QyxXQUFXLEVBQUUsRUFBQyxVQUFVLEVBQUUsY0FBYyxFQUFDO2FBQzFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztpQkFDaEIsT0FBTyxDQUFDLEVBQUMsVUFBVSxFQUFFLGNBQWMsRUFBQyxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUM7UUFFSCwyQkFBUSxDQUFDLFlBQVksRUFBRTtZQUNyQixxQkFBRSxDQUFDLCtEQUErRCxFQUMvRCx5QkFBTSxDQUFDLENBQUMscUNBQWtCLENBQUMsRUFBRSxVQUFDLEtBQXlCO2dCQUNyRCxJQUFNLE1BQU0sR0FBRyxZQUFZLENBQ3ZCLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSx1QkFBZSxFQUFFLEVBQzNCLEVBQUMsV0FBVyxFQUFFLEVBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUscUJBQXFCLEVBQUMsRUFBQyxDQUFDLENBQUM7Z0JBQ25GLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBTSxPQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQXZCLENBQXVCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNO29CQUNuRSx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDcEMseUJBQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3BDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDZixDQUFDLENBQUMsQ0FBQztnQkFFSCxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDaEMsb0NBQW9DO2dCQUNwQyxVQUFVLENBQUMsY0FBUSxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUU3RCxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsRUFBRSxDQUFDO0FBRUw7SUFBZ0MscUNBQWdCO0lBQWhEO1FBQUEscUVBY0M7UUFiQyxVQUFJLEdBQVEsRUFBRSxDQUFDOztJQWFqQixDQUFDO0lBWEMseUNBQWEsR0FBYixVQUFjLE1BQWM7UUFDMUIsMEVBQTBFO1FBQzFFLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN6QyxJQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7U0FDL0M7YUFBTSxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDaEQsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzlCO2FBQU07WUFDTCxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsd0JBQXNCLE1BQVEsQ0FBQyxDQUFDO1NBQ3ZEO0lBQ0gsQ0FBQztJQUNILHdCQUFDO0FBQUQsQ0FBQyxBQWRELENBQWdDLHdCQUFnQixHQWMvQyJ9