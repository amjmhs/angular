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
import * as o from './output/output_ast';
import { error } from './util';
/** @type {?} */
const CONSTANT_PREFIX = '_c';
/** @type {?} */
const TRANSLATION_PREFIX = 'MSG_';
/** @enum {number} */
const DefinitionKind = {
    Injector: 0, Directive: 1, Component: 2, Pipe: 3,
};
export { DefinitionKind };
/** *
 * Closure uses `goog.getMsg(message)` to lookup translations
  @type {?} */
const GOOG_GET_MSG = 'goog.getMsg';
/** *
 * Context to use when producing a key.
 *
 * This ensures we see the constant not the reference variable when producing
 * a key.
  @type {?} */
const KEY_CONTEXT = {};
/**
 * A node that is a place-holder that allows the node to be replaced when the actual
 * node is known.
 *
 * This allows the constant pool to change an expression from a direct reference to
 * a constant to a shared constant. It returns a fix-up node that is later allowed to
 * change the referenced expression.
 */
class FixupExpression extends o.Expression {
    /**
     * @param {?} resolved
     */
    constructor(resolved) {
        super(resolved.type);
        this.resolved = resolved;
        this.original = resolved;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        if (context === KEY_CONTEXT) {
            // When producing a key we want to traverse the constant not the
            // variable used to refer to it.
            return this.original.visitExpression(visitor, context);
        }
        else {
            return this.resolved.visitExpression(visitor, context);
        }
    }
    /**
     * @param {?} e
     * @return {?}
     */
    isEquivalent(e) {
        return e instanceof FixupExpression && this.resolved.isEquivalent(e.resolved);
    }
    /**
     * @return {?}
     */
    isConstant() { return true; }
    /**
     * @param {?} expression
     * @return {?}
     */
    fixup(expression) {
        this.resolved = expression;
        this.shared = true;
    }
}
if (false) {
    /** @type {?} */
    FixupExpression.prototype.original;
    /** @type {?} */
    FixupExpression.prototype.shared;
    /** @type {?} */
    FixupExpression.prototype.resolved;
}
/**
 * A constant pool allows a code emitter to share constant in an output context.
 *
 * The constant pool also supports sharing access to ivy definitions references.
 */
