"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * fakeAsync has been moved to zone.js
 * this file is for fallback in case old version of zone.js is used
 */
var _Zone = typeof Zone !== 'undefined' ? Zone : null;
var FakeAsyncTestZoneSpec = _Zone && _Zone['FakeAsyncTestZoneSpec'];
var ProxyZoneSpec = _Zone && _Zone['ProxyZoneSpec'];
var _fakeAsyncTestZoneSpec = null;
/**
 * Clears out the shared fake async zone for a test.
 * To be called in a global `beforeEach`.
 *
 * @experimental
 */
function resetFakeAsyncZoneFallback() {
    _fakeAsyncTestZoneSpec = null;
    // in node.js testing we may not have ProxyZoneSpec in which case there is nothing to reset.
    ProxyZoneSpec && ProxyZoneSpec.assertPresent().resetDelegate();
}
exports.resetFakeAsyncZoneFallback = resetFakeAsyncZoneFallback;
var _inFakeAsyncCall = false;
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
function fakeAsyncFallback(fn) {
    // Not using an arrow function to preserve context passed from call site
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var proxyZoneSpec = ProxyZoneSpec.assertPresent();
        if (_inFakeAsyncCall) {
            throw new Error('fakeAsync() calls can not be nested');
        }
        _inFakeAsyncCall = true;
        try {
            if (!_fakeAsyncTestZoneSpec) {
                if (proxyZoneSpec.getDelegate() instanceof FakeAsyncTestZoneSpec) {
                    throw new Error('fakeAsync() calls can not be nested');
                }
                _fakeAsyncTestZoneSpec = new FakeAsyncTestZoneSpec();
            }
            var res = void 0;
            var lastProxyZoneSpec = proxyZoneSpec.getDelegate();
            proxyZoneSpec.setDelegate(_fakeAsyncTestZoneSpec);
            try {
                res = fn.apply(this, args);
                flushMicrotasksFallback();
            }
            finally {
                proxyZoneSpec.setDelegate(lastProxyZoneSpec);
            }
            if (_fakeAsyncTestZoneSpec.pendingPeriodicTimers.length > 0) {
                throw new Error(_fakeAsyncTestZoneSpec.pendingPeriodicTimers.length + " " +
                    "periodic timer(s) still in the queue.");
            }
            if (_fakeAsyncTestZoneSpec.pendingTimers.length > 0) {
                throw new Error(_fakeAsyncTestZoneSpec.pendingTimers.length + " timer(s) still in the queue.");
            }
            return res;
        }
        finally {
            _inFakeAsyncCall = false;
            resetFakeAsyncZoneFallback();
        }
    };
}
exports.fakeAsyncFallback = fakeAsyncFallback;
function _getFakeAsyncZoneSpec() {
    if (_fakeAsyncTestZoneSpec == null) {
        throw new Error('The code should be running in the fakeAsync zone to call this function');
    }
    return _fakeAsyncTestZoneSpec;
}
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
function tickFallback(millis) {
    if (millis === void 0) { millis = 0; }
    _getFakeAsyncZoneSpec().tick(millis);
}
exports.tickFallback = tickFallback;
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
function flushFallback(maxTurns) {
    return _getFakeAsyncZoneSpec().flush(maxTurns);
}
exports.flushFallback = flushFallback;
/**
 * Discard all remaining periodic tasks.
 *
 * @experimental
 */
function discardPeriodicTasksFallback() {
    var zoneSpec = _getFakeAsyncZoneSpec();
    zoneSpec.pendingPeriodicTimers.length = 0;
}
exports.discardPeriodicTasksFallback = discardPeriodicTasksFallback;
/**
 * Flush any pending microtasks.
 *
 * @experimental
 */
