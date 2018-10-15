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
var body_1 = require("./body");
/**
 * Creates `Response` instances from provided values.
 *
 * Though this object isn't
 * usually instantiated by end-users, it is the primary object interacted with when it comes time to
 * add data to a view.
 *
 * @usageNotes
 * ### Example
 *
 * ```
 * http.request('my-friends.txt').subscribe(response => this.friends = response.text());
 * ```
 *
 * The Response's interface is inspired by the Response constructor defined in the [Fetch
 * Spec](https://fetch.spec.whatwg.org/#response-class), but is considered a static value whose body
 * can be accessed many times. There are other differences in the implementation, but this is the
 * most significant.
 *
 * @deprecated see https://angular.io/guide/http
 */
var Response = /** @class */ (function (_super) {
    __extends(Response, _super);
    function Response(responseOptions) {
        var _this = _super.call(this) || this;
        _this._body = responseOptions.body;
        _this.status = responseOptions.status;
        _this.ok = (_this.status >= 200 && _this.status <= 299);
        _this.statusText = responseOptions.statusText;
        _this.headers = responseOptions.headers;
        _this.type = responseOptions.type;
        _this.url = responseOptions.url;
        return _this;
    }
    Response.prototype.toString = function () {
        return "Response with status: " + this.status + " " + this.statusText + " for URL: " + this.url;
    };
    return Response;
}(body_1.Body));
exports.Response = Response;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljX3Jlc3BvbnNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvaHR0cC9zcmMvc3RhdGljX3Jlc3BvbnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUtILCtCQUE0QjtBQUs1Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQkc7QUFDSDtJQUE4Qiw0QkFBSTtJQW1EaEMsa0JBQVksZUFBZ0M7UUFBNUMsWUFDRSxpQkFBTyxTQVFSO1FBUEMsS0FBSSxDQUFDLEtBQUssR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDO1FBQ2xDLEtBQUksQ0FBQyxNQUFNLEdBQUcsZUFBZSxDQUFDLE1BQVEsQ0FBQztRQUN2QyxLQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSSxDQUFDLE1BQU0sSUFBSSxHQUFHLElBQUksS0FBSSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNyRCxLQUFJLENBQUMsVUFBVSxHQUFHLGVBQWUsQ0FBQyxVQUFVLENBQUM7UUFDN0MsS0FBSSxDQUFDLE9BQU8sR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDO1FBQ3ZDLEtBQUksQ0FBQyxJQUFJLEdBQUcsZUFBZSxDQUFDLElBQU0sQ0FBQztRQUNuQyxLQUFJLENBQUMsR0FBRyxHQUFHLGVBQWUsQ0FBQyxHQUFLLENBQUM7O0lBQ25DLENBQUM7SUFFRCwyQkFBUSxHQUFSO1FBQ0UsT0FBTywyQkFBeUIsSUFBSSxDQUFDLE1BQU0sU0FBSSxJQUFJLENBQUMsVUFBVSxrQkFBYSxJQUFJLENBQUMsR0FBSyxDQUFDO0lBQ3hGLENBQUM7SUFDSCxlQUFDO0FBQUQsQ0FBQyxBQWpFRCxDQUE4QixXQUFJLEdBaUVqQztBQWpFWSw0QkFBUSJ9