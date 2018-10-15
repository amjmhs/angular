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
// #docregion Reactive
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
let ReactiveRadioButtonComp = class ReactiveRadioButtonComp {
    constructor() {
        this.form = new forms_1.FormGroup({
            food: new forms_1.FormControl('lamb'),
        });
    }
};
ReactiveRadioButtonComp = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: `
    <form [formGroup]="form">
      <input type="radio" formControlName="food" value="beef" > Beef
      <input type="radio" formControlName="food" value="lamb"> Lamb
      <input type="radio" formControlName="food" value="fish"> Fish
    </form>
    
    <p>Form value: {{ form.value | json }}</p>  <!-- {food: 'lamb' } -->
  `,
    })
], ReactiveRadioButtonComp);
exports.ReactiveRadioButtonComp = ReactiveRadioButtonComp;
// #enddocregion
//# sourceMappingURL=reactive_radio_button_example.js.map