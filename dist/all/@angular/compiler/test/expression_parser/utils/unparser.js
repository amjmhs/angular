"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ast_1 = require("../../../src/expression_parser/ast");
var interpolation_config_1 = require("../../../src/ml_parser/interpolation_config");
var Unparser = /** @class */ (function () {
    function Unparser() {
    }
    Unparser.prototype.unparse = function (ast, interpolationConfig) {
        this._expression = '';
        this._interpolationConfig = interpolationConfig;
        this._visit(ast);
        return this._expression;
    };
    Unparser.prototype.visitPropertyRead = function (ast, context) {
        this._visit(ast.receiver);
        this._expression += ast.receiver instanceof ast_1.ImplicitReceiver ? "" + ast.name : "." + ast.name;
    };
    Unparser.prototype.visitPropertyWrite = function (ast, context) {
        this._visit(ast.receiver);
        this._expression +=
            ast.receiver instanceof ast_1.ImplicitReceiver ? ast.name + " = " : "." + ast.name + " = ";
        this._visit(ast.value);
    };
    Unparser.prototype.visitBinary = function (ast, context) {
        this._visit(ast.left);
        this._expression += " " + ast.operation + " ";
        this._visit(ast.right);
    };
    Unparser.prototype.visitChain = function (ast, context) {
        var len = ast.expressions.length;
        for (var i = 0; i < len; i++) {
            this._visit(ast.expressions[i]);
            this._expression += i == len - 1 ? ';' : '; ';
        }
    };
    Unparser.prototype.visitConditional = function (ast, context) {
        this._visit(ast.condition);
        this._expression += ' ? ';
        this._visit(ast.trueExp);
        this._expression += ' : ';
        this._visit(ast.falseExp);
    };
    Unparser.prototype.visitPipe = function (ast, context) {
        var _this = this;
        this._expression += '(';
        this._visit(ast.exp);
        this._expression += " | " + ast.name;
        ast.args.forEach(function (arg) {
            _this._expression += ':';
            _this._visit(arg);
        });
        this._expression += ')';
    };
    Unparser.prototype.visitFunctionCall = function (ast, context) {
        var _this = this;
        this._visit(ast.target);
        this._expression += '(';
        var isFirst = true;
        ast.args.forEach(function (arg) {
            if (!isFirst)
                _this._expression += ', ';
            isFirst = false;
            _this._visit(arg);
        });
        this._expression += ')';
    };
    Unparser.prototype.visitImplicitReceiver = function (ast, context) { };
    Unparser.prototype.visitInterpolation = function (ast, context) {
        for (var i = 0; i < ast.strings.length; i++) {
            this._expression += ast.strings[i];
            if (i < ast.expressions.length) {
                this._expression += this._interpolationConfig.start + " ";
                this._visit(ast.expressions[i]);
                this._expression += " " + this._interpolationConfig.end;
            }
        }
    };
    Unparser.prototype.visitKeyedRead = function (ast, context) {
        this._visit(ast.obj);
        this._expression += '[';
        this._visit(ast.key);
        this._expression += ']';
    };
    Unparser.prototype.visitKeyedWrite = function (ast, context) {
        this._visit(ast.obj);
        this._expression += '[';
        this._visit(ast.key);
        this._expression += '] = ';
        this._visit(ast.value);
    };
    Unparser.prototype.visitLiteralArray = function (ast, context) {
        var _this = this;
        this._expression += '[';
        var isFirst = true;
        ast.expressions.forEach(function (expression) {
            if (!isFirst)
                _this._expression += ', ';
            isFirst = false;
            _this._visit(expression);
        });
        this._expression += ']';
    };
    Unparser.prototype.visitLiteralMap = function (ast, context) {
        this._expression += '{';
        var isFirst = true;
        for (var i = 0; i < ast.keys.length; i++) {
            if (!isFirst)
                this._expression += ', ';
            isFirst = false;
            var key = ast.keys[i];
            this._expression += key.quoted ? JSON.stringify(key.key) : key.key;
            this._expression += ': ';
            this._visit(ast.values[i]);
        }
        this._expression += '}';
    };
    Unparser.prototype.visitLiteralPrimitive = function (ast, context) {
        if (typeof ast.value === 'string') {
            this._expression += "\"" + ast.value.replace(Unparser._quoteRegExp, '\"') + "\"";
        }
        else {
            this._expression += "" + ast.value;
        }
    };
    Unparser.prototype.visitMethodCall = function (ast, context) {
        var _this = this;
        this._visit(ast.receiver);
        this._expression += ast.receiver instanceof ast_1.ImplicitReceiver ? ast.name + "(" : "." + ast.name + "(";
        var isFirst = true;
        ast.args.forEach(function (arg) {
            if (!isFirst)
                _this._expression += ', ';
            isFirst = false;
            _this._visit(arg);
        });
        this._expression += ')';
    };
    Unparser.prototype.visitPrefixNot = function (ast, context) {
        this._expression += '!';
        this._visit(ast.expression);
    };
    Unparser.prototype.visitNonNullAssert = function (ast, context) {
        this._visit(ast.expression);
        this._expression += '!';
    };
    Unparser.prototype.visitSafePropertyRead = function (ast, context) {
        this._visit(ast.receiver);
        this._expression += "?." + ast.name;
    };
    Unparser.prototype.visitSafeMethodCall = function (ast, context) {
        var _this = this;
        this._visit(ast.receiver);
        this._expression += "?." + ast.name + "(";
        var isFirst = true;
        ast.args.forEach(function (arg) {
            if (!isFirst)
                _this._expression += ', ';
            isFirst = false;
            _this._visit(arg);
        });
        this._expression += ')';
    };
    Unparser.prototype.visitQuote = function (ast, context) {
        this._expression += ast.prefix + ":" + ast.uninterpretedExpression;
    };
    Unparser.prototype._visit = function (ast) { ast.visit(this); };
    Unparser._quoteRegExp = /"/g;
    return Unparser;
}());
var sharedUnparser = new Unparser();
function unparse(ast, interpolationConfig) {
    if (interpolationConfig === void 0) { interpolationConfig = interpolation_config_1.DEFAULT_INTERPOLATION_CONFIG; }
    return sharedUnparser.unparse(ast, interpolationConfig);
}
exports.unparse = unparse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5wYXJzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L2V4cHJlc3Npb25fcGFyc2VyL3V0aWxzL3VucGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMERBQTBVO0FBQzFVLG9GQUE4RztBQUU5RztJQUFBO0lBa0xBLENBQUM7SUEzS0MsMEJBQU8sR0FBUCxVQUFRLEdBQVEsRUFBRSxtQkFBd0M7UUFDeEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLG1CQUFtQixDQUFDO1FBQ2hELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7SUFFRCxvQ0FBaUIsR0FBakIsVUFBa0IsR0FBaUIsRUFBRSxPQUFZO1FBQy9DLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxXQUFXLElBQUksR0FBRyxDQUFDLFFBQVEsWUFBWSxzQkFBZ0IsQ0FBQyxDQUFDLENBQUMsS0FBRyxHQUFHLENBQUMsSUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFJLEdBQUcsQ0FBQyxJQUFNLENBQUM7SUFDaEcsQ0FBQztJQUVELHFDQUFrQixHQUFsQixVQUFtQixHQUFrQixFQUFFLE9BQVk7UUFDakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLFdBQVc7WUFDWixHQUFHLENBQUMsUUFBUSxZQUFZLHNCQUFnQixDQUFDLENBQUMsQ0FBSSxHQUFHLENBQUMsSUFBSSxRQUFLLENBQUMsQ0FBQyxDQUFDLE1BQUksR0FBRyxDQUFDLElBQUksUUFBSyxDQUFDO1FBQ3BGLElBQUksQ0FBQyxN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