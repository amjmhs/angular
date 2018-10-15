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
var di_1 = require("../di");
/**
 * Combination of NgModuleFactory and ComponentFactorys.
 *
 * @experimental
 */
var ModuleWithComponentFactories = /** @class */ (function () {
    function ModuleWithComponentFactories(ngModuleFactory, componentFactories) {
        this.ngModuleFactory = ngModuleFactory;
        this.componentFactories = componentFactories;
    }
    return ModuleWithComponentFactories;
}());
exports.ModuleWithComponentFactories = ModuleWithComponentFactories;
function _throwError() {
    throw new Error("Runtime compiler is not loaded");
}
/**
 * Low-level service for running the angular compiler during runtime
 * to create {@link ComponentFactory}s, which
 * can later be used to create and render a Component instance.
 *
 * Each `@NgModule` provides an own `Compiler` to its injector,
 * that will use the directives/pipes of the ng module for compilation
 * of components.
 *
 */
var Compiler = /** @class */ (function () {
    function Compiler() {
    }
    /**
     * Compiles the given NgModule and all of its components. All templates of the components listed
     * in `entryComponents` have to be inlined.
     */
    Compiler.prototype.compileModuleSync = function (moduleType) { throw _throwError(); };
    /**
     * Compiles the given NgModule and all of its components
     */
    Compiler.prototype.compileModuleAsync = function (moduleType) { throw _throwError(); };
    /**
     * Same as {@link #compileModuleSync} but also creates ComponentFactories for all components.
     */
    Compiler.prototype.compileModuleAndAllComponentsSync = function (moduleType) {
        throw _throwError();
    };
    /**
     * Same as {@link #compileModuleAsync} but also creates ComponentFactories for all components.
     */
    Compiler.prototype.compileModuleAndAllComponentsAsync = function (moduleType) {
        throw _throwError();
    };
    /**
     * Clears all caches.
     */
    Compiler.prototype.clearCache = function () { };
    /**
     * Clears the cache for the given component/ngModule.
     */
    Compiler.prototype.clearCacheFor = function (type) { };
    /**
     * Returns the id for a given NgModule, if one is defined and known to the compiler.
     */
    Compiler.prototype.getModuleId = function (moduleType) { return undefined; };
    Compiler = __decorate([
        di_1.Injectable()
    ], Compiler);
    return Compiler;
}());
exports.Compiler = Compiler;
/**
 * Token to provide CompilerOptions in the platform injector.
 *
 * @experimental
 */
exports.COMPILER_OPTIONS = new di_1.InjectionToken('compilerOptions');
/**
 * A factory for creating a Compiler
 *
 * @experimental
 */
var CompilerFactory = /** @class */ (function () {
    function CompilerFactory() {
    }
    return CompilerFactory;
}());
exports.CompilerFactory = CompilerFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9saW5rZXIvY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCw0QkFBaUU7QUFTakU7Ozs7R0FJRztBQUNIO0lBQ0Usc0NBQ1csZUFBbUMsRUFDbkMsa0JBQTJDO1FBRDNDLG9CQUFlLEdBQWYsZUFBZSxDQUFvQjtRQUNuQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQXlCO0lBQUcsQ0FBQztJQUM1RCxtQ0FBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBSlksb0VBQTRCO0FBT3pDO0lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQ3BELENBQUM7QUFFRDs7Ozs7Ozs7O0dBU0c7QUFFSDtJQUFBO0lBeUNBLENBQUM7SUF4Q0M7OztPQUdHO0lBQ0gsb0NBQWlCLEdBQWpCLFVBQXFCLFVBQW1CLElBQXdCLE1BQU0sV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRXRGOztPQUVHO0lBQ0gscUNBQWtCLEdBQWxCLFVBQXNCLFVBQW1CLElBQWlDLE1BQU0sV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRWhHOztPQUVHO0lBQ0gsb0RBQWlDLEdBQWpDLFVBQXFDLFVBQW1CO1FBQ3RELE1BQU0sV0FBVyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVEOztPQUVHO0lBQ0gscURBQWtDLEdBQWxDLFVBQXNDLFVBQW1CO1FBRXZELE1BQU0sV0FBVyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsNkJBQVUsR0FBVixjQUFvQixDQUFDO0lBRXJCOztPQUVHO0lBQ0gsZ0NBQWEsR0FBYixVQUFjLElBQWUsSUFBRyxDQUFDO0lBRWpDOztPQUVHO0lBQ0gsOEJBQVcsR0FBWCxVQUFZLFVBQXFCLElBQXNCLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQztJQXhDL0QsUUFBUTtRQURwQixlQUFVLEVBQUU7T0FDQSxRQUFRLENBeUNwQjtJQUFELGVBQUM7Q0FBQSxBQXpDRCxJQXlDQztBQXpDWSw0QkFBUTtBQXdEckI7Ozs7R0FJRztBQUNVLFFBQUEsZ0JBQWdCLEdBQUcsSUFBSSxtQkFBYyxDQUFvQixpQkFBaUIsQ0FBQyxDQUFDO0FBRXpGOzs7O0dBSUc7QUFDSDtJQUFBO0lBRUEsQ0FBQztJQUFELHNCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGcUIsMENBQWUifQ==