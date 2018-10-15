/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Filesystem } from '@angular/service-worker/config';
export declare class NodeFilesystem implements Filesystem {
    private base;
    constructor(base: string);
    list(_path: string): Promise<string[]>;
    read(_path: string): Promise<string>;
    hash(_path: string): Promise<string>;
    write(_path: string, contents: string): Promise<void>;
    private canonical;
}
