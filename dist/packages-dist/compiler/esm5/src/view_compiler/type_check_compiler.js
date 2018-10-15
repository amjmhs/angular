/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { StaticSymbol } from '../aot/static_symbol';
import { BindingForm, EventHandlerVars, convertActionBinding, convertPropertyBinding, convertPropertyBindingBuiltins } from '../compiler_util/expression_converter';
import * as o from '../output/output_ast';
import { templateVisitAll } from '../template_parser/template_ast';
/**
 * Generates code that is used to type check templates.
 */
var /**
 * Generates code that is used to type check templates.
 */
TypeCheckCompiler = /** @class */ (function () {
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
    /**
     * Important notes:
     * - This must not produce new `import` statements, but only refer to types outside
     *   of the file via the variables provided via externalReferenceVars.
     *   This allows Typescript to reuse the old program's structure as no imports have changed.
     * - This must not produce any exports, as this would pollute the .d.ts file
     *   and also violate the point above.
     * @param {?} componentId
     * @param {?} component
     * @param {?} template
     * @param {?} usedPipes
     * @param {?} externalReferenceVars
     * @param {?} ctx
     * @return {?}
     */
    TypeCheckCompiler.prototype.compileComponent = /**
     * Important notes:
     * - This must not produce new `import` statements, but only refer to types outside
     *   of the file via the variables provided via externalReferenceVars.
     *   This allows Typescript to reuse the old program's structure as no imports have changed.
     * - This must not produce any exports, as this would pollute the .d.ts file
     *   and also violate the point above.
     * @param {?} componentId
     * @param {?} component
     * @param {?} template
     * @param {?} usedPipes
     * @param {?} externalReferenceVars
     * @param {?} ctx
     * @return {?}
     */
    function (componentId, component, template, usedPipes, externalReferenceVars, ctx) {
        var _this = this;
        /** @type {?} */
        var pipes = new Map();
        usedPipes.forEach(function (p) { return pipes.set(p.name, p.type.reference); });
        /** @type {?} */
        var embeddedViewCount = 0;
        /** @type {?} */
        var viewBuilderFactory = function (parent, guards) {
            /** @type {?} */
            var embeddedViewIndex = embeddedViewCount++;
            return new ViewBuilder(_this.options, _this.reflector, externalReferenceVars, parent, component.type.reference, component.isHost, embeddedViewIndex, pipes, guards, ctx, viewBuilderFactory);
        };
        /** @type {?} */
        var visitor = viewBuilderFactory(null, []);
        visitor.visitAll([], template);
        return visitor.build(componentId);
    };
    return TypeCheckCompiler;
}());
/**
 * Generates code that is used to type check templates.
 */
export { TypeCheckCompiler };
if (false) {
    /** @type {?} */
    TypeCheckCompiler.prototype.options;
    /** @type {?} */
    TypeCheckCompiler.prototype.reflector;
}
/**
 * @record
 */
function GuardExpression() { }
/** @type {?} */
GuardExpression.prototype.guard;
/** @type {?} */
GuardExpression.prototype.useIf;
/** @type {?} */
GuardExpression.prototype.expression;
/**
 * @record
 */
function ViewBuilderFactory() { }
/** @typedef {?} */
var OutputVarType;
/**
 * @record
 */
