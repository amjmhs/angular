"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var static_symbol_1 = require("../aot/static_symbol");
var expression_converter_1 = require("../compiler_util/expression_converter");
var o = require("../output/output_ast");
var template_ast_1 = require("../template_parser/template_ast");
/**
 * Generates code that is used to type check templates.
 */
var TypeCheckCompiler = /** @class */ (function () {
    function TypeCheckCompiler(options, reflector) {
        this.options = options;
        this.reflector = reflector;
    }
    /**
     * Important notes:
     * - This must not produce new `import` statements, but only refer to types outside
     *   of the file via the variables provided via externalReferenceVars.
     *   This allows Typescript to reuse the old program's structure as no imports have changed.
     * - This must not produce any exports, as this would pollute the .d.ts file
     *   and also violate the point above.
     */
    TypeCheckCompiler.prototype.compileComponent = function (componentId, component, template, usedPipes, externalReferenceVars, ctx) {
        var _this = this;
        var pipes = new Map();
        usedPipes.forEach(function (p) { return pipes.set(p.name, p.type.reference); });
        var embeddedViewCount = 0;
        var viewBuilderFactory = function (parent, guards) {
            var embeddedViewIndex = embeddedViewCount++;
            return new ViewBuilder(_this.options, _this.reflector, externalReferenceVars, parent, component.type.reference, component.isHost, embeddedViewIndex, pipes, guards, ctx, viewBuilderFactory);
        };
        var visitor = viewBuilderFactory(null, []);
        visitor.visitAll([], template);
        return visitor.build(componentId);
    };
    return TypeCheckCompiler;
}());
exports.TypeCheckCompiler = TypeCheckCompiler;
var DYNAMIC_VAR_NAME = '_any';
var TypeCheckLocalResolver = /** @class */ (function () {
    function TypeCheckLocalResolver() {
    }
    TypeCheckLocalResolver.prototype.getLocal = function (name) {
        if (name === expression_converter_1.EventHandlerVars.event.name) {
            // References to the event should not be type-checked.
            // TODO(chuckj): determine a better type for the event.
            return o.variable(DYNAMIC_VAR_NAME);
        }
        return null;
    };
    return TypeCheckLocalResolver;
}());
var defaultResolver = new TypeCheckLocalResolver();
var ViewBuilder = /** @class */ (function () {
    function ViewBuilder(options, reflector, externalReferenceVars, parent, component, isHostComponent, embeddedViewIndex, pipes, guards, ctx, viewBuilderFactory) {
        this.options = options;
        this.reflector = reflector;
        this.externalReferenceVars = externalReferenceVars;
        this.parent = parent;
        this.component = component;
        this.isHostComponent = isHostComponent;
        this.embeddedViewIndex = embeddedViewIndex;
        this.pipes = pipes;
        this.guards = guards;
        this.ctx = ctx;
        this.viewBuilderFactory = viewBuilderFactory;
        this.refOutputVars = new Map();
        this.variables = [];
        this.children = [];
        this.updates = [];
        this.actions = [];
    }
    ViewBuilder.prototype.getOutputVar = function (type) {
        var varName;
        if (type === this.component && this.isHostComponent) {
            varName = DYNAMIC_VAR_NAME;
        }
        else if (type instanceof static_symbol_1.StaticSymbol) {
            varName = this.externalReferenceVars.get(type);
        }
        else {
            varName = DYNAMIC_VAR_NAME;
        }
        if (!varName) {
            throw new Error("Illegal State: referring to a type without a variable " + JSON.stringify(type));
        }
        return varName;
    };
    ViewBuilder.prototype.getTypeGuardExpressions = function (ast) {
        var result = this.guards.slice();
        for (var _i = 0, _a = ast.directives; _i < _a.length; _i++) {
            var directive = _a[_i];
            for (var _b = 0, _c = directive.inputs; _b < _c.length; _b++) {
                var input = _c[_b];
                var guard = directive.directive.guards[input.directiveName];
                if (guard) {
                    var useIf = guard === 'UseIf';
                    result.push({
                        guard: guard,
                        useIf: useIf,
                        expression: { context: this.component, value: input.value }
                    });
                }
            }
        }
        return result;
    };
    ViewBuilder.prototype.visitAll = function (variables, astNodes) {
        this.variables = variables;
        template_ast_1.templateVisitAll(this, astNodes);
    };
    ViewBuilder.prototype.build = function (componentId, targetStatements) {
        var _this = this;
        if (targetStatements === void 0) { targetStatements = []; }
        this.children.forEach(function (child) { return child.build(componentId, targetStatements); });
        var viewStmts = [o.variable(DYNAMIC_VAR_NAME).set(o.NULL_EXPR).toDeclStmt(o.DYNAMIC_TYPE)];
        var bindingCount = 0;
        this.updates.forEach(function (expression) {
            var _a = _this.preprocessUpdateExpression(expression), sourceSpan = _a.sourceSpan, context = _a.context, value = _a.value;
            var bindingId = "" + bindingCount++;
            var nameResolver = context === _this.component ? _this : defaultResolver;
            var _b = expression_converter_1.convertPropertyBinding(nameResolver, o.variable(_this.getOutputVar(context)), value, bindingId, expression_converter_1.BindingForm.General), stmts = _b.stmts, currValExpr = _b.currValExpr;
            stmts.push(new o.ExpressionStatement(currValExpr));
            viewStmts.push.apply(viewStmts, stmts.map(function (stmt) { return o.applySourceSpanToStatementIfNeeded(stmt, sourceSpan); }));
        });
        this.actions.forEach(function (_a) {
            var sourceSpan = _a.sourceSpan, context = _a.context, value = _a.value;
            var bindingId = "" + bindingCount++;
            var nameResolver = context === _this.component ? _this : defaultResolver;
            var stmts = expression_converter_1.convertActionBinding(nameResolver, o.variable(_this.getOutputVar(context)), value, bindingId).stmts;
            viewStmts.push.apply(viewStmts, stmts.map(function (stmt) { return o.applySourceSpanToStatementIfNeeded(stmt, sourceSpan); }));
        });
        if (this.guards.length) {
            var guardExpression = undefined;
            for (var _i = 0, _a = this.guards; _i < _a.length; _i++) {
                var guard = _a[_i];
                var _b = this.preprocessUpdateExpression(guard.expression), context = _b.context, value = _b.value;
                var bindingId = "" + bindingCount++;
                var nameResolver = context === this.component ? this : defaultResolver;
                // We only support support simple expressions and ignore others as they
                // are unlikely to affect type narrowing.
                var _c = expression_converter_1.convertPropertyBinding(nameResolver, o.variable(this.getOutputVar(context)), value, bindingId, expression_converter_1.BindingForm.TrySimple), stmts = _c.stmts, currValExpr = _c.currValExpr;
                if (stmts.length == 0) {
                    var guardClause = guard.useIf ? currValExpr : this.ctx.importExpr(guard.guard).callFn([currValExpr]);
                    guardExpression = guardExpression ? guardExpression.and(guardClause) : guardClause;
                }
            }
            if (guardExpression) {
                viewStmts = [new o.IfStmt(guardExpression, viewStmts)];
            }
        }
        var viewName = "_View_" + componentId + "_" + this.embeddedViewIndex;
        var viewFactory = new o.DeclareFunctionStmt(viewName, [], viewStmts);
        targetStatements.push(viewFactory);
        return targetStatements;
    };
    ViewBuilder.prototype.visitBoundText = function (ast, context) {
        var _this = this;
        var astWithSource = ast.value;
        var inter = astWithSource.ast;
        inter.expressions.forEach(function (expr) {
            return _this.updates.push({ context: _this.component, value: expr, sourceSpan: ast.sourceSpan });
        });
    };
    ViewBuilder.prototype.visitEmbeddedTemplate = function (ast, context) {
        this.visitElementOrTemplate(ast);
        // Note: The old view compiler used to use an `any` type
        // for the context in any embedded view.
        // We keep this behaivor behind a flag for now.
        if (this.options.fullTemplateTypeCheck) {
            // Find any applicable type guards. For example, NgIf has a type guard on ngIf
            // (see NgIf.ngIfTypeGuard) that can be used to indicate that a template is only
            // stamped out if ngIf is truthy so any bindings in the template can assume that,
            // if a nullable type is used for ngIf, that expression is not null or undefined.
            var guards = this.getTypeGuardExpressions(ast);
            var childVisitor = this.viewBuilderFactory(this, guards);
            this.children.push(childVisitor);
            childVisitor.visitAll(ast.variables, ast.children);
        }
    };
    ViewBuilder.prototype.visitElement = function (ast, context) {
        var _this = this;
        this.visitElementOrTemplate(ast);
        var inputDefs = [];
        var updateRendererExpressions = [];
        var outputDefs = [];
        ast.inputs.forEach(function (inputAst) {
            _this.updates.push({ context: _this.component, value: inputAst.value, sourceSpan: inputAst.sourceSpan });
        });
        template_ast_1.templateVisitAll(this, ast.children);
    };
    ViewBuilder.prototype.visitElementOrTemplate = function (ast) {
        var _this = this;
        ast.directives.forEach(function (dirAst) { _this.visitDirective(dirAst); });
        ast.references.forEach(function (ref) {
            var outputVarType = null;
            // Note: The old view compiler used to use an `any` type
            // for directives exposed via `exportAs`.
            // We keep this behaivor behind a flag for now.
            if (ref.value && ref.value.identifier && _this.options.fullTemplateTypeCheck) {
                outputVarType = ref.value.identifier.reference;
            }
            else {
                outputVarType = o.BuiltinTypeName.Dynamic;
            }
            _this.refOutputVars.set(ref.name, outputVarType);
        });
        ast.outputs.forEach(function (outputAst) {
            _this.actions.push({ context: _this.component, value: outputAst.handler, sourceSpan: outputAst.sourceSpan });
        });
    };
    ViewBuilder.prototype.visitDirective = function (dirAst) {
        var _this = this;
        var dirType = dirAst.directive.type.reference;
        dirAst.inputs.forEach(function (input) { return _this.updates.push({ context: _this.component, value: input.value, sourceSpan: input.sourceSpan }); });
        // Note: The old view compiler used to use an `any` type
        // for expressions in host properties / events.
        // We keep this behaivor behind a flag for now.
        if (this.options.fullTemplateTypeCheck) {
            dirAst.hostProperties.forEach(function (inputAst) { return _this.updates.push({ context: dirType, value: inputAst.value, sourceSpan: inputAst.sourceSpan }); });
            dirAst.hostEvents.forEach(function (hostEventAst) { return _this.actions.push({
                context: dirType,
                value: hostEventAst.handler,
                sourceSpan: hostEventAst.sourceSpan
            }); });
        }
    };
    ViewBuilder.prototype.getLocal = function (name) {
        if (name == expression_converter_1.EventHandlerVars.event.name) {
            return o.variable(this.getOutputVar(o.BuiltinTypeName.Dynamic));
        }
        for (var currBuilder = this; currBuilder; currBuilder = currBuilder.parent) {
            var outputVarType = void 0;
            // check references
            outputVarType = currBuilder.refOutputVars.get(name);
            if (outputVarType == null) {
                // check variables
                var varAst = currBuilder.variables.find(function (varAst) { return varAst.name === name; });
                if (varAst) {
                    outputVarType = o.BuiltinTypeName.Dynamic;
                }
            }
            if (outputVarType != null) {
                return o.variable(this.getOutputVar(outputVarType));
            }
        }
        return null;
    };
    ViewBuilder.prototype.pipeOutputVar = function (name) {
        var pipe = this.pipes.get(name);
        if (!pipe) {
            throw new Error("Illegal State: Could not find pipe " + name + " in template of " + this.component);
        }
        return this.getOutputVar(pipe);
    };
    ViewBuilder.prototype.preprocessUpdateExpression = function (expression) {
        var _this = this;
        return {
            sourceSpan: expression.sourceSpan,
            context: expression.context,
            value: expression_converter_1.convertPropertyBindingBuiltins({
                createLiteralArrayConverter: function (argCount) { return function (args) {
                    var arr = o.literalArr(args);
                    // Note: The old view compiler used to use an `any` type
                    // for arrays.
                    return _this.options.fullTemplateTypeCheck ? arr : arr.cast(o.DYNAMIC_TYPE);
                }; },
                createLiteralMapConverter: function (keys) { return function (values) {
                    var entries = keys.map(function (k, i) { return ({
                        key: k.key,
                        value: values[i],
                        quoted: k.quoted,
                    }); });
                    var map = o.literalMap(entries);
                    // Note: The old view compiler used to use an `any` type
                    // for maps.
                    return _this.options.fullTemplateTypeCheck ? map : map.cast(o.DYNAMIC_TYPE);
                }; },
                createPipeConverter: function (name, argCount) { return function (args) {
                    // Note: The old view compiler used to use an `any` type
                    // for pipes.
                    var pipeExpr = _this.options.fullTemplateTypeCheck ?
                        o.variable(_this.pipeOutputVar(name)) :
                        o.variable(_this.getOutputVar(o.BuiltinTypeName.Dynamic));
                    return pipeExpr.callMethod('transform', args);
                }; },
            }, expression.value)
        };
    };
    ViewBuilder.prototype.visitNgContent = function (ast, context) { };
    ViewBuilder.prototype.visitText = function (ast, context) { };
    ViewBuilder.prototype.visitDirectiveProperty = function (ast, context) { };
    ViewBuilder.prototype.visitReference = function (ast, context) { };
    ViewBuilder.prototype.visitVariable = function (ast, context) { };
    ViewBuilder.prototype.visitEvent = function (ast, context) { };
    ViewBuilder.prototype.visitElementProperty = function (ast, context) { };
    ViewBuilder.prototype.visitAttr = function (ast, context) { };
    return ViewBuilder;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZV9jaGVja19jb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy92aWV3X2NvbXBpbGVyL3R5cGVfY2hlY2tfY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFJSCxzREFBa0Q7QUFFbEQsOEVBQW1NO0FBR25NLHdDQUEwQztBQUcxQyxnRUFBNFY7QUFJNVY7O0dBRUc7QUFDSDtJQUNFLDJCQUFvQixPQUEyQixFQUFVLFNBQTBCO1FBQS9ELFlBQU8sR0FBUCxPQUFPLENBQW9CO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBaUI7SUFBRyxDQUFDO0lBRXZGOzs7Ozs7O09BT0c7SUFDSCw0Q0FBZ0IsR0FBaEIsVUFDSSxXQUFtQixFQUFFLFNBQW1DLEVBQUUsUUFBdUIsRUFDakYsU0FBK0IsRUFBRSxxQkFBZ0QsRUFDakYsR0FBa0I7UUFIdEIsaUJBbUJDO1FBZkMsSUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQXdCLENBQUM7UUFDOUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFuQyxDQUFtQyxDQUFDLENBQUM7UUFDNUQsSUFBSSxpQkFBaUIsR0FBRyxDQUFDLENBQUM7UUFDMUIsSUFBTSxrQkFBa0IsR0FDcEIsVUFBQyxNQUEwQixFQUFFLE1BQXlCO1lBQ3BELElBQU0saUJBQWlCLEdBQUcsaUJBQWlCLEVBQUUsQ0FBQztZQUM5QyxPQUFPLElBQUksV0FBVyxDQUNsQixLQUFJLENBQUMsT0FBTyxFQUFFLEtBQUksQ0FBQyxTQUFTLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUNyRixTQUFTLENBQUMsTUFB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