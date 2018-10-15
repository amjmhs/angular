"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module
 * @description
 * Entry point for all public APIs of this package. allowing
 * Angular 1 and Angular 2+ to run side by side in the same application.
 */
var angular1_1 = require("./src/common/angular1");
exports.getAngularJSGlobal = angular1_1.getAngularJSGlobal;
exports.getAngularLib = angular1_1.getAngularLib;
exports.setAngularJSGlobal = angular1_1.setAngularJSGlobal;
exports.setAngularLib = angular1_1.setAngularLib;
var downgrade_component_1 = require("./src/common/downgrade_component");
exports.downgradeComponent = downgrade_component_1.downgradeComponent;
var downgrade_injectable_1 = require("./src/common/downgrade_injectable");
exports.downgradeInjectable = downgrade_injectable_1.downgradeInjectable;
var version_1 = require("./src/common/version");
exports.VERSION = version_1.VERSION;
var downgrade_module_1 = require("./src/static/downgrade_module");
exports.downgradeModule = downgrade_module_1.downgradeModule;
var upgrade_component_1 = require("./src/static/upgrade_component");
exports.UpgradeComponent = upgrade_component_1.UpgradeComponent;
var upgrade_module_1 = require("./src/static/upgrade_module");
exports.UpgradeModule = upgrade_module_1.UpgradeModule;
// This file only re-exports content of the `src` folder. Keep it that way.
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljX2FwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvc3RhdGljL3B1YmxpY19hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSDs7Ozs7R0FLRztBQUNILGtEQUEyRztBQUFuRyx3Q0FBQSxrQkFBa0IsQ0FBQTtBQUFFLG1DQUFBLGFBQWEsQ0FBQTtBQUFFLHdDQUFBLGtCQUFrQixDQUFBO0FBQUUsbUNBQUEsYUFBYSxDQUFBO0FBQzVFLHdFQUFvRTtBQUE1RCxtREFBQSxrQkFBa0IsQ0FBQTtBQUMxQiwwRUFBc0U7QUFBOUQscURBQUEsbUJBQW1CLENBQUE7QUFDM0IsZ0RBQTZDO0FBQXJDLDRCQUFBLE9BQU8sQ0FBQTtBQUNmLGtFQUE4RDtBQUF0RCw2Q0FBQSxlQUFlLENBQUE7QUFDdkIsb0VBQWdFO0FBQXhELCtDQUFBLGdCQUFnQixDQUFBO0FBQ3hCLDhEQUEwRDtBQUFsRCx5Q0FBQSxhQUFhLENBQUE7QUFHckIsMkVBQTJFIn0=