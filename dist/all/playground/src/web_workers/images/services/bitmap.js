"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var base64_js_1 = require("base64-js");
// This class is based on the Bitmap examples at:
// http://www.i-programmer.info/projects/36-web/6234-reading-a-bmp-file-in-javascript.html
// and http://www.worldwidewhat.net/2012/07/how-to-draw-bitmaps-using-javascript/
var BitmapService = /** @class */ (function () {
    function BitmapService() {
    }
    BitmapService.prototype.convertToImageData = function (buffer) {
        var bmp = this._getBMP(buffer);
        return this._BMPToImageData(bmp);
    };
    BitmapService.prototype.applySepia = function (imageData) {
        var buffer = imageData.data;
        for (var i = 0; i < buffer.length; i += 4) {
            var r = buffer[i];
            var g = buffer[i + 1];
            var b = buffer[i + 2];
            buffer[i] = (r * .393) + (g * .769) + (b * .189);
            buffer[i + 1] = (r * .349) + (g * .686) + (b * .168);
            buffer[i + 2] = (r * .272) + (g * .534) + (b * .131);
        }
        return imageData;
    };
    BitmapService.prototype.toDataUri = function (imageData) {
        var header = this._createBMPHeader(imageData);
        imageData = this._imageDataToBMP(imageData);
        return 'data:image/bmp;base64,' + btoa(header) + base64_js_1.fromByteArray(imageData.data);
    };
    // converts a .bmp file ArrayBuffer to a dataURI
    BitmapService.prototype.arrayBufferToDataUri = function (data) {
        return 'data:image/bmp;base64,' + base64_js_1.fromByteArray(data);
    };
    // returns a UInt8Array in BMP order (starting from the bottom)
    BitmapService.prototype._imageDataToBMP = function (imageData) {
        var width = imageData.width;
        var height = imageData.height;
        var data = imageData.data;
        for (var y = 0; y < height / 2; ++y) {
            var topIndex = y * width * 4;
            var bottomIndex = (height - y) * width * 4;
            for (var i = 0; i < width * 4; i++) {
                this._swap(data, topIndex, bottomIndex);
                topIndex++;
                bottomIndex++;
            }
        }
        return imageData;
    };
    BitmapService.prototype._swap = function (data, index1, index2) {
        var temp = data[index1];
        data[index1] = data[index2];
        data[index2] = temp;
    };
    // Based on example from
    // http://www.worldwidewhat.net/2012/07/how-to-draw-bitmaps-using-javascript/
    BitmapService.prototype._createBMPHeader = function (imageData) {
        var numFileBytes = this._getLittleEndianHex(imageData.width * imageData.height);
        var w = this._getLittleEndianHex(imageData.width);
        var h = this._getLittleEndianHex(imageData.height);
        return 'BM' + // Signature
            numFileBytes + // size of the file (bytes)*
            '\x00\x00' + // reserved
            '\x00\x00' + // reserved
            '\x36\x00\x00\x00' + // offset of where BMP data lives (54 bytes)
            '\x28\x00\x00\x00' + // number of remaining bytes in header from here (40 bytes)
            w + // the width of the bitmap in pixels*
            h + // the height of the bitmap in pixels*
            '\x01\x00' + // the number of color planes (1)
            '\x20\x00' + // 32 bits / pixel
            '\x00\x00\x00\x00' + // No compression (0)
            '\x00\x00\x00\x00' + // size of the BMP data (bytes)*
            '\x13\x0B\x00\x00' + // 2835 pixels/meter - horizontal resolution
            '\x13\x0B\x00\x00' + // 2835 pixels/meter - the vertical resolution
            '\x00\x00\x00\x00' + // Number of colors in the palette (keep 0 for 32-bit)
            '\x00\x00\x00\x00'; // 0 important colors (means all colors are important)
    };
    BitmapService.prototype._BMPToImageData = function (bmp) {
        var width = bmp.infoHeader.biWidth;
        var height = bmp.infoHeader.biHeight;
        var imageData = new ImageData(width, height);
        var data = imageData.data;
        var bmpData = bmp.pixels;
        var stride = bmp.stride;
        for (var y = 0; y < height; ++y) {
            for (var x = 0; x < width; ++x) {
                var index1 = (x + width * (height - y)) * 4;
                var index2 = x * 3 + stride * y;
                data[index1] = bmpData[index2 + 2];
                data[index1 + 1] = bmpData[index2 + 1];
                data[index1 + 2] = bmpData[index2];
                data[index1 + 3] = 255;
            }
        }
        return imageData;
    };
    BitmapService.prototype._getBMP = function (buffer) {
        var datav = new DataView(buffer);
        var bitmap = {
            fileHeader: {
                bfType: datav.getUint16(0, true),
                bfSize: datav.getUint32(2, true),
                bfReserved1: datav.getUint16(6, true),
                bfReserved2: datav.getUint16(8, true),
                bfOffBits: datav.getUint32(10, true),
            },
            infoHeader: {
                biSize: datav.getUint32(14, true),
                biWidth: datav.getUint32(18, true),
                biHeight: datav.getUint32(22, true),
                biPlanes: datav.getUint16(26, true),
                biBitCount: datav.getUint16(28, true),
                biCompression: datav.getUint32(30, true),
                biSizeImage: datav.getUint32(34, true),
                biXPelsPerMeter: datav.getUint32(38, true),
                biYPelsPerMeter: datav.getUint32(42, true),
                biClrUsed: datav.getUint32(46, true),
                biClrImportant: datav.getUint32(50, true)
            },
            stride: null,
            pixels: null
        };
        var start = bitmap.fileHeader.bfOffBits;
        bitmap.stride =
            Math.floor((bitmap.infoHeader.biBitCount * bitmap.infoHeader.biWidth + 31) / 32) * 4;
        bitmap.pixels = new Uint8Array(datav.buffer, start);
        return bitmap;
    };
    // Based on example from
    // http://www.worldwidewhat.net/2012/07/how-to-draw-bitmaps-using-javascript/
    BitmapService.prototype._getLittleEndianHex = function (value) {
        var result = [];
        for (var bytes = 4; bytes > 0; bytes--) {
            result.push(String.fromCharCode(value & 255));
            value >>= 8;
        }
        return result.join('');
    };
    BitmapService = __decorate([
        core_1.Injectable()
    ], BitmapService);
    return BitmapService;
}());
exports.BitmapService = BitmapService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYml0bWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL3NyYy93ZWJfd29ya2Vycy9pbWFnZXMvc2VydmljZXMvYml0bWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQXlDO0FBQ3pDLHVDQUF3QztBQUV4QyxpREFBaUQ7QUFDakQsMEZBQTBGO0FBQzFGLGlGQUFpRjtBQUVqRjtJQUFBO0lBa0pBLENBQUM7SUFqSkMsMENBQWtCLEdBQWxCLFVBQW1CLE1BQW1CO1FBQ3BDLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakMsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxrQ0FBVSxHQUFWLFVBQVcsU0FBb0I7UUFDN0IsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztRQUM5QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3pDLElBQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQixJQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLElBQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDeEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQ2pELE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDckQsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztTQUN0RDtRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCxpQ0FBUyxHQUFULFVBQVUsU0FBb0I7UUFDNUIsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hELFNBQVMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVDLE9BQU8sd0JBQXdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLHlCQUFhLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pGLENBQUM7SUFFRCxnREFBZ0Q7SUFDaEQsNENBQW9CLEdBQXBCLFVBQXFCLElBQWdCO1FBQ25DLE9BQU8sd0JBQXdCLEdBQUcseUJBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsK0RBQStEO0lBQ3ZELHVDQUFlLEdBQXZCLFVBQXdCLFNBQW9CO1FBQzFDLElBQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFDOUIsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUVoQyxJQUFNLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQzVCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ25DLElBQUksUUFBUSxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQzdCLElBQUksV0FBVyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDM0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDeEMsUUFBUSxFQUFFLENBQUM7Z0JBQ1gsV0FBVyxFQUFFLENBQUM7YUFDZjtTQUNGO1FBRUQsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVPLDZCQUFLLEdBQWIsVUFBYyxJQUEyQyxFQUFFLE1BQWMsRUFBRSxNQUFjO1FBQ3ZGLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDdEIsQ0FBQztJQUVELHdCQUF3QjtJQUN4Qiw2RUFBNkU7SUFDckUsd0NBQWdCLEdBQXhCLFVBQXlCLFNBQW9CO1FBQzNDLElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRixJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BELElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckQsT0FBTyxJQUFJLEdBQWUsWUFBWTtZQUNsQyxZQUFZLEdBQVUsNEJBQTRCO1lBQ2xELFVBQVUsR0FBWSxXQUFXO1lBQ2pDLFVBQVUsR0FBWSxXQUFXO1lBQ2pDLGtCQUFrQixHQUFJLDRDQUE0QztZQUNsRSxrQkFBa0IsR0FBSSwyREFBMkQ7WUFDakYsQ0FBQyxHQUFxQixxQ0FBcUM7WUFDM0QsQ0FBQyxHQUFxQixzQ0FBc0M7WUFDNUQsVUFBVSxHQUFZLGlDQUFpQztZQUN2RCxVQUFVLEdBQVksa0JBQWtCO1lBQ3hDLGtCQUFrQixHQUFJLHFCQUFxQjtZQUMzQyxrQkFBa0IsR0FBSSxnQ0FBZ0M7WUFDdEQsa0JBQWtCLEdBQUksNENBQTRDO1lBQ2xFLGtCQUFrQixHQUFJLDhDQUE4QztZQUNwRSxrQkFBa0IsR0FBSSxzREFBc0Q7WUFDNUUsa0JBQWtCLENBQUMsQ0FBRyxzREFBc0Q7SUFDbEYsQ0FBQztJQUVPLHVDQUFlLEdBQXZCLFVBQXdCLEdBQWU7UUFDckMsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7UUFDckMsSUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7UUFDdkMsSUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRS9DLElBQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDNUIsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBRTFCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDOUIsSUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QyxJQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQzthQUN4QjtTQUNGO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVPLCtCQUFPLEdBQWYsVUFBZ0IsTUFBbUI7UUFDakMsSUFBTSxLQUFLLEdBQUcsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkMsSUFBTSxNQUFNLEdBQWU7WUFDekIsVUFBVSxFQUFFO2dCQUNWLE1BQU0sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7Z0JBQ2hDLE1BQU0sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7Z0JBQ2hDLFdBQVcsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7Z0JBQ3JDLFdBQVcsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7Z0JBQ3JDLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUM7YUFDckM7WUFDRCxVQUFVLEVBQUU7Z0JBQ1YsTUFBTSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztnQkFDakMsT0FBTyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztnQkFDbEMsUUFBUSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztnQkFDbkMsUUFBUSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztnQkFDbkMsVUFBVSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztnQkFDckMsYUFBYSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztnQkFDeEMsV0FBVyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztnQkFDdEMsZUFBZSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztnQkFDMUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztnQkFDMUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztnQkFDcEMsY0FBYyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQzthQUMxQztZQUNELE1BQU0sRUFBRSxJQUFJO1lBQ1osTUFBTSxFQUFFLElBQUk7U0FDYixDQUFDO1FBQ0YsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7UUFDMUMsTUFBTSxDQUFDLE1BQU07WUFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pGLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNwRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQsd0JBQXdCO0lBQ3hCLDZFQUE2RTtJQUNyRSwyQ0FBbUIsR0FBM0IsVUFBNEIsS0FBYTtRQUN2QyxJQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFFNUIsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDOUMsS0FBSyxLQUFLLENBQUMsQ0FBQztTQUNiO1FBRUQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFqSlUsYUFBYTtRQUR6QixpQkFBVSxFQUFFO09BQ0EsYUFBYSxDQWtKekI7SUFBRCxvQkFBQztDQUFBLEFBbEpELElBa0pDO0FBbEpZLHNDQUFhIn0=