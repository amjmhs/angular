"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var MyApp;
// #docregion url_resolver
var MyUrlResolver = /** @class */ (function (_super) {
    __extends(MyUrlResolver, _super);
    function MyUrlResolver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyUrlResolver.prototype.resolve = function (baseUrl, url) {
        // Serve CSS files from a special CDN.
        if (url.substr(-4) === '.css') {
            return _super.prototype.resolve.call(this, 'http://cdn.myapp.com/css/', url);
        }
        return _super.prototype.resolve.call(this, baseUrl, url);
    };
    return MyUrlResolver;
}(compiler_1.UrlResolver));
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule],
            providers: [{ provide: compiler_1.UrlResolver, useClass: MyUrlResolver }],
            bootstrap: [MyApp]
        })
    ], AppModule);
    return AppModule;
}());
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(AppModule);
}
exports.main = main;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX3Jlc29sdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29tcGlsZXIvdHMvdXJsX3Jlc29sdmVyL3VybF9yZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCw4Q0FBOEM7QUFDOUMsc0NBQXVDO0FBQ3ZDLDhEQUF3RDtBQUN4RCw4RUFBeUU7QUFFekUsSUFBSSxLQUFVLENBQUM7QUFFZiwwQkFBMEI7QUFDMUI7SUFBNEIsaUNBQVc7SUFBdkM7O0lBUUEsQ0FBQztJQVBDLCtCQUFPLEdBQVAsVUFBUSxPQUFlLEVBQUUsR0FBVztRQUNsQyxzQ0FBc0M7UUFDdEMsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssTUFBTSxFQUFFO1lBQzdCLE9BQU8saUJBQU0sT0FBTyxZQUFDLDJCQUEyQixFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ3hEO1FBQ0QsT0FBTyxpQkFBTSxPQUFPLFlBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUFSRCxDQUE0QixzQkFBVyxHQVF0QztBQU9EO0lBQUE7SUFDQSxDQUFDO0lBREssU0FBUztRQUxkLGVBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRSxDQUFDLGdDQUFhLENBQUM7WUFDeEIsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsc0JBQVcsRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFDLENBQUM7WUFDNUQsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO1NBQ25CLENBQUM7T0FDSSxTQUFTLENBQ2Q7SUFBRCxnQkFBQztDQUFBLEFBREQsSUFDQztBQUVEO0lBQ0UsaURBQXNCLEVBQUUsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEQsQ0FBQztBQUZELG9CQUVDO0FBQ0QsZ0JBQWdCIn0=