/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { TableCell } from '../util';
export declare class TableComponent {
    data: TableCell[][];
    trackByIndex(index: number, item: any): number;
    getColor(row: number): SafeStyle;
}
export declare class AppModule {
    constructor(sanitizer: DomSanitizer);
}
