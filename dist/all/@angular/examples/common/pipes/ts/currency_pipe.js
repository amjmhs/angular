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
// #docregion CurrencyPipe
var CurrencyPipeComponent = /** @class */ (function () {
    function CurrencyPipeComponent() {
        this.a = 0.259;
        this.b = 1.3495;
    }
    CurrencyPipeComponent = __decorate([
        core_1.Component({
            selector: 'currency-pipe',
            template: "<div>\n    <!--output '$0.26'-->\n    <p>A: {{a | currency}}</p>\n\n    <!--output 'CA$0.26'-->\n    <p>A: {{a | currency:'CAD'}}</p>\n\n    <!--output 'CAD0.26'-->\n    <p>A: {{a | currency:'CAD':'code'}}</p>\n\n    <!--output 'CA$0,001.35'-->\n    <p>B: {{b | currency:'CAD':'symbol':'4.2-2'}}</p>\n\n    <!--output '$0,001.35'-->\n    <p>B: {{b | currency:'CAD':'symbol-narrow':'4.2-2'}}</p>\n\n    <!--output '0\u00A0001,35\u00A0CA$'-->\n    <p>B: {{b | currency:'CAD':'symbol':'4.2-2':'fr'}}</p>\n\n    <!--output 'CLP1' because CLP has no cents-->\n    <p>B: {{b | currency:'CLP'}}</p>\n  </div>"
        })
    ], CurrencyPipeComponent);
    return CurrencyPipeComponent;
}());
exports.CurrencyPipeComponent = CurrencyPipeComponent;
// #enddocregion
// #docregion DeprecatedCurrencyPipe
var DeprecatedCurrencyPipeComponent = /** @class */ (function () {
    function DeprecatedCurrencyPipeComponent() {
        this.a = 0.259;
        this.b = 1.3495;
    }
    DeprecatedCurrencyPipeComponent = __decorate([
        core_1.Component({
            selector: 'deprecated-currency-pipe',
            template: "<div>\n    <!--output 'CAD0.26'-->\n    <p>A: {{a | currency:'CAD'}}</p>\n\n    <!--output '$0,001.35'-->\n    <p>B: {{b | currency:'CAD':true:'4.2-2'}}</p>\n  </div>"
        })
    ], DeprecatedCurrencyPipeComponent);
    return DeprecatedCurrencyPipeComponent;
}());
exports.DeprecatedCurrencyPipeComponent = DeprecatedCurrencyPipeComponent;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVuY3lfcGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2NvbW1vbi9waXBlcy90cy9jdXJyZW5jeV9waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsMENBQW1EO0FBQ25ELHNDQUF3QztBQUN4QywrQ0FBK0M7QUFDL0MseUNBQW1DO0FBRW5DLDBCQUEwQjtBQUMxQiwyQkFBa0IsQ0FBQyxtQkFBUSxDQUFDLENBQUM7QUFFN0IsMEJBQTBCO0FBMEIxQjtJQXpCQTtRQTBCRSxNQUFDLEdBQVcsS0FBSyxDQUFDO1FBQ2xCLE1BQUMsR0FBVyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUhZLHFCQUFxQjtRQXpCakMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxlQUFlO1lBQ3pCLFFBQVEsRUFBRSwybEJBcUJIO1NBQ1IsQ0FBQztPQUNXLHFCQUFxQixDQUdqQztJQUFELDRCQUFDO0NBQUEsQUFIRCxJQUdDO0FBSFksc0RBQXFCO0FBSWxDLGdCQUFnQjtBQUVoQixvQ0FBb0M7QUFXcEM7SUFWQTtRQVdFLE1BQUMsR0FBVyxLQUFLLENBQUM7UUFDbEIsTUFBQyxHQUFXLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBSFksK0JBQStCO1FBVjNDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsMEJBQTBCO1lBQ3BDLFFBQVEsRUFBRSx3S0FNSDtTQUNSLENBQUM7T0FDVywrQkFBK0IsQ0FHM0M7SUFBRCxzQ0FBQztDQUFBLEFBSEQsSUFHQztBQUhZLDBFQUErQjtBQUk1QyxnQkFBZ0IifQ==