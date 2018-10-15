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
import { assertEqual, assertLessThan } from './assert';
import { NO_CHANGE, bindingUpdated, bindingUpdated2, bindingUpdated4, createLNode, getPreviousOrParentNode, getRenderer, getViewData, load, resetApplicationState } from './instructions';
import { RENDER_PARENT } from './interfaces/container';
import { BINDING_INDEX, HEADER_OFFSET, TVIEW } from './interfaces/view';
import { appendChild, createTextNode, getParentLNode, removeChild } from './node_manipulation';
import { stringify } from './util';
/** @enum {number} */
var I18nInstructions = {
    Text: 536870912,
    Element: 1073741824,
    Expression: 1610612736,
    TemplateRoot: -2147483648,
    Any: -1610612736,
    CloseNode: -1073741824,
    RemoveNode: -536870912,
    /** Used to decode the number encoded with the instruction. */
    IndexMask: 536870911,
    /** Used to test the type of instruction. */
    InstructionMask: -536870912,
};
export { I18nInstructions };
/** @typedef {?} */
var I18nInstruction;
export { I18nInstruction };
/** @typedef {?} */
var I18nExpInstruction;
export { I18nExpInstruction };
/** @typedef {?} */
var PlaceholderMap;
export { PlaceholderMap };
/** @type {?} */
var i18nTagRegex = /{\$([^}]+)}/g;
/**
 * Takes a translation string, the initial list of placeholders (elements and expressions) and the
 * indexes of their corresponding expression nodes to return a list of instructions for each
 * template function.
 *
 * Because embedded templates have different indexes for each placeholder, each parameter (except
 * the translation) is an array, where each value corresponds to a different template, by order of
 * appearance.
 *
 * @param {?} translation A translation string where placeholders are represented by `{$name}`
 * @param {?} elements An array containing, for each template, the maps of element placeholders and
 * their indexes.
 * @param {?=} expressions An array containing, for each template, the maps of expression placeholders
 * and their indexes.
 * @param {?=} templateRoots An array of template roots whose content should be ignored when
 * generating the instructions for their parent template.
 * @param {?=} lastChildIndex The index of the last child of the i18n node. Used when the i18n block is
 * an ng-container.
 *
 * @return {?} A list of instructions used to translate each template.
 */
export function i18nMapping(translation, elements, expressions, templateRoots, lastChildIndex) {
    /** @type {?} */
    var translationParts = translation.split(i18nTagRegex);
    /** @type {?} */
    var nbTemplates = templateRoots ? templateRoots.length + 1 : 1;
    /** @type {?} */
    var instructions = (new Array(nbTemplates)).fill(undefined);
    generateMappingInstructions(0, 0, translationParts, instructions, elements, expressions, templateRoots, lastChildIndex);
    return instructions;
}
/**
 * Internal function that reads the translation parts and generates a set of instructions for each
 * template.
 *
 * See `i18nMapping()` for more details.
 *
 * @param {?} tmplIndex The order of appearance of the template.
 * 0 for the root template, following indexes match the order in `templateRoots`.
 * @param {?} partIndex The current index in `translationParts`.
 * @param {?} translationParts The translation string split into an array of placeholders and text
 * elements.
 * @param {?} instructions The current list of instructions to update.
 * @param {?} elements An array containing, for each template, the maps of element placeholders and
 * their indexes.
 * @param {?=} expressions An array containing, for each template, the maps of expression placeholders
 * and their indexes.
 * @param {?=} templateRoots An array of template roots whose content should be ignored when
 * generating the instructions for their parent template.
 * @param {?=} lastChildIndex The index of the last child of the i18n node. Used when the i18n block is
 * an ng-container.
 *
 * @return {?} the current index in `translationParts`
 */
