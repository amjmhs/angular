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
var language_services_1 = require("@angular/compiler-cli/src/language_services");
var expressions_1 = require("./expressions");
var utils_1 = require("./utils");
function locateSymbol(info) {
    if (!info.position)
        return undefined;
    var templatePosition = info.position - info.template.span.start;
    var path = utils_1.findTemplateAstAt(info.templateAst, templatePosition);
    if (path.tail) {
        var symbol_1 = undefined;
        var span_1 = undefined;
        var attributeValueSymbol_1 = function (ast, inEvent) {
            if (inEvent === void 0) { inEvent = false; }
            var attribute = findAttribute(info);
            if (attribute) {
                if (utils_1.inSpan(templatePosition, utils_1.spanOf(attribute.valueSpan))) {
                    var dinfo = utils_1.diagnosticInfoFromTemplateInfo(info);
                    var scope = language_services_1.getExpressionScope(dinfo, path, inEvent);
                    if (attribute.valueSpan) {
                        var expressionOffset = attribute.valueSpan.start.offset + 1;
                        var result = expressions_1.getExpressionSymbol(scope, ast, templatePosition - expressionOffset, info.template.query);
                        if (result) {
                            symbol_1 = result.symbol;
                            span_1 = utils_1.offsetSpan(result.span, expressionOffset);
                        }
                    }
                    return true;
                }
            }
            return false;
        };
        path.tail.visit({
            visitNgContent: function (ast) { },
            visitEmbeddedTemplate: function (ast) { },
            visitElement: function (ast) {
                var component = ast.directives.find(function (d) { return d.directive.isComponent; });
                if (component) {
                    symbol_1 = info.template.query.getTypeSymbol(component.directive.type.reference);
                    symbol_1 = symbol_1 && new OverrideKindSymbol(symbol_1, 'component');
                    span_1 = utils_1.spanOf(ast);
                }
                else {
                    // Find a directive that matches the element name
                    var directive = ast.directives.find(function (d) { return d.directive.selector != null && d.directive.selector.indexOf(ast.name) >= 0; });
                    if (directive) {
                        symbol_1 = info.template.query.getTypeSymbol(directive.directive.type.reference);
                        symbol_1 = symbol_1 && new OverrideKindSymbol(symbol_1, 'directive');
                        span_1 = utils_1.spanOf(ast);
                    }
                }
            },
            visitReference: function (ast) {
                symbol_1 = ast.value && info.template.query.getTypeSymbol(compiler_1.tokenReference(ast.value));
                span_1 = utils_1.spanOf(ast);
            },
            visitVariable: function (ast) { },
            visitEvent: function (ast) {
                if (!attributeValueSymbol_1(ast.handler, /* inEvent */ true)) {
                    symbol_1 = findOutputBinding(info, path, ast);
                    symbol_1 = symbol_1 && new OverrideKindSymbol(symbol_1, 'event');
                    span_1 = utils_1.spanOf(ast);
                }
            },
            visitElementProperty: function (ast) { attributeValueSymbol_1(ast.value); },
            visitAttr: function (ast) { },
            visitBoundText: function (ast) {
                var expressionPosition = templatePosition - ast.sourceSpan.start.offset;
                if (utils_1.inSpan(expressionPosition, ast.value.span)) {
                    var dinfo = utils_1.diagnosticInfoFromTemplateInfo(info);
                    var scope = language_services_1.getExpressionScope(dinfo, path, /* includeEvent */ false);
                    var result = expressions_1.getExpressionSymbol(scope, ast.value, expressionPosition, info.template.query);
                    if (result) {
                        symbol_1 = result.symbol;
                        span_1 = utils_1.offsetSpan(result.span, ast.sourceSpan.start.offset);
                    }
                }
            },
            visitText: function (ast) { },
            visitDirective: function (ast) {
                symbol_1 = info.template.query.getTypeSymbol(ast.directive.type.reference);
                span_1 = utils_1.spanOf(ast);
            },
            visitDirectiveProperty: function (ast) {
                if (!attributeValueSymbol_1(ast.value)) {
                    symbol_1 = findInputBinding(info, path, ast);
                    span_1 = utils_1.spanOf(ast);
                }
            }
        }, null);
        if (symbol_1 && span_1) {
            return { symbol: symbol_1, span: utils_1.offsetSpan(span_1, info.template.span.start) };
        }
    }
}
exports.locateSymbol = locateSymbol;
function findAttribute(info) {
    if (info.position) {
        var templatePosition = info.position - info.template.span.start;
        var path = compiler_1.findNode(info.htmlAst, templatePosition);
        return path.first(compiler_1.Attribute);
    }
}
function findInputBinding(info, path, binding) {
    var element = path.first(compiler_1.ElementAst);
    if (element) {
        for (var _i = 0, _a = element.directives; _i < _a.length; _i++) {
            var directive = _a[_i];
            var invertedInput = invertMap(directive.directive.inputs);
            var fieldName = invertedInput[binding.templateName];
            if (fieldName) {
                var classSymbol = info.template.query.getTypeSymbol(directive.directive.type.reference);
                if (classSymbol) {
                    return classSymbol.members().get(fieldName);
                }
            }
        }
    }
}
function findOutputBinding(info, path, binding) {
    var element = path.first(compiler_1.ElementAst);
    if (element) {
        for (var _i = 0, _a = element.directives; _i < _a.length; _i++) {
            var directive = _a[_i];
            var invertedOutputs = invertMap(directive.directive.outputs);
            var fieldName = invertedOutputs[binding.name];
            if (fieldName) {
                var classSymbol = info.template.query.getTypeSymbol(directive.directive.type.reference);
                if (classSymbol) {
                    return classSymbol.members().get(fieldName);
                }
            }
        }
    }
}
function invertMap(obj) {
    var result = {};
    for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
        var name_1 = _a[_i];
        var v = obj[name_1];
        result[v] = name_1;
    }
    return result;
}
/**
 * Wrap a symbol and change its kind to component.
 */
