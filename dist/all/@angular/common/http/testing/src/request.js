"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("@angular/common/http");
/**
 * A mock requests that was received and is ready to be answered.
 *
 * This interface allows access to the underlying `HttpRequest`, and allows
 * responding with `HttpEvent`s or `HttpErrorResponse`s.
 *
 *
 */
var TestRequest = /** @class */ (function () {
    function TestRequest(request, observer) {
        this.request = request;
        this.observer = observer;
        /**
         * @internal set by `HttpClientTestingBackend`
         */
        this._cancelled = false;
    }
    Object.defineProperty(TestRequest.prototype, "cancelled", {
        /**
         * Whether the request was cancelled after it was sent.
         */
        get: function () { return this._cancelled; },
        enumerable: true,
        configurable: true
    });
    /**
     * Resolve the request by returning a body plus additional HTTP information (such as response
     * headers) if provided.
     *
     * Both successful and unsuccessful responses can be delivered via `flush()`.
     */
    TestRequest.prototype.flush = function (body, opts) {
        if (opts === void 0) { opts = {}; }
        if (this.cancelled) {
            throw new Error("Cannot flush a cancelled request.");
        }
        var url = this.request.urlWithParams;
        var headers = (opts.headers instanceof http_1.HttpHeaders) ? opts.headers : new http_1.HttpHeaders(opts.headers);
        body = _maybeConvertBody(this.request.responseType, body);
        var statusText = opts.statusText;
        var status = opts.status !== undefined ? opts.status : 200;
        if (opts.status === undefined) {
            if (body === null) {
                status = 204;
                statusText = statusText || 'No Content';
            }
            else {
                statusText = statusText || 'OK';
            }
        }
        if (statusText === undefined) {
            throw new Error('statusText is required when setting a custom status.');
        }
        if (status >= 200 && status < 300) {
            this.observer.next(new http_1.HttpResponse({ body: body, headers: headers, status: status, statusText: statusText, url: url }));
            this.observer.complete();
        }
        else {
            this.observer.error(new http_1.HttpErrorResponse({ error: body, headers: headers, status: status, statusText: statusText, url: url }));
        }
    };
    /**
     * Resolve the request by returning an `ErrorEvent` (e.g. simulating a network failure).
     */
    TestRequest.prototype.error = function (error, opts) {
        if (opts === void 0) { opts = {}; }
        if (this.cancelled) {
            throw new Error("Cannot return an error for a cancelled request.");
        }
        if (opts.status && opts.status >= 200 && opts.status < 300) {
            throw new Error("error() called with a successful status.");
        }
        var headers = (opts.headers instanceof http_1.HttpHeaders) ? opts.headers : new http_1.HttpHeaders(opts.headers);
        this.observer.error(new http_1.HttpErrorResponse({
            error: error,
            headers: headers,
            status: opts.status || 0,
            statusText: opts.statusText || '',
            url: this.request.urlWithParams,
        }));
    };
    /**
     * Deliver an arbitrary `HttpEvent` (such as a progress event) on the response stream for this
     * request.
     */
    TestRequest.prototype.event = function (event) {
        if (this.cancelled) {
            throw new Error("Cannot send events to a cancelled request.");
        }
        this.observer.next(event);
    };
    return TestRequest;
}());
exports.TestRequest = TestRequest;
/**
 * Helper function to convert a response body to an ArrayBuffer.
 */
function _toArrayBufferBody(body) {
    if (typeof ArrayBuffer === 'undefined') {
        throw new Error('ArrayBuffer responses are not supported on this platform.');
    }
    if (body instanceof ArrayBuffer) {
        return body;
    }
    throw new Error('Automatic conversion to ArrayBuffer is not supported for response type.');
}
/**
 * Helper function to convert a response body to a Blob.
 */
function _toBlob(body) {
    if (typeof Blob === 'undefined') {
        throw new Error('Blob responses are not supported on this platform.');
    }
    if (body instanceof Blob) {
        return body;
    }
    if (ArrayBuffer && body instanceof ArrayBuffer) {
        return new Blob([body]);
    }
    throw new Error('Automatic conversion to Blob is not supported for response type.');
}
/**
 * Helper function to convert a response body to JSON data.
 */
function _toJsonBody(body, format) {
    if (format === void 0) { format = 'JSON'; }
    if (typeof ArrayBuffer !== 'undefined' && body instanceof ArrayBuffer) {
        throw new Error("Automatic conversion to " + format + " is not supported for ArrayBuffers.");
    }
    if (typeof Blob !== 'undefined' && body instanceof Blob) {
        throw new Error("Automatic conversion to " + format + " is not supported for Blobs.");
    }
    if (typeof body === 'string' || typeof body === 'number' || typeof body === 'object' ||
        Array.isArray(body)) {
        return body;
    }
    throw new Error("Automatic conversion to " + format + " is not supported for response type.");
}
/**
 * Helper function to convert a response body to a string.
 */
function _toTextBody(body) {
    if (typeof body === 'string') {
        return body;
    }
    if (typeof ArrayBuffer !== 'undefined' && body instanceof ArrayBuffer) {
        throw new Error('Automatic conversion to text is not supported for ArrayBuffers.');
    }
    if (typeof Blob !== 'undefined' && body instanceof Blob) {
        throw new Error('Automatic conversion to text is not supported for Blobs.');
    }
    return JSON.stringify(_toJsonBody(body, 'text'));
}
/**
 * Convert a response body to the requested type.
 */
function _maybeConvertBody(responseType, body) {
    if (body === null) {
        return null;
    }
    switch (responseType) {
        case 'arraybuffer':
            return _toArrayBufferBody(body);
        case 'blob':
            return _toBlob(body);
        case 'json':
            return _toJsonBody(body);
        case 'text':
            return _toTextBody(body);
        default:
            throw new Error("Unsupported responseType: " + responseType);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi9odHRwL3Rlc3Rpbmcvc3JjL3JlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw2Q0FBMEc7QUFHMUc7Ozs7Ozs7R0FPRztBQUNIO0lBV0UscUJBQW1CLE9BQXlCLEVBQVUsUUFBa0M7UUFBckUsWUFBTyxHQUFQLE9BQU8sQ0FBa0I7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUEwQjtRQUx4Rjs7V0FFRztRQUNILGVBQVUsR0FBRyxLQUFLLENBQUM7SUFFd0UsQ0FBQztJQVA1RixzQkFBSSxrQ0FBUztRQUhiOztXQUVHO2FBQ0gsY0FBMkIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFTcEQ7Ozs7O09BS0c7SUFDSCwyQkFBSyxHQUFMLFVBQU0sSUFBOEUsRUFBRSxJQUloRjtRQUpnRixxQkFBQSxFQUFBLFNBSWhGO1FBQ0osSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztTQUN0RDtRQUNELElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO1FBQ3ZDLElBQU0sT0FBTyxHQUNULENBQUMsSUFBSSxDQUFDLE9BQU8sWUFBWSxrQkFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksa0JBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekYsSUFBSSxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFELElBQUksVUFBVSxHQUFxQixJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ25ELElBQUksTUFBTSxHQUFXLElB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