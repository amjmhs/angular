"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var index_1 = require("../../index");
{
    testing_internal_1.describe('console reporter', function () {
        var reporter;
        var log;
        function createReporter(_a) {
            var _b = _a.columnWidth, columnWidth = _b === void 0 ? null : _b, _c = _a.sampleId, sampleId = _c === void 0 ? null : _c, _d = _a.descriptions, descriptions = _d === void 0 ? null : _d, _e = _a.metrics, metrics = _e === void 0 ? null : _e;
            log = [];
            if (!descriptions) {
                descriptions = [];
            }
            if (sampleId == null) {
                sampleId = 'null';
            }
            var providers = [
                index_1.ConsoleReporter.PROVIDERS, {
                    provide: index_1.SampleDescription,
                    useValue: new index_1.SampleDescription(sampleId, descriptions, metrics)
                },
                { provide: index_1.ConsoleReporter.PRINT, useValue: function (line) { return log.push(line); } }
            ];
            if (columnWidth != null) {
                providers.push({ provide: index_1.ConsoleReporter.COLUMN_WIDTH, useValue: columnWidth });
            }
            reporter = index_1.Injector.create(providers).get(index_1.ConsoleReporter);
        }
        testing_internal_1.it('should print the sample id, description and table header', function () {
            createReporter({
                columnWidth: 8,
                sampleId: 'someSample',
                descriptions: [{ 'a': 1, 'b': 2 }],
                metrics: { 'm1': 'some desc', 'm2': 'some other desc' }
            });
            testing_internal_1.expect(log).toEqual([
                'BENCHMARK someSample',
                'Description:',
                '- a: 1',
                '- b: 2',
                'Metrics:',
                '- m1: some desc',
                '- m2: some other desc',
                '',
                '      m1 |       m2',
                '-------- | --------',
            ]);
        });
        testing_internal_1.it('should print a table row', function () {
            createReporter({ columnWidth: 8, metrics: { 'a': '', 'b': '' } });
            log = [];
            reporter.reportMeasureValues(mv(0, 0, { 'a': 1.23, 'b': 2 }));
            testing_internal_1.expect(log).toEqual(['    1.23 |     2.00']);
        });
        testing_internal_1.it('should print the table footer and stats when there is a valid sample', function () {
            createReporter({ columnWidth: 8, metrics: { 'a': '', 'b': '' } });
            log = [];
            reporter.reportSample([], [mv(0, 0, { 'a': 3, 'b': 6 }), mv(1, 1, { 'a': 5, 'b': 9 })]);
            testing_internal_1.expect(log).toEqual(['======== | ========', '4.00+-25% | 7.50+-20%']);
        });
        testing_internal_1.it('should print the coefficient of variation only when it is meaningful', function () {
            createReporter({ columnWidth: 8, metrics: { 'a': '', 'b': '' } });
            log = [];
            reporter.reportSample([], [mv(0, 0, { 'a': 3, 'b': 0 }), mv(1, 1, { 'a': 5, 'b': 0 })]);
            testing_internal_1.expect(log).toEqual(['======== | ========', '4.00+-25% |     0.00']);
        });
    });
}
function mv(runIndex, time, values) {
    return new index_1.MeasureValues(runIndex, new Date(time), values);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZV9yZXBvcnRlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYmVuY2hwcmVzcy90ZXN0L3JlcG9ydGVyL2NvbnNvbGVfcmVwb3J0ZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILCtFQUFnRjtBQUVoRixxQ0FBd0Y7QUFFeEY7SUFDRSwyQkFBUSxDQUFDLGtCQUFrQixFQUFFO1FBQzNCLElBQUksUUFBeUIsQ0FBQztRQUM5QixJQUFJLEdBQWEsQ0FBQztRQUVsQix3QkFDSSxFQUtDO2dCQUxBLG1CQUFrQixFQUFsQix1Q0FBa0IsRUFBRSxnQkFBZSxFQUFmLG9DQUFlLEVBQUUsb0JBQW1CLEVBQW5CLHdDQUFtQixFQUFFLGVBQWMsRUFBZCxtQ0FBYztZQU0zRSxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ1QsSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDakIsWUFBWSxHQUFHLEVBQUUsQ0FBQzthQUNuQjtZQUNELElBQUksUUFBUSxJQUFJLElBQUksRUFBRTtnQkFDcEIsUUFBUSxHQUFHLE1BQU0sQ0FBQzthQUNuQjtZQUNELElBQU0sU0FBUyxHQUFxQjtnQkFDbEMsdUJBQWUsQ0FBQyxTQUFTLEVBQUU7b0JBQ3pCLE9BQU8sRUFBRSx5QkFBaUI7b0JBQzFCLFFBQVEsRUFBRSxJQUFJLHlCQUFpQixDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsT0FBUyxDQUFDO2lCQUNuRTtnQkFDRCxFQUFDLE9BQU8sRUFBRSx1QkFBZSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsVUFBQyxJQUFZLElBQUssT0FBQSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFkLENBQWMsRUFBQzthQUM3RSxDQUFDO1lBQ0YsSUFBSSxXQUFXLElBQUksSUFBSSxFQUFFO2dCQUN2QixTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUMsT0FBTyxFQUFFLHVC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