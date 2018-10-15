/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BROWSER_ANIMATIONS_PROVIDERS, BROWSER_NOOP_ANIMATIONS_PROVIDERS } from './providers';
/**
 * Exports `BrowserModule` with additional [dependency-injection providers](guide/glossary#provider)
 * for use with animations. See [Animations](guide/animations).
 * \@experimental
 */
var BrowserAnimationsModule = /** @class */ (function () {
    function BrowserAnimationsModule() {
    }
    BrowserAnimationsModule.decorators = [
        { type: NgModule, args: [{
                    exports: [BrowserModule],
                    providers: BROWSER_ANIMATIONS_PROVIDERS,
                },] },
    ];
    return BrowserAnimationsModule;
}());
export { BrowserAnimationsModule };
/**
 * A null player that must be imported to allow disabling of animations.
 * \@experimental
 */
var NoopAnimationsModule = /** @class */ (function () {
    function NoopAnimationsModule() {
    }
    NoopAnimationsModule.decorators = [
        { type: NgModule, args: [{
                    exports: [BrowserModule],
                    providers: BROWSER_NOOP_ANIMATIONS_PROVIDERS,
                },] },
    ];
    return NoopAnimationsModule;
}());
export { NoopAnimationsModule };
//# sourceMappingURL=module.js.map