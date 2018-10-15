/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { defineInjector } from '../di/defs';
import { convertInjectableProviderToFactory } from '../di/injectable';
import { R3_COMPILE_NGMODULE } from '../ivy_switch';
import { makeDecorator } from '../util/decorators';
/**
 * Represents the expansion of an `NgModule` into its scopes.
 *
 * A scope is a set of directives and pipes that are visible in a particular context. Each
 * `NgModule` has two scopes. The `compilation` scope is the set of directives and pipes that will
 * be recognized in the templates of components declared by the module. The `exported` scope is the
 * set of directives and pipes exported by a module (that is, module B's exported scope gets added
 * to module A's compilation scope when module A imports B).
 * @record
 */
export function NgModuleTransitiveScopes() { }
/** @type {?} */
NgModuleTransitiveScopes.prototype.compilation;
/** @type {?} */
NgModuleTransitiveScopes.prototype.exported;
/** @typedef {?} */
var NgModuleDefInternal;
export { NgModuleDefInternal };
/**
 * Runtime link information for NgModules.
 *
 * This is the internal data structure used by the runtime to assemble components, directives,
 * pipes, and injectors.
 *
 * NOTE: Always use `defineNgModule` function to create this object,
 * never create the object directly since the shape of this object
 * can change between versions.
 * @record
 * @template T, Declarations, Imports, Exports
 */
export function NgModuleDef() { }
/**
 * Token representing the module. Used by DI.
 * @type {?}
 */
NgModuleDef.prototype.type;
/**
 * List of components to bootstrap.
 * @type {?}
 */
NgModuleDef.prototype.bootstrap;
/**
 * List of components, directives, and pipes declared by this module.
 * @type {?}
 */
NgModuleDef.prototype.declarations;
/**
 * List of modules or `ModuleWithProviders` imported by this module.
 * @type {?}
 */
NgModuleDef.prototype.imports;
/**
 * List of modules, `ModuleWithProviders`, components, directives, or pipes exported by this
 * module.
 * @type {?}
 */
NgModuleDef.prototype.exports;
/**
 * Cached value of computed `transitiveCompileScopes` for this module.
 *
 * This should never be read directly, but accessed via `transitiveScopesFor`.
 * @type {?}
 */
NgModuleDef.prototype.transitiveCompileScopes;
/**
 * A wrapper around an NgModule that associates it with the providers.
 *
 * @param T the module type. In Ivy applications, this must be explicitly
 * provided.
 * @record
 * @template T
 */
export function ModuleWithProviders() { }
/** @type {?} */
ModuleWithProviders.prototype.ngModule;
/** @type {?|undefined} */
ModuleWithProviders.prototype.providers;
/**
 * A schema definition associated with an NgModule.
 *
 * @see `\@NgModule`, `CUSTOM_ELEMENTS_SCHEMA`, `NO_ERRORS_SCHEMA`
 *
 * @param name The name of a defined schema.
 *
 * \@experimental
 * @record
 */
export function SchemaMetadata() { }
/** @type {?} */
SchemaMetadata.prototype.name;
/** *
 * Defines a schema that allows an NgModule to contain the following:
 * - Non-Angular elements named with dash case (`-`).
 * - Element properties named with dash case (`-`).
 * Dash case is the naming convention for custom elements.
 *
 *
  @type {?} */
export const CUSTOM_ELEMENTS_SCHEMA = {
    name: 'custom-elements'
};
/** *
 * Defines a schema that allows any property on any element.
 *
 * \@experimental
  @type {?} */
export const NO_ERRORS_SCHEMA = {
    name: 'no-errors-schema'
};
/**
 * Type of the NgModule decorator / constructor function.
 *
 *
 * @record
 */
export function NgModuleDecorator() { }
/**
 * @param {?} moduleType
 * @param {?} metadata
 * @return {?}
 */
function preR3NgModuleCompile(moduleType, metadata) {
    /** @type {?} */
    let imports = (metadata && metadata.imports) || [];
    if (metadata && metadata.exports) {
        imports = [...imports, metadata.exports];
    }
    moduleType.ngInjectorDef = defineInjector({
        factory: convertInjectableProviderToFactory(moduleType, { useClass: moduleType }),
        providers: metadata && metadata.providers,
        imports: imports,
    });
}
/** *
 * \@Annotation
  @type {?} */
export const NgModule = makeDecorator('NgModule', (ngModule) => ngModule, undefined, undefined, /**
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
(type, meta) => (R3_COMPILE_NGMODULE || preR3NgModuleCompile)(type, meta));
//# sourceMappingURL=ng_module.js.map