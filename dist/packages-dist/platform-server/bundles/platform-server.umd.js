/**
 * @license Angular v6.1.10-bea78b0
 * (c) 2010-2018 Google, Inc. https://angular.io/
 * License: MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/platform-browser'), require('@angular/animations/browser'), require('@angular/common'), require('@angular/common/http'), require('@angular/http'), require('@angular/platform-browser-dynamic'), require('@angular/platform-browser/animations'), require('rxjs'), require('url'), require('@angular/compiler'), require('rxjs/operators')) :
	typeof define === 'function' && define.amd ? define('@angular/platform-server', ['exports', '@angular/core', '@angular/platform-browser', '@angular/animations/browser', '@angular/common', '@angular/common/http', '@angular/http', '@angular/platform-browser-dynamic', '@angular/platform-browser/animations', 'rxjs', 'url', '@angular/compiler', 'rxjs/operators'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.platformServer = {}),global.ng.core,global.ng.platformBrowser,global.ng.animations.browser,global.ng.common,global.ng.common.http,global.ng.http,global.ng.platformBrowserDynamic,global.ng.platformBrowser.animations,global.rxjs,global.url,global.ng.compiler,global.rxjs.operators));
}(this, (function (exports,_angular_core,_angular_platformBrowser,_angular_animations_browser,_angular_common,_angular_common_http,_angular_http,_angular_platformBrowserDynamic,_angular_platformBrowser_animations,rxjs,url,_angular_compiler,rxjs_operators) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

/**
 * @license Angular v6.1.10-bea78b0
 * (c) 2010-2018 Google, Inc. https://angular.io/
 * License: MIT
 */
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** *
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
  @type {?} */
var domino = require('domino');
/**
 * @param {?} methodName
 * @return {?}
 */
function _notImplemented(methodName) {
    return new Error('This method is not implemented in DominoAdapter: ' + methodName);
}
/**
 * @return {?}
 */
function setDomTypes() {
    // Make all Domino types available as types in the global env.
    Object.assign(global, domino.impl);
    (/** @type {?} */ (global))['KeyboardEvent'] = domino.impl.Event;
}
/**
 * Parses a document string to a Document object.
 * @param {?} html
 * @param {?=} url
 * @return {?}
 */
function parseDocument(html, url$$1) {
    if (url$$1 === void 0) { url$$1 = '/'; }
    /** @type {?} */
    var window = domino.createWindow(html, url$$1);
    /** @type {?} */
    var doc = window.document;
    return doc;
}
/**
 * Serializes a document to string.
 * @param {?} doc
 * @return {?}
 */
function serializeDocument(doc) {
    return (/** @type {?} */ (doc)).serialize();
}
/**
 * DOM Adapter for the server platform based on https://github.com/fgnass/domino.
 */
