"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("./component");
exports.LifecycleHooksFeature = component_1.LifecycleHooksFeature;
exports.getHostElement = component_1.getHostElement;
exports.getRenderedText = component_1.getRenderedText;
exports.renderComponent = component_1.renderComponent;
exports.whenRendered = component_1.whenRendered;
var definition_1 = require("./definition");
exports.defineComponent = definition_1.defineComponent;
exports.defineDirective = definition_1.defineDirective;
exports.defineNgModule = definition_1.defineNgModule;
exports.definePipe = definition_1.definePipe;
var inherit_definition_feature_1 = require("./features/inherit_definition_feature");
exports.InheritDefinitionFeature = inherit_definition_feature_1.InheritDefinitionFeature;
var ng_onchanges_feature_1 = require("./features/ng_onchanges_feature");
exports.NgOnChangesFeature = ng_onchanges_feature_1.NgOnChangesFeature;
var public_feature_1 = require("./features/public_feature");
exports.PublicFeature = public_feature_1.PublicFeature;
var component_ref_1 = require("./component_ref");
exports.ComponentFactory = component_ref_1.ComponentFactory;
exports.ComponentFactoryResolver = component_ref_1.ComponentFactoryResolver;
exports.ComponentRef = component_ref_1.ComponentRef;
var di_1 = require("./di");
exports.QUERY_READ_CONTAINER_REF = di_1.QUERY_READ_CONTAINER_REF;
exports.QUERY_READ_ELEMENT_REF = di_1.QUERY_READ_ELEMENT_REF;
exports.QUERY_READ_FROM_NODE = di_1.QUERY_READ_FROM_NODE;
exports.QUERY_READ_TEMPLATE_REF = di_1.QUERY_READ_TEMPLATE_REF;
exports.directiveInject = di_1.directiveInject;
exports.injectAttribute = di_1.injectAttribute;
exports.injectChangeDetectorRef = di_1.injectChangeDetectorRef;
exports.injectComponentFactoryResolver = di_1.injectComponentFactoryResolver;
exports.injectElementRef = di_1.injectElementRef;
exports.injectTemplateRef = di_1.injectTemplateRef;
exports.injectViewContainerRef = di_1.injectViewContainerRef;
// Naming scheme:
// - Capital letters are for creating things: T(Text), E(Element), D(Directive), V(View),
// C(Container), L(Listener)
// - lower case letters are for binding: b(bind)
// - lower case letters are for binding target: p(property), a(attribute), k(class), s(style),
// i(input)
// - lower case letters for guarding life cycle hooks: l(lifeCycle)
// - lower case for closing: c(containerEnd), e(elementEnd), v(viewEnd)
// clang-format off
var instructions_1 = require("./instructions");
exports.NC = instructions_1.NO_CHANGE;
exports.b = instructions_1.bind;
exports.i1 = instructions_1.interpolation1;
exports.i2 = instructions_1.interpolation2;
exports.i3 = instructions_1.interpolation3;
exports.i4 = instructions_1.interpolation4;
exports.i5 = instructions_1.interpolation5;
exports.i6 = instructions_1.interpolation6;
exports.i7 = instructions_1.interpolation7;
exports.i8 = instructions_1.interpolation8;
exports.iV = instructions_1.interpolationV;
exports.C = instructions_1.container;
exports.cR = instructions_1.containerRefreshStart;
exports.cr = instructions_1.containerRefreshEnd;
exports.Ee = instructions_1.element;
exports.a = instructions_1.elementAttribute;
exports.cp = instructions_1.elementClassProp;
exports.e = instructions_1.elementEnd;
exports.p = instructions_1.elementProperty;
exports.E = instructions_1.elementStart;
exports.s = instructions_1.elementStyling;
exports.sm = instructions_1.elementStylingMap;
exports.sp = instructions_1.elementStyleProp;
exports.sa = instructions_1.elementStylingApply;
exports.L = instructions_1.listener;
exports.st = instructions_1.store;
exports.ld = instructions_1.load;
exports.d = instructions_1.loadDirective;
exports.NH = instructions_1.namespaceHTML;
exports.NM = instructions_1.namespaceMathML;
exports.NS = instructions_1.namespaceSVG;
exports.P = instructions_1.projection;
exports.pD = instructions_1.projectionDef;
exports.T = instructions_1.text;
exports.t = instructions_1.textBinding;
exports.rS = instructions_1.reserveSlots;
exports.V = instructions_1.embeddedViewStart;
exports.v = instructions_1.embeddedViewEnd;
exports.detectChanges = instructions_1.detectChanges;
exports.markDirty = instructions_1.markDirty;
exports.tick = instructions_1.tick;
var i18n_1 = require("./i18n");
exports.iA = i18n_1.i18nApply;
exports.iM = i18n_1.i18nMapping;
exports.iI1 = i18n_1.i18nInterpolation1;
exports.iI2 = i18n_1.i18nInterpolation2;
exports.iI3 = i18n_1.i18nInterpolation3;
exports.iI4 = i18n_1.i18nInterpolation4;
exports.iI5 = i18n_1.i18nInterpolation5;
exports.iI6 = i18n_1.i18nInterpolation6;
exports.iI7 = i18n_1.i18nInterpolation7;
exports.iI8 = i18n_1.i18nInterpolation8;
exports.iIV = i18n_1.i18nInterpolationV;
exports.iEM = i18n_1.i18nExpMapping;
var ng_module_ref_1 = require("./ng_module_ref");
exports.NgModuleFactory = ng_module_ref_1.NgModuleFactory;
exports.NgModuleRef = ng_module_ref_1.NgModuleRef;
var pipe_1 = require("./pipe");
exports.Pp = pipe_1.pipe;
exports.pb1 = pipe_1.pipeBind1;
exports.pb2 = pipe_1.pipeBind2;
exports.pb3 = pipe_1.pipeBind3;
exports.pb4 = pipe_1.pipeBind4;
exports.pbV = pipe_1.pipeBindV;
var query_1 = require("./query");
exports.QueryList = query_1.QueryList;
exports.Q = query_1.query;
exports.qR = query_1.queryRefresh;
var instructions_2 = require("./instructions");
exports.Qr = instructions_2.registerContentQuery;
exports.ql = instructions_2.loadQueryList;
var pure_function_1 = require("./pure_function");
exports.f0 = pure_function_1.pureFunction0;
exports.f1 = pure_function_1.pureFunction1;
exports.f2 = pure_function_1.pureFunction2;
exports.f3 = pure_function_1.pureFunction3;
exports.f4 = pure_function_1.pureFunction4;
exports.f5 = pure_function_1.pureFunction5;
exports.f6 = pure_function_1.pureFunction6;
exports.f7 = pure_function_1.pureFunction7;
exports.f8 = pure_function_1.pureFunction8;
exports.fV = pure_function_1.pureFunctionV;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgseUNBQWtIO0FBc0poSCxnQ0F0Sk0saUNBQXFCLENBc0pOO0FBS3JCLHlCQTNKNkIsMEJBQWMsQ0EySjdCO0FBQ2QsMEJBNUo2QywyQkFBZSxDQTRKN0M7QUFDZiwwQkE3SjhELDJCQUFlLENBNko5RDtBQUNmLHVCQTlKK0Usd0JBQVksQ0E4Si9FO0FBN0pkLDJDQUEwRjtBQXNKeEYsMEJBdEpNLDRCQUFlLENBc0pOO0FBQ2YsMEJBdkp1Qiw0QkFBZSxDQXVKdkI7QUFDZix5QkF4SndDLDJCQUFjLENBd0p4QztBQUNkLHFCQXpKd0QsdUJBQVUsQ0F5SnhEO0FBeEpaLG9GQUErRTtBQWlKN0UsbUNBakpNLHFEQUF3QixDQWlKTjtBQWhKMUIsd0VBQW1FO0FBK0lqRSw2QkEvSU0seUNBQWtCLENBK0lOO0FBOUlwQiw0REFBd0Q7QUFnSnRELHdCQWhKTSw4QkFBYSxDQWdKTjtBQTVJZixpREFBeUY7QUFBakYsMkNBQUEsZ0JBQWdCLENBQUE7QUFBRSxtREFBQSx3QkFBd0IsQ0FBQTtBQUFFLHVDQUFBLFlBQVksQ0FBQTtBQUNoRSwyQkFBNlE7QUFBclEsd0NBQUEsd0JBQXdCLENBQUE7QUFBRSxzQ0FBQSxzQkFBc0IsQ0FBQTtBQUFFLG9DQUFBLG9CQUFvQixDQUFBO0FBQUUsdUNBQUEsdUJBQXVCLENBQUE7QUFBRSwrQkFBQSxlQUFlLENBQUE7QUFBRSwrQkFBQSxlQUFlLENBQUE7QUFBRSx1Q0FBQSx1QkFBdUIsQ0FBQTtBQUFFLDhDQUFBLDhCQUE4QixDQUFBO0FBQUUsZ0NBQUEsZ0JBQWdCLENBQUE7QUFBRSxpQ0FBQSxpQkFBaUIsQ0FBQTtBQUFFLHNDQUFBLHNCQUFzQixDQUFBO0FBTS9QLGlCQUFpQjtBQUNqQix5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