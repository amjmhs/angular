"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compile_metadata_1 = require("./compile_metadata");
var core_1 = require("./core");
var o = require("./output/output_ast");
var shadow_css_1 = require("./shadow_css");
var COMPONENT_VARIABLE = '%COMP%';
var HOST_ATTR = "_nghost-" + COMPONENT_VARIABLE;
var CONTENT_ATTR = "_ngcontent-" + COMPONENT_VARIABLE;
var StylesCompileDependency = /** @class */ (function () {
    function StylesCompileDependency(name, moduleUrl, setValue) {
        this.name = name;
        this.moduleUrl = moduleUrl;
        this.setValue = setValue;
    }
    return StylesCompileDependency;
}());
exports.StylesCompileDependency = StylesCompileDependency;
var CompiledStylesheet = /** @class */ (function () {
    function CompiledStylesheet(outputCtx, stylesVar, dependencies, isShimmed, meta) {
        this.outputCtx = outputCtx;
        this.stylesVar = stylesVar;
        this.dependencies = dependencies;
        this.isShimmed = isShimmed;
        this.meta = meta;
    }
    return CompiledStylesheet;
}());
exports.CompiledStylesheet = CompiledStylesheet;
var StyleCompiler = /** @class */ (function () {
    function StyleCompiler(_urlResolver) {
        this._urlResolver = _urlResolver;
        this._shadowCss = new shadow_css_1.ShadowCss();
    }
    StyleCompiler.prototype.compileComponent = function (outputCtx, comp) {
        var template = comp.template;
        return this._compileStyles(outputCtx, comp, new compile_metadata_1.CompileStylesheetMetadata({
            styles: template.styles,
            styleUrls: template.styleUrls,
            moduleUrl: compile_metadata_1.identifierModuleUrl(comp.type)
        }), this.needsStyleShim(comp), true);
    };
    StyleCompiler.prototype.compileStyles = function (outputCtx, comp, stylesheet, shim) {
        if (shim === void 0) { shim = this.needsStyleShim(comp); }
        return this._compileStyles(outputCtx, comp, stylesheet, shim, false);
    };
    StyleCompiler.prototype.needsStyleShim = function (comp) {
        return comp.template.encapsulation === core_1.ViewEncapsulation.Emulated;
    };
    StyleCompiler.prototype._compileStyles = function (outputCtx, comp, stylesheet, shim, isComponentStylesheet) {
        var _this = this;
        var styleExpressions = stylesheet.styles.map(function (plainStyle) { return o.literal(_this._shimIfNeeded(plainStyle, shim)); });
        var dependencies = [];
        stylesheet.styleUrls.forEach(function (styleUrl) {
            var exprIndex = styleExpressions.length;
            // Note: This placeholder will be filled later.
            styleExpressions.push(null);
            dependencies.push(new StylesCompileDependency(getStylesVarName(null), styleUrl, function (value) { return styleExpressions[exprIndex] = outputCtx.importExpr(value); }));
        });
        // styles variable contains plain strings and arrays of other styles arrays (recursive),
        // so we set its type to dynamic.
        var stylesVar = getStylesVarName(isComponentStylesheet ? comp : null);
        var stmt = o.variable(stylesVar)
            .set(o.literalArr(styleExpressions, new o.ArrayType(o.DYNAMIC_TYPE, [o.TypeModifier.Const])))
            .toDeclStmt(null, isComponentStylesheet ? [o.StmtModifier.Final] : [
            o.StmtModifier.Final, o.StmtModifier.Exported
        ]);
        outputCtx.statements.push(stmt);
        return new CompiledStylesheet(outputCtx, stylesVar, dependencies, shim, stylesheet);
    };
    StyleCompiler.prototype._shimIfNeeded = function (style, shim) {
        return shim ? this._shadowCss.shimCssText(style, CONTENT_ATTR, HOST_ATTR) : style;
    };
    return StyleCompiler;
}());
exports.StyleCompiler = StyleCompiler;
function getStylesVarName(component) {
    var result = "styles";
    if (component) {
        result += "_" + compile_metadata_1.identifierName(component.type);
    }
    return result;
}
//# sourceMappingURL=style_compiler.js.map