"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@angular/compiler/src/util");
var digest_1 = require("../../../src/i18n/digest");
var xtb_1 = require("../../../src/i18n/serializers/xtb");
{
    describe('XTB serializer', function () {
        var serializer = new xtb_1.Xtb();
        function loadAsMap(xtb) {
            var i18nNodesByMsgId = serializer.load(xtb, 'url').i18nNodesByMsgId;
            var msgMap = {};
            Object.keys(i18nNodesByMsgId).forEach(function (id) {
                msgMap[id] = digest_1.serializeNodes(i18nNodesByMsgId[id]).join('');
            });
            return msgMap;
        }
        describe('load', function () {
            it('should load XTB files with a doctype', function () {
                var XTB = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE translationbundle [<!ELEMENT translationbundle (translation)*>\n<!ATTLIST translationbundle lang CDATA #REQUIRED>\n\n<!ELEMENT translation (#PCDATA|ph)*>\n<!ATTLIST translation id CDATA #REQUIRED>\n\n<!ELEMENT ph EMPTY>\n<!ATTLIST ph name CDATA #REQUIRED>\n]>\n<translationbundle>\n  <translation id=\"8841459487341224498\">rab</translation>\n</translationbundle>";
                expect(loadAsMap(XTB)).toEqual({ '8841459487341224498': 'rab' });
            });
            it('should load XTB files without placeholders', function () {
                var XTB = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<translationbundle>\n  <translation id=\"8841459487341224498\">rab</translation>\n</translationbundle>";
                expect(loadAsMap(XTB)).toEqual({ '8841459487341224498': 'rab' });
            });
            it('should return the target locale', function () {
                var XTB = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<translationbundle lang='fr'>\n  <translation id=\"8841459487341224498\">rab</translation>\n</translationbundle>";
                expect(serializer.load(XTB, 'url').locale).toEqual('fr');
            });
            it('should load XTB files with placeholders', function () {
                var XTB = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<translationbundle>\n  <translation id=\"8877975308926375834\"><ph name=\"START_PARAGRAPH\"/>rab<ph name=\"CLOSE_PARAGRAPH\"/></translation>\n</translationbundle>";
                expect(loadAsMap(XTB)).toEqual({
                    '8877975308926375834': '<ph name="START_PARAGRAPH"/>rab<ph name="CLOSE_PARAGRAPH"/>'
                });
            });
            it('should replace ICU placeholders with their translations', function () {
                var XTB = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<translationbundle>\n  <translation id=\"7717087045075616176\">*<ph name=\"ICU\"/>*</translation>\n  <translation id=\"5115002811911870583\">{VAR_PLURAL, plural, =1 {<ph name=\"START_PARAGRAPH\"/>rab<ph name=\"CLOSE_PARAGRAPH\"/>}}</translation>\n</translationbundle>";
                expect(loadAsMap(XTB)).toEqual({
                    '7717087045075616176': "*<ph name=\"ICU\"/>*",
                    '5115002811911870583': "{VAR_PLURAL, plural, =1 {[<ph name=\"START_PARAGRAPH\"/>, rab, <ph name=\"CLOSE_PARAGRAPH\"/>]}}",
                });
            });
            it('should load complex XTB files', function () {
                var XTB = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<translationbundle>\n  <translation id=\"8281795707202401639\"><ph name=\"INTERPOLATION\"/><ph name=\"START_BOLD_TEXT\"/>rab<ph name=\"CLOSE_BOLD_TEXT\"/> oof</translation>\n  <translation id=\"5115002811911870583\">{VAR_PLURAL, plural, =1 {<ph name=\"START_PARAGRAPH\"/>rab<ph name=\"CLOSE_PARAGRAPH\"/>}}</translation>\n  <translation id=\"130772889486467622\">oof</translation>\n  <translation id=\"4739316421648347533\">{VAR_PLURAL, plural, =1 {{VAR_GENDER, gender, male {<ph name=\"START_PARAGRAPH\"/>rab<ph name=\"CLOSE_PARAGRAPH\"/>}} }}</translation>\n</translationbundle>";
                expect(loadAsMap(XTB)).toEqual({
                    '8281795707202401639': "<ph name=\"INTERPOLATION\"/><ph name=\"START_BOLD_TEXT\"/>rab<ph name=\"CLOSE_BOLD_TEXT\"/> oof",
                    '5115002811911870583': "{VAR_PLURAL, plural, =1 {[<ph name=\"START_PARAGRAPH\"/>, rab, <ph name=\"CLOSE_PARAGRAPH\"/>]}}",
                    '130772889486467622': "oof",
                    '4739316421648347533': "{VAR_PLURAL, plural, =1 {[{VAR_GENDER, gender, male {[<ph name=\"START_PARAGRAPH\"/>, rab, <ph name=\"CLOSE_PARAGRAPH\"/>]}},  ]}}",
                });
            });
        });
        describe('errors', function () {
            it('should be able to parse non-angular xtb files without error', function () {
                var XTB = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<translationbundle>\n  <translation id=\"angular\">is great</translation>\n  <translation id=\"non angular\">is <invalid>less</invalid> {count, plural, =0 {{GREAT}}}</translation>\n</translationbundle>";
                // Invalid messages should not cause the parser to throw
                var i18nNodesByMsgId = undefined;
                expect(function () {
                    i18nNodesByMsgId = serializer.load(XTB, 'url').i18nNodesByMsgId;
                }).not.toThrow();
                expect(Object.keys(i18nNodesByMsgId).length).toEqual(2);
                expect(digest_1.serializeNodes(i18nNodesByMsgId['angular']).join('')).toEqual('is great');
                // Messages that contain unsupported feature should throw on access
                expect(function () {
                    var read = i18nNodesByMsgId['non angular'];
                }).toThrowError(/xtb parse errors/);
            });
            it('should throw on nested <translationbundle>', function () {
                var XTB = '<translationbundle><translationbundle></translationbundle></translationbundle>';
                expect(function () {
                    loadAsMap(XTB);
                }).toThrowError(/<translationbundle> elements can not be nested/);
            });
            it('should throw when a <translation> has no id attribute', function () {
                var XTB = "<translationbundle>\n  <translation></translation>\n</translationbundle>";
                expect(function () { loadAsMap(XTB); }).toThrowError(/<translation> misses the "id" attribute/);
            });
            it('should throw when a placeholder has no name attribute', function () {
                var XTB = "<translationbundle>\n  <translation id=\"1186013544048295927\"><ph /></translation>\n</translationbundle>";
                expect(function () { loadAsMap(XTB); }).toThrowError(/<ph> misses the "name" attribute/);
            });
            it('should throw on unknown xtb tags', function () {
                var XTB = "<what></what>";
                expect(function () {
                    loadAsMap(XTB);
                }).toThrowError(new RegExp(util_1.escapeRegExp("Unexpected tag (\"[ERROR ->]<what></what>\")")));
            });
            it('should throw on unknown message tags', function () {
                var XTB = "<translationbundle>\n  <translation id=\"1186013544048295927\"><b>msg should contain only ph tags</b></translation>\n</translationbundle>";
                expect(function () { loadAsMap(XTB); })
                    .toThrowError(new RegExp(util_1.escapeRegExp("[ERROR ->]<b>msg should contain only ph tags</b>")));
            });
            it('should throw on duplicate message id', function () {
                var XTB = "<translationbundle>\n  <translation id=\"1186013544048295927\">msg1</translation>\n  <translation id=\"1186013544048295927\">msg2</translation>\n</translationbundle>";
                expect(function () {
                    loadAsMap(XTB);
                }).toThrowError(/Duplicated translations for msg 1186013544048295927/);
            });
            it('should throw when trying to save an xtb file', function () { expect(function () { serializer.write([], null); }).toThrowError(/Unsupported/); });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieHRiX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L2kxOG4vc2VyaWFsaXplcnMveHRiX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxtREFBd0Q7QUFDeEQsbURBQXdEO0FBRXhELHlEQUFzRDtBQUd0RDtJQUNFLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QixJQUFNLFVBQVUsR0FBRyxJQUFJLFNBQUcsRUFBRSxDQUFDO1FBRTdCLG1CQUFtQixHQUFXO1lBQ3JCLElBQUEsK0RBQWdCLENBQWdDO1lBQ3ZELElBQU0sTUFBTSxHQUEyQixFQUFFLENBQUM7WUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEVBQUU7Z0JBQ3RDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyx1QkFBYyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzdELENBQUMsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQztRQUVELFFBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDZixFQUFFLENBQUMsc0NBQXNDLEVBQUU7Z0JBQ3pDLElBQU0sR0FBRyxHQUFHLG1hQVlDLENBQUM7Z0JBRWQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLHFCQUFxQixFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7WUFDakUsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsNENBQTRDLEVBQUU7Z0JBQy9DLElBQU0sR0FBRyxHQUFHLG9KQUdDLENBQUM7Z0JBRWQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLHFC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