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
var symbol_extractor_1 = require("./symbol_extractor");
describe('scenarios', function () {
    var symbolExtractorSpecDir = path.dirname(require.resolve('angular/tools/symbol-extractor/symbol_extractor_spec/empty.json'));
    var scenarioFiles = fs.readdirSync(symbolExtractorSpecDir);
    var _loop_1 = function (i) {
        var jsFile = scenarioFiles[i];
        var jsonFile = scenarioFiles[i + 1];
        var testName = jsFile.substring(0, jsFile.lastIndexOf('.'));
        if (!jsFile.endsWith('.js'))
            throw new Error('Expected: .js file found: ' + jsFile);
        if (!jsonFile.endsWith('.json'))
            throw new Error('Expected: .json file found: ' + jsonFile);
        // Left here so that it is easy to debug single test.
        // if (testName !== 'hello_world_min_debug') continue;
        it(testName, function () {
            var jsFileContent = fs.readFileSync(path.join(symbolExtractorSpecDir, jsFile)).toString();
            var jsonFileContent = fs.readFileSync(path.join(symbolExtractorSpecDir, jsonFile)).toString();
            var symbols = symbol_extractor_1.SymbolExtractor.parse(testName, jsFileContent);
            var diff = symbol_extractor_1.SymbolExtractor.diff(symbols, jsonFileContent);
            expect(diff).toEqual({});
        });
    };
    for (var i = 0; i < scenarioFiles.length; i = i + 2) {
        _loop_1(i);
    }
});
//# sourceMappingURL=symbol_extractor_spec.js.map