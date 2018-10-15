/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
declare global {
    namespace jasmine {
        interface Matchers<T> {
            toBeAHero(): Promise<void>;
            toHaveName(exectedName: string): Promise<void>;
        }
    }
}
export declare function addCustomMatchers(): void;
