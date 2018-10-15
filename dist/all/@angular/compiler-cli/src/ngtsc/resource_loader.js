"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
/**
 * `ResourceLoader` which delegates to a `CompilerHost` resource loading method.
 */
var HostResourceLoader = /** @class */ (function () {
    function HostResourceLoader(host) {
        this.host = host;
        this.cache = new Map();
        this.fetching = new Set();
    }
    HostResourceLoader.prototype.preload = function (url) {
        var _this = this;
        if (this.cache.has(url) || this.fetching.has(url)) {
            return undefined;
        }
        var result = this.host(url);
        if (typeof result === 'string') {
            this.cache.set(url, result);
            return undefined;
        }
        else {
            this.fetching.add(url);
            return result.then(function (str) {
                _this.fetching.delete(url);
                _this.cache.set(url, str);
            });
        }
    };
    HostResourceLoader.prototype.load = function (url) {
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }
        var result = this.host(url);
        if (typeof result !== 'string') {
            throw new Error("HostResourceLoader: host(" + url + ") returned a Promise");
        }
        this.cache.set(url, result);
        return result;
    };
    return HostResourceLoader;
}());
exports.HostResourceLoader = HostResourceLoader;
/**
 * `ResourceLoader` which directly uses the filesystem to resolve resources synchronously.
 */
var FileResourceLoader = /** @class */ (function () {
    function FileResourceLoader() {
    }
    FileResourceLoader.prototype.load = function (url) { return fs.readFileSync(url, 'utf8'); };
    return FileResourceLoader;
}());
exports.FileResourceLoader = FileResourceLoader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2VfbG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9yZXNvdXJjZV9sb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCx1QkFBeUI7QUFJekI7O0dBRUc7QUFDSDtJQUlFLDRCQUFvQixJQUErQztRQUEvQyxTQUFJLEdBQUosSUFBSSxDQUEyQztRQUgzRCxVQUFLLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7UUFDbEMsYUFBUSxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7SUFFaUMsQ0FBQztJQUV2RSxvQ0FBTyxHQUFQLFVBQVEsR0FBVztRQUFuQixpQkFnQkM7UUFmQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2pELE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBRUQsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtZQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDNUIsT0FBTyxTQUFTLENBQUM7U0FDbEI7YUFBTTtZQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFBLEdBQUc7Z0JBQ3BCLEtBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMxQixLQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFRCxpQ0FBSSxHQUFKLFVBQUssR0FBVztRQUNkLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDdkIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUcsQ0FBQztTQUM5QjtRQUVELElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7WUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBNEIsR0FBRyx5QkFBc0IsQ0FBQyxDQUFDO1NBQ3hFO1FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFDSCx5QkFBQztBQUFELENBQUMsQUFwQ0QsSUFvQ0M7QUFwQ1ksZ0RBQWtCO0FBc0MvQjs7R0FFRztBQUNIO0lBQUE7SUFFQSxDQUFDO0lBREMsaUNBQUksR0FBSixVQUFLLEdBQVcsSUFBWSxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRSx5QkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRlksZ0RBQWtCIn0=