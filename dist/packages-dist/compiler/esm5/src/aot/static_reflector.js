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
import * as tslib_1 from "tslib";
import { CompileSummaryKind } from '../compile_metadata';
import { createAttribute, createComponent, createContentChild, createContentChildren, createDirective, createHost, createHostBinding, createHostListener, createInject, createInjectable, createInput, createNgModule, createOptional, createOutput, createPipe, createSelf, createSkipSelf, createViewChild, createViewChildren } from '../core';
import { syntaxError } from '../util';
import { formattedError } from './formatted_error';
import { StaticSymbol } from './static_symbol';
/** @type {?} */
var ANGULAR_CORE = '@angular/core';
/** @type {?} */
var ANGULAR_ROUTER = '@angular/router';
/** @type {?} */
var HIDDEN_KEY = /^\$.*\$$/;
/** @type {?} */
var IGNORE = {
    __symbolic: 'ignore'
};
/** @type {?} */
var USE_VALUE = 'useValue';
/** @type {?} */
var PROVIDE = 'provide';
/** @type {?} */
var REFERENCE_SET = new Set([USE_VALUE, 'useFactory', 'data', 'id', 'loadChildren']);
/** @type {?} */
var TYPEGUARD_POSTFIX = 'TypeGuard';
/** @type {?} */
var USE_IF = 'UseIf';
/**
 * @param {?} value
 * @return {?}
 */
function shouldIgnore(value) {
    return value && value.__symbolic == 'ignore';
}
/**
 * A static reflector implements enough of the Reflector API that is necessary to compile
 * templates statically.
 */
var /**
 * A static reflector implements enough of the Reflector API that is necessary to compile
 * templates statically.
 */
