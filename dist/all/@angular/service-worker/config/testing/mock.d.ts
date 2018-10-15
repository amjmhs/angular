/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Filesystem } from '../src/filesystem';
export declare class MockFilesystem implements Filesystem {
    private files;
    constructor(files: {
        [name: string]: string | undefined;
    });
    list(dir: string): Promise<string[]>;
    read(path: string): Promise<string>;
    hash(path: string): Promise<string>;
    write(path: string, contents: string): Promise<void>;
}
