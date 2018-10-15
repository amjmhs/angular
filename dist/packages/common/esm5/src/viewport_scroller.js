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
import { defineInjectable, inject } from '@angular/core';
import { DOCUMENT } from './dom_tokens';
/**
 * Manages the scroll position.
 * @abstract
 */
var ViewportScroller = /** @class */ (function () {
    function ViewportScroller() {
    }
    /** @nocollapse */
    /** @nocollapse */ ViewportScroller.ngInjectableDef = defineInjectable({ providedIn: 'root', factory: function () { return new BrowserViewportScroller(inject(DOCUMENT), window); } });
    return ViewportScroller;
}());
export { ViewportScroller };
if (false) {
    /**
     * @nocollapse
     * @type {?}
     */
    ViewportScroller.ngInjectableDef;
    /**
     * Configures the top offset used when scrolling to an anchor.
     *
     * When given a tuple with two number, the service will always use the numbers.
     * When given a function, the service will invoke the function every time it restores scroll
     * position.
     * @abstract
     * @param {?} offset
     * @return {?}
     */
    ViewportScroller.prototype.setOffset = function (offset) { };
    /**
     * Returns the current scroll position.
     * @abstract
     * @return {?}
     */
    ViewportScroller.prototype.getScrollPosition = function () { };
    /**
     * Sets the scroll position.
     * @abstract
     * @param {?} position
     * @return {?}
     */
    ViewportScroller.prototype.scrollToPosition = function (position) { };
    /**
     * Scrolls to the provided anchor.
     * @abstract
     * @param {?} anchor
     * @return {?}
     */
    ViewportScroller.prototype.scrollToAnchor = function (anchor) { };
    /**
     *
     * Disables automatic scroll restoration provided by the browser.
     *
     * See also [window.history.scrollRestoration
     * info](https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration)
     * @abstract
     * @param {?} scrollRestoration
     * @return {?}
     */
    ViewportScroller.prototype.setHistoryScrollRestoration = function (scrollRestoration) { };
}
/**
 * Manages the scroll position.
 */
var /**
 * Manages the scroll position.
 */
BrowserViewportScroller = /** @class */ (function () {
    function BrowserViewportScroller(document, window) {
        this.document = document;
        this.window = window;
        this.offset = function () { return [0, 0]; };
    }
    /**
     * Configures the top offset used when scrolling to an anchor.
     *
     * * When given a number, the service will always use the number.
     * * When given a function, the service will invoke the function every time it restores scroll
     * position.
     */
    /**
     * Configures the top offset used when scrolling to an anchor.
     *
     * * When given a number, the service will always use the number.
     * * When given a function, the service will invoke the function every time it restores scroll
     * position.
     * @param {?} offset
     * @return {?}
     */
    BrowserViewportScroller.prototype.setOffset = /**
     * Configures the top offset used when scrolling to an anchor.
     *
     * * When given a number, the service will always use the number.
     * * When given a function, the service will invoke the function every time it restores scroll
     * position.
     * @param {?} offset
     * @return {?}
     */
    function (offset) {
        if (Array.isArray(offset)) {
            this.offset = function () { return offset; };
        }
        else {
            this.offset = offset;
        }
    };
    /**
     * Returns the current scroll position.
     */
    /**
     * Returns the current scroll position.
     * @return {?}
     */
    BrowserViewportScroller.prototype.getScrollPosition = /**
     * Returns the current scroll position.
     * @return {?}
     */
    function () {
        if (this.supportScrollRestoration()) {
            return [this.window.scrollX, this.window.scrollY];
        }
        else {
            return [0, 0];
        }
    };
    /**
     * Sets the scroll position.
     */
    /**
     * Sets the scroll position.
     * @param {?} position
     * @return {?}
     */
    BrowserViewportScroller.prototype.scrollToPosition = /**
     * Sets the scroll position.
     * @param {?} position
     * @return {?}
     */
    function (position) {
        if (this.supportScrollRestoration()) {
            this.window.scrollTo(position[0], position[1]);
        }
    };
    /**
     * Scrolls to the provided anchor.
     */
    /**
     * Scrolls to the provided anchor.
     * @param {?} anchor
     * @return {?}
     */
    BrowserViewportScroller.prototype.scrollToAnchor = /**
     * Scrolls to the provided anchor.
     * @param {?} anchor
     * @return {?}
     */
    function (anchor) {
        if (this.supportScrollRestoration()) {
            /** @type {?} */
            var elSelectedById = this.document.querySelector("#" + anchor);
            if (elSelectedById) {
                this.scrollToElement(elSelectedById);
                return;
            }
            /** @type {?} */
            var elSelectedByName = this.document.querySelector("[name='" + anchor + "']");
            if (elSelectedByName) {
                this.scrollToElement(elSelectedByName);
                return;
            }
        }
    };
    /**
     * Disables automatic scroll restoration provided by the browser.
     */
    /**
     * Disables automatic scroll restoration provided by the browser.
     * @param {?} scrollRestoration
     * @return {?}
     */
    BrowserViewportScroller.prototype.setHistoryScrollRestoration = /**
     * Disables automatic scroll restoration provided by the browser.
     * @param {?} scrollRestoration
     * @return {?}
     */
    function (scrollRestoration) {
        if (this.supportScrollRestoration()) {
            /** @type {?} */
            var history_1 = this.window.history;
            if (history_1 && history_1.scrollRestoration) {
                history_1.scrollRestoration = scrollRestoration;
            }
        }
    };
    /**
     * @param {?} el
     * @return {?}
     */
    BrowserViewportScroller.prototype.scrollToElement = /**
     * @param {?} el
     * @return {?}
     */
    function (el) {
        /** @type {?} */
        var rect = el.getBoundingClientRect();
        /** @type {?} */
        var left = rect.left + this.window.pageXOffset;
        /** @type {?} */
        var top = rect.top + this.window.pageYOffset;
        /** @type {?} */
        var offset = this.offset();
        this.window.scrollTo(left - offset[0], top - offset[1]);
    };
    /**
     * We only support scroll restoration when we can get a hold of window.
     * This means that we do not support this behavior when running in a web worker.
     *
     * Lifting this restriction right now would require more changes in the dom adapter.
     * Since webworkers aren't widely used, we will lift it once RouterScroller is
     * battle-tested.
     * @return {?}
     */
    BrowserViewportScroller.prototype.supportScrollRestoration = /**
     * We only support scroll restoration when we can get a hold of window.
     * This means that we do not support this behavior when running in a web worker.
     *
     * Lifting this restriction right now would require more changes in the dom adapter.
     * Since webworkers aren't widely used, we will lift it once RouterScroller is
     * battle-tested.
     * @return {?}
     */
    function () {
        try {
            return !!this.window && !!this.window.scrollTo;
        }
        catch (e) {
            return false;
        }
    };
    return BrowserViewportScroller;
}());
/**
 * Manages the scroll position.
 */
