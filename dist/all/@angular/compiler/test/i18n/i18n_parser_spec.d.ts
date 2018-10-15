/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
export declare function _humanizeMessages(html: string, implicitTags?: string[], implicitAttrs?: {
    [k: string]: string[];
}): [string[], string, string][];
export declare function _extractMessages(html: string, implicitTags?: string[], implicitAttrs?: {
    [k: string]: string[];
}): Message[];
