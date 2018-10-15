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
require("@angular/core/test/bundling/util/src/reflect_metadata");
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var Todo = /** @class */ (function () {
    function Todo(title, completed) {
        if (completed === void 0) { completed = false; }
        this.completed = completed;
        this.editing = false;
        this.title = title;
    }
    Object.defineProperty(Todo.prototype, "title", {
        get: function () { return this._title; },
        set: function (value) { this._title = value.trim(); },
        enumerable: true,
        configurable: true
    });
    return Todo;
}());
var TodoStore = /** @class */ (function () {
    function TodoStore() {
        this.todos = [
            new Todo('Demonstrate Components'),
            new Todo('Demonstrate Structural Directives', true),
            new Todo('Demonstrate NgModules'),
            new Todo('Demonstrate zoneless change detection'),
            new Todo('Demonstrate internationalization'),
        ];
    }
    TodoStore.prototype.getWithCompleted = function (completed) {
        return this.todos.filter(function (todo) { return todo.completed === completed; });
    };
    TodoStore.prototype.allCompleted = function () { return this.todos.length === this.getCompleted().length; };
    TodoStore.prototype.setAllTo = function (completed) { this.todos.forEach(function (t) { return t.completed = completed; }); };
    TodoStore.prototype.removeCompleted = function () { this.todos = this.getWithCompleted(false); };
    TodoStore.prototype.getRemaining = function () { return this.getWithCompleted(false); };
    TodoStore.prototype.getCompleted = function () { return this.getWithCompleted(true); };
    TodoStore.prototype.toggleCompletion = function (todo) { todo.completed = !todo.completed; };
    TodoStore.prototype.remove = function (todo) { this.todos.splice(this.todos.indexOf(todo), 1); };
    TodoStore.prototype.add = function (title) { this.todos.push(new Todo(title)); };
    TodoStore = __decorate([
        core_1.Injectable({ providedIn: 'root' })
    ], TodoStore);
    return TodoStore;
}());
var ToDoAppComponent = /** @class */ (function () {
    function ToDoAppComponent(todoStore) {
        this.todoStore = todoStore;
        this.newTodoText = '';
    }
    ToDoAppComponent.prototype.stopEditing = function (todo, editedTitle) {
        todo.title = editedTitle;
        todo.editing = false;
    };
    ToDoAppComponent.prototype.cancelEditingTodo = function (todo) { todo.editing = false; };
    ToDoAppComponent.prototype.updateEditingTodo = function (todo, editedTitle) {
        editedTitle = editedTitle.trim();
        todo.editing = false;
        if (editedTitle.length === 0) {
            return this.todoStore.remove(todo);
        }
        todo.title = editedTitle;
    };
    ToDoAppComponent.prototype.editTodo = function (todo) { todo.editing = true; };
    ToDoAppComponent.prototype.removeCompleted = function () { this.todoStore.removeCompleted(); };
    ToDoAppComponent.prototype.toggleCompletion = function (todo) { this.todoStore.toggleCompletion(todo); };
    ToDoAppComponent.prototype.remove = function (todo) { this.todoStore.remove(todo); };
    ToDoAppComponent.prototype.addTodo = function () {
        if (this.newTodoText.trim().length) {
            this.todoStore.add(this.newTodoText);
            this.newTodoText = '';
        }
    };
    ToDoAppComponent = __decorate([
        core_1.Component({
            selector: 'todo-app',
            // TODO(misko): make this work with `[(ngModel)]`
            template: "\n  <section class=\"todoapp\">\n    <header class=\"header\">\n      <h1>todos</h1>\n      <input class=\"new-todo\" placeholder=\"What needs to be done?\" autofocus=\"\"\n             [value]=\"newTodoText\"\n             (keyup)=\"$event.code == 'Enter' ? addTodo() : newTodoText = $event.target.value\">\n    </header>\n    <section *ngIf=\"todoStore.todos.length > 0\" class=\"main\">\n      <input *ngIf=\"todoStore.todos.length\"\n             #toggleall class=\"toggle-all\" type=\"checkbox\"\n             [checked]=\"todoStore.allCompleted()\"\n             (click)=\"todoStore.setAllTo(toggleall.checked)\">\n      <ul class=\"todo-list\">\n        <li *ngFor=\"let todo of todoStore.todos\"\n            [class.completed]=\"todo.completed\"\n            [class.editing]=\"todo.editing\">\n          <div class=\"view\">\n            <input class=\"toggle\" type=\"checkbox\"\n                   (click)=\"toggleCompletion(todo)\"\n                   [checked]=\"todo.completed\">\n            <label (dblclick)=\"editTodo(todo)\">{{todo.title}}</label>\n            <button class=\"destroy\" (click)=\"remove(todo)\"></button>\n          </div>\n          <input *ngIf=\"todo.editing\"\n                 class=\"edit\" #editedtodo\n                 [value]=\"todo.title\"\n                 (blur)=\"stopEditing(todo, editedtodo.value)\"\n                 (keyup)=\"todo.title = $event.target.value\"\n                 (keyup)=\"$event.code == 'Enter' && updateEditingTodo(todo, editedtodo.value)\"\n                 (keyup)=\"$event.code == 'Escape' && cancelEditingTodo(todo)\">\n        </li>\n      </ul>\n    </section>\n    <footer *ngIf=\"todoStore.todos.length > 0\" class=\"footer\">\n      <span class=\"todo-count\">\n        <strong>{{todoStore.getRemaining().length}}</strong>\n        {{todoStore.getRemaining().length == 1 ? 'item' : 'items'}} left\n      </span>\n      <button *ngIf=\"todoStore.getCompleted().length > 0\"\n              class=\"clear-completed\"\n              (click)=\"removeCompleted()\">\n        Clear completed\n      </button>\n    </footer>\n  </section>\n  ",
        }),
        __metadata("design:paramtypes", [TodoStore])
    ], ToDoAppComponent);
    return ToDoAppComponent;
}());
var ToDoAppModule = /** @class */ (function () {
    function ToDoAppModule() {
    }
    ToDoAppModule = __decorate([
        core_1.NgModule({ declarations: [ToDoAppComponent], imports: [common_1.CommonModule] })
    ], ToDoAppModule);
    return ToDoAppModule;
}());
// TODO(misko): create cleaner way to publish component into global location for tests.
window.toDoAppComponent = core_1.ɵrenderComponent(ToDoAppComponent);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvYnVuZGxpbmcvdG9kby9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILGlFQUErRDtBQUUvRCwwQ0FBNkM7QUFDN0Msc0NBQW1HO0FBRW5HO0lBUUUsY0FBWSxLQUFhLEVBQVMsU0FBMEI7UUFBMUIsMEJBQUEsRUFBQSxpQkFBMEI7UUFBMUIsY0FBUyxHQUFULFNBQVMsQ0FBaUI7UUFDMUQsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztJQU5ELHNCQUFJLHVCQUFLO2FBQVQsY0FBYyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2FBQ25DLFVBQVUsS0FBYSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzs7O09BRHJCO0lBT3JDLFdBQUM7QUFBRCxDQUFDLEFBWkQsSUFZQztBQUdEO0lBREE7UUFFRSxVQUFLLEdBQWdCO1lBQ25CLElBQUksSUFBSSxDQUFDLHdCQUF3QixDQUFDO1lBQ2xDLElBQUksSUFBSSxDQUFDLG1DQUFtQyxFQUFFLElBQUksQ0FBQztZQUNuRCxJQUFJLElBQUksQ0FBQyx1QkFBdUIsQ0FBQztZQUNqQyxJQUFJLElBQUksQ0FBQyx1Q0FBdUMsQ0FBQztZQUNqRCxJQUFJLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQztTQUM3QyxDQUFDO0lBcUJKLENBQUM7SUFuQlMsb0NBQWdCLEdBQXhCLFVBQXlCLFNBQWtCO1FBQ3pDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFVLElBQUssT0FBQSxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBNUIs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