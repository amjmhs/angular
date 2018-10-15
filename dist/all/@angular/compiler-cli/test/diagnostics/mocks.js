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
var core_1 = require("@angular/core");
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var typescript_symbols_1 = require("../../src/diagnostics/typescript_symbols");
var mocks_1 = require("../mocks");
var test_support_1 = require("../test_support");
function calculateAngularPath() {
    if (test_support_1.isInBazel()) {
        var support = test_support_1.setup();
        return path.join(support.basePath, 'node_modules/@angular/*');
    }
    else {
        var moduleFilename = module.filename.replace(/\\/g, '/');
        var distIndex = moduleFilename.indexOf('/dist/all');
        return moduleFilename.substr(0, distIndex) + '/packages/*';
    }
}
var realFiles = new Map();
var MockLanguageServiceHost = /** @class */ (function () {
    function MockLanguageServiceHost(scripts, files, currentDirectory) {
        if (currentDirectory === void 0) { currentDirectory = '/'; }
        this.scripts = scripts;
        this.assumedExist = new Set();
        this.options = {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            removeComments: false,
            noImplicitAny: false,
            skipLibCheck: true,
            skipDefaultLibCheck: true,
            strictNullChecks: true,
            baseUrl: currentDirectory,
            lib: ['lib.es2015.d.ts', 'lib.dom.d.ts'],
            paths: { '@angular/*': [calculateAngularPath()] }
        };
        this.context = new mocks_1.MockAotContext(currentDirectory, files);
    }
    MockLanguageServiceHost.prototype.getCompilationSettings = function () { return this.options; };
    MockLanguageServiceHost.prototype.getScriptFileNames = function () { return this.scripts; };
    MockLanguageServiceHost.prototype.getScriptVersion = function (fileName) { return '0'; };
    MockLanguageServiceHost.prototype.getScriptSnapshot = function (fileName) {
        var content = this.internalReadFile(fileName);
        if (content) {
            return ts.ScriptSnapshot.fromString(content);
        }
    };
    MockLanguageServiceHost.prototype.getCurrentDirectory = function () { return this.context.currentDirectory; };
    MockLanguageServiceHost.prototype.getDefaultLibFileName = function (options) { return 'lib.d.ts'; };
    MockLanguageServiceHost.prototype.readFile = function (fileName) { return this.internalReadFile(fileName); };
    MockLanguageServiceHost.prototype.readResource = function (fileName) { return Promise.resolve(''); };
    MockLanguageServiceHost.prototype.assumeFileExists = function (fileName) { this.assumedExist.add(fileName); };
    MockLanguageServiceHost.prototype.fileExists = function (fileName) {
        return this.assumedExist.has(fileName) || this.internalReadFile(fileName) != null;
    };
    MockLanguageServiceHost.prototype.internalReadFile = function (fileName) {
        var basename = path.basename(fileName);
        if (/^lib.*\.d\.ts$/.test(basename)) {
            var libPath = path.dirname(ts.getDefaultLibFilePath(this.getCompilationSettings()));
            fileName = path.join(libPath, basename);
        }
        if (fileName.startsWith('app/')) {
            fileName = path.join(this.context.currentDirectory, fileName);
        }
        if (this.context.fileExists(fileName)) {
            return this.context.readFile(fileName);
        }
        if (realFiles.has(fileName)) {
            return realFiles.get(fileName);
        }
        if (fs.existsSync(fileName)) {
            var content = fs.readFileSync(fileName, 'utf8');
            realFiles.set(fileName, content);
            return content;
        }
        return undefined;
    };
    return MockLanguageServiceHost;
}());
exports.MockLanguageServiceHost = MockLanguageServiceHost;
var staticSymbolCache = new compiler_1.StaticSymbolCache();
var summaryResolver = new compiler_1.AotSummaryResolver({
    loadSummary: function (filePath) { return null; },
    isSourceFile: function (sourceFilePath) { return true; },
    toSummaryFileName: function (sourceFilePath) { return sourceFilePath; },
    fromSummaryFileName: function (filePath) { return filePath; },
}, staticSymbolCache);
var DiagnosticContext = /** @class */ (function () {
    // tslint:enable
    function DiagnosticContext(service, program, checker, host) {
        this.service = service;
        this.program = program;
        this.checker = checker;
        this.host = host;
        this._errors = [];
    }
    DiagnosticContext.prototype.collectError = function (e, path) { this._errors.push({ e: e, path: path }); };
    Object.defineProperty(DiagnosticContext.prototype, "staticSymbolResolver", {
        get: function () {
            var _this = this;
            var result = this._staticSymbolResolver;
            if (!result) {
                result = this._staticSymbolResolver = new compiler_1.StaticSymbolResolver(this.host, staticSymbolCache, summaryResolver, function (e, filePath) { return _this.collectError(e, filePath); });
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiagnosticContext.prototype, "reflector", {
        get: function () {
            var _this = this;
            if (!this._reflector) {
                var ssr = this.staticSymbolResolver;
                var result = this._reflector = new compiler_1.StaticReflector(summaryResolver, ssr, [], [], function (e, filePath) { return _this.collectError(e, filePath); });
                this._reflector = result;
                return result;
            }
            return this._reflector;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiagnosticContext.prototype, "resolver", {
        get: function () {
            var _this = this;
            var result = this._resolver;
            if (!result) {
                var moduleResolver = new compiler_1.NgModuleResolver(this.reflector);
                var directiveResolver = new compiler_1.DirectiveResolver(this.reflector);
                var pipeResolver = new compiler_1.PipeResolver(this.reflector);
                var elementSchemaRegistry = new compiler_1.DomElementSchemaRegistry();
                var resourceLoader = new /** @class */ (function (_super) {
                    __extends(class_1, _super);
                    function class_1() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    class_1.prototype.get = function (url) { return Promise.resolve(''); };
                    return class_1;
                }(compiler_1.ResourceLoader));
                var urlResolver = compiler_1.createOfflineCompileUrlResolver();
                var htmlParser = new /** @class */ (function (_super) {
                    __extends(class_2, _super);
                    function class_2() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    class_2.prototype.parse = function (source, url, parseExpansionForms, interpolationConfig) {
                        if (parseExpansionForms === void 0) { parseExpansionForms = false; }
                        if (interpolationConfig === void 0) { interpolationConfig = compiler_1.DEFAULT_INTERPOLATION_CONFIG; }
                        return new compiler_1.ParseTreeResult([], []);
                    };
                    return class_2;
                }(compiler_1.HtmlParser));
                // This tracks the CompileConfig in codegen.ts. Currently these options
                // are hard-coded.
                var config = new compiler_1.CompilerConfig({ defaultEncapsulation: core_1.ViewEncapsulation.Emulated, useJit: false });
                var directiveNormalizer = new compiler_1.DirectiveNormalizer(resourceLoader, urlResolver, htmlParser, config);
                result = this._resolver = new compiler_1.CompileMetadataResolver(config, htmlParser, moduleResolver, directiveResolver, pipeResolver, new compiler_1.JitSummaryResolver(), elementSchemaRegistry, directiveNormalizer, new core_1.ɵConsole(), staticSymbolCache, this.reflector, function (error, type) { return _this.collectError(error, type && type.filePath); });
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DiagnosticContext.prototype, "analyzedModules", {
        get: function () {
            var analyzedModules = this._analyzedModules;
            if (!analyzedModules) {
                var analyzeHost = { isSourceFile: function (filePath) { return true; } };
                var programFiles = this.program.getSourceFiles().map(function (sf) { return sf.fileName; });
                analyzedModules = this._analyzedModules =
                    compiler_1.analyzeNgModules(programFiles, analyzeHost, this.staticSymbolResolver, this.resolver);
            }
            return analyzedModules;
        },
        enumerable: true,
        configurable: true
    });
    DiagnosticContext.prototype.getStaticSymbol = function (path, name) {
        return staticSymbolCache.get(path, name);
    };
    return DiagnosticContext;
}());
exports.DiagnosticContext = DiagnosticContext;
function compileTemplate(context, type, template) {
    // Compiler the template string.
    var resolvedMetadata = context.resolver.getNonNormalizedDirectiveMetadata(type);
    var metadata = resolvedMetadata && resolvedMetadata.metadata;
    if (metadata) {
        var rawHtmlParser = new compiler_1.HtmlParser();
        var htmlParser = new compiler_1.I18NHtmlParser(rawHtmlParser);
        var expressionParser = new compiler_1.Parser(new compiler_1.Lexer());
        var config = new compiler_1.CompilerConfig();
        var parser = new compiler_1.TemplateParser(config, context.reflector, expressionParser, new compiler_1.DomElementSchemaRegistry(), htmlParser, null, []);
        var htmlResult = htmlParser.parse(template, '', true);
        var analyzedModules = context.analyzedModules;
        // let errors: Diagnostic[]|undefined = undefined;
        var ngModule = analyzedModules.ngModuleByPipeOrDirective.get(type);
        if (ngModule) {
            var resolvedDirectives = ngModule.transitiveModule.directives.map(function (d) { return context.resolver.getNonNormalizedDirectiveMetadata(d.reference); });
            var directives = removeMissing(resolvedDirectives).map(function (d) { return d.metadata.toSummary(); });
            var pipes = ngModule.transitiveModule.pipes.map(function (p) { return context.resolver.getOrLoadPipeMetadata(p.reference).toSummary(); });
            var schemas = ngModule.schemas;
            var parseResult = parser.tryParseHtml(htmlResult, metadata, directives, pipes, schemas);
            return {
                htmlAst: htmlResult.rootNodes,
                templateAst: parseResult.templateAst,
                directive: metadata, directives: directives, pipes: pipes,
                parseErrors: parseResult.errors, expressionParser: expressionParser
            };
        }
    }
}
function getDiagnosticTemplateInfo(context, type, templateFile, template) {
    var compiledTemplate = compileTemplate(context, type, template);
    if (compiledTemplate && compiledTemplate.templateAst) {
        var members = typescript_symbols_1.getClassMembers(context.program, context.checker, type);
        if (members) {
            var sourceFile_1 = context.program.getSourceFile(type.filePath);
            if (sourceFile_1) {
                var query = typescript_symbols_1.getSymbolQuery(context.program, context.checker, sourceFile_1, function () { return typescript_symbols_1.getPipesTable(sourceFile_1, context.program, context.checker, compiledTemplate.pipes); });
                return {
                    fileName: templateFile,
                    offset: 0, query: query, members: members,
                    htmlAst: compiledTemplate.htmlAst,
                    templateAst: compiledTemplate.templateAst
                };
            }
        }
    }
}
exports.getDiagnosticTemplateInfo = getDiagnosticTemplateInfo;
function removeMissing(values) {
    return values.filter(function (e) { return !!e; });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9ja3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvdGVzdC9kaWFnbm9zdGljcy9tb2Nrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCw4Q0FBNmlCO0FBQzdpQixzQ0FBcUU7QUFDckUsdUJBQXlCO0FBQ3pCLDJCQUE2QjtBQUM3QiwrQkFBaUM7QUFHakMsK0VBQWtJO0FBQ2xJLGtDQUFtRDtBQUNuRCxnREFBaUQ7QUFFakQ7SUFDRSxJQUFJLHdCQUFTLEVBQUUsRUFBRTtRQUNmLElBQU0sT0FBTyxHQUFHLG9CQUFLLEVBQUUsQ0FBQztRQUN4QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO0tBQy9EO1NBQU07UUFDTCxJQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDM0QsSUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN0RCxPQUFPLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLGFBQWEsQ0FBQztLQUM1RDtBQUNILENBQUM7QUFFRCxJQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztBQUU1QztJQUtFLGlDQUFvQixPQUFpQixFQUFFLEtBQWdCLEVBQUUsZ0JBQThCO1FBQTlCLGlDQUFBLEVBQUEsc0JBQThCO1FBQW5FLFlBQU8sR0FBUCxPQUFPLENBQVU7UUFGN0IsaUJBQVksR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO1FBR3ZDLElBQUksQ0FBQyxPQUFPLEdBQUc7WUFDYixNQUFNLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxHQUFHO1lBQzNCLE1BQU0sRUFBRSxF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