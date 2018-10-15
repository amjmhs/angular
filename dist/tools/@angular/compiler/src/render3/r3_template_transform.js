"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var html = require("../ml_parser/ast");
var html_whitespaces_1 = require("../ml_parser/html_whitespaces");
var tags_1 = require("../ml_parser/tags");
var parse_util_1 = require("../parse_util");
var style_url_resolver_1 = require("../style_url_resolver");
var template_preparser_1 = require("../template_parser/template_preparser");
var util_1 = require("../util");
var t = require("./r3_ast");
var BIND_NAME_REGEXP = /^(?:(?:(?:(bind-)|(let-)|(ref-|#)|(on-)|(bindon-)|(@))(.+))|\[\(([^\)]+)\)\]|\[([^\]]+)\]|\(([^\)]+)\))$/;
// Group 1 = "bind-"
var KW_BIND_IDX = 1;
// Group 2 = "let-"
var KW_LET_IDX = 2;
// Group 3 = "ref-/#"
var KW_REF_IDX = 3;
// Group 4 = "on-"
var KW_ON_IDX = 4;
// Group 5 = "bindon-"
var KW_BINDON_IDX = 5;
// Group 6 = "@"
var KW_AT_IDX = 6;
// Group 7 = the identifier after "bind-", "let-", "ref-/#", "on-", "bindon-" or "@"
var IDENT_KW_IDX = 7;
// Group 8 = identifier inside [()]
var IDENT_BANANA_BOX_IDX = 8;
// Group 9 = identifier inside []
var IDENT_PROPERTY_IDX = 9;
// Group 10 = identifier inside ()
var IDENT_EVENT_IDX = 10;
var TEMPLATE_ATTR_PREFIX = '*';
var CLASS_ATTR = 'class';
// Default selector used by `<ng-content>` if none specified
var DEFAULT_CONTENT_SELECTOR = '*';
function htmlAstToRender3Ast(htmlNodes, bindingParser) {
    var transformer = new HtmlAstToIvyAst(bindingParser);
    var ivyNodes = html.visitAll(transformer, htmlNodes);
    // Errors might originate in either the binding parser or the html to ivy transformer
    var allErrors = bindingParser.errors.concat(transformer.errors);
    var errors = allErrors.filter(function (e) { return e.level === parse_util_1.ParseErrorLevel.ERROR; });
    if (errors.length > 0) {
        var errorString = errors.join('\n');
        throw util_1.syntaxError("Template parse errors:\n" + errorString, errors);
    }
    return {
        nodes: ivyNodes,
        errors: allErrors,
        ngContentSelectors: transformer.ngContentSelectors,
        hasNgContent: transformer.hasNgContent,
    };
}
exports.htmlAstToRender3Ast = htmlAstToRender3Ast;
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
    HtmlAstToIvyAst.prototype.visitElement = function (element) {
        var preparsedElement = template_preparser_1.preparseElement(element);
        if (preparsedElement.type === template_preparser_1.PreparsedElementType.SCRIPT ||
            preparsedElement.type === template_preparser_1.PreparsedElementType.STYLE) {
            // Skipping <script> for security reasons
            // Skipping <style> as we already processed them
            // in the StyleCompiler
            return null;
        }
        if (preparsedElement.type === template_preparser_1.PreparsedElementType.STYLESHEET &&
            style_url_resolver_1.isStyleUrlResolvable(preparsedElement.hrefAttr)) {
            // Skipping stylesheets with either relative urls or package scheme as we already processed
            // them in the StyleCompiler
            return null;
        }
        // Whether the element is a `<ng-template>`
        var isTemplateElement = tags_1.isNgTemplate(element.name);
        var matchableAttributes = [];
        var parsedProperties = [];
        var boundEvents = [];
        var variables = [];
        var references = [];
        var attributes = [];
        var templateMatchableAttributes = [];
        var inlineTemplateSourceSpan;
        var templateParsedProperties = [];
        var templateVariables = [];
        // Whether the element has any *-attribute
        var elementHasInlineTemplate = false;
        for (var _i = 0, _a = element.attrs; _i < _a.length; _i++) {
            var attribute = _a[_i];
            var hasBinding = false;
            var normalizedName = normalizeAttributeName(attribute.name);
            // `*attr` defines template bindings
            var isTemplateBinding = false;
            if (normalizedName.startsWith(TEMPLATE_ATTR_PREFIX)) {
                if (elementHasInlineTemplate) {
                    this.reportError("Can't have multiple template bindings on one element. Use only one attribute prefixed with *", attribute.sourceSpan);
                }
                isTemplateBinding = true;
                elementHasInlineTemplate = true;
                var templateValue = attribute.value;
                var templateKey = normalizedName.substring(TEMPLATE_ATTR_PREFIX.length);
                inlineTemplateSourceSpan = attribute.valueSpan || attribute.sourceSpan;
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
                attributes.push(this.visitAttribute(attribute));
                matchableAttributes.push([attribute.name, attribute.value]);
            }
        }
        var children = html.visitAll(preparsedElement.nonBindable ? NON_BINDABLE_VISITOR : this, element.children);
        var parsedElement;
        if (preparsedElement.type === template_preparser_1.PreparsedElementType.NG_CONTENT) {
            // `<ng-content>`
            this.hasNgContent = true;
            if (element.children && !element.children.every(isEmptyTextNode)) {
                this.reportError("<ng-content> element cannot have content.", element.sourceSpan);
            }
            var selector = preparsedElement.selectAttr;
            var attributes_1 = element.attrs.map(function (attribute) {
                return new t.TextAttribute(attribute.name, attribute.value, attribute.sourceSpan, attribute.valueSpan);
            });
            var selectorIndex = selector === DEFAULT_CONTENT_SELECTOR ? 0 : this.ngContentSelectors.push(selector);
            parsedElement = new t.Content(selectorIndex, attributes_1, element.sourceSpan);
        }
        else if (isTemplateElement) {
            // `<ng-template>`
            var boundAttributes = this.createBoundAttributes(element.name, parsedProperties);
            parsedElement = new t.Template(attributes, boundAttributes, children, references, variables, element.sourceSpan, element.startSourceSpan, element.endSourceSpan);
        }
        else {
            var boundAttributes = this.createBoundAttributes(element.name, parsedProperties);
            parsedElement = new t.Element(element.name, attributes, boundAttributes, boundEvents, children, references, element.sourceSpan, element.startSourceSpan, element.endSourceSpan);
        }
        if (elementHasInlineTemplate) {
            var attributes_2 = [];
            templateMatchableAttributes.forEach(function (_a) {
                var name = _a[0], value = _a[1];
                return attributes_2.push(new t.TextAttribute(name, value, inlineTemplateSourceSpan));
            });
            var boundAttributes = this.createBoundAttributes('ng-template', templateParsedProperties);
            parsedElement = new t.Template(attributes_2, boundAttributes, [parsedElement], [], templateVariables, element.sourceSpan, element.startSourceSpan, element.endSourceSpan);
        }
        return parsedElement;
    };
    HtmlAstToIvyAst.prototype.visitAttribute = function (attribute) {
        return new t.TextAttribute(attribute.name, attribute.value, attribute.sourceSpan, attribute.valueSpan);
    };
    HtmlAstToIvyAst.prototype.visitText = function (text) {
        var valueNoNgsp = html_whitespaces_1.replaceNgsp(text.value);
        var expr = this.bindingParser.parseInterpolation(valueNoNgsp, text.sourceSpan);
        return expr ? new t.BoundText(expr, text.sourceSpan) : new t.Text(valueNoNgsp, text.sourceSpan);
    };
    HtmlAstToIvyAst.prototype.visitComment = function (comment) { return null; };
    HtmlAstToIvyAst.prototype.visitExpansion = function (expansion) { return null; };
    HtmlAstToIvyAst.prototype.visitExpansionCase = function (expansionCase) { return null; };
    HtmlAstToIvyAst.prototype.createBoundAttributes = function (elementName, properties) {
        var _this = this;
        return properties.filter(function (prop) { return !prop.isLiteral; })
            .map(function (prop) { return _this.bindingParser.createBoundElementProperty(elementName, prop); })
            .map(function (prop) { return t.BoundAttribute.fromBoundElementProperty(prop); });
    };
    HtmlAstToIvyAst.prototype.parseAttribute = function (isTemplateElement, attribute, matchableAttributes, parsedProperties, boundEvents, variables, references) {
        var name = normalizeAttributeName(attribute.name);
        var value = attribute.value;
        var srcSpan = attribute.sourceSpan;
        var bindParts = name.match(BIND_NAME_REGEXP);
        var hasBinding = false;
        if (bindParts) {
            hasBinding = true;
            if (bindParts[KW_BIND_IDX] != null) {
                this.bindingParser.parsePropertyBinding(bindParts[IDENT_KW_IDX], value, false, srcSpan, matchableAttributes, parsedProperties);
            }
            else if (bindParts[KW_LET_IDX]) {
                if (isTemplateElement) {
                    var identifier = bindParts[IDENT_KW_IDX];
                    this.parseVariable(identifier, value, srcSpan, variables);
                }
                else {
                    this.reportError("\"let-\" is only supported on ng-template elements.", srcSpan);
                }
            }
            else if (bindParts[KW_REF_IDX]) {
                var identifier = bindParts[IDENT_KW_IDX];
                this.parseReference(identifier, value, srcSpan, references);
            }
            else if (bindParts[KW_ON_IDX]) {
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
    HtmlAstToIvyAst.prototype.parseVariable = function (identifier, value, sourceSpan, variables) {
        if (identifier.indexOf('-') > -1) {
            this.reportError("\"-\" is not allowed in variable names", sourceSpan);
        }
        variables.push(new t.Variable(identifier, value, sourceSpan));
    };
    HtmlAstToIvyAst.prototype.parseReference = function (identifier, value, sourceSpan, references) {
        if (identifier.indexOf('-') > -1) {
            this.reportError("\"-\" is not allowed in reference names", sourceSpan);
        }
        references.push(new t.Reference(identifier, value, sourceSpan));
    };
    HtmlAstToIvyAst.prototype.parseAssignmentEvent = function (name, expression, sourceSpan, targetMatchableAttrs, boundEvents) {
        var events = [];
        this.bindingParser.parseEvent(name + "Change", expression + "=$event", sourceSpan, targetMatchableAttrs, events);
        addEvents(events, boundEvents);
    };
    HtmlAstToIvyAst.prototype.reportError = function (message, sourceSpan, level) {
        if (level === void 0) { level = parse_util_1.ParseErrorLevel.ERROR; }
        this.errors.push(new parse_util_1.ParseError(sourceSpan, message, level));
    };
    return HtmlAstToIvyAst;
}());
var NonBindableVisitor = /** @class */ (function () {
    function NonBindableVisitor() {
    }
    NonBindableVisitor.prototype.visitElement = function (ast) {
        var preparsedElement = template_preparser_1.preparseElement(ast);
        if (preparsedElement.type === template_preparser_1.PreparsedElementType.SCRIPT ||
            preparsedElement.type === template_preparser_1.PreparsedElementType.STYLE ||
            preparsedElement.type === template_preparser_1.PreparsedElementType.STYLESHEET) {
            // Skipping <script> for security reasons
            // Skipping <style> and stylesheets as we already processed them
            // in the StyleCompiler
            return null;
        }
        var children = html.visitAll(this, ast.children, null);
        return new t.Element(ast.name, html.visitAll(this, ast.attrs), 
        /* inputs */ [], /* outputs */ [], children, /* references */ [], ast.sourceSpan, ast.startSourceSpan, ast.endSourceSpan);
    };
    NonBindableVisitor.prototype.visitComment = function (comment) { return null; };
    NonBindableVisitor.prototype.visitAttribute = function (attribute) {
        return new t.TextAttribute(attribute.name, attribute.value, attribute.sourceSpan);
    };
    NonBindableVisitor.prototype.visitText = function (text) { return new t.Text(text.value, text.sourceSpan); };
    NonBindableVisitor.prototype.visitExpansion = function (expansion) { return null; };
    NonBindableVisitor.prototype.visitExpansionCase = function (expansionCase) { return null; };
    return NonBindableVisitor;
}());
var NON_BINDABLE_VISITOR = new NonBindableVisitor();
function normalizeAttributeName(attrName) {
    return /^data-/i.test(attrName) ? attrName.substring(5) : attrName;
}
function addEvents(events, boundEvents) {
    boundEvents.push.apply(boundEvents, events.map(function (e) { return t.BoundEvent.fromParsedEvent(e); }));
}
function isEmptyTextNode(node) {
    return node instanceof html.Text && node.value.trim().length == 0;
}
//# sourceMappingURL=r3_template_transform.js.map