"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="node" />
var path = require("path");
var TS_DTS_EXTENSION = /(\.d)?\.ts$/;
function relativePathBetween(from, to) {
    var relative = path.posix.relative(path.dirname(from), to).replace(TS_DTS_EXTENSION, '');
    if (relative === '') {
        return null;
    }
    // path.relative() does not include the leading './'.
    if (!relative.startsWith('.')) {
        relative = "./" + relative;
    }
    return relative;
}
exports.relativePathBetween = relativePathBetween;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvdXRpbC9zcmMvcGF0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDhCQUE4QjtBQUU5QiwyQkFBNkI7QUFFN0IsSUFBTSxnQkFBZ0IsR0FBRyxhQUFhLENBQUM7QUFFdkMsNkJBQW9DLElBQVksRUFBRSxFQUFVO0lBQzFELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRXpGLElBQUksUUFBUSxLQUFLLEVBQUUsRUFBRTtRQUNuQixPQUFPLElBQUksQ0FBQztLQUNiO0lBRUQscURBQXFEO0lBQ3JELElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQzdCLFFBQVEsR0FBRyxPQUFLLFFBQVUsQ0FBQztLQUM1QjtJQUVELE9BQU8sUUFBUSxDQUFDO0FBQ2xCLENBQUM7QUFiRCxrREFhQyJ9