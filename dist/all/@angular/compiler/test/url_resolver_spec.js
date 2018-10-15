"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var url_resolver_1 = require("@angular/compiler/src/url_resolver");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
{
    testing_internal_1.describe('UrlResolver', function () {
        var resolver = new url_resolver_1.UrlResolver();
        testing_internal_1.describe('absolute base url', function () {
            testing_internal_1.it('should add a relative path to the base url', function () {
                testing_internal_1.expect(resolver.resolve('http://www.foo.com', 'bar')).toEqual('http://www.foo.com/bar');
                testing_internal_1.expect(resolver.resolve('http://www.foo.com/', 'bar')).toEqual('http://www.foo.com/bar');
                testing_internal_1.expect(resolver.resolve('http://www.foo.com', './bar')).toEqual('http://www.foo.com/bar');
                testing_internal_1.expect(resolver.resolve('http://www.foo.com/', './bar')).toEqual('http://www.foo.com/bar');
            });
            testing_internal_1.it('should replace the base path', function () {
                testing_internal_1.expect(resolver.resolve('http://www.foo.com/baz', 'bar')).toEqual('http://www.foo.com/bar');
                testing_internal_1.expect(resolver.resolve('http://www.foo.com/baz', './bar'))
                    .toEqual('http://www.foo.com/bar');
            });
            testing_internal_1.it('should append to the base path', function () {
                testing_internal_1.expect(resolver.resolve('http://www.foo.com/baz/', 'bar'))
                    .toEqual('http://www.foo.com/baz/bar');
                testing_internal_1.expect(resolver.resolve('http://www.foo.com/baz/', './bar'))
                    .toEqual('http://www.foo.com/baz/bar');
            });
            testing_internal_1.it('should support ".." in the path', function () {
                testing_internal_1.expect(resolver.resolve('http://www.foo.com/baz/', '../bar'))
                    .toEqual('http://www.foo.com/bar');
                testing_internal_1.expect(resolver.resolve('http://www.foo.com/1/2/3/', '../../bar'))
                    .toEqual('http://www.foo.com/1/bar');
                testing_internal_1.expect(resolver.resolve('http://www.foo.com/1/2/3/', '../biz/bar'))
                    .toEqual('http://www.foo.com/1/2/biz/bar');
                testing_internal_1.expect(resolver.resolve('http://www.foo.com/1/2/baz', '../../bar'))
                    .toEqual('http://www.foo.com/bar');
            });
            testing_internal_1.it('should ignore the base path when the url has a scheme', function () {
                testing_internal_1.expect(resolver.resolve('http://www.foo.com', 'http://www.bar.com'))
                    .toEqual('http://www.bar.com');
            });
            testing_internal_1.it('should support absolute urls', function () {
                testing_internal_1.expect(resolver.resolve('http://www.foo.com', '/bar')).toEqual('http://www.foo.com/bar');
                testing_internal_1.expect(resolver.resolve('http://www.foo.com/', '/bar')).toEqual('http://www.foo.com/bar');
                testing_internal_1.expect(resolver.resolve('http://www.foo.com/baz', '/bar'))
                    .toEqual('http://www.foo.com/bar');
                testing_internal_1.expect(resolver.resolve('http://www.foo.com/baz/', '/bar'))
                    .toEqual('http://www.foo.com/bar');
            });
        });
        testing_internal_1.describe('relative base url', function () {
            testing_internal_1.it('should add a relative path to the base url', function () {
                testing_internal_1.expect(resolver.resolve('foo/', './bar')).toEqual('foo/bar');
                testing_internal_1.expect(resolver.resolve('foo/baz', './bar')).toEqual('foo/bar');
                testing_internal_1.expect(resolver.resolve('foo/baz', 'bar')).toEqual('foo/bar');
            });
            testing_internal_1.it('should support ".." in the path', function () {
                testing_internal_1.expect(resolver.resolve('foo/baz', '../bar')).toEqual('bar');
                testing_internal_1.expect(resolver.resolve('foo/baz', '../biz/bar')).toEqual('biz/bar');
            });
            testing_internal_1.it('should support absolute urls', function () {
                testing_internal_1.expect(resolver.resolve('foo/baz', '/bar')).toEqual('/bar');
                testing_internal_1.expect(resolver.resolve('foo/baz/', '/bar')).toEqual('/bar');
            });
            testing_internal_1.it('should not resolve urls against the baseUrl when the url contains a scheme', function () {
                resolver = new url_resolver_1.UrlResolver('my_packages_dir');
                testing_internal_1.expect(resolver.resolve('base/', 'package:file')).toEqual('my_packages_dir/file');
                testing_internal_1.expect(resolver.resolve('base/', 'http:super_file')).toEqual('http:super_file');
                testing_internal_1.expect(resolver.resolve('base/', './mega_file')).toEqual('base/mega_file');
            });
        });
        testing_internal_1.describe('packages', function () {
            testing_internal_1.it('should resolve a url based on the application package', function () {
                resolver = new url_resolver_1.UrlResolver('my_packages_dir');
                testing_internal_1.expect(resolver.resolve(null, 'package:some/dir/file.txt'))
                    .toEqual('my_packages_dir/some/dir/file.txt');
                testing_internal_1.expect(resolver.resolve(null, 'some/dir/file.txt')).toEqual('some/dir/file.txt');
            });
            testing_internal_1.it('should contain a default value of "/" when nothing is provided', testing_internal_1.inject([url_resolver_1.UrlResolver], function (resolver) {
                testing_internal_1.expect(resolver.resolve(null, 'package:file')).toEqual('/file');
            }));
            testing_internal_1.it('should resolve a package value when present within the baseurl', function () {
                resolver = new url_resolver_1.UrlResolver('/my_special_dir');
                testing_internal_1.expect(resolver.resolve('package:some_dir/', 'matias.html'))
                    .toEqual('/my_special_dir/some_dir/matias.html');
            });
        });
        testing_internal_1.describe('corner and error cases', function () {
            testing_internal_1.it('should encode URLs before resolving', function () {
                testing_internal_1.expect(resolver.resolve('foo/baz', "<p #p>Hello\n        </p>")).toEqual('foo/%3Cp%20#p%3EHello%0A%20%20%20%20%20%20%20%20%3C/p%3E');
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX3Jlc29sdmVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L3VybF9yZXNvbHZlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsbUVBQWdHO0FBQ2hHLCtFQUFvRztBQUVwRztJQUNFLDJCQUFRLENBQUMsYUFBYSxFQUFFO1FBQ3RCLElBQUksUUFBUSxHQUFHLElBQUksMEJBQVcsRUFBRSxDQUFDO1FBRWpDLDJCQUFRLENBQUMsbUJBQW1CLEVBQUU7WUFDNUIscUJBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtnQkFDL0MseUJBQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7Z0JBQ3hGLHlCQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO2dCQUN6Rix5QkFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztnQkFDMUYseUJBQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFDN0YsQ0FBQyxDQUFDLENBQUM7WUFFSCxxQkFBRSxDQUFDLDhCQUE4QixFQUFFO2dCQUNqQyx5QkFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztnQkFDNUYseUJBQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFD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