/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as html from '../../src/ml_parser/ast';
import { ParseTreeResult } from '../../src/ml_parser/html_parser';
import { ParseLocation } from '../../src/parse_util';
export declare function humanizeDom(parseResult: ParseTreeResult, addSourceSpan?: boolean): any[];
export declare function humanizeDomSourceSpans(parseResult: ParseTreeResult): any[];
export declare function humanizeNodes(nodes: html.Node[], addSourceSpan?: boolean): any[];
export declare function humanizeLineColumn(location: ParseLocation): string;
