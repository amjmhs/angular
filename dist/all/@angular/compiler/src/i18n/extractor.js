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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL2kxOG4vZXh0cmFjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0g7O0dBRUc7QUFDSCw0Q0FBNEQ7QUFDNUQsNERBQTZEO0FBQzdELDREQUF3RDtBQUN4RCxzREFBdUQ7QUFDdkQsd0VBQTZGO0FBQzdGLDREQUFtRjtBQUVuRixvQ0FBeUM7QUFDekMsZ0NBQTBDO0FBQzFDLGdFQUE0RDtBQUM1RCw0REFBd0Q7QUFDeEQsMERBQTZEO0FBQzdELHdEQUFvRDtBQUNwRCwwRUFBc0U7QUFDdEUsNERBQXVEO0FBRXZELGtEQUE4QztBQUM5QyxxRkFBK0U7QUFHL0UsbURBQStDO0FBb0IvQztJQUNFLG1CQUNXLElBQW1CLEVBQVUsb0JBQTBDLEVBQ3RFLGFBQTRCLEVBQVUsZ0JBQXlDO1FBRGhGLFNBQUksR0FBSixJQUFJLENBQWU7UUFBVSx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQ3RFLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQVUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUF5QjtJQUFHLENBQUM7SUFFL0YsMkJBQU8sR0FBUCxVQUFRLFNBQW1CO1FBQTNCLGlCQXFDQztRQXBDTyxJQUFBLG1IQUNxRSxFQURwRSxnQkFBSyxFQUFFLHdCQUFTLENBQ3FEO1FBQzVFLE9BQU8sT0FBTzthQUNULEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUNkLFVBQUEsUUFBUSxJQUFJLE9BQUEsS0FBSSxDQUFDLGdCQUFnQixDQUFDLG9DQUFvQyxDQUNsRSxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsRUFEdkIsQ0FDdUIsQ0FBQyxDQUFDO2FBQ3hDLElBQUksQ0FBQztZQUNKLElBQU0sTUFBTSxHQUFpQixFQUFFLENBQUM7WUFFaEMsS0FBSyxDQUFDLE9B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