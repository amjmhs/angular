/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var glob = require('glob');
require('zone.js/dist/zone-node.js');
var JasmineRunner = require('jasmine');
var path = require('path');
require('zone.js/dist/long-stack-trace-zone.js');
require('zone.js/dist/task-tracking.js');
require('zone.js/dist/proxy.js');
require('zone.js/dist/sync-test.js');
require('zone.js/dist/async-test.js');
require('zone.js/dist/fake-async-test.js');
var generateSeed = require('../../../tools/jasmine-seed-generator').generateSeed;
var jrunner = new JasmineRunner({ projectBaseDir: path.resolve(__dirname, '../../') });
global['jasmine'] = jrunner.jasmine;
require('zone.js/dist/jasmine-patch.js');
// Turn on full stack traces in errors to help debugging
Error['stackTraceLimit'] = Infinity;
// Config the test runner
jrunner.jasmine.DEFAULT_TIMEOUT_INTERVAL = 100;
jrunner.loadConfig({
    random: true,
    spec_dir: '',
});
jrunner.seed(generateSeed('cjs-jasmine/index-tools'));
jrunner.configureDefaultReporter({ showColors: process.argv.indexOf('--no-color') === -1 });
jrunner.onComplete(function (passed) { return process.exit(passed ? 0 : 1); });
// Support passing multiple globs
var rootDir = process.cwd();
var globsIndex = process.argv.indexOf('--');
var globs = (globsIndex === -1) ? [process.argv[2]] : process.argv.slice(globsIndex + 1);
var specFiles = globs.map(function (globstr) { return glob.sync(globstr, { cwd: rootDir }); })
    .reduce(function (allPaths, paths) { return allPaths.concat(paths); }, []);
// Load helpers and spec files
var rootDirRequire = function (relativePath) { return require(path.join(rootDir, relativePath)); };
specFiles.forEach(rootDirRequire);
// Run the tests
jrunner.execute();
//# sourceMappingURL=index-tools.js.map