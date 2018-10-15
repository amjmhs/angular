"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var angular1_1 = require("@angular/upgrade/src/common/angular1");
var ng1Versions = [
    {
        label: '1.5',
        files: ['angular-1.5/angular.js', 'angular-mocks-1.5/angular-mocks.js'],
    },
    {
        label: '1.6',
        files: ['angular-1.6/angular.js', 'angular-mocks-1.6/angular-mocks.js'],
    },
    {
        label: '1.7',
        files: ['angular/angular.js', 'angular-mocks/angular-mocks.js'],
    },
];
function createWithEachNg1VersionFn(setNg1) {
    return function (specSuite) { return ng1Versions.forEach(function (_a) {
        var label = _a.label, files = _a.files;
        describe("[AngularJS v" + label + "]", function () {
            // Problem:
            // As soon as `angular-mocks.js` is loaded, it runs `beforeEach` and `afterEach` to register
            // setup/tear down callbacks. Jasmine 2.9+ does not allow `beforeEach`/`afterEach` to be
            // nested inside a `beforeAll` call (only inside `describe`).
            // Hacky work-around:
            // Patch the affected jasmine methods while loading `angular-mocks.js` (inside `beforeAll`) to
            // capture the registered callbacks. Also, inside the `describe` call register a callback with
            // each affected method that runs all captured callbacks.
            // (Note: Currently, async callbacks are not supported, but that should be OK, since
            // `angular-mocks.js` does not use them.)
            var methodsToPatch = ['beforeAll', 'beforeEach', 'afterEach', 'afterAll'];
            var methodCallbacks = methodsToPatch.reduce(function (aggr, method) {
                var _a;
                return (__assign({}, aggr, (_a = {}, _a[method] = [], _a)));
            }, {});
            var win = window;
            function patchJasmineMethods() {
                var originalMethods = {};
                methodsToPatch.forEach(function (method) {
                    originalMethods[method] = win[method];
                    win[method] = function (cb) { return methodCallbacks[method].push(cb); };
                });
                return function () { return methodsToPatch.forEach(function (method) { return win[method] = originalMethods[method]; }); };
            }
            beforeAll(function (done) {
                var restoreJasmineMethods = patchJasmineMethods();
                var onSuccess = function () {
                    restoreJasmineMethods();
                    done();
                };
                var onError = function (err) {
                    restoreJasmineMethods();
                    done.fail(err);
                };
                // Load AngularJS before running tests.
                files
                    .reduce(function (prev, file) { return prev.then(function () { return new Promise(function (resolve, reject) {
                    var script = document.createElement('script');
                    script.async = true;
                    script.onerror = reject;
                    script.onload = function () {
                        document.body.removeChild(script);
                        resolve();
                    };
                    script.src = "base/angular_deps/node_modules/" + file;
                    document.body.appendChild(script);
                }); }); }, Promise.resolve())
                    .then(function () { return setNg1(win.angular); })
                    .then(onSuccess, onError);
                // When Saucelabs is flaky, some browsers (esp. mobile) take some time to load and execute
                // the AngularJS scripts. Specifying a higher timeout here, reduces flaky-ness.
            }, 60000);
            afterAll(function () {
                // `win.angular` will not be defined if loading the script in `berofeAll()` failed. In that
                // case, avoid causing another error in `afterAll()`, because the reporter only shows the
                // most recent error (thus hiding the original, possibly more informative, error message).
                if (win.angular) {
                    // In these tests we are loading different versions of AngularJS on the same window.
                    // AngularJS leaves an "expandoId" property on `document`, which can trick subsequent
                    // `window.angular` instances into believing an app is already bootstrapped.
                    win.angular.element.cleanData([document]);
                }
                // Remove AngularJS to leave a clean state for subsequent tests.
                setNg1(undefined);
                delete win.angular;
            });
            methodsToPatch.forEach(function (method) { return win[method](function () {
                var _this = this;
                // Run the captured callbacks. (Async callbacks not supported.)
                methodCallbacks[method].forEach(function (cb) { return cb.call(_this); });
            }); });
            specSuite();
        });
    }); };
}
exports.createWithEachNg1VersionFn = createWithEachNg1VersionFn;
function html(html) {
    // Don't return `body` itself, because using it as a `$rootElement` for ng1
    // will attach `$injector` to it and that will affect subsequent tests.
    var body = document.body;
    body.innerHTML = "<div>" + html.trim() + "</div>";
    var div = document.body.firstChild;
    if (div.childNodes.length === 1 && div.firstChild instanceof HTMLElement) {
        return div.firstChild;
    }
    return div;
}
exports.html = html;
function multiTrim(text, allSpace) {
    if (allSpace === void 0) { allSpace = false; }
    if (typeof text == 'string') {
        var repl = allSpace ? '' : ' ';
        return text.replace(/\n/g, '').replace(/\s+/g, repl).trim();
    }
    throw new Error('Argument can not be undefined.');
}
exports.multiTrim = multiTrim;
function nodes(html) {
    var div = document.createElement('div');
    div.innerHTML = html.trim();
    return Array.prototype.slice.call(div.childNodes);
}
exports.nodes = nodes;
exports.withEachNg1Version = createWithEachNg1VersionFn(angular1_1.setAngularJSGlobal);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9oZWxwZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvdXBncmFkZS90ZXN0L2NvbW1vbi90ZXN0X2hlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7R0FNRztBQUNILGlFQUF3RTtBQUd4RSxJQUFNLFdBQVcsR0FBRztJQUNsQjtRQUNFLEtBQUssRUFBRSxLQUFLO1FBQ1osS0FBSyxFQUFFLENBQUMsd0JBQXdCLEVBQUUsb0NBQW9DLENBQUM7S0FDeEU7SUFDRDtRQUNFLEtBQUssRUFBRSxLQUFLO1FBQ1osS0FBSyxFQUFFLENBQUMsd0JBQXdCLEVBQUUsb0NBQW9DLENBQUM7S0FDeEU7SUFDRDtRQUNFLEtBQUssRUFBRSxLQUFLO1FBQ1osS0FBSyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsZ0NBQWdDLENBQUM7S0FDaEU7Q0FDRixDQUFDO0FBRUYsb0NBQTJDLE1BQWlDO0lBQzFFLE9BQU8sVUFBQyxTQUFxQixJQUFLLE9BQUEsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEVBQWM7WUFBYixnQkFBSyxFQUFFLGdCQUFLO1FBQ2xFLFFBQVEsQ0FBQyxpQkFBZSxLQUFLLE1BQUcsRUFBRTtZQUNoQyxXQUFXO1lBQ1gsNEZBQTRGO1lBQzVGLHdGQUF3RjtZQUN4Riw2REFBNkQ7WUFDN0QscUJBQXFCO1lBQ3JCLDhGQUE4RjtZQUM5Riw4RkFBOEY7WUFDOUYseURBQXlEO1lBQ3pELG9GQUFvRjtZQUNwRix5Q0FBeUM7WUFDekMsSUFBTSxjQUFjLEdBQUcsQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUM1RSxJQUFNLGVBQWUsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUN6QyxVQUFDLElBQUksRUFBRSxNQUFNOztnQkFBSyxPQUFBLGNBQUssSUFBSSxlQUFHLE1BQU0sSUFBRyxFQUFFLE9BQUU7WUFBekIs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