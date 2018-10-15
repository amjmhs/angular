"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var statistic_1 = require("../statistic");
function formatNum(n) {
    return n.toFixed(2);
}
exports.formatNum = formatNum;
function sortedProps(obj) {
    return Object.keys(obj).sort();
}
exports.sortedProps = sortedProps;
function formatStats(validSamples, metricName) {
    var samples = validSamples.map(function (measureValues) { return measureValues.values[metricName]; });
    var mean = statistic_1.Statistic.calculateMean(samples);
    var cv = statistic_1.Statistic.calculateCoefficientOfVariation(samples, mean);
    var formattedMean = formatNum(mean);
    // Note: Don't use the unicode character for +- as it might cause
    // hickups for consoles...
    return isNaN(cv) ? formattedMean : formattedMean + "+-" + Math.floor(cv) + "%";
}
exports.formatStats = formatStats;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3Mvc3JjL3JlcG9ydGVyL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCwwQ0FBdUM7QUFFdkMsbUJBQTBCLENBQVM7SUFDakMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLENBQUM7QUFGRCw4QkFFQztBQUVELHFCQUE0QixHQUF5QjtJQUNuRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakMsQ0FBQztBQUZELGtDQUVDO0FBRUQscUJBQTRCLFlBQTZCLEVBQUUsVUFBa0I7SUFDM0UsSUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFBLGFBQWEsSUFBSSxPQUFBLGFBQWEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQWhDLENBQWdDLENBQUMsQ0FBQztJQUNwRixJQUFNLElBQUksR0FBRyxxQkFBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QyxJQUFNLEVBQUUsR0FBRyxxQkFBUyxDQUFDLCtCQUErQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNwRSxJQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEMsaUVBQWlFO0lBQ2pFLDBCQUEwQjtJQUMxQixPQUFPLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBSSxhQUFhLFVBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBRyxDQUFDO0FBQzVFLENBQUM7QUFSRCxrQ0FRQyJ9