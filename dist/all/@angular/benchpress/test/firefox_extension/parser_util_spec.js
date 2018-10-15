"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var parser_util_1 = require("../../src/firefox_extension/lib/parser_util");
function assertEventsEqual(actualEvents, expectedEvents) {
    expect(actualEvents.length == expectedEvents.length);
    for (var i = 0; i < actualEvents.length; ++i) {
        var actualEvent = actualEvents[i];
        var expectedEvent = expectedEvents[i];
        for (var key in actualEvent) {
            expect(actualEvent[key]).toEqual(expectedEvent[key]);
        }
    }
}
{
    describe('convertPerfProfileToEvents', function () {
        it('should convert single instantaneous event', function () {
            var profileData = {
                threads: [
                    { samples: [{ time: 1, frames: [{ location: 'FirefoxDriver.prototype.executeScript' }] }] }
                ]
            };
            var perfEvents = parser_util_1.convertPerfProfileToEvents(profileData);
            assertEventsEqual(perfEvents, [{ ph: 'X', ts: 1, name: 'script' }]);
        });
        it('should convert single non-instantaneous event', function () {
            var profileData = {
                threads: [{
                        samples: [
                            { time: 1, frames: [{ location: 'FirefoxDriver.prototype.executeScript' }] },
                            { time: 2, frames: [{ location: 'FirefoxDriver.prototype.executeScript' }] },
                            { time: 100, frames: [{ location: 'FirefoxDriver.prototype.executeScript' }] }
                        ]
                    }]
            };
            var perfEvents = parser_util_1.convertPerfProfileToEvents(profileData);
            assertEventsEqual(perfEvents, [{ ph: 'B', ts: 1, name: 'script' }, { ph: 'E', ts: 100, name: 'script' }]);
        });
        it('should convert multiple instantaneous events', function () {
            var profileData = {
                threads: [{
                        samples: [
                            { time: 1, frames: [{ location: 'FirefoxDriver.prototype.executeScript' }] },
                            { time: 2, frames: [{ location: 'PresShell::Paint' }] }
                        ]
                    }]
            };
            var perfEvents = parser_util_1.convertPerfProfileToEvents(profileData);
            assertEventsEqual(perfEvents, [{ ph: 'X', ts: 1, name: 'script' }, { ph: 'X', ts: 2, name: 'render' }]);
        });
        it('should convert multiple mixed events', function () {
            var profileData = {
                threads: [{
                        samples: [
                            { time: 1, frames: [{ location: 'FirefoxDriver.prototype.executeScript' }] },
                            { time: 2, frames: [{ location: 'PresShell::Paint' }] },
                            { time: 5, frames: [{ location: 'FirefoxDriver.prototype.executeScript' }] },
                            { time: 10, frames: [{ location: 'FirefoxDriver.prototype.executeScript' }] }
                        ]
                    }]
            };
            var perfEvents = parser_util_1.convertPerfProfileToEvents(profileData);
            assertEventsEqual(perfEvents, [
                { ph: 'X', ts: 1, name: 'script' }, { ph: 'X', ts: 2, name: 'render' },
                { ph: 'B', ts: 5, name: 'script' }, { ph: 'E', ts: 10, name: 'script' }
            ]);
        });
        it('should add args to gc events', function () {
            var profileData = { threads: [{ samples: [{ time: 1, frames: [{ location: 'forceGC' }] }] }] };
            var perfEvents = parser_util_1.convertPerfProfileToEvents(profileData);
            assertEventsEqual(perfEvents, [{ ph: 'X', ts: 1, name: 'gc', args: { usedHeapSize: 0 } }]);
        });
        it('should skip unknown events', function () {
            var profileData = {
                threads: [{
                        samples: [
                            { time: 1, frames: [{ location: 'FirefoxDriver.prototype.executeScript' }] },
                            { time: 2, frames: [{ location: 'foo' }] }
                        ]
                    }]
            };
            var perfEvents = parser_util_1.convertPerfProfileToEvents(profileData);
            assertEventsEqual(perfEvents, [{ ph: 'X', ts: 1, name: 'script' }]);
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyX3V0aWxfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3MvdGVzdC9maXJlZm94X2V4dGVuc2lvbi9wYXJzZXJfdXRpbF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMkVBQXVGO0FBRXZGLDJCQUEyQixZQUFtQixFQUFFLGNBQXFCO0lBQ25FLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtRQUM1QyxJQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEMsSUFBTSxhQUFhLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLEtBQUssSUFBTSxHQUFHLElBQUksV0FBVyxFQUFFO1lBQzdCLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDdEQ7S0FDRjtBQUNILENBQUM7QUFFRDtJQUNFLFFBQVEsQ0FBQyw0QkFBNEIsRUFBRTtRQUNyQyxFQUFFLENBQUMsMkNBQTJDLEVBQUU7WUFDOUMsSUFBTSxXQUFXLEdBQUc7Z0JBQ2xCLE9BQU8sRUFBRTtvQkFDUCxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDLFFBQVEsRUFBRSx1Q0FBdUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDO2lCQUN0RjthQUNGLENBQUM7WUFDRixJQUFNLFVBQVUsR0FBRyx3Q0FBMEIsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMzRCxpQkFBaUIs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