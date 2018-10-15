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
// #docregion I18nPluralPipeComponent
let I18nPluralPipeComponent = class I18nPluralPipeComponent {
    // #docregion I18nPluralPipeComponent
    constructor() {
        this.messages = ['Message 1'];
        this.messageMapping = { '=0': 'No messages.', '=1': 'One message.', 'other': '# messages.' };
    }
};
I18nPluralPipeComponent = __decorate([
    core_1.Component({
        selector: 'i18n-plural-pipe',
        template: `<div>{{ messages.length | i18nPlural: messageMapping }}</div>`
    })
], I18nPluralPipeComponent);
exports.I18nPluralPipeComponent = I18nPluralPipeComponent;
// #enddocregion
// #docregion I18nSelectPipeComponent
let I18nSelectPipeComponent = class I18nSelectPipeComponent {
    // #enddocregion
    // #docregion I18nSelectPipeComponent
    constructor() {
        this.gender = 'male';
        this.inviteMap = { 'male': 'Invite him.', 'female': 'Invite her.', 'other': 'Invite them.' };
    }
};
I18nSelectPipeComponent = __decorate([
    core_1.Component({ selector: 'i18n-select-pipe', template: `<div>{{gender | i18nSelect: inviteMap}} </div>` })
], I18nSelectPipeComponent);
exports.I18nSelectPipeComponent = I18nSelectPipeComponent;
//#enddocregion
//# sourceMappingURL=i18n_pipe.js.map