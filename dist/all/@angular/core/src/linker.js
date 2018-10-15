"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Public API for compiler
var compiler_1 = require("./linker/compiler");
exports.COMPILER_OPTIONS = compiler_1.COMPILER_OPTIONS;
exports.Compiler = compiler_1.Compiler;
exports.CompilerFactory = compiler_1.CompilerFactory;
exports.ModuleWithComponentFactories = compiler_1.ModuleWithComponentFactories;
var component_factory_1 = require("./linker/component_factory");
exports.ComponentFactory = component_factory_1.ComponentFactory;
exports.ComponentRef = component_factory_1.ComponentRef;
var component_factory_resolver_1 = require("./linker/component_factory_resolver");
exports.ComponentFactoryResolver = component_factory_resolver_1.ComponentFactoryResolver;
var element_ref_1 = require("./linker/element_ref");
exports.ElementRef = element_ref_1.ElementRef;
var ng_module_factory_1 = require("./linker/ng_module_factory");
exports.NgModuleFactory = ng_module_factory_1.NgModuleFactory;
exports.NgModuleRef = ng_module_factory_1.NgModuleRef;
var ng_module_factory_loader_1 = require("./linker/ng_module_factory_loader");
exports.NgModuleFactoryLoader = ng_module_factory_loader_1.NgModuleFactoryLoader;
exports.getModuleFactory = ng_module_factory_loader_1.getModuleFactory;
var query_list_1 = require("./linker/query_list");
exports.QueryList = query_list_1.QueryList;
var system_js_ng_module_factory_loader_1 = require("./linker/system_js_ng_module_factory_loader");
exports.SystemJsNgModuleLoader = system_js_ng_module_factory_loader_1.SystemJsNgModuleLoader;
exports.SystemJsNgModuleLoaderConfig = system_js_ng_module_factory_loader_1.SystemJsNgModuleLoaderConfig;
var template_ref_1 = require("./linker/template_ref");
exports.TemplateRef = template_ref_1.TemplateRef;
var view_container_ref_1 = require("./linker/view_container_ref");
exports.ViewContainerRef = view_container_ref_1.ViewContainerRef;
var view_ref_1 = require("./linker/view_ref");
exports.EmbeddedViewRef = view_ref_1.EmbeddedViewRef;
exports.ViewRef = view_ref_1.ViewRef;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlua2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvbGlua2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMEJBQTBCO0FBQzFCLDhDQUE2SDtBQUFySCxzQ0FBQSxnQkFBZ0IsQ0FBQTtBQUFFLDhCQUFBLFFBQVEsQ0FBQTtBQUFFLHFDQUFBLGVBQWUsQ0FBQTtBQUFtQixrREFBQSw0QkFBNEIsQ0FBQTtBQUNsRyxnRUFBMEU7QUFBbEUsK0NBQUEsZ0JBQWdCLENBQUE7QUFBRSwyQ0FBQSxZQUFZLENBQUE7QUFDdEMsa0ZBQTZFO0FBQXJFLGdFQUFBLHdCQUF3QixDQUFBO0FBQ2hDLG9EQUFnRDtBQUF4QyxtQ0FBQSxVQUFVLENBQUE7QUFDbEIsZ0VBQXdFO0FBQWhFLDhDQUFBLGVBQWUsQ0FBQTtBQUFFLDBDQUFBLFdBQVcsQ0FBQTtBQUNwQyw4RUFBMEY7QUFBbEYsMkRBQUEscUJBQXFCLENBQUE7QUFBRSxzREFBQSxnQkFBZ0IsQ0FBQTtBQUMvQyxrREFBOEM7QUFBdEMsaUNBQUEsU0FBUyxDQUFBO0FBQ2pCLGtHQUFpSDtBQUF6RyxzRUFBQSxzQkFBc0IsQ0FBQTtBQUFFLDRFQUFBLDRCQUE0QixDQUFBO0FBQzVELHNEQUFrRDtBQUExQyxxQ0FBQSxXQUFXLENBQUE7QUFDbkIsa0VBQTZEO0FBQXJELGdEQUFBLGdCQUFnQixDQUFBO0FBQ3hCLDhDQUEyRDtBQUFuRCxxQ0FBQSxlQUFlLENBQUE7QUFBRSw2QkFBQSxPQUFPLENBQUEifQ==