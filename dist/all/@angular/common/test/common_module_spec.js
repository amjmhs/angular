"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var common_module_1 = require("../src/common_module");
var localization_1 = require("../src/i18n/localization");
{
    describe('DeprecatedI18NPipesModule', function () {
        beforeEach(function () { testing_1.TestBed.configureTestingModule({ imports: [common_module_1.DeprecatedI18NPipesModule] }); });
        it('should define the token DEPRECATED_PLURAL_FN', testing_1.inject([localization_1.DEPRECATED_PLURAL_FN], function (injectedGetPluralCase) {
            expect(injectedGetPluralCase).toEqual(localization_1.getPluralCase);
        }));
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uX21vZHVsZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL3Rlc3QvY29tbW9uX21vZHVsZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsaURBQXNEO0FBQ3RELHNEQUErRDtBQUUvRCx5REFBNkU7QUFFN0U7SUFDRSxRQUFRLENBQUMsMkJBQTJCLEVBQUU7UUFDcEMsVUFBVSxDQUFDLGNBQVEsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLHlDQUF5QixDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFOUYsRUFBRSxDQUFDLDhDQUE4QyxFQUM5QyxnQkFBTSxDQUNGLENBQUMsbUNBQW9CLENBQUMsRUFDdEIsVUFBQyxxQkFBMEU7WUFDekUsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUMsT0FBTyxDQUFDLDRCQUFhLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2IsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9