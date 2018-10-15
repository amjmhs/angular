"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("protractor");
const e2e_util_1 = require("../../../../_common/e2e_util");
function waitForElement(selector) {
    const EC = protractor_1.ExpectedConditions;
    // Waits for the element with id 'abc' to be present on the dom.
    protractor_1.browser.wait(EC.presenceOf(protractor_1.$(selector)), 20000);
}
describe('pipe', () => {
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    const URL = '/common/pipes/ts/';
    describe('async', () => {
        it('should resolve and display promise', () => {
            protractor_1.browser.get(URL);
            waitForElement('async-promise-pipe');
            expect(protractor_1.element.all(protractor_1.by.css('async-promise-pipe span')).get(0).getText())
                .toEqual('Wait for it...');
            protractor_1.element(protractor_1.by.css('async-promise-pipe button')).click();
            expect(protractor_1.element.all(protractor_1.by.css('async-promise-pipe span')).get(0).getText())
                .toEqual('Wait for it... hi there!');
        });
    });
    describe('lowercase/uppercase', () => {
        it('should work properly', () => {
            protractor_1.browser.get(URL);
            waitForElement('lowerupper-pipe');
            protractor_1.element(protractor_1.by.css('lowerupper-pipe input')).sendKeys('Hello World!');
            expect(protractor_1.element.all(protractor_1.by.css('lowerupper-pipe pre')).get(0).getText())
                .toEqual('\'hello world!\'');
            expect(protractor_1.element.all(protractor_1.by.css('lowerupper-pipe pre')).get(1).getText())
                .toEqual('\'HELLO WORLD!\'');
        });
    });
    describe('titlecase', () => {
        it('should work properly', () => {
            protractor_1.browser.get(URL);
            waitForElement('titlecase-pipe');
            expect(protractor_1.element.all(protractor_1.by.css('titlecase-pipe p')).get(0).getText()).toEqual('Some String');
            expect(protractor_1.element.all(protractor_1.by.css('titlecase-pipe p')).get(1).getText())
                .toEqual('This Is Mixed Case');
            expect(protractor_1.element.all(protractor_1.by.css('titlecase-pipe p')).get(2).getText())
                .toEqual('It\'s Non-trivial Question');
            expect(protractor_1.element.all(protractor_1.by.css('titlecase-pipe p')).get(3).getText()).toEqual('One,two,three');
            expect(protractor_1.element.all(protractor_1.by.css('titlecase-pipe p')).get(4).getText()).toEqual('True|false');
            expect(protractor_1.element.all(protractor_1.by.css('titlecase-pipe p')).get(5).getText()).toEqual('Foo-vs-bar');
        });
    });
    describe('keyvalue', () => {
        it('should work properly', () => {
            protractor_1.browser.get(URL);
            waitForElement('keyvalue-pipe');
            expect(protractor_1.element.all(protractor_1.by.css('keyvalue-pipe div')).get(0).getText()).toEqual('1:bar');
            expect(protractor_1.element.all(protractor_1.by.css('keyvalue-pipe div')).get(1).getText()).toEqual('2:foo');
            expect(protractor_1.element.all(protractor_1.by.css('keyvalue-pipe div')).get(2).getText()).toEqual('1:bar');
            expect(protractor_1.element.all(protractor_1.by.css('keyvalue-pipe div')).get(3).getText()).toEqual('2:foo');
        });
    });
    describe('number', () => {
        it('should work properly', () => {
            protractor_1.browser.get(URL);
            waitForElement('number-pipe');
            const examples = protractor_1.element.all(protractor_1.by.css('number-pipe p'));
            expect(examples.get(0).getText()).toEqual('e (no formatting): 2.718');
            expect(examples.get(1).getText()).toEqual('e (3.1-5): 002.71828');
            expect(examples.get(2).getText()).toEqual('e (4.5-5): 0,002.71828');
            expect(examples.get(3).getText()).toEqual('e (french): 0 002,71828');
            expect(examples.get(4).getText()).toEqual('pi (no formatting): 3.14');
            expect(examples.get(5).getText()).toEqual('pi (3.1-5): 003.14');
            expect(examples.get(6).getText()).toEqual('pi (3.5-5): 003.14000');
            expect(examples.get(7).getText()).toEqual('-2.5 (1.0-0): -3');
        });
    });
    describe('percent', () => {
        it('should work properly', () => {
            protractor_1.browser.get(URL);
            waitForElement('percent-pipe');
            const examples = protractor_1.element.all(protractor_1.by.css('percent-pipe p'));
            expect(examples.get(0).getText()).toEqual('A: 26%');
            expect(examples.get(1).getText()).toEqual('B: 0,134.950%');
            expect(examples.get(2).getText()).toEqual('B: 0 134,950 %');
        });
    });
    describe('currency', () => {
        it('should work properly', () => {
            protractor_1.browser.get(URL);
            waitForElement('currency-pipe');
            const examples = protractor_1.element.all(protractor_1.by.css('currency-pipe p'));
            expect(examples.get(0).getText()).toEqual('A: $0.26');
            expect(examples.get(1).getText()).toEqual('A: CA$0.26');
            expect(examples.get(2).getText()).toEqual('A: CAD0.26');
            expect(examples.get(3).getText()).toEqual('B: CA$0,001.35');
            expect(examples.get(4).getText()).toEqual('B: $0,001.35');
            expect(examples.get(5).getText()).toEqual('B: 0 001,35 CA$');
            expect(examples.get(6).getText()).toEqual('B: CLP1');
        });
    });
});
//# sourceMappingURL=pipe_spec.js.map