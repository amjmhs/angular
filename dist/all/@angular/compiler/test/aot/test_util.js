"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var collector_1 = require("@angular/compiler-cli/src/metadata/collector");
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var nodeModulesPath;
var angularSourcePath;
var rootPath;
calcPathsOnDisc();
function isDirectory(data) {
    return typeof data !== 'string';
}
exports.isDirectory = isDirectory;
var NODE_MODULES = '/node_modules/';
var IS_GENERATED = /\.(ngfactory|ngstyle)$/;
var angularts = /@angular\/(\w|\/|-)+\.tsx?$/;
var rxjs = /\/rxjs\//;
var tsxfile = /\.tsx$/;
exports.settings = {
    target: ts.ScriptTarget.ES5,
    declaration: true,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    removeComments: false,
    noImplicitAny: false,
    skipLibCheck: true,
    strictNullChecks: true,
    lib: ['lib.es2015.d.ts', 'lib.dom.d.ts'],
    types: []
};
function calcPathsOnDisc() {
    var moduleFilename = module.filename.replace(/\\/g, '/');
    var distIndex = moduleFilename.indexOf('/dist/all');
    if (distIndex >= 0) {
        rootPath = moduleFilename.substr(0, distIndex);
        nodeModulesPath = path.join(rootPath, 'node_modules');
        angularSourcePath = path.join(rootPath, 'packages');
    }
}
var EmittingCompilerHost = /** @class */ (function () {
    function EmittingCompilerHost(scriptNames, options) {
        var _this = this;
        this.options = options;
        this.addedFiles = new Map();
        this.writtenFiles = new Map();
        this.root = '/';
        this.collector = new collector_1.MetadataCollector();
        this.writeFile = function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
            _this.addWrittenFile(fileName, data);
            if (_this.options.emitMetadata && sourceFiles && sourceFiles.length && DTS.test(fileName)) {
                var metadataFilePath = fileName.replace(DTS, '.metadata.json');
                var metadata = _this.collector.getMetadata(sourceFiles[0]);
                if (metadata) {
                    _this.addWrittenFile(metadataFilePath, JSON.stringify(metadata));
                }
            }
        };
        // Rewrite references to scripts with '@angular' to its corresponding location in
        // the source tree.
        this.scriptNames = scriptNames.map(function (f) { return _this.effectiveName(f); });
        this.root = rootPath || this.root;
        if (options.context) {
            this.addedFiles = mergeMaps(options.context);
        }
    }
    EmittingCompilerHost.prototype.writtenAngularFiles = function (target) {
        if (target === void 0) { target = new Map(); }
        this.written.forEach(function (value, key) {
            var path = "/node_modules/@angular" + key.substring(angularSourcePath.length);
            target.set(path, value);
        });
        return target;
    };
    EmittingCompilerHost.prototype.addScript = function (fileName, content) {
        var scriptName = this.effectiveName(fileName);
        this.addedFiles.set(scriptName, content);
        this.cachedAddedDirectories = undefined;
        this.scriptNames.push(scriptName);
    };
    EmittingCompilerHost.prototype.override = function (fileName, content) {
        var scriptName = this.effectiveName(fileName);
        this.addedFiles.set(scriptName, content);
        this.cachedAddedDirectories = undefined;
    };
    EmittingCompilerHost.prototype.addFiles = function (map) {
        for (var _i = 0, _a = Array.from(map.entries()); _i < _a.length; _i++) {
            var _b = _a[_i], name_1 = _b[0], content = _b[1];
            this.addedFiles.set(name_1, content);
        }
    };
    EmittingCompilerHost.prototype.addWrittenFile = function (fileName, content) {
        this.writtenFiles.set(this.effectiveName(fileName), content);
    };
    EmittingCompilerHost.prototype.getWrittenFiles = function () {
        return Array.from(this.writtenFiles).map(function (f) { return ({ name: f[0], content: f[1] }); });
    };
    Object.defineProperty(EmittingCompilerHost.prototype, "scripts", {
        get: function () { return this.scriptNames; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmittingCompilerHost.prototype, "written", {
        get: function () { return this.writtenFiles; },
        enumerable: true,
        configurable: true
    });
    EmittingCompilerHost.prototype.effectiveName = function (fileName) {
        var prefix = '@angular/';
        return angularSourcePath && fileName.startsWith(prefix) ?
            path.join(angularSourcePath, fileName.substr(prefix.length)) :
            fileName;
    };
    // ts.ModuleResolutionHost
    EmittingCompilerHost.prototype.fileExists = function (fileName) {
        return this.addedFiles.has(fileName) || open(fileName, this.options.mockData) != null ||
            fs.existsSync(fileName);
    };
    EmittingCompilerHost.prototype.readFile = function (fileName) {
        var result = this.addedFiles.get(fileName) || open(fileName, this.options.mockData);
        if (result)
            return result;
        var basename = path.basename(fileName);
        if (/^lib.*\.d\.ts$/.test(basename)) {
            var libPath = ts.getDefaultLibFilePath(exports.settings);
            return fs.readFileSync(path.join(path.dirname(libPath), basename), 'utf8');
        }
        return fs.readFileSync(fileName, 'utf8');
    };
    EmittingCompilerHost.prototype.directoryExists = function (directoryName) {
        return directoryExists(directoryName, this.options.mockData) ||
            this.getAddedDirectories().has(directoryName) ||
            (fs.existsSync(directoryName) && fs.statSync(directoryName).isDirectory());
    };
    EmittingCompilerHost.prototype.getCurrentDirectory = function () { return this.root; };
    EmittingCompilerHost.prototype.getDirectories = function (dir) {
        var result = open(dir, this.options.mockData);
        if (result && typeof result !== 'string') {
            return Object.keys(result);
        }
        return fs.readdirSync(dir).filter(function (p) {
            var name = path.join(dir, p);
            var stat = fs.statSync(name);
            return stat && stat.isDirectory();
        });
    };
    // ts.CompilerHost
    EmittingCompilerHost.prototype.getSourceFile = function (fileName, languageVersion, onError) {
        var content = this.readFile(fileName);
        if (content) {
            return ts.createSourceFile(fileName, content, languageVersion, /* setParentNodes */ true);
        }
        throw new Error("File not found '" + fileName + "'.");
    };
    EmittingCompilerHost.prototype.getDefaultLibFileName = function (options) { return 'lib.d.ts'; };
    EmittingCompilerHost.prototype.getCanonicalFileName = function (fileName) {
        return fileName;
    };
    EmittingCompilerHost.prototype.useCaseSensitiveFileNames = function () { return false; };
    EmittingCompilerHost.prototype.getNewLine = function () { return '\n'; };
    EmittingCompilerHost.prototype.getAddedDirectories = function () {
        var result = this.cachedAddedDirectories;
        if (!result) {
            var newCache_1 = new Set();
            var addFile_1 = function (fileName) {
                var directory = fileName.substr(0, fileName.lastIndexOf('/'));
                if (!newCache_1.has(directory)) {
                    newCache_1.add(directory);
                    addFile_1(directory);
                }
            };
            Array.from(this.addedFiles.keys()).forEach(addFile_1);
            this.cachedAddedDirectories = result = newCache_1;
        }
        return result;
    };
    return EmittingCompilerHost;
}());
exports.EmittingCompilerHost = EmittingCompilerHost;
var MockCompilerHost = /** @class */ (function () {
    function MockCompilerHost(scriptNames, data) {
        var _this = this;
        this.data = data;
        this.overrides = new Map();
        this.writtenFiles = new Map();
        this.sourceFiles = new Map();
        this.assumeExists = new Set();
        this.traces = [];
        this.writeFile = function (fileName, data, writeByteOrderMark) {
            _this.writtenFiles.set(fileName, data);
            _this.sourceFiles.delete(fileName);
        };
        this.scriptNames = scriptNames.slice(0);
    }
    // Test API
    MockCompilerHost.prototype.override = function (fileName, content) {
        if (content) {
            this.overrides.set(fileName, content);
        }
        else {
            this.overrides.delete(fileName);
        }
        this.sourceFiles.delete(fileName);
    };
    MockCompilerHost.prototype.addScript = function (fileName, content) {
        this.overrides.set(fileName, content);
        this.scriptNames.push(fileName);
        this.sourceFiles.delete(fileName);
    };
    MockCompilerHost.prototype.assumeFileExists = function (fileName) { this.assumeExists.add(fileName); };
    MockCompilerHost.prototype.remove = function (files) {
        var _this = this;
        // Remove the files from the list of scripts.
        var fileSet = new Set(files);
        this.scriptNames = this.scriptNames.filter(function (f) { return fileSet.has(f); });
        // Remove files from written files
        files.forEach(function (f) { return _this.writtenFiles.delete(f); });
    };
    // ts.ModuleResolutionHost
    MockCompilerHost.prototype.fileExists = function (fileName) {
        if (this.overrides.has(fileName) || this.writtenFiles.has(fileName) ||
            this.assumeExists.has(fileName)) {
            return true;
        }
        var effectiveName = this.getEffectiveName(fileName);
        if (effectiveName == fileName) {
            return open(fileName, this.data) != null;
        }
        if (fileName.match(rxjs)) {
            return fs.existsSync(effectiveName);
        }
        return false;
    };
    MockCompilerHost.prototype.readFile = function (fileName) { return this.getFileContent(fileName); };
    MockCompilerHost.prototype.trace = function (s) { this.traces.push(s); };
    MockCompilerHost.prototype.getCurrentDirectory = function () { return '/'; };
    MockCompilerHost.prototype.getDirectories = function (dir) {
        var effectiveName = this.getEffectiveName(dir);
        if (effectiveName === dir) {
            var data_1 = find(dir, this.data);
            if (isDirectory(data_1)) {
                return Object.keys(data_1).filter(function (k) { return isDirectory(data_1[k]); });
            }
        }
        return [];
    };
    // ts.CompilerHost
    MockCompilerHost.prototype.getSourceFile = function (fileName, languageVersion, onError) {
        var result = this.sourceFiles.get(fileName);
        if (!result) {
            var content = this.getFileContent(fileName);
            if (content) {
                result = ts.createSourceFile(fileName, content, languageVersion);
                this.sourceFiles.set(fileName, result);
            }
        }
        return result;
    };
    MockCompilerHost.prototype.getDefaultLibFileName = function (options) { return 'lib.d.ts'; };
    MockCompilerHost.prototype.getCanonicalFileName = function (fileName) {
        return fileName;
    };
    MockCompilerHost.prototype.useCaseSensitiveFileNames = function () { return false; };
    MockCompilerHost.prototype.getNewLine = function () { return '\n'; };
    // Private methods
    MockCompilerHost.prototype.getFileContent = function (fileName) {
        if (this.overrides.has(fileName)) {
            return this.overrides.get(fileName);
        }
        if (this.writtenFiles.has(fileName)) {
            return this.writtenFiles.get(fileName);
        }
        var basename = path.basename(fileName);
        if (/^lib.*\.d\.ts$/.test(basename)) {
            var libPath = ts.getDefaultLibFilePath(exports.settings);
            return fs.readFileSync(path.join(path.dirname(libPath), basename), 'utf8');
        }
        var effectiveName = this.getEffectiveName(fileName);
        if (effectiveName === fileName) {
            return open(fileName, this.data);
        }
        if (fileName.match(rxjs) && fs.existsSync(fileName)) {
            return fs.readFileSync(fileName, 'utf8');
        }
    };
    MockCompilerHost.prototype.getEffectiveName = function (name) {
        var node_modules = 'node_modules';
        var rxjs = '/rxjs';
        if (name.startsWith('/' + node_modules)) {
            if (nodeModulesPath && name.startsWith('/' + node_modules + rxjs)) {
                return path.join(nodeModulesPath, name.substr(node_modules.length + 1));
            }
        }
        return name;
    };
    return MockCompilerHost;
}());
exports.MockCompilerHost = MockCompilerHost;
var EXT = /(\.ts|\.d\.ts|\.js|\.jsx|\.tsx)$/;
var DTS = /\.d\.ts$/;
var GENERATED_FILES = /\.ngfactory\.ts$|\.ngstyle\.ts$/;
var MockAotCompilerHost = /** @class */ (function () {
    function MockAotCompilerHost(tsHost, metadataProvider) {
        if (metadataProvider === void 0) { metadataProvider = new collector_1.MetadataCollector(); }
        this.tsHost = tsHost;
        this.metadataProvider = metadataProvider;
        this.metadataVisible = true;
        this.dtsAreSource = true;
        this.resolveModuleNameHost = Object.create(tsHost);
        this.resolveModuleNameHost.fileExists = function (fileName) {
            fileName = stripNgResourceSuffix(fileName);
            return tsHost.fileExists(fileName);
        };
    }
    MockAotCompilerHost.prototype.hideMetadata = function () { this.metadataVisible = false; };
    MockAotCompilerHost.prototype.tsFilesOnly = function () { this.dtsAreSource = false; };
    // StaticSymbolResolverHost
    MockAotCompilerHost.prototype.getMetadataFor = function (modulePath) {
        if (!this.tsHost.fileExists(modulePath)) {
            return undefined;
        }
        if (DTS.test(modulePath)) {
            if (this.metadataVisible) {
                var metadataPath = modulePath.replace(DTS, '.metadata.json');
                if (this.tsHost.fileExists(metadataPath)) {
                    var result = JSON.parse(this.tsHost.readFile(metadataPath));
                    return Array.isArray(result) ? result : [result];
                }
            }
        }
        else {
            var sf = this.tsHost.getSourceFile(modulePath, ts.ScriptTarget.Latest);
            var metadata = this.metadataProvider.getMetadata(sf);
            return metadata ? [metadata] : [];
        }
        return undefined;
    };
    MockAotCompilerHost.prototype.moduleNameToFileName = function (moduleName, containingFile) {
        if (!containingFile || !containingFile.length) {
            if (moduleName.indexOf('.') === 0) {
                throw new Error('Resolution of relative paths requires a containing file.');
            }
            // Any containing file gives the same result for absolute imports
            containingFile = path.join('/', 'index.ts');
        }
        moduleName = moduleName.replace(EXT, '');
        var resolved = ts.resolveModuleName(moduleName, containingFile.replace(/\\/g, '/'), { baseDir: '/', genDir: '/' }, this.resolveModuleNameHost)
            .resolvedModule;
        return resolved ? resolved.resolvedFileName : null;
    };
    MockAotCompilerHost.prototype.getOutputName = function (filePath) { return filePath; };
    MockAotCompilerHost.prototype.resourceNameToFileName = function (resourceName, containingFile) {
        // Note: we convert package paths into relative paths to be compatible with the the
        // previous implementation of UrlResolver.
        if (resourceName && resourceName.charAt(0) !== '.' && !path.isAbsolute(resourceName)) {
            resourceName = "./" + resourceName;
        }
        var filePathWithNgResource = this.moduleNameToFileName(addNgResourceSuffix(resourceName), containingFile);
        return filePathWithNgResource ? stripNgResourceSuffix(filePathWithNgResource) : null;
    };
    // AotSummaryResolverHost
    MockAotCompilerHost.prototype.loadSummary = function (filePath) { return this.tsHost.readFile(filePath); };
    MockAotCompilerHost.prototype.isSourceFile = function (sourceFilePath) {
        return !GENERATED_FILES.test(sourceFilePath) &&
            (this.dtsAreSource || !DTS.test(sourceFilePath));
    };
    MockAotCompilerHost.prototype.toSummaryFileName = function (filePath) { return filePath.replace(EXT, '') + '.d.ts'; };
    MockAotCompilerHost.prototype.fromSummaryFileName = function (filePath) { return filePath; };
    // AotCompilerHost
    MockAotCompilerHost.prototype.fileNameToModuleName = function (importedFile, containingFile) {
        return importedFile.replace(EXT, '');
    };
    MockAotCompilerHost.prototype.loadResource = function (path) {
        if (this.tsHost.fileExists(path)) {
            return this.tsHost.readFile(path);
        }
        else {
            throw new Error("Resource " + path + " not found.");
        }
    };
    return MockAotCompilerHost;
}());
exports.MockAotCompilerHost = MockAotCompilerHost;
var MockMetadataBundlerHost = /** @class */ (function () {
    function MockMetadataBundlerHost(host) {
        this.host = host;
        this.collector = new collector_1.MetadataCollector();
    }
    MockMetadataBundlerHost.prototype.getMetadataFor = function (moduleName) {
        var source = this.host.getSourceFile(moduleName + '.ts', ts.ScriptTarget.Latest);
        return source && this.collector.getMetadata(source);
    };
    return MockMetadataBundlerHost;
}());
exports.MockMetadataBundlerHost = MockMetadataBundlerHost;
function find(fileName, data) {
    if (!data)
        return undefined;
    var names = fileName.split('/');
    if (names.length && !names[0].length)
        names.shift();
    var current = data;
    for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
        var name_2 = names_1[_i];
        if (typeof current !== 'object') {
            return undefined;
        }
        current = current[name_2];
    }
    return current;
}
function open(fileName, data) {
    var result = find(fileName, data);
    if (typeof result === 'string') {
        return result;
    }
    return undefined;
}
function directoryExists(dirname, data) {
    var result = find(dirname, data);
    return !!result && typeof result !== 'string';
}
function toMockFileArray(data, target) {
    if (target === void 0) { target = []; }
    if (data instanceof Map) {
        mapToMockFileArray(data, target);
    }
    else if (Array.isArray(data)) {
        data.forEach(function (entry) { return toMockFileArray(entry, target); });
    }
    else {
        mockDirToFileArray(data, '', target);
    }
    return target;
}
exports.toMockFileArray = toMockFileArray;
function mockDirToFileArray(dir, path, target) {
    Object.keys(dir).forEach(function (localFileName) {
        var value = dir[localFileName];
        var fileName = path + "/" + localFileName;
        if (typeof value === 'string') {
            target.push({ fileName: fileName, content: value });
        }
        else {
            mockDirToFileArray(value, fileName, target);
        }
    });
}
function mapToMockFileArray(files, target) {
    files.forEach(function (content, fileName) { target.push({ fileName: fileName, content: content }); });
}
function arrayToMockMap(arr) {
    var map = new Map();
    arr.forEach(function (_a) {
        var fileName = _a.fileName, content = _a.content;
        map.set(fileName, content);
    });
    return map;
}
exports.arrayToMockMap = arrayToMockMap;
function arrayToMockDir(arr) {
    var rootDir = {};
    arr.forEach(function (_a) {
        var fileName = _a.fileName, content = _a.content;
        var pathParts = fileName.split('/');
        // trim trailing slash
        var startIndex = pathParts[0] ? 0 : 1;
        // get/create the directory
        var currentDir = rootDir;
        for (var i = startIndex; i < pathParts.length - 1; i++) {
            var pathPart = pathParts[i];
            var localDir = currentDir[pathPart];
            if (!localDir) {
                currentDir[pathPart] = localDir = {};
            }
            currentDir = localDir;
        }
        // write the file
        currentDir[pathParts[pathParts.length - 1]] = content;
    });
    return rootDir;
}
exports.arrayToMockDir = arrayToMockDir;
var minCoreIndex = "\n  export * from './src/application_module';\n  export * from './src/change_detection';\n  export * from './src/metadata';\n  export * from './src/di/metadata';\n  export * from './src/di/injectable';\n  export * from './src/di/injector';\n  export * from './src/di/injection_token';\n  export * from './src/linker';\n  export * from './src/render';\n  export * from './src/codegen_private_exports';\n";
function readBazelWrittenFilesFrom(bazelPackageRoot, packageName, map, skip) {
    if (skip === void 0) { skip = function () { return false; }; }
    function processDirectory(dir, dest) {
        var entries = fs.readdirSync(dir);
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var name_3 = entries_1[_i];
            var fullName = path.join(dir, name_3);
            var destName = path.join(dest, name_3);
            var stat = fs.statSync(fullName);
            if (!skip(name_3, fullName)) {
                if (stat.isDirectory()) {
                    processDirectory(fullName, destName);
                }
                else {
                    var content = fs.readFileSync(fullName, 'utf8');
                    map.set(destName, content);
                }
            }
        }
    }
    try {
        processDirectory(bazelPackageRoot, path.join('/node_modules/@angular', packageName));
    }
    catch (e) {
        console.error("Consider adding //packages/" + packageName + " as a data dependency in the BUILD.bazel rule for the failing test");
        throw e;
    }
}
function isInBazel() {
    return process.env.TEST_SRCDIR != null;
}
exports.isInBazel = isInBazel;
function setup(options) {
    if (options === void 0) { options = {
        compileAngular: true,
        compileAnimations: true,
        compileCommon: false,
    }; }
    var angularFiles = new Map();
    beforeAll(function () {
        var sources = process.env.TEST_SRCDIR;
        if (sources) {
            // If running under bazel then we get the compiled version of the files from the bazel package
            // output.
            var bundles_1 = new Set([
                'bundles', 'esm2015', 'esm5', 'testing', 'testing.d.ts', 'testing.metadata.json', 'browser',
                'browser.d.ts'
            ]);
            var skipDirs = function (name) { return bundles_1.has(name); };
            if (options.compileAngular) {
                // If this fails please add //packages/core:npm_package as a test data dependency.
                readBazelWrittenFilesFrom(path.join(sources, 'angular/packages/core/npm_package'), 'core', angularFiles, skipDirs);
            }
            if (options.compileAnimations) {
                // If this fails please add //packages/animations:npm_package as a test data dependency.
                readBazelWrittenFilesFrom(path.join(sources, 'angular/packages/animations/npm_package'), 'animations', angularFiles, skipDirs);
            }
            if (options.compileCommon) {
                // If this fails please add //packages/common:npm_package as a test data dependency.
                readBazelWrittenFilesFrom(path.join(sources, 'angular/packages/common/npm_package'), 'common', angularFiles, skipDirs);
            }
            return;
        }
        if (options.compileAngular) {
            var emittingHost = new EmittingCompilerHost([], { emitMetadata: true });
            emittingHost.addScript('@angular/core/index.ts', minCoreIndex);
            var emittingProgram = ts.createProgram(emittingHost.scripts, exports.settings, emittingHost);
            emittingProgram.emit();
            emittingHost.writtenAngularFiles(angularFiles);
        }
        if (options.compileCommon) {
            var emittingHost = new EmittingCompilerHost(['@angular/common/index.ts'], { emitMetadata: true });
            var emittingProgram = ts.createProgram(emittingHost.scripts, exports.settings, emittingHost);
            emittingProgram.emit();
            emittingHost.writtenAngularFiles(angularFiles);
        }
        if (options.compileAnimations) {
            var emittingHost = new EmittingCompilerHost(['@angular/animations/index.ts'], { emitMetadata: true });
            var emittingProgram = ts.createProgram(emittingHost.scripts, exports.settings, emittingHost);
            emittingProgram.emit();
            emittingHost.writtenAngularFiles(angularFiles);
        }
    });
    return angularFiles;
}
exports.setup = setup;
function expectNoDiagnostics(program) {
    function fileInfo(diagnostic) {
        if (diagnostic.file) {
            return diagnostic.file.fileName + "(" + diagnostic.start + "): ";
        }
        return '';
    }
    function chars(len, ch) { return new Array(len).fill(ch).join(''); }
    function lineNoOf(offset, text) {
        var result = 1;
        for (var i = 0; i < offset; i++) {
            if (text[i] == '\n')
                result++;
        }
        return result;
    }
    function lineInfo(diagnostic) {
        if (diagnostic.file) {
            var start = diagnostic.start;
            var end = diagnostic.start + diagnostic.length;
            var source = diagnostic.file.text;
            var lineStart = start;
            var lineEnd = end;
            while (lineStart > 0 && source[lineStart] != '\n')
                lineStart--;
            if (lineStart < start)
                lineStart++;
            while (lineEnd < source.length && source[lineEnd] != '\n')
                lineEnd++;
            var line = source.substring(lineStart, lineEnd);
            var lineIndex = line.indexOf('/n');
            if (lineIndex > 0) {
                line = line.substr(0, lineIndex);
                end = start + lineIndex;
            }
            var lineNo = lineNoOf(start, source) + ': ';
            return '\n' + lineNo + line + '\n' + chars(start - lineStart + lineNo.length, ' ') +
                chars(end - start, '^');
        }
        return '';
    }
    function expectNoDiagnostics(diagnostics) {
        if (diagnostics && diagnostics.length) {
            throw new Error('Errors from TypeScript:\n' +
                diagnostics
                    .map(function (d) {
                    return "" + fileInfo(d) + ts.flattenDiagnosticMessageText(d.messageText, '\n') + lineInfo(d);
                })
                    .join(' \n'));
        }
    }
    expectNoDiagnostics(program.getOptionsDiagnostics());
    expectNoDiagnostics(program.getSyntacticDiagnostics());
    expectNoDiagnostics(program.getSemanticDiagnostics());
}
exports.expectNoDiagnostics = expectNoDiagnostics;
function isSource(fileName) {
    return !isDts(fileName) && /\.ts$/.test(fileName);
}
exports.isSource = isSource;
function isDts(fileName) {
    return /\.d.ts$/.test(fileName);
}
function isSourceOrDts(fileName) {
    return /\.ts$/.test(fileName);
}
function compile(rootDirs, options, tsOptions) {
    if (options === void 0) { options = {}; }
    if (tsOptions === void 0) { tsOptions = {}; }
    // when using summaries, always emit so the next step can use the results.
    var emit = options.emit || options.useSummaries;
    var preCompile = options.preCompile || (function () { });
    var postCompile = options.postCompile || expectNoDiagnostics;
    var rootDirArr = toMockFileArray(rootDirs);
    var scriptNames = rootDirArr.map(function (entry) { return entry.fileName; })
        .filter(options.useSummaries ? isSource : isSourceOrDts);
    var host = new MockCompilerHost(scriptNames, arrayToMockDir(rootDirArr));
    var aotHost = new MockAotCompilerHost(host);
    if (options.useSummaries) {
        aotHost.hideMetadata();
        aotHost.tsFilesOnly();
    }
    var tsSettings = __assign({}, exports.settings, tsOptions);
    var program = ts.createProgram(host.scriptNames.slice(0), tsSettings, host);
    preCompile(program);
    var _a = compiler_1.createAotCompiler(aotHost, options, function (err) { throw err; }), compiler = _a.compiler, reflector = _a.reflector;
    var analyzedModules = compiler.analyzeModulesSync(program.getSourceFiles().map(function (sf) { return sf.fileName; }));
    var genFiles = compiler.emitAllImpls(analyzedModules);
    genFiles.forEach(function (file) {
        var source = file.source || compiler_1.toTypeScript(file);
        if (isSource(file.genFileUrl)) {
            host.addScript(file.genFileUrl, source);
        }
        else {
            host.override(file.genFileUrl, source);
        }
    });
    var newProgram = ts.createProgram(host.scriptNames.slice(0), tsSettings, host);
    postCompile(newProgram);
    if (emit) {
        newProgram.emit();
    }
    var outDir = {};
    if (emit) {
        var dtsFilesWithGenFiles_1 = new Set(genFiles.map(function (gf) { return gf.srcFileUrl; }).filter(isDts));
        outDir =
            arrayToMockDir(toMockFileArray([host.writtenFiles, host.overrides])
                .filter(function (entry) { return !isSource(entry.fileName); })
                .concat(rootDirArr.filter(function (e) { return dtsFilesWithGenFiles_1.has(e.fileName); })));
    }
    return { genFiles: genFiles, outDir: outDir };
}
exports.compile = compile;
function stripNgResourceSuffix(fileName) {
    return fileName.replace(/\.\$ngresource\$.*/, '');
}
function addNgResourceSuffix(fileName) {
    return fileName + ".$ngresource$";
}
function extractFileNames(directory) {
    var result = [];
    var scan = function (directory, prefix) {
        for (var _i = 0, _a = Object.getOwnPropertyNames(directory); _i < _a.length; _i++) {
            var name_4 = _a[_i];
            var entry = directory[name_4];
            var fileName = prefix + "/" + name_4;
            if (typeof entry === 'string') {
                result.push(fileName);
            }
            else if (entry) {
                scan(entry, fileName);
            }
        }
    };
    scan(directory, '');
    return result;
}
function emitLibrary(context, mockData, scriptFiles) {
    var emittingHost = new EmittingCompilerHost(scriptFiles || extractFileNames(mockData), { emitMetadata: true, mockData: mockData, context: context });
    var emittingProgram = ts.createProgram(emittingHost.scripts, exports.settings, emittingHost);
    expectNoDiagnostics(emittingProgram);
    emittingProgram.emit();
    return emittingHost.written;
}
exports.emitLibrary = emitLibrary;
function mergeMaps() {
    var maps = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        maps[_i] = arguments[_i];
    }
    var result = new Map();
    for (var _a = 0, maps_1 = maps; _a < maps_1.length; _a++) {
        var map = maps_1[_a];
        for (var _b = 0, _c = Array.from(map.entries()); _b < _c.length; _b++) {
            var _d = _c[_b], key = _d[0], value = _d[1];
            result.set(key, value);
        }
    }
    return result;
}
exports.mergeMaps = mergeMaps;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9hb3QvdGVzdF91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7QUFFSCw4Q0FBc0g7QUFFdEgsMEVBQStFO0FBRS9FLHVCQUF5QjtBQUN6QiwyQkFBNkI7QUFDN0IsK0JBQWlDO0FBSWpDLElBQUksZUFBdUIsQ0FBQztBQUM1QixJQUFJLGlCQUF5QixDQUFDO0FBQzlCLElBQUksUUFBZ0IsQ0FBQztBQUVyQixlQUFlLEVBQUUsQ0FBQztBQVFsQixxQkFBNEIsSUFBcUM7SUFDL0QsT0FBTyxPQUFPLElBQUksS0FBSyxRQUFRLENBQUM7QUFDbEMsQ0FBQztBQUZELGtDQUVDO0FBRUQsSUFBTSxZQUFZLEdBQUcsZ0JBQWdCLENBQUM7QUFDdEMsSUFBTSxZQUFZLEdBQUcsd0JBQXdCLENBQUM7QUFDOUMsSUFBTSxTQUFTLEdBQUcsNkJBQTZCLENBQUM7QUFDaEQsSUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDO0FBQ3hCLElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQztBQUNaLFFBQUEsUUFBUSxHQUF1QjtJQUMxQyxNQUFNLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxHQUFHO0lBQzNCLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLE1BQU0sRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVE7SUFDOUIsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLG9CQUFvQixDQUFDLE1BQU07SUFDaEQscUJBQXFCLEVBQUUsSUFBSTtJQUMzQixzQkFBc0IsRUFBRSxJQUFJO0lBQzVCLGNBQWMsRUFBRSxLQUFLO0lBQ3JCLGFBQWEsRUFBRSxLQUFLO0lBQ3BCLFlBQVksRUFBRSxJQUFJO0lBQ2xCLGdCQUFnQixFQUFFLElBQUk7SUFDdEIsR0FBRyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsY0FBYyxD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