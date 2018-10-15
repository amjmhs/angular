"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Supported http methods.
 * @deprecated see https://angular.io/guide/http
 */
var RequestMethod;
(function (RequestMethod) {
    RequestMethod[RequestMethod["Get"] = 0] = "Get";
    RequestMethod[RequestMethod["Post"] = 1] = "Post";
    RequestMethod[RequestMethod["Put"] = 2] = "Put";
    RequestMethod[RequestMethod["Delete"] = 3] = "Delete";
    RequestMethod[RequestMethod["Options"] = 4] = "Options";
    RequestMethod[RequestMethod["Head"] = 5] = "Head";
    RequestMethod[RequestMethod["Patch"] = 6] = "Patch";
})(RequestMethod = exports.RequestMethod || (exports.RequestMethod = {}));
/**
 * All possible states in which a connection can be, based on
 * [States](http://www.w3.org/TR/XMLHttpRequest/#states) from the `XMLHttpRequest` spec, but with an
 * additional "CANCELLED" state.
 * @deprecated see https://angular.io/guide/http
 */
var ReadyState;
(function (ReadyState) {
    ReadyState[ReadyState["Unsent"] = 0] = "Unsent";
    ReadyState[ReadyState["Open"] = 1] = "Open";
    ReadyState[ReadyState["HeadersReceived"] = 2] = "HeadersReceived";
    ReadyState[ReadyState["Loading"] = 3] = "Loading";
    ReadyState[ReadyState["Done"] = 4] = "Done";
    ReadyState[ReadyState["Cancelled"] = 5] = "Cancelled";
})(ReadyState = exports.ReadyState || (exports.ReadyState = {}));
/**
 * Acceptable response types to be associated with a {@link Response}, based on
 * [ResponseType](https://fetch.spec.whatwg.org/#responsetype) from the Fetch spec.
 * @deprecated see https://angular.io/guide/http
 */
var ResponseType;
(function (ResponseType) {
    ResponseType[ResponseType["Basic"] = 0] = "Basic";
    ResponseType[ResponseType["Cors"] = 1] = "Cors";
    ResponseType[ResponseType["Default"] = 2] = "Default";
    ResponseType[ResponseType["Error"] = 3] = "Error";
    ResponseType[ResponseType["Opaque"] = 4] = "Opaque";
})(ResponseType = exports.ResponseType || (exports.ResponseType = {}));
/**
 * Supported content type to be automatically associated with a {@link Request}.
 * @deprecated see https://angular.io/guide/http
 */
var ContentType;
(function (ContentType) {
    ContentType[ContentType["NONE"] = 0] = "NONE";
    ContentType[ContentType["JSON"] = 1] = "JSON";
    ContentType[ContentType["FORM"] = 2] = "FORM";
    ContentType[ContentType["FORM_DATA"] = 3] = "FORM_DATA";
    ContentType[ContentType["TEXT"] = 4] = "TEXT";
    ContentType[ContentType["BLOB"] = 5] = "BLOB";
    ContentType[ContentType["ARRAY_BUFFER"] = 6] = "ARRAY_BUFFER";
})(ContentType = exports.ContentType || (exports.ContentType = {}));
/**
 * Define which buffer to use to store the response
 * @deprecated see https://angular.io/guide/http
 */
var ResponseContentType;
(function (ResponseContentType) {
    ResponseContentType[ResponseContentType["Text"] = 0] = "Text";
    ResponseContentType[ResponseContentType["Json"] = 1] = "Json";
    ResponseContentType[ResponseContentType["ArrayBuffer"] = 2] = "ArrayBuffer";
    ResponseContentType[ResponseContentType["Blob"] = 3] = "Blob";
})(ResponseContentType = exports.ResponseContentType || (exports.ResponseContentType = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW51bXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9odHRwL3NyYy9lbnVtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVIOzs7R0FHRztBQUNILElBQVksYUFRWDtBQVJELFdBQVksYUFBYTtJQUN2QiwrQ0FBRyxDQUFBO0lBQ0gsaURBQUksQ0FBQTtJQUNKLCtDQUFHLENBQUE7SUFDSCxxREFBTSxDQUFBO0lBQ04sdURBQU8sQ0FBQTtJQUNQLGlEQUFJLENBQUE7SUFDSixtREFBSyxDQUFBO0FBQ1AsQ0FBQyxFQVJXLGFBQWEsR0FBYixxQkFBYSxLQUFiLHFCQUFhLFFBUXhCO0FBRUQ7Ozs7O0dBS0c7QUFDSCxJQUFZLFVBT1g7QUFQRCxXQUFZLFVBQVU7SUFDcEIsK0NBQU0sQ0FBQTtJQUNOLDJDQUFJLENBQUE7SUFDSixpRUFBZSxDQUFBO0lBQ2YsaURBQU8sQ0FBQTtJQUNQLDJDQUFJLENBQUE7SUFDSixxREFBUyxDQUFBO0FBQ1gsQ0FBQyxFQVBXLFVBQVUsR0FBVixrQkFBVSxLQUFWLGtCQUFVLFFBT3JCO0FBRUQ7Ozs7R0FJRztBQUNILElBQVksWUFNWDtBQU5ELFdBQVksWUFBWTtJQUN0QixpREFBSyxDQUFBO0lBQ0wsK0NBQUksQ0FBQTtJQUNKLHFEQUFPLENBQUE7SUFDUCxpREFBSyxDQUFBO0lBQ0wsbURBQU0sQ0FBQTtBQUNSLENBQUMsRUFOVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQU12QjtBQUVEOzs7R0FHRztBQUNILElBQVksV0FRWDtBQVJELFdBQVksV0FBVztJQUNyQiw2Q0FBSSxDQUFBO0lBQ0osNkNBQUksQ0FBQTtJQUNKLDZDQUFJLENBQUE7SUFDSix1REFBUyxDQUFBO0lBQ1QsNkNBQUksQ0FBQTtJQUNKLDZDQUFJLENBQUE7SUFDSiw2REFBWSxDQUFBO0FBQ2QsQ0FBQyxFQVJXLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBUXRCO0FBRUQ7OztHQUdHO0FBQ0gsSUFBWSxtQkFLWDtBQUxELFdBQVksbUJBQW1CO0lBQzdCLDZEQUFJLENBQUE7SUFDSiw2REFBSSxDQUFBO0lBQ0osMkVBQVcsQ0FBQTtJQUNYLDZEQUFJLENBQUE7QUFDTixDQUFDLEVBTFcsbUJBQW1CLEdBQW5CLDJCQUFtQixLQUFuQiwyQkFBbUIsUUFLOUIifQ==