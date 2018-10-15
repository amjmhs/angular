"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var b64 = require('base64-js');
var SourceMapConsumer = require('source-map').SourceMapConsumer;
function originalPositionFor(sourceMap, genPosition) {
    var smc = new SourceMapConsumer(sourceMap);
    // Note: We don't return the original object as it also contains a `name` property
    // which is always null and we don't want to include that in our assertions...
    var _a = smc.originalPositionFor(genPosition), line = _a.line, column = _a.column, source = _a.source;
    return { line: line, column: column, source: source };
}
exports.originalPositionFor = originalPositionFor;
function extractSourceMap(source) {
    var idx = source.lastIndexOf('\n//#');
    if (idx == -1)
        return null;
    var smComment = source.slice(idx).trim();
    var smB64 = smComment.split('sourceMappingURL=data:application/json;base64,')[1];
    return smB64 ? JSON.parse(decodeB64String(smB64)) : null;
}
exports.extractSourceMap = extractSourceMap;
function decodeB64String(s) {
    return b64.toByteArray(s).reduce(function (s, c) { return s + String.fromCharCode(c); }, '');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX21hcF91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdGluZy9zcmMvb3V0cHV0L3NvdXJjZV9tYXBfdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNqQyxJQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQztBQVFsRSw2QkFDSSxTQUFvQixFQUNwQixXQUF5RDtJQUMzRCxJQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdDLGtGQUFrRjtJQUNsRiw4RUFBOEU7SUFDeEUsSUFBQSx5Q0FBNkQsRUFBNUQsY0FBSSxFQUFFLGtCQUFNLEVBQUUsa0JBQU0sQ0FBeUM7SUFDcEUsT0FBTyxFQUFDLElBQUksTUFBQSxFQUFFLE1BQU0sUUFBQSxFQUFFLE1BQU0sUUFBQSxFQUFDLENBQUM7QUFDaEMsQ0FBQztBQVJELGtEQVFDO0FBRUQsMEJBQWlDLE1BQWM7SUFDN0MsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0QyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFBRSxPQUFPLElBQUksQ0FBQztJQUMzQixJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNDLElBQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsZ0RBQWdELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRixPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQzNELENBQUM7QUFORCw0Q0FNQztBQUVELHlCQUF5QixDQUFTO0lBQ2hDLE9BQU8sR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFTLEVBQUUsQ0FBUyxJQUFLLE9BQUEsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQTFCLENBQTBCLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDN0YsQ0FBQyJ9