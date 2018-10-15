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
import { identifierName, sanitizeIdentifier } from '../../compile_metadata';
import { BindingForm, convertActionBinding, convertPropertyBinding } from '../../compiler_util/expression_converter';
import * as core from '../../core';
import { LifecycleHooks } from '../../lifecycle_reflector';
import * as o from '../../output/output_ast';
import { typeSourceSpan } from '../../parse_util';
import { CssSelector, SelectorMatcher } from '../../selector';
import { error } from '../../util';
import { compileFactoryFunction, dependenciesFromGlobalMetadata } from '../r3_factory';
import { Identifiers as R3 } from '../r3_identifiers';
import { typeWithParameters } from '../util';
import { BindingScope, TemplateDefinitionBuilder, renderFlagCheckIfStmt } from './template';
import { CONTEXT_NAME, DefinitionMap, RENDER_FLAGS, TEMPORARY_NAME, asLiteral, conditionallyCreateMapObjectLiteral, getQueryPredicate, temporaryAllocator } from './util';
/**
 * @param {?} meta
 * @param {?} constantPool
 * @param {?} bindingParser
 * @return {?}
 */
function baseDirectiveFields(meta, constantPool, bindingParser) {
    /** @type {?} */
    const definitionMap = new DefinitionMap();
    // e.g. `type: MyDirective`
    definitionMap.set('type', meta.type);
    // e.g. `selectors: [['', 'someDir', '']]`
    definitionMap.set('selectors', createDirectiveSelector(/** @type {?} */ ((meta.selector))));
    // e.g. `factory: () => new MyApp(injectElementRef())`
    definitionMap.set('factory', compileFactoryFunction({
        name: meta.name,
        fnOrClass: meta.type,
        deps: meta.deps,
        useNew: true,
        injectFn: R3.directiveInject,
    }));
    definitionMap.set('contentQueries', createContentQueriesFunction(meta, constantPool));
    definitionMap.set('contentQueriesRefresh', createContentQueriesRefreshFunction(meta));
    // e.g. `hostBindings: (dirIndex, elIndex) => { ... }
    definitionMap.set('hostBindings', createHostBindingsFunction(meta, bindingParser));
    // e.g. `attributes: ['role', 'listbox']`
    definitionMap.set('attributes', createHostAttributesArray(meta));
    // e.g 'inputs: {a: 'a'}`
    definitionMap.set('inputs', conditionallyCreateMapObjectLiteral(meta.inputs));
    // e.g 'outputs: {a: 'a'}`
    definitionMap.set('outputs', conditionallyCreateMapObjectLiteral(meta.outputs));
    /** @type {?} */
    const features = [];
    if (meta.usesInheritance) {
        features.push(o.importExpr(R3.InheritDefinitionFeature));
    }
    if (meta.lifecycle.usesOnChanges) {
        features.push(o.importExpr(R3.NgOnChangesFeature));
    }
    if (features.length) {
        definitionMap.set('features', o.literalArr(features));
    }
    return definitionMap;
}
/**
 * Compile a directive for the render3 runtime as defined by the `R3DirectiveMetadata`.
 * @param {?} meta
 * @param {?} constantPool
 * @param {?} bindingParser
 * @return {?}
 */
export function compileDirectiveFromMetadata(meta, constantPool, bindingParser) {
    /** @type {?} */
    const definitionMap = baseDirectiveFields(meta, constantPool, bindingParser);
    /** @type {?} */
    const expression = o.importExpr(R3.defineDirective).callFn([definitionMap.toLiteralMap()]);
    /** @type {?} */
    const selectorForType = (meta.selector || '').replace(/\n/g, '');
    /** @type {?} */
    const type = new o.ExpressionType(o.importExpr(R3.DirectiveDef, [
        typeWithParameters(meta.type, meta.typeArgumentCount),
        new o.ExpressionType(o.literal(selectorForType))
    ]));
    return { expression, type };
}
/**
 * Compile a component for the render3 runtime as defined by the `R3ComponentMetadata`.
 * @param {?} meta
 * @param {?} constantPool
 * @param {?} bindingParser
 * @return {?}
 */
