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
describe('contentChildren example', function () {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    var button;
    var resultTopLevel;
    var resultNested;
    beforeEach(function () {
        protractor_1.browser.get('/core/di/ts/contentChildren/index.html');
        button = protractor_1.element(protractor_1.by.css('button'));
        resultTopLevel = protractor_1.element(protractor_1.by.css('.top-level'));
        resultNested = protractor_1.element(protractor_1.by.css('.nested'));
    });
    it('should query content children', function () {
        expect(resultTopLevel.getText()).toEqual('Top level panes: 1, 2');
        button.click();
        expect(resultTopLevel.getText()).toEqual('Top level panes: 1, 2, 3');
    });
    it('should query nested content children', function () {
        expect(resultNested.getText()).toEqual('Arbitrary nested panes: 1, 2');
        button.click();
        expect(resultNested.getText()).toEqual('Arbitrary nested panes: 1, 2, 3, 3_1, 3_2');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudF9jaGlsZHJlbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29yZS9kaS90cy9jb250ZW50Q2hpbGRyZW4vZTJlX3Rlc3QvY29udGVudF9jaGlsZHJlbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgseUNBQStEO0FBQy9ELDREQUFzRTtBQUV0RSxRQUFRLENBQUMseUJBQXlCLEVBQUU7SUFDbEMsU0FBUyxDQUFDLGdDQUFxQixDQUFDLENBQUM7SUFDakMsSUFBSSxNQUFxQixDQUFDO0lBQzFCLElBQUksY0FBNkIsQ0FBQztJQUNsQyxJQUFJLFlBQTJCLENBQUM7SUFFaEMsVUFBVSxDQUFDO1FBQ1Qsb0JBQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLENBQUMsQ0FBQztRQUN0RCxNQUFNLEdBQUcsb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDbkMsY0FBYyxHQUFHLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQy9DLFlBQVksR0FBRyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywrQkFBK0IsRUFBRTtRQUNsQyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFFbEUsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRWYsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0lBQ3ZFLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHNDQUFzQyxFQUFFO1FBQ3pDLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUV2RSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFZixNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7SUFDdEYsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9