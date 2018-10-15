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
function purePipeDef(checkIndex, argCount) {
    // argCount + 1 to include the pipe as first arg
    return _pureExpressionDef(128 /* TypePurePipe */, checkIndex, new Array(argCount + 1));
}
exports.purePipeDef = purePipeDef;
function pureArrayDef(checkIndex, argCount) {
    return _pureExpressionDef(32 /* TypePureArray */, checkIndex, new Array(argCount));
}
exports.pureArrayDef = pureArrayDef;
function pureObjectDef(checkIndex, propToIndex) {
    var keys = Object.keys(propToIndex);
    var nbKeys = keys.length;
    var propertyNames = new Array(nbKeys);
    for (var i = 0; i < nbKeys; i++) {
        var key = keys[i];
        var index = propToIndex[key];
        propertyNames[index] = key;
    }
    return _pureExpressionDef(64 /* TypePureObject */, checkIndex, propertyNames);
}
exports.pureObjectDef = pureObjectDef;
function _pureExpressionDef(flags, checkIndex, propertyNames) {
    var bindings = new Array(propertyNames.length);
    for (var i = 0; i < propertyNames.length; i++) {
        var prop = propertyNames[i];
        bindings[i] = {
            flags: 8 /* TypeProperty */,
            name: prop,
            ns: null,
            nonMinifiedName: prop,
            securityContext: null,
            suffix: null
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
        flags: flags,
        childFlags: 0,
        directChildFlags: 0,
        childMatchedQueries: 0,
        matchedQueries: {},
        matchedQueryIds: 0,
        references: {},
        ngContentIndex: -1,
        childCount: 0, bindings: bindings,
        bindingFlags: util_1.calcBindingFlags(bindings),
        outputs: [],
        element: null,
        provider: null,
        text: null,
        query: null,
        ngContent: null
    };
}
function createPureExpression(view, def) {
    return { value: undefined };
}
exports.createPureExpression = createPureExpression;
function checkAndUpdatePureExpressionInline(view, def, v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
    var bindings = def.bindings;
    var changed = false;
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
        var data_1 = types_1.asPureExpressionData(view, def.nodeIndex);
        var value = void 0;
        switch (def.flags & 201347067 /* Types */) {
            case 32 /* TypePureArray */:
                value = new Array(bindings.length);
                if (bindLen > 0)
                    value[0] = v0;
                if (bindLen > 1)
                    value[1] = v1;
                if (bindLen > 2)
                    value[2] = v2;
                if (bindLen > 3)
                    value[3] = v3;
                if (bindLen > 4)
                    value[4] = v4;
                if (bindLen > 5)
                    value[5] = v5;
                if (bindLen > 6)
                    value[6] = v6;
                if (bindLen > 7)
                    value[7] = v7;
                if (bindLen > 8)
                    value[8] = v8;
                if (bindLen > 9)
                    value[9] = v9;
                break;
            case 64 /* TypePureObject */:
                value = {};
                if (bindLen > 0)
                    value[bindings[0].name] = v0;
                if (bindLen > 1)
                    value[bindings[1].name] = v1;
                if (bindLen > 2)
                    value[bindings[2].name] = v2;
                if (bindLen > 3)
                    value[bindings[3].name] = v3;
                if (bindLen > 4)
                    value[bindings[4].name] = v4;
                if (bindLen > 5)
                    value[bindings[5].name] = v5;
                if (bindLen > 6)
                    value[bindings[6].name] = v6;
                if (bindLen > 7)
                    value[bindings[7].name] = v7;
                if (bindLen > 8)
                    value[bindings[8].name] = v8;
                if (bindLen > 9)
                    value[bindings[9].name] = v9;
                break;
            case 128 /* TypePurePipe */:
                var pipe = v0;
                switch (bindLen) {
                    case 1:
                        value = pipe.transform(v0);
                        break;
                    case 2:
                        value = pipe.transform(v1);
                        break;
                    case 3:
                        value = pipe.transform(v1, v2);
                        break;
                    case 4:
                        value = pipe.transform(v1, v2, v3);
                        break;
                    case 5:
                        value = pipe.transform(v1, v2, v3, v4);
                        break;
                    case 6:
                        value = pipe.transform(v1, v2, v3, v4, v5);
                        break;
                    case 7:
                        value = pipe.transform(v1, v2, v3, v4, v5, v6);
                        break;
                    case 8:
                        value = pipe.transform(v1, v2, v3, v4, v5, v6, v7);
                        break;
                    case 9:
                        value = pipe.transform(v1, v2, v3, v4, v5, v6, v7, v8);
                        break;
                    case 10:
                        value = pipe.transform(v1, v2, v3, v4, v5, v6, v7, v8, v9);
                        break;
                }
                break;
        }
        data_1.value = value;
    }
    return changed;
}
exports.checkAndUpdatePureExpressionInline = checkAndUpdatePureExpressionInline;
function checkAndUpdatePureExpressionDynamic(view, def, values) {
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
        var data_2 = types_1.asPureExpressionData(view, def.nodeIndex);
        var value = void 0;
        switch (def.flags & 201347067 /* Types */) {
            case 32 /* TypePureArray */:
                value = values;
                break;
            case 64 /* TypePureObject */:
                value = {};
                for (var i = 0; i < values.length; i++) {
                    value[bindings[i].name] = values[i];
                }
                break;
            case 128 /* TypePurePipe */:
                var pipe = values[0];
                var params = values.slice(1);
                value = pipe.transform.apply(pipe, params);
                break;
        }
        data_2.value = value;
    }
    return changed;
}
exports.checkAndUpdatePureExpressionDynamic = checkAndUpdatePureExpressionDynamic;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVyZV9leHByZXNzaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvdmlldy9wdXJlX2V4cHJlc3Npb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxpQ0FBeUg7QUFDekgsK0JBQStEO0FBRS9ELHFCQUE0QixVQUFrQixFQUFFLFFBQWdCO0lBQzlELGdEQUFnRDtJQUNoRCxPQUFPLGtCQUFrQix5QkFBeUIsVUFBVSxFQUFFLElBQUksS0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pGLENBQUM7QUFIRCxrQ0FHQztBQUVELHNCQUE2QixVQUFrQixFQUFFLFFBQWdCO0lBQy9ELE9BQU8sa0JBQWtCLHlCQUEwQixVQUFVLEVBQUUsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUN0RixDQUFDO0FBRkQsb0NBRUM7QUFFRCx1QkFBOEIsVUFBa0IsRUFBRSxXQUFrQztJQUNsRixJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3RDLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDM0IsSUFBTSxhQUFhLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDeEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMvQixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7S0FDNUI7SUFFRCxPQUFPLGtCQUFrQiwwQkFBMkIsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FB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LElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUMvQixNQUFNO29CQUNSLEtBQUssQ0FBQzt3QkFDSixLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUNuQyxNQUFNO29CQUNSLEtBQUssQ0FBQzt3QkFDSixLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDdkMsTUFBTTtvQkFDUixLQUFLLENBQUM7d0JBQ0osS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUMzQyxNQUFNO29CQUNSLEtBQUssQ0FBQzt3QkFDSixLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUMvQyxNQUFNO29CQUNSLEtBQUssQ0FBQzt3QkFDSixLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDbkQsTUFBTTtvQkFDUixLQUFLLENBQUM7d0JBQ0osS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUN2RCxNQUFNO29CQUNSLEtBQUssRUFBRTt3QkFDTCxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUMzRCxNQUFNO2lCQUNUO2dCQUNELE1BQU07U0FDVDtRQUNELE1BQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0tBQ3BCO0lBQ0QsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQztBQXRGRCxnRkFzRkM7QUFFRCw2Q0FDSSxJQUFjLEVBQUUsR0FBWSxFQUFFLE1BQWE7SUFDN0MsSUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUM5QixJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDcEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdEMsaURBQWlEO1FBQ2pELHNDQUFzQztRQUN0QyxJQUFJLDRCQUFxQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2xELE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDaEI7S0FDRjtJQUNELElBQUksT0FBTyxFQUFFO1FBQ1gsSUFBTSxNQUFJLEdBQUcsNEJBQW9CLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN2RCxJQUFJLEtBQUssU0FBSyxDQUFDO1FBQ2YsUUFBUSxHQUFHLENBQUMsS0FBSyx3QkFBa0IsRUFBRTtZQUNuQztnQkFDRSxLQUFLLEdBQUcsTUFBTSxDQUFDO2dCQUNmLE1BQU07WUFDUjtnQkFDRSxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUNYLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN0QyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDdkM7Z0JBQ0QsTUFBTTtZQUNSO2dCQUNFLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkIsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsS0FBSyxHQUFTLElBQUksQ0FBQyxTQUFTLE9BQWQsSUFBSSxFQUFlLE1BQU0sQ0FBQyxDQUFDO2dCQUN6QyxNQUFNO1NBQ1Q7UUFDRCxNQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQjtJQUNELE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUFqQ0Qsa0ZBaUNDIn0=