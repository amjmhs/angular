"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("./assert");
var view_1 = require("./interfaces/view");
/**
 * If this is the first template pass, any ngOnInit or ngDoCheck hooks will be queued into
 * TView.initHooks during directiveCreate.
 *
 * The directive index and hook type are encoded into one number (1st bit: type, remaining bits:
 * directive index), then saved in the even indices of the initHooks array. The odd indices
 * hold the hook functions themselves.
 *
 * @param index The index of the directive in LViewData[DIRECTIVES]
 * @param hooks The static hooks map on the directive def
 * @param tView The current TView
 */
function queueInitHooks(index, onInit, doCheck, tView) {
    ngDevMode &&
        assert_1.assertEqual(tView.firstTemplatePass, true, 'Should only be called on first template pass');
    if (onInit) {
        (tView.initHooks || (tView.initHooks = [])).push(index, onInit);
    }
    if (doCheck) {
        (tView.initHooks || (tView.initHooks = [])).push(index, doCheck);
        (tView.checkHooks || (tView.checkHooks = [])).push(index, doCheck);
    }
}
exports.queueInitHooks = queueInitHooks;
/**
 * Loops through the directives on a node and queues all their hooks except ngOnInit
 * and ngDoCheck, which are queued separately in directiveCreate.
 */
function queueLifecycleHooks(flags, tView) {
    if (tView.firstTemplatePass) {
        var start = flags >> 14 /* DirectiveStartingIndexShift */;
        var count = flags & 4095 /* DirectiveCountMask */;
        var end = start + count;
        // It's necessary to loop through the directives at elementEnd() (rather than processing in
        // directiveCreate) so we can preserve the current hook order. Content, view, and destroy
        // hooks for projected components and directives must be called *before* their hosts.
        for (var i = start; i < end; i++) {
            var def = tView.directives[i];
            queueContentHooks(def, tView, i);
            queueViewHooks(def, tView, i);
            queueDestroyHooks(def, tView, i);
        }
    }
}
exports.queueLifecycleHooks = queueLifecycleHooks;
/** Queues afterContentInit and afterContentChecked hooks on TView */
function queueContentHooks(def, tView, i) {
    if (def.afterContentInit) {
        (tView.contentHooks || (tView.contentHooks = [])).push(i, def.afterContentInit);
    }
    if (def.afterContentChecked) {
        (tView.contentHooks || (tView.contentHooks = [])).push(i, def.afterContentChecked);
        (tView.contentCheckHooks || (tView.contentCheckHooks = [])).push(i, def.afterContentChecked);
    }
}
/** Queues afterViewInit and afterViewChecked hooks on TView */
function queueViewHooks(def, tView, i) {
    if (def.afterViewInit) {
        (tView.viewHooks || (tView.viewHooks = [])).push(i, def.afterViewInit);
    }
    if (def.afterViewChecked) {
        (tView.viewHooks || (tView.viewHooks = [])).push(i, def.afterViewChecked);
        (tView.viewCheckHooks || (tView.viewCheckHooks = [])).push(i, def.afterViewChecked);
    }
}
/** Queues onDestroy hooks on TView */
function queueDestroyHooks(def, tView, i) {
    if (def.onDestroy != null) {
        (tView.destroyHooks || (tView.destroyHooks = [])).push(i, def.onDestroy);
    }
}
/**
 * Calls onInit and doCheck calls if they haven't already been called.
 *
 * @param currentView The current view
 */
function executeInitHooks(currentView, tView, creationMode) {
    if (currentView[view_1.FLAGS] & 16 /* RunInit */) {
        executeHooks(currentView[view_1.DIRECTIVES], tView.initHooks, tView.checkHooks, creationMode);
        currentView[view_1.FLAGS] &= ~16 /* RunInit */;
    }
}
exports.executeInitHooks = executeInitHooks;
/**
 * Iterates over afterViewInit and afterViewChecked functions and calls them.
 *
 * @param currentView The current view
 */
function executeHooks(data, allHooks, checkHooks, creationMode) {
    var hooksToCall = creationMode ? allHooks : checkHooks;
    if (hooksToCall) {
        callHooks(data, hooksToCall);
    }
}
exports.executeHooks = executeHooks;
/**
 * Calls lifecycle hooks with their contexts, skipping init hooks if it's not
 * creation mode.
 *
 * @param currentView The current view
 * @param arr The array in which the hooks are found
 */
function callHooks(data, arr) {
    for (var i = 0; i < arr.length; i += 2) {
        arr[i + 1].call(data[arr[i]]);
    }
}
exports.callHooks = callHooks;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL2hvb2tzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsbUNBQXFDO0FBR3JDLDBDQUE0RjtBQUc1Rjs7Ozs7Ozs7Ozs7R0FXRztBQUNILHdCQUNJLEtBQWEsRUFBRSxNQUEyQixFQUFFLE9BQTRCLEVBQUUsS0FBWTtJQUN4RixTQUFTO1FBQ0wsb0JBQVcsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLDhDQUE4QyxDQUFDLENBQUM7SUFDL0YsSUFBSSxNQUFNLEVBQUU7UUFDVixDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztLQUNqRTtJQUVELElBQUksT0FBTyxFQUFFO1FBQ1gsQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDakUsQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDcEU7QUFDSCxDQUFDO0FBWkQsd0NBWUM7QUFFRDs7O0dBR0c7QUFDSCw2QkFBb0MsS0FBYSxFQUFFLEtBQVk7SUFDN0QsSUFBSSxLQUFLLENBQUMsaUJBQWlCLEVBQUU7UUFDM0IsSUFBTSxLQUFLLEdBQUcsS0FBSyx3Q0FBMEMsQ0FBQztRQUM5RCxJQUFNLEtBQUssR0FBRyxLQUFLLGdDQUFnQyxDQUFDO1FBQ3BELElBQU0sR0FBRyxHQUFHLEtB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