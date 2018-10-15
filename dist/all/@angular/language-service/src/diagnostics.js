"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var language_services_1 = require("@angular/compiler-cli/src/language_services");
var types_1 = require("./types");
var utils_1 = require("./utils");
function getTemplateDiagnostics(fileName, astProvider, templates) {
    var results = [];
    var _loop_1 = function (template) {
        var ast = astProvider.getTemplateAst(template, fileName);
        if (ast) {
            if (ast.parseErrors && ast.parseErrors.length) {
                results.push.apply(results, ast.parseErrors.map(function (e) { return ({
                    kind: types_1.DiagnosticKind.Error,
                    span: utils_1.offsetSpan(utils_1.spanOf(e.span), template.span.start),
                    message: e.msg
                }); }));
            }
            else if (ast.templateAst && ast.htmlAst) {
                var info = {
                    templateAst: ast.templateAst,
                    htmlAst: ast.htmlAst,
                    offset: template.span.start,
                    query: template.query,
                    members: template.members
                };
                var expressionDiagnostics = language_services_1.getTemplateExpressionDiagnostics(info);
                results.push.apply(results, expressionDiagnostics);
            }
            if (ast.errors) {
                results.push.apply(results, ast.errors.map(function (e) { return ({ kind: e.kind, span: e.span || template.span, message: e.message }); }));
            }
        }
    };
    for (var _i = 0, templates_1 = templates; _i < templates_1.length; _i++) {
        var template = templates_1[_i];
        _loop_1(template);
    }
    return results;
}
exports.getTemplateDiagnostics = getTemplateDiagnostics;
function getDeclarationDiagnostics(declarations, modules) {
    var results = [];
    var directives = undefined;
    var _loop_2 = function (declaration) {
        var report = function (message, span) {
            results.push({
                kind: types_1.DiagnosticKind.Error,
                span: span || declaration.declarationSpan, message: message
            });
        };
        for (var _i = 0, _a = declaration.errors; _i < _a.length; _i++) {
            var error = _a[_i];
            report(error.message, error.span);
        }
        if (declaration.metadata) {
            if (declaration.metadata.isComponent) {
                if (!modules.ngModuleByPipeOrDirective.has(declaration.type)) {
                    report("Component '" + declaration.type.name + "' is not included in a module and will not be available inside a template. Consider adding it to a NgModule declaration");
                }
                var _b = declaration.metadata.template, template = _b.template, templateUrl = _b.templateUrl;
                if (template === null && !templateUrl) {
                    report("Component '" + declaration.type.name + "' must have a template or templateUrl");
                }
                else if (template && templateUrl) {
                    report("Component '" + declaration.type.name + "' must not have both template and templateUrl");
                }
            }
            else {
                if (!directives) {
                    directives = new Set();
                    modules.ngModules.forEach(function (module) {
                        module.declaredDirectives.forEach(function (directive) { directives.add(directive.reference); });
                    });
                }
                if (!directives.has(declaration.type)) {
                    report("Directive '" + declaration.type.name + "' is not included in a module and will not be available inside a template. Consider adding it to a NgModule declaration");
                }
            }
        }
    };
    for (var _i = 0, declarations_1 = declarations; _i < declarations_1.length; _i++) {
        var declaration = declarations_1[_i];
        _loop_2(declaration);
    }
    return results;
}
exports.getDeclarationDiagnostics = getDeclarationDiagnostics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhZ25vc3RpY3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sYW5ndWFnZS1zZXJ2aWNlL3NyYy9kaWFnbm9zdGljcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILGlGQUFxSDtBQUdySCxpQ0FBNEg7QUFDNUgsaUNBQTJDO0FBTTNDLGdDQUNJLFFBQWdCLEVBQUUsV0FBd0IsRUFBRSxTQUEyQjtJQUN6RSxJQUFNLE9BQU8sR0FBZ0IsRUFBRSxDQUFDOzRCQUNyQixRQUFRO1FBQ2pCLElBQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzNELElBQUksR0FBRyxFQUFFO1lBQ1AsSUFBSSxHQUFHLENBQUMsV0FBVyxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO2dCQUM3QyxPQUFPLENBQUMsSUFBSSxPQUFaLE9BQU8sRUFBUyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FDL0IsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDO29CQUNKLElBQUksRUFBRSxzQkFBYyxDQUFDLEtBQUs7b0JBQzFCLElBQUksRUFBRSxrQkFBVSxDQUFDLGNBQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ3JELE9BQU8sRUFBRSxDQUFDLENBQUMsR0FBRztpQkFDZixDQUFDLEVBSkcsQ0FJSCxDQUFDLEVBQUU7YUFDVjtpQkFBTSxJQUFJLEdBQUcsQ0FBQyxXQUFXLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRTtnQkFDekMsSUFBTSxJQUFJLEdBQTJCO29CQUNuQyxXQUFXLEVBQUUsR0FBRyxDQUFDLFdBQVc7b0JBQzVCLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTztvQkFDcEIsTUFBTSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FB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