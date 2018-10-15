"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var headers_1 = require("../src/headers");
var MockXhrFactory = /** @class */ (function () {
    function MockXhrFactory() {
    }
    MockXhrFactory.prototype.build = function () { return (this.mock = new MockXMLHttpRequest()); };
    return MockXhrFactory;
}());
exports.MockXhrFactory = MockXhrFactory;
var MockXMLHttpRequestUpload = /** @class */ (function () {
    function MockXMLHttpRequestUpload(mock) {
        this.mock = mock;
    }
    MockXMLHttpRequestUpload.prototype.addEventListener = function (event, handler) {
        this.mock.addEventListener('uploadProgress', handler);
    };
    MockXMLHttpRequestUpload.prototype.removeEventListener = function (event, handler) {
        this.mock.removeEventListener('uploadProgress');
    };
    return MockXMLHttpRequestUpload;
}());
exports.MockXMLHttpRequestUpload = MockXMLHttpRequestUpload;
var MockXMLHttpRequest = /** @class */ (function () {
    function MockXMLHttpRequest() {
        this.mockHeaders = {};
        this.mockAborted = false;
        // Directly settable interface.
        this.withCredentials = false;
        this.responseType = 'text';
        // Mocked response interface.
        this.response = undefined;
        this.responseText = undefined;
        this.responseURL = null;
        this.status = 0;
        this.statusText = '';
        this.mockResponseHeaders = '';
        this.listeners = {};
        this.upload = new MockXMLHttpRequestUpload(this);
    }
    MockXMLHttpRequest.prototype.open = function (method, url) {
        this.method = method;
        this.url = url;
    };
    MockXMLHttpRequest.prototype.send = function (body) { this.body = body; };
    MockXMLHttpRequest.prototype.addEventListener = function (event, handler) {
        this.listeners[event] = handler;
    };
    MockXMLHttpRequest.prototype.removeEventListener = function (event) {
        delete this.listeners[event];
    };
    MockXMLHttpRequest.prototype.setRequestHeader = function (name, value) { this.mockHeaders[name] = value; };
    MockXMLHttpRequest.prototype.getAllResponseHeaders = function () { return this.mockResponseHeaders; };
    MockXMLHttpRequest.prototype.getResponseHeader = function (header) {
        return new headers_1.HttpHeaders(this.mockResponseHeaders).get(header);
    };
    MockXMLHttpRequest.prototype.mockFlush = function (status, statusText, body) {
        if (typeof body === 'string') {
            this.responseText = body;
        }
        else {
            this.response = body;
        }
        this.status = status;
        this.statusText = statusText;
        this.mockLoadEvent();
    };
    MockXMLHttpRequest.prototype.mockDownloadProgressEvent = function (loaded, total) {
        if (this.listeners.progress) {
            this.listeners.progress({ lengthComputable: total !== undefined, loaded: loaded, total: total });
        }
    };
    MockXMLHttpRequest.prototype.mockUploadProgressEvent = function (loaded, total) {
        if (this.listeners.uploadProgress) {
            this.listeners.uploadProgress({ lengthComputable: total !== undefined, loaded: loaded, total: total, });
        }
    };
    MockXMLHttpRequest.prototype.mockLoadEvent = function () {
        if (this.listeners.load) {
            this.listeners.load();
        }
    };
    MockXMLHttpRequest.prototype.mockErrorEvent = function (error) {
        if (this.listeners.error) {
            this.listeners.error(error);
        }
    };
    MockXMLHttpRequest.prototype.abort = function () { this.mockAborted = true; };
    return MockXMLHttpRequest;
}());
exports.MockXMLHttpRequest = MockXMLHttpRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGhyX21vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vaHR0cC90ZXN0L3hocl9tb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMENBQTJDO0FBRzNDO0lBQUE7SUFLQSxDQUFDO0lBREMsOEJBQUssR0FBTCxjQUEwQixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQVEsQ0FBQyxDQUFDLENBQUM7SUFDbkYscUJBQUM7QUFBRCxDQUFDLEFBTEQsSUFLQztBQUxZLHdDQUFjO0FBTzNCO0lBQ0Usa0NBQW9CLElBQXdCO1FBQXhCLFNBQUksR0FBSixJQUFJLENBQW9CO0lBQUcsQ0FBQztJQUVoRCxtREFBZ0IsR0FBaEIsVUFBaUIsS0FBaUIsRUFBRSxPQUFpQjtRQUNuRCxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxzREFBbUIsR0FBbkIsVUFBb0IsS0FBaUIsRUFBRSxPQUFpQjtRQUN0RCxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUNILCtCQUFDO0FBQUQsQ0FBQyxBQVZELElBVUM7QUFWWSw0REFBd0I7QUFZckM7SUFBQTtRQU9FLGdCQUFXLEdBQTRCLEVBQUUsQ0FBQztRQUMxQyxnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUU3QiwrQkFBK0I7UUFDL0Isb0JBQWUsR0FBWSxLQUFLLENBQUM7UUFDakMsaUJBQVksR0FBVyxNQUFNLENBQUM7UUFFOUIsNkJBQTZCO1FBQzdCLGFBQVEsR0FBa0IsU0FBUyxDQUFDO1FBQ3BDLGlCQUFZLEdBQXFCLFNBQVMsQ0FBQztRQUMzQyxnQkFBVyxHQUFnQixJQUFJLENBQUM7UUFDaEMsV0FBTSxHQUFXLENB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