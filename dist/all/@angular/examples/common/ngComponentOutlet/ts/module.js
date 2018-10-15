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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
// #docregion SimpleExample
var HelloWorld = /** @class */ (function () {
    function HelloWorld() {
    }
    HelloWorld = __decorate([
        core_1.Component({ selector: 'hello-world', template: 'Hello World!' })
    ], HelloWorld);
    return HelloWorld;
}());
var NgTemplateOutletSimpleExample = /** @class */ (function () {
    function NgTemplateOutletSimpleExample() {
        // This field is necessary to expose HelloWorld to the template.
        this.HelloWorld = HelloWorld;
    }
    NgTemplateOutletSimpleExample = __decorate([
        core_1.Component({
            selector: 'ng-component-outlet-simple-example',
            template: "<ng-container *ngComponentOutlet=\"HelloWorld\"></ng-container>"
        })
    ], NgTemplateOutletSimpleExample);
    return NgTemplateOutletSimpleExample;
}());
// #enddocregion
// #docregion CompleteExample
var Greeter = /** @class */ (function () {
    function Greeter() {
        this.suffix = '!';
    }
    Greeter = __decorate([
        core_1.Injectable()
    ], Greeter);
    return Greeter;
}());
var CompleteComponent = /** @class */ (function () {
    function CompleteComponent(greeter) {
        this.greeter = greeter;
    }
    CompleteComponent = __decorate([
        core_1.Component({
            selector: 'complete-component',
            template: "Complete: <ng-content></ng-content> <ng-content></ng-content>{{ greeter.suffix }}"
        }),
        __metadata("design:paramtypes", [Greeter])
    ], CompleteComponent);
    return CompleteComponent;
}());
var NgTemplateOutletCompleteExample = /** @class */ (function () {
    function NgTemplateOutletCompleteExample(injector) {
        // This field is necessary to expose CompleteComponent to the template.
        this.CompleteComponent = CompleteComponent;
        this.myContent = [[document.createTextNode('Ahoj')], [document.createTextNode('Svet')]];
        this.myInjector = core_1.ReflectiveInjector.resolveAndCreate([Greeter], injector);
    }
    NgTemplateOutletCompleteExample = __decorate([
        core_1.Component({
            selector: 'ng-component-outlet-complete-example',
            template: "\n    <ng-container *ngComponentOutlet=\"CompleteComponent; \n                                      injector: myInjector; \n                                      content: myContent\"></ng-container>"
        }),
        __metadata("design:paramtypes", [core_1.Injector])
    ], NgTemplateOutletCompleteExample);
    return NgTemplateOutletCompleteExample;
}());
// #enddocregion
// #docregion NgModuleFactoryExample
var OtherModuleComponent = /** @class */ (function () {
    function OtherModuleComponent() {
    }
    OtherModuleComponent = __decorate([
        core_1.Component({ selector: 'other-module-component', template: "Other Module Component!" })
    ], OtherModuleComponent);
    return OtherModuleComponent;
}());
var NgTemplateOutletOtherModuleExample = /** @class */ (function () {
    function NgTemplateOutletOtherModuleExample(compiler) {
        // This field is necessary to expose OtherModuleComponent to the template.
        this.OtherModuleComponent = OtherModuleComponent;
        this.myModule = compiler.compileModuleSync(OtherModule);
    }
    NgTemplateOutletOtherModuleExample = __decorate([
        core_1.Component({
            selector: 'ng-component-outlet-other-module-example',
            template: "\n    <ng-container *ngComponentOutlet=\"OtherModuleComponent;\n                                      ngModuleFactory: myModule;\"></ng-container>"
        }),
        __metadata("design:paramtypes", [core_1.Compiler])
    ], NgTemplateOutletOtherModuleExample);
    return NgTemplateOutletOtherModuleExample;
}());
// #enddocregion
var ExampleApp = /** @class */ (function () {
    function ExampleApp() {
    }
    ExampleApp = __decorate([
        core_1.Component({
            selector: 'example-app',
            template: "<ng-component-outlet-simple-example></ng-component-outlet-simple-example>\n             <hr/>\n             <ng-component-outlet-complete-example></ng-component-outlet-complete-example>\n             <hr/>\n             <ng-component-outlet-other-module-example></ng-component-outlet-other-module-example>"
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
            declarations: [
                ExampleApp, NgTemplateOutletSimpleExample, NgTemplateOutletCompleteExample,
                NgTemplateOutletOtherModuleExample, HelloWorld, CompleteComponent
            ],
            entryComponents: [HelloWorld, CompleteComponent],
            bootstrap: [ExampleApp]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
var OtherModule = /** @class */ (function () {
    function OtherModule() {
    }
    OtherModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule],
            declarations: [OtherModuleComponent],
            entryComponents: [OtherModuleComponent]
        })
    ], OtherModule);
    return OtherModule;
}());
exports.OtherModule = OtherModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29tbW9uL25nQ29tcG9uZW50T3V0bGV0L3RzL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILDBDQUE2QztBQUM3QyxzQ0FBdUg7QUFDdkgsOERBQXdEO0FBSXhELDJCQUEyQjtBQUUzQjtJQUFBO0lBQ0EsQ0FBQztJQURLLFVBQVU7UUFEZixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFDLENBQUM7T0FDekQsVUFBVSxDQUNmO0lBQUQsaUJBQUM7Q0FBQSxBQURELElBQ0M7QUFNRDtJQUpBO1FBS0UsZ0VBQWdFO1FBQ2hFLGVBQVUsR0FBRyxVQUFVLENBQUM7SUFDMUIsQ0FBQztJQUhLLDZCQUE2QjtRQUpsQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLG9DQUFvQztZQUM5QyxRQUFRLEVBQUUsaUVBQStEO1NBQzFFLENBQUM7T0FDSSw2QkFBNkIsQ0FHbEM7SUFBRCxvQ0FBQztDQUFBLEFBSEQsSUFHQztBQUNELGdCQUFnQjtBQUVoQiw2QkFBNkI7QUFFN0I7SUFEQTtRQUVFLFdBQU0sR0FBRyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRkssT0FBTztRQURaLGlCQUFVLEVBQUU7T0FDUCxPQUFPLENBRVo7SUFBRCxjQUFDO0NBQUEsQUFGRCxJQUVDO0FBTUQ7SUFDRSwyQkFBbUIsT0FBZ0I7UUFBaEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztJQUFHLENBQUM7SUFEbkMsaUJBQWlCO1FBSnRCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsb0JBQW9CO1lBQzlCLFFBQVEsRUFBRSxtRkFBbUY7U0FDOUYsQ0FBQzt5Q0FFNEIsT0FBTztPQUQvQixpQkFBaUIsQ0FFdEI7SUFBRCx3QkFBQztDQUFBLEFBRkQs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