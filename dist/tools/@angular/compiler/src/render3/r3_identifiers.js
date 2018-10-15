"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var CORE = '@angular/core';
var Identifiers = /** @class */ (function () {
    function Identifiers() {
    }
    /* Methods */
    Identifiers.NEW_METHOD = 'factory';
    Identifiers.TRANSFORM_METHOD = 'transform';
    Identifiers.PATCH_DEPS = 'patchedDeps';
    /* Instructions */
    Identifiers.namespaceHTML = { name: 'ɵNH', moduleName: CORE };
    Identifiers.namespaceMathML = { name: 'ɵNM', moduleName: CORE };
    Identifiers.namespaceSVG = { name: 'ɵNS', moduleName: CORE };
    Identifiers.element = { name: 'ɵEe', moduleName: CORE };
    Identifiers.elementStart = { name: 'ɵE', moduleName: CORE };
    Identifiers.elementEnd = { name: 'ɵe', moduleName: CORE };
    Identifiers.elementProperty = { name: 'ɵp', moduleName: CORE };
    Identifiers.elementAttribute = { name: 'ɵa', moduleName: CORE };
    Identifiers.elementClassProp = { name: 'ɵcp', moduleName: CORE };
    Identifiers.elementStyling = { name: 'ɵs', moduleName: CORE };
    Identifiers.elementStylingMap = { name: 'ɵsm', moduleName: CORE };
    Identifiers.elementStyleProp = { name: 'ɵsp', moduleName: CORE };
    Identifiers.elementStylingApply = { name: 'ɵsa', moduleName: CORE };
    Identifiers.containerCreate = { name: 'ɵC', moduleName: CORE };
    Identifiers.text = { name: 'ɵT', moduleName: CORE };
    Identifiers.textBinding = { name: 'ɵt', moduleName: CORE };
    Identifiers.bind = { name: 'ɵb', moduleName: CORE };
    Identifiers.interpolation1 = { name: 'ɵi1', moduleName: CORE };
    Identifiers.interpolation2 = { name: 'ɵi2', moduleName: CORE };
    Identifiers.interpolation3 = { name: 'ɵi3', moduleName: CORE };
    Identifiers.interpolation4 = { name: 'ɵi4', moduleName: CORE };
    Identifiers.interpolation5 = { name: 'ɵi5', moduleName: CORE };
    Identifiers.interpolation6 = { name: 'ɵi6', moduleName: CORE };
    Identifiers.interpolation7 = { name: 'ɵi7', moduleName: CORE };
    Identifiers.interpolation8 = { name: 'ɵi8', moduleName: CORE };
    Identifiers.interpolationV = { name: 'ɵiV', moduleName: CORE };
    Identifiers.pureFunction0 = { name: 'ɵf0', moduleName: CORE };
    Identifiers.pureFunction1 = { name: 'ɵf1', moduleName: CORE };
    Identifiers.pureFunction2 = { name: 'ɵf2', moduleName: CORE };
    Identifiers.pureFunction3 = { name: 'ɵf3', moduleName: CORE };
    Identifiers.pureFunction4 = { name: 'ɵf4', moduleName: CORE };
    Identifiers.pureFunction5 = { name: 'ɵf5', moduleName: CORE };
    Identifiers.pureFunction6 = { name: 'ɵf6', moduleName: CORE };
    Identifiers.pureFunction7 = { name: 'ɵf7', moduleName: CORE };
    Identifiers.pureFunction8 = { name: 'ɵf8', moduleName: CORE };
    Identifiers.pureFunctionV = { name: 'ɵfV', moduleName: CORE };
    Identifiers.pipeBind1 = { name: 'ɵpb1', moduleName: CORE };
    Identifiers.pipeBind2 = { name: 'ɵpb2', moduleName: CORE };
    Identifiers.pipeBind3 = { name: 'ɵpb3', moduleName: CORE };
    Identifiers.pipeBind4 = { name: 'ɵpb4', moduleName: CORE };
    Identifiers.pipeBindV = { name: 'ɵpbV', moduleName: CORE };
    Identifiers.load = { name: 'ɵld', moduleName: CORE };
    Identifiers.loadDirective = { name: 'ɵd', moduleName: CORE };
    Identifiers.loadQueryList = { name: 'ɵql', moduleName: CORE };
    Identifiers.pipe = { name: 'ɵPp', moduleName: CORE };
    Identifiers.projection = { name: 'ɵP', moduleName: CORE };
    Identifiers.projectionDef = { name: 'ɵpD', moduleName: CORE };
    Identifiers.inject = { name: 'inject', moduleName: CORE };
    Identifiers.injectAttribute = { name: 'ɵinjectAttribute', moduleName: CORE };
    Identifiers.injectElementRef = { name: 'ɵinjectElementRef', moduleName: CORE };
    Identifiers.injectTemplateRef = { name: 'ɵinjectTemplateRef', moduleName: CORE };
    Identifiers.injectViewContainerRef = { name: 'ɵinjectViewContainerRef', moduleName: CORE };
    Identifiers.injectChangeDetectorRef = { name: 'ɵinjectChangeDetectorRef', moduleName: CORE };
    Identifiers.directiveInject = { name: 'ɵdirectiveInject', moduleName: CORE };
    Identifiers.defineComponent = { name: 'ɵdefineComponent', moduleName: CORE };
    Identifiers.ComponentDef = {
        name: 'ɵComponentDef',
        moduleName: CORE,
    };
    Identifiers.defineDirective = {
        name: 'ɵdefineDirective',
        moduleName: CORE,
    };
    Identifiers.DirectiveDef = {
        name: 'ɵDirectiveDef',
        moduleName: CORE,
    };
    Identifiers.InjectorDef = {
        name: 'ɵInjectorDef',
        moduleName: CORE,
    };
    Identifiers.defineInjector = {
        name: 'defineInjector',
        moduleName: CORE,
    };
    Identifiers.NgModuleDef = {
        name: 'ɵNgModuleDef',
        moduleName: CORE,
    };
    Identifiers.defineNgModule = { name: 'ɵdefineNgModule', moduleName: CORE };
    Identifiers.PipeDef = { name: 'ɵPipeDef', moduleName: CORE };
    Identifiers.definePipe = { name: 'ɵdefinePipe', moduleName: CORE };
    Identifiers.query = { name: 'ɵQ', moduleName: CORE };
    Identifiers.queryRefresh = { name: 'ɵqR', moduleName: CORE };
    Identifiers.registerContentQuery = { name: 'ɵQr', moduleName: CORE };
    Identifiers.NgOnChangesFeature = { name: 'ɵNgOnChangesFeature', moduleName: CORE };
    Identifiers.InheritDefinitionFeature = { name: 'ɵInheritDefinitionFeature', moduleName: CORE };
    Identifiers.listener = { name: 'ɵL', moduleName: CORE };
    // Reserve slots for pure functions
    Identifiers.reserveSlots = { name: 'ɵrS', moduleName: CORE };
    // sanitization-related functions
    Identifiers.sanitizeHtml = { name: 'ɵzh', moduleName: CORE };
    Identifiers.sanitizeStyle = { name: 'ɵzs', moduleName: CORE };
    Identifiers.defaultStyleSanitizer = { name: 'ɵzss', moduleName: CORE };
    Identifiers.sanitizeResourceUrl = { name: 'ɵzr', moduleName: CORE };
    Identifiers.sanitizeScript = { name: 'ɵzc', moduleName: CORE };
    Identifiers.sanitizeUrl = { name: 'ɵzu', moduleName: CORE };
    return Identifiers;
}());
exports.Identifiers = Identifiers;
//# sourceMappingURL=r3_identifiers.js.map