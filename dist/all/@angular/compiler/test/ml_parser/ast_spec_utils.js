"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var html = require("../../src/ml_parser/ast");
function humanizeDom(parseResult, addSourceSpan) {
    if (addSourceSpan === void 0) { addSourceSpan = false; }
    if (parseResult.errors.length > 0) {
        var errorString = parseResult.errors.join('\n');
        throw new Error("Unexpected parse errors:\n" + errorString);
    }
    return humanizeNodes(parseResult.rootNodes, addSourceSpan);
}
exports.humanizeDom = humanizeDom;
function humanizeDomSourceSpans(parseResult) {
    return humanizeDom(parseResult, true);
}
exports.humanizeDomSourceSpans = humanizeDomSourceSpans;
function humanizeNodes(nodes, addSourceSpan) {
    if (addSourceSpan === void 0) { addSourceSpan = false; }
    var humanizer = new _Humanizer(addSourceSpan);
    html.visitAll(humanizer, nodes);
    return humanizer.result;
}
exports.humanizeNodes = humanizeNodes;
function humanizeLineColumn(location) {
    return location.line + ":" + location.col;
}
exports.humanizeLineColumn = humanizeLineColumn;
var _Humanizer = /** @class */ (function () {
    function _Humanizer(includeSourceSpan) {
        this.includeSourceSpan = includeSourceSpan;
        this.result = [];
        this.elDepth = 0;
    }
    _Humanizer.prototype.visitElement = function (element, context) {
        var res = this._appendContext(element, [html.Element, element.name, this.elDepth++]);
        this.result.push(res);
        html.visitAll(this, element.attrs);
        html.visitAll(this, element.children);
        this.elDepth--;
    };
    _Humanizer.prototype.visitAttribute = function (attribute, context) {
        var res = this._appendContext(attribute, [html.Attribute, attribute.name, attribute.value]);
        this.result.push(res);
    };
    _Humanizer.prototype.visitText = function (text, context) {
        var res = this._appendContext(text, [html.Text, text.value, this.elDepth]);
        this.result.push(res);
    };
    _Humanizer.prototype.visitComment = function (comment, context) {
        var res = this._appendContext(comment, [html.Comment, comment.value, this.elDepth]);
        this.result.push(res);
    };
    _Humanizer.prototype.visitExpansion = function (expansion, context) {
        var res = this._appendContext(expansion, [html.Expansion, expansion.switchValue, expansion.type, this.elDepth++]);
        this.result.push(res);
        html.visitAll(this, expansion.cases);
        this.elDepth--;
    };
    _Humanizer.prototype.visitExpansionCase = function (expansionCase, context) {
        var res = this._appendContext(expansionCase, [html.ExpansionCase, expansionCase.value, this.elDepth]);
        this.result.push(res);
    };
    _Humanizer.prototype._appendContext = function (ast, input) {
        if (!this.includeSourceSpan)
            return input;
        input.push(ast.sourceSpan.toString());
        return input;
    };
    return _Humanizer;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0X3NwZWNfdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L21sX3BhcnNlci9hc3Rfc3BlY191dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDhDQUFnRDtBQUloRCxxQkFBNEIsV0FBNEIsRUFBRSxhQUE4QjtJQUE5Qiw4QkFBQSxFQUFBLHFCQUE4QjtJQUN0RixJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUNqQyxJQUFNLFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsRCxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUE2QixXQUFhLENBQUMsQ0FBQztLQUM3RDtJQUVELE9BQU8sYUFBYSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDN0QsQ0FBQztBQVBELGtDQU9DO0FBRUQsZ0NBQXVDLFdBQTRCO0lBQ2pFLE9BQU8sV0FBVyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBRkQsd0RBRUM7QUFFRCx1QkFBOEIsS0FBa0IsRUFBRSxhQUE4QjtJQUE5Qiw4QkFBQSxFQUFBLHFCQUE4QjtJQUM5RSxJQUFNLFNBQVMsR0FBRyxJQUFJLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNoRCxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoQyxPQUFPLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFDMUIsQ0FBQztBQUpELHNDQUlDO0FBRUQsNEJBQW1DLFFBQXVCO0lBQ3hELE9BQVUsUUFBUSxDQUFDLElBQUksU0FBSSxRQUFRLENBQUMsR0FBSyxDQUFDO0FBQzVDLENBQUM7QUFGRCxnREFFQztBQUVEO0lBSUUsb0JBQW9CLGlCQUEw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