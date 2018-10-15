"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var router_state_1 = require("../src/router_state");
var Logger = /** @class */ (function () {
    function Logger() {
        this.logs = [];
    }
    Logger.prototype.add = function (thing) { this.logs.push(thing); };
    Logger.prototype.empty = function () { this.logs.length = 0; };
    return Logger;
}());
exports.Logger = Logger;
function provideTokenLogger(token, returnValue) {
    if (returnValue === void 0) { returnValue = true; }
    return {
        provide: token,
        useFactory: function (logger) { return function () { return (logger.add(token), returnValue); }; },
        deps: [Logger]
    };
}
exports.provideTokenLogger = provideTokenLogger;
function createActivatedRouteSnapshot(args) {
    return new router_state_1.ActivatedRouteSnapshot(args.url || [], args.params || {}, args.queryParams || null, args.fragment || null, args.data || null, args.outlet || null, args.component, args.routeConfig || {}, args.urlSegment || null, args.lastPathIndex || -1, args.resolve || {});
}
exports.createActivatedRouteSnapshot = createActivatedRouteSnapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3JvdXRlci90ZXN0L2hlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFLSCxvREFBMkQ7QUFJM0Q7SUFBQTtRQUNFLFNBQUksR0FBYSxFQUFFLENBQUM7SUFHdEIsQ0FBQztJQUZDLG9CQUFHLEdBQUgsVUFBSSxLQUFhLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLHNCQUFLLEdBQUwsY0FBVSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25DLGFBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUpZLHdCQUFNO0FBTW5CLDRCQUFtQyxLQUFhLEVBQUUsV0FBa0I7SUFBbEIsNEJBQUEsRUFBQSxrQkFBa0I7SUFDbEUsT0FBTztRQUNMLE9BQU8sRUFBRSxLQUFLO1FBQ2QsVUFBVSxFQUFFLFVBQUMsTUFBYyxJQUFLLE9BQUEsY0FBTSxPQUFBLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxXQUFXLENBQUMsRUFBaEMsQ0FBZ0MsRUFBdEMsQ0FBc0M7UUFDdEUsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDO0tBQ2YsQ0FBQztBQUNKLENBQUM7QUFORCxnREFNQztBQWdCRCxzQ0FBNkMsSUFBYTtJQUN4RCxPQUFPLElBQUsscUNBQThCLENBQ3RDLElBQUksQ0FBQyxHQUFHLElBQVMsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxXQUFXLElBQVMsSUFBSSxFQUNyRSxJQUFJLENBQUMsUUFBUSxJQUFTLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxJQUFTLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxJQUFTLElBQUksRUFDdkUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVyxJQUFTLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxJQUFTLElBQUksRUFDOUUsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3BELENBQUM7QUFORCxvRUFNQyJ9