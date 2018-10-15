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
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
// we need to import data for the french locale
const locale_fr_1 = require("./locale-fr");
// registering french data
common_1.registerLocaleData(locale_fr_1.default);
// #docregion DatePipe
let DatePipeComponent = class DatePipeComponent {
    // #docregion DatePipe
    constructor() {
        this.today = Date.now();
        this.fixedTimezone = '2015-06-15T09:03:01+0900';
    }
};
DatePipeComponent = __decorate([
    core_1.Component({
        selector: 'date-pipe',
        template: `<div>
    <!--output 'Jun 15, 2015'-->
    <p>Today is {{today | date}}</p>

    <!--output 'Monday, June 15, 2015'-->
    <p>Or if you prefer, {{today | date:'fullDate'}}</p>

    <!--output '9:43 AM'-->
    <p>The time is {{today | date:'shortTime'}}</p>

    <!--output 'Monday, June 15, 2015 at 9:03:01 AM GMT+01:00' -->
    <p>The full date/time is {{today | date:'full'}}</p>

    <!--output 'Lundi 15 Juin 2015 à 09:03:01 GMT+01:00'-->
    <p>The full date/time in french is: {{today | date:'full':'':'fr'}}</p>

    <!--output '2015-06-15 05:03 PM GMT+9'-->
    <p>The custom date is {{today | date:'yyyy-MM-dd HH:mm a z':'+0900'}}</p>

    <!--output '2015-06-15 09:03 AM GMT+9'-->
    <p>The custom date with fixed timezone is {{fixedTimezone | date:'yyyy-MM-dd HH:mm a z':'+0900'}}</p>
  </div>`
    })
], DatePipeComponent);
exports.DatePipeComponent = DatePipeComponent;
// #enddocregion
// #docregion DeprecatedDatePipe
let DeprecatedDatePipeComponent = class DeprecatedDatePipeComponent {
    // #enddocregion
    // #docregion DeprecatedDatePipe
    constructor() {
        this.today = Date.now();
    }
};
DeprecatedDatePipeComponent = __decorate([
    core_1.Component({
        selector: 'deprecated-date-pipe',
        template: `<div>
    <!--output 'Sep 3, 2010'-->
    <p>Today is {{today | date}}</p>

    <!--output 'Friday, September 3, 2010'-->
    <p>Or if you prefer, {{today | date:'fullDate'}}</p>

    <!--output '12:05 PM'-->
    <p>The time is {{today | date:'shortTime'}}</p>

    <!--output '2010-09-03 12:05 PM'-->
    <p>The custom date is {{today | date:'yyyy-MM-dd HH:mm a'}}</p>
  </div>`
    })
], DeprecatedDatePipeComponent);
exports.DeprecatedDatePipeComponent = DeprecatedDatePipeComponent;
// #enddocregion
//# sourceMappingURL=date_pipe.js.map