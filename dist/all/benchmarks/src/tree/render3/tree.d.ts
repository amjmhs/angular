/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵRenderFlags as RenderFlags } from '@angular/core';
import { TreeNode } from '../util';
export declare function destroyDom(component: TreeComponent): void;
export declare function createDom(component: TreeComponent): void;
export declare function detectChanges(component: TreeComponent): void;
export declare class TreeComponent {
    data: TreeNode;
    /** @nocollapse */
    static ngComponentDef: never;
}
export declare class TreeFunction {
    data: TreeNode;
    /** @nocollapse */
    static ngComponentDef: never;
}
export declare function TreeTpl(rf: RenderFlags, ctx: TreeNode): void;
