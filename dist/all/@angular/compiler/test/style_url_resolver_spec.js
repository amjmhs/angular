"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var style_url_resolver_1 = require("@angular/compiler/src/style_url_resolver");
var url_resolver_1 = require("@angular/compiler/src/url_resolver");
{
    describe('extractStyleUrls', function () {
        var urlResolver;
        beforeEach(function () { urlResolver = new url_resolver_1.UrlResolver(); });
        it('should not resolve "url()" urls', function () {
            var css = "\n      .foo {\n        background-image: url(\"double.jpg\");\n        background-image: url('simple.jpg');\n        background-image: url(noquote.jpg);\n      }";
            var resolvedCss = style_url_resolver_1.extractStyleUrls(urlResolver, 'http://ng.io', css).style;
            expect(resolvedCss).toEqual(css);
        });
        it('should extract "@import" urls', function () {
            var css = "\n      @import '1.css';\n      @import \"2.css\";\n      ";
            var styleWithImports = style_url_resolver_1.extractStyleUrls(urlResolver, 'http://ng.io', css);
            expect(styleWithImports.style.trim()).toEqual('');
            expect(styleWithImports.styleUrls).toEqual(['http://ng.io/1.css', 'http://ng.io/2.css']);
        });
        it('should ignore "@import" in comments', function () {
            var css = "\n      @import '1.css';\n      /*@import '2.css';*/\n      /*\n      @import '3.css';\n      */\n      ";
            var styleWithImports = style_url_resolver_1.extractStyleUrls(urlResolver, 'http://ng.io', css);
            expect(styleWithImports.style.trim()).toEqual('');
            expect(styleWithImports.styleUrls).toContain('http://ng.io/1.css');
            expect(styleWithImports.styleUrls).not.toContain('http://ng.io/2.css');
            expect(styleWithImports.styleUrls).not.toContain('http://ng.io/3.css');
        });
        it('should keep /*# sourceURL... */ and /*# sourceMappingURL... */ comments', function () {
            var css = "/*regular comment*/\n/*# sourceURL=.... */\n/*# sourceMappingURL=... *//*#sourceMappingURL=... */";
            var styleWithSourceMaps = style_url_resolver_1.extractStyleUrls(urlResolver, 'http://ng.io', css);
            expect(styleWithSourceMaps.style.trim())
                .toEqual('/*# sourceURL=.... */\n/*# sourceMappingURL=... *//*#sourceMappingURL=... */');
        });
        it('should extract "@import url()" urls', function () {
            var css = "\n      @import url('3.css');\n      @import url(\"4.css\");\n      @import url(5.css);\n      ";
            var styleWithImports = style_url_resolver_1.extractStyleUrls(urlResolver, 'http://ng.io', css);
            expect(styleWithImports.style.trim()).toEqual('');
            expect(styleWithImports.styleUrls).toEqual([
                'http://ng.io/3.css', 'http://ng.io/4.css', 'http://ng.io/5.css'
            ]);
        });
        it('should extract "@import urls and keep rules in the same line', function () {
            var css = "@import url('some.css');div {color: red};";
            var styleWithImports = style_url_resolver_1.extractStyleUrls(urlResolver, 'http://ng.io', css);
            expect(styleWithImports.style.trim()).toEqual('div {color: red};');
            expect(styleWithImports.styleUrls).toEqual(['http://ng.io/some.css']);
        });
        it('should extract media query in "@import"', function () {
            var css = "\n      @import 'print1.css' print;\n      @import url(print2.css) print;\n      ";
            var styleWithImports = style_url_resolver_1.extractStyleUrls(urlResolver, 'http://ng.io', css);
            expect(styleWithImports.style.trim()).toEqual('');
            expect(styleWithImports.styleUrls).toEqual([
                'http://ng.io/print1.css', 'http://ng.io/print2.css'
            ]);
        });
        it('should leave absolute non-package @import urls intact', function () {
            var css = "@import url('http://server.com/some.css');";
            var styleWithImports = style_url_resolver_1.extractStyleUrls(urlResolver, 'http://ng.io', css);
            expect(styleWithImports.style.trim()).toEqual("@import url('http://server.com/some.css');");
            expect(styleWithImports.styleUrls).toEqual([]);
        });
        it('should resolve package @import urls', function () {
            var css = "@import url('package:a/b/some.css');";
            var styleWithImports = style_url_resolver_1.extractStyleUrls(new FakeUrlResolver(), 'http://ng.io', css);
            expect(styleWithImports.style.trim()).toEqual("");
            expect(styleWithImports.styleUrls).toEqual(['fake_resolved_url']);
        });
    });
    describe('isStyleUrlResolvable', function () {
        it('should resolve relative urls', function () { expect(style_url_resolver_1.isStyleUrlResolvable('someUrl.css')).toBe(true); });
        it('should resolve package: urls', function () { expect(style_url_resolver_1.isStyleUrlResolvable('package:someUrl.css')).toBe(true); });
        it('should not resolve empty urls', function () {
            expect(style_url_resolver_1.isStyleUrlResolvable(null)).toBe(false);
            expect(style_url_resolver_1.isStyleUrlResolvable('')).toBe(false);
        });
        it('should not resolve urls with other schema', function () { expect(style_url_resolver_1.isStyleUrlResolvable('http://otherurl')).toBe(false); });
        it('should not resolve urls with absolute paths', function () {
            expect(style_url_resolver_1.isStyleUrlResolvable('/otherurl')).toBe(false);
            expect(style_url_resolver_1.isStyleUrlResolvable('//otherurl')).toBe(false);
        });
    });
}
var FakeUrlResolver = /** @class */ (function (_super) {
    __extends(FakeUrlResolver, _super);
    function FakeUrlResolver() {
        return _super.call(this) || this;
    }
    FakeUrlResolver.prototype.resolve = function (baseUrl, url) { return 'fake_resolved_url'; };
    return FakeUrlResolver;
}(url_resolver_1.UrlResolver));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGVfdXJsX3Jlc29sdmVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L3N0eWxlX3VybF9yZXNvbHZlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILCtFQUFnRztBQUNoRyxtRUFBK0Q7QUFFL0Q7SUFDRSxRQUFRLENBQUMsa0JBQWtCLEVBQUU7UUFDM0IsSUFBSSxXQUF3QixDQUFDO1FBRTdCLFVBQVUsQ0FBQyxjQUFRLFdBQVcsR0FBRyxJQUFJLDBCQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXZELEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRTtZQUNwQyxJQUFNLEdBQUcsR0FBRyxvS0FLVixDQUFDO1lBQ0gsSUFBTSxXQUFXLEdBQUcscUNBQWdCLENBQUMsV0FBVyxFQUFFLGNBQWMsRUFBRSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDN0UsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywrQkFBK0IsRUFBRTtZQUNsQyxJQUFNLEdBQUcsR0FBRyw0REFHWCxDQUFDO1lBQ0YsSUFBTSxnQkFBZ0IsR0FBRyxxQ0FBZ0IsQ0FBQyxXQUFXLEVBQUUsY0FBYyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzVFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbEQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLG9CQUFvQixFQUFFLG9CQUFvQixDQUFDLENBQUMsQ0FBQztRQUMzRixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxx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