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
let SelectControlComp = class SelectControlComp {
    constructor() {
        this.states = [
            { name: 'Arizona', abbrev: 'AZ' },
            { name: 'California', abbrev: 'CA' },
            { name: 'Colorado', abbrev: 'CO' },
            { name: 'New York', abbrev: 'NY' },
            { name: 'Pennsylvania', abbrev: 'PA' },
        ];
    }
};
SelectControlComp = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: `
    <form #f="ngForm">
      <select name="state" ngModel>
        <option value="" disabled>Choose a state</option>
        <option *ngFor="let state of states" [ngValue]="state">
          {{ state.abbrev }}
        </option>
      </select>
    </form>
    
     <p>Form value: {{ f.value | json }}</p>
     <!-- example value: {state: {name: 'New York', abbrev: 'NY'} } -->
  `,
    })
], SelectControlComp);
exports.SelectControlComp = SelectControlComp;
// #enddocregion
//# sourceMappingURL=select_control_example.js.map