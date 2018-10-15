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
var core_1 = require("@angular/core");
var platform_webworker_1 = require("@angular/platform-webworker");
var router_1 = require("@angular/router");
var about_1 = require("./components/about");
var contact_1 = require("./components/contact");
var start_1 = require("./components/start");
var App = /** @class */ (function () {
    function App() {
    }
    App = __decorate([
        core_1.Component({ selector: 'app', templateUrl: 'app.html' })
    ], App);
    return App;
}());
exports.App = App;
exports.ROUTES = [
    { path: '', component: start_1.Start }, { path: 'contact', component: contact_1.Contact },
    { path: 'about', component: about_1.About }
];
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_webworker_1.WorkerAppModule, router_1.RouterModule.forRoot(exports.ROUTES, { useHash: true })],
            providers: [
                platform_webworker_1.WORKER_APP_LOCATION_PROVIDERS,
            ],
            bootstrap: [App],
            declarations: [App, start_1.Start, contact_1.Contact, about_1.About]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL3NyYy93ZWJfd29ya2Vycy9yb3V0ZXIvaW5kZXhfY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQWtEO0FBQ2xELGtFQUEyRjtBQUMzRiwwQ0FBNkM7QUFFN0MsNENBQXlDO0FBQ3pDLGdEQUE2QztBQUM3Qyw0Q0FBeUM7QUFHekM7SUFBQTtJQUNBLENBQUM7SUFEWSxHQUFHO1FBRGYsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBQyxDQUFDO09BQ3pDLEdBQUcsQ0FDZjtJQUFELFVBQUM7Q0FBQSxBQURELElBQ0M7QUFEWSxrQkFBRztBQUdILFFBQUEsTUFBTSxHQUFHO0lBQ3BCLEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsYUFBSyxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxpQkFBTyxFQUFDO0lBQ25FLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsYUFBSyxFQUFDO0NBQ2xDLENBQUM7QUFVRjtJQUFBO0lBQ0EsQ0FBQztJQURZLFNBQVM7UUFSckIsZUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFLENBQUMsb0NBQWUsRUFBRSxxQkFBWSxDQUFDLE9BQU8sQ0FBQyxjQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztZQUN6RSxTQUFTLEVBQUU7Z0JBQ1Qsa0RBQTZCO2FBQzlCO1lBQ0QsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO1lBQ2hCLFlBQVksRUFBRSxDQUFDLEdBQUcsRUFBRSxhQUFLLEVBQUUsaUJBQU8sRUFBRSxhQUFLLENBQUM7U0FDM0MsQ0FBQztPQUNXLFNBQVMsQ0FDckI7SUFBRCxnQkFBQztDQUFBLEFBREQsSUFDQztBQURZLDhCQUFTIn0=