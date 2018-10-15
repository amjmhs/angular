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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
// #docplaster
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
// #docregion basic-how-to
// Alternatively, we could import and use an `NgModuleFactory` instead:
// import {MyLazyAngularModuleNgFactory} from './my-lazy-angular-module.ngfactory';
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
// #enddocregion
/* tslint:disable: no-duplicate-imports */
var static_1 = require("@angular/upgrade/static");
var static_2 = require("@angular/upgrade/static");
// #docregion basic-how-to
var static_3 = require("@angular/upgrade/static");
// This Angular service will use an "upgraded" AngularJS service.
var HeroesService = /** @class */ (function () {
    function HeroesService(titleCase) {
        this.heroes = [
            { name: 'superman', description: 'The man of steel' },
            { name: 'wonder woman', description: 'Princess of the Amazons' },
            { name: 'thor', description: 'The hammer-wielding god' }
        ];
        // Change all the hero names to title case, using the "upgraded" AngularJS service.
        this.heroes.forEach(function (hero) { return hero.name = titleCase(hero.name); });
    }
    HeroesService.prototype.addHero = function () {
        var newHero = { name: 'Kamala Khan', description: 'Epic shape-shifting healer' };
        this.heroes = this.heroes.concat([newHero]);
        return newHero;
    };
    HeroesService.prototype.removeHero = function (hero) { this.heroes = this.heroes.filter(function (item) { return item !== hero; }); };
    HeroesService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject('titleCase')),
        __metadata("design:paramtypes", [Function])
    ], HeroesService);
    return HeroesService;
}());
// This Angular component will be "downgraded" to be used in AngularJS.
var Ng2HeroesComponent = /** @class */ (function () {
    function Ng2HeroesComponent($rootScope, heroesService) {
        this.$rootScope = $rootScope;
        this.heroesService = heroesService;
        this.addHero = new core_1.EventEmitter();
        this.removeHero = new core_1.EventEmitter();
    }
    Ng2HeroesComponent.prototype.onAddHero = function () {
        var newHero = this.heroesService.addHero();
        this.addHero.emit(newHero);
        // When a new instance of an "upgraded" component - such as `ng1Hero` - is created, we want to
        // run a `$digest` to initialize its bindings. Here, the component will be created by `ngFor`
        // asynchronously, thus we have to schedule the `$digest` to also happen asynchronously.
        this.$rootScope.$applyAsync();
    };
    Ng2HeroesComponent.prototype.onRemoveHero = function (hero) {
        this.heroesService.removeHero(hero);
        this.removeHero.emit(hero);
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
            template: "\n    <div class=\"ng2-heroes\">\n      <header><ng-content selector=\"h1\"></ng-content></header>\n      <ng-content selector=\".extra\"></ng-content>\n      <div *ngFor=\"let hero of this.heroesService.heroes\">\n        <ng1-hero [hero]=\"hero\" (onRemove)=\"onRemoveHero(hero)\">\n          <strong>Super Hero</strong>\n        </ng1-hero>\n      </div>\n      <button (click)=\"onAddHero()\">Add Hero</button>\n    </div>\n  ",
        }),
        __param(0, core_1.Inject('$rootScope')),
        __metadata("design:paramtypes", [Object, HeroesService])
    ], Ng2HeroesComponent);
    return Ng2HeroesComponent;
}());
// This Angular directive will act as an interface to the "upgraded" AngularJS component.
var Ng1HeroComponentWrapper = /** @class */ (function (_super) {
    __extends(Ng1HeroComponentWrapper, _super);
    function Ng1HeroComponentWrapper(elementRef, injector) {
        // We must pass the name of the directive as used by AngularJS to the super.
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
// This Angular module represents the Angular pieces of the application.
var MyLazyAngularModule = /** @class */ (function () {
    function MyLazyAngularModule() {
    }
    // Empty placeholder method to prevent the `Compiler` from complaining.
    MyLazyAngularModule.prototype.ngDoBootstrap = function () { };
    MyLazyAngularModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule],
            declarations: [Ng2HeroesComponent, Ng1HeroComponentWrapper],
            providers: [
                HeroesService,
                // Register an Angular provider whose value is the "upgraded" AngularJS service.
                { provide: 'titleCase', useFactory: function (i) { return i.get('titleCase'); }, deps: ['$injector'] }
            ],
            // All components that are to be "downgraded" must be declared as `entryComponents`.
            entryComponents: [Ng2HeroesComponent]
            // Note that there are no `bootstrap` components, since the "downgraded" component
            // will be instantiated by ngUpgrade.
        })
    ], MyLazyAngularModule);
    return MyLazyAngularModule;
}());
// #docregion basic-how-to
// The function that will bootstrap the Angular module (when/if necessary).
// (This would be omitted if we provided an `NgModuleFactory` directly.)
var ng2BootstrapFn = function (extraProviders) {
    return platform_browser_dynamic_1.platformBrowserDynamic(extraProviders).bootstrapModule(MyLazyAngularModule);
};
// #enddocregion
// (We are using the dynamic browser platform, as this example has not been compiled AoT.)
// #docregion basic-how-to
// This AngularJS module represents the AngularJS pieces of the application.
var myMainAngularJsModule = angular.module('myMainAngularJsModule', [
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
    template: "\n    <div class=\"ng1-hero\">\n      <div class=\"title\" ng-transclude></div>\n      <h2>{{ $ctrl.hero.name }}</h2>\n      <p>{{ $ctrl.hero.description }}</p>\n      <button ng-click=\"$ctrl.onRemove()\">Remove</button>\n    </div>\n  "
});
// This AngularJS service will be "upgraded" to be used in Angular.
myMainAngularJsModule.factory('titleCase', function () { return function (value) { return value.replace(/(^|\s)[a-z]/g, function (m) { return m.toUpperCase(); }); }; });
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
    template: "\n    <link rel=\"stylesheet\" href=\"./styles.css\">\n    <button ng-click=\"$ctrl.toggleHeroes()\">{{ $ctrl.toggleBtnText() }}</button>\n    <ng2-heroes\n        ng-if=\"$ctrl.showHeroes\"\n        (add-hero)=\"$ctrl.setStatusMessage('Added hero ' + $event.name)\"\n        (remove-hero)=\"$ctrl.setStatusMessage('Removed hero ' + $event.name)\">\n      <h1>Heroes</h1>\n      <p class=\"extra\">Status: {{ $ctrl.statusMessage }}</p>\n    </ng2-heroes>\n  ",
    controller: function () {
        var _this = this;
        this.showHeroes = false;
        this.statusMessage = 'Ready';
        this.setStatusMessage = function (msg) { return _this.statusMessage = msg; };
        this.toggleHeroes = function () { return _this.showHeroes = !_this.showHeroes; };
        this.toggleBtnText = function () { return (_this.showHeroes ? 'Hide' : 'Show') + " heroes"; };
    }
});
// We bootstrap the Angular module as we would do in a normal Angular app.
angular.bootstrap(document.body, [myMainAngularJsModule.name]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvdXBncmFkZS9zdGF0aWMvdHMvbGl0ZS9tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsY0FBYztBQUNkLHNDQUFvSjtBQUNwSiw4REFBd0Q7QUFDeEQsMEJBQTBCO0FBQzFCLHVFQUF1RTtBQUN2RSxtRkFBbUY7QUFDbkYsOEVBQXlFO0FBQ3pFLGdCQUFnQjtBQUNoQiwwQ0FBMEM7QUFDMUMsa0RBQXlEO0FBQ3pELGtEQUEyRDtBQUUzRCwwQkFBMEI7QUFDMUIsa0RBQXdEO0FBYXhELGlFQUFpRTtBQUVqRTtJQU9FLHVCQUFpQyxTQUFnQztRQU5qRSxXQUFNLEdBQVc7WUFDZixFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixFQUFDO1lBQ25ELEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUseUJBQXlCLEVBQUM7WUFDOUQsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSx5QkFBeUIsRUFBQztTQUN2RCxDQUFDO1FBR0EsbUZBQW1GO1FBQ25GLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBVSxJQUFLLE9BQUEsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFoQyxDQUFnQyxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVELCtCQUFPLEdBQVA7UUFDRSxJQUFNLE9BQU8sR0FBUyxFQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLDRCQUE0QixFQUFDLENBQUM7UUFDdkYsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFD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