/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { scheduleMicroTask } from '../util';
/**
 * Provides programmatic control of a reusable animation sequence,
 * built using the `build()` method of `AnimationBuilder`. The `build()` method
 * returns a factory, whose `create()` method instantiates and initializes this interface.
 *
 * @see `AnimationBuilder`
 * @see `AnimationFactory`
 * @see `animate()`
 *
 * @record
 */
export function AnimationPlayer() { }
/**
 * Provides a callback to invoke when the animation finishes.
 * \@param fn The callback function.
 * @see `finish()`
 * @type {?}
 */
AnimationPlayer.prototype.onDone;
/**
 * Provides a callback to invoke when the animation starts.
 * \@param fn The callback function.
 * @see `run()`
 * @type {?}
 */
AnimationPlayer.prototype.onStart;
/**
 * Provides a callback to invoke after the animation is destroyed.
 * \@param fn The callback function.
 * @see `destroy()`
 * @see `beforeDestroy()`
 * @type {?}
 */
AnimationPlayer.prototype.onDestroy;
/**
 * Initializes the animation.
 * @type {?}
 */
AnimationPlayer.prototype.init;
/**
 * Reports whether the animation has started.
 * \@return True if the animation has started, false otherwise.
 * @type {?}
 */
AnimationPlayer.prototype.hasStarted;
/**
 * Runs the animation, invoking the `onStart()` callback.
 * @type {?}
 */
AnimationPlayer.prototype.play;
/**
 * Pauses the animation.
 * @type {?}
 */
AnimationPlayer.prototype.pause;
/**
 * Restarts the paused animation.
 * @type {?}
 */
AnimationPlayer.prototype.restart;
/**
 * Ends the animation, invoking the `onDone()` callback.
 * @type {?}
 */
AnimationPlayer.prototype.finish;
/**
 * Destroys the animation, after invoking the `beforeDestroy()` callback.
 * Calls the `onDestroy()` callback when destruction is completed.
 * @type {?}
 */
AnimationPlayer.prototype.destroy;
/**
 * Resets the animation to its initial state.
 * @type {?}
 */
AnimationPlayer.prototype.reset;
/**
 * Sets the position of the animation.
 * \@param position A 0-based offset into the duration, in milliseconds.
 * @type {?}
 */
AnimationPlayer.prototype.setPosition;
/**
 * Reports the current position of the animation.
 * \@return A 0-based offset into the duration, in milliseconds.
 * @type {?}
 */
AnimationPlayer.prototype.getPosition;
/**
 * The parent of this player, if any.
 * @type {?}
 */
AnimationPlayer.prototype.parentPlayer;
/**
 * The total run time of the animation, in milliseconds.
 * @type {?}
 */
AnimationPlayer.prototype.totalTime;
/**
 * Provides a callback to invoke before the animation is destroyed.
 * @type {?|undefined}
 */
AnimationPlayer.prototype.beforeDestroy;
/**
 * \@internal
 * Internal
 * @type {?|undefined}
 */
AnimationPlayer.prototype.triggerCallback;
/**
 * \@internal
 * Internal
 * @type {?|undefined}
 */
AnimationPlayer.prototype.disabled;
/**
 * An empty programmatic controller for reusable animations.
 * Used internally when animations are disabled, to avoid
 * checking for the null case when an animation player is expected.
 *
 * @see `animate()`
 * @see `AnimationPlayer`
 * @see `GroupPlayer`
 *
 */
export class NoopAnimationPlayer {
    /**
     * @param {?=} duration
     * @param {?=} delay
     */
    constructor(duration = 0, delay = 0) {
        this._onDoneFns = [];
        this._onStartFns = [];
        this._onDestroyFns = [];
        this._started = false;
        this._destroyed = false;
        this._finished = false;
        this.parentPlayer = null;
        this.totalTime = duration + delay;
    }
    /**
     * @return {?}
     */
    _onFinish() {
        if (!this._finished) {
            this._finished = true;
            this._onDoneFns.forEach(fn => fn());
            this._onDoneFns = [];
        }
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    onStart(fn) { this._onStartFns.push(fn); }
    /**
     * @param {?} fn
     * @return {?}
     */
    onDone(fn) { this._onDoneFns.push(fn); }
    /**
     * @param {?} fn
     * @return {?}
     */
    onDestroy(fn) { this._onDestroyFns.push(fn); }
    /**
     * @return {?}
     */
    hasStarted() { return this._started; }
    /**
     * @return {?}
     */
    init() { }
    /**
     * @return {?}
     */
    play() {
        if (!this.hasStarted()) {
            this._onStart();
            this.triggerMicrotask();
        }
        this._started = true;
    }
    /**
     * \@internal
     * @return {?}
     */
    triggerMicrotask() { scheduleMicroTask(() => this._onFinish()); }
    /**
     * @return {?}
     */
    _onStart() {
        this._onStartFns.forEach(fn => fn());
        this._onStartFns = [];
    }
    /**
     * @return {?}
     */
    pause() { }
    /**
     * @return {?}
     */
    restart() { }
    /**
     * @return {?}
     */
    finish() { this._onFinish(); }
    /**
     * @return {?}
     */
    destroy() {
        if (!this._destroyed) {
            this._destroyed = true;
            if (!this.hasStarted()) {
                this._onStart();
            }
            this.finish();
            this._onDestroyFns.forEach(fn => fn());
            this._onDestroyFns = [];
        }
    }
    /**
     * @return {?}
     */
    reset() { }
    /**
     * @param {?} position
     * @return {?}
     */
    setPosition(position) { }
    /**
     * @return {?}
     */
    getPosition() { return 0; }
    /**
     * \@internal
     * @param {?} phaseName
     * @return {?}
     */
    triggerCallback(phaseName) {
        /** @type {?} */
        const methods = phaseName == 'start' ? this._onStartFns : this._onDoneFns;
        methods.forEach(fn => fn());
        methods.length = 0;
    }
}
if (false) {
    /** @type {?} */
    NoopAnimationPlayer.prototype._onDoneFns;
    /** @type {?} */
    NoopAnimationPlayer.prototype._onStartFns;
    /** @type {?} */
    NoopAnimationPlayer.prototype._onDestroyFns;
    /** @type {?} */
    NoopAnimationPlayer.prototype._started;
    /** @type {?} */
    NoopAnimationPlayer.prototype._destroyed;
    /** @type {?} */
    NoopAnimationPlayer.prototype._finished;
    /** @type {?} */
    NoopAnimationPlayer.prototype.parentPlayer;
    /** @type {?} */
    NoopAnimationPlayer.prototype.totalTime;
}
//# sourceMappingURL=animation_player.js.map