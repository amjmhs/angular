"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../dom/util");
var common_tools_1 = require("./common_tools");
var PROFILER_GLOBAL_NAME = 'profiler';
/**
 * Enabled Angular debug tools that are accessible via your browser's
 * developer console.
 *
 * Usage:
 *
 * 1. Open developer console (e.g. in Chrome Ctrl + Shift + j)
 * 1. Type `ng.` (usually the console will show auto-complete suggestion)
 * 1. Try the change detection profiler `ng.profiler.timeChangeDetection()`
 *    then hit Enter.
 *
 * @experimental All debugging apis are currently experimental.
 */
function enableDebugTools(ref) {
    util_1.exportNgVar(PROFILER_GLOBAL_NAME, new common_tools_1.AngularProfiler(ref));
    return ref;
}
exports.enableDebugTools = enableDebugTools;
/**
 * Disables Angular tools.
 *
 * @experimental All debugging apis are currently experimental.
 */
function disableDebugTools() {
    util_1.exportNgVar(PROFILER_GLOBAL_NAME, null);
}
exports.disableDebugTools = disableDebugTools;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3NyYy9icm93c2VyL3Rvb2xzL3Rvb2xzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsdUNBQTJDO0FBQzNDLCtDQUErQztBQUUvQyxJQUFNLG9CQUFvQixHQUFHLFVBQVUsQ0FBQztBQUV4Qzs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCwwQkFBb0MsR0FBb0I7SUFDdEQsa0JBQVcsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLDhCQUFlLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM1RCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFIRCw0Q0FHQztBQUVEOzs7O0dBSUc7QUFDSDtJQUNFLGtCQUFXLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDMUMsQ0FBQztBQUZELDhDQUVDIn0=