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
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
// we need to import data for the french locale
const locale_fr_1 = require("./locale-fr");
// registering french data
common_1.registerLocaleData(locale_fr_1.default);
// #docregion CurrencyPipe
let CurrencyPipeComponent = class CurrencyPipeComponent {
    // #docregion CurrencyPipe
    constructor() {
        this.a = 0.259;
        this.b = 1.3495;
    }
};
CurrencyPipeComponent = __decorate([
    core_1.Component({
        selector: 'currency-pipe',
        template: `<div>
    <!--output '$0.26'-->
    <p>A: {{a | currency}}</p>

    <!--output 'CA$0.26'-->
    <p>A: {{a | currency:'CAD'}}</p>

    <!--output 'CAD0.26'-->
    <p>A: {{a | currency:'CAD':'code'}}</p>

    <!--output 'CA$0,001.35'-->
    <p>B: {{b | currency:'CAD':'symbol':'4.2-2'}}</p>

    <!--output '$0,001.35'-->
    <p>B: {{b | currency:'CAD':'symbol-narrow':'4.2-2'}}</p>

    <!--output '0 001,35 CA$'-->
    <p>B: {{b | currency:'CAD':'symbol':'4.2-2':'fr'}}</p>

    <!--output 'CLP1' because CLP has no cents-->
    <p>B: {{b | currency:'CLP'}}</p>
  </div>`
    })
], CurrencyPipeComponent);
exports.CurrencyPipeComponent = CurrencyPipeComponent;
// #enddocregion
// #docregion DeprecatedCurrencyPipe
let DeprecatedCurrencyPipeComponent = class DeprecatedCurrencyPipeComponent {
    // #enddocregion
    // #docregion DeprecatedCurrencyPipe
    constructor() {
        this.a = 0.259;
        this.b = 1.3495;
    }
};
DeprecatedCurrencyPipeComponent = __decorate([
    core_1.Component({
        selector: 'deprecated-currency-pipe',
        template: `<div>
    <!--output 'CAD0.26'-->
    <p>A: {{a | currency:'CAD'}}</p>

    <!--output '$0,001.35'-->
    <p>B: {{b | currency:'CAD':true:'4.2-2'}}</p>
  </div>`
    })
], DeprecatedCurrencyPipeComponent);
exports.DeprecatedCurrencyPipeComponent = DeprecatedCurrencyPipeComponent;
// #enddocregion
//# sourceMappingURL=currency_pipe.js.map