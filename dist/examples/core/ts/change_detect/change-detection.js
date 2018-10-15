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
const core_1 = require("@angular/core");
// #docregion mark-for-check
let AppComponent = class AppComponent {
    constructor(ref) {
        this.ref = ref;
        this.numberOfTicks = 0;
        setInterval(() => {
            this.numberOfTicks++;
            // require view to be updated
            this.ref.markForCheck();
        }, 1000);
    }
};
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        template: `Number of ticks: {{numberOfTicks}}`,
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
], AppComponent);
// #enddocregion mark-for-check
// #docregion detach
class DataListProvider {
    // in a real application the returned data will be different every time
    get data() { return [1, 2, 3, 4, 5]; }
}
let GiantList = class GiantList {
    constructor(ref, dataProvider) {
        this.ref = ref;
        this.dataProvider = dataProvider;
        ref.detach();
        setInterval(() => { this.ref.detectChanges(); }, 5000);
    }
};
GiantList = __decorate([
    core_1.Component({
        selector: 'giant-list',
        template: `
      <li *ngFor="let d of dataProvider.data">Data {{d}}</li>
    `,
    }),
    __metadata("design:paramtypes", [core_1.ChangeDetectorRef, DataListProvider])
], GiantList);
let App = class App {
};
App = __decorate([
    core_1.Component({
        selector: 'app',
        providers: [DataListProvider],
        template: `
      <giant-list><giant-list>
    `,
    })
], App);
// #enddocregion detach
// #docregion reattach
class DataProvider {
    constructor() {
        this.data = 1;
        setInterval(() => { this.data = 2; }, 500);
    }
}
let LiveData = class LiveData {
    constructor(ref, dataProvider) {
        this.ref = ref;
        this.dataProvider = dataProvider;
    }
    set live(value) {
        if (value) {
            this.ref.reattach();
        }
        else {
            this.ref.detach();
        }
    }
};
LiveData = __decorate([
    core_1.Component({ selector: 'live-data', inputs: ['live'], template: 'Data: {{dataProvider.data}}' }),
    __metadata("design:paramtypes", [core_1.ChangeDetectorRef, DataProvider])
], LiveData);
let App1 = class App1 {
    constructor() {
        this.live = true;
    }
};
App1 = __decorate([
    core_1.Component({
        selector: 'app',
        providers: [DataProvider],
        template: `
       Live Update: <input type="checkbox" [(ngModel)]="live">
       <live-data [live]="live"><live-data>
     `,
    })
], App1);
// #enddocregion reattach
//# sourceMappingURL=change-detection.js.map