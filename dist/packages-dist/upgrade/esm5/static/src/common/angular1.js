/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function noNg() {
    throw new Error('AngularJS v1.x is not loaded!');
}
var ɵ0 = function () { return noNg(); };
var noNgElement = (ɵ0);
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
export function setAngularLib(ng) {
    setAngularJSGlobal(ng);
}
/**
 * @deprecated Use `getAngularJSGlobal` instead.
 */
export function getAngularLib() {
    return getAngularJSGlobal();
}
/**
 * Resets the AngularJS global.
 *
 * Used when AngularJS is loaded lazily, and not available on `window`.
 */
export function setAngularJSGlobal(ng) {
    angular = ng;
    version = ng && ng.version;
}
/**
 * Returns the current AngularJS global.
 */
export function getAngularJSGlobal() {
    return angular;
}
export var bootstrap = function (e, modules, config) {
    return angular.bootstrap(e, modules, config);
};
export var module = function (prefix, dependencies) {
    return angular.module(prefix, dependencies);
};
export var element = (function (e) { return angular.element(e); });
element.cleanData = function (nodes) { return angular.element.cleanData(nodes); };
export var resumeBootstrap = function () { return angular.resumeBootstrap(); };
export var getTestability = function (e) { return angular.getTestability(e); };
export var version = angular.version;
export { ɵ0 };
//# sourceMappingURL=angular1.js.map