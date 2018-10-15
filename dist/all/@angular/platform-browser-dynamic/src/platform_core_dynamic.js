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
var compiler_factory_1 = require("./compiler_factory");
/**
 * A platform that included corePlatform and the compiler.
 *
 * @experimental
 */
exports.platformCoreDynamic = core_1.createPlatformFactory(core_1.platformCore, 'coreDynamic', [
    { provide: core_1.COMPILER_OPTIONS, useValue: {}, multi: true },
    { provide: core_1.CompilerFactory, useClass: compiler_factory_1.JitCompilerFactory, deps: [core_1.COMPILER_OPTIONS] },
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm1fY29yZV9keW5hbWljLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci1keW5hbWljL3NyYy9wbGF0Zm9ybV9jb3JlX2R5bmFtaWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBa0k7QUFDbEksdURBQXNEO0FBRXREOzs7O0dBSUc7QUFDVSxRQUFBLG1CQUFtQixHQUFHLDRCQUFxQixDQUFDLG1CQUFZLEVBQUUsYUFBYSxFQUFFO0lBQ3BGLEVBQUMsT0FBTyxFQUFFLHVCQUFnQixFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQztJQUN0RCxFQUFDLE9BQU8sRUFBRSxzQkFBZSxFQUFFLFFBQVEsRUFBRSxxQ0FBa0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyx1QkFBZ0IsQ0FBQyxFQUFDO0NBQ25GLENBQUMsQ0FBQyJ9