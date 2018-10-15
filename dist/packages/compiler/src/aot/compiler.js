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
import { componentFactoryName, flatten, identifierName, templateSourceUrl } from '../compile_metadata';
import { ConstantPool } from '../constant_pool';
import { ViewEncapsulation } from '../core';
import { MessageBundle } from '../i18n/message_bundle';
import { Identifiers, createTokenForExternalReference } from '../identifiers';
import { HtmlParser } from '../ml_parser/html_parser';
import { removeWhitespaces } from '../ml_parser/html_whitespaces';
import { DEFAULT_INTERPOLATION_CONFIG, InterpolationConfig } from '../ml_parser/interpolation_config';
import * as o from '../output/output_ast';
import { compileNgModuleFromRender2 as compileR3Module } from '../render3/r3_module_compiler';
import { compilePipeFromRender2 as compileR3Pipe } from '../render3/r3_pipe_compiler';
import { htmlAstToRender3Ast } from '../render3/r3_template_transform';
import { compileComponentFromRender2 as compileR3Component, compileDirectiveFromRender2 as compileR3Directive } from '../render3/view/compiler';
import { DomElementSchemaRegistry } from '../schema/dom_element_schema_registry';
import { BindingParser } from '../template_parser/binding_parser';
import { error, syntaxError, visitValue } from '../util';
import { GeneratedFile } from './generated_file';
import { listLazyRoutes, parseLazyRoute } from './lazy_routes';
import { StaticSymbol } from './static_symbol';
import { createForJitStub, serializeSummaries } from './summary_serializer';
import { ngfactoryFilePath, normalizeGenFileSuffix, splitTypescriptSuffix, summaryFileName, summaryForJitFileName } from './util';
/** @enum {number} */
const StubEmitFlags = {
    Basic: 1, TypeCheck: 2, All: 3,
};
export class AotCompiler {
    /**
     * @param {?} _config
     * @param {?} _options
     * @param {?} _host
     * @param {?} reflector
     * @param {?} _metadataResolver
     * @param {?} _templateParser
     * @param {?} _styleCompiler
     * @param {?} _viewCompiler
     * @param {?} _typeCheckCompiler
     * @param {?} _ngModuleCompiler
     * @param {?} _injectableCompiler
     * @param {?} _outputEmitter
     * @param {?} _summaryResolver
     * @param {?} _symbolResolver
     */
    constructor(_config, _options, _host, reflector, _metadataResolver, _templateParser, _styleCompiler, _viewCompiler, _typeCheckCompiler, _ngModuleCompiler, _injectableCompiler, _outputEmitter, _summaryResolver, _symbolResolver) {
        this._config = _config;
        this._options = _options;
        this._host = _host;
        this.reflector = reflector;
        this._metadataResolver = _metadataResolver;
        this._templateParser = _templateParser;
        this._styleCompiler = _styleCompiler;
        this._viewCompiler = _viewCompiler;
        this._typeCheckCompiler = _typeCheckCompiler;
        this._ngModuleCompiler = _ngModuleCompiler;
        this._injectableCompiler = _injectableCompiler;
        this._outputEmitter = _outputEmitter;
        this._summaryResolver = _summaryResolver;
        this._symbolResolver = _symbolResolver;
        this._templateAstCache = new Map();
        this._analyzedFiles = new Map();
        this._analyzedFilesForInjectables = new Map();
    }
    /**
     * @return {?}
     */
    clearCache() { this._metadataResolver.clearCache(); }
    /**
     * @param {?} rootFiles
     * @return {?}
     */
    analyzeModulesSync(rootFiles) {
        /** @type {?} */
        const analyzeResult = analyzeAndValidateNgModules(rootFiles, this._host, this._symbolResolver, this._metadataResolver);
        analyzeResult.ngModules.forEach(ngModule => this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, true));
        return analyzeResult;
    }
    /**
     * @param {?} rootFiles
     * @return {?}
     */
    analyzeModulesAsync(rootFiles) {
        /** @type {?} */
        const analyzeResult = analyzeAndValidateNgModules(rootFiles, this._host, this._symbolResolver, this._metadataResolver);
        return Promise
            .all(analyzeResult.ngModules.map(ngModule => this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, false)))
            .then(() => analyzeResult);
    }
    /**
     * @param {?} fileName
     * @return {?}
     */
    _analyzeFile(fileName) {
        /** @type {?} */
        let analyzedFile = this._analyzedFiles.get(fileName);
        if (!analyzedFile) {
            analyzedFile =
                analyzeFile(this._host, this._symbolResolver, this._metadataResolver, fileName);
            this._analyzedFiles.set(fileName, analyzedFile);
        }
        return analyzedFile;
    }
    /**
     * @param {?} fileName
     * @return {?}
     */
    _analyzeFileForInjectables(fileName) {
        /** @type {?} */
        let analyzedFile = this._analyzedFilesForInjectables.get(fileName);
        if (!analyzedFile) {
            analyzedFile = analyzeFileForInjectables(this._host, this._symbolResolver, this._metadataResolver, fileName);
            this._analyzedFilesForInjectables.set(fileName, analyzedFile);
        }
        return analyzedFile;
    }
    /**
     * @param {?} fileName
     * @return {?}
     */
    findGeneratedFileNames(fileName) {
        /** @type {?} */
        const genFileNames = [];
        /** @type {?} */
        const file = this._analyzeFile(fileName);
        // Make sure we create a .ngfactory if we have a injectable/directive/pipe/NgModule
        // or a reference to a non source file.
        // Note: This is overestimating the required .ngfactory files as the real calculation is harder.
        // Only do this for StubEmitFlags.Basic, as adding a type check block
        // does not change this file (as we generate type check blocks based on NgModules).
        if (this._options.allowEmptyCodegenFiles || file.directives.length || file.pipes.length ||
            file.injectables.length || file.ngModules.length || file.exportsNonSourceFiles) {
            genFileNames.push(ngfactoryFilePath(file.fileName, true));
            if (this._options.enableSummariesForJit) {
                genFileNames.push(summaryForJitFileName(file.fileName, true));
            }
        }
        /** @type {?} */
        const fileSuffix = normalizeGenFileSuffix(splitTypescriptSuffix(file.fileName, true)[1]);
        file.directives.forEach((dirSymbol) => {
            /** @type {?} */
            const compMeta = /** @type {?} */ ((this._metadataResolver.getNonNormalizedDirectiveMetadata(dirSymbol))).metadata;
            if (!compMeta.isComponent) {
                return;
            } /** @type {?} */
            ((
            // Note: compMeta is a component and therefore template is non null.
            compMeta.template)).styleUrls.forEach((styleUrl) => {
                /** @type {?} */
                const normalizedUrl = this._host.resourceNameToFileName(styleUrl, file.fileName);
                if (!normalizedUrl) {
                    throw syntaxError(`Couldn't resolve resource ${styleUrl} relative to ${file.fileName}`);
                }
                /** @type {?} */
                const needsShim = (/** @type {?} */ ((compMeta.template)).encapsulation || this._config.defaultEncapsulation) === ViewEncapsulation.Emulated;
                genFileNames.push(_stylesModuleUrl(normalizedUrl, needsShim, fileSuffix));
                if (this._options.allowEmptyCodegenFiles) {
                    genFileNames.push(_stylesModuleUrl(normalizedUrl, !needsShim, fileSuffix));
                }
            });
        });
        return genFileNames;
    }
    /**
     * @param {?} genFileName
     * @param {?=} originalFileName
     * @return {?}
     */
    emitBasicStub(genFileName, originalFileName) {
        /** @type {?} */
        const outputCtx = this._createOutputContext(genFileName);
        if (genFileName.endsWith('.ngfactory.ts')) {
            if (!originalFileName) {
                throw new Error(`Assertion error: require the original file for .ngfactory.ts stubs. File: ${genFileName}`);
            }
            /** @type {?} */
            const originalFile = this._analyzeFile(originalFileName);
            this._createNgFactoryStub(outputCtx, originalFile, 1 /* Basic */);
        }
        else if (genFileName.endsWith('.ngsummary.ts')) {
            if (this._options.enableSummariesForJit) {
                if (!originalFileName) {
                    throw new Error(`Assertion error: require the original file for .ngsummary.ts stubs. File: ${genFileName}`);
                }
                /** @type {?} */
                const originalFile = this._analyzeFile(originalFileName);
                _createEmptyStub(outputCtx);
                originalFile.ngModules.forEach(ngModule => {
                    // create exports that user code can reference
                    createForJitStub(outputCtx, ngModule.type.reference);
                });
            }
        }
        else if (genFileName.endsWith('.ngstyle.ts')) {
            _createEmptyStub(outputCtx);
        }
        // Note: for the stubs, we don't need a property srcFileUrl,
        // as later on in emitAllImpls we will create the proper GeneratedFiles with the
        // correct srcFileUrl.
        // This is good as e.g. for .ngstyle.ts files we can't derive
        // the url of components based on the genFileUrl.
        return this._codegenSourceModule('unknown', outputCtx);
    }
    /**
     * @param {?} genFileName
     * @param {?} originalFileName
     * @return {?}
     */
    emitTypeCheckStub(genFileName, originalFileName) {
        /** @type {?} */
        const originalFile = this._analyzeFile(originalFileName);
        /** @type {?} */
        const outputCtx = this._createOutputContext(genFileName);
        if (genFileName.endsWith('.ngfactory.ts')) {
            this._createNgFactoryStub(outputCtx, originalFile, 2 /* TypeCheck */);
        }
        return outputCtx.statements.length > 0 ?
            this._codegenSourceModule(originalFile.fileName, outputCtx) :
            null;
    }
    /**
     * @param {?} fileNames
     * @param {?} tsFiles
     * @return {?}
     */
    loadFilesAsync(fileNames, tsFiles) {
        /** @type {?} */
        const files = fileNames.map(fileName => this._analyzeFile(fileName));
        /** @type {?} */
        const loadingPromises = [];
        files.forEach(file => file.ngModules.forEach(ngModule => loadingPromises.push(this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, false))));
        /** @type {?} */
        const analyzedInjectables = tsFiles.map(tsFile => this._analyzeFileForInjectables(tsFile));
        return Promise.all(loadingPromises).then(_ => ({
            analyzedModules: mergeAndValidateNgFiles(files),
            analyzedInjectables: analyzedInjectables,
        }));
    }
    /**
     * @param {?} fileNames
     * @param {?} tsFiles
     * @return {?}
     */
    loadFilesSync(fileNames, tsFiles) {
        /** @type {?} */
        const files = fileNames.map(fileName => this._analyzeFile(fileName));
        files.forEach(file => file.ngModules.forEach(ngModule => this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, true)));
        /** @type {?} */
        const analyzedInjectables = tsFiles.map(tsFile => this._analyzeFileForInjectables(tsFile));
        return {
            analyzedModules: mergeAndValidateNgFiles(files),
            analyzedInjectables: analyzedInjectables,
        };
    }
    /**
     * @param {?} outputCtx
     * @param {?} file
     * @param {?} emitFlags
     * @return {?}
     */
    _createNgFactoryStub(outputCtx, file, emitFlags) {
        /** @type {?} */
        let componentId = 0;
        file.ngModules.forEach((ngModuleMeta, ngModuleIndex) => {
            // Note: the code below needs to executed for StubEmitFlags.Basic and StubEmitFlags.TypeCheck,
            // so we don't change the .ngfactory file too much when adding the type-check block.
            // create exports that user code can reference
            this._ngModuleCompiler.createStub(outputCtx, ngModuleMeta.type.reference);
            /** @type {?} */
            const externalReferences = [
                // Add references that are available from all the modules and imports.
                ...ngModuleMeta.transitiveModule.directives.map(d => d.reference),
                ...ngModuleMeta.transitiveModule.pipes.map(d => d.reference),
                ...ngModuleMeta.importedModules.map(m => m.type.reference),
                ...ngModuleMeta.exportedModules.map(m => m.type.reference),
                // Add references that might be inserted by the template compiler.
                ...this._externalIdentifierReferences([Identifiers.TemplateRef, Identifiers.ElementRef]),
            ];
            /** @type {?} */
            const externalReferenceVars = new Map();
            externalReferences.forEach((ref, typeIndex) => {
                externalReferenceVars.set(ref, `_decl${ngModuleIndex}_${typeIndex}`);
            });
            externalReferenceVars.forEach((varName, reference) => {
                outputCtx.statements.push(o.variable(varName)
                    .set(o.NULL_EXPR.cast(o.DYNAMIC_TYPE))
                    .toDeclStmt(o.expressionType(outputCtx.importExpr(reference, /* typeParams */ null, /* useSummaries */ /* useSummaries */ false))));
            });
            if (emitFlags & 2 /* TypeCheck */) {
                // add the type-check block for all components of the NgModule
                ngModuleMeta.declaredDirectives.forEach((dirId) => {
                    /** @type {?} */
                    const compMeta = this._metadataResolver.getDirectiveMetadata(dirId.reference);
                    if (!compMeta.isComponent) {
                        return;
                    }
                    componentId++;
                    this._createTypeCheckBlock(outputCtx, `${compMeta.type.reference.name}_Host_${componentId}`, ngModuleMeta, this._metadataResolver.getHostComponentMetadata(compMeta), [compMeta.type], externalReferenceVars);
                    this._createTypeCheckBlock(outputCtx, `${compMeta.type.reference.name}_${componentId}`, ngModuleMeta, compMeta, ngModuleMeta.transitiveModule.directives, externalReferenceVars);
                });
            }
        });
        if (outputCtx.statements.length === 0) {
            _createEmptyStub(outputCtx);
        }
    }
    /**
     * @param {?} references
     * @return {?}
     */
    _externalIdentifierReferences(references) {
        /** @type {?} */
        const result = [];
        for (let reference of references) {
            /** @type {?} */
            const token = createTokenForExternalReference(this.reflector, reference);
            if (token.identifier) {
                result.push(token.identifier.reference);
            }
        }
        return result;
    }
    /**
     * @param {?} ctx
     * @param {?} componentId
     * @param {?} moduleMeta
     * @param {?} compMeta
     * @param {?} directives
     * @param {?} externalReferenceVars
     * @return {?}
     */
    _createTypeCheckBlock(ctx, componentId, moduleMeta, compMeta, directives, externalReferenceVars) {
        const { template: parsedTemplate, pipes: usedPipes } = this._parseTemplate(compMeta, moduleMeta, directives);
        ctx.statements.push(...this._typeCheckCompiler.compileComponent(componentId, compMeta, parsedTemplate, usedPipes, externalReferenceVars, ctx));
    }
    /**
     * @param {?} analyzeResult
     * @param {?} locale
     * @return {?}
     */
    emitMessageBundle(analyzeResult, locale) {
        /** @type {?} */
        const errors = [];
        /** @type {?} */
        const htmlParser = new HtmlParser();
        /** @type {?} */
        const messageBundle = new MessageBundle(htmlParser, [], {}, locale);
        analyzeResult.files.forEach(file => {
            /** @type {?} */
            const compMetas = [];
            file.directives.forEach(directiveType => {
                /** @type {?} */
                const dirMeta = this._metadataResolver.getDirectiveMetadata(directiveType);
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
                errors.push(.../** @type {?} */ ((messageBundle.updateFromTemplate(html, templateUrl, interpolationConfig))));
            });
        });
        if (errors.length) {
            throw new Error(errors.map(e => e.toString()).join('\n'));
        }
        return messageBundle;
    }
    /**
     * @param {?} __0
     * @param {?} r3Files
     * @return {?}
     */
    emitAllPartialModules({ ngModuleByPipeOrDirective, files }, r3Files) {
        /** @type {?} */
        const contextMap = new Map();
        /** @type {?} */
        const getContext = (fileName) => {
            if (!contextMap.has(fileName)) {
                contextMap.set(fileName, this._createOutputContext(fileName));
            }
            return /** @type {?} */ ((contextMap.get(fileName)));
        };
        files.forEach(file => this._compilePartialModule(file.fileName, ngModuleByPipeOrDirective, file.directives, file.pipes, file.ngModules, file.injectables, getContext(file.fileName)));
        r3Files.forEach(file => this._compileShallowModules(file.fileName, file.shallowModules, getContext(file.fileName)));
        return Array.from(contextMap.values())
            .map(context => ({
            fileName: context.genFilePath,
            statements: [...context.constantPool.statements, ...context.statements],
        }));
    }
    /**
     * @param {?} fileName
     * @param {?} shallowModules
     * @param {?} context
     * @return {?}
     */
    _compileShallowModules(fileName, shallowModules, context) {
        shallowModules.forEach(module => compileR3Module(context, module, this._injectableCompiler));
    }
    /**
     * @param {?} fileName
     * @param {?} ngModuleByPipeOrDirective
     * @param {?} directives
     * @param {?} pipes
     * @param {?} ngModules
     * @param {?} injectables
     * @param {?} context
     * @return {?}
     */
    _compilePartialModule(fileName, ngModuleByPipeOrDirective, directives, pipes, ngModules, injectables, context) {
        /** @type {?} */
        const errors = [];
        /** @type {?} */
        const schemaRegistry = new DomElementSchemaRegistry();
        /** @type {?} */
        const hostBindingParser = new BindingParser(this._templateParser.expressionParser, DEFAULT_INTERPOLATION_CONFIG, schemaRegistry, [], errors);
        // Process all components and directives
        directives.forEach(directiveType => {
            /** @type {?} */
            const directiveMetadata = this._metadataResolver.getDirectiveMetadata(directiveType);
            if (directiveMetadata.isComponent) {
                /** @type {?} */
                const module = /** @type {?} */ ((ngModuleByPipeOrDirective.get(directiveType)));
                module ||
                    error(`Cannot determine the module for component '${identifierName(directiveMetadata.type)}'`);
                /** @type {?} */
                let htmlAst = /** @type {?} */ ((/** @type {?} */ ((directiveMetadata.template)).htmlAst));
                /** @type {?} */
                const preserveWhitespaces = /** @type {?} */ ((/** @type {?} */ ((directiveMetadata)).template)).preserveWhitespaces;
                if (!preserveWhitespaces) {
                    htmlAst = removeWhitespaces(htmlAst);
                }
                /** @type {?} */
                const render3Ast = htmlAstToRender3Ast(htmlAst.rootNodes, hostBindingParser);
                /** @type {?} */
                const directiveTypeBySel = new Map();
                /** @type {?} */
                const directives = module.transitiveModule.directives.map(dir => this._metadataResolver.getDirectiveSummary(dir.reference));
                directives.forEach(directive => {
                    if (directive.selector) {
                        directiveTypeBySel.set(directive.selector, directive.type.reference);
                    }
                });
                /** @type {?} */
                const pipeTypeByName = new Map();
                /** @type {?} */
                const pipes = module.transitiveModule.pipes.map(pipe => this._metadataResolver.getPipeSummary(pipe.reference));
                pipes.forEach(pipe => { pipeTypeByName.set(pipe.name, pipe.type.reference); });
                compileR3Component(context, directiveMetadata, render3Ast, this.reflector, hostBindingParser, directiveTypeBySel, pipeTypeByName);
            }
            else {
                compileR3Directive(context, directiveMetadata, this.reflector, hostBindingParser);
            }
        });
        pipes.forEach(pipeType => {
            /** @type {?} */
            const pipeMetadata = this._metadataResolver.getPipeMetadata(pipeType);
            if (pipeMetadata) {
                compileR3Pipe(context, pipeMetadata, this.reflector);
            }
        });
        injectables.forEach(injectable => this._injectableCompiler.compile(injectable, context));
    }
    /**
     * @param {?} files
     * @return {?}
     */
    emitAllPartialModules2(files) {
        // Using reduce like this is a select many pattern (where map is a select pattern)
        return files.reduce((r, file) => {
            r.push(...this._emitPartialModule2(file.fileName, file.injectables));
            return r;
        }, []);
    }
    /**
     * @param {?} fileName
     * @param {?} injectables
     * @return {?}
     */
    _emitPartialModule2(fileName, injectables) {
        /** @type {?} */
        const context = this._createOutputContext(fileName);
        injectables.forEach(injectable => this._injectableCompiler.compile(injectable, context));
        if (context.statements && context.statements.length > 0) {
            return [{ fileName, statements: [...context.constantPool.statements, ...context.statements] }];
        }
        return [];
    }
    /**
     * @param {?} analyzeResult
     * @return {?}
     */
    emitAllImpls(analyzeResult) {
        const { ngModuleByPipeOrDirective, files } = analyzeResult;
        /** @type {?} */
        const sourceModules = files.map(file => this._compileImplFile(file.fileName, ngModuleByPipeOrDirective, file.directives, file.pipes, file.ngModules, file.injectables));
        return flatten(sourceModules);
    }
    /**
     * @param {?} srcFileUrl
     * @param {?} ngModuleByPipeOrDirective
     * @param {?} directives
     * @param {?} pipes
     * @param {?} ngModules
     * @param {?} injectables
     * @return {?}
     */
    _compileImplFile(srcFileUrl, ngModuleByPipeOrDirective, directives, pipes, ngModules, injectables) {
        /** @type {?} */
        const fileSuffix = normalizeGenFileSuffix(splitTypescriptSuffix(srcFileUrl, true)[1]);
        /** @type {?} */
        const generatedFiles = [];
        /** @type {?} */
        const outputCtx = this._createOutputContext(ngfactoryFilePath(srcFileUrl, true));
        generatedFiles.push(...this._createSummary(srcFileUrl, directives, pipes, ngModules, injectables, outputCtx));
        // compile all ng modules
        ngModules.forEach((ngModuleMeta) => this._compileModule(outputCtx, ngModuleMeta));
        // compile components
        directives.forEach((dirType) => {
            /** @type {?} */
            const compMeta = this._metadataResolver.getDirectiveMetadata(/** @type {?} */ (dirType));
            if (!compMeta.isComponent) {
                return;
            }
            /** @type {?} */
            const ngModule = ngModuleByPipeOrDirective.get(dirType);
            if (!ngModule) {
                throw new Error(`Internal Error: cannot determine the module for component ${identifierName(compMeta.type)}!`);
            }
            /** @type {?} */
            const componentStylesheet = this._styleCompiler.compileComponent(outputCtx, compMeta); /** @type {?} */
            ((
            // Note: compMeta is a component and therefore template is non null.
            compMeta.template)).externalStylesheets.forEach((stylesheetMeta) => {
                /** @type {?} */
                const shim = this._styleCompiler.needsStyleShim(compMeta);
                generatedFiles.push(this._codegenStyles(srcFileUrl, compMeta, stylesheetMeta, shim, fileSuffix));
                if (this._options.allowEmptyCodegenFiles) {
                    generatedFiles.push(this._codegenStyles(srcFileUrl, compMeta, stylesheetMeta, !shim, fileSuffix));
                }
            });
            /** @type {?} */
            const compViewVars = this._compileComponent(outputCtx, compMeta, ngModule, ngModule.transitiveModule.directives, componentStylesheet, fileSuffix);
            this._compileComponentFactory(outputCtx, compMeta, ngModule, fileSuffix);
        });
        if (outputCtx.statements.length > 0 || this._options.allowEmptyCodegenFiles) {
            /** @type {?} */
            const srcModule = this._codegenSourceModule(srcFileUrl, outputCtx);
            generatedFiles.unshift(srcModule);
        }
        return generatedFiles;
    }
    /**
     * @param {?} srcFileName
     * @param {?} directives
     * @param {?} pipes
     * @param {?} ngModules
     * @param {?} injectables
     * @param {?} ngFactoryCtx
     * @return {?}
     */
    _createSummary(srcFileName, directives, pipes, ngModules, injectables, ngFactoryCtx) {
        /** @type {?} */
        const symbolSummaries = this._symbolResolver.getSymbolsOf(srcFileName)
            .map(symbol => this._symbolResolver.resolveSymbol(symbol));
        /** @type {?} */
        const typeData = [
            ...ngModules.map(meta => ({
                summary: /** @type {?} */ ((this._metadataResolver.getNgModuleSummary(meta.type.reference))),
                metadata: /** @type {?} */ ((this._metadataResolver.getNgModuleMetadata(meta.type.reference)))
            })),
            ...directives.map(ref => ({
                summary: /** @type {?} */ ((this._metadataResolver.getDirectiveSummary(ref))),
                metadata: /** @type {?} */ ((this._metadataResolver.getDirectiveMetadata(ref)))
            })),
            ...pipes.map(ref => ({
                summary: /** @type {?} */ ((this._metadataResolver.getPipeSummary(ref))),
                metadata: /** @type {?} */ ((this._metadataResolver.getPipeMetadata(ref)))
            })),
            ...injectables.map(ref => ({
                summary: /** @type {?} */ ((this._metadataResolver.getInjectableSummary(ref.symbol))),
                metadata: /** @type {?} */ ((this._metadataResolver.getInjectableSummary(ref.symbol))).type
            }))
        ];
        /** @type {?} */
        const forJitOutputCtx = this._options.enableSummariesForJit ?
            this._createOutputContext(summaryForJitFileName(srcFileName, true)) :
            null;
        const { json, exportAs } = serializeSummaries(srcFileName, forJitOutputCtx, this._summaryResolver, this._symbolResolver, symbolSummaries, typeData);
        exportAs.forEach((entry) => {
            ngFactoryCtx.statements.push(o.variable(entry.exportAs).set(ngFactoryCtx.importExpr(entry.symbol)).toDeclStmt(null, [
                o.StmtModifier.Exported
            ]));
        });
        /** @type {?} */
        const summaryJson = new GeneratedFile(srcFileName, summaryFileName(srcFileName), json);
        /** @type {?} */
        const result = [summaryJson];
        if (forJitOutputCtx) {
            result.push(this._codegenSourceModule(srcFileName, forJitOutputCtx));
        }
        return result;
    }
    /**
     * @param {?} outputCtx
     * @param {?} ngModule
     * @return {?}
     */
    _compileModule(outputCtx, ngModule) {
        /** @type {?} */
        const providers = [];
        if (this._options.locale) {
            /** @type {?} */
            const normalizedLocale = this._options.locale.replace(/_/g, '-');
            providers.push({
                token: createTokenForExternalReference(this.reflector, Identifiers.LOCALE_ID),
                useValue: normalizedLocale,
            });
        }
        if (this._options.i18nFormat) {
            providers.push({
                token: createTokenForExternalReference(this.reflector, Identifiers.TRANSLATIONS_FORMAT),
                useValue: this._options.i18nFormat
            });
        }
        this._ngModuleCompiler.compile(outputCtx, ngModule, providers);
    }
    /**
     * @param {?} outputCtx
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} fileSuffix
     * @return {?}
     */
    _compileComponentFactory(outputCtx, compMeta, ngModule, fileSuffix) {
        /** @type {?} */
        const hostMeta = this._metadataResolver.getHostComponentMetadata(compMeta);
        /** @type {?} */
        const hostViewFactoryVar = this._compileComponent(outputCtx, hostMeta, ngModule, [compMeta.type], null, fileSuffix)
            .viewClassVar;
        /** @type {?} */
        const compFactoryVar = componentFactoryName(compMeta.type.reference);
        /** @type {?} */
        const inputsExprs = [];
        for (let propName in compMeta.inputs) {
            /** @type {?} */
            const templateName = compMeta.inputs[propName];
            // Don't quote so that the key gets minified...
            inputsExprs.push(new o.LiteralMapEntry(propName, o.literal(templateName), false));
        }
        /** @type {?} */
        const outputsExprs = [];
        for (let propName in compMeta.outputs) {
            /** @type {?} */
            const templateName = compMeta.outputs[propName];
            // Don't quote so that the key gets minified...
            outputsExprs.push(new o.LiteralMapEntry(propName, o.literal(templateName), false));
        }
        outputCtx.statements.push(o.variable(compFactoryVar)
            .set(o.importExpr(Identifiers.createComponentFactory).callFn([
            o.literal(compMeta.selector), outputCtx.importExpr(compMeta.type.reference),
            o.variable(hostViewFactoryVar), new o.LiteralMapExpr(inputsExprs),
            new o.LiteralMapExpr(outputsExprs),
            o.literalArr(/** @type {?} */ ((compMeta.template)).ngContentSelectors.map(selector => o.literal(selector)))
        ]))
            .toDeclStmt(o.importType(Identifiers.ComponentFactory, [/** @type {?} */ ((o.expressionType(outputCtx.importExpr(compMeta.type.reference))))], [o.TypeModifier.Const]), [o.StmtModifier.Final, o.StmtModifier.Exported]));
    }
    /**
     * @param {?} outputCtx
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} directiveIdentifiers
     * @param {?} componentStyles
     * @param {?} fileSuffix
     * @return {?}
     */
    _compileComponent(outputCtx, compMeta, ngModule, directiveIdentifiers, componentStyles, fileSuffix) {
        const { template: parsedTemplate, pipes: usedPipes } = this._parseTemplate(compMeta, ngModule, directiveIdentifiers);
        /** @type {?} */
        const stylesExpr = componentStyles ? o.variable(componentStyles.stylesVar) : o.literalArr([]);
        /** @type {?} */
        const viewResult = this._viewCompiler.compileComponent(outputCtx, compMeta, parsedTemplate, stylesExpr, usedPipes);
        if (componentStyles) {
            _resolveStyleStatements(this._symbolResolver, componentStyles, this._styleCompiler.needsStyleShim(compMeta), fileSuffix);
        }
        return viewResult;
    }
    /**
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} directiveIdentifiers
     * @return {?}
     */
    _parseTemplate(compMeta, ngModule, directiveIdentifiers) {
        if (this._templateAstCache.has(compMeta.type.reference)) {
            return /** @type {?} */ ((this._templateAstCache.get(compMeta.type.reference)));
        }
        /** @type {?} */
        const preserveWhitespaces = /** @type {?} */ ((/** @type {?} */ ((compMeta)).template)).preserveWhitespaces;
        /** @type {?} */
        const directives = directiveIdentifiers.map(dir => this._metadataResolver.getDirectiveSummary(dir.reference));
        /** @type {?} */
        const pipes = ngModule.transitiveModule.pipes.map(pipe => this._metadataResolver.getPipeSummary(pipe.reference));
        /** @type {?} */
        const result = this._templateParser.parse(compMeta, /** @type {?} */ ((/** @type {?} */ ((compMeta.template)).htmlAst)), directives, pipes, ngModule.schemas, templateSourceUrl(ngModule.type, compMeta, /** @type {?} */ ((compMeta.template))), preserveWhitespaces);
        this._templateAstCache.set(compMeta.type.reference, result);
        return result;
    }
    /**
     * @param {?} genFilePath
     * @return {?}
     */
    _createOutputContext(genFilePath) {
        /** @type {?} */
        const importExpr = (symbol, typeParams = null, useSummaries = true) => {
            if (!(symbol instanceof StaticSymbol)) {
                throw new Error(`Internal error: unknown identifier ${JSON.stringify(symbol)}`);
            }
            /** @type {?} */
            const arity = this._symbolResolver.getTypeArity(symbol) || 0;
            const { filePath, name, members } = this._symbolResolver.getImportAs(symbol, useSummaries) || symbol;
            /** @type {?} */
            const importModule = this._fileNameToModuleName(filePath, genFilePath);
            /** @type {?} */
            const selfReference = this._fileNameToModuleName(genFilePath, genFilePath);
            /** @type {?} */
            const moduleName = importModule === selfReference ? null : importModule;
            /** @type {?} */
            const suppliedTypeParams = typeParams || [];
            /** @type {?} */
            const missingTypeParamsCount = arity - suppliedTypeParams.length;
            /** @type {?} */
            const allTypeParams = suppliedTypeParams.concat(new Array(missingTypeParamsCount).fill(o.DYNAMIC_TYPE));
            return members.reduce((expr, memberName) => expr.prop(memberName), /** @type {?} */ (o.importExpr(new o.ExternalReference(moduleName, name, null), allTypeParams)));
        };
        return { statements: [], genFilePath, importExpr, constantPool: new ConstantPool() };
    }
    /**
     * @param {?} importedFilePath
     * @param {?} containingFilePath
     * @return {?}
     */
    _fileNameToModuleName(importedFilePath, containingFilePath) {
        return this._summaryResolver.getKnownModuleName(importedFilePath) ||
            this._symbolResolver.getKnownModuleName(importedFilePath) ||
            this._host.fileNameToModuleName(importedFilePath, containingFilePath);
    }
    /**
     * @param {?} srcFileUrl
     * @param {?} compMeta
     * @param {?} stylesheetMetadata
     * @param {?} isShimmed
     * @param {?} fileSuffix
     * @return {?}
     */
    _codegenStyles(srcFileUrl, compMeta, stylesheetMetadata, isShimmed, fileSuffix) {
        /** @type {?} */
        const outputCtx = this._createOutputContext(_stylesModuleUrl(/** @type {?} */ ((stylesheetMetadata.moduleUrl)), isShimmed, fileSuffix));
        /** @type {?} */
        const compiledStylesheet = this._styleCompiler.compileStyles(outputCtx, compMeta, stylesheetMetadata, isShimmed);
        _resolveStyleStatements(this._symbolResolver, compiledStylesheet, isShimmed, fileSuffix);
        return this._codegenSourceModule(srcFileUrl, outputCtx);
    }
    /**
     * @param {?} srcFileUrl
     * @param {?} ctx
     * @return {?}
     */
    _codegenSourceModule(srcFileUrl, ctx) {
        return new GeneratedFile(srcFileUrl, ctx.genFilePath, ctx.statements);
    }
    /**
     * @param {?=} entryRoute
     * @param {?=} analyzedModules
     * @return {?}
     */
    listLazyRoutes(entryRoute, analyzedModules) {
        /** @type {?} */
        const self = this;
        if (entryRoute) {
            /** @type {?} */
            const symbol = parseLazyRoute(entryRoute, this.reflector).referencedModule;
            return visitLazyRoute(symbol);
        }
        else if (analyzedModules) {
            /** @type {?} */
            const allLazyRoutes = [];
            for (const ngModule of analyzedModules.ngModules) {
                /** @type {?} */
                const lazyRoutes = listLazyRoutes(ngModule, this.reflector);
                for (const lazyRoute of lazyRoutes) {
                    allLazyRoutes.push(lazyRoute);
                }
            }
            return allLazyRoutes;
        }
        else {
            throw new Error(`Either route or analyzedModules has to be specified!`);
        }
        /**
         * @param {?} symbol
         * @param {?=} seenRoutes
         * @param {?=} allLazyRoutes
         * @return {?}
         */
        function visitLazyRoute(symbol, seenRoutes = new Set(), allLazyRoutes = []) {
            // Support pointing to default exports, but stop recursing there,
            // as the StaticReflector does not yet support default exports.
            if (seenRoutes.has(symbol) || !symbol.name) {
                return allLazyRoutes;
            }
            seenRoutes.add(symbol);
            /** @type {?} */
            const lazyRoutes = listLazyRoutes(/** @type {?} */ ((self._metadataResolver.getNgModuleMetadata(symbol, true))), self.reflector);
            for (const lazyRoute of lazyRoutes) {
                allLazyRoutes.push(lazyRoute);
                visitLazyRoute(lazyRoute.referencedModule, seenRoutes, allLazyRoutes);
            }
            return allLazyRoutes;
        }
    }
}
if (false) {
    /** @type {?} */
    AotCompiler.prototype._templateAstCache;
    /** @type {?} */
    AotCompiler.prototype._analyzedFiles;
    /** @type {?} */
    AotCompiler.prototype._analyzedFilesForInjectables;
    /** @type {?} */
    AotCompiler.prototype._config;
    /** @type {?} */
    AotCompiler.prototype._options;
    /** @type {?} */
    AotCompiler.prototype._host;
    /** @type {?} */
    AotCompiler.prototype.reflector;
    /** @type {?} */
    AotCompiler.prototype._metadataResolver;
    /** @type {?} */
    AotCompiler.prototype._templateParser;
    /** @type {?} */
    AotCompiler.prototype._styleCompiler;
    /** @type {?} */
    AotCompiler.prototype._viewCompiler;
    /** @type {?} */
    AotCompiler.prototype._typeCheckCompiler;
    /** @type {?} */
    AotCompiler.prototype._ngModuleCompiler;
    /** @type {?} */
    AotCompiler.prototype._injectableCompiler;
    /** @type {?} */
    AotCompiler.prototype._outputEmitter;
    /** @type {?} */
    AotCompiler.prototype._summaryResolver;
    /** @type {?} */
    AotCompiler.prototype._symbolResolver;
}
/**
 * @param {?} outputCtx
 * @return {?}
 */
