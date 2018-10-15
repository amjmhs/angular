"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var static_symbol_1 = require("./aot/static_symbol");
var util_1 = require("./util");
// group 0: "[prop] or (event) or @trigger"
// group 1: "prop" from "[prop]"
// group 2: "event" from "(event)"
// group 3: "@trigger" from "@trigger"
var HOST_REG_EXP = /^(?:(?:\[([^\]]+)\])|(?:\(([^\)]+)\)))|(\@[-\w]+)$/;
function sanitizeIdentifier(name) {
    return name.replace(/\W/g, '_');
}
exports.sanitizeIdentifier = sanitizeIdentifier;
var _anonymousTypeIndex = 0;
function identifierName(compileIdentifier) {
    if (!compileIdentifier || !compileIdentifier.reference) {
        return null;
    }
    var ref = compileIdentifier.reference;
    if (ref instanceof static_symbol_1.StaticSymbol) {
        return ref.name;
    }
    if (ref['__anonymousType']) {
        return ref['__anonymousType'];
    }
    var identifier = util_1.stringify(ref);
    if (identifier.indexOf('(') >= 0) {
        // case: anonymous functions!
        identifier = "anonymous_" + _anonymousTypeIndex++;
        ref['__anonymousType'] = identifier;
    }
    else {
        identifier = sanitizeIdentifier(identifier);
    }
    return identifier;
}
exports.identifierName = identifierName;
function identifierModuleUrl(compileIdentifier) {
    var ref = compileIdentifier.reference;
    if (ref instanceof static_symbol_1.StaticSymbol) {
        return ref.filePath;
    }
    // Runtime type
    return "./" + util_1.stringify(ref);
}
exports.identifierModuleUrl = identifierModuleUrl;
function viewClassName(compType, embeddedTemplateIndex) {
    return "View_" + identifierName({ reference: compType }) + "_" + embeddedTemplateIndex;
}
exports.viewClassName = viewClassName;
function rendererTypeName(compType) {
    return "RenderType_" + identifierName({ reference: compType });
}
exports.rendererTypeName = rendererTypeName;
function hostViewClassName(compType) {
    return "HostView_" + identifierName({ reference: compType });
}
exports.hostViewClassName = hostViewClassName;
function componentFactoryName(compType) {
    return identifierName({ reference: compType }) + "NgFactory";
}
exports.componentFactoryName = componentFactoryName;
var CompileSummaryKind;
(function (CompileSummaryKind) {
    CompileSummaryKind[CompileSummaryKind["Pipe"] = 0] = "Pipe";
    CompileSummaryKind[CompileSummaryKind["Directive"] = 1] = "Directive";
    CompileSummaryKind[CompileSummaryKind["NgModule"] = 2] = "NgModule";
    CompileSummaryKind[CompileSummaryKind["Injectable"] = 3] = "Injectable";
})(CompileSummaryKind = exports.CompileSummaryKind || (exports.CompileSummaryKind = {}));
function tokenName(token) {
    return token.value != null ? sanitizeIdentifier(token.value) : identifierName(token.identifier);
}
exports.tokenName = tokenName;
function tokenReference(token) {
    if (token.identifier != null) {
        return token.identifier.reference;
    }
    else {
        return token.value;
    }
}
exports.tokenReference = tokenReference;
/**
 * Metadata about a stylesheet
 */
var CompileStylesheetMetadata = /** @class */ (function () {
    function CompileStylesheetMetadata(_a) {
        var _b = _a === void 0 ? {} : _a, moduleUrl = _b.moduleUrl, styles = _b.styles, styleUrls = _b.styleUrls;
        this.moduleUrl = moduleUrl || null;
        this.styles = _normalizeArray(styles);
        this.styleUrls = _normalizeArray(styleUrls);
    }
    return CompileStylesheetMetadata;
}());
exports.CompileStylesheetMetadata = CompileStylesheetMetadata;
/**
 * Metadata regarding compilation of a template.
 */
