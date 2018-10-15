"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var di_1 = require("../di");
/**
 * @deprecated Use `RendererType2` (and `Renderer2`) instead.
 */
var RenderComponentType = /** @class */ (function () {
    function RenderComponentType(id, templateUrl, slotCount, encapsulation, styles, animations) {
        this.id = id;
        this.templateUrl = templateUrl;
        this.slotCount = slotCount;
        this.encapsulation = encapsulation;
        this.styles = styles;
        this.animations = animations;
    }
    return RenderComponentType;
}());
exports.RenderComponentType = RenderComponentType;
/**
 * @deprecated Debug info is handeled internally in the view engine now.
 */
var RenderDebugInfo = /** @class */ (function () {
    function RenderDebugInfo() {
    }
    return RenderDebugInfo;
}());
exports.RenderDebugInfo = RenderDebugInfo;
/**
 * @deprecated Use the `Renderer2` instead.
 */
var Renderer = /** @class */ (function () {
    function Renderer() {
    }
    return Renderer;
}());
exports.Renderer = Renderer;
exports.Renderer2Interceptor = new di_1.InjectionToken('Renderer2Interceptor');
/**
 * Injectable service that provides a low-level interface for modifying the UI.
 *
 * Use this service to bypass Angular's templating and make custom UI changes that can't be
 * expressed declaratively. For example if you need to set a property or an attribute whose name is
 * not statically known, use {@link Renderer#setElementProperty setElementProperty} or
 * {@link Renderer#setElementAttribute setElementAttribute} respectively.
 *
 * If you are implementing a custom renderer, you must implement this interface.
 *
 * The default Renderer implementation is `DomRenderer`. Also available is `WebWorkerRenderer`.
 *
 * @deprecated Use `RendererFactory2` instead.
 */
var RootRenderer = /** @class */ (function () {
    function RootRenderer() {
    }
    return RootRenderer;
}());
exports.RootRenderer = RootRenderer;
/**
 * Creates and initializes a custom renderer that implements the `Renderer2` base class.
 *
 * @experimental
 */
var RendererFactory2 = /** @class */ (function () {
    function RendererFactory2() {
    }
    return RendererFactory2;
}());
exports.RendererFactory2 = RendererFactory2;
/**
 * Flags for renderer-specific style modifiers.
 * @experimental
 */
var RendererStyleFlags2;
(function (RendererStyleFlags2) {
    /**
     * Marks a style as important.
     */
    RendererStyleFlags2[RendererStyleFlags2["Important"] = 1] = "Important";
    /**
     * Marks a style as using dash case naming (this-is-dash-case).
     */
    RendererStyleFlags2[RendererStyleFlags2["DashCase"] = 2] = "DashCase";
})(RendererStyleFlags2 = exports.RendererStyleFlags2 || (exports.RendererStyleFlags2 = {}));
/**
 * Extend this base class to implement custom rendering. By default, Angular
 * renders a template into DOM. You can use custom rendering to intercept
 * rendering calls, or to render to something other than DOM.
 *
 * Create your custom renderer using `RendererFactory2`.
 *
 * Use a custom renderer to bypass Angular's templating and
 * make custom UI changes that can't be expressed declaratively.
 * For example if you need to set a property or an attribute whose name is
 * not statically known, use the `setProperty()` or
 * `setAttribute()` method.
 *
 * @experimental
 */
var Renderer2 = /** @class */ (function () {
    function Renderer2() {
    }
    return Renderer2;
}());
exports.Renderer2 = Renderer2;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvcmVuZGVyL2FwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDRCQUErQztBQUcvQzs7R0FFRztBQUNIO0lBQ0UsNkJBQ1csRUFBVSxFQUFTLFdBQW1CLEVBQVMsU0FBaUIsRUFDaEUsYUFBZ0MsRUFBUyxNQUEyQixFQUNwRSxVQUFlO1FBRmYsT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUFTLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBQVMsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUNoRSxrQkFBYSxHQUFiLGFBQWEsQ0FBbUI7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFxQjtRQUNwRSxlQUFVLEdBQVYsVUFBVSxDQUFLO0lBQUcsQ0FBQztJQUNoQywwQkFBQztBQUFELENBQUMsQUFMRCxJQUtDO0FBTFksa0RBQW1CO0FBT2hDOztHQUVHO0FBQ0g7SUFBQTtJQU9BLENBQUM7SUFBRCxzQkFBQztBQUFELENBQUMsQUFQRCxJQU9DO0FBUHFCLDBDQUFlO0FBb0JyQzs7R0FFRztBQUNIO0lBQUE7SUE2Q0EsQ0FBQztJQUFELGVBQUM7QUFBRCxDQUFDLEFBN0NELElBNkNDO0FBN0NxQiw0QkFBUTtBQStDakIsUUFBQSxvQkFBb0IsR0FBRyxJQUFJLG1CQUFjLENBQWMsc0JBQXNCLENBQUMsQ0FBQztBQUU1Rjs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0g7SUFBQTtJQUVBLENBQUM7SUFBRCxtQkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRnFCLG9DQUFZO0FBcUNsQzs7OztHQUlHO0FBQ0g7SUFBQTtJQXFCQSxDQUFDO0lBQUQsdUJBQUM7QUFBRCxDQUFDLEFBckJELElBcUJDO0FBckJxQiw0Q0FBZ0I7QUF1QnRDOzs7R0FHRztBQUNILElBQVksbUJBU1g7QUFURCxXQUFZLG1CQUFtQjtJQUM3Qjs7T0FFRztJQUNILHVFQUFrQixDQUFBO0lBQ2xCOztPQUVHO0lBQ0gscUVBQWlCLENBQUE7QUFDbkIsQ0FBQyxFQVRXLG1CQUFtQixHQUFuQiwyQkFBbUIsS0FBbkIsMkJBQW1CLFFBUzlCO0FBRUQ7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSDtJQUFBO0lBOEpBLENBQUM7SUFBRCxnQkFBQztBQUFELENBQUMsQUE5SkQsSUE4SkM7QUE5SnFCLDhCQUFTIn0=