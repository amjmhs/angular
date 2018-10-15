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
export class TypeCheckCompiler {
    /**
     * @param {?} options
     * @param {?} reflector
     */
    constructor(options, reflector) {
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
     * @param {?} componentId
     * @param {?} component
     * @param {?} template
     * @param {?} usedPipes
     * @param {?} externalReferenceVars
     * @param {?} ctx
     * @return {?}
     */
    compileComponent(componentId, component, template, usedPipes, externalReferenceVars, ctx) {
        /** @type {?} */
        const pipes = new Map();
        usedPipes.forEach(p => pipes.set(p.name, p.type.reference));
        /** @type {?} */
        let embeddedViewCount = 0;
        /** @type {?} */
        const viewBuilderFactory = (parent, guards) => {
            /** @type {?} */
            const embeddedViewIndex = embeddedViewCount++;
            return new ViewBuilder(this.options, this.reflector, externalReferenceVars, parent, component.type.reference, component.isHost, embeddedViewIndex, pipes, guards, ctx, viewBuilderFactory);
        };
        /** @type {?} */
        const visitor = viewBuilderFactory(null, []);
        visitor.visitAll([], template);
        return visitor.build(componentId);
    }
}
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
const DYNAMIC_VAR_NAME = '_any';
class TypeCheckLocalResolver {
    /**
     * @param {?} name
     * @return {?}
     */
    getLocal(name) {
        if (name === EventHandlerVars.event.name) {
            // References to the event should not be type-checked.
            // TODO(chuckj): determine a better type for the event.
            return o.variable(DYNAMIC_VAR_NAME);
        }
        return null;
    }
}
/** @type {?} */
const defaultResolver = new TypeCheckLocalResolver();
class ViewBuilder {
    /**
     * @param {?} options
     * @param {?} reflector
     * @param {?} externalReferenceVars
     * @param {?} parent
     * @param {?} component
     * @param {?} isHostComponent
     * @param {?} embeddedViewIndex
     * @param {?} pipes
     * @param {?} guards
     * @param {?} ctx
     * @param {?} viewBuilderFactory
     */
    constructor(options, reflector, externalReferenceVars, parent, component, isHostComponent, embeddedViewIndex, pipes, guards, ctx, viewBuilderFactory) {
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
    getOutputVar(type) {
        /** @type {?} */
        let varName;
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
            throw new Error(`Illegal State: referring to a type without a variable ${JSON.stringify(type)}`);
        }
        return varName;
    }
    /**
     * @param {?} ast
     * @return {?}
     */
    getTypeGuardExpressions(ast) {
        /** @type {?} */
        const result = [...this.guards];
        for (let directive of ast.directives) {
            for (let input of directive.inputs) {
                /** @type {?} */
                const guard = directive.directive.guards[input.directiveName];
                if (guard) {
                    /** @type {?} */
                    const useIf = guard === 'UseIf';
                    result.push({
                        guard,
                        useIf,
                        expression: /** @type {?} */ ({ context: this.component, value: input.value })
                    });
                }
            }
        }
        return result;
    }
    /**
     * @param {?} variables
     * @param {?} astNodes
     * @return {?}
     */
    visitAll(variables, astNodes) {
        this.variables = variables;
        templateVisitAll(this, astNodes);
    }
    /**
     * @param {?} componentId
     * @param {?=} targetStatements
     * @return {?}
     */
    build(componentId, targetStatements = []) {
        this.children.forEach((child) => child.build(componentId, targetStatements));
        /** @type {?} */
        let viewStmts = [o.variable(DYNAMIC_VAR_NAME).set(o.NULL_EXPR).toDeclStmt(o.DYNAMIC_TYPE)];
        /** @type {?} */
        let bindingCount = 0;
        this.updates.forEach((expression) => {
            const { sourceSpan, context, value } = this.preprocessUpdateExpression(expression);
            /** @type {?} */
            const bindingId = `${bindingCount++}`;
            /** @type {?} */
            const nameResolver = context === this.component ? this : defaultResolver;
            const { stmts, currValExpr } = convertPropertyBinding(nameResolver, o.variable(this.getOutputVar(context)), value, bindingId, BindingForm.General);
            stmts.push(new o.ExpressionStatement(currValExpr));
            viewStmts.push(...stmts.map((stmt) => o.applySourceSpanToStatementIfNeeded(stmt, sourceSpan)));
        });
        this.actions.forEach(({ sourceSpan, context, value }) => {
            /** @type {?} */
            const bindingId = `${bindingCount++}`;
            /** @type {?} */
            const nameResolver = context === this.component ? this : defaultResolver;
            const { stmts } = convertActionBinding(nameResolver, o.variable(this.getOutputVar(context)), value, bindingId);
            viewStmts.push(...stmts.map((stmt) => o.applySourceSpanToStatementIfNeeded(stmt, sourceSpan)));
        });
        if (this.guards.length) {
            /** @type {?} */
            let guardExpression = undefined;
            for (const guard of this.guards) {
                const { context, value } = this.preprocessUpdateExpression(guard.expression);
                /** @type {?} */
                const bindingId = `${bindingCount++}`;
                /** @type {?} */
                const nameResolver = context === this.component ? this : defaultResolver;
                const { stmts, currValExpr } = convertPropertyBinding(nameResolver, o.variable(this.getOutputVar(context)), value, bindingId, BindingForm.TrySimple);
                if (stmts.length == 0) {
                    /** @type {?} */
                    const guardClause = guard.useIf ? currValExpr : this.ctx.importExpr(guard.guard).callFn([currValExpr]);
                    guardExpression = guardExpression ? guardExpression.and(guardClause) : guardClause;
                }
            }
            if (guardExpression) {
                viewStmts = [new o.IfStmt(guardExpression, viewStmts)];
            }
        }
        /** @type {?} */
        const viewName = `_View_${componentId}_${this.embeddedViewIndex}`;
        /** @type {?} */
        const viewFactory = new o.DeclareFunctionStmt(viewName, [], viewStmts);
        targetStatements.push(viewFactory);
        return targetStatements;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitBoundText(ast, context) {
        /** @type {?} */
        const astWithSource = /** @type {?} */ (ast.value);
        /** @type {?} */
        const inter = /** @type {?} */ (astWithSource.ast);
        inter.expressions.forEach((expr) => this.updates.push({ context: this.component, value: expr, sourceSpan: ast.sourceSpan }));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitEmbeddedTemplate(ast, context) {
        this.visitElementOrTemplate(ast);
        // Note: The old view compiler used to use an `any` type
        // for the context in any embedded view.
        // We keep this behaivor behind a flag for now.
        if (this.options.fullTemplateTypeCheck) {
            /** @type {?} */
            const guards = this.getTypeGuardExpressions(ast);
            /** @type {?} */
            const childVisitor = this.viewBuilderFactory(this, guards);
            this.children.push(childVisitor);
            childVisitor.visitAll(ast.variables, ast.children);
        }
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitElement(ast, context) {
        this.visitElementOrTemplate(ast);
        /** @type {?} */
        let inputDefs = [];
        /** @type {?} */
        let updateRendererExpressions = [];
        /** @type {?} */
        let outputDefs = [];
        ast.inputs.forEach((inputAst) => {
            this.updates.push({ context: this.component, value: inputAst.value, sourceSpan: inputAst.sourceSpan });
        });
        templateVisitAll(this, ast.children);
    }
    /**
     * @param {?} ast
     * @return {?}
     */
    visitElementOrTemplate(ast) {
        ast.directives.forEach((dirAst) => { this.visitDirective(dirAst); });
        ast.references.forEach((ref) => {
            /** @type {?} */
            let outputVarType = /** @type {?} */ ((null));
            // Note: The old view compiler used to use an `any` type
            // for directives exposed via `exportAs`.
            // We keep this behaivor behind a flag for now.
            if (ref.value && ref.value.identifier && this.options.fullTemplateTypeCheck) {
                outputVarType = ref.value.identifier.reference;
            }
            else {
                outputVarType = o.BuiltinTypeName.Dynamic;
            }
            this.refOutputVars.set(ref.name, outputVarType);
        });
        ast.outputs.forEach((outputAst) => {
            this.actions.push({ context: this.component, value: outputAst.handler, sourceSpan: outputAst.sourceSpan });
        });
    }
    /**
     * @param {?} dirAst
     * @return {?}
     */
    visitDirective(dirAst) {
        /** @type {?} */
        const dirType = dirAst.directive.type.reference;
        dirAst.inputs.forEach((input) => this.updates.push({ context: this.component, value: input.value, sourceSpan: input.sourceSpan }));
        // Note: The old view compiler used to use an `any` type
        // for expressions in host properties / events.
        // We keep this behaivor behind a flag for now.
        if (this.options.fullTemplateTypeCheck) {
            dirAst.hostProperties.forEach((inputAst) => this.updates.push({ context: dirType, value: inputAst.value, sourceSpan: inputAst.sourceSpan }));
            dirAst.hostEvents.forEach((hostEventAst) => this.actions.push({
                context: dirType,
                value: hostEventAst.handler,
                sourceSpan: hostEventAst.sourceSpan
            }));
        }
    }
    /**
     * @param {?} name
     * @return {?}
     */
    getLocal(name) {
        if (name == EventHandlerVars.event.name) {
            return o.variable(this.getOutputVar(o.BuiltinTypeName.Dynamic));
        }
        for (let currBuilder = this; currBuilder; currBuilder = currBuilder.parent) {
            /** @type {?} */
            let outputVarType;
            // check references
            outputVarType = currBuilder.refOutputVars.get(name);
            if (outputVarType == null) {
                /** @type {?} */
                const varAst = currBuilder.variables.find((varAst) => varAst.name === name);
                if (varAst) {
                    outputVarType = o.BuiltinTypeName.Dynamic;
                }
            }
            if (outputVarType != null) {
                return o.variable(this.getOutputVar(outputVarType));
            }
        }
        return null;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    pipeOutputVar(name) {
        /** @type {?} */
        const pipe = this.pipes.get(name);
        if (!pipe) {
            throw new Error(`Illegal State: Could not find pipe ${name} in template of ${this.component}`);
        }
        return this.getOutputVar(pipe);
    }
    /**
     * @param {?} expression
     * @return {?}
     */
    preprocessUpdateExpression(expression) {
        return {
            sourceSpan: expression.sourceSpan,
            context: expression.context,
            value: convertPropertyBindingBuiltins({
                createLiteralArrayConverter: (argCount) => (args) => {
                    /** @type {?} */
                    const arr = o.literalArr(args);
                    // Note: The old view compiler used to use an `any` type
                    // for arrays.
                    return this.options.fullTemplateTypeCheck ? arr : arr.cast(o.DYNAMIC_TYPE);
                },
                createLiteralMapConverter: (keys) => (values) => {
                    /** @type {?} */
                    const entries = keys.map((k, i) => ({
                        key: k.key,
                        value: values[i],
                        quoted: k.quoted,
                    }));
                    /** @type {?} */
                    const map = o.literalMap(entries);
                    // Note: The old view compiler used to use an `any` type
                    // for maps.
                    return this.options.fullTemplateTypeCheck ? map : map.cast(o.DYNAMIC_TYPE);
                },
                createPipeConverter: (name, argCount) => (args) => {
                    /** @type {?} */
                    const pipeExpr = this.options.fullTemplateTypeCheck ?
                        o.variable(this.pipeOutputVar(name)) :
                        o.variable(this.getOutputVar(o.BuiltinTypeName.Dynamic));
                    return pipeExpr.callMethod('transform', args);
                },
            }, expression.value)
        };
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitNgContent(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitText(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitDirectiveProperty(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitReference(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitVariable(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitEvent(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitElementProperty(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitAttr(ast, context) { }
}
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