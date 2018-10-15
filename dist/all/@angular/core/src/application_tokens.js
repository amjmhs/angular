"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var di_1 = require("./di");
/**
 * A DI Token representing a unique string id assigned to the application by Angular and used
 * primarily for prefixing application attributes and CSS styles when
 * {@link ViewEncapsulation#Emulated ViewEncapsulation.Emulated} is being used.
 *
 * If you need to avoid randomly generated value to be used as an application id, you can provide
 * a custom value via a DI provider <!-- TODO: provider --> configuring the root {@link Injector}
 * using this token.
 * @experimental
 */
exports.APP_ID = new di_1.InjectionToken('AppId');
function _appIdRandomProviderFactory() {
    return "" + _randomChar() + _randomChar() + _randomChar();
}
exports._appIdRandomProviderFactory = _appIdRandomProviderFactory;
/**
 * Providers that will generate a random APP_ID_TOKEN.
 * @experimental
 */
exports.APP_ID_RANDOM_PROVIDER = {
    provide: exports.APP_ID,
    useFactory: _appIdRandomProviderFactory,
    deps: [],
};
function _randomChar() {
    return String.fromCharCode(97 + Math.floor(Math.random() * 25));
}
/**
 * A function that will be executed when a platform is initialized.
 * @experimental
 */
exports.PLATFORM_INITIALIZER = new di_1.InjectionToken('Platform Initializer');
/**
 * A token that indicates an opaque platform id.
 * @experimental
 */
exports.PLATFORM_ID = new di_1.InjectionToken('Platform ID');
/**
 * All callbacks provided via this token will be called for every component that is bootstrapped.
 * Signature of the callback:
 *
 * `(componentRef: ComponentRef) => void`.
 *
 * @experimental
 */
exports.APP_BOOTSTRAP_LISTENER = new di_1.InjectionToken('appBootstrapListener');
/**
 * A token which indicates the root directory of the application
 * @experimental
 */
exports.PACKAGE_ROOT_URL = new di_1.InjectionToken('Application Packages Root URL');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb25fdG9rZW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvYXBwbGljYXRpb25fdG9rZW5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMkJBQW9DO0FBSXBDOzs7Ozs7Ozs7R0FTRztBQUNVLFFBQUEsTUFBTSxHQUFHLElBQUksbUJBQWMsQ0FBUyxPQUFPLENBQUMsQ0FBQztBQUUxRDtJQUNFLE9BQU8sS0FBRyxXQUFXLEVBQUUsR0FBRyxXQUFXLEVBQUUsR0FBRyxXQUFXLEVBQUksQ0FBQztBQUM1RCxDQUFDO0FBRkQsa0VBRUM7QUFFRDs7O0dBR0c7QUFDVSxRQUFBLHNCQUFzQixHQUFHO0lBQ3BDLE9BQU8sRUFBRSxjQUFNO0lBQ2YsVUFBVSxFQUFFLDJCQUEyQjtJQUN2QyxJQUFJLEVBQVMsRUFBRTtDQUNoQixDQUFDO0FBRUY7SUFDRSxPQUFPLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEUsQ0FBQztBQUVEOzs7R0FHRztBQUNVLFFBQUEsb0JBQW9CLEdBQUcsSUFBSSxtQkFBYyxDQUFvQixzQkFBc0IsQ0FBQyxDQUFDO0FBRWxHOzs7R0FHRztBQUNVLFFBQUEsV0FBVyxHQUFHLElBQUksbUJBQWMsQ0FBUyxhQUFhLENBQUMsQ0FBQztBQUVyRTs7Ozs7OztHQU9HO0FBQ1UsUUFBQSxzQkFBc0IsR0FDL0IsSUFBSSxtQkFBYyxDQUE4QyxzQkFBc0IsQ0FBQyxDQUFDO0FBRTVGOzs7R0FHRztBQUNVLFFBQUEsZ0JBQWdCLEdBQUcsSUFBSSxtQkFBYyxDQUFTLCtCQUErQixDQUFDLENBQUMifQ==