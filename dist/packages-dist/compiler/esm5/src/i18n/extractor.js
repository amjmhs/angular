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
import { analyzeAndValidateNgModules } from '../aot/compiler';
import { createAotUrlResolver } from '../aot/compiler_factory';
import { StaticReflector } from '../aot/static_reflector';
import { StaticSymbolCache } from '../aot/static_symbol';
import { StaticSymbolResolver } from '../aot/static_symbol_resolver';
import { AotSummaryResolver } from '../aot/summary_resolver';
import { CompilerConfig } from '../config';
import { ViewEncapsulation } from '../core';
import { DirectiveNormalizer } from '../directive_normalizer';
import { DirectiveResolver } from '../directive_resolver';
import { CompileMetadataResolver } from '../metadata_resolver';
import { HtmlParser } from '../ml_parser/html_parser';
import { InterpolationConfig } from '../ml_parser/interpolation_config';
import { NgModuleResolver } from '../ng_module_resolver';
import { PipeResolver } from '../pipe_resolver';
import { DomElementSchemaRegistry } from '../schema/dom_element_schema_registry';
import { MessageBundle } from './message_bundle';
/**
 * The host of the Extractor disconnects the implementation from TypeScript / other language
 * services and from underlying file systems.
 * @record
 */
export function ExtractorHost() { }
/**
 * Converts a path that refers to a resource into an absolute filePath
 * that can be lateron used for loading the resource via `loadResource.
 * @type {?}
 */
ExtractorHost.prototype.resourceNameToFileName;
/**
 * Loads a resource (e.g. html / css)
 * @type {?}
 */
ExtractorHost.prototype.loadResource;
var Extractor = /** @class */ (function () {
    function Extractor(host, staticSymbolResolver, messageBundle, metadataResolver) {
        this.host = host;
        this.staticSymbolResolver = staticSymbolResolver;
        this.messageBundle = messageBundle;
        this.metadataResolver = metadataResolver;
    }
    /**
     * @param {?} rootFiles
     * @return {?}
     */
    Extractor.prototype.extract = /**
     * @param {?} rootFiles
     * @return {?}
     */
    function (rootFiles) {
        var _this = this;
        var _a = analyzeAndValidateNgModules(rootFiles, this.host, this.staticSymbolResolver, this.metadataResolver), files = _a.files, ngModules = _a.ngModules;
        return Promise
            .all(ngModules.map(function (ngModule) { return _this.metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, false); }))
            .then(function () {
            /** @type {?} */
            var errors = [];
            files.forEach(function (file) {
                /** @type {?} */
                var compMetas = [];
                file.directives.forEach(function (directiveType) {
                    /** @type {?} */
                    var dirMeta = _this.metadataResolver.getDirectiveMetadata(directiveType);
                    if (dirMeta && dirMeta.isComponent) {
                        compMetas.push(dirMeta);
                    }
                });
                compMetas.forEach(function (compMeta) {
                    /** @type {?} */
                    var html = /** @type {?} */ ((/** @type {?} */ ((compMeta.template)).template));
                    /** @type {?} */
                    var templateUrl = /** @type {?} */ ((/** @type {?} */ ((compMeta.template)).templateUrl));
                    /** @type {?} */
                    var interpolationConfig = InterpolationConfig.fromArray(/** @type {?} */ ((compMeta.template)).interpolation);
                    errors.push.apply(errors, /** @type {?} */ ((_this.messageBundle.updateFromTemplate(html, templateUrl, interpolationConfig))));
                });
            });
            if (errors.length) {
                throw new Error(errors.map(function (e) { return e.toString(); }).join('\n'));
            }
            return _this.messageBundle;
        });
    };
    /**
     * @param {?} host
     * @param {?} locale
     * @return {?}
     */
    Extractor.create = /**
     * @param {?} host
     * @param {?} locale
     * @return {?}
     */
    function (host, locale) {
        /** @type {?} */
        var htmlParser = new HtmlParser();
        /** @type {?} */
        var urlResolver = createAotUrlResolver(host);
        /** @type {?} */
        var symbolCache = new StaticSymbolCache();
        /** @type {?} */
        var summaryResolver = new AotSummaryResolver(host, symbolCache);
        /** @type {?} */
        var staticSymbolResolver = new StaticSymbolResolver(host, symbolCache, summaryResolver);
        /** @type {?} */
        var staticReflector = new StaticReflector(summaryResolver, staticSymbolResolver);
        /** @type {?} */
        var config = new CompilerConfig({ defaultEncapsulation: ViewEncapsulation.Emulated, useJit: false });
        /** @type {?} */
        var normalizer = new DirectiveNormalizer({ get: function (url) { return host.loadResource(url); } }, urlResolver, htmlParser, config);
        /** @type {?} */
        var elementSchemaRegistry = new DomElementSchemaRegistry();
        /** @type {?} */
        var resolver = new CompileMetadataResolver(config, htmlParser, new NgModuleResolver(staticReflector), new DirectiveResolver(staticReflector), new PipeResolver(staticReflector), summaryResolver, elementSchemaRegistry, normalizer, console, symbolCache, staticReflector);
        /** @type {?} */
        var messageBundle = new MessageBundle(htmlParser, [], {}, locale);
        /** @type {?} */
        var extractor = new Extractor(host, staticSymbolResolver, messageBundle, resolver);
        return { extractor: extractor, staticReflector: staticReflector };
    };
    return Extractor;
}());
export { Extractor };
if (false) {
    /** @type {?} */
    Extractor.prototype.host;
    /** @type {?} */
    Extractor.prototype.staticSymbolResolver;
    /** @type {?} */
    Extractor.prototype.messageBundle;
    /** @type {?} */
    Extractor.prototype.metadataResolver;
}
//# sourceMappingURL=extractor.js.map