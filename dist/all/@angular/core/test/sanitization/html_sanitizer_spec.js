"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var html_sanitizer_1 = require("../../src/sanitization/html_sanitizer");
{
    describe('HTML sanitizer', function () {
        var defaultDoc;
        var originalLog = null;
        var logMsgs;
        beforeEach(function () {
            defaultDoc = document;
            logMsgs = [];
            originalLog = console.warn; // Monkey patch DOM.log.
            console.warn = function (msg) { return logMsgs.push(msg); };
        });
        afterEach(function () { console.warn = originalLog; });
        it('serializes nested structures', function () {
            expect(html_sanitizer_1._sanitizeHtml(defaultDoc, '<div alt="x"><p>a</p>b<b>c<a alt="more">d</a></b>e</div>'))
                .toEqual('<div alt="x"><p>a</p>b<b>c<a alt="more">d</a></b>e</div>');
            expect(logMsgs).toEqual([]);
        });
        it('serializes self closing elements', function () {
            expect(html_sanitizer_1._sanitizeHtml(defaultDoc, '<p>Hello <br> World</p>'))
                .toEqual('<p>Hello <br> World</p>');
        });
        it('supports namespaced elements', function () { expect(html_sanitizer_1._sanitizeHtml(defaultDoc, 'a<my:hr/><my:div>b</my:div>c')).toEqual('abc'); });
        it('supports namespaced attributes', function () {
            expect(html_sanitizer_1._sanitizeHtml(defaultDoc, '<a xlink:href="something">t</a>'))
                .toEqual('<a xlink:href="something">t</a>');
            expect(html_sanitizer_1._sanitizeHtml(defaultDoc, '<a xlink:evil="something">t</a>')).toEqual('<a>t</a>');
            expect(html_sanitizer_1._sanitizeHtml(defaultDoc, '<a xlink:href="javascript:foo()">t</a>'))
                .toEqual('<a xlink:href="unsafe:javascript:foo()">t</a>');
        });
        it('supports HTML5 elements', function () {
            expect(html_sanitizer_1._sanitizeHtml(defaultDoc, '<main><summary>Works</summary></main>'))
                .toEqual('<main><summary>Works</summary></main>');
        });
        it('sanitizes srcset attributes', function () {
            expect(html_sanitizer_1._sanitizeHtml(defaultDoc, '<img srcset="/foo.png 400px, javascript:evil() 23px">'))
                .toEqual('<img srcset="/foo.png 400px, unsafe:javascript:evil() 23px">');
        });
        it('supports sanitizing plain text', function () { expect(html_sanitizer_1._sanitizeHtml(defaultDoc, 'Hello, World')).toEqual('Hello, World'); });
        it('ignores non-element, non-attribute nodes', function () {
            expect(html_sanitizer_1._sanitizeHtml(defaultDoc, '<!-- comments? -->no.')).toEqual('no.');
            expect(html_sanitizer_1._sanitizeHtml(defaultDoc, '<?pi nodes?>no.')).toEqual('no.');
            expect(logMsgs.join('\n')).toMatch(/sanitizing HTML stripped some content/);
        });
        it('supports sanitizing escaped entities', function () {
            expect(html_sanitizer_1._sanitizeHtml(defaultDoc, '&#128640;')).toEqual('&#128640;');
            expect(logMsgs).toEqual([]);
        });
        it('does not warn when just re-encoding text', function () {
            expect(html_sanitizer_1._sanitizeHtml(defaultDoc, '<p>Hellö Wörld</p>'))
                .toEqual('<p>Hell&#246; W&#246;rld</p>');
            expect(logMsgs).toEqual([]);
        });
        it('escapes entities', function () {
            expect(html_sanitizer_1._sanitizeHtml(defaultDoc, '<p>Hello &lt; World</p>'))
                .toEqual('<p>Hello &lt; World</p>');
            expect(html_sanitizer_1._sanitizeHtml(defaultDoc, '<p>Hello < World</p>')).toEqual('<p>Hello &lt; World</p>');
            expect(html_sanitizer_1._sanitizeHtml(defaultDoc, '<p alt="% &amp; &quot; !">Hello</p>'))
                .toEqual('<p alt="% &amp; &#34; !">Hello</p>'); // NB: quote encoded as ASCII &#34;.
        });
        describe('should strip dangerous elements', function () {
            var dangerousTags = [
                'frameset', 'form', 'param', 'object', 'embed', 'textarea', 'input', 'button', 'option',
                'select', 'script', 'style', 'link', 'base', 'basefont'
            ];
            var _loop_1 = function (tag) {
                it("" + tag, function () { expect(html_sanitizer_1._sanitizeHtml(defaultDoc, "<" + tag + ">evil!</" + tag + ">")).toEqual('evil!'); });
            };
            for (var _i = 0, dangerousTags_1 = dangerousTags; _i < dangerousTags_1.length; _i++) {
                var tag = dangerousTags_1[_i];
                _loop_1(tag);
            }
            it("swallows frame entirely", function () {
                expect(html_sanitizer_1._sanitizeHtml(defaultDoc, "<frame>evil!</frame>")).not.toContain('<frame>');
            });
        });
        describe('should strip dangerous attributes', function () {
            var dangerousAttrs = ['id', 'name', 'style'];
            var _loop_2 = function (attr) {
                it("" + attr, function () {
                    expect(html_sanitizer_1._sanitizeHtml(defaultDoc, "<a " + attr + "=\"x\">evil!</a>")).toEqual('<a>evil!</a>');
                });
            };
            for (var _i = 0, dangerousAttrs_1 = dangerousAttrs; _i < dangerousAttrs_1.length; _i++) {
                var attr = dangerousAttrs_1[_i];
                _loop_2(attr);
            }
        });
        it('should not enter an infinite loop on clobbered elements', function () {
            // Some browsers are vulnerable to clobbered elements and will throw an expected exception
            // IE and EDGE does not seems to be affected by those cases
            // Anyway what we want to test is that browsers do not enter an infinite loop which would
            // result in a timeout error for the test.
            try {
                html_sanitizer_1._sanitizeHtml(defaultDoc, '<form><input name="parentNode" /></form>');
            }
            catch (e) {
                // depending on the browser, we might ge an exception
            }
            try {
                html_sanitizer_1._sanitizeHtml(defaultDoc, '<form><input name="nextSibling" /></form>');
            }
            catch (e) {
                // depending on the browser, we might ge an exception
            }
            try {
                html_sanitizer_1._sanitizeHtml(defaultDoc, '<form><div><div><input name="nextSibling" /></div></div></form>');
            }
            catch (e) {
                // depending on the browser, we might ge an exception
            }
        });
        // See
        // https://github.com/cure53/DOMPurify/blob/a992d3a75031cb8bb032e5ea8399ba972bdf9a65/src/purify.js#L439-L449
        it('should not allow JavaScript execution when creating inert document', function () {
            var output = html_sanitizer_1._sanitizeHtml(defaultDoc, '<svg><g onload="window.xxx = 100"></g></svg>');
            var window = defaultDoc.defaultView;
            if (window) {
                expect(window.xxx).toBe(undefined);
                window.xxx = undefined;
            }
            expect(output).toEqual('');
        });
        // See https://github.com/cure53/DOMPurify/releases/tag/0.6.7
        it('should not allow JavaScript hidden in badly formed HTML to get through sanitization (Firefox bug)', function () {
            expect(html_sanitizer_1._sanitizeHtml(defaultDoc, '<svg><p><style><img src="</style><img src=x onerror=alert(1)//">'))
                .toEqual(isDOMParserAvailable() ?
                // PlatformBrowser output
                '<p>&lt;img src=&#34;<img src="x"></p>' :
                // PlatformServer output
                '<p><img src="&lt;/style&gt;&lt;img src=x onerror=alert(1)//"></p>');
        });
        if (browser_util_1.browserDetection.isWebkit) {
            it('should prevent mXSS attacks', function () {
                // In Chrome Canary 62, the ideographic space character is kept as a stringified HTML entity
                expect(html_sanitizer_1._sanitizeHtml(defaultDoc, '<a href="&#x3000;javascript:alert(1)">CLICKME</a>'))
                    .toMatch(/<a href="unsafe:(&#12288;)?javascript:alert\(1\)">CLICKME<\/a>/);
            });
        }
    });
}
/**
 * We need to determine whether the DOMParser exists in the global context.
 * The try-catch is because, on some browsers, trying to access this property
 * on window can actually throw an error.
 *
 * @suppress {uselessCode}
 */
