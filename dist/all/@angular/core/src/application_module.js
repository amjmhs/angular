"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var application_init_1 = require("./application_init");
var application_ref_1 = require("./application_ref");
var application_tokens_1 = require("./application_tokens");
var change_detection_1 = require("./change_detection/change_detection");
var console_1 = require("./console");
var di_1 = require("./di");
var metadata_1 = require("./di/metadata");
var error_handler_1 = require("./error_handler");
var tokens_1 = require("./i18n/tokens");
var linker_1 = require("./linker");
var compiler_1 = require("./linker/compiler");
var metadata_2 = require("./metadata");
var zone_1 = require("./zone");
function _iterableDiffersFactory() {
    return change_detection_1.defaultIterableDiffers;
}
exports._iterableDiffersFactory = _iterableDiffersFactory;
function _keyValueDiffersFactory() {
    return change_detection_1.defaultKeyValueDiffers;
}
exports._keyValueDiffersFactory = _keyValueDiffersFactory;
function _localeFactory(locale) {
    return locale || 'en-US';
}
exports._localeFactory = _localeFactory;
/**
 * A built-in [dependency injection token](guide/glossary#di-token)
 * that is used to configure the root injector for bootstrapping.
 */
exports.APPLICATION_MODULE_PROVIDERS = [
    {
        provide: application_ref_1.ApplicationRef,
        useClass: application_ref_1.ApplicationRef,
        deps: [zone_1.NgZone, console_1.Console, di_1.Injector, error_handler_1.ErrorHandler, linker_1.ComponentFactoryResolver, application_init_1.ApplicationInitStatus]
    },
    {
        provide: application_init_1.ApplicationInitStatus,
        useClass: application_init_1.ApplicationInitStatus,
        deps: [[new metadata_1.Optional(), application_init_1.APP_INITIALIZER]]
    },
    { provide: compiler_1.Compiler, useClass: compiler_1.Compiler, deps: [] },
    application_tokens_1.APP_ID_RANDOM_PROVIDER,
    { provide: change_detection_1.IterableDiffers, useFactory: _iterableDiffersFactory, deps: [] },
    { provide: change_detection_1.KeyValueDiffers, useFactory: _keyValueDiffersFactory, deps: [] },
    {
        provide: tokens_1.LOCALE_ID,
        useFactory: _localeFactory,
        deps: [[new metadata_1.Inject(tokens_1.LOCALE_ID), new metadata_1.Optional(), new metadata_1.SkipSelf()]]
    },
];
/**
 * Configures the root injector for an app with
 * providers of `@angular/core` dependencies that `ApplicationRef` needs
 * to bootstrap components.
 *
 * Re-exported by `BrowserModule`, which is included automatically in the root
 * `AppModule` when you create a new app with the CLI `new` command.
 *
 * @experimental
 */
var ApplicationModule = /** @class */ (function () {
    // Inject ApplicationRef to make it eager...
    function ApplicationModule(appRef) {
    }
    ApplicationModule = __decorate([
        metadata_2.NgModule({ providers: exports.APPLICATION_MODULE_PROVIDERS }),
        __metadata("design:paramtypes", [application_ref_1.ApplicationRef])
    ], ApplicationModule);
    return ApplicationModule;
}());
exports.ApplicationModule = ApplicationModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb25fbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvYXBwbGljYXRpb25fbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsdURBQTBFO0FBQzFFLHFEQUFpRDtBQUNqRCwyREFBNEQ7QUFDNUQsd0VBQXFJO0FBQ3JJLHFDQUFrQztBQUNsQywyQkFBOEQ7QUFDOUQsMENBQXlEO0FBQ3pELGlEQUE2QztBQUM3Qyx3Q0FBd0M7QUFDeEMsbUNBQWtEO0FBQ2xELDhDQUEyQztBQUMzQyx1Q0FBb0M7QUFDcEMsK0JBQThCO0FBRTlCO0lBQ0UsT0FBTyx5Q0FBc0IsQ0FBQztBQUNoQyxDQUFDO0FBRkQsMERBRUM7QUFFRDtJQUNFLE9BQU8seUNBQXNCLENBQUM7QUFDaEMsQ0FBQztBQUZELDBEQUVDO0FBRUQsd0JBQStCLE1BQWU7SUFDNUMsT0FBTyxNQUFNLElBQUksT0FBTyxDQUFDO0FBQzNCLENBQUM7QUFGRCx3Q0FFQztBQUVEOzs7R0FHRztBQUNVLFFBQUEsNEJBQTRCLEdBQXFCO0lBQzVEO1FBQ0UsT0FBTyxFQUFFLGdDQUFjO1FBQ3ZCLFFBQVEsRUFBRSxnQ0FBYztRQUN4QixJQUFJLEVBQ0EsQ0FBQyxhQUFNLEVBQUUsaUJBQU8sRUFBRSxhQUFRLEVBQUUsNEJBQVksRUFBRSxpQ0FBd0IsRUFBRSx3Q0FBcUIsQ0FBQztLQUMvRjtJQUNEO1FBQ0UsT0FBTyxFQUFFLHdDQUFxQjtRQUM5QixRQUFRLEVBQUUsd0NBQXFCO1FBQy9CLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxtQkFBUSxFQUFFLEVBQUUsa0NBQWUsQ0FBQyxDQUFDO0tBQzFDO0lBQ0QsRUFBQyxPQUFPLEVBQUUsbUJBQVEsRUFBRSxRQUFRLEVBQUUsbUJBQVEsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDO0lBQ2pELDJDQUFzQjtJQUN0QixFQUFDLE9BQU8sRUFBRSxrQ0FBZSxFQUFFLFVBQVUsRUFBRSx1QkFBdUIsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDO0lBQ3pFLEVBQUMsT0FBTyxFQUFFLGtDQUFlLEVBQUUsVUFBVSxFQUFFLHVCQUF1QixFQUFFLElBQUksRUFBRSxFQUFFLEVBQUM7SUFDekU7UUFDRSxPQUFPLEVBQUUsa0JBQVM7UUFDbEIsVUFBVSxFQUFFLGNBQWM7UUFDMUIsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLGlCQUFNLENBQUMsa0JBQVMsQ0FBQyxFQUFFLElBQUksbUJBQVEsRUFBRSxFQUFFLElBQUksbUJBQVEsRUFBRSxDQUFDLENBQUM7S0FDaEU7Q0FDRixDQUFDO0FBRUY7Ozs7Ozs7OztHQVNHO0FBRUg7SUFDRSw0Q0FBNEM7SUFDNUMsMkJBQVksTUFBc0I7SUFBRyxDQUFDO0lBRjNCLGlCQUFpQjtRQUQ3QixtQkFBUSxDQUFDLEVBQUMsU0FBUyxFQUFFLG9DQUE0QixFQUFDLENBQUM7eUNBRzlCLGdDQUFjO09BRnZCLGlCQUFpQixDQUc3QjtJQUFELHdCQUFDO0NBQUEsQUFIRCxJQUdDO0FBSFksOENBQWlCIn0=