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
var api_1 = require("./api");
exports.GENERATED_FILES = /(.*?)\.(ngfactory|shim\.ngstyle|ngstyle|ngsummary)\.(js|d\.ts|ts)$/;
exports.DTS = /\.d\.ts$/;
exports.TS = /^(?!.*\.d\.ts$).*\.ts$/;
// Note: This is an internal property in TypeScript. Use it only for assertions and tests.
function tsStructureIsReused(program) {
    return program.structureIsReused;
}
exports.tsStructureIsReused = tsStructureIsReused;
function error(msg) {
    throw new Error("Internal error: " + msg);
}
exports.error = error;
function userError(msg) {
    throw compiler_1.syntaxError(msg);
}
exports.userError = userError;
function createMessageDiagnostic(messageText) {
    return {
        file: undefined,
        start: undefined,
        length: undefined,
        category: ts.DiagnosticCategory.Message, messageText: messageText,
        code: api_1.DEFAULT_ERROR_CODE,
        source: api_1.SOURCE,
    };
}
exports.createMessageDiagnostic = createMessageDiagnostic;
function isInRootDir(fileName, options) {
    return !options.rootDir || pathStartsWithPrefix(options.rootDir, fileName);
}
exports.isInRootDir = isInRootDir;
function relativeToRootDirs(filePath, rootDirs) {
    if (!filePath)
        return filePath;
    for (var _i = 0, _a = rootDirs || []; _i < _a.length; _i++) {
        var dir = _a[_i];
        var rel = pathStartsWithPrefix(dir, filePath);
        if (rel) {
            return rel;
        }
    }
    return filePath;
}
exports.relativeToRootDirs = relativeToRootDirs;
function pathStartsWithPrefix(prefix, fullPath) {
    var rel = path.relative(prefix, fullPath);
    return rel.startsWith('..') ? null : rel;
}
/**
 * Converts a ng.Diagnostic into a ts.Diagnostic.
 * This looses some information, and also uses an incomplete object as `file`.
 *
 * I.e. only use this where the API allows only a ts.Diagnostic.
 */
function ngToTsDiagnostic(ng) {
    var file;
    var start;
    var length;
    if (ng.span) {
        // Note: We can't use a real ts.SourceFile,
        // but we can at least mirror the properties `fileName` and `text`, which
        // are mostly used for error reporting.
        file = { fileName: ng.span.start.file.url, text: ng.span.start.file.content };
        start = ng.span.start.offset;
        length = ng.span.end.offset - start;
    }
    return {
        file: file,
        messageText: ng.messageText,
        category: ng.category,
        code: ng.code, start: start, length: length,
    };
}
exports.ngToTsDiagnostic = ngToTsDiagnostic;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvdHJhbnNmb3JtZXJzL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBOEM7QUFDOUMsMkJBQTZCO0FBQzdCLCtCQUFpQztBQUVqQyw2QkFBOEU7QUFFakUsUUFBQSxlQUFlLEdBQUcsb0VBQW9FLENBQUM7QUFDdkYsUUFBQSxHQUFHLEdBQUcsVUFBVSxDQUFDO0FBQ2pCLFFBQUEsRUFBRSxHQUFHLHdCQUF3QixDQUFDO0FBSTNDLDBGQUEwRjtBQUMxRiw2QkFBb0MsT0FBbUI7SUFDckQsT0FBUSxPQUFlLENBQUMsaUJBQWlCLENBQUM7QUFDNUMsQ0FBQztBQUZELGtEQUVDO0FBRUQsZUFBc0IsR0FBVztJQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFtQixHQUFLLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBRkQsc0JBRUM7QUFFRCxtQkFBMEIsR0FBVztJQUNuQyxNQUFNLHNCQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekIsQ0FBQztBQUZELDhCQUVDO0FBRUQsaUNBQXdDLFdBQW1CO0lBQ3pELE9BQU87UUFDTCxJQUFJLEVBQUUsU0FBUztRQUNmLEtBQUssRUFBRSxTQUFTO1FBQ2hCLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLFFBQVEsRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLFdBQVcsYUFBQTtRQUNwRCxJQUFJLEVBQUUsd0JBQWtCO1FBQ3hCLE1BQU0sRUFBRSxZQUFNO0tBQ2YsQ0FBQztBQUNKLENBQUM7QUFURCwwREFTQztBQUVELHFCQUE0QixRQUFnQixFQUFFLE9BQXdCO0lBQ3BFLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDN0UsQ0FBQztBQUZELGtDQUVDO0FBRUQsNEJBQW1DLFFBQWdCLEVBQUUsUUFBa0I7SUFDckUsSUFBSSxDQUFDLFFBQVE7UUFBRSxPQUFPLFFBQVEsQ0FBQztJQUMvQixLQUFrQixVQUFjLEVBQWQsS0FBQSxRQUFRLElBQUksRUFBRSxFQUFkLGNBQWMsRUFBZCxJQUFjLEVBQUU7UUFBN0IsSUFBTSxHQUFHLFNBQUE7UUFDWixJQUFNLEdBQUcsR0FBRyxvQkFBb0IsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDaEQsSUFBSSxHQUFHLEVBQUU7WUFDUCxPQUFPLEdBQUcsQ0FBQztTQUNaO0tBQ0Y7SUFDRCxPQUFPLFFBQVEsQ0FBQztBQUNsQixDQUFDO0FBVEQsZ0RBU0M7QUFFRCw4QkFBOEIsTUFBYyxFQUFFLFFBQWdCO0lBQzVELElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzVDLE9BQU8sR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFDM0MsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsMEJBQWlDLEVBQWM7SUFDN0MsSUFBSSxJQUE2QixDQUFDO0lBQ2xDLElBQUksS0FBdUIsQ0FBQztJQUM1QixJQUFJLE1BQXdCLENBQUM7SUFDN0IsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFO1FBQ1gsMkNBQTJDO1FBQzNDLHlFQUF5RTtRQUN6RSx1Q0FBdUM7UUFDdkMsSUFBSSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQW1CLENBQUM7UUFDL0YsS0FBSyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUM3QixNQUFNLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztLQUNyQztJQUNELE9BQU87UUFDTCxJQUFJLE1BQUE7UUFDSixXQUFXLEVBQUUsRUFBRSxDQUFDLFdBQVc7UUFDM0IsUUFBUSxFQUFFLEVBQUUsQ0FBQyxRQUFRO1FBQ3JCLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssT0FBQSxFQUFFLE1BQU0sUUFBQTtLQUM3QixDQUFDO0FBQ0osQ0FBQztBQWxCRCw0Q0FrQkMifQ==