"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var TreeNode = /** @class */ (function () {
    function TreeNode(value, depth, maxDepth, left, right) {
        this.value = value;
        this.depth = depth;
        this.maxDepth = maxDepth;
        this.left = left;
        this.right = right;
        this.transitiveChildCount = Math.pow(2, (this.maxDepth - this.depth + 1)) - 1;
        this.children = this.left ? [this.left, this.right] : [];
    }
    Object.defineProperty(TreeNode.prototype, "style", {
        // Needed for Polymer as it does not support ternary nor modulo operator
        // in expressions
        get: function () { return this.depth % 2 === 0 ? 'background-color: grey' : ''; },
        enumerable: true,
        configurable: true
    });
    return TreeNode;
}());
exports.TreeNode = TreeNode;
var treeCreateCount;
var numberData;
var charData;
init();
function init() {
    exports.maxDepth = util_1.getIntParameter('depth');
    treeCreateCount = 0;
    numberData = _buildTree(0, numberValues);
    charData = _buildTree(0, charValues);
}
function _buildTree(currDepth, valueFn) {
    var children = currDepth < exports.maxDepth ? _buildTree(currDepth + 1, valueFn) : null;
    return new TreeNode(valueFn(currDepth), currDepth, exports.maxDepth, children, children);
}
exports.emptyTree = new TreeNode('', 0, 0, null, null);
function buildTree() {
    treeCreateCount++;
    return treeCreateCount % 2 ? numberData : charData;
}
exports.buildTree = buildTree;
function numberValues(depth) {
    return depth.toString();
}
function charValues(depth) {
    return String.fromCharCode('A'.charCodeAt(0) + (depth % 26));
}
function flattenTree(node, target) {
    if (target === void 0) { target = []; }
    target.push(node);
    if (node.left) {
        flattenTree(node.left, target);
    }
    if (node.right) {
        flattenTree(node.right, target);
    }
    return target;
}
exports.flattenTree = flattenTree;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvYmVuY2htYXJrcy9zcmMvdHJlZS91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsZ0NBQXdDO0FBRXhDO0lBSUUsa0JBQ1csS0FBYSxFQUFTLEtBQWEsRUFBUyxRQUFnQixFQUM1RCxJQUFtQixFQUFTLEtBQW9CO1FBRGhELFVBQUssR0FBTCxLQUFLLENBQVE7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUM1RCxTQUFJLEdBQUosSUFBSSxDQUFlO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBZTtRQUN6RCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDN0QsQ0FBQztJQUlELHNCQUFJLDJCQUFLO1FBRlQsd0VBQXdFO1FBQ3hFLGlCQUFpQjthQUNqQixjQUFzQixPQUFPLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ3RGLGVBQUM7QUFBRCxDQUFDLEFBZEQsSUFjQztBQWRZLDRCQUFRO0FBZ0JyQixJQUFJLGVBQXVCLENBQUM7QUFFNUIsSUFBSSxVQUFvQixDQUFDO0FBQ3pCLElBQUksUUFBa0IsQ0FBQztBQUV2QixJQUFJLEVBQUUsQ0FBQztBQUVQO0lBQ0UsZ0JBQVEsR0FBRyxzQkFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3BDLGVBQWUsR0FBRyxDQUFDLENBQUM7SUFDcEIsVUFBVSxHQUFHLFVBQVUsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDekMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUVELG9CQUFvQixTQUFpQixFQUFFLE9BQWtDO0lBQ3ZFLElBQU0sUUFBUSxHQUFHLFNBQVMsR0FBRyxnQkFBUSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ2xGLE9BQU8sSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxnQkFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNuRixDQUFDO0FBRVksUUFBQSxTQUFTLEdBQUcsSUFBSSxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBRTVEO0lBQ0UsZUFBZSxFQUFFLENBQUM7SUFDbEIsT0FBTyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztBQUNyRCxDQUFDO0FBSEQsOEJBR0M7QUFFRCxzQkFBc0IsS0FBYTtJQUNqQyxPQUFPLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUMxQixDQUFDO0FBRUQsb0JBQW9CLEtBQWE7SUFDL0IsT0FBTyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvRCxDQUFDO0FBRUQscUJBQTRCLElBQWMsRUFBRSxNQUF1QjtJQUF2Qix1QkFBQSxFQUFBLFdBQXVCO0lBQ2pFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEIsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ2IsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDaEM7SUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDZCxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztLQUNqQztJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFURCxrQ0FTQyJ9