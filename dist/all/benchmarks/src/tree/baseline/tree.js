"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TreeComponent = /** @class */ (function () {
    function TreeComponent(_rootEl) {
        this._rootEl = _rootEl;
    }
    Object.defineProperty(TreeComponent.prototype, "data", {
        set: function (data) {
            if (!data.left) {
                this._destroy();
            }
            else if (this._renderNodes) {
                this._update(data, 0);
            }
            else {
                this._create(this._rootEl, data, 0);
            }
        },
        enumerable: true,
        configurable: true
    });
    TreeComponent.prototype._create = function (parentNode, dataNode, index) {
        if (!this._renderNodes) {
            this._renderNodes = new Array(dataNode.transitiveChildCount);
        }
        var span = document.createElement('span');
        if (dataNode.depth % 2 === 0) {
            span.style.backgroundColor = 'grey';
        }
        parentNode.appendChild(span);
        this._renderNodes[index] = span;
        this._updateNode(span, dataNode);
        if (dataNode.left) {
            var leftTree = document.createElement('tree');
            parentNode.appendChild(leftTree);
            this._create(leftTree, dataNode.left, index + 1);
        }
        if (dataNode.right) {
            var rightTree = document.createElement('tree');
            parentNode.appendChild(rightTree);
            this._create(rightTree, dataNode.right, index + dataNode.left.transitiveChildCount + 1);
        }
    };
    TreeComponent.prototype._updateNode = function (renderNode, dataNode) {
        renderNode.textContent = " " + dataNode.value + " ";
    };
    TreeComponent.prototype._update = function (dataNode, index) {
        this._updateNode(this._renderNodes[index], dataNode);
        if (dataNode.left) {
            this._update(dataNode.left, index + 1);
        }
        if (dataNode.right) {
            this._update(dataNode.right, index + dataNode.left.transitiveChildCount + 1);
        }
    };
    TreeComponent.prototype._destroy = function () {
        while (this._rootEl.lastChild)
            this._rootEl.lastChild.remove();
        this._renderNodes = null;
    };
    return TreeComponent;
}());
exports.TreeComponent = TreeComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvYmVuY2htYXJrcy9zcmMvdHJlZS9iYXNlbGluZS90cmVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBSUg7SUFHRSx1QkFBb0IsT0FBWTtRQUFaLFlBQU8sR0FBUCxPQUFPLENBQUs7SUFBRyxDQUFDO0lBRXBDLHNCQUFJLCtCQUFJO2FBQVIsVUFBUyxJQUFjO1lBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNkLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUNqQjtpQkFBTSxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ3ZCO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDckM7UUFDSCxDQUFDOzs7T0FBQTtJQUVPLCtCQUFPLEdBQWYsVUFBZ0IsVUFBZSxFQUFFLFFBQWtCLEVBQUUsS0FBYTtRQUNoRSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN0QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1NBQzlEO1FBRUQsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QyxJQUFJLFFBQVEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7U0FDckM7UUFDRCxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRWpDLElBQUksUUFBUSxDQUFDLElBQUksRUFBRTtZQUNqQixJQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2hELFVBQVUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDbEQ7UUFDRCxJQUFJLFFBQVEsQ0FBQyxLQUFLLEVBQUU7WUFDbEIsSUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNqRCxVQUFVLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDekY7SUFDSCxDQUFDO0lBRU8sbUNBQVcsR0FBbkIsVUFBb0IsVUFBZSxFQUFFLFFBQWtCO1FBQ3JELFVBQVUsQ0FBQyxXQUFXLEdBQUcsTUFBSSxRQUFRLENBQUMsS0FBSyxNQUFHLENBQUM7SUFDakQsQ0FBQztJQUVPLCtCQUFPLEdBQWYsVUFBZ0IsUUFBa0IsRUFBRSxLQUFhO1FBQy9DLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNyRCxJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFDakIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztTQUN4QztRQUNELElBQUksUUFBUSxDQUFDLEtBQUssRUFBRTtZQUNsQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDOUU7SUFDSCxDQUFDO0lBRU8sZ0NBQVEsR0FBaEI7UUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUztZQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQy9ELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQzNCLENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUExREQsSUEwREM7QUExRFksc0NBQWEifQ==