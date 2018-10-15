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
var router_1 = require("@angular/router");
var inbox_app_1 = require("./inbox-app");
var InboxDetailCmp = /** @class */ (function () {
    function InboxDetailCmp(db, route) {
        var _this = this;
        this.record = new inbox_app_1.InboxRecord();
        this.ready = false;
        route.paramMap.forEach(function (p) { db.email(p.get('id')).then(function (data) { _this.record.setData(data); }); });
    }
    InboxDetailCmp = __decorate([
        core_1.Component({ selector: 'inbox-detail', templateUrl: 'app/inbox-detail.html' }),
        __metadata("design:paramtypes", [inbox_app_1.DbService, router_1.ActivatedRoute])
    ], InboxDetailCmp);
    return InboxDetailCmp;
}());
exports.InboxDetailCmp = InboxDetailCmp;
var InboxDetailModule = /** @class */ (function () {
    function InboxDetailModule() {
    }
    InboxDetailModule = __decorate([
        core_1.NgModule({
            declarations: [InboxDetailCmp],
            imports: [router_1.RouterModule.forChild([{ path: ':id', component: InboxDetailCmp }])]
        })
    ], InboxDetailModule);
    return InboxDetailModule;
}());
exports.default = InboxDetailModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5ib3gtZGV0YWlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL3NyYy9yb3V0aW5nL2FwcC9pbmJveC1kZXRhaWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBa0Q7QUFDbEQsMENBQTZEO0FBRTdELHlDQUFtRDtBQUduRDtJQUlFLHdCQUFZLEVBQWEsRUFBRSxLQUFxQjtRQUFoRCxpQkFHQztRQU5PLFdBQU0sR0FBZ0IsSUFBSSx1QkFBVyxFQUFFLENBQUM7UUFDeEMsVUFBSyxHQUFZLEtBQUssQ0FBQztRQUc3QixLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FDbEIsVUFBQSxDQUFDLElBQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxJQUFPLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBUFUsY0FBYztRQUQxQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUsdUJBQXVCLEVBQUMsQ0FBQzt5Q0FLMUQscUJBQVMsRUFBUyx1QkFBYztPQUpyQyxjQUFjLENBUTFCO0lBQUQscUJBQUM7Q0FBQSxBQVJELElBUUM7QUFSWSx3Q0FBYztBQWMzQjtJQUFBO0lBQ0EsQ0FBQztJQURvQixpQkFBaUI7UUFKckMsZUFBUSxDQUFDO1lBQ1IsWUFBWSxFQUFFLENBQUMsY0FBYyxDQUFDO1lBQzlCLE9BQU8sRUFBRSxDQUFDLHFCQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUMsQ0FBQyxDQUFDLENBQUM7U0FDN0UsQ0FBQztPQUNtQixpQkFBaUIsQ0FDckM7SUFBRCx3QkFBQztDQUFBLEFBREQsSUFDQztrQkFEb0IsaUJBQWlCIn0=