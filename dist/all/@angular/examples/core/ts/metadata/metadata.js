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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CustomDirective = /** @class */ (function () {
    function CustomDirective() {
    }
    return CustomDirective;
}());
// #docregion component
var Greet = /** @class */ (function () {
    function Greet() {
        this.name = 'World';
    }
    Greet = __decorate([
        core_1.Component({ selector: 'greet', template: 'Hello {{name}}!' })
    ], Greet);
    return Greet;
}());
// #enddocregion
// #docregion attributeFactory
var Page = /** @class */ (function () {
    function Page(title) {
        this.title = title;
    }
    Page = __decorate([
        core_1.Component({ selector: 'page', template: 'Title: {{title}}' }),
        __param(0, core_1.Attribute('title')),
        __metadata("design:paramtypes", [String])
    ], Page);
    return Page;
}());
// #enddocregion
// #docregion attributeMetadata
var InputAttrDirective = /** @class */ (function () {
    function InputAttrDirective(type) {
        // type would be 'text' in this example
    }
    InputAttrDirective = __decorate([
        core_1.Directive({ selector: 'input' }),
        __param(0, core_1.Attribute('type')),
        __metadata("design:paramtypes", [String])
    ], InputAttrDirective);
    return InputAttrDirective;
}());
// #enddocregion
// #docregion directive
var InputDirective = /** @class */ (function () {
    function InputDirective() {
        // Add some logic.
    }
    InputDirective = __decorate([
        core_1.Directive({ selector: 'input' }),
        __metadata("design:paramtypes", [])
    ], InputDirective);
    return InputDirective;
}());
// #enddocregion
// #docregion pipe
var Lowercase = /** @class */ (function () {
    function Lowercase() {
    }
    Lowercase.prototype.transform = function (v, args) { return v.toLowerCase(); };
    Lowercase = __decorate([
        core_1.Pipe({ name: 'lowercase' })
    ], Lowercase);
    return Lowercase;
}());
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9leGFtcGxlcy9jb3JlL3RzL21ldGFkYXRhL21ldGFkYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQW9FO0FBRXBFO0lBQUE7SUFBdUIsQ0FBQztJQUFELHNCQUFDO0FBQUQsQ0FBQyxBQUF4QixJQUF3QjtBQUV4Qix1QkFBdUI7QUFFdkI7SUFEQTtRQUVFLFNBQUksR0FBVyxPQUFPLENBQUM7SUFDekIsQ0FBQztJQUZLLEtBQUs7UUFEVixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsQ0FBQztPQUN0RCxLQUFLLENBRVY7SUFBRCxZQUFDO0NBQUEsQUFGRCxJQUVDO0FBQ0QsZ0JBQWdCO0FBRWhCLDhCQUE4QjtBQUU5QjtJQUVFLGNBQWdDLEtBQWE7UUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUFDLENBQUM7SUFGbEUsSUFBSTtRQURULGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxrQkFBa0IsRUFBQyxDQUFDO1FBRzdDLFdBQUEsZ0JBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQTs7T0FGM0IsSUFBSSxDQUdUO0lBQUQsV0FBQztDQUFBLEFBSEQsSUFHQztBQUNELGdCQUFnQjtBQUVoQiwrQkFBK0I7QUFFL0I7SUFDRSw0QkFBK0IsSUFBWTtRQUN6Qyx1Q0FBdUM7SUFDekMsQ0FBQztJQUhHLGtCQUFrQjtRQUR2QixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBQyxDQUFDO1FBRWhCLFdBQUEsZ0JBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTs7T0FEMUIsa0JBQWtCLENBSXZCO0lBQUQseUJBQUM7Q0FBQSxBQUpELElBSUM7QUFDRCxnQkFBZ0I7QUFFaEIsdUJBQXVCO0FBRXZCO0lBQ0U7UUFDRSxrQkFBa0I7SUFDcEIsQ0FBQztJQUhHLGNBQWM7UUFEbkIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQzs7T0FDekIsY0FBYyxDQUluQjtJQUFELHFCQUFDO0NBQUEsQUFKRCxJQUlDO0FBQ0QsZ0JBQWdCO0FBRWhCLGtCQUFrQjtBQUVsQjtJQUFBO0lBRUEsQ0FBQztJQURDLDZCQUFTLEdBQVQsVUFBVSxDQUFTLEVBQUUsSUFBVyxJQUFJLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUR6RCxTQUFTO1FBRGQsV0FBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBQyxDQUFDO09BQ3BCLFNBQVMsQ0FFZDtJQUFELGdCQUFDO0NBQUEsQUFGRCxJQUVDO0FBQ0QsZ0JBQWdCIn0=