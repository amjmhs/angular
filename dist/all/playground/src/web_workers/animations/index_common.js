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
var animations_1 = require("@angular/animations");
var core_1 = require("@angular/core");
var AnimationCmp = /** @class */ (function () {
    function AnimationCmp() {
        this.animate = false;
    }
    AnimationCmp = __decorate([
        core_1.Component({
            selector: 'animation-app',
            styles: ["\n    .box {\n      border:10px solid black;\n      text-align:center;\n      overflow:hidden;\n      background:red;\n      color:white;\n      font-size:100px;\n      line-height:200px;\n    }\n  "],
            animations: [animations_1.trigger('animate', [
                    animations_1.state('off', animations_1.style({ width: '0px' })), animations_1.state('on', animations_1.style({ width: '750px' })),
                    animations_1.transition('off <=> on', animations_1.animate(500))
                ])],
            template: "\n    <button (click)=\"animate=!animate\">\n      Start Animation \n    </button>\n    \n    <div class=\"box\" [@animate]=\"animate ? 'on' : 'off'\">\n      ... \n    </div>\n  "
        })
    ], AnimationCmp);
    return AnimationCmp;
}());
exports.AnimationCmp = AnimationCmp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL3NyYy93ZWJfd29ya2Vycy9hbmltYXRpb25zL2luZGV4X2NvbW1vbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILGtEQUErRTtBQUMvRSxzQ0FBd0M7QUErQnhDO0lBN0JBO1FBOEJFLFlBQU8sR0FBRyxLQUFLLENBQUM7SUFDbEIsQ0FBQztJQUZZLFlBQVk7UUE3QnhCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsZUFBZTtZQUN6QixNQUFNLEVBQUUsQ0FBQyx3TUFVUixDQUFDO1lBQ0YsVUFBVSxFQUFFLENBQUMsb0JBQU8sQ0FDaEIsU0FBUyxFQUNUO29CQUNFLGtCQUFLLENBQUMsS0FBSyxFQUFFLGtCQUFLLENBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxFQUFFLGtCQUFLLENBQUMsSUFBSSxFQUFFLGtCQUFLLENBQUMsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztvQkFDekUsdUJBQVUsQ0FBQyxZQUFZLEVBQUUsb0JBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDdkMsQ0FBQyxDQUFDO1lBQ1AsUUFBUSxFQUFFLHFMQVFUO1NBQ0YsQ0FBQztPQUNXLFlBQVksQ0FFeEI7SUFBRCxtQkFBQztDQUFBLEFBRkQsSUFFQztBQUZZLG9DQUFZIn0=