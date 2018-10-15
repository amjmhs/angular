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
import * as tslib_1 from "tslib";
import { LocationStrategy } from '@angular/common';
import { EventEmitter, Injectable } from '@angular/core';
/**
 * A mock implementation of {\@link LocationStrategy} that allows tests to fire simulated
 * location events.
 *
 *
 */
var MockLocationStrategy = /** @class */ (function (_super) {
    tslib_1.__extends(MockLocationStrategy, _super);
    function MockLocationStrategy() {
        var _this = _super.call(this) || this;
        _this.internalBaseHref = '/';
        _this.internalPath = '/';
        _this.internalTitle = '';
        _this.urlChanges = [];
        /**
         * \@internal
         */
        _this._subject = new EventEmitter();
        return _this;
    }
    /**
     * @param {?} url
     * @return {?}
     */
    MockLocationStrategy.prototype.simulatePopState = /**
     * @param {?} url
     * @return {?}
     */
    function (url) {
        this.internalPath = url;
        this._subject.emit(new _MockPopStateEvent(this.path()));
    };
    /**
     * @param {?=} includeHash
     * @return {?}
     */
    MockLocationStrategy.prototype.path = /**
     * @param {?=} includeHash
     * @return {?}
     */
    function (includeHash) {
        if (includeHash === void 0) { includeHash = false; }
        return this.internalPath;
    };
    /**
     * @param {?} internal
     * @return {?}
     */
    MockLocationStrategy.prototype.prepareExternalUrl = /**
     * @param {?} internal
     * @return {?}
     */
    function (internal) {
        if (internal.startsWith('/') && this.internalBaseHref.endsWith('/')) {
            return this.internalBaseHref + internal.substring(1);
        }
        return this.internalBaseHref + internal;
    };
    /**
     * @param {?} ctx
     * @param {?} title
     * @param {?} path
     * @param {?} query
     * @return {?}
     */
    MockLocationStrategy.prototype.pushState = /**
     * @param {?} ctx
     * @param {?} title
     * @param {?} path
     * @param {?} query
     * @return {?}
     */
    function (ctx, title, path, query) {
        this.internalTitle = title;
        /** @type {?} */
        var url = path + (query.length > 0 ? ('?' + query) : '');
        this.internalPath = url;
        /** @type {?} */
        var externalUrl = this.prepareExternalUrl(url);
        this.urlChanges.push(externalUrl);
    };
    /**
     * @param {?} ctx
     * @param {?} title
     * @param {?} path
     * @param {?} query
     * @return {?}
     */
    MockLocationStrategy.prototype.replaceState = /**
     * @param {?} ctx
     * @param {?} title
     * @param {?} path
     * @param {?} query
     * @return {?}
     */
    function (ctx, title, path, query) {
        this.internalTitle = title;
        /** @type {?} */
        var url = path + (query.length > 0 ? ('?' + query) : '');
        this.internalPath = url;
        /** @type {?} */
        var externalUrl = this.prepareExternalUrl(url);
        this.urlChanges.push('replace: ' + externalUrl);
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    MockLocationStrategy.prototype.onPopState = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) { this._subject.subscribe({ next: fn }); };
    /**
     * @return {?}
     */
    MockLocationStrategy.prototype.getBaseHref = /**
     * @return {?}
     */
    function () { return this.internalBaseHref; };
    /**
     * @return {?}
     */
    MockLocationStrategy.prototype.back = /**
     * @return {?}
     */
    function () {
        if (this.urlChanges.length > 0) {
            this.urlChanges.pop();
            /** @type {?} */
            var nextUrl = this.urlChanges.length > 0 ? this.urlChanges[this.urlChanges.length - 1] : '';
            this.simulatePopState(nextUrl);
        }
    };
    /**
     * @return {?}
     */
    MockLocationStrategy.prototype.forward = /**
     * @return {?}
     */
    function () { throw 'not implemented'; };
    MockLocationStrategy.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    MockLocationStrategy.ctorParameters = function () { return []; };
    return MockLocationStrategy;
}(LocationStrategy));
export { MockLocationStrategy };
if (false) {
    /** @type {?} */
    MockLocationStrategy.prototype.internalBaseHref;
    /** @type {?} */
    MockLocationStrategy.prototype.internalPath;
    /** @type {?} */
    MockLocationStrategy.prototype.internalTitle;
    /** @type {?} */
    MockLocationStrategy.prototype.urlChanges;
    /**
     * \@internal
     * @type {?}
     */
    MockLocationStrategy.prototype._subject;
}
var _MockPopStateEvent = /** @class */ (function () {
    function _MockPopStateEvent(newUrl) {
        this.newUrl = newUrl;
        this.pop = true;
        this.type = 'popstate';
    }
    return _MockPopStateEvent;
}());
if (false) {
    /** @type {?} */
    _MockPopStateEvent.prototype.pop;
    /** @type {?} */
    _MockPopStateEvent.prototype.type;
    /** @type {?} */
    _MockPopStateEvent.prototype.newUrl;
}
//# sourceMappingURL=mock_location_strategy.js.map