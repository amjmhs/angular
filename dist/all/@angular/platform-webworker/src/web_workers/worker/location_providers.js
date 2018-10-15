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
var platform_location_1 = require("./platform_location");
/**
 * The {@link PlatformLocation} providers that should be added when the {@link Location} is used in
 * a worker context.
 *
 * @experimental
 */
exports.WORKER_APP_LOCATION_PROVIDERS = [
    { provide: common_1.PlatformLocation, useClass: platform_location_1.WebWorkerPlatformLocation }, {
        provide: core_1.APP_INITIALIZER,
        useFactory: appInitFnFactory,
        multi: true,
        deps: [common_1.PlatformLocation, core_1.NgZone]
    },
    { provide: common_1.LOCATION_INITIALIZED, useFactory: locationInitialized, deps: [common_1.PlatformLocation] }
];
function locationInitialized(platformLocation) {
    return platformLocation.initialized;
}
exports.locationInitialized = locationInitialized;
function appInitFnFactory(platformLocation, zone) {
    return function () { return zone.runGuarded(function () { return platformLocation.init(); }); };
}
exports.appInitFnFactory = appInitFnFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYXRpb25fcHJvdmlkZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0td2Vid29ya2VyL3NyYy93ZWJfd29ya2Vycy93b3JrZXIvbG9jYXRpb25fcHJvdmlkZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMENBQXVFO0FBQ3ZFLHNDQUFzRTtBQUV0RSx5REFBOEQ7QUFHOUQ7Ozs7O0dBS0c7QUFDVSxRQUFBLDZCQUE2QixHQUFHO0lBQzNDLEVBQUMsT0FBTyxFQUFFLHlCQUFnQixFQUFFLFFBQVEsRUFBRSw2Q0FBeUIsRUFBQyxFQUFFO1FBQ2hFLE9BQU8sRUFBRSxzQkFBZTtRQUN4QixVQUFVLEVBQUUsZ0JBQWdCO1FBQzVCLEtBQUssRUFBRSxJQUFJO1FBQ1gsSUFBSSxFQUFFLENBQUMseUJBQWdCLEVBQUUsYUFBTSxDQUFDO0tBQ2pDO0lBQ0QsRUFBQyxPQUFPLEVBQUUsNkJBQW9CLEVBQUUsVUFBVSxFQUFFLG1CQUFtQixFQUFFLElBQUksRUFBRSxDQUFDLHlCQUFnQixDQUFDLEVBQUM7Q0FDM0YsQ0FBQztBQUVGLDZCQUFvQyxnQkFBMkM7SUFDN0UsT0FBTyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUM7QUFDdEMsQ0FBQztBQUZELGtEQUVDO0FBRUQsMEJBQWlDLGdCQUEyQyxFQUFFLElBQVk7SUFFeEYsT0FBTyxjQUFNLE9BQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFNLE9BQUEsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEVBQXZCLENBQXVCLENBQUMsRUFBOUMsQ0FBOEMsQ0FBQztBQUM5RCxDQUFDO0FBSEQsNENBR0MifQ==