function generateMappingInstructions(tmplIndex, partIndex, translationParts, instructions, elements, expressions, templateRoots, lastChildIndex) {
    /** @type {?} */
    var tmplInstructions = [];
    /** @type {?} */
    var phVisited = [];
    /** @type {?} */
    var openedTagCount = 0;
    /** @type {?} */
    var maxIndex = 0;
    /** @type {?} */
    var currentElements = elements && elements[tmplIndex] ? elements[tmplIndex] : null;
    /** @type {?} */
    var currentExpressions = expressions && expressions[tmplIndex] ? expressions[tmplIndex] : null;
    instructions[tmplIndex] = tmplInstructions;
    for (; partIndex < translationParts.length; partIndex++) {
        /** @type {?} */
        var value = translationParts[partIndex];
        // Odd indexes are placeholders
        if (partIndex & 1) {
            /** @type {?} */
            var phIndex = void 0;
            if (currentElements && currentElements[value] !== undefined) {
                phIndex = currentElements[value];
                /** @type {?} */
                var templateRootIndex = templateRoots ? templateRoots.indexOf(value) : -1;
                if (templateRootIndex !== -1 && (templateRootIndex + 1) !== tmplIndex) {
                    // This is a template root, it has no closing tag, not treating it as an element
                    tmplInstructions.push(phIndex | -2147483648 /* TemplateRoot */);
                }
                else {
                    tmplInstructions.push(phIndex | 1073741824 /* Element */);
                    openedTagCount++;
                }
                phVisited.push(value);
            }
            else if (currentExpressions && currentExpressions[value] !== undefined) {
                phIndex = currentExpressions[value];
                // The placeholder represents an expression, add an instruction to move it
                tmplInstructions.push(phIndex | 1610612736 /* Expression */);
                phVisited.push(value);
            }
            else {
                // It is a closing tag
                tmplInstructions.push(-1073741824 /* CloseNode */);
                if (tmplIndex > 0) {
                    openedTagCount--;
                    // If we have reached the closing tag for this template, exit the loop
                    if (openedTagCount === 0) {
                        break;
                    }
                }
            }
            if (phIndex !== undefined && phIndex > maxIndex) {
                maxIndex = phIndex;
            }
            if (templateRoots) {
                /** @type {?} */
                var newTmplIndex = templateRoots.indexOf(value) + 1;
                if (newTmplIndex !== 0 && newTmplIndex !== tmplIndex) {
                    partIndex = generateMappingInstructions(newTmplIndex, partIndex, translationParts, instructions, elements, expressions, templateRoots, lastChildIndex);
                }
            }
        }
        else if (value) {
            // It's a non-empty string, create a text node
            tmplInstructions.push(536870912 /* Text */, value);
        }
    }
    // Add instructions to remove elements that are not used in the translation
    if (elements) {
        /** @type {?} */
        var tmplElements = elements[tmplIndex];
        if (tmplElements) {
            /** @type {?} */
            var phKeys = Object.keys(tmplElements);
            for (var i = 0; i < phKeys.length; i++) {
                /** @type {?} */
                var ph = phKeys[i];
                if (phVisited.indexOf(ph) === -1) {
                    /** @type {?} */
                    var index = tmplElements[ph];
                    // Add an instruction to remove the element
                    tmplInstructions.push(index | -536870912 /* RemoveNode */);
                    if (index > maxIndex) {
                        maxIndex = index;
                    }
                }
            }
        }
    }
    // Add instructions to remove expressions that are not used in the translation
    if (expressions) {
        /** @type {?} */
        var tmplExpressions = expressions[tmplIndex];
        if (tmplExpressions) {
            /** @type {?} */
            var phKeys = Object.keys(tmplExpressions);
            for (var i = 0; i < phKeys.length; i++) {
                /** @type {?} */
                var ph = phKeys[i];
                if (phVisited.indexOf(ph) === -1) {
                    /** @type {?} */
                    var index = tmplExpressions[ph];
                    if (ngDevMode) {
                        assertLessThan(index.toString(2).length, 28, "Index " + index + " is too big and will overflow");
                    }
                    // Add an instruction to remove the expression
                    tmplInstructions.push(index | -536870912 /* RemoveNode */);
                    if (index > maxIndex) {
                        maxIndex = index;
                    }
                }
            }
        }
    }
    if (tmplIndex === 0 && typeof lastChildIndex === 'number') {
        // The current parent is an ng-container and it has more children after the translation that we
        // need to append to keep the order of the DOM nodes correct
        for (var i = maxIndex + 1; i <= lastChildIndex; i++) {
            if (ngDevMode) {
                assertLessThan(i.toString(2).length, 28, "Index " + i + " is too big and will overflow");
            }
            tmplInstructions.push(i | -1610612736 /* Any */);
        }
    }
    return partIndex;
}
/**
 * @param {?} node
 * @param {?} parentNode
 * @param {?} previousNode
 * @return {?}
 */
