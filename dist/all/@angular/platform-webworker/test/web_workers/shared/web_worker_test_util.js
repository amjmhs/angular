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
Object.defineProperty(exports, "__esModule", { value: true });
var client_message_broker_1 = require("@angular/platform-webworker/src/web_workers/shared/client_message_broker");
var message_bus_1 = require("@angular/platform-webworker/src/web_workers/shared/message_bus");
var mock_event_emitter_1 = require("./mock_event_emitter");
/**
 * Returns two MessageBus instances that are attached to each other.
 * Such that whatever goes into one's sink comes out the others source.
 */
function createPairedMessageBuses() {
    var firstChannels = {};
    var workerMessageBusSink = new MockMessageBusSink(firstChannels);
    var uiMessageBusSource = new MockMessageBusSource(firstChannels);
    var secondChannels = {};
    var uiMessageBusSink = new MockMessageBusSink(secondChannels);
    var workerMessageBusSource = new MockMessageBusSource(secondChannels);
    return new PairedMessageBuses(new MockMessageBus(uiMessageBusSink, uiMessageBusSource), new MockMessageBus(workerMessageBusSink, workerMessageBusSource));
}
exports.createPairedMessageBuses = createPairedMessageBuses;
/**
 * Spies on the given {@link SpyMessageBroker} and expects a call with the given methodName
 * andvalues.
 * If a handler is provided it will be called to handle the request.
 * Only intended to be called on a given broker instance once.
 */
function expectBrokerCall(broker, methodName, vals, handler) {
    broker.spy('runOnService').and.callFake(function (args, returnType) {
        expect(args.method).toEqual(methodName);
        if (vals != null) {
            expect(args.args.length).toEqual(vals.length);
            vals.forEach(function (v, i) { expect(v).toEqual(args.args[i].value); });
        }
        var promise = null;
        if (handler != null) {
            var givenValues = args.args.map(function (arg) { return arg.value; });
            if (givenValues.length > 0) {
                promise = handler(givenValues);
            }
            else {
                promise = handler();
            }
        }
        if (promise == null) {
            promise = new Promise(function (res, rej) {
                try {
                    res();
                }
                catch (e) {
                    rej(e);
                }
            });
        }
        return promise;
    });
}
exports.expectBrokerCall = expectBrokerCall;
var PairedMessageBuses = /** @class */ (function () {
    function PairedMessageBuses(ui, worker) {
        this.ui = ui;
        this.worker = worker;
    }
    return PairedMessageBuses;
}());
exports.PairedMessageBuses = PairedMessageBuses;
var MockMessageBusSource = /** @class */ (function () {
    function MockMessageBusSource(_channels) {
        this._channels = _channels;
    }
    MockMessageBusSource.prototype.initChannel = function (channel, runInZone) {
        if (runInZone === void 0) { runInZone = true; }
        if (!this._channels.hasOwnProperty(channel)) {
            this._channels[channel] = new mock_event_emitter_1.MockEventEmitter();
        }
    };
    MockMessageBusSource.prototype.from = function (channel) {
        if (!this._channels.hasOwnProperty(channel)) {
            throw new Error(channel + " is not set up. Did you forget to call initChannel?");
        }
        return this._channels[channel];
    };
    MockMessageBusSource.prototype.attachToZone = function (zone) { };
    return MockMessageBusSource;
}());
exports.MockMessageBusSource = MockMessageBusSource;
var MockMessageBusSink = /** @class */ (function () {
    function MockMessageBusSink(_channels) {
        this._channels = _channels;
    }
    MockMessageBusSink.prototype.initChannel = function (channel, runInZone) {
        if (runInZone === void 0) { runInZone = true; }
        if (!this._channels.hasOwnProperty(channel)) {
            this._channels[channel] = new mock_event_emitter_1.MockEventEmitter();
        }
    };
    MockMessageBusSink.prototype.to = function (channel) {
        if (!this._channels.hasOwnProperty(channel)) {
            this._channels[channel] = new mock_event_emitter_1.MockEventEmitter();
        }
        return this._channels[channel];
    };
    MockMessageBusSink.prototype.attachToZone = function (zone) { };
    return MockMessageBusSink;
}());
exports.MockMessageBusSink = MockMessageBusSink;
/**
 * Mock implementation of the {@link MessageBus} for tests.
 * Runs syncronously, and does not support running within the zone.
 */
var MockMessageBus = /** @class */ (function (_super) {
    __extends(MockMessageBus, _super);
    function MockMessageBus(sink, source) {
        var _this = _super.call(this) || this;
        _this.sink = sink;
        _this.source = source;
        return _this;
    }
    MockMessageBus.prototype.initChannel = function (channel, runInZone) {
        if (runInZone === void 0) { runInZone = true; }
        this.sink.initChannel(channel, runInZone);
        this.source.initChannel(channel, runInZone);
    };
    MockMessageBus.prototype.to = function (channel) { return this.sink.to(channel); };
    MockMessageBus.prototype.from = function (channel) { return this.source.from(channel); };
    MockMessageBus.prototype.attachToZone = function (zone) { };
    return MockMessageBus;
}(message_bus_1.MessageBus));
exports.MockMessageBus = MockMessageBus;
exports._ClientMessageBrokerFactory = client_message_broker_1.ClientMessageBrokerFactory;
var MockMessageBrokerFactory = /** @class */ (function (_super) {
    __extends(MockMessageBrokerFactory, _super);
    function MockMessageBrokerFactory(_messageBroker) {
        var _this = _super.call(this, null, null) || this;
        _this._messageBroker = _messageBroker;
        return _this;
    }
    MockMessageBrokerFactory.prototype.createMessageBroker = function (channel, runInZone) {
        if (runInZone === void 0) { runInZone = true; }
        return this._messageBroker;
    };
    return MockMessageBrokerFactory;
}(exports._ClientMessageBrokerFactory));
exports.MockMessageBrokerFactory = MockMessageBrokerFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViX3dvcmtlcl90ZXN0X3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS13ZWJ3b3JrZXIvdGVzdC93ZWJfd29ya2Vycy9zaGFyZWQvd2ViX3dvcmtlcl90ZXN0X3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBSUgsa0hBQXNKO0FBQ3RKLDhGQUE0SDtBQUc1SCwyREFBc0Q7QUFFdEQ7OztHQUdHO0FBQ0g7SUFDRSxJQUFNLGFBQWEsR0FBMkMsRUFBRSxDQUFDO0lBQ2pFLElBQU0sb0JBQW9CLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNuRSxJQUFNLGtCQUFrQixHQUFHLElBQUksb0JBQW9CLENBQUMsYUFBYSxDQUFDLENBQUM7SUFFbkUsSUFBTSxjQUFjLEdBQTJDLEVBQUUsQ0FBQztJQUNsRSxJQUFNLGdCQUFnQixHQUFHLElBQUksa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDaEUsSUFBTSxzQkFBc0IsR0FBRyxJQUFJLG9CQUFvQixDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBRXhFLE9BQU8sSUFBSSxrQkFBa0IsQ0FDekIsSUFBSSxjQUFjLENBQUMsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUMsRUFDeEQsSUFBSSxjQUFjLENBQUMsb0JBQW9CLEVBQUUsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO0FBQ3hFLENBQUM7QUFaRCw0REFZQztBQUVEOzs7OztHQUtHO0FBQ0gsMEJBQ0ksTUFBd0IsRUFBRSxVQUFrQixFQUFFLElBQWlCLEVBQy9ELE9BQTZDO0lBQy9DLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxVQUFDLElBQWlCLEVBQUUsVUFBcUI7UUFDL0UsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFP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