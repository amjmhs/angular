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
describe('viewChildren example', function () {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    var button;
    var result;
    beforeEach(function () {
        protractor_1.browser.get('/core/di/ts/viewChildren/index.html');
        button = protractor_1.element(protractor_1.by.css('button'));
        result = protractor_1.element(protractor_1.by.css('div'));
    });
    it('should query view children', function () {
        expect(result.getText()).toEqual('panes: 1, 2');
        button.click();
        expect(result.getText()).toEqual('panes: 1, 2, 3');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19jaGlsZHJlbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29yZS9kaS90cy92aWV3Q2hpbGRyZW4vZTJlX3Rlc3Qvdmlld19jaGlsZHJlbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gseUNBQStEO0FBQy9ELDREQUFzRTtBQUV0RSxRQUFRLENBQUMsc0JBQXNCLEVBQUU7SUFDL0IsU0FBUyxDQUFDLGdDQUFxQixDQUFDLENBQUM7SUFDakMsSUFBSSxNQUFxQixDQUFDO0lBQzFCLElBQUksTUFBcUIsQ0FBQztJQUUxQixVQUFVLENBQUM7UUFDVCxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sR0FBRyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNuQyxNQUFNLEdBQUcsb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNEJBQTRCLEVBQUU7UUFDL0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVoRCxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFZixNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDckQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9