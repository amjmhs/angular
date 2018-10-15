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
var InputCmp = /** @class */ (function () {
    function InputCmp() {
        this.inputVal = '';
        this.textareaVal = '';
    }
    InputCmp.prototype.inputChanged = function (e) { this.inputVal = e.target.value; };
    InputCmp.prototype.textAreaChanged = function (e) { this.textareaVal = e.target.value; };
    InputCmp = __decorate([
        core_1.Component({
            selector: 'input-app',
            template: "\n    <h2>Input App</h2>\n    <div id=\"input-container\">\n      <input type=\"text\" (input)=\"inputChanged($event)\">\n      <textarea (input)=\"textAreaChanged($event)\"></textarea>\n      <div class=\"input-val\">Input val is {{inputVal}}.</div>\n      <div class=\"textarea-val\">Textarea val is {{textareaVal}}.</div>\n    </div>\n    <div id=\"ng-model-container\">\n    </div>\n  "
        })
    ], InputCmp);
    return InputCmp;
}());
exports.InputCmp = InputCmp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL3NyYy93ZWJfd29ya2Vycy9pbnB1dC9pbmRleF9jb21tb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCxzQ0FBd0M7QUFnQnhDO0lBZEE7UUFlRSxhQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ2QsZ0JBQVcsR0FBRyxFQUFFLENBQUM7SUFLbkIsQ0FBQztJQUhDLCtCQUFZLEdBQVosVUFBYSxDQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBSSxDQUFDLENBQUMsTUFBMkIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBRWhGLGtDQUFlLEdBQWYsVUFBZ0IsQ0FBUSxJQUFJLElBQUksQ0FBQyxXQUFXLEdBQUksQ0FBQyxDQUFDLE1BQThCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQU45RSxRQUFRO1FBZHBCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsV0FBVztZQUNyQixRQUFRLEVBQUUsdVlBVVQ7U0FDRixDQUFDO09BQ1csUUFBUSxDQU9wQjtJQUFELGVBQUM7Q0FBQSxBQVBELElBT0M7QUFQWSw0QkFBUSJ9