/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { SpyObject } from '@angular/core/testing/src/testing_internal';
export declare class SpyApplicationRef extends SpyObject {
    constructor();
}
export declare class SpyComponentRef extends SpyObject {
    injector: any /** TODO #9100 */;
    constructor();
}
export declare function callNgProfilerTimeChangeDetection(config?: any /** TODO #9100 */): void;
