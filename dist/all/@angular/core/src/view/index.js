"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var element_1 = require("./element");
exports.anchorDef = element_1.anchorDef;
exports.elementDef = element_1.elementDef;
var entrypoint_1 = require("./entrypoint");
exports.clearOverrides = entrypoint_1.clearOverrides;
exports.createNgModuleFactory = entrypoint_1.createNgModuleFactory;
exports.overrideComponentView = entrypoint_1.overrideComponentView;
exports.overrideProvider = entrypoint_1.overrideProvider;
var ng_content_1 = require("./ng_content");
exports.ngContentDef = ng_content_1.ngContentDef;
var ng_module_1 = require("./ng_module");
exports.moduleDef = ng_module_1.moduleDef;
exports.moduleProvideDef = ng_module_1.moduleProvideDef;
var provider_1 = require("./provider");
exports.directiveDef = provider_1.directiveDef;
exports.pipeDef = provider_1.pipeDef;
exports.providerDef = provider_1.providerDef;
var pure_expression_1 = require("./pure_expression");
exports.pureArrayDef = pure_expression_1.pureArrayDef;
exports.pureObjectDef = pure_expression_1.pureObjectDef;
exports.purePipeDef = pure_expression_1.purePipeDef;
var query_1 = require("./query");
exports.queryDef = query_1.queryDef;
var refs_1 = require("./refs");
exports.ViewRef_ = refs_1.ViewRef_;
exports.createComponentFactory = refs_1.createComponentFactory;
exports.getComponentViewDefinitionFactory = refs_1.getComponentViewDefinitionFactory;
exports.nodeValue = refs_1.nodeValue;
var services_1 = require("./services");
exports.initServicesIfNeeded = services_1.initServicesIfNeeded;
var text_1 = require("./text");
exports.textDef = text_1.textDef;
var util_1 = require("./util");
exports.EMPTY_ARRAY = util_1.EMPTY_ARRAY;
exports.EMPTY_MAP = util_1.EMPTY_MAP;
exports.createRendererType2 = util_1.createRendererType2;
exports.elementEventFullName = util_1.elementEventFullName;
exports.inlineInterpolate = util_1.inlineInterpolate;
exports.interpolate = util_1.interpolate;
exports.rootRenderNodes = util_1.rootRenderNodes;
exports.tokenKey = util_1.tokenKey;
exports.unwrapValue = util_1.unwrapValue;
var view_1 = require("./view");
exports.viewDef = view_1.viewDef;
var view_attach_1 = require("./view_attach");
exports.attachEmbeddedView = view_attach_1.attachEmbeddedView;
exports.detachEmbeddedView = view_attach_1.detachEmbeddedView;
exports.moveEmbeddedView = view_attach_1.moveEmbeddedView;
__export(require("./types"));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy92aWV3L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7O0FBRUgscUNBQWdEO0FBQXhDLDhCQUFBLFNBQVMsQ0FBQTtBQUFFLCtCQUFBLFVBQVUsQ0FBQTtBQUM3QiwyQ0FBNEc7QUFBcEcsc0NBQUEsY0FBYyxDQUFBO0FBQUUsNkNBQUEscUJBQXFCLENBQUE7QUFBRSw2Q0FBQSxxQkFBcUIsQ0FBQTtBQUFFLHdDQUFBLGdCQUFnQixDQUFBO0FBQ3RGLDJDQUEwQztBQUFsQyxvQ0FBQSxZQUFZLENBQUE7QUFDcEIseUNBQXdEO0FBQWhELGdDQUFBLFNBQVMsQ0FBQTtBQUFFLHVDQUFBLGdCQUFnQixDQUFBO0FBQ25DLHVDQUE4RDtBQUF0RCxrQ0FBQSxZQUFZLENBQUE7QUFBRSw2QkFBQSxPQUFPLENBQUE7QUFBRSxpQ0FBQSxXQUFXLENBQUE7QUFDMUMscURBQTJFO0FBQW5FLHlDQUFBLFlBQVksQ0FBQTtBQUFFLDBDQUFBLGFBQWEsQ0FBQTtBQUFFLHdDQUFBLFdBQVcsQ0FBQTtBQUNoRCxpQ0FBaUM7QUFBekIsMkJBQUEsUUFBUSxDQUFBO0FBQ2hCLCtCQUFzRztBQUE5RiwwQkFBQSxRQUFRLENBQUE7QUFBRSx3Q0FBQSxzQkFBc0IsQ0FBQTtBQUFFLG1EQUFBLGlDQUFpQyxDQUFBO0FBQUUsMkJBQUEsU0FBUyxDQUFBO0FBQ3RGLHVDQUFnRDtBQUF4QywwQ0FBQSxvQkFBb0IsQ0FBQTtBQUM1QiwrQkFBK0I7QUFBdkIseUJBQUEsT0FBTyxDQUFBO0FBQ2YsK0JBQWlLO0FBQXpKLDZCQUFBLFdBQVcsQ0FBQTtBQUFFLDJCQUFBLFNBQVMsQ0FBQTtBQUFFLHFDQUFBLG1CQUFtQixDQUFBO0FBQUUsc0NBQUEsb0JBQW9CLENBQUE7QUFBRSxtQ0FBQSxpQkFBaUIsQ0FBQTtBQUFFLDZCQUFBLFdBQVcsQ0FBQTtBQUFFLGlDQUFBLGVBQWUsQ0FBQTtBQUFFLDBCQUFBLFFBQVEsQ0FBQTtBQUFFLDZCQUFBLFdBQVcsQ0FBQTtBQUNqSiwrQkFBK0I7QUFBdkIseUJBQUEsT0FBTyxDQUFBO0FBQ2YsNkNBQXVGO0FBQS9FLDJDQUFBLGtCQUFrQixDQUFBO0FBQUUsMkNBQUEsa0JBQWtCLENBQUE7QUFBRSx5Q0FBQSxnQkFBZ0IsQ0FBQTtBQUVoRSw2QkFBd0IifQ==