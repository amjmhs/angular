"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var url_tree_1 = require("../src/url_tree");
describe('UrlTree', function () {
    var serializer = new url_tree_1.DefaultUrlSerializer();
    describe('DefaultUrlSerializer', function () {
        var serializer;
        beforeEach(function () { serializer = new url_tree_1.DefaultUrlSerializer(); });
        it('should parse query parameters', function () {
            var tree = serializer.parse('/path/to?k=v&k/(a;b)=c');
            expect(tree.queryParams).toEqual({
                'k': 'v',
                'k/(a;b)': 'c',
            });
        });
    });
    describe('containsTree', function () {
        describe('exact = true', function () {
            it('should return true when two tree are the same', function () {
                var url = '/one/(one//left:three)(right:four)';
                var t1 = serializer.parse(url);
                var t2 = serializer.parse(url);
                expect(url_tree_1.containsTree(t1, t2, true)).toBe(true);
                expect(url_tree_1.containsTree(t2, t1, true)).toBe(true);
            });
            it('should return true when queryParams are the same', function () {
                var t1 = serializer.parse('/one/two?test=1&page=5');
                var t2 = serializer.parse('/one/two?test=1&page=5');
                expect(url_tree_1.containsTree(t1, t2, true)).toBe(true);
            });
            it('should return false when queryParams are not the same', function () {
                var t1 = serializer.parse('/one/two?test=1&page=5');
                var t2 = serializer.parse('/one/two?test=1');
                expect(url_tree_1.containsTree(t1, t2, true)).toBe(false);
            });
            it('should return false when containee is missing queryParams', function () {
                var t1 = serializer.parse('/one/two?page=5');
                var t2 = serializer.parse('/one/two');
                expect(url_tree_1.containsTree(t1, t2, true)).toBe(false);
            });
            it('should return false when paths are not the same', function () {
                var t1 = serializer.parse('/one/two(right:three)');
                var t2 = serializer.parse('/one/two2(right:three)');
                expect(url_tree_1.containsTree(t1, t2, true)).toBe(false);
            });
            it('should return false when container has an extra child', function () {
                var t1 = serializer.parse('/one/two(right:three)');
                var t2 = serializer.parse('/one/two');
                expect(url_tree_1.containsTree(t1, t2, true)).toBe(false);
            });
            it('should return false when containee has an extra child', function () {
                var t1 = serializer.parse('/one/two');
                var t2 = serializer.parse('/one/two(right:three)');
                expect(url_tree_1.containsTree(t1, t2, true)).toBe(false);
            });
        });
        describe('exact = false', function () {
            it('should return true when containee is missing a segment', function () {
                var t1 = serializer.parse('/one/(two//left:three)(right:four)');
                var t2 = serializer.parse('/one/(two//left:three)');
                expect(url_tree_1.containsTree(t1, t2, false)).toBe(true);
            });
            it('should return true when containee is missing some paths', function () {
                var t1 = serializer.parse('/one/two/three');
                var t2 = serializer.parse('/one/two');
                expect(url_tree_1.containsTree(t1, t2, false)).toBe(true);
            });
            it('should return true container has its paths split into multiple segments', function () {
                var t1 = serializer.parse('/one/(two//left:three)');
                var t2 = serializer.parse('/one/two');
                expect(url_tree_1.containsTree(t1, t2, false)).toBe(true);
            });
            it('should return false when containee has extra segments', function () {
                var t1 = serializer.parse('/one/two');
                var t2 = serializer.parse('/one/(two//left:three)');
                expect(url_tree_1.containsTree(t1, t2, false)).toBe(false);
            });
            it('should return false containee has segments that the container does not have', function () {
                var t1 = serializer.parse('/one/(two//left:three)');
                var t2 = serializer.parse('/one/(two//right:four)');
                expect(url_tree_1.containsTree(t1, t2, false)).toBe(false);
            });
            it('should return false when containee has extra paths', function () {
                var t1 = serializer.parse('/one');
                var t2 = serializer.parse('/one/two');
                expect(url_tree_1.containsTree(t1, t2, false)).toBe(false);
            });
            it('should return true when queryParams are the same', function () {
                var t1 = serializer.parse('/one/two?test=1&page=5');
                var t2 = serializer.parse('/one/two?test=1&page=5');
                expect(url_tree_1.containsTree(t1, t2, false)).toBe(true);
            });
            it('should return true when container contains containees queryParams', function () {
                var t1 = serializer.parse('/one/two?test=1&u=5');
                var t2 = serializer.parse('/one/two?u=5');
                expect(url_tree_1.containsTree(t1, t2, false)).toBe(true);
            });
            it('should return true when containee does not have queryParams', function () {
                var t1 = serializer.parse('/one/two?page=5');
                var t2 = serializer.parse('/one/two');
                expect(url_tree_1.containsTree(t1, t2, false)).toBe(true);
            });
            it('should return false when containee has but container does not have queryParams', function () {
                var t1 = serializer.parse('/one/two');
                var t2 = serializer.parse('/one/two?page=1');
                expect(url_tree_1.containsTree(t1, t2, false)).toBe(false);
            });
            it('should return false when containee has different queryParams', function () {
                var t1 = serializer.parse('/one/two?page=5');
                var t2 = serializer.parse('/one/two?test=1');
                expect(url_tree_1.containsTree(t1, t2, false)).toBe(false);
            });
            it('should return false when containee has more queryParams than container', function () {
                var t1 = serializer.parse('/one/two?page=5');
                var t2 = serializer.parse('/one/two?page=5&test=1');
                expect(url_tree_1.containsTree(t1, t2, false)).toBe(false);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX3RyZWUuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3JvdXRlci90ZXN0L3VybF90cmVlLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw0Q0FBbUU7QUFFbkUsUUFBUSxDQUFDLFNBQVMsRUFBRTtJQUNsQixJQUFNLFVBQVUsR0FBRyxJQUFJLCtCQUFvQixFQUFFLENBQUM7SUFFOUMsUUFBUSxDQUFDLHNCQUFzQixFQUFFO1FBQy9CLElBQUksVUFBZ0MsQ0FBQztRQUVyQyxVQUFVLENBQUMsY0FBUSxVQUFVLEdBQUcsSUFBSSwrQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFL0QsRUFBRSxDQUFDLCtCQUErQixFQUFFO1lBQ2xDLElBQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUN4RCxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDL0IsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsU0FBUyxFQUFFLEdBQUc7YUFDZixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixRQUFRLENBQUMsY0FBYyxFQUFFO1lBQ3ZCLEVBQUUsQ0FBQywrQ0FBK0MsRUFBRTtnQkFDbEQsSUFBTSxHQUFHLEdBQUcsb0NBQW9DLENBQUM7Z0JBQ2pELElBQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pDLElBQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pDLE1BQU0sQ0FBQyx1QkFBWSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJ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