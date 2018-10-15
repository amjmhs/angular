"use strict";
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
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var static_1 = require("@angular/upgrade/static");
// #docregion ng1-text-formatter-service
var TextFormatter = /** @class */ (function () {
    function TextFormatter() {
    }
    TextFormatter.prototype.titleCase = function (value) { return value.replace(/((^|\s)[a-z])/g, function (_, c) { return c.toUpperCase(); }); };
    return TextFormatter;
}());
// #enddocregion
// #docregion Angular Stuff
// #docregion ng2-heroes
// This Angular component will be "downgraded" to be used in AngularJS
var Ng2HeroesComponent = /** @class */ (function () {
    function Ng2HeroesComponent() {
        this.addHero = new core_1.EventEmitter();
        this.removeHero = new core_1.EventEmitter();
    }
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
            template: "<header><ng-content selector=\"h1\"></ng-content></header>\n             <ng-content selector=\".extra\"></ng-content>\n             <div *ngFor=\"let hero of heroes\">\n               <ng1-hero [hero]=\"hero\" (onRemove)=\"removeHero.emit(hero)\"><strong>Super Hero</strong></ng1-hero>\n             </div>\n             <button (click)=\"addHero.emit()\">Add Hero</button>",
        })
    ], Ng2HeroesComponent);
    return Ng2HeroesComponent;
}());
// #enddocregion
// #docregion ng2-heroes-service
// This Angular service will be "downgraded" to be used in AngularJS
var HeroesService = /** @class */ (function () {
    // #docregion use-ng1-upgraded-service
    function HeroesService(textFormatter) {
        this.heroes = [
            { name: 'superman', description: 'The man of steel' },
            { name: 'wonder woman', description: 'Princess of the Amazons' },
            { name: 'thor', description: 'The hammer-wielding god' }
        ];
        // Change all the hero names to title case, using the "upgraded" AngularJS service
        this.heroes.forEach(function (hero) { return hero.name = textFormatter.titleCase(hero.name); });
    }
    // #enddocregion
    HeroesService.prototype.addHero = function () {
        this.heroes =
            this.heroes.concat([{ name: 'Kamala Khan', description: 'Epic shape-shifting healer' }]);
    };
    HeroesService.prototype.removeHero = function (hero) { this.heroes = this.heroes.filter(function (item) { return item !== hero; }); };
    HeroesService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [TextFormatter])
    ], HeroesService);
    return HeroesService;
}());
// #enddocregion
// #docregion ng1-hero-wrapper
// This Angular directive will act as an interface to the "upgraded" AngularJS component
var Ng1HeroComponentWrapper = /** @class */ (function (_super) {
    __extends(Ng1HeroComponentWrapper, _super);
    function Ng1HeroComponentWrapper(elementRef, injector) {
        // We must pass the name of the directive as used by AngularJS to the super
        return _super.call(this, 'ng1Hero', elementRef, injector) || this;
    }
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
    return Ng1HeroComponentWrapper;
}(static_1.UpgradeComponent));
// #enddocregion
// #docregion ng2-module
// This NgModule represents the Angular pieces of the application
var Ng2AppModule = /** @class */ (function () {
    // #enddocregion ng2-module
    function Ng2AppModule(upgrade) {
        this.upgrade = upgrade;
    }
    Ng2AppModule.prototype.ngDoBootstrap = function () {
        // We bootstrap the AngularJS app.
        this.upgrade.bootstrap(document.body, [ng1AppModule.name]);
    };
    Ng2AppModule = __decorate([
        core_1.NgModule({
            declarations: [Ng2HeroesComponent, Ng1HeroComponentWrapper],
            providers: [
                HeroesService,
                // #docregion upgrade-ng1-service
                // Register an Angular provider whose value is the "upgraded" AngularJS service
                { provide: TextFormatter, useFactory: function (i) { return i.get('textFormatter'); }, deps: ['$injector'] }
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
    return Ng2AppModule;
}());
// #enddocregion bootstrap-ng1
// #enddocregion ng2-module
// #enddocregion
// #docregion Angular 1 Stuff
// #docregion ng1-module
// This Angular 1 module represents the AngularJS pieces of the application
var ng1AppModule = angular.module('ng1AppModule', []);
// #enddocregion
// #docregion ng1-hero
// This AngularJS component will be "upgraded" to be used in Angular
ng1AppModule.component('ng1Hero', {
    bindings: { hero: '<', onRemove: '&' },
    transclude: true,
    template: "<div class=\"title\" ng-transclude></div>\n             <h2>{{ $ctrl.hero.name }}</h2>\n             <p>{{ $ctrl.hero.description }}</p>\n             <button ng-click=\"$ctrl.onRemove()\">Remove</button>"
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
    template: "<link rel=\"stylesheet\" href=\"./styles.css\">\n          <ng2-heroes [heroes]=\"$ctrl.heroesService.heroes\" (add-hero)=\"$ctrl.heroesService.addHero()\" (remove-hero)=\"$ctrl.heroesService.removeHero($event)\">\n            <h1>Heroes</h1>\n            <p class=\"extra\">There are {{ $ctrl.heroesService.heroes.length }} heroes.</p>\n          </ng2-heroes>"
});
// #enddocregion
// #enddocregion
// #docregion bootstrap-ng2
// We bootstrap the Angular module as we would do in a normal Angular app.
// (We are using the dynamic browser platform as this example has not been compiled AoT.)
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(Ng2AppModule);
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvdXBncmFkZS9zdGF0aWMvdHMvZnVsbC9tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsY0FBYztBQUNkLHNDQUFvSTtBQUNwSSw4REFBd0Q7QUFDeEQsOEVBQXlFO0FBQ3pFLGtEQUFpSDtBQVNqSCx3Q0FBd0M7QUFDeEM7SUFBQTtJQUVBLENBQUM7SUFEQyxpQ0FBUyxHQUFULFVBQVUsS0FBYSxJQUFJLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQWYsQ0FBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pHLG9CQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFFRCxnQkFBZ0I7QUFDaEIsMkJBQTJCO0FBQzNCLHdCQUF3QjtBQUN4QixzRUFBc0U7QUFZdEU7SUFYQTtRQWFZLFlBQU8sR0FBRyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztRQUM3QixlQUFVLEdBQUcsSUFBSSxtQkFBWSxFQUFFLENBQUM7SUFDNUMsQ0FBQztJQUhVO1FBQVIsWUFBSyxFQUFFOztzREFBa0I7SUFDaEI7UUFBVCxhQUFNLEVBQUU7O3VEQUE4QjtJQUM3QjtRQUFULGFBQU0sRUFBRTs7MERBQWlDO0lBSHRDLGtCQUFrQjtRQVh2QixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFlBQVk7WUFDdEIsdURBQXVEO1lBQ3ZELDhGQUE4RjtZQUM5RixRQUFRLEVBQUUsd1hBS29EO1NBQy9ELENBQUM7T0FDSSxrQkFBa0IsQ0FJdkI7SUFBRCx5QkFBQztDQUFBLEFBSkQsSUFJQztBQUNELGdCQUFnQjtBQUVoQixnQ0FBZ0M7QUFDaEMsb0VBQW9FO0FBRXBF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