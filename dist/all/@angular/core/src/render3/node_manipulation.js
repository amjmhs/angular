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
var hooks_1 = require("./hooks");
var container_1 = require("./interfaces/container");
var node_1 = require("./interfaces/node");
var projection_1 = require("./interfaces/projection");
var renderer_1 = require("./interfaces/renderer");
var view_1 = require("./interfaces/view");
var node_assert_1 = require("./node_assert");
var util_1 = require("./util");
var unusedValueToPlacateAjd = container_1.unusedValueExportToPlacateAjd + node_1.unusedValueExportToPlacateAjd + projection_1.unusedValueExportToPlacateAjd + renderer_1.unusedValueExportToPlacateAjd + view_1.unusedValueExportToPlacateAjd;
/** Retrieves the sibling node for the given node. */
function getNextLNode(node) {
    // View nodes don't have TNodes, so their next must be retrieved through their LView.
    if (node.tNode.type === 2 /* View */) {
        var viewData = node.data;
        return viewData[view_1.NEXT] ? viewData[view_1.NEXT][view_1.HOST_NODE] : null;
    }
    return node.tNode.next ? node.view[node.tNode.next.index] : null;
}
exports.getNextLNode = getNextLNode;
/** Retrieves the first child of a given node */
function getChildLNode(node) {
    if (node.tNode.child) {
        var viewData = node.tNode.type === 2 /* View */ ? node.data : node.view;
        return util_1.readElementValue(viewData[node.tNode.child.index]);
    }
    return null;
}
exports.getChildLNode = getChildLNode;
function getParentLNode(node) {
    if (node.tNode.index === -1 && node.tNode.type === 2 /* View */) {
        // This is a dynamically created view inside a dynamic container.
        // If the host index is -1, the view has not yet been inserted, so it has no parent.
        var containerHostIndex = node.data[view_1.CONTAINER_INDEX];
        return containerHostIndex === -1 ? null : node.view[containerHostIndex].dynamicLContainerNode;
    }
    var parent = node.tNode.parent;
    return util_1.readElementValue(parent ? node.view[parent.index] : node.view[view_1.HOST_NODE]);
}
exports.getParentLNode = getParentLNode;
/**
 * Stack used to keep track of projection nodes in walkLNodeTree.
 *
 * This is deliberately created outside of walkLNodeTree to avoid allocating
 * a new array each time the function is called. Instead the array will be
 * re-used by each invocation. This works because the function is not reentrant.
 */
var projectionNodeStack = [];
/**
 * Walks a tree of LNodes, applying a transformation on the LElement nodes, either only on the first
 * one found, or on all of them.
 *
 * @param startingNode the node from which the walk is started.
 * @param rootNode the root node considered. This prevents walking past that node.
 * @param action identifies the action to be performed on the LElement nodes.
 * @param renderer the current renderer.
 * @param renderParentNode Optional the render parent node to be set in all LContainerNodes found,
 * required for action modes Insert and Destroy.
 * @param beforeNode Optional the node before which elements should be added, required for action
 * Insert.
 */
