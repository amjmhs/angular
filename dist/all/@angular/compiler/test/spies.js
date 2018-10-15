"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var resource_loader_1 = require("@angular/compiler/src/resource_loader");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var SpyResourceLoader = /** @class */ (function (_super) {
    __extends(SpyResourceLoader, _super);
    function SpyResourceLoader() {
        return _super.call(this, resource_loader_1.ResourceLoader) || this;
    }
    SpyResourceLoader.PROVIDE = { provide: resource_loader_1.ResourceLoader, useClass: SpyResourceLoader, deps: [] };
    return SpyResourceLoader;
}(testing_internal_1.SpyObject));
exports.SpyResourceLoader = SpyResourceLoader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L3NwaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILHlFQUFxRTtBQUVyRSwrRUFBcUU7QUFFckU7SUFBdUMscUNBQVM7SUFFOUM7ZUFBZ0Isa0JBQU0sZ0NBQWMsQ0FBQztJQUFFLENBQUM7SUFEMUIseUJBQU8sR0FBRyxFQUFDLE9BQU8sRUFBRSxnQ0FBYyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDLENBQUM7SUFFM0Ysd0JBQUM7Q0FBQSxBQUhELENBQXVDLDRCQUFTLEdBRy9DO0FBSFksOENBQWlCIn0=