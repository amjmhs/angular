"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var url_search_params_1 = require("@angular/http/src/url_search_params");
{
    testing_internal_1.describe('URLSearchParams', function () {
        testing_internal_1.it('should conform to spec', function () {
            var paramsString = 'q=URLUtils.searchParams&topic=api';
            var searchParams = new url_search_params_1.URLSearchParams(paramsString);
            // Tests borrowed from example at
            // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
            // Compliant with spec described at https://url.spec.whatwg.org/#urlsearchparams
            testing_internal_1.expect(searchParams.has('topic')).toBe(true);
            testing_internal_1.expect(searchParams.has('foo')).toBe(false);
            testing_internal_1.expect(searchParams.get('topic')).toEqual('api');
            testing_internal_1.expect(searchParams.getAll('topic')).toEqual(['api']);
            testing_internal_1.expect(searchParams.get('foo')).toBe(null);
            searchParams.append('topic', 'webdev');
            testing_internal_1.expect(searchParams.getAll('topic')).toEqual(['api', 'webdev']);
            testing_internal_1.expect(searchParams.toString()).toEqual('q=URLUtils.searchParams&topic=api&topic=webdev');
            searchParams.delete('topic');
            testing_internal_1.expect(searchParams.toString()).toEqual('q=URLUtils.searchParams');
            // Test default constructor
            testing_internal_1.expect(new url_search_params_1.URLSearchParams().toString()).toBe('');
        });
        testing_internal_1.it('should optionally accept a custom parser', function () {
            var fooEveryThingParser = {
                encodeKey: function () { return 'I AM KEY'; },
                encodeValue: function () { return 'I AM VALUE'; }
            };
            var params = new url_search_params_1.URLSearchParams('', fooEveryThingParser);
            params.set('myKey', 'myValue');
            testing_internal_1.expect(params.toString()).toBe('I AM KEY=I AM VALUE');
        });
        testing_internal_1.it('should encode special characters in params', function () {
            var searchParams = new url_search_params_1.URLSearchParams();
            searchParams.append('a', '1+1');
            searchParams.append('b c', '2');
            searchParams.append('d%', '3$');
            testing_internal_1.expect(searchParams.toString()).toEqual('a=1+1&b%20c=2&d%25=3$');
        });
        testing_internal_1.it('should not encode allowed characters', function () {
            /*
             * https://tools.ietf.org/html/rfc3986#section-3.4
             * Allowed: ( pchar / "/" / "?" )
             * pchar: unreserved / pct-encoded / sub-delims / ":" / "@"
             * unreserved: ALPHA / DIGIT / "-" / "." / "_" / "~"
             * pct-encoded: "%" HEXDIG HEXDIG
             * sub-delims: "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
             *
             * & and = are excluded and should be encoded inside keys and values
             * because URLSearchParams is responsible for inserting this.
             **/
            var params = new url_search_params_1.URLSearchParams();
            '! $ \' ( ) * + , ; A 9 - . _ ~ ? / ='.split(' ').forEach(function (char, idx) { params.set("a" + idx, char); });
            testing_internal_1.expect(params.toString())
                .toBe("a0=!&a1=$&a2='&a3=(&a4=)&a5=*&a6=+&a7=,&a8=;&a9=A&a10=9&a11=-&a12=.&a13=_&a14=~&a15=?&a16=/&a17=="
                .replace(/\s/g, ''));
            // Original example from https://github.com/angular/angular/issues/9348 for posterity
            params = new url_search_params_1.URLSearchParams();
            params.set('q', 'repo:janbaer/howcani+type:issue');
            params.set('sort', 'created');
            params.set('order', 'desc');
            params.set('page', '1');
            testing_internal_1.expect(params.toString())
                .toBe('q=repo:janbaer/howcani+type:issue&sort=created&order=desc&page=1');
        });
        testing_internal_1.it('should support map-like merging operation via setAll()', function () {
            var mapA = new url_search_params_1.URLSearchParams('a=1&a=2&a=3&c=8');
            var mapB = new url_search_params_1.URLSearchParams('a=4&a=5&a=6&b=7');
            mapA.setAll(mapB);
            testing_internal_1.expect(mapA.has('a')).toBe(true);
            testing_internal_1.expect(mapA.has('b')).toBe(true);
            testing_internal_1.expect(mapA.has('c')).toBe(true);
            testing_internal_1.expect(mapA.getAll('a')).toEqual(['4']);
            testing_internal_1.expect(mapA.getAll('b')).toEqual(['7']);
            testing_internal_1.expect(mapA.getAll('c')).toEqual(['8']);
            testing_internal_1.expect(mapA.toString()).toEqual('a=4&c=8&b=7');
        });
        testing_internal_1.it('should support multimap-like merging operation via appendAll()', function () {
            var mapA = new url_search_params_1.URLSearchParams('a=1&a=2&a=3&c=8');
            var mapB = new url_search_params_1.URLSearchParams('a=4&a=5&a=6&b=7');
            mapA.appendAll(mapB);
            testing_internal_1.expect(mapA.has('a')).toBe(true);
            testing_internal_1.expect(mapA.has('b')).toBe(true);
            testing_internal_1.expect(mapA.has('c')).toBe(true);
            testing_internal_1.expect(mapA.getAll('a')).toEqual(['1', '2', '3', '4', '5', '6']);
            testing_internal_1.expect(mapA.getAll('b')).toEqual(['7']);
            testing_internal_1.expect(mapA.getAll('c')).toEqual(['8']);
            testing_internal_1.expect(mapA.toString()).toEqual('a=1&a=2&a=3&a=4&a=5&a=6&c=8&b=7');
        });
        testing_internal_1.it('should support multimap-like merging operation via replaceAll()', function () {
            var mapA = new url_search_params_1.URLSearchParams('a=1&a=2&a=3&c=8');
            var mapB = new url_search_params_1.URLSearchParams('a=4&a=5&a=6&b=7');
            mapA.replaceAll(mapB);
            testing_internal_1.expect(mapA.has('a')).toBe(true);
            testing_internal_1.expect(mapA.has('b')).toBe(true);
            testing_internal_1.expect(mapA.has('c')).toBe(true);
            testing_internal_1.expect(mapA.getAll('a')).toEqual(['4', '5', '6']);
            testing_internal_1.expect(mapA.getAll('b')).toEqual(['7']);
            testing_internal_1.expect(mapA.getAll('c')).toEqual(['8']);
            testing_internal_1.expect(mapA.toString()).toEqual('a=4&a=5&a=6&c=8&b=7');
        });
        testing_internal_1.it('should support a clone operation via clone()', function () {
            var fooQueryEncoder = {
                encodeKey: function (k) { return encodeURIComponent(k); },
                encodeValue: function (v) { return encodeURIComponent(v); }
            };
            var paramsA = new url_search_params_1.URLSearchParams('', fooQueryEncoder);
            paramsA.set('a', '2');
            paramsA.set('q', '4+');
            paramsA.set('c', '8');
            var paramsB = new url_search_params_1.URLSearchParams();
            paramsB.set('a', '2');
            paramsB.set('q', '4+');
            paramsB.set('c', '8');
            testing_internal_1.expect(paramsB.toString()).toEqual('a=2&q=4+&c=8');
            var paramsC = paramsA.clone();
            testing_internal_1.expect(paramsC.has('a')).toBe(true);
            testing_internal_1.expect(paramsC.has('b')).toBe(false);
            testing_internal_1.expect(paramsC.has('c')).toBe(true);
            testing_internal_1.expect(paramsC.toString()).toEqual('a=2&q=4%2B&c=8');
        });
        testing_internal_1.it('should remove the parameter when set to undefined or null', function () {
            var params = new url_search_params_1.URLSearchParams('q=Q');
            params.set('q', undefined);
            testing_internal_1.expect(params.has('q')).toBe(false);
            testing_internal_1.expect(params.toString()).toEqual('');
            params.set('q', null);
            testing_internal_1.expect(params.has('q')).toBe(false);
            testing_internal_1.expect(params.toString()).toEqual('');
        });
        testing_internal_1.it('should ignore the value when append undefined or null', function () {
            var params = new url_search_params_1.URLSearchParams('q=Q');
            params.append('q', undefined);
            testing_internal_1.expect(params.toString()).toEqual('q=Q');
            params.append('q', null);
            testing_internal_1.expect(params.toString()).toEqual('q=Q');
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX3NlYXJjaF9wYXJhbXNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2h0dHAvdGVzdC91cmxfc2VhcmNoX3BhcmFtc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0VBQWdGO0FBQ2hGLHlFQUFvRTtBQUVwRTtJQUNFLDJCQUFRLENBQUMsaUJBQWlCLEVBQUU7UUFDMUIscUJBQUUsQ0FBQyx3QkFBd0IsRUFBRTtZQUMzQixJQUFNLFlBQVksR0FBRyxtQ0FBbUMsQ0FBQztZQUN6RCxJQUFNLFlBQVksR0FBRyxJQUFJLG1DQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFdkQsaUNBQWlDO1lBQ2pDLG1FQUFtRTtZQUNuRSxnRkFBZ0Y7WUFDaEYseUJBQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdDLHlCQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1Qyx5QkFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakQseUJBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN0RCx5QkFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0MsWUFBWSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDdkMseUJBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLE9B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