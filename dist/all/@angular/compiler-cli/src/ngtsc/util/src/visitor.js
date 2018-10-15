"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
/**
 * Visit a node with the given visitor and return a transformed copy.
 */
function visit(node, visitor, context) {
    return visitor._visit(node, context);
}
exports.visit = visit;
/**
 * Abstract base class for visitors, which processes certain nodes specially to allow insertion
 * of other nodes before them.
 */
var Visitor = /** @class */ (function () {
    function Visitor() {
        /**
         * Maps statements to an array of statements that should be inserted before them.
         */
        this._before = new Map();
    }
    /**
     * Visit a class declaration, returning at least the transformed declaration and optionally other
     * nodes to insert before the declaration.
     */
    Visitor.prototype.visitClassDeclaration = function (node) {
        return { node: node };
    };
    Visitor.prototype._visitListEntryNode = function (node, visitor) {
        var result = visitor(node);
        if (result.before !== undefined) {
            // Record that some nodes should be inserted before the given declaration. The declaration's
            // parent's _visit call is responsible for performing this insertion.
            this._before.set(result.node, result.before);
        }
        return result.node;
    };
    /**
     * Visit types of nodes which don't have their own explicit visitor.
     */
    Visitor.prototype.visitOtherNode = function (node) { return node; };
    /**
     * @internal
     */
    Visitor.prototype._visit = function (node, context) {
        var _this = this;
        // First, visit the node. visitedNode starts off as `null` but should be set after visiting
        // is completed.
        var visitedNode = null;
        node = ts.visitEachChild(node, function (child) { return _this._visit(child, context); }, context);
        if (ts.isClassDeclaration(node)) {
            visitedNode = this._visitListEntryNode(node, function (node) { return _this.visitClassDeclaration(node); });
        }
        else {
            visitedNode = this.visitOtherNode(node);
        }
        // If the visited node has a `statements` array then process them, maybe replacing the visited
        // node and adding additional statements.
        if (hasStatements(visitedNode)) {
            visitedNode = this._maybeProcessStatements(visitedNode);
        }
        return visitedNode;
    };
    Visitor.prototype._maybeProcessStatements = function (node) {
        var _this = this;
        // Shortcut - if every statement doesn't require nodes to be prepended, this is a no-op.
        if (node.statements.every(function (stmt) { return !_this._before.has(stmt); })) {
            return node;
        }
        // There are statements to prepend, so clone the original node.
        var clone = ts.getMutableClone(node);
        // Build a new list of statements and patch it onto the clone.
        var newStatements = [];
        clone.statements.forEach(function (stmt) {
            if (_this._before.has(stmt)) {
                newStatements.push.apply(newStatements, _this._before.get(stmt));
                _this._before.delete(stmt);
            }
            newStatements.push(stmt);
        });
        clone.statements = ts.createNodeArray(newStatements, node.statements.hasTrailingComma);
        return clone;
    };
    return Visitor;
}());
exports.Visitor = Visitor;
function hasStatements(node) {
    var block = node;
    return block.statements !== undefined && Array.isArray(block.statements);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlzaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvdXRpbC9zcmMvdmlzaXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtCQUFpQztBQVdqQzs7R0FFRztBQUNILGVBQ0ksSUFBTyxFQUFFLE9BQWdCLEVBQUUsT0FBaUM7SUFDOUQsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBSEQsc0JBR0M7QUFFRDs7O0dBR0c7QUFDSDtJQUFBO1FBQ0U7O1dBRUc7UUFDSyxZQUFPLEdBQUcsSUFBSSxHQUFHLEVBQTJCLENBQUM7SUEyRXZELENBQUM7SUF6RUM7OztPQUdHO0lBQ0gsdUNBQXFCLEdBQXJCLFVBQXNCLElBQXlCO1FBRTdDLE9BQU8sRUFBQyxJQUFJLE1BQUEsRUFBQyxDQUFDO0lBQ2hCLENBQUM7SUFFTyxxQ0FBbUIsR0FBM0IsVUFDSSxJQUFPLEVBQUUsT0FBMkQ7UUFDdEUsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDL0IsNEZBQTRGO1lBQzVGLHFFQUFxRTtZQUNyRSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM5QztRQUNELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxnQ0FBYyxHQUFkLFVBQWtDLElBQU8sSUFBTyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFOUQ7O09BRUc7SUFDSCx3QkFBTSxHQUFOLFVBQTBCLElBQU8sRUFBRSxPQUFpQztRQUFwRSxpQkFxQkM7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