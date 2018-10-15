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
describe('WebWorkers Kitchen Sink', function () {
    afterEach(function () {
        e2e_util_1.verifyNoBrowserErrors();
        protractor_1.browser.ignoreSynchronization = false;
    });
    var selector = 'hello-app .greeting';
    var URL = 'all/playground/src/web_workers/kitchen_sink/index.html';
    it('should greet', function () {
        // This test can't wait for Angular as Testability is not available when using WebWorker
        protractor_1.browser.ignoreSynchronization = true;
        protractor_1.browser.get(URL);
        protractor_1.browser.wait(protractor_1.protractor.until.elementLocated(protractor_1.by.css(selector)), 15000);
        var elem = protractor_1.element(protractor_1.by.css(selector));
        protractor_1.browser.wait(protractor_1.ExpectedConditions.textToBePresentInElement(elem, 'hello world!'), 5000);
        expect(elem.getText()).toEqual('hello world!');
    });
    it('should change greeting', function () {
        // This test can't wait for Angular as Testability is not available when using WebWorker
        protractor_1.browser.ignoreSynchronization = true;
        protractor_1.browser.get(URL);
        var changeButtonSelector = 'hello-app .changeButton';
        protractor_1.browser.wait(protractor_1.protractor.until.elementLocated(protractor_1.by.css(changeButtonSelector)), 15000);
        protractor_1.element(protractor_1.by.css(changeButtonSelector)).click();
        var elem = protractor_1.element(protractor_1.by.css(selector));
        protractor_1.browser.wait(protractor_1.ExpectedConditions.textToBePresentInElement(elem, 'howdy world!'), 5000);
        expect(elem.getText()).toEqual('howdy world!');
    });
    it('should display correct key names', function () {
        // This test can't wait for Angular as Testability is not available when using WebWorker
        protractor_1.browser.ignoreSynchronization = true;
        protractor_1.browser.get(URL);
        protractor_1.browser.wait(protractor_1.protractor.until.elementLocated(protractor_1.by.css('.sample-area')), 15000);
        var area = protractor_1.element.all(protractor_1.by.css('.sample-area')).first();
        expect(area.getText()).toEqual('(none)');
        area.sendKeys('u');
        protractor_1.browser.wait(protractor_1.ExpectedConditions.textToBePresentInElement(area, 'U'), 5000);
        expect(area.getText()).toEqual('U');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2l0Y2hlbl9zaW5rX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvZTJlX3Rlc3Qvd2ViX3dvcmtlcnMva2l0Y2hlbl9zaW5rL2tpdGNoZW5fc2lua19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQXdEO0FBQ3hELHlDQUFnRjtBQUVoRixRQUFRLENBQUMseUJBQXlCLEVBQUU7SUFDbEMsU0FBUyxDQUFDO1FBQ1IsZ0NBQXFCLEVBQUUsQ0FBQztRQUN4QixvQkFBTyxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztJQUN4QyxDQUFDLENBQUMsQ0FBQztJQUNILElBQU0sUUFBUSxHQUFHLHFCQUFxQixDQUFDO0lBQ3ZDLElBQU0sR0FBRyxHQUFHLHdEQUF3RCxDQUFDO0lBRXJFLEVBQUUsQ0FBQyxjQUFjLEVBQUU7UUFDakIsd0ZBQXdGO1FBQ3hGLG9CQUFPLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO1FBQ3JDLG9CQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWpCLG9CQUFPLENBQUMsSUFBSSxDQUFDLHVCQUFVLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkUsSUFBTSxJQUFJLEdBQUcsb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDdkMsb0JBQU8sQ0FBQyxJQUFJLENBQUMsK0JBQWtCLENBQUMsd0JBQXdCLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RGLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7SUFFakQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsd0JBQXdCLEVBQUU7UUFDM0Isd0ZBQXdGO1FBQ3hGLG9CQUFPLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO1FBQ3JDLG9CQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLElBQU0sb0JBQW9CLEdBQUcseUJBQXlCLENBQUM7UUFFdkQsb0JBQU8sQ0FBQyxJQUFJLENBQUMsdUJBQVUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25GLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUMsSUFBTSxJQUFJLEdBQUcsb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDdkMsb0JBQU8sQ0FBQyxJQUFJLENBQUMsK0JBQWtCLENBQUMsd0JBQXdCLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RGLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDakQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsa0NBQWtDLEVBQUU7UUFDckMsd0ZBQXdGO1FBQ3hGLG9CQUFPLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO1FBQ3JDLG9CQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLG9CQUFPLENBQUMsSUFBSSxDQUFDLHVCQUFVLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFN0UsSUFBTSxJQUFJLEdBQUcsb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFekMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixvQkFBTyxDQUFDLElBQUksQ0FBQywrQkFBa0IsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0UsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0QyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=