function walkLNodeTree(startingNode, rootNode, action, renderer, renderParentNode, beforeNode) {
    var node = startingNode;
    var projectionNodeIndex = -1;
    while (node) {
        var nextNode = null;
        var parent_1 = renderParentNode ? renderParentNode.native : null;
        var nodeType = node.tNode.type;
        if (nodeType === 3 /* Element */) {
            // Execute the action
            executeNodeAction(action, renderer, parent_1, node.native, beforeNode);
            if (node.dynamicLContainerNode) {
                executeNodeAction(action, renderer, parent_1, node.dynamicLContainerNode.native, beforeNode);
            }
        }
        else if (nodeType === 0 /* Container */) {
            executeNodeAction(action, renderer, parent_1, node.native, beforeNode);
            var lContainerNode = node;
            var childContainerData = lContainerNode.dynamicLContainerNode ?
                lContainerNode.dynamicLContainerNode.data :
                lContainerNode.data;
            if (renderParentNode) {
                childContainerData[container_1.RENDER_PARENT] = renderParentNode;
            }
            nextNode =
                childContainerData[container_1.VIEWS].length ? getChildLNode(childContainerData[container_1.VIEWS][0]) : null;
            if (nextNode) {
                // When the walker enters a container, then the beforeNode has to become the local native
                // comment node.
                beforeNode = lContainerNode.dynamicLContainerNode ?
                    lContainerNode.dynamicLContainerNode.native :
                    lContainerNode.native;
            }
        }
        else if (nodeType === 1 /* Projection */) {
            var componentHost = findComponentHost(node.view);
            var head = componentHost.tNode.projection[node.tNode.projection];
            projectionNodeStack[++projectionNodeIndex] = node;
            nextNode = head ? componentHost.data[view_1.PARENT][head.index] : null;
        }
        else {
            // Otherwise look at the first child
            nextNode = getChildLNode(node);
        }
        if (nextNode === null) {
            nextNode = getNextLNode(node);
            // this last node was projected, we need to get back down to its projection node
            if (nextNode === null && (node.tNode.flags & 8192 /* isProjected */)) {
                nextNode = getNextLNode(projectionNodeStack[projectionNodeIndex--]);
            }
            /**
             * Find the next node in the LNode tree, taking into account the place where a node is
             * projected (in the shadow DOM) rather than where it comes from (in the light DOM).
             *
             * If there is no sibling node, then it goes to the next sibling of the parent node...
             * until it reaches rootNode (at which point null is returned).
             */
            while (node && !nextNode) {
                node = getParentLNode(node);
                if (node === null || node === rootNode)
                    return null;
                // When exiting a container, the beforeNode must be restored to the previous value
                if (!node.tNode.next && nodeType === 0 /* Container */) {
                    beforeNode = node.native;
                }
                nextNode = getNextLNode(node);
            }
        }
        node = nextNode;
    }
}
/**
 * Given a current view, finds the nearest component's host (LElement).
 *
 * @param lViewData LViewData for which we want a host element node
 * @returns The host node
 */
function findComponentHost(lViewData) {
    var viewRootLNode = lViewData[view_1.HOST_NODE];
    while (viewRootLNode.tNode.type === 2 /* View */) {
        ngDevMode && assert_1.assertDefined(lViewData[view_1.PARENT], 'lViewData.parent');
        lViewData = lViewData[view_1.PARENT];
        viewRootLNode = lViewData[view_1.HOST_NODE];
    }
    ngDevMode && node_assert_1.assertNodeType(viewRootLNode, 3 /* Element */);
    ngDevMode && assert_1.assertDefined(viewRootLNode.data, 'node.data');
    return viewRootLNode;
}
exports.findComponentHost = findComponentHost;
/**
 * NOTE: for performance reasons, the possible actions are inlined within the function instead of
 * being passed as an argument.
 */
function executeNodeAction(action, renderer, parent, node, beforeNode) {
    if (action === 0 /* Insert */) {
        renderer_1.isProceduralRenderer(renderer) ?
            renderer.insertBefore(parent, node, beforeNode) :
            parent.insertBefore(node, beforeNode, true);
    }
    else if (action === 1 /* Detach */) {
        renderer_1.isProceduralRenderer(renderer) ?
            renderer.removeChild(parent, node) :
            parent.removeChild(node);
    }
    else if (action === 2 /* Destroy */) {
        ngDevMode && ngDevMode.rendererDestroyNode++;
        renderer.destroyNode(node);
    }
}
function createTextNode(value, renderer) {
    return renderer_1.isProceduralRenderer(renderer) ? renderer.createText(util_1.stringify(value)) :
        renderer.createTextNode(util_1.stringify(value));
}
exports.createTextNode = createTextNode;
function addRemoveViewFromContainer(container, rootNode, insertMode, beforeNode) {
    ngDevMode && node_assert_1.assertNodeType(container, 0 /* Container */);
    ngDevMode && node_assert_1.assertNodeType(rootNode, 2 /* View */);
    var parentNode = container.data[container_1.RENDER_PARENT];
    var parent = parentNode ? parentNode.native : null;
    if (parent) {
        var node = getChildLNode(rootNode);
        var renderer = container.view[view_1.RENDERER];
        walkLNodeTree(node, rootNode, insertMode ? 0 /* Insert */ : 1 /* Detach */, renderer, parentNode, beforeNode);
    }
}
exports.addRemoveViewFromContainer = addRemoveViewFromContainer;
/**
 * Traverses down and up the tree of views and containers to remove listeners and
 * call onDestroy callbacks.
 *
 * Notes:
 *  - Because it's used for onDestroy calls, it needs to be bottom-up.
 *  - Must process containers instead of their views to avoid splicing
 *  when views are destroyed and re-added.
 *  - Using a while loop because it's faster than recursion
 *  - Destroy only called on movement to sibling or movement to parent (laterally or up)
 *
 *  @param rootView The view to destroy
 */
