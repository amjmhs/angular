/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BitmapService } from './services/bitmap';
export declare class ImageDemo {
    private _bitmapService;
    images: {
        src: string;
        buffer: ArrayBuffer;
        filtering: boolean;
    }[];
    fileInput: String;
    constructor(_bitmapService: BitmapService);
    uploadFiles(files: FileList): void;
    handleReaderLoad(reader: FileReader): EventListener;
    applyFilters(): void;
    private _filter;
}
