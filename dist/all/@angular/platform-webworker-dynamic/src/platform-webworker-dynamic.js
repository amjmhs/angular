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
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var version_1 = require("./version");
exports.VERSION = version_1.VERSION;
/**
 * @experimental API related to bootstrapping are still under review.
 */
exports.platformWorkerAppDynamic = core_1.createPlatformFactory(platform_browser_dynamic_1.ɵplatformCoreDynamic, 'workerAppDynamic', [
    {
        provide: core_1.COMPILER_OPTIONS,
        useValue: { providers: [{ provide: compiler_1.ResourceLoader, useClass: platform_browser_dynamic_1.ɵResourceLoaderImpl, deps: [] }] },
        multi: true
    },
    { provide: core_1.PLATFORM_ID, useValue: common_1.ɵPLATFORM_WORKER_UI_ID }
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0td2Vid29ya2VyLWR5bmFtaWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS13ZWJ3b3JrZXItZHluYW1pYy9zcmMvcGxhdGZvcm0td2Vid29ya2VyLWR5bmFtaWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwwQ0FBZ0Y7QUFDaEYsOENBQWlEO0FBQ2pELHNDQUFnSDtBQUNoSCw4RUFBeUk7QUFFekkscUNBQWtDO0FBQTFCLDRCQUFBLE9BQU8sQ0FBQTtBQUdmOztHQUVHO0FBQ1UsUUFBQSx3QkFBd0IsR0FDakMsNEJBQXFCLENBQUMsK0NBQW1CLEVBQUUsa0JBQWtCLEVBQUU7SUFDN0Q7UUFDRSxPQUFPLEVBQUUsdUJBQWdCO1FBQ3pCLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLHlCQUFjLEVBQUUsUUFBUSxFQUFFLDhDQUFrQixFQUFFLElBQUksRUFBRSxFQUFFLEVBQUMsQ0FBQyxFQUFDO1FBQzFGLEtBQUssRUFBRSxJQUFJO0tBQ1o7SUFDRCxFQUFDLE9BQU8sRUFBRSxrQkFBVyxFQUFFLFFBQVEsRUFBRSwrQkFBcUIsRUFBQztDQUN4RCxDQUFDLENBQUMifQ==