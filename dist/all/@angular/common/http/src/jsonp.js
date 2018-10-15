"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var response_1 = require("./response");
// Every request made through JSONP needs a callback name that's unique across the
// whole page. Each request is assigned an id and the callback name is constructed
// from that. The next id to be assigned is tracked in a global variable here that
// is shared among all applications on the page.
var nextRequestId = 0;
// Error text given when a JSONP script is injected, but doesn't invoke the callback
// passed in its URL.
exports.JSONP_ERR_NO_CALLBACK = 'JSONP injected script did not invoke callback.';
// Error text given when a request is passed to the JsonpClientBackend that doesn't
// have a request method JSONP.
exports.JSONP_ERR_WRONG_METHOD = 'JSONP requests must use JSONP request method.';
exports.JSONP_ERR_WRONG_RESPONSE_TYPE = 'JSONP requests must use Json response type.';
/**
 * DI token/abstract type representing a map of JSONP callbacks.
 *
 * In the browser, this should always be the `window` object.
 *
 *
 */
var JsonpCallbackContext = /** @class */ (function () {
    function JsonpCallbackContext() {
    }
    return JsonpCallbackContext;
}());
exports.JsonpCallbackContext = JsonpCallbackContext;
/**
 * `HttpBackend` that only processes `HttpRequest` with the JSONP method,
 * by performing JSONP style requests.
 *
 *
 */
var JsonpClientBackend = /** @class */ (function () {
    function JsonpClientBackend(callbackMap, document) {
        this.callbackMap = callbackMap;
        this.document = document;
    }
    /**
     * Get the name of the next callback method, by incrementing the global `nextRequestId`.
     */
    JsonpClientBackend.prototype.nextCallback = function () { return "ng_jsonp_callback_" + nextRequestId++; };
    /**
     * Process a JSONP request and return an event stream of the results.
     */
    JsonpClientBackend.prototype.handle = function (req) {
        var _this = this;
        // Firstly, check both the method and response type. If either doesn't match
        // then the request was improperly routed here and cannot be handled.
        if (req.method !== 'JSONP') {
            throw new Error(exports.JSONP_ERR_WRONG_METHOD);
        }
        else if (req.responseType !== 'json') {
            throw new Error(exports.JSONP_ERR_WRONG_RESPONSE_TYPE);
        }
        // Everything else happens inside the Observable boundary.
        return new rxjs_1.Observable(function (observer) {
            // The first step to make a request is to generate the callback name, and replace the
            // callback placeholder in the URL with the name. Care has to be taken here to ensure
            // a trailing &, if matched, gets inserted back into the URL in the correct place.
            var callback = _this.nextCallback();
            var url = req.urlWithParams.replace(/=JSONP_CALLBACK(&|$)/, "=" + callback + "$1");
            // Construct the <script> tag and point it at the URL.
            var node = _this.document.createElement('script');
            node.src = url;
            // A JSONP request requires waiting for multiple callbacks. These variables
            // are closed over and track state across those callbacks.
            // The response object, if one has been received, or null otherwise.
            var body = null;
            // Whether the response callback has been called.
            var finished = false;
            // Whether the request has been cancelled (and thus any other callbacks)
            // should be ignored.
            var cancelled = false;
            // Set the response callback in this.callbackMap (which will be the window
            // object in the browser. The script being loaded via the <script> tag will
            // eventually call this callback.
            _this.callbackMap[callback] = function (data) {
                // Data has been received from the JSONP script. Firstly, delete this callback.
                delete _this.callbackMap[callback];
                // Next, make sure the request wasn't cancelled in the meantime.
                if (cancelled) {
                    return;
                }
                // Set state to indicate data was received.
                body = data;
                finished = true;
            };
            // cleanup() is a utility closure that removes the <script> from the page and
            // the response callback from the window. This logic is used in both the
            // success, error, and cancellation paths, so it's extracted out for convenience.
            var cleanup = function () {
                // Remove the <script> tag if it's still on the page.
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
                // Remove the response callback from the callbackMap (window object in the
                // browser).
                delete _this.callbackMap[callback];
            };
            // onLoad() is the success callback which runs after the response callback
            // if the JSONP script loads successfully. The event itself is unimportant.
            // If something went wrong, onLoad() may run without the response callback
            // having been invoked.
            var onLoad = function (event) {
                // Do nothing if the request has been cancelled.
                if (cancelled) {
                    return;
                }
                // Cleanup the page.
                cleanup();
                // Check whether the response callback has run.
                if (!finished) {
                    // It hasn't, something went wrong with the request. Return an error via
                    // the Observable error path. All JSONP errors have status 0.
                    observer.error(new response_1.HttpErrorResponse({
                        url: url,
                        status: 0,
                        statusText: 'JSONP Error',
                        error: new Error(exports.JSONP_ERR_NO_CALLBACK),
                    }));
                    return;
                }
                // Success. body either contains the response body or null if none was
                // returned.
                observer.next(new response_1.HttpResponse({
                    body: body,
                    status: 200,
                    statusText: 'OK', url: url,
                }));
                // Complete the stream, the response is over.
                observer.complete();
            };
            // onError() is the error callback, which runs if the script returned generates
            // a Javascript error. It emits the error via the Observable error channel as
            // a HttpErrorResponse.
            var onError = function (error) {
                // If the request was already cancelled, no need to emit anything.
                if (cancelled) {
                    return;
                }
                cleanup();
                // Wrap the error in a HttpErrorResponse.
                observer.error(new response_1.HttpErrorResponse({
                    error: error,
                    status: 0,
                    statusText: 'JSONP Error', url: url,
                }));
            };
            // Subscribe to both the success (load) and error events on the <script> tag,
            // and add it to the page.
            node.addEventListener('load', onLoad);
            node.addEventListener('error', onError);
            _this.document.body.appendChild(node);
            // The request has now been successfully sent.
            observer.next({ type: response_1.HttpEventType.Sent });
            // Cancellation handler.
            return function () {
                // Track the cancellation so event listeners won't do anything even if already scheduled.
                cancelled = true;
                // Remove the event listeners so they won't run if the events later fire.
                node.removeEventListener('load', onLoad);
                node.removeEventListener('error', onError);
                // And finally, clean up the page.
                cleanup();
            };
        });
    };
    JsonpClientBackend = __decorate([
        core_1.Injectable(),
        __param(1, core_1.Inject(common_1.DOCUMENT)),
        __metadata("design:paramtypes", [JsonpCallbackContext, Object])
    ], JsonpClientBackend);
    return JsonpClientBackend;
}());
exports.JsonpClientBackend = JsonpClientBackend;
/**
 * An `HttpInterceptor` which identifies requests with the method JSONP and
 * shifts them to the `JsonpClientBackend`.
 *
 *
 */
