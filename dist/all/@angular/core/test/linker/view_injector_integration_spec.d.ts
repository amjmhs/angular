/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { PipeTransform } from '@angular/core';
export declare class PipeNeedsService implements PipeTransform {
    service: any;
    constructor(service: any);
    transform(value: any): any;
}
export declare class DuplicatePipe1 implements PipeTransform {
    transform(value: any): any;
}
export declare class DuplicatePipe2 implements PipeTransform {
    transform(value: any): any;
}
