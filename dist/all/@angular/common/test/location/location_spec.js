"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var location_1 = require("../../src/location/location");
{
    var baseUrl_1 = '/base';
    describe('Location Class', function () {
        describe('stripTrailingSlash', function () {
            it('should strip single character slash', function () {
                var input = '/';
                expect(location_1.Location.stripTrailingSlash(input)).toBe('');
            });
            it('should normalize strip a trailing slash', function () {
                var input = baseUrl_1 + '/';
                expect(location_1.Location.stripTrailingSlash(input)).toBe(baseUrl_1);
            });
            it('should ignore query params when stripping a slash', function () {
                var input = baseUrl_1 + '/?param=1';
                expect(location_1.Location.stripTrailingSlash(input)).toBe(baseUrl_1 + '?param=1');
            });
            it('should not remove slashes inside query params', function () {
                var input = baseUrl_1 + '?test/?=3';
                expect(location_1.Location.stripTrailingSlash(input)).toBe(input);
            });
            it('should not remove slashes after a pound sign', function () {
                var input = baseUrl_1 + '#test/?=3';
                expect(location_1.Location.stripTrailingSlash(input)).toBe(input);
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi90ZXN0L2xvY2F0aW9uL2xvY2F0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCx3REFBcUQ7QUFFckQ7SUFDRSxJQUFNLFNBQU8sR0FBRyxPQUFPLENBQUM7SUFFeEIsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1FBQ3pCLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtZQUM3QixFQUFFLENBQUMscUNBQXFDLEVBQUU7Z0JBQ3hDLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQztnQkFDbEIsTUFBTSxDQUFDLG1CQUFRLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMseUNBQXlDLEVBQUU7Z0JBQzVDLElBQU0sS0FBSyxHQUFHLFNBQU8sR0FBRyxHQUFHLENBQUM7Z0JBQzVCLE1BQU0sQ0FBQyxtQkFBUSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQU8sQ0FBQyxDQUFDO1lBQzNELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLG1EQUFtRCxFQUFFO2dCQUN0RCxJQUFNLEtBQUssR0FBRyxTQUFPLEdBQUcsV0FBVyxDQUFDO2dCQUNwQyxNQUFNLENBQUMsbUJBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFPLEdBQUcsVUFBVSxDQUFDLENBQUM7WUFDeEUsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsK0NBQStDLEVBQUU7Z0JBQ2xELElBQU0sS0FBSyxHQUFHLFNBQU8sR0FBRyxXQUFXLENBQUM7Z0JBQ3BDLE1BQU0sQ0FBQyxtQkFBUSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO2dCQUNqRCxJQUFNLEtBQUssR0FBRyxTQUFPLEdBQUcsV0FBVyxDQUFDO2dCQUNwQyxNQUFNLENBQUMsbUJBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6RCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9