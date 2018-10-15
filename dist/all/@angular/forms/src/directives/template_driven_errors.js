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
var TemplateDrivenErrors = /** @class */ (function () {
    function TemplateDrivenErrors() {
    }
    TemplateDrivenErrors.modelParentException = function () {
        throw new Error("\n      ngModel cannot be used to register form controls with a parent formGroup directive.  Try using\n      formGroup's partner directive \"formControlName\" instead.  Example:\n\n      " + error_examples_1.FormErrorExamples.formControlName + "\n\n      Or, if you'd like to avoid registering this form control, indicate that it's standalone in ngModelOptions:\n\n      Example:\n\n      " + error_examples_1.FormErrorExamples.ngModelWithFormGroup);
    };
    TemplateDrivenErrors.formGroupNameException = function () {
        throw new Error("\n      ngModel cannot be used to register form controls with a parent formGroupName or formArrayName directive.\n\n      Option 1: Use formControlName instead of ngModel (reactive strategy):\n\n      " + error_examples_1.FormErrorExamples.formGroupName + "\n\n      Option 2:  Update ngModel's parent be ngModelGroup (template-driven strategy):\n\n      " + error_examples_1.FormErrorExamples.ngModelGroup);
    };
    TemplateDrivenErrors.missingNameException = function () {
        throw new Error("If ngModel is used within a form tag, either the name attribute must be set or the form\n      control must be defined as 'standalone' in ngModelOptions.\n\n      Example 1: <input [(ngModel)]=\"person.firstName\" name=\"first\">\n      Example 2: <input [(ngModel)]=\"person.firstName\" [ngModelOptions]=\"{standalone: true}\">");
    };
    TemplateDrivenErrors.modelGroupParentException = function () {
        throw new Error("\n      ngModelGroup cannot be used with a parent formGroup directive.\n\n      Option 1: Use formGroupName instead of ngModelGroup (reactive strategy):\n\n      " + error_examples_1.FormErrorExamples.formGroupName + "\n\n      Option 2:  Use a regular form tag instead of the formGroup directive (template-driven strategy):\n\n      " + error_examples_1.FormErrorExamples.ngModelGroup);
    };
    return TemplateDrivenErrors;
}());
exports.TemplateDrivenErrors = TemplateDrivenErrors;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfZHJpdmVuX2Vycm9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3RlbXBsYXRlX2RyaXZlbl9lcnJvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxtREFBK0Q7QUFFL0Q7SUFBQTtJQWlEQSxDQUFDO0lBaERRLHlDQUFvQixHQUEzQjtRQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsaU1BSVosa0NBQVEsQ0FBQyxlQUFlLHdKQU14QixrQ0FBUSxDQUFDLG9CQUFzQixDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVNLDJDQUFzQixHQUE3QjtRQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsOE1BS1osa0NBQVEsQ0FBQyxhQUFhLDBHQUl0QixrQ0FBUSxDQUFDLFlBQWMsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFTSx5Q0FBb0IsR0FBM0I7UUFDRSxNQUFNLElBQUksS0FBSyxDQUNYLDBVQUlzRixDQUFDLENBQUM7SUFDOUYsQ0FBQztJQUVNLDhDQUF5QixHQUFoQztRQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsdUtBS1osa0NBQVEsQ0FBQyxhQUFhLDRIQUl0QixrQ0FBUSxDQUFDLFlBQWMsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFDSCwyQkFBQztBQUFELENBQUMsQUFqREQsSUFpREM7QUFqRFksb0RBQW9CIn0=