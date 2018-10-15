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
var walker_1 = require("tslint/lib/language/walker");
var rules_1 = require("tslint/lib/rules");
var ts = require("typescript");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var typedefWalker = new TypedefWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(typedefWalker);
    };
    return Rule;
}(rules_1.AbstractRule));
exports.Rule = Rule;
var TypedefWalker = /** @class */ (function (_super) {
    __extends(TypedefWalker, _super);
    function TypedefWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TypedefWalker.prototype.visitPropertyDeclaration = function (node) {
        this.assertInternalAnnotationPresent(node);
        _super.prototype.visitPropertyDeclaration.call(this, node);
    };
    TypedefWalker.prototype.visitMethodDeclaration = function (node) {
        this.assertInternalAnnotationPresent(node);
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    TypedefWalker.prototype.hasInternalAnnotation = function (range) {
        var text = this.getSourceFile().text;
        var comment = text.substring(range.pos, range.end);
        return comment.indexOf('@internal') >= 0;
    };
    TypedefWalker.prototype.assertInternalAnnotationPresent = function (node) {
        if (node.name && node.name.getText().charAt(0) !== '_')
            return;
        if (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Private)
            return;
        var ranges = ts.getLeadingCommentRanges(this.getSourceFile().text, node.pos);
        if (ranges) {
            for (var i = 0; i < ranges.length; i++) {
                if (this.hasInternalAnnotation(ranges[i]))
                    return;
            }
        }
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), "module-private member " + node.name.getText() + " must be annotated @internal"));
    };
    return TypedefWalker;
}(walker_1.RuleWalker));
//# sourceMappingURL=requireInternalWithUnderscoreRule.js.map