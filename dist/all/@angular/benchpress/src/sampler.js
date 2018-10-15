"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
var common_options_1 = require("./common_options");
var measure_values_1 = require("./measure_values");
var metric_1 = require("./metric");
var reporter_1 = require("./reporter");
var validator_1 = require("./validator");
var web_driver_adapter_1 = require("./web_driver_adapter");
/**
 * The Sampler owns the sample loop:
 * 1. calls the prepare/execute callbacks,
 * 2. gets data from the metric
 * 3. asks the validator for a valid sample
 * 4. reports the new data to the reporter
 * 5. loop until there is a valid sample
 */
var Sampler = /** @class */ (function () {
    function Sampler(_driver, _metric, _reporter, _validator, _prepare, _execute, _now) {
        this._driver = _driver;
        this._metric = _metric;
        this._reporter = _reporter;
        this._validator = _validator;
        this._prepare = _prepare;
        this._execute = _execute;
        this._now = _now;
    }
    Sampler_1 = Sampler;
    Sampler.prototype.sample = function () {
        var _this = this;
        var loop = function (lastState) {
            return _this._iterate(lastState).then(function (newState) {
                if (newState.validSample != null) {
                    return newState;
                }
                else {
                    return loop(newState);
                }
            });
        };
        return loop(new SampleState([], null));
    };
    Sampler.prototype._iterate = function (lastState) {
        var _this = this;
        var resultPromise;
        if (this._prepare !== common_options_1.Options.NO_PREPARE) {
            resultPromise = this._driver.waitFor(this._prepare);
        }
        else {
            resultPromise = Promise.resolve(null);
        }
        if (this._prepare !== common_options_1.Options.NO_PREPARE || lastState.completeSample.length === 0) {
            resultPromise = resultPromise.then(function (_) { return _this._metric.beginMeasure(); });
        }
        return resultPromise.then(function (_) { return _this._driver.waitFor(_this._execute); })
            .then(function (_) { return _this._metric.endMeasure(_this._prepare === common_options_1.Options.NO_PREPARE); })
            .then(function (measureValues) {
            if (!!measureValues['invalid']) {
                return lastState;
            }
            return _this._report(lastState, measureValues);
        });
    };
    Sampler.prototype._report = function (state, metricValues) {
        var _this = this;
        var measureValues = new measure_values_1.MeasureValues(state.completeSample.length, this._now(), metricValues);
        var completeSample = state.completeSample.concat([measureValues]);
        var validSample = this._validator.validate(completeSample);
        var resultPromise = this._reporter.reportMeasureValues(measureValues);
        if (validSample != null) {
            resultPromise =
                resultPromise.then(function (_) { return _this._reporter.reportSample(completeSample, validSample); });
        }
        return resultPromise.then(function (_) { return new SampleState(completeSample, validSample); });
    };
    var Sampler_1;
    Sampler.PROVIDERS = [{
            provide: Sampler_1,
            deps: [
                web_driver_adapter_1.WebDriverAdapter, metric_1.Metric, reporter_1.Reporter, validator_1.Validator, common_options_1.Options.PREPARE, common_options_1.Options.EXECUTE, common_options_1.Options.NOW
            ]
        }];
    Sampler = Sampler_1 = __decorate([
        core_1.Injectable(),
        __param(4, core_1.Inject(common_options_1.Options.PREPARE)),
        __param(5, core_1.Inject(common_options_1.Options.EXECUTE)),
        __param(6, core_1.Inject(common_options_1.Options.NOW)),
        __metadata("design:paramtypes", [web_driver_adapter_1.WebDriverAdapter, metric_1.Metric, reporter_1.Reporter,
            validator_1.Validator, Function,
            Function,
            Function])
    ], Sampler);
    return Sampler;
}());
exports.Sampler = Sampler;
var SampleState = /** @class */ (function () {
    function SampleState(completeSample, validSample) {
        this.completeSample = completeSample;
        this.validSample = validSample;
    }
    return SampleState;
}());
exports.SampleState = SampleState;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3Mvc3JjL3NhbXBsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBaUU7QUFFakUsbURBQXlDO0FBQ3pDLG1EQUErQztBQUMvQyxtQ0FBZ0M7QUFDaEMsdUNBQW9DO0FBQ3BDLHlDQUFzQztBQUN0QywyREFBc0Q7QUFHdEQ7Ozs7Ozs7R0FPRztBQUVIO0lBT0UsaUJBQ1ksT0FBeUIsRUFBVSxPQUFlLEVBQVUsU0FBbUIsRUFDL0UsVUFBcUIsRUFBbUMsUUFBa0IsRUFDakQsUUFBa0IsRUFDdEIsSUFBYztRQUhuQyxZQUFPLEdBQVAsT0FBTyxDQUFrQjtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQy9FLGVBQVUsR0FBVixVQUFVLENBQVc7UUFBbUMsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNqRCxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ3RCLFNBQUksR0FBSixJQUFJLENBQVU7SUFBRyxDQUFDO2dCQVh4QyxPQUFPO0lBYWxCLHdCQUFNLEdBQU47UUFBQSxpQkFXQztRQVZDLElBQU0sSUFBSSxHQUFHLFVBQUMsU0FBc0I7WUFDbEMsT0FBTyxLQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLFFBQVE7Z0JBQzVDLElBQUksUUFBUSxDQUFDLFdBQVcsSUFBSSxJQUFJLEVBQUU7b0JBQ2hDLE9BQU8sUUFBUSxDQUFDO2lCQUNqQjtxQkFBTTtvQkFDTCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDdkI7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDLElBQUksV0FBVyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMs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