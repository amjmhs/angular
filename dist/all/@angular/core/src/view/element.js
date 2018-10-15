"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var security_1 = require("../sanitization/security");
var types_1 = require("./types");
var util_1 = require("./util");
function anchorDef(flags, matchedQueriesDsl, ngContentIndex, childCount, handleEvent, templateFactory) {
    flags |= 1 /* TypeElement */;
    var _a = util_1.splitMatchedQueriesDsl(matchedQueriesDsl), matchedQueries = _a.matchedQueries, references = _a.references, matchedQueryIds = _a.matchedQueryIds;
    var template = templateFactory ? util_1.resolveDefinition(templateFactory) : null;
    return {
        // will bet set by the view definition
        nodeIndex: -1,
        parent: null,
        renderParent: null,
        bindingIndex: -1,
        outputIndex: -1,
        // regular values
        flags: flags,
        checkIndex: -1,
        childFlags: 0,
        directChildFlags: 0,
        childMatchedQueries: 0, matchedQueries: matchedQueries, matchedQueryIds: matchedQueryIds, references: references, ngContentIndex: ngContentIndex, childCount: childCount,
        bindings: [],
        bindingFlags: 0,
        outputs: [],
        element: {
            ns: null,
            name: null,
            attrs: null, template: template,
            componentProvider: null,
            componentView: null,
            componentRendererType: null,
            publicProviders: null,
            allProviders: null,
            handleEvent: handleEvent || util_1.NOOP
        },
        provider: null,
        text: null,
        query: null,
        ngContent: null
    };
}
exports.anchorDef = anchorDef;
function elementDef(checkIndex, flags, matchedQueriesDsl, ngContentIndex, childCount, namespaceAndName, fixedAttrs, bindings, outputs, handleEvent, componentView, componentRendererType) {
    if (fixedAttrs === void 0) { fixedAttrs = []; }
    var _a;
    if (!handleEvent) {
        handleEvent = util_1.NOOP;
    }
    var _b = util_1.splitMatchedQueriesDsl(matchedQueriesDsl), matchedQueries = _b.matchedQueries, references = _b.references, matchedQueryIds = _b.matchedQueryIds;
    var ns = null;
    var name = null;
    if (namespaceAndName) {
        _a = util_1.splitNamespace(namespaceAndName), ns = _a[0], name = _a[1];
    }
    bindings = bindings || [];
    var bindingDefs = new Array(bindings.length);
    for (var i = 0; i < bindings.length; i++) {
        var _c = bindings[i], bindingFlags = _c[0], namespaceAndName_1 = _c[1], suffixOrSecurityContext = _c[2];
        var _d = util_1.splitNamespace(namespaceAndName_1), ns_1 = _d[0], name_1 = _d[1];
        var securityContext = undefined;
        var suffix = undefined;
        switch (bindingFlags & 15 /* Types */) {
            case 4 /* TypeElementStyle */:
                suffix = suffixOrSecurityContext;
                break;
            case 1 /* TypeElementAttribute */:
            case 8 /* TypeProperty */:
                securityContext = suffixOrSecurityContext;
                break;
        }
        bindingDefs[i] =
            { flags: bindingFlags, ns: ns_1, name: name_1, nonMinifiedName: name_1, securityContext: securityContext, suffix: suffix };
    }
    outputs = outputs || [];
    var outputDefs = new Array(outputs.length);
    for (var i = 0; i < outputs.length; i++) {
        var _e = outputs[i], target = _e[0], eventName = _e[1];
        outputDefs[i] = {
            type: 0 /* ElementOutput */,
            target: target, eventName: eventName,
            propName: null
        };
    }
    fixedAttrs = fixedAttrs || [];
    var attrs = fixedAttrs.map(function (_a) {
        var namespaceAndName = _a[0], value = _a[1];
        var _b = util_1.splitNamespace(namespaceAndName), ns = _b[0], name = _b[1];
        return [ns, name, value];
    });
    componentRendererType = util_1.resolveRendererType2(componentRendererType);
    if (componentView) {
        flags |= 33554432 /* ComponentView */;
    }
    flags |= 1 /* TypeElement */;
    return {
        // will bet set by the view definition
        nodeIndex: -1,
        parent: null,
        renderParent: null,
        bindingIndex: -1,
        outputIndex: -1,
        // regular values
        checkIndex: checkIndex,
        flags: flags,
        childFlags: 0,
        directChildFlags: 0,
        childMatchedQueries: 0, matchedQueries: matchedQueries, matchedQueryIds: matchedQueryIds, references: references, ngContentIndex: ngContentIndex, childCount: childCount,
        bindings: bindingDefs,
        bindingFlags: util_1.calcBindingFlags(bindingDefs),
        outputs: outputDefs,
        element: {
            ns: ns,
            name: name,
            attrs: attrs,
            template: null,
            // will bet set by the view definition
            componentProvider: null,
            componentView: componentView || null,
            componentRendererType: componentRendererType,
            publicProviders: null,
            allProviders: null,
            handleEvent: handleEvent || util_1.NOOP,
        },
        provider: null,
        text: null,
        query: null,
        ngContent: null
    };
}
exports.elementDef = elementDef;
function createElement(view, renderHost, def) {
    var elDef = def.element;
    var rootSelectorOrNode = view.root.selectorOrNode;
    var renderer = view.renderer;
    var el;
    if (view.parent || !rootSelectorOrNode) {
        if (elDef.name) {
            el = renderer.createElement(elDef.name, elDef.ns);
        }
        else {
            el = renderer.createComment('');
        }
        var parentEl = util_1.getParentRenderElement(view, renderHost, def);
        if (parentEl) {
            renderer.appendChild(parentEl, el);
        }
    }
    else {
        el = renderer.selectRootElement(rootSelectorOrNode);
    }
    if (elDef.attrs) {
        for (var i = 0; i < elDef.attrs.length; i++) {
            var _a = elDef.attrs[i], ns = _a[0], name_2 = _a[1], value = _a[2];
            renderer.setAttribute(el, name_2, value, ns);
        }
    }
    return el;
}
exports.createElement = createElement;
function listenToElementOutputs(view, compView, def, el) {
    for (var i = 0; i < def.outputs.length; i++) {
        var output = def.outputs[i];
        var handleEventClosure = renderEventHandlerClosure(view, def.nodeIndex, util_1.elementEventFullName(output.target, output.eventName));
        var listenTarget = output.target;
        var listenerView = view;
        if (output.target === 'component') {
            listenTarget = null;
            listenerView = compView;
        }
        var disposable = listenerView.renderer.listen(listenTarget || el, output.eventName, handleEventClosure);
        view.disposables[def.outputIndex + i] = disposable;
    }
}
exports.listenToElementOutputs = listenToElementOutputs;
function renderEventHandlerClosure(view, index, eventName) {
    return function (event) { return util_1.dispatchEvent(view, index, eventName, event); };
}
function checkAndUpdateElementInline(view, def, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
    var bindLen = def.bindings.length;
    var changed = false;
    if (bindLen > 0 && checkAndUpdateElementValue(view, def, 0, v0))
        changed = true;
    if (bindLen > 1 && checkAndUpdateElementValue(view, def, 1, v1))
        changed = true;
    if (bindLen > 2 && checkAndUpdateElementValue(view, def, 2, v2))
        changed = true;
    if (bindLen > 3 && checkAndUpdateElementValue(view, def, 3, v3))
        changed = true;
    if (bindLen > 4 && checkAndUpdateElementValue(view, def, 4, v4))
        changed = true;
    if (bindLen > 5 && checkAndUpdateElementValue(view, def, 5, v5))
        changed = true;
    if (bindLen > 6 && checkAndUpdateElementValue(view, def, 6, v6))
        changed = true;
    if (bindLen > 7 && checkAndUpdateElementValue(view, def, 7, v7))
        changed = true;
    if (bindLen > 8 && checkAndUpdateElementValue(view, def, 8, v8))
        changed = true;
    if (bindLen > 9 && checkAndUpdateElementValue(view, def, 9, v9))
        changed = true;
    return changed;
}
exports.checkAndUpdateElementInline = checkAndUpdateElementInline;
function checkAndUpdateElementDynamic(view, def, values) {
    var changed = false;
    for (var i = 0; i < values.length; i++) {
        if (checkAndUpdateElementValue(view, def, i, values[i]))
            changed = true;
    }
    return changed;
}
exports.checkAndUpdateElementDynamic = checkAndUpdateElementDynamic;
function checkAndUpdateElementValue(view, def, bindingIdx, value) {
    if (!util_1.checkAndUpdateBinding(view, def, bindingIdx, value)) {
        return false;
    }
    var binding = def.bindings[bindingIdx];
    var elData = types_1.asElementData(view, def.nodeIndex);
    var renderNode = elData.renderElement;
    var name = binding.name;
    switch (binding.flags & 15 /* Types */) {
        case 1 /* TypeElementAttribute */:
            setElementAttribute(view, binding, renderNode, binding.ns, name, value);
            break;
        case 2 /* TypeElementClass */:
            setElementClass(view, renderNode, name, value);
            break;
        case 4 /* TypeElementStyle */:
            setElementStyle(view, binding, renderNode, name, value);
            break;
        case 8 /* TypeProperty */:
            var bindView = (def.flags & 33554432 /* ComponentView */ &&
                binding.flags & 32 /* SyntheticHostProperty */) ?
                elData.componentView :
                view;
            setElementProperty(bindView, binding, renderNode, name, value);
            break;
    }
    return true;
}
function setElementAttribute(view, binding, renderNode, ns, name, value) {
    var securityContext = binding.securityContext;
    var renderValue = securityContext ? view.root.sanitizer.sanitize(securityContext, value) : value;
    renderValue = renderValue != null ? renderValue.toString() : null;
    var renderer = view.renderer;
    if (value != null) {
        renderer.setAttribute(renderNode, name, renderValue, ns);
    }
    else {
        renderer.removeAttribute(renderNode, name, ns);
    }
}
function setElementClass(view, renderNode, name, value) {
    var renderer = view.renderer;
    if (value) {
        renderer.addClass(renderNode, name);
    }
    else {
        renderer.removeClass(renderNode, name);
    }
}
function setElementStyle(view, binding, renderNode, name, value) {
    var renderValue = view.root.sanitizer.sanitize(security_1.SecurityContext.STYLE, value);
    if (renderValue != null) {
        renderValue = renderValue.toString();
        var unit = binding.suffix;
        if (unit != null) {
            renderValue = renderValue + unit;
        }
    }
    else {
        renderValue = null;
    }
    var renderer = view.renderer;
    if (renderValue != null) {
        renderer.setStyle(renderNode, name, renderValue);
    }
    else {
        renderer.removeStyle(renderNode, name);
    }
}
function setElementProperty(view, binding, renderNode, name, value) {
    var securityContext = binding.securityContext;
    var renderValue = securityContext ? view.root.sanitizer.sanitize(securityContext, value) : value;
    view.renderer.setProperty(renderNode, name, renderValue);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3ZpZXcvZWxlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILHFEQUF5RDtBQUV6RCxpQ0FBK0w7QUFDL0wsK0JBQW1OO0FBRW5OLG1CQUNJLEtBQWdCLEVBQUUsaUJBQTZELEVBQy9FLGNBQTZCLEVBQUUsVUFBa0IsRUFBRSxXQUF5QyxFQUM1RixlQUF1QztJQUN6QyxLQUFLLHVCQUF5QixDQUFDO0lBQ3pCLElBQUEscURBQXlGLEVBQXhGLGtDQUFjLEVBQUUsMEJBQVUsRUFBRSxvQ0FBZSxDQUE4QztJQUNoRyxJQUFNLFFBQVEsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLHdCQUFpQixDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFFN0UsT0FBTztRQUNMLHNDQUFzQztRQUN0QyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQ2IsTUFBTSxFQUFFLElBQUk7UUFDWixZQUFZLEVBQUUsSUFBSTtRQUNsQixZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBQ2hCLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDZixpQkFBaUI7UUFDakIsS0FBSyxPQUFBO1FBQ0wsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUNkLFVBQVUsRUFBRSxDQUFDO1FBQ2IsZ0JBQWdCLEVBQUUsQ0FBQztRQUNuQixtQkFBbUIsRUFBRSxDQUFDLEVBQUUsY0FBYyxnQkFBQSxFQUFFLGVBQWUsaUJBQUEsRUFBRSxVQUFVLFlBQUEsRUFBRSxjQUFjLGdCQUFBLEVBQUUsVUFBVSxZQUFBO1FBQy9GLFFBQVEsRUFBRSxFQUFFO1FBQ1osWUFBWSxFQUFFLENBQUM7UUFDZixPQUFPLEVBQUUsRUFBRTtRQUNYLE9BQU8sRUFBRTtZQUNQLEVBQUUsRUFBRSxJQUFJO1lBQ1IsSUFBSSxFQUFFLElBQUk7WUFDVixLQUFL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Q0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsRUFBNUMsQ0FBNEMsQ0FBQztBQUN0RSxDQUFDO0FBR0QscUNBQ0ksSUFBYyxFQUFFLEdBQVksRUFBRSxFQUFPLEVBQUUsRUFBTyxFQUFFLEVBQU8sRUFBRSxFQUFPLEVBQUUsRUFBTyxFQUFFLEVBQU8sRUFBRSxFQUFPLEVBQzNGLEVBQU8sRUFBRSxFQUFPLEVBQUUsRUFBTztJQUMzQixJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztJQUNwQyxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDcEIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLDBCQUEwQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUFFLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDaEYsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLDBCQUEwQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUFFLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDaEYsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLDBCQUEwQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUFFLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDaEYsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLDBCQUEwQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUFFLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDaEYsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLDBCQUEwQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUFFLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDaEYsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLDBCQUEwQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUs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