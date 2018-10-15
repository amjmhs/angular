/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { assertReservedSlotInitialized, bindingUpdated, bindingUpdated2, bindingUpdated4, checkAndUpdateBinding, consumeBinding, getCreationMode, moveBindingIndexToReservedSlot, restoreBindingIndex } from './instructions';
/**
 * If the value hasn't been saved, calls the pure function to store and return the
 * value. If it has been saved, returns the saved value.
 *
 * @template T
 * @param {?} slotOffset the offset in the reserved slot space {\@link reserveSlots}
 * @param {?} pureFn Function that returns a value
 * @param {?=} thisArg Optional calling context of pureFn
 * @return {?} value
 */
export function pureFunction0(slotOffset, pureFn, thisArg) {
    ngDevMode && assertReservedSlotInitialized(slotOffset, 1);
    /** @type {?} */
    const index = moveBindingIndexToReservedSlot(slotOffset);
    /** @type {?} */
    const value = getCreationMode() ?
        checkAndUpdateBinding(thisArg ? pureFn.call(thisArg) : pureFn()) :
        consumeBinding();
    restoreBindingIndex(index);
    return value;
}
/**
 * If the value of the provided exp has changed, calls the pure function to return
 * an updated value. Or if the value has not changed, returns cached value.
 *
 * @param {?} slotOffset the offset in the reserved slot space {\@link reserveSlots}
 * @param {?} pureFn Function that returns an updated value
 * @param {?} exp Updated expression value
 * @param {?=} thisArg Optional calling context of pureFn
 * @return {?} Updated or cached value
 */
export function pureFunction1(slotOffset, pureFn, exp, thisArg) {
    ngDevMode && assertReservedSlotInitialized(slotOffset, 2);
    /** @type {?} */
    const index = moveBindingIndexToReservedSlot(slotOffset);
    /** @type {?} */
    const value = bindingUpdated(exp) ?
        checkAndUpdateBinding(thisArg ? pureFn.call(thisArg, exp) : pureFn(exp)) :
        consumeBinding();
    restoreBindingIndex(index);
    return value;
}
/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param {?} slotOffset the offset in the reserved slot space {\@link reserveSlots}
 * @param {?} pureFn
 * @param {?} exp1
 * @param {?} exp2
 * @param {?=} thisArg Optional calling context of pureFn
 * @return {?} Updated or cached value
 */
export function pureFunction2(slotOffset, pureFn, exp1, exp2, thisArg) {
    ngDevMode && assertReservedSlotInitialized(slotOffset, 3);
    /** @type {?} */
    const index = moveBindingIndexToReservedSlot(slotOffset);
    /** @type {?} */
    const value = bindingUpdated2(exp1, exp2) ?
        checkAndUpdateBinding(thisArg ? pureFn.call(thisArg, exp1, exp2) : pureFn(exp1, exp2)) :
        consumeBinding();
    restoreBindingIndex(index);
    return value;
}
/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param {?} slotOffset the offset in the reserved slot space {\@link reserveSlots}
 * @param {?} pureFn
 * @param {?} exp1
 * @param {?} exp2
 * @param {?} exp3
 * @param {?=} thisArg Optional calling context of pureFn
 * @return {?} Updated or cached value
 */
export function pureFunction3(slotOffset, pureFn, exp1, exp2, exp3, thisArg) {
    ngDevMode && assertReservedSlotInitialized(slotOffset, 4);
    /** @type {?} */
    const index = moveBindingIndexToReservedSlot(slotOffset);
    /** @type {?} */
    const different = bindingUpdated2(exp1, exp2);
    /** @type {?} */
    const value = bindingUpdated(exp3) || different ?
        checkAndUpdateBinding(thisArg ? pureFn.call(thisArg, exp1, exp2, exp3) : pureFn(exp1, exp2, exp3)) :
        consumeBinding();
    restoreBindingIndex(index);
    return value;
}
/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param {?} slotOffset the offset in the reserved slot space {\@link reserveSlots}
 * @param {?} pureFn
 * @param {?} exp1
 * @param {?} exp2
 * @param {?} exp3
 * @param {?} exp4
 * @param {?=} thisArg Optional calling context of pureFn
 * @return {?} Updated or cached value
 */
export function pureFunction4(slotOffset, pureFn, exp1, exp2, exp3, exp4, thisArg) {
    ngDevMode && assertReservedSlotInitialized(slotOffset, 5);
    /** @type {?} */
    const index = moveBindingIndexToReservedSlot(slotOffset);
    /** @type {?} */
    const value = bindingUpdated4(exp1, exp2, exp3, exp4) ?
        checkAndUpdateBinding(thisArg ? pureFn.call(thisArg, exp1, exp2, exp3, exp4) : pureFn(exp1, exp2, exp3, exp4)) :
        consumeBinding();
    restoreBindingIndex(index);
    return value;
}
/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param {?} slotOffset the offset in the reserved slot space {\@link reserveSlots}
 * @param {?} pureFn
 * @param {?} exp1
 * @param {?} exp2
 * @param {?} exp3
 * @param {?} exp4
 * @param {?} exp5
 * @param {?=} thisArg Optional calling context of pureFn
 * @return {?} Updated or cached value
 */
