"use strict";
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
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// #docplaster
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
const static_1 = require("@angular/upgrade/static");
// #docregion ng1-text-formatter-service
class TextFormatter {
    titleCase(value) { return value.replace(/((^|\s)[a-z])/g, (_, c) => c.toUpperCase()); }
}
// #enddocregion
// #docregion Angular Stuff
// #docregion ng2-heroes
// This Angular component will be "downgraded" to be used in AngularJS
let Ng2HeroesComponent = class Ng2HeroesComponent {
    // #enddocregion
    // #docregion Angular Stuff
    // #docregion ng2-heroes
    // This Angular component will be "downgraded" to be used in AngularJS
    constructor() {
        this.addHero = new core_1.EventEmitter();
        this.removeHero = new core_1.EventEmitter();
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], Ng2HeroesComponent.prototype, "heroes", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], Ng2HeroesComponent.prototype, "addHero", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], Ng2HeroesComponent.prototype, "removeHero", void 0);
Ng2HeroesComponent = __decorate([
    core_1.Component({
        selector: 'ng2-heroes',
        // This template uses the upgraded `ng1-hero` component
        // Note that because its element is compiled by Angular we must use camelCased attribute names
        template: `<header><ng-content selector="h1"></ng-content></header>
             <ng-content selector=".extra"></ng-content>
             <div *ngFor="let hero of heroes">
               <ng1-hero [hero]="hero" (onRemove)="removeHero.emit(hero)"><strong>Super Hero</strong></ng1-hero>
             </div>
             <button (click)="addHero.emit()">Add Hero</button>`,
    })
], Ng2HeroesComponent);
// #enddocregion
// #docregion ng2-heroes-service
// This Angular service will be "downgraded" to be used in AngularJS
let HeroesService = class HeroesService {
    // #docregion use-ng1-upgraded-service
    constructor(textFormatter) {
        this.heroes = [
            { name: 'superman', description: 'The man of steel' },
            { name: 'wonder woman', description: 'Princess of the Amazons' },
            { name: 'thor', description: 'The hammer-wielding god' }
        ];
        // Change all the hero names to title case, using the "upgraded" AngularJS service
        this.heroes.forEach((hero) => hero.name = textFormatter.titleCase(hero.name));
    }
    // #enddocregion
    addHero() {
        this.heroes =
            this.heroes.concat([{ name: 'Kamala Khan', description: 'Epic shape-shifting healer' }]);
    }
    removeHero(hero) { this.heroes = this.heroes.filter((item) => item !== hero); }
};
HeroesService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [TextFormatter])
], HeroesService);
// #enddocregion
// #docregion ng1-hero-wrapper
// This Angular directive will act as an interface to the "upgraded" AngularJS component
let Ng1HeroComponentWrapper = class Ng1HeroComponentWrapper extends static_1.UpgradeComponent {
    constructor(elementRef, injector) {
        // We must pass the name of the directive as used by AngularJS to the super
        super('ng1Hero', elementRef, injector);
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], Ng1HeroComponentWrapper.prototype, "hero", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], Ng1HeroComponentWrapper.prototype, "onRemove", void 0);
Ng1HeroComponentWrapper = __decorate([
    core_1.Directive({ selector: 'ng1-hero' }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
], Ng1HeroComponentWrapper);
// #enddocregion
// #docregion ng2-module
// This NgModule represents the Angular pieces of the application
let Ng2AppModule = 
// #docregion bootstrap-ng1
class Ng2AppModule {
    // #enddocregion ng2-module
    constructor(upgrade) {
        this.upgrade = upgrade;
    }
    ngDoBootstrap() {
        // We bootstrap the AngularJS app.
        this.upgrade.bootstrap(document.body, [ng1AppModule.name]);
    }
};
Ng2AppModule = __decorate([
    core_1.NgModule({
        declarations: [Ng2HeroesComponent, Ng1HeroComponentWrapper],
        providers: [
            HeroesService,
            // #docregion upgrade-ng1-service
            // Register an Angular provider whose value is the "upgraded" AngularJS service
            { provide: TextFormatter, useFactory: (i) => i.get('textFormatter'), deps: ['$injector'] }
            // #enddocregion
        ],
        // All components that are to be "downgraded" must be declared as `entryComponents`
        entryComponents: [Ng2HeroesComponent],
        // We must import `UpgradeModule` to get access to the AngularJS core services
        imports: [platform_browser_1.BrowserModule, static_1.UpgradeModule]
    })
    // #docregion bootstrap-ng1
    ,
    __metadata("design:paramtypes", [static_1.UpgradeModule])
], Ng2AppModule);
// #enddocregion bootstrap-ng1
// #enddocregion ng2-module
// #enddocregion
// #docregion Angular 1 Stuff
// #docregion ng1-module
// This Angular 1 module represents the AngularJS pieces of the application
const ng1AppModule = angular.module('ng1AppModule', []);
// #enddocregion
// #docregion ng1-hero
// This AngularJS component will be "upgraded" to be used in Angular
ng1AppModule.component('ng1Hero', {
    bindings: { hero: '<', onRemove: '&' },
    transclude: true,
    template: `<div class="title" ng-transclude></div>
             <h2>{{ $ctrl.hero.name }}</h2>
             <p>{{ $ctrl.hero.description }}</p>
             <button ng-click="$ctrl.onRemove()">Remove</button>`
});
// #enddocregion
// #docregion ng1-text-formatter-service
// This AngularJS service will be "upgraded" to be used in Angular
ng1AppModule.service('textFormatter', [TextFormatter]);
// #enddocregion
// #docregion downgrade-ng2-heroes-service
// Register an AngularJS service, whose value is the "downgraded" Angular injectable.
ng1AppModule.factory('heroesService', static_1.downgradeInjectable(HeroesService));
// #enddocregion
// #docregion ng2-heroes-wrapper
// This directive will act as the interface to the "downgraded" Angular component
ng1AppModule.directive('ng2Heroes', static_1.downgradeComponent({ component: Ng2HeroesComponent }));
// #enddocregion
// #docregion example-app
// This is our top level application component
ng1AppModule.component('exampleApp', {
    // We inject the "downgraded" HeroesService into this AngularJS component
    // (We don't need the `HeroesService` type for AngularJS DI - it just helps with TypeScript
    // compilation)
    controller: [
        'heroesService', function (heroesService) { this.heroesService = heroesService; }
    ],
    // This template makes use of the downgraded `ng2-heroes` component
    // Note that because its element is compiled by AngularJS we must use kebab-case attributes
    // for inputs and outputs
    template: `<link rel="stylesheet" href="./styles.css">
          <ng2-heroes [heroes]="$ctrl.heroesService.heroes" (add-hero)="$ctrl.heroesService.addHero()" (remove-hero)="$ctrl.heroesService.removeHero($event)">
            <h1>Heroes</h1>
            <p class="extra">There are {{ $ctrl.heroesService.heroes.length }} heroes.</p>
          </ng2-heroes>`
});
// #enddocregion
// #enddocregion
// #docregion bootstrap-ng2
// We bootstrap the Angular module as we would do in a normal Angular app.
// (We are using the dynamic browser platform as this example has not been compiled AoT.)
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(Ng2AppModule);
// #enddocregion
//# sourceMappingURL=module.js.map