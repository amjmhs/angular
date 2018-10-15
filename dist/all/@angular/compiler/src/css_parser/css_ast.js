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
var css_lexer_1 = require("./css_lexer");
var BlockType;
(function (BlockType) {
    BlockType[BlockType["Import"] = 0] = "Import";
    BlockType[BlockType["Charset"] = 1] = "Charset";
    BlockType[BlockType["Namespace"] = 2] = "Namespace";
    BlockType[BlockType["Supports"] = 3] = "Supports";
    BlockType[BlockType["Keyframes"] = 4] = "Keyframes";
    BlockType[BlockType["MediaQuery"] = 5] = "MediaQuery";
    BlockType[BlockType["Selector"] = 6] = "Selector";
    BlockType[BlockType["FontFace"] = 7] = "FontFace";
    BlockType[BlockType["Page"] = 8] = "Page";
    BlockType[BlockType["Document"] = 9] = "Document";
    BlockType[BlockType["Viewport"] = 10] = "Viewport";
    BlockType[BlockType["Unsupported"] = 11] = "Unsupported";
})(BlockType = exports.BlockType || (exports.BlockType = {}));
var CssAst = /** @class */ (function () {
    function CssAst(location) {
        this.location = location;
    }
    Object.defineProperty(CssAst.prototype, "start", {
        get: function () { return this.location.start; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CssAst.prototype, "end", {
        get: function () { return this.location.end; },
        enumerable: true,
        configurable: true
    });
    return CssAst;
}());
exports.CssAst = CssAst;
var CssStyleValueAst = /** @class */ (function (_super) {
    __extends(CssStyleValueAst, _super);
    function CssStyleValueAst(location, tokens, strValue) {
        var _this = _super.call(this, location) || this;
        _this.tokens = tokens;
        _this.strValue = strValue;
        return _this;
    }
    CssStyleValueAst.prototype.visit = function (visitor, context) { return visitor.visitCssValue(this); };
    return CssStyleValueAst;
}(CssAst));
exports.CssStyleValueAst = CssStyleValueAst;
var CssRuleAst = /** @class */ (function (_super) {
    __extends(CssRuleAst, _super);
    function CssRuleAst(location) {
        return _super.call(this, location) || this;
    }
    return CssRuleAst;
}(CssAst));
exports.CssRuleAst = CssRuleAst;
var CssBlockRuleAst = /** @class */ (function (_super) {
    __extends(CssBlockRuleAst, _super);
    function CssBlockRuleAst(location, type, block, name) {
        if (name === void 0) { name = null; }
        var _this = _super.call(this, location) || this;
        _this.location = location;
        _this.type = type;
        _this.block = block;
        _this.name = name;
        return _this;
    }
    CssBlockRuleAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssBlock(this.block, context);
    };
    return CssBlockRuleAst;
}(CssRuleAst));
exports.CssBlockRuleAst = CssBlockRuleAst;
var CssKeyframeRuleAst = /** @class */ (function (_super) {
    __extends(CssKeyframeRuleAst, _super);
    function CssKeyframeRuleAst(location, name, block) {
        return _super.call(this, location, BlockType.Keyframes, block, name) || this;
    }
    CssKeyframeRuleAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssKeyframeRule(this, context);
    };
    return CssKeyframeRuleAst;
}(CssBlockRuleAst));
exports.CssKeyframeRuleAst = CssKeyframeRuleAst;
var CssKeyframeDefinitionAst = /** @class */ (function (_super) {
    __extends(CssKeyframeDefinitionAst, _super);
    function CssKeyframeDefinitionAst(location, steps, block) {
        var _this = _super.call(this, location, BlockType.Keyframes, block, mergeTokens(steps, ',')) || this;
        _this.steps = steps;
        return _this;
    }
    CssKeyframeDefinitionAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssKeyframeDefinition(this, context);
    };
    return CssKeyframeDefinitionAst;
}(CssBlockRuleAst));
exports.CssKeyframeDefinitionAst = CssKeyframeDefinitionAst;
var CssBlockDefinitionRuleAst = /** @class */ (function (_super) {
    __extends(CssBlockDefinitionRuleAst, _super);
    function CssBlockDefinitionRuleAst(location, strValue, type, query, block) {
        var _this = _super.call(this, location, type, block) || this;
        _this.strValue = strValue;
        _this.query = query;
        var firstCssToken = query.tokens[0];
        _this.name = new css_lexer_1.CssToken(firstCssToken.index, firstCssToken.column, firstCssToken.line, css_lexer_1.CssTokenType.Identifier, _this.strValue);
        return _this;
    }
    CssBlockDefinitionRuleAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssBlock(this.block, context);
    };
    return CssBlockDefinitionRuleAst;
}(CssBlockRuleAst));
exports.CssBlockDefinitionRuleAst = CssBlockDefinitionRuleAst;
var CssMediaQueryRuleAst = /** @class */ (function (_super) {
    __extends(CssMediaQueryRuleAst, _super);
    function CssMediaQueryRuleAst(location, strValue, query, block) {
        return _super.call(this, location, strValue, BlockType.MediaQuery, query, block) || this;
    }
    CssMediaQueryRuleAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssMediaQueryRule(this, context);
    };
    return CssMediaQueryRuleAst;
}(CssBlockDefinitionRuleAst));
exports.CssMediaQueryRuleAst = CssMediaQueryRuleAst;
var CssAtRulePredicateAst = /** @class */ (function (_super) {
    __extends(CssAtRulePredicateAst, _super);
    function CssAtRulePredicateAst(location, strValue, tokens) {
        var _this = _super.call(this, location) || this;
        _this.strValue = strValue;
        _this.tokens = tokens;
        return _this;
    }
    CssAtRulePredicateAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssAtRulePredicate(this, context);
    };
    return CssAtRulePredicateAst;
}(CssAst));
exports.CssAtRulePredicateAst = CssAtRulePredicateAst;
var CssInlineRuleAst = /** @class */ (function (_super) {
    __extends(CssInlineRuleAst, _super);
    function CssInlineRuleAst(location, type, value) {
        var _this = _super.call(this, location) || this;
        _this.type = type;
        _this.value = value;
        return _this;
    }
    CssInlineRuleAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssInlineRule(this, context);
    };
    return CssInlineRuleAst;
}(CssRuleAst));
exports.CssInlineRuleAst = CssInlineRuleAst;
var CssSelectorRuleAst = /** @class */ (function (_super) {
    __extends(CssSelectorRuleAst, _super);
    function CssSelectorRuleAst(location, selectors, block) {
        var _this = _super.call(this, location, BlockType.Selector, block) || this;
        _this.selectors = selectors;
        _this.strValue = selectors.map(function (selector) { return selector.strValue; }).join(',');
        return _this;
    }
    CssSelectorRuleAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssSelectorRule(this, context);
    };
    return CssSelectorRuleAst;
}(CssBlockRuleAst));
exports.CssSelectorRuleAst = CssSelectorRuleAst;
var CssDefinitionAst = /** @class */ (function (_super) {
    __extends(CssDefinitionAst, _super);
    function CssDefinitionAst(location, property, value) {
        var _this = _super.call(this, location) || this;
        _this.property = property;
        _this.value = value;
        return _this;
    }
    CssDefinitionAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssDefinition(this, context);
    };
    return CssDefinitionAst;
}(CssAst));
exports.CssDefinitionAst = CssDefinitionAst;
var CssSelectorPartAst = /** @class */ (function (_super) {
    __extends(CssSelectorPartAst, _super);
    function CssSelectorPartAst(location) {
        return _super.call(this, location) || this;
    }
    return CssSelectorPartAst;
}(CssAst));
exports.CssSelectorPartAst = CssSelectorPartAst;
var CssSelectorAst = /** @class */ (function (_super) {
    __extends(CssSelectorAst, _super);
    function CssSelectorAst(location, selectorParts) {
        var _this = _super.call(this, location) || this;
        _this.selectorParts = selectorParts;
        _this.strValue = selectorParts.map(function (part) { return part.strValue; }).join('');
        return _this;
    }
    CssSelectorAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssSelector(this, context);
    };
    return CssSelectorAst;
}(CssSelectorPartAst));
exports.CssSelectorAst = CssSelectorAst;
var CssSimpleSelectorAst = /** @class */ (function (_super) {
    __extends(CssSimpleSelectorAst, _super);
    function CssSimpleSelectorAst(location, tokens, strValue, pseudoSelectors, operator) {
        var _this = _super.call(this, location) || this;
        _this.tokens = tokens;
        _this.strValue = strValue;
        _this.pseudoSelectors = pseudoSelectors;
        _this.operator = operator;
        return _this;
    }
    CssSimpleSelectorAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssSimpleSelector(this, context);
    };
    return CssSimpleSelectorAst;
}(CssSelectorPartAst));
exports.CssSimpleSelectorAst = CssSimpleSelectorAst;
var CssPseudoSelectorAst = /** @class */ (function (_super) {
    __extends(CssPseudoSelectorAst, _super);
    function CssPseudoSelectorAst(location, strValue, name, tokens, innerSelectors) {
        var _this = _super.call(this, location) || this;
        _this.strValue = strValue;
        _this.name = name;
        _this.tokens = tokens;
        _this.innerSelectors = innerSelectors;
        return _this;
    }
    CssPseudoSelectorAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssPseudoSelector(this, context);
    };
    return CssPseudoSelectorAst;
}(CssSelectorPartAst));
exports.CssPseudoSelectorAst = CssPseudoSelectorAst;
var CssBlockAst = /** @class */ (function (_super) {
    __extends(CssBlockAst, _super);
    function CssBlockAst(location, entries) {
        var _this = _super.call(this, location) || this;
        _this.entries = entries;
        return _this;
    }
    CssBlockAst.prototype.visit = function (visitor, context) { return visitor.visitCssBlock(this, context); };
    return CssBlockAst;
}(CssAst));
exports.CssBlockAst = CssBlockAst;
/*
 a style block is different from a standard block because it contains
 css prop:value definitions. A regular block can contain a list of Ast entries.
 */
