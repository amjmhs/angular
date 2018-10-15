/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare const CreateBtn = "#createDom";
export declare const DestroyBtn = "#destroyDom";
export declare const DetectChangesBtn = "#detectChanges";
export declare const RootEl = "#root";
export declare const NumberOfChecksEl = "#numberOfChecks";
export interface Benchmark {
    id: string;
    url: string;
    buttons: string[];
    ignoreBrowserSynchronization?: boolean;
    extraParams?: {
        name: string;
        value: any;
    }[];
}
export declare const Benchmarks: Benchmark[];
