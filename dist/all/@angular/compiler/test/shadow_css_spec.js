"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var shadow_css_1 = require("@angular/compiler/src/shadow_css");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
{
    describe('ShadowCss', function () {
        function s(css, contentAttr, hostAttr) {
            if (hostAttr === void 0) { hostAttr = ''; }
            var shadowCss = new shadow_css_1.ShadowCss();
            var shim = shadowCss.shimCssText(css, contentAttr, hostAttr);
            var nlRegexp = /\n/g;
            return browser_util_1.normalizeCSS(shim.replace(nlRegexp, ''));
        }
        it('should handle empty string', function () { expect(s('', 'contenta')).toEqual(''); });
        it('should add an attribute to every rule', function () {
            var css = 'one {color: red;}two {color: red;}';
            var expected = 'one[contenta] {color:red;}two[contenta] {color:red;}';
            expect(s(css, 'contenta')).toEqual(expected);
        });
        it('should handle invalid css', function () {
            var css = 'one {color: red;}garbage';
            var expected = 'one[contenta] {color:red;}garbage';
            expect(s(css, 'contenta')).toEqual(expected);
        });
        it('should add an attribute to every selector', function () {
            var css = 'one, two {color: red;}';
            var expected = 'one[contenta], two[contenta] {color:red;}';
            expect(s(css, 'contenta')).toEqual(expected);
        });
        it('should support newlines in the selector and content ', function () {
            var css = 'one, \ntwo {\ncolor: red;}';
            var expected = 'one[contenta], two[contenta] {color:red;}';
            expect(s(css, 'contenta')).toEqual(expected);
        });
        it('should handle media rules', function () {
            var css = '@media screen and (max-width:800px, max-height:100%) {div {font-size:50px;}}';
            var expected = '@media screen and (max-width:800px, max-height:100%) {div[contenta] {font-size:50px;}}';
            expect(s(css, 'contenta')).toEqual(expected);
        });
        it('should handle page rules', function () {
            var css = '@page {div {font-size:50px;}}';
            var expected = '@page {div[contenta] {font-size:50px;}}';
            expect(s(css, 'contenta')).toEqual(expected);
        });
        it('should handle document rules', function () {
            var css = '@document url(http://www.w3.org/) {div {font-size:50px;}}';
            var expected = '@document url(http://www.w3.org/) {div[contenta] {font-size:50px;}}';
            expect(s(css, 'contenta')).toEqual(expected);
        });
        it('should handle media rules with simple rules', function () {
            var css = '@media screen and (max-width: 800px) {div {font-size: 50px;}} div {}';
            var expected = '@media screen and (max-width:800px) {div[contenta] {font-size:50px;}} div[contenta] {}';
            expect(s(css, 'contenta')).toEqual(expected);
        });
        it('should handle support rules', function () {
            var css = '@supports (display: flex) {section {display: flex;}}';
            var expected = '@supports (display:flex) {section[contenta] {display:flex;}}';
            expect(s(css, 'contenta')).toEqual(expected);
        });
        // Check that the browser supports unprefixed CSS animation
        it('should handle keyframes rules', function () {
            var css = '@keyframes foo {0% {transform:translate(-50%) scaleX(0);}}';
            expect(s(css, 'contenta')).toEqual(css);
        });
        it('should handle -webkit-keyframes rules', function () {
            var css = '@-webkit-keyframes foo {0% {-webkit-transform:translate(-50%) scaleX(0);}}';
            expect(s(css, 'contenta')).toEqual(css);
        });
        it('should handle complicated selectors', function () {
            expect(s('one::before {}', 'contenta')).toEqual('one[contenta]::before {}');
            expect(s('one two {}', 'contenta')).toEqual('one[contenta] two[contenta] {}');
            expect(s('one > two {}', 'contenta')).toEqual('one[contenta] > two[contenta] {}');
            expect(s('one + two {}', 'contenta')).toEqual('one[contenta] + two[contenta] {}');
            expect(s('one ~ two {}', 'contenta')).toEqual('one[contenta] ~ two[contenta] {}');
            var res = s('.one.two > three {}', 'contenta'); // IE swap classes
            expect(res == '.one.two[contenta] > three[contenta] {}' ||
                res == '.two.one[contenta] > three[contenta] {}')
                .toEqual(true);
            expect(s('one[attr="value"] {}', 'contenta')).toEqual('one[attr="value"][contenta] {}');
            expect(s('one[attr=value] {}', 'contenta')).toEqual('one[attr="value"][contenta] {}');
            expect(s('one[attr^="value"] {}', 'contenta')).toEqual('one[attr^="value"][contenta] {}');
            expect(s('one[attr$="value"] {}', 'contenta')).toEqual('one[attr$="value"][contenta] {}');
            expect(s('one[attr*="value"] {}', 'contenta')).toEqual('one[attr*="value"][contenta] {}');
            expect(s('one[attr|="value"] {}', 'contenta')).toEqual('one[attr|="value"][contenta] {}');
            expect(s('one[attr~="value"] {}', 'contenta')).toEqual('one[attr~="value"][contenta] {}');
            expect(s('one[attr="va lue"] {}', 'contenta')).toEqual('one[attr="va lue"][contenta] {}');
            expect(s('one[attr] {}', 'contenta')).toEqual('one[attr][contenta] {}');
            expect(s('[is="one"] {}', 'contenta')).toEqual('[is="one"][contenta] {}');
        });
        describe((':host'), function () {
            it('should handle no context', function () { expect(s(':host {}', 'contenta', 'a-host')).toEqual('[a-host] {}'); });
            it('should handle tag selector', function () { expect(s(':host(ul) {}', 'contenta', 'a-host')).toEqual('ul[a-host] {}'); });
            it('should handle class selector', function () { expect(s(':host(.x) {}', 'contenta', 'a-host')).toEqual('.x[a-host] {}'); });
            it('should handle attribute selector', function () {
                expect(s(':host([a="b"]) {}', 'contenta', 'a-host')).toEqual('[a="b"][a-host] {}');
                expect(s(':host([a=b]) {}', 'contenta', 'a-host')).toEqual('[a="b"][a-host] {}');
            });
            it('should handle multiple tag selectors', function () {
                expect(s(':host(ul,li) {}', 'contenta', 'a-host')).toEqual('ul[a-host], li[a-host] {}');
                expect(s(':host(ul,li) > .z {}', 'contenta', 'a-host'))
                    .toEqual('ul[a-host] > .z[contenta], li[a-host] > .z[contenta] {}');
            });
            it('should handle multiple class selectors', function () {
                expect(s(':host(.x,.y) {}', 'contenta', 'a-host')).toEqual('.x[a-host], .y[a-host] {}');
                expect(s(':host(.x,.y) > .z {}', 'contenta', 'a-host'))
                    .toEqual('.x[a-host] > .z[contenta], .y[a-host] > .z[contenta] {}');
            });
            it('should handle multiple attribute selectors', function () {
                expect(s(':host([a="b"],[c=d]) {}', 'contenta', 'a-host'))
                    .toEqual('[a="b"][a-host], [c="d"][a-host] {}');
            });
            it('should handle pseudo selectors', function () {
                expect(s(':host(:before) {}', 'contenta', 'a-host')).toEqual('[a-host]:before {}');
                expect(s(':host:before {}', 'contenta', 'a-host')).toEqual('[a-host]:before {}');
                expect(s(':host:nth-child(8n+1) {}', 'contenta', 'a-host'))
                    .toEqual('[a-host]:nth-child(8n+1) {}');
                expect(s(':host:nth-of-type(8n+1) {}', 'contenta', 'a-host'))
                    .toEqual('[a-host]:nth-of-type(8n+1) {}');
                expect(s(':host(.class):before {}', 'contenta', 'a-host'))
                    .toEqual('.class[a-host]:before {}');
                expect(s(':host.class:before {}', 'contenta', 'a-host'))
                    .toEqual('.class[a-host]:before {}');
                expect(s(':host(:not(p)):before {}', 'contenta', 'a-host'))
                    .toEqual('[a-host]:not(p):before {}');
            });
            // see b/63672152
            it('should handle unexpected selectors in the most reasonable way', function () {
                expect(s('cmp:host {}', 'contenta', 'a-host')).toEqual('cmp[a-host] {}');
                expect(s('cmp:host >>> {}', 'contenta', 'a-host')).toEqual('cmp[a-host] {}');
                expect(s('cmp:host child {}', 'contenta', 'a-host'))
                    .toEqual('cmp[a-host] child[contenta] {}');
                expect(s('cmp:host >>> child {}', 'contenta', 'a-host')).toEqual('cmp[a-host] child {}');
                expect(s('cmp :host {}', 'contenta', 'a-host')).toEqual('cmp [a-host] {}');
                expect(s('cmp :host >>> {}', 'contenta', 'a-host')).toEqual('cmp [a-host] {}');
                expect(s('cmp :host child {}', 'contenta', 'a-host'))
                    .toEqual('cmp [a-host] child[contenta] {}');
                expect(s('cmp :host >>> child {}', 'contenta', 'a-host')).toEqual('cmp [a-host] child {}');
            });
        });
        describe((':host-context'), function () {
            it('should handle tag selector', function () {
                expect(s(':host-context(div) {}', 'contenta', 'a-host'))
                    .toEqual('div[a-host], div [a-host] {}');
                expect(s(':host-context(ul) > .y {}', 'contenta', 'a-host'))
                    .toEqual('ul[a-host] > .y[contenta], ul [a-host] > .y[contenta] {}');
            });
            it('should handle class selector', function () {
                expect(s(':host-context(.x) {}', 'contenta', 'a-host'))
                    .toEqual('.x[a-host], .x [a-host] {}');
                expect(s(':host-context(.x) > .y {}', 'contenta', 'a-host'))
                    .toEqual('.x[a-host] > .y[contenta], .x [a-host] > .y[contenta] {}');
            });
            it('should handle attribute selector', function () {
                expect(s(':host-context([a="b"]) {}', 'contenta', 'a-host'))
                    .toEqual('[a="b"][a-host], [a="b"] [a-host] {}');
                expect(s(':host-context([a=b]) {}', 'contenta', 'a-host'))
                    .toEqual('[a=b][a-host], [a="b"] [a-host] {}');
            });
        });
        it('should support polyfill-next-selector', function () {
            var css = s('polyfill-next-selector {content: \'x > y\'} z {}', 'contenta');
            expect(css).toEqual('x[contenta] > y[contenta]{}');
            css = s('polyfill-next-selector {content: "x > y"} z {}', 'contenta');
            expect(css).toEqual('x[contenta] > y[contenta]{}');
            css = s("polyfill-next-selector {content: 'button[priority=\"1\"]'} z {}", 'contenta');
            expect(css).toEqual('button[priority="1"][contenta]{}');
        });
        it('should support polyfill-unscoped-rule', function () {
            var css = s('polyfill-unscoped-rule {content: \'#menu > .bar\';color: blue;}', 'contenta');
            expect(css).toContain('#menu > .bar {;color:blue;}');
            css = s('polyfill-unscoped-rule {content: "#menu > .bar";color: blue;}', 'contenta');
            expect(css).toContain('#menu > .bar {;color:blue;}');
            css = s("polyfill-unscoped-rule {content: 'button[priority=\"1\"]'}", 'contenta');
            expect(css).toContain('button[priority="1"] {}');
        });
        it('should support multiple instances polyfill-unscoped-rule', function () {
            var css = s('polyfill-unscoped-rule {content: \'foo\';color: blue;}' +
                'polyfill-unscoped-rule {content: \'bar\';color: blue;}', 'contenta');
            expect(css).toContain('foo {;color:blue;}');
            expect(css).toContain('bar {;color:blue;}');
        });
        it('should support polyfill-rule', function () {
            var css = s('polyfill-rule {content: \':host.foo .bar\';color: blue;}', 'contenta', 'a-host');
            expect(css).toEqual('.foo[a-host] .bar[contenta] {;color:blue;}');
            css = s('polyfill-rule {content: ":host.foo .bar";color:blue;}', 'contenta', 'a-host');
            expect(css).toEqual('.foo[a-host] .bar[contenta] {;color:blue;}');
            css = s("polyfill-rule {content: 'button[priority=\"1\"]'}", 'contenta', 'a-host');
            expect(css).toEqual('button[priority="1"][contenta] {}');
        });
        it('should handle ::shadow', function () {
            var css = s('x::shadow > y {}', 'contenta');
            expect(css).toEqual('x[contenta] > y[contenta] {}');
        });
        it('should handle /deep/', function () {
            var css = s('x /deep/ y {}', 'contenta');
            expect(css).toEqual('x[contenta] y {}');
        });
        it('should handle >>>', function () {
            var css = s('x >>> y {}', 'contenta');
            expect(css).toEqual('x[contenta] y {}');
        });
        it('should handle ::ng-deep', function () {
            var css = '::ng-deep y {}';
            expect(s(css, 'contenta')).toEqual('y {}');
            css = 'x ::ng-deep y {}';
            expect(s(css, 'contenta')).toEqual('x[contenta] y {}');
            css = ':host > ::ng-deep .x {}';
            expect(s(css, 'contenta', 'h')).toEqual('[h] > .x {}');
            css = ':host ::ng-deep > .x {}';
            expect(s(css, 'contenta', 'h')).toEqual('[h] > .x {}');
            css = ':host > ::ng-deep > .x {}';
            expect(s(css, 'contenta', 'h')).toEqual('[h] > > .x {}');
        });
        it('should pass through @import directives', function () {
            var styleStr = '@import url("https://fonts.googleapis.com/css?family=Roboto");';
            var css = s(styleStr, 'contenta');
            expect(css).toEqual(styleStr);
        });
        it('should shim rules after @import', function () {
            var styleStr = '@import url("a"); div {}';
            var css = s(styleStr, 'contenta');
            expect(css).toEqual('@import url("a"); div[contenta] {}');
        });
        it('should leave calc() unchanged', function () {
            var styleStr = 'div {height:calc(100% - 55px);}';
            var css = s(styleStr, 'contenta');
            expect(css).toEqual('div[contenta] {height:calc(100% - 55px);}');
        });
        it('should strip comments', function () { expect(s('/* x */b {c}', 'contenta')).toEqual('b[contenta] {c}'); });
        it('should ignore special characters in comments', function () { expect(s('/* {;, */b {c}', 'contenta')).toEqual('b[contenta] {c}'); });
        it('should support multiline comments', function () { expect(s('/* \n */b {c}', 'contenta')).toEqual('b[contenta] {c}'); });
        it('should keep sourceMappingURL comments', function () {
            expect(s('b {c}/*# sourceMappingURL=data:x */', 'contenta'))
                .toEqual('b[contenta] {c}/*# sourceMappingURL=data:x */');
            expect(s('b {c}/* #sourceMappingURL=data:x */', 'contenta'))
                .toEqual('b[contenta] {c}/* #sourceMappingURL=data:x */');
        });
        it('should keep sourceURL comments', function () {
            expect(s('/*# sourceMappingURL=data:x */b {c}/*# sourceURL=xxx */', 'contenta'))
                .toEqual('b[contenta] {c}/*# sourceMappingURL=data:x *//*# sourceURL=xxx */');
        });
    });
    describe('processRules', function () {
        describe('parse rules', function () {
            function captureRules(input) {
                var result = [];
                shadow_css_1.processRules(input, function (cssRule) {
                    result.push(cssRule);
                    return cssRule;
                });
                return result;
            }
            it('should work with empty css', function () { expect(captureRules('')).toEqual([]); });
            it('should capture a rule without body', function () { expect(captureRules('a;')).toEqual([new shadow_css_1.CssRule('a', '')]); });
            it('should capture css rules with body', function () { expect(captureRules('a {b}')).toEqual([new shadow_css_1.CssRule('a', 'b')]); });
            it('should capture css rules with nested rules', function () {
                expect(captureRules('a {b {c}} d {e}')).toEqual([
                    new shadow_css_1.CssRule('a', 'b {c}'),
                    new shadow_css_1.CssRule('d', 'e'),
                ]);
            });
            it('should capture multiple rules where some have no body', function () {
                expect(captureRules('@import a ; b {c}')).toEqual([
                    new shadow_css_1.CssRule('@import a', ''),
                    new shadow_css_1.CssRule('b', 'c'),
                ]);
            });
        });
        describe('modify rules', function () {
            it('should allow to change the selector while preserving whitespaces', function () {
                expect(shadow_css_1.processRules('@import a; b {c {d}} e {f}', function (cssRule) { return new shadow_css_1.CssRule(cssRule.selector + '2', cssRule.content); }))
                    .toEqual('@import a2; b2 {c {d}} e2 {f}');
            });
            it('should allow to change the content', function () {
                expect(shadow_css_1.processRules('a {b}', function (cssRule) { return new shadow_css_1.CssRule(cssRule.selector, cssRule.content + '2'); }))
                    .toEqual('a {b2}');
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhZG93X2Nzc19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9zaGFkb3dfY3NzX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwrREFBa0Y7QUFDbEYsbUZBQWdGO0FBRWhGO0lBQ0UsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUVwQixXQUFXLEdBQVcsRUFBRSxXQUFtQixFQUFFLFFBQXFCO1lBQXJCLHlCQUFBLEVBQUEsYUFBcUI7WUFDaEUsSUFBTSxTQUFTLEdBQUcsSUFBSSxzQkFBUyxFQUFFLENBQUM7WUFDbEMsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQy9ELElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN2QixPQUFPLDJCQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsRCxDQUFDO1FBRUQsRUFBRSxDQUFDLDRCQUE0QixFQUFFLGNBQVEsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVuRixFQUFFLENBQUMsdUNBQXVDLEVBQUU7WUFDMUMsSUFBTSxHQUFHLEdBQUcsb0NBQW9DLENBQUM7WUFDakQsSUFBTSxRQUFRLEdBQUcsc0RBQXNELENBQUM7WUFDeEUsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMkJBQTJCLEVBQUU7WUFDOUIsSUFBTSxHQUFHLEdBQUcsMEJBQTBCLENBQUM7WUFDdkMsSUFBTSxRQUFRLEdBQUcsbUNBQW1DLENBQUM7WUFDckQsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMkNBQTJDLEVBQUU7WUFDOUMsSUFBTSxHQUFHLEdBQUcsd0JBQXdCLENBQUM7WUFDckMsSUFBTSxRQUFRLEdBQUcsMkNBQTJDLENBQUM7WUFDN0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsc0RBQXNELEVBQUU7WUFDekQsSUFBTSxHQUFHLEdBQUcsNEJBQTRCLENBQUM7WUFDekMsSUFBTSxRQUFRLEdBQUcsMkNBQTJDLENBQUM7WUFDN0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMkJBQTJCLEVBQUU7WUFDOUIsSUFBTSxHQUFHLEdBQUcsOEVBQThFLENBQUM7WUFDM0YsSUFBTSxRQUFRLEdBQ1Ysd0ZBQXdGLENBQUM7WUFDN0YsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMEJBQTBCLEVBQUU7WUFDN0IsSUFBTSxHQUFHLEdBQUcsK0JBQStCLENBQUM7WUFDNUMsSUFBTSxRQUFRLEdBQUcseUNBQXlDLENBQUM7WUFDM0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0Ms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