"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var TodoStore_1 = require("./services/TodoStore");
var TodoApp = /** @class */ (function () {
    function TodoApp(todoStore, factory) {
        this.todoStore = todoStore;
        this.factory = factory;
        this.todoEdit = null;
        this.hideActive = false;
        this.hideCompleted = false;
        this.isComplete = false;
    }
    TodoApp.prototype.enterTodo = function () {
        this.addTodo(this.inputValue);
        this.inputValue = '';
    };
    TodoApp.prototype.doneEditing = function ($event, todo) {
        var which = $event.keyCode;
        if (which === 13) {
            todo.title = todo.editTitle;
            this.todoEdit = null;
        }
        else if (which === 27) {
            this.todoEdit = null;
            todo.editTitle = todo.title;
        }
    };
    TodoApp.prototype.editTodo = function (todo) { this.todoEdit = todo; };
    TodoApp.prototype.addTodo = function (newTitle) { this.todoStore.add(this.factory.create(newTitle, false)); };
    TodoApp.prototype.completeMe = function (todo) { todo.completed = !todo.completed; };
    TodoApp.prototype.toggleCompleted = function () {
        this.hideActive = !this.hideActive;
        this.hideCompleted = false;
    };
    TodoApp.prototype.toggleActive = function () {
        this.hideCompleted = !this.hideCompleted;
        this.hideActive = false;
    };
    TodoApp.prototype.showAll = function () {
        this.hideCompleted = false;
        this.hideActive = false;
    };
    TodoApp.prototype.deleteMe = function (todo) { this.todoStore.remove(todo); };
    TodoApp.prototype.toggleAll = function ($event) {
        var _this = this;
        this.isComplete = !this.isComplete;
        this.todoStore.list.forEach(function (todo) { todo.completed = _this.isComplete; });
    };
    TodoApp.prototype.clearCompleted = function () { this.todoStore.removeBy(function (todo) { return todo.completed; }); };
    TodoApp = __decorate([
        core_1.Component({ selector: 'todo-app', viewProviders: [TodoStore_1.Store, TodoStore_1.TodoFactory], templateUrl: 'todo.html' }),
        __metadata("design:paramtypes", [TodoStore_1.Store, TodoStore_1.TodoFactory])
    ], TodoApp);
    return TodoApp;
}());
exports.TodoApp = TodoApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL3NyYy93ZWJfd29ya2Vycy90b2RvL2luZGV4X2NvbW1vbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUF3QztBQUV4QyxrREFBOEQ7QUFHOUQ7SUFPRSxpQkFBbUIsU0FBc0IsRUFBUyxPQUFvQjtRQUFuRCxjQUFTLEdBQVQsU0FBUyxDQUFhO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBYTtRQU50RSxhQUFRLEdBQVMsSUFBSSxDQUFDO1FBRXRCLGVBQVUsR0FBWSxLQUFLLENBQUM7UUFDNUIsa0JBQWEsR0FBWSxLQUFLLENBQUM7UUFDL0IsZUFBVSxHQUFZLEtBQUssQ0FBQztJQUU2QyxDQUFDO0lBRTFFLDJCQUFTLEdBQVQ7UUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQsNkJBQVcsR0FBWCxVQUFZLE1BQXFCLEVBQUUsSUFBVTtRQUMzQyxJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQzdCLElBQUksS0FBSyxLQUFLLEVBQUUsRUFBRTtZQUNoQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7U0FDdEI7YUFBTSxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUU7WUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztJQUVELDBCQUFRLEdBQVIsVUFBUyxJQUFVLElBQVUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRXBELHlCQUFPLEdBQVAsVUFBUSxRQUFnQixJQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU3Riw0QkFBVSxHQUFWLFVBQVcsSUFBVSxJQUFVLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUVsRSxpQ0FBZSxHQUFmO1FBQ0UsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDbkMsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7SUFDN0IsQ0FBQztJQUVELDhCQUFZLEdBQVo7UUFDRSxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUN6QyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztJQUMxQixDQUFDO0lBRUQseUJBQU8sR0FBUDtRQUNFLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQzFCLENBQUM7SUFFRCwwQkFBUSxHQUFSLFVBQVMsSUFBVSxJQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUzRCwyQkFBUyxHQUFULFVBQVUsTUFBa0I7UUFBNUIsaUJBR0M7UUFGQyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFVLElBQU8sSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckYsQ0FBQztJQUVELGdDQUFjLEdBQWQsY0FBeUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBQyxJQUFVLElBQUssT0FBQSxJQUFJLENBQUMsU0FBUyxFQUFkLENBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQXJEeEUsT0FBTztRQURuQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsQ0FBQyxpQkFBSyxFQUFFLHVCQUFXLENBQUMsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFDLENBQUM7eUNBUWpFLGlCQUFLLEVBQXdCLHVCQUFXO09BUDNELE9BQU8sQ0FzRG5CO0lBQUQsY0FBQztDQUFBLEFBdERELElBc0RDO0FBdERZLDBCQUFPIn0=