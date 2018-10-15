"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var parser_1 = require("../../compiler/src/expression_parser/parser");
var resolvedPromise = Promise.resolve(null);
var ProxyZoneSpec = Zone['ProxyZoneSpec'];
{
    testing_internal_1.describe('fake async', function () {
        testing_internal_1.it('should run synchronous code', function () {
            var ran = false;
            testing_1.fakeAsync(function () { ran = true; })();
            matchers_1.expect(ran).toEqual(true);
        });
        testing_internal_1.it('should pass arguments to the wrapped function', function () {
            testing_1.fakeAsync(function (foo /** TODO #9100 */, bar /** TODO #9100 */) {
                matchers_1.expect(foo).toEqual('foo');
                matchers_1.expect(bar).toEqual('bar');
            })('foo', 'bar');
        });
        testing_internal_1.it('should work with inject()', testing_1.fakeAsync(testing_internal_1.inject([parser_1.Parser], function (parser /** TODO #9100 */) {
            matchers_1.expect(parser).toBeAnInstanceOf(parser_1.Parser);
        })));
        testing_internal_1.it('should throw on nested calls', function () {
            matchers_1.expect(function () {
                testing_1.fakeAsync(function () { testing_1.fakeAsync(function () { return null; })(); })();
            }).toThrowError('fakeAsync() calls can not be nested');
        });
        testing_internal_1.it('should flush microtasks before returning', function () {
            var thenRan = false;
            testing_1.fakeAsync(function () { resolvedPromise.then(function (_) { thenRan = true; }); })();
            matchers_1.expect(thenRan).toEqual(true);
        });
        testing_internal_1.it('should propagate the return value', function () { matchers_1.expect(testing_1.fakeAsync(function () { return 'foo'; })()).toEqual('foo'); });
        testing_internal_1.describe('Promise', function () {
            testing_internal_1.it('should run asynchronous code', testing_1.fakeAsync(function () {
                var thenRan = false;
                resolvedPromise.then(function (_) { thenRan = true; });
                matchers_1.expect(thenRan).toEqual(false);
                testing_1.flushMicrotasks();
                matchers_1.expect(thenRan).toEqual(true);
            }));
            testing_internal_1.it('should run chained thens', testing_1.fakeAsync(function () {
                var log = new testing_internal_1.Log();
                resolvedPromise.then(function (_) { return log.add(1); }).then(function (_) { return log.add(2); });
                matchers_1.expect(log.result()).toEqual('');
                testing_1.flushMicrotasks();
                matchers_1.expect(log.result()).toEqual('1; 2');
            }));
            testing_internal_1.it('should run Promise created in Promise', testing_1.fakeAsync(function () {
                var log = new testing_internal_1.Log();
                resolvedPromise.then(function (_) {
                    log.add(1);
                    resolvedPromise.then(function (_) { return log.add(2); });
                });
                matchers_1.expect(log.result()).toEqual('');
                testing_1.flushMicrotasks();
                matchers_1.expect(log.result()).toEqual('1; 2');
            }));
            testing_internal_1.it('should complain if the test throws an exception during async calls', function () {
                matchers_1.expect(function () {
                    testing_1.fakeAsync(function () {
                        resolvedPromise.then(function (_) { throw new Error('async'); });
                        testing_1.flushMicrotasks();
                    })();
                }).toThrowError(/Uncaught \(in promise\): Error: async/);
            });
            testing_internal_1.it('should complain if a test throws an exception', function () {
                matchers_1.expect(function () { testing_1.fakeAsync(function () { throw new Error('sync'); })(); }).toThrowError('sync');
            });
        });
        testing_internal_1.describe('timers', function () {
            testing_internal_1.it('should run queued zero duration timer on zero tick', testing_1.fakeAsync(function () {
                var ran = false;
                setTimeout(function () { ran = true; }, 0);
                matchers_1.expect(ran).toEqual(false);
                testing_1.tick();
                matchers_1.expect(ran).toEqual(true);
            }));
            testing_internal_1.it('should run queued timer after sufficient clock ticks', testing_1.fakeAsync(function () {
                var ran = false;
                setTimeout(function () { ran = true; }, 10);
                testing_1.tick(6);
                matchers_1.expect(ran).toEqual(false);
                testing_1.tick(6);
                matchers_1.expect(ran).toEqual(true);
            }));
            testing_internal_1.it('should run queued timer only once', testing_1.fakeAsync(function () {
                var cycles = 0;
                setTimeout(function () { cycles++; }, 10);
                testing_1.tick(10);
                matchers_1.expect(cycles).toEqual(1);
                testing_1.tick(10);
                matchers_1.expect(cycles).toEqual(1);
                testing_1.tick(10);
                matchers_1.expect(cycles).toEqual(1);
            }));
            testing_internal_1.it('should not run cancelled timer', testing_1.fakeAsync(function () {
                var ran = false;
                var id = setTimeout(function () { ran = true; }, 10);
                clearTimeout(id);
                testing_1.tick(10);
                matchers_1.expect(ran).toEqual(false);
            }));
            testing_internal_1.it('should throw an error on dangling timers', function () {
                matchers_1.expect(function () {
                    testing_1.fakeAsync(function () { setTimeout(function () { }, 10); })();
                }).toThrowError('1 timer(s) still in the queue.');
            });
            testing_internal_1.it('should throw an error on dangling periodic timers', function () {
                matchers_1.expect(function () {
                    testing_1.fakeAsync(function () { setInterval(function () { }, 10); })();
                }).toThrowError('1 periodic timer(s) still in the queue.');
            });
            testing_internal_1.it('should run periodic timers', testing_1.fakeAsync(function () {
                var cycles = 0;
                var id = setInterval(function () { cycles++; }, 10);
                testing_1.tick(10);
                matchers_1.expect(cycles).toEqual(1);
                testing_1.tick(10);
                matchers_1.expect(cycles).toEqual(2);
                testing_1.tick(10);
                matchers_1.expect(cycles).toEqual(3);
                clearInterval(id);
            }));
            testing_internal_1.it('should not run cancelled periodic timer', testing_1.fakeAsync(function () {
                var ran = false;
                var id = setInterval(function () { ran = true; }, 10);
                clearInterval(id);
                testing_1.tick(10);
                matchers_1.expect(ran).toEqual(false);
            }));
            testing_internal_1.it('should be able to cancel periodic timers from a callback', testing_1.fakeAsync(function () {
                var cycles = 0;
                var id /** TODO #9100 */;
                id = setInterval(function () {
                    cycles++;
                    clearInterval(id);
                }, 10);
                testing_1.tick(10);
                matchers_1.expect(cycles).toEqual(1);
                testing_1.tick(10);
                matchers_1.expect(cycles).toEqual(1);
            }));
            testing_internal_1.it('should clear periodic timers', testing_1.fakeAsync(function () {
                var cycles = 0;
                var id = setInterval(function () { cycles++; }, 10);
                testing_1.tick(10);
                matchers_1.expect(cycles).toEqual(1);
                testing_1.discardPeriodicTasks();
                // Tick once to clear out the timer which already started.
                testing_1.tick(10);
                matchers_1.expect(cycles).toEqual(2);
                testing_1.tick(10);
                // Nothing should change
                matchers_1.expect(cycles).toEqual(2);
            }));
            testing_internal_1.it('should process microtasks before timers', testing_1.fakeAsync(function () {
                var log = new testing_internal_1.Log();
                resolvedPromise.then(function (_) { return log.add('microtask'); });
                setTimeout(function () { return log.add('timer'); }, 9);
                var id = setInterval(function () { return log.add('periodic timer'); }, 10);
                matchers_1.expect(log.result()).toEqual('');
                testing_1.tick(10);
                matchers_1.expect(log.result()).toEqual('microtask; timer; periodic timer');
                clearInterval(id);
            }));
            testing_internal_1.it('should process micro-tasks created in timers before next timers', testing_1.fakeAsync(function () {
                var log = new testing_internal_1.Log();
                resolvedPromise.then(function (_) { return log.add('microtask'); });
                setTimeout(function () {
                    log.add('timer');
                    resolvedPromise.then(function (_) { return log.add('t microtask'); });
                }, 9);
                var id = setInterval(function () {
                    log.add('periodic timer');
                    resolvedPromise.then(function (_) { return log.add('pt microtask'); });
                }, 10);
                testing_1.tick(10);
                matchers_1.expect(log.result())
                    .toEqual('microtask; timer; t microtask; periodic timer; pt microtask');
                testing_1.tick(10);
                matchers_1.expect(log.result())
                    .toEqual('microtask; timer; t microtask; periodic timer; pt microtask; periodic timer; pt microtask');
                clearInterval(id);
            }));
            testing_internal_1.it('should flush tasks', testing_1.fakeAsync(function () {
                var ran = false;
                setTimeout(function () { ran = true; }, 10);
                testing_1.flush();
                matchers_1.expect(ran).toEqual(true);
            }));
            testing_internal_1.it('should flush multiple tasks', testing_1.fakeAsync(function () {
                var ran = false;
                var ran2 = false;
                setTimeout(function () { ran = true; }, 10);
                setTimeout(function () { ran2 = true; }, 30);
                var elapsed = testing_1.flush();
                matchers_1.expect(ran).toEqual(true);
                matchers_1.expect(ran2).toEqual(true);
                matchers_1.expect(elapsed).toEqual(30);
            }));
            testing_internal_1.it('should move periodic tasks', testing_1.fakeAsync(function () {
                var ran = false;
                var count = 0;
                setInterval(function () { count++; }, 10);
                setTimeout(function () { ran = true; }, 35);
                var elapsed = testing_1.flush();
                matchers_1.expect(count).toEqual(3);
                matchers_1.expect(ran).toEqual(true);
                matchers_1.expect(elapsed).toEqual(35);
                testing_1.discardPeriodicTasks();
            }));
        });
        testing_internal_1.describe('outside of the fakeAsync zone', function () {
            testing_internal_1.it('calling flushMicrotasks should throw', function () {
                matchers_1.expect(function () {
                    testing_1.flushMicrotasks();
                }).toThrowError('The code should be running in the fakeAsync zone to call this function');
            });
            testing_internal_1.it('calling tick should throw', function () {
                matchers_1.expect(function () {
                    testing_1.tick();
                }).toThrowError('The code should be running in the fakeAsync zone to call this function');
            });
            testing_internal_1.it('calling flush should throw', function () {
                matchers_1.expect(function () {
                    testing_1.flush();
                }).toThrowError('The code should be running in the fakeAsync zone to call this function');
            });
            testing_internal_1.it('calling discardPeriodicTasks should throw', function () {
                matchers_1.expect(function () {
                    testing_1.discardPeriodicTasks();
                }).toThrowError('The code should be running in the fakeAsync zone to call this function');
            });
        });
        testing_internal_1.describe('only one `fakeAsync` zone per test', function () {
            var zoneInBeforeEach;
            var zoneInTest1;
            testing_internal_1.beforeEach(testing_1.fakeAsync(function () { zoneInBeforeEach = Zone.current; }));
            testing_internal_1.it('should use the same zone as in beforeEach', testing_1.fakeAsync(function () {
                zoneInTest1 = Zone.current;
                matchers_1.expect(zoneInTest1).toBe(zoneInBeforeEach);
            }));
        });
    });
    testing_internal_1.describe('ProxyZone', function () {
        testing_internal_1.beforeEach(function () { ProxyZoneSpec.assertPresent(); });
        afterEach(function () { ProxyZoneSpec.assertPresent(); });
        testing_internal_1.it('should allow fakeAsync zone to retroactively set a zoneSpec outside of fakeAsync', function () {
            ProxyZoneSpec.assertPresent();
            var state = 'not run';
            var testZone = Zone.current.fork({ name: 'test-zone' });
            (testing_1.fakeAsync(function () {
                testZone.run(function () {
                    Promise.resolve('works').then(function (v) { return state = v; });
                    matchers_1.expect(state).toEqual('not run');
                    testing_1.flushMicrotasks();
                    matchers_1.expect(state).toEqual('works');
                });
            }))();
            matchers_1.expect(state).toEqual('works');
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZV9hc3luY19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2Zha2VfYXN5bmNfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILGlEQUFvRztBQUNwRywrRUFBaUc7QUFDakcsMkVBQXNFO0FBRXRFLHNFQUFtRTtBQUduRSxJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlDLElBQU0sYUFBYSxHQUFpQyxJQUFZLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFbEY7SUFDRSwyQkFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixxQkFBRSxDQUFDLDZCQUE2QixFQUFFO1lBQ2hDLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQztZQUNoQixtQkFBUyxDQUFDLGNBQVEsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFFbkMsaUJBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7UUFFSCxxQkFBRSxDQUFDLCtDQUErQyxFQUFFO1lBQ2xELG1CQUFTLENBQUMsVUFBQyxHQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBUSxDQUFDLGlCQUFpQjtnQkFDL0QsaUJBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzNCLGlCQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdCLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNuQixDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMsMkJBQTJCLEVBQUUsbUJBQVMsQ0FBQyx5QkFBTSxDQUFDLENBQUMsZUFBTSxDQUFDLEVBQUUsVUFB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