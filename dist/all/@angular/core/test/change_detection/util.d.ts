/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { IterableChanges } from '@angular/core/src/change_detection/differs/iterable_differs';
import { KeyValueChanges } from '@angular/core/src/change_detection/differs/keyvalue_differs';
export declare function iterableDifferToString<V>(iterableChanges: IterableChanges<V>): string;
export declare function iterableChangesAsString({ collection, previous, additions, moves, removals, identityChanges }: {
    collection?: any;
    previous?: any;
    additions?: any;
    moves?: any;
    removals?: any;
    identityChanges?: any;
}): string;
export declare function kvChangesAsString(kvChanges: KeyValueChanges<string, any>): string;
export declare function testChangesAsString({ map, previous, additions, changes, removals }: {
    map?: any[];
    previous?: any[];
    additions?: any[];
    changes?: any[];
    removals?: any[];
}): string;
