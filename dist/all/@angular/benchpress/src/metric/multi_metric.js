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
var metric_1 = require("../metric");
var MultiMetric = /** @class */ (function (_super) {
    __extends(MultiMetric, _super);
    function MultiMetric(_metrics) {
        var _this = _super.call(this) || this;
        _this._metrics = _metrics;
        return _this;
    }
    MultiMetric.provideWith = function (childTokens) {
        return [
            {
                provide: _CHILDREN,
                useFactory: function (injector) { return childTokens.map(function (token) { return injector.get(token); }); },
                deps: [core_1.Injector]
            },
            {
                provide: MultiMetric,
                useFactory: function (children) { return new MultiMetric(children); },
                deps: [_CHILDREN]
            }
        ];
    };
    /**
     * Starts measuring
     */
    MultiMetric.prototype.beginMeasure = function () {
        return Promise.all(this._metrics.map(function (metric) { return metric.beginMeasure(); }));
    };
    /**
     * Ends measuring and reports the data
     * since the begin call.
     * @param restart: Whether to restart right after this.
     */
    MultiMetric.prototype.endMeasure = function (restart) {
        return Promise.all(this._metrics.map(function (metric) { return metric.endMeasure(restart); }))
            .then(function (values) { return mergeStringMaps(values); });
    };
    /**
     * Describes the metrics provided by this metric implementation.
     * (e.g. units, ...)
     */
    MultiMetric.prototype.describe = function () {
        return mergeStringMaps(this._metrics.map(function (metric) { return metric.describe(); }));
    };
    return MultiMetric;
}(metric_1.Metric));
exports.MultiMetric = MultiMetric;
function mergeStringMaps(maps) {
    var result = {};
    maps.forEach(function (map) { Object.keys(map).forEach(function (prop) { result[prop] = map[prop]; }); });
    return result;
}
var _CHILDREN = new core_1.InjectionToken('MultiMetric.children');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlfbWV0cmljLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYmVuY2hwcmVzcy9zcmMvbWV0cmljL211bHRpX21ldHJpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBdUQ7QUFFdkQsb0NBQWlDO0FBRWpDO0lBQWlDLCtCQUFNO0lBZ0JyQyxxQkFBb0IsUUFBa0I7UUFBdEMsWUFBMEMsaUJBQU8sU0FBRztRQUFoQyxjQUFRLEdBQVIsUUFBUSxDQUFVOztJQUFhLENBQUM7SUFmN0MsdUJBQVcsR0FBbEIsVUFBbUIsV0FBa0I7UUFDbkMsT0FBTztZQUNMO2dCQUNFLE9BQU8sRUFBRSxTQUFTO2dCQUNsQixVQUFVLEVBQUUsVUFBQyxRQUFrQixJQUFLLE9BQUEsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQW5CLENBQW1CLENBQUMsRUFBN0MsQ0FBNkM7Z0JBQ2pGLElBQUksRUFBRSxDQUFDLGVBQVEsQ0FBQzthQUNqQjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxXQUFXO2dCQUNwQixVQUFVLEVBQUUsVUFBQyxRQUFrQixJQUFLLE9BQUEsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLEVBQXpCLENBQXlCO2dCQUM3RCxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUM7YUFDbEI7U0FDRixDQUFDO0lBQ0osQ0FBQztJQUlEOztPQUVHO0lBQ0gsa0NBQVksR0FBWjtRQUNFLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLE1BQU0sQ0FBQyxZQUFZLEVBQUUsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxnQ0FBVSxHQUFWLFVBQVcsT0FBZ0I7UUFDekIsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsTUFBTSxJQUFJLE9BQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBMUIsQ0FBMEIsQ0FBQyxDQUFDO2FBQ3RFLElBQUksQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLGVBQWUsQ0FBTSxNQUFNLENBQUMsRUFBNUIsQ0FBNEIsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRDs7O09BR0c7SUFDSCw4QkFBUSxHQUFSO1FBQ0UsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQyxNQUFNLElBQUssT0FBQSxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQWpCLENBQWlCLENBQUMsQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMsQUExQ0QsQ0FBaUMsZUFBTSxHQTBDdEM7QUExQ1ksa0NBQVc7QUE0Q3hCLHlCQUF5QixJQUErQjtJQUN0RCxJQUFNLE1BQU0sR0FBNEIsRUFBRSxDQUFDO0lBQzNDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHLElBQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLElBQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUYsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELElBQU0sU0FBUyxHQUFHLElBQUkscUJBQWMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDIn0=