"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
var sha1_1 = require("../src/sha1");
var fetch_1 = require("./fetch");
var MockFile = /** @class */ (function () {
    function MockFile(path, contents, headers, hashThisFile) {
        if (headers === void 0) { headers = {}; }
        this.path = path;
        this.contents = contents;
        this.headers = headers;
        this.hashThisFile = hashThisFile;
    }
    Object.defineProperty(MockFile.prototype, "hash", {
        get: function () { return sha1_1.sha1(this.contents); },
        enumerable: true,
        configurable: true
    });
    return MockFile;
}());
exports.MockFile = MockFile;
var MockFileSystemBuilder = /** @class */ (function () {
    function MockFileSystemBuilder() {
        this.resources = new Map();
    }
    MockFileSystemBuilder.prototype.addFile = function (path, contents, headers) {
        this.resources.set(path, new MockFile(path, contents, headers, true));
        return this;
    };
    MockFileSystemBuilder.prototype.addUnhashedFile = function (path, contents, headers) {
        this.resources.set(path, new MockFile(path, contents, headers, false));
        return this;
    };
    MockFileSystemBuilder.prototype.build = function () { return new MockFileSystem(this.resources); };
    return MockFileSystemBuilder;
}());
exports.MockFileSystemBuilder = MockFileSystemBuilder;
var MockFileSystem = /** @class */ (function () {
    function MockFileSystem(resources) {
        this.resources = resources;
    }
    MockFileSystem.prototype.lookup = function (path) { return this.resources.get(path); };
    MockFileSystem.prototype.extend = function () {
        var _this = this;
        var builder = new MockFileSystemBuilder();
        Array.from(this.resources.keys()).forEach(function (path) {
            var res = _this.resources.get(path);
            if (res.hashThisFile) {
                builder.addFile(path, res.contents, res.headers);
            }
            else {
                builder.addUnhashedFile(path, res.contents, res.headers);
            }
        });
        return builder;
    };
    MockFileSystem.prototype.list = function () { return Array.from(this.resources.keys()); };
    return MockFileSystem;
}());
exports.MockFileSystem = MockFileSystem;
var MockServerStateBuilder = /** @class */ (function () {
    function MockServerStateBuilder() {
        this.resources = new Map();
        this.errors = new Set();
    }
    MockServerStateBuilder.prototype.withStaticFiles = function (fs) {
        var _this = this;
        fs.list().forEach(function (path) {
            var file = fs.lookup(path);
            _this.resources.set(path, new fetch_1.MockResponse(file.contents, { headers: file.headers }));
        });
        return this;
    };
    MockServerStateBuilder.prototype.withManifest = function (manifest) {
        this.resources.set('ngsw.json', new fetch_1.MockResponse(JSON.stringify(manifest)));
        return this;
    };
    MockServerStateBuilder.prototype.withRedirect = function (from, to, toContents) {
        this.resources.set(from, new fetch_1.MockResponse(toContents, { redirected: true, url: to }));
        this.resources.set(to, new fetch_1.MockResponse(toContents));
        return this;
    };
    MockServerStateBuilder.prototype.withError = function (url) {
        this.errors.add(url);
        return this;
    };
    MockServerStateBuilder.prototype.build = function () { return new MockServerState(this.resources, this.errors); };
    return MockServerStateBuilder;
}());
exports.MockServerStateBuilder = MockServerStateBuilder;
var MockServerState = /** @class */ (function () {
    function MockServerState(resources, errors) {
        var _this = this;
        this.resources = resources;
        this.errors = errors;
        this.requests = [];
        this.gate = Promise.resolve();
        this.resolve = null;
        this.online = true;
        this.nextRequest = new Promise(function (resolve) { _this.resolveNextRequest = resolve; });
    }
    MockServerState.prototype.fetch = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.resolveNextRequest(req);
                        this.nextRequest = new Promise(function (resolve) { _this.resolveNextRequest = resolve; });
                        return [4 /*yield*/, this.gate];
                    case 1:
                        _a.sent();
                        if (!this.online) {
                            throw new Error('Offline.');
                        }
                        if (req.credentials === 'include') {
                            return [2 /*return*/, new fetch_1.MockResponse(null, { status: 0, statusText: '', type: 'opaque' })];
                        }
                        url = req.url.split('?')[0];
                        this.requests.push(req);
                        if (this.resources.has(url)) {
                            return [2 /*return*/, this.resources.get(url).clone()];
                        }
                        if (this.errors.has(url)) {
                            throw new Error('Intentional failure!');
                        }
                        return [2 /*return*/, new fetch_1.MockResponse(null, { status: 404, statusText: 'Not Found' })];
                }
            });
        });
    };
    MockServerState.prototype.pause = function () {
        var _this = this;
        this.gate = new Promise(function (resolve) { _this.resolve = resolve; });
    };
    MockServerState.prototype.unpause = function () {
        if (this.resolve === null) {
            return;
        }
        this.resolve();
        this.resolve = null;
    };
    MockServerState.prototype.assertSawRequestFor = function (url) {
        if (!this.sawRequestFor(url)) {
            throw new Error("Expected request for " + url + ", got none.");
        }
    };
    MockServerState.prototype.assertNoRequestFor = function (url) {
        if (this.sawRequestFor(url)) {
            throw new Error("Expected no request for " + url + " but saw one.");
        }
    };
    MockServerState.prototype.sawRequestFor = function (url) {
        var matching = this.requests.filter(function (req) { return req.url.split('?')[0] === url; });
        if (matching.length > 0) {
            this.requests = this.requests.filter(function (req) { return req !== matching[0]; });
            return true;
        }
        return false;
    };
    MockServerState.prototype.assertNoOtherRequests = function () {
        if (!this.noOtherRequests()) {
            throw new Error("Expected no other requests, got requests for " + this.requests.map(function (req) { return req.url.split('?')[0]; }).join(', '));
        }
    };
    MockServerState.prototype.noOtherRequests = function () { return this.requests.length === 0; };
    MockServerState.prototype.clearRequests = function () { this.requests = []; };
    MockServerState.prototype.reset = function () {
        var _this = this;
        this.clearRequests();
        this.nextRequest = new Promise(function (resolve) { _this.resolveNextRequest = resolve; });
        this.gate = Promise.resolve();
        this.resolve = null;
        this.online = true;
    };
    return MockServerState;
}());
exports.MockServerState = MockServerState;
function tmpManifestSingleAssetGroup(fs) {
    var files = fs.list();
    var hashTable = {};
    files.forEach(function (path) { hashTable[path] = fs.lookup(path).hash; });
    return {
        configVersion: 1,
        index: '/index.html',
        assetGroups: [
            {
                name: 'group',
                installMode: 'prefetch',
                updateMode: 'prefetch',
                urls: files,
                patterns: [],
            },
        ],
        navigationUrls: [], hashTable: hashTable,
    };
}
exports.tmpManifestSingleAssetGroup = tmpManifestSingleAssetGroup;
function tmpHashTableForFs(fs, breakHashes) {
    if (breakHashes === void 0) { breakHashes = {}; }
    var table = {};
    fs.list().forEach(function (path) {
        var file = fs.lookup(path);
        if (file.hashThisFile) {
            table[path] = file.hash;
            if (breakHashes[path]) {
                table[path] = table[path].split('').reverse().join('');
            }
        }
    });
    return table;
}
exports.tmpHashTableForFs = tmpHashTableForFs;
function tmpHashTable(manifest) {
    var map = new Map();
    Object.keys(manifest.hashTable).forEach(function (url) {
        var hash = manifest.hashTable[url];
        map.set(url, hash);
    });
    return map;
}
exports.tmpHashTable = tmpHashTable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL3dvcmtlci90ZXN0aW5nL21vY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdILG9DQUFpQztBQUVqQyxpQ0FBcUM7QUFNckM7SUFDRSxrQkFDYSxJQUFZLEVBQVcsUUFBZ0IsRUFBVyxPQUFZLEVBQzlELFlBQXFCO1FBRDZCLHdCQUFBLEVBQUEsWUFBWTtRQUE5RCxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVcsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUFXLFlBQU8sR0FBUCxPQUFPLENBQUs7UUFDOUQsaUJBQVksR0FBWixZQUFZLENBQVM7SUFBRyxDQUFDO0lBRXRDLHNCQUFJLDBCQUFJO2FBQVIsY0FBcUIsT0FBTyxXQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDcEQsZUFBQztBQUFELENBQUMsQUFORCxJQU1DO0FBTlksNEJBQVE7QUFRckI7SUFBQTtRQUNVLGNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBb0IsQ0FBQztJQWFsRCxDQUFDO0lBWEMsdUNBQU8sR0FBUCxVQUFRLElBQVksRUFBRSxRQUFnQixFQUFFLE9BQW1CO1FBQ3pELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELCtDQUFlLEdBQWYsVUFBZ0IsSUFBWSxFQUFFLFFBQWdCLEVBQUUsT0FBbUI7UUFDakUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksUUFBUSxDQUFD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