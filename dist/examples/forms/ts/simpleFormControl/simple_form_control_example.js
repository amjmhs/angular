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
// #docregion Component
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
let SimpleFormControl = class SimpleFormControl {
    constructor() {
        this.control = new forms_1.FormControl('value', forms_1.Validators.minLength(2));
    }
    setValue() { this.control.setValue('new value'); }
};
SimpleFormControl = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: `
     <input [formControl]="control">
      
     <p>Value: {{ control.value }}</p>
     <p>Validation status: {{ control.status }}</p>
     
     <button (click)="setValue()">Set value</button>
  `,
    })
], SimpleFormControl);
exports.SimpleFormControl = SimpleFormControl;
// #enddocregion
//# sourceMappingURL=simple_form_control_example.js.map