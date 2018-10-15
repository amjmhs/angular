/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare class MockScriptElement {
    constructor();
    listeners: {
        load?: (event: Event) => void;
        error?: (err: Error) => void;
    };
    addEventListener(event: 'load' | 'error', handler: Function): void;
    removeEventListener(event: 'load' | 'error'): void;
}
export declare class MockDocument {
    mock: MockScriptElement | null;
    readonly body: any;
    createElement(tag: 'script'): HTMLScriptElement;
    appendChild(node: any): void;
    removeNode(node: any): void;
    mockLoad(): void;
    mockError(err: Error): void;
}
