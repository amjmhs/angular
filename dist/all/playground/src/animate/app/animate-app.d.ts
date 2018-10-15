/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare class AnimateApp {
    items: number[];
    private _state;
    bgStatus: string;
    remove(item: number): void;
    reorderAndRemove(): void;
    bgStatusChanged(data: {
        [key: string]: string;
    }, phase: string): void;
    state: "start" | "active" | "void" | "default";
}
