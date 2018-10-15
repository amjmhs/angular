"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var chokidar = require("chokidar");
var path = require("path");
var ts = require("typescript");
var perform_compile_1 = require("./perform_compile");
var api = require("./transformers/api");
var entry_points_1 = require("./transformers/entry_points");
var util_1 = require("./transformers/util");
function totalCompilationTimeDiagnostic(timeInMillis) {
    var duration;
    if (timeInMillis > 1000) {
        duration = (timeInMillis / 1000).toPrecision(2) + "s";
    }
    else {
        duration = timeInMillis + "ms";
    }
    return {
        category: ts.DiagnosticCategory.Message,
        messageText: "Total time: " + duration,
        code: api.DEFAULT_ERROR_CODE,
        source: api.SOURCE,
    };
}
var FileChangeEvent;
(function (FileChangeEvent) {
    FileChangeEvent[FileChangeEvent["Change"] = 0] = "Change";
    FileChangeEvent[FileChangeEvent["CreateDelete"] = 1] = "CreateDelete";
    FileChangeEvent[FileChangeEvent["CreateDeleteDir"] = 2] = "CreateDeleteDir";
})(FileChangeEvent = exports.FileChangeEvent || (exports.FileChangeEvent = {}));
function createPerformWatchHost(configFileName, reportDiagnostics, existingOptions, createEmitCallback) {
    return {
        reportDiagnostics: reportDiagnostics,
        createCompilerHost: function (options) { return entry_points_1.createCompilerHost({ options: options }); },
        readConfiguration: function () { return perform_compile_1.readConfiguration(configFileName, existingOptions); },
        createEmitCallback: function (options) { return createEmitCallback ? createEmitCallback(options) : undefined; },
        onFileChange: function (options, listener, ready) {
            if (!options.basePath) {
                reportDiagnostics([{
                        category: ts.DiagnosticCategory.Error,
                        messageText: 'Invalid configuration option. baseDir not specified',
                        source: api.SOURCE,
                        code: api.DEFAULT_ERROR_CODE
                    }]);
                return { close: function () { } };
            }
            var watcher = chokidar.watch(options.basePath, {
                // ignore .dotfiles, .js and .map files.
                // can't ignore other files as we e.g. want to recompile if an `.html` file changes as well.
                ignored: /((^[\/\\])\..)|(\.js$)|(\.map$)|(\.metadata\.json)/,
                ignoreInitial: true,
                persistent: true,
            });
            watcher.on('all', function (event, path) {
                switch (event) {
                    case 'change':
                        listener(FileChangeEvent.Change, path);
                        break;
                    case 'unlink':
                    case 'add':
                        listener(FileChangeEvent.CreateDelete, path);
                        break;
                    case 'unlinkDir':
                    case 'addDir':
                        listener(FileChangeEvent.CreateDeleteDir, path);
                        break;
                }
            });
            watcher.on('ready', ready);
            return { close: function () { return watcher.close(); }, ready: ready };
        },
        setTimeout: (ts.sys.clearTimeout && ts.sys.setTimeout) || setTimeout,
        clearTimeout: (ts.sys.setTimeout && ts.sys.clearTimeout) || clearTimeout,
    };
}
exports.createPerformWatchHost = createPerformWatchHost;
/**
 * The logic in this function is adapted from `tsc.ts` from TypeScript.
 */