StaticReflector = /** @class */ (function () {
    function StaticReflector(summaryResolver, symbolResolver, knownMetadataClasses, knownMetadataFunctions, errorRecorder) {
        if (knownMetadataClasses === void 0) { knownMetadataClasses = []; }
        if (knownMetadataFunctions === void 0) { knownMetadataFunctions = []; }
        var _this = this;
        this.summaryResolver = summaryResolver;
        this.symbolResolver = symbolResolver;
        this.errorRecorder = errorRecorder;
        this.annotationCache = new Map();
        this.shallowAnnotationCache = new Map();
        this.propertyCache = new Map();
        this.parameterCache = new Map();
        this.methodCache = new Map();
        this.staticCache = new Map();
        this.conversionMap = new Map();
        this.resolvedExternalReferences = new Map();
        this.annotationForParentClassWithSummaryKind = new Map();
        this.initializeConversionMap();
        knownMetadataClasses.forEach(function (kc) { return _this._registerDecoratorOrConstructor(_this.getStaticSymbol(kc.filePath, kc.name), kc.ctor); });
        knownMetadataFunctions.forEach(function (kf) { return _this._registerFunction(_this.getStaticSymbol(kf.filePath, kf.name), kf.fn); });
        this.annotationForParentClassWithSummaryKind.set(CompileSummaryKind.Directive, [createDirective, createComponent]);
        this.annotationForParentClassWithSummaryKind.set(CompileSummaryKind.Pipe, [createPipe]);
        this.annotationForParentClassWithSummaryKind.set(CompileSummaryKind.NgModule, [createNgModule]);
        this.annotationForParentClassWithSummaryKind.set(CompileSummaryKind.Injectable, [createInjectable, createPipe, createDirective, createComponent, createNgModule]);
    }
    /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    StaticReflector.prototype.componentModuleUrl = /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    function (typeOrFunc) {
        /** @type {?} */
        var staticSymbol = this.findSymbolDeclaration(typeOrFunc);
        return this.symbolResolver.getResourcePath(staticSymbol);
    };
    /**
     * @param {?} ref
     * @param {?=} containingFile
     * @return {?}
     */
    StaticReflector.prototype.resolveExternalReference = /**
     * @param {?} ref
     * @param {?=} containingFile
     * @return {?}
     */
    function (ref, containingFile) {
        /** @type {?} */
        var key = undefined;
        if (!containingFile) {
            key = ref.moduleName + ":" + ref.name;
            /** @type {?} */
            var declarationSymbol_1 = this.resolvedExternalReferences.get(key);
            if (declarationSymbol_1)
                return declarationSymbol_1;
        }
        /** @type {?} */
        var refSymbol = this.symbolResolver.getSymbolByModule(/** @type {?} */ ((ref.moduleName)), /** @type {?} */ ((ref.name)), containingFile);
        /** @type {?} */
        var declarationSymbol = this.findSymbolDeclaration(refSymbol);
        if (!containingFile) {
            this.symbolResolver.recordModuleNameForFileName(refSymbol.filePath, /** @type {?} */ ((ref.moduleName)));
            this.symbolResolver.recordImportAs(declarationSymbol, refSymbol);
        }
        if (key) {
            this.resolvedExternalReferences.set(key, declarationSymbol);
        }
        return declarationSymbol;
    };
    /**
     * @param {?} moduleUrl
     * @param {?} name
     * @param {?=} containingFile
     * @return {?}
     */
    StaticReflector.prototype.findDeclaration = /**
     * @param {?} moduleUrl
     * @param {?} name
     * @param {?=} containingFile
     * @return {?}
     */
    function (moduleUrl, name, containingFile) {
        return this.findSymbolDeclaration(this.symbolResolver.getSymbolByModule(moduleUrl, name, containingFile));
    };
    /**
     * @param {?} moduleUrl
     * @param {?} name
     * @param {?=} containingFile
     * @return {?}
     */
    StaticReflector.prototype.tryFindDeclaration = /**
     * @param {?} moduleUrl
     * @param {?} name
     * @param {?=} containingFile
     * @return {?}
     */
    function (moduleUrl, name, containingFile) {
        var _this = this;
        return this.symbolResolver.ignoreErrorsFor(function () { return _this.findDeclaration(moduleUrl, name, containingFile); });
    };
    /**
     * @param {?} symbol
     * @return {?}
     */
    StaticReflector.prototype.findSymbolDeclaration = /**
     * @param {?} symbol
     * @return {?}
     */
    function (symbol) {
        /** @type {?} */
        var resolvedSymbol = this.symbolResolver.resolveSymbol(symbol);
        if (resolvedSymbol) {
            /** @type {?} */
            var resolvedMetadata = resolvedSymbol.metadata;
            if (resolvedMetadata && resolvedMetadata.__symbolic === 'resolved') {
                resolvedMetadata = resolvedMetadata.symbol;
            }
            if (resolvedMetadata instanceof StaticSymbol) {
                return this.findSymbolDeclaration(resolvedSymbol.metadata);
            }
        }
        return symbol;
    };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticReflector.prototype.tryAnnotations = /**
     * @param {?} type
     * @return {?}
     */
    function (type) {
        /** @type {?} */
        var originalRecorder = this.errorRecorder;
        this.errorRecorder = function (error, fileName) { };
        try {
            return this.annotations(type);
        }
        finally {
            this.errorRecorder = originalRecorder;
        }
    };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticReflector.prototype.annotations = /**
     * @param {?} type
     * @return {?}
     */
    function (type) {
        var _this = this;
        return this._annotations(type, function (type, decorators) { return _this.simplify(type, decorators); }, this.annotationCache);
    };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticReflector.prototype.shallowAnnotations = /**
     * @param {?} type
     * @return {?}
     */
    function (type) {
        var _this = this;
        return this._annotations(type, function (type, decorators) { return _this.simplify(type, decorators, true); }, this.shallowAnnotationCache);
    };
    /**
     * @param {?} type
     * @param {?} simplify
     * @param {?} annotationCache
     * @return {?}
     */
    StaticReflector.prototype._annotations = /**
     * @param {?} type
     * @param {?} simplify
     * @param {?} annotationCache
     * @return {?}
     */
    function (type, simplify, annotationCache) {
        /** @type {?} */
        var annotations = annotationCache.get(type);
        if (!annotations) {
            annotations = [];
            /** @type {?} */
            var classMetadata = this.getTypeMetadata(type);
            /** @type {?} */
            var parentType = this.findParentType(type, classMetadata);
            if (parentType) {
                /** @type {?} */
                var parentAnnotations = this.annotations(parentType);
                annotations.push.apply(annotations, parentAnnotations);
            }
            /** @type {?} */
            var ownAnnotations_1 = [];
            if (classMetadata['decorators']) {
                ownAnnotations_1 = simplify(type, classMetadata['decorators']);
                if (ownAnnotations_1) {
                    annotations.push.apply(annotations, ownAnnotations_1);
                }
            }
            if (parentType && !this.summaryResolver.isLibraryFile(type.filePath) &&
                this.summaryResolver.isLibraryFile(parentType.filePath)) {
                /** @type {?} */
                var summary = this.summaryResolver.resolveSummary(parentType);
                if (summary && summary.type) {
                    /** @type {?} */
                    var requiredAnnotationTypes = /** @type {?} */ ((this.annotationForParentClassWithSummaryKind.get(/** @type {?} */ ((summary.type.summaryKind)))));
                    /** @type {?} */
                    var typeHasRequiredAnnotation = requiredAnnotationTypes.some(function (requiredType) { return ownAnnotations_1.some(function (ann) { return requiredType.isTypeOf(ann); }); });
                    if (!typeHasRequiredAnnotation) {
                        this.reportError(formatMetadataError(metadataError("Class " + type.name + " in " + type.filePath + " extends from a " + CompileSummaryKind[(/** @type {?} */ ((summary.type.summaryKind)))] + " in another compilation unit without duplicating the decorator", undefined, "Please add a " + requiredAnnotationTypes.map(function (type) { return type.ngMetadataName; }).join(' or ') + " decorator to the class"), type), type);
                    }
                }
            }
            annotationCache.set(type, annotations.filter(function (ann) { return !!ann; }));
        }
        return annotations;
    };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticReflector.prototype.propMetadata = /**
     * @param {?} type
     * @return {?}
     */
    function (type) {
        var _this = this;
        /** @type {?} */
        var propMetadata = this.propertyCache.get(type);
        if (!propMetadata) {
            /** @type {?} */
            var classMetadata = this.getTypeMetadata(type);
            propMetadata = {};
            /** @type {?} */
            var parentType = this.findParentType(type, classMetadata);
            if (parentType) {
                /** @type {?} */
                var parentPropMetadata_1 = this.propMetadata(parentType);
                Object.keys(parentPropMetadata_1).forEach(function (parentProp) {
                    /** @type {?} */ ((propMetadata))[parentProp] = parentPropMetadata_1[parentProp];
                });
            }
            /** @type {?} */
            var members_1 = classMetadata['members'] || {};
            Object.keys(members_1).forEach(function (propName) {
                /** @type {?} */
                var propData = members_1[propName];
                /** @type {?} */
                var prop = (/** @type {?} */ (propData))
                    .find(function (a) { return a['__symbolic'] == 'property' || a['__symbolic'] == 'method'; });
                /** @type {?} */
                var decorators = [];
                if (/** @type {?} */ ((propMetadata))[propName]) {
                    decorators.push.apply(decorators, /** @type {?} */ ((propMetadata))[propName]);
                } /** @type {?} */
                ((propMetadata))[propName] = decorators;
                if (prop && prop['decorators']) {
                    decorators.push.apply(decorators, _this.simplify(type, prop['decorators']));
                }
            });
            this.propertyCache.set(type, propMetadata);
        }
        return propMetadata;
    };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticReflector.prototype.parameters = /**
     * @param {?} type
     * @return {?}
     */
    function (type) {
        var _this = this;
        if (!(type instanceof StaticSymbol)) {
            this.reportError(new Error("parameters received " + JSON.stringify(type) + " which is not a StaticSymbol"), type);
            return [];
        }
        try {
            /** @type {?} */
            var parameters_1 = this.parameterCache.get(type);
            if (!parameters_1) {
                /** @type {?} */
                var classMetadata = this.getTypeMetadata(type);
                /** @type {?} */
                var parentType = this.findParentType(type, classMetadata);
                /** @type {?} */
                var members = classMetadata ? classMetadata['members'] : null;
                /** @type {?} */
                var ctorData = members ? members['__ctor__'] : null;
                if (ctorData) {
                    /** @type {?} */
                    var ctor = (/** @type {?} */ (ctorData)).find(function (a) { return a['__symbolic'] == 'constructor'; });
                    /** @type {?} */
                    var rawParameterTypes = /** @type {?} */ (ctor['parameters']) || [];
                    /** @type {?} */
                    var parameterDecorators_1 = /** @type {?} */ (this.simplify(type, ctor['parameterDecorators'] || []));
                    parameters_1 = [];
                    rawParameterTypes.forEach(function (rawParamType, index) {
                        /** @type {?} */
                        var nestedResult = [];
                        /** @type {?} */
                        var paramType = _this.trySimplify(type, rawParamType);
                        if (paramType)
                            nestedResult.push(paramType);
                        /** @type {?} */
                        var decorators = parameterDecorators_1 ? parameterDecorators_1[index] : null;
                        if (decorators) {
                            nestedResult.push.apply(nestedResult, decorators);
                        } /** @type {?} */
                        ((parameters_1)).push(nestedResult);
                    });
                }
                else if (parentType) {
                    parameters_1 = this.parameters(parentType);
                }
                if (!parameters_1) {
                    parameters_1 = [];
                }
                this.parameterCache.set(type, parameters_1);
            }
            return parameters_1;
        }
        catch (e) {
            console.error("Failed on type " + JSON.stringify(type) + " with error " + e);
            throw e;
        }
    };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticReflector.prototype._methodNames = /**
     * @param {?} type
     * @return {?}
     */
    function (type) {
        /** @type {?} */
        var methodNames = this.methodCache.get(type);
        if (!methodNames) {
            /** @type {?} */
            var classMetadata = this.getTypeMetadata(type);
            methodNames = {};
            /** @type {?} */
            var parentType = this.findParentType(type, classMetadata);
            if (parentType) {
                /** @type {?} */
                var parentMethodNames_1 = this._methodNames(parentType);
                Object.keys(parentMethodNames_1).forEach(function (parentProp) {
                    /** @type {?} */ ((methodNames))[parentProp] = parentMethodNames_1[parentProp];
                });
            }
            /** @type {?} */
            var members_2 = classMetadata['members'] || {};
            Object.keys(members_2).forEach(function (propName) {
                /** @type {?} */
                var propData = members_2[propName];
                /** @type {?} */
                var isMethod = (/** @type {?} */ (propData)).some(function (a) { return a['__symbolic'] == 'method'; }); /** @type {?} */
                ((methodNames))[propName] = /** @type {?} */ ((methodNames))[propName] || isMethod;
            });
            this.methodCache.set(type, methodNames);
        }
        return methodNames;
    };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticReflector.prototype._staticMembers = /**
     * @param {?} type
     * @return {?}
     */
    function (type) {
        /** @type {?} */
        var staticMembers = this.staticCache.get(type);
        if (!staticMembers) {
            /** @type {?} */
            var classMetadata = this.getTypeMetadata(type);
            /** @type {?} */
            var staticMemberData = classMetadata['statics'] || {};
            staticMembers = Object.keys(staticMemberData);
            this.staticCache.set(type, staticMembers);
        }
        return staticMembers;
    };
    /**
     * @param {?} type
     * @param {?} classMetadata
     * @return {?}
     */
    StaticReflector.prototype.findParentType = /**
     * @param {?} type
     * @param {?} classMetadata
     * @return {?}
     */
    function (type, classMetadata) {
        /** @type {?} */
        var parentType = this.trySimplify(type, classMetadata['extends']);
        if (parentType instanceof StaticSymbol) {
            return parentType;
        }
    };
    /**
     * @param {?} type
     * @param {?} lcProperty
     * @return {?}
     */
    StaticReflector.prototype.hasLifecycleHook = /**
     * @param {?} type
     * @param {?} lcProperty
     * @return {?}
     */
    function (type, lcProperty) {
        if (!(type instanceof StaticSymbol)) {
            this.reportError(new Error("hasLifecycleHook received " + JSON.stringify(type) + " which is not a StaticSymbol"), type);
        }
        try {
            return !!this._methodNames(type)[lcProperty];
        }
        catch (e) {
            console.error("Failed on type " + JSON.stringify(type) + " with error " + e);
            throw e;
        }
    };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticReflector.prototype.guards = /**
     * @param {?} type
     * @return {?}
     */
    function (type) {
        if (!(type instanceof StaticSymbol)) {
            this.reportError(new Error("guards received " + JSON.stringify(type) + " which is not a StaticSymbol"), type);
            return {};
        }
        /** @type {?} */
        var staticMembers = this._staticMembers(type);
        /** @type {?} */
        var result = {};
        for (var _i = 0, staticMembers_1 = staticMembers; _i < staticMembers_1.length; _i++) {
            var name_1 = staticMembers_1[_i];
            if (name_1.endsWith(TYPEGUARD_POSTFIX)) {
                /** @type {?} */
                var property = name_1.substr(0, name_1.length - TYPEGUARD_POSTFIX.length);
                /** @type {?} */
                var value = void 0;
                if (property.endsWith(USE_IF)) {
                    property = name_1.substr(0, property.length - USE_IF.length);
                    value = USE_IF;
                }
                else {
                    value = this.getStaticSymbol(type.filePath, type.name, [name_1]);
                }
                result[property] = value;
            }
        }
        return result;
    };
    /**
     * @param {?} type
     * @param {?} ctor
     * @return {?}
     */
    StaticReflector.prototype._registerDecoratorOrConstructor = /**
     * @param {?} type
     * @param {?} ctor
     * @return {?}
     */
    function (type, ctor) {
        this.conversionMap.set(type, function (context, args) { return new (ctor.bind.apply(ctor, [void 0].concat(args)))(); });
    };
    /**
     * @param {?} type
     * @param {?} fn
     * @return {?}
     */
    StaticReflector.prototype._registerFunction = /**
     * @param {?} type
     * @param {?} fn
     * @return {?}
     */
    function (type, fn) {
        this.conversionMap.set(type, function (context, args) { return fn.apply(undefined, args); });
    };
    /**
     * @return {?}
     */
    StaticReflector.prototype.initializeConversionMap = /**
     * @return {?}
     */
    function () {
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Injectable'), createInjectable);
        this.injectionToken = this.findDeclaration(ANGULAR_CORE, 'InjectionToken');
        this.opaqueToken = this.findDeclaration(ANGULAR_CORE, 'OpaqueToken');
        this.ROUTES = this.tryFindDeclaration(ANGULAR_ROUTER, 'ROUTES');
        this.ANALYZE_FOR_ENTRY_COMPONENTS =
            this.findDeclaration(ANGULAR_CORE, 'ANALYZE_FOR_ENTRY_COMPONENTS');
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Host'), createHost);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Self'), createSelf);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'SkipSelf'), createSkipSelf);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Inject'), createInject);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Optional'), createOptional);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Attribute'), createAttribute);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ContentChild'), createContentChild);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ContentChildren'), createContentChildren);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ViewChild'), createViewChild);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ViewChildren'), createViewChildren);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Input'), createInput);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Output'), createOutput);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Pipe'), createPipe);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'HostBinding'), createHostBinding);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'HostListener'), createHostListener);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Directive'), createDirective);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Component'), createComponent);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'NgModule'), createNgModule);
        // Note: Some metadata classes can be used directly with Provider.deps.
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Host'), createHost);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Self'), createSelf);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'SkipSelf'), createSkipSelf);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Optional'), createOptional);
    };
    /**
     * getStaticSymbol produces a Type whose metadata is known but whose implementation is not loaded.
     * All types passed to the StaticResolver should be pseudo-types returned by this method.
     *
     * @param declarationFile the absolute path of the file where the symbol is declared
     * @param name the name of the type.
     */
    /**
     * getStaticSymbol produces a Type whose metadata is known but whose implementation is not loaded.
     * All types passed to the StaticResolver should be pseudo-types returned by this method.
     *
     * @param {?} declarationFile the absolute path of the file where the symbol is declared
     * @param {?} name the name of the type.
     * @param {?=} members
     * @return {?}
     */
    StaticReflector.prototype.getStaticSymbol = /**
     * getStaticSymbol produces a Type whose metadata is known but whose implementation is not loaded.
     * All types passed to the StaticResolver should be pseudo-types returned by this method.
     *
     * @param {?} declarationFile the absolute path of the file where the symbol is declared
     * @param {?} name the name of the type.
     * @param {?=} members
     * @return {?}
     */
    function (declarationFile, name, members) {
        return this.symbolResolver.getStaticSymbol(declarationFile, name, members);
    };
    /**
     * Simplify but discard any errors
     * @param {?} context
     * @param {?} value
     * @return {?}
     */
    StaticReflector.prototype.trySimplify = /**
     * Simplify but discard any errors
     * @param {?} context
     * @param {?} value
     * @return {?}
     */
    function (context, value) {
        /** @type {?} */
        var originalRecorder = this.errorRecorder;
        this.errorRecorder = function (error, fileName) { };
        /** @type {?} */
        var result = this.simplify(context, value);
        this.errorRecorder = originalRecorder;
        return result;
    };
    /**
     * \@internal
     * @param {?} context
     * @param {?} value
     * @param {?=} lazy
     * @return {?}
     */
    StaticReflector.prototype.simplify = /**
     * \@internal
     * @param {?} context
     * @param {?} value
     * @param {?=} lazy
     * @return {?}
     */
    function (context, value, lazy) {
        if (lazy === void 0) { lazy = false; }
        /** @type {?} */
        var self = this;
        /** @type {?} */
        var scope = BindingScope.empty;
        /** @type {?} */
        var calling = new Map();
        /** @type {?} */
        var rootContext = context;
        /**
         * @param {?} context
         * @param {?} value
         * @param {?} depth
         * @param {?} references
         * @return {?}
         */
        function simplifyInContext(context, value, depth, references) {
            /**
             * @param {?} staticSymbol
             * @return {?}
             */
            function resolveReferenceValue(staticSymbol) {
                /** @type {?} */
                var resolvedSymbol = self.symbolResolver.resolveSymbol(staticSymbol);
                return resolvedSymbol ? resolvedSymbol.metadata : null;
            }
            /**
             * @param {?} value
             * @return {?}
             */
            function simplifyEagerly(value) {
                return simplifyInContext(context, value, depth, 0);
            }
            /**
             * @param {?} value
             * @return {?}
             */
            function simplifyLazily(value) {
                return simplifyInContext(context, value, depth, references + 1);
            }
            /**
             * @param {?} nestedContext
             * @param {?} value
             * @return {?}
             */
            function simplifyNested(nestedContext, value) {
                if (nestedContext === context) {
                    // If the context hasn't changed let the exception propagate unmodified.
                    return simplifyInContext(nestedContext, value, depth + 1, references);
                }
                try {
                    return simplifyInContext(nestedContext, value, depth + 1, references);
                }
                catch (e) {
                    if (isMetadataError(e)) {
                        /** @type {?} */
                        var summaryMsg = e.chain ? 'references \'' + /** @type {?} */ ((e.symbol)).name + '\'' : errorSummary(e);
                        /** @type {?} */
                        var summary = "'" + nestedContext.name + "' " + summaryMsg;
                        /** @type {?} */
                        var chain = { message: summary, position: e.position, next: e.chain };
                        // TODO(chuckj): retrieve the position information indirectly from the collectors node
                        // map if the metadata is from a .ts file.
                        self.error({
                            message: e.message,
                            advise: e.advise,
                            context: e.context, chain: chain,
                            symbol: nestedContext
                        }, context);
                    }
                    else {
                        // It is probably an internal error.
                        throw e;
                    }
                }
            }
            /**
             * @param {?} functionSymbol
             * @param {?} targetFunction
             * @param {?} args
             * @param {?} targetExpression
             * @return {?}
             */
            function simplifyCall(functionSymbol, targetFunction, args, targetExpression) {
                if (targetFunction && targetFunction['__symbolic'] == 'function') {
                    if (calling.get(functionSymbol)) {
                        self.error({
                            message: 'Recursion is not supported',
                            summary: "called '" + functionSymbol.name + "' recursively",
                            value: targetFunction
                        }, functionSymbol);
                    }
                    try {
                        /** @type {?} */
                        var value_1 = targetFunction['value'];
                        if (value_1 && (depth != 0 || value_1.__symbolic != 'error')) {
                            /** @type {?} */
                            var parameters = targetFunction['parameters'];
                            /** @type {?} */
                            var defaults = targetFunction.defaults;
                            args = args.map(function (arg) { return simplifyNested(context, arg); })
                                .map(function (arg) { return shouldIgnore(arg) ? undefined : arg; });
                            if (defaults && defaults.length > args.length) {
                                args.push.apply(args, defaults.slice(args.length).map(function (value) { return simplify(value); }));
                            }
                            calling.set(functionSymbol, true);
                            /** @type {?} */
                            var functionScope = BindingScope.build();
                            for (var i = 0; i < parameters.length; i++) {
                                functionScope.define(parameters[i], args[i]);
                            }
                            /** @type {?} */
                            var oldScope = scope;
                            /** @type {?} */
                            var result_1 = void 0;
                            try {
                                scope = functionScope.done();
                                result_1 = simplifyNested(functionSymbol, value_1);
                            }
                            finally {
                                scope = oldScope;
                            }
                            return result_1;
                        }
                    }
                    finally {
                        calling.delete(functionSymbol);
                    }
                }
                if (depth === 0) {
                    // If depth is 0 we are evaluating the top level expression that is describing element
                    // decorator. In this case, it is a decorator we don't understand, such as a custom
                    // non-angular decorator, and we should just ignore it.
                    return IGNORE;
                }
                /** @type {?} */
                var position = undefined;
                if (targetExpression && targetExpression.__symbolic == 'resolved') {
                    /** @type {?} */
                    var line = targetExpression.line;
                    /** @type {?} */
                    var character = targetExpression.character;
                    /** @type {?} */
                    var fileName = targetExpression.fileName;
                    if (fileName != null && line != null && character != null) {
                        position = { fileName: fileName, line: line, column: character };
                    }
                }
                self.error({
                    message: FUNCTION_CALL_NOT_SUPPORTED,
                    context: functionSymbol,
                    value: targetFunction, position: position
                }, context);
            }
            /**
             * @param {?} expression
             * @return {?}
             */
            function simplify(expression) {
                if (isPrimitive(expression)) {
                    return expression;
                }
                if (expression instanceof Array) {
                    /** @type {?} */
                    var result_2 = [];
                    for (var _i = 0, _a = (/** @type {?} */ (expression)); _i < _a.length; _i++) {
                        var item = _a[_i];
                        // Check for a spread expression
                        if (item && item.__symbolic === 'spread') {
                            /** @type {?} */
                            var spreadArray = simplifyEagerly(item.expression);
                            if (Array.isArray(spreadArray)) {
                                for (var _b = 0, spreadArray_1 = spreadArray; _b < spreadArray_1.length; _b++) {
                                    var spreadItem = spreadArray_1[_b];
                                    result_2.push(spreadItem);
                                }
                                continue;
                            }
                        }
                        /** @type {?} */
                        var value_2 = simplify(item);
                        if (shouldIgnore(value_2)) {
                            continue;
                        }
                        result_2.push(value_2);
                    }
                    return result_2;
                }
                if (expression instanceof StaticSymbol) {
                    // Stop simplification at builtin symbols or if we are in a reference context and
                    // the symbol doesn't have members.
                    if (expression === self.injectionToken || self.conversionMap.has(expression) ||
                        (references > 0 && !expression.members.length)) {
                        return expression;
                    }
                    else {
                        /** @type {?} */
                        var staticSymbol = expression;
                        /** @type {?} */
                        var declarationValue = resolveReferenceValue(staticSymbol);
                        if (declarationValue != null) {
                            return simplifyNested(staticSymbol, declarationValue);
                        }
                        else {
                            return staticSymbol;
                        }
                    }
                }
                if (expression) {
                    if (expression['__symbolic']) {
                        /** @type {?} */
                        var staticSymbol = void 0;
                        switch (expression['__symbolic']) {
                            case 'binop':
                                /** @type {?} */
                                var left = simplify(expression['left']);
                                if (shouldIgnore(left))
                                    return left;
                                /** @type {?} */
                                var right = simplify(expression['right']);
                                if (shouldIgnore(right))
                                    return right;
                                switch (expression['operator']) {
                                    case '&&':
                                        return left && right;
                                    case '||':
                                        return left || right;
                                    case '|':
                                        return left | right;
                                    case '^':
                                        return left ^ right;
                                    case '&':
                                        return left & right;
                                    case '==':
                                        return left == right;
                                    case '!=':
                                        return left != right;
                                    case '===':
                                        return left === right;
                                    case '!==':
                                        return left !== right;
                                    case '<':
                                        return left < right;
                                    case '>':
                                        return left > right;
                                    case '<=':
                                        return left <= right;
                                    case '>=':
                                        return left >= right;
                                    case '<<':
                                        return left << right;
                                    case '>>':
                                        return left >> right;
                                    case '+':
                                        return left + right;
                                    case '-':
                                        return left - right;
                                    case '*':
                                        return left * right;
                                    case '/':
                                        return left / right;
                                    case '%':
                                        return left % right;
                                }
                                return null;
                            case 'if':
                                /** @type {?} */
                                var condition = simplify(expression['condition']);
                                return condition ? simplify(expression['thenExpression']) :
                                    simplify(expression['elseExpression']);
                            case 'pre':
                                /** @type {?} */
                                var operand = simplify(expression['operand']);
                                if (shouldIgnore(operand))
                                    return operand;
                                switch (expression['operator']) {
                                    case '+':
                                        return operand;
                                    case '-':
                                        return -operand;
                                    case '!':
                                        return !operand;
                                    case '~':
                                        return ~operand;
                                }
                                return null;
                            case 'index':
                                /** @type {?} */
                                var indexTarget = simplifyEagerly(expression['expression']);
                                /** @type {?} */
                                var index = simplifyEagerly(expression['index']);
                                if (indexTarget && isPrimitive(index))
                                    return indexTarget[index];
                                return null;
                            case 'select':
                                /** @type {?} */
                                var member = expression['member'];
                                /** @type {?} */
                                var selectContext = context;
                                /** @type {?} */
                                var selectTarget = simplify(expression['expression']);
                                if (selectTarget instanceof StaticSymbol) {
                                    /** @type {?} */
                                    var members = selectTarget.members.concat(member);
                                    selectContext =
                                        self.getStaticSymbol(selectTarget.filePath, selectTarget.name, members);
                                    /** @type {?} */
                                    var declarationValue = resolveReferenceValue(selectContext);
                                    if (declarationValue != null) {
                                        return simplifyNested(selectContext, declarationValue);
                                    }
                                    else {
                                        return selectContext;
                                    }
                                }
                                if (selectTarget && isPrimitive(member))
                                    return simplifyNested(selectContext, selectTarget[member]);
                                return null;
                            case 'reference':
                                /** @type {?} */
                                var name_2 = expression['name'];
                                /** @type {?} */
                                var localValue = scope.resolve(name_2);
                                if (localValue != BindingScope.missing) {
                                    return localValue;
                                }
                                break;
                            case 'resolved':
                                try {
                                    return simplify(expression.symbol);
                                }
                                catch (e) {
                                    // If an error is reported evaluating the symbol record the position of the
                                    // reference in the error so it can
                                    // be reported in the error message generated from the exception.
                                    if (isMetadataError(e) && expression.fileName != null &&
                                        expression.line != null && expression.character != null) {
                                        e.position = {
                                            fileName: expression.fileName,
                                            line: expression.line,
                                            column: expression.character
                                        };
                                    }
                                    throw e;
                                }
                            case 'class':
                                return context;
                            case 'function':
                                return context;
                            case 'new':
                            case 'call':
                                // Determine if the function is a built-in conversion
                                staticSymbol = simplifyInContext(context, expression['expression'], depth + 1, /* references */ 0);
                                if (staticSymbol instanceof StaticSymbol) {
                                    if (staticSymbol === self.injectionToken || staticSymbol === self.opaqueToken) {
                                        // if somebody calls new InjectionToken, don't create an InjectionToken,
                                        // but rather return the symbol to which the InjectionToken is assigned to.
                                        // OpaqueToken is supported too as it is required by the language service to
                                        // support v4 and prior versions of Angular.
                                        return context;
                                    }
                                    /** @type {?} */
                                    var argExpressions = expression['arguments'] || [];
                                    /** @type {?} */
                                    var converter = self.conversionMap.get(staticSymbol);
                                    if (converter) {
                                        /** @type {?} */
                                        var args = argExpressions.map(function (arg) { return simplifyNested(context, arg); })
                                            .map(function (arg) { return shouldIgnore(arg) ? undefined : arg; });
                                        return converter(context, args);
                                    }
                                    else {
                                        /** @type {?} */
                                        var targetFunction = resolveReferenceValue(staticSymbol);
                                        return simplifyCall(staticSymbol, targetFunction, argExpressions, expression['expression']);
                                    }
                                }
                                return IGNORE;
                            case 'error':
                                /** @type {?} */
                                var message = expression.message;
                                if (expression['line'] != null) {
                                    self.error({
                                        message: message,
                                        context: expression.context,
                                        value: expression,
                                        position: {
                                            fileName: expression['fileName'],
                                            line: expression['line'],
                                            column: expression['character']
                                        }
                                    }, context);
                                }
                                else {
                                    self.error({ message: message, context: expression.context }, context);
                                }
                                return IGNORE;
                            case 'ignore':
                                return expression;
                        }
                        return null;
                    }
                    return mapStringMap(expression, function (value, name) {
                        if (REFERENCE_SET.has(name)) {
                            if (name === USE_VALUE && PROVIDE in expression) {
                                /** @type {?} */
                                var provide = simplify(expression.provide);
                                if (provide === self.ROUTES || provide == self.ANALYZE_FOR_ENTRY_COMPONENTS) {
                                    return simplify(value);
                                }
                            }
                            return simplifyLazily(value);
                        }
                        return simplify(value);
                    });
                }
                return IGNORE;
            }
            return simplify(value);
        }
        /** @type {?} */
        var result;
        try {
            result = simplifyInContext(context, value, 0, lazy ? 1 : 0);
        }
        catch (e) {
            if (this.errorRecorder) {
                this.reportError(e, context);
            }
            else {
                throw formatMetadataError(e, context);
            }
        }
        if (shouldIgnore(result)) {
            return undefined;
        }
        return result;
    };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticReflector.prototype.getTypeMetadata = /**
     * @param {?} type
     * @return {?}
     */
    function (type) {
        /** @type {?} */
        var resolvedSymbol = this.symbolResolver.resolveSymbol(type);
        return resolvedSymbol && resolvedSymbol.metadata ? resolvedSymbol.metadata :
            { __symbolic: 'class' };
    };
    /**
     * @param {?} error
     * @param {?} context
     * @param {?=} path
     * @return {?}
     */
    StaticReflector.prototype.reportError = /**
     * @param {?} error
     * @param {?} context
     * @param {?=} path
     * @return {?}
     */
    function (error, context, path) {
        if (this.errorRecorder) {
            this.errorRecorder(formatMetadataError(error, context), (context && context.filePath) || path);
        }
        else {
            throw error;
        }
    };
    /**
     * @param {?} __0
     * @param {?} reportingContext
     * @return {?}
     */
    StaticReflector.prototype.error = /**
     * @param {?} __0
     * @param {?} reportingContext
     * @return {?}
     */
    function (_a, reportingContext) {
        var message = _a.message, summary = _a.summary, advise = _a.advise, position = _a.position, context = _a.context, value = _a.value, symbol = _a.symbol, chain = _a.chain;
        this.reportError(metadataError(message, summary, advise, position, symbol, context, chain), reportingContext);
    };
    return StaticReflector;
}());
/**
 * A static reflector implements enough of the Reflector API that is necessary to compile
 * templates statically.
 */
export { StaticReflector };
if (false) {
    /** @type {?} */
    StaticReflector.prototype.annotationCache;
    /** @type {?} */
    StaticReflector.prototype.shallowAnnotationCache;
    /** @type {?} */
    StaticReflector.prototype.propertyCache;
    /** @type {?} */
    StaticReflector.prototype.parameterCache;
    /** @type {?} */
    StaticReflector.prototype.methodCache;
    /** @type {?} */
    StaticReflector.prototype.staticCache;
    /** @type {?} */
    StaticReflector.prototype.conversionMap;
    /** @type {?} */
    StaticReflector.prototype.resolvedExternalReferences;
    /** @type {?} */
    StaticReflector.prototype.injectionToken;
    /** @type {?} */
    StaticReflector.prototype.opaqueToken;
    /** @type {?} */
    StaticReflector.prototype.ROUTES;
    /** @type {?} */
    StaticReflector.prototype.ANALYZE_FOR_ENTRY_COMPONENTS;
    /** @type {?} */
    StaticReflector.prototype.annotationForParentClassWithSummaryKind;
    /** @type {?} */
    StaticReflector.prototype.summaryResolver;
    /** @type {?} */
    StaticReflector.prototype.symbolResolver;
    /** @type {?} */
    StaticReflector.prototype.errorRecorder;
}
/**
 * @record
 */
