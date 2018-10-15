"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var compile_metadata_1 = require("../../compile_metadata");
var expression_converter_1 = require("../../compiler_util/expression_converter");
var core = require("../../core");
var lifecycle_reflector_1 = require("../../lifecycle_reflector");
var o = require("../../output/output_ast");
var parse_util_1 = require("../../parse_util");
var selector_1 = require("../../selector");
var util_1 = require("../../util");
var r3_factory_1 = require("../r3_factory");
var r3_identifiers_1 = require("../r3_identifiers");
var util_2 = require("../util");
var template_1 = require("./template");
var util_3 = require("./util");
function baseDirectiveFields(meta, constantPool, bindingParser) {
    var definitionMap = new util_3.DefinitionMap();
    // e.g. `type: MyDirective`
    definitionMap.set('type', meta.type);
    // e.g. `selectors: [['', 'someDir', '']]`
    definitionMap.set('selectors', createDirectiveSelector(meta.selector));
    // e.g. `factory: () => new MyApp(injectElementRef())`
    definitionMap.set('factory', r3_factory_1.compileFactoryFunction({
        name: meta.name,
        fnOrClass: meta.type,
        deps: meta.deps,
        useNew: true,
        injectFn: r3_identifiers_1.Identifiers.directiveInject,
    }));
    definitionMap.set('contentQueries', createContentQueriesFunction(meta, constantPool));
    definitionMap.set('contentQueriesRefresh', createContentQueriesRefreshFunction(meta));
    // e.g. `hostBindings: (dirIndex, elIndex) => { ... }
    definitionMap.set('hostBindings', createHostBindingsFunction(meta, bindingParser));
    // e.g. `attributes: ['role', 'listbox']`
    definitionMap.set('attributes', createHostAttributesArray(meta));
    // e.g 'inputs: {a: 'a'}`
    definitionMap.set('inputs', util_3.conditionallyCreateMapObjectLiteral(meta.inputs));
    // e.g 'outputs: {a: 'a'}`
    definitionMap.set('outputs', util_3.conditionallyCreateMapObjectLiteral(meta.outputs));
    // e.g. `features: [NgOnChangesFeature]`
    var features = [];
    if (meta.usesInheritance) {
        features.push(o.importExpr(r3_identifiers_1.Identifiers.InheritDefinitionFeature));
    }
    if (meta.lifecycle.usesOnChanges) {
        features.push(o.importExpr(r3_identifiers_1.Identifiers.NgOnChangesFeature));
    }
    if (features.length) {
        definitionMap.set('features', o.literalArr(features));
    }
    return definitionMap;
}
/**
 * Compile a directive for the render3 runtime as defined by the `R3DirectiveMetadata`.
 */
function compileDirectiveFromMetadata(meta, constantPool, bindingParser) {
    var definitionMap = baseDirectiveFields(meta, constantPool, bindingParser);
    var expression = o.importExpr(r3_identifiers_1.Identifiers.defineDirective).callFn([definitionMap.toLiteralMap()]);
    // On the type side, remove newlines from the selector as it will need to fit into a TypeScript
    // string literal, which must be on one line.
    var selectorForType = (meta.selector || '').replace(/\n/g, '');
    var type = new o.ExpressionType(o.importExpr(r3_identifiers_1.Identifiers.DirectiveDef, [
        util_2.typeWithParameters(meta.type, meta.typeArgumentCount),
        new o.ExpressionType(o.literal(selectorForType))
    ]));
    return { expression: expression, type: type };
}
exports.compileDirectiveFromMetadata = compileDirectiveFromMetadata;
/**
 * Compile a component for the render3 runtime as defined by the `R3ComponentMetadata`.
 */
