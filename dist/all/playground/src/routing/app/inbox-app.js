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
var db = require("./data");
var InboxRecord = /** @class */ (function () {
    function InboxRecord(data) {
        if (data === void 0) { data = null; }
        this.id = '';
        this.subject = '';
        this.content = '';
        this.email = '';
        this.firstName = '';
        this.lastName = '';
        this.draft = false;
        if (data) {
            this.setData(data);
        }
    }
    InboxRecord.prototype.setData = function (record) {
        this.id = record.id;
        this.subject = record.subject;
        this.content = record.content;
        this.email = record.email;
        this.firstName = record.firstName;
        this.lastName = record.lastName;
        this.date = record.date;
        this.draft = record.draft === true;
    };
    return InboxRecord;
}());
exports.InboxRecord = InboxRecord;
var DbService = /** @class */ (function () {
    function DbService() {
    }
    DbService.prototype.getData = function () {
        return Promise.resolve(db.data.map(function (entry) { return new InboxRecord({
            id: entry['id'],
            subject: entry['subject'],
            content: entry['content'],
            email: entry['email'],
            firstName: entry['first-name'],
            lastName: entry['last-name'],
            date: entry['date'],
            draft: entry['draft'],
        }); }));
    };
    DbService.prototype.drafts = function () {
        return this.getData().then(function (data) { return data.filter(function (record) { return record.draft; }); });
    };
    DbService.prototype.emails = function () {
        return this.getData().then(function (data) { return data.filter(function (record) { return !record.draft; }); });
    };
    DbService.prototype.email = function (id) {
        return this.getData().then(function (data) { return data.find(function (entry) { return entry.id == id; }); });
    };
    DbService = __decorate([
        core_1.Injectable()
    ], DbService);
    return DbService;
}());
exports.DbService = DbService;
var InboxCmp = /** @class */ (function () {
    function InboxCmp(router, db, route) {
        var _this = this;
        this.router = router;
        this.items = [];
        this.ready = false;
        route.params.forEach(function (p) {
            var sortEmailsByDate = p['sort'] === 'date';
            db.emails().then(function (emails) {
                _this.ready = true;
                _this.items = emails;
                if (sortEmailsByDate) {
                    _this.items.sort(function (a, b) { return new Date(a.date).getTime() < new Date(b.date).getTime() ? -1 : 1; });
                }
            });
        });
    }
    InboxCmp = __decorate([
        core_1.Component({ selector: 'inbox', templateUrl: 'app/inbox.html' }),
        __metadata("design:paramtypes", [router_1.Router, DbService, router_1.ActivatedRoute])
    ], InboxCmp);
    return InboxCmp;
}());
exports.InboxCmp = InboxCmp;
var DraftsCmp = /** @class */ (function () {
    function DraftsCmp(router, db) {
        var _this = this;
        this.router = router;
        this.items = [];
        this.ready = false;
        db.drafts().then(function (drafts) {
            _this.ready = true;
            _this.items = drafts;
        });
    }
    DraftsCmp = __decorate([
        core_1.Component({ selector: 'drafts', templateUrl: 'app/drafts.html' }),
        __metadata("design:paramtypes", [router_1.Router, DbService])
    ], DraftsCmp);
    return DraftsCmp;
}());
exports.DraftsCmp = DraftsCmp;
exports.ROUTER_CONFIG = [
    { path: '', pathMatch: 'full', redirectTo: 'inbox' }, { path: 'inbox', component: InboxCmp },
    { path: 'drafts', component: DraftsCmp }, { path: 'detail', loadChildren: 'app/inbox-detail.js' }
];
var InboxApp = /** @class */ (function () {
    function InboxApp() {
    }
    InboxApp = __decorate([
        core_1.Component({ selector: 'inbox-app', templateUrl: 'app/inbox-app.html' })
    ], InboxApp);
    return InboxApp;
}());
exports.InboxApp = InboxApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5ib3gtYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL3NyYy9yb3V0aW5nL2FwcC9pbmJveC1hcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFHSCxzQ0FBb0Q7QUFDcEQsMENBQXVEO0FBRXZELDJCQUE2QjtBQUU3QjtJQVVFLHFCQUFZLElBUUo7UUFSSSxxQkFBQSxFQUFBLFdBUUo7UUFqQlIsT0FBRSxHQUFXLEVBQUUsQ0FBQztRQUNoQixZQUFPLEdBQVcsRUFBRSxDQUFDO1FBQ3JCLFlBQU8sR0FBVyxFQUFFLENBQUM7UUFDckIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUNuQixjQUFTLEdBQVcsRUFBRSxDQUFDO1FBQ3ZCLGFBQVEsR0FBVyxFQUFFLENBQUM7UUFFdEIsVUFBSyxHQUFZLEtBQUssQ0FBQztRQVdyQixJQUFJLElBQUksRUFBRTtZQUNSLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDcEI7SUFDSCxDQUFDO0lBRUQsNkJBQU8sR0FBUCxVQUFRLE1BUVA7UUFDQyxJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUM5QixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQyxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENB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