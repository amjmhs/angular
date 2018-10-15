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
// #docregion LowerUpperPipe
var LowerUpperPipeComponent = /** @class */ (function () {
    function LowerUpperPipeComponent() {
    }
    LowerUpperPipeComponent.prototype.change = function (value) { this.value = value; };
    LowerUpperPipeComponent = __decorate([
        core_1.Component({
            selector: 'lowerupper-pipe',
            template: "<div>\n    <label>Name: </label><input #name (keyup)=\"change(name.value)\" type=\"text\">\n    <p>In lowercase: <pre>'{{value | lowercase}}'</pre>\n    <p>In uppercase: <pre>'{{value | uppercase}}'</pre>\n  </div>"
        })
    ], LowerUpperPipeComponent);
    return LowerUpperPipeComponent;
}());
exports.LowerUpperPipeComponent = LowerUpperPipeComponent;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG93ZXJ1cHBlcl9waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29tbW9uL3BpcGVzL3RzL2xvd2VydXBwZXJfcGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNDQUF3QztBQUV4Qyw0QkFBNEI7QUFTNUI7SUFBQTtJQUlBLENBQUM7SUFEQyx3Q0FBTSxHQUFOLFVBQU8sS0FBYSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUhsQyx1QkFBdUI7UUFSbkMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsUUFBUSxFQUFFLHdOQUlIO1NBQ1IsQ0FBQztPQUNXLHVCQUF1QixDQUluQztJQUFELDhCQUFDO0NBQUEsQUFKRCxJQUlDO0FBSlksMERBQXVCO0FBS3BDLGdCQUFnQiJ9