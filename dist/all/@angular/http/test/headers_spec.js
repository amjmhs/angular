"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var headers_1 = require("@angular/http/src/headers");
{
    describe('Headers', function () {
        describe('initialization', function () {
            it('should conform to spec', function () {
                var httpHeaders = {
                    'Content-Type': 'image/jpeg',
                    'Accept-Charset': 'utf-8',
                    'X-My-Custom-Header': 'Zeke are cool',
                };
                var secondHeaders = new headers_1.Headers(httpHeaders);
                var secondHeadersObj = new headers_1.Headers(secondHeaders);
                expect(secondHeadersObj.get('Content-Type')).toEqual('image/jpeg');
            });
            it('should merge values in provided dictionary', function () {
                var headers = new headers_1.Headers({ 'foo': 'bar' });
                expect(headers.get('foo')).toEqual('bar');
                expect(headers.getAll('foo')).toEqual(['bar']);
            });
            it('should not alter the values of a provided header template', function () {
                // Spec at https://fetch.spec.whatwg.org/#concept-headers-fill
                // test for https://github.com/angular/angular/issues/6845
                var firstHeaders = new headers_1.Headers();
                var secondHeaders = new headers_1.Headers(firstHeaders);
                secondHeaders.append('Content-Type', 'image/jpeg');
                expect(firstHeaders.has('Content-Type')).toEqual(false);
            });
            it('should preserve the list of values', function () {
                var src = new headers_1.Headers();
                src.append('foo', 'a');
                src.append('foo', 'b');
                src.append('foo', 'c');
                var dst = new headers_1.Headers(src);
                expect(dst.getAll('foo')).toEqual(src.getAll('foo'));
            });
            it('should keep the last value when initialized from an object', function () {
                var headers = new headers_1.Headers({
                    'foo': 'first',
                    'fOo': 'second',
                });
                expect(headers.getAll('foo')).toEqual(['second']);
            });
        });
        describe('.set()', function () {
            it('should clear all values and re-set for the provided key', function () {
                var headers = new headers_1.Headers({ 'foo': 'bar' });
                expect(headers.get('foo')).toEqual('bar');
                headers.set('foo', 'baz');
                expect(headers.get('foo')).toEqual('baz');
                headers.set('fOO', 'bat');
                expect(headers.get('foo')).toEqual('bat');
            });
            it('should preserve the case of the first call', function () {
                var headers = new headers_1.Headers();
                headers.set('fOo', 'baz');
                headers.set('foo', 'bat');
                expect(JSON.stringify(headers)).toEqual('{"fOo":["bat"]}');
            });
            it('should preserve cases after cloning', function () {
                var headers = new headers_1.Headers();
                headers.set('fOo', 'baz');
                headers.set('foo', 'bat');
                expect(JSON.stringify(new headers_1.Headers(headers))).toEqual('{"fOo":["bat"]}');
            });
            it('should convert input array to string', function () {
                var headers = new headers_1.Headers();
                headers.set('foo', ['bar', 'baz']);
                expect(headers.get('foo')).toEqual('bar,baz');
                expect(headers.getAll('foo')).toEqual(['bar,baz']);
            });
        });
        describe('.get()', function () {
            it('should be case insensitive', function () {
                var headers = new headers_1.Headers();
                headers.set('foo', 'baz');
                expect(headers.get('foo')).toEqual('baz');
                expect(headers.get('FOO')).toEqual('baz');
            });
            it('should return null if the header is not present', function () {
                var headers = new headers_1.Headers({ bar: [] });
                expect(headers.get('bar')).toEqual(null);
                expect(headers.get('foo')).toEqual(null);
            });
        });
        describe('.getAll()', function () {
            it('should be case insensitive', function () {
                var headers = new headers_1.Headers({ foo: ['bar', 'baz'] });
                expect(headers.getAll('foo')).toEqual(['bar', 'baz']);
                expect(headers.getAll('FOO')).toEqual(['bar', 'baz']);
            });
            it('should return null if the header is not present', function () {
                var headers = new headers_1.Headers();
                expect(headers.getAll('foo')).toEqual(null);
            });
        });
        describe('.delete', function () {
            it('should be case insensitive', function () {
                var headers = new headers_1.Headers();
                headers.set('foo', 'baz');
                expect(headers.has('foo')).toEqual(true);
                headers.delete('foo');
                expect(headers.has('foo')).toEqual(false);
                headers.set('foo', 'baz');
                expect(headers.has('foo')).toEqual(true);
                headers.delete('FOO');
                expect(headers.has('foo')).toEqual(false);
            });
        });
        describe('.append', function () {
            it('should append a value to the list', function () {
                var headers = new headers_1.Headers();
                headers.append('foo', 'bar');
                headers.append('foo', 'baz');
                expect(headers.get('foo')).toEqual('bar');
                expect(headers.getAll('foo')).toEqual(['bar', 'baz']);
            });
            it('should preserve the case of the first call', function () {
                var headers = new headers_1.Headers();
                headers.append('FOO', 'bar');
                headers.append('foo', 'baz');
                expect(JSON.stringify(headers)).toEqual('{"FOO":["bar","baz"]}');
            });
        });
        describe('.toJSON()', function () {
            var headers;
            var values;
            var ref;
            beforeEach(function () {
                values = ['application/jeisen', 'application/jason', 'application/patrickjs'];
                headers = new headers_1.Headers();
                headers.set('Accept', values);
                ref = { 'Accept': values };
            });
            it('should be serializable with toJSON', function () { expect(JSON.stringify(headers)).toEqual(JSON.stringify(ref)); });
            it('should be able to recreate serializedHeaders', function () {
                var parsedHeaders = JSON.parse(JSON.stringify(headers));
                var recreatedHeaders = new headers_1.Headers(parsedHeaders);
                expect(JSON.stringify(parsedHeaders)).toEqual(JSON.stringify(recreatedHeaders));
            });
        });
        describe('.fromResponseHeaderString()', function () {
            it('should parse a response header string', function () {
                var response = "Date: Fri, 20 Nov 2015 01:45:26 GMT\n" +
                    "Content-Type: application/json; charset=utf-8\n" +
                    "Transfer-Encoding: chunked\n" +
                    "Connection: keep-alive";
                var headers = headers_1.Headers.fromResponseHeaderString(response);
                expect(headers.get('Date')).toEqual('Fri, 20 Nov 2015 01:45:26 GMT');
                expect(headers.get('Content-Type')).toEqual('application/json; charset=utf-8');
                expect(headers.get('Transfer-Encoding')).toEqual('chunked');
                expect(headers.get('Connection')).toEqual('keep-alive');
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyc19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvaHR0cC90ZXN0L2hlYWRlcnNfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHFEQUFrRDtBQUVsRDtJQUNFLFFBQVEsQ0FBQyxTQUFTLEVBQUU7UUFFbEIsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1lBQ3pCLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRTtnQkFDM0IsSUFBTSxXQUFXLEdBQUc7b0JBQ2xCLGNBQWMsRUFBRSxZQUFZO29CQUM1QixnQkFBZ0IsRUFBRSxPQUFPO29CQUN6QixvQkFBb0IsRUFBRSxlQUFlO2lCQUN0QyxDQUFDO2dCQUNGLElBQU0sYUFBYSxHQUFHLElBQUksaUJBQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDL0MsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLGlCQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3BELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDckUsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsNENBQTRDLEVBQUU7Z0JBQy9DLElBQU0sT0FBTyxHQUFHLElBQUksaUJBQU8sQ0FBQyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO2dCQUM1QyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDMUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2pELENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDJEQUEyRCxFQUFFO2dCQUM5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