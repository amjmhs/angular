/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare class Pane {
    id: string;
}
export declare class ViewChildComp {
    pane: Pane;
    selectedPane: string;
    shouldShow: boolean;
    toggle(): void;
}
