/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentDefInternal } from '@angular/core/src/render3/interfaces/definition';
import { TableCell } from '../util';
export declare class LargeTableComponent {
    data: TableCell[][];
    /** @nocollapse */
    static ngComponentDef: ComponentDefInternal<LargeTableComponent>;
}
export declare function destroyDom(component: LargeTableComponent): void;
export declare function createDom(component: LargeTableComponent): void;