function _createEmptyStub(outputCtx) {
    // Note: We need to produce at least one import statement so that
    // TypeScript knows that the file is an es6 module. Otherwise our generated
    // exports / imports won't be emitted properly by TypeScript.
    outputCtx.statements.push(o.importExpr(Identifiers.ComponentFactory).toStmt());
}
/**
 * @param {?} symbolResolver
 * @param {?} compileResult
 * @param {?} needsShim
 * @param {?} fileSuffix
 * @return {?}
 */
function _resolveStyleStatements(symbolResolver, compileResult, needsShim, fileSuffix) {
    compileResult.dependencies.forEach((dep) => {
        dep.setValue(symbolResolver.getStaticSymbol(_stylesModuleUrl(dep.moduleUrl, needsShim, fileSuffix), dep.name));
    });
}
/**
 * @param {?} stylesheetUrl
 * @param {?} shim
 * @param {?} suffix
 * @return {?}
 */
function _stylesModuleUrl(stylesheetUrl, shim, suffix) {
    return `${stylesheetUrl}${shim ? '.shim' : ''}.ngstyle${suffix}`;
}
/**
 * @record
 */
export function NgAnalyzedModules() { }
/** @type {?} */
NgAnalyzedModules.prototype.ngModules;
/** @type {?} */
NgAnalyzedModules.prototype.ngModuleByPipeOrDirective;
/** @type {?} */
NgAnalyzedModules.prototype.files;
/** @type {?|undefined} */
NgAnalyzedModules.prototype.symbolsMissingModule;
/**
 * @record
 */
