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
var MockAotContext = /** @class */ (function () {
    function MockAotContext(currentDirectory) {
        var files = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            files[_i - 1] = arguments[_i];
        }
        this.currentDirectory = currentDirectory;
        this.files = files;
    }
    MockAotContext.prototype.fileExists = function (fileName) { return typeof this.getEntry(fileName) === 'string'; };
    MockAotContext.prototype.directoryExists = function (path) {
        return path === this.currentDirectory || typeof this.getEntry(path) === 'object';
    };
    MockAotContext.prototype.readFile = function (fileName) {
        var data = this.getEntry(fileName);
        if (typeof data === 'string') {
            return data;
        }
        return undefined;
    };
    MockAotContext.prototype.readResource = function (fileName) {
        var result = this.readFile(fileName);
        if (result == null) {
            return Promise.reject(new Error("Resource not found: " + fileName));
        }
        return Promise.resolve(result);
    };
    MockAotContext.prototype.writeFile = function (fileName, data) {
        var parts = fileName.split('/');
        var name = parts.pop();
        var entry = this.getEntry(parts);
        if (entry && typeof entry !== 'string') {
            entry[name] = data;
        }
    };
    MockAotContext.prototype.assumeFileExists = function (fileName) { this.writeFile(fileName, ''); };
    MockAotContext.prototype.getEntry = function (fileName) {
        var parts = typeof fileName === 'string' ? fileName.split('/') : fileName;
        if (parts[0]) {
            parts = this.currentDirectory.split('/').concat(parts);
        }
        parts.shift();
        parts = normalize(parts);
        return first(this.files, function (files) { return getEntryFromFiles(parts, files); });
    };
    MockAotContext.prototype.getDirectories = function (path) {
        var dir = this.getEntry(path);
        if (typeof dir !== 'object') {
            return [];
        }
        else {
            return Object.keys(dir).filter(function (key) { return typeof dir[key] === 'object'; });
        }
    };
    MockAotContext.prototype.override = function (files) { return new (MockAotContext.bind.apply(MockAotContext, [void 0, this.currentDirectory, files].concat(this.files)))(); };
    return MockAotContext;
}());
exports.MockAotContext = MockAotContext;
function first(a, cb) {
    for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
        var value = a_1[_i];
        var result = cb(value);
        if (result != null)
            return result;
    }
}
function getEntryFromFiles(parts, files) {
    var current = files;
    while (parts.length) {
        var part = parts.shift();
        if (typeof current === 'string') {
            return undefined;
        }
        var next = current[part];
        if (next === undefined) {
            return undefined;
        }
        current = next;
    }
    return current;
}
function normalize(parts) {
    var result = [];
    while (parts.length) {
        var part = parts.shift();
        switch (part) {
            case '.':
                break;
            case '..':
                result.pop();
                break;
            default:
                result.push(part);
        }
    }
    return result;
}
var MockCompilerHost = /** @class */ (function () {
    function MockCompilerHost(context) {
        var _this = this;
        this.context = context;
        this.writeFile = function (fileName, text) { _this.context.writeFile(fileName, text); };
    }
    MockCompilerHost.prototype.fileExists = function (fileName) { return this.context.fileExists(fileName); };
    MockCompilerHost.prototype.readFile = function (fileName) { return this.context.readFile(fileName); };
    MockCompilerHost.prototype.directoryExists = function (directoryName) {
        return this.context.directoryExists(directoryName);
    };
    MockCompilerHost.prototype.getSourceFile = function (fileName, languageVersion, onError) {
        var sourceText = this.context.readFile(fileName);
        if (sourceText != null) {
            return ts.createSourceFile(fileName, sourceText, languageVersion);
        }
        else {
            return undefined;
        }
    };
    MockCompilerHost.prototype.getDefaultLibFileName = function (options) {
        return ts.getDefaultLibFileName(options);
    };
    MockCompilerHost.prototype.getCurrentDirectory = function () { return this.context.currentDirectory; };
    MockCompilerHost.prototype.getCanonicalFileName = function (fileName) { return fileName; };
    MockCompilerHost.prototype.useCaseSensitiveFileNames = function () { return false; };
    MockCompilerHost.prototype.getNewLine = function () { return '\n'; };
    MockCompilerHost.prototype.getDirectories = function (path) { return this.context.getDirectories(path); };
    return MockCompilerHost;
}());
exports.MockCompilerHost = MockCompilerHost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9ja3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvdGVzdC9tb2Nrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtCQUFpQztBQU1qQztJQUdFLHdCQUFtQixnQkFBd0I7UUFBRSxlQUFpQjthQUFqQixVQUFpQixFQUFqQixxQkFBaUIsRUFBakIsSUFBaUI7WUFBakIsOEJBQWlCOztRQUEzQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQVE7UUFBdUIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFBQyxDQUFDO0lBRXZGLG1DQUFVLEdBQVYsVUFBVyxRQUFnQixJQUFhLE9BQU8sT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFFN0Ysd0NBQWUsR0FBZixVQUFnQixJQUFZO1FBQzFCLE9BQU8sSUFBSSxLQUFLLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssUUFBUSxDQUFDO0lBQ25GLENBQUM7SUFFRCxpQ0FBUSxHQUFSLFVBQVMsUUFBZ0I7UUFDdkIsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyQyxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUM1QixPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsT0FBTyxTQUFXLENBQUM7SUFDckIsQ0FBQztJQUVELHFDQUFZLEdBQVosVUFBYSxRQUFnQjtRQUMzQixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksTUFBTSxJQUFJLElBQUksRUFBRTtZQUNsQixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMseUJBQXVC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