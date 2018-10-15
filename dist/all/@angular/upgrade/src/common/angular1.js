"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
function noNg() {
    throw new Error('AngularJS v1.x is not loaded!');
}
var noNgElement = (function () { return noNg(); });
noNgElement.cleanData = noNg;
var angular = {
    bootstrap: noNg,
    module: noNg,
    element: noNgElement,
    version: undefined,
    resumeBootstrap: noNg,
    getTestability: noNg
};
try {
    if (window.hasOwnProperty('angular')) {
        angular = window.angular;
    }
}
catch (e) {
    // ignore in CJS mode.
}
/**
 * @deprecated Use `setAngularJSGlobal` instead.
 */
function setAngularLib(ng) {
    setAngularJSGlobal(ng);
}
exports.setAngularLib = setAngularLib;
/**
 * @deprecated Use `getAngularJSGlobal` instead.
 */
function getAngularLib() {
    return getAngularJSGlobal();
}
exports.getAngularLib = getAngularLib;
/**
 * Resets the AngularJS global.
 *
 * Used when AngularJS is loaded lazily, and not available on `window`.
 */
function setAngularJSGlobal(ng) {
    angular = ng;
    exports.version = ng && ng.version;
}
exports.setAngularJSGlobal = setAngularJSGlobal;
/**
 * Returns the current AngularJS global.
 */
function getAngularJSGlobal() {
    return angular;
}
exports.getAngularJSGlobal = getAngularJSGlobal;
exports.bootstrap = function (e, modules, config) {
    return angular.bootstrap(e, modules, config);
};
exports.module = function (prefix, dependencies) {
    return angular.module(prefix, dependencies);
};
exports.element = (function (e) { return angular.element(e); });
exports.element.cleanData = function (nodes) { return angular.element.cleanData(nodes); };
exports.resumeBootstrap = function () { return angular.resumeBootstrap(); };
exports.getTestability = function (e) { return angular.getTestability(e); };
exports.version = angular.version;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcjEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3NyYy9jb21tb24vYW5ndWxhcjEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFrTkg7SUFDRSxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFDbkQsQ0FBQztBQUVELElBQU0sV0FBVyxHQUEyQixDQUFDLGNBQU0sT0FBQSxJQUFJLEVBQUUsRUFBTixDQUFNLENBQVEsQ0FBQztBQUNsRSxXQUFXLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztBQUU3QixJQUFJLE9BQU8sR0FXUDtJQUNGLFNBQVMsRUFBRSxJQUFJO0lBQ2YsTUFBTSxFQUFFLElBQUk7SUFDWixPQUFPLEVBQUUsV0FBVztJQUNwQixPQUFPLEVBQUUsU0FBZ0I7SUFDekIsZUFBZSxFQUFFLElBQUk7SUFDckIsY0FBYyxFQUFFLElBQUk7Q0FDckIsQ0FBQztBQUVGLElBQUk7SUFDRixJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFDcEMsT0FBTyxHQUFTLE1BQU8sQ0FBQyxPQUFPLENBQUM7S0FDakM7Q0FDRjtBQUFDLE9BQU8sQ0FBQyxFQUFFO0lBQ1Ysc0JBQXNCO0NBQ3ZCO0FBRUQ7O0dBRUc7QUFDSCx1QkFBOEIsRUFBTztJQUNuQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN6QixDQUFDO0FBRkQsc0NBRUM7QUFFRDs7R0FFRztBQUNIO0lBQ0UsT0FBTyxrQkFBa0IsRUFBRSxDQUFDO0FBQzlCLENBQUM7QUFGRCxzQ0FFQztBQUVEOzs7O0dBSUc7QUFDSCw0QkFBbUMsRUFBTztJQUN4QyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ2IsZUFBTyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDO0FBQzdCLENBQUM7QUFIRCxnREFHQztBQUVEOztHQUVHO0FBQ0g7SUFDRSxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBRkQsZ0RBRUM7QUFFWSxRQUFBLFNBQVMsR0FBNkIsVUFBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU87SUFDbkUsT0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDO0FBQXJDLENBQXFDLENBQUM7QUFFN0IsUUFBQSxNQUFNLEdBQTBCLFVBQUMsTUFBTSxFQUFFLFlBQWE7SUFDL0QsT0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUM7QUFBcEMsQ0FBb0MsQ0FBQztBQUU1QixRQUFBLE9BQU8sR0FBMkIsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQWxCLENBQWtCLENBQTJCLENBQUM7QUFDbkcsZUFBTyxDQUFDLFNBQVMsR0FBRyxVQUFBLEtBQUssSUFBSSxPQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFoQyxDQUFnQyxDQUFDO0FBRWpELFFBQUEsZUFBZSxHQUFtQyxjQUFNLE9BQUEsT0FBTyxDQUFDLGVBQWUsRUFBRSxFQUF6QixDQUF5QixDQUFDO0FBRWxGLFFBQUEsY0FBYyxHQUFrQyxVQUFBLENBQUMsSUFBSSxPQUFBLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQXpCLENBQXlCLENBQUM7QUFFakYsUUFBQSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyJ9