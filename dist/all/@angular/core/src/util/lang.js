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
 * Determine if the argument is shaped like a Promise
 */
function isPromise(obj) {
    // allow any Promise/A+ compliant thenable.
    // It's up to the caller to ensure that obj.then conforms to the spec
    return !!obj && typeof obj.then === 'function';
}
exports.isPromise = isPromise;
/**
 * Determine if the argument is an Observable
 */
function isObservable(obj) {
    // TODO: use Symbol.observable when https://github.com/ReactiveX/rxjs/issues/2415 will be resolved
    return !!obj && typeof obj.subscribe === 'function';
}
exports.isObservable = isObservable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3V0aWwvbGFuZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUlIOztHQUVHO0FBQ0gsbUJBQTBCLEdBQVE7SUFDaEMsMkNBQTJDO0lBQzNDLHFFQUFxRTtJQUNyRSxPQUFPLENBQUMsQ0FBQyxHQUFHLElBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxLQUFLLFVBQVUsQ0FBQztBQUNqRCxDQUFDO0FBSkQsOEJBSUM7QUFFRDs7R0FFRztBQUNILHNCQUE2QixHQUEwQjtJQUNyRCxrR0FBa0c7SUFDbEcsT0FBTyxDQUFDLENBQUMsR0FBRyxJQUFJLE9BQU8sR0FBRyxDQUFDLFNBQVMsS0FBSyxVQUFVLENBQUM7QUFDdEQsQ0FBQztBQUhELG9DQUdDIn0=