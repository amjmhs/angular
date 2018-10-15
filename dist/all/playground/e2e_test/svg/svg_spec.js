"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var e2e_util_1 = require("e2e_util/e2e_util");
var protractor_1 = require("protractor");
describe('SVG', function () {
    var URL = 'all/playground/src/svg/index.html';
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    beforeEach(function () { protractor_1.browser.get(URL); });
    it('should display SVG component contents', function () {
        var svgText = protractor_1.element.all(protractor_1.by.css('g text')).get(0);
        expect(svgText.getText()).toEqual('Hello');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ZnX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvZTJlX3Rlc3Qvc3ZnL3N2Z19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQXdEO0FBQ3hELHlDQUFnRDtBQUVoRCxRQUFRLENBQUMsS0FBSyxFQUFFO0lBRWQsSUFBTSxHQUFHLEdBQUcsbUNBQW1DLENBQUM7SUFFaEQsU0FBUyxDQUFDLGdDQUFxQixDQUFDLENBQUM7SUFDakMsVUFBVSxDQUFDLGNBQVEsb0JBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV4QyxFQUFFLENBQUMsdUNBQXVDLEVBQUU7UUFDMUMsSUFBTSxPQUFPLEdBQUcsb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUFDO0FBRUwsQ0FBQyxDQUFDLENBQUMifQ==