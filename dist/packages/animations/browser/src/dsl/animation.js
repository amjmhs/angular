/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { ENTER_CLASSNAME, LEAVE_CLASSNAME, normalizeStyles } from '../util';
import { buildAnimationAst } from './animation_ast_builder';
import { buildAnimationTimelines } from './animation_timeline_builder';
import { ElementInstructionMap } from './element_instruction_map';
export class Animation {
    /**
     * @param {?} _driver
     * @param {?} input
     */
    constructor(_driver, input) {
        this._driver = _driver;
        /** @type {?} */
        const errors = [];
        /** @type {?} */
        const ast = buildAnimationAst(_driver, input, errors);
        if (errors.length) {
            /** @type {?} */
            const errorMessage = `animation validation failed:\n${errors.join("\n")}`;
            throw new Error(errorMessage);
        }
        this._animationAst = ast;
    }
    /**
     * @param {?} element
     * @param {?} startingStyles
     * @param {?} destinationStyles
     * @param {?} options
     * @param {?=} subInstructions
     * @return {?}
     */
    buildTimelines(element, startingStyles, destinationStyles, options, subInstructions) {
        /** @type {?} */
        const start = Array.isArray(startingStyles) ? normalizeStyles(startingStyles) : /** @type {?} */ (startingStyles);
        /** @type {?} */
        const dest = Array.isArray(destinationStyles) ? normalizeStyles(destinationStyles) : /** @type {?} */ (destinationStyles);
        /** @type {?} */
        const errors = [];
        subInstructions = subInstructions || new ElementInstructionMap();
        /** @type {?} */
        const result = buildAnimationTimelines(this._driver, element, this._animationAst, ENTER_CLASSNAME, LEAVE_CLASSNAME, start, dest, options, subInstructions, errors);
        if (errors.length) {
            /** @type {?} */
            const errorMessage = `animation building failed:\n${errors.join("\n")}`;
            throw new Error(errorMessage);
        }
        return result;
    }
}
if (false) {
    /** @type {?} */
    Animation.prototype._animationAst;
    /** @type {?} */
    Animation.prototype._driver;
}
//# sourceMappingURL=animation.js.map