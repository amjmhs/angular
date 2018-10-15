"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var testing_1 = require("@angular/core/testing");
var fake_async_1 = require("../../core/testing/src/fake_async");
var animation_player_1 = require("../src/players/animation_player");
var util_1 = require("../src/util");
{
    describe('NoopAnimationPlayer', function () {
        it('should finish after the next microtask once started', testing_1.fakeAsync(function () {
            var log = [];
            var player = new animation_player_1.NoopAnimationPlayer();
            player.onStart(function () { return log.push('started'); });
            player.onDone(function () { return log.push('done'); });
            fake_async_1.flushMicrotasks();
            expect(log).toEqual([]);
            player.play();
            expect(log).toEqual(['started']);
            fake_async_1.flushMicrotasks();
            expect(log).toEqual(['started', 'done']);
        }));
        it('should fire all callbacks when destroyed', function () {
            var log = [];
            var player = new animation_player_1.NoopAnimationPlayer();
            player.onStart(function () { return log.push('started'); });
            player.onDone(function () { return log.push('done'); });
            player.onDestroy(function () { return log.push('destroy'); });
            expect(log).toEqual([]);
            player.destroy();
            expect(log).toEqual(['started', 'done', 'destroy']);
        });
        it('should fire start/done callbacks manually when called directly', testing_1.fakeAsync(function () {
            var log = [];
            var player = new animation_player_1.NoopAnimationPlayer();
            player.onStart(function () { return log.push('started'); });
            player.onDone(function () { return log.push('done'); });
            fake_async_1.flushMicrotasks();
            player.triggerCallback('start');
            expect(log).toEqual(['started']);
            player.play();
            expect(log).toEqual(['started']);
            player.triggerCallback('done');
            expect(log).toEqual(['started', 'done']);
            player.finish();
            expect(log).toEqual(['started', 'done']);
            fake_async_1.flushMicrotasks();
            expect(log).toEqual(['started', 'done']);
        }));
        it('should fire off start callbacks before triggering the finish callback', testing_1.fakeAsync(function () {
            var log = [];
            var player = new animation_player_1.NoopAnimationPlayer();
            player.onStart(function () { util_1.scheduleMicroTask(function () { return log.push('started'); }); });
            player.onDone(function () { return log.push('done'); });
            expect(log).toEqual([]);
            player.play();
            expect(log).toEqual([]);
            fake_async_1.flushMicrotasks();
            expect(log).toEqual(['started', 'done']);
        }));
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3BsYXllcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy90ZXN0L2FuaW1hdGlvbl9wbGF5ZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILGlEQUFnRDtBQUNoRCxnRUFBa0U7QUFDbEUsb0VBQW9FO0FBQ3BFLG9DQUE4QztBQUU5QztJQUNFLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtRQUM5QixFQUFFLENBQUMscURBQXFELEVBQUUsbUJBQVMsQ0FBQztZQUMvRCxJQUFNLEdBQUcsR0FBYSxFQUFFLENBQUM7WUFFekIsSUFBTSxNQUFNLEdBQUcsSUFBSSxzQ0FBbUIsRUFBRSxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBTSxPQUFBLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQW5CLENBQW1CLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQU0sT0FBQSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFoQixDQUFnQixDQUFDLENBQUM7WUFDdEMsNEJBQWUsRUFBRSxDQUFDO1lBRWxCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDeEIsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFFakMsNEJBQWUsRUFBRSxDQUFDO1lBQ2xCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAsRUFBRSxDQUFDLDBDQUEwQyxFQUFFO1lBQzdDLElBQU0sR0FBRyxHQUFh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