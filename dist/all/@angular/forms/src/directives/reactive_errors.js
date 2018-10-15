"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var error_examples_1 = require("./error_examples");
var ReactiveErrors = /** @class */ (function () {
    function ReactiveErrors() {
    }
    ReactiveErrors.controlParentException = function () {
        throw new Error("formControlName must be used with a parent formGroup directive.  You'll want to add a formGroup\n       directive and pass it an existing FormGroup instance (you can create one in your class).\n\n      Example:\n\n      " + error_examples_1.FormErrorExamples.formControlName);
    };
    ReactiveErrors.ngModelGroupException = function () {
        throw new Error("formControlName cannot be used with an ngModelGroup parent. It is only compatible with parents\n       that also have a \"form\" prefix: formGroupName, formArrayName, or formGroup.\n\n       Option 1:  Update the parent to be formGroupName (reactive form strategy)\n\n        " + error_examples_1.FormErrorExamples.formGroupName + "\n\n        Option 2: Use ngModel instead of formControlName (template-driven strategy)\n\n        " + error_examples_1.FormErrorExamples.ngModelGroup);
    };
    ReactiveErrors.missingFormException = function () {
        throw new Error("formGroup expects a FormGroup instance. Please pass one in.\n\n       Example:\n\n       " + error_examples_1.FormErrorExamples.formControlName);
    };
    ReactiveErrors.groupParentException = function () {
        throw new Error("formGroupName must be used with a parent formGroup directive.  You'll want to add a formGroup\n      directive and pass it an existing FormGroup instance (you can create one in your class).\n\n      Example:\n\n      " + error_examples_1.FormErrorExamples.formGroupName);
    };
    ReactiveErrors.arrayParentException = function () {
        throw new Error("formArrayName must be used with a parent formGroup directive.  You'll want to add a formGroup\n       directive and pass it an existing FormGroup instance (you can create one in your class).\n\n        Example:\n\n        " + error_examples_1.FormErrorExamples.formArrayName);
    };
    ReactiveErrors.disabledAttrWarning = function () {
        console.warn("\n      It looks like you're using the disabled attribute with a reactive form directive. If you set disabled to true\n      when you set up this control in your component class, the disabled attribute will actually be set in the DOM for\n      you. We recommend using this approach to avoid 'changed after checked' errors.\n       \n      Example: \n      form = new FormGroup({\n        first: new FormControl({value: 'Nancy', disabled: true}, Validators.required),\n        last: new FormControl('Drew', Validators.required)\n      });\n    ");
    };
    ReactiveErrors.ngModelWarning = function (directiveName) {
        console.warn("\n    It looks like you're using ngModel on the same form field as " + directiveName + ". \n    Support for using the ngModel input property and ngModelChange event with \n    reactive form directives has been deprecated in Angular v6 and will be removed \n    in Angular v7.\n    \n    For more information on this, see our API docs here:\n    https://angular.io/api/forms/" + (directiveName === 'formControl' ? 'FormControlDirective'
            : 'FormControlName') + "#use-with-ngmodel\n    ");
    };
    return ReactiveErrors;
}());
exports.ReactiveErrors = ReactiveErrors;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3RpdmVfZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvcmVhY3RpdmVfZXJyb3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsbURBQStEO0FBRS9EO0lBQUE7SUE4RUEsQ0FBQztJQTdFUSxxQ0FBc0IsR0FBN0I7UUFDRSxNQUFNLElBQUksS0FBSyxDQUNYLGlPQUtBLGtDQUFRLENBQUMsZUFBaUIsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFTSxvQ0FBcUIsR0FBNUI7UUFDRSxNQUFNLElBQUksS0FBSyxDQUNYLHlSQUtFLGtDQUFRLENBQUMsYUFBYSwyR0FJdEIsa0NBQVEsQ0FBQyxZQUFjLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQ00sbUNBQW9CLEdBQTNCO1FBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyw4RkFJWCxrQ0FBUSxDQUFDLGVBQWlCLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRU0sbUNBQW9CLEdBQTNCO1FBQ0UsTUFBTSxJQUFJLEtBQUssQ0FDWCw4TkFLQSxrQ0FBUSxDQUFDLGFBQWUsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFTSxtQ0FBb0IsR0FBM0I7UUFDRSxNQUFNLElBQUksS0FBSyxDQUNYLG1PQUtFLGtDQUFRLENBQUMsYUFBZSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVNLGtDQUFtQixHQUExQjtRQUNFLE9BQU8sQ0FBQyxJQUFJLENBQUMsa2lCQVVaLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSw2QkFBYyxHQUFyQixVQUFzQixhQUFxQjtRQUN6QyxPQUFPLENBQUMsSUFBSSxDQUFDLHdFQUNrRCxhQUFhLHVTQU03QyxhQUFhLEtBQUssYUFBYSxDQUFDLENBQUMsQ0FBQyxzQkFBc0I7WUFDckYsQ0FBQyxDQUFDLGlCQUFpQiw2QkFDcEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FBQyxBQTlFRCxJQThFQztBQTlFWSx3Q0FBYyJ9