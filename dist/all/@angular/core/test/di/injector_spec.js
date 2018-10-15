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
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
{
    testing_internal_1.describe('Injector.NULL', function () {
        testing_internal_1.it('should throw if no arg is given', function () {
            testing_internal_1.expect(function () { return core_1.Injector.NULL.get('someToken'); })
                .toThrowError('NullInjectorError: No provider for someToken!');
        });
        testing_internal_1.it('should throw if THROW_IF_NOT_FOUND is given', function () {
            testing_internal_1.expect(function () { return core_1.Injector.NULL.get('someToken', core_1.Injector.THROW_IF_NOT_FOUND); })
                .toThrowError('NullInjectorError: No provider for someToken!');
        });
        testing_internal_1.it('should return the default value', function () { testing_internal_1.expect(core_1.Injector.NULL.get('someToken', 'notFound')).toEqual('notFound'); });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0b3Jfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9kaS9pbmplY3Rvcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsc0NBQXVDO0FBQ3ZDLCtFQUFnRjtBQUVoRjtJQUNFLDJCQUFRLENBQUMsZUFBZSxFQUFFO1FBQ3hCLHFCQUFFLENBQUMsaUNBQWlDLEVBQUU7WUFDcEMseUJBQU0sQ0FBQyxjQUFNLE9BQUEsZUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQTlCLENBQThCLENBQUM7aUJBQ3ZDLFlBQVksQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1FBQ3JFLENBQUMsQ0FBQyxDQUFDO1FBRUgscUJBQUUsQ0FBQyw2Q0FBNkMsRUFBRTtZQUNoRCx5QkFBTSxDQUFDLGNBQU0sT0FBQSxlQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBUSxDQUFDLGtCQUFrQixDQUFDLEVBQTNELENBQTJELENBQUM7aUJBQ3BFLFlBQVksQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1FBQ3JFLENBQUMsQ0FBQyxDQUFDO1FBRUgscUJBQUUsQ0FBQyxpQ0FBaUMsRUFDakMsY0FBUSx5QkFBTSxDQUFDLGVBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hGLENBQUMsQ0FBQyxDQUFDO0NBQ0oifQ==