function appendI18nNode(node, parentNode, previousNode) {
    if (ngDevMode) {
        ngDevMode.rendererMoveNode++;
    }
    /** @type {?} */
    var viewData = getViewData();
    appendChild(parentNode, node.native || null, viewData);
    /** @type {?} */
    var firstTemplatePass = node.view[TVIEW].firstTemplatePass;
    if (firstTemplatePass) {
        if (previousNode === parentNode && node.tNode !== parentNode.tNode.child) {
            node.tNode.next = parentNode.tNode.child;
            parentNode.tNode.child = node.tNode;
        }
        else if (previousNode !== parentNode && node.tNode !== previousNode.tNode.next) {
            node.tNode.next = previousNode.tNode.next;
            previousNode.tNode.next = node.tNode;
        }
        else {
            node.tNode.next = null;
        }
        if (parentNode.view === node.view)
            node.tNode.parent = /** @type {?} */ (parentNode.tNode);
    }
    // Template containers also have a comment node for the `ViewContainerRef` that should be moved
    if (node.tNode.type === 0 /* Container */ && node.dynamicLContainerNode) {
        appendChild(parentNode, node.dynamicLContainerNode.native || null, viewData);
        if (firstTemplatePass) {
            node.tNode.dynamicContainerNode = node.dynamicLContainerNode.tNode;
            node.dynamicLContainerNode.tNode.parent = /** @type {?} */ (node.tNode);
        }
        return node.dynamicLContainerNode;
    }
    return node;
}
/**
 * Takes a list of instructions generated by `i18nMapping()` to transform the template accordingly.
 *
 * @param {?} startIndex Index of the first element to translate (for instance the first child of the
 * element with the i18n attribute).
 * @param {?} instructions The list of instructions to apply on the current view.
 * @return {?}
 */
export function i18nApply(startIndex, instructions) {
    /** @type {?} */
    var viewData = getViewData();
    if (ngDevMode) {
        assertEqual(viewData[BINDING_INDEX], -1, 'i18nApply should be called before any binding');
    }
    if (!instructions) {
        return;
    }
    /** @type {?} */
    var renderer = getRenderer();
    /** @type {?} */
    var localParentNode = getParentLNode(load(startIndex)) || getPreviousOrParentNode();
    /** @type {?} */
    var localPreviousNode = localParentNode;
    resetApplicationState(); // We don't want to add to the tree with the wrong previous node
    for (var i = 0; i < instructions.length; i++) {
        /** @type {?} */
        var instruction = /** @type {?} */ (instructions[i]);
        switch (instruction & -536870912 /* InstructionMask */) {
            case 1073741824 /* Element */:
                /** @type {?} */
                var element = load(instruction & 536870911 /* IndexMask */);
                localPreviousNode = appendI18nNode(element, localParentNode, localPreviousNode);
                localParentNode = element;
                break;
            case 1610612736 /* Expression */:
            case -2147483648 /* TemplateRoot */:
            case -1610612736 /* Any */:
                /** @type {?} */
                var node = load(instruction & 536870911 /* IndexMask */);
                localPreviousNode = appendI18nNode(node, localParentNode, localPreviousNode);
                break;
            case 536870912 /* Text */:
                if (ngDevMode) {
                    ngDevMode.rendererCreateTextNode++;
                }
                /** @type {?} */
                var value = instructions[++i];
                /** @type {?} */
                var textRNode = createTextNode(value, renderer);
                /** @type {?} */
                var textLNode = createLNode(viewData.length - HEADER_OFFSET, 3 /* Element */, textRNode, null, null);
                localPreviousNode = appendI18nNode(textLNode, localParentNode, localPreviousNode);
                resetApplicationState();
                break;
            case -1073741824 /* CloseNode */:
                localPreviousNode = localParentNode;
                localParentNode = /** @type {?} */ ((getParentLNode(localParentNode)));
                break;
            case -536870912 /* RemoveNode */:
                if (ngDevMode) {
                    ngDevMode.rendererRemoveNode++;
                }
                /** @type {?} */
                var index = instruction & 536870911 /* IndexMask */;
                /** @type {?} */
                var removedNode = load(index);
                /** @type {?} */
                var parentNode = /** @type {?} */ ((getParentLNode(removedNode)));
                removeChild(parentNode, removedNode.native || null, viewData);
                // For template containers we also need to remove their `ViewContainerRef` from the DOM
                if (removedNode.tNode.type === 0 /* Container */ && removedNode.dynamicLContainerNode) {
                    removeChild(parentNode, removedNode.dynamicLContainerNode.native || null, viewData);
                    removedNode.dynamicLContainerNode.tNode.detached = true;
                    removedNode.dynamicLContainerNode.data[RENDER_PARENT] = null;
                }
                break;
        }
    }
}
/**
 * Takes a translation string and the initial list of expressions and returns a list of instructions
 * that will be used to translate an attribute.
 * Even indexes contain static strings, while odd indexes contain the index of the expression whose
 * value will be concatenated into the final translation.
 * @param {?} translation
 * @param {?} placeholders
 * @return {?}
 */
