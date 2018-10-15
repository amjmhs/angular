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
var app_1 = require("./app");
var init_1 = require("./init");
function main() {
    core_1.enableProdMode();
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_1.AppModule).then(init_1.init);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2JlbmNobWFya3Mvc3JjL2xhcmdlZm9ybS9uZzIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBNkM7QUFDN0MsOEVBQXlFO0FBRXpFLDZCQUFnQztBQUNoQywrQkFBNEI7QUFFNUI7SUFDRSxxQkFBYyxFQUFFLENBQUM7SUFDakIsaURBQXNCLEVBQUUsQ0FBQyxlQUFlLENBQUMsZUFBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQUksQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFIRCxvQkFHQyJ9