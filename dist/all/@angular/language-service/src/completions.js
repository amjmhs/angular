"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var language_services_1 = require("@angular/compiler-cli/src/language_services");
var expressions_1 = require("./expressions");
var html_info_1 = require("./html_info");
var utils_1 = require("./utils");
var TEMPLATE_ATTR_PREFIX = '*';
var hiddenHtmlElements = {
    html: true,
    script: true,
    noscript: true,
    base: true,
    body: true,
    title: true,
    head: true,
    link: true,
};
function getTemplateCompletions(templateInfo) {
    var result = undefined;
    var htmlAst = templateInfo.htmlAst, templateAst = templateInfo.templateAst, template = templateInfo.template;
    // The templateNode starts at the delimiter character so we add 1 to skip it.
    if (templateInfo.position != null) {
        var templatePosition_1 = templateInfo.position - template.span.start;
        var path_1 = compiler_1.findNode(htmlAst, templatePosition_1);
        var mostSpecific = path_1.tail;
        if (path_1.empty || !mostSpecific) {
            result = elementCompletions(templateInfo, path_1);
        }
        else {
            var astPosition_1 = templatePosition_1 - mostSpecific.sourceSpan.start.offset;
            mostSpecific.visit({
                visitElement: function (ast) {
                    var startTagSpan = utils_1.spanOf(ast.sourceSpan);
                    var tagLen = ast.name.length;
                    if (templatePosition_1 <=
                        startTagSpan.start + tagLen + 1 /* 1 for the opening angle bracked */) {
                        // If we are in the tag then return the element completions.
                        result = elementCompletions(templateInfo, path_1);
                    }
                    else if (templatePosition_1 < startTagSpan.end) {
                        // We are in the attribute section of the element (but not in an attribute).
                        // Return the attribute completions.
                        result = attributeCompletions(templateInfo, path_1);
                    }
                },
                visitAttribute: function (ast) {
                    if (!ast.valueSpan || !utils_1.inSpan(templatePosition_1, utils_1.spanOf(ast.valueSpan))) {
                        // We are in the name of an attribute. Show attribute completions.
                        result = attributeCompletions(templateInfo, path_1);
                    }
                    else if (ast.valueSpan && utils_1.inSpan(templatePosition_1, utils_1.spanOf(ast.valueSpan))) {
                        result = attributeValueCompletions(templateInfo, templatePosition_1, ast);
                    }
                },
                visitText: function (ast) {
                    // Check if we are in a entity.
                    result = entityCompletions(getSourceText(template, utils_1.spanOf(ast)), astPosition_1);
                    if (result)
                        return result;
                    result = interpolationCompletions(templateInfo, templatePosition_1);
                    if (result)
                        return result;
                    var element = path_1.first(compiler_1.Element);
                    if (element) {
                        var definition = compiler_1.getHtmlTagDefinition(element.name);
                        if (definition.contentType === compiler_1.TagContentType.PARSABLE_DATA) {
                            result = voidElementAttributeCompletions(templateInfo, path_1);
                            if (!result) {
                                // If the element can hold content Show element completions.
                                result = elementCompletions(templateInfo, path_1);
                            }
                        }
                    }
                    else {
                        // If no element container, implies parsable data so show elements.
                        result = voidElementAttributeCompletions(templateInfo, path_1);
                        if (!result) {
                            result = elementCompletions(templateInfo, path_1);
                        }
                    }
                },
                visitComment: function (ast) { },
                visitExpansion: function (ast) { },
                visitExpansionCase: function (ast) { }
            }, null);
        }
    }
    return result;
}
exports.getTemplateCompletions = getTemplateCompletions;
function attributeCompletions(info, path) {
    var item = path.tail instanceof compiler_1.Element ? path.tail : path.parentOf(path.tail);
    if (item instanceof compiler_1.Element) {
        return attributeCompletionsForElement(info, item.name, item);
    }
    return undefined;
}
function attributeCompletionsForElement(info, elementName, element) {
    var attributes = getAttributeInfosForElement(info, elementName, element);
    // Map all the attributes to a completion
    return attributes.map(function (attr) { return ({
        kind: attr.fromHtml ? 'html attribute' : 'attribute',
        name: nameOfAttr(attr),
        sort: attr.name
    }); });
}
function getAttributeInfosForElement(info, elementName, element) {
    var attributes = [];
    // Add html attributes
    var htmlAttributes = html_info_1.attributeNames(elementName) || [];
    if (htmlAttributes) {
        attributes.push.apply(attributes, htmlAttributes.map(function (name) { return ({ name: name, fromHtml: true }); }));
    }
    // Add html properties
    var htmlProperties = html_info_1.propertyNames(elementName);
    if (htmlProperties) {
        attributes.push.apply(attributes, htmlProperties.map(function (name) { return ({ name: name, input: true }); }));
    }
    // Add html events
    var htmlEvents = html_info_1.eventNames(elementName);
    if (htmlEvents) {
        attributes.push.apply(attributes, htmlEvents.map(function (name) { return ({ name: name, output: true }); }));
    }
    var _a = utils_1.getSelectors(info), selectors = _a.selectors, selectorMap = _a.map;
    if (selectors && selectors.length) {
        // All the attributes that are selectable should be shown.
        var applicableSelectors = selectors.filter(function (selector) { return !selector.element || selector.element == elementName; });
        var selectorAndAttributeNames = applicableSelectors.map(function (selector) { return ({ selector: selector, attrs: selector.attrs.filter(function (a) { return !!a; }) }); });
        var attrs_1 = utils_1.flatten(selectorAndAttributeNames.map(function (selectorAndAttr) {
            var directive = selectorMap.get(selectorAndAttr.selector);
            var result = selectorAndAttr.attrs.map(function (name) { return ({ name: name, input: name in directive.inputs, output: name in directive.outputs }); });
            return result;
        }));
        // Add template attribute if a directive contains a template reference
        selectorAndAttributeNames.forEach(function (selectorAndAttr) {
            var selector = selectorAndAttr.selector;
            var directive = selectorMap.get(selector);
            if (directive && utils_1.hasTemplateReference(directive.type) && selector.attrs.length &&
                selector.attrs[0]) {
                attrs_1.push({ name: selector.attrs[0], template: true });
            }
        });
        // All input and output properties of the matching directives should be added.
        var elementSelector = element ?
            createElementCssSelector(element) :
            createElementCssSelector(new compiler_1.Element(elementName, [], [], null, null, null));
        var matcher = new compiler_1.SelectorMatcher();
        matcher.addSelectables(selectors);
        matcher.match(elementSelector, function (selector) {
            var directive = selectorMap.get(selector);
            if (directive) {
                attrs_1.push.apply(attrs_1, Object.keys(directive.inputs).map(function (name) { return ({ name: name, input: true }); }));
                attrs_1.push.apply(attrs_1, Object.keys(directive.outputs).map(function (name) { return ({ name: name, output: true }); }));
            }
        });
        // If a name shows up twice, fold it into a single value.
        attrs_1 = foldAttrs(attrs_1);
        // Now expand them back out to ensure that input/output shows up as well as input and
        // output.
        attributes.push.apply(attributes, utils_1.flatten(attrs_1.map(expandedAttr)));
    }
    return attributes;
}
function attributeValueCompletions(info, position, attr) {
    var path = utils_1.findTemplateAstAt(info.templateAst, position);
    var mostSpecific = path.tail;
    var dinfo = utils_1.diagnosticInfoFromTemplateInfo(info);
    if (mostSpecific) {
        var visitor = new ExpressionVisitor(info, position, attr, function () { return language_services_1.getExpressionScope(dinfo, path, false); });
        mostSpecific.visit(visitor, null);
        if (!visitor.result || !visitor.result.length) {
            // Try allwoing widening the path
            var widerPath_1 = utils_1.findTemplateAstAt(info.templateAst, position, /* allowWidening */ true);
            if (widerPath_1.tail) {
                var widerVisitor = new ExpressionVisitor(info, position, attr, function () { return language_services_1.getExpressionScope(dinfo, widerPath_1, false); });
                widerPath_1.tail.visit(widerVisitor, null);
                return widerVisitor.result;
            }
        }
        return visitor.result;
    }
}
function elementCompletions(info, path) {
    var htmlNames = html_info_1.elementNames().filter(function (name) { return !(name in hiddenHtmlElements); });
    // Collect the elements referenced by the selectors
    var directiveElements = utils_1.getSelectors(info)
        .selectors.map(function (selector) { return selector.element; })
        .filter(function (name) { return !!name; });
    var components = directiveElements.map(function (name) { return ({ kind: 'component', name: name, sort: name }); });
    var htmlElements = htmlNames.map(function (name) { return ({ kind: 'element', name: name, sort: name }); });
    // Return components and html elements
    return utils_1.uniqueByName(htmlElements.concat(components));
}
function entityCompletions(value, position) {
    // Look for entity completions
    var re = /&[A-Za-z]*;?(?!\d)/g;
    var found;
    var result = undefined;
    while (found = re.exec(value)) {
        var len = found[0].length;
        if (position >= found.index && position < (found.index + len)) {
            result = Object.keys(compiler_1.NAMED_ENTITIES)
                .map(function (name) { return ({ kind: 'entity', name: "&" + name + ";", sort: name }); });
            break;
        }
    }
    return result;
}
function interpolationCompletions(info, position) {
    // Look for an interpolation in at the position.
    var templatePath = utils_1.findTemplateAstAt(info.templateAst, position);
    var mostSpecific = templatePath.tail;
    if (mostSpecific) {
        var visitor = new ExpressionVisitor(info, position, undefined, function () { return language_services_1.getExpressionScope(utils_1.diagnosticInfoFromTemplateInfo(info), templatePath, false); });
        mostSpecific.visit(visitor, null);
        return utils_1.uniqueByName(visitor.result);
    }
}
// There is a special case of HTML where text that contains a unclosed tag is treated as
// text. For exaple '<h1> Some <a text </h1>' produces a text nodes inside of the H1
// element "Some <a text". We, however, want to treat this as if the user was requesting
// the attributes of an "a" element, not requesting completion in the a text element. This
// code checks for this case and returns element completions if it is detected or undefined
// if it is not.
function voidElementAttributeCompletions(info, path) {
    var tail = path.tail;
    if (tail instanceof compiler_1.Text) {
        var match = tail.value.match(/<(\w(\w|\d|-)*:)?(\w(\w|\d|-)*)\s/);
        // The position must be after the match, otherwise we are still in a place where elements
        // are expected (such as `<|a` or `<a|`; we only want attributes for `<a |` or after).
        if (match &&
            path.position >= (match.index || 0) + match[0].length + tail.sourceSpan.start.offset) {
            return attributeCompletionsForElement(info, match[3]);
        }
    }
}
var ExpressionVisitor = /** @class */ (function (_super) {
    __extends(ExpressionVisitor, _super);
    function ExpressionVisitor(info, position, attr, getExpressionScope) {
        var _this = _super.call(this) || this;
        _this.info = info;
        _this.position = position;
        _this.attr = attr;
        _this.getExpressionScope = getExpressionScope || (function () { return info.template.members; });
        return _this;
    }
    ExpressionVisitor.prototype.visitDirectiveProperty = function (ast) {
        this.attributeValueCompletions(ast.value);
    };
    ExpressionVisitor.prototype.visitElementProperty = function (ast) {
        this.attributeValueCompletions(ast.value);
    };
    ExpressionVisitor.prototype.visitEvent = function (ast) { this.attributeValueCompletions(ast.handler); };
    ExpressionVisitor.prototype.visitElement = function (ast) {
        var _this = this;
        if (this.attr && utils_1.getSelectors(this.info) && this.attr.name.startsWith(TEMPLATE_ATTR_PREFIX)) {
            // The value is a template expression but the expression AST was not produced when the
            // TemplateAst was produce so
            // do that now.
            var key_1 = this.attr.name.substr(TEMPLATE_ATTR_PREFIX.length);
            // Find the selector
            var selectorInfo = utils_1.getSelectors(this.info);
            var selectors = selectorInfo.selectors;
            var selector_1 = selectors.filter(function (s) { return s.attrs.some(function (attr, i) { return i % 2 == 0 && attr == key_1; }); })[0];
            var templateBindingResult = this.info.expressionParser.parseTemplateBindings(key_1, this.attr.value, null);
            // find the template binding that contains the position
            if (!this.attr.valueSpan)
                return;
            var valueRelativePosition_1 = this.position - this.attr.valueSpan.start.offset - 1;
            var bindings = templateBindingResult.templateBindings;
            var binding = bindings.find(function (binding) { return utils_1.inSpan(valueRelativePosition_1, binding.span, /* exclusive */ true); }) ||
                bindings.find(function (binding) { return utils_1.inSpan(valueRelativePosition_1, binding.span); });
            var keyCompletions = function () {
                var keys = [];
                if (selector_1) {
                    var attrNames = selector_1.attrs.filter(function (_, i) { return i % 2 == 0; });
                    keys = attrNames.filter(function (name) { return name.startsWith(key_1) && name != key_1; })
                        .map(function (name) { return lowerName(name.substr(key_1.length)); });
                }
                keys.push('let');
                _this.result = keys.map(function (key) { return ({ kind: 'key', name: key, sort: key }); });
            };
            if (!binding || (binding.key == key_1 && !binding.expression)) {
                // We are in the root binding. We should return `let` and keys that are left in the
                // selector.
                keyCompletions();
            }
            else if (binding.keyIsVar) {
                var equalLocation = this.attr.value.indexOf('=');
                this.result = [];
                if (equalLocation >= 0 && valueRelativePosition_1 >= equalLocation) {
                    // We are after the '=' in a let clause. The valid values here are the members of the
                    // template reference's type parameter.
                    var directiveMetadata = selectorInfo.map.get(selector_1);
                    if (directiveMetadata) {
                        var contextTable = this.info.template.query.getTemplateContext(directiveMetadata.type.reference);
                        if (contextTable) {
                            this.result = this.symbolsToCompletions(contextTable.values());
                        }
                    }
                }
                else if (binding.key && valueRelativePosition_1 <= (binding.key.length - key_1.length)) {
                    keyCompletions();
                }
            }
            else {
                // If the position is in the expression or after the key or there is no key, return the
                // expression completions
                if ((binding.expression && utils_1.inSpan(valueRelativePosition_1, binding.expression.ast.span)) ||
                    (binding.key &&
                        valueRelativePosition_1 > binding.span.start + (binding.key.length - key_1.length)) ||
                    !binding.key) {
                    var span = new compiler_1.ParseSpan(0, this.attr.value.length);
                    this.attributeValueCompletions(binding.expression ? binding.expression.ast :
                        new compiler_1.PropertyRead(span, new compiler_1.ImplicitReceiver(span), ''), valueRelativePosition_1);
                }
                else {
                    keyCompletions();
                }
            }
        }
    };
    ExpressionVisitor.prototype.visitBoundText = function (ast) {
        var expressionPosition = this.position - ast.sourceSpan.start.offset;
        if (utils_1.inSpan(expressionPosition, ast.value.span)) {
            var completions = expressions_1.getExpressionCompletions(this.getExpressionScope(), ast.value, expressionPosition, this.info.template.query);
            if (completions) {
                this.result = this.symbolsToCompletions(completions);
            }
        }
    };
    ExpressionVisitor.prototype.attributeValueCompletions = function (value, position) {
        var symbols = expressions_1.getExpressionCompletions(this.getExpressionScope(), value, position == null ? this.attributeValuePosition : position, this.info.template.query);
        if (symbols) {
            this.result = this.symbolsToCompletions(symbols);
        }
    };
    ExpressionVisitor.prototype.symbolsToCompletions = function (symbols) {
        return symbols.filter(function (s) { return !s.name.startsWith('__') && s.public; })
            .map(function (symbol) { return ({ kind: symbol.kind, name: symbol.name, sort: symbol.name }); });
    };
    Object.defineProperty(ExpressionVisitor.prototype, "attributeValuePosition", {
        get: function () {
            if (this.attr && this.attr.valueSpan) {
                return this.position - this.attr.valueSpan.start.offset - 1;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    return ExpressionVisitor;
}(compiler_1.NullTemplateVisitor));
function getSourceText(template, span) {
    return template.source.substring(span.start, span.end);
}
function nameOfAttr(attr) {
    var name = attr.name;
    if (attr.output) {
        name = utils_1.removeSuffix(name, 'Events');
        name = utils_1.removeSuffix(name, 'Changed');
    }
    var result = [name];
    if (attr.input) {
        result.unshift('[');
        result.push(']');
    }
    if (attr.output) {
        result.unshift('(');
        result.push(')');
    }
    if (attr.template) {
        result.unshift('*');
    }
    return result.join('');
}
var templateAttr = /^(\w+:)?(template$|^\*)/;
function createElementCssSelector(element) {
    var cssSelector = new compiler_1.CssSelector();
    var elNameNoNs = compiler_1.splitNsName(element.name)[1];
    cssSelector.setElement(elNameNoNs);
    for (var _i = 0, _a = element.attrs; _i < _a.length; _i++) {
        var attr = _a[_i];
        if (!attr.name.match(templateAttr)) {
            var _b = compiler_1.splitNsName(attr.name), _ = _b[0], attrNameNoNs = _b[1];
            cssSelector.addAttribute(attrNameNoNs, attr.value);
            if (attr.name.toLowerCase() == 'class') {
                var classes = attr.value.split(/s+/g);
                classes.forEach(function (className) { return cssSelector.addClassName(className); });
            }
        }
    }
    return cssSelector;
}
function foldAttrs(attrs) {
    var inputOutput = new Map();
    var templates = new Map();
    var result = [];
    attrs.forEach(function (attr) {
        if (attr.fromHtml) {
            return attr;
        }
        if (attr.template) {
            var duplicate = templates.get(attr.name);
            if (!duplicate) {
                result.push({ name: attr.name, template: true });
                templates.set(attr.name, attr);
            }
        }
        if (attr.input || attr.output) {
            var duplicate = inputOutput.get(attr.name);
            if (duplicate) {
                duplicate.input = duplicate.input || attr.input;
                duplicate.output = duplicate.output || attr.output;
            }
            else {
                var cloneAttr = { name: attr.name };
                if (attr.input)
                    cloneAttr.input = true;
                if (attr.output)
                    cloneAttr.output = true;
                result.push(cloneAttr);
                inputOutput.set(attr.name, cloneAttr);
            }
        }
    });
    return result;
}
function expandedAttr(attr) {
    if (attr.input && attr.output) {
        return [
            attr, { name: attr.name, input: true, output: false },
            { name: attr.name, input: false, output: true }
        ];
    }
    return [attr];
}
function lowerName(name) {
    return name && (name[0].toLowerCase() + name.substr(1));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxldGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sYW5ndWFnZS1zZXJ2aWNlL3NyYy9jb21wbGV0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCw4Q0FBbWY7QUFDbmYsaUZBQXVHO0FBR3ZHLDZDQUF1RDtBQUN2RCx5Q0FBb0Y7QUFFcEYsaUNBQW1LO0FBRW5LLElBQU0sb0JBQW9CLEdBQUcsR0FBRyxDQUFDO0FBRWpDLElBQU0sa0JBQWtCLEdBQUc7SUFDekIsSUFBSSxFQUFFLElBQUk7SUFDVixNQUFNLEVBQUUsSUFBSTtJQUNaLFFBQVEsRUFBRSxJQUFJO0lBQ2QsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLEtBQUssRUFBRSxJQUFJO0lBQ1gsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtDQUNYLENBQUM7QUFFRixnQ0FBdUMsWUFBMEI7SUFDL0QsSUFBSSxNQUFNLEdBQTBCLFNBQVMsQ0FBQztJQUN6QyxJQUFBLDhCQUFPLEVBQUUsc0NBQVcsRUFBRSxnQ0FBUSxDQUFpQjtJQUNwRCw2RUFBNkU7SUFDN0UsSUFBSSxZQUFZLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRTtRQUNqQyxJQUFJLGtCQUFnQixHQUFHLFlBQVksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDbkUsSUFBSSxNQUFJLEdBQUcsbUJBQVEsQ0FBQyxPQUFPLEVBQUUsa0JBQWdCLENBQUMsQ0FBQztRQUMvQyxJQUFJLFlBQVksR0FBRyxNQUFJLENBQUMsSUFBSSxDQUFDO1FBQzdCLElBQUksTUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLFlBQVksRUFBRTtZQUMvQixNQUFNLEdBQUcsa0JBQWtCLENBQUMsWUFBWSxFQUFFLE1BQUksQ0FBQyxDQUFDO1NBQ2pEO2FBQU07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