var DominoAdapter = /** @class */ (function (_super) {
    __extends(DominoAdapter, _super);
    function DominoAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    DominoAdapter.makeCurrent = /**
     * @return {?}
     */
    function () {
        setDomTypes();
        _angular_platformBrowser.ɵsetRootDomAdapter(new DominoAdapter());
    };
    /**
     * @param {?} error
     * @return {?}
     */
    DominoAdapter.prototype.logError = /**
     * @param {?} error
     * @return {?}
     */
    function (error) { console.error(error); };
    /**
     * @param {?} error
     * @return {?}
     */
    DominoAdapter.prototype.log = /**
     * @param {?} error
     * @return {?}
     */
    function (error) {
        // tslint:disable-next-line:no-console
        console.log(error);
    };
    /**
     * @param {?} error
     * @return {?}
     */
    DominoAdapter.prototype.logGroup = /**
     * @param {?} error
     * @return {?}
     */
    function (error) { console.error(error); };
    /**
     * @return {?}
     */
    DominoAdapter.prototype.logGroupEnd = /**
     * @return {?}
     */
    function () { };
    /**
     * @return {?}
     */
    DominoAdapter.prototype.supportsDOMEvents = /**
     * @return {?}
     */
    function () { return false; };
    /**
     * @return {?}
     */
    DominoAdapter.prototype.supportsNativeShadowDOM = /**
     * @return {?}
     */
    function () { return false; };
    /**
     * @param {?} nodeA
     * @param {?} nodeB
     * @return {?}
     */
    DominoAdapter.prototype.contains = /**
     * @param {?} nodeA
     * @param {?} nodeB
     * @return {?}
     */
    function (nodeA, nodeB) {
        /** @type {?} */
        var inner = nodeB;
        while (inner) {
            if (inner === nodeA)
                return true;
            inner = inner.parent;
        }
        return false;
    };
    /**
     * @return {?}
     */
    DominoAdapter.prototype.createHtmlDocument = /**
     * @return {?}
     */
    function () {
        return parseDocument('<html><head><title>fakeTitle</title></head><body></body></html>');
    };
    /**
     * @return {?}
     */
    DominoAdapter.prototype.getDefaultDocument = /**
     * @return {?}
     */
    function () {
        if (!DominoAdapter.defaultDoc) {
            DominoAdapter.defaultDoc = domino.createDocument();
        }
        return DominoAdapter.defaultDoc;
    };
    /**
     * @param {?} el
     * @param {?=} doc
     * @return {?}
     */
    DominoAdapter.prototype.createShadowRoot = /**
     * @param {?} el
     * @param {?=} doc
     * @return {?}
     */
    function (el, doc) {
        if (doc === void 0) { doc = document; }
        el.shadowRoot = doc.createDocumentFragment();
        el.shadowRoot.parent = el;
        return el.shadowRoot;
    };
    /**
     * @param {?} el
     * @return {?}
     */
    DominoAdapter.prototype.getShadowRoot = /**
     * @param {?} el
     * @return {?}
     */
    function (el) { return el.shadowRoot; };
    /**
     * @param {?} node
     * @return {?}
     */
    DominoAdapter.prototype.isTextNode = /**
     * @param {?} node
     * @return {?}
     */
    function (node) { return node.nodeType === DominoAdapter.defaultDoc.TEXT_NODE; };
    /**
     * @param {?} node
     * @return {?}
     */
    DominoAdapter.prototype.isCommentNode = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        return node.nodeType === DominoAdapter.defaultDoc.COMMENT_NODE;
    };
    /**
     * @param {?} node
     * @return {?}
     */
    DominoAdapter.prototype.isElementNode = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        return node ? node.nodeType === DominoAdapter.defaultDoc.ELEMENT_NODE : false;
    };
    /**
     * @param {?} node
     * @return {?}
     */
    DominoAdapter.prototype.hasShadowRoot = /**
     * @param {?} node
     * @return {?}
     */
    function (node) { return node.shadowRoot != null; };
    /**
     * @param {?} node
     * @return {?}
     */
    DominoAdapter.prototype.isShadowRoot = /**
     * @param {?} node
     * @return {?}
     */
    function (node) { return this.getShadowRoot(node) == node; };
    /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    DominoAdapter.prototype.getProperty = /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    function (el, name) {
        if (name === 'href') {
            // Domino tries tp resolve href-s which we do not want. Just return the
            // attribute value.
            return this.getAttribute(el, 'href');
        }
        else if (name === 'innerText') {
            // Domino does not support innerText. Just map it to textContent.
            return el.textContent;
        }
        return (/** @type {?} */ (el))[name];
    };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    DominoAdapter.prototype.setProperty = /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    function (el, name, value) {
        if (name === 'href') {
            // Even though the server renderer reflects any properties to attributes
            // map 'href' to attribute just to handle when setProperty is directly called.
            this.setAttribute(el, 'href', value);
        }
        else if (name === 'innerText') {
            // Domino does not support innerText. Just map it to textContent.
            el.textContent = value;
        }
        (/** @type {?} */ (el))[name] = value;
    };
    /**
     * @param {?} doc
     * @param {?} target
     * @return {?}
     */
    DominoAdapter.prototype.getGlobalEventTarget = /**
     * @param {?} doc
     * @param {?} target
     * @return {?}
     */
    function (doc, target) {
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
    /**
     * @param {?} doc
     * @return {?}
     */
    DominoAdapter.prototype.getBaseHref = /**
     * @param {?} doc
     * @return {?}
     */
    function (doc) {
        /** @type {?} */
        var base = this.querySelector(doc.documentElement, 'base');
        /** @type {?} */
        var href = '';
        if (base) {
            href = this.getHref(base);
        }
        // TODO(alxhub): Need relative path logic from BrowserDomAdapter here?
        return href;
    };
    /** @internal */
    /**
     * \@internal
     * @param {?} element
     * @return {?}
     */
    DominoAdapter.prototype._readStyleAttribute = /**
     * \@internal
     * @param {?} element
     * @return {?}
     */
    function (element) {
        /** @type {?} */
        var styleMap = {};
        /** @type {?} */
        var styleAttribute = element.getAttribute('style');
        if (styleAttribute) {
            /** @type {?} */
            var styleList = styleAttribute.split(/;+/g);
            for (var i = 0; i < styleList.length; i++) {
                /** @type {?} */
                var style = styleList[i].trim();
                if (style.length > 0) {
                    /** @type {?} */
                    var colonIndex = style.indexOf(':');
                    if (colonIndex === -1) {
                        throw new Error("Invalid CSS style: " + style);
                    }
                    /** @type {?} */
                    var name_1 = style.substr(0, colonIndex).trim();
                    styleMap[name_1] = style.substr(colonIndex + 1).trim();
                }
            }
        }
        return styleMap;
    };
    /** @internal */
    /**
     * \@internal
     * @param {?} element
     * @param {?} styleMap
     * @return {?}
     */
    DominoAdapter.prototype._writeStyleAttribute = /**
     * \@internal
     * @param {?} element
     * @param {?} styleMap
     * @return {?}
     */
    function (element, styleMap) {
        /** @type {?} */
        var styleAttrValue = '';
        for (var key in styleMap) {
            /** @type {?} */
            var newValue = styleMap[key];
            if (newValue) {
                styleAttrValue += key + ':' + styleMap[key] + ';';
            }
        }
        element.setAttribute('style', styleAttrValue);
    };
    /**
     * @param {?} element
     * @param {?} styleName
     * @param {?=} styleValue
     * @return {?}
     */
    DominoAdapter.prototype.setStyle = /**
     * @param {?} element
     * @param {?} styleName
     * @param {?=} styleValue
     * @return {?}
     */
    function (element, styleName, styleValue) {
        styleName = styleName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        /** @type {?} */
        var styleMap = this._readStyleAttribute(element);
        styleMap[styleName] = styleValue || '';
        this._writeStyleAttribute(element, styleMap);
    };
    /**
     * @param {?} element
     * @param {?} styleName
     * @return {?}
     */
    DominoAdapter.prototype.removeStyle = /**
     * @param {?} element
     * @param {?} styleName
     * @return {?}
     */
    function (element, styleName) {
        // IE requires '' instead of null
        // see https://github.com/angular/angular/issues/7916
        this.setStyle(element, styleName, '');
    };
    /**
     * @param {?} element
     * @param {?} styleName
     * @return {?}
     */
    DominoAdapter.prototype.getStyle = /**
     * @param {?} element
     * @param {?} styleName
     * @return {?}
     */
    function (element, styleName) {
        /** @type {?} */
        var styleMap = this._readStyleAttribute(element);
        return styleMap[styleName] || '';
    };
    /**
     * @param {?} element
     * @param {?} styleName
     * @param {?=} styleValue
     * @return {?}
     */
    DominoAdapter.prototype.hasStyle = /**
     * @param {?} element
     * @param {?} styleName
     * @param {?=} styleValue
     * @return {?}
     */
    function (element, styleName, styleValue) {
        /** @type {?} */
        var value = this.getStyle(element, styleName);
        return styleValue ? value == styleValue : value.length > 0;
    };
    /**
     * @param {?} el
     * @param {?} evt
     * @return {?}
     */
    DominoAdapter.prototype.dispatchEvent = /**
     * @param {?} el
     * @param {?} evt
     * @return {?}
     */
    function (el, evt) {
        el.dispatchEvent(evt);
        /** @type {?} */
        var doc = el.ownerDocument || el;
        /** @type {?} */
        var win = (/** @type {?} */ (doc)).defaultView;
        if (win) {
            win.dispatchEvent(evt);
        }
    };
    /**
     * @return {?}
     */
    DominoAdapter.prototype.getHistory = /**
     * @return {?}
     */
    function () { throw _notImplemented('getHistory'); };
    /**
     * @return {?}
     */
    DominoAdapter.prototype.getLocation = /**
     * @return {?}
     */
    function () { throw _notImplemented('getLocation'); };
    /**
     * @return {?}
     */
    DominoAdapter.prototype.getUserAgent = /**
     * @return {?}
     */
    function () { return 'Fake user agent'; };
    /**
     * @return {?}
     */
    DominoAdapter.prototype.supportsWebAnimation = /**
     * @return {?}
     */
    function () { return false; };
    /**
     * @return {?}
     */
    DominoAdapter.prototype.performanceNow = /**
     * @return {?}
     */
    function () { return Date.now(); };
    /**
     * @return {?}
     */
    DominoAdapter.prototype.getAnimationPrefix = /**
     * @return {?}
     */
    function () { return ''; };
    /**
     * @return {?}
     */
    DominoAdapter.prototype.getTransitionEnd = /**
     * @return {?}
     */
    function () { return 'transitionend'; };
    /**
     * @return {?}
     */
    DominoAdapter.prototype.supportsAnimation = /**
     * @return {?}
     */
    function () { return true; };
    /**
     * @param {?} el
     * @return {?}
     */
    DominoAdapter.prototype.getDistributedNodes = /**
     * @param {?} el
     * @return {?}
     */
    function (el) { throw _notImplemented('getDistributedNodes'); };
    /**
     * @return {?}
     */
    DominoAdapter.prototype.supportsCookies = /**
     * @return {?}
     */
    function () { return false; };
    /**
     * @param {?} name
     * @return {?}
     */
    DominoAdapter.prototype.getCookie = /**
     * @param {?} name
     * @return {?}
     */
    function (name) { throw _notImplemented('getCookie'); };
    /**
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    DominoAdapter.prototype.setCookie = /**
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    function (name, value) { throw _notImplemented('setCookie'); };
    return DominoAdapter;
}(_angular_platformBrowser.ɵBrowserDomAdapter));

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
/**
 * Representation of the current platform state.
 *
 * \@experimental
 */
var PlatformState = /** @class */ (function () {
    function PlatformState(_doc) {
        this._doc = _doc;
    }
    /**
     * Renders the current state of the platform to string.
     */
    /**
     * Renders the current state of the platform to string.
     * @return {?}
     */
    PlatformState.prototype.renderToString = /**
     * Renders the current state of the platform to string.
     * @return {?}
     */
    function () { return serializeDocument(this._doc); };
    /**
     * Returns the current DOM state.
     */
    /**
     * Returns the current DOM state.
     * @return {?}
     */
    PlatformState.prototype.getDocument = /**
     * Returns the current DOM state.
     * @return {?}
     */
    function () { return this._doc; };
    PlatformState.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    PlatformState.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [_angular_platformBrowser.DOCUMENT,] }] }
    ]; };
    return PlatformState;
}());

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
/** @type {?} */
var xhr2 = require('xhr2');
/** @type {?} */
var isAbsoluteUrl = /^[a-zA-Z\-\+.]+:\/\//;
/**
 * @param {?} url
 * @return {?}
 */
