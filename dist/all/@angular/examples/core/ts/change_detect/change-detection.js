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
// #docregion mark-for-check
var AppComponent = /** @class */ (function () {
    function AppComponent(ref) {
        var _this = this;
        this.ref = ref;
        this.numberOfTicks = 0;
        setInterval(function () {
            _this.numberOfTicks++;
            // require view to be updated
            _this.ref.markForCheck();
        }, 1000);
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            template: "Number of ticks: {{numberOfTicks}}",
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        }),
        __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
    ], AppComponent);
    return AppComponent;
}());
// #enddocregion mark-for-check
// #docregion detach
var DataListProvider = /** @class */ (function () {
    function DataListProvider() {
    }
    Object.defineProperty(DataListProvider.prototype, "data", {
        // in a real application the returned data will be different every time
        get: function () { return [1, 2, 3, 4, 5]; },
        enumerable: true,
        configurable: true
    });
    return DataListProvider;
}());
var GiantList = /** @class */ (function () {
    function GiantList(ref, dataProvider) {
        var _this = this;
        this.ref = ref;
        this.dataProvider = dataProvider;
        ref.detach();
        setInterval(function () { _this.ref.detectChanges(); }, 5000);
    }
    GiantList = __decorate([
        core_1.Component({
            selector: 'giant-list',
            template: "\n      <li *ngFor=\"let d of dataProvider.data\">Data {{d}}</li>\n    ",
        }),
        __metadata("design:paramtypes", [core_1.ChangeDetectorRef, DataListProvider])
    ], GiantList);
    return GiantList;
}());
var App = /** @class */ (function () {
    function App() {
    }
    App = __decorate([
        core_1.Component({
            selector: 'app',
            providers: [DataListProvider],
            template: "\n      <giant-list><giant-list>\n    ",
        })
    ], App);
    return App;
}());
// #enddocregion detach
// #docregion reattach
var DataProvider = /** @class */ (function () {
    function DataProvider() {
        var _this = this;
        this.data = 1;
        setInterval(function () { _this.data = 2; }, 500);
    }
    return DataProvider;
}());
var LiveData = /** @class */ (function () {
    function LiveData(ref, dataProvider) {
        this.ref = ref;
        this.dataProvider = dataProvider;
    }
    Object.defineProperty(LiveData.prototype, "live", {
        set: function (value) {
            if (value) {
                this.ref.reattach();
            }
            else {
                this.ref.detach();
            }
        },
        enumerable: true,
        configurable: true
    });
    LiveData = __decorate([
        core_1.Component({ selector: 'live-data', inputs: ['live'], template: 'Data: {{dataProvider.data}}' }),
        __metadata("design:paramtypes", [core_1.ChangeDetectorRef, DataProvider])
    ], LiveData);
    return LiveData;
}());
var App1 = /** @class */ (function () {
    function App1() {
        this.live = true;
    }
    App1 = __decorate([
        core_1.Component({
            selector: 'app',
            providers: [DataProvider],
            template: "\n       Live Update: <input type=\"checkbox\" [(ngModel)]=\"live\">\n       <live-data [live]=\"live\"><live-data>\n     ",
        })
    ], App1);
    return App1;
}());
// #enddocregion reattach
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlLWRldGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2NvcmUvdHMvY2hhbmdlX2RldGVjdC9jaGFuZ2UtZGV0ZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsZ0NBQWdDO0FBQ2hDLHNDQUErRjtBQUcvRiw0QkFBNEI7QUFPNUI7SUFHRSxzQkFBb0IsR0FBc0I7UUFBMUMsaUJBTUM7UUFObUIsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFGMUMsa0JBQWEsR0FBRyxDQUFDLENBQUM7UUFHaEIsV0FBVyxDQUFDO1lBQ1YsS0FBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JCLDZCQUE2QjtZQUM3QixLQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzFCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNYLENBQUM7SUFURyxZQUFZO1FBTmpCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsUUFBUTtZQUNsQixRQUFRLEVBQUUsb0NBQW9DO1lBQzlDLGVBQWUsRUFBRSw4QkFBdUIsQ0FBQyxNQUFNO1NBQ2hELENBQUM7eUNBS3lCLHdCQUFpQjtPQUh0QyxZQUFZLENBVWpCO0lBQUQsbUJBQUM7Q0FBQSxBQVZELElBVUM7QUFDRCwrQkFBK0I7QUFFL0Isb0JBQW9CO0FBQ3BCO0lBQUE7SUFHQSxDQUFDO0lBREMsc0JBQUksa0NBQUk7UUFEUix1RUFBdUU7YUFDdkUsY0FBYSxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDeEMsdUJBQUM7QUFBRCxDQUFDLEFBSEQsSUFHQztBQVFEO0lBQ0UsbUJBQW9CLEdBQXNCLEVBQVUsWUFBOEI7UUFBbEYsaUJBR0M7UUFIbUIsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFBVSxpQkFBWSxHQUFaLFlBQVksQ0FBa0I7UUFDaEYsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2IsV0FBVyxDQUFDLGNBQVEsS0FBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBSkcsU0FBUztRQU5kLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsWUFBWTtZQUN0QixRQUFRLEVBQUUseUVBRVA7U0FDSixDQUFDO3lDQUV5Qix3QkFBaUIsRUFBd0IsZ0JBQWdCO09BRDlFLFNBQVMsQ0FLZDtJQUFELGdCQUFDO0NBQUEsQUFMRCxJQUtDO0FBU0Q7SUFBQTtJQUNBLENBQUM7SUFESyxHQUFHO1FBUFIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxLQUFLO1lBQ2YsU0FBUyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7WUFDN0IsUUFBUSxFQUFFLHdDQUVQO1NBQ0osQ0FBQztPQUNJLEdBQUcsQ0FDUjtJQUFELFVBQUM7Q0FBQSxBQURELElBQ0M7QUFDRCx1QkFBdUI7QUFFdkIsc0JBQXNCO0FBQ3RCO0lBRUU7UUFBQSxpQkFFQztRQUhELFNBQUksR0FBRyxDQUFDLENBQUM7UUFFUCxXQUFXLENBQUMsY0FBUSxLQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBTEQsSUFLQztBQUlEO0lBQ0Usa0JBQW9CLEdBQXNCLEVBQVUsWUFBMEI7UUFBMUQsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFBVSxpQkFBWSxHQUFaLFlBQVksQ0FBYztJQUFHLENBQUM7SUFFbEYsc0JBQUksMEJBQUk7YUFBUixVQUFTLEtBQWM7WUFDckIsSUFBSSxLQUFLLEVBQUU7Z0JBQ1QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUNyQjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ25CO1FBQ0gsQ0FBQzs7O09BQUE7SUFURyxRQUFRO1FBRGIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBUSxFQUFFLDZCQUE2QixFQUFDLENBQUM7eUNBRW5FLHdCQUFpQixFQUF3QixZQUFZO09BRDFFLFFBQVEsQ0FVYjtJQUFELGVBQUM7Q0FBQSxBQVZELElBVUM7QUFXRDtJQVRBO1FBVUUsU0FBSSxHQUFHLElBQUksQ0FBQztJQUNkLENBQUM7SUFGSyxJQUFJO1FBVFQsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxLQUFLO1lBQ2YsU0FBUyxFQUFFLENBQUMsWUFBWSxDQUFDO1lBQ3pCLFFBQVEsRUFBRSw0SEFHTjtTQUNMLENBQUM7T0FFSSxJQUFJLENBRVQ7SUFBRCxXQUFDO0NBQUEsQUFGRCxJQUVDO0FBQ0QseUJBQXlCIn0=