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
// #docregion SlicePipe_string
let SlicePipeStringComponent = class SlicePipeStringComponent {
    // #docregion SlicePipe_string
    constructor() {
        this.str = 'abcdefghij';
    }
};
SlicePipeStringComponent = __decorate([
    core_1.Component({
        selector: 'slice-string-pipe',
        template: `<div>
    <p>{{str}}[0:4]: '{{str | slice:0:4}}' - output is expected to be 'abcd'</p>
    <p>{{str}}[4:0]: '{{str | slice:4:0}}' - output is expected to be ''</p>
    <p>{{str}}[-4]: '{{str | slice:-4}}' - output is expected to be 'ghij'</p>
    <p>{{str}}[-4:-2]: '{{str | slice:-4:-2}}' - output is expected to be 'gh'</p>
    <p>{{str}}[-100]: '{{str | slice:-100}}' - output is expected to be 'abcdefghij'</p>
    <p>{{str}}[100]: '{{str | slice:100}}' - output is expected to be ''</p>
  </div>`
    })
], SlicePipeStringComponent);
exports.SlicePipeStringComponent = SlicePipeStringComponent;
// #enddocregion
// #docregion SlicePipe_list
let SlicePipeListComponent = class SlicePipeListComponent {
    // #enddocregion
    // #docregion SlicePipe_list
    constructor() {
        this.collection = ['a', 'b', 'c', 'd'];
    }
};
SlicePipeListComponent = __decorate([
    core_1.Component({
        selector: 'slice-list-pipe',
        template: `<ul>
    <li *ngFor="let i of collection | slice:1:3">{{i}}</li>
  </ul>`
    })
], SlicePipeListComponent);
exports.SlicePipeListComponent = SlicePipeListComponent;
// #enddocregion
//# sourceMappingURL=slice_pipe.js.map