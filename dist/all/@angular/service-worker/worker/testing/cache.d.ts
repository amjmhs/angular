/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export interface DehydratedResponse {
    body: string | null;
    status: number;
    statusText: string;
    headers: {
        [name: string]: string;
    };
}
export declare type DehydratedCache = {
    [url: string]: DehydratedResponse;
};
export declare type DehydratedCacheStorage = {
    [name: string]: DehydratedCache;
};
export declare class MockCacheStorage implements CacheStorage {
    private origin;
    private caches;
    constructor(origin: string, hydrateFrom?: string);
    has(name: string): Promise<boolean>;
    keys(): Promise<string[]>;
    open(name: string): Promise<Cache>;
    match(req: Request): Promise<Response | undefined>;
    'delete'(name: string): Promise<boolean>;
    dehydrate(): string;
}
export declare class MockCache {
    private origin;
    private cache;
    constructor(origin: string, hydrated?: DehydratedCache);
    add(request: RequestInfo): Promise<void>;
    addAll(requests: RequestInfo[]): Promise<void>;
    'delete'(request: RequestInfo): Promise<boolean>;
    keys(match?: Request | string): Promise<string[]>;
    match(request: RequestInfo, options?: CacheQueryOptions): Promise<Response>;
    matchAll(request?: Request | string, options?: CacheQueryOptions): Promise<Response[]>;
    put(request: RequestInfo, response: Response): Promise<void>;
    dehydrate(): DehydratedCache;
}
export declare function clearAllCaches(caches: CacheStorage): Promise<void>;
