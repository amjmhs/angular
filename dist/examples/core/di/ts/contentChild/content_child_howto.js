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
// #docregion HowTo
const core_1 = require("@angular/core");
let ChildDirective = class ChildDirective {
};
ChildDirective = __decorate([
    core_1.Directive({ selector: 'child-directive' })
], ChildDirective);
let SomeDir = class SomeDir {
    ngAfterContentInit() {
        // contentChild is set
    }
};
__decorate([
    core_1.ContentChild(ChildDirective),
    __metadata("design:type", ChildDirective)
], SomeDir.prototype, "contentChild", void 0);
SomeDir = __decorate([
    core_1.Directive({ selector: 'someDir' })
], SomeDir);
// #enddocregion
//# sourceMappingURL=content_child_howto.js.map