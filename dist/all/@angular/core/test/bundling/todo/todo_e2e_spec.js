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
var core_1 = require("@angular/core");
var testing_1 = require("@angular/private/testing");
var path = require("path");
var UTF8 = {
    encoding: 'utf-8'
};
var PACKAGE = 'angular/packages/core/test/bundling/todo';
var BUNDLES = ['bundle.js', 'bundle.min_debug.js', 'bundle.min.js'];
describe('functional test for todo', function () {
    BUNDLES.forEach(function (bundle) {
        describe(bundle, function () {
            it('should render todo', testing_1.withBody('<todo-app></todo-app>', function () { return __awaiter(_this, void 0, void 0, function () {
                var toDoAppComponent;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            require(path.join(PACKAGE, bundle));
                            toDoAppComponent = window.toDoAppComponent;
                            expect(document.body.textContent).toContain('todos');
                            expect(document.body.textContent).toContain('Demonstrate Components');
                            expect(document.body.textContent).toContain('4 items left');
                            document.querySelector('button').click();
                            return [4 /*yield*/, core_1.ɵwhenRendered(toDoAppComponent)];
                        case 1:
                            _a.sent();
                            expect(document.body.textContent).toContain('3 items left');
                            return [2 /*return*/];
                    }
                });
            }); }));
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kb19lMmVfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9idW5kbGluZy90b2RvL3RvZG9fZTJlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsaUJBNEJBOztBQTVCQSxzQ0FBNEQ7QUFDNUQsb0RBQWtEO0FBRWxELDJCQUE2QjtBQUU3QixJQUFNLElBQUksR0FBRztJQUNYLFFBQVEsRUFBRSxPQUFPO0NBQ2xCLENBQUM7QUFDRixJQUFNLE9BQU8sR0FBRywwQ0FBMEMsQ0FBQztBQUMzRCxJQUFNLE9BQU8sR0FBRyxDQUFDLFdBQVcsRUFBRSxxQkFBcUIsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUV0RSxRQUFRLENBQUMsMEJBQTBCLEVBQUU7SUFDbkMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLE1BQU07UUFDcEIsUUFBUSxDQUFDLE1BQU0sRUFBRTtZQUNmLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxrQkFBUSxDQUFDLHVCQUF1QixFQUFFOzs7Ozs0QkFDdEQsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7NEJBRTlCLGdCQUFnQixHQUFJLE1BQWMsQ0FBQyxnQkFBZ0IsQ0FBQzs0QkFDMUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUNyRCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsd0JBQXdCLENBQUMsQ0FBQzs0QkFDdEUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDOzRCQUM1RCxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDOzRCQUMzQyxxQkFBTSxvQkFBWSxDQUFDLGdCQUFnQixDQUFDLEVBQUE7OzRCQUFwQyxTQUFvQyxDQUFDOzRCQUNyQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUM7Ozs7aUJBQzdELENBQUMsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=