function performWatchCompilation(host) {
    var cachedProgram; // Program cached from last compilation
    var cachedCompilerHost; // CompilerHost cached from last compilation
    var cachedOptions; // CompilerOptions cached from last compilation
    var timerHandleForRecompilation; // Handle for 0.25s wait timer to trigger recompilation
    var ingoreFilesForWatch = new Set();
    var fileCache = new Map();
    var firstCompileResult = doCompilation();
    // Watch basePath, ignoring .dotfiles
    var resolveReadyPromise;
    var readyPromise = new Promise(function (resolve) { return resolveReadyPromise = resolve; });
    // Note: ! is ok as options are filled after the first compilation
    // Note: ! is ok as resolvedReadyPromise is filled by the previous call
    var fileWatcher = host.onFileChange(cachedOptions.options, watchedFileChanged, resolveReadyPromise);
    return { close: close, ready: function (cb) { return readyPromise.then(cb); }, firstCompileResult: firstCompileResult };
    function cacheEntry(fileName) {
        fileName = path.normalize(fileName);
        var entry = fileCache.get(fileName);
        if (!entry) {
            entry = {};
            fileCache.set(fileName, entry);
        }
        return entry;
    }
    function close() {
        fileWatcher.close();
        if (timerHandleForRecompilation) {
            host.clearTimeout(timerHandleForRecompilation);
            timerHandleForRecompilation = undefined;
        }
    }
    // Invoked to perform initial compilation or re-compilation in watch mode
    function doCompilation() {
        if (!cachedOptions) {
            cachedOptions = host.readConfiguration();
        }
        if (cachedOptions.errors && cachedOptions.errors.length) {
            host.reportDiagnostics(cachedOptions.errors);
            return cachedOptions.errors;
        }
        var startTime = Date.now();
        if (!cachedCompilerHost) {
            cachedCompilerHost = host.createCompilerHost(cachedOptions.options);
            var originalWriteFileCallback_1 = cachedCompilerHost.writeFile;
            cachedCompilerHost.writeFile = function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
                if (sourceFiles === void 0) { sourceFiles = []; }
                ingoreFilesForWatch.add(path.normalize(fileName));
                return originalWriteFileCallback_1(fileName, data, writeByteOrderMark, onError, sourceFiles);
            };
            var originalFileExists_1 = cachedCompilerHost.fileExists;
            cachedCompilerHost.fileExists = function (fileName) {
                var ce = cacheEntry(fileName);
                if (ce.exists == null) {
                    ce.exists = originalFileExists_1.call(this, fileName);
                }
                return ce.exists;
            };
            var originalGetSourceFile_1 = cachedCompilerHost.getSourceFile;
            cachedCompilerHost.getSourceFile = function (fileName, languageVersion) {
                var ce = cacheEntry(fileName);
                if (!ce.sf) {
                    ce.sf = originalGetSourceFile_1.call(this, fileName, languageVersion);
                }
                return ce.sf;
            };
            var originalReadFile_1 = cachedCompilerHost.readFile;
            cachedCompilerHost.readFile = function (fileName) {
                var ce = cacheEntry(fileName);
                if (ce.content == null) {
                    ce.content = originalReadFile_1.call(this, fileName);
                }
                return ce.content;
            };
        }
        ingoreFilesForWatch.clear();
        var oldProgram = cachedProgram;
        // We clear out the `cachedProgram` here as a
        // program can only be used as `oldProgram` 1x
        cachedProgram = undefined;
        var compileResult = perform_compile_1.performCompilation({
            rootNames: cachedOptions.rootNames,
            options: cachedOptions.options,
            host: cachedCompilerHost,
            oldProgram: cachedProgram,
            emitCallback: host.createEmitCallback(cachedOptions.options)
        });
        if (compileResult.diagnostics.length) {
            host.reportDiagnostics(compileResult.diagnostics);
        }
        var endTime = Date.now();
        if (cachedOptions.options.diagnostics) {
            var totalTime = (endTime - startTime) / 1000;
            host.reportDiagnostics([totalCompilationTimeDiagnostic(endTime - startTime)]);
        }
        var exitCode = perform_compile_1.exitCodeFromResult(compileResult.diagnostics);
        if (exitCode == 0) {
            cachedProgram = compileResult.program;
            host.reportDiagnostics([util_1.createMessageDiagnostic('Compilation complete. Watching for file changes.')]);
        }
        else {
            host.reportDiagnostics([util_1.createMessageDiagnostic('Compilation failed. Watching for file changes.')]);
        }
        return compileResult.diagnostics;
    }
    function resetOptions() {
        cachedProgram = undefined;
        cachedCompilerHost = undefined;
        cachedOptions = undefined;
    }
    function watchedFileChanged(event, fileName) {
        if (cachedOptions && event === FileChangeEvent.Change &&
            // TODO(chuckj): validate that this is sufficient to skip files that were written.
            // This assumes that the file path we write is the same file path we will receive in the
            // change notification.
            path.normalize(fileName) === path.normalize(cachedOptions.project)) {
            // If the configuration file changes, forget everything and start the recompilation timer
            resetOptions();
        }
        else if (event === FileChangeEvent.CreateDelete || event === FileChangeEvent.CreateDeleteDir) {
            // If a file was added or removed, reread the configuration
            // to determine the new list of root files.
            cachedOptions = undefined;
        }
        if (event === FileChangeEvent.CreateDeleteDir) {
            fileCache.clear();
        }
        else {
            fileCache.delete(path.normalize(fileName));
        }
        if (!ingoreFilesForWatch.has(path.normalize(fileName))) {
            // Ignore the file if the file is one that was written by the compiler.
            startTimerForRecompilation();
        }
    }
    // Upon detecting a file change, wait for 250ms and then perform a recompilation. This gives batch
    // operations (such as saving all modified files in an editor) a chance to complete before we kick
    // off a new compilation.
    function startTimerForRecompilation() {
        if (timerHandleForRecompilation) {
            host.clearTimeout(timerHandleForRecompilation);
        }
        timerHandleForRecompilation = host.setTimeout(recompile, 250);
    }
    function recompile() {
        timerHandleForRecompilation = undefined;
        host.reportDiagnostics([util_1.createMessageDiagnostic('File change detected. Starting incremental compilation.')]);
        doCompilation();
    }
}
exports.performWatchCompilation = performWatchCompilation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyZm9ybV93YXRjaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvcGVyZm9ybV93YXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILG1DQUFxQztBQUNyQywyQkFBNkI7QUFDN0IsK0JBQWlDO0FBRWpDLHFEQUF3SjtBQUN4Six3Q0FBMEM7QUFDMUMsNERBQStEO0FBQy9ELDRDQUE0RDtBQUU1RCx3Q0FBd0MsWUFBb0I7SUFDMUQsSUFBSSxRQUFnQixDQUFDO0lBQ3JCLElBQUksWUFBWSxHQUFHLElBQUksRUFBRTtRQUN2QixRQUFRLEdBQU0sQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFHLENBQUM7S0FDdkQ7U0FBTTtRQUNMLFFBQVEsR0FBTSxZQUFZLE9BQUksQ0FBQztLQUNoQztJQUNELE9BQU87UUFDTCxRQUFRLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUFDLE9BQU87UUFDdkMsV0FBVyxFQUFFLGlCQUFlLFFBQVU7UUFDdEMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxrQkFBa0I7UUFDNUIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNO0tBQ25CLENBQUM7QUFDSixDQUFDO0FBRUQsSUFBWSxlQUlYO0FBSkQsV0FBWSxlQUFlO0lBQ3pCLHlEQUFNLENBQUE7SUFDTixxRUFBWSxDQUFBO0lBQ1osMkVBQWUsQ0FBQTtBQUNqQixDQUFDLEVBSlcsZUFBZSxHQUFmLHVCQUFlLEtBQWYsdUJBQWUsUUFJMUI7QUFjRCxnQ0FDSSxjQUFzQixFQUFFLGlCQUFxRCxFQUM3RSxlQUFvQyxFQUFFLGtCQUNrQztJQUMxRSxPQUFPO1FBQ0wsaUJBQWlCLEVBQUUsaUJBQWlCO1FBQ3BDLGtCQUFrQixFQUFFLFVBQUEsT0FBTyxJQUFJLE9BQUEsaUNBQWtCLENBQUMsRUFBQyxPQUFPLFNBQUEsRUFB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