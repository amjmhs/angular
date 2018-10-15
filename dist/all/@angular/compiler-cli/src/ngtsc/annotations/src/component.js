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
var path = require("path");
var ts = require("typescript");
var metadata_1 = require("../../metadata");
var directive_1 = require("./directive");
var util_1 = require("./util");
var EMPTY_MAP = new Map();
/**
 * `DecoratorHandler` which handles the `@Component` annotation.
 */
var ComponentDecoratorHandler = /** @class */ (function () {
    function ComponentDecoratorHandler(checker, reflector, scopeRegistry, isCore, resourceLoader) {
        this.checker = checker;
        this.reflector = reflector;
        this.scopeRegistry = scopeRegistry;
        this.isCore = isCore;
        this.resourceLoader = resourceLoader;
        this.literalCache = new Map();
    }
    ComponentDecoratorHandler.prototype.detect = function (decorators) {
        var _this = this;
        return decorators.find(function (decorator) { return decorator.name === 'Component' && (_this.isCore || util_1.isAngularCore(decorator)); });
    };
    ComponentDecoratorHandler.prototype.preanalyze = function (node, decorator) {
        var meta = this._resolveLiteral(decorator);
        var component = metadata_1.reflectObjectLiteral(meta);
        if (this.resourceLoader.preload !== undefined && component.has('templateUrl')) {
            var templateUrl = metadata_1.staticallyResolve(component.get('templateUrl'), this.reflector, this.checker);
            if (typeof templateUrl !== 'string') {
                throw new Error("templateUrl should be a string");
            }
            var url = path.posix.resolve(path.dirname(node.getSourceFile().fileName), templateUrl);
            return this.resourceLoader.preload(url);
        }
        return undefined;
    };
    ComponentDecoratorHandler.prototype.analyze = function (node, decorator) {
        var meta = this._resolveLiteral(decorator);
        this.literalCache.delete(decorator);
        // @Component inherits @Directive, so begin by extracting the @Directive metadata and building
        // on it.
        var directiveResult = directive_1.extractDirectiveMetadata(node, decorator, this.checker, this.reflector, this.isCore);
        if (directiveResult === undefined) {
            // `extractDirectiveMetadata` returns undefined when the @Directive has `jit: true`. In this
            // case, compilation of the decorator is skipped. Returning an empty object signifies
            // that no analysis was produced.
            return {};
        }
        // Next, read the `@Component`-specific fields.
        var decoratedElements = directiveResult.decoratedElements, component = directiveResult.decorator, metadata = directiveResult.metadata;
        var templateStr = null;
        if (component.has('templateUrl')) {
            var templateUrl = metadata_1.staticallyResolve(component.get('templateUrl'), this.reflector, this.checker);
            if (typeof templateUrl !== 'string') {
                throw new Error("templateUrl should be a string");
            }
            var url = path.posix.resolve(path.dirname(node.getSourceFile().fileName), templateUrl);
            templateStr = this.resourceLoader.load(url);
        }
        else if (component.has('template')) {
            var templateExpr = component.get('template');
            var resolvedTemplate = metadata_1.staticallyResolve(templateExpr, this.reflector, this.checker);
            if (typeof resolvedTemplate !== 'string') {
                throw new Error("Template must statically resolve to a string: " + node.name.text);
            }
            templateStr = resolvedTemplate;
        }
        else {
            throw new Error("Component has no template or templateUrl");
        }
        var preserveWhitespaces = false;
        if (component.has('preserveWhitespaces')) {
            var value = metadata_1.staticallyResolve(component.get('preserveWhitespaces'), this.reflector, this.checker);
            if (typeof value !== 'boolean') {
                throw new Error("preserveWhitespaces must resolve to a boolean if present");
            }
            preserveWhitespaces = value;
        }
        var template = compiler_1.parseTemplate(templateStr, node.getSourceFile().fileName + "#" + node.name.text + "/template.html", { preserveWhitespaces: preserveWhitespaces });
        if (template.errors !== undefined) {
            throw new Error("Errors parsing template: " + template.errors.map(function (e) { return e.toString(); }).join(', '));
        }
        // If the component has a selector, it should be registered with the `SelectorScopeRegistry` so
        // when this component appears in an `@NgModule` scope, its selector can be determined.
        if (metadata.selector !== null) {
            this.scopeRegistry.registerSelector(node, metadata.selector);
        }
        // Construct the list of view queries.
        var coreModule = this.isCore ? undefined : '@angular/core';
        var viewChildFromFields = directive_1.queriesFromFields(metadata_1.filterToMembersWithDecorator(decoratedElements, 'ViewChild', coreModule), this.reflector, this.checker);
        var viewChildrenFromFields = directive_1.queriesFromFields(metadata_1.filterToMembersWithDecorator(decoratedElements, 'ViewChildren', coreModule), this.reflector, this.checker);
        var viewQueries = viewChildFromFields.concat(viewChildrenFromFields);
        if (component.has('queries')) {
            var queriesFromDecorator = directive_1.extractQueriesFromDecorator(component.get('queries'), this.reflector, this.checker, this.isCore);
            viewQueries.push.apply(viewQueries, queriesFromDecorator.view);
        }
        return {
            analysis: __assign({}, metadata, { template: template,
                viewQueries: viewQueries, 
                // These will be replaced during the compilation step, after all `NgModule`s have been
                // analyzed and the full compilation scope for the component can be realized.
                pipes: EMPTY_MAP, directives: EMPTY_MAP })
        };
    };
    ComponentDecoratorHandler.prototype.compile = function (node, analysis) {
        var pool = new compiler_1.ConstantPool();
        // Check whether this component was registered with an NgModule. If so, it should be compiled
        // under that module's compilation scope.
        var scope = this.scopeRegistry.lookupCompilationScope(node);
        if (scope !== null) {
            // Replace the empty components and directives from the analyze() step with a fully expanded
            // scope. This is possible now because during compile() the whole compilation unit has been
            // fully analyzed.
            analysis = __assign({}, analysis, scope);
        }
        var res = compiler_1.compileComponentFromMetadata(analysis, pool, compiler_1.makeBindingParser());
        return {
            name: 'ngComponentDef',
            initializer: res.expression,
            statements: pool.statements,
            type: res.type,
        };
    };
    ComponentDecoratorHandler.prototype._resolveLiteral = function (decorator) {
        if (this.literalCache.has(decorator)) {
            return this.literalCache.get(decorator);
        }
        if (decorator.args === null || decorator.args.length !== 1) {
            throw new Error("Incorrect number of arguments to @Component decorator");
        }
        var meta = util_1.unwrapExpression(decorator.args[0]);
        if (!ts.isObjectLiteralExpression(meta)) {
            throw new Error("Decorator argument must be literal.");
        }
        this.literalCache.set(decorator, meta);
        return meta;
    };
    return ComponentDecoratorHandler;
}());
exports.ComponentDecoratorHandler = ComponentDecoratorHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9hbm5vdGF0aW9ucy9zcmMvY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7QUFFSCw4Q0FBc0w7QUFDdEwsMkJBQTZCO0FBQzdCLCtCQUFpQztBQUdqQywyQ0FBcUc7QUFJckcseUNBQXFHO0FBRXJHLCtCQUF1RDtBQUV2RCxJQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBc0IsQ0FBQztBQUVoRDs7R0FFRztBQUNIO0lBQ0UsbUNBQ1ksT0FBdUIsRUFBVSxTQUF5QixFQUMxRCxhQUFvQyxFQUFVLE1BQWUsRUFDN0QsY0FBOEI7UUFGOUIsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFnQjtRQUMxRCxrQkFBYSxHQUFiLGFBQWEsQ0FBdUI7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFTO1FBQzdELG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUVsQyxpQkFBWSxHQUFHLElBQUksR0FBRyxFQUF5QyxDQUFDO0lBRjNCLENBQUM7SUFLOUMsMENBQU0sR0FBTixVQUFPLFVBQXVCO1FBQTlCLGlCQUdDO1FBRkMsT0FBTyxVQUFVLENBQUMsSUFBSSxDQUNsQixVQUFBLFNBQVMsSUFBSSxPQUFBLFNBQVMsQ0FBQyxJQUFJLEtBQUssV0FBVyxJQUFJLENBQUMsS0FBSSxDQUFDLE1BQU0sSUFBSSxvQkFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQTNFLENBQTJFLENBQUMsQ0FBQztJQUNoRyxDQUFDO0lBRUQsOENBQVUsR0FBVixVQUFXLElBQXlCLEVBQUUsU0FBb0I7UUFDeEQsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM3QyxJQUFNLFNBQVMsR0FBRywr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