export function i18nExpMapping(translation, placeholders) {
    /** @type {?} */
    var staticText = translation.split(i18nTagRegex);
    // odd indexes are placeholders
    for (var i = 1; i < staticText.length; i += 2) {
        staticText[i] = placeholders[staticText[i]];
    }
    return staticText;
}
/**
 * Checks if the value of an expression has changed and replaces it by its value in a translation,
 * or returns NO_CHANGE.
 *
 * @param {?} instructions A list of instructions that will be used to translate an attribute.
 * @param {?} v0 value checked for change.
 *
 * @return {?} The concatenated string when any of the arguments changes, `NO_CHANGE` otherwise.
 */
export function i18nInterpolation1(instructions, v0) {
    /** @type {?} */
    var different = bindingUpdated(v0);
    if (!different) {
        return NO_CHANGE;
    }
    /** @type {?} */
    var res = '';
    for (var i = 0; i < instructions.length; i++) {
        // Odd indexes are bindings
        if (i & 1) {
            res += stringify(v0);
        }
        else {
            res += instructions[i];
        }
    }
    return res;
}
/**
 * Checks if the values of up to 2 expressions have changed and replaces them by their values in a
 * translation, or returns NO_CHANGE.
 *
 * @param {?} instructions A list of instructions that will be used to translate an attribute.
 * @param {?} v0 value checked for change.
 * @param {?} v1 value checked for change.
 *
 * @return {?} The concatenated string when any of the arguments changes, `NO_CHANGE` otherwise.
 */
export function i18nInterpolation2(instructions, v0, v1) {
    /** @type {?} */
    var different = bindingUpdated2(v0, v1);
    if (!different) {
        return NO_CHANGE;
    }
    /** @type {?} */
    var res = '';
    for (var i = 0; i < instructions.length; i++) {
        // Odd indexes are bindings
        if (i & 1) {
            /** @type {?} */
            var idx = /** @type {?} */ (instructions[i]);
            /** @type {?} */
            var b1 = idx & 1;
            /** @type {?} */
            var value = b1 ? v1 : v0;
            res += stringify(value);
        }
        else {
            res += instructions[i];
        }
    }
    return res;
}
/**
 * Checks if the values of up to 3 expressions have changed and replaces them by their values in a
 * translation, or returns NO_CHANGE.
 *
 * @param {?} instructions A list of instructions that will be used to translate an attribute.
 * @param {?} v0 value checked for change.
 * @param {?} v1 value checked for change.
 * @param {?} v2 value checked for change.
 *
 * @return {?} The concatenated string when any of the arguments changes, `NO_CHANGE` otherwise.
 */
export function i18nInterpolation3(instructions, v0, v1, v2) {
    /** @type {?} */
    var different = bindingUpdated2(v0, v1);
    different = bindingUpdated(v2) || different;
    if (!different) {
        return NO_CHANGE;
    }
    /** @type {?} */
    var res = '';
    for (var i = 0; i < instructions.length; i++) {
        // Odd indexes are bindings
        if (i & 1) {
            /** @type {?} */
            var idx = /** @type {?} */ (instructions[i]);
            /** @type {?} */
            var b2 = idx & 2;
            /** @type {?} */
            var b1 = idx & 1;
            /** @type {?} */
            var value = b2 ? v2 : (b1 ? v1 : v0);
            res += stringify(value);
        }
        else {
            res += instructions[i];
        }
    }
    return res;
}
/**
 * Checks if the values of up to 4 expressions have changed and replaces them by their values in a
 * translation, or returns NO_CHANGE.
 *
 * @param {?} instructions A list of instructions that will be used to translate an attribute.
 * @param {?} v0 value checked for change.
 * @param {?} v1 value checked for change.
 * @param {?} v2 value checked for change.
 * @param {?} v3 value checked for change.
 *
 * @return {?} The concatenated string when any of the arguments changes, `NO_CHANGE` otherwise.
 */
