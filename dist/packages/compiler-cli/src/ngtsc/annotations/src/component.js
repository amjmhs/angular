"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const compiler_1 = require("@angular/compiler");
const path = require("path");
const ts = require("typescript");
const metadata_1 = require("../../metadata");
const directive_1 = require("./directive");
const util_1 = require("./util");
const EMPTY_MAP = new Map();
/**
 * `DecoratorHandler` which handles the `@Component` annotation.
 */
class ComponentDecoratorHandler {
    constructor(checker, reflector, scopeRegistry, isCore, resourceLoader) {
        this.checker = checker;
        this.reflector = reflector;
        this.scopeRegistry = scopeRegistry;
        this.isCore = isCore;
        this.resourceLoader = resourceLoader;
        this.literalCache = new Map();
    }
    detect(decorators) {
        return decorators.find(decorator => decorator.name === 'Component' && (this.isCore || util_1.isAngularCore(decorator)));
    }
    preanalyze(node, decorator) {
        const meta = this._resolveLiteral(decorator);
        const component = metadata_1.reflectObjectLiteral(meta);
        if (this.resourceLoader.preload !== undefined && component.has('templateUrl')) {
            const templateUrl = metadata_1.staticallyResolve(component.get('templateUrl'), this.reflector, this.checker);
            if (typeof templateUrl !== 'string') {
                throw new Error(`templateUrl should be a string`);
            }
            const url = path.posix.resolve(path.dirname(node.getSourceFile().fileName), templateUrl);
            return this.resourceLoader.preload(url);
        }
        return undefined;
    }
    analyze(node, decorator) {
        const meta = this._resolveLiteral(decorator);
        this.literalCache.delete(decorator);
        // @Component inherits @Directive, so begin by extracting the @Directive metadata and building
        // on it.
        const directiveResult = directive_1.extractDirectiveMetadata(node, decorator, this.checker, this.reflector, this.isCore);
        if (directiveResult === undefined) {
            // `extractDirectiveMetadata` returns undefined when the @Directive has `jit: true`. In this
            // case, compilation of the decorator is skipped. Returning an empty object signifies
            // that no analysis was produced.
            return {};
        }
        // Next, read the `@Component`-specific fields.
        const { decoratedElements, decorator: component, metadata } = directiveResult;
        let templateStr = null;
        if (component.has('templateUrl')) {
            const templateUrl = metadata_1.staticallyResolve(component.get('templateUrl'), this.reflector, this.checker);
            if (typeof templateUrl !== 'string') {
                throw new Error(`templateUrl should be a string`);
            }
            const url = path.posix.resolve(path.dirname(node.getSourceFile().fileName), templateUrl);
            templateStr = this.resourceLoader.load(url);
        }
        else if (component.has('template')) {
            const templateExpr = component.get('template');
            const resolvedTemplate = metadata_1.staticallyResolve(templateExpr, this.reflector, this.checker);
            if (typeof resolvedTemplate !== 'string') {
                throw new Error(`Template must statically resolve to a string: ${node.name.text}`);
            }
            templateStr = resolvedTemplate;
        }
        else {
            throw new Error(`Component has no template or templateUrl`);
        }
        let preserveWhitespaces = false;
        if (component.has('preserveWhitespaces')) {
            const value = metadata_1.staticallyResolve(component.get('preserveWhitespaces'), this.reflector, this.checker);
            if (typeof value !== 'boolean') {
                throw new Error(`preserveWhitespaces must resolve to a boolean if present`);
            }
            preserveWhitespaces = value;
        }
        const template = compiler_1.parseTemplate(templateStr, `${node.getSourceFile().fileName}#${node.name.text}/template.html`, { preserveWhitespaces });
        if (template.errors !== undefined) {
            throw new Error(`Errors parsing template: ${template.errors.map(e => e.toString()).join(', ')}`);
        }
        // If the component has a selector, it should be registered with the `SelectorScopeRegistry` so
        // when this component appears in an `@NgModule` scope, its selector can be determined.
        if (metadata.selector !== null) {
            this.scopeRegistry.registerSelector(node, metadata.selector);
        }
        // Construct the list of view queries.
        const coreModule = this.isCore ? undefined : '@angular/core';
        const viewChildFromFields = directive_1.queriesFromFields(metadata_1.filterToMembersWithDecorator(decoratedElements, 'ViewChild', coreModule), this.reflector, this.checker);
        const viewChildrenFromFields = directive_1.queriesFromFields(metadata_1.filterToMembersWithDecorator(decoratedElements, 'ViewChildren', coreModule), this.reflector, this.checker);
        const viewQueries = [...viewChildFromFields, ...viewChildrenFromFields];
        if (component.has('queries')) {
            const queriesFromDecorator = directive_1.extractQueriesFromDecorator(component.get('queries'), this.reflector, this.checker, this.isCore);
            viewQueries.push(...queriesFromDecorator.view);
        }
        return {
            analysis: Object.assign({}, metadata, { template,
                viewQueries, 
                // These will be replaced during the compilation step, after all `NgModule`s have been
                // analyzed and the full compilation scope for the component can be realized.
                pipes: EMPTY_MAP, directives: EMPTY_MAP })
        };
    }
    compile(node, analysis) {
        const pool = new compiler_1.ConstantPool();
        // Check whether this component was registered with an NgModule. If so, it should be compiled
        // under that module's compilation scope.
        const scope = this.scopeRegistry.lookupCompilationScope(node);
        if (scope !== null) {
            // Replace the empty components and directives from the analyze() step with a fully expanded
            // scope. This is possible now because during compile() the whole compilation unit has been
            // fully analyzed.
            analysis = Object.assign({}, analysis, scope);
        }
        const res = compiler_1.compileComponentFromMetadata(analysis, pool, compiler_1.makeBindingParser());
        return {
            name: 'ngComponentDef',
            initializer: res.expression,
            statements: pool.statements,
            type: res.type,
        };
    }
    _resolveLiteral(decorator) {
        if (this.literalCache.has(decorator)) {
            return this.literalCache.get(decorator);
        }
        if (decorator.args === null || decorator.args.length !== 1) {
            throw new Error(`Incorrect number of arguments to @Component decorator`);
        }
        const meta = util_1.unwrapExpression(decorator.args[0]);
        if (!ts.isObjectLiteralExpression(meta)) {
            throw new Error(`Decorator argument must be literal.`);
        }
        this.literalCache.set(decorator, meta);
        return meta;
    }
}
exports.ComponentDecoratorHandler = ComponentDecoratorHandler;
//# sourceMappingURL=component.js.map