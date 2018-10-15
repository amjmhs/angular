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
const core_1 = require("@angular/core");
// #docregion TitleCasePipe
let TitleCasePipeComponent = class TitleCasePipeComponent {
};
TitleCasePipeComponent = __decorate([
    core_1.Component({
        selector: 'titlecase-pipe',
        template: `<div>
    <p>{{'some string' | titlecase}}</p> <!-- output is expected to be "Some String" --> 
    <p>{{'tHIs is mIXeD CaSe' | titlecase}}</p> <!-- output is expected to be "This Is Mixed Case" --> 
    <p>{{'it\\'s non-trivial question' | titlecase}}</p> <!-- output is expected to be "It's Non-trivial Question" --> 
    <p>{{'one,two,three' | titlecase}}</p> <!-- output is expected to be "One,two,three" -->
    <p>{{'true|false' | titlecase}}</p> <!-- output is expected to be "True|false" -->
    <p>{{'foo-vs-bar' | titlecase}}</p> <!-- output is expected to be "Foo-vs-bar" -->
  </div>`
    })
], TitleCasePipeComponent);
exports.TitleCasePipeComponent = TitleCasePipeComponent;
// #enddocregion
//# sourceMappingURL=titlecase_pipe.js.map