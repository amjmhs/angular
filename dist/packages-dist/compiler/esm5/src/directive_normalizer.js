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
import { CompileStylesheetMetadata, CompileTemplateMetadata, templateSourceUrl } from './compile_metadata';
import { preserveWhitespacesDefault } from './config';
import { ViewEncapsulation } from './core';
import * as html from './ml_parser/ast';
import { InterpolationConfig } from './ml_parser/interpolation_config';
import { extractStyleUrls, isStyleUrlResolvable } from './style_url_resolver';
import { PreparsedElementType, preparseElement } from './template_parser/template_preparser';
import { SyncAsync, isDefined, stringify, syntaxError } from './util';
/**
 * @record
 */
export function PrenormalizedTemplateMetadata() { }
/** @type {?} */
PrenormalizedTemplateMetadata.prototype.ngModuleType;
/** @type {?} */
PrenormalizedTemplateMetadata.prototype.componentType;
/** @type {?} */
PrenormalizedTemplateMetadata.prototype.moduleUrl;
/** @type {?} */
PrenormalizedTemplateMetadata.prototype.template;
/** @type {?} */
PrenormalizedTemplateMetadata.prototype.templateUrl;
/** @type {?} */
PrenormalizedTemplateMetadata.prototype.styles;
/** @type {?} */
PrenormalizedTemplateMetadata.prototype.styleUrls;
/** @type {?} */
PrenormalizedTemplateMetadata.prototype.interpolation;
/** @type {?} */
PrenormalizedTemplateMetadata.prototype.encapsulation;
/** @type {?} */
PrenormalizedTemplateMetadata.prototype.animations;
/** @type {?} */
PrenormalizedTemplateMetadata.prototype.preserveWhitespaces;
var DirectiveNormalizer = /** @class */ (function () {
    function DirectiveNormalizer(_resourceLoader, _urlResolver, _htmlParser, _config) {
        this._resourceLoader = _resourceLoader;
        this._urlResolver = _urlResolver;
        this._htmlParser = _htmlParser;
        this._config = _config;
        this._resourceLoaderCache = new Map();
    }
    /**
     * @return {?}
     */
    DirectiveNormalizer.prototype.clearCache = /**
     * @return {?}
     */
    function () { this._resourceLoaderCache.clear(); };
    /**
     * @param {?} normalizedDirective
     * @return {?}
     */
    DirectiveNormalizer.prototype.clearCacheFor = /**
     * @param {?} normalizedDirective
     * @return {?}
     */
    function (normalizedDirective) {
        var _this = this;
        if (!normalizedDirective.isComponent) {
            return;
        }
        /** @type {?} */
        var template = /** @type {?} */ ((normalizedDirective.template));
        this._resourceLoaderCache.delete(/** @type {?} */ ((template.templateUrl)));
        template.externalStylesheets.forEach(function (stylesheet) { _this._resourceLoaderCache.delete(/** @type {?} */ ((stylesheet.moduleUrl))); });
    };
    /**
     * @param {?} url
     * @return {?}
     */
    DirectiveNormalizer.prototype._fetch = /**
     * @param {?} url
     * @return {?}
     */
    function (url) {
        /** @type {?} */
        var result = this._resourceLoaderCache.get(url);
        if (!result) {
            result = this._resourceLoader.get(url);
            this._resourceLoaderCache.set(url, result);
        }
        return result;
    };
    /**
     * @param {?} prenormData
     * @return {?}
     */
    DirectiveNormalizer.prototype.normalizeTemplate = /**
     * @param {?} prenormData
     * @return {?}
     */
    function (prenormData) {
        var _this = this;
        if (isDefined(prenormData.template)) {
            if (isDefined(prenormData.templateUrl)) {
                throw syntaxError("'" + stringify(prenormData.componentType) + "' component cannot define both template and templateUrl");
            }
            if (typeof prenormData.template !== 'string') {
                throw syntaxError("The template specified for component " + stringify(prenormData.componentType) + " is not a string");
            }
        }
        else if (isDefined(prenormData.templateUrl)) {
            if (typeof prenormData.templateUrl !== 'string') {
                throw syntaxError("The templateUrl specified for component " + stringify(prenormData.componentType) + " is not a string");
            }
        }
        else {
            throw syntaxError("No template specified for component " + stringify(prenormData.componentType));
        }
        if (isDefined(prenormData.preserveWhitespaces) &&
            typeof prenormData.preserveWhitespaces !== 'boolean') {
            throw syntaxError("The preserveWhitespaces option for component " + stringify(prenormData.componentType) + " must be a boolean");
        }
        return SyncAsync.then(this._preParseTemplate(prenormData), function (preparsedTemplate) { return _this._normalizeTemplateMetadata(prenormData, preparsedTemplate); });
    };
    /**
     * @param {?} prenomData
     * @return {?}
     */
    DirectiveNormalizer.prototype._preParseTemplate = /**
     * @param {?} prenomData
     * @return {?}
     */
    function (prenomData) {
        var _this = this;
        /** @type {?} */
        var template;
        /** @type {?} */
        var templateUrl;
        if (prenomData.template != null) {
            template = prenomData.template;
            templateUrl = prenomData.moduleUrl;
        }
        else {
            templateUrl = this._urlResolver.resolve(prenomData.moduleUrl, /** @type {?} */ ((prenomData.templateUrl)));
            template = this._fetch(templateUrl);
        }
        return SyncAsync.then(template, function (template) { return _this._preparseLoadedTemplate(prenomData, template, templateUrl); });
    };
    /**
     * @param {?} prenormData
     * @param {?} template
     * @param {?} templateAbsUrl
     * @return {?}
     */
    DirectiveNormalizer.prototype._preparseLoadedTemplate = /**
     * @param {?} prenormData
     * @param {?} template
     * @param {?} templateAbsUrl
     * @return {?}
     */
    function (prenormData, template, templateAbsUrl) {
        /** @type {?} */
        var isInline = !!prenormData.template;
        /** @type {?} */
        var interpolationConfig = InterpolationConfig.fromArray(/** @type {?} */ ((prenormData.interpolation)));
        /** @type {?} */
        var rootNodesAndErrors = this._htmlParser.parse(template, templateSourceUrl({ reference: prenormData.ngModuleType }, { type: { reference: prenormData.componentType } }, { isInline: isInline, templateUrl: templateAbsUrl }), true, interpolationConfig);
        if (rootNodesAndErrors.errors.length > 0) {
            /** @type {?} */
            var errorString = rootNodesAndErrors.errors.join('\n');
            throw syntaxError("Template parse errors:\n" + errorString);
        }
        /** @type {?} */
        var templateMetadataStyles = this._normalizeStylesheet(new CompileStylesheetMetadata({ styles: prenormData.styles, moduleUrl: prenormData.moduleUrl }));
        /** @type {?} */
        var visitor = new TemplatePreparseVisitor();
        html.visitAll(visitor, rootNodesAndErrors.rootNodes);
        /** @type {?} */
        var templateStyles = this._normalizeStylesheet(new CompileStylesheetMetadata({ styles: visitor.styles, styleUrls: visitor.styleUrls, moduleUrl: templateAbsUrl }));
        /** @type {?} */
        var styles = templateMetadataStyles.styles.concat(templateStyles.styles);
        /** @type {?} */
        var inlineStyleUrls = templateMetadataStyles.styleUrls.concat(templateStyles.styleUrls);
        /** @type {?} */
        var styleUrls = this
            ._normalizeStylesheet(new CompileStylesheetMetadata({ styleUrls: prenormData.styleUrls, moduleUrl: prenormData.moduleUrl }))
            .styleUrls;
        return {
            template: template,
            templateUrl: templateAbsUrl, isInline: isInline,
            htmlAst: rootNodesAndErrors, styles: styles, inlineStyleUrls: inlineStyleUrls, styleUrls: styleUrls,
            ngContentSelectors: visitor.ngContentSelectors,
        };
    };
    /**
     * @param {?} prenormData
     * @param {?} preparsedTemplate
     * @return {?}
     */
    DirectiveNormalizer.prototype._normalizeTemplateMetadata = /**
     * @param {?} prenormData
     * @param {?} preparsedTemplate
     * @return {?}
     */
    function (prenormData, preparsedTemplate) {
        var _this = this;
        return SyncAsync.then(this._loadMissingExternalStylesheets(preparsedTemplate.styleUrls.concat(preparsedTemplate.inlineStyleUrls)), function (externalStylesheets) { return _this._normalizeLoadedTemplateMetadata(prenormData, preparsedTemplate, externalStylesheets); });
    };
    /**
     * @param {?} prenormData
     * @param {?} preparsedTemplate
     * @param {?} stylesheets
     * @return {?}
     */
    DirectiveNormalizer.prototype._normalizeLoadedTemplateMetadata = /**
     * @param {?} prenormData
     * @param {?} preparsedTemplate
     * @param {?} stylesheets
     * @return {?}
     */
    function (prenormData, preparsedTemplate, stylesheets) {
        var _this = this;
        /** @type {?} */
        var styles = preparsedTemplate.styles.slice();
        this._inlineStyles(preparsedTemplate.inlineStyleUrls, stylesheets, styles);
        /** @type {?} */
        var styleUrls = preparsedTemplate.styleUrls;
        /** @type {?} */
        var externalStylesheets = styleUrls.map(function (styleUrl) {
            /** @type {?} */
            var stylesheet = /** @type {?} */ ((stylesheets.get(styleUrl)));
            /** @type {?} */
            var styles = stylesheet.styles.slice();
            _this._inlineStyles(stylesheet.styleUrls, stylesheets, styles);
            return new CompileStylesheetMetadata({ moduleUrl: styleUrl, styles: styles });
        });
        /** @type {?} */
        var encapsulation = prenormData.encapsulation;
        if (encapsulation == null) {
            encapsulation = this._config.defaultEncapsulation;
        }
        if (encapsulation === ViewEncapsulation.Emulated && styles.length === 0 &&
            styleUrls.length === 0) {
            encapsulation = ViewEncapsulation.None;
        }
        return new CompileTemplateMetadata({
            encapsulation: encapsulation,
            template: preparsedTemplate.template,
            templateUrl: preparsedTemplate.templateUrl,
            htmlAst: preparsedTemplate.htmlAst, styles: styles, styleUrls: styleUrls,
            ngContentSelectors: preparsedTemplate.ngContentSelectors,
            animations: prenormData.animations,
            interpolation: prenormData.interpolation,
            isInline: preparsedTemplate.isInline, externalStylesheets: externalStylesheets,
            preserveWhitespaces: preserveWhitespacesDefault(prenormData.preserveWhitespaces, this._config.preserveWhitespaces),
        });
    };
    /**
     * @param {?} styleUrls
     * @param {?} stylesheets
     * @param {?} targetStyles
     * @return {?}
     */
    DirectiveNormalizer.prototype._inlineStyles = /**
     * @param {?} styleUrls
     * @param {?} stylesheets
     * @param {?} targetStyles
     * @return {?}
     */
    function (styleUrls, stylesheets, targetStyles) {
        var _this = this;
        styleUrls.forEach(function (styleUrl) {
            /** @type {?} */
            var stylesheet = /** @type {?} */ ((stylesheets.get(styleUrl)));
            stylesheet.styles.forEach(function (style) { return targetStyles.push(style); });
            _this._inlineStyles(stylesheet.styleUrls, stylesheets, targetStyles);
        });
    };
    /**
     * @param {?} styleUrls
     * @param {?=} loadedStylesheets
     * @return {?}
     */
    DirectiveNormalizer.prototype._loadMissingExternalStylesheets = /**
     * @param {?} styleUrls
     * @param {?=} loadedStylesheets
     * @return {?}
     */
    function (styleUrls, loadedStylesheets) {
        var _this = this;
        if (loadedStylesheets === void 0) { loadedStylesheets = new Map(); }
        return SyncAsync.then(SyncAsync.all(styleUrls.filter(function (styleUrl) { return !loadedStylesheets.has(styleUrl); })
            .map(function (styleUrl) { return SyncAsync.then(_this._fetch(styleUrl), function (loadedStyle) {
            /** @type {?} */
            var stylesheet = _this._normalizeStylesheet(new CompileStylesheetMetadata({ styles: [loadedStyle], moduleUrl: styleUrl }));
            loadedStylesheets.set(styleUrl, stylesheet);
            return _this._loadMissingExternalStylesheets(stylesheet.styleUrls, loadedStylesheets);
        }); })), function (_) { return loadedStylesheets; });
    };
    /**
     * @param {?} stylesheet
     * @return {?}
     */
    DirectiveNormalizer.prototype._normalizeStylesheet = /**
     * @param {?} stylesheet
     * @return {?}
     */
    function (stylesheet) {
        var _this = this;
        /** @type {?} */
        var moduleUrl = /** @type {?} */ ((stylesheet.moduleUrl));
        /** @type {?} */
        var allStyleUrls = stylesheet.styleUrls.filter(isStyleUrlResolvable)
            .map(function (url) { return _this._urlResolver.resolve(moduleUrl, url); });
        /** @type {?} */
        var allStyles = stylesheet.styles.map(function (style) {
            /** @type {?} */
            var styleWithImports = extractStyleUrls(_this._urlResolver, moduleUrl, style);
            allStyleUrls.push.apply(allStyleUrls, styleWithImports.styleUrls);
            return styleWithImports.style;
        });
        return new CompileStylesheetMetadata({ styles: allStyles, styleUrls: allStyleUrls, moduleUrl: moduleUrl });
    };
    return DirectiveNormalizer;
}());
export { DirectiveNormalizer };
if (false) {
    /** @type {?} */
    DirectiveNormalizer.prototype._resourceLoaderCache;
    /** @type {?} */
    DirectiveNormalizer.prototype._resourceLoader;
    /** @type {?} */
    DirectiveNormalizer.prototype._urlResolver;
    /** @type {?} */
    DirectiveNormalizer.prototype._htmlParser;
    /** @type {?} */
    DirectiveNormalizer.prototype._config;
}
/**
 * @record
 */
