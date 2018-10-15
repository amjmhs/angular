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
 * An interface for retrieving documents by URL that the compiler uses
 * to load templates.
 */
var ResourceLoader = /** @class */ (function () {
    function ResourceLoader() {
    }
    ResourceLoader.prototype.get = function (url) { return ''; };
    return ResourceLoader;
}());
exports.ResourceLoader = ResourceLoader;
//# sourceMappingURL=resource_loader.js.map