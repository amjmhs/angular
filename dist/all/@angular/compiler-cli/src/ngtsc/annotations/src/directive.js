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
var compiler_1 = require("@angular/compiler");
var ts = require("typescript");
var host_1 = require("../../host");
var metadata_1 = require("../../metadata");
var util_1 = require("./util");
var EMPTY_OBJECT = {};
var DirectiveDecoratorHandler = /** @class */ (function () {
    function DirectiveDecoratorHandler(checker, reflector, scopeRegistry, isCore) {
        this.checker = checker;
        this.reflector = reflector;
        this.scopeRegistry = scopeRegistry;
        this.isCore = isCore;
    }
    DirectiveDecoratorHandler.prototype.detect = function (decorators) {
        var _this = this;
        return decorators.find(function (decorator) { return decorator.name === 'Directive' && (_this.isCore || util_1.isAngularCore(decorator)); });
    };
    DirectiveDecoratorHandler.prototype.analyze = function (node, decorator) {
        var directiveResult = extractDirectiveMetadata(node, decorator, this.checker, this.reflector, this.isCore);
        var analysis = directiveResult && directiveResult.metadata;
        // If the directive has a selector, it should be registered with the `SelectorScopeRegistry` so
        // when this directive appears in an `@NgModule` scope, its selector can be determined.
        if (analysis && analysis.selector !== null) {
            this.scopeRegistry.registerSelector(node, analysis.selector);
        }
        return { analysis: analysis };
    };
    DirectiveDecoratorHandler.prototype.compile = function (node, analysis) {
        var pool = new compiler_1.ConstantPool();
        var res = compiler_1.compileDirectiveFromMetadata(analysis, pool, compiler_1.makeBindingParser());
        return {
            name: 'ngDirectiveDef',
            initializer: res.expression,
            statements: pool.statements,
            type: res.type,
        };
    };
    return DirectiveDecoratorHandler;
}());
exports.DirectiveDecoratorHandler = DirectiveDecoratorHandler;
/**
 * Helper function to extract metadata from a `Directive` or `Component`.
 */
