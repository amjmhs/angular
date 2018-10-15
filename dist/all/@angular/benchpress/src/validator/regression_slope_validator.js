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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var statistic_1 = require("../statistic");
var validator_1 = require("../validator");
/**
 * A validator that checks the regression slope of a specific metric.
 * Waits for the regression slope to be >=0.
 */
var RegressionSlopeValidator = /** @class */ (function (_super) {
    __extends(RegressionSlopeValidator, _super);
    function RegressionSlopeValidator(_sampleSize, _metric) {
        var _this = _super.call(this) || this;
        _this._sampleSize = _sampleSize;
        _this._metric = _metric;
        return _this;
    }
    RegressionSlopeValidator_1 = RegressionSlopeValidator;
    RegressionSlopeValidator.prototype.describe = function () {
        return { 'sampleSize': this._sampleSize, 'regressionSlopeMetric': this._metric };
    };
    RegressionSlopeValidator.prototype.validate = function (completeSample) {
        if (completeSample.length >= this._sampleSize) {
            var latestSample = completeSample.slice(completeSample.length - this._sampleSize, completeSample.length);
            var xValues = [];
            var yValues = [];
            for (var i = 0; i < latestSample.length; i++) {
                // For now, we only use the array index as x value.
                // TODO(tbosch): think about whether we should use time here instead
                xValues.push(i);
                yValues.push(latestSample[i].values[this._metric]);
            }
            var regressionSlope = statistic_1.Statistic.calculateRegressionSlope(xValues, statistic_1.Statistic.calculateMean(xValues), yValues, statistic_1.Statistic.calculateMean(yValues));
            return regressionSlope >= 0 ? latestSample : null;
        }
        else {
            return null;
        }
    };
    var RegressionSlopeValidator_1;
    RegressionSlopeValidator.SAMPLE_SIZE = new core_1.InjectionToken('RegressionSlopeValidator.sampleSize');
    RegressionSlopeValidator.METRIC = new core_1.InjectionToken('RegressionSlopeValidator.metric');
    RegressionSlopeValidator.PROVIDERS = [
        {
            provide: RegressionSlopeValidator_1,
            deps: [RegressionSlopeValidator_1.SAMPLE_SIZE, RegressionSlopeValidator_1.METRIC]
        },
        { provide: RegressionSlopeValidator_1.SAMPLE_SIZE, useValue: 10 },
        { provide: RegressionSlopeValidator_1.METRIC, useValue: 'scriptTime' }
    ];
    RegressionSlopeValidator = RegressionSlopeValidator_1 = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(RegressionSlopeValidator_1.SAMPLE_SIZE)),
        __param(1, core_1.Inject(RegressionSlopeValidator_1.METRIC)),
        __metadata("design:paramtypes", [Number, String])
    ], RegressionSlopeValidator);
    return RegressionSlopeValidator;
}(validator_1.Validator));
exports.RegressionSlopeValidator = RegressionSlopeValidator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVncmVzc2lvbl9zbG9wZV92YWxpZGF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3NyYy92YWxpZGF0b3IvcmVncmVzc2lvbl9zbG9wZV92YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQWlFO0FBR2pFLDBDQUF1QztBQUN2QywwQ0FBdUM7QUFFdkM7OztHQUdHO0FBRUg7SUFBOEMsNENBQVM7SUFZckQsa0NBQzBELFdBQW1CLEVBQ3hCLE9BQWU7UUFGcEUsWUFHRSxpQkFBTyxTQUNSO1FBSHlELGlCQUFXLEdBQVgsV0FBVyxDQUFRO1FBQ3hCLGFBQU8sR0FBUCxPQUFPLENBQVE7O0lBRXBFLENBQUM7aUNBaEJVLHdCQUF3QjtJQWtCbkMsMkNBQVEsR0FBUjtRQUNFLE9BQU8sRUFBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSx1QkFBdUIsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDLENBQUM7SUFDakYsQ0FBQztJQUVELDJDQUFRLEdBQVIsVUFBUyxjQUErQjtRQUN0QyxJQUFJLGNBQWMsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUM3QyxJQUFNLFlBQVksR0FDZCxjQUFjLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUYsSUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO1lBQzdCLElBQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQztZQUM3QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDNUMsbURBQW1EO2dCQUNuRCxvRUFBb0U7Z0JBQ3BFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUNwRDtZQUNELElBQU0sZUFBZSxHQUFHLHFCQUFTLENBQUMsd0JBQXdCLENBQ3RELE9BQU8sRUFBRSxxQkFBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUscUJBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUMxRixPQUFPLGVBQWUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1NBQ25EO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQztTQUNiO0lBQ0gsQ0FBQzs7SUF2Q00sb0NBQVcsR0FBRyxJQUFJLHFCQUFjLENBQUMscUNBQXFDLENBQUMsQ0FBQztJQUN4RSwrQkFBTSxHQUFHLElBQUkscUJBQWMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0lBQy9ELGtDQUFTLEdBQUc7UUFDakI7WUFDRSxPQUFPLEVBQUUsMEJBQXdCO1lBQ2pDLElBQUksRUFBRSxDQUFDLDBCQUF3QixDQUFDLFdBQVcsRUFBRSwwQkFBd0IsQ0FBQyxNQUFNLENBQUM7U0FDOUU7UUFDRCxFQUFDLE9BQU8sRUFBRSwwQkFBd0IsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBQztRQUM3RCxFQUFDLE9BQU8sRUFBRSwwQkFBd0IsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBQztLQUNuRSxDQUFDO0lBVlMsd0JBQXdCO1FBRHBDLGlCQUFVLEVBQUU7UUFjTixXQUFBLGFBQU0sQ0FBQywwQkFBd0IsQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUM1QyxXQUFBLGFBQU0sQ0FBQywwQkFBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQTs7T0FkakMsd0JBQXdCLENBeUNwQztJQUFELCtCQUFDO0NBQUEsQUF6Q0QsQ0FBOEMscUJBQVMsR0F5Q3REO0FBekNZLDREQUF3QiJ9