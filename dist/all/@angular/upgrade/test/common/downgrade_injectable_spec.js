"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("@angular/upgrade/src/common/constants");
var downgrade_injectable_1 = require("@angular/upgrade/src/common/downgrade_injectable");
{
    describe('downgradeInjectable', function () {
        it('should return an AngularJS annotated factory for the token', function () {
            var factory = downgrade_injectable_1.downgradeInjectable('someToken');
            expect(factory).toEqual(jasmine.any(Function));
            expect(factory.$inject).toEqual([constants_1.INJECTOR_KEY]);
            var injector = { get: jasmine.createSpy('get').and.returnValue('service value') };
            var value = factory(injector);
            expect(injector.get).toHaveBeenCalledWith('someToken');
            expect(value).toEqual('service value');
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmdyYWRlX2luamVjdGFibGVfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvdGVzdC9jb21tb24vZG93bmdyYWRlX2luamVjdGFibGVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILG1FQUFtRTtBQUNuRSx5RkFBcUY7QUFFckY7SUFDRSxRQUFRLENBQUMscUJBQXFCLEVBQUU7UUFDOUIsRUFBRSxDQUFDLDREQUE0RCxFQUFFO1lBQy9ELElBQU0sT0FBTyxHQUFHLDBDQUFtQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQy9DLE1BQU0sQ0FBRSxPQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsd0JBQVksQ0FBQyxDQUFDLENBQUM7WUFFekQsSUFBTSxRQUFRLEdBQUcsRUFBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxFQUFDLENBQUM7WUFDbEYsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDdkQsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0NBQ0oifQ==