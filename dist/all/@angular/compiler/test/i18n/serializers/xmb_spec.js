"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var message_bundle_1 = require("@angular/compiler/src/i18n/message_bundle");
var xmb_1 = require("@angular/compiler/src/i18n/serializers/xmb");
var html_parser_1 = require("@angular/compiler/src/ml_parser/html_parser");
var interpolation_config_1 = require("@angular/compiler/src/ml_parser/interpolation_config");
{
    describe('XMB serializer', function () {
        var HTML = "\n<p>not translatable</p>\n<p i18n>translatable element <b>with placeholders</b> {{ interpolation}}</p>\n<!-- i18n -->{ count, plural, =0 {<p>test</p>}}<!-- /i18n -->\n<p i18n=\"m|d\">foo</p>\n<p i18n=\"m|d@@i\">foo</p>\n<p i18n=\"@@bar\">foo</p>\n<p i18n=\"@@baz\">{ count, plural, =0 { { sex, select, other {<p>deeply nested</p>}} }}</p>\n<p i18n>Test: { count, plural, =0 { { sex, select, other {<p>deeply nested</p>}} } =other {a lot}}</p>\n<p i18n>multi\nlines</p>";
        var XMB = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<!DOCTYPE messagebundle [\n<!ELEMENT messagebundle (msg)*>\n<!ATTLIST messagebundle class CDATA #IMPLIED>\n\n<!ELEMENT msg (#PCDATA|ph|source)*>\n<!ATTLIST msg id CDATA #IMPLIED>\n<!ATTLIST msg seq CDATA #IMPLIED>\n<!ATTLIST msg name CDATA #IMPLIED>\n<!ATTLIST msg desc CDATA #IMPLIED>\n<!ATTLIST msg meaning CDATA #IMPLIED>\n<!ATTLIST msg obsolete (obsolete) #IMPLIED>\n<!ATTLIST msg xml:space (default|preserve) \"default\">\n<!ATTLIST msg is_hidden CDATA #IMPLIED>\n\n<!ELEMENT source (#PCDATA)>\n\n<!ELEMENT ph (#PCDATA|ex)*>\n<!ATTLIST ph name CDATA #REQUIRED>\n\n<!ELEMENT ex (#PCDATA)>\n]>\n<messagebundle>\n  <msg id=\"7056919470098446707\"><source>file.ts:3</source>translatable element <ph name=\"START_BOLD_TEXT\"><ex>&lt;b&gt;</ex></ph>with placeholders<ph name=\"CLOSE_BOLD_TEXT\"><ex>&lt;/b&gt;</ex></ph> <ph name=\"INTERPOLATION\"><ex>{{ interpolation}}</ex></ph></msg>\n  <msg id=\"2981514368455622387\"><source>file.ts:4</source>{VAR_PLURAL, plural, =0 {<ph name=\"START_PARAGRAPH\"><ex>&lt;p&gt;</ex></ph>test<ph name=\"CLOSE_PARAGRAPH\"><ex>&lt;/p&gt;</ex></ph>} }</msg>\n  <msg id=\"7999024498831672133\" desc=\"d\" meaning=\"m\"><source>file.ts:5</source>foo</msg>\n  <msg id=\"i\" desc=\"d\" meaning=\"m\"><source>file.ts:6</source>foo</msg>\n  <msg id=\"bar\"><source>file.ts:7</source>foo</msg>\n  <msg id=\"baz\"><source>file.ts:8</source>{VAR_PLURAL, plural, =0 {{VAR_SELECT, select, other {<ph name=\"START_PARAGRAPH\"><ex>&lt;p&gt;</ex></ph>deeply nested<ph name=\"CLOSE_PARAGRAPH\"><ex>&lt;/p&gt;</ex></ph>} } } }</msg>\n  <msg id=\"6997386649824869937\"><source>file.ts:9</source>Test: <ph name=\"ICU\"><ex>{ count, plural, =0 {...} =other {...}}</ex></ph></msg>\n  <msg id=\"5229984852258993423\"><source>file.ts:9</source>{VAR_PLURAL, plural, =0 {{VAR_SELECT, select, other {<ph name=\"START_PARAGRAPH\"><ex>&lt;p&gt;</ex></ph>deeply nested<ph name=\"CLOSE_PARAGRAPH\"><ex>&lt;/p&gt;</ex></ph>} } } =other {a lot} }</msg>\n  <msg id=\"2340165783990709777\"><source>file.ts:10,11</source>multi\nlines</msg>\n</messagebundle>\n";
        it('should write a valid xmb file', function () {
            expect(toXmb(HTML, 'file.ts')).toEqual(XMB);
            // the locale is not specified in the xmb file
            expect(toXmb(HTML, 'file.ts', 'fr')).toEqual(XMB);
        });
        it('should throw when trying to load an xmb file', function () {
            expect(function () {
                var serializer = new xmb_1.Xmb();
                serializer.load(XMB, 'url');
            }).toThrowError(/Unsupported/);
        });
    });
}
function toXmb(html, url, locale) {
    if (locale === void 0) { locale = null; }
    var catalog = new message_bundle_1.MessageBundle(new html_parser_1.HtmlParser, [], {}, locale);
    var serializer = new xmb_1.Xmb();
    catalog.updateFromTemplate(html, url, interpolation_config_1.DEFAULT_INTERPOLATION_CONFIG);
    return catalog.write(serializer);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1iX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L2kxOG4vc2VyaWFsaXplcnMveG1iX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw0RUFBd0U7QUFDeEUsa0VBQStEO0FBQy9ELDJFQUF1RTtBQUN2RSw2RkFBa0c7QUFFbEc7SUFDRSxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsSUFBTSxJQUFJLEdBQUcsdWRBVVAsQ0FBQztRQUVQLElBQU0sR0FBRyxHQUFHLHdqRUFrQ2YsQ0FBQztRQUVFLEVBQUUsQ0FBQywrQkFBK0IsRUFBRTtZQUNsQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1Qyw4Q0FBOEM7WUFDOUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO1lBQ2pELE1BQU0sQ0FBQztnQkFDTCxJQUFNLFVBQVUsR0FBRyxJQUFJLFNBQUcsRUFBRSxDQUFDO2dCQUM3QixVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM5QixDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztDQUNKO0FBRUQsZUFBZSxJQUFZLEVBQUUsR0FBVyxFQUFFLE1BQTRCO0lBQTVCLHVCQUFBLEVBQUEsYUFBNEI7SUFDcEUsSUFBTSxPQUFPLEdBQUcsSUFBSSw4QkFBYSxDQUFDLElBQUksd0JBQVUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xFLElBQU0sVUFBVSxHQUFHLElBQUksU0FBRyxFQUFFLENBQUM7SUFFN0IsT0FBTyxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsbURBQTRCLENBQUMsQ0FBQztJQUVwRSxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbkMsQ0FBQyJ9