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
import { isNgContent } from '../ml_parser/tags';
/** @type {?} */
var NG_CONTENT_SELECT_ATTR = 'select';
/** @type {?} */
var LINK_ELEMENT = 'link';
/** @type {?} */
var LINK_STYLE_REL_ATTR = 'rel';
/** @type {?} */
var LINK_STYLE_HREF_ATTR = 'href';
/** @type {?} */
var LINK_STYLE_REL_VALUE = 'stylesheet';
/** @type {?} */
var STYLE_ELEMENT = 'style';
/** @type {?} */
var SCRIPT_ELEMENT = 'script';
/** @type {?} */
var NG_NON_BINDABLE_ATTR = 'ngNonBindable';
/** @type {?} */
var NG_PROJECT_AS = 'ngProjectAs';
/**
 * @param {?} ast
 * @return {?}
 */
export function preparseElement(ast) {
    /** @type {?} */
    var selectAttr = /** @type {?} */ ((null));
    /** @type {?} */
    var hrefAttr = /** @type {?} */ ((null));
    /** @type {?} */
    var relAttr = /** @type {?} */ ((null));
    /** @type {?} */
    var nonBindable = false;
    /** @type {?} */
    var projectAs = '';
    ast.attrs.forEach(function (attr) {
        /** @type {?} */
        var lcAttrName = attr.name.toLowerCase();
        if (lcAttrName == NG_CONTENT_SELECT_ATTR) {
            selectAttr = attr.value;
        }
        else if (lcAttrName == LINK_STYLE_HREF_ATTR) {
            hrefAttr = attr.value;
        }
        else if (lcAttrName == LINK_STYLE_REL_ATTR) {
            relAttr = attr.value;
        }
        else if (attr.name == NG_NON_BINDABLE_ATTR) {
            nonBindable = true;
        }
        else if (attr.name == NG_PROJECT_AS) {
            if (attr.value.length > 0) {
                projectAs = attr.value;
            }
        }
    });
    selectAttr = normalizeNgContentSelect(selectAttr);
    /** @type {?} */
    var nodeName = ast.name.toLowerCase();
    /** @type {?} */
    var type = PreparsedElementType.OTHER;
    if (isNgContent(nodeName)) {
        type = PreparsedElementType.NG_CONTENT;
    }
    else if (nodeName == STYLE_ELEMENT) {
        type = PreparsedElementType.STYLE;
    }
    else if (nodeName == SCRIPT_ELEMENT) {
        type = PreparsedElementType.SCRIPT;
    }
    else if (nodeName == LINK_ELEMENT && relAttr == LINK_STYLE_REL_VALUE) {
        type = PreparsedElementType.STYLESHEET;
    }
    return new PreparsedElement(type, selectAttr, hrefAttr, nonBindable, projectAs);
}
/** @enum {number} */
var PreparsedElementType = {
    NG_CONTENT: 0,
    STYLE: 1,
    STYLESHEET: 2,
    SCRIPT: 3,
    OTHER: 4,
};
export { PreparsedElementType };
PreparsedElementType[PreparsedElementType.NG_CONTENT] = 'NG_CONTENT';
PreparsedElementType[PreparsedElementType.STYLE] = 'STYLE';
PreparsedElementType[PreparsedElementType.STYLESHEET] = 'STYLESHEET';
PreparsedElementType[PreparsedElementType.SCRIPT] = 'SCRIPT';
PreparsedElementType[PreparsedElementType.OTHER] = 'OTHER';
var PreparsedElement = /** @class */ (function () {
    function PreparsedElement(type, selectAttr, hrefAttr, nonBindable, projectAs) {
        this.type = type;
        this.selectAttr = selectAttr;
        this.hrefAttr = hrefAttr;
        this.nonBindable = nonBindable;
        this.projectAs = projectAs;
    }
    return PreparsedElement;
}());
export { PreparsedElement };
if (false) {
    /** @type {?} */
    PreparsedElement.prototype.type;
    /** @type {?} */
    PreparsedElement.prototype.selectAttr;
    /** @type {?} */
    PreparsedElement.prototype.hrefAttr;
    /** @type {?} */
    PreparsedElement.prototype.nonBindable;
    /** @type {?} */
    PreparsedElement.prototype.projectAs;
}
/**
 * @param {?} selectAttr
 * @return {?}
 */
function normalizeNgContentSelect(selectAttr) {
    if (selectAttr === null || selectAttr.length === 0) {
        return '*';
    }
    return selectAttr;
}
//# sourceMappingURL=template_preparser.js.map