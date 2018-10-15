"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var directives_1 = require("./directives");
var radio_control_value_accessor_1 = require("./directives/radio_control_value_accessor");
var form_builder_1 = require("./form_builder");
/**
 * Exports the required providers and directives for template-driven forms,
 * making them available for import by NgModules that import this module.
 * @see [Forms](guide/forms)
 *
 * @see [Forms Guide](/guide/forms)
 */
var FormsModule = /** @class */ (function () {
    function FormsModule() {
    }
    FormsModule = __decorate([
        core_1.NgModule({
            declarations: directives_1.TEMPLATE_DRIVEN_DIRECTIVES,
            providers: [radio_control_value_accessor_1.RadioControlRegistry],
            exports: [directives_1.InternalFormsSharedModule, directives_1.TEMPLATE_DRIVEN_DIRECTIVES]
        })
    ], FormsModule);
    return FormsModule;
}());
exports.FormsModule = FormsModule;
/**
 * Exports the required infrastructure and directives for reactive forms,
 * making them available for import by NgModules that import this module.
 * @see [Forms](guide/reactive-forms)
 *
 * @see [Reactive Forms Guide](/guide/reactive-forms)
 *
 */
var ReactiveFormsModule = /** @class */ (function () {
    function ReactiveFormsModule() {
    }
    ReactiveFormsModule_1 = ReactiveFormsModule;
    /**
     * @description
     * Provides options for configuring the reactive forms module.
     *
     * @param opts An object of configuration options `warnOnNgModelWithFormControl` Configures when
     * to emit a warning when an `ngModel binding is used with reactive form directives.
     */
    ReactiveFormsModule.withConfig = function (opts) {
        return {
            ngModule: ReactiveFormsModule_1,
            providers: [{
                    provide: directives_1.NG_MODEL_WITH_FORM_CONTROL_WARNING,
                    useValue: opts.warnOnNgModelWithFormControl
                }]
        };
    };
    var ReactiveFormsModule_1;
    ReactiveFormsModule = ReactiveFormsModule_1 = __decorate([
        core_1.NgModule({
            declarations: [directives_1.REACTIVE_DRIVEN_DIRECTIVES],
            providers: [form_builder_1.FormBuilder, radio_control_value_accessor_1.RadioControlRegistry],
            exports: [directives_1.InternalFormsSharedModule, directives_1.REACTIVE_DRIVEN_DIRECTIVES]
        })
    ], ReactiveFormsModule);
    return ReactiveFormsModule;
}());
exports.ReactiveFormsModule = ReactiveFormsModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9wcm92aWRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZm9ybV9wcm92aWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCxzQ0FBNEQ7QUFFNUQsMkNBQW1KO0FBQ25KLDBGQUErRTtBQUMvRSwrQ0FBMkM7QUFJM0M7Ozs7OztHQU1HO0FBTUg7SUFBQTtJQUNBLENBQUM7SUFEWSxXQUFXO1FBTHZCLGVBQVEsQ0FBQztZQUNSLFlBQVksRUFBRSx1Q0FBMEI7WUFDeEMsU0FBUyxFQUFFLENBQUMsbURBQW9CLENBQUM7WUFDakMsT0FBTyxFQUFFLENBQUMsc0NBQXlCLEVBQUUsdUNBQTBCLENBQUM7U0FDakUsQ0FBQztPQUNXLFdBQVcsQ0FDdkI7SUFBRCxrQkFBQztDQUFBLEFBREQsSUFDQztBQURZLGtDQUFXO0FBR3hCOzs7Ozs7O0dBT0c7QUFNSDtJQUFBO0lBbUJBLENBQUM7NEJBbkJZLG1CQUFtQjtJQUM5Qjs7Ozs7O09BTUc7SUFDSSw4QkFBVSxHQUFqQixVQUFrQixJQUVqQjtRQUNDLE9BQU87WUFDTCxRQUFRLEVBQUUscUJBQW1CO1lBQzdCLFNBQVMsRUFBRSxDQUFDO29CQUNWLE9BQU8sRUFBRSwrQ0FBa0M7b0JBQzNDLFFBQVEsRUFBRSxJQUFJLENBQUMsNEJBQTRCO2lCQUM1QyxDQUFDO1NBQ0gsQ0FBQztJQUNKLENBQUM7O0lBbEJVLG1CQUFtQjtRQUwvQixlQUFRLENBQUM7WUFDUixZQUFZLEVBQUUsQ0FBQyx1Q0FBMEIsQ0FBQztZQUMxQyxTQUFTLEVBQUUsQ0FBQywwQkFBVyxFQUFFLG1EQUFvQixDQUFDO1lBQzlDLE9BQU8sRUFBRSxDQUFDLHNDQUF5QixFQUFFLHVDQUEwQixDQUFDO1NBQ2pFLENBQUM7T0FDVyxtQkFBbUIsQ0FtQi9CO0lBQUQsMEJBQUM7Q0FBQSxBQW5CRCxJQW1CQztBQW5CWSxrREFBbUIifQ==