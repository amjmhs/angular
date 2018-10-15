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
var index_1 = require("./directives/index");
var localization_1 = require("./i18n/localization");
var index_2 = require("./pipes/deprecated/index");
var index_3 = require("./pipes/index");
// Note: This does not contain the location providers,
// as they need some platform specific implementations to work.
/**
 * Exports all the basic Angular directives and pipes,
 * such as `NgIf`, `NgForOf`, `DecimalPipe`, and so on.
 * Re-exported by `BrowserModule`, which is included automatically in the root
 * `AppModule` when you create a new app with the CLI `new` command.
 *
 * * The `providers` options configure the NgModule's injector to provide
 * localization dependencies to members.
 * * The `exports` options make the declared directives and pipes available for import
 * by other NgModules.
 *
 */
var CommonModule = /** @class */ (function () {
    function CommonModule() {
    }
    CommonModule = __decorate([
        core_1.NgModule({
            declarations: [index_1.COMMON_DIRECTIVES, index_3.COMMON_PIPES],
            exports: [index_1.COMMON_DIRECTIVES, index_3.COMMON_PIPES],
            providers: [
                { provide: localization_1.NgLocalization, useClass: localization_1.NgLocaleLocalization },
            ],
        })
    ], CommonModule);
    return CommonModule;
}());
exports.CommonModule = CommonModule;
/**
 * A module that contains the deprecated i18n pipes.
 *
 * @deprecated from v5
 */
var DeprecatedI18NPipesModule = /** @class */ (function () {
    function DeprecatedI18NPipesModule() {
    }
    DeprecatedI18NPipesModule = __decorate([
        core_1.NgModule({
            declarations: [index_2.COMMON_DEPRECATED_I18N_PIPES],
            exports: [index_2.COMMON_DEPRECATED_I18N_PIPES],
            providers: [{ provide: localization_1.DEPRECATED_PLURAL_FN, useValue: localization_1.getPluralCase }],
        })
    ], DeprecatedI18NPipesModule);
    return DeprecatedI18NPipesModule;
}());
exports.DeprecatedI18NPipesModule = DeprecatedI18NPipesModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi9zcmMvY29tbW9uX21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNDQUF1QztBQUN2Qyw0Q0FBcUQ7QUFDckQsb0RBQThHO0FBQzlHLGtEQUFzRTtBQUN0RSx1Q0FBMkM7QUFHM0Msc0RBQXNEO0FBQ3RELCtEQUErRDtBQUMvRDs7Ozs7Ozs7Ozs7R0FXRztBQVFIO0lBQUE7SUFDQSxDQUFDO0lBRFksWUFBWTtRQVB4QixlQUFRLENBQUM7WUFDUixZQUFZLEVBQUUsQ0FBQyx5QkFBaUIsRUFBRSxvQkFBWSxDQUFDO1lBQy9DLE9BQU8sRUFBRSxDQUFDLHlCQUFpQixFQUFFLG9CQUFZLENBQUM7WUFDMUMsU0FBUyxFQUFFO2dCQUNULEVBQUMsT0FBTyxFQUFFLDZCQUFjLEVBQUUsUUFBUSxFQUFFLG1DQUFvQixFQUFDO2FBQzFEO1NBQ0YsQ0FBQztPQUNXLFlBQVksQ0FDeEI7SUFBRCxtQkFBQztDQUFBLEFBREQsSUFDQztBQURZLG9DQUFZO0FBR3pCOzs7O0dBSUc7QUFNSDtJQUFBO0lBQ0EsQ0FBQztJQURZLHlCQUF5QjtRQUxyQyxlQUFRLENBQUM7WUFDUixZQUFZLEVBQUUsQ0FBQyxvQ0FBNEIsQ0FBQztZQUM1QyxPQUFPLEVBQUUsQ0FBQyxvQ0FBNEIsQ0FBQztZQUN2QyxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxtQ0FBb0IsRUFBRSxRQUFRLEVBQUUsNEJBQWEsRUFBQyxDQUFDO1NBQ3RFLENBQUM7T0FDVyx5QkFBeUIsQ0FDckM7SUFBRCxnQ0FBQztDQUFBLEFBREQsSUFDQztBQURZLDhEQUF5QiJ9