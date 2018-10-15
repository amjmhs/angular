"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var usage_1 = require("./usage");
var UTF8 = {
    encoding: 'utf-8'
};
var PACKAGE = 'angular/packages/core/test/bundling/hello_world';
describe('functional test for injection system bundling', function () {
    it('should be able to inject the scoped service', function () { expect(usage_1.INJECTOR.get(usage_1.ScopedService) instanceof usage_1.ScopedService).toBe(true); });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZXNoYWtpbmdfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9idW5kbGluZy9pbmplY3Rpb24vdHJlZXNoYWtpbmdfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUtILGlDQUFnRDtBQUVoRCxJQUFNLElBQUksR0FBRztJQUNYLFFBQVEsRUFBRSxPQUFPO0NBQ2xCLENBQUM7QUFDRixJQUFNLE9BQU8sR0FBRyxpREFBaUQsQ0FBQztBQUVsRSxRQUFRLENBQUMsK0NBQStDLEVBQUU7SUFDeEQsRUFBRSxDQUFDLDZDQUE2QyxFQUM3QyxjQUFRLE1BQU0sQ0FBQyxnQkFBUSxDQUFDLEdBQUcsQ0FBQyxxQkFBYSxDQUFDLFlBQVkscUJBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pGLENBQUMsQ0FBQyxDQUFDIn0=