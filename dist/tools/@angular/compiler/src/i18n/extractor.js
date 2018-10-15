"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Extract i18n messages from source code
 */
var compiler_1 = require("../aot/compiler");
var compiler_factory_1 = require("../aot/compiler_factory");
var static_reflector_1 = require("../aot/static_reflector");
var static_symbol_1 = require("../aot/static_symbol");
var static_symbol_resolver_1 = require("../aot/static_symbol_resolver");
var summary_resolver_1 = require("../aot/summary_resolver");
var config_1 = require("../config");
var core_1 = require("../core");
var directive_normalizer_1 = require("../directive_normalizer");
var directive_resolver_1 = require("../directive_resolver");
var metadata_resolver_1 = require("../metadata_resolver");
var html_parser_1 = require("../ml_parser/html_parser");
var interpolation_config_1 = require("../ml_parser/interpolation_config");
var ng_module_resolver_1 = require("../ng_module_resolver");
var pipe_resolver_1 = require("../pipe_resolver");
var dom_element_schema_registry_1 = require("../schema/dom_element_schema_registry");
var message_bundle_1 = require("./message_bundle");
var Extractor = /** @class */ (function () {
    function Extractor(host, staticSymbolResolver, messageBundle, metadataResolver) {
        this.host = host;
        this.staticSymbolResolver = staticSymbolResolver;
        this.messageBundle = messageBundle;
        this.metadataResolver = metadataResolver;
    }
    Extractor.prototype.extract = function (rootFiles) {
        var _this = this;
        var _a = compiler_1.analyzeAndValidateNgModules(rootFiles, this.host, this.staticSymbolResolver, this.metadataResolver), files = _a.files, ngModules = _a.ngModules;
        return Promise
            .all(ngModules.map(function (ngModule) { return _this.metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, false); }))
            .then(function () {
            var errors = [];
            files.forEach(function (file) {
                var compMetas = [];
                file.directives.forEach(function (directiveType) {
                    var dirMeta = _this.metadataResolver.getDirectiveMetadata(directiveType);
                    if (dirMeta && dirMeta.isComponent) {
                        compMetas.push(dirMeta);
                    }
                });
                compMetas.forEach(function (compMeta) {
                    var html = compMeta.template.template;
                    // Template URL points to either an HTML or TS file depending on
                    // whether the file is used with `templateUrl:` or `template:`,
                    // respectively.
                    var templateUrl = compMeta.template.templateUrl;
                    var interpolationConfig = interpolation_config_1.InterpolationConfig.fromArray(compMeta.template.interpolation);
                    errors.push.apply(errors, _this.messageBundle.updateFromTemplate(html, templateUrl, interpolationConfig));
                });
            });
            if (errors.length) {
                throw new Error(errors.map(function (e) { return e.toString(); }).join('\n'));
            }
            return _this.messageBundle;
        });
    };
    Extractor.create = function (host, locale) {
        var htmlParser = new html_parser_1.HtmlParser();
        var urlResolver = compiler_factory_1.createAotUrlResolver(host);
        var symbolCache = new static_symbol_1.StaticSymbolCache();
        var summaryResolver = new summary_resolver_1.AotSummaryResolver(host, symbolCache);
        var staticSymbolResolver = new static_symbol_resolver_1.StaticSymbolResolver(host, symbolCache, summaryResolver);
        var staticReflector = new static_reflector_1.StaticReflector(summaryResolver, staticSymbolResolver);
        var config = new config_1.CompilerConfig({ defaultEncapsulation: core_1.ViewEncapsulation.Emulated, useJit: false });
        var normalizer = new directive_normalizer_1.DirectiveNormalizer({ get: function (url) { return host.loadResource(url); } }, urlResolver, htmlParser, config);
        var elementSchemaRegistry = new dom_element_schema_registry_1.DomElementSchemaRegistry();
        var resolver = new metadata_resolver_1.CompileMetadataResolver(config, htmlParser, new ng_module_resolver_1.NgModuleResolver(staticReflector), new directive_resolver_1.DirectiveResolver(staticReflector), new pipe_resolver_1.PipeResolver(staticReflector), summaryResolver, elementSchemaRegistry, normalizer, console, symbolCache, staticReflector);
        // TODO(vicb): implicit tags & attributes
        var messageBundle = new message_bundle_1.MessageBundle(htmlParser, [], {}, locale);
        var extractor = new Extractor(host, staticSymbolResolver, messageBundle, resolver);
        return { extractor: extractor, staticReflector: staticReflector };
    };
    return Extractor;
}());
exports.Extractor = Extractor;
//# sourceMappingURL=extractor.js.map