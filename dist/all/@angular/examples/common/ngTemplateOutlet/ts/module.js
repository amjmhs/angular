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
var platform_browser_1 = require("@angular/platform-browser");
// #docregion NgTemplateOutlet
var NgTemplateOutletExample = /** @class */ (function () {
    function NgTemplateOutletExample() {
        this.myContext = { $implicit: 'World', localSk: 'Svet' };
    }
    NgTemplateOutletExample = __decorate([
        core_1.Component({
            selector: 'ng-template-outlet-example',
            template: "\n    <ng-container *ngTemplateOutlet=\"greet\"></ng-container>\n    <hr>\n    <ng-container *ngTemplateOutlet=\"eng; context: myContext\"></ng-container>\n    <hr>\n    <ng-container *ngTemplateOutlet=\"svk; context: myContext\"></ng-container>\n    <hr>\n    \n    <ng-template #greet><span>Hello</span></ng-template>\n    <ng-template #eng let-name><span>Hello {{name}}!</span></ng-template>\n    <ng-template #svk let-person=\"localSk\"><span>Ahoj {{person}}!</span></ng-template>\n"
        })
    ], NgTemplateOutletExample);
    return NgTemplateOutletExample;
}());
// #enddocregion
var ExampleApp = /** @class */ (function () {
    function ExampleApp() {
    }
    ExampleApp = __decorate([
        core_1.Component({
            selector: 'example-app',
            template: "<ng-template-outlet-example></ng-template-outlet-example>"
        })
    ], ExampleApp);
    return ExampleApp;
}());
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule],
            declarations: [ExampleApp, NgTemplateOutletExample],
            bootstrap: [ExampleApp]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29tbW9uL25nVGVtcGxhdGVPdXRsZXQvdHMvbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQWtEO0FBQ2xELDhEQUF3RDtBQUd4RCw4QkFBOEI7QUFnQjlCO0lBZkE7UUFnQkUsY0FBUyxHQUFHLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFDLENBQUM7SUFDcEQsQ0FBQztJQUZLLHVCQUF1QjtRQWY1QixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLDRCQUE0QjtZQUN0QyxRQUFRLEVBQUUsd2VBV1g7U0FDQSxDQUFDO09BQ0ksdUJBQXVCLENBRTVCO0lBQUQsOEJBQUM7Q0FBQSxBQUZELElBRUM7QUFDRCxnQkFBZ0I7QUFPaEI7SUFBQTtJQUNBLENBQUM7SUFESyxVQUFVO1FBSmYsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLFFBQVEsRUFBRSwyREFBMkQ7U0FDdEUsQ0FBQztPQUNJLFVBQVUsQ0FDZjtJQUFELGlCQUFDO0NBQUEsQUFERCxJQUNDO0FBT0Q7SUFBQTtJQUNBLENBQUM7SUFEWSxTQUFTO1FBTHJCLGVBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRSxDQUFDLGdDQUFhLENBQUM7WUFDeEIsWUFBWSxFQUFFLENBQUMsVUFBVSxFQUFFLHVCQUF1QixDQUFDO1lBQ25ELFNBQVMsRUFBRSxDQUFDLFVBQVUsQ0FBQztTQUN4QixDQUFDO09BQ1csU0FBUyxDQUNyQjtJQUFELGdCQUFDO0NBQUEsQUFERCxJQUNDO0FBRFksOEJBQVMifQ==