function validateRequestUrl(url$$1) {
    if (!isAbsoluteUrl.test(url$$1)) {
        throw new Error("URLs requested via Http on the server must be absolute. URL: " + url$$1);
    }
}
var ServerXhr = /** @class */ (function () {
    function ServerXhr() {
    }
    /**
     * @return {?}
     */
    ServerXhr.prototype.build = /**
     * @return {?}
     */
    function () { return new xhr2.XMLHttpRequest(); };
    ServerXhr.decorators = [
        { type: _angular_core.Injectable },
    ];
    return ServerXhr;
}());
var ServerXsrfStrategy = /** @class */ (function () {
    function ServerXsrfStrategy() {
    }
    /**
     * @param {?} req
     * @return {?}
     */
    ServerXsrfStrategy.prototype.configureRequest = /**
     * @param {?} req
     * @return {?}
     */
    function (req) { };
    ServerXsrfStrategy.decorators = [
        { type: _angular_core.Injectable },
    ];
    return ServerXsrfStrategy;
}());
/**
 * @abstract
 * @template S, R
 */
var ZoneMacroTaskWrapper = /** @class */ (function () {
    function ZoneMacroTaskWrapper() {
    }
    /**
     * @param {?} request
     * @return {?}
     */
    ZoneMacroTaskWrapper.prototype.wrap = /**
     * @param {?} request
     * @return {?}
     */
    function (request) {
        var _this = this;
        return new rxjs.Observable(function (observer) {
            /** @type {?} */
            var task = /** @type {?} */ ((null));
            /** @type {?} */
            var scheduled = false;
            /** @type {?} */
            var sub = null;
            /** @type {?} */
            var savedResult = null;
            /** @type {?} */
            var savedError = null;
            /** @type {?} */
            var scheduleTask = function (_task) {
                task = _task;
                scheduled = true;
                /** @type {?} */
                var delegate = _this.delegate(request);
                sub = delegate.subscribe(function (res) { return savedResult = res; }, function (err) {
                    if (!scheduled) {
                        throw new Error('An http observable was completed twice. This shouldn\'t happen, please file a bug.');
                    }
                    savedError = err;
                    scheduled = false;
                    task.invoke();
                }, function () {
                    if (!scheduled) {
                        throw new Error('An http observable was completed twice. This shouldn\'t happen, please file a bug.');
                    }
                    scheduled = false;
                    task.invoke();
                });
            };
            /** @type {?} */
            var cancelTask = function (_task) {
                if (!scheduled) {
                    return;
                }
                scheduled = false;
                if (sub) {
                    sub.unsubscribe();
                    sub = null;
                }
            };
            /** @type {?} */
            var onComplete = function () {
                if (savedError !== null) {
                    observer.error(savedError);
                }
                else {
                    observer.next(savedResult);
                    observer.complete();
                }
            };
            /** @type {?} */
            var _task = Zone.current.scheduleMacroTask('ZoneMacroTaskWrapper.subscribe', onComplete, {}, function () { return null; }, cancelTask);
            scheduleTask(_task);
            return function () {
                if (scheduled && task) {
                    task.zone.cancelTask(task);
                    scheduled = false;
                }
                if (sub) {
                    sub.unsubscribe();
                    sub = null;
                }
            };
        });
    };
    return ZoneMacroTaskWrapper;
}());
var ZoneMacroTaskConnection = /** @class */ (function (_super) {
    __extends(ZoneMacroTaskConnection, _super);
    function ZoneMacroTaskConnection(request, backend) {
        var _this = _super.call(this) || this;
        _this.request = request;
        _this.backend = backend;
        validateRequestUrl(request.url);
        _this.response = _this.wrap(request);
        return _this;
    }
    /**
     * @param {?} request
     * @return {?}
     */
    ZoneMacroTaskConnection.prototype.delegate = /**
     * @param {?} request
     * @return {?}
     */
    function (request) {
        this.lastConnection = this.backend.createConnection(request);
        return /** @type {?} */ (this.lastConnection.response);
    };
    Object.defineProperty(ZoneMacroTaskConnection.prototype, "readyState", {
        get: /**
         * @return {?}
         */
        function () {
            return !!this.lastConnection ? this.lastConnection.readyState : _angular_http.ReadyState.Unsent;
        },
        enumerable: true,
        configurable: true
    });
    return ZoneMacroTaskConnection;
}(ZoneMacroTaskWrapper));
var ZoneMacroTaskBackend = /** @class */ (function () {
    function ZoneMacroTaskBackend(backend) {
        this.backend = backend;
    }
    /**
     * @param {?} request
     * @return {?}
     */
    ZoneMacroTaskBackend.prototype.createConnection = /**
     * @param {?} request
     * @return {?}
     */
    function (request) {
        return new ZoneMacroTaskConnection(request, this.backend);
    };
    return ZoneMacroTaskBackend;
}());
var ZoneClientBackend = /** @class */ (function (_super) {
    __extends(ZoneClientBackend, _super);
    function ZoneClientBackend(backend) {
        var _this = _super.call(this) || this;
        _this.backend = backend;
        return _this;
    }
    /**
     * @param {?} request
     * @return {?}
     */
    ZoneClientBackend.prototype.handle = /**
     * @param {?} request
     * @return {?}
     */
    function (request) { return this.wrap(request); };
    /**
     * @param {?} request
     * @return {?}
     */
    ZoneClientBackend.prototype.delegate = /**
     * @param {?} request
     * @return {?}
     */
    function (request) {
        return this.backend.handle(request);
    };
    return ZoneClientBackend;
}(ZoneMacroTaskWrapper));
/**
 * @param {?} xhrBackend
 * @param {?} options
 * @return {?}
 */