export function NgAnalyzedFileWithInjectables() { }
/** @type {?} */
NgAnalyzedFileWithInjectables.prototype.fileName;
/** @type {?} */
NgAnalyzedFileWithInjectables.prototype.injectables;
/** @type {?} */
NgAnalyzedFileWithInjectables.prototype.shallowModules;
/**
 * @record
 */
export function NgAnalyzedFile() { }
/** @type {?} */
NgAnalyzedFile.prototype.fileName;
/** @type {?} */
NgAnalyzedFile.prototype.directives;
/** @type {?} */
NgAnalyzedFile.prototype.pipes;
/** @type {?} */
NgAnalyzedFile.prototype.ngModules;
/** @type {?} */
NgAnalyzedFile.prototype.injectables;
/** @type {?} */
NgAnalyzedFile.prototype.exportsNonSourceFiles;
/**
 * @record
 */
export function NgAnalyzeModulesHost() { }
/** @type {?} */
NgAnalyzeModulesHost.prototype.isSourceFile;
/**
 * @param {?} fileNames
 * @param {?} host
 * @param {?} staticSymbolResolver
 * @param {?} metadataResolver
 * @return {?}
 */
export function analyzeNgModules(fileNames, host, staticSymbolResolver, metadataResolver) {
    /** @type {?} */
    const files = _analyzeFilesIncludingNonProgramFiles(fileNames, host, staticSymbolResolver, metadataResolver);
    return mergeAnalyzedFiles(files);
}
/**
 * @param {?} fileNames
 * @param {?} host
 * @param {?} staticSymbolResolver
 * @param {?} metadataResolver
 * @return {?}
 */
