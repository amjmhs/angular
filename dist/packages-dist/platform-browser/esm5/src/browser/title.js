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
import { Inject, Injectable, inject } from '@angular/core';
import { getDOM } from '../dom/dom_adapter';
import { DOCUMENT } from '../dom/dom_tokens';
import * as i0 from "@angular/core";
/**
 * Factory to create Title service.
 * @return {?}
 */
export function createTitle() {
    return new Title(inject(DOCUMENT));
}
/**
 * A service that can be used to get and set the title of a current HTML document.
 *
 * Since an Angular application can't be bootstrapped on the entire HTML document (`<html>` tag)
 * it is not possible to bind to the `text` property of the `HTMLTitleElement` elements
 * (representing the `<title>` tag). Instead, this service can be used to set and get the current
 * title value.
 *
 * \@experimental
 */
var Title = /** @class */ (function () {
    function Title(_doc) {
        this._doc = _doc;
    }
    /**
     * Get the title of the current HTML document.
     */
    /**
     * Get the title of the current HTML document.
     * @return {?}
     */
    Title.prototype.getTitle = /**
     * Get the title of the current HTML document.
     * @return {?}
     */
    function () { return getDOM().getTitle(this._doc); };
    /**
     * Set the title of the current HTML document.
     * @param newTitle
     */
    /**
     * Set the title of the current HTML document.
     * @param {?} newTitle
     * @return {?}
     */
    Title.prototype.setTitle = /**
     * Set the title of the current HTML document.
     * @param {?} newTitle
     * @return {?}
     */
    function (newTitle) { getDOM().setTitle(this._doc, newTitle); };
    Title.decorators = [
        { type: Injectable, args: [{ providedIn: 'root', useFactory: createTitle, deps: [] },] },
    ];
    /** @nocollapse */
    Title.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
    ]; };
    /** @nocollapse */ Title.ngInjectableDef = i0.defineInjectable({ factory: createTitle, token: Title, providedIn: "root" });
    return Title;
}());
export { Title };
if (false) {
    /** @type {?} */
    Title.prototype._doc;
}
//# sourceMappingURL=title.js.map