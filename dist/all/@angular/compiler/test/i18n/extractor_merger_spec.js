"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
var digest_1 = require("../../src/i18n/digest");
var extractor_merger_1 = require("../../src/i18n/extractor_merger");
var i18n = require("../../src/i18n/i18n_ast");
var translation_bundle_1 = require("../../src/i18n/translation_bundle");
var ast_serializer_spec_1 = require("../ml_parser/ast_serializer_spec");
{
    describe('Extractor', function () {
        describe('elements', function () {
            it('should extract from elements', function () {
                expect(extract('<div i18n="m|d|e">text<span>nested</span></div>')).toEqual([
                    [
                        ['text', '<ph tag name="START_TAG_SPAN">nested</ph name="CLOSE_TAG_SPAN">'], 'm', 'd|e',
                        ''
                    ],
                ]);
            });
            it('should extract from attributes', function () {
                expect(extract('<div i18n="m1|d1"><span i18n-title="m2|d2" title="single child">nested</span></div>'))
                    .toEqual([
                    [['<ph tag name="START_TAG_SPAN">nested</ph name="CLOSE_TAG_SPAN">'], 'm1', 'd1', ''],
                    [['single child'], 'm2', 'd2', ''],
                ]);
            });
            it('should extract from attributes with id', function () {
                expect(extract('<div i18n="m1|d1@@i1"><span i18n-title="m2|d2@@i2" title="single child">nested</span></div>'))
                    .toEqual([
                    [
                        ['<ph tag name="START_TAG_SPAN">nested</ph name="CLOSE_TAG_SPAN">'], 'm1', 'd1',
                        'i1'
                    ],
                    [['single child'], 'm2', 'd2', 'i2'],
                ]);
            });
            it('should extract from attributes without meaning and with id', function () {
                expect(extract('<div i18n="d1@@i1"><span i18n-title="d2@@i2" title="single child">nested</span></div>'))
                    .toEqual([
                    [['<ph tag name="START_TAG_SPAN">nested</ph name="CLOSE_TAG_SPAN">'], '', 'd1', 'i1'],
                    [['single child'], '', 'd2', 'i2'],
                ]);
            });
            it('should extract from attributes with id only', function () {
                expect(extract('<div i18n="@@i1"><span i18n-title="@@i2" title="single child">nested</span></div>'))
                    .toEqual([
                    [['<ph tag name="START_TAG_SPAN">nested</ph name="CLOSE_TAG_SPAN">'], '', '', 'i1'],
                    [['single child'], '', '', 'i2'],
                ]);
            });
            it('should extract from ICU messages', function () {
                expect(extract('<div i18n="m|d">{count, plural, =0 { <p i18n-title i18n-desc title="title" desc="desc"></p>}}</div>'))
                    .toEqual([
                    [
                        [
                            '{count, plural, =0 {[<ph tag name="START_PARAGRAPH"></ph name="CLOSE_PARAGRAPH">]}}'
                        ],
                        'm', 'd', ''
                    ],
                    [['title'], '', '', ''],
                    [['desc'], '', '', ''],
                ]);
            });
            it('should not create a message for empty elements', function () { expect(extract('<div i18n="m|d"></div>')).toEqual([]); });
            it('should ignore implicit elements in translatable elements', function () {
                expect(extract('<div i18n="m|d"><p></p></div>', ['p'])).toEqual([
                    [['<ph tag name="START_PARAGRAPH"></ph name="CLOSE_PARAGRAPH">'], 'm', 'd', '']
                ]);
            });
        });
        describe('blocks', function () {
            it('should extract from blocks', function () {
                expect(extract("<!-- i18n: meaning1|desc1 -->message1<!-- /i18n -->\n         <!-- i18n: desc2 -->message2<!-- /i18n -->\n         <!-- i18n -->message3<!-- /i18n -->\n         <!-- i18n: meaning4|desc4@@id4 -->message4<!-- /i18n -->\n         <!-- i18n: @@id5 -->message5<!-- /i18n -->"))
                    .toEqual([
                    [['message1'], 'meaning1', 'desc1', ''], [['message2'], '', 'desc2', ''],
                    [['message3'], '', '', ''], [['message4'], 'meaning4', 'desc4', 'id4'],
                    [['message5'], '', '', 'id5']
                ]);
            });
            it('should ignore implicit elements in blocks', function () {
                expect(extract('<!-- i18n:m|d --><p></p><!-- /i18n -->', ['p'])).toEqual([
                    [['<ph tag name="START_PARAGRAPH"></ph name="CLOSE_PARAGRAPH">'], 'm', 'd', '']
                ]);
            });
            it('should extract siblings', function () {
                expect(extract("<!-- i18n -->text<p>html<b>nested</b></p>{count, plural, =0 {<span>html</span>}}{{interp}}<!-- /i18n -->"))
                    .toEqual([
                    [
                        [
                            '{count, plural, =0 {[<ph tag name="START_TAG_SPAN">html</ph name="CLOSE_TAG_SPAN">]}}'
                        ],
                        '', '', ''
                    ],
                    [
                        [
                            'text', '<ph tag name="START_PARAGRAPH">html, <ph tag' +
                                ' name="START_BOLD_TEXT">nested</ph name="CLOSE_BOLD_TEXT"></ph name="CLOSE_PARAGRAPH">',
                            '<ph icu name="ICU">{count, plural, =0 {[<ph tag' +
                                ' name="START_TAG_SPAN">html</ph name="CLOSE_TAG_SPAN">]}}</ph>',
                            '[<ph name="INTERPOLATION">interp</ph>]'
                        ],
                        '', '', ''
                    ],
                ]);
            });
            it('should ignore other comments', function () {
                expect(extract("<!-- i18n: meaning1|desc1@@id1 --><!-- other -->message1<!-- /i18n -->"))
                    .toEqual([
                    [['message1'], 'meaning1', 'desc1', 'id1'],
                ]);
            });
            it('should not create a message for empty blocks', function () { expect(extract("<!-- i18n: meaning1|desc1 --><!-- /i18n -->")).toEqual([]); });
        });
        describe('ICU messages', function () {
            it('should extract ICU messages from translatable elements', function () {
                // single message when ICU is the only children
                expect(extract('<div i18n="m|d">{count, plural, =0 {text}}</div>')).toEqual([
                    [['{count, plural, =0 {[text]}}'], 'm', 'd', ''],
                ]);
                // single message when ICU is the only (implicit) children
                expect(extract('<div>{count, plural, =0 {text}}</div>', ['div'])).toEqual([
                    [['{count, plural, =0 {[text]}}'], '', '', ''],
                ]);
                // one message for the element content and one message for the ICU
                expect(extract('<div i18n="m|d@@i">before{count, plural, =0 {text}}after</div>')).toEqual([
                    [
                        ['before', '<ph icu name="ICU">{count, plural, =0 {[text]}}</ph>', 'after'], 'm', 'd',
                        'i'
                    ],
                    [['{count, plural, =0 {[text]}}'], '', '', ''],
                ]);
            });
            it('should extract ICU messages from translatable block', function () {
                // single message when ICU is the only children
                expect(extract('<!-- i18n:m|d -->{count, plural, =0 {text}}<!-- /i18n -->')).toEqual([
                    [['{count, plural, =0 {[text]}}'], 'm', 'd', ''],
                ]);
                // one message for the block content and one message for the ICU
                expect(extract('<!-- i18n:m|d -->before{count, plural, =0 {text}}after<!-- /i18n -->'))
                    .toEqual([
                    [['{count, plural, =0 {[text]}}'], '', '', ''],
                    [
                        ['before', '<ph icu name="ICU">{count, plural, =0 {[text]}}</ph>', 'after'], 'm',
                        'd', ''
                    ],
                ]);
            });
            it('should not extract ICU messages outside of i18n sections', function () { expect(extract('{count, plural, =0 {text}}')).toEqual([]); });
            it('should ignore nested ICU messages', function () {
                expect(extract('<div i18n="m|d">{count, plural, =0 { {sex, select, male {m}} }}</div>'))
                    .toEqual([
                    [['{count, plural, =0 {[{sex, select, male {[m]}},  ]}}'], 'm', 'd', ''],
                ]);
            });
            it('should ignore implicit elements in non translatable ICU messages', function () {
                expect(extract('<div i18n="m|d@@i">{count, plural, =0 { {sex, select, male {<p>ignore</p>}}' +
                    ' }}</div>', ['p']))
                    .toEqual([[
                        [
                            '{count, plural, =0 {[{sex, select, male {[<ph tag name="START_PARAGRAPH">ignore</ph name="CLOSE_PARAGRAPH">]}},  ]}}'
                        ],
                        'm', 'd', 'i'
                    ]]);
            });
            it('should ignore implicit elements in non translatable ICU messages', function () {
                expect(extract('{count, plural, =0 { {sex, select, male {<p>ignore</p>}} }}', ['p']))
                    .toEqual([]);
            });
        });
        describe('attributes', function () {
            it('should extract from attributes outside of translatable sections', function () {
                expect(extract('<div i18n-title="m|d@@i" title="msg"></div>')).toEqual([
                    [['msg'], 'm', 'd', 'i'],
                ]);
            });
            it('should extract from attributes in translatable elements', function () {
                expect(extract('<div i18n><p><b i18n-title="m|d@@i" title="msg"></b></p></div>')).toEqual([
                    [
                        ['<ph tag name="START_PARAGRAPH"><ph tag name="START_BOLD_TEXT"></ph' +
                                ' name="CLOSE_BOLD_TEXT"></ph name="CLOSE_PARAGRAPH">'],
                        '', '', ''
                    ],
                    [['msg'], 'm', 'd', 'i'],
                ]);
            });
            it('should extract from attributes in translatable blocks', function () {
                expect(extract('<!-- i18n --><p><b i18n-title="m|d" title="msg"></b></p><!-- /i18n -->'))
                    .toEqual([
                    [['msg'], 'm', 'd', ''],
                    [
                        ['<ph tag name="START_PARAGRAPH"><ph tag name="START_BOLD_TEXT"></ph' +
                                ' name="CLOSE_BOLD_TEXT"></ph name="CLOSE_PARAGRAPH">'],
                        '', '', ''
                    ],
                ]);
            });
            it('should extract from attributes in translatable ICUs', function () {
                expect(extract("<!-- i18n -->{count, plural, =0 {<p><b i18n-title=\"m|d@@i\"\n                 title=\"msg\"></b></p>}}<!-- /i18n -->"))
                    .toEqual([
                    [['msg'], 'm', 'd', 'i'],
                    [
                        [
                            '{count, plural, =0 {[<ph tag name="START_PARAGRAPH"><ph tag' +
                                ' name="START_BOLD_TEXT"></ph name="CLOSE_BOLD_TEXT"></ph name="CLOSE_PARAGRAPH">]}}'
                        ],
                        '', '', ''
                    ],
                ]);
            });
            it('should extract from attributes in non translatable ICUs', function () {
                expect(extract('{count, plural, =0 {<p><b i18n-title="m|d" title="msg"></b></p>}}'))
                    .toEqual([
                    [['msg'], 'm', 'd', ''],
                ]);
            });
            it('should not create a message for empty attributes', function () { expect(extract('<div i18n-title="m|d" title></div>')).toEqual([]); });
        });
        describe('implicit elements', function () {
            it('should extract from implicit elements', function () {
                expect(extract('<b>bold</b><i>italic</i>', ['b'])).toEqual([
                    [['bold'], '', '', ''],
                ]);
            });
            it('should allow nested implicit elements', function () {
                var result = undefined;
                expect(function () {
                    result = extract('<div>outer<div>inner</div></div>', ['div']);
                }).not.toThrow();
                expect(result).toEqual([
                    [['outer', '<ph tag name="START_TAG_DIV">inner</ph name="CLOSE_TAG_DIV">'], '', '', ''],
                ]);
            });
        });
        describe('implicit attributes', function () {
            it('should extract implicit attributes', function () {
                expect(extract('<b title="bb">bold</b><i title="ii">italic</i>', [], { 'b': ['title'] }))
                    .toEqual([
                    [['bb'], '', '', ''],
                ]);
            });
        });
        describe('errors', function () {
            describe('elements', function () {
                it('should report nested translatable elements', function () {
                    expect(extractErrors("<p i18n><b i18n></b></p>")).toEqual([
                        ['Could not mark an element as translatable inside a translatable section', '<b i18n>'],
                    ]);
                });
                it('should report translatable elements in implicit elements', function () {
                    expect(extractErrors("<p><b i18n></b></p>", ['p'])).toEqual([
                        ['Could not mark an element as translatable inside a translatable section', '<b i18n>'],
                    ]);
                });
                it('should report translatable elements in translatable blocks', function () {
                    expect(extractErrors("<!-- i18n --><b i18n></b><!-- /i18n -->")).toEqual([
                        ['Could not mark an element as translatable inside a translatable section', '<b i18n>'],
                    ]);
                });
            });
            describe('blocks', function () {
                it('should report nested blocks', function () {
                    expect(extractErrors("<!-- i18n --><!-- i18n --><!-- /i18n --><!-- /i18n -->")).toEqual([
                        ['Could not start a block inside a translatable section', '<!--'],
                        ['Trying to close an unopened block', '<!--'],
                    ]);
                });
                it('should report unclosed blocks', function () {
                    expect(extractErrors("<!-- i18n -->")).toEqual([
                        ['Unclosed block', '<!--'],
                    ]);
                });
                it('should report translatable blocks in translatable elements', function () {
                    expect(extractErrors("<p i18n><!-- i18n --><!-- /i18n --></p>")).toEqual([
                        ['Could not start a block inside a translatable section', '<!--'],
                        ['Trying to close an unopened block', '<!--'],
                    ]);
                });
                it('should report translatable blocks in implicit elements', function () {
                    expect(extractErrors("<p><!-- i18n --><!-- /i18n --></p>", ['p'])).toEqual([
                        ['Could not start a block inside a translatable section', '<!--'],
                        ['Trying to close an unopened block', '<!--'],
                    ]);
                });
                it('should report when start and end of a block are not at the same level', function () {
                    expect(extractErrors("<!-- i18n --><p><!-- /i18n --></p>")).toEqual([
                        ['I18N blocks should not cross element boundaries', '<!--'],
                        ['Unclosed block', '<p>'],
                    ]);
                    expect(extractErrors("<p><!-- i18n --></p><!-- /i18n -->")).toEqual([
                        ['I18N blocks should not cross element boundaries', '<!--'],
                        ['Unclosed block', '<!--'],
                    ]);
                });
            });
        });
    });
    describe('Merger', function () {
        describe('elements', function () {
            it('should merge elements', function () {
                var HTML = "<p i18n=\"m|d\">foo</p>";
                expect(fakeTranslate(HTML)).toEqual('<p>**foo**</p>');
            });
            it('should merge nested elements', function () {
                var HTML = "<div>before<p i18n=\"m|d\">foo</p><!-- comment --></div>";
                expect(fakeTranslate(HTML)).toEqual('<div>before<p>**foo**</p></div>');
            });
            it('should merge empty messages', function () {
                var HTML = "<div i18n>some element</div>";
                var htmlNodes = parseHtml(HTML);
                var messages = extractor_merger_1.extractMessages(htmlNodes, compiler_1.DEFAULT_INTERPOLATION_CONFIG, [], {}).messages;
                expect(messages.length).toEqual(1);
                var i18nMsgMap = {};
                i18nMsgMap[digest_1.digest(messages[0])] = [];
                var translations = new translation_bundle_1.TranslationBundle(i18nMsgMap, null, digest_1.digest);
                var output = extractor_merger_1.mergeTranslations(htmlNodes, translations, compiler_1.DEFAULT_INTERPOLATION_CONFIG, [], {});
                expect(output.errors).toEqual([]);
                expect(ast_serializer_spec_1.serializeNodes(output.rootNodes).join('')).toEqual("<div></div>");
            });
        });
        describe('blocks', function () {
            it('should console.warn if we use i18n comments', function () {
                // TODO(ocombe): expect a warning message when we have a proper log service
                extract('<!-- i18n --><p><b i18n-title="m|d" title="msg"></b></p><!-- /i18n -->');
            });
            it('should merge blocks', function () {
                var HTML = "before<!-- i18n --><p>foo</p><span><i>bar</i></span><!-- /i18n -->after";
                expect(fakeTranslate(HTML))
                    .toEqual('before**[ph tag name="START_PARAGRAPH">foo[/ph name="CLOSE_PARAGRAPH">[ph tag' +
                    ' name="START_TAG_SPAN">[ph tag name="START_ITALIC_TEXT">bar[/ph' +
                    ' name="CLOSE_ITALIC_TEXT">[/ph name="CLOSE_TAG_SPAN">**after');
            });
            it('should merge nested blocks', function () {
                var HTML = "<div>before<!-- i18n --><p>foo</p><span><i>bar</i></span><!-- /i18n -->after</div>";
                expect(fakeTranslate(HTML))
                    .toEqual('<div>before**[ph tag name="START_PARAGRAPH">foo[/ph name="CLOSE_PARAGRAPH">[ph' +
                    ' tag name="START_TAG_SPAN">[ph tag name="START_ITALIC_TEXT">bar[/ph' +
                    ' name="CLOSE_ITALIC_TEXT">[/ph name="CLOSE_TAG_SPAN">**after</div>');
            });
        });
        describe('attributes', function () {
            it('should merge attributes', function () {
                var HTML = "<p i18n-title=\"m|d\" title=\"foo\"></p>";
                expect(fakeTranslate(HTML)).toEqual('<p title="**foo**"></p>');
            });
            it('should merge attributes with ids', function () {
                var HTML = "<p i18n-title=\"@@id\" title=\"foo\"></p>";
                expect(fakeTranslate(HTML)).toEqual('<p title="**foo**"></p>');
            });
            it('should merge nested attributes', function () {
                var HTML = "<div>{count, plural, =0 {<p i18n-title title=\"foo\"></p>}}</div>";
                expect(fakeTranslate(HTML))
                    .toEqual('<div>{count, plural, =0 {<p title="**foo**"></p>}}</div>');
            });
            it('should merge attributes without values', function () {
                var HTML = "<p i18n-title=\"m|d\" title=\"\"></p>";
                expect(fakeTranslate(HTML)).toEqual('<p title=""></p>');
            });
            it('should merge empty attributes', function () {
                var HTML = "<div i18n-title title=\"some attribute\">some element</div>";
                var htmlNodes = parseHtml(HTML);
                var messages = extractor_merger_1.extractMessages(htmlNodes, compiler_1.DEFAULT_INTERPOLATION_CONFIG, [], {}).messages;
                expect(messages.length).toEqual(1);
                var i18nMsgMap = {};
                i18nMsgMap[digest_1.digest(messages[0])] = [];
                var translations = new translation_bundle_1.TranslationBundle(i18nMsgMap, null, digest_1.digest);
                var output = extractor_merger_1.mergeTranslations(htmlNodes, translations, compiler_1.DEFAULT_INTERPOLATION_CONFIG, [], {});
                expect(output.errors).toEqual([]);
                expect(ast_serializer_spec_1.serializeNodes(output.rootNodes).join(''))
                    .toEqual("<div title=\"\">some element</div>");
            });
        });
        describe('no translations', function () {
            it('should remove i18n attributes', function () {
                var HTML = "<p i18n=\"m|d\">foo</p>";
                expect(fakeNoTranslate(HTML)).toEqual('<p>foo</p>');
            });
            it('should remove i18n- attributes', function () {
                var HTML = "<p i18n-title=\"m|d\" title=\"foo\"></p>";
                expect(fakeNoTranslate(HTML)).toEqual('<p title="foo"></p>');
            });
            it('should remove i18n comment blocks', function () {
                var HTML = "before<!-- i18n --><p>foo</p><span><i>bar</i></span><!-- /i18n -->after";
                expect(fakeNoTranslate(HTML)).toEqual('before<p>foo</p><span><i>bar</i></span>after');
            });
            it('should remove nested i18n markup', function () {
                var HTML = "<!-- i18n --><span someAttr=\"ok\">foo</span><div>{count, plural, =0 {<p i18n-title title=\"foo\"></p>}}</div><!-- /i18n -->";
                expect(fakeNoTranslate(HTML))
                    .toEqual('<span someAttr="ok">foo</span><div>{count, plural, =0 {<p title="foo"></p>}}</div>');
            });
        });
    });
}
function parseHtml(html) {
    var htmlParser = new compiler_1.HtmlParser();
    var parseResult = htmlParser.parse(html, 'extractor spec', true);
    if (parseResult.errors.length > 1) {
        throw new Error("unexpected parse errors: " + parseResult.errors.join('\n'));
    }
    return parseResult.rootNodes;
}
function fakeTranslate(content, implicitTags, implicitAttrs) {
    if (implicitTags === void 0) { implicitTags = []; }
    if (implicitAttrs === void 0) { implicitAttrs = {}; }
    var htmlNodes = parseHtml(content);
    var messages = extractor_merger_1.extractMessages(htmlNodes, compiler_1.DEFAULT_INTERPOLATION_CONFIG, implicitTags, implicitAttrs)
        .messages;
    var i18nMsgMap = {};
    messages.forEach(function (message) {
        var id = digest_1.digest(message);
        var text = digest_1.serializeNodes(message.nodes).join('').replace(/</g, '[');
        i18nMsgMap[id] = [new i18n.Text("**" + text + "**", null)];
    });
    var translationBundle = new translation_bundle_1.TranslationBundle(i18nMsgMap, null, digest_1.digest);
    var output = extractor_merger_1.mergeTranslations(htmlNodes, translationBundle, compiler_1.DEFAULT_INTERPOLATION_CONFIG, implicitTags, implicitAttrs);
    expect(output.errors).toEqual([]);
    return ast_serializer_spec_1.serializeNodes(output.rootNodes).join('');
}
function fakeNoTranslate(content, implicitTags, implicitAttrs) {
    if (implicitTags === void 0) { implicitTags = []; }
    if (implicitAttrs === void 0) { implicitAttrs = {}; }
    var htmlNodes = parseHtml(content);
    var translationBundle = new translation_bundle_1.TranslationBundle({}, null, digest_1.digest, undefined, core_1.MissingTranslationStrategy.Ignore, console);
    var output = extractor_merger_1.mergeTranslations(htmlNodes, translationBundle, compiler_1.DEFAULT_INTERPOLATION_CONFIG, implicitTags, implicitAttrs);
    expect(output.errors).toEqual([]);
    return ast_serializer_spec_1.serializeNodes(output.rootNodes).join('');
}
function extract(html, implicitTags, implicitAttrs) {
    if (implicitTags === void 0) { implicitTags = []; }
    if (implicitAttrs === void 0) { implicitAttrs = {}; }
    var result = extractor_merger_1.extractMessages(parseHtml(html), compiler_1.DEFAULT_INTERPOLATION_CONFIG, implicitTags, implicitAttrs);
    if (result.errors.length > 0) {
        throw new Error("unexpected errors: " + result.errors.join('\n'));
    }
    // clang-format off
    // https://github.com/angular/clang-format/issues/35
    return result.messages.map(function (message) { return [digest_1.serializeNodes(message.nodes), message.meaning, message.description, message.id]; });
    // clang-format on
}
function extractErrors(html, implicitTags, implicitAttrs) {
    if (implicitTags === void 0) { implicitTags = []; }
    if (implicitAttrs === void 0) { implicitAttrs = {}; }
    var errors = extractor_merger_1.extractMessages(parseHtml(html), compiler_1.DEFAULT_INTERPOLATION_CONFIG, implicitTags, implicitAttrs)
        .errors;
    return errors.map(function (e) { return [e.msg, e.span.toString()]; });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdG9yX21lcmdlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9pMThuL2V4dHJhY3Rvcl9tZXJnZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDhDQUEyRTtBQUMzRSxzQ0FBeUQ7QUFFekQsZ0RBQW1GO0FBQ25GLG9FQUFtRjtBQUNuRiw4Q0FBZ0Q7QUFDaEQsd0VBQW9FO0FBRXBFLHdFQUFzRjtBQUV0RjtJQUNFLFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFDcEIsUUFBUSxDQUFDLFVBQVUsRUFBRTtZQUNuQixFQUFFLENBQUMsOEJBQThCLEVBQUU7Z0JBQ2pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsaURBQWlELENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztvQkFDekU7d0JBQ0UsQ0FBQyxNQUFNLEVBQUUsaUVBQWlFLENBQUMsRUFBRSxHQUFHLEVBQUUsS0FBSzt3QkFDdkYsRUFBRTtxQkFDSDtpQkFDRixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRTtnQkFDbkMsTUFBTSxDQUNGLE9BQU8sQ0FDSCxxRkFBcUYsQ0FBQyxDQUFDO3FCQUMxRixPQUFPLENBQUM7b0JBQ1AsQ0FBQyxDQUFDLGlFQUFpRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUM7b0JBQ3JGLENBQUMsQ0FBQyxjQUFjLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQztpQkFDbkMsQ0FBQyxDQUFDO1lBQ1QsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsd0NBQXdDLEVBQUU7Z0JBQzNDLE1BQU0sQ0FDRixPQUFPLENBQ0gsNkZBQTZGLENBQUMsQ0FBQztxQkFDbEcsT0FBTyxDQUFDO29CQUNQO3dCQUNFLENBQUMsaUVBQWlFLENB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