export { BrowserViewportScroller };
if (false) {
    /** @type {?} */
    BrowserViewportScroller.prototype.offset;
    /** @type {?} */
    BrowserViewportScroller.prototype.document;
    /** @type {?} */
    BrowserViewportScroller.prototype.window;
}
/**
 * Provides an empty implementation of the viewport scroller. This will
 * live in \@angular/common as it will be used by both platform-server and platform-webworker.
 */
var /**
 * Provides an empty implementation of the viewport scroller. This will
 * live in \@angular/common as it will be used by both platform-server and platform-webworker.
 */
NullViewportScroller = /** @class */ (function () {
    function NullViewportScroller() {
    }
    /**
     * Empty implementation
     */
    /**
     * Empty implementation
     * @param {?} offset
     * @return {?}
     */
    NullViewportScroller.prototype.setOffset = /**
     * Empty implementation
     * @param {?} offset
     * @return {?}
     */
    function (offset) { };
    /**
     * Empty implementation
     */
    /**
     * Empty implementation
     * @return {?}
     */
    NullViewportScroller.prototype.getScrollPosition = /**
     * Empty implementation
     * @return {?}
     */
    function () { return [0, 0]; };
    /**
     * Empty implementation
     */
    /**
     * Empty implementation
     * @param {?} position
     * @return {?}
     */
    NullViewportScroller.prototype.scrollToPosition = /**
     * Empty implementation
     * @param {?} position
     * @return {?}
     */
    function (position) { };
    /**
     * Empty implementation
     */
    /**
     * Empty implementation
     * @param {?} anchor
     * @return {?}
     */
    NullViewportScroller.prototype.scrollToAnchor = /**
     * Empty implementation
     * @param {?} anchor
     * @return {?}
     */
    function (anchor) { };
    /**
     * Empty implementation
     */
    /**
     * Empty implementation
     * @param {?} scrollRestoration
     * @return {?}
     */
    NullViewportScroller.prototype.setHistoryScrollRestoration = /**
     * Empty implementation
     * @param {?} scrollRestoration
     * @return {?}
     */
    function (scrollRestoration) { };
    return NullViewportScroller;
}());
/**
 * Provides an empty implementation of the viewport scroller. This will
 * live in \@angular/common as it will be used by both platform-server and platform-webworker.
 */
export { NullViewportScroller };
//# sourceMappingURL=viewport_scroller.js.map