function Position() { }
/** @type {?} */
Position.prototype.fileName;
/** @type {?} */
Position.prototype.line;
/** @type {?} */
Position.prototype.column;
/**
 * @record
 */
function MetadataMessageChain() { }
/** @type {?} */
MetadataMessageChain.prototype.message;
/** @type {?|undefined} */
MetadataMessageChain.prototype.summary;
/** @type {?|undefined} */
MetadataMessageChain.prototype.position;
/** @type {?|undefined} */
MetadataMessageChain.prototype.context;
/** @type {?|undefined} */
MetadataMessageChain.prototype.symbol;
/** @type {?|undefined} */
MetadataMessageChain.prototype.next;
/** @typedef {?} */
var MetadataError;
/** @type {?} */
var METADATA_ERROR = 'ngMetadataError';
/**
 * @param {?} message
 * @param {?=} summary
 * @param {?=} advise
 * @param {?=} position
 * @param {?=} symbol
 * @param {?=} context
 * @param {?=} chain
 * @return {?}
 */
function metadataError(message, summary, advise, position, symbol, context, chain) {
    /** @type {?} */
    var error = /** @type {?} */ (syntaxError(message));
    (/** @type {?} */ (error))[METADATA_ERROR] = true;
    if (advise)
        error.advise = advise;
    if (position)
        error.position = position;
    if (summary)
        error.summary = summary;
    if (context)
        error.context = context;
    if (chain)
        error.chain = chain;
    if (symbol)
        error.symbol = symbol;
    return error;
}
/**
 * @param {?} error
 * @return {?}
 */
