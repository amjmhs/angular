/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ServiceMessageBrokerFactory } from '@angular/platform-webworker';
export declare class App {
    private _serviceBrokerFactory;
    constructor(_serviceBrokerFactory: ServiceMessageBrokerFactory);
    private _echo;
}
