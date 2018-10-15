"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var compiler_1 = require("@angular/compiler");
var compiler_reflector_1 = require("./compiler_reflector");
exports.ERROR_COLLECTOR_TOKEN = new core_1.InjectionToken('ErrorCollector');
/**
 * A default provider for {@link PACKAGE_ROOT_URL} that maps to '/'.
 */
exports.DEFAULT_PACKAGE_URL_PROVIDER = {
    provide: core_1.PACKAGE_ROOT_URL,
    useValue: '/'
};
var _NO_RESOURCE_LOADER = {
    get: function (url) {
        throw new Error("No ResourceLoader implementation has been provided. Can't read the url \"" + url + "\"");
    }
};
var baseHtmlParser = new core_1.InjectionToken('HtmlParser');
var CompilerImpl = /** @class */ (function () {
    function CompilerImpl(injector, _metadataResolver, templateParser, styleCompiler, viewCompiler, ngModuleCompiler, summaryResolver, compileReflector, compilerConfig, console) {
        this._metadataResolver = _metadataResolver;
        this._delegate = new compiler_1.JitCompiler(_metadataResolver, templateParser, styleCompiler, viewCompiler, ngModuleCompiler, summaryResolver, compileReflector, compilerConfig, console, this.getExtraNgModuleProviders.bind(this));
        this.injector = injector;
    }
    CompilerImpl.prototype.getExtraNgModuleProviders = function () {
        return [this._metadataResolver.getProviderMetadata(new compiler_1.ProviderMeta(core_1.Compiler, { useValue: this }))];
    };
    CompilerImpl.prototype.compileModuleSync = function (moduleType) {
        return this._delegate.compileModuleSync(moduleType);
    };
    CompilerImpl.prototype.compileModuleAsync = function (moduleType) {
        return this._delegate.compileModuleAsync(moduleType);
    };
    CompilerImpl.prototype.compileModuleAndAllComponentsSync = function (moduleType) {
        var result = this._delegate.compileModuleAndAllComponentsSync(moduleType);
        return {
            ngModuleFactory: result.ngModuleFactory,
            componentFactories: result.componentFactories,
        };
    };
    CompilerImpl.prototype.compileModuleAndAllComponentsAsync = function (moduleType) {
        return this._delegate.compileModuleAndAllComponentsAsync(moduleType)
            .then(function (result) { return ({
            ngModuleFactory: result.ngModuleFactory,
            componentFactories: result.componentFactories,
        }); });
    };
    CompilerImpl.prototype.loadAotSummaries = function (summaries) { this._delegate.loadAotSummaries(summaries); };
    CompilerImpl.prototype.hasAotSummary = function (ref) { return this._delegate.hasAotSummary(ref); };
    CompilerImpl.prototype.getComponentFactory = function (component) {
        return this._delegate.getComponentFactory(component);
    };
    CompilerImpl.prototype.clearCache = function () { this._delegate.clearCache(); };
    CompilerImpl.prototype.clearCacheFor = function (type) { this._delegate.clearCacheFor(type); };
    CompilerImpl.prototype.getModuleId = function (moduleType) {
        var meta = this._metadataResolver.getNgModuleMetadata(moduleType);
        return meta && meta.id || undefined;
    };
    return CompilerImpl;
}());
exports.CompilerImpl = CompilerImpl;
/**
 * A set of providers that provide `JitCompiler` and its dependencies to use for
 * template compilation.
 */
exports.COMPILER_PROVIDERS = [
    { provide: compiler_1.CompileReflector, useValue: new compiler_reflector_1.JitReflector() },
    { provide: compiler_1.ResourceLoader, useValue: _NO_RESOURCE_LOADER },
    { provide: compiler_1.JitSummaryResolver, deps: [] },
    { provide: compiler_1.SummaryResolver, useExisting: compiler_1.JitSummaryResolver },
    { provide: core_1.ɵConsole, deps: [] },
    { provide: compiler_1.Lexer, deps: [] },
    { provide: compiler_1.Parser, deps: [compiler_1.Lexer] },
    {
        provide: baseHtmlParser,
        useClass: compiler_1.HtmlParser,
        deps: [],
    },
    {
        provide: compiler_1.I18NHtmlParser,
        useFactory: function (parser, translations, format, config, console) {
            translations = translations || '';
            var missingTranslation = translations ? config.missingTranslation : core_1.MissingTranslationStrategy.Ignore;
            return new compiler_1.I18NHtmlParser(parser, translations, format, missingTranslation, console);
        },
        deps: [
            baseHtmlParser,
            [new core_1.Optional(), new core_1.Inject(core_1.TRANSLATIONS)],
            [new core_1.Optional(), new core_1.Inject(core_1.TRANSLATIONS_FORMAT)],
            [compiler_1.CompilerConfig],
            [core_1.ɵConsole],
        ]
    },
    {
        provide: compiler_1.HtmlParser,
        useExisting: compiler_1.I18NHtmlParser,
    },
    {
        provide: compiler_1.TemplateParser, deps: [compiler_1.CompilerConfig, compiler_1.CompileReflector,
            compiler_1.Parser, compiler_1.ElementSchemaRegistry,
            compiler_1.I18NHtmlParser, core_1.ɵConsole]
    },
    { provide: compiler_1.DirectiveNormalizer, deps: [compiler_1.ResourceLoader, compiler_1.UrlResolver, compiler_1.HtmlParser, compiler_1.CompilerConfig] },
    { provide: compiler_1.CompileMetadataResolver, deps: [compiler_1.CompilerConfig, compiler_1.HtmlParser, compiler_1.NgModuleResolver,
            compiler_1.DirectiveResolver, compiler_1.PipeResolver,
            compiler_1.SummaryResolver,
            compiler_1.ElementSchemaRegistry,
            compiler_1.DirectiveNormalizer, core_1.ɵConsole,
            [core_1.Optional, compiler_1.StaticSymbolCache],
            compiler_1.CompileReflector,
            [core_1.Optional, exports.ERROR_COLLECTOR_TOKEN]] },
    exports.DEFAULT_PACKAGE_URL_PROVIDER,
    { provide: compiler_1.StyleCompiler, deps: [compiler_1.UrlResolver] },
    { provide: compiler_1.ViewCompiler, deps: [compiler_1.CompileReflector] },
    { provide: compiler_1.NgModuleCompiler, deps: [compiler_1.CompileReflector] },
    { provide: compiler_1.CompilerConfig, useValue: new compiler_1.CompilerConfig() },
    { provide: core_1.Compiler, useClass: CompilerImpl, deps: [core_1.Injector, compiler_1.CompileMetadataResolver,
            compiler_1.TemplateParser, compiler_1.StyleCompiler,
            compiler_1.ViewCompiler, compiler_1.NgModuleCompiler,
            compiler_1.SummaryResolver, compiler_1.CompileReflector, compiler_1.CompilerConfig,
            core_1.ɵConsole] },
    { provide: compiler_1.DomElementSchemaRegistry, deps: [] },
    { provide: compiler_1.ElementSchemaRegistry, useExisting: compiler_1.DomElementSchemaRegistry },
    { provide: compiler_1.UrlResolver, deps: [core_1.PACKAGE_ROOT_URL] },
    { provide: compiler_1.DirectiveResolver, deps: [compiler_1.CompileReflector] },
    { provide: compiler_1.PipeResolver, deps: [compiler_1.CompileReflector] },
    { provide: compiler_1.NgModuleResolver, deps: [compiler_1.CompileReflector] },
];
/**
 * @experimental
 */
var JitCompilerFactory = /** @class */ (function () {
    /* @internal */
    function JitCompilerFactory(defaultOptions) {
        var compilerOptions = {
            useJit: true,
            defaultEncapsulation: core_1.ViewEncapsulation.Emulated,
            missingTranslation: core_1.MissingTranslationStrategy.Warning,
        };
        this._defaultOptions = [compilerOptions].concat(defaultOptions);
    }
    JitCompilerFactory.prototype.createCompiler = function (options) {
        if (options === void 0) { options = []; }
        var opts = _mergeOptions(this._defaultOptions.concat(options));
        var injector = core_1.Injector.create([
            exports.COMPILER_PROVIDERS, {
                provide: compiler_1.CompilerConfig,
                useFactory: function () {
                    return new compiler_1.CompilerConfig({
                        // let explicit values from the compiler options overwrite options
                        // from the app providers
                        useJit: opts.useJit,
                        jitDevMode: core_1.isDevMode(),
                        // let explicit values from the compiler options overwrite options
                        // from the app providers
                        defaultEncapsulation: opts.defaultEncapsulation,
                        missingTranslation: opts.missingTranslation,
                        preserveWhitespaces: opts.preserveWhitespaces,
                    });
                },
                deps: []
            },
            opts.providers
        ]);
        return injector.get(core_1.Compiler);
    };
    return JitCompilerFactory;
}());
exports.JitCompilerFactory = JitCompilerFactory;
function _mergeOptions(optionsArr) {
    return {
        useJit: _lastDefined(optionsArr.map(function (options) { return options.useJit; })),
        defaultEncapsulation: _lastDefined(optionsArr.map(function (options) { return options.defaultEncapsulation; })),
        providers: _mergeArrays(optionsArr.map(function (options) { return options.providers; })),
        missingTranslation: _lastDefined(optionsArr.map(function (options) { return options.missingTranslation; })),
        preserveWhitespaces: _lastDefined(optionsArr.map(function (options) { return options.preserveWhitespaces; })),
    };
}
function _lastDefined(args) {
    for (var i = args.length - 1; i >= 0; i--) {
        if (args[i] !== undefined) {
            return args[i];
        }
    }
    return undefined;
}
function _mergeArrays(parts) {
    var result = [];
    parts.forEach(function (part) { return part && result.push.apply(result, part); });
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXJfZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXItZHluYW1pYy9zcmMvY29tcGlsZXJfZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUE0VztBQUU1Vyw4Q0FBK2M7QUFFL2MsMkRBQWtEO0FBRXJDLFFBQUEscUJBQXFCLEdBQUcsSUFBSSxxQkFBYyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFFMUU7O0dBRUc7QUFDVSxRQUFBLDRCQUE0QixHQUFHO0lBQzFDLE9BQU8sRUFBRSx1QkFBZ0I7SUFDekIsUUFBUSxFQUFFLEdBQUc7Q0FDZCxDQUFDO0FBRUYsSUFBTSxtQkFBbUIsR0FBbUI7SUFDMUMsR0FBRyxFQUFILFVBQUksR0FBVztRQUNYLE1BQU0sSUFBSSxLQUFLLENBQ1gsOEVBQTJFLEdBQUcsT0FBRyxDQUFDLENBQUM7SUFBQSxDQUFDO0NBQzdGLENBQUM7QUFFRixJQUFNLGNBQWMsR0FBRyxJQUFJLHFCQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFeEQ7SUFHRSxzQkFDSSxRQUFrQixFQUFVLGlCQUEwQyxFQUN0RSxjQUE4QixFQUFFLGFBQTRCLEVBQUUsWUFBMEIsRUFDeEYsZ0JBQWtDLEVBQUUsZUFBMkMsRUFDL0UsZ0JBQWtDLEVBQUUsY0FBOEIsRUFBRSxPQUFnQjtRQUh4RCxzQkFBaUIsR0FBakIsaUJBQWlCLENBQXlCO1FBSXhFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxzQkFBVyxDQUM1QixpQkFBaUIsRUFBRSxjQUFjLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFDaEYsZUFBZSxFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQzFELElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMvQyxJ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