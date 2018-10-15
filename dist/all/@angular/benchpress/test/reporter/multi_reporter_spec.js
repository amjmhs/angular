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
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var index_1 = require("../../index");
(function () {
    function createReporters(ids) {
        var r = index_1.Injector
            .create([
            ids.map(function (id) { return ({ provide: id, useValue: new MockReporter(id) }); }),
            index_1.MultiReporter.provideWith(ids)
        ])
            .get(index_1.MultiReporter);
        return Promise.resolve(r);
    }
    testing_internal_1.describe('multi reporter', function () {
        testing_internal_1.it('should reportMeasureValues to all', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var mv = new index_1.MeasureValues(0, new Date(), {});
            createReporters(['m1', 'm2']).then(function (r) { return r.reportMeasureValues(mv); }).then(function (values) {
                testing_internal_1.expect(values).toEqual([{ 'id': 'm1', 'values': mv }, { 'id': 'm2', 'values': mv }]);
                async.done();
            });
        }));
        testing_internal_1.it('should reportSample to call', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var completeSample = [new index_1.MeasureValues(0, new Date(), {}), new index_1.MeasureValues(1, new Date(), {})];
            var validSample = [completeSample[1]];
            createReporters(['m1', 'm2'])
                .then(function (r) { return r.reportSample(completeSample, validSample); })
                .then(function (values) {
                testing_internal_1.expect(values).toEqual([
                    { 'id': 'm1', 'completeSample': completeSample, 'validSample': validSample },
                    { 'id': 'm2', 'completeSample': completeSample, 'validSample': validSample }
                ]);
                async.done();
            });
        }));
    });
})();
var MockReporter = /** @class */ (function (_super) {
    __extends(MockReporter, _super);
    function MockReporter(_id) {
        var _this = _super.call(this) || this;
        _this._id = _id;
        return _this;
    }
    MockReporter.prototype.reportMeasureValues = function (values) {
        return Promise.resolve({ 'id': this._id, 'values': values });
    };
    MockReporter.prototype.reportSample = function (completeSample, validSample) {
        return Promise.resolve({ 'id': this._id, 'completeSample': completeSample, 'validSample': validSample });
    };
    return MockReporter;
}(index_1.Reporter));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlfcmVwb3J0ZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3MvdGVzdC9yZXBvcnRlci9tdWx0aV9yZXBvcnRlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILCtFQUE0RztBQUU1RyxxQ0FBNkU7QUFFN0UsQ0FBQztJQUNDLHlCQUF5QixHQUFVO1FBQ2pDLElBQU0sQ0FBQyxHQUFHLGdCQUFRO2FBQ0gsTUFBTSxDQUFDO1lBQ04sR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLENBQUMsRUFBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLFlBQVksQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQS9DLENBQStDLENBQUM7WUFDOUQscUJBQWEsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDO1NBQy9CLENBQUM7YUFDRCxHQUFHLENBQWdCLHFCQUFhLENBQUMsQ0FBQztRQUNqRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELDJCQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFFekIscUJBQUUsQ0FBQyxtQ0FBbUMsRUFDbkMseUJBQU0sQ0FBQyxDQUFDLHFDQUFrQixDQUFDLEVBQUUsVUFBQyxLQUF5QjtZQUNyRCxJQUFNLEVBQUUsR0FBRyxJQUFJLHFCQUFhLENBQUMsQ0FBQyxFQUFFLElBQUksSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDaEQsZUFBZSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxFQUF6QixDQUF5QixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsTUFBTTtnQkFFL0UseUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqRixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxxQkFBRSxDQUFDLDZCQUE2QixFQUFFLHlCQUFNLENBQUMsQ0FBQyxxQ0FBa0IsQ0FBQyxFQUFFLFVBQUMsS0FBeUI7WUFDcEYsSUFBTSxjQUFjLEdBQ2hCLENBQUMsSUFBSSxxQkFBYSxDQUFDLENBQUMsRUFBRSxJQUFJLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUkscUJBQWEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pGLElBQU0sV0FBVyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFeEMsZUFBZSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUN4QixJQUFJLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxXQUFXLENBQUMsRUFBM0MsQ0FBMkMsQ0FBQztpQkFDeEQsSUFBSSxDQUFDLFVBQUMsTUFBTTtnQkFFWCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztvQkFDckIsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFDO29CQUMxRSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUM7aUJBQzNFLENBQUMsQ0FBQztnQkFDSCxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFVCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFFTDtJQUEyQixnQ0FBUTtJQUNqQyxzQkFBb0IsR0FBVztRQUEvQixZQUFtQyxpQkFBTyxTQUFHO1FBQXpCLFNBQUcsR0FBSCxHQUFHLENBQVE7O0lBQWEsQ0FBQztJQUU3QywwQ0FBbUIsR0FBbkIsVUFBb0IsTUFBcUI7UUFDdkMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELG1DQUFZLEdBQVosVUFBYSxjQUErQixFQUFFLFdBQTRCO1FBRXhFLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FDbEIsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7SUFDdEYsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQVpELENBQTJCLGdCQUFRLEdBWWxDIn0=