export function pureFunction5(slotOffset, pureFn, exp1, exp2, exp3, exp4, exp5, thisArg) {
    ngDevMode && assertReservedSlotInitialized(slotOffset, 6);
    /** @type {?} */
    const index = moveBindingIndexToReservedSlot(slotOffset);
    /** @type {?} */
    const different = bindingUpdated4(exp1, exp2, exp3, exp4);
    /** @type {?} */
    const value = bindingUpdated(exp5) || different ?
        checkAndUpdateBinding(thisArg ? pureFn.call(thisArg, exp1, exp2, exp3, exp4, exp5) :
            pureFn(exp1, exp2, exp3, exp4, exp5)) :
        consumeBinding();
    restoreBindingIndex(index);
    return value;
}
/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param {?} slotOffset the offset in the reserved slot space {\@link reserveSlots}
 * @param {?} pureFn
 * @param {?} exp1
 * @param {?} exp2
 * @param {?} exp3
 * @param {?} exp4
 * @param {?} exp5
 * @param {?} exp6
 * @param {?=} thisArg Optional calling context of pureFn
 * @return {?} Updated or cached value
 */
export function pureFunction6(slotOffset, pureFn, exp1, exp2, exp3, exp4, exp5, exp6, thisArg) {
    ngDevMode && assertReservedSlotInitialized(slotOffset, 7);
    /** @type {?} */
    const index = moveBindingIndexToReservedSlot(slotOffset);
    /** @type {?} */
    const different = bindingUpdated4(exp1, exp2, exp3, exp4);
    /** @type {?} */
    const value = bindingUpdated2(exp5, exp6) || different ?
        checkAndUpdateBinding(thisArg ? pureFn.call(thisArg, exp1, exp2, exp3, exp4, exp5, exp6) :
            pureFn(exp1, exp2, exp3, exp4, exp5, exp6)) :
        consumeBinding();
    restoreBindingIndex(index);
    return value;
}
/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param {?} slotOffset the offset in the reserved slot space {\@link reserveSlots}
 * @param {?} pureFn
 * @param {?} exp1
 * @param {?} exp2
 * @param {?} exp3
 * @param {?} exp4
 * @param {?} exp5
 * @param {?} exp6
 * @param {?} exp7
 * @param {?=} thisArg Optional calling context of pureFn
 * @return {?} Updated or cached value
 */
export function pureFunction7(slotOffset, pureFn, exp1, exp2, exp3, exp4, exp5, exp6, exp7, thisArg) {
    ngDevMode && assertReservedSlotInitialized(slotOffset, 8);
    /** @type {?} */
    const index = moveBindingIndexToReservedSlot(slotOffset);
    /** @type {?} */
    let different = bindingUpdated4(exp1, exp2, exp3, exp4);
    different = bindingUpdated2(exp5, exp6) || different;
    /** @type {?} */
    const value = bindingUpdated(exp7) || different ?
        checkAndUpdateBinding(thisArg ? pureFn.call(thisArg, exp1, exp2, exp3, exp4, exp5, exp6, exp7) :
            pureFn(exp1, exp2, exp3, exp4, exp5, exp6, exp7)) :
        consumeBinding();
    restoreBindingIndex(index);
    return value;
}
/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param {?} slotOffset the offset in the reserved slot space {\@link reserveSlots}
 * @param {?} pureFn
 * @param {?} exp1
 * @param {?} exp2
 * @param {?} exp3
 * @param {?} exp4
 * @param {?} exp5
 * @param {?} exp6
 * @param {?} exp7
 * @param {?} exp8
 * @param {?=} thisArg Optional calling context of pureFn
 * @return {?} Updated or cached value
 */
export function pureFunction8(slotOffset, pureFn, exp1, exp2, exp3, exp4, exp5, exp6, exp7, exp8, thisArg) {
    ngDevMode && assertReservedSlotInitialized(slotOffset, 9);
    /** @type {?} */
    const index = moveBindingIndexToReservedSlot(slotOffset);
    /** @type {?} */
    const different = bindingUpdated4(exp1, exp2, exp3, exp4);
    /** @type {?} */
    const value = bindingUpdated4(exp5, exp6, exp7, exp8) || different ?
        checkAndUpdateBinding(thisArg ? pureFn.call(thisArg, exp1, exp2, exp3, exp4, exp5, exp6, exp7, exp8) :
            pureFn(exp1, exp2, exp3, exp4, exp5, exp6, exp7, exp8)) :
        consumeBinding();
    restoreBindingIndex(index);
    return value;
}
/**
 * pureFunction instruction that can support any number of bindings.
 *
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param {?} slotOffset the offset in the reserved slot space {\@link reserveSlots}
 * @param {?} pureFn A pure function that takes binding values and builds an object or array
 * containing those values.
 * @param {?} exps An array of binding values
 * @param {?=} thisArg Optional calling context of pureFn
 * @return {?} Updated or cached value
 */
export function pureFunctionV(slotOffset, pureFn, exps, thisArg) {
    ngDevMode && assertReservedSlotInitialized(slotOffset, exps.length + 1);
    /** @type {?} */
    const index = moveBindingIndexToReservedSlot(slotOffset);
    /** @type {?} */
    let different = false;
    for (let i = 0; i < exps.length; i++) {
        bindingUpdated(exps[i]) && (different = true);
    }
    /** @type {?} */
    const value = different ? checkAndUpdateBinding(pureFn.apply(thisArg, exps)) : consumeBinding();
    restoreBindingIndex(index);
    return value;
}
//# sourceMappingURL=pure_function.js.map