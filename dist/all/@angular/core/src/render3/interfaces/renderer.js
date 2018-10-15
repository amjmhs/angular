"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: cleanup once the code is merged in angular/angular
var RendererStyleFlags3;
(function (RendererStyleFlags3) {
    RendererStyleFlags3[RendererStyleFlags3["Important"] = 1] = "Important";
    RendererStyleFlags3[RendererStyleFlags3["DashCase"] = 2] = "DashCase";
})(RendererStyleFlags3 = exports.RendererStyleFlags3 || (exports.RendererStyleFlags3 = {}));
/** Returns whether the `renderer` is a `ProceduralRenderer3` */
function isProceduralRenderer(renderer) {
    return !!(renderer.listen);
}
exports.isProceduralRenderer = isProceduralRenderer;
exports.domRendererFactory3 = {
    createRenderer: function (hostElement, rendererType) { return document; }
};
// Note: This hack is necessary so we don't erroneously get a circular dependency
// failure based on types.
exports.unusedValueExportToPlacateAjd = 1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL2ludGVyZmFjZXMvcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFlSCwyREFBMkQ7QUFDM0QsSUFBWSxtQkFHWDtBQUhELFdBQVksbUJBQW1CO0lBQzdCLHVFQUFrQixDQUFBO0lBQ2xCLHFFQUFpQixDQUFBO0FBQ25CLENBQUMsRUFIVyxtQkFBbUIsR0FBbkIsMkJBQW1CLEtBQW5CLDJCQUFtQixRQUc5QjtBQW9CRCxnRUFBZ0U7QUFDaEUsOEJBQXFDLFFBQXVEO0lBRTFGLE9BQU8sQ0FBQyxDQUFDLENBQUUsUUFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0QyxDQUFDO0FBSEQsb0RBR0M7QUE4Q1ksUUFBQSxtQkFBbUIsR0FBcUI7SUFDbkQsY0FBYyxFQUFFLFVBQUMsV0FBNEIsRUFBRSxZQUFrQyxJQUM5QyxPQUFPLFFBQVEsQ0FBQyxDQUFBLENBQUM7Q0FDckQsQ0FBQztBQW9ERixpRkFBaUY7QUFDakYsMEJBQTBCO0FBQ2IsUUFBQSw2QkFBNkIsR0FBRyxDQUFDLENBQUMifQ==