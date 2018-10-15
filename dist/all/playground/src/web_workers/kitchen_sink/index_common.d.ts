/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, Renderer } from '@angular/core';
export declare class GreetingService {
    greeting: string;
}
export declare class RedDec {
    constructor(el: ElementRef, renderer: Renderer);
}
export declare class HelloCmp {
    greeting: string;
    lastKey: string;
    constructor(service: GreetingService);
    changeGreeting(): void;
    onKeyDown(event: KeyboardEvent): void;
}