export function compileComponentFromMetadata(meta, constantPool, bindingParser) {
    /** @type {?} */
    const definitionMap = baseDirectiveFields(meta, constantPool, bindingParser);
    /** @type {?} */
    const selector = meta.selector && CssSelector.parse(meta.selector);
    /** @type {?} */
    const firstSelector = selector && selector[0];
    // e.g. `attr: ["class", ".my.app"]`
    // This is optional an only included if the first selector of a component specifies attributes.
    if (firstSelector) {
        /** @type {?} */
        const selectorAttributes = firstSelector.getAttrs();
        if (selectorAttributes.length) {
            definitionMap.set('attrs', constantPool.getConstLiteral(o.literalArr(selectorAttributes.map(value => value != null ? o.literal(value) : o.literal(undefined))), /* forceShared */ true));
        }
    }
    /** @type {?} */
    let directiveMatcher = null;
    if (meta.directives.size) {
        /** @type {?} */
        const matcher = new SelectorMatcher();
        meta.directives.forEach((expression, selector) => {
            matcher.addSelectables(CssSelector.parse(selector), expression);
        });
        directiveMatcher = matcher;
    }
    if (meta.viewQueries.length) {
        definitionMap.set('viewQuery', createViewQueriesFunction(meta, constantPool));
    }
    /** @type {?} */
    const templateTypeName = meta.name;
    /** @type {?} */
    const templateName = templateTypeName ? `${templateTypeName}_Template` : null;
    /** @type {?} */
    const directivesUsed = new Set();
    /** @type {?} */
    const pipesUsed = new Set();
    /** @type {?} */
    const template = meta.template;
    /** @type {?} */
    const templateFunctionExpression = new TemplateDefinitionBuilder(constantPool, CONTEXT_NAME, BindingScope.ROOT_SCOPE, 0, templateTypeName, templateName, meta.viewQueries, directiveMatcher, directivesUsed, meta.pipes, pipesUsed, R3.namespaceHTML)
        .buildTemplateFunction(template.nodes, [], template.hasNgContent, template.ngContentSelectors);
    definitionMap.set('template', templateFunctionExpression);
    // e.g. `directives: [MyDirective]`
    if (directivesUsed.size) {
        definitionMap.set('directives', o.literalArr(Array.from(directivesUsed)));
    }
    // e.g. `pipes: [MyPipe]`
    if (pipesUsed.size) {
        definitionMap.set('pipes', o.literalArr(Array.from(pipesUsed)));
    }
    /** @type {?} */
    const selectorForType = (meta.selector || '').replace(/\n/g, '');
    /** @type {?} */
    const expression = o.importExpr(R3.defineComponent).callFn([definitionMap.toLiteralMap()]);
    /** @type {?} */
    const type = new o.ExpressionType(o.importExpr(R3.ComponentDef, [
        typeWithParameters(meta.type, meta.typeArgumentCount),
        new o.ExpressionType(o.literal(selectorForType))
    ]));
    return { expression, type };
}
/**
 * A wrapper around `compileDirective` which depends on render2 global analysis data as its input
 * instead of the `R3DirectiveMetadata`.
 *
 * `R3DirectiveMetadata` is computed from `CompileDirectiveMetadata` and other statically reflected
 * information.
 * @param {?} outputCtx
 * @param {?} directive
 * @param {?} reflector
 * @param {?} bindingParser
 * @return {?}
 */