function destroyViewTree(rootView) {
    // If the view has no children, we can clean it up and return early.
    if (rootView[view_1.TVIEW].childIndex === -1) {
        return cleanUpView(rootView);
    }
    var viewOrContainer = getLViewChild(rootView);
    while (viewOrContainer) {
        var next = null;
        if (viewOrContainer.length >= view_1.HEADER_OFFSET) {
            // If LViewData, traverse down to child.
            var view = viewOrContainer;
            if (view[view_1.TVIEW].childIndex > -1)
                next = getLViewChild(view);
        }
        else {
            // If container, traverse down to its first LViewData.
            var container = viewOrContainer;
            if (container[container_1.VIEWS].length)
                next = container[container_1.VIEWS][0].data;
        }
        if (next == null) {
            // Only clean up view when moving to the side or up, as destroy hooks
            // should be called in order from the bottom up.
            while (viewOrContainer && !viewOrContainer[view_1.NEXT] && viewOrContainer !== rootView) {
                cleanUpView(viewOrContainer);
                viewOrContainer = getParentState(viewOrContainer, rootView);
            }
            cleanUpView(viewOrContainer || rootView);
            next = viewOrContainer && viewOrContainer[view_1.NEXT];
        }
        viewOrContainer = next;
    }
}
exports.destroyViewTree = destroyViewTree;
/**
 * Inserts a view into a container.
 *
 * This adds the view to the container's array of active views in the correct
 * position. It also adds the view's elements to the DOM if the container isn't a
 * root node of another view (in that case, the view's elements will be added when
 * the container's parent view is added later).
 *
 * @param container The container into which the view should be inserted
 * @param viewNode The view to insert
 * @param index The index at which to insert the view
 * @returns The inserted view
 */
function insertView(container, viewNode, index) {
    var state = container.data;
    var views = state[container_1.VIEWS];
    var lView = viewNode.data;
    if (index > 0) {
        // This is a new view, we need to add it to the children.
        views[index - 1].data[view_1.NEXT] = lView;
    }
    if (index < views.length) {
        lView[view_1.NEXT] = views[index].data;
        views.splice(index, 0, viewNode);
    }
    else {
        views.push(viewNode);
        lView[view_1.NEXT] = null;
    }
    // Dynamically inserted views need a reference to their parent container'S host so it's
    // possible to jump from a view to its container's next when walking the node tree.
    if (viewNode.tNode.index === -1) {
        lView[view_1.CONTAINER_INDEX] = container.tNode.parent.index;
        viewNode.view = container.view;
    }
    // Notify query that a new view has been added
    if (lView[view_1.QUERIES]) {
        lView[view_1.QUERIES].insertView(index);
    }
    // Sets the attached flag
    lView[view_1.FLAGS] |= 8 /* Attached */;
    return viewNode;
}
exports.insertView = insertView;
/**
 * Detaches a view from a container.
 *
 * This method splices the view from the container's array of active views. It also
 * removes the view's elements from the DOM.
 *
 * @param container The container from which to detach a view
 * @param removeIndex The index of the view to detach
 * @returns The detached view
 */
