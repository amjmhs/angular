/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { APP_ID, NgModule, NgZone, PLATFORM_INITIALIZER, createPlatformFactory, platformCore } from '@angular/core';
import { BrowserModule, ɵBrowserDomAdapter as BrowserDomAdapter, ɵELEMENT_PROBE_PROVIDERS as ELEMENT_PROBE_PROVIDERS } from '@angular/platform-browser';
import { BrowserDetection, createNgZone } from './browser_util';
/**
 * @return {?}
 */
function initBrowserTests() {
    BrowserDomAdapter.makeCurrent();
    BrowserDetection.setup();
}
/** @type {?} */
var _TEST_BROWSER_PLATFORM_PROVIDERS = [{ provide: PLATFORM_INITIALIZER, useValue: initBrowserTests, multi: true }];
/** *
 * Platform for testing
 *
 *
  @type {?} */
export var platformBrowserTesting = createPlatformFactory(platformCore, 'browserTesting', _TEST_BROWSER_PLATFORM_PROVIDERS);
var ɵ0 = createNgZone;
/**
 * NgModule for testing.
 *
 *
 */
var BrowserTestingModule = /** @class */ (function () {
    function BrowserTestingModule() {
    }
    BrowserTestingModule.decorators = [
        { type: NgModule, args: [{
                    exports: [BrowserModule],
                    providers: [
                        { provide: APP_ID, useValue: 'a' },
                        ELEMENT_PROBE_PROVIDERS,
                        { provide: NgZone, useFactory: ɵ0 },
                    ]
                },] },
    ];
    return BrowserTestingModule;
}());
export { BrowserTestingModule };
export { ɵ0 };
//# sourceMappingURL=browser.js.map