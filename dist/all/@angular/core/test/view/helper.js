"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var index_1 = require("@angular/core/src/view/index");
var testing_1 = require("@angular/core/testing");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
function isBrowser() {
    return dom_adapter_1.getDOM().supportsDOMEvents();
}
exports.isBrowser = isBrowser;
exports.ARG_TYPE_VALUES = [0 /* Inline */, 1 /* Dynamic */];
function checkNodeInlineOrDynamic(check, view, nodeIndex, argType, values) {
    switch (argType) {
        case 0 /* Inline */:
            return check.apply(void 0, [view, nodeIndex, argType].concat(values));
        case 1 /* Dynamic */:
            return check(view, nodeIndex, argType, values);
    }
}
exports.checkNodeInlineOrDynamic = checkNodeInlineOrDynamic;
function createRootView(def, context, projectableNodes, rootSelectorOrNode) {
    index_1.initServicesIfNeeded();
    return index_1.Services.createRootView(testing_1.TestBed.get(core_1.Injector), projectableNodes || [], rootSelectorOrNode, def, testing_1.TestBed.get(core_1.NgModuleRef), context);
}
exports.createRootView = createRootView;
function createEmbeddedView(parent, anchorDef, context) {
    return index_1.Services.createEmbeddedView(parent, anchorDef, anchorDef.element.template, context);
}
exports.createEmbeddedView = createEmbeddedView;
function compViewDef(nodes, updateDirectives, updateRenderer, viewFlags) {
    if (viewFlags === void 0) { viewFlags = 0 /* None */; }
    var def = index_1.viewDef(viewFlags, nodes, updateDirectives, updateRenderer);
    def.nodes.forEach(function (node, index) {
        if (node.nodeIndex !== index) {
            throw new Error('nodeIndex should be the same as the index of the node');
        }
        // This check should be removed when we start reordering nodes at runtime
        if (node.checkIndex > -1 && node.checkIndex !== node.nodeIndex) {
            throw new Error("nodeIndex and checkIndex should be the same, got " + node.nodeIndex + " !== " + node.checkIndex);
        }
    });
    return def;
}
exports.compViewDef = compViewDef;
function compViewDefFactory(nodes, updateDirectives, updateRenderer, viewFlags) {
    if (viewFlags === void 0) { viewFlags = 0 /* None */; }
    return function () { return compViewDef(nodes, updateDirectives, updateRenderer, viewFlags); };
}
exports.compViewDefFactory = compViewDefFactory;
function createAndGetRootNodes(viewDef, ctx) {
    var view = createRootView(viewDef, ctx);
    var rootNodes = index_1.rootRenderNodes(view);
    return { rootNodes: rootNodes, view: view };
}
exports.createAndGetRootNodes = createAndGetRootNodes;
var removeNodes;
beforeEach(function () { removeNodes = []; });
afterEach(function () { removeNodes.forEach(function (node) { return dom_adapter_1.getDOM().remove(node); }); });
function recordNodeToRemove(node) {
    removeNodes.push(node);
}
exports.recordNodeToRemove = recordNodeToRemove;
function callMostRecentEventListenerHandler(spy, params) {
    var mostRecent = spy.calls.mostRecent();
    if (!mostRecent) {
        return;
    }
    var obj = mostRecent.object;
    var args = mostRecent.args;
    var eventName = args[0];
    var handler = args[1];
    handler && handler.apply(obj, [{ type: eventName }]);
}
exports.callMostRecentEventListenerHandler = callMostRecentEventListenerHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3ZpZXcvaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQW9EO0FBQ3BELHNEQUFvTjtBQUNwTixpREFBOEM7QUFDOUMsNkVBQXFFO0FBRXJFO0lBQ0UsT0FBTyxvQkFBTSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztBQUN0QyxDQUFDO0FBRkQsOEJBRUM7QUFFWSxRQUFBLGVBQWUsR0FBRyxpQ0FBMkMsQ0FBQztBQUUzRSxrQ0FDSSxLQUFrQixFQUFFLElBQWMsRUFBRSxTQUFpQixFQUFFLE9BQXFCLEVBQzVFLE1BQWE7SUFDZixRQUFRLE9BQU8sRUFBRTtRQUNmO1lBQ0UsT0FBYSxLQUFNLGdCQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxTQUFLLE1BQU0sR0FBRTtRQUMzRDtZQUNFLE9BQU8sS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ2xEO0FBQ0gsQ0FBQztBQVRELDREQVNDO0FBRUQsd0JBQ0ksR0FBbUIsRUFBRSxPQUFhLEVBQUUsZ0JBQTBCLEVBQzlELGtCQUF3QjtJQUMxQiw0QkFBb0IsRUFBRSxDQUFDO0lBQ3ZCLE9BQU8sZ0JBQVEsQ0FBQyxjQUFjLENBQzFCLGlCQUFPLENBQUMsR0FBRyxDQUFDLGVBQVEsQ0FBQyxFQUFFLGdCQUFnQixJQUFJLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxHQUFHLEVBQ3RFLGlCQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFXLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6QyxDQUFDO0FBUEQsd0NBT0M7QUFFRCw0QkFBbUMsTUFBZ0IsRUFBRSxTQUFrQixFQUFFLE9BQWE7SUFDcEYsT0FBTyxnQkFBUSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxT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