function compileComponentFromMetadata(meta, constantPool, bindingParser) {
    var definitionMap = baseDirectiveFields(meta, constantPool, bindingParser);
    var selector = meta.selector && selector_1.CssSelector.parse(meta.selector);
    var firstSelector = selector && selector[0];
    // e.g. `attr: ["class", ".my.app"]`
    // This is optional an only included if the first selector of a component specifies attributes.
    if (firstSelector) {
        var selectorAttributes = firstSelector.getAttrs();
        if (selectorAttributes.length) {
            definitionMap.set('attrs', constantPool.getConstLiteral(o.literalArr(selectorAttributes.map(function (value) { return value != null ? o.literal(value) : o.literal(undefined); })), 
            /* forceShared */ true));
        }
    }
    // Generate the CSS matcher that recognize directive
    var directiveMatcher = null;
    if (meta.directives.size) {
        var matcher_1 = new selector_1.SelectorMatcher();
        meta.directives.forEach(function (expression, selector) {
            matcher_1.addSelectables(selector_1.CssSelector.parse(selector), expression);
        });
        directiveMatcher = matcher_1;
    }
    if (meta.viewQueries.length) {
        definitionMap.set('viewQuery', createViewQueriesFunction(meta, constantPool));
    }
    // e.g. `template: function MyComponent_Template(_ctx, _cm) {...}`
    var templateTypeName = meta.name;
    var templateName = templateTypeName ? templateTypeName + "_Template" : null;
    var directivesUsed = new Set();
    var pipesUsed = new Set();
    var template = meta.template;
    var templateFunctionExpression = new template_1.TemplateDefinitionBuilder(constantPool, util_3.CONTEXT_NAME, template_1.BindingScope.ROOT_SCOPE, 0, templateTypeName, templateName, meta.viewQueries, directiveMatcher, directivesUsed, meta.pipes, pipesUsed, r3_identifiers_1.Identifiers.namespaceHTML)
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
    // On the type side, remove newlines from the selector as it will need to fit into a TypeScript
    // string literal, which must be on one line.
    var selectorForType = (meta.selector || '').replace(/\n/g, '');
    var expression = o.importExpr(r3_identifiers_1.Identifiers.defineComponent).callFn([definitionMap.toLiteralMap()]);
    var type = new o.ExpressionType(o.importExpr(r3_identifiers_1.Identifiers.ComponentDef, [
        util_2.typeWithParameters(meta.type, meta.typeArgumentCount),
        new o.ExpressionType(o.literal(selectorForType))
    ]));
    return { expression: expression, type: type };
}
exports.compileComponentFromMetadata = compileComponentFromMetadata;
/**
 * A wrapper around `compileDirective` which depends on render2 global analysis data as its input
 * instead of the `R3DirectiveMetadata`.
 *
 * `R3DirectiveMetadata` is computed from `CompileDirectiveMetadata` and other statically reflected
 * information.
 */
function compileDirectiveFromRender2(outputCtx, directive, reflector, bindingParser) {
    var name = compile_metadata_1.identifierName(directive.type);
    name || util_1.error("Cannot resolver the name of " + directive.type);
    var definitionField = outputCtx.constantPool.propertyNameOf(1 /* Directive */);
    var meta = directiveMetadataFromGlobalMetadata(directive, outputCtx, reflector);
    var res = compileDirectiveFromMetadata(meta, outputCtx.constantPool, bindingParser);
    // Create the partial class to be merged with the actual class.
    outputCtx.statements.push(new o.ClassStmt(name, null, [new o.ClassField(definitionField, o.INFERRED_TYPE, [o.StmtModifier.Static], res.expression)], [], new o.ClassMethod(null, [], []), []));
}
exports.compileDirectiveFromRender2 = compileDirectiveFromRender2;
/**
 * A wrapper around `compileComponent` which depends on render2 global analysis data as its input
 * instead of the `R3DirectiveMetadata`.
 *
 * `R3ComponentMetadata` is computed from `CompileDirectiveMetadata` and other statically reflected
 * information.
 */
