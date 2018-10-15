/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * \@description Represents the version of Angular
 *
 *
 */
var /**
 * \@description Represents the version of Angular
 *
 *
 */
Version = /** @class */ (function () {
    function Version(full) {
        this.full = full;
        this.major = full.split('.')[0];
        this.minor = full.split('.')[1];
        this.patch = full.split('.').slice(2).join('.');
    }
    return Version;
}());
/**
 * \@description Represents the version of Angular
 *
 *
 */
export { Version };
if (false) {
    /** @type {?} */
    Version.prototype.major;
    /** @type {?} */
    Version.prototype.minor;
    /** @type {?} */
    Version.prototype.patch;
    /** @type {?} */
    Version.prototype.full;
}
/** @type {?} */
export var VERSION = new Version('0.0.0-PLACEHOLDER');
//# sourceMappingURL=version.js.map