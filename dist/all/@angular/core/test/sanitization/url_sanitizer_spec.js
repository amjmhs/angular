"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var t = require("@angular/core/testing/src/testing_internal");
var url_sanitizer_1 = require("../../src/sanitization/url_sanitizer");
{
    t.describe('URL sanitizer', function () {
        var logMsgs;
        var originalLog;
        t.beforeEach(function () {
            logMsgs = [];
            originalLog = console.warn; // Monkey patch DOM.log.
            console.warn = function (msg) { return logMsgs.push(msg); };
        });
        afterEach(function () { console.warn = originalLog; });
        t.it('reports unsafe URLs', function () {
            t.expect(url_sanitizer_1._sanitizeUrl('javascript:evil()')).toBe('unsafe:javascript:evil()');
            t.expect(logMsgs.join('\n')).toMatch(/sanitizing unsafe URL value/);
        });
        t.describe('valid URLs', function () {
            var validUrls = [
                '',
                'http://abc',
                'HTTP://abc',
                'https://abc',
                'HTTPS://abc',
                'ftp://abc',
                'FTP://abc',
                'mailto:me@example.com',
                'MAILTO:me@example.com',
                'tel:123-123-1234',
                'TEL:123-123-1234',
                '#anchor',
                '/page1.md',
                'http://JavaScript/my.js',
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/',
                'data:video/webm;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/',
                'data:audio/opus;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/',
            ];
            var _loop_1 = function (url) {
                t.it("valid " + url, function () { return t.expect(url_sanitizer_1._sanitizeUrl(url)).toEqual(url); });
            };
            for (var _i = 0, validUrls_1 = validUrls; _i < validUrls_1.length; _i++) {
                var url = validUrls_1[_i];
                _loop_1(url);
            }
        });
        t.describe('invalid URLs', function () {
            var invalidUrls = [
                'javascript:evil()',
                'JavaScript:abc',
                'evilNewProtocol:abc',
                ' \n Java\n Script:abc',
                '&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;',
                '&#106&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;',
                '&#106 &#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;',
                '&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058',
                '&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A;',
                'jav&#x09;ascript:alert();',
                'jav\u0000ascript:alert();',
                'data:;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/',
                'data:,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/',
                'data:iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/',
                'data:text/javascript;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/',
                'data:application/x-msdownload;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/',
            ];
            var _loop_2 = function (url) {
                t.it("valid " + url, function () { return t.expect(url_sanitizer_1._sanitizeUrl(url)).toMatch(/^unsafe:/); });
            };
            for (var _i = 0, invalidUrls_1 = invalidUrls; _i < invalidUrls_1.length; _i++) {
                var url = invalidUrls_1[_i];
                _loop_2(url);
            }
        });
        t.describe('valid srcsets', function () {
            var validSrcsets = [
                '',
                'http://angular.io/images/test.png',
                'http://angular.io/images/test.png, http://angular.io/images/test.png',
                'http://angular.io/images/test.png, http://angular.io/images/test.png, http://angular.io/images/test.png',
                'http://angular.io/images/test.png 2x',
                'http://angular.io/images/test.png 2x, http://angular.io/images/test.png 3x',
                'http://angular.io/images/test.png 1.5x',
                'http://angular.io/images/test.png 1.25x',
                'http://angular.io/images/test.png 200w, http://angular.io/images/test.png 300w',
                'https://angular.io/images/test.png, http://angular.io/images/test.png',
                'http://angular.io:80/images/test.png, http://angular.io:8080/images/test.png',
                'http://www.angular.io:80/images/test.png, http://www.angular.io:8080/images/test.png',
                'https://angular.io/images/test.png, https://angular.io/images/test.png',
                '//angular.io/images/test.png, //angular.io/images/test.png',
                '/images/test.png, /images/test.png',
                'images/test.png, images/test.png',
                'http://angular.io/images/test.png?12345, http://angular.io/images/test.png?12345',
                'http://angular.io/images/test.png?maxage, http://angular.io/images/test.png?maxage',
                'http://angular.io/images/test.png?maxage=234, http://angular.io/images/test.png?maxage=234',
            ];
            var _loop_3 = function (srcset) {
                t.it("valid " + srcset, function () { return t.expect(url_sanitizer_1.sanitizeSrcset(srcset)).toEqual(srcset); });
            };
            for (var _i = 0, validSrcsets_1 = validSrcsets; _i < validSrcsets_1.length; _i++) {
                var srcset = validSrcsets_1[_i];
                _loop_3(srcset);
            }
        });
        t.describe('invalid srcsets', function () {
            var invalidSrcsets = [
                'ht:tp://angular.io/images/test.png',
                'http://angular.io/images/test.png, ht:tp://angular.io/images/test.png',
            ];
            var _loop_4 = function (srcset) {
                t.it("valid " + srcset, function () { return t.expect(url_sanitizer_1.sanitizeSrcset(srcset)).toMatch(/unsafe:/); });
            };
            for (var _i = 0, invalidSrcsets_1 = invalidSrcsets; _i < invalidSrcsets_1.length; _i++) {
                var srcset = invalidSrcsets_1[_i];
                _loop_4(srcset);
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX3Nhbml0aXplcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3Nhbml0aXphdGlvbi91cmxfc2FuaXRpemVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4REFBZ0U7QUFFaEUsc0VBQWtGO0FBRWxGO0lBQ0UsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLEVBQUU7UUFDMUIsSUFBSSxPQUFpQixDQUFDO1FBQ3RCLElBQUksV0FBOEIsQ0FBQztRQUVuQyxDQUFDLENBQUMsVUFBVSxDQUFDO1lBQ1gsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNiLFdBQVcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUUsd0JBQXdCO1lBQ3JELE9BQU8sQ0FBQyxJQUFJLEdBQUcsVUFBQyxHQUFRLElBQUssT0FBQSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFqQixDQUFpQixDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO1FBRUgsU0FBUyxDQUFDLGNBQVEsT0FBTyxDQUFDLElBQUksR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVqRCxDQUFDLENBQUMsRUFBRSxDQUFDLHFCQUFxQixFQUFFO1lBQzFCLENBQUMsQ0FBQyxNQUFNLENBQUMsNEJBQVksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDN0UsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDdEUsQ0FBQyxDQUFDLENBQUM7UUFFSCxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRTtZQUN2QixJQUFNLFNBQVMsR0FBRztnQkFDaEIsRUFBRTtnQkFDRixZQUFZO2dCQUNa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