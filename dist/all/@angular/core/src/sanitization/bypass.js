"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var BRAND = '__SANITIZER_TRUSTED_BRAND__';
function allowSanitizationBypass(value, type) {
    return (value instanceof String && value[BRAND] === type) ? true : false;
}
exports.allowSanitizationBypass = allowSanitizationBypass;
/**
 * Mark `html` string as trusted.
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {@link htmlSanitizer} to be trusted implicitly.
 *
 * @param trustedHtml `html` string which needs to be implicitly trusted.
 * @returns a `html` `String` which has been branded to be implicitly trusted.
 */
function bypassSanitizationTrustHtml(trustedHtml) {
    return bypassSanitizationTrustString(trustedHtml, "Html" /* Html */);
}
exports.bypassSanitizationTrustHtml = bypassSanitizationTrustHtml;
/**
 * Mark `style` string as trusted.
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {@link styleSanitizer} to be trusted implicitly.
 *
 * @param trustedStyle `style` string which needs to be implicitly trusted.
 * @returns a `style` `String` which has been branded to be implicitly trusted.
 */
function bypassSanitizationTrustStyle(trustedStyle) {
    return bypassSanitizationTrustString(trustedStyle, "Style" /* Style */);
}
exports.bypassSanitizationTrustStyle = bypassSanitizationTrustStyle;
/**
 * Mark `script` string as trusted.
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {@link scriptSanitizer} to be trusted implicitly.
 *
 * @param trustedScript `script` string which needs to be implicitly trusted.
 * @returns a `script` `String` which has been branded to be implicitly trusted.
 */
function bypassSanitizationTrustScript(trustedScript) {
    return bypassSanitizationTrustString(trustedScript, "Script" /* Script */);
}
exports.bypassSanitizationTrustScript = bypassSanitizationTrustScript;
/**
 * Mark `url` string as trusted.
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {@link urlSanitizer} to be trusted implicitly.
 *
 * @param trustedUrl `url` string which needs to be implicitly trusted.
 * @returns a `url` `String` which has been branded to be implicitly trusted.
 */
function bypassSanitizationTrustUrl(trustedUrl) {
    return bypassSanitizationTrustString(trustedUrl, "Url" /* Url */);
}
exports.bypassSanitizationTrustUrl = bypassSanitizationTrustUrl;
/**
 * Mark `url` string as trusted.
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {@link resourceUrlSanitizer} to be trusted implicitly.
 *
 * @param trustedResourceUrl `url` string which needs to be implicitly trusted.
 * @returns a `url` `String` which has been branded to be implicitly trusted.
 */
function bypassSanitizationTrustResourceUrl(trustedResourceUrl) {
    return bypassSanitizationTrustString(trustedResourceUrl, "ResourceUrl" /* ResourceUrl */);
}
exports.bypassSanitizationTrustResourceUrl = bypassSanitizationTrustResourceUrl;
function bypassSanitizationTrustString(trustedString, mode) {
    var trusted = new String(trustedString);
    trusted[BRAND] = mode;
    return trusted;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnlwYXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvc2FuaXRpemF0aW9uL2J5cGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILElBQU0sS0FBSyxHQUFHLDZCQUE2QixDQUFDO0FBcUQ1QyxpQ0FBd0MsS0FBVSxFQUFFLElBQWdCO0lBQ2xFLE9BQU8sQ0FBQyxLQUFLLFlBQVksTUFBTSxJQUFLLEtBQTRCLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ25HLENBQUM7QUFGRCwwREFFQztBQUVEOzs7Ozs7OztHQVFHO0FBQ0gscUNBQTRDLFdBQW1CO0lBQzdELE9BQU8sNkJBQTZCLENBQUMsV0FBVyxvQkFBa0IsQ0FBQztBQUNyRSxDQUFDO0FBRkQsa0VBRUM7QUFDRDs7Ozs7Ozs7R0FRRztBQUNILHNDQUE2QyxZQUFvQjtJQUMvRCxPQUFPLDZCQUE2QixDQUFDLFlBQVksc0JBQW1CLENBQUM7QUFDdkUsQ0FBQztBQUZELG9FQUVDO0FBQ0Q7Ozs7Ozs7O0dBUUc7QUFDSCx1Q0FBOEMsYUFBcUI7SUFDakUsT0FBTyw2QkFBNkIsQ0FBQyxhQUFhLHdCQUFvQixDQUFDO0FBQ3pFLENBQUM7QUFGRCxzRUFFQztBQUNEOzs7Ozs7OztHQVFHO0FBQ0gsb0NBQTJDLFVBQWtCO0lBQzNELE9BQU8sNkJBQTZCLENBQUMsVUFBVSxrQkFBaUIsQ0FBQztBQUNuRSxDQUFDO0FBRkQsZ0VBRUM7QUFDRDs7Ozs7Ozs7R0FRRztBQUNILDRDQUFtRCxrQkFBMEI7SUFFM0UsT0FBTyw2QkFBNkIsQ0FBQyxrQkFBa0Isa0NBQXlCLENBQUM7QUFDbkYsQ0FBQztBQUhELGdGQUdDO0FBYUQsdUNBQXVDLGFBQXFCLEVBQUUsSUFBZ0I7SUFDNUUsSUFBTSxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFrQixDQUFDO0lBQzNELE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDdEIsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQyJ9