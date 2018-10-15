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
 * @experimental Animation support is experimental.
 */
var AnimationStyleNormalizer = /** @class */ (function () {
    function AnimationStyleNormalizer() {
    }
    return AnimationStyleNormalizer;
}());
exports.AnimationStyleNormalizer = AnimationStyleNormalizer;
/**
 * @experimental Animation support is experimental.
 */
var NoopAnimationStyleNormalizer = /** @class */ (function () {
    function NoopAnimationStyleNormalizer() {
    }
    NoopAnimationStyleNormalizer.prototype.normalizePropertyName = function (propertyName, errors) { return propertyName; };
    NoopAnimationStyleNormalizer.prototype.normalizeStyleValue = function (userProvidedProperty, normalizedProperty, value, errors) {
        return value;
    };
    return NoopAnimationStyleNormalizer;
}());
exports.NoopAnimationStyleNormalizer = NoopAnimationStyleNormalizer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3N0eWxlX25vcm1hbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvc3JjL2RzbC9zdHlsZV9ub3JtYWxpemF0aW9uL2FuaW1hdGlvbl9zdHlsZV9ub3JtYWxpemVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUg7O0dBRUc7QUFDSDtJQUFBO0lBS0EsQ0FBQztJQUFELCtCQUFDO0FBQUQsQ0FBQyxBQUxELElBS0M7QUFMcUIsNERBQXdCO0FBTzlDOztHQUVHO0FBQ0g7SUFBQTtJQVFBLENBQUM7SUFQQyw0REFBcUIsR0FBckIsVUFBc0IsWUFBb0IsRUFBRSxNQUFnQixJQUFZLE9BQU8sWUFBWSxDQUFDLENBQUMsQ0FBQztJQUU5RiwwREFBbUIsR0FBbkIsVUFDSSxvQkFBNEIsRUFBRSxrQkFBMEIsRUFBRSxLQUFvQixFQUM5RSxNQUFnQjtRQUNsQixPQUFZLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBQ0gsbUNBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQVJZLG9FQUE0QiJ9