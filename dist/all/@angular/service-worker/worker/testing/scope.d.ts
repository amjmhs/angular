/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Subject } from 'rxjs';
import { Adapter, Context } from '../src/adapter';
import { AssetGroupConfig, Manifest } from '../src/manifest';
import { MockCacheStorage } from './cache';
import { MockServerState } from './mock';
export declare class MockClient {
    readonly id: string;
    queue: Subject<Object>;
    constructor(id: string);
    readonly messages: Object[];
    postMessage(message: Object): void;
}
export declare class SwTestHarnessBuilder {
    private server;
    private caches;
    withCacheState(cache: string): SwTestHarnessBuilder;
    withServerState(state: MockServerState): SwTestHarnessBuilder;
    build(): SwTestHarness;
}
export declare class MockClients implements Clients {
    private clients;
    add(clientId: string): void;
    remove(clientId: string): void;
    get(id: string): Promise<Client>;
    getMock(id: string): MockClient | undefined;
    matchAll(): Promise<Client[]>;
    claim(): Promise<any>;
}
export declare class SwTestHarness implements ServiceWorkerGlobalScope, Adapter, Context {
    private server;
    readonly caches: MockCacheStorage;
    readonly clients: MockClients;
    private eventHandlers;
    private skippedWaiting;
    private selfMessageQueue;
    unregistered: boolean;
    readonly notifications: {
        title: string;
        options: Object;
    }[];
    readonly registration: ServiceWorkerRegistration;
    static envIsSupported(): boolean;
    time: number;
    private timers;
    constructor(server: MockServerState, caches: MockCacheStorage);
    resolveSelfMessages(): Promise<void>;
    startup(firstTime?: boolean): Promise<boolean | null>;
    updateServerState(server?: MockServerState): void;
    fetch(req: string | Request): Promise<Response>;
    addEventListener(event: string, handler: Function): void;
    removeEventListener(event: string, handler?: Function): void;
    newRequest(url: string, init?: Object): Request;
    newResponse(body: string, init?: Object): Response;
    newHeaders(headers: {
        [name: string]: string;
    }): Headers;
    parseUrl(url: string, relativeTo: string): {
        origin: string;
        path: string;
    };
    skipWaiting(): Promise<void>;
    waitUntil(promise: Promise<void>): void;
    handleFetch(req: Request, clientId?: string | null): [Promise<Response | undefined>, Promise<void>];
    handleMessage(data: Object, clientId: string | null): Promise<void>;
    handlePush(data: Object): Promise<void>;
    handleClick(notification: Object, action?: string): Promise<void>;
    timeout(ms: number): Promise<void>;
    advance(by: number): void;
    isClient(obj: any): obj is Client;
}
export declare class AssetGroupBuilder {
    private up;
    readonly name: string;
    constructor(up: ConfigBuilder, name: string);
    private files;
    addFile(url: string, contents: string, hashed?: boolean): AssetGroupBuilder;
    finish(): ConfigBuilder;
    toManifestGroup(): AssetGroupConfig;
}
export declare class ConfigBuilder {
    assetGroups: Map<string, AssetGroupBuilder>;
    addAssetGroup(name: string): ConfigBuilder;
    finish(): Manifest;
}
