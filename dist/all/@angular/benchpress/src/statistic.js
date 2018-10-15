"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Statistic = /** @class */ (function () {
    function Statistic() {
    }
    Statistic.calculateCoefficientOfVariation = function (sample, mean) {
        return Statistic.calculateStandardDeviation(sample, mean) / mean * 100;
    };
    Statistic.calculateMean = function (samples) {
        var total = 0;
        // TODO: use reduce
        samples.forEach(function (x) { return total += x; });
        return total / samples.length;
    };
    Statistic.calculateStandardDeviation = function (samples, mean) {
        var deviation = 0;
        // TODO: use reduce
        samples.forEach(function (x) { return deviation += Math.pow(x - mean, 2); });
        deviation = deviation / (samples.length);
        deviation = Math.sqrt(deviation);
        return deviation;
    };
    Statistic.calculateRegressionSlope = function (xValues, xMean, yValues, yMean) {
        // See http://en.wikipedia.org/wiki/Simple_linear_regression
        var dividendSum = 0;
        var divisorSum = 0;
        for (var i = 0; i < xValues.length; i++) {
            dividendSum += (xValues[i] - xMean) * (yValues[i] - yMean);
            divisorSum += Math.pow(xValues[i] - xMean, 2);
        }
        return dividendSum / divisorSum;
    };
    return Statistic;
}());
exports.Statistic = Statistic;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGlzdGljLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYmVuY2hwcmVzcy9zcmMvc3RhdGlzdGljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUg7SUFBQTtJQWdDQSxDQUFDO0lBL0JRLHlDQUErQixHQUF0QyxVQUF1QyxNQUFnQixFQUFFLElBQVk7UUFDbkUsT0FBTyxTQUFTLENBQUMsMEJBQTBCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxHQUFHLENBQUM7SUFDekUsQ0FBQztJQUVNLHVCQUFhLEdBQXBCLFVBQXFCLE9BQWlCO1FBQ3BDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLG1CQUFtQjtRQUNuQixPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSyxJQUFJLENBQUMsRUFBVixDQUFVLENBQUMsQ0FBQztRQUNqQyxPQUFPLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQ2hDLENBQUM7SUFFTSxvQ0FBMEIsR0FBakMsVUFBa0MsT0FBaUIsRUFBRSxJQUFZO1FBQy9ELElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNsQixtQkFBbUI7UUFDbkIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLFNBQVMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQWxDLENBQWtDLENBQUMsQ0FBQztRQUN6RCxTQUFTLEdBQUcsU0FBUyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pDLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFTSxrQ0FBd0IsR0FBL0IsVUFDSSxPQUFpQixFQUFFLEtBQWEsRUFBRSxPQUFpQixFQUFFLEtBQWE7UUFDcEUsNERBQTREO1FBQzVELElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztRQUNwQixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDbkIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdkMsV0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQzNELFVBQVUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDL0M7UUFDRCxPQUFPLFdBQVcsR0FBRyxVQUFVLENBQUM7SUFDbEMsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQWhDRCxJQWdDQztBQWhDWSw4QkFBUyJ9