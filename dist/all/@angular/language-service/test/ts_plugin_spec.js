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
var ts_plugin_1 = require("../src/ts_plugin");
var test_data_1 = require("./test_data");
var test_utils_1 = require("./test_utils");
describe('plugin', function () {
    var documentRegistry = ts.createDocumentRegistry();
    var mockHost = new test_utils_1.MockTypescriptHost(['/app/main.ts', '/app/parsing-cases.ts'], test_data_1.toh);
    var service = ts.createLanguageService(mockHost, documentRegistry);
    var program = service.getProgram();
    var mockProject = { projectService: { logger: { info: function () { } } } };
    it('should not report errors on tour of heroes', function () {
        expectNoDiagnostics(service.getCompilerOptionsDiagnostics());
        for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
            var source = _a[_i];
            expectNoDiagnostics(service.getSyntacticDiagnostics(source.fileName));
            expectNoDiagnostics(service.getSemanticDiagnostics(source.fileName));
        }
    });
    var plugin = ts_plugin_1.create({ ts: ts, languageService: service, project: mockProject, languageServiceHost: mockHost });
    it('should not report template errors on tour of heroes', function () {
        for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
            var source = _a[_i];
            // Ignore all 'cases.ts' files as they intentionally contain errors.
            if (!source.fileName.endsWith('cases.ts')) {
                expectNoDiagnostics(plugin.getSemanticDiagnostics(source.fileName));
            }
        }
    });
    it('should be able to get entity completions', function () { contains('app/app.component.ts', 'entity-amp', '&amp;', '&gt;', '&lt;', '&iota;'); });
    it('should be able to return html elements', function () {
        var htmlTags = ['h1', 'h2', 'div', 'span'];
        var locations = ['empty', 'start-tag-h1', 'h1-content', 'start-tag', 'start-tag-after-h'];
        for (var _i = 0, locations_1 = locations; _i < locations_1.length; _i++) {
            var location_1 = locations_1[_i];
            contains.apply(void 0, ['app/app.component.ts', location_1].concat(htmlTags));
        }
    });
    it('should be able to return element directives', function () { contains('app/app.component.ts', 'empty', 'my-app'); });
    it('should be able to return h1 attributes', function () { contains('app/app.component.ts', 'h1-after-space', 'id', 'dir', 'lang', 'onclick'); });
    it('should be able to find common angular attributes', function () {
        contains('app/app.component.ts', 'div-attributes', '(click)', '[ngClass]', '*ngIf', '*ngFor');
    });
    it('should be able to return attribute names with an incompete attribute', function () { contains('app/parsing-cases.ts', 'no-value-attribute', 'id', 'dir', 'lang'); });
    it('should be able to return attributes of an incomplete element', function () {
        contains('app/parsing-cases.ts', 'incomplete-open-lt', 'a');
        contains('app/parsing-cases.ts', 'incomplete-open-a', 'a');
        contains('app/parsing-cases.ts', 'incomplete-open-attr', 'id', 'dir', 'lang');
    });
    it('should be able to return completions with a missing closing tag', function () { contains('app/parsing-cases.ts', 'missing-closing', 'h1', 'h2'); });
    it('should be able to return common attributes of an unknown tag', function () { contains('app/parsing-cases.ts', 'unknown-element', 'id', 'dir', 'lang'); });
    it('should be able to get the completions at the beginning of an interpolation', function () { contains('app/app.component.ts', 'h2-hero', 'hero', 'title'); });
    it('should not include private members of a class', function () { contains('app/app.component.ts', 'h2-hero', '-internal'); });
    it('should be able to get the completions at the end of an interpolation', function () { contains('app/app.component.ts', 'sub-end', 'hero', 'title'); });
    it('should be able to get the completions in a property', function () { contains('app/app.component.ts', 'h2-name', 'name', 'id'); });
    it('should be able to get a list of pipe values', function () {
        contains('app/parsing-cases.ts', 'before-pipe', 'lowercase', 'uppercase');
        contains('app/parsing-cases.ts', 'in-pipe', 'lowercase', 'uppercase');
        contains('app/parsing-cases.ts', 'after-pipe', 'lowercase', 'uppercase');
    });
    it('should be able to get completions in an empty interpolation', function () { contains('app/parsing-cases.ts', 'empty-interpolation', 'title', 'subTitle'); });
    describe('with attributes', function () {
        it('should be able to complete property value', function () { contains('app/parsing-cases.ts', 'property-binding-model', 'test'); });
        it('should be able to complete an event', function () { contains('app/parsing-cases.ts', 'event-binding-model', 'modelChanged'); });
        it('should be able to complete a two-way binding', function () { contains('app/parsing-cases.ts', 'two-way-binding-model', 'test'); });
    });
    describe('with a *ngFor', function () {
        it('should include a let for empty attribute', function () { contains('app/parsing-cases.ts', 'for-empty', 'let'); });
        it('should suggest NgForRow members for let initialization expression', function () {
            contains('app/parsing-cases.ts', 'for-let-i-equal', 'index', 'count', 'first', 'last', 'even', 'odd');
        });
        it('should include a let', function () { contains('app/parsing-cases.ts', 'for-let', 'let'); });
        it('should include an "of"', function () { contains('app/parsing-cases.ts', 'for-of', 'of'); });
        it('should include field reference', function () { contains('app/parsing-cases.ts', 'for-people', 'people'); });
        it('should include person in the let scope', function () { contains('app/parsing-cases.ts', 'for-interp-person', 'person'); });
        // TODO: Enable when we can infer the element type of the ngFor
        // it('should include determine person\'s type as Person', () => {
        //   contains('app/parsing-cases.ts', 'for-interp-name', 'name', 'age');
        //   contains('app/parsing-cases.ts', 'for-interp-age', 'name', 'age');
        // });
    });
    describe('for pipes', function () {
        it('should be able to resolve lowercase', function () { contains('app/expression-cases.ts', 'string-pipe', 'substring'); });
    });
    describe('with references', function () {
        it('should list references', function () { contains('app/parsing-cases.ts', 'test-comp-content', 'test1', 'test2', 'div'); });
        it('should reference the component', function () { contains('app/parsing-cases.ts', 'test-comp-after-test', 'name'); });
        // TODO: Enable when we have a flag that indicates the project targets the DOM
        // it('should reference the element if no component', () => {
        //   contains('app/parsing-cases.ts', 'test-comp-after-div', 'innerText');
        // });
    });
    describe('for semantic errors', function () {
        it('should report access to an unknown field', function () {
            expectSemanticError('app/expression-cases.ts', 'foo', 'Identifier \'foo\' is not defined. The component declaration, template variable declarations, and element references do not contain such a member');
        });
        it('should report access to an unknown sub-field', function () {
            expectSemanticError('app/expression-cases.ts', 'nam', 'Identifier \'nam\' is not defined. \'Person\' does not contain such a member');
        });
        it('should report access to a private member', function () {
            expectSemanticError('app/expression-cases.ts', 'myField', 'Identifier \'myField\' refers to a private member of the component');
        });
        it('should report numeric operator errors', function () { expectSemanticError('app/expression-cases.ts', 'mod', 'Expected a numeric type'); });
        describe('in ngFor', function () {
            function expectError(locationMarker, message) {
                expectSemanticError('app/ng-for-cases.ts', locationMarker, message);
            }
            it('should report an unknown field', function () {
                expectError('people_1', 'Identifier \'people_1\' is not defined. The component declaration, template variable declarations, and element references do not contain such a member');
            });
            it('should report an unknown context reference', function () {
                expectError('even_1', 'The template context does not defined a member called \'even_1\'');
            });
            it('should report an unknown value in a key expression', function () {
                expectError('trackBy_1', 'Identifier \'trackBy_1\' is not defined. The component declaration, template variable declarations, and element references do not contain such a member');
            });
        });
        describe('in ngIf', function () {
            function expectError(locationMarker, message) {
                expectSemanticError('app/ng-if-cases.ts', locationMarker, message);
            }
            it('should report an implicit context reference', function () {
                expectError('implicit', 'The template context does not defined a member called \'unknown\'');
            });
        });
    });
    function getMarkerLocation(fileName, locationMarker) {
        var location = mockHost.getMarkerLocations(fileName)[locationMarker];
        if (location == null) {
            throw new Error("No marker " + locationMarker + " found.");
        }
        return location;
    }
    function contains(fileName, locationMarker) {
        var names = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            names[_i - 2] = arguments[_i];
        }
        var location = getMarkerLocation(fileName, locationMarker);
        expectEntries.apply(void 0, [locationMarker, plugin.getCompletionsAtPosition(fileName, location, undefined)].concat(names));
    }
    function expectEmpty(fileName, locationMarker) {
        var location = getMarkerLocation(fileName, locationMarker);
        expect(plugin.getCompletionsAtPosition(fileName, location, undefined).entries || []).toEqual([]);
    }
    function expectSemanticError(fileName, locationMarker, message) {
        var start = getMarkerLocation(fileName, locationMarker);
        var end = getMarkerLocation(fileName, locationMarker + '-end');
        var errors = plugin.getSemanticDiagnostics(fileName);
        for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
            var error = errors_1[_i];
            if (error.messageText.toString().indexOf(message) >= 0) {
                expect(error.start).toEqual(start);
                expect(error.length).toEqual(end - start);
                return;
            }
        }
        throw new Error("Expected error messages to contain " + message + ", in messages:\n  " + errors
            .map(function (e) { return e.messageText.toString(); })
            .join(',\n  '));
    }
});
function expectEntries(locationMarker, info) {
    var names = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        names[_i - 2] = arguments[_i];
    }
    var entries = {};
    if (!info) {
        throw new Error("Expected result from " + locationMarker + " to include " + names.join(', ') + " but no result provided");
    }
    else {
        for (var _a = 0, _b = info.entries; _a < _b.length; _a++) {
            var entry = _b[_a];
            entries[entry.name] = true;
        }
        var shouldContains = names.filter(function (name) { return !name.startsWith('-'); });
        var shouldNotContain = names.filter(function (name) { return name.startsWith('-'); });
        var missing = shouldContains.filter(function (name) { return !entries[name]; });
        var present = shouldNotContain.map(function (name) { return name.substr(1); }).filter(function (name) { return entries[name]; });
        if (missing.length) {
            throw new Error("Expected result from " + locationMarker + " to include at least one of the following, " + missing
                .join(', ') + ", in the list of entries " + info.entries.map(function (entry) { return entry.name; })
                .join(', '));
        }
        if (present.length) {
            throw new Error("Unexpected member" + (present.length > 1 ? 's' :
                '') + " included in result: " + present.join(', '));
        }
    }
}
function expectNoDiagnostics(diagnostics) {
    for (var _i = 0, diagnostics_1 = diagnostics; _i < diagnostics_1.length; _i++) {
        var diagnostic = diagnostics_1[_i];
        var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        if (diagnostic.file && diagnostic.start) {
            var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
            console.error(diagnostic.file.fileName + " (" + (line + 1) + "," + (character + 1) + "): " + message);
        }
        else {
            console.error("" + message);
        }
    }
    expect(diagnostics.length).toBe(0);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNfcGx1Z2luX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sYW5ndWFnZS1zZXJ2aWNlL3Rlc3QvdHNfcGx1Z2luX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw0QkFBMEI7QUFFMUIsK0JBQWlDO0FBRWpDLDhDQUF3QztBQUV4Qyx5Q0FBZ0M7QUFDaEMsMkNBQWdEO0FBRWhELFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFDakIsSUFBSSxnQkFBZ0IsR0FBRyxFQUFFLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUNuRCxJQUFJLFFBQVEsR0FBRyxJQUFJLCtCQUFrQixDQUFDLENBQUMsY0FBYyxFQUFFLHVCQUF1QixDQUFDLEVBQUUsZUFBRyxDQUFDLENBQUM7SUFDdEYsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ25FLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUVuQyxJQUFNLFdBQVcsR0FBRyxFQUFDLGNBQWMsRUFBRSxFQUFDLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxjQUFZLENBQUMsRUFBQyxFQUFDLEVBQUMsQ0FBQztJQUV0RSxFQUFFLENBQUMsNENBQTRDLEVBQUU7UUFDL0MsbUJBQW1CLENBQUMsT0FBTyxDQUFDLDZCQUE2QixFQUFFLENBQUMsQ0FBQztRQUM3RCxLQUFtQixVQUF3QixFQUF4QixLQUFBLE9BQU8sQ0FBQyxjQUFjLEVBQUUsRUFBeEIsY0FBd0IsRUFBeEIsSUFBd0IsRUFBRTtZQUF4QyxJQUFJLE1BQU0sU0FBQTtZQUNiLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN0RSxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsTUFB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