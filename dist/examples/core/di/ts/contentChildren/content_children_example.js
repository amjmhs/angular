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
let Tab = class Tab {
    get serializedPanes() {
        return this.topLevelPanes ? this.topLevelPanes.map(p => p.id).join(', ') : '';
    }
    get serializedNestedPanes() {
        return this.arbitraryNestedPanes ? this.arbitraryNestedPanes.map(p => p.id).join(', ') : '';
    }
};
__decorate([
    core_1.ContentChildren(Pane),
    __metadata("design:type", core_1.QueryList)
], Tab.prototype, "topLevelPanes", void 0);
__decorate([
    core_1.ContentChildren(Pane, { descendants: true }),
    __metadata("design:type", core_1.QueryList)
], Tab.prototype, "arbitraryNestedPanes", void 0);
Tab = __decorate([
    core_1.Component({
        selector: 'tab',
        template: `
    <div class="top-level">Top level panes: {{serializedPanes}}</div> 
    <div class="nested">Arbitrary nested panes: {{serializedNestedPanes}}</div>
  `
    })
], Tab);
exports.Tab = Tab;
let ContentChildrenComp = class ContentChildrenComp {
    constructor() {
        this.shouldShow = false;
    }
    show() { this.shouldShow = true; }
};
ContentChildrenComp = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: `
    <tab>
      <pane id="1"></pane>
      <pane id="2"></pane>
      <pane id="3" *ngIf="shouldShow">
        <tab>
          <pane id="3_1"></pane>
          <pane id="3_2"></pane>
        </tab>
      </pane>
    </tab>
    
    <button (click)="show()">Show 3</button>
  `,
    })
], ContentChildrenComp);
exports.ContentChildrenComp = ContentChildrenComp;
// #enddocregion
//# sourceMappingURL=content_children_example.js.map