var CompileTemplateMetadata = /** @class */ (function () {
    function CompileTemplateMetadata(_a) {
        var encapsulation = _a.encapsulation, template = _a.template, templateUrl = _a.templateUrl, htmlAst = _a.htmlAst, styles = _a.styles, styleUrls = _a.styleUrls, externalStylesheets = _a.externalStylesheets, animations = _a.animations, ngContentSelectors = _a.ngContentSelectors, interpolation = _a.interpolation, isInline = _a.isInline, preserveWhitespaces = _a.preserveWhitespaces;
        this.encapsulation = encapsulation;
        this.template = template;
        this.templateUrl = templateUrl;
        this.htmlAst = htmlAst;
        this.styles = _normalizeArray(styles);
        this.styleUrls = _normalizeArray(styleUrls);
        this.externalStylesheets = _normalizeArray(externalStylesheets);
        this.animations = animations ? flatten(animations) : [];
        this.ngContentSelectors = ngContentSelectors || [];
        if (interpolation && interpolation.length != 2) {
            throw new Error("'interpolation' should have a start and an end symbol.");
        }
        this.interpolation = interpolation;
        this.isInline = isInline;
        this.preserveWhitespaces = preserveWhitespaces;
    }
    CompileTemplateMetadata.prototype.toSummary = function () {
        return {
            ngContentSelectors: this.ngContentSelectors,
            encapsulation: this.encapsulation,
        };
    };
    return CompileTemplateMetadata;
}());
exports.CompileTemplateMetadata = CompileTemplateMetadata;
/**
 * Metadata regarding compilation of a directive.
 */
