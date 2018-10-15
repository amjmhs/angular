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
// #docregion TemplateDriven
const core_1 = require("@angular/core");
let RadioButtonComp = class RadioButtonComp {
    constructor() {
        this.myFood = 'lamb';
    }
};
RadioButtonComp = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: `
    <form #f="ngForm">
      <input type="radio" value="beef" name="food" [(ngModel)]="myFood"> Beef
      <input type="radio" value="lamb" name="food" [(ngModel)]="myFood"> Lamb
      <input type="radio" value="fish" name="food" [(ngModel)]="myFood"> Fish
    </form>
    
    <p>Form value: {{ f.value | json }}</p>  <!-- {food: 'lamb' } -->
    <p>myFood value: {{ myFood }}</p>  <!-- 'lamb' -->
  `,
    })
], RadioButtonComp);
exports.RadioButtonComp = RadioButtonComp;
// #enddocregion
//# sourceMappingURL=radio_button_example.js.map