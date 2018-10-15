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
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const hash_location_component_1 = require("./hash_location_component");
const path_location_component_1 = require("./path_location_component");
let ExampleAppComponent = class ExampleAppComponent {
};
ExampleAppComponent = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: `<hash-location></hash-location><path-location></path-location>`
    })
], ExampleAppComponent);
exports.ExampleAppComponent = ExampleAppComponent;
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        declarations: [ExampleAppComponent, path_location_component_1.PathLocationComponent, hash_location_component_1.HashLocationComponent],
        providers: [{ provide: common_1.APP_BASE_HREF, useValue: '/' }],
        imports: [platform_browser_1.BrowserModule],
        bootstrap: [ExampleAppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=module.js.map