/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { ResourceLoader } from '@angular/compiler';
import { Injectable } from '@angular/core';
var ResourceLoaderImpl = /** @class */ (function (_super) {
    tslib_1.__extends(ResourceLoaderImpl, _super);
    function ResourceLoaderImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} url
     * @return {?}
     */
    ResourceLoaderImpl.prototype.get = /**
     * @param {?} url
     * @return {?}
     */
    function (url) {
        /** @type {?} */
        var resolve;
        /** @type {?} */
        var reject;
        /** @type {?} */
        var promise = new Promise(function (res, rej) {
            resolve = res;
            reject = rej;
        });
        /** @type {?} */
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'text';
        xhr.onload = function () {
            /** @type {?} */
            var response = xhr.response || xhr.responseText;
            /** @type {?} */
            var status = xhr.status === 1223 ? 204 : xhr.status;
            // fix status code when it is 0 (0 status is undocumented).
            // Occurs when accessing file resources or on Android 4.1 stock browser
            // while retrieving files from application cache.
            if (status === 0) {
                status = response ? 200 : 0;
            }
            if (200 <= status && status <= 300) {
                resolve(response);
            }
            else {
                reject("Failed to load " + url);
            }
        };
        xhr.onerror = function () { reject("Failed to load " + url); };
        xhr.send();
        return promise;
    };
    ResourceLoaderImpl.decorators = [
        { type: Injectable },
    ];
    return ResourceLoaderImpl;
}(ResourceLoader));
export { ResourceLoaderImpl };
//# sourceMappingURL=resource_loader_impl.js.map