"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A path is an ordered set of elements. Typically a path is to  a
 * particular offset in a source file. The head of the list is the top
 * most node. The tail is the node that contains the offset directly.
 *
 * For example, the expression `a + b + c` might have an ast that looks
 * like:
 *     +
 *    / \
 *   a   +
 *      / \
 *     b   c
 *
 * The path to the node at offset 9 would be `['+' at 1-10, '+' at 7-10,
 * 'c' at 9-10]` and the path the node at offset 1 would be
 * `['+' at 1-10, 'a' at 1-2]`.
 */
var AstPath = /** @class */ (function () {
    function AstPath(path, position) {
        if (position === void 0) { position = -1; }
        this.path = path;
        this.position = position;
    }
    Object.defineProperty(AstPath.prototype, "empty", {
        get: function () { return !this.path || !this.path.length; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AstPath.prototype, "head", {
        get: function () { return this.path[0]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AstPath.prototype, "tail", {
        get: function () { return this.path[this.path.length - 1]; },
        enumerable: true,
        configurable: true
    });
    AstPath.prototype.parentOf = function (node) {
        return node && this.path[this.path.indexOf(node) - 1];
    };
    AstPath.prototype.childOf = function (node) { return this.path[this.path.indexOf(node) + 1]; };
    AstPath.prototype.first = function (ctor) {
        for (var i = this.path.length - 1; i >= 0; i--) {
            var item = this.path[i];
            if (item instanceof ctor)
                return item;
        }
    };
    AstPath.prototype.push = function (node) { this.path.push(node); };
    AstPath.prototype.pop = function () { return this.path.pop(); };
    return AstPath;
}());
exports.AstPath = AstPath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0X3BhdGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvYXN0X3BhdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSDs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUNIO0lBQ0UsaUJBQW9CLElBQVMsRUFBUyxRQUFxQjtRQUFyQix5QkFBQSxFQUFBLFlBQW9CLENBQUM7UUFBdkMsU0FBSSxHQUFKLElBQUksQ0FBSztRQUFTLGFBQVEsR0FBUixRQUFRLENBQWE7SUFBRyxDQUFDO0lBRS9ELHNCQUFJLDBCQUFLO2FBQVQsY0FBdUIsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ2hFLHNCQUFJLHlCQUFJO2FBQVIsY0FBMEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDaEQsc0JBQUkseUJBQUk7YUFBUixjQUEwQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUVuRSwwQkFBUSxHQUFSLFVBQVMsSUFBaUI7UUFDeEIsT0FBTyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBQ0QseUJBQU8sR0FBUCxVQUFRLElBQU8sSUFBaUIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVoRix1QkFBSyxHQUFMLFVBQW1CLElBQStCO1FBQ2hELEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDOUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLElBQUksWUFBWSxJQUFJO2dCQUFFLE9BQVUsSUFBSSxDQUFDO1NBQzFDO0lBQ0gsQ0FBQztJQUVELHNCQUFJLEdBQUosVUFBSyxJQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXZDLHFCQUFHLEdBQUgsY0FBVyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLGNBQUM7QUFBRCxDQUFDLEFBdEJELElBc0JDO0FBdEJZLDBCQUFPIn0=