"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var i18n = require("../../src/i18n/i18n_ast");
var translation_bundle_1 = require("../../src/i18n/translation_bundle");
var html = require("../../src/ml_parser/ast");
var parse_util_1 = require("../../src/parse_util");
var ast_serializer_spec_1 = require("../ml_parser/ast_serializer_spec");
var i18n_parser_spec_1 = require("./i18n_parser_spec");
{
    describe('TranslationBundle', function () {
        var file = new parse_util_1.ParseSourceFile('content', 'url');
        var startLocation = new parse_util_1.ParseLocation(file, 0, 0, 0);
        var endLocation = new parse_util_1.ParseLocation(file, 0, 0, 7);
        var span = new parse_util_1.ParseSourceSpan(startLocation, endLocation);
        var srcNode = new i18n.Text('src', span);
        it('should translate a plain text', function () {
            var msgMap = { foo: [new i18n.Text('bar', null)] };
            var tb = new translation_bundle_1.TranslationBundle(msgMap, null, function (_) { return 'foo'; });
            var msg = new i18n.Message([srcNode], {}, {}, 'm', 'd', 'i');
            expect(ast_serializer_spec_1.serializeNodes(tb.get(msg))).toEqual(['bar']);
        });
        it('should translate html-like plain text', function () {
            var msgMap = { foo: [new i18n.Text('<p>bar</p>', null)] };
            var tb = new translation_bundle_1.TranslationBundle(msgMap, null, function (_) { return 'foo'; });
            var msg = new i18n.Message([srcNode], {}, {}, 'm', 'd', 'i');
            var nodes = tb.get(msg);
            expect(nodes.length).toEqual(1);
            var textNode = nodes[0];
            expect(textNode instanceof html.Text).toEqual(true);
            expect(textNode.value).toBe('<p>bar</p>');
        });
        it('should translate a message with placeholder', function () {
            var msgMap = {
                foo: [
                    new i18n.Text('bar', null),
                    new i18n.Placeholder('', 'ph1', null),
                ]
            };
            var phMap = {
                ph1: '*phContent*',
            };
            var tb = new translation_bundle_1.TranslationBundle(msgMap, null, function (_) { return 'foo'; });
            var msg = new i18n.Message([srcNode], phMap, {}, 'm', 'd', 'i');
            expect(ast_serializer_spec_1.serializeNodes(tb.get(msg))).toEqual(['bar*phContent*']);
        });
        it('should translate a message with placeholder referencing messages', function () {
            var msgMap = {
                foo: [
                    new i18n.Text('--', null),
                    new i18n.Placeholder('', 'ph1', null),
                    new i18n.Text('++', null),
                ],
                ref: [
                    new i18n.Text('*refMsg*', null),
                ],
            };
            var refMsg = new i18n.Message([srcNode], {}, {}, 'm', 'd', 'i');
            var msg = new i18n.Message([srcNode], {}, { ph1: refMsg }, 'm', 'd', 'i');
            var count = 0;
            var digest = function (_) { return count++ ? 'ref' : 'foo'; };
            var tb = new translation_bundle_1.TranslationBundle(msgMap, null, digest);
            expect(ast_serializer_spec_1.serializeNodes(tb.get(msg))).toEqual(['--*refMsg*++']);
        });
        it('should use the original message or throw when a translation is not found', function () {
            var src = "<some-tag>some text{{ some_expression }}</some-tag>{count, plural, =0 {no} few {a <b>few</b>}}";
            var messages = i18n_parser_spec_1._extractMessages("<div i18n>" + src + "</div>");
            var digest = function (_) { return "no matching id"; };
            // Empty message map -> use source messages in Ignore mode
            var tb = new translation_bundle_1.TranslationBundle({}, null, digest, null, core_1.MissingTranslationStrategy.Ignore);
            expect(ast_serializer_spec_1.serializeNodes(tb.get(messages[0])).join('')).toEqual(src);
            // Empty message map -> use source messages in Warning mode
            tb = new translation_bundle_1.TranslationBundle({}, null, digest, null, core_1.MissingTranslationStrategy.Warning);
            expect(ast_serializer_spec_1.serializeNodes(tb.get(messages[0])).join('')).toEqual(src);
            // Empty message map -> throw in Error mode
            tb = new translation_bundle_1.TranslationBundle({}, null, digest, null, core_1.MissingTranslationStrategy.Error);
            expect(function () { return ast_serializer_spec_1.serializeNodes(tb.get(messages[0])).join(''); }).toThrow();
        });
        describe('errors reporting', function () {
            it('should report unknown placeholders', function () {
                var msgMap = {
                    foo: [
                        new i18n.Text('bar', null),
                        new i18n.Placeholder('', 'ph1', span),
                    ]
                };
                var tb = new translation_bundle_1.TranslationBundle(msgMap, null, function (_) { return 'foo'; });
                var msg = new i18n.Message([srcNode], {}, {}, 'm', 'd', 'i');
                expect(function () { return tb.get(msg); }).toThrowError(/Unknown placeholder/);
            });
            it('should report missing translation', function () {
                var tb = new translation_bundle_1.TranslationBundle({}, null, function (_) { return 'foo'; }, null, core_1.MissingTranslationStrategy.Error);
                var msg = new i18n.Message([srcNode], {}, {}, 'm', 'd', 'i');
                expect(function () { return tb.get(msg); }).toThrowError(/Missing translation for message "foo"/);
            });
            it('should report missing translation with MissingTranslationStrategy.Warning', function () {
                var log = [];
                var console = {
                    log: function (msg) { throw "unexpected"; },
                    warn: function (msg) { return log.push(msg); },
                };
                var tb = new translation_bundle_1.TranslationBundle({}, 'en', function (_) { return 'foo'; }, null, core_1.MissingTranslationStrategy.Warning, console);
                var msg = new i18n.Message([srcNode], {}, {}, 'm', 'd', 'i');
                expect(function () { return tb.get(msg); }).not.toThrowError();
                expect(log.length).toEqual(1);
                expect(log[0]).toMatch(/Missing translation for message "foo" for locale "en"/);
            });
            it('should not report missing translation with MissingTranslationStrategy.Ignore', function () {
                var tb = new translation_bundle_1.TranslationBundle({}, null, function (_) { return 'foo'; }, null, core_1.MissingTranslationStrategy.Ignore);
                var msg = new i18n.Message([srcNode], {}, {}, 'm', 'd', 'i');
                expect(function () { return tb.get(msg); }).not.toThrowError();
            });
            it('should report missing referenced message', function () {
                var msgMap = {
                    foo: [new i18n.Placeholder('', 'ph1', span)],
                };
                var refMsg = new i18n.Message([srcNode], {}, {}, 'm', 'd', 'i');
                var msg = new i18n.Message([srcNode], {}, { ph1: refMsg }, 'm', 'd', 'i');
                var count = 0;
                var digest = function (_) { return count++ ? 'ref' : 'foo'; };
                var tb = new translation_bundle_1.TranslationBundle(msgMap, null, digest, null, core_1.MissingTranslationStrategy.Error);
                expect(function () { return tb.get(msg); }).toThrowError(/Missing translation for message "ref"/);
            });
            it('should report invalid translated html', function () {
                var msgMap = {
                    foo: [
                        new i18n.Text('text', null),
                        new i18n.Placeholder('', 'ph1', null),
                    ]
                };
                var phMap = {
                    ph1: '</b>',
                };
                var tb = new translation_bundle_1.TranslationBundle(msgMap, null, function (_) { return 'foo'; });
                var msg = new i18n.Message([srcNode], phMap, {}, 'm', 'd', 'i');
                expect(function () { return tb.get(msg); }).toThrowError(/Unexpected closing tag "b"/);
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRpb25fYnVuZGxlX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L2kxOG4vdHJhbnNsYXRpb25fYnVuZGxlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBeUQ7QUFFekQsOENBQWdEO0FBQ2hELHdFQUFvRTtBQUNwRSw4Q0FBZ0Q7QUFDaEQsbURBQXFGO0FBQ3JGLHdFQUFnRTtBQUVoRSx1REFBb0Q7QUFFcEQ7SUFDRSxRQUFRLENBQUMsbUJBQW1CLEVBQUU7UUFDNUIsSUFBTSxJQUFJLEdBQUcsSUFBSSw0QkFBZSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNuRCxJQUFNLGFBQWEsR0FBRyxJQUFJLDBCQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkQsSUFBTSxXQUFXLEdBQUcsSUFBSSwwQkFBYSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQU0sSUFBSSxHQUFHLElBQUksNEJBQWUsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDN0QsSUFBTSxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUUzQyxFQUFFLENBQUMsK0JBQStCLEVBQUU7WUFDbEMsSUFBTSxNQUFNLEdBQUcsRUFBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQztZQUNyRCxJQUFNLEVBQUUsR0FBRyxJQUFJLHNDQUFpQixDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsVUFBQyxDQUFDLElBQUssT0FBQSxLQUFLLEVBQUwsQ0FBSyxDQUFD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