var CssStylesBlockAst = /** @class */ (function (_super) {
    __extends(CssStylesBlockAst, _super);
    function CssStylesBlockAst(location, definitions) {
        var _this = _super.call(this, location, definitions) || this;
        _this.definitions = definitions;
        return _this;
    }
    CssStylesBlockAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssStylesBlock(this, context);
    };
    return CssStylesBlockAst;
}(CssBlockAst));
exports.CssStylesBlockAst = CssStylesBlockAst;
var CssStyleSheetAst = /** @class */ (function (_super) {
    __extends(CssStyleSheetAst, _super);
    function CssStyleSheetAst(location, rules) {
        var _this = _super.call(this, location) || this;
        _this.rules = rules;
        return _this;
    }
    CssStyleSheetAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssStyleSheet(this, context);
    };
    return CssStyleSheetAst;
}(CssAst));
exports.CssStyleSheetAst = CssStyleSheetAst;
var CssUnknownRuleAst = /** @class */ (function (_super) {
    __extends(CssUnknownRuleAst, _super);
    function CssUnknownRuleAst(location, ruleName, tokens) {
        var _this = _super.call(this, location) || this;
        _this.ruleName = ruleName;
        _this.tokens = tokens;
        return _this;
    }
    CssUnknownRuleAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssUnknownRule(this, context);
    };
    return CssUnknownRuleAst;
}(CssRuleAst));
exports.CssUnknownRuleAst = CssUnknownRuleAst;
var CssUnknownTokenListAst = /** @class */ (function (_super) {
    __extends(CssUnknownTokenListAst, _super);
    function CssUnknownTokenListAst(location, name, tokens) {
        var _this = _super.call(this, location) || this;
        _this.name = name;
        _this.tokens = tokens;
        return _this;
    }
    CssUnknownTokenListAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssUnknownTokenList(this, context);
    };
    return CssUnknownTokenListAst;
}(CssRuleAst));
exports.CssUnknownTokenListAst = CssUnknownTokenListAst;
function mergeTokens(tokens, separator) {
    if (separator === void 0) { separator = ''; }
    var mainToken = tokens[0];
    var str = mainToken.strValue;
    for (var i = 1; i < tokens.length; i++) {
        str += separator + tokens[i].strValue;
    }
    return new css_lexer_1.CssToken(mainToken.index, mainToken.column, mainToken.line, mainToken.type, str);
}
exports.mergeTokens = mergeTokens;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NzX2FzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9jc3NfcGFyc2VyL2Nzc19hc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBSUgseUNBQW1EO0FBRW5ELElBQVksU0FhWDtBQWJELFdBQVksU0FBUztJQUNuQiw2Q0FBTSxDQUFBO0lBQ04sK0NBQU8sQ0FBQTtJQUNQLG1EQUFTLENBQUE7SUFDVCxpREFBUSxDQUFBO0lBQ1IsbURBQVMsQ0FBQTtJQUNULHFEQUFVLENBQUE7SUFDVixpREFBUSxDQUFBO0lBQ1IsaURBQVEsQ0FBQTtJQUNSLHlDQUFJLENBQUE7SUFDSixpREFBUSxDQUFBO0lBQ1Isa0RBQVEsQ0FBQTtJQUNSLHdEQUFXLENBQUE7QUFDYixDQUFDLEVBYlcsU0FBUyxHQUFULGlCQUFTLEtBQVQsaUJBQVMsUUFhcEI7QUFxQkQ7SUFDRSxnQkFBbUIsUUFBeUI7UUFBekIsYUFBUSxHQUFSLFFBQVEsQ0FBaUI7SUFBRyxDQUFDO0lBQ2hELHNCQUFJLHlCQUFLO2FBQVQsY0FBNkIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQzFELHNCQUFJLHVCQUFHO2FBQVAsY0FBMkIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRXhELGFBQUM7QUFBRCxDQUFDLEFBTEQsSUFLQztBQUxxQix3QkFBTTtBQU81QjtJQUFzQyxvQ0FBTTtJQUMxQywwQkFBWSxRQUF5QixFQUFTLE1BQWtCLEVBQVMsUUFBZ0I7UUFBekYsWUFDRSxrQkFBTSxRQUFRLENBQUMsU0FDaEI7UUFGNkMsWUFBTSxHQUFOLE1BQU0sQ0FBWTtRQUFTLGNBQVEsR0FBUixRQUFRLENBQVE7O0lBRXpGLENBQUM7SUFDRCxnQ0FBSyxHQUFMLFVBQU0s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