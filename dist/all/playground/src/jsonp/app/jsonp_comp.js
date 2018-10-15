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
var http_1 = require("@angular/http");
var JsonpCmp = /** @class */ (function () {
    function JsonpCmp(jsonp) {
        var _this = this;
        jsonp.get('./people.json?callback=JSONP_CALLBACK').subscribe(function (res) { return _this.people = res.json(); });
    }
    JsonpCmp = __decorate([
        core_1.Component({
            selector: 'jsonp-app',
            template: "\n    <h1>people</h1>\n    <ul class=\"people\">\n      <li *ngFor=\"let person of people\">\n        hello, {{person['name']}}\n      </li>\n    </ul>\n  "
        }),
        __metadata("design:paramtypes", [http_1.Jsonp])
    ], JsonpCmp);
    return JsonpCmp;
}());
exports.JsonpCmp = JsonpCmp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbnBfY29tcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcGxheWdyb3VuZC9zcmMvanNvbnAvYXBwL2pzb25wX2NvbXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBd0M7QUFDeEMsc0NBQW9DO0FBYXBDO0lBRUUsa0JBQVksS0FBWTtRQUF4QixpQkFFQztRQURDLEtBQUssQ0FBQyxHQUFHLENBQUMsdUNBQXVDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxLQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDO0lBQ2hHLENBQUM7SUFKVSxRQUFRO1FBWHBCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsV0FBVztZQUNyQixRQUFRLEVBQUUsNkpBT1Q7U0FDRixDQUFDO3lDQUdtQixZQUFLO09BRmIsUUFBUSxDQUtwQjtJQUFELGVBQUM7Q0FBQSxBQUxELElBS0M7QUFMWSw0QkFBUSJ9