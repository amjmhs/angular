"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description
 *
 * Provides a way to migrate AngularJS applications to Angular.
 *
 * @experimental
 */
var UrlHandlingStrategy = /** @class */ (function () {
    function UrlHandlingStrategy() {
    }
    return UrlHandlingStrategy;
}());
exports.UrlHandlingStrategy = UrlHandlingStrategy;
/**
 * @experimental
 */
var DefaultUrlHandlingStrategy = /** @class */ (function () {
    function DefaultUrlHandlingStrategy() {
    }
    DefaultUrlHandlingStrategy.prototype.shouldProcessUrl = function (url) { return true; };
    DefaultUrlHandlingStrategy.prototype.extract = function (url) { return url; };
    DefaultUrlHandlingStrategy.prototype.merge = function (newUrlPart, wholeUrl) { return newUrlPart; };
    return DefaultUrlHandlingStrategy;
}());
exports.DefaultUrlHandlingStrategy = DefaultUrlHandlingStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX2hhbmRsaW5nX3N0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3NyYy91cmxfaGFuZGxpbmdfc3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFJSDs7Ozs7O0dBTUc7QUFDSDtJQUFBO0lBcUJBLENBQUM7SUFBRCwwQkFBQztBQUFELENBQUMsQUFyQkQsSUFxQkM7QUFyQnFCLGtEQUFtQjtBQXVCekM7O0dBRUc7QUFDSDtJQUFBO0lBSUEsQ0FBQztJQUhDLHFEQUFnQixHQUFoQixVQUFpQixHQUFZLElBQWEsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hELDRDQUFPLEdBQVAsVUFBUSxHQUFZLElBQWEsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzlDLDBDQUFLLEdBQUwsVUFBTSxVQUFtQixFQUFFLFFBQWlCLElBQWEsT0FBTyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQy9FLGlDQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFKWSxnRUFBMEIifQ==