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
describe('WebWorker Router', function () {
    beforeEach(function () {
        // This test can't wait for Angular as Testability is not available when using WebWorker
        protractor_1.browser.ignoreSynchronization = true;
        protractor_1.browser.get('/');
    });
    afterEach(function () {
        e2e_util_1.verifyNoBrowserErrors();
        protractor_1.browser.ignoreSynchronization = false;
    });
    var contentSelector = 'app main h1';
    var navSelector = 'app nav ul';
    var baseUrl = 'all/playground/src/web_workers/router/index.html';
    it('should route on click', function () {
        protractor_1.browser.get(baseUrl);
        waitForElement(contentSelector);
        var content = protractor_1.element(protractor_1.by.css(contentSelector));
        expect(content.getText()).toEqual('Start');
        var aboutBtn = protractor_1.element(protractor_1.by.css(navSelector + ' .about'));
        aboutBtn.click();
        waitForUrl(/\/about/);
        waitForElement(contentSelector);
        waitForElementText(contentSelector, 'About');
        content = protractor_1.element(protractor_1.by.css(contentSelector));
        expect(content.getText()).toEqual('About');
        expect(protractor_1.browser.getCurrentUrl()).toMatch(/\/about/);
        var contactBtn = protractor_1.element(protractor_1.by.css(navSelector + ' .contact'));
        contactBtn.click();
        waitForUrl(/\/contact/);
        waitForElement(contentSelector);
        waitForElementText(contentSelector, 'Contact');
        content = protractor_1.element(protractor_1.by.css(contentSelector));
        expect(content.getText()).toEqual('Contact');
        expect(protractor_1.browser.getCurrentUrl()).toMatch(/\/contact/);
    });
    it('should load the correct route from the URL', function () {
        protractor_1.browser.get(baseUrl + '#/about');
        waitForElement(contentSelector);
        waitForElementText(contentSelector, 'About');
        var content = protractor_1.element(protractor_1.by.css(contentSelector));
        expect(content.getText()).toEqual('About');
    });
    function waitForElement(selector) {
        protractor_1.browser.wait(protractor_1.protractor.until.elementLocated(protractor_1.by.css(selector)), 15000);
    }
    function waitForElementText(contentSelector, expected) {
        protractor_1.browser.wait(function () {
            var deferred = protractor_1.protractor.promise.defer();
            var elem = protractor_1.element(protractor_1.by.css(contentSelector));
            elem.getText().then(function (text) { return deferred.fulfill(text === expected); });
            return deferred.promise;
        }, 5000);
    }
    function waitForUrl(regex) {
        protractor_1.browser.wait(function () {
            var deferred = protractor_1.protractor.promise.defer();
            protractor_1.browser.getCurrentUrl().then(function (url) { return deferred.fulfill(url.match(regex) !== null); });
            return deferred.promise;
        }, 5000);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvZTJlX3Rlc3Qvd2ViX3dvcmtlcnMvcm91dGVyL3JvdXRlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQXdEO0FBQ3hELHlDQUE0RDtBQUU1RCxRQUFRLENBQUMsa0JBQWtCLEVBQUU7SUFDM0IsVUFBVSxDQUFDO1FBQ1Qsd0ZBQXdGO1FBQ3hGLG9CQUFPLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO1FBQ3JDLG9CQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25CLENBQUMsQ0FBQyxDQUFDO0lBRUgsU0FBUyxDQUFDO1FBQ1IsZ0NBQXFCLEVBQUUsQ0FBQztRQUN4QixvQkFBTyxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztJQUN4QyxDQUFDLENBQUMsQ0FBQztJQUVILElBQU0sZUFBZSxHQUFHLGFBQWEsQ0FBQztJQUN0QyxJQUFNLFdBQVcsR0FBRyxZQUFZLENBQUM7SUFDakMsSUFBTSxPQUFPLEdBQUcsa0RBQWtELENBQUM7SUFFbkUsRUFBRSxDQUFDLHVCQUF1QixFQUFFO1FBQzFCLG9CQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXJCLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNoQyxJQUFJLE9BQU8sR0FBRyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztRQUMvQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTNDLElBQU0sUUFBUSxHQUFHLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUMxRCxRQUFRLENB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