export class ConstantPool {
    constructor() {
        this.statements = [];
        this.translations = new Map();
        this.literals = new Map();
        this.literalFactories = new Map();
        this.injectorDefinitions = new Map();
        this.directiveDefinitions = new Map();
        this.componentDefinitions = new Map();
        this.pipeDefinitions = new Map();
        this.nextNameIndex = 0;
    }
    /**
     * @param {?} literal
     * @param {?=} forceShared
     * @return {?}
     */
    getConstLiteral(literal, forceShared) {
        if (literal instanceof o.LiteralExpr || literal instanceof FixupExpression) {
            // Do no put simple literals into the constant pool or try to produce a constant for a
            // reference to a constant.
            return literal;
        }
        /** @type {?} */
        const key = this.keyOf(literal);
        /** @type {?} */
        let fixup = this.literals.get(key);
        /** @type {?} */
        let newValue = false;
        if (!fixup) {
            fixup = new FixupExpression(literal);
            this.literals.set(key, fixup);
            newValue = true;
        }
        if ((!newValue && !fixup.shared) || (newValue && forceShared)) {
            /** @type {?} */
            const name = this.freshName();
            this.statements.push(o.variable(name).set(literal).toDeclStmt(o.INFERRED_TYPE, [o.StmtModifier.Final]));
            fixup.fixup(o.variable(name));
        }
        return fixup;
    }
    /**
     * @param {?} message
     * @param {?} meta
     * @return {?}
     */
    getTranslation(message, meta) {
        /** @type {?} */
        const key = meta.meaning ? `${message}\u0000\u0000${meta.meaning}` : message;
        /** @type {?} */
        const exp = this.translations.get(key);
        if (exp) {
            return exp;
        }
        /** @type {?} */
        const docStmt = i18nMetaToDocStmt(meta);
        if (docStmt) {
            this.statements.push(docStmt);
        }
        /** @type {?} */
        const variable = o.variable(this.freshTranslationName());
        /** @type {?} */
        const fnCall = o.variable(GOOG_GET_MSG).callFn([o.literal(message)]);
        /** @type {?} */
        const msgStmt = variable.set(fnCall).toDeclStmt(o.INFERRED_TYPE, [o.StmtModifier.Final]);
        this.statements.push(msgStmt);
        this.translations.set(key, variable);
        return variable;
    }
    /**
     * @param {?} type
     * @param {?} kind
     * @param {?} ctx
     * @param {?=} forceShared
     * @return {?}
     */
    getDefinition(type, kind, ctx, forceShared = false) {
        /** @type {?} */
        const definitions = this.definitionsOf(kind);
        /** @type {?} */
        let fixup = definitions.get(type);
        /** @type {?} */
        let newValue = false;
        if (!fixup) {
            /** @type {?} */
            const property = this.propertyNameOf(kind);
            fixup = new FixupExpression(ctx.importExpr(type).prop(property));
            definitions.set(type, fixup);
            newValue = true;
        }
        if ((!newValue && !fixup.shared) || (newValue && forceShared)) {
            /** @type {?} */
            const name = this.freshName();
            this.statements.push(o.variable(name).set(fixup.resolved).toDeclStmt(o.INFERRED_TYPE, [o.StmtModifier.Final]));
            fixup.fixup(o.variable(name));
        }
        return fixup;
    }
    /**
     * @param {?} literal
     * @return {?}
     */
    getLiteralFactory(literal) {
        // Create a pure function that builds an array of a mix of constant  and variable expressions
        if (literal instanceof o.LiteralArrayExpr) {
            /** @type {?} */
            const argumentsForKey = literal.entries.map(e => e.isConstant() ? e : o.literal(null));
            /** @type {?} */
            const key = this.keyOf(o.literalArr(argumentsForKey));
            return this._getLiteralFactory(key, literal.entries, entries => o.literalArr(entries));
        }
        else {
            /** @type {?} */
            const expressionForKey = o.literalMap(literal.entries.map(e => ({
                key: e.key,
                value: e.value.isConstant() ? e.value : o.literal(null),
                quoted: e.quoted
            })));
            /** @type {?} */
            const key = this.keyOf(expressionForKey);
            return this._getLiteralFactory(key, literal.entries.map(e => e.value), entries => o.literalMap(entries.map((value, index) => ({
                key: literal.entries[index].key,
                value,
                quoted: literal.entries[index].quoted
            }))));
        }
    }
    /**
     * @param {?} key
     * @param {?} values
     * @param {?} resultMap
     * @return {?}
     */
    _getLiteralFactory(key, values, resultMap) {
        /** @type {?} */
        let literalFactory = this.literalFactories.get(key);
        /** @type {?} */
        const literalFactoryArguments = values.filter((e => !e.isConstant()));
        if (!literalFactory) {
            /** @type {?} */
            const resultExpressions = values.map((e, index) => e.isConstant() ? this.getConstLiteral(e, true) : o.variable(`a${index}`));
            /** @type {?} */
            const parameters = resultExpressions.filter(isVariable).map(e => new o.FnParam(/** @type {?} */ ((e.name)), o.DYNAMIC_TYPE));
            /** @type {?} */
            const pureFunctionDeclaration = o.fn(parameters, [new o.ReturnStatement(resultMap(resultExpressions))], o.INFERRED_TYPE);
            /** @type {?} */
            const name = this.freshName();
            this.statements.push(o.variable(name).set(pureFunctionDeclaration).toDeclStmt(o.INFERRED_TYPE, [
                o.StmtModifier.Final
            ]));
            literalFactory = o.variable(name);
            this.literalFactories.set(key, literalFactory);
        }
        return { literalFactory, literalFactoryArguments };
    }
    /**
     * Produce a unique name.
     *
     * The name might be unique among different prefixes if any of the prefixes end in
     * a digit so the prefix should be a constant string (not based on user input) and
     * must not end in a digit.
     * @param {?} prefix
     * @return {?}
     */
    uniqueName(prefix) { return `${prefix}${this.nextNameIndex++}`; }
    /**
     * @param {?} kind
     * @return {?}
     */
    definitionsOf(kind) {
        switch (kind) {
            case 2 /* Component */:
                return this.componentDefinitions;
            case 1 /* Directive */:
                return this.directiveDefinitions;
            case 0 /* Injector */:
                return this.injectorDefinitions;
            case 3 /* Pipe */:
                return this.pipeDefinitions;
        }
        error(`Unknown definition kind ${kind}`);
        return this.componentDefinitions;
    }
    /**
     * @param {?} kind
     * @return {?}
     */
    propertyNameOf(kind) {
        switch (kind) {
            case 2 /* Component */:
                return 'ngComponentDef';
            case 1 /* Directive */:
                return 'ngDirectiveDef';
            case 0 /* Injector */:
                return 'ngInjectorDef';
            case 3 /* Pipe */:
                return 'ngPipeDef';
        }
        error(`Unknown definition kind ${kind}`);
        return '<unknown>';
    }
    /**
     * @return {?}
     */
    freshName() { return this.uniqueName(CONSTANT_PREFIX); }
    /**
     * @return {?}
     */
    freshTranslationName() {
        return this.uniqueName(TRANSLATION_PREFIX).toUpperCase();
    }
    /**
     * @param {?} expression
     * @return {?}
     */
    keyOf(expression) {
        return expression.visitExpression(new KeyVisitor(), KEY_CONTEXT);
    }
}
if (false) {
    /** @type {?} */
    ConstantPool.prototype.statements;
    /** @type {?} */
    ConstantPool.prototype.translations;
    /** @type {?} */
    ConstantPool.prototype.literals;
    /** @type {?} */
    ConstantPool.prototype.literalFactories;
    /** @type {?} */
    ConstantPool.prototype.injectorDefinitions;
    /** @type {?} */
    ConstantPool.prototype.directiveDefinitions;
    /** @type {?} */
    ConstantPool.prototype.componentDefinitions;
    /** @type {?} */
    ConstantPool.prototype.pipeDefinitions;
    /** @type {?} */
    ConstantPool.prototype.nextNameIndex;
}
/**
 * Visitor used to determine if 2 expressions are equivalent and can be shared in the
 * `ConstantPool`.
 *
 * When the id (string) generated by the visitor is equal, expressions are considered equivalent.
 */
