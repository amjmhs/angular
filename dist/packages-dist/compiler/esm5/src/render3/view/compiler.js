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
import * as tslib_1 from "tslib";
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
    var definitionMap = new DefinitionMap();
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
    var features = [];
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
    var definitionMap = baseDirectiveFields(meta, constantPool, bindingParser);
    /** @type {?} */
    var expression = o.importExpr(R3.defineDirective).callFn([definitionMap.toLiteralMap()]);
    /** @type {?} */
    var selectorForType = (meta.selector || '').replace(/\n/g, '');
    /** @type {?} */
    var type = new o.ExpressionType(o.importExpr(R3.DirectiveDef, [
        typeWithParameters(meta.type, meta.typeArgumentCount),
        new o.ExpressionType(o.literal(selectorForType))
    ]));
    return { expression: expression, type: type };
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
    var definitionMap = baseDirectiveFields(meta, constantPool, bindingParser);
    /** @type {?} */
    var selector = meta.selector && CssSelector.parse(meta.selector);
    /** @type {?} */
    var firstSelector = selector && selector[0];
    // e.g. `attr: ["class", ".my.app"]`
    // This is optional an only included if the first selector of a component specifies attributes.
    if (firstSelector) {
        /** @type {?} */
        var selectorAttributes = firstSelector.getAttrs();
        if (selectorAttributes.length) {
            definitionMap.set('attrs', constantPool.getConstLiteral(o.literalArr(selectorAttributes.map(function (value) { return value != null ? o.literal(value) : o.literal(undefined); })), /* forceShared */ true));
        }
    }
    /** @type {?} */
    var directiveMatcher = null;
    if (meta.directives.size) {
        /** @type {?} */
        var matcher_1 = new SelectorMatcher();
        meta.directives.forEach(function (expression, selector) {
            matcher_1.addSelectables(CssSelector.parse(selector), expression);
        });
        directiveMatcher = matcher_1;
    }
    if (meta.viewQueries.length) {
        definitionMap.set('viewQuery', createViewQueriesFunction(meta, constantPool));
    }
    /** @type {?} */
    var templateTypeName = meta.name;
    /** @type {?} */
    var templateName = templateTypeName ? templateTypeName + "_Template" : null;
    /** @type {?} */
    var directivesUsed = new Set();
    /** @type {?} */
    var pipesUsed = new Set();
    /** @type {?} */
    var template = meta.template;
    /** @type {?} */
    var templateFunctionExpression = new TemplateDefinitionBuilder(constantPool, CONTEXT_NAME, BindingScope.ROOT_SCOPE, 0, templateTypeName, templateName, meta.viewQueries, directiveMatcher, directivesUsed, meta.pipes, pipesUsed, R3.namespaceHTML)
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
    var selectorForType = (meta.selector || '').replace(/\n/g, '');
    /** @type {?} */
    var expression = o.importExpr(R3.defineComponent).callFn([definitionMap.toLiteralMap()]);
    /** @type {?} */
    var type = new o.ExpressionType(o.importExpr(R3.ComponentDef, [
        typeWithParameters(meta.type, meta.typeArgumentCount),
        new o.ExpressionType(o.literal(selectorForType))
    ]));
    return { expression: expression, type: type };
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
    var name = /** @type {?} */ ((identifierName(directive.type)));
    name || error("Cannot resolver the name of " + directive.type);
    /** @type {?} */
    var definitionField = outputCtx.constantPool.propertyNameOf(1 /* Directive */);
    /** @type {?} */
    var meta = directiveMetadataFromGlobalMetadata(directive, outputCtx, reflector);
    /** @type {?} */
    var res = compileDirectiveFromMetadata(meta, outputCtx.constantPool, bindingParser);
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
    var name = /** @type {?} */ ((identifierName(component.type)));
    name || error("Cannot resolver the name of " + component.type);
    /** @type {?} */
    var definitionField = outputCtx.constantPool.propertyNameOf(2 /* Component */);
    /** @type {?} */
    var summary = component.toSummary();
    /** @type {?} */
    var meta = tslib_1.__assign({}, directiveMetadataFromGlobalMetadata(component, outputCtx, reflector), { selector: component.selector, template: {
            nodes: render3Ast.nodes,
            hasNgContent: render3Ast.hasNgContent,
            ngContentSelectors: render3Ast.ngContentSelectors,
        }, directives: typeMapToExpressionMap(directiveTypeBySel, outputCtx), pipes: typeMapToExpressionMap(pipeTypeByName, outputCtx), viewQueries: queriesFromGlobalMetadata(component.viewQueries, outputCtx) });
    /** @type {?} */
    var res = compileComponentFromMetadata(meta, outputCtx.constantPool, bindingParser);
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
    var summary = directive.toSummary();
    /** @type {?} */
    var name = /** @type {?} */ ((identifierName(directive.type)));
    name || error("Cannot resolver the name of " + directive.type);
    return {
        name: name,
        type: outputCtx.importExpr(directive.type.reference),
        typeArgumentCount: 0,
        typeSourceSpan: typeSourceSpan(directive.isComponent ? 'Component' : 'Directive', directive.type),
        selector: directive.selector,
        deps: dependenciesFromGlobalMetadata(directive.type, outputCtx, reflector),
        queries: queriesFromGlobalMetadata(directive.queries, outputCtx),
        lifecycle: {
            usesOnChanges: directive.type.lifecycleHooks.some(function (lifecycle) { return lifecycle == LifecycleHooks.OnChanges; }),
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
    return queries.map(function (query) {
        /** @type {?} */
        var read = null;
        if (query.read && query.read.identifier) {
            read = outputCtx.importExpr(query.read.identifier.reference);
        }
        return {
            propertyName: query.propertyName,
            first: query.first,
            predicate: selectorsFromGlobalMetadata(query.selectors, outputCtx),
            descendants: query.descendants, read: read,
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
        var selectorStrings = selectors.map(function (value) { return (value.value); });
        selectorStrings.some(function (value) { return !value; }) &&
            error('Found a type among the string selectors expected');
        return outputCtx.constantPool.getConstLiteral(o.literalArr(selectorStrings.map(function (value) { return o.literal(value); })));
    }
    if (selectors.length == 1) {
        /** @type {?} */
        var first = selectors[0];
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
    var predicate = getQueryPredicate(query, constantPool);
    /** @type {?} */
    var parameters = [
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
    var values = [];
    /** @type {?} */
    var attributes = meta.host.attributes;
    for (var _i = 0, _a = Object.getOwnPropertyNames(attributes); _i < _a.length; _i++) {
        var key = _a[_i];
        /** @type {?} */
        var value = attributes[key];
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
        var statements = meta.queries.map(function (query) {
            /** @type {?} */
            var queryDefinition = createQueryDefinition(query, constantPool, null);
            return o.importExpr(R3.registerContentQuery).callFn([queryDefinition]).toStmt();
        });
        /** @type {?} */
        var typeName = meta.name;
        return o.fn([], statements, o.INFERRED_TYPE, null, typeName ? typeName + "_ContentQueries" : null);
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
        var statements_1 = [];
        /** @type {?} */
        var typeName = meta.name;
        /** @type {?} */
        var parameters = [
            new o.FnParam('dirIndex', o.NUMBER_TYPE),
            new o.FnParam('queryStartIndex', o.NUMBER_TYPE),
        ];
        /** @type {?} */
        var directiveInstanceVar_1 = o.variable('instance');
        /** @type {?} */
        var temporary_1 = temporaryAllocator(statements_1, TEMPORARY_NAME);
        // const $instance$ = $r3$.ɵd(dirIndex);
        // const $instance$ = $r3$.ɵd(dirIndex);
        statements_1.push(directiveInstanceVar_1.set(o.importExpr(R3.loadDirective).callFn([o.variable('dirIndex')]))
            .toDeclStmt(o.INFERRED_TYPE, [o.StmtModifier.Final]));
        meta.queries.forEach(function (query, idx) {
            /** @type {?} */
            var loadQLArg = o.variable('queryStartIndex');
            /** @type {?} */
            var getQueryList = o.importExpr(R3.loadQueryList).callFn([
                idx > 0 ? loadQLArg.plus(o.literal(idx)) : loadQLArg
            ]);
            /** @type {?} */
            var assignToTemporary = temporary_1().set(getQueryList);
            /** @type {?} */
            var callQueryRefresh = o.importExpr(R3.queryRefresh).callFn([assignToTemporary]);
            /** @type {?} */
            var updateDirective = directiveInstanceVar_1.prop(query.propertyName)
                .set(query.first ? temporary_1().prop('first') : temporary_1());
            /** @type {?} */
            var refreshQueryAndUpdateDirective = callQueryRefresh.and(updateDirective);
            statements_1.push(refreshQueryAndUpdateDirective.toStmt());
        });
        return o.fn(parameters, statements_1, o.INFERRED_TYPE, null, typeName ? typeName + "_ContentQueriesRefresh" : null);
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
    var createStatements = [];
    /** @type {?} */
    var updateStatements = [];
    /** @type {?} */
    var tempAllocator = temporaryAllocator(updateStatements, TEMPORARY_NAME);
    for (var i = 0; i < meta.viewQueries.length; i++) {
        /** @type {?} */
        var query = meta.viewQueries[i];
        /** @type {?} */
        var queryDefinition = createQueryDefinition(query, constantPool, i);
        createStatements.push(queryDefinition.toStmt());
        /** @type {?} */
        var temporary = tempAllocator();
        /** @type {?} */
        var getQueryList = o.importExpr(R3.load).callFn([o.literal(i)]);
        /** @type {?} */
        var refresh = o.importExpr(R3.queryRefresh).callFn([temporary.set(getQueryList)]);
        /** @type {?} */
        var updateDirective = o.variable(CONTEXT_NAME)
            .prop(query.propertyName)
            .set(query.first ? temporary.prop('first') : temporary);
        updateStatements.push(refresh.and(updateDirective).toStmt());
    }
    /** @type {?} */
    var viewQueryFnName = meta.name ? meta.name + "_Query" : null;
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
    var statements = [];
    /** @type {?} */
    var hostBindingSourceSpan = meta.typeSourceSpan;
    /** @type {?} */
    var directiveSummary = metadataAsSummary(meta);
    /** @type {?} */
    var bindings = bindingParser.createBoundHostProperties(directiveSummary, hostBindingSourceSpan);
    /** @type {?} */
    var bindingContext = o.importExpr(R3.loadDirective).callFn([o.variable('dirIndex')]);
    if (bindings) {
        for (var _i = 0, bindings_1 = bindings; _i < bindings_1.length; _i++) {
            var binding = bindings_1[_i];
            /** @type {?} */
            var bindingExpr = convertPropertyBinding(null, bindingContext, binding.expression, 'b', BindingForm.TrySimple, function () { return error('Unexpected interpolation'); });
            statements.push.apply(statements, bindingExpr.stmts);
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
    var eventBindings = bindingParser.createDirectiveHostEventAsts(directiveSummary, hostBindingSourceSpan);
    if (eventBindings) {
        for (var _a = 0, eventBindings_1 = eventBindings; _a < eventBindings_1.length; _a++) {
            var binding = eventBindings_1[_a];
            /** @type {?} */
            var bindingExpr = convertActionBinding(null, bindingContext, binding.handler, 'b', function () { return error('Unexpected interpolation'); });
            /** @type {?} */
            var bindingName = binding.name && sanitizeIdentifier(binding.name);
            /** @type {?} */
            var typeName = meta.name;
            /** @type {?} */
            var functionName = typeName && bindingName ? typeName + "_" + bindingName + "_HostBindingHandler" : null;
            /** @type {?} */
            var handler = o.fn([new o.FnParam('$event', o.DYNAMIC_TYPE)], bindingExpr.stmts.concat([new o.ReturnStatement(bindingExpr.allowDefault)]), o.INFERRED_TYPE, null, functionName);
            statements.push(o.importExpr(R3.listener).callFn([o.literal(binding.name), handler]).toStmt());
        }
    }
    if (statements.length > 0) {
        /** @type {?} */
        var typeName = meta.name;
        return o.fn([
            new o.FnParam('dirIndex', o.NUMBER_TYPE),
            new o.FnParam('elIndex', o.NUMBER_TYPE),
        ], statements, o.INFERRED_TYPE, null, typeName ? typeName + "_HostBindings" : null);
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
    var entries = Array.from(map).map(function (_a) {
        var key = _a[0], type = _a[1];
        return [key, outputCtx.importExpr(type)];
    });
    return new Map(entries);
}
/** @type {?} */
var HOST_REG_EXP = /^(?:(?:\[([^\]]+)\])|(?:\(([^\)]+)\)))|(\@[-\w]+)$/;
/** @enum {number} */
var HostBindingGroup = {
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
    var attributes = {};
    /** @type {?} */
    var listeners = {};
    /** @type {?} */
    var properties = {};
    /** @type {?} */
    var animations = {};
    Object.keys(host).forEach(function (key) {
        /** @type {?} */
        var value = host[key];
        /** @type {?} */
        var matches = key.match(HOST_REG_EXP);
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
    return { attributes: attributes, listeners: listeners, properties: properties, animations: animations };
}
//# sourceMappingURL=compiler.js.map