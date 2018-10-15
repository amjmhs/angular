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
var platform_browser_1 = require("@angular/platform-browser");
var resource_loader_impl_1 = require("./resource_loader/resource_loader_impl");
exports.INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS = [
    platform_browser_1.ɵINTERNAL_BROWSER_PLATFORM_PROVIDERS,
    {
        provide: core_1.COMPILER_OPTIONS,
        useValue: { providers: [{ provide: compiler_1.ResourceLoader, useClass: resource_loader_impl_1.ResourceLoaderImpl, deps: [] }] },
        multi: true
    },
    { provide: core_1.PLATFORM_ID, useValue: common_1.ɵPLATFORM_BROWSER_ID },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm1fcHJvdmlkZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci1keW5hbWljL3NyYy9wbGF0Zm9ybV9wcm92aWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwwQ0FBNEU7QUFDNUUsOENBQWlEO0FBQ2pELHNDQUE0RTtBQUU1RSw4REFBc0g7QUFFdEgsK0VBQTBFO0FBRTdELFFBQUEsMkNBQTJDLEdBQXFCO0lBQzNFLHVEQUFtQztJQUNuQztRQUNFLE9BQU8sRUFBRSx1QkFBZ0I7UUFDekIsUUFBUSxFQUFFLEVBQUMsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUseUJBQWMsRUFBRSxRQUFRLEVBQUUseUNBQWtCLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQyxDQUFDLEVBQUM7UUFDMUYsS0FBSyxFQUFFLElBQUk7S0FDWjtJQUNELEVBQUMsT0FBTyxFQUFFLGtCQUFXLEVBQUUsUUFBUSxFQUFFLDZCQUFtQixFQUFDO0NBQ3RELENBQUMifQ==