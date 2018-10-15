"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/* tslint:disable:no-console  */
const core_1 = require("@angular/core");
// #docregion component-input
let BankAccountComponent = class BankAccountComponent {
    // #docregion component-input
    constructor() {
        this.bankName = null;
        this.id = null;
        // this property is not bound, and won't be automatically updated by Angular
        this.normalizedBankName = null;
    }
};
BankAccountComponent = __decorate([
    core_1.Component({
        selector: 'app-bank-account',
        inputs: ['bankName', 'id: account-id'],
        template: `
    Bank Name: {{ bankName }}
    Account Id: {{ id }}
  `
    })
], BankAccountComponent);
exports.BankAccountComponent = BankAccountComponent;
let MyInputComponent = class MyInputComponent {
};
MyInputComponent = __decorate([
    core_1.Component({
        selector: 'app-my-input',
        template: `
    <app-bank-account
      bankName="RBC"
      account-id="4747">
    </app-bank-account>
  `
    })
], MyInputComponent);
exports.MyInputComponent = MyInputComponent;
// #enddocregion component-input
// #docregion component-output-interval
let IntervalDirComponent = class IntervalDirComponent {
    constructor() {
        this.everySecond = new core_1.EventEmitter();
        this.fiveSecs = new core_1.EventEmitter();
        setInterval(() => this.everySecond.emit('event'), 1000);
        setInterval(() => this.fiveSecs.emit('event'), 5000);
    }
};
IntervalDirComponent = __decorate([
    core_1.Directive({ selector: 'app-interval-dir', outputs: ['everySecond', 'fiveSecs: everyFiveSeconds'] }),
    __metadata("design:paramtypes", [])
], IntervalDirComponent);
exports.IntervalDirComponent = IntervalDirComponent;
let MyOutputComponent = class MyOutputComponent {
    onEverySecond() { console.log('second'); }
    onEveryFiveSeconds() { console.log('five seconds'); }
};
MyOutputComponent = __decorate([
    core_1.Component({
        selector: 'app-my-output',
        template: `
    <app-interval-dir
      (everySecond)="onEverySecond()"
      (everyFiveSeconds)="onEveryFiveSeconds()">
    </app-interval-dir>
  `
    })
], MyOutputComponent);
exports.MyOutputComponent = MyOutputComponent;
// #enddocregion component-output-interval
//# sourceMappingURL=directives.js.map