function isMetadataError(error) {
    return !!(/** @type {?} */ (error))[METADATA_ERROR];
}
/** @type {?} */
var REFERENCE_TO_NONEXPORTED_CLASS = 'Reference to non-exported class';
/** @type {?} */
var VARIABLE_NOT_INITIALIZED = 'Variable not initialized';
/** @type {?} */
var DESTRUCTURE_NOT_SUPPORTED = 'Destructuring not supported';
/** @type {?} */
var COULD_NOT_RESOLVE_TYPE = 'Could not resolve type';
/** @type {?} */
var FUNCTION_CALL_NOT_SUPPORTED = 'Function call not supported';
/** @type {?} */
var REFERENCE_TO_LOCAL_SYMBOL = 'Reference to a local symbol';
/** @type {?} */
var LAMBDA_NOT_SUPPORTED = 'Lambda not supported';
/**
 * @param {?} message
 * @param {?} context
 * @return {?}
 */
function expandedMessage(message, context) {
    switch (message) {
        case REFERENCE_TO_NONEXPORTED_CLASS:
            if (context && context.className) {
                return "References to a non-exported class are not supported in decorators but " + context.className + " was referenced.";
            }
            break;
        case VARIABLE_NOT_INITIALIZED:
            return 'Only initialized variables and constants can be referenced in decorators because the value of this variable is needed by the template compiler';
        case DESTRUCTURE_NOT_SUPPORTED:
            return 'Referencing an exported destructured variable or constant is not supported in decorators and this value is needed by the template compiler';
        case COULD_NOT_RESOLVE_TYPE:
            if (context && context.typeName) {
                return "Could not resolve type " + context.typeName;
            }
            break;
        case FUNCTION_CALL_NOT_SUPPORTED:
            if (context && context.name) {
                return "Function calls are not supported in decorators but '" + context.name + "' was called";
            }
            return 'Function calls are not supported in decorators';
        case REFERENCE_TO_LOCAL_SYMBOL:
            if (context && context.name) {
                return "Reference to a local (non-exported) symbols are not supported in decorators but '" + context.name + "' was referenced";
            }
            break;
        case LAMBDA_NOT_SUPPORTED:
            return "Function expressions are not supported in decorators";
    }
    return message;
}
/**
 * @param {?} message
 * @param {?} context
 * @return {?}
 */
