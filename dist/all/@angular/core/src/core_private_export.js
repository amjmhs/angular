"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var application_ref_1 = require("./application_ref");
exports.ɵALLOW_MULTIPLE_PLATFORMS = application_ref_1.ALLOW_MULTIPLE_PLATFORMS;
var application_tokens_1 = require("./application_tokens");
exports.ɵAPP_ID_RANDOM_PROVIDER = application_tokens_1.APP_ID_RANDOM_PROVIDER;
var change_detection_1 = require("./change_detection/change_detection");
exports.ɵdefaultIterableDiffers = change_detection_1.defaultIterableDiffers;
exports.ɵdefaultKeyValueDiffers = change_detection_1.defaultKeyValueDiffers;
var change_detection_util_1 = require("./change_detection/change_detection_util");
exports.ɵdevModeEqual = change_detection_util_1.devModeEqual;
var change_detection_util_2 = require("./change_detection/change_detection_util");
exports.ɵisListLikeIterable = change_detection_util_2.isListLikeIterable;
var constants_1 = require("./change_detection/constants");
exports.ɵChangeDetectorStatus = constants_1.ChangeDetectorStatus;
exports.ɵisDefaultChangeDetectionStrategy = constants_1.isDefaultChangeDetectionStrategy;
var console_1 = require("./console");
exports.ɵConsole = console_1.Console;
var injector_1 = require("./di/injector");
exports.ɵinject = injector_1.inject;
exports.ɵsetCurrentInjector = injector_1.setCurrentInjector;
var scope_1 = require("./di/scope");
exports.ɵAPP_ROOT = scope_1.APP_ROOT;
var ivy_switch_1 = require("./ivy_switch");
exports.ɵivyEnabled = ivy_switch_1.ivyEnabled;
var component_factory_1 = require("./linker/component_factory");
exports.ɵComponentFactory = component_factory_1.ComponentFactory;
var component_factory_resolver_1 = require("./linker/component_factory_resolver");
exports.ɵCodegenComponentFactoryResolver = component_factory_resolver_1.CodegenComponentFactoryResolver;
var resource_loading_1 = require("./metadata/resource_loading");
exports.ɵresolveComponentResources = resource_loading_1.resolveComponentResources;
var reflection_capabilities_1 = require("./reflection/reflection_capabilities");
exports.ɵReflectionCapabilities = reflection_capabilities_1.ReflectionCapabilities;
var api_1 = require("./render/api");
exports.ɵRenderDebugInfo = api_1.RenderDebugInfo;
var html_sanitizer_1 = require("./sanitization/html_sanitizer");
exports.ɵ_sanitizeHtml = html_sanitizer_1._sanitizeHtml;
var style_sanitizer_1 = require("./sanitization/style_sanitizer");
exports.ɵ_sanitizeStyle = style_sanitizer_1._sanitizeStyle;
var url_sanitizer_1 = require("./sanitization/url_sanitizer");
exports.ɵ_sanitizeUrl = url_sanitizer_1._sanitizeUrl;
var util_1 = require("./util");
exports.ɵglobal = util_1.global;
exports.ɵlooseIdentical = util_1.looseIdentical;
exports.ɵstringify = util_1.stringify;
var decorators_1 = require("./util/decorators");
exports.ɵmakeDecorator = decorators_1.makeDecorator;
var lang_1 = require("./util/lang");
exports.ɵisObservable = lang_1.isObservable;
exports.ɵisPromise = lang_1.isPromise;
var index_1 = require("./view/index");
exports.ɵclearOverrides = index_1.clearOverrides;
exports.ɵinitServicesIfNeeded = index_1.initServicesIfNeeded;
exports.ɵoverrideComponentView = index_1.overrideComponentView;
exports.ɵoverrideProvider = index_1.overrideProvider;
var provider_1 = require("./view/provider");
exports.ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR = provider_1.NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZV9wcml2YXRlX2V4cG9ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2NvcmVfcHJpdmF0ZV9leHBvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxxREFBd0Y7QUFBaEYsc0RBQUEsd0JBQXdCLENBQTZCO0FBQzdELDJEQUF1RjtBQUEvRSx1REFBQSxzQkFBc0IsQ0FBMkI7QUFDekQsd0VBQXlKO0FBQWpKLHFEQUFBLHNCQUFzQixDQUEyQjtBQUFFLHFEQUFBLHNCQUFzQixDQUEyQjtBQUM1RyxrRkFBdUY7QUFBL0UsZ0RBQUEsWUFBWSxDQUFpQjtBQUNyQyxrRkFBbUc7QUFBM0Ysc0RBQUEsa0JBQWtCLENBQXVCO0FBQ2pELDBEQUFrSztBQUExSiw0Q0FBQSxvQkFBb0IsQ0FBeUI7QUFBRSx3REFBQSxnQ0FBZ0MsQ0FBcUM7QUFDNUgscUNBQThDO0FBQXRDLDZCQUFBLE9BQU8sQ0FBWTtBQUUzQiwwQ0FBMkY7QUFBbkYsNkJBQUEsTUFBTSxDQUFXO0FBQUUseUNBQUEsa0JBQWtCLENBQXVCO0FBQ3BFLG9DQUFpRDtBQUF6Qyw0QkFBQSxRQUFRLENBQWE7QUFDN0IsMkNBQXVEO0FBQS9DLG1DQUFBLFVBQVUsQ0FBZTtBQUNqQyxnRUFBaUY7QUFBekUsZ0RBQUEsZ0JBQWdCLENBQXFCO0FBQzdDLGtGQUF3SDtBQUFoSCx3RUFBQSwrQkFBK0IsQ0FBb0M7QUFDM0UsZ0VBQW9HO0FBQTVGLHdEQUFBLHlCQUF5QixDQUE4QjtBQUMvRCxnRkFBdUc7QUFBL0YsNERBQUEsc0JBQXNCLENBQTJCO0FBRXpELG9DQUFvRztBQUF6RCxpQ0FBQSxlQUFlLENBQW9CO0FBQzlFLGdFQUE4RTtBQUF0RSwwQ0FBQSxhQUFhLENBQWtCO0FBQ3ZDLGtFQUFpRjtBQUF6RSw0Q0FBQSxjQUFjLENBQW1CO0FBQ3pDLDhEQUEyRTtBQUFuRSx3Q0FBQSxZQUFZLENBQWlCO0FBQ3JDLCtCQUFxRztBQUE3Rix5QkFBQSxNQUFNLENBQVc7QUFBRSxpQ0FBQSxjQUFjLENBQW1CO0FBQUUsNEJBQUEsU0FBUyxDQUFjO0FBQ3JGLGdEQUFrRTtBQUExRCxzQ0FBQSxhQUFhLENBQWtCO0FBQ3ZDLG9DQUFtRjtBQUEzRSwrQkFBQSxZQUFZLENBQWlCO0FBQUUsNEJBQUEsU0FBUyxDQUFjO0FBQzlELHNDQUFzTTtBQUE5TCxrQ0FBQSxjQUFjLENBQW1CO0FBQUUsd0NBQUEsb0JBQW9CLENBQXlCO0FBQUUseUNBQUEscUJBQXFCLENBQTBCO0FBQUUsb0NBQUEsZ0JBQWdCLENBQXFCO0FBQ2hMLDRDQUFnSDtBQUF4Ryw0REFBQSxxQ0FBcUMsQ0FBMEMifQ==