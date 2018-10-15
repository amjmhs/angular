"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var test_support_1 = require("@angular/compiler-cli/test/test_support");
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var angularts = /@angular\/(\w|\/|-)+\.tsx?$/;
var rxjsts = /rxjs\/(\w|\/)+\.tsx?$/;
var rxjsmetadata = /rxjs\/(\w|\/)+\.metadata\.json?$/;
var tsxfile = /\.tsx$/;
/* The missing cache does two things. First it improves performance of the
   tests as it reduces the number of OS calls made during testing. Also it
   improves debugging experience as fewer exceptions are raised allow you
   to use stopping on all exceptions. */
var missingCache = new Map();
var cacheUsed = new Set();
var reportedMissing = new Set();
/**
 * The cache is valid if all the returned entries are empty.
 */
function validateCache() {
    var exists = [];
    var unused = [];
    for (var _i = 0, _a = iterableToArray(missingCache.keys()); _i < _a.length; _i++) {
        var fileName = _a[_i];
        if (fs.existsSync(fileName)) {
            exists.push(fileName);
        }
        if (!cacheUsed.has(fileName)) {
            unused.push(fileName);
        }
    }
    return { exists: exists, unused: unused, reported: iterableToArray(reportedMissing.keys()) };
}
exports.validateCache = validateCache;
missingCache.set('/node_modules/@angular/core.d.ts', true);
missingCache.set('/node_modules/@angular/animations.d.ts', true);
missingCache.set('/node_modules/@angular/platform-browser/animations.d.ts', true);
missingCache.set('/node_modules/@angular/common.d.ts', true);
missingCache.set('/node_modules/@angular/forms.d.ts', true);
missingCache.set('/node_modules/@angular/core/src/di/provider.metadata.json', true);
missingCache.set('/node_modules/@angular/core/src/change_detection/pipe_transform.metadata.json', true);
missingCache.set('/node_modules/@angular/core/src/reflection/types.metadata.json', true);
missingCache.set('/node_modules/@angular/core/src/reflection/platform_reflection_capabilities.metadata.json', true);
missingCache.set('/node_modules/@angular/forms/src/directives/form_interface.metadata.json', true);
var MockTypescriptHost = /** @class */ (function () {
    function MockTypescriptHost(scriptNames, data, node_modules, myPath) {
        if (node_modules === void 0) { node_modules = 'node_modules'; }
        if (myPath === void 0) { myPath = path; }
        this.scriptNames = scriptNames;
        this.data = data;
        this.node_modules = node_modules;
        this.myPath = myPath;
        this.scriptVersion = new Map();
        this.overrides = new Map();
        this.projectVersion = 0;
        this.overrideDirectory = new Set();
        var moduleFilename = module.filename.replace(/\\/g, '/');
        if (test_support_1.isInBazel()) {
            var support = test_support_1.setup();
            this.nodeModulesPath = path.join(support.basePath, 'node_modules');
            this.angularPath = path.join(this.nodeModulesPath, '@angular');
        }
        else {
            var angularIndex = moduleFilename.indexOf('@angular');
            if (angularIndex >= 0)
                this.angularPath =
                    moduleFilename.substr(0, angularIndex).replace('/all/', '/all/@angular/');
            var distIndex = moduleFilename.indexOf('/dist/all');
            if (distIndex >= 0)
                this.nodeModulesPath = myPath.join(moduleFilename.substr(0, distIndex), 'node_modules');
        }
        this.options = {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            removeComments: false,
            noImplicitAny: false,
            lib: ['lib.es2015.d.ts', 'lib.dom.d.ts'],
        };
    }
    MockTypescriptHost.prototype.override = function (fileName, content) {
        this.scriptVersion.set(fileName, (this.scriptVersion.get(fileName) || 0) + 1);
        if (fileName.endsWith('.ts')) {
            this.projectVersion++;
        }
        if (content) {
            this.overrides.set(fileName, content);
            this.overrideDirectory.add(path.dirname(fileName));
        }
        else {
            this.overrides.delete(fileName);
        }
    };
    MockTypescriptHost.prototype.addScript = function (fileName, content) {
        this.projectVersion++;
        this.overrides.set(fileName, content);
        this.overrideDirectory.add(path.dirname(fileName));
        this.scriptNames.push(fileName);
    };
    MockTypescriptHost.prototype.forgetAngular = function () { this.angularPath = undefined; };
    MockTypescriptHost.prototype.overrideOptions = function (cb) {
        this.options = cb(Object.assign({}, this.options));
        this.projectVersion++;
    };
    MockTypescriptHost.prototype.getCompilationSettings = function () { return this.options; };
    MockTypescriptHost.prototype.getProjectVersion = function () { return this.projectVersion.toString(); };
    MockTypescriptHost.prototype.getScriptFileNames = function () { return this.scriptNames; };
    MockTypescriptHost.prototype.getScriptVersion = function (fileName) {
        return (this.scriptVersion.get(fileName) || 0).toString();
    };
    MockTypescriptHost.prototype.getScriptSnapshot = function (fileName) {
        var content = this.getFileContent(fileName);
        if (content)
            return ts.ScriptSnapshot.fromString(content);
        return undefined;
    };
    MockTypescriptHost.prototype.getCurrentDirectory = function () { return '/'; };
    MockTypescriptHost.prototype.getDefaultLibFileName = function (options) { return 'lib.d.ts'; };
    MockTypescriptHost.prototype.directoryExists = function (directoryName) {
        if (this.overrideDirectory.has(directoryName))
            return true;
        var effectiveName = this.getEffectiveName(directoryName);
        if (effectiveName === directoryName) {
            return directoryExists(directoryName, this.data);
        }
        else if (effectiveName == '/' + this.node_modules) {
            return true;
        }
        else {
            return fs.existsSync(effectiveName);
        }
    };
    MockTypescriptHost.prototype.fileExists = function (fileName) { return this.getRawFileContent(fileName) != null; };
    MockTypescriptHost.prototype.getMarkerLocations = function (fileName) {
        var content = this.getRawFileContent(fileName);
        if (content) {
            return getLocationMarkers(content);
        }
    };
    MockTypescriptHost.prototype.getReferenceMarkers = function (fileName) {
        var content = this.getRawFileContent(fileName);
        if (content) {
            return getReferenceMarkers(content);
        }
    };
    MockTypescriptHost.prototype.getFileContent = function (fileName) {
        var content = this.getRawFileContent(fileName);
        if (content)
            return removeReferenceMarkers(removeLocationMarkers(content));
    };
    MockTypescriptHost.prototype.getRawFileContent = function (fileName) {
        if (this.overrides.has(fileName)) {
            return this.overrides.get(fileName);
        }
        var basename = path.basename(fileName);
        if (/^lib.*\.d\.ts$/.test(basename)) {
            var libPath = ts.getDefaultLibFilePath(this.getCompilationSettings());
            return fs.readFileSync(this.myPath.join(path.dirname(libPath), basename), 'utf8');
        }
        else {
            if (missingCache.has(fileName)) {
                cacheUsed.add(fileName);
                return undefined;
            }
            var effectiveName = this.getEffectiveName(fileName);
            if (effectiveName === fileName)
                return open(fileName, this.data);
            else if (!fileName.match(angularts) && !fileName.match(rxjsts) && !fileName.match(rxjsmetadata) &&
                !fileName.match(tsxfile)) {
                if (fs.existsSync(effectiveName)) {
                    return fs.readFileSync(effectiveName, 'utf8');
                }
                else {
                    missingCache.set(fileName, true);
                    reportedMissing.add(fileName);
                    cacheUsed.add(fileName);
                }
            }
        }
    };
    MockTypescriptHost.prototype.getEffectiveName = function (name) {
        var node_modules = this.node_modules;
        var at_angular = '/@angular';
        if (name.startsWith('/' + node_modules)) {
            if (this.nodeModulesPath && !name.startsWith('/' + node_modules + at_angular)) {
                var result = this.myPath.join(this.nodeModulesPath, name.substr(node_modules.length + 1));
                if (!name.match(rxjsts))
                    if (fs.existsSync(result)) {
                        return result;
                    }
            }
            if (this.angularPath && name.startsWith('/' + node_modules + at_angular)) {
                return this.myPath.join(this.angularPath, name.substr(node_modules.length + at_angular.length + 1));
            }
        }
        return name;
    };
    return MockTypescriptHost;
}());
exports.MockTypescriptHost = MockTypescriptHost;
function iterableToArray(iterator) {
    var result = [];
    while (true) {
        var next = iterator.next();
        if (next.done)
            break;
        result.push(next.value);
    }
    return result;
}
function find(fileName, data) {
    var names = fileName.split('/');
    if (names.length && !names[0].length)
        names.shift();
    var current = data;
    for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
        var name_1 = names_1[_i];
        if (typeof current === 'string')
            return undefined;
        else
            current = current[name_1];
        if (!current)
            return undefined;
    }
    return current;
}
function open(fileName, data) {
    var result = find(fileName, data);
    if (typeof result === 'string') {
        return result;
    }
    return undefined;
}
function directoryExists(dirname, data) {
    var result = find(dirname, data);
    return !!result && typeof result !== 'string';
}
var locationMarker = /\~\{(\w+(-\w+)*)\}/g;
function removeLocationMarkers(value) {
    return value.replace(locationMarker, '');
}
function getLocationMarkers(value) {
    value = removeReferenceMarkers(value);
    var result = {};
    var adjustment = 0;
    value.replace(locationMarker, function (match, name, _, index) {
        result[name] = index - adjustment;
        adjustment += match.length;
        return '';
    });
    return result;
}
var referenceMarker = /«(((\w|\-)+)|([^∆]*∆(\w+)∆.[^»]*))»/g;
var definitionMarkerGroup = 1;
var nameMarkerGroup = 2;
function getReferenceMarkers(value) {
    var references = {};
    var definitions = {};
    value = removeLocationMarkers(value);
    var adjustment = 0;
    var text = value.replace(referenceMarker, function (match, text, reference, _, definition, definitionName, index) {
        var result = reference ? text : text.replace(/∆/g, '');
        var span = { start: index - adjustment, end: index - adjustment + result.length };
        var markers = reference ? references : definitions;
        var name = reference || definitionName;
        (markers[name] = (markers[name] || [])).push(span);
        adjustment += match.length - result.length;
        return result;
    });
    return { text: text, definitions: definitions, references: references };
}
function removeReferenceMarkers(value) {
    return value.replace(referenceMarker, function (match, text) { return text.replace(/∆/g, ''); });
}
function noDiagnostics(diagnostics) {
    if (diagnostics && diagnostics.length) {
        throw new Error("Unexpected diagnostics: \n  " + diagnostics.map(function (d) { return d.message; }).join('\n  '));
    }
}
exports.noDiagnostics = noDiagnostics;
function diagnosticMessageContains(message, messageFragment) {
    if (typeof message == 'string') {
        return message.indexOf(messageFragment) >= 0;
    }
    if (message.message.indexOf(messageFragment) >= 0) {
        return true;
    }
    if (message.next) {
        return diagnosticMessageContains(message.next, messageFragment);
    }
    return false;
}
exports.diagnosticMessageContains = diagnosticMessageContains;
function findDiagnostic(diagnostics, messageFragment) {
    return diagnostics.find(function (d) { return diagnosticMessageContains(d.message, messageFragment); });
}
exports.findDiagnostic = findDiagnostic;
function includeDiagnostic(diagnostics, message, p1, p2) {
    expect(diagnostics).toBeDefined();
    if (diagnostics) {
        var diagnostic = findDiagnostic(diagnostics, message);
        expect(diagnostic).toBeDefined("no diagnostic contains '" + message);
        if (diagnostic && p1 != null) {
            var at = typeof p1 === 'number' ? p1 : p2.indexOf(p1);
            var len = typeof p2 === 'number' ? p2 : p1.length;
            expect(diagnostic.span.start)
                .toEqual(at, "expected message '" + message + "' was reported at " + diagnostic.span.start + " but should be " + at);
            if (len != null) {
                expect(diagnostic.span.end - diagnostic.span.start)
                    .toEqual(len, "expected '" + message + "'s span length to be " + len);
            }
        }
    }
}
exports.includeDiagnostic = includeDiagnostic;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF91dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xhbmd1YWdlLXNlcnZpY2UvdGVzdC90ZXN0X3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsd0VBQXlFO0FBQ3pFLHVCQUF5QjtBQUN6QiwyQkFBNkI7QUFDN0IsK0JBQWlDO0FBVWpDLElBQU0sU0FBUyxHQUFHLDZCQUE2QixDQUFDO0FBQ2hELElBQU0sTUFBTSxHQUFHLHVCQUF1QixDQUFDO0FBQ3ZDLElBQU0sWUFBWSxHQUFHLGtDQUFrQyxDQUFDO0FBQ3hELElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQztBQUV6Qjs7O3dDQUd3QztBQUN4QyxJQUFNLFlBQVksR0FBRyxJQUFJLEdBQUcsRUFBbUIsQ0FBQztBQUNoRCxJQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO0FBQ3BDLElBQU0sZUFBZSxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7QUFFMUM7O0dBRUc7QUFDSDtJQUNFLElBQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztJQUM1QixJQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7SUFDNUIsS0FBdUIsVUFBb0MsRUFBcEMsS0FBQSxlQUFlLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQXBDLGNBQW9DLEVBQXBDLElBQW9DLEVBQUU7UUFBeEQsSUFBTSxRQUFRLFNBQUE7UUFDakIsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDdkI7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3ZCO0tBQ0Y7SUFDRCxPQUFPLEVBQUMsTUFBTSxRQUFBLEVB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