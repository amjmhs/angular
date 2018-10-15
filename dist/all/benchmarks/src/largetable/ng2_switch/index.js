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
var init_1 = require("./init");
var table_1 = require("./table");
function main() {
    core_1.enableProdMode();
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(table_1.AppModule).then(init_1.init);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2JlbmNobWFya3Mvc3JjL2xhcmdldGFibGUvbmcyX3N3aXRjaC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUE2QztBQUM3Qyw4RUFBeUU7QUFFekUsK0JBQTRCO0FBQzVCLGlDQUFrQztBQUVsQztJQUNFLHFCQUFjLEVBQUUsQ0FBQztJQUNqQixpREFBc0IsRUFBRSxDQUFDLGVBQWUsQ0FBQyxpQkFBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQUksQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFIRCxvQkFHQyJ9