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
var testing_1 = require("@angular/private/testing");
describe('testing', function () {
    describe('withBody', function () {
        var passed;
        beforeEach(function () { return passed = false; });
        afterEach(function () { return expect(passed).toEqual(true); });
        it('should set up body', testing_1.withBody('<span>works!</span>', function () {
            expect(document.body.innerHTML).toEqual('<span>works!</span>');
            passed = true;
        }));
        it('should support promises', testing_1.withBody('<span>works!</span>', function () {
            return Promise.resolve(true).then(function () { return passed = true; });
        }));
        it('should support async and await', testing_1.withBody('<span>works!</span>', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve(true)];
                    case 1:
                        _a.sent();
                        passed = true;
                        return [2 /*return*/];
                }
            });
        }); }));
    });
    describe('domino', function () {
        it('should have document present', function () {
            // In Browser this tests passes, bun we also want to make sure we pass in node.js
            // We expect that node.js will load domino for us.
            expect(document).toBeTruthy();
        });
    });
    describe('requestAnimationFrame', function () {
        it('should have requestAnimationFrame', function (done) {
            // In Browser we have requestAnimationFrame, but verify that we also have it node.js
            requestAnimationFrame(done);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGluZ19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3JlbmRlcjMvdGVzdGluZ19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILGlCQXVDRzs7QUF2Q0gsb0RBQWtEO0FBRWxELFFBQVEsQ0FBQyxTQUFTLEVBQUU7SUFDbEIsUUFBUSxDQUFDLFVBQVUsRUFBRTtRQUNuQixJQUFJLE1BQWUsQ0FBQztRQUVwQixVQUFVLENBQUMsY0FBTSxPQUFBLE1BQU0sR0FBRyxLQUFLLEVBQWQsQ0FBYyxDQUFDLENBQUM7UUFDakMsU0FBUyxDQUFDLGNBQU0sT0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUE1QixDQUE0QixDQUFDLENBQUM7UUFFOUMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLGtCQUFRLENBQUMscUJBQXFCLEVBQUU7WUFDcEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDL0QsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAsRUFBRSxDQUFDLHlCQUF5QixFQUFFLGtCQUFRLENBQUMscUJBQXFCLEVBQUU7WUFDekQsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFNLE9BQUEsTUFBTSxHQUFHLElBQUksRUFBYixDQUFhLENBQUMsQ0FBQztRQUN6RCxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAsRUFBRSxDQUFDLGdDQUFnQyxFQUFFLGtCQUFRLENBQUMscUJBQXFCLEVBQUU7Ozs0QkFDaEUscUJBQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBQTs7d0JBQTNCLFNBQTJCLENBQUM7d0JBQzVCLE1BQU0sR0FBRyxJQUFJLENBQUM7Ozs7YUFDZixDQUFDLENBQUMsQ0FBQztJQUNULENBQUMsQ0FBQyxDQUFDO0lBR0gsUUFBUSxDQUFDLFFBQVEsRUFBRTtRQUNqQixFQUFFLENBQUMsOEJBQThCLEVBQUU7WUFDakMsaUZBQWlGO1lBQ2pGLGtEQUFrRDtZQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtRQUNoQyxFQUFFLENBQUMsbUNBQW1DLEVBQUUsVUFBQyxJQUFJO1lBQzNDLG9GQUFvRjtZQUNwRixxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==