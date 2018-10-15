"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var completions_1 = require("./completions");
var definitions_1 = require("./definitions");
var diagnostics_1 = require("./diagnostics");
var hover_1 = require("./hover");
var types_1 = require("./types");
/**
 * Create an instance of an Angular `LanguageService`.
 *
 * @experimental
 */
function createLanguageService(host) {
    return new LanguageServiceImpl(host);
}
exports.createLanguageService = createLanguageService;
var LanguageServiceImpl = /** @class */ (function () {
    function LanguageServiceImpl(host) {
        this.host = host;
    }
    Object.defineProperty(LanguageServiceImpl.prototype, "metadataResolver", {
        get: function () { return this.host.resolver; },
        enumerable: true,
        configurable: true
    });
    LanguageServiceImpl.prototype.getTemplateReferences = function () { return this.host.getTemplateReferences(); };
    LanguageServiceImpl.prototype.getDiagnostics = function (fileName) {
        var results = [];
        var templates = this.host.getTemplates(fileName);
        if (templates && templates.length) {
            results.push.apply(results, diagnostics_1.getTemplateDiagnostics(fileName, this, templates));
        }
        var declarations = this.host.getDeclarations(fileName);
        if (declarations && declarations.length) {
            var summary = this.host.getAnalyzedModules();
            results.push.apply(results, diagnostics_1.getDeclarationDiagnostics(declarations, summary));
        }
        return uniqueBySpan(results);
    };
    LanguageServiceImpl.prototype.getPipesAt = function (fileName, position) {
        var templateInfo = this.getTemplateAstAtPosition(fileName, position);
        if (templateInfo) {
            return templateInfo.pipes;
        }
        return [];
    };
    LanguageServiceImpl.prototype.getCompletionsAt = function (fileName, position) {
        var templateInfo = this.getTemplateAstAtPosition(fileName, position);
        if (templateInfo) {
            return completions_1.getTemplateCompletions(templateInfo);
        }
    };
    LanguageServiceImpl.prototype.getDefinitionAt = function (fileName, position) {
        var templateInfo = this.getTemplateAstAtPosition(fileName, position);
        if (templateInfo) {
            return definitions_1.getDefinition(templateInfo);
        }
    };
    LanguageServiceImpl.prototype.getHoverAt = function (fileName, position) {
        var templateInfo = this.getTemplateAstAtPosition(fileName, position);
        if (templateInfo) {
            return hover_1.getHover(templateInfo);
        }
    };
    LanguageServiceImpl.prototype.getTemplateAstAtPosition = function (fileName, position) {
        var template = this.host.getTemplateAt(fileName, position);
        if (template) {
            var astResult = this.getTemplateAst(template, fileName);
            if (astResult && astResult.htmlAst && astResult.templateAst && astResult.directive &&
                astResult.directives && astResult.pipes && astResult.expressionParser)
                return {
                    position: position,
                    fileName: fileName,
                    template: template,
                    htmlAst: astResult.htmlAst,
                    directive: astResult.directive,
                    directives: astResult.directives,
                    pipes: astResult.pipes,
                    templateAst: astResult.templateAst,
                    expressionParser: astResult.expressionParser
                };
        }
        return undefined;
    };
    LanguageServiceImpl.prototype.getTemplateAst = function (template, contextFile) {
        var _this = this;
        var result = undefined;
        try {
            var resolvedMetadata = this.metadataResolver.getNonNormalizedDirectiveMetadata(template.type);
            var metadata = resolvedMetadata && resolvedMetadata.metadata;
            if (metadata) {
                var rawHtmlParser = new compiler_1.HtmlParser();
                var htmlParser = new compiler_1.I18NHtmlParser(rawHtmlParser);
                var expressionParser = new compiler_1.Parser(new compiler_1.Lexer());
                var config = new compiler_1.CompilerConfig();
                var parser = new compiler_1.TemplateParser(config, this.host.resolver.getReflector(), expressionParser, new compiler_1.DomElementSchemaRegistry(), htmlParser, null, []);
                var htmlResult = htmlParser.parse(template.source, '', true);
                var analyzedModules = this.host.getAnalyzedModules();
                var errors = undefined;
                var ngModule = analyzedModules.ngModuleByPipeOrDirective.get(template.type);
                if (!ngModule) {
                    // Reported by the the declaration diagnostics.
                    ngModule = findSuitableDefaultModule(analyzedModules);
                }
                if (ngModule) {
                    var resolvedDirectives = ngModule.transitiveModule.directives.map(function (d) { return _this.host.resolver.getNonNormalizedDirectiveMetadata(d.reference); });
                    var directives = removeMissing(resolvedDirectives).map(function (d) { return d.metadata.toSummary(); });
                    var pipes = ngModule.transitiveModule.pipes.map(function (p) { return _this.host.resolver.getOrLoadPipeMetadata(p.reference).toSummary(); });
                    var schemas = ngModule.schemas;
                    var parseResult = parser.tryParseHtml(htmlResult, metadata, directives, pipes, schemas);
                    result = {
                        htmlAst: htmlResult.rootNodes,
                        templateAst: parseResult.templateAst,
                        directive: metadata, directives: directives, pipes: pipes,
                        parseErrors: parseResult.errors, expressionParser: expressionParser, errors: errors
                    };
                }
            }
        }
        catch (e) {
            var span = template.span;
            if (e.fileName == contextFile) {
                span = template.query.getSpanAt(e.line, e.column) || span;
            }
            result = { errors: [{ kind: types_1.DiagnosticKind.Error, message: e.message, span: span }] };
        }
        return result || {};
    };
    return LanguageServiceImpl;
}());
function removeMissing(values) {
    return values.filter(function (e) { return !!e; });
}
function uniqueBySpan(elements) {
    if (elements) {
        var result = [];
        var map = new Map();
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            var span = element.span;
            var set = map.get(span.start);
            if (!set) {
                set = new Set();
                map.set(span.start, set);
            }
            if (!set.has(span.end)) {
                set.add(span.end);
                result.push(element);
            }
        }
        return result;
    }
}
function findSuitableDefaultModule(modules) {
    var result = undefined;
    var resultSize = 0;
    for (var _i = 0, _a = modules.ngModules; _i < _a.length; _i++) {
        var module_1 = _a[_i];
        var moduleSize = module_1.transitiveModule.directives.length;
        if (moduleSize > resultSize) {
            result = module_1;
            resultSize = moduleSize;
        }
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZ3VhZ2Vfc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xhbmd1YWdlLXNlcnZpY2Uvc3JjL2xhbmd1YWdlX3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBK047QUFHL04sNkNBQXFEO0FBQ3JELDZDQUE0QztBQUM1Qyw2Q0FBZ0Y7QUFDaEYsaUNBQWlDO0FBQ2pDLGlDQUFtSztBQUduSzs7OztHQUlHO0FBQ0gsK0JBQXNDLElBQXlCO0lBQzdELE9BQU8sSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBRkQsc0RBRUM7QUFFRDtJQUNFLDZCQUFvQixJQUF5QjtRQUF6QixTQUFJLEdBQUosSUFBSSxDQUFxQjtJQUFHLENBQUM7SUFFakQsc0JBQVksaURBQWdCO2FBQTVCLGNBQTBELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUV0RixtREFBcUIsR0FBckIsY0FBb0MsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRS9FLDRDQUFjLEdBQWQsVUFBZSxRQUFnQjtRQUM3QixJQUFJLE9BQU8sR0FBZ0IsRUFBRSxDQUFDO1FBQzlCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pELElBQUksU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUU7WUFDakMsT0FBTyxDQUFDLElBQUksT0FBWixPQUFPLEVBQVMsb0NBQXNCLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsRUFBRTtTQUNwRTtRQUVELElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZELElB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