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
var direct_style_player_1 = require("../../../src/render/css_keyframes/direct_style_player");
var shared_1 = require("./shared");
var CSS_KEYFRAME_RULE_TYPE = 7;
describe('DirectStylePlayer tests', function () {
    if (isNode)
        return;
    it('should apply the styling to the given element when the animation starts and remove when destroyed', function () {
        var element = shared_1.createElement();
        var player = new direct_style_player_1.DirectStylePlayer(element, { opacity: 0.5 });
        shared_1.assertStyle(element, 'opacity', '');
        player.play();
        shared_1.assertStyle(element, 'opacity', '0.5');
        player.finish();
        shared_1.assertStyle(element, 'opacity', '0.5');
        player.destroy();
        shared_1.assertStyle(element, 'opacity', '');
    });
    it('should finish the animation after one tick', testing_1.fakeAsync(function () {
        var element = shared_1.createElement();
        var player = new direct_style_player_1.DirectStylePlayer(element, { opacity: 0.5 });
        var done = false;
        player.onDone(function () { return done = true; });
        expect(done).toBeFalsy();
        player.play();
        expect(done).toBeFalsy();
        testing_1.flushMicrotasks();
        expect(done).toBeTruthy();
    }));
    it('should restore existing element styles once the animation is destroyed', testing_1.fakeAsync(function () {
        var element = shared_1.createElement();
        element.style['width'] = '100px';
        element.style['height'] = '200px';
        var player = new direct_style_player_1.DirectStylePlayer(element, { width: '500px', opacity: 0.5 });
        shared_1.assertStyle(element, 'width', '100px');
        shared_1.assertStyle(element, 'height', '200px');
        shared_1.assertStyle(element, 'opacity', '');
        player.init();
        shared_1.assertStyle(element, 'width', '100px');
        shared_1.assertStyle(element, 'height', '200px');
        shared_1.assertStyle(element, 'opacity', '');
        player.play();
        shared_1.assertStyle(element, 'width', '500px');
        shared_1.assertStyle(element, 'height', '200px');
        shared_1.assertStyle(element, 'opacity', '0.5');
        player.destroy();
        shared_1.assertStyle(element, 'width', '100px');
        shared_1.assertStyle(element, 'height', '200px');
        shared_1.assertStyle(element, 'opacity', '');
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0X3N0eWxlX3BsYXllcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3Rlc3QvcmVuZGVyL2Nzc19rZXlmcmFtZXMvZGlyZWN0X3N0eWxlX3BsYXllcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsaURBQTBFO0FBRTFFLDZGQUF3RjtBQUV4RixtQ0FBb0Q7QUFFcEQsSUFBTSxzQkFBc0IsR0FBRyxDQUFDLENBQUM7QUFFakMsUUFBUSxDQUFDLHlCQUF5QixFQUFFO0lBQ2xDLElBQUksTUFBTTtRQUFFLE9BQU87SUFFbkIsRUFBRSxDQUFDLG1HQUFtRyxFQUNuRztRQUNFLElBQU0sT0FBTyxHQUFHLHNCQUFhLEVBQUUsQ0FBQztRQUNoQyxJQUFNLE1BQU0sR0FBRyxJQUFJLHVDQUFpQixDQUFDLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDO1FBRTlELG9CQUFXLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVwQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZCxvQkFBVyxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFdkMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2hCLG9CQUFXLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV2QyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakIsb0JBQVcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBRU4sRUFBRSxDQUFDLDRDQUE0QyxFQUFFLG1CQUFTLENBQUM7UUFDdEQsSUFBTSxPQUFPLEdBQUcsc0JBQWEsRUFBRSxDQUFDO1FBQ2hDLElBQU0sTUFBTSxHQUFHLElBQUksdUNBQWlCLENBQUMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7UUFFOUQsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBTSxPQUFBLElBQUksR0FBRyxJQUFJLEVBQVgsQ0FBVyxDQUFDLENBQUM7UUFFakMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBRXpCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUV6Qix5QkFBZSxFQUFFLENBQUM7UUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFUCxFQUFFLENBQUMsd0VBQXdFLEVBQUUsbUJBQVMsQ0FBQztRQUNsRixJQUFNLE9BQU8sR0FBRyxzQkFBYSxFQUFFLENBQUM7UUFDaEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDakMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxPQUFPLENBQUM7UUFFbEMsSUFBTSxNQUFNLEdBQUcsSUFBSSx1Q0FBaUIsQ0FBQyxPQUFPLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDO1FBRTlFLG9CQUFXLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN2QyxvQkFBVyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDeEMsb0JBQVcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRXBDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNkLG9CQUFXLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN2QyxvQkFBVyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDeEMsb0JBQVcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRXBDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNkLG9CQUFXLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN2QyxvQkFBVyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDeEMsb0JBQVcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXZDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNqQixvQkFBVyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDdkMsb0JBQVcsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLG9CQUFXLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN0QyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ1QsQ0FBQyxDQUFDLENBQUMifQ==