var CompileDirectiveMetadata = /** @class */ (function () {
    function CompileDirectiveMetadata(_a) {
        var isHost = _a.isHost, type = _a.type, isComponent = _a.isComponent, selector = _a.selector, exportAs = _a.exportAs, changeDetection = _a.changeDetection, inputs = _a.inputs, outputs = _a.outputs, hostListeners = _a.hostListeners, hostProperties = _a.hostProperties, hostAttributes = _a.hostAttributes, providers = _a.providers, viewProviders = _a.viewProviders, queries = _a.queries, guards = _a.guards, viewQueries = _a.viewQueries, entryComponents = _a.entryComponents, template = _a.template, componentViewType = _a.componentViewType, rendererType = _a.rendererType, componentFactory = _a.componentFactory;
        this.isHost = !!isHost;
        this.type = type;
        this.isComponent = isComponent;
        this.selector = selector;
        this.exportAs = exportAs;
        this.changeDetection = changeDetection;
        this.inputs = inputs;
        this.outputs = outputs;
        this.hostListeners = hostListeners;
        this.hostProperties = hostProperties;
        this.hostAttributes = hostAttributes;
        this.providers = _normalizeArray(providers);
        this.viewProviders = _normalizeArray(viewProviders);
        this.queries = _normalizeArray(queries);
        this.guards = guards;
        this.viewQueries = _normalizeArray(viewQueries);
        this.entryComponents = _normalizeArray(entryComponents);
        this.template = template;
        this.componentViewType = componentViewType;
        this.rendererType = rendererType;
        this.componentFactory = componentFactory;
    }
    CompileDirectiveMetadata.create = function (_a) {
        var isHost = _a.isHost, type = _a.type, isComponent = _a.isComponent, selector = _a.selector, exportAs = _a.exportAs, changeDetection = _a.changeDetection, inputs = _a.inputs, outputs = _a.outputs, host = _a.host, providers = _a.providers, viewProviders = _a.viewProviders, queries = _a.queries, guards = _a.guards, viewQueries = _a.viewQueries, entryComponents = _a.entryComponents, template = _a.template, componentViewType = _a.componentViewType, rendererType = _a.rendererType, componentFactory = _a.componentFactory;
        var hostListeners = {};
        var hostProperties = {};
        var hostAttributes = {};
        if (host != null) {
            Object.keys(host).forEach(function (key) {
                var value = host[key];
                var matches = key.match(HOST_REG_EXP);
                if (matches === null) {
                    hostAttributes[key] = value;
                }
                else if (matches[1] != null) {
                    hostProperties[matches[1]] = value;
                }
                else if (matches[2] != null) {
                    hostListeners[matches[2]] = value;
                }
            });
        }
        var inputsMap = {};
        if (inputs != null) {
            inputs.forEach(function (bindConfig) {
                // canonical syntax: `dirProp: elProp`
                // if there is no `:`, use dirProp = elProp
                var parts = util_1.splitAtColon(bindConfig, [bindConfig, bindConfig]);
                inputsMap[parts[0]] = parts[1];
            });
        }
        var outputsMap = {};
        if (outputs != null) {
            outputs.forEach(function (bindConfig) {
                // canonical syntax: `dirProp: elProp`
                // if there is no `:`, use dirProp = elProp
                var parts = util_1.splitAtColon(bindConfig, [bindConfig, bindConfig]);
                outputsMap[parts[0]] = parts[1];
            });
        }
        return new CompileDirectiveMetadata({
            isHost: isHost,
            type: type,
            isComponent: !!isComponent, selector: selector, exportAs: exportAs, changeDetection: changeDetection,
            inputs: inputsMap,
            outputs: outputsMap,
            hostListeners: hostListeners,
            hostProperties: hostProperties,
            hostAttributes: hostAttributes,
            providers: providers,
            viewProviders: viewProviders,
            queries: queries,
            guards: guards,
            viewQueries: viewQueries,
            entryComponents: entryComponents,
            template: template,
            componentViewType: componentViewType,
            rendererType: rendererType,
            componentFactory: componentFactory,
        });
    };
    CompileDirectiveMetadata.prototype.toSummary = function () {
        return {
            summaryKind: CompileSummaryKind.Directive,
            type: this.type,
            isComponent: this.isComponent,
            selector: this.selector,
            exportAs: this.exportAs,
            inputs: this.inputs,
            outputs: this.outputs,
            hostListeners: this.hostListeners,
            hostProperties: this.hostProperties,
            hostAttributes: this.hostAttributes,
            providers: this.providers,
            viewProviders: this.viewProviders,
            queries: this.queries,
            guards: this.guards,
            viewQueries: this.viewQueries,
            entryComponents: this.entryComponents,
            changeDetection: this.changeDetection,
            template: this.template && this.template.toSummary(),
            componentViewType: this.componentViewType,
            rendererType: this.rendererType,
            componentFactory: this.componentFactory
        };
    };
    return CompileDirectiveMetadata;
}());
exports.CompileDirectiveMetadata = CompileDirectiveMetadata;
var CompilePipeMetadata = /** @class */ (function () {
    function CompilePipeMetadata(_a) {
        var type = _a.type, name = _a.name, pure = _a.pure;
        this.type = type;
        this.name = name;
        this.pure = !!pure;
    }
    CompilePipeMetadata.prototype.toSummary = function () {
        return {
            summaryKind: CompileSummaryKind.Pipe,
            type: this.type,
            name: this.name,
            pure: this.pure
        };
    };
    return CompilePipeMetadata;
}());
exports.CompilePipeMetadata = CompilePipeMetadata;
var CompileShallowModuleMetadata = /** @class */ (function () {
    function CompileShallowModuleMetadata() {
    }
    return CompileShallowModuleMetadata;
}());
exports.CompileShallowModuleMetadata = CompileShallowModuleMetadata;
/**
 * Metadata regarding compilation of a module.
 */
