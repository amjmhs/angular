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
let NestedFormArray = class NestedFormArray {
    constructor() {
        this.form = new forms_1.FormGroup({
            cities: new forms_1.FormArray([
                new forms_1.FormControl('SF'),
                new forms_1.FormControl('NY'),
            ]),
        });
    }
    get cities() { return this.form.get('cities'); }
    addCity() { this.cities.push(new forms_1.FormControl()); }
    onSubmit() {
        console.log(this.cities.value); // ['SF', 'NY']
        console.log(this.form.value); // { cities: ['SF', 'NY'] }
    }
    setPreset() { this.cities.patchValue(['LA', 'MTV']); }
};
NestedFormArray = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div formArrayName="cities">
        <div *ngFor="let city of cities.controls; index as i">
          <input [formControlName]="i" placeholder="City">
        </div>
      </div>
      <button>Submit</button>
    </form>
    
    <button (click)="addCity()">Add City</button>
    <button (click)="setPreset()">Set preset</button>
  `,
    })
], NestedFormArray);
exports.NestedFormArray = NestedFormArray;
// #enddocregion
//# sourceMappingURL=nested_form_array_example.js.map