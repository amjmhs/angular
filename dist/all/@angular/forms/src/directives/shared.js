"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var validators_1 = require("../validators");
var checkbox_value_accessor_1 = require("./checkbox_value_accessor");
var default_value_accessor_1 = require("./default_value_accessor");
var normalize_validator_1 = require("./normalize_validator");
var number_value_accessor_1 = require("./number_value_accessor");
var radio_control_value_accessor_1 = require("./radio_control_value_accessor");
var range_value_accessor_1 = require("./range_value_accessor");
var reactive_errors_1 = require("./reactive_errors");
var select_control_value_accessor_1 = require("./select_control_value_accessor");
var select_multiple_control_value_accessor_1 = require("./select_multiple_control_value_accessor");
function controlPath(name, parent) {
    return parent.path.concat([name]);
}
exports.controlPath = controlPath;
function setUpControl(control, dir) {
    if (!control)
        _throwError(dir, 'Cannot find control with');
    if (!dir.valueAccessor)
        _throwError(dir, 'No value accessor for form control with');
    control.validator = validators_1.Validators.compose([control.validator, dir.validator]);
    control.asyncValidator = validators_1.Validators.composeAsync([control.asyncValidator, dir.asyncValidator]);
    dir.valueAccessor.writeValue(control.value);
    setUpViewChangePipeline(control, dir);
    setUpModelChangePipeline(control, dir);
    setUpBlurPipeline(control, dir);
    if (dir.valueAccessor.setDisabledState) {
        control.registerOnDisabledChange(function (isDisabled) { dir.valueAccessor.setDisabledState(isDisabled); });
    }
    // re-run validation when validator binding changes, e.g. minlength=3 -> minlength=4
    dir._rawValidators.forEach(function (validator) {
        if (validator.registerOnValidatorChange)
            validator.registerOnValidatorChange(function () { return control.updateValueAndValidity(); });
    });
    dir._rawAsyncValidators.forEach(function (validator) {
        if (validator.registerOnValidatorChange)
            validator.registerOnValidatorChange(function () { return control.updateValueAndValidity(); });
    });
}
exports.setUpControl = setUpControl;
function cleanUpControl(control, dir) {
    dir.valueAccessor.registerOnChange(function () { return _noControlError(dir); });
    dir.valueAccessor.registerOnTouched(function () { return _noControlError(dir); });
    dir._rawValidators.forEach(function (validator) {
        if (validator.registerOnValidatorChange) {
            validator.registerOnValidatorChange(null);
        }
    });
    dir._rawAsyncValidators.forEach(function (validator) {
        if (validator.registerOnValidatorChange) {
            validator.registerOnValidatorChange(null);
        }
    });
    if (control)
        control._clearChangeFns();
}
exports.cleanUpControl = cleanUpControl;
function setUpViewChangePipeline(control, dir) {
    dir.valueAccessor.registerOnChange(function (newValue) {
        control._pendingValue = newValue;
        control._pendingChange = true;
        control._pendingDirty = true;
        if (control.updateOn === 'change')
            updateControl(control, dir);
    });
}
function setUpBlurPipeline(control, dir) {
    dir.valueAccessor.registerOnTouched(function () {
        control._pendingTouched = true;
        if (control.updateOn === 'blur' && control._pendingChange)
            updateControl(control, dir);
        if (control.updateOn !== 'submit')
            control.markAsTouched();
    });
}
function updateControl(control, dir) {
    if (control._pendingDirty)
        control.markAsDirty();
    control.setValue(control._pendingValue, { emitModelToViewChange: false });
    dir.viewToModelUpdate(control._pendingValue);
    control._pendingChange = false;
}
function setUpModelChangePipeline(control, dir) {
    control.registerOnChange(function (newValue, emitModelEvent) {
        // control -> view
        dir.valueAccessor.writeValue(newValue);
        // control -> ngModel
        if (emitModelEvent)
            dir.viewToModelUpdate(newValue);
    });
}
function setUpFormContainer(control, dir) {
    if (control == null)
        _throwError(dir, 'Cannot find control with');
    control.validator = validators_1.Validators.compose([control.validator, dir.validator]);
    control.asyncValidator = validators_1.Validators.composeAsync([control.asyncValidator, dir.asyncValidator]);
}
exports.setUpFormContainer = setUpFormContainer;
function _noControlError(dir) {
    return _throwError(dir, 'There is no FormControl instance attached to form control element with');
}
function _throwError(dir, message) {
    var messageEnd;
    if (dir.path.length > 1) {
        messageEnd = "path: '" + dir.path.join(' -> ') + "'";
    }
    else if (dir.path[0]) {
        messageEnd = "name: '" + dir.path + "'";
    }
    else {
        messageEnd = 'unspecified name attribute';
    }
    throw new Error(message + " " + messageEnd);
}
function composeValidators(validators) {
    return validators != null ? validators_1.Validators.compose(validators.map(normalize_validator_1.normalizeValidator)) : null;
}
exports.composeValidators = composeValidators;
function composeAsyncValidators(validators) {
    return validators != null ? validators_1.Validators.composeAsync(validators.map(normalize_validator_1.normalizeAsyncValidator)) :
        null;
}
exports.composeAsyncValidators = composeAsyncValidators;
function isPropertyUpdated(changes, viewModel) {
    if (!changes.hasOwnProperty('model'))
        return false;
    var change = changes['model'];
    if (change.isFirstChange())
        return true;
    return !core_1.ɵlooseIdentical(viewModel, change.currentValue);
}
exports.isPropertyUpdated = isPropertyUpdated;
var BUILTIN_ACCESSORS = [
    checkbox_value_accessor_1.CheckboxControlValueAccessor,
    range_value_accessor_1.RangeValueAccessor,
    number_value_accessor_1.NumberValueAccessor,
    select_control_value_accessor_1.SelectControlValueAccessor,
    select_multiple_control_value_accessor_1.SelectMultipleControlValueAccessor,
    radio_control_value_accessor_1.RadioControlValueAccessor,
];
function isBuiltInAccessor(valueAccessor) {
    return BUILTIN_ACCESSORS.some(function (a) { return valueAccessor.constructor === a; });
}
exports.isBuiltInAccessor = isBuiltInAccessor;
function syncPendingControls(form, directives) {
    form._syncPendingControls();
    directives.forEach(function (dir) {
        var control = dir.control;
        if (control.updateOn === 'submit' && control._pendingChange) {
            dir.viewToModelUpdate(control._pendingValue);
            control._pendingChange = false;
        }
    });
}
exports.syncPendingControls = syncPendingControls;
// TODO: vsavkin remove it once https://github.com/angular/angular/issues/3011 is implemented
function selectValueAccessor(dir, valueAccessors) {
    if (!valueAccessors)
        return null;
    if (!Array.isArray(valueAccessors))
        _throwError(dir, 'Value accessor was not provided as an array for form control with');
    var defaultAccessor = undefined;
    var builtinAccessor = undefined;
    var customAccessor = undefined;
    valueAccessors.forEach(function (v) {
        if (v.constructor === default_value_accessor_1.DefaultValueAccessor) {
            defaultAccessor = v;
        }
        else if (isBuiltInAccessor(v)) {
            if (builtinAccessor)
                _throwError(dir, 'More than one built-in value accessor matches form control with');
            builtinAccessor = v;
        }
        else {
            if (customAccessor)
                _throwError(dir, 'More than one custom value accessor matches form control with');
            customAccessor = v;
        }
    });
    if (customAccessor)
        return customAccessor;
    if (builtinAccessor)
        return builtinAccessor;
    if (defaultAccessor)
        return defaultAccessor;
    _throwError(dir, 'No valid value accessor for form control with');
    return null;
}
exports.selectValueAccessor = selectValueAccessor;
function removeDir(list, el) {
    var index = list.indexOf(el);
    if (index > -1)
        list.splice(index, 1);
}
exports.removeDir = removeDir;
// TODO(kara): remove after deprecation period
function _ngModelWarning(name, type, instance, warningConfig) {
    if (!core_1.isDevMode() || warningConfig === 'never')
        return;
    if (((warningConfig === null || warningConfig === 'once') && !type._ngModelWarningSentOnce) ||
        (warningConfig === 'always' && !instance._ngModelWarningSent)) {
        reactive_errors_1.ReactiveErrors.ngModelWarning(name);
        type._ngModelWarningSentOnce = true;
        instance._ngModelWarningSent = true;
    }
}
exports._ngModelWarning = _ngModelWarning;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvc2hhcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQTJFO0FBRzNFLDRDQUF5QztBQUd6QyxxRUFBdUU7QUFHdkUsbUVBQThEO0FBRTlELDZEQUFrRjtBQUNsRixpRUFBNEQ7QUFDNUQsK0VBQXlFO0FBQ3pFLCtEQUEwRDtBQUUxRCxxREFBaUQ7QUFDakQsaUZBQTJFO0FBQzNFLG1HQUE0RjtBQUk1RixxQkFBNEIsSUFBWSxFQUFFLE1BQXdCO0lBQ2hFLE9BQVcsTUFBTSxDQUFDLElBQU0sU0FBRSxJQUFJLEdBQUU7QUFDbEMsQ0FBQztBQUZELGtDQUVDO0FBRUQsc0JBQTZCLE9BQW9CLEVBQUUsR0FBYztJQUMvRCxJQUFJLENBQUMsT0FBTztRQUFFLFdBQVcsQ0FBQyxHQUFHLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztJQUMzRCxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWE7UUFBRSxXQUFXLENBQUMsR0FBRyxFQUFFLHlDQUF5QyxDQUFDLENBQUM7SUFFcEYsT0FBTyxDQUFDLFNBQVMsR0FBRyx1QkFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFXLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDN0UsT0FBTyxDQUFDLGNBQWMsR0FBRyx1QkFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFnQixFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQ2pHLEdBQUcsQ0FBQyxhQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUU5Qyx1QkFBdUIsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdEMsd0JBQXdCLENBQUMsT0FBTyxFQUFFLEdBQUcs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