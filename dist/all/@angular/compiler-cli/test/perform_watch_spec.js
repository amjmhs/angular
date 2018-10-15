"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var ng = require("../index");
var perform_watch_1 = require("../src/perform_watch");
var test_support_1 = require("./test_support");
describe('perform watch', function () {
    var testSupport;
    var outDir;
    beforeEach(function () {
        testSupport = test_support_1.setup();
        outDir = path.resolve(testSupport.basePath, 'outDir');
    });
    function createConfig() {
        var options = testSupport.createCompilerOptions({ outDir: outDir });
        return {
            options: options,
            rootNames: [path.resolve(testSupport.basePath, 'src/index.ts')],
            project: path.resolve(testSupport.basePath, 'src/tsconfig.json'),
            emitFlags: ng.EmitFlags.Default,
            errors: []
        };
    }
    it('should compile files during the initial run', function () {
        var config = createConfig();
        var host = new MockWatchHost(config);
        testSupport.writeFiles({
            'src/main.ts': createModuleAndCompSource('main'),
            'src/index.ts': "export * from './main'; ",
        });
        var watchResult = perform_watch_1.performWatchCompilation(host);
        test_support_1.expectNoDiagnostics(config.options, watchResult.firstCompileResult);
        expect(fs.existsSync(path.resolve(outDir, 'src', 'main.ngfactory.js'))).toBe(true);
    });
    it('should cache files on subsequent runs', function () {
        var config = createConfig();
        var host = new MockWatchHost(config);
        var fileExistsSpy;
        var getSourceFileSpy;
        host.createCompilerHost = function (options) {
            var ngHost = ng.createCompilerHost({ options: options });
            fileExistsSpy = spyOn(ngHost, 'fileExists').and.callThrough();
            getSourceFileSpy = spyOn(ngHost, 'getSourceFile').and.callThrough();
            return ngHost;
        };
        testSupport.writeFiles({
            'src/main.ts': createModuleAndCompSource('main'),
            'src/util.ts': "export const x = 1;",
            'src/index.ts': "\n        export * from './main';\n        export * from './util';\n      ",
        });
        var mainTsPath = path.resolve(testSupport.basePath, 'src', 'main.ts');
        var utilTsPath = path.resolve(testSupport.basePath, 'src', 'util.ts');
        var mainNgFactory = path.resolve(outDir, 'src', 'main.ngfactory.js');
        perform_watch_1.performWatchCompilation(host);
        expect(fs.existsSync(mainNgFactory)).toBe(true);
        expect(fileExistsSpy).toHaveBeenCalledWith(mainTsPath);
        expect(fileExistsSpy).toHaveBeenCalledWith(utilTsPath);
        expect(getSourceFileSpy).toHaveBeenCalledWith(mainTsPath, ts.ScriptTarget.ES5);
        expect(getSourceFileSpy).toHaveBeenCalledWith(utilTsPath, ts.ScriptTarget.ES5);
        fileExistsSpy.calls.reset();
        getSourceFileSpy.calls.reset();
        // trigger a single file change
        // -> all other files should be cached
        host.triggerFileChange(perform_watch_1.FileChangeEvent.Change, utilTsPath);
        test_support_1.expectNoDiagnostics(config.options, host.diagnostics);
        expect(fileExistsSpy).not.toHaveBeenCalledWith(mainTsPath);
        expect(fileExistsSpy).toHaveBeenCalledWith(utilTsPath);
        expect(getSourceFileSpy).not.toHaveBeenCalledWith(mainTsPath, ts.ScriptTarget.ES5);
        expect(getSourceFileSpy).toHaveBeenCalledWith(utilTsPath, ts.ScriptTarget.ES5);
        // trigger a folder change
        // -> nothing should be cached
        host.triggerFileChange(perform_watch_1.FileChangeEvent.CreateDeleteDir, path.resolve(testSupport.basePath, 'src'));
        test_support_1.expectNoDiagnostics(config.options, host.diagnostics);
        expect(fileExistsSpy).toHaveBeenCalledWith(mainTsPath);
        expect(fileExistsSpy).toHaveBeenCalledWith(utilTsPath);
        expect(getSourceFileSpy).toHaveBeenCalledWith(mainTsPath, ts.ScriptTarget.ES5);
        expect(getSourceFileSpy).toHaveBeenCalledWith(utilTsPath, ts.ScriptTarget.ES5);
    });
    it('should recover from static analysis errors', function () {
        var config = createConfig();
        var host = new MockWatchHost(config);
        var okFileContent = "\n      import {NgModule} from '@angular/core';\n\n      @NgModule()\n      export class MyModule {}\n    ";
        var errorFileContent = "\n      import {NgModule} from '@angular/core';\n\n      @NgModule((() => (1===1 ? null as any : null as any)) as any)\n      export class MyModule {}\n    ";
        var indexTsPath = path.resolve(testSupport.basePath, 'src', 'index.ts');
        testSupport.write(indexTsPath, okFileContent);
        perform_watch_1.performWatchCompilation(host);
        test_support_1.expectNoDiagnostics(config.options, host.diagnostics);
        // Do it multiple times as the watch mode switches internal modes.
        // E.g. from regular compile to using summaries, ...
        for (var i = 0; i < 3; i++) {
            host.diagnostics = [];
            testSupport.write(indexTsPath, okFileContent);
            host.triggerFileChange(perform_watch_1.FileChangeEvent.Change, indexTsPath);
            test_support_1.expectNoDiagnostics(config.options, host.diagnostics);
            host.diagnostics = [];
            testSupport.write(indexTsPath, errorFileContent);
            host.triggerFileChange(perform_watch_1.FileChangeEvent.Change, indexTsPath);
            var errDiags = host.diagnostics.filter(function (d) { return d.category === ts.DiagnosticCategory.Error; });
            expect(errDiags.length).toBe(1);
            expect(errDiags[0].messageText).toContain('Function expressions are not supported');
        }
    });
});
function createModuleAndCompSource(prefix, template) {
    if (template === void 0) { template = prefix + 'template'; }
    var templateEntry = template.endsWith('.html') ? "templateUrl: '" + template + "'" : "template: `" + template + "`";
    return "\n    import {Component, NgModule} from '@angular/core';\n\n    @Component({selector: '" + prefix + "', " + templateEntry + "})\n    export class " + prefix + "Comp {}\n\n    @NgModule({declarations: [" + prefix + "Comp]})\n    export class " + prefix + "Module {}\n  ";
}
var MockWatchHost = /** @class */ (function () {
    function MockWatchHost(config) {
        this.config = config;
        this.nextTimeoutListenerId = 1;
        this.timeoutListeners = {};
        this.fileChangeListeners = [];
        this.diagnostics = [];
    }
    MockWatchHost.prototype.reportDiagnostics = function (diags) {
        var _a;
        (_a = this.diagnostics).push.apply(_a, diags);
    };
    MockWatchHost.prototype.readConfiguration = function () { return this.config; };
    MockWatchHost.prototype.createCompilerHost = function (options) { return ng.createCompilerHost({ options: options }); };
    MockWatchHost.prototype.createEmitCallback = function () { return undefined; };
    MockWatchHost.prototype.onFileChange = function (options, listener, ready) {
        var _this = this;
        var id = this.fileChangeListeners.length;
        this.fileChangeListeners.push(listener);
        ready();
        return {
            close: function () { return _this.fileChangeListeners[id] = null; },
        };
    };
    MockWatchHost.prototype.setTimeout = function (callback) {
        var id = this.nextTimeoutListenerId++;
        this.timeoutListeners[id] = callback;
        return id;
    };
    MockWatchHost.prototype.clearTimeout = function (timeoutId) { delete this.timeoutListeners[timeoutId]; };
    MockWatchHost.prototype.flushTimeouts = function () {
        var listeners = this.timeoutListeners;
        this.timeoutListeners = {};
        Object.keys(listeners).forEach(function (id) { return listeners[id](); });
    };
    MockWatchHost.prototype.triggerFileChange = function (event, fileName) {
        this.fileChangeListeners.forEach(function (listener) {
            if (listener) {
                listener(event, fileName);
            }
        });
        this.flushTimeouts();
    };
    return MockWatchHost;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyZm9ybV93YXRjaF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3Rlc3QvcGVyZm9ybV93YXRjaF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsdUJBQXlCO0FBQ3pCLDJCQUE2QjtBQUM3QiwrQkFBaUM7QUFFakMsNkJBQStCO0FBQy9CLHNEQUE4RTtBQUU5RSwrQ0FBdUU7QUFFdkUsUUFBUSxDQUFDLGVBQWUsRUFBRTtJQUN4QixJQUFJLFdBQXdCLENBQUM7SUFDN0IsSUFBSSxNQUFjLENBQUM7SUFFbkIsVUFBVSxDQUFDO1FBQ1QsV0FBVyxHQUFHLG9CQUFLLEVBQUUsQ0FBQztRQUN0QixNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3hELENBQUMsQ0FBQyxDQUFDO0lBRUg7UUFDRSxJQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMscUJBQXFCLENBQUMsRUFBQyxNQUFNLFFBQUEsRUFBQyxDQUFDLENBQUM7UUFDNUQsT0FBTztZQUNMLE9BQU8sU0FBQTtZQUNQLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUMvRCxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLG1CQUFtQixDQUFDO1lBQ2hFLFNBQVMsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU87WUFDL0IsTUFBTSxFQUFFLEVBQUU7U0FDWCxDQUFDO0lBQ0osQ0FBQztJQUVELEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRTtRQUNoRCxJQUFNLE1BQU0sR0FBRyxZQUFZLEVBQUUsQ0FBQztRQUM5QixJQUFNLElBQUksR0FBRyxJQUFJLGFBQWEsQ0FBQyxNQUFNLENBQUMs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