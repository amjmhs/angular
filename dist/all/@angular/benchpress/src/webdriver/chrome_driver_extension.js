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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_options_1 = require("../common_options");
var web_driver_adapter_1 = require("../web_driver_adapter");
var web_driver_extension_1 = require("../web_driver_extension");
/**
 * Set the following 'traceCategories' to collect metrics in Chrome:
 * 'v8,blink.console,disabled-by-default-devtools.timeline,devtools.timeline,blink.user_timing'
 *
 * In order to collect the frame rate related metrics, add 'benchmark'
 * to the list above.
 */
var ChromeDriverExtension = /** @class */ (function (_super) {
    __extends(ChromeDriverExtension, _super);
    function ChromeDriverExtension(_driver, userAgent) {
        var _this = _super.call(this) || this;
        _this._driver = _driver;
        _this._firstRun = true;
        _this._majorChromeVersion = _this._parseChromeVersion(userAgent);
        return _this;
    }
    ChromeDriverExtension_1 = ChromeDriverExtension;
    ChromeDriverExtension.prototype._parseChromeVersion = function (userAgent) {
        if (!userAgent) {
            return -1;
        }
        var v = userAgent.split(/Chrom(e|ium)\//g)[2];
        if (!v) {
            return -1;
        }
        v = v.split('.')[0];
        if (!v) {
            return -1;
        }
        return parseInt(v, 10);
    };
    ChromeDriverExtension.prototype.gc = function () { return this._driver.executeScript('window.gc()'); };
    ChromeDriverExtension.prototype.timeBegin = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._firstRun) return [3 /*break*/, 2];
                        this._firstRun = false;
                        // Before the first run, read out the existing performance logs
                        // so that the chrome buffer does not fill up.
                        return [4 /*yield*/, this._driver.logs('performance')];
                    case 1:
                        // Before the first run, read out the existing performance logs
                        // so that the chrome buffer does not fill up.
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this._driver.executeScript("console.time('" + name + "');")];
                }
            });
        });
    };
    ChromeDriverExtension.prototype.timeEnd = function (name, restartName) {
        if (restartName === void 0) { restartName = null; }
        var script = "console.timeEnd('" + name + "');";
        if (restartName) {
            script += "console.time('" + restartName + "');";
        }
        return this._driver.executeScript(script);
    };
    // See [Chrome Trace Event
    // Format](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/edit)
    ChromeDriverExtension.prototype.readPerfLog = function () {
        var _this = this;
        // TODO(tbosch): Chromedriver bug https://code.google.com/p/chromedriver/issues/detail?id=1098
        // Need to execute at least one command so that the browser logs can be read out!
        return this._driver.executeScript('1+1')
            .then(function (_) { return _this._driver.logs('performance'); })
            .then(function (entries) {
            var events = [];
            entries.forEach(function (entry) {
                var message = JSON.parse(entry['message'])['message'];
                if (message['method'] === 'Tracing.dataCollected') {
                    events.push(message['params']);
                }
                if (message['method'] === 'Tracing.bufferUsage') {
                    throw new Error('The DevTools trace buffer filled during the test!');
                }
            });
            return _this._convertPerfRecordsToEvents(events);
        });
    };
    ChromeDriverExtension.prototype._convertPerfRecordsToEvents = function (chromeEvents, normalizedEvents) {
        var _this = this;
        if (normalizedEvents === void 0) { normalizedEvents = null; }
        if (!normalizedEvents) {
            normalizedEvents = [];
        }
        chromeEvents.forEach(function (event) {
            var categories = _this._parseCategories(event['cat']);
            var normalizedEvent = _this._convertEvent(event, categories);
            if (normalizedEvent != null)
                normalizedEvents.push(normalizedEvent);
        });
        return normalizedEvents;
    };
    ChromeDriverExtension.prototype._convertEvent = function (event, categories) {
        var name = event['name'];
        var args = event['args'];
        if (this._isEvent(categories, name, ['blink.console'])) {
            return normalizeEvent(event, { 'name': name });
        }
        else if (this._isEvent(categories, name, ['benchmark'], 'BenchmarkInstrumentation::ImplThreadRenderingStats')) {
            // TODO(goderbauer): Instead of BenchmarkInstrumentation::ImplThreadRenderingStats the
            // following events should be used (if available) for more accurate measurements:
            //   1st choice: vsync_before - ground truth on Android
            //   2nd choice: BenchmarkInstrumentation::DisplayRenderingStats - available on systems with
            //               new surfaces framework (not broadly enabled yet)
            //   3rd choice: BenchmarkInstrumentation::ImplThreadRenderingStats - fallback event that is
            //               always available if something is rendered
            var frameCount = event['args']['data']['frame_count'];
            if (frameCount > 1) {
                throw new Error('multi-frame render stats not supported');
            }
            if (frameCount == 1) {
                return normalizeEvent(event, { 'name': 'frame' });
            }
        }
        else if (this._isEvent(categories, name, ['disabled-by-default-devtools.timeline'], 'Rasterize') ||
            this._isEvent(categories, name, ['disabled-by-default-devtools.timeline'], 'CompositeLayers')) {
            return normalizeEvent(event, { 'name': 'render' });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline', 'v8'], 'MajorGC')) {
            var normArgs = {
                'majorGc': true,
                'usedHeapSize': args['usedHeapSizeAfter'] !== undefined ? args['usedHeapSizeAfter'] :
                    args['usedHeapSizeBefore']
            };
            return normalizeEvent(event, { 'name': 'gc', 'args': normArgs });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline', 'v8'], 'MinorGC')) {
            var normArgs = {
                'majorGc': false,
                'usedHeapSize': args['usedHeapSizeAfter'] !== undefined ? args['usedHeapSizeAfter'] :
                    args['usedHeapSizeBefore']
            };
            return normalizeEvent(event, { 'name': 'gc', 'args': normArgs });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline'], 'FunctionCall') &&
            (!args || !args['data'] ||
                (args['data']['scriptName'] !== 'InjectedScript' && args['data']['scriptName'] !== ''))) {
            return normalizeEvent(event, { 'name': 'script' });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline'], 'EvaluateScript')) {
            return normalizeEvent(event, { 'name': 'script' });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline', 'blink'], 'UpdateLayoutTree')) {
            return normalizeEvent(event, { 'name': 'render' });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline'], 'UpdateLayerTree') ||
            this._isEvent(categories, name, ['devtools.timeline'], 'Layout') ||
            this._isEvent(categories, name, ['devtools.timeline'], 'Paint')) {
            return normalizeEvent(event, { 'name': 'render' });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline'], 'ResourceReceivedData')) {
            var normArgs = { 'encodedDataLength': args['data']['encodedDataLength'] };
            return normalizeEvent(event, { 'name': 'receivedData', 'args': normArgs });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline'], 'ResourceSendRequest')) {
            var data_1 = args['data'];
            var normArgs = { 'url': data_1['url'], 'method': data_1['requestMethod'] };
            return normalizeEvent(event, { 'name': 'sendRequest', 'args': normArgs });
        }
        else if (this._isEvent(categories, name, ['blink.user_timing'], 'navigationStart')) {
            return normalizeEvent(event, { 'name': 'navigationStart' });
        }
        return null; // nothing useful in this event
    };
    ChromeDriverExtension.prototype._parseCategories = function (categories) { return categories.split(','); };
    ChromeDriverExtension.prototype._isEvent = function (eventCategories, eventName, expectedCategories, expectedName) {
        if (expectedName === void 0) { expectedName = null; }
        var hasCategories = expectedCategories.reduce(function (value, cat) { return value && eventCategories.indexOf(cat) !== -1; }, true);
        return !expectedName ? hasCategories : hasCategories && eventName === expectedName;
    };
    ChromeDriverExtension.prototype.perfLogFeatures = function () {
        return new web_driver_extension_1.PerfLogFeatures({ render: true, gc: true, frameCapture: true, userTiming: true });
    };
    ChromeDriverExtension.prototype.supports = function (capabilities) {
        return this._majorChromeVersion >= 44 && capabilities['browserName'].toLowerCase() === 'chrome';
    };
    var ChromeDriverExtension_1;
    ChromeDriverExtension.PROVIDERS = [{
            provide: ChromeDriverExtension_1,
            deps: [web_driver_adapter_1.WebDriverAdapter, common_options_1.Options.USER_AGENT]
        }];
    ChromeDriverExtension = ChromeDriverExtension_1 = __decorate([
        core_1.Injectable(),
        __param(1, core_1.Inject(common_options_1.Options.USER_AGENT)),
        __metadata("design:paramtypes", [web_driver_adapter_1.WebDriverAdapter, String])
    ], ChromeDriverExtension);
    return ChromeDriverExtension;
}(web_driver_extension_1.WebDriverExtension));
exports.ChromeDriverExtension = ChromeDriverExtension;
function normalizeEvent(chromeEvent, data) {
    var ph = chromeEvent['ph'].toUpperCase();
    if (ph === 'S') {
        ph = 'B';
    }
    else if (ph === 'F') {
        ph = 'E';
    }
    else if (ph === 'R') {
        // mark events from navigation timing
        ph = 'I';
    }
    var result = { 'pid': chromeEvent['pid'], 'ph': ph, 'cat': 'timeline', 'ts': chromeEvent['ts'] / 1000 };
    if (ph === 'X') {
        var dur = chromeEvent['dur'];
        if (dur === undefined) {
            dur = chromeEvent['tdur'];
        }
        result['dur'] = !dur ? 0.0 : dur / 1000;
    }
    for (var prop in data) {
        result[prop] = data[prop];
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hyb21lX2RyaXZlcl9leHRlbnNpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3NyYy93ZWJkcml2ZXIvY2hyb21lX2RyaXZlcl9leHRlbnNpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBaUU7QUFFakUsb0RBQTBDO0FBQzFDLDREQUF1RDtBQUN2RCxnRUFBMEY7QUFFMUY7Ozs7OztHQU1HO0FBRUg7SUFBMkMseUNBQWtCO0lBUzNELCtCQUFvQixPQUF5QixFQUE4QixTQUFpQjtRQUE1RixZQUNFLGlCQUFPLFNBRVI7UUFIbUIsYUFBTyxHQUFQLE9BQU8sQ0FBa0I7UUFGckMsZUFBUyxHQUFHLElBQUksQ0FBQztRQUl2QixLQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDOztJQUNqRSxDQUFDOzhCQVpVLHFCQUFxQjtJQWN4QixtREFBbUIsR0FBM0IsVUFBNEIsU0FBaUI7UUFDM0MsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNkLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDWDtRQUNELElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsQ0FBQyxFQUFFO1lBQ04sT0FBTyxDQUFDLENBQUMsQ0FBQztTQUNYO1FBQ0QsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLENBQUMsRUFBRTtZQUNOLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDWDtRQUNELE9BQU8sUUFBUSxDQUFDLENBQUMsRUFB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