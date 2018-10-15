"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var index_1 = require("../index");
{
    testing_internal_1.describe('runner', function () {
        var injector;
        var runner;
        function createRunner(defaultProviders) {
            if (!defaultProviders) {
                defaultProviders = [];
            }
            runner = new index_1.Runner([
                defaultProviders, {
                    provide: index_1.Sampler,
                    useFactory: function (_injector) {
                        injector = _injector;
                        return new MockSampler();
                    },
                    deps: [index_1.Injector]
                },
                { provide: index_1.Metric, useFactory: function () { return new MockMetric(); }, deps: [] },
                { provide: index_1.Validator, useFactory: function () { return new MockValidator(); }, deps: [] },
                { provide: index_1.WebDriverAdapter, useFactory: function () { return new MockWebDriverAdapter(); }, deps: [] }
            ]);
            return runner;
        }
        testing_internal_1.it('should set SampleDescription.id', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createRunner()
                .sample({ id: 'someId' })
                .then(function (_) { return injector.get(index_1.SampleDescription); })
                .then(function (desc) {
                testing_internal_1.expect(desc.id).toBe('someId');
                async.done();
            });
        }));
        testing_internal_1.it('should merge SampleDescription.description', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createRunner([{ provide: index_1.Options.DEFAULT_DESCRIPTION, useValue: { 'a': 1 } }])
                .sample({
                id: 'someId',
                providers: [{ provide: index_1.Options.SAMPLE_DESCRIPTION, useValue: { 'b': 2 } }]
            })
                .then(function (_) { return injector.get(index_1.SampleDescription); })
                .then(function (desc) {
                testing_internal_1.expect(desc.description)
                    .toEqual({ 'forceGc': false, 'userAgent': 'someUserAgent', 'a': 1, 'b': 2, 'v': 11 });
                async.done();
            });
        }));
        testing_internal_1.it('should fill SampleDescription.metrics from the Metric', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createRunner()
                .sample({ id: 'someId' })
                .then(function (_) { return injector.get(index_1.SampleDescription); })
                .then(function (desc) {
                testing_internal_1.expect(desc.metrics).toEqual({ 'm1': 'some metric' });
                async.done();
            });
        }));
        testing_internal_1.it('should provide Options.EXECUTE', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var execute = function () { };
            createRunner().sample({ id: 'someId', execute: execute }).then(function (_) {
                testing_internal_1.expect(injector.get(index_1.Options.EXECUTE)).toEqual(execute);
                async.done();
            });
        }));
        testing_internal_1.it('should provide Options.PREPARE', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var prepare = function () { };
            createRunner().sample({ id: 'someId', prepare: prepare }).then(function (_) {
                testing_internal_1.expect(injector.get(index_1.Options.PREPARE)).toEqual(prepare);
                async.done();
            });
        }));
        testing_internal_1.it('should provide Options.MICRO_METRICS', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createRunner().sample({ id: 'someId', microMetrics: { 'a': 'b' } }).then(function (_) {
                testing_internal_1.expect(injector.get(index_1.Options.MICRO_METRICS)).toEqual({ 'a': 'b' });
                async.done();
            });
        }));
        testing_internal_1.it('should overwrite providers per sample call', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createRunner([{ provide: index_1.Options.DEFAULT_DESCRIPTION, useValue: { 'a': 1 } }])
                .sample({
                id: 'someId',
                providers: [{ provide: index_1.Options.DEFAULT_DESCRIPTION, useValue: { 'a': 2 } }]
            })
                .then(function (_) { return injector.get(index_1.SampleDescription); })
                .then(function (desc) {
                testing_internal_1.expect(desc.description['a']).toBe(2);
                async.done();
            });
        }));
    });
}
var MockWebDriverAdapter = /** @class */ (function (_super) {
    __extends(MockWebDriverAdapter, _super);
    function MockWebDriverAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MockWebDriverAdapter.prototype.executeScript = function (script) { return Promise.resolve('someUserAgent'); };
    MockWebDriverAdapter.prototype.capabilities = function () { return null; };
    return MockWebDriverAdapter;
}(index_1.WebDriverAdapter));
var MockValidator = /** @class */ (function (_super) {
    __extends(MockValidator, _super);
    function MockValidator() {
        return _super.call(this) || this;
    }
    MockValidator.prototype.describe = function () { return { 'v': 11 }; };
    return MockValidator;
}(index_1.Validator));
var MockMetric = /** @class */ (function (_super) {
    __extends(MockMetric, _super);
    function MockMetric() {
        return _super.call(this) || this;
    }
    MockMetric.prototype.describe = function () { return { 'm1': 'some metric' }; };
    return MockMetric;
}(index_1.Metric));
var MockSampler = /** @class */ (function (_super) {
    __extends(MockSampler, _super);
    function MockSampler() {
        return _super.call(this, null, null, null, null, null, null, null) || this;
    }
    MockSampler.prototype.sample = function () { return Promise.resolve(new index_1.SampleState([], [])); };
    return MockSampler;
}(index_1.Sampler));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVubmVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3Rlc3QvcnVubmVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBRUgsK0VBQTRHO0FBRTVHLGtDQUFpSTtBQUVqSTtJQUNFLDJCQUFRLENBQUMsUUFBUSxFQUFFO1FBQ2pCLElBQUksUUFBa0IsQ0FBQztRQUN2QixJQUFJLE1BQWMsQ0FBQztRQUVuQixzQkFBc0IsZ0JBQXdCO1lBQzVDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDckIsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO2FBQ3ZCO1lBQ0QsTUFBTSxHQUFHLElBQUksY0FBTSxDQUFDO2dCQUNsQixnQkFBZ0IsRUFBRTtvQkFDaEIsT0FBTyxFQUFFLGVBQU87b0JBQ2hCLFVBQVUsRUFBRSxVQUFDLFNBQW1CO3dCQUM5QixRQUFRLEdBQUcsU0FBUyxDQUFDO3dCQUNyQixPQUFPLElBQUksV0FBVyxFQUFFLENBQUM7b0JBQzNCLENBQUM7b0JBQ0QsSUFBSSxFQUFFLENBQUMsZ0JBQVEsQ0FBQztpQkFDakI7Z0JBQ0QsRUFBQyxPQUFPLEVBQUUsY0FBTSxFQUFFLFVBQVUsRUFBRSxjQUFNLE9BQUEsSUFBSSxVQUFVLEVBQUUsRUFBaEIsQ0FBZ0IsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDO2dCQUMvRCxFQUFDLE9BQU8sRUFBRSxpQkFBUyxFQUFFLFVBQVUsRUFBRSxjQUFNLE9BQUEsSUFBSSxhQUFhLEVBQUUsRUFBbkIsQ0FBbUIsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDO2dCQUNyRSxFQUFDLE9BQU8sRUFBRSx3QkFBZ0IsRUFBRSxVQUFVLEVBQUUsY0FBTSxPQUFBLElBQUksb0JBQW9CLEVBQUUsRUFBMUIsQ0FBMEIsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDO2FBQ3BGLENBQUMsQ0FBQztZQUNI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