export function compileDirectiveFromRender2(outputCtx, directive, reflector, bindingParser) {
    /** @type {?} */
    const name = /** @type {?} */ ((identifierName(directive.type)));
    name || error(`Cannot resolver the name of ${directive.type}`);
    /** @type {?} */
    const definitionField = outputCtx.constantPool.propertyNameOf(1 /* Directive */);
    /** @type {?} */
    const meta = directiveMetadataFromGlobalMetadata(directive, outputCtx, reflector);
    /** @type {?} */
    const res = compileDirectiveFromMetadata(meta, outputCtx.constantPool, bindingParser);
    // Create the partial class to be merged with the actual class.
    outputCtx.statements.push(new o.ClassStmt(name, null, [new o.ClassField(definitionField, o.INFERRED_TYPE, [o.StmtModifier.Static], res.expression)], [], new o.ClassMethod(null, [], []), []));
}
/**
 * A wrapper around `compileComponent` which depends on render2 global analysis data as its input
 * instead of the `R3DirectiveMetadata`.
 *
 * `R3ComponentMetadata` is computed from `CompileDirectiveMetadata` and other statically reflected
 * information.
 * @param {?} outputCtx
 * @param {?} component
 * @param {?} render3Ast
 * @param {?} reflector
 * @param {?} bindingParser
 * @param {?} directiveTypeBySel
 * @param {?} pipeTypeByName
 * @return {?}
 */
export function compileComponentFromRender2(outputCtx, component, render3Ast, reflector, bindingParser, directiveTypeBySel, pipeTypeByName) {
    /** @type {?} */
    const name = /** @type {?} */ ((identifierName(component.type)));
    name || error(`Cannot resolver the name of ${component.type}`);
    /** @type {?} */
    const definitionField = outputCtx.constantPool.propertyNameOf(2 /* Component */);
    /** @type {?} */
    const summary = component.toSummary();
    /** @type {?} */
    const meta = Object.assign({}, directiveMetadataFromGlobalMetadata(component, outputCtx, reflector), { selector: component.selector, template: {
            nodes: render3Ast.nodes,
            hasNgContent: render3Ast.hasNgContent,
            ngContentSelectors: render3Ast.ngContentSelectors,
        }, directives: typeMapToExpressionMap(directiveTypeBySel, outputCtx), pipes: typeMapToExpressionMap(pipeTypeByName, outputCtx), viewQueries: queriesFromGlobalMetadata(component.viewQueries, outputCtx) });
    /** @type {?} */
    const res = compileComponentFromMetadata(meta, outputCtx.constantPool, bindingParser);
    // Create the partial class to be merged with the actual class.
    outputCtx.statements.push(new o.ClassStmt(name, null, [new o.ClassField(definitionField, o.INFERRED_TYPE, [o.StmtModifier.Static], res.expression)], [], new o.ClassMethod(null, [], []), []));
}
/**
 * Compute `R3DirectiveMetadata` given `CompileDirectiveMetadata` and a `CompileReflector`.
 * @param {?} directive
 * @param {?} outputCtx
 * @param {?} reflector
 * @return {?}
 */
function directiveMetadataFromGlobalMetadata(directive, outputCtx, reflector) {
    /** @type {?} */
    const summary = directive.toSummary();
    /** @type {?} */
    const name = /** @type {?} */ ((identifierName(directive.type)));
    name || error(`Cannot resolver the name of ${directive.type}`);
    return {
        name,
        type: outputCtx.importExpr(directive.type.reference),
        typeArgumentCount: 0,
        typeSourceSpan: typeSourceSpan(directive.isComponent ? 'Component' : 'Directive', directive.type),
        selector: directive.selector,
        deps: dependenciesFromGlobalMetadata(directive.type, outputCtx, reflector),
        queries: queriesFromGlobalMetadata(directive.queries, outputCtx),
        lifecycle: {
            usesOnChanges: directive.type.lifecycleHooks.some(lifecycle => lifecycle == LifecycleHooks.OnChanges),
        },
        host: {
            attributes: directive.hostAttributes,
            listeners: summary.hostListeners,
            properties: summary.hostProperties,
        },
        inputs: directive.inputs,
        outputs: directive.outputs,
        usesInheritance: false,
    };
}
/**
 * Convert `CompileQueryMetadata` into `R3QueryMetadata`.
 * @param {?} queries
 * @param {?} outputCtx
 * @return {?}
 */
