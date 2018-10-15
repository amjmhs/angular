/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Subject } from 'rxjs';
export declare const patchDecodeBase64: (proto: {
    decodeBase64: typeof atob;
}) => () => void;
export declare class MockServiceWorkerContainer {
    private onControllerChange;
    private onMessage;
    mockRegistration: MockServiceWorkerRegistration | null;
    controller: MockServiceWorker | null;
    messages: Subject<{}>;
    notificationClicks: Subject<{}>;
    addEventListener(event: 'controllerchange' | 'message', handler: Function): void;
    removeEventListener(event: 'controllerchange', handler: Function): void;
    register(url: string): Promise<void>;
    getRegistration(): Promise<ServiceWorkerRegistration>;
    setupSw(url?: string): void;
    sendMessage(value: Object): void;
}
export declare class MockServiceWorker {
    private mock;
    readonly scriptURL: string;
    constructor(mock: MockServiceWorkerContainer, scriptURL: string);
    postMessage(value: Object): void;
}
export declare class MockServiceWorkerRegistration {
    pushManager: PushManager;
}
export declare class MockPushManager {
    private subscription;
    getSubscription(): Promise<PushSubscription | null>;
    subscribe(options?: PushSubscriptionOptionsInit): Promise<PushSubscription>;
}
export declare class MockPushSubscription {
    unsubscribe(): Promise<boolean>;
}
