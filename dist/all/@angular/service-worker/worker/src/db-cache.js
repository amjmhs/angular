"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = require("./database");
/**
 * An implementation of a `Database` that uses the `CacheStorage` API to serialize
 * state within mock `Response` objects.
 */
var CacheDatabase = /** @class */ (function () {
    function CacheDatabase(scope, adapter) {
        this.scope = scope;
        this.adapter = adapter;
        this.tables = new Map();
    }
    CacheDatabase.prototype['delete'] = function (name) {
        if (this.tables.has(name)) {
            this.tables.delete(name);
        }
        return this.scope.caches.delete("ngsw:db:" + name);
    };
    CacheDatabase.prototype.list = function () {
        return this.scope.caches.keys().then(function (keys) { return keys.filter(function (key) { return key.startsWith('ngsw:db:'); }); });
    };
    CacheDatabase.prototype.open = function (name) {
        var _this = this;
        if (!this.tables.has(name)) {
            var table = this.scope.caches.open("ngsw:db:" + name)
                .then(function (cache) { return new CacheTable(name, cache, _this.adapter); });
            this.tables.set(name, table);
        }
        return this.tables.get(name);
    };
    return CacheDatabase;
}());
exports.CacheDatabase = CacheDatabase;
/**
 * A `Table` backed by a `Cache`.
 */
var CacheTable = /** @class */ (function () {
    function CacheTable(table, cache, adapter) {
        this.table = table;
        this.cache = cache;
        this.adapter = adapter;
    }
    CacheTable.prototype.request = function (key) { return this.adapter.newRequest('/' + key); };
    CacheTable.prototype['delete'] = function (key) { return this.cache.delete(this.request(key)); };
    CacheTable.prototype.keys = function () {
        return this.cache.keys().then(function (requests) { return requests.map(function (req) { return req.url.substr(1); }); });
    };
    CacheTable.prototype.read = function (key) {
        var _this = this;
        return this.cache.match(this.request(key)).then(function (res) {
            if (res === undefined) {
                return Promise.reject(new database_1.NotFound(_this.table, key));
            }
            return res.json();
        });
    };
    CacheTable.prototype.write = function (key, value) {
        return this.cache.put(this.request(key), this.adapter.newResponse(JSON.stringify(value)));
    };
    return CacheTable;
}());
exports.CacheTable = CacheTable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGItY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9zZXJ2aWNlLXdvcmtlci93b3JrZXIvc3JjL2RiLWNhY2hlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsdUNBQXFEO0FBR3JEOzs7R0FHRztBQUNIO0lBR0UsdUJBQW9CLEtBQStCLEVBQVUsT0FBZ0I7UUFBekQsVUFBSyxHQUFMLEtBQUssQ0FBMEI7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBRnJFLFdBQU0sR0FBRyxJQUFJLEdBQUcsRUFBK0IsQ0FBQztJQUV3QixDQUFDO0lBRWpGLGlDQUFRLEdBQVIsVUFBUyxJQUFZO1FBQ25CLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDMUI7UUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFXLElBQU0sQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCw0QkFBSSxHQUFKO1FBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBMUIsQ0FBMEIsQ0FBQyxFQUE5QyxDQUE4QyxDQUFDLENBQUM7SUFDL0YsQ0FBQztJQUVELDRCQUFJLEdBQUosVUFBSyxJQUFZO1FBQWpCLGlCQU9DO1FBTkMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzFCLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFXLElBQU0sQ0FBQztpQkFDcEMsSUFBSSxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFJLENBQUMsT0FBTyxDQUFDLEVBQXpDLENBQXlDLENBQUMsQ0FBQztZQUM1RSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDOUI7UUFDRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBRyxDQUFDO0lBQ2pDLENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUF4QkQsSUF3QkM7QUF4Qlksc0NBQWE7QUEwQjFCOztHQUVHO0FBQ0g7SUFDRSxvQkFBcUIsS0FBYSxFQUFVLEtBQVksRUFBVSxPQUFnQjtRQUE3RCxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBTztRQUFVLFlBQU8sR0FBUCxPQUFPLENBQVM7SUFBRyxDQUFDO0lBRTlFLDRCQUFPLEdBQWYsVUFBZ0IsR0FBVyxJQUFhLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVwRiw4QkFBUSxHQUFSLFVBQVMsR0FBVyxJQUFzQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFeEYseUJBQUksR0FBSjtRQUNFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQWpCLENBQWlCLENBQUMsRUFBdEMsQ0FBc0MsQ0FBQyxDQUFDO0lBQ3BGLENBQUM7SUFFRCx5QkFBSSxHQUFKLFVBQUssR0FBVztRQUFoQixpQkFPQztRQU5DLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLEdBQUc7WUFDakQsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO2dCQUNyQixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxtQkFBUSxDQUFDLEtBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUN0RDtZQUNELE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELDBCQUFLLEdBQUwsVUFBTSxHQUFXLEVBQUUsS0FBYTtRQUM5QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUYsQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FBQyxBQXZCRCxJQXVCQztBQXZCWSxnQ0FBVSJ9