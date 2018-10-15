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
    testing_internal_1.describe('size validator', function () {
        var validator;
        function createValidator(size) {
            validator =
                index_1.Injector
                    .create([index_1.SizeValidator.PROVIDERS, { provide: index_1.SizeValidator.SAMPLE_SIZE, useValue: size }])
                    .get(index_1.SizeValidator);
        }
        testing_internal_1.it('should return sampleSize as description', function () {
            createValidator(2);
            testing_internal_1.expect(validator.describe()).toEqual({ 'sampleSize': 2 });
        });
        testing_internal_1.it('should return null while the completeSample is smaller than the given size', function () {
            createValidator(2);
            testing_internal_1.expect(validator.validate([])).toBe(null);
            testing_internal_1.expect(validator.validate([mv(0, 0, {})])).toBe(null);
        });
        testing_internal_1.it('should return the last sampleSize runs when it has at least the given size', function () {
            createValidator(2);
            var sample = [mv(0, 0, { 'a': 1 }), mv(1, 1, { 'b': 2 }), mv(2, 2, { 'c': 3 })];
            testing_internal_1.expect(validator.validate(sample.slice(0, 2))).toEqual(sample.slice(0, 2));
            testing_internal_1.expect(validator.validate(sample)).toEqual(sample.slice(1, 3));
        });
    });
}
function mv(runIndex, time, values) {
    return new index_1.MeasureValues(runIndex, new Date(time), values);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l6ZV92YWxpZGF0b3Jfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3MvdGVzdC92YWxpZGF0b3Ivc2l6ZV92YWxpZGF0b3Jfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtFQUFnRjtBQUVoRixxQ0FBbUU7QUFFbkU7SUFDRSwyQkFBUSxDQUFDLGdCQUFnQixFQUFFO1FBQ3pCLElBQUksU0FBd0IsQ0FBQztRQUU3Qix5QkFBeUIsSUFBWTtZQUNuQyxTQUFTO2dCQUNMLGdCQUFRO3FCQUNILE1BQU0sQ0FDSCxDQUFDLHFCQUFhLENBQUMsU0FBUyxFQUFFLEVBQUMsT0FBTyxFQUFFLHFCQUFhLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO3FCQUNuRixHQUFHLENBQUMscUJBQWEsQ0FBQyxDQUFDO1FBQzlCLENBQUM7UUFFRCxxQkFBRSxDQUFDLHlDQUF5QyxFQUFFO1lBQzVDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQix5QkFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLFlBQVksRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQzFELENBQUMsQ0FBQyxDQUFDO1FBRUgscUJBQUUsQ0FBQyw0RUFBNEUsRUFBRTtZQUMvRSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIseUJBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFDLHlCQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMsNEVBQTRFLEVBQUU7WUFDL0UsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQU0sTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUMsR0FBRyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztZQUM1RSx5QkFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNFLHlCQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQyxDQUFDLENBQUM7Q0FDSjtBQUVELFlBQVksUUFBZ0IsRUFBRSxJQUFZLEVBQUUsTUFBK0I7SUFDekUsT0FBTyxJQUFJLHFCQUFhLENBQUMsUUFBUSxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzdELENBQUMifQ==