"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var projection_1 = require("../../src/render3/interfaces/projection");
var node_selector_matcher_1 = require("../../src/render3/node_selector_matcher");
var instructions_1 = require("@angular/core/src/render3/instructions");
function testLStaticData(tagName, attrs) {
    return instructions_1.createTNode(3 /* Element */, 0, tagName, attrs, null, null);
}
describe('css selector matching', function () {
    function isMatching(tagName, attrs, selector) {
        return node_selector_matcher_1.isNodeMatchingSelector(instructions_1.createTNode(3 /* Element */, 0, tagName, attrs, null, null), selector);
    }
    describe('isNodeMatchingSimpleSelector', function () {
        describe('element matching', function () {
            it('should match element name only if names are the same', function () {
                expect(isMatching('span', null, ['span']))
                    .toBeTruthy("Selector 'span' should match <span>");
                expect(isMatching('span', null, ['div']))
                    .toBeFalsy("Selector 'div' should NOT match <span>");
            });
            /**
             * We assume that compiler will lower-case tag names both in LNode
             * and in a selector.
             */
            it('should match element name case-sensitively', function () {
                expect(isMatching('span', null, ['SPAN']))
                    .toBeFalsy("Selector 'SPAN' should NOT match <span>");
                expect(isMatching('SPAN', null, ['span']))
                    .toBeFalsy("Selector 'span' should NOT match <SPAN>'");
            });
        });
        describe('attributes matching', function () {
            // TODO: do we need to differentiate no value and empty value? that is: title vs. title="" ?
            it('should match single attribute without value', function () {
                expect(isMatching('span', ['title', ''], [
                    '', 'title', ''
                ])).toBeTruthy("Selector '[title]' should match <span title>");
                expect(isMatching('span', ['title', 'my title'], [
                    '', 'title', ''
                ])).toBeTruthy("Selector '[title]' should match <span title=\"my title\">");
                expect(isMatching('span', ['name', 'name'], [
                    '', 'title', ''
                ])).toBeFalsy("Selector '[title]' should NOT match <span name=\"name\">");
                expect(isMatching('span', null, [
                    '', 'title', ''
                ])).toBeFalsy("Selector '[title]' should NOT match <span>");
                expect(isMatching('span', ['title', ''], [
                    '', 'other', ''
                ])).toBeFalsy("Selector '[other]' should NOT match <span title=\"\">'");
            });
            it('should match namespaced attributes', function () {
                expect(isMatching('span', [0 /* NamespaceURI */, 'http://some/uri', 'title', 'name'], ['', 'title', '']));
            });
            it('should match selector with one attribute without value when element has several attributes', function () {
                expect(isMatching('span', ['id', 'my_id', 'title', 'test_title'], [
                    '', 'title', ''
                ])).toBeTruthy("Selector '[title]' should match <span id=\"my_id\" title=\"test_title\">");
            });
            it('should match single attribute with value', function () {
                expect(isMatching('span', ['title', 'My Title'], [
                    '', 'title', 'My Title'
                ])).toBeTruthy("Selector '[title=\"My Title\"]' should match <span title=\"My Title\">'");
                expect(isMatching('span', ['title', 'My Title'], [
                    '', 'title', 'Other Title'
                ])).toBeFalsy("Selector '[title=\"Other Title\"]' should NOT match <span title=\"My Title\">");
            });
            it('should not match attribute when element name does not match', function () {
                expect(isMatching('span', ['title', 'My Title'], [
                    'div', 'title', ''
                ])).toBeFalsy("Selector 'div[title]' should NOT match <span title=\"My Title\">");
                expect(isMatching('span', ['title', 'My Title'], [
                    'div', 'title', 'My Title'
                ])).toBeFalsy("Selector 'div[title=\"My Title\"]' should NOT match <span title=\"My Title\">");
            });
            it('should match multiple attributes', function () {
                // selector: '[title=title][name=name]'
                var selector = ['', 'title', 'title', 'name', 'name'];
                // <span title="title" name="name">
                expect(isMatching('span', ['title', 'title', 'name', 'name'], selector))
                    .toBeTruthy("Selector '[title=title][name=name]' should NOT match <span title=\"title\" name=\"name\">");
                // <span title="title">
                expect(isMatching('span', ['title', 'title'], selector))
                    .toBeFalsy("Selector '[title=title][name=name]' should NOT match <span title=\"title\">");
                // <span name="name">
                expect(isMatching('span', ['name', 'name'], selector))
                    .toBeFalsy("Selector '[title=title][name=name]' should NOT match <span name=\"name\">");
            });
            it('should handle attribute values that match attribute names', function () {
                // selector: [name=name]
                var selector = ['', 'name', 'name'];
                // <span title="name">
                expect(isMatching('span', ['title', 'name'], selector))
                    .toBeFalsy("Selector '[name=name]' should NOT match <span title=\"name\">");
                // <span title="name" name="name">
                expect(isMatching('span', ['title', 'name', 'name', 'name'], selector))
                    .toBeTruthy("Selector '[name=name]' should match <span title=\"name\" name=\"name\">");
            });
            /**
             * We assume that compiler will lower-case all attribute names when generating code
             */
            it('should match attribute name case-sensitively', function () {
                expect(isMatching('span', ['foo', ''], [
                    '', 'foo', ''
                ])).toBeTruthy("Selector '[foo]' should match <span foo>");
                expect(isMatching('span', ['foo', ''], [
                    '', 'Foo', ''
                ])).toBeFalsy("Selector '[Foo]' should NOT match <span foo>");
            });
            it('should match attribute values case-sensitively', function () {
                expect(isMatching('span', ['foo', 'Bar'], [
                    '', 'foo', 'Bar'
                ])).toBeTruthy("Selector '[foo=\"Bar\"]' should match <span foo=\"Bar\">");
                expect(isMatching('span', ['foo', 'Bar'], [
                    '', 'Foo', 'bar'
                ])).toBeFalsy("Selector '[Foo=\"bar\"]' should match <span foo=\"Bar\">");
            });
            it('should match class as an attribute', function () {
                expect(isMatching('span', ['class', 'foo'], [
                    '', 'class', ''
                ])).toBeTruthy("Selector '[class]' should match <span class=\"foo\">");
                expect(isMatching('span', ['class', 'foo'], [
                    '', 'class', 'foo'
                ])).toBeTruthy("Selector '[class=\"foo\"]' should match <span class=\"foo\">");
            });
            it('should take optional binding attribute names into account', function () {
                expect(isMatching('span', [1 /* SelectOnly */, 'directive'], [
                    '', 'directive', ''
                ])).toBeTruthy("Selector '[directive]' should match <span [directive]=\"exp\">");
            });
            it('should not match optional binding attribute names if attribute selector has value', function () {
                expect(isMatching('span', [1 /* SelectOnly */, 'directive'], [
                    '', 'directive', 'value'
                ])).toBeFalsy("Selector '[directive=value]' should not match <span [directive]=\"exp\">");
            });
            it('should not match optional binding attribute names if attribute selector has value and next name equals to value', function () {
                expect(isMatching('span', [1 /* SelectOnly */, 'directive', 'value'], ['', 'directive', 'value']))
                    .toBeFalsy("Selector '[directive=value]' should not match <span [directive]=\"exp\" [value]=\"otherExp\">");
            });
        });
        describe('class matching', function () {
            it('should match with a class selector when an element has multiple classes', function () {
                expect(isMatching('span', ['class', 'foo bar'], [
                    '', 8 /* CLASS */, 'foo'
                ])).toBeTruthy("Selector '.foo' should match <span class=\"foo bar\">");
                expect(isMatching('span', ['class', 'foo bar'], [
                    '', 8 /* CLASS */, 'bar'
                ])).toBeTruthy("Selector '.bar' should match <span class=\"foo bar\">");
                expect(isMatching('span', ['class', 'foo bar'], [
                    '', 8 /* CLASS */, 'baz'
                ])).toBeFalsy("Selector '.baz' should NOT match <span class=\"foo bar\">");
            });
            it('should not match on partial class name', function () {
                expect(isMatching('span', ['class', 'foobar'], [
                    '', 8 /* CLASS */, 'foo'
                ])).toBeFalsy("Selector '.foo' should NOT match <span class=\"foobar\">");
                expect(isMatching('span', ['class', 'foobar'], [
                    '', 8 /* CLASS */, 'bar'
                ])).toBeFalsy("Selector '.bar' should NOT match <span class=\"foobar\">");
                expect(isMatching('span', ['class', 'foobar'], [
                    '', 8 /* CLASS */, 'ob'
                ])).toBeFalsy("Selector '.ob' should NOT match <span class=\"foobar\">");
                expect(isMatching('span', ['class', 'foobar'], [
                    '', 8 /* CLASS */, 'foobar'
                ])).toBeTruthy("Selector '.foobar' should match <span class=\"foobar\">");
            });
            it('should support selectors with multiple classes', function () {
                expect(isMatching('span', ['class', 'foo bar'], [
                    '', 8 /* CLASS */, 'foo', 'bar'
                ])).toBeTruthy("Selector '.foo.bar' should match <span class=\"foo bar\">");
                expect(isMatching('span', ['class', 'foo'], [
                    '', 8 /* CLASS */, 'foo', 'bar'
                ])).toBeFalsy("Selector '.foo.bar' should NOT match <span class=\"foo\">");
                expect(isMatching('span', ['class', 'bar'], [
                    '', 8 /* CLASS */, 'foo', 'bar'
                ])).toBeFalsy("Selector '.foo.bar' should NOT match <span class=\"bar\">");
            });
            it('should support selectors with multiple classes regardless of class name order', function () {
                expect(isMatching('span', ['class', 'foo bar'], [
                    '', 8 /* CLASS */, 'bar', 'foo'
                ])).toBeTruthy("Selector '.bar.foo' should match <span class=\"foo bar\">");
                expect(isMatching('span', ['class', 'bar foo'], [
                    '', 8 /* CLASS */, 'foo', 'bar'
                ])).toBeTruthy("Selector '.foo.bar' should match <span class=\"bar foo\">");
                expect(isMatching('span', ['class', 'bar foo'], [
                    '', 8 /* CLASS */, 'bar', 'foo'
                ])).toBeTruthy("Selector '.bar.foo' should match <span class=\"bar foo\">");
            });
            it('should match class name case-sensitively', function () {
                expect(isMatching('span', ['class', 'Foo'], [
                    '', 8 /* CLASS */, 'Foo'
                ])).toBeTruthy("Selector '.Foo' should match <span class=\"Foo\">");
                expect(isMatching('span', ['class', 'Foo'], [
                    '', 8 /* CLASS */, 'foo'
                ])).toBeFalsy("Selector '.foo' should NOT match <span class-\"Foo\">");
            });
            it('should work without a class attribute', function () {
                // selector: '.foo'
                var selector = ['', 8 /* CLASS */, 'foo'];
                // <div title="title">
                expect(isMatching('div', ['title', 'title'], selector))
                    .toBeFalsy("Selector '.foo' should NOT match <div title=\"title\">");
                // <div>
                expect(isMatching('div', null, selector))
                    .toBeFalsy("Selector '.foo' should NOT match <div>");
            });
            it('should work with elements, attributes, and classes', function () {
                // selector: 'div.foo[title=title]'
                var selector = ['div', 'title', 'title', 8 /* CLASS */, 'foo'];
                // <div class="foo" title="title">
                expect(isMatching('div', ['class', 'foo', 'title', 'title'], selector)).toBeTruthy();
                // <div title="title">
                expect(isMatching('div', ['title', 'title'], selector)).toBeFalsy();
                // <div class="foo">
                expect(isMatching('div', ['class', 'foo'], selector)).toBeFalsy();
            });
        });
    });
    describe('negations', function () {
        it('should match when negation part is null', function () {
            expect(isMatching('span', null, ['span'])).toBeTruthy("Selector 'span' should match <span>");
        });
        it('should not match when negation part does not match', function () {
            expect(isMatching('span', ['foo', ''], [
                '', 1 /* NOT */ | 4 /* ELEMENT */, 'span'
            ])).toBeFalsy("Selector ':not(span)' should NOT match <span foo=\"\">");
            expect(isMatching('span', ['foo', ''], [
                'span', 1 /* NOT */ | 2 /* ATTRIBUTE */, 'foo', ''
            ])).toBeFalsy("Selector 'span:not([foo])' should NOT match <span foo=\"\">");
        });
        it('should not match negative selector with tag name and attributes', function () {
            // selector: ':not(span[foo])'
            var selector = ['', 1 /* NOT */ | 4 /* ELEMENT */, 'span', 'foo', ''];
            // <span foo="">
            expect(isMatching('span', ['foo', ''], selector)).toBeFalsy();
            // <span bar="">
            expect(isMatching('span', ['bar', ''], selector)).toBeTruthy();
        });
        it('should not match negative classes', function () {
            // selector: ':not(.foo.bar)'
            var selector = ['', 1 /* NOT */ | 8 /* CLASS */, 'foo', 'bar'];
            // <span class="foo bar">
            expect(isMatching('span', ['class', 'foo bar'], selector)).toBeFalsy();
            // <span class="foo">
            expect(isMatching('span', ['class', 'foo'], selector)).toBeTruthy();
            // <span class="bar">
            expect(isMatching('span', ['class', 'bar'], selector)).toBeTruthy();
        });
        it('should not match negative selector with classes and attributes', function () {
            // selector: ':not(.baz[title])
            var selector = [
                '', 1 /* NOT */ | 2 /* ATTRIBUTE */, 'title', '', 8 /* CLASS */, 'baz'
            ];
            // <div class="baz">
            expect(isMatching('div', ['class', 'baz'], selector)).toBeTruthy();
            // <div title="title">
            expect(isMatching('div', ['title', 'title'], selector)).toBeTruthy();
            // <div class="baz" title="title">
            expect(isMatching('div', ['class', 'baz', 'title', 'title'], selector)).toBeFalsy();
        });
        it('should not match negative selector with attribute selector after', function () {
            // selector: ':not(.baz[title]):not([foo])'
            var selector = [
                '', 1 /* NOT */ | 2 /* ATTRIBUTE */, 'title', '', 8 /* CLASS */, 'baz',
                1 /* NOT */ | 2 /* ATTRIBUTE */, 'foo', ''
            ];
            // <div class="baz">
            expect(isMatching('div', ['class', 'baz'], selector)).toBeTruthy();
            // <div class="baz" title="">
            expect(isMatching('div', ['class', 'baz', 'title', ''], selector)).toBeFalsy();
            // <div class="baz" foo="">
            expect(isMatching('div', ['class', 'baz', 'foo', ''], selector)).toBeFalsy();
        });
        it('should not match with multiple negative selectors', function () {
            // selector: ':not(span):not([foo])'
            var selector = [
                '', 1 /* NOT */ | 4 /* ELEMENT */, 'span',
                1 /* NOT */ | 2 /* ATTRIBUTE */, 'foo', ''
            ];
            // <div foo="">
            expect(isMatching('div', ['foo', ''], selector)).toBeFalsy();
            // <span bar="">
            expect(isMatching('span', ['bar', ''], selector)).toBeFalsy();
            // <div bar="">
            expect(isMatching('div', ['bar', ''], selector)).toBeTruthy();
        });
        it('should evaluate complex selector with negative selectors', function () {
            // selector: 'div.foo.bar[name=name]:not(.baz):not([title])'
            var selector = [
                'div', 'name', 'name', 8 /* CLASS */, 'foo', 'bar',
                1 /* NOT */ | 2 /* ATTRIBUTE */, 'title', '',
                1 /* NOT */ | 8 /* CLASS */, 'baz'
            ];
            // <div name="name" class="foo bar">
            expect(isMatching('div', ['name', 'name', 'class', 'foo bar'], selector)).toBeTruthy();
            // <div name="name" class="foo bar baz">
            expect(isMatching('div', ['name', 'name', 'class', 'foo bar baz'], selector)).toBeFalsy();
            // <div name="name" title class="foo bar">
            expect(isMatching('div', ['name', 'name', 'title', '', 'class', 'foo bar'], selector))
                .toBeFalsy();
        });
    });
    describe('isNodeMatchingSelectorList', function () {
        function isAnyMatching(tagName, attrs, selector) {
            return node_selector_matcher_1.isNodeMatchingSelectorList(testLStaticData(tagName, attrs), selector);
        }
        it('should match when there is only one simple selector without negations', function () {
            expect(isAnyMatching('span', null, [['span']]))
                .toBeTruthy("Selector 'span' should match <span>");
            expect(isAnyMatching('span', null, [['div']]))
                .toBeFalsy("Selector 'div' should NOT match <span>");
        });
        it('should match when there are multiple parts and only one is matching', function () {
            expect(isAnyMatching('span', ['foo', 'bar'], [
                ['div'], ['', 'foo', 'bar']
            ])).toBeTruthy("Selector 'div, [foo=bar]' should match <span foo=\"bar\">");
        });
        it('should not match when there are multiple parts and none is matching', function () {
            expect(isAnyMatching('span', ['foo', 'bar'], [
                ['div'], ['', 'foo', 'baz']
            ])).toBeFalsy("Selector 'div, [foo=baz]' should NOT match <span foo=\"bar\">");
        });
    });
    describe('reading the ngProjectAs attribute value', function () {
        function testTNode(attrs) { return testLStaticData('tag', attrs); }
        it('should get ngProjectAs value if present', function () {
            expect(node_selector_matcher_1.getProjectAsAttrValue(testTNode([projection_1.NG_PROJECT_AS_ATTR_NAME, 'tag[foo=bar]'])))
                .toBe('tag[foo=bar]');
        });
        it('should return null if there are no attributes', function () { expect(node_selector_matcher_1.getProjectAsAttrValue(testTNode(null))).toBe(null); });
        it('should return if ngProjectAs is not present', function () {
            expect(node_selector_matcher_1.getProjectAsAttrValue(testTNode(['foo', 'bar']))).toBe(null);
        });
        it('should not accidentally identify ngProjectAs in attribute values', function () {
            expect(node_selector_matcher_1.getProjectAsAttrValue(testTNode(['foo', projection_1.NG_PROJECT_AS_ATTR_NAME]))).toBe(null);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZV9zZWxlY3Rvcl9tYXRjaGVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVuZGVyMy9ub2RlX3NlbGVjdG9yX21hdGNoZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUlILHNFQUE4SDtBQUM5SCxpRkFBa0k7QUFDbEksdUVBQW1FO0FBRW5FLHlCQUF5QixPQUFlLEVBQUUsS0FBeUI7SUFDakUsT0FBTywwQkFBVyxrQkFBb0IsQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3ZFLENBQUM7QUFFRCxRQUFRLENBQUMsdUJBQXVCLEVBQUU7SUFDaEMsb0JBQW9CLE9BQWUsRUFBRSxLQUF5QixFQUFFLFFBQXFCO1FBQ25GLE9BQU8sOENBQXNCLENBQ3pCLDBCQUFXLGtCQUFvQixDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUVELFFBQVEsQ0FBQyw4QkFBOEIsRUFBRTtRQUd2QyxRQUFRLENBQUMsa0JBQWtCLEVBQUU7WUFFM0IsRUFBRSxDQUFDLHNEQUFzRCxFQUFFO2dCQUN6RCxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO3FCQUNyQyxVQUFVLENBQUMscUNBQXFDLENBQUMsQ0FBQztnQkFFdkQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztxQkFDcEMsU0FBUyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7WUFDM0QsQ0FBQyxDQUFDLENBQUM7WUFFSDs7O2VBR0c7WUFDSCxFQUFFLENBQUMsNENBQTRDLEVBQUU7Z0JBQy9D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