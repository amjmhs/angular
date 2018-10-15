"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var LifecycleHooks;
(function (LifecycleHooks) {
    LifecycleHooks[LifecycleHooks["OnInit"] = 0] = "OnInit";
    LifecycleHooks[LifecycleHooks["OnDestroy"] = 1] = "OnDestroy";
    LifecycleHooks[LifecycleHooks["DoCheck"] = 2] = "DoCheck";
    LifecycleHooks[LifecycleHooks["OnChanges"] = 3] = "OnChanges";
    LifecycleHooks[LifecycleHooks["AfterContentInit"] = 4] = "AfterContentInit";
    LifecycleHooks[LifecycleHooks["AfterContentChecked"] = 5] = "AfterContentChecked";
    LifecycleHooks[LifecycleHooks["AfterViewInit"] = 6] = "AfterViewInit";
    LifecycleHooks[LifecycleHooks["AfterViewChecked"] = 7] = "AfterViewChecked";
})(LifecycleHooks = exports.LifecycleHooks || (exports.LifecycleHooks = {}));
exports.LIFECYCLE_HOOKS_VALUES = [
    LifecycleHooks.OnInit, LifecycleHooks.OnDestroy, LifecycleHooks.DoCheck, LifecycleHooks.OnChanges,
    LifecycleHooks.AfterContentInit, LifecycleHooks.AfterContentChecked, LifecycleHooks.AfterViewInit,
    LifecycleHooks.AfterViewChecked
];
function hasLifecycleHook(reflector, hook, token) {
    return reflector.hasLifecycleHook(token, getHookName(hook));
}
exports.hasLifecycleHook = hasLifecycleHook;
function getAllLifecycleHooks(reflector, token) {
    return exports.LIFECYCLE_HOOKS_VALUES.filter(function (hook) { return hasLifecycleHook(reflector, hook, token); });
}
exports.getAllLifecycleHooks = getAllLifecycleHooks;
function getHookName(hook) {
    switch (hook) {
        case LifecycleHooks.OnInit:
            return 'ngOnInit';
        case LifecycleHooks.OnDestroy:
            return 'ngOnDestroy';
        case LifecycleHooks.DoCheck:
            return 'ngDoCheck';
        case LifecycleHooks.OnChanges:
            return 'ngOnChanges';
        case LifecycleHooks.AfterContentInit:
            return 'ngAfterContentInit';
        case LifecycleHooks.AfterContentChecked:
            return 'ngAfterContentChecked';
        case LifecycleHooks.AfterViewInit:
            return 'ngAfterViewInit';
        case LifecycleHooks.AfterViewChecked:
            return 'ngAfterViewChecked';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlmZWN5Y2xlX3JlZmxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9saWZlY3ljbGVfcmVmbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBSUgsSUFBWSxjQVNYO0FBVEQsV0FBWSxjQUFjO0lBQ3hCLHVEQUFNLENBQUE7SUFDTiw2REFBUyxDQUFBO0lBQ1QseURBQU8sQ0FBQTtJQUNQLDZEQUFTLENBQUE7SUFDVCwyRUFBZ0IsQ0FBQTtJQUNoQixpRkFBbUIsQ0FBQTtJQUNuQixxRUFBYSxDQUFBO0lBQ2IsMkVBQWdCLENBQUE7QUFDbEIsQ0FBQyxFQVRXLGNBQWMsR0FBZCxzQkFBYyxLQUFkLHNCQUFjLFFBU3pCO0FBRVksUUFBQSxzQkFBc0IsR0FBRztJQUNwQyxjQUFjLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsU0FBUztJQUNqRyxjQUFjLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDLG1CQUFtQixFQUFFLGNBQWMsQ0FBQyxhQUFhO0lBQ2pHLGNBQWMsQ0FBQyxnQkFBZ0I7Q0FDaEMsQ0FBQztBQUVGLDBCQUNJLFNBQTJCLEVBQUUsSUFBb0IsRUFBRSxLQUFVO0lBQy9ELE9BQU8sU0FBUyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM5RCxDQUFDO0FBSEQsNENBR0M7QUFFRCw4QkFBcUMsU0FBMkIsRUFBRSxLQUFVO0lBQzFFLE9BQU8sOEJBQXNCLENBQUMsTUFBTSxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsRUFBeEMsQ0FBd0MsQ0FBQyxDQUFDO0FBQ3pGLENBQUM7QUFGRCxvREFFQztBQUVELHFCQUFxQixJQUFvQjtJQUN2QyxRQUFRLElBQUksRUFBRTtRQUNaLEtBQUssY0FBYyxDQUFDLE1BQU07WUFDeEIsT0FBTyxVQUFVLENBQUM7UUFDcEIsS0FBSyxjQUFjLENBQUMsU0FBUztZQUMzQixPQUFPLGFBQWEsQ0FBQztRQUN2QixLQUFLLGNBQWMsQ0FBQyxPQUFPO1lBQ3pCLE9BQU8sV0FBVyxDQUFDO1FBQ3JCLEtBQUssY0FBYyxDQUFDLFNBQVM7WUFDM0IsT0FBTyxhQUFhLENBQUM7UUFDdkIsS0FBSyxjQUFjLENBQUMsZ0JBQWdCO1lBQ2xDLE9BQU8sb0JBQW9CLENBQUM7UUFDOUIsS0FBSyxjQUFjLENBQUMsbUJBQW1CO1lBQ3JDLE9BQU8sdUJBQXVCLENBQUM7UUFDakMsS0FBSyxjQUFjLENBQUMsYUFBYTtZQUMvQixPQUFPLGlCQUFpQixDQUFDO1FBQzNCLEtBQUssY0FBYyxDQUFDLGdCQUFnQjtZQUNsQyxPQUFPLG9CQUFvQixDQUFDO0tBQy9CO0FBQ0gsQ0FBQyJ9