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
export class Extractor {
    /**
     * @param {?} host
     * @param {?} staticSymbolResolver
     * @param {?} messageBundle
     * @param {?} metadataResolver
     */
    constructor(host, staticSymbolResolver, messageBundle, metadataResolver) {
        this.host = host;
        this.staticSymbolResolver = staticSymbolResolver;
        this.messageBundle = messageBundle;
        this.metadataResolver = metadataResolver;
    }
    /**
     * @param {?} rootFiles
     * @return {?}
     */
    extract(rootFiles) {
        const { files, ngModules } = analyzeAndValidateNgModules(rootFiles, this.host, this.staticSymbolResolver, this.metadataResolver);
        return Promise
            .all(ngModules.map(ngModule => this.metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, false)))
            .then(() => {
            /** @type {?} */
            const errors = [];
            files.forEach(file => {
                /** @type {?} */
                const compMetas = [];
                file.directives.forEach(directiveType => {
                    /** @type {?} */
                    const dirMeta = this.metadataResolver.getDirectiveMetadata(directiveType);
                    if (dirMeta && dirMeta.isComponent) {
                        compMetas.push(dirMeta);
                    }
                });
                compMetas.forEach(compMeta => {
                    /** @type {?} */
                    const html = /** @type {?} */ ((/** @type {?} */ ((compMeta.template)).template));
                    /** @type {?} */
                    const templateUrl = /** @type {?} */ ((/** @type {?} */ ((compMeta.template)).templateUrl));
                    /** @type {?} */
                    const interpolationConfig = InterpolationConfig.fromArray(/** @type {?} */ ((compMeta.template)).interpolation);
                    errors.push(.../** @type {?} */ ((this.messageBundle.updateFromTemplate(html, templateUrl, interpolationConfig))));
                });
            });
            if (errors.length) {
                throw new Error(errors.map(e => e.toString()).join('\n'));
            }
            return this.messageBundle;
        });
    }
    /**
     * @param {?} host
     * @param {?} locale
     * @return {?}
     */
    static create(host, locale) {
        /** @type {?} */
        const htmlParser = new HtmlParser();
        /** @type {?} */
        const urlResolver = createAotUrlResolver(host);
        /** @type {?} */
        const symbolCache = new StaticSymbolCache();
        /** @type {?} */
        const summaryResolver = new AotSummaryResolver(host, symbolCache);
        /** @type {?} */
        const staticSymbolResolver = new StaticSymbolResolver(host, symbolCache, summaryResolver);
        /** @type {?} */
        const staticReflector = new StaticReflector(summaryResolver, staticSymbolResolver);
        /** @type {?} */
        const config = new CompilerConfig({ defaultEncapsulation: ViewEncapsulation.Emulated, useJit: false });
        /** @type {?} */
        const normalizer = new DirectiveNormalizer({ get: (url) => host.loadResource(url) }, urlResolver, htmlParser, config);
        /** @type {?} */
        const elementSchemaRegistry = new DomElementSchemaRegistry();
        /** @type {?} */
        const resolver = new CompileMetadataResolver(config, htmlParser, new NgModuleResolver(staticReflector), new DirectiveResolver(staticReflector), new PipeResolver(staticReflector), summaryResolver, elementSchemaRegistry, normalizer, console, symbolCache, staticReflector);
        /** @type {?} */
        const messageBundle = new MessageBundle(htmlParser, [], {}, locale);
        /** @type {?} */
        const extractor = new Extractor(host, staticSymbolResolver, messageBundle, resolver);
        return { extractor, staticReflector };
    }
}
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