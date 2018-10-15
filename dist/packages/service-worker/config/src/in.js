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
/** @typedef {?} */
var Glob;
export { Glob };
/** @typedef {?} */
var Duration;
export { Duration };
/**
 * A top-level Angular Service Worker configuration object.
 *
 * \@experimental
 * @record
 */
export function Config() { }
/** @type {?|undefined} */
Config.prototype.appData;
/** @type {?} */
Config.prototype.index;
/** @type {?|undefined} */
Config.prototype.assetGroups;
/** @type {?|undefined} */
Config.prototype.dataGroups;
/** @type {?|undefined} */
Config.prototype.navigationUrls;
/**
 * Configuration for a particular group of assets.
 *
 * \@experimental
 * @record
 */
export function AssetGroup() { }
/** @type {?} */
AssetGroup.prototype.name;
/** @type {?|undefined} */
AssetGroup.prototype.installMode;
/** @type {?|undefined} */
AssetGroup.prototype.updateMode;
/** @type {?} */
AssetGroup.prototype.resources;
/**
 * Configuration for a particular group of dynamic URLs.
 *
 * \@experimental
 * @record
 */
export function DataGroup() { }
/** @type {?} */
DataGroup.prototype.name;
/** @type {?} */
DataGroup.prototype.urls;
/** @type {?|undefined} */
DataGroup.prototype.version;
/** @type {?} */
DataGroup.prototype.cacheConfig;
//# sourceMappingURL=in.js.map