function httpFactory(xhrBackend, options) {
    /** @type {?} */
    var macroBackend = new ZoneMacroTaskBackend(xhrBackend);
    return new _angular_http.Http(macroBackend, options);
}
/**
 * @param {?} backend
 * @param {?} injector
 * @return {?}
 */
function zoneWrappedInterceptingHandler(backend, injector) {
    /** @type {?} */
    var realBackend = new _angular_common_http.ɵHttpInterceptingHandler(backend, injector);
    return new ZoneClientBackend(realBackend);
}
/** @type {?} */
var SERVER_HTTP_PROVIDERS = [
    { provide: _angular_http.Http, useFactory: httpFactory, deps: [_angular_http.XHRBackend, _angular_http.RequestOptions] },
    { provide: _angular_http.BrowserXhr, useClass: ServerXhr }, { provide: _angular_http.XSRFStrategy, useClass: ServerXsrfStrategy },
    { provide: _angular_common_http.XhrFactory, useClass: ServerXhr }, {
        provide: _angular_common_http.HttpHandler,
        useFactory: zoneWrappedInterceptingHandler,
        deps: [_angular_common_http.HttpBackend, _angular_core.Injector]
    }
];

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
/**
 * Config object passed to initialize the platform.
 *
 * \@experimental
 * @record
 */

/** *
 * The DI token for setting the initial config for the platform.
 *
 * \@experimental
  @type {?} */
var INITIAL_CONFIG = new _angular_core.InjectionToken('Server.INITIAL_CONFIG');
/** *
 * A function that will be executed when calling `renderModuleFactory` or `renderModule` just
 * before current platform state is rendered to string.
 *
 * \@experimental
  @type {?} */
var BEFORE_APP_SERIALIZED = new _angular_core.InjectionToken('Server.RENDER_MODULE_HOOK');

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
/**
 * @param {?} urlStr
 * @return {?}
 */
function parseUrl(urlStr) {
    /** @type {?} */
    var parsedUrl = url.parse(urlStr);
    return {
        pathname: parsedUrl.pathname || '',
        search: parsedUrl.search || '',
        hash: parsedUrl.hash || '',
    };
}
/**
 * Server-side implementation of URL state. Implements `pathname`, `search`, and `hash`
 * but not the state stack.
 */
var ServerPlatformLocation = /** @class */ (function () {
    function ServerPlatformLocation(_doc, _config) {
        this._doc = _doc;
        this.pathname = '/';
        this.search = '';
        this.hash = '';
        this._hashUpdate = new rxjs.Subject();
        /** @type {?} */
        var config = /** @type {?} */ (_config);
        if (!!config && !!config.url) {
            /** @type {?} */
            var parsedUrl = parseUrl(config.url);
            this.pathname = parsedUrl.pathname;
            this.search = parsedUrl.search;
            this.hash = parsedUrl.hash;
        }
    }
    /**
     * @return {?}
     */
    ServerPlatformLocation.prototype.getBaseHrefFromDOM = /**
     * @return {?}
     */
    function () { return /** @type {?} */ ((_angular_platformBrowser.ɵgetDOM().getBaseHref(this._doc))); };
    /**
     * @param {?} fn
     * @return {?}
     */
    ServerPlatformLocation.prototype.onPopState = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        // No-op: a state stack is not implemented, so
        // no events will ever come.
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    ServerPlatformLocation.prototype.onHashChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) { this._hashUpdate.subscribe(fn); };
    Object.defineProperty(ServerPlatformLocation.prototype, "url", {
        get: /**
         * @return {?}
         */
        function () { return "" + this.pathname + this.search + this.hash; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} value
     * @param {?} oldUrl
     * @return {?}
     */
    ServerPlatformLocation.prototype.setHash = /**
     * @param {?} value
     * @param {?} oldUrl
     * @return {?}
     */
    function (value, oldUrl) {
        var _this = this;
        if (this.hash === value) {
            // Don't fire events if the hash has not changed.
            return;
        }
        (/** @type {?} */ (this)).hash = value;
        /** @type {?} */
        var newUrl = this.url;
        scheduleMicroTask(function () { return _this._hashUpdate.next(/** @type {?} */ ({
            type: 'hashchange', state: null, oldUrl: oldUrl, newUrl: newUrl
        })); });
    };
    /**
     * @param {?} state
     * @param {?} title
     * @param {?} newUrl
     * @return {?}
     */
    ServerPlatformLocation.prototype.replaceState = /**
     * @param {?} state
     * @param {?} title
     * @param {?} newUrl
     * @return {?}
     */
    function (state, title, newUrl) {
        /** @type {?} */
        var oldUrl = this.url;
        /** @type {?} */
        var parsedUrl = parseUrl(newUrl);
        (/** @type {?} */ (this)).pathname = parsedUrl.pathname;
        (/** @type {?} */ (this)).search = parsedUrl.search;
        this.setHash(parsedUrl.hash, oldUrl);
    };
    /**
     * @param {?} state
     * @param {?} title
     * @param {?} newUrl
     * @return {?}
     */
    ServerPlatformLocation.prototype.pushState = /**
     * @param {?} state
     * @param {?} title
     * @param {?} newUrl
     * @return {?}
     */
    function (state, title, newUrl) {
        this.replaceState(state, title, newUrl);
    };
    /**
     * @return {?}
     */
    ServerPlatformLocation.prototype.forward = /**
     * @return {?}
     */
    function () { throw new Error('Not implemented'); };
    /**
     * @return {?}
     */
    ServerPlatformLocation.prototype.back = /**
     * @return {?}
     */
    function () { throw new Error('Not implemented'); };
    ServerPlatformLocation.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    ServerPlatformLocation.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [_angular_platformBrowser.DOCUMENT,] }] },
        { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [INITIAL_CONFIG,] }] }
    ]; };
    return ServerPlatformLocation;
}());
/**
 * @param {?} fn
 * @return {?}
 */