function messageAdvise(message, context) {
    switch (message) {
        case REFERENCE_TO_NONEXPORTED_CLASS:
            if (context && context.className) {
                return "Consider exporting '" + context.className + "'";
            }
            break;
        case DESTRUCTURE_NOT_SUPPORTED:
            return 'Consider simplifying to avoid destructuring';
        case REFERENCE_TO_LOCAL_SYMBOL:
            if (context && context.name) {
                return "Consider exporting '" + context.name + "'";
            }
            break;
        case LAMBDA_NOT_SUPPORTED:
            return "Consider changing the function expression into an exported function";
    }
    return undefined;
}
/**
 * @param {?} error
 * @return {?}
 */
function errorSummary(error) {
    if (error.summary) {
        return error.summary;
    }
    switch (error.message) {
        case REFERENCE_TO_NONEXPORTED_CLASS:
            if (error.context && error.context.className) {
                return "references non-exported class " + error.context.className;
            }
            break;
        case VARIABLE_NOT_INITIALIZED:
            return 'is not initialized';
        case DESTRUCTURE_NOT_SUPPORTED:
            return 'is a destructured variable';
        case COULD_NOT_RESOLVE_TYPE:
            return 'could not be resolved';
        case FUNCTION_CALL_NOT_SUPPORTED:
            if (error.context && error.context.name) {
                return "calls '" + error.context.name + "'";
            }
            return "calls a function";
        case REFERENCE_TO_LOCAL_SYMBOL:
            if (error.context && error.context.name) {
                return "references local variable " + error.context.name;
            }
            return "references a local variable";
    }
    return 'contains the error';
}
/**
 * @param {?} input
 * @param {?} transform
 * @return {?}
 */
