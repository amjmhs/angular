/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { setAngularJSGlobal } from '@angular/upgrade/src/common/angular1';
export declare function createWithEachNg1VersionFn(setNg1: typeof setAngularJSGlobal): (specSuite: () => void) => void;
export declare function html(html: string): Element;
export declare function multiTrim(text: string | null | undefined, allSpace?: boolean): string;
export declare function nodes(html: string): any;
export declare const withEachNg1Version: (specSuite: () => void) => void;