function queriesFromGlobalMetadata(queries, outputCtx) {
    return queries.map(query => {
        /** @type {?} */
        let read = null;
        if (query.read && query.read.identifier) {
            read = outputCtx.importExpr(query.read.identifier.reference);
        }
        return {
            propertyName: query.propertyName,
            first: query.first,
            predicate: selectorsFromGlobalMetadata(query.selectors, outputCtx),
            descendants: query.descendants, read,
        };
    });
}
/**
 * Convert `CompileTokenMetadata` for query selectors into either an expression for a predicate
 * type, or a list of string predicates.
 * @param {?} selectors
 * @param {?} outputCtx
 * @return {?}
 */
function selectorsFromGlobalMetadata(selectors, outputCtx) {
    if (selectors.length > 1 || (selectors.length == 1 && selectors[0].value)) {
        /** @type {?} */
        const selectorStrings = selectors.map(value => /** @type {?} */ (value.value));
        selectorStrings.some(value => !value) &&
            error('Found a type among the string selectors expected');
        return outputCtx.constantPool.getConstLiteral(o.literalArr(selectorStrings.map(value => o.literal(value))));
    }
    if (selectors.length == 1) {
        /** @type {?} */
        const first = selectors[0];
        if (first.identifier) {
            return outputCtx.importExpr(first.identifier.reference);
        }
    }
    error('Unexpected query form');
    return o.NULL_EXPR;
}
/**
 * @param {?} query
 * @param {?} constantPool
 * @param {?} idx
 * @return {?}
 */
function createQueryDefinition(query, constantPool, idx) {
    /** @type {?} */
    const predicate = getQueryPredicate(query, constantPool);
    /** @type {?} */
    const parameters = [
        o.literal(idx, o.INFERRED_TYPE),
        predicate,
        o.literal(query.descendants),
    ];
    if (query.read) {
        parameters.push(query.read);
    }
    return o.importExpr(R3.query).callFn(parameters);
}
/**
 * @param {?} selector
 * @return {?}
 */
function createDirectiveSelector(selector) {
    return asLiteral(core.parseSelectorToR3Selector(selector));
}
/**
 * @param {?} meta
 * @return {?}
 */
function createHostAttributesArray(meta) {
    /** @type {?} */
    const values = [];
    /** @type {?} */
    const attributes = meta.host.attributes;
    for (let key of Object.getOwnPropertyNames(attributes)) {
        /** @type {?} */
        const value = attributes[key];
        values.push(o.literal(key), o.literal(value));
    }
    if (values.length > 0) {
        return o.literalArr(values);
    }
    return null;
}
/**
 * @param {?} meta
 * @param {?} constantPool
 * @return {?}
 */
function createContentQueriesFunction(meta, constantPool) {
    if (meta.queries.length) {
        /** @type {?} */
        const statements = meta.queries.map((query) => {
            /** @type {?} */
            const queryDefinition = createQueryDefinition(query, constantPool, null);
            return o.importExpr(R3.registerContentQuery).callFn([queryDefinition]).toStmt();
        });
        /** @type {?} */
        const typeName = meta.name;
        return o.fn([], statements, o.INFERRED_TYPE, null, typeName ? `${typeName}_ContentQueries` : null);
    }
    return null;
}
/**
 * @param {?} meta
 * @return {?}
 */
