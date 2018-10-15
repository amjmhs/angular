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
import * as html from '../ml_parser/ast';
import { replaceNgsp } from '../ml_parser/html_whitespaces';
import { isNgTemplate } from '../ml_parser/tags';
import { ParseError, ParseErrorLevel } from '../parse_util';
import { isStyleUrlResolvable } from '../style_url_resolver';
import { PreparsedElementType, preparseElement } from '../template_parser/template_preparser';
import { syntaxError } from '../util';
import * as t from './r3_ast';
/** @type {?} */
const BIND_NAME_REGEXP = /^(?:(?:(?:(bind-)|(let-)|(ref-|#)|(on-)|(bindon-)|(@))(.+))|\[\(([^\)]+)\)\]|\[([^\]]+)\]|\(([^\)]+)\))$/;
/** @type {?} */
const KW_BIND_IDX = 1;
/** @type {?} */
const KW_LET_IDX = 2;
/** @type {?} */
const KW_REF_IDX = 3;
/** @type {?} */
const KW_ON_IDX = 4;
/** @type {?} */
const KW_BINDON_IDX = 5;
/** @type {?} */
const KW_AT_IDX = 6;
/** @type {?} */
const IDENT_KW_IDX = 7;
/** @type {?} */
const IDENT_BANANA_BOX_IDX = 8;
/** @type {?} */
const IDENT_PROPERTY_IDX = 9;
/** @type {?} */
const IDENT_EVENT_IDX = 10;
/** @type {?} */
const TEMPLATE_ATTR_PREFIX = '*';
/** @type {?} */
const CLASS_ATTR = 'class';
/** @type {?} */
const DEFAULT_CONTENT_SELECTOR = '*';
/** @typedef {?} */
var Render3ParseResult;
export { Render3ParseResult };
/**
 * @param {?} htmlNodes
 * @param {?} bindingParser
 * @return {?}
 */
export function htmlAstToRender3Ast(htmlNodes, bindingParser) {
    /** @type {?} */
    const transformer = new HtmlAstToIvyAst(bindingParser);
    /** @type {?} */
    const ivyNodes = html.visitAll(transformer, htmlNodes);
    /** @type {?} */
    const allErrors = bindingParser.errors.concat(transformer.errors);
    /** @type {?} */
    const errors = allErrors.filter(e => e.level === ParseErrorLevel.ERROR);
    if (errors.length > 0) {
        /** @type {?} */
        const errorString = errors.join('\n');
        throw syntaxError(`Template parse errors:\n${errorString}`, errors);
    }
    return {
        nodes: ivyNodes,
        errors: allErrors,
        ngContentSelectors: transformer.ngContentSelectors,
        hasNgContent: transformer.hasNgContent,
    };
}
class HtmlAstToIvyAst {
    /**
     * @param {?} bindingParser
     */
    constructor(bindingParser) {
        this.bindingParser = bindingParser;
        this.errors = [];
        // Selectors for the `ng-content` tags. Only non `*` selectors are recorded here
        this.ngContentSelectors = [];
        // Any `<ng-content>` in the template ?
        this.hasNgContent = false;
    }
    /**
     * @param {?} element
     * @return {?}
     */
    visitElement(element) {
        /** @type {?} */
        const preparsedElement = preparseElement(element);
        if (preparsedElement.type === PreparsedElementType.SCRIPT ||
            preparsedElement.type === PreparsedElementType.STYLE) {
            // Skipping <script> for security reasons
            // Skipping <style> as we already processed them
            // in the StyleCompiler
            return null;
        }
        if (preparsedElement.type === PreparsedElementType.STYLESHEET &&
            isStyleUrlResolvable(preparsedElement.hrefAttr)) {
            // Skipping stylesheets with either relative urls or package scheme as we already processed
            // them in the StyleCompiler
            return null;
        }
        /** @type {?} */
        const isTemplateElement = isNgTemplate(element.name);
        /** @type {?} */
        const matchableAttributes = [];
        /** @type {?} */
        const parsedProperties = [];
        /** @type {?} */
        const boundEvents = [];
        /** @type {?} */
        const variables = [];
        /** @type {?} */
        const references = [];
        /** @type {?} */
        const attributes = [];
        /** @type {?} */
        const templateMatchableAttributes = [];
        /** @type {?} */
        let inlineTemplateSourceSpan;
        /** @type {?} */
        const templateParsedProperties = [];
        /** @type {?} */
        const templateVariables = [];
        /** @type {?} */
        let elementHasInlineTemplate = false;
        for (const attribute of element.attrs) {
            /** @type {?} */
            let hasBinding = false;
            /** @type {?} */
            const normalizedName = normalizeAttributeName(attribute.name);
            /** @type {?} */
            let isTemplateBinding = false;
            if (normalizedName.startsWith(TEMPLATE_ATTR_PREFIX)) {
                if (elementHasInlineTemplate) {
                    this.reportError(`Can't have multiple template bindings on one element. Use only one attribute prefixed with *`, attribute.sourceSpan);
                }
                isTemplateBinding = true;
                elementHasInlineTemplate = true;
                /** @type {?} */
                const templateValue = attribute.value;
                /** @type {?} */
                const templateKey = normalizedName.substring(TEMPLATE_ATTR_PREFIX.length);
                inlineTemplateSourceSpan = attribute.valueSpan || attribute.sourceSpan;
                /** @type {?} */
                const parsedVariables = [];
                this.bindingParser.parseInlineTemplateBinding(templateKey, templateValue, attribute.sourceSpan, templateMatchableAttributes, templateParsedProperties, parsedVariables);
                templateVariables.push(...parsedVariables.map(v => new t.Variable(v.name, v.value, v.sourceSpan)));
            }
            else {
                // Check for variables, events, property bindings, interpolation
                hasBinding = this.parseAttribute(isTemplateElement, attribute, matchableAttributes, parsedProperties, boundEvents, variables, references);
            }
            if (!hasBinding && !isTemplateBinding) {
                // don't include the bindings as attributes as well in the AST
                attributes.push(/** @type {?} */ (this.visitAttribute(attribute)));
                matchableAttributes.push([attribute.name, attribute.value]);
            }
        }
        /** @type {?} */
        const children = html.visitAll(preparsedElement.nonBindable ? NON_BINDABLE_VISITOR : this, element.children);
        /** @type {?} */
        let parsedElement;
        if (preparsedElement.type === PreparsedElementType.NG_CONTENT) {
            // `<ng-content>`
            this.hasNgContent = true;
            if (element.children && !element.children.every(isEmptyTextNode)) {
                this.reportError(`<ng-content> element cannot have content.`, element.sourceSpan);
            }
            /** @type {?} */
            const selector = preparsedElement.selectAttr;
            /** @type {?} */
            let attributes = element.attrs.map(attribute => {
                return new t.TextAttribute(attribute.name, attribute.value, attribute.sourceSpan, attribute.valueSpan);
            });
            /** @type {?} */
            const selectorIndex = selector === DEFAULT_CONTENT_SELECTOR ? 0 : this.ngContentSelectors.push(selector);
            parsedElement = new t.Content(selectorIndex, attributes, element.sourceSpan);
        }
        else if (isTemplateElement) {
            /** @type {?} */
            const boundAttributes = this.createBoundAttributes(element.name, parsedProperties);
            parsedElement = new t.Template(attributes, boundAttributes, children, references, variables, element.sourceSpan, element.startSourceSpan, element.endSourceSpan);
        }
        else {
            /** @type {?} */
            const boundAttributes = this.createBoundAttributes(element.name, parsedProperties);
            parsedElement = new t.Element(element.name, attributes, boundAttributes, boundEvents, children, references, element.sourceSpan, element.startSourceSpan, element.endSourceSpan);
        }
        if (elementHasInlineTemplate) {
            /** @type {?} */
            const attributes = [];
            templateMatchableAttributes.forEach(([name, value]) => attributes.push(new t.TextAttribute(name, value, inlineTemplateSourceSpan)));
            /** @type {?} */
            const boundAttributes = this.createBoundAttributes('ng-template', templateParsedProperties);
            parsedElement = new t.Template(attributes, boundAttributes, [parsedElement], [], templateVariables, element.sourceSpan, element.startSourceSpan, element.endSourceSpan);
        }
        return parsedElement;
    }
    /**
     * @param {?} attribute
     * @return {?}
     */
    visitAttribute(attribute) {
        return new t.TextAttribute(attribute.name, attribute.value, attribute.sourceSpan, attribute.valueSpan);
    }
    /**
     * @param {?} text
     * @return {?}
     */
    visitText(text) {
        /** @type {?} */
        const valueNoNgsp = replaceNgsp(text.value);
        /** @type {?} */
        const expr = this.bindingParser.parseInterpolation(valueNoNgsp, text.sourceSpan);
        return expr ? new t.BoundText(expr, text.sourceSpan) : new t.Text(valueNoNgsp, text.sourceSpan);
    }
    /**
     * @param {?} comment
     * @return {?}
     */
    visitComment(comment) { return null; }
    /**
     * @param {?} expansion
     * @return {?}
     */
    visitExpansion(expansion) { return null; }
    /**
     * @param {?} expansionCase
     * @return {?}
     */
    visitExpansionCase(expansionCase) { return null; }
    /**
     * @param {?} elementName
     * @param {?} properties
     * @return {?}
     */
    createBoundAttributes(elementName, properties) {
        return properties.filter(prop => !prop.isLiteral)
            .map(prop => this.bindingParser.createBoundElementProperty(elementName, prop))
            .map(prop => t.BoundAttribute.fromBoundElementProperty(prop));
    }
    /**
     * @param {?} isTemplateElement
     * @param {?} attribute
     * @param {?} matchableAttributes
     * @param {?} parsedProperties
     * @param {?} boundEvents
     * @param {?} variables
     * @param {?} references
     * @return {?}
     */
    parseAttribute(isTemplateElement, attribute, matchableAttributes, parsedProperties, boundEvents, variables, references) {
        /** @type {?} */
        const name = normalizeAttributeName(attribute.name);
        /** @type {?} */
        const value = attribute.value;
        /** @type {?} */
        const srcSpan = attribute.sourceSpan;
        /** @type {?} */
        const bindParts = name.match(BIND_NAME_REGEXP);
        /** @type {?} */
        let hasBinding = false;
        if (bindParts) {
            hasBinding = true;
            if (bindParts[KW_BIND_IDX] != null) {
                this.bindingParser.parsePropertyBinding(bindParts[IDENT_KW_IDX], value, false, srcSpan, matchableAttributes, parsedProperties);
            }
            else if (bindParts[KW_LET_IDX]) {
                if (isTemplateElement) {
                    /** @type {?} */
                    const identifier = bindParts[IDENT_KW_IDX];
                    this.parseVariable(identifier, value, srcSpan, variables);
                }
                else {
                    this.reportError(`"let-" is only supported on ng-template elements.`, srcSpan);
                }
            }
            else if (bindParts[KW_REF_IDX]) {
                /** @type {?} */
                const identifier = bindParts[IDENT_KW_IDX];
                this.parseReference(identifier, value, srcSpan, references);
            }
            else if (bindParts[KW_ON_IDX]) {
                /** @type {?} */
                const events = [];
                this.bindingParser.parseEvent(bindParts[IDENT_KW_IDX], value, srcSpan, matchableAttributes, events);
                addEvents(events, boundEvents);
            }
            else if (bindParts[KW_BINDON_IDX]) {
                this.bindingParser.parsePropertyBinding(bindParts[IDENT_KW_IDX], value, false, srcSpan, matchableAttributes, parsedProperties);
                this.parseAssignmentEvent(bindParts[IDENT_KW_IDX], value, srcSpan, matchableAttributes, boundEvents);
            }
            else if (bindParts[KW_AT_IDX]) {
                this.bindingParser.parseLiteralAttr(name, value, srcSpan, matchableAttributes, parsedProperties);
            }
            else if (bindParts[IDENT_BANANA_BOX_IDX]) {
                this.bindingParser.parsePropertyBinding(bindParts[IDENT_BANANA_BOX_IDX], value, false, srcSpan, matchableAttributes, parsedProperties);
                this.parseAssignmentEvent(bindParts[IDENT_BANANA_BOX_IDX], value, srcSpan, matchableAttributes, boundEvents);
            }
            else if (bindParts[IDENT_PROPERTY_IDX]) {
                this.bindingParser.parsePropertyBinding(bindParts[IDENT_PROPERTY_IDX], value, false, srcSpan, matchableAttributes, parsedProperties);
            }
            else if (bindParts[IDENT_EVENT_IDX]) {
                /** @type {?} */
                const events = [];
                this.bindingParser.parseEvent(bindParts[IDENT_EVENT_IDX], value, srcSpan, matchableAttributes, events);
                addEvents(events, boundEvents);
            }
        }
        else {
            hasBinding = this.bindingParser.parsePropertyInterpolation(name, value, srcSpan, matchableAttributes, parsedProperties);
        }
        return hasBinding;
    }
    /**
     * @param {?} identifier
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?} variables
     * @return {?}
     */
    parseVariable(identifier, value, sourceSpan, variables) {
        if (identifier.indexOf('-') > -1) {
            this.reportError(`"-" is not allowed in variable names`, sourceSpan);
        }
        variables.push(new t.Variable(identifier, value, sourceSpan));
    }
    /**
     * @param {?} identifier
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?} references
     * @return {?}
     */
    parseReference(identifier, value, sourceSpan, references) {
        if (identifier.indexOf('-') > -1) {
            this.reportError(`"-" is not allowed in reference names`, sourceSpan);
        }
        references.push(new t.Reference(identifier, value, sourceSpan));
    }
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} boundEvents
     * @return {?}
     */
    parseAssignmentEvent(name, expression, sourceSpan, targetMatchableAttrs, boundEvents) {
        /** @type {?} */
        const events = [];
        this.bindingParser.parseEvent(`${name}Change`, `${expression}=$event`, sourceSpan, targetMatchableAttrs, events);
        addEvents(events, boundEvents);
    }
    /**
     * @param {?} message
     * @param {?} sourceSpan
     * @param {?=} level
     * @return {?}
     */
    reportError(message, sourceSpan, level = ParseErrorLevel.ERROR) {
        this.errors.push(new ParseError(sourceSpan, message, level));
    }
}
if (false) {
    /** @type {?} */
    HtmlAstToIvyAst.prototype.errors;
    /** @type {?} */
    HtmlAstToIvyAst.prototype.ngContentSelectors;
    /** @type {?} */
    HtmlAstToIvyAst.prototype.hasNgContent;
    /** @type {?} */
    HtmlAstToIvyAst.prototype.bindingParser;
}
class NonBindableVisitor {
    /**
     * @param {?} ast
     * @return {?}
     */
    visitElement(ast) {
        /** @type {?} */
        const preparsedElement = preparseElement(ast);
        if (preparsedElement.type === PreparsedElementType.SCRIPT ||
            preparsedElement.type === PreparsedElementType.STYLE ||
            preparsedElement.type === PreparsedElementType.STYLESHEET) {
            // Skipping <script> for security reasons
            // Skipping <style> and stylesheets as we already processed them
            // in the StyleCompiler
            return null;
        }
        /** @type {?} */
        const children = html.visitAll(this, ast.children, null);
        return new t.Element(ast.name, /** @type {?} */ (html.visitAll(this, ast.attrs)), /* inputs */ [], /* outputs */ /* outputs */ [], children, /* references */ /* references */ [], ast.sourceSpan, ast.startSourceSpan, ast.endSourceSpan);
    }
    /**
     * @param {?} comment
     * @return {?}
     */
    visitComment(comment) { return null; }
    /**
     * @param {?} attribute
     * @return {?}
     */
    visitAttribute(attribute) {
        return new t.TextAttribute(attribute.name, attribute.value, attribute.sourceSpan);
    }
    /**
     * @param {?} text
     * @return {?}
     */
    visitText(text) { return new t.Text(text.value, text.sourceSpan); }
    /**
     * @param {?} expansion
     * @return {?}
     */
    visitExpansion(expansion) { return null; }
    /**
     * @param {?} expansionCase
     * @return {?}
     */
    visitExpansionCase(expansionCase) { return null; }
}
/** @type {?} */
const NON_BINDABLE_VISITOR = new NonBindableVisitor();
/**
 * @param {?} attrName
 * @return {?}
 */
function normalizeAttributeName(attrName) {
    return /^data-/i.test(attrName) ? attrName.substring(5) : attrName;
}
/**
 * @param {?} events
 * @param {?} boundEvents
 * @return {?}
 */
function addEvents(events, boundEvents) {
    boundEvents.push(...events.map(e => t.BoundEvent.fromParsedEvent(e)));
}
/**
 * @param {?} node
 * @return {?}
 */
function isEmptyTextNode(node) {
    return node instanceof html.Text && node.value.trim().length == 0;
}
//# sourceMappingURL=r3_template_transform.js.map