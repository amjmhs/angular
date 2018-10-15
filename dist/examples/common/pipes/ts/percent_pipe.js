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
// #docregion PercentPipe
let PercentPipeComponent = class PercentPipeComponent {
    // #docregion PercentPipe
    constructor() {
        this.a = 0.259;
        this.b = 1.3495;
    }
};
PercentPipeComponent = __decorate([
    core_1.Component({
        selector: 'percent-pipe',
        template: `<div>
    <!--output '26%'-->
    <p>A: {{a | percent}}</p>

    <!--output '0,134.950%'-->
    <p>B: {{b | percent:'4.3-5'}}</p>

    <!--output '0 134,950 %'-->
    <p>B: {{b | percent:'4.3-5':'fr'}}</p>
  </div>`
    })
], PercentPipeComponent);
exports.PercentPipeComponent = PercentPipeComponent;
// #enddocregion
// #docregion DeprecatedPercentPipe
let DeprecatedPercentPipeComponent = class DeprecatedPercentPipeComponent {
    // #enddocregion
    // #docregion DeprecatedPercentPipe
    constructor() {
        this.a = 0.259;
        this.b = 1.3495;
    }
};
DeprecatedPercentPipeComponent = __decorate([
    core_1.Component({
        selector: 'deprecated-percent-pipe',
        template: `<div>
    <!--output '25.9%'-->
    <p>A: {{a | percent}}</p>

    <!--output '0,134.95%'-->
    <p>B: {{b | percent:'4.3-5'}}</p>
  </div>`
    })
], DeprecatedPercentPipeComponent);
exports.DeprecatedPercentPipeComponent = DeprecatedPercentPipeComponent;
// #enddocregion
//# sourceMappingURL=percent_pipe.js.map