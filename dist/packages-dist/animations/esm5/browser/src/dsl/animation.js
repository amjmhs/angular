/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { ENTER_CLASSNAME, LEAVE_CLASSNAME, normalizeStyles } from '../util';
import { buildAnimationAst } from './animation_ast_builder';
import { buildAnimationTimelines } from './animation_timeline_builder';
import { ElementInstructionMap } from './element_instruction_map';
var Animation = /** @class */ (function () {
    function Animation(_driver, input) {
        this._driver = _driver;
        /** @type {?} */
        var errors = [];
        /** @type {?} */
        var ast = buildAnimationAst(_driver, input, errors);
        if (errors.length) {
            /** @type {?} */
            var errorMessage = "animation validation failed:\n" + errors.join("\n");
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
    Animation.prototype.buildTimelines = /**
     * @param {?} element
     * @param {?} startingStyles
     * @param {?} destinationStyles
     * @param {?} options
     * @param {?=} subInstructions
     * @return {?}
     */
    function (element, startingStyles, destinationStyles, options, subInstructions) {
        /** @type {?} */
        var start = Array.isArray(startingStyles) ? normalizeStyles(startingStyles) : /** @type {?} */ (startingStyles);
        /** @type {?} */
        var dest = Array.isArray(destinationStyles) ? normalizeStyles(destinationStyles) : /** @type {?} */ (destinationStyles);
        /** @type {?} */
        var errors = [];
        subInstructions = subInstructions || new ElementInstructionMap();
        /** @type {?} */
        var result = buildAnimationTimelines(this._driver, element, this._animationAst, ENTER_CLASSNAME, LEAVE_CLASSNAME, start, dest, options, subInstructions, errors);
        if (errors.length) {
            /** @type {?} */
            var errorMessage = "animation building failed:\n" + errors.join("\n");
            throw new Error(errorMessage);
        }
        return result;
    };
    return Animation;
}());
export { Animation };
if (false) {
    /** @type {?} */
    Animation.prototype._animationAst;
    /** @type {?} */
    Animation.prototype._driver;
}
//# sourceMappingURL=animation.js.map