export function i18nInterpolation4(instructions, v0, v1, v2, v3) {
    /** @type {?} */
    var different = bindingUpdated4(v0, v1, v2, v3);
    if (!different) {
        return NO_CHANGE;
    }
    /** @type {?} */
    var res = '';
    for (var i = 0; i < instructions.length; i++) {
        // Odd indexes are bindings
        if (i & 1) {
            /** @type {?} */
            var idx = /** @type {?} */ (instructions[i]);
            /** @type {?} */
            var b2 = idx & 2;
            /** @type {?} */
            var b1 = idx & 1;
            /** @type {?} */
            var value = b2 ? (b1 ? v3 : v2) : (b1 ? v1 : v0);
            res += stringify(value);
        }
        else {
            res += instructions[i];
        }
    }
    return res;
}
/**
 * Checks if the values of up to 5 expressions have changed and replaces them by their values in a
 * translation, or returns NO_CHANGE.
 *
 * @param {?} instructions A list of instructions that will be used to translate an attribute.
 * @param {?} v0 value checked for change.
 * @param {?} v1 value checked for change.
 * @param {?} v2 value checked for change.
 * @param {?} v3 value checked for change.
 * @param {?} v4 value checked for change.
 *
 * @return {?} The concatenated string when any of the arguments changes, `NO_CHANGE` otherwise.
 */
export function i18nInterpolation5(instructions, v0, v1, v2, v3, v4) {
    /** @type {?} */
    var different = bindingUpdated4(v0, v1, v2, v3);
    different = bindingUpdated(v4) || different;
    if (!different) {
        return NO_CHANGE;
    }
    /** @type {?} */
    var res = '';
    for (var i = 0; i < instructions.length; i++) {
        // Odd indexes are bindings
        if (i & 1) {
            /** @type {?} */
            var idx = /** @type {?} */ (instructions[i]);
            /** @type {?} */
            var b4 = idx & 4;
            /** @type {?} */
            var b2 = idx & 2;
            /** @type {?} */
            var b1 = idx & 1;
            /** @type {?} */
            var value = b4 ? v4 : (b2 ? (b1 ? v3 : v2) : (b1 ? v1 : v0));
            res += stringify(value);
        }
        else {
            res += instructions[i];
        }
    }
    return res;
}
/**
 * Checks if the values of up to 6 expressions have changed and replaces them by their values in a
 * translation, or returns NO_CHANGE.
 *
 * @param {?} instructions A list of instructions that will be used to translate an attribute.
 * @param {?} v0 value checked for change.
 * @param {?} v1 value checked for change.
 * @param {?} v2 value checked for change.
 * @param {?} v3 value checked for change.
 * @param {?} v4 value checked for change.
 * @param {?} v5 value checked for change.
 *
 * @return {?} The concatenated string when any of the arguments changes, `NO_CHANGE` otherwise.
 */
export function i18nInterpolation6(instructions, v0, v1, v2, v3, v4, v5) {
    /** @type {?} */
    var different = bindingUpdated4(v0, v1, v2, v3);
    different = bindingUpdated2(v4, v5) || different;
    if (!different) {
        return NO_CHANGE;
    }
    /** @type {?} */
    var res = '';
    for (var i = 0; i < instructions.length; i++) {
        // Odd indexes are bindings
        if (i & 1) {
            /** @type {?} */
            var idx = /** @type {?} */ (instructions[i]);
            /** @type {?} */
            var b4 = idx & 4;
            /** @type {?} */
            var b2 = idx & 2;
            /** @type {?} */
            var b1 = idx & 1;
            /** @type {?} */
            var value = b4 ? (b1 ? v5 : v4) : (b2 ? (b1 ? v3 : v2) : (b1 ? v1 : v0));
            res += stringify(value);
        }
        else {
            res += instructions[i];
        }
    }
    return res;
}
/**
 * Checks if the values of up to 7 expressions have changed and replaces them by their values in a
 * translation, or returns NO_CHANGE.
 *
 * @param {?} instructions A list of instructions that will be used to translate an attribute.
 * @param {?} v0 value checked for change.
 * @param {?} v1 value checked for change.
 * @param {?} v2 value checked for change.
 * @param {?} v3 value checked for change.
 * @param {?} v4 value checked for change.
 * @param {?} v5 value checked for change.
 * @param {?} v6 value checked for change.
 *
 * @return {?} The concatenated string when any of the arguments changes, `NO_CHANGE` otherwise.
 */
