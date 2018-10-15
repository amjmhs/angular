/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterViewInit, QueryList } from '@angular/core';
export declare class Pane {
    id: string;
}
export declare class ViewChildrenComp implements AfterViewInit {
    panes: QueryList<Pane>;
    serializedPanes: string;
    shouldShow: boolean;
    show(): void;
    ngAfterViewInit(): void;
    calculateSerializedPanes(): void;
}
