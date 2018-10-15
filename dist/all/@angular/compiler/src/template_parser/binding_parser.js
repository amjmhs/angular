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
var core_1 = require("../core");
var ast_1 = require("../expression_parser/ast");
var tags_1 = require("../ml_parser/tags");
var parse_util_1 = require("../parse_util");
var selector_1 = require("../selector");
var util_1 = require("../util");
var PROPERTY_PARTS_SEPARATOR = '.';
var ATTRIBUTE_PREFIX = 'attr';
var CLASS_PREFIX = 'class';
var STYLE_PREFIX = 'style';
var ANIMATE_PROP_PREFIX = 'animate-';
/**
 * Parses bindings in templates and in the directive host area.
 */
var BindingParser = /** @class */ (function () {
    function BindingParser(_exprParser, _interpolationConfig, _schemaRegistry, pipes, errors) {
        this._exprParser = _exprParser;
        this._interpolationConfig = _interpolationConfig;
        this._schemaRegistry = _schemaRegistry;
        this.errors = errors;
        this.pipesByName = null;
        this._usedPipes = new Map();
        // When the `pipes` parameter is `null`, do not check for used pipes
        // This is used in IVY when we might not know the available pipes at compile time
        if (pipes) {
            var pipesByName_1 = new Map();
            pipes.forEach(function (pipe) { return pipesByName_1.set(pipe.name, pipe); });
            this.pipesByName = pipesByName_1;
        }
    }
    BindingParser.prototype.getUsedPipes = function () { return Array.from(this._usedPipes.values()); };
    BindingParser.prototype.createBoundHostProperties = function (dirMeta, sourceSpan) {
        var _this = this;
        if (dirMeta.hostProperties) {
            var boundProps_1 = [];
            Object.keys(dirMeta.hostProperties).forEach(function (propName) {
                var expression = dirMeta.hostProperties[propName];
                if (typeof expression === 'string') {
                    _this.parsePropertyBinding(propName, expression, true, sourceSpan, [], boundProps_1);
                }
                else {
                    _this._reportError("Value of the host property binding \"" + propName + "\" needs to be a string representing an expression but got \"" + expression + "\" (" + typeof expression + ")", sourceSpan);
                }
            });
            return boundProps_1;
        }
        return null;
    };
    BindingParser.prototype.createDirectiveHostPropertyAsts = function (dirMeta, elementSelector, sourceSpan) {
        var _this = this;
        var boundProps = this.createBoundHostProperties(dirMeta, sourceSpan);
        return boundProps &&
            boundProps.map(function (prop) { return _this.createBoundElementProperty(elementSelector, prop); });
    };
    BindingParser.prototype.createDirectiveHostEventAsts = function (dirMeta, sourceSpan) {
        var _this = this;
        if (dirMeta.hostListeners) {
            var targetEvents_1 = [];
            Object.keys(dirMeta.hostListeners).forEach(function (propName) {
                var expression = dirMeta.hostListeners[propName];
                if (typeof expression === 'string') {
                    _this.parseEvent(propName, expression, sourceSpan, [], targetEvents_1);
                }
                else {
                    _this._reportError("Value of the host listener \"" + propName + "\" needs to be a string representing an expression but got \"" + expression + "\" (" + typeof expression + ")", sourceSpan);
                }
            });
            return targetEvents_1;
        }
        return null;
    };
    BindingParser.prototype.parseInterpolation = function (value, sourceSpan) {
        var sourceInfo = sourceSpan.start.toString();
        try {
            var ast = this._exprParser.parseInterpolation(value, sourceInfo, this._interpolationConfig);
            if (ast)
                this._reportExpressionParserErrors(ast.errors, sourceSpan);
            this._checkPipes(ast, sourceSpan);
            return ast;
        }
        catch (e) {
            this._reportError("" + e, sourceSpan);
            return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
        }
    };
    // Parse an inline template binding. ie `<tag *tplKey="<tplValue>">`
    BindingParser.prototype.parseInlineTemplateBinding = function (tplKey, tplValue, sourceSpan, targetMatchableAttrs, targetProps, targetVars) {
        var bindings = this._parseTemplateBindings(tplKey, tplValue, sourceSpan);
        for (var i = 0; i < bindings.length; i++) {
            var binding = bindings[i];
            if (binding.keyIsVar) {
                targetVars.push(new ast_1.ParsedVariable(binding.key, binding.name, sourceSpan));
            }
            else if (binding.expression) {
                this._parsePropertyAst(binding.key, binding.expression, sourceSpan, targetMatchableAttrs, targetProps);
            }
            else {
                targetMatchableAttrs.push([binding.key, '']);
                this.parseLiteralAttr(binding.key, null, sourceSpan, targetMatchableAttrs, targetProps);
            }
        }
    };
    BindingParser.prototype._parseTemplateBindings = function (tplKey, tplValue, sourceSpan) {
        var _this = this;
        var sourceInfo = sourceSpan.start.toString();
        try {
            var bindingsResult = this._exprParser.parseTemplateBindings(tplKey, tplValue, sourceInfo);
            this._reportExpressionParserErrors(bindingsResult.errors, sourceSpan);
            bindingsResult.templateBindings.forEach(function (binding) {
                if (binding.expression) {
                    _this._checkPipes(binding.expression, sourceSpan);
                }
            });
            bindingsResult.warnings.forEach(function (warning) { _this._reportError(warning, sourceSpan, parse_util_1.ParseErrorLevel.WARNING); });
            return bindingsResult.templateBindings;
        }
        catch (e) {
            this._reportError("" + e, sourceSpan);
            return [];
        }
    };
    BindingParser.prototype.parseLiteralAttr = function (name, value, sourceSpan, targetMatchableAttrs, targetProps) {
        if (isAnimationLabel(name)) {
            name = name.substring(1);
            if (value) {
                this._reportError("Assigning animation triggers via @prop=\"exp\" attributes with an expression is invalid." +
                    " Use property bindings (e.g. [@prop]=\"exp\") or use an attribute without a value (e.g. @prop) instead.", sourceSpan, parse_util_1.ParseErrorLevel.ERROR);
            }
            this._parseAnimation(name, value, sourceSpan, targetMatchableAttrs, targetProps);
        }
        else {
            targetProps.push(new ast_1.ParsedProperty(name, this._exprParser.wrapLiteralPrimitive(value, ''), ast_1.ParsedPropertyType.LITERAL_ATTR, sourceSpan));
        }
    };
    BindingParser.prototype.parsePropertyBinding = function (name, expression, isHost, sourceSpan, targetMatchableAttrs, targetProps) {
        var isAnimationProp = false;
        if (name.startsWith(ANIMATE_PROP_PREFIX)) {
            isAnimationProp = true;
            name = name.substring(ANIMATE_PROP_PREFIX.length);
        }
        else if (isAnimationLabel(name)) {
            isAnimationProp = true;
            name = name.substring(1);
        }
        if (isAnimationProp) {
            this._parseAnimation(name, expression, sourceSpan, targetMatchableAttrs, targetProps);
        }
        else {
            this._parsePropertyAst(name, this._parseBinding(expression, isHost, sourceSpan), sourceSpan, targetMatchableAttrs, targetProps);
        }
    };
    BindingParser.prototype.parsePropertyInterpolation = function (name, value, sourceSpan, targetMatchableAttrs, targetProps) {
        var expr = this.parseInterpolation(value, sourceSpan);
        if (expr) {
            this._parsePropertyAst(name, expr, sourceSpan, targetMatchableAttrs, targetProps);
            return true;
        }
        return false;
    };
    BindingParser.prototype._parsePropertyAst = function (name, ast, sourceSpan, targetMatchableAttrs, targetProps) {
        targetMatchableAttrs.push([name, ast.source]);
        targetProps.push(new ast_1.ParsedProperty(name, ast, ast_1.ParsedPropertyType.DEFAULT, sourceSpan));
    };
    BindingParser.prototype._parseAnimation = function (name, expression, sourceSpan, targetMatchableAttrs, targetProps) {
        // This will occur when a @trigger is not paired with an expression.
        // For animations it is valid to not have an expression since */void
        // states will be applied by angular when the element is attached/detached
        var ast = this._parseBinding(expression || 'undefined', false, sourceSpan);
        targetMatchableAttrs.push([name, ast.source]);
        targetProps.push(new ast_1.ParsedProperty(name, ast, ast_1.ParsedPropertyType.ANIMATION, sourceSpan));
    };
    BindingParser.prototype._parseBinding = function (value, isHostBinding, sourceSpan) {
        var sourceInfo = (sourceSpan && sourceSpan.start || '(unknown)').toString();
        try {
            var ast = isHostBinding ?
                this._exprParser.parseSimpleBinding(value, sourceInfo, this._interpolationConfig) :
                this._exprParser.parseBinding(value, sourceInfo, this._interpolationConfig);
            if (ast)
                this._reportExpressionParserErrors(ast.errors, sourceSpan);
            this._checkPipes(ast, sourceSpan);
            return ast;
        }
        catch (e) {
            this._reportError("" + e, sourceSpan);
            return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
        }
    };
    BindingParser.prototype.createBoundElementProperty = function (elementSelector, boundProp) {
        if (boundProp.isAnimation) {
            return new ast_1.BoundElementProperty(boundProp.name, 4 /* Animation */, core_1.SecurityContext.NONE, boundProp.expression, null, boundProp.sourceSpan);
        }
        var unit = null;
        var bindingType = undefined;
        var boundPropertyName = null;
        var parts = boundProp.name.split(PROPERTY_PARTS_SEPARATOR);
        var securityContexts = undefined;
        // Check check for special cases (prefix style, attr, class)
        if (parts.length > 1) {
            if (parts[0] == ATTRIBUTE_PREFIX) {
                boundPropertyName = parts[1];
                this._validatePropertyOrAttributeName(boundPropertyName, boundProp.sourceSpan, true);
                securityContexts = calcPossibleSecurityContexts(this._schemaRegistry, elementSelector, boundPropertyName, true);
                var nsSeparatorIdx = boundPropertyName.indexOf(':');
                if (nsSeparatorIdx > -1) {
                    var ns = boundPropertyName.substring(0, nsSeparatorIdx);
                    var name_1 = boundPropertyName.substring(nsSeparatorIdx + 1);
                    boundPropertyName = tags_1.mergeNsAndName(ns, name_1);
                }
                bindingType = 1 /* Attribute */;
            }
            else if (parts[0] == CLASS_PREFIX) {
                boundPropertyName = parts[1];
                bindingType = 2 /* Class */;
                securityContexts = [core_1.SecurityContext.NONE];
            }
            else if (parts[0] == STYLE_PREFIX) {
                unit = parts.length > 2 ? parts[2] : null;
                boundPropertyName = parts[1];
                bindingType = 3 /* Style */;
                securityContexts = [core_1.SecurityContext.STYLE];
            }
        }
        // If not a special case, use the full property name
        if (boundPropertyName === null) {
            boundPropertyName = this._schemaRegistry.getMappedPropName(boundProp.name);
            securityContexts = calcPossibleSecurityContexts(this._schemaRegistry, elementSelector, boundPropertyName, false);
            bindingType = 0 /* Property */;
            this._validatePropertyOrAttributeName(boundPropertyName, boundProp.sourceSpan, false);
        }
        return new ast_1.BoundElementProperty(boundPropertyName, bindingType, securityContexts[0], boundProp.expression, unit, boundProp.sourceSpan);
    };
    BindingParser.prototype.parseEvent = function (name, expression, sourceSpan, targetMatchableAttrs, targetEvents) {
        if (isAnimationLabel(name)) {
            name = name.substr(1);
            this._parseAnimationEvent(name, expression, sourceSpan, targetEvents);
        }
        else {
            this._parseRegularEvent(name, expression, sourceSpan, targetMatchableAttrs, targetEvents);
        }
    };
    BindingParser.prototype._parseAnimationEvent = function (name, expression, sourceSpan, targetEvents) {
        var matches = util_1.splitAtPeriod(name, [name, '']);
        var eventName = matches[0];
        var phase = matches[1].toLowerCase();
        if (phase) {
            switch (phase) {
                case 'start':
                case 'done':
                    var ast = this._parseAction(expression, sourceSpan);
                    targetEvents.push(new ast_1.ParsedEvent(eventName, phase, 1 /* Animation */, ast, sourceSpan));
                    break;
                default:
                    this._reportError("The provided animation output phase value \"" + phase + "\" for \"@" + eventName + "\" is not supported (use start or done)", sourceSpan);
                    break;
            }
        }
        else {
            this._reportError("The animation trigger output event (@" + eventName + ") is missing its phase value name (start or done are currently supported)", sourceSpan);
        }
    };
    BindingParser.prototype._parseRegularEvent = function (name, expression, sourceSpan, targetMatchableAttrs, targetEvents) {
        // long format: 'target: eventName'
        var _a = util_1.splitAtColon(name, [null, name]), target = _a[0], eventName = _a[1];
        var ast = this._parseAction(expression, sourceSpan);
        targetMatchableAttrs.push([name, ast.source]);
        targetEvents.push(new ast_1.ParsedEvent(eventName, target, 0 /* Regular */, ast, sourceSpan));
        // Don't detect directives for event names for now,
        // so don't add the event name to the matchableAttrs
    };
    BindingParser.prototype._parseAction = function (value, sourceSpan) {
        var sourceInfo = (sourceSpan && sourceSpan.start || '(unknown').toString();
        try {
            var ast = this._exprParser.parseAction(value, sourceInfo, this._interpolationConfig);
            if (ast) {
                this._reportExpressionParserErrors(ast.errors, sourceSpan);
            }
            if (!ast || ast.ast instanceof ast_1.EmptyExpr) {
                this._reportError("Empty expressions are not allowed", sourceSpan);
                return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
            }
            this._checkPipes(ast, sourceSpan);
            return ast;
        }
        catch (e) {
            this._reportError("" + e, sourceSpan);
            return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
        }
    };
    BindingParser.prototype._reportError = function (message, sourceSpan, level) {
        if (level === void 0) { level = parse_util_1.ParseErrorLevel.ERROR; }
        this.errors.push(new parse_util_1.ParseError(sourceSpan, message, level));
    };
    BindingParser.prototype._reportExpressionParserErrors = function (errors, sourceSpan) {
        for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
            var error = errors_1[_i];
            this._reportError(error.message, sourceSpan);
        }
    };
    // Make sure all the used pipes are known in `this.pipesByName`
    BindingParser.prototype._checkPipes = function (ast, sourceSpan) {
        var _this = this;
        if (ast && this.pipesByName) {
            var collector = new PipeCollector();
            ast.visit(collector);
            collector.pipes.forEach(function (ast, pipeName) {
                var pipeMeta = _this.pipesByName.get(pipeName);
                if (!pipeMeta) {
                    _this._reportError("The pipe '" + pipeName + "' could not be found", new parse_util_1.ParseSourceSpan(sourceSpan.start.moveBy(ast.span.start), sourceSpan.start.moveBy(ast.span.end)));
                }
                else {
                    _this._usedPipes.set(pipeName, pipeMeta);
                }
            });
        }
    };
    /**
     * @param propName the name of the property / attribute
     * @param sourceSpan
     * @param isAttr true when binding to an attribute
     */
    BindingParser.prototype._validatePropertyOrAttributeName = function (propName, sourceSpan, isAttr) {
        var report = isAttr ? this._schemaRegistry.validateAttribute(propName) :
            this._schemaRegistry.validateProperty(propName);
        if (report.error) {
            this._reportError(report.msg, sourceSpan, parse_util_1.ParseErrorLevel.ERROR);
        }
    };
    return BindingParser;
}());
exports.BindingParser = BindingParser;
var PipeCollector = /** @class */ (function (_super) {
    __extends(PipeCollector, _super);
    function PipeCollector() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.pipes = new Map();
        return _this;
    }
    PipeCollector.prototype.visitPipe = function (ast, context) {
        this.pipes.set(ast.name, ast);
        ast.exp.visit(this);
        this.visitAll(ast.args, context);
        return null;
    };
    return PipeCollector;
}(ast_1.RecursiveAstVisitor));
exports.PipeCollector = PipeCollector;
function isAnimationLabel(name) {
    return name[0] == '@';
}
function calcPossibleSecurityContexts(registry, selector, propName, isAttribute) {
    var ctxs = [];
    selector_1.CssSelector.parse(selector).forEach(function (selector) {
        var elementNames = selector.element ? [selector.element] : registry.allKnownElementNames();
        var notElementNames = new Set(selector.notSelectors.filter(function (selector) { return selector.isElementSelector(); })
            .map(function (selector) { return selector.element; }));
        var possibleElementNames = elementNames.filter(function (elementName) { return !notElementNames.has(elementName); });
        ctxs.push.apply(ctxs, possibleElementNames.map(function (elementName) { return registry.securityContext(elementName, propName, isAttribute); }));
    });
    return ctxs.length === 0 ? [core_1.SecurityContext.NONE] : Array.from(new Set(ctxs)).sort();
}
exports.calcPossibleSecurityContexts = calcPossibleSecurityContexts;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluZGluZ19wYXJzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvdGVtcGxhdGVfcGFyc2VyL2JpbmRpbmdfcGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUdILGdDQUF3QztBQUN4QyxnREFBdVA7QUFHdlAsMENBQWlEO0FBQ2pELDRDQUEyRTtBQUUzRSx3Q0FBd0M7QUFDeEMsZ0NBQW9EO0FBRXBELElBQU0sd0JBQXdCLEdBQUcsR0FBRyxDQUFDO0FBQ3JDLElBQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO0FBQ2hDLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQztBQUM3QixJQUFNLFlBQVksR0FBRyxPQUFPLENBQUM7QUFFN0IsSUFBTSxtQkFBbUIsR0FBRyxVQUFVLENBQUM7QUFFdkM7O0dBRUc7QUFDSDtJQUtFLHVCQUNZLFdBQW1CLEVBQVUsb0JBQXlDLEVBQ3RFLGVBQXNDLEVBQUUsS0FBZ0MsRUFDekUsTUFBb0I7UUFGbkIsZ0JBQVcsR0FBWCxXQUFXLENBQVE7UUFBVSx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXFCO1FBQ3RFLG9CQUFlLEdBQWYsZUFBZSxDQUF1QjtRQUN2QyxXQUFNLEdBQU4sTUFBTSxDQUFjO1FBUC9CLGdCQUFXLEdBQXlDLElBQUksQ0FBQztRQUVqRCxlQUFVLEdBQW9DLElBQUksR0FBRyxFQUFFLENBQUM7UUFNOUQsb0VBQW9FO1FBQ3BFLGlGQUFpRjtRQUNqRixJQUFJLEtBQUssRUFBRTtZQUNULElBQU0sYUFBVyxHQUFvQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQy9ELEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxhQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQWhDLENBQWdDLENBQUMsQ0FBQztZQUN4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