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
const platform_browser_1 = require("@angular/platform-browser");
let StableTestCmp = class StableTestCmp {
    constructor() {
        this.status = 'none';
    }
    start() {
        this.status = 'running';
        setTimeout(() => { this.status = 'done'; }, 5000);
    }
};
StableTestCmp = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: `
    <button class="start-button" (click)="start()">Start long-running task</button>
    <div class="status">Status: {{status}}</div>
  `
    })
], StableTestCmp);
exports.StableTestCmp = StableTestCmp;
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({ imports: [platform_browser_1.BrowserModule], declarations: [StableTestCmp], bootstrap: [StableTestCmp] })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=testability_example.js.map