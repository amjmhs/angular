"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ERROR_CODE = 100;
exports.UNKNOWN_ERROR_CODE = 500;
exports.SOURCE = 'angular';
function isTsDiagnostic(diagnostic) {
    return diagnostic != null && diagnostic.source !== 'angular';
}
exports.isTsDiagnostic = isTsDiagnostic;
function isNgDiagnostic(diagnostic) {
    return diagnostic != null && diagnostic.source === 'angular';
}
exports.isNgDiagnostic = isNgDiagnostic;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy90cmFuc2Zvcm1lcnMvYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBS1UsUUFBQSxrQkFBa0IsR0FBRyxHQUFHLENBQUM7QUFDekIsUUFBQSxrQkFBa0IsR0FBRyxHQUFHLENBQUM7QUFDekIsUUFBQSxNQUFNLEdBQUcsU0FBc0IsQ0FBQztBQWtCN0Msd0JBQStCLFVBQWU7SUFDNUMsT0FBTyxVQUFVLElBQUksSUFBSSxJQUFJLFVBQVUsQ0FBQyxNQUFNLEtBQUssU0FBUyxDQUFDO0FBQy9ELENBQUM7QUFGRCx3Q0FFQztBQUVELHdCQUErQixVQUFlO0lBQzVDLE9BQU8sVUFBVSxJQUFJLElBQUksSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQztBQUMvRCxDQUFDO0FBRkQsd0NBRUM7QUFpTkQsSUFBWSxTQVNYO0FBVEQsV0FBWSxTQUFTO0lBQ25CLHVDQUFZLENBQUE7SUFDWixxQ0FBVyxDQUFBO0lBQ1gsaURBQWlCLENBQUE7SUFDakIscURBQW1CLENBQUE7SUFDbkIsZ0RBQWdCLENBQUE7SUFFaEIsZ0RBQTRCLENBQUE7SUFDNUIsd0NBQWdELENBQUE7QUFDbEQsQ0FBQyxFQVRXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBU3BCIn0=