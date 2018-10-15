/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable, ɵstringify as stringify } from '@angular/core';
import { MessageBus } from './message_bus';
import { Serializer } from './serializer';
/**
 * \@experimental WebWorker support in Angular is experimental.
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
    /**
     * Initializes the given channel and attaches a new {\@link ClientMessageBroker} to it.
     * @param {?} channel
     * @param {?=} runInZone
     * @return {?}
     */
    ClientMessageBrokerFactory.prototype.createMessageBroker = /**
     * Initializes the given channel and attaches a new {\@link ClientMessageBroker} to it.
     * @param {?} channel
     * @param {?=} runInZone
     * @return {?}
     */
    function (channel, runInZone) {
        if (runInZone === void 0) { runInZone = true; }
        this._messageBus.initChannel(channel, runInZone);
        return new ClientMessageBroker(this._messageBus, this._serializer, channel);
    };
    ClientMessageBrokerFactory.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ClientMessageBrokerFactory.ctorParameters = function () { return [
        { type: MessageBus },
        { type: Serializer }
    ]; };
    return ClientMessageBrokerFactory;
}());
export { ClientMessageBrokerFactory };
if (false) {
    /**
     * \@internal
     * @type {?}
     */
    ClientMessageBrokerFactory.prototype._serializer;
    /** @type {?} */
    ClientMessageBrokerFactory.prototype._messageBus;
}
/**
 * @record
 */
function PromiseCompleter() { }
/** @type {?} */
PromiseCompleter.prototype.resolve;
/** @type {?} */
PromiseCompleter.prototype.reject;
/**
 * \@experimental WebWorker support in Angular is experimental.
 */
var /**
 * \@experimental WebWorker support in Angular is experimental.
 */
ClientMessageBroker = /** @class */ (function () {
    /** @internal */
    function ClientMessageBroker(messageBus, _serializer, channel) {
        var _this = this;
        this.channel = channel;
        this._pending = new Map();
        this._sink = messageBus.to(channel);
        this._serializer = _serializer;
        /** @type {?} */
        var source = messageBus.from(channel);
        source.subscribe({ next: function (message) { return _this._handleMessage(message); } });
    }
    /**
     * @param {?} name
     * @return {?}
     */
    ClientMessageBroker.prototype._generateMessageId = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        /** @type {?} */
        var time = stringify(new Date().getTime());
        /** @type {?} */
        var iteration = 0;
        /** @type {?} */
        var id = name + time + stringify(iteration);
        while (this._pending.has(id)) {
            id = "" + name + time + iteration;
            iteration++;
        }
        return id;
    };
    /**
     * @param {?} args
     * @param {?} returnType
     * @return {?}
     */
    ClientMessageBroker.prototype.runOnService = /**
     * @param {?} args
     * @param {?} returnType
     * @return {?}
     */
    function (args, returnType) {
        var _this = this;
        /** @type {?} */
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
        /** @type {?} */
        var promise;
        /** @type {?} */
        var id = null;
        if (returnType != null) {
            /** @type {?} */
            var completer_1 = /** @type {?} */ ((undefined));
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
        /** @type {?} */
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
    /**
     * @param {?} message
     * @return {?}
     */
    ClientMessageBroker.prototype._handleMessage = /**
     * @param {?} message
     * @return {?}
     */
    function (message) {
        if (message.type === 'result' || message.type === 'error') {
            /** @type {?} */
            var id = /** @type {?} */ ((message.id));
            if (this._pending.has(id)) {
                if (message.type === 'result') {
                    /** @type {?} */ ((this._pending.get(id))).resolve(message.value);
                }
                else {
                    /** @type {?} */ ((this._pending.get(id))).reject(message.value);
                }
                this._pending.delete(id);
            }
        }
    };
    return ClientMessageBroker;
}());
/**
 * \@experimental WebWorker support in Angular is experimental.
 */
export { ClientMessageBroker };
if (false) {
    /** @type {?} */
    ClientMessageBroker.prototype._pending;
    /** @type {?} */
    ClientMessageBroker.prototype._sink;
    /**
     * \@internal
     * @type {?}
     */
    ClientMessageBroker.prototype._serializer;
    /** @type {?} */
    ClientMessageBroker.prototype.channel;
}
/**
 * @record
 */
function RequestMessageData() { }
/** @type {?} */
RequestMessageData.prototype.method;
/** @type {?|undefined} */
RequestMessageData.prototype.args;
/** @type {?|undefined} */
RequestMessageData.prototype.id;
/**
 * @record
 */
function ResponseMessageData() { }
/** @type {?} */
ResponseMessageData.prototype.type;
/** @type {?|undefined} */
ResponseMessageData.prototype.value;
/** @type {?|undefined} */
ResponseMessageData.prototype.id;
/**
 * \@experimental WebWorker support in Angular is experimental.
 */
var /**
 * \@experimental WebWorker support in Angular is experimental.
 */
FnArg = /** @class */ (function () {
    function FnArg(value, type) {
        if (type === void 0) { type = 1 /* PRIMITIVE */; }
        this.value = value;
        this.type = type;
    }
    return FnArg;
}());
/**
 * \@experimental WebWorker support in Angular is experimental.
 */
export { FnArg };
if (false) {
    /** @type {?} */
    FnArg.prototype.value;
    /** @type {?} */
    FnArg.prototype.type;
}
/**
 * \@experimental WebWorker support in Angular is experimental.
 */
var /**
 * \@experimental WebWorker support in Angular is experimental.
 */
UiArguments = /** @class */ (function () {
    function UiArguments(method, args) {
        this.method = method;
        this.args = args;
    }
    return UiArguments;
}());
/**
 * \@experimental WebWorker support in Angular is experimental.
 */
export { UiArguments };
if (false) {
    /** @type {?} */
    UiArguments.prototype.method;
    /** @type {?} */
    UiArguments.prototype.args;
}
//# sourceMappingURL=client_message_broker.js.map