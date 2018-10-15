"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var language_service_1 = require("./language_service");
var typescript_host_1 = require("./typescript_host");
var projectHostMap = new WeakMap();
function getExternalFiles(project) {
    var host = projectHostMap.get(project);
    if (host) {
        return host.getTemplateReferences();
    }
}
exports.getExternalFiles = getExternalFiles;
function create(info /* ts.server.PluginCreateInfo */) {
    // Create the proxy
    var proxy = Object.create(null);
    var oldLS = info.languageService;
    function tryCall(fileName, callback) {
        if (fileName && !oldLS.getProgram().getSourceFile(fileName)) {
            return undefined;
        }
        try {
            return callback();
        }
        catch (e) {
            return undefined;
        }
    }
    function tryFilenameCall(m) {
        return function (fileName) { return tryCall(fileName, function () { return (m.call(ls, fileName)); }); };
    }
    function tryFilenameOneCall(m) {
        return function (fileName, p) { return tryCall(fileName, function () { return (m.call(ls, fileName, p)); }); };
    }
    function tryFilenameTwoCall(m) {
        return function (fileName, p1, p2) { return tryCall(fileName, function () { return (m.call(ls, fileName, p1, p2)); }); };
    }
    function tryFilenameThreeCall(m) {
        return function (fileName, p1, p2, p3) { return tryCall(fileName, function () { return (m.call(ls, fileName, p1, p2, p3)); }); };
    }
    function tryFilenameFourCall(m) {
        return function (fileName, p1, p2, p3, p4) {
            return tryCall(fileName, function () { return (m.call(ls, fileName, p1, p2, p3, p4)); });
        };
    }
    function tryFilenameFiveCall(m) {
        return function (fileName, p1, p2, p3, p4, p5) {
            return tryCall(fileName, function () { return (m.call(ls, fileName, p1, p2, p3, p4, p5)); });
        };
    }
    function typescriptOnly(ls) {
        var languageService = {
            cleanupSemanticCache: function () { return ls.cleanupSemanticCache(); },
            getSyntacticDiagnostics: tryFilenameCall(ls.getSyntacticDiagnostics),
            getSemanticDiagnostics: tryFilenameCall(ls.getSemanticDiagnostics),
            getCompilerOptionsDiagnostics: function () { return ls.getCompilerOptionsDiagnostics(); },
            getSyntacticClassifications: tryFilenameOneCall(ls.getSemanticClassifications),
            getSemanticClassifications: tryFilenameOneCall(ls.getSemanticClassifications),
            getEncodedSyntacticClassifications: tryFilenameOneCall(ls.getEncodedSyntacticClassifications),
            getEncodedSemanticClassifications: tryFilenameOneCall(ls.getEncodedSemanticClassifications),
            getCompletionsAtPosition: tryFilenameTwoCall(ls.getCompletionsAtPosition),
            getCompletionEntryDetails: tryFilenameFiveCall(ls.getCompletionEntryDetails),
            getCompletionEntrySymbol: tryFilenameThreeCall(ls.getCompletionEntrySymbol),
            getQuickInfoAtPosition: tryFilenameOneCall(ls.getQuickInfoAtPosition),
            getNameOrDottedNameSpan: tryFilenameTwoCall(ls.getNameOrDottedNameSpan),
            getBreakpointStatementAtPosition: tryFilenameOneCall(ls.getBreakpointStatementAtPosition),
            getSignatureHelpItems: tryFilenameOneCall(ls.getSignatureHelpItems),
            getRenameInfo: tryFilenameOneCall(ls.getRenameInfo),
            findRenameLocations: tryFilenameThreeCall(ls.findRenameLocations),
            getDefinitionAtPosition: tryFilenameOneCall(ls.getDefinitionAtPosition),
            getTypeDefinitionAtPosition: tryFilenameOneCall(ls.getTypeDefinitionAtPosition),
            getImplementationAtPosition: tryFilenameOneCall(ls.getImplementationAtPosition),
            getReferencesAtPosition: tryFilenameOneCall(ls.getReferencesAtPosition),
            findReferences: tryFilenameOneCall(ls.findReferences),
            getDocumentHighlights: tryFilenameTwoCall(ls.getDocumentHighlights),
            /** @deprecated */
            getOccurrencesAtPosition: tryFilenameOneCall(ls.getOccurrencesAtPosition),
            getNavigateToItems: function (searchValue, maxResultCount, fileName, excludeDtsFiles) { return tryCall(fileName, function () { return ls.getNavigateToItems(searchValue, maxResultCount, fileName, excludeDtsFiles); }); },
            getNavigationBarItems: tryFilenameCall(ls.getNavigationBarItems),
            getNavigationTree: tryFilenameCall(ls.getNavigationTree),
            getOutliningSpans: tryFilenameCall(ls.getOutliningSpans),
            getTodoComments: tryFilenameOneCall(ls.getTodoComments),
            getBraceMatchingAtPosition: tryFilenameOneCall(ls.getBraceMatchingAtPosition),
            getIndentationAtPosition: tryFilenameTwoCall(ls.getIndentationAtPosition),
            getFormattingEditsForRange: tryFilenameThreeCall(ls.getFormattingEditsForRange),
            getFormattingEditsForDocument: tryFilenameOneCall(ls.getFormattingEditsForDocument),
            getFormattingEditsAfterKeystroke: tryFilenameThreeCall(ls.getFormattingEditsAfterKeystroke),
            getDocCommentTemplateAtPosition: tryFilenameOneCall(ls.getDocCommentTemplateAtPosition),
            isValidBraceCompletionAtPosition: tryFilenameTwoCall(ls.isValidBraceCompletionAtPosition),
            getSpanOfEnclosingComment: tryFilenameTwoCall(ls.getSpanOfEnclosingComment),
            getCodeFixesAtPosition: tryFilenameFiveCall(ls.getCodeFixesAtPosition),
            applyCodeActionCommand: (function (action) { return tryCall(undefined, function () { return ls.applyCodeActionCommand(action); }); }),
            getEmitOutput: tryFilenameCall(ls.getEmitOutput),
            getProgram: function () { return ls.getProgram(); },
            dispose: function () { return ls.dispose(); },
            getApplicableRefactors: tryFilenameTwoCall(ls.getApplicableRefactors),
            getEditsForRefactor: tryFilenameFiveCall(ls.getEditsForRefactor),
            getDefinitionAndBoundSpan: tryFilenameOneCall(ls.getDefinitionAndBoundSpan),
            getCombinedCodeFix: function (scope, fixId, formatOptions, preferences) {
                return tryCall(undefined, function () { return ls.getCombinedCodeFix(scope, fixId, formatOptions, preferences); });
            },
            // TODO(kyliau): dummy implementation to compile with ts 2.8, create real one
            getSuggestionDiagnostics: function (fileName) { return []; },
            // TODO(kyliau): dummy implementation to compile with ts 2.8, create real one
            organizeImports: function (scope, formatOptions) { return []; },
            // TODO: dummy implementation to compile with ts 2.9, create a real one
            getEditsForFileRename: function (oldFilePath, newFilePath, formatOptions, preferences) { return []; }
        };
        return languageService;
    }
    oldLS = typescriptOnly(oldLS);
    var _loop_1 = function (k) {
        proxy[k] = function () { return oldLS[k].apply(oldLS, arguments); };
    };
    for (var k in oldLS) {
        _loop_1(k);
    }
    function completionToEntry(c) {
        return {
            // TODO: remove any and fix type error.
            kind: c.kind,
            name: c.name,
            sortText: c.sort,
            kindModifiers: ''
        };
    }
    function diagnosticChainToDiagnosticChain(chain) {
        return {
            messageText: chain.message,
            category: ts.DiagnosticCategory.Error,
            code: 0,
            next: chain.next ? diagnosticChainToDiagnosticChain(chain.next) : undefined
        };
    }
    function diagnosticMessageToDiagnosticMessageText(message) {
        if (typeof message === 'string') {
            return message;
        }
        return diagnosticChainToDiagnosticChain(message);
    }
    function diagnosticToDiagnostic(d, file) {
        var result = {
            file: file,
            start: d.span.start,
            length: d.span.end - d.span.start,
            messageText: diagnosticMessageToDiagnosticMessageText(d.message),
            category: ts.DiagnosticCategory.Error,
            code: 0,
            source: 'ng'
        };
        return result;
    }
    function tryOperation(attempting, callback) {
        try {
            return callback();
        }
        catch (e) {
            info.project.projectService.logger.info("Failed to " + attempting + ": " + e.toString());
            info.project.projectService.logger.info("Stack trace: " + e.stack);
            return null;
        }
    }
    var serviceHost = new typescript_host_1.TypeScriptServiceHost(info.languageServiceHost, info.languageService);
    var ls = language_service_1.createLanguageService(serviceHost);
    serviceHost.setSite(ls);
    projectHostMap.set(info.project, serviceHost);
    proxy.getCompletionsAtPosition = function (fileName, position, options) {
        var base = oldLS.getCompletionsAtPosition(fileName, position, options) || {
            isGlobalCompletion: false,
            isMemberCompletion: false,
            isNewIdentifierLocation: false,
            entries: []
        };
        tryOperation('get completions', function () {
            var results = ls.getCompletionsAt(fileName, position);
            if (results && results.length) {
                if (base === undefined) {
                    base = {
                        isGlobalCompletion: false,
                        isMemberCompletion: false,
                        isNewIdentifierLocation: false,
                        entries: []
                    };
                }
                for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
                    var entry = results_1[_i];
                    base.entries.push(completionToEntry(entry));
                }
            }
        });
        return base;
    };
    proxy.getQuickInfoAtPosition = function (fileName, position) {
        var base = oldLS.getQuickInfoAtPosition(fileName, position);
        // TODO(vicb): the tags property has been removed in TS 2.2
        tryOperation('get quick info', function () {
            var ours = ls.getHoverAt(fileName, position);
            if (ours) {
                var displayParts = [];
                for (var _i = 0, _a = ours.text; _i < _a.length; _i++) {
                    var part = _a[_i];
                    displayParts.push({ kind: part.language || 'angular', text: part.text });
                }
                var tags = base && base.tags;
                base = {
                    displayParts: displayParts,
                    documentation: [],
                    kind: 'angular',
                    kindModifiers: 'what does this do?',
                    textSpan: { start: ours.span.start, length: ours.span.end - ours.span.start },
                };
                if (tags) {
                    base.tags = tags;
                }
            }
        });
        return base;
    };
    proxy.getSemanticDiagnostics = function (fileName) {
        var result = oldLS.getSemanticDiagnostics(fileName);
        var base = result || [];
        tryOperation('get diagnostics', function () {
            info.project.projectService.logger.info("Computing Angular semantic diagnostics...");
            var ours = ls.getDiagnostics(fileName);
            if (ours && ours.length) {
                var file_1 = oldLS.getProgram().getSourceFile(fileName);
                if (file_1) {
                    base.push.apply(base, ours.map(function (d) { return diagnosticToDiagnostic(d, file_1); }));
                }
            }
        });
        return base;
    };
    proxy.getDefinitionAtPosition = function (fileName, position) {
        var base = oldLS.getDefinitionAtPosition(fileName, position);
        if (base && base.length) {
            return base;
        }
        return tryOperation('get definition', function () {
            var ours = ls.getDefinitionAt(fileName, position);
            if (ours && ours.length) {
                base = base || [];
                for (var _i = 0, ours_1 = ours; _i < ours_1.length; _i++) {
                    var loc = ours_1[_i];
                    base.push({
                        fileName: loc.fileName,
                        textSpan: { start: loc.span.start, length: loc.span.end - loc.span.start },
                        name: '',
                        // TODO: remove any and fix type error.
                        kind: 'definition',
                        containerName: loc.fileName,
                        containerKind: 'file',
                    });
                }
            }
            return base;
        }) || [];
    };
    return proxy;
}
exports.create = create;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNfcGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvbGFuZ3VhZ2Utc2VydmljZS9zcmMvdHNfcGx1Z2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0JBQWlDO0FBRWpDLHVEQUF5RDtBQUV6RCxxREFBd0Q7QUFFeEQsSUFBTSxjQUFjLEdBQUcsSUFBSSxPQUFPLEVBQThCLENBQUM7QUFFakUsMEJBQWlDLE9BQVk7SUFDM0MsSUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6QyxJQUFJLElBQUksRUFBRTtRQUNSLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7S0FDckM7QUFDSCxDQUFDO0FBTEQsNENBS0M7QUFFRCxnQkFBdUIsSUFBUyxDQUFDLGdDQUFnQztJQUMvRCxtQkFBbUI7SUFDbkIsSUFBTSxLQUFLLEdBQXVCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEQsSUFBSSxLQUFLLEdBQXVCLElBQUksQ0FBQyxlQUFlLENBQUM7SUFFckQsaUJBQW9CLFFBQTRCLEVBQUUsUUFBaUI7UUFDakUsSUFBSSxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQzNELE9BQU8sU0FBcUIsQ0FBQztTQUM5QjtRQUNELElBQUk7WUFDRixPQUFPLFFBQVEsRUFBRSxDQUFDO1NBQ25CO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixPQUFPLFNBQXFCLENBQUM7U0FDOUI7SUFDSCxDQUFDO0lBRUQseUJBQTRCLENBQTBCO1FBQ3BELE9BQU8sVUFBQSxRQUFRLElBQUksT0FBQSxPQUFPLENBQUMsUUFBUSxFQUFFLGNBQU0sT0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxD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