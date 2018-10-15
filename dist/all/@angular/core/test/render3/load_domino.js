"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Needed to run animation tests
require('zone.js/dist/zone-node.js');
var domino_adapter_1 = require("@angular/platform-server/src/domino_adapter");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
if (typeof window == 'undefined') {
    var domino = require('domino');
    domino_adapter_1.DominoAdapter.makeCurrent();
    global.document = dom_adapter_1.getDOM().getDefaultDocument();
    // Trick to avoid Event patching from
    // https://github.com/angular/angular/blob/7cf5e95ac9f0f2648beebf0d5bd9056b79946970/packages/platform-browser/src/dom/events/dom_events.ts#L112-L132
    // It fails with Domino with TypeError: Cannot assign to read only property
    // 'stopImmediatePropagation' of object '#<Event>'
    global.Event = null;
    // For animation tests, see
    // https://github.com/angular/angular/blob/master/packages/animations/browser/src/render/shared.ts#L140
    global.Element = domino.impl.Element;
    global.isBrowser = false;
    global.isNode = true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZF9kb21pbm8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVuZGVyMy9sb2FkX2RvbWluby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILGdDQUFnQztBQUNoQyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUVyQyw4RUFBMEU7QUFDMUUsNkVBQXFFO0FBRXJFLElBQUksT0FBTyxNQUFNLElBQUksV0FBVyxFQUFFO0lBQ2hDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUVqQyw4QkFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzNCLE1BQWMsQ0FBQyxRQUFRLEdBQUcsb0JBQU0sRUFBRSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFFekQscUNBQXFDO0lBQ3JDLG9KQUFvSjtJQUNwSiwyRUFBMkU7SUFDM0Usa0RBQWtEO0lBQ2pELE1BQWMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBRTdCLDJCQUEyQjtJQUMzQix1R0FBdUc7SUFDdEcsTUFBYyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUM3QyxNQUFjLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUNqQyxNQUFjLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztDQUMvQiJ9