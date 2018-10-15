"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
var cookie_1 = require("@angular/common/src/cookie");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
{
    testing_internal_1.describe('cookies', function () {
        testing_internal_1.it('parses cookies', function () {
            var cookie = 'other-cookie=false; xsrf-token=token-value; is_awesome=true; ffo=true;';
            testing_internal_1.expect(cookie_1.parseCookieValue(cookie, 'xsrf-token')).toBe('token-value');
        });
        testing_internal_1.it('handles encoded keys', function () {
            testing_internal_1.expect(cookie_1.parseCookieValue('whitespace%20token=token-value', 'whitespace token'))
                .toBe('token-value');
        });
        testing_internal_1.it('handles encoded values', function () {
            testing_internal_1.expect(cookie_1.parseCookieValue('token=whitespace%20', 'token')).toBe('whitespace ');
            testing_internal_1.expect(cookie_1.parseCookieValue('token=whitespace%0A', 'token')).toBe('whitespace\n');
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29va2llX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vdGVzdC9jb29raWVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUlIOzs7Ozs7RUFNRTtBQUVGLHFEQUE0RDtBQUM1RCwrRUFBZ0Y7QUFFaEY7SUFDRSwyQkFBUSxDQUFDLFNBQVMsRUFBRTtRQUNsQixxQkFBRSxDQUFDLGdCQUFnQixFQUFFO1lBQ25CLElBQU0sTUFBTSxHQUFHLHdFQUF3RSxDQUFDO1lBQ3hGLHlCQUFNLENBQUMseUJBQWdCLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3JFLENBQUMsQ0FBQyxDQUFDO1FBQ0gscUJBQUUsQ0FBQyxzQkFBc0IsRUFBRTtZQUN6Qix5QkFBTSxDQUFDLHlCQUFnQixDQUFDLGdDQUFnQyxFQUFFLGtCQUFrQixDQUFDLENBQUM7aUJBQ3pFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQztRQUNILHFCQUFFLENBQUMsd0JBQXdCLEVBQUU7WUFDM0IseUJBQU0sQ0FBQyx5QkFBZ0IsQ0FBQyxxQkFBcUIsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM3RSx5QkFBTSxDQUFDLHlCQUFnQixDQUFDLHFCQUFxQixFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2hGLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9