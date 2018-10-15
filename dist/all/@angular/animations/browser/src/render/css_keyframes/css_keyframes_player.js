"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
var element_animation_style_handler_1 = require("./element_animation_style_handler");
var DEFAULT_FILL_MODE = 'forwards';
var DEFAULT_EASING = 'linear';
var ANIMATION_END_EVENT = 'animationend';
var CssKeyframesPlayer = /** @class */ (function () {
    function CssKeyframesPlayer(element, keyframes, animationName, _duration, _delay, easing, _finalStyles) {
        this.element = element;
        this.keyframes = keyframes;
        this.animationName = animationName;
        this._duration = _duration;
        this._delay = _delay;
        this._finalStyles = _finalStyles;
        this._onDoneFns = [];
        this._onStartFns = [];
        this._onDestroyFns = [];
        this._started = false;
        this.currentSnapshot = {};
        this._state = 0;
        this.easing = easing || DEFAULT_EASING;
        this.totalTime = _duration + _delay;
        this._buildStyler();
    }
    CssKeyframesPlayer.prototype.onStart = function (fn) { this._onStartFns.push(fn); };
    CssKeyframesPlayer.prototype.onDone = function (fn) { this._onDoneFns.push(fn); };
    CssKeyframesPlayer.prototype.onDestroy = function (fn) { this._onDestroyFns.push(fn); };
    CssKeyframesPlayer.prototype.destroy = function () {
        this.init();
        if (this._state >= 4 /* DESTROYED */)
            return;
        this._state = 4 /* DESTROYED */;
        this._styler.destroy();
        this._flushStartFns();
        this._flushDoneFns();
        this._onDestroyFns.forEach(function (fn) { return fn(); });
        this._onDestroyFns = [];
    };
    CssKeyframesPlayer.prototype._flushDoneFns = function () {
        this._onDoneFns.forEach(function (fn) { return fn(); });
        this._onDoneFns = [];
    };
    CssKeyframesPlayer.prototype._flushStartFns = function () {
        this._onStartFns.forEach(function (fn) { return fn(); });
        this._onStartFns = [];
    };
    CssKeyframesPlayer.prototype.finish = function () {
        this.init();
        if (this._state >= 3 /* FINISHED */)
            return;
        this._state = 3 /* FINISHED */;
        this._styler.finish();
        this._flushStartFns();
        this._flushDoneFns();
    };
    CssKeyframesPlayer.prototype.setPosition = function (value) { this._styler.setPosition(value); };
    CssKeyframesPlayer.prototype.getPosition = function () { return this._styler.getPosition(); };
    CssKeyframesPlayer.prototype.hasStarted = function () { return this._state >= 2 /* STARTED */; };
    CssKeyframesPlayer.prototype.init = function () {
        if (this._state >= 1 /* INITIALIZED */)
            return;
        this._state = 1 /* INITIALIZED */;
        var elm = this.element;
        this._styler.apply();
        if (this._delay) {
            this._styler.pause();
        }
    };
    CssKeyframesPlayer.prototype.play = function () {
        this.init();
        if (!this.hasStarted()) {
            this._flushStartFns();
            this._state = 2 /* STARTED */;
        }
        this._styler.resume();
    };
    CssKeyframesPlayer.prototype.pause = function () {
        this.init();
        this._styler.pause();
    };
    CssKeyframesPlayer.prototype.restart = function () {
        this.reset();
        this.play();
    };
    CssKeyframesPlayer.prototype.reset = function () {
        this._styler.destroy();
        this._buildStyler();
        this._styler.apply();
    };
    CssKeyframesPlayer.prototype._buildStyler = function () {
        var _this = this;
        this._styler = new element_animation_style_handler_1.ElementAnimationStyleHandler(this.element, this.animationName, this._duration, this._delay, this.easing, DEFAULT_FILL_MODE, function () { return _this.finish(); });
    };
    /** @internal */
    CssKeyframesPlayer.prototype.triggerCallback = function (phaseName) {
        var methods = phaseName == 'start' ? this._onStartFns : this._onDoneFns;
        methods.forEach(function (fn) { return fn(); });
        methods.length = 0;
    };
    CssKeyframesPlayer.prototype.beforeDestroy = function () {
        var _this = this;
        this.init();
        var styles = {};
        if (this.hasStarted()) {
            var finished_1 = this._state >= 3 /* FINISHED */;
            Object.keys(this._finalStyles).forEach(function (prop) {
                if (prop != 'offset') {
                    styles[prop] = finished_1 ? _this._finalStyles[prop] : util_1.computeStyle(_this.element, prop);
                }
            });
        }
        this.currentSnapshot = styles;
    };
    return CssKeyframesPlayer;
}());
exports.CssKeyframesPlayer = CssKeyframesPlayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NzX2tleWZyYW1lc19wbGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvc3JjL3JlbmRlci9jc3Nfa2V5ZnJhbWVzL2Nzc19rZXlmcmFtZXNfcGxheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBU0EsbUNBQXdDO0FBRXhDLHFGQUErRTtBQUUvRSxJQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQztBQUNyQyxJQUFNLGNBQWMsR0FBRyxRQUFRLENBQUM7QUFDaEMsSUFBTSxtQkFBbUIsR0FBRyxjQUFjLENBQUM7QUFJM0M7SUFpQkUsNEJBQ29CLE9BQVksRUFBa0IsU0FBNkMsRUFDM0UsYUFBcUIsRUFBbUIsU0FBaUIsRUFDeEQsTUFBYyxFQUFFLE1BQWMsRUFDOUIsWUFBa0M7UUFIbkMsWUFBTyxHQUFQLE9BQU8sQ0FBSztRQUFrQixjQUFTLEdBQVQsU0FBUyxDQUFvQztRQUMzRSxrQkFBYSxHQUFiLGFBQWEsQ0FBUTtRQUFtQixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ3hELFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxpQkFBWSxHQUFaLFlBQVksQ0FBc0I7UUFwQi9DLGVBQVUsR0FBZSxFQUFFLENBQUM7UUFDNUIsZ0JBQVcsR0FBZSxFQUFFLENBQUM7UUFDN0Isa0JBQWEsR0FBZSxFQUFFLENBQUM7UUFFL0IsYUFBUSxHQUFHLEtBQUssQ0FBQztRQVFsQixvQkFBZSxHQUE0QixFQUFFLENBQUM7UUFFN0MsV0FBTSxHQUF5QixDQUFDLENBQUM7UUFPdkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLElBQUksY0FBYyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxHQUFHLE1BQU0sQ0FBQztRQUNwQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVELG9DQUFPLEdBQVAsVUFBUSxFQUFjLElB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