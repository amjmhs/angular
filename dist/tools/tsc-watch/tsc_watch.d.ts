/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference types="node" />
export declare const TSC: string;
export declare type Command = (stdIn: any, stdErr: any) => Promise<number>;
export declare class TscWatch {
    private tsconfig;
    private start;
    private error;
    private complete;
    private onStartCmds;
    private onChangeCmds;
    private state;
    private triggered;
    private runOnce;
    constructor({ tsconfig, start, error, complete, onStartCmds, onChangeCmds }: {
        tsconfig: string | string[];
        error: string | RegExp;
        start: string;
        complete: string;
        onStartCmds?: Array<string[] | Command>;
        onChangeCmds?: Array<string[] | Command>;
    });
    watch(): void;
    private runCmd;
    run(): void;
    runCmdsOnly(): void;
    consumeLine(buffer: Buffer, isStdError: boolean): void;
    triggerCmds(): void;
}
export declare function reportError(e: any): Promise<never>;
