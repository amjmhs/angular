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
var config_1 = require("./config");
var core_1 = require("./core");
var html = require("./ml_parser/ast");
var interpolation_config_1 = require("./ml_parser/interpolation_config");
var style_url_resolver_1 = require("./style_url_resolver");
var template_preparser_1 = require("./template_parser/template_preparser");
var util_1 = require("./util");
var DirectiveNormalizer = /** @class */ (function () {
    function DirectiveNormalizer(_resourceLoader, _urlResolver, _htmlParser, _config) {
        this._resourceLoader = _resourceLoader;
        this._urlResolver = _urlResolver;
        this._htmlParser = _htmlParser;
        this._config = _config;
        this._resourceLoaderCache = new Map();
    }
    DirectiveNormalizer.prototype.clearCache = function () { this._resourceLoaderCache.clear(); };
    DirectiveNormalizer.prototype.clearCacheFor = function (normalizedDirective) {
        var _this = this;
        if (!normalizedDirective.isComponent) {
            return;
        }
        var template = normalizedDirective.template;
        this._resourceLoaderCache.delete(template.templateUrl);
        template.externalStylesheets.forEach(function (stylesheet) { _this._resourceLoaderCache.delete(stylesheet.moduleUrl); });
    };
    DirectiveNormalizer.prototype._fetch = function (url) {
        var result = this._resourceLoaderCache.get(url);
        if (!result) {
            result = this._resourceLoader.get(url);
            this._resourceLoaderCache.set(url, result);
        }
        return result;
    };
    DirectiveNormalizer.prototype.normalizeTemplate = function (prenormData) {
        var _this = this;
        if (util_1.isDefined(prenormData.template)) {
            if (util_1.isDefined(prenormData.templateUrl)) {
                throw util_1.syntaxError("'" + util_1.stringify(prenormData.componentType) + "' component cannot define both template and templateUrl");
            }
            if (typeof prenormData.template !== 'string') {
                throw util_1.syntaxError("The template specified for component " + util_1.stringify(prenormData.componentType) + " is not a string");
            }
        }
        else if (util_1.isDefined(prenormData.templateUrl)) {
            if (typeof prenormData.templateUrl !== 'string') {
                throw util_1.syntaxError("The templateUrl specified for component " + util_1.stringify(prenormData.componentType) + " is not a string");
            }
        }
        else {
            throw util_1.syntaxError("No template specified for component " + util_1.stringify(prenormData.componentType));
        }
        if (util_1.isDefined(prenormData.preserveWhitespaces) &&
            typeof prenormData.preserveWhitespaces !== 'boolean') {
            throw util_1.syntaxError("The preserveWhitespaces option for component " + util_1.stringify(prenormData.componentType) + " must be a boolean");
        }
        return util_1.SyncAsync.then(this._preParseTemplate(prenormData), function (preparsedTemplate) { return _this._normalizeTemplateMetadata(prenormData, preparsedTemplate); });
    };
    DirectiveNormalizer.prototype._preParseTemplate = function (prenomData) {
        var _this = this;
        var template;
        var templateUrl;
        if (prenomData.template != null) {
            template = prenomData.template;
            templateUrl = prenomData.moduleUrl;
        }
        else {
            templateUrl = this._urlResolver.resolve(prenomData.moduleUrl, prenomData.templateUrl);
            template = this._fetch(templateUrl);
        }
        return util_1.SyncAsync.then(template, function (template) { return _this._preparseLoadedTemplate(prenomData, template, templateUrl); });
    };
    DirectiveNormalizer.prototype._preparseLoadedTemplate = function (prenormData, template, templateAbsUrl) {
        var isInline = !!prenormData.template;
        var interpolationConfig = interpolation_config_1.InterpolationConfig.fromArray(prenormData.interpolation);
        var rootNodesAndErrors = this._htmlParser.parse(template, compile_metadata_1.templateSourceUrl({ reference: prenormData.ngModuleType }, { type: { reference: prenormData.componentType } }, { isInline: isInline, templateUrl: templateAbsUrl }), true, interpolationConfig);
        if (rootNodesAndErrors.errors.length > 0) {
            var errorString = rootNodesAndErrors.errors.join('\n');
            throw util_1.syntaxError("Template parse errors:\n" + errorString);
        }
        var templateMetadataStyles = this._normalizeStylesheet(new compile_metadata_1.CompileStylesheetMetadata({ styles: prenormData.styles, moduleUrl: prenormData.moduleUrl }));
        var visitor = new TemplatePreparseVisitor();
        html.visitAll(visitor, rootNodesAndErrors.rootNodes);
        var templateStyles = this._normalizeStylesheet(new compile_metadata_1.CompileStylesheetMetadata({ styles: visitor.styles, styleUrls: visitor.styleUrls, moduleUrl: templateAbsUrl }));
        var styles = templateMetadataStyles.styles.concat(templateStyles.styles);
        var inlineStyleUrls = templateMetadataStyles.styleUrls.concat(templateStyles.styleUrls);
        var styleUrls = this
            ._normalizeStylesheet(new compile_metadata_1.CompileStylesheetMetadata({ styleUrls: prenormData.styleUrls, moduleUrl: prenormData.moduleUrl }))
            .styleUrls;
        return {
            template: template,
            templateUrl: templateAbsUrl, isInline: isInline,
            htmlAst: rootNodesAndErrors, styles: styles, inlineStyleUrls: inlineStyleUrls, styleUrls: styleUrls,
            ngContentSelectors: visitor.ngContentSelectors,
        };
    };
    DirectiveNormalizer.prototype._normalizeTemplateMetadata = function (prenormData, preparsedTemplate) {
        var _this = this;
        return util_1.SyncAsync.then(this._loadMissingExternalStylesheets(preparsedTemplate.styleUrls.concat(preparsedTemplate.inlineStyleUrls)), function (externalStylesheets) { return _this._normalizeLoadedTemplateMetadata(prenormData, preparsedTemplate, externalStylesheets); });
    };
    DirectiveNormalizer.prototype._normalizeLoadedTemplateMetadata = function (prenormData, preparsedTemplate, stylesheets) {
        // Algorithm:
        // - produce exactly 1 entry per original styleUrl in
        // CompileTemplateMetadata.externalStylesheets with all styles inlined
        // - inline all styles that are referenced by the template into CompileTemplateMetadata.styles.
        // Reason: be able to determine how many stylesheets there are even without loading
        // the template nor the stylesheets, so we can create a stub for TypeScript always synchronously
        // (as resource loading may be async)
        var _this = this;
        var styles = preparsedTemplate.styles.slice();
        this._inlineStyles(preparsedTemplate.inlineStyleUrls, stylesheets, styles);
        var styleUrls = preparsedTemplate.styleUrls;
        var externalStylesheets = styleUrls.map(function (styleUrl) {
            var stylesheet = stylesheets.get(styleUrl);
            var styles = stylesheet.styles.slice();
            _this._inlineStyles(stylesheet.styleUrls, stylesheets, styles);
            return new compile_metadata_1.CompileStylesheetMetadata({ moduleUrl: styleUrl, styles: styles });
        });
        var encapsulation = prenormData.encapsulation;
        if (encapsulation == null) {
            encapsulation = this._config.defaultEncapsulation;
        }
        if (encapsulation === core_1.ViewEncapsulation.Emulated && styles.length === 0 &&
            styleUrls.length === 0) {
            encapsulation = core_1.ViewEncapsulation.None;
        }
        return new compile_metadata_1.CompileTemplateMetadata({
            encapsulation: encapsulation,
            template: preparsedTemplate.template,
            templateUrl: preparsedTemplate.templateUrl,
            htmlAst: preparsedTemplate.htmlAst, styles: styles, styleUrls: styleUrls,
            ngContentSelectors: preparsedTemplate.ngContentSelectors,
            animations: prenormData.animations,
            interpolation: prenormData.interpolation,
            isInline: preparsedTemplate.isInline, externalStylesheets: externalStylesheets,
            preserveWhitespaces: config_1.preserveWhitespacesDefault(prenormData.preserveWhitespaces, this._config.preserveWhitespaces),
        });
    };
    DirectiveNormalizer.prototype._inlineStyles = function (styleUrls, stylesheets, targetStyles) {
        var _this = this;
        styleUrls.forEach(function (styleUrl) {
            var stylesheet = stylesheets.get(styleUrl);
            stylesheet.styles.forEach(function (style) { return targetStyles.push(style); });
            _this._inlineStyles(stylesheet.styleUrls, stylesheets, targetStyles);
        });
    };
    DirectiveNormalizer.prototype._loadMissingExternalStylesheets = function (styleUrls, loadedStylesheets) {
        var _this = this;
        if (loadedStylesheets === void 0) { loadedStylesheets = new Map(); }
        return util_1.SyncAsync.then(util_1.SyncAsync.all(styleUrls.filter(function (styleUrl) { return !loadedStylesheets.has(styleUrl); })
            .map(function (styleUrl) { return util_1.SyncAsync.then(_this._fetch(styleUrl), function (loadedStyle) {
            var stylesheet = _this._normalizeStylesheet(new compile_metadata_1.CompileStylesheetMetadata({ styles: [loadedStyle], moduleUrl: styleUrl }));
            loadedStylesheets.set(styleUrl, stylesheet);
            return _this._loadMissingExternalStylesheets(stylesheet.styleUrls, loadedStylesheets);
        }); })), function (_) { return loadedStylesheets; });
    };
    DirectiveNormalizer.prototype._normalizeStylesheet = function (stylesheet) {
        var _this = this;
        var moduleUrl = stylesheet.moduleUrl;
        var allStyleUrls = stylesheet.styleUrls.filter(style_url_resolver_1.isStyleUrlResolvable)
            .map(function (url) { return _this._urlResolver.resolve(moduleUrl, url); });
        var allStyles = stylesheet.styles.map(function (style) {
            var styleWithImports = style_url_resolver_1.extractStyleUrls(_this._urlResolver, moduleUrl, style);
            allStyleUrls.push.apply(allStyleUrls, styleWithImports.styleUrls);
            return styleWithImports.style;
        });
        return new compile_metadata_1.CompileStylesheetMetadata({ styles: allStyles, styleUrls: allStyleUrls, moduleUrl: moduleUrl });
    };
    return DirectiveNormalizer;
}());
exports.DirectiveNormalizer = DirectiveNormalizer;
var TemplatePreparseVisitor = /** @class */ (function () {
    function TemplatePreparseVisitor() {
        this.ngContentSelectors = [];
        this.styles = [];
        this.styleUrls = [];
        this.ngNonBindableStackCount = 0;
    }
    TemplatePreparseVisitor.prototype.visitElement = function (ast, context) {
        var preparsedElement = template_preparser_1.preparseElement(ast);
        switch (preparsedElement.type) {
            case template_preparser_1.PreparsedElementType.NG_CONTENT:
                if (this.ngNonBindableStackCount === 0) {
                    this.ngContentSelectors.push(preparsedElement.selectAttr);
                }
                break;
            case template_preparser_1.PreparsedElementType.STYLE:
                var textContent_1 = '';
                ast.children.forEach(function (child) {
                    if (child instanceof html.Text) {
                        textContent_1 += child.value;
                    }
                });
                this.styles.push(textContent_1);
                break;
            case template_preparser_1.PreparsedElementType.STYLESHEET:
                this.styleUrls.push(preparsedElement.hrefAttr);
                break;
            default:
                break;
        }
        if (preparsedElement.nonBindable) {
            this.ngNonBindableStackCount++;
        }
        html.visitAll(this, ast.children);
        if (preparsedElement.nonBindable) {
            this.ngNonBindableStackCount--;
        }
        return null;
    };
    TemplatePreparseVisitor.prototype.visitExpansion = function (ast, context) { html.visitAll(this, ast.cases); };
    TemplatePreparseVisitor.prototype.visitExpansionCase = function (ast, context) {
        html.visitAll(this, ast.expression);
    };
    TemplatePreparseVisitor.prototype.visitComment = function (ast, context) { return null; };
    TemplatePreparseVisitor.prototype.visitAttribute = function (ast, context) { return null; };
    TemplatePreparseVisitor.prototype.visitText = function (ast, context) { return null; };
    return TemplatePreparseVisitor;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlX25vcm1hbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvZGlyZWN0aXZlX25vcm1hbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCx1REFBbUk7QUFDbkksbUNBQW9FO0FBQ3BFLCtCQUF5QztBQUN6QyxzQ0FBd0M7QUFFeEMseUVBQXFFO0FBR3JFLDJEQUE0RTtBQUM1RSwyRUFBMkY7QUFFM0YsK0JBQW9FO0FBZ0JwRTtJQUdFLDZCQUNZLGVBQStCLEVBQVUsWUFBeUIsRUFDbEUsV0FBdUIsRUFBVSxPQUF1QjtRQUR4RCxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFBVSxpQkFBWSxHQUFaLFlBQVksQ0FBYTtRQUNsRSxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBSjVELHlCQUFvQixHQUFHLElBQUksR0FBRyxFQUE2QixDQUFDO0lBSUcsQ0FBQztJQUV4RSx3Q0FBVSxHQUFWLGNBQXFCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFekQsMkNBQWEsR0FBYixVQUFjLG1CQUE2QztRQUEzRCxpQkFRQztRQVBDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUU7WUFDcEMsT0FBTztTQUNSO1FBQ0QsSUFBTSxRQUFRLEdBQUcsbUJBQW1CLENBQUMsUUFBVSxDQUFDO1FBQ2hELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQWEsQ0FBQyxDQUFDO1FBQ3pELFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQ2hDLFVBQUMsVUFBVSxJQUFPLEtBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckYs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