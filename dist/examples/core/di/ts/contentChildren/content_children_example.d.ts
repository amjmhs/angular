/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { QueryList } from '@angular/core';
export declare class Pane {
    id: string;
}
export declare class Tab {
    topLevelPanes: QueryList<Pane>;
    arbitraryNestedPanes: QueryList<Pane>;
    readonly serializedPanes: string;
    readonly serializedNestedPanes: string;
}
export declare class ContentChildrenComp {
    shouldShow: boolean;
    show(): void;
}
