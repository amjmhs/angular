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
// TODO(matsko): make this test work again with new view engine.
xdescribe('WebWorkers Animations', function () {
    afterEach(function () {
        e2e_util_1.verifyNoBrowserErrors();
        protractor_1.browser.ignoreSynchronization = false;
    });
    var selector = 'animation-app';
    var URL = 'all/playground/src/web_workers/animations/index.html';
    it('should bootstrap', function () {
        // This test can't wait for Angular as Testability is not available when using WebWorker
        protractor_1.browser.ignoreSynchronization = true;
        protractor_1.browser.get(URL);
        waitForBootstrap();
        var elem = protractor_1.element(protractor_1.by.css(selector + ' .box'));
        expect(elem.getText()).toEqual('...');
    });
    it('should animate to open', function () {
        // This test can't wait for Angular as Testability is not available when using WebWorker
        protractor_1.browser.ignoreSynchronization = true;
        protractor_1.browser.get(URL);
        waitForBootstrap();
        protractor_1.element(protractor_1.by.css(selector + ' button')).click();
        var boxElm = protractor_1.element(protractor_1.by.css(selector + ' .box'));
        protractor_1.browser.wait(function () { return boxElm.getSize().then(function (sizes) { return sizes['width'] > 750; }); }, 1000);
    });
    it('should cancel the animation midway and continue from where it left off', function () {
        protractor_1.browser.ignoreSynchronization = true;
        protractor_1.browser.get(URL);
        waitForBootstrap();
        var elem = protractor_1.element(protractor_1.by.css(selector + ' .box'));
        var btn = protractor_1.element(protractor_1.by.css(selector + ' button'));
        var getWidth = function () { return elem.getSize().then(function (sizes) { return sizes['width']; }); };
        btn.click();
        protractor_1.browser.sleep(250);
        btn.click();
        expect(getWidth()).toBeLessThan(600);
        protractor_1.browser.sleep(500);
        expect(getWidth()).toBeLessThan(50);
    });
    function waitForBootstrap() {
        protractor_1.browser.wait(protractor_1.protractor.until.elementLocated(protractor_1.by.css(selector + ' .box')), 5000)
            .then(function () { }, function () {
            // jasmine will timeout if this gets called too many times
            console.error('>> unexpected timeout -> browser.refresh()');
            protractor_1.browser.refresh();
            waitForBootstrap();
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uc19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL2UyZV90ZXN0L3dlYl93b3JrZXJzL2FuaW1hdGlvbnMvYW5pbWF0aW9uc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQXdEO0FBQ3hELHlDQUE0RDtBQUU1RCxnRUFBZ0U7QUFDaEUsU0FBUyxDQUFDLHVCQUF1QixFQUFFO0lBQ2pDLFNBQVMsQ0FBQztRQUNSLGdDQUFxQixFQUFFLENBQUM7UUFDeEIsb0JBQU8sQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7SUFDeEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFNLFFBQVEsR0FBRyxlQUFlLENBQUM7SUFDakMsSUFBTSxHQUFHLEdBQUcsc0RBQXNELENBQUM7SUFFbkUsRUFBRSxDQUFDLGtCQUFrQixFQUFFO1FBQ3JCLHdGQUF3RjtRQUN4RixvQkFBTyxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQztRQUNyQyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqQixnQkFBZ0IsRUFBRSxDQUFDO1FBQ25CLElBQU0sSUFBSSxHQUFHLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNqRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHdCQUF3QixFQUFFO1FBQzNCLHdGQUF3RjtRQUN4RixvQkFBTyxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQztRQUNyQyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqQixnQkFBZ0IsRUFBRSxDQUFDO1FBQ25CLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU5QyxJQUFNLE1BQU0sR0FBRyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDbkQsb0JBQU8sQ0FBQyxJQUFJLENBQUMsY0FBTSxPQUFBLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxFQUFwQixDQUFvQixDQUFDLEVBQXBELENBQW9ELEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDakYsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsd0VBQXdFLEVBQUU7UUFDM0Usb0JBQU8sQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7UUFDckMsb0JBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFakIsZ0JBQWdCLEVBQUUsQ0FBQztRQUVuQixJQUFNLElBQUksR0FBRyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDakQsSUFBTSxHQUFHLEdBQUcsb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ2xELElBQU0sUUFBUSxHQUFHLGNBQU0sT0FBQSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsS0FBVSxJQUFLLE9BQUEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFkLENBQWMsQ0FBQyxFQUFuRCxDQUFtRCxDQUFDO1FBRTNFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVaLG9CQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRW5CLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVaLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVyQyxvQkFBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVuQixNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFDLENBQUM7SUFFSDtRQUNFLG9CQUFPLENBQUMsSUFBSSxDQUFDLHVCQUFVLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQzthQUMxRSxJQUFJLENBQUMsY0FBTyxDQUFDLEVBQUU7WUFDZCwwREFBMEQ7WUFDMUQsT0FBTyxDQUFDLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1lBQzVELG9CQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDbEIsZ0JBQWdCLEVBQUUsQ0FBQztRQUNyQixDQUFDLENBQUMsQ0FBQztJQUNULENBQUM7QUFDSCxDQUFDLENBQUMsQ0FBQyJ9