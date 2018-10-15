/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter } from '@angular/core';
export declare class BankAccountComponent {
    bankName: string | null;
    id: string | null;
    normalizedBankName: string | null;
}
export declare class MyInputComponent {
}
export declare class IntervalDirComponent {
    everySecond: EventEmitter<string>;
    fiveSecs: EventEmitter<string>;
    constructor();
}
export declare class MyOutputComponent {
    onEverySecond(): void;
    onEveryFiveSeconds(): void;
}
