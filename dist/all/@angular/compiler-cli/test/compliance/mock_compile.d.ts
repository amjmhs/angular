/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AotCompilerOptions } from '@angular/compiler';
import { MockData, MockDirectory } from '@angular/compiler/test/aot/test_util';
export declare function expectEmit(source: string, expected: string, description: string, assertIdentifiers?: {
    [name: string]: RegExp;
}): void;
export declare function compile(data: MockDirectory, angularFiles: MockData, options?: AotCompilerOptions, errorCollector?: (error: any, fileName?: string) => void): {
    source: string;
};