function createContentQueriesRefreshFunction(meta) {
    if (meta.queries.length > 0) {
        /** @type {?} */
        const statements = [];
        /** @type {?} */
        const typeName = meta.name;
        /** @type {?} */
        const parameters = [
            new o.FnParam('dirIndex', o.NUMBER_TYPE),
            new o.FnParam('queryStartIndex', o.NUMBER_TYPE),
        ];
        /** @type {?} */
        const directiveInstanceVar = o.variable('instance');
        /** @type {?} */
        const temporary = temporaryAllocator(statements, TEMPORARY_NAME);
        // const $instance$ = $r3$.ɵd(dirIndex);
        statements.push(directiveInstanceVar.set(o.importExpr(R3.loadDirective).callFn([o.variable('dirIndex')]))
            .toDeclStmt(o.INFERRED_TYPE, [o.StmtModifier.Final]));
        meta.queries.forEach((query, idx) => {
            /** @type {?} */
            const loadQLArg = o.variable('queryStartIndex');
            /** @type {?} */
            const getQueryList = o.importExpr(R3.loadQueryList).callFn([
                idx > 0 ? loadQLArg.plus(o.literal(idx)) : loadQLArg
            ]);
            /** @type {?} */
            const assignToTemporary = temporary().set(getQueryList);
            /** @type {?} */
            const callQueryRefresh = o.importExpr(R3.queryRefresh).callFn([assignToTemporary]);
            /** @type {?} */
            const updateDirective = directiveInstanceVar.prop(query.propertyName)
                .set(query.first ? temporary().prop('first') : temporary());
            /** @type {?} */
            const refreshQueryAndUpdateDirective = callQueryRefresh.and(updateDirective);
            statements.push(refreshQueryAndUpdateDirective.toStmt());
        });
        return o.fn(parameters, statements, o.INFERRED_TYPE, null, typeName ? `${typeName}_ContentQueriesRefresh` : null);
    }
    return null;
}
/**
 * @param {?} meta
 * @param {?} constantPool
 * @return {?}
 */
function createViewQueriesFunction(meta, constantPool) {
    /** @type {?} */
    const createStatements = [];
    /** @type {?} */
    const updateStatements = [];
    /** @type {?} */
    const tempAllocator = temporaryAllocator(updateStatements, TEMPORARY_NAME);
    for (let i = 0; i < meta.viewQueries.length; i++) {
        /** @type {?} */
        const query = meta.viewQueries[i];
        /** @type {?} */
        const queryDefinition = createQueryDefinition(query, constantPool, i);
        createStatements.push(queryDefinition.toStmt());
        /** @type {?} */
        const temporary = tempAllocator();
        /** @type {?} */
        const getQueryList = o.importExpr(R3.load).callFn([o.literal(i)]);
        /** @type {?} */
        const refresh = o.importExpr(R3.queryRefresh).callFn([temporary.set(getQueryList)]);
        /** @type {?} */
        const updateDirective = o.variable(CONTEXT_NAME)
            .prop(query.propertyName)
            .set(query.first ? temporary.prop('first') : temporary);
        updateStatements.push(refresh.and(updateDirective).toStmt());
    }
    /** @type {?} */
    const viewQueryFnName = meta.name ? `${meta.name}_Query` : null;
    return o.fn([new o.FnParam(RENDER_FLAGS, o.NUMBER_TYPE), new o.FnParam(CONTEXT_NAME, null)], [
        renderFlagCheckIfStmt(1 /* Create */, createStatements),
        renderFlagCheckIfStmt(2 /* Update */, updateStatements)
    ], o.INFERRED_TYPE, null, viewQueryFnName);
}
/**
 * @param {?} meta
 * @param {?} bindingParser
 * @return {?}
 */
