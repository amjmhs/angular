/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare class BitmapService {
    convertToImageData(buffer: ArrayBuffer): ImageData;
    applySepia(imageData: ImageData): ImageData;
    toDataUri(imageData: ImageData): string;
    arrayBufferToDataUri(data: Uint8Array): string;
    private _imageDataToBMP;
    private _swap;
    private _createBMPHeader;
    private _BMPToImageData;
    private _getBMP;
    private _getLittleEndianHex;
}
