/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare function async_beforeAll(fn: () => Promise<void>): void;
export declare function async_beforeEach(fn: () => Promise<void>): void;
export declare function async_it(desc: string, fn: () => Promise<void>): void;
export declare function async_fit(desc: string, fn: () => Promise<void>): void;