export function analyzeAndValidateNgModules(fileNames, host, staticSymbolResolver, metadataResolver) {
    return validateAnalyzedModules(analyzeNgModules(fileNames, host, staticSymbolResolver, metadataResolver));
}
/**
 * @param {?} analyzedModules
 * @return {?}
 */
function validateAnalyzedModules(analyzedModules) {
    if (analyzedModules.symbolsMissingModule && analyzedModules.symbolsMissingModule.length) {
        /** @type {?} */
        const messages = analyzedModules.symbolsMissingModule.map(s => `Cannot determine the module for class ${s.name} in ${s.filePath}! Add ${s.name} to the NgModule to fix it.`);
        throw syntaxError(messages.join('\n'));
    }
    return analyzedModules;
}
/**
 * @param {?} fileNames
 * @param {?} host
 * @param {?} staticSymbolResolver
 * @param {?} metadataResolver
 * @return {?}
 */
function _analyzeFilesIncludingNonProgramFiles(fileNames, host, staticSymbolResolver, metadataResolver) {
    /** @type {?} */
    const seenFiles = new Set();
    /** @type {?} */
    const files = [];
    /** @type {?} */
    const visitFile = (fileName) => {
        if (seenFiles.has(fileName) || !host.isSourceFile(fileName)) {
            return false;
        }
        seenFiles.add(fileName);
        /** @type {?} */
        const analyzedFile = analyzeFile(host, staticSymbolResolver, metadataResolver, fileName);
        files.push(analyzedFile);
        analyzedFile.ngModules.forEach(ngModule => {
            ngModule.transitiveModule.modules.forEach(modMeta => visitFile(modMeta.reference.filePath));
        });
    };
    fileNames.forEach((fileName) => visitFile(fileName));
    return files;
}
/**
 * @param {?} host
 * @param {?} staticSymbolResolver
 * @param {?} metadataResolver
 * @param {?} fileName
 * @return {?}
 */
