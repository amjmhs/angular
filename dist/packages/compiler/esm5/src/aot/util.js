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
/** @type {?} */
var STRIP_SRC_FILE_SUFFIXES = /(\.ts|\.d\.ts|\.js|\.jsx|\.tsx)$/;
/** @type {?} */
var GENERATED_FILE = /\.ngfactory\.|\.ngsummary\./;
/** @type {?} */
var JIT_SUMMARY_FILE = /\.ngsummary\./;
/** @type {?} */
var JIT_SUMMARY_NAME = /NgSummary$/;
/**
 * @param {?} filePath
 * @param {?=} forceSourceFile
 * @return {?}
 */
export function ngfactoryFilePath(filePath, forceSourceFile) {
    if (forceSourceFile === void 0) { forceSourceFile = false; }
    /** @type {?} */
    var urlWithSuffix = splitTypescriptSuffix(filePath, forceSourceFile);
    return urlWithSuffix[0] + ".ngfactory" + normalizeGenFileSuffix(urlWithSuffix[1]);
}
/**
 * @param {?} filePath
 * @return {?}
 */
export function stripGeneratedFileSuffix(filePath) {
    return filePath.replace(GENERATED_FILE, '.');
}
/**
 * @param {?} filePath
 * @return {?}
 */
export function isGeneratedFile(filePath) {
    return GENERATED_FILE.test(filePath);
}
/**
 * @param {?} path
 * @param {?=} forceSourceFile
 * @return {?}
 */
export function splitTypescriptSuffix(path, forceSourceFile) {
    if (forceSourceFile === void 0) { forceSourceFile = false; }
    if (path.endsWith('.d.ts')) {
        return [path.slice(0, -5), forceSourceFile ? '.ts' : '.d.ts'];
    }
    /** @type {?} */
    var lastDot = path.lastIndexOf('.');
    if (lastDot !== -1) {
        return [path.substring(0, lastDot), path.substring(lastDot)];
    }
    return [path, ''];
}
/**
 * @param {?} srcFileSuffix
 * @return {?}
 */
export function normalizeGenFileSuffix(srcFileSuffix) {
    return srcFileSuffix === '.tsx' ? '.ts' : srcFileSuffix;
}
/**
 * @param {?} fileName
 * @return {?}
 */
export function summaryFileName(fileName) {
    /** @type {?} */
    var fileNameWithoutSuffix = fileName.replace(STRIP_SRC_FILE_SUFFIXES, '');
    return fileNameWithoutSuffix + ".ngsummary.json";
}
/**
 * @param {?} fileName
 * @param {?=} forceSourceFile
 * @return {?}
 */
export function summaryForJitFileName(fileName, forceSourceFile) {
    if (forceSourceFile === void 0) { forceSourceFile = false; }
    /** @type {?} */
    var urlWithSuffix = splitTypescriptSuffix(stripGeneratedFileSuffix(fileName), forceSourceFile);
    return urlWithSuffix[0] + ".ngsummary" + urlWithSuffix[1];
}
/**
 * @param {?} filePath
 * @return {?}
 */
export function stripSummaryForJitFileSuffix(filePath) {
    return filePath.replace(JIT_SUMMARY_FILE, '.');
}
/**
 * @param {?} symbolName
 * @return {?}
 */
export function summaryForJitName(symbolName) {
    return symbolName + "NgSummary";
}
/**
 * @param {?} symbolName
 * @return {?}
 */
export function stripSummaryForJitNameSuffix(symbolName) {
    return symbolName.replace(JIT_SUMMARY_NAME, '');
}
/** @type {?} */
var LOWERED_SYMBOL = /\u0275\d+/;
/**
 * @param {?} name
 * @return {?}
 */
export function isLoweredSymbol(name) {
    return LOWERED_SYMBOL.test(name);
}
/**
 * @param {?} id
 * @return {?}
 */
export function createLoweredSymbol(id) {
    return "\u0275" + id;
}
//# sourceMappingURL=util.js.map