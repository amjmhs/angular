"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
{
    testing_internal_1.describe('Shim', function () {
        testing_internal_1.it('should provide correct function.name ', function () {
            var functionWithoutName = identity(function () { return function (_ /** TODO #9100 */) { }; });
            function foo(_ /** TODO #9100 */) { }
            testing_internal_1.expect(functionWithoutName.name).toBeFalsy();
            testing_internal_1.expect(foo.name).toEqual('foo');
        });
    });
}
function identity(a /** TODO #9100 */) {
    return a;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hpbV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2RvbS9zaGltX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwrRUFBZ0Y7QUFFaEY7SUFDRSwyQkFBUSxDQUFDLE1BQU0sRUFBRTtRQUVmLHFCQUFFLENBQUMsdUNBQXVDLEVBQUU7WUFDMUMsSUFBTSxtQkFBbUIsR0FBRyxRQUFRLENBQUMsY0FBTSxPQUFBLFVBQVMsQ0FBTSxDQUFDLGlCQUFpQixJQUFHLENBQUMsRUFBckMsQ0FBcUMsQ0FBQyxDQUFDO1lBQ2xGLGFBQWEsQ0FBTSxDQUFDLGlCQUFpQixJQUFHLENBQUM7WUFFekMseUJBQU0sQ0FBTyxtQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNwRCx5QkFBTSxDQUFPLEdBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7SUFFTCxDQUFDLENBQUMsQ0FBQztDQUNKO0FBRUQsa0JBQWtCLENBQU0sQ0FBQyxpQkFBaUI7SUFDeEMsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDIn0=