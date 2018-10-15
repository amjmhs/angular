"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
var shared_1 = require("../shared");
var css_keyframes_player_1 = require("./css_keyframes_player");
var direct_style_player_1 = require("./direct_style_player");
var KEYFRAMES_NAME_PREFIX = 'gen_css_kf_';
var TAB_SPACE = ' ';
var CssKeyframesDriver = /** @class */ (function () {
    function CssKeyframesDriver() {
        this._count = 0;
        this._head = document.querySelector('head');
        this._warningIssued = false;
    }
    CssKeyframesDriver.prototype.validateStyleProperty = function (prop) { return shared_1.validateStyleProperty(prop); };
    CssKeyframesDriver.prototype.matchesElement = function (element, selector) {
        return shared_1.matchesElement(element, selector);
    };
    CssKeyframesDriver.prototype.containsElement = function (elm1, elm2) { return shared_1.containsElement(elm1, elm2); };
    CssKeyframesDriver.prototype.query = function (element, selector, multi) {
        return shared_1.invokeQuery(element, selector, multi);
    };
    CssKeyframesDriver.prototype.computeStyle = function (element, prop, defaultValue) {
        return window.getComputedStyle(element)[prop];
    };
    CssKeyframesDriver.prototype.buildKeyframeElement = function (element, name, keyframes) {
        keyframes = keyframes.map(function (kf) { return shared_1.hypenatePropsObject(kf); });
        var keyframeStr = "@keyframes " + name + " {\n";
        var tab = '';
        keyframes.forEach(function (kf) {
            tab = TAB_SPACE;
            var offset = parseFloat(kf.offset);
            keyframeStr += "" + tab + offset * 100 + "% {\n";
            tab += TAB_SPACE;
            Object.keys(kf).forEach(function (prop) {
                var value = kf[prop];
                switch (prop) {
                    case 'offset':
                        return;
                    case 'easing':
                        if (value) {
                            keyframeStr += tab + "animation-timing-function: " + value + ";\n";
                        }
                        return;
                    default:
                        keyframeStr += "" + tab + prop + ": " + value + ";\n";
                        return;
                }
            });
            keyframeStr += tab + "}\n";
        });
        keyframeStr += "}\n";
        var kfElm = document.createElement('style');
        kfElm.innerHTML = keyframeStr;
        return kfElm;
    };
    CssKeyframesDriver.prototype.animate = function (element, keyframes, duration, delay, easing, previousPlayers, scrubberAccessRequested) {
        if (previousPlayers === void 0) { previousPlayers = []; }
        if (scrubberAccessRequested) {
            this._notifyFaultyScrubber();
        }
        var previousCssKeyframePlayers = previousPlayers.filter(function (player) { return player instanceof css_keyframes_player_1.CssKeyframesPlayer; });
        var previousStyles = {};
        if (util_1.allowPreviousPlayerStylesMerge(duration, delay)) {
            previousCssKeyframePlayers.forEach(function (player) {
                var styles = player.currentSnapshot;
                Object.keys(styles).forEach(function (prop) { return previousStyles[prop] = styles[prop]; });
            });
        }
        keyframes = util_1.balancePreviousStylesIntoKeyframes(element, keyframes, previousStyles);
        var finalStyles = flattenKeyframesIntoStyles(keyframes);
        // if there is no animation then there is no point in applying
        // styles and waiting for an event to get fired. This causes lag.
        // It's better to just directly apply the styles to the element
        // via the direct styling animation player.
        if (duration == 0) {
            return new direct_style_player_1.DirectStylePlayer(element, finalStyles);
        }
        var animationName = "" + KEYFRAMES_NAME_PREFIX + this._count++;
        var kfElm = this.buildKeyframeElement(element, animationName, keyframes);
        document.querySelector('head').appendChild(kfElm);
        var player = new css_keyframes_player_1.CssKeyframesPlayer(element, keyframes, animationName, duration, delay, easing, finalStyles);
        player.onDestroy(function () { return removeElement(kfElm); });
        return player;
    };
    CssKeyframesDriver.prototype._notifyFaultyScrubber = function () {
        if (!this._warningIssued) {
            console.warn('@angular/animations: please load the web-animations.js polyfill to allow programmatic access...\n', '  visit http://bit.ly/IWukam to learn more about using the web-animation-js polyfill.');
            this._warningIssued = true;
        }
    };
    return CssKeyframesDriver;
}());
exports.CssKeyframesDriver = CssKeyframesDriver;
function flattenKeyframesIntoStyles(keyframes) {
    var flatKeyframes = {};
    if (keyframes) {
        var kfs = Array.isArray(keyframes) ? keyframes : [keyframes];
        kfs.forEach(function (kf) {
            Object.keys(kf).forEach(function (prop) {
                if (prop == 'offset' || prop == 'easing')
                    return;
                flatKeyframes[prop] = kf[prop];
            });
        });
    }
    return flatKeyframes;
}
function removeElement(node) {
    node.parentNode.removeChild(node);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NzX2tleWZyYW1lc19kcml2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvc3JjL3JlbmRlci9jc3Nfa2V5ZnJhbWVzL2Nzc19rZXlmcmFtZXNfZHJpdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBU0EsbUNBQTRHO0FBRTVHLG9DQUFtSDtBQUVuSCwrREFBMEQ7QUFDMUQsNkRBQXdEO0FBRXhELElBQU0scUJBQXFCLEdBQUcsYUFBYSxDQUFDO0FBQzVDLElBQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQztBQUV0QjtJQUFBO1FBQ1UsV0FBTSxHQUFHLENBQUMsQ0FBQztRQUNGLFVBQUssR0FBUSxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JELG1CQUFjLEdBQUcsS0FBSyxDQUFDO0lBb0dqQyxDQUFDO0lBbEdDLGtEQUFxQixHQUFyQixVQUFzQixJQUFZLElBQWEsT0FBTyw4QkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFcEYsMkNBQWMsR0FBZCxVQUFlLE9BQVksRUFBRSxRQUFnQjtRQUMzQyxPQUFPLHVCQUFjLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCw0Q0FBZSxHQUFmLFVBQWdCLElBQVMsRUFBRSxJQUFTLElBQWEsT0FBTyx3QkFBZSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFdEYsa0NBQUssR0FBTCxVQUFNLE9BQVksRUFBRSxRQUFnQixFQUFFLEtBQWM7UUFDbEQsT0FBTyxvQkFBVyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELHlDQUFZLEdBQVosVUFBYSxPQUFZLEVBQUUsSUFBWSxFQUFFLFlBQXFCO1FBQzVELE9BQVEsTUFBTSxDQUFDLGdCQUFnQixD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