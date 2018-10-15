"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var key_events_1 = require("@angular/platform-browser/src/dom/events/key_events");
{
    testing_internal_1.describe('KeyEventsPlugin', function () {
        if (isNode)
            return;
        testing_internal_1.it('should ignore unrecognized events', function () {
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keydown')).toEqual(null);
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keyup')).toEqual(null);
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keydown.unknownmodifier.enter')).toEqual(null);
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keyup.unknownmodifier.enter')).toEqual(null);
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('unknownevent.control.shift.enter')).toEqual(null);
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('unknownevent.enter')).toEqual(null);
        });
        testing_internal_1.it('should correctly parse event names', function () {
            // key with no modifier
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keydown.enter'))
                .toEqual({ 'domEventName': 'keydown', 'fullKey': 'enter' });
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keyup.enter'))
                .toEqual({ 'domEventName': 'keyup', 'fullKey': 'enter' });
            // key with modifiers:
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keydown.control.shift.enter'))
                .toEqual({ 'domEventName': 'keydown', 'fullKey': 'control.shift.enter' });
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keyup.control.shift.enter'))
                .toEqual({ 'domEventName': 'keyup', 'fullKey': 'control.shift.enter' });
            // key with modifiers in a different order:
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keydown.shift.control.enter'))
                .toEqual({ 'domEventName': 'keydown', 'fullKey': 'control.shift.enter' });
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keyup.shift.control.enter'))
                .toEqual({ 'domEventName': 'keyup', 'fullKey': 'control.shift.enter' });
            // key that is also a modifier:
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keydown.shift.control'))
                .toEqual({ 'domEventName': 'keydown', 'fullKey': 'shift.control' });
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keyup.shift.control'))
                .toEqual({ 'domEventName': 'keyup', 'fullKey': 'shift.control' });
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keydown.control.shift'))
                .toEqual({ 'domEventName': 'keydown', 'fullKey': 'control.shift' });
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keyup.control.shift'))
                .toEqual({ 'domEventName': 'keyup', 'fullKey': 'control.shift' });
        });
        testing_internal_1.it('should alias esc to escape', function () {
            testing_internal_1.expect(key_events_1.KeyEventsPlugin.parseEventName('keyup.control.esc'))
                .toEqual(key_events_1.KeyEventsPlugin.parseEventName('keyup.control.escape'));
        });
        testing_internal_1.it('should implement addGlobalEventListener', function () {
            var plugin = new key_events_1.KeyEventsPlugin(document);
            spyOn(plugin, 'addEventListener').and.callFake(function () { });
            testing_internal_1.expect(function () { return plugin.addGlobalEventListener('window', 'keyup.control.esc', function () { }); })
                .not.toThrowError();
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5X2V2ZW50c19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci90ZXN0L2RvbS9ldmVudHMva2V5X2V2ZW50c19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0VBQWdGO0FBQ2hGLGtGQUFvRjtBQUVwRjtJQUNFLDJCQUFRLENBQUMsaUJBQWlCLEVBQUU7UUFDMUIsSUFBSSxNQUFNO1lBQUUsT0FBTztRQUVuQixxQkFBRSxDQUFDLG1DQUFtQyxFQUFFO1lBQ3RDLHlCQUFNLENBQUMsNEJBQWUsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEUseUJBQU0sQ0FBQyw0QkFBZSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM5RCx5QkFBTSxDQUFDLDRCQUFlLENBQUMsY0FBYyxDQUFDLCtCQUErQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEYseUJBQU0sQ0FBQyw0QkFBZSxDQUFDLGNBQWMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BGLHlCQUFNLENBQUMsNEJBQWUsQ0FBQyxjQUFjLENBQUMsa0NBQWtDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6Rix5QkFBTSxDQUFDLDRCQUFlLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0UsQ0FBQyxDQUFDLENBQUM7UUFFSCxxQkFBRSxDQUFDLG9DQUFvQyxFQUFFO1lBQ3ZDLHVCQUF1QjtZQUN2Qix5QkFBTSxDQUFDLDRCQUFlLENB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