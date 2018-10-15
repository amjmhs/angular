/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Adapter } from './adapter';
import { DebugLogger } from './api';
export interface IdleTask {
    run: () => Promise<void>;
    desc: string;
}
export declare class IdleScheduler {
    private adapter;
    private threshold;
    private debug;
    private queue;
    private scheduled;
    empty: Promise<void>;
    private emptyResolve;
    lastTrigger: number | null;
    lastRun: number | null;
    constructor(adapter: Adapter, threshold: number, debug: DebugLogger);
    trigger(): Promise<void>;
    execute(): Promise<void>;
    schedule(desc: string, run: () => Promise<void>): void;
    readonly size: number;
    readonly taskDescriptions: string[];
}
