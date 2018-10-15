"use strict";
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
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var domino = require('domino');
var platform_browser_1 = require("@angular/platform-browser");
function _notImplemented(methodName) {
    return new Error('This method is not implemented in DominoAdapter: ' + methodName);
}
function setDomTypes() {
    // Make all Domino types available as types in the global env.
    Object.assign(global, domino.impl);
    global['KeyboardEvent'] = domino.impl.Event;
}
/**
 * Parses a document string to a Document object.
 */
function parseDocument(html, url) {
    if (url === void 0) { url = '/'; }
    var window = domino.createWindow(html, url);
    var doc = window.document;
    return doc;
}
exports.parseDocument = parseDocument;
/**
 * Serializes a document to string.
 */
function serializeDocument(doc) {
    return doc.serialize();
}
exports.serializeDocument = serializeDocument;
/**
 * DOM Adapter for the server platform based on https://github.com/fgnass/domino.
 */
var DominoAdapter = /** @class */ (function (_super) {
    __extends(DominoAdapter, _super);
    function DominoAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DominoAdapter.makeCurrent = function () {
        setDomTypes();
        platform_browser_1.ɵsetRootDomAdapter(new DominoAdapter());
    };
    DominoAdapter.prototype.logError = function (error) { console.error(error); };
    DominoAdapter.prototype.log = function (error) {
        // tslint:disable-next-line:no-console
        console.log(error);
    };
    DominoAdapter.prototype.logGroup = function (error) { console.error(error); };
    DominoAdapter.prototype.logGroupEnd = function () { };
    DominoAdapter.prototype.supportsDOMEvents = function () { return false; };
    DominoAdapter.prototype.supportsNativeShadowDOM = function () { return false; };
    DominoAdapter.prototype.contains = function (nodeA, nodeB) {
        var inner = nodeB;
        while (inner) {
            if (inner === nodeA)
                return true;
            inner = inner.parent;
        }
        return false;
    };
    DominoAdapter.prototype.createHtmlDocument = function () {
        return parseDocument('<html><head><title>fakeTitle</title></head><body></body></html>');
    };
    DominoAdapter.prototype.getDefaultDocument = function () {
        if (!DominoAdapter.defaultDoc) {
            DominoAdapter.defaultDoc = domino.createDocument();
        }
        return DominoAdapter.defaultDoc;
    };
    DominoAdapter.prototype.createShadowRoot = function (el, doc) {
        if (doc === void 0) { doc = document; }
        el.shadowRoot = doc.createDocumentFragment();
        el.shadowRoot.parent = el;
        return el.shadowRoot;
    };
    DominoAdapter.prototype.getShadowRoot = function (el) { return el.shadowRoot; };
    DominoAdapter.prototype.isTextNode = function (node) { return node.nodeType === DominoAdapter.defaultDoc.TEXT_NODE; };
    DominoAdapter.prototype.isCommentNode = function (node) {
        return node.nodeType === DominoAdapter.defaultDoc.COMMENT_NODE;
    };
    DominoAdapter.prototype.isElementNode = function (node) {
        return node ? node.nodeType === DominoAdapter.defaultDoc.ELEMENT_NODE : false;
    };
    DominoAdapter.prototype.hasShadowRoot = function (node) { return node.shadowRoot != null; };
    DominoAdapter.prototype.isShadowRoot = function (node) { return this.getShadowRoot(node) == node; };
    DominoAdapter.prototype.getProperty = function (el, name) {
        if (name === 'href') {
            // Domino tries tp resolve href-s which we do not want. Just return the
            // attribute value.
            return this.getAttribute(el, 'href');
        }
        else if (name === 'innerText') {
            // Domino does not support innerText. Just map it to textContent.
            return el.textContent;
        }
        return el[name];
    };
    DominoAdapter.prototype.setProperty = function (el, name, value) {
        if (name === 'href') {
            // Even though the server renderer reflects any properties to attributes
            // map 'href' to attribute just to handle when setProperty is directly called.
            this.setAttribute(el, 'href', value);
        }
        else if (name === 'innerText') {
            // Domino does not support innerText. Just map it to textContent.
            el.textContent = value;
        }
        el[name] = value;
    };
    DominoAdapter.prototype.getGlobalEventTarget = function (doc, target) {
        if (target === 'window') {
            return doc.defaultView;
        }
        if (target === 'document') {
            return doc;
        }
        if (target === 'body') {
            return doc.body;
        }
        return null;
    };
    DominoAdapter.prototype.getBaseHref = function (doc) {
        var base = this.querySelector(doc.documentElement, 'base');
        var href = '';
        if (base) {
            href = this.getHref(base);
        }
        // TODO(alxhub): Need relative path logic from BrowserDomAdapter here?
        return href;
    };
    /** @internal */
    DominoAdapter.prototype._readStyleAttribute = function (element) {
        var styleMap = {};
        var styleAttribute = element.getAttribute('style');
        if (styleAttribute) {
            var styleList = styleAttribute.split(/;+/g);
            for (var i = 0; i < styleList.length; i++) {
                var style = styleList[i].trim();
                if (style.length > 0) {
                    var colonIndex = style.indexOf(':');
                    if (colonIndex === -1) {
                        throw new Error("Invalid CSS style: " + style);
                    }
                    var name_1 = style.substr(0, colonIndex).trim();
                    styleMap[name_1] = style.substr(colonIndex + 1).trim();
                }
            }
        }
        return styleMap;
    };
    /** @internal */
    DominoAdapter.prototype._writeStyleAttribute = function (element, styleMap) {
        var styleAttrValue = '';
        for (var key in styleMap) {
            var newValue = styleMap[key];
            if (newValue) {
                styleAttrValue += key + ':' + styleMap[key] + ';';
            }
        }
        element.setAttribute('style', styleAttrValue);
    };
    DominoAdapter.prototype.setStyle = function (element, styleName, styleValue) {
        styleName = styleName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        var styleMap = this._readStyleAttribute(element);
        styleMap[styleName] = styleValue || '';
        this._writeStyleAttribute(element, styleMap);
    };
    DominoAdapter.prototype.removeStyle = function (element, styleName) {
        // IE requires '' instead of null
        // see https://github.com/angular/angular/issues/7916
        this.setStyle(element, styleName, '');
    };
    DominoAdapter.prototype.getStyle = function (element, styleName) {
        var styleMap = this._readStyleAttribute(element);
        return styleMap[styleName] || '';
    };
    DominoAdapter.prototype.hasStyle = function (element, styleName, styleValue) {
        var value = this.getStyle(element, styleName);
        return styleValue ? value == styleValue : value.length > 0;
    };
    DominoAdapter.prototype.dispatchEvent = function (el, evt) {
        el.dispatchEvent(evt);
        // Dispatch the event to the window also.
        var doc = el.ownerDocument || el;
        var win = doc.defaultView;
        if (win) {
            win.dispatchEvent(evt);
        }
    };
    DominoAdapter.prototype.getHistory = function () { throw _notImplemented('getHistory'); };
    DominoAdapter.prototype.getLocation = function () { throw _notImplemented('getLocation'); };
    DominoAdapter.prototype.getUserAgent = function () { return 'Fake user agent'; };
    DominoAdapter.prototype.supportsWebAnimation = function () { return false; };
    DominoAdapter.prototype.performanceNow = function () { return Date.now(); };
    DominoAdapter.prototype.getAnimationPrefix = function () { return ''; };
    DominoAdapter.prototype.getTransitionEnd = function () { return 'transitionend'; };
    DominoAdapter.prototype.supportsAnimation = function () { return true; };
    DominoAdapter.prototype.getDistributedNodes = function (el) { throw _notImplemented('getDistributedNodes'); };
    DominoAdapter.prototype.supportsCookies = function () { return false; };
    DominoAdapter.prototype.getCookie = function (name) { throw _notImplemented('getCookie'); };
    DominoAdapter.prototype.setCookie = function (name, value) { throw _notImplemented('setCookie'); };
    return DominoAdapter;
}(platform_browser_1.ɵBrowserDomAdapter));
exports.DominoAdapter = DominoAdapter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9taW5vX2FkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1zZXJ2ZXIvc3JjL2RvbWlub19hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7R0FNRztBQUNILElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUVqQyw4REFBMkg7QUFFM0gseUJBQXlCLFVBQWtCO0lBQ3pDLE9BQU8sSUFBSSxLQUFLLENBQUMsbURBQW1ELEdBQUcsVUFBVSxDQUFDLENBQUM7QUFDckYsQ0FBQztBQUVEO0lBQ0UsOERBQThEO0lBQzlELE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxNQUFjLENBQUMsZUFBZSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDdkQsQ0FBQztBQUVEOztHQUVHO0FBQ0gsdUJBQThCLElBQVksRUFBRSxHQUFTO0lBQVQsb0JBQUEsRUFBQSxTQUFTO0lBQ25ELElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzVDLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDMUIsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBSkQsc0NBSUM7QUFFRDs7R0FFRztBQUNILDJCQUFrQyxHQUFhO0lBQzdDLE9BQVEsR0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2xDLENBQUM7QUFGRCw4Q0FFQztBQUVEOztHQUVHO0FBQ0g7SUFBbUMsaUNBQWlCO0lBQXBEOztJQXVMQSxDQUFDO0lBdExRLHlCQUFXLEdBQWxCO1FBQ0UsV0FBVyxFQUFFLENBQUM7UUFDZCxxQ0FBaUIsQ0FBQyxJQUFJLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFDekMs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