export function analyzeFile(host, staticSymbolResolver, metadataResolver, fileName) {
    /** @type {?} */
    const directives = [];
    /** @type {?} */
    const pipes = [];
    /** @type {?} */
    const injectables = [];
    /** @type {?} */
    const ngModules = [];
    /** @type {?} */
    const hasDecorators = staticSymbolResolver.hasDecorators(fileName);
    /** @type {?} */
    let exportsNonSourceFiles = false;
    // Don't analyze .d.ts files that have no decorators as a shortcut
    // to speed up the analysis. This prevents us from
    // resolving the references in these files.
    // Note: exportsNonSourceFiles is only needed when compiling with summaries,
    // which is not the case when .d.ts files are treated as input files.
    if (!fileName.endsWith('.d.ts') || hasDecorators) {
        staticSymbolResolver.getSymbolsOf(fileName).forEach((symbol) => {
            /** @type {?} */
            const resolvedSymbol = staticSymbolResolver.resolveSymbol(symbol);
            /** @type {?} */
            const symbolMeta = resolvedSymbol.metadata;
            if (!symbolMeta || symbolMeta.__symbolic === 'error') {
                return;
            }
            /** @type {?} */
            let isNgSymbol = false;
            if (symbolMeta.__symbolic === 'class') {
                if (metadataResolver.isDirective(symbol)) {
                    isNgSymbol = true;
                    directives.push(symbol);
                }
                else if (metadataResolver.isPipe(symbol)) {
                    isNgSymbol = true;
                    pipes.push(symbol);
                }
                else if (metadataResolver.isNgModule(symbol)) {
                    /** @type {?} */
                    const ngModule = metadataResolver.getNgModuleMetadata(symbol, false);
                    if (ngModule) {
                        isNgSymbol = true;
                        ngModules.push(ngModule);
                    }
                }
                else if (metadataResolver.isInjectable(symbol)) {
                    isNgSymbol = true;
                    /** @type {?} */
                    const injectable = metadataResolver.getInjectableMetadata(symbol, null, false);
                    if (injectable) {
                        injectables.push(injectable);
                    }
                }
            }
            if (!isNgSymbol) {
                exportsNonSourceFiles =
                    exportsNonSourceFiles || isValueExportingNonSourceFile(host, symbolMeta);
            }
        });
    }
    return {
        fileName, directives, pipes, ngModules, injectables, exportsNonSourceFiles,
    };
}
/**
 * @param {?} host
 * @param {?} staticSymbolResolver
 * @param {?} metadataResolver
 * @param {?} fileName
 * @return {?}
 */
