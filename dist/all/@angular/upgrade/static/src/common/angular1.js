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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcjEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3N0YXRpYy9zcmMvY29tbW9uL2FuZ3VsYXIxLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBa05IO0lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFFRCxJQUFNLFdBQVcsR0FBMkIsQ0FBQyxjQUFNLE9BQUEsSUFBSSxFQUFFLEVBQU4sQ0FBTSxDQUFRLENBQUM7QUFDbEUsV0FBVyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFFN0IsSUFBSSxPQUFPLEdBV1A7SUFDRixTQUFTLEVBQUUsSUFBSTtJQUNmLE1BQU0sRUFBRSxJQUFJO0lBQ1osT0FBTyxFQUFFLFdBQVc7SUFDcEIsT0FBTyxFQUFFLFNBQWdCO0lBQ3pCLGVBQWUsRUFBRSxJQUFJO0lBQ3JCLGNBQWMsRUFBRSxJQUFJO0NBQ3JCLENBQUM7QUFFRixJQUFJO0lBQ0YsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQ3BDLE9BQU8sR0FBUyxNQUFPLENBQUMsT0FBTyxDQUFDO0tBQ2pDO0NBQ0Y7QUFBQyxPQUFPLENBQUMsRUFBRTtJQUNWLHNCQUFzQjtDQUN2QjtBQUVEOztHQUVHO0FBQ0gsdUJBQThCLEVBQU87SUFDbkMsa0JBQWtCLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDekIsQ0FBQztBQUZELHNDQUVDO0FBRUQ7O0dBRUc7QUFDSDtJQUNFLE9BQU8sa0JBQWtCLEVBQUUsQ0FBQztBQUM5QixDQUFDO0FBRkQsc0NBRUM7QUFFRDs7OztHQUlHO0FBQ0gsNEJBQW1DLEVBQU87SUFDeEMsT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNiLGVBQU8sR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQztBQUM3QixDQUFDO0FBSEQsZ0RBR0M7QUFFRDs7R0FFRztBQUNIO0lBQ0UsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQztBQUZELGdEQUVDO0FBRVksUUFBQSxTQUFTLEdBQTZCLFVBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFPO0lBQ25FLE9BQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQztBQUFyQyxDQUFxQyxDQUFDO0FBRTdCLFFBQUEsTUFBTSxHQUEwQixVQUFDLE1BQU0sRUFBRSxZQUFhO0lBQy9ELE9BQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDO0FBQXBDLENBQW9DLENBQUM7QUFFNUIsUUFBQSxPQUFPLEdBQTJCLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFsQixDQUFrQixDQUEyQixDQUFDO0FBQ25HLGVBQU8sQ0FBQyxTQUFTLEdBQUcsVUFBQSxLQUFLLElBQUksT0FBQSxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBaEMsQ0FBZ0MsQ0FBQztBQUVqRCxRQUFBLGVBQWUsR0FBbUMsY0FBTSxPQUFBLE9BQU8sQ0FBQyxlQUFlLEVBQUUsRUFBekIsQ0FBeUIsQ0FBQztBQUVsRixRQUFBLGNBQWMsR0FBa0MsVUFBQSxDQUFDLElBQUksT0FBQSxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUF6QixDQUF5QixDQUFDO0FBRWpGLFFBQUEsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMifQ==