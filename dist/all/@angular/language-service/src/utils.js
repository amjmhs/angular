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
var ts = require("typescript");
function isParseSourceSpan(value) {
    return value && !!value.start;
}
exports.isParseSourceSpan = isParseSourceSpan;
function spanOf(span) {
    if (!span)
        return undefined;
    if (isParseSourceSpan(span)) {
        return { start: span.start.offset, end: span.end.offset };
    }
    else {
        if (span.endSourceSpan) {
            return { start: span.sourceSpan.start.offset, end: span.endSourceSpan.end.offset };
        }
        else if (span.children && span.children.length) {
            return {
                start: span.sourceSpan.start.offset,
                end: spanOf(span.children[span.children.length - 1]).end
            };
        }
        return { start: span.sourceSpan.start.offset, end: span.sourceSpan.end.offset };
    }
}
exports.spanOf = spanOf;
function inSpan(position, span, exclusive) {
    return span != null && (exclusive ? position >= span.start && position < span.end :
        position >= span.start && position <= span.end);
}
exports.inSpan = inSpan;
function offsetSpan(span, amount) {
    return { start: span.start + amount, end: span.end + amount };
}
exports.offsetSpan = offsetSpan;
function isNarrower(spanA, spanB) {
    return spanA.start >= spanB.start && spanA.end <= spanB.end;
}
exports.isNarrower = isNarrower;
function hasTemplateReference(type) {
    if (type.diDeps) {
        for (var _i = 0, _a = type.diDeps; _i < _a.length; _i++) {
            var diDep = _a[_i];
            if (diDep.token && diDep.token.identifier &&
                compiler_1.identifierName(diDep.token.identifier) == 'TemplateRef')
                return true;
        }
    }
    return false;
}
exports.hasTemplateReference = hasTemplateReference;
function getSelectors(info) {
    var map = new Map();
    var selectors = flatten(info.directives.map(function (directive) {
        var selectors = compiler_1.CssSelector.parse(directive.selector);
        selectors.forEach(function (selector) { return map.set(selector, directive); });
        return selectors;
    }));
    return { selectors: selectors, map: map };
}
exports.getSelectors = getSelectors;
function flatten(a) {
    var _a;
    return (_a = []).concat.apply(_a, a);
}
exports.flatten = flatten;
function removeSuffix(value, suffix) {
    if (value.endsWith(suffix))
        return value.substring(0, value.length - suffix.length);
    return value;
}
exports.removeSuffix = removeSuffix;
function uniqueByName(elements) {
    if (elements) {
        var result = [];
        var set = new Set();
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            if (!set.has(element.name)) {
                set.add(element.name);
                result.push(element);
            }
        }
        return result;
    }
}
exports.uniqueByName = uniqueByName;
function isTypescriptVersion(low, high) {
    var version = ts.version;
    if (version.substring(0, low.length) < low)
        return false;
    if (high && (version.substring(0, high.length) > high))
        return false;
    return true;
}
exports.isTypescriptVersion = isTypescriptVersion;
function diagnosticInfoFromTemplateInfo(info) {
    return {
        fileName: info.fileName,
        offset: info.template.span.start,
        query: info.template.query,
        members: info.template.members,
        htmlAst: info.htmlAst,
        templateAst: info.templateAst
    };
}
exports.diagnosticInfoFromTemplateInfo = diagnosticInfoFromTemplateInfo;
function findTemplateAstAt(ast, position, allowWidening) {
    if (allowWidening === void 0) { allowWidening = false; }
    var path = [];
    var visitor = new /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.visit = function (ast, context) {
            var span = spanOf(ast);
            if (inSpan(position, span)) {
                var len = path.length;
                if (!len || allowWidening || isNarrower(span, spanOf(path[len - 1]))) {
                    path.push(ast);
                }
            }
            else {
                // Returning a value here will result in the children being skipped.
                return true;
            }
        };
        class_1.prototype.visitEmbeddedTemplate = function (ast, context) {
            return this.visitChildren(context, function (visit) {
                // Ignore reference, variable and providers
                visit(ast.attrs);
                visit(ast.directives);
                visit(ast.children);
            });
        };
        class_1.prototype.visitElement = function (ast, context) {
            return this.visitChildren(context, function (visit) {
                // Ingnore providers
                visit(ast.attrs);
                visit(ast.inputs);
                visit(ast.outputs);
                visit(ast.references);
                visit(ast.directives);
                visit(ast.children);
            });
        };
        class_1.prototype.visitDirective = function (ast, context) {
            // Ignore the host properties of a directive
            var result = this.visitChildren(context, function (visit) { visit(ast.inputs); });
            // We never care about the diretive itself, just its inputs.
            if (path[path.length - 1] == ast) {
                path.pop();
            }
            return result;
        };
        return class_1;
    }(compiler_1.RecursiveTemplateAstVisitor));
    compiler_1.templateVisitAll(visitor, ast);
    return new compiler_1.AstPath(path, position);
}
exports.findTemplateAstAt = findTemplateAstAt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sYW5ndWFnZS1zZXJ2aWNlL3NyYy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCw4Q0FBNlQ7QUFFN1QsK0JBQWlDO0FBV2pDLDJCQUFrQyxLQUFVO0lBQzFDLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQ2hDLENBQUM7QUFGRCw4Q0FFQztBQUtELGdCQUF1QixJQUFtQztJQUN4RCxJQUFJLENBQUMsSUFBSTtRQUFFLE9BQU8sU0FBUyxDQUFDO0lBQzVCLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDM0IsT0FBTyxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUMsQ0FBQztLQUN6RDtTQUFNO1FBQ0wsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3RCLE9BQU8sRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUMsQ0FBQztTQUNsRjthQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtZQUNoRCxPQUFPO2dCQUNMLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNO2dCQUNuQyxHQUFHLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUcsQ0FBQyxHQUFHO2FBQzNELENBQUM7U0FDSDtRQUNELE9BQU8sRUFB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