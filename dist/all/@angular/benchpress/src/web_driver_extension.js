"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_options_1 = require("./common_options");
/**
 * A WebDriverExtension implements extended commands of the webdriver protocol
 * for a given browser, independent of the WebDriverAdapter.
 * Needs one implementation for every supported Browser.
 */
var WebDriverExtension = /** @class */ (function () {
    function WebDriverExtension() {
    }
    WebDriverExtension.provideFirstSupported = function (childTokens) {
        var res = [
            {
                provide: _CHILDREN,
                useFactory: function (injector) { return childTokens.map(function (token) { return injector.get(token); }); },
                deps: [core_1.Injector]
            },
            {
                provide: WebDriverExtension,
                useFactory: function (children, capabilities) {
                    var delegate = undefined;
                    children.forEach(function (extension) {
                        if (extension.supports(capabilities)) {
                            delegate = extension;
                        }
                    });
                    if (!delegate) {
                        throw new Error('Could not find a delegate for given capabilities!');
                    }
                    return delegate;
                },
                deps: [_CHILDREN, common_options_1.Options.CAPABILITIES]
            }
        ];
        return res;
    };
    WebDriverExtension.prototype.gc = function () { throw new Error('NYI'); };
    WebDriverExtension.prototype.timeBegin = function (name) { throw new Error('NYI'); };
    WebDriverExtension.prototype.timeEnd = function (name, restartName) { throw new Error('NYI'); };
    /**
     * Format:
     * - cat: category of the event
     * - name: event name: 'script', 'gc', 'render', ...
     * - ph: phase: 'B' (begin), 'E' (end), 'X' (Complete event), 'I' (Instant event)
     * - ts: timestamp in ms, e.g. 12345
     * - pid: process id
     * - args: arguments, e.g. {heapSize: 1234}
     *
     * Based on [Chrome Trace Event
     *Format](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/edit)
     **/
    WebDriverExtension.prototype.readPerfLog = function () { throw new Error('NYI'); };
    WebDriverExtension.prototype.perfLogFeatures = function () { throw new Error('NYI'); };
    WebDriverExtension.prototype.supports = function (capabilities) { return true; };
    return WebDriverExtension;
}());
exports.WebDriverExtension = WebDriverExtension;
var PerfLogFeatures = /** @class */ (function () {
    function PerfLogFeatures(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.render, render = _c === void 0 ? false : _c, _d = _b.gc, gc = _d === void 0 ? false : _d, _e = _b.frameCapture, frameCapture = _e === void 0 ? false : _e, _f = _b.userTiming, userTiming = _f === void 0 ? false : _f;
        this.render = render;
        this.gc = gc;
        this.frameCapture = frameCapture;
        this.userTiming = userTiming;
    }
    return PerfLogFeatures;
}());
exports.PerfLogFeatures = PerfLogFeatures;
var _CHILDREN = new core_1.InjectionToken('WebDriverExtension.children');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViX2RyaXZlcl9leHRlbnNpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3NyYy93ZWJfZHJpdmVyX2V4dGVuc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUF1RDtBQUV2RCxtREFBeUM7QUFtQnpDOzs7O0dBSUc7QUFDSDtJQUFBO0lBbURBLENBQUM7SUFsRFEsd0NBQXFCLEdBQTVCLFVBQTZCLFdBQWtCO1FBQzdDLElBQU0sR0FBRyxHQUFHO1lBQ1Y7Z0JBQ0UsT0FBTyxFQUFFLFNBQVM7Z0JBQ2xCLFVBQVUsRUFBRSxVQUFDLFFBQWtCLElBQUssT0FBQSxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBbkIsQ0FBbUIsQ0FBQyxFQUE3QyxDQUE2QztnQkFDakYsSUFBSSxFQUFFLENBQUMsZUFBUSxDQUFDO2FBQ2pCO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLGtCQUFrQjtnQkFDM0IsVUFBVSxFQUFFLFVBQUMsUUFBOEIsRUFBRSxZQUFrQztvQkFDN0UsSUFBSSxRQUFRLEdBQXVCLFNBQVcsQ0FBQztvQkFDL0MsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFNBQVM7d0JBQ3hCLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsRUFBRTs0QkFDcEMsUUFBUSxHQUFHLFNBQVMsQ0FBQzt5QkFDdEI7b0JBQ0gsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsSUFBSSxDQUFDLFFBQVEsRUFBRTt3QkFDYixNQUFNLElBQUksS0FBSyxDQUFDLG1EQUFtRCxDQUFDLENBQUM7cUJBQ3RFO29CQUNELE9BQU8sUUFBUSxDQUFDO2dCQUNsQixDQUFDO2dCQUNELElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSx3QkFBTyxDQUFDLFlBQVksQ0FBQzthQUN4QztTQUNGLENBQUM7UUFDRixPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRCwrQkFBRSxHQUFGLGNBQXFCLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTlDLHNDQUFTLEdBQVQsVUFBVSxJQUFZLElBQWtCLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWpFLG9DQUFPLEdBQVAsVUFBUSxJQUFZLEVBQUUsV0FBd0IsSUFBa0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFekY7Ozs7Ozs7Ozs7O1FBV0k7SUFDSix3Q0FBVyxHQUFYLGNBQXlDLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWxFLDRDQUFlLEdBQWYsY0FBcUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFOUQscUNBQVEsR0FBUixVQUFTLFlBQWtDLElBQWEsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLHlCQUFDO0FBQUQsQ0FBQyxBQW5ERCxJQW1EQztBQW5EcUIsZ0RBQWtCO0FBcUR4QztJQU1FLHlCQUNJLEVBQ3VGO1lBRHZGLDRCQUN1RixFQUR0RixjQUFjLEVBQWQsbUNBQWMsRUFBRSxVQUFVLEVBQVYsK0JBQVUsRUFBRSxvQkFBb0IsRUFBcEIseUNBQW9CLEVBQUUsa0JBQWtCLEVBQWxCLHVDQUFrQjtRQUV2RSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQy9CLENBQUM7SUFDSCxzQkFBQztBQUFELENBQUMsQUFkRCxJQWNDO0FBZFksMENBQWU7QUFnQjVCLElBQU0sU0FBUyxHQUFHLElBQUkscUJBQWMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDIn0=