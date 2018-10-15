/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Manifest } from '../src/manifest';
export declare type HeaderMap = {
    [key: string]: string;
};
export declare class MockFile {
    readonly path: string;
    readonly contents: string;
    readonly headers: {};
    readonly hashThisFile: boolean;
    constructor(path: string, contents: string, headers: {}, hashThisFile: boolean);
    readonly hash: string;
}
export declare class MockFileSystemBuilder {
    private resources;
    addFile(path: string, contents: string, headers?: HeaderMap): MockFileSystemBuilder;
    addUnhashedFile(path: string, contents: string, headers?: HeaderMap): MockFileSystemBuilder;
    build(): MockFileSystem;
}
export declare class MockFileSystem {
    private resources;
    constructor(resources: Map<string, MockFile>);
    lookup(path: string): MockFile | undefined;
    extend(): MockFileSystemBuilder;
    list(): string[];
}
export declare class MockServerStateBuilder {
    private resources;
    private errors;
    withStaticFiles(fs: MockFileSystem): MockServerStateBuilder;
    withManifest(manifest: Manifest): MockServerStateBuilder;
    withRedirect(from: string, to: string, toContents: string): MockServerStateBuilder;
    withError(url: string): MockServerStateBuilder;
    build(): MockServerState;
}
export declare class MockServerState {
    private resources;
    private errors;
    private requests;
    private gate;
    private resolve;
    private resolveNextRequest;
    online: boolean;
    nextRequest: Promise<Request>;
    constructor(resources: Map<string, Response>, errors: Set<string>);
    fetch(req: Request): Promise<Response>;
    pause(): void;
    unpause(): void;
    assertSawRequestFor(url: string): void;
    assertNoRequestFor(url: string): void;
    sawRequestFor(url: string): boolean;
    assertNoOtherRequests(): void;
    noOtherRequests(): boolean;
    clearRequests(): void;
    reset(): void;
}
export declare function tmpManifestSingleAssetGroup(fs: MockFileSystem): Manifest;
export declare function tmpHashTableForFs(fs: MockFileSystem, breakHashes?: {
    [url: string]: boolean;
}): {
    [url: string]: string;
};
export declare function tmpHashTable(manifest: Manifest): Map<string, string>;
