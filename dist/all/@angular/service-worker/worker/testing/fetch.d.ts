/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare class MockBody implements Body {
    _body: string | null;
    bodyUsed: boolean;
    constructor(_body: string | null);
    arrayBuffer(): Promise<ArrayBuffer>;
    blob(): Promise<Blob>;
    json(): Promise<any>;
    text(): Promise<string>;
    formData(): Promise<FormData>;
    private markBodyUsed;
}
export declare class MockHeaders implements Headers {
    map: Map<string, string>;
    [Symbol.iterator](): IterableIterator<[string, string]>;
    append(name: string, value: string): void;
    delete(name: string): void;
    entries(): IterableIterator<[string, string]>;
    forEach(callback: Function): void;
    get(name: string): string | null;
    has(name: string): boolean;
    keys(): IterableIterator<string>;
    set(name: string, value: string): void;
    values(): IterableIterator<string>;
}
export declare class MockRequest extends MockBody implements Request {
    readonly cache: RequestCache;
    readonly credentials: RequestCredentials;
    readonly destination: RequestDestination;
    readonly headers: Headers;
    readonly integrity: string;
    readonly keepalive: boolean;
    readonly method: string;
    readonly mode: RequestMode;
    readonly redirect: RequestRedirect;
    readonly referrer: string;
    readonly referrerPolicy: ReferrerPolicy;
    readonly type: RequestType;
    readonly signal: AbortSignal;
    url: string;
    constructor(input: string | Request, init?: RequestInit);
    clone(): Request;
}
export declare class MockResponse extends MockBody implements Response {
    readonly headers: Headers;
    readonly ok: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly type: ResponseType;
    readonly url: string;
    readonly body: ReadableStream | null;
    readonly redirected: boolean;
    constructor(body?: any, init?: ResponseInit & {
        type?: ResponseType;
        redirected?: boolean;
        url?: string;
    });
    clone(): Response;
}
