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
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
// #docregion SimpleExample
let HelloWorld = class HelloWorld {
};
HelloWorld = __decorate([
    core_1.Component({ selector: 'hello-world', template: 'Hello World!' })
], HelloWorld);
let NgTemplateOutletSimpleExample = class NgTemplateOutletSimpleExample {
    constructor() {
        // This field is necessary to expose HelloWorld to the template.
        this.HelloWorld = HelloWorld;
    }
};
NgTemplateOutletSimpleExample = __decorate([
    core_1.Component({
        selector: 'ng-component-outlet-simple-example',
        template: `<ng-container *ngComponentOutlet="HelloWorld"></ng-container>`
    })
], NgTemplateOutletSimpleExample);
// #enddocregion
// #docregion CompleteExample
let Greeter = class Greeter {
    // #enddocregion
    // #docregion CompleteExample
    constructor() {
        this.suffix = '!';
    }
};
Greeter = __decorate([
    core_1.Injectable()
], Greeter);
let CompleteComponent = class CompleteComponent {
    constructor(greeter) {
        this.greeter = greeter;
    }
};
CompleteComponent = __decorate([
    core_1.Component({
        selector: 'complete-component',
        template: `Complete: <ng-content></ng-content> <ng-content></ng-content>{{ greeter.suffix }}`
    }),
    __metadata("design:paramtypes", [Greeter])
], CompleteComponent);
let NgTemplateOutletCompleteExample = class NgTemplateOutletCompleteExample {
    constructor(injector) {
        // This field is necessary to expose CompleteComponent to the template.
        this.CompleteComponent = CompleteComponent;
        this.myContent = [[document.createTextNode('Ahoj')], [document.createTextNode('Svet')]];
        this.myInjector = core_1.ReflectiveInjector.resolveAndCreate([Greeter], injector);
    }
};
NgTemplateOutletCompleteExample = __decorate([
    core_1.Component({
        selector: 'ng-component-outlet-complete-example',
        template: `
    <ng-container *ngComponentOutlet="CompleteComponent; 
                                      injector: myInjector; 
                                      content: myContent"></ng-container>`
    }),
    __metadata("design:paramtypes", [core_1.Injector])
], NgTemplateOutletCompleteExample);
// #enddocregion
// #docregion NgModuleFactoryExample
let OtherModuleComponent = class OtherModuleComponent {
};
OtherModuleComponent = __decorate([
    core_1.Component({ selector: 'other-module-component', template: `Other Module Component!` })
], OtherModuleComponent);
let NgTemplateOutletOtherModuleExample = class NgTemplateOutletOtherModuleExample {
    constructor(compiler) {
        // This field is necessary to expose OtherModuleComponent to the template.
        this.OtherModuleComponent = OtherModuleComponent;
        this.myModule = compiler.compileModuleSync(OtherModule);
    }
};
NgTemplateOutletOtherModuleExample = __decorate([
    core_1.Component({
        selector: 'ng-component-outlet-other-module-example',
        template: `
    <ng-container *ngComponentOutlet="OtherModuleComponent;
                                      ngModuleFactory: myModule;"></ng-container>`
    }),
    __metadata("design:paramtypes", [core_1.Compiler])
], NgTemplateOutletOtherModuleExample);
// #enddocregion
let ExampleApp = class ExampleApp {
};
ExampleApp = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: `<ng-component-outlet-simple-example></ng-component-outlet-simple-example>
             <hr/>
             <ng-component-outlet-complete-example></ng-component-outlet-complete-example>
             <hr/>
             <ng-component-outlet-other-module-example></ng-component-outlet-other-module-example>`
    })
], ExampleApp);
let AppModule = class AppModule {
};
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
exports.AppModule = AppModule;
let OtherModule = class OtherModule {
};
OtherModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        declarations: [OtherModuleComponent],
        entryComponents: [OtherModuleComponent]
    })
], OtherModule);
exports.OtherModule = OtherModule;
//# sourceMappingURL=module.js.map