function scheduleMicroTask(fn) {
    Zone.current.scheduleMicroTask('scheduleMicrotask', fn);
}

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
var ServerEventManagerPlugin = /** @class */ (function () {
    function ServerEventManagerPlugin(doc) {
        this.doc = doc;
    }
    // Handle all events on the server.
    /**
     * @param {?} eventName
     * @return {?}
     */
    ServerEventManagerPlugin.prototype.supports = /**
     * @param {?} eventName
     * @return {?}
     */
    function (eventName) { return true; };
    /**
     * @param {?} element
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    ServerEventManagerPlugin.prototype.addEventListener = /**
     * @param {?} element
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    function (element, eventName, handler) {
        return _angular_platformBrowser.ɵgetDOM().onAndCancel(element, eventName, handler);
    };
    /**
     * @param {?} element
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    ServerEventManagerPlugin.prototype.addGlobalEventListener = /**
     * @param {?} element
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    function (element, eventName, handler) {
        /** @type {?} */
        var target = _angular_platformBrowser.ɵgetDOM().getGlobalEventTarget(this.doc, element);
        if (!target) {
            throw new Error("Unsupported event target " + target + " for event " + eventName);
        }
        return this.addEventListener(target, eventName, handler);
    };
    ServerEventManagerPlugin.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    ServerEventManagerPlugin.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [_angular_platformBrowser.DOCUMENT,] }] }
    ]; };
    return ServerEventManagerPlugin;
}());

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
/** @type {?} */
var EMPTY_ARRAY = [];
var ServerRendererFactory2 = /** @class */ (function () {
    function ServerRendererFactory2(eventManager, ngZone, document, sharedStylesHost) {
        this.eventManager = eventManager;
        this.ngZone = ngZone;
        this.document = document;
        this.sharedStylesHost = sharedStylesHost;
        this.rendererByCompId = new Map();
        this.schema = new _angular_compiler.DomElementSchemaRegistry();
        this.defaultRenderer = new DefaultServerRenderer2(eventManager, document, ngZone, this.schema);
    }
    /**
     * @param {?} element
     * @param {?} type
     * @return {?}
     */
    ServerRendererFactory2.prototype.createRenderer = /**
     * @param {?} element
     * @param {?} type
     * @return {?}
     */
    function (element, type) {
        if (!element || !type) {
            return this.defaultRenderer;
        }
        switch (type.encapsulation) {
            case _angular_core.ViewEncapsulation.Native:
            case _angular_core.ViewEncapsulation.Emulated: {
                /** @type {?} */
                var renderer = this.rendererByCompId.get(type.id);
                if (!renderer) {
                    renderer = new EmulatedEncapsulationServerRenderer2(this.eventManager, this.document, this.ngZone, this.sharedStylesHost, this.schema, type);
                    this.rendererByCompId.set(type.id, renderer);
                }
                (/** @type {?} */ (renderer)).applyToHost(element);
                return renderer;
            }
            case _angular_core.ViewEncapsulation.Native:
                throw new Error('Native encapsulation is not supported on the server!');
            default: {
                if (!this.rendererByCompId.has(type.id)) {
                    /** @type {?} */
                    var styles = _angular_platformBrowser.ɵflattenStyles(type.id, type.styles, []);
                    this.sharedStylesHost.addStyles(styles);
                    this.rendererByCompId.set(type.id, this.defaultRenderer);
                }
                return this.defaultRenderer;
            }
        }
    };
    /**
     * @return {?}
     */
    ServerRendererFactory2.prototype.begin = /**
     * @return {?}
     */
    function () { };
    /**
     * @return {?}
     */
    ServerRendererFactory2.prototype.end = /**
     * @return {?}
     */
    function () { };
    ServerRendererFactory2.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    ServerRendererFactory2.ctorParameters = function () { return [
        { type: _angular_platformBrowser.EventManager },
        { type: _angular_core.NgZone },
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [_angular_platformBrowser.DOCUMENT,] }] },
        { type: _angular_platformBrowser.ɵSharedStylesHost }
    ]; };
    return ServerRendererFactory2;
}());
var DefaultServerRenderer2 = /** @class */ (function () {
    function DefaultServerRenderer2(eventManager, document, ngZone, schema) {
        this.eventManager = eventManager;
        this.document = document;
        this.ngZone = ngZone;
        this.schema = schema;
        this.data = Object.create(null);
    }
    /**
     * @return {?}
     */
    DefaultServerRenderer2.prototype.destroy = /**
     * @return {?}
     */
    function () { };
    /**
     * @param {?} name
     * @param {?=} namespace
     * @param {?=} debugInfo
     * @return {?}
     */
    DefaultServerRenderer2.prototype.createElement = /**
     * @param {?} name
     * @param {?=} namespace
     * @param {?=} debugInfo
     * @return {?}
     */
    function (name, namespace, debugInfo) {
        if (namespace) {
            return _angular_platformBrowser.ɵgetDOM().createElementNS(_angular_platformBrowser.ɵNAMESPACE_URIS[namespace], name, this.document);
        }
        return _angular_platformBrowser.ɵgetDOM().createElement(name, this.document);
    };
    /**
     * @param {?} value
     * @param {?=} debugInfo
     * @return {?}
     */
    DefaultServerRenderer2.prototype.createComment = /**
     * @param {?} value
     * @param {?=} debugInfo
     * @return {?}
     */
    function (value, debugInfo) { return _angular_platformBrowser.ɵgetDOM().createComment(value); };
    /**
     * @param {?} value
     * @param {?=} debugInfo
     * @return {?}
     */
    DefaultServerRenderer2.prototype.createText = /**
     * @param {?} value
     * @param {?=} debugInfo
     * @return {?}
     */
    function (value, debugInfo) { return _angular_platformBrowser.ɵgetDOM().createTextNode(value); };
    /**
     * @param {?} parent
     * @param {?} newChild
     * @return {?}
     */
    DefaultServerRenderer2.prototype.appendChild = /**
     * @param {?} parent
     * @param {?} newChild
     * @return {?}
     */
    function (parent, newChild) { _angular_platformBrowser.ɵgetDOM().appendChild(parent, newChild); };
    /**
     * @param {?} parent
     * @param {?} newChild
     * @param {?} refChild
     * @return {?}
     */
    DefaultServerRenderer2.prototype.insertBefore = /**
     * @param {?} parent
     * @param {?} newChild
     * @param {?} refChild
     * @return {?}
     */
    function (parent, newChild, refChild) {
        if (parent) {
            _angular_platformBrowser.ɵgetDOM().insertBefore(parent, refChild, newChild);
        }
    };
    /**
     * @param {?} parent
     * @param {?} oldChild
     * @return {?}
     */
    DefaultServerRenderer2.prototype.removeChild = /**
     * @param {?} parent
     * @param {?} oldChild
     * @return {?}
     */
    function (parent, oldChild) {
        if (parent) {
            _angular_platformBrowser.ɵgetDOM().removeChild(parent, oldChild);
        }
    };
    /**
     * @param {?} selectorOrNode
     * @param {?=} debugInfo
     * @return {?}
     */
    DefaultServerRenderer2.prototype.selectRootElement = /**
     * @param {?} selectorOrNode
     * @param {?=} debugInfo
     * @return {?}
     */
    function (selectorOrNode, debugInfo) {
        /** @type {?} */
        var el;
        if (typeof selectorOrNode === 'string') {
            el = _angular_platformBrowser.ɵgetDOM().querySelector(this.document, selectorOrNode);
            if (!el) {
                throw new Error("The selector \"" + selectorOrNode + "\" did not match any elements");
            }
        }
        else {
            el = selectorOrNode;
        }
        _angular_platformBrowser.ɵgetDOM().clearNodes(el);
        return el;
    };
    /**
     * @param {?} node
     * @return {?}
     */
    DefaultServerRenderer2.prototype.parentNode = /**
     * @param {?} node
     * @return {?}
     */
    function (node) { return _angular_platformBrowser.ɵgetDOM().parentElement(node); };
    /**
     * @param {?} node
     * @return {?}
     */
    DefaultServerRenderer2.prototype.nextSibling = /**
     * @param {?} node
     * @return {?}
     */
    function (node) { return _angular_platformBrowser.ɵgetDOM().nextSibling(node); };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @param {?=} namespace
     * @return {?}
     */
    DefaultServerRenderer2.prototype.setAttribute = /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @param {?=} namespace
     * @return {?}
     */
    function (el, name, value, namespace) {
        if (namespace) {
            _angular_platformBrowser.ɵgetDOM().setAttributeNS(el, _angular_platformBrowser.ɵNAMESPACE_URIS[namespace], namespace + ':' + name, value);
        }
        else {
            _angular_platformBrowser.ɵgetDOM().setAttribute(el, name, value);
        }
    };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?=} namespace
     * @return {?}
     */
    DefaultServerRenderer2.prototype.removeAttribute = /**
     * @param {?} el
     * @param {?} name
     * @param {?=} namespace
     * @return {?}
     */
    function (el, name, namespace) {
        if (namespace) {
            _angular_platformBrowser.ɵgetDOM().removeAttributeNS(el, _angular_platformBrowser.ɵNAMESPACE_URIS[namespace], name);
        }
        else {
            _angular_platformBrowser.ɵgetDOM().removeAttribute(el, name);
        }
    };
    /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    DefaultServerRenderer2.prototype.addClass = /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    function (el, name) { _angular_platformBrowser.ɵgetDOM().addClass(el, name); };
    /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    DefaultServerRenderer2.prototype.removeClass = /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    function (el, name) { _angular_platformBrowser.ɵgetDOM().removeClass(el, name); };
    /**
     * @param {?} el
     * @param {?} style
     * @param {?} value
     * @param {?} flags
     * @return {?}
     */
    DefaultServerRenderer2.prototype.setStyle = /**
     * @param {?} el
     * @param {?} style
     * @param {?} value
     * @param {?} flags
     * @return {?}
     */
    function (el, style, value, flags) {
        _angular_platformBrowser.ɵgetDOM().setStyle(el, style, value);
    };
    /**
     * @param {?} el
     * @param {?} style
     * @param {?} flags
     * @return {?}
     */
    DefaultServerRenderer2.prototype.removeStyle = /**
     * @param {?} el
     * @param {?} style
     * @param {?} flags
     * @return {?}
     */
    function (el, style, flags) {
        _angular_platformBrowser.ɵgetDOM().removeStyle(el, style);
    };
    /**
     * @param {?} tagName
     * @param {?} propertyName
     * @return {?}
     */
    DefaultServerRenderer2.prototype._isSafeToReflectProperty = /**
     * @param {?} tagName
     * @param {?} propertyName
     * @return {?}
     */
    function (tagName, propertyName) {
        return this.schema.securityContext(tagName, propertyName, true) ===
            this.schema.securityContext(tagName, propertyName, false);
    };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    DefaultServerRenderer2.prototype.setProperty = /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    function (el, name, value) {
        checkNoSyntheticProp(name, 'property');
        _angular_platformBrowser.ɵgetDOM().setProperty(el, name, value);
        /** @type {?} */
        var tagName = (/** @type {?} */ (el.tagName)).toLowerCase();
        if (value != null && (typeof value === 'number' || typeof value == 'string') &&
            name.toLowerCase() !== 'innerhtml' && this.schema.hasElement(tagName, EMPTY_ARRAY) &&
            this.schema.hasProperty(tagName, name, EMPTY_ARRAY) &&
            this._isSafeToReflectProperty(tagName, name)) {
            this.setAttribute(el, name, value.toString());
        }
    };
    /**
     * @param {?} node
     * @param {?} value
     * @return {?}
     */
    DefaultServerRenderer2.prototype.setValue = /**
     * @param {?} node
     * @param {?} value
     * @return {?}
     */
    function (node, value) { _angular_platformBrowser.ɵgetDOM().setText(node, value); };
    /**
     * @param {?} target
     * @param {?} eventName
     * @param {?} callback
     * @return {?}
     */
    DefaultServerRenderer2.prototype.listen = /**
     * @param {?} target
     * @param {?} eventName
     * @param {?} callback
     * @return {?}
     */
    function (target, eventName, callback) {
        checkNoSyntheticProp(eventName, 'listener');
        if (typeof target === 'string') {
            return /** @type {?} */ (this.eventManager.addGlobalEventListener(target, eventName, this.decoratePreventDefault(callback)));
        }
        return /** @type {?} */ ((this.eventManager.addEventListener(target, eventName, this.decoratePreventDefault(callback))));
    };
    /**
     * @param {?} eventHandler
     * @return {?}
     */
    DefaultServerRenderer2.prototype.decoratePreventDefault = /**
     * @param {?} eventHandler
     * @return {?}
     */
    function (eventHandler) {
        var _this = this;
        return function (event) {
            /** @type {?} */
            var allowDefaultBehavior = _this.ngZone.runGuarded(function () { return eventHandler(event); });
            if (allowDefaultBehavior === false) {
                event.preventDefault();
                event.returnValue = false;
            }
        };
    };
    return DefaultServerRenderer2;
}());
/** @type {?} */
var AT_CHARCODE = '@'.charCodeAt(0);
/**
 * @param {?} name
 * @param {?} nameKind
 * @return {?}
 */
