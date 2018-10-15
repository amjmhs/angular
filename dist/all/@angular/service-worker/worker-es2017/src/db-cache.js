/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NotFound } from './database';
/**
 * An implementation of a `Database` that uses the `CacheStorage` API to serialize
 * state within mock `Response` objects.
 */
export class CacheDatabase {
    constructor(scope, adapter) {
        this.scope = scope;
        this.adapter = adapter;
        this.tables = new Map();
    }
    'delete'(name) {
        if (this.tables.has(name)) {
            this.tables.delete(name);
        }
        return this.scope.caches.delete(`ngsw:db:${name}`);
    }
    list() {
        return this.scope.caches.keys().then(keys => keys.filter(key => key.startsWith('ngsw:db:')));
    }
    open(name) {
        if (!this.tables.has(name)) {
            const table = this.scope.caches.open(`ngsw:db:${name}`)
                .then(cache => new CacheTable(name, cache, this.adapter));
            this.tables.set(name, table);
        }
        return this.tables.get(name);
    }
}
/**
 * A `Table` backed by a `Cache`.
 */
export class CacheTable {
    constructor(table, cache, adapter) {
        this.table = table;
        this.cache = cache;
        this.adapter = adapter;
    }
    request(key) { return this.adapter.newRequest('/' + key); }
    'delete'(key) { return this.cache.delete(this.request(key)); }
    keys() {
        return this.cache.keys().then(requests => requests.map(req => req.url.substr(1)));
    }
    read(key) {
        return this.cache.match(this.request(key)).then(res => {
            if (res === undefined) {
                return Promise.reject(new NotFound(this.table, key));
            }
            return res.json();
        });
    }
    write(key, value) {
        return this.cache.put(this.request(key), this.adapter.newResponse(JSON.stringify(value)));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGItY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9zZXJ2aWNlLXdvcmtlci93b3JrZXIvc3JjL2RiLWNhY2hlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUdILE9BQU8sRUFBVyxRQUFRLEVBQVEsTUFBTSxZQUFZLENBQUM7QUFHckQ7OztHQUdHO0FBQ0gsTUFBTTtJQUdKLFlBQW9CLEtBQStCLEVBQVUsT0FBZ0I7UUFBekQsVUFBSyxHQUFMLEtBQUssQ0FBMEI7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBRnJFLFdBQU0sR0FBRyxJQUFJLEdBQUcsRUFBK0IsQ0FBQztJQUV3QixDQUFDO0lBRWpGLFFBQVEsQ0FBQyxJQUFZO1FBQ25CLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDMUI7UUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELElBQUk7UUFDRixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvRixDQUFDO0lBRUQsSUFBSSxDQUFDLElBQVk7UUFDZixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUM7aUJBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDNUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUcsQ0FBQztJQUNqQyxDQUFDO0NBQ0Y7QUFFRDs7R0FFRztBQUNILE1BQU07SUFDSixZQUFxQixLQUFhLEVBQVUsS0FBWSxFQUFVLE9BQWdCO1FBQTdELFVBQUssR0FBTCxLQUFLLENBQVE7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFPO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUztJQUFHLENBQUM7SUFFOUUsT0FBTyxDQUFDLEdBQVcsSUFBYSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFcEYsUUFBUSxDQUFDLEdBQVcsSUFBc0IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXhGLElBQUk7UUFDRixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBRUQsSUFBSSxDQUFDLEdBQVc7UUFDZCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDcEQsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO2dCQUNyQixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ3REO1lBQ0QsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsS0FBSyxDQUFDLEdBQVcsRUFBRSxLQUFhO1FBQzlCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1RixDQUFDO0NBQ0YifQ==