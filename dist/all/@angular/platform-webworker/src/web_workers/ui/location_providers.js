"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var message_bus_1 = require("../shared/message_bus");
var serializer_1 = require("../shared/serializer");
var service_message_broker_1 = require("../shared/service_message_broker");
var platform_location_1 = require("./platform_location");
/**
 * A list of {@link Provider}s. To use the router in a Worker enabled application you must
 * include these providers when setting up the render thread.
 * @experimental
 */
exports.WORKER_UI_LOCATION_PROVIDERS = [
    { provide: platform_location_1.MessageBasedPlatformLocation, deps: [service_message_broker_1.ServiceMessageBrokerFactory,
            platform_browser_1.ɵBrowserPlatformLocation, message_bus_1.MessageBus, serializer_1.Serializer] },
    { provide: platform_browser_1.ɵBrowserPlatformLocation, deps: [common_1.DOCUMENT] },
    { provide: core_1.PLATFORM_INITIALIZER, useFactory: initUiLocation, multi: true, deps: [core_1.Injector] }
];
function initUiLocation(injector) {
    return function () {
        var zone = injector.get(core_1.NgZone);
        zone.runGuarded(function () { return injector.get(platform_location_1.MessageBasedPlatformLocation).start(); });
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYXRpb25fcHJvdmlkZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0td2Vid29ya2VyL3NyYy93ZWJfd29ya2Vycy91aS9sb2NhdGlvbl9wcm92aWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwwQ0FBeUM7QUFDekMsc0NBQXFGO0FBQ3JGLDhEQUE4RjtBQUU5RixxREFBaUQ7QUFDakQsbURBQWdEO0FBQ2hELDJFQUE2RTtBQUU3RSx5REFBaUU7QUFJakU7Ozs7R0FJRztBQUNVLFFBQUEsNEJBQTRCLEdBQXFCO0lBQzVELEVBQUMsT0FBTyxFQUFFLGdEQUE0QixFQUFFLElBQUksRUFBRSxDQUFDLG9EQUEyQjtZQUN4RSwyQ0FBdUIsRUFBRSx3QkFBVSxFQUFFLHVCQUFVLENBQUMsRUFBQztJQUNuRCxFQUFDLE9BQU8sRUFBRSwyQ0FBdUIsRUFBRSxJQUFJLEVBQUUsQ0FBQyxpQkFBUSxDQUFDLEVBQUM7SUFDcEQsRUFBQyxPQUFPLEVBQUUsMkJBQW9CLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLGVBQVEsQ0FBQyxFQUFDO0NBQzNGLENBQUM7QUFFRix3QkFBd0IsUUFBa0I7SUFDeEMsT0FBTztRQUNMLElBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQVMsYUFBTSxDQUFDLENBQUM7UUFFMUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFNLE9BQUEsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnREFBNEIsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFsRCxDQUFrRCxDQUFDLENBQUM7SUFDNUUsQ0FBQyxDQUFDO0FBQ0osQ0FBQyJ9