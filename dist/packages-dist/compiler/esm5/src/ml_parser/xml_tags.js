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
var XmlTagDefinition = /** @class */ (function () {
    function XmlTagDefinition() {
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
    XmlTagDefinition.prototype.requireExtraParent = /**
     * @param {?} currentParent
     * @return {?}
     */
    function (currentParent) { return false; };
    /**
     * @param {?} name
     * @return {?}
     */
    XmlTagDefinition.prototype.isClosedByChild = /**
     * @param {?} name
     * @return {?}
     */
    function (name) { return false; };
    return XmlTagDefinition;
}());
export { XmlTagDefinition };
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
var _TAG_DEFINITION = new XmlTagDefinition();
/**
 * @param {?} tagName
 * @return {?}
 */
export function getXmlTagDefinition(tagName) {
    return _TAG_DEFINITION;
}
//# sourceMappingURL=xml_tags.js.map