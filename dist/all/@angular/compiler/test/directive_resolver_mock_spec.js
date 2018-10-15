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
var testing_1 = require("@angular/core/testing");
var compiler_reflector_1 = require("@angular/platform-browser-dynamic/src/compiler_reflector");
var testing_2 = require("../testing");
{
    describe('MockDirectiveResolver', function () {
        var dirResolver;
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({ declarations: [SomeDirective, SomeOtherDirective, SomeComponent] });
        });
        beforeEach(testing_1.inject([core_1.Injector], function (injector) {
            dirResolver = new testing_2.MockDirectiveResolver(new compiler_reflector_1.JitReflector());
        }));
        describe('Directive overriding', function () {
            it('should fallback to the default DirectiveResolver when templates are not overridden', function () {
                var ngModule = dirResolver.resolve(SomeComponent);
                expect(ngModule.selector).toEqual('cmp');
            });
            it('should allow overriding the @Directive', function () {
                dirResolver.setDirective(SomeComponent, new core_1.Component({ selector: 'someOtherSelector' }));
                var metadata = dirResolver.resolve(SomeComponent);
                expect(metadata.selector).toEqual('someOtherSelector');
            });
        });
    });
}
var SomeDirective = /** @class */ (function () {
    function SomeDirective() {
    }
    SomeDirective = __decorate([
        core_1.Directive({ selector: 'some-directive' })
    ], SomeDirective);
    return SomeDirective;
}());
var SomeComponent = /** @class */ (function () {
    function SomeComponent() {
    }
    SomeComponent = __decorate([
        core_1.Component({ selector: 'cmp', template: 'template' })
    ], SomeComponent);
    return SomeComponent;
}());
var SomeOtherDirective = /** @class */ (function () {
    function SomeOtherDirective() {
    }
    SomeOtherDirective = __decorate([
        core_1.Directive({ selector: 'some-other-directive' })
    ], SomeOtherDirective);
    return SomeOtherDirective;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlX3Jlc29sdmVyX21vY2tfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvZGlyZWN0aXZlX3Jlc29sdmVyX21vY2tfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7OztBQUVILHNDQUE2RDtBQUM3RCxpREFBc0Q7QUFDdEQsK0ZBQXNGO0FBRXRGLHNDQUFpRDtBQUVqRDtJQUNFLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtRQUNoQyxJQUFJLFdBQWtDLENBQUM7UUFFdkMsVUFBVSxDQUFDO1lBQ1QsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FDMUIsRUFBQyxZQUFZLEVBQUUsQ0FBQyxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQzFFLENBQUMsQ0FBQyxDQUFDO1FBRUgsVUFBVSxDQUFDLGdCQUFNLENBQUMsQ0FBQyxlQUFRLENBQUMsRUFBRSxVQUFDLFFBQWtCO1lBQy9DLFdBQVcsR0FBRyxJQUFJLCtCQUFxQixDQUFDLElBQUksaUNBQVksRUFBRSxDQUFDLENBQUM7UUFDOUQsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVKLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRTtZQUMvQixFQUFFLENBQUMsb0ZBQW9GLEVBQ3BGO2dCQUNFLElBQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3BELE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNDLENBQUMsQ0FBQyxDQUFDO1lBRU4sRUFBRSxDQUFDLHdDQUF3QyxFQUFFO2dCQUMzQyxXQUFXLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxJQUFJLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsbUJBQW1CLEVBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hGLElBQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3BELE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDekQsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0NBQ0o7QUFHRDtJQUFBO0lBQ0EsQ0FBQztJQURLLGFBQWE7UUFEbEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxnQkFBZ0IsRUFBQyxDQUFDO09BQ2xDLGFBQWEsQ0FDbEI7SUFBRCxvQkFBQztDQUFBLEFBREQsSUFDQztBQUdEO0lBQUE7SUFDQSxDQUFDO0lBREssYUFBYTtRQURsQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFDLENBQUM7T0FDN0MsYUFBYSxDQUNsQjtJQUFELG9CQUFDO0NBQUEsQUFERCxJQUNDO0FBR0Q7SUFBQTtJQUNBLENBQUM7SUFESyxrQkFBa0I7UUFEdkIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxzQkFBc0IsRUFBQyxDQUFDO09BQ3hDLGtCQUFrQixDQUN2QjtJQUFELHlCQUFDO0NBQUEsQUFERCxJQUNDIn0=