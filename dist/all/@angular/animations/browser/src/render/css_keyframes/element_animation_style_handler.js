"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var ELAPSED_TIME_MAX_DECIMAL_PLACES = 3;
var ANIMATION_PROP = 'animation';
var ANIMATIONEND_EVENT = 'animationend';
var ONE_SECOND = 1000;
var ElementAnimationStyleHandler = /** @class */ (function () {
    function ElementAnimationStyleHandler(_element, _name, _duration, _delay, _easing, _fillMode, _onDoneFn) {
        var _this = this;
        this._element = _element;
        this._name = _name;
        this._duration = _duration;
        this._delay = _delay;
        this._easing = _easing;
        this._fillMode = _fillMode;
        this._onDoneFn = _onDoneFn;
        this._finished = false;
        this._destroyed = false;
        this._startTime = 0;
        this._position = 0;
        this._eventFn = function (e) { return _this._handleCallback(e); };
    }
    ElementAnimationStyleHandler.prototype.apply = function () {
        applyKeyframeAnimation(this._element, this._duration + "ms " + this._easing + " " + this._delay + "ms 1 normal " + this._fillMode + " " + this._name);
        addRemoveAnimationEvent(this._element, this._eventFn, false);
        this._startTime = Date.now();
    };
    ElementAnimationStyleHandler.prototype.pause = function () { playPauseAnimation(this._element, this._name, 'paused'); };
    ElementAnimationStyleHandler.prototype.resume = function () { playPauseAnimation(this._element, this._name, 'running'); };
    ElementAnimationStyleHandler.prototype.setPosition = function (position) {
        var index = findIndexForAnimation(this._element, this._name);
        this._position = position * this._duration;
        setAnimationStyle(this._element, 'Delay', "-" + this._position + "ms", index);
    };
    ElementAnimationStyleHandler.prototype.getPosition = function () { return this._position; };
    ElementAnimationStyleHandler.prototype._handleCallback = function (event) {
        var timestamp = event._ngTestManualTimestamp || Date.now();
        var elapsedTime = parseFloat(event.elapsedTime.toFixed(ELAPSED_TIME_MAX_DECIMAL_PLACES)) * ONE_SECOND;
        if (event.animationName == this._name &&
            Math.max(timestamp - this._startTime, 0) >= this._delay && elapsedTime >= this._duration) {
            this.finish();
        }
    };
    ElementAnimationStyleHandler.prototype.finish = function () {
        if (this._finished)
            return;
        this._finished = true;
        this._onDoneFn();
        addRemoveAnimationEvent(this._element, this._eventFn, true);
    };
    ElementAnimationStyleHandler.prototype.destroy = function () {
        if (this._destroyed)
            return;
        this._destroyed = true;
        this.finish();
        removeKeyframeAnimation(this._element, this._name);
    };
    return ElementAnimationStyleHandler;
}());
exports.ElementAnimationStyleHandler = ElementAnimationStyleHandler;
function playPauseAnimation(element, name, status) {
    var index = findIndexForAnimation(element, name);
    setAnimationStyle(element, 'PlayState', status, index);
}
function applyKeyframeAnimation(element, value) {
    var anim = getAnimationStyle(element, '').trim();
    var index = 0;
    if (anim.length) {
        index = countChars(anim, ',') + 1;
        value = anim + ", " + value;
    }
    setAnimationStyle(element, '', value);
    return index;
}
function removeKeyframeAnimation(element, name) {
    var anim = getAnimationStyle(element, '');
    var tokens = anim.split(',');
    var index = findMatchingTokenIndex(tokens, name);
    if (index >= 0) {
        tokens.splice(index, 1);
        var newValue = tokens.join(',');
        setAnimationStyle(element, '', newValue);
    }
}
function findIndexForAnimation(element, value) {
    var anim = getAnimationStyle(element, '');
    if (anim.indexOf(',') > 0) {
        var tokens = anim.split(',');
        return findMatchingTokenIndex(tokens, value);
    }
    return findMatchingTokenIndex([anim], value);
}
function findMatchingTokenIndex(tokens, searchToken) {
    for (var i = 0; i < tokens.length; i++) {
        if (tokens[i].indexOf(searchToken) >= 0) {
            return i;
        }
    }
    return -1;
}
function addRemoveAnimationEvent(element, fn, doRemove) {
    doRemove ? element.removeEventListener(ANIMATIONEND_EVENT, fn) :
        element.addEventListener(ANIMATIONEND_EVENT, fn);
}
function setAnimationStyle(element, name, value, index) {
    var prop = ANIMATION_PROP + name;
    if (index != null) {
        var oldValue = element.style[prop];
        if (oldValue.length) {
            var tokens = oldValue.split(',');
            tokens[index] = value;
            value = tokens.join(',');
        }
    }
    element.style[prop] = value;
}
function getAnimationStyle(element, name) {
    return element.style[ANIMATION_PROP + name];
}
function countChars(value, char) {
    var count = 0;
    for (var i = 0; i < value.length; i++) {
        var c = value.charAt(i);
        if (c === char)
            count++;
    }
    return count;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudF9hbmltYXRpb25fc3R5bGVfaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvcmVuZGVyL2Nzc19rZXlmcmFtZXMvZWxlbWVudF9hbmltYXRpb25fc3R5bGVfaGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILElBQU0sK0JBQStCLEdBQUcsQ0FBQyxDQUFDO0FBQzFDLElBQU0sY0FBYyxHQUFHLFdBQVcsQ0FBQztBQUNuQyxJQUFNLGtCQUFrQixHQUFHLGNBQWMsQ0FBQztBQUMxQyxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFFeEI7SUFPRSxzQ0FDcUIsUUFBYSxFQUFtQixLQUFhLEVBQzdDLFNBQWlCLEVBQW1CLE1BQWMsRUFDbEQsT0FBZSxFQUFtQixTQUErQixFQUNqRSxTQUFvQjtRQUp6QyxpQkFNQztRQUxvQixhQUFRLEdBQVIsUUFBUSxDQUFLO1FBQW1CLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDN0MsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUFtQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2xELFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBbUIsY0FBUyxHQUFULFNBQVMsQ0FBc0I7UUFDakUsY0FBUyxHQUFULFNBQVMsQ0FBVztRQVRqQyxjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFDbkIsZUFBVSxHQUFHLENBQUMsQ0FBQztRQUNmLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFPcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFDLENBQUMsSUFBSyxPQUFBLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQXZCLENBQXVCLENBQUM7SUFDakQsQ0FBQztJQUVELDRDQUFLLEdBQUw7UUFDRSxzQkFBc0IsQ0FDbEIsSUFBSSxD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