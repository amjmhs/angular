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
import { TagContentType } from './tags';
export class XmlTagDefinition {
    constructor() {
        this.closedByParent = false;
        this.contentType = TagContentType.PARSABLE_DATA;
        this.isVoid = false;
        this.ignoreFirstLf = false;
        this.canSelfClose = true;
    }
    /**
     * @param {?} currentParent
     * @return {?}
     */
    requireExtraParent(currentParent) { return false; }
    /**
     * @param {?} name
     * @return {?}
     */
    isClosedByChild(name) { return false; }
}
if (false) {
    /** @type {?} */
    XmlTagDefinition.prototype.closedByParent;
    /** @type {?} */
    XmlTagDefinition.prototype.requiredParents;
    /** @type {?} */
    XmlTagDefinition.prototype.parentToAdd;
    /** @type {?} */
    XmlTagDefinition.prototype.implicitNamespacePrefix;
    /** @type {?} */
    XmlTagDefinition.prototype.contentType;
    /** @type {?} */
    XmlTagDefinition.prototype.isVoid;
    /** @type {?} */
    XmlTagDefinition.prototype.ignoreFirstLf;
    /** @type {?} */
    XmlTagDefinition.prototype.canSelfClose;
}
/** @type {?} */
const _TAG_DEFINITION = new XmlTagDefinition();
/**
 * @param {?} tagName
 * @return {?}
 */
export function getXmlTagDefinition(tagName) {
    return _TAG_DEFINITION;
}
//# sourceMappingURL=xml_tags.js.map