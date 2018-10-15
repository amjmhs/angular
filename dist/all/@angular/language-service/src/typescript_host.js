"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var language_services_1 = require("@angular/compiler-cli/src/language_services");
var core_1 = require("@angular/core");
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var language_service_1 = require("./language_service");
var reflector_host_1 = require("./reflector_host");
/**
 * Create a `LanguageServiceHost`
 */
function createLanguageServiceFromTypescript(host, service) {
    var ngHost = new TypeScriptServiceHost(host, service);
    var ngServer = language_service_1.createLanguageService(ngHost);
    ngHost.setSite(ngServer);
    return ngServer;
}
exports.createLanguageServiceFromTypescript = createLanguageServiceFromTypescript;
/**
 * The language service never needs the normalized versions of the metadata. To avoid parsing
 * the content and resolving references, return an empty file. This also allows normalizing
 * template that are syntatically incorrect which is required to provide completions in
 * syntactically incorrect templates.
 */
var DummyHtmlParser = /** @class */ (function (_super) {
    __extends(DummyHtmlParser, _super);
    function DummyHtmlParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DummyHtmlParser.prototype.parse = function (source, url, parseExpansionForms, interpolationConfig) {
        if (parseExpansionForms === void 0) { parseExpansionForms = false; }
        if (interpolationConfig === void 0) { interpolationConfig = compiler_1.DEFAULT_INTERPOLATION_CONFIG; }
        return new compiler_1.ParseTreeResult([], []);
    };
    return DummyHtmlParser;
}(compiler_1.HtmlParser));
exports.DummyHtmlParser = DummyHtmlParser;
/**
 * Avoid loading resources in the language servcie by using a dummy loader.
 */
var DummyResourceLoader = /** @class */ (function (_super) {
    __extends(DummyResourceLoader, _super);
    function DummyResourceLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DummyResourceLoader.prototype.get = function (url) { return Promise.resolve(''); };
    return DummyResourceLoader;
}(compiler_1.ResourceLoader));
exports.DummyResourceLoader = DummyResourceLoader;
/**
 * An implementation of a `LanguageServiceHost` for a TypeScript project.
 *
 * The `TypeScriptServiceHost` implements the Angular `LanguageServiceHost` using
 * the TypeScript language services.
 *
 * @experimental
 */
