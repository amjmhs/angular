/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { PerfLogEvent } from '../index';
export declare class TraceEventFactory {
    private _cat;
    private _pid;
    constructor(_cat: string, _pid: string);
    create(ph: any, name: string, time: number, args?: any): PerfLogEvent;
    markStart(name: string, time: number): PerfLogEvent;
    markEnd(name: string, time: number): PerfLogEvent;
    start(name: string, time: number, args?: any): PerfLogEvent;
    end(name: string, time: number, args?: any): PerfLogEvent;
    instant(name: string, time: number, args?: any): PerfLogEvent;
    complete(name: string, time: number, duration: number, args?: any): PerfLogEvent;
}
