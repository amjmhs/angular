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
var common_options_1 = require("../common_options");
var metric_1 = require("../metric");
var web_driver_adapter_1 = require("../web_driver_adapter");
var UserMetric = /** @class */ (function (_super) {
    __extends(UserMetric, _super);
    function UserMetric(_userMetrics, _wdAdapter) {
        var _this = _super.call(this) || this;
        _this._userMetrics = _userMetrics;
        _this._wdAdapter = _wdAdapter;
        return _this;
    }
    UserMetric_1 = UserMetric;
    /**
     * Starts measuring
     */
    UserMetric.prototype.beginMeasure = function () { return Promise.resolve(true); };
    /**
     * Ends measuring.
     */
    UserMetric.prototype.endMeasure = function (restart) {
        var resolve;
        var reject;
        var promise = new Promise(function (res, rej) {
            resolve = res;
            reject = rej;
        });
        var adapter = this._wdAdapter;
        var names = Object.keys(this._userMetrics);
        function getAndClearValues() {
            Promise.all(names.map(function (name) { return adapter.executeScript("return window." + name); }))
                .then(function (values) {
                if (values.every(function (v) { return typeof v === 'number'; })) {
                    Promise.all(names.map(function (name) { return adapter.executeScript("delete window." + name); }))
                        .then(function (_) {
                        var map = {};
                        for (var i = 0, n = names.length; i < n; i++) {
                            map[names[i]] = values[i];
                        }
                        resolve(map);
                    }, reject);
                }
                else {
                    setTimeout(getAndClearValues, 100);
                }
            }, reject);
        }
        getAndClearValues();
        return promise;
    };
    /**
     * Describes the metrics provided by this metric implementation.
     * (e.g. units, ...)
     */
    UserMetric.prototype.describe = function () { return this._userMetrics; };
    var UserMetric_1;
    UserMetric.PROVIDERS = [{ provide: UserMetric_1, deps: [common_options_1.Options.USER_METRICS, web_driver_adapter_1.WebDriverAdapter] }];
    UserMetric = UserMetric_1 = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(common_options_1.Options.USER_METRICS)),
        __metadata("design:paramtypes", [Object, web_driver_adapter_1.WebDriverAdapter])
    ], UserMetric);
    return UserMetric;
}(metric_1.Metric));
exports.UserMetric = UserMetric;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcl9tZXRyaWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3NyYy9tZXRyaWMvdXNlcl9tZXRyaWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQWlFO0FBRWpFLG9EQUEwQztBQUMxQyxvQ0FBaUM7QUFDakMsNERBQXVEO0FBR3ZEO0lBQWdDLDhCQUFNO0lBSXBDLG9CQUMwQyxZQUFxQyxFQUNuRSxVQUE0QjtRQUZ4QyxZQUdFLGlCQUFPLFNBQ1I7UUFIeUMsa0JBQVksR0FBWixZQUFZLENBQXlCO1FBQ25FLGdCQUFVLEdBQVYsVUFBVSxDQUFrQjs7SUFFeEMsQ0FBQzttQkFSVSxVQUFVO0lBVXJCOztPQUVHO0lBQ0gsaUNBQVksR0FBWixjQUErQixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTlEOztPQUVHO0lBQ0gsK0JBQVUsR0FBVixVQUFXLE9BQWdCO1FBQ3pCLElBQUksT0FBOEIsQ0FBQztRQUNuQyxJQUFJLE1BQTRCLENBQUM7UUFDakMsSUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUUsR0FBRztZQUNuQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1lBQ2QsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNoQyxJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUU3QztZQUNFLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLE9BQU8sQ0FBQyxhQUFhLENBQUMsbUJBQWlCLElBQU0sQ0FBQyxFQUE5QyxDQUE4QyxDQUFDLENBQUM7aUJBQ3pFLElBQUksQ0FBQyxVQUFDLE1BQWE7Z0JBQ2xCLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBckIsQ0FBcUIsQ0FBQyxFQUFFO29CQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxPQUFPLENBQUMsYUFBYSxDQUFDLG1CQUFpQixJQUFNLENBQUMsRUFBOUMsQ0FBOEMsQ0FBQyxDQUFDO3lCQUN6RSxJQUFJLENBQUMsVUFBQyxDQUFRO3dCQUNiLElBQU0sR0FBRyxHQUF1QixFQUFFLENBQUM7d0JBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7NEJBQzVDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQzNCO3dCQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDZixDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7aUJBQ2hCO3FCQUFNO29CQUNBLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQUMsQ0FBQztpQkFDekM7WUFDSCxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDakIsQ0FBQztRQUNELGlCQUFpQixFQUFFLENBQUM7UUFDcEIsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7T0FHRztJQUNILDZCQUFRLEdBQVIsY0FBbUMsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzs7SUFwRHZELG9CQUFTLEdBQ00sQ0FBQyxFQUFDLE9BQU8sRUFBRSxZQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsd0JBQU8sQ0FBQyxZQUFZLEVBQUUscUNBQWdCLENBQUMsRUFBQyxDQUFDLENBQUM7SUFGbkYsVUFBVTtRQUR0QixpQkFBVSxFQUFFO1FBTU4sV0FBQSxhQUFNLENBQUMsd0JBQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtpREFDVCxxQ0FBZ0I7T0FON0IsVUFBVSxDQXNEdEI7SUFBRCxpQkFBQztDQUFBLEFBdERELENBQWdDLGVBQU0sR0FzRHJDO0FBdERZLGdDQUFVIn0=