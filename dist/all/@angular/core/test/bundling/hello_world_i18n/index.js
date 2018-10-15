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
var HelloWorld = /** @class */ (function () {
    function HelloWorld() {
    }
    HelloWorld = __decorate([
        core_1.Component({
            selector: 'hello-world',
            template: "<div i18n i18n-title title=\"Hello Title!\">Hello World!</div>"
        })
    ], HelloWorld);
    return HelloWorld;
}());
exports.HelloWorld = HelloWorld;
// TODO(misko): Forgetting to export HelloWorld and not having NgModule fails silently.
var INeedToExistEvenThoughIAmNotNeeded = /** @class */ (function () {
    function INeedToExistEvenThoughIAmNotNeeded() {
    }
    INeedToExistEvenThoughIAmNotNeeded = __decorate([
        core_1.NgModule({ declarations: [HelloWorld] })
    ], INeedToExistEvenThoughIAmNotNeeded);
    return INeedToExistEvenThoughIAmNotNeeded;
}());
exports.INeedToExistEvenThoughIAmNotNeeded = INeedToExistEvenThoughIAmNotNeeded;
// TODO(misko): Package should not be required to make this work.
core_1.ɵrenderComponent(HelloWorld);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvYnVuZGxpbmcvaGVsbG9fd29ybGRfaTE4bi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNDQUF1RjtBQU12RjtJQUFBO0lBQ0EsQ0FBQztJQURZLFVBQVU7UUFKdEIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLFFBQVEsRUFBRSxnRUFBOEQ7U0FDekUsQ0FBQztPQUNXLFVBQVUsQ0FDdEI7SUFBRCxpQkFBQztDQUFBLEFBREQsSUFDQztBQURZLGdDQUFVO0FBRXZCLHVGQUF1RjtBQUd2RjtJQUFBO0lBQ0EsQ0FBQztJQURZLGtDQUFrQztRQUQ5QyxlQUFRLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBQyxDQUFDO09BQzFCLGtDQUFrQyxDQUM5QztJQUFELHlDQUFDO0NBQUEsQUFERCxJQUNDO0FBRFksZ0ZBQWtDO0FBRS9DLGlFQUFpRTtBQUVqRSx1QkFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDIn0=