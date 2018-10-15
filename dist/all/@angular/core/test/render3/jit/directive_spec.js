"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var directive_1 = require("../../../src/render3/jit/directive");
describe('extendsDirectlyFromObject', function () {
    it('should correctly behave with instanceof', function () {
        expect(new Child() instanceof Object).toBeTruthy();
        expect(new Child() instanceof Parent).toBeTruthy();
        expect(new Parent() instanceof Child).toBeFalsy();
        expect(new Child5() instanceof Object).toBeTruthy();
        expect(new Child5() instanceof Parent5).toBeTruthy();
        expect(new Parent5() instanceof Child5).toBeFalsy();
    });
    it('should detect direct inheritance form Object', function () {
        expect(directive_1.extendsDirectlyFromObject(Parent)).toBeTruthy();
        expect(directive_1.extendsDirectlyFromObject(Child)).toBeFalsy();
        expect(directive_1.extendsDirectlyFromObject(Parent5)).toBeTruthy();
        expect(directive_1.extendsDirectlyFromObject(Child5)).toBeFalsy();
    });
});
// Inheritance Example using Classes
var Parent = /** @class */ (function () {
    function Parent() {
    }
    return Parent;
}());
var Child = /** @class */ (function (_super) {
    __extends(Child, _super);
    function Child() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Child;
}(Parent));
// Inheritance Example using Function
var Parent5 = function Parent5() { };
var Child5 = function Child5() { };
Child5.prototype = new Parent5;
Child5.prototype.constructor = Child5;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVuZGVyMy9qaXQvZGlyZWN0aXZlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBRUgsZ0VBQTZFO0FBRTdFLFFBQVEsQ0FBQywyQkFBMkIsRUFBRTtJQUNwQyxFQUFFLENBQUMseUNBQXlDLEVBQUU7UUFDNUMsTUFBTSxDQUFDLElBQUksS0FBSyxFQUFFLFlBQVksTUFBTSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbkQsTUFBTSxDQUFDLElBQUksS0FBSyxFQUFFLFlBQVksTUFBTSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbkQsTUFBTSxDQUFDLElBQUksTUFBTSxFQUFFLFlBQVksS0FBSyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7UUFFbEQsTUFBTSxDQUFDLElBQUksTUFBTSxFQUFFLFlBQVksTUFBTSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDcEQsTUFBTSxDQUFDLElBQUksTUFBTSxFQUFFLFlBQVksT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDckQsTUFBTSxDQUFDLElBQUksT0FBTyxFQUFFLFlBQVksTUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDdEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsOENBQThDLEVBQUU7UUFDakQsTUFBTSxDQUFDLHFDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDdkQsTUFBTSxDQUFDLHFDQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7UUFFckQsTUFBTSxDQUFDLHFDQUF5QixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDeEQsTUFBTSxDQUFDLHFDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDeEQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILG9DQUFvQztBQUNwQztJQUFBO0lBQWMsQ0FBQztJQUFELGFBQUM7QUFBRCxDQUFDLEFBQWYsSUFBZTtBQUNmO0lBQW9CLHlCQUFNO0lBQTFCOztJQUE0QixDQUFDO0lBQUQsWUFBQztBQUFELENBQUMsQUFBN0IsQ0FBb0IsTUFBTSxHQUFHO0FBRTdCLHFDQUFxQztBQUNyQyxJQUFNLE9BQU8sR0FBRyxxQkFBb0IsQ0FBdUIsQ0FBQztBQUM1RCxJQUFNLE1BQU0sR0FBRyxvQkFBbUIsQ0FBdUIsQ0FBQztBQUMxRCxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksT0FBTyxDQUFDO0FBQy9CLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyJ9