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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var util_1 = require("@angular/core/src/util");
var async_test_completer_1 = require("./async_test_completer");
var test_bed_1 = require("./test_bed");
var async_test_completer_2 = require("./async_test_completer");
exports.AsyncTestCompleter = async_test_completer_2.AsyncTestCompleter;
var test_bed_2 = require("./test_bed");
exports.inject = test_bed_2.inject;
__export(require("./logger"));
__export(require("./ng_zone_mock"));
exports.proxy = function (t) { return t; };
var _global = (typeof window === 'undefined' ? util_1.global : window);
exports.afterEach = _global.afterEach;
exports.expect = _global.expect;
var jsmBeforeEach = _global.beforeEach;
var jsmDescribe = _global.describe;
var jsmDDescribe = _global.fdescribe;
var jsmXDescribe = _global.xdescribe;
var jsmIt = _global.it;
var jsmFIt = _global.fit;
var jsmXIt = _global.xit;
var runnerStack = [];
jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
var globalTimeOut = jasmine.DEFAULT_TIMEOUT_INTERVAL;
var testBed = test_bed_1.getTestBed();
/**
 * Mechanism to run `beforeEach()` functions of Angular tests.
 *
 * Note: Jasmine own `beforeEach` is used by this library to handle DI providers.
 */
var BeforeEachRunner = /** @class */ (function () {
    function BeforeEachRunner(_parent) {
        this._parent = _parent;
        this._fns = [];
    }
    BeforeEachRunner.prototype.beforeEach = function (fn) { this._fns.push(fn); };
    BeforeEachRunner.prototype.run = function () {
        if (this._parent)
            this._parent.run();
        this._fns.forEach(function (fn) { fn(); });
    };
    return BeforeEachRunner;
}());
// Reset the test providers before each test
jsmBeforeEach(function () { testBed.resetTestingModule(); });
function _describe(jsmFn) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var parentRunner = runnerStack.length === 0 ? null : runnerStack[runnerStack.length - 1];
    var runner = new BeforeEachRunner(parentRunner);
    runnerStack.push(runner);
    var suite = jsmFn.apply(void 0, args);
    runnerStack.pop();
    return suite;
}
function describe() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return _describe.apply(void 0, [jsmDescribe].concat(args));
}
exports.describe = describe;
function ddescribe() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return _describe.apply(void 0, [jsmDDescribe].concat(args));
}
exports.ddescribe = ddescribe;
function xdescribe() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return _describe.apply(void 0, [jsmXDescribe].concat(args));
}
exports.xdescribe = xdescribe;
function beforeEach(fn) {
    if (runnerStack.length > 0) {
        // Inside a describe block, beforeEach() uses a BeforeEachRunner
        runnerStack[runnerStack.length - 1].beforeEach(fn);
    }
    else {
        // Top level beforeEach() are delegated to jasmine
        jsmBeforeEach(fn);
    }
}
exports.beforeEach = beforeEach;
/**
 * Allows overriding default providers defined in test_injector.js.
 *
 * The given function must return a list of DI providers.
 *
 * Example:
 *
 *   beforeEachProviders(() => [
 *     {provide: Compiler, useClass: MockCompiler},
 *     {provide: SomeToken, useValue: myValue},
 *   ]);
 */
function beforeEachProviders(fn) {
    jsmBeforeEach(function () {
        var providers = fn();
        if (!providers)
            return;
        testBed.configureTestingModule({ providers: providers });
    });
}
exports.beforeEachProviders = beforeEachProviders;
function _it(jsmFn, testName, testFn, testTimeout) {
    if (testTimeout === void 0) { testTimeout = 0; }
    if (runnerStack.length == 0) {
        // This left here intentionally, as we should never get here, and it aids debugging.
        debugger;
        throw new Error('Empty Stack!');
    }
    var runner = runnerStack[runnerStack.length - 1];
    var timeout = Math.max(globalTimeOut, testTimeout);
    jsmFn(testName, function (done) {
        var completerProvider = {
            provide: async_test_completer_1.AsyncTestCompleter,
            useFactory: function () {
                // Mark the test as async when an AsyncTestCompleter is injected in an it()
                return new async_test_completer_1.AsyncTestCompleter();
            }
        };
        testBed.configureTestingModule({ providers: [completerProvider] });
        runner.run();
        if (testFn.length === 0) {
            var retVal = testFn();
            if (core_1.ɵisPromise(retVal)) {
                // Asynchronous test function that returns a Promise - wait for completion.
                retVal.then(done, done.fail);
            }
            else {
                // Synchronous test function - complete immediately.
                done();
            }
        }
        else {
            // Asynchronous test function that takes in 'done' parameter.
            testFn(done);
        }
    }, timeout);
}
function it(expectation, assertion, timeout) {
    return _it(jsmIt, expectation, assertion, timeout);
}
exports.it = it;
function fit(expectation, assertion, timeout) {
    return _it(jsmFIt, expectation, assertion, timeout);
}
exports.fit = fit;
function xit(expectation, assertion, timeout) {
    return _it(jsmXIt, expectation, assertion, timeout);
}
exports.xit = xit;
var SpyObject = /** @class */ (function () {
    function SpyObject(type) {
        if (type) {
            for (var prop in type.prototype) {
                var m = null;
                try {
                    m = type.prototype[prop];
                }
                catch (e) {
                    // As we are creating spys for abstract classes,
                    // these classes might have getters that throw when they are accessed.
                    // As we are only auto creating spys for methods, this
                    // should not matter.
                }
                if (typeof m === 'function') {
                    this.spy(prop);
                }
            }
        }
    }
    SpyObject.prototype.spy = function (name) {
        if (!this[name]) {
            this[name] = jasmine.createSpy(name);
        }
        return this[name];
    };
    SpyObject.prototype.prop = function (name, value) { this[name] = value; };
    SpyObject.stub = function (object, config, overrides) {
        if (object === void 0) { object = null; }
        if (config === void 0) { config = null; }
        if (overrides === void 0) { overrides = null; }
        if (!(object instanceof SpyObject)) {
            overrides = config;
            config = object;
            object = new SpyObject();
        }
        var m = __assign({}, config, overrides);
        Object.keys(m).forEach(function (key) { object.spy(key).and.returnValue(m[key]); });
        return object;
    };
    return SpyObject;
}());
exports.SpyObject = SpyObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGluZ19pbnRlcm5hbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdGluZy9zcmMvdGVzdGluZ19pbnRlcm5hbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXNEO0FBQ3RELCtDQUE4QztBQUU5QywrREFBMEQ7QUFDMUQsdUNBQThDO0FBRTlDLCtEQUEwRDtBQUFsRCxvREFBQSxrQkFBa0IsQ0FBQTtBQUMxQix1Q0FBa0M7QUFBMUIsNEJBQUEsTUFBTSxDQUFBO0FBRWQsOEJBQXlCO0FBQ3pCLG9DQUErQjtBQUVsQixRQUFBLEtBQUssR0FBbUIsVUFBQyxDQUFNLElBQUssT0FBQSxDQUFDLEVBQUQsQ0FBQyxDQUFDO0FBRW5ELElBQU0sT0FBTyxHQUFRLENBQUMsT0FBTyxNQUFNLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxhQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTFELFFBQUEsU0FBUyxHQUFhLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDeEMsUUFBQSxNQUFNLEdBQTBDLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFFNUUsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztBQUN6QyxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQ3JDLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDdkMsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztBQUN2QyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO0FBQ3pCLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFDM0IsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUUzQixJQUFNLFdBQVcsR0FBdUIsRUFBRSxDQUFDO0FBQzND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