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
/**
 * If the value hasn't been saved, calls the pure function to store and return the
 * value. If it has been saved, returns the saved value.
 *
 * @param pureFn Function that returns a value
 * @param slotOffset the offset in the reserved slot space {@link reserveSlots}
 * @param thisArg Optional calling context of pureFn
 * @returns value
 */
function pureFunction0(slotOffset, pureFn, thisArg) {
    ngDevMode && instructions_1.assertReservedSlotInitialized(slotOffset, 1);
    var index = instructions_1.moveBindingIndexToReservedSlot(slotOffset);
    var value = instructions_1.getCreationMode() ?
        instructions_1.checkAndUpdateBinding(thisArg ? pureFn.call(thisArg) : pureFn()) :
        instructions_1.consumeBinding();
    instructions_1.restoreBindingIndex(index);
    return value;
}
exports.pureFunction0 = pureFunction0;
/**
 * If the value of the provided exp has changed, calls the pure function to return
 * an updated value. Or if the value has not changed, returns cached value.
 *
 * @param slotOffset the offset in the reserved slot space {@link reserveSlots}
 * @param pureFn Function that returns an updated value
 * @param exp Updated expression value
 * @param thisArg Optional calling context of pureFn
 * @returns Updated or cached value
 */
function pureFunction1(slotOffset, pureFn, exp, thisArg) {
    ngDevMode && instructions_1.assertReservedSlotInitialized(slotOffset, 2);
    var index = instructions_1.moveBindingIndexToReservedSlot(slotOffset);
    var value = instructions_1.bindingUpdated(exp) ?
        instructions_1.checkAndUpdateBinding(thisArg ? pureFn.call(thisArg, exp) : pureFn(exp)) :
        instructions_1.consumeBinding();
    instructions_1.restoreBindingIndex(index);
    return value;
}
exports.pureFunction1 = pureFunction1;
/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param slotOffset the offset in the reserved slot space {@link reserveSlots}
 * @param pureFn
 * @param exp1
 * @param exp2
 * @param thisArg Optional calling context of pureFn
 * @returns Updated or cached value
 */
function pureFunction2(slotOffset, pureFn, exp1, exp2, thisArg) {
    ngDevMode && instructions_1.assertReservedSlotInitialized(slotOffset, 3);
    var index = instructions_1.moveBindingIndexToReservedSlot(slotOffset);
    var value = instructions_1.bindingUpdated2(exp1, exp2) ?
        instructions_1.checkAndUpdateBinding(thisArg ? pureFn.call(thisArg, exp1, exp2) : pureFn(exp1, exp2)) :
        instructions_1.consumeBinding();
    instructions_1.restoreBindingIndex(index);
    return value;
}
exports.pureFunction2 = pureFunction2;
/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param slotOffset the offset in the reserved slot space {@link reserveSlots}
 * @param pureFn
 * @param exp1
 * @param exp2
 * @param exp3
 * @param thisArg Optional calling context of pureFn
 * @returns Updated or cached value
 */
function pureFunction3(slotOffset, pureFn, exp1, exp2, exp3, thisArg) {
    ngDevMode && instructions_1.assertReservedSlotInitialized(slotOffset, 4);
    var index = instructions_1.moveBindingIndexToReservedSlot(slotOffset);
    var different = instructions_1.bindingUpdated2(exp1, exp2);
    var value = instructions_1.bindingUpdated(exp3) || different ?
        instructions_1.checkAndUpdateBinding(thisArg ? pureFn.call(thisArg, exp1, exp2, exp3) : pureFn(exp1, exp2, exp3)) :
        instructions_1.consumeBinding();
    instructions_1.restoreBindingIndex(index);
    return value;
}
exports.pureFunction3 = pureFunction3;
/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param slotOffset the offset in the reserved slot space {@link reserveSlots}
 * @param pureFn
 * @param exp1
 * @param exp2
 * @param exp3
 * @param exp4
 * @param thisArg Optional calling context of pureFn
 * @returns Updated or cached value
 */
