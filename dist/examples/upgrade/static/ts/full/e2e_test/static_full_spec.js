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
function loadPage() {
    protractor_1.browser.rootEl = 'example-app';
    protractor_1.browser.get('/upgrade/static/ts/full/');
}
describe('upgrade/static (full)', () => {
    beforeEach(loadPage);
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    it('should render the `ng2-heroes` component', () => {
        expect(protractor_1.element(protractor_1.by.css('h1')).getText()).toEqual('Heroes');
        expect(protractor_1.element.all(protractor_1.by.css('p')).get(0).getText()).toEqual('There are 3 heroes.');
    });
    it('should render 3 ng1-hero components', () => {
        const heroComponents = protractor_1.element.all(protractor_1.by.css('ng1-hero'));
        expect(heroComponents.count()).toEqual(3);
    });
    it('should add a new hero when the "Add Hero" button is pressed', () => {
        const addHeroButton = protractor_1.element.all(protractor_1.by.css('button')).last();
        expect(addHeroButton.getText()).toEqual('Add Hero');
        addHeroButton.click();
        const heroComponents = protractor_1.element.all(protractor_1.by.css('ng1-hero'));
        expect(heroComponents.last().element(protractor_1.by.css('h2')).getText()).toEqual('Kamala Khan');
    });
    it('should remove a hero when the "Remove" button is pressed', () => {
        let firstHero = protractor_1.element.all(protractor_1.by.css('ng1-hero')).get(0);
        expect(firstHero.element(protractor_1.by.css('h2')).getText()).toEqual('Superman');
        const removeHeroButton = firstHero.element(protractor_1.by.css('button'));
        expect(removeHeroButton.getText()).toEqual('Remove');
        removeHeroButton.click();
        const heroComponents = protractor_1.element.all(protractor_1.by.css('ng1-hero'));
        expect(heroComponents.count()).toEqual(2);
        firstHero = protractor_1.element.all(protractor_1.by.css('ng1-hero')).get(0);
        expect(firstHero.element(protractor_1.by.css('h2')).getText()).toEqual('Wonder Woman');
    });
});
//# sourceMappingURL=static_full_spec.js.map