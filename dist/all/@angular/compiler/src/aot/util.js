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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9hb3QvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILElBQU0sdUJBQXVCLEdBQUcsa0NBQWtDLENBQUM7QUFDbkUsSUFBTSxjQUFjLEdBQUcsNkJBQTZCLENBQUM7QUFDckQsSUFBTSxnQkFBZ0IsR0FBRyxlQUFlLENBQUM7QUFDekMsSUFBTSxnQkFBZ0IsR0FBRyxZQUFZLENBQUM7QUFFdEMsMkJBQWtDLFFBQWdCLEVBQUUsZUFBdUI7SUFBdkIsZ0NBQUEsRUFBQSx1QkFBdUI7SUFDekUsSUFBTSxhQUFhLEdBQUcscUJBQXFCLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ3ZFLE9BQVUsYUFBYSxDQUFDLENBQUMsQ0FBQyxrQkFBYSxzQkFBc0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUcsQ0FBQztBQUNwRixDQUFDO0FBSEQsOENBR0M7QUFFRCxrQ0FBeUMsUUFBZ0I7SUFDdkQsT0FBTyxRQUFRLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMvQyxDQUFDO0FBRkQsNERBRUM7QUFFRCx5QkFBZ0MsUUFBZ0I7SUFDOUMsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFGRCwwQ0FFQztBQUVELCtCQUFzQyxJQUFZLEVBQUUsZUFBdUI7SUFBdkIsZ0NBQUEsRUFBQSx1QkFBdUI7SUFDekUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQzFCLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUMvRDtJQUVELElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFdEMsSUFBSSxPQUFPLEtBQUssQ0FBQyxDQUFDLEVBQUU7UUFDbEIsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztLQUM5RDtJQUVELE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDcEIsQ0FBQztBQVpELHNEQVlDO0FBRUQsZ0NBQXVDLGFBQXFCO0lBQzFELE9BQU8sYUFBYSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7QUFDMUQsQ0FBQztBQUZELHdEQUVDO0FBRUQseUJBQWdDLFFBQWdCO0lBQzlDLElBQU0scUJBQXFCLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM1RSxPQUFVLHFCQUFxQixvQkFBaUIsQ0FBQztBQUNuRCxDQUFDO0FBSEQsMENBR0M7QUFFRCwrQkFBc0MsUUFBZ0IsRUFBRSxlQUF1QjtJQUF2QixnQ0FBQSxFQUFBLHVCQUF1QjtJQUM3RSxJQUFNLGFBQWEsR0FBRyxxQkFBcUIsQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNqRyxPQUFVLGFBQWEsQ0FBQyxDQUFDLENBQUMsa0JBQWEsYUFBYSxDQUFDLENBQUMsQ0FBRyxDQUFDO0FBQzVELENBQUM7QUFIRCxzREFHQztBQUVELHNDQUE2QyxRQUFnQjtJQUMzRCxPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDakQsQ0FBQztBQUZELG9FQUVDO0FBRUQsMkJBQWtDLFVBQWtCO0lBQ2xELE9BQVUsVUFBVSxjQUFXLENBQUM7QUFDbEMsQ0FBQztBQUZELDhDQUVDO0FBRUQsc0NBQTZDLFVBQWtCO0lBQzdELE9BQU8sVUFBVSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNsRCxDQUFDO0FBRkQsb0VBRUM7QUFFRCxJQUFNLGNBQWMsR0FBRyxXQUFXLENBQUM7QUFFbkMseUJBQWdDLElBQVk7SUFDMUMsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFGRCwwQ0FFQztBQUVELDZCQUFvQyxFQUFVO0lBQzVDLE9BQU8sV0FBUyxFQUFJLENBQUM7QUFDdkIsQ0FBQztBQUZELGtEQUVDIn0=