function detachView(container, removeIndex) {
    var views = container.data[container_1.VIEWS];
    var viewNode = views[removeIndex];
    if (removeIndex > 0) {
        views[removeIndex - 1].data[view_1.NEXT] = viewNode.data[view_1.NEXT];
    }
    views.splice(removeIndex, 1);
    if (!container.tNode.detached) {
        addRemoveViewFromContainer(container, viewNode, false);
    }
    // Notify query that view has been removed
    var removedLView = viewNode.data;
    if (removedLView[view_1.QUERIES]) {
        removedLView[view_1.QUERIES].removeView();
    }
    removedLView[view_1.CONTAINER_INDEX] = -1;
    viewNode.view = null;
    // Unsets the attached flag
    viewNode.data[view_1.FLAGS] &= ~8 /* Attached */;
    return viewNode;
}
exports.detachView = detachView;
/**
 * Removes a view from a container, i.e. detaches it and then destroys the underlying LView.
 *
 * @param container The container from which to remove a view
 * @param removeIndex The index of the view to remove
 * @returns The removed view
 */
function removeView(container, removeIndex) {
    var viewNode = container.data[container_1.VIEWS][removeIndex];
    detachView(container, removeIndex);
    destroyLView(viewNode.data);
    return viewNode;
}
exports.removeView = removeView;
/** Gets the child of the given LViewData */
function getLViewChild(viewData) {
    if (viewData[view_1.TVIEW].childIndex === -1)
        return null;
    var hostNode = viewData[viewData[view_1.TVIEW].childIndex];
    return hostNode.data ? hostNode.data : hostNode.dynamicLContainerNode.data;
}
exports.getLViewChild = getLViewChild;
/**
 * A standalone function which destroys an LView,
 * conducting cleanup (e.g. removing listeners, calling onDestroys).
 *
 * @param view The view to be destroyed.
 */
function destroyLView(view) {
    var renderer = view[view_1.RENDERER];
    if (renderer_1.isProceduralRenderer(renderer) && renderer.destroyNode) {
        walkLNodeTree(view[view_1.HOST_NODE], view[view_1.HOST_NODE], 2 /* Destroy */, renderer);
    }
    destroyViewTree(view);
    // Sets the destroyed flag
    view[view_1.FLAGS] |= 32 /* Destroyed */;
}
exports.destroyLView = destroyLView;
/**
 * Determines which LViewOrLContainer to jump to when traversing back up the
 * tree in destroyViewTree.
 *
 * Normally, the view's parent LView should be checked, but in the case of
 * embedded views, the container (which is the view node's parent, but not the
 * LView's parent) needs to be checked for a possible next property.
 *
 * @param state The LViewOrLContainer for which we need a parent state
 * @param rootView The rootView, so we don't propagate too far up the view tree
 * @returns The correct parent LViewOrLContainer
 */
function getParentState(state, rootView) {
    var node;
    if ((node = state[view_1.HOST_NODE]) && node.tNode.type === 2 /* View */) {
        // if it's an embedded view, the state needs to go up to the container, in case the
        // container has a next
        return getParentLNode(node).data;
    }
    else {
        // otherwise, use parent view for containers or component views
        return state[view_1.PARENT] === rootView ? null : state[view_1.PARENT];
    }
}
exports.getParentState = getParentState;
/**
 * Removes all listeners and call all onDestroys in a given view.
 *
 * @param view The LViewData to clean up
 */