export function i18nInterpolation7(instructions, v0, v1, v2, v3, v4, v5, v6) {
    /** @type {?} */
    var different = bindingUpdated4(v0, v1, v2, v3);
    different = bindingUpdated2(v4, v5) || different;
    different = bindingUpdated(v6) || different;
    if (!different) {
        return NO_CHANGE;
    }
    /** @type {?} */
    var res = '';
    for (var i = 0; i < instructions.length; i++) {
        // Odd indexes are bindings
        if (i & 1) {
            /** @type {?} */
            var idx = /** @type {?} */ (instructions[i]);
            /** @type {?} */
            var b4 = idx & 4;
            /** @type {?} */
            var b2 = idx & 2;
            /** @type {?} */
            var b1 = idx & 1;
            /** @type {?} */
            var value = b4 ? (b2 ? v6 : (b1 ? v5 : v4)) : (b2 ? (b1 ? v3 : v2) : (b1 ? v1 : v0));
            res += stringify(value);
        }
        else {
            res += instructions[i];
        }
    }
    return res;
}
/**
 * Checks if the values of up to 8 expressions have changed and replaces them by their values in a
 * translation, or returns NO_CHANGE.
 *
 * @param {?} instructions A list of instructions that will be used to translate an attribute.
 * @param {?} v0 value checked for change.
 * @param {?} v1 value checked for change.
 * @param {?} v2 value checked for change.
 * @param {?} v3 value checked for change.
 * @param {?} v4 value checked for change.
 * @param {?} v5 value checked for change.
 * @param {?} v6 value checked for change.
 * @param {?} v7 value checked for change.
 *
 * @return {?} The concatenated string when any of the arguments changes, `NO_CHANGE` otherwise.
 */
export function i18nInterpolation8(instructions, v0, v1, v2, v3, v4, v5, v6, v7) {
    /** @type {?} */
    var different = bindingUpdated4(v0, v1, v2, v3);
    different = bindingUpdated4(v4, v5, v6, v7) || different;
    if (!different) {
        return NO_CHANGE;
    }
    /** @type {?} */
    var res = '';
    for (var i = 0; i < instructions.length; i++) {
        // Odd indexes are bindings
        if (i & 1) {
            /** @type {?} */
            var idx = /** @type {?} */ (instructions[i]);
            /** @type {?} */
            var b4 = idx & 4;
            /** @type {?} */
            var b2 = idx & 2;
            /** @type {?} */
            var b1 = idx & 1;
            /** @type {?} */
            var value = b4 ? (b2 ? (b1 ? v7 : v6) : (b1 ? v5 : v4)) : (b2 ? (b1 ? v3 : v2) : (b1 ? v1 : v0));
            res += stringify(value);
        }
        else {
            res += instructions[i];
        }
    }
    return res;
}
/**
 * Create a translated interpolation binding with a variable number of expressions.
 *
 * If there are 1 to 8 expressions then `i18nInterpolation()` should be used instead. It is faster
 * because there is no need to create an array of expressions and iterate over it.
 *
 * @param {?} instructions
 * @param {?} values
 * @return {?} The concatenated string when any of the arguments changes, `NO_CHANGE` otherwise.
 */
export function i18nInterpolationV(instructions, values) {
    /** @type {?} */
    var different = false;
    for (var i = 0; i < values.length; i++) {
        // Check if bindings have changed
        bindingUpdated(values[i]) && (different = true);
    }
    if (!different) {
        return NO_CHANGE;
    }
    /** @type {?} */
    var res = '';
    for (var i = 0; i < instructions.length; i++) {
        // Odd indexes are placeholders
        if (i & 1) {
            res += stringify(values[/** @type {?} */ (instructions[i])]);
        }
        else {
            res += instructions[i];
        }
    }
    return res;
}
//# sourceMappingURL=i18n.js.map