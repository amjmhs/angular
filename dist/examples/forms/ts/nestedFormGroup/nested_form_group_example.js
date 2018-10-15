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
let NestedFormGroupComp = class NestedFormGroupComp {
    constructor() {
        this.form = new forms_1.FormGroup({
            name: new forms_1.FormGroup({
                first: new forms_1.FormControl('Nancy', forms_1.Validators.minLength(2)),
                last: new forms_1.FormControl('Drew', forms_1.Validators.required)
            }),
            email: new forms_1.FormControl()
        });
    }
    get first() { return this.form.get('name.first'); }
    get name() { return this.form.get('name'); }
    onSubmit() {
        console.log(this.first.value); // 'Nancy'
        console.log(this.name.value); // {first: 'Nancy', last: 'Drew'}
        console.log(this.form.value); // {name: {first: 'Nancy', last: 'Drew'}, email: ''}
        console.log(this.form.status); // VALID
    }
    setPreset() { this.name.setValue({ first: 'Bess', last: 'Marvin' }); }
};
NestedFormGroupComp = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <p *ngIf="name.invalid">Name is invalid.</p>

      <div formGroupName="name">
        <input formControlName="first" placeholder="First name">
        <input formControlName="last" placeholder="Last name">
      </div>
      <input formControlName="email" placeholder="Email">
      <button type="submit">Submit</button>
    </form>

    <button (click)="setPreset()">Set preset</button>
`,
    })
], NestedFormGroupComp);
exports.NestedFormGroupComp = NestedFormGroupComp;
// #enddocregion
//# sourceMappingURL=nested_form_group_example.js.map