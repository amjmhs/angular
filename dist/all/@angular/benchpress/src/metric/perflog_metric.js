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
var web_driver_extension_1 = require("../web_driver_extension");
/**
 * A metric that reads out the performance log
 */
var PerflogMetric = /** @class */ (function (_super) {
    __extends(PerflogMetric, _super);
    /**
     * @param driverExtension
     * @param setTimeout
     * @param microMetrics Name and description of metrics provided via console.time / console.timeEnd
     * @param ignoreNavigation If true, don't measure from navigationStart events. These events are
     *   usually triggered by a page load, but can also be triggered when adding iframes to the DOM.
     **/
    function PerflogMetric(_driverExtension, _setTimeout, _microMetrics, _forceGc, _captureFrames, _receivedData, _requestCount, _ignoreNavigation) {
        var _this = _super.call(this) || this;
        _this._driverExtension = _driverExtension;
        _this._setTimeout = _setTimeout;
        _this._microMetrics = _microMetrics;
        _this._forceGc = _forceGc;
        _this._captureFrames = _captureFrames;
        _this._receivedData = _receivedData;
        _this._requestCount = _requestCount;
        _this._ignoreNavigation = _ignoreNavigation;
        _this._remainingEvents = [];
        _this._measureCount = 0;
        _this._perfLogFeatures = _driverExtension.perfLogFeatures();
        if (!_this._perfLogFeatures.userTiming) {
            // User timing is needed for navigationStart.
            _this._receivedData = false;
            _this._requestCount = false;
        }
        return _this;
    }
    PerflogMetric_1 = PerflogMetric;
    PerflogMetric.prototype.describe = function () {
        var res = {
            'scriptTime': 'script execution time in ms, including gc and render',
            'pureScriptTime': 'script execution time in ms, without gc nor render'
        };
        if (this._perfLogFeatures.render) {
            res['renderTime'] = 'render time in ms';
        }
        if (this._perfLogFeatures.gc) {
            res['gcTime'] = 'gc time in ms';
            res['gcAmount'] = 'gc amount in kbytes';
            res['majorGcTime'] = 'time of major gcs in ms';
            if (this._forceGc) {
                res['forcedGcTime'] = 'forced gc time in ms';
                res['forcedGcAmount'] = 'forced gc amount in kbytes';
            }
        }
        if (this._receivedData) {
            res['receivedData'] = 'encoded bytes received since navigationStart';
        }
        if (this._requestCount) {
            res['requestCount'] = 'count of requests sent since navigationStart';
        }
        if (this._captureFrames) {
            if (!this._perfLogFeatures.frameCapture) {
                var warningMsg = 'WARNING: Metric requested, but not supported by driver';
                // using dot syntax for metric name to keep them grouped together in console reporter
                res['frameTime.mean'] = warningMsg;
                res['frameTime.worst'] = warningMsg;
                res['frameTime.best'] = warningMsg;
                res['frameTime.smooth'] = warningMsg;
            }
            else {
                res['frameTime.mean'] = 'mean frame time in ms (target: 16.6ms for 60fps)';
                res['frameTime.worst'] = 'worst frame time in ms';
                res['frameTime.best'] = 'best frame time in ms';
                res['frameTime.smooth'] = 'percentage of frames that hit 60fps';
            }
        }
        for (var name_1 in this._microMetrics) {
            res[name_1] = this._microMetrics[name_1];
        }
        return res;
    };
    PerflogMetric.prototype.beginMeasure = function () {
        var _this = this;
        var resultPromise = Promise.resolve(null);
        if (this._forceGc) {
            resultPromise = resultPromise.then(function (_) { return _this._driverExtension.gc(); });
        }
        return resultPromise.then(function (_) { return _this._beginMeasure(); });
    };
    PerflogMetric.prototype.endMeasure = function (restart) {
        if (this._forceGc) {
            return this._endPlainMeasureAndMeasureForceGc(restart);
        }
        else {
            return this._endMeasure(restart);
        }
    };
    /** @internal */
    PerflogMetric.prototype._endPlainMeasureAndMeasureForceGc = function (restartMeasure) {
        var _this = this;
        return this._endMeasure(true).then(function (measureValues) {
            // disable frame capture for measurements during forced gc
            var originalFrameCaptureValue = _this._captureFrames;
            _this._captureFrames = false;
            return _this._driverExtension.gc()
                .then(function (_) { return _this._endMeasure(restartMeasure); })
                .then(function (forceGcMeasureValues) {
                _this._captureFrames = originalFrameCaptureValue;
                measureValues['forcedGcTime'] = forceGcMeasureValues['gcTime'];
                measureValues['forcedGcAmount'] = forceGcMeasureValues['gcAmount'];
                return measureValues;
            });
        });
    };
    PerflogMetric.prototype._beginMeasure = function () {
        return this._driverExtension.timeBegin(this._markName(this._measureCount++));
    };
    PerflogMetric.prototype._endMeasure = function (restart) {
        var _this = this;
        var markName = this._markName(this._measureCount - 1);
        var nextMarkName = restart ? this._markName(this._measureCount++) : null;
        return this._driverExtension.timeEnd(markName, nextMarkName)
            .then(function (_) { return _this._readUntilEndMark(markName); });
    };
    PerflogMetric.prototype._readUntilEndMark = function (markName, loopCount, startEvent) {
        var _this = this;
        if (loopCount === void 0) { loopCount = 0; }
        if (startEvent === void 0) { startEvent = null; }
        if (loopCount > _MAX_RETRY_COUNT) {
            throw new Error("Tried too often to get the ending mark: " + loopCount);
        }
        return this._driverExtension.readPerfLog().then(function (events) {
            _this._addEvents(events);
            var result = _this._aggregateEvents(_this._remainingEvents, markName);
            if (result) {
                _this._remainingEvents = events;
                return result;
            }
            var resolve;
            var promise = new Promise(function (res) { resolve = res; });
            _this._setTimeout(function () { return resolve(_this._readUntilEndMark(markName, loopCount + 1)); }, 100);
            return promise;
        });
    };
    PerflogMetric.prototype._addEvents = function (events) {
        var _this = this;
        var needSort = false;
        events.forEach(function (event) {
            if (event['ph'] === 'X') {
                needSort = true;
                var startEvent = {};
                var endEvent = {};
                for (var prop in event) {
                    startEvent[prop] = event[prop];
                    endEvent[prop] = event[prop];
                }
                startEvent['ph'] = 'B';
                endEvent['ph'] = 'E';
                endEvent['ts'] = startEvent['ts'] + startEvent['dur'];
                _this._remainingEvents.push(startEvent);
                _this._remainingEvents.push(endEvent);
            }
            else {
                _this._remainingEvents.push(event);
            }
        });
        if (needSort) {
            // Need to sort because of the ph==='X' events
            this._remainingEvents.sort(function (a, b) {
                var diff = a['ts'] - b['ts'];
                return diff > 0 ? 1 : diff < 0 ? -1 : 0;
            });
        }
    };
    PerflogMetric.prototype._aggregateEvents = function (events, markName) {
        var _this = this;
        var result = { 'scriptTime': 0, 'pureScriptTime': 0 };
        if (this._perfLogFeatures.gc) {
            result['gcTime'] = 0;
            result['majorGcTime'] = 0;
            result['gcAmount'] = 0;
        }
        if (this._perfLogFeatures.render) {
            result['renderTime'] = 0;
        }
        if (this._captureFrames) {
            result['frameTime.mean'] = 0;
            result['frameTime.best'] = 0;
            result['frameTime.worst'] = 0;
            result['frameTime.smooth'] = 0;
        }
        for (var name_2 in this._microMetrics) {
            result[name_2] = 0;
        }
        if (this._receivedData) {
            result['receivedData'] = 0;
        }
        if (this._requestCount) {
            result['requestCount'] = 0;
        }
        var markStartEvent = null;
        var markEndEvent = null;
        events.forEach(function (event) {
            var ph = event['ph'];
            var name = event['name'];
            if (ph === 'B' && name === markName) {
                markStartEvent = event;
            }
            else if (ph === 'I' && name === 'navigationStart' && !_this._ignoreNavigation) {
                // if a benchmark measures reload of a page, use the last
                // navigationStart as begin event
                markStartEvent = event;
            }
            else if (ph === 'E' && name === markName) {
                markEndEvent = event;
            }
        });
        if (!markStartEvent || !markEndEvent) {
            // not all events have been received, no further processing for now
            return null;
        }
        if (markStartEvent.pid !== markEndEvent.pid) {
            result['invalid'] = 1;
        }
        var gcTimeInScript = 0;
        var renderTimeInScript = 0;
        var frameTimestamps = [];
        var frameTimes = [];
        var frameCaptureStartEvent = null;
        var frameCaptureEndEvent = null;
        var intervalStarts = {};
        var intervalStartCount = {};
        var inMeasureRange = false;
        events.forEach(function (event) {
            var ph = event['ph'];
            var name = event['name'];
            var microIterations = 1;
            var microIterationsMatch = name.match(_MICRO_ITERATIONS_REGEX);
            if (microIterationsMatch) {
                name = microIterationsMatch[1];
                microIterations = parseInt(microIterationsMatch[2], 10);
            }
            if (event === markStartEvent) {
                inMeasureRange = true;
            }
            else if (event === markEndEvent) {
                inMeasureRange = false;
            }
            if (!inMeasureRange || event['pid'] !== markStartEvent['pid']) {
                return;
            }
            if (_this._requestCount && name === 'sendRequest') {
                result['requestCount'] += 1;
            }
            else if (_this._receivedData && name === 'receivedData' && ph === 'I') {
                result['receivedData'] += event['args']['encodedDataLength'];
            }
            if (ph === 'B' && name === _MARK_NAME_FRAME_CAPTURE) {
                if (frameCaptureStartEvent) {
                    throw new Error('can capture frames only once per benchmark run');
                }
                if (!_this._captureFrames) {
                    throw new Error('found start event for frame capture, but frame capture was not requested in benchpress');
                }
                frameCaptureStartEvent = event;
            }
            else if (ph === 'E' && name === _MARK_NAME_FRAME_CAPTURE) {
                if (!frameCaptureStartEvent) {
                    throw new Error('missing start event for frame capture');
                }
                frameCaptureEndEvent = event;
            }
            if (ph === 'I' && frameCaptureStartEvent && !frameCaptureEndEvent && name === 'frame') {
                frameTimestamps.push(event['ts']);
                if (frameTimestamps.length >= 2) {
                    frameTimes.push(frameTimestamps[frameTimestamps.length - 1] -
                        frameTimestamps[frameTimestamps.length - 2]);
                }
            }
            if (ph === 'B') {
                if (!intervalStarts[name]) {
                    intervalStartCount[name] = 1;
                    intervalStarts[name] = event;
                }
                else {
                    intervalStartCount[name]++;
                }
            }
            else if ((ph === 'E') && intervalStarts[name]) {
                intervalStartCount[name]--;
                if (intervalStartCount[name] === 0) {
                    var startEvent = intervalStarts[name];
                    var duration = (event['ts'] - startEvent['ts']);
                    intervalStarts[name] = null;
                    if (name === 'gc') {
                        result['gcTime'] += duration;
                        var amount = (startEvent['args']['usedHeapSize'] - event['args']['usedHeapSize']) / 1000;
                        result['gcAmount'] += amount;
                        var majorGc = event['args']['majorGc'];
                        if (majorGc && majorGc) {
                            result['majorGcTime'] += duration;
                        }
                        if (intervalStarts['script']) {
                            gcTimeInScript += duration;
                        }
                    }
                    else if (name === 'render') {
                        result['renderTime'] += duration;
                        if (intervalStarts['script']) {
                            renderTimeInScript += duration;
                        }
                    }
                    else if (name === 'script') {
                        result['scriptTime'] += duration;
                    }
                    else if (_this._microMetrics[name]) {
                        result[name] += duration / microIterations;
                    }
                }
            }
        });
        if (frameCaptureStartEvent && !frameCaptureEndEvent) {
            throw new Error('missing end event for frame capture');
        }
        if (this._captureFrames && !frameCaptureStartEvent) {
            throw new Error('frame capture requested in benchpress, but no start event was found');
        }
        if (frameTimes.length > 0) {
            this._addFrameMetrics(result, frameTimes);
        }
        result['pureScriptTime'] = result['scriptTime'] - gcTimeInScript - renderTimeInScript;
        return result;
    };
    PerflogMetric.prototype._addFrameMetrics = function (result, frameTimes) {
        result['frameTime.mean'] = frameTimes.reduce(function (a, b) { return a + b; }, 0) / frameTimes.length;
        var firstFrame = frameTimes[0];
        result['frameTime.worst'] = frameTimes.reduce(function (a, b) { return a > b ? a : b; }, firstFrame);
        result['frameTime.best'] = frameTimes.reduce(function (a, b) { return a < b ? a : b; }, firstFrame);
        result['frameTime.smooth'] =
            frameTimes.filter(function (t) { return t < _FRAME_TIME_SMOOTH_THRESHOLD; }).length / frameTimes.length;
    };
    PerflogMetric.prototype._markName = function (index) { return "" + _MARK_NAME_PREFIX + index; };
    var PerflogMetric_1;
    PerflogMetric.SET_TIMEOUT = new core_1.InjectionToken('PerflogMetric.setTimeout');
    PerflogMetric.IGNORE_NAVIGATION = new core_1.InjectionToken('PerflogMetric.ignoreNavigation');
    PerflogMetric.PROVIDERS = [
        {
            provide: PerflogMetric_1,
            deps: [
                web_driver_extension_1.WebDriverExtension, PerflogMetric_1.SET_TIMEOUT, common_options_1.Options.MICRO_METRICS, common_options_1.Options.FORCE_GC,
                common_options_1.Options.CAPTURE_FRAMES, common_options_1.Options.RECEIVED_DATA, common_options_1.Options.REQUEST_COUNT,
                PerflogMetric_1.IGNORE_NAVIGATION
            ]
        },
        {
            provide: PerflogMetric_1.SET_TIMEOUT,
            useValue: function (fn, millis) { return setTimeout(fn, millis); }
        },
        { provide: PerflogMetric_1.IGNORE_NAVIGATION, useValue: false }
    ];
    PerflogMetric = PerflogMetric_1 = __decorate([
        core_1.Injectable(),
        __param(1, core_1.Inject(PerflogMetric_1.SET_TIMEOUT)),
        __param(2, core_1.Inject(common_options_1.Options.MICRO_METRICS)),
        __param(3, core_1.Inject(common_options_1.Options.FORCE_GC)),
        __param(4, core_1.Inject(common_options_1.Options.CAPTURE_FRAMES)),
        __param(5, core_1.Inject(common_options_1.Options.RECEIVED_DATA)),
        __param(6, core_1.Inject(common_options_1.Options.REQUEST_COUNT)),
        __param(7, core_1.Inject(PerflogMetric_1.IGNORE_NAVIGATION)),
        __metadata("design:paramtypes", [web_driver_extension_1.WebDriverExtension,
            Function, Object, Boolean, Boolean, Boolean, Boolean, Boolean])
    ], PerflogMetric);
    return PerflogMetric;
}(metric_1.Metric));
exports.PerflogMetric = PerflogMetric;
var _MICRO_ITERATIONS_REGEX = /(.+)\*(\d+)$/;
var _MAX_RETRY_COUNT = 20;
var _MARK_NAME_PREFIX = 'benchpress';
var _MARK_NAME_FRAME_CAPTURE = 'frameCapture';
// using 17ms as a somewhat looser threshold, instead of 16.6666ms
var _FRAME_TIME_SMOOTH_THRESHOLD = 17;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyZmxvZ19tZXRyaWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3NyYy9tZXRyaWMvcGVyZmxvZ19tZXRyaWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQWlFO0FBRWpFLG9EQUEwQztBQUMxQyxvQ0FBaUM7QUFDakMsZ0VBQTBGO0FBRzFGOztHQUVHO0FBRUg7SUFBbUMsaUNBQU07SUF1QnZDOzs7Ozs7UUFNSTtJQUNKLHVCQUNZLGdCQUFvQyxFQUNELFdBQXFCLEVBQ3pCLGFBQXNDLEVBQzNDLFFBQWlCLEVBQ1gsY0FBdUIsRUFDeEIsYUFBc0IsRUFDdEIsYUFBc0IsRUFDWixpQkFBMEI7UUFSL0UsWUFTRSxpQkFBTyxTQVVSO1FBbEJXLHNCQUFnQixHQUFoQixnQkFBZ0IsQ0FBb0I7UUFDRCxpQkFBVyxHQUFYLFdBQVcsQ0FBVTtRQUN6QixtQkFBYSxHQUFiLGFBQWEsQ0FBeUI7UUFDM0MsY0FBUSxHQUFSLFFBQVEsQ0FBUztRQUNYLG9CQUFjLEdBQWQsY0FBYyxDQUFTO1FBQ3hCLG1CQUFhLEdBQWIsYUFBYSxDQUFTO1FBQ3RCLG1CQUFhLEdBQWIsYUFBYSxDQUFTO1FBQ1osdUJBQWlCLEdBQWpCLGlCQUFpQixDQUFTO1FBRzdFLEtBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7UUFDM0IsS0FBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7UUFDdkIsS0FBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzNELElBQUksQ0FBQyxLQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFO1lBQ3JDLDZDQUE2QztZQUM3QyxLQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztZQUMzQixLQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FB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