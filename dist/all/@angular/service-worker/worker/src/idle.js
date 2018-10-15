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
var IdleScheduler = /** @class */ (function () {
    function IdleScheduler(adapter, threshold, debug) {
        this.adapter = adapter;
        this.threshold = threshold;
        this.debug = debug;
        this.queue = [];
        this.scheduled = null;
        this.empty = Promise.resolve();
        this.emptyResolve = null;
        this.lastTrigger = null;
        this.lastRun = null;
    }
    IdleScheduler.prototype.trigger = function () {
        return __awaiter(this, void 0, void 0, function () {
            var scheduled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.lastTrigger = this.adapter.time;
                        if (this.queue.length === 0) {
                            return [2 /*return*/];
                        }
                        if (this.scheduled !== null) {
                            this.scheduled.cancel = true;
                        }
                        scheduled = {
                            cancel: false,
                        };
                        this.scheduled = scheduled;
                        return [4 /*yield*/, this.adapter.timeout(this.threshold)];
                    case 1:
                        _a.sent();
                        if (scheduled.cancel) {
                            return [2 /*return*/];
                        }
                        this.scheduled = null;
                        return [4 /*yield*/, this.execute()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    IdleScheduler.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var queue;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.lastRun = this.adapter.time;
                        _a.label = 1;
                    case 1:
                        if (!(this.queue.length > 0)) return [3 /*break*/, 3];
                        queue = this.queue;
                        this.queue = [];
                        return [4 /*yield*/, queue.reduce(function (previous, task) { return __awaiter(_this, void 0, void 0, function () {
                                var err_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, previous];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2:
                                            _a.trys.push([2, 4, , 5]);
                                            return [4 /*yield*/, task.run()];
                                        case 3:
                                            _a.sent();
                                            return [3 /*break*/, 5];
                                        case 4:
                                            err_1 = _a.sent();
                                            this.debug.log(err_1, "while running idle task " + task.desc);
                                            return [3 /*break*/, 5];
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            }); }, Promise.resolve())];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        if (this.emptyResolve !== null) {
                            this.emptyResolve();
                            this.emptyResolve = null;
                        }
                        this.empty = Promise.resolve();
                        return [2 /*return*/];
                }
            });
        });
    };
    IdleScheduler.prototype.schedule = function (desc, run) {
        var _this = this;
        this.queue.push({ desc: desc, run: run });
        if (this.emptyResolve === null) {
            this.empty = new Promise(function (resolve) { _this.emptyResolve = resolve; });
        }
    };
    Object.defineProperty(IdleScheduler.prototype, "size", {
        get: function () { return this.queue.length; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IdleScheduler.prototype, "taskDescriptions", {
        get: function () { return this.queue.map(function (task) { return task.desc; }); },
        enumerable: true,
        configurable: true
    });
    return IdleScheduler;
}());
exports.IdleScheduler = IdleScheduler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL3dvcmtlci9zcmMvaWRsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBY0g7SUFRRSx1QkFBb0IsT0FBZ0IsRUFBVSxTQUFpQixFQUFVLEtBQWtCO1FBQXZFLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBYTtRQVBuRixVQUFLLEdBQWUsRUFBRSxDQUFDO1FBQ3ZCLGNBQVMsR0FBc0IsSUFBSSxDQUFDO1FBQzVDLFVBQUssR0FBa0IsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2pDLGlCQUFZLEdBQWtCLElBQUksQ0FBQztRQUMzQyxnQkFBVyxHQUFnQixJQUFJLENBQUM7UUFDaEMsWUFBTyxHQUFnQixJQUFJLENBQUM7SUFFa0UsQ0FBQztJQUV6RiwrQkFBTyxHQUFiOzs7Ozs7d0JBQ0UsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQzt3QkFDckMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7NEJBQzNCLHNCQUFPO3lCQUNSO3dCQUVELElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxJQUFJLEVBQUU7NEJBQzNCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQzt5QkFDOUI7d0JBRUssU0FBUyxHQUFHOzRCQUNoQixNQUFNLEVBQUUsS0FBSzt5QkFDZCxDQUFDO3dCQUNGLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO3dCQUUzQixxQkFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUE7O3dCQUExQyxTQUEwQyxDQUFDO3dCQUUzQyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUU7NEJBQ3BCLHNCQUFPO3lCQUNSO3dCQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO3dCQUV0QixxQkFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUE7O3dCQUFwQixTQUFvQixDQUFDOzs7OztLQUN0QjtJQUVLLCtCQUFPLEdBQWI7Ozs7Ozs7d0JBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQzs7OzZCQUMxQixDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQTt3QkFDcEIsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7d0JBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO3dCQUVoQixxQkFBTSxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQU0sUUFBUSxFQUFFLElBQUk7Ozs7Z0RBQ3JDLHFCQUFNLFFBQVEsRUFBQTs7NENBQWQsU0FBYyxDQUFDOzs7OzRDQUViLHFCQUFNLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBQTs7NENBQWhCLFNBQWdCLENBQUM7Ozs7NENBRWpCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUcsRUFBRSw2QkFBMkIsSUFBSSxDQUFDLElBQU0sQ0FBQyxDQUFDOzs7OztpQ0FFL0QsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBQTs7d0JBUHJCLFNBT3FCLENBQUM7Ozt3QkFHeEIsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLElBQUksRUFBRTs0QkFDOUIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDOzRCQUNwQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzt5QkFDMUI7d0JBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7Ozs7O0tBQ2hDO0lBRUQsZ0NBQVEsR0FBUixVQUFTLElBQVksRUFBRSxHQUF3QjtRQUEvQyxpQkFLQztRQUpDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxNQUFBLEVBQUUsR0FBRyxLQUFBLEVBQUMsQ0FBQyxDQUFDO1FBQzdCLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxJQUFJLEVBQUU7WUFDOUIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFBLE9BQU8sSUFBTSxLQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZFO0lBQ0gsQ0FBQztJQUVELHNCQUFJLCtCQUFJO2FBQVIsY0FBcUIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRWhELHNCQUFJLDJDQUFnQjthQUFwQixjQUFtQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLElBQUksRUFBVCxDQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ2hGLG9CQUFDO0FBQUQsQ0FBQyxBQXJFRCxJQXFFQztBQXJFWSxzQ0FBYSJ9