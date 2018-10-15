"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Called before each cycle of a view's check to detect whether this is in the
// initState for which we need to call ngOnInit, ngAfterContentInit or ngAfterViewInit
// lifecycle methods. Returns true if this check cycle should call lifecycle
// methods.
function shiftInitState(view, priorInitState, newInitState) {
    // Only update the InitState if we are currently in the prior state.
    // For example, only move into CallingInit if we are in BeforeInit. Only
    // move into CallingContentInit if we are in CallingInit. Normally this will
    // always be true because of how checkCycle is called in checkAndUpdateView.
    // However, if checkAndUpdateView is called recursively or if an exception is
    // thrown while checkAndUpdateView is running, checkAndUpdateView starts over
    // from the beginning. This ensures the state is monotonically increasing,
    // terminating in the AfterInit state, which ensures the Init methods are called
    // at least once and only once.
    var state = view.state;
    var initState = state & 1792 /* InitState_Mask */;
    if (initState === priorInitState) {
        view.state = (state & ~1792 /* InitState_Mask */) | newInitState;
        view.initIndex = -1;
        return true;
    }
    return initState === newInitState;
}
exports.shiftInitState = shiftInitState;
// Returns true if the lifecycle init method should be called for the node with
// the given init index.
function shouldCallLifecycleInitHook(view, initState, index) {
    if ((view.state & 1792 /* InitState_Mask */) === initState && view.initIndex <= index) {
        view.initIndex = index + 1;
        return true;
    }
    return false;
}
exports.shouldCallLifecycleInitHook = shouldCallLifecycleInitHook;
/**
 * Node instance data.
 *
 * We have a separate type per NodeType to save memory
 * (TextData | ElementData | ProviderData | PureExpressionData | QueryList<any>)
 *
 * To keep our code monomorphic,
 * we prohibit using `NodeData` directly but enforce the use of accessors (`asElementData`, ...).
 * This way, no usage site can get a `NodeData` from view.nodes and then use it for different
 * purposes.
 */
var NodeData = /** @class */ (function () {
    function NodeData() {
    }
    return NodeData;
}());
exports.NodeData = NodeData;
/**
 * Accessor for view.nodes, enforcing that every usage site stays monomorphic.
 */
function asTextData(view, index) {
    return view.nodes[index];
}
exports.asTextData = asTextData;
/**
 * Accessor for view.nodes, enforcing that every usage site stays monomorphic.
 */
function asElementData(view, index) {
    return view.nodes[index];
}
exports.asElementData = asElementData;
/**
 * Accessor for view.nodes, enforcing that every usage site stays monomorphic.
 */
function asProviderData(view, index) {
    return view.nodes[index];
}
exports.asProviderData = asProviderData;
/**
 * Accessor for view.nodes, enforcing that every usage site stays monomorphic.
 */
function asPureExpressionData(view, index) {
    return view.nodes[index];
}
exports.asPureExpressionData = asPureExpressionData;
/**
 * Accessor for view.nodes, enforcing that every usage site stays monomorphic.
 */
function asQueryList(view, index) {
    return view.nodes[index];
}
exports.asQueryList = asQueryList;
var DebugContext = /** @class */ (function () {
    function DebugContext() {
    }
    return DebugContext;
}());
exports.DebugContext = DebugContext;
/**
 * This object is used to prevent cycles in the source files and to have a place where
 * debug mode can hook it. It is lazily filled when `isDevMode` is known.
 */
exports.Services = {
    setCurrentNode: undefined,
    createRootView: undefined,
    createEmbeddedView: undefined,
    createComponentView: undefined,
    createNgModuleRef: undefined,
    overrideProvider: undefined,
    overrideComponentView: undefined,
    clearOverrides: undefined,
    checkAndUpdateView: undefined,
    checkNoChangesView: undefined,
    destroyView: undefined,
    resolveDep: undefined,
    createDebugContext: undefined,
    handleEvent: undefined,
    updateDirectives: undefined,
    updateRenderer: undefined,
    dirtyParentQueries: undefined,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy92aWV3L3R5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBOFhILDhFQUE4RTtBQUM5RSxzRkFBc0Y7QUFDdEYsNEVBQTRFO0FBQzVFLFdBQVc7QUFDWCx3QkFDSSxJQUFjLEVBQUUsY0FBeUIsRUFBRSxZQUF1QjtJQUNwRSxvRUFBb0U7SUFDcEUsd0VBQXdFO0lBQ3hFLDRFQUE0RTtJQUM1RSw0RUFBNEU7SUFDNUUsNkVBQTZFO0lBQzdFLDZFQUE2RTtJQUM3RSwwRUFBMEU7SUFDMUUsZ0ZBQWdGO0lBQ2hGLCtCQUErQjtJQUMvQixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3pCLElBQU0sU0FBUyxHQUFHLEtBQUssNEJBQTJCLENBQUM7SUFDbkQsSUFBSSxTQUFTLEtBQUssY0FBYyxFQUFFO1FBQ2hDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLEdBQUcsMEJBQXlCLENBQUMsR0FBRyxZQUFZLENBQUM7UUFDaEUsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNwQixPQUFPLElBQUksQ0FBQztLQUNiO0lBQ0QsT0FBTyxTQUFTLEtBQUssWUFBWSxDQUFDO0FBQ3BDLENBQUM7QUFuQkQsd0NBbUJDO0FBRUQsK0VBQStFO0FBQy9FLHdCQUF3QjtBQUN4QixxQ0FDSSxJQUFjLEVBQUUsU0FBb0IsRUFBRSxLQUFhO0lBQ3JELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyw0QkFBMkIsQ0FBQyxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLEtBQUssRUFBRTtRQUNwRixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDM0IsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQVBELGtFQU9DO0FBSUQ7Ozs7Ozs7Ozs7R0FVRztBQUNIO0lBQUE7SUFBOEMsQ0FBQztJQUFELGVBQUM7QUFBRCxDQUFDLEFBQS9DLElBQStDO0FBQWxDLDRCQUFRO0FBU3JCOztHQUVHO0FBQ0gsb0JBQTJCLElBQWMsRUFBRSxLQUFhO0lBQ3RELE9BQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBRkQsZ0NBRUM7QUErQkQ7O0dBRUc7QUFDSCx1QkFBOEIsSUFBYyxFQUFFLEtBQWE7SUFDekQsT0FBWSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFGRCxzQ0FFQztBQVNEOztHQUVHO0FBQ0gsd0JBQStCLElBQWMsRUFBRSxLQUFhO0lBQzFELE9BQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBRkQsd0NBRUM7QUFTRDs7R0FFRztBQUNILDhCQUFxQyxJQUFjLEVBQUUsS0FBYTtJQUNoRSxPQUFZLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQUZELG9EQUVDO0FBRUQ7O0dBRUc7QUFDSCxxQkFBNEIsSUFBYyxFQUFFLEtBQWE7SUFDdkQsT0FBWSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFGRCxrQ0FFQztBQWFEO0lBQUE7SUFXQSxDQUFDO0lBQUQsbUJBQUM7QUFBRCxDQUFDLEFBWEQsSUFXQztBQVhxQixvQ0FBWTtBQXVEbEM7OztHQUdHO0FBQ1UsUUFBQSxRQUFRLEdBQWE7SUFDaEMsY0FBYyxFQUFFLFNBQVc7SUFDM0IsY0FBYyxFQUFFLFNBQVc7SUFDM0Isa0JBQWtCLEVBQUUsU0FBVztJQUMvQixtQkFBbUIsRUFBRSxTQUFXO0lBQ2hDLGlCQUFpQixFQUFFLFNBQVc7SUFDOUIsZ0JBQWdCLEVBQUUsU0FBVztJQUM3QixxQkFBcUIsRUFBRSxTQUFXO0lBQ2xDLGNBQWMsRUFBRSxTQUFXO0lBQzNCLGtCQUFrQixFQUFFLFNBQVc7SUFDL0Isa0JBQWtCLEVBQUUsU0FBVztJQUMvQixXQUFXLEVBQUUsU0FBVztJQUN4QixVQUFVLEVBQUUsU0FBVztJQUN2QixrQkFBa0IsRUFBRSxTQUFXO0lBQy9CLFdBQVcsRUFBRSxTQUFXO0lBQ3hCLGdCQUFnQixFQUFFLFNBQVc7SUFDN0IsY0FBYyxFQUFFLFNBQVc7SUFDM0Isa0JBQWtCLEVBQUUsU0FBVztDQUNoQyxDQUFDIn0=