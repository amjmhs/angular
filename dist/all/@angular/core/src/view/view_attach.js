"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var util_1 = require("./util");
function attachEmbeddedView(parentView, elementData, viewIndex, view) {
    var embeddedViews = elementData.viewContainer._embeddedViews;
    if (viewIndex === null || viewIndex === undefined) {
        viewIndex = embeddedViews.length;
    }
    view.viewContainerParent = parentView;
    addToArray(embeddedViews, viewIndex, view);
    attachProjectedView(elementData, view);
    types_1.Services.dirtyParentQueries(view);
    var prevView = viewIndex > 0 ? embeddedViews[viewIndex - 1] : null;
    renderAttachEmbeddedView(elementData, prevView, view);
}
exports.attachEmbeddedView = attachEmbeddedView;
function attachProjectedView(vcElementData, view) {
    var dvcElementData = util_1.declaredViewContainer(view);
    if (!dvcElementData || dvcElementData === vcElementData ||
        view.state & 16 /* IsProjectedView */) {
        return;
    }
    // Note: For performance reasons, we
    // - add a view to template._projectedViews only 1x throughout its lifetime,
    //   and remove it not until the view is destroyed.
    //   (hard, as when a parent view is attached/detached we would need to attach/detach all
    //    nested projected views as well, even across component boundaries).
    // - don't track the insertion order of views in the projected views array
    //   (hard, as when the views of the same template are inserted different view containers)
    view.state |= 16 /* IsProjectedView */;
    var projectedViews = dvcElementData.template._projectedViews;
    if (!projectedViews) {
        projectedViews = dvcElementData.template._projectedViews = [];
    }
    projectedViews.push(view);
    // Note: we are changing the NodeDef here as we cannot calculate
    // the fact whether a template is used for projection during compilation.
    markNodeAsProjectedTemplate(view.parent.def, view.parentNodeDef);
}
function markNodeAsProjectedTemplate(viewDef, nodeDef) {
    if (nodeDef.flags & 4 /* ProjectedTemplate */) {
        return;
    }
    viewDef.nodeFlags |= 4 /* ProjectedTemplate */;
    nodeDef.flags |= 4 /* ProjectedTemplate */;
    var parentNodeDef = nodeDef.parent;
    while (parentNodeDef) {
        parentNodeDef.childFlags |= 4 /* ProjectedTemplate */;
        parentNodeDef = parentNodeDef.parent;
    }
}
function detachEmbeddedView(elementData, viewIndex) {
    var embeddedViews = elementData.viewContainer._embeddedViews;
    if (viewIndex == null || viewIndex >= embeddedViews.length) {
        viewIndex = embeddedViews.length - 1;
    }
    if (viewIndex < 0) {
        return null;
    }
    var view = embeddedViews[viewIndex];
    view.viewContainerParent = null;
    removeFromArray(embeddedViews, viewIndex);
    // See attachProjectedView for why we don't update projectedViews here.
    types_1.Services.dirtyParentQueries(view);
    renderDetachView(view);
    return view;
}
exports.detachEmbeddedView = detachEmbeddedView;
function detachProjectedView(view) {
    if (!(view.state & 16 /* IsProjectedView */)) {
        return;
    }
    var dvcElementData = util_1.declaredViewContainer(view);
    if (dvcElementData) {
        var projectedViews = dvcElementData.template._projectedViews;
        if (projectedViews) {
            removeFromArray(projectedViews, projectedViews.indexOf(view));
            types_1.Services.dirtyParentQueries(view);
        }
    }
}
exports.detachProjectedView = detachProjectedView;
function moveEmbeddedView(elementData, oldViewIndex, newViewIndex) {
    var embeddedViews = elementData.viewContainer._embeddedViews;
    var view = embeddedViews[oldViewIndex];
    removeFromArray(embeddedViews, oldViewIndex);
    if (newViewIndex == null) {
        newViewIndex = embeddedViews.length;
    }
    addToArray(embeddedViews, newViewIndex, view);
    // Note: Don't need to change projectedViews as the order in there
    // as always invalid...
    types_1.Services.dirtyParentQueries(view);
    renderDetachView(view);
    var prevView = newViewIndex > 0 ? embeddedViews[newViewIndex - 1] : null;
    renderAttachEmbeddedView(elementData, prevView, view);
    return view;
}
exports.moveEmbeddedView = moveEmbeddedView;
function renderAttachEmbeddedView(elementData, prevView, view) {
    var prevRenderNode = prevView ? util_1.renderNode(prevView, prevView.def.lastRenderRootNode) :
        elementData.renderElement;
    var parentNode = view.renderer.parentNode(prevRenderNode);
    var nextSibling = view.renderer.nextSibling(prevRenderNode);
    // Note: We can't check if `nextSibling` is present, as on WebWorkers it will always be!
    // However, browsers automatically do `appendChild` when there is no `nextSibling`.
    util_1.visitRootRenderNodes(view, 2 /* InsertBefore */, parentNode, nextSibling, undefined);
}
function renderDetachView(view) {
    util_1.visitRootRenderNodes(view, 3 /* RemoveChild */, null, null, undefined);
}
exports.renderDetachView = renderDetachView;
function addToArray(arr, index, value) {
    // perf: array.push is faster than array.splice!
    if (index >= arr.length) {
        arr.push(value);
    }
    else {
        arr.splice(index, 0, value);
    }
}
function removeFromArray(arr, index) {
    // perf: array.pop is faster than array.splice!
    if (index >= arr.length - 1) {
        arr.pop();
    }
    else {
        arr.splice(index, 1);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19hdHRhY2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy92aWV3L3ZpZXdfYXR0YWNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsaUNBQXVHO0FBQ3ZHLCtCQUFrSDtBQUVsSCw0QkFDSSxVQUFvQixFQUFFLFdBQXdCLEVBQUUsU0FBb0MsRUFDcEYsSUFBYztJQUNoQixJQUFJLGFBQWEsR0FBRyxXQUFXLENBQUMsYUFBZSxDQUFDLGNBQWMsQ0FBQztJQUMvRCxJQUFJLFNBQVMsS0FBSyxJQUFJLElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRTtRQUNqRCxTQUFTLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztLQUNsQztJQUNELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxVQUFVLENBQUM7SUFDdEMsVUFBVSxDQUFDLGFBQWEsRUFBRSxTQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDN0MsbUJBQW1CLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBRXZDLGdCQUFRLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFbEMsSUFBTSxRQUFRLEdBQUcsU0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFNBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3pFLHdCQUF3QixDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDeEQsQ0FBQztBQWZELGdEQWVDO0FBRUQsNkJBQTZCLGFBQTBCLEVBQUUsSUFBYztJQUNyRSxJQUFNLGNBQWMsR0FBRyw0QkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuRCxJQUFJLENBQUMsY0FBYyxJQUFJLGNBQWMsS0FBSyxhQUFhO1FBQ25ELElBQUksQ0FBQyxLQUFLLDJCQUE0QixFQUFFO1FBQzFDLE9BQU87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