function extractDirectiveMetadata(clazz, decorator, checker, reflector, isCore) {
    if (decorator.args === null || decorator.args.length !== 1) {
        throw new Error("Incorrect number of arguments to @" + decorator.name + " decorator");
    }
    var meta = util_1.unwrapExpression(decorator.args[0]);
    if (!ts.isObjectLiteralExpression(meta)) {
        throw new Error("Decorator argument must be literal.");
    }
    var directive = metadata_1.reflectObjectLiteral(meta);
    if (directive.has('jit')) {
        // The only allowed value is true, so there's no need to expand further.
        return undefined;
    }
    var members = reflector.getMembersOfClass(clazz);
    // Precompute a list of ts.ClassElements that have decorators. This includes things like @Input,
    // @Output, @HostBinding, etc.
    var decoratedElements = members.filter(function (member) { return !member.isStatic && member.decorators !== null; });
    var coreModule = isCore ? undefined : '@angular/core';
    // Construct the map of inputs both from the @Directive/@Component
    // decorator, and the decorated
    // fields.
    var inputsFromMeta = parseFieldToPropertyMapping(directive, 'inputs', reflector, checker);
    var inputsFromFields = parseDecoratedFields(metadata_1.filterToMembersWithDecorator(decoratedElements, 'Input', coreModule), reflector, checker);
    // And outputs.
    var outputsFromMeta = parseFieldToPropertyMapping(directive, 'outputs', reflector, checker);
    var outputsFromFields = parseDecoratedFields(metadata_1.filterToMembersWithDecorator(decoratedElements, 'Output', coreModule), reflector, checker);
    // Construct the list of queries.
    var contentChildFromFields = queriesFromFields(metadata_1.filterToMembersWithDecorator(decoratedElements, 'ContentChild', coreModule), reflector, checker);
    var contentChildrenFromFields = queriesFromFields(metadata_1.filterToMembersWithDecorator(decoratedElements, 'ContentChildren', coreModule), reflector, checker);
    var queries = contentChildFromFields.concat(contentChildrenFromFields);
    if (directive.has('queries')) {
        var queriesFromDecorator = extractQueriesFromDecorator(directive.get('queries'), reflector, checker, isCore);
        queries.push.apply(queries, queriesFromDecorator.content);
    }
    // Parse the selector.
    var selector = '';
    if (directive.has('selector')) {
        var resolved = metadata_1.staticallyResolve(directive.get('selector'), reflector, checker);
        if (typeof resolved !== 'string') {
            throw new Error("Selector must be a string");
        }
        selector = resolved;
    }
    var host = extractHostBindings(directive, decoratedElements, reflector, checker, coreModule);
    // Determine if `ngOnChanges` is a lifecycle hook defined on the component.
    var usesOnChanges = members.some(function (member) { return !member.isStatic && member.kind === host_1.ClassMemberKind.Method &&
        member.name === 'ngOnChanges'; });
    // Detect if the component inherits from another class
    var usesInheritance = clazz.heritageClauses !== undefined &&
        clazz.heritageClauses.some(function (hc) { return hc.token === ts.SyntaxKind.ExtendsKeyword; });
    var metadata = {
        name: clazz.name.text,
        deps: util_1.getConstructorDependencies(clazz, reflector, isCore), host: host,
        lifecycle: {
            usesOnChanges: usesOnChanges,
        },
        inputs: __assign({}, inputsFromMeta, inputsFromFields),
        outputs: __assign({}, outputsFromMeta, outputsFromFields), queries: queries, selector: selector,
        type: new compiler_1.WrappedNodeExpr(clazz.name),
        typeArgumentCount: (clazz.typeParameters || []).length,
        typeSourceSpan: null, usesInheritance: usesInheritance,
    };
    return { decoratedElements: decoratedElements, decorator: directive, metadata: metadata };
}
exports.extractDirectiveMetadata = extractDirectiveMetadata;
function extractQueryMetadata(name, args, propertyName, reflector, checker) {
    if (args.length === 0) {
        throw new Error("@" + name + " must have arguments");
    }
    var first = name === 'ViewChild' || name === 'ContentChild';
    var arg = metadata_1.staticallyResolve(args[0], reflector, checker);
    // Extract the predicate
    var predicate = null;
    if (arg instanceof metadata_1.Reference) {
        predicate = new compiler_1.WrappedNodeExpr(args[0]);
    }
    else if (typeof arg === 'string') {
        predicate = [arg];
    }
    else if (isStringArrayOrDie(arg, '@' + name)) {
        predicate = arg;
    }
    else {
        throw new Error("@" + name + " predicate cannot be interpreted");
    }
    // Extract the read and descendants options.
    var read = null;
    // The default value for descendants is true for every decorator except @ContentChildren.
    var descendants = name !== 'ContentChildren';
    if (args.length === 2) {
        var optionsExpr = util_1.unwrapExpression(args[1]);
        if (!ts.isObjectLiteralExpression(optionsExpr)) {
            throw new Error("@" + name + " options must be an object literal");
        }
        var options = metadata_1.reflectObjectLiteral(optionsExpr);
        if (options.has('read')) {
            read = new compiler_1.WrappedNodeExpr(options.get('read'));
        }
        if (options.has('descendants')) {
            var descendantsValue = metadata_1.staticallyResolve(options.get('descendants'), reflector, checker);
            if (typeof descendantsValue !== 'boolean') {
                throw new Error("@" + name + " options.descendants must be a boolean");
            }
            descendants = descendantsValue;
        }
    }
    else if (args.length > 2) {
        // Too many arguments.
        throw new Error("@" + name + " has too many arguments");
    }
    return {
        propertyName: propertyName, predicate: predicate, first: first, descendants: descendants, read: read,
    };
}
exports.extractQueryMetadata = extractQueryMetadata;
function extractQueriesFromDecorator(queryData, reflector, checker, isCore) {
    var content = [], view = [];
    var expr = util_1.unwrapExpression(queryData);
    if (!ts.isObjectLiteralExpression(queryData)) {
        throw new Error("queries metadata must be an object literal");
    }
    metadata_1.reflectObjectLiteral(queryData).forEach(function (queryExpr, propertyName) {
        queryExpr = util_1.unwrapExpression(queryExpr);
        if (!ts.isNewExpression(queryExpr) || !ts.isIdentifier(queryExpr.expression)) {
            throw new Error("query metadata must be an instance of a query type");
        }
        var type = reflector.getImportOfIdentifier(queryExpr.expression);
        if (type === null || (!isCore && type.from !== '@angular/core') ||
            !QUERY_TYPES.has(type.name)) {
            throw new Error("query metadata must be an instance of a query type");
        }
        var query = extractQueryMetadata(type.name, queryExpr.arguments || [], propertyName, reflector, checker);
        if (type.name.startsWith('Content')) {
            content.push(query);
        }
        else {
            view.push(query);
        }
    });
    return { content: content, view: view };
}
exports.extractQueriesFromDecorator = extractQueriesFromDecorator;
function isStringArrayOrDie(value, name) {
    if (!Array.isArray(value)) {
        return false;
    }
    for (var i = 0; i < value.length; i++) {
        if (typeof value[i] !== 'string') {
            throw new Error("Failed to resolve " + name + "[" + i + "] to a string");
        }
    }
    return true;
}
/**
 * Interpret property mapping fields on the decorator (e.g. inputs or outputs) and return the
 * correctly shaped metadata object.
 */
