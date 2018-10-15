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
const animations_1 = require("@angular/animations");
const core_1 = require("@angular/core");
const animations_2 = require("@angular/platform-browser/animations");
let MyExpandoCmp = class MyExpandoCmp {
    constructor() { this.collapse(); }
    expand() { this.stateExpression = 'expanded'; }
    collapse() { this.stateExpression = 'collapsed'; }
};
MyExpandoCmp = __decorate([
    core_1.Component({
        selector: 'example-app',
        styles: [`
    .toggle-container {
      background-color:white;
      border:10px solid black;
      width:200px;
      text-align:center;
      line-height:100px;
      font-size:50px;
      box-sizing:border-box;
      overflow:hidden;
    }
  `],
        animations: [animations_1.trigger('openClose', [
                animations_1.state('collapsed, void', animations_1.style({ height: '0px', color: 'maroon', borderColor: 'maroon' })),
                animations_1.state('expanded', animations_1.style({ height: '*', borderColor: 'green', color: 'green' })),
                animations_1.transition('collapsed <=> expanded', [animations_1.animate(500, animations_1.style({ height: '250px' })), animations_1.animate(500)])
            ])],
        template: `
    <button (click)="expand()">Open</button>
    <button (click)="collapse()">Closed</button>
    <hr />
    <div class="toggle-container" [@openClose]="stateExpression">
      Look at this box
    </div>
  `
    }),
    __metadata("design:paramtypes", [])
], MyExpandoCmp);
exports.MyExpandoCmp = MyExpandoCmp;
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({ imports: [animations_2.BrowserAnimationsModule], declarations: [MyExpandoCmp], bootstrap: [MyExpandoCmp] })
], AppModule);
exports.AppModule = AppModule;
// #enddocregion
//# sourceMappingURL=animation_example.js.map