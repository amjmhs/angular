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
 * Adapts the service worker to its runtime environment.
 *
 * Mostly, this is used to mock out identifiers which are otherwise read
 * from the global scope.
 */
var Adapter = /** @class */ (function () {
    function Adapter() {
    }
    /**
     * Wrapper around the `Request` constructor.
     */
    Adapter.prototype.newRequest = function (input, init) {
        return new Request(input, init);
    };
    /**
     * Wrapper around the `Response` constructor.
     */
    Adapter.prototype.newResponse = function (body, init) { return new Response(body, init); };
    /**
     * Wrapper around the `Headers` constructor.
     */
    Adapter.prototype.newHeaders = function (headers) { return new Headers(headers); };
    /**
     * Test if a given object is an instance of `Client`.
     */
    Adapter.prototype.isClient = function (source) { return (source instanceof Client); };
    Object.defineProperty(Adapter.prototype, "time", {
        /**
         * Read the current UNIX time in milliseconds.
         */
        get: function () { return Date.now(); },
        enumerable: true,
        configurable: true
    });
    /**
     * Extract the pathname of a URL.
     */
    Adapter.prototype.parseUrl = function (url, relativeTo) {
        var parsed = new URL(url, relativeTo);
        return { origin: parsed.origin, path: parsed.pathname };
    };
    /**
     * Wait for a given amount of time before completing a Promise.
     */
    Adapter.prototype.timeout = function (ms) {
        return new Promise(function (resolve) { setTimeout(function () { return resolve(); }, ms); });
    };
    return Adapter;
}());
exports.Adapter = Adapter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL3dvcmtlci9zcmMvYWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVIOzs7OztHQUtHO0FBQ0g7SUFBQTtJQTBDQSxDQUFDO0lBekNDOztPQUVHO0lBQ0gsNEJBQVUsR0FBVixVQUFXLEtBQXFCLEVBQUUsSUFBa0I7UUFDbEQsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsNkJBQVcsR0FBWCxVQUFZLElBQVMsRUFBRSxJQUFtQixJQUFJLE9BQU8sSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVoRjs7T0FFRztJQUNILDRCQUFVLEdBQVYsVUFBVyxPQUFpQyxJQUFhLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXZGOztPQUVHO0lBQ0gsMEJBQVEsR0FBUixVQUFTLE1BQVcsSUFBc0IsT0FBTyxDQUFDLE1BQU0sWUFBWSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFLOUUsc0JBQUkseUJBQUk7UUFIUjs7V0FFRzthQUNILGNBQXFCLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFekM7O09BRUc7SUFDSCwwQkFBUSxHQUFSLFVBQVMsR0FBVyxFQUFFLFVBQWtCO1FBQ3RDLElBQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN4QyxPQUFPLEVBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQ7O09BRUc7SUFDSCx5QkFBTyxHQUFQLFVBQVEsRUFBVTtRQUNoQixPQUFPLElBQUksT0FBTyxDQUFPLFVBQUEsT0FBTyxJQUFNLFVBQVUsQ0FBQyxjQUFNLE9BQUEsT0FBTyxFQUFFLEVBQVQsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUNILGNBQUM7QUFBRCxDQUFDLEFBMUNELElBMENDO0FBMUNZLDBCQUFPIn0=