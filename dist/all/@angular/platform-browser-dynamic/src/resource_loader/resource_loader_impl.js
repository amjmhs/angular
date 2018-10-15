"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
var ResourceLoaderImpl = /** @class */ (function (_super) {
    __extends(ResourceLoaderImpl, _super);
    function ResourceLoaderImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResourceLoaderImpl.prototype.get = function (url) {
        var resolve;
        var reject;
        var promise = new Promise(function (res, rej) {
            resolve = res;
            reject = rej;
        });
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'text';
        xhr.onload = function () {
            // responseText is the old-school way of retrieving response (supported by IE8 & 9)
            // response/responseType properties were introduced in ResourceLoader Level2 spec (supported
            // by IE10)
            var response = xhr.response || xhr.responseText;
            // normalize IE9 bug (http://bugs.jquery.com/ticket/1450)
            var status = xhr.status === 1223 ? 204 : xhr.status;
            // fix status code when it is 0 (0 status is undocumented).
            // Occurs when accessing file resources or on Android 4.1 stock browser
            // while retrieving files from application cache.
            if (status === 0) {
                status = response ? 200 : 0;
            }
            if (200 <= status && status <= 300) {
                resolve(response);
            }
            else {
                reject("Failed to load " + url);
            }
        };
        xhr.onerror = function () { reject("Failed to load " + url); };
        xhr.send();
        return promise;
    };
    ResourceLoaderImpl = __decorate([
        core_1.Injectable()
    ], ResourceLoaderImpl);
    return ResourceLoaderImpl;
}(compiler_1.ResourceLoader));
exports.ResourceLoaderImpl = ResourceLoaderImpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2VfbG9hZGVyX2ltcGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyLWR5bmFtaWMvc3JjL3Jlc291cmNlX2xvYWRlci9yZXNvdXJjZV9sb2FkZXJfaW1wbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCw4Q0FBaUQ7QUFDakQsc0NBQXlDO0FBSXpDO0lBQXdDLHNDQUFjO0lBQXREOztJQXdDQSxDQUFDO0lBdkNDLGdDQUFHLEdBQUgsVUFBSSxHQUFXO1FBQ2IsSUFBSSxPQUE4QixDQUFDO1FBQ25DLElBQUksTUFBNEIsQ0FBQztRQUNqQyxJQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBUyxVQUFDLEdBQUcsRUFBRSxHQUFHO1lBQzNDLE9BQU8sR0FBRyxHQUFHLENBQUM7WUFDZCxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2YsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFNLEdBQUcsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1FBQ2pDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMzQixHQUFHLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQztRQUUxQixHQUFHLENBQUMsTUFBTSxHQUFHO1lBQ1gsbUZBQW1GO1lBQ25GLDRGQUE0RjtZQUM1RixXQUFXO1lBQ1gsSUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFFBQVEsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDO1lBRWxELHlEQUF5RDtZQUN6RCxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO1lBRXBELDJEQUEyRDtZQUMzRCx1RUFBdUU7WUFDdkUsaURBQWlEO1lBQ2pELElBQUksTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDaEIsTUFBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDN0I7WUFFRCxJQUFJLEdBQUcsSUFBSSxNQUFNLElBQUksTUFBTSxJQUFJLEdBQUcsRUFBRTtnQkFDbEMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ25CO2lCQUFNO2dCQUNMLE1BQU0sQ0FBQyxvQkFBa0IsR0FBSyxDQUFDLENBQUM7YUFDakM7UUFDSCxDQUFDLENBQUM7UUFFRixHQUFHLENBQUMsT0FBTyxHQUFHLGNBQWEsTUFBTSxDQUFDLG9CQUFrQixHQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU5RCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBdkNVLGtCQUFrQjtRQUQ5QixpQkFBVSxFQUFFO09BQ0Esa0JBQWtCLENBd0M5QjtJQUFELHlCQUFDO0NBQUEsQUF4Q0QsQ0FBd0MseUJBQWMsR0F3Q3JEO0FBeENZLGdEQUFrQiJ9