var OverrideKindSymbol = /** @class */ (function () {
    function OverrideKindSymbol(sym, kindOverride) {
        this.sym = sym;
        this.kind = kindOverride;
    }
    Object.defineProperty(OverrideKindSymbol.prototype, "name", {
        get: function () { return this.sym.name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OverrideKindSymbol.prototype, "language", {
        get: function () { return this.sym.language; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OverrideKindSymbol.prototype, "type", {
        get: function () { return this.sym.type; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OverrideKindSymbol.prototype, "container", {
        get: function () { return this.sym.container; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OverrideKindSymbol.prototype, "public", {
        get: function () { return this.sym.public; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OverrideKindSymbol.prototype, "callable", {
        get: function () { return this.sym.callable; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OverrideKindSymbol.prototype, "nullable", {
        get: function () { return this.sym.nullable; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OverrideKindSymbol.prototype, "definition", {
        get: function () { return this.sym.definition; },
        enumerable: true,
        configurable: true
    });
    OverrideKindSymbol.prototype.members = function () { return this.sym.members(); };
    OverrideKindSymbol.prototype.signatures = function () { return this.sym.signatures(); };
    OverrideKindSymbol.prototype.selectSignature = function (types) { return this.sym.selectSignature(types); };
    OverrideKindSymbol.prototype.indexed = function (argument) { return this.sym.indexed(argument); };
    return OverrideKindSymbol;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYXRlX3N5bWJvbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xhbmd1YWdlLXNlcnZpY2Uvc3JjL2xvY2F0ZV9zeW1ib2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBK0o7QUFDL0osaUZBQStFO0FBRy9FLDZDQUFrRDtBQUVsRCxpQ0FBc0c7QUFPdEcsc0JBQTZCLElBQWtCO0lBQzdDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTtRQUFFLE9BQU8sU0FBUyxDQUFDO0lBQ3JDLElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbEUsSUFBTSxJQUFJLEdBQUcseUJBQWlCLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ25FLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtRQUNiLElBQUksUUFBTSxHQUFxQixTQUFTLENBQUM7UUFDekMsSUFBSSxNQUFJLEdBQW1CLFNBQVMsQ0FBQztRQUNyQyxJQUFNLHNCQUFvQixHQUFHLFVBQUMsR0FBUSxFQUFFLE9BQXdCO1lBQXhCLHdCQUFBLEVBQUEsZUFBd0I7WUFDOUQsSUFBTSxTQUFTLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RDLElBQUksU0FBUyxFQUFFO2dCQUNiLElBQUksY0FBTSxDQUFDLGdCQUFnQixFQUFFLGNBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRTtvQkFDekQsSUFBTSxLQUFLLEdBQUcsc0NBQThCLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ25ELElBQU0sS0FBSyxHQUFHLHNDQUFrQixDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7b0JBQ3ZELElBQUksU0FBUyxDQUFDLFNBQVMsRUFBRTt3QkFD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