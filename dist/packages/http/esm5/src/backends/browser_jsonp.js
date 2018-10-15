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
import { Injectable } from '@angular/core';
/** @type {?} */
var _nextRequestId = 0;
/** @type {?} */
export var JSONP_HOME = '__ng_jsonp__';
/** @type {?} */
var _jsonpConnections = null;
/**
 * @return {?}
 */
function _getJsonpConnections() {
    /** @type {?} */
    var w = typeof window == 'object' ? window : {};
    if (_jsonpConnections === null) {
        _jsonpConnections = w[JSONP_HOME] = {};
    }
    return _jsonpConnections;
}
var BrowserJsonp = /** @class */ (function () {
    function BrowserJsonp() {
    }
    // Construct a <script> element with the specified URL
    /**
     * @param {?} url
     * @return {?}
     */
    BrowserJsonp.prototype.build = /**
     * @param {?} url
     * @return {?}
     */
    function (url) {
        /** @type {?} */
        var node = document.createElement('script');
        node.src = url;
        return node;
    };
    /**
     * @return {?}
     */
    BrowserJsonp.prototype.nextRequestID = /**
     * @return {?}
     */
    function () { return "__req" + _nextRequestId++; };
    /**
     * @param {?} id
     * @return {?}
     */
    BrowserJsonp.prototype.requestCallback = /**
     * @param {?} id
     * @return {?}
     */
    function (id) { return JSONP_HOME + "." + id + ".finished"; };
    /**
     * @param {?} id
     * @param {?} connection
     * @return {?}
     */
    BrowserJsonp.prototype.exposeConnection = /**
     * @param {?} id
     * @param {?} connection
     * @return {?}
     */
    function (id, connection) {
        /** @type {?} */
        var connections = _getJsonpConnections();
        connections[id] = connection;
    };
    /**
     * @param {?} id
     * @return {?}
     */
    BrowserJsonp.prototype.removeConnection = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var connections = _getJsonpConnections();
        connections[id] = null;
    };
    // Attach the <script> element to the DOM
    /**
     * @param {?} node
     * @return {?}
     */
    BrowserJsonp.prototype.send = /**
     * @param {?} node
     * @return {?}
     */
    function (node) { document.body.appendChild(/** @type {?} */ ((node))); };
    // Remove <script> element from the DOM
    /**
     * @param {?} node
     * @return {?}
     */
    BrowserJsonp.prototype.cleanup = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        if (node.parentNode) {
            node.parentNode.removeChild(/** @type {?} */ ((node)));
        }
    };
    BrowserJsonp.decorators = [
        { type: Injectable },
    ];
    return BrowserJsonp;
}());
export { BrowserJsonp };
//# sourceMappingURL=browser_jsonp.js.map