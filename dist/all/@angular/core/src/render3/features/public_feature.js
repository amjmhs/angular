"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var di_1 = require("../di");
/**
 * This feature publishes the directive (or component) into the DI system, making it visible to
 * others for injection.
 *
 * @param definition
 */
function PublicFeature(definition) {
    definition.diPublic = di_1.diPublic;
}
exports.PublicFeature = PublicFeature;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljX2ZlYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL2ZlYXR1cmVzL3B1YmxpY19mZWF0dXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsNEJBQStCO0FBRy9COzs7OztHQUtHO0FBQ0gsdUJBQWlDLFVBQW1DO0lBQ2xFLFVBQVUsQ0FBQyxRQUFRLEdBQUcsYUFBUSxDQUFDO0FBQ2pDLENBQUM7QUFGRCxzQ0FFQyJ9