function mapStringMap(input, transform) {
    if (!input)
        return {};
    /** @type {?} */
    var result = {};
    Object.keys(input).forEach(function (key) {
        /** @type {?} */
        var value = transform(input[key], key);
        if (!shouldIgnore(value)) {
            if (HIDDEN_KEY.test(key)) {
                Object.defineProperty(result, key, { enumerable: false, configurable: true, value: value });
            }
            else {
                result[key] = value;
            }
        }
    });
    return result;
}
/**
 * @param {?} o
 * @return {?}
 */
function isPrimitive(o) {
    return o === null || (typeof o !== 'function' && typeof o !== 'object');
}
/**
 * @record
 */
function BindingScopeBuilder() { }
/** @type {?} */
BindingScopeBuilder.prototype.define;
/** @type {?} */
BindingScopeBuilder.prototype.done;
/**
 * @abstract
 */
var BindingScope = /** @class */ (function () {
    function BindingScope() {
    }
    /**
     * @return {?}
     */
    BindingScope.build = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var current = new Map();
        return {
            define: function (name, value) {
                current.set(name, value);
                return this;
            },
            done: function () {
                return current.size > 0 ? new PopulatedScope(current) : BindingScope.empty;
            }
        };
    };
    BindingScope.missing = {};
    BindingScope.empty = { resolve: function (name) { return BindingScope.missing; } };
    return BindingScope;
}());
if (false) {
    /** @type {?} */
    BindingScope.missing;
    /** @type {?} */
    BindingScope.empty;
    /**
     * @abstract
     * @param {?} name
     * @return {?}
     */
    BindingScope.prototype.resolve = function (name) { };
}
var PopulatedScope = /** @class */ (function (_super) {
    tslib_1.__extends(PopulatedScope, _super);
    function PopulatedScope(bindings) {
        var _this = _super.call(this) || this;
        _this.bindings = bindings;
        return _this;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    PopulatedScope.prototype.resolve = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        return this.bindings.has(name) ? this.bindings.get(name) : BindingScope.missing;
    };
    return PopulatedScope;
}(BindingScope));
if (false) {
    /** @type {?} */
    PopulatedScope.prototype.bindings;
}
/**
 * @param {?} chain
 * @param {?} advise
 * @return {?}
 */
function formatMetadataMessageChain(chain, advise) {
    /** @type {?} */
    var expanded = expandedMessage(chain.message, chain.context);
    /** @type {?} */
    var nesting = chain.symbol ? " in '" + chain.symbol.name + "'" : '';
    /** @type {?} */
    var message = "" + expanded + nesting;
    /** @type {?} */
    var position = chain.position;
    /** @type {?} */
    var next = chain.next ?
        formatMetadataMessageChain(chain.next, advise) :
        advise ? { message: advise } : undefined;
    return { message: message, position: position, next: next };
}
/**
 * @param {?} e
 * @param {?} context
 * @return {?}
 */
function formatMetadataError(e, context) {
    if (isMetadataError(e)) {
        /** @type {?} */
        var position = e.position;
        /** @type {?} */
        var chain = {
            message: "Error during template compile of '" + context.name + "'",
            position: position,
            next: { message: e.message, next: e.chain, context: e.context, symbol: e.symbol }
        };
        /** @type {?} */
        var advise = e.advise || messageAdvise(e.message, e.context);
        return formattedError(formatMetadataMessageChain(chain, advise));
    }
    return e;
}
//# sourceMappingURL=static_reflector.js.map