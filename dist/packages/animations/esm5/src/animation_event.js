/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * An instance of this class is returned as an event parameter when an animation
 * callback is captured for an animation either during the start or done phase.
 *
 * ```typescript
 * \@Component({
 *   host: {
 *     '[\@myAnimationTrigger]': 'someExpression',
 *     '(\@myAnimationTrigger.start)': 'captureStartEvent($event)',
 *     '(\@myAnimationTrigger.done)': 'captureDoneEvent($event)',
 *   },
 *   animations: [
 *     trigger("myAnimationTrigger", [
 *        // ...
 *     ])
 *   ]
 * })
 * class MyComponent {
 *   someExpression: any = false;
 *   captureStartEvent(event: AnimationEvent) {
 *     // the toState, fromState and totalTime data is accessible from the event variable
 *   }
 *
 *   captureDoneEvent(event: AnimationEvent) {
 *     // the toState, fromState and totalTime data is accessible from the event variable
 *   }
 * }
 * ```
 *
 * \@experimental Animation support is experimental.
 * @record
 */
export function AnimationEvent() { }
/**
 * The name of the state from which the animation is triggered.
 * @type {?}
 */
AnimationEvent.prototype.fromState;
/**
 * The name of the state in which the animation completes.
 * @type {?}
 */
AnimationEvent.prototype.toState;
/**
 * The time it takes the animation to complete, in milliseconds.
 * @type {?}
 */
AnimationEvent.prototype.totalTime;
/**
 * The animation phase in which the callback was invoked, one of
 * "start" or "done".
 * @type {?}
 */
AnimationEvent.prototype.phaseName;
/**
 * The element to which the animation is attached.
 * @type {?}
 */
AnimationEvent.prototype.element;
/**
 * Internal.
 * @type {?}
 */
AnimationEvent.prototype.triggerName;
/**
 * Internal.
 * @type {?}
 */
AnimationEvent.prototype.disabled;
//# sourceMappingURL=animation_event.js.map