"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var compiler_1 = require("@angular/compiler");
exports.StaticReflector = compiler_1.StaticReflector;
exports.StaticSymbol = compiler_1.StaticSymbol;
var expression_diagnostics_1 = require("./src/diagnostics/expression_diagnostics");
exports.getExpressionScope = expression_diagnostics_1.getExpressionScope;
exports.getTemplateExpressionDiagnostics = expression_diagnostics_1.getTemplateExpressionDiagnostics;
var expression_type_1 = require("./src/diagnostics/expression_type");
exports.AstType = expression_type_1.AstType;
var symbols_1 = require("./src/diagnostics/symbols");
exports.BuiltinType = symbols_1.BuiltinType;
var typescript_symbols_1 = require("./src/diagnostics/typescript_symbols");
exports.getClassMembersFromDeclaration = typescript_symbols_1.getClassMembersFromDeclaration;
exports.getPipesTable = typescript_symbols_1.getPipesTable;
exports.getSymbolQuery = typescript_symbols_1.getSymbolQuery;
var version_1 = require("./src/version");
exports.VERSION = version_1.VERSION;
__export(require("./src/metadata"));
__export(require("./src/transformers/api"));
__export(require("./src/transformers/entry_points"));
__export(require("./src/perform_compile"));
var ngtools_api_1 = require("./src/ngtools_api");
exports.__NGTOOLS_PRIVATE_API_2 = ngtools_api_1.NgTools_InternalApi_NG_2;
var util_1 = require("./src/transformers/util");
exports.ngToTsDiagnostic = util_1.ngToTsDiagnostic;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCw4Q0FBeUg7QUFBeEQscUNBQUEsZUFBZSxDQUFBO0FBQUUsa0NBQUEsWUFBWSxDQUFBO0FBQzlGLG1GQUFzSTtBQUF0RyxzREFBQSxrQkFBa0IsQ0FBQTtBQUFFLG9FQUFBLGdDQUFnQyxDQUFBO0FBQ3BGLHFFQUF3RjtBQUFoRixvQ0FBQSxPQUFPLENBQUE7QUFDZixxREFBMEs7QUFBbEssZ0NBQUEsV0FBVyxDQUFBO0FBQ25CLDJFQUFtSDtBQUEzRyw4REFBQSw4QkFBOEIsQ0FBQTtBQUFFLDZDQUFBLGFBQWEsQ0FBQTtBQUFFLDhDQUFBLGNBQWMsQ0FBQTtBQUNyRSx5Q0FBc0M7QUFBOUIsNEJBQUEsT0FBTyxDQUFBO0FBRWYsb0NBQStCO0FBQy9CLDRDQUF1QztBQUN2QyxxREFBZ0Q7QUFFaEQsMkNBQXNDO0FBS3RDLGlEQUFzRjtBQUE5RSxnREFBQSx3QkFBd0IsQ0FBMkI7QUFFM0QsZ0RBQXlEO0FBQWpELGtDQUFBLGdCQUFnQixDQUFBIn0=