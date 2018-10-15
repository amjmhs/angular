"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_options_1 = require("./common_options");
var metric_1 = require("./metric");
var multi_metric_1 = require("./metric/multi_metric");
var perflog_metric_1 = require("./metric/perflog_metric");
var user_metric_1 = require("./metric/user_metric");
var reporter_1 = require("./reporter");
var console_reporter_1 = require("./reporter/console_reporter");
var multi_reporter_1 = require("./reporter/multi_reporter");
var sample_description_1 = require("./sample_description");
var sampler_1 = require("./sampler");
var validator_1 = require("./validator");
var regression_slope_validator_1 = require("./validator/regression_slope_validator");
var size_validator_1 = require("./validator/size_validator");
var web_driver_adapter_1 = require("./web_driver_adapter");
var web_driver_extension_1 = require("./web_driver_extension");
var chrome_driver_extension_1 = require("./webdriver/chrome_driver_extension");
var firefox_driver_extension_1 = require("./webdriver/firefox_driver_extension");
var ios_driver_extension_1 = require("./webdriver/ios_driver_extension");
/**
 * The Runner is the main entry point for executing a sample run.
 * It provides defaults, creates the injector and calls the sampler.
 */
var Runner = /** @class */ (function () {
    function Runner(_defaultProviders) {
        if (_defaultProviders === void 0) { _defaultProviders = []; }
        this._defaultProviders = _defaultProviders;
    }
    Runner.prototype.sample = function (_a) {
        var id = _a.id, execute = _a.execute, prepare = _a.prepare, microMetrics = _a.microMetrics, providers = _a.providers, userMetrics = _a.userMetrics;
        var sampleProviders = [
            _DEFAULT_PROVIDERS, this._defaultProviders, { provide: common_options_1.Options.SAMPLE_ID, useValue: id },
            { provide: common_options_1.Options.EXECUTE, useValue: execute }
        ];
        if (prepare != null) {
            sampleProviders.push({ provide: common_options_1.Options.PREPARE, useValue: prepare });
        }
        if (microMetrics != null) {
            sampleProviders.push({ provide: common_options_1.Options.MICRO_METRICS, useValue: microMetrics });
        }
        if (userMetrics != null) {
            sampleProviders.push({ provide: common_options_1.Options.USER_METRICS, useValue: userMetrics });
        }
        if (providers != null) {
            sampleProviders.push(providers);
        }
        var inj = core_1.Injector.create(sampleProviders);
        var adapter = inj.get(web_driver_adapter_1.WebDriverAdapter);
        return Promise
            .all([adapter.capabilities(), adapter.executeScript('return window.navigator.userAgent;')])
            .then(function (args) {
            var capabilities = args[0];
            var userAgent = args[1];
            // This might still create instances twice. We are creating a new injector with all the
            // providers.
            // Only WebDriverAdapter is reused.
            // TODO(vsavkin): consider changing it when toAsyncFactory is added back or when child
            // injectors are handled better.
            var injector = core_1.Injector.create([
                sampleProviders, { provide: common_options_1.Options.CAPABILITIES, useValue: capabilities },
                { provide: common_options_1.Options.USER_AGENT, useValue: userAgent },
                { provide: web_driver_adapter_1.WebDriverAdapter, useValue: adapter }
            ]);
            // TODO: With TypeScript 2.5 injector.get does not infer correctly the
            // return type. Remove 'any' and investigate the issue.
            var sampler = injector.get(sampler_1.Sampler);
            return sampler.sample();
        });
    };
    return Runner;
}());
exports.Runner = Runner;
var _DEFAULT_PROVIDERS = [
    common_options_1.Options.DEFAULT_PROVIDERS,
    sampler_1.Sampler.PROVIDERS,
    console_reporter_1.ConsoleReporter.PROVIDERS,
    regression_slope_validator_1.RegressionSlopeValidator.PROVIDERS,
    size_validator_1.SizeValidator.PROVIDERS,
    chrome_driver_extension_1.ChromeDriverExtension.PROVIDERS,
    firefox_driver_extension_1.FirefoxDriverExtension.PROVIDERS,
    ios_driver_extension_1.IOsDriverExtension.PROVIDERS,
    perflog_metric_1.PerflogMetric.PROVIDERS,
    user_metric_1.UserMetric.PROVIDERS,
    sample_description_1.SampleDescription.PROVIDERS,
    multi_reporter_1.MultiReporter.provideWith([console_reporter_1.ConsoleReporter]),
    multi_metric_1.MultiMetric.provideWith([perflog_metric_1.PerflogMetric, user_metric_1.UserMetric]),
    { provide: reporter_1.Reporter, useExisting: multi_reporter_1.MultiReporter },
    { provide: validator_1.Validator, useExisting: regression_slope_validator_1.RegressionSlopeValidator },
    web_driver_extension_1.WebDriverExtension.provideFirstSupported([chrome_driver_extension_1.ChromeDriverExtension, firefox_driver_extension_1.FirefoxDriverExtension, ios_driver_extension_1.IOsDriverExtension]),
    { provide: metric_1.Metric, useExisting: multi_metric_1.MultiMetric },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVubmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYmVuY2hwcmVzcy9zcmMvcnVubmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQXVEO0FBRXZELG1EQUF5QztBQUN6QyxtQ0FBZ0M7QUFDaEMsc0RBQWtEO0FBQ2xELDBEQUFzRDtBQUN0RCxvREFBZ0Q7QUFDaEQsdUNBQW9DO0FBQ3BDLGdFQUE0RDtBQUM1RCw0REFBd0Q7QUFDeEQsMkRBQXVEO0FBQ3ZELHFDQUErQztBQUMvQyx5Q0FBc0M7QUFDdEMscUZBQWdGO0FBQ2hGLDZEQUF5RDtBQUN6RCwyREFBc0Q7QUFDdEQsK0RBQTBEO0FBQzFELCtFQUEwRTtBQUMxRSxpRkFBNEU7QUFDNUUseUVBQW9FO0FBSXBFOzs7R0FHRztBQUNIO0lBQ0UsZ0JBQW9CLGlCQUF3QztRQUF4QyxrQ0FBQSxFQUFBLHNCQUF3QztRQUF4QyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQXVCO0lBQUcsQ0FBQztJQUVoRSx1QkFBTSxHQUFOLFVBQU8sRUFPTjtZQVBPLFVBQUUsRUFBRSxvQkFBTyxFQUFFLG9CQUFPLEVBQUUsOEJBQVksRUFBRSx3QkFBUyxFQUFFLDRCQUFXO1FBUWhFLElBQU0sZUFBZSxHQUFxQjtZQUN4QyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFBQyxPQUFPLEVBQUUsd0JBQU8sQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBQztZQUN0RixFQUFDLE9BQU8sRUFBRSx3QkFBTyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDO1NBQzlDLENBQUM7UUFDRixJQUFJLE9BQU8sSUFBSSxJQUFJLEVBQUU7WUFDbkIsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSx3QkFBTyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUMs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