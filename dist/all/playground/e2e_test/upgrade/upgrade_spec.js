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
// TODO(i): re-enable once we are using a version of protractor containing the
// change in https://github.com/angular/protractor/pull/3403
xdescribe('ngUpgrade', function () {
    var URL = 'all/playground/src/upgrade/index.html';
    beforeEach(function () {
        protractor_1.browser.rootEl = 'body';
        protractor_1.browser.ng12Hybrid = true;
        protractor_1.browser.get(URL);
    });
    afterEach(function () {
        protractor_1.browser.useAllAngular2AppRoots();
        protractor_1.browser.ng12Hybrid = false;
        e2e_util_1.verifyNoBrowserErrors();
    });
    it('should bootstrap AngularJS and Angular apps together', function () {
        var ng1NameInput = protractor_1.element(protractor_1.by.css('input[ng-model="name"]'));
        expect(ng1NameInput.getAttribute('value')).toEqual('World');
        var userSpan = protractor_1.element(protractor_1.by.css('user span'));
        expect(userSpan.getText()).toMatch(/World$/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL2UyZV90ZXN0L3VwZ3JhZGUvdXBncmFkZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQXdEO0FBQ3hELHlDQUFnRDtBQUVoRCw4RUFBOEU7QUFDOUUsNERBQTREO0FBQzVELFNBQVMsQ0FBQyxXQUFXLEVBQUU7SUFDckIsSUFBTSxHQUFHLEdBQUcsdUNBQXVDLENBQUM7SUFFcEQsVUFBVSxDQUFDO1FBQ1Qsb0JBQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ2xCLG9CQUFRLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUNqQyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuQixDQUFDLENBQUMsQ0FBQztJQUVILFNBQVMsQ0FBQztRQUNGLG9CQUFRLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUNsQyxvQkFBUSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDbEMsZ0NBQXFCLEVBQUUsQ0FBQztJQUMxQixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzREFBc0QsRUFBRTtRQUN6RCxJQUFNLFlBQVksR0FBRyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTVELElBQU0sUUFBUSxHQUFHLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9