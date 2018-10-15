"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var lib_1 = require("tslint/lib");
var rules_1 = require("tslint/lib/rules");
var ts = require("typescript");
function _isRollupPath(path) {
    return /rollup\.config\.js$/.test(path);
}
// Regexes to blacklist.
var sourceFilePathBlacklist = [
    /\.spec\.ts$/,
    /_spec\.ts$/,
    /_perf\.ts$/,
    /_example\.ts$/,
    /[/\\]test[/\\]/,
    /[/\\]testing_internal\.ts$/,
    /[/\\]integrationtest[/\\]/,
    /[/\\]packages[/\\]bazel[/\\]/,
    /[/\\]packages[/\\]benchpress[/\\]/,
    /[/\\]packages[/\\]examples[/\\]/,
    /[/\\]packages[/\\]elements[/\\]schematics[/\\]/,
    // language-service bundles everything in its UMD, so we don't need a globals. There are
    // exceptions but we simply ignore those files from this rule.
    /[/\\]packages[/\\]language-service[/\\]/,
    // Compiler CLI is never part of a browser (there's a browser-rollup but it's managed
    // separately.
    /[/\\]packages[/\\]compiler-cli[/\\]/,
    // service-worker is a special package that has more than one rollup config. It confuses
    // this lint rule and we simply ignore those files.
    /[/\\]packages[/\\]service-worker[/\\]/,
];
// Import package name whitelist. These will be ignored.
var importsWhitelist = [
    '@angular/compiler-cli',
    '@angular/compiler-cli/src/language_services',
    'chokidar',
    'reflect-metadata',
    'tsickle',
    'url',
    'zone.js',
];
var packageScopedImportWhitelist = [
    [/service-worker[/\\]cli/, ['@angular/service-worker']],
];
// Return true if the file should be linted.
function _pathShouldBeLinted(path) {
    return /[/\\]packages[/\\]/.test(path) && sourceFilePathBlacklist.every(function (re) { return !re.test(path); });
}
var globalGlobalRollupMap = new Map();
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var _this = this;
        var allImports = sourceFile.statements.filter(function (x) { return x.kind === ts.SyntaxKind.ImportDeclaration; });
        // Ignore specs, non-package files, and examples.
        if (!_pathShouldBeLinted(sourceFile.fileName)) {
            return [];
        }
        // Find the rollup.config.js from this location, if it exists.
        // If rollup cannot be found, this is an error.
        var p = path.dirname(sourceFile.fileName);
        var checkedPaths = [];
        var match;
        while (p.startsWith(process.cwd())) {
            if (globalGlobalRollupMap.has(p)) {
                // We already resolved for this directory, just return it.
                match = globalGlobalRollupMap.get(p);
                break;
            }
            var allFiles = fs.readdirSync(p);
            var maybeRollupPath = allFiles.find(function (x) { return _isRollupPath(path.join(p, x)); });
            if (maybeRollupPath) {
                var rollupFilePath_1 = path.join(p, maybeRollupPath);
                var rollupConfig = require(rollupFilePath_1);
                match = { filePath: rollupFilePath_1, globals: rollupConfig && rollupConfig.globals };
                // Update all paths that we checked along the way.
                checkedPaths.forEach(function (path) { return globalGlobalRollupMap.set(path, match); });
                globalGlobalRollupMap.set(rollupFilePath_1, match);
                break;
            }
            checkedPaths.push(p);
            p = path.dirname(p);
        }
        if (!match) {
            throw new Error("Could not find rollup.config.js for " + JSON.stringify(sourceFile.fileName) + ".");
        }
        var rollupFilePath = match.filePath;
        var globalConfig = match.globals || Object.create(null);
        return allImports
            .map(function (importStatement) {
            var modulePath = importStatement.moduleSpecifier.text;
            if (modulePath.startsWith('.')) {
                return null;
            }
            if (importsWhitelist.indexOf(modulePath) != -1) {
                return null;
            }
            for (var _i = 0, packageScopedImportWhitelist_1 = packageScopedImportWhitelist; _i < packageScopedImportWhitelist_1.length; _i++) {
                var _a = packageScopedImportWhitelist_1[_i], re = _a[0], arr = _a[1];
                if (re.test(sourceFile.fileName) && arr.indexOf(modulePath) != -1) {
                    return null;
                }
            }
            if (!(modulePath in globalConfig)) {
                return new lib_1.RuleFailure(sourceFile, importStatement.getStart(), importStatement.getWidth(), "Import " + JSON.stringify(modulePath) + " could not be found in the rollup config " +
                    ("at path " + JSON.stringify(rollupFilePath) + "."), _this.ruleName);
            }
            return null;
        })
            .filter(function (x) { return !!x; });
    };
    return Rule;
}(rules_1.AbstractRule));
exports.Rule = Rule;
//# sourceMappingURL=rollupConfigRule.js.map