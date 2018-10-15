/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare class KeyModel {
    key: number;
    constructor(key: number);
}
export declare class Todo extends KeyModel {
    title: string;
    completed: boolean;
    editTitle: string;
    constructor(key: number, title: string, completed: boolean);
}
export declare class TodoFactory {
    private _uid;
    nextUid(): number;
    create(title: string, isCompleted: boolean): Todo;
}
export declare class Store<T extends KeyModel> {
    list: T[];
    add(record: T): void;
    remove(record: T): void;
    removeBy(callback: (record: T) => boolean): void;
}
