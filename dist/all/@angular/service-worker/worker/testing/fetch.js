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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var MockBody = /** @class */ (function () {
    function MockBody(_body) {
        this._body = _body;
        this.bodyUsed = false;
    }
    MockBody.prototype.arrayBuffer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var buffer, access, i;
            return __generator(this, function (_a) {
                this.markBodyUsed();
                if (this._body !== null) {
                    buffer = new ArrayBuffer(this._body.length);
                    access = new Uint8Array(buffer);
                    for (i = 0; i < this._body.length; i++) {
                        access[i] = this._body.charCodeAt(i);
                    }
                    return [2 /*return*/, buffer];
                }
                else {
                    throw new Error('No body');
                }
                return [2 /*return*/];
            });
        });
    };
    MockBody.prototype.blob = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            throw 'Not implemented';
        }); });
    };
    MockBody.prototype.json = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.markBodyUsed();
                if (this._body !== null) {
                    return [2 /*return*/, JSON.parse(this._body)];
                }
                else {
                    throw new Error('No body');
                }
                return [2 /*return*/];
            });
        });
    };
    MockBody.prototype.text = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.markBodyUsed();
                if (this._body !== null) {
                    return [2 /*return*/, this._body];
                }
                else {
                    throw new Error('No body');
                }
                return [2 /*return*/];
            });
        });
    };
    MockBody.prototype.formData = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            throw 'Not implemented';
        }); });
    };
    MockBody.prototype.markBodyUsed = function () {
        if (this.bodyUsed === true) {
            throw new Error('Cannot reuse body without cloning.');
        }
        this.bodyUsed = true;
    };
    return MockBody;
}());
exports.MockBody = MockBody;
var MockHeaders = /** @class */ (function () {
    function MockHeaders() {
        this.map = new Map();
    }
    MockHeaders.prototype[Symbol.iterator] = function () { return this.map[Symbol.iterator](); };
    MockHeaders.prototype.append = function (name, value) { this.map.set(name, value); };
    MockHeaders.prototype.delete = function (name) { this.map.delete(name); };
    MockHeaders.prototype.entries = function () { return this.map.entries(); };
    MockHeaders.prototype.forEach = function (callback) { this.map.forEach(callback); };
    MockHeaders.prototype.get = function (name) { return this.map.get(name) || null; };
    MockHeaders.prototype.has = function (name) { return this.map.has(name); };
    MockHeaders.prototype.keys = function () { return this.map.keys(); };
    MockHeaders.prototype.set = function (name, value) { this.map.set(name, value); };
    MockHeaders.prototype.values = function () { return this.map.values(); };
    return MockHeaders;
}());
exports.MockHeaders = MockHeaders;
var MockRequest = /** @class */ (function (_super) {
    __extends(MockRequest, _super);
    function MockRequest(input, init) {
        if (init === void 0) { init = {}; }
        var _this = _super.call(this, init !== undefined ? init.body || null : null) || this;
        _this.cache = 'default';
        _this.credentials = 'omit';
        _this.destination = 'document';
        _this.headers = new MockHeaders();
        _this.integrity = '';
        _this.keepalive = true;
        _this.method = 'GET';
        _this.mode = 'cors';
        _this.redirect = 'error';
        _this.referrer = '';
        _this.referrerPolicy = 'no-referrer';
        _this.type = '';
        _this.signal = null;
        if (typeof input !== 'string') {
            throw 'Not implemented';
        }
        _this.url = input;
        var headers = init.headers;
        if (headers !== undefined) {
            if (headers instanceof MockHeaders) {
                _this.headers = headers;
            }
            else {
                Object.keys(headers).forEach(function (header) { _this.headers.set(header, headers[header]); });
            }
        }
        if (init.cache !== undefined) {
            _this.cache = init.cache;
        }
        if (init.mode !== undefined) {
            _this.mode = init.mode;
        }
        if (init.credentials !== undefined) {
            _this.credentials = init.credentials;
        }
        return _this;
    }
    MockRequest.prototype.clone = function () {
        if (this.bodyUsed) {
            throw 'Body already consumed';
        }
        return new MockRequest(this.url, { body: this._body, mode: this.mode, credentials: this.credentials, headers: this.headers });
    };
    return MockRequest;
}(MockBody));
exports.MockRequest = MockRequest;
var MockResponse = /** @class */ (function (_super) {
    __extends(MockResponse, _super);
    function MockResponse(body, init) {
        if (init === void 0) { init = {}; }
        var _this = _super.call(this, typeof body === 'string' ? body : null) || this;
        _this.headers = new MockHeaders();
        _this.type = 'basic';
        _this.url = '';
        _this.body = null;
        _this.redirected = false;
        _this.status = (init.status !== undefined) ? init.status : 200;
        _this.statusText = init.statusText || 'OK';
        var headers = init.headers;
        if (headers !== undefined) {
            if (headers instanceof MockHeaders) {
                _this.headers = headers;
            }
            else {
                Object.keys(headers).forEach(function (header) { _this.headers.set(header, headers[header]); });
            }
        }
        if (init.type !== undefined) {
            _this.type = init.type;
        }
        if (init.redirected !== undefined) {
            _this.redirected = init.redirected;
        }
        if (init.url !== undefined) {
            _this.url = init.url;
        }
        return _this;
    }
    Object.defineProperty(MockResponse.prototype, "ok", {
        get: function () { return this.status >= 200 && this.status < 300; },
        enumerable: true,
        configurable: true
    });
    MockResponse.prototype.clone = function () {
        if (this.bodyUsed) {
            throw 'Body already consumed';
        }
        return new MockResponse(this._body, { status: this.status, statusText: this.statusText, headers: this.headers });
    };
    return MockResponse;
}(MockBody));
exports.MockResponse = MockResponse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9zZXJ2aWNlLXdvcmtlci93b3JrZXIvdGVzdGluZy9mZXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVIO0lBR0Usa0JBQW1CLEtBQWtCO1FBQWxCLFVBQUssR0FBTCxLQUFLLENBQWE7UUFGckMsYUFBUSxHQUFZLEtBQUssQ0FBQztJQUVjLENBQUM7SUFFbkMsOEJBQVcsR0FBakI7Ozs7Z0JBQ0UsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUNwQixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxFQUFFO29CQUNqQixNQUFNLEdBQUcsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDNUMsTUFBTSxHQUFHLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUN0QyxLQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUMxQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3RDO29CQUNELHNCQUFPLE1BQU0sRUFBQztpQkFDZjtxQkFBTTtvQkFDTCxNQUFNLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2lCQUM1Qjs7OztLQUNGO0lBRUssdUJBQUksR0FBVjs7WUFBOEIsTUFBTSxpQkFBaUIsQ0FBQzs7S0FBRTtJQUVsRCx1QkFBSSxHQUFWOzs7Z0JBQ0UsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUNwQixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxF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