/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NgControl } from '@angular/forms';
export declare class FormControlComp {
    control: FormControl;
}
export declare class FormGroupComp {
    control: FormControl;
    form: FormGroup;
    myGroup: FormGroup;
    event: Event;
}
export declare class FormControlRadioButtons {
    form: FormGroup;
    showRadio: FormControl;
}
export declare class MyInput implements ControlValueAccessor {
    onInput: EventEmitter<{}>;
    value: string;
    constructor(cd: NgControl);
    writeValue(value: any): void;
    registerOnChange(fn: (value: any) => void): void;
    registerOnTouched(fn: any): void;
    dispatchChangeEvent(): void;
}
export declare class MyInputForm {
    form: FormGroup;
}
export declare class NgModelCustomComp implements ControlValueAccessor {
    model: string;
    isDisabled: boolean;
    changeFn: (value: any) => void;
    writeValue(value: any): void;
    registerOnChange(fn: (value: any) => void): void;
    registerOnTouched(): void;
    setDisabledState(isDisabled: boolean): void;
}
export declare class NgModelCustomWrapper {
    name: string;
    isDisabled: boolean;
}
