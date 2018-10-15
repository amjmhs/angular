"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var api = require("./transformers/api");
var ng = require("./transformers/entry_points");
var util_1 = require("./transformers/util");
var TS_EXT = /\.ts$/;
function filterErrorsAndWarnings(diagnostics) {
    return diagnostics.filter(function (d) { return d.category !== ts.DiagnosticCategory.Message; });
}
exports.filterErrorsAndWarnings = filterErrorsAndWarnings;
var defaultFormatHost = {
    getCurrentDirectory: function () { return ts.sys.getCurrentDirectory(); },
    getCanonicalFileName: function (fileName) { return fileName; },
    getNewLine: function () { return ts.sys.newLine; }
};
function displayFileName(fileName, host) {
    return path.relative(host.getCurrentDirectory(), host.getCanonicalFileName(fileName));
}
function formatDiagnosticPosition(position, host) {
    if (host === void 0) { host = defaultFormatHost; }
    return displayFileName(position.fileName, host) + "(" + (position.line + 1) + "," + (position.column + 1) + ")";
}
exports.formatDiagnosticPosition = formatDiagnosticPosition;
function flattenDiagnosticMessageChain(chain, host) {
    if (host === void 0) { host = defaultFormatHost; }
    var result = chain.messageText;
    var indent = 1;
    var current = chain.next;
    var newLine = host.getNewLine();
    while (current) {
        result += newLine;
        for (var i = 0; i < indent; i++) {
            result += '  ';
        }
        result += current.messageText;
        var position = current.position;
        if (position) {
            result += " at " + formatDiagnosticPosition(position, host);
        }
        current = current.next;
        indent++;
    }
    return result;
}
exports.flattenDiagnosticMessageChain = flattenDiagnosticMessageChain;
function formatDiagnostic(diagnostic, host) {
    if (host === void 0) { host = defaultFormatHost; }
    var result = '';
    var newLine = host.getNewLine();
    var span = diagnostic.span;
    if (span) {
        result += formatDiagnosticPosition({
            fileName: span.start.file.url,
            line: span.start.line,
            column: span.start.col
        }, host) + ": ";
    }
    else if (diagnostic.position) {
        result += formatDiagnosticPosition(diagnostic.position, host) + ": ";
    }
    if (diagnostic.span && diagnostic.span.details) {
        result += ": " + diagnostic.span.details + ", " + diagnostic.messageText + newLine;
    }
    else if (diagnostic.chain) {
        result += flattenDiagnosticMessageChain(diagnostic.chain, host) + "." + newLine;
    }
    else {
        result += ": " + diagnostic.messageText + newLine;
    }
    return result;
}
exports.formatDiagnostic = formatDiagnostic;
function formatDiagnostics(diags, host) {
    if (host === void 0) { host = defaultFormatHost; }
    if (diags && diags.length) {
        return diags
            .map(function (diagnostic) {
            if (api.isTsDiagnostic(diagnostic)) {
                return ts.formatDiagnostics([diagnostic], host);
            }
            else {
                return formatDiagnostic(diagnostic, host);
            }
        })
            .join('');
    }
    else {
        return '';
    }
}
exports.formatDiagnostics = formatDiagnostics;
function calcProjectFileAndBasePath(project) {
    var projectIsDir = fs.lstatSync(project).isDirectory();
    var projectFile = projectIsDir ? path.join(project, 'tsconfig.json') : project;
    var projectDir = projectIsDir ? project : path.dirname(project);
    var basePath = path.resolve(process.cwd(), projectDir);
    return { projectFile: projectFile, basePath: basePath };
}
exports.calcProjectFileAndBasePath = calcProjectFileAndBasePath;
function createNgCompilerOptions(basePath, config, tsOptions) {
    return __assign({}, tsOptions, config.angularCompilerOptions, { genDir: basePath, basePath: basePath });
}
exports.createNgCompilerOptions = createNgCompilerOptions;
function readConfiguration(project, existingOptions) {
    try {
        var _a = calcProjectFileAndBasePath(project), projectFile = _a.projectFile, basePath = _a.basePath;
        var _b = ts.readConfigFile(projectFile, ts.sys.readFile), config = _b.config, error = _b.error;
        if (error) {
            return {
                project: project,
                errors: [error],
                rootNames: [],
                options: {},
                emitFlags: api.EmitFlags.Default
            };
        }
        var parseConfigHost = {
            useCaseSensitiveFileNames: true,
            fileExists: fs.existsSync,
            readDirectory: ts.sys.readDirectory,
            readFile: ts.sys.readFile
        };
        var parsed = ts.parseJsonConfigFileContent(config, parseConfigHost, basePath, existingOptions);
        var rootNames = parsed.fileNames.map(function (f) { return path.normalize(f); });
        var options = createNgCompilerOptions(basePath, config, parsed.options);
        var emitFlags = api.EmitFlags.Default;
        if (!(options.skipMetadataEmit || options.flatModuleOutFile)) {
            emitFlags |= api.EmitFlags.Metadata;
        }
        if (options.skipTemplateCodegen) {
            emitFlags = emitFlags & ~api.EmitFlags.Codegen;
        }
        return { project: projectFile, rootNames: rootNames, options: options, errors: parsed.errors, emitFlags: emitFlags };
    }
    catch (e) {
        var errors = [{
                category: ts.DiagnosticCategory.Error,
                messageText: e.stack,
                source: api.SOURCE,
                code: api.UNKNOWN_ERROR_CODE
            }];
        return { project: '', errors: errors, rootNames: [], options: {}, emitFlags: api.EmitFlags.Default };
    }
}
exports.readConfiguration = readConfiguration;
function exitCodeFromResult(diags) {
    if (!diags || filterErrorsAndWarnings(diags).length === 0) {
        // If we have a result and didn't get any errors, we succeeded.
        return 0;
    }
    // Return 2 if any of the errors were unknown.
    return diags.some(function (d) { return d.source === 'angular' && d.code === api.UNKNOWN_ERROR_CODE; }) ? 2 : 1;
}
exports.exitCodeFromResult = exitCodeFromResult;
function performCompilation(_a) {
    var rootNames = _a.rootNames, options = _a.options, host = _a.host, oldProgram = _a.oldProgram, emitCallback = _a.emitCallback, mergeEmitResultsCallback = _a.mergeEmitResultsCallback, _b = _a.gatherDiagnostics, gatherDiagnostics = _b === void 0 ? defaultGatherDiagnostics : _b, customTransformers = _a.customTransformers, _c = _a.emitFlags, emitFlags = _c === void 0 ? api.EmitFlags.Default : _c;
    var program;
    var emitResult;
    var allDiagnostics = [];
    try {
        if (!host) {
            host = ng.createCompilerHost({ options: options });
        }
        program = ng.createProgram({ rootNames: rootNames, host: host, options: options, oldProgram: oldProgram });
        var beforeDiags = Date.now();
        allDiagnostics.push.apply(allDiagnostics, gatherDiagnostics(program));
        if (options.diagnostics) {
            var afterDiags = Date.now();
            allDiagnostics.push(util_1.createMessageDiagnostic("Time for diagnostics: " + (afterDiags - beforeDiags) + "ms."));
        }
        if (!hasErrors(allDiagnostics)) {
            emitResult =
                program.emit({ emitCallback: emitCallback, mergeEmitResultsCallback: mergeEmitResultsCallback, customTransformers: customTransformers, emitFlags: emitFlags });
            allDiagnostics.push.apply(allDiagnostics, emitResult.diagnostics);
            return { diagnostics: allDiagnostics, program: program, emitResult: emitResult };
        }
        return { diagnostics: allDiagnostics, program: program };
    }
    catch (e) {
        var errMsg = void 0;
        var code = void 0;
        if (compiler_1.isSyntaxError(e)) {
            // don't report the stack for syntax errors as they are well known errors.
            errMsg = e.message;
            code = api.DEFAULT_ERROR_CODE;
        }
        else {
            errMsg = e.stack;
            // It is not a syntax error we might have a program with unknown state, discard it.
            program = undefined;
            code = api.UNKNOWN_ERROR_CODE;
        }
        allDiagnostics.push({ category: ts.DiagnosticCategory.Error, messageText: errMsg, code: code, source: api.SOURCE });
        return { diagnostics: allDiagnostics, program: program };
    }
}
exports.performCompilation = performCompilation;
function defaultGatherDiagnostics(program) {
    var allDiagnostics = [];
    function checkDiagnostics(diags) {
        if (diags) {
            allDiagnostics.push.apply(allDiagnostics, diags);
            return !hasErrors(diags);
        }
        return true;
    }
    var checkOtherDiagnostics = true;
    // Check parameter diagnostics
    checkOtherDiagnostics = checkOtherDiagnostics &&
        checkDiagnostics(program.getTsOptionDiagnostics().concat(program.getNgOptionDiagnostics()));
    // Check syntactic diagnostics
    checkOtherDiagnostics =
        checkOtherDiagnostics && checkDiagnostics(program.getTsSyntacticDiagnostics());
    // Check TypeScript semantic and Angular structure diagnostics
    checkOtherDiagnostics =
        checkOtherDiagnostics &&
            checkDiagnostics(program.getTsSemanticDiagnostics().concat(program.getNgStructuralDiagnostics()));
    // Check Angular semantic diagnostics
    checkOtherDiagnostics =
        checkOtherDiagnostics && checkDiagnostics(program.getNgSemanticDiagnostics());
    return allDiagnostics;
}
function hasErrors(diags) {
    return diags.some(function (d) { return d.category === ts.DiagnosticCategory.Error; });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyZm9ybV9jb21waWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9wZXJmb3JtX2NvbXBpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7OztBQUVILDhDQUF1RTtBQUN2RSx1QkFBeUI7QUFDekIsMkJBQTZCO0FBQzdCLCtCQUFpQztBQUVqQyx3Q0FBMEM7QUFDMUMsZ0RBQWtEO0FBQ2xELDRDQUE0RDtBQUU1RCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFJdkIsaUNBQXdDLFdBQXdCO0lBQzlELE9BQU8sV0FBVyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxRQUFRLEtBQUssRUFBRSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBNUMsQ0FBNEMsQ0FBQyxDQUFDO0FBQy9FLENBQUM7QUFGRCwwREFFQztBQUVELElBQU0saUJBQWlCLEdBQTZCO0lBQ2xELG1CQUFtQixFQUFFLGNBQU0sT0FBQSxFQUFFLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLEVBQTVCLENBQTRCO0lBQ3ZELG9CQUFvQixFQUFFLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxFQUFSLENBQVE7SUFDMUMsVUFBVSxFQUFFLGNBQU0sT0FBQSxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBZCxDQUFjO0NBQ2pDLENBQUM7QUFFRix5QkFBeUIsUUFBZ0IsRUFBRSxJQUE4QjtJQUN2RSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDeEYsQ0FBQztBQUVELGtDQUNJLFFBQWtCLEVBQUUsSUFBa0Q7SUFBbEQscUJBQUEsRUFBQSx3QkFBa0Q7SUFDeEUsT0FBVSxlQUFlLENBQUMsUUFBUSxD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