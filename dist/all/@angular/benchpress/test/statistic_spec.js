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
var statistic_1 = require("../src/statistic");
{
    testing_internal_1.describe('statistic', function () {
        testing_internal_1.it('should calculate the mean', function () {
            testing_internal_1.expect(statistic_1.Statistic.calculateMean([])).toBeNaN();
            testing_internal_1.expect(statistic_1.Statistic.calculateMean([1, 2, 3])).toBe(2.0);
        });
        testing_internal_1.it('should calculate the standard deviation', function () {
            testing_internal_1.expect(statistic_1.Statistic.calculateStandardDeviation([], NaN)).toBeNaN();
            testing_internal_1.expect(statistic_1.Statistic.calculateStandardDeviation([1], 1)).toBe(0.0);
            testing_internal_1.expect(statistic_1.Statistic.calculateStandardDeviation([2, 4, 4, 4, 5, 5, 7, 9], 5)).toBe(2.0);
        });
        testing_internal_1.it('should calculate the coefficient of variation', function () {
            testing_internal_1.expect(statistic_1.Statistic.calculateCoefficientOfVariation([], NaN)).toBeNaN();
            testing_internal_1.expect(statistic_1.Statistic.calculateCoefficientOfVariation([1], 1)).toBe(0.0);
            testing_internal_1.expect(statistic_1.Statistic.calculateCoefficientOfVariation([2, 4, 4, 4, 5, 5, 7, 9], 5)).toBe(40.0);
        });
        testing_internal_1.it('should calculate the regression slope', function () {
            testing_internal_1.expect(statistic_1.Statistic.calculateRegressionSlope([], NaN, [], NaN)).toBeNaN();
            testing_internal_1.expect(statistic_1.Statistic.calculateRegressionSlope([1], 1, [2], 2)).toBeNaN();
            testing_internal_1.expect(statistic_1.Statistic.calculateRegressionSlope([1, 2], 1.5, [2, 4], 3)).toBe(2.0);
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGlzdGljX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3Rlc3Qvc3RhdGlzdGljX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwrRUFBZ0Y7QUFDaEYsOENBQTJDO0FBRTNDO0lBQ0UsMkJBQVEsQ0FBQyxXQUFXLEVBQUU7UUFFcEIscUJBQUUsQ0FBQywyQkFBMkIsRUFBRTtZQUM5Qix5QkFBTSxDQUFDLHFCQUFTLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDOUMseUJBQU0sQ0FBQyxxQkFBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMseUNBQXlDLEVBQUU7WUFDNUMseUJBQU0sQ0FBQyxxQkFBUyxDQUFDLDBCQUEwQixDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2hFLHlCQUFNLENBQUMscUJBQVMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9ELHlCQUFNLENBQUMscUJBQVMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0RixDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMsK0NBQStDLEVBQUU7WUFDbEQseUJBQU0sQ0FBQyxxQkFBUyxDQUFDLCtCQUErQixDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3JFLHlCQUFNLENBQUMscUJBQVMsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BFLHlCQUFNLENBQUMscUJBQVMsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1RixDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMsdUNBQXVDLEVBQUU7WUFDMUMseUJBQU0sQ0FBQyxxQkFBUyxDQUFDLHdCQUF3QixDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDdkUseUJBQU0sQ0FBQyxxQkFBUyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNyRSx5QkFBTSxDQUFDLHFCQUFTLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9FLENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9