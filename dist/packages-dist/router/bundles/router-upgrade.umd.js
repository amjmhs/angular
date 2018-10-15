/**
 * @license Angular v6.1.10-bea78b0
 * (c) 2010-2018 Google, Inc. https://angular.io/
 * License: MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('@angular/router'), require('@angular/upgrade/static')) :
	typeof define === 'function' && define.amd ? define('@angular/router/upgrade', ['exports', '@angular/common', '@angular/core', '@angular/router', '@angular/upgrade/static'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.router = global.ng.router || {}, global.ng.router.upgrade = {}),global.ng.common,global.ng.core,global.ng.router,global.ng.upgrade.static));
}(this, (function (exports,_angular_common,_angular_core,_angular_router,_angular_upgrade_static) { 'use strict';

/**
 * @license Angular v6.1.10-bea78b0
 * (c) 2010-2018 Google, Inc. https://angular.io/
 * License: MIT
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
/** *
 * \@description
 *
 * Creates an initializer that in addition to setting up the Angular
 * router sets up the ngRoute integration.
 *
 * ```
 * \@NgModule({
 *  imports: [
 *   RouterModule.forRoot(SOME_ROUTES),
 *   UpgradeModule
 * ],
 * providers: [
 *   RouterUpgradeInitializer
 * ]
 * })
 * export class AppModule {
 *   ngDoBootstrap() {}
 * }
 * ```
 *
 * \@experimental
  @type {?} */
var RouterUpgradeInitializer = {
    provide: _angular_core.APP_BOOTSTRAP_LISTENER,
    multi: true,
    useFactory: /** @type {?} */ (locationSyncBootstrapListener),
    deps: [_angular_upgrade_static.UpgradeModule]
};
/**
 * \@internal
 * @param {?} ngUpgrade
 * @return {?}
 */
function locationSyncBootstrapListener(ngUpgrade) {
    return function () { setUpLocationSync(ngUpgrade); };
}
/**
 * \@description
 *
 * Sets up a location synchronization.
 *
 * History.pushState does not fire onPopState, so the Angular location
 * doesn't detect it. The workaround is to attach a location change listener
 *
 * \@experimental
 * @param {?} ngUpgrade
 * @return {?}
 */
function setUpLocationSync(ngUpgrade) {
    if (!ngUpgrade.$injector) {
        throw new Error("\n        RouterUpgradeInitializer can be used only after UpgradeModule.bootstrap has been called.\n        Remove RouterUpgradeInitializer and call setUpLocationSync after UpgradeModule.bootstrap.\n      ");
    }
    /** @type {?} */
    var router = ngUpgrade.injector.get(_angular_router.Router);
    /** @type {?} */
    var location = ngUpgrade.injector.get(_angular_common.Location);
    ngUpgrade.$injector.get('$rootScope')
        .$on('$locationChangeStart', function (_, next, __) {
        /** @type {?} */
        var url = resolveUrl(next);
        /** @type {?} */
        var path = location.normalize(url.pathname);
        router.navigateByUrl(path + url.search + url.hash);
    });
}
/** *
 * Normalize and parse a URL.
 *
 * - Normalizing means that a relative URL will be resolved into an absolute URL in the context of
 *   the application document.
 * - Parsing means that the anchor's `protocol`, `hostname`, `port`, `pathname` and related
 *   properties are all populated to reflect the normalized URL.
 *
 * While this approach has wide compatibility, it doesn't work as expected on IE. On IE, normalizing
 * happens similar to other browsers, but the parsed components will not be set. (E.g. if you assign
 * `a.href = 'foo'`, then `a.protocol`, `a.host`, etc. will not be correctly updated.)
 * We work around that by performing the parsing in a 2nd step by taking a previously normalized URL
 * and assigning it again. This correctly populates all properties.
 *
 * See
 * https://github.com/angular/angular.js/blob/2c7400e7d07b0f6cec1817dab40b9250ce8ebce6/src/ng/urlUtils.js#L26-L33
 * for more info.
  @type {?} */
var anchor;
/**
 * @param {?} url
 * @return {?}
 */
function resolveUrl(url) {
    if (!anchor) {
        anchor = document.createElement('a');
    }
    anchor.setAttribute('href', url);
    anchor.setAttribute('href', anchor.href);
    return {
        // IE does not start `pathname` with `/` like other browsers.
        pathname: "/" + anchor.pathname.replace(/^\//, ''),
        search: anchor.search,
        hash: anchor.hash
    };
}

exports.locationSyncBootstrapListener = locationSyncBootstrapListener;
exports.setUpLocationSync = setUpLocationSync;
exports.RouterUpgradeInitializer = RouterUpgradeInitializer;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=router-upgrade.umd.js.map
