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
* Wraps a function in a new function which sets up document and HTML for running a test.
*
* This function is intended to wrap an existing testing function. The wrapper
* adds HTML to the `body` element of the `document` and subsequently tears it down.
*
* This function is intended to be used with `async await` and `Promise`s. If the wrapped
* function returns a promise (or is `async`) then the teardown is delayed until that `Promise`
* is resolved.
*
* On `node` this function detects if `document` is present and if not it will create one by
* loading `domino` and installing it.
*
* Example:
*
* ```
* describe('something', () => {
*   it('should do something', withBody('<my-app></my-app>', async () => {
*     const myApp = renderComponent(MyApp);
*     await whenRendered(myApp);
*     expect(getRenderedText(myApp)).toEqual('Hello World!');
*   }));
* });
* ```
*
* @param html HTML which should be inserted into `body` of the `document`.
* @param blockFn function to wrap. The function can return promise or be `async`.
* @experimental
*/
function withBody(html, blockFn) {
    return function (done) {
        ensureDocument();
        if (typeof blockFn === 'function') {
            document.body.innerHTML = html;
            var blockReturn = blockFn();
            if (blockReturn instanceof Promise) {
                blockReturn.then(done, done.fail);
            }
            else {
                done();
            }
        }
    };
}
exports.withBody = withBody;
var savedDocument = undefined;
var savedRequestAnimationFrame = undefined;
var savedNode = undefined;
var requestAnimationFrameCount = 0;
/**
 * System.js uses regexp to look for `require` statements. `domino` has to be
 * extracted into a constant so that the regexp in the System.js does not match
 * and does not try to load domino in the browser.
 */
var domino = (function (domino) {
    if (typeof global == 'object' && global.process && typeof require == 'function') {
        try {
            return require(domino);
        }
        catch (e) {
            // It is possible that we don't have domino available in which case just give up.
        }
    }
    // Seems like we don't have domino, give up.
    return null;
})('domino');
/**
 * Ensure that global has `Document` if we are in node.js
 * @experimental
 */
function ensureDocument() {
    if (domino) {
        // we are in node.js.
        var window_1 = domino.createWindow('', 'http://localhost');
        savedDocument = global.document;
        global.window = window_1;
        global.document = window_1.document;
        // Trick to avoid Event patching from
        // https://github.com/angular/angular/blob/7cf5e95ac9f0f2648beebf0d5bd9056b79946970/packages/platform-browser/src/dom/events/dom_events.ts#L112-L132
        // It fails with Domino with TypeError: Cannot assign to read only property
        // 'stopImmediatePropagation' of object '#<Event>'
        global.Event = null;
        savedNode = global.Node;
        global.Node = domino.impl.Node;
        savedRequestAnimationFrame = global.requestAnimationFrame;
        global.requestAnimationFrame = function (cb) {
            setImmediate(cb);
            return requestAnimationFrameCount++;
        };
    }
}
exports.ensureDocument = ensureDocument;
/**
 * Restore the state of `Document` between tests.
 * @experimental
 */
function cleanupDocument() {
    if (savedDocument) {
        global.document = savedDocument;
        global.window = undefined;
        savedDocument = undefined;
    }
    if (savedNode) {
        global.Node = savedNode;
        savedNode = undefined;
    }
    if (savedRequestAnimationFrame) {
        global.requestAnimationFrame = savedRequestAnimationFrame;
        savedRequestAnimationFrame = undefined;
    }
}
exports.cleanupDocument = cleanupDocument;
if (typeof beforeEach == 'function')
    beforeEach(ensureDocument);
