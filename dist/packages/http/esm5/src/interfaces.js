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
/**
 * Abstract class from which real backends are derived.
 *
 * The primary purpose of a `ConnectionBackend` is to create new connections to fulfill a given
 * {\@link Request}.
 *
 * @deprecated see https://angular.io/guide/http
 * @abstract
 */
var /**
 * Abstract class from which real backends are derived.
 *
 * The primary purpose of a `ConnectionBackend` is to create new connections to fulfill a given
 * {\@link Request}.
 *
 * @deprecated see https://angular.io/guide/http
 * @abstract
 */
ConnectionBackend = /** @class */ (function () {
    function ConnectionBackend() {
    }
    return ConnectionBackend;
}());
/**
 * Abstract class from which real backends are derived.
 *
 * The primary purpose of a `ConnectionBackend` is to create new connections to fulfill a given
 * {\@link Request}.
 *
 * @deprecated see https://angular.io/guide/http
 * @abstract
 */
export { ConnectionBackend };
if (false) {
    /**
     * @abstract
     * @param {?} request
     * @return {?}
     */
    ConnectionBackend.prototype.createConnection = function (request) { };
}
/**
 * Abstract class from which real connections are derived.
 *
 * @deprecated see https://angular.io/guide/http
 * @abstract
 */
var /**
 * Abstract class from which real connections are derived.
 *
 * @deprecated see https://angular.io/guide/http
 * @abstract
 */
Connection = /** @class */ (function () {
    function Connection() {
    }
    return Connection;
}());
/**
 * Abstract class from which real connections are derived.
 *
 * @deprecated see https://angular.io/guide/http
 * @abstract
 */
export { Connection };
if (false) {
    /** @type {?} */
    Connection.prototype.readyState;
    /** @type {?} */
    Connection.prototype.request;
    /** @type {?} */
    Connection.prototype.response;
}
/**
 * An XSRFStrategy configures XSRF protection (e.g. via headers) on an HTTP request.
 *
 * @deprecated see https://angular.io/guide/http
 * @abstract
 */
var /**
 * An XSRFStrategy configures XSRF protection (e.g. via headers) on an HTTP request.
 *
 * @deprecated see https://angular.io/guide/http
 * @abstract
 */
XSRFStrategy = /** @class */ (function () {
    function XSRFStrategy() {
    }
    return XSRFStrategy;
}());
/**
 * An XSRFStrategy configures XSRF protection (e.g. via headers) on an HTTP request.
 *
 * @deprecated see https://angular.io/guide/http
 * @abstract
 */
export { XSRFStrategy };
if (false) {
    /**
     * @abstract
     * @param {?} req
     * @return {?}
     */
    XSRFStrategy.prototype.configureRequest = function (req) { };
}
/**
 * Interface for options to construct a RequestOptions, based on
 * [RequestInit](https://fetch.spec.whatwg.org/#requestinit) from the Fetch spec.
 *
 * @deprecated see https://angular.io/guide/http
 * @record
 */
export function RequestOptionsArgs() { }
/** @type {?|undefined} */
RequestOptionsArgs.prototype.url;
/** @type {?|undefined} */
RequestOptionsArgs.prototype.method;
/**
 * @deprecated from 4.0.0. Use params instead.
 * @type {?|undefined}
 */
RequestOptionsArgs.prototype.search;
/** @type {?|undefined} */
RequestOptionsArgs.prototype.params;
/** @type {?|undefined} */
RequestOptionsArgs.prototype.headers;
/** @type {?|undefined} */
RequestOptionsArgs.prototype.body;
/** @type {?|undefined} */
RequestOptionsArgs.prototype.withCredentials;
/** @type {?|undefined} */
RequestOptionsArgs.prototype.responseType;
/**
 * Required structure when constructing new Request();
 * @record
 */
export function RequestArgs() { }
/** @type {?} */
RequestArgs.prototype.url;
/**
 * Interface for options to construct a Response, based on
 * [ResponseInit](https://fetch.spec.whatwg.org/#responseinit) from the Fetch spec.
 *
 * @deprecated see https://angular.io/guide/http
 * @record
 */
export function ResponseOptionsArgs() { }
/** @type {?|undefined} */
ResponseOptionsArgs.prototype.body;
/** @type {?|undefined} */
ResponseOptionsArgs.prototype.status;
/** @type {?|undefined} */
ResponseOptionsArgs.prototype.statusText;
/** @type {?|undefined} */
ResponseOptionsArgs.prototype.headers;
/** @type {?|undefined} */
ResponseOptionsArgs.prototype.type;
/** @type {?|undefined} */
ResponseOptionsArgs.prototype.url;
//# sourceMappingURL=interfaces.js.map