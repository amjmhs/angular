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
var css_keyframes_driver_1 = require("../../../src/render/css_keyframes/css_keyframes_driver");
var direct_style_player_1 = require("../../../src/render/css_keyframes/direct_style_player");
var shared_1 = require("./shared");
var CSS_KEYFRAME_RULE_TYPE = 7;
describe('CssKeyframesDriver tests', function () {
    if (isNode || typeof window['AnimationEvent'] == 'undefined')
        return;
    describe('building keyframes', function () {
        it('should build CSS keyframe style object containing the keyframe styles', function () {
            var elm = shared_1.createElement();
            var animator = new css_keyframes_driver_1.CssKeyframesDriver();
            var kfElm = animator.buildKeyframeElement(elm, 'myKfAnim', [
                { opacity: 0, width: '0px', offset: 0 },
                { opacity: 0.5, width: '100px', offset: 0.5 },
                { opacity: 1, width: '200px', offset: 1 },
            ]);
            var head = document.querySelector('head');
            head.appendChild(kfElm);
            shared_1.forceReflow();
            var sheet = kfElm.sheet;
            var kfRule = shared_1.findKeyframeDefinition(sheet);
            expect(kfRule.name).toEqual('myKfAnim');
            expect(kfRule.type).toEqual(CSS_KEYFRAME_RULE_TYPE);
            var keyframeCssRules = kfRule.cssRules;
            expect(keyframeCssRules.length).toEqual(3);
            var from = keyframeCssRules[0], mid = keyframeCssRules[1], to = keyframeCssRules[2];
            expect(from.keyText).toEqual('0%');
            expect(mid.keyText).toEqual('50%');
            expect(to.keyText).toEqual('100%');
            var fromStyles = from.style;
            expect(fromStyles.opacity).toEqual('0');
            expect(fromStyles.width).toEqual('0px');
            var midStyles = mid.style;
            expect(midStyles.opacity).toEqual('0.5');
            expect(midStyles.width).toEqual('100px');
            var toStyles = to.style;
            expect(toStyles.opacity).toEqual('1');
            expect(toStyles.width).toEqual('200px');
        });
        it('should convert numeric values into px-suffixed data', function () {
            var elm = shared_1.createElement();
            var animator = new css_keyframes_driver_1.CssKeyframesDriver();
            var kfElm = animator.buildKeyframeElement(elm, 'myKfAnim', [
                { width: '0px', offset: 0 },
                { width: '100px', offset: 0.5 },
                { width: '200px', offset: 1 },
            ]);
            var head = document.querySelector('head');
            head.appendChild(kfElm);
            shared_1.forceReflow();
            var sheet = kfElm.sheet;
            var kfRule = shared_1.findKeyframeDefinition(sheet);
            var keyframeCssRules = kfRule.cssRules;
            var from = keyframeCssRules[0], mid = keyframeCssRules[1], to = keyframeCssRules[2];
            expect(from.style.width).toEqual('0px');
            expect(mid.style.width).toEqual('100px');
            expect(to.style.width).toEqual('200px');
        });
    });
    describe('when animating', function () {
        it('should set an animation on the element that matches the generated animation', function () {
            var elm = shared_1.createElement();
            var animator = new css_keyframes_driver_1.CssKeyframesDriver();
            var player = animator.animate(elm, [
                { width: '0px', offset: 0 },
                { width: '200px', offset: 1 },
            ], 1234, 0, 'ease-out');
            var sheet = document.styleSheets[document.styleSheets.length - 1];
            var kfRule = shared_1.findKeyframeDefinition(sheet);
            player.init();
            var _a = parseElementAnimationStyle(elm), animationName = _a.animationName, duration = _a.duration, easing = _a.easing;
            expect(animationName).toEqual(kfRule.name);
            expect(duration).toEqual(1234);
            expect(easing).toEqual('ease-out');
        });
        it('should animate until the `animationend` method is emitted, but stil retain the <style> method and the element animation details', testing_1.fakeAsync(function () {
            // IE10 and IE11 cannot create an instanceof AnimationEvent
            if (!shared_1.supportsAnimationEventCreation())
                return;
            var elm = shared_1.createElement();
            var animator = new css_keyframes_driver_1.CssKeyframesDriver();
            assertExistingAnimationDuration(elm, 0);
            var player = animator.animate(elm, [
                { width: '0px', offset: 0 },
                { width: '200px', offset: 1 },
            ], 1234, 0, 'ease-out');
            var matchingStyleElm = findStyleObjectWithKeyframes();
            player.play();
            assertExistingAnimationDuration(elm, 1234);
            shared_1.assertElementExistsInDom(matchingStyleElm, true);
            var completed = false;
            player.onDone(function () { return completed = true; });
            expect(completed).toBeFalsy();
            testing_1.flushMicrotasks();
            expect(completed).toBeFalsy();
            var event = shared_1.makeAnimationEvent('end', player.animationName, 1234);
            elm.dispatchEvent(event);
            testing_1.flushMicrotasks();
            expect(completed).toBeTruthy();
            assertExistingAnimationDuration(elm, 1234);
            shared_1.assertElementExistsInDom(matchingStyleElm, true);
        }));
        it('should animate until finish() is called, but stil retain the <style> method and the element animation details', testing_1.fakeAsync(function () {
            var elm = shared_1.createElement();
            var animator = new css_keyframes_driver_1.CssKeyframesDriver();
            assertExistingAnimationDuration(elm, 0);
            var player = animator.animate(elm, [
                { width: '0px', offset: 0 },
                { width: '200px', offset: 1 },
            ], 1234, 0, 'ease-out');
            var matchingStyleElm = findStyleObjectWithKeyframes();
            player.play();
            assertExistingAnimationDuration(elm, 1234);
            shared_1.assertElementExistsInDom(matchingStyleElm, true);
            var completed = false;
            player.onDone(function () { return completed = true; });
            expect(completed).toBeFalsy();
            testing_1.flushMicrotasks();
            expect(completed).toBeFalsy();
            player.finish();
            testing_1.flushMicrotasks();
            expect(completed).toBeTruthy();
            assertExistingAnimationDuration(elm, 1234);
            shared_1.assertElementExistsInDom(matchingStyleElm, true);
        }));
        it('should animate until the destroy method is called and cleanup the element animation details', testing_1.fakeAsync(function () {
            var elm = shared_1.createElement();
            var animator = new css_keyframes_driver_1.CssKeyframesDriver();
            assertExistingAnimationDuration(elm, 0);
            var player = animator.animate(elm, [
                { width: '0px', offset: 0 },
                { width: '200px', offset: 1 },
            ], 1234, 0, 'ease-out');
            player.play();
            assertExistingAnimationDuration(elm, 1234);
            var completed = false;
            player.onDone(function () { return completed = true; });
            testing_1.flushMicrotasks();
            expect(completed).toBeFalsy();
            player.destroy();
            testing_1.flushMicrotasks();
            expect(completed).toBeTruthy();
            assertExistingAnimationDuration(elm, 0);
        }));
        it('should return an instance of a direct style player if an animation has a duration of 0', function () {
            var elm = shared_1.createElement();
            var animator = new css_keyframes_driver_1.CssKeyframesDriver();
            assertExistingAnimationDuration(elm, 0);
            var player = animator.animate(elm, [
                { width: '0px', offset: 0 },
                { width: '200px', offset: 1 },
            ], 0, 0, 'ease-out');
            expect(player instanceof direct_style_player_1.DirectStylePlayer).toBeTruthy();
        });
        it('should cleanup the associated <style> object when the animation is destroyed', testing_1.fakeAsync(function () {
            var elm = shared_1.createElement();
            var animator = new css_keyframes_driver_1.CssKeyframesDriver();
            var player = animator.animate(elm, [
                { width: '0px', offset: 0 },
                { width: '200px', offset: 1 },
            ], 1234, 0, 'ease-out');
            player.play();
            var matchingStyleElm = findStyleObjectWithKeyframes();
            shared_1.assertElementExistsInDom(matchingStyleElm, true);
            player.destroy();
            testing_1.flushMicrotasks();
            shared_1.assertElementExistsInDom(matchingStyleElm, false);
        }));
        it('should return the final styles when capture() is called', function () {
            var elm = shared_1.createElement();
            var animator = new css_keyframes_driver_1.CssKeyframesDriver();
            var player = animator.animate(elm, [
                { color: 'red', width: '111px', height: '111px', offset: 0 },
                { color: 'blue', height: '999px', width: '999px', offset: 1 },
            ], 2000, 0, 'ease-out');
            player.play();
            player.finish();
            player.beforeDestroy();
            expect(player.currentSnapshot).toEqual({
                width: '999px',
                height: '999px',
                color: 'blue',
            });
        });
        it('should return the intermediate styles when capture() is called in the middle of the animation', function () {
            var elm = shared_1.createElement();
            document.body.appendChild(elm); // this is required so GCS works
            var animator = new css_keyframes_driver_1.CssKeyframesDriver();
            var player = animator.animate(elm, [
                { width: '0px', height: '0px', offset: 0 },
                { height: '100px', width: '100px', offset: 1 },
            ], 2000, 0, 'ease-out');
            player.play();
            player.setPosition(0.5);
            player.beforeDestroy();
            var result = player.currentSnapshot;
            expect(parseFloat(result['width'])).toBeGreaterThan(0);
            expect(parseFloat(result['height'])).toBeGreaterThan(0);
        });
        it('should capture existing keyframe player styles in and merge in the styles into the follow up player\'s keyframes', function () {
            // IE cannot modify the position of an animation...
            // note that this feature is only for testing purposes
            if (isIE())
                return;
            var elm = shared_1.createElement();
            elm.style.border = '1px solid black';
            document.body.appendChild(elm); // this is required so GCS works
            var animator = new css_keyframes_driver_1.CssKeyframesDriver();
            var p1 = animator.animate(elm, [
                { width: '0px', lineHeight: '20px', offset: 0 },
                { width: '100px', lineHeight: '50px', offset: 1 },
            ], 2000, 0, 'ease-out');
            var p2 = animator.animate(elm, [
                { height: '100px', offset: 0 },
                { height: '300px', offset: 1 },
            ], 2000, 0, 'ease-out');
            p1.play();
            p1.setPosition(0.5);
            p1.beforeDestroy();
            p2.play();
            p2.setPosition(0.5);
            p2.beforeDestroy();
            var p3 = animator.animate(elm, [
                { height: '0px', width: '0px', offset: 0 },
                { height: '400px', width: '400px', offset: 0.5 },
                { height: '500px', width: '500px', offset: 1 },
            ], 2000, 0, 'ease-out', [p1, p2]);
            p3.init();
            var _a = p3.keyframes, k1 = _a[0], k2 = _a[1], k3 = _a[2];
            var offset = k1.offset;
            expect(offset).toEqual(0);
            var width = parseInt(k1['width']);
            expect(width).toBeGreaterThan(0);
            expect(width).toBeLessThan(100);
            var bWidth = parseInt(k1['lineHeight']);
            expect(bWidth).toBeGreaterThan(20);
            expect(bWidth).toBeLessThan(50);
            var height = parseFloat(k1['height']);
            expect(height).toBeGreaterThan(100);
            expect(height).toBeLessThan(300);
            // since the lineHeight wasn't apart of the follow-up animation,
            // it's values were copied over into all the keyframes
            var b1 = bWidth;
            var b2 = parseInt(k2['lineHeight']);
            var b3 = parseInt(k3['lineHeight']);
            expect(b1).toEqual(b2);
            expect(b2).toEqual(b3);
            // we delete the lineHeight values because they are float-based
            // and each browser has a different value based on precision...
            // therefore we can't assert it directly below (asserting it above
            // on the first keyframe was all that was needed since they are the same)
            delete k2['lineHeight'];
            delete k3['lineHeight'];
            expect(k2).toEqual({ width: '400px', height: '400px', offset: 0.5 });
            expect(k3).toEqual({ width: '500px', height: '500px', offset: 1 });
        });
    });
});
function assertExistingAnimationDuration(element, duration) {
    expect(parseElementAnimationStyle(element).duration).toEqual(duration);
}
function findStyleObjectWithKeyframes() {
    var sheetWithKeyframes = document.styleSheets[document.styleSheets.length - 1];
    var styleElms = Array.from(document.querySelectorAll('head style'));
    return styleElms.find(function (elm) { return elm.sheet == sheetWithKeyframes; }) || null;
}
function parseElementAnimationStyle(element) {
    var style = element.style;
    var duration = parseInt(style.animationDuration || 0);
    var delay = style.animationDelay;
    var easing = style.animationTimingFunction;
    var animationName = style.animationName;
    return { duration: duration, delay: delay, easing: easing, animationName: animationName };
}
function isIE() {
    // note that this only applies to older IEs (not edge)
    return window.document['documentMode'] ? true : false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NzX2tleWZyYW1lc19kcml2ZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci90ZXN0L3JlbmRlci9jc3Nfa2V5ZnJhbWVzL2Nzc19rZXlmcmFtZXNfZHJpdmVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxpREFBMEU7QUFFMUUsK0ZBQTBGO0FBRTFGLDZGQUF3RjtBQUV4RixtQ0FBMEo7QUFFMUosSUFBTSxzQkFBc0IsR0FBRyxDQUFDLENBQUM7QUFFakMsUUFBUSxDQUFDLDBCQUEwQixFQUFFO0lBQ25DLElBQUksTUFBTSxJQUFJLE9BQU8sTUFBYyxDQUFDLGdCQUFnQixDQUFDLElBQUksV0FBVztRQUFFLE9BQU87SUFFN0UsUUFBUSxDQUFDLG9CQUFvQixFQUFFO1FBQzdCLEVBQUUsQ0FBQyx1RUFBdUUsRUFBRTtZQUMxRSxJQUFNLEdBQUcsR0FBRyxzQkFBYSxFQUFFLENBQUM7WUFDNUIsSUFBTSxRQUFRLEdBQUcsSUFBSSx5Q0FBa0IsRUFBRSxDQUFDO1lBQzFDLElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLEVBQUUsVUFBVSxFQUFFO2dCQUMzRCxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO2dCQUNyQyxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFDO2dCQUMzQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO2FBQ3hDLENBQUMsQ0FBQztZQUVILElBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFHLENBQUM7WUFDOUMs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