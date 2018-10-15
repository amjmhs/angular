"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var bypass_1 = require("../../src/sanitization/bypass");
var sanitization_1 = require("../../src/sanitization/sanitization");
describe('sanitization', function () {
    var Wrap = /** @class */ (function () {
        function Wrap(value) {
            this.value = value;
        }
        Wrap.prototype.toString = function () { return this.value; };
        return Wrap;
    }());
    it('should sanitize html', function () {
        expect(sanitization_1.sanitizeHtml('<div></div>')).toEqual('<div></div>');
        expect(sanitization_1.sanitizeHtml(new Wrap('<div></div>'))).toEqual('<div></div>');
        expect(sanitization_1.sanitizeHtml('<img src="javascript:true">'))
            .toEqual('<img src="unsafe:javascript:true">');
        expect(sanitization_1.sanitizeHtml(new Wrap('<img src="javascript:true">')))
            .toEqual('<img src="unsafe:javascript:true">');
        expect(sanitization_1.sanitizeHtml(bypass_1.bypassSanitizationTrustUrl('<img src="javascript:true">')))
            .toEqual('<img src="unsafe:javascript:true">');
        expect(sanitization_1.sanitizeHtml(bypass_1.bypassSanitizationTrustHtml('<img src="javascript:true">')))
            .toEqual('<img src="javascript:true">');
    });
    it('should sanitize url', function () {
        expect(sanitization_1.sanitizeUrl('http://server')).toEqual('http://server');
        expect(sanitization_1.sanitizeUrl(new Wrap('http://server'))).toEqual('http://server');
        expect(sanitization_1.sanitizeUrl('javascript:true')).toEqual('unsafe:javascript:true');
        expect(sanitization_1.sanitizeUrl(new Wrap('javascript:true'))).toEqual('unsafe:javascript:true');
        expect(sanitization_1.sanitizeUrl(bypass_1.bypassSanitizationTrustHtml('javascript:true')))
            .toEqual('unsafe:javascript:true');
        expect(sanitization_1.sanitizeUrl(bypass_1.bypassSanitizationTrustUrl('javascript:true'))).toEqual('javascript:true');
    });
    it('should sanitize resourceUrl', function () {
        var ERROR = 'unsafe value used in a resource URL context (see http://g.co/ng/security#xss)';
        expect(function () { return sanitization_1.sanitizeResourceUrl('http://server'); }).toThrowError(ERROR);
        expect(function () { return sanitization_1.sanitizeResourceUrl('javascript:true'); }).toThrowError(ERROR);
        expect(function () { return sanitization_1.sanitizeResourceUrl(bypass_1.bypassSanitizationTrustHtml('javascript:true')); })
            .toThrowError(ERROR);
        expect(sanitization_1.sanitizeResourceUrl(bypass_1.bypassSanitizationTrustResourceUrl('javascript:true')))
            .toEqual('javascript:true');
    });
    it('should sanitize style', function () {
        expect(sanitization_1.sanitizeStyle('red')).toEqual('red');
        expect(sanitization_1.sanitizeStyle(new Wrap('red'))).toEqual('red');
        expect(sanitization_1.sanitizeStyle('url("http://server")')).toEqual('unsafe');
        expect(sanitization_1.sanitizeStyle(new Wrap('url("http://server")'))).toEqual('unsafe');
        expect(sanitization_1.sanitizeStyle(bypass_1.bypassSanitizationTrustHtml('url("http://server")'))).toEqual('unsafe');
        expect(sanitization_1.sanitizeStyle(bypass_1.bypassSanitizationTrustStyle('url("http://server")')))
            .toEqual('url("http://server")');
    });
    it('should sanitize script', function () {
        var ERROR = 'unsafe value used in a script context';
        expect(function () { return sanitization_1.sanitizeScript('true'); }).toThrowError(ERROR);
        expect(function () { return sanitization_1.sanitizeScript('true'); }).toThrowError(ERROR);
        expect(function () { return sanitization_1.sanitizeScript(bypass_1.bypassSanitizationTrustHtml('true')); }).toThrowError(ERROR);
        expect(sanitization_1.sanitizeScript(bypass_1.bypassSanitizationTrustScript('true'))).toEqual('true');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FuYXRpemF0aW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3Qvc2FuaXRpemF0aW9uL3NhbmF0aXphdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQTs7Ozs7O0dBTUc7O0FBRUgsd0RBQXVNO0FBQ3ZNLG9FQUFrSTtBQUVsSSxRQUFRLENBQUMsY0FBYyxFQUFFO0lBQ3ZCO1FBQ0UsY0FBb0IsS0FBYTtZQUFiLFVBQUssR0FBTCxLQUFLLENBQVE7UUFBRyxDQUFDO1FBQ3JDLHVCQUFRLEdBQVIsY0FBYSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ25DLFdBQUM7SUFBRCxDQUFDLEFBSEQsSUFHQztJQUNELEVBQUUsQ0FBQyxzQkFBc0IsRUFBRTtRQUN6QixNQUFNLENBQUMsMkJBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMzRCxNQUFNLENBQUMsMkJBQVksQ0FBQyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sQ0FBQywyQkFBWSxDQUFDLDZCQUE2QixDQUFDLENBQUM7YUFDOUMsT0FBTyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDbkQsTUFBTSxDQUFDLDJCQUFZLENBQUMsSUFBSSxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDO2FBQ3hELE9BQU8sQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sQ0FBQywyQkFBWSxDQUFDLG1DQUEwQixDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQzthQUMxRSxPQUFPLENBQUMsb0NBQW9DLENBQUMsQ0FBQztRQUNuRCxNQUFNLENBQUMsMkJBQVksQ0FBQyxvQ0FBMkIsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUM7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