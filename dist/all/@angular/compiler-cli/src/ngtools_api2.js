"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var perform_compile_1 = require("./perform_compile");
var compiler_host_1 = require("./transformers/compiler_host");
var program_1 = require("./transformers/program");
var EmitFlags;
(function (EmitFlags) {
    EmitFlags[EmitFlags["DTS"] = 1] = "DTS";
    EmitFlags[EmitFlags["JS"] = 2] = "JS";
    EmitFlags[EmitFlags["Metadata"] = 4] = "Metadata";
    EmitFlags[EmitFlags["I18nBundle"] = 8] = "I18nBundle";
    EmitFlags[EmitFlags["Codegen"] = 16] = "Codegen";
    EmitFlags[EmitFlags["Default"] = 19] = "Default";
    EmitFlags[EmitFlags["All"] = 31] = "All";
})(EmitFlags = exports.EmitFlags || (exports.EmitFlags = {}));
// Wrapper for createProgram.
function createProgram(_a) {
    var rootNames = _a.rootNames, options = _a.options, host = _a.host, oldProgram = _a.oldProgram;
    return program_1.createProgram({ rootNames: rootNames, options: options, host: host, oldProgram: oldProgram });
}
exports.createProgram = createProgram;
// Wrapper for createCompilerHost.
function createCompilerHost(_a) {
    var options = _a.options, _b = _a.tsHost, tsHost = _b === void 0 ? ts.createCompilerHost(options, true) : _b;
    return compiler_host_1.createCompilerHost({ options: options, tsHost: tsHost });
}
exports.createCompilerHost = createCompilerHost;
function formatDiagnostics(diags) {
    return perform_compile_1.formatDiagnostics(diags);
}
exports.formatDiagnostics = formatDiagnostics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd0b29sc19hcGkyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3Rvb2xzX2FwaTIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFrQkgsK0JBQWlDO0FBRWpDLHFEQUE2RTtBQUU3RSw4REFBc0Y7QUFDdEYsa0RBQTBFO0FBNEMxRSxJQUFZLFNBU1g7QUFURCxXQUFZLFNBQVM7SUFDbkIsdUNBQVksQ0FBQTtJQUNaLHFDQUFXLENBQUE7SUFDWCxpREFBaUIsQ0FBQTtJQUNqQixxREFBbUIsQ0FBQTtJQUNuQixnREFBZ0IsQ0FBQTtJQUVoQixnREFBNEIsQ0FBQTtJQUM1Qix3Q0FBZ0QsQ0FBQTtBQUNsRCxDQUFDLEVBVFcsU0FBUyxHQUFULGlCQUFTLEtBQVQsaUJBQVMsUUFTcEI7QUErQ0QsNkJBQTZCO0FBQzdCLHVCQUNJLEVBQzZGO1FBRDVGLHdCQUFTLEVBQUUsb0JBQU8sRUFBRSxjQUFJLEVBQUUsMEJBQVU7SUFHdkMsT0FBTyx1QkFBaUIsQ0FBQyxFQUFDLFNBQVMsV0FBQSxFQUFFLE9BQU8sU0FBQSxFQUFFLElBQUksTUFBQSxFQUFFLFVBQVUsRUFBRSxVQUFpQixFQUFDLENBQUMsQ0FBQztBQUN0RixDQUFDO0FBTEQsc0NBS0M7QUFFRCxrQ0FBa0M7QUFDbEMsNEJBQ0ksRUFDd0Q7UUFEdkQsb0JBQU8sRUFBRSxjQUE2QyxFQUE3QyxrRUFBNkM7SUFFekQsT0FBTyxrQ0FBa0IsQ0FBQyxFQUFDLE9BQU8sU0FBQSxFQUFFLE1BQU0sUUFBQSxFQUFDLENBQUMsQ0FBQztBQUMvQyxDQUFDO0FBSkQsZ0RBSUM7QUFJRCwyQkFBa0MsS0FBa0I7SUFDbEQsT0FBTyxtQ0FBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QyxDQUFDO0FBRkQsOENBRUMifQ==