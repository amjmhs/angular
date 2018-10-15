"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("./enums");
function normalizeMethodName(method) {
    if (typeof method !== 'string')
        return method;
    switch (method.toUpperCase()) {
        case 'GET':
            return enums_1.RequestMethod.Get;
        case 'POST':
            return enums_1.RequestMethod.Post;
        case 'PUT':
            return enums_1.RequestMethod.Put;
        case 'DELETE':
            return enums_1.RequestMethod.Delete;
        case 'OPTIONS':
            return enums_1.RequestMethod.Options;
        case 'HEAD':
            return enums_1.RequestMethod.Head;
        case 'PATCH':
            return enums_1.RequestMethod.Patch;
    }
    throw new Error("Invalid request method. The method \"" + method + "\" is not supported.");
}
exports.normalizeMethodName = normalizeMethodName;
exports.isSuccess = function (status) { return (status >= 200 && status < 300); };
function getResponseURL(xhr) {
    if ('responseURL' in xhr) {
        return xhr.responseURL;
    }
    if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
        return xhr.getResponseHeader('X-Request-URL');
    }
    return null;
}
exports.getResponseURL = getResponseURL;
function stringToArrayBuffer8(input) {
    var view = new Uint8Array(input.length);
    for (var i = 0, strLen = input.length; i < strLen; i++) {
        view[i] = input.charCodeAt(i);
    }
    return view.buffer;
}
exports.stringToArrayBuffer8 = stringToArrayBuffer8;
function stringToArrayBuffer(input) {
    var view = new Uint16Array(input.length);
    for (var i = 0, strLen = input.length; i < strLen; i++) {
        view[i] = input.charCodeAt(i);
    }
    return view.buffer;
}
exports.stringToArrayBuffer = stringToArrayBuffer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cF91dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2h0dHAvc3JjL2h0dHBfdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxpQ0FBc0M7QUFFdEMsNkJBQW9DLE1BQThCO0lBQ2hFLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUTtRQUFFLE9BQU8sTUFBTSxDQUFDO0lBRTlDLFFBQVEsTUFBTSxDQUFDLFdBQVcsRUFBRSxFQUFFO1FBQzVCLEtBQUssS0FBSztZQUNSLE9BQU8scUJBQWEsQ0FBQyxHQUFHLENBQUM7UUFDM0IsS0FBSyxNQUFNO1lBQ1QsT0FBTyxxQkFBYSxDQUFDLElBQUksQ0FBQztRQUM1QixLQUFLLEtBQUs7WUFDUixPQUFPLHFCQUFhLENBQUMsR0FBRyxDQUFDO1FBQzNCLEtBQUssUUFBUTtZQUNYLE9BQU8scUJBQWEsQ0FBQyxNQUFNLENBQUM7UUFDOUIsS0FBSyxTQUFTO1lBQ1osT0FBTyxxQkFBYSxDQUFDLE9BQU8sQ0FBQztRQUMvQixLQUFLLE1BQU07WUFDVCxPQUFPLHFCQUFhLENBQUMsSUFBSSxDQUFDO1FBQzVCLEtBQUssT0FBTztZQUNWLE9BQU8scUJBQWEsQ0FBQyxLQUFLLENBQUM7S0FDOUI7SUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLDBDQUF1QyxNQUFNLHlCQUFxQixDQUFDLENBQUM7QUFDdEYsQ0FBQztBQXBCRCxrREFvQkM7QUFFWSxRQUFBLFNBQVMsR0FBRyxVQUFDLE1BQWMsSUFBYyxPQUFBLENBQUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLEVBQS9CLENBQStCLENBQUM7QUFFdEYsd0JBQStCLEdBQVE7SUFDckMsSUFBSSxhQUFhLElBQUksR0FBRyxFQUFFO1FBQ3hCLE9BQU8sR0FBRyxDQUFDLFdBQVcsQ0FBQztLQUN4QjtJQUNELElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLEVBQUU7UUFDeEQsT0FBTyxHQUFHLENBQUMsaUJBQWlCLENBQUMsZUFBZSxDQUFDLENBQUM7S0FDL0M7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFSRCx3Q0FRQztBQUVELDhCQUFxQyxLQUFhO0lBQ2hELElBQU0sSUFBSSxHQUFHLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3RELElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9CO0lBQ0QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ3JCLENBQUM7QUFORCxvREFNQztBQUdELDZCQUFvQyxLQUFhO0lBQy9DLElBQU0sSUFBSSxHQUFHLElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMzQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3RELElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9CO0lBQ0QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ3JCLENBQUM7QUFORCxrREFNQyJ9