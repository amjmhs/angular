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
var message_bus_1 = require("../shared/message_bus");
var messaging_api_1 = require("../shared/messaging_api");
var render_store_1 = require("../shared/render_store");
var serializer_1 = require("../shared/serializer");
var service_message_broker_1 = require("../shared/service_message_broker");
var event_dispatcher_1 = require("../ui/event_dispatcher");
var MessageBasedRenderer2 = /** @class */ (function () {
    function MessageBasedRenderer2(_brokerFactory, _bus, _serializer, _renderStore, _rendererFactory) {
        this._brokerFactory = _brokerFactory;
        this._bus = _bus;
        this._serializer = _serializer;
        this._renderStore = _renderStore;
        this._rendererFactory = _rendererFactory;
    }
    MessageBasedRenderer2.prototype.start = function () {
        var _this = this;
        var broker = this._brokerFactory.createMessageBroker(messaging_api_1.RENDERER_2_CHANNEL);
        this._bus.initChannel(messaging_api_1.EVENT_2_CHANNEL);
        this._eventDispatcher = new event_dispatcher_1.EventDispatcher(this._bus.to(messaging_api_1.EVENT_2_CHANNEL), this._serializer);
        var _a = [
            2 /* RENDER_STORE_OBJECT */,
            1 /* PRIMITIVE */,
            0 /* RENDERER_TYPE_2 */,
        ], RSO = _a[0], P = _a[1], CRT = _a[2];
        var methods = [
            ['createRenderer', this.createRenderer, RSO, CRT, P],
            ['createElement', this.createElement, RSO, P, P, P],
            ['createComment', this.createComment, RSO, P, P], ['createText', this.createText, RSO, P, P],
            ['appendChild', this.appendChild, RSO, RSO, RSO],
            ['insertBefore', this.insertBefore, RSO, RSO, RSO, RSO],
            ['removeChild', this.removeChild, RSO, RSO, RSO],
            ['selectRootElement', this.selectRootElement, RSO, P, P],
            ['parentNode', this.parentNode, RSO, RSO, P], ['nextSibling', this.nextSibling, RSO, RSO, P],
            ['setAttribute', this.setAttribute, RSO, RSO, P, P, P],
            ['removeAttribute', this.removeAttribute, RSO, RSO, P, P],
            ['addClass', this.addClass, RSO, RSO, P], ['removeClass', this.removeClass, RSO, RSO, P],
            ['setStyle', this.setStyle, RSO, RSO, P, P, P],
            ['removeStyle', this.removeStyle, RSO, RSO, P, P],
            ['setProperty', this.setProperty, RSO, RSO, P, P], ['setValue', this.setValue, RSO, RSO, P],
            ['listen', this.listen, RSO, RSO, P, P, P], ['unlisten', this.unlisten, RSO, RSO],
            ['destroy', this.destroy, RSO], ['destroyNode', this.destroyNode, RSO, P]
        ];
        methods.forEach(function (_a) {
            var name = _a[0], method = _a[1], argTypes = _a.slice(2);
            broker.registerMethod(name, argTypes, method.bind(_this));
        });
    };
    MessageBasedRenderer2.prototype.destroy = function (r) { r.destroy(); };
    MessageBasedRenderer2.prototype.destroyNode = function (r, node) {
        if (r.destroyNode) {
            r.destroyNode(node);
        }
        this._renderStore.remove(node);
    };
    MessageBasedRenderer2.prototype.createRenderer = function (el, type, id) {
        this._renderStore.store(this._rendererFactory.createRenderer(el, type), id);
    };
    MessageBasedRenderer2.prototype.createElement = function (r, name, namespace, id) {
        this._renderStore.store(r.createElement(name, namespace), id);
    };
    MessageBasedRenderer2.prototype.createComment = function (r, value, id) {
        this._renderStore.store(r.createComment(value), id);
    };
    MessageBasedRenderer2.prototype.createText = function (r, value, id) {
        this._renderStore.store(r.createText(value), id);
    };
    MessageBasedRenderer2.prototype.appendChild = function (r, parent, child) { r.appendChild(parent, child); };
    MessageBasedRenderer2.prototype.insertBefore = function (r, parent, child, ref) {
        r.insertBefore(parent, child, ref);
    };
    MessageBasedRenderer2.prototype.removeChild = function (r, parent, child) { r.removeChild(parent, child); };
    MessageBasedRenderer2.prototype.selectRootElement = function (r, selector, id) {
        this._renderStore.store(r.selectRootElement(selector), id);
    };
    MessageBasedRenderer2.prototype.parentNode = function (r, node, id) {
        this._renderStore.store(r.parentNode(node), id);
    };
    MessageBasedRenderer2.prototype.nextSibling = function (r, node, id) {
        this._renderStore.store(r.nextSibling(node), id);
    };
    MessageBasedRenderer2.prototype.setAttribute = function (r, el, name, value, namespace) {
        r.setAttribute(el, name, value, namespace);
    };
    MessageBasedRenderer2.prototype.removeAttribute = function (r, el, name, namespace) {
        r.removeAttribute(el, name, namespace);
    };
    MessageBasedRenderer2.prototype.addClass = function (r, el, name) { r.addClass(el, name); };
    MessageBasedRenderer2.prototype.removeClass = function (r, el, name) { r.removeClass(el, name); };
    MessageBasedRenderer2.prototype.setStyle = function (r, el, style, value, flags) {
        r.setStyle(el, style, value, flags);
    };
    MessageBasedRenderer2.prototype.removeStyle = function (r, el, style, flags) {
        r.removeStyle(el, style, flags);
    };
    MessageBasedRenderer2.prototype.setProperty = function (r, el, name, value) {
        r.setProperty(el, name, value);
    };
    MessageBasedRenderer2.prototype.setValue = function (r, node, value) { r.setValue(node, value); };
    MessageBasedRenderer2.prototype.listen = function (r, el, elName, eventName, unlistenId) {
        var _this = this;
        var listener = function (event) {
            return _this._eventDispatcher.dispatchRenderEvent(el, elName, eventName, event);
        };
        var unlisten = r.listen(el || elName, eventName, listener);
        this._renderStore.store(unlisten, unlistenId);
    };
    MessageBasedRenderer2.prototype.unlisten = function (r, unlisten) { unlisten(); };
    MessageBasedRenderer2 = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [service_message_broker_1.ServiceMessageBrokerFactory, message_bus_1.MessageBus,
            serializer_1.Serializer, render_store_1.RenderStore,
            core_1.RendererFactory2])
    ], MessageBasedRenderer2);
    return MessageBasedRenderer2;
}());
exports.MessageBasedRenderer2 = MessageBasedRenderer2;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS13ZWJ3b3JrZXIvc3JjL3dlYl93b3JrZXJzL3VpL3JlbmRlcmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQTBHO0FBRTFHLHFEQUFpRDtBQUNqRCx5REFBNEU7QUFDNUUsdURBQW1EO0FBQ25ELG1EQUFpRTtBQUNqRSwyRUFBbUc7QUFDbkcsMkRBQXVEO0FBR3ZEO0lBSUUsK0JBQ1ksY0FBMkMsRUFBVSxJQUFnQixFQUNyRSxXQUF1QixFQUFVLFlBQXlCLEVBQzFELGdCQUFrQztRQUZsQyxtQkFBYyxHQUFkLGNBQWMsQ0FBNkI7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ3JFLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBQVUsaUJBQVksR0FBWixZQUFZLENBQWE7UUFDMUQscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtJQUFHLENBQUM7SUFFbEQscUNBQUssR0FBTDtRQUFBLGlCQW1DQztRQWxDQyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLGtDQUFrQixDQUFDLENBQUM7UUFFM0UsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsK0JBQWUsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLGtDQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsK0JBQWUsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUV2RixJQUFBOzs7O1NBSUwsRUFKTSxXQUFHLEVBQUUsU0FBQyxFQUFFLFdBQUcsQ0FJaEI7UUFFRixJQUFNLE9BQU8sR0FBWTtZQUN2QixDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDcEQsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbkQsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDNUYsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUNoRCxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUN2RCxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQ2hELENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3hELENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQzVGLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0RCxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3pELENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFF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