function pureFunction4(slotOffset, pureFn, exp1, exp2, exp3, exp4, thisArg) {
    ngDevMode && instructions_1.assertReservedSlotInitialized(slotOffset, 5);
    var index = instructions_1.moveBindingIndexToReservedSlot(slotOffset);
    var value = instructions_1.bindingUpdated4(exp1, exp2, exp3, exp4) ?
        instructions_1.checkAndUpdateBinding(thisArg ? pureFn.call(thisArg, exp1, exp2, exp3, exp4) : pureFn(exp1, exp2, exp3, exp4)) :
        instructions_1.consumeBinding();
    instructions_1.restoreBindingIndex(index);
    return value;
}
exports.pureFunction4 = pureFunction4;
/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param slotOffset the offset in the reserved slot space {@link reserveSlots}
 * @param pureFn
 * @param exp1
 * @param exp2
 * @param exp3
 * @param exp4
 * @param exp5
 * @param thisArg Optional calling context of pureFn
 * @returns Updated or cached value
 */
function pureFunction5(slotOffset, pureFn, exp1, exp2, exp3, exp4, exp5, thisArg) {
    ngDevMode && instructions_1.assertReservedSlotInitialized(slotOffset, 6);
    var index = instructions_1.moveBindingIndexToReservedSlot(slotOffset);
    var different = instructions_1.bindingUpdated4(exp1, exp2, exp3, exp4);
    var value = instructions_1.bindingUpdated(exp5) || different ?
        instructions_1.checkAndUpdateBinding(thisArg ? pureFn.call(thisArg, exp1, exp2, exp3, exp4, exp5) :
            pureFn(exp1, exp2, exp3, exp4, exp5)) :
        instructions_1.consumeBinding();
    instructions_1.restoreBindingIndex(index);
    return value;
}
exports.pureFunction5 = pureFunction5;
/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param slotOffset the offset in the reserved slot space {@link reserveSlots}
 * @param pureFn
 * @param exp1
 * @param exp2
 * @param exp3
 * @param exp4
 * @param exp5
 * @param exp6
 * @param thisArg Optional calling context of pureFn
 * @returns Updated or cached value
 */
function pureFunction6(slotOffset, pureFn, exp1, exp2, exp3, exp4, exp5, exp6, thisArg) {
    ngDevMode && instructions_1.assertReservedSlotInitialized(slotOffset, 7);
    var index = instructions_1.moveBindingIndexToReservedSlot(slotOffset);
    var different = instructions_1.bindingUpdated4(exp1, exp2, exp3, exp4);
    var value = instructions_1.bindingUpdated2(exp5, exp6) || different ?
        instructions_1.checkAndUpdateBinding(thisArg ? pureFn.call(thisArg, exp1, exp2, exp3, exp4, exp5, exp6) :
            pureFn(exp1, exp2, exp3, exp4, exp5, exp6)) :
        instructions_1.consumeBinding();
    instructions_1.restoreBindingIndex(index);
    return value;
}
exports.pureFunction6 = pureFunction6;
/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param slotOffset the offset in the reserved slot space {@link reserveSlots}
 * @param pureFn
 * @param exp1
 * @param exp2
 * @param exp3
 * @param exp4
 * @param exp5
 * @param exp6
 * @param exp7
 * @param thisArg Optional calling context of pureFn
 * @returns Updated or cached value
 */
