"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var expression_type_1 = require("./expression_type");
var symbols_1 = require("./symbols");
function getTemplateExpressionDiagnostics(info) {
    var visitor = new ExpressionDiagnosticsVisitor(info, function (path, includeEvent) {
        return getExpressionScope(info, path, includeEvent);
    });
    compiler_1.templateVisitAll(visitor, info.templateAst);
    return visitor.diagnostics;
}
exports.getTemplateExpressionDiagnostics = getTemplateExpressionDiagnostics;
function getExpressionDiagnostics(scope, ast, query, context) {
    if (context === void 0) { context = {}; }
    var analyzer = new expression_type_1.AstType(scope, query, context);
    analyzer.getDiagnostics(ast);
    return analyzer.diagnostics;
}
exports.getExpressionDiagnostics = getExpressionDiagnostics;
function getReferences(info) {
    var result = [];
    function processReferences(references) {
        var _loop_1 = function (reference) {
            var type = undefined;
            if (reference.value) {
                type = info.query.getTypeSymbol(compiler_1.tokenReference(reference.value));
            }
            result.push({
                name: reference.name,
                kind: 'reference',
                type: type || info.query.getBuiltinType(symbols_1.BuiltinType.Any),
                get definition() { return getDefinitionOf(info, reference); }
            });
        };
        for (var _i = 0, references_1 = references; _i < references_1.length; _i++) {
            var reference = references_1[_i];
            _loop_1(reference);
        }
    }
    var visitor = new /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.visitEmbeddedTemplate = function (ast, context) {
            _super.prototype.visitEmbeddedTemplate.call(this, ast, context);
            processReferences(ast.references);
        };
        class_1.prototype.visitElement = function (ast, context) {
            _super.prototype.visitElement.call(this, ast, context);
            processReferences(ast.references);
        };
        return class_1;
    }(compiler_1.RecursiveTemplateAstVisitor));
    compiler_1.templateVisitAll(visitor, info.templateAst);
    return result;
}
function getDefinitionOf(info, ast) {
    if (info.fileName) {
        var templateOffset = info.offset;
        return [{
                fileName: info.fileName,
                span: {
                    start: ast.sourceSpan.start.offset + templateOffset,
                    end: ast.sourceSpan.end.offset + templateOffset
                }
            }];
    }
}
function getVarDeclarations(info, path) {
    var result = [];
    var current = path.tail;
    while (current) {
        if (current instanceof compiler_1.EmbeddedTemplateAst) {
            var _loop_2 = function (variable) {
                var name_1 = variable.name;
                // Find the first directive with a context.
                var context = current.directives.map(function (d) { return info.query.getTemplateContext(d.directive.type.reference); })
                    .find(function (c) { return !!c; });
                // Determine the type of the context field referenced by variable.value.
                var type = undefined;
                if (context) {
                    var value = context.get(variable.value);
                    if (value) {
                        type = value.type;
                        var kind = info.query.getTypeKind(type);
                        if (kind === symbols_1.BuiltinType.Any || kind == symbols_1.BuiltinType.Unbound) {
                            // The any type is not very useful here. For special cases, such as ngFor, we can do
                            // better.
                            type = refinedVariableType(type, info, current);
                        }
                    }
                }
                if (!type) {
                    type = info.query.getBuiltinType(symbols_1.BuiltinType.Any);
                }
                result.push({
                    name: name_1,
                    kind: 'variable', type: type, get definition() { return getDefinitionOf(info, variable); }
                });
            };
            for (var _i = 0, _a = current.variables; _i < _a.length; _i++) {
                var variable = _a[_i];
                _loop_2(variable);
            }
        }
        current = path.parentOf(current);
    }
    return result;
}
function refinedVariableType(type, info, templateElement) {
    // Special case the ngFor directive
    var ngForDirective = templateElement.directives.find(function (d) {
        var name = compiler_1.identifierName(d.directive.type);
        return name == 'NgFor' || name == 'NgForOf';
    });
    if (ngForDirective) {
        var ngForOfBinding = ngForDirective.inputs.find(function (i) { return i.directiveName == 'ngForOf'; });
        if (ngForOfBinding) {
            var bindingType = new expression_type_1.AstType(info.members, info.query, {}).getType(ngForOfBinding.value);
            if (bindingType) {
                var result = info.query.getElementType(bindingType);
                if (result) {
                    return result;
                }
            }
        }
    }
    // We can't do better, return any
    return info.query.getBuiltinType(symbols_1.BuiltinType.Any);
}
function getEventDeclaration(info, includeEvent) {
    var result = [];
    if (includeEvent) {
        // TODO: Determine the type of the event parameter based on the Observable<T> or EventEmitter<T>
        // of the event.
        result = [{ name: '$event', kind: 'variable', type: info.query.getBuiltinType(symbols_1.BuiltinType.Any) }];
    }
    return result;
}
function getExpressionScope(info, path, includeEvent) {
    var result = info.members;
    var references = getReferences(info);
    var variables = getVarDeclarations(info, path);
    var events = getEventDeclaration(info, includeEvent);
    if (references.length || variables.length || events.length) {
        var referenceTable = info.query.createSymbolTable(references);
        var variableTable = info.query.createSymbolTable(variables);
        var eventsTable = info.query.createSymbolTable(events);
        result = info.query.mergeSymbolTable([result, referenceTable, variableTable, eventsTable]);
    }
    return result;
}
exports.getExpressionScope = getExpressionScope;
var ExpressionDiagnosticsVisitor = /** @class */ (function (_super) {
    __extends(ExpressionDiagnosticsVisitor, _super);
    function ExpressionDiagnosticsVisitor(info, getExpressionScope) {
        var _this = _super.call(this) || this;
        _this.info = info;
        _this.getExpressionScope = getExpressionScope;
        _this.diagnostics = [];
        _this.path = new compiler_1.AstPath([]);
        return _this;
    }
    ExpressionDiagnosticsVisitor.prototype.visitDirective = function (ast, context) {
        // Override the default child visitor to ignore the host properties of a directive.
        if (ast.inputs && ast.inputs.length) {
            compiler_1.templateVisitAll(this, ast.inputs, context);
        }
    };
    ExpressionDiagnosticsVisitor.prototype.visitBoundText = function (ast) {
        this.push(ast);
        this.diagnoseExpression(ast.value, ast.sourceSpan.start.offset, false);
        this.pop();
    };
    ExpressionDiagnosticsVisitor.prototype.visitDirectiveProperty = function (ast) {
        this.push(ast);
        this.diagnoseExpression(ast.value, this.attributeValueLocation(ast), false);
        this.pop();
    };
    ExpressionDiagnosticsVisitor.prototype.visitElementProperty = function (ast) {
        this.push(ast);
        this.diagnoseExpression(ast.value, this.attributeValueLocation(ast), false);
        this.pop();
    };
    ExpressionDiagnosticsVisitor.prototype.visitEvent = function (ast) {
        this.push(ast);
        this.diagnoseExpression(ast.handler, this.attributeValueLocation(ast), true);
        this.pop();
    };
    ExpressionDiagnosticsVisitor.prototype.visitVariable = function (ast) {
        var directive = this.directiveSummary;
        if (directive && ast.value) {
            var context = this.info.query.getTemplateContext(directive.type.reference);
            if (context && !context.has(ast.value)) {
                if (ast.value === '$implicit') {
                    this.reportError('The template context does not have an implicit value', spanOf(ast.sourceSpan));
                }
                else {
                    this.reportError("The template context does not defined a member called '" + ast.value + "'", spanOf(ast.sourceSpan));
                }
            }
        }
    };
    ExpressionDiagnosticsVisitor.prototype.visitElement = function (ast, context) {
        this.push(ast);
        _super.prototype.visitElement.call(this, ast, context);
        this.pop();
    };
    ExpressionDiagnosticsVisitor.prototype.visitEmbeddedTemplate = function (ast, context) {
        var previousDirectiveSummary = this.directiveSummary;
        this.push(ast);
        // Find directive that references this template
        this.directiveSummary =
            ast.directives.map(function (d) { return d.directive; }).find(function (d) { return hasTemplateReference(d.type); });
        // Process children
        _super.prototype.visitEmbeddedTemplate.call(this, ast, context);
        this.pop();
        this.directiveSummary = previousDirectiveSummary;
    };
    ExpressionDiagnosticsVisitor.prototype.attributeValueLocation = function (ast) {
        var path = compiler_1.findNode(this.info.htmlAst, ast.sourceSpan.start.offset);
        var last = path.tail;
        if (last instanceof compiler_1.Attribute && last.valueSpan) {
            // Add 1 for the quote.
            return last.valueSpan.start.offset + 1;
        }
        return ast.sourceSpan.start.offset;
    };
    ExpressionDiagnosticsVisitor.prototype.diagnoseExpression = function (ast, offset, includeEvent) {
        var _this = this;
        var _a;
        var scope = this.getExpressionScope(this.path, includeEvent);
        (_a = this.diagnostics).push.apply(_a, getExpressionDiagnostics(scope, ast, this.info.query, {
            event: includeEvent
        }).map(function (d) { return ({
            span: offsetSpan(d.ast.span, offset + _this.info.offset),
            kind: d.kind,
            message: d.message
        }); }));
    };
    ExpressionDiagnosticsVisitor.prototype.push = function (ast) { this.path.push(ast); };
    ExpressionDiagnosticsVisitor.prototype.pop = function () { this.path.pop(); };
    ExpressionDiagnosticsVisitor.prototype.reportError = function (message, span) {
        if (span) {
            this.diagnostics.push({ span: offsetSpan(span, this.info.offset), kind: expression_type_1.DiagnosticKind.Error, message: message });
        }
    };
    ExpressionDiagnosticsVisitor.prototype.reportWarning = function (message, span) {
        this.diagnostics.push({ span: offsetSpan(span, this.info.offset), kind: expression_type_1.DiagnosticKind.Warning, message: message });
    };
    return ExpressionDiagnosticsVisitor;
}(compiler_1.RecursiveTemplateAstVisitor));
function hasTemplateReference(type) {
    if (type.diDeps) {
        for (var _i = 0, _a = type.diDeps; _i < _a.length; _i++) {
            var diDep = _a[_i];
            if (diDep.token && diDep.token.identifier &&
                compiler_1.identifierName(diDep.token.identifier) == 'TemplateRef')
                return true;
        }
    }
    return false;
}
function offsetSpan(span, amount) {
    return { start: span.start + amount, end: span.end + amount };
}
function spanOf(sourceSpan) {
    return { start: sourceSpan.start.offset, end: sourceSpan.end.offset };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzc2lvbl9kaWFnbm9zdGljcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvZGlhZ25vc3RpY3MvZXhwcmVzc2lvbl9kaWFnbm9zdGljcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCw4Q0FBaVo7QUFFaloscURBQXdHO0FBQ3hHLHFDQUE2RztBQWlCN0csMENBQWlELElBQTRCO0lBRTNFLElBQU0sT0FBTyxHQUFHLElBQUksNEJBQTRCLENBQzVDLElBQUksRUFBRSxVQUFDLElBQXFCLEVBQUUsWUFBcUI7UUFDekMsT0FBQSxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFlBQVksQ0FBQztJQUE1QyxDQUE0QyxDQUFDLENBQUM7SUFDNUQsMkJBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM1QyxPQUFPLE9BQU8sQ0FBQyxXQUFXLENBQUM7QUFDN0IsQ0FBQztBQVBELDRFQU9DO0FBRUQsa0NBQ0ksS0FBa0IsRUFBRSxHQUFRLEVBQUUsS0FBa0IsRUFDaEQsT0FBMEM7SUFBMUMsd0JBQUEsRUFBQSxZQUEwQztJQUM1QyxJQUFNLFFBQVEsR0FBRyxJQUFJLHlCQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwRCxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLE9BQU8sUUFBUSxDQUFDLFdBQVcsQ0FBQztBQUM5QixDQUFDO0FBTkQsNERBTUM7QUFFRCx1QkFBdUIsSUFBNEI7SUFDakQsSUFBTSxNQUFNLEdBQXdCLEVBQUUsQ0FBQztJQUV2QywyQkFBMkIsVUFBMEI7Z0NBQ3hDLFNBQVM7WUFDbEIsSUFBSSxJQUFJLEdBQXFCLFNBQVMsQ0FBQztZQUN2QyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ25CLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyx5QkFBYyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ2xFO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDVixJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUk7Z0JBQ3BCLElBQUksRUFBRSxXQUFXO2dCQUNqQixJQUFJLEVBQUUsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLHFCQUFXLENBQUMsR0FBRyxDQUFDO2dCQUN4RCxJQUFJLFVBQVUsS0FBSyxPQUFPLGVBQWUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzlELENBQUMsQ0FBQztRQUNMLENBQUM7UUFYRCxLQUF3QixVQUFVLEVBQVYseUJBQVUsRUFBVix3QkFBVSxFQUFWLElBQVU7WUFBN0IsSUFBTSxTQUFTLG1CQUFBO29CQUFULFNBQVM7U0FXbkI7SUFDSCxDQUFDO0lBRUQsSUFBTSxPQUFPLEdBQUc7UUFBa0IsMkJBQTJCO1FBQXpDOztRQVNwQixDQUFDO1FBUkMsdUNBQXFCLEdBQXJCLFVBQXNCLEdBQXdCLEVBQUUsT0FBWTtZQUMxRCxpQkFBTSxxQkFBcUIsWUFBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDMUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFDRCw4QkFBWSxHQUFaLFVBQWEsR0FBZSxFQUFFLE9BQVk7WUFDeEMsaUJBQU0sWUFBWSxZQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNqQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUNILGNBQUM7SUFBRCxDQUFDLEFBVG1CLENBQWMsc0NBQTJCLEVBUzVELENBQUM7SUFFRiwyQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBRTVDLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRCx5QkFBeUIsSUFBNEIsRUFBRSxHQUFnQjtJQUNyRSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7UUFDakIsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNuQyxPQUFPLENBQUM7Z0JBQ04sUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN2QixJQUFJLEVBQUU7b0JBQ0osS0FBSyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxjQUFjO29CQUNuRCxHQUFHLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLGNBQWM7aUJBQ2hEO2FBQ0YsQ0FBQyxDQUFDO0tBQ0o7QUFDSCxDQUFDO0FBRUQsNEJBQ0ksSUFBNEIsRUFBRSxJQUFxQjtJQUNyRCxJQUFNLE1BQU0sR0FBd0IsRUFBRSxDQUFDO0lBRXZDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDeEIsT0FBTyxPQUFPLEVBQUU7UUFDZCxJQUFJLE9BQU8sWUFBWSw4QkFBbUIsRUFBRTtvQ0FDL0IsUUFBUTtnQkFDakIsSUFBTSxNQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFFM0IsMkNBQTJDO2dCQUMzQyxJQUFNLE9BQU8sR0FDVCxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQXpELENBQXlELENBQUM7cUJBQ2pGLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLEVBQUgsQ0FBRyxDQUFDLENBQUM7Z0JBRXhCLHdFQUF3RTtnQkFDeEUsSUFBSSxJQUFJLEdBQXFCLFNBQVMsQ0FBQztnQkFDdkMsSUFBSSxPQUFPLEVBQUU7b0JBQ1gsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzFDLElBQUksS0FBSyxFQUFFO3dCQUNULElBQUksR0FBRyxLQUFLLENBQUMsSUFBTSxDQUFDO3dCQUNwQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDeEMsSUFBSSxJQUFJLEtBQUsscUJBQVcsQ0FBQyxHQUFHLElBQUksSUFBSSxJQUFJLHFCQUFXLENBQUMsT0FBTyxFQUFFOzRCQUMzRCxvRkFBb0Y7NEJBQ3BGLFVBQVU7NEJBQ1YsSUFBSSxHQUFHLG1CQUFtQixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7eUJBQ2pEO3FCQUNGO2lCQUNGO2dCQUNELElBQUksQ0FBQyxJQUFJLEVBQUU7b0JBQ1QsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLHFCQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ25EO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7b0JBQ1YsSUFBSSxRQUFBO29CQUNKLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxNQUFBLEVBQUUsSUFBSSxVQUFVLEtBQUssT0FBTyxlQUFlLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDckYsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztZQTdCRCxLQUF1QixVQUFpQixFQUFqQixLQUFBLE9BQU8sQ0FBQyxTQUFTLEVBQWpCLGNBQWlCLEVBQWpCLElBQWlCO2dCQUFuQyxJQUFNLFFBQVEsU0FBQTt3QkFBUixRQUFRO2FBNkJsQjtTQUNGO1FBQ0QsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDbEM7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQsNkJBQ0ksSUFBWSxFQUFFLElBQTRCLEVBQUUsZUFBb0M7SUFDbEYsbUNBQW1DO0lBQ25DLElBQU0sY0FBYyxHQUFHLGVBQWUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQztRQUN0RCxJQUFNLElBQUksR0FBRyx5QkFBYyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUMsT0FBTyxJQUFJLElBQUksT0FBTyxJQUFJLElBQUksSUFBSSxTQUFTLENBQUM7SUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFDSCxJQUFJLGNBQWMsRUFBRTtRQUNsQixJQUFNLGNBQWMsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxhQUFhLElBQUksU0FBUyxFQUE1QixDQUE0QixDQUFDLENBQUM7UUFDckYsSUFBSSxjQUFjLEVBQUU7WUFDbEIsSUFBTSxXQUFXLEdBQUcsSUFBSSx5QkFBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVGLElBQUksV0FBVyxFQUFFO2dCQUNmLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN0RCxJQUFJLE1BQU0sRUFBRTtvQkFDVixPQUFPLE1BQU0sQ0FBQztpQkFDZjthQUNGO1NBQ0Y7S0FDRjtJQUVELGlDQUFpQztJQUNqQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLHFCQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEQsQ0FBQztBQUVELDZCQUE2QixJQUE0QixFQUFFLFlBQXNCO0lBQy9FLElBQUksTUFBTSxHQUF3QixFQUFFLENBQUM7SUFDckMsSUFBSSxZQUFZLEVBQUU7UUFDaEIsZ0dBQWdHO1FBQ2hHLGdCQUFnQjtRQUNoQixNQUFNLEdBQUcsQ0FBQyxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMscUJBQVcsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUM7S0FDakc7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQsNEJBQ0ksSUFBNEIsRUFBRSxJQUFxQixFQUFFLFlBQXFCO0lBQzVFLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDMUIsSUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLElBQU0sU0FBUyxHQUFHLGtCQUFrQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqRCxJQUFNLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDdkQsSUFBSSxVQUFVLENBQUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtRQUMxRCxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2hFLElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDOUQsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6RCxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7S0FDNUY7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBYkQsZ0RBYUM7QUFFRDtJQUEyQyxnREFBMkI7SUFPcEUsc0NBQ1ksSUFBNEIsRUFDNUIsa0JBQWlGO1FBRjdGLFlBR0UsaUJBQU8sU0FFUjtRQUpXLFVBQUksR0FBSixJQUFJLENBQXdCO1FBQzVCLHdCQUFrQixHQUFsQixrQkFBa0IsQ0FBK0Q7UUFKN0YsaUJBQVcsR0FBMkIsRUFBRSxDQUFDO1FBTXZDLEtBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxrQkFBTyxDQUFjLEVBQUUsQ0FBQyxDQUFDOztJQUMzQyxDQUFDO0lBRUQscURBQWMsR0FBZCxVQUFlLEdBQWlCLEVBQUUsT0FBWTtRQUM1QyxtRkFBbUY7UUFDbkYsSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQ25DLDJCQUFnQixDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzdDO0lBQ0gsQ0FBQztJQUVELHFEQUFjLEdBQWQsVUFBZSxHQUFpQjtRQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNiLENBQUM7SUFFRCw2REFBc0IsR0FBdEIsVUFBdUIsR0FBOEI7UUFDbkQsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1RSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDYixDQUFDO0lBRUQsMkRBQW9CLEdBQXBCLFVBQXFCLEdBQTRCO1FBQy9DLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDNUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2IsQ0FBQztJQUVELGlEQUFVLEdBQVYsVUFBVyxHQUFrQjtRQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNiLENBQUM7SUFFRCxvREFBYSxHQUFiLFVBQWMsR0FBZ0I7UUFDNUIsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1FBQ3hDLElBQUksU0FBUyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUU7WUFDMUIsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUcsQ0FBQztZQUMvRSxJQUFJLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN0QyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEtBQUssV0FBVyxFQUFFO29CQUM3QixJQUFJLENBQUMsV0FBVyxDQUNaLHNEQUFzRCxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztpQkFDckY7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLFdBQVcsQ0FDWiw0REFBMEQsR0FBRyxDQUFDLEtBQUssTUFBRyxFQUN0RSxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7aUJBQzdCO2FBQ0Y7U0FDRjtJQUNILENBQUM7SUFFRCxtREFBWSxHQUFaLFVBQWEsR0FBZSxFQUFFLE9BQVk7UUFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNmLGlCQUFNLFlBQVksWUFBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2IsQ0FBQztJQUVELDREQUFxQixHQUFyQixVQUFzQixHQUF3QixFQUFFLE9BQVk7UUFDMUQsSUFBTSx3QkFBd0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFFdkQsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVmLCtDQUErQztRQUMvQyxJQUFJLENBQUMsZ0JBQWdCO1lBQ2pCLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFNBQVMsRUFBWCxDQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQTVCLENBQTRCLENBQUcsQ0FBQztRQUVuRixtQkFBbUI7UUFDbkIsaUJBQU0scUJBQXFCLFlBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRTFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVYLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyx3QkFBd0IsQ0FBQztJQUNuRCxDQUFDO0lBRU8sNkRBQXNCLEdBQTlCLFVBQStCLEdBQWdCO1FBQzdDLElBQU0sSUFBSSxHQUFHLG1CQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEUsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN2QixJQUFJLElBQUksWUFBWSxvQkFBUyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDL0MsdUJBQXVCO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztTQUN4QztRQUNELE9BQU8sR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQ3JDLENBQUM7SUFFTyx5REFBa0IsR0FBMUIsVUFBMkIsR0FBUSxFQUFFLE1BQWMsRUFBRSxZQUFxQjtRQUExRSxpQkFTQzs7UUFSQyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztRQUMvRCxDQUFBLEtBQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQSxDQUFDLElBQUksV0FBSSx3QkFBd0IsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3ZELEtBQUssRUFBRSxZQUFZO1NBQ3BCLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDO1lBQ0osSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLEdBQUcsS0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDdkQsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJO1lBQ1osT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPO1NBQ25CLENBQUMsRUFKRyxDQUlILENBQUMsRUFBRTtJQUNwQyxDQUFDO0lBRU8sMkNBQUksR0FBWixVQUFhLEdBQWdCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRS9DLDBDQUFHLEdBQVgsY0FBZ0IsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFMUIsa0RBQVcsR0FBbkIsVUFBb0IsT0FBZSxFQUFFLElBQW9CO1FBQ3ZELElBQUksSUFBSSxFQUFFO1lBQ1IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQ2pCLEVBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsZ0NBQWMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxTQUFBLEVBQUMsQ0FBQyxDQUFDO1NBQ3RGO0lBQ0gsQ0FBQztJQUVPLG9EQUFhLEdBQXJCLFVBQXNCLE9BQWUsRUFBRSxJQUFVO1FBQy9DLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUNqQixFQUFDLElBQUksRUFBRSxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLGdDQUFjLENBQUMsT0FBTyxFQUFFLE9BQU8sU0FBQSxFQUFDLENBQUMsQ0FBQztJQUN6RixDQUFDO0lBQ0gsbUNBQUM7QUFBRCxDQUFDLEFBekhELENBQTJDLHNDQUEyQixHQXlIckU7QUFFRCw4QkFBOEIsSUFBeUI7SUFDckQsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ2YsS0FBa0IsVUFBVyxFQUFYLEtBQUEsSUFBSSxDQUFDLE1BQU0sRUFBWCxjQUFXLEVBQVgsSUFBVyxFQUFFO1lBQTFCLElBQUksS0FBSyxTQUFBO1lBQ1osSUFBSSxLQUFLLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVTtnQkFDckMseUJBQWMsQ0FBQyxLQUFLLENBQUMsS0FBTyxDQUFDLFVBQVksQ0FBQyxJQUFJLGFBQWE7Z0JBQzdELE9BQU8sSUFBSSxDQUFDO1NBQ2Y7S0FDRjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVELG9CQUFvQixJQUFVLEVBQUUsTUFBYztJQUM1QyxPQUFPLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sRUFBQyxDQUFDO0FBQzlELENBQUM7QUFFRCxnQkFBZ0IsVUFBMkI7SUFDekMsT0FBTyxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUMsQ0FBQztBQUN0RSxDQUFDIn0=