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
const ɵ0 = () => noNg();
const noNgElement = (ɵ0);
noNgElement.cleanData = noNg;
let angular = {
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
export const bootstrap = (e, modules, config) => angular.bootstrap(e, modules, config);
export const module = (prefix, dependencies) => angular.module(prefix, dependencies);
export const element = (e => angular.element(e));
element.cleanData = nodes => angular.element.cleanData(nodes);
export const resumeBootstrap = () => angular.resumeBootstrap();
export const getTestability = e => angular.getTestability(e);
export let version = angular.version;
export { ɵ0 };
//# sourceMappingURL=angular1.js.map