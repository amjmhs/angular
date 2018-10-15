/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { TableCell } from '../util';
export declare class TableComponent {
    private _rootEl;
    private _renderCells;
    constructor(_rootEl: any);
    data: TableCell[][];
    private _destroy;
    private _update;
    private _updateCell;
    private _create;
}