function checkNoSyntheticProp(name, nameKind) {
    if (name.charCodeAt(0) === AT_CHARCODE) {
        throw new Error("Found the synthetic " + nameKind + " " + name + ". Please include either \"BrowserAnimationsModule\" or \"NoopAnimationsModule\" in your application.");
    }
}
var EmulatedEncapsulationServerRenderer2 = /** @class */ (function (_super) {
    __extends(EmulatedEncapsulationServerRenderer2, _super);
    function EmulatedEncapsulationServerRenderer2(eventManager, document, ngZone, sharedStylesHost, schema, component) {
        var _this = _super.call(this, eventManager, document, ngZone, schema) || this;
        _this.component = component;
        /** @type {?} */
        var componentId = 's' + component.id;
        /** @type {?} */
        var styles = _angular_platformBrowser.ɵflattenStyles(componentId, component.styles, []);
        sharedStylesHost.addStyles(styles);
        _this.contentAttr = _angular_platformBrowser.ɵshimContentAttribute(componentId);
        _this.hostAttr = _angular_platformBrowser.ɵshimHostAttribute(componentId);
        return _this;
    }
    /**
     * @param {?} element
     * @return {?}
     */
    EmulatedEncapsulationServerRenderer2.prototype.applyToHost = /**
     * @param {?} element
     * @return {?}
     */
    function (element) { _super.prototype.setAttribute.call(this, element, this.hostAttr, ''); };
    /**
     * @param {?} parent
     * @param {?} name
     * @return {?}
     */
    EmulatedEncapsulationServerRenderer2.prototype.createElement = /**
     * @param {?} parent
     * @param {?} name
     * @return {?}
     */
    function (parent, name) {
        /** @type {?} */
        var el = _super.prototype.createElement.call(this, parent, name, this.document);
        _super.prototype.setAttribute.call(this, el, this.contentAttr, '');
        return el;
    };
    return EmulatedEncapsulationServerRenderer2;
}(DefaultServerRenderer2));

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
var ServerStylesHost = /** @class */ (function (_super) {
    __extends(ServerStylesHost, _super);
    function ServerStylesHost(doc, transitionId) {
        var _this = _super.call(this) || this;
        _this.doc = doc;
        _this.transitionId = transitionId;
        _this.head = null;
        _this.head = _angular_platformBrowser.ɵgetDOM().getElementsByTagName(doc, 'head')[0];
        return _this;
    }
    /**
     * @param {?} style
     * @return {?}
     */
    ServerStylesHost.prototype._addStyle = /**
     * @param {?} style
     * @return {?}
     */
    function (style) {
        /** @type {?} */
        var adapter = _angular_platformBrowser.ɵgetDOM();
        /** @type {?} */
        var el = adapter.createElement('style');
        adapter.setText(el, style);
        if (!!this.transitionId) {
            adapter.setAttribute(el, 'ng-transition', this.transitionId);
        }
        adapter.appendChild(this.head, el);
    };
    /**
     * @param {?} additions
     * @return {?}
     */
    ServerStylesHost.prototype.onStylesAdded = /**
     * @param {?} additions
     * @return {?}
     */
    function (additions) {
        var _this = this;
        additions.forEach(function (style) { return _this._addStyle(style); });
    };
    ServerStylesHost.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    ServerStylesHost.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [_angular_platformBrowser.DOCUMENT,] }] },
        { type: String, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [_angular_platformBrowser.ɵTRANSITION_ID,] }] }
    ]; };
    return ServerStylesHost;
}(_angular_platformBrowser.ɵSharedStylesHost));

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
/** @type {?} */
var INTERNAL_SERVER_PLATFORM_PROVIDERS = [
    { provide: _angular_platformBrowser.DOCUMENT, useFactory: _document, deps: [_angular_core.Injector] },
    { provide: _angular_core.PLATFORM_ID, useValue: _angular_common.ɵPLATFORM_SERVER_ID },
    { provide: _angular_core.PLATFORM_INITIALIZER, useFactory: initDominoAdapter, multi: true, deps: [_angular_core.Injector] }, {
        provide: _angular_common.PlatformLocation,
        useClass: ServerPlatformLocation,
        deps: [_angular_platformBrowser.DOCUMENT, [_angular_core.Optional, INITIAL_CONFIG]]
    },
    { provide: PlatformState, deps: [_angular_platformBrowser.DOCUMENT] },
    // Add special provider that allows multiple instances of platformServer* to be created.
    { provide: _angular_core.ɵALLOW_MULTIPLE_PLATFORMS, useValue: true }
];
/**
 * @param {?} injector
 * @return {?}
 */
