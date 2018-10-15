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
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const rxjs_1 = require("rxjs");
// #docregion NgIfSimple
let NgIfSimple = class NgIfSimple {
    // #docregion NgIfSimple
    constructor() {
        this.show = true;
    }
};
NgIfSimple = __decorate([
    core_1.Component({
        selector: 'ng-if-simple',
        template: `
    <button (click)="show = !show">{{show ? 'hide' : 'show'}}</button>
    show = {{show}}
    <br>
    <div *ngIf="show">Text to show</div>
`
    })
], NgIfSimple);
// #enddocregion
// #docregion NgIfElse
let NgIfElse = class NgIfElse {
    // #enddocregion
    // #docregion NgIfElse
    constructor() {
        this.show = true;
    }
};
NgIfElse = __decorate([
    core_1.Component({
        selector: 'ng-if-else',
        template: `
    <button (click)="show = !show">{{show ? 'hide' : 'show'}}</button>
    show = {{show}}
    <br>
    <div *ngIf="show; else elseBlock">Text to show</div>
    <ng-template #elseBlock>Alternate text while primary text is hidden</ng-template>
`
    })
], NgIfElse);
// #enddocregion
// #docregion NgIfThenElse
let NgIfThenElse = class NgIfThenElse {
    // #enddocregion
    // #docregion NgIfThenElse
    constructor() {
        this.thenBlock = null;
        this.show = true;
        this.primaryBlock = null;
        this.secondaryBlock = null;
    }
    switchPrimary() {
        this.thenBlock = this.thenBlock === this.primaryBlock ? this.secondaryBlock : this.primaryBlock;
    }
    ngOnInit() { this.thenBlock = this.primaryBlock; }
};
__decorate([
    core_1.ViewChild('primaryBlock'),
    __metadata("design:type", Object)
], NgIfThenElse.prototype, "primaryBlock", void 0);
__decorate([
    core_1.ViewChild('secondaryBlock'),
    __metadata("design:type", Object)
], NgIfThenElse.prototype, "secondaryBlock", void 0);
NgIfThenElse = __decorate([
    core_1.Component({
        selector: 'ng-if-then-else',
        template: `
    <button (click)="show = !show">{{show ? 'hide' : 'show'}}</button>
    <button (click)="switchPrimary()">Switch Primary</button>
    show = {{show}}
    <br>
    <div *ngIf="show; then thenBlock; else elseBlock">this is ignored</div>
    <ng-template #primaryBlock>Primary text to show</ng-template>
    <ng-template #secondaryBlock>Secondary text to show</ng-template>
    <ng-template #elseBlock>Alternate text while primary text is hidden</ng-template>
`
    })
], NgIfThenElse);
// #enddocregion
// #docregion NgIfAs
let NgIfAs = class NgIfAs {
    // #enddocregion
    // #docregion NgIfAs
    constructor() {
        this.userObservable = new rxjs_1.Subject();
        this.first = ['John', 'Mike', 'Mary', 'Bob'];
        this.firstIndex = 0;
        this.last = ['Smith', 'Novotny', 'Angular'];
        this.lastIndex = 0;
    }
    nextUser() {
        let first = this.first[this.firstIndex++];
        if (this.firstIndex >= this.first.length)
            this.firstIndex = 0;
        let last = this.last[this.lastIndex++];
        if (this.lastIndex >= this.last.length)
            this.lastIndex = 0;
        this.userObservable.next({ first, last });
    }
};
NgIfAs = __decorate([
    core_1.Component({
        selector: 'ng-if-let',
        template: `
    <button (click)="nextUser()">Next User</button>
    <br>
    <div *ngIf="userObservable | async as user; else loading">
      Hello {{user.last}}, {{user.first}}!
    </div>
    <ng-template #loading let-user>Waiting... (user is {{user|json}})</ng-template>
`
    })
], NgIfAs);
// #enddocregion
let ExampleApp = class ExampleApp {
};
ExampleApp = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: `
    <ng-if-simple></ng-if-simple>
    <hr>
    <ng-if-else></ng-if-else>
    <hr>
    <ng-if-then-else></ng-if-then-else>
    <hr>
    <ng-if-let></ng-if-let>
    <hr>
`
    })
], ExampleApp);
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule],
        declarations: [ExampleApp, NgIfSimple, NgIfElse, NgIfThenElse, NgIfAs],
        bootstrap: [ExampleApp]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=module.js.map