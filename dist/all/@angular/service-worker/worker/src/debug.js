"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
var DEBUG_LOG_BUFFER_SIZE = 100;
var DebugHandler = /** @class */ (function () {
    function DebugHandler(driver, adapter) {
        this.driver = driver;
        this.adapter = adapter;
        // There are two debug log message arrays. debugLogA records new debugging messages.
        // Once it reaches DEBUG_LOG_BUFFER_SIZE, the array is moved to debugLogB and a new
        // array is assigned to debugLogA. This ensures that insertion to the debug log is
        // always O(1) no matter the number of logged messages, and that the total number
        // of messages in the log never exceeds 2 * DEBUG_LOG_BUFFER_SIZE.
        this.debugLogA = [];
        this.debugLogB = [];
    }
    DebugHandler.prototype.handleFetch = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, state, versions, idle, msgState, msgVersions, msgIdle;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.driver.debugState(),
                            this.driver.debugVersions(),
                            this.driver.debugIdleState(),
                        ])];
                    case 1:
                        _a = _b.sent(), state = _a[0], versions = _a[1], idle = _a[2];
                        msgState = "NGSW Debug Info:\n\nDriver state: " + state.state + " (" + state.why + ")\nLatest manifest hash: " + (state.latestHash || 'none') + "\nLast update check: " + this.since(state.lastUpdateCheck);
                        msgVersions = versions
                            .map(function (version) { return "=== Version " + version.hash + " ===\n\nClients: " + version.clients.join(', '); })
                            .join('\n\n');
                        msgIdle = "=== Idle Task Queue ===\nLast update tick: " + this.since(idle.lastTrigger) + "\nLast update run: " + this.since(idle.lastRun) + "\nTask queue:\n" + idle.queue.map(function (v) { return ' * ' + v; }).join('\n') + "\n\nDebug log:\n" + this.formatDebugLog(this.debugLogB) + "\n" + this.formatDebugLog(this.debugLogA) + "\n";
                        return [2 /*return*/, this.adapter.newResponse(msgState + "\n\n" + msgVersions + "\n\n" + msgIdle, { headers: this.adapter.newHeaders({ 'Content-Type': 'text/plain' }) })];
                }
            });
        });
    };
    DebugHandler.prototype.since = function (time) {
        if (time === null) {
            return 'never';
        }
        var age = this.adapter.time - time;
        var days = Math.floor(age / 86400000);
        age = age % 86400000;
        var hours = Math.floor(age / 3600000);
        age = age % 3600000;
        var minutes = Math.floor(age / 60000);
        age = age % 60000;
        var seconds = Math.floor(age / 1000);
        var millis = age % 1000;
        return '' + (days > 0 ? days + "d" : '') + (hours > 0 ? hours + "h" : '') +
            (minutes > 0 ? minutes + "m" : '') + (seconds > 0 ? seconds + "s" : '') +
            (millis > 0 ? millis + "u" : '');
    };
    DebugHandler.prototype.log = function (value, context) {
        if (context === void 0) { context = ''; }
        // Rotate the buffers if debugLogA has grown too large.
        if (this.debugLogA.length === DEBUG_LOG_BUFFER_SIZE) {
            this.debugLogB = this.debugLogA;
            this.debugLogA = [];
        }
        // Convert errors to string for logging.
        if (typeof value !== 'string') {
            value = this.errorToString(value);
        }
        // Log the message.
        this.debugLogA.push({ value: value, time: this.adapter.time, context: context });
    };
    DebugHandler.prototype.errorToString = function (err) { return err.name + "(" + err.message + ", " + err.stack + ")"; };
    DebugHandler.prototype.formatDebugLog = function (log) {
        var _this = this;
        return log.map(function (entry) { return "[" + _this.since(entry.time) + "] " + entry.value + " " + entry.context; })
            .join('\n');
    };
    return DebugHandler;
}());
exports.DebugHandler = DebugHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9zZXJ2aWNlLXdvcmtlci93b3JrZXIvc3JjL2RlYnVnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLSCxJQUFNLHFCQUFxQixHQUFHLEdBQUcsQ0FBQztBQVFsQztJQVNFLHNCQUFxQixNQUFrQixFQUFXLE9BQWdCO1FBQTdDLFdBQU0sR0FBTixNQUFNLENBQVk7UUFBVyxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBUmxFLG9GQUFvRjtRQUNwRixtRkFBbUY7UUFDbkYsa0ZBQWtGO1FBQ2xGLGlGQUFpRjtRQUNqRixrRUFBa0U7UUFDMUQsY0FBUyxHQUFtQixFQUFFLENBQUM7UUFDL0IsY0FBUyxHQUFtQixFQUFFLENBQUM7SUFFOEIsQ0FBQztJQUVoRSxrQ0FBVyxHQUFqQixVQUFrQixHQUFZOzs7Ozs0QkFDSSxxQkFBTSxPQUFPLENBQUMsR0FBRyxDQUFDOzRCQUNoRCxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTs0QkFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUU7NEJBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFO3lCQUM3QixDQUFDLEVBQUE7O3dCQUpJLEtBQTBCLFNBSTlCLEVBSkssS0FBSyxRQUFBLEVBQUUsUUFBUSxRQUFBLEVBQUUsSUFBSSxRQUFBO3dCQU10QixRQUFRLEdBQUcsdUNBRUwsS0FBSyxDQUFDLEtBQUssVUFBSyxLQUFLLENBQUMsR0FBRyxrQ0FDakIsS0FBSyxDQUFDLFVBQVUsSUFBSSxNQUFNLDhCQUM3QixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUcsQ0FBQzt3QkFFL0MsV0FBVyxHQUFHLFFBQVE7NkJBQ0gsR0FBRyxDQUFDLFVBQUEsT0FBTyxJQUFJLE9B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