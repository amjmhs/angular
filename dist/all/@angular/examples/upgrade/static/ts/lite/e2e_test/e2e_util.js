"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var isTitleCased = function (text) {
    return text.split(/\s+/).every(function (word) { return word[0] === word[0].toUpperCase(); });
};
function addCustomMatchers() {
    jasmine.addMatchers({
        toBeAHero: function () { return ({
            compare: function (actualNg1Hero) {
                var getText = function (selector) {
                    return actualNg1Hero.element(protractor_1.by.css(selector)).getText();
                };
                var result = {
                    message: 'Expected undefined to be an `ng1Hero` ElementFinder.',
                    pass: !!actualNg1Hero &&
                        Promise.all(['.title', 'h2', 'p'].map(getText))
                            .then(function (_a) {
                            var actualTitle = _a[0], actualName = _a[1], actualDescription = _a[2];
                            var pass = (actualTitle === 'Super Hero') && isTitleCased(actualName) &&
                                (actualDescription.length > 0);
                            var actualHero = "Hero(" + actualTitle + ", " + actualName + ", " + actualDescription + ")";
                            result.message =
                                "Expected " + actualHero + "'" + (pass ? ' not' : '') + " to be a real hero.";
                            return pass;
                        })
                };
                return result;
            }
        }); },
        toHaveName: function () { return ({
            compare: function (actualNg1Hero, expectedName) {
                var result = {
                    message: 'Expected undefined to be an `ng1Hero` ElementFinder.',
                    pass: !!actualNg1Hero && actualNg1Hero.element(protractor_1.by.css('h2')).getText().then(function (actualName) {
                        var pass = actualName === expectedName;
                        result.message =
                            "Expected Hero(" + actualName + ")" + (pass ? ' not' : '') + " to have name '" + expectedName + "'.";
                        return pass;
                    })
                };
                return result;
            }
        }); },
    });
}
exports.addCustomMatchers = addCustomMatchers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZTJlX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9leGFtcGxlcy91cGdyYWRlL3N0YXRpYy90cy9saXRlL2UyZV90ZXN0L2UyZV91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgseUNBQTZDO0FBVzdDLElBQU0sWUFBWSxHQUFHLFVBQUMsSUFBWTtJQUM5QixPQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBakMsQ0FBaUMsQ0FBQztBQUFsRSxDQUFrRSxDQUFDO0FBRXZFO0lBQ0UsT0FBTyxDQUFDLFdBQVcsQ0FBQztRQUNsQixTQUFTLEVBQ0wsY0FBTSxPQUFBLENBQUM7WUFDTCxPQUFPLFlBQUMsYUFBd0M7Z0JBQzlDLElBQU0sT0FBTyxHQUFHLFVBQUMsUUFBZ0I7b0JBQzdCLE9BQUEsYUFBZSxDQUFDLE9BQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO2dCQUFuRCxDQUFtRCxDQUFDO2dCQUN4RCxJQUFNLE1BQU0sR0FBRztvQkFDYixPQUFPLEVBQUUsc0RBQXNEO29CQUMvRCxJQUFJLEVBQUUsQ0FBQyxDQUFDLGFBQWE7d0JBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQTBCLENBQUM7NkJBQ25FLElBQUksQ0FBQyxVQUFDLEVBQTRDO2dDQUEzQyxtQkFBVyxFQUFFLGtCQUFVLEVBQUUseUJBQWlCOzRCQUNoRCxJQUFNLElBQUksR0FBRyxDQUFDLFdBQVcsS0FBSyxZQUFZLENBQUMsSUFBSSxZQUFZLENBQUMsVUFBVSxDQUFDO2dDQUNuRSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQzs0QkFFbkMsSUFBTSxVQUFVLEdBQ1osVUFBUSxXQUFXLFVBQUssVUFBVSxVQUFLLGlCQUFpQixNQUFHLENBQUM7NEJBQ2hFLE1BQU0sQ0FBQyxPQUFPO2dDQUNWLGNBQVksVUFBVSxVQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLHlCQUFxQixDQUFDOzRCQUV0RSxPQUFPLElBQUksQ0FBQzt3QkFDZCxDQUFDLENBQUM7aUJBQ1gsQ0FBQztnQkFDRixPQUFPLE1BQU0sQ0FBQztZQUNoQixDQUFDO1NBQ0YsQ0FBQyxFQXRCSSxDQXNCSjtRQUNGLFVBQVUsRUFBRSxjQUFNLE9BQUEsQ0FBQztZQUNqQixPQUFPLFlBQUMsYUFBd0MsRUFBRSxZQUFvQjtnQkFDcEUsSUFBTSxNQUFNLEdBQUc7b0JBQ2IsT0FBTyxFQUFFLHNEQUFzRDtvQkFDL0QsSUFBSSxFQUFFLENBQUMsQ0FBQyxhQUFhLElBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsVUFBVTt3QkFDcEYsSUFBTSxJQUFJLEdBQUcsVUFBVSxLQUFLLFlBQVksQ0FBQzt3QkFDekMsTUFBTSxDQUFDLE9BQU87NEJBQ1YsbUJBQWlCLFVBQVUsVUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSx3QkFBa0IsWUFBWSxPQUFJLENBQUM7d0JBQ3hGLE9BQU8sSUFBSSxDQUFDO29CQUNkLENBQUMsQ0FBQztpQkFDSCxDQUFDO2dCQUNGLE9BQU8sTUFBTSxDQUFDO1lBQ2hCLENBQUM7U0FDRixDQUFDLEVBYmdCLENBYWhCO0tBQ0EsQ0FBQyxDQUFDO0FBQ1osQ0FBQztBQXpDRCw4Q0F5Q0MifQ==