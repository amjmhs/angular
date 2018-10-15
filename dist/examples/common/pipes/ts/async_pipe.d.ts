/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Observable } from 'rxjs';
export declare class AsyncPromisePipeComponent {
    greeting: Promise<string> | null;
    arrived: boolean;
    private resolve;
    constructor();
    reset(): void;
    clicked(): void;
}
export declare class AsyncObservablePipeComponent {
    time: Observable<string>;
}
