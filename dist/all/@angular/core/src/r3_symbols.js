"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * This file exists to support compilation of @angular/core in Ivy mode.
 *
 * When the Angular compiler processes a compilation unit, it normally writes imports to
 * @angular/core. When compiling the core package itself this strategy isn't usable. Instead, the
 * compiler writes imports to this file.
 *
 * Only a subset of such imports are supported - core is not allowed to declare components or pipes.
 * A check in ngtsc's translator.ts validates this condition.
 *
 * The below symbols are used for @Injectable and @NgModule compilation.
 */
var defs_1 = require("./di/defs");
exports.defineInjectable = defs_1.defineInjectable;
exports.defineInjector = defs_1.defineInjector;
var injector_1 = require("./di/injector");
exports.inject = injector_1.inject;
var definition_1 = require("./render3/definition");
exports.ɵdefineNgModule = definition_1.defineNgModule;
/**
 * The existence of this constant (in this particular file) informs the Angular compiler that the
 * current program is actually @angular/core, which needs to be compiled specially.
 */
exports.ITS_JUST_ANGULAR = true;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfc3ltYm9scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3IzX3N5bWJvbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSDs7Ozs7Ozs7Ozs7R0FXRztBQUVILGtDQUF5SDtBQUFuRCxrQ0FBQSxnQkFBZ0IsQ0FBQTtBQUFFLGdDQUFBLGNBQWMsQ0FBQTtBQUN0RywwQ0FBcUM7QUFBN0IsNEJBQUEsTUFBTSxDQUFBO0FBRWQsbURBQXVFO0FBQS9ELHVDQUFBLGNBQWMsQ0FBbUI7QUFHekM7OztHQUdHO0FBQ1UsUUFBQSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMifQ==