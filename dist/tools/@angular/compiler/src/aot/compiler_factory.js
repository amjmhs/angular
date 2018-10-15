"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var core_1 = require("../core");
var directive_normalizer_1 = require("../directive_normalizer");
var directive_resolver_1 = require("../directive_resolver");
var lexer_1 = require("../expression_parser/lexer");
var parser_1 = require("../expression_parser/parser");
var i18n_html_parser_1 = require("../i18n/i18n_html_parser");
var injectable_compiler_1 = require("../injectable_compiler");
var metadata_resolver_1 = require("../metadata_resolver");
var html_parser_1 = require("../ml_parser/html_parser");
var ng_module_compiler_1 = require("../ng_module_compiler");
var ng_module_resolver_1 = require("../ng_module_resolver");
var ts_emitter_1 = require("../output/ts_emitter");
var pipe_resolver_1 = require("../pipe_resolver");
var dom_element_schema_registry_1 = require("../schema/dom_element_schema_registry");
var style_compiler_1 = require("../style_compiler");
var template_parser_1 = require("../template_parser/template_parser");
var util_1 = require("../util");
var type_check_compiler_1 = require("../view_compiler/type_check_compiler");
var view_compiler_1 = require("../view_compiler/view_compiler");
var compiler_1 = require("./compiler");
var static_reflector_1 = require("./static_reflector");
var static_symbol_1 = require("./static_symbol");
var static_symbol_resolver_1 = require("./static_symbol_resolver");
var summary_resolver_1 = require("./summary_resolver");
function createAotUrlResolver(host) {
    return {
        resolve: function (basePath, url) {
            var filePath = host.resourceNameToFileName(url, basePath);
            if (!filePath) {
                throw util_1.syntaxError("Couldn't resolve resource " + url + " from " + basePath);
            }
            return filePath;
        }
    };
}
exports.createAotUrlResolver = createAotUrlResolver;
/**
 * Creates a new AotCompiler based on options and a host.
 */
function createAotCompiler(compilerHost, options, errorCollector) {
    var translations = options.translations || '';
    var urlResolver = createAotUrlResolver(compilerHost);
    var symbolCache = new static_symbol_1.StaticSymbolCache();
    var summaryResolver = new summary_resolver_1.AotSummaryResolver(compilerHost, symbolCache);
    var symbolResolver = new static_symbol_resolver_1.StaticSymbolResolver(compilerHost, symbolCache, summaryResolver);
    var staticReflector = new static_reflector_1.StaticReflector(summaryResolver, symbolResolver, [], [], errorCollector);
    var htmlParser;
    if (!!options.enableIvy) {
        // Ivy handles i18n at the compiler level so we must use a regular parser
        htmlParser = new html_parser_1.HtmlParser();
    }
    else {
        htmlParser = new i18n_html_parser_1.I18NHtmlParser(new html_parser_1.HtmlParser(), translations, options.i18nFormat, options.missingTranslation, console);
    }
    var config = new config_1.CompilerConfig({
        defaultEncapsulation: core_1.ViewEncapsulation.Emulated,
        useJit: false,
        missingTranslation: options.missingTranslation,
        preserveWhitespaces: options.preserveWhitespaces,
        strictInjectionParameters: options.strictInjectionParameters,
    });
    var normalizer = new directive_normalizer_1.DirectiveNormalizer({ get: function (url) { return compilerHost.loadResource(url); } }, urlResolver, htmlParser, config);
    var expressionParser = new parser_1.Parser(new lexer_1.Lexer());
    var elementSchemaRegistry = new dom_element_schema_registry_1.DomElementSchemaRegistry();
    var tmplParser = new template_parser_1.TemplateParser(config, staticReflector, expressionParser, elementSchemaRegistry, htmlParser, console, []);
    var resolver = new metadata_resolver_1.CompileMetadataResolver(config, htmlParser, new ng_module_resolver_1.NgModuleResolver(staticReflector), new directive_resolver_1.DirectiveResolver(staticReflector), new pipe_resolver_1.PipeResolver(staticReflector), summaryResolver, elementSchemaRegistry, normalizer, console, symbolCache, staticReflector, errorCollector);
    // TODO(vicb): do not pass options.i18nFormat here
    var viewCompiler = new view_compiler_1.ViewCompiler(staticReflector);
    var typeCheckCompiler = new type_check_compiler_1.TypeCheckCompiler(options, staticReflector);
    var compiler = new compiler_1.AotCompiler(config, options, compilerHost, staticReflector, resolver, tmplParser, new style_compiler_1.StyleCompiler(urlResolver), viewCompiler, typeCheckCompiler, new ng_module_compiler_1.NgModuleCompiler(staticReflector), new injectable_compiler_1.InjectableCompiler(staticReflector, !!options.enableIvy), new ts_emitter_1.TypeScriptEmitter(), summaryResolver, symbolResolver);
    return { compiler: compiler, reflector: staticReflector };
}
exports.createAotCompiler = createAotCompiler;
//# sourceMappingURL=compiler_factory.js.map