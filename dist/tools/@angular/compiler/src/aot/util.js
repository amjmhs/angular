"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var STRIP_SRC_FILE_SUFFIXES = /(\.ts|\.d\.ts|\.js|\.jsx|\.tsx)$/;
var GENERATED_FILE = /\.ngfactory\.|\.ngsummary\./;
var JIT_SUMMARY_FILE = /\.ngsummary\./;
var JIT_SUMMARY_NAME = /NgSummary$/;
function ngfactoryFilePath(filePath, forceSourceFile) {
    if (forceSourceFile === void 0) { forceSourceFile = false; }
    var urlWithSuffix = splitTypescriptSuffix(filePath, forceSourceFile);
    return urlWithSuffix[0] + ".ngfactory" + normalizeGenFileSuffix(urlWithSuffix[1]);
}
exports.ngfactoryFilePath = ngfactoryFilePath;
function stripGeneratedFileSuffix(filePath) {
    return filePath.replace(GENERATED_FILE, '.');
}
exports.stripGeneratedFileSuffix = stripGeneratedFileSuffix;
function isGeneratedFile(filePath) {
    return GENERATED_FILE.test(filePath);
}
exports.isGeneratedFile = isGeneratedFile;
function splitTypescriptSuffix(path, forceSourceFile) {
    if (forceSourceFile === void 0) { forceSourceFile = false; }
    if (path.endsWith('.d.ts')) {
        return [path.slice(0, -5), forceSourceFile ? '.ts' : '.d.ts'];
    }
    var lastDot = path.lastIndexOf('.');
    if (lastDot !== -1) {
        return [path.substring(0, lastDot), path.substring(lastDot)];
    }
    return [path, ''];
}
exports.splitTypescriptSuffix = splitTypescriptSuffix;
function normalizeGenFileSuffix(srcFileSuffix) {
    return srcFileSuffix === '.tsx' ? '.ts' : srcFileSuffix;
}
exports.normalizeGenFileSuffix = normalizeGenFileSuffix;
function summaryFileName(fileName) {
    var fileNameWithoutSuffix = fileName.replace(STRIP_SRC_FILE_SUFFIXES, '');
    return fileNameWithoutSuffix + ".ngsummary.json";
}
exports.summaryFileName = summaryFileName;
function summaryForJitFileName(fileName, forceSourceFile) {
    if (forceSourceFile === void 0) { forceSourceFile = false; }
    var urlWithSuffix = splitTypescriptSuffix(stripGeneratedFileSuffix(fileName), forceSourceFile);
    return urlWithSuffix[0] + ".ngsummary" + urlWithSuffix[1];
}
exports.summaryForJitFileName = summaryForJitFileName;
function stripSummaryForJitFileSuffix(filePath) {
    return filePath.replace(JIT_SUMMARY_FILE, '.');
}
exports.stripSummaryForJitFileSuffix = stripSummaryForJitFileSuffix;
function summaryForJitName(symbolName) {
    return symbolName + "NgSummary";
}
exports.summaryForJitName = summaryForJitName;
function stripSummaryForJitNameSuffix(symbolName) {
    return symbolName.replace(JIT_SUMMARY_NAME, '');
}
exports.stripSummaryForJitNameSuffix = stripSummaryForJitNameSuffix;
var LOWERED_SYMBOL = /\u0275\d+/;
function isLoweredSymbol(name) {
    return LOWERED_SYMBOL.test(name);
}
exports.isLoweredSymbol = isLoweredSymbol;
function createLoweredSymbol(id) {
    return "\u0275" + id;
}
exports.createLoweredSymbol = createLoweredSymbol;
//# sourceMappingURL=util.js.map