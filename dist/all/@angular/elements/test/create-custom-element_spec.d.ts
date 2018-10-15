/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Subject } from 'rxjs';
import { NgElementStrategy, NgElementStrategyEvent, NgElementStrategyFactory } from '../src/element-strategy';
export declare class TestStrategy implements NgElementStrategy {
    connectedElement: HTMLElement | null;
    disconnectCalled: boolean;
    inputs: Map<string, any>;
    events: Subject<NgElementStrategyEvent>;
    connect(element: HTMLElement): void;
    disconnect(): void;
    getInputValue(propName: string): any;
    setInputValue(propName: string, value: string): void;
}
export declare class TestStrategyFactory implements NgElementStrategyFactory {
    testStrategy: TestStrategy;
    create(): NgElementStrategy;
}
