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
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var AsyncApplication = /** @class */ (function () {
    function AsyncApplication() {
        this.val1 = 0;
        this.val2 = 0;
        this.val3 = 0;
        this.val4 = 0;
        this.timeoutId = null;
        this.multiTimeoutId = null;
        this.intervalId = null;
    }
    AsyncApplication.prototype.increment = function () { this.val1++; };
    AsyncApplication.prototype.delayedIncrement = function () {
        var _this = this;
        this.cancelDelayedIncrement();
        this.timeoutId = setTimeout(function () {
            _this.val2++;
            _this.timeoutId = null;
        }, 2000);
    };
    AsyncApplication.prototype.multiDelayedIncrements = function (i) {
        this.cancelMultiDelayedIncrements();
        var self = this;
        function helper(_i) {
            if (_i <= 0) {
                self.multiTimeoutId = null;
                return;
            }
            self.multiTimeoutId = setTimeout(function () {
                self.val3++;
                helper(_i - 1);
            }, 500);
        }
        helper(i);
    };
    AsyncApplication.prototype.periodicIncrement = function () {
        var _this = this;
        this.cancelPeriodicIncrement();
        this.intervalId = setInterval(function () { return _this.val4++; }, 2000);
    };
    AsyncApplication.prototype.cancelDelayedIncrement = function () {
        if (this.timeoutId != null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    };
    AsyncApplication.prototype.cancelMultiDelayedIncrements = function () {
        if (this.multiTimeoutId != null) {
            clearTimeout(this.multiTimeoutId);
            this.multiTimeoutId = null;
        }
    };
    AsyncApplication.prototype.cancelPeriodicIncrement = function () {
        if (this.intervalId != null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    };
    AsyncApplication = __decorate([
        core_1.Component({
            selector: 'async-app',
            template: "\n    <div id='increment'>\n      <span class='val'>{{val1}}</span>\n      <button class='action' (click)=\"increment()\">Increment</button>\n    </div>\n    <div id='delayedIncrement'>\n      <span class='val'>{{val2}}</span>\n      <button class='action' (click)=\"delayedIncrement()\">Delayed Increment</button>\n      <button class='cancel' *ngIf=\"timeoutId != null\" (click)=\"cancelDelayedIncrement()\">Cancel</button>\n    </div>\n    <div id='multiDelayedIncrements'>\n      <span class='val'>{{val3}}</span>\n      <button class='action' (click)=\"multiDelayedIncrements(10)\">10 Delayed Increments</button>\n      <button class='cancel' *ngIf=\"multiTimeoutId != null\" (click)=\"cancelMultiDelayedIncrements()\">Cancel</button>\n    </div>\n    <div id='periodicIncrement'>\n      <span class='val'>{{val4}}</span>\n      <button class='action' (click)=\"periodicIncrement()\">Periodic Increment</button>\n      <button class='cancel' *ngIf=\"intervalId != null\" (click)=\"cancelPeriodicIncrement()\">Cancel</button>\n    </div>\n  "
        })
    ], AsyncApplication);
    return AsyncApplication;
}());
var ExampleModule = /** @class */ (function () {
    function ExampleModule() {
    }
    ExampleModule = __decorate([
        core_1.NgModule({ declarations: [AsyncApplication], bootstrap: [AsyncApplication], imports: [platform_browser_1.BrowserModule] })
    ], ExampleModule);
    return ExampleModule;
}());
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(ExampleModule);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL2FzeW5jL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQWtEO0FBQ2xELDhEQUF3RDtBQUN4RCw4RUFBeUU7QUEwQnpFO0lBeEJBO1FBeUJFLFNBQUksR0FBVyxDQUFDLENBQUM7UUFDakIsU0FBSSxHQUFXLENBQUMsQ0FBQztRQUNqQixTQUFJLEdBQVcsQ0FBQyxDQUFDO1FBQ2pCLFNBQUksR0FBVyxDQUFDLENBQUM7UUFDakIsY0FBUyxHQUFRLElBQUksQ0FBQztRQUN0QixtQkFBYyxHQUFRLElBQUksQ0FBQztRQUMzQixlQUFVLEdBQVEsSUFBSSxDQUFDO0lBdUR6QixDQUFDO0lBckRDLG9DQUFTLEdBQVQsY0FBb0IsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUVsQywyQ0FBZ0IsR0FBaEI7UUFBQSxpQkFNQztRQUxDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDO1lBQzFCLEtBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNaLEtBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFRCxpREFBc0IsR0FBdEIsVUFBdUIsQ0FBUztRQUM5QixJQUFJLENBQUMsNEJBQTRCLEVBQUUsQ0FBQztRQUVwQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsZ0JBQWdCLEVBQVU7WUFDeEIsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUNYLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO2dCQUMzQixPQUFPO2FBQ1I7WUFFRCxJQUFJLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNaLE1BQU0sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDakIsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsQ0FBQztRQUNELE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNaLENBQUM7SUFFRCw0Q0FBaUIsR0FBakI7UUFBQSxpQkFHQztRQUZDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsSUFBSSxFQUFFLEVBQVgsQ0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxpREFBc0IsR0FBdEI7UUFDRSxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxFQUFFO1lBQzFCLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBRUQsdURBQTRCLEdBQTVCO1FBQ0UsSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksRUFBRTtZQUMvQixZQUFZLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1NBQzVCO0lBQ0gsQ0FBQztJQUVELGtEQUF1QixHQUF2QjtRQUNFLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLEVBQUU7WUFDM0IsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztTQUN4QjtJQUNILENBQUM7SUE3REcsZ0JBQWdCO1FBeEJyQixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFdBQVc7WUFDckIsUUFBUSxFQUFFLHVoQ0FvQlQ7U0FDRixDQUFDO09BQ0ksZ0JBQWdCLENBOERyQjtJQUFELHVCQUFDO0NBQUEsQUE5REQsSUE4REM7QUFJRDtJQUFBO0lBQ0EsQ0FBQztJQURLLGFBQWE7UUFGbEIsZUFBUSxDQUNMLEVBQUMsWUFBWSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLGdDQUFhLENBQUMsRUFBQyxDQUFDO09BQzFGLGFBQWEsQ0FDbEI7SUFBRCxvQkFBQztDQUFBLEFBREQsSUFDQztBQUVEO0lBQ0UsaURBQXNCLEVBQUUsQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDMUQsQ0FBQztBQUZELG9CQUVDIn0=