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
// #docregion Component
const core_1 = require("@angular/core");
let Pane = class Pane {
};
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], Pane.prototype, "id", void 0);
Pane = __decorate([
    core_1.Directive({ selector: 'pane' })
], Pane);
exports.Pane = Pane;
let ViewChildrenComp = class ViewChildrenComp {
    constructor() {
        this.serializedPanes = '';
        this.shouldShow = false;
    }
    show() { this.shouldShow = true; }
    ngAfterViewInit() {
        this.calculateSerializedPanes();
        this.panes.changes.subscribe((r) => { this.calculateSerializedPanes(); });
    }
    calculateSerializedPanes() {
        setTimeout(() => { this.serializedPanes = this.panes.map(p => p.id).join(', '); }, 0);
    }
};
__decorate([
    core_1.ViewChildren(Pane),
    __metadata("design:type", core_1.QueryList)
], ViewChildrenComp.prototype, "panes", void 0);
ViewChildrenComp = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: `
    <pane id="1"></pane>
    <pane id="2"></pane>
    <pane id="3" *ngIf="shouldShow"></pane>
    
    <button (click)="show()">Show 3</button>
       
    <div>panes: {{serializedPanes}}</div> 
  `,
    })
], ViewChildrenComp);
exports.ViewChildrenComp = ViewChildrenComp;
// #enddocregion
//# sourceMappingURL=view_children_example.js.map