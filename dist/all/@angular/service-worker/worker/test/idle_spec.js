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
var idle_1 = require("../src/idle");
var scope_1 = require("../testing/scope");
var async_1 = require("./async");
(function () {
    var _this = this;
    // Skip environments that don't support the minimum APIs needed to run the SW tests.
    if (!scope_1.SwTestHarness.envIsSupported()) {
        return;
    }
    describe('IdleScheduler', function () {
        var scope;
        var idle;
        beforeEach(function () {
            scope = new scope_1.SwTestHarnessBuilder().build();
            idle = new idle_1.IdleScheduler(scope, 1000, {
                log: function (v, context) { return console.error(v, context); },
            });
        });
        // Validate that a single idle task executes when trigger()
        // is called and the idle timeout passes.
        async_1.async_it('executes scheduled work on time', function () { return __awaiter(_this, void 0, void 0, function () {
            var completed, trigger;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        completed = false;
                        idle.schedule('work', function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            completed = true;
                            return [2 /*return*/];
                        }); }); });
                        // Simply scheduling the task should not cause it to execute.
                        expect(completed).toEqual(false);
                        trigger = idle.trigger();
                        // Advance the clock beyond the idle timeout, causing the idle tasks to run.
                        scope.advance(1100);
                        // It should now be possible to wait for the trigger, and for the idle queue
                        // to be empty.
                        return [4 /*yield*/, trigger];
                    case 1:
                        // It should now be possible to wait for the trigger, and for the idle queue
                        // to be empty.
                        _a.sent();
                        return [4 /*yield*/, idle.empty];
                    case 2:
                        _a.sent();
                        // The task should now have run.
                        expect(completed).toEqual(true);
                        return [2 /*return*/];
                }
            });
        }); });
        async_1.async_it('waits for multiple tasks to complete serially', function () { return __awaiter(_this, void 0, void 0, function () {
            var counter, trigger;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        counter = 2;
                        idle.schedule('double counter', function () { return __awaiter(_this, void 0, void 0, function () {
                            var local;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        local = counter;
                                        return [4 /*yield*/, Promise.resolve()];
                                    case 1:
                                        _a.sent();
                                        local *= 2;
                                        return [4 /*yield*/, Promise.resolve()];
                                    case 2:
                                        _a.sent();
                                        counter = local * 2;
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        idle.schedule('triple counter', function () { return __awaiter(_this, void 0, void 0, function () {
                            var local;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        // If this expect fails, it comes out of the 'await trigger' below.
                                        expect(counter).toEqual(8);
                                        local = counter;
                                        return [4 /*yield*/, Promise.resolve()];
                                    case 1:
                                        _a.sent();
                                        local *= 3;
                                        return [4 /*yield*/, Promise.resolve()];
                                    case 2:
                                        _a.sent();
                                        counter = local * 3;
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        trigger = idle.trigger();
                        // Advance the clock beyond the idle timeout, causing the idle tasks to run, and
                        // wait for them to complete.
                        scope.advance(1100);
                        return [4 /*yield*/, trigger];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, idle.empty];
                    case 2:
                        _a.sent();
                        // Assert that both tasks executed in the correct serial sequence by validating
                        // that the counter reached the correct value.
                        expect(counter).toEqual(2 * 2 * 2 * 3 * 3);
                        return [2 /*return*/];
                }
            });
        }); });
        // Validate that a single idle task does not execute until trigger() has been called
        // and sufficient time passes without it being called again.
        async_1.async_it('does not execute work until timeout passes with no triggers', function () { return __awaiter(_this, void 0, void 0, function () {
            var completed, firstTrigger, secondTrigger, thirdTrigger;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        completed = false;
                        idle.schedule('work', function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            completed = true;
                            return [2 /*return*/];
                        }); }); });
                        firstTrigger = idle.trigger();
                        // Advance the clock a little, but not enough to actually cause tasks to execute.
                        scope.advance(500);
                        // Assert that the task has not yet run.
                        expect(completed).toEqual(false);
                        secondTrigger = idle.trigger();
                        // Advance the clock beyond the timeout for the first trigger, but not the second.
                        // This should cause the first trigger to resolve, but without running the task.
                        scope.advance(600);
                        return [4 /*yield*/, firstTrigger];
                    case 1:
                        _a.sent();
                        expect(completed).toEqual(false);
                        thirdTrigger = idle.trigger();
                        // Again, advance beyond the second trigger and verify it didn't resolve the task.
                        scope.advance(500);
                        return [4 /*yield*/, secondTrigger];
                    case 2:
                        _a.sent();
                        expect(completed).toEqual(false);
                        // Finally, advance beyond the third trigger, which should cause the task to be
                        // executed finally.
                        scope.advance(600);
                        return [4 /*yield*/, thirdTrigger];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, idle.empty];
                    case 4:
                        _a.sent();
                        // The task should have executed.
                        expect(completed).toEqual(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRsZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvd29ya2VyL3Rlc3QvaWRsZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxvQ0FBMEM7QUFDMUMsMENBQXFFO0FBQ3JFLGlDQUE4RDtBQUU5RCxDQUFDO0lBQUEsaUJBNEhBO0lBM0hDLG9GQUFvRjtJQUNwRixJQUFJLENBQUMscUJBQWEsQ0FBQyxjQUFjLEVBQUUsRUFBRTtRQUNuQyxPQUFPO0tBQ1I7SUFDRCxRQUFRLENBQUMsZUFBZSxFQUFFO1FBQ3hCLElBQUksS0FBb0IsQ0FBQztRQUN6QixJQUFJLElBQW1CLENBQUM7UUFFeEIsVUFBVSxDQUFDO1lBQ1QsS0FBSyxHQUFHLElBQUksNEJBQW9CLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUMzQyxJQUFJLEdBQUcsSUFBSSxvQkFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7Z0JBQ3BDLEdBQUcsRUFBRSxVQUFDLENBQUMsRUFBRSxPQUFPLElBQUssT0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsRUFBekIsQ0FBeUI7YUFDL0MsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCwyREFBMkQ7UUFDM0QseUNBQXlDO1FBQ3pDLGdCQUFRLENBQUMsaUNBQWlDLEVBQUU7Ozs7Ozt3QkFFdEMsU0FBUyxHQUFZLEtBQUssQ0FBQzt3QkFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7NEJBQWEsU0FBUyxHQUFHLElBQUksQ0FBQzs7aUNBQUUsQ0FBQyxDQUFDO3dCQUV4RCw2REFBNkQ7d0JBQzdELE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7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