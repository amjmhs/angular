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
// #docregion NgTemplateOutlet
let NgTemplateOutletExample = class NgTemplateOutletExample {
    // #docregion NgTemplateOutlet
    constructor() {
        this.myContext = { $implicit: 'World', localSk: 'Svet' };
    }
};
NgTemplateOutletExample = __decorate([
    core_1.Component({
        selector: 'ng-template-outlet-example',
        template: `
    <ng-container *ngTemplateOutlet="greet"></ng-container>
    <hr>
    <ng-container *ngTemplateOutlet="eng; context: myContext"></ng-container>
    <hr>
    <ng-container *ngTemplateOutlet="svk; context: myContext"></ng-container>
    <hr>
    
    <ng-template #greet><span>Hello</span></ng-template>
    <ng-template #eng let-name><span>Hello {{name}}!</span></ng-template>
    <ng-template #svk let-person="localSk"><span>Ahoj {{person}}!</span></ng-template>
`
    })
], NgTemplateOutletExample);
// #enddocregion
let ExampleApp = class ExampleApp {
};
ExampleApp = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: `<ng-template-outlet-example></ng-template-outlet-example>`
    })
], ExampleApp);
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule],
        declarations: [ExampleApp, NgTemplateOutletExample],
        bootstrap: [ExampleApp]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=module.js.map