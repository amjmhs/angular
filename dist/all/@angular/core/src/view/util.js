"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var change_detection_1 = require("../change_detection/change_detection");
var injector_1 = require("../di/injector");
var view_1 = require("../metadata/view");
var util_1 = require("../util");
var errors_1 = require("./errors");
var types_1 = require("./types");
exports.NOOP = function () { };
var _tokenKeyCache = new Map();
function tokenKey(token) {
    var key = _tokenKeyCache.get(token);
    if (!key) {
        key = util_1.stringify(token) + '_' + _tokenKeyCache.size;
        _tokenKeyCache.set(token, key);
    }
    return key;
}
exports.tokenKey = tokenKey;
function unwrapValue(view, nodeIdx, bindingIdx, value) {
    if (change_detection_1.WrappedValue.isWrapped(value)) {
        value = change_detection_1.WrappedValue.unwrap(value);
        var globalBindingIdx = view.def.nodes[nodeIdx].bindingIndex + bindingIdx;
        var oldValue = change_detection_1.WrappedValue.unwrap(view.oldValues[globalBindingIdx]);
        view.oldValues[globalBindingIdx] = new change_detection_1.WrappedValue(oldValue);
    }
    return value;
}
exports.unwrapValue = unwrapValue;
var UNDEFINED_RENDERER_TYPE_ID = '$$undefined';
var EMPTY_RENDERER_TYPE_ID = '$$empty';
// Attention: this function is called as top level function.
// Putting any logic in here will destroy closure tree shaking!
function createRendererType2(values) {
    return {
        id: UNDEFINED_RENDERER_TYPE_ID,
        styles: values.styles,
        encapsulation: values.encapsulation,
        data: values.data
    };
}
exports.createRendererType2 = createRendererType2;
var _renderCompCount = 0;
function resolveRendererType2(type) {
    if (type && type.id === UNDEFINED_RENDERER_TYPE_ID) {
        // first time we see this RendererType2. Initialize it...
        var isFilled = ((type.encapsulation != null && type.encapsulation !== view_1.ViewEncapsulation.None) ||
            type.styles.length || Object.keys(type.data).length);
        if (isFilled) {
            type.id = "c" + _renderCompCount++;
        }
        else {
            type.id = EMPTY_RENDERER_TYPE_ID;
        }
    }
    if (type && type.id === EMPTY_RENDERER_TYPE_ID) {
        type = null;
    }
    return type || null;
}
exports.resolveRendererType2 = resolveRendererType2;
function checkBinding(view, def, bindingIdx, value) {
    var oldValues = view.oldValues;
    if ((view.state & 2 /* FirstCheck */) ||
        !util_1.looseIdentical(oldValues[def.bindingIndex + bindingIdx], value)) {
        return true;
    }
    return false;
}
exports.checkBinding = checkBinding;
function checkAndUpdateBinding(view, def, bindingIdx, value) {
    if (checkBinding(view, def, bindingIdx, value)) {
        view.oldValues[def.bindingIndex + bindingIdx] = value;
        return true;
    }
    return false;
}
exports.checkAndUpdateBinding = checkAndUpdateBinding;
function checkBindingNoChanges(view, def, bindingIdx, value) {
    var oldValue = view.oldValues[def.bindingIndex + bindingIdx];
    if ((view.state & 1 /* BeforeFirstCheck */) || !change_detection_1.devModeEqual(oldValue, value)) {
        var bindingName = def.bindings[bindingIdx].name;
        throw errors_1.expressionChangedAfterItHasBeenCheckedError(types_1.Services.createDebugContext(view, def.nodeIndex), bindingName + ": " + oldValue, bindingName + ": " + value, (view.state & 1 /* BeforeFirstCheck */) !== 0);
    }
}
exports.checkBindingNoChanges = checkBindingNoChanges;
function markParentViewsForCheck(view) {
    var currView = view;
    while (currView) {
        if (currView.def.flags & 2 /* OnPush */) {
            currView.state |= 8 /* ChecksEnabled */;
        }
        currView = currView.viewContainerParent || currView.parent;
    }
}
exports.markParentViewsForCheck = markParentViewsForCheck;
function markParentViewsForCheckProjectedViews(view, endView) {
    var currView = view;
    while (currView && currView !== endView) {
        currView.state |= 64 /* CheckProjectedViews */;
        currView = currView.viewContainerParent || currView.parent;
    }
}
exports.markParentViewsForCheckProjectedViews = markParentViewsForCheckProjectedViews;
function dispatchEvent(view, nodeIndex, eventName, event) {
    try {
        var nodeDef = view.def.nodes[nodeIndex];
        var startView = nodeDef.flags & 33554432 /* ComponentView */ ?
            types_1.asElementData(view, nodeIndex).componentView :
            view;
        markParentViewsForCheck(startView);
        return types_1.Services.handleEvent(view, nodeIndex, eventName, event);
    }
    catch (e) {
        // Attention: Don't rethrow, as it would cancel Observable subscriptions!
        view.root.errorHandler.handleError(e);
    }
}
exports.dispatchEvent = dispatchEvent;
function declaredViewContainer(view) {
    if (view.parent) {
        var parentView = view.parent;
        return types_1.asElementData(parentView, view.parentNodeDef.nodeIndex);
    }
    return null;
}
exports.declaredViewContainer = declaredViewContainer;
/**
 * for component views, this is the host element.
 * for embedded views, this is the index of the parent node
 * that contains the view container.
 */
