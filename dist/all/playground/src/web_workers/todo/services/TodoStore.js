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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
// base model for RecordStore
var KeyModel = /** @class */ (function () {
    function KeyModel(key) {
        this.key = key;
    }
    return KeyModel;
}());
exports.KeyModel = KeyModel;
var Todo = /** @class */ (function (_super) {
    __extends(Todo, _super);
    function Todo(key, title, completed) {
        var _this = _super.call(this, key) || this;
        _this.title = title;
        _this.completed = completed;
        _this.editTitle = title;
        return _this;
    }
    return Todo;
}(KeyModel));
exports.Todo = Todo;
var TodoFactory = /** @class */ (function () {
    function TodoFactory() {
        this._uid = 0;
    }
    TodoFactory.prototype.nextUid = function () { return ++this._uid; };
    TodoFactory.prototype.create = function (title, isCompleted) {
        return new Todo(this.nextUid(), title, isCompleted);
    };
    TodoFactory = __decorate([
        core_1.Injectable()
    ], TodoFactory);
    return TodoFactory;
}());
exports.TodoFactory = TodoFactory;
// Store manages any generic item that inherits from KeyModel
var Store = /** @class */ (function () {
    function Store() {
        this.list = [];
    }
    Store.prototype.add = function (record) { this.list.push(record); };
    Store.prototype.remove = function (record) { this.removeBy(function (item) { return item === record; }); };
    Store.prototype.removeBy = function (callback) {
        this.list = this.list.filter(function (record) { return !callback(record); });
    };
    Store = __decorate([
        core_1.Injectable()
    ], Store);
    return Store;
}());
exports.Store = Store;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG9kb1N0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL3NyYy93ZWJfd29ya2Vycy90b2RvL3NlcnZpY2VzL1RvZG9TdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBeUM7QUFFekMsNkJBQTZCO0FBQzdCO0lBQ0Usa0JBQW1CLEdBQVc7UUFBWCxRQUFHLEdBQUgsR0FBRyxDQUFRO0lBQUcsQ0FBQztJQUNwQyxlQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGWSw0QkFBUTtBQUlyQjtJQUEwQix3QkFBUTtJQUVoQyxjQUFZLEdBQVcsRUFBUyxLQUFhLEVBQVMsU0FBa0I7UUFBeEUsWUFDRSxrQkFBTSxHQUFHLENBQUMsU0FFWDtRQUgrQixXQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVMsZUFBUyxHQUFULFNBQVMsQ0FBUztRQUV0RSxLQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQzs7SUFDekIsQ0FBQztJQUNILFdBQUM7QUFBRCxDQUFDLEFBTkQsQ0FBMEIsUUFBUSxHQU1qQztBQU5ZLG9CQUFJO0FBU2pCO0lBREE7UUFFVSxTQUFJLEdBQVcsQ0FBQyxDQUFDO0lBTzNCLENBQUM7SUFMQyw2QkFBTyxHQUFQLGNBQW9CLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUV6Qyw0QkFBTSxHQUFOLFVBQU8sS0FBYSxFQUFFLFdBQW9CO1FBQ3hDLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBUFUsV0FBVztRQUR2QixpQkFBVSxFQUFFO09BQ0EsV0FBVyxDQVF2QjtJQUFELGtCQUFDO0NBQUEsQUFSRCxJQVFDO0FBUlksa0NBQVc7QUFVeEIsNkRBQTZEO0FBRTdEO0lBREE7UUFFRSxTQUFJLEdBQVEsRUFBRSxDQUFDO0lBU2pCLENBQUM7SUFQQyxtQkFBRyxHQUFILFVBQUksTUFBUyxJQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVoRCxzQkFBTSxHQUFOLFVBQU8sTUFBUyxJQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxJQUFJLEtBQUssTUFBTSxFQUFmLENBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVyRSx3QkFBUSxHQUFSLFVBQVMsUUFBZ0M7UUFDdkMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFDLE1BQU0sSUFBSyxPQUFBLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFqQixDQUFpQixDQUFDLENBQUM7SUFDOUQsQ0FBQztJQVRVLEtBQUs7UUFEakIsaUJBQVUsRUFBRTtPQUNBLEtBQUssQ0FVakI7SUFBRCxZQUFDO0NBQUEsQUFWRCxJQVVDO0FBVlksc0JBQUsifQ==