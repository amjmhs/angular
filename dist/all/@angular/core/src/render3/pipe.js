"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var instructions_1 = require("./instructions");
var view_1 = require("./interfaces/view");
var pure_function_1 = require("./pure_function");
/**
 * Create a pipe.
 *
 * @param index Pipe index where the pipe will be stored.
 * @param pipeName The name of the pipe
 * @returns T the instance of the pipe.
 */
function pipe(index, pipeName) {
    var tView = instructions_1.getTView();
    var pipeDef;
    var adjustedIndex = index + view_1.HEADER_OFFSET;
    if (tView.firstTemplatePass) {
        pipeDef = getPipeDef(pipeName, tView.pipeRegistry);
        tView.data[adjustedIndex] = pipeDef;
        if (pipeDef.onDestroy) {
            (tView.pipeDestroyHooks || (tView.pipeDestroyHooks = [])).push(adjustedIndex, pipeDef.onDestroy);
        }
    }
    else {
        pipeDef = tView.data[adjustedIndex];
    }
    var pipeInstance = pipeDef.factory();
    instructions_1.store(index, pipeInstance);
    return pipeInstance;
}
exports.pipe = pipe;
/**
 * Searches the pipe registry for a pipe with the given name. If one is found,
 * returns the pipe. Otherwise, an error is thrown because the pipe cannot be resolved.
 *
 * @param name Name of pipe to resolve
 * @param registry Full list of available pipes
 * @returns Matching PipeDef
 */
function getPipeDef(name, registry) {
    if (registry) {
        for (var i = 0; i < registry.length; i++) {
            var pipeDef = registry[i];
            if (name === pipeDef.name) {
                return pipeDef;
            }
        }
    }
    throw new Error("Pipe with name '" + name + "' not found!");
}
/**
 * Invokes a pipe with 1 arguments.
 *
 * This instruction acts as a guard to {@link PipeTransform#transform} invoking
 * the pipe only when an input to the pipe changes.
 *
 * @param index Pipe index where the pipe was stored on creation.
 * @param slotOffset the offset in the reserved slot space {@link reserveSlots}
 * @param v1 1st argument to {@link PipeTransform#transform}.
 */
function pipeBind1(index, slotOffset, v1) {
    var pipeInstance = instructions_1.load(index);
    return isPure(index) ? pure_function_1.pureFunction1(slotOffset, pipeInstance.transform, v1, pipeInstance) :
        pipeInstance.transform(v1);
}
exports.pipeBind1 = pipeBind1;
/**
 * Invokes a pipe with 2 arguments.
 *
 * This instruction acts as a guard to {@link PipeTransform#transform} invoking
 * the pipe only when an input to the pipe changes.
 *
 * @param index Pipe index where the pipe was stored on creation.
 * @param slotOffset the offset in the reserved slot space {@link reserveSlots}
 * @param v1 1st argument to {@link PipeTransform#transform}.
 * @param v2 2nd argument to {@link PipeTransform#transform}.
 */
function pipeBind2(index, slotOffset, v1, v2) {
    var pipeInstance = instructions_1.load(index);
    return isPure(index) ? pure_function_1.pureFunction2(slotOffset, pipeInstance.transform, v1, v2, pipeInstance) :
        pipeInstance.transform(v1, v2);
}
exports.pipeBind2 = pipeBind2;
/**
 * Invokes a pipe with 3 arguments.
 *
 * This instruction acts as a guard to {@link PipeTransform#transform} invoking
 * the pipe only when an input to the pipe changes.
 *
 * @param index Pipe index where the pipe was stored on creation.
 * @param slotOffset the offset in the reserved slot space {@link reserveSlots}
 * @param v1 1st argument to {@link PipeTransform#transform}.
 * @param v2 2nd argument to {@link PipeTransform#transform}.
 * @param v3 4rd argument to {@link PipeTransform#transform}.
 */
function pipeBind3(index, slotOffset, v1, v2, v3) {
    var pipeInstance = instructions_1.load(index);
    return isPure(index) ?
        pure_function_1.pureFunction3(slotOffset, pipeInstance.transform, v1, v2, v3, pipeInstance) :
        pipeInstance.transform(v1, v2, v3);
}
exports.pipeBind3 = pipeBind3;
/**
 * Invokes a pipe with 4 arguments.
 *
 * This instruction acts as a guard to {@link PipeTransform#transform} invoking
 * the pipe only when an input to the pipe changes.
 *
 * @param index Pipe index where the pipe was stored on creation.
 * @param slotOffset the offset in the reserved slot space {@link reserveSlots}
 * @param v1 1st argument to {@link PipeTransform#transform}.
 * @param v2 2nd argument to {@link PipeTransform#transform}.
 * @param v3 3rd argument to {@link PipeTransform#transform}.
 * @param v4 4th argument to {@link PipeTransform#transform}.
 */
function pipeBind4(index, slotOffset, v1, v2, v3, v4) {
    var pipeInstance = instructions_1.load(index);
    return isPure(index) ?
        pure_function_1.pureFunction4(slotOffset, pipeInstance.transform, v1, v2, v3, v4, pipeInstance) :
        pipeInstance.transform(v1, v2, v3, v4);
}
exports.pipeBind4 = pipeBind4;
/**
 * Invokes a pipe with variable number of arguments.
 *
 * This instruction acts as a guard to {@link PipeTransform#transform} invoking
 * the pipe only when an input to the pipe changes.
 *
 * @param index Pipe index where the pipe was stored on creation.
 * @param slotOffset the offset in the reserved slot space {@link reserveSlots}
 * @param values Array of arguments to pass to {@link PipeTransform#transform} method.
 */
function pipeBindV(index, slotOffset, values) {
    var pipeInstance = instructions_1.load(index);
    return isPure(index) ? pure_function_1.pureFunctionV(slotOffset, pipeInstance.transform, values, pipeInstance) :
        pipeInstance.transform.apply(pipeInstance, values);
}
exports.pipeBindV = pipeBindV;
function isPure(index) {
    return instructions_1.getTView().data[index + view_1.HEADER_OFFSET].pure;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvcGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUlILCtDQUFxRDtBQUVyRCwwQ0FBZ0Q7QUFDaEQsaURBQTBHO0FBRTFHOzs7Ozs7R0FNRztBQUNILGNBQXFCLEtBQWEsRUFBRSxRQUFnQjtJQUNsRCxJQUFNLEtBQUssR0FBRyx1QkFBUSxFQUFFLENBQUM7SUFDekIsSUFBSSxPQUE2QixDQUFDO0lBQ2xDLElBQU0sYUFBYSxHQUFHLEtBQUssR0FBRyxvQkFBYSxDQUFDO0lBRTVDLElBQUksS0FBSyxDQUFDLGlCQUFpQixFQUFFO1FBQzNCLE9BQU8sR0FBRyxVQUFVLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNuRCxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLE9BQU8sQ0FBQztRQUNwQyxJQUFJLE9BQU8sQ0FBQyxTQUFTLEVBQUU7WUFDckIsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEdBQUcsRUFDbkQsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDN0M7S0FDRjtTQUFNO1FBQ0wsT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUF5QixDQUFDO0tBQzdEO0lBRUQsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3ZDLG9CQUFLLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQzNCLE9BQU8sWUFBWSxDQUFDO0FBQ3RCLENBQUM7QUFuQkQsb0JBbUJDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNILG9CQUFvQixJQUFZLEVBQUUsUUFBNEI7SUFDNUQsSUFBSSxRQUFR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