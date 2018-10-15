/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
export class ElementInstructionMap {
    constructor() {
        this._map = new Map();
    }
    /**
     * @param {?} element
     * @return {?}
     */
    consume(element) {
        /** @type {?} */
        let instructions = this._map.get(element);
        if (instructions) {
            this._map.delete(element);
        }
        else {
            instructions = [];
        }
        return instructions;
    }
    /**
     * @param {?} element
     * @param {?} instructions
     * @return {?}
     */
    append(element, instructions) {
        /** @type {?} */
        let existingInstructions = this._map.get(element);
        if (!existingInstructions) {
            this._map.set(element, existingInstructions = []);
        }
        existingInstructions.push(...instructions);
    }
    /**
     * @param {?} element
     * @return {?}
     */
    has(element) { return this._map.has(element); }
    /**
     * @return {?}
     */
    clear() { this._map.clear(); }
}
if (false) {
    /** @type {?} */
    ElementInstructionMap.prototype._map;
}
//# sourceMappingURL=element_instruction_map.js.map