"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var post_message_bus_1 = require("@angular/platform-webworker/src/web_workers/shared/post_message_bus");
/*
 * Returns a PostMessageBus that's sink is connected to its own source.
 * Useful for testing the sink and source.
 */
function createConnectedMessageBus() {
    var mockPostMessage = new MockPostMessage();
    var source = new post_message_bus_1.PostMessageBusSource(mockPostMessage);
    var sink = new post_message_bus_1.PostMessageBusSink(mockPostMessage);
    return new post_message_bus_1.PostMessageBus(sink, source);
}
exports.createConnectedMessageBus = createConnectedMessageBus;
var MockPostMessage = /** @class */ (function () {
    function MockPostMessage() {
    }
    MockPostMessage.prototype.addEventListener = function (type, listener, useCapture) {
        if (type === 'message') {
            this._listener = listener;
        }
    };
    MockPostMessage.prototype.postMessage = function (data, transfer) { this._listener({ data: data }); };
    return MockPostMessage;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZV9idXNfdXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLXdlYndvcmtlci90ZXN0L3dlYl93b3JrZXJzL3NoYXJlZC9tZXNzYWdlX2J1c191dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsd0dBQTZJO0FBRzdJOzs7R0FHRztBQUNIO0lBQ0UsSUFBTSxlQUFlLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztJQUM5QyxJQUFNLE1BQU0sR0FBRyxJQUFJLHVDQUFvQixDQUFNLGVBQWUsQ0FBQyxDQUFDO0lBQzlELElBQU0sSUFBSSxHQUFHLElBQUkscUNBQWtCLENBQUMsZUFBZSxDQUFDLENBQUM7SUFFckQsT0FBTyxJQUFJLGlDQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFORCw4REFNQztBQUVEO0lBQUE7SUFXQSxDQUFDO0lBUEMsMENBQWdCLEdBQWhCLFVBQWlCLElBQVksRUFBRSxRQUF1QixFQUFFLFVBQW9CO1FBQzFFLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztTQUMzQjtJQUNILENBQUM7SUFFRCxxQ0FBVyxHQUFYLFVBQVksSUFBUyxFQUFFLFFBQXdCLElBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBTSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvRixzQkFBQztBQUFELENBQUMsQUFYRCxJQVdDIn0=