function isDOMParserAvailable() {
    try {
        return !!window.DOMParser;
    }
    catch (e) {
        return false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbF9zYW5pdGl6ZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9zYW5pdGl6YXRpb24vaHRtbF9zYW5pdGl6ZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILG1GQUFvRjtBQUVwRix3RUFBb0U7QUFFcEU7SUFDRSxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsSUFBSSxVQUFlLENBQUM7UUFDcEIsSUFBSSxXQUFXLEdBQXNCLElBQU0sQ0FBQztRQUM1QyxJQUFJLE9BQWlCLENBQUM7UUFFdEIsVUFBVSxDQUFDO1lBQ1QsVUFBVSxHQUFHLFFBQVEsQ0FBQztZQUN0QixPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ2IsV0FBVyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBRSx3QkFBd0I7WUFDckQsT0FBTyxDQUFDLElBQUksR0FBRyxVQUFDLEdBQVEsSUFBSyxPQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQWpCLENBQWlCLENBQUM7UUFDakQsQ0FBQyxDQUFDLENBQUM7UUFFSCxTQUFTLENBQUMsY0FBUSxPQUFPLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWpELEVBQUUsQ0FBQyw4QkFBOEIsRUFBRTtZQUNqQyxNQUFNLENBQUMsOEJBQWEsQ0FBQyxVQUFVLEVBQUUsMERBQTBELENBQUMsQ0FBQztpQkFDeEYsT0FBTyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7WUFDekUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRTtZQUNyQyxNQUFNLENBQUMsOEJBQWEsQ0FBQyxVQUFVLEVBQUUseUJBQXlCLENBQUMsQ0FBQztpQkFDdkQs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