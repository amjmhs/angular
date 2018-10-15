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
// #docregion LocationComponent
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var PathLocationComponent = /** @class */ (function () {
    function PathLocationComponent(location) {
        this.location = location;
    }
    PathLocationComponent = __decorate([
        core_1.Component({
            selector: 'path-location',
            providers: [common_1.Location, { provide: common_1.LocationStrategy, useClass: common_1.PathLocationStrategy }],
            template: "\n    <h1>PathLocationStrategy</h1>\n    Current URL is: <code>{{location.path()}}</code><br>\n    Normalize: <code>/foo/bar/</code> is: <code>{{location.normalize('foo/bar')}}</code><br>\n  "
        }),
        __metadata("design:paramtypes", [common_1.Location])
    ], PathLocationComponent);
    return PathLocationComponent;
}());
exports.PathLocationComponent = PathLocationComponent;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aF9sb2NhdGlvbl9jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9leGFtcGxlcy9jb21tb24vbG9jYXRpb24vdHMvcGF0aF9sb2NhdGlvbl9jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCwrQkFBK0I7QUFDL0IsMENBQWlGO0FBQ2pGLHNDQUF3QztBQVd4QztJQUVFLCtCQUFZLFFBQWtCO1FBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFBQyxDQUFDO0lBRmxELHFCQUFxQjtRQVRqQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGVBQWU7WUFDekIsU0FBUyxFQUFFLENBQUMsaUJBQVEsRUFBRSxFQUFDLE9BQU8sRUFBRSx5QkFBZ0IsRUFBRSxRQUFRLEVBQUUsNkJBQW9CLEVBQUMsQ0FBQztZQUNsRixRQUFRLEVBQUUsaU1BSVQ7U0FDRixDQUFDO3lDQUdzQixpQkFBUTtPQUZuQixxQkFBcUIsQ0FHakM7SUFBRCw0QkFBQztDQUFBLEFBSEQsSUFHQztBQUhZLHNEQUFxQjtBQUlsQyxnQkFBZ0IifQ==