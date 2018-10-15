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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var resource_loading_1 = require("../../src/metadata/resource_loading");
var directive_1 = require("../../src/render3/jit/directive");
describe('resource_loading', function () {
    describe('error handling', function () {
        afterEach(resource_loading_1.clearResolutionOfComponentResourcesQueue);
        it('should throw an error when compiling component that has unresolved templateUrl', function () {
            var MyComponent = (/** @class */ (function () {
                function MyComponent() {
                }
                return MyComponent;
            }()));
            directive_1.compileComponent(MyComponent, { templateUrl: 'someUrl' });
            expect(function () { return MyComponent.ngComponentDef; }).toThrowError("\nComponent 'MyComponent' is not resolved:\n - templateUrl: someUrl\nDid you run and wait for 'resolveComponentResources()'?".trim());
        });
        it('should throw an error when compiling component that has unresolved styleUrls', function () {
            var MyComponent = (/** @class */ (function () {
                function MyComponent() {
                }
                return MyComponent;
            }()));
            directive_1.compileComponent(MyComponent, { styleUrls: ['someUrl1', 'someUrl2'] });
            expect(function () { return MyComponent.ngComponentDef; }).toThrowError("\nComponent 'MyComponent' is not resolved:\n - styleUrls: [\"someUrl1\",\"someUrl2\"]\nDid you run and wait for 'resolveComponentResources()'?".trim());
        });
        it('should throw an error when compiling component that has unresolved templateUrl and styleUrls', function () {
            var MyComponent = (/** @class */ (function () {
                function MyComponent() {
                }
                return MyComponent;
            }()));
            directive_1.compileComponent(MyComponent, { templateUrl: 'someUrl', styleUrls: ['someUrl1', 'someUrl2'] });
            expect(function () { return MyComponent.ngComponentDef; }).toThrowError("\nComponent 'MyComponent' is not resolved:\n - templateUrl: someUrl\n - styleUrls: [\"someUrl1\",\"someUrl2\"]\nDid you run and wait for 'resolveComponentResources()'?".trim());
        });
    });
    describe('resolution', function () {
        var URLS = {
            'test://content': Promise.resolve('content'),
            'test://style1': Promise.resolve('style1'),
            'test://style2': Promise.resolve('style2'),
        };
        var resourceFetchCount;
        function testResolver(url) {
            resourceFetchCount++;
            return URLS[url] || Promise.reject('NOT_FOUND: ' + url);
        }
        beforeEach(function () { return resourceFetchCount = 0; });
        it('should resolve template', function () { return __awaiter(_this, void 0, void 0, function () {
            var MyComponent, metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        MyComponent = (/** @class */ (function () {
                            function MyComponent() {
                            }
                            return MyComponent;
                        }()));
                        metadata = { templateUrl: 'test://content' };
                        directive_1.compileComponent(MyComponent, metadata);
                        return [4 /*yield*/, resource_loading_1.resolveComponentResources(testResolver)];
                    case 1:
                        _a.sent();
                        expect(MyComponent.ngComponentDef).toBeDefined();
                        expect(metadata.templateUrl).toBe(undefined);
                        expect(metadata.template).toBe('content');
                        expect(resourceFetchCount).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should resolve styleUrls', function () { return __awaiter(_this, void 0, void 0, function () {
            var MyComponent, metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        MyComponent = (/** @class */ (function () {
                            function MyComponent() {
                            }
                            return MyComponent;
                        }()));
                        metadata = { template: '', styleUrls: ['test://style1', 'test://style2'] };
                        directive_1.compileComponent(MyComponent, metadata);
                        return [4 /*yield*/, resource_loading_1.resolveComponentResources(testResolver)];
                    case 1:
                        _a.sent();
                        expect(MyComponent.ngComponentDef).toBeDefined();
                        expect(metadata.styleUrls).toBe(undefined);
                        expect(metadata.styles).toEqual(['style1', 'style2']);
                        expect(resourceFetchCount).toBe(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should cache multiple resolution to same URL', function () { return __awaiter(_this, void 0, void 0, function () {
            var MyComponent, metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        MyComponent = (/** @class */ (function () {
                            function MyComponent() {
                            }
                            return MyComponent;
                        }()));
                        metadata = { template: '', styleUrls: ['test://style1', 'test://style1'] };
                        directive_1.compileComponent(MyComponent, metadata);
                        return [4 /*yield*/, resource_loading_1.resolveComponentResources(testResolver)];
                    case 1:
                        _a.sent();
                        expect(MyComponent.ngComponentDef).toBeDefined();
                        expect(metadata.styleUrls).toBe(undefined);
                        expect(metadata.styles).toEqual(['style1', 'style1']);
                        expect(resourceFetchCount).toBe(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should keep order even if the resolution is out of order', function () { return __awaiter(_this, void 0, void 0, function () {
            var MyComponent, metadata, resolvers, resolved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        MyComponent = (/** @class */ (function () {
                            function MyComponent() {
                            }
                            return MyComponent;
                        }()));
                        metadata = {
                            template: '',
                            styles: ['existing'],
                            styleUrls: ['test://style1', 'test://style2']
                        };
                        directive_1.compileComponent(MyComponent, metadata);
                        resolvers = [];
                        resolved = resource_loading_1.resolveComponentResources(function (url) { return new Promise(function (resolve, response) { return resolvers.push(url, resolve); }); });
                        // Out of order resolution
                        expect(resolvers[0]).toEqual('test://style1');
                        expect(resolvers[2]).toEqual('test://style2');
                        resolvers[3]('second');
                        resolvers[1]('first');
                        return [4 /*yield*/, resolved];
                    case 1:
                        _a.sent();
                        expect(metadata.styleUrls).toBe(undefined);
                        expect(metadata.styles).toEqual(['existing', 'first', 'second']);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('fetch', function () {
        function fetch(url) {
            return Promise.resolve({
                text: function () { return 'response for ' + url; }
            });
        }
        it('should work with fetch', function () { return __awaiter(_this, void 0, void 0, function () {
            var MyComponent, metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        MyComponent = (/** @class */ (function () {
                            function MyComponent() {
                            }
                            return MyComponent;
                        }()));
                        metadata = { templateUrl: 'test://content' };
                        directive_1.compileComponent(MyComponent, metadata);
                        return [4 /*yield*/, resource_loading_1.resolveComponentResources(fetch)];
                    case 1:
                        _a.sent();
                        expect(MyComponent.ngComponentDef).toBeDefined();
                        expect(metadata.templateUrl).toBe(undefined);
                        expect(metadata.template).toBe('response for test://content');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2VfbG9hZGluZ19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L21ldGFkYXRhL3Jlc291cmNlX2xvYWRpbmdfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxpQkE4SEE7O0FBN0hBLHdFQUF3SDtBQUV4SCw2REFBaUU7QUFFakUsUUFBUSxDQUFDLGtCQUFrQixFQUFFO0lBQzNCLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QixTQUFTLENBQUMsMkRBQXdDLENBQUMsQ0FBQztRQUNwRCxFQUFFLENBQUMsZ0ZBQWdGLEVBQUU7WUFDbkYsSUFBTSxXQUFXLEdBQXVCO2dCQUFDO2dCQUFrQixDQUFDO2dCQUFELGtCQUFDO1lBQUQsQ0FBQyxBQUFuQixJQUEyQixDQUFDO1lBQ3JFLDRCQUFnQixDQUFDLFdBQVcsRUFBRSxFQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sQ0FBQyxjQUFNLE9BQUEsV0FBVyxDQUFDLGNBQWMsRUFBMUIsQ0FBMEIsQ0FBQyxDQUFDLFlBQVksQ0FBQyw4SEFHSixDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsOEVBQThFLEVBQUU7WUFDakYsSUFBTSxXQUFXLEdBQXVCO2dCQUFDO2dCQUFrQixDQUFDO2dCQUFELGtCQUFDO1lBQUQsQ0FBQyxBQUFuQixJQUEyQixDQUFDO1lBQ3JFLDRCQUFnQixDQUFDLFdBQVcsRUFBRSxFQUFDLFNBQVMsRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDckUsTUFBTSxDQUFDLGNBQU0sT0FBQSxXQUFXLENBQUMsY0FBYyxFQUExQixDQUEwQixDQUFDLENBQUMsWUFB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