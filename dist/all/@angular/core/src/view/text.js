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
function textDef(checkIndex, ngContentIndex, staticText) {
    var bindings = new Array(staticText.length - 1);
    for (var i = 1; i < staticText.length; i++) {
        bindings[i - 1] = {
            flags: 8 /* TypeProperty */,
            name: null,
            ns: null,
            nonMinifiedName: null,
            securityContext: null,
            suffix: staticText[i],
        };
    }
    return {
        // will bet set by the view definition
        nodeIndex: -1,
        parent: null,
        renderParent: null,
        bindingIndex: -1,
        outputIndex: -1,
        // regular values
        checkIndex: checkIndex,
        flags: 2 /* TypeText */,
        childFlags: 0,
        directChildFlags: 0,
        childMatchedQueries: 0,
        matchedQueries: {},
        matchedQueryIds: 0,
        references: {}, ngContentIndex: ngContentIndex,
        childCount: 0, bindings: bindings,
        bindingFlags: 8 /* TypeProperty */,
        outputs: [],
        element: null,
        provider: null,
        text: { prefix: staticText[0] },
        query: null,
        ngContent: null,
    };
}
exports.textDef = textDef;
function createText(view, renderHost, def) {
    var renderNode;
    var renderer = view.renderer;
    renderNode = renderer.createText(def.text.prefix);
    var parentEl = util_1.getParentRenderElement(view, renderHost, def);
    if (parentEl) {
        renderer.appendChild(parentEl, renderNode);
    }
    return { renderText: renderNode };
}
exports.createText = createText;
function checkAndUpdateTextInline(view, def, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
    var changed = false;
    var bindings = def.bindings;
    var bindLen = bindings.length;
    if (bindLen > 0 && util_1.checkAndUpdateBinding(view, def, 0, v0))
        changed = true;
    if (bindLen > 1 && util_1.checkAndUpdateBinding(view, def, 1, v1))
        changed = true;
    if (bindLen > 2 && util_1.checkAndUpdateBinding(view, def, 2, v2))
        changed = true;
    if (bindLen > 3 && util_1.checkAndUpdateBinding(view, def, 3, v3))
        changed = true;
    if (bindLen > 4 && util_1.checkAndUpdateBinding(view, def, 4, v4))
        changed = true;
    if (bindLen > 5 && util_1.checkAndUpdateBinding(view, def, 5, v5))
        changed = true;
    if (bindLen > 6 && util_1.checkAndUpdateBinding(view, def, 6, v6))
        changed = true;
    if (bindLen > 7 && util_1.checkAndUpdateBinding(view, def, 7, v7))
        changed = true;
    if (bindLen > 8 && util_1.checkAndUpdateBinding(view, def, 8, v8))
        changed = true;
    if (bindLen > 9 && util_1.checkAndUpdateBinding(view, def, 9, v9))
        changed = true;
    if (changed) {
        var value = def.text.prefix;
        if (bindLen > 0)
            value += _addInterpolationPart(v0, bindings[0]);
        if (bindLen > 1)
            value += _addInterpolationPart(v1, bindings[1]);
        if (bindLen > 2)
            value += _addInterpolationPart(v2, bindings[2]);
        if (bindLen > 3)
            value += _addInterpolationPart(v3, bindings[3]);
        if (bindLen > 4)
            value += _addInterpolationPart(v4, bindings[4]);
        if (bindLen > 5)
            value += _addInterpolationPart(v5, bindings[5]);
        if (bindLen > 6)
            value += _addInterpolationPart(v6, bindings[6]);
        if (bindLen > 7)
            value += _addInterpolationPart(v7, bindings[7]);
        if (bindLen > 8)
            value += _addInterpolationPart(v8, bindings[8]);
        if (bindLen > 9)
            value += _addInterpolationPart(v9, bindings[9]);
        var renderNode = types_1.asTextData(view, def.nodeIndex).renderText;
        view.renderer.setValue(renderNode, value);
    }
    return changed;
}
exports.checkAndUpdateTextInline = checkAndUpdateTextInline;
function checkAndUpdateTextDynamic(view, def, values) {
    var bindings = def.bindings;
    var changed = false;
    for (var i = 0; i < values.length; i++) {
        // Note: We need to loop over all values, so that
        // the old values are updates as well!
        if (util_1.checkAndUpdateBinding(view, def, i, values[i])) {
            changed = true;
        }
    }
    if (changed) {
        var value = '';
        for (var i = 0; i < values.length; i++) {
            value = value + _addInterpolationPart(values[i], bindings[i]);
        }
        value = def.text.prefix + value;
        var renderNode = types_1.asTextData(view, def.nodeIndex).renderText;
        view.renderer.setValue(renderNode, value);
    }
    return changed;
}
exports.checkAndUpdateTextDynamic = checkAndUpdateTextDynamic;
function _addInterpolationPart(value, binding) {
    var valueStr = value != null ? value.toString() : '';
    return valueStr + binding.suffix;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3ZpZXcvdGV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILGlDQUFxRztBQUNyRywrQkFBcUU7QUFFckUsaUJBQ0ksVUFBa0IsRUFBRSxjQUE2QixFQUFFLFVBQW9CO0lBQ3pFLElBQU0sUUFBUSxHQUFpQixJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUc7WUFDaEIsS0FBSyxzQkFBMkI7WUFDaEMsSUFBSSxFQUFFLElBQUk7WUFDVixFQUFFLEVBQUUsSUFBSTtZQUNSLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1NBQ3RCLENBQUM7S0FDSDtJQUVELE9BQU87UUFDTCxzQ0FBc0M7UUFDdEMsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUNiLE1BQU0sRUFBRSxJQUFJO1FBQ1osWUFBWSxFQUFFLElBQUk7UUFDbEIsWUFBWSxFQUFFLENBQUMsQ0FBQztRQUNoQixXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQ2YsaUJBQWlCO1FBQ2pCLFVBQVUsWUFBQTtRQUNWLEtBQUssa0JBQW9CO1FBQ3pCLFVBQVUsRUFBRSxDQUFDO1FBQ2IsZ0JBQWdCLEVBQUUsQ0FBQztRQUNuQixtQkFBbUIsRUFBRSxDQUFDO1FBQ3RCLGNBQWMsRUFBRSxFQUFFO1FBQ2xCLGVBQWUsRUFBRSxDQUFDO1FBQ2xCLFVBQVUsRUFBRSxFQUFFLEVBQUUsY0FBYyxnQkFBQTtRQUM5QixVQUFVLEVBQUUsQ0FBQyxFQUFFLFFBQVEsVUFBQTtRQUN2QixZQUFZLHNCQUEyQjtRQUN2QyxPQUFPLEVBQUUsRUFBRTtRQUNYLE9BQU8sRUFBRSxJQUFJO1FBQ2IsUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsRUFBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFDO1FBQzdCLEtBQUssRUFBRSxJQUFJO1FBQ1gsU0FBUyxFQUFFLElBQUk7S0FDaEIsQ0FBQztBQUNKLENBQUM7QUF2Q0QsMEJBdUNDO0FBRUQsb0JBQTJCLElBQWMsRUFBRSxVQUFlLEVBQUUsR0FBWTtJQUN0RSxJQUFJLFVBQWUsQ0FBQztJQUNwQixJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQy9CLFVBQVUsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEQsSUFBTSxRQUFRLEdBQUcsNkJBQXNCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMvRCxJQUFJLFFBQVEsRUFBRTtRQUNaLFFBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0tBQzVDO0lBQ0QsT0FBTyxFQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUMsQ0FBQztBQUNsQyxDQUFDO0FBVEQsZ0NBU0M7QUFFRCxrQ0FDSSxJQUFjLEVBQUUsR0FBWSxFQUFFLEVBQU8sRUFBRSxFQUFPLEVBQUUsRUFBTyxFQUFFLEVBQU8sRUFBRSxFQUFPLEVBQUUsRUFBTyxFQUFFLEVBQU8sRUFDM0YsRUFBTyxFQUFFLEVBQU8sRUFBRSxFQUFPO0lBQzNCLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztJQUNwQixJQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO0lBQzlCLElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7SUFDaEMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLDRCQUFxQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUFFLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDM0UsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLDRCQUFxQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUFFLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDM0UsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLDRCQUFxQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUFFLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDM0UsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLDRCQUFxQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUFFLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDM0UsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLDRCQUFxQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUFFLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDM0UsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLDRCQUFxQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUFFLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDM0UsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLDRCQUFxQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUFFLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDM0UsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLDRCQUFxQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUFFLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDM0UsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLDRCQUFxQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUFFLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDM0UsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLDRCQUFxQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUFFLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFFM0UsSUFBSSxPQUFPLEVBQUU7UUFDWCxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBTSxDQUFDLE1BQU0sQ0FBQztRQUM5QixJQUFJLE9BQU8sR0FBRyxDQUFDO1lBQUUsS0FBSyxJQUFJLHFCQUFxQixDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRSxJQUFJLE9BQU8sR0FBRyxDQUFDO1lBQUUsS0FBSyxJQUFJLHFCQUFxQixDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRSxJQUFJLE9BQU8sR0FBRyxDQUFDO1lBQUUsS0FBSyxJQUFJLHFCQUFxQixDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRSxJQUFJLE9BQU8sR0FBRyxDQUFDO1lBQUUsS0FBSyxJQUFJLHFCQUFxQixDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRSxJQUFJLE9BQU8sR0FBRyxDQUFDO1lBQUUsS0FBSyxJQUFJLHFCQUFxQixDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRSxJQUFJLE9BQU8sR0FBRyxDQUFDO1lBQUUsS0FBSyxJQUFJLHFCQUFxQixDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRSxJQUFJLE9BQU8sR0FBRyxDQUFDO1lBQUUsS0FBSyxJQUFJLHFCQUFxQixDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRSxJQUFJLE9BQU8sR0FBRyxDQUFDO1lBQUUsS0FBSyxJQUFJLHFCQUFxQixDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRSxJQUFJLE9BQU8sR0FBRyxDQUFDO1lBQUUsS0FBSyxJQUFJLHFCQUFxQixDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRSxJQUFJLE9BQU8sR0FBRyxDQUFDO1lBQUUsS0FBSyxJQUFJLHFCQUFxQixDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRSxJQUFNLFVBQVUsR0FBRyxrQkFBVSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsVUFBVSxDQUFDO1FBQzlELElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUMzQztJQUNELE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUFqQ0QsNERBaUNDO0FBRUQsbUNBQTBDLElBQWMsRUFBRSxHQUFZLEVBQUUsTUFBYTtJQUNuRixJQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO0lBQzlCLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztJQUNwQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN0QyxpREFBaUQ7UUFDakQsc0NBQXNDO1FBQ3RDLElBQUksNEJBQXFCLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDbEQsT0FBTyxHQUFHLElBQUksQ0FBQztTQUNoQjtLQUNGO0lBQ0QsSUFBSSxPQUFPLEVBQUU7UUFDWCxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDZixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN0QyxLQUFLLEdBQUcsS0FBSyxHQUFHLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMvRDtRQUNELEtBQUssR0FBRyxHQUFHLENBQUMsSUFBTSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDbEMsSUFBTSxVQUFVLEdBQUcsa0JBQVUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztRQUM5RCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDM0M7SUFDRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBcEJELDhEQW9CQztBQUVELCtCQUErQixLQUFVLEVBQUUsT0FBbUI7SUFDNUQsSUFBTSxRQUFRLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDdkQsT0FBTyxRQUFRLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUNuQyxDQUFDIn0=