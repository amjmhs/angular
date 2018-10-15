/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as ts from 'typescript';
/**
 * Result type of visiting a node that's typically an entry in a list, which allows specifying that
 * nodes should be added before the visited node in the output.
 */
export declare type VisitListEntryResult<B extends ts.Node, T extends B> = {
    node: T;
    before?: B[];
};
/**
 * Visit a node with the given visitor and return a transformed copy.
 */
export declare function visit<T extends ts.Node>(node: T, visitor: Visitor, context: ts.TransformationContext): T;
/**
 * Abstract base class for visitors, which processes certain nodes specially to allow insertion
 * of other nodes before them.
 */
export declare abstract class Visitor {
    /**
     * Maps statements to an array of statements that should be inserted before them.
     */
    private _before;
    /**
     * Visit a class declaration, returning at least the transformed declaration and optionally other
     * nodes to insert before the declaration.
     */
    visitClassDeclaration(node: ts.ClassDeclaration): VisitListEntryResult<ts.Statement, ts.ClassDeclaration>;
    private _visitListEntryNode;
    /**
     * Visit types of nodes which don't have their own explicit visitor.
     */
    visitOtherNode<T extends ts.Node>(node: T): T;
    /**
     * @internal
     */
    _visit<T extends ts.Node>(node: T, context: ts.TransformationContext): T;
    private _maybeProcessStatements;
}