function viewParentEl(view) {
    var parentView = view.parent;
    if (parentView) {
        return view.parentNodeDef.parent;
    }
    else {
        return null;
    }
}
exports.viewParentEl = viewParentEl;
function renderNode(view, def) {
    switch (def.flags & 201347067 /* Types */) {
        case 1 /* TypeElement */:
            return types_1.asElementData(view, def.nodeIndex).renderElement;
        case 2 /* TypeText */:
            return types_1.asTextData(view, def.nodeIndex).renderText;
    }
}
exports.renderNode = renderNode;
function elementEventFullName(target, name) {
    return target ? target + ":" + name : name;
}
exports.elementEventFullName = elementEventFullName;
function isComponentView(view) {
    return !!view.parent && !!(view.parentNodeDef.flags & 32768 /* Component */);
}
exports.isComponentView = isComponentView;
function isEmbeddedView(view) {
    return !!view.parent && !(view.parentNodeDef.flags & 32768 /* Component */);
}
exports.isEmbeddedView = isEmbeddedView;
function filterQueryId(queryId) {
    return 1 << (queryId % 32);
}
exports.filterQueryId = filterQueryId;
function splitMatchedQueriesDsl(matchedQueriesDsl) {
    var matchedQueries = {};
    var matchedQueryIds = 0;
    var references = {};
    if (matchedQueriesDsl) {
        matchedQueriesDsl.forEach(function (_a) {
            var queryId = _a[0], valueType = _a[1];
            if (typeof queryId === 'number') {
                matchedQueries[queryId] = valueType;
                matchedQueryIds |= filterQueryId(queryId);
            }
            else {
                references[queryId] = valueType;
            }
        });
    }
    return { matchedQueries: matchedQueries, references: references, matchedQueryIds: matchedQueryIds };
}
exports.splitMatchedQueriesDsl = splitMatchedQueriesDsl;
function splitDepsDsl(deps, sourceName) {
    return deps.map(function (value) {
        var token;
        var flags;
        if (Array.isArray(value)) {
            flags = value[0], token = value[1];
        }
        else {
            flags = 0 /* None */;
            token = value;
        }
        if (token && (typeof token === 'function' || typeof token === 'object') && sourceName) {
            Object.defineProperty(token, injector_1.SOURCE, { value: sourceName, configurable: true });
        }
        return { flags: flags, token: token, tokenKey: tokenKey(token) };
    });
}
exports.splitDepsDsl = splitDepsDsl;
function getParentRenderElement(view, renderHost, def) {
    var renderParent = def.renderParent;
    if (renderParent) {
        if ((renderParent.flags & 1 /* TypeElement */) === 0 ||
            (renderParent.flags & 33554432 /* ComponentView */) === 0 ||
            (renderParent.element.componentRendererType &&
                renderParent.element.componentRendererType.encapsulation ===
                    view_1.ViewEncapsulation.Native)) {
            // only children of non components, or children of components with native encapsulation should
            // be attached.
            return types_1.asElementData(view, def.renderParent.nodeIndex).renderElement;
        }
    }
    else {
        return renderHost;
    }
}
exports.getParentRenderElement = getParentRenderElement;
var DEFINITION_CACHE = new WeakMap();
function resolveDefinition(factory) {
    var value = DEFINITION_CACHE.get(factory);
    if (!value) {
        value = factory(function () { return exports.NOOP; });
        value.factory = factory;
        DEFINITION_CACHE.set(factory, value);
    }
    return value;
}
exports.resolveDefinition = resolveDefinition;
function rootRenderNodes(view) {
    var renderNodes = [];
    visitRootRenderNodes(view, 0 /* Collect */, undefined, undefined, renderNodes);
    return renderNodes;
}
exports.rootRenderNodes = rootRenderNodes;
function visitRootRenderNodes(view, action, parentNode, nextSibling, target) {
    // We need to re-compute the parent node in case the nodes have been moved around manually
    if (action === 3 /* RemoveChild */) {
        parentNode = view.renderer.parentNode(renderNode(view, view.def.lastRenderRootNode));
    }
    visitSiblingRenderNodes(view, action, 0, view.def.nodes.length - 1, parentNode, nextSibling, target);
}
exports.visitRootRenderNodes = visitRootRenderNodes;
function visitSiblingRenderNodes(view, action, startIndex, endIndex, parentNode, nextSibling, target) {
    for (var i = startIndex; i <= endIndex; i++) {
        var nodeDef = view.def.nodes[i];
        if (nodeDef.flags & (1 /* TypeElement */ | 2 /* TypeText */ | 8 /* TypeNgContent */)) {
            visitRenderNode(view, nodeDef, action, parentNode, nextSibling, target);
        }
        // jump to next sibling
        i += nodeDef.childCount;
    }
}
exports.visitSiblingRenderNodes = visitSiblingRenderNodes;
function visitProjectedRenderNodes(view, ngContentIndex, action, parentNode, nextSibling, target) {
    var compView = view;
    while (compView && !isComponentView(compView)) {
        compView = compView.parent;
    }
    var hostView = compView.parent;
    var hostElDef = viewParentEl(compView);
    var startIndex = hostElDef.nodeIndex + 1;
    var endIndex = hostElDef.nodeIndex + hostElDef.childCount;
    for (var i = startIndex; i <= endIndex; i++) {
        var nodeDef = hostView.def.nodes[i];
        if (nodeDef.ngContentIndex === ngContentIndex) {
            visitRenderNode(hostView, nodeDef, action, parentNode, nextSibling, target);
        }
        // jump to next sibling
        i += nodeDef.childCount;
    }
    if (!hostView.parent) {
        // a root view
        var projectedNodes = view.root.projectableNodes[ngContentIndex];
        if (projectedNodes) {
            for (var i = 0; i < projectedNodes.length; i++) {
                execRenderNodeAction(view, projectedNodes[i], action, parentNode, nextSibling, target);
            }
        }
    }
}
exports.visitProjectedRenderNodes = visitProjectedRenderNodes;
function visitRenderNode(view, nodeDef, action, parentNode, nextSibling, target) {
    if (nodeDef.flags & 8 /* TypeNgContent */) {
        visitProjectedRenderNodes(view, nodeDef.ngContent.index, action, parentNode, nextSibling, target);
    }
    else {
        var rn = renderNode(view, nodeDef);
        if (action === 3 /* RemoveChild */ && (nodeDef.flags & 33554432 /* ComponentView */) &&
            (nodeDef.bindingFlags & 48 /* CatSyntheticProperty */)) {
            // Note: we might need to do both actions.
            if (nodeDef.bindingFlags & (16 /* SyntheticProperty */)) {
                execRenderNodeAction(view, rn, action, parentNode, nextSibling, target);
            }
            if (nodeDef.bindingFlags & (32 /* SyntheticHostProperty */)) {
                var compView = types_1.asElementData(view, nodeDef.nodeIndex).componentView;
                execRenderNodeAction(compView, rn, action, parentNode, nextSibling, target);
            }
        }
        else {
            execRenderNodeAction(view, rn, action, parentNode, nextSibling, target);
        }
        if (nodeDef.flags & 16777216 /* EmbeddedViews */) {
            var embeddedViews = types_1.asElementData(view, nodeDef.nodeIndex).viewContainer._embeddedViews;
            for (var k = 0; k < embeddedViews.length; k++) {
                visitRootRenderNodes(embeddedViews[k], action, parentNode, nextSibling, target);
            }
        }
        if (nodeDef.flags & 1 /* TypeElement */ && !nodeDef.element.name) {
            visitSiblingRenderNodes(view, action, nodeDef.nodeIndex + 1, nodeDef.nodeIndex + nodeDef.childCount, parentNode, nextSibling, target);
        }
    }
}
function execRenderNodeAction(view, renderNode, action, parentNode, nextSibling, target) {
    var renderer = view.renderer;
    switch (action) {
        case 1 /* AppendChild */:
            renderer.appendChild(parentNode, renderNode);
            break;
        case 2 /* InsertBefore */:
            renderer.insertBefore(parentNode, renderNode, nextSibling);
            break;
        case 3 /* RemoveChild */:
            renderer.removeChild(parentNode, renderNode);
            break;
        case 0 /* Collect */:
            target.push(renderNode);
            break;
    }
}
var NS_PREFIX_RE = /^:([^:]+):(.+)$/;
function splitNamespace(name) {
    if (name[0] === ':') {
        var match = name.match(NS_PREFIX_RE);
        return [match[1], match[2]];
    }
    return ['', name];
}
exports.splitNamespace = splitNamespace;
function calcBindingFlags(bindings) {
    var flags = 0;
    for (var i = 0; i < bindings.length; i++) {
        flags |= bindings[i].flags;
    }
    return flags;
}
exports.calcBindingFlags = calcBindingFlags;
function interpolate(valueCount, constAndInterp) {
    var result = '';
    for (var i = 0; i < valueCount * 2; i = i + 2) {
        result = result + constAndInterp[i] + _toStringWithNull(constAndInterp[i + 1]);
    }
    return result + constAndInterp[valueCount * 2];
}
exports.interpolate = interpolate;
function inlineInterpolate(valueCount, c0, a1, c1, a2, c2, a3, c3, a4, c4, a5, c5, a6, c6, a7, c7, a8, c8, a9, c9) {
    switch (valueCount) {
        case 1:
            return c0 + _toStringWithNull(a1) + c1;
        case 2:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2;
        case 3:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                c3;
        case 4:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                c3 + _toStringWithNull(a4) + c4;
        case 5:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5;
        case 6:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6;
        case 7:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) +
                c6 + _toStringWithNull(a7) + c7;
        case 8:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) +
                c6 + _toStringWithNull(a7) + c7 + _toStringWithNull(a8) + c8;
        case 9:
            return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) +
                c6 + _toStringWithNull(a7) + c7 + _toStringWithNull(a8) + c8 + _toStringWithNull(a9) + c9;
        default:
            throw new Error("Does not support more than 9 expressions");
    }
}
exports.inlineInterpolate = inlineInterpolate;
function _toStringWithNull(v) {
    return v != null ? v.toString() : '';
}
exports.EMPTY_ARRAY = [];
exports.EMPTY_MAP = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3ZpZXcvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHlFQUFnRjtBQUNoRiwyQ0FBc0M7QUFDdEMseUNBQW1EO0FBRW5ELGdDQUFrRDtBQUNsRCxtQ0FBcUU7QUFDckUsaUNBQStQO0FBRWxQLFFBQUEsSUFBSSxHQUFRLGNBQU8sQ0FBQyxDQUFDO0FBRWxDLElBQU0sY0FBYyxHQUFHLElBQUksR0FBRyxFQUFlLENBQUM7QUFFOUMsa0JBQXlCLEtBQVU7SUFDakMsSUFBSSxHQUFHLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQyxJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ1IsR0FBRyxHQUFHLGdCQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUM7UUFDbkQsY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDaEM7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFQRCw0QkFPQztBQUVELHFCQUE0QixJQUFjLEVBQUUsT0FBZSxFQUFFLFVBQWtCLEVBQUUsS0FBVTtJQUN6RixJQUFJLCtCQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ2pDLEtBQUssR0FBRywrQkFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxJQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUM7UUFDM0UsSUFBTSxRQUFRLEdBQUcsK0JBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDdkUsSUFB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