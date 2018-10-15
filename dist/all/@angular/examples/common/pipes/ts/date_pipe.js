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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
// we need to import data for the french locale
var locale_fr_1 = require("./locale-fr");
// registering french data
common_1.registerLocaleData(locale_fr_1.default);
// #docregion DatePipe
var DatePipeComponent = /** @class */ (function () {
    function DatePipeComponent() {
        this.today = Date.now();
        this.fixedTimezone = '2015-06-15T09:03:01+0900';
    }
    DatePipeComponent = __decorate([
        core_1.Component({
            selector: 'date-pipe',
            template: "<div>\n    <!--output 'Jun 15, 2015'-->\n    <p>Today is {{today | date}}</p>\n\n    <!--output 'Monday, June 15, 2015'-->\n    <p>Or if you prefer, {{today | date:'fullDate'}}</p>\n\n    <!--output '9:43 AM'-->\n    <p>The time is {{today | date:'shortTime'}}</p>\n\n    <!--output 'Monday, June 15, 2015 at 9:03:01 AM GMT+01:00' -->\n    <p>The full date/time is {{today | date:'full'}}</p>\n\n    <!--output 'Lundi 15 Juin 2015 \u00E0 09:03:01 GMT+01:00'-->\n    <p>The full date/time in french is: {{today | date:'full':'':'fr'}}</p>\n\n    <!--output '2015-06-15 05:03 PM GMT+9'-->\n    <p>The custom date is {{today | date:'yyyy-MM-dd HH:mm a z':'+0900'}}</p>\n\n    <!--output '2015-06-15 09:03 AM GMT+9'-->\n    <p>The custom date with fixed timezone is {{fixedTimezone | date:'yyyy-MM-dd HH:mm a z':'+0900'}}</p>\n  </div>"
        })
    ], DatePipeComponent);
    return DatePipeComponent;
}());
exports.DatePipeComponent = DatePipeComponent;
// #enddocregion
// #docregion DeprecatedDatePipe
var DeprecatedDatePipeComponent = /** @class */ (function () {
    function DeprecatedDatePipeComponent() {
        this.today = Date.now();
    }
    DeprecatedDatePipeComponent = __decorate([
        core_1.Component({
            selector: 'deprecated-date-pipe',
            template: "<div>\n    <!--output 'Sep 3, 2010'-->\n    <p>Today is {{today | date}}</p>\n\n    <!--output 'Friday, September 3, 2010'-->\n    <p>Or if you prefer, {{today | date:'fullDate'}}</p>\n\n    <!--output '12:05 PM'-->\n    <p>The time is {{today | date:'shortTime'}}</p>\n\n    <!--output '2010-09-03 12:05 PM'-->\n    <p>The custom date is {{today | date:'yyyy-MM-dd HH:mm a'}}</p>\n  </div>"
        })
    ], DeprecatedDatePipeComponent);
    return DeprecatedDatePipeComponent;
}());
exports.DeprecatedDatePipeComponent = DeprecatedDatePipeComponent;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZV9waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29tbW9uL3BpcGVzL3RzL2RhdGVfcGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILDBDQUFtRDtBQUNuRCxzQ0FBd0M7QUFDeEMsK0NBQStDO0FBQy9DLHlDQUFtQztBQUVuQywwQkFBMEI7QUFDMUIsMkJBQWtCLENBQUMsbUJBQVEsQ0FBQyxDQUFDO0FBRTdCLHNCQUFzQjtBQTBCdEI7SUF6QkE7UUEwQkUsVUFBSyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNuQixrQkFBYSxHQUFHLDBCQUEwQixDQUFDO0lBQzdDLENBQUM7SUFIWSxpQkFBaUI7UUF6QjdCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsV0FBVztZQUNyQixRQUFRLEVBQUUsaTBCQXFCSDtTQUNSLENBQUM7T0FDVyxpQkFBaUIsQ0FHN0I7SUFBRCx3QkFBQztDQUFBLEFBSEQsSUFHQztBQUhZLDhDQUFpQjtBQUk5QixnQkFBZ0I7QUFFaEIsZ0NBQWdDO0FBaUJoQztJQWhCQTtRQWlCRSxVQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFGWSwyQkFBMkI7UUFoQnZDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsc0JBQXNCO1lBQ2hDLFFBQVEsRUFBRSx3WUFZSDtTQUNSLENBQUM7T0FDVywyQkFBMkIsQ0FFdkM7SUFBRCxrQ0FBQztDQUFBLEFBRkQsSUFFQztBQUZZLGtFQUEyQjtBQUd4QyxnQkFBZ0IifQ==