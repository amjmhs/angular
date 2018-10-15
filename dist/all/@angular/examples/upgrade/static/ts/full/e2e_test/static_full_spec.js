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
var e2e_util_1 = require("../../../../../_common/e2e_util");
function loadPage() {
    protractor_1.browser.rootEl = 'example-app';
    protractor_1.browser.get('/upgrade/static/ts/full/');
}
describe('upgrade/static (full)', function () {
    beforeEach(loadPage);
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    it('should render the `ng2-heroes` component', function () {
        expect(protractor_1.element(protractor_1.by.css('h1')).getText()).toEqual('Heroes');
        expect(protractor_1.element.all(protractor_1.by.css('p')).get(0).getText()).toEqual('There are 3 heroes.');
    });
    it('should render 3 ng1-hero components', function () {
        var heroComponents = protractor_1.element.all(protractor_1.by.css('ng1-hero'));
        expect(heroComponents.count()).toEqual(3);
    });
    it('should add a new hero when the "Add Hero" button is pressed', function () {
        var addHeroButton = protractor_1.element.all(protractor_1.by.css('button')).last();
        expect(addHeroButton.getText()).toEqual('Add Hero');
        addHeroButton.click();
        var heroComponents = protractor_1.element.all(protractor_1.by.css('ng1-hero'));
        expect(heroComponents.last().element(protractor_1.by.css('h2')).getText()).toEqual('Kamala Khan');
    });
    it('should remove a hero when the "Remove" button is pressed', function () {
        var firstHero = protractor_1.element.all(protractor_1.by.css('ng1-hero')).get(0);
        expect(firstHero.element(protractor_1.by.css('h2')).getText()).toEqual('Superman');
        var removeHeroButton = firstHero.element(protractor_1.by.css('button'));
        expect(removeHeroButton.getText()).toEqual('Remove');
        removeHeroButton.click();
        var heroComponents = protractor_1.element.all(protractor_1.by.css('ng1-hero'));
        expect(heroComponents.count()).toEqual(2);
        firstHero = protractor_1.element.all(protractor_1.by.css('ng1-hero')).get(0);
        expect(firstHero.element(protractor_1.by.css('h2')).getText()).toEqual('Wonder Woman');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljX2Z1bGxfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL3VwZ3JhZGUvc3RhdGljL3RzL2Z1bGwvZTJlX3Rlc3Qvc3RhdGljX2Z1bGxfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHlDQUFnRDtBQUNoRCw0REFBc0U7QUFFdEU7SUFDRSxvQkFBTyxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUM7SUFDL0Isb0JBQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBRUQsUUFBUSxDQUFDLHVCQUF1QixFQUFFO0lBQ2hDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNyQixTQUFTLENBQUMsZ0NBQXFCLENBQUMsQ0FBQztJQUVqQyxFQUFFLENBQUMsMENBQTBDLEVBQUU7UUFDN0MsTUFBTSxDQUFDLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFELE1BQU0sQ0FBQyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFDbkYsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQUU7UUFDeEMsSUFBTSxjQUFjLEdBQUcsb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNkRBQTZELEVBQUU7UUFDaEUsSUFBTSxhQUFhLEdBQUcsb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNELE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDcEQsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3RCLElBQU0sY0FBYyxHQUFHLG9CQUFPLENBQUMsR0FBRyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUN2RCxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdkYsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMERBQTBELEVBQUU7UUFDN0QsSUFBSSxTQUFTLEdBQUcsb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2RCxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFdEUsSUFBTSxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUM3RCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckQsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFekIsSUFBTSxjQUFjLEdBQUcsb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFMUMsU0FBUyxHQUFHLG9CQUFPLENBQUMsR0FBRyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzVFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==