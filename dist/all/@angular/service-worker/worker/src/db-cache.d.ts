/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Adapter } from './adapter';
import { Database, Table } from './database';
/**
 * An implementation of a `Database` that uses the `CacheStorage` API to serialize
 * state within mock `Response` objects.
 */
export declare class CacheDatabase implements Database {
    private scope;
    private adapter;
    private tables;
    constructor(scope: ServiceWorkerGlobalScope, adapter: Adapter);
    'delete'(name: string): Promise<boolean>;
    list(): Promise<string[]>;
    open(name: string): Promise<Table>;
}
/**
 * A `Table` backed by a `Cache`.
 */
export declare class CacheTable implements Table {
    readonly table: string;
    private cache;
    private adapter;
    constructor(table: string, cache: Cache, adapter: Adapter);
    private request;
    'delete'(key: string): Promise<boolean>;
    keys(): Promise<string[]>;
    read(key: string): Promise<any>;
    write(key: string, value: Object): Promise<void>;
}
