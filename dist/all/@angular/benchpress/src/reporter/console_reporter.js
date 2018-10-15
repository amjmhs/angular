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
var reporter_1 = require("../reporter");
var sample_description_1 = require("../sample_description");
var util_1 = require("./util");
/**
 * A reporter for the console
 */
var ConsoleReporter = /** @class */ (function (_super) {
    __extends(ConsoleReporter, _super);
    function ConsoleReporter(_columnWidth, sampleDescription, _print) {
        var _this = _super.call(this) || this;
        _this._columnWidth = _columnWidth;
        _this._print = _print;
        _this._metricNames = util_1.sortedProps(sampleDescription.metrics);
        _this._printDescription(sampleDescription);
        return _this;
    }
    ConsoleReporter_1 = ConsoleReporter;
    ConsoleReporter._lpad = function (value, columnWidth, fill) {
        if (fill === void 0) { fill = ' '; }
        var result = '';
        for (var i = 0; i < columnWidth - value.length; i++) {
            result += fill;
        }
        return result + value;
    };
    ConsoleReporter.prototype._printDescription = function (sampleDescription) {
        var _this = this;
        this._print("BENCHMARK " + sampleDescription.id);
        this._print('Description:');
        var props = util_1.sortedProps(sampleDescription.description);
        props.forEach(function (prop) { _this._print("- " + prop + ": " + sampleDescription.description[prop]); });
        this._print('Metrics:');
        this._metricNames.forEach(function (metricName) {
            _this._print("- " + metricName + ": " + sampleDescription.metrics[metricName]);
        });
        this._print('');
        this._printStringRow(this._metricNames);
        this._printStringRow(this._metricNames.map(function (_) { return ''; }), '-');
    };
    ConsoleReporter.prototype.reportMeasureValues = function (measureValues) {
        var formattedValues = this._metricNames.map(function (metricName) {
            var value = measureValues.values[metricName];
            return util_1.formatNum(value);
        });
        this._printStringRow(formattedValues);
        return Promise.resolve(null);
    };
    ConsoleReporter.prototype.reportSample = function (completeSample, validSamples) {
        this._printStringRow(this._metricNames.map(function (_) { return ''; }), '=');
        this._printStringRow(this._metricNames.map(function (metricName) { return util_1.formatStats(validSamples, metricName); }));
        return Promise.resolve(null);
    };
    ConsoleReporter.prototype._printStringRow = function (parts, fill) {
        var _this = this;
        if (fill === void 0) { fill = ' '; }
        this._print(parts.map(function (part) { return ConsoleReporter_1._lpad(part, _this._columnWidth, fill); }).join(' | '));
    };
    var ConsoleReporter_1;
    ConsoleReporter.PRINT = new core_1.InjectionToken('ConsoleReporter.print');
    ConsoleReporter.COLUMN_WIDTH = new core_1.InjectionToken('ConsoleReporter.columnWidth');
    ConsoleReporter.PROVIDERS = [
        {
            provide: ConsoleReporter_1,
            deps: [ConsoleReporter_1.COLUMN_WIDTH, sample_description_1.SampleDescription, ConsoleReporter_1.PRINT]
        },
        { provide: ConsoleReporter_1.COLUMN_WIDTH, useValue: 18 }, {
            provide: ConsoleReporter_1.PRINT,
            useValue: function (v) {
                // tslint:disable-next-line:no-console
                console.log(v);
            }
        }
    ];
    ConsoleReporter = ConsoleReporter_1 = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(ConsoleReporter_1.COLUMN_WIDTH)),
        __param(2, core_1.Inject(ConsoleReporter_1.PRINT)),
        __metadata("design:paramtypes", [Number, sample_description_1.SampleDescription,
            Function])
    ], ConsoleReporter);
    return ConsoleReporter;
}(reporter_1.Reporter));
exports.ConsoleReporter = ConsoleReporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZV9yZXBvcnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3Mvc3JjL3JlcG9ydGVyL2NvbnNvbGVfcmVwb3J0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQWlFO0FBRWpFLHdDQUFxQztBQUNyQyw0REFBd0Q7QUFFeEQsK0JBQTJEO0FBRzNEOztHQUVHO0FBRUg7SUFBcUMsbUNBQVE7SUEyQjNDLHlCQUNrRCxZQUFvQixFQUNsRSxpQkFBb0MsRUFDRyxNQUFnQjtRQUgzRCxZQUlFLGlCQUFPLFNBR1I7UUFOaUQsa0JBQVksR0FBWixZQUFZLENBQVE7UUFFM0IsWUFBTSxHQUFOLE1BQU0sQ0FBVTtRQUV6RCxLQUFJLENBQUMsWUFBWSxHQUFHLGtCQUFXLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0QsS0FBSSxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLENBQUM7O0lBQzVDLENBQUM7d0JBbENVLGVBQWU7SUFpQlgscUJBQUssR0FBcEIsVUFBcUIsS0FBYSxFQUFFLFdBQW1CLEVBQUUsSUFBVTtRQUFWLHFCQUFBLEVBQUEsVUFBVTtRQUNqRSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25ELE1BQU0sSUFBSSxJQUFJLENBQUM7U0FDaEI7UUFDRCxPQUFPLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDeEIsQ0FBQztJQWFPLDJDQUFpQixHQUF6QixVQUEwQixpQkFBb0M7UUFBOUQsaUJBWUM7UUFYQyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWEsaUJBQWlCLENBQUMsRUFBSSxDQUFDLENB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