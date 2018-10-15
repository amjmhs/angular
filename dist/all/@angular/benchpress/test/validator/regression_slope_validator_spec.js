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
    testing_internal_1.describe('regression slope validator', function () {
        var validator;
        function createValidator(_a) {
            var size = _a.size, metric = _a.metric;
            validator = index_1.Injector
                .create([
                index_1.RegressionSlopeValidator.PROVIDERS,
                { provide: index_1.RegressionSlopeValidator.METRIC, useValue: metric },
                { provide: index_1.RegressionSlopeValidator.SAMPLE_SIZE, useValue: size }
            ])
                .get(index_1.RegressionSlopeValidator);
        }
        testing_internal_1.it('should return sampleSize and metric as description', function () {
            createValidator({ size: 2, metric: 'script' });
            testing_internal_1.expect(validator.describe()).toEqual({ 'sampleSize': 2, 'regressionSlopeMetric': 'script' });
        });
        testing_internal_1.it('should return null while the completeSample is smaller than the given size', function () {
            createValidator({ size: 2, metric: 'script' });
            testing_internal_1.expect(validator.validate([])).toBe(null);
            testing_internal_1.expect(validator.validate([mv(0, 0, {})])).toBe(null);
        });
        testing_internal_1.it('should return null while the regression slope is < 0', function () {
            createValidator({ size: 2, metric: 'script' });
            testing_internal_1.expect(validator.validate([mv(0, 0, { 'script': 2 }), mv(1, 1, { 'script': 1 })])).toBe(null);
        });
        testing_internal_1.it('should return the last sampleSize runs when the regression slope is ==0', function () {
            createValidator({ size: 2, metric: 'script' });
            var sample = [mv(0, 0, { 'script': 1 }), mv(1, 1, { 'script': 1 }), mv(2, 2, { 'script': 1 })];
            testing_internal_1.expect(validator.validate(sample.slice(0, 2))).toEqual(sample.slice(0, 2));
            testing_internal_1.expect(validator.validate(sample)).toEqual(sample.slice(1, 3));
        });
        testing_internal_1.it('should return the last sampleSize runs when the regression slope is >0', function () {
            createValidator({ size: 2, metric: 'script' });
            var sample = [mv(0, 0, { 'script': 1 }), mv(1, 1, { 'script': 2 }), mv(2, 2, { 'script': 3 })];
            testing_internal_1.expect(validator.validate(sample.slice(0, 2))).toEqual(sample.slice(0, 2));
            testing_internal_1.expect(validator.validate(sample)).toEqual(sample.slice(1, 3));
        });
    });
}
function mv(runIndex, time, values) {
    return new index_1.MeasureValues(runIndex, new Date(time), values);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVncmVzc2lvbl9zbG9wZV92YWxpZGF0b3Jfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3MvdGVzdC92YWxpZGF0b3IvcmVncmVzc2lvbl9zbG9wZV92YWxpZGF0b3Jfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtFQUFnRjtBQUVoRixxQ0FBOEU7QUFFOUU7SUFDRSwyQkFBUSxDQUFDLDRCQUE0QixFQUFFO1FBQ3JDLElBQUksU0FBbUMsQ0FBQztRQUV4Qyx5QkFBeUIsRUFBOEM7Z0JBQTdDLGNBQUksRUFBRSxrQkFBTTtZQUNwQyxTQUFTLEdBQUcsZ0JBQVE7aUJBQ0gsTUFBTSxDQUFDO2dCQUNOLGdDQUF3QixDQUFDLFNBQVM7Z0JBQ2xDLEVBQUMsT0FBTyxFQUFFLGdDQUF3QixDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFDO2dCQUM1RCxFQUFDLE9BQU8sRUFBRSxnQ0FBd0IsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQzthQUNoRSxDQUFDO2lCQUNELEdBQUcsQ0FBQyxnQ0FBd0IsQ0FBQyxDQUFDO1FBQ2pELENBQUM7UUFFRCxxQkFBRSxDQUFDLG9EQUFvRCxFQUFFO1lBQ3ZELGVBQWUsQ0FBQyxFQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7WUFDN0MseUJBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLHVCQUF1QixFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7UUFDN0YsQ0FBQyxDQUFDLENBQUM7UUFFSCxxQkFBRSxDQUFDLDRFQUE0RSxFQUFFO1lBQy9FLGVBQWUsQ0FBQyxFQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7WUFDN0MseUJBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFDLHlCQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMsc0RBQXNELEVBQUU7WUFDekQsZUFBZSxDQUFDLEVBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQztZQUM3Qyx5QkFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUMsUUFBUSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVGLENBQUMsQ0FBQyxDQUFDO1FBRUgscUJBQUUsQ0FBQyx5RUFBeUUsRUFBRTtZQUM1RSxlQUFlLENBQUMsRUFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO1lBQzdDLElBQU0sTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUMsUUFBUSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztZQUMzRix5QkFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNFLHlCQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLENBQUMsQ0FBQyxDQUFDO1FBRUgscUJBQUUsQ0FBQyx3RUFBd0UsRUFBRTtZQUMzRSxlQUFlLENBQUMsRUFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO1lBQzdDLElBQU0sTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUMsUUFBUSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztZQUMzRix5QkFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNFLHlCQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQyxDQUFDLENBQUM7Q0FDSjtBQUVELFlBQVksUUFBZ0IsRUFBRSxJQUFZLEVBQUUsTUFBK0I7SUFDekUsT0FBTyxJQUFJLHFCQUFhLENBQUMsUUFBUSxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzdELENBQUMifQ==