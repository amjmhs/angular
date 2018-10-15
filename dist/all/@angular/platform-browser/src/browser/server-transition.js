"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dom_adapter_1 = require("../dom/dom_adapter");
var dom_tokens_1 = require("../dom/dom_tokens");
/**
 * An id that identifies a particular application being bootstrapped, that should
 * match across the client/server boundary.
 */
exports.TRANSITION_ID = new core_1.InjectionToken('TRANSITION_ID');
function appInitializerFactory(transitionId, document, injector) {
    return function () {
        // Wait for all application initializers to be completed before removing the styles set by
        // the server.
        injector.get(core_1.ApplicationInitStatus).donePromise.then(function () {
            var dom = dom_adapter_1.getDOM();
            var styles = Array.prototype.slice.apply(dom.querySelectorAll(document, "style[ng-transition]"));
            styles.filter(function (el) { return dom.getAttribute(el, 'ng-transition') === transitionId; })
                .forEach(function (el) { return dom.remove(el); });
        });
    };
}
exports.appInitializerFactory = appInitializerFactory;
exports.SERVER_TRANSITION_PROVIDERS = [
    {
        provide: core_1.APP_INITIALIZER,
        useFactory: appInitializerFactory,
        deps: [exports.TRANSITION_ID, dom_tokens_1.DOCUMENT, core_1.Injector],
        multi: true
    },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLXRyYW5zaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3NyYy9icm93c2VyL3NlcnZlci10cmFuc2l0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQXVIO0FBRXZILGtEQUEwQztBQUMxQyxnREFBMkM7QUFFM0M7OztHQUdHO0FBQ1UsUUFBQSxhQUFhLEdBQUcsSUFBSSxxQkFBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRWpFLCtCQUFzQyxZQUFvQixFQUFFLFFBQWEsRUFBRSxRQUFrQjtJQUMzRixPQUFPO1FBQ0wsMEZBQTBGO1FBQzFGLGNBQWM7UUFDZCxRQUFRLENBQUMsR0FBRyxDQUFDLDRCQUFxQixDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztZQUNuRCxJQUFNLEdBQUcsR0FBRyxvQkFBTSxFQUFFLENBQUM7WUFDckIsSUFBTSxNQUFNLEdBQ1IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO1lBQ3hGLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBQSxFQUFFLElBQUksT0FBQSxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxlQUFlLENBQUMsS0FBSyxZQUFZLEVBQXRELENBQXNELENBQUM7aUJBQ3RFLE9BQU8sQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQWQsQ0FBYyxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUM7QUFDSixDQUFDO0FBWkQsc0RBWUM7QUFFWSxRQUFBLDJCQUEyQixHQUFxQjtJQUMzRDtRQUNFLE9BQU8sRUFBRSxzQkFBZTtRQUN4QixVQUFVLEVBQUUscUJBQXFCO1FBQ2pDLElBQUksRUFBRSxDQUFDLHFCQUFhLEVBQUUscUJBQVEsRUFBRSxlQUFRLENBQUM7UUFDekMsS0FBSyxFQUFFLElBQUk7S0FDWjtDQUNGLENBQUMifQ==