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
var fs = require("fs");
var os = require("os");
var path = require("path");
var ts = require("typescript");
var ng = require("../index");
// TEST_TMPDIR is set by bazel.
var tmpdir = process.env.TEST_TMPDIR || os.tmpdir();
function getNgRootDir() {
    var moduleFilename = module.filename.replace(/\\/g, '/');
    var distIndex = moduleFilename.indexOf('/dist/all');
    return moduleFilename.substr(0, distIndex);
}
function writeTempFile(name, contents) {
    var id = (Math.random() * 1000000).toFixed(0);
    var fn = path.join(tmpdir, "tmp." + id + "." + name);
    fs.writeFileSync(fn, contents);
    return fn;
}
exports.writeTempFile = writeTempFile;
function makeTempDir() {
    var dir;
    while (true) {
        var id = (Math.random() * 1000000).toFixed(0);
        dir = path.join(tmpdir, "tmp." + id);
        if (!fs.existsSync(dir))
            break;
    }
    fs.mkdirSync(dir);
    return dir;
}
exports.makeTempDir = makeTempDir;
function createTestSupportFor(basePath) {
    return { basePath: basePath, write: write, writeFiles: writeFiles, createCompilerOptions: createCompilerOptions, shouldExist: shouldExist, shouldNotExist: shouldNotExist };
    function write(fileName, content) {
        var dir = path.dirname(fileName);
        if (dir != '.') {
            var newDir = path.resolve(basePath, dir);
            if (!fs.existsSync(newDir))
                fs.mkdirSync(newDir);
        }
        fs.writeFileSync(path.resolve(basePath, fileName), content, { encoding: 'utf-8' });
    }
    function writeFiles() {
        var mockDirs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            mockDirs[_i] = arguments[_i];
        }
        mockDirs.forEach(function (dir) { Object.keys(dir).forEach(function (fileName) { write(fileName, dir[fileName]); }); });
    }
    function createCompilerOptions(overrideOptions) {
        if (overrideOptions === void 0) { overrideOptions = {}; }
        return __assign({ basePath: basePath, 'experimentalDecorators': true, 'skipLibCheck': true, 'strict': true, 'strictPropertyInitialization': false, 'types': [], 'outDir': path.resolve(basePath, 'built'), 'rootDir': basePath, 'baseUrl': basePath, 'declaration': true, 'target': ts.ScriptTarget.ES5, 'module': ts.ModuleKind.ES2015, 'moduleResolution': ts.ModuleResolutionKind.NodeJs, 'lib': [
                path.resolve(basePath, 'node_modules/typescript/lib/lib.es6.d.ts'),
            ] }, overrideOptions);
    }
    function shouldExist(fileName) {
        if (!fs.existsSync(path.resolve(basePath, fileName))) {
            throw new Error("Expected " + fileName + " to be emitted (basePath: " + basePath + ")");
        }
    }
    function shouldNotExist(fileName) {
        if (fs.existsSync(path.resolve(basePath, fileName))) {
            throw new Error("Did not expect " + fileName + " to be emitted (basePath: " + basePath + ")");
        }
    }
}
function setupBazelTo(basePath) {
    var sources = process.env.TEST_SRCDIR;
    var packages = path.join(sources, 'angular/packages');
    var nodeModulesPath = path.join(basePath, 'node_modules');
    var angularDirectory = path.join(nodeModulesPath, '@angular');
    fs.mkdirSync(nodeModulesPath);
    // Link the built angular packages
    fs.mkdirSync(angularDirectory);
    var packageNames = fs.readdirSync(packages).filter(function (name) { return fs.statSync(path.join(packages, name)).isDirectory() &&
        fs.existsSync(path.join(packages, name, 'npm_package')); });
    for (var _i = 0, packageNames_1 = packageNames; _i < packageNames_1.length; _i++) {
        var pkg = packageNames_1[_i];
        fs.symlinkSync(path.join(packages, pkg + "/npm_package"), path.join(angularDirectory, pkg));
    }
    // Link rxjs
    var rxjsSource = path.join(sources, 'rxjs');
    var rxjsDest = path.join(nodeModulesPath, 'rxjs');
    if (fs.existsSync(rxjsSource)) {
        fs.symlinkSync(rxjsSource, rxjsDest);
    }
    // Link typescript
    var typescriptSource = path.join(sources, 'angular/external/angular_deps/node_modules/typescript');
    var typescriptDest = path.join(nodeModulesPath, 'typescript');
    if (fs.existsSync(typescriptSource)) {
        fs.symlinkSync(typescriptSource, typescriptDest);
    }
}
exports.setupBazelTo = setupBazelTo;
function setupBazel() {
    var basePath = makeTempDir();
    setupBazelTo(basePath);
    return createTestSupportFor(basePath);
}
function setupTestSh() {
    var basePath = makeTempDir();
    var ngRootDir = getNgRootDir();
    var nodeModulesPath = path.resolve(basePath, 'node_modules');
    fs.mkdirSync(nodeModulesPath);
    fs.symlinkSync(path.resolve(ngRootDir, 'dist', 'all', '@angular'), path.resolve(nodeModulesPath, '@angular'));
    fs.symlinkSync(path.resolve(ngRootDir, 'node_modules', 'rxjs'), path.resolve(nodeModulesPath, 'rxjs'));
    fs.symlinkSync(path.resolve(ngRootDir, 'node_modules', 'typescript'), path.resolve(nodeModulesPath, 'typescript'));
    return createTestSupportFor(basePath);
}
function isInBazel() {
    return process.env.TEST_SRCDIR != null;
}
exports.isInBazel = isInBazel;
function setup() {
    return isInBazel() ? setupBazel() : setupTestSh();
}
exports.setup = setup;
function expectNoDiagnostics(options, diags) {
    var errorDiags = diags.filter(function (d) { return d.category !== ts.DiagnosticCategory.Message; });
    if (errorDiags.length) {
        throw new Error("Expected no diagnostics: " + ng.formatDiagnostics(errorDiags));
    }
}
exports.expectNoDiagnostics = expectNoDiagnostics;
function expectNoDiagnosticsInProgram(options, p) {
    expectNoDiagnostics(options, p.getNgStructuralDiagnostics().concat(p.getTsSemanticDiagnostics(), p.getNgSemanticDiagnostics()));
}
exports.expectNoDiagnosticsInProgram = expectNoDiagnosticsInProgram;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9zdXBwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3Rlc3QvdGVzdF9zdXBwb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7QUFFSCx1QkFBeUI7QUFDekIsdUJBQXlCO0FBQ3pCLDJCQUE2QjtBQUM3QiwrQkFBaUM7QUFDakMsNkJBQStCO0FBRS9CLCtCQUErQjtBQUMvQixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFdEQ7SUFDRSxJQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDM0QsSUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN0RCxPQUFPLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFFRCx1QkFBOEIsSUFBWSxFQUFFLFFBQWdCO0lBQzFELElBQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRCxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxTQUFPLEVBQUUsU0FBSSxJQUFNLENBQUMsQ0FBQztJQUNsRCxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMvQixPQUFPLEVBQUUsQ0FBQztBQUNaLENBQUM7QUFMRCxzQ0FLQztBQUVEO0lBQ0UsSUFBSSxHQUFXLENBQUM7SUFDaEIsT0FBTyxJQUFJLEVBQUU7UUFDWCxJQUFNLEVBQUUsR0FBRyxDQUFDLElBQUks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