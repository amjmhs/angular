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
var test_bed_1 = require("@angular/core/testing/src/test_bed");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var message_bus_util_1 = require("./message_bus_util");
{
    /**
     * Tests the PostMessageBus
     */
    testing_internal_1.describe('MessageBus', function () {
        var bus;
        testing_internal_1.beforeEach(function () { bus = message_bus_util_1.createConnectedMessageBus(); });
        testing_internal_1.it('should pass messages in the same channel from sink to source', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var CHANNEL = 'CHANNEL 1';
            var MESSAGE = 'Test message';
            bus.initChannel(CHANNEL, false);
            var fromEmitter = bus.from(CHANNEL);
            fromEmitter.subscribe({
                next: function (message) {
                    testing_internal_1.expect(message).toEqual(MESSAGE);
                    async.done();
                }
            });
            var toEmitter = bus.to(CHANNEL);
            toEmitter.emit(MESSAGE);
        }));
        testing_internal_1.it('should broadcast', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var CHANNEL = 'CHANNEL 1';
            var MESSAGE = 'TESTING';
            var NUM_LISTENERS = 2;
            bus.initChannel(CHANNEL, false);
            var callCount = 0;
            var emitHandler = function (message) {
                testing_internal_1.expect(message).toEqual(MESSAGE);
                callCount++;
                if (callCount == NUM_LISTENERS) {
                    async.done();
                }
            };
            for (var i = 0; i < NUM_LISTENERS; i++) {
                var emitter = bus.from(CHANNEL);
                emitter.subscribe({ next: emitHandler });
            }
            var toEmitter = bus.to(CHANNEL);
            toEmitter.emit(MESSAGE);
        }));
        testing_internal_1.it('should keep channels independent', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var CHANNEL_ONE = 'CHANNEL 1';
            var CHANNEL_TWO = 'CHANNEL 2';
            var MESSAGE_ONE = 'This is a message on CHANNEL 1';
            var MESSAGE_TWO = 'This is a message on CHANNEL 2';
            var callCount = 0;
            bus.initChannel(CHANNEL_ONE, false);
            bus.initChannel(CHANNEL_TWO, false);
            var firstFromEmitter = bus.from(CHANNEL_ONE);
            firstFromEmitter.subscribe({
                next: function (message) {
                    testing_internal_1.expect(message).toEqual(MESSAGE_ONE);
                    callCount++;
                    if (callCount == 2) {
                        async.done();
                    }
                }
            });
            var secondFromEmitter = bus.from(CHANNEL_TWO);
            secondFromEmitter.subscribe({
                next: function (message) {
                    testing_internal_1.expect(message).toEqual(MESSAGE_TWO);
                    callCount++;
                    if (callCount == 2) {
                        async.done();
                    }
                }
            });
            var firstToEmitter = bus.to(CHANNEL_ONE);
            firstToEmitter.emit(MESSAGE_ONE);
            var secondToEmitter = bus.to(CHANNEL_TWO);
            secondToEmitter.emit(MESSAGE_TWO);
        }));
    });
    testing_internal_1.describe('PostMessageBusSink', function () {
        var bus;
        var CHANNEL = 'Test Channel';
        function setup(runInZone, zone) {
            bus.attachToZone(zone);
            bus.initChannel(CHANNEL, runInZone);
        }
        /**
         * Flushes pending messages and then runs the given function.
         */
        // TODO(mlaval): timeout is fragile, test to be rewritten
        function flushMessages(fn) { setTimeout(fn, 50); }
        testing_internal_1.it('should buffer messages and wait for the zone to exit before sending', test_bed_1.withModule({ providers: [{ provide: core_1.NgZone, useClass: testing_internal_1.MockNgZone }] })
            .inject([testing_internal_1.AsyncTestCompleter, core_1.NgZone], function (async, zone) {
            bus = message_bus_util_1.createConnectedMessageBus();
            setup(true, zone);
            var wasCalled = false;
            bus.from(CHANNEL).subscribe({ next: function (message) { wasCalled = true; } });
            bus.to(CHANNEL).emit('hi');
            flushMessages(function () {
                testing_internal_1.expect(wasCalled).toBeFalsy();
                zone.simulateZoneExit();
                flushMessages(function () {
                    testing_internal_1.expect(wasCalled).toBeTruthy();
                    async.done();
                });
            });
        }), 500);
        testing_internal_1.it('should send messages immediately when run outside the zone', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter, core_1.NgZone], function (async, zone) {
            bus = message_bus_util_1.createConnectedMessageBus();
            setup(false, zone);
            var wasCalled = false;
            bus.from(CHANNEL).subscribe({ next: function (message) { wasCalled = true; } });
            bus.to(CHANNEL).emit('hi');
            flushMessages(function () {
                testing_internal_1.expect(wasCalled).toBeTruthy();
                async.done();
            });
        }), 10000);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZV9idXNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLXdlYndvcmtlci90ZXN0L3dlYl93b3JrZXJzL3NoYXJlZC9tZXNzYWdlX2J1c19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQXFDO0FBQ3JDLCtEQUE4RDtBQUM5RCwrRUFBb0k7QUFHcEksdURBQTZEO0FBRTdEO0lBQ0U7O09BRUc7SUFDSCwyQkFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixJQUFJLEdBQWUsQ0FBQztRQUVwQiw2QkFBVSxDQUFDLGNBQVEsR0FBRyxHQUFHLDRDQUF5QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV6RCxxQkFBRSxDQUFDLDhEQUE4RCxFQUM5RCx5QkFBTSxDQUFDLENBQUMscUNBQWtCLENBQUMsRUFBRSxVQUFDLEtBQXlCO1lBQ3JELElBQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQztZQUM1QixJQUFNLE9BQU8sR0FBRyxjQUFjLENBQUM7WUFDL0IsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFaEMsSUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN0QyxXQUFXLENBQUMsU0FBUyxDQUFDO2dCQUNwQixJQUFJLEVBQUUsVUFBQyxPQUFZO29CQUNqQix5QkFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDakMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNmLENBQUM7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2xDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFD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