var CompileNgModuleMetadata = /** @class */ (function () {
    function CompileNgModuleMetadata(_a) {
        var type = _a.type, providers = _a.providers, declaredDirectives = _a.declaredDirectives, exportedDirectives = _a.exportedDirectives, declaredPipes = _a.declaredPipes, exportedPipes = _a.exportedPipes, entryComponents = _a.entryComponents, bootstrapComponents = _a.bootstrapComponents, importedModules = _a.importedModules, exportedModules = _a.exportedModules, schemas = _a.schemas, transitiveModule = _a.transitiveModule, id = _a.id;
        this.type = type || null;
        this.declaredDirectives = _normalizeArray(declaredDirectives);
        this.exportedDirectives = _normalizeArray(exportedDirectives);
        this.declaredPipes = _normalizeArray(declaredPipes);
        this.exportedPipes = _normalizeArray(exportedPipes);
        this.providers = _normalizeArray(providers);
        this.entryComponents = _normalizeArray(entryComponents);
        this.bootstrapComponents = _normalizeArray(bootstrapComponents);
        this.importedModules = _normalizeArray(importedModules);
        this.exportedModules = _normalizeArray(exportedModules);
        this.schemas = _normalizeArray(schemas);
        this.id = id || null;
        this.transitiveModule = transitiveModule || null;
    }
    CompileNgModuleMetadata.prototype.toSummary = function () {
        var module = this.transitiveModule;
        return {
            summaryKind: CompileSummaryKind.NgModule,
            type: this.type,
            entryComponents: module.entryComponents,
            providers: module.providers,
            modules: module.modules,
            exportedDirectives: module.exportedDirectives,
            exportedPipes: module.exportedPipes
        };
    };
    return CompileNgModuleMetadata;
}());
exports.CompileNgModuleMetadata = CompileNgModuleMetadata;
var TransitiveCompileNgModuleMetadata = /** @class */ (function () {
    function TransitiveCompileNgModuleMetadata() {
        this.directivesSet = new Set();
        this.directives = [];
        this.exportedDirectivesSet = new Set();
        this.exportedDirectives = [];
        this.pipesSet = new Set();
        this.pipes = [];
        this.exportedPipesSet = new Set();
        this.exportedPipes = [];
        this.modulesSet = new Set();
        this.modules = [];
        this.entryComponentsSet = new Set();
        this.entryComponents = [];
        this.providers = [];
    }
    TransitiveCompileNgModuleMetadata.prototype.addProvider = function (provider, module) {
        this.providers.push({ provider: provider, module: module });
    };
    TransitiveCompileNgModuleMetadata.prototype.addDirective = function (id) {
        if (!this.directivesSet.has(id.reference)) {
            this.directivesSet.add(id.reference);
            this.directives.push(id);
        }
    };
    TransitiveCompileNgModuleMetadata.prototype.addExportedDirective = function (id) {
        if (!this.exportedDirectivesSet.has(id.reference)) {
            this.exportedDirectivesSet.add(id.reference);
            this.exportedDirectives.push(id);
        }
    };
    TransitiveCompileNgModuleMetadata.prototype.addPipe = function (id) {
        if (!this.pipesSet.has(id.reference)) {
            this.pipesSet.add(id.reference);
            this.pipes.push(id);
        }
    };
    TransitiveCompileNgModuleMetadata.prototype.addExportedPipe = function (id) {
        if (!this.exportedPipesSet.has(id.reference)) {
            this.exportedPipesSet.add(id.reference);
            this.exportedPipes.push(id);
        }
    };
    TransitiveCompileNgModuleMetadata.prototype.addModule = function (id) {
        if (!this.modulesSet.has(id.reference)) {
            this.modulesSet.add(id.reference);
            this.modules.push(id);
        }
    };
    TransitiveCompileNgModuleMetadata.prototype.addEntryComponent = function (ec) {
        if (!this.entryComponentsSet.has(ec.componentType)) {
            this.entryComponentsSet.add(ec.componentType);
            this.entryComponents.push(ec);
        }
    };
    return TransitiveCompileNgModuleMetadata;
}());
exports.TransitiveCompileNgModuleMetadata = TransitiveCompileNgModuleMetadata;
function _normalizeArray(obj) {
    return obj || [];
}
var ProviderMeta = /** @class */ (function () {
    function ProviderMeta(token, _a) {
        var useClass = _a.useClass, useValue = _a.useValue, useExisting = _a.useExisting, useFactory = _a.useFactory, deps = _a.deps, multi = _a.multi;
        this.token = token;
        this.useClass = useClass || null;
        this.useValue = useValue;
        this.useExisting = useExisting;
        this.useFactory = useFactory || null;
        this.dependencies = deps || null;
        this.multi = !!multi;
    }
    return ProviderMeta;
}());
exports.ProviderMeta = ProviderMeta;
function flatten(list) {
    return list.reduce(function (flat, item) {
        var flatItem = Array.isArray(item) ? flatten(item) : item;
        return flat.concat(flatItem);
    }, []);
}
exports.flatten = flatten;
function jitSourceUrl(url) {
    // Note: We need 3 "/" so that ng shows up as a separate domain
    // in the chrome dev tools.
    return url.replace(/(\w+:\/\/[\w:-]+)?(\/+)?/, 'ng:///');
}
function templateSourceUrl(ngModuleType, compMeta, templateMeta) {
    var url;
    if (templateMeta.isInline) {
        if (compMeta.type.reference instanceof static_symbol_1.StaticSymbol) {
            // Note: a .ts file might contain multiple components with inline templates,
            // so we need to give them unique urls, as these will be used for sourcemaps.
            url = compMeta.type.reference.filePath + "." + compMeta.type.reference.name + ".html";
        }
        else {
            url = identifierName(ngModuleType) + "/" + identifierName(compMeta.type) + ".html";
        }
    }
    else {
        url = templateMeta.templateUrl;
    }
    return compMeta.type.reference instanceof static_symbol_1.StaticSymbol ? url : jitSourceUrl(url);
}
exports.templateSourceUrl = templateSourceUrl;
function sharedStylesheetJitUrl(meta, id) {
    var pathParts = meta.moduleUrl.split(/\/\\/g);
    var baseName = pathParts[pathParts.length - 1];
    return jitSourceUrl("css/" + id + baseName + ".ngstyle.js");
}
exports.sharedStylesheetJitUrl = sharedStylesheetJitUrl;
function ngModuleJitUrl(moduleMeta) {
    return jitSourceUrl(identifierName(moduleMeta.type) + "/module.ngfactory.js");
}
exports.ngModuleJitUrl = ngModuleJitUrl;
function templateJitUrl(ngModuleType, compMeta) {
    return jitSourceUrl(identifierName(ngModuleType) + "/" + identifierName(compMeta.type) + ".ngfactory.js");
}
exports.templateJitUrl = templateJitUrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZV9tZXRhZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9jb21waWxlX21ldGFkYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgscURBQWlEO0FBSWpELCtCQUErQztBQUUvQywyQ0FBMkM7QUFDM0MsZ0NBQWdDO0FBQ2hDLGtDQUFrQztBQUNsQyxzQ0FBc0M7QUFDdEMsSUFBTSxZQUFZLEdBQUcsb0RBQW9ELENBQUM7QUFFMUUsNEJBQW1DLElBQVk7SUFDN0MsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBRkQsZ0RBRUM7QUFFRCxJQUFJLG1CQUFtQixHQUFHLENBQUMsQ0FBQztBQUU1Qix3QkFBK0IsaUJBQStEO0lBRTVGLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRTtRQUN0RCxPQUFPLElBQUksQ0FBQztLQUNiO0lBQ0QsSUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxDQUFDO0lBQ3hDLElBQUksR0FBRyxZQUFZLDRCQUFZLEVBQUU7UUFDL0IsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDO0tBQ2pCO0lBQ0QsSUFBSSxHQUFHLENBQUMsaUJBQWlCLENBQUMsRUFBRTtRQUMxQixPQUFPLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0tBQy9CO0lBQ0QsSUFBSSxVQUFVLEdBQUcsZ0JBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoQyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2hDLDZCQUE2QjtRQUM3QixVQUFVLEdBQUcsZUFBYSxtQkFBbUIsRUFBSSxDQUFDO1FBQ2xELEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLFVBQVUsQ0FBQztLQUNy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