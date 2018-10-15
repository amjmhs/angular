"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var message_bus_1 = require("./message_bus");
var serializer_1 = require("./serializer");
/**
 * @experimental WebWorker support in Angular is experimental.
 */
var ClientMessageBrokerFactory = /** @class */ (function () {
    /** @internal */
    function ClientMessageBrokerFactory(_messageBus, _serializer) {
        this._messageBus = _messageBus;
        this._serializer = _serializer;
    }
    /**
     * Initializes the given channel and attaches a new {@link ClientMessageBroker} to it.
     */
    ClientMessageBrokerFactory.prototype.createMessageBroker = function (channel, runInZone) {
        if (runInZone === void 0) { runInZone = true; }
        this._messageBus.initChannel(channel, runInZone);
        return new ClientMessageBroker(this._messageBus, this._serializer, channel);
    };
    ClientMessageBrokerFactory = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [message_bus_1.MessageBus, serializer_1.Serializer])
    ], ClientMessageBrokerFactory);
    return ClientMessageBrokerFactory;
}());
exports.ClientMessageBrokerFactory = ClientMessageBrokerFactory;
/**
 * @experimental WebWorker support in Angular is experimental.
 */
var ClientMessageBroker = /** @class */ (function () {
    /** @internal */
    function ClientMessageBroker(messageBus, _serializer, channel) {
        var _this = this;
        this.channel = channel;
        this._pending = new Map();
        this._sink = messageBus.to(channel);
        this._serializer = _serializer;
        var source = messageBus.from(channel);
        source.subscribe({ next: function (message) { return _this._handleMessage(message); } });
    }
    ClientMessageBroker.prototype._generateMessageId = function (name) {
        var time = core_1.ɵstringify(new Date().getTime());
        var iteration = 0;
        var id = name + time + core_1.ɵstringify(iteration);
        while (this._pending.has(id)) {
            id = "" + name + time + iteration;
            iteration++;
        }
        return id;
    };
    ClientMessageBroker.prototype.runOnService = function (args, returnType) {
        var _this = this;
        var fnArgs = [];
        if (args.args) {
            args.args.forEach(function (argument) {
                if (argument.type != null) {
                    fnArgs.push(_this._serializer.serialize(argument.value, argument.type));
                }
                else {
                    fnArgs.push(argument.value);
                }
            });
        }
        var promise;
        var id = null;
        if (returnType != null) {
            var completer_1 = undefined;
            promise = new Promise(function (resolve, reject) { completer_1 = { resolve: resolve, reject: reject }; });
            id = this._generateMessageId(args.method);
            this._pending.set(id, completer_1);
            promise.catch(function (err) {
                if (console && console.error) {
                    // tslint:disable-next-line:no-console
                    console.error(err);
                }
                completer_1.reject(err);
            });
            promise = promise.then(function (v) { return _this._serializer ? _this._serializer.deserialize(v, returnType) : v; });
        }
        else {
            promise = null;
        }
        var message = {
            'method': args.method,
            'args': fnArgs,
        };
        if (id != null) {
            message['id'] = id;
        }
        this._sink.emit(message);
        return promise;
    };
    ClientMessageBroker.prototype._handleMessage = function (message) {
        if (message.type === 'result' || message.type === 'error') {
            var id = message.id;
            if (this._pending.has(id)) {
                if (message.type === 'result') {
                    this._pending.get(id).resolve(message.value);
                }
                else {
                    this._pending.get(id).reject(message.value);
                }
                this._pending.delete(id);
            }
        }
    };
    return ClientMessageBroker;
}());
exports.ClientMessageBroker = ClientMessageBroker;
/**
 * @experimental WebWorker support in Angular is experimental.
 */
var FnArg = /** @class */ (function () {
    function FnArg(value, type) {
        if (type === void 0) { type = 1 /* PRIMITIVE */; }
        this.value = value;
        this.type = type;
    }
    return FnArg;
}());
exports.FnArg = FnArg;
/**
 * @experimental WebWorker support in Angular is experimental.
 */
var UiArguments = /** @class */ (function () {
    function UiArguments(method, args) {
        this.method = method;
        this.args = args;
    }
    return UiArguments;
}());
exports.UiArguments = UiArguments;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50X21lc3NhZ2VfYnJva2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0td2Vid29ya2VyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvY2xpZW50X21lc3NhZ2VfYnJva2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXNGO0FBQ3RGLDZDQUF5QztBQUN6QywyQ0FBeUQ7QUFFekQ7O0dBRUc7QUFFSDtJQUlFLGdCQUFnQjtJQUNoQixvQ0FBb0IsV0FBdUIsRUFBRSxXQUF1QjtRQUFoRCxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUN6QyxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztJQUNqQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCx3REFBbUIsR0FBbkIsVUFBb0IsT0FBZSxFQUFFLFNBQXlCO1FBQXpCLDBCQUFBLEVBQUEsZ0JBQXlCO1FBQzVELElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNqRCxPQUFPLElBQUksbUJBQW1CLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFmVSwwQkFBMEI7UUFEdEMsaUJBQVUsRUFBRTt5Q0FNc0Isd0JBQVUsRUFBZSx1QkFBVTtPQUx6RCwwQkFBMEIsQ0FnQnRDO0lBQUQsaUNBQUM7Q0FBQSxBQWhCRCxJQWdCQztBQWhCWSxnRUFBMEI7QUF1QnZDOztHQUVHO0FBQ0g7SUFNRSxnQkFBZ0I7SUFDaEIsNkJBQVksVUFBc0IsRUFBRSxXQUF1QixFQUFVLE9BQVk7UUFBakYsaUJBTUM7UUFOb0UsWUFBTyxHQUFQLE9BQU8sQ0FBSztRQU56RSxhQUFRLEdBQUcsSUFBSSxHQUFHLEVBQTRCLENBQUM7UUFPckQsSUFBSSxDQUFDLEtB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