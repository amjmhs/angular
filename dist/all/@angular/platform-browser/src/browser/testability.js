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
var dom_adapter_1 = require("../dom/dom_adapter");
var BrowserGetTestability = /** @class */ (function () {
    function BrowserGetTestability() {
    }
    BrowserGetTestability.init = function () { core_1.setTestabilityGetter(new BrowserGetTestability()); };
    BrowserGetTestability.prototype.addToWindow = function (registry) {
        core_1.ɵglobal['getAngularTestability'] = function (elem, findInAncestors) {
            if (findInAncestors === void 0) { findInAncestors = true; }
            var testability = registry.findTestabilityInTree(elem, findInAncestors);
            if (testability == null) {
                throw new Error('Could not find testability for element.');
            }
            return testability;
        };
        core_1.ɵglobal['getAllAngularTestabilities'] = function () { return registry.getAllTestabilities(); };
        core_1.ɵglobal['getAllAngularRootElements'] = function () { return registry.getAllRootElements(); };
        var whenAllStable = function (callback /** TODO #9100 */) {
            var testabilities = core_1.ɵglobal['getAllAngularTestabilities']();
            var count = testabilities.length;
            var didWork = false;
            var decrement = function (didWork_ /** TODO #9100 */) {
                didWork = didWork || didWork_;
                count--;
                if (count == 0) {
                    callback(didWork);
                }
            };
            testabilities.forEach(function (testability /** TODO #9100 */) {
                testability.whenStable(decrement);
            });
        };
        if (!core_1.ɵglobal['frameworkStabilizers']) {
            core_1.ɵglobal['frameworkStabilizers'] = [];
        }
        core_1.ɵglobal['frameworkStabilizers'].push(whenAllStable);
    };
    BrowserGetTestability.prototype.findTestabilityInTree = function (registry, elem, findInAncestors) {
        if (elem == null) {
            return null;
        }
        var t = registry.getTestability(elem);
        if (t != null) {
            return t;
        }
        else if (!findInAncestors) {
            return null;
        }
        if (dom_adapter_1.getDOM().isShadowRoot(elem)) {
            return this.findTestabilityInTree(registry, dom_adapter_1.getDOM().getHost(elem), true);
        }
        return this.findTestabilityInTree(registry, dom_adapter_1.getDOM().parentElement(elem), true);
    };
    return BrowserGetTestability;
}());
exports.BrowserGetTestability = BrowserGetTestability;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGFiaWxpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3NyYy9icm93c2VyL3Rlc3RhYmlsaXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQXdIO0FBRXhILGtEQUEwQztBQUUxQztJQUFBO0lBc0RBLENBQUM7SUFyRFEsMEJBQUksR0FBWCxjQUFnQiwyQkFBb0IsQ0FBQyxJQUFJLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFcEUsMkNBQVcsR0FBWCxVQUFZLFFBQTZCO1FBQ3ZDLGNBQU0sQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLFVBQUMsSUFBUyxFQUFFLGVBQStCO1lBQS9CLGdDQUFBLEVBQUEsc0JBQStCO1lBQzNFLElBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDMUUsSUFBSSxXQUFXLElBQUksSUFBSSxFQUFFO2dCQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7YUFDNUQ7WUFDRCxPQUFPLFdBQVcsQ0FBQztRQUNyQixDQUFDLENBQUM7UUFFRixjQUFNLENBQUMsNEJBQTRCLENBQUMsR0FBRyxjQUFNLE9BQUEsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEVBQTlCLENBQThCLENBQUM7UUFFNUUsY0FBTSxDQUFDLDJCQUEyQixDQUFDLEdBQUcsY0FBTSxPQUFBLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxFQUE3QixDQUE2QixDQUFDO1FBRTFFLElBQU0sYUFBYSxHQUFHLFVBQUMsUUFBYSxDQUFDLGlCQUFpQjtZQUNwRCxJQUFNLGFBQWEsR0FBRyxjQUFNLENBQUMsNEJBQTRCLENBQUMsRUFBRSxDQUFDO1lBQzdELElBQUksS0FBSyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUM7WUFDakMsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLElBQU0sU0FBUyxHQUFHLFVBQVMsUUFBYSxDQUFDLGlCQUFpQjtnQkFDeEQsT0FBTyxHQUFHLE9BQU8sSUFBSSxRQUFRLENBQUM7Z0JBQzlCLEtBQUssRUFBRSxDQUFDO2dCQUNSLElBQUksS0FBSyxJQUFJLENBQUMsRUFBRTtvQkFDZCxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ25CO1lBQ0gsQ0FBQyxDQUFDO1lBQ0YsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFTLFdBQWdCLENBQUMsaUJBQWlCO2dCQUMvRCxXQUFXLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3BDLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBRUYsSUFBSSxDQUFDLGNBQU0sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFO1lBQ25DLGNBQU0sQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUNyQztRQUNELGNBQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQscURBQXFCLEdBQXJCLFVBQXNCLFFBQTZCLEVBQUUsSUFBUyxFQUFFLGVBQXdCO1FBRXRGLElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtZQUNoQixPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsSUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUU7WUFDYixPQUFPLENBQUMsQ0FBQztTQUNWO2FBQU0sSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUMzQixPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsSUFBSSxvQkFBTSxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQy9CLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsRUFBRSxvQkFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzNFO1FBQ0QsT0FBTyxJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxFQUFFLG9CQUFNLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbEYsQ0FBQztJQUNILDRCQUFDO0FBQUQsQ0FBQyxBQXRERCxJQXNEQztBQXREWSxzREFBcUIifQ==