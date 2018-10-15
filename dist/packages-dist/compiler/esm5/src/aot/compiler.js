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
var StubEmitFlags = {
    Basic: 1, TypeCheck: 2, All: 3,
};
var AotCompiler = /** @class */ (function () {
    function AotCompiler(_config, _options, _host, reflector, _metadataResolver, _templateParser, _styleCompiler, _viewCompiler, _typeCheckCompiler, _ngModuleCompiler, _injectableCompiler, _outputEmitter, _summaryResolver, _symbolResolver) {
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
    AotCompiler.prototype.clearCache = /**
     * @return {?}
     */
    function () { this._metadataResolver.clearCache(); };
    /**
     * @param {?} rootFiles
     * @return {?}
     */
    AotCompiler.prototype.analyzeModulesSync = /**
     * @param {?} rootFiles
     * @return {?}
     */
    function (rootFiles) {
        var _this = this;
        /** @type {?} */
        var analyzeResult = analyzeAndValidateNgModules(rootFiles, this._host, this._symbolResolver, this._metadataResolver);
        analyzeResult.ngModules.forEach(function (ngModule) { return _this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, true); });
        return analyzeResult;
    };
    /**
     * @param {?} rootFiles
     * @return {?}
     */
    AotCompiler.prototype.analyzeModulesAsync = /**
     * @param {?} rootFiles
     * @return {?}
     */
    function (rootFiles) {
        var _this = this;
        /** @type {?} */
        var analyzeResult = analyzeAndValidateNgModules(rootFiles, this._host, this._symbolResolver, this._metadataResolver);
        return Promise
            .all(analyzeResult.ngModules.map(function (ngModule) { return _this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, false); }))
            .then(function () { return analyzeResult; });
    };
    /**
     * @param {?} fileName
     * @return {?}
     */
    AotCompiler.prototype._analyzeFile = /**
     * @param {?} fileName
     * @return {?}
     */
    function (fileName) {
        /** @type {?} */
        var analyzedFile = this._analyzedFiles.get(fileName);
        if (!analyzedFile) {
            analyzedFile =
                analyzeFile(this._host, this._symbolResolver, this._metadataResolver, fileName);
            this._analyzedFiles.set(fileName, analyzedFile);
        }
        return analyzedFile;
    };
    /**
     * @param {?} fileName
     * @return {?}
     */
    AotCompiler.prototype._analyzeFileForInjectables = /**
     * @param {?} fileName
     * @return {?}
     */
    function (fileName) {
        /** @type {?} */
        var analyzedFile = this._analyzedFilesForInjectables.get(fileName);
        if (!analyzedFile) {
            analyzedFile = analyzeFileForInjectables(this._host, this._symbolResolver, this._metadataResolver, fileName);
            this._analyzedFilesForInjectables.set(fileName, analyzedFile);
        }
        return analyzedFile;
    };
    /**
     * @param {?} fileName
     * @return {?}
     */
    AotCompiler.prototype.findGeneratedFileNames = /**
     * @param {?} fileName
     * @return {?}
     */
    function (fileName) {
        var _this = this;
        /** @type {?} */
        var genFileNames = [];
        /** @type {?} */
        var file = this._analyzeFile(fileName);
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
        var fileSuffix = normalizeGenFileSuffix(splitTypescriptSuffix(file.fileName, true)[1]);
        file.directives.forEach(function (dirSymbol) {
            /** @type {?} */
            var compMeta = /** @type {?} */ ((_this._metadataResolver.getNonNormalizedDirectiveMetadata(dirSymbol))).metadata;
            if (!compMeta.isComponent) {
                return;
            } /** @type {?} */
            ((
            // Note: compMeta is a component and therefore template is non null.
            compMeta.template)).styleUrls.forEach(function (styleUrl) {
                /** @type {?} */
                var normalizedUrl = _this._host.resourceNameToFileName(styleUrl, file.fileName);
                if (!normalizedUrl) {
                    throw syntaxError("Couldn't resolve resource " + styleUrl + " relative to " + file.fileName);
                }
                /** @type {?} */
                var needsShim = (/** @type {?} */ ((compMeta.template)).encapsulation || _this._config.defaultEncapsulation) === ViewEncapsulation.Emulated;
                genFileNames.push(_stylesModuleUrl(normalizedUrl, needsShim, fileSuffix));
                if (_this._options.allowEmptyCodegenFiles) {
                    genFileNames.push(_stylesModuleUrl(normalizedUrl, !needsShim, fileSuffix));
                }
            });
        });
        return genFileNames;
    };
    /**
     * @param {?} genFileName
     * @param {?=} originalFileName
     * @return {?}
     */
    AotCompiler.prototype.emitBasicStub = /**
     * @param {?} genFileName
     * @param {?=} originalFileName
     * @return {?}
     */
    function (genFileName, originalFileName) {
        /** @type {?} */
        var outputCtx = this._createOutputContext(genFileName);
        if (genFileName.endsWith('.ngfactory.ts')) {
            if (!originalFileName) {
                throw new Error("Assertion error: require the original file for .ngfactory.ts stubs. File: " + genFileName);
            }
            /** @type {?} */
            var originalFile = this._analyzeFile(originalFileName);
            this._createNgFactoryStub(outputCtx, originalFile, 1 /* Basic */);
        }
        else if (genFileName.endsWith('.ngsummary.ts')) {
            if (this._options.enableSummariesForJit) {
                if (!originalFileName) {
                    throw new Error("Assertion error: require the original file for .ngsummary.ts stubs. File: " + genFileName);
                }
                /** @type {?} */
                var originalFile = this._analyzeFile(originalFileName);
                _createEmptyStub(outputCtx);
                originalFile.ngModules.forEach(function (ngModule) {
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
    };
    /**
     * @param {?} genFileName
     * @param {?} originalFileName
     * @return {?}
     */
    AotCompiler.prototype.emitTypeCheckStub = /**
     * @param {?} genFileName
     * @param {?} originalFileName
     * @return {?}
     */
    function (genFileName, originalFileName) {
        /** @type {?} */
        var originalFile = this._analyzeFile(originalFileName);
        /** @type {?} */
        var outputCtx = this._createOutputContext(genFileName);
        if (genFileName.endsWith('.ngfactory.ts')) {
            this._createNgFactoryStub(outputCtx, originalFile, 2 /* TypeCheck */);
        }
        return outputCtx.statements.length > 0 ?
            this._codegenSourceModule(originalFile.fileName, outputCtx) :
            null;
    };
    /**
     * @param {?} fileNames
     * @param {?} tsFiles
     * @return {?}
     */
    AotCompiler.prototype.loadFilesAsync = /**
     * @param {?} fileNames
     * @param {?} tsFiles
     * @return {?}
     */
    function (fileNames, tsFiles) {
        var _this = this;
        /** @type {?} */
        var files = fileNames.map(function (fileName) { return _this._analyzeFile(fileName); });
        /** @type {?} */
        var loadingPromises = [];
        files.forEach(function (file) { return file.ngModules.forEach(function (ngModule) {
            return loadingPromises.push(_this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, false));
        }); });
        /** @type {?} */
        var analyzedInjectables = tsFiles.map(function (tsFile) { return _this._analyzeFileForInjectables(tsFile); });
        return Promise.all(loadingPromises).then(function (_) { return ({
            analyzedModules: mergeAndValidateNgFiles(files),
            analyzedInjectables: analyzedInjectables,
        }); });
    };
    /**
     * @param {?} fileNames
     * @param {?} tsFiles
     * @return {?}
     */
    AotCompiler.prototype.loadFilesSync = /**
     * @param {?} fileNames
     * @param {?} tsFiles
     * @return {?}
     */
    function (fileNames, tsFiles) {
        var _this = this;
        /** @type {?} */
        var files = fileNames.map(function (fileName) { return _this._analyzeFile(fileName); });
        files.forEach(function (file) { return file.ngModules.forEach(function (ngModule) { return _this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, true); }); });
        /** @type {?} */
        var analyzedInjectables = tsFiles.map(function (tsFile) { return _this._analyzeFileForInjectables(tsFile); });
        return {
            analyzedModules: mergeAndValidateNgFiles(files),
            analyzedInjectables: analyzedInjectables,
        };
    };
    /**
     * @param {?} outputCtx
     * @param {?} file
     * @param {?} emitFlags
     * @return {?}
     */
    AotCompiler.prototype._createNgFactoryStub = /**
     * @param {?} outputCtx
     * @param {?} file
     * @param {?} emitFlags
     * @return {?}
     */
    function (outputCtx, file, emitFlags) {
        var _this = this;
        /** @type {?} */
        var componentId = 0;
        file.ngModules.forEach(function (ngModuleMeta, ngModuleIndex) {
            // Note: the code below needs to executed for StubEmitFlags.Basic and StubEmitFlags.TypeCheck,
            // so we don't change the .ngfactory file too much when adding the type-check block.
            // create exports that user code can reference
            // Note: the code below needs to executed for StubEmitFlags.Basic and StubEmitFlags.TypeCheck,
            // so we don't change the .ngfactory file too much when adding the type-check block.
            // create exports that user code can reference
            _this._ngModuleCompiler.createStub(outputCtx, ngModuleMeta.type.reference);
            /** @type {?} */
            var externalReferences = ngModuleMeta.transitiveModule.directives.map(function (d) { return d.reference; }).concat(ngModuleMeta.transitiveModule.pipes.map(function (d) { return d.reference; }), ngModuleMeta.importedModules.map(function (m) { return m.type.reference; }), ngModuleMeta.exportedModules.map(function (m) { return m.type.reference; }), _this._externalIdentifierReferences([Identifiers.TemplateRef, Identifiers.ElementRef]));
            /** @type {?} */
            var externalReferenceVars = new Map();
            externalReferences.forEach(function (ref, typeIndex) {
                externalReferenceVars.set(ref, "_decl" + ngModuleIndex + "_" + typeIndex);
            });
            externalReferenceVars.forEach(function (varName, reference) {
                outputCtx.statements.push(o.variable(varName)
                    .set(o.NULL_EXPR.cast(o.DYNAMIC_TYPE))
                    .toDeclStmt(o.expressionType(outputCtx.importExpr(reference, /* typeParams */ null, /* useSummaries */ /* useSummaries */ false))));
            });
            if (emitFlags & 2 /* TypeCheck */) {
                // add the type-check block for all components of the NgModule
                ngModuleMeta.declaredDirectives.forEach(function (dirId) {
                    /** @type {?} */
                    var compMeta = _this._metadataResolver.getDirectiveMetadata(dirId.reference);
                    if (!compMeta.isComponent) {
                        return;
                    }
                    componentId++;
                    _this._createTypeCheckBlock(outputCtx, compMeta.type.reference.name + "_Host_" + componentId, ngModuleMeta, _this._metadataResolver.getHostComponentMetadata(compMeta), [compMeta.type], externalReferenceVars);
                    _this._createTypeCheckBlock(outputCtx, compMeta.type.reference.name + "_" + componentId, ngModuleMeta, compMeta, ngModuleMeta.transitiveModule.directives, externalReferenceVars);
                });
            }
        });
        if (outputCtx.statements.length === 0) {
            _createEmptyStub(outputCtx);
        }
    };
    /**
     * @param {?} references
     * @return {?}
     */
    AotCompiler.prototype._externalIdentifierReferences = /**
     * @param {?} references
     * @return {?}
     */
    function (references) {
        /** @type {?} */
        var result = [];
        for (var _i = 0, references_1 = references; _i < references_1.length; _i++) {
            var reference = references_1[_i];
            /** @type {?} */
            var token = createTokenForExternalReference(this.reflector, reference);
            if (token.identifier) {
                result.push(token.identifier.reference);
            }
        }
        return result;
    };
    /**
     * @param {?} ctx
     * @param {?} componentId
     * @param {?} moduleMeta
     * @param {?} compMeta
     * @param {?} directives
     * @param {?} externalReferenceVars
     * @return {?}
     */
    AotCompiler.prototype._createTypeCheckBlock = /**
     * @param {?} ctx
     * @param {?} componentId
     * @param {?} moduleMeta
     * @param {?} compMeta
     * @param {?} directives
     * @param {?} externalReferenceVars
     * @return {?}
     */
    function (ctx, componentId, moduleMeta, compMeta, directives, externalReferenceVars) {
        var _a;
        var _b = this._parseTemplate(compMeta, moduleMeta, directives), parsedTemplate = _b.template, usedPipes = _b.pipes;
        (_a = ctx.statements).push.apply(_a, this._typeCheckCompiler.compileComponent(componentId, compMeta, parsedTemplate, usedPipes, externalReferenceVars, ctx));
    };
    /**
     * @param {?} analyzeResult
     * @param {?} locale
     * @return {?}
     */
    AotCompiler.prototype.emitMessageBundle = /**
     * @param {?} analyzeResult
     * @param {?} locale
     * @return {?}
     */
    function (analyzeResult, locale) {
        var _this = this;
        /** @type {?} */
        var errors = [];
        /** @type {?} */
        var htmlParser = new HtmlParser();
        /** @type {?} */
        var messageBundle = new MessageBundle(htmlParser, [], {}, locale);
        analyzeResult.files.forEach(function (file) {
            /** @type {?} */
            var compMetas = [];
            file.directives.forEach(function (directiveType) {
                /** @type {?} */
                var dirMeta = _this._metadataResolver.getDirectiveMetadata(directiveType);
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
                errors.push.apply(errors, /** @type {?} */ ((messageBundle.updateFromTemplate(html, templateUrl, interpolationConfig))));
            });
        });
        if (errors.length) {
            throw new Error(errors.map(function (e) { return e.toString(); }).join('\n'));
        }
        return messageBundle;
    };
    /**
     * @param {?} __0
     * @param {?} r3Files
     * @return {?}
     */
    AotCompiler.prototype.emitAllPartialModules = /**
     * @param {?} __0
     * @param {?} r3Files
     * @return {?}
     */
    function (_a, r3Files) {
        var _this = this;
        var ngModuleByPipeOrDirective = _a.ngModuleByPipeOrDirective, files = _a.files;
        /** @type {?} */
        var contextMap = new Map();
        /** @type {?} */
        var getContext = function (fileName) {
            if (!contextMap.has(fileName)) {
                contextMap.set(fileName, _this._createOutputContext(fileName));
            }
            return /** @type {?} */ ((contextMap.get(fileName)));
        };
        files.forEach(function (file) { return _this._compilePartialModule(file.fileName, ngModuleByPipeOrDirective, file.directives, file.pipes, file.ngModules, file.injectables, getContext(file.fileName)); });
        r3Files.forEach(function (file) { return _this._compileShallowModules(file.fileName, file.shallowModules, getContext(file.fileName)); });
        return Array.from(contextMap.values())
            .map(function (context) { return ({
            fileName: context.genFilePath,
            statements: context.constantPool.statements.concat(context.statements),
        }); });
    };
    /**
     * @param {?} fileName
     * @param {?} shallowModules
     * @param {?} context
     * @return {?}
     */
    AotCompiler.prototype._compileShallowModules = /**
     * @param {?} fileName
     * @param {?} shallowModules
     * @param {?} context
     * @return {?}
     */
    function (fileName, shallowModules, context) {
        var _this = this;
        shallowModules.forEach(function (module) { return compileR3Module(context, module, _this._injectableCompiler); });
    };
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
    AotCompiler.prototype._compilePartialModule = /**
     * @param {?} fileName
     * @param {?} ngModuleByPipeOrDirective
     * @param {?} directives
     * @param {?} pipes
     * @param {?} ngModules
     * @param {?} injectables
     * @param {?} context
     * @return {?}
     */
    function (fileName, ngModuleByPipeOrDirective, directives, pipes, ngModules, injectables, context) {
        var _this = this;
        /** @type {?} */
        var errors = [];
        /** @type {?} */
        var schemaRegistry = new DomElementSchemaRegistry();
        /** @type {?} */
        var hostBindingParser = new BindingParser(this._templateParser.expressionParser, DEFAULT_INTERPOLATION_CONFIG, schemaRegistry, [], errors);
        // Process all components and directives
        directives.forEach(function (directiveType) {
            /** @type {?} */
            var directiveMetadata = _this._metadataResolver.getDirectiveMetadata(directiveType);
            if (directiveMetadata.isComponent) {
                /** @type {?} */
                var module = /** @type {?} */ ((ngModuleByPipeOrDirective.get(directiveType)));
                module ||
                    error("Cannot determine the module for component '" + identifierName(directiveMetadata.type) + "'");
                /** @type {?} */
                var htmlAst = /** @type {?} */ ((/** @type {?} */ ((directiveMetadata.template)).htmlAst));
                /** @type {?} */
                var preserveWhitespaces = /** @type {?} */ ((/** @type {?} */ ((directiveMetadata)).template)).preserveWhitespaces;
                if (!preserveWhitespaces) {
                    htmlAst = removeWhitespaces(htmlAst);
                }
                /** @type {?} */
                var render3Ast = htmlAstToRender3Ast(htmlAst.rootNodes, hostBindingParser);
                /** @type {?} */
                var directiveTypeBySel_1 = new Map();
                /** @type {?} */
                var directives_1 = module.transitiveModule.directives.map(function (dir) { return _this._metadataResolver.getDirectiveSummary(dir.reference); });
                directives_1.forEach(function (directive) {
                    if (directive.selector) {
                        directiveTypeBySel_1.set(directive.selector, directive.type.reference);
                    }
                });
                /** @type {?} */
                var pipeTypeByName_1 = new Map();
                /** @type {?} */
                var pipes_1 = module.transitiveModule.pipes.map(function (pipe) { return _this._metadataResolver.getPipeSummary(pipe.reference); });
                pipes_1.forEach(function (pipe) { pipeTypeByName_1.set(pipe.name, pipe.type.reference); });
                compileR3Component(context, directiveMetadata, render3Ast, _this.reflector, hostBindingParser, directiveTypeBySel_1, pipeTypeByName_1);
            }
            else {
                compileR3Directive(context, directiveMetadata, _this.reflector, hostBindingParser);
            }
        });
        pipes.forEach(function (pipeType) {
            /** @type {?} */
            var pipeMetadata = _this._metadataResolver.getPipeMetadata(pipeType);
            if (pipeMetadata) {
                compileR3Pipe(context, pipeMetadata, _this.reflector);
            }
        });
        injectables.forEach(function (injectable) { return _this._injectableCompiler.compile(injectable, context); });
    };
    /**
     * @param {?} files
     * @return {?}
     */
    AotCompiler.prototype.emitAllPartialModules2 = /**
     * @param {?} files
     * @return {?}
     */
    function (files) {
        var _this = this;
        // Using reduce like this is a select many pattern (where map is a select pattern)
        return files.reduce(function (r, file) {
            r.push.apply(r, _this._emitPartialModule2(file.fileName, file.injectables));
            return r;
        }, []);
    };
    /**
     * @param {?} fileName
     * @param {?} injectables
     * @return {?}
     */
    AotCompiler.prototype._emitPartialModule2 = /**
     * @param {?} fileName
     * @param {?} injectables
     * @return {?}
     */
    function (fileName, injectables) {
        var _this = this;
        /** @type {?} */
        var context = this._createOutputContext(fileName);
        injectables.forEach(function (injectable) { return _this._injectableCompiler.compile(injectable, context); });
        if (context.statements && context.statements.length > 0) {
            return [{ fileName: fileName, statements: context.constantPool.statements.concat(context.statements) }];
        }
        return [];
    };
    /**
     * @param {?} analyzeResult
     * @return {?}
     */
    AotCompiler.prototype.emitAllImpls = /**
     * @param {?} analyzeResult
     * @return {?}
     */
    function (analyzeResult) {
        var _this = this;
        var ngModuleByPipeOrDirective = analyzeResult.ngModuleByPipeOrDirective, files = analyzeResult.files;
        /** @type {?} */
        var sourceModules = files.map(function (file) { return _this._compileImplFile(file.fileName, ngModuleByPipeOrDirective, file.directives, file.pipes, file.ngModules, file.injectables); });
        return flatten(sourceModules);
    };
    /**
     * @param {?} srcFileUrl
     * @param {?} ngModuleByPipeOrDirective
     * @param {?} directives
     * @param {?} pipes
     * @param {?} ngModules
     * @param {?} injectables
     * @return {?}
     */
    AotCompiler.prototype._compileImplFile = /**
     * @param {?} srcFileUrl
     * @param {?} ngModuleByPipeOrDirective
     * @param {?} directives
     * @param {?} pipes
     * @param {?} ngModules
     * @param {?} injectables
     * @return {?}
     */
    function (srcFileUrl, ngModuleByPipeOrDirective, directives, pipes, ngModules, injectables) {
        var _this = this;
        /** @type {?} */
        var fileSuffix = normalizeGenFileSuffix(splitTypescriptSuffix(srcFileUrl, true)[1]);
        /** @type {?} */
        var generatedFiles = [];
        /** @type {?} */
        var outputCtx = this._createOutputContext(ngfactoryFilePath(srcFileUrl, true));
        generatedFiles.push.apply(generatedFiles, this._createSummary(srcFileUrl, directives, pipes, ngModules, injectables, outputCtx));
        // compile all ng modules
        ngModules.forEach(function (ngModuleMeta) { return _this._compileModule(outputCtx, ngModuleMeta); });
        // compile components
        directives.forEach(function (dirType) {
            /** @type {?} */
            var compMeta = _this._metadataResolver.getDirectiveMetadata(/** @type {?} */ (dirType));
            if (!compMeta.isComponent) {
                return;
            }
            /** @type {?} */
            var ngModule = ngModuleByPipeOrDirective.get(dirType);
            if (!ngModule) {
                throw new Error("Internal Error: cannot determine the module for component " + identifierName(compMeta.type) + "!");
            }
            /** @type {?} */
            var componentStylesheet = _this._styleCompiler.compileComponent(outputCtx, compMeta); /** @type {?} */
            ((
            // Note: compMeta is a component and therefore template is non null.
            compMeta.template)).externalStylesheets.forEach(function (stylesheetMeta) {
                /** @type {?} */
                var shim = _this._styleCompiler.needsStyleShim(compMeta);
                generatedFiles.push(_this._codegenStyles(srcFileUrl, compMeta, stylesheetMeta, shim, fileSuffix));
                if (_this._options.allowEmptyCodegenFiles) {
                    generatedFiles.push(_this._codegenStyles(srcFileUrl, compMeta, stylesheetMeta, !shim, fileSuffix));
                }
            });
            /** @type {?} */
            var compViewVars = _this._compileComponent(outputCtx, compMeta, ngModule, ngModule.transitiveModule.directives, componentStylesheet, fileSuffix);
            _this._compileComponentFactory(outputCtx, compMeta, ngModule, fileSuffix);
        });
        if (outputCtx.statements.length > 0 || this._options.allowEmptyCodegenFiles) {
            /** @type {?} */
            var srcModule = this._codegenSourceModule(srcFileUrl, outputCtx);
            generatedFiles.unshift(srcModule);
        }
        return generatedFiles;
    };
    /**
     * @param {?} srcFileName
     * @param {?} directives
     * @param {?} pipes
     * @param {?} ngModules
     * @param {?} injectables
     * @param {?} ngFactoryCtx
     * @return {?}
     */
    AotCompiler.prototype._createSummary = /**
     * @param {?} srcFileName
     * @param {?} directives
     * @param {?} pipes
     * @param {?} ngModules
     * @param {?} injectables
     * @param {?} ngFactoryCtx
     * @return {?}
     */
    function (srcFileName, directives, pipes, ngModules, injectables, ngFactoryCtx) {
        var _this = this;
        /** @type {?} */
        var symbolSummaries = this._symbolResolver.getSymbolsOf(srcFileName)
            .map(function (symbol) { return _this._symbolResolver.resolveSymbol(symbol); });
        /** @type {?} */
        var typeData = ngModules.map(function (meta) { return ({
            summary: /** @type {?} */ ((_this._metadataResolver.getNgModuleSummary(meta.type.reference))),
            metadata: /** @type {?} */ ((_this._metadataResolver.getNgModuleMetadata(meta.type.reference)))
        }); }).concat(directives.map(function (ref) { return ({
            summary: /** @type {?} */ ((_this._metadataResolver.getDirectiveSummary(ref))),
            metadata: /** @type {?} */ ((_this._metadataResolver.getDirectiveMetadata(ref)))
        }); }), pipes.map(function (ref) { return ({
            summary: /** @type {?} */ ((_this._metadataResolver.getPipeSummary(ref))),
            metadata: /** @type {?} */ ((_this._metadataResolver.getPipeMetadata(ref)))
        }); }), injectables.map(function (ref) { return ({
            summary: /** @type {?} */ ((_this._metadataResolver.getInjectableSummary(ref.symbol))),
            metadata: /** @type {?} */ ((_this._metadataResolver.getInjectableSummary(ref.symbol))).type
        }); }));
        /** @type {?} */
        var forJitOutputCtx = this._options.enableSummariesForJit ?
            this._createOutputContext(summaryForJitFileName(srcFileName, true)) :
            null;
        var _a = serializeSummaries(srcFileName, forJitOutputCtx, this._summaryResolver, this._symbolResolver, symbolSummaries, typeData), json = _a.json, exportAs = _a.exportAs;
        exportAs.forEach(function (entry) {
            ngFactoryCtx.statements.push(o.variable(entry.exportAs).set(ngFactoryCtx.importExpr(entry.symbol)).toDeclStmt(null, [
                o.StmtModifier.Exported
            ]));
        });
        /** @type {?} */
        var summaryJson = new GeneratedFile(srcFileName, summaryFileName(srcFileName), json);
        /** @type {?} */
        var result = [summaryJson];
        if (forJitOutputCtx) {
            result.push(this._codegenSourceModule(srcFileName, forJitOutputCtx));
        }
        return result;
    };
    /**
     * @param {?} outputCtx
     * @param {?} ngModule
     * @return {?}
     */
    AotCompiler.prototype._compileModule = /**
     * @param {?} outputCtx
     * @param {?} ngModule
     * @return {?}
     */
    function (outputCtx, ngModule) {
        /** @type {?} */
        var providers = [];
        if (this._options.locale) {
            /** @type {?} */
            var normalizedLocale = this._options.locale.replace(/_/g, '-');
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
    };
    /**
     * @param {?} outputCtx
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} fileSuffix
     * @return {?}
     */
    AotCompiler.prototype._compileComponentFactory = /**
     * @param {?} outputCtx
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} fileSuffix
     * @return {?}
     */
    function (outputCtx, compMeta, ngModule, fileSuffix) {
        /** @type {?} */
        var hostMeta = this._metadataResolver.getHostComponentMetadata(compMeta);
        /** @type {?} */
        var hostViewFactoryVar = this._compileComponent(outputCtx, hostMeta, ngModule, [compMeta.type], null, fileSuffix)
            .viewClassVar;
        /** @type {?} */
        var compFactoryVar = componentFactoryName(compMeta.type.reference);
        /** @type {?} */
        var inputsExprs = [];
        for (var propName in compMeta.inputs) {
            /** @type {?} */
            var templateName = compMeta.inputs[propName];
            // Don't quote so that the key gets minified...
            inputsExprs.push(new o.LiteralMapEntry(propName, o.literal(templateName), false));
        }
        /** @type {?} */
        var outputsExprs = [];
        for (var propName in compMeta.outputs) {
            /** @type {?} */
            var templateName = compMeta.outputs[propName];
            // Don't quote so that the key gets minified...
            outputsExprs.push(new o.LiteralMapEntry(propName, o.literal(templateName), false));
        }
        outputCtx.statements.push(o.variable(compFactoryVar)
            .set(o.importExpr(Identifiers.createComponentFactory).callFn([
            o.literal(compMeta.selector), outputCtx.importExpr(compMeta.type.reference),
            o.variable(hostViewFactoryVar), new o.LiteralMapExpr(inputsExprs),
            new o.LiteralMapExpr(outputsExprs),
            o.literalArr(/** @type {?} */ ((compMeta.template)).ngContentSelectors.map(function (selector) { return o.literal(selector); }))
        ]))
            .toDeclStmt(o.importType(Identifiers.ComponentFactory, [/** @type {?} */ ((o.expressionType(outputCtx.importExpr(compMeta.type.reference))))], [o.TypeModifier.Const]), [o.StmtModifier.Final, o.StmtModifier.Exported]));
    };
    /**
     * @param {?} outputCtx
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} directiveIdentifiers
     * @param {?} componentStyles
     * @param {?} fileSuffix
     * @return {?}
     */
    AotCompiler.prototype._compileComponent = /**
     * @param {?} outputCtx
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} directiveIdentifiers
     * @param {?} componentStyles
     * @param {?} fileSuffix
     * @return {?}
     */
    function (outputCtx, compMeta, ngModule, directiveIdentifiers, componentStyles, fileSuffix) {
        var _a = this._parseTemplate(compMeta, ngModule, directiveIdentifiers), parsedTemplate = _a.template, usedPipes = _a.pipes;
        /** @type {?} */
        var stylesExpr = componentStyles ? o.variable(componentStyles.stylesVar) : o.literalArr([]);
        /** @type {?} */
        var viewResult = this._viewCompiler.compileComponent(outputCtx, compMeta, parsedTemplate, stylesExpr, usedPipes);
        if (componentStyles) {
            _resolveStyleStatements(this._symbolResolver, componentStyles, this._styleCompiler.needsStyleShim(compMeta), fileSuffix);
        }
        return viewResult;
    };
    /**
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} directiveIdentifiers
     * @return {?}
     */
    AotCompiler.prototype._parseTemplate = /**
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} directiveIdentifiers
     * @return {?}
     */
    function (compMeta, ngModule, directiveIdentifiers) {
        var _this = this;
        if (this._templateAstCache.has(compMeta.type.reference)) {
            return /** @type {?} */ ((this._templateAstCache.get(compMeta.type.reference)));
        }
        /** @type {?} */
        var preserveWhitespaces = /** @type {?} */ ((/** @type {?} */ ((compMeta)).template)).preserveWhitespaces;
        /** @type {?} */
        var directives = directiveIdentifiers.map(function (dir) { return _this._metadataResolver.getDirectiveSummary(dir.reference); });
        /** @type {?} */
        var pipes = ngModule.transitiveModule.pipes.map(function (pipe) { return _this._metadataResolver.getPipeSummary(pipe.reference); });
        /** @type {?} */
        var result = this._templateParser.parse(compMeta, /** @type {?} */ ((/** @type {?} */ ((compMeta.template)).htmlAst)), directives, pipes, ngModule.schemas, templateSourceUrl(ngModule.type, compMeta, /** @type {?} */ ((compMeta.template))), preserveWhitespaces);
        this._templateAstCache.set(compMeta.type.reference, result);
        return result;
    };
    /**
     * @param {?} genFilePath
     * @return {?}
     */
    AotCompiler.prototype._createOutputContext = /**
     * @param {?} genFilePath
     * @return {?}
     */
    function (genFilePath) {
        var _this = this;
        /** @type {?} */
        var importExpr = function (symbol, typeParams, useSummaries) {
            if (typeParams === void 0) { typeParams = null; }
            if (useSummaries === void 0) { useSummaries = true; }
            if (!(symbol instanceof StaticSymbol)) {
                throw new Error("Internal error: unknown identifier " + JSON.stringify(symbol));
            }
            /** @type {?} */
            var arity = _this._symbolResolver.getTypeArity(symbol) || 0;
            var _a = _this._symbolResolver.getImportAs(symbol, useSummaries) || symbol, filePath = _a.filePath, name = _a.name, members = _a.members;
            /** @type {?} */
            var importModule = _this._fileNameToModuleName(filePath, genFilePath);
            /** @type {?} */
            var selfReference = _this._fileNameToModuleName(genFilePath, genFilePath);
            /** @type {?} */
            var moduleName = importModule === selfReference ? null : importModule;
            /** @type {?} */
            var suppliedTypeParams = typeParams || [];
            /** @type {?} */
            var missingTypeParamsCount = arity - suppliedTypeParams.length;
            /** @type {?} */
            var allTypeParams = suppliedTypeParams.concat(new Array(missingTypeParamsCount).fill(o.DYNAMIC_TYPE));
            return members.reduce(function (expr, memberName) { return expr.prop(memberName); }, /** @type {?} */ (o.importExpr(new o.ExternalReference(moduleName, name, null), allTypeParams)));
        };
        return { statements: [], genFilePath: genFilePath, importExpr: importExpr, constantPool: new ConstantPool() };
    };
    /**
     * @param {?} importedFilePath
     * @param {?} containingFilePath
     * @return {?}
     */
    AotCompiler.prototype._fileNameToModuleName = /**
     * @param {?} importedFilePath
     * @param {?} containingFilePath
     * @return {?}
     */
    function (importedFilePath, containingFilePath) {
        return this._summaryResolver.getKnownModuleName(importedFilePath) ||
            this._symbolResolver.getKnownModuleName(importedFilePath) ||
            this._host.fileNameToModuleName(importedFilePath, containingFilePath);
    };
    /**
     * @param {?} srcFileUrl
     * @param {?} compMeta
     * @param {?} stylesheetMetadata
     * @param {?} isShimmed
     * @param {?} fileSuffix
     * @return {?}
     */
    AotCompiler.prototype._codegenStyles = /**
     * @param {?} srcFileUrl
     * @param {?} compMeta
     * @param {?} stylesheetMetadata
     * @param {?} isShimmed
     * @param {?} fileSuffix
     * @return {?}
     */
    function (srcFileUrl, compMeta, stylesheetMetadata, isShimmed, fileSuffix) {
        /** @type {?} */
        var outputCtx = this._createOutputContext(_stylesModuleUrl(/** @type {?} */ ((stylesheetMetadata.moduleUrl)), isShimmed, fileSuffix));
        /** @type {?} */
        var compiledStylesheet = this._styleCompiler.compileStyles(outputCtx, compMeta, stylesheetMetadata, isShimmed);
        _resolveStyleStatements(this._symbolResolver, compiledStylesheet, isShimmed, fileSuffix);
        return this._codegenSourceModule(srcFileUrl, outputCtx);
    };
    /**
     * @param {?} srcFileUrl
     * @param {?} ctx
     * @return {?}
     */
    AotCompiler.prototype._codegenSourceModule = /**
     * @param {?} srcFileUrl
     * @param {?} ctx
     * @return {?}
     */
    function (srcFileUrl, ctx) {
        return new GeneratedFile(srcFileUrl, ctx.genFilePath, ctx.statements);
    };
    /**
     * @param {?=} entryRoute
     * @param {?=} analyzedModules
     * @return {?}
     */
    AotCompiler.prototype.listLazyRoutes = /**
     * @param {?=} entryRoute
     * @param {?=} analyzedModules
     * @return {?}
     */
    function (entryRoute, analyzedModules) {
        /** @type {?} */
        var self = this;
        if (entryRoute) {
            /** @type {?} */
            var symbol = parseLazyRoute(entryRoute, this.reflector).referencedModule;
            return visitLazyRoute(symbol);
        }
        else if (analyzedModules) {
            /** @type {?} */
            var allLazyRoutes = [];
            for (var _i = 0, _a = analyzedModules.ngModules; _i < _a.length; _i++) {
                var ngModule = _a[_i];
                /** @type {?} */
                var lazyRoutes = listLazyRoutes(ngModule, this.reflector);
                for (var _b = 0, lazyRoutes_1 = lazyRoutes; _b < lazyRoutes_1.length; _b++) {
                    var lazyRoute = lazyRoutes_1[_b];
                    allLazyRoutes.push(lazyRoute);
                }
            }
            return allLazyRoutes;
        }
        else {
            throw new Error("Either route or analyzedModules has to be specified!");
        }
        /**
         * @param {?} symbol
         * @param {?=} seenRoutes
         * @param {?=} allLazyRoutes
         * @return {?}
         */
        function visitLazyRoute(symbol, seenRoutes, allLazyRoutes) {
            if (seenRoutes === void 0) { seenRoutes = new Set(); }
            if (allLazyRoutes === void 0) { allLazyRoutes = []; }
            // Support pointing to default exports, but stop recursing there,
            // as the StaticReflector does not yet support default exports.
            if (seenRoutes.has(symbol) || !symbol.name) {
                return allLazyRoutes;
            }
            seenRoutes.add(symbol);
            /** @type {?} */
            var lazyRoutes = listLazyRoutes(/** @type {?} */ ((self._metadataResolver.getNgModuleMetadata(symbol, true))), self.reflector);
            for (var _i = 0, lazyRoutes_2 = lazyRoutes; _i < lazyRoutes_2.length; _i++) {
                var lazyRoute = lazyRoutes_2[_i];
                allLazyRoutes.push(lazyRoute);
                visitLazyRoute(lazyRoute.referencedModule, seenRoutes, allLazyRoutes);
            }
            return allLazyRoutes;
        }
    };
    return AotCompiler;
}());
export { AotCompiler };
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
    compileResult.dependencies.forEach(function (dep) {
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
    return "" + stylesheetUrl + (shim ? '.shim' : '') + ".ngstyle" + suffix;
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
    var files = _analyzeFilesIncludingNonProgramFiles(fileNames, host, staticSymbolResolver, metadataResolver);
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
        var messages = analyzedModules.symbolsMissingModule.map(function (s) {
            return "Cannot determine the module for class " + s.name + " in " + s.filePath + "! Add " + s.name + " to the NgModule to fix it.";
        });
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
    var seenFiles = new Set();
    /** @type {?} */
    var files = [];
    /** @type {?} */
    var visitFile = function (fileName) {
        if (seenFiles.has(fileName) || !host.isSourceFile(fileName)) {
            return false;
        }
        seenFiles.add(fileName);
        /** @type {?} */
        var analyzedFile = analyzeFile(host, staticSymbolResolver, metadataResolver, fileName);
        files.push(analyzedFile);
        analyzedFile.ngModules.forEach(function (ngModule) {
            ngModule.transitiveModule.modules.forEach(function (modMeta) { return visitFile(modMeta.reference.filePath); });
        });
    };
    fileNames.forEach(function (fileName) { return visitFile(fileName); });
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
    var directives = [];
    /** @type {?} */
    var pipes = [];
    /** @type {?} */
    var injectables = [];
    /** @type {?} */
    var ngModules = [];
    /** @type {?} */
    var hasDecorators = staticSymbolResolver.hasDecorators(fileName);
    /** @type {?} */
    var exportsNonSourceFiles = false;
    // Don't analyze .d.ts files that have no decorators as a shortcut
    // to speed up the analysis. This prevents us from
    // resolving the references in these files.
    // Note: exportsNonSourceFiles is only needed when compiling with summaries,
    // which is not the case when .d.ts files are treated as input files.
    if (!fileName.endsWith('.d.ts') || hasDecorators) {
        staticSymbolResolver.getSymbolsOf(fileName).forEach(function (symbol) {
            /** @type {?} */
            var resolvedSymbol = staticSymbolResolver.resolveSymbol(symbol);
            /** @type {?} */
            var symbolMeta = resolvedSymbol.metadata;
            if (!symbolMeta || symbolMeta.__symbolic === 'error') {
                return;
            }
            /** @type {?} */
            var isNgSymbol = false;
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
                    var ngModule = metadataResolver.getNgModuleMetadata(symbol, false);
                    if (ngModule) {
                        isNgSymbol = true;
                        ngModules.push(ngModule);
                    }
                }
                else if (metadataResolver.isInjectable(symbol)) {
                    isNgSymbol = true;
                    /** @type {?} */
                    var injectable = metadataResolver.getInjectableMetadata(symbol, null, false);
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
        fileName: fileName, directives: directives, pipes: pipes, ngModules: ngModules, injectables: injectables, exportsNonSourceFiles: exportsNonSourceFiles,
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
    var injectables = [];
    /** @type {?} */
    var shallowModules = [];
    if (staticSymbolResolver.hasDecorators(fileName)) {
        staticSymbolResolver.getSymbolsOf(fileName).forEach(function (symbol) {
            /** @type {?} */
            var resolvedSymbol = staticSymbolResolver.resolveSymbol(symbol);
            /** @type {?} */
            var symbolMeta = resolvedSymbol.metadata;
            if (!symbolMeta || symbolMeta.__symbolic === 'error') {
                return;
            }
            if (symbolMeta.__symbolic === 'class') {
                if (metadataResolver.isInjectable(symbol)) {
                    /** @type {?} */
                    var injectable = metadataResolver.getInjectableMetadata(symbol, null, false);
                    if (injectable) {
                        injectables.push(injectable);
                    }
                }
                else if (metadataResolver.isNgModule(symbol)) {
                    /** @type {?} */
                    var module = metadataResolver.getShallowModuleMetadata(symbol);
                    if (module) {
                        shallowModules.push(module);
                    }
                }
            }
        });
    }
    return { fileName: fileName, injectables: injectables, shallowModules: shallowModules };
}
/**
 * @param {?} host
 * @param {?} metadata
 * @return {?}
 */
function isValueExportingNonSourceFile(host, metadata) {
    /** @type {?} */
    var exportsNonSourceFiles = false;
    var Visitor = /** @class */ (function () {
        function Visitor() {
        }
        /**
         * @param {?} arr
         * @param {?} context
         * @return {?}
         */
        Visitor.prototype.visitArray = /**
         * @param {?} arr
         * @param {?} context
         * @return {?}
         */
        function (arr, context) {
            var _this = this;
            arr.forEach(function (v) { return visitValue(v, _this, context); });
        };
        /**
         * @param {?} map
         * @param {?} context
         * @return {?}
         */
        Visitor.prototype.visitStringMap = /**
         * @param {?} map
         * @param {?} context
         * @return {?}
         */
        function (map, context) {
            var _this = this;
            Object.keys(map).forEach(function (key) { return visitValue(map[key], _this, context); });
        };
        /**
         * @param {?} value
         * @param {?} context
         * @return {?}
         */
        Visitor.prototype.visitPrimitive = /**
         * @param {?} value
         * @param {?} context
         * @return {?}
         */
        function (value, context) { };
        /**
         * @param {?} value
         * @param {?} context
         * @return {?}
         */
        Visitor.prototype.visitOther = /**
         * @param {?} value
         * @param {?} context
         * @return {?}
         */
        function (value, context) {
            if (value instanceof StaticSymbol && !host.isSourceFile(value.filePath)) {
                exportsNonSourceFiles = true;
            }
        };
        return Visitor;
    }());
    visitValue(metadata, new Visitor(), null);
    return exportsNonSourceFiles;
}
/**
 * @param {?} analyzedFiles
 * @return {?}
 */
export function mergeAnalyzedFiles(analyzedFiles) {
    /** @type {?} */
    var allNgModules = [];
    /** @type {?} */
    var ngModuleByPipeOrDirective = new Map();
    /** @type {?} */
    var allPipesAndDirectives = new Set();
    analyzedFiles.forEach(function (af) {
        af.ngModules.forEach(function (ngModule) {
            allNgModules.push(ngModule);
            ngModule.declaredDirectives.forEach(function (d) { return ngModuleByPipeOrDirective.set(d.reference, ngModule); });
            ngModule.declaredPipes.forEach(function (p) { return ngModuleByPipeOrDirective.set(p.reference, ngModule); });
        });
        af.directives.forEach(function (d) { return allPipesAndDirectives.add(d); });
        af.pipes.forEach(function (p) { return allPipesAndDirectives.add(p); });
    });
    /** @type {?} */
    var symbolsMissingModule = [];
    allPipesAndDirectives.forEach(function (ref) {
        if (!ngModuleByPipeOrDirective.has(ref)) {
            symbolsMissingModule.push(ref);
        }
    });
    return {
        ngModules: allNgModules,
        ngModuleByPipeOrDirective: ngModuleByPipeOrDirective,
        symbolsMissingModule: symbolsMissingModule,
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