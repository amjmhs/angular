"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var operators_1 = require("rxjs/operators");
var event_emitter_1 = require("../src/event_emitter");
{
    testing_internal_1.describe('EventEmitter', function () {
        var emitter;
        testing_internal_1.beforeEach(function () { emitter = new event_emitter_1.EventEmitter(); });
        testing_internal_1.it('should call the next callback', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            emitter.subscribe({
                next: function (value) {
                    testing_internal_1.expect(value).toEqual(99);
                    async.done();
                }
            });
            emitter.emit(99);
        }));
        testing_internal_1.it('should call the throw callback', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            emitter.subscribe({
                next: function () { },
                error: function (error) {
                    testing_internal_1.expect(error).toEqual('Boom');
                    async.done();
                }
            });
            emitter.error('Boom');
        }));
        testing_internal_1.it('should work when no throw callback is provided', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            emitter.subscribe({ next: function () { }, error: function (_) { async.done(); } });
            emitter.error('Boom');
        }));
        testing_internal_1.it('should call the return callback', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            emitter.subscribe({ next: function () { }, error: function (_) { }, complete: function () { async.done(); } });
            emitter.complete();
        }));
        testing_internal_1.it('should subscribe to the wrapper synchronously', function () {
            var called = false;
            emitter.subscribe({ next: function (value) { called = true; } });
            emitter.emit(99);
            testing_internal_1.expect(called).toBe(true);
        });
        testing_internal_1.it('delivers next and error events synchronously', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var log = [];
            emitter.subscribe({
                next: function (x) {
                    log.push(x);
                    testing_internal_1.expect(log).toEqual([1, 2]);
                },
                error: function (err) {
                    log.push(err);
                    testing_internal_1.expect(log).toEqual([1, 2, 3, 4]);
                    async.done();
                }
            });
            log.push(1);
            emitter.emit(2);
            log.push(3);
            emitter.error(4);
            log.push(5);
        }));
        testing_internal_1.it('delivers next and complete events synchronously', function () {
            var log = [];
            emitter.subscribe({
                next: function (x) {
                    log.push(x);
                    testing_internal_1.expect(log).toEqual([1, 2]);
                },
                error: null,
                complete: function () {
                    log.push(4);
                    testing_internal_1.expect(log).toEqual([1, 2, 3, 4]);
                }
            });
            log.push(1);
            emitter.emit(2);
            log.push(3);
            emitter.complete();
            log.push(5);
            testing_internal_1.expect(log).toEqual([1, 2, 3, 4, 5]);
        });
        testing_internal_1.it('delivers events asynchronously when forced to async mode', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var e = new event_emitter_1.EventEmitter(true);
            var log = [];
            e.subscribe(function (x) {
                log.push(x);
                testing_internal_1.expect(log).toEqual([1, 3, 2]);
                async.done();
            });
            log.push(1);
            e.emit(2);
            log.push(3);
        }));
        testing_internal_1.it('reports whether it has subscribers', function () {
            var e = new event_emitter_1.EventEmitter(false);
            testing_internal_1.expect(e.observers.length > 0).toBe(false);
            e.subscribe({ next: function () { } });
            testing_internal_1.expect(e.observers.length > 0).toBe(true);
        });
        testing_internal_1.it('remove a subscriber subscribed directly to EventEmitter', function () {
            var sub = emitter.subscribe();
            testing_internal_1.expect(emitter.observers.length).toBe(1);
            sub.unsubscribe();
            testing_internal_1.expect(emitter.observers.length).toBe(0);
        });
        testing_internal_1.it('remove a subscriber subscribed after applying operators with pipe()', function () {
            var sub = emitter.pipe(operators_1.filter(function () { return true; })).subscribe();
            testing_internal_1.expect(emitter.observers.length).toBe(1);
            sub.unsubscribe();
            testing_internal_1.expect(emitter.observers.length).toBe(0);
        });
        testing_internal_1.it('unsubscribing a subscriber invokes the dispose method', function () {
            testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var sub = emitter.subscribe();
                sub.add(function () { return async.done(); });
                sub.unsubscribe();
            });
        });
        testing_internal_1.it('unsubscribing a subscriber after applying operators with pipe() invokes the dispose method', function () {
            testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var sub = emitter.pipe(operators_1.filter(function () { return true; })).subscribe();
                sub.add(function () { return async.done(); });
                sub.unsubscribe();
            });
        });
        testing_internal_1.it('error thrown inside an Rx chain propagates to the error handler and disposes the chain', function () {
            var errorPropagated = false;
            emitter.pipe(operators_1.filter(function () { throw new Error(); }))
                .subscribe(function () { }, function (err) { return errorPropagated = true; });
            emitter.next(1);
            testing_internal_1.expect(errorPropagated).toBe(true);
            testing_internal_1.expect(emitter.observers.length).toBe(0);
        });
        testing_internal_1.it('error sent by EventEmitter should dispose the Rx chain and remove subscribers', function () {
            var errorPropagated = false;
            emitter.pipe(operators_1.filter(function () { return true; })).subscribe(function () { }, function (err) { return errorPropagated = true; });
            emitter.error(1);
            testing_internal_1.expect(errorPropagated).toBe(true);
            testing_internal_1.expect(emitter.observers.length).toBe(0);
        });
        // TODO: vsavkin: add tests cases
        // should call dispose on the subscription if generator returns {done:true}
        // should call dispose on the subscription on throw
        // should call dispose on the subscription on return
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRfZW1pdHRlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2V2ZW50X2VtaXR0ZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtFQUF3SDtBQUN4SCw0Q0FBc0M7QUFFdEMsc0RBQWtEO0FBRWxEO0lBQ0UsMkJBQVEsQ0FBQyxjQUFjLEVBQUU7UUFDdkIsSUFBSSxPQUEwQixDQUFDO1FBRS9CLDZCQUFVLENBQUMsY0FBUSxPQUFPLEdBQUcsSUFBSSw0QkFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVwRCxxQkFBRSxDQUFDLCtCQUErQixFQUMvQix5QkFBTSxDQUFDLENBQUMscUNBQWtCLENBQUMsRUFBRSxVQUFDLEtBQXlCO1lBQ3JELE9BQU8sQ0FBQyxTQUFTLENBQUM7Z0JBQ2hCLElBQUksRUFBRSxVQUFDLEtBQVU7b0JBQ2YseUJBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQzFCLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDZixDQUFDO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNuQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAscUJBQUUsQ0FBQyxnQ0FBZ0MsRUFDaEMseUJBQU0sQ0FBQyxDQUFDLHFDQUFrQixDQUFDLEVBQUUsVUFBQyxLQUF5QjtZQUNyRCxPQUFPLENBQUMsU0FBUyxDQUFDO2dCQUNoQixJQUFJLEVBQUUsY0FBTyxDQUFDO2dCQUNkLEtBQUssRUFBRSxVQUFDLEtBQVU7b0JBQ2hCLHlCQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUM5QixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2YsQ0FBQzthQUNGLENBQUMsQ0FBQztZQUNILE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVQLHFCQUFFLENBQUMsZ0RBQWdELEVBQ2hELHlCQUFNLENBQUMsQ0FBQyxxQ0FBa0IsQ0FBQyxFQUFFLFVBQUMsS0FBeUI7WUFDckQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFDLElBQUksRUFBRSxjQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsVUFBQyxDQUFNLElBQU8sS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUMxRSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxxQkFBRSxDQUFDLGlDQUFpQyxFQUNqQyx5QkFBTSxDQUFDLENBQUMscUNBQWtCLENBQUMsRUFBRSxVQUFDLEtBQXlCO1lBQ3JELE9BQU8sQ0FBQyxTQUFTLENBQ2IsRUFBQyxJQUFJLEVBQUUsY0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLFVBQUMsQ0FBTSxJQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsY0FBUSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQ2hGLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNyQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAscUJBQUUsQ0FBQywrQ0FBK0MsRUFBRTtZQUNsRCxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDbkIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFDLElBQUksRUFBRSxVQUFDLEtBQVUsSUFBTyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUM5RCxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRWpCLHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDO1FBRUgscUJBQUUsQ0FBQyw4Q0FBOEMsRUFDOUMseUJBQU0sQ0FBQyxDQUFDLHFDQUFrQixDQUFDLEVBQUUsVUFBQyxLQUF5QjtZQUNyRCxJQUFNLEdBQUcsR0FBNEIsRUFBRSxDQUFDO1lBRXhDLE9BQU8sQ0FBQyxTQUFTLENBQUM7Z0JBQ2hCLElBQUksRUFBRSxVQUFDLENBQU07b0JBQ1gsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWix5QkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixDQUFDO2dCQUNELEtBQUssRUFBRSxVQUFDLEdBQVE7b0JBQ2QsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDZCx5QkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDZixDQUFDO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNaLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEIsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNaLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakIsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxxQkFBRSxDQUFDLGlEQUFpRCxFQUFFO1lBQ3BELElBQU0sR0FBRyxHQUE0QixFQUFFLENBQUM7WUFFeEMsT0FBTyxDQUFDLFNBQVMsQ0FBQztnQkFDaEIsSUFBSSxFQUFFLFVBQUMsQ0FBTTtvQkFDWCxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNaLHlCQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLENBQUM7Z0JBQ0QsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsUUFBUSxFQUFFO29CQUNSLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1oseUJBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxDQUFDO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNaLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEIsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNaLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1oseUJBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMsMERBQTBELEVBQzFELHlCQUFNLENBQUMsQ0FBQyxxQ0FBa0IsQ0FBQyxFQUFFLFVBQUMsS0FBeUI7WUFDckQsSUFBTSxDQUFDLEdBQUcsSUFBSSw0QkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pDLElBQU0sR0FBRyxHQUE0QixFQUFFLENBQUM7WUFDeEMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFDLENBQU07Z0JBQ2pCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1oseUJBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNmLENBQUMsQ0FBQyxDQUFDO1lBQ0gsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNaLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWQsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVQLHFCQUFFLENBQUMsb0NBQW9DLEVBQUU7WUFDdkMsSUFBTSxDQUFDLEdBQUcsSUFBSSw0QkFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xDLHlCQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBQyxJQUFJLEVBQUUsY0FBTyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQzlCLHlCQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLENBQUMsQ0FBQyxDQUFDO1FBRUgscUJBQUUsQ0FBQyx5REFBeUQsRUFBRTtZQUM1RCxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDaEMseUJBQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbEIseUJBQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMscUVBQXFFLEVBQUU7WUFDeEUsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxrQkFBTSxDQUFDLGNBQU0sT0FBQSxJQUFJLEVBQUosQ0FBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUN6RCx5QkFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNsQix5QkFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO1FBRUgscUJBQUUsQ0FBQyx1REFBdUQsRUFBRTtZQUMxRCx5QkFBTSxDQUFDLENBQUMscUNBQWtCLENBQUMsRUFBRSxVQUFDLEtBQXlCO2dCQUNyRCxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ2hDLEdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBTSxPQUFBLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBWixDQUFZLENBQUMsQ0FBQztnQkFDNUIsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxxQkFBRSxDQUFDLDRGQUE0RixFQUM1RjtZQUNFLHlCQUFNLENBQUMsQ0FBQyxxQ0FBa0IsQ0FBQyxFQUFFLFVBQUMsS0FBeUI7Z0JBQ3JELElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQU0sQ0FBQyxjQUFNLE9BQUEsSUFBSSxFQUFKLENBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ3pELEdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBTSxPQUFBLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBWixDQUFZLENBQUMsQ0FBQztnQkFDNUIsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFTixxQkFBRSxDQUFDLHdGQUF3RixFQUN4RjtZQUNFLElBQUksZUFBZSxHQUFHLEtBQUssQ0FBQztZQUM1QixPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFNLENBQUMsY0FBUSxNQUFNLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRztpQkFDL0MsU0FBUyxDQUFDLGNBQU8sQ0FBQyxFQUFFLFVBQUEsR0FBRyxJQUFJLE9BQUEsZUFBZSxHQUFHLElBQUksRUFBdEIsQ0FBc0IsQ0FBRyxDQUFDO1lBRTFELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFaEIseUJBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkMseUJBQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztRQUVOLHFCQUFFLENBQUMsK0VBQStFLEVBQUU7WUFDbEYsSUFBSSxlQUFlLEdBQUcsS0FBSyxDQUFDO1lBQzVCLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQU0sQ0FBQyxjQUFNLE9BQUEsSUFBSSxFQUFKLENBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGNBQU8sQ0FBQyxFQUFFLFVBQUEsR0FBRyxJQUFJLE9BQUEsZUFBZSxHQUFHLElBQUksRUFBdEIsQ0FBc0IsQ0FBRyxDQUFDO1lBRXRGLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFakIseUJBQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkMseUJBQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztRQUVILGlDQUFpQztRQUNqQywyRUFBMkU7UUFDM0UsbURBQW1EO1FBQ25ELG9EQUFvRDtJQUN0RCxDQUFDLENBQUMsQ0FBQztDQUNKIn0=