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
var ng_zone_1 = require("@angular/core/src/zone/ng_zone");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var dom_events_1 = require("@angular/platform-browser/src/dom/events/dom_events");
var event_manager_1 = require("@angular/platform-browser/src/dom/events/event_manager");
var browser_util_1 = require("../../../testing/src/browser_util");
(function () {
    if (isNode)
        return;
    var domEventPlugin;
    var doc;
    var zone;
    testing_internal_1.describe('EventManager', function () {
        testing_internal_1.beforeEach(function () {
            doc = dom_adapter_1.getDOM().supportsDOMEvents() ? document : dom_adapter_1.getDOM().createHtmlDocument();
            zone = new ng_zone_1.NgZone({});
            domEventPlugin = new dom_events_1.DomEventsPlugin(doc, zone, null);
        });
        testing_internal_1.it('should delegate event bindings to plugins that are passed in from the most generic one to the most specific one', function () {
            var element = browser_util_1.el('<div></div>');
            var handler = function (e /** TODO #9100 */) { return e; };
            var plugin = new FakeEventManagerPlugin(doc, ['click']);
            var manager = new event_manager_1.EventManager([domEventPlugin, plugin], new FakeNgZone());
            manager.addEventListener(element, 'click', handler);
            testing_internal_1.expect(plugin.eventHandler['click']).toBe(handler);
        });
        testing_internal_1.it('should delegate event bindings to the first plugin supporting the event', function () {
            var element = browser_util_1.el('<div></div>');
            var clickHandler = function (e /** TODO #9100 */) { return e; };
            var dblClickHandler = function (e /** TODO #9100 */) { return e; };
            var plugin1 = new FakeEventManagerPlugin(doc, ['dblclick']);
            var plugin2 = new FakeEventManagerPlugin(doc, ['click', 'dblclick']);
            var manager = new event_manager_1.EventManager([plugin2, plugin1], new FakeNgZone());
            manager.addEventListener(element, 'click', clickHandler);
            manager.addEventListener(element, 'dblclick', dblClickHandler);
            testing_internal_1.expect(plugin2.eventHandler['click']).toBe(clickHandler);
            testing_internal_1.expect(plugin1.eventHandler['dblclick']).toBe(dblClickHandler);
        });
        testing_internal_1.it('should throw when no plugin can handle the event', function () {
            var element = browser_util_1.el('<div></div>');
            var plugin = new FakeEventManagerPlugin(doc, ['dblclick']);
            var manager = new event_manager_1.EventManager([plugin], new FakeNgZone());
            testing_internal_1.expect(function () { return manager.addEventListener(element, 'click', null); })
                .toThrowError('No event manager plugin found for event click');
        });
        testing_internal_1.it('events are caught when fired from a child', function () {
            var element = browser_util_1.el('<div><div></div></div>');
            // Workaround for https://bugs.webkit.org/show_bug.cgi?id=122755
            dom_adapter_1.getDOM().appendChild(doc.body, element);
            var child = dom_adapter_1.getDOM().firstChild(element);
            var dispatchedEvent = dom_adapter_1.getDOM().createMouseEvent('click');
            var receivedEvent = null;
            var handler = function (e /** TODO #9100 */) { receivedEvent = e; };
            var manager = new event_manager_1.EventManager([domEventPlugin], new FakeNgZone());
            manager.addEventListener(element, 'click', handler);
            dom_adapter_1.getDOM().dispatchEvent(child, dispatchedEvent);
            testing_internal_1.expect(receivedEvent).toBe(dispatchedEvent);
        });
        testing_internal_1.it('should add and remove global event listeners', function () {
            var element = browser_util_1.el('<div><div></div></div>');
            dom_adapter_1.getDOM().appendChild(doc.body, element);
            var dispatchedEvent = dom_adapter_1.getDOM().createMouseEvent('click');
            var receivedEvent = null;
            var handler = function (e /** TODO #9100 */) { receivedEvent = e; };
            var manager = new event_manager_1.EventManager([domEventPlugin], new FakeNgZone());
            var remover = manager.addGlobalEventListener('document', 'click', handler);
            dom_adapter_1.getDOM().dispatchEvent(element, dispatchedEvent);
            testing_internal_1.expect(receivedEvent).toBe(dispatchedEvent);
            receivedEvent = null;
            remover();
            dom_adapter_1.getDOM().dispatchEvent(element, dispatchedEvent);
            testing_internal_1.expect(receivedEvent).toBe(null);
        });
        testing_internal_1.it('should keep zone when addEventListener', function () {
            var Zone = window['Zone'];
            var element = browser_util_1.el('<div><div></div></div>');
            dom_adapter_1.getDOM().appendChild(doc.body, element);
            var dispatchedEvent = dom_adapter_1.getDOM().createMouseEvent('click');
            var receivedEvent = null;
            var receivedZone = null;
            var handler = function (e /** TODO #9100 */) {
                receivedEvent = e;
                receivedZone = Zone.current;
            };
            var manager = new event_manager_1.EventManager([domEventPlugin], new FakeNgZone());
            var remover = null;
            Zone.root.run(function () { remover = manager.addEventListener(element, 'click', handler); });
            dom_adapter_1.getDOM().dispatchEvent(element, dispatchedEvent);
            testing_internal_1.expect(receivedEvent).toBe(dispatchedEvent);
            testing_internal_1.expect(receivedZone.name).toBe(Zone.root.name);
            receivedEvent = null;
            remover && remover();
            dom_adapter_1.getDOM().dispatchEvent(element, dispatchedEvent);
            testing_internal_1.expect(receivedEvent).toBe(null);
        });
        testing_internal_1.it('should keep zone when addEventListener multiple times', function () {
            var Zone = window['Zone'];
            var element = browser_util_1.el('<div><div></div></div>');
            dom_adapter_1.getDOM().appendChild(doc.body, element);
            var dispatchedEvent = dom_adapter_1.getDOM().createMouseEvent('click');
            var receivedEvents = [];
            var receivedZones = [];
            var handler1 = function (e /** TODO #9100 */) {
                receivedEvents.push(e);
                receivedZones.push(Zone.current.name);
            };
            var handler2 = function (e /** TODO #9100 */) {
                receivedEvents.push(e);
                receivedZones.push(Zone.current.name);
            };
            var manager = new event_manager_1.EventManager([domEventPlugin], new FakeNgZone());
            var remover1 = null;
            var remover2 = null;
            Zone.root.run(function () { remover1 = manager.addEventListener(element, 'click', handler1); });
            Zone.root.fork({ name: 'test' }).run(function () {
                remover2 = manager.addEventListener(element, 'click', handler2);
            });
            dom_adapter_1.getDOM().dispatchEvent(element, dispatchedEvent);
            testing_internal_1.expect(receivedEvents).toEqual([dispatchedEvent, dispatchedEvent]);
            testing_internal_1.expect(receivedZones).toEqual([Zone.root.name, 'test']);
            receivedEvents = [];
            remover1 && remover1();
            remover2 && remover2();
            dom_adapter_1.getDOM().dispatchEvent(element, dispatchedEvent);
            testing_internal_1.expect(receivedEvents).toEqual([]);
        });
        testing_internal_1.it('should support event.stopImmediatePropagation', function () {
            var Zone = window['Zone'];
            var element = browser_util_1.el('<div><div></div></div>');
            dom_adapter_1.getDOM().appendChild(doc.body, element);
            var dispatchedEvent = dom_adapter_1.getDOM().createMouseEvent('click');
            var receivedEvents = [];
            var receivedZones = [];
            var handler1 = function (e /** TODO #9100 */) {
                receivedEvents.push(e);
                receivedZones.push(Zone.current.name);
                e.stopImmediatePropagation();
            };
            var handler2 = function (e /** TODO #9100 */) {
                receivedEvents.push(e);
                receivedZones.push(Zone.current.name);
            };
            var manager = new event_manager_1.EventManager([domEventPlugin], new FakeNgZone());
            var remover1 = null;
            var remover2 = null;
            Zone.root.run(function () { remover1 = manager.addEventListener(element, 'click', handler1); });
            Zone.root.fork({ name: 'test' }).run(function () {
                remover2 = manager.addEventListener(element, 'click', handler2);
            });
            dom_adapter_1.getDOM().dispatchEvent(element, dispatchedEvent);
            testing_internal_1.expect(receivedEvents).toEqual([dispatchedEvent]);
            testing_internal_1.expect(receivedZones).toEqual([Zone.root.name]);
            receivedEvents = [];
            remover1 && remover1();
            remover2 && remover2();
            dom_adapter_1.getDOM().dispatchEvent(element, dispatchedEvent);
            testing_internal_1.expect(receivedEvents).toEqual([]);
        });
        testing_internal_1.it('should handle event correctly when one handler remove itself ', function () {
            var Zone = window['Zone'];
            var element = browser_util_1.el('<div><div></div></div>');
            dom_adapter_1.getDOM().appendChild(doc.body, element);
            var dispatchedEvent = dom_adapter_1.getDOM().createMouseEvent('click');
            var receivedEvents = [];
            var receivedZones = [];
            var remover1 = null;
            var remover2 = null;
            var handler1 = function (e /** TODO #9100 */) {
                receivedEvents.push(e);
                receivedZones.push(Zone.current.name);
                remover1 && remover1();
            };
            var handler2 = function (e /** TODO #9100 */) {
                receivedEvents.push(e);
                receivedZones.push(Zone.current.name);
            };
            var manager = new event_manager_1.EventManager([domEventPlugin], new FakeNgZone());
            Zone.root.run(function () { remover1 = manager.addEventListener(element, 'click', handler1); });
            Zone.root.fork({ name: 'test' }).run(function () {
                remover2 = manager.addEventListener(element, 'click', handler2);
            });
            dom_adapter_1.getDOM().dispatchEvent(element, dispatchedEvent);
            testing_internal_1.expect(receivedEvents).toEqual([dispatchedEvent, dispatchedEvent]);
            testing_internal_1.expect(receivedZones).toEqual([Zone.root.name, 'test']);
            receivedEvents = [];
            remover1 && remover1();
            remover2 && remover2();
            dom_adapter_1.getDOM().dispatchEvent(element, dispatchedEvent);
            testing_internal_1.expect(receivedEvents).toEqual([]);
        });
        testing_internal_1.it('should only add same callback once when addEventListener', function () {
            var Zone = window['Zone'];
            var element = browser_util_1.el('<div><div></div></div>');
            dom_adapter_1.getDOM().appendChild(doc.body, element);
            var dispatchedEvent = dom_adapter_1.getDOM().createMouseEvent('click');
            var receivedEvents = [];
            var receivedZones = [];
            var handler = function (e /** TODO #9100 */) {
                receivedEvents.push(e);
                receivedZones.push(Zone.current.name);
            };
            var manager = new event_manager_1.EventManager([domEventPlugin], new FakeNgZone());
            var remover1 = null;
            var remover2 = null;
            Zone.root.run(function () { remover1 = manager.addEventListener(element, 'click', handler); });
            Zone.root.fork({ name: 'test' }).run(function () {
                remover2 = manager.addEventListener(element, 'click', handler);
            });
            dom_adapter_1.getDOM().dispatchEvent(element, dispatchedEvent);
            testing_internal_1.expect(receivedEvents).toEqual([dispatchedEvent]);
            testing_internal_1.expect(receivedZones).toEqual([Zone.root.name]);
            receivedEvents = [];
            remover1 && remover1();
            remover2 && remover2();
            dom_adapter_1.getDOM().dispatchEvent(element, dispatchedEvent);
            testing_internal_1.expect(receivedEvents).toEqual([]);
        });
        testing_internal_1.it('should be able to remove event listener which was added inside of ngZone', function () {
            var Zone = window['Zone'];
            var element = browser_util_1.el('<div><div></div></div>');
            dom_adapter_1.getDOM().appendChild(doc.body, element);
            var dispatchedEvent = dom_adapter_1.getDOM().createMouseEvent('click');
            var receivedEvents = [];
            var receivedZones = [];
            var handler1 = function (e /** TODO #9100 */) {
                receivedEvents.push(e);
                receivedZones.push(Zone.current.name);
            };
            var handler2 = function (e /** TODO #9100 */) {
                receivedEvents.push(e);
                receivedZones.push(Zone.current.name);
            };
            var manager = new event_manager_1.EventManager([domEventPlugin], new FakeNgZone());
            var remover1 = null;
            var remover2 = null;
            // handler1 is added in root zone
            Zone.root.run(function () { remover1 = manager.addEventListener(element, 'click', handler1); });
            // handler2 is added in 'angular' zone
            Zone.root.fork({ name: 'fakeAngularZone', properties: { isAngularZone: true } }).run(function () {
                remover2 = manager.addEventListener(element, 'click', handler2);
            });
            dom_adapter_1.getDOM().dispatchEvent(element, dispatchedEvent);
            testing_internal_1.expect(receivedEvents).toEqual([dispatchedEvent, dispatchedEvent]);
            testing_internal_1.expect(receivedZones).toEqual([Zone.root.name, 'fakeAngularZone']);
            receivedEvents = [];
            remover1 && remover1();
            remover2 && remover2();
            dom_adapter_1.getDOM().dispatchEvent(element, dispatchedEvent);
            // handler1 and handler2 are added in different zone
            // one is angular zone, the other is not
            // should still be able to remove them correctly
            testing_internal_1.expect(receivedEvents).toEqual([]);
        });
        testing_internal_1.it('should run blackListedEvents handler outside of ngZone', function () {
            var Zone = window['Zone'];
            var element = browser_util_1.el('<div><div></div></div>');
            dom_adapter_1.getDOM().appendChild(doc.body, element);
            var dispatchedEvent = dom_adapter_1.getDOM().createMouseEvent('scroll');
            var receivedEvent = null;
            var receivedZone = null;
            var handler = function (e /** TODO #9100 */) {
                receivedEvent = e;
                receivedZone = Zone.current;
            };
            var manager = new event_manager_1.EventManager([domEventPlugin], new FakeNgZone());
            var remover = manager.addEventListener(element, 'scroll', handler);
            dom_adapter_1.getDOM().dispatchEvent(element, dispatchedEvent);
            testing_internal_1.expect(receivedEvent).toBe(dispatchedEvent);
            testing_internal_1.expect(receivedZone.name).toBe(Zone.root.name);
            receivedEvent = null;
            remover && remover();
            dom_adapter_1.getDOM().dispatchEvent(element, dispatchedEvent);
            testing_internal_1.expect(receivedEvent).toBe(null);
        });
    });
})();
/** @internal */
var FakeEventManagerPlugin = /** @class */ (function (_super) {
    __extends(FakeEventManagerPlugin, _super);
    function FakeEventManagerPlugin(doc, supportedEvents) {
        var _this = _super.call(this, doc) || this;
        _this.supportedEvents = supportedEvents;
        _this.eventHandler = {};
        return _this;
    }
    FakeEventManagerPlugin.prototype.supports = function (eventName) { return this.supportedEvents.indexOf(eventName) > -1; };
    FakeEventManagerPlugin.prototype.addEventListener = function (element, eventName, handler) {
        var _this = this;
        this.eventHandler[eventName] = handler;
        return function () { delete (_this.eventHandler[eventName]); };
    };
    return FakeEventManagerPlugin;
}(event_manager_1.EventManagerPlugin));
var FakeNgZone = /** @class */ (function (_super) {
    __extends(FakeNgZone, _super);
    function FakeNgZone() {
        return _super.call(this, { enableLongStackTrace: false }) || this;
    }
    FakeNgZone.prototype.run = function (fn, applyThis, applyArgs) { return fn(); };
    FakeNgZone.prototype.runOutsideAngular = function (fn) { return fn(); };
    return FakeNgZone;
}(ng_zone_1.NgZone));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRfbWFuYWdlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci90ZXN0L2RvbS9ldmVudHMvZXZlbnRfbWFuYWdlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILDBEQUFzRDtBQUN0RCwrRUFBNEY7QUFDNUYsNkVBQXFFO0FBQ3JFLGtGQUFvRjtBQUNwRix3RkFBd0c7QUFDeEcsa0VBQXFEO0FBRXJELENBQUM7SUFDQyxJQUFJLE1BQU07UUFBRSxPQUFPO0lBQ25CLElBQUksY0FBK0IsQ0FBQztJQUNwQyxJQUFJLEdBQVEsQ0FBQztJQUNiLElBQUksSUFBWSxDQUFDO0lBRWpCLDJCQUFRLENBQUMsY0FBYyxFQUFFO1FBRXZCLDZCQUFVLENBQUM7WUFDVCxHQUFHLEdBQUcsb0JBQU0sRUFBRSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsb0JBQU0sRUFBRSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDOUUsSUFBSSxHQUFHLElBQUksZ0JBQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0QixjQUFjLEdBQUcsSUFBSSw0QkFBZSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxxQkFBRSxDQUFDLGlIQUFpSCxFQUNqSDtZQUNFLElBQU0sT0FBTyxHQUFHLGlCQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDbEMsSUFBTSxPQUFPLEdBQUcsVUFBQyxDQUFNLENBQUMsaUJBQWlCLElBQUssT0FBQSxDQUFDLEVBQUQsQ0FBQyxDQUFDO1lBQ2hELElBQU0sTUFBTSxHQUFHLElBQUksc0JBQXNCLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUMx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