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
// #docregion NumberPipe
let NumberPipeComponent = class NumberPipeComponent {
    // #docregion NumberPipe
    constructor() {
        this.pi = 3.14;
        this.e = 2.718281828459045;
    }
};
NumberPipeComponent = __decorate([
    core_1.Component({
        selector: 'number-pipe',
        template: `<div>
    <!--output '2.718'-->
    <p>e (no formatting): {{e | number}}</p>
    
    <!--output '002.71828'-->
    <p>e (3.1-5): {{e | number:'3.1-5'}}</p>

    <!--output '0,002.71828'-->
    <p>e (4.5-5): {{e | number:'4.5-5'}}</p>
    
    <!--output '0 002,71828'-->
    <p>e (french): {{e | number:'4.5-5':'fr'}}</p>

    <!--output '3.14'-->
    <p>pi (no formatting): {{pi | number}}</p>
    
    <!--output '003.14'-->
    <p>pi (3.1-5): {{pi | number:'3.1-5'}}</p>

    <!--output '003.14000'-->
    <p>pi (3.5-5): {{pi | number:'3.5-5'}}</p>

    <!--output '-3' / unlike '-2' by Math.round()-->
    <p>-2.5 (1.0-0): {{-2.5 | number:'1.0-0'}}</p>
  </div>`
    })
], NumberPipeComponent);
exports.NumberPipeComponent = NumberPipeComponent;
// #enddocregion
// #docregion DeprecatedNumberPipe
let DeprecatedNumberPipeComponent = class DeprecatedNumberPipeComponent {
    // #enddocregion
    // #docregion DeprecatedNumberPipe
    constructor() {
        this.pi = 3.141592;
        this.e = 2.718281828459045;
    }
};
DeprecatedNumberPipeComponent = __decorate([
    core_1.Component({
        selector: 'deprecated-number-pipe',
        template: `<div>
    <p>e (no formatting): {{e}}</p>
    <p>e (3.1-5): {{e | number:'3.1-5'}}</p>
    <p>pi (no formatting): {{pi}}</p>
    <p>pi (3.5-5): {{pi | number:'3.5-5'}}</p>
  </div>`
    })
], DeprecatedNumberPipeComponent);
exports.DeprecatedNumberPipeComponent = DeprecatedNumberPipeComponent;
// #enddocregion
//# sourceMappingURL=number_pipe.js.map