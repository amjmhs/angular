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
//# sourceMappingURL=directive_normalizer.js.map