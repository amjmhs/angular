"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var headers_1 = require("../src/headers");
{
    describe('HttpHeaders', function () {
        describe('initialization', function () {
            it('should conform to spec', function () {
                var httpHeaders = {
                    'Content-Type': 'image/jpeg',
                    'Accept-Charset': 'utf-8',
                    'X-My-Custom-Header': 'Zeke are cool',
                };
                var secondHeaders = new headers_1.HttpHeaders(httpHeaders);
                expect(secondHeaders.get('Content-Type')).toEqual('image/jpeg');
            });
            it('should merge values in provided dictionary', function () {
                var headers = new headers_1.HttpHeaders({ 'foo': 'bar' });
                expect(headers.get('foo')).toEqual('bar');
                expect(headers.getAll('foo')).toEqual(['bar']);
            });
            it('should lazily append values', function () {
                var src = new headers_1.HttpHeaders();
                var a = src.append('foo', 'a');
                var b = a.append('foo', 'b');
                var c = b.append('foo', 'c');
                expect(src.getAll('foo')).toBeNull();
                expect(a.getAll('foo')).toEqual(['a']);
                expect(b.getAll('foo')).toEqual(['a', 'b']);
                expect(c.getAll('foo')).toEqual(['a', 'b', 'c']);
            });
            it('should keep the last value when initialized from an object', function () {
                var headers = new headers_1.HttpHeaders({
                    'foo': 'first',
                    'fOo': 'second',
                });
                expect(headers.getAll('foo')).toEqual(['second']);
            });
        });
        describe('.set()', function () {
            it('should clear all values and re-set for the provided key', function () {
                var headers = new headers_1.HttpHeaders({ 'foo': 'bar' });
                expect(headers.get('foo')).toEqual('bar');
                var second = headers.set('foo', 'baz');
                expect(second.get('foo')).toEqual('baz');
                var third = headers.set('fOO', 'bat');
                expect(third.get('foo')).toEqual('bat');
            });
            it('should preserve the case of the first call', function () {
                var headers = new headers_1.HttpHeaders();
                var second = headers.set('fOo', 'baz');
                var third = second.set('foo', 'bat');
                expect(third.keys()).toEqual(['fOo']);
            });
        });
        describe('.get()', function () {
            it('should be case insensitive', function () {
                var headers = new headers_1.HttpHeaders({ 'foo': 'baz' });
                expect(headers.get('foo')).toEqual('baz');
                expect(headers.get('FOO')).toEqual('baz');
            });
            it('should return null if the header is not present', function () {
                var headers = new headers_1.HttpHeaders({ bar: [] });
                expect(headers.get('bar')).toEqual(null);
                expect(headers.get('foo')).toEqual(null);
            });
        });
        describe('.getAll()', function () {
            it('should be case insensitive', function () {
                var headers = new headers_1.HttpHeaders({ foo: ['bar', 'baz'] });
                expect(headers.getAll('foo')).toEqual(['bar', 'baz']);
                expect(headers.getAll('FOO')).toEqual(['bar', 'baz']);
            });
            it('should return null if the header is not present', function () {
                var headers = new headers_1.HttpHeaders();
                expect(headers.getAll('foo')).toEqual(null);
            });
        });
        describe('.delete', function () {
            it('should be case insensitive', function () {
                var headers = new headers_1.HttpHeaders({ 'foo': 'baz' });
                expect(headers.has('foo')).toEqual(true);
                var second = headers.delete('foo');
                expect(second.has('foo')).toEqual(false);
                var third = second.set('foo', 'baz');
                expect(third.has('foo')).toEqual(true);
                var fourth = third.delete('FOO');
                expect(fourth.has('foo')).toEqual(false);
            });
        });
        describe('.append', function () {
            it('should append a value to the list', function () {
                var headers = new headers_1.HttpHeaders();
                var second = headers.append('foo', 'bar');
                var third = second.append('foo', 'baz');
                expect(third.get('foo')).toEqual('bar');
                expect(third.getAll('foo')).toEqual(['bar', 'baz']);
            });
            it('should preserve the case of the first call', function () {
                var headers = new headers_1.HttpHeaders();
                var second = headers.append('FOO', 'bar');
                var third = second.append('foo', 'baz');
                expect(third.keys()).toEqual(['FOO']);
            });
        });
        describe('response header strings', function () {
            it('should be parsed by the constructor', function () {
                var response = "Date: Fri, 20 Nov 2015 01:45:26 GMT\n" +
                    "Content-Type: application/json; charset=utf-8\n" +
                    "Transfer-Encoding: chunked\n" +
                    "Connection: keep-alive";
                var headers = new headers_1.HttpHeaders(response);
                expect(headers.get('Date')).toEqual('Fri, 20 Nov 2015 01:45:26 GMT');
                expect(headers.get('Content-Type')).toEqual('application/json; charset=utf-8');
                expect(headers.get('Transfer-Encoding')).toEqual('chunked');
                expect(headers.get('Connection')).toEqual('keep-alive');
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyc19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL2h0dHAvdGVzdC9oZWFkZXJzX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwwQ0FBMkM7QUFFM0M7SUFDRSxRQUFRLENBQUMsYUFBYSxFQUFFO1FBRXRCLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtZQUN6QixFQUFFLENBQUMsd0JBQXdCLEVBQUU7Z0JBQzNCLElBQU0sV0FBVyxHQUFHO29CQUNsQixjQUFjLEVBQUUsWUFBWTtvQkFDNUIsZ0JBQWdCLEVBQUUsT0FBTztvQkFDekIsb0JBQW9CLEVBQUUsZUFBZTtpQkFDdEMsQ0FBQztnQkFDRixJQUFNLGFBQWEsR0FBRyxJQUFJLHFCQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ25ELE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2xFLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO2dCQUMvQyxJQUFNLE9BQU8sR0FBRyxJQUFJLHFCQUFXLENBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztnQkFDaEQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNqRCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyw2QkFBNkIsRUFBRTtnQkFDaEMsSUFBTSxHQUFHLEdBQUcsSUFBSSxxQkFBVyxFQUFFLENBQUM7Z0JBQzlCLElB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