export function analyzeFileForInjectables(host, staticSymbolResolver, metadataResolver, fileName) {
    /** @type {?} */
    const injectables = [];
    /** @type {?} */
    const shallowModules = [];
    if (staticSymbolResolver.hasDecorators(fileName)) {
        staticSymbolResolver.getSymbolsOf(fileName).forEach((symbol) => {
            /** @type {?} */
            const resolvedSymbol = staticSymbolResolver.resolveSymbol(symbol);
            /** @type {?} */
            const symbolMeta = resolvedSymbol.metadata;
            if (!symbolMeta || symbolMeta.__symbolic === 'error') {
                return;
            }
            if (symbolMeta.__symbolic === 'class') {
                if (metadataResolver.isInjectable(symbol)) {
                    /** @type {?} */
                    const injectable = metadataResolver.getInjectableMetadata(symbol, null, false);
                    if (injectable) {
                        injectables.push(injectable);
                    }
                }
                else if (metadataResolver.isNgModule(symbol)) {
                    /** @type {?} */
                    const module = metadataResolver.getShallowModuleMetadata(symbol);
                    if (module) {
                        shallowModules.push(module);
                    }
                }
            }
        });
    }
    return { fileName, injectables, shallowModules };
}
/**
 * @param {?} host
 * @param {?} metadata
 * @return {?}
 */
