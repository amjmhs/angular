"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
var css_keyframes_driver_1 = require("../css_keyframes/css_keyframes_driver");
var shared_1 = require("../shared");
var web_animations_player_1 = require("./web_animations_player");
var WebAnimationsDriver = /** @class */ (function () {
    function WebAnimationsDriver() {
        this._isNativeImpl = /\{\s*\[native\s+code\]\s*\}/.test(getElementAnimateFn().toString());
        this._cssKeyframesDriver = new css_keyframes_driver_1.CssKeyframesDriver();
    }
    WebAnimationsDriver.prototype.validateStyleProperty = function (prop) { return shared_1.validateStyleProperty(prop); };
    WebAnimationsDriver.prototype.matchesElement = function (element, selector) {
        return shared_1.matchesElement(element, selector);
    };
    WebAnimationsDriver.prototype.containsElement = function (elm1, elm2) { return shared_1.containsElement(elm1, elm2); };
    WebAnimationsDriver.prototype.query = function (element, selector, multi) {
        return shared_1.invokeQuery(element, selector, multi);
    };
    WebAnimationsDriver.prototype.computeStyle = function (element, prop, defaultValue) {
        return window.getComputedStyle(element)[prop];
    };
    WebAnimationsDriver.prototype.overrideWebAnimationsSupport = function (supported) { this._isNativeImpl = supported; };
    WebAnimationsDriver.prototype.animate = function (element, keyframes, duration, delay, easing, previousPlayers, scrubberAccessRequested) {
        if (previousPlayers === void 0) { previousPlayers = []; }
        var useKeyframes = !scrubberAccessRequested && !this._isNativeImpl;
        if (useKeyframes) {
            return this._cssKeyframesDriver.animate(element, keyframes, duration, delay, easing, previousPlayers);
        }
        var fill = delay == 0 ? 'both' : 'forwards';
        var playerOptions = { duration: duration, delay: delay, fill: fill };
        // we check for this to avoid having a null|undefined value be present
        // for the easing (which results in an error for certain browsers #9752)
        if (easing) {
            playerOptions['easing'] = easing;
        }
        var previousStyles = {};
        var previousWebAnimationPlayers = previousPlayers.filter(function (player) { return player instanceof web_animations_player_1.WebAnimationsPlayer; });
        if (util_1.allowPreviousPlayerStylesMerge(duration, delay)) {
            previousWebAnimationPlayers.forEach(function (player) {
                var styles = player.currentSnapshot;
                Object.keys(styles).forEach(function (prop) { return previousStyles[prop] = styles[prop]; });
            });
        }
        keyframes = keyframes.map(function (styles) { return util_1.copyStyles(styles, false); });
        keyframes = util_1.balancePreviousStylesIntoKeyframes(element, keyframes, previousStyles);
        return new web_animations_player_1.WebAnimationsPlayer(element, keyframes, playerOptions);
    };
    return WebAnimationsDriver;
}());
exports.WebAnimationsDriver = WebAnimationsDriver;
function supportsWebAnimations() {
    return typeof getElementAnimateFn() === 'function';
}
exports.supportsWebAnimations = supportsWebAnimations;
function getElementAnimateFn() {
    return (shared_1.isBrowser() && Element.prototype['animate']) || {};
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViX2FuaW1hdGlvbnNfZHJpdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3NyYy9yZW5kZXIvd2ViX2FuaW1hdGlvbnMvd2ViX2FuaW1hdGlvbnNfZHJpdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBU0EsbUNBQTBHO0FBRTFHLDhFQUF5RTtBQUN6RSxvQ0FBeUc7QUFFekcsaUVBQTREO0FBRTVEO0lBQUE7UUFDVSxrQkFBYSxHQUFHLDZCQUE2QixDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDckYsd0JBQW1CLEdBQUcsSUFBSSx5Q0FBa0IsRUFBRSxDQUFDO0lBb0R6RCxDQUFDO0lBbERDLG1EQUFxQixHQUFyQixVQUFzQixJQUFZLElBQWEsT0FBTyw4QkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFcEYsNENBQWMsR0FBZCxVQUFlLE9BQVksRUFBRSxRQUFnQjtRQUMzQyxPQUFPLHVCQUFjLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCw2Q0FBZSxHQUFmLFVBQWdCLElBQVMsRUFBRSxJQUFTLElBQWEsT0FBTyx3QkFBZSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFdEYsbUNBQUssR0FBTCxVQUFNLE9BQVksRUFBRSxRQUFnQixFQUFFLEtBQWM7UUFDbEQsT0FBTyxvQkFBVyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELDBDQUFZLEdBQVosVUFBYSxPQUFZLEVBQUUsSUFBWSxFQUFFLFlBQXFCO1FBQzVELE9BQVEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBUyxDQUFDLElBQUksQ0FBVyxDQUFDO0lBQ25FLENBQUM7SUFF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