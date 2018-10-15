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
    Identifiers.ANALYZE_FOR_ENTRY_COMPONENTS = {
        name: 'ANALYZE_FOR_ENTRY_COMPONENTS',
        moduleName: CORE,
    };
    Identifiers.ElementRef = { name: 'ElementRef', moduleName: CORE };
    Identifiers.NgModuleRef = { name: 'NgModuleRef', moduleName: CORE };
    Identifiers.ViewContainerRef = { name: 'ViewContainerRef', moduleName: CORE };
    Identifiers.ChangeDetectorRef = {
        name: 'ChangeDetectorRef',
        moduleName: CORE,
    };
    Identifiers.QueryList = { name: 'QueryList', moduleName: CORE };
    Identifiers.TemplateRef = { name: 'TemplateRef', moduleName: CORE };
    Identifiers.CodegenComponentFactoryResolver = {
        name: 'ɵCodegenComponentFactoryResolver',
        moduleName: CORE,
    };
    Identifiers.ComponentFactoryResolver = {
        name: 'ComponentFactoryResolver',
        moduleName: CORE,
    };
    Identifiers.ComponentFactory = { name: 'ComponentFactory', moduleName: CORE };
    Identifiers.ComponentRef = { name: 'ComponentRef', moduleName: CORE };
    Identifiers.NgModuleFactory = { name: 'NgModuleFactory', moduleName: CORE };
    Identifiers.createModuleFactory = {
        name: 'ɵcmf',
        moduleName: CORE,
    };
    Identifiers.moduleDef = {
        name: 'ɵmod',
        moduleName: CORE,
    };
    Identifiers.moduleProviderDef = {
        name: 'ɵmpd',
        moduleName: CORE,
    };
    Identifiers.RegisterModuleFactoryFn = {
        name: 'ɵregisterModuleFactory',
        moduleName: CORE,
    };
    Identifiers.inject = { name: 'inject', moduleName: CORE };
    Identifiers.INJECTOR = { name: 'INJECTOR', moduleName: CORE };
    Identifiers.Injector = { name: 'Injector', moduleName: CORE };
    Identifiers.defineInjectable = { name: 'defineInjectable', moduleName: CORE };
    Identifiers.InjectableDef = { name: 'ɵInjectableDef', moduleName: CORE };
    Identifiers.ViewEncapsulation = {
        name: 'ViewEncapsulation',
        moduleName: CORE,
    };
    Identifiers.ChangeDetectionStrategy = {
        name: 'ChangeDetectionStrategy',
        moduleName: CORE,
    };
    Identifiers.SecurityContext = {
        name: 'SecurityContext',
        moduleName: CORE,
    };
    Identifiers.LOCALE_ID = { name: 'LOCALE_ID', moduleName: CORE };
    Identifiers.TRANSLATIONS_FORMAT = {
        name: 'TRANSLATIONS_FORMAT',
        moduleName: CORE,
    };
    Identifiers.inlineInterpolate = {
        name: 'ɵinlineInterpolate',
        moduleName: CORE,
    };
    Identifiers.interpolate = { name: 'ɵinterpolate', moduleName: CORE };
    Identifiers.EMPTY_ARRAY = { name: 'ɵEMPTY_ARRAY', moduleName: CORE };
    Identifiers.EMPTY_MAP = { name: 'ɵEMPTY_MAP', moduleName: CORE };
    Identifiers.Renderer = { name: 'Renderer', moduleName: CORE };
    Identifiers.viewDef = { name: 'ɵvid', moduleName: CORE };
    Identifiers.elementDef = { name: 'ɵeld', moduleName: CORE };
    Identifiers.anchorDef = { name: 'ɵand', moduleName: CORE };
    Identifiers.textDef = { name: 'ɵted', moduleName: CORE };
    Identifiers.directiveDef = { name: 'ɵdid', moduleName: CORE };
    Identifiers.providerDef = { name: 'ɵprd', moduleName: CORE };
    Identifiers.queryDef = { name: 'ɵqud', moduleName: CORE };
    Identifiers.pureArrayDef = { name: 'ɵpad', moduleName: CORE };
    Identifiers.pureObjectDef = { name: 'ɵpod', moduleName: CORE };
    Identifiers.purePipeDef = { name: 'ɵppd', moduleName: CORE };
    Identifiers.pipeDef = { name: 'ɵpid', moduleName: CORE };
    Identifiers.nodeValue = { name: 'ɵnov', moduleName: CORE };
    Identifiers.ngContentDef = { name: 'ɵncd', moduleName: CORE };
    Identifiers.unwrapValue = { name: 'ɵunv', moduleName: CORE };
    Identifiers.createRendererType2 = { name: 'ɵcrt', moduleName: CORE };
    // type only
    Identifiers.RendererType2 = {
        name: 'RendererType2',
        moduleName: CORE,
    };
    // type only
    Identifiers.ViewDefinition = {
        name: 'ɵViewDefinition',
        moduleName: CORE,
    };
    Identifiers.createComponentFactory = { name: 'ɵccf', moduleName: CORE };
    return Identifiers;
}());
exports.Identifiers = Identifiers;
function createTokenForReference(reference) {
    return { identifier: { reference: reference } };
}
exports.createTokenForReference = createTokenForReference;
function createTokenForExternalReference(reflector, reference) {
    return createTokenForReference(reflector.resolveExternalReference(reference));
}
exports.createTokenForExternalReference = createTokenForExternalReference;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlbnRpZmllcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvaWRlbnRpZmllcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFNSCxJQUFNLElBQUksR0FBRyxlQUFlLENBQUM7QUFFN0I7SUFBQTtJQThHQSxDQUFDO0lBN0dRLHdDQUE0QixHQUF3QjtRQUN6RCxJQUFJLEVBQUUsOEJBQThCO1FBQ3BDLFVBQVUsRUFBRSxJQUFJO0tBRWpCLENBQUM7SUFDSyxzQkFBVSxHQUF3QixFQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBQyxDQUFDO0lBQ3pFLHVCQUFXLEdBQXdCLEVBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFDLENBQUM7SUFDM0UsNEJBQWdCLEdBQXdCLEVBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUMsQ0FBQztJQUNyRiw2QkFBaUIsR0FBd0I7UUFDOUMsSUFBSSxFQUFFLG1CQUFtQjtRQUN6QixVQUFVLEVBQUUsSUFBSTtLQUVqQixDQUFDO0lBQ0sscUJBQVMsR0FBd0IsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUMsQ0FBQztJQUN2RSx1QkFBVyxHQUF3QixFQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBQyxDQUFDO0lBQzNFLDJDQUErQixHQUF3QjtRQUM1RCxJQUFJLEVBQUUsa0NBQWtDO1FBQ3hDLFVBQVUsRUFBRSxJQUFJO0tBRWpCLENBQUM7SUFDSyxvQ0FBd0IsR0FBd0I7UUFDckQsSUFBSSxFQUFFLDBCQUEwQjtRQUNoQyxVQUFVLEVBQUUsSUFBSTtLQUVqQixDQUFDO0lBQ0ssNEJBQWdCLEdBQXdCLEVBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFLFVBQVUsRUFB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