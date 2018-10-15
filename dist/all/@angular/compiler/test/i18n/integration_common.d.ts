/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgLocalization } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
export declare class I18nComponent {
    count: number;
    sex: string;
    sexB: string;
    response: any;
}
export declare class FrLocalization extends NgLocalization {
    static PROVIDE: {
        provide: typeof NgLocalization;
        useClass: typeof FrLocalization;
        deps: never[];
    };
    getPluralCategory(value: number): string;
}
export declare function validateHtml(tb: ComponentFixture<I18nComponent>, cmp: I18nComponent, el: DebugElement): void;
export declare const HTML = "\n<div>\n    <h1 i18n>i18n attribute on tags</h1>\n\n    <div id=\"i18n-1\"><p i18n>nested</p></div>\n\n    <div id=\"i18n-2\"><p i18n=\"different meaning|\">nested</p></div>\n\n    <div id=\"i18n-3\"><p i18n><i>with placeholders</i></p></div>\n    <div id=\"i18n-3b\"><p i18n><i class=\"preserved-on-placeholders\">with placeholders</i></p></div>\n    <div id=\"i18n-3c\"><div i18n><div>with <div>nested</div> placeholders</div></div></div>\n\n    <div>\n        <p id=\"i18n-4\" i18n-title title=\"on not translatable node\" i18n-data-html data-html=\"<b>bold</b>\"></p>\n        <p id=\"i18n-5\" i18n i18n-title title=\"on translatable node\"></p>\n        <p id=\"i18n-6\" i18n-title title></p>\n    </div>\n\n    <!-- no ph below because the ICU node is the only child of the div, i.e. no text nodes -->\n    <div i18n id=\"i18n-7\">{count, plural, =0 {zero} =1 {one} =2 {two} other {<b>many</b>}}</div>\n\n    <div i18n id=\"i18n-8\">\n        {sex, select, male {m} female {f} other {other}}\n    </div>\n    <div i18n id=\"i18n-8b\">\n        {sexB, select, male {m} female {f}}\n    </div>\n\n    <div i18n id=\"i18n-9\">{{ \"count = \" + count }}</div>\n    <div i18n id=\"i18n-10\">sex = {{ sex }}</div>\n    <div i18n id=\"i18n-11\">{{ \"custom name\" //i18n(ph=\"CUSTOM_NAME\") }}</div>\n</div>\n\n<!-- i18n -->\n    <h1 id=\"i18n-12\" >Markers in html comments</h1>\n    <div id=\"i18n-13\" i18n-title title=\"in a translatable section\"></div>\n    <div id=\"i18n-14\">{count, plural, =0 {zero} =1 {one} =2 {two} other {<b>many</b>}}</div>\n<!-- /i18n -->\n\n<div id=\"i18n-15\"><ng-container i18n>it <b>should</b> work</ng-container></div>\n\n<div id=\"i18n-16\" i18n=\"@@i18n16\">with an explicit ID</div>\n<div id=\"i18n-17\" i18n=\"@@i18n17\">{count, plural, =0 {zero} =1 {one} =2 {two} other {<b>many</b>}}</div>\n\n<!-- make sure that ICU messages are not treated as text nodes -->\n<div i18n=\"desc\">{\n    response.getItemsList().length,\n    plural,\n    =0 {Found no results}\n    =1 {Found one result}\n    other {Found {{response.getItemsList().length}} results}\n}</div>\n\n<div i18n id=\"i18n-18\">foo<a i18n-title title=\"in a translatable section\">bar</a></div>\n\n<div i18n>{{ 'test' //i18n(ph=\"map name\") }}</div>\n";
