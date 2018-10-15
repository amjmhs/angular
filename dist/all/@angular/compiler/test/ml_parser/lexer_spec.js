"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var html_tags_1 = require("../../src/ml_parser/html_tags");
var lex = require("../../src/ml_parser/lexer");
var parse_util_1 = require("../../src/parse_util");
{
    describe('HtmlLexer', function () {
        describe('line/column numbers', function () {
            it('should work without newlines', function () {
                expect(tokenizeAndHumanizeLineColumn('<t>a</t>')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, '0:0'],
                    [lex.TokenType.TAG_OPEN_END, '0:2'],
                    [lex.TokenType.TEXT, '0:3'],
                    [lex.TokenType.TAG_CLOSE, '0:4'],
                    [lex.TokenType.EOF, '0:8'],
                ]);
            });
            it('should work with one newline', function () {
                expect(tokenizeAndHumanizeLineColumn('<t>\na</t>')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, '0:0'],
                    [lex.TokenType.TAG_OPEN_END, '0:2'],
                    [lex.TokenType.TEXT, '0:3'],
                    [lex.TokenType.TAG_CLOSE, '1:1'],
                    [lex.TokenType.EOF, '1:5'],
                ]);
            });
            it('should work with multiple newlines', function () {
                expect(tokenizeAndHumanizeLineColumn('<t\n>\na</t>')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, '0:0'],
                    [lex.TokenType.TAG_OPEN_END, '1:0'],
                    [lex.TokenType.TEXT, '1:1'],
                    [lex.TokenType.TAG_CLOSE, '2:1'],
                    [lex.TokenType.EOF, '2:5'],
                ]);
            });
            it('should work with CR and LF', function () {
                expect(tokenizeAndHumanizeLineColumn('<t\n>\r\na\r</t>')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, '0:0'],
                    [lex.TokenType.TAG_OPEN_END, '1:0'],
                    [lex.TokenType.TEXT, '1:1'],
                    [lex.TokenType.TAG_CLOSE, '2:1'],
                    [lex.TokenType.EOF, '2:5'],
                ]);
            });
        });
        describe('comments', function () {
            it('should parse comments', function () {
                expect(tokenizeAndHumanizeParts('<!--t\ne\rs\r\nt-->')).toEqual([
                    [lex.TokenType.COMMENT_START],
                    [lex.TokenType.RAW_TEXT, 't\ne\ns\nt'],
                    [lex.TokenType.COMMENT_END],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should store the locations', function () {
                expect(tokenizeAndHumanizeSourceSpans('<!--t\ne\rs\r\nt-->')).toEqual([
                    [lex.TokenType.COMMENT_START, '<!--'],
                    [lex.TokenType.RAW_TEXT, 't\ne\rs\r\nt'],
                    [lex.TokenType.COMMENT_END, '-->'],
                    [lex.TokenType.EOF, ''],
                ]);
            });
            it('should report <!- without -', function () {
                expect(tokenizeAndHumanizeErrors('<!-a')).toEqual([
                    [lex.TokenType.COMMENT_START, 'Unexpected character "a"', '0:3']
                ]);
            });
            it('should report missing end comment', function () {
                expect(tokenizeAndHumanizeErrors('<!--')).toEqual([
                    [lex.TokenType.RAW_TEXT, 'Unexpected character "EOF"', '0:4']
                ]);
            });
            it('should accept comments finishing by too many dashes (even number)', function () {
                expect(tokenizeAndHumanizeSourceSpans('<!-- test ---->')).toEqual([
                    [lex.TokenType.COMMENT_START, '<!--'],
                    [lex.TokenType.RAW_TEXT, ' test --'],
                    [lex.TokenType.COMMENT_END, '-->'],
                    [lex.TokenType.EOF, ''],
                ]);
            });
            it('should accept comments finishing by too many dashes (odd number)', function () {
                expect(tokenizeAndHumanizeSourceSpans('<!-- test --->')).toEqual([
                    [lex.TokenType.COMMENT_START, '<!--'],
                    [lex.TokenType.RAW_TEXT, ' test -'],
                    [lex.TokenType.COMMENT_END, '-->'],
                    [lex.TokenType.EOF, ''],
                ]);
            });
        });
        describe('doctype', function () {
            it('should parse doctypes', function () {
                expect(tokenizeAndHumanizeParts('<!doctype html>')).toEqual([
                    [lex.TokenType.DOC_TYPE, 'doctype html'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should store the locations', function () {
                expect(tokenizeAndHumanizeSourceSpans('<!doctype html>')).toEqual([
                    [lex.TokenType.DOC_TYPE, '<!doctype html>'],
                    [lex.TokenType.EOF, ''],
                ]);
            });
            it('should report missing end doctype', function () {
                expect(tokenizeAndHumanizeErrors('<!')).toEqual([
                    [lex.TokenType.DOC_TYPE, 'Unexpected character "EOF"', '0:2']
                ]);
            });
        });
        describe('CDATA', function () {
            it('should parse CDATA', function () {
                expect(tokenizeAndHumanizeParts('<![CDATA[t\ne\rs\r\nt]]>')).toEqual([
                    [lex.TokenType.CDATA_START],
                    [lex.TokenType.RAW_TEXT, 't\ne\ns\nt'],
                    [lex.TokenType.CDATA_END],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should store the locations', function () {
                expect(tokenizeAndHumanizeSourceSpans('<![CDATA[t\ne\rs\r\nt]]>')).toEqual([
                    [lex.TokenType.CDATA_START, '<![CDATA['],
                    [lex.TokenType.RAW_TEXT, 't\ne\rs\r\nt'],
                    [lex.TokenType.CDATA_END, ']]>'],
                    [lex.TokenType.EOF, ''],
                ]);
            });
            it('should report <![ without CDATA[', function () {
                expect(tokenizeAndHumanizeErrors('<![a')).toEqual([
                    [lex.TokenType.CDATA_START, 'Unexpected character "a"', '0:3']
                ]);
            });
            it('should report missing end cdata', function () {
                expect(tokenizeAndHumanizeErrors('<![CDATA[')).toEqual([
                    [lex.TokenType.RAW_TEXT, 'Unexpected character "EOF"', '0:9']
                ]);
            });
        });
        describe('open tags', function () {
            it('should parse open tags without prefix', function () {
                expect(tokenizeAndHumanizeParts('<test>')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 'test'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse namespace prefix', function () {
                expect(tokenizeAndHumanizeParts('<ns1:test>')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, 'ns1', 'test'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse void tags', function () {
                expect(tokenizeAndHumanizeParts('<test/>')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 'test'],
                    [lex.TokenType.TAG_OPEN_END_VOID],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should allow whitespace after the tag name', function () {
                expect(tokenizeAndHumanizeParts('<test >')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 'test'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should store the locations', function () {
                expect(tokenizeAndHumanizeSourceSpans('<test>')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, '<test'],
                    [lex.TokenType.TAG_OPEN_END, '>'],
                    [lex.TokenType.EOF, ''],
                ]);
            });
        });
        describe('attributes', function () {
            it('should parse attributes without prefix', function () {
                expect(tokenizeAndHumanizeParts('<t a>')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 't'],
                    [lex.TokenType.ATTR_NAME, null, 'a'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse attributes with interpolation', function () {
                expect(tokenizeAndHumanizeParts('<t a="{{v}}" b="s{{m}}e" c="s{{m//c}}e">')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 't'],
                    [lex.TokenType.ATTR_NAME, null, 'a'],
                    [lex.TokenType.ATTR_VALUE, '{{v}}'],
                    [lex.TokenType.ATTR_NAME, null, 'b'],
                    [lex.TokenType.ATTR_VALUE, 's{{m}}e'],
                    [lex.TokenType.ATTR_NAME, null, 'c'],
                    [lex.TokenType.ATTR_VALUE, 's{{m//c}}e'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse attributes with prefix', function () {
                expect(tokenizeAndHumanizeParts('<t ns1:a>')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 't'],
                    [lex.TokenType.ATTR_NAME, 'ns1', 'a'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse attributes whose prefix is not valid', function () {
                expect(tokenizeAndHumanizeParts('<t (ns1:a)>')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 't'],
                    [lex.TokenType.ATTR_NAME, null, '(ns1:a)'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse attributes with single quote value', function () {
                expect(tokenizeAndHumanizeParts('<t a=\'b\'>')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 't'],
                    [lex.TokenType.ATTR_NAME, null, 'a'],
                    [lex.TokenType.ATTR_VALUE, 'b'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse attributes with double quote value', function () {
                expect(tokenizeAndHumanizeParts('<t a="b">')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 't'],
                    [lex.TokenType.ATTR_NAME, null, 'a'],
                    [lex.TokenType.ATTR_VALUE, 'b'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse attributes with unquoted value', function () {
                expect(tokenizeAndHumanizeParts('<t a=b>')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 't'],
                    [lex.TokenType.ATTR_NAME, null, 'a'],
                    [lex.TokenType.ATTR_VALUE, 'b'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should allow whitespace', function () {
                expect(tokenizeAndHumanizeParts('<t a = b >')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 't'],
                    [lex.TokenType.ATTR_NAME, null, 'a'],
                    [lex.TokenType.ATTR_VALUE, 'b'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse attributes with entities in values', function () {
                expect(tokenizeAndHumanizeParts('<t a="&#65;&#x41;">')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 't'],
                    [lex.TokenType.ATTR_NAME, null, 'a'],
                    [lex.TokenType.ATTR_VALUE, 'AA'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should not decode entities without trailing ";"', function () {
                expect(tokenizeAndHumanizeParts('<t a="&amp" b="c&&d">')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 't'],
                    [lex.TokenType.ATTR_NAME, null, 'a'],
                    [lex.TokenType.ATTR_VALUE, '&amp'],
                    [lex.TokenType.ATTR_NAME, null, 'b'],
                    [lex.TokenType.ATTR_VALUE, 'c&&d'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse attributes with "&" in values', function () {
                expect(tokenizeAndHumanizeParts('<t a="b && c &">')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 't'],
                    [lex.TokenType.ATTR_NAME, null, 'a'],
                    [lex.TokenType.ATTR_VALUE, 'b && c &'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse values with CR and LF', function () {
                expect(tokenizeAndHumanizeParts('<t a=\'t\ne\rs\r\nt\'>')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 't'],
                    [lex.TokenType.ATTR_NAME, null, 'a'],
                    [lex.TokenType.ATTR_VALUE, 't\ne\ns\nt'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should store the locations', function () {
                expect(tokenizeAndHumanizeSourceSpans('<t a=b>')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, '<t'],
                    [lex.TokenType.ATTR_NAME, 'a'],
                    [lex.TokenType.ATTR_VALUE, 'b'],
                    [lex.TokenType.TAG_OPEN_END, '>'],
                    [lex.TokenType.EOF, ''],
                ]);
            });
        });
        describe('closing tags', function () {
            it('should parse closing tags without prefix', function () {
                expect(tokenizeAndHumanizeParts('</test>')).toEqual([
                    [lex.TokenType.TAG_CLOSE, null, 'test'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse closing tags with prefix', function () {
                expect(tokenizeAndHumanizeParts('</ns1:test>')).toEqual([
                    [lex.TokenType.TAG_CLOSE, 'ns1', 'test'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should allow whitespace', function () {
                expect(tokenizeAndHumanizeParts('</ test >')).toEqual([
                    [lex.TokenType.TAG_CLOSE, null, 'test'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should store the locations', function () {
                expect(tokenizeAndHumanizeSourceSpans('</test>')).toEqual([
                    [lex.TokenType.TAG_CLOSE, '</test>'],
                    [lex.TokenType.EOF, ''],
                ]);
            });
            it('should report missing name after </', function () {
                expect(tokenizeAndHumanizeErrors('</')).toEqual([
                    [lex.TokenType.TAG_CLOSE, 'Unexpected character "EOF"', '0:2']
                ]);
            });
            it('should report missing >', function () {
                expect(tokenizeAndHumanizeErrors('</test')).toEqual([
                    [lex.TokenType.TAG_CLOSE, 'Unexpected character "EOF"', '0:6']
                ]);
            });
        });
        describe('entities', function () {
            it('should parse named entities', function () {
                expect(tokenizeAndHumanizeParts('a&amp;b')).toEqual([
                    [lex.TokenType.TEXT, 'a&b'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse hexadecimal entities', function () {
                expect(tokenizeAndHumanizeParts('&#x41;&#X41;')).toEqual([
                    [lex.TokenType.TEXT, 'AA'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse decimal entities', function () {
                expect(tokenizeAndHumanizeParts('&#65;')).toEqual([
                    [lex.TokenType.TEXT, 'A'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should store the locations', function () {
                expect(tokenizeAndHumanizeSourceSpans('a&amp;b')).toEqual([
                    [lex.TokenType.TEXT, 'a&amp;b'],
                    [lex.TokenType.EOF, ''],
                ]);
            });
            it('should report malformed/unknown entities', function () {
                expect(tokenizeAndHumanizeErrors('&tbo;')).toEqual([[
                        lex.TokenType.TEXT,
                        'Unknown entity "tbo" - use the "&#<decimal>;" or  "&#x<hex>;" syntax', '0:0'
                    ]]);
                expect(tokenizeAndHumanizeErrors('&#asdf;')).toEqual([
                    [lex.TokenType.TEXT, 'Unexpected character "s"', '0:3']
                ]);
                expect(tokenizeAndHumanizeErrors('&#xasdf;')).toEqual([
                    [lex.TokenType.TEXT, 'Unexpected character "s"', '0:4']
                ]);
                expect(tokenizeAndHumanizeErrors('&#xABC')).toEqual([
                    [lex.TokenType.TEXT, 'Unexpected character "EOF"', '0:6']
                ]);
            });
        });
        describe('regular text', function () {
            it('should parse text', function () {
                expect(tokenizeAndHumanizeParts('a')).toEqual([
                    [lex.TokenType.TEXT, 'a'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse interpolation', function () {
                expect(tokenizeAndHumanizeParts('{{ a }}b{{ c // comment }}')).toEqual([
                    [lex.TokenType.TEXT, '{{ a }}b{{ c // comment }}'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse interpolation with custom markers', function () {
                expect(tokenizeAndHumanizeParts('{% a %}', null, { start: '{%', end: '%}' })).toEqual([
                    [lex.TokenType.TEXT, '{% a %}'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should handle CR & LF', function () {
                expect(tokenizeAndHumanizeParts('t\ne\rs\r\nt')).toEqual([
                    [lex.TokenType.TEXT, 't\ne\ns\nt'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse entities', function () {
                expect(tokenizeAndHumanizeParts('a&amp;b')).toEqual([
                    [lex.TokenType.TEXT, 'a&b'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse text starting with "&"', function () {
                expect(tokenizeAndHumanizeParts('a && b &')).toEqual([
                    [lex.TokenType.TEXT, 'a && b &'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should store the locations', function () {
                expect(tokenizeAndHumanizeSourceSpans('a')).toEqual([
                    [lex.TokenType.TEXT, 'a'],
                    [lex.TokenType.EOF, ''],
                ]);
            });
            it('should allow "<" in text nodes', function () {
                expect(tokenizeAndHumanizeParts('{{ a < b ? c : d }}')).toEqual([
                    [lex.TokenType.TEXT, '{{ a < b ? c : d }}'],
                    [lex.TokenType.EOF],
                ]);
                expect(tokenizeAndHumanizeSourceSpans('<p>a<b</p>')).toEqual([
                    [lex.TokenType.TAG_OPEN_START, '<p'],
                    [lex.TokenType.TAG_OPEN_END, '>'],
                    [lex.TokenType.TEXT, 'a<b'],
                    [lex.TokenType.TAG_CLOSE, '</p>'],
                    [lex.TokenType.EOF, ''],
                ]);
                expect(tokenizeAndHumanizeParts('< a>')).toEqual([
                    [lex.TokenType.TEXT, '< a>'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse valid start tag in interpolation', function () {
                expect(tokenizeAndHumanizeParts('{{ a <b && c > d }}')).toEqual([
                    [lex.TokenType.TEXT, '{{ a '],
                    [lex.TokenType.TAG_OPEN_START, null, 'b'],
                    [lex.TokenType.ATTR_NAME, null, '&&'],
                    [lex.TokenType.ATTR_NAME, null, 'c'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.TEXT, ' d }}'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should be able to escape {', function () {
                expect(tokenizeAndHumanizeParts('{{ "{" }}')).toEqual([
                    [lex.TokenType.TEXT, '{{ "{" }}'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should be able to escape {{', function () {
                expect(tokenizeAndHumanizeParts('{{ "{{" }}')).toEqual([
                    [lex.TokenType.TEXT, '{{ "{{" }}'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should treat expansion form as text when they are not parsed', function () {
                expect(tokenizeAndHumanizeParts('<span>{a, b, =4 {c}}</span>', false)).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 'span'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.TEXT, '{a, b, =4 {c}}'],
                    [lex.TokenType.TAG_CLOSE, null, 'span'],
                    [lex.TokenType.EOF],
                ]);
            });
        });
        describe('raw text', function () {
            it('should parse text', function () {
                expect(tokenizeAndHumanizeParts("<script>t\ne\rs\r\nt</script>")).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 'script'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.RAW_TEXT, 't\ne\ns\nt'],
                    [lex.TokenType.TAG_CLOSE, null, 'script'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should not detect entities', function () {
                expect(tokenizeAndHumanizeParts("<script>&amp;</SCRIPT>")).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 'script'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.RAW_TEXT, '&amp;'],
                    [lex.TokenType.TAG_CLOSE, null, 'script'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should ignore other opening tags', function () {
                expect(tokenizeAndHumanizeParts("<script>a<div></script>")).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 'script'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.RAW_TEXT, 'a<div>'],
                    [lex.TokenType.TAG_CLOSE, null, 'script'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should ignore other closing tags', function () {
                expect(tokenizeAndHumanizeParts("<script>a</test></script>")).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 'script'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.RAW_TEXT, 'a</test>'],
                    [lex.TokenType.TAG_CLOSE, null, 'script'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should store the locations', function () {
                expect(tokenizeAndHumanizeSourceSpans("<script>a</script>")).toEqual([
                    [lex.TokenType.TAG_OPEN_START, '<script'],
                    [lex.TokenType.TAG_OPEN_END, '>'],
                    [lex.TokenType.RAW_TEXT, 'a'],
                    [lex.TokenType.TAG_CLOSE, '</script>'],
                    [lex.TokenType.EOF, ''],
                ]);
            });
        });
        describe('escapable raw text', function () {
            it('should parse text', function () {
                expect(tokenizeAndHumanizeParts("<title>t\ne\rs\r\nt</title>")).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 'title'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.ESCAPABLE_RAW_TEXT, 't\ne\ns\nt'],
                    [lex.TokenType.TAG_CLOSE, null, 'title'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should detect entities', function () {
                expect(tokenizeAndHumanizeParts("<title>&amp;</title>")).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 'title'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.ESCAPABLE_RAW_TEXT, '&'],
                    [lex.TokenType.TAG_CLOSE, null, 'title'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should ignore other opening tags', function () {
                expect(tokenizeAndHumanizeParts("<title>a<div></title>")).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 'title'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.ESCAPABLE_RAW_TEXT, 'a<div>'],
                    [lex.TokenType.TAG_CLOSE, null, 'title'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should ignore other closing tags', function () {
                expect(tokenizeAndHumanizeParts("<title>a</test></title>")).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 'title'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.ESCAPABLE_RAW_TEXT, 'a</test>'],
                    [lex.TokenType.TAG_CLOSE, null, 'title'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should store the locations', function () {
                expect(tokenizeAndHumanizeSourceSpans("<title>a</title>")).toEqual([
                    [lex.TokenType.TAG_OPEN_START, '<title'],
                    [lex.TokenType.TAG_OPEN_END, '>'],
                    [lex.TokenType.ESCAPABLE_RAW_TEXT, 'a'],
                    [lex.TokenType.TAG_CLOSE, '</title>'],
                    [lex.TokenType.EOF, ''],
                ]);
            });
        });
        describe('expansion forms', function () {
            it('should parse an expansion form', function () {
                expect(tokenizeAndHumanizeParts('{one.two, three, =4 {four} =5 {five} foo {bar} }', true))
                    .toEqual([
                    [lex.TokenType.EXPANSION_FORM_START],
                    [lex.TokenType.RAW_TEXT, 'one.two'],
                    [lex.TokenType.RAW_TEXT, 'three'],
                    [lex.TokenType.EXPANSION_CASE_VALUE, '=4'],
                    [lex.TokenType.EXPANSION_CASE_EXP_START],
                    [lex.TokenType.TEXT, 'four'],
                    [lex.TokenType.EXPANSION_CASE_EXP_END],
                    [lex.TokenType.EXPANSION_CASE_VALUE, '=5'],
                    [lex.TokenType.EXPANSION_CASE_EXP_START],
                    [lex.TokenType.TEXT, 'five'],
                    [lex.TokenType.EXPANSION_CASE_EXP_END],
                    [lex.TokenType.EXPANSION_CASE_VALUE, 'foo'],
                    [lex.TokenType.EXPANSION_CASE_EXP_START],
                    [lex.TokenType.TEXT, 'bar'],
                    [lex.TokenType.EXPANSION_CASE_EXP_END],
                    [lex.TokenType.EXPANSION_FORM_END],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse an expansion form with text elements surrounding it', function () {
                expect(tokenizeAndHumanizeParts('before{one.two, three, =4 {four}}after', true)).toEqual([
                    [lex.TokenType.TEXT, 'before'],
                    [lex.TokenType.EXPANSION_FORM_START],
                    [lex.TokenType.RAW_TEXT, 'one.two'],
                    [lex.TokenType.RAW_TEXT, 'three'],
                    [lex.TokenType.EXPANSION_CASE_VALUE, '=4'],
                    [lex.TokenType.EXPANSION_CASE_EXP_START],
                    [lex.TokenType.TEXT, 'four'],
                    [lex.TokenType.EXPANSION_CASE_EXP_END],
                    [lex.TokenType.EXPANSION_FORM_END],
                    [lex.TokenType.TEXT, 'after'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse an expansion form as a tag single child', function () {
                expect(tokenizeAndHumanizeParts('<div><span>{a, b, =4 {c}}</span></div>', true)).toEqual([
                    [lex.TokenType.TAG_OPEN_START, null, 'div'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.TAG_OPEN_START, null, 'span'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.EXPANSION_FORM_START],
                    [lex.TokenType.RAW_TEXT, 'a'],
                    [lex.TokenType.RAW_TEXT, 'b'],
                    [lex.TokenType.EXPANSION_CASE_VALUE, '=4'],
                    [lex.TokenType.EXPANSION_CASE_EXP_START],
                    [lex.TokenType.TEXT, 'c'],
                    [lex.TokenType.EXPANSION_CASE_EXP_END],
                    [lex.TokenType.EXPANSION_FORM_END],
                    [lex.TokenType.TAG_CLOSE, null, 'span'],
                    [lex.TokenType.TAG_CLOSE, null, 'div'],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse an expansion forms with elements in it', function () {
                expect(tokenizeAndHumanizeParts('{one.two, three, =4 {four <b>a</b>}}', true)).toEqual([
                    [lex.TokenType.EXPANSION_FORM_START],
                    [lex.TokenType.RAW_TEXT, 'one.two'],
                    [lex.TokenType.RAW_TEXT, 'three'],
                    [lex.TokenType.EXPANSION_CASE_VALUE, '=4'],
                    [lex.TokenType.EXPANSION_CASE_EXP_START],
                    [lex.TokenType.TEXT, 'four '],
                    [lex.TokenType.TAG_OPEN_START, null, 'b'],
                    [lex.TokenType.TAG_OPEN_END],
                    [lex.TokenType.TEXT, 'a'],
                    [lex.TokenType.TAG_CLOSE, null, 'b'],
                    [lex.TokenType.EXPANSION_CASE_EXP_END],
                    [lex.TokenType.EXPANSION_FORM_END],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse an expansion forms containing an interpolation', function () {
                expect(tokenizeAndHumanizeParts('{one.two, three, =4 {four {{a}}}}', true)).toEqual([
                    [lex.TokenType.EXPANSION_FORM_START],
                    [lex.TokenType.RAW_TEXT, 'one.two'],
                    [lex.TokenType.RAW_TEXT, 'three'],
                    [lex.TokenType.EXPANSION_CASE_VALUE, '=4'],
                    [lex.TokenType.EXPANSION_CASE_EXP_START],
                    [lex.TokenType.TEXT, 'four {{a}}'],
                    [lex.TokenType.EXPANSION_CASE_EXP_END],
                    [lex.TokenType.EXPANSION_FORM_END],
                    [lex.TokenType.EOF],
                ]);
            });
            it('should parse nested expansion forms', function () {
                expect(tokenizeAndHumanizeParts("{one.two, three, =4 { {xx, yy, =x {one}} }}", true))
                    .toEqual([
                    [lex.TokenType.EXPANSION_FORM_START],
                    [lex.TokenType.RAW_TEXT, 'one.two'],
                    [lex.TokenType.RAW_TEXT, 'three'],
                    [lex.TokenType.EXPANSION_CASE_VALUE, '=4'],
                    [lex.TokenType.EXPANSION_CASE_EXP_START],
                    [lex.TokenType.EXPANSION_FORM_START],
                    [lex.TokenType.RAW_TEXT, 'xx'],
                    [lex.TokenType.RAW_TEXT, 'yy'],
                    [lex.TokenType.EXPANSION_CASE_VALUE, '=x'],
                    [lex.TokenType.EXPANSION_CASE_EXP_START],
                    [lex.TokenType.TEXT, 'one'],
                    [lex.TokenType.EXPANSION_CASE_EXP_END],
                    [lex.TokenType.EXPANSION_FORM_END],
                    [lex.TokenType.TEXT, ' '],
                    [lex.TokenType.EXPANSION_CASE_EXP_END],
                    [lex.TokenType.EXPANSION_FORM_END],
                    [lex.TokenType.EOF],
                ]);
            });
        });
        describe('errors', function () {
            it('should report unescaped "{" on error', function () {
                expect(tokenizeAndHumanizeErrors("<p>before { after</p>", true)).toEqual([[
                        lex.TokenType.RAW_TEXT,
                        "Unexpected character \"EOF\" (Do you have an unescaped \"{\" in your template? Use \"{{ '{' }}\") to escape it.)",
                        '0:21',
                    ]]);
            });
            it('should include 2 lines of context in message', function () {
                var src = '111\n222\n333\nE\n444\n555\n666\n';
                var file = new parse_util_1.ParseSourceFile(src, 'file://');
                var location = new parse_util_1.ParseLocation(file, 12, 123, 456);
                var span = new parse_util_1.ParseSourceSpan(location, location);
                var error = new lex.TokenError('**ERROR**', null, span);
                expect(error.toString())
                    .toEqual("**ERROR** (\"\n222\n333\n[ERROR ->]E\n444\n555\n\"): file://@123:456");
            });
        });
        describe('unicode characters', function () {
            it('should support unicode characters', function () {
                expect(tokenizeAndHumanizeSourceSpans("<p>\u0130</p>")).toEqual([
                    [lex.TokenType.TAG_OPEN_START, '<p'],
                    [lex.TokenType.TAG_OPEN_END, '>'],
                    [lex.TokenType.TEXT, 'İ'],
                    [lex.TokenType.TAG_CLOSE, '</p>'],
                    [lex.TokenType.EOF, ''],
                ]);
            });
        });
    });
}
function tokenizeWithoutErrors(input, tokenizeExpansionForms, interpolationConfig) {
    if (tokenizeExpansionForms === void 0) { tokenizeExpansionForms = false; }
    var tokenizeResult = lex.tokenize(input, 'someUrl', html_tags_1.getHtmlTagDefinition, tokenizeExpansionForms, interpolationConfig);
    if (tokenizeResult.errors.length > 0) {
        var errorString = tokenizeResult.errors.join('\n');
        throw new Error("Unexpected parse errors:\n" + errorString);
    }
    return tokenizeResult.tokens;
}
function tokenizeAndHumanizeParts(input, tokenizeExpansionForms, interpolationConfig) {
    if (tokenizeExpansionForms === void 0) { tokenizeExpansionForms = false; }
    return tokenizeWithoutErrors(input, tokenizeExpansionForms, interpolationConfig)
        .map(function (token) { return [token.type].concat(token.parts); });
}
function tokenizeAndHumanizeSourceSpans(input) {
    return tokenizeWithoutErrors(input).map(function (token) { return [token.type, token.sourceSpan.toString()]; });
}
function humanizeLineColumn(location) {
    return location.line + ":" + location.col;
}
function tokenizeAndHumanizeLineColumn(input) {
    return tokenizeWithoutErrors(input).map(function (token) { return [token.type, humanizeLineColumn(token.sourceSpan.start)]; });
}
function tokenizeAndHumanizeErrors(input, tokenizeExpansionForms) {
    if (tokenizeExpansionForms === void 0) { tokenizeExpansionForms = false; }
    return lex.tokenize(input, 'someUrl', html_tags_1.getHtmlTagDefinition, tokenizeExpansionForms)
        .errors.map(function (e) { return [e.tokenType, e.msg, humanizeLineColumn(e.span.start)]; });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV4ZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvbWxfcGFyc2VyL2xleGVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwyREFBbUU7QUFFbkUsK0NBQWlEO0FBQ2pELG1EQUFxRjtBQUVyRjtJQUNFLFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFDcEIsUUFBUSxDQUFDLHFCQUFxQixFQUFFO1lBQzlCLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRTtnQkFDakMsTUFBTSxDQUFDLDZCQUE2QixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO29CQUN4RCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQztvQkFDckMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUM7b0JBQ25DLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO29CQUMzQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQztvQkFDaEMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUM7aUJBQzNCLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDhCQUE4QixFQUFFO2dCQUNqQyxNQUFNLENBQUMsNkJBQTZCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQzFELENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDO29CQUNyQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQztvQkFDbkMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7b0JBQzNC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