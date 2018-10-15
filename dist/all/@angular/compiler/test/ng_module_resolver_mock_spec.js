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
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var compiler_reflector_1 = require("@angular/platform-browser-dynamic/src/compiler_reflector");
var testing_1 = require("../testing");
{
    testing_internal_1.describe('MockNgModuleResolver', function () {
        var ngModuleResolver;
        testing_internal_1.beforeEach(testing_internal_1.inject([core_1.Injector], function (injector) {
            ngModuleResolver = new testing_1.MockNgModuleResolver(new compiler_reflector_1.JitReflector());
        }));
        testing_internal_1.describe('NgModule overriding', function () {
            testing_internal_1.it('should fallback to the default NgModuleResolver when templates are not overridden', function () {
                var ngModule = ngModuleResolver.resolve(SomeNgModule);
                testing_internal_1.expect(ngModule.declarations).toEqual([SomeDirective]);
            });
            testing_internal_1.it('should allow overriding the @NgModule', function () {
                ngModuleResolver.setNgModule(SomeNgModule, new core_1.NgModule({ declarations: [SomeOtherDirective] }));
                var ngModule = ngModuleResolver.resolve(SomeNgModule);
                testing_internal_1.expect(ngModule.declarations).toEqual([SomeOtherDirective]);
            });
        });
    });
}
var SomeDirective = /** @class */ (function () {
    function SomeDirective() {
    }
    return SomeDirective;
}());
var SomeOtherDirective = /** @class */ (function () {
    function SomeOtherDirective() {
    }
    return SomeOtherDirective;
}());
var SomeNgModule = /** @class */ (function () {
    function SomeNgModule() {
    }
    SomeNgModule = __decorate([
        core_1.NgModule({ declarations: [SomeDirective] })
    ], SomeNgModule);
    return SomeNgModule;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlX3Jlc29sdmVyX21vY2tfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvbmdfbW9kdWxlX3Jlc29sdmVyX21vY2tfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNDQUFpRDtBQUNqRCwrRUFBb0c7QUFDcEcsK0ZBQXNGO0FBRXRGLHNDQUFnRDtBQUVoRDtJQUNFLDJCQUFRLENBQUMsc0JBQXNCLEVBQUU7UUFDL0IsSUFBSSxnQkFBc0MsQ0FBQztRQUUzQyw2QkFBVSxDQUFDLHlCQUFNLENBQUMsQ0FBQyxlQUFRLENBQUMsRUFBRSxVQUFDLFFBQWtCO1lBQy9DLGdCQUFnQixHQUFHLElBQUksOEJBQW9CLENBQUMsSUFBSSxpQ0FBWSxFQUFFLENBQUMsQ0FBQztRQUNsRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRUosMkJBQVEsQ0FBQyxxQkFBcUIsRUFBRTtZQUM5QixxQkFBRSxDQUFDLG1GQUFtRixFQUNuRjtnQkFDRSxJQUFNLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ3hELHlCQUFNLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDekQsQ0FBQyxDQUFDLENBQUM7WUFFTixxQkFBRSxDQUFDLHVDQUF1QyxFQUFFO2dCQUMxQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQ3hCLFlBQVksRUFBRSxJQUFJLGVBQVEsQ0FBQyxFQUFDLFlBQVksRUFBRSxDQUFDLGtCQUFrQixDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RFLElBQU0sUUFBUSxHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDeEQseUJBQU0sQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1lBQzlELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztDQUNKO0FBRUQ7SUFBQTtJQUFxQixDQUFDO0lBQUQsb0JBQUM7QUFBRCxDQUFDLEFBQXRCLElBQXNCO0FBRXRCO0lBQUE7SUFBMEIsQ0FBQztJQUFELHlCQUFDO0FBQUQsQ0FBQyxBQUEzQixJQUEyQjtBQUczQjtJQUFBO0lBQ0EsQ0FBQztJQURLLFlBQVk7UUFEakIsZUFBUSxDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUMsQ0FBQztPQUNwQyxZQUFZLENBQ2pCO0lBQUQsbUJBQUM7Q0FBQSxBQURELElBQ0MifQ==