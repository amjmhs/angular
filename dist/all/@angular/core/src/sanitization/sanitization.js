"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var instructions_1 = require("../render3/instructions");
var util_1 = require("../render3/util");
var bypass_1 = require("./bypass");
var html_sanitizer_1 = require("./html_sanitizer");
var security_1 = require("./security");
var style_sanitizer_1 = require("./style_sanitizer");
var url_sanitizer_1 = require("./url_sanitizer");
/**
 * An `html` sanitizer which converts untrusted `html` **string** into trusted string by removing
 * dangerous content.
 *
 * This method parses the `html` and locates potentially dangerous content (such as urls and
 * javascript) and removes it.
 *
 * It is possible to mark a string as trusted by calling {@link bypassSanitizationTrustHtml}.
 *
 * @param unsafeHtml untrusted `html`, typically from the user.
 * @returns `html` string which is safe to display to user, because all of the dangerous javascript
 * and urls have been removed.
 */
function sanitizeHtml(unsafeHtml) {
    var s = instructions_1.getCurrentSanitizer();
    if (s) {
        return s.sanitize(security_1.SecurityContext.HTML, unsafeHtml) || '';
    }
    if (bypass_1.allowSanitizationBypass(unsafeHtml, "Html" /* Html */)) {
        return unsafeHtml.toString();
    }
    return html_sanitizer_1._sanitizeHtml(document, util_1.stringify(unsafeHtml));
}
exports.sanitizeHtml = sanitizeHtml;
/**
 * A `style` sanitizer which converts untrusted `style` **string** into trusted string by removing
 * dangerous content.
 *
 * This method parses the `style` and locates potentially dangerous content (such as urls and
 * javascript) and removes it.
 *
 * It is possible to mark a string as trusted by calling {@link bypassSanitizationTrustStyle}.
 *
 * @param unsafeStyle untrusted `style`, typically from the user.
 * @returns `style` string which is safe to bind to the `style` properties, because all of the
 * dangerous javascript and urls have been removed.
 */
function sanitizeStyle(unsafeStyle) {
    var s = instructions_1.getCurrentSanitizer();
    if (s) {
        return s.sanitize(security_1.SecurityContext.STYLE, unsafeStyle) || '';
    }
    if (bypass_1.allowSanitizationBypass(unsafeStyle, "Style" /* Style */)) {
        return unsafeStyle.toString();
    }
    return style_sanitizer_1._sanitizeStyle(util_1.stringify(unsafeStyle));
}
exports.sanitizeStyle = sanitizeStyle;
/**
 * A `url` sanitizer which converts untrusted `url` **string** into trusted string by removing
 * dangerous
 * content.
 *
 * This method parses the `url` and locates potentially dangerous content (such as javascript) and
 * removes it.
 *
 * It is possible to mark a string as trusted by calling {@link bypassSanitizationTrustUrl}.
 *
 * @param unsafeUrl untrusted `url`, typically from the user.
 * @returns `url` string which is safe to bind to the `src` properties such as `<img src>`, because
 * all of the dangerous javascript has been removed.
 */
function sanitizeUrl(unsafeUrl) {
    var s = instructions_1.getCurrentSanitizer();
    if (s) {
        return s.sanitize(security_1.SecurityContext.URL, unsafeUrl) || '';
    }
    if (bypass_1.allowSanitizationBypass(unsafeUrl, "Url" /* Url */)) {
        return unsafeUrl.toString();
    }
    return url_sanitizer_1._sanitizeUrl(util_1.stringify(unsafeUrl));
}
exports.sanitizeUrl = sanitizeUrl;
/**
 * A `url` sanitizer which only lets trusted `url`s through.
 *
 * This passes only `url`s marked trusted by calling {@link bypassSanitizationTrustResourceUrl}.
 *
 * @param unsafeResourceUrl untrusted `url`, typically from the user.
 * @returns `url` string which is safe to bind to the `src` properties such as `<img src>`, because
 * only trusted `url`s have been allowed to pass.
 */
function sanitizeResourceUrl(unsafeResourceUrl) {
    var s = instructions_1.getCurrentSanitizer();
    if (s) {
        return s.sanitize(security_1.SecurityContext.RESOURCE_URL, unsafeResourceUrl) || '';
    }
    if (bypass_1.allowSanitizationBypass(unsafeResourceUrl, "ResourceUrl" /* ResourceUrl */)) {
        return unsafeResourceUrl.toString();
    }
    throw new Error('unsafe value used in a resource URL context (see http://g.co/ng/security#xss)');
}
exports.sanitizeResourceUrl = sanitizeResourceUrl;
/**
 * A `script` sanitizer which only lets trusted javascript through.
 *
 * This passes only `script`s marked trusted by calling {@link bypassSanitizationTrustScript}.
 *
 * @param unsafeScript untrusted `script`, typically from the user.
 * @returns `url` string which is safe to bind to the `<script>` element such as `<img src>`,
 * because only trusted `scripts`s have been allowed to pass.
 */