function PreparsedTemplate() { }
/** @type {?} */
PreparsedTemplate.prototype.template;
/** @type {?} */
PreparsedTemplate.prototype.templateUrl;
/** @type {?} */
PreparsedTemplate.prototype.isInline;
/** @type {?} */
PreparsedTemplate.prototype.htmlAst;
/** @type {?} */
PreparsedTemplate.prototype.styles;
/** @type {?} */
PreparsedTemplate.prototype.inlineStyleUrls;
/** @type {?} */
PreparsedTemplate.prototype.styleUrls;
/** @type {?} */
PreparsedTemplate.prototype.ngContentSelectors;
var TemplatePreparseVisitor = /** @class */ (function () {
    function TemplatePreparseVisitor() {
        this.ngContentSelectors = [];
        this.styles = [];
        this.styleUrls = [];
        this.ngNonBindableStackCount = 0;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitElement = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) {
        /** @type {?} */
        var preparsedElement = preparseElement(ast);
        switch (preparsedElement.type) {
            case PreparsedElementType.NG_CONTENT:
                if (this.ngNonBindableStackCount === 0) {
                    this.ngContentSelectors.push(preparsedElement.selectAttr);
                }
                break;
            case PreparsedElementType.STYLE:
                /** @type {?} */
                var textContent_1 = '';
                ast.children.forEach(function (child) {
                    if (child instanceof html.Text) {
                        textContent_1 += child.value;
                    }
                });
                this.styles.push(textContent_1);
                break;
            case PreparsedElementType.STYLESHEET:
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
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitExpansion = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { html.visitAll(this, ast.cases); };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitExpansionCase = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) {
        html.visitAll(this, ast.expression);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitComment = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { return null; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitAttribute = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { return null; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitText = /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    function (ast, context) { return null; };
    return TemplatePreparseVisitor;
}());
if (false) {
    /** @type {?} */
    TemplatePreparseVisitor.prototype.ngContentSelectors;
    /** @type {?} */
    TemplatePreparseVisitor.prototype.styles;
    /** @type {?} */
    TemplatePreparseVisitor.prototype.styleUrls;
    /** @type {?} */
    TemplatePreparseVisitor.prototype.ngNonBindableStackCount;
}
//# sourceMappingURL=directive_normalizer.js.map