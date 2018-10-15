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
const core_1 = require("@angular/core");
// #docregion KeyValuePipe
let KeyValuePipeComponent = class KeyValuePipeComponent {
    // #docregion KeyValuePipe
    constructor() {
        this.object = { 2: 'foo', 1: 'bar' };
        this.map = new Map([[2, 'foo'], [1, 'bar']]);
    }
};
KeyValuePipeComponent = __decorate([
    core_1.Component({
        selector: 'keyvalue-pipe',
        template: `<span>
    <p>Object</p>
    <div *ngFor="let item of object | keyvalue">
      {{item.key}}:{{item.value}}
    </div>
    <p>Map</p>
    <div *ngFor="let item of map | keyvalue">
      {{item.key}}:{{item.value}}
    </div>
  </span>`
    })
], KeyValuePipeComponent);
exports.KeyValuePipeComponent = KeyValuePipeComponent;
// #enddocregion
//# sourceMappingURL=keyvalue_pipe.js.map