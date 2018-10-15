"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var element_ref_1 = require("../linker/element_ref");
var query_list_1 = require("../linker/query_list");
var types_1 = require("./types");
var util_1 = require("./util");
function queryDef(flags, id, bindings) {
    var bindingDefs = [];
    for (var propName in bindings) {
        var bindingType = bindings[propName];
        bindingDefs.push({ propName: propName, bindingType: bindingType });
    }
    return {
        // will bet set by the view definition
        nodeIndex: -1,
        parent: null,
        renderParent: null,
        bindingIndex: -1,
        outputIndex: -1,
        // regular values
        // TODO(vicb): check
        checkIndex: -1, flags: flags,
        childFlags: 0,
        directChildFlags: 0,
        childMatchedQueries: 0,
        ngContentIndex: -1,
        matchedQueries: {},
        matchedQueryIds: 0,
        references: {},
        childCount: 0,
        bindings: [],
        bindingFlags: 0,
        outputs: [],
        element: null,
        provider: null,
        text: null,
        query: { id: id, filterId: util_1.filterQueryId(id), bindings: bindingDefs },
        ngContent: null
    };
}
exports.queryDef = queryDef;
function createQuery() {
    return new query_list_1.QueryList();
}
exports.createQuery = createQuery;
function dirtyParentQueries(view) {
    var queryIds = view.def.nodeMatchedQueries;
    while (view.parent && util_1.isEmbeddedView(view)) {
        var tplDef = view.parentNodeDef;
        view = view.parent;
        // content queries
        var end = tplDef.nodeIndex + tplDef.childCount;
        for (var i = 0; i <= end; i++) {
            var nodeDef = view.def.nodes[i];
            if ((nodeDef.flags & 67108864 /* TypeContentQuery */) &&
                (nodeDef.flags & 536870912 /* DynamicQuery */) &&
                (nodeDef.query.filterId & queryIds) === nodeDef.query.filterId) {
                types_1.asQueryList(view, i).setDirty();
            }
            if ((nodeDef.flags & 1 /* TypeElement */ && i + nodeDef.childCount < tplDef.nodeIndex) ||
                !(nodeDef.childFlags & 67108864 /* TypeContentQuery */) ||
                !(nodeDef.childFlags & 536870912 /* DynamicQuery */)) {
                // skip elements that don't contain the template element or no query.
                i += nodeDef.childCount;
            }
        }
    }
    // view queries
    if (view.def.nodeFlags & 134217728 /* TypeViewQuery */) {
        for (var i = 0; i < view.def.nodes.length; i++) {
            var nodeDef = view.def.nodes[i];
            if ((nodeDef.flags & 134217728 /* TypeViewQuery */) && (nodeDef.flags & 536870912 /* DynamicQuery */)) {
                types_1.asQueryList(view, i).setDirty();
            }
            // only visit the root nodes
            i += nodeDef.childCount;
        }
    }
}
exports.dirtyParentQueries = dirtyParentQueries;
function checkAndUpdateQuery(view, nodeDef) {
    var queryList = types_1.asQueryList(view, nodeDef.nodeIndex);
    if (!queryList.dirty) {
        return;
    }
    var directiveInstance;
    var newValues = undefined;
    if (nodeDef.flags & 67108864 /* TypeContentQuery */) {
        var elementDef = nodeDef.parent.parent;
        newValues = calcQueryValues(view, elementDef.nodeIndex, elementDef.nodeIndex + elementDef.childCount, nodeDef.query, []);
        directiveInstance = types_1.asProviderData(view, nodeDef.parent.nodeIndex).instance;
    }
    else if (nodeDef.flags & 134217728 /* TypeViewQuery */) {
        newValues = calcQueryValues(view, 0, view.def.nodes.length - 1, nodeDef.query, []);
        directiveInstance = view.component;
    }
    queryList.reset(newValues);
    var bindings = nodeDef.query.bindings;
    var notify = false;
    for (var i = 0; i < bindings.length; i++) {
        var binding = bindings[i];
        var boundValue = void 0;
        switch (binding.bindingType) {
            case 0 /* First */:
                boundValue = queryList.first;
                break;
            case 1 /* All */:
                boundValue = queryList;
                notify = true;
                break;
        }
        directiveInstance[binding.propName] = boundValue;
    }
    if (notify) {
        queryList.notifyOnChanges();
    }
}
exports.checkAndUpdateQuery = checkAndUpdateQuery;
function calcQueryValues(view, startIndex, endIndex, queryDef, values) {
    for (var i = startIndex; i <= endIndex; i++) {
        var nodeDef = view.def.nodes[i];
        var valueType = nodeDef.matchedQueries[queryDef.id];
        if (valueType != null) {
            values.push(getQueryValue(view, nodeDef, valueType));
        }
        if (nodeDef.flags & 1 /* TypeElement */ && nodeDef.element.template &&
            (nodeDef.element.template.nodeMatchedQueries & queryDef.filterId) ===
                queryDef.filterId) {
            var elementData = types_1.asElementData(view, i);
            // check embedded views that were attached at the place of their template,
            // but process child nodes first if some match the query (see issue #16568)
            if ((nodeDef.childMatchedQueries & queryDef.filterId) === queryDef.filterId) {
                calcQueryValues(view, i + 1, i + nodeDef.childCount, queryDef, values);
                i += nodeDef.childCount;
            }
            if (nodeDef.flags & 16777216 /* EmbeddedViews */) {
                var embeddedViews = elementData.viewContainer._embeddedViews;
                for (var k = 0; k < embeddedViews.length; k++) {
                    var embeddedView = embeddedViews[k];
                    var dvc = util_1.declaredViewContainer(embeddedView);
                    if (dvc && dvc === elementData) {
                        calcQueryValues(embeddedView, 0, embeddedView.def.nodes.length - 1, queryDef, values);
                    }
                }
            }
            var projectedViews = elementData.template._projectedViews;
            if (projectedViews) {
                for (var k = 0; k < projectedViews.length; k++) {
                    var projectedView = projectedViews[k];
                    calcQueryValues(projectedView, 0, projectedView.def.nodes.length - 1, queryDef, values);
                }
            }
        }
        if ((nodeDef.childMatchedQueries & queryDef.filterId) !== queryDef.filterId) {
            // if no child matches the query, skip the children.
            i += nodeDef.childCount;
        }
    }
    return values;
}
function getQueryValue(view, nodeDef, queryValueType) {
    if (queryValueType != null) {
        // a match
        switch (queryValueType) {
            case 1 /* RenderElement */:
                return types_1.asElementData(view, nodeDef.nodeIndex).renderElement;
            case 0 /* ElementRef */:
                return new element_ref_1.ElementRef(types_1.asElementData(view, nodeDef.nodeIndex).renderElement);
            case 2 /* TemplateRef */:
                return types_1.asElementData(view, nodeDef.nodeIndex).template;
            case 3 /* ViewContainerRef */:
                return types_1.asElementData(view, nodeDef.nodeIndex).viewContainer;
            case 4 /* Provider */:
                return types_1.asProviderData(view, nodeDef.nodeIndex).instance;
        }
    }
}
exports.getQueryValue = getQueryValue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy92aWV3L3F1ZXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgscURBQWlEO0FBQ2pELG1EQUErQztBQUUvQyxpQ0FBOEo7QUFDOUosK0JBQTRFO0FBRTVFLGtCQUNJLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQWdEO0lBQ2hGLElBQUksV0FBVyxHQUFzQixFQUFFLENBQUM7SUFDeEMsS0FBSyxJQUFJLFFBQVEsSUFBSSxRQUFRLEVBQUU7UUFDN0IsSUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBQyxRQUFRLFVBQUEsRUFBRSxXQUFXLGFBQUEsRUFBQyxDQUFDLENBQUM7S0FDM0M7SUFFRCxPQUFPO1FBQ0wsc0NBQXNDO1FBQ3RDLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFDYixNQUFNLEVBQUUsSUFBSTtRQUNaLFlBQVksRUFBRSxJQUFJO1FBQ2xCLFlBQVksRUFBRSxDQUFDLENBQUM7UUFDaEIsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUNmLGlCQUFpQjtRQUNqQixvQkFBb0I7UUFDcEIsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssT0FBQTtRQUNyQixVQUFVLEVBQUUsQ0FBQztRQUNiLGdCQUFnQixFQUFFLENBQUM7UUFDbkIsbUJBQW1CLEVBQUUsQ0FBQztRQUN0QixjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ2xCLGNBQWMsRUFBRSxFQUFFO1FBQ2xCLGVBQWUsRUFBRSxDQUFDO1FBQ2xCLFVBQVUsRUFBRSxFQUFFO1FBQ2QsVUFBVSxFQUFFLENBQUM7UUFDYixRQUFRLEVBQUUsRUFBRTtRQUNaLFlBQVksRUFBRSxDQUFDO1FBQ2YsT0FBTyxFQUFFLEVBQUU7UUFDWCxPQUFPLEVBQUUsSUFBSTtRQUNiLFFB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