function compileComponentFromRender2(outputCtx, component, render3Ast, reflector, bindingParser, directiveTypeBySel, pipeTypeByName) {
    var name = compile_metadata_1.identifierName(component.type);
    name || util_1.error("Cannot resolver the name of " + component.type);
    var definitionField = outputCtx.constantPool.propertyNameOf(2 /* Component */);
    var summary = component.toSummary();
    // Compute the R3ComponentMetadata from the CompileDirectiveMetadata
    var meta = __assign({}, directiveMetadataFromGlobalMetadata(component, outputCtx, reflector), { selector: component.selector, template: {
            nodes: render3Ast.nodes,
            hasNgContent: render3Ast.hasNgContent,
            ngContentSelectors: render3Ast.ngContentSelectors,
        }, directives: typeMapToExpressionMap(directiveTypeBySel, outputCtx), pipes: typeMapToExpressionMap(pipeTypeByName, outputCtx), viewQueries: queriesFromGlobalMetadata(component.viewQueries, outputCtx) });
    var res = compileComponentFromMetadata(meta, outputCtx.constantPool, bindingParser);
    // Create the partial class to be merged with the actual class.
    outputCtx.statements.push(new o.ClassStmt(name, null, [new o.ClassField(definitionField, o.INFERRED_TYPE, [o.StmtModifier.Static], res.expression)], [], new o.ClassMethod(null, [], []), []));
}
exports.compileComponentFromRender2 = compileComponentFromRender2;
/**
 * Compute `R3DirectiveMetadata` given `CompileDirectiveMetadata` and a `CompileReflector`.
 */