function cleanUpView(viewOrContainer) {
    if (viewOrContainer[view_1.TVIEW]) {
        var view = viewOrContainer;
        removeListeners(view);
        executeOnDestroys(view);
        executePipeOnDestroys(view);
        // For component views only, the local renderer is destroyed as clean up time.
        if (view[view_1.TVIEW].id === -1 && renderer_1.isProceduralRenderer(view[view_1.RENDERER])) {
            ngDevMode && ngDevMode.rendererDestroy++;
            view[view_1.RENDERER].destroy();
        }
    }
}
/** Removes listeners and unsubscribes from output subscriptions */
function removeListeners(viewData) {
    var cleanup = viewData[view_1.TVIEW].cleanup;
    if (cleanup != null) {
        for (var i = 0; i < cleanup.length - 1; i += 2) {
            if (typeof cleanup[i] === 'string') {
                // This is a listener with the native renderer
                var native = util_1.readElementValue(viewData[cleanup[i + 1]]).native;
                var listener = viewData[view_1.CLEANUP][cleanup[i + 2]];
                native.removeEventListener(cleanup[i], listener, cleanup[i + 3]);
                i += 2;
            }
            else if (typeof cleanup[i] === 'number') {
                // This is a listener with renderer2 (cleanup fn can be found by index)
                var cleanupFn = viewData[view_1.CLEANUP][cleanup[i]];
                cleanupFn();
            }
            else {
                // This is a cleanup function that is grouped with the index of its context
                var context = viewData[view_1.CLEANUP][cleanup[i + 1]];
                cleanup[i].call(context);
            }
        }
        viewData[view_1.CLEANUP] = null;
    }
}
/** Calls onDestroy hooks for this view */
function executeOnDestroys(view) {
    var tView = view[view_1.TVIEW];
    var destroyHooks;
    if (tView != null && (destroyHooks = tView.destroyHooks) != null) {
        hooks_1.callHooks(view[view_1.DIRECTIVES], destroyHooks);
    }
}
/** Calls pipe destroy hooks for this view */
function executePipeOnDestroys(viewData) {
    var pipeDestroyHooks = viewData[view_1.TVIEW] && viewData[view_1.TVIEW].pipeDestroyHooks;
    if (pipeDestroyHooks) {
        hooks_1.callHooks(viewData, pipeDestroyHooks);
    }
}
/**
 * Returns whether a native element can be inserted into the given parent.
 *
 * There are two reasons why we may not be able to insert a element immediately.
 * - Projection: When creating a child content element of a component, we have to skip the
 *   insertion because the content of a component will be projected.
 *   `<component><content>delayed due to projection</content></component>`
 * - Parent container is disconnected: This can happen when we are inserting a view into
 *   parent container, which itself is disconnected. For example the parent container is part
 *   of a View which has not be inserted or is mare for projection but has not been inserted
 *   into destination.
 *

 *
 * @param parent The parent where the child will be inserted into.
 * @param currentView Current LView being processed.
 * @return boolean Whether the child should be inserted now (or delayed until later).
 */
function canInsertNativeNode(parent, currentView) {
    // We can only insert into a Component or View. Any other type should be an Error.
    ngDevMode && node_assert_1.assertNodeOfPossibleTypes(parent, 3 /* Element */, 2 /* View */);
    if (parent.tNode.type === 3 /* Element */) {
        // Parent is an element.
        if (parent.view !== currentView) {
            // If the Parent view is not the same as current view than we are inserting across
            // Views. This happens when we insert a root element of the component view into
            // the component host element and it should always be eager.
            return true;
        }
        // Parent elements can be a component which may have projection.
        if (parent.data === null) {
            // Parent is a regular non-component element. We should eagerly insert into it
            // since we know that this relationship will never be broken.
            return true;
        }
        else {
            // Parent is a Component. Component's content nodes are not inserted immediately
            // because they will be projected, and so doing insert at this point would be wasteful.
            // Since the projection would than move it to its final destination.
            return false;
        }
    }
    else {
        // Parent is a View.
        ngDevMode && node_assert_1.assertNodeType(parent, 2 /* View */);
        // Because we are inserting into a `View` the `View` may be disconnected.
        var grandParentContainer = getParentLNode(parent);
        if (grandParentContainer == null) {
            // The `View` is not inserted into a `Container` we have to delay insertion.
            return false;
        }
        ngDevMode && node_assert_1.assertNodeType(grandParentContainer, 0 /* Container */);
        if (grandParentContainer.data[container_1.RENDER_PARENT] == null) {
            // The parent `Container` itself is disconnected. So we have to delay.
            return false;
        }
        else {
            // The parent `Container` is in inserted state, so we can eagerly insert into
            // this location.
            return true;
        }
    }
}
exports.canInsertNativeNode = canInsertNativeNode;
/**
 * Appends the `child` element to the `parent`.
 *
 * The element insertion might be delayed {@link canInsertNativeNode}.
 *
 * @param parent The parent to which to append the child
 * @param child The child that should be appended
 * @param currentView The current LView
 * @returns Whether or not the child was appended
 */
