#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var ts = require("typescript");
var tsickle = require("tsickle/src/tsickle");
var api = require("./transformers/api");
var util_1 = require("./transformers/util");
var perform_compile_1 = require("./perform_compile");
var perform_watch_1 = require("./perform_watch");
function main(args, consoleError, config) {
    if (consoleError === void 0) { consoleError = console.error; }
    var _a = config || readNgcCommandLineAndConfiguration(args), project = _a.project, rootNames = _a.rootNames, options = _a.options, configErrors = _a.errors, watch = _a.watch, emitFlags = _a.emitFlags;
    if (configErrors.length) {
        return reportErrorsAndExit(configErrors, /*options*/ undefined, consoleError);
    }
    if (watch) {
        var result = watchMode(project, options, consoleError);
        return reportErrorsAndExit(result.firstCompileResult, options, consoleError);
    }
    var compileDiags = perform_compile_1.performCompilation({ rootNames: rootNames, options: options, emitFlags: emitFlags, emitCallback: createEmitCallback(options) }).diagnostics;
    return reportErrorsAndExit(compileDiags, options, consoleError);
}
exports.main = main;
function createEmitCallback(options) {
    var transformDecorators = options.enableIvy !== 'ngtsc' && options.enableIvy !== 'tsc' &&
        options.annotationsAs !== 'decorators';
    var transformTypesToClosure = options.annotateForClosureCompiler;
    if (!transformDecorators && !transformTypesToClosure) {
        return undefined;
    }
    if (transformDecorators) {
        // This is needed as a workaround for https://github.com/angular/tsickle/issues/635
        // Otherwise tsickle might emit references to non imported values
        // as TypeScript elided the import.
        options.emitDecoratorMetadata = true;
    }
    var tsickleHost = {
        shouldSkipTsickleProcessing: function (fileName) {
            return /\.d\.ts$/.test(fileName) || util_1.GENERATED_FILES.test(fileName);
        },
        pathToModuleName: function (context, importPath) { return ''; },
        shouldIgnoreWarningsForPath: function (filePath) { return false; },
        fileNameToModuleId: function (fileName) { return fileName; },
        googmodule: false,
        untyped: true,
        convertIndexImportShorthand: false, transformDecorators: transformDecorators, transformTypesToClosure: transformTypesToClosure,
    };
    return function (_a) {
        var program = _a.program, targetSourceFile = _a.targetSourceFile, writeFile = _a.writeFile, cancellationToken = _a.cancellationToken, emitOnlyDtsFiles = _a.emitOnlyDtsFiles, _b = _a.customTransformers, customTransformers = _b === void 0 ? {} : _b, host = _a.host, options = _a.options;
        return tsickle.emitWithTsickle(program, __assign({}, tsickleHost, { options: options, host: host }), host, options, targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, {
            beforeTs: customTransformers.before,
            afterTs: customTransformers.after,
        });
    };
}
function readNgcCommandLineAndConfiguration(args) {
    var options = {};
    var parsedArgs = require('minimist')(args);
    if (parsedArgs.i18nFile)
        options.i18nInFile = parsedArgs.i18nFile;
    if (parsedArgs.i18nFormat)
        options.i18nInFormat = parsedArgs.i18nFormat;
    if (parsedArgs.locale)
        options.i18nInLocale = parsedArgs.locale;
    var mt = parsedArgs.missingTranslation;
    if (mt === 'error' || mt === 'warning' || mt === 'ignore') {
        options.i18nInMissingTranslations = mt;
    }
    var config = readCommandLineAndConfiguration(args, options, ['i18nFile', 'i18nFormat', 'locale', 'missingTranslation', 'watch']);
    var watch = parsedArgs.w || parsedArgs.watch;
    return __assign({}, config, { watch: watch });
}
function readCommandLineAndConfiguration(args, existingOptions, ngCmdLineOptions) {
    if (existingOptions === void 0) { existingOptions = {}; }
    if (ngCmdLineOptions === void 0) { ngCmdLineOptions = []; }
    var cmdConfig = ts.parseCommandLine(args);
    var project = cmdConfig.options.project || '.';
    var cmdErrors = cmdConfig.errors.filter(function (e) {
        if (typeof e.messageText === 'string') {
            var msg_1 = e.messageText;
            return !ngCmdLineOptions.some(function (o) { return msg_1.indexOf(o) >= 0; });
        }
        return true;
    });
    if (cmdErrors.length) {
        return {
            project: project,
            rootNames: [],
            options: cmdConfig.options,
            errors: cmdErrors,
            emitFlags: api.EmitFlags.Default
        };
    }
    var allDiagnostics = [];
    var config = perform_compile_1.readConfiguration(project, cmdConfig.options);
    var options = __assign({}, config.options, existingOptions);
    if (options.locale) {
        options.i18nInLocale = options.locale;
    }
    return {
        project: project,
        rootNames: config.rootNames, options: options,
        errors: config.errors,
        emitFlags: config.emitFlags
    };
}
exports.readCommandLineAndConfiguration = readCommandLineAndConfiguration;
function reportErrorsAndExit(allDiagnostics, options, consoleError) {
    if (consoleError === void 0) { consoleError = console.error; }
    var errorsAndWarnings = perform_compile_1.filterErrorsAndWarnings(allDiagnostics);
    if (errorsAndWarnings.length) {
        var currentDir_1 = options ? options.basePath : undefined;
        var formatHost = {
            getCurrentDirectory: function () { return currentDir_1 || ts.sys.getCurrentDirectory(); },
            getCanonicalFileName: function (fileName) { return fileName; },
            getNewLine: function () { return ts.sys.newLine; }
        };
        consoleError(perform_compile_1.formatDiagnostics(errorsAndWarnings, formatHost));
    }
    return perform_compile_1.exitCodeFromResult(allDiagnostics);
}
function watchMode(project, options, consoleError) {
    return perform_watch_1.performWatchCompilation(perform_watch_1.createPerformWatchHost(project, function (diagnostics) {
        consoleError(perform_compile_1.formatDiagnostics(diagnostics));
    }, options, function (options) { return createEmitCallback(options); }));
}
exports.watchMode = watchMode;
// CLI entry point
if (require.main === module) {
    var args = process.argv.slice(2);
    process.exitCode = main(args);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVVBLDRCQUEwQjtBQUUxQiwrQkFBaUM7QUFHakMsNkNBQW1DO0FBQ25DLHdDQUEwQztBQUUxQyw0Q0FBb0Q7QUFFcEQscURBQW9NO0FBQ3BNLGlEQUFnRjtBQUVoRixjQUNJLElBQWMsRUFBRSxZQUFpRCxFQUNqRSxNQUErQjtJQURmLDZCQUFBLEVBQUEsZUFBb0MsT0FBTyxDQUFDLEtBQUs7SUFFL0QsSUFBQSx1REFDa0QsRUFEakQsb0JBQU8sRUFBRSx3QkFBUyxFQUFFLG9CQUFPLEVBQUUsd0JBQW9CLEVBQUUsZ0JBQUssRUFBRSx3QkFBUyxDQUNqQjtJQUN2RCxJQUFJLFlBQVksQ0FBQyxNQUFNLEVBQUU7UUFDdkIsT0FBTyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztLQUMvRTtJQUNELElBQUksS0FBSyxFQUFFO1FBQ1QsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDekQsT0FBTyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0tBQzlFO0lBQ00sSUFBQSw0S0FBeUIsQ0FDZ0Q7SUFDaEYsT0FBTyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ2xFLENBQUM7QUFmRCxvQkFlQztBQUdELDRCQUE0QixPQUE0QjtJQUN0RCxJQUFNLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxTQUFTLEtBQUssT0FBTyxJQUFJLE9BQU8sQ0FBQyxTQUFTLEtBQUssS0FBSztRQUNwRixPQUFPLENBQUMsYUFBYSxLQUFLLFlBQVksQ0FB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