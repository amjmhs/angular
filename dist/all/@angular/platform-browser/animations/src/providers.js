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
var animations_1 = require("@angular/animations");
var browser_1 = require("@angular/animations/browser");
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var animation_builder_1 = require("./animation_builder");
var animation_renderer_1 = require("./animation_renderer");
var InjectableAnimationEngine = /** @class */ (function (_super) {
    __extends(InjectableAnimationEngine, _super);
    function InjectableAnimationEngine(doc, driver, normalizer) {
        return _super.call(this, doc.body, driver, normalizer) || this;
    }
    InjectableAnimationEngine = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(common_1.DOCUMENT)),
        __metadata("design:paramtypes", [Object, browser_1.AnimationDriver, browser_1.ɵAnimationStyleNormalizer])
    ], InjectableAnimationEngine);
    return InjectableAnimationEngine;
}(browser_1.ɵAnimationEngine));
exports.InjectableAnimationEngine = InjectableAnimationEngine;
function instantiateSupportedAnimationDriver() {
    return browser_1.ɵsupportsWebAnimations() ? new browser_1.ɵWebAnimationsDriver() : new browser_1.ɵCssKeyframesDriver();
}
exports.instantiateSupportedAnimationDriver = instantiateSupportedAnimationDriver;
function instantiateDefaultStyleNormalizer() {
    return new browser_1.ɵWebAnimationsStyleNormalizer();
}
exports.instantiateDefaultStyleNormalizer = instantiateDefaultStyleNormalizer;
function instantiateRendererFactory(renderer, engine, zone) {
    return new animation_renderer_1.AnimationRendererFactory(renderer, engine, zone);
}
exports.instantiateRendererFactory = instantiateRendererFactory;
/**
 * @experimental Animation support is experimental.
 */
exports.ANIMATION_MODULE_TYPE = new core_1.InjectionToken('AnimationModuleType');
var SHARED_ANIMATION_PROVIDERS = [
    { provide: animations_1.AnimationBuilder, useClass: animation_builder_1.BrowserAnimationBuilder },
    { provide: browser_1.ɵAnimationStyleNormalizer, useFactory: instantiateDefaultStyleNormalizer },
    { provide: browser_1.ɵAnimationEngine, useClass: InjectableAnimationEngine }, {
        provide: core_1.RendererFactory2,
        useFactory: instantiateRendererFactory,
        deps: [platform_browser_1.ɵDomRendererFactory2, browser_1.ɵAnimationEngine, core_1.NgZone]
    }
];
/**
 * Separate providers from the actual module so that we can do a local modification in Google3 to
 * include them in the BrowserModule.
 */
exports.BROWSER_ANIMATIONS_PROVIDERS = [
    { provide: browser_1.AnimationDriver, useFactory: instantiateSupportedAnimationDriver },
    { provide: exports.ANIMATION_MODULE_TYPE, useValue: 'BrowserAnimations' }
].concat(SHARED_ANIMATION_PROVIDERS);
/**
 * Separate providers from the actual module so that we can do a local modification in Google3 to
 * include them in the BrowserTestingModule.
 */
exports.BROWSER_NOOP_ANIMATIONS_PROVIDERS = [
    { provide: browser_1.AnimationDriver, useClass: browser_1.ɵNoopAnimationDriver },
    { provide: exports.ANIMATION_MODULE_TYPE, useValue: 'NoopAnimations' }
].concat(SHARED_ANIMATION_PROVIDERS);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zL3NyYy9wcm92aWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsa0RBQXFEO0FBQ3JELHVEQUE2WTtBQUM3WSwwQ0FBeUM7QUFDekMsc0NBQXFHO0FBQ3JHLDhEQUFzRjtBQUV0Rix5REFBNEQ7QUFDNUQsMkRBQThEO0FBRzlEO0lBQStDLDZDQUFlO0lBQzVELG1DQUNzQixHQUFRLEVBQUUsTUFBdUIsRUFBRSxVQUFvQztlQUMzRixrQkFBTSxHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUM7SUFDckMsQ0FBQztJQUpVLHlCQUF5QjtRQURyQyxpQkFBVSxFQUFFO1FBR04sV0FBQSxhQUFNLENBQUMsaUJBQVEsQ0FBQyxDQUFBO2lEQUFtQix5QkFBZSxFQUFjLG1DQUF3QjtPQUZsRix5QkFBeUIsQ0FLckM7SUFBRCxnQ0FBQztDQUFBLEFBTEQsQ0FBK0MsMEJBQWUsR0FLN0Q7QUFMWSw4REFBeUI7QUFPdEM7SUFDRSxPQUFPLGdDQUFxQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksOEJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSw2QkFBa0IsRUFBRSxDQUFDO0FBQ3hGLENBQUM7QUFGRCxrRkFFQztBQUVEO0lBQ0UsT0FBTyxJQUFJLHVDQUE0QixFQUFFLENBQUM7QUFDNUMsQ0FBQztBQUZELDhFQUVDO0FBRUQsb0NBQ0ksUUFBNkIsRUFBRSxNQUF1QixFQUFFLElBQVk7SUFDdEUsT0FBTyxJQUFJLDZDQUF3QixDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDOUQsQ0FBQztBQUhELGdFQUdDO0FBRUQ7O0dBRUc7QUFDVSxRQUFBLHFCQUFxQixHQUM5QixJQUFJLHFCQUFjLENBQXVDLHFCQUFxQixDQUFDLENBQUM7QUFFcEYsSUFBTSwwQkFBMEIsR0FBZTtJQUM3QyxFQUFDLE9BQU8sRUFBRSw2QkFBZ0IsRUFBRSxRQUFRLEVBQUUsMkNBQXVCLEVBQUM7SUFDOUQsRUFBQyxPQUFPLEVBQUUsbUNBQXdCLEVBQUUsVUFBVSxFQUFFLGlDQUFpQyxFQUFDO0lBQ2xGLEVBQUMsT0FBTyxFQUFFLDBCQUFlLEVBQUUsUUFBUSxFQUFFLHlCQUF5QixFQUFDLEVBQUU7UUFDL0QsT0FBTyxFQUFFLHVCQUFnQjtRQUN6QixVQUFVLEVBQUUsMEJBQTBCO1FBQ3RDLElBQUksRUFBRSxDQUFDLHVDQUFtQixFQUFFLDBCQUFlLEVBQUUsYUFBTSxDQUFDO0tBQ3JEO0NBQ0YsQ0FBQztBQUVGOzs7R0FHRztBQUNVLFFBQUEsNEJBQTRCO0lBQ3ZDLEVBQUMsT0FBTyxFQUFFLHlCQUFlLEVBQUUsVUFBVSxFQUFFLG1DQUFtQyxFQUFDO0lBQzNFLEVBQUMsT0FBTyxFQUFFLDZCQUFxQixFQUFFLFFBQVEsRUFBRSxtQkFBbUIsRUFBQztTQUFLLDBCQUEwQixFQUM5RjtBQUVGOzs7R0FHRztBQUNVLFFBQUEsaUNBQWlDO0lBQzVDLEVBQUMsT0FBTyxFQUFFLHlCQUFlLEVBQUUsUUFBUSxFQUFFLDhCQUFtQixFQUFDO0lBQ3pELEVBQUMsT0FBTyxFQUFFLDZCQUFxQixFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBQztTQUFLLDBCQUEwQixFQUMzRiJ9