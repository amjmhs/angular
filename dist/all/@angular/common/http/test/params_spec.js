"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var params_1 = require("../src/params");
{
    describe('HttpUrlEncodedParams', function () {
        describe('initialization', function () {
            it('should be empty at construction', function () {
                var body = new params_1.HttpParams();
                expect(body.toString()).toEqual('');
            });
            it('should parse an existing url', function () {
                var body = new params_1.HttpParams({ fromString: 'a=b&c=d&c=e' });
                expect(body.getAll('a')).toEqual(['b']);
                expect(body.getAll('c')).toEqual(['d', 'e']);
            });
        });
        describe('lazy mutation', function () {
            it('should allow setting parameters', function () {
                var body = new params_1.HttpParams({ fromString: 'a=b' });
                var mutated = body.set('a', 'c');
                expect(mutated.toString()).toEqual('a=c');
            });
            it('should allow appending parameters', function () {
                var body = new params_1.HttpParams({ fromString: 'a=b' });
                var mutated = body.append('a', 'c');
                expect(mutated.toString()).toEqual('a=b&a=c');
            });
            it('should allow deletion of parameters', function () {
                var body = new params_1.HttpParams({ fromString: 'a=b&c=d&e=f' });
                var mutated = body.delete('c');
                expect(mutated.toString()).toEqual('a=b&e=f');
            });
            it('should allow chaining of mutations', function () {
                var body = new params_1.HttpParams({ fromString: 'a=b&c=d&e=f' });
                var mutated = body.append('e', 'y').delete('c').set('a', 'x').append('e', 'z');
                expect(mutated.toString()).toEqual('a=x&e=f&e=y&e=z');
            });
            it('should allow deletion of one value of a parameter', function () {
                var body = new params_1.HttpParams({ fromString: 'a=1&a=2&a=3&a=4&a=5' });
                var mutated = body.delete('a', '2').delete('a', '4');
                expect(mutated.getAll('a')).toEqual(['1', '3', '5']);
            });
        });
        describe('read operations', function () {
            it('should give null if parameter is not set', function () {
                var body = new params_1.HttpParams({ fromString: 'a=b&c=d' });
                expect(body.get('e')).toBeNull();
                expect(body.getAll('e')).toBeNull();
            });
            it('should give an accurate list of keys', function () {
                var body = new params_1.HttpParams({ fromString: 'a=1&b=2&c=3&d=4' });
                expect(body.keys()).toEqual(['a', 'b', 'c', 'd']);
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYW1zX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vaHR0cC90ZXN0L3BhcmFtc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsd0NBQXlDO0FBRXpDO0lBQ0UsUUFBUSxDQUFDLHNCQUFzQixFQUFFO1FBQy9CLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtZQUN6QixFQUFFLENBQUMsaUNBQWlDLEVBQUU7Z0JBQ3BDLElBQU0sSUFBSSxHQUFHLElBQUksbUJBQVUsRUFBRSxDQUFDO2dCQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RDLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDhCQUE4QixFQUFFO2dCQUNqQyxJQUFNLElBQUksR0FBRyxJQUFJLG1CQUFVLENBQUMsRUFBQyxVQUFVLEVBQUUsYUFBYSxFQUFDLENBQUMsQ0FBQztnQkFDekQsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQy9DLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsZUFBZSxFQUFFO1lBQ3hCLEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRTtnQkFDcEMsSUFBTSxJQUFJLEdBQUcsSUFBSSxtQkFBVSxDQUFDLEVBQUMsVUFBVSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7Z0JBQ2pELElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFH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