function pureFunction7(slotOffset, pureFn, exp1, exp2, exp3, exp4, exp5, exp6, exp7, thisArg) {
    ngDevMode && instructions_1.assertReservedSlotInitialized(slotOffset, 8);
    var index = instructions_1.moveBindingIndexToReservedSlot(slotOffset);
    var different = instructions_1.bindingUpdated4(exp1, exp2, exp3, exp4);
    different = instructions_1.bindingUpdated2(exp5, exp6) || different;
    var value = instructions_1.bindingUpdated(exp7) || different ?
        instructions_1.checkAndUpdateBinding(thisArg ? pureFn.call(thisArg, exp1, exp2, exp3, exp4, exp5, exp6, exp7) :
            pureFn(exp1, exp2, exp3, exp4, exp5, exp6, exp7)) :
        instructions_1.consumeBinding();
    instructions_1.restoreBindingIndex(index);
    return value;
}
exports.pureFunction7 = pureFunction7;
/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param slotOffset the offset in the reserved slot space {@link reserveSlots}
 * @param pureFn
 * @param exp1
 * @param exp2
 * @param exp3
 * @param exp4
 * @param exp5
 * @param exp6
 * @param exp7
 * @param exp8
 * @param thisArg Optional calling context of pureFn
 * @returns Updated or cached value
 */
function pureFunction8(slotOffset, pureFn, exp1, exp2, exp3, exp4, exp5, exp6, exp7, exp8, thisArg) {
    ngDevMode && instructions_1.assertReservedSlotInitialized(slotOffset, 9);
    var index = instructions_1.moveBindingIndexToReservedSlot(slotOffset);
    var different = instructions_1.bindingUpdated4(exp1, exp2, exp3, exp4);
    var value = instructions_1.bindingUpdated4(exp5, exp6, exp7, exp8) || different ?
        instructions_1.checkAndUpdateBinding(thisArg ? pureFn.call(thisArg, exp1, exp2, exp3, exp4, exp5, exp6, exp7, exp8) :
            pureFn(exp1, exp2, exp3, exp4, exp5, exp6, exp7, exp8)) :
        instructions_1.consumeBinding();
    instructions_1.restoreBindingIndex(index);
    return value;
}
exports.pureFunction8 = pureFunction8;
/**
 * pureFunction instruction that can support any number of bindings.
 *
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param slotOffset the offset in the reserved slot space {@link reserveSlots}
 * @param pureFn A pure function that takes binding values and builds an object or array
 * containing those values.
 * @param exps An array of binding values
 * @param thisArg Optional calling context of pureFn
 * @returns Updated or cached value
 */
function pureFunctionV(slotOffset, pureFn, exps, thisArg) {
    ngDevMode && instructions_1.assertReservedSlotInitialized(slotOffset, exps.length + 1);
    var index = instructions_1.moveBindingIndexToReservedSlot(slotOffset);
    var different = false;
    for (var i = 0; i < exps.length; i++) {
        instructions_1.bindingUpdated(exps[i]) && (different = true);
    }
    var value = different ? instructions_1.checkAndUpdateBinding(pureFn.apply(thisArg, exps)) : instructions_1.consumeBinding();
    instructions_1.restoreBindingIndex(index);
    return value;
}
exports.pureFunctionV = pureFunctionV;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVyZV9mdW5jdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvcHVyZV9mdW5jdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtDQUE0TjtBQUk1Tjs7Ozs7Ozs7R0FRRztBQUNILHVCQUFpQyxVQUFrQixFQUFFLE1BQWUsRUFBRSxPQUFhO0lBQ2pGLFNBQVMsSUFBSSw0Q0FBNkIsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDMUQsSUFBTSxLQUFLLEdBQUcsNkNBQThCLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDekQsSUFBTSxLQUFLLEdBQUcsOEJBQWUsRUFBRSxDQUFDLENBQUM7UUFDN0Isb0NBQXFCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEUsNkJBQWMsRUFBRSxDQUFDO0lBQ3JCLGtDQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNCLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQVJELHNDQVFDO0FBRUQ7Ozs7Ozs7OztHQVNHO0FBQ0gsdUJBQ0ksVUFBa0IsRUFBRSxNQUF1QixFQUFFLEdBQVEsRUFBRSxPQUFhO0lBQ3RFLFNBQVMsSUFBSSw0Q0FBNkIsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDMUQsSUFBTSxLQUFLLEdBQUcsNkNBQThCLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDekQsSUFBTSxLQUFLLEdBQUcsNkJBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQy9CLG9DQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1B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