function appendChild(parent, child, currentView) {
    if (child !== null && canInsertNativeNode(parent, currentView)) {
        var renderer = currentView[view_1.RENDERER];
        if (parent.tNode.type === 2 /* View */) {
            var container = getParentLNode(parent);
            var renderParent = container.data[container_1.RENDER_PARENT];
            var views = container.data[container_1.VIEWS];
            var index = views.indexOf(parent);
            var beforeNode = index + 1 < views.length ? (getChildLNode(views[index + 1])).native : container.native;
            renderer_1.isProceduralRenderer(renderer) ?
                renderer.insertBefore(renderParent.native, child, beforeNode) :
                renderParent.native.insertBefore(child, beforeNode, true);
        }
        else {
            renderer_1.isProceduralRenderer(renderer) ? renderer.appendChild(parent.native, child) :
                parent.native.appendChild(child);
        }
        return true;
    }
    return false;
}
exports.appendChild = appendChild;
/**
 * Removes the `child` element of the `parent` from the DOM.
 *
 * @param parent The parent from which to remove the child
 * @param child The child that should be removed
 * @param currentView The current LView
 * @returns Whether or not the child was removed
 */
function removeChild(parent, child, currentView) {
    if (child !== null && canInsertNativeNode(parent, currentView)) {
        // We only remove the element if not in View or not projected.
        var renderer = currentView[view_1.RENDERER];
        renderer_1.isProceduralRenderer(renderer) ? renderer.removeChild(parent.native, child) :
            parent.native.removeChild(child);
        return true;
    }
    return false;
}
exports.removeChild = removeChild;
/**
 * Appends a projected node to the DOM, or in the case of a projected container,
 * appends the nodes from all of the container's active views to the DOM.
 *
 * @param node The node to process
 * @param currentParent The last parent element to be processed
 * @param currentView Current LView
 */
function appendProjectedNode(node, currentParent, currentView, renderParent) {
    appendChild(currentParent, node.native, currentView);
    if (node.tNode.type === 0 /* Container */) {
        // The node we are adding is a container and we are adding it to an element which
        // is not a component (no more re-projection).
        // Alternatively a container is projected at the root of a component's template
        // and can't be re-projected (as not content of any component).
        // Assign the final projection location in those cases.
        var lContainer = node.data;
        lContainer[container_1.RENDER_PARENT] = renderParent;
        var views = lContainer[container_1.VIEWS];
        for (var i = 0; i < views.length; i++) {
            addRemoveViewFromContainer(node, views[i], true, node.native);
        }
    }
    if (node.dynamicLContainerNode) {
        node.dynamicLContainerNode.data[container_1.RENDER_PARENT] = renderParent;
        appendChild(currentParent, node.dynamicLContainerNode.native, currentView);
    }
}
exports.appendProjectedNode = appendProjectedNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZV9tYW5pcHVsYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL25vZGVfbWFuaXB1bGF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsbUNBQXVDO0FBQ3ZDLGlDQUFrQztBQUNsQyxvREFBa0g7QUFDbEgsMENBQXFMO0FBQ3JMLHNEQUFpRjtBQUNqRixrREFBdUs7QUFDdkssMENBQTJOO0FBQzNOLDZDQUF3RTtBQUN4RSwrQkFBbUQ7QUFFbkQsSUFBTSx1QkFBdUIsR0FBRyx5Q0FBTyxHQUFHLG9DQUFPLEdBQUcsMENBQU8sR0FBRyx3Q0FBTyxHQUFHLG9DQUFPLENBQUM7QUFFaEYscURBQXFEO0FBQ3JELHNCQUE2QixJQUFXO0lBQ3RDLHFGQUFxRjtJQUNyRixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxpQkFBbUIsRUFBRTtRQUN0QyxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBaUIsQ0FBQztRQUN4QyxPQUFPLFFBQVEsQ0FBQyxXQUFJLENBQUMsQ0FBQyxDQUFDLENBQUUsUUFBUSxDQUFDLFdBQUksQ0FBZSxDQUFDLGdCQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0tBQ3pFO0lBQ0QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ25FLENBQUM7QUFQRCxvQ0FPQztBQUVELGdEQUFnRDtBQUNoRCx1QkFBOEIsSUFBVztJQUN2QyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO1FBQ3BCLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxpQkFBbUIs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