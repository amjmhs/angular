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
/**
 * An implementation of the `Program` API which behaves like plain `tsc` and does not include any
 * Angular-specific behavior whatsoever.
 *
 * This allows `ngc` to behave like `tsc` in cases where JIT code needs to be tested.
 */
var TscPassThroughProgram = /** @class */ (function () {
    function TscPassThroughProgram(rootNames, options, host, oldProgram) {
        this.options = options;
        this.host = host;
        this.tsProgram =
            ts.createProgram(rootNames, options, host, oldProgram && oldProgram.getTsProgram());
    }
    TscPassThroughProgram.prototype.getTsProgram = function () { return this.tsProgram; };
    TscPassThroughProgram.prototype.getTsOptionDiagnostics = function (cancellationToken) {
        return this.tsProgram.getOptionsDiagnostics(cancellationToken);
    };
    TscPassThroughProgram.prototype.getNgOptionDiagnostics = function (cancellationToken) {
        return [];
    };
    TscPassThroughProgram.prototype.getTsSyntacticDiagnostics = function (sourceFile, cancellationToken) {
        return this.tsProgram.getSyntacticDiagnostics(sourceFile, cancellationToken);
    };
    TscPassThroughProgram.prototype.getNgStructuralDiagnostics = function (cancellationToken) {
        return [];
    };
    TscPassThroughProgram.prototype.getTsSemanticDiagnostics = function (sourceFile, cancellationToken) {
        return this.tsProgram.getSemanticDiagnostics(sourceFile, cancellationToken);
    };
    TscPassThroughProgram.prototype.getNgSemanticDiagnostics = function (fileName, cancellationToken) {
        return [];
    };
    TscPassThroughProgram.prototype.loadNgStructureAsync = function () { return Promise.resolve(); };
    TscPassThroughProgram.prototype.listLazyRoutes = function (entryRoute) {
        throw new Error('Method not implemented.');
    };
    TscPassThroughProgram.prototype.getLibrarySummaries = function () {
        throw new Error('Method not implemented.');
    };
    TscPassThroughProgram.prototype.getEmittedGeneratedFiles = function () {
        throw new Error('Method not implemented.');
    };
    TscPassThroughProgram.prototype.getEmittedSourceFiles = function () {
        throw new Error('Method not implemented.');
    };
    TscPassThroughProgram.prototype.emit = function (opts) {
        var emitCallback = opts && opts.emitCallback || defaultEmitCallback;
        var emitResult = emitCallback({
            program: this.tsProgram,
            host: this.host,
            options: this.options,
            emitOnlyDtsFiles: false,
        });
        return emitResult;
    };
    return TscPassThroughProgram;
}());
exports.TscPassThroughProgram = TscPassThroughProgram;
var defaultEmitCallback = function (_a) {
    var program = _a.program, targetSourceFile = _a.targetSourceFile, writeFile = _a.writeFile, cancellationToken = _a.cancellationToken, emitOnlyDtsFiles = _a.emitOnlyDtsFiles, customTransformers = _a.customTransformers;
    return program.emit(targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, customTransformers);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNjX3Bhc3NfdGhyb3VnaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvdHJhbnNmb3JtZXJzL3RzY19wYXNzX3Rocm91Z2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFJSCwrQkFBaUM7QUFJakM7Ozs7O0dBS0c7QUFDSDtJQUdFLCtCQUNJLFNBQWdDLEVBQVUsT0FBNEIsRUFDOUQsSUFBc0IsRUFBRSxVQUF3QjtRQURkLFlBQU8sR0FBUCxPQUFPLENBQXFCO1FBQzlELFNBQUksR0FBSixJQUFJLENBQWtCO1FBQ2hDLElBQUksQ0FBQyxTQUFTO1lBQ1YsRUFBRSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLElBQUksVUFBVSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7SUFDMUYsQ0FBQztJQUVELDRDQUFZLEdBQVosY0FBNkIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUVyRCxzREFBc0IsR0FBdEIsVUFBdUIsaUJBQ1M7UUFDOUIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELHNEQUFzQixHQUF0QixVQUF1QixpQkFDUztRQUM5QixPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFRCx5REFBeUIsR0FBekIsVUFDSSxVQUFvQyxFQUNwQyxpQkFBa0Q7UUFDcEQsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLFVBQVUsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFFRCwwREFBMEIsR0FBMUIsVUFBMkIsaUJBQ1M7UUFDbEMsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsd0RBQXdCLEdBQXhCLFVBQ0ksVUFBb0MsRUFDcEMsaUJBQWtEO1FBQ3BELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBRUQsd0RBQXdCLEdBQXhCLFVBQ0ksUUFBMkIsRUFDM0IsaUJBQWtEO1FBQ3BELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELG9EQUFvQixHQUFwQixjQUF3QyxPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFbkUsOENBQWMsR0FBZCxVQUFlLFVBQTZCO1FBQzFDLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsbURBQW1CLEdBQW5CO1FBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCx3REFBd0IsR0FBeEI7UUFDRSxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELHFEQUFxQixHQUFyQjtRQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsb0NBQUksR0FBSixVQUFLLElBTUo7UUFDQyxJQUFNLFlBQVksR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxtQkFBbUIsQ0FBQztRQUV0RSxJQUFNLFVBQVUsR0FBRyxZQUFZLENBQUM7WUFDOUIsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3ZCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNmLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixnQkFBZ0IsRUFBRSxLQUFLO1NBQ3hCLENBQUMsQ0FBQztRQUNILE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFDSCw0QkFBQztBQUFELENBQUMsQUFoRkQsSUFnRkM7QUFoRlksc0RBQXFCO0FBa0ZsQyxJQUFNLG1CQUFtQixHQUNyQixVQUFDLEVBQ29CO1FBRG5CLG9CQUFPLEVBQUUsc0NBQWdCLEVBQUUsd0JBQVMsRUFBRSx3Q0FBaUIsRUFBRSxzQ0FBZ0IsRUFDekUsMENBQWtCO0lBQ2hCLE9BQUEsT0FBTyxDQUFDLElBQUksQ0FDUixnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUM7QUFEekYsQ0FDeUYsQ0FBQyJ9