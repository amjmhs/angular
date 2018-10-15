"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var selector_1 = require("@angular/compiler/src/selector");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
{
    describe('SelectorMatcher', function () {
        var matcher;
        var selectableCollector;
        var s1, s2, s3, s4;
        var matched;
        function reset() { matched = []; }
        beforeEach(function () {
            reset();
            s1 = s2 = s3 = s4 = null;
            selectableCollector =
                function (selector, context) { matched.push(selector, context); };
            matcher = new selector_1.SelectorMatcher();
        });
        it('should select by element name case sensitive', function () {
            matcher.addSelectables(s1 = selector_1.CssSelector.parse('someTag'), 1);
            expect(matcher.match(getSelectorFor({ tag: 'SOMEOTHERTAG' }), selectableCollector))
                .toEqual(false);
            expect(matched).toEqual([]);
            expect(matcher.match(getSelectorFor({ tag: 'SOMETAG' }), selectableCollector)).toEqual(false);
            expect(matched).toEqual([]);
            expect(matcher.match(getSelectorFor({ tag: 'someTag' }), selectableCollector)).toEqual(true);
            expect(matched).toEqual([s1[0], 1]);
        });
        it('should select by class name case insensitive', function () {
            matcher.addSelectables(s1 = selector_1.CssSelector.parse('.someClass'), 1);
            matcher.addSelectables(s2 = selector_1.CssSelector.parse('.someClass.class2'), 2);
            expect(matcher.match(getSelectorFor({ classes: 'SOMEOTHERCLASS' }), selectableCollector))
                .toEqual(false);
            expect(matched).toEqual([]);
            expect(matcher.match(getSelectorFor({ classes: 'SOMECLASS' }), selectableCollector))
                .toEqual(true);
            expect(matched).toEqual([s1[0], 1]);
            reset();
            expect(matcher.match(getSelectorFor({ classes: 'someClass class2' }), selectableCollector))
                .toEqual(true);
            expect(matched).toEqual([s1[0], 1, s2[0], 2]);
        });
        it('should not throw for class name "constructor"', function () {
            expect(matcher.match(getSelectorFor({ classes: 'constructor' }), selectableCollector))
                .toEqual(false);
            expect(matched).toEqual([]);
        });
        it('should select by attr name case sensitive independent of the value', function () {
            matcher.addSelectables(s1 = selector_1.CssSelector.parse('[someAttr]'), 1);
            matcher.addSelectables(s2 = selector_1.CssSelector.parse('[someAttr][someAttr2]'), 2);
            expect(matcher.match(getSelectorFor({ attrs: [['SOMEOTHERATTR', '']] }), selectableCollector))
                .toEqual(false);
            expect(matched).toEqual([]);
            expect(matcher.match(getSelectorFor({ attrs: [['SOMEATTR', '']] }), selectableCollector))
                .toEqual(false);
            expect(matched).toEqual([]);
            expect(matcher.match(getSelectorFor({ attrs: [['SOMEATTR', 'someValue']] }), selectableCollector))
                .toEqual(false);
            expect(matched).toEqual([]);
            expect(matcher.match(getSelectorFor({ attrs: [['someAttr', ''], ['someAttr2', '']] }), selectableCollector))
                .toEqual(true);
            expect(matched).toEqual([s1[0], 1, s2[0], 2]);
            reset();
            expect(matcher.match(getSelectorFor({ attrs: [['someAttr', 'someValue'], ['someAttr2', '']] }), selectableCollector))
                .toEqual(true);
            expect(matched).toEqual([s1[0], 1, s2[0], 2]);
            reset();
            expect(matcher.match(getSelectorFor({ attrs: [['someAttr2', ''], ['someAttr', 'someValue']] }), selectableCollector))
                .toEqual(true);
            expect(matched).toEqual([s1[0], 1, s2[0], 2]);
            reset();
            expect(matcher.match(getSelectorFor({ attrs: [['someAttr2', 'someValue'], ['someAttr', '']] }), selectableCollector))
                .toEqual(true);
            expect(matched).toEqual([s1[0], 1, s2[0], 2]);
        });
        it('should support "." in attribute names', function () {
            matcher.addSelectables(s1 = selector_1.CssSelector.parse('[foo.bar]'), 1);
            expect(matcher.match(getSelectorFor({ attrs: [['barfoo', '']] }), selectableCollector))
                .toEqual(false);
            expect(matched).toEqual([]);
            reset();
            expect(matcher.match(getSelectorFor({ attrs: [['foo.bar', '']] }), selectableCollector))
                .toEqual(true);
            expect(matched).toEqual([s1[0], 1]);
        });
        it('should select by attr name only once if the value is from the DOM', function () {
            matcher.addSelectables(s1 = selector_1.CssSelector.parse('[some-decor]'), 1);
            var elementSelector = new selector_1.CssSelector();
            var element = browser_util_1.el('<div attr></div>');
            var empty = dom_adapter_1.getDOM().getAttribute(element, 'attr');
            elementSelector.addAttribute('some-decor', empty);
            matcher.match(elementSelector, selectableCollector);
            expect(matched).toEqual([s1[0], 1]);
        });
        it('should select by attr name case sensitive and value case insensitive', function () {
            matcher.addSelectables(s1 = selector_1.CssSelector.parse('[someAttr=someValue]'), 1);
            expect(matcher.match(getSelectorFor({ attrs: [['SOMEATTR', 'SOMEOTHERATTR']] }), selectableCollector))
                .toEqual(false);
            expect(matched).toEqual([]);
            expect(matcher.match(getSelectorFor({ attrs: [['SOMEATTR', 'SOMEVALUE']] }), selectableCollector))
                .toEqual(false);
            expect(matched).toEqual([]);
            expect(matcher.match(getSelectorFor({ attrs: [['someAttr', 'SOMEVALUE']] }), selectableCollector))
                .toEqual(true);
            expect(matched).toEqual([s1[0], 1]);
        });
        it('should select by element name, class name and attribute name with value', function () {
            matcher.addSelectables(s1 = selector_1.CssSelector.parse('someTag.someClass[someAttr=someValue]'), 1);
            expect(matcher.match(getSelectorFor({ tag: 'someOtherTag', classes: 'someOtherClass', attrs: [['someOtherAttr', '']] }), selectableCollector))
                .toEqual(false);
            expect(matched).toEqual([]);
            expect(matcher.match(getSelectorFor({ tag: 'someTag', classes: 'someOtherClass', attrs: [['someOtherAttr', '']] }), selectableCollector))
                .toEqual(false);
            expect(matched).toEqual([]);
            expect(matcher.match(getSelectorFor({ tag: 'someTag', classes: 'someClass', attrs: [['someOtherAttr', '']] }), selectableCollector))
                .toEqual(false);
            expect(matched).toEqual([]);
            expect(matcher.match(getSelectorFor({ tag: 'someTag', classes: 'someClass', attrs: [['someAttr', '']] }), selectableCollector))
                .toEqual(false);
            expect(matched).toEqual([]);
            expect(matcher.match(getSelectorFor({ tag: 'someTag', classes: 'someClass', attrs: [['someAttr', 'someValue']] }), selectableCollector))
                .toEqual(true);
            expect(matched).toEqual([s1[0], 1]);
        });
        it('should select by many attributes and independent of the value', function () {
            matcher.addSelectables(s1 = selector_1.CssSelector.parse('input[type=text][control]'), 1);
            var cssSelector = new selector_1.CssSelector();
            cssSelector.setElement('input');
            cssSelector.addAttribute('type', 'text');
            cssSelector.addAttribute('control', 'one');
            expect(matcher.match(cssSelector, selectableCollector)).toEqual(true);
            expect(matched).toEqual([s1[0], 1]);
        });
        it('should select independent of the order in the css selector', function () {
            matcher.addSelectables(s1 = selector_1.CssSelector.parse('[someAttr].someClass'), 1);
            matcher.addSelectables(s2 = selector_1.CssSelector.parse('.someClass[someAttr]'), 2);
            matcher.addSelectables(s3 = selector_1.CssSelector.parse('.class1.class2'), 3);
            matcher.addSelectables(s4 = selector_1.CssSelector.parse('.class2.class1'), 4);
            expect(matcher.match(selector_1.CssSelector.parse('[someAttr].someClass')[0], selectableCollector))
                .toEqual(true);
            expect(matched).toEqual([s1[0], 1, s2[0], 2]);
            reset();
            expect(matcher.match(selector_1.CssSelector.parse('.someClass[someAttr]')[0], selectableCollector))
                .toEqual(true);
            expect(matched).toEqual([s1[0], 1, s2[0], 2]);
            reset();
            expect(matcher.match(selector_1.CssSelector.parse('.class1.class2')[0], selectableCollector))
                .toEqual(true);
            expect(matched).toEqual([s3[0], 3, s4[0], 4]);
            reset();
            expect(matcher.match(selector_1.CssSelector.parse('.class2.class1')[0], selectableCollector))
                .toEqual(true);
            expect(matched).toEqual([s4[0], 4, s3[0], 3]);
        });
        it('should not select with a matching :not selector', function () {
            matcher.addSelectables(selector_1.CssSelector.parse('p:not(.someClass)'), 1);
            matcher.addSelectables(selector_1.CssSelector.parse('p:not([someAttr])'), 2);
            matcher.addSelectables(selector_1.CssSelector.parse(':not(.someClass)'), 3);
            matcher.addSelectables(selector_1.CssSelector.parse(':not(p)'), 4);
            matcher.addSelectables(selector_1.CssSelector.parse(':not(p[someAttr])'), 5);
            expect(matcher.match(getSelectorFor({ tag: 'p', classes: 'someClass', attrs: [['someAttr', '']] }), selectableCollector))
                .toEqual(false);
            expect(matched).toEqual([]);
        });
        it('should select with a non matching :not selector', function () {
            matcher.addSelectables(s1 = selector_1.CssSelector.parse('p:not(.someClass)'), 1);
            matcher.addSelectables(s2 = selector_1.CssSelector.parse('p:not(.someOtherClass[someAttr])'), 2);
            matcher.addSelectables(s3 = selector_1.CssSelector.parse(':not(.someClass)'), 3);
            matcher.addSelectables(s4 = selector_1.CssSelector.parse(':not(.someOtherClass[someAttr])'), 4);
            expect(matcher.match(getSelectorFor({ tag: 'p', attrs: [['someOtherAttr', '']], classes: 'someOtherClass' }), selectableCollector))
                .toEqual(true);
            expect(matched).toEqual([s1[0], 1, s2[0], 2, s3[0], 3, s4[0], 4]);
        });
        it('should match * with :not selector', function () {
            matcher.addSelectables(selector_1.CssSelector.parse(':not([a])'), 1);
            expect(matcher.match(getSelectorFor({ tag: 'div' }), function () { })).toEqual(true);
        });
        it('should match with multiple :not selectors', function () {
            matcher.addSelectables(s1 = selector_1.CssSelector.parse('div:not([a]):not([b])'), 1);
            expect(matcher.match(getSelectorFor({ tag: 'div', attrs: [['a', '']] }), selectableCollector))
                .toBe(false);
            expect(matcher.match(getSelectorFor({ tag: 'div', attrs: [['b', '']] }), selectableCollector))
                .toBe(false);
            expect(matcher.match(getSelectorFor({ tag: 'div', attrs: [['c', '']] }), selectableCollector))
                .toBe(true);
        });
        it('should select with one match in a list', function () {
            matcher.addSelectables(s1 = selector_1.CssSelector.parse('input[type=text], textbox'), 1);
            expect(matcher.match(getSelectorFor({ tag: 'textbox' }), selectableCollector)).toEqual(true);
            expect(matched).toEqual([s1[1], 1]);
            reset();
            expect(matcher.match(getSelectorFor({ tag: 'input', attrs: [['type', 'text']] }), selectableCollector))
                .toEqual(true);
            expect(matched).toEqual([s1[0], 1]);
        });
        it('should not select twice with two matches in a list', function () {
            matcher.addSelectables(s1 = selector_1.CssSelector.parse('input, .someClass'), 1);
            expect(matcher.match(getSelectorFor({ tag: 'input', classes: 'someclass' }), selectableCollector))
                .toEqual(true);
            expect(matched.length).toEqual(2);
            expect(matched).toEqual([s1[0], 1]);
        });
    });
    describe('CssSelector.parse', function () {
        it('should detect element names', function () {
            var cssSelector = selector_1.CssSelector.parse('sometag')[0];
            expect(cssSelector.element).toEqual('sometag');
            expect(cssSelector.toString()).toEqual('sometag');
        });
        it('should detect class names', function () {
            var cssSelector = selector_1.CssSelector.parse('.someClass')[0];
            expect(cssSelector.classNames).toEqual(['someclass']);
            expect(cssSelector.toString()).toEqual('.someclass');
        });
        it('should detect attr names', function () {
            var cssSelector = selector_1.CssSelector.parse('[attrname]')[0];
            expect(cssSelector.attrs).toEqual(['attrname', '']);
            expect(cssSelector.toString()).toEqual('[attrname]');
        });
        it('should detect attr values', function () {
            var cssSelector = selector_1.CssSelector.parse('[attrname=attrvalue]')[0];
            expect(cssSelector.attrs).toEqual(['attrname', 'attrvalue']);
            expect(cssSelector.toString()).toEqual('[attrname=attrvalue]');
        });
        it('should detect attr values with double quotes', function () {
            var cssSelector = selector_1.CssSelector.parse('[attrname="attrvalue"]')[0];
            expect(cssSelector.attrs).toEqual(['attrname', 'attrvalue']);
            expect(cssSelector.toString()).toEqual('[attrname=attrvalue]');
        });
        it('should detect attr values with single quotes', function () {
            var cssSelector = selector_1.CssSelector.parse('[attrname=\'attrvalue\']')[0];
            expect(cssSelector.attrs).toEqual(['attrname', 'attrvalue']);
            expect(cssSelector.toString()).toEqual('[attrname=attrvalue]');
        });
        it('should detect multiple parts', function () {
            var cssSelector = selector_1.CssSelector.parse('sometag[attrname=attrvalue].someclass')[0];
            expect(cssSelector.element).toEqual('sometag');
            expect(cssSelector.attrs).toEqual(['attrname', 'attrvalue']);
            expect(cssSelector.classNames).toEqual(['someclass']);
            expect(cssSelector.toString()).toEqual('sometag.someclass[attrname=attrvalue]');
        });
        it('should detect multiple attributes', function () {
            var cssSelector = selector_1.CssSelector.parse('input[type=text][control]')[0];
            expect(cssSelector.element).toEqual('input');
            expect(cssSelector.attrs).toEqual(['type', 'text', 'control', '']);
            expect(cssSelector.toString()).toEqual('input[type=text][control]');
        });
        it('should detect :not', function () {
            var cssSelector = selector_1.CssSelector.parse('sometag:not([attrname=attrvalue].someclass)')[0];
            expect(cssSelector.element).toEqual('sometag');
            expect(cssSelector.attrs.length).toEqual(0);
            expect(cssSelector.classNames.length).toEqual(0);
            var notSelector = cssSelector.notSelectors[0];
            expect(notSelector.element).toEqual(null);
            expect(notSelector.attrs).toEqual(['attrname', 'attrvalue']);
            expect(notSelector.classNames).toEqual(['someclass']);
            expect(cssSelector.toString()).toEqual('sometag:not(.someclass[attrname=attrvalue])');
        });
        it('should detect :not without truthy', function () {
            var cssSelector = selector_1.CssSelector.parse(':not([attrname=attrvalue].someclass)')[0];
            expect(cssSelector.element).toEqual('*');
            var notSelector = cssSelector.notSelectors[0];
            expect(notSelector.attrs).toEqual(['attrname', 'attrvalue']);
            expect(notSelector.classNames).toEqual(['someclass']);
            expect(cssSelector.toString()).toEqual('*:not(.someclass[attrname=attrvalue])');
        });
        it('should throw when nested :not', function () {
            expect(function () {
                selector_1.CssSelector.parse('sometag:not(:not([attrname=attrvalue].someclass))')[0];
            }).toThrowError('Nesting :not is not allowed in a selector');
        });
        it('should throw when multiple selectors in :not', function () {
            expect(function () {
                selector_1.CssSelector.parse('sometag:not(a,b)');
            }).toThrowError('Multiple selectors in :not are not supported');
        });
        it('should detect lists of selectors', function () {
            var cssSelectors = selector_1.CssSelector.parse('.someclass,[attrname=attrvalue], sometag');
            expect(cssSelectors.length).toEqual(3);
            expect(cssSelectors[0].classNames).toEqual(['someclass']);
            expect(cssSelectors[1].attrs).toEqual(['attrname', 'attrvalue']);
            expect(cssSelectors[2].element).toEqual('sometag');
        });
        it('should detect lists of selectors with :not', function () {
            var cssSelectors = selector_1.CssSelector.parse('input[type=text], :not(textarea), textbox:not(.special)');
            expect(cssSelectors.length).toEqual(3);
            expect(cssSelectors[0].element).toEqual('input');
            expect(cssSelectors[0].attrs).toEqual(['type', 'text']);
            expect(cssSelectors[1].element).toEqual('*');
            expect(cssSelectors[1].notSelectors[0].element).toEqual('textarea');
            expect(cssSelectors[2].element).toEqual('textbox');
            expect(cssSelectors[2].notSelectors[0].classNames).toEqual(['special']);
        });
    });
    describe('CssSelector.getMatchingElementTemplate', function () {
        it('should create an element with a tagName, classes, and attributes with the correct casing', function () {
            var selector = selector_1.CssSelector.parse('Blink.neon.hotpink[Sweet][Dismissable=false]')[0];
            var template = selector.getMatchingElementTemplate();
            expect(template).toEqual('<Blink class="neon hotpink" Sweet Dismissable="false"></Blink>');
        });
        it('should create an element without a tag name', function () {
            var selector = selector_1.CssSelector.parse('[fancy]')[0];
            var template = selector.getMatchingElementTemplate();
            expect(template).toEqual('<div fancy></div>');
        });
        it('should ignore :not selectors', function () {
            var selector = selector_1.CssSelector.parse('grape:not(.red)')[0];
            var template = selector.getMatchingElementTemplate();
            expect(template).toEqual('<grape></grape>');
        });
        it('should support void tags', function () {
            var selector = selector_1.CssSelector.parse('input[fancy]')[0];
            var template = selector.getMatchingElementTemplate();
            expect(template).toEqual('<input fancy/>');
        });
    });
}
function getSelectorFor(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.tag, tag = _c === void 0 ? '' : _c, _d = _b.attrs, attrs = _d === void 0 ? [] : _d, _e = _b.classes, classes = _e === void 0 ? '' : _e;
    var selector = new selector_1.CssSelector();
    selector.setElement(tag);
    attrs.forEach(function (nameValue) { selector.addAttribute(nameValue[0], nameValue[1]); });
    classes.trim().split(/\s+/g).forEach(function (cName) { selector.addClassName(cName); });
    return selector;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0b3Jfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3Qvc2VsZWN0b3Jfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDJEQUE0RTtBQUM1RSw2RUFBcUU7QUFDckUsbUZBQXNFO0FBRXRFO0lBQ0UsUUFBUSxDQUFDLGlCQUFpQixFQUFFO1FBQzFCLElBQUksT0FBd0IsQ0FBQztRQUM3QixJQUFJLG1CQUFrRSxDQUFDO1FBQ3ZFLElBQUksRUFBUyxFQUFFLEVBQVMsRUFBRSxFQUFTLEVBQUUsRUFBUyxDQUFDO1FBQy9DLElBQUksT0FBYyxDQUFDO1FBRW5CLG1CQUFtQixPQUFPLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVsQyxVQUFVLENBQUM7WUFDVCxLQUFLLEVBQUUsQ0FBQztZQUNSLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFNLENBQUM7WUFDM0IsbUJBQW1CO2dCQUNmLFVBQUMsUUFBcUIsRUFBRSxPQUFZLElBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEYsT0FBTyxHQUFHLElBQUksMEJBQWUsRUFBRSxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO1lBQ2pELE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRSxHQUFHLHNCQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRTdELE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFDLEdBQUcsRUFBRSxjQUFjLEVBQUMsQ0FBQyxFQUFFLG1CQUFtQixDQUFDLENBQUM7aUJBQzVFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQixN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