var JsonpInterceptor = /** @class */ (function () {
    function JsonpInterceptor(jsonp) {
        this.jsonp = jsonp;
    }
    JsonpInterceptor.prototype.intercept = function (req, next) {
        if (req.method === 'JSONP') {
            return this.jsonp.handle(req);
        }
        // Fall through for normal HTTP requests.
        return next.handle(req);
    };
    JsonpInterceptor = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [JsonpClientBackend])
    ], JsonpInterceptor);
    return JsonpInterceptor;
}());
exports.JsonpInterceptor = JsonpInterceptor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbnAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vaHR0cC9zcmMvanNvbnAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7QUFFSCwwQ0FBeUM7QUFDekMsc0NBQWlEO0FBQ2pELDZCQUEwQztBQUkxQyx1Q0FBcUY7QUFFckYsa0ZBQWtGO0FBQ2xGLGtGQUFrRjtBQUNsRixrRkFBa0Y7QUFDbEYsZ0RBQWdEO0FBQ2hELElBQUksYUFBYSxHQUFXLENBQUMsQ0FBQztBQUU5QixvRkFBb0Y7QUFDcEYscUJBQXFCO0FBQ1IsUUFBQSxxQkFBcUIsR0FBRyxnREFBZ0QsQ0FBQztBQUV0RixtRkFBbUY7QUFDbkYsK0JBQStCO0FBQ2xCLFFBQUEsc0JBQXNCLEdBQUcsK0NBQStDLENBQUM7QUFDekUsUUFBQSw2QkFBNkIsR0FBRyw2Q0FBNkMsQ0FBQztBQUUzRjs7Ozs7O0dBTUc7QUFDSDtJQUFBO0lBQWlGLENBQUM7SUFBRCwyQkFBQztBQUFELENBQUMsQUFBbEYsSUFBa0Y7QUFBNUQsb0RBQW9CO0FBRTFDOzs7OztHQUtHO0FBRUg7SUFDRSw0QkFBb0IsV0FBaUMsRUFBNEIsUUFBYTtRQUExRSxnQkFBVyxHQUFYLFdBQVcsQ0FBc0I7UUFBNEIsYUFBUSxHQUFSLFFBQVEsQ0FBSztJQUFHLENBQUM7SUFFbEc7O09BRUc7SUFDSyx5Q0FBWSxHQUFwQixjQUFpQyxPQUFPLHVCQUFxQixhQUFhLEVBQUksQ0FBQyxDQUFDLENBQUM7SUFFakY7O09BRUc7SUFDSCxtQ0FBTSxHQUFOLFVBQU8sR0FBdUI7UUFBOUIsaUJBK0lDO1FBOUlDLDRFQUE0RTtRQUM1RSxxRUFBcUU7UUFDckUsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLE9BQU8sRUFBRTtZQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLDhCQUFzQixDQUFDLENBQUM7U0FDekM7YUFBTSxJQUFJ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