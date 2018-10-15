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
 * A WebDriverAdapter bridges API differences between different WebDriver clients,
 * e.g. JS vs Dart Async vs Dart Sync webdriver.
 * Needs one implementation for every supported WebDriver client.
 */
var WebDriverAdapter = /** @class */ (function () {
    function WebDriverAdapter() {
    }
    WebDriverAdapter.prototype.waitFor = function (callback) { throw new Error('NYI'); };
    WebDriverAdapter.prototype.executeScript = function (script) { throw new Error('NYI'); };
    WebDriverAdapter.prototype.executeAsyncScript = function (script) { throw new Error('NYI'); };
    WebDriverAdapter.prototype.capabilities = function () { throw new Error('NYI'); };
    WebDriverAdapter.prototype.logs = function (type) { throw new Error('NYI'); };
    return WebDriverAdapter;
}());
exports.WebDriverAdapter = WebDriverAdapter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViX2RyaXZlcl9hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYmVuY2hwcmVzcy9zcmMvd2ViX2RyaXZlcl9hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBSUg7Ozs7R0FJRztBQUNIO0lBQUE7SUFNQSxDQUFDO0lBTEMsa0NBQU8sR0FBUCxVQUFRLFFBQWtCLElBQWtCLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLHdDQUFhLEdBQWIsVUFBYyxNQUFjLElBQWtCLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZFLDZDQUFrQixHQUFsQixVQUFtQixNQUFjLElBQWtCLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVFLHVDQUFZLEdBQVosY0FBZ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekUsK0JBQUksR0FBSixVQUFLLElBQVksSUFBb0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEUsdUJBQUM7QUFBRCxDQUFDLEFBTkQsSUFNQztBQU5xQiw0Q0FBZ0IifQ==