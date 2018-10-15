"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var animations_1 = require("@angular/animations");
var animation_ast_builder_1 = require("../../src/dsl/animation_ast_builder");
var animation_trigger_1 = require("../../src/dsl/animation_trigger");
var animation_style_normalizer_1 = require("../../src/dsl/style_normalization/animation_style_normalizer");
var shared_1 = require("../../src/render/shared");
var transition_animation_engine_1 = require("../../src/render/transition_animation_engine");
var mock_animation_driver_1 = require("../../testing/src/mock_animation_driver");
var DEFAULT_NAMESPACE_ID = 'id';
(function () {
    var driver = new mock_animation_driver_1.MockAnimationDriver();
    // these tests are only mean't to be run within the DOM
    if (isNode)
        return;
    describe('TransitionAnimationEngine', function () {
        var element;
        beforeEach(function () {
            mock_animation_driver_1.MockAnimationDriver.log = [];
            element = document.createElement('div');
            document.body.appendChild(element);
        });
        afterEach(function () { document.body.removeChild(element); });
        function makeEngine(normalizer) {
            var engine = new transition_animation_engine_1.TransitionAnimationEngine(shared_1.getBodyNode(), driver, normalizer || new animation_style_normalizer_1.NoopAnimationStyleNormalizer());
            engine.createNamespace(DEFAULT_NAMESPACE_ID, element);
            return engine;
        }
        describe('trigger registration', function () {
            it('should ignore and not throw an error if the same trigger is registered twice', function () {
                // TODO (matsko): ask why this is avoided
                var engine = makeEngine();
                registerTrigger(element, engine, animations_1.trigger('trig', []));
                expect(function () { registerTrigger(element, engine, animations_1.trigger('trig', [])); }).not.toThrow();
            });
        });
        describe('property setting', function () {
            it('should invoke a transition based on a property change', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('myTrigger', [
                    animations_1.transition('* => *', [animations_1.style({ height: '0px' }), animations_1.animate(1000, animations_1.style({ height: '100px' }))])
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, 'myTrigger', 'value');
                engine.flush();
                expect(engine.players.length).toEqual(1);
                var player = mock_animation_driver_1.MockAnimationDriver.log.pop();
                expect(player.keyframes).toEqual([
                    { height: '0px', offset: 0 }, { height: '100px', offset: 1 }
                ]);
            });
            it('should not queue an animation if the property value has not changed at all', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('myTrigger', [
                    animations_1.transition('* => *', [animations_1.style({ height: '0px' }), animations_1.animate(1000, animations_1.style({ height: '100px' }))])
                ]);
                registerTrigger(element, engine, trig);
                engine.flush();
                expect(engine.players.length).toEqual(0);
                setProperty(element, engine, 'myTrigger', 'abc');
                engine.flush();
                expect(engine.players.length).toEqual(1);
                setProperty(element, engine, 'myTrigger', 'abc');
                engine.flush();
                expect(engine.players.length).toEqual(1);
            });
            it('should throw an error if an animation property without a matching trigger is changed', function () {
                var engine = makeEngine();
                expect(function () {
                    setProperty(element, engine, 'myTrigger', 'no');
                }).toThrowError(/The provided animation trigger "myTrigger" has not been registered!/);
            });
        });
        describe('removal operations', function () {
            it('should cleanup all inner state that\'s tied to an element once removed', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('myTrigger', [
                    animations_1.transition(':leave', [animations_1.style({ height: '0px' }), animations_1.animate(1000, animations_1.style({ height: '100px' }))])
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, 'myTrigger', 'value');
                engine.flush();
                expect(engine.elementContainsData(DEFAULT_NAMESPACE_ID, element)).toBeTruthy();
                engine.removeNode(DEFAULT_NAMESPACE_ID, element, true);
                engine.flush();
                expect(engine.elementContainsData(DEFAULT_NAMESPACE_ID, element)).toBeTruthy();
            });
            it('should create and recreate a namespace for a host element with the same component source', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('myTrigger', [animations_1.transition('* => *', animations_1.animate(1234, animations_1.style({ color: 'red' })))]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, 'myTrigger', 'value');
                engine.flush();
                expect(engine.players[0].getRealPlayer().duration)
                    .toEqual(1234);
                engine.destroy(DEFAULT_NAMESPACE_ID, null);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, 'myTrigger', 'value2');
                engine.flush();
                expect(engine.players[0].getRealPlayer().duration)
                    .toEqual(1234);
            });
        });
        describe('event listeners', function () {
            it('should listen to the onStart operation for the animation', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('myTrigger', [
                    animations_1.transition('* => *', [animations_1.style({ height: '0px' }), animations_1.animate(1000, animations_1.style({ height: '100px' }))])
                ]);
                var count = 0;
                registerTrigger(element, engine, trig);
                listen(element, engine, 'myTrigger', 'start', function () { return count++; });
                setProperty(element, engine, 'myTrigger', 'value');
                expect(count).toEqual(0);
                engine.flush();
                expect(count).toEqual(1);
            });
            it('should listen to the onDone operation for the animation', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('myTrigger', [
                    animations_1.transition('* => *', [animations_1.style({ height: '0px' }), animations_1.animate(1000, animations_1.style({ height: '100px' }))])
                ]);
                var count = 0;
                registerTrigger(element, engine, trig);
                listen(element, engine, 'myTrigger', 'done', function () { return count++; });
                setProperty(element, engine, 'myTrigger', 'value');
                expect(count).toEqual(0);
                engine.flush();
                expect(count).toEqual(0);
                engine.players[0].finish();
                expect(count).toEqual(1);
            });
            it('should throw an error when an event is listened to that isn\'t supported', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('myTrigger', []);
                registerTrigger(element, engine, trig);
                expect(function () { listen(element, engine, 'myTrigger', 'explode', function () { }); })
                    .toThrowError(/The provided animation trigger event "explode" for the animation trigger "myTrigger" is not supported!/);
            });
            it('should throw an error when an event is listened for a trigger that doesn\'t exist', function () {
                var engine = makeEngine();
                expect(function () { listen(element, engine, 'myTrigger', 'explode', function () { }); })
                    .toThrowError(/Unable to listen on the animation trigger event "explode" because the animation trigger "myTrigger" doesn\'t exist!/);
            });
            it('should throw an error when an undefined event is listened for', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('myTrigger', []);
                registerTrigger(element, engine, trig);
                expect(function () { listen(element, engine, 'myTrigger', '', function () { }); })
                    .toThrowError(/Unable to listen on the animation trigger "myTrigger" because the provided event is undefined!/);
            });
            it('should retain event listeners and call them for successive animation state changes', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('myTrigger', [animations_1.transition('* => *', [animations_1.style({ height: '0px' }), animations_1.animate(1000, animations_1.style({ height: '100px' }))])]);
                registerTrigger(element, engine, trig);
                var count = 0;
                listen(element, engine, 'myTrigger', 'start', function () { return count++; });
                setProperty(element, engine, 'myTrigger', '123');
                engine.flush();
                expect(count).toEqual(1);
                setProperty(element, engine, 'myTrigger', '456');
                engine.flush();
                expect(count).toEqual(2);
            });
            it('should only fire event listener changes for when the corresponding trigger changes state', function () {
                var engine = makeEngine();
                var trig1 = animations_1.trigger('myTrigger1', [animations_1.transition('* => 123', [animations_1.style({ height: '0px' }), animations_1.animate(1000, animations_1.style({ height: '100px' }))])]);
                registerTrigger(element, engine, trig1);
                var trig2 = animations_1.trigger('myTrigger2', [animations_1.transition('* => 123', [animations_1.style({ width: '0px' }), animations_1.animate(1000, animations_1.style({ width: '100px' }))])]);
                registerTrigger(element, engine, trig2);
                var count = 0;
                listen(element, engine, 'myTrigger1', 'start', function () { return count++; });
                setProperty(element, engine, 'myTrigger1', '123');
                engine.flush();
                expect(count).toEqual(1);
                setProperty(element, engine, 'myTrigger2', '123');
                engine.flush();
                expect(count).toEqual(1);
            });
            it('should allow a listener to be deregistered, but only after a flush occurs', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('myTrigger', [animations_1.transition('* => 123', [animations_1.style({ height: '0px' }), animations_1.animate(1000, animations_1.style({ height: '100px' }))])]);
                registerTrigger(element, engine, trig);
                var count = 0;
                var deregisterFn = listen(element, engine, 'myTrigger', 'start', function () { return count++; });
                setProperty(element, engine, 'myTrigger', '123');
                engine.flush();
                expect(count).toEqual(1);
                deregisterFn();
                engine.flush();
                setProperty(element, engine, 'myTrigger', '456');
                engine.flush();
                expect(count).toEqual(1);
            });
            it('should trigger a listener callback with an AnimationEvent argument', function () {
                var engine = makeEngine();
                registerTrigger(element, engine, animations_1.trigger('myTrigger', [
                    animations_1.transition('* => *', [animations_1.style({ height: '0px' }), animations_1.animate(1234, animations_1.style({ height: '100px' }))])
                ]));
                // we do this so that the next transition has a starting value that isn't null
                setProperty(element, engine, 'myTrigger', '123');
                engine.flush();
                var capture = null;
                listen(element, engine, 'myTrigger', 'start', function (e) { return capture = e; });
                listen(element, engine, 'myTrigger', 'done', function (e) { return capture = e; });
                setProperty(element, engine, 'myTrigger', '456');
                engine.flush();
                delete capture['_data'];
                expect(capture).toEqual({
                    element: element,
                    triggerName: 'myTrigger',
                    phaseName: 'start',
                    fromState: '123',
                    toState: '456',
                    totalTime: 1234,
                    disabled: false
                });
                capture = null;
                var player = engine.players.pop();
                player.finish();
                delete capture['_data'];
                expect(capture).toEqual({
                    element: element,
                    triggerName: 'myTrigger',
                    phaseName: 'done',
                    fromState: '123',
                    toState: '456',
                    totalTime: 1234,
                    disabled: false
                });
            });
        });
        describe('transition operations', function () {
            it('should persist the styles on the element as actual styles once the animation is complete', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('something', [
                    animations_1.state('on', animations_1.style({ height: '100px' })), animations_1.state('off', animations_1.style({ height: '0px' })),
                    animations_1.transition('on => off', animations_1.animate(9876))
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, trig.name, 'on');
                setProperty(element, engine, trig.name, 'off');
                engine.flush();
                expect(element.style.height).not.toEqual('0px');
                engine.players[0].finish();
                expect(element.style.height).toEqual('0px');
            });
            it('should remove all existing state styling from an element when a follow-up transition occurs on the same trigger', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('something', [
                    animations_1.state('a', animations_1.style({ height: '100px' })), animations_1.state('b', animations_1.style({ height: '500px' })),
                    animations_1.state('c', animations_1.style({ width: '200px' })), animations_1.transition('* => *', animations_1.animate(9876))
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, trig.name, 'a');
                setProperty(element, engine, trig.name, 'b');
                engine.flush();
                var player1 = engine.players[0];
                player1.finish();
                expect(element.style.height).toEqual('500px');
                setProperty(element, engine, trig.name, 'c');
                engine.flush();
                var player2 = engine.players[0];
                expect(element.style.height).not.toEqual('500px');
                player2.finish();
                expect(element.style.width).toEqual('200px');
                expect(element.style.height).not.toEqual('500px');
            });
            it('should allow two animation transitions with different triggers to animate in parallel', function () {
                var engine = makeEngine();
                var trig1 = animations_1.trigger('something1', [
                    animations_1.state('a', animations_1.style({ width: '100px' })), animations_1.state('b', animations_1.style({ width: '200px' })),
                    animations_1.transition('* => *', animations_1.animate(1000))
                ]);
                var trig2 = animations_1.trigger('something2', [
                    animations_1.state('x', animations_1.style({ height: '500px' })), animations_1.state('y', animations_1.style({ height: '1000px' })),
                    animations_1.transition('* => *', animations_1.animate(2000))
                ]);
                registerTrigger(element, engine, trig1);
                registerTrigger(element, engine, trig2);
                var doneCount = 0;
                function doneCallback() { doneCount++; }
                setProperty(element, engine, trig1.name, 'a');
                setProperty(element, engine, trig1.name, 'b');
                setProperty(element, engine, trig2.name, 'x');
                setProperty(element, engine, trig2.name, 'y');
                engine.flush();
                var player1 = engine.players[0];
                player1.onDone(doneCallback);
                expect(doneCount).toEqual(0);
                var player2 = engine.players[1];
                player2.onDone(doneCallback);
                expect(doneCount).toEqual(0);
                player1.finish();
                expect(doneCount).toEqual(1);
                player2.finish();
                expect(doneCount).toEqual(2);
                expect(element.style.width).toEqual('200px');
                expect(element.style.height).toEqual('1000px');
            });
            it('should cancel a previously running animation when a follow-up transition kicks off on the same trigger', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('something', [
                    animations_1.state('x', animations_1.style({ opacity: 0 })),
                    animations_1.state('y', animations_1.style({ opacity: .5 })),
                    animations_1.state('z', animations_1.style({ opacity: 1 })),
                    animations_1.transition('* => *', animations_1.animate(1000)),
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, trig.name, 'x');
                setProperty(element, engine, trig.name, 'y');
                engine.flush();
                expect(parseFloat(element.style.opacity)).not.toEqual(.5);
                var player1 = engine.players[0];
                setProperty(element, engine, trig.name, 'z');
                engine.flush();
                var player2 = engine.players[0];
                expect(parseFloat(element.style.opacity)).not.toEqual(.5);
                player2.finish();
                expect(parseFloat(element.style.opacity)).toEqual(1);
                player1.finish();
                expect(parseFloat(element.style.opacity)).toEqual(1);
            });
            it('should pass in the previously running players into the follow-up transition player when cancelled', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('something', [
                    animations_1.state('x', animations_1.style({ opacity: 0 })), animations_1.state('y', animations_1.style({ opacity: .5 })),
                    animations_1.state('z', animations_1.style({ opacity: 1 })), animations_1.transition('* => *', animations_1.animate(1000))
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, trig.name, 'x');
                setProperty(element, engine, trig.name, 'y');
                engine.flush();
                var player1 = mock_animation_driver_1.MockAnimationDriver.log.pop();
                player1.setPosition(0.5);
                setProperty(element, engine, trig.name, 'z');
                engine.flush();
                var player2 = mock_animation_driver_1.MockAnimationDriver.log.pop();
                expect(player2.previousPlayers).toEqual([player1]);
                player2.finish();
                setProperty(element, engine, trig.name, 'x');
                engine.flush();
                var player3 = mock_animation_driver_1.MockAnimationDriver.log.pop();
                expect(player3.previousPlayers).toEqual([]);
            });
            it('should cancel all existing players if a removal animation is set to occur', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('something', [
                    animations_1.state('m', animations_1.style({ opacity: 0 })), animations_1.state('n', animations_1.style({ opacity: 1 })),
                    animations_1.transition('* => *', animations_1.animate(1000))
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, trig.name, 'm');
                setProperty(element, engine, trig.name, 'n');
                engine.flush();
                var doneCount = 0;
                function doneCallback() { doneCount++; }
                var player1 = engine.players[0];
                player1.onDone(doneCallback);
                expect(doneCount).toEqual(0);
                setProperty(element, engine, trig.name, 'void');
                engine.flush();
                expect(doneCount).toEqual(1);
            });
            it('should only persist styles that exist in the final state styles and not the last keyframe', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('something', [
                    animations_1.state('0', animations_1.style({ width: '0px' })), animations_1.state('1', animations_1.style({ width: '100px' })),
                    animations_1.transition('* => *', [animations_1.animate(1000, animations_1.style({ height: '200px' }))])
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, trig.name, '0');
                setProperty(element, engine, trig.name, '1');
                engine.flush();
                var player = engine.players[0];
                expect(element.style.width).not.toEqual('100px');
                player.finish();
                expect(element.style.height).not.toEqual('200px');
                expect(element.style.width).toEqual('100px');
            });
            it('should default to using styling from the `*` state if a matching state is not found', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('something', [
                    animations_1.state('a', animations_1.style({ opacity: 0 })), animations_1.state('*', animations_1.style({ opacity: .5 })),
                    animations_1.transition('* => *', animations_1.animate(1000))
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, trig.name, 'a');
                setProperty(element, engine, trig.name, 'z');
                engine.flush();
                engine.players[0].finish();
                expect(parseFloat(element.style.opacity)).toEqual(.5);
            });
            it('should treat `void` as `void`', function () {
                var engine = makeEngine();
                var trig = animations_1.trigger('something', [
                    animations_1.state('a', animations_1.style({ opacity: 0 })), animations_1.state('void', animations_1.style({ opacity: .8 })),
                    animations_1.transition('* => *', animations_1.animate(1000))
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, trig.name, 'a');
                setProperty(element, engine, trig.name, 'void');
                engine.flush();
                engine.players[0].finish();
                expect(parseFloat(element.style.opacity)).toEqual(.8);
            });
        });
        describe('style normalizer', function () {
            it('should normalize the style values that are animateTransitioned within an a transition animation', function () {
                var engine = makeEngine(new SuffixNormalizer('-normalized'));
                var trig = animations_1.trigger('something', [
                    animations_1.state('on', animations_1.style({ height: 100 })), animations_1.state('off', animations_1.style({ height: 0 })),
                    animations_1.transition('on => off', animations_1.animate(9876))
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, trig.name, 'on');
                setProperty(element, engine, trig.name, 'off');
                engine.flush();
                var player = mock_animation_driver_1.MockAnimationDriver.log.pop();
                expect(player.keyframes).toEqual([
                    { 'height-normalized': '100-normalized', offset: 0 },
                    { 'height-normalized': '0-normalized', offset: 1 }
                ]);
            });
            it('should throw an error when normalization fails within a transition animation', function () {
                var engine = makeEngine(new ExactCssValueNormalizer({ left: '100px' }));
                var trig = animations_1.trigger('something', [
                    animations_1.state('a', animations_1.style({ left: '0px', width: '200px' })),
                    animations_1.state('b', animations_1.style({ left: '100px', width: '100px' })), animations_1.transition('a => b', animations_1.animate(9876))
                ]);
                registerTrigger(element, engine, trig);
                setProperty(element, engine, trig.name, 'a');
                setProperty(element, engine, trig.name, 'b');
                var errorMessage = '';
                try {
                    engine.flush();
                }
                catch (e) {
                    errorMessage = e.toString();
                }
                expect(errorMessage).toMatch(/Unable to animate due to the following errors:/);
                expect(errorMessage).toMatch(/- The CSS property `left` is not allowed to be `0px`/);
                expect(errorMessage).toMatch(/- The CSS property `width` is not allowed/);
            });
        });
        describe('view operations', function () {
            it('should perform insert operations immediately ', function () {
                var engine = makeEngine();
                var child1 = document.createElement('div');
                var child2 = document.createElement('div');
                element.appendChild(child1);
                element.appendChild(child2);
                element.appendChild(child1);
                engine.insertNode(DEFAULT_NAMESPACE_ID, child1, element, true);
                element.appendChild(child2);
                engine.insertNode(DEFAULT_NAMESPACE_ID, child2, element, true);
                expect(element.contains(child1)).toBe(true);
                expect(element.contains(child2)).toBe(true);
            });
            it('should not throw an error if a missing namespace is used', function () {
                var engine = makeEngine();
                var ID = 'foo';
                var TRIGGER = 'fooTrigger';
                expect(function () { engine.trigger(ID, element, TRIGGER, 'something'); }).not.toThrow();
            });
            it('should still apply state-styling to an element even if it is not yet inserted into the DOM', function () {
                var engine = makeEngine();
                var orphanElement = document.createElement('div');
                orphanElement.classList.add('orphan');
                registerTrigger(orphanElement, engine, animations_1.trigger('trig', [
                    animations_1.state('go', animations_1.style({ opacity: 0.5 })), animations_1.transition('* => go', animations_1.animate(1000))
                ]));
                setProperty(orphanElement, engine, 'trig', 'go');
                engine.flush();
                expect(engine.players.length).toEqual(0);
                expect(orphanElement.style.opacity).toEqual('0.5');
            });
        });
    });
})();
var SuffixNormalizer = /** @class */ (function (_super) {
    __extends(SuffixNormalizer, _super);
    function SuffixNormalizer(_suffix) {
        var _this = _super.call(this) || this;
        _this._suffix = _suffix;
        return _this;
    }
    SuffixNormalizer.prototype.normalizePropertyName = function (propertyName, errors) {
        return propertyName + this._suffix;
    };
    SuffixNormalizer.prototype.normalizeStyleValue = function (userProvidedProperty, normalizedProperty, value, errors) {
        return value + this._suffix;
    };
    return SuffixNormalizer;
}(animation_style_normalizer_1.AnimationStyleNormalizer));
var ExactCssValueNormalizer = /** @class */ (function (_super) {
    __extends(ExactCssValueNormalizer, _super);
    function ExactCssValueNormalizer(_allowedValues) {
        var _this = _super.call(this) || this;
        _this._allowedValues = _allowedValues;
        return _this;
    }
    ExactCssValueNormalizer.prototype.normalizePropertyName = function (propertyName, errors) {
        if (!this._allowedValues[propertyName]) {
            errors.push("The CSS property `" + propertyName + "` is not allowed");
        }
        return propertyName;
    };
    ExactCssValueNormalizer.prototype.normalizeStyleValue = function (userProvidedProperty, normalizedProperty, value, errors) {
        var expectedValue = this._allowedValues[userProvidedProperty];
        if (expectedValue != value) {
            errors.push("The CSS property `" + userProvidedProperty + "` is not allowed to be `" + value + "`");
        }
        return expectedValue;
    };
    return ExactCssValueNormalizer;
}(animation_style_normalizer_1.AnimationStyleNormalizer));
function registerTrigger(element, engine, metadata, id) {
    if (id === void 0) { id = DEFAULT_NAMESPACE_ID; }
    var errors = [];
    var driver = new mock_animation_driver_1.MockAnimationDriver();
    var name = metadata.name;
    var ast = animation_ast_builder_1.buildAnimationAst(driver, metadata, errors);
    if (errors.length) {
    }
    var trigger = animation_trigger_1.buildTrigger(name, ast);
    engine.register(id, element);
    engine.registerTrigger(id, name, trigger);
}
function setProperty(element, engine, property, value, id) {
    if (id === void 0) { id = DEFAULT_NAMESPACE_ID; }
    engine.trigger(id, element, property, value);
}
function listen(element, engine, eventName, phaseName, callback, id) {
    if (id === void 0) { id = DEFAULT_NAMESPACE_ID; }
    return engine.listen(id, element, eventName, phaseName, callback);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNpdGlvbl9hbmltYXRpb25fZW5naW5lX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvdGVzdC9yZW5kZXIvdHJhbnNpdGlvbl9hbmltYXRpb25fZW5naW5lX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsa0RBQWlLO0FBR2pLLDZFQUFzRTtBQUN0RSxxRUFBNkQ7QUFDN0QsMkdBQW9JO0FBQ3BJLGtEQUFvRDtBQUNwRCw0RkFBdUY7QUFDdkYsaUZBQWlHO0FBRWpHLElBQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDO0FBRWxDLENBQUM7SUFDQyxJQUFNLE1BQU0sR0FBRyxJQUFJLDJDQUFtQixFQUFFLENBQUM7SUFFekMsdURBQXVEO0lBQ3ZELElBQUksTUFBTTtRQUFFLE9BQU87SUFFbkIsUUFBUSxDQUFDLDJCQUEyQixFQUFFO1FBQ3BDLElBQUksT0FBWSxDQUFDO1FBRWpCLFVBQVUsQ0FBQztZQUNULDJDQUFtQixDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDN0IsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7UUFFSCxTQUFTLENBQUMsY0FBUSxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXpELG9CQUFvQixVQUFxQztZQUN2RCxJQUFNLE1BQU0sR0FBRyxJQUFJLHVEQUF5QixDQUN4QyxvQkFBVyxFQUFFLEVBQUUsTUFBTSxFQUFFLFVBQVUsSUFBSSxJQUFJLHlEQUE0QixFQUFFLENBQUMsQ0FBQztZQUM3RSxNQUFNLENBQUMsZUFBZSxDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3RELE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUM7UUFFRCxRQUFRLENBQUMsc0JBQXNCLEVBQUU7WUFDL0IsRUFBRSxDQUFDLDhFQUE4RSxFQUFFO2dCQUNqRix5Q0FBeUM7Z0JBQ3pDLElBQU0sTUFBTSxHQUFHLFVBQVUsRUFBRSxDQUFDO2dCQUM1QixlQUFlLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxvQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN0RCxNQUFNLENBQUMsY0FBUSxlQUFlLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxvQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3pGLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsa0JBQWtCLEVBQUU7WUFDM0IsRUFBRSxDQUFDLHVEQUF1RCxFQUFFO2dCQUMxRCxJQUFNLE1BQU0sR0FBRyxVQUFVLEVBQUUsQ0FBQztnQkFDNUIsSUFBTSxJQUFJLEdBQUcsb0JBQU8sQ0FBQyxXQUFXLEVBQUU7b0JBQ2hDLHVCQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsa0JBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFFLG9CQUFPLENBQUMsSUFBSSxFQUFFLGtCQUFLLENBQUMsRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3hGLENBQUMsQ0FBQztnQkFFSCxlQUFlLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdkMsV0FBVyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNuRCxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUV6QyxJQUFNLE1BQU0sR0FBRywyQ0FBbUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUF5QixDQUFDO2dCQUNwRSxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztvQkFDL0IsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUMsRUFBRSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztpQkFDekQsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsNEVBQTRFLEVBQUU7Z0JBQy9FLElBQU0sTUFBTSxHQUFHLFVBQVUsRUFBRSxDQUFDO2dCQUU1QixJQUFNLElBQUksR0FBRyxvQkFBTyxDQUFDLFdBQVcsRUFBRTtvQkFDaEMsdUJBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxrQkFBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUUsb0JBQU8sQ0FBQyxJQUFJLEVBQUUsa0JBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDeEYsQ0FBQyxDQUFDO2dCQUVILGVBQWUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUV6QyxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ2pELE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDZixNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRXpDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDakQsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNmLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQyxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxzRkFBc0YsRUFDdEY7Z0JBQ0UsSUFBTSxNQUFNLEdBQUcsVUFBVSxFQUFFLENBQUM7Z0JBQzVCLE1BQU0sQ0FBQztvQkFDTCxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2xELENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxxRUFBcUUsQ0FBQyxDQUFDO1lBQ3pGLENBQUMsQ0FBQyxDQUFDO1FBQ1IsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsb0JBQW9CLEVBQUU7WUFDN0IsRUFBRSxDQUFDLHdFQUF3RSxFQUFFO2dCQUMzRSxJQUFNLE1BQU0sR0FBRyxVQUFVLEVBQUUsQ0FBQztnQkFFNUIsSUFBTSxJQUFJLEdBQUcsb0JBQU8sQ0FBQyxXQUFXLEVBQUU7b0JBQ2hDLHVCQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsa0JBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFFLG9CQUFPLENBQUMsSUFBSSxFQUFFLGtCQUFLLENBQUMsRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3hGLENBQUMsQ0FBQztnQkFFSCxlQUFlLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdkMsV0FBVyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNuRCxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBRWYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUUvRSxNQUFNLENBQUMsVUFBVSxDQUFDLG9CQUFvQixFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdkQsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUVmLE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsb0JBQW9CLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNqRixDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywwRkFBMEYsRUFDMUY7Z0JBQ0UsSUFBTSxNQUFNLEdBQUcsVUFBVSxFQUFFLENBQUM7Z0JBRTVCLElBQU0sSUFBSSxHQUNOLG9CQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsdUJBQVUsQ0FBQyxRQUFRLEVBQUUsb0JBQU8sQ0FBQyxJQUFJLEVBQUUsa0JBQUssQ0FBQyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRXZGLGVBQWUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ25ELE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDZixNQUFNLENBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQTBCLENBQUMsUUFBUSxDQUFDO3FCQUN0RSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRW5CLE1BQU0sQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRTNDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ3BELE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDZixNQUFNLENBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQTBCLENBQUMsUUFBUSxDQUFDO3FCQUN0RSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckIsQ0FBQyxDQUFDLENBQUM7UUFDUixDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtZQUMxQixFQUFFLENBQUMsMERBQTBELEVBQUU7Z0JBQzdELElBQU0sTUFBTSxHQUFHLFVBQVUsRUFBRSxDQUFDO2dCQUU1QixJQUFNLElBQUksR0FBRyxvQkFBTyxDQUFDLFdBQVcsRUFBRTtvQkFDaEMsdUJBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxrQkFBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUUsb0JBQU8sQ0FBQyxJQUFJLEVBQUUsa0JBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDeEYsQ0FBQyxDQUFDO2dCQUVILElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDZCxlQUFlLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdkMsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxjQUFNLE9BQUEsS0FBSyxFQUFFLEVBQVAsQ0FBTyxDQUFDLENBQUM7Z0JBQzdELFdBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDbkQsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFekIsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNmLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMseURBQXlELEVBQUU7Z0JBQzVELElBQU0sTUFBTSxHQUFHLFVBQVUsRUFBRSxDQUFDO2dCQUU1QixJQUFNLElBQUksR0FBRyxvQkFBTyxDQUFDLFdBQVcsRUFBRTtvQkFDaEMsdUJBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxrQkFBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUUsb0JBQU8sQ0FBQyxJQUFJLEVBQUUsa0JBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDeEYsQ0FBQyxDQUFDO2dCQUVILElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDZCxlQUFlLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdkMsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxjQUFNLE9BQUEsS0FBSyxFQUFFLEVBQVAsQ0FBTyxDQUFDLENBQUM7Z0JBQzVELFdBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDbkQsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFekIsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNmLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRXpCLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQzNCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsMEVBQTBFLEVBQUU7Z0JBQzdFLElBQU0sTUFBTSxHQUFHLFVBQVUsRUFBRSxDQUFDO2dCQUM1QixJQUFNLElBQUksR0FBRyxvQkFBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDdEMsZUFBZSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRXZDLE1BQU0sQ0FBQyxjQUFRLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsY0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDdkUsWUFBWSxDQUNULHdHQUF3RyxDQUFDLENBQUM7WUFDcEgsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsbUZBQW1GLEVBQUU7Z0JBQ3RGLElBQU0sTUFBTSxHQUFHLFVBQVUsRUFBRSxDQUFDO2dCQUM1QixNQUFNLENBQUMsY0FBUSxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLGNBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3ZFLFlBQVksQ0FDVCxxSEFBcUgsQ0FBQyxDQUFDO1lBQ2pJLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLCtEQUErRCxFQUFFO2dCQUNsRSxJQUFNLE1BQU0sR0FBRyxVQUFVLEVBQUUsQ0FBQztnQkFDNUIsSUFBTSxJQUFJLEdBQUcsb0JBQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ3RDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxNQUFNLENBQUMsY0FBUSxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLGNBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ2hFLFlBQVksQ0FDVCxnR0FBZ0csQ0FBQyxDQUFDO1lBQzVHLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLG9GQUFvRixFQUNwRjtnQkFDRSxJQUFNLE1BQU0sR0FBRyxVQUFVLEVBQUUsQ0FBQztnQkFDNUIsSUFBTSxJQUFJLEdBQUcsb0JBQU8sQ0FDaEIsV0FBVyxFQUNYLENBQUMsdUJBQVUsQ0FDUCxRQUFRLEVBQUUsQ0FBQyxrQkFBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUUsb0JBQU8sQ0FBQyxJQUFJLEVBQUUsa0JBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFdkYsZUFBZSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRXZDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDZCxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLGNBQU0sT0FBQSxLQUFLLEVBQUUsRUFBUCxDQUFPLENBQUMsQ0FBQztnQkFFN0QsV0FBVyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNqRCxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2YsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFekIsV0FBVyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNqRCxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2YsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUMsQ0FBQztZQUVOLEVBQUUsQ0FBQywwRkFBMEYsRUFDMUY7Z0JBQ0UsSUFBTSxNQUFNLEdBQUcsVUFBVSxFQUFFLENBQUM7Z0JBQzVCLElBQU0sS0FBSyxHQUFHLG9CQUFPLENBQ2pCLFlBQVksRUFDWixDQUFDLHVCQUFVLENBQ1AsVUFBVSxFQUFFLENBQUMsa0JBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFFLG9CQUFPLENBQUMsSUFBSSxFQUFFLGtCQUFLLENBQUMsRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pGLGVBQWUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUV4QyxJQUFNLEtBQUssR0FBRyxvQkFBTyxDQUNqQixZQUFZLEVBQ1osQ0FBQyx1QkFBVSxDQUNQLFVBQVUsRUFBRSxDQUFDLGtCQUFLLENBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBRSxvQkFBTyxDQUFDLElBQUksRUFBRSxrQkFBSyxDQUFDLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2RixlQUFlLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFFeEMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNkLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsY0FBTSxPQUFBLEtBQUssRUFBRSxFQUFQLENBQU8sQ0FBQyxDQUFDO2dCQUU5RCxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ2xELE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDZixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUV6QixXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ2xELE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDZixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxDQUFDO1lBRU4sRUFBRSxDQUFDLDJFQUEyRSxFQUFFO2dCQUM5RSxJQUFNLE1BQU0sR0FBRyxVQUFVLEVBQUUsQ0FBQztnQkFDNUIsSUFBTSxJQUFJLEdBQUcsb0JBQU8sQ0FDaEIsV0FBVyxFQUNYLENBQUMsdUJBQVUsQ0FDUCxVQUFVLEVBQUUsQ0FBQyxrQkFBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUUsb0JBQU8sQ0FBQyxJQUFJLEVBQUUsa0JBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekYsZUFBZSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRXZDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDZCxJQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLGNBQU0sT0FBQSxLQUFLLEVBQUUsRUFBUCxDQUFPLENBQUMsQ0FBQztnQkFDbEYsV0FBVyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNqRCxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2YsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFekIsWUFBWSxFQUFFLENBQUM7Z0JBQ2YsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUVmLFdBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDakQsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNmLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsb0VBQW9FLEVBQUU7Z0JBQ3ZFLElBQU0sTUFBTSxHQUFHLFVBQVUsRUFBRSxDQUFDO2dCQUM1QixlQUFlLENBQ1gsT0FBTyxFQUFFLE1BQU0sRUFBRSxvQkFBTyxDQUFDLFdBQVcsRUFBRTtvQkFDcEMsdUJBQVUsQ0FDTixRQUFRLEVBQUUsQ0FBQyxrQkFBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUUsb0JBQU8sQ0FBQyxJQUFJLEVBQUUsa0JBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDakYsQ0FBQyxDQUFDLENBQUM7Z0JBRVIsOEVBQThFO2dCQUM5RSxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ2pELE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFFZixJQUFJLE9BQU8sR0FBbUIsSUFBTSxDQUFDO2dCQUNyQyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsT0FBTyxHQUFHLENBQUMsRUFBWCxDQUFXLENBQUMsQ0FBQztnQkFDaEUsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxVQUFBLENBQUMsSUFBSSxPQUFBLE9BQU8sR0FBRyxDQUFDLEVBQVgsQ0FBVyxDQUFDLENBQUM7Z0JBQy9ELFdBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDakQsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUVmLE9BQVEsT0FBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNqQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDO29CQUN0QixPQUFPLFNBQUE7b0JBQ1AsV0FBVyxFQUFFLFdBQVc7b0JBQ3hCLFNBQVMsRUFBRSxPQUFPO29CQUNsQixTQUFTLEVBQUUsS0FBSztvQkFDaEIsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsU0FBUyxFQUFFLElBQUk7b0JBQ2YsUUFBUSxFQUFFLEtBQUs7aUJBQ2hCLENBQUMsQ0FBQztnQkFFSCxPQUFPLEdBQUcsSUFBTSxDQUFDO2dCQUNqQixJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBSSxDQUFDO2dCQUN0QyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBRWhCLE9BQVEsT0FBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNqQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDO29CQUN0QixPQUFPLFNBQUE7b0JBQ1AsV0FBVyxFQUFFLFdBQVc7b0JBQ3hCLFNBQVMsRUFBRSxNQUFNO29CQUNqQixTQUFTLEVBQUUsS0FBSztvQkFDaEIsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsU0FBUyxFQUFFLElBQUk7b0JBQ2YsUUFBUSxFQUFFLEtBQUs7aUJBQ2hCLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsdUJBQXVCLEVBQUU7WUFDaEMsRUFBRSxDQUFDLDBGQUEwRixFQUMxRjtnQkFDRSxJQUFNLE1BQU0sR0FBRyxVQUFVLEVBQUUsQ0FBQztnQkFDNUIsSUFBTSxJQUFJLEdBQUcsb0JBQU8sQ0FBQyxXQUFXLEVBQUU7b0JBQ2hDLGtCQUFLLENBQUMsSUFBSSxFQUFFLGtCQUFLLENBQUMsRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxFQUFFLGtCQUFLLENBQUMsS0FBSyxFQUFFLGtCQUFLLENBQUMsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztvQkFDM0UsdUJBQVUsQ0FBQyxXQUFXLEVBQUUsb0JBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDdkMsQ0FBQyxDQUFDO2dCQUVILGVBQWUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUM5QyxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMvQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBRWYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDaEQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlDLENBQUMsQ0FBQyxDQUFDO1lBRU4sRUFBRSxDQUFDLGlIQUFpSCxFQUNqSDtnQkFDRSxJQUFNLE1BQU0sR0FBRyxVQUFVLEVBQUUsQ0FBQztnQkFDNUIsSUFBTSxJQUFJLEdBQUcsb0JBQU8sQ0FBQyxXQUFXLEVBQUU7b0JBQ2hDLGtCQUFLLENBQUMsR0FBRyxFQUFFLGtCQUFLLENBQUMsRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxFQUFFLGtCQUFLLENBQUMsR0FBRyxFQUFFLGtCQUFLLENBQUMsRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztvQkFDMUUsa0JBQUssQ0FBQyxHQUFHLEVBQUUsa0JBQUssQ0FBQyxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLEVBQUUsdUJBQVUsQ0FBQyxRQUFRLEVBQUUsb0JBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDekUsQ0FBQyxDQUFDO2dCQUVILGVBQWUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QyxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBRWYsSUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNqQixNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBRTlDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzdDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFFZixJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNsRCxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDN0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwRCxDQUFDLENBQUMsQ0FBQztZQUVOLEVBQUUsQ0FBQyx1RkFBdUYsRUFDdkY7Z0JBQ0UsSUFBTSxNQUFNLEdBQUcsVUFBVSxFQUFFLENBQUM7Z0JBQzVCLElBQU0sS0FBSyxHQUFHLG9CQUFPLENBQUMsWUFBWSxFQUFFO29CQUNsQyxrQkFBSyxDQUFDLEdBQUcsRUFBRSxrQkFBSyxDQUFDLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsRUFBRSxrQkFBSyxDQUFDLEdBQUcsRUFBRSxrQkFBSyxDQUFDLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7b0JBQ3hFLHVCQUFVLENBQUMsUUFBUSxFQUFFLG9CQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3BDLENBQUMsQ0FBQztnQkFFSCxJQUFNLEtBQUssR0FBRyxvQkFBTyxDQUFDLFlBQVksRUFBRTtvQkFDbEMsa0JBQUssQ0FBQyxHQUFHLEVBQUUsa0JBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLEVBQUUsa0JBQUssQ0FBQyxHQUFHLEVBQUUsa0JBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO29CQUMzRSx1QkFBVSxDQUFDLFFBQVEsRUFBRSxvQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNwQyxDQUFDLENBQUM7Z0JBRUgsZUFBZSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ3hDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUV4QyxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xCLDBCQUEwQixTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBRXhDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzlDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzlDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzlDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzlDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFFZixJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBRyxDQUFDO2dCQUNwQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUM3QixNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUU3QixJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBRyxDQUFDO2dCQUNwQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUM3QixNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUU3QixPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRTdCLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDakIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFN0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUM3QyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDakQsQ0FBQyxDQUFDLENBQUM7WUFFTixFQUFFLENBQUMsd0dBQXdHLEVBQ3hHO2dCQUNFLElBQU0sTUFBTSxHQUFHLFVBQVUsRUFBRSxDQUFDO2dCQUM1QixJQUFNLElBQUksR0FBRyxvQkFBTyxDQUFDLFdBQVcsRUFBRTtvQkFDaEMsa0JBQUssQ0FBQyxHQUFHLEVBQUUsa0JBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO29CQUMvQixrQkFBSyxDQUFDLEdBQUcsRUFBRSxrQkFBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUM7b0JBQ2hDLGtCQUFLLENBQUMsR0FBRyxFQUFFLGtCQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztvQkFDL0IsdUJBQVUsQ0FBQyxRQUFRLEVBQUUsb0JBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDcEMsQ0FBQyxDQUFDO2dCQUVILGVBQWUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QyxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBRWYsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFFMUQsSUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsV0FBVyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDN0MsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUVmLElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRWxDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBRTFELE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDakIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVyRCxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2RCxDQUFDLENBQUMsQ0FBQztZQUVOLEVBQUUsQ0FBQyxtR0FBbUcsRUFDbkc7Z0JBQ0UsSUFBTSxNQUFNLEdBQUcsVUFBVSxFQUFFLENBQUM7Z0JBQzVCLElBQU0sSUFBSSxHQUFHLG9CQUFPLENBQUMsV0FBVyxFQUFFO29CQUNoQyxrQkFBSyxDQUFDLEdBQUcsRUFBRSxrQkFBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBRSxrQkFBSyxDQUFDLEdBQUcsRUFBRSxrQkFBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUM7b0JBQ2pFLGtCQUFLLENBQUMsR0FBRyxFQUFFLGtCQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFFLHVCQUFVLENBQUMsUUFBUSxFQUFFLG9CQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3JFLENBQUMsQ0FBQztnQkFFSCxlQUFlLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdkMsV0FBVyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDN0MsV0FBVyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDN0MsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUVmLElBQU0sT0FBTyxHQUFHLDJDQUFtQixDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQTBCLENBQUM7Z0JBQ3RFLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRXpCLFdBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzdDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFFZixJQUFNLE9BQU8sR0FBRywyQ0FBbUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUEwQixDQUFDO2dCQUN0RSxNQUFNLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ25ELE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFFakIsV0FBVyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDN0MsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUVmLElBQU0sT0FBTyxHQUFHLDJDQUFtQixDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQTBCLENBQUM7Z0JBQ3RFLE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzlDLENBQUMsQ0FBQyxDQUFDO1lBRU4sRUFBRSxDQUFDLDJFQUEyRSxFQUFFO2dCQUM5RSxJQUFNLE1BQU0sR0FBRyxVQUFVLEVBQUUsQ0FBQztnQkFDNUIsSUFBTSxJQUFJLEdBQUcsb0JBQU8sQ0FBQyxXQUFXLEVBQUU7b0JBQ2hDLGtCQUFLLENBQUMsR0FBRyxFQUFFLGtCQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFFLGtCQUFLLENBQUMsR0FBRyxFQUFFLGtCQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztvQkFDaEUsdUJBQVUsQ0FBQyxRQUFRLEVBQUUsb0JBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDcEMsQ0FBQyxDQUFDO2dCQUVILGVBQWUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QyxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBRWYsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQiwwQkFBMEIsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUV4QyxJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUU3QixNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUU3QixXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUNoRCxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBRWYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywyRkFBMkYsRUFDM0Y7Z0JBQ0UsSUFBTSxNQUFNLEdBQUcsVUFBVSxFQUFFLENBQUM7Z0JBQzVCLElBQU0sSUFBSSxHQUFHLG9CQUFPLENBQUMsV0FBVyxFQUFFO29CQUNoQyxrQkFBSyxDQUFDLEdBQUcsRUFBRSxrQkFBSyxDQUFDLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsRUFBRSxrQkFBSyxDQUFDLEdBQUcsRUFBRSxrQkFBSyxDQUFDLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7b0JBQ3RFLHVCQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsb0JBQU8sQ0FBQyxJQUFJLEVBQUUsa0JBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDaEUsQ0FBQyxDQUFDO2dCQUVILGVBQWUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QyxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBRWYsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUcsQ0FBQztnQkFDbkMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFakQsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNoQixNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNsRCxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDL0MsQ0FBQyxDQUFDLENBQUM7WUFFTixFQUFFLENBQUMscUZBQXFGLEVBQ3JGO2dCQUNFLElBQU0sTUFBTSxHQUFHLFVBQVUsRUFBRSxDQUFDO2dCQUM1QixJQUFNLElBQUksR0FBRyxvQkFBTyxDQUFDLFdBQVcsRUFBRTtvQkFDaEMsa0JBQUssQ0FBQyxHQUFHLEVBQUUsa0JBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUUsa0JBQUssQ0FBQyxHQUFHLEVBQUUsa0JBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDO29CQUNqRSx1QkFBVSxDQUFDLFFBQVEsRUFBRSxvQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNwQyxDQUFDLENBQUM7Z0JBRUgsZUFBZSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzdDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzdDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFFZixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUMzQixNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDeEQsQ0FBQyxDQUFDLENBQUM7WUFFTixFQUFFLENBQUMsK0JBQStCLEVBQUU7Z0JBQ2xDLElBQU0sTUFBTSxHQUFHLFVBQVUsRUFBRSxDQUFDO2dCQUM1QixJQUFNLElBQUksR0FBRyxvQkFBTyxDQUFDLFdBQVcsRUFBRTtvQkFDaEMsa0JBQUssQ0FBQyxHQUFHLEVBQUUsa0JBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUUsa0JBQUssQ0FBQyxNQUFNLEVBQUUsa0JBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDO29CQUNwRSx1QkFBVSxDQUFDLFFBQVEsRUFBRSxvQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNwQyxDQUFDLENBQUM7Z0JBRUgsZUFBZSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzdDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ2hELE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFFZixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUMzQixNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDeEQsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtZQUMzQixFQUFFLENBQUMsaUdBQWlHLEVBQ2pHO2dCQUNFLElBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBRS9ELElBQU0sSUFBSSxHQUFHLG9CQUFPLENBQUMsV0FBVyxFQUFFO29CQUNoQyxrQkFBSyxDQUFDLElBQUksRUFBRSxrQkFBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBRSxrQkFBSyxDQUFDLEtBQUssRUFBRSxrQkFBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7b0JBQ25FLHVCQUFVLENBQUMsV0FBVyxFQUFFLG9CQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3ZDLENBQUMsQ0FBQztnQkFFSCxlQUFlLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdkMsV0FBVyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDOUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDL0MsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUVmLElBQU0sTUFBTSxHQUFHLDJDQUFtQixDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQXlCLENBQUM7Z0JBQ3BFLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDO29CQUMvQixFQUFDLG1CQUFtQixFQUFFLGdCQUFnQixFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUM7b0JBQ2xELEVBQUMsbUJBQW1CLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUM7aUJBQ2pELENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRU4sRUFBRSxDQUFDLDhFQUE4RSxFQUFFO2dCQUNqRixJQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsSUFBSSx1QkFBdUIsQ0FBQyxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRXhFLElBQU0sSUFBSSxHQUFHLG9CQUFPLENBQUMsV0FBVyxFQUFFO29CQUNoQyxrQkFBSyxDQUFDLEdBQUcsRUFBRSxrQkFBSyxDQUFDLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztvQkFDaEQsa0JBQUssQ0FBQyxHQUFHLEVBQUUsa0JBQUssQ0FBQyxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsRUFBRSx1QkFBVSxDQUFDLFFBQVEsRUFBRSxvQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUN4RixDQUFDLENBQUM7Z0JBRUgsZUFBZSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzdDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBRTdDLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQztnQkFDdEIsSUFBSTtvQkFDRixNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7aUJBQ2hCO2dCQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUNWLFlBQVksR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7aUJBQzdCO2dCQUVELE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0RBQWdELENBQUMsQ0FBQztnQkFDL0UsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO2dCQUNyRixNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7WUFDNUUsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtZQUMxQixFQUFFLENBQUMsK0NBQStDLEVBQUU7Z0JBQ2xELElBQU0sTUFBTSxHQUFHLFVBQVUsRUFBRSxDQUFDO2dCQUU1QixJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM3QyxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM3QyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM1QixPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUU1QixPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM1QixNQUFNLENBQUMsVUFBVSxDQUFDLG9CQUFvQixFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQy9ELE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzVCLE1BQU0sQ0FBQyxVQUFVLENBQUMsb0JBQW9CLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFFL0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzVDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzlDLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDBEQUEwRCxFQUFFO2dCQUM3RCxJQUFNLE1BQU0sR0FBRyxVQUFVLEVBQUUsQ0FBQztnQkFDNUIsSUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDO2dCQUNqQixJQUFNLE9BQU8sR0FBRyxZQUFZLENBQUM7Z0JBQzdCLE1BQU0sQ0FBQyxjQUFRLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDckYsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsNEZBQTRGLEVBQzVGO2dCQUNFLElBQU0sTUFBTSxHQUFHLFVBQVUsRUFBRSxDQUFDO2dCQUM1QixJQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNwRCxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFdEMsZUFBZSxDQUNYLGFBQWEsRUFBRSxNQUFNLEVBQUUsb0JBQU8sQ0FBQyxNQUFNLEVBQUU7b0JBQ3JDLGtCQUFLLENBQUMsSUFBSSxFQUFFLGtCQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFFLHVCQUFVLENBQUMsU0FBUyxFQUFFLG9CQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3pFLENBQUMsQ0FBQyxDQUFDO2dCQUVSLFdBQVcsQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDakQsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNmLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JELENBQUMsQ0FBQyxDQUFDO1FBQ1IsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFFTDtJQUErQixvQ0FBd0I7SUFDckQsMEJBQW9CLE9BQWU7UUFBbkMsWUFBdUMsaUJBQU8sU0FBRztRQUE3QixhQUFPLEdBQVAsT0FBTyxDQUFROztJQUFhLENBQUM7SUFFakQsZ0RBQXFCLEdBQXJCLFVBQXNCLFlBQW9CLEVBQUUsTUFBZ0I7UUFDMUQsT0FBTyxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUNyQyxDQUFDO0lBRUQsOENBQW1CLEdBQW5CLFVBQ0ksb0JBQTRCLEVBQUUsa0JBQTBCLEVBQUUsS0FBb0IsRUFDOUUsTUFBZ0I7UUFDbEIsT0FBTyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUM5QixDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBWkQsQ0FBK0IscURBQXdCLEdBWXREO0FBRUQ7SUFBc0MsMkNBQXdCO0lBQzVELGlDQUFvQixjQUF5QztRQUE3RCxZQUFpRSxpQkFBTyxTQUFHO1FBQXZELG9CQUFjLEdBQWQsY0FBYyxDQUEyQjs7SUFBYSxDQUFDO0lBRTNFLHVEQUFxQixHQUFyQixVQUFzQixZQUFvQixFQUFFLE1BQWdCO1FBQzFELElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ3RDLE1BQU0sQ0FBQyxJQUFJLENBQUMsdUJBQXNCLFlBQVkscUJBQW1CLENBQUMsQ0FBQztTQUNwRTtRQUNELE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxxREFBbUIsR0FBbkIsVUFDSSxvQkFBNEIsRUFBRSxrQkFBMEIsRUFBRSxLQUFvQixFQUM5RSxNQUFnQjtRQUNsQixJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDaEUsSUFBSSxhQUFhLElBQUksS0FBSyxFQUFFO1lBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsdUJBQXNCLG9CQUFvQixnQ0FBNkIsS0FBSyxNQUFJLENBQUMsQ0FBQztTQUMvRjtRQUNELE9BQU8sYUFBYSxDQUFDO0lBQ3ZCLENBQUM7SUFDSCw4QkFBQztBQUFELENBQUMsQUFuQkQsQ0FBc0MscURBQXdCLEdBbUI3RDtBQUVELHlCQUNJLE9BQVksRUFBRSxNQUFpQyxFQUFFLFFBQWtDLEVBQ25GLEVBQWlDO0lBQWpDLG1CQUFBLEVBQUEseUJBQWlDO0lBQ25DLElBQU0sTUFBTSxHQUFVLEVBQUUsQ0FBQztJQUN6QixJQUFNLE1BQU0sR0FBRyxJQUFJLDJDQUFtQixFQUFFLENBQUM7SUFDekMsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztJQUMzQixJQUFNLEdBQUcsR0FBRyx5Q0FBaUIsQ0FBQyxNQUFNLEVBQUUsUUFBNkIsRUFBRSxNQUFNLENBQWUsQ0FBQztJQUMzRixJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7S0FDbEI7SUFDRCxJQUFNLE9BQU8sR0FBRyxnQ0FBWSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN4QyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM3QixNQUFNLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDNUMsQ0FBQztBQUVELHFCQUNJLE9BQVksRUFBRSxNQUFpQyxFQUFFLFFBQWdCLEVBQUUsS0FBVSxFQUM3RSxFQUFpQztJQUFqQyxtQkFBQSxFQUFBLHlCQUFpQztJQUNuQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQy9DLENBQUM7QUFFRCxnQkFDSSxPQUFZLEVBQUUsTUFBaUMsRUFBRSxTQUFpQixFQUFFLFNBQWlCLEVBQ3JGLFFBQTZCLEVBQUUsRUFBaUM7SUFBakMsbUJBQUEsRUFBQSx5QkFBaUM7SUFDbEUsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNwRSxDQUFDIn0=