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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Log = /** @class */ (function () {
    function Log() {
        this.logItems = [];
    }
    Log.prototype.add = function (value /** TODO #9100 */) { this.logItems.push(value); };
    Log.prototype.fn = function (value /** TODO #9100 */) {
        var _this = this;
        return function (a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = null; }
            if (a2 === void 0) { a2 = null; }
            if (a3 === void 0) { a3 = null; }
            if (a4 === void 0) { a4 = null; }
            if (a5 === void 0) { a5 = null; }
            _this.logItems.push(value);
        };
    };
    Log.prototype.clear = function () { this.logItems = []; };
    Log.prototype.result = function () { return this.logItems.join('; '); };
    Log = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], Log);
    return Log;
}());
exports.Log = Log;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0aW5nL3NyYy9sb2dnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBeUM7QUFHekM7SUFHRTtRQUFnQixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUFDLENBQUM7SUFFckMsaUJBQUcsR0FBSCxVQUFJLEtBQVUsQ0FBQyxpQkFBaUIsSUFBVSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFdEUsZ0JBQUUsR0FBRixVQUFHLEtBQVUsQ0FBQyxpQkFBaUI7UUFBL0IsaUJBSUM7UUFIQyxPQUFPLFVBQUMsRUFBYyxFQUFFLEVBQWMsRUFBRSxFQUFjLEVBQUUsRUFBYyxFQUFFLEVBQWM7WUFBOUUsbUJBQUEsRUFBQSxTQUFjO1lBQUUsbUJBQUEsRUFBQSxTQUFjO1lBQUUsbUJBQUEsRUFBQSxTQUFjO1lBQUUsbUJBQUEsRUFBQSxTQUFjO1lBQUUsbUJBQUEsRUFBQSxTQUFjO1lBQ3BGLEtBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxtQkFBSyxHQUFMLGNBQWdCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUVyQyxvQkFBTSxHQUFOLGNBQW1CLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBZjFDLEdBQUc7UUFEZixpQkFBVSxFQUFFOztPQUNBLEdBQUcsQ0FnQmY7SUFBRCxVQUFDO0NBQUEsQUFoQkQsSUFnQkM7QUFoQlksa0JBQUcifQ==