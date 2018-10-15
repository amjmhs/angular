"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var di_1 = require("./di");
var Console = /** @class */ (function () {
    function Console() {
    }
    Console.prototype.log = function (message) {
        // tslint:disable-next-line:no-console
        console.log(message);
    };
    // Note: for reporting errors use `DOM.logError()` as it is platform specific
    Console.prototype.warn = function (message) {
        // tslint:disable-next-line:no-console
        console.warn(message);
    };
    Console = __decorate([
        di_1.Injectable()
    ], Console);
    return Console;
}());
exports.Console = Console;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2NvbnNvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCwyQkFBZ0M7QUFHaEM7SUFBQTtJQVVBLENBQUM7SUFUQyxxQkFBRyxHQUFILFVBQUksT0FBZTtRQUNqQixzQ0FBc0M7UUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBQ0QsNkVBQTZFO0lBQzdFLHNCQUFJLEdBQUosVUFBSyxPQUFlO1FBQ2xCLHNDQUFzQztRQUN0QyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFUVSxPQUFPO1FBRG5CLGVBQVUsRUFBRTtPQUNBLE9BQU8sQ0FVbkI7SUFBRCxjQUFDO0NBQUEsQUFWRCxJQVVDO0FBVlksMEJBQU8ifQ==