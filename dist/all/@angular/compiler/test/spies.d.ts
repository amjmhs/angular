/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ResourceLoader } from '@angular/compiler/src/resource_loader';
import { SpyObject } from '@angular/core/testing/src/testing_internal';
export declare class SpyResourceLoader extends SpyObject {
    static PROVIDE: {
        provide: typeof ResourceLoader;
        useClass: typeof SpyResourceLoader;
        deps: never[];
    };
    constructor();
}
