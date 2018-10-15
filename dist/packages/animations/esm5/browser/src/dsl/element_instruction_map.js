/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var ElementInstructionMap = /** @class */ (function () {
    function ElementInstructionMap() {
        this._map = new Map();
    }
    /**
     * @param {?} element
     * @return {?}
     */
    ElementInstructionMap.prototype.consume = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        /** @type {?} */
        var instructions = this._map.get(element);
        if (instructions) {
            this._map.delete(element);
        }
        else {
            instructions = [];
        }
        return instructions;
    };
    /**
     * @param {?} element
     * @param {?} instructions
     * @return {?}
     */
    ElementInstructionMap.prototype.append = /**
     * @param {?} element
     * @param {?} instructions
     * @return {?}
     */
    function (element, instructions) {
        /** @type {?} */
        var existingInstructions = this._map.get(element);
        if (!existingInstructions) {
            this._map.set(element, existingInstructions = []);
        }
        existingInstructions.push.apply(existingInstructions, instructions);
    };
    /**
     * @param {?} element
     * @return {?}
     */
    ElementInstructionMap.prototype.has = /**
     * @param {?} element
     * @return {?}
     */
    function (element) { return this._map.has(element); };
    /**
     * @return {?}
     */
    ElementInstructionMap.prototype.clear = /**
     * @return {?}
     */
    function () { this._map.clear(); };
    return ElementInstructionMap;
}());
export { ElementInstructionMap };
if (false) {
    /** @type {?} */
    ElementInstructionMap.prototype._map;
}
//# sourceMappingURL=element_instruction_map.js.map