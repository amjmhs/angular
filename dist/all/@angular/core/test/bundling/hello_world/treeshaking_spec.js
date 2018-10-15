"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/private/testing");
var fs = require("fs");
var path = require("path");
var UTF8 = {
    encoding: 'utf-8'
};
var PACKAGE = 'angular/packages/core/test/bundling/hello_world';
describe('treeshaking with uglify', function () {
    var content;
    var contentPath = require.resolve(path.join(PACKAGE, 'bundle.min_debug.js'));
    beforeAll(function () { content = fs.readFileSync(contentPath, UTF8); });
    it('should drop unused TypeScript helpers', function () { expect(content).not.toContain('__asyncGenerator'); });
    it('should not contain rxjs from commonjs distro', function () {
        expect(content).not.toContain('commonjsGlobal');
        expect(content).not.toContain('createCommonjsModule');
    });
    it('should not contain zone.js', function () { expect(content).not.toContain('global[\'Zone\'] = Zone'); });
    describe('functional test in domino', function () {
        it('should render hello world when not minified', testing_1.withBody('<hello-world></hello-world>', function () {
            require(path.join(PACKAGE, 'bundle.js'));
            expect(document.body.textContent).toEqual('Hello World!');
        }));
        it('should render hello world when debug minified', testing_1.withBody('<hello-world></hello-world>', function () {
            require(path.join(PACKAGE, 'bundle.min_debug.js'));
            expect(document.body.textContent).toEqual('Hello World!');
        }));
        it('should render hello world when fully minified', testing_1.withBody('<hello-world></hello-world>', function () {
            require(path.join(PACKAGE, 'bundle.min.js'));
            expect(document.body.textContent).toEqual('Hello World!');
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZXNoYWtpbmdfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9idW5kbGluZy9oZWxsb193b3JsZC90cmVlc2hha2luZ19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsb0RBQWtEO0FBQ2xELHVCQUF5QjtBQUN6QiwyQkFBNkI7QUFFN0IsSUFBTSxJQUFJLEdBQUc7SUFDWCxRQUFRLEVBQUUsT0FBTztDQUNsQixDQUFDO0FBQ0YsSUFBTSxPQUFPLEdBQUcsaURBQWlELENBQUM7QUFFbEUsUUFBUSxDQUFDLHlCQUF5QixFQUFFO0lBRWxDLElBQUksT0FBZSxDQUFDO0lBQ3BCLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUscUJBQXFCLENBQUMsQ0FBQyxDQUFDO0lBQy9FLFNBQVMsQ0FBQyxjQUFRLE9BQU8sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRW5FLEVBQUUsQ0FBQyx1Q0FBdUMsRUFDdkMsY0FBUSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFakUsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO1FBQ2pELE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDaEQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUN4RCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw0QkFBNEIsRUFDNUIsY0FBUSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFeEUsUUFBUSxDQUFDLDJCQUEyQixFQUFFO1FBQ3BDLEVBQUUsQ0FBQyw2Q0FBNkMsRUFDN0Msa0JBQVEsQ0FBQyw2QkFBNkIsRUFBRTtZQUN0QyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN6QyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVQLEVBQUUsQ0FBQywrQ0FBK0MsRUFDL0Msa0JBQVEsQ0FBQyw2QkFBNkIsRUFBRTtZQUN0QyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1lBQ25ELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAsRUFBRSxDQUFDLCtDQUErQyxFQUMvQyxrQkFBUSxDQUFDLDZCQUE2QixFQUFFO1lBQ3RDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9