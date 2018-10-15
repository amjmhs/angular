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
var client_message_broker_1 = require("../shared/client_message_broker");
var message_bus_1 = require("../shared/message_bus");
var messaging_api_1 = require("../shared/messaging_api");
var render_store_1 = require("../shared/render_store");
var serializer_1 = require("../shared/serializer");
var NamedEventEmitter = /** @class */ (function () {
    function NamedEventEmitter() {
    }
    NamedEventEmitter.prototype.listen = function (eventName, callback) { this._getListeners(eventName).push(callback); };
    NamedEventEmitter.prototype.unlisten = function (eventName, listener) {
        var listeners = this._getListeners(eventName);
        var index = listeners.indexOf(listener);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    };
    NamedEventEmitter.prototype.dispatchEvent = function (eventName, event) {
        var listeners = this._getListeners(eventName);
        for (var i = 0; i < listeners.length; i++) {
            listeners[i](event);
        }
    };
    NamedEventEmitter.prototype._getListeners = function (eventName) {
        if (!this._listeners) {
            this._listeners = new Map();
        }
        var listeners = this._listeners.get(eventName);
        if (!listeners) {
            listeners = [];
            this._listeners.set(eventName, listeners);
        }
        return listeners;
    };
    return NamedEventEmitter;
}());
exports.NamedEventEmitter = NamedEventEmitter;
function eventNameWithTarget(target, eventName) {
    return target + ":" + eventName;
}
var WebWorkerRendererFactory2 = /** @class */ (function () {
    function WebWorkerRendererFactory2(messageBrokerFactory, bus, _serializer, renderStore) {
        var _this = this;
        this._serializer = _serializer;
        this.renderStore = renderStore;
        this.globalEvents = new NamedEventEmitter();
        this._messageBroker = messageBrokerFactory.createMessageBroker(messaging_api_1.RENDERER_2_CHANNEL);
        bus.initChannel(messaging_api_1.EVENT_2_CHANNEL);
        var source = bus.from(messaging_api_1.EVENT_2_CHANNEL);
        source.subscribe({ next: function (message) { return _this._dispatchEvent(message); } });
    }
    WebWorkerRendererFactory2.prototype.createRenderer = function (element, type) {
        var renderer = new WebWorkerRenderer2(this);
        var id = this.renderStore.allocateId();
        this.renderStore.store(renderer, id);
        this.callUI('createRenderer', [
            new client_message_broker_1.FnArg(element, 2 /* RENDER_STORE_OBJECT */),
            new client_message_broker_1.FnArg(type, 0 /* RENDERER_TYPE_2 */),
            new client_message_broker_1.FnArg(renderer, 2 /* RENDER_STORE_OBJECT */),
        ]);
        return renderer;
    };
    WebWorkerRendererFactory2.prototype.begin = function () { };
    WebWorkerRendererFactory2.prototype.end = function () { };
    WebWorkerRendererFactory2.prototype.callUI = function (fnName, fnArgs) {
        var args = new client_message_broker_1.UiArguments(fnName, fnArgs);
        this._messageBroker.runOnService(args, null);
    };
    WebWorkerRendererFactory2.prototype.allocateNode = function () {
        var result = new WebWorkerRenderNode();
        var id = this.renderStore.allocateId();
        this.renderStore.store(result, id);
        return result;
    };
    WebWorkerRendererFactory2.prototype.freeNode = function (node) { this.renderStore.remove(node); };
    WebWorkerRendererFactory2.prototype.allocateId = function () { return this.renderStore.allocateId(); };
    WebWorkerRendererFactory2.prototype._dispatchEvent = function (message) {
        var element = this._serializer.deserialize(message['element'], 2 /* RENDER_STORE_OBJECT */);
        var eventName = message['eventName'];
        var target = message['eventTarget'];
        var event = message['event'];
        if (target) {
            this.globalEvents.dispatchEvent(eventNameWithTarget(target, eventName), event);
        }
        else {
            element.events.dispatchEvent(eventName, event);
        }
    };
    WebWorkerRendererFactory2 = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [client_message_broker_1.ClientMessageBrokerFactory, message_bus_1.MessageBus,
            serializer_1.Serializer, render_store_1.RenderStore])
    ], WebWorkerRendererFactory2);
    return WebWorkerRendererFactory2;
}());
exports.WebWorkerRendererFactory2 = WebWorkerRendererFactory2;
var WebWorkerRenderer2 = /** @class */ (function () {
    function WebWorkerRenderer2(_rendererFactory) {
        this._rendererFactory = _rendererFactory;
        this.data = Object.create(null);
        this.asFnArg = new client_message_broker_1.FnArg(this, 2 /* RENDER_STORE_OBJECT */);
    }
    WebWorkerRenderer2.prototype.destroy = function () { this.callUIWithRenderer('destroy'); };
    WebWorkerRenderer2.prototype.destroyNode = function (node) {
        this.callUIWithRenderer('destroyNode', [new client_message_broker_1.FnArg(node, 2 /* RENDER_STORE_OBJECT */)]);
        this._rendererFactory.freeNode(node);
    };
    WebWorkerRenderer2.prototype.createElement = function (name, namespace) {
        var node = this._rendererFactory.allocateNode();
        this.callUIWithRenderer('createElement', [
            new client_message_broker_1.FnArg(name),
            new client_message_broker_1.FnArg(namespace),
            new client_message_broker_1.FnArg(node, 2 /* RENDER_STORE_OBJECT */),
        ]);
        return node;
    };
    WebWorkerRenderer2.prototype.createComment = function (value) {
        var node = this._rendererFactory.allocateNode();
        this.callUIWithRenderer('createComment', [
            new client_message_broker_1.FnArg(value),
            new client_message_broker_1.FnArg(node, 2 /* RENDER_STORE_OBJECT */),
        ]);
        return node;
    };
    WebWorkerRenderer2.prototype.createText = function (value) {
        var node = this._rendererFactory.allocateNode();
        this.callUIWithRenderer('createText', [
            new client_message_broker_1.FnArg(value),
            new client_message_broker_1.FnArg(node, 2 /* RENDER_STORE_OBJECT */),
        ]);
        return node;
    };
    WebWorkerRenderer2.prototype.appendChild = function (parent, newChild) {
        this.callUIWithRenderer('appendChild', [
            new client_message_broker_1.FnArg(parent, 2 /* RENDER_STORE_OBJECT */),
            new client_message_broker_1.FnArg(newChild, 2 /* RENDER_STORE_OBJECT */),
        ]);
    };
    WebWorkerRenderer2.prototype.insertBefore = function (parent, newChild, refChild) {
        if (!parent) {
            return;
        }
        this.callUIWithRenderer('insertBefore', [
            new client_message_broker_1.FnArg(parent, 2 /* RENDER_STORE_OBJECT */),
            new client_message_broker_1.FnArg(newChild, 2 /* RENDER_STORE_OBJECT */),
            new client_message_broker_1.FnArg(refChild, 2 /* RENDER_STORE_OBJECT */),
        ]);
    };
    WebWorkerRenderer2.prototype.removeChild = function (parent, oldChild) {
        this.callUIWithRenderer('removeChild', [
            new client_message_broker_1.FnArg(parent, 2 /* RENDER_STORE_OBJECT */),
            new client_message_broker_1.FnArg(oldChild, 2 /* RENDER_STORE_OBJECT */),
        ]);
    };
    WebWorkerRenderer2.prototype.selectRootElement = function (selectorOrNode) {
        var node = this._rendererFactory.allocateNode();
        this.callUIWithRenderer('selectRootElement', [
            new client_message_broker_1.FnArg(selectorOrNode),
            new client_message_broker_1.FnArg(node, 2 /* RENDER_STORE_OBJECT */),
        ]);
        return node;
    };
    WebWorkerRenderer2.prototype.parentNode = function (node) {
        var res = this._rendererFactory.allocateNode();
        this.callUIWithRenderer('parentNode', [
            new client_message_broker_1.FnArg(node, 2 /* RENDER_STORE_OBJECT */),
            new client_message_broker_1.FnArg(res, 2 /* RENDER_STORE_OBJECT */),
        ]);
        return res;
    };
    WebWorkerRenderer2.prototype.nextSibling = function (node) {
        var res = this._rendererFactory.allocateNode();
        this.callUIWithRenderer('nextSibling', [
            new client_message_broker_1.FnArg(node, 2 /* RENDER_STORE_OBJECT */),
            new client_message_broker_1.FnArg(res, 2 /* RENDER_STORE_OBJECT */),
        ]);
        return res;
    };
    WebWorkerRenderer2.prototype.setAttribute = function (el, name, value, namespace) {
        this.callUIWithRenderer('setAttribute', [
            new client_message_broker_1.FnArg(el, 2 /* RENDER_STORE_OBJECT */),
            new client_message_broker_1.FnArg(name),
            new client_message_broker_1.FnArg(value),
            new client_message_broker_1.FnArg(namespace),
        ]);
    };
    WebWorkerRenderer2.prototype.removeAttribute = function (el, name, namespace) {
        this.callUIWithRenderer('removeAttribute', [
            new client_message_broker_1.FnArg(el, 2 /* RENDER_STORE_OBJECT */),
            new client_message_broker_1.FnArg(name),
            new client_message_broker_1.FnArg(namespace),
        ]);
    };
    WebWorkerRenderer2.prototype.addClass = function (el, name) {
        this.callUIWithRenderer('addClass', [
            new client_message_broker_1.FnArg(el, 2 /* RENDER_STORE_OBJECT */),
            new client_message_broker_1.FnArg(name),
        ]);
    };
    WebWorkerRenderer2.prototype.removeClass = function (el, name) {
        this.callUIWithRenderer('removeClass', [
            new client_message_broker_1.FnArg(el, 2 /* RENDER_STORE_OBJECT */),
            new client_message_broker_1.FnArg(name),
        ]);
    };
    WebWorkerRenderer2.prototype.setStyle = function (el, style, value, flags) {
        this.callUIWithRenderer('setStyle', [
            new client_message_broker_1.FnArg(el, 2 /* RENDER_STORE_OBJECT */),
            new client_message_broker_1.FnArg(style),
            new client_message_broker_1.FnArg(value),
            new client_message_broker_1.FnArg(flags),
        ]);
    };
    WebWorkerRenderer2.prototype.removeStyle = function (el, style, flags) {
        this.callUIWithRenderer('removeStyle', [
            new client_message_broker_1.FnArg(el, 2 /* RENDER_STORE_OBJECT */),
            new client_message_broker_1.FnArg(style),
            new client_message_broker_1.FnArg(flags),
        ]);
    };
    WebWorkerRenderer2.prototype.setProperty = function (el, name, value) {
        this.callUIWithRenderer('setProperty', [
            new client_message_broker_1.FnArg(el, 2 /* RENDER_STORE_OBJECT */),
            new client_message_broker_1.FnArg(name),
            new client_message_broker_1.FnArg(value),
        ]);
    };
    WebWorkerRenderer2.prototype.setValue = function (node, value) {
        this.callUIWithRenderer('setValue', [
            new client_message_broker_1.FnArg(node, 2 /* RENDER_STORE_OBJECT */),
            new client_message_broker_1.FnArg(value),
        ]);
    };
    WebWorkerRenderer2.prototype.listen = function (target, eventName, listener) {
        var _this = this;
        var unlistenId = this._rendererFactory.allocateId();
        var _a = typeof target === 'string' ? [null, target, target + ":" + eventName] :
            [target, null, null], targetEl = _a[0], targetName = _a[1], fullName = _a[2];
        if (fullName) {
            this._rendererFactory.globalEvents.listen(fullName, listener);
        }
        else {
            targetEl.events.listen(eventName, listener);
        }
        this.callUIWithRenderer('listen', [
            new client_message_broker_1.FnArg(targetEl, 2 /* RENDER_STORE_OBJECT */),
            new client_message_broker_1.FnArg(targetName),
            new client_message_broker_1.FnArg(eventName),
            new client_message_broker_1.FnArg(unlistenId),
        ]);
        return function () {
            if (fullName) {
                _this._rendererFactory.globalEvents.unlisten(fullName, listener);
            }
            else {
                targetEl.events.unlisten(eventName, listener);
            }
            _this.callUIWithRenderer('unlisten', [new client_message_broker_1.FnArg(unlistenId)]);
        };
    };
    WebWorkerRenderer2.prototype.callUIWithRenderer = function (fnName, fnArgs) {
        if (fnArgs === void 0) { fnArgs = []; }
        // always pass the renderer as the first arg
        this._rendererFactory.callUI(fnName, [this.asFnArg].concat(fnArgs));
    };
    return WebWorkerRenderer2;
}());
exports.WebWorkerRenderer2 = WebWorkerRenderer2;
var WebWorkerRenderNode = /** @class */ (function () {
    function WebWorkerRenderNode() {
        this.events = new NamedEventEmitter();
    }
    return WebWorkerRenderNode;
}());
exports.WebWorkerRenderNode = WebWorkerRenderNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS13ZWJ3b3JrZXIvc3JjL3dlYl93b3JrZXJzL3dvcmtlci9yZW5kZXJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUEwRztBQUUxRyx5RUFBb0g7QUFDcEgscURBQWlEO0FBQ2pELHlEQUE0RTtBQUM1RSx1REFBbUQ7QUFDbkQsbURBQWlFO0FBRWpFO0lBQUE7SUFnQ0EsQ0FBQztJQTVCQyxrQ0FBTSxHQUFOLFVBQU8sU0FBaUIsRUFBRSxRQUFrQixJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUvRixvQ0FBUSxHQUFSLFVBQVMsU0FBaUIsRUFBRSxRQUFrQjtRQUM1QyxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hELElBQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDMUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDZCxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztTQUM1QjtJQUNILENBQUM7SUFFRCx5Q0FBYSxHQUFiLFVBQWMsU0FBaUIsRUFBRSxLQUFVO1FBQ3pDLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDekMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQztJ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