/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Store, Todo, TodoFactory } from './services/TodoStore';
export declare class TodoApp {
    todoStore: Store<Todo>;
    factory: TodoFactory;
    todoEdit: Todo;
    inputValue: string;
    hideActive: boolean;
    hideCompleted: boolean;
    isComplete: boolean;
    constructor(todoStore: Store<Todo>, factory: TodoFactory);
    enterTodo(): void;
    doneEditing($event: KeyboardEvent, todo: Todo): void;
    editTodo(todo: Todo): void;
    addTodo(newTitle: string): void;
    completeMe(todo: Todo): void;
    toggleCompleted(): void;
    toggleActive(): void;
    showAll(): void;
    deleteMe(todo: Todo): void;
    toggleAll($event: MouseEvent): void;
    clearCompleted(): void;
}
