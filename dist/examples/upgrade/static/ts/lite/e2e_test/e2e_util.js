"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("protractor");
const isTitleCased = (text) => text.split(/\s+/).every(word => word[0] === word[0].toUpperCase());
function addCustomMatchers() {
    jasmine.addMatchers({
        toBeAHero: () => ({
            compare(actualNg1Hero) {
                const getText = (selector) => actualNg1Hero.element(protractor_1.by.css(selector)).getText();
                const result = {
                    message: 'Expected undefined to be an `ng1Hero` ElementFinder.',
                    pass: !!actualNg1Hero &&
                        Promise.all(['.title', 'h2', 'p'].map(getText))
                            .then(([actualTitle, actualName, actualDescription]) => {
                            const pass = (actualTitle === 'Super Hero') && isTitleCased(actualName) &&
                                (actualDescription.length > 0);
                            const actualHero = `Hero(${actualTitle}, ${actualName}, ${actualDescription})`;
                            result.message =
                                `Expected ${actualHero}'${pass ? ' not' : ''} to be a real hero.`;
                            return pass;
                        })
                };
                return result;
            }
        }),
        toHaveName: () => ({
            compare(actualNg1Hero, expectedName) {
                const result = {
                    message: 'Expected undefined to be an `ng1Hero` ElementFinder.',
                    pass: !!actualNg1Hero && actualNg1Hero.element(protractor_1.by.css('h2')).getText().then(actualName => {
                        const pass = actualName === expectedName;
                        result.message =
                            `Expected Hero(${actualName})${pass ? ' not' : ''} to have name '${expectedName}'.`;
                        return pass;
                    })
                };
                return result;
            }
        }),
    });
}
exports.addCustomMatchers = addCustomMatchers;
//# sourceMappingURL=e2e_util.js.map