"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
function wrap(fn) {
    return function (done) { fn().then(function () { return done(); }).catch(function (err) { return done.fail(err); }); };
}
function async_beforeAll(fn) {
    beforeAll(wrap(fn));
}
exports.async_beforeAll = async_beforeAll;
function async_beforeEach(fn) {
    beforeEach(wrap(fn));
}
exports.async_beforeEach = async_beforeEach;
function async_it(desc, fn) {
    it(desc, wrap(fn));
}
exports.async_it = async_it;
function async_fit(desc, fn) {
    // tslint:disable-next-line:no-jasmine-focus
    fit(desc, wrap(fn));
}
exports.async_fit = async_fit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9zZXJ2aWNlLXdvcmtlci93b3JrZXIvdGVzdC9hc3luYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILGNBQWMsRUFBdUI7SUFDbkMsT0FBTyxVQUFDLElBQVksSUFBTyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBTSxPQUFBLElBQUksRUFBRSxFQUFOLENBQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQWQsQ0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckYsQ0FBQztBQUVELHlCQUFnQyxFQUF1QjtJQUNyRCxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEIsQ0FBQztBQUZELDBDQUVDO0FBRUQsMEJBQWlDLEVBQXVCO0lBQ3RELFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QixDQUFDO0FBRkQsNENBRUM7QUFFRCxrQkFBeUIsSUFBWSxFQUFFLEVBQXVCO0lBQzVELEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDckIsQ0FBQztBQUZELDRCQUVDO0FBRUQsbUJBQTBCLElBQVksRUFBRSxFQUF1QjtJQUM3RCw0Q0FBNEM7SUFDNUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0QixDQUFDO0FBSEQsOEJBR0MifQ==