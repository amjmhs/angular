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
var symbol_extractor_1 = require("./symbol_extractor");
if (require.main === module) {
    var args = process.argv.slice(2);
    process.exitCode = main(args) ? 0 : 1;
}
/**
 * CLI main method.
 *
 * ```
 *   cli javascriptFilePath.js goldenFilePath.json
 * ```
 */
function main(argv) {
    var javascriptFilePath = require.resolve(argv[0]);
    var goldenFilePath = require.resolve(argv[1]);
    var doUpdate = argv[2] == '--accept';
    var javascriptContent = fs.readFileSync(javascriptFilePath).toString();
    var goldenContent = fs.readFileSync(goldenFilePath).toString();
    var symbolExtractor = new symbol_extractor_1.SymbolExtractor(javascriptFilePath, javascriptContent);
    var passed = false;
    if (doUpdate) {
        fs.writeFileSync(goldenFilePath, JSON.stringify(symbolExtractor.actual, undefined, 2));
        console.error('Updated gold file:', goldenFilePath);
        passed = true;
    }
    else {
        passed = symbolExtractor.compareAndPrintError(goldenFilePath, goldenContent);
        if (!passed) {
            var compile = process.env['compile'];
            var defineFlag = (compile !== 'legacy') ? "--define=compile=" + compile + " " : '';
            console.error("TEST FAILED!");
            console.error("  To update the golden file run: ");
            console.error("    bazel run " + defineFlag + process.env['BAZEL_TARGET'] + ".accept");
        }
    }
    return passed;
}
//# sourceMappingURL=cli.js.map