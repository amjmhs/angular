"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var animations_1 = require("@angular/animations");
var util_1 = require("../../src/util");
var testing_1 = require("../../testing");
var shared_1 = require("../shared");
{
    describe('AnimationTrigger', function () {
        // these tests are only mean't to be run within the DOM (for now)
        if (isNode)
            return;
        var element;
        beforeEach(function () {
            element = document.createElement('div');
            document.body.appendChild(element);
        });
        afterEach(function () { document.body.removeChild(element); });
        describe('trigger validation', function () {
            it('should group errors together for an animation trigger', function () {
                expect(function () {
                    shared_1.makeTrigger('myTrigger', [animations_1.transition('12345', animations_1.animate(3333))]);
                }).toThrowError(/Animation parsing for the myTrigger trigger have failed/);
            });
            it('should throw an error when a transition within a trigger contains an invalid expression', function () {
                expect(function () { shared_1.makeTrigger('name', [animations_1.transition('somethingThatIsWrong', animations_1.animate(3333))]); })
                    .toThrowError(/- The provided transition expression "somethingThatIsWrong" is not supported/);
            });
            it('should throw an error if an animation alias is used that is not yet supported', function () {
                expect(function () {
                    shared_1.makeTrigger('name', [animations_1.transition(':angular', animations_1.animate(3333))]);
                }).toThrowError(/- The transition alias value ":angular" is not supported/);
            });
        });
        describe('trigger usage', function () {
            it('should construct a trigger based on the states and transition data', function () {
                var result = shared_1.makeTrigger('name', [
                    animations_1.state('on', animations_1.style({ width: 0 })),
                    animations_1.state('off', animations_1.style({ width: 100 })),
                    animations_1.transition('on => off', animations_1.animate(1000)),
                    animations_1.transition('off => on', animations_1.animate(1000)),
                ]);
                expect(result.states['on'].buildStyles({}, [])).toEqual({ width: 0 });
                expect(result.states['off'].buildStyles({}, [])).toEqual({ width: 100 });
                expect(result.transitionFactories.length).toEqual(2);
            });
            it('should allow multiple state values to use the same styles', function () {
                var result = shared_1.makeTrigger('name', [
                    animations_1.state('on, off', animations_1.style({ width: 50 })), animations_1.transition('on => off', animations_1.animate(1000)),
                    animations_1.transition('off => on', animations_1.animate(1000))
                ]);
                expect(result.states['on'].buildStyles({}, [])).toEqual({ width: 50 });
                expect(result.states['off'].buildStyles({}, [])).toEqual({ width: 50 });
            });
            it('should find the first transition that matches', function () {
                var result = shared_1.makeTrigger('name', [animations_1.transition('a => b', animations_1.animate(1234)), animations_1.transition('b => c', animations_1.animate(5678))]);
                var trans = buildTransition(result, element, 'b', 'c');
                expect(trans.timelines.length).toEqual(1);
                var timeline = trans.timelines[0];
                expect(timeline.duration).toEqual(5678);
            });
            it('should find a transition with a `*` value', function () {
                var result = shared_1.makeTrigger('name', [
                    animations_1.transition('* => b', animations_1.animate(1234)), animations_1.transition('b => *', animations_1.animate(5678)),
                    animations_1.transition('* => *', animations_1.animate(9999))
                ]);
                var trans = buildTransition(result, element, 'b', 'c');
                expect(trans.timelines[0].duration).toEqual(5678);
                trans = buildTransition(result, element, 'a', 'b');
                expect(trans.timelines[0].duration).toEqual(1234);
                trans = buildTransition(result, element, 'c', 'c');
                expect(trans.timelines[0].duration).toEqual(9999);
            });
            it('should null when no results are found', function () {
                var result = shared_1.makeTrigger('name', [animations_1.transition('a => b', animations_1.animate(1111))]);
                var trigger = result.matchTransition('b', 'a', {}, {});
                expect(trigger).toBeFalsy();
            });
            it('should support bi-directional transition expressions', function () {
                var result = shared_1.makeTrigger('name', [animations_1.transition('a <=> b', animations_1.animate(2222))]);
                var t1 = buildTransition(result, element, 'a', 'b');
                expect(t1.timelines[0].duration).toEqual(2222);
                var t2 = buildTransition(result, element, 'b', 'a');
                expect(t2.timelines[0].duration).toEqual(2222);
            });
            it('should support multiple transition statements in one string', function () {
                var result = shared_1.makeTrigger('name', [animations_1.transition('a => b, b => a, c => *', animations_1.animate(1234))]);
                var t1 = buildTransition(result, element, 'a', 'b');
                expect(t1.timelines[0].duration).toEqual(1234);
                var t2 = buildTransition(result, element, 'b', 'a');
                expect(t2.timelines[0].duration).toEqual(1234);
                var t3 = buildTransition(result, element, 'c', 'a');
                expect(t3.timelines[0].duration).toEqual(1234);
            });
            describe('params', function () {
                it('should support transition-level animation variable params', function () {
                    var result = shared_1.makeTrigger('name', [animations_1.transition('a => b', [animations_1.style({ height: '{{ a }}' }), animations_1.animate(1000, animations_1.style({ height: '{{ b }}' }))], buildParams({ a: '100px', b: '200px' }))]);
                    var trans = buildTransition(result, element, 'a', 'b');
                    var keyframes = trans.timelines[0].keyframes;
                    expect(keyframes).toEqual([{ height: '100px', offset: 0 }, { height: '200px', offset: 1 }]);
                });
                it('should substitute variable params provided directly within the transition match', function () {
                    var result = shared_1.makeTrigger('name', [animations_1.transition('a => b', [animations_1.style({ height: '{{ a }}' }), animations_1.animate(1000, animations_1.style({ height: '{{ b }}' }))], buildParams({ a: '100px', b: '200px' }))]);
                    var trans = buildTransition(result, element, 'a', 'b', {}, buildParams({ a: '300px' }));
                    var keyframes = trans.timelines[0].keyframes;
                    expect(keyframes).toEqual([{ height: '300px', offset: 0 }, { height: '200px', offset: 1 }]);
                });
            });
            it('should match `true` and `false` given boolean values', function () {
                var result = shared_1.makeTrigger('name', [
                    animations_1.state('false', animations_1.style({ color: 'red' })), animations_1.state('true', animations_1.style({ color: 'green' })),
                    animations_1.transition('true <=> false', animations_1.animate(1234))
                ]);
                var trans = buildTransition(result, element, false, true);
                expect(trans.timelines[0].duration).toEqual(1234);
            });
            it('should match `1` and `0` given boolean values', function () {
                var result = shared_1.makeTrigger('name', [
                    animations_1.state('0', animations_1.style({ color: 'red' })), animations_1.state('1', animations_1.style({ color: 'green' })),
                    animations_1.transition('1 <=> 0', animations_1.animate(4567))
                ]);
                var trans = buildTransition(result, element, false, true);
                expect(trans.timelines[0].duration).toEqual(4567);
            });
            it('should match `true` and `false` state styles on a `1 <=> 0` boolean transition given boolean values', function () {
                var result = shared_1.makeTrigger('name', [
                    animations_1.state('false', animations_1.style({ color: 'red' })), animations_1.state('true', animations_1.style({ color: 'green' })),
                    animations_1.transition('1 <=> 0', animations_1.animate(4567))
                ]);
                var trans = buildTransition(result, element, false, true);
                expect(trans.timelines[0].keyframes).toEqual([
                    { offset: 0, color: 'red' }, { offset: 1, color: 'green' }
                ]);
            });
            it('should match `1` and `0` state styles on a `true <=> false` boolean transition given boolean values', function () {
                var result = shared_1.makeTrigger('name', [
                    animations_1.state('0', animations_1.style({ color: 'orange' })), animations_1.state('1', animations_1.style({ color: 'blue' })),
                    animations_1.transition('true <=> false', animations_1.animate(4567))
                ]);
                var trans = buildTransition(result, element, false, true);
                expect(trans.timelines[0].keyframes).toEqual([
                    { offset: 0, color: 'orange' }, { offset: 1, color: 'blue' }
                ]);
            });
            it('should treat numeric values (disguised as strings) as proper state values', function () {
                var result = shared_1.makeTrigger('name', [
                    animations_1.state(1, animations_1.style({ opacity: 0 })),
                    animations_1.state(0, animations_1.style({ opacity: 0 })), animations_1.transition('* => *', animations_1.animate(1000))
                ]);
                expect(function () {
                    var trans = buildTransition(result, element, false, true);
                }).not.toThrow();
            });
            describe('aliases', function () {
                it('should alias the :enter transition as void => *', function () {
                    var result = shared_1.makeTrigger('name', [animations_1.transition(':enter', animations_1.animate(3333))]);
                    var trans = buildTransition(result, element, 'void', 'something');
                    expect(trans.timelines[0].duration).toEqual(3333);
                });
                it('should alias the :leave transition as * => void', function () {
                    var result = shared_1.makeTrigger('name', [animations_1.transition(':leave', animations_1.animate(3333))]);
                    var trans = buildTransition(result, element, 'something', 'void');
                    expect(trans.timelines[0].duration).toEqual(3333);
                });
            });
        });
    });
}
function buildTransition(trigger, element, fromState, toState, fromOptions, toOptions) {
    var params = toOptions && toOptions.params || {};
    var trans = trigger.matchTransition(fromState, toState, element, params);
    if (trans) {
        var driver = new testing_1.MockAnimationDriver();
        return trans.build(driver, element, fromState, toState, util_1.ENTER_CLASSNAME, util_1.LEAVE_CLASSNAME, fromOptions, toOptions);
    }
    return null;
}
function buildParams(params) {
    return { params: params };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3RyaWdnZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci90ZXN0L2RzbC9hbmltYXRpb25fdHJpZ2dlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsa0RBQXdGO0FBSXhGLHVDQUFnRTtBQUNoRSx5Q0FBa0Q7QUFDbEQsb0NBQXNDO0FBRXRDO0lBQ0UsUUFBUSxDQUFDLGtCQUFrQixFQUFFO1FBQzNCLGlFQUFpRTtRQUNqRSxJQUFJLE1BQU07WUFBRSxPQUFPO1FBRW5CLElBQUksT0FBWSxDQUFDO1FBQ2pCLFVBQVUsQ0FBQztZQUNULE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBRUgsU0FBUyxDQUFDLGNBQVEsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV6RCxRQUFRLENBQUMsb0JBQW9CLEVBQUU7WUFDN0IsRUFBRSxDQUFDLHVEQUF1RCxFQUFFO2dCQUMxRCxNQUFNLENBQUM7b0JBQ0wsb0JBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyx1QkFBVSxDQUFDLE9BQU8sRUFBRSxvQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMseURBQXlELENBQUMsQ0FBQztZQUM3RSxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyx5RkFBeUYsRUFDekY7Z0JBQ0UsTUFBTSxDQUNGLGNBQVEsb0JBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyx1QkFBVSxDQUFDLHNCQUFzQixF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