var TypeScriptServiceHost = /** @class */ (function () {
    function TypeScriptServiceHost(host, tsService) {
        this.host = host;
        this.tsService = tsService;
        this._staticSymbolCache = new compiler_1.StaticSymbolCache();
        this._typeCache = [];
        this.modulesOutOfDate = true;
        this.fileVersions = new Map();
    }
    TypeScriptServiceHost.prototype.setSite = function (service) { this.service = service; };
    Object.defineProperty(TypeScriptServiceHost.prototype, "resolver", {
        /**
         * Angular LanguageServiceHost implementation
         */
        get: function () {
            var _this = this;
            this.validate();
            var result = this._resolver;
            if (!result) {
                var moduleResolver = new compiler_1.NgModuleResolver(this.reflector);
                var directiveResolver = new compiler_1.DirectiveResolver(this.reflector);
                var pipeResolver = new compiler_1.PipeResolver(this.reflector);
                var elementSchemaRegistry = new compiler_1.DomElementSchemaRegistry();
                var resourceLoader = new DummyResourceLoader();
                var urlResolver = compiler_1.createOfflineCompileUrlResolver();
                var htmlParser = new DummyHtmlParser();
                // This tracks the CompileConfig in codegen.ts. Currently these options
                // are hard-coded.
                var config = new compiler_1.CompilerConfig({ defaultEncapsulation: core_1.ViewEncapsulation.Emulated, useJit: false });
                var directiveNormalizer = new compiler_1.DirectiveNormalizer(resourceLoader, urlResolver, htmlParser, config);
                result = this._resolver = new compiler_1.CompileMetadataResolver(config, htmlParser, moduleResolver, directiveResolver, pipeResolver, new compiler_1.JitSummaryResolver(), elementSchemaRegistry, directiveNormalizer, new core_1.ɵConsole(), this._staticSymbolCache, this.reflector, function (error, type) { return _this.collectError(error, type && type.filePath); });
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    TypeScriptServiceHost.prototype.getTemplateReferences = function () {
        this.ensureTemplateMap();
        return this.templateReferences || [];
    };
    TypeScriptServiceHost.prototype.getTemplateAt = function (fileName, position) {
        var sourceFile = this.getSourceFile(fileName);
        if (sourceFile) {
            this.context = sourceFile.fileName;
            var node = this.findNode(sourceFile, position);
            if (node) {
                return this.getSourceFromNode(fileName, this.host.getScriptVersion(sourceFile.fileName), node);
            }
        }
        else {
            this.ensureTemplateMap();
            // TODO: Cannocalize the file?
            var componentType = this.fileToComponent.get(fileName);
            if (componentType) {
                return this.getSourceFromType(fileName, this.host.getScriptVersion(fileName), componentType);
            }
        }
        return undefined;
    };
    TypeScriptServiceHost.prototype.getAnalyzedModules = function () {
        this.updateAnalyzedModules();
        return this.ensureAnalyzedModules();
    };
    TypeScriptServiceHost.prototype.ensureAnalyzedModules = function () {
        var analyzedModules = this.analyzedModules;
        if (!analyzedModules) {
            if (this.host.getScriptFileNames().length === 0) {
                analyzedModules = {
                    files: [],
                    ngModuleByPipeOrDirective: new Map(),
                    ngModules: [],
                };
            }
            else {
                var analyzeHost = { isSourceFile: function (filePath) { return true; } };
                var programFiles = this.program.getSourceFiles().map(function (sf) { return sf.fileName; });
                analyzedModules =
                    compiler_1.analyzeNgModules(programFiles, analyzeHost, this.staticSymbolResolver, this.resolver);
            }
            this.analyzedModules = analyzedModules;
        }
        return analyzedModules;
    };
    TypeScriptServiceHost.prototype.getTemplates = function (fileName) {
        var _this = this;
        this.ensureTemplateMap();
        var componentType = this.fileToComponent.get(fileName);
        if (componentType) {
            var templateSource = this.getTemplateAt(fileName, 0);
            if (templateSource) {
                return [templateSource];
            }
        }
        else {
            var version_1 = this.host.getScriptVersion(fileName);
            var result_1 = [];
            // Find each template string in the file
            var visit_1 = function (child) {
                var templateSource = _this.getSourceFromNode(fileName, version_1, child);
                if (templateSource) {
                    result_1.push(templateSource);
                }
                else {
                    ts.forEachChild(child, visit_1);
                }
            };
            var sourceFile = this.getSourceFile(fileName);
            if (sourceFile) {
                this.context = sourceFile.path || sourceFile.fileName;
                ts.forEachChild(sourceFile, visit_1);
            }
            return result_1.length ? result_1 : undefined;
        }
    };
    TypeScriptServiceHost.prototype.getDeclarations = function (fileName) {
        var _this = this;
        var result = [];
        var sourceFile = this.getSourceFile(fileName);
        if (sourceFile) {
            var visit_2 = function (child) {
                var declaration = _this.getDeclarationFromNode(sourceFile, child);
                if (declaration) {
                    result.push(declaration);
                }
                else {
                    ts.forEachChild(child, visit_2);
                }
            };
            ts.forEachChild(sourceFile, visit_2);
        }
        return result;
    };
    TypeScriptServiceHost.prototype.getSourceFile = function (fileName) {
        return this.tsService.getProgram().getSourceFile(fileName);
    };
    TypeScriptServiceHost.prototype.updateAnalyzedModules = function () {
        this.validate();
        if (this.modulesOutOfDate) {
            this.analyzedModules = null;
            this._reflector = null;
            this.templateReferences = null;
            this.fileToComponent = null;
            this.ensureAnalyzedModules();
            this.modulesOutOfDate = false;
        }
    };
    Object.defineProperty(TypeScriptServiceHost.prototype, "program", {
        get: function () { return this.tsService.getProgram(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeScriptServiceHost.prototype, "checker", {
        get: function () {
            var checker = this._checker;
            if (!checker) {
                checker = this._checker = this.program.getTypeChecker();
            }
            return checker;
        },
        enumerable: true,
        configurable: true
    });
    TypeScriptServiceHost.prototype.validate = function () {
        var _this = this;
        var program = this.program;
        if (this.lastProgram !== program) {
            // Invalidate file that have changed in the static symbol resolver
            var invalidateFile = function (fileName) {
                return _this._staticSymbolResolver.invalidateFile(fileName);
            };
            this.clearCaches();
            var seen_1 = new Set();
            for (var _i = 0, _a = this.program.getSourceFiles(); _i < _a.length; _i++) {
                var sourceFile = _a[_i];
                var fileName = sourceFile.fileName;
                seen_1.add(fileName);
                var version = this.host.getScriptVersion(fileName);
                var lastVersion = this.fileVersions.get(fileName);
                if (version != lastVersion) {
                    this.fileVersions.set(fileName, version);
                    if (this._staticSymbolResolver) {
                        invalidateFile(fileName);
                    }
                }
            }
            // Remove file versions that are no longer in the file and invalidate them.
            var missing = Array.from(this.fileVersions.keys()).filter(function (f) { return !seen_1.has(f); });
            missing.forEach(function (f) { return _this.fileVersions.delete(f); });
            if (this._staticSymbolResolver) {
                missing.forEach(invalidateFile);
            }
            this.lastProgram = program;
        }
    };
    TypeScriptServiceHost.prototype.clearCaches = function () {
        this._checker = null;
        this._typeCache = [];
        this._resolver = null;
        this.collectedErrors = null;
        this.modulesOutOfDate = true;
    };
    TypeScriptServiceHost.prototype.ensureTemplateMap = function () {
        if (!this.fileToComponent || !this.templateReferences) {
            var fileToComponent = new Map();
            var templateReference = [];
            var ngModuleSummary = this.getAnalyzedModules();
            var urlResolver = compiler_1.createOfflineCompileUrlResolver();
            for (var _i = 0, _a = ngModuleSummary.ngModules; _i < _a.length; _i++) {
                var module_1 = _a[_i];
                for (var _b = 0, _c = module_1.declaredDirectives; _b < _c.length; _b++) {
                    var directive = _c[_b];
                    var metadata = this.resolver.getNonNormalizedDirectiveMetadata(directive.reference).metadata;
                    if (metadata.isComponent && metadata.template && metadata.template.templateUrl) {
                        var templateName = urlResolver.resolve(this.reflector.componentModuleUrl(directive.reference), metadata.template.templateUrl);
                        fileToComponent.set(templateName, directive.reference);
                        templateReference.push(templateName);
                    }
                }
            }
            this.fileToComponent = fileToComponent;
            this.templateReferences = templateReference;
        }
    };
    TypeScriptServiceHost.prototype.getSourceFromDeclaration = function (fileName, version, source, span, type, declaration, node, sourceFile) {
        var queryCache = undefined;
        var t = this;
        if (declaration) {
            return {
                version: version,
                source: source,
                span: span,
                type: type,
                get members() {
                    return language_services_1.getClassMembersFromDeclaration(t.program, t.checker, sourceFile, declaration);
                },
                get query() {
                    if (!queryCache) {
                        var pipes_1 = t.service.getPipesAt(fileName, node.getStart());
                        queryCache = language_services_1.getSymbolQuery(t.program, t.checker, sourceFile, function () { return language_services_1.getPipesTable(sourceFile, t.program, t.checker, pipes_1); });
                    }
                    return queryCache;
                }
            };
        }
    };
    TypeScriptServiceHost.prototype.getSourceFromNode = function (fileName, version, node) {
        var result = undefined;
        var t = this;
        switch (node.kind) {
            case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
            case ts.SyntaxKind.StringLiteral:
                var _a = this.getTemplateClassDeclFromNode(node), declaration = _a[0], decorator = _a[1];
                if (declaration && declaration.name) {
                    var sourceFile = this.getSourceFile(fileName);
                    if (sourceFile) {
                        return this.getSourceFromDeclaration(fileName, version, this.stringOf(node) || '', shrink(spanOf(node)), this.reflector.getStaticSymbol(sourceFile.fileName, declaration.name.text), declaration, node, sourceFile);
                    }
                }
                break;
        }
        return result;
    };
    TypeScriptServiceHost.prototype.getSourceFromType = function (fileName, version, type) {
        var result = undefined;
        var declaration = this.getTemplateClassFromStaticSymbol(type);
        if (declaration) {
            var snapshot = this.host.getScriptSnapshot(fileName);
            if (snapshot) {
                var source = snapshot.getText(0, snapshot.getLength());
                result = this.getSourceFromDeclaration(fileName, version, source, { start: 0, end: source.length }, type, declaration, declaration, declaration.getSourceFile());
            }
        }
        return result;
    };
    Object.defineProperty(TypeScriptServiceHost.prototype, "reflectorHost", {
        get: function () {
            var _this = this;
            var result = this._reflectorHost;
            if (!result) {
                if (!this.context) {
                    // Make up a context by finding the first script and using that as the base dir.
                    var scriptFileNames = this.host.getScriptFileNames();
                    if (0 === scriptFileNames.length) {
                        throw new Error('Internal error: no script file names found');
                    }
                    this.context = scriptFileNames[0];
                }
                // Use the file context's directory as the base directory.
                // The host's getCurrentDirectory() is not reliable as it is always "" in
                // tsserver. We don't need the exact base directory, just one that contains
                // a source file.
                var source = this.tsService.getProgram().getSourceFile(this.context);
                if (!source) {
                    throw new Error('Internal error: no context could be determined');
                }
                var tsConfigPath = findTsConfig(source.fileName);
                var basePath = path.dirname(tsConfigPath || this.context);
                var options = { basePath: basePath, genDir: basePath };
                var compilerOptions = this.host.getCompilationSettings();
                if (compilerOptions && compilerOptions.baseUrl) {
                    options.baseUrl = compilerOptions.baseUrl;
                }
                if (compilerOptions && compilerOptions.paths) {
                    options.paths = compilerOptions.paths;
                }
                result = this._reflectorHost =
                    new reflector_host_1.ReflectorHost(function () { return _this.tsService.getProgram(); }, this.host, options);
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    TypeScriptServiceHost.prototype.collectError = function (error, filePath) {
        if (filePath) {
            var errorMap = this.collectedErrors;
            if (!errorMap || !this.collectedErrors) {
                errorMap = this.collectedErrors = new Map();
            }
            var errors = errorMap.get(filePath);
            if (!errors) {
                errors = [];
                this.collectedErrors.set(filePath, errors);
            }
            errors.push(error);
        }
    };
    Object.defineProperty(TypeScriptServiceHost.prototype, "staticSymbolResolver", {
        get: function () {
            var _this = this;
            var result = this._staticSymbolResolver;
            if (!result) {
                this._summaryResolver = new compiler_1.AotSummaryResolver({
                    loadSummary: function (filePath) { return null; },
                    isSourceFile: function (sourceFilePath) { return true; },
                    toSummaryFileName: function (sourceFilePath) { return sourceFilePath; },
                    fromSummaryFileName: function (filePath) { return filePath; },
                }, this._staticSymbolCache);
                result = this._staticSymbolResolver = new compiler_1.StaticSymbolResolver(this.reflectorHost, this._staticSymbolCache, this._summaryResolver, function (e, filePath) { return _this.collectError(e, filePath); });
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeScriptServiceHost.prototype, "reflector", {
        get: function () {
            var _this = this;
            var result = this._reflector;
            if (!result) {
                var ssr = this.staticSymbolResolver;
                result = this._reflector = new compiler_1.StaticReflector(this._summaryResolver, ssr, [], [], function (e, filePath) { return _this.collectError(e, filePath); });
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    TypeScriptServiceHost.prototype.getTemplateClassFromStaticSymbol = function (type) {
        var source = this.getSourceFile(type.filePath);
        if (source) {
            var declarationNode = ts.forEachChild(source, function (child) {
                if (child.kind === ts.SyntaxKind.ClassDeclaration) {
                    var classDeclaration = child;
                    if (classDeclaration.name != null && classDeclaration.name.text === type.name) {
                        return classDeclaration;
                    }
                }
            });
            return declarationNode;
        }
        return undefined;
    };
    /**
     * Given a template string node, see if it is an Angular template string, and if so return the
     * containing class.
     */
    TypeScriptServiceHost.prototype.getTemplateClassDeclFromNode = function (currentToken) {
        // Verify we are in a 'template' property assignment, in an object literal, which is an call
        // arg, in a decorator
        var parentNode = currentToken.parent; // PropertyAssignment
        if (!parentNode) {
            return TypeScriptServiceHost.missingTemplate;
        }
        if (parentNode.kind !== ts.SyntaxKind.PropertyAssignment) {
            return TypeScriptServiceHost.missingTemplate;
        }
        else {
            // TODO: Is this different for a literal, i.e. a quoted property name like "template"?
            if (parentNode.name.text !== 'template') {
                return TypeScriptServiceHost.missingTemplate;
            }
        }
        parentNode = parentNode.parent; // ObjectLiteralExpression
        if (!parentNode || parentNode.kind !== ts.SyntaxKind.ObjectLiteralExpression) {
            return TypeScriptServiceHost.missingTemplate;
        }
        parentNode = parentNode.parent; // CallExpression
        if (!parentNode || parentNode.kind !== ts.SyntaxKind.CallExpression) {
            return TypeScriptServiceHost.missingTemplate;
        }
        var callTarget = parentNode.expression;
        var decorator = parentNode.parent; // Decorator
        if (!decorator || decorator.kind !== ts.SyntaxKind.Decorator) {
            return TypeScriptServiceHost.missingTemplate;
        }
        var declaration = decorator.parent; // ClassDeclaration
        if (!declaration || declaration.kind !== ts.SyntaxKind.ClassDeclaration) {
            return TypeScriptServiceHost.missingTemplate;
        }
        return [declaration, callTarget];
    };
    TypeScriptServiceHost.prototype.getCollectedErrors = function (defaultSpan, sourceFile) {
        var errors = (this.collectedErrors && this.collectedErrors.get(sourceFile.fileName));
        return (errors && errors.map(function (e) {
            var line = e.line || (e.position && e.position.line);
            var column = e.column || (e.position && e.position.column);
            var span = spanAt(sourceFile, line, column) || defaultSpan;
            if (compiler_1.isFormattedError(e)) {
                return errorToDiagnosticWithChain(e, span);
            }
            return { message: e.message, span: span };
        })) ||
            [];
    };
    TypeScriptServiceHost.prototype.getDeclarationFromNode = function (sourceFile, node) {
        if (node.kind == ts.SyntaxKind.ClassDeclaration && node.decorators &&
            node.name) {
            for (var _i = 0, _a = node.decorators; _i < _a.length; _i++) {
                var decorator = _a[_i];
                if (decorator.expression && decorator.expression.kind == ts.SyntaxKind.CallExpression) {
                    var classDeclaration = node;
                    if (classDeclaration.name) {
                        var call = decorator.expression;
                        var target = call.expression;
                        var type = this.checker.getTypeAtLocation(target);
                        if (type) {
                            var staticSymbol = this.reflector.getStaticSymbol(sourceFile.fileName, classDeclaration.name.text);
                            try {
                                if (this.resolver.isDirective(staticSymbol)) {
                                    var metadata = this.resolver.getNonNormalizedDirectiveMetadata(staticSymbol).metadata;
                                    var declarationSpan = spanOf(target);
                                    return {
                                        type: staticSymbol,
                                        declarationSpan: declarationSpan,
                                        metadata: metadata,
                                        errors: this.getCollectedErrors(declarationSpan, sourceFile)
                                    };
                                }
                            }
                            catch (e) {
                                if (e.message) {
                                    this.collectError(e, sourceFile.fileName);
                                    var declarationSpan = spanOf(target);
                                    return {
                                        type: staticSymbol,
                                        declarationSpan: declarationSpan,
                                        errors: this.getCollectedErrors(declarationSpan, sourceFile)
                                    };
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    TypeScriptServiceHost.prototype.stringOf = function (node) {
        switch (node.kind) {
            case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
                return node.text;
            case ts.SyntaxKind.StringLiteral:
                return node.text;
        }
    };
    TypeScriptServiceHost.prototype.findNode = function (sourceFile, position) {
        function find(node) {
            if (position >= node.getStart() && position < node.getEnd()) {
                return ts.forEachChild(node, find) || node;
            }
        }
        return find(sourceFile);
    };
    TypeScriptServiceHost.missingTemplate = [undefined, undefined];
    return TypeScriptServiceHost;
}());
exports.TypeScriptServiceHost = TypeScriptServiceHost;
function findTsConfig(fileName) {
    var dir = path.dirname(fileName);
    while (fs.existsSync(dir)) {
        var candidate = path.join(dir, 'tsconfig.json');
        if (fs.existsSync(candidate))
            return candidate;
        var parentDir = path.dirname(dir);
        if (parentDir === dir)
            break;
        dir = parentDir;
    }
}
function spanOf(node) {
    return { start: node.getStart(), end: node.getEnd() };
}
function shrink(span, offset) {
    if (offset == null)
        offset = 1;
    return { start: span.start + offset, end: span.end - offset };
}
function spanAt(sourceFile, line, column) {
    if (line != null && column != null) {
        var position_1 = ts.getPositionOfLineAndCharacter(sourceFile, line, column);
        var findChild = function findChild(node) {
            if (node.kind > ts.SyntaxKind.LastToken && node.pos <= position_1 && node.end > position_1) {
                var betterNode = ts.forEachChild(node, findChild);
                return betterNode || node;
            }
        };
        var node = ts.forEachChild(sourceFile, findChild);
        if (node) {
            return { start: node.getStart(), end: node.getEnd() };
        }
    }
}
function chainedMessage(chain, indent) {
    if (indent === void 0) { indent = ''; }
    return indent + chain.message + (chain.next ? chainedMessage(chain.next, indent + '  ') : '');
}
var DiagnosticMessageChainImpl = /** @class */ (function () {
    function DiagnosticMessageChainImpl(message, next) {
        this.message = message;
        this.next = next;
    }
    DiagnosticMessageChainImpl.prototype.toString = function () { return chainedMessage(this); };
    return DiagnosticMessageChainImpl;
}());
function convertChain(chain) {
    return { message: chain.message, next: chain.next ? convertChain(chain.next) : undefined };
}
function errorToDiagnosticWithChain(error, span) {
    return { message: error.chain ? convertChain(error.chain) : error.message, span: span };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXNjcmlwdF9ob3N0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbGFuZ3VhZ2Utc2VydmljZS9zcmMvdHlwZXNjcmlwdF9ob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILDhDQUE0Z0I7QUFDNWdCLGlGQUEySTtBQUMzSSxzQ0FBcUU7QUFDckUsdUJBQXlCO0FBQ3pCLDJCQUE2QjtBQUM3QiwrQkFBaUM7QUFFakMsdURBQXlEO0FBQ3pELG1EQUErQztBQU0vQzs7R0FFRztBQUNILDZDQUNJLElBQTRCLEVBQUUsT0FBMkI7SUFDM0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDeEQsSUFBTSxRQUFRLEdBQUcsd0NBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN6QixPQUFPLFFBQVEsQ0FBQztBQUNsQixDQUFDO0FBTkQsa0ZBTUM7QUFFRDs7Ozs7R0FLRztBQUNIO0lBQXFDLG1DQUFVO0lBQS9DOztJQU1BLENBQUM7SUFMQywrQkFBSyxHQUFMLFVBQ0ksTUFBYyxFQUFFLEdBQVcsRUFBRSxtQkFBb0MsRUFDakUsbUJBQXVFO1FBRDFDLG9DQUFBLEVBQUEsMkJBQW9DO1FBQ2pFLG9DQUFBLEVBQUEsc0JBQTJDLHVDQUE0QjtRQUN6RSxPQUFPLElBQUksMEJBQWUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQU5ELENBQXFDLHFCQUFVLEdBTTlDO0FBTlksMENBQWU7QUFRNUI7O0dBRUc7QUFDSDtJQUF5Qyx1Q0FBYztJQUF2RDs7SUFFQSxDQUFDO0lBREMsaUNBQUcsR0FBSCxVQUFJLEdBQVcsSUFBcUIsT0FBTyxPQUFPLENBQUMs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