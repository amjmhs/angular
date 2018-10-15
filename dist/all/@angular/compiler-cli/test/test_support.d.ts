/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as ng from '../index';
export declare function writeTempFile(name: string, contents: string): string;
export declare function makeTempDir(): string;
export interface TestSupport {
    basePath: string;
    write(fileName: string, content: string): void;
    writeFiles(...mockDirs: {
        [fileName: string]: string;
    }[]): void;
    createCompilerOptions(overrideOptions?: ng.CompilerOptions): ng.CompilerOptions;
    shouldExist(fileName: string): void;
    shouldNotExist(fileName: string): void;
}
export declare function setupBazelTo(basePath: string): void;
export declare function isInBazel(): boolean;
export declare function setup(): TestSupport;
export declare function expectNoDiagnostics(options: ng.CompilerOptions, diags: ng.Diagnostics): void;
export declare function expectNoDiagnosticsInProgram(options: ng.CompilerOptions, p: ng.Program): void;
