/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
declare const Cc: any, Ci: any, Cu: any;
declare const os: any;
declare const ParserUtil: any;
declare class Profiler {
    private _profiler;
    private _markerEvents;
    private _profilerStartTime;
    constructor();
    start(entries: any, interval: any, features: any, timeStarted: any): void;
    stop(): void;
    getProfilePerfEvents(): any;
    /** @internal */
    private _mergeMarkerEvents;
    addStartEvent(name: string, timeStarted: number): void;
    addEndEvent(name: string, timeEnded: number): void;
}
declare function forceGC(): void;
declare const mod: any;
declare const data: any;
declare const profiler: Profiler;
