"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-console  */
var fs_1 = require("fs");
var tsc_watch_1 = require("./tsc_watch");
__export(require("./tsc_watch"));
require("reflect-metadata");
function md(dir, folders) {
    if (folders.length) {
        var next = folders.shift();
        var path = dir + '/' + next;
        if (!fs_1.existsSync(path)) {
            fs_1.mkdirSync(path);
        }
        md(path, folders);
    }
}
var tscWatch = null;
var platform = process.argv.length >= 3 ? process.argv[2] : null;
var runMode = process.argv.length >= 4 ? process.argv[3] : null;
var debugMode = process.argv.some(function (arg) { return arg === '--debug'; });
var BaseConfig = {
    start: 'File change detected. Starting incremental compilation...',
    // This regex uses a negative lookbehind group (?<! 0 ), which causes it to not match a string
    // containing " 0 error" but to match anything else containing "error". It requires the --harmony
    // flag to run under node versions < 9.
    error: /(?<! 0 )error/,
    complete: 'Found 0 errors. Watching for file changes.',
};
if (platform == 'node') {
    var specFiles = ['@angular/**/*_spec.js'];
    tscWatch = new tsc_watch_1.TscWatch(Object.assign({
        tsconfig: 'packages/tsconfig.json',
        onChangeCmds: [createNodeTestCommand(specFiles, debugMode)]
    }, BaseConfig));
}
else if (platform == 'browser') {
    tscWatch = new tsc_watch_1.TscWatch(Object.assign({
        tsconfig: 'packages/tsconfig.json',
        onStartCmds: [
            [
                'node', 'node_modules/karma/bin/karma', 'start', '--no-auto-watch', '--port=9876',
                'karma-js.conf.js'
            ],
            [
                'node', 'node_modules/karma/bin/karma', 'start', '--no-auto-watch', '--port=9877',
                'packages/router/karma.conf.js'
            ],
        ],
        onChangeCmds: [
            ['node', 'node_modules/karma/bin/karma', 'run', 'karma-js.conf.js', '--port=9876'],
            ['node', 'node_modules/karma/bin/karma', 'run', '--port=9877'],
        ]
    }, BaseConfig));
}
else if (platform == 'router') {
    tscWatch = new tsc_watch_1.TscWatch(Object.assign({
        tsconfig: 'packages/tsconfig.json',
        onStartCmds: [
            [
                'node', 'node_modules/karma/bin/karma', 'start', '--no-auto-watch', '--port=9877',
                'packages/router/karma.conf.js'
            ],
        ],
        onChangeCmds: [
            ['node', 'node_modules/karma/bin/karma', 'run', '--port=9877'],
        ]
    }, BaseConfig));
}
else if (platform == 'browserNoRouter') {
    tscWatch = new tsc_watch_1.TscWatch(Object.assign({
        tsconfig: 'packages/tsconfig.json',
        onStartCmds: [[
                'node', 'node_modules/karma/bin/karma', 'start', '--no-auto-watch', '--port=9876',
                'karma-js.conf.js'
            ]],
        onChangeCmds: [
            ['node', 'node_modules/karma/bin/karma', 'run', 'karma-js.conf.js', '--port=9876'],
        ]
    }, BaseConfig));
}
else {
    throw new Error("unknown platform: " + platform);
}
if (runMode === 'watch') {
    tscWatch.watch();
}
else if (runMode === 'runCmdsOnly') {
    tscWatch.runCmdsOnly();
}
else {
    tscWatch.run();
}
function createNodeTestCommand(specFiles, debugMode) {
    return ['node']
        .concat(debugMode ? ['--inspect'] : [])
        .concat('dist/tools/cjs-jasmine', '--')
        .concat(specFiles);
}
//# sourceMappingURL=index.js.map