function Expression() { }
/** @type {?} */
Expression.prototype.context;
/** @type {?} */
Expression.prototype.sourceSpan;
/** @type {?} */
Expression.prototype.value;
/** @type {?} */
var DYNAMIC_VAR_NAME = '_any';
var TypeCheckLocalResolver = /** @class */ (function () {
    function TypeCheckLocalResolver() {
    }
    /**
     * @param {?} name
     * @return {?}
     */
    TypeCheckLocalResolver.prototype.getLocal = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        if (name === EventHandlerVars.event.name) {
            // References to the event should not be type-checked.
            // TODO(chuckj): determine a better type for the event.
            return o.variable(DYNAMIC_VAR_NAME);
        }
        return null;
    };
    return TypeCheckLocalResolver;
}());
/** @type {?} */
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
    /**
     * @param {?} type
     * @return {?}
     */
    ViewBuilder.prototype.getOutputVar = /**
     * @param {?} type
     * @return {?}
     */
    function (type) {
        /** @type {?} */
        var varName;
        if (type === this.component && this.isHostComponent) {
            varName = DYNAMIC_VAR_NAME;
        }
        else if (type instanceof StaticSymbol) {
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
    /**
     * @param {?} ast
     * @return {?}
     */
    ViewBuilder.prototype.getTypeGuardExpressions = /**
     * @param {?} ast
     * @return {?}
     */
    function (ast) {
        /** @type {?} */
        var result = this.guards.slice();
        for (var _i = 0, _a = ast.directives; _i < _a.length; _i++) {
            var directive = _a[_i];
            for (var _b = 0, _c = directive.inputs; _b < _c.length; _b++) {
                var input = _c[_b];
                /** @type {?} */
                var guard = directive.directive.guards[input.directiveName];
                if (guard) {
                    /** @type {?} */
                    var useIf = guard === 'UseIf';
                    result.push({
                        guard: guard,
                        useIf: useIf,
                        expression: /** @type {?} */ ({ context: this.component, value: input.value })
                    });
                }
            }
        }
        return result;
    };
    /**
     * @param {?} variables
     * @param {?} astNodes
     * @return {?}
     */
    ViewBuilder.prototype.visitAll = /**
     * @param {?} variables
     * @param {?} astNodes
     * @return {?}
     */
    function (variables, astNodes) {
        this.variables = variables;
        templateVisitAll(this, astNodes);
    };
    /**
     * @param {?} componentId
     * @param {?=} targetStatements
     * @return {?}
     */
    ViewBuilder.prototype.build = /**
     * @param {?} componentId
     * @param {?=} targetStatements
     * @return {?}
     */
    function (componentId, targetStatements) {
        var _this = this;
        if (targetStatements === void 0) { targetStatements = []; }
        this.children.forEach(function (child) { return child.build(componentId, targetStatements); });
        /** @type {?} */
        var viewStmts = [o.variable(DYNAMIC_VAR_NAME).set(o.NULL_EXPR).toDeclStmt(o.DYNAMIC_TYPE)];
        /** @type {?} */
        var bindingCount = 0;
        this.updates.forEach(function (expression) {
            var _a = _this.preprocessUpdateExpression(expression), sourceSpan = _a.sourceSpan, context = _a.context, value = _a.value;
            /** @type {?} */
            var bindingId = "" + bindingCount++;
            /** @type {?} */
            var nameResolver = context === _this.component ? _this : defaultResolver;
            var _b = convertPropertyBinding(nameResolver, o.variable(_this.getOutputVar(context)), value, bindingId, BindingForm.General), stmts = _b.stmts, currValExpr = _b.currValExpr;
            stmts.push(new o.ExpressionStatement(currValExpr));
            viewStmts.push.apply(viewStmts, stmts.map(function (stmt) { return o.applySourceSpanToStatementIfNeeded(stmt, sourceSpan); }));
        });
        this.actions.forEach(function (_a) {
            var sourceSpan = _a.sourceSpan, context = _a.context, value = _a.value;
            /** @type {?} */
            var bindingId = "" + bindingCount++;
            /** @type {?} */
            var nameResolver = context === _this.component ? _this : defaultResolver;
            var stmts = convertActionBinding(nameResolver, o.variable(_this.getOutputVar(context)), value, bindingId).stmts;
            viewStmts.push.apply(viewStmts, stmts.map(function (stmt) { return o.applySourceSpanToStatementIfNeeded(stmt, sourceSpan); }));
        });
        if (this.guards.length) {
            /** @type {?} */
            var guardExpression = undefined;
            for (var _i = 0, _a = this.guards; _i < _a.length; _i++) {
                var guard = _a[_i];
                var _b = this.preprocessUpdateExpression(guard.expression), context = _b.context, value = _b.value;
                /** @type {?} */
                var bindingId = "" + bindingCount++;
                /** @type {?} */
                var nameResolver = context === this.component ? this : defaultResolver;
                var _c = convertPropertyBinding(nameResolver, o.variable(this.getOutputVar(context)), value, bindingId, BindingForm.TrySimple), stmts = _c.stmts, currValExpr = _c.currValExpr;
                if (stmts.length == 0) {
                    /** @type {?} */
                    var guardClause = guard.useIf ? currValExpr : this.ctx.importExpr(guard.guard).callFn([currValExpr]);
                    guardExpression = guardExpression ? guardExpression.and(guardClause) : guardClause;
                }
            }
            if (guardExpression) {
                viewStmts = [new o.IfStmt(guardExpression, viewStmts)];
            }
        }
        /** @type {?} */
        var viewName = "_View_" + componentId + "_" + this.embeddedViewIndex;
        /** @type {?} */
        var viewFactory = new o.DeclareFunctionStmt(viewName, [], viewStmts);
        targetStatements.push(viewFactory);
        return targetStatements;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitBoundText = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) {
        var _this = this;
        /** @type {?} */
        var astWithSource = /** @type {?} */ (ast.value);
        /** @type {?} */
        var inter = /** @type {?} */ (astWithSource.ast);
        inter.expressions.forEach(function (expr) {
            return _this.updates.push({ context: _this.component, value: expr, sourceSpan: ast.sourceSpan });
        });
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitEmbeddedTemplate = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) {
        this.visitElementOrTemplate(ast);
        // Note: The old view compiler used to use an `any` type
        // for the context in any embedded view.
        // We keep this behaivor behind a flag for now.
        if (this.options.fullTemplateTypeCheck) {
            /** @type {?} */
            var guards = this.getTypeGuardExpressions(ast);
            /** @type {?} */
            var childVisitor = this.viewBuilderFactory(this, guards);
            this.children.push(childVisitor);
            childVisitor.visitAll(ast.variables, ast.children);
        }
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitElement = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) {
        var _this = this;
        this.visitElementOrTemplate(ast);
        /** @type {?} */
        var inputDefs = [];
        /** @type {?} */
        var updateRendererExpressions = [];
        /** @type {?} */
        var outputDefs = [];
        ast.inputs.forEach(function (inputAst) {
            _this.updates.push({ context: _this.component, value: inputAst.value, sourceSpan: inputAst.sourceSpan });
        });
        templateVisitAll(this, ast.children);
    };
    /**
     * @param {?} ast
     * @return {?}
     */
    ViewBuilder.prototype.visitElementOrTemplate = /**
     * @param {?} ast
     * @return {?}
     */
    function (ast) {
        var _this = this;
        ast.directives.forEach(function (dirAst) { _this.visitDirective(dirAst); });
        ast.references.forEach(function (ref) {
            /** @type {?} */
            var outputVarType = /** @type {?} */ ((null));
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
    /**
     * @param {?} dirAst
     * @return {?}
     */
    ViewBuilder.prototype.visitDirective = /**
     * @param {?} dirAst
     * @return {?}
     */
    function (dirAst) {
        var _this = this;
        /** @type {?} */
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
    /**
     * @param {?} name
     * @return {?}
     */
    ViewBuilder.prototype.getLocal = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        if (name == EventHandlerVars.event.name) {
            return o.variable(this.getOutputVar(o.BuiltinTypeName.Dynamic));
        }
        for (var currBuilder = this; currBuilder; currBuilder = currBuilder.parent) {
            /** @type {?} */
            var outputVarType = void 0;
            // check references
            outputVarType = currBuilder.refOutputVars.get(name);
            if (outputVarType == null) {
                /** @type {?} */
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
    /**
     * @param {?} name
     * @return {?}
     */
    ViewBuilder.prototype.pipeOutputVar = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        /** @type {?} */
        var pipe = this.pipes.get(name);
        if (!pipe) {
            throw new Error("Illegal State: Could not find pipe " + name + " in template of " + this.component);
        }
        return this.getOutputVar(pipe);
    };
    /**
     * @param {?} expression
     * @return {?}
     */
    ViewBuilder.prototype.preprocessUpdateExpression = /**
     * @param {?} expression
     * @return {?}
     */
    function (expression) {
        var _this = this;
        return {
            sourceSpan: expression.sourceSpan,
            context: expression.context,
            value: convertPropertyBindingBuiltins({
                createLiteralArrayConverter: function (argCount) { return function (args) {
                    /** @type {?} */
                    var arr = o.literalArr(args);
                    // Note: The old view compiler used to use an `any` type
                    // for arrays.
                    return _this.options.fullTemplateTypeCheck ? arr : arr.cast(o.DYNAMIC_TYPE);
                }; },
                createLiteralMapConverter: function (keys) { return function (values) {
                    /** @type {?} */
                    var entries = keys.map(function (k, i) { return ({
                        key: k.key,
                        value: values[i],
                        quoted: k.quoted,
                    }); });
                    /** @type {?} */
                    var map = o.literalMap(entries);
                    // Note: The old view compiler used to use an `any` type
                    // for maps.
                    return _this.options.fullTemplateTypeCheck ? map : map.cast(o.DYNAMIC_TYPE);
                }; },
                createPipeConverter: function (name, argCount) { return function (args) {
                    /** @type {?} */
                    var pipeExpr = _this.options.fullTemplateTypeCheck ?
                        o.variable(_this.pipeOutputVar(name)) :
                        o.variable(_this.getOutputVar(o.BuiltinTypeName.Dynamic));
                    return pipeExpr.callMethod('transform', args);
                }; },
            }, expression.value)
        };
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitNgContent = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitText = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitDirectiveProperty = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitReference = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitVariable = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitEvent = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitElementProperty = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitAttr = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { };
    return ViewBuilder;
}());
if (false) {
    /** @type {?} */
    ViewBuilder.prototype.refOutputVars;
    /** @type {?} */
    ViewBuilder.prototype.variables;
    /** @type {?} */
    ViewBuilder.prototype.children;
    /** @type {?} */
    ViewBuilder.prototype.updates;
    /** @type {?} */
    ViewBuilder.prototype.actions;
    /** @type {?} */
    ViewBuilder.prototype.options;
    /** @type {?} */
    ViewBuilder.prototype.reflector;
    /** @type {?} */
    ViewBuilder.prototype.externalReferenceVars;
    /** @type {?} */
    ViewBuilder.prototype.parent;
    /** @type {?} */
    ViewBuilder.prototype.component;
    /** @type {?} */
    ViewBuilder.prototype.isHostComponent;
    /** @type {?} */
    ViewBuilder.prototype.embeddedViewIndex;
    /** @type {?} */
    ViewBuilder.prototype.pipes;
    /** @type {?} */
    ViewBuilder.prototype.guards;
    /** @type {?} */
    ViewBuilder.prototype.ctx;
    /** @type {?} */
    ViewBuilder.prototype.viewBuilderFactory;
}
//# sourceMappingURL=type_check_compiler.js.map