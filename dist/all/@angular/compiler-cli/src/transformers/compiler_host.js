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
var path = require("path");
var ts = require("typescript");
var compiler_host_1 = require("../ngtsc/compiler_host");
var metadata_reader_1 = require("./metadata_reader");
var util_1 = require("./util");
var NODE_MODULES_PACKAGE_NAME = /node_modules\/((\w|-|\.)+|(@(\w|-|\.)+\/(\w|-|\.)+))/;
var EXT = /(\.ts|\.d\.ts|\.js|\.jsx|\.tsx)$/;
function createCompilerHost(_a) {
    var options = _a.options, _b = _a.tsHost, tsHost = _b === void 0 ? ts.createCompilerHost(options, true) : _b;
    if (options.enableIvy === 'ngtsc' || options.enableIvy === 'tsc') {
        return new compiler_host_1.NgtscCompilerHost(tsHost);
    }
    return tsHost;
}
exports.createCompilerHost = createCompilerHost;
function assert(condition) {
    if (!condition) {
        // TODO(chuckjaz): do the right thing
    }
    return condition;
}
/**
 * Implements the following hosts based on an api.CompilerHost:
 * - ts.CompilerHost to be consumed by a ts.Program
 * - AotCompilerHost for @angular/compiler
 * - TypeCheckHost for mapping ts errors to ng errors (via translateDiagnostics)
 */
