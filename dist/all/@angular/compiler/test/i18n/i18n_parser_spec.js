"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var digest_1 = require("@angular/compiler/src/i18n/digest");
var extractor_merger_1 = require("@angular/compiler/src/i18n/extractor_merger");
var html_parser_1 = require("@angular/compiler/src/ml_parser/html_parser");
var interpolation_config_1 = require("@angular/compiler/src/ml_parser/interpolation_config");
{
    describe('I18nParser', function () {
        describe('elements', function () {
            it('should extract from elements', function () {
                expect(_humanizeMessages('<div i18n="m|d">text</div>')).toEqual([
                    [['text'], 'm', 'd'],
                ]);
            });
            it('should extract from nested elements', function () {
                expect(_humanizeMessages('<div i18n="m|d">text<span><b>nested</b></span></div>')).toEqual([
                    [
                        [
                            'text',
                            '<ph tag name="START_TAG_SPAN"><ph tag name="START_BOLD_TEXT">nested</ph name="CLOSE_BOLD_TEXT"></ph name="CLOSE_TAG_SPAN">'
                        ],
                        'm', 'd'
                    ],
                ]);
            });
            it('should not create a message for empty elements', function () { expect(_humanizeMessages('<div i18n="m|d"></div>')).toEqual([]); });
            it('should not create a message for plain elements', function () { expect(_humanizeMessages('<div></div>')).toEqual([]); });
            it('should suppoprt void elements', function () {
                expect(_humanizeMessages('<div i18n="m|d"><p><br></p></div>')).toEqual([
                    [
                        [
                            '<ph tag name="START_PARAGRAPH"><ph tag name="LINE_BREAK"/></ph name="CLOSE_PARAGRAPH">'
                        ],
                        'm', 'd'
                    ],
                ]);
            });
        });
        describe('attributes', function () {
            it('should extract from attributes outside of translatable section', function () {
                expect(_humanizeMessages('<div i18n-title="m|d" title="msg"></div>')).toEqual([
                    [['msg'], 'm', 'd'],
                ]);
            });
            it('should extract from attributes in translatable element', function () {
                expect(_humanizeMessages('<div i18n><p><b i18n-title="m|d" title="msg"></b></p></div>'))
                    .toEqual([
                    [
                        [
                            '<ph tag name="START_PARAGRAPH"><ph tag name="START_BOLD_TEXT"></ph name="CLOSE_BOLD_TEXT"></ph name="CLOSE_PARAGRAPH">'
                        ],
                        '', ''
                    ],
                    [['msg'], 'm', 'd'],
                ]);
            });
            it('should extract from attributes in translatable block', function () {
                expect(_humanizeMessages('<!-- i18n --><p><b i18n-title="m|d" title="msg"></b></p><!-- /i18n -->'))
                    .toEqual([
                    [['msg'], 'm', 'd'],
                    [
                        [
                            '<ph tag name="START_PARAGRAPH"><ph tag name="START_BOLD_TEXT"></ph name="CLOSE_BOLD_TEXT"></ph name="CLOSE_PARAGRAPH">'
                        ],
                        '', ''
                    ],
                ]);
            });
            it('should extract from attributes in translatable ICU', function () {
                expect(_humanizeMessages('<!-- i18n -->{count, plural, =0 {<p><b i18n-title="m|d" title="msg"></b></p>}}<!-- /i18n -->'))
                    .toEqual([
                    [['msg'], 'm', 'd'],
                    [
                        [
                            '{count, plural, =0 {[<ph tag name="START_PARAGRAPH"><ph tag name="START_BOLD_TEXT"></ph name="CLOSE_BOLD_TEXT"></ph name="CLOSE_PARAGRAPH">]}}'
                        ],
                        '', ''
                    ],
                ]);
            });
            it('should extract from attributes in non translatable ICU', function () {
                expect(_humanizeMessages('{count, plural, =0 {<p><b i18n-title="m|d" title="msg"></b></p>}}'))
                    .toEqual([
                    [['msg'], 'm', 'd'],
                ]);
            });
            it('should not create a message for empty attributes', function () { expect(_humanizeMessages('<div i18n-title="m|d" title></div>')).toEqual([]); });
        });
        describe('interpolation', function () {
            it('should replace interpolation with placeholder', function () {
                expect(_humanizeMessages('<div i18n="m|d">before{{ exp }}after</div>')).toEqual([
                    [['[before, <ph name="INTERPOLATION"> exp </ph>, after]'], 'm', 'd'],
                ]);
            });
            it('should support named interpolation', function () {
                expect(_humanizeMessages('<div i18n="m|d">before{{ exp //i18n(ph="teSt") }}after</div>'))
                    .toEqual([
                    [['[before, <ph name="TEST"> exp //i18n(ph="teSt") </ph>, after]'], 'm', 'd'],
                ]);
                expect(_humanizeMessages('<div i18n=\'m|d\'>before{{ exp //i18n(ph=\'teSt\') }}after</div>'))
                    .toEqual([
                    [["[before, <ph name=\"TEST\"> exp //i18n(ph='teSt') </ph>, after]"], 'm', 'd'],
                ]);
            });
        });
        describe('blocks', function () {
            it('should extract from blocks', function () {
                expect(_humanizeMessages("<!-- i18n: meaning1|desc1 -->message1<!-- /i18n -->\n         <!-- i18n: desc2 -->message2<!-- /i18n -->\n         <!-- i18n -->message3<!-- /i18n -->"))
                    .toEqual([
                    [['message1'], 'meaning1', 'desc1'],
                    [['message2'], '', 'desc2'],
                    [['message3'], '', ''],
                ]);
            });
            it('should extract all siblings', function () {
                expect(_humanizeMessages("<!-- i18n -->text<p>html<b>nested</b></p><!-- /i18n -->")).toEqual([
                    [
                        [
                            'text',
                            '<ph tag name="START_PARAGRAPH">html, <ph tag name="START_BOLD_TEXT">nested</ph name="CLOSE_BOLD_TEXT"></ph name="CLOSE_PARAGRAPH">'
                        ],
                        '', ''
                    ],
                ]);
            });
        });
        describe('ICU messages', function () {
            it('should extract as ICU when single child of an element', function () {
                expect(_humanizeMessages('<div i18n="m|d">{count, plural, =0 {zero}}</div>')).toEqual([
                    [['{count, plural, =0 {[zero]}}'], 'm', 'd'],
                ]);
            });
            it('should extract as ICU + ph when not single child of an element', function () {
                expect(_humanizeMessages('<div i18n="m|d">b{count, plural, =0 {zero}}a</div>')).toEqual([
                    [['b', '<ph icu name="ICU">{count, plural, =0 {[zero]}}</ph>', 'a'], 'm', 'd'],
                    [['{count, plural, =0 {[zero]}}'], '', ''],
                ]);
            });
            it('should extract as ICU when single child of a block', function () {
                expect(_humanizeMessages('<!-- i18n:m|d -->{count, plural, =0 {zero}}<!-- /i18n -->'))
                    .toEqual([
                    [['{count, plural, =0 {[zero]}}'], 'm', 'd'],
                ]);
            });
            it('should extract as ICU + ph when not single child of a block', function () {
                expect(_humanizeMessages('<!-- i18n:m|d -->b{count, plural, =0 {zero}}a<!-- /i18n -->'))
                    .toEqual([
                    [['{count, plural, =0 {[zero]}}'], '', ''],
                    [['b', '<ph icu name="ICU">{count, plural, =0 {[zero]}}</ph>', 'a'], 'm', 'd'],
                ]);
            });
            it('should not extract nested ICU messages', function () {
                expect(_humanizeMessages('<div i18n="m|d">b{count, plural, =0 {{sex, select, male {m}}}}a</div>'))
                    .toEqual([
                    [
                        [
                            'b', '<ph icu name="ICU">{count, plural, =0 {[{sex, select, male {[m]}}]}}</ph>',
                            'a'
                        ],
                        'm', 'd'
                    ],
                    [['{count, plural, =0 {[{sex, select, male {[m]}}]}}'], '', ''],
                ]);
            });
        });
        describe('implicit elements', function () {
            it('should extract from implicit elements', function () {
                expect(_humanizeMessages('<b>bold</b><i>italic</i>', ['b'])).toEqual([
                    [['bold'], '', ''],
                ]);
            });
        });
        describe('implicit attributes', function () {
            it('should extract implicit attributes', function () {
                expect(_humanizeMessages('<b title="bb">bold</b><i title="ii">italic</i>', [], { 'b': ['title'] }))
                    .toEqual([
                    [['bb'], '', ''],
                ]);
            });
        });
        describe('placeholders', function () {
            it('should reuse the same placeholder name for tags', function () {
                var html = '<div i18n="m|d"><p>one</p><p>two</p><p other>three</p></div>';
                expect(_humanizeMessages(html)).toEqual([
                    [
                        [
                            '<ph tag name="START_PARAGRAPH">one</ph name="CLOSE_PARAGRAPH">',
                            '<ph tag name="START_PARAGRAPH">two</ph name="CLOSE_PARAGRAPH">',
                            '<ph tag name="START_PARAGRAPH_1">three</ph name="CLOSE_PARAGRAPH">',
                        ],
                        'm', 'd'
                    ],
                ]);
                expect(_humanizePlaceholders(html)).toEqual([
                    'START_PARAGRAPH=<p>, CLOSE_PARAGRAPH=</p>, START_PARAGRAPH_1=<p other>',
                ]);
            });
            it('should reuse the same placeholder name for interpolations', function () {
                var html = '<div i18n="m|d">{{ a }}{{ a }}{{ b }}</div>';
                expect(_humanizeMessages(html)).toEqual([
                    [
                        [
                            '[<ph name="INTERPOLATION"> a </ph>, <ph name="INTERPOLATION"> a </ph>, <ph name="INTERPOLATION_1"> b </ph>]'
                        ],
                        'm', 'd'
                    ],
                ]);
                expect(_humanizePlaceholders(html)).toEqual([
                    'INTERPOLATION={{ a }}, INTERPOLATION_1={{ b }}',
                ]);
            });
            it('should reuse the same placeholder name for icu messages', function () {
                var html = '<div i18n="m|d">{count, plural, =0 {0}}{count, plural, =0 {0}}{count, plural, =1 {1}}</div>';
                expect(_humanizeMessages(html)).toEqual([
                    [
                        [
                            '<ph icu name="ICU">{count, plural, =0 {[0]}}</ph>',
                            '<ph icu name="ICU">{count, plural, =0 {[0]}}</ph>',
                            '<ph icu name="ICU_1">{count, plural, =1 {[1]}}</ph>',
                        ],
                        'm', 'd'
                    ],
                    [['{count, plural, =0 {[0]}}'], '', ''],
                    [['{count, plural, =0 {[0]}}'], '', ''],
                    [['{count, plural, =1 {[1]}}'], '', ''],
                ]);
                expect(_humanizePlaceholders(html)).toEqual([
                    '',
                    'VAR_PLURAL=count',
                    'VAR_PLURAL=count',
                    'VAR_PLURAL=count',
                ]);
                expect(_humanizePlaceholdersToMessage(html)).toEqual([
                    'ICU=f0f76923009914f1b05f41042a5c7231b9496504, ICU_1=73693d1f78d0fc882f0bcbce4cb31a0aa1995cfe',
                    '',
                    '',
                    '',
                ]);
            });
        });
    });
}
function _humanizeMessages(html, implicitTags, implicitAttrs) {
    if (implicitTags === void 0) { implicitTags = []; }
    if (implicitAttrs === void 0) { implicitAttrs = {}; }
    // clang-format off
    // https://github.com/angular/clang-format/issues/35
    return _extractMessages(html, implicitTags, implicitAttrs).map(function (message) { return [digest_1.serializeNodes(message.nodes), message.meaning, message.description,]; });
    // clang-format on
}
exports._humanizeMessages = _humanizeMessages;
function _humanizePlaceholders(html, implicitTags, implicitAttrs) {
    if (implicitTags === void 0) { implicitTags = []; }
    if (implicitAttrs === void 0) { implicitAttrs = {}; }
    // clang-format off
    // https://github.com/angular/clang-format/issues/35
    return _extractMessages(html, implicitTags, implicitAttrs).map(function (msg) { return Object.keys(msg.placeholders).map(function (name) { return name + "=" + msg.placeholders[name]; }).join(', '); });
    // clang-format on
}
function _humanizePlaceholdersToMessage(html, implicitTags, implicitAttrs) {
    if (implicitTags === void 0) { implicitTags = []; }
    if (implicitAttrs === void 0) { implicitAttrs = {}; }
    // clang-format off
    // https://github.com/angular/clang-format/issues/35
    return _extractMessages(html, implicitTags, implicitAttrs).map(function (msg) { return Object.keys(msg.placeholderToMessage).map(function (k) { return k + "=" + digest_1.digest(msg.placeholderToMessage[k]); }).join(', '); });
    // clang-format on
}
function _extractMessages(html, implicitTags, implicitAttrs) {
    if (implicitTags === void 0) { implicitTags = []; }
    if (implicitAttrs === void 0) { implicitAttrs = {}; }
    var htmlParser = new html_parser_1.HtmlParser();
    var parseResult = htmlParser.parse(html, 'extractor spec', true);
    if (parseResult.errors.length > 1) {
        throw Error("unexpected parse errors: " + parseResult.errors.join('\n'));
    }
    return extractor_merger_1.extractMessages(parseResult.rootNodes, interpolation_config_1.DEFAULT_INTERPOLATION_CONFIG, implicitTags, implicitAttrs)
        .messages;
}
exports._extractMessages = _extractMessages;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9wYXJzZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvaTE4bi9pMThuX3BhcnNlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsNERBQXlFO0FBQ3pFLGdGQUE0RTtBQUU1RSwyRUFBdUU7QUFDdkUsNkZBQWtHO0FBRWxHO0lBQ0UsUUFBUSxDQUFDLFlBQVksRUFBRTtRQUVyQixRQUFRLENBQUMsVUFBVSxFQUFFO1lBQ25CLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRTtnQkFDakMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQzlELENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO2lCQUNyQixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRTtnQkFDeEMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLHNEQUFzRCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQ3hGO3dCQUNFOzRCQUNFLE1BQU07NEJBQ04sNEhBQTRIO3lCQUM3SDt3QkFDRCxHQUFHLEVBQUUsR0FBRztxQkFDVDtpQkFDRixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxnREFBZ0QsRUFDaEQsY0FBUSxNQUFNLENBQUMsaUJBQWlCLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRS9FLEVBQUUsQ0FBQyxnREFBZ0QsRUFDaEQsY0FBUSxNQUFNLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FB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