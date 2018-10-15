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
var core_1 = require("@angular/core");
var MockEventEmitter = /** @class */ (function (_super) {
    __extends(MockEventEmitter, _super);
    function MockEventEmitter() {
        var _this = _super.call(this) || this;
        _this._nextFns = [];
        return _this;
    }
    MockEventEmitter.prototype.subscribe = function (generator) {
        this._nextFns.push(generator.next);
        return new MockDisposable();
    };
    MockEventEmitter.prototype.emit = function (value) { this._nextFns.forEach(function (fn) { return fn(value); }); };
    return MockEventEmitter;
}(core_1.EventEmitter));
exports.MockEventEmitter = MockEventEmitter;
var MockDisposable = /** @class */ (function () {
    function MockDisposable() {
        this.isUnsubscribed = false;
    }
    MockDisposable.prototype.unsubscribe = function () { };
    return MockDisposable;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9ja19ldmVudF9lbWl0dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0td2Vid29ya2VyL3Rlc3Qvd2ViX3dvcmtlcnMvc2hhcmVkL21vY2tfZXZlbnRfZW1pdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBMkM7QUFFM0M7SUFBeUMsb0NBQWU7SUFHdEQ7UUFBQSxZQUFnQixpQkFBTyxTQUFHO1FBRmxCLGNBQVEsR0FBZSxFQUFFLENBQUM7O0lBRVQsQ0FBQztJQUUxQixvQ0FBUyxHQUFULFVBQVUsU0FBYztRQUN0QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsT0FBTyxJQUFJLGNBQWMsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCwrQkFBSSxHQUFKLFVBQUssS0FBVSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFULENBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RCx1QkFBQztBQUFELENBQUMsQUFYRCxDQUF5QyxtQkFBWSxHQVdwRDtBQVhZLDRDQUFnQjtBQWE3QjtJQUFBO1FBQ0UsbUJBQWMsR0FBWSxLQUFLLENBQUM7SUFFbEMsQ0FBQztJQURDLG9DQUFXLEdBQVgsY0FBcUIsQ0FBQztJQUN4QixxQkFBQztBQUFELENBQUMsQUFIRCxJQUdDIn0=