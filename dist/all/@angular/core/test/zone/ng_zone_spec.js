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
var testing_1 = require("@angular/core/testing");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var util_1 = require("../../src/util");
var ng_zone_1 = require("../../src/zone/ng_zone");
var needsLongerTimers = browser_util_1.browserDetection.isSlow || browser_util_1.browserDetection.isEdge;
var resultTimer = 1000;
var testTimeout = browser_util_1.browserDetection.isEdge ? 1200 : 500;
// Schedules a macrotask (using a timer)
function macroTask(fn, timer) {
    if (timer === void 0) { timer = 1; }
    // adds longer timers for passing tests in IE and Edge
    setTimeout(fn, needsLongerTimers ? timer : 1);
}
var _log;
var _errors;
var _traces;
var _zone;
var resolvedPromise = Promise.resolve(null);
function logOnError() {
    _zone.onError.subscribe({
        next: function (error) {
            // Error handler should run outside of the Angular zone.
            core_1.NgZone.assertNotInAngularZone();
            _errors.push(error);
            _traces.push(error.stack);
        }
    });
}
function logOnUnstable() {
    _zone.onUnstable.subscribe({ next: _log.fn('onUnstable') });
}
function logOnMicrotaskEmpty() {
    _zone.onMicrotaskEmpty.subscribe({ next: _log.fn('onMicrotaskEmpty') });
}
function logOnStable() {
    _zone.onStable.subscribe({ next: _log.fn('onStable') });
}
function runNgZoneNoLog(fn) {
    var length = _log.logItems.length;
    try {
        return _zone.run(fn);
    }
    finally {
        // delete anything which may have gotten logged.
        _log.logItems.length = length;
    }
}
{
    testing_internal_1.describe('NgZone', function () {
        function createZone(enableLongStackTrace) {
            return new core_1.NgZone({ enableLongStackTrace: enableLongStackTrace });
        }
        testing_internal_1.beforeEach(function () {
            _log = new testing_internal_1.Log();
            _errors = [];
            _traces = [];
        });
        testing_internal_1.describe('long stack trace', function () {
            testing_internal_1.beforeEach(function () {
                _zone = createZone(true);
                logOnUnstable();
                logOnMicrotaskEmpty();
                logOnStable();
                logOnError();
            });
            commonTests();
            testing_internal_1.it('should produce long stack traces', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                macroTask(function () {
                    var resolve;
                    var promise = new Promise(function (res) { resolve = res; });
                    _zone.run(function () {
                        setTimeout(function () {
                            setTimeout(function () {
                                resolve(null);
                                throw new Error('ccc');
                            }, 0);
                        }, 0);
                    });
                    promise.then(function (_) {
                        testing_internal_1.expect(_traces.length).toBe(1);
                        testing_internal_1.expect(_traces[0].length).toBeGreaterThan(1);
                        async.done();
                    });
                });
            }), testTimeout);
            testing_internal_1.it('should produce long stack traces (when using microtasks)', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                macroTask(function () {
                    var resolve;
                    var promise = new Promise(function (res) { resolve = res; });
                    _zone.run(function () {
                        util_1.scheduleMicroTask(function () {
                            util_1.scheduleMicroTask(function () {
                                resolve(null);
                                throw new Error('ddd');
                            });
                        });
                    });
                    promise.then(function (_) {
                        testing_internal_1.expect(_traces.length).toBe(1);
                        testing_internal_1.expect(_traces[0].length).toBeGreaterThan(1);
                        async.done();
                    });
                });
            }), testTimeout);
        });
        testing_internal_1.describe('short stack trace', function () {
            testing_internal_1.beforeEach(function () {
                _zone = createZone(false);
                logOnUnstable();
                logOnMicrotaskEmpty();
                logOnStable();
                logOnError();
            });
            commonTests();
            testing_internal_1.it('should disable long stack traces', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                macroTask(function () {
                    var resolve;
                    var promise = new Promise(function (res) { resolve = res; });
                    _zone.run(function () {
                        setTimeout(function () {
                            setTimeout(function () {
                                resolve(null);
                                throw new Error('ccc');
                            }, 0);
                        }, 0);
                    });
                    promise.then(function (_) {
                        testing_internal_1.expect(_traces.length).toBe(1);
                        if (_traces[0] != null) {
                            // some browsers don't have stack traces.
                            testing_internal_1.expect(_traces[0].indexOf('---')).toEqual(-1);
                        }
                        async.done();
                    });
                });
            }), testTimeout);
        });
    });
    testing_internal_1.describe('NoopNgZone', function () {
        var ngZone = new ng_zone_1.NoopNgZone();
        testing_internal_1.it('should run', function () {
            var runs = false;
            ngZone.run(function () {
                ngZone.runGuarded(function () { ngZone.runOutsideAngular(function () { runs = true; }); });
            });
            testing_internal_1.expect(runs).toBe(true);
        });
        testing_internal_1.it('should have EventEmitter instances', function () {
            testing_internal_1.expect(ngZone.onError instanceof core_1.EventEmitter).toBe(true);
            testing_internal_1.expect(ngZone.onStable instanceof core_1.EventEmitter).toBe(true);
            testing_internal_1.expect(ngZone.onUnstable instanceof core_1.EventEmitter).toBe(true);
            testing_internal_1.expect(ngZone.onMicrotaskEmpty instanceof core_1.EventEmitter).toBe(true);
        });
    });
}
function commonTests() {
    testing_internal_1.describe('hasPendingMicrotasks', function () {
        testing_internal_1.it('should be false', function () { testing_internal_1.expect(_zone.hasPendingMicrotasks).toBe(false); });
        testing_internal_1.it('should be true', function () {
            runNgZoneNoLog(function () { util_1.scheduleMicroTask(function () { }); });
            testing_internal_1.expect(_zone.hasPendingMicrotasks).toBe(true);
        });
    });
    testing_internal_1.describe('hasPendingTimers', function () {
        testing_internal_1.it('should be false', function () { testing_internal_1.expect(_zone.hasPendingMacrotasks).toBe(false); });
        testing_internal_1.it('should be true', function () {
            runNgZoneNoLog(function () { setTimeout(function () { }, 0); });
            testing_internal_1.expect(_zone.hasPendingMacrotasks).toBe(true);
        });
    });
    testing_internal_1.describe('hasPendingAsyncTasks', function () {
        testing_internal_1.it('should be false', function () { testing_internal_1.expect(_zone.hasPendingMicrotasks).toBe(false); });
        testing_internal_1.it('should be true when microtask is scheduled', function () {
            runNgZoneNoLog(function () { util_1.scheduleMicroTask(function () { }); });
            testing_internal_1.expect(_zone.hasPendingMicrotasks).toBe(true);
        });
        testing_internal_1.it('should be true when timer is scheduled', function () {
            runNgZoneNoLog(function () { setTimeout(function () { }, 0); });
            testing_internal_1.expect(_zone.hasPendingMacrotasks).toBe(true);
        });
    });
    testing_internal_1.describe('isInInnerZone', function () {
        testing_internal_1.it('should return whether the code executes in the inner zone', function () {
            testing_internal_1.expect(core_1.NgZone.isInAngularZone()).toEqual(false);
            runNgZoneNoLog(function () { testing_internal_1.expect(core_1.NgZone.isInAngularZone()).toEqual(true); });
        }, testTimeout);
    });
    testing_internal_1.describe('run', function () {
        testing_internal_1.it('should return the body return value from run', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            macroTask(function () { testing_internal_1.expect(_zone.run(function () { return 6; })).toEqual(6); });
            macroTask(function () { async.done(); });
        }), testTimeout);
        testing_internal_1.it('should return the body return value from runTask', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            macroTask(function () { testing_internal_1.expect(_zone.runTask(function () { return 6; })).toEqual(6); });
            macroTask(function () { async.done(); });
        }), testTimeout);
        testing_internal_1.it('should call onUnstable and onMicrotaskEmpty', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () { return macroTask(_log.fn('run')); });
            macroTask(function () {
                testing_internal_1.expect(_log.result()).toEqual('onUnstable; run; onMicrotaskEmpty; onStable');
                async.done();
            });
        }), testTimeout);
        testing_internal_1.it('should call onStable once at the end of event', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            // The test is set up in a way that causes the zone loop to run onMicrotaskEmpty twice
            // then verified that onStable is only called once at the end
            runNgZoneNoLog(function () { return macroTask(_log.fn('run')); });
            var times = 0;
            _zone.onMicrotaskEmpty.subscribe({
                next: function () {
                    times++;
                    _log.add("onMicrotaskEmpty " + times);
                    if (times < 2) {
                        // Scheduling a microtask causes a second digest
                        runNgZoneNoLog(function () { util_1.scheduleMicroTask(function () { }); });
                    }
                }
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual('onUnstable; run; onMicrotaskEmpty; onMicrotaskEmpty 1; ' +
                    'onMicrotaskEmpty; onMicrotaskEmpty 2; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should call standalone onStable', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () { return macroTask(_log.fn('run')); });
            macroTask(function () {
                testing_internal_1.expect(_log.result()).toEqual('onUnstable; run; onMicrotaskEmpty; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.xit('should run subscriber listeners in the subscription zone (outside)', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            // Each subscriber fires a microtask outside the Angular zone. The test
            // then verifies that those microtasks do not cause additional digests.
            var turnStart = false;
            _zone.onUnstable.subscribe({
                next: function () {
                    if (turnStart)
                        throw 'Should not call this more than once';
                    _log.add('onUnstable');
                    util_1.scheduleMicroTask(function () { });
                    turnStart = true;
                }
            });
            var turnDone = false;
            _zone.onMicrotaskEmpty.subscribe({
                next: function () {
                    if (turnDone)
                        throw 'Should not call this more than once';
                    _log.add('onMicrotaskEmpty');
                    util_1.scheduleMicroTask(function () { });
                    turnDone = true;
                }
            });
            var eventDone = false;
            _zone.onStable.subscribe({
                next: function () {
                    if (eventDone)
                        throw 'Should not call this more than once';
                    _log.add('onStable');
                    util_1.scheduleMicroTask(function () { });
                    eventDone = true;
                }
            });
            macroTask(function () { _zone.run(_log.fn('run')); });
            macroTask(function () {
                testing_internal_1.expect(_log.result()).toEqual('onUnstable; run; onMicrotaskEmpty; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should run subscriber listeners in the subscription zone (inside)', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () { return macroTask(_log.fn('run')); });
            // the only practical use-case to run a callback inside the zone is
            // change detection after "onMicrotaskEmpty". That's the only case tested.
            var turnDone = false;
            _zone.onMicrotaskEmpty.subscribe({
                next: function () {
                    _log.add('onMyMicrotaskEmpty');
                    if (turnDone)
                        return;
                    _zone.run(function () { util_1.scheduleMicroTask(function () { }); });
                    turnDone = true;
                }
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual('onUnstable; run; onMicrotaskEmpty; onMyMicrotaskEmpty; ' +
                    'onMicrotaskEmpty; onMyMicrotaskEmpty; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should run async tasks scheduled inside onStable outside Angular zone', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () { return macroTask(_log.fn('run')); });
            _zone.onStable.subscribe({
                next: function () {
                    core_1.NgZone.assertNotInAngularZone();
                    _log.add('onMyTaskDone');
                }
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual('onUnstable; run; onMicrotaskEmpty; onStable; onMyTaskDone');
                async.done();
            });
        }), testTimeout);
        testing_internal_1.it('should call onUnstable once before a turn and onMicrotaskEmpty once after the turn', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () {
                macroTask(function () {
                    _log.add('run start');
                    util_1.scheduleMicroTask(_log.fn('async'));
                    _log.add('run end');
                });
            });
            macroTask(function () {
                // The microtask (async) is executed after the macrotask (run)
                testing_internal_1.expect(_log.result())
                    .toEqual('onUnstable; run start; run end; async; onMicrotaskEmpty; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should not run onUnstable and onMicrotaskEmpty for nested Zone.run', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () {
                macroTask(function () {
                    _log.add('start run');
                    _zone.run(function () {
                        _log.add('nested run');
                        util_1.scheduleMicroTask(_log.fn('nested run microtask'));
                    });
                    _log.add('end run');
                });
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual('onUnstable; start run; nested run; end run; nested run microtask; onMicrotaskEmpty; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should not run onUnstable and onMicrotaskEmpty for nested Zone.run invoked from onMicrotaskEmpty', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () { return macroTask(_log.fn('start run')); });
            _zone.onMicrotaskEmpty.subscribe({
                next: function () {
                    _log.add('onMicrotaskEmpty:started');
                    _zone.run(function () { return _log.add('nested run'); });
                    _log.add('onMicrotaskEmpty:finished');
                }
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual('onUnstable; start run; onMicrotaskEmpty; onMicrotaskEmpty:started; nested run; onMicrotaskEmpty:finished; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should call onUnstable and onMicrotaskEmpty before and after each top-level run', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () { return macroTask(_log.fn('run1')); });
            runNgZoneNoLog(function () { return macroTask(_log.fn('run2')); });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual('onUnstable; run1; onMicrotaskEmpty; onStable; onUnstable; run2; onMicrotaskEmpty; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should call onUnstable and onMicrotaskEmpty before and after each turn', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var aResolve;
            var aPromise;
            var bResolve;
            var bPromise;
            runNgZoneNoLog(function () {
                macroTask(function () {
                    aPromise = new Promise(function (res) { aResolve = res; });
                    bPromise = new Promise(function (res) { bResolve = res; });
                    _log.add('run start');
                    aPromise.then(_log.fn('a then'));
                    bPromise.then(_log.fn('b then'));
                });
            });
            runNgZoneNoLog(function () {
                macroTask(function () {
                    aResolve('a');
                    bResolve('b');
                });
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual('onUnstable; run start; onMicrotaskEmpty; onStable; onUnstable; a then; b then; onMicrotaskEmpty; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should run a function outside of the angular zone', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            macroTask(function () { _zone.runOutsideAngular(_log.fn('run')); });
            macroTask(function () {
                testing_internal_1.expect(_log.result()).toEqual('run');
                async.done();
            });
        }), testTimeout);
        testing_internal_1.it('should call onUnstable and onMicrotaskEmpty when an inner microtask is scheduled from outside angular', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var resolve;
            var promise;
            macroTask(function () {
                core_1.NgZone.assertNotInAngularZone();
                promise = new Promise(function (res) { resolve = res; });
            });
            runNgZoneNoLog(function () {
                macroTask(function () {
                    core_1.NgZone.assertInAngularZone();
                    promise.then(_log.fn('executedMicrotask'));
                });
            });
            macroTask(function () {
                core_1.NgZone.assertNotInAngularZone();
                _log.add('scheduling a microtask');
                resolve(null);
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual(
                // First VM turn => setup Promise then
                'onUnstable; onMicrotaskEmpty; onStable; ' +
                    // Second VM turn (outside of angular)
                    'scheduling a microtask; onUnstable; ' +
                    // Third VM Turn => execute the microtask (inside angular)
                    // No onUnstable;  because we don't own the task which started the turn.
                    'executedMicrotask; onMicrotaskEmpty; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should call onUnstable only before executing a microtask scheduled in onMicrotaskEmpty ' +
            'and not onMicrotaskEmpty after executing the task', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () { return macroTask(_log.fn('run')); });
            var ran = false;
            _zone.onMicrotaskEmpty.subscribe({
                next: function () {
                    _log.add('onMicrotaskEmpty(begin)');
                    if (!ran) {
                        _zone.run(function () {
                            util_1.scheduleMicroTask(function () {
                                ran = true;
                                _log.add('executedMicrotask');
                            });
                        });
                    }
                    _log.add('onMicrotaskEmpty(end)');
                }
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual(
                // First VM turn => 'run' macrotask
                'onUnstable; run; onMicrotaskEmpty; onMicrotaskEmpty(begin); onMicrotaskEmpty(end); ' +
                    // Second microtaskDrain Turn => microtask enqueued from onMicrotaskEmpty
                    'executedMicrotask; onMicrotaskEmpty; onMicrotaskEmpty(begin); onMicrotaskEmpty(end); onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should call onUnstable and onMicrotaskEmpty for a scheduleMicroTask in onMicrotaskEmpty triggered by ' +
            'a scheduleMicroTask in run', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () {
                macroTask(function () {
                    _log.add('scheduleMicroTask');
                    util_1.scheduleMicroTask(_log.fn('run(executeMicrotask)'));
                });
            });
            var ran = false;
            _zone.onMicrotaskEmpty.subscribe({
                next: function () {
                    _log.add('onMicrotaskEmpty(begin)');
                    if (!ran) {
                        _log.add('onMicrotaskEmpty(scheduleMicroTask)');
                        _zone.run(function () {
                            util_1.scheduleMicroTask(function () {
                                ran = true;
                                _log.add('onMicrotaskEmpty(executeMicrotask)');
                            });
                        });
                    }
                    _log.add('onMicrotaskEmpty(end)');
                }
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual(
                // First VM Turn => a macrotask + the microtask it enqueues
                'onUnstable; scheduleMicroTask; run(executeMicrotask); onMicrotaskEmpty; onMicrotaskEmpty(begin); onMicrotaskEmpty(scheduleMicroTask); onMicrotaskEmpty(end); ' +
                    // Second VM Turn => the microtask enqueued from onMicrotaskEmpty
                    'onMicrotaskEmpty(executeMicrotask); onMicrotaskEmpty; onMicrotaskEmpty(begin); onMicrotaskEmpty(end); onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should execute promises scheduled in onUnstable before promises scheduled in run', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () {
                macroTask(function () {
                    _log.add('run start');
                    resolvedPromise
                        .then(function (_) {
                        _log.add('promise then');
                        resolvedPromise.then(_log.fn('promise foo'));
                        return Promise.resolve(null);
                    })
                        .then(_log.fn('promise bar'));
                    _log.add('run end');
                });
            });
            var donePromiseRan = false;
            var startPromiseRan = false;
            _zone.onUnstable.subscribe({
                next: function () {
                    _log.add('onUnstable(begin)');
                    if (!startPromiseRan) {
                        _log.add('onUnstable(schedulePromise)');
                        _zone.run(function () { util_1.scheduleMicroTask(_log.fn('onUnstable(executePromise)')); });
                        startPromiseRan = true;
                    }
                    _log.add('onUnstable(end)');
                }
            });
            _zone.onMicrotaskEmpty.subscribe({
                next: function () {
                    _log.add('onMicrotaskEmpty(begin)');
                    if (!donePromiseRan) {
                        _log.add('onMicrotaskEmpty(schedulePromise)');
                        _zone.run(function () { util_1.scheduleMicroTask(_log.fn('onMicrotaskEmpty(executePromise)')); });
                        donePromiseRan = true;
                    }
                    _log.add('onMicrotaskEmpty(end)');
                }
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual(
                // First VM turn: enqueue a microtask in onUnstable
                'onUnstable; onUnstable(begin); onUnstable(schedulePromise); onUnstable(end); ' +
                    // First VM turn: execute the macrotask which enqueues microtasks
                    'run start; run end; ' +
                    // First VM turn: execute enqueued microtasks
                    'onUnstable(executePromise); promise then; promise foo; promise bar; onMicrotaskEmpty; ' +
                    // First VM turn: onTurnEnd, enqueue a microtask
                    'onMicrotaskEmpty(begin); onMicrotaskEmpty(schedulePromise); onMicrotaskEmpty(end); ' +
                    // Second VM turn: execute the microtask from onTurnEnd
                    'onMicrotaskEmpty(executePromise); onMicrotaskEmpty; onMicrotaskEmpty(begin); onMicrotaskEmpty(end); onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should call onUnstable and onMicrotaskEmpty before and after each turn, respectively', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var aResolve;
            var aPromise;
            var bResolve;
            var bPromise;
            runNgZoneNoLog(function () {
                macroTask(function () {
                    aPromise = new Promise(function (res) { aResolve = res; });
                    bPromise = new Promise(function (res) { bResolve = res; });
                    aPromise.then(_log.fn('a then'));
                    bPromise.then(_log.fn('b then'));
                    _log.add('run start');
                });
            });
            runNgZoneNoLog(function () { macroTask(function () { aResolve(null); }, 10); });
            runNgZoneNoLog(function () { macroTask(function () { bResolve(null); }, 20); });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual(
                // First VM turn
                'onUnstable; run start; onMicrotaskEmpty; onStable; ' +
                    // Second VM turn
                    'onUnstable; a then; onMicrotaskEmpty; onStable; ' +
                    // Third VM turn
                    'onUnstable; b then; onMicrotaskEmpty; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should call onUnstable and onMicrotaskEmpty before and after (respectively) all turns in a chain', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            runNgZoneNoLog(function () {
                macroTask(function () {
                    _log.add('run start');
                    util_1.scheduleMicroTask(function () {
                        _log.add('async1');
                        util_1.scheduleMicroTask(_log.fn('async2'));
                    });
                    _log.add('run end');
                });
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual('onUnstable; run start; run end; async1; async2; onMicrotaskEmpty; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
        testing_internal_1.it('should call onUnstable and onMicrotaskEmpty for promises created outside of run body', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var promise;
            runNgZoneNoLog(function () {
                macroTask(function () {
                    _zone.runOutsideAngular(function () { promise = Promise.resolve(4).then(function (x) { return Promise.resolve(x); }); });
                    promise.then(_log.fn('promise then'));
                    _log.add('zone run');
                });
            });
            macroTask(function () {
                testing_internal_1.expect(_log.result())
                    .toEqual('onUnstable; zone run; onMicrotaskEmpty; onStable; ' +
                    'onUnstable; promise then; onMicrotaskEmpty; onStable');
                async.done();
            }, resultTimer);
        }), testTimeout);
    });
    testing_internal_1.describe('exceptions', function () {
        testing_internal_1.it('should call the on error callback when it is invoked via zone.runGuarded', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            macroTask(function () {
                var exception = new Error('sync');
                _zone.runGuarded(function () { throw exception; });
                testing_internal_1.expect(_errors.length).toBe(1);
                testing_internal_1.expect(_errors[0]).toBe(exception);
                async.done();
            });
        }), testTimeout);
        testing_internal_1.it('should not call the on error callback but rethrow when it is invoked via zone.run', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            macroTask(function () {
                var exception = new Error('sync');
                testing_internal_1.expect(function () { return _zone.run(function () { throw exception; }); }).toThrowError('sync');
                testing_internal_1.expect(_errors.length).toBe(0);
                async.done();
            });
        }), testTimeout);
        testing_internal_1.it('should call onError for errors from microtasks', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var exception = new Error('async');
            macroTask(function () { _zone.run(function () { util_1.scheduleMicroTask(function () { throw exception; }); }); });
            macroTask(function () {
                testing_internal_1.expect(_errors.length).toBe(1);
                testing_internal_1.expect(_errors[0]).toEqual(exception);
                async.done();
            }, resultTimer);
        }), testTimeout);
    });
    testing_internal_1.describe('bugs', function () {
        testing_internal_1.describe('#10503', function () {
            var ngZone;
            testing_internal_1.beforeEach(testing_internal_1.inject([core_1.NgZone], function (_ngZone) {
                // Create a zone outside the fakeAsync.
                ngZone = _ngZone;
            }));
            testing_internal_1.it('should fakeAsync even if the NgZone was created outside.', testing_1.fakeAsync(function () {
                var result = null;
                // try to escape the current fakeAsync zone by using NgZone which was created outside.
                ngZone.run(function () {
                    Promise.resolve('works').then(function (v) { return result = v; });
                    testing_1.flushMicrotasks();
                });
                testing_internal_1.expect(result).toEqual('works');
            }));
            testing_internal_1.describe('async', function () {
                var asyncResult;
                var waitLongerThenTestFrameworkAsyncTimeout = 5;
                testing_internal_1.beforeEach(function () { asyncResult = null; });
                testing_internal_1.it('should async even if the NgZone was created outside.', testing_1.async(function () {
                    // try to escape the current async zone by using NgZone which was created outside.
                    ngZone.run(function () {
                        setTimeout(function () {
                            Promise.resolve('works').then(function (v) { return asyncResult = v; });
                        }, waitLongerThenTestFrameworkAsyncTimeout);
                    });
                }));
                afterEach(function () { testing_internal_1.expect(asyncResult).toEqual('works'); });
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfem9uZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3pvbmUvbmdfem9uZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQW1EO0FBQ25ELGlEQUF3RTtBQUN4RSwrRUFBa0k7QUFDbEksbUZBQW9GO0FBQ3BGLHVDQUFpRDtBQUNqRCxrREFBa0Q7QUFFbEQsSUFBTSxpQkFBaUIsR0FBRywrQkFBZ0IsQ0FBQyxNQUFNLElBQUksK0JBQWdCLENBQUMsTUFBTSxDQUFDO0FBQzdFLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQztBQUN6QixJQUFNLFdBQVcsR0FBRywrQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQ3pELHdDQUF3QztBQUN4QyxtQkFBbUIsRUFBNEIsRUFBRSxLQUFTO0lBQVQsc0JBQUEsRUFBQSxTQUFTO0lBQ3hELHNEQUFzRDtJQUN0RCxVQUFVLENBQUMsRUFBRSxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hELENBQUM7QUFFRCxJQUFJLElBQVMsQ0FBQztBQUNkLElBQUksT0FBYyxDQUFDO0FBQ25CLElBQUksT0FBYyxDQUFDO0FBQ25CLElBQUksS0FBYSxDQUFDO0FBRWxCLElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFOUM7SUFDRSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUN0QixJQUFJLEVBQUUsVUFBQyxLQUFVO1lBQ2Ysd0RBQXdEO1lBQ3hELGFBQU0sQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1lBQ2hDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEIsT0FBTyxDQUFD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