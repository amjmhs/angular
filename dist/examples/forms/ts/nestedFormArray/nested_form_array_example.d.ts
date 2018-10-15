/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FormArray, FormGroup } from '@angular/forms';
export declare class NestedFormArray {
    form: FormGroup;
    readonly cities: FormArray;
    addCity(): void;
    onSubmit(): void;
    setPreset(): void;
}
