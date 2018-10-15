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
var URL = 'all/playground/src/web_workers/message_broker/index.html';
describe('MessageBroker', function () {
    afterEach(function () {
        e2e_util_1.verifyNoBrowserErrors();
        protractor_1.browser.ignoreSynchronization = false;
    });
    it('should bootstrap', function () {
        // This test can't wait for Angular as Testability is not available when using WebWorker
        protractor_1.browser.ignoreSynchronization = true;
        protractor_1.browser.get(URL);
        waitForBootstrap();
        expect(protractor_1.element(protractor_1.by.css('app h1')).getText()).toEqual('WebWorker MessageBroker Test');
    });
    it('should echo messages', function () {
        var VALUE = 'Hi There';
        // This test can't wait for Angular as Testability is not available when using WebWorker
        protractor_1.browser.ignoreSynchronization = true;
        protractor_1.browser.get(URL);
        waitForBootstrap();
        var input = protractor_1.element.all(protractor_1.by.css('#echo_input')).first();
        input.sendKeys(VALUE);
        protractor_1.element(protractor_1.by.css('#send_echo')).click();
        var area = protractor_1.element(protractor_1.by.css('#echo_result'));
        protractor_1.browser.wait(protractor_1.ExpectedConditions.textToBePresentInElement(area, VALUE), 5000);
        expect(area.getText()).toEqual(VALUE);
    });
});
function waitForBootstrap() {
    protractor_1.browser.wait(protractor_1.protractor.until.elementLocated(protractor_1.by.css('app h1')), 15000);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZV9icm9rZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcGxheWdyb3VuZC9lMmVfdGVzdC93ZWJfd29ya2Vycy9tZXNzYWdlX2Jyb2tlci9tZXNzYWdlX2Jyb2tlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQXdEO0FBQ3hELHlDQUFnRjtBQUVoRixJQUFNLEdBQUcsR0FBRywwREFBMEQsQ0FBQztBQUV2RSxRQUFRLENBQUMsZUFBZSxFQUFFO0lBRXhCLFNBQVMsQ0FBQztRQUNSLGdDQUFxQixFQUFFLENBQUM7UUFDeEIsb0JBQU8sQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7SUFDeEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsa0JBQWtCLEVBQUU7UUFDckIsd0ZBQXdGO1FBQ3hGLG9CQUFPLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO1FBQ3JDLG9CQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLGdCQUFnQixFQUFFLENBQUM7UUFDbkIsTUFBTSxDQUFDLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUM7SUFDdEYsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsc0JBQXNCLEVBQUU7UUFDekIsSUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDO1FBQ3pCLHdGQUF3RjtRQUN4RixvQkFBTyxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQztRQUNyQyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixnQkFBZ0IsRUFBRSxDQUFDO1FBRW5CLElBQU0sS0FBSyxHQUFHLG9CQUFPLENBQUMsR0FBRyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN6RCxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RCLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3RDLElBQU0sSUFBSSxHQUFHLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQzdDLG9CQUFPLENBQUMsSUFBSSxDQUFDLCtCQUFrQixDQUFDLHdCQUF3QixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3RSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSDtJQUNFLG9CQUFPLENBQUMsSUFBSSxDQUFDLHVCQUFVLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDekUsQ0FBQyJ9