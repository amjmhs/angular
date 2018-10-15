/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export interface Symbol {
    name: string;
}
export declare class SymbolExtractor {
    private path;
    private contents;
    actual: Symbol[];
    static symbolSort(a: Symbol, b: Symbol): number;
    static parse(path: string, contents: string): Symbol[];
    static diff(actual: Symbol[], expected: string | ((Symbol | string)[])): {
        [name: string]: string;
    };
    constructor(path: string, contents: string);
    expect(expectedSymbols: (string | Symbol)[]): void;
    compareAndPrintError(goldenFilePath: string, expected: string | ((Symbol | string)[])): boolean;
}
