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
// #docregion PercentPipe
var PercentPipeComponent = /** @class */ (function () {
    function PercentPipeComponent() {
        this.a = 0.259;
        this.b = 1.3495;
    }
    PercentPipeComponent = __decorate([
        core_1.Component({
            selector: 'percent-pipe',
            template: "<div>\n    <!--output '26%'-->\n    <p>A: {{a | percent}}</p>\n\n    <!--output '0,134.950%'-->\n    <p>B: {{b | percent:'4.3-5'}}</p>\n\n    <!--output '0\u00A0134,950 %'-->\n    <p>B: {{b | percent:'4.3-5':'fr'}}</p>\n  </div>"
        })
    ], PercentPipeComponent);
    return PercentPipeComponent;
}());
exports.PercentPipeComponent = PercentPipeComponent;
// #enddocregion
// #docregion DeprecatedPercentPipe
var DeprecatedPercentPipeComponent = /** @class */ (function () {
    function DeprecatedPercentPipeComponent() {
        this.a = 0.259;
        this.b = 1.3495;
    }
    DeprecatedPercentPipeComponent = __decorate([
        core_1.Component({
            selector: 'deprecated-percent-pipe',
            template: "<div>\n    <!--output '25.9%'-->\n    <p>A: {{a | percent}}</p>\n\n    <!--output '0,134.95%'-->\n    <p>B: {{b | percent:'4.3-5'}}</p>\n  </div>"
        })
    ], DeprecatedPercentPipeComponent);
    return DeprecatedPercentPipeComponent;
}());
exports.DeprecatedPercentPipeComponent = DeprecatedPercentPipeComponent;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyY2VudF9waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29tbW9uL3BpcGVzL3RzL3BlcmNlbnRfcGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILDBDQUFtRDtBQUNuRCxzQ0FBd0M7QUFDeEMsK0NBQStDO0FBQy9DLHlDQUFtQztBQUVuQywwQkFBMEI7QUFDMUIsMkJBQWtCLENBQUMsbUJBQVEsQ0FBQyxDQUFDO0FBRTdCLHlCQUF5QjtBQWN6QjtJQWJBO1FBY0UsTUFBQyxHQUFXLEtBQUssQ0FBQztRQUNsQixNQUFDLEdBQVcsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFIWSxvQkFBb0I7UUFiaEMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxjQUFjO1lBQ3hCLFFBQVEsRUFBRSxzT0FTSDtTQUNSLENBQUM7T0FDVyxvQkFBb0IsQ0FHaEM7SUFBRCwyQkFBQztDQUFBLEFBSEQsSUFHQztBQUhZLG9EQUFvQjtBQUlqQyxnQkFBZ0I7QUFFaEIsbUNBQW1DO0FBV25DO0lBVkE7UUFXRSxNQUFDLEdBQVcsS0FBSyxDQUFDO1FBQ2xCLE1BQUMsR0FBVyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUhZLDhCQUE4QjtRQVYxQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLHlCQUF5QjtZQUNuQyxRQUFRLEVBQUUsbUpBTUg7U0FDUixDQUFDO09BQ1csOEJBQThCLENBRzFDO0lBQUQscUNBQUM7Q0FBQSxBQUhELElBR0M7QUFIWSx3RUFBOEI7QUFJM0MsZ0JBQWdCIn0=