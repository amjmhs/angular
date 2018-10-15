/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CompileStylesheetMetadata, identifierModuleUrl, identifierName } from './compile_metadata';
import { ViewEncapsulation } from './core';
import * as o from './output/output_ast';
import { ShadowCss } from './shadow_css';
/** @type {?} */
var COMPONENT_VARIABLE = '%COMP%';
/** @type {?} */
var HOST_ATTR = "_nghost-" + COMPONENT_VARIABLE;
/** @type {?} */
var CONTENT_ATTR = "_ngcontent-" + COMPONENT_VARIABLE;
var StylesCompileDependency = /** @class */ (function () {
    function StylesCompileDependency(name, moduleUrl, setValue) {
        this.name = name;
        this.moduleUrl = moduleUrl;
        this.setValue = setValue;
    }
    return StylesCompileDependency;
}());
export { StylesCompileDependency };
if (false) {
    /** @type {?} */
    StylesCompileDependency.prototype.name;
    /** @type {?} */
    StylesCompileDependency.prototype.moduleUrl;
    /** @type {?} */
    StylesCompileDependency.prototype.setValue;
}
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
export { CompiledStylesheet };
if (false) {
    /** @type {?} */
    CompiledStylesheet.prototype.outputCtx;
    /** @type {?} */
    CompiledStylesheet.prototype.stylesVar;
    /** @type {?} */
    CompiledStylesheet.prototype.dependencies;
    /** @type {?} */
    CompiledStylesheet.prototype.isShimmed;
    /** @type {?} */
    CompiledStylesheet.prototype.meta;
}
var StyleCompiler = /** @class */ (function () {
    function StyleCompiler(_urlResolver) {
        this._urlResolver = _urlResolver;
        this._shadowCss = new ShadowCss();
    }
    /**
     * @param {?} outputCtx
     * @param {?} comp
     * @return {?}
     */
    StyleCompiler.prototype.compileComponent = /**
     * @param {?} outputCtx
     * @param {?} comp
     * @return {?}
     */
    function (outputCtx, comp) {
        /** @type {?} */
        var template = /** @type {?} */ ((comp.template));
        return this._compileStyles(outputCtx, comp, new CompileStylesheetMetadata({
            styles: template.styles,
            styleUrls: template.styleUrls,
            moduleUrl: identifierModuleUrl(comp.type)
        }), this.needsStyleShim(comp), true);
    };
    /**
     * @param {?} outputCtx
     * @param {?} comp
     * @param {?} stylesheet
     * @param {?=} shim
     * @return {?}
     */
    StyleCompiler.prototype.compileStyles = /**
     * @param {?} outputCtx
     * @param {?} comp
     * @param {?} stylesheet
     * @param {?=} shim
     * @return {?}
     */
    function (outputCtx, comp, stylesheet, shim) {
        if (shim === void 0) { shim = this.needsStyleShim(comp); }
        return this._compileStyles(outputCtx, comp, stylesheet, shim, false);
    };
    /**
     * @param {?} comp
     * @return {?}
     */
    StyleCompiler.prototype.needsStyleShim = /**
     * @param {?} comp
     * @return {?}
     */
    function (comp) {
        return /** @type {?} */ ((comp.template)).encapsulation === ViewEncapsulation.Emulated;
    };
    /**
     * @param {?} outputCtx
     * @param {?} comp
     * @param {?} stylesheet
     * @param {?} shim
     * @param {?} isComponentStylesheet
     * @return {?}
     */
    StyleCompiler.prototype._compileStyles = /**
     * @param {?} outputCtx
     * @param {?} comp
     * @param {?} stylesheet
     * @param {?} shim
     * @param {?} isComponentStylesheet
     * @return {?}
     */
    function (outputCtx, comp, stylesheet, shim, isComponentStylesheet) {
        var _this = this;
        /** @type {?} */
        var styleExpressions = stylesheet.styles.map(function (plainStyle) { return o.literal(_this._shimIfNeeded(plainStyle, shim)); });
        /** @type {?} */
        var dependencies = [];
        stylesheet.styleUrls.forEach(function (styleUrl) {
            /** @type {?} */
            var exprIndex = styleExpressions.length;
            // Note: This placeholder will be filled later.
            styleExpressions.push(/** @type {?} */ ((null)));
            dependencies.push(new StylesCompileDependency(getStylesVarName(null), styleUrl, function (value) { return styleExpressions[exprIndex] = outputCtx.importExpr(value); }));
        });
        /** @type {?} */
        var stylesVar = getStylesVarName(isComponentStylesheet ? comp : null);
        /** @type {?} */
        var stmt = o.variable(stylesVar)
            .set(o.literalArr(styleExpressions, new o.ArrayType(o.DYNAMIC_TYPE, [o.TypeModifier.Const])))
            .toDeclStmt(null, isComponentStylesheet ? [o.StmtModifier.Final] : [
            o.StmtModifier.Final, o.StmtModifier.Exported
        ]);
        outputCtx.statements.push(stmt);
        return new CompiledStylesheet(outputCtx, stylesVar, dependencies, shim, stylesheet);
    };
    /**
     * @param {?} style
     * @param {?} shim
     * @return {?}
     */
    StyleCompiler.prototype._shimIfNeeded = /**
     * @param {?} style
     * @param {?} shim
     * @return {?}
     */
    function (style, shim) {
        return shim ? this._shadowCss.shimCssText(style, CONTENT_ATTR, HOST_ATTR) : style;
    };
    return StyleCompiler;
}());
export { StyleCompiler };
if (false) {
    /** @type {?} */
    StyleCompiler.prototype._shadowCss;
    /** @type {?} */
    StyleCompiler.prototype._urlResolver;
}
/**
 * @param {?} component
 * @return {?}
 */
function getStylesVarName(component) {
    /** @type {?} */
    var result = "styles";
    if (component) {
        result += "_" + identifierName(component.type);
    }
    return result;
}
//# sourceMappingURL=style_compiler.js.map