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
import { sha1Binary } from './sha1';
var fs = require('fs');
var path = require('path');
var NodeFilesystem = /** @class */ (function () {
    function NodeFilesystem(base) {
        this.base = base;
    }
    NodeFilesystem.prototype.list = function (_path) {
        return __awaiter(this, void 0, void 0, function () {
            var dir, entries, files;
            var _this = this;
            return __generator(this, function (_a) {
                dir = this.canonical(_path);
                entries = fs.readdirSync(dir).map(function (entry) { return ({ entry: entry, stats: fs.statSync(path.join(dir, entry)) }); });
                files = entries.filter(function (entry) { return !entry.stats.isDirectory(); })
                    .map(function (entry) { return path.posix.join(_path, entry.entry); });
                return [2 /*return*/, entries.filter(function (entry) { return entry.stats.isDirectory(); })
                        .map(function (entry) { return path.posix.join(_path, entry.entry); })
                        .reduce(function (list, subdir) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, list];
                            case 1:
                                _b = (_a = (_c.sent())).concat;
                                return [4 /*yield*/, this.list(subdir)];
                            case 2: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                        }
                    }); }); }, Promise.resolve(files))];
            });
        });
    };
    NodeFilesystem.prototype.read = function (_path) {
        return __awaiter(this, void 0, void 0, function () {
            var file;
            return __generator(this, function (_a) {
                file = this.canonical(_path);
                return [2 /*return*/, fs.readFileSync(file).toString()];
            });
        });
    };
    NodeFilesystem.prototype.hash = function (_path) {
        return __awaiter(this, void 0, void 0, function () {
            var file, contents;
            return __generator(this, function (_a) {
                file = this.canonical(_path);
                contents = fs.readFileSync(file);
                return [2 /*return*/, sha1Binary(contents)];
            });
        });
    };
    NodeFilesystem.prototype.write = function (_path, contents) {
        return __awaiter(this, void 0, void 0, function () {
            var file;
            return __generator(this, function (_a) {
                file = this.canonical(_path);
                fs.writeFileSync(file, contents);
                return [2 /*return*/];
            });
        });
    };
    NodeFilesystem.prototype.canonical = function (_path) { return path.posix.join(this.base, _path); };
    return NodeFilesystem;
}());
export { NodeFilesystem };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXN5c3RlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL2NsaS9maWxlc3lzdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUVsQyxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTdCO0lBQ0Usd0JBQW9CLElBQVk7UUFBWixTQUFJLEdBQUosSUFBSSxDQUFRO0lBQUcsQ0FBQztJQUU5Qiw2QkFBSSxHQUFWLFVBQVcsS0FBYTs7Ozs7Z0JBQ2hCLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM1QixPQUFPLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQ25DLFVBQUMsS0FBYSxJQUFLLE9BQUEsQ0FBQyxFQUFDLEtBQUssT0FBQSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFwRCxDQUFvRCxDQUFDLENBQUM7Z0JBQ3ZFLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsS0FBVSxJQUFLLE9BQUEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUExQixDQUEwQixDQUFDO3FCQUNyRCxHQUFHLENBQUMsVUFBQyxLQUFVLElBQUssT0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFuQyxDQUFtQyxDQUFDLENBQUM7Z0JBRTVFLHNCQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQyxLQUFVLElBQUssT0FBQSxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUF6QixDQUF5QixDQUFDO3lCQUMzRCxHQUFHLENBQUMsVUFBQyxLQUFVLElBQUssT0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFuQyxDQUFtQyxDQUFDO3lCQUN4RCxNQUFNLENBQ0gsVUFBTSxJQUF1QixFQUFFLE1BQWM7O29DQUN4QyxxQkFBTSxJQUFJLEVBQUE7O2dDQUFYLEtBQUEsQ0FBQSxLQUFBLENBQUMsU0FBVSxDQUFDLENBQUEsQ0FBQyxNQUFNLENBQUE7Z0NBQUMscUJBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBQTtvQ0FBM0Msc0JBQUEsY0FBb0IsU0FBdUIsRUFBQyxFQUFBOzs2QkFBQSxFQUNoRCxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUM7OztLQUNqQztJQUVLLDZCQUFJLEdBQVYsVUFBVyxLQUFhOzs7O2dCQUNoQixJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbkMsc0JBQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBQzs7O0tBQ3pDO0lBRUssNkJBQUksR0FBVixVQUFXLEtBQWE7Ozs7Z0JBQ2hCLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM3QixRQUFRLEdBQVcsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDL0Msc0JBQU8sVUFBVSxDQUFDLFFBQThCLENBQUMsRUFBQzs7O0tBQ25EO0lBRUssOEJBQUssR0FBWCxVQUFZLEtBQWEsRUFBRSxRQUFnQjs7OztnQkFDbkMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ25DLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDOzs7O0tBQ2xDO0lBRU8sa0NBQVMsR0FBakIsVUFBa0IsS0FBYSxJQUFZLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEYscUJBQUM7QUFBRCxDQUFDLEFBbkNELElBbUNDIn0=