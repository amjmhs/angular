/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { UpgradeAdapterRef } from '@angular/upgrade';
import * as angular from '@angular/upgrade/src/common/angular1';
export * from '../common/test_helpers';
export declare function $apply(adapter: UpgradeAdapterRef, exp: angular.Ng1Expression): void;
export declare function $digest(adapter: UpgradeAdapterRef): void;
