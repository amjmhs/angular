"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function forceReflow() {
    document.body['_reflow'] = document.body.clientWidth;
}
exports.forceReflow = forceReflow;
function makeAnimationEvent(startOrEnd, animationName, elapsedTime, timestamp) {
    var e = new AnimationEvent('animation' + startOrEnd, { animationName: animationName, elapsedTime: elapsedTime });
    if (timestamp) {
        e._ngTestManualTimestamp = timestamp;
    }
    return e;
}
exports.makeAnimationEvent = makeAnimationEvent;
function supportsAnimationEventCreation() {
    var supported = false;
    try {
        makeAnimationEvent('end', 'test', 0);
        supported = true;
    }
    catch (e) {
    }
    return supported;
}
exports.supportsAnimationEventCreation = supportsAnimationEventCreation;
function findKeyframeDefinition(sheet) {
    return sheet.cssRules[0] || null;
}
exports.findKeyframeDefinition = findKeyframeDefinition;
function createElement() {
    return document.createElement('div');
}
exports.createElement = createElement;
function assertStyle(element, prop, value) {
    expect(element.style[prop] || '').toEqual(value);
}
exports.assertStyle = assertStyle;
function assertElementExistsInDom(element, yes) {
    var exp = expect(element.parentNode);
    if (yes) {
        exp.toBeTruthy();
    }
    else {
        exp.toBeFalsy();
    }
}
exports.assertElementExistsInDom = assertElementExistsInDom;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3Rlc3QvcmVuZGVyL2Nzc19rZXlmcmFtZXMvc2hhcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0g7SUFDRyxRQUFRLENBQUMsSUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO0FBQ2hFLENBQUM7QUFGRCxrQ0FFQztBQUVELDRCQUNJLFVBQTJCLEVBQUUsYUFBcUIsRUFBRSxXQUFtQixFQUFFLFNBQWtCO0lBQzdGLElBQU0sQ0FBQyxHQUFHLElBQUksY0FBYyxDQUFDLFdBQVcsR0FBRyxVQUFVLEVBQUUsRUFBQyxhQUFhLGVBQUEsRUFBRSxXQUFXLGFBQUEsRUFBQyxDQUFDLENBQUM7SUFDckYsSUFBSSxTQUFTLEVBQUU7UUFDWixDQUFTLENBQUMsc0JBQXNCLEdBQUcsU0FBUyxDQUFDO0tBQy9DO0lBQ0QsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBUEQsZ0RBT0M7QUFFRDtJQUNFLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztJQUN0QixJQUFJO1FBQ0Ysa0JBQWtCLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0tBQ2xCO0lBQUMsT0FBTyxDQUFDLEVBQUU7S0FDWDtJQUNELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFSRCx3RUFRQztBQUVELGdDQUF1QyxLQUFVO0lBQy9DLE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7QUFDbkMsQ0FBQztBQUZELHdEQUVDO0FBRUQ7SUFDRSxPQUFPLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUZELHNDQUVDO0FBRUQscUJBQTRCLE9BQVksRUFBRSxJQUFZLEVBQUUsS0FBYTtJQUNuRSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkQsQ0FBQztBQUZELGtDQUVDO0FBRUQsa0NBQXlDLE9BQVksRUFBRSxHQUFhO0lBQ2xFLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDdkMsSUFBSSxHQUFHLEVBQUU7UUFDUCxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDbEI7U0FBTTtRQUNMLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUNqQjtBQUNILENBQUM7QUFQRCw0REFPQyJ9