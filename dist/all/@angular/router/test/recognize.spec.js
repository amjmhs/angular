"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var recognize_1 = require("../src/recognize");
var shared_1 = require("../src/shared");
var url_tree_1 = require("../src/url_tree");
describe('recognize', function () {
    it('should work', function () {
        checkRecognize([{ path: 'a', component: ComponentA }], 'a', function (s) {
            checkActivatedRoute(s.root, '', {}, RootComponent);
            checkActivatedRoute(s.firstChild(s.root), 'a', {}, ComponentA);
        });
    });
    it('should freeze params object', function () {
        checkRecognize([{ path: 'a/:id', component: ComponentA }], 'a/10', function (s) {
            checkActivatedRoute(s.root, '', {}, RootComponent);
            var child = s.firstChild(s.root);
            expect(Object.isFrozen(child.params)).toBeTruthy();
        });
    });
    it('should support secondary routes', function () {
        checkRecognize([
            { path: 'a', component: ComponentA }, { path: 'b', component: ComponentB, outlet: 'left' },
            { path: 'c', component: ComponentC, outlet: 'right' }
        ], 'a(left:b//right:c)', function (s) {
            var c = s.children(s.root);
            checkActivatedRoute(c[0], 'a', {}, ComponentA);
            checkActivatedRoute(c[1], 'b', {}, ComponentB, 'left');
            checkActivatedRoute(c[2], 'c', {}, ComponentC, 'right');
        });
    });
    it('should set url segment and index properly', function () {
        var url = tree('a(left:b//right:c)');
        recognize_1.recognize(RootComponent, [
            { path: 'a', component: ComponentA }, { path: 'b', component: ComponentB, outlet: 'left' },
            { path: 'c', component: ComponentC, outlet: 'right' }
        ], url, 'a(left:b//right:c)')
            .subscribe(function (s) {
            expect(s.root._urlSegment).toBe(url.root);
            expect(s.root._lastPathIndex).toBe(-1);
            var c = s.children(s.root);
            expect(c[0]._urlSegment).toBe(url.root.children[shared_1.PRIMARY_OUTLET]);
            expect(c[0]._lastPathIndex).toBe(0);
            expect(c[1]._urlSegment).toBe(url.root.children['left']);
            expect(c[1]._lastPathIndex).toBe(0);
            expect(c[2]._urlSegment).toBe(url.root.children['right']);
            expect(c[2]._lastPathIndex).toBe(0);
        });
    });
    it('should set url segment and index properly (nested case)', function () {
        var url = tree('a/b/c');
        recognize_1.recognize(RootComponent, [
            { path: 'a/b', component: ComponentA, children: [{ path: 'c', component: ComponentC }] },
        ], url, 'a/b/c')
            .subscribe(function (s) {
            expect(s.root._urlSegment).toBe(url.root);
            expect(s.root._lastPathIndex).toBe(-1);
            var compA = s.firstChild(s.root);
            expect(compA._urlSegment).toBe(url.root.children[shared_1.PRIMARY_OUTLET]);
            expect(compA._lastPathIndex).toBe(1);
            var compC = s.firstChild(compA);
            expect(compC._urlSegment).toBe(url.root.children[shared_1.PRIMARY_OUTLET]);
            expect(compC._lastPathIndex).toBe(2);
        });
    });
    it('should set url segment and index properly (wildcard)', function () {
        var url = tree('a/b/c');
        recognize_1.recognize(RootComponent, [
            { path: 'a', component: ComponentA, children: [{ path: '**', component: ComponentB }] },
        ], url, 'a/b/c')
            .subscribe(function (s) {
            expect(s.root._urlSegment).toBe(url.root);
            expect(s.root._lastPathIndex).toBe(-1);
            var compA = s.firstChild(s.root);
            expect(compA._urlSegment).toBe(url.root.children[shared_1.PRIMARY_OUTLET]);
            expect(compA._lastPathIndex).toBe(0);
            var compC = s.firstChild(compA);
            expect(compC._urlSegment).toBe(url.root.children[shared_1.PRIMARY_OUTLET]);
            expect(compC._lastPathIndex).toBe(2);
        });
    });
    it('should match routes in the depth first order', function () {
        checkRecognize([
            { path: 'a', component: ComponentA, children: [{ path: ':id', component: ComponentB }] },
            { path: 'a/:id', component: ComponentC }
        ], 'a/paramA', function (s) {
            checkActivatedRoute(s.root, '', {}, RootComponent);
            checkActivatedRoute(s.firstChild(s.root), 'a', {}, ComponentA);
            checkActivatedRoute(s.firstChild(s.firstChild(s.root)), 'paramA', { id: 'paramA' }, ComponentB);
        });
        checkRecognize([{ path: 'a', component: ComponentA }, { path: 'a/:id', component: ComponentC }], 'a/paramA', function (s) {
            checkActivatedRoute(s.root, '', {}, RootComponent);
            checkActivatedRoute(s.firstChild(s.root), 'a/paramA', { id: 'paramA' }, ComponentC);
        });
    });
    it('should use outlet name when matching secondary routes', function () {
        checkRecognize([
            { path: 'a', component: ComponentA }, { path: 'b', component: ComponentB, outlet: 'left' },
            { path: 'b', component: ComponentC, outlet: 'right' }
        ], 'a(right:b)', function (s) {
            var c = s.children(s.root);
            checkActivatedRoute(c[0], 'a', {}, ComponentA);
            checkActivatedRoute(c[1], 'b', {}, ComponentC, 'right');
        });
    });
    it('should handle non top-level secondary routes', function () {
        checkRecognize([
            {
                path: 'a',
                component: ComponentA,
                children: [
                    { path: 'b', component: ComponentB },
                    { path: 'c', component: ComponentC, outlet: 'left' }
                ]
            },
        ], 'a/(b//left:c)', function (s) {
            var c = s.children(s.firstChild(s.root));
            checkActivatedRoute(c[0], 'b', {}, ComponentB, shared_1.PRIMARY_OUTLET);
            checkActivatedRoute(c[1], 'c', {}, ComponentC, 'left');
        });
    });
    it('should sort routes by outlet name', function () {
        checkRecognize([
            { path: 'a', component: ComponentA }, { path: 'c', component: ComponentC, outlet: 'c' },
            { path: 'b', component: ComponentB, outlet: 'b' }
        ], 'a(c:c//b:b)', function (s) {
            var c = s.children(s.root);
            checkActivatedRoute(c[0], 'a', {}, ComponentA);
            checkActivatedRoute(c[1], 'b', {}, ComponentB, 'b');
            checkActivatedRoute(c[2], 'c', {}, ComponentC, 'c');
        });
    });
    it('should support matrix parameters', function () {
        checkRecognize([
            { path: 'a', component: ComponentA, children: [{ path: 'b', component: ComponentB }] },
            { path: 'c', component: ComponentC, outlet: 'left' }
        ], 'a;a1=11;a2=22/b;b1=111;b2=222(left:c;c1=1111;c2=2222)', function (s) {
            var c = s.children(s.root);
            checkActivatedRoute(c[0], 'a', { a1: '11', a2: '22' }, ComponentA);
            checkActivatedRoute(s.firstChild(c[0]), 'b', { b1: '111', b2: '222' }, ComponentB);
            checkActivatedRoute(c[1], 'c', { c1: '1111', c2: '2222' }, ComponentC, 'left');
        });
    });
    describe('data', function () {
        it('should set static data', function () {
            checkRecognize([{ path: 'a', data: { one: 1 }, component: ComponentA }], 'a', function (s) {
                var r = s.firstChild(s.root);
                expect(r.data).toEqual({ one: 1 });
            });
        });
        it('should inherit componentless route\'s data', function () {
            checkRecognize([{
                    path: 'a',
                    data: { one: 1 },
                    children: [{ path: 'b', data: { two: 2 }, component: ComponentB }]
                }], 'a/b', function (s) {
                var r = s.firstChild(s.firstChild(s.root));
                expect(r.data).toEqual({ one: 1, two: 2 });
            });
        });
        it('should not inherit route\'s data if it has component', function () {
            checkRecognize([{
                    path: 'a',
                    component: ComponentA,
                    data: { one: 1 },
                    children: [{ path: 'b', data: { two: 2 }, component: ComponentB }]
                }], 'a/b', function (s /* RouterStateSnapshot */) {
                var r = s.firstChild(s.firstChild(s.root));
                expect(r.data).toEqual({ two: 2 });
            });
        });
        it('should inherit route\'s data if paramsInheritanceStrategy is \'always\'', function () {
            checkRecognize([{
                    path: 'a',
                    component: ComponentA,
                    data: { one: 1 },
                    children: [{ path: 'b', data: { two: 2 }, component: ComponentB }]
                }], 'a/b', function (s /* RouterStateSnapshot */) {
                var r = s.firstChild(s.firstChild(s.root));
                expect(r.data).toEqual({ one: 1, two: 2 });
            }, 'always');
        });
        it('should set resolved data', function () {
            checkRecognize([{ path: 'a', resolve: { one: 'some-token' }, component: ComponentA }], 'a', function (s) {
                var r = s.firstChild(s.root);
                expect(r._resolve).toEqual({ one: 'some-token' });
            });
        });
    });
    describe('empty path', function () {
        describe('root', function () {
            it('should work', function () {
                checkRecognize([{ path: '', component: ComponentA }], '', function (s) {
                    checkActivatedRoute(s.firstChild(s.root), '', {}, ComponentA);
                });
            });
            it('should match when terminal', function () {
                checkRecognize([{ path: '', pathMatch: 'full', component: ComponentA }], '', function (s) {
                    checkActivatedRoute(s.firstChild(s.root), '', {}, ComponentA);
                });
            });
            it('should work (nested case)', function () {
                checkRecognize([{ path: '', component: ComponentA, children: [{ path: '', component: ComponentB }] }], '', function (s) {
                    checkActivatedRoute(s.firstChild(s.root), '', {}, ComponentA);
                    checkActivatedRoute(s.firstChild(s.firstChild(s.root)), '', {}, ComponentB);
                });
            });
            it('should set url segment and index properly', function () {
                var url = tree('');
                recognize_1.recognize(RootComponent, [{ path: '', component: ComponentA, children: [{ path: '', component: ComponentB }] }], url, '')
                    .forEach(function (s) {
                    expect(s.root._urlSegment).toBe(url.root);
                    expect(s.root._lastPathIndex).toBe(-1);
                    var c = s.firstChild(s.root);
                    expect(c._urlSegment).toBe(url.root);
                    expect(c._lastPathIndex).toBe(-1);
                    var c2 = s.firstChild(s.firstChild(s.root));
                    expect(c2._urlSegment).toBe(url.root);
                    expect(c2._lastPathIndex).toBe(-1);
                });
            });
            it('should inherit params', function () {
                checkRecognize([{
                        path: 'a',
                        component: ComponentA,
                        children: [
                            { path: '', component: ComponentB, children: [{ path: '', component: ComponentC }] }
                        ]
                    }], '/a;p=1', function (s) {
                    checkActivatedRoute(s.firstChild(s.root), 'a', { p: '1' }, ComponentA);
                    checkActivatedRoute(s.firstChild(s.firstChild(s.root)), '', { p: '1' }, ComponentB);
                    checkActivatedRoute(s.firstChild(s.firstChild(s.firstChild(s.root))), '', { p: '1' }, ComponentC);
                });
            });
        });
        describe('aux split is in the middle', function () {
            it('should match (non-terminal)', function () {
                checkRecognize([{
                        path: 'a',
                        component: ComponentA,
                        children: [
                            { path: 'b', component: ComponentB },
                            { path: '', component: ComponentC, outlet: 'aux' }
                        ]
                    }], 'a/b', function (s) {
                    checkActivatedRoute(s.firstChild(s.root), 'a', {}, ComponentA);
                    var c = s.children(s.firstChild(s.root));
                    checkActivatedRoute(c[0], 'b', {}, ComponentB);
                    checkActivatedRoute(c[1], '', {}, ComponentC, 'aux');
                });
            });
            it('should match (non-terminal) when both primary and secondary and primary has a child', function () {
                var config = [{
                        path: 'parent',
                        children: [
                            {
                                path: '',
                                component: ComponentA,
                                children: [
                                    { path: 'b', component: ComponentB },
                                    { path: 'c', component: ComponentC },
                                ]
                            },
                            {
                                path: '',
                                component: ComponentD,
                                outlet: 'secondary',
                            }
                        ]
                    }];
                checkRecognize(config, 'parent/b', function (s) {
                    checkActivatedRoute(s.root, '', {}, RootComponent);
                    checkActivatedRoute(s.firstChild(s.root), 'parent', {}, undefined);
                    var cc = s.children(s.firstChild(s.root));
                    checkActivatedRoute(cc[0], '', {}, ComponentA);
                    checkActivatedRoute(cc[1], '', {}, ComponentD, 'secondary');
                    checkActivatedRoute(s.firstChild(cc[0]), 'b', {}, ComponentB);
                });
            });
            it('should match (terminal)', function () {
                checkRecognize([{
                        path: 'a',
                        component: ComponentA,
                        children: [
                            { path: 'b', component: ComponentB },
                            { path: '', pathMatch: 'full', component: ComponentC, outlet: 'aux' }
                        ]
                    }], 'a/b', function (s) {
                    checkActivatedRoute(s.firstChild(s.root), 'a', {}, ComponentA);
                    var c = s.children(s.firstChild(s.root));
                    expect(c.length).toEqual(1);
                    checkActivatedRoute(c[0], 'b', {}, ComponentB);
                });
            });
            it('should set url segment and index properly', function () {
                var url = tree('a/b');
                recognize_1.recognize(RootComponent, [{
                        path: 'a',
                        component: ComponentA,
                        children: [
                            { path: 'b', component: ComponentB },
                            { path: '', component: ComponentC, outlet: 'aux' }
                        ]
                    }], url, 'a/b')
                    .forEach(function (s) {
                    expect(s.root._urlSegment).toBe(url.root);
                    expect(s.root._lastPathIndex).toBe(-1);
                    var a = s.firstChild(s.root);
                    expect(a._urlSegment).toBe(url.root.children[shared_1.PRIMARY_OUTLET]);
                    expect(a._lastPathIndex).toBe(0);
                    var b = s.firstChild(a);
                    expect(b._urlSegment).toBe(url.root.children[shared_1.PRIMARY_OUTLET]);
                    expect(b._lastPathIndex).toBe(1);
                    var c = s.children(a)[1];
                    expect(c._urlSegment).toBe(url.root.children[shared_1.PRIMARY_OUTLET]);
                    expect(c._lastPathIndex).toBe(0);
                });
            });
            it('should set url segment and index properly when nested empty-path segments', function () {
                var url = tree('a');
                recognize_1.recognize(RootComponent, [{
                        path: 'a',
                        children: [
                            { path: '', component: ComponentB, children: [{ path: '', component: ComponentC }] }
                        ]
                    }], url, 'a')
                    .forEach(function (s) {
                    expect(s.root._urlSegment).toBe(url.root);
                    expect(s.root._lastPathIndex).toBe(-1);
                    var a = s.firstChild(s.root);
                    expect(a._urlSegment).toBe(url.root.children[shared_1.PRIMARY_OUTLET]);
                    expect(a._lastPathIndex).toBe(0);
                    var b = s.firstChild(a);
                    expect(b._urlSegment).toBe(url.root.children[shared_1.PRIMARY_OUTLET]);
                    expect(b._lastPathIndex).toBe(0);
                    var c = s.firstChild(b);
                    expect(c._urlSegment).toBe(url.root.children[shared_1.PRIMARY_OUTLET]);
                    expect(c._lastPathIndex).toBe(0);
                });
            });
            it('should set url segment and index properly with the "corrected" option for nested empty-path segments', function () {
                var url = tree('a/b');
                recognize_1.recognize(RootComponent, [{
                        path: 'a',
                        children: [{
                                path: 'b',
                                component: ComponentB,
                                children: [{
                                        path: '',
                                        component: ComponentC,
                                        children: [{ path: '', component: ComponentD }]
                                    }]
                            }]
                    }], url, 'a/b', 'emptyOnly', 'corrected')
                    .forEach(function (s) {
                    expect(s.root._urlSegment).toBe(url.root);
                    expect(s.root._lastPathIndex).toBe(-1);
                    var a = s.firstChild(s.root);
                    expect(a._urlSegment).toBe(url.root.children[shared_1.PRIMARY_OUTLET]);
                    expect(a._lastPathIndex).toBe(0);
                    var b = s.firstChild(a);
                    expect(b._urlSegment).toBe(url.root.children[shared_1.PRIMARY_OUTLET]);
                    expect(b._lastPathIndex).toBe(1);
                    var c = s.firstChild(b);
                    expect(c._urlSegment).toBe(url.root.children[shared_1.PRIMARY_OUTLET]);
                    expect(c._lastPathIndex).toBe(1);
                    var d = s.firstChild(c);
                    expect(d._urlSegment).toBe(url.root.children[shared_1.PRIMARY_OUTLET]);
                    expect(d._lastPathIndex).toBe(1);
                });
            });
            it('should set url segment and index properly when nested empty-path segments (2)', function () {
                var url = tree('');
                recognize_1.recognize(RootComponent, [{
                        path: '',
                        children: [
                            { path: '', component: ComponentB, children: [{ path: '', component: ComponentC }] }
                        ]
                    }], url, '')
                    .forEach(function (s) {
                    expect(s.root._urlSegment).toBe(url.root);
                    expect(s.root._lastPathIndex).toBe(-1);
                    var a = s.firstChild(s.root);
                    expect(a._urlSegment).toBe(url.root);
                    expect(a._lastPathIndex).toBe(-1);
                    var b = s.firstChild(a);
                    expect(b._urlSegment).toBe(url.root);
                    expect(b._lastPathIndex).toBe(-1);
                    var c = s.firstChild(b);
                    expect(c._urlSegment).toBe(url.root);
                    expect(c._lastPathIndex).toBe(-1);
                });
            });
        });
        describe('aux split at the end (no right child)', function () {
            it('should match (non-terminal)', function () {
                checkRecognize([{
                        path: 'a',
                        component: ComponentA,
                        children: [
                            { path: '', component: ComponentB },
                            { path: '', component: ComponentC, outlet: 'aux' },
                        ]
                    }], 'a', function (s) {
                    checkActivatedRoute(s.firstChild(s.root), 'a', {}, ComponentA);
                    var c = s.children(s.firstChild(s.root));
                    checkActivatedRoute(c[0], '', {}, ComponentB);
                    checkActivatedRoute(c[1], '', {}, ComponentC, 'aux');
                });
            });
            it('should match (terminal)', function () {
                checkRecognize([{
                        path: 'a',
                        component: ComponentA,
                        children: [
                            { path: '', pathMatch: 'full', component: ComponentB },
                            { path: '', pathMatch: 'full', component: ComponentC, outlet: 'aux' },
                        ]
                    }], 'a', function (s) {
                    checkActivatedRoute(s.firstChild(s.root), 'a', {}, ComponentA);
                    var c = s.children(s.firstChild(s.root));
                    checkActivatedRoute(c[0], '', {}, ComponentB);
                    checkActivatedRoute(c[1], '', {}, ComponentC, 'aux');
                });
            });
            it('should work only only primary outlet', function () {
                checkRecognize([{
                        path: 'a',
                        component: ComponentA,
                        children: [
                            { path: '', component: ComponentB },
                            { path: 'c', component: ComponentC, outlet: 'aux' },
                        ]
                    }], 'a/(aux:c)', function (s) {
                    checkActivatedRoute(s.firstChild(s.root), 'a', {}, ComponentA);
                    var c = s.children(s.firstChild(s.root));
                    checkActivatedRoute(c[0], '', {}, ComponentB);
                    checkActivatedRoute(c[1], 'c', {}, ComponentC, 'aux');
                });
            });
            it('should work when split is at the root level', function () {
                checkRecognize([
                    { path: '', component: ComponentA }, { path: 'b', component: ComponentB },
                    { path: 'c', component: ComponentC, outlet: 'aux' }
                ], '(aux:c)', function (s) {
                    checkActivatedRoute(s.root, '', {}, RootComponent);
                    var children = s.children(s.root);
                    expect(children.length).toEqual(2);
                    checkActivatedRoute(children[0], '', {}, ComponentA);
                    checkActivatedRoute(children[1], 'c', {}, ComponentC, 'aux');
                });
            });
        });
        describe('split at the end (right child)', function () {
            it('should match (non-terminal)', function () {
                checkRecognize([{
                        path: 'a',
                        component: ComponentA,
                        children: [
                            { path: '', component: ComponentB, children: [{ path: 'd', component: ComponentD }] },
                            {
                                path: '',
                                component: ComponentC,
                                outlet: 'aux',
                                children: [{ path: 'e', component: ComponentE }]
                            },
                        ]
                    }], 'a/(d//aux:e)', function (s) {
                    checkActivatedRoute(s.firstChild(s.root), 'a', {}, ComponentA);
                    var c = s.children(s.firstChild(s.root));
                    checkActivatedRoute(c[0], '', {}, ComponentB);
                    checkActivatedRoute(s.firstChild(c[0]), 'd', {}, ComponentD);
                    checkActivatedRoute(c[1], '', {}, ComponentC, 'aux');
                    checkActivatedRoute(s.firstChild(c[1]), 'e', {}, ComponentE);
                });
            });
        });
    });
    describe('wildcards', function () {
        it('should support simple wildcards', function () {
            checkRecognize([{ path: '**', component: ComponentA }], 'a/b/c/d;a1=11', function (s) {
                checkActivatedRoute(s.firstChild(s.root), 'a/b/c/d', { a1: '11' }, ComponentA);
            });
        });
    });
    describe('componentless routes', function () {
        it('should work', function () {
            checkRecognize([{
                    path: 'p/:id',
                    children: [
                        { path: 'a', component: ComponentA },
                        { path: 'b', component: ComponentB, outlet: 'aux' }
                    ]
                }], 'p/11;pp=22/(a;pa=33//aux:b;pb=44)', function (s) {
                var p = s.firstChild(s.root);
                checkActivatedRoute(p, 'p/11', { id: '11', pp: '22' }, undefined);
                var c = s.children(p);
                checkActivatedRoute(c[0], 'a', { id: '11', pp: '22', pa: '33' }, ComponentA);
                checkActivatedRoute(c[1], 'b', { id: '11', pp: '22', pb: '44' }, ComponentB, 'aux');
            });
        });
        it('should inherit params until encounters a normal route', function () {
            checkRecognize([{
                    path: 'p/:id',
                    children: [{
                            path: 'a/:name',
                            children: [{
                                    path: 'b',
                                    component: ComponentB,
                                    children: [{ path: 'c', component: ComponentC }]
                                }]
                        }]
                }], 'p/11/a/victor/b/c', function (s) {
                var p = s.firstChild(s.root);
                checkActivatedRoute(p, 'p/11', { id: '11' }, undefined);
                var a = s.firstChild(p);
                checkActivatedRoute(a, 'a/victor', { id: '11', name: 'victor' }, undefined);
                var b = s.firstChild(a);
                checkActivatedRoute(b, 'b', { id: '11', name: 'victor' }, ComponentB);
                var c = s.firstChild(b);
                checkActivatedRoute(c, 'c', {}, ComponentC);
            });
        });
        it('should inherit all params if paramsInheritanceStrategy is \'always\'', function () {
            checkRecognize([{
                    path: 'p/:id',
                    children: [{
                            path: 'a/:name',
                            children: [{
                                    path: 'b',
                                    component: ComponentB,
                                    children: [{ path: 'c', component: ComponentC }]
                                }]
                        }]
                }], 'p/11/a/victor/b/c', function (s /* RouterStateSnapshot */) {
                var c = s.firstChild(s.firstChild(s.firstChild(s.firstChild(s.root))));
                checkActivatedRoute(c, 'c', { id: '11', name: 'victor' }, ComponentC);
            }, 'always');
        });
    });
    describe('empty URL leftovers', function () {
        it('should not throw when no children matching', function () {
            checkRecognize([{ path: 'a', component: ComponentA, children: [{ path: 'b', component: ComponentB }] }], '/a', function (s) {
                var a = s.firstChild(s.root);
                checkActivatedRoute(a, 'a', {}, ComponentA);
            });
        });
        it('should not throw when no children matching (aux routes)', function () {
            checkRecognize([{
                    path: 'a',
                    component: ComponentA,
                    children: [
                        { path: 'b', component: ComponentB },
                        { path: '', component: ComponentC, outlet: 'aux' },
                    ]
                }], '/a', function (s) {
                var a = s.firstChild(s.root);
                checkActivatedRoute(a, 'a', {}, ComponentA);
                checkActivatedRoute(a.children[0], '', {}, ComponentC, 'aux');
            });
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
            checkRecognize([{
                    matcher: matcher,
                    component: ComponentA,
                    children: [{ path: 'b', component: ComponentB }]
                }], '/a/1;p=99/b', function (s) {
                var a = s.root.firstChild;
                checkActivatedRoute(a, 'a/1', { id: '1', p: '99' }, ComponentA);
                checkActivatedRoute(a.firstChild, 'b', {}, ComponentB);
            });
        });
        it('should work with terminal route', function () {
            var matcher = function (s, g, r) { return s.length === 0 ? ({ consumed: s }) : null; };
            checkRecognize([{ matcher: matcher, component: ComponentA }], '', function (s) {
                var a = s.root.firstChild;
                checkActivatedRoute(a, '', {}, ComponentA);
            });
        });
        it('should work with child terminal route', function () {
            var matcher = function (s, g, r) { return s.length === 0 ? ({ consumed: s }) : null; };
            checkRecognize([{ path: 'a', component: ComponentA, children: [{ matcher: matcher, component: ComponentB }] }], 'a', function (s) {
                var a = s.root.firstChild;
                checkActivatedRoute(a, 'a', {}, ComponentA);
            });
        });
    });
    describe('query parameters', function () {
        it('should support query params', function () {
            var config = [{ path: 'a', component: ComponentA }];
            checkRecognize(config, 'a?q=11', function (s) {
                expect(s.root.queryParams).toEqual({ q: '11' });
                expect(s.root.queryParamMap.get('q')).toEqual('11');
            });
        });
        it('should freeze query params object', function () {
            checkRecognize([{ path: 'a', component: ComponentA }], 'a?q=11', function (s) {
                expect(Object.isFrozen(s.root.queryParams)).toBeTruthy();
            });
        });
        it('should not freeze UrlTree query params', function () {
            var url = tree('a?q=11');
            recognize_1.recognize(RootComponent, [{ path: 'a', component: ComponentA }], url, 'a?q=11')
                .subscribe(function (s) {
                expect(Object.isFrozen(url.queryParams)).toBe(false);
            });
        });
    });
    describe('fragment', function () {
        it('should support fragment', function () {
            var config = [{ path: 'a', component: ComponentA }];
            checkRecognize(config, 'a#f1', function (s) { expect(s.root.fragment).toEqual('f1'); });
        });
    });
    describe('error handling', function () {
        it('should error when two routes with the same outlet name got matched', function () {
            recognize_1.recognize(RootComponent, [
                { path: 'a', component: ComponentA }, { path: 'b', component: ComponentB, outlet: 'aux' },
                { path: 'c', component: ComponentC, outlet: 'aux' }
            ], tree('a(aux:b//aux:c)'), 'a(aux:b//aux:c)')
                .subscribe(function (_) { }, function (s) {
                expect(s.toString())
                    .toContain('Two segments cannot have the same outlet name: \'aux:b\' and \'aux:c\'.');
            });
        });
    });
});
function checkRecognize(config, url, callback, paramsInheritanceStrategy) {
    recognize_1.recognize(RootComponent, config, tree(url), url, paramsInheritanceStrategy)
        .subscribe(callback, function (e) { throw e; });
}
function checkActivatedRoute(actual, url, params, cmp, outlet) {
    if (outlet === void 0) { outlet = shared_1.PRIMARY_OUTLET; }
    if (actual === null) {
        expect(actual).not.toBeNull();
    }
    else {
        expect(actual.url.map(function (s) { return s.path; }).join('/')).toEqual(url);
        expect(actual.params).toEqual(params);
        expect(actual.component).toBe(cmp);
        expect(actual.outlet).toEqual(outlet);
    }
}
function tree(url) {
    return new url_tree_1.DefaultUrlSerializer().parse(url);
}
var RootComponent = /** @class */ (function () {
    function RootComponent() {
    }
    return RootComponent;
}());
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
var ComponentD = /** @class */ (function () {
    function ComponentD() {
    }
    return ComponentD;
}());
var ComponentE = /** @class */ (function () {
    function ComponentE() {
    }
    return ComponentE;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb2duaXplLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvdGVzdC9yZWNvZ25pemUuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILDhDQUEyQztBQUUzQyx3Q0FBcUQ7QUFDckQsNENBQThEO0FBRTlELFFBQVEsQ0FBQyxXQUFXLEVBQUU7SUFDcEIsRUFBRSxDQUFDLGFBQWEsRUFBRTtRQUNoQixjQUFjLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLFVBQUMsQ0FBTTtZQUMvRCxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDbkQsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNuRSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDZCQUE2QixFQUFFO1FBQ2hDLGNBQWMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBQyxDQUFzQjtZQUN0RixtQkFBbUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDbkQsSUFBTSxLQUFLLEdBQUksQ0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFHLENBQUM7WUFDOUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRTtRQUNwQyxjQUFjLENBQ1Y7WUFDRSxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUM7WUFDdEYsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBQztTQUNwRCxFQUNELG9CQUFvQixFQUFFLFVBQUMsQ0FBc0I7WUFDM0MsSUFBTSxDQUFDLEdBQUksQ0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDL0MsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZELG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMxRCxDQUFDLENBQUMsQ0FBQztJQUNULENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDJDQUEyQyxFQUFFO1FBQzlDLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3ZDLHFCQUFTLENBQ0wsYUFBYSxFQUNiO1lBQ0UsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFDO1lBQ3RGLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUM7U0FDcEQsRUFDRCxHQUFHLEVBQUUsb0JBQW9CLENBQUM7YUFDekIsU0FBUyxDQUFDLFVBQUMsQ0FBTTtZQUNoQixNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXZDLElBQU0sQ0FBQyxHQUFJLENBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBQyxJQUFZLENBQUMsUUFBUSxDQUFDLHVCQUFjLENBQUMsQ0FBQyxDQUFDO1lBQzFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXBDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBQyxJQUFZLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDbEUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFcEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUUsR0FBRyxDQUFDLElBQVksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNuRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQztJQUNULENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHlEQUF5RCxFQUFFO1FBQzVELElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxQixxQkFBUyxDQUNMLGFBQWEsRUFDYjtZQUNFLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFDLENBQUMsRUFBQztTQUNyRixFQUNELEdBQUcsRUFBRSxPQUFPLENBQUM7YUFDWixTQUFTLENBQUMsVUFBQyxDQUFzQjtZQUNoQyxNQUFNLENBQUUsQ0FBQyxDQUFDLElBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25ELE1BQU0sQ0FBRSxDQUFDLENBQUMsSUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWhELElBQU0sS0FBSyxHQUFJLENBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBRyxDQUFDO1lBQzlDLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBQyxJQUFZLENBQUMsUUFBUSxDQUFDLHVCQUFjLENBQUMsQ0FBQyxDQUFDO1lBQzNFLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXJDLElBQU0sS0FBSyxHQUFJLENBQVMsQ0FBQyxVQUFVLENBQU0sS0FBSyxDQUFHLENBQUM7WUFDbEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUUsR0FBRyxDQUFDLElBQVksQ0FBQyxRQUFRLENBQUMsdUJBQWMsQ0FBQyxDQUFDLENBQUM7WUFDM0UsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzREFBc0QsRUFBRTtRQUN6RCxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDMUIscUJBQVMsQ0FDTCxhQUFhLEVBQ2I7WUFDRSxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBQyxDQUFDLEVBQUM7U0FDcEYsRUFDRCxHQUFHLEVBQUUsT0FBTyxDQUFDO2FBQ1osU0FBUyxDQUFDLFVBQUMsQ0FBTTtZQUNoQixNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXZDLElBQU0sS0FBSyxHQUFJLENBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBRyxDQUFDO1lBQzlDLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFFLEdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLHVCQUFjLENBQUMsQ0FBQyxDQUFDO1lBQzNFLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXJDLElBQU0sS0FBSyxHQUFJLENBQVMsQ0FBQyxVQUFVLENBQU0sS0FBSyxDQUFHLENBQUM7WUFDbEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUUsR0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsdUJBQWMsQ0FBQyxDQUFDLENBQUM7WUFDM0UsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtRQUNqRCxjQUFjLENBQ1Y7WUFDRSxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBQyxDQUFDLEVBQUM7WUFDcEYsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUM7U0FDdkMsRUFDRCxVQUFVLEVBQUUsVUFBQyxDQUFzQjtZQUNqQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDbkQsbUJBQW1CLENBQUUsQ0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUMxRSxtQkFBbUIsQ0FDZCxDQUFTLENBQUMsVUFBVSxDQUFPLENBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUMsRUFBRSxFQUFFLFFBQVEsRUFBQyxFQUNyRixVQUFVLENBQUMsQ0FBQztRQUNsQixDQUFDLENBQUMsQ0FBQztRQUVQLGNBQWMsQ0FDVixDQUFDLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUMsQ0FBQyxFQUFFLFVBQVUsRUFDeEYsVUFBQyxDQUFzQjtZQUNyQixtQkFBbUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDbkQsbUJBQW1CLENBQ2QsQ0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFHLEVBQUUsVUFBVSxFQUFFLEVBQUMsRUFBRSxFQUFFLFFBQVEsRUFBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQy9FLENBQUMsQ0FBQyxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsdURBQXVELEVBQUU7UUFDMUQsY0FBYyxDQUNWO1lBQ0UsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFDO1lBQ3RGLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUM7U0FDcEQsRUFDRCxZQUFZLEVBQUUsVUFBQyxDQUFzQjtZQUNuQyxJQUFNLENBQUMsR0FBSSxDQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUMvQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtRQUNqRCxjQUFjLENBQ1Y7WUFDRTtnQkFDRSxJQUFJLEVBQUUsR0FBRztnQkFDVCxTQUFTLEVBQUUsVUFBVTtnQkFDckIsUUFBUSxFQUFFO29CQUNSLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFDO29CQUNsQyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFDO2lCQUNuRDthQUNGO1NBQ0YsRUFDRCxlQUFlLEVBQUUsVUFBQyxDQUFzQjtZQUN0QyxJQUFNLENBQUMsR0FBSSxDQUFTLENBQUMsUUFBUSxDQUFPLENBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbEUsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLHVCQUFjLENBQUMsQ0FBQztZQUMvRCxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDekQsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRTtRQUN0QyxjQUFjLENBQ1Y7WUFDRSxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUM7WUFDbkYsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBQztTQUNoRCxFQUNELGFBQWEsRUFBRSxVQUFDLENBQXNCO1lBQ3BDLElBQU0sQ0FBQyxHQUFJLENBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQy9DLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNwRCxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdEQsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRTtRQUNyQyxjQUFjLENBQ1Y7WUFDRSxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBQyxDQUFDLEVBQUM7WUFDbEYsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBQztTQUNuRCxFQUNELHVEQUF1RCxFQUFFLFVBQUMsQ0FBc0I7WUFDOUUsSUFBTSxDQUFDLEdBQUksQ0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ2pFLG1CQUFtQixDQUNkLENBQVMsQ0FBQyxVQUFVLENBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDakYsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMvRSxDQUFDLENBQUMsQ0FBQztJQUNULENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLE1BQU0sRUFBRTtRQUNmLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRTtZQUMzQixjQUFjLENBQ1YsQ0FBQyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUMsR0FBRyxFQUFFLENBQUMsRUFBQyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFDLENBQXNCO2dCQUNoRixJQUFNLENBQUMsR0FBNEIsQ0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFHLENBQUM7Z0JBQ2xFLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsR0FBRyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDbkMsQ0FBQyxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtZQUMvQyxjQUFjLENBQ1YsQ0FBQztvQkFDQyxJQUFJLEVBQUUsR0FBRztvQkFDVCxJQUFJLEVBQUUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxFQUFDO29CQUNkLFFBQVEsRUFBRSxDQUFDLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxFQUFDLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBQyxDQUFDO2lCQUMvRCxDQUFDLEVBQ0YsS0FBSyxFQUFFLFVBQUMsQ0FBc0I7Z0JBQzVCLElBQU0sQ0FBQyxHQUNGLENBQVMsQ0FBQyxVQUFVLENBQU8sQ0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUcsQ0FBQztnQkFDaEUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQzNDLENBQUMsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsc0RBQXNELEVBQUU7WUFDekQsY0FBYyxDQUNWLENBQUM7b0JBQ0MsSUFBSSxFQUFFLEdBQUc7b0JBQ1QsU0FBUyxFQUFFLFVBQVU7b0JBQ3JCLElBQUksRUFBRSxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUM7b0JBQ2QsUUFBUSxFQUFFLENBQUMsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFDLENBQUM7aUJBQy9ELENBQUMsRUFDRixLQUFLLEVBQUUsVUFBQyxDQUFNLENBQUMseUJBQXlCO2dCQUN0QyxJQUFNLENBQUMsR0FBMkIsQ0FBQyxDQUFDLFVBQVUsQ0FBTSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBRyxDQUFDO2dCQUM1RSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQ25DLENBQUMsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMseUVBQXlFLEVBQUU7WUFDNUUsY0FBYyxDQUNWLENBQUM7b0JBQ0MsSUFBSSxFQUFFLEdBQUc7b0JBQ1QsU0FBUyxFQUFFLFVBQVU7b0JBQ3JCLElBQUksRUFBRSxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUM7b0JBQ2QsUUFBUSxFQUFFLENBQUMsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFDLENBQUM7aUJBQy9ELENBQUMsRUFDRixLQUFLLEVBQUUsVUFBQyxDQUFNLENBQUMseUJBQXlCO2dCQUN0QyxJQUFNLENBQUMsR0FBMkIsQ0FBQyxDQUFDLFVBQVUsQ0FBTSxDQUFDLENBQUMsVUFBVSxD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