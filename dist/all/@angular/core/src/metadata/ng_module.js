"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var defs_1 = require("../di/defs");
var injectable_1 = require("../di/injectable");
var ivy_switch_1 = require("../ivy_switch");
var decorators_1 = require("../util/decorators");
/**
 * Defines a schema that allows an NgModule to contain the following:
 * - Non-Angular elements named with dash case (`-`).
 * - Element properties named with dash case (`-`).
 * Dash case is the naming convention for custom elements.
 *
 *
 */
exports.CUSTOM_ELEMENTS_SCHEMA = {
    name: 'custom-elements'
};
/**
 * Defines a schema that allows any property on any element.
 *
 * @experimental
 */
exports.NO_ERRORS_SCHEMA = {
    name: 'no-errors-schema'
};
function preR3NgModuleCompile(moduleType, metadata) {
    var imports = (metadata && metadata.imports) || [];
    if (metadata && metadata.exports) {
        imports = imports.concat([metadata.exports]);
    }
    moduleType.ngInjectorDef = defs_1.defineInjector({
        factory: injectable_1.convertInjectableProviderToFactory(moduleType, { useClass: moduleType }),
        providers: metadata && metadata.providers,
        imports: imports,
    });
}
/**
 * @Annotation
 */
exports.NgModule = decorators_1.makeDecorator('NgModule', function (ngModule) { return ngModule; }, undefined, undefined, 
/**
 * Decorator that marks the following class as an NgModule, and supplies
 * configuration metadata for it.
 *
 * * The `declarations` and `entryComponents` options configure the compiler
 * with information about what belongs to the NgModule.
 * * The `providers` options configures the NgModule's injector to provide
 * dependencies the NgModule members.
 * * The `imports` and `exports` options bring in members from other modules, and make
 * this module's members available to others.
 */
function (type, meta) { return (ivy_switch_1.R3_COMPILE_NGMODULE || preR3NgModuleCompile)(type, meta); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvbWV0YWRhdGEvbmdfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsbUNBQXFFO0FBQ3JFLCtDQUFvRTtBQUVwRSw0Q0FBa0Q7QUFFbEQsaURBQWdFO0FBaUZoRTs7Ozs7OztHQU9HO0FBQ1UsUUFBQSxzQkFBc0IsR0FBbUI7SUFDcEQsSUFBSSxFQUFFLGlCQUFpQjtDQUN4QixDQUFDO0FBRUY7Ozs7R0FJRztBQUNVLFFBQUEsZ0JBQWdCLEdBQW1CO0lBQzlDLElBQUksRUFBRSxrQkFBa0I7Q0FDekIsQ0FBQztBQW1ORiw4QkFBOEIsVUFBNkIsRUFBRSxRQUFrQjtJQUM3RSxJQUFJLE9BQU8sR0FBRyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ25ELElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUU7UUFDaEMsT0FBTyxHQUFPLE9BQU8sU0FBRSxRQUFRLENBQUMsT0FBTyxFQUFDLENBQUM7S0FDMUM7SUFFRCxVQUFVLENBQUMsYUFBYSxHQUFHLHFCQUFjLENBQUM7UUFDeEMsT0FBTyxFQUFFLCtDQUFrQyxDQUFDLFVBQVUsRUFBRSxFQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUMsQ0FBQztRQUMvRSxTQUFTLEVBQUUsUUFBUSxJQUFJLFFBQVEsQ0FBQyxTQUFTO1FBQ3pDLE9BQU8sRUFBRSxPQUFPO0tBQ2pCLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRDs7R0FFRztBQUNVLFFBQUEsUUFBUSxHQUFzQiwwQkFBYSxDQUNwRCxVQUFVLEVBQUUsVUFBQyxRQUFrQixJQUFLLE9BQUEsUUFBUSxFQUFSLENBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUztBQUNsRTs7Ozs7Ozs7OztHQVVHO0FBQ0gsVUFBQyxJQUFlLEVBQUUsSUFBYyxJQUFLLE9BQUEsQ0FBQyxnQ0FBbUIsSUFBSSxvQkFBb0IsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBekQsQ0FBeUQsQ0FBQyxDQUFDIn0=