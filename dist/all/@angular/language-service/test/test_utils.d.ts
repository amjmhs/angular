/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference types="node" />
import * as path from 'path';
import * as ts from 'typescript';
import { Diagnostic, DiagnosticMessageChain, Diagnostics, Span } from '../src/types';
export declare type MockData = string | MockDirectory;
export declare type MockDirectory = {
    [name: string]: MockData | undefined;
};
/**
 * The cache is valid if all the returned entries are empty.
 */
export declare function validateCache(): {
    exists: string[];
    unused: string[];
    reported: string[];
};
export declare class MockTypescriptHost implements ts.LanguageServiceHost {
    private scriptNames;
    private data;
    private node_modules;
    private myPath;
    private angularPath;
    private nodeModulesPath;
    private scriptVersion;
    private overrides;
    private projectVersion;
    private options;
    private overrideDirectory;
    constructor(scriptNames: string[], data: MockData, node_modules?: string, myPath?: typeof path);
    override(fileName: string, content: string): void;
    addScript(fileName: string, content: string): void;
    forgetAngular(): void;
    overrideOptions(cb: (options: ts.CompilerOptions) => ts.CompilerOptions): void;
    getCompilationSettings(): ts.CompilerOptions;
    getProjectVersion(): string;
    getScriptFileNames(): string[];
    getScriptVersion(fileName: string): string;
    getScriptSnapshot(fileName: string): ts.IScriptSnapshot | undefined;
    getCurrentDirectory(): string;
    getDefaultLibFileName(options: ts.CompilerOptions): string;
    directoryExists(directoryName: string): boolean;
    fileExists(fileName: string): boolean;
    getMarkerLocations(fileName: string): {
        [name: string]: number;
    } | undefined;
    getReferenceMarkers(fileName: string): ReferenceResult | undefined;
    getFileContent(fileName: string): string | undefined;
    private getRawFileContent;
    private getEffectiveName;
}
export declare type ReferenceMarkers = {
    [name: string]: Span[];
};
export interface ReferenceResult {
    text: string;
    definitions: ReferenceMarkers;
    references: ReferenceMarkers;
}
export declare function noDiagnostics(diagnostics: Diagnostics): void;
export declare function diagnosticMessageContains(message: string | DiagnosticMessageChain, messageFragment: string): boolean;
export declare function findDiagnostic(diagnostics: Diagnostic[], messageFragment: string): Diagnostic | undefined;
export declare function includeDiagnostic(diagnostics: Diagnostics, message: string, text?: string, len?: string): void;
export declare function includeDiagnostic(diagnostics: Diagnostics, message: string, at?: number, len?: number): void;
