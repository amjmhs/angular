"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
var platform_core_dynamic_1 = require("./platform_core_dynamic");
var platform_providers_1 = require("./platform_providers");
var resource_loader_cache_1 = require("./resource_loader/resource_loader_cache");
__export(require("./private_export"));
var version_1 = require("./version");
exports.VERSION = version_1.VERSION;
var compiler_factory_1 = require("./compiler_factory");
exports.JitCompilerFactory = compiler_factory_1.JitCompilerFactory;
/**
 * @experimental
 */
exports.RESOURCE_CACHE_PROVIDER = [{ provide: compiler_1.ResourceLoader, useClass: resource_loader_cache_1.CachedResourceLoader, deps: [] }];
exports.platformBrowserDynamic = core_1.createPlatformFactory(platform_core_dynamic_1.platformCoreDynamic, 'browserDynamic', platform_providers_1.INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0tYnJvd3Nlci1keW5hbWljLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci1keW5hbWljL3NyYy9wbGF0Zm9ybS1icm93c2VyLWR5bmFtaWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7QUFFSCw4Q0FBaUQ7QUFDakQsc0NBQTBIO0FBRTFILGlFQUE0RDtBQUM1RCwyREFBaUY7QUFDakYsaUZBQTZFO0FBRTdFLHNDQUFpQztBQUNqQyxxQ0FBa0M7QUFBMUIsNEJBQUEsT0FBTyxDQUFBO0FBQ2YsdURBQXNEO0FBQTlDLGdEQUFBLGtCQUFrQixDQUFBO0FBRTFCOztHQUVHO0FBQ1UsUUFBQSx1QkFBdUIsR0FDaEMsQ0FBQyxFQUFDLE9BQU8sRUFBRSx5QkFBYyxFQUFFLFFBQVEsRUFBRSw0Q0FBb0IsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQztBQUU3RCxRQUFBLHNCQUFzQixHQUFHLDRCQUFxQixDQUN2RCwyQ0FBbUIsRUFBRSxnQkFBZ0IsRUFBRSxnRUFBMkMsQ0FBQyxDQUFDIn0=