function sanitizeScript(unsafeScript) {
    var s = instructions_1.getCurrentSanitizer();
    if (s) {
        return s.sanitize(security_1.SecurityContext.SCRIPT, unsafeScript) || '';
    }
    if (bypass_1.allowSanitizationBypass(unsafeScript, "Script" /* Script */)) {
        return unsafeScript.toString();
    }
    throw new Error('unsafe value used in a script context');
}
exports.sanitizeScript = sanitizeScript;
/**
 * The default style sanitizer will handle sanitization for style properties by
 * sanitizing any CSS property that can include a `url` value (usually image-based properties)
 */
exports.defaultStyleSanitizer = function (prop, value) {
    if (value === undefined) {
        return prop === 'background-image' || prop === 'background' || prop === 'border-image' ||
            prop === 'filter' || prop === 'filter' || prop === 'list-style' ||
            prop === 'list-style-image';
    }
    return sanitizeStyle(value);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FuaXRpemF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvc2FuaXRpemF0aW9uL3Nhbml0aXphdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHdEQUE0RDtBQUM1RCx3Q0FBMEM7QUFFMUMsbUNBQTZEO0FBQzdELG1EQUFnRTtBQUNoRSx1Q0FBMkM7QUFDM0MscURBQW9GO0FBQ3BGLGlEQUE2RDtBQUk3RDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxzQkFBNkIsVUFBZTtJQUMxQyxJQUFNLENBQUMsR0FBRyxrQ0FBbUIsRUFBRSxDQUFDO0lBQ2hDLElBQUksQ0FBQyxFQUFFO1FBQ0wsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLDBCQUFlLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUMzRDtJQUNELElBQUksZ0NBQXVCLENBQUMsVUFBVSxvQkFBa0IsRUFBRTtRQUN4RCxPQUFPLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUM5QjtJQUNELE9BQU8sOEJBQWEsQ0FBQyxRQUFRLEVBQUUsZ0JBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQ3hELENBQUM7QUFURCxvQ0FTQztBQUVEOzs7Ozs7Ozs7Ozs7R0FZRztBQUNILHVCQUE4QixXQUFnQjtJQUM1QyxJQUFNLENBQUMsR0FBRyxrQ0FBbUIsRUFBRSxDQUFDO0lBQ2hDLElBQUksQ0FBQyxFQUFFO1FBQ0wsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLDBCQUFlLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUM3RDtJQUNELElBQUksZ0NBQXVCLENBQUMsV0FBVyxzQkFBbUIsRUFBRTtRQUMxRCxPQUFPLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUMvQjtJQUNELE9BQU8sZ0NBQWMsQ0FBQyxnQkFBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFDaEQsQ0FBQztBQVRELHNDQVNDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILHFCQUE0QixTQUFjO0lBQ3hDLElBQU0sQ0FBQyxHQUFHLGtDQUFtQixFQUFFLENBQUM7SUFDaEMsSUFBSSxDQUFDLEVBQUU7UUFDTCxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsMEJBQWUsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ3pEO0lBQ0QsSUFBSSxnQ0FBdUIsQ0FBQyxTQUFTLGtCQUFpQixFQUFFO1FBQ3RELE9BQU8sU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQzdCO0lBQ0QsT0FBTyw0QkFBWSxDQUFDLGdCQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBVEQsa0NBU0M7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILDZCQUFvQyxpQkFBc0I7SUFDeEQsSUFBTSxDQUFDLEdBQUcsa0NBQW1CLEVBQUUsQ0FBQztJQUNoQyxJQUFJLENBQUMsRUFBRTtRQUNMLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQywwQkFBZSxDQUFDLFlBQVksRUFBRSxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUMxRTtJQUNELElBQUksZ0NBQXVCLENBQUMsaUJBQWlCLGtDQUF5QixFQUFFO1FBQ3RFLE9BQU8saUJBQWlCLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDckM7SUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLCtFQUErRSxDQUFDLENBQUM7QUFDbkcsQ0FBQztBQVRELGtEQVNDO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCx3QkFBK0IsWUFBaUI7SUFDOUMsSUFBTSxDQUFDLEdBQUcsa0NBQW1CLEVBQUUsQ0FBQztJQUNoQyxJQUFJLENBQUMsRUFBRTtRQUNMLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQywwQkFBZSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDL0Q7SUFDRCxJQUFJLGdDQUF1QixDQUFDLFlBQVksd0JBQW9CLEVBQUU7UUFDNUQsT0FBTyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDaEM7SUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQVRELHdDQVNDO0FBRUQ7OztHQUdHO0FBQ1UsUUFBQSxxQkFBcUIsR0FBSSxVQUFTLElBQVksRUFBRSxLQUFjO0lBQ3pFLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtRQUN2QixPQUFPLElBQUksS0FBSyxrQkFBa0IsSUFBSSxJQUFJLEtBQUssWUFBWSxJQUFJLElBQUksS0FBSyxjQUFjO1lBQ2xGLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxLQUFLLFFBQVEsSUFBSSxJQUFJLEtBQUssWUFBWTtZQUMvRCxJQUFJLEtBQUssa0JBQWtCLENBQUM7S0FDakM7SUFFRCxPQUFPLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5QixDQUFxQixDQUFDIn0=