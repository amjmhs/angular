/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ArgumentType, NodeCheckFn, NodeDef, ViewData, ViewDefinition, ViewDefinitionFactory, ViewFlags, ViewUpdateFn } from '@angular/core/src/view/index';
export declare function isBrowser(): boolean;
export declare const ARG_TYPE_VALUES: ArgumentType[];
export declare function checkNodeInlineOrDynamic(check: NodeCheckFn, view: ViewData, nodeIndex: number, argType: ArgumentType, values: any[]): any;
export declare function createRootView(def: ViewDefinition, context?: any, projectableNodes?: any[][], rootSelectorOrNode?: any): ViewData;
export declare function createEmbeddedView(parent: ViewData, anchorDef: NodeDef, context?: any): ViewData;
export declare function compViewDef(nodes: NodeDef[], updateDirectives?: null | ViewUpdateFn, updateRenderer?: null | ViewUpdateFn, viewFlags?: ViewFlags): ViewDefinition;
export declare function compViewDefFactory(nodes: NodeDef[], updateDirectives?: null | ViewUpdateFn, updateRenderer?: null | ViewUpdateFn, viewFlags?: ViewFlags): ViewDefinitionFactory;
export declare function createAndGetRootNodes(viewDef: ViewDefinition, ctx?: any): {
    rootNodes: any[];
    view: ViewData;
};
export declare function recordNodeToRemove(node: Node): void;
export declare function callMostRecentEventListenerHandler(spy: any, params: any): void;
