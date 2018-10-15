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
/* tslint:disable:no-console  */
// #docregion Component
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
let SimpleFormGroup = class SimpleFormGroup {
    constructor() {
        this.form = new forms_1.FormGroup({
            first: new forms_1.FormControl('Nancy', forms_1.Validators.minLength(2)),
            last: new forms_1.FormControl('Drew'),
        });
    }
    get first() { return this.form.get('first'); }
    onSubmit() {
        console.log(this.form.value); // {first: 'Nancy', last: 'Drew'}
    }
    setValue() { this.form.setValue({ first: 'Carson', last: 'Drew' }); }
};
SimpleFormGroup = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div *ngIf="first.invalid"> Name is too short. </div>

      <input formControlName="first" placeholder="First name">
      <input formControlName="last" placeholder="Last name">

      <button type="submit">Submit</button>
   </form>
   <button (click)="setValue()">Set preset value</button>
  `,
    })
], SimpleFormGroup);
exports.SimpleFormGroup = SimpleFormGroup;
// #enddocregion
//# sourceMappingURL=simple_form_group_example.js.map