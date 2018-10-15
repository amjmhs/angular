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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var bitmap_1 = require("./services/bitmap");
var ImageDemo = /** @class */ (function () {
    function ImageDemo(_bitmapService) {
        this._bitmapService = _bitmapService;
        this.images = [];
    }
    ImageDemo.prototype.uploadFiles = function (files) {
        for (var i = 0; i < files.length; i++) {
            var reader = new FileReader();
            reader.addEventListener('load', this.handleReaderLoad(reader));
            reader.readAsArrayBuffer(files[i]);
        }
    };
    ImageDemo.prototype.handleReaderLoad = function (reader) {
        var _this = this;
        return function (e) {
            var buffer = reader.result;
            _this.images.push({
                src: _this._bitmapService.arrayBufferToDataUri(new Uint8Array(buffer)),
                buffer: buffer,
                filtering: false
            });
        };
    };
    ImageDemo.prototype.applyFilters = function () {
        for (var i = 0; i < this.images.length; i++) {
            this.images[i].filtering = true;
            setTimeout(this._filter(i), 0);
        }
    };
    ImageDemo.prototype._filter = function (i) {
        var _this = this;
        return function () {
            var imageData = _this._bitmapService.convertToImageData(_this.images[i].buffer);
            imageData = _this._bitmapService.applySepia(imageData);
            _this.images[i].src = _this._bitmapService.toDataUri(imageData);
            _this.images[i].filtering = false;
        };
    };
    ImageDemo = __decorate([
        core_1.Component({ selector: 'image-demo', viewProviders: [bitmap_1.BitmapService], templateUrl: 'image_demo.html' }),
        __metadata("design:paramtypes", [bitmap_1.BitmapService])
    ], ImageDemo);
    return ImageDemo;
}());
exports.ImageDemo = ImageDemo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL3NyYy93ZWJfd29ya2Vycy9pbWFnZXMvaW5kZXhfY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXdDO0FBRXhDLDRDQUFnRDtBQUloRDtJQUlFLG1CQUFvQixjQUE2QjtRQUE3QixtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQUhqRCxXQUFNLEdBQTZELEVBQUUsQ0FBQztJQUdsQixDQUFDO0lBRXJELCtCQUFXLEdBQVgsVUFBWSxLQUFlO1FBQ3pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JDLElBQU0sTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7WUFDaEMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMvRCxNQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDcEM7SUFDSCxDQUFDO0lBRUQsb0NBQWdCLEdBQWhCLFVBQWlCLE1BQWtCO1FBQW5DLGlCQVNDO1FBUkMsT0FBTyxVQUFDLENBQUM7WUFDUCxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBcUIsQ0FBQztZQUM1QyxLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDZixHQUFHLEVBQUUsS0FBSSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDckUsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsU0FBUyxFQUFFLEtBQUs7YUFDakIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELGdDQUFZLEdBQVo7UUFDRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDM0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBRWhDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ2hDO0lBQ0gsQ0FBQztJQUVPLDJCQUFPLEdBQWYsVUFBZ0IsQ0FBUztRQUF6QixpQkFPQztRQU5DLE9BQU87WUFDTCxJQUFJLFNBQVMsR0FBRyxLQUFJLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUUsU0FBUyxHQUFHLEtBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3RELEtBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzlELEtBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUNuQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBeENVLFNBQVM7UUFEckIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLENBQUMsc0JBQWEsQ0FBQyxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBQyxDQUFDO3lDQUs5RCxzQkFBYTtPQUp0QyxTQUFTLENBeUNyQjtJQUFELGdCQUFDO0NBQUEsQUF6Q0QsSUF5Q0M7QUF6Q1ksOEJBQVMifQ==