"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var compiler_factory_1 = require("./compiler_factory");
/**
 * Platform for dynamic tests
 *
 * @experimental
 */
exports.platformCoreDynamicTesting = core_1.createPlatformFactory(platform_browser_dynamic_1.ɵplatformCoreDynamic, 'coreDynamicTesting', [
    { provide: core_1.COMPILER_OPTIONS, useValue: { providers: compiler_factory_1.COMPILER_PROVIDERS }, multi: true }, {
        provide: testing_1.ɵTestingCompilerFactory,
        useClass: compiler_factory_1.TestingCompilerFactoryImpl,
        deps: [core_1.Injector, core_1.CompilerFactory]
    }
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm1fY29yZV9keW5hbWljX3Rlc3RpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyLWR5bmFtaWMvdGVzdGluZy9zcmMvcGxhdGZvcm1fY29yZV9keW5hbWljX3Rlc3RpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBOEg7QUFDOUgsaURBQStHO0FBQy9HLDhFQUE4RjtBQUU5Rix1REFBa0Y7QUFFbEY7Ozs7R0FJRztBQUNVLFFBQUEsMEJBQTBCLEdBQ25DLDRCQUFxQixDQUFDLCtDQUFtQixFQUFFLG9CQUFvQixFQUFFO0lBQy9ELEVBQUMsT0FBTyxFQUFFLHVCQUFnQixFQUFFLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxxQ0FBa0IsRUFBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsRUFBRTtRQUNuRixPQUFPLEVBQUUsaUNBQXNCO1FBQy9CLFFBQVEsRUFBRSw2Q0FBMEI7UUFDcEMsSUFBSSxFQUFFLENBQUMsZUFBUSxFQUFFLHNCQUFlLENBQUM7S0FDbEM7Q0FDRixDQUFDLENBQUMifQ==