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
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var util_1 = require("../../util");
var util_2 = require("../util");
var tree_1 = require("./tree");
function main() {
    var tree;
    var appRef;
    function destroyDom() {
        tree.data = util_2.emptyTree;
        appRef.tick();
    }
    function createDom() {
        tree.data = util_2.buildTree();
        appRef.tick();
    }
    function noop() { }
    function init() {
        core_1.enableProdMode();
        platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(tree_1.AppModule).then(function (ref) {
            var injector = ref.injector;
            appRef = injector.get(core_1.ApplicationRef);
            tree = appRef.components[0].instance;
            util_1.bindAction('#destroyDom', destroyDom);
            util_1.bindAction('#createDom', createDom);
            util_1.bindAction('#updateDomProfile', util_1.profile(createDom, noop, 'update'));
            util_1.bindAction('#createDomProfile', util_1.profile(createDom, destroyDom, 'create'));
        });
    }
    init();
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2JlbmNobWFya3Mvc3JjL3RyZWUvbmcyX3N0YXRpYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUE2RDtBQUM3RCw4RUFBeUU7QUFFekUsbUNBQStDO0FBQy9DLGdDQUE2QztBQUU3QywrQkFBb0Q7QUFFcEQ7SUFDRSxJQUFJLElBQXVCLENBQUM7SUFDNUIsSUFBSSxNQUFzQixDQUFDO0lBRTNCO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxnQkFBUyxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQ7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLGdCQUFTLEVBQUUsQ0FBQztRQUN4QixNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELGtCQUFpQixDQUFDO0lBRWxCO1FBQ0UscUJBQWMsRUFBRSxDQUFDO1FBQ2pCLGlEQUFzQixFQUFFLENBQUMsZUFBZSxDQUFDLGdCQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFHO1lBQzNELElBQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7WUFDOUIsTUFBTSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMscUJBQWMsQ0FBQyxDQUFDO1lBRXRDLElBQUksR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUNyQyxpQkFBVSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUN0QyxpQkFBVSxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNwQyxpQkFBVSxDQUFDLG1CQUFtQixFQUFFLGNBQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDcEUsaUJBQVUsQ0FBQyxtQkFBbUIsRUFBRSxjQUFPLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzVFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELElBQUksRUFBRSxDQUFDO0FBQ1QsQ0FBQztBQS9CRCxvQkErQkMifQ==