function createHostBindingsFunction(meta, bindingParser) {
    /** @type {?} */
    const statements = [];
    /** @type {?} */
    const hostBindingSourceSpan = meta.typeSourceSpan;
    /** @type {?} */
    const directiveSummary = metadataAsSummary(meta);
    /** @type {?} */
    const bindings = bindingParser.createBoundHostProperties(directiveSummary, hostBindingSourceSpan);
    /** @type {?} */
    const bindingContext = o.importExpr(R3.loadDirective).callFn([o.variable('dirIndex')]);
    if (bindings) {
        for (const binding of bindings) {
            /** @type {?} */
            const bindingExpr = convertPropertyBinding(null, bindingContext, binding.expression, 'b', BindingForm.TrySimple, () => error('Unexpected interpolation'));
            statements.push(...bindingExpr.stmts);
            statements.push(o.importExpr(R3.elementProperty)
                .callFn([
                o.variable('elIndex'),
                o.literal(binding.name),
                o.importExpr(R3.bind).callFn([bindingExpr.currValExpr]),
            ])
                .toStmt());
        }
    }
    /** @type {?} */
    const eventBindings = bindingParser.createDirectiveHostEventAsts(directiveSummary, hostBindingSourceSpan);
    if (eventBindings) {
        for (const binding of eventBindings) {
            /** @type {?} */
            const bindingExpr = convertActionBinding(null, bindingContext, binding.handler, 'b', () => error('Unexpected interpolation'));
            /** @type {?} */
            const bindingName = binding.name && sanitizeIdentifier(binding.name);
            /** @type {?} */
            const typeName = meta.name;
            /** @type {?} */
            const functionName = typeName && bindingName ? `${typeName}_${bindingName}_HostBindingHandler` : null;
            /** @type {?} */
            const handler = o.fn([new o.FnParam('$event', o.DYNAMIC_TYPE)], [...bindingExpr.stmts, new o.ReturnStatement(bindingExpr.allowDefault)], o.INFERRED_TYPE, null, functionName);
            statements.push(o.importExpr(R3.listener).callFn([o.literal(binding.name), handler]).toStmt());
        }
    }
    if (statements.length > 0) {
        /** @type {?} */
        const typeName = meta.name;
        return o.fn([
            new o.FnParam('dirIndex', o.NUMBER_TYPE),
            new o.FnParam('elIndex', o.NUMBER_TYPE),
        ], statements, o.INFERRED_TYPE, null, typeName ? `${typeName}_HostBindings` : null);
    }
    return null;
}
/**
 * @param {?} meta
 * @return {?}
 */
function metadataAsSummary(meta) {
    // clang-format off
    return /** @type {?} */ ({
        hostAttributes: meta.host.attributes,
        hostListeners: meta.host.listeners,
        hostProperties: meta.host.properties,
    });
    // clang-format on
}
/**
 * @param {?} map
 * @param {?} outputCtx
 * @return {?}
 */
function typeMapToExpressionMap(map, outputCtx) {
    /** @type {?} */
    const entries = Array.from(map).map(([key, type]) => [key, outputCtx.importExpr(type)]);
    return new Map(entries);
}
/** @type {?} */
const HOST_REG_EXP = /^(?:(?:\[([^\]]+)\])|(?:\(([^\)]+)\)))|(\@[-\w]+)$/;
/** @enum {number} */
const HostBindingGroup = {
    // group 1: "prop" from "[prop]"
    Property: 1,
    // group 2: "event" from "(event)"
    Event: 2,
    // group 3: "@trigger" from "@trigger"
    Animation: 3,
};
/**
 * @param {?} host
 * @return {?}
 */
export function parseHostBindings(host) {
    /** @type {?} */
    const attributes = {};
    /** @type {?} */
    const listeners = {};
    /** @type {?} */
    const properties = {};
    /** @type {?} */
    const animations = {};
    Object.keys(host).forEach(key => {
        /** @type {?} */
        const value = host[key];
        /** @type {?} */
        const matches = key.match(HOST_REG_EXP);
        if (matches === null) {
            attributes[key] = value;
        }
        else if (matches[1 /* Property */] != null) {
            properties[matches[1 /* Property */]] = value;
        }
        else if (matches[2 /* Event */] != null) {
            listeners[matches[2 /* Event */]] = value;
        }
        else if (matches[3 /* Animation */] != null) {
            animations[matches[3 /* Animation */]] = value;
        }
    });
    return { attributes, listeners, properties, animations };
}
//# sourceMappingURL=compiler.js.map