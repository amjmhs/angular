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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
// we need to import data for the french locale
var locale_fr_1 = require("./locale-fr");
// registering french data
common_1.registerLocaleData(locale_fr_1.default);
// #docregion NumberPipe
var NumberPipeComponent = /** @class */ (function () {
    function NumberPipeComponent() {
        this.pi = 3.14;
        this.e = 2.718281828459045;
    }
    NumberPipeComponent = __decorate([
        core_1.Component({
            selector: 'number-pipe',
            template: "<div>\n    <!--output '2.718'-->\n    <p>e (no formatting): {{e | number}}</p>\n    \n    <!--output '002.71828'-->\n    <p>e (3.1-5): {{e | number:'3.1-5'}}</p>\n\n    <!--output '0,002.71828'-->\n    <p>e (4.5-5): {{e | number:'4.5-5'}}</p>\n    \n    <!--output '0\u00A0002,71828'-->\n    <p>e (french): {{e | number:'4.5-5':'fr'}}</p>\n\n    <!--output '3.14'-->\n    <p>pi (no formatting): {{pi | number}}</p>\n    \n    <!--output '003.14'-->\n    <p>pi (3.1-5): {{pi | number:'3.1-5'}}</p>\n\n    <!--output '003.14000'-->\n    <p>pi (3.5-5): {{pi | number:'3.5-5'}}</p>\n\n    <!--output '-3' / unlike '-2' by Math.round()-->\n    <p>-2.5 (1.0-0): {{-2.5 | number:'1.0-0'}}</p>\n  </div>"
        })
    ], NumberPipeComponent);
    return NumberPipeComponent;
}());
exports.NumberPipeComponent = NumberPipeComponent;
// #enddocregion
// #docregion DeprecatedNumberPipe
var DeprecatedNumberPipeComponent = /** @class */ (function () {
    function DeprecatedNumberPipeComponent() {
        this.pi = 3.141592;
        this.e = 2.718281828459045;
    }
    DeprecatedNumberPipeComponent = __decorate([
        core_1.Component({
            selector: 'deprecated-number-pipe',
            template: "<div>\n    <p>e (no formatting): {{e}}</p>\n    <p>e (3.1-5): {{e | number:'3.1-5'}}</p>\n    <p>pi (no formatting): {{pi}}</p>\n    <p>pi (3.5-5): {{pi | number:'3.5-5'}}</p>\n  </div>"
        })
    ], DeprecatedNumberPipeComponent);
    return DeprecatedNumberPipeComponent;
}());
exports.DeprecatedNumberPipeComponent = DeprecatedNumberPipeComponent;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyX3BpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9leGFtcGxlcy9jb21tb24vcGlwZXMvdHMvbnVtYmVyX3BpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCwwQ0FBbUQ7QUFDbkQsc0NBQXdDO0FBQ3hDLCtDQUErQztBQUMvQyx5Q0FBbUM7QUFFbkMsMEJBQTBCO0FBQzFCLDJCQUFrQixDQUFDLG1CQUFRLENBQUMsQ0FBQztBQUU3Qix3QkFBd0I7QUE2QnhCO0lBNUJBO1FBNkJFLE9BQUUsR0FBVyxJQUFJLENBQUM7UUFDbEIsTUFBQyxHQUFXLGlCQUFpQixDQUFDO0lBQ2hDLENBQUM7SUFIWSxtQkFBbUI7UUE1Qi9CLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsYUFBYTtZQUN2QixRQUFRLEVBQUUseXJCQXdCSDtTQUNSLENBQUM7T0FDVyxtQkFBbUIsQ0FHL0I7SUFBRCwwQkFBQztDQUFBLEFBSEQsSUFHQztBQUhZLGtEQUFtQjtBQUloQyxnQkFBZ0I7QUFFaEIsa0NBQWtDO0FBVWxDO0lBVEE7UUFVRSxPQUFFLEdBQVcsUUFBUSxDQUFDO1FBQ3RCLE1BQUMsR0FBVyxpQkFBaUIsQ0FBQztJQUNoQyxDQUFDO0lBSFksNkJBQTZCO1FBVHpDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsd0JBQXdCO1lBQ2xDLFFBQVEsRUFBRSwyTEFLSDtTQUNSLENBQUM7T0FDVyw2QkFBNkIsQ0FHekM7SUFBRCxvQ0FBQztDQUFBLEFBSEQsSUFHQztBQUhZLHNFQUE2QjtBQUkxQyxnQkFBZ0IifQ==