function directiveMetadataFromGlobalMetadata(directive, outputCtx, reflector) {
    var summary = directive.toSummary();
    var name = compile_metadata_1.identifierName(directive.type);
    name || util_1.error("Cannot resolver the name of " + directive.type);
    return {
        name: name,
        type: outputCtx.importExpr(directive.type.reference),
        typeArgumentCount: 0,
        typeSourceSpan: parse_util_1.typeSourceSpan(directive.isComponent ? 'Component' : 'Directive', directive.type),
        selector: directive.selector,
        deps: r3_factory_1.dependenciesFromGlobalMetadata(directive.type, outputCtx, reflector),
        queries: queriesFromGlobalMetadata(directive.queries, outputCtx),
        lifecycle: {
            usesOnChanges: directive.type.lifecycleHooks.some(function (lifecycle) { return lifecycle == lifecycle_reflector_1.LifecycleHooks.OnChanges; }),
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
 */
function queriesFromGlobalMetadata(queries, outputCtx) {
    return queries.map(function (query) {
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
 */
function selectorsFromGlobalMetadata(selectors, outputCtx) {
    if (selectors.length > 1 || (selectors.length == 1 && selectors[0].value)) {
        var selectorStrings = selectors.map(function (value) { return value.value; });
        selectorStrings.some(function (value) { return !value; }) &&
            util_1.error('Found a type among the string selectors expected');
        return outputCtx.constantPool.getConstLiteral(o.literalArr(selectorStrings.map(function (value) { return o.literal(value); })));
    }
    if (selectors.length == 1) {
        var first = selectors[0];
        if (first.identifier) {
            return outputCtx.importExpr(first.identifier.reference);
        }
    }
    util_1.error('Unexpected query form');
    return o.NULL_EXPR;
}
function createQueryDefinition(query, constantPool, idx) {
    var predicate = util_3.getQueryPredicate(query, constantPool);
    // e.g. r3.Q(null, somePredicate, false) or r3.Q(0, ['div'], false)
    var parameters = [
        o.literal(idx, o.INFERRED_TYPE),
        predicate,
        o.literal(query.descendants),
    ];
    if (query.read) {
        parameters.push(query.read);
    }
    return o.importExpr(r3_identifiers_1.Identifiers.query).callFn(parameters);
}
// Turn a directive selector into an R3-compatible selector for directive def
function createDirectiveSelector(selector) {
    return util_3.asLiteral(core.parseSelectorToR3Selector(selector));
}
function createHostAttributesArray(meta) {
    var values = [];
    var attributes = meta.host.attributes;
    for (var _i = 0, _a = Object.getOwnPropertyNames(attributes); _i < _a.length; _i++) {
        var key = _a[_i];
        var value = attributes[key];
        values.push(o.literal(key), o.literal(value));
    }
    if (values.length > 0) {
        return o.literalArr(values);
    }
    return null;
}
// Return a contentQueries function or null if one is not necessary.
function createContentQueriesFunction(meta, constantPool) {
    if (meta.queries.length) {
        var statements = meta.queries.map(function (query) {
            var queryDefinition = createQueryDefinition(query, constantPool, null);
            return o.importExpr(r3_identifiers_1.Identifiers.registerContentQuery).callFn([queryDefinition]).toStmt();
        });
        var typeName = meta.name;
        return o.fn([], statements, o.INFERRED_TYPE, null, typeName ? typeName + "_ContentQueries" : null);
    }
    return null;
}
// Return a contentQueriesRefresh function or null if one is not necessary.
function createContentQueriesRefreshFunction(meta) {
    if (meta.queries.length > 0) {
        var statements_1 = [];
        var typeName = meta.name;
        var parameters = [
            new o.FnParam('dirIndex', o.NUMBER_TYPE),
            new o.FnParam('queryStartIndex', o.NUMBER_TYPE),
        ];
        var directiveInstanceVar_1 = o.variable('instance');
        // var $tmp$: any;
        var temporary_1 = util_3.temporaryAllocator(statements_1, util_3.TEMPORARY_NAME);
        // const $instance$ = $r3$.ɵd(dirIndex);
        statements_1.push(directiveInstanceVar_1.set(o.importExpr(r3_identifiers_1.Identifiers.loadDirective).callFn([o.variable('dirIndex')]))
            .toDeclStmt(o.INFERRED_TYPE, [o.StmtModifier.Final]));
        meta.queries.forEach(function (query, idx) {
            var loadQLArg = o.variable('queryStartIndex');
            var getQueryList = o.importExpr(r3_identifiers_1.Identifiers.loadQueryList).callFn([
                idx > 0 ? loadQLArg.plus(o.literal(idx)) : loadQLArg
            ]);
            var assignToTemporary = temporary_1().set(getQueryList);
            var callQueryRefresh = o.importExpr(r3_identifiers_1.Identifiers.queryRefresh).callFn([assignToTemporary]);
            var updateDirective = directiveInstanceVar_1.prop(query.propertyName)
                .set(query.first ? temporary_1().prop('first') : temporary_1());
            var refreshQueryAndUpdateDirective = callQueryRefresh.and(updateDirective);
            statements_1.push(refreshQueryAndUpdateDirective.toStmt());
        });
        return o.fn(parameters, statements_1, o.INFERRED_TYPE, null, typeName ? typeName + "_ContentQueriesRefresh" : null);
    }
    return null;
}
// Define and update any view queries
function createViewQueriesFunction(meta, constantPool) {
    var createStatements = [];
    var updateStatements = [];
    var tempAllocator = util_3.temporaryAllocator(updateStatements, util_3.TEMPORARY_NAME);
    for (var i = 0; i < meta.viewQueries.length; i++) {
        var query = meta.viewQueries[i];
        // creation, e.g. r3.Q(0, somePredicate, true);
        var queryDefinition = createQueryDefinition(query, constantPool, i);
        createStatements.push(queryDefinition.toStmt());
        // update, e.g. (r3.qR(tmp = r3.ɵld(0)) && (ctx.someDir = tmp));
        var temporary = tempAllocator();
        var getQueryList = o.importExpr(r3_identifiers_1.Identifiers.load).callFn([o.literal(i)]);
        var refresh = o.importExpr(r3_identifiers_1.Identifiers.queryRefresh).callFn([temporary.set(getQueryList)]);
        var updateDirective = o.variable(util_3.CONTEXT_NAME)
            .prop(query.propertyName)
            .set(query.first ? temporary.prop('first') : temporary);
        updateStatements.push(refresh.and(updateDirective).toStmt());
    }
    var viewQueryFnName = meta.name ? meta.name + "_Query" : null;
    return o.fn([new o.FnParam(util_3.RENDER_FLAGS, o.NUMBER_TYPE), new o.FnParam(util_3.CONTEXT_NAME, null)], [
        template_1.renderFlagCheckIfStmt(1 /* Create */, createStatements),
        template_1.renderFlagCheckIfStmt(2 /* Update */, updateStatements)
    ], o.INFERRED_TYPE, null, viewQueryFnName);
}
// Return a host binding function or null if one is not necessary.
function createHostBindingsFunction(meta, bindingParser) {
    var statements = [];
    var hostBindingSourceSpan = meta.typeSourceSpan;
    var directiveSummary = metadataAsSummary(meta);
    // Calculate the host property bindings
    var bindings = bindingParser.createBoundHostProperties(directiveSummary, hostBindingSourceSpan);
    var bindingContext = o.importExpr(r3_identifiers_1.Identifiers.loadDirective).callFn([o.variable('dirIndex')]);
    if (bindings) {
        for (var _i = 0, bindings_1 = bindings; _i < bindings_1.length; _i++) {
            var binding = bindings_1[_i];
            var bindingExpr = expression_converter_1.convertPropertyBinding(null, bindingContext, binding.expression, 'b', expression_converter_1.BindingForm.TrySimple, function () { return util_1.error('Unexpected interpolation'); });
            statements.push.apply(statements, bindingExpr.stmts);
            statements.push(o.importExpr(r3_identifiers_1.Identifiers.elementProperty)
                .callFn([
                o.variable('elIndex'),
                o.literal(binding.name),
                o.importExpr(r3_identifiers_1.Identifiers.bind).callFn([bindingExpr.currValExpr]),
            ])
                .toStmt());
        }
    }
    // Calculate host event bindings
    var eventBindings = bindingParser.createDirectiveHostEventAsts(directiveSummary, hostBindingSourceSpan);
    if (eventBindings) {
        for (var _a = 0, eventBindings_1 = eventBindings; _a < eventBindings_1.length; _a++) {
            var binding = eventBindings_1[_a];
            var bindingExpr = expression_converter_1.convertActionBinding(null, bindingContext, binding.handler, 'b', function () { return util_1.error('Unexpected interpolation'); });
            var bindingName = binding.name && compile_metadata_1.sanitizeIdentifier(binding.name);
            var typeName = meta.name;
            var functionName = typeName && bindingName ? typeName + "_" + bindingName + "_HostBindingHandler" : null;
            var handler = o.fn([new o.FnParam('$event', o.DYNAMIC_TYPE)], bindingExpr.stmts.concat([new o.ReturnStatement(bindingExpr.allowDefault)]), o.INFERRED_TYPE, null, functionName);
            statements.push(o.importExpr(r3_identifiers_1.Identifiers.listener).callFn([o.literal(binding.name), handler]).toStmt());
        }
    }
    if (statements.length > 0) {
        var typeName = meta.name;
        return o.fn([
            new o.FnParam('dirIndex', o.NUMBER_TYPE),
            new o.FnParam('elIndex', o.NUMBER_TYPE),
        ], statements, o.INFERRED_TYPE, null, typeName ? typeName + "_HostBindings" : null);
    }
    return null;
}
function metadataAsSummary(meta) {
    // clang-format off
    return {
        hostAttributes: meta.host.attributes,
        hostListeners: meta.host.listeners,
        hostProperties: meta.host.properties,
    };
    // clang-format on
}
function typeMapToExpressionMap(map, outputCtx) {
    // Convert each map entry into another entry where the value is an expression importing the type.
    var entries = Array.from(map).map(function (_a) {
        var key = _a[0], type = _a[1];
        return [key, outputCtx.importExpr(type)];
    });
    return new Map(entries);
}
var HOST_REG_EXP = /^(?:(?:\[([^\]]+)\])|(?:\(([^\)]+)\)))|(\@[-\w]+)$/;
function parseHostBindings(host) {
    var attributes = {};
    var listeners = {};
    var properties = {};
    var animations = {};
    Object.keys(host).forEach(function (key) {
        var value = host[key];
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
exports.parseHostBindings = parseHostBindings;
//# sourceMappingURL=compiler.js.map