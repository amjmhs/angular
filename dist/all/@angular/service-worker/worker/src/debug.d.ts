/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Adapter } from './adapter';
import { DebugLogger, Debuggable } from './api';
export declare class DebugHandler implements DebugLogger {
    readonly driver: Debuggable;
    readonly adapter: Adapter;
    private debugLogA;
    private debugLogB;
    constructor(driver: Debuggable, adapter: Adapter);
    handleFetch(req: Request): Promise<Response>;
    since(time: number | null): string;
    log(value: string | Error, context?: string): void;
    private errorToString;
    private formatDebugLog;
}