var TsCompilerAotCompilerTypeCheckHostAdapter = /** @class */ (function () {
    function TsCompilerAotCompilerTypeCheckHostAdapter(rootFiles, options, context, metadataProvider, codeGenerator, librarySummaries) {
        if (librarySummaries === void 0) { librarySummaries = new Map(); }
        var _this = this;
        this.rootFiles = rootFiles;
        this.options = options;
        this.context = context;
        this.metadataProvider = metadataProvider;
        this.codeGenerator = codeGenerator;
        this.librarySummaries = librarySummaries;
        this.metadataReaderCache = metadata_reader_1.createMetadataReaderCache();
        this.fileNameToModuleNameCache = new Map();
        this.flatModuleIndexCache = new Map();
        this.flatModuleIndexNames = new Set();
        this.flatModuleIndexRedirectNames = new Set();
        this.originalSourceFiles = new Map();
        this.originalFileExistsCache = new Map();
        this.generatedSourceFiles = new Map();
        this.generatedCodeFor = new Map();
        this.emitter = new compiler_1.TypeScriptEmitter();
        this.getDefaultLibFileName = function (options) {
            return _this.context.getDefaultLibFileName(options);
        };
        this.getCurrentDirectory = function () { return _this.context.getCurrentDirectory(); };
        this.getCanonicalFileName = function (fileName) { return _this.context.getCanonicalFileName(fileName); };
        this.useCaseSensitiveFileNames = function () { return _this.context.useCaseSensitiveFileNames(); };
        this.getNewLine = function () { return _this.context.getNewLine(); };
        // Make sure we do not `host.realpath()` from TS as we do not want to resolve symlinks.
        // https://github.com/Microsoft/TypeScript/issues/9552
        this.realPath = function (p) { return p; };
        this.writeFile = this.context.writeFile.bind(this.context);
        this.moduleResolutionCache = ts.createModuleResolutionCache(this.context.getCurrentDirectory(), this.context.getCanonicalFileName.bind(this.context));
        var basePath = this.options.basePath;
        this.rootDirs =
            (this.options.rootDirs || [this.options.basePath]).map(function (p) { return path.resolve(basePath, p); });
        if (context.getDirectories) {
            this.getDirectories = function (path) { return context.getDirectories(path); };
        }
        if (context.directoryExists) {
            this.directoryExists = function (directoryName) { return context.directoryExists(directoryName); };
        }
        if (context.getCancellationToken) {
            this.getCancellationToken = function () { return context.getCancellationToken(); };
        }
        if (context.getDefaultLibLocation) {
            this.getDefaultLibLocation = function () { return context.getDefaultLibLocation(); };
        }
        if (context.resolveTypeReferenceDirectives) {
            this.resolveTypeReferenceDirectives = function (names, containingFile) {
                return context.resolveTypeReferenceDirectives(names, containingFile);
            };
        }
        if (context.trace) {
            this.trace = function (s) { return context.trace(s); };
        }
        if (context.fileNameToModuleName) {
            this.fileNameToModuleName = context.fileNameToModuleName.bind(context);
        }
        // Note: don't copy over context.moduleNameToFileName as we first
        // normalize undefined containingFile to a filled containingFile.
        if (context.resourceNameToFileName) {
            this.resourceNameToFileName = context.resourceNameToFileName.bind(context);
        }
        if (context.toSummaryFileName) {
            this.toSummaryFileName = context.toSummaryFileName.bind(context);
        }
        if (context.fromSummaryFileName) {
            this.fromSummaryFileName = context.fromSummaryFileName.bind(context);
        }
        this.metadataReaderHost = {
            cacheMetadata: function () { return true; },
            getSourceFileMetadata: function (filePath) {
                var sf = _this.getOriginalSourceFile(filePath);
                return sf ? _this.metadataProvider.getMetadata(sf) : undefined;
            },
            fileExists: function (filePath) { return _this.originalFileExists(filePath); },
            readFile: function (filePath) { return assert(_this.context.readFile(filePath)); },
        };
    }
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.resolveModuleName = function (moduleName, containingFile) {
        var rm = ts.resolveModuleName(moduleName, containingFile.replace(/\\/g, '/'), this.options, this, this.moduleResolutionCache)
            .resolvedModule;
        if (rm && this.isSourceFile(rm.resolvedFileName) && util_1.DTS.test(rm.resolvedFileName)) {
            // Case: generateCodeForLibraries = true and moduleName is
            // a .d.ts file in a node_modules folder.
            // Need to set isExternalLibraryImport to false so that generated files for that file
            // are emitted.
            rm.isExternalLibraryImport = false;
        }
        return rm;
    };
    // Note: We implement this method so that TypeScript and Angular share the same
    // ts.ModuleResolutionCache
    // and that we can tell ts.Program about our different opinion about
    // ResolvedModule.isExternalLibraryImport
    // (see our isSourceFile method).
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.resolveModuleNames = function (moduleNames, containingFile) {
        var _this = this;
        // TODO(tbosch): this seems to be a typing error in TypeScript,
        // as it contains assertions that the result contains the same number of entries
        // as the given module names.
        return moduleNames.map(function (moduleName) { return _this.resolveModuleName(moduleName, containingFile); });
    };
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.moduleNameToFileName = function (m, containingFile) {
        if (!containingFile) {
            if (m.indexOf('.') === 0) {
                throw new Error('Resolution of relative paths requires a containing file.');
            }
            // Any containing file gives the same result for absolute imports
            containingFile = this.rootFiles[0];
        }
        if (this.context.moduleNameToFileName) {
            return this.context.moduleNameToFileName(m, containingFile);
        }
        var resolved = this.resolveModuleName(m, containingFile);
        return resolved ? resolved.resolvedFileName : null;
    };
    /**
     * We want a moduleId that will appear in import statements in the generated code
     * which will be written to `containingFile`.
     *
     * Note that we also generate files for files in node_modules, as libraries
     * only ship .metadata.json files but not the generated code.
     *
     * Logic:
     * 1. if the importedFile and the containingFile are from the project sources
     *    or from the same node_modules package, use a relative path
     * 2. if the importedFile is in a node_modules package,
     *    use a path that starts with the package name.
     * 3. Error if the containingFile is in the node_modules package
     *    and the importedFile is in the project soures,
     *    as that is a violation of the principle that node_modules packages cannot
     *    import project sources.
     */
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.fileNameToModuleName = function (importedFile, containingFile) {
        var cacheKey = importedFile + ":" + containingFile;
        var moduleName = this.fileNameToModuleNameCache.get(cacheKey);
        if (moduleName != null) {
            return moduleName;
        }
        var originalImportedFile = importedFile;
        if (this.options.traceResolution) {
            console.error('fileNameToModuleName from containingFile', containingFile, 'to importedFile', importedFile);
        }
        // drop extension
        importedFile = importedFile.replace(EXT, '');
        var importedFilePackageName = getPackageName(importedFile);
        var containingFilePackageName = getPackageName(containingFile);
        if (importedFilePackageName === containingFilePackageName ||
            util_1.GENERATED_FILES.test(originalImportedFile)) {
            var rootedContainingFile = util_1.relativeToRootDirs(containingFile, this.rootDirs);
            var rootedImportedFile = util_1.relativeToRootDirs(importedFile, this.rootDirs);
            if (rootedContainingFile !== containingFile && rootedImportedFile !== importedFile) {
                // if both files are contained in the `rootDirs`, then strip the rootDirs
                containingFile = rootedContainingFile;
                importedFile = rootedImportedFile;
            }
            moduleName = dotRelative(path.dirname(containingFile), importedFile);
        }
        else if (importedFilePackageName) {
            moduleName = stripNodeModulesPrefix(importedFile);
            if (originalImportedFile.endsWith('.d.ts')) {
                // the moduleName for these typings could be shortented to the npm package name
                // if the npm package typings matches the importedFile
                try {
                    var modulePath = importedFile.substring(0, importedFile.length - moduleName.length) +
                        importedFilePackageName;
                    var packageJson = require(modulePath + '/package.json');
                    var packageTypings = path.posix.join(modulePath, packageJson.typings);
                    if (packageTypings === originalImportedFile) {
                        moduleName = importedFilePackageName;
                    }
                }
                catch (e) {
                    // the above require() will throw if there is no package.json file
                    // and this is safe to ignore and correct to keep the longer
                    // moduleName in this case
                }
            }
        }
        else {
            throw new Error("Trying to import a source file from a node_modules package: import " + originalImportedFile + " from " + containingFile);
        }
        this.fileNameToModuleNameCache.set(cacheKey, moduleName);
        return moduleName;
    };
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.resourceNameToFileName = function (resourceName, containingFile) {
        // Note: we convert package paths into relative paths to be compatible with the the
        // previous implementation of UrlResolver.
        var firstChar = resourceName[0];
        if (firstChar === '/') {
            resourceName = resourceName.slice(1);
        }
        else if (firstChar !== '.') {
            resourceName = "./" + resourceName;
        }
        var filePathWithNgResource = this.moduleNameToFileName(addNgResourceSuffix(resourceName), containingFile);
        var result = filePathWithNgResource ? stripNgResourceSuffix(filePathWithNgResource) : null;
        // Used under Bazel to report more specific error with remediation advice
        if (!result && this.context.reportMissingResource) {
            this.context.reportMissingResource(resourceName);
        }
        return result;
    };
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.toSummaryFileName = function (fileName, referringSrcFileName) {
        return this.fileNameToModuleName(fileName, referringSrcFileName);
    };
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.fromSummaryFileName = function (fileName, referringLibFileName) {
        var resolved = this.moduleNameToFileName(fileName, referringLibFileName);
        if (!resolved) {
            throw new Error("Could not resolve " + fileName + " from " + referringLibFileName);
        }
        return resolved;
    };
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.parseSourceSpanOf = function (fileName, line, character) {
        var data = this.generatedSourceFiles.get(fileName);
        if (data && data.emitCtx) {
            return data.emitCtx.spanOf(line, character);
        }
        return null;
    };
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.getOriginalSourceFile = function (filePath, languageVersion, onError) {
        // Note: we need the explicit check via `has` as we also cache results
        // that were null / undefined.
        if (this.originalSourceFiles.has(filePath)) {
            return this.originalSourceFiles.get(filePath);
        }
        if (!languageVersion) {
            languageVersion = this.options.target || ts.ScriptTarget.Latest;
        }
        // Note: This can also return undefined,
        // as the TS typings are not correct!
        var sf = this.context.getSourceFile(filePath, languageVersion, onError) || null;
        this.originalSourceFiles.set(filePath, sf);
        return sf;
    };
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.updateGeneratedFile = function (genFile) {
        if (!genFile.stmts) {
            throw new Error("Invalid Argument: Expected a GenerateFile with statements. " + genFile.genFileUrl);
        }
        var oldGenFile = this.generatedSourceFiles.get(genFile.genFileUrl);
        if (!oldGenFile) {
            throw new Error("Illegal State: previous GeneratedFile not found for " + genFile.genFileUrl + ".");
        }
        var newRefs = genFileExternalReferences(genFile);
        var oldRefs = oldGenFile.externalReferences;
        var refsAreEqual = oldRefs.size === newRefs.size;
        if (refsAreEqual) {
            newRefs.forEach(function (r) { return refsAreEqual = refsAreEqual && oldRefs.has(r); });
        }
        if (!refsAreEqual) {
            throw new Error("Illegal State: external references changed in " + genFile.genFileUrl + ".\nOld: " + Array.from(oldRefs) + ".\nNew: " + Array.from(newRefs));
        }
        return this.addGeneratedFile(genFile, newRefs);
    };
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.addGeneratedFile = function (genFile, externalReferences) {
        if (!genFile.stmts) {
            throw new Error("Invalid Argument: Expected a GenerateFile with statements. " + genFile.genFileUrl);
        }
        var _a = this.emitter.emitStatementsAndContext(genFile.genFileUrl, genFile.stmts, /* preamble */ '', 
        /* emitSourceMaps */ false), sourceText = _a.sourceText, context = _a.context;
        var sf = ts.createSourceFile(genFile.genFileUrl, sourceText, this.options.target || ts.ScriptTarget.Latest);
        if ((this.options.module === ts.ModuleKind.AMD || this.options.module === ts.ModuleKind.UMD) &&
            this.context.amdModuleName) {
            var moduleName = this.context.amdModuleName(sf);
            if (moduleName)
                sf.moduleName = moduleName;
        }
        this.generatedSourceFiles.set(genFile.genFileUrl, {
            sourceFile: sf,
            emitCtx: context, externalReferences: externalReferences,
        });
        return sf;
    };
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.shouldGenerateFile = function (fileName) {
        var _this = this;
        // TODO(tbosch): allow generating files that are not in the rootDir
        // See https://github.com/angular/angular/issues/19337
        if (!util_1.isInRootDir(fileName, this.options)) {
            return { generate: false };
        }
        var genMatch = util_1.GENERATED_FILES.exec(fileName);
        if (!genMatch) {
            return { generate: false };
        }
        var base = genMatch[1], genSuffix = genMatch[2], suffix = genMatch[3];
        if (suffix !== 'ts' && suffix !== 'tsx') {
            return { generate: false };
        }
        var baseFileName;
        if (genSuffix.indexOf('ngstyle') >= 0) {
            // Note: ngstyle files have names like `afile.css.ngstyle.ts`
            if (!this.originalFileExists(base)) {
                return { generate: false };
            }
        }
        else {
            // Note: on-the-fly generated files always have a `.ts` suffix,
            // but the file from which we generated it can be a `.ts`/ `.tsx`/ `.d.ts`
            // (see options.generateCodeForLibraries).
            baseFileName = [base + ".ts", base + ".tsx", base + ".d.ts"].find(function (baseFileName) { return _this.isSourceFile(baseFileName) && _this.originalFileExists(baseFileName); });
            if (!baseFileName) {
                return { generate: false };
            }
        }
        return { generate: true, baseFileName: baseFileName };
    };
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.shouldGenerateFilesFor = function (fileName) {
        // TODO(tbosch): allow generating files that are not in the rootDir
        // See https://github.com/angular/angular/issues/19337
        return !util_1.GENERATED_FILES.test(fileName) && this.isSourceFile(fileName) &&
            util_1.isInRootDir(fileName, this.options);
    };
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.getSourceFile = function (fileName, languageVersion, onError) {
        var _this = this;
        // Note: Don't exit early in this method to make sure
        // we always have up to date references on the file!
        var genFileNames = [];
        var sf = this.getGeneratedFile(fileName);
        if (!sf) {
            var summary = this.librarySummaries.get(fileName);
            if (summary) {
                if (!summary.sourceFile) {
                    summary.sourceFile = ts.createSourceFile(fileName, summary.text, this.options.target || ts.ScriptTarget.Latest);
                }
                sf = summary.sourceFile;
                genFileNames = [];
            }
        }
        if (!sf) {
            sf = this.getOriginalSourceFile(fileName);
            var cachedGenFiles = this.generatedCodeFor.get(fileName);
            if (cachedGenFiles) {
                genFileNames = cachedGenFiles;
            }
            else {
                if (!this.options.noResolve && this.shouldGenerateFilesFor(fileName)) {
                    genFileNames = this.codeGenerator.findGeneratedFileNames(fileName).filter(function (fileName) { return _this.shouldGenerateFile(fileName).generate; });
                }
                this.generatedCodeFor.set(fileName, genFileNames);
            }
        }
        if (sf) {
            addReferencesToSourceFile(sf, genFileNames);
        }
        // TODO(tbosch): TypeScript's typings for getSourceFile are incorrect,
        // as it can very well return undefined.
        return sf;
    };
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.getGeneratedFile = function (fileName) {
        var genSrcFile = this.generatedSourceFiles.get(fileName);
        if (genSrcFile) {
            return genSrcFile.sourceFile;
        }
        var _a = this.shouldGenerateFile(fileName), generate = _a.generate, baseFileName = _a.baseFileName;
        if (generate) {
            var genFile = this.codeGenerator.generateFile(fileName, baseFileName);
            return this.addGeneratedFile(genFile, genFileExternalReferences(genFile));
        }
        return null;
    };
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.originalFileExists = function (fileName) {
        var fileExists = this.originalFileExistsCache.get(fileName);
        if (fileExists == null) {
            fileExists = this.context.fileExists(fileName);
            this.originalFileExistsCache.set(fileName, fileExists);
        }
        return fileExists;
    };
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.fileExists = function (fileName) {
        fileName = stripNgResourceSuffix(fileName);
        if (this.librarySummaries.has(fileName) || this.generatedSourceFiles.has(fileName)) {
            return true;
        }
        if (this.shouldGenerateFile(fileName).generate) {
            return true;
        }
        return this.originalFileExists(fileName);
    };
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.loadSummary = function (filePath) {
        var summary = this.librarySummaries.get(filePath);
        if (summary) {
            return summary.text;
        }
        if (this.originalFileExists(filePath)) {
            return assert(this.context.readFile(filePath));
        }
        return null;
    };
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.isSourceFile = function (filePath) {
        // Don't generate any files nor typecheck them
        // if skipTemplateCodegen is set and fullTemplateTypeCheck is not yet set,
        // for backwards compatibility.
        if (this.options.skipTemplateCodegen && !this.options.fullTemplateTypeCheck) {
            return false;
        }
        // If we have a summary from a previous compilation,
        // treat the file never as a source file.
        if (this.librarySummaries.has(filePath)) {
            return false;
        }
        if (util_1.GENERATED_FILES.test(filePath)) {
            return false;
        }
        if (this.options.generateCodeForLibraries === false && util_1.DTS.test(filePath)) {
            return false;
        }
        if (util_1.DTS.test(filePath)) {
            // Check for a bundle index.
            if (this.hasBundleIndex(filePath)) {
                var normalFilePath = path.normalize(filePath);
                return this.flatModuleIndexNames.has(normalFilePath) ||
                    this.flatModuleIndexRedirectNames.has(normalFilePath);
            }
        }
        return true;
    };
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.readFile = function (fileName) {
        var summary = this.librarySummaries.get(fileName);
        if (summary) {
            return summary.text;
        }
        return this.context.readFile(fileName);
    };
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.getMetadataFor = function (filePath) {
        return metadata_reader_1.readMetadata(filePath, this.metadataReaderHost, this.metadataReaderCache);
    };
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.loadResource = function (filePath) {
        if (this.context.readResource)
            return this.context.readResource(filePath);
        if (!this.originalFileExists(filePath)) {
            throw compiler_1.syntaxError("Error: Resource file not found: " + filePath);
        }
        return assert(this.context.readFile(filePath));
    };
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.getOutputName = function (filePath) {
        return path.relative(this.getCurrentDirectory(), filePath);
    };
    TsCompilerAotCompilerTypeCheckHostAdapter.prototype.hasBundleIndex = function (filePath) {
        var _this = this;
        var checkBundleIndex = function (directory) {
            var result = _this.flatModuleIndexCache.get(directory);
            if (result == null) {
                if (path.basename(directory) == 'node_module') {
                    // Don't look outside the node_modules this package is installed in.
                    result = false;
                }
                else {
                    // A bundle index exists if the typings .d.ts file has a metadata.json that has an
                    // importAs.
                    try {
                        var packageFile = path.join(directory, 'package.json');
                        if (_this.originalFileExists(packageFile)) {
                            // Once we see a package.json file, assume false until it we find the bundle index.
                            result = false;
                            var packageContent = JSON.parse(assert(_this.context.readFile(packageFile)));
                            if (packageContent.typings) {
                                var typings = path.normalize(path.join(directory, packageContent.typings));
                                if (util_1.DTS.test(typings)) {
                                    var metadataFile = typings.replace(util_1.DTS, '.metadata.json');
                                    if (_this.originalFileExists(metadataFile)) {
                                        var metadata = JSON.parse(assert(_this.context.readFile(metadataFile)));
                                        if (metadata.flatModuleIndexRedirect) {
                                            _this.flatModuleIndexRedirectNames.add(typings);
                                            // Note: don't set result = true,
                                            // as this would mark this folder
                                            // as having a bundleIndex too early without
                                            // filling the bundleIndexNames.
                                        }
                                        else if (metadata.importAs) {
                                            _this.flatModuleIndexNames.add(typings);
                                            result = true;
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            var parent_1 = path.dirname(directory);
                            if (parent_1 != directory) {
                                // Try the parent directory.
                                result = checkBundleIndex(parent_1);
                            }
                            else {
                                result = false;
                            }
                        }
                    }
                    catch (e) {
                        // If we encounter any errors assume we this isn't a bundle index.
                        result = false;
                    }
                }
                _this.flatModuleIndexCache.set(directory, result);
            }
            return result;
        };
        return checkBundleIndex(path.dirname(filePath));
    };
    return TsCompilerAotCompilerTypeCheckHostAdapter;
}());
exports.TsCompilerAotCompilerTypeCheckHostAdapter = TsCompilerAotCompilerTypeCheckHostAdapter;
function genFileExternalReferences(genFile) {
    return new Set(compiler_1.collectExternalReferences(genFile.stmts).map(function (er) { return er.moduleName; }));
}
function addReferencesToSourceFile(sf, genFileNames) {
    // Note: as we modify ts.SourceFiles we need to keep the original
    // value for `referencedFiles` around in cache the original host is caching ts.SourceFiles.
    // Note: cloning the ts.SourceFile is expensive as the nodes in have parent pointers,
    // i.e. we would also need to clone and adjust all nodes.
    var originalReferencedFiles = sf.originalReferencedFiles;
    if (!originalReferencedFiles) {
        originalReferencedFiles = sf.referencedFiles;
        sf.originalReferencedFiles = originalReferencedFiles;
    }
    var newReferencedFiles = originalReferencedFiles.slice();
    genFileNames.forEach(function (gf) { return newReferencedFiles.push({ fileName: gf, pos: 0, end: 0 }); });
    sf.referencedFiles = newReferencedFiles;
}
function getOriginalReferences(sourceFile) {
    return sourceFile && sourceFile.originalReferencedFiles;
}
exports.getOriginalReferences = getOriginalReferences;
function dotRelative(from, to) {
    var rPath = path.relative(from, to).replace(/\\/g, '/');
    return rPath.startsWith('.') ? rPath : './' + rPath;
}
/**
 * Moves the path into `genDir` folder while preserving the `node_modules` directory.
 */
function getPackageName(filePath) {
    var match = NODE_MODULES_PACKAGE_NAME.exec(filePath);
    return match ? match[1] : null;
}
function stripNodeModulesPrefix(filePath) {
    return filePath.replace(/.*node_modules\//, '');
}
function getNodeModulesPrefix(filePath) {
    var match = /.*node_modules\//.exec(filePath);
    return match ? match[1] : null;
}
function stripNgResourceSuffix(fileName) {
    return fileName.replace(/\.\$ngresource\$.*/, '');
}
function addNgResourceSuffix(fileName) {
    return fileName + ".$ngresource$";
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXJfaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvdHJhbnNmb3JtZXJzL2NvbXBpbGVyX2hvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBdUw7QUFDdkwsMkJBQTZCO0FBQzdCLCtCQUFpQztBQUlqQyx3REFBeUQ7QUFHekQscURBQThGO0FBQzlGLCtCQUE2RTtBQUU3RSxJQUFNLHlCQUF5QixHQUFHLHNEQUFzRCxDQUFDO0FBQ3pGLElBQU0sR0FBRyxHQUFHLGtDQUFrQyxDQUFDO0FBRS9DLDRCQUNJLEVBQ3dEO1FBRHZELG9CQUFPLEVBQUUsY0FBNkMsRUFBN0Msa0VBQTZDO0lBRXpELElBQUksT0FBTyxDQUFDLFNBQVMsS0FBSyxPQUFPLElBQUksT0FBTyxDQUFDLFNBQVMsS0FBSyxLQUFLLEVBQUU7UUFDaEUsT0FBTyxJQUFJLGlDQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3RDO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQVBELGdEQU9DO0FBaUJELGdCQUFtQixTQUErQjtJQUNoRCxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2QscUNBQXFDO0tBQ3RDO0lBQ0QsT0FBTyxTQUFXLENBQUM7QUFDckIsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0g7SUE0QkUsbURBQ1ksU0FBZ0MsRUFBVSxPQUF3QixFQUNsRSxPQUFxQixFQUFVLGdCQUFrQyxFQUNqRSxhQUE0QixFQUM1QixnQkFBb0Q7UUFBcEQsaUNBQUEsRUFBQSx1QkFBdUIsR0FBRyxFQUEwQjtRQUpoRSxpQkEwREM7UUF6RFcsY0FBUyxHQUFULFNBQVMsQ0FBdUI7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFpQjtRQUNsRSxZQUFPLEdBQVAsT0FBTyxDQUFjO1FBQVUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNqRSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQW9DO1FBOUJ4RCx3QkFBbUIsR0FBRywyQ0FBeUIsRUFBRSxDQUFDO1FBQ2xELDhCQUF5QixHQUFHLElBQUksR0FBRyxFQUFrQixDQUFDO1FBQ3RELHlCQUFvQixHQUFHLElBQUksR0FBRyxFQUFtQixDQUFDO1FBQ2xELHlCQUFvQixHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7UUFDekMsaUNBQTRCLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztRQUdqRCx3QkFBbUIsR0FBRyxJQUFJLEdBQUcsRUFBOEIsQ0FBQztRQUM1RCw0QkFBdUIsR0FBRyxJQUFJLEdBQUcsRUFBbUIsQ0FBQztRQUNyRCx5QkFBb0IsR0FBRyxJQUFJLEdBQUcsRUFBeUIsQ0FBQztRQUN4RCxxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBb0IsQ0FBQztRQUMvQyxZQUFPLEdBQUcsSUFBSSw0QkFBaUIsRUFBRSxDQUFDO1FBZ2hCMUMsMEJBQXFCLEdBQUcsVUFBQyxPQUEyQjtZQUNoRCxPQUFBLEtBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDO1FBQTNDLENBQTJDLENBQUE7UUFDL0Msd0JBQW1CLEdBQUcsY0FBTSxPQUFBLEtBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsRUFBbEMsQ0FBa0MsQ0FBQztRQUMvRCx5QkFBb0IsR0FBRyxVQUFDLFFBQWdCLElBQUssT0FBQSxLQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxFQUEzQyxDQUEyQyxDQUFDO1FBQ3pGLDhCQUF5QixHQUFHLGNBQU0sT0FBQSxLQUFJLENBQUMsT0FBTyxDQUFDLHlCQUF5QixFQUFFLEVBQXhDLENBQXdDLENBQUM7UUFDM0UsZUFBVSxHQUFHLGNBQU0sT0FBQSxLQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxFQUF6QixDQUF5QixDQUFDO1FBQzdDLHVGQUF1RjtRQUN2RixzREFBc0Q7UUFDdEQsYUFBUSxHQUFHLFVBQUMsQ0FBUyxJQUFLLE9BQUEsQ0FBQyxFQUFELENBQUMsQ0FBQztRQUM1QixjQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQXJnQnBELElBQUksQ0FBQyxxQkFBcUIsR0FBRyxFQUFFLENBQUMsMkJBQTJCLENBQ3ZELElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQXFCLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNoRyxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVUsQ0FBQztRQUN6QyxJQUFJLENBQUMsUUFBUTtZQUNULENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQXpCLENBQXlCLENBQUMsQ0FBQztRQUM3RixJQUFJLE9BQU8sQ0FBQyxjQUFjLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFBLElBQUksSUFBSSxPQUFBLE9BQU8sQ0FBQyxjQUFnQixDQUFDLElBQUksQ0FBQyxFQUE5QixDQUE4QixDQUFDO1NBQzlEO1FBQ0QsSUFBSSxPQUFPLENBQUMsZUFBZSxFQUFFO1lBQzNCLElBQUksQ0FBQyxlQUFlLEdBQUcsVUFBQSxhQUFhLElBQUksT0FBQSxPQUFPLENBQUMsZUFBaUIsQ0FBQyxhQUFhLENBQUMsRUFBeEMsQ0FBd0MsQ0FBQztTQUNsRjtRQUNELElBQUksT0FBTyxDQUFDLG9CQUFvQixFQUFFO1lBQ2hDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxjQUFNLE9BQUEsT0FBTyxDQUFDLG9CQUFzQixFQUFFLEVBQWhDLENBQWdDLENBQUM7U0FDcEU7UUFDRCxJQUFJLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRTtZQUNqQyxJQUFJLENBQUMscUJBQXFCLEdBQUcsY0FBTSxPQUFBLE9BQU8sQ0FBQyxxQkFBdUIsRUFBRSxFQUFqQyxDQUFpQyxDQUFDO1NBQ3RFO1FBQ0QsSUFBSSxPQUFPLENBQUMsOEJBQThCLEVBQUU7WUFNMUMsSUFBSSxDQUFDLDhCQUE4QixHQUFHLFVBQUMsS0FBZSxFQUFFLGNBQXNCO2dCQUMxRSxPQUFDLE9BQU8sQ0FBQyw4QkFBc0UsQ0FDM0UsS0FBSyxFQUFFLGNBQWMsQ0FBQztZQUQxQixDQUMwQixDQUFDO1NBQ2hDO1FBQ0QsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBQSxDQUFDLElBQUksT0FBQSxPQUFPLENBQUMsS0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFsQixDQUFrQixDQUFDO1NBQ3RDO1FBQ0QsSUFBSSxPQUFPLENBQUMsb0JBQW9CLEVBQUU7WUFDaEMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDeEU7UUFDRCxpRUFBaUU7UUFDakUsaUVBQWlFO1FBQ2pFLElBQUksT0FBTyxDQUFDLHNCQUFzQixFQUFFO1lBQ2xDLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzVFO1FBQ0QsSUFBSSxPQUFPLENBQUMsaUJBQWlCLEVBQUU7WUFDN0IsSUFBSSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDbEU7UUFDRCxJQUFJLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRTtZQUMvQixJQUFJLENBQUMsbUJBQW1CLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN0RTtRQUNELElBQUksQ0FBQyxrQkFBa0IsR0FBRztZQUN4QixhQUFhLEVBQUUsY0FBTSxPQUFBLElBQUksRUFBSixDQUFJO1lBQ3pCLHFCQUFxQixFQUFFLFVBQUMsUUFBUTtnQkFDOUIsSUFBTSxFQUFFLEdBQUcsS0FBSSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNoRCxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQ2hFLENBQUM7WUFDRCxVQUFVLEVBQUUsVUFBQyxRQUFRLElBQUssT0FBQSxLQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLEVBQWpDLENBQWlDO1lBQzNELFFBQVEsRUFBRSxVQUFDLFFBQVEsSUFBSyxPQUFBLE1BQU0sQ0FBQyxLQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUF2QyxDQUF1QztTQUNoRSxDQUFDO0lBQ0osQ0FBQztJQUVPLHFFQUFpQixHQUF6QixVQUEwQixVQUFrQixFQUFFLGNBQXNCO1FBRWxFLElBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FDZCxVQUFVLEVBQUUsY0FBYyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQ2xFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQzthQUM1QixjQUFjLENBQUM7UUFDL0IsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxVQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ2pGLDBEQUEwRDtZQUMxRCx5Q0FBeUM7WUFDekMscUZBQXFGO1lBQ3JGLGVBQWU7WUFDZixFQUFFLENBQUMsdUJBQXVCLEdBQUcsS0FBSyxDQUFDO1NBQ3BDO1FBQ0QsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsK0VBQStFO0lBQy9FLDJCQUEyQjtJQUMzQixvRUFBb0U7SUFDcEUseUNBQXlDO0lBQ3pDLGlDQUFpQztJQUNqQyxzRUFBa0IsR0FBbEIsVUFBbUIsV0FBcUIsRUFBRSxjQUFzQjtRQUFoRSxpQkFNQztRQUxDLCtEQUErRDtRQUMvRCxnRkFBZ0Y7UUFDaEYsNkJBQTZCO1FBQzdCLE9BQTRCLFdBQVcsQ0FBQyxHQUFHLENBQ3ZDLFVBQUEsVUFBVSxJQUFJLE9BQUEsS0FBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsRUFBbEQsQ0FBa0QsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRCx3RUFBb0IsR0FBcEIsVUFBcUIsQ0FBUyxFQUFFLGNBQXVCO1FBQ3JELElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDbkIsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQywwREFBMEQsQ0FBQyxDQUFDO2FBQzdFO1lBQ0QsaUVBQWlFO1lBQ2pFLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3BDO1FBQ0QsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFO1lBQ3JDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUM7U0FDN0Q7UUFDRCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQzNELE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNyRCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7T0FnQkc7SUFDSCx3RUFBb0IsR0FBcEIsVUFBcUIsWUFBb0IsRUFBRSxjQUFzQjtRQUMvRCxJQUFNLFFBQVEsR0FBTSxZQUFZLFNBQUksY0FBZ0IsQ0FBQztRQUNyRCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlELElBQUksVUFBVSxJQUFJLElBQUksRUFBRTtZQUN0QixPQUFPLFVBQVUsQ0FBQztTQUNuQjtRQUVELElBQU0sb0JBQW9CLEdBQUcsWUFBWSxDQUFDO1FBQzFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUU7WUFDaEMsT0FBTyxDQUFDLEtBQUssQ0FDVCwwQ0FBMEMsRUFBRSxjQUFjLEVBQUUsaUJBQWlCLEVBQzdFLFlBQVksQ0FBQyxDQUFDO1NBQ25CO1FBRUQsaUJBQWlCO1FBQ2pCLFlBQVksR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM3QyxJQUFNLHVCQUF1QixHQUFHLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM3RCxJQUFNLHlCQUF5QixHQUFHLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVqRSxJQUFJLHVCQUF1QixLQUFLLHlCQUF5QjtZQUNyRCxzQkFBZSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFO1lBQzlDLElBQU0sb0JBQW9CLEdBQUcseUJBQWtCLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvRSxJQUFNLGtCQUFrQixHQUFHLHlCQUFrQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFM0UsSUFBSSxvQkFBb0IsS0FBSyxjQUFjLElBQUksa0JBQWtCLEtBQUssWUFBWSxFQUFFO2dCQUNsRix5RUFBeUU7Z0JBQ3pFLGNBQWMsR0FBRyxvQkFBb0IsQ0FBQztnQkFDdEMsWUFBWSxHQUFHLGtCQUFrQixDQUFDO2FBQ25DO1lBQ0QsVUFBVSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO1NBQ3RFO2FBQU0sSUFBSSx1QkFBdUIsRUFBRTtZQUNsQyxVQUFVLEdBQUcsc0JBQXNCLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDbEQsSUFBSSxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQzFDLCtFQUErRTtnQkFDL0Usc0RBQXNEO2dCQUN0RCxJQUFJO29CQUNGLElBQU0sVUFBVSxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQzt3QkFDakYsdUJBQXVCLENBQUM7b0JBQzVCLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxVQUFVLEdBQUcsZUFBZSxDQUFDLENBQUM7b0JBQzFELElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ3hFLElBQUksY0FBYyxLQUFLLG9CQUFvQixFQUFFO3dCQUMzQyxVQUFVLEdBQUcsdUJBQXVCLENBQUM7cUJBQ3RDO2lCQUNGO2dCQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUNWLGtFQUFrRTtvQkFDbEUsNERBQTREO29CQUM1RCwwQkFBMEI7aUJBQzNCO2FBQ0Y7U0FDRjthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FDWCx3RUFBc0Usb0JBQW9CLGNBQVMsY0FBZ0IsQ0FBQyxDQUFDO1NBQzFIO1FBRUQsSUFBSSxDQUFDLHlCQUF5QixDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDekQsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUVELDBFQUFzQixHQUF0QixVQUF1QixZQUFvQixFQUFFLGNBQXNCO1FBQ2pFLG1GQUFtRjtRQUNuRiwwQ0FBMEM7UUFDMUMsSUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLElBQUksU0FBUyxLQUFLLEdBQUcsRUFBRTtZQUNyQixZQUFZLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN0QzthQUFNLElBQUksU0FBUyxLQUFLLEdBQUcsRUFBRTtZQUM1QixZQUFZLEdBQUcsT0FBSyxZQUFjLENBQUM7U0FDcEM7UUFDRCxJQUFNLHNCQUFzQixHQUN4QixJQUFJLENBQUMsb0JBQW9CLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDakYsSUFBTSxNQUFNLEdBQUcsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUM3Rix5RUFBeUU7UUFDekUsSUFBSSxDQUFDLE1BQU0sSUFBSyxJQUFJLENBQUMsT0FBZSxDQUFDLHFCQUFxQixFQUFFO1lBQ3pELElBQUksQ0FBQyxPQUFlLENBQUMscUJBQXFCLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDM0Q7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQscUVBQWlCLEdBQWpCLFVBQWtCLFFBQWdCLEVBQUUsb0JBQTRCO1FBQzlELE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRCx1RUFBbUIsR0FBbkIsVUFBb0IsUUFBZ0IsRUFBRSxvQkFBNEI7UUFDaEUsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1FBQzNFLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDYixNQUFNLElBQUksS0FBSyxDQUFDLHVCQUFxQixRQUFRLGNBQVMsb0JBQXNCLENBQUMsQ0FBQztTQUMvRTtRQUNELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxxRUFBaUIsR0FBakIsVUFBa0IsUUFBZ0IsRUFBRSxJQUFZLEVBQUUsU0FBaUI7UUFDakUsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyRCxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ3hCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQzdDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU8seUVBQXFCLEdBQTdCLFVBQ0ksUUFBZ0IsRUFBRSxlQUFpQyxFQUNuRCxPQUErQztRQUNqRCxzRUFBc0U7UUFDdEUsOEJBQThCO1FBQzlCLElBQUksSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUMxQyxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFHLENBQUM7U0FDakQ7UUFDRCxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3BCLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztTQUNqRTtRQUNELHdDQUF3QztRQUN4QyxxQ0FBcUM7UUFDckMsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUM7UUFDbEYsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDM0MsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsdUVBQW1CLEdBQW5CLFVBQW9CLE9BQXNCO1FBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQ1gsZ0VBQThELE9BQU8sQ0FBQyxVQUFZLENBQUMsQ0FBQztTQUN6RjtRQUNELElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDZixNQUFNLElBQUksS0FBSyxDQUFDLHlEQUF1RCxPQUFPLENBQUMsVUFBVSxNQUFHLENBQUMsQ0FBQztTQUMvRjtRQUNELElBQU0sT0FBTyxHQUFHLHlCQUF5QixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25ELElBQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztRQUM5QyxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDakQsSUFBSSxZQUFZLEVBQUU7WUFDaEIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLFlBQVksR0FBRyxZQUFZLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBN0MsQ0FBNkMsQ0FBQyxDQUFDO1NBQ3JFO1FBQ0QsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixNQUFNLElBQUksS0FBSyxDQUNYLG1EQUFpRCxPQUFPLENBQUMsVUFBVSxnQkFBVyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBVyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBRyxDQUFDLENBQUM7U0FDeEk7UUFDRCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVPLG9FQUFnQixHQUF4QixVQUF5QixPQUFzQixFQUFFLGtCQUErQjtRQUM5RSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTtZQUNsQixNQUFNLElBQUksS0FBSyxDQUNYLGdFQUE4RCxPQUFPLENBQUMsVUFBWSxDQUFDLENBQUM7U0FDekY7UUFDSyxJQUFBO21DQUV5QixFQUZ4QiwwQkFBVSxFQUFFLG9CQUFPLENBRU07UUFDaEMsSUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUMxQixPQUFPLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25GLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztZQUN4RixJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRTtZQUM5QixJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNsRCxJQUFJLFVBQVU7Z0JBQUUsRUFBRSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7U0FDNUM7UUFDRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7WUFDaEQsVUFBVSxFQUFFLEVBQUU7WUFDZCxPQUFPLEVBQUUsT0FBTyxFQUFFLGtCQUFrQixvQkFBQTtTQUNyQyxDQUFDLENBQUM7UUFDSCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFRCxzRUFBa0IsR0FBbEIsVUFBbUIsUUFBZ0I7UUFBbkMsaUJBK0JDO1FBOUJDLG1FQUFtRTtRQUNuRSxzREFBc0Q7UUFDdEQsSUFBSSxDQUFDLGtCQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUN4QyxPQUFPLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDO1NBQzFCO1FBQ0QsSUFBTSxRQUFRLEdBQUcsc0JBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNiLE9BQU8sRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUM7U0FDMUI7UUFDUSxJQUFBLGtCQUFJLEVBQUUsdUJBQVMsRUFBRSxvQkFBTSxDQUFhO1FBQzdDLElBQUksTUFBTSxLQUFLLElBQUksSUFBSSxNQUFNLEtBQUssS0FBSyxFQUFFO1lBQ3ZDLE9BQU8sRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUM7U0FDMUI7UUFDRCxJQUFJLFlBQThCLENBQUM7UUFDbkMsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNyQyw2REFBNkQ7WUFDN0QsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDbEMsT0FBTyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUMsQ0FBQzthQUMxQjtTQUNGO2FBQU07WUFDTCwrREFBK0Q7WUFDL0QsMEVBQTBFO1lBQzFFLDBDQUEwQztZQUMxQyxZQUFZLEdBQUcsQ0FBSSxJQUFJLFFBQUssRUFBSyxJQUFJLFNBQU0sRUFBSyxJQUFJLFVBQU8sQ0FBQyxDQUFDLElBQUksQ0FDN0QsVUFBQSxZQUFZLElBQUksT0FBQSxLQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxJQUFJLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsRUFBeEUsQ0FBd0UsQ0FBQyxDQUFDO1lBQzlGLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ2pCLE9BQU8sRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUM7YUFDMUI7U0FDRjtRQUNELE9BQU8sRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFlBQVksY0FBQSxFQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELDBFQUFzQixHQUF0QixVQUF1QixRQUFnQjtRQUNyQyxtRUFBbUU7UUFDbkUsc0RBQXNEO1FBQ3RELE9BQU8sQ0FBQyxzQkFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztZQUNqRSxrQkFBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELGlFQUFhLEdBQWIsVUFDSSxRQUFnQixFQUFFLGVBQWdDLEVBQ2xELE9BQStDO1FBRm5ELGlCQXFDQztRQWxDQyxxREFBcUQ7UUFDckQsb0RBQW9EO1FBQ3BELElBQUksWUFBWSxHQUFhLEVBQUUsQ0FBQztRQUNoQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLEVBQUUsRUFBRTtZQUNQLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEQsSUFBSSxPQUFPLEVBQUU7Z0JBQ1gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7b0JBQ3ZCLE9BQU8sQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUNwQyxRQUFRLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUM1RTtnQkFDRCxFQUFFLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztnQkFDeEIsWUFBWSxHQUFHLEVBQUUsQ0FBQzthQUNuQjtTQUNGO1FBQ0QsSUFBSSxDQUFDLEVBQUUsRUFBRTtZQUNQLEVBQUUsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDMUMsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzRCxJQUFJLGNBQWMsRUFBRTtnQkFDbEIsWUFBWSxHQUFHLGNBQWMsQ0FBQzthQUMvQjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLHNCQUFzQixDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUNwRSxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQ3JFLFVBQUEsUUFBUSxJQUFJLE9BQUEsS0FBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsRUFBMUMsQ0FBMEMsQ0FBQyxDQUFDO2lCQUM3RDtnQkFDRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQzthQUNuRDtTQUNGO1FBQ0QsSUFBSSxFQUFFLEVBQUU7WUFDTix5QkFBeUIsQ0FBQyxFQUFFLEVBQUUsWUFBWSxDQUFDLENBQUM7U0FDN0M7UUFDRCxzRUFBc0U7UUFDdEUsd0NBQXdDO1FBQ3hDLE9BQU8sRUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVPLG9FQUFnQixHQUF4QixVQUF5QixRQUFnQjtRQUN2QyxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNELElBQUksVUFBVSxFQUFFO1lBQ2QsT0FBTyxVQUFVLENBQUMsVUFBVSxDQUFDO1NBQzlCO1FBQ0ssSUFBQSxzQ0FBNEQsRUFBM0Qsc0JBQVEsRUFBRSw4QkFBWSxDQUFzQztRQUNuRSxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUN4RSxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUseUJBQXlCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUMzRTtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVPLHNFQUFrQixHQUExQixVQUEyQixRQUFnQjtRQUN6QyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVELElBQUksVUFBVSxJQUFJLElBQUksRUFBRTtZQUN0QixVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7U0FDeEQ7UUFDRCxPQUFPLFVBQVUsQ0FBQztJQUNwQixDQUFDO0lBRUQsOERBQVUsR0FBVixVQUFXLFFBQWdCO1FBQ3pCLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNsRixPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFO1lBQzlDLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsK0RBQVcsR0FBWCxVQUFZLFFBQWdCO1FBQzFCLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEQsSUFBSSxPQUFPLEVBQUU7WUFDWCxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUM7U0FDckI7UUFDRCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNyQyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1NBQ2hEO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsZ0VBQVksR0FBWixVQUFhLFFBQWdCO1FBQzNCLDhDQUE4QztRQUM5QywwRUFBMEU7UUFDMUUsK0JBQStCO1FBQy9CLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUU7WUFDM0UsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELG9EQUFvRDtRQUNwRCx5Q0FBeUM7UUFDekMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3ZDLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxJQUFJLHNCQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ2xDLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsd0JBQXdCLEtBQUssS0FBSyxJQUFJLFVBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDekUsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELElBQUksVUFBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUN0Qiw0QkFBNEI7WUFDNUIsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUNqQyxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNoRCxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO29CQUNoRCxJQUFJLENBQUMsNEJBQTRCLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2FBQzNEO1NBQ0Y7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCw0REFBUSxHQUFSLFVBQVMsUUFBZ0I7UUFDdkIsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwRCxJQUFJLE9BQU8sRUFBRTtZQUNYLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQztTQUNyQjtRQUNELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELGtFQUFjLEdBQWQsVUFBZSxRQUFnQjtRQUM3QixPQUFPLDhCQUFZLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBRUQsZ0VBQVksR0FBWixVQUFhLFFBQWdCO1FBQzNCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZO1lBQUUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxRSxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3RDLE1BQU0sc0JBQVcsQ0FBQyxxQ0FBbUMsUUFBVSxDQUFDLENBQUM7U0FDbEU7UUFDRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxpRUFBYSxHQUFiLFVBQWMsUUFBZ0I7UUFDNUIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFTyxrRUFBYyxHQUF0QixVQUF1QixRQUFnQjtRQUF2QyxpQkF1REM7UUF0REMsSUFBTSxnQkFBZ0IsR0FBRyxVQUFDLFNBQWlCO1lBQ3pDLElBQUksTUFBTSxHQUFHLEtBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdEQsSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO2dCQUNsQixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksYUFBYSxFQUFFO29CQUM3QyxvRUFBb0U7b0JBQ3BFLE1BQU0sR0FBRyxLQUFLLENBQUM7aUJBQ2hCO3FCQUFNO29CQUNMLGtGQUFrRjtvQkFDbEYsWUFBWTtvQkFDWixJQUFJO3dCQUNGLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO3dCQUN6RCxJQUFJLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsRUFBRTs0QkFDeEMsbUZBQW1GOzRCQUNuRixNQUFNLEdBQUcsS0FBSyxDQUFDOzRCQUNmLElBQU0sY0FBYyxHQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDbkYsSUFBSSxjQUFjLENBQUMsT0FBTyxFQUFFO2dDQUMxQixJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dDQUM3RSxJQUFJLFVBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7b0NBQ3JCLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBRyxFQUFFLGdCQUFnQixDQUFDLENBQUM7b0NBQzVELElBQUksS0FBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxFQUFFO3dDQUN6QyxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7d0NBQ3pFLElBQUksUUFBUSxDQUFDLHVCQUF1QixFQUFFOzRDQUNwQyxLQUFJLENBQUMsNEJBQTRCLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzRDQUMvQyxpQ0FBaUM7NENBQ2pDLGlDQUFpQzs0Q0FDakMsNENBQTRDOzRDQUM1QyxnQ0FBZ0M7eUNBQ2pDOzZDQUFNLElBQUksUUFBUSxDQUFDLFFBQVEsRUFBRTs0Q0FDNUIsS0FBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQzs0Q0FDdkMsTUFBTSxHQUFHLElBQUksQ0FBQzt5Q0FDZjtxQ0FDRjtpQ0FDRjs2QkFDRjt5QkFDRjs2QkFBTTs0QkFDTCxJQUFNLFFBQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDOzRCQUN2QyxJQUFJLFFBQU0sSUFBSSxTQUFTLEVBQUU7Z0NBQ3ZCLDRCQUE0QjtnQ0FDNUIsTUFBTSxHQUFHLGdCQUFnQixDQUFDLFFBQU0sQ0FBQyxDQUFDOzZCQUNuQztpQ0FBTTtnQ0FDTCxNQUFNLEdBQUcsS0FBSyxDQUFDOzZCQUNoQjt5QkFDRjtxQkFDRjtvQkFBQyxPQUFPLENBQUMsRUFBRTt3QkFDVixrRUFBa0U7d0JBQ2xFLE1BQU0sR0FBRyxLQUFLLENBQUM7cUJBQ2hCO2lCQUNGO2dCQUNELEtBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQ2xEO1lBQ0QsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQyxDQUFDO1FBRUYsT0FBTyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQVlILGdEQUFDO0FBQUQsQ0FBQyxBQXZpQkQsSUF1aUJDO0FBdmlCWSw4RkFBeUM7QUF5aUJ0RCxtQ0FBbUMsT0FBc0I7SUFDdkQsT0FBTyxJQUFJLEdBQUcsQ0FBQyxvQ0FBeUIsQ0FBQyxPQUFPLENBQUMsS0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsRUFBRSxDQUFDLFVBQVksRUFBZixDQUFlLENBQUMsQ0FBQyxDQUFDO0FBQ3hGLENBQUM7QUFFRCxtQ0FBbUMsRUFBaUIsRUFBRSxZQUFzQjtJQUMxRSxpRUFBaUU7SUFDakUsMkZBQTJGO0lBQzNGLHFGQUFxRjtJQUNyRix5REFBeUQ7SUFDekQsSUFBSSx1QkFBdUIsR0FDdEIsRUFBVSxDQUFDLHVCQUF1QixDQUFDO0lBQ3hDLElBQUksQ0FBQyx1QkFBdUIsRUFBRTtRQUM1Qix1QkFBdUIsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDO1FBQzVDLEVBQVUsQ0FBQyx1QkFBdUIsR0FBRyx1QkFBdUIsQ0FBQztLQUMvRDtJQUNELElBQU0sa0JBQWtCLEdBQU8sdUJBQXVCLFFBQUMsQ0FBQztJQUN4RCxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUF2RCxDQUF1RCxDQUFDLENBQUM7SUFDcEYsRUFBRSxDQUFDLGVBQWUsR0FBRyxrQkFBa0IsQ0FBQztBQUMxQyxDQUFDO0FBRUQsK0JBQXNDLFVBQXlCO0lBQzdELE9BQU8sVUFBVSxJQUFLLFVBQWtCLENBQUMsdUJBQXVCLENBQUM7QUFDbkUsQ0FBQztBQUZELHNEQUVDO0FBRUQscUJBQXFCLElBQVksRUFBRSxFQUFVO0lBQzNDLElBQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDbEUsT0FBTyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7QUFDdEQsQ0FBQztBQUVEOztHQUVHO0FBQ0gsd0JBQXdCLFFBQWdCO0lBQ3RDLElBQU0sS0FBSyxHQUFHLHlCQUF5QixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN2RCxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDakMsQ0FBQztBQUVELGdDQUFnQyxRQUFnQjtJQUM5QyxPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDbEQsQ0FBQztBQUVELDhCQUE4QixRQUFnQjtJQUM1QyxJQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEQsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ2pDLENBQUM7QUFFRCwrQkFBK0IsUUFBZ0I7SUFDN0MsT0FBTyxRQUFRLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3BELENBQUM7QUFFRCw2QkFBNkIsUUFBZ0I7SUFDM0MsT0FBVSxRQUFRLGtCQUFlLENBQUM7QUFDcEMsQ0FBQyJ9