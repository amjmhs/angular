/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { StaticProvider } from '@angular/core';
import { WebDriverAdapter } from '../web_driver_adapter';
import { PerfLogEvent, PerfLogFeatures, WebDriverExtension } from '../web_driver_extension';
/**
 * Set the following 'traceCategories' to collect metrics in Chrome:
 * 'v8,blink.console,disabled-by-default-devtools.timeline,devtools.timeline,blink.user_timing'
 *
 * In order to collect the frame rate related metrics, add 'benchmark'
 * to the list above.
 */
export declare class ChromeDriverExtension extends WebDriverExtension {
    private _driver;
    static PROVIDERS: StaticProvider;
    private _majorChromeVersion;
    private _firstRun;
    constructor(_driver: WebDriverAdapter, userAgent: string);
    private _parseChromeVersion;
    gc(): Promise<any>;
    timeBegin(name: string): Promise<any>;
    timeEnd(name: string, restartName?: string | null): Promise<any>;
    readPerfLog(): Promise<PerfLogEvent[]>;
    private _convertPerfRecordsToEvents;
    private _convertEvent;
    private _parseCategories;
    private _isEvent;
    perfLogFeatures(): PerfLogFeatures;
    supports(capabilities: {
        [key: string]: any;
    }): boolean;
}
