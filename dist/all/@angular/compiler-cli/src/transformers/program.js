"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var translate_diagnostics_1 = require("../diagnostics/translate_diagnostics");
var typescript_version_1 = require("../diagnostics/typescript_version");
var index_1 = require("../metadata/index");
var program_1 = require("../ngtsc/program");
var api_1 = require("./api");
var compiler_host_1 = require("./compiler_host");
var inline_resources_1 = require("./inline_resources");
var lower_expressions_1 = require("./lower_expressions");
var metadata_cache_1 = require("./metadata_cache");
var node_emitter_transform_1 = require("./node_emitter_transform");
var r3_metadata_transform_1 = require("./r3_metadata_transform");
var r3_strip_decorators_1 = require("./r3_strip_decorators");
var r3_transform_1 = require("./r3_transform");
var tsc_pass_through_1 = require("./tsc_pass_through");
var util_1 = require("./util");
// Closure compiler transforms the form `Service.ngInjectableDef = X` into
// `Service$ngInjectableDef = X`. To prevent this transformation, such assignments need to be
// annotated with @nocollapse. Unfortunately, a bug in Typescript where comments aren't propagated
// through the TS transformations precludes adding the comment via the AST. This workaround detects
// the static assignments to R3 properties such as ngInjectableDef using a regex, as output files
// are written, and applies the annotation through regex replacement.
//
// TODO(alxhub): clean up once fix for TS transformers lands in upstream
//
// Typescript reference issue: https://github.com/Microsoft/TypeScript/issues/22497
// Pattern matching all Render3 property names.
var R3_DEF_NAME_PATTERN = ['ngInjectableDef'].join('|');
// Pattern matching `Identifier.property` where property is a Render3 property.
var R3_DEF_ACCESS_PATTERN = "[^\\s\\.()[\\]]+.(" + R3_DEF_NAME_PATTERN + ")";
// Pattern matching a source line that contains a Render3 static property assignment.
// It declares two matching groups - one for the preceding whitespace, the second for the rest
// of the assignment expression.
var R3_DEF_LINE_PATTERN = "^(\\s*)(" + R3_DEF_ACCESS_PATTERN + " = .*)$";
// Regex compilation of R3_DEF_LINE_PATTERN. Matching group 1 yields the whitespace preceding the
// assignment, matching group 2 gives the rest of the assignment expressions.
var R3_MATCH_DEFS = new RegExp(R3_DEF_LINE_PATTERN, 'gmu');
// Replacement string that complements R3_MATCH_DEFS. It inserts `/** @nocollapse */` before the
// assignment but after any indentation. Note that this will mess up any sourcemaps on this line
// (though there shouldn't be any, since Render3 properties are synthetic).
var R3_NOCOLLAPSE_DEFS = '$1\/** @nocollapse *\/ $2';
/**
 * Maximum number of files that are emitable via calling ts.Program.emit
 * passing individual targetSourceFiles.
 */
var MAX_FILE_COUNT_FOR_SINGLE_FILE_EMIT = 20;
/**
 * Fields to lower within metadata in render2 mode.
 */
var LOWER_FIELDS = ['useValue', 'useFactory', 'data', 'id', 'loadChildren'];
/**
 * Fields to lower within metadata in render3 mode.
 */
var R3_LOWER_FIELDS = LOWER_FIELDS.concat(['providers', 'imports', 'exports']);
var R3_REIFIED_DECORATORS = [
    'Component',
    'Directive',
    'Injectable',
    'NgModule',
    'Pipe',
];
var emptyModules = {
    ngModules: [],
    ngModuleByPipeOrDirective: new Map(),
    files: []
};
var defaultEmitCallback = function (_a) {
    var program = _a.program, targetSourceFile = _a.targetSourceFile, writeFile = _a.writeFile, cancellationToken = _a.cancellationToken, emitOnlyDtsFiles = _a.emitOnlyDtsFiles, customTransformers = _a.customTransformers;
    return program.emit(targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, customTransformers);
};
/**
 * Minimum supported TypeScript version
 * ∀ supported typescript version v, v >= MIN_TS_VERSION
 */
var MIN_TS_VERSION = '2.7.2';
/**
 * Supremum of supported TypeScript versions
 * ∀ supported typescript version v, v < MAX_TS_VERSION
 * MAX_TS_VERSION is not considered as a supported TypeScript version
 */
