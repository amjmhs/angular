"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var element_animation_style_handler_1 = require("../../../src/render/css_keyframes/element_animation_style_handler");
var shared_1 = require("./shared");
var EMPTY_FN = function () { };
{
    describe('ElementAnimationStyleHandler', function () {
        if (isNode || typeof window['AnimationEvent'] == 'undefined')
            return;
        it('should add and remove an animation on to an element\'s styling', function () {
            var element = shared_1.createElement();
            document.body.appendChild(element);
            var handler = new element_animation_style_handler_1.ElementAnimationStyleHandler(element, 'someAnimation', 1234, 999, 'ease-in', 'forwards', EMPTY_FN);
            shared_1.assertStyle(element, 'animation-name', '');
            shared_1.assertStyle(element, 'animation-duration', '');
            shared_1.assertStyle(element, 'animation-delay', '');
            shared_1.assertStyle(element, 'animation-timing-function', '');
            shared_1.assertStyle(element, 'animation-fill-mode', '');
            handler.apply();
            shared_1.assertStyle(element, 'animation-name', 'someAnimation');
            shared_1.assertStyle(element, 'animation-duration', '1234ms');
            shared_1.assertStyle(element, 'animation-delay', '999ms');
            shared_1.assertStyle(element, 'animation-timing-function', 'ease-in');
            shared_1.assertStyle(element, 'animation-fill-mode', 'forwards');
            handler.finish();
            shared_1.assertStyle(element, 'animation-name', 'someAnimation');
            shared_1.assertStyle(element, 'animation-duration', '1234ms');
            shared_1.assertStyle(element, 'animation-delay', '999ms');
            shared_1.assertStyle(element, 'animation-timing-function', 'ease-in');
            shared_1.assertStyle(element, 'animation-fill-mode', 'forwards');
            handler.destroy();
            shared_1.assertStyle(element, 'animation-name', '');
            shared_1.assertStyle(element, 'animation-duration', '');
            shared_1.assertStyle(element, 'animation-delay', '');
            shared_1.assertStyle(element, 'animation-timing-function', '');
            shared_1.assertStyle(element, 'animation-fill-mode', '');
        });
        it('should respect existing animation styling on an element', function () {
            var element = shared_1.createElement();
            document.body.appendChild(element);
            element.style.setProperty('animation', 'fooAnimation 1s ease-out forwards');
            shared_1.assertStyle(element, 'animation-name', 'fooAnimation');
            var handler = new element_animation_style_handler_1.ElementAnimationStyleHandler(element, 'barAnimation', 1234, 555, 'ease-out', 'both', EMPTY_FN);
            shared_1.assertStyle(element, 'animation-name', 'fooAnimation');
            handler.apply();
            shared_1.assertStyle(element, 'animation-name', 'fooAnimation, barAnimation');
            handler.destroy();
            shared_1.assertStyle(element, 'animation-name', 'fooAnimation');
        });
        it('should respect animation styling that is prefixed after a handler is applied on an element', function () {
            var element = shared_1.createElement();
            document.body.appendChild(element);
            var handler = new element_animation_style_handler_1.ElementAnimationStyleHandler(element, 'barAnimation', 1234, 555, 'ease-out', 'both', EMPTY_FN);
            shared_1.assertStyle(element, 'animation-name', '');
            handler.apply();
            shared_1.assertStyle(element, 'animation-name', 'barAnimation');
            var anim = element.style.animation;
            element.style.setProperty('animation', anim + ", fooAnimation 1s ease-out forwards");
            shared_1.assertStyle(element, 'animation-name', 'barAnimation, fooAnimation');
            handler.destroy();
            shared_1.assertStyle(element, 'animation-name', 'fooAnimation');
        });
        it('should respect animation styling that is suffixed after a handler is applied on an element', function () {
            var element = shared_1.createElement();
            document.body.appendChild(element);
            var handler = new element_animation_style_handler_1.ElementAnimationStyleHandler(element, 'barAnimation', 1234, 555, 'ease-out', 'both', EMPTY_FN);
            shared_1.assertStyle(element, 'animation-name', '');
            handler.apply();
            shared_1.assertStyle(element, 'animation-name', 'barAnimation');
            var anim = element.style.animation;
            element.style.setProperty('animation', "fooAnimation 1s ease-out forwards, " + anim);
            shared_1.assertStyle(element, 'animation-name', 'fooAnimation, barAnimation');
            handler.destroy();
            shared_1.assertStyle(element, 'animation-name', 'fooAnimation');
        });
        it('should respect existing animation handlers on an element', function () {
            var element = shared_1.createElement();
            document.body.appendChild(element);
            shared_1.assertStyle(element, 'animation-name', '');
            var h1 = new element_animation_style_handler_1.ElementAnimationStyleHandler(element, 'fooAnimation', 1234, 333, 'ease-out', 'both', EMPTY_FN);
            h1.apply();
            shared_1.assertStyle(element, 'animation-name', 'fooAnimation');
            shared_1.assertStyle(element, 'animation-duration', '1234ms');
            shared_1.assertStyle(element, 'animation-delay', '333ms');
            var h2 = new element_animation_style_handler_1.ElementAnimationStyleHandler(element, 'barAnimation', 5678, 666, 'ease-out', 'both', EMPTY_FN);
            h2.apply();
            shared_1.assertStyle(element, 'animation-name', 'fooAnimation, barAnimation');
            shared_1.assertStyle(element, 'animation-duration', '1234ms, 5678ms');
            shared_1.assertStyle(element, 'animation-delay', '333ms, 666ms');
            var h3 = new element_animation_style_handler_1.ElementAnimationStyleHandler(element, 'bazAnimation', 90, 999, 'ease-out', 'both', EMPTY_FN);
            h3.apply();
            shared_1.assertStyle(element, 'animation-name', 'fooAnimation, barAnimation, bazAnimation');
            shared_1.assertStyle(element, 'animation-duration', '1234ms, 5678ms, 90ms');
            shared_1.assertStyle(element, 'animation-delay', '333ms, 666ms, 999ms');
            h2.destroy();
            shared_1.assertStyle(element, 'animation-name', 'fooAnimation, bazAnimation');
            shared_1.assertStyle(element, 'animation-duration', '1234ms, 90ms');
            shared_1.assertStyle(element, 'animation-delay', '333ms, 999ms');
            h1.destroy();
            shared_1.assertStyle(element, 'animation-name', 'bazAnimation');
            shared_1.assertStyle(element, 'animation-duration', '90ms');
            shared_1.assertStyle(element, 'animation-delay', '999ms');
        });
        it('should fire the onDone method when .finish() is called on the handler', function () {
            var element = shared_1.createElement();
            document.body.appendChild(element);
            var done = false;
            var handler = new element_animation_style_handler_1.ElementAnimationStyleHandler(element, 'fooAnimation', 1234, 333, 'ease-out', 'both', function () { return done = true; });
            expect(done).toBeFalsy();
            handler.finish();
            expect(done).toBeTruthy();
        });
        it('should fire the onDone method only once when .finish() is called on the handler', function () {
            var element = shared_1.createElement();
            document.body.appendChild(element);
            var doneCount = 0;
            var handler = new element_animation_style_handler_1.ElementAnimationStyleHandler(element, 'fooAnimation', 1234, 333, 'ease-out', 'both', function () { return doneCount++; });
            expect(doneCount).toEqual(0);
            handler.finish();
            expect(doneCount).toEqual(1);
            handler.finish();
            expect(doneCount).toEqual(1);
        });
        it('should fire the onDone method when .destroy() is called on the handler', function () {
            var element = shared_1.createElement();
            document.body.appendChild(element);
            var done = false;
            var handler = new element_animation_style_handler_1.ElementAnimationStyleHandler(element, 'fooAnimation', 1234, 333, 'ease-out', 'both', function () { return done = true; });
            expect(done).toBeFalsy();
            handler.destroy();
            expect(done).toBeTruthy();
        });
        it('should fire the onDone method when the matching animationend event is emitted', function () {
            // IE10 and IE11 cannot create an instanceof AnimationEvent
            if (!shared_1.supportsAnimationEventCreation())
                return;
            var element = shared_1.createElement();
            document.body.appendChild(element);
            var done = false;
            var handler = new element_animation_style_handler_1.ElementAnimationStyleHandler(element, 'fooAnimation', 1234, 333, 'ease-out', 'both', function () { return done = true; });
            expect(done).toBeFalsy();
            handler.apply();
            expect(done).toBeFalsy();
            var event = shared_1.makeAnimationEvent('end', 'fooAnimation', 100);
            element.dispatchEvent(event);
            expect(done).toBeFalsy();
            event = shared_1.makeAnimationEvent('end', 'fooAnimation', 1234);
            element.dispatchEvent(event);
            expect(done).toBeFalsy();
            var timestampAfterDelay = Date.now() + 500;
            event = shared_1.makeAnimationEvent('end', 'fakeAnimation', 1234, timestampAfterDelay);
            element.dispatchEvent(event);
            expect(done).toBeFalsy();
            event = shared_1.makeAnimationEvent('end', 'fooAnimation', 1234, timestampAfterDelay);
            element.dispatchEvent(event);
            expect(done).toBeTruthy();
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudF9hbmltYXRpb25fc3R5bGVfaGFuZGxlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3Rlc3QvcmVuZGVyL2Nzc19rZXlmcmFtZXMvZWxlbWVudF9hbmltYXRpb25fc3R5bGVfaGFuZGxlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gscUhBQStHO0FBRy9HLG1DQUF3RztBQUV4RyxJQUFNLFFBQVEsR0FBRyxjQUFPLENBQUMsQ0FBQztBQUMxQjtJQUNFLFFBQVEsQ0FBQyw4QkFBOEIsRUFBRTtRQUN2QyxJQUFJLE1BQU0sSUFBSSxPQUFPLE1BQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLFdBQVc7WUFBRSxPQUFPO1FBRTdFLEVBQUUsQ0FBQyxnRUFBZ0UsRUFBRTtZQUNuRSxJQUFNLE9BQU8sR0FBRyxzQkFBYSxFQUFFLENBQUM7WUFDaEMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFbkMsSUFBTSxPQUFPLEdBQUcsSUFBSSw4REFBNEIsQ0FDNUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFMUUsb0JBQVcsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDM0Msb0JBQVcsQ0FBQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDL0Msb0JBQVcsQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDNUMsb0JBQVcsQ0FBQyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDdEQsb0JBQVcsQ0FBQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsRUFB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