function flushMicrotasksFallback() {
    _getFakeAsyncZoneSpec().flushMicrotasks();
}
exports.flushMicrotasksFallback = flushMicrotasksFallback;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZV9hc3luY19mYWxsYmFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdGluZy9zcmMvZmFrZV9hc3luY19mYWxsYmFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVIOzs7R0FHRztBQUNILElBQU0sS0FBSyxHQUFRLE9BQU8sSUFBSSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDN0QsSUFBTSxxQkFBcUIsR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFJdEUsSUFBTSxhQUFhLEdBQ2YsS0FBSyxJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUVwQyxJQUFJLHNCQUFzQixHQUFRLElBQUksQ0FBQztBQUV2Qzs7Ozs7R0FLRztBQUNIO0lBQ0Usc0JBQXNCLEdBQUcsSUFBSSxDQUFDO0lBQzlCLDRGQUE0RjtJQUM1RixhQUFhLElBQUksYUFBYSxDQUFDLGFBQWEsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQ2pFLENBQUM7QUFKRCxnRUFJQztBQUVELElBQUksZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0FBRTdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQkc7QUFDSCwyQkFBa0MsRUFBWTtJQUM1Qyx3RUFBd0U7SUFDeEUsT0FBTztRQUFTLGNBQWM7YUFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO1lBQWQseUJBQWM7O1FBQzVCLElBQU0sYUFBYSxHQUFHLGFBQWEsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNwRCxJQUFJLGdCQUFnQixFQUFFO1lBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztTQUN4RDtRQUNELGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJO1lBQ0YsSUFBSSxDQUFDLHNCQUFzQixFQUFFO2dCQUMzQixJQUFJLGFBQWEsQ0FBQyxXQUFXLEVBQUUsWUFBWSxxQkFBcUIsRUFBRTtvQkFDaEUsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO2lCQUN4RDtnQkFFRCxzQkFBc0IsR0FBRyxJQUFJLHFCQUFxQixFQUFFLENBQUM7YUFDdEQ7WUFFRCxJQUFJLEdBQUcsU0FBSyxDQUFDO1lBQ2IsSUFBTSxpQkFBaUIsR0FBRyxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdEQsYUFBYSxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ2xELElBQUk7Z0JBQ0YsR0FBRyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUMzQix1QkFBdUIsRUFBRSxDQUFDO2FBQzNCO29CQUFTO2dCQUNSLGFBQWEsQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQzthQUM5QztZQUVELElBQUksc0JBQXNCLENBQUMscUJBQXFCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDM0QsTUFBTSxJQUFJLEtBQUssQ0FDUixzQkFBc0IsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLE1BQUc7b0JBQ3pELHVDQUF1QyxDQUFDLENBQUM7YUFDOUM7WUFFRCxJQUFJLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNuRCxNQUFNLElBQUksS0FBSyxDQUNSLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxNQUFNLGtDQUErQixDQUFDLENBQUM7YUFDcEY7WUFDRCxPQUFPLEdBQUcsQ0FBQztTQUNaO2dCQUFTO1lBQ1IsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLDBCQUEwQixFQUFFLENBQUM7U0FDOUI7SUFDSCxDQUFDLENBQUM7QUFDSixDQUFDO0FBM0NELDhDQTJDQztBQUVEO0lBQ0UsSUFBSSxzQkFBc0IsSUFBSSxJQUFJLEVBQUU7UUFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQyx3RUFBd0UsQ0FBQyxDQUFDO0tBQzNGO0lBQ0QsT0FBTyxzQkFBc0IsQ0FBQztBQUNoQyxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsc0JBQTZCLE1BQWtCO0lBQWxCLHVCQUFBLEVBQUEsVUFBa0I7SUFDN0MscUJBQXFCLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUZELG9DQUVDO0FBRUQ7Ozs7Ozs7OztHQVNHO0FBQ0gsdUJBQThCLFFBQWlCO0lBQzdDLE9BQU8scUJBQXFCLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakQsQ0FBQztBQUZELHNDQUVDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQ0UsSUFBTSxRQUFRLEdBQUcscUJBQXFCLEVBQUUsQ0FBQztJQUN6QyxRQUFRLENBQUMscUJBQXFCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBSEQsb0VBR0M7QUFFRDs7OztHQUlHO0FBQ0g7SUFDRSxxQkFBcUIsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQzVDLENBQUM7QUFGRCwwREFFQyJ9