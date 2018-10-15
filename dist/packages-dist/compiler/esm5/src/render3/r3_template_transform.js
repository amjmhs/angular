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
var BIND_NAME_REGEXP = /^(?:(?:(?:(bind-)|(let-)|(ref-|#)|(on-)|(bindon-)|(@))(.+))|\[\(([^\)]+)\)\]|\[([^\]]+)\]|\(([^\)]+)\))$/;
/** @type {?} */
var KW_BIND_IDX = 1;
/** @type {?} */
var KW_LET_IDX = 2;
/** @type {?} */
var KW_REF_IDX = 3;
/** @type {?} */
var KW_ON_IDX = 4;
/** @type {?} */
var KW_BINDON_IDX = 5;
/** @type {?} */
var KW_AT_IDX = 6;
/** @type {?} */
var IDENT_KW_IDX = 7;
/** @type {?} */
var IDENT_BANANA_BOX_IDX = 8;
/** @type {?} */
var IDENT_PROPERTY_IDX = 9;
/** @type {?} */
var IDENT_EVENT_IDX = 10;
/** @type {?} */
var TEMPLATE_ATTR_PREFIX = '*';
/** @type {?} */
var CLASS_ATTR = 'class';
/** @type {?} */
var DEFAULT_CONTENT_SELECTOR = '*';
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
    var transformer = new HtmlAstToIvyAst(bindingParser);
    /** @type {?} */
    var ivyNodes = html.visitAll(transformer, htmlNodes);
    /** @type {?} */
    var allErrors = bindingParser.errors.concat(transformer.errors);
    /** @type {?} */
    var errors = allErrors.filter(function (e) { return e.level === ParseErrorLevel.ERROR; });
    if (errors.length > 0) {
        /** @type {?} */
        var errorString = errors.join('\n');
        throw syntaxError("Template parse errors:\n" + errorString, errors);
    }
    return {
        nodes: ivyNodes,
        errors: allErrors,
        ngContentSelectors: transformer.ngContentSelectors,
        hasNgContent: transformer.hasNgContent,
    };
}
var HtmlAstToIvyAst = /** @class */ (function () {
    function HtmlAstToIvyAst(bindingParser) {
        this.bindingParser = bindingParser;
        this.errors = [];
        // Selectors for the `ng-content` tags. Only non `*` selectors are recorded here
        this.ngContentSelectors = [];
        // Any `<ng-content>` in the template ?
        this.hasNgContent = false;
    }
    // HTML visitor
    /**
     * @param {?} element
     * @return {?}
     */
    HtmlAstToIvyAst.prototype.visitElement = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        /** @type {?} */
        var preparsedElement = preparseElement(element);
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
        var isTemplateElement = isNgTemplate(element.name);
        /** @type {?} */
        var matchableAttributes = [];
        /** @type {?} */
        var parsedProperties = [];
        /** @type {?} */
        var boundEvents = [];
        /** @type {?} */
        var variables = [];
        /** @type {?} */
        var references = [];
        /** @type {?} */
        var attributes = [];
        /** @type {?} */
        var templateMatchableAttributes = [];
        /** @type {?} */
        var inlineTemplateSourceSpan;
        /** @type {?} */
        var templateParsedProperties = [];
        /** @type {?} */
        var templateVariables = [];
        /** @type {?} */
        var elementHasInlineTemplate = false;
        for (var _i = 0, _a = element.attrs; _i < _a.length; _i++) {
            var attribute = _a[_i];
            /** @type {?} */
            var hasBinding = false;
            /** @type {?} */
            var normalizedName = normalizeAttributeName(attribute.name);
            /** @type {?} */
            var isTemplateBinding = false;
            if (normalizedName.startsWith(TEMPLATE_ATTR_PREFIX)) {
                if (elementHasInlineTemplate) {
                    this.reportError("Can't have multiple template bindings on one element. Use only one attribute prefixed with *", attribute.sourceSpan);
                }
                isTemplateBinding = true;
                elementHasInlineTemplate = true;
                /** @type {?} */
                var templateValue = attribute.value;
                /** @type {?} */
                var templateKey = normalizedName.substring(TEMPLATE_ATTR_PREFIX.length);
                inlineTemplateSourceSpan = attribute.valueSpan || attribute.sourceSpan;
                /** @type {?} */
                var parsedVariables = [];
                this.bindingParser.parseInlineTemplateBinding(templateKey, templateValue, attribute.sourceSpan, templateMatchableAttributes, templateParsedProperties, parsedVariables);
                templateVariables.push.apply(templateVariables, parsedVariables.map(function (v) { return new t.Variable(v.name, v.value, v.sourceSpan); }));
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
        var children = html.visitAll(preparsedElement.nonBindable ? NON_BINDABLE_VISITOR : this, element.children);
        /** @type {?} */
        var parsedElement;
        if (preparsedElement.type === PreparsedElementType.NG_CONTENT) {
            // `<ng-content>`
            this.hasNgContent = true;
            if (element.children && !element.children.every(isEmptyTextNode)) {
                this.reportError("<ng-content> element cannot have content.", element.sourceSpan);
            }
            /** @type {?} */
            var selector = preparsedElement.selectAttr;
            /** @type {?} */
            var attributes_1 = element.attrs.map(function (attribute) {
                return new t.TextAttribute(attribute.name, attribute.value, attribute.sourceSpan, attribute.valueSpan);
            });
            /** @type {?} */
            var selectorIndex = selector === DEFAULT_CONTENT_SELECTOR ? 0 : this.ngContentSelectors.push(selector);
            parsedElement = new t.Content(selectorIndex, attributes_1, element.sourceSpan);
        }
        else if (isTemplateElement) {
            /** @type {?} */
            var boundAttributes = this.createBoundAttributes(element.name, parsedProperties);
            parsedElement = new t.Template(attributes, boundAttributes, children, references, variables, element.sourceSpan, element.startSourceSpan, element.endSourceSpan);
        }
        else {
            /** @type {?} */
            var boundAttributes = this.createBoundAttributes(element.name, parsedProperties);
            parsedElement = new t.Element(element.name, attributes, boundAttributes, boundEvents, children, references, element.sourceSpan, element.startSourceSpan, element.endSourceSpan);
        }
        if (elementHasInlineTemplate) {
            /** @type {?} */
            var attributes_2 = [];
            templateMatchableAttributes.forEach(function (_a) {
                var name = _a[0], value = _a[1];
                return attributes_2.push(new t.TextAttribute(name, value, inlineTemplateSourceSpan));
            });
            /** @type {?} */
            var boundAttributes = this.createBoundAttributes('ng-template', templateParsedProperties);
            parsedElement = new t.Template(attributes_2, boundAttributes, [parsedElement], [], templateVariables, element.sourceSpan, element.startSourceSpan, element.endSourceSpan);
        }
        return parsedElement;
    };
    /**
     * @param {?} attribute
     * @return {?}
     */
    HtmlAstToIvyAst.prototype.visitAttribute = /**
     * @param {?} attribute
     * @return {?}
     */
    function (attribute) {
        return new t.TextAttribute(attribute.name, attribute.value, attribute.sourceSpan, attribute.valueSpan);
    };
    /**
     * @param {?} text
     * @return {?}
     */
    HtmlAstToIvyAst.prototype.visitText = /**
     * @param {?} text
     * @return {?}
     */
    function (text) {
        /** @type {?} */
        var valueNoNgsp = replaceNgsp(text.value);
        /** @type {?} */
        var expr = this.bindingParser.parseInterpolation(valueNoNgsp, text.sourceSpan);
        return expr ? new t.BoundText(expr, text.sourceSpan) : new t.Text(valueNoNgsp, text.sourceSpan);
    };
    /**
     * @param {?} comment
     * @return {?}
     */
    HtmlAstToIvyAst.prototype.visitComment = /**
     * @param {?} comment
     * @return {?}
     */
    function (comment) { return null; };
    /**
     * @param {?} expansion
     * @return {?}
     */
    HtmlAstToIvyAst.prototype.visitExpansion = /**
     * @param {?} expansion
     * @return {?}
     */
    function (expansion) { return null; };
    /**
     * @param {?} expansionCase
     * @return {?}
     */
    HtmlAstToIvyAst.prototype.visitExpansionCase = /**
     * @param {?} expansionCase
     * @return {?}
     */
    function (expansionCase) { return null; };
    /**
     * @param {?} elementName
     * @param {?} properties
     * @return {?}
     */
    HtmlAstToIvyAst.prototype.createBoundAttributes = /**
     * @param {?} elementName
     * @param {?} properties
     * @return {?}
     */
    function (elementName, properties) {
        var _this = this;
        return properties.filter(function (prop) { return !prop.isLiteral; })
            .map(function (prop) { return _this.bindingParser.createBoundElementProperty(elementName, prop); })
            .map(function (prop) { return t.BoundAttribute.fromBoundElementProperty(prop); });
    };
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
    HtmlAstToIvyAst.prototype.parseAttribute = /**
     * @param {?} isTemplateElement
     * @param {?} attribute
     * @param {?} matchableAttributes
     * @param {?} parsedProperties
     * @param {?} boundEvents
     * @param {?} variables
     * @param {?} references
     * @return {?}
     */
    function (isTemplateElement, attribute, matchableAttributes, parsedProperties, boundEvents, variables, references) {
        /** @type {?} */
        var name = normalizeAttributeName(attribute.name);
        /** @type {?} */
        var value = attribute.value;
        /** @type {?} */
        var srcSpan = attribute.sourceSpan;
        /** @type {?} */
        var bindParts = name.match(BIND_NAME_REGEXP);
        /** @type {?} */
        var hasBinding = false;
        if (bindParts) {
            hasBinding = true;
            if (bindParts[KW_BIND_IDX] != null) {
                this.bindingParser.parsePropertyBinding(bindParts[IDENT_KW_IDX], value, false, srcSpan, matchableAttributes, parsedProperties);
            }
            else if (bindParts[KW_LET_IDX]) {
                if (isTemplateElement) {
                    /** @type {?} */
                    var identifier = bindParts[IDENT_KW_IDX];
                    this.parseVariable(identifier, value, srcSpan, variables);
                }
                else {
                    this.reportError("\"let-\" is only supported on ng-template elements.", srcSpan);
                }
            }
            else if (bindParts[KW_REF_IDX]) {
                /** @type {?} */
                var identifier = bindParts[IDENT_KW_IDX];
                this.parseReference(identifier, value, srcSpan, references);
            }
            else if (bindParts[KW_ON_IDX]) {
                /** @type {?} */
                var events = [];
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
                var events = [];
                this.bindingParser.parseEvent(bindParts[IDENT_EVENT_IDX], value, srcSpan, matchableAttributes, events);
                addEvents(events, boundEvents);
            }
        }
        else {
            hasBinding = this.bindingParser.parsePropertyInterpolation(name, value, srcSpan, matchableAttributes, parsedProperties);
        }
        return hasBinding;
    };
    /**
     * @param {?} identifier
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?} variables
     * @return {?}
     */
    HtmlAstToIvyAst.prototype.parseVariable = /**
     * @param {?} identifier
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?} variables
     * @return {?}
     */
    function (identifier, value, sourceSpan, variables) {
        if (identifier.indexOf('-') > -1) {
            this.reportError("\"-\" is not allowed in variable names", sourceSpan);
        }
        variables.push(new t.Variable(identifier, value, sourceSpan));
    };
    /**
     * @param {?} identifier
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?} references
     * @return {?}
     */
    HtmlAstToIvyAst.prototype.parseReference = /**
     * @param {?} identifier
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?} references
     * @return {?}
     */
    function (identifier, value, sourceSpan, references) {
        if (identifier.indexOf('-') > -1) {
            this.reportError("\"-\" is not allowed in reference names", sourceSpan);
        }
        references.push(new t.Reference(identifier, value, sourceSpan));
    };
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} boundEvents
     * @return {?}
     */
    HtmlAstToIvyAst.prototype.parseAssignmentEvent = /**
     * @param {?} name
     * @param {?} expression
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} boundEvents
     * @return {?}
     */
    function (name, expression, sourceSpan, targetMatchableAttrs, boundEvents) {
        /** @type {?} */
        var events = [];
        this.bindingParser.parseEvent(name + "Change", expression + "=$event", sourceSpan, targetMatchableAttrs, events);
        addEvents(events, boundEvents);
    };
    /**
     * @param {?} message
     * @param {?} sourceSpan
     * @param {?=} level
     * @return {?}
     */
    HtmlAstToIvyAst.prototype.reportError = /**
     * @param {?} message
     * @param {?} sourceSpan
     * @param {?=} level
     * @return {?}
     */
    function (message, sourceSpan, level) {
        if (level === void 0) { level = ParseErrorLevel.ERROR; }
        this.errors.push(new ParseError(sourceSpan, message, level));
    };
    return HtmlAstToIvyAst;
}());
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
var NonBindableVisitor = /** @class */ (function () {
    function NonBindableVisitor() {
    }
    /**
     * @param {?} ast
     * @return {?}
     */
    NonBindableVisitor.prototype.visitElement = /**
     * @param {?} ast
     * @return {?}
     */
    function (ast) {
        /** @type {?} */
        var preparsedElement = preparseElement(ast);
        if (preparsedElement.type === PreparsedElementType.SCRIPT ||
            preparsedElement.type === PreparsedElementType.STYLE ||
            preparsedElement.type === PreparsedElementType.STYLESHEET) {
            // Skipping <script> for security reasons
            // Skipping <style> and stylesheets as we already processed them
            // in the StyleCompiler
            return null;
        }
        /** @type {?} */
        var children = html.visitAll(this, ast.children, null);
        return new t.Element(ast.name, /** @type {?} */ (html.visitAll(this, ast.attrs)), /* inputs */ [], /* outputs */ /* outputs */ [], children, /* references */ /* references */ [], ast.sourceSpan, ast.startSourceSpan, ast.endSourceSpan);
    };
    /**
     * @param {?} comment
     * @return {?}
     */
    NonBindableVisitor.prototype.visitComment = /**
     * @param {?} comment
     * @return {?}
     */
    function (comment) { return null; };
    /**
     * @param {?} attribute
     * @return {?}
     */
    NonBindableVisitor.prototype.visitAttribute = /**
     * @param {?} attribute
     * @return {?}
     */
    function (attribute) {
        return new t.TextAttribute(attribute.name, attribute.value, attribute.sourceSpan);
    };
    /**
     * @param {?} text
     * @return {?}
     */
    NonBindableVisitor.prototype.visitText = /**
     * @param {?} text
     * @return {?}
     */
    function (text) { return new t.Text(text.value, text.sourceSpan); };
    /**
     * @param {?} expansion
     * @return {?}
     */
    NonBindableVisitor.prototype.visitExpansion = /**
     * @param {?} expansion
     * @return {?}
     */
    function (expansion) { return null; };
    /**
     * @param {?} expansionCase
     * @return {?}
     */
    NonBindableVisitor.prototype.visitExpansionCase = /**
     * @param {?} expansionCase
     * @return {?}
     */
    function (expansionCase) { return null; };
    return NonBindableVisitor;
}());
/** @type {?} */
var NON_BINDABLE_VISITOR = new NonBindableVisitor();
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
    boundEvents.push.apply(boundEvents, events.map(function (e) { return t.BoundEvent.fromParsedEvent(e); }));
}
/**
 * @param {?} node
 * @return {?}
 */
function isEmptyTextNode(node) {
    return node instanceof html.Text && node.value.trim().length == 0;
}
//# sourceMappingURL=r3_template_transform.js.map