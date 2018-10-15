"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var debugElement = undefined;
var MyDirective = /** @class */ (function () {
    function MyDirective() {
    }
    return MyDirective;
}());
// #docregion by_all
debugElement.query(platform_browser_1.By.all());
// #enddocregion
// #docregion by_css
debugElement.query(platform_browser_1.By.css('[attribute]'));
// #enddocregion
// #docregion by_directive
debugElement.query(platform_browser_1.By.directive(MyDirective));
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9leGFtcGxlcy9wbGF0Zm9ybS1icm93c2VyL2RvbS9kZWJ1Zy90cy9ieS9ieS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILDhEQUE2QztBQUU3QyxJQUFJLFlBQVksR0FBaUIsU0FBVyxDQUFDO0FBQzdDO0lBQUE7SUFBbUIsQ0FBQztJQUFELGtCQUFDO0FBQUQsQ0FBQyxBQUFwQixJQUFvQjtBQUVwQixvQkFBb0I7QUFDcEIsWUFBWSxDQUFDLEtBQUssQ0FBQyxxQkFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDN0IsZ0JBQWdCO0FBRWhCLG9CQUFvQjtBQUNwQixZQUFZLENBQUMsS0FBSyxDQUFDLHFCQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7QUFDMUMsZ0JBQWdCO0FBRWhCLDBCQUEwQjtBQUMxQixZQUFZLENBQUMsS0FBSyxDQUFDLHFCQUFFLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFDOUMsZ0JBQWdCIn0=