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
var core_1 = require("../../../src/core");
var r3 = require("../../../src/render3/index");
var details_elided = {
    type: Object,
};
///////////
// Lib A - Compiled pre-Ivy
//    "enableIvy": false
//////////
// BEGIN FILE: node_modules/libA/module.ts (Compiled without Ivy)
var LibAComponent = /** @class */ (function () {
    function LibAComponent() {
    }
    LibAComponent = __decorate([
        core_1.Component({})
    ], LibAComponent);
    return LibAComponent;
}());
exports.LibAComponent = LibAComponent;
var LibAModule = /** @class */ (function () {
    function LibAModule() {
    }
    LibAModule = __decorate([
        core_1.NgModule({ declarations: [LibAComponent], imports: [] })
    ], LibAModule);
    return LibAModule;
}());
exports.LibAModule = LibAModule;
// END FILE: node_modules/libA/module.ts
// BEGIN FILE: node_modules/libA/module.metadata.json
// Abridged version of metadata
var node_modules_libA_module_metadata = {
    'LibAModule': {
        refs: ['LibAComponent'],
        constructorDes: [],
    },
    'LibAComponent': {
        constructorDes: [],
    }
};
// END FILE: node_modules/libA/module.metadata.json
///////////
// Lib B - Compiled with Ivy
//    "enableIvy": true
//////////
// BEGIN FILE: node_modules/libB/module.ts (Compiled with Ivy)
var LibBComponent = /** @class */ (function () {
    function LibBComponent() {
    }
    // COMPILER GENERATED
    LibBComponent.ngComponentDef = r3.defineComponent(details_elided);
    LibBComponent = __decorate([
        core_1.Component({})
    ], LibBComponent);
    return LibBComponent;
}());
exports.LibBComponent = LibBComponent;
var LibBModule = /** @class */ (function () {
    function LibBModule() {
    }
    // COMPILER GENERATED
    LibBModule.ngInjectorDef = core_1.defineInjector(details_elided);
    LibBModule = __decorate([
        core_1.NgModule({ declarations: [LibAComponent], imports: [] })
    ], LibBModule);
    return LibBModule;
}());
exports.LibBModule = LibBModule;
// END FILE: node_modules/libB/module.ts
// BEGIN FILE: node_modules/libB/module.metadata.json
// Abridged version of metadata
// Must still generate metadata in case it should be consumed with non-ivy application
// Must mark the metadata with `hasNgDef: true` so that Ivy knows to ignore it.
var node_modules_libB_module_metadata = {
    'LibBModule': { refs: ['LibBComponent'], constructorDes: [], hasNgDef: true },
    'LibBComponent': { constructorDes: [], hasNgDef: true }
};
// END FILE: node_modules/libA/module.metadata.json
///////////
// Lib B - Compiled with Ivy
//    "enableIvy": true
//    "enableIvyBackPatch": true
//////////
// BEGIN FILE: src/app.ts (Compiled with Ivy)
var AppComponent = /** @class */ (function () {
    function AppComponent() {
    }
    // COMPILER GENERATED
    AppComponent.ngComponentDef = r3.defineComponent(details_elided);
    AppComponent = __decorate([
        core_1.Component({})
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    // COMPILER GENERATED
    AppModule.ngInjectorDef = core_1.defineInjector(details_elided);
    AppModule = __decorate([
        core_1.NgModule({ declarations: [LibAComponent], imports: [] })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
// END FILE: src/app.ts
// BEGIN FILE: src/main.ts
// platformBrowserDynamic().bootstrapModule(AppModule);
// CLI rewrites it later to:
// platformBrowser().bootstrapModuleFactory(AppModuleFactory);
// END FILE: src/main.ts
// BEGIN FILE: src/app.ngfactory.ts
function ngBackPatch_node_modules_libB_module() {
    ngBackPatch_node_modules_libB_module_LibAComponent();
    ngBackPatch_node_modules_libB_module_LibAModule();
}
function ngBackPatch_node_modules_libB_module_LibAComponent() {
    LibAComponent.ngComponentDef = r3.defineComponent(details_elided);
}
function ngBackPatch_node_modules_libB_module_LibAModule() {
    LibAModule.ngInjectorDef = core_1.defineInjector(details_elided);
}
exports.AppModuleFactory = {
    moduleType: AppModule,
    patchedDeps: false,
    create: function (parentInjector) {
        this.patchedDeps && ngBackPatch_node_modules_libB_module() && (this.patchedDeps = true);
        return details_elided;
    }
};
// BEGIN FILE: src/app.ngfactory.ts
// ISSUE: I don't think this works. The issue is that multiple modules get flattened into single
// module and hence we can't patch transitively.
// ISSUE: can non-ivy @NgModule import Ivy @NgModule? I assume no, since the flattening of modules
// happens during compilation.
// BEGIN FILE: src/main.ts
// platformBrowserDynamic().bootstrapModule(AppModule);
// CLI rewrites it to:
// platformBrowser().bootstrapModuleFactory(AppModuleFactory);
// END FILE: src/main.ts
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja19wYXRjaF90eXBlc19zcGVjcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9yZW5kZXIzL2NvbXBpbGVyX2Nhbm9uaWNhbC9iYWNrX3BhdGNoX3R5cGVzX3NwZWNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsMENBQThRO0FBQzlRLCtDQUFpRDtBQUVqRCxJQUFNLGNBQWMsR0FBRztJQUNyQixJQUFJLEVBQUUsTUFBTTtDQUNOLENBQUM7QUFHVCxXQUFXO0FBQ1gsMkJBQTJCO0FBQzNCLHdCQUF3QjtBQUN4QixVQUFVO0FBRVYsaUVBQWlFO0FBRWpFO0lBQUE7SUFDQSxDQUFDO0lBRFksYUFBYTtRQUR6QixnQkFBUyxDQUFDLEVBQUUsQ0FBQztPQUNELGFBQWEsQ0FDekI7SUFBRCxvQkFBQztDQUFBLEFBREQsSUFDQztBQURZLHNDQUFhO0FBSTFCO0lBQUE7SUFDQSxDQUFDO0lBRFksVUFBVTtRQUR0QixlQUFRLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFDLENBQUM7T0FDMUMsVUFBVSxDQUN0QjtJQUFELGlCQUFDO0NBQUEsQUFERCxJQUNDO0FBRFksZ0NBQVU7QUFFdkIsd0NBQXdDO0FBQ3hDLHFEQUFxRDtBQUNyRCwrQkFBK0I7QUFDL0IsSUFBTSxpQ0FBaUMsR0FBRztJQUN4QyxZQUFZLEVBQUU7UUFDWixJQUFJLEVBQUUsQ0FBQyxlQUFlLENBQUM7UUFDdkIsY0FBYyxFQUFFLEVBQUU7S0FDbkI7SUFDRCxlQUFlLEVBQUU7UUFDZixjQUFjLEVBQUUsRUFBRTtLQUNuQjtDQUNGLENBQUM7QUFDRixtREFBbUQ7QUFHbkQsV0FBVztBQUNYLDRCQUE0QjtBQUM1Qix1QkFBdUI7QUFDdkIsVUFBVTtBQUdWLDhEQUE4RDtBQUU5RDtJQUFBO0lBR0EsQ0FB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