function initDominoAdapter(injector) {
    return function () { DominoAdapter.makeCurrent(); };
}
/**
 * @param {?} renderer
 * @param {?} engine
 * @param {?} zone
 * @return {?}
 */
function instantiateServerRendererFactory(renderer, engine, zone) {
    return new _angular_platformBrowser_animations.ɵAnimationRendererFactory(renderer, engine, zone);
}
/** @type {?} */
var SERVER_RENDER_PROVIDERS = [
    ServerRendererFactory2,
    {
        provide: _angular_core.RendererFactory2,
        useFactory: instantiateServerRendererFactory,
        deps: [ServerRendererFactory2, _angular_animations_browser.ɵAnimationEngine, _angular_core.NgZone]
    },
    ServerStylesHost,
    { provide: _angular_platformBrowser.ɵSharedStylesHost, useExisting: ServerStylesHost },
    { provide: _angular_platformBrowser.EVENT_MANAGER_PLUGINS, multi: true, useClass: ServerEventManagerPlugin },
];
/**
 * The ng module for the server.
 *
 * \@experimental
 */
var ServerModule = /** @class */ (function () {
    function ServerModule() {
    }
    ServerModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    exports: [_angular_platformBrowser.BrowserModule],
                    imports: [_angular_http.HttpModule, _angular_common_http.HttpClientModule, _angular_platformBrowser_animations.NoopAnimationsModule],
                    providers: [
                        SERVER_RENDER_PROVIDERS,
                        SERVER_HTTP_PROVIDERS,
                        { provide: _angular_core.Testability, useValue: null },
                        { provide: _angular_common.ViewportScroller, useClass: _angular_common.ɵNullViewportScroller },
                    ],
                },] },
    ];
    return ServerModule;
}());
/**
 * @param {?} injector
 * @return {?}
 */
