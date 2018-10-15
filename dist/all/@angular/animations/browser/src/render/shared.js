"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var animations_1 = require("@angular/animations");
function isBrowser() {
    return (typeof window !== 'undefined' && typeof window.document !== 'undefined');
}
exports.isBrowser = isBrowser;
function isNode() {
    return (typeof process !== 'undefined');
}
exports.isNode = isNode;
function optimizeGroupPlayer(players) {
    switch (players.length) {
        case 0:
            return new animations_1.NoopAnimationPlayer();
        case 1:
            return players[0];
        default:
            return new animations_1.ɵAnimationGroupPlayer(players);
    }
}
exports.optimizeGroupPlayer = optimizeGroupPlayer;
function normalizeKeyframes(driver, normalizer, element, keyframes, preStyles, postStyles) {
    if (preStyles === void 0) { preStyles = {}; }
    if (postStyles === void 0) { postStyles = {}; }
    var errors = [];
    var normalizedKeyframes = [];
    var previousOffset = -1;
    var previousKeyframe = null;
    keyframes.forEach(function (kf) {
        var offset = kf['offset'];
        var isSameOffset = offset == previousOffset;
        var normalizedKeyframe = (isSameOffset && previousKeyframe) || {};
        Object.keys(kf).forEach(function (prop) {
            var normalizedProp = prop;
            var normalizedValue = kf[prop];
            if (prop !== 'offset') {
                normalizedProp = normalizer.normalizePropertyName(normalizedProp, errors);
                switch (normalizedValue) {
                    case animations_1.ɵPRE_STYLE:
                        normalizedValue = preStyles[prop];
                        break;
                    case animations_1.AUTO_STYLE:
                        normalizedValue = postStyles[prop];
                        break;
                    default:
                        normalizedValue =
                            normalizer.normalizeStyleValue(prop, normalizedProp, normalizedValue, errors);
                        break;
                }
            }
            normalizedKeyframe[normalizedProp] = normalizedValue;
        });
        if (!isSameOffset) {
            normalizedKeyframes.push(normalizedKeyframe);
        }
        previousKeyframe = normalizedKeyframe;
        previousOffset = offset;
    });
    if (errors.length) {
        var LINE_START = '\n - ';
        throw new Error("Unable to animate due to the following errors:" + LINE_START + errors.join(LINE_START));
    }
    return normalizedKeyframes;
}
exports.normalizeKeyframes = normalizeKeyframes;
function listenOnPlayer(player, eventName, event, callback) {
    switch (eventName) {
        case 'start':
            player.onStart(function () { return callback(event && copyAnimationEvent(event, 'start', player)); });
            break;
        case 'done':
            player.onDone(function () { return callback(event && copyAnimationEvent(event, 'done', player)); });
            break;
        case 'destroy':
            player.onDestroy(function () { return callback(event && copyAnimationEvent(event, 'destroy', player)); });
            break;
    }
}
exports.listenOnPlayer = listenOnPlayer;
function copyAnimationEvent(e, phaseName, player) {
    var totalTime = player.totalTime;
    var disabled = player.disabled ? true : false;
    var event = makeAnimationEvent(e.element, e.triggerName, e.fromState, e.toState, phaseName || e.phaseName, totalTime == undefined ? e.totalTime : totalTime, disabled);
    var data = e['_data'];
    if (data != null) {
        event['_data'] = data;
    }
    return event;
}
exports.copyAnimationEvent = copyAnimationEvent;
function makeAnimationEvent(element, triggerName, fromState, toState, phaseName, totalTime, disabled) {
    if (phaseName === void 0) { phaseName = ''; }
    if (totalTime === void 0) { totalTime = 0; }
    return { element: element, triggerName: triggerName, fromState: fromState, toState: toState, phaseName: phaseName, totalTime: totalTime, disabled: !!disabled };
}
exports.makeAnimationEvent = makeAnimationEvent;
function getOrSetAsInMap(map, key, defaultValue) {
    var value;
    if (map instanceof Map) {
        value = map.get(key);
        if (!value) {
            map.set(key, value = defaultValue);
        }
    }
    else {
        value = map[key];
        if (!value) {
            value = map[key] = defaultValue;
        }
    }
    return value;
}
exports.getOrSetAsInMap = getOrSetAsInMap;
function parseTimelineCommand(command) {
    var separatorPos = command.indexOf(':');
    var id = command.substring(1, separatorPos);
    var action = command.substr(separatorPos + 1);
    return [id, action];
}
exports.parseTimelineCommand = parseTimelineCommand;
var _contains = function (elm1, elm2) { return false; };
var _matches = function (element, selector) {
    return false;
};
var _query = function (element, selector, multi) {
    return [];
};
// Define utility methods for browsers and platform-server(domino) where Element
// and utility methods exist.
var _isNode = isNode();
if (_isNode || typeof Element !== 'undefined') {
    // this is well supported in all browsers
    _contains = function (elm1, elm2) { return elm1.contains(elm2); };
    if (_isNode || Element.prototype.matches) {
        _matches = function (element, selector) { return element.matches(selector); };
    }
    else {
        var proto = Element.prototype;
        var fn_1 = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector ||
            proto.oMatchesSelector || proto.webkitMatchesSelector;
        if (fn_1) {
            _matches = function (element, selector) { return fn_1.apply(element, [selector]); };
        }
    }
    _query = function (element, selector, multi) {
        var results = [];
        if (multi) {
            results.push.apply(results, element.querySelectorAll(selector));
        }
        else {
            var elm = element.querySelector(selector);
            if (elm) {
                results.push(elm);
            }
        }
        return results;
    };
}
function containsVendorPrefix(prop) {
    // Webkit is the only real popular vendor prefix nowadays
    // cc: http://shouldiprefix.com/
    return prop.substring(1, 6) == 'ebkit'; // webkit or Webkit
}
var _CACHED_BODY = null;
var _IS_WEBKIT = false;
function validateStyleProperty(prop) {
    if (!_CACHED_BODY) {
        _CACHED_BODY = getBodyNode() || {};
        _IS_WEBKIT = _CACHED_BODY.style ? ('WebkitAppearance' in _CACHED_BODY.style) : false;
    }
    var result = true;
    if (_CACHED_BODY.style && !containsVendorPrefix(prop)) {
        result = prop in _CACHED_BODY.style;
        if (!result && _IS_WEBKIT) {
            var camelProp = 'Webkit' + prop.charAt(0).toUpperCase() + prop.substr(1);
            result = camelProp in _CACHED_BODY.style;
        }
    }
    return result;
}
exports.validateStyleProperty = validateStyleProperty;
function getBodyNode() {
    if (typeof document != 'undefined') {
        return document.body;
    }
    return null;
}
exports.getBodyNode = getBodyNode;
exports.matchesElement = _matches;
exports.containsElement = _contains;
exports.invokeQuery = _query;
function hypenatePropsObject(object) {
    var newObj = {};
    Object.keys(object).forEach(function (prop) {
        var newProp = prop.replace(/([a-z])([A-Z])/g, '$1-$2');
        newObj[newProp] = object[prop];
    });
    return newObj;
}
exports.hypenatePropsObject = hypenatePropsObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3NyYy9yZW5kZXIvc2hhcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsa0RBQWlLO0FBVWpLO0lBQ0UsT0FBTyxDQUFDLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxPQUFPLE1BQU0sQ0FBQyxRQUFRLEtBQUssV0FBVyxDQUFDLENBQUM7QUFDbkYsQ0FBQztBQUZELDhCQUVDO0FBRUQ7SUFDRSxPQUFPLENBQUMsT0FBTyxPQUFPLEtBQUssV0FBVyxDQUFDLENBQUM7QUFDMUMsQ0FBQztBQUZELHdCQUVDO0FBRUQsNkJBQW9DLE9BQTBCO0lBQzVELFFBQVEsT0FBTyxDQUFDLE1BQU0sRUFBRTtRQUN0QixLQUFLLENBQUM7WUFDSixPQUFPLElBQUksZ0NBQW1CLEVBQUUsQ0FBQztRQUNuQyxLQUFLLENBQUM7WUFDSixPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQjtZQUNFLE9BQU8sSUFBSSxrQ0FBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUM3QztBQUNILENBQUM7QUFURCxrREFTQztBQUVELDRCQUNJLE1BQXVCLEVBQUUsVUFBb0MsRUFBRSxPQUFZLEVBQzNFLFNBQXVCLEVBQUUsU0FBMEIsRUFDbkQsVUFBMkI7SUFERiwwQkFBQSxFQUFBLGNBQTBCO0lBQ25ELDJCQUFBLEVBQUEsZUFBMkI7SUFDN0IsSUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO0lBQzVCLElBQU0sbUJBQW1CLEdBQWlCLEVBQUUsQ0FBQztJQUM3QyxJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN4QixJQUFJLGdCQUFnQixHQUFvQixJQUFJLENBQUM7SUFDN0MsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEVBQUU7UUFDbEIsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBVyxDQUFDO1FBQ3RDLElBQU0sWUFBWSxHQUFHLE1BQU0sSUFBSSxjQUFjLENBQUM7UUFDOUMsSUFBTSxrQkFBa0IsR0FBZSxDQUFDLFlBQVksSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNoRixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7WUFDMUIsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDO1lBQzFCLElBQUksZUFBZSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQixJQUFJLElBQUksS0FBSyxRQUFRLEVBQUU7Z0JBQ3JCLGNBQWMsR0FBRyxVQUFVLENBQUMscUJBQXFCLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUMxRSxRQUFRLGVBQWUsRUFBRTtvQkFDdkIsS0FBSyx1QkFBUzt3QkFDWixlQUFlLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNsQyxNQUFNO29CQUVSLEtBQUssdUJBQVU7d0JBQ2IsZUFBZSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDbkMsTUFBTTtvQkFFUjt3QkFDRSxlQUFlOzRCQUNYLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLGVBQWUsRUFBRSxNQUFNLENBQUMsQ0FBQzt3QkFDbEYsTUFBTTtpQkFDVDthQUNGO1lBQ0Qsa0JBQWtCLENBQUMsY0FBYyxDQUFDLEdBQUcsZUFBZSxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixtQkFBbUIsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztTQUM5QztRQUNELGdCQUFnQixHQUFHLGtCQUFrQixDQUFDO1FBQ3RDLGNBQWMsR0FBRyxNQUFNLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFDSCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7UUFDakIsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDO1FBQzNCLE1BQU0sSUFBSSxLQUFLLENBQ1gsbURBQWlELFVBQVUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBRyxDQUFDLENBQUM7S0FDOUY7SUFFRCxPQUFPLG1CQUFtQixDQUFDO0FBQzdCLENBQUM7QUEvQ0QsZ0RBK0NDO0FBRUQsd0JBQ0ksTUFBdUIsRUFBRSxTQUFpQixFQUFFLEtBQWlDLEVBQzdFLFFBQTZCO0lBQy9CLFFBQVEsU0FBUyxFQUFFO1FBQ2pCLEtBQUssT0FBTztZQUNWLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBTSxPQUFBLFFBQVEsQ0FBQyxLQUFLLElBQUksa0JBQWtCLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUE3RCxDQUE2RCxDQUFDLENBQUM7WUFDcEYsTUFBTTtRQUNSLEtBQUssTUFBTTtZQUNULE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBTSxPQUFBLFFBQVEsQ0FBQyxLQUFLLElBQUksa0JBQWtCLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUE1RCxDQUE0RCxDQUFDLENBQUM7WUFDbEYsTUFBTTtRQUNSLEtBQUssU0FBUztZQUNaLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBTSxPQUFBLFFBQVEsQ0FBQyxLQUFLLElBQUksa0JBQWtCLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUEvRCxDQUErRCxDQUFDLENBQUM7WUFDeEYsTUFBTTtLQUNUO0FBQ0gsQ0FBQztBQWRELHdDQWNDO0FBRUQsNEJBQ0ksQ0FBaUIsRUFBRSxTQUFpQixFQUFFLE1BQXVCO0lBQy9ELElBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDbkMsSUFBTSxRQUFRLEdBQUksTUFBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDekQsSUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQzVCLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQzFFLFNBQVMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNoRSxJQUFNLElBQUksR0FBSSxDQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakMsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO1FBQ2YsS0FBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQztLQUNoQztJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQVpELGdEQVlDO0FBRUQsNEJBQ0ksT0FBWSxFQUFFLFdBQW1CLEVBQUUsU0FBaUIsRUFBRSxPQUFlLEVBQUUsU0FBc0IsRUFDN0YsU0FBcUIsRUFBRSxRQUFrQjtJQUQ4QiwwQkFBQSxFQUFBLGNBQXNCO0lBQzdGLDBCQUFBLEVBQUEsYUFBcUI7SUFDdkIsT0FBTyxFQUFDLE9BQU8sU0FBQSxFQUFFLFdBQVcsYUFBQSxFQUFFLFNBQVMsV0FBQSxFQUFFLE9BQU8sU0FBQSxFQUFFLFNBQVMsV0FBQSxFQUFFLFNBQVMsV0FBQSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFDLENBQUM7QUFDaEcsQ0FBQztBQUpELGdEQUlDO0FBRUQseUJBQ0ksR0FBd0MsRUFBRSxHQUFRLEVBQUUsWUFBaUI7SUFDdkUsSUFBSSxLQUFVLENBQUM7SUFDZixJQUFJLEdBQUcsWUFBWSxHQUFHLEVBQUU7UUFDdEIsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssR0FBRyxZQUFZLENBQUMsQ0FBQztTQUNwQztLQUNGO1NBQU07UUFDTCxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFlBQVksQ0FBQztTQUNqQztLQUNGO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBZkQsMENBZUM7QUFFRCw4QkFBcUMsT0FBZTtJQUNsRCxJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzFDLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQzlDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2hELE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdEIsQ0FBQztBQUxELG9EQUtDO0FBRUQsSUFBSSxTQUFTLEdBQXNDLFVBQUMsSUFBUyxFQUFFLElBQVMsSUFBSyxPQUFBLEtBQUssRUFBTCxDQUFLLENBQUM7QUFDbkYsSUFBSSxRQUFRLEdBQWdELFVBQUMsT0FBWSxFQUFFLFFBQWdCO0lBQ3ZGLE9BQUEsS0FBSztBQUFMLENBQUssQ0FBQztBQUNWLElBQUksTUFBTSxHQUNOLFVBQUMsT0FBWSxFQUFFLFFBQWdCLEVBQUUsS0FBYztJQUM3QyxPQUFPLEVBQUUsQ0FBQztBQUNaLENBQUMsQ0FBQztBQUVOLGdGQUFnRjtBQUNoRiw2QkFBNkI7QUFDN0IsSUFBTSxPQUFPLEdBQUcsTUFBTSxFQUFFLENBQUM7QUFDekIsSUFBSSxPQUFPLElBQUksT0FBTyxPQUFPLEtBQUssV0FBVyxFQUFFO0lBQzdDLHlDQUF5QztJQUN6QyxTQUFTLEdBQUcsVUFBQyxJQUFTLEVBQUUsSUFBUyxJQUFPLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVqRixJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRTtRQUN4QyxRQUFRLEdBQUcsVUFBQyxPQUFZLEVBQUUsUUFBZ0IsSUFBSyxPQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQXpCLENBQXlCLENBQUM7S0FDMUU7U0FBTTtRQUNMLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFnQixDQUFDO1FBQ3ZDLElBQU0sSUFBRSxHQUFHLEtBQUssQ0FBQyxlQUFlLElBQUksS0FBSyxDQUFDLGtCQUFrQixJQUFJLEtBQUssQ0FBQyxpQkFBaUI7WUFDbkYsS0FBSyxDQUFDLGdCQUFnQixJQUFJLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQztRQUMxRCxJQUFJLElBQUUsRUFBRTtZQUNOLFFBQVEsR0FBRyxVQUFDLE9BQVksRUFBRSxRQUFnQixJQUFLLE9BQUEsSUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUE3QixDQUE2QixDQUFDO1NBQzlFO0tBQ0Y7SUFFRCxNQUFNLEdBQUcsVUFBQyxPQUFZLEVBQUUsUUFBZ0IsRUFBRSxLQUFjO1FBQ3RELElBQUksT0FBTyxHQUFVLEVBQUUsQ0FBQztRQUN4QixJQUFJLEtBQUssRUFBRTtZQUNULE9BQU8sQ0FBQyxJQUFJLE9BQVosT0FBTyxFQUFTLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsRUFBRTtTQUNyRDthQUFNO1lBQ0wsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM1QyxJQUFJLEdBQUcsRUFBRTtnQkFDUCxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ25CO1NBQ0Y7UUFDRCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDLENBQUM7Q0FDSDtBQUVELDhCQUE4QixJQUFZO0lBQ3hDLHlEQUF5RDtJQUN6RCxnQ0FBZ0M7SUFDaEMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBRSxtQkFBbUI7QUFDOUQsQ0FBQztBQUVELElBQUksWUFBWSxHQUFzQixJQUFJLENBQUM7QUFDM0MsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLCtCQUFzQyxJQUFZO0lBQ2hELElBQUksQ0FBQyxZQUFZLEVBQUU7UUFDakIsWUFBWSxHQUFHLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUNuQyxVQUFVLEdBQUcsWUFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsSUFBSSxZQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztLQUMxRjtJQUVELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQztJQUNsQixJQUFJLFlBQWMsQ0FBQyxLQUFLLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN2RCxNQUFNLEdBQUcsSUFBSSxJQUFJLFlBQWMsQ0FBQyxLQUFLLENBQUM7UUFDdEMsSUFBSSxDQUFDLE1BQU0sSUFBSSxVQUFVLEVBQUU7WUFDekIsSUFBTSxTQUFTLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRSxNQUFNLEdBQUcsU0FBUyxJQUFJLFlBQWMsQ0FBQyxLQUFLLENBQUM7U0FDNUM7S0FDRjtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFoQkQsc0RBZ0JDO0FBRUQ7SUFDRSxJQUFJLE9BQU8sUUFBUSxJQUFJLFdBQVcsRUFBRTtRQUNsQyxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7S0FDdEI7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFMRCxrQ0FLQztBQUVZLFFBQUEsY0FBYyxHQUFHLFFBQVEsQ0FBQztBQUMxQixRQUFBLGVBQWUsR0FBRyxTQUFTLENBQUM7QUFDNUIsUUFBQSxXQUFXLEdBQUcsTUFBTSxDQUFDO0FBRWxDLDZCQUFvQyxNQUE0QjtJQUM5RCxJQUFNLE1BQU0sR0FBeUIsRUFBRSxDQUFDO0lBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtRQUM5QixJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBUEQsa0RBT0MifQ==