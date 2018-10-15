"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var UTF8 = {
    encoding: 'utf-8'
};
var PACKAGE = 'angular/packages/core/test/bundling/hello_world_r2';
describe('treeshaking with uglify', function () {
    var content;
    var contentPath = require.resolve(path.join(PACKAGE, 'bundle.min_debug.js'));
    beforeAll(function () { content = fs.readFileSync(contentPath, UTF8); });
    it('should drop unused TypeScript helpers', function () { expect(content).not.toContain('__asyncGenerator'); });
    it('should not contain rxjs from commonjs distro', function () {
        expect(content).not.toContain('commonjsGlobal');
        expect(content).not.toContain('createCommonjsModule');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZXNoYWtpbmdfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9idW5kbGluZy9oZWxsb193b3JsZF9yMi90cmVlc2hha2luZ19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsdUJBQXlCO0FBQ3pCLDJCQUE2QjtBQUU3QixJQUFNLElBQUksR0FBRztJQUNYLFFBQVEsRUFBRSxPQUFPO0NBQ2xCLENBQUM7QUFDRixJQUFNLE9BQU8sR0FBRyxvREFBb0QsQ0FBQztBQUVyRSxRQUFRLENBQUMseUJBQXlCLEVBQUU7SUFFbEMsSUFBSSxPQUFlLENBQUM7SUFDcEIsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7SUFDL0UsU0FBUyxDQUFDLGNBQVEsT0FBTyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbkUsRUFBRSxDQUFDLHVDQUF1QyxFQUN2QyxjQUFRLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVqRSxFQUFFLENBQUMsOENBQThDLEVBQUU7UUFDakQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNoRCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ3hELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==