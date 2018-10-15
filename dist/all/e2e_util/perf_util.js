"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var e2e_util_1 = require("./e2e_util");
exports.verifyNoBrowserErrors = e2e_util_1.verifyNoBrowserErrors;
var nodeUuid = require('node-uuid');
var fs = require("fs-extra");
var benchpress_1 = require("@angular/benchpress");
var e2e_util_2 = require("./e2e_util");
var cmdArgs;
var runner;
function readCommandLine() {
    cmdArgs = e2e_util_2.readCommandLine({
        'sample-size': { describe: 'Used for perf: sample size.', default: 20 },
        'force-gc': { describe: 'Used for perf: force gc.', default: false, type: 'boolean' },
        'dryrun': { describe: 'If true, only run performance benchmarks once.', default: false },
        'bundles': { describe: 'Whether to use the angular bundles or not.', default: false }
    });
    runner = createBenchpressRunner();
}
exports.readCommandLine = readCommandLine;
function runBenchmark(config) {
    e2e_util_2.openBrowser(config);
    if (config.setup) {
        config.setup();
    }
    var description = { 'bundles': cmdArgs.bundles };
    config.params.forEach(function (param) { description[param.name] = param.value; });
    return runner.sample({
        id: config.id,
        execute: config.work,
        prepare: config.prepare,
        microMetrics: config.microMetrics,
        providers: [{ provide: benchpress_1.Options.SAMPLE_DESCRIPTION, useValue: description }]
    });
}
exports.runBenchmark = runBenchmark;
function createBenchpressRunner() {
    var runId = nodeUuid.v1();
    if (process.env.GIT_SHA) {
        runId = process.env.GIT_SHA + ' ' + runId;
    }
    var resultsFolder = './dist/benchmark_results';
    fs.ensureDirSync(resultsFolder);
    var providers = [
        benchpress_1.SeleniumWebDriverAdapter.PROTRACTOR_PROVIDERS,
        { provide: benchpress_1.Options.FORCE_GC, useValue: cmdArgs['force-gc'] },
        { provide: benchpress_1.Options.DEFAULT_DESCRIPTION, useValue: { 'runId': runId } }, benchpress_1.JsonFileReporter.PROVIDERS,
        { provide: benchpress_1.JsonFileReporter.PATH, useValue: resultsFolder }
    ];
    if (!cmdArgs['dryrun']) {
        providers.push({ provide: benchpress_1.Validator, useExisting: benchpress_1.RegressionSlopeValidator });
        providers.push({ provide: benchpress_1.RegressionSlopeValidator.SAMPLE_SIZE, useValue: cmdArgs['sample-size'] });
        providers.push(benchpress_1.MultiReporter.provideWith([benchpress_1.ConsoleReporter, benchpress_1.JsonFileReporter]));
    }
    else {
        providers.push({ provide: benchpress_1.Validator, useExisting: benchpress_1.SizeValidator });
        providers.push({ provide: benchpress_1.SizeValidator.SAMPLE_SIZE, useValue: 1 });
        providers.push(benchpress_1.MultiReporter.provideWith([]));
        providers.push(benchpress_1.MultiMetric.provideWith([]));
    }
    return new benchpress_1.Runner(providers);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyZl91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbW9kdWxlcy9lMmVfdXRpbC9wZXJmX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCx1Q0FBaUQ7QUFBekMsMkNBQUEscUJBQXFCLENBQUE7QUFFN0IsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3RDLDZCQUErQjtBQUUvQixrREFBaU47QUFDak4sdUNBQThFO0FBRTlFLElBQUksT0FBNEYsQ0FBQztBQUNqRyxJQUFJLE1BQWMsQ0FBQztBQUVuQjtJQUNFLE9BQU8sR0FBUSwwQkFBa0IsQ0FBQztRQUNoQyxhQUFhLEVBQUUsRUFBQyxRQUFRLEVBQUUsNkJBQTZCLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBQztRQUNyRSxVQUFVLEVBQUUsRUFBQyxRQUFRLEVBQUUsMEJBQTBCLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO1FBQ25GLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxnREFBZ0QsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDO1FBQ3RGLFNBQVMsRUFBRSxFQUFDLFFBQVEsRUFBRSw0Q0FBNEMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDO0tBQ3BGLENBQUMsQ0FBQztJQUNILE1BQU0sR0FBRyxzQkFBc0IsRUFBRSxDQUFDO0FBQ3BDLENBQUM7QUFSRCwwQ0FRQztBQUVELHNCQUE2QixNQVM1QjtJQUNDLHNCQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEIsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ2hCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNoQjtJQUNELElBQU0sV0FBVyxHQUF5QixFQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFDLENBQUM7SUFDdkUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFB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