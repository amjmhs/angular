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
const e2e_util_1 = require("../../../../../_common/e2e_util");
const e2e_util_2 = require("./e2e_util");
function loadPage() {
    protractor_1.browser.rootEl = 'example-app';
    protractor_1.browser.get('/upgrade/static/ts/lite/');
}
describe('upgrade/static (lite)', () => {
    let showHideBtn;
    let ng2Heroes;
    let ng2HeroesHeader;
    let ng2HeroesExtra;
    let ng2HeroesAddBtn;
    let ng1Heroes;
    const expectHeroes = (isShown, ng1HeroCount = 3, statusMessage = 'Ready') => {
        // Verify the show/hide button text.
        expect(showHideBtn.getText()).toBe(isShown ? 'Hide heroes' : 'Show heroes');
        // Verify the `<ng2-heroes>` component.
        expect(ng2Heroes.isPresent()).toBe(isShown);
        if (isShown) {
            expect(ng2HeroesHeader.getText()).toBe('Heroes');
            expect(ng2HeroesExtra.getText()).toBe(`Status: ${statusMessage}`);
        }
        // Verify the `<ng1-hero>` components.
        expect(ng1Heroes.count()).toBe(isShown ? ng1HeroCount : 0);
        if (isShown) {
            ng1Heroes.each(ng1Hero => expect(ng1Hero).toBeAHero());
        }
    };
    beforeEach(() => {
        showHideBtn = protractor_1.element(protractor_1.by.binding('toggleBtnText'));
        ng2Heroes = protractor_1.element(protractor_1.by.css('.ng2-heroes'));
        ng2HeroesHeader = ng2Heroes.element(protractor_1.by.css('h1'));
        ng2HeroesExtra = ng2Heroes.element(protractor_1.by.css('.extra'));
        ng2HeroesAddBtn = ng2Heroes.element(protractor_1.by.buttonText('Add Hero'));
        ng1Heroes = protractor_1.element.all(protractor_1.by.css('.ng1-hero'));
    });
    beforeEach(e2e_util_2.addCustomMatchers);
    beforeEach(loadPage);
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    it('should initially not render the heroes', () => expectHeroes(false));
    it('should toggle the heroes when clicking the "show/hide" button', () => {
        showHideBtn.click();
        expectHeroes(true);
        showHideBtn.click();
        expectHeroes(false);
    });
    it('should add a new hero when clicking the "add" button', () => {
        showHideBtn.click();
        ng2HeroesAddBtn.click();
        expectHeroes(true, 4, 'Added hero Kamala Khan');
        expect(ng1Heroes.last()).toHaveName('Kamala Khan');
    });
    it('should remove a hero when clicking its "remove" button', () => {
        showHideBtn.click();
        const firstHero = ng1Heroes.first();
        expect(firstHero).toHaveName('Superman');
        const removeBtn = firstHero.element(protractor_1.by.buttonText('Remove'));
        removeBtn.click();
        expectHeroes(true, 2, 'Removed hero Superman');
        expect(ng1Heroes.first()).not.toHaveName('Superman');
    });
});
//# sourceMappingURL=static_lite_spec.js.map