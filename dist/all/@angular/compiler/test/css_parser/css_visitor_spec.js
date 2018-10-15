"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("../../../core/testing/src/testing_internal");
var css_parser_1 = require("../../src/css_parser/css_parser");
function _assertTokens(tokens, valuesArr) {
    testing_internal_1.expect(tokens.length).toEqual(valuesArr.length);
    for (var i = 0; i < tokens.length; i++) {
        testing_internal_1.expect(tokens[i].strValue == valuesArr[i]);
    }
}
var MyVisitor = /** @class */ (function () {
    function MyVisitor(ast, context) {
        this.captures = {};
        ast.visit(this, context);
    }
    /**
     * @internal
     */
    MyVisitor.prototype._capture = function (method, ast, context) {
        this.captures[method] = this.captures[method] || [];
        this.captures[method].push([ast, context]);
    };
    MyVisitor.prototype.visitCssValue = function (ast, context) {
        this._capture('visitCssValue', ast, context);
    };
    MyVisitor.prototype.visitCssInlineRule = function (ast, context) {
        this._capture('visitCssInlineRule', ast, context);
    };
    MyVisitor.prototype.visitCssAtRulePredicate = function (ast, context) {
        this._capture('visitCssAtRulePredicate', ast, context);
    };
    MyVisitor.prototype.visitCssKeyframeRule = function (ast, context) {
        this._capture('visitCssKeyframeRule', ast, context);
        ast.block.visit(this, context);
    };
    MyVisitor.prototype.visitCssKeyframeDefinition = function (ast, context) {
        this._capture('visitCssKeyframeDefinition', ast, context);
        ast.block.visit(this, context);
    };
    MyVisitor.prototype.visitCssMediaQueryRule = function (ast, context) {
        this._capture('visitCssMediaQueryRule', ast, context);
        ast.query.visit(this, context);
        ast.block.visit(this, context);
    };
    MyVisitor.prototype.visitCssSelectorRule = function (ast, context) {
        var _this = this;
        this._capture('visitCssSelectorRule', ast, context);
        ast.selectors.forEach(function (selAst) { selAst.visit(_this, context); });
        ast.block.visit(this, context);
    };
    MyVisitor.prototype.visitCssSelector = function (ast, context) {
        var _this = this;
        this._capture('visitCssSelector', ast, context);
        ast.selectorParts.forEach(function (simpleAst) { simpleAst.visit(_this, context); });
    };
    MyVisitor.prototype.visitCssSimpleSelector = function (ast, context) {
        var _this = this;
        this._capture('visitCssSimpleSelector', ast, context);
        ast.pseudoSelectors.forEach(function (pseudoAst) { pseudoAst.visit(_this, context); });
    };
    MyVisitor.prototype.visitCssDefinition = function (ast, context) {
        this._capture('visitCssDefinition', ast, context);
        ast.value.visit(this, context);
    };
    MyVisitor.prototype.visitCssBlock = function (ast, context) {
        var _this = this;
        this._capture('visitCssBlock', ast, context);
        ast.entries.forEach(function (entryAst) { entryAst.visit(_this, context); });
    };
    MyVisitor.prototype.visitCssStylesBlock = function (ast, context) {
        var _this = this;
        this._capture('visitCssStylesBlock', ast, context);
        ast.definitions.forEach(function (definitionAst) { definitionAst.visit(_this, context); });
    };
    MyVisitor.prototype.visitCssStyleSheet = function (ast, context) {
        var _this = this;
        this._capture('visitCssStyleSheet', ast, context);
        ast.rules.forEach(function (ruleAst) { ruleAst.visit(_this, context); });
    };
    MyVisitor.prototype.visitCssUnknownRule = function (ast, context) {
        this._capture('visitCssUnknownRule', ast, context);
    };
    MyVisitor.prototype.visitCssUnknownTokenList = function (ast, context) {
        this._capture('visitCssUnknownTokenList', ast, context);
    };
    MyVisitor.prototype.visitCssPseudoSelector = function (ast, context) {
        this._capture('visitCssPseudoSelector', ast, context);
    };
    return MyVisitor;
}());
function _getCaptureAst(capture, index) {
    if (index === void 0) { index = 0; }
    return capture[index][0];
}
(function () {
    function parse(cssCode, ignoreErrors) {
        if (ignoreErrors === void 0) { ignoreErrors = false; }
        var output = new css_parser_1.CssParser().parse(cssCode, 'some-fake-css-file.css');
        var errors = output.errors;
        if (errors.length > 0 && !ignoreErrors) {
            throw new Error(errors.map(function (error) { return error.msg; }).join(', '));
        }
        return output.ast;
    }
    testing_internal_1.describe('CSS parsing and visiting', function () {
        var ast;
        var context = {};
        testing_internal_1.beforeEach(function () {
            var cssCode = "\n        .rule1 { prop1: value1 }\n        .rule2 { prop2: value2 }\n\n        @media all (max-width: 100px) {\n          #id { prop3 :value3; }\n        }\n\n        @import url(file.css);\n\n        @keyframes rotate {\n          from {\n            prop4: value4;\n          }\n          50%, 100% {\n            prop5: value5;\n          }\n        }\n      ";
            ast = parse(cssCode);
        });
        testing_internal_1.it('should parse and visit a stylesheet', function () {
            var visitor = new MyVisitor(ast, context);
            var captures = visitor.captures['visitCssStyleSheet'];
            testing_internal_1.expect(captures.length).toEqual(1);
            var capture = captures[0];
            testing_internal_1.expect(capture[0]).toEqual(ast);
            testing_internal_1.expect(capture[1]).toEqual(context);
        });
        testing_internal_1.it('should parse and visit each of the stylesheet selectors', function () {
            var visitor = new MyVisitor(ast, context);
            var captures = visitor.captures['visitCssSelectorRule'];
            testing_internal_1.expect(captures.length).toEqual(3);
            var rule1 = _getCaptureAst(captures, 0);
            testing_internal_1.expect(rule1).toEqual(ast.rules[0]);
            var firstSelector = rule1.selectors[0];
            var firstSimpleSelector = firstSelector.selectorParts[0];
            _assertTokens(firstSimpleSelector.tokens, ['.', 'rule1']);
            var rule2 = _getCaptureAst(captures, 1);
            testing_internal_1.expect(rule2).toEqual(ast.rules[1]);
            var secondSelector = rule2.selectors[0];
            var secondSimpleSelector = secondSelector.selectorParts[0];
            _assertTokens(secondSimpleSelector.tokens, ['.', 'rule2']);
            var rule3 = _getCaptureAst(captures, 2);
            testing_internal_1.expect(rule3).toEqual(ast.rules[2].block.entries[0]);
            var thirdSelector = rule3.selectors[0];
            var thirdSimpleSelector = thirdSelector.selectorParts[0];
            _assertTokens(thirdSimpleSelector.tokens, ['#', 'rule3']);
        });
        testing_internal_1.it('should parse and visit each of the stylesheet style key/value definitions', function () {
            var visitor = new MyVisitor(ast, context);
            var captures = visitor.captures['visitCssDefinition'];
            testing_internal_1.expect(captures.length).toEqual(5);
            var def1 = _getCaptureAst(captures, 0);
            testing_internal_1.expect(def1.property.strValue).toEqual('prop1');
            testing_internal_1.expect(def1.value.tokens[0].strValue).toEqual('value1');
            var def2 = _getCaptureAst(captures, 1);
            testing_internal_1.expect(def2.property.strValue).toEqual('prop2');
            testing_internal_1.expect(def2.value.tokens[0].strValue).toEqual('value2');
            var def3 = _getCaptureAst(captures, 2);
            testing_internal_1.expect(def3.property.strValue).toEqual('prop3');
            testing_internal_1.expect(def3.value.tokens[0].strValue).toEqual('value3');
            var def4 = _getCaptureAst(captures, 3);
            testing_internal_1.expect(def4.property.strValue).toEqual('prop4');
            testing_internal_1.expect(def4.value.tokens[0].strValue).toEqual('value4');
            var def5 = _getCaptureAst(captures, 4);
            testing_internal_1.expect(def5.property.strValue).toEqual('prop5');
            testing_internal_1.expect(def5.value.tokens[0].strValue).toEqual('value5');
        });
        testing_internal_1.it('should parse and visit the associated media query values', function () {
            var visitor = new MyVisitor(ast, context);
            var captures = visitor.captures['visitCssMediaQueryRule'];
            testing_internal_1.expect(captures.length).toEqual(1);
            var query1 = _getCaptureAst(captures, 0);
            _assertTokens(query1.query.tokens, ['all', 'and', '(', 'max-width', '100', 'px', ')']);
            testing_internal_1.expect(query1.block.entries.length).toEqual(1);
        });
        testing_internal_1.it('should capture the media query predicate', function () {
            var visitor = new MyVisitor(ast, context);
            var captures = visitor.captures['visitCssAtRulePredicate'];
            testing_internal_1.expect(captures.length).toEqual(1);
            var predicate = _getCaptureAst(captures, 0);
            testing_internal_1.expect(predicate.strValue).toEqual('@media all (max-width: 100px)');
        });
        testing_internal_1.it('should parse and visit the associated "@inline" rule values', function () {
            var visitor = new MyVisitor(ast, context);
            var captures = visitor.captures['visitCssInlineRule'];
            testing_internal_1.expect(captures.length).toEqual(1);
            var inline1 = _getCaptureAst(captures, 0);
            testing_internal_1.expect(inline1.type).toEqual(css_parser_1.BlockType.Import);
            _assertTokens(inline1.value.tokens, ['url', '(', 'file.css', ')']);
        });
        testing_internal_1.it('should parse and visit the keyframe blocks', function () {
            var visitor = new MyVisitor(ast, context);
            var captures = visitor.captures['visitCssKeyframeRule'];
            testing_internal_1.expect(captures.length).toEqual(1);
            var keyframe1 = _getCaptureAst(captures, 0);
            testing_internal_1.expect(keyframe1.name.strValue).toEqual('rotate');
            testing_internal_1.expect(keyframe1.block.entries.length).toEqual(2);
        });
        testing_internal_1.it('should parse and visit the associated keyframe rules', function () {
            var visitor = new MyVisitor(ast, context);
            var captures = visitor.captures['visitCssKeyframeDefinition'];
            testing_internal_1.expect(captures.length).toEqual(2);
            var def1 = _getCaptureAst(captures, 0);
            _assertTokens(def1.steps, ['from']);
            testing_internal_1.expect(def1.block.entries.length).toEqual(1);
            var def2 = _getCaptureAst(captures, 1);
            _assertTokens(def2.steps, ['50%', '100%']);
            testing_internal_1.expect(def2.block.entries.length).toEqual(1);
        });
        testing_internal_1.it('should visit an unknown `@` rule', function () {
            var cssCode = "\n        @someUnknownRule param {\n          one two three\n        }\n      ";
            ast = parse(cssCode, true);
            var visitor = new MyVisitor(ast, context);
            var captures = visitor.captures['visitCssUnknownRule'];
            testing_internal_1.expect(captures.length).toEqual(1);
            var rule = _getCaptureAst(captures, 0);
            testing_internal_1.expect(rule.ruleName).toEqual('@someUnknownRule');
            _assertTokens(rule.tokens, ['param', '{', 'one', 'two', 'three', '}']);
        });
        testing_internal_1.it('should collect an invalid list of tokens before a valid selector', function () {
            var cssCode = 'one two three four five; selector { }';
            ast = parse(cssCode, true);
            var visitor = new MyVisitor(ast, context);
            var captures = visitor.captures['visitCssUnknownTokenList'];
            testing_internal_1.expect(captures.length).toEqual(1);
            var rule = _getCaptureAst(captures, 0);
            _assertTokens(rule.tokens, ['one', 'two', 'three', 'four', 'five']);
        });
        testing_internal_1.it('should collect an invalid list of tokens after a valid selector', function () {
            var cssCode = 'selector { } six seven eight';
            ast = parse(cssCode, true);
            var visitor = new MyVisitor(ast, context);
            var captures = visitor.captures['visitCssUnknownTokenList'];
            testing_internal_1.expect(captures.length).toEqual(1);
            var rule = _getCaptureAst(captures, 0);
            _assertTokens(rule.tokens, ['six', 'seven', 'eight']);
        });
    });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NzX3Zpc2l0b3Jfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvY3NzX3BhcnNlci9jc3NfdmlzaXRvcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsK0VBQTRGO0FBRTVGLDhEQUE4RjtBQUU5Rix1QkFBdUIsTUFBa0IsRUFBRSxTQUFtQjtJQUM1RCx5QkFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3RDLHlCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM1QztBQUNILENBQUM7QUFFRDtJQVdFLG1CQUFZLEdBQXFCLEVBQUUsT0FBWTtRQVYvQyxhQUFRLEdBQTJCLEVBQUUsQ0FBQztRQVVhLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQUMsQ0FBQztJQVI5RTs7T0FFRztJQUNILDRCQUFRLEdBQVIsVUFBUyxNQUFjLEVBQUUsR0FBVyxFQUFFLE9BQVk7UUFDaEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNwRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFJRCxpQ0FBYSxHQUFiLFVBQWMsR0FBcUIsRUFBRSxPQUFZO1FBQy9DLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsc0NBQWtCLEdBQWxCLFVBQW1CLEdBQXFCLEVBQUUsT0FBWTtRQUNwRCxJQUFJLENBQUMsUUFBUSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQsMkNBQXVCLEdBQXZCLFVBQXdCLEdBQTBCLEVBQUUsT0FBWTtRQUM5RCxJQUFJLENBQUMsUUFBUSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsd0NBQW9CLEdBQXBCLFVBQXFCLEdBQXVCLEVBQUUsT0FBWTtRQUN4RCxJQUFJLENBQUMsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwRCxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELDhDQUEwQixHQUExQixVQUEyQixHQUE2QixFQUFFLE9BQVk7UUFDcEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDMUQsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCwwQ0FBc0IsR0FBdEIsVUFBdUIsR0FBeUIsRUFBRSxPQUFZO1FBQzVELElBQUksQ0FBQyxRQUFRLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3RELEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMvQixHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELHdDQUFvQixHQUFwQixVQUFxQixHQUF1QixFQUFFLE9BQVk7UUFBMUQsaUJBSUM7UUFIQyxJQUFJLENBQUMsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwRCxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQXNCLElBQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRixHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELG9DQUFnQixHQUFoQixVQUFpQixHQUFtQixFQUFFLE9BQVk7UUFBbEQsaUJBSUM7UUFIQyxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNoRCxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FDckIsVUFBQyxTQUErQixJQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQUVELDBDQUFzQixHQUF0QixVQUF1QixHQUF5QixFQUFFLE9BQVk7UUFBOUQsaUJBSUM7UUFIQyxJQUFJLENBQUMsUUFBUSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN0RCxHQUFHLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FDdkIsVUFBQyxTQUErQixJQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQUVELHNDQUFrQixHQUFsQixVQUFtQixHQUFxQixFQUFFLE9BQVk7UUFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEQsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxpQ0FBYSxHQUFiLFVBQWMsR0FBZ0IsRUFBRSxPQUFZO1FBQTVDLGlCQUdDO1FBRkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsUUFBZ0IsSUFBTyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFFRCx1Q0FBbUIsR0FBbkIsVUFBb0IsR0FBc0IsRUFBRSxPQUFZO1FBQXhELGlCQUlDO1FBSEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbkQsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQ25CLFVBQUMsYUFBK0IsSUFBTyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BGLENBQUM7SUFFRCxzQ0FBa0IsR0FBbEIsVUFBbUIsR0FBcUIsRUFBRSxPQUFZO1FBQXRELGlCQUdDO1FBRkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEQsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFtQixJQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQUVELHVDQUFtQixHQUFuQixVQUFvQixHQUFzQixFQUFFLE9BQVk7UUFDdEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELDRDQUF3QixHQUF4QixVQUF5QixHQUEyQixFQUFFLE9BQVk7UUFDaEUsSUFBSSxDQUFDLFFBQVEsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVELDBDQUFzQixHQUF0QixVQUF1QixHQUF5QixFQUFFLE9BQVk7UUFDNUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQTNGRCxJQTJGQztBQUVELHdCQUF3QixPQUFjLEVBQUUsS0FBUztJQUFULHNCQUFBLEVBQUEsU0FBUztJQUMvQyxPQUFlLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBRUQsQ0FBQztJQUNDLGVBQWUsT0FBZSxFQUFFLFlBQTZCO1FBQTdCLDZCQUFBLEVBQUEsb0JBQTZCO1FBQzNELElBQU0sTUFBTSxHQUFHLElBQUksc0JBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztRQUN4RSxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQzdCLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBb0IsSUFBSyxPQUFBLEtBQUssQ0FBQyxHQUFHLEVBQVQsQ0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDN0U7UUFDRCxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDcEIsQ0FBQztJQUVELDJCQUFRLENBQUMsMEJBQTBCLEVBQUU7UUFDbkMsSUFBSSxHQUFxQixDQUFDO1FBQzFCLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUVuQiw2QkFBVSxDQUFDO1lBQ1QsSUFBTSxPQUFPLEdBQUcsNldBa0JmLENBQUM7WUFDRixHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO1FBRUgscUJBQUUsQ0FBQyxxQ0FBcUMsRUFBRTtZQUN4QyxJQUFNLE9BQU8sR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDNUMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBRXhELHlCQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVuQyxJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIseUJBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEMseUJBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxxQkFBRSxDQUFDLHlEQUF5RCxFQUFFO1lBQzVELElBQU0sT0FBTyxHQUFHLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM1QyxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFFMUQseUJBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRW5DLElBQU0sS0FBSyxHQUF1QixjQUFjLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzlELHlCQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUF1QixDQUFDLENBQUM7WUFFMUQsSUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QyxJQUFNLG1CQUFtQixHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0QsYUFBYSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBRTFELElBQU0sS0FBSyxHQUF1QixjQUFjLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzlELHlCQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUF1QixDQUFDLENBQUM7WUFFMUQsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQyxJQUFNLG9CQUFvQixHQUFHLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0QsYUFBYSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBRTNELElBQU0sS0FBSyxHQUF1QixjQUFjLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzlELHlCQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUNoQixHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBd0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBdUIsQ0FBQyxDQUFDO1lBRWpGLElBQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBTSxtQkFBbUIsR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNELGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMsMkVBQTJFLEVBQUU7WUFDOUUsSUFBTSxPQUFPLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzVDLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUV4RCx5QkFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFbkMsSUFBTSxJQUFJLEdBQXFCLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDM0QseUJBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNoRCx5QkFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUV4RCxJQUFNLElBQUksR0FBcUIsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMzRCx5QkFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2hELHlCQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXhELElBQU0sSUFBSSxHQUFxQixjQUFjLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNELHlCQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDaEQseUJBQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFeEQsSUFBTSxJQUFJLEdBQXFCLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDM0QseUJBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNoRCx5QkFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUV4RCxJQUFNLElBQUksR0FBcUIsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMzRCx5QkFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2hELHlCQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFELENBQUMsQ0FBQyxDQUFDO1FBRUgscUJBQUUsQ0FBQywwREFBMEQsRUFBRTtZQUM3RCxJQUFNLE9BQU8sR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDNUMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBRTVELHlCQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVuQyxJQUFNLE1BQU0sR0FBeUIsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNqRSxhQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3ZGLHlCQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO1FBRUgscUJBQUUsQ0FBQywwQ0FBMEMsRUFBRTtZQUM3QyxJQUFNLE9BQU8sR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDNUMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBRTdELHlCQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVuQyxJQUFNLFNBQVMsR0FBMEIsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNyRSx5QkFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUN0RSxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMsNkRBQTZELEVBQUU7WUFDaEUsSUFBTSxPQUFPLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzVDLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUV4RCx5QkFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFbkMsSUFBTSxPQUFPLEdBQXFCLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDOUQseUJBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHNCQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDL0MsYUFBYSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNyRSxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMsNENBQTRDLEVBQUU7WUFDL0MsSUFBTSxPQUFPLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzVDLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUUxRCx5QkFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFbkMsSUFBTSxTQUFTLEdBQXVCLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbEUseUJBQU0sQ0FBQyxTQUFTLENBQUMsSUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNwRCx5QkFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMsc0RBQXNELEVBQUU7WUFDekQsSUFBTSxPQUFPLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzVDLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUVoRSx5QkFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFbkMsSUFBTSxJQUFJLEdBQTZCLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkUsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLHlCQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTdDLElBQU0sSUFBSSxHQUE2QixjQUFjLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ25FLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDM0MseUJBQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxxQkFBRSxDQUFDLGtDQUFrQyxFQUFFO1lBQ3JDLElBQU0sT0FBTyxHQUFHLGdGQUlmLENBQUM7WUFDRixHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzQixJQUFNLE9BQU8sR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDNUMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBRXpELHlCQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVuQyxJQUFNLElBQUksR0FBc0IsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM1RCx5QkFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUVsRCxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6RSxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMsa0VBQWtFLEVBQUU7WUFDckUsSUFBTSxPQUFPLEdBQUcsdUNBQXVDLENBQUM7WUFDeEQsR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDM0IsSUFBTSxPQUFPLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzVDLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUU5RCx5QkFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFbkMsSUFBTSxJQUFJLEdBQTJCLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDakUsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN0RSxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMsaUVBQWlFLEVBQUU7WUFDcEUsSUFBTSxPQUFPLEdBQUcsOEJBQThCLENBQUM7WUFDL0MsR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDM0IsSUFBTSxPQUFPLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzVDLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUU5RCx5QkFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFbkMsSUFBTSxJQUFJLEdBQTJCLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDakUsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxFQUFFLENBQUMifQ==