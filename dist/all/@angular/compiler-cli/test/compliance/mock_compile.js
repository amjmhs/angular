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
var util_1 = require("@angular/compiler/src/util");
var test_util_1 = require("@angular/compiler/test/aot/test_util");
var ts = require("typescript");
var program_1 = require("../../src/ngtsc/program");
var IDENTIFIER = /[A-Za-z_$ɵ][A-Za-z0-9_$]*/;
var OPERATOR = /!|%|\*|\/|\^|&&?|\|\|?|\(|\)|\{|\}|\[|\]|:|;|<=?|>=?|={1,3}|!==?|=>|\+\+?|--?|@|,|\.|\.\.\./;
var STRING = /'[^']*'|"[^"]*"|`[\s\S]*?`/;
var NUMBER = /\d+/;
var ELLIPSIS = '…';
var TOKEN = new RegExp("\\s*((" + IDENTIFIER.source + ")|(" + OPERATOR.source + ")|(" + STRING.source + ")|" + NUMBER.source + "|" + ELLIPSIS + ")", 'y');
var SKIP = /(?:.|\n|\r)*/;
var ERROR_CONTEXT_WIDTH = 30;
// Transform the expected output to set of tokens
function tokenize(text) {
    TOKEN.lastIndex = 0;
    var match;
    var pieces = [];
    while ((match = TOKEN.exec(text)) !== null) {
        var token = match[1];
        if (token === 'IDENT') {
            pieces.push(IDENTIFIER);
        }
        else if (token === ELLIPSIS) {
            pieces.push(SKIP);
        }
        else {
            pieces.push(token);
        }
    }
    if (pieces.length === 0 || TOKEN.lastIndex !== 0) {
        var from = TOKEN.lastIndex;
        var to = from + ERROR_CONTEXT_WIDTH;
        throw Error("Invalid test, no token found for '" + text.substr(from, to) + "...'");
    }
    return pieces;
}
function expectEmit(source, expected, description, assertIdentifiers) {
    // turns `// ...` into `…`
    // remove `// TODO` comment lines
    expected = expected.replace(/\/\/\s*\.\.\./g, ELLIPSIS).replace(/\/\/\s*TODO.*?\n/g, '');
    var pieces = tokenize(expected);
    var _a = buildMatcher(pieces), regexp = _a.regexp, groups = _a.groups;
    var matches = source.match(regexp);
    if (matches === null) {
        var last = 0;
        for (var i = 1; i < pieces.length; i++) {
            var regexp_1 = buildMatcher(pieces.slice(0, i)).regexp;
            var m = source.match(regexp_1);
            var expectedPiece = pieces[i - 1] == IDENTIFIER ? '<IDENT>' : pieces[i - 1];
            if (!m) {
                fail(description + ": Expected to find " + expectedPiece + " '" + source.substr(0, last) + "[<---HERE expected \"" + expectedPiece + "\"]" + source.substr(last) + "'");
                return;
            }
            else {
                last = (m.index || 0) + m[0].length;
            }
        }
        fail("Test helper failure: Expected expression failed but the reporting logic could not find where it failed in: " + source);
    }
    else {
        if (assertIdentifiers) {
            // It might be possible to add the constraints in the original regexp (see `buildMatcher`)
            // by transforming the assertion regexps when using anchoring, grouping, back references,
            // flags, ...
            //
            // Checking identifiers after they have matched allows for a simple and flexible
            // implementation.
            // The overall performance are not impacted when `assertIdentifiers` is empty.
            var ids = Object.keys(assertIdentifiers);
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                if (groups.has(id)) {
                    var name_1 = matches[groups.get(id)];
                    var regexp_2 = assertIdentifiers[id];
                    if (!regexp_2.test(name_1)) {
                        throw Error(description + ": The matching identifier \"" + id + "\" is \"" + name_1 + "\" which doesn't match " + regexp_2);
                    }
                }
            }
        }
    }
}
exports.expectEmit = expectEmit;
var IDENT_LIKE = /^[a-z][A-Z]/;
var MATCHING_IDENT = /^\$.*\$$/;
/*
 * Builds a regexp that matches the given `pieces`
 *
 * It returns:
 * - the `regexp` to be used to match the generated code,
 * - the `groups` which maps `$...$` identifier to their position in the regexp matches.
 */
function buildMatcher(pieces) {
    var results = [];
    var first = true;
    var group = 0;
    var groups = new Map();
    for (var _i = 0, pieces_1 = pieces; _i < pieces_1.length; _i++) {
        var piece = pieces_1[_i];
        if (!first)
            results.push("\\s" + (typeof piece === 'string' && IDENT_LIKE.test(piece) ? '+' : '*'));
        first = false;
        if (typeof piece === 'string') {
            if (MATCHING_IDENT.test(piece)) {
                var matchGroup = groups.get(piece);
                if (!matchGroup) {
                    results.push('(' + IDENTIFIER.source + ')');
                    var newGroup = ++group;
                    groups.set(piece, newGroup);
                }
                else {
                    results.push("\\" + matchGroup);
                }
            }
            else {
                results.push(util_1.escapeRegExp(piece));
            }
        }
        else {
            results.push('(?:' + piece.source + ')');
        }
    }
    return {
        regexp: new RegExp(results.join('')),
        groups: groups,
    };
}
function compile(data, angularFiles, options, errorCollector) {
    if (options === void 0) { options = {}; }
    if (errorCollector === void 0) { errorCollector = function (error) { throw error; }; }
    var testFiles = test_util_1.toMockFileArray(data);
    var scripts = testFiles.map(function (entry) { return entry.fileName; });
    var angularFilesArray = test_util_1.toMockFileArray(angularFiles);
    var files = test_util_1.arrayToMockDir(testFiles.concat(angularFilesArray));
    var mockCompilerHost = new test_util_1.MockCompilerHost(scripts, files);
    var program = new program_1.NgtscProgram(scripts, __assign({ target: ts.ScriptTarget.ES2015, module: ts.ModuleKind.ES2015, moduleResolution: ts.ModuleResolutionKind.NodeJs }, options), mockCompilerHost);
    program.emit();
    var source = scripts.map(function (script) { return mockCompilerHost.readFile(script.replace(/\.ts$/, '.js')); }).join('\n');
    return { source: source };
}
exports.compile = compile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9ja19jb21waWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3Rlc3QvY29tcGxpYW5jZS9tb2NrX2NvbXBpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7OztBQUdILG1EQUF3RDtBQUN4RCxrRUFBMEk7QUFDMUksK0JBQWlDO0FBRWpDLG1EQUFxRDtBQUdyRCxJQUFNLFVBQVUsR0FBRywyQkFBMkIsQ0FBQztBQUMvQyxJQUFNLFFBQVEsR0FDViw2RkFBNkYsQ0FBQztBQUNsRyxJQUFNLE1BQU0sR0FBRyw0QkFBNEIsQ0FBQztBQUM1QyxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFFckIsSUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDO0FBQ3JCLElBQU0sS0FBSyxHQUFHLElBQUksTUFBTSxDQUNwQixXQUFTLFVBQVUsQ0FBQyxNQUFNLFdBQU0sUUFBUSxDQUFDLE1BQU0sV0FBTSxNQUFNLENBQUMsTUFBTSxVQUFLLE1BQU0sQ0FBQyxNQUFNLFNBQUksUUFBUSxNQUFHLEVBQ25HLEdBQUcsQ0FBQyxDQUFDO0FBSVQsSUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDO0FBRTVCLElBQU0sbUJBQW1CLEdBQUcsRUFBRSxDQUFDO0FBQy9CLGlEQUFpRDtBQUNqRCxrQkFBa0IsSUFBWTtJQUM1QixLQUFLLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUVwQixJQUFJLEtBQTRCLENBQUM7SUFDakMsSUFBTSxNQUFNLEdBQVksRUFBRSxDQUFDO0lBRTNCLE9BQU8sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUMxQyxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsSUFBSSxLQUFLLEtBQUssT0FBTyxFQUFFO1lBQ3JCLE1BQU0s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