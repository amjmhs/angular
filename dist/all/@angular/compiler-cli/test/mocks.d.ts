/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as ts from 'typescript';
export declare type Entry = string | Directory;
export interface Directory {
    [name: string]: Entry;
}
export declare class MockAotContext {
    currentDirectory: string;
    private files;
    constructor(currentDirectory: string, ...files: Entry[]);
    fileExists(fileName: string): boolean;
    directoryExists(path: string): boolean;
    readFile(fileName: string): string;
    readResource(fileName: string): Promise<string>;
    writeFile(fileName: string, data: string): void;
    assumeFileExists(fileName: string): void;
    getEntry(fileName: string | string[]): Entry | undefined;
    getDirectories(path: string): string[];
    override(files: Entry): MockAotContext;
}
export declare class MockCompilerHost implements ts.CompilerHost {
    private context;
    constructor(context: MockAotContext);
    fileExists(fileName: string): boolean;
    readFile(fileName: string): string;
    directoryExists(directoryName: string): boolean;
    getSourceFile(fileName: string, languageVersion: ts.ScriptTarget, onError?: (message: string) => void): ts.SourceFile;
    getDefaultLibFileName(options: ts.CompilerOptions): string;
    writeFile: ts.WriteFileCallback;
    getCurrentDirectory(): string;
    getCanonicalFileName(fileName: string): string;
    useCaseSensitiveFileNames(): boolean;
    getNewLine(): string;
    getDirectories(path: string): string[];
}
