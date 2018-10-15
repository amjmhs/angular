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
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var TodoStore_1 = require("./app/TodoStore");
var TodoApp = /** @class */ (function () {
    function TodoApp(todoStore, factory) {
        this.todoStore = todoStore;
        this.factory = factory;
        this.todoEdit = null;
    }
    TodoApp.prototype.enterTodo = function (inputElement) {
        this.addTodo(inputElement.value);
        inputElement.value = '';
    };
    TodoApp.prototype.editTodo = function (todo) { this.todoEdit = todo; };
    TodoApp.prototype.doneEditing = function ($event, todo) {
        var which = $event.which;
        var target = $event.target;
        if (which === 13) {
            todo.title = target.value;
            this.todoEdit = null;
        }
        else if (which === 27) {
            this.todoEdit = null;
            target.value = todo.title;
        }
    };
    TodoApp.prototype.addTodo = function (newTitle) { this.todoStore.add(this.factory.create(newTitle, false)); };
    TodoApp.prototype.completeMe = function (todo) { todo.completed = !todo.completed; };
    TodoApp.prototype.deleteMe = function (todo) { this.todoStore.remove(todo); };
    TodoApp.prototype.toggleAll = function ($event) {
        var isComplete = $event.target.checked;
        this.todoStore.list.forEach(function (todo) { todo.completed = isComplete; });
    };
    TodoApp.prototype.clearCompleted = function () { this.todoStore.removeBy(function (todo) { return todo.completed; }); };
    TodoApp = __decorate([
        core_1.Component({ selector: 'todo-app', viewProviders: [TodoStore_1.Store, TodoStore_1.TodoFactory], templateUrl: 'todo.html' }),
        __metadata("design:paramtypes", [TodoStore_1.Store, TodoStore_1.TodoFactory])
    ], TodoApp);
    return TodoApp;
}());
var ExampleModule = /** @class */ (function () {
    function ExampleModule() {
    }
    ExampleModule = __decorate([
        core_1.NgModule({ declarations: [TodoApp], bootstrap: [TodoApp], imports: [platform_browser_1.BrowserModule] })
    ], ExampleModule);
    return ExampleModule;
}());
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(ExampleModule);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL3RvZG8vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBa0Q7QUFDbEQsOERBQXdEO0FBQ3hELDhFQUF5RTtBQUV6RSw2Q0FBeUQ7QUFHekQ7SUFHRSxpQkFBbUIsU0FBc0IsRUFBUyxPQUFvQjtRQUFuRCxjQUFTLEdBQVQsU0FBUyxDQUFhO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBYTtRQUZ0RSxhQUFRLEdBQVMsSUFBSSxDQUFDO0lBRW1ELENBQUM7SUFFMUUsMkJBQVMsR0FBVCxVQUFVLFlBQThCO1FBQ3RDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLFlBQVksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCwwQkFBUSxHQUFSLFVBQVMsSUFBVSxJQUFVLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUVwRCw2QkFBVyxHQUFYLFVBQVksTUFBcUIsRUFBRSxJQUFVO1FBQzNDLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDM0IsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQTBCLENBQUM7UUFDakQsSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFFO1lBQ2hCLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztTQUN0QjthQUFNLElBQUksS0FBSyxLQUFLLEVBQUUsRUFBRTtZQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUNyQixNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDM0I7SUFDSCxDQUFDO0lBRUQseUJBQU8sR0FBUCxVQUFRLFFBQWdCLElBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTdGLDRCQUFVLEdBQVYsVUFBVyxJQUFVLElBQVUsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBRWxFLDBCQUFRLEdBQVIsVUFBUyxJQUFVLElBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTNELDJCQUFTLEdBQVQsVUFBVSxNQUFrQjtRQUMxQixJQUFNLFVBQVUsR0FBSSxNQUFNLENBQUMsTUFBMkIsQ0FBQyxPQUFPLENBQUM7UUFDL0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBVSxJQUFPLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQUVELGdDQUFjLEdBQWQsY0FBeUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBQyxJQUFVLElBQUssT0FBQSxJQUFJLENBQUMsU0FBUyxFQUFkLENBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQW5DL0UsT0FBTztRQURaLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxDQUFDLGlCQUFLLEVBQUUsdUJBQVcsQ0FBQyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUMsQ0FBQzt5Q0FJakUsaUJBQUssRUFBd0IsdUJBQVc7T0FIbEUsT0FBTyxDQW9DWjtJQUFELGNBQUM7Q0FBQSxBQXBDRCxJQW9DQztBQUdEO0lBQUE7SUFDQSxDQUFDO0lBREssYUFBYTtRQURsQixlQUFRLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxnQ0FBYSxDQUFDLEVBQUMsQ0FBQztPQUM5RSxhQUFhLENBQ2xCO0lBQUQsb0JBQUM7Q0FBQSxBQURELElBQ0M7QUFFRDtJQUNFLGlEQUFzQixFQUFFLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFGRCxvQkFFQyJ9