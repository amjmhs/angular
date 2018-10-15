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
var Key = protractor_1.protractor.Key;
describe('key_events', function () {
    var URL = 'all/playground/src/key_events/index.html?bundles=false';
    afterEach(e2e_util_1.verifyNoBrowserErrors);
    beforeEach(function () { protractor_1.browser.get(URL); });
    it('should display correct key names', function () {
        var firstArea = protractor_1.element.all(protractor_1.by.css('.sample-area')).get(0);
        expect(firstArea.getText()).toEqual('(none)');
        // testing different key categories:
        firstArea.sendKeys(Key.ENTER);
        expect(firstArea.getText()).toEqual('enter');
        firstArea.sendKeys(Key.SHIFT, Key.ENTER);
        expect(firstArea.getText()).toEqual('shift.enter');
        firstArea.sendKeys(Key.CONTROL, Key.SHIFT, Key.ENTER);
        expect(firstArea.getText()).toEqual('control.shift.enter');
        firstArea.sendKeys(' ');
        expect(firstArea.getText()).toEqual('space');
        // It would not work with a letter which position depends on the keyboard layout (ie AZERTY vs
        // QWERTY), see https://code.google.com/p/chromedriver/issues/detail?id=553
        firstArea.sendKeys('u');
        expect(firstArea.getText()).toEqual('u');
        firstArea.sendKeys(Key.CONTROL, 'b');
        expect(firstArea.getText()).toEqual('control.b');
        firstArea.sendKeys(Key.F1);
        expect(firstArea.getText()).toEqual('f1');
        firstArea.sendKeys(Key.ALT, Key.F1);
        expect(firstArea.getText()).toEqual('alt.f1');
        firstArea.sendKeys(Key.CONTROL, Key.F1);
        expect(firstArea.getText()).toEqual('control.f1');
        // There is an issue with Key.NUMPAD0 (and other NUMPADx):
        // chromedriver does not correctly set the location property on the event to
        // specify that the key is on the numeric keypad (event.location = 3)
        // so the following test fails:
        // firstArea.sendKeys(Key.NUMPAD0);
        // expect(firstArea.getText()).toEqual('0');
    });
    it('should correctly react to the specified key', function () {
        var secondArea = protractor_1.element.all(protractor_1.by.css('.sample-area')).get(1);
        secondArea.sendKeys(Key.SHIFT, Key.ENTER);
        expect(secondArea.getText()).toEqual('You pressed shift.enter!');
    });
    it('should not react to incomplete keys', function () {
        var secondArea = protractor_1.element.all(protractor_1.by.css('.sample-area')).get(1);
        secondArea.sendKeys(Key.ENTER);
        expect(secondArea.getText()).toEqual('');
    });
    it('should not react to keys with more modifiers', function () {
        var secondArea = protractor_1.element.all(protractor_1.by.css('.sample-area')).get(1);
        secondArea.sendKeys(Key.CONTROL, Key.SHIFT, Key.ENTER);
        expect(secondArea.getText()).toEqual('');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5X2V2ZW50c19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL2UyZV90ZXN0L2tleV9ldmVudHMva2V5X2V2ZW50c19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQXdEO0FBQ3hELHlDQUE0RDtBQUU1RCxJQUFNLEdBQUcsR0FBRyx1QkFBVSxDQUFDLEdBQUcsQ0FBQztBQUUzQixRQUFRLENBQUMsWUFBWSxFQUFFO0lBRXJCLElBQU0sR0FBRyxHQUFHLHdEQUF3RCxDQUFDO0lBRXJFLFNBQVMsQ0FBQyxnQ0FBcUIsQ0FBQyxDQUFDO0lBQ2pDLFVBQVUsQ0FBQyxjQUFRLG9CQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFeEMsRUFBRSxDQUFDLGtDQUFrQyxFQUFFO1FBQ3JDLElBQU0sU0FBUyxHQUFHLG9CQUFPLENBQUMsR0FBRyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUU5QyxvQ0FBb0M7UUFDcEMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU3QyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFbkQsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUUzRCxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFN0MsOEZBQThGO1FBQzlGLDJFQUEyRTtRQUMzRSxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFekMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFakQsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUxQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFOUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4QyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRWxELDBEQUEwRDtRQUMxRCw0RUFBNEU7UUFDNUUscUVBQXFFO1FBQ3JFLCtCQUErQjtRQUMvQixtQ0FBbUM7UUFDbkMsNENBQTRDO0lBQzlDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDZDQUE2QyxFQUFFO1FBQ2hELElBQU0sVUFBVSxHQUFHLG9CQUFPLENBQUMsR0FBRyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUQsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7SUFDbkUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQUU7UUFDeEMsSUFBTSxVQUFVLEdBQUcsb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RCxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQixNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO1FBQ2pELElBQU0sVUFBVSxHQUFHLG9CQUFPLENBQUMsR0FBRyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUQsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDM0MsQ0FBQyxDQUFDLENBQUM7QUFFTCxDQUFDLENBQUMsQ0FBQyJ9