class KeyVisitor {
    constructor() {
        this.visitWrappedNodeExpr = invalid;
        this.visitWriteVarExpr = invalid;
        this.visitWriteKeyExpr = invalid;
        this.visitWritePropExpr = invalid;
        this.visitInvokeMethodExpr = invalid;
        this.visitInvokeFunctionExpr = invalid;
        this.visitInstantiateExpr = invalid;
        this.visitConditionalExpr = invalid;
        this.visitNotExpr = invalid;
        this.visitAssertNotNullExpr = invalid;
        this.visitCastExpr = invalid;
        this.visitFunctionExpr = invalid;
        this.visitBinaryOperatorExpr = invalid;
        this.visitReadPropExpr = invalid;
        this.visitReadKeyExpr = invalid;
        this.visitCommaExpr = invalid;
    }
    /**
     * @param {?} ast
     * @return {?}
     */
    visitLiteralExpr(ast) {
        return `${typeof ast.value === 'string' ? '"' + ast.value + '"' : ast.value}`;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralArrayExpr(ast, context) {
        return `[${ast.entries.map(entry => entry.visitExpression(this, context)).join(',')}]`;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralMapExpr(ast, context) {
        /** @type {?} */
        const mapKey = (entry) => {
            /** @type {?} */
            const quote = entry.quoted ? '"' : '';
            return `${quote}${entry.key}${quote}`;
        };
        /** @type {?} */
        const mapEntry = (entry) => `${mapKey(entry)}:${entry.value.visitExpression(this, context)}`;
        return `{${ast.entries.map(mapEntry).join(',')}`;
    }
    /**
     * @param {?} ast
     * @return {?}
     */
    visitExternalExpr(ast) {
        return ast.value.moduleName ? `EX:${ast.value.moduleName}:${ast.value.name}` :
            `EX:${ast.value.runtime.name}`;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    visitReadVarExpr(node) { return `VAR:${node.name}`; }
    /**
     * @param {?} node
     * @param {?} context
     * @return {?}
     */
    visitTypeofExpr(node, context) {
        return `TYPEOF:${node.expr.visitExpression(this, context)}`;
    }
}
if (false) {
    /** @type {?} */
    KeyVisitor.prototype.visitWrappedNodeExpr;
    /** @type {?} */
    KeyVisitor.prototype.visitWriteVarExpr;
    /** @type {?} */
    KeyVisitor.prototype.visitWriteKeyExpr;
    /** @type {?} */
    KeyVisitor.prototype.visitWritePropExpr;
    /** @type {?} */
    KeyVisitor.prototype.visitInvokeMethodExpr;
    /** @type {?} */
    KeyVisitor.prototype.visitInvokeFunctionExpr;
    /** @type {?} */
    KeyVisitor.prototype.visitInstantiateExpr;
    /** @type {?} */
    KeyVisitor.prototype.visitConditionalExpr;
    /** @type {?} */
    KeyVisitor.prototype.visitNotExpr;
    /** @type {?} */
    KeyVisitor.prototype.visitAssertNotNullExpr;
    /** @type {?} */
    KeyVisitor.prototype.visitCastExpr;
    /** @type {?} */
    KeyVisitor.prototype.visitFunctionExpr;
    /** @type {?} */
    KeyVisitor.prototype.visitBinaryOperatorExpr;
    /** @type {?} */
    KeyVisitor.prototype.visitReadPropExpr;
    /** @type {?} */
    KeyVisitor.prototype.visitReadKeyExpr;
    /** @type {?} */
    KeyVisitor.prototype.visitCommaExpr;
}
/**
 * @template T
 * @param {?} arg
 * @return {?}
 */
function invalid(arg) {
    throw new Error(`Invalid state: Visitor ${this.constructor.name} doesn't handle ${arg.constructor.name}`);
}
/**
 * @param {?} e
 * @return {?}
 */
function isVariable(e) {
    return e instanceof o.ReadVarExpr;
}
/**
 * @param {?} meta
 * @return {?}
 */
function i18nMetaToDocStmt(meta) {
    /** @type {?} */
    const tags = [];
    if (meta.description) {
        tags.push({ tagName: "desc" /* Desc */, text: meta.description });
    }
    if (meta.meaning) {
        tags.push({ tagName: "meaning" /* Meaning */, text: meta.meaning });
    }
    return tags.length == 0 ? null : new o.JSDocCommentStmt(tags);
}
//# sourceMappingURL=constant_pool.js.map