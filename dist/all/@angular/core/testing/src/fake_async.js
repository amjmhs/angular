"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var fake_async_fallback_1 = require("./fake_async_fallback");
var _Zone = typeof Zone !== 'undefined' ? Zone : null;
var fakeAsyncTestModule = _Zone && _Zone[_Zone.__symbol__('fakeAsyncTest')];
/**
 * Clears out the shared fake async zone for a test.
 * To be called in a global `beforeEach`.
 *
 * @experimental
 */
function resetFakeAsyncZone() {
    if (fakeAsyncTestModule) {
        return fakeAsyncTestModule.resetFakeAsyncZone();
    }
    else {
        return fake_async_fallback_1.resetFakeAsyncZoneFallback();
    }
}
exports.resetFakeAsyncZone = resetFakeAsyncZone;
/**
 * Wraps a function to be executed in the fakeAsync zone:
 * - microtasks are manually executed by calling `flushMicrotasks()`,
 * - timers are synchronous, `tick()` simulates the asynchronous passage of time.
 *
 * If there are any pending timers at the end of the function, an exception will be thrown.
 *
 * Can be used to wrap inject() calls.
 *
 * @usageNotes
 * ### Example
 *
 * {@example core/testing/ts/fake_async.ts region='basic'}
 *
 * @param fn
 * @returns The function wrapped to be executed in the fakeAsync zone
 *
 * @experimental
 */
function fakeAsync(fn) {
    if (fakeAsyncTestModule) {
        return fakeAsyncTestModule.fakeAsync(fn);
    }
    else {
        return fake_async_fallback_1.fakeAsyncFallback(fn);
    }
}
exports.fakeAsync = fakeAsync;
/**
 * Simulates the asynchronous passage of time for the timers in the fakeAsync zone.
 *
 * The microtasks queue is drained at the very start of this function and after any timer callback
 * has been executed.
 *
 * @usageNotes
 * ### Example
 *
 * {@example core/testing/ts/fake_async.ts region='basic'}
 *
 * @experimental
 */
function tick(millis) {
    if (millis === void 0) { millis = 0; }
    if (fakeAsyncTestModule) {
        return fakeAsyncTestModule.tick(millis);
    }
    else {
        return fake_async_fallback_1.tickFallback(millis);
    }
}
exports.tick = tick;
/**
 * Simulates the asynchronous passage of time for the timers in the fakeAsync zone by
 * draining the macrotask queue until it is empty. The returned value is the milliseconds
 * of time that would have been elapsed.
 *
 * @param maxTurns
 * @returns The simulated time elapsed, in millis.
 *
 * @experimental
 */
function flush(maxTurns) {
    if (fakeAsyncTestModule) {
        return fakeAsyncTestModule.flush(maxTurns);
    }
    else {
        return fake_async_fallback_1.flushFallback(maxTurns);
    }
}
exports.flush = flush;
/**
 * Discard all remaining periodic tasks.
 *
 * @experimental
 */
function discardPeriodicTasks() {
    if (fakeAsyncTestModule) {
        return fakeAsyncTestModule.discardPeriodicTasks();
    }
    else {
        fake_async_fallback_1.discardPeriodicTasksFallback();
    }
}
exports.discardPeriodicTasks = discardPeriodicTasks;
/**
 * Flush any pending microtasks.
 *
 * @experimental
 */
function flushMicrotasks() {
    if (fakeAsyncTestModule) {
        return fakeAsyncTestModule.flushMicrotasks();
    }
    else {
        return fake_async_fallback_1.flushMicrotasksFallback();
    }
}
exports.flushMicrotasks = flushMicrotasks;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZV9hc3luYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdGluZy9zcmMvZmFrZV9hc3luYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILDZEQUF3SztBQUV4SyxJQUFNLEtBQUssR0FBUSxPQUFPLElBQUksS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQzdELElBQU0sbUJBQW1CLEdBQUcsS0FBSyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7QUFFOUU7Ozs7O0dBS0c7QUFDSDtJQUNFLElBQUksbUJBQW1CLEVBQUU7UUFDdkIsT0FBTyxtQkFBbUIsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0tBQ2pEO1NBQU07UUFDTCxPQUFPLGdEQUEwQixFQUFFLENBQUM7S0FDckM7QUFDSCxDQUFDO0FBTkQsZ0RBTUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0JHO0FBQ0gsbUJBQTBCLEVBQVk7SUFDcEMsSUFBSSxtQkFBbUIsRUFBRTtRQUN2QixPQUFPLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUMxQztTQUFNO1FBQ0wsT0FBTyx1Q0FBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUM5QjtBQUNILENBQUM7QUFORCw4QkFNQztBQUVEOzs7Ozs7Ozs7Ozs7R0FZRztBQUNILGNBQXFCLE1BQWtCO0lBQWxCLHVCQUFBLEVBQUEsVUFBa0I7SUFDckMsSUFBSSxtQkFBbUIsRUFBRTtRQUN2QixPQUFPLG1CQUFtQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN6QztTQUFNO1FBQ0wsT0FBTyxrQ0FBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzdCO0FBQ0gsQ0FBQztBQU5ELG9CQU1DO0FBRUQ7Ozs7Ozs7OztHQVNHO0FBQ0gsZUFBc0IsUUFBaUI7SUFDckMsSUFBSSxtQkFBbUIsRUFBRTtRQUN2QixPQUFPLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUM1QztTQUFNO1FBQ0wsT0FBTyxtQ0FBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ2hDO0FBQ0gsQ0FBQztBQU5ELHNCQU1DO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQ0UsSUFBSSxtQkFBbUIsRUFBRTtRQUN2QixPQUFPLG1CQUFtQixDQUFDLG9CQUFvQixFQUFFLENBQUM7S0FDbkQ7U0FBTTtRQUNMLGtEQUE0QixFQUFFLENBQUM7S0FDaEM7QUFDSCxDQUFDO0FBTkQsb0RBTUM7QUFFRDs7OztHQUlHO0FBQ0g7SUFDRSxJQUFJLG1CQUFtQixFQUFFO1FBQ3ZCLE9BQU8sbUJBQW1CLENBQUMsZUFBZSxFQUFFLENBQUM7S0FDOUM7U0FBTTtRQUNMLE9BQU8sNkNBQXVCLEVBQUUsQ0FBQztLQUNsQztBQUNILENBQUM7QUFORCwwQ0FNQyJ9