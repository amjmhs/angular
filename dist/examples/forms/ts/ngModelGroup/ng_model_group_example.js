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
let NgModelGroupComp = class NgModelGroupComp {
    constructor() {
        this.name = { first: 'Nancy', last: 'Drew' };
    }
    onSubmit(f) {
        console.log(f.value); // {name: {first: 'Nancy', last: 'Drew'}, email: ''}
        console.log(f.valid); // true
    }
    setValue() { this.name = { first: 'Bess', last: 'Marvin' }; }
};
NgModelGroupComp = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: `
    <form #f="ngForm" (ngSubmit)="onSubmit(f)">
      <p *ngIf="nameCtrl.invalid">Name is invalid.</p>
    
      <div ngModelGroup="name" #nameCtrl="ngModelGroup">
        <input name="first" [ngModel]="name.first" minlength="2">
        <input name="last" [ngModel]="name.last" required>
      </div>
      
      <input name="email" ngModel> 
      <button>Submit</button>
    </form>
    
    <button (click)="setValue()">Set value</button>
  `,
    })
], NgModelGroupComp);
exports.NgModelGroupComp = NgModelGroupComp;
// #enddocregion
//# sourceMappingURL=ng_model_group_example.js.map