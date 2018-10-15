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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXJfZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9hb3QvY29tcGlsZXJfZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILG9DQUF5QztBQUN6QyxnQ0FBc0U7QUFDdEUsZ0VBQTREO0FBQzVELDREQUF3RDtBQUN4RCxvREFBaUQ7QUFDakQsc0RBQW1EO0FBQ25ELDZEQUF3RDtBQUN4RCw4REFBMEQ7QUFDMUQsMERBQTZEO0FBQzdELHdEQUFvRDtBQUNwRCw0REFBdUQ7QUFDdkQsNERBQXVEO0FBQ3ZELG1EQUF1RDtBQUN2RCxrREFBOEM7QUFDOUMscUZBQStFO0FBQy9FLG9EQUFnRDtBQUNoRCxzRUFBa0U7QUFFbEUsZ0NBQW9DO0FBQ3BDLDRFQUF1RTtBQUN2RSxnRUFBNEQ7QUFFNUQsdUNBQXVDO0FBR3ZDLHVEQUFtRDtBQUNuRCxpREFBZ0U7QUFDaEUsbUVBQThEO0FBQzlELHVEQUFzRDtBQUV0RCw4QkFBcUMsSUFFcEM7SUFDQyxPQUFPO1FBQ0wsT0FBTyxFQUFFLFVBQUMsUUFBZ0IsRUFBRSxHQUFXO1lBQ3JDLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDNUQsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDYixNQUFNLGtCQUFXLENBQUMsK0JBQTZCLEdBQUcsY0FBUyxRQUFVLENBQUMsQ0FBQzthQUN4RTtZQUNELE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQVpELG9EQVlDO0FBRUQ7O0dBRUc7QUFDSCwyQkFDSSxZQUE2QixFQUFFLE9BQTJCLEVBQzFELGNBQ1E7SUFDVixJQUFJLFlBQVksR0FBVyxPQUFPLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQztJQUV0RCxJQUFNLFdBQVcsR0FB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