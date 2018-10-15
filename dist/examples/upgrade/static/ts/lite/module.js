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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
// #docplaster
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
// #docregion basic-how-to
// Alternatively, we could import and use an `NgModuleFactory` instead:
// import {MyLazyAngularModuleNgFactory} from './my-lazy-angular-module.ngfactory';
const platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
// #enddocregion
/* tslint:disable: no-duplicate-imports */
const static_1 = require("@angular/upgrade/static");
const static_2 = require("@angular/upgrade/static");
// #docregion basic-how-to
const static_3 = require("@angular/upgrade/static");
// This Angular service will use an "upgraded" AngularJS service.
let HeroesService = class HeroesService {
    constructor(titleCase) {
        this.heroes = [
            { name: 'superman', description: 'The man of steel' },
            { name: 'wonder woman', description: 'Princess of the Amazons' },
            { name: 'thor', description: 'The hammer-wielding god' }
        ];
        // Change all the hero names to title case, using the "upgraded" AngularJS service.
        this.heroes.forEach((hero) => hero.name = titleCase(hero.name));
    }
    addHero() {
        const newHero = { name: 'Kamala Khan', description: 'Epic shape-shifting healer' };
        this.heroes = this.heroes.concat([newHero]);
        return newHero;
    }
    removeHero(hero) { this.heroes = this.heroes.filter((item) => item !== hero); }
};
HeroesService = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject('titleCase')),
    __metadata("design:paramtypes", [Function])
], HeroesService);
// This Angular component will be "downgraded" to be used in AngularJS.
let Ng2HeroesComponent = class Ng2HeroesComponent {
    constructor($rootScope, heroesService) {
        this.$rootScope = $rootScope;
        this.heroesService = heroesService;
        this.addHero = new core_1.EventEmitter();
        this.removeHero = new core_1.EventEmitter();
    }
    onAddHero() {
        const newHero = this.heroesService.addHero();
        this.addHero.emit(newHero);
        // When a new instance of an "upgraded" component - such as `ng1Hero` - is created, we want to
        // run a `$digest` to initialize its bindings. Here, the component will be created by `ngFor`
        // asynchronously, thus we have to schedule the `$digest` to also happen asynchronously.
        this.$rootScope.$applyAsync();
    }
    onRemoveHero(hero) {
        this.heroesService.removeHero(hero);
        this.removeHero.emit(hero);
    }
};
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
        // This template uses the "upgraded" `ng1-hero` component
        // (Note that because its element is compiled by Angular we must use camelCased attribute names.)
        template: `
    <div class="ng2-heroes">
      <header><ng-content selector="h1"></ng-content></header>
      <ng-content selector=".extra"></ng-content>
      <div *ngFor="let hero of this.heroesService.heroes">
        <ng1-hero [hero]="hero" (onRemove)="onRemoveHero(hero)">
          <strong>Super Hero</strong>
        </ng1-hero>
      </div>
      <button (click)="onAddHero()">Add Hero</button>
    </div>
  `,
    }),
    __param(0, core_1.Inject('$rootScope')),
    __metadata("design:paramtypes", [Object, HeroesService])
], Ng2HeroesComponent);
// This Angular directive will act as an interface to the "upgraded" AngularJS component.
let Ng1HeroComponentWrapper = class Ng1HeroComponentWrapper extends static_1.UpgradeComponent {
    constructor(elementRef, injector) {
        // We must pass the name of the directive as used by AngularJS to the super.
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
// This Angular module represents the Angular pieces of the application.
let MyLazyAngularModule = class MyLazyAngularModule {
    // Empty placeholder method to prevent the `Compiler` from complaining.
    ngDoBootstrap() { }
};
MyLazyAngularModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule],
        declarations: [Ng2HeroesComponent, Ng1HeroComponentWrapper],
        providers: [
            HeroesService,
            // Register an Angular provider whose value is the "upgraded" AngularJS service.
            { provide: 'titleCase', useFactory: (i) => i.get('titleCase'), deps: ['$injector'] }
        ],
        // All components that are to be "downgraded" must be declared as `entryComponents`.
        entryComponents: [Ng2HeroesComponent]
        // Note that there are no `bootstrap` components, since the "downgraded" component
        // will be instantiated by ngUpgrade.
    })
], MyLazyAngularModule);
// #docregion basic-how-to
// The function that will bootstrap the Angular module (when/if necessary).
// (This would be omitted if we provided an `NgModuleFactory` directly.)
const ng2BootstrapFn = (extraProviders) => platform_browser_dynamic_1.platformBrowserDynamic(extraProviders).bootstrapModule(MyLazyAngularModule);
// #enddocregion
// (We are using the dynamic browser platform, as this example has not been compiled AoT.)
// #docregion basic-how-to
// This AngularJS module represents the AngularJS pieces of the application.
const myMainAngularJsModule = angular.module('myMainAngularJsModule', [
    // We declare a dependency on the "downgraded" Angular module.
    static_3.downgradeModule(ng2BootstrapFn)
    // or
    // downgradeModule(MyLazyAngularModuleFactory)
]);
// #enddocregion
// This AngularJS component will be "upgraded" to be used in Angular.
myMainAngularJsModule.component('ng1Hero', {
    bindings: { hero: '<', onRemove: '&' },
    transclude: true,
    template: `
    <div class="ng1-hero">
      <div class="title" ng-transclude></div>
      <h2>{{ $ctrl.hero.name }}</h2>
      <p>{{ $ctrl.hero.description }}</p>
      <button ng-click="$ctrl.onRemove()">Remove</button>
    </div>
  `
});
// This AngularJS service will be "upgraded" to be used in Angular.
myMainAngularJsModule.factory('titleCase', () => (value) => value.replace(/(^|\s)[a-z]/g, m => m.toUpperCase()));
// This directive will act as the interface to the "downgraded" Angular component.
myMainAngularJsModule.directive('ng2Heroes', static_2.downgradeComponent({
    component: Ng2HeroesComponent,
    // Optionally, disable `$digest` propagation to avoid unnecessary change detection.
    // (Change detection is still run when the inputs of a "downgraded" component change.)
    propagateDigest: false
}));
// This is our top level application component.
myMainAngularJsModule.component('exampleApp', {
    // This template makes use of the "downgraded" `ng2-heroes` component,
    // but loads it lazily only when/if the user clicks the button.
    // (Note that because its element is compiled by AngularJS,
    //  we must use kebab-case attributes for inputs and outputs.)
    template: `
    <link rel="stylesheet" href="./styles.css">
    <button ng-click="$ctrl.toggleHeroes()">{{ $ctrl.toggleBtnText() }}</button>
    <ng2-heroes
        ng-if="$ctrl.showHeroes"
        (add-hero)="$ctrl.setStatusMessage('Added hero ' + $event.name)"
        (remove-hero)="$ctrl.setStatusMessage('Removed hero ' + $event.name)">
      <h1>Heroes</h1>
      <p class="extra">Status: {{ $ctrl.statusMessage }}</p>
    </ng2-heroes>
  `,
    controller: function () {
        this.showHeroes = false;
        this.statusMessage = 'Ready';
        this.setStatusMessage = (msg) => this.statusMessage = msg;
        this.toggleHeroes = () => this.showHeroes = !this.showHeroes;
        this.toggleBtnText = () => `${this.showHeroes ? 'Hide' : 'Show'} heroes`;
    }
});
// We bootstrap the Angular module as we would do in a normal Angular app.
angular.bootstrap(document.body, [myMainAngularJsModule.name]);
//# sourceMappingURL=module.js.map