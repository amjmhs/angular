"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../src/shared");
var url_tree_1 = require("../src/url_tree");
describe('url serializer', function () {
    var url = new url_tree_1.DefaultUrlSerializer();
    it('should parse the root url', function () {
        var tree = url.parse('/');
        expectSegment(tree.root, '');
        expect(url.serialize(tree)).toEqual('/');
    });
    it('should parse non-empty urls', function () {
        var tree = url.parse('one/two');
        expectSegment(tree.root.children[shared_1.PRIMARY_OUTLET], 'one/two');
        expect(url.serialize(tree)).toEqual('/one/two');
    });
    it('should parse multiple secondary segments', function () {
        var tree = url.parse('/one/two(left:three//right:four)');
        expectSegment(tree.root.children[shared_1.PRIMARY_OUTLET], 'one/two');
        expectSegment(tree.root.children['left'], 'three');
        expectSegment(tree.root.children['right'], 'four');
        expect(url.serialize(tree)).toEqual('/one/two(left:three//right:four)');
    });
    it('should parse top-level nodes with only secondary segment', function () {
        var tree = url.parse('/(left:one)');
        expect(tree.root.numberOfChildren).toEqual(1);
        expectSegment(tree.root.children['left'], 'one');
        expect(url.serialize(tree)).toEqual('/(left:one)');
    });
    it('should parse nodes with only secondary segment', function () {
        var tree = url.parse('/one/(left:two)');
        var one = tree.root.children[shared_1.PRIMARY_OUTLET];
        expectSegment(one, 'one', true);
        expect(one.numberOfChildren).toEqual(1);
        expectSegment(one.children['left'], 'two');
        expect(url.serialize(tree)).toEqual('/one/(left:two)');
    });
    it('should not parse empty path segments with params', function () {
        expect(function () { return url.parse('/one/two/(;a=1//right:;b=2)'); })
            .toThrowError(/Empty path url segment cannot have parameters/);
    });
    it('should parse scoped secondary segments', function () {
        var tree = url.parse('/one/(two//left:three)');
        var primary = tree.root.children[shared_1.PRIMARY_OUTLET];
        expectSegment(primary, 'one', true);
        expectSegment(primary.children[shared_1.PRIMARY_OUTLET], 'two');
        expectSegment(primary.children['left'], 'three');
        expect(url.serialize(tree)).toEqual('/one/(two//left:three)');
    });
    it('should parse scoped secondary segments with unscoped ones', function () {
        var tree = url.parse('/one/(two//left:three)(right:four)');
        var primary = tree.root.children[shared_1.PRIMARY_OUTLET];
        expectSegment(primary, 'one', true);
        expectSegment(primary.children[shared_1.PRIMARY_OUTLET], 'two');
        expectSegment(primary.children['left'], 'three');
        expectSegment(tree.root.children['right'], 'four');
        expect(url.serialize(tree)).toEqual('/one/(two//left:three)(right:four)');
    });
    it('should parse secondary segments that have children', function () {
        var tree = url.parse('/one(left:two/three)');
        expectSegment(tree.root.children[shared_1.PRIMARY_OUTLET], 'one');
        expectSegment(tree.root.children['left'], 'two/three');
        expect(url.serialize(tree)).toEqual('/one(left:two/three)');
    });
    it('should parse an empty secondary segment group', function () {
        var tree = url.parse('/one()');
        expectSegment(tree.root.children[shared_1.PRIMARY_OUTLET], 'one');
        expect(url.serialize(tree)).toEqual('/one');
    });
    it('should parse key-value matrix params', function () {
        var tree = url.parse('/one;a=11a;b=11b(left:two;c=22//right:three;d=33)');
        expectSegment(tree.root.children[shared_1.PRIMARY_OUTLET], 'one;a=11a;b=11b');
        expectSegment(tree.root.children['left'], 'two;c=22');
        expectSegment(tree.root.children['right'], 'three;d=33');
        expect(url.serialize(tree)).toEqual('/one;a=11a;b=11b(left:two;c=22//right:three;d=33)');
    });
    it('should parse key only matrix params', function () {
        var tree = url.parse('/one;a');
        expectSegment(tree.root.children[shared_1.PRIMARY_OUTLET], 'one;a=');
        expect(url.serialize(tree)).toEqual('/one;a=');
    });
    it('should parse query params (root)', function () {
        var tree = url.parse('/?a=1&b=2');
        expect(tree.root.children).toEqual({});
        expect(tree.queryParams).toEqual({ a: '1', b: '2' });
        expect(url.serialize(tree)).toEqual('/?a=1&b=2');
    });
    it('should parse query params', function () {
        var tree = url.parse('/one?a=1&b=2');
        expect(tree.queryParams).toEqual({ a: '1', b: '2' });
    });
    it('should parse query params when with parenthesis', function () {
        var tree = url.parse('/one?a=(11)&b=(22)');
        expect(tree.queryParams).toEqual({ a: '(11)', b: '(22)' });
    });
    it('should parse query params when with slashes', function () {
        var tree = url.parse('/one?a=1/2&b=3/4');
        expect(tree.queryParams).toEqual({ a: '1/2', b: '3/4' });
    });
    it('should parse key only query params', function () {
        var tree = url.parse('/one?a');
        expect(tree.queryParams).toEqual({ a: '' });
    });
    it('should parse a value-empty query param', function () {
        var tree = url.parse('/one?a=');
        expect(tree.queryParams).toEqual({ a: '' });
    });
    it('should parse value-empty query params', function () {
        var tree = url.parse('/one?a=&b=');
        expect(tree.queryParams).toEqual({ a: '', b: '' });
    });
    it('should serializer query params', function () {
        var tree = url.parse('/one?a');
        expect(url.serialize(tree)).toEqual('/one?a=');
    });
    it('should handle multiple query params of the same name into an array', function () {
        var tree = url.parse('/one?a=foo&a=bar&a=swaz');
        expect(tree.queryParams).toEqual({ a: ['foo', 'bar', 'swaz'] });
        expect(tree.queryParamMap.get('a')).toEqual('foo');
        expect(tree.queryParamMap.getAll('a')).toEqual(['foo', 'bar', 'swaz']);
        expect(url.serialize(tree)).toEqual('/one?a=foo&a=bar&a=swaz');
    });
    it('should parse fragment', function () {
        var tree = url.parse('/one#two');
        expect(tree.fragment).toEqual('two');
        expect(url.serialize(tree)).toEqual('/one#two');
    });
    it('should parse fragment (root)', function () {
        var tree = url.parse('/#one');
        expectSegment(tree.root, '');
        expect(url.serialize(tree)).toEqual('/#one');
    });
    it('should parse empty fragment', function () {
        var tree = url.parse('/one#');
        expect(tree.fragment).toEqual('');
        expect(url.serialize(tree)).toEqual('/one#');
    });
    describe('encoding/decoding', function () {
        it('should encode/decode path segments and parameters', function () {
            var _a;
            var u = "/" + url_tree_1.encodeUriSegment("one two") + ";" + url_tree_1.encodeUriSegment("p 1") + "=" + url_tree_1.encodeUriSegment("v 1") + ";" + url_tree_1.encodeUriSegment("p 2") + "=" + url_tree_1.encodeUriSegment("v 2");
            var tree = url.parse(u);
            expect(tree.root.children[shared_1.PRIMARY_OUTLET].segments[0].path).toEqual('one two');
            expect(tree.root.children[shared_1.PRIMARY_OUTLET].segments[0].parameters)
                .toEqual((_a = {}, _a['p 1'] = 'v 1', _a['p 2'] = 'v 2', _a));
            expect(url.serialize(tree)).toEqual(u);
        });
        it('should encode/decode "slash" in path segments and parameters', function () {
            var u = "/" + url_tree_1.encodeUriSegment("one/two") + ";" + url_tree_1.encodeUriSegment("p/1") + "=" + url_tree_1.encodeUriSegment("v/1") + "/three";
            var tree = url.parse(u);
            var segment = tree.root.children[shared_1.PRIMARY_OUTLET].segments[0];
            expect(segment.path).toEqual('one/two');
            expect(segment.parameters).toEqual({ 'p/1': 'v/1' });
            expect(segment.parameterMap.get('p/1')).toEqual('v/1');
            expect(segment.parameterMap.getAll('p/1')).toEqual(['v/1']);
            expect(url.serialize(tree)).toEqual(u);
        });
        it('should encode/decode query params', function () {
            var u = "/one?" + url_tree_1.encodeUriQuery("p 1") + "=" + url_tree_1.encodeUriQuery("v 1") + "&" + url_tree_1.encodeUriQuery("p 2") + "=" + url_tree_1.encodeUriQuery("v 2");
            var tree = url.parse(u);
            expect(tree.queryParams).toEqual({ 'p 1': 'v 1', 'p 2': 'v 2' });
            expect(tree.queryParamMap.get('p 1')).toEqual('v 1');
            expect(tree.queryParamMap.get('p 2')).toEqual('v 2');
            expect(url.serialize(tree)).toEqual(u);
        });
        it('should decode spaces in query as %20 or +', function () {
            var u1 = "/one?foo=bar baz";
            var u2 = "/one?foo=bar+baz";
            var u3 = "/one?foo=bar%20baz";
            var u1p = url.parse(u1);
            var u2p = url.parse(u2);
            var u3p = url.parse(u3);
            expect(url.serialize(u1p)).toBe(url.serialize(u2p));
            expect(url.serialize(u2p)).toBe(url.serialize(u3p));
            expect(u1p.queryParamMap.get('foo')).toBe('bar baz');
            expect(u2p.queryParamMap.get('foo')).toBe('bar baz');
            expect(u3p.queryParamMap.get('foo')).toBe('bar baz');
        });
        it('should encode query params leaving sub-delimiters intact', function () {
            var percentChars = '/?#&+=[] ';
            var percentCharsEncoded = '%2F%3F%23%26%2B%3D%5B%5D%20';
            var intactChars = '!$\'()*,;:';
            var params = percentChars + intactChars;
            var paramsEncoded = percentCharsEncoded + intactChars;
            var mixedCaseString = 'sTrInG';
            expect(percentCharsEncoded).toEqual(url_tree_1.encodeUriQuery(percentChars));
            expect(intactChars).toEqual(url_tree_1.encodeUriQuery(intactChars));
            // Verify it replaces repeated characters correctly
            expect(paramsEncoded + paramsEncoded).toEqual(url_tree_1.encodeUriQuery(params + params));
            // Verify it doesn't change the case of alpha characters
            expect(mixedCaseString + paramsEncoded).toEqual(url_tree_1.encodeUriQuery(mixedCaseString + params));
        });
        it('should encode/decode fragment', function () {
            var u = "/one#" + url_tree_1.encodeUriFragment('one two=three four');
            var tree = url.parse(u);
            expect(tree.fragment).toEqual('one two=three four');
            expect(url.serialize(tree)).toEqual('/one#one%20two=three%20four');
        });
    });
    describe('special character encoding/decoding', function () {
        // Tests specific to https://github.com/angular/angular/issues/10280
        it('should parse encoded parens in matrix params', function () {
            var auxRoutesUrl = '/abc;foo=(other:val)';
            var fooValueUrl = '/abc;foo=%28other:val%29';
            var auxParsed = url.parse(auxRoutesUrl).root;
            var fooParsed = url.parse(fooValueUrl).root;
            // Test base case
            expect(auxParsed.children[shared_1.PRIMARY_OUTLET].segments.length).toBe(1);
            expect(auxParsed.children[shared_1.PRIMARY_OUTLET].segments[0].path).toBe('abc');
            expect(auxParsed.children[shared_1.PRIMARY_OUTLET].segments[0].parameters).toEqual({ foo: '' });
            expect(auxParsed.children['other'].segments.length).toBe(1);
            expect(auxParsed.children['other'].segments[0].path).toBe('val');
            // Confirm matrix params are URL decoded
            expect(fooParsed.children[shared_1.PRIMARY_OUTLET].segments.length).toBe(1);
            expect(fooParsed.children[shared_1.PRIMARY_OUTLET].segments[0].path).toBe('abc');
            expect(fooParsed.children[shared_1.PRIMARY_OUTLET].segments[0].parameters).toEqual({
                foo: '(other:val)'
            });
        });
        it('should serialize encoded parens in matrix params', function () {
            var testUrl = '/abc;foo=%28one%29';
            var parsed = url.parse(testUrl);
            expect(url.serialize(parsed)).toBe('/abc;foo=%28one%29');
        });
        it('should not serialize encoded parens in query params', function () {
            var testUrl = '/abc?foo=%28one%29';
            var parsed = url.parse(testUrl);
            expect(parsed.queryParams).toEqual({ foo: '(one)' });
            expect(url.serialize(parsed)).toBe('/abc?foo=(one)');
        });
        // Test special characters in general
        // From http://www.ietf.org/rfc/rfc3986.txt
        var unreserved = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";
        it('should encode a minimal set of special characters in queryParams', function () {
            var notEncoded = unreserved + ":@!$'*,();";
            var encode = " +%&=#[]/?";
            var encoded = "%20%2B%25%26%3D%23%5B%5D%2F%3F";
            var parsed = url.parse('/foo');
            parsed.queryParams = { notEncoded: notEncoded, encode: encode };
            expect(url.serialize(parsed)).toBe("/foo?notEncoded=" + notEncoded + "&encode=" + encoded);
        });
        it('should encode a minimal set of special characters in fragment', function () {
            var notEncoded = unreserved + ":@!$'*,();+&=#/?";
            var encode = ' %<>`"[]';
            var encoded = "%20%25%3C%3E%60%22%5B%5D";
            var parsed = url.parse('/foo');
            parsed.fragment = notEncoded + encode;
            expect(url.serialize(parsed)).toBe("/foo#" + notEncoded + encoded);
        });
        it('should encode minimal special characters plus parens and semi-colon in matrix params', function () {
            var notEncoded = unreserved + ":@!$'*,&";
            var encode = " /%=#()[];?+";
            var encoded = "%20%2F%25%3D%23%28%29%5B%5D%3B%3F%2B";
            var parsed = url.parse('/foo');
            parsed.root.children[shared_1.PRIMARY_OUTLET].segments[0].parameters = { notEncoded: notEncoded, encode: encode };
            expect(url.serialize(parsed)).toBe("/foo;notEncoded=" + notEncoded + ";encode=" + encoded);
        });
        it('should encode special characters in the path the same as matrix params', function () {
            var notEncoded = unreserved + ":@!$'*,&";
            var encode = " /%=#()[];?+";
            var encoded = "%20%2F%25%3D%23%28%29%5B%5D%3B%3F%2B";
            var parsed = url.parse('/foo');
            parsed.root.children[shared_1.PRIMARY_OUTLET].segments[0].path = notEncoded + encode;
            expect(url.serialize(parsed)).toBe("/" + notEncoded + encoded);
        });
        it('should correctly encode ampersand in segments', function () {
            var testUrl = '/parent&child';
            var parsed = url.parse(testUrl);
            expect(url.serialize(parsed)).toBe(testUrl);
        });
    });
    describe('error handling', function () {
        it('should throw when invalid characters inside children', function () {
            expect(function () { return url.parse('/one/(left#one)'); })
                .toThrowError('Cannot parse url \'/one/(left#one)\'');
        });
        it('should throw when missing closing )', function () {
            expect(function () { return url.parse('/one/(left'); }).toThrowError('Cannot parse url \'/one/(left\'');
        });
    });
});
function expectSegment(segment, expected, hasChildren) {
    if (hasChildren === void 0) { hasChildren = false; }
    if (segment.segments.filter(function (s) { return s.path === ''; }).length > 0) {
        throw new Error("UrlSegments cannot be empty " + segment.segments);
    }
    var p = segment.segments.map(function (p) { return url_tree_1.serializePath(p); }).join('/');
    expect(p).toEqual(expected);
    expect(Object.keys(segment.children).length > 0).toEqual(hasChildren);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX3NlcmlhbGl6ZXIuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3JvdXRlci90ZXN0L3VybF9zZXJpYWxpemVyLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCx3Q0FBNkM7QUFDN0MsNENBQTBJO0FBRTFJLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6QixJQUFNLEdBQUcsR0FBRyxJQUFJLCtCQUFvQixFQUFFLENBQUM7SUFFdkMsRUFBRSxDQUFDLDJCQUEyQixFQUFFO1FBQzlCLElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUIsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDN0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDM0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNkJBQTZCLEVBQUU7UUFDaEMsSUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNsQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsdUJBQWMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzdELE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2xELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDBDQUEwQyxFQUFFO1FBQzdDLElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztRQUUzRCxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMs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