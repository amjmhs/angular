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
describe('WebWorkers Todo', function () {
    afterEach(function () {
        e2e_util_1.verifyNoBrowserErrors();
        protractor_1.browser.ignoreSynchronization = false;
    });
    var URL = 'all/playground/src/web_workers/todo/index.html';
    it('should bootstrap', function () {
        // This test can't wait for Angular as Testability is not available when using WebWorker
        protractor_1.browser.ignoreSynchronization = true;
        protractor_1.browser.get(URL);
        waitForBootstrap();
        expect(protractor_1.element(protractor_1.by.css('#todoapp header')).getText()).toEqual('todos');
    });
});
function waitForBootstrap() {
    protractor_1.browser.wait(protractor_1.protractor.until.elementLocated(protractor_1.by.css('todo-app #todoapp')), 15000);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kb19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL2UyZV90ZXN0L3dlYl93b3JrZXJzL3RvZG8vdG9kb19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQXdEO0FBQ3hELHlDQUE0RDtBQUU1RCxRQUFRLENBQUMsaUJBQWlCLEVBQUU7SUFDMUIsU0FBUyxDQUFDO1FBQ1IsZ0NBQXFCLEVBQUUsQ0FBQztRQUN4QixvQkFBTyxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztJQUN4QyxDQUFDLENBQUMsQ0FBQztJQUVILElBQU0sR0FBRyxHQUFHLGdEQUFnRCxDQUFDO0lBRTdELEVBQUUsQ0FBQyxrQkFBa0IsRUFBRTtRQUNyQix3RkFBd0Y7UUFDeEYsb0JBQU8sQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7UUFDckMsb0JBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFakIsZ0JBQWdCLEVBQUUsQ0FBQztRQUNuQixNQUFNLENBQUMsb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN4RSxDQUFDLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDO0FBRUg7SUFDRSxvQkFBTyxDQUFDLElBQUksQ0FBQyx1QkFBVSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDcEYsQ0FBQyJ9