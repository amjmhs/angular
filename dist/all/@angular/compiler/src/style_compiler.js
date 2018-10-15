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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGVfY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvc3R5bGVfY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCx1REFBdUo7QUFDdkosK0JBQXlDO0FBQ3pDLHVDQUF5QztBQUN6QywyQ0FBdUM7QUFJdkMsSUFBTSxrQkFBa0IsR0FBRyxRQUFRLENBQUM7QUFDcEMsSUFBTSxTQUFTLEdBQUcsYUFBVyxrQkFBb0IsQ0FBQztBQUNsRCxJQUFNLFlBQVksR0FBRyxnQkFBYyxrQkFBb0IsQ0FBQztBQUV4RDtJQUNFLGlDQUNXLElBQVksRUFBUyxTQUFpQixFQUFTLFFBQThCO1FBQTdFLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBc0I7SUFBRyxDQUFDO0lBQzlGLDhCQUFDO0FBQUQsQ0FBQyxBQUhELElBR0M7QUFIWSwwREFBdUI7QUFLcEM7SUFDRSw0QkFDVyxTQUF3QixFQUFTLFNBQWlCLEVBQ2xELFlBQXVDLEVBQVMsU0FBa0IsRUFDbEUsSUFBK0I7UUFGL0IsY0FBUyxHQUFULFNBQVMsQ0FBZTtRQUFTLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFDbEQsaUJBQVksR0FBWixZQUFZLENBQTJCO1FBQVMsY0FBUyxHQUFULFNBQVMsQ0FBUztRQUNsRSxTQUFJLEdBQUosSUFBSSxDQUEyQjtJQUFHLENBQUM7SUFDaEQseUJBQUM7QUFBRCxDQUFDLEFBTEQsSUFLQztBQUxZLGdEQUFrQjtBQU8vQjtJQUdFLHVCQUFvQixZQUF5QjtRQUF6QixpQkFBWSxHQUFaLFlBQVksQ0FBYTtRQUZyQyxlQUFVLEdBQWMsSUFBSSxzQkFBUyxFQUFFLENBQUM7SUFFQSxDQUFDO0lBRWpELHdDQUFnQixHQUFoQixVQUFpQixTQUF3QixFQUFFLElBQThCO1FBQ3ZF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