function parseFieldToPropertyMapping(directive, field, reflector, checker) {
    if (!directive.has(field)) {
        return EMPTY_OBJECT;
    }
    // Resolve the field of interest from the directive metadata to a string[].
    var metaValues = metadata_1.staticallyResolve(directive.get(field), reflector, checker);
    if (!isStringArrayOrDie(metaValues, field)) {
        throw new Error("Failed to resolve @Directive." + field);
    }
    return metaValues.reduce(function (results, value) {
        // Either the value is 'field' or 'field: property'. In the first case, `property` will
        // be undefined, in which case the field name should also be used as the property name.
        var _a = value.split(':', 2).map(function (str) { return str.trim(); }), field = _a[0], property = _a[1];
        results[field] = property || field;
        return results;
    }, {});
}
/**
 * Parse property decorators (e.g. `Input` or `Output`) and return the correctly shaped metadata
 * object.
 */
function parseDecoratedFields(fields, reflector, checker) {
    return fields.reduce(function (results, field) {
        var fieldName = field.member.name;
        field.decorators.forEach(function (decorator) {
            // The decorator either doesn't have an argument (@Input()) in which case the property
            // name is used, or it has one argument (@Output('named')).
            if (decorator.args == null || decorator.args.length === 0) {
                results[fieldName] = fieldName;
            }
            else if (decorator.args.length === 1) {
                var property = metadata_1.staticallyResolve(decorator.args[0], reflector, checker);
                if (typeof property !== 'string') {
                    throw new Error("Decorator argument must resolve to a string");
                }
                results[fieldName] = property;
            }
            else {
                // Too many arguments.
                throw new Error("Decorator must have 0 or 1 arguments, got " + decorator.args.length + " argument(s)");
            }
        });
        return results;
    }, {});
}
function queriesFromFields(fields, reflector, checker) {
    return fields.map(function (_a) {
        var member = _a.member, decorators = _a.decorators;
        if (decorators.length !== 1) {
            throw new Error("Cannot have multiple query decorators on the same class member");
        }
        else if (!isPropertyTypeMember(member)) {
            throw new Error("Query decorator must go on a property-type member");
        }
        var decorator = decorators[0];
        return extractQueryMetadata(decorator.name, decorator.args || [], member.name, reflector, checker);
    });
}
exports.queriesFromFields = queriesFromFields;
function isPropertyTypeMember(member) {
    return member.kind === host_1.ClassMemberKind.Getter || member.kind === host_1.ClassMemberKind.Setter ||
        member.kind === host_1.ClassMemberKind.Property;
}
function extractHostBindings(metadata, members, reflector, checker, coreModule) {
    var hostMetadata = {};
    if (metadata.has('host')) {
        var hostMetaMap = metadata_1.staticallyResolve(metadata.get('host'), reflector, checker);
        if (!(hostMetaMap instanceof Map)) {
            throw new Error("Decorator host metadata must be an object");
        }
        hostMetaMap.forEach(function (value, key) {
            if (typeof value !== 'string' || typeof key !== 'string') {
                throw new Error("Decorator host metadata must be a string -> string object, got " + value);
            }
            hostMetadata[key] = value;
        });
    }
    var _a = compiler_1.parseHostBindings(hostMetadata), attributes = _a.attributes, listeners = _a.listeners, properties = _a.properties, animations = _a.animations;
    metadata_1.filterToMembersWithDecorator(members, 'HostBinding', coreModule)
        .forEach(function (_a) {
        var member = _a.member, decorators = _a.decorators;
        decorators.forEach(function (decorator) {
            var hostPropertyName = member.name;
            if (decorator.args !== null && decorator.args.length > 0) {
                if (decorator.args.length !== 1) {
                    throw new Error("@HostBinding() can have at most one argument");
                }
                var resolved = metadata_1.staticallyResolve(decorator.args[0], reflector, checker);
                if (typeof resolved !== 'string') {
                    throw new Error("@HostBinding()'s argument must be a string");
                }
                hostPropertyName = resolved;
            }
            properties[hostPropertyName] = member.name;
        });
    });
    metadata_1.filterToMembersWithDecorator(members, 'HostListener', coreModule)
        .forEach(function (_a) {
        var member = _a.member, decorators = _a.decorators;
        decorators.forEach(function (decorator) {
            var eventName = member.name;
            var args = [];
            if (decorator.args !== null && decorator.args.length > 0) {
                if (decorator.args.length > 2) {
                    throw new Error("@HostListener() can have at most two arguments");
                }
                var resolved = metadata_1.staticallyResolve(decorator.args[0], reflector, checker);
                if (typeof resolved !== 'string') {
                    throw new Error("@HostListener()'s event name argument must be a string");
                }
                eventName = resolved;
                if (decorator.args.length === 2) {
                    var resolvedArgs = metadata_1.staticallyResolve(decorator.args[1], reflector, checker);
                    if (!isStringArrayOrDie(resolvedArgs, '@HostListener.args')) {
                        throw new Error("@HostListener second argument must be a string array");
                    }
                    args = resolvedArgs;
                }
            }
            listeners[eventName] = member.name + "(" + args.join(',') + ")";
        });
    });
    return { attributes: attributes, properties: properties, listeners: listeners };
}
var QUERY_TYPES = new Set([
    'ContentChild',
    'ContentChildren',
    'ViewChild',
    'ViewChildren',
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9hbm5vdGF0aW9ucy9zcmMvZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7QUFFSCw4Q0FBc0w7QUFDdEwsK0JBQWlDO0FBRWpDLG1DQUEyRjtBQUMzRiwyQ0FBZ0g7QUFJaEgsK0JBQW1GO0FBRW5GLElBQU0sWUFBWSxHQUE0QixFQUFFLENBQUM7QUFFakQ7SUFDRSxtQ0FDWSxPQUF1QixFQUFVLFNBQXlCLEVBQzFELGFBQW9DLEVBQVUsTUFBZTtRQUQ3RCxZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUFVLGNBQVMsR0FBVCxTQUFTLENBQWdCO1FBQzFELGtCQUFhLEdBQWIsYUFBYSxDQUF1QjtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVM7SUFBRyxDQUFDO0lBRTdFLDBDQUFNLEdBQU4sVUFBTyxVQUF1QjtRQUE5QixpQkFHQztRQUZDLE9BQU8sVUFBVSxDQUFDLElBQUksQ0FDbEIsVUFBQSxTQUFTLElBQUksT0FBQSxTQUFTLENBQUMsSUFBSSxLQUFLLFdBQVcsSUFBSSxDQUFDLEtBQUksQ0FBQyxNQUFNLElBQUksb0JBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUEzRSxDQUEyRSxDQUFDLENBQUM7SUFDaEcsQ0FBQztJQUVELDJDQUFPLEdBQVAsVUFBUSxJQUF5QixFQUFFLFNBQW9CO1FBQ3JELElBQU0sZUFBZSxHQUNqQix3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekYsSUFBTSxRQUFRLEdBQUcsZUFBZSxJQUFJLGVBQWUsQ0FBQyxRQUFRLENBQUM7UUFFN0QsK0ZBQStGO1FBQy9GLHVG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