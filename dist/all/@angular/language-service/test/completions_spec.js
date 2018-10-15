"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var ts = require("typescript");
var language_service_1 = require("../src/language_service");
var typescript_host_1 = require("../src/typescript_host");
var test_data_1 = require("./test_data");
var test_utils_1 = require("./test_utils");
describe('completions', function () {
    var documentRegistry = ts.createDocumentRegistry();
    var mockHost = new test_utils_1.MockTypescriptHost(['/app/main.ts', '/app/parsing-cases.ts'], test_data_1.toh);
    var service = ts.createLanguageService(mockHost, documentRegistry);
    var ngHost = new typescript_host_1.TypeScriptServiceHost(mockHost, service);
    var ngService = language_service_1.createLanguageService(ngHost);
    ngHost.setSite(ngService);
    it('should be able to get entity completions', function () { contains('/app/test.ng', 'entity-amp', '&amp;', '&gt;', '&lt;', '&iota;'); });
    it('should be able to return html elements', function () {
        var htmlTags = ['h1', 'h2', 'div', 'span'];
        var locations = ['empty', 'start-tag-h1', 'h1-content', 'start-tag', 'start-tag-after-h'];
        for (var _i = 0, locations_1 = locations; _i < locations_1.length; _i++) {
            var location_1 = locations_1[_i];
            contains.apply(void 0, ['/app/test.ng', location_1].concat(htmlTags));
        }
    });
    it('should be able to return element diretives', function () { contains('/app/test.ng', 'empty', 'my-app'); });
    it('should be able to return h1 attributes', function () { contains('/app/test.ng', 'h1-after-space', 'id', 'dir', 'lang', 'onclick'); });
    it('should be able to find common angular attributes', function () { contains('/app/test.ng', 'div-attributes', '(click)', '[ngClass]'); });
    it('should be able to get completions in some random garbage', function () {
        var fileName = '/app/test.ng';
        mockHost.override(fileName, ' > {{tle<\n  {{retl  ><bel/beled}}di>\n   la</b  </d    &a  ');
        expect(function () { return ngService.getCompletionsAt(fileName, 31); }).not.toThrow();
        mockHost.override(fileName, undefined);
    });
    it('should be able to infer the type of a ngForOf', function () {
        addCode("\n      interface Person {\n        name: string,\n        street: string\n      }\n\n      @Component({template: '<div *ngFor=\"let person of people\">{{person.~{name}name}}</div'})\n      export class MyComponent {\n        people: Person[]\n      }", function () { contains('/app/app.component.ts', 'name', 'name', 'street'); });
    });
    it('should be able to infer the type of a ngForOf with an async pipe', function () {
        addCode("\n      interface Person {\n        name: string,\n        street: string\n      }\n\n      @Component({template: '<div *ngFor=\"let person of people | async\">{{person.~{name}name}}</div'})\n      export class MyComponent {\n        people: Promise<Person[]>;\n      }", function () { contains('/app/app.component.ts', 'name', 'name', 'street'); });
    });
    it('should be able to complete every character in the file', function () {
        var fileName = '/app/test.ng';
        expect(function () {
            var chance = 0.05;
            var requests = 0;
            function tryCompletionsAt(position) {
                try {
                    if (Math.random() < chance) {
                        ngService.getCompletionsAt(fileName, position);
                        requests++;
                    }
                }
                catch (e) {
                    // Emit enough diagnostic information to reproduce the error.
                    console.error("Position: " + position + "\nContent: \"" + mockHost.getFileContent(fileName) + "\"\nStack:\n" + e.stack);
                    throw e;
                }
            }
            try {
                var originalContent = mockHost.getFileContent(fileName);
                // For each character in the file, add it to the file and request a completion after it.
                for (var index = 0, len = originalContent.length; index < len; index++) {
                    var content_1 = originalContent.substr(0, index);
                    mockHost.override(fileName, content_1);
                    tryCompletionsAt(index);
                }
                // For the complete file, try to get a completion at every character.
                mockHost.override(fileName, originalContent);
                for (var index = 0, len = originalContent.length; index < len; index++) {
                    tryCompletionsAt(index);
                }
                // Delete random characters in the file until we get an empty file.
                var content = originalContent;
                while (content.length > 0) {
                    var deleteIndex = Math.floor(Math.random() * content.length);
                    content = content.slice(0, deleteIndex - 1) + content.slice(deleteIndex + 1);
                    mockHost.override(fileName, content);
                    var requestIndex = Math.floor(Math.random() * content.length);
                    tryCompletionsAt(requestIndex);
                }
                // Build up the string from zero asking for a completion after every char
                buildUp(originalContent, function (text, position) {
                    mockHost.override(fileName, text);
                    tryCompletionsAt(position);
                });
            }
            finally {
                mockHost.override(fileName, undefined);
            }
        }).not.toThrow();
    });
    describe('with regression tests', function () {
        it('should not crash with an incomplete component', function () {
            expect(function () {
                var code = "\n@Component({\n  template: '~{inside-template}'\n})\nexport class MyComponent {\n\n}";
                addCode(code, function (fileName) { contains(fileName, 'inside-template', 'h1'); });
            }).not.toThrow();
        });
        it('should hot crash with an incomplete class', function () {
            expect(function () {
                addCode('\nexport class', function (fileName) { ngHost.updateAnalyzedModules(); });
            }).not.toThrow();
        });
    });
    it('should respect paths configuration', function () {
        mockHost.overrideOptions(function (options) {
            options.baseUrl = '/app';
            options.paths = { 'bar/*': ['foo/bar/*'] };
            return options;
        });
        mockHost.addScript('/app/foo/bar/shared.ts', "\n      export interface Node {\n        children: Node[];\n      }\n    ");
        mockHost.addScript('/app/my.component.ts', "\n      import { Component } from '@angular/core';\n      import { Node } from 'bar/shared';\n\n      @Component({\n        selector: 'my-component',\n        template: '{{tree.~{tree} }}'\n      })\n      export class MyComponent {\n        tree: Node;\n      }\n    ");
        ngHost.updateAnalyzedModules();
        contains('/app/my.component.ts', 'tree', 'children');
    });
    function addCode(code, cb) {
        var fileName = '/app/app.component.ts';
        var originalContent = mockHost.getFileContent(fileName);
        var newContent = originalContent + code;
        mockHost.override(fileName, originalContent + code);
        ngHost.updateAnalyzedModules();
        try {
            cb(fileName, newContent);
        }
        finally {
            mockHost.override(fileName, undefined);
        }
    }
    function contains(fileName, locationMarker) {
        var names = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            names[_i - 2] = arguments[_i];
        }
        var location = mockHost.getMarkerLocations(fileName)[locationMarker];
        if (location == null) {
            throw new Error("No marker " + locationMarker + " found.");
        }
        expectEntries.apply(void 0, [locationMarker, ngService.getCompletionsAt(fileName, location)].concat(names));
    }
});
function expectEntries(locationMarker, completions) {
    var names = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        names[_i - 2] = arguments[_i];
    }
    var entries = {};
    if (!completions) {
        throw new Error("Expected result from " + locationMarker + " to include " + names.join(', ') + " but no result provided");
    }
    if (!completions.length) {
        throw new Error("Expected result from " + locationMarker + " to include " + names.join(', ') + " an empty result provided");
    }
    else {
        for (var _a = 0, completions_1 = completions; _a < completions_1.length; _a++) {
            var entry = completions_1[_a];
            entries[entry.name] = true;
        }
        var missing = names.filter(function (name) { return !entries[name]; });
        if (missing.length) {
            throw new Error("Expected result from " + locationMarker + " to include at least one of the following, " + missing.join(', ') + ", in the list of entries " + completions.map(function (entry) { return entry.name; }).join(', '));
        }
    }
}
function buildUp(originalText, cb) {
    var count = originalText.length;
    var inString = (new Array(count)).fill(false);
    var unused = (new Array(count)).fill(1).map(function (v, i) { return i; });
    function getText() {
        return new Array(count)
            .fill(1)
            .map(function (v, i) { return i; })
            .filter(function (i) { return inString[i]; })
            .map(function (i) { return originalText[i]; })
            .join('');
    }
    function randomUnusedIndex() { return Math.floor(Math.random() * unused.length); }
    var _loop_1 = function () {
        var unusedIndex = randomUnusedIndex();
        var index = unused[unusedIndex];
        if (index == null)
            throw new Error('Internal test buildup error');
        if (inString[index])
            throw new Error('Internal test buildup error');
        inString[index] = true;
        unused.splice(unusedIndex, 1);
        var text = getText();
        var position = inString.filter(function (_, i) { return i <= index; }).map(function (v) { return v ? 1 : 0; }).reduce(function (p, v) { return p + v; }, 0);
        cb(text, position);
    };
    while (unused.length > 0) {
        _loop_1();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxldGlvbnNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xhbmd1YWdlLXNlcnZpY2UvdGVzdC9jb21wbGV0aW9uc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsNEJBQTBCO0FBQzFCLCtCQUFpQztBQUVqQyw0REFBOEQ7QUFFOUQsMERBQTZEO0FBRTdELHlDQUFnQztBQUNoQywyQ0FBZ0Q7QUFFaEQsUUFBUSxDQUFDLGFBQWEsRUFBRTtJQUN0QixJQUFJLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBQ25ELElBQUksUUFBUSxHQUFHLElBQUksK0JBQWtCLENBQUMsQ0FBQyxjQUFjLEVBQUUsdUJBQXVCLENBQUMsRUFBRSxlQUFHLENBQUMsQ0FBQztJQUN0RixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMscUJBQXFCLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDbkUsSUFBSSxNQUFNLEdBQUcsSUFBSSx1Q0FBcUIsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDMUQsSUFBSSxTQUFTLEdBQUcsd0NBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUUxQixFQUFFLENBQUMsMENBQTBDLEVBQzFDLGNBQVEsUUFBUSxDQUFDLGNBQWMsRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV6RixFQUFFLENBQUMsd0NBQXdDLEVBQUU7UUFDM0MsSUFBSSxRQUFRLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMzQyxJQUFJLFNBQVMsR0FBRyxDQUFDLE9BQU8sRUFB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