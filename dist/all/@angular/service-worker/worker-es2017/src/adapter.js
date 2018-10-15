/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Adapts the service worker to its runtime environment.
 *
 * Mostly, this is used to mock out identifiers which are otherwise read
 * from the global scope.
 */
export class Adapter {
    /**
     * Wrapper around the `Request` constructor.
     */
    newRequest(input, init) {
        return new Request(input, init);
    }
    /**
     * Wrapper around the `Response` constructor.
     */
    newResponse(body, init) { return new Response(body, init); }
    /**
     * Wrapper around the `Headers` constructor.
     */
    newHeaders(headers) { return new Headers(headers); }
    /**
     * Test if a given object is an instance of `Client`.
     */
    isClient(source) { return (source instanceof Client); }
    /**
     * Read the current UNIX time in milliseconds.
     */
    get time() { return Date.now(); }
    /**
     * Extract the pathname of a URL.
     */
    parseUrl(url, relativeTo) {
        const parsed = new URL(url, relativeTo);
        return { origin: parsed.origin, path: parsed.pathname };
    }
    /**
     * Wait for a given amount of time before completing a Promise.
     */
    timeout(ms) {
        return new Promise(resolve => { setTimeout(() => resolve(), ms); });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL3dvcmtlci9zcmMvYWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSDs7Ozs7R0FLRztBQUNILE1BQU07SUFDSjs7T0FFRztJQUNILFVBQVUsQ0FBQyxLQUFxQixFQUFFLElBQWtCO1FBQ2xELE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7T0FFRztJQUNILFdBQVcsQ0FBQyxJQUFTLEVBQUUsSUFBbUIsSUFBSSxPQUFPLElBQUksUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFaEY7O09BRUc7SUFDSCxVQUFVLENBQUMsT0FBaUMsSUFBYSxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV2Rjs7T0FFRztJQUNILFFBQVEsQ0FBQyxNQUFXLElBQXNCLE9BQU8sQ0FBQyxNQUFNLFlBQVksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTlFOztPQUVHO0lBQ0gsSUFBSSxJQUFJLEtBQWEsT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRXpDOztPQUVHO0lBQ0gsUUFBUSxDQUFDLEdBQVcsRUFBRSxVQUFrQjtRQUN0QyxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDeEMsT0FBTyxFQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsT0FBTyxDQUFDLEVBQVU7UUFDaEIsT0FBTyxJQUFJLE9BQU8sQ0FBTyxPQUFPLENBQUMsRUFBRSxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVFLENBQUM7Q0FDRiJ9