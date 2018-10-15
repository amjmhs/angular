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
import { NavigationEnd, NavigationStart, Scroll } from './events';
var RouterScroller = /** @class */ (function () {
    function RouterScroller(router, viewportScroller, options) {
        if (options === void 0) { options = {}; }
        this.router = router;
        this.viewportScroller = viewportScroller;
        this.options = options;
        this.lastId = 0;
        this.lastSource = 'imperative';
        this.restoredId = 0;
        this.store = {};
        // Default both options to 'disabled'
        options.scrollPositionRestoration = options.scrollPositionRestoration || 'disabled';
        options.anchorScrolling = options.anchorScrolling || 'disabled';
    }
    /**
     * @return {?}
     */
    RouterScroller.prototype.init = /**
     * @return {?}
     */
    function () {
        // we want to disable the automatic scrolling because having two places
        // responsible for scrolling results race conditions, especially given
        // that browser don't implement this behavior consistently
        if (this.options.scrollPositionRestoration !== 'disabled') {
            this.viewportScroller.setHistoryScrollRestoration('manual');
        }
        this.routerEventsSubscription = this.createScrollEvents();
        this.scrollEventsSubscription = this.consumeScrollEvents();
    };
    /**
     * @return {?}
     */
    RouterScroller.prototype.createScrollEvents = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return this.router.events.subscribe(function (e) {
            if (e instanceof NavigationStart) {
                // store the scroll position of the current stable navigations.
                // store the scroll position of the current stable navigations.
                _this.store[_this.lastId] = _this.viewportScroller.getScrollPosition();
                _this.lastSource = e.navigationTrigger;
                _this.restoredId = e.restoredState ? e.restoredState.navigationId : 0;
            }
            else if (e instanceof NavigationEnd) {
                _this.lastId = e.id;
                _this.scheduleScrollEvent(e, _this.router.parseUrl(e.urlAfterRedirects).fragment);
            }
        });
    };
    /**
     * @return {?}
     */
    RouterScroller.prototype.consumeScrollEvents = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return this.router.events.subscribe(function (e) {
            if (!(e instanceof Scroll))
                return;
            // a popstate event. The pop state event will always ignore anchor scrolling.
            if (e.position) {
                if (_this.options.scrollPositionRestoration === 'top') {
                    _this.viewportScroller.scrollToPosition([0, 0]);
                }
                else if (_this.options.scrollPositionRestoration === 'enabled') {
                    _this.viewportScroller.scrollToPosition(e.position);
                }
                // imperative navigation "forward"
            }
            else {
                if (e.anchor && _this.options.anchorScrolling === 'enabled') {
                    _this.viewportScroller.scrollToAnchor(e.anchor);
                }
                else if (_this.options.scrollPositionRestoration !== 'disabled') {
                    _this.viewportScroller.scrollToPosition([0, 0]);
                }
            }
        });
    };
    /**
     * @param {?} routerEvent
     * @param {?} anchor
     * @return {?}
     */
    RouterScroller.prototype.scheduleScrollEvent = /**
     * @param {?} routerEvent
     * @param {?} anchor
     * @return {?}
     */
    function (routerEvent, anchor) {
        this.router.triggerEvent(new Scroll(routerEvent, this.lastSource === 'popstate' ? this.store[this.restoredId] : null, anchor));
    };
    /**
     * @return {?}
     */
    RouterScroller.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.routerEventsSubscription) {
            this.routerEventsSubscription.unsubscribe();
        }
        if (this.scrollEventsSubscription) {
            this.scrollEventsSubscription.unsubscribe();
        }
    };
    return RouterScroller;
}());
export { RouterScroller };
if (false) {
    /** @type {?} */
    RouterScroller.prototype.routerEventsSubscription;
    /** @type {?} */
    RouterScroller.prototype.scrollEventsSubscription;
    /** @type {?} */
    RouterScroller.prototype.lastId;
    /** @type {?} */
    RouterScroller.prototype.lastSource;
    /** @type {?} */
    RouterScroller.prototype.restoredId;
    /** @type {?} */
    RouterScroller.prototype.store;
    /** @type {?} */
    RouterScroller.prototype.router;
    /**
     * \@docsNotRequired
     * @type {?}
     */
    RouterScroller.prototype.viewportScroller;
    /** @type {?} */
    RouterScroller.prototype.options;
}
//# sourceMappingURL=router_scroller.js.map