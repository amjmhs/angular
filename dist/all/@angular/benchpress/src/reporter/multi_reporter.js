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
var core_1 = require("@angular/core");
var reporter_1 = require("../reporter");
var MultiReporter = /** @class */ (function (_super) {
    __extends(MultiReporter, _super);
    function MultiReporter(_reporters) {
        var _this = _super.call(this) || this;
        _this._reporters = _reporters;
        return _this;
    }
    MultiReporter.provideWith = function (childTokens) {
        return [
            {
                provide: _CHILDREN,
                useFactory: function (injector) { return childTokens.map(function (token) { return injector.get(token); }); },
                deps: [core_1.Injector],
            },
            {
                provide: MultiReporter,
                useFactory: function (children) { return new MultiReporter(children); },
                deps: [_CHILDREN]
            }
        ];
    };
    MultiReporter.prototype.reportMeasureValues = function (values) {
        return Promise.all(this._reporters.map(function (reporter) { return reporter.reportMeasureValues(values); }));
    };
    MultiReporter.prototype.reportSample = function (completeSample, validSample) {
        return Promise.all(this._reporters.map(function (reporter) { return reporter.reportSample(completeSample, validSample); }));
    };
    return MultiReporter;
}(reporter_1.Reporter));
exports.MultiReporter = MultiReporter;
var _CHILDREN = new core_1.InjectionToken('MultiReporter.children');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlfcmVwb3J0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3NyYy9yZXBvcnRlci9tdWx0aV9yZXBvcnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBdUQ7QUFHdkQsd0NBQXFDO0FBRXJDO0lBQW1DLGlDQUFRO0lBZ0J6Qyx1QkFBb0IsVUFBc0I7UUFBMUMsWUFBOEMsaUJBQU8sU0FBRztRQUFwQyxnQkFBVSxHQUFWLFVBQVUsQ0FBWTs7SUFBYSxDQUFDO0lBZmpELHlCQUFXLEdBQWxCLFVBQW1CLFdBQWtCO1FBQ25DLE9BQU87WUFDTDtnQkFDRSxPQUFPLEVBQUUsU0FBUztnQkFDbEIsVUFBVSxFQUFFLFVBQUMsUUFBa0IsSUFBSyxPQUFBLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFuQixDQUFtQixDQUFDLEVBQTdDLENBQTZDO2dCQUNqRixJQUFJLEVBQUUsQ0FBQyxlQUFRLENBQUM7YUFDakI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsYUFBYTtnQkFDdEIsVUFBVSxFQUFFLFVBQUMsUUFBb0IsSUFBSyxPQUFBLElBQUksYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUEzQixDQUEyQjtnQkFDakUsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDO2FBQ2xCO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFJRCwyQ0FBbUIsR0FBbkIsVUFBb0IsTUFBcUI7UUFDdkMsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxFQUFwQyxDQUFvQyxDQUFDLENBQUMsQ0FBQztJQUM1RixDQUFDO0lBRUQsb0NBQVksR0FBWixVQUFhLGNBQStCLEVBQUUsV0FBNEI7UUFDeEUsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUNkLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsV0FBVyxDQUFDLEVBQWxELENBQWtELENBQUMsQ0FBQyxDQUFDO0lBQzNGLENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUExQkQsQ0FBbUMsbUJBQVEsR0EwQjFDO0FBMUJZLHNDQUFhO0FBNEIxQixJQUFNLFNBQVMsR0FBRyxJQUFJLHFCQUFjLENBQUMsd0JBQXdCLENBQUMsQ0FBQyJ9