function isValueExportingNonSourceFile(host, metadata) {
    /** @type {?} */
    let exportsNonSourceFiles = false;
    class Visitor {
        /**
         * @param {?} arr
         * @param {?} context
         * @return {?}
         */
        visitArray(arr, context) { arr.forEach(v => visitValue(v, this, context)); }
        /**
         * @param {?} map
         * @param {?} context
         * @return {?}
         */
        visitStringMap(map, context) {
            Object.keys(map).forEach((key) => visitValue(map[key], this, context));
        }
        /**
         * @param {?} value
         * @param {?} context
         * @return {?}
         */
        visitPrimitive(value, context) { }
        /**
         * @param {?} value
         * @param {?} context
         * @return {?}
         */
        visitOther(value, context) {
            if (value instanceof StaticSymbol && !host.isSourceFile(value.filePath)) {
                exportsNonSourceFiles = true;
            }
        }
    }
    visitValue(metadata, new Visitor(), null);
    return exportsNonSourceFiles;
}
/**
 * @param {?} analyzedFiles
 * @return {?}
 */
export function mergeAnalyzedFiles(analyzedFiles) {
    /** @type {?} */
    const allNgModules = [];
    /** @type {?} */
    const ngModuleByPipeOrDirective = new Map();
    /** @type {?} */
    const allPipesAndDirectives = new Set();
    analyzedFiles.forEach(af => {
        af.ngModules.forEach(ngModule => {
            allNgModules.push(ngModule);
            ngModule.declaredDirectives.forEach(d => ngModuleByPipeOrDirective.set(d.reference, ngModule));
            ngModule.declaredPipes.forEach(p => ngModuleByPipeOrDirective.set(p.reference, ngModule));
        });
        af.directives.forEach(d => allPipesAndDirectives.add(d));
        af.pipes.forEach(p => allPipesAndDirectives.add(p));
    });
    /** @type {?} */
    const symbolsMissingModule = [];
    allPipesAndDirectives.forEach(ref => {
        if (!ngModuleByPipeOrDirective.has(ref)) {
            symbolsMissingModule.push(ref);
        }
    });
    return {
        ngModules: allNgModules,
        ngModuleByPipeOrDirective,
        symbolsMissingModule,
        files: analyzedFiles
    };
}
/**
 * @param {?} files
 * @return {?}
 */
function mergeAndValidateNgFiles(files) {
    return validateAnalyzedModules(mergeAnalyzedFiles(files));
}
//# sourceMappingURL=compiler.js.map