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
var operators_1 = require("rxjs/operators");
var HttpCmp = /** @class */ (function () {
    function HttpCmp(http) {
        var _this = this;
        http.get('./people.json')
            .pipe(operators_1.map(function (res) { return res.json(); }))
            .subscribe(function (people) { return _this.people = people; });
    }
    HttpCmp = __decorate([
        core_1.Component({
            selector: 'http-app',
            template: "\n    <h1>people</h1>\n    <ul class=\"people\">\n      <li *ngFor=\"let person of people\">\n        hello, {{person['name']}}\n      </li>\n    </ul>\n  "
        }),
        __metadata("design:paramtypes", [http_1.Http])
    ], HttpCmp);
    return HttpCmp;
}());
exports.HttpCmp = HttpCmp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cF9jb21wLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL3NyYy9odHRwL2FwcC9odHRwX2NvbXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBd0M7QUFDeEMsc0NBQTZDO0FBQzdDLDRDQUFtQztBQWFuQztJQUVFLGlCQUFZLElBQVU7UUFBdEIsaUJBSUM7UUFIQyxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQzthQUNwQixJQUFJLENBQUMsZUFBRyxDQUFDLFVBQUMsR0FBYSxJQUFLLE9BQUEsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFWLENBQVUsQ0FBQyxDQUFDO2FBQ3hDLFNBQVMsQ0FBQyxVQUFDLE1BQXFCLElBQUssT0FBQSxLQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFOVSxPQUFPO1FBWG5CLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsVUFBVTtZQUNwQixRQUFRLEVBQUUsNkpBT1Q7U0FDRixDQUFDO3lDQUdrQixXQUFJO09BRlgsT0FBTyxDQU9uQjtJQUFELGNBQUM7Q0FBQSxBQVBELElBT0M7QUFQWSwwQkFBTyJ9