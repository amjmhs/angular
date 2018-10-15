/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare function readCommandLine(extraOptions?: {
    [key: string]: any;
}): {
    'bundles': boolean;
};
export declare function openBrowser(config: {
    url: string;
    params?: {
        name: string;
        value: any;
    }[];
    ignoreBrowserSynchronization?: boolean;
}): void;
/**
 * @experimental This API will be moved to Protractor.
 */
export declare function verifyNoBrowserErrors(): void;
