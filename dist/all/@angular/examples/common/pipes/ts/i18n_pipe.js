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
// #docregion I18nPluralPipeComponent
var I18nPluralPipeComponent = /** @class */ (function () {
    function I18nPluralPipeComponent() {
        this.messages = ['Message 1'];
        this.messageMapping = { '=0': 'No messages.', '=1': 'One message.', 'other': '# messages.' };
    }
    I18nPluralPipeComponent = __decorate([
        core_1.Component({
            selector: 'i18n-plural-pipe',
            template: "<div>{{ messages.length | i18nPlural: messageMapping }}</div>"
        })
    ], I18nPluralPipeComponent);
    return I18nPluralPipeComponent;
}());
exports.I18nPluralPipeComponent = I18nPluralPipeComponent;
// #enddocregion
// #docregion I18nSelectPipeComponent
var I18nSelectPipeComponent = /** @class */ (function () {
    function I18nSelectPipeComponent() {
        this.gender = 'male';
        this.inviteMap = { 'male': 'Invite him.', 'female': 'Invite her.', 'other': 'Invite them.' };
    }
    I18nSelectPipeComponent = __decorate([
        core_1.Component({ selector: 'i18n-select-pipe', template: "<div>{{gender | i18nSelect: inviteMap}} </div>" })
    ], I18nSelectPipeComponent);
    return I18nSelectPipeComponent;
}());
exports.I18nSelectPipeComponent = I18nSelectPipeComponent;
//#enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29tbW9uL3BpcGVzL3RzL2kxOG5fcGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNDQUF3QztBQUV4QyxxQ0FBcUM7QUFLckM7SUFKQTtRQUtFLGFBQVEsR0FBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2hDLG1CQUFjLEdBQ2MsRUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBQyxDQUFDO0lBQ25HLENBQUM7SUFKWSx1QkFBdUI7UUFKbkMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxrQkFBa0I7WUFDNUIsUUFBUSxFQUFFLCtEQUErRDtTQUMxRSxDQUFDO09BQ1csdUJBQXVCLENBSW5DO0lBQUQsOEJBQUM7Q0FBQSxBQUpELElBSUM7QUFKWSwwREFBdUI7QUFLcEMsZ0JBQWdCO0FBRWhCLHFDQUFxQztBQUdyQztJQUZBO1FBR0UsV0FBTSxHQUFXLE1BQU0sQ0FBQztRQUN4QixjQUFTLEdBQVEsRUFBQyxNQUFNLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBQyxDQUFDO0lBQzdGLENBQUM7SUFIWSx1QkFBdUI7UUFGbkMsZ0JBQVMsQ0FDTixFQUFDLFFBQVEsRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsZ0RBQWdELEVBQUMsQ0FBQztPQUNsRix1QkFBdUIsQ0FHbkM7SUFBRCw4QkFBQztDQUFBLEFBSEQsSUFHQztBQUhZLDBEQUF1QjtBQUlwQyxlQUFlIn0=