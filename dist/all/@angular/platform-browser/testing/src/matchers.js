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
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var _global = (typeof window === 'undefined' ? core_1.ɵglobal : window);
/**
 * Jasmine matching function with Angular matchers mixed in.
 *
 * ## Example
 *
 * {@example testing/ts/matchers.ts region='toHaveText'}
 */
exports.expect = _global.expect;
// Some Map polyfills don't polyfill Map.toString correctly, which
// gives us bad error messages in tests.
// The only way to do this in Jasmine is to monkey patch a method
// to the object :-(
Map.prototype['jasmineToString'] = function () {
    var m = this;
    if (!m) {
        return '' + m;
    }
    var res = [];
    m.forEach(function (v, k) { res.push(String(k) + ":" + String(v)); });
    return "{ " + res.join(',') + " }";
};
_global.beforeEach(function () {
    // Custom handler for Map as we use Jasmine 2.4, and support for maps is not
    // added until Jasmine 2.6.
    jasmine.addCustomEqualityTester(function compareMap(actual, expected) {
        if (actual instanceof Map) {
            var pass_1 = actual.size === expected.size;
            if (pass_1) {
                actual.forEach(function (v, k) {
                    pass_1 = pass_1 && jasmine.matchersUtil.equals(v, expected.get(k));
                });
            }
            return pass_1;
        }
        else {
            // TODO(misko): we should change the return, but jasmine.d.ts is not null safe
            return undefined;
        }
    });
    jasmine.addMatchers({
        toBePromise: function () {
            return {
                compare: function (actual) {
                    var pass = typeof actual === 'object' && typeof actual.then === 'function';
                    return { pass: pass, get message() { return 'Expected ' + actual + ' to be a promise'; } };
                }
            };
        },
        toBeAnInstanceOf: function () {
            return {
                compare: function (actual, expectedClass) {
                    var pass = typeof actual === 'object' && actual instanceof expectedClass;
                    return {
                        pass: pass,
                        get message() {
                            return 'Expected ' + actual + ' to be an instance of ' + expectedClass;
                        }
                    };
                }
            };
        },
        toHaveText: function () {
            return {
                compare: function (actual, expectedText) {
                    var actualText = elementText(actual);
                    return {
                        pass: actualText == expectedText,
                        get message() { return 'Expected ' + actualText + ' to be equal to ' + expectedText; }
                    };
                }
            };
        },
        toHaveCssClass: function () {
            return { compare: buildError(false), negativeCompare: buildError(true) };
            function buildError(isNot) {
                return function (actual, className) {
                    return {
                        pass: platform_browser_1.ɵgetDOM().hasClass(actual, className) == !isNot,
                        get message() {
                            return "Expected " + actual.outerHTML + " " + (isNot ? 'not ' : '') + "to contain the CSS class \"" + className + "\"";
                        }
                    };
                };
            }
        },
        toHaveCssStyle: function () {
            return {
                compare: function (actual, styles) {
                    var allPassed;
                    if (typeof styles === 'string') {
                        allPassed = platform_browser_1.ɵgetDOM().hasStyle(actual, styles);
                    }
                    else {
                        allPassed = Object.keys(styles).length !== 0;
                        Object.keys(styles).forEach(function (prop) {
                            allPassed = allPassed && platform_browser_1.ɵgetDOM().hasStyle(actual, prop, styles[prop]);
                        });
                    }
                    return {
                        pass: allPassed,
                        get message() {
                            var expectedValueStr = typeof styles === 'string' ? styles : JSON.stringify(styles);
                            return "Expected " + actual.outerHTML + " " + (!allPassed ? ' ' : 'not ') + "to contain the\n                      CSS " + (typeof styles === 'string' ? 'property' : 'styles') + " \"" + expectedValueStr + "\"";
                        }
                    };
                }
            };
        },
        toContainError: function () {
            return {
                compare: function (actual, expectedText) {
                    var errorMessage = actual.toString();
                    return {
                        pass: errorMessage.indexOf(expectedText) > -1,
                        get message() { return 'Expected ' + errorMessage + ' to contain ' + expectedText; }
                    };
                }
            };
        },
        toImplement: function () {
            return {
                compare: function (actualObject, expectedInterface) {
                    var intProps = Object.keys(expectedInterface.prototype);
                    var missedMethods = [];
                    intProps.forEach(function (k) {
                        if (!actualObject.constructor.prototype[k])
                            missedMethods.push(k);
                    });
                    return {
                        pass: missedMethods.length == 0,
                        get message() {
                            return 'Expected ' + actualObject + ' to have the following methods: ' +
                                missedMethods.join(', ');
                        }
                    };
                }
            };
        },
        toContainComponent: function () {
            return {
                compare: function (actualFixture, expectedComponentType) {
                    var failOutput = arguments[2];
                    var msgFn = function (msg) { return [msg, failOutput].filter(Boolean).join(', '); };
                    // verify correct actual type
                    if (!(actualFixture instanceof testing_1.ComponentFixture)) {
                        return {
                            pass: false,
                            message: msgFn("Expected actual to be of type 'ComponentFixture' [actual=" + actualFixture.constructor.name + "]")
                        };
                    }
                    var found = !!actualFixture.debugElement.query(platform_browser_1.By.directive(expectedComponentType));
                    return found ?
                        { pass: true } :
                        { pass: false, message: msgFn("Expected " + expectedComponentType.name + " to show") };
                }
            };
        }
    });
});
function elementText(n) {
    var hasNodes = function (n) {
        var children = platform_browser_1.ɵgetDOM().childNodes(n);
        return children && children.length > 0;
    };
    if (n instanceof Array) {
        return n.map(elementText).join('');
    }
    if (platform_browser_1.ɵgetDOM().isCommentNode(n)) {
        return '';
    }
    if (platform_browser_1.ɵgetDOM().isElementNode(n) && platform_browser_1.ɵgetDOM().tagName(n) == 'CONTENT') {
        return elementText(Array.prototype.slice.apply(platform_browser_1.ɵgetDOM().getDistributedNodes(n)));
    }
    if (platform_browser_1.ɵgetDOM().hasShadowRoot(n)) {
        return elementText(platform_browser_1.ɵgetDOM().childNodesAsList(platform_browser_1.ɵgetDOM().getShadowRoot(n)));
    }
    if (hasNodes(n)) {
        return elementText(platform_browser_1.ɵgetDOM().childNodesAsList(n));
    }
    return platform_browser_1.ɵgetDOM().getText(n);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2hlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3Rlc3Rpbmcvc3JjL21hdGNoZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsc0NBQXNEO0FBQ3RELGlEQUF1RDtBQUN2RCw4REFBZ0U7QUF5RmhFLElBQU0sT0FBTyxHQUFRLENBQUMsT0FBTyxNQUFNLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxjQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRXZFOzs7Ozs7R0FNRztBQUNVLFFBQUEsTUFBTSxHQUEwQyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBRzVFLGtFQUFrRTtBQUNsRSx3Q0FBd0M7QUFDeEMsaUVBQWlFO0FBQ2pFLG9CQUFvQjtBQUNuQixHQUFXLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEdBQUc7SUFDMUMsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ2YsSUFBSSxDQUFDLENBQUMsRUFBRTtRQUNOLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztLQUNmO0lBQ0QsSUFBTSxHQUFHLEdBQVUsRUFBRSxDQUFDO0lBQ3RCLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFNLEVBQUUsQ0FBTSxJQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUUsT0FBTyxPQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQUksQ0FBQztBQUNoQyxDQUFDLENBQUM7QUFFRixPQUFPLENBQUMsVUFBVSxDQUFDO0lBQ2pCLDRFQUE0RTtJQUM1RSwyQkFBMkI7SUFDM0IsT0FBTyxDQUFDLHVCQUF1QixDQUFDLG9CQUFvQixNQUFXLEVBQUUsUUFBYTtR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