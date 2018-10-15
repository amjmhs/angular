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
const compiler_1 = require("@angular/compiler");
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
let MyApp;
// #docregion url_resolver
class MyUrlResolver extends compiler_1.UrlResolver {
    resolve(baseUrl, url) {
        // Serve CSS files from a special CDN.
        if (url.substr(-4) === '.css') {
            return super.resolve('http://cdn.myapp.com/css/', url);
        }
        return super.resolve(baseUrl, url);
    }
}
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule],
        providers: [{ provide: compiler_1.UrlResolver, useClass: MyUrlResolver }],
        bootstrap: [MyApp]
    })
], AppModule);
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(AppModule);
}
exports.main = main;
// #enddocregion
//# sourceMappingURL=url_resolver.js.map