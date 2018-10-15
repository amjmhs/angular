"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
/**
 * This component is used internally within the router to be a placeholder when an empty
 * router-outlet is needed. For example, with a config such as:
 *
 * `{path: 'parent', outlet: 'nav', children: [...]}`
 *
 * In order to render, there needs to be a component on this config, which will default
 * to this `EmptyOutletComponent`.
 */
var EmptyOutletComponent = /** @class */ (function () {
    function EmptyOutletComponent() {
    }
    EmptyOutletComponent = __decorate([
        core_1.Component({ template: "<router-outlet></router-outlet>" })
    ], EmptyOutletComponent);
    return EmptyOutletComponent;
}());
exports.EmptyOutletComponent = EmptyOutletComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1wdHlfb3V0bGV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3NyYy9jb21wb25lbnRzL2VtcHR5X291dGxldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNDQUF3QztBQUV4Qzs7Ozs7Ozs7R0FRRztBQUVIO0lBQUE7SUFDQSxDQUFDO0lBRFksb0JBQW9CO1FBRGhDLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsaUNBQWlDLEVBQUMsQ0FBQztPQUM1QyxvQkFBb0IsQ0FDaEM7SUFBRCwyQkFBQztDQUFBLEFBREQsSUFDQztBQURZLG9EQUFvQiJ9