if (typeof afterEach == 'function')
    beforeEach(cleanupDocument);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyMy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3ByaXZhdGUvdGVzdGluZy9zcmMvcmVuZGVyMy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBNEJFO0FBQ0Ysa0JBQTZDLElBQVksRUFBRSxPQUFVO0lBQ25FLE9BQU8sVUFBUyxJQUFZO1FBQzFCLGNBQWMsRUFBRSxDQUFDO1FBQ2pCLElBQUksT0FBTyxPQUFPLEtBQUssVUFBVSxFQUFFO1lBQ2pDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUMvQixJQUFNLFdBQVcsR0FBRyxPQUFPLEVBQUUsQ0FBQztZQUM5QixJQUFJLFdBQVcsWUFBWSxPQUFPLEVBQUU7Z0JBQ2xDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNuQztpQkFBTTtnQkFDTCxJQUFJLEVBQUUsQ0FBQzthQUNSO1NBQ0Y7SUFDSCxDQUFRLENBQUM7QUFDWCxDQUFDO0FBYkQsNEJBYUM7QUFFRCxJQUFJLGFBQWEsR0FBdUIsU0FBUyxDQUFDO0FBQ2xELElBQUksMEJBQTBCLEdBQTJELFNBQVMsQ0FBQztBQUNuRyxJQUFJLFNBQVMsR0FBMEIsU0FBUyxDQUFDO0FBQ2pELElBQUksMEJBQTBCLEdBQUcsQ0FBQyxDQUFDO0FBRW5DOzs7O0dBSUc7QUFDSCxJQUFNLE1BQU0sR0FBUSxDQUFDLFVBQVMsTUFBTTtJQUNsQyxJQUFJLE9BQU8sTUFBTSxJQUFJLFFBQVEsSUFBSSxNQUFNLENBQUMsT0FBTyxJQUFJLE9BQU8sT0FBTyxJQUFJLFVBQVUsRUFBRTtRQUMvRSxJQUFJO1lBQ0YsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDeEI7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLGlGQUFpRjtTQUNsRjtLQUNGO0lBQ0QsNENBQTRDO0lBQzVDLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFYjs7O0dBR0c7QUFDSDtJQUNFLElBQUksTUFBTSxFQUFFO1FBQ1YscUJBQXFCO1FBQ3JCLElBQU0sUUFBTSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDM0QsYUFBYSxHQUFJLE1BQWMsQ0FBQyxRQUFRLENBQUM7UUFDeEMsTUFBYyxDQUFDLE1BQU0sR0FBRyxRQUFNLENBQUM7UUFDL0IsTUFBYyxDQUFDLFFBQVEsR0FBRyxRQUFNLENBQUMsUUFBUSxDQUFDO1FBQzNDLHFDQUFxQztRQUNyQyxvSkFBb0o7UUFDcEosMkVBQTJFO1FBQzNFLGtEQUFrRDtRQUNqRCxNQUFjLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUM3QixTQUFTLEdBQUksTUFBYyxDQUFDLElBQUksQ0FBQztRQUNoQyxNQUFjLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBRXhDLDBCQUEwQixHQUFJLE1BQWMsQ0FBQyxxQkFBcUIsQ0FBQztRQUNsRSxNQUFjLENBQUMscUJBQXFCLEdBQUcsVUFBUyxFQUF3QjtZQUN2RSxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDakIsT0FBTywwQkFBMEIsRUFBRSxDQUFDO1FBQ3RDLENBQUMsQ0FBQztLQUNIO0FBQ0gsQ0FBQztBQXJCRCx3Q0FxQkM7QUFFRDs7O0dBR0c7QUFDSDtJQUNFLElBQUksYUFBYSxFQUFFO1FBQ2hCLE1BQWMsQ0FBQyxRQUFRLEdBQUcsYUFBYSxDQUFDO1FBQ3hDLE1BQWMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO1FBQ25DLGFBQWEsR0FBRyxTQUFTLENBQUM7S0FDM0I7SUFDRCxJQUFJLFNBQVMsRUFBRTtRQUNaLE1BQWMsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO1FBQ2pDLFNBQVMsR0FBRyxTQUFTLENBQUM7S0FDdkI7SUFDRCxJQUFJLDBCQUEwQixFQUFFO1FBQzdCLE1BQWMsQ0FBQyxxQkFBcUIsR0FBRywwQkFBMEIsQ0FBQztRQUNuRSwwQkFBMEIsR0FBRyxTQUFTLENBQUM7S0FDeEM7QUFDSCxDQUFDO0FBZEQsMENBY0M7QUFFRCxJQUFJLE9BQU8sVUFBVSxJQUFJLFVBQVU7SUFBRSxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDaEUsSUFBSSxPQUFPLFNBQVMsSUFBSSxVQUFVO0lBQUUsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDIn0=