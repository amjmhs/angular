"use strict";
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
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/* tslint:disable:no-console  */
var core_1 = require("@angular/core");
// #docregion component-input
var BankAccountComponent = /** @class */ (function () {
    function BankAccountComponent() {
        this.bankName = null;
        this.id = null;
        // this property is not bound, and won't be automatically updated by Angular
        this.normalizedBankName = null;
    }
    BankAccountComponent = __decorate([
        core_1.Component({
            selector: 'app-bank-account',
            inputs: ['bankName', 'id: account-id'],
            template: "\n    Bank Name: {{ bankName }}\n    Account Id: {{ id }}\n  "
        })
    ], BankAccountComponent);
    return BankAccountComponent;
}());
exports.BankAccountComponent = BankAccountComponent;
var MyInputComponent = /** @class */ (function () {
    function MyInputComponent() {
    }
    MyInputComponent = __decorate([
        core_1.Component({
            selector: 'app-my-input',
            template: "\n    <app-bank-account\n      bankName=\"RBC\"\n      account-id=\"4747\">\n    </app-bank-account>\n  "
        })
    ], MyInputComponent);
    return MyInputComponent;
}());
exports.MyInputComponent = MyInputComponent;
// #enddocregion component-input
// #docregion component-output-interval
var IntervalDirComponent = /** @class */ (function () {
    function IntervalDirComponent() {
        var _this = this;
        this.everySecond = new core_1.EventEmitter();
        this.fiveSecs = new core_1.EventEmitter();
        setInterval(function () { return _this.everySecond.emit('event'); }, 1000);
        setInterval(function () { return _this.fiveSecs.emit('event'); }, 5000);
    }
    IntervalDirComponent = __decorate([
        core_1.Directive({ selector: 'app-interval-dir', outputs: ['everySecond', 'fiveSecs: everyFiveSeconds'] }),
        __metadata("design:paramtypes", [])
    ], IntervalDirComponent);
    return IntervalDirComponent;
}());
exports.IntervalDirComponent = IntervalDirComponent;
var MyOutputComponent = /** @class */ (function () {
    function MyOutputComponent() {
    }
    MyOutputComponent.prototype.onEverySecond = function () { console.log('second'); };
    MyOutputComponent.prototype.onEveryFiveSeconds = function () { console.log('five seconds'); };
    MyOutputComponent = __decorate([
        core_1.Component({
            selector: 'app-my-output',
            template: "\n    <app-interval-dir\n      (everySecond)=\"onEverySecond()\"\n      (everyFiveSeconds)=\"onEveryFiveSeconds()\">\n    </app-interval-dir>\n  "
        })
    ], MyOutputComponent);
    return MyOutputComponent;
}());
exports.MyOutputComponent = MyOutputComponent;
// #enddocregion component-output-interval
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2NvcmUvdHMvbWV0YWRhdGEvZGlyZWN0aXZlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7Ozs7R0FNRztBQUNILGdDQUFnQztBQUNoQyxzQ0FBaUU7QUFFakUsNkJBQTZCO0FBUzdCO0lBUkE7UUFTRSxhQUFRLEdBQWdCLElBQUksQ0FBQztRQUM3QixPQUFFLEdBQWdCLElBQUksQ0FBQztRQUV2Qiw0RUFBNEU7UUFDNUUsdUJBQWtCLEdBQWdCLElBQUksQ0FBQztJQUN6QyxDQUFDO0lBTlksb0JBQW9CO1FBUmhDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsa0JBQWtCO1lBQzVCLE1BQU0sRUFBRSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQztZQUN0QyxRQUFRLEVBQUUsK0RBR1Q7U0FDRixDQUFDO09BQ1csb0JBQW9CLENBTWhDO0lBQUQsMkJBQUM7Q0FBQSxBQU5ELElBTUM7QUFOWSxvREFBb0I7QUFpQmpDO0lBQUE7SUFDQSxDQUFDO0lBRFksZ0JBQWdCO1FBVDVCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsY0FBYztZQUN4QixRQUFRLEVBQUUsMEdBS1Q7U0FDRixDQUFDO09BQ1csZ0JBQWdCLENBQzVCO0lBQUQsdUJBQUM7Q0FBQSxBQURELElBQ0M7QUFEWSw0Q0FBZ0I7QUFFN0IsZ0NBQWdDO0FBRWhDLHVDQUF1QztBQUV2QztJQUlFO1FBQUEsaUJBR0M7UUFORCxnQkFBVyxHQUFHLElBQUksbUJBQVksRUFBVSxDQUFDO1FBQ3pDLGFBQVEsR0FBRyxJQUFJLG1CQUFZLEVBQVUsQ0FBQztRQUdwQyxXQUFXLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUE5QixDQUE4QixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELFdBQVcsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQTNCLENBQTJCLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQVBVLG9CQUFvQjtRQURoQyxnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLGtCQUFrQixFQUFFLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBRSw0QkFBNEIsQ0FBQyxFQUFDLENBQUM7O09BQ3JGLG9CQUFvQixDQVFoQztJQUFELDJCQUFDO0NBQUEsQUFSRCxJQVFDO0FBUlksb0RBQW9CO0FBbUJqQztJQUFBO0lBR0EsQ0FBQztJQUZDLHlDQUFhLEdBQWIsY0FBa0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsOENBQWtCLEdBQWxCLGNBQXVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRjFDLGlCQUFpQjtRQVQ3QixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGVBQWU7WUFDekIsUUFBUSxFQUFFLG1KQUtUO1NBQ0YsQ0FBQztPQUNXLGlCQUFpQixDQUc3QjtJQUFELHdCQUFDO0NBQUEsQUFIRCxJQUdDO0FBSFksOENBQWlCO0FBSTlCLDBDQUEwQyJ9