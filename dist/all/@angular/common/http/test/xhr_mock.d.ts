/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { XhrFactory } from '../src/xhr';
export declare class MockXhrFactory implements XhrFactory {
    mock: MockXMLHttpRequest;
    build(): XMLHttpRequest;
}
export declare class MockXMLHttpRequestUpload {
    private mock;
    constructor(mock: MockXMLHttpRequest);
    addEventListener(event: 'progress', handler: Function): void;
    removeEventListener(event: 'progress', handler: Function): void;
}
export declare class MockXMLHttpRequest {
    body: any;
    method: string;
    url: string;
    mockHeaders: {
        [key: string]: string;
    };
    mockAborted: boolean;
    withCredentials: boolean;
    responseType: string;
    response: any | undefined;
    responseText: string | undefined;
    responseURL: string | null;
    status: number;
    statusText: string;
    mockResponseHeaders: string;
    listeners: {
        error?: (event: ErrorEvent) => void;
        load?: () => void;
        progress?: (event: ProgressEvent) => void;
        uploadProgress?: (event: ProgressEvent) => void;
    };
    upload: MockXMLHttpRequestUpload;
    open(method: string, url: string): void;
    send(body: any): void;
    addEventListener(event: 'error' | 'load' | 'progress' | 'uploadProgress', handler: Function): void;
    removeEventListener(event: 'error' | 'load' | 'progress' | 'uploadProgress'): void;
    setRequestHeader(name: string, value: string): void;
    getAllResponseHeaders(): string;
    getResponseHeader(header: string): string | null;
    mockFlush(status: number, statusText: string, body?: string): void;
    mockDownloadProgressEvent(loaded: number, total?: number): void;
    mockUploadProgressEvent(loaded: number, total?: number): void;
    mockLoadEvent(): void;
    mockErrorEvent(error: any): void;
    abort(): void;
}