var MAX_TS_VERSION = '2.10.0';
var AngularCompilerProgram = /** @class */ (function () {
    function AngularCompilerProgram(rootNames, options, host, oldProgram) {
        var _a;
        var _this = this;
        this.options = options;
        this.host = host;
        this._optionsDiagnostics = [];
        this.rootNames = rootNames.slice();
        checkVersion(ts.version, MIN_TS_VERSION, MAX_TS_VERSION, options.disableTypeScriptVersionCheck);
        this.oldTsProgram = oldProgram ? oldProgram.getTsProgram() : undefined;
        if (oldProgram) {
            this.oldProgramLibrarySummaries = oldProgram.getLibrarySummaries();
            this.oldProgramEmittedGeneratedFiles = oldProgram.getEmittedGeneratedFiles();
            this.oldProgramEmittedSourceFiles = oldProgram.getEmittedSourceFiles();
        }
        if (options.flatModuleOutFile) {
            var _b = index_1.createBundleIndexHost(options, this.rootNames, host, function () { return _this.flatModuleMetadataCache; }), bundleHost = _b.host, indexName = _b.indexName, errors = _b.errors;
            if (errors) {
                (_a = this._optionsDiagnostics).push.apply(_a, errors.map(function (e) { return ({
                    category: e.category,
                    messageText: e.messageText,
                    source: api_1.SOURCE,
                    code: api_1.DEFAULT_ERROR_CODE
                }); }));
            }
            else {
                this.rootNames.push(indexName);
                this.host = bundleHost;
            }
        }
        this.loweringMetadataTransform =
            new lower_expressions_1.LowerMetadataTransform(options.enableIvy ? R3_LOWER_FIELDS : LOWER_FIELDS);
        this.metadataCache = this.createMetadataCache([this.loweringMetadataTransform]);
    }
    AngularCompilerProgram.prototype.createMetadataCache = function (transformers) {
        return new metadata_cache_1.MetadataCache(new index_1.MetadataCollector({ quotedNames: true }), !!this.options.strictMetadataEmit, transformers);
    };
    AngularCompilerProgram.prototype.getLibrarySummaries = function () {
        var result = new Map();
        if (this.oldProgramLibrarySummaries) {
            this.oldProgramLibrarySummaries.forEach(function (summary, fileName) { return result.set(fileName, summary); });
        }
        if (this.emittedLibrarySummaries) {
            this.emittedLibrarySummaries.forEach(function (summary, fileName) { return result.set(summary.fileName, summary); });
        }
        return result;
    };
    AngularCompilerProgram.prototype.getEmittedGeneratedFiles = function () {
        var result = new Map();
        if (this.oldProgramEmittedGeneratedFiles) {
            this.oldProgramEmittedGeneratedFiles.forEach(function (genFile, fileName) { return result.set(fileName, genFile); });
        }
        if (this.emittedGeneratedFiles) {
            this.emittedGeneratedFiles.forEach(function (genFile) { return result.set(genFile.genFileUrl, genFile); });
        }
        return result;
    };
    AngularCompilerProgram.prototype.getEmittedSourceFiles = function () {
        var result = new Map();
        if (this.oldProgramEmittedSourceFiles) {
            this.oldProgramEmittedSourceFiles.forEach(function (sf, fileName) { return result.set(fileName, sf); });
        }
        if (this.emittedSourceFiles) {
            this.emittedSourceFiles.forEach(function (sf) { return result.set(sf.fileName, sf); });
        }
        return result;
    };
    AngularCompilerProgram.prototype.getTsProgram = function () { return this.tsProgram; };
    AngularCompilerProgram.prototype.getTsOptionDiagnostics = function (cancellationToken) {
        return this.tsProgram.getOptionsDiagnostics(cancellationToken);
    };
    AngularCompilerProgram.prototype.getNgOptionDiagnostics = function (cancellationToken) {
        return this._optionsDiagnostics.concat(getNgOptionDiagnostics(this.options));
    };
    AngularCompilerProgram.prototype.getTsSyntacticDiagnostics = function (sourceFile, cancellationToken) {
        return this.tsProgram.getSyntacticDiagnostics(sourceFile, cancellationToken);
    };
    AngularCompilerProgram.prototype.getNgStructuralDiagnostics = function (cancellationToken) {
        return this.structuralDiagnostics;
    };
    AngularCompilerProgram.prototype.getTsSemanticDiagnostics = function (sourceFile, cancellationToken) {
        var _this = this;
        var sourceFiles = sourceFile ? [sourceFile] : this.tsProgram.getSourceFiles();
        var diags = [];
        sourceFiles.forEach(function (sf) {
            if (!util_1.GENERATED_FILES.test(sf.fileName)) {
                diags.push.apply(diags, _this.tsProgram.getSemanticDiagnostics(sf, cancellationToken));
            }
        });
        return diags;
    };
    AngularCompilerProgram.prototype.getNgSemanticDiagnostics = function (fileName, cancellationToken) {
        var _this = this;
        var diags = [];
        this.tsProgram.getSourceFiles().forEach(function (sf) {
            if (util_1.GENERATED_FILES.test(sf.fileName) && !sf.isDeclarationFile) {
                diags.push.apply(diags, _this.tsProgram.getSemanticDiagnostics(sf, cancellationToken));
            }
        });
        var ng = translate_diagnostics_1.translateDiagnostics(this.hostAdapter, diags).ng;
        return ng;
    };
    AngularCompilerProgram.prototype.loadNgStructureAsync = function () {
        var _this = this;
        if (this._analyzedModules) {
            throw new Error('Angular structure already loaded');
        }
        return Promise.resolve()
            .then(function () {
            var _a = _this._createProgramWithBasicStubs(), tmpProgram = _a.tmpProgram, sourceFiles = _a.sourceFiles, tsFiles = _a.tsFiles, rootNames = _a.rootNames;
            return _this.compiler.loadFilesAsync(sourceFiles, tsFiles)
                .then(function (_a) {
                var analyzedModules = _a.analyzedModules, analyzedInjectables = _a.analyzedInjectables;
                if (_this._analyzedModules) {
                    throw new Error('Angular structure loaded both synchronously and asynchronously');
                }
                _this._updateProgramWithTypeCheckStubs(tmpProgram, analyzedModules, analyzedInjectables, rootNames);
            });
        })
            .catch(function (e) { return _this._createProgramOnError(e); });
    };
    AngularCompilerProgram.prototype.listLazyRoutes = function (route) {
        // Note: Don't analyzedModules if a route is given
        // to be fast enough.
        return this.compiler.listLazyRoutes(route, route ? undefined : this.analyzedModules);
    };
    AngularCompilerProgram.prototype.emit = function (parameters) {
        if (parameters === void 0) { parameters = {}; }
        if (this.options.enableIvy === 'ngtsc' || this.options.enableIvy === 'tsc') {
            throw new Error('Cannot run legacy compiler in ngtsc mode');
        }
        return this.options.enableIvy === true ? this._emitRender3(parameters) :
            this._emitRender2(parameters);
    };
    AngularCompilerProgram.prototype._annotateR3Properties = function (contents) {
        return contents.replace(R3_MATCH_DEFS, R3_NOCOLLAPSE_DEFS);
    };
    AngularCompilerProgram.prototype._emitRender3 = function (_a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, _c = _b.emitFlags, emitFlags = _c === void 0 ? api_1.EmitFlags.Default : _c, cancellationToken = _b.cancellationToken, customTransformers = _b.customTransformers, _d = _b.emitCallback, emitCallback = _d === void 0 ? defaultEmitCallback : _d, _e = _b.mergeEmitResultsCallback, mergeEmitResultsCallback = _e === void 0 ? mergeEmitResults : _e;
        var emitStart = Date.now();
        if ((emitFlags & (api_1.EmitFlags.JS | api_1.EmitFlags.DTS | api_1.EmitFlags.Metadata | api_1.EmitFlags.Codegen)) ===
            0) {
            return { emitSkipped: true, diagnostics: [], emittedFiles: [] };
        }
        // analyzedModules and analyzedInjectables are created together. If one exists, so does the
        // other.
        var modules = this.compiler.emitAllPartialModules(this.analyzedModules, this._analyzedInjectables);
        var writeTsFile = function (outFileName, outData, writeByteOrderMark, onError, sourceFiles) {
            var sourceFile = sourceFiles && sourceFiles.length == 1 ? sourceFiles[0] : null;
            var genFile;
            if (_this.options.annotateForClosureCompiler && sourceFile &&
                util_1.TS.test(sourceFile.fileName)) {
                outData = _this._annotateR3Properties(outData);
            }
            _this.writeFile(outFileName, outData, writeByteOrderMark, onError, undefined, sourceFiles);
        };
        var emitOnlyDtsFiles = (emitFlags & (api_1.EmitFlags.DTS | api_1.EmitFlags.JS)) == api_1.EmitFlags.DTS;
        var tsCustomTransformers = this.calculateTransforms(
        /* genFiles */ undefined, /* partialModules */ modules, 
        /* stripDecorators */ this.reifiedDecorators, customTransformers);
        // Restore the original references before we emit so TypeScript doesn't emit
        // a reference to the .d.ts file.
        var augmentedReferences = new Map();
        for (var _i = 0, _f = this.tsProgram.getSourceFiles(); _i < _f.length; _i++) {
            var sourceFile = _f[_i];
            var originalReferences = compiler_host_1.getOriginalReferences(sourceFile);
            if (originalReferences) {
                augmentedReferences.set(sourceFile, sourceFile.referencedFiles);
                sourceFile.referencedFiles = originalReferences;
            }
        }
        try {
            return emitCallback({
                program: this.tsProgram,
                host: this.host,
                options: this.options,
                writeFile: writeTsFile, emitOnlyDtsFiles: emitOnlyDtsFiles,
                customTransformers: tsCustomTransformers
            });
        }
        finally {
            // Restore the references back to the augmented value to ensure that the
            // checks that TypeScript makes for project structure reuse will succeed.
            for (var _g = 0, _h = Array.from(augmentedReferences); _g < _h.length; _g++) {
                var _j = _h[_g], sourceFile = _j[0], references = _j[1];
                // TODO(chuckj): Remove any cast after updating build to 2.6
                sourceFile.referencedFiles = references;
            }
        }
    };
    AngularCompilerProgram.prototype._emitRender2 = function (_a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, _c = _b.emitFlags, emitFlags = _c === void 0 ? api_1.EmitFlags.Default : _c, cancellationToken = _b.cancellationToken, customTransformers = _b.customTransformers, _d = _b.emitCallback, emitCallback = _d === void 0 ? defaultEmitCallback : _d, _e = _b.mergeEmitResultsCallback, mergeEmitResultsCallback = _e === void 0 ? mergeEmitResults : _e;
        var emitStart = Date.now();
        if (emitFlags & api_1.EmitFlags.I18nBundle) {
            var locale = this.options.i18nOutLocale || null;
            var file = this.options.i18nOutFile || null;
            var format = this.options.i18nOutFormat || null;
            var bundle = this.compiler.emitMessageBundle(this.analyzedModules, locale);
            i18nExtract(format, file, this.host, this.options, bundle);
        }
        if ((emitFlags & (api_1.EmitFlags.JS | api_1.EmitFlags.DTS | api_1.EmitFlags.Metadata | api_1.EmitFlags.Codegen)) ===
            0) {
            return { emitSkipped: true, diagnostics: [], emittedFiles: [] };
        }
        var _f = this.generateFilesForEmit(emitFlags), genFiles = _f.genFiles, genDiags = _f.genDiags;
        if (genDiags.length) {
            return {
                diagnostics: genDiags,
                emitSkipped: true,
                emittedFiles: [],
            };
        }
        this.emittedGeneratedFiles = genFiles;
        var outSrcMapping = [];
        var genFileByFileName = new Map();
        genFiles.forEach(function (genFile) { return genFileByFileName.set(genFile.genFileUrl, genFile); });
        this.emittedLibrarySummaries = [];
        var emittedSourceFiles = [];
        var writeTsFile = function (outFileName, outData, writeByteOrderMark, onError, sourceFiles) {
            var sourceFile = sourceFiles && sourceFiles.length == 1 ? sourceFiles[0] : null;
            var genFile;
            if (sourceFile) {
                outSrcMapping.push({ outFileName: outFileName, sourceFile: sourceFile });
                genFile = genFileByFileName.get(sourceFile.fileName);
                if (!sourceFile.isDeclarationFile && !util_1.GENERATED_FILES.test(sourceFile.fileName)) {
                    // Note: sourceFile is the transformed sourcefile, not the original one!
                    var originalFile = _this.tsProgram.getSourceFile(sourceFile.fileName);
                    if (originalFile) {
                        emittedSourceFiles.push(originalFile);
                    }
                }
                if (_this.options.annotateForClosureCompiler && util_1.TS.test(sourceFile.fileName)) {
                    outData = _this._annotateR3Properties(outData);
                }
            }
            _this.writeFile(outFileName, outData, writeByteOrderMark, onError, genFile, sourceFiles);
        };
        var modules = this._analyzedInjectables &&
            this.compiler.emitAllPartialModules2(this._analyzedInjectables);
        var tsCustomTransformers = this.calculateTransforms(genFileByFileName, modules, /* stripDecorators */ undefined, customTransformers);
        var emitOnlyDtsFiles = (emitFlags & (api_1.EmitFlags.DTS | api_1.EmitFlags.JS)) == api_1.EmitFlags.DTS;
        // Restore the original references before we emit so TypeScript doesn't emit
        // a reference to the .d.ts file.
        var augmentedReferences = new Map();
        for (var _i = 0, _g = this.tsProgram.getSourceFiles(); _i < _g.length; _i++) {
            var sourceFile = _g[_i];
            var originalReferences = compiler_host_1.getOriginalReferences(sourceFile);
            if (originalReferences) {
                augmentedReferences.set(sourceFile, sourceFile.referencedFiles);
                sourceFile.referencedFiles = originalReferences;
            }
        }
        var genTsFiles = [];
        var genJsonFiles = [];
        genFiles.forEach(function (gf) {
            if (gf.stmts) {
                genTsFiles.push(gf);
            }
            if (gf.source) {
                genJsonFiles.push(gf);
            }
        });
        var emitResult;
        var emittedUserTsCount;
        try {
            var sourceFilesToEmit = this.getSourceFilesForEmit();
            if (sourceFilesToEmit &&
                (sourceFilesToEmit.length + genTsFiles.length) < MAX_FILE_COUNT_FOR_SINGLE_FILE_EMIT) {
                var fileNamesToEmit = sourceFilesToEmit.map(function (sf) { return sf.fileName; }).concat(genTsFiles.map(function (gf) { return gf.genFileUrl; }));
                emitResult = mergeEmitResultsCallback(fileNamesToEmit.map(function (fileName) { return emitResult = emitCallback({
                    program: _this.tsProgram,
                    host: _this.host,
                    options: _this.options,
                    writeFile: writeTsFile, emitOnlyDtsFiles: emitOnlyDtsFiles,
                    customTransformers: tsCustomTransformers,
                    targetSourceFile: _this.tsProgram.getSourceFile(fileName),
                }); }));
                emittedUserTsCount = sourceFilesToEmit.length;
            }
            else {
                emitResult = emitCallback({
                    program: this.tsProgram,
                    host: this.host,
                    options: this.options,
                    writeFile: writeTsFile, emitOnlyDtsFiles: emitOnlyDtsFiles,
                    customTransformers: tsCustomTransformers
                });
                emittedUserTsCount = this.tsProgram.getSourceFiles().length - genTsFiles.length;
            }
        }
        finally {
            // Restore the references back to the augmented value to ensure that the
            // checks that TypeScript makes for project structure reuse will succeed.
            for (var _h = 0, _j = Array.from(augmentedReferences); _h < _j.length; _h++) {
                var _k = _j[_h], sourceFile = _k[0], references = _k[1];
                // TODO(chuckj): Remove any cast after updating build to 2.6
                sourceFile.referencedFiles = references;
            }
        }
        this.emittedSourceFiles = emittedSourceFiles;
        // Match behavior of tsc: only produce emit diagnostics if it would block
        // emit. If noEmitOnError is false, the emit will happen in spite of any
        // errors, so we should not report them.
        if (this.options.noEmitOnError === true) {
            // translate the diagnostics in the emitResult as well.
            var translatedEmitDiags = translate_diagnostics_1.translateDiagnostics(this.hostAdapter, emitResult.diagnostics);
            emitResult.diagnostics = translatedEmitDiags.ts.concat(this.structuralDiagnostics.concat(translatedEmitDiags.ng).map(util_1.ngToTsDiagnostic));
        }
        if (!outSrcMapping.length) {
            // if no files were emitted by TypeScript, also don't emit .json files
            emitResult.diagnostics =
                emitResult.diagnostics.concat([util_1.createMessageDiagnostic("Emitted no files.")]);
            return emitResult;
        }
        var sampleSrcFileName;
        var sampleOutFileName;
        if (outSrcMapping.length) {
            sampleSrcFileName = outSrcMapping[0].sourceFile.fileName;
            sampleOutFileName = outSrcMapping[0].outFileName;
        }
        var srcToOutPath = createSrcToOutPathMapper(this.options.outDir, sampleSrcFileName, sampleOutFileName);
        if (emitFlags & api_1.EmitFlags.Codegen) {
            genJsonFiles.forEach(function (gf) {
                var outFileName = srcToOutPath(gf.genFileUrl);
                _this.writeFile(outFileName, gf.source, false, undefined, gf);
            });
        }
        var metadataJsonCount = 0;
        if (emitFlags & api_1.EmitFlags.Metadata) {
            this.tsProgram.getSourceFiles().forEach(function (sf) {
                if (!sf.isDeclarationFile && !util_1.GENERATED_FILES.test(sf.fileName)) {
                    metadataJsonCount++;
                    var metadata = _this.metadataCache.getMetadata(sf);
                    if (metadata) {
                        var metadataText = JSON.stringify([metadata]);
                        var outFileName = srcToOutPath(sf.fileName.replace(/\.tsx?$/, '.metadata.json'));
                        _this.writeFile(outFileName, metadataText, false, undefined, undefined, [sf]);
                    }
                }
            });
        }
        var emitEnd = Date.now();
        if (this.options.diagnostics) {
            emitResult.diagnostics = emitResult.diagnostics.concat([util_1.createMessageDiagnostic([
                    "Emitted in " + (emitEnd - emitStart) + "ms",
                    "- " + emittedUserTsCount + " user ts files",
                    "- " + genTsFiles.length + " generated ts files",
                    "- " + (genJsonFiles.length + metadataJsonCount) + " generated json files",
                ].join('\n'))]);
        }
        return emitResult;
    };
    Object.defineProperty(AngularCompilerProgram.prototype, "compiler", {
        // Private members
        get: function () {
            if (!this._compiler) {
                this._createCompiler();
            }
            return this._compiler;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngularCompilerProgram.prototype, "hostAdapter", {
        get: function () {
            if (!this._hostAdapter) {
                this._createCompiler();
            }
            return this._hostAdapter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngularCompilerProgram.prototype, "analyzedModules", {
        get: function () {
            if (!this._analyzedModules) {
                this.initSync();
            }
            return this._analyzedModules;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngularCompilerProgram.prototype, "structuralDiagnostics", {
        get: function () {
            var diagnostics = this._structuralDiagnostics;
            if (!diagnostics) {
                this.initSync();
                diagnostics = (this._structuralDiagnostics = this._structuralDiagnostics || []);
            }
            return diagnostics;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngularCompilerProgram.prototype, "tsProgram", {
        get: function () {
            if (!this._tsProgram) {
                this.initSync();
            }
            return this._tsProgram;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngularCompilerProgram.prototype, "reifiedDecorators", {
        get: function () {
            if (!this._reifiedDecorators) {
                var reflector_1 = this.compiler.reflector;
                this._reifiedDecorators = new Set(R3_REIFIED_DECORATORS.map(function (name) { return reflector_1.findDeclaration('@angular/core', name); }));
            }
            return this._reifiedDecorators;
        },
        enumerable: true,
        configurable: true
    });
    AngularCompilerProgram.prototype.calculateTransforms = function (genFiles, partialModules, stripDecorators, customTransformers) {
        var beforeTs = [];
        var metadataTransforms = [];
        var flatModuleMetadataTransforms = [];
        if (this.options.enableResourceInlining) {
            beforeTs.push(inline_resources_1.getInlineResourcesTransformFactory(this.tsProgram, this.hostAdapter));
            var transformer = new inline_resources_1.InlineResourcesMetadataTransformer(this.hostAdapter);
            metadataTransforms.push(transformer);
            flatModuleMetadataTransforms.push(transformer);
        }
        if (!this.options.disableExpressionLowering) {
            beforeTs.push(lower_expressions_1.getExpressionLoweringTransformFactory(this.loweringMetadataTransform, this.tsProgram));
            metadataTransforms.push(this.loweringMetadataTransform);
        }
        if (genFiles) {
            beforeTs.push(node_emitter_transform_1.getAngularEmitterTransformFactory(genFiles, this.getTsProgram()));
        }
        if (partialModules) {
            beforeTs.push(r3_transform_1.getAngularClassTransformerFactory(partialModules));
            // If we have partial modules, the cached metadata might be incorrect as it doesn't reflect
            // the partial module transforms.
            var transformer = new r3_metadata_transform_1.PartialModuleMetadataTransformer(partialModules);
            metadataTransforms.push(transformer);
            flatModuleMetadataTransforms.push(transformer);
        }
        if (stripDecorators) {
            beforeTs.push(r3_strip_decorators_1.getDecoratorStripTransformerFactory(stripDecorators, this.compiler.reflector, this.getTsProgram().getTypeChecker()));
            var transformer = new r3_strip_decorators_1.StripDecoratorsMetadataTransformer(stripDecorators, this.compiler.reflector);
            metadataTransforms.push(transformer);
            flatModuleMetadataTransforms.push(transformer);
        }
        if (customTransformers && customTransformers.beforeTs) {
            beforeTs.push.apply(beforeTs, customTransformers.beforeTs);
        }
        if (metadataTransforms.length > 0) {
            this.metadataCache = this.createMetadataCache(metadataTransforms);
        }
        if (flatModuleMetadataTransforms.length > 0) {
            this.flatModuleMetadataCache = this.createMetadataCache(flatModuleMetadataTransforms);
        }
        var afterTs = customTransformers ? customTransformers.afterTs : undefined;
        return { before: beforeTs, after: afterTs };
    };
    AngularCompilerProgram.prototype.initSync = function () {
        if (this._analyzedModules) {
            return;
        }
        try {
            var _a = this._createProgramWithBasicStubs(), tmpProgram = _a.tmpProgram, sourceFiles = _a.sourceFiles, tsFiles = _a.tsFiles, rootNames = _a.rootNames;
            var _b = this.compiler.loadFilesSync(sourceFiles, tsFiles), analyzedModules = _b.analyzedModules, analyzedInjectables = _b.analyzedInjectables;
            this._updateProgramWithTypeCheckStubs(tmpProgram, analyzedModules, analyzedInjectables, rootNames);
        }
        catch (e) {
            this._createProgramOnError(e);
        }
    };
    AngularCompilerProgram.prototype._createCompiler = function () {
        var _this = this;
        var codegen = {
            generateFile: function (genFileName, baseFileName) {
                return _this._compiler.emitBasicStub(genFileName, baseFileName);
            },
            findGeneratedFileNames: function (fileName) { return _this._compiler.findGeneratedFileNames(fileName); },
        };
        this._hostAdapter = new compiler_host_1.TsCompilerAotCompilerTypeCheckHostAdapter(this.rootNames, this.options, this.host, this.metadataCache, codegen, this.oldProgramLibrarySummaries);
        var aotOptions = getAotCompilerOptions(this.options);
        var errorCollector = (this.options.collectAllErrors || this.options.fullTemplateTypeCheck) ?
            function (err) { return _this._addStructuralDiagnostics(err); } :
            undefined;
        this._compiler = compiler_1.createAotCompiler(this._hostAdapter, aotOptions, errorCollector).compiler;
    };
    AngularCompilerProgram.prototype._createProgramWithBasicStubs = function () {
        var _this = this;
        if (this._analyzedModules) {
            throw new Error("Internal Error: already initialized!");
        }
        // Note: This is important to not produce a memory leak!
        var oldTsProgram = this.oldTsProgram;
        this.oldTsProgram = undefined;
        var codegen = {
            generateFile: function (genFileName, baseFileName) {
                return _this.compiler.emitBasicStub(genFileName, baseFileName);
            },
            findGeneratedFileNames: function (fileName) { return _this.compiler.findGeneratedFileNames(fileName); },
        };
        var rootNames = this.rootNames.slice();
        if (this.options.generateCodeForLibraries !== false) {
            // if we should generateCodeForLibraries, never include
            // generated files in the program as otherwise we will
            // overwrite them and typescript will report the error
            // TS5055: Cannot write file ... because it would overwrite input file.
            rootNames = rootNames.filter(function (fn) { return !util_1.GENERATED_FILES.test(fn); });
        }
        if (this.options.noResolve) {
            this.rootNames.forEach(function (rootName) {
                if (_this.hostAdapter.shouldGenerateFilesFor(rootName)) {
                    rootNames.push.apply(rootNames, _this.compiler.findGeneratedFileNames(rootName));
                }
            });
        }
        var tmpProgram = ts.createProgram(rootNames, this.options, this.hostAdapter, oldTsProgram);
        var sourceFiles = [];
        var tsFiles = [];
        tmpProgram.getSourceFiles().forEach(function (sf) {
            if (_this.hostAdapter.isSourceFile(sf.fileName)) {
                sourceFiles.push(sf.fileName);
            }
            if (util_1.TS.test(sf.fileName) && !util_1.DTS.test(sf.fileName)) {
                tsFiles.push(sf.fileName);
            }
        });
        return { tmpProgram: tmpProgram, sourceFiles: sourceFiles, tsFiles: tsFiles, rootNames: rootNames };
    };
    AngularCompilerProgram.prototype._updateProgramWithTypeCheckStubs = function (tmpProgram, analyzedModules, analyzedInjectables, rootNames) {
        var _this = this;
        this._analyzedModules = analyzedModules;
        this._analyzedInjectables = analyzedInjectables;
        tmpProgram.getSourceFiles().forEach(function (sf) {
            if (sf.fileName.endsWith('.ngfactory.ts')) {
                var _a = _this.hostAdapter.shouldGenerateFile(sf.fileName), generate = _a.generate, baseFileName = _a.baseFileName;
                if (generate) {
                    // Note: ! is ok as hostAdapter.shouldGenerateFile will always return a baseFileName
                    // for .ngfactory.ts files.
                    var genFile = _this.compiler.emitTypeCheckStub(sf.fileName, baseFileName);
                    if (genFile) {
                        _this.hostAdapter.updateGeneratedFile(genFile);
                    }
                }
            }
        });
        this._tsProgram = ts.createProgram(rootNames, this.options, this.hostAdapter, tmpProgram);
        // Note: the new ts program should be completely reusable by TypeScript as:
        // - we cache all the files in the hostAdapter
        // - new new stubs use the exactly same imports/exports as the old once (we assert that in
        // hostAdapter.updateGeneratedFile).
        if (util_1.tsStructureIsReused(tmpProgram) !== 2 /* Completely */) {
            throw new Error("Internal Error: The structure of the program changed during codegen.");
        }
    };
    AngularCompilerProgram.prototype._createProgramOnError = function (e) {
        // Still fill the analyzedModules and the tsProgram
        // so that we don't cause other errors for users who e.g. want to emit the ngProgram.
        this._analyzedModules = emptyModules;
        this.oldTsProgram = undefined;
        this._hostAdapter.isSourceFile = function () { return false; };
        this._tsProgram = ts.createProgram(this.rootNames, this.options, this.hostAdapter);
        if (compiler_1.isSyntaxError(e)) {
            this._addStructuralDiagnostics(e);
            return;
        }
        throw e;
    };
    AngularCompilerProgram.prototype._addStructuralDiagnostics = function (error) {
        var diagnostics = this._structuralDiagnostics || (this._structuralDiagnostics = []);
        if (compiler_1.isSyntaxError(error)) {
            diagnostics.push.apply(diagnostics, syntaxErrorToDiagnostics(error));
        }
        else {
            diagnostics.push({
                messageText: error.toString(),
                category: ts.DiagnosticCategory.Error,
                source: api_1.SOURCE,
                code: api_1.DEFAULT_ERROR_CODE
            });
        }
    };
    // Note: this returns a ts.Diagnostic so that we
    // can return errors in a ts.EmitResult
    AngularCompilerProgram.prototype.generateFilesForEmit = function (emitFlags) {
        var _this = this;
        try {
            if (!(emitFlags & api_1.EmitFlags.Codegen)) {
                return { genFiles: [], genDiags: [] };
            }
            // TODO(tbosch): allow generating files that are not in the rootDir
            // See https://github.com/angular/angular/issues/19337
            var genFiles = this.compiler.emitAllImpls(this.analyzedModules)
                .filter(function (genFile) { return util_1.isInRootDir(genFile.genFileUrl, _this.options); });
            if (this.oldProgramEmittedGeneratedFiles) {
                var oldProgramEmittedGeneratedFiles_1 = this.oldProgramEmittedGeneratedFiles;
                genFiles = genFiles.filter(function (genFile) {
                    var oldGenFile = oldProgramEmittedGeneratedFiles_1.get(genFile.genFileUrl);
                    return !oldGenFile || !genFile.isEquivalent(oldGenFile);
                });
            }
            return { genFiles: genFiles, genDiags: [] };
        }
        catch (e) {
            // TODO(tbosch): check whether we can actually have syntax errors here,
            // as we already parsed the metadata and templates before to create the type check block.
            if (compiler_1.isSyntaxError(e)) {
                var genDiags = [{
                        file: undefined,
                        start: undefined,
                        length: undefined,
                        messageText: e.message,
                        category: ts.DiagnosticCategory.Error,
                        source: api_1.SOURCE,
                        code: api_1.DEFAULT_ERROR_CODE
                    }];
                return { genFiles: [], genDiags: genDiags };
            }
            throw e;
        }
    };
    /**
     * Returns undefined if all files should be emitted.
     */
    AngularCompilerProgram.prototype.getSourceFilesForEmit = function () {
        var _this = this;
        // TODO(tbosch): if one of the files contains a `const enum`
        // always emit all files -> return undefined!
        var sourceFilesToEmit = this.tsProgram.getSourceFiles().filter(function (sf) { return !sf.isDeclarationFile && !util_1.GENERATED_FILES.test(sf.fileName); });
        if (this.oldProgramEmittedSourceFiles) {
            sourceFilesToEmit = sourceFilesToEmit.filter(function (sf) {
                var oldFile = _this.oldProgramEmittedSourceFiles.get(sf.fileName);
                return sf !== oldFile;
            });
        }
        return sourceFilesToEmit;
    };
    AngularCompilerProgram.prototype.writeFile = function (outFileName, outData, writeByteOrderMark, onError, genFile, sourceFiles) {
        // collect emittedLibrarySummaries
        var baseFile;
        if (genFile) {
            baseFile = this.tsProgram.getSourceFile(genFile.srcFileUrl);
            if (baseFile) {
                if (!this.emittedLibrarySummaries) {
                    this.emittedLibrarySummaries = [];
                }
                if (genFile.genFileUrl.endsWith('.ngsummary.json') && baseFile.fileName.endsWith('.d.ts')) {
                    this.emittedLibrarySummaries.push({
                        fileName: baseFile.fileName,
                        text: baseFile.text,
                        sourceFile: baseFile,
                    });
                    this.emittedLibrarySummaries.push({ fileName: genFile.genFileUrl, text: outData });
                    if (!this.options.declaration) {
                        // If we don't emit declarations, still record an empty .ngfactory.d.ts file,
                        // as we might need it later on for resolving module names from summaries.
                        var ngFactoryDts = genFile.genFileUrl.substring(0, genFile.genFileUrl.length - 15) + '.ngfactory.d.ts';
                        this.emittedLibrarySummaries.push({ fileName: ngFactoryDts, text: '' });
                    }
                }
                else if (outFileName.endsWith('.d.ts') && baseFile.fileName.endsWith('.d.ts')) {
                    var dtsSourceFilePath = genFile.genFileUrl.replace(/\.ts$/, '.d.ts');
                    // Note: Don't use sourceFiles here as the created .d.ts has a path in the outDir,
                    // but we need one that is next to the .ts file
                    this.emittedLibrarySummaries.push({ fileName: dtsSourceFilePath, text: outData });
                }
            }
        }
        // Filter out generated files for which we didn't generate code.
        // This can happen as the stub calculation is not completely exact.
        // Note: sourceFile refers to the .ngfactory.ts / .ngsummary.ts file
        // node_emitter_transform already set the file contents to be empty,
        //  so this code only needs to skip the file if !allowEmptyCodegenFiles.
        var isGenerated = util_1.GENERATED_FILES.test(outFileName);
        if (isGenerated && !this.options.allowEmptyCodegenFiles &&
            (!genFile || !genFile.stmts || genFile.stmts.length === 0)) {
            return;
        }
        if (baseFile) {
            sourceFiles = sourceFiles ? sourceFiles.concat([baseFile]) : [baseFile];
        }
        // TODO: remove any when TS 2.4 support is removed.
        this.host.writeFile(outFileName, outData, writeByteOrderMark, onError, sourceFiles);
    };
    return AngularCompilerProgram;
}());
/**
 * Checks whether a given version ∈ [minVersion, maxVersion[
 * An error will be thrown if the following statements are simultaneously true:
 * - the given version ∉ [minVersion, maxVersion[,
 * - the result of the version check is not meant to be bypassed (the parameter disableVersionCheck
 * is false)
 *
 * @param version The version on which the check will be performed
 * @param minVersion The lower bound version. A valid version needs to be greater than minVersion
 * @param maxVersion The upper bound version. A valid version needs to be strictly less than
 * maxVersion
 * @param disableVersionCheck Indicates whether version check should be bypassed
 *
 * @throws Will throw an error if the following statements are simultaneously true:
 * - the given version ∉ [minVersion, maxVersion[,
 * - the result of the version check is not meant to be bypassed (the parameter disableVersionCheck
 * is false)
 */
function checkVersion(version, minVersion, maxVersion, disableVersionCheck) {
    if ((typescript_version_1.compareVersions(version, minVersion) < 0 || typescript_version_1.compareVersions(version, maxVersion) >= 0) &&
        !disableVersionCheck) {
        throw new Error("The Angular Compiler requires TypeScript >=" + minVersion + " and <" + maxVersion + " but " + version + " was found instead.");
    }
}
exports.checkVersion = checkVersion;
function createProgram(_a) {
    var rootNames = _a.rootNames, options = _a.options, host = _a.host, oldProgram = _a.oldProgram;
    if (options.enableIvy === 'ngtsc') {
        return new program_1.NgtscProgram(rootNames, options, host, oldProgram);
    }
    else if (options.enableIvy === 'tsc') {
        return new tsc_pass_through_1.TscPassThroughProgram(rootNames, options, host, oldProgram);
    }
    return new AngularCompilerProgram(rootNames, options, host, oldProgram);
}
exports.createProgram = createProgram;
// Compute the AotCompiler options
function getAotCompilerOptions(options) {
    var missingTranslation = compiler_1.core.MissingTranslationStrategy.Warning;
    switch (options.i18nInMissingTranslations) {
        case 'ignore':
            missingTranslation = compiler_1.core.MissingTranslationStrategy.Ignore;
            break;
        case 'error':
            missingTranslation = compiler_1.core.MissingTranslationStrategy.Error;
            break;
    }
    var translations = '';
    if (options.i18nInFile) {
        if (!options.i18nInLocale) {
            throw new Error("The translation file (" + options.i18nInFile + ") locale must be provided.");
        }
        translations = fs.readFileSync(options.i18nInFile, 'utf8');
    }
    else {
        // No translations are provided, ignore any errors
        // We still go through i18n to remove i18n attributes
        missingTranslation = compiler_1.core.MissingTranslationStrategy.Ignore;
    }
    return {
        locale: options.i18nInLocale,
        i18nFormat: options.i18nInFormat || options.i18nOutFormat, translations: translations, missingTranslation: missingTranslation,
        enableSummariesForJit: options.enableSummariesForJit,
        preserveWhitespaces: options.preserveWhitespaces,
        fullTemplateTypeCheck: options.fullTemplateTypeCheck,
        allowEmptyCodegenFiles: options.allowEmptyCodegenFiles,
        enableIvy: options.enableIvy,
    };
}
function getNgOptionDiagnostics(options) {
    if (options.annotationsAs) {
        switch (options.annotationsAs) {
            case 'decorators':
            case 'static fields':
                break;
            default:
                return [{
                        messageText: 'Angular compiler options "annotationsAs" only supports "static fields" and "decorators"',
                        category: ts.DiagnosticCategory.Error,
                        source: api_1.SOURCE,
                        code: api_1.DEFAULT_ERROR_CODE
                    }];
        }
    }
    return [];
}
function normalizeSeparators(path) {
    return path.replace(/\\/g, '/');
}
/**
 * Returns a function that can adjust a path from source path to out path,
 * based on an existing mapping from source to out path.
 *
 * TODO(tbosch): talk to the TypeScript team to expose their logic for calculating the `rootDir`
 * if none was specified.
 *
 * Note: This function works on normalized paths from typescript.
 *
 * @param outDir
 * @param outSrcMappings
 */
function createSrcToOutPathMapper(outDir, sampleSrcFileName, sampleOutFileName, host) {
    if (host === void 0) { host = path; }
    var srcToOutPath;
    if (outDir) {
        var path_1 = {}; // Ensure we error if we use `path` instead of `host`.
        if (sampleSrcFileName == null || sampleOutFileName == null) {
            throw new Error("Can't calculate the rootDir without a sample srcFileName / outFileName. ");
        }
        var srcFileDir = normalizeSeparators(host.dirname(sampleSrcFileName));
        var outFileDir = normalizeSeparators(host.dirname(sampleOutFileName));
        if (srcFileDir === outFileDir) {
            return function (srcFileName) { return srcFileName; };
        }
        // calculate the common suffix, stopping
        // at `outDir`.
        var srcDirParts = srcFileDir.split('/');
        var outDirParts = normalizeSeparators(host.relative(outDir, outFileDir)).split('/');
        var i = 0;
        while (i < Math.min(srcDirParts.length, outDirParts.length) &&
            srcDirParts[srcDirParts.length - 1 - i] === outDirParts[outDirParts.length - 1 - i])
            i++;
        var rootDir_1 = srcDirParts.slice(0, srcDirParts.length - i).join('/');
        srcToOutPath = function (srcFileName) { return host.resolve(outDir, host.relative(rootDir_1, srcFileName)); };
    }
    else {
        srcToOutPath = function (srcFileName) { return srcFileName; };
    }
    return srcToOutPath;
}
exports.createSrcToOutPathMapper = createSrcToOutPathMapper;
function i18nExtract(formatName, outFile, host, options, bundle) {
    formatName = formatName || 'xlf';
    // Checks the format and returns the extension
    var ext = i18nGetExtension(formatName);
    var content = i18nSerialize(bundle, formatName, options);
    var dstFile = outFile || "messages." + ext;
    var dstPath = path.resolve(options.outDir || options.basePath, dstFile);
    host.writeFile(dstPath, content, false, undefined, []);
    return [dstPath];
}
exports.i18nExtract = i18nExtract;
function i18nSerialize(bundle, formatName, options) {
    var format = formatName.toLowerCase();
    var serializer;
    switch (format) {
        case 'xmb':
            serializer = new compiler_1.Xmb();
            break;
        case 'xliff2':
        case 'xlf2':
            serializer = new compiler_1.Xliff2();
            break;
        case 'xlf':
        case 'xliff':
        default:
            serializer = new compiler_1.Xliff();
    }
    return bundle.write(serializer, getPathNormalizer(options.basePath));
}
exports.i18nSerialize = i18nSerialize;
function getPathNormalizer(basePath) {
    // normalize source paths by removing the base path and always using "/" as a separator
    return function (sourcePath) {
        sourcePath = basePath ? path.relative(basePath, sourcePath) : sourcePath;
        return sourcePath.split(path.sep).join('/');
    };
}
function i18nGetExtension(formatName) {
    var format = formatName.toLowerCase();
    switch (format) {
        case 'xmb':
            return 'xmb';
        case 'xlf':
        case 'xlif':
        case 'xliff':
        case 'xlf2':
        case 'xliff2':
            return 'xlf';
    }
    throw new Error("Unsupported format \"" + formatName + "\"");
}
exports.i18nGetExtension = i18nGetExtension;
function mergeEmitResults(emitResults) {
    var diagnostics = [];
    var emitSkipped = false;
    var emittedFiles = [];
    for (var _i = 0, emitResults_1 = emitResults; _i < emitResults_1.length; _i++) {
        var er = emitResults_1[_i];
        diagnostics.push.apply(diagnostics, er.diagnostics);
        emitSkipped = emitSkipped || er.emitSkipped;
        emittedFiles.push.apply(emittedFiles, (er.emittedFiles || []));
    }
    return { diagnostics: diagnostics, emitSkipped: emitSkipped, emittedFiles: emittedFiles };
}
function diagnosticSourceOfSpan(span) {
    // For diagnostics, TypeScript only uses the fileName and text properties.
    // The redundant '()' are here is to avoid having clang-format breaking the line incorrectly.
    return { fileName: span.start.file.url, text: span.start.file.content };
}
function diagnosticSourceOfFileName(fileName, program) {
    var sourceFile = program.getSourceFile(fileName);
    if (sourceFile)
        return sourceFile;
    // If we are reporting diagnostics for a source file that is not in the project then we need
    // to fake a source file so the diagnostic formatting routines can emit the file name.
    // The redundant '()' are here is to avoid having clang-format breaking the line incorrectly.
    return { fileName: fileName, text: '' };
}
function diagnosticChainFromFormattedDiagnosticChain(chain) {
    return {
        messageText: chain.message,
        next: chain.next && diagnosticChainFromFormattedDiagnosticChain(chain.next),
        position: chain.position
    };
}
function syntaxErrorToDiagnostics(error) {
    var parserErrors = compiler_1.getParseErrors(error);
    if (parserErrors && parserErrors.length) {
        return parserErrors.map(function (e) { return ({
            messageText: e.contextualMessage(),
            file: diagnosticSourceOfSpan(e.span),
            start: e.span.start.offset,
            length: e.span.end.offset - e.span.start.offset,
            category: ts.DiagnosticCategory.Error,
            source: api_1.SOURCE,
            code: api_1.DEFAULT_ERROR_CODE
        }); });
    }
    else if (compiler_1.isFormattedError(error)) {
        return [{
                messageText: error.message,
                chain: error.chain && diagnosticChainFromFormattedDiagnosticChain(error.chain),
                category: ts.DiagnosticCategory.Error,
                source: api_1.SOURCE,
                code: api_1.DEFAULT_ERROR_CODE,
                position: error.position
            }];
    }
    // Produce a Diagnostic anyway since we know for sure `error` is a SyntaxError
    return [{
            messageText: error.message,
            category: ts.DiagnosticCategory.Error,
            code: api_1.DEFAULT_ERROR_CODE,
            source: api_1.SOURCE,
        }];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3JhbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvdHJhbnNmb3JtZXJzL3Byb2dyYW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBc1o7QUFDdFosdUJBQXlCO0FBQ3pCLDJCQUE2QjtBQUM3QiwrQkFBaUM7QUFFakMsOEVBQXlGO0FBQ3pGLHdFQUFrRTtBQUNsRSwyQ0FBMkY7QUFDM0YsNENBQThDO0FBRTlDLDZCQUFvUDtBQUNwUCxpREFBZ0g7QUFDaEgsdURBQTBHO0FBQzFHLHlEQUFrRztBQUNsRyxtREFBb0U7QUFDcEUsbUVBQTJFO0FBQzNFLGlFQUF5RTtBQUN6RSw2REFBOEc7QUFDOUcsK0NBQWlFO0FBQ2pFLHVEQUF5RDtBQUN6RCwrQkFBMko7QUFHM0osMEVBQTBFO0FBQzFFLDZGQUE2RjtBQUM3RixrR0FBa0c7QUFDbEcsbUdBQW1HO0FBQ25HLGlHQUFpRztBQUNqRyxxRUFBcUU7QUFDckUsRUFBRTtBQUNGLHdFQUF3RTtBQUN4RSxFQUFFO0FBQ0YsbUZBQW1GO0FBRW5GLCtDQUErQztBQUMvQyxJQUFNLG1CQUFtQixHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFMUQsK0VBQStFO0FBQy9FLElBQU0scUJBQXFCLEdBQUcsdUJBQXNCLG1CQUFtQixNQUFHLENBQUM7QUFFM0UscUZBQXFGO0FBQ3JGLDhGQUE4RjtBQUM5RixnQ0FBZ0M7QUFDaEMsSUFBTSxtQkFBbUIsR0FBRyxhQUFXLHFCQUFxQixZQUFTLENBQUM7QUFFdEUsaUdBQWlHO0FBQ2pHLDZFQUE2RTtBQUM3RSxJQUFNLGFBQWEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUU3RCxnR0FBZ0c7QUFDaEcsZ0dBQWdHO0FBQ2hHLDJFQUEyRTtBQUMz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