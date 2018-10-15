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
var testing_1 = require("@angular/core/testing");
var rxjs_1 = require("rxjs");
var apply_redirects_1 = require("../src/apply_redirects");
var config_1 = require("../src/config");
var url_tree_1 = require("../src/url_tree");
describe('applyRedirects', function () {
    var serializer = new url_tree_1.DefaultUrlSerializer();
    var testModule;
    beforeEach(function () { testModule = testing_1.TestBed.get(core_1.NgModuleRef); });
    it('should return the same url tree when no redirects', function () {
        checkRedirect([
            {
                path: 'a',
                component: ComponentA,
                children: [
                    { path: 'b', component: ComponentB },
                ],
            },
        ], '/a/b', function (t) { expectTreeToBe(t, '/a/b'); });
    });
    it('should add new segments when needed', function () {
        checkRedirect([{ path: 'a/b', redirectTo: 'a/b/c' }, { path: '**', component: ComponentC }], '/a/b', function (t) { expectTreeToBe(t, '/a/b/c'); });
    });
    it('should support redirecting with to an URL with query parameters', function () {
        var config = [
            { path: 'single_value', redirectTo: '/dst?k=v1' },
            { path: 'multiple_values', redirectTo: '/dst?k=v1&k=v2' },
            { path: '**', component: ComponentA },
        ];
        checkRedirect(config, 'single_value', function (t) { return expectTreeToBe(t, '/dst?k=v1'); });
        checkRedirect(config, 'multiple_values', function (t) { return expectTreeToBe(t, '/dst?k=v1&k=v2'); });
    });
    it('should handle positional parameters', function () {
        checkRedirect([
            { path: 'a/:aid/b/:bid', redirectTo: 'newa/:aid/newb/:bid' },
            { path: '**', component: ComponentC }
        ], '/a/1/b/2', function (t) { expectTreeToBe(t, '/newa/1/newb/2'); });
    });
    it('should throw when cannot handle a positional parameter', function () {
        apply_redirects_1.applyRedirects(testModule.injector, null, serializer, tree('/a/1'), [
            { path: 'a/:id', redirectTo: 'a/:other' }
        ]).subscribe(function () { }, function (e) {
            expect(e.message).toEqual('Cannot redirect to \'a/:other\'. Cannot find \':other\'.');
        });
    });
    it('should pass matrix parameters', function () {
        checkRedirect([{ path: 'a/:id', redirectTo: 'd/a/:id/e' }, { path: '**', component: ComponentC }], '/a;p1=1/1;p2=2', function (t) { expectTreeToBe(t, '/d/a;p1=1/1;p2=2/e'); });
    });
    it('should handle preserve secondary routes', function () {
        checkRedirect([
            { path: 'a/:id', redirectTo: 'd/a/:id/e' },
            { path: 'c/d', component: ComponentA, outlet: 'aux' }, { path: '**', component: ComponentC }
        ], '/a/1(aux:c/d)', function (t) { expectTreeToBe(t, '/d/a/1/e(aux:c/d)'); });
    });
    it('should redirect secondary routes', function () {
        checkRedirect([
            { path: 'a/:id', component: ComponentA },
            { path: 'c/d', redirectTo: 'f/c/d/e', outlet: 'aux' },
            { path: '**', component: ComponentC, outlet: 'aux' }
        ], '/a/1(aux:c/d)', function (t) { expectTreeToBe(t, '/a/1(aux:f/c/d/e)'); });
    });
    it('should use the configuration of the route redirected to', function () {
        checkRedirect([
            {
                path: 'a',
                component: ComponentA,
                children: [
                    { path: 'b', component: ComponentB },
                ]
            },
            { path: 'c', redirectTo: 'a' }
        ], 'c/b', function (t) { expectTreeToBe(t, 'a/b'); });
    });
    it('should support redirects with both main and aux', function () {
        checkRedirect([{
                path: 'a',
                children: [
                    { path: 'bb', component: ComponentB }, { path: 'b', redirectTo: 'bb' },
                    { path: 'cc', component: ComponentC, outlet: 'aux' },
                    { path: 'b', redirectTo: 'cc', outlet: 'aux' }
                ]
            }], 'a/(b//aux:b)', function (t) { expectTreeToBe(t, 'a/(bb//aux:cc)'); });
    });
    it('should support redirects with both main and aux (with a nested redirect)', function () {
        checkRedirect([{
                path: 'a',
                children: [
                    { path: 'bb', component: ComponentB }, { path: 'b', redirectTo: 'bb' },
                    {
                        path: 'cc',
                        component: ComponentC,
                        outlet: 'aux',
                        children: [{ path: 'dd', component: ComponentC }, { path: 'd', redirectTo: 'dd' }]
                    },
                    { path: 'b', redirectTo: 'cc/d', outlet: 'aux' }
                ]
            }], 'a/(b//aux:b)', function (t) { expectTreeToBe(t, 'a/(bb//aux:cc/dd)'); });
    });
    it('should redirect wild cards', function () {
        checkRedirect([
            { path: '404', component: ComponentA },
            { path: '**', redirectTo: '/404' },
        ], '/a/1(aux:c/d)', function (t) { expectTreeToBe(t, '/404'); });
    });
    it('should support absolute redirects', function () {
        checkRedirect([
            {
                path: 'a',
                component: ComponentA,
                children: [{ path: 'b/:id', redirectTo: '/absolute/:id?a=1&b=:b#f1' }]
            },
            { path: '**', component: ComponentC }
        ], '/a/b/1?b=2', function (t) { expectTreeToBe(t, '/absolute/1?a=1&b=2#f1'); });
    });
    describe('lazy loading', function () {
        it('should load config on demand', function () {
            var loadedConfig = new config_1.LoadedRouterConfig([{ path: 'b', component: ComponentB }], testModule);
            var loader = {
                load: function (injector, p) {
                    if (injector !== testModule.injector)
                        throw 'Invalid Injector';
                    return rxjs_1.of(loadedConfig);
                }
            };
            var config = [{ path: 'a', component: ComponentA, loadChildren: 'children' }];
            apply_redirects_1.applyRedirects(testModule.injector, loader, serializer, tree('a/b'), config)
                .forEach(function (r) {
                expectTreeToBe(r, '/a/b');
                expect(config[0]._loadedConfig).toBe(loadedConfig);
            });
        });
        it('should handle the case when the loader errors', function () {
            var loader = {
                load: function (p) { return new rxjs_1.Observable(function (obs) { return obs.error(new Error('Loading Error')); }); }
            };
            var config = [{ path: 'a', component: ComponentA, loadChildren: 'children' }];
            apply_redirects_1.applyRedirects(testModule.injector, loader, serializer, tree('a/b'), config)
                .subscribe(function () { }, function (e) { expect(e.message).toEqual('Loading Error'); });
        });
        it('should load when all canLoad guards return true', function () {
            var loadedConfig = new config_1.LoadedRouterConfig([{ path: 'b', component: ComponentB }], testModule);
            var loader = { load: function (injector, p) { return rxjs_1.of(loadedConfig); } };
            var guard = function () { return true; };
            var injector = {
                get: function (token) { return token === 'guard1' || token === 'guard2' ? guard : { injector: injector }; }
            };
            var config = [{
                    path: 'a',
                    component: ComponentA,
                    canLoad: ['guard1', 'guard2'],
                    loadChildren: 'children'
                }];
            apply_redirects_1.applyRedirects(injector, loader, serializer, tree('a/b'), config).forEach(function (r) {
                expectTreeToBe(r, '/a/b');
            });
        });
        it('should not load when any canLoad guards return false', function () {
            var loadedConfig = new config_1.LoadedRouterConfig([{ path: 'b', component: ComponentB }], testModule);
            var loader = { load: function (injector, p) { return rxjs_1.of(loadedConfig); } };
            var trueGuard = function () { return true; };
            var falseGuard = function () { return false; };
            var injector = {
                get: function (token) {
                    switch (token) {
                        case 'guard1':
                            return trueGuard;
                        case 'guard2':
                            return falseGuard;
                        case core_1.NgModuleRef:
                            return { injector: injector };
                    }
                }
            };
            var config = [{
                    path: 'a',
                    component: ComponentA,
                    canLoad: ['guard1', 'guard2'],
                    loadChildren: 'children'
                }];
            apply_redirects_1.applyRedirects(injector, loader, serializer, tree('a/b'), config)
                .subscribe(function () { throw 'Should not reach'; }, function (e) {
                expect(e.message).toEqual("NavigationCancelingError: Cannot load children because the guard of the route \"path: 'a'\" returned false");
            });
        });
        it('should not load when any canLoad guards is rejected (promises)', function () {
            var loadedConfig = new config_1.LoadedRouterConfig([{ path: 'b', component: ComponentB }], testModule);
            var loader = { load: function (injector, p) { return rxjs_1.of(loadedConfig); } };
            var trueGuard = function () { return Promise.resolve(true); };
            var falseGuard = function () { return Promise.reject('someError'); };
            var injector = {
                get: function (token) {
                    switch (token) {
                        case 'guard1':
                            return trueGuard;
                        case 'guard2':
                            return falseGuard;
                        case core_1.NgModuleRef:
                            return { injector: injector };
                    }
                }
            };
            var config = [{
                    path: 'a',
                    component: ComponentA,
                    canLoad: ['guard1', 'guard2'],
                    loadChildren: 'children'
                }];
            apply_redirects_1.applyRedirects(injector, loader, serializer, tree('a/b'), config)
                .subscribe(function () { throw 'Should not reach'; }, function (e) { expect(e).toEqual('someError'); });
        });
        it('should work with objects implementing the CanLoad interface', function () {
            var loadedConfig = new config_1.LoadedRouterConfig([{ path: 'b', component: ComponentB }], testModule);
            var loader = { load: function (injector, p) { return rxjs_1.of(loadedConfig); } };
            var guard = { canLoad: function () { return Promise.resolve(true); } };
            var injector = { get: function (token) { return token === 'guard' ? guard : { injector: injector }; } };
            var config = [{ path: 'a', component: ComponentA, canLoad: ['guard'], loadChildren: 'children' }];
            apply_redirects_1.applyRedirects(injector, loader, serializer, tree('a/b'), config)
                .subscribe(function (r) { expectTreeToBe(r, '/a/b'); }, function (e) { throw 'Should not reach'; });
        });
        it('should work with absolute redirects', function () {
            var loadedConfig = new config_1.LoadedRouterConfig([{ path: '', component: ComponentB }], testModule);
            var loader = { load: function (injector, p) { return rxjs_1.of(loadedConfig); } };
            var config = [{ path: '', pathMatch: 'full', redirectTo: '/a' }, { path: 'a', loadChildren: 'children' }];
            apply_redirects_1.applyRedirects(testModule.injector, loader, serializer, tree(''), config).forEach(function (r) {
                expectTreeToBe(r, 'a');
                expect(config[1]._loadedConfig).toBe(loadedConfig);
            });
        });
        it('should load the configuration only once', function () {
            var loadedConfig = new config_1.LoadedRouterConfig([{ path: '', component: ComponentB }], testModule);
            var called = false;
            var loader = {
                load: function (injector, p) {
                    if (called)
                        throw new Error('Should not be called twice');
                    called = true;
                    return rxjs_1.of(loadedConfig);
                }
            };
            var config = [{ path: 'a', loadChildren: 'children' }];
            apply_redirects_1.applyRedirects(testModule.injector, loader, serializer, tree('a?k1'), config)
                .subscribe(function (r) { });
            apply_redirects_1.applyRedirects(testModule.injector, loader, serializer, tree('a?k2'), config)
                .subscribe(function (r) {
                expectTreeToBe(r, 'a?k2');
                expect(config[0]._loadedConfig).toBe(loadedConfig);
            }, function (e) { throw 'Should not reach'; });
        });
        it('should load the configuration of a wildcard route', function () {
            var loadedConfig = new config_1.LoadedRouterConfig([{ path: '', component: ComponentB }], testModule);
            var loader = { load: function (injector, p) { return rxjs_1.of(loadedConfig); } };
            var config = [{ path: '**', loadChildren: 'children' }];
            apply_redirects_1.applyRedirects(testModule.injector, loader, serializer, tree('xyz'), config)
                .forEach(function (r) { expect(config[0]._loadedConfig).toBe(loadedConfig); });
        });
        it('should load the configuration after a local redirect from a wildcard route', function () {
            var loadedConfig = new config_1.LoadedRouterConfig([{ path: '', component: ComponentB }], testModule);
            var loader = { load: function (injector, p) { return rxjs_1.of(loadedConfig); } };
            var config = [{ path: 'not-found', loadChildren: 'children' }, { path: '**', redirectTo: 'not-found' }];
            apply_redirects_1.applyRedirects(testModule.injector, loader, serializer, tree('xyz'), config)
                .forEach(function (r) { expect(config[0]._loadedConfig).toBe(loadedConfig); });
        });
        it('should load the configuration after an absolute redirect from a wildcard route', function () {
            var loadedConfig = new config_1.LoadedRouterConfig([{ path: '', component: ComponentB }], testModule);
            var loader = { load: function (injector, p) { return rxjs_1.of(loadedConfig); } };
            var config = [{ path: 'not-found', loadChildren: 'children' }, { path: '**', redirectTo: '/not-found' }];
            apply_redirects_1.applyRedirects(testModule.injector, loader, serializer, tree('xyz'), config)
                .forEach(function (r) { expect(config[0]._loadedConfig).toBe(loadedConfig); });
        });
    });
    describe('empty paths', function () {
        it('redirect from an empty path should work (local redirect)', function () {
            checkRedirect([
                {
                    path: 'a',
                    component: ComponentA,
                    children: [
                        { path: 'b', component: ComponentB },
                    ]
                },
                { path: '', redirectTo: 'a' }
            ], 'b', function (t) { expectTreeToBe(t, 'a/b'); });
        });
        it('redirect from an empty path should work (absolute redirect)', function () {
            checkRedirect([
                {
                    path: 'a',
                    component: ComponentA,
                    children: [
                        { path: 'b', component: ComponentB },
                    ]
                },
                { path: '', redirectTo: '/a/b' }
            ], '', function (t) { expectTreeToBe(t, 'a/b'); });
        });
        it('should redirect empty path route only when terminal', function () {
            var config = [
                {
                    path: 'a',
                    component: ComponentA,
                    children: [
                        { path: 'b', component: ComponentB },
                    ]
                },
                { path: '', redirectTo: 'a', pathMatch: 'full' }
            ];
            apply_redirects_1.applyRedirects(testModule.injector, null, serializer, tree('b'), config)
                .subscribe(function (_) { throw 'Should not be reached'; }, function (e) { expect(e.message).toEqual('Cannot match any routes. URL Segment: \'b\''); });
        });
        it('redirect from an empty path should work (nested case)', function () {
            checkRedirect([
                {
                    path: 'a',
                    component: ComponentA,
                    children: [{ path: 'b', component: ComponentB }, { path: '', redirectTo: 'b' }]
                },
                { path: '', redirectTo: 'a' }
            ], '', function (t) { expectTreeToBe(t, 'a/b'); });
        });
        it('redirect to an empty path should work', function () {
            checkRedirect([
                { path: '', component: ComponentA, children: [{ path: 'b', component: ComponentB }] },
                { path: 'a', redirectTo: '' }
            ], 'a/b', function (t) { expectTreeToBe(t, 'b'); });
        });
        describe('aux split is in the middle', function () {
            it('should create a new url segment (non-terminal)', function () {
                checkRedirect([{
                        path: 'a',
                        children: [
                            { path: 'b', component: ComponentB },
                            { path: 'c', component: ComponentC, outlet: 'aux' },
                            { path: '', redirectTo: 'c', outlet: 'aux' }
                        ]
                    }], 'a/b', function (t) { expectTreeToBe(t, 'a/(b//aux:c)'); });
            });
            it('should create a new url segment (terminal)', function () {
                checkRedirect([{
                        path: 'a',
                        children: [
                            { path: 'b', component: ComponentB },
                            { path: 'c', component: ComponentC, outlet: 'aux' },
                            { path: '', pathMatch: 'full', redirectTo: 'c', outlet: 'aux' }
                        ]
                    }], 'a/b', function (t) { expectTreeToBe(t, 'a/b'); });
            });
        });
        describe('split at the end (no right child)', function () {
            it('should create a new child (non-terminal)', function () {
                checkRedirect([{
                        path: 'a',
                        children: [
                            { path: 'b', component: ComponentB }, { path: '', redirectTo: 'b' },
                            { path: 'c', component: ComponentC, outlet: 'aux' },
                            { path: '', redirectTo: 'c', outlet: 'aux' }
                        ]
                    }], 'a', function (t) { expectTreeToBe(t, 'a/(b//aux:c)'); });
            });
            it('should create a new child (terminal)', function () {
                checkRedirect([{
                        path: 'a',
                        children: [
                            { path: 'b', component: ComponentB }, { path: '', redirectTo: 'b' },
                            { path: 'c', component: ComponentC, outlet: 'aux' },
                            { path: '', pathMatch: 'full', redirectTo: 'c', outlet: 'aux' }
                        ]
                    }], 'a', function (t) { expectTreeToBe(t, 'a/(b//aux:c)'); });
            });
            it('should work only only primary outlet', function () {
                checkRedirect([{
                        path: 'a',
                        children: [
                            { path: 'b', component: ComponentB }, { path: '', redirectTo: 'b' },
                            { path: 'c', component: ComponentC, outlet: 'aux' }
                        ]
                    }], 'a/(aux:c)', function (t) { expectTreeToBe(t, 'a/(b//aux:c)'); });
            });
        });
        describe('split at the end (right child)', function () {
            it('should create a new child (non-terminal)', function () {
                checkRedirect([{
                        path: 'a',
                        children: [
                            { path: 'b', component: ComponentB, children: [{ path: 'd', component: ComponentB }] },
                            { path: '', redirectTo: 'b' }, {
                                path: 'c',
                                component: ComponentC,
                                outlet: 'aux',
                                children: [{ path: 'e', component: ComponentC }]
                            },
                            { path: '', redirectTo: 'c', outlet: 'aux' }
                        ]
                    }], 'a/(d//aux:e)', function (t) { expectTreeToBe(t, 'a/(b/d//aux:c/e)'); });
            });
            it('should not create a new child (terminal)', function () {
                var config = [{
                        path: 'a',
                        children: [
                            { path: 'b', component: ComponentB, children: [{ path: 'd', component: ComponentB }] },
                            { path: '', redirectTo: 'b' }, {
                                path: 'c',
                                component: ComponentC,
                                outlet: 'aux',
                                children: [{ path: 'e', component: ComponentC }]
                            },
                            { path: '', pathMatch: 'full', redirectTo: 'c', outlet: 'aux' }
                        ]
                    }];
                apply_redirects_1.applyRedirects(testModule.injector, null, serializer, tree('a/(d//aux:e)'), config)
                    .subscribe(function (_) { throw 'Should not be reached'; }, function (e) { expect(e.message).toEqual('Cannot match any routes. URL Segment: \'a\''); });
            });
        });
    });
    describe('empty URL leftovers', function () {
        it('should not error when no children matching and no url is left', function () {
            checkRedirect([{ path: 'a', component: ComponentA, children: [{ path: 'b', component: ComponentB }] }], '/a', function (t) { expectTreeToBe(t, 'a'); });
        });
        it('should not error when no children matching and no url is left (aux routes)', function () {
            checkRedirect([{
                    path: 'a',
                    component: ComponentA,
                    children: [
                        { path: 'b', component: ComponentB },
                        { path: '', redirectTo: 'c', outlet: 'aux' },
                        { path: 'c', component: ComponentC, outlet: 'aux' },
                    ]
                }], '/a', function (t) { expectTreeToBe(t, 'a/(aux:c)'); });
        });
        it('should error when no children matching and some url is left', function () {
            apply_redirects_1.applyRedirects(testModule.injector, null, serializer, tree('/a/c'), [{ path: 'a', component: ComponentA, children: [{ path: 'b', component: ComponentB }] }])
                .subscribe(function (_) { throw 'Should not be reached'; }, function (e) { expect(e.message).toEqual('Cannot match any routes. URL Segment: \'a/c\''); });
        });
    });
    describe('custom path matchers', function () {
        it('should use custom path matcher', function () {
            var matcher = function (s, g, r) {
                if (s[0].path === 'a') {
                    return { consumed: s.slice(0, 2), posParams: { id: s[1] } };
                }
                else {
                    return null;
                }
            };
            checkRedirect([{
                    matcher: matcher,
                    component: ComponentA,
                    children: [{ path: 'b', component: ComponentB }]
                }], '/a/1/b', function (t) { expectTreeToBe(t, 'a/1/b'); });
        });
    });
    describe('redirecting to named outlets', function () {
        it('should work when using absolute redirects', function () {
            checkRedirect([
                { path: 'a/:id', redirectTo: '/b/:id(aux:c/:id)' },
                { path: 'b/:id', component: ComponentB },
                { path: 'c/:id', component: ComponentC, outlet: 'aux' }
            ], 'a/1;p=99', function (t) { expectTreeToBe(t, '/b/1;p=99(aux:c/1;p=99)'); });
        });
        it('should work when using absolute redirects (wildcard)', function () {
            checkRedirect([
                { path: '**', redirectTo: '/b(aux:c)' }, { path: 'b', component: ComponentB },
                { path: 'c', component: ComponentC, outlet: 'aux' }
            ], 'a/1', function (t) { expectTreeToBe(t, '/b(aux:c)'); });
        });
        it('should throw when using non-absolute redirects', function () {
            apply_redirects_1.applyRedirects(testModule.injector, null, serializer, tree('a'), [
                { path: 'a', redirectTo: 'b(aux:c)' },
            ])
                .subscribe(function () { throw new Error('should not be reached'); }, function (e) {
                expect(e.message).toEqual('Only absolute redirects can have named outlets. redirectTo: \'b(aux:c)\'');
            });
        });
    });
});
function checkRedirect(config, url, callback) {
    apply_redirects_1.applyRedirects(testing_1.TestBed, null, new url_tree_1.DefaultUrlSerializer(), tree(url), config)
        .subscribe(callback, function (e) { throw e; });
}
function tree(url) {
    return new url_tree_1.DefaultUrlSerializer().parse(url);
}
function expectTreeToBe(actual, expectedUrl) {
    var expected = tree(expectedUrl);
    var serializer = new url_tree_1.DefaultUrlSerializer();
    var error = "\"" + serializer.serialize(actual) + "\" is not equal to \"" + serializer.serialize(expected) + "\"";
    compareSegments(actual.root, expected.root, error);
    expect(actual.queryParams).toEqual(expected.queryParams);
    expect(actual.fragment).toEqual(expected.fragment);
}
function compareSegments(actual, expected, error) {
    expect(actual).toBeDefined(error);
    expect(url_tree_1.equalSegments(actual.segments, expected.segments)).toEqual(true, error);
    expect(Object.keys(actual.children).length).toEqual(Object.keys(expected.children).length, error);
    Object.keys(expected.children).forEach(function (key) {
        compareSegments(actual.children[key], expected.children[key], error);
    });
}
var ComponentA = /** @class */ (function () {
    function ComponentA() {
    }
    return ComponentA;
}());
var ComponentB = /** @class */ (function () {
    function ComponentB() {
    }
    return ComponentB;
}());
var ComponentC = /** @class */ (function () {
    function ComponentC() {
    }
    return ComponentC;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbHlfcmVkaXJlY3RzLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvdGVzdC9hcHBseV9yZWRpcmVjdHMuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUEwQztBQUMxQyxpREFBOEM7QUFDOUMsNkJBQXFDO0FBRXJDLDBEQUFzRDtBQUN0RCx3Q0FBeUQ7QUFDekQsNENBQThGO0FBRTlGLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6QixJQUFNLFVBQVUsR0FBRyxJQUFJLCtCQUFvQixFQUFFLENBQUM7SUFDOUMsSUFBSSxVQUE0QixDQUFDO0lBRWpDLFVBQVUsQ0FBQyxjQUFRLFVBQVUsR0FBRyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU3RCxFQUFFLENBQUMsbURBQW1ELEVBQUU7UUFDdEQsYUFBYSxDQUNUO1lBQ0U7Z0JBQ0UsSUFBSSxFQUFFLEdBQUc7Z0JBQ1QsU0FBUyxFQUFFLFVBQVU7Z0JBQ3JCLFFBQVEsRUFBRTtvQkFDUixFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBQztpQkFDbkM7YUFDRjtTQUNGLEVBQ0QsTUFBTSxFQUFFLFVBQUMsQ0FBVSxJQUFPLGNBQWMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRTtRQUN4QyxhQUFhLENBQ1QsQ0FBQyxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFDLENBQUMsRUFBRSxNQUFNLEVBQ2pGLFVBQUMsQ0FBVSxJQUFPLGNBQWMs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