function _document(injector) {
    /** @type {?} */
    var config = injector.get(INITIAL_CONFIG, null);
    if (config && config.document) {
        return parseDocument(config.document, config.url);
    }
    else {
        return _angular_platformBrowser.ɵgetDOM().createHtmlDocument();
    }
}
/** *
 * \@experimental
  @type {?} */
var platformServer = _angular_core.createPlatformFactory(_angular_core.platformCore, 'server', INTERNAL_SERVER_PLATFORM_PROVIDERS);
/** *
 * The server platform that supports the runtime compiler.
 *
 * \@experimental
  @type {?} */
var platformDynamicServer = _angular_core.createPlatformFactory(_angular_platformBrowserDynamic.ɵplatformCoreDynamic, 'serverDynamic', INTERNAL_SERVER_PLATFORM_PROVIDERS);

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
/**
 * @param {?} doc
 * @param {?} appId
 * @param {?} transferStore
 * @return {?}
 */
function serializeTransferStateFactory(doc, appId, transferStore) {
    return function () {
        /** @type {?} */
        var script = doc.createElement('script');
        script.id = appId + '-state';
        script.setAttribute('type', 'application/json');
        script.textContent = _angular_platformBrowser.ɵescapeHtml(transferStore.toJson());
        doc.body.appendChild(script);
    };
}
/**
 * NgModule to install on the server side while using the `TransferState` to transfer state from
 * server to client.
 *
 * \@experimental
 */
var ServerTransferStateModule = /** @class */ (function () {
    function ServerTransferStateModule() {
    }
    ServerTransferStateModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    providers: [
                        _angular_platformBrowser.TransferState, {
                            provide: BEFORE_APP_SERIALIZED,
                            useFactory: serializeTransferStateFactory,
                            deps: [_angular_platformBrowser.DOCUMENT, _angular_core.APP_ID, _angular_platformBrowser.TransferState],
                            multi: true,
                        }
                    ]
                },] },
    ];
    return ServerTransferStateModule;
}());

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
/**
 * @param {?} platformFactory
 * @param {?} options
 * @return {?}
 */
function _getPlatform(platformFactory, options) {
    /** @type {?} */
    var extraProviders = options.extraProviders ? options.extraProviders : [];
    return platformFactory([
        { provide: INITIAL_CONFIG, useValue: { document: options.document, url: options.url } },
        extraProviders
    ]);
}
/**
 * @template T
 * @param {?} platform
 * @param {?} moduleRefPromise
 * @return {?}
 */
function _render(platform, moduleRefPromise) {
    return moduleRefPromise.then(function (moduleRef) {
        /** @type {?} */
        var transitionId = moduleRef.injector.get(_angular_platformBrowser.ɵTRANSITION_ID, null);
        if (!transitionId) {
            throw new Error("renderModule[Factory]() requires the use of BrowserModule.withServerTransition() to ensure\nthe server-rendered app can be properly bootstrapped into a client app.");
        }
        /** @type {?} */
        var applicationRef = moduleRef.injector.get(_angular_core.ApplicationRef);
        return applicationRef.isStable.pipe((rxjs_operators.first(function (isStable) { return isStable; })))
            .toPromise()
            .then(function () {
            /** @type {?} */
            var platformState = platform.injector.get(PlatformState);
            /** @type {?} */
            var callbacks = moduleRef.injector.get(BEFORE_APP_SERIALIZED, null);
            if (callbacks) {
                for (var _i = 0, callbacks_1 = callbacks; _i < callbacks_1.length; _i++) {
                    var callback = callbacks_1[_i];
                    try {
                        callback();
                    }
                    catch (e) {
                        // Ignore exceptions.
                        console.warn('Ignoring BEFORE_APP_SERIALIZED Exception: ', e);
                    }
                }
            }
            /** @type {?} */
            var output = platformState.renderToString();
            platform.destroy();
            return output;
        });
    });
}
/**
 * Renders a Module to string.
 *
 * `document` is the full document HTML of the page to render, as a string.
 * `url` is the URL for the current render request.
 * `extraProviders` are the platform level providers for the current render request.
 *
 * Do not use this in a production server environment. Use pre-compiled {\@link NgModuleFactory} with
 * {\@link renderModuleFactory} instead.
 *
 * \@experimental
 * @template T
 * @param {?} module
 * @param {?} options
 * @return {?}
 */
function renderModule(module, options) {
    /** @type {?} */
    var platform = _getPlatform(platformDynamicServer, options);
    return _render(platform, platform.bootstrapModule(module));
}
/**
 * Renders a {\@link NgModuleFactory} to string.
 *
 * `document` is the full document HTML of the page to render, as a string.
 * `url` is the URL for the current render request.
 * `extraProviders` are the platform level providers for the current render request.
 *
 * \@experimental
 * @template T
 * @param {?} moduleFactory
 * @param {?} options
 * @return {?}
 */
function renderModuleFactory(moduleFactory, options) {
    /** @type {?} */
    var platform = _getPlatform(platformServer, options);
    return _render(platform, platform.bootstrapModuleFactory(moduleFactory));
}

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
/** @type {?} */
var VERSION = new _angular_core.Version('6.1.10-bea78b0');

exports.PlatformState = PlatformState;
exports.ServerModule = ServerModule;
exports.platformDynamicServer = platformDynamicServer;
exports.platformServer = platformServer;
exports.BEFORE_APP_SERIALIZED = BEFORE_APP_SERIALIZED;
exports.INITIAL_CONFIG = INITIAL_CONFIG;
exports.ServerTransferStateModule = ServerTransferStateModule;
exports.renderModule = renderModule;
exports.renderModuleFactory = renderModuleFactory;
exports.VERSION = VERSION;
exports.ɵINTERNAL_SERVER_PLATFORM_PROVIDERS = INTERNAL_SERVER_PLATFORM_PROVIDERS;
exports.ɵSERVER_RENDER_PROVIDERS = SERVER_RENDER_PROVIDERS;
exports.ɵServerRendererFactory2 = ServerRendererFactory2;
exports.ɵi = SERVER_HTTP_PROVIDERS;
exports.ɵe = ServerXhr;
exports.ɵf = ServerXsrfStrategy;
exports.ɵg = httpFactory;
exports.ɵh = zoneWrappedInterceptingHandler;
exports.ɵa = instantiateServerRendererFactory;
exports.ɵd = ServerEventManagerPlugin;
exports.ɵc = ServerStylesHost;
exports.ɵb = serializeTransferStateFactory;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=platform-server.umd.js.map
