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
// #docregion longform
let MyApp = class MyApp {
};
MyApp = __decorate([
    core_1.Component({
        selector: 'my-app',
        template: `
    <h1>Hello World!</h1>
    <span class="red">Shadow DOM Rocks!</span>
  `,
        styles: [`
    :host {
      display: block;
      border: 1px solid black;
    }
    h1 {
      color: blue;
    }
    .red {
      background-color: red;
    }

  `],
        encapsulation: core_1.ViewEncapsulation.ShadowDom
    })
], MyApp);
// #enddocregion
//# sourceMappingURL=encapsulation.js.map