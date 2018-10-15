/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
export declare class FormBuilderComp {
    form: FormGroup;
    constructor(fb: FormBuilder);
}
export declare class DisabledFormControlComponent {
    private fb;
    control: FormControl;
    constructor(fb: FormBuilder);
}
