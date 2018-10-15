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
var ast_1 = require("../../../src/expression_parser/ast");
var unparser_1 = require("./unparser");
var ASTValidator = /** @class */ (function (_super) {
    __extends(ASTValidator, _super);
    function ASTValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ASTValidator.prototype.visit = function (ast) {
        this.parentSpan = undefined;
        ast.visit(this);
    };
    ASTValidator.prototype.validate = function (ast, cb) {
        if (!inSpan(ast.span, this.parentSpan)) {
            if (this.parentSpan) {
                var parentSpan = this.parentSpan;
                throw Error("Invalid AST span [expected (" + ast.span.start + ", " + ast.span.end + ") to be in (" + parentSpan.start + ",  " + parentSpan.end + ") for " + unparser_1.unparse(ast));
            }
            else {
                throw Error("Invalid root AST span for " + unparser_1.unparse(ast));
            }
        }
        var oldParent = this.parentSpan;
        this.parentSpan = ast.span;
        cb();
        this.parentSpan = oldParent;
    };
    ASTValidator.prototype.visitBinary = function (ast, context) {
        var _this = this;
        this.validate(ast, function () { return _super.prototype.visitBinary.call(_this, ast, context); });
    };
    ASTValidator.prototype.visitChain = function (ast, context) {
        var _this = this;
        this.validate(ast, function () { return _super.prototype.visitChain.call(_this, ast, context); });
    };
    ASTValidator.prototype.visitConditional = function (ast, context) {
        var _this = this;
        this.validate(ast, function () { return _super.prototype.visitConditional.call(_this, ast, context); });
    };
    ASTValidator.prototype.visitFunctionCall = function (ast, context) {
        var _this = this;
        this.validate(ast, function () { return _super.prototype.visitFunctionCall.call(_this, ast, context); });
    };
    ASTValidator.prototype.visitImplicitReceiver = function (ast, context) {
        var _this = this;
        this.validate(ast, function () { return _super.prototype.visitImplicitReceiver.call(_this, ast, context); });
    };
    ASTValidator.prototype.visitInterpolation = function (ast, context) {
        var _this = this;
        this.validate(ast, function () { return _super.prototype.visitInterpolation.call(_this, ast, context); });
    };
    ASTValidator.prototype.visitKeyedRead = function (ast, context) {
        var _this = this;
        this.validate(ast, function () { return _super.prototype.visitKeyedRead.call(_this, ast, context); });
    };
    ASTValidator.prototype.visitKeyedWrite = function (ast, context) {
        var _this = this;
        this.validate(ast, function () { return _super.prototype.visitKeyedWrite.call(_this, ast, context); });
    };
    ASTValidator.prototype.visitLiteralArray = function (ast, context) {
        var _this = this;
        this.validate(ast, function () { return _super.prototype.visitLiteralArray.call(_this, ast, context); });
    };
    ASTValidator.prototype.visitLiteralMap = function (ast, context) {
        var _this = this;
        this.validate(ast, function () { return _super.prototype.visitLiteralMap.call(_this, ast, context); });
    };
    ASTValidator.prototype.visitLiteralPrimitive = function (ast, context) {
        var _this = this;
        this.validate(ast, function () { return _super.prototype.visitLiteralPrimitive.call(_this, ast, context); });
    };
    ASTValidator.prototype.visitMethodCall = function (ast, context) {
        var _this = this;
        this.validate(ast, function () { return _super.prototype.visitMethodCall.call(_this, ast, context); });
    };
    ASTValidator.prototype.visitPipe = function (ast, context) {
        var _this = this;
        this.validate(ast, function () { return _super.prototype.visitPipe.call(_this, ast, context); });
    };
    ASTValidator.prototype.visitPrefixNot = function (ast, context) {
        var _this = this;
        this.validate(ast, function () { return _super.prototype.visitPrefixNot.call(_this, ast, context); });
    };
    ASTValidator.prototype.visitPropertyRead = function (ast, context) {
        var _this = this;
        this.validate(ast, function () { return _super.prototype.visitPropertyRead.call(_this, ast, context); });
    };
    ASTValidator.prototype.visitPropertyWrite = function (ast, context) {
        var _this = this;
        this.validate(ast, function () { return _super.prototype.visitPropertyWrite.call(_this, ast, context); });
    };
    ASTValidator.prototype.visitQuote = function (ast, context) {
        var _this = this;
        this.validate(ast, function () { return _super.prototype.visitQuote.call(_this, ast, context); });
    };
    ASTValidator.prototype.visitSafeMethodCall = function (ast, context) {
        var _this = this;
        this.validate(ast, function () { return _super.prototype.visitSafeMethodCall.call(_this, ast, context); });
    };
    ASTValidator.prototype.visitSafePropertyRead = function (ast, context) {
        var _this = this;
        this.validate(ast, function () { return _super.prototype.visitSafePropertyRead.call(_this, ast, context); });
    };
    return ASTValidator;
}(ast_1.RecursiveAstVisitor));
function inSpan(span, parentSpan) {
    return !parentSpan || (span.start >= parentSpan.start && span.end <= parentSpan.end);
}
var sharedValidator = new ASTValidator();
function validate(ast) {
    sharedValidator.visit(ast);
    return ast;
}
exports.validate = validate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9leHByZXNzaW9uX3BhcnNlci91dGlscy92YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBRUgsMERBQStVO0FBRS9VLHVDQUFtQztBQUVuQztJQUEyQixnQ0FBbUI7SUFBOUM7O0lBbUdBLENBQUM7SUFoR0MsNEJBQUssR0FBTCxVQUFNLEdBQVE7UUFDWixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUM1QixHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFRCwrQkFBUSxHQUFSLFVBQVMsR0FBUSxFQUFFLEVBQWM7UUFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUN0QyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ25CLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUF1QixDQUFDO2dCQUNoRCxNQUFNLEtBQUssQ0FDUCxpQ0FBK0IsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLFVBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLG9CQUFlLFVBQVUsQ0FBQyxLQUFLLFdBQU0sVUFBVSxDQUFDLEdBQUcsY0FBUyxrQkFBTyxDQUFDLEdBQUcsQ0FBRyxDQUFDLENBQUM7YUFDL0k7aUJBQU07Z0JBQ0wsTUFBTSxLQUFLLENBQUMsK0JBQTZCLGtCQUFPLENBQUMsR0FBRyxDQUFHLENBQUMsQ0FBQzthQUMxRDtTQUNGO1FBQ0QsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNsQyxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDM0IsRUFBRSxFQUFFLENB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