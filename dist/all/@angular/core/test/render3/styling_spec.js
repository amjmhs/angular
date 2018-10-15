"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var instructions_1 = require("../../src/render3/instructions");
var styling_1 = require("../../src/render3/styling");
var sanitization_1 = require("../../src/sanitization/sanitization");
var render_util_1 = require("./render_util");
describe('styling', function () {
    var element = null;
    beforeEach(function () { element = {}; });
    function initContext(styles, classes, sanitizer) {
        return styling_1.allocStylingContext(element, styling_1.createStylingContextTemplate(classes, styles, sanitizer));
    }
    function renderStyles(context, renderer) {
        var styles = {};
        styling_1.renderStyling(context, (renderer || {}), styles);
        return styles;
    }
    function trackStylesFactory() {
        var styles = {};
        return function (context, renderer) {
            styling_1.renderStyling(context, (renderer || {}), styles);
            return styles;
        };
    }
    function trackClassesFactory() {
        var classes = {};
        return function (context, renderer) {
            styling_1.renderStyling(context, (renderer || {}), {}, classes);
            return classes;
        };
    }
    function trackStylesAndClasses() {
        var classes = {};
        var styles = {};
        return function (context, renderer) {
            styling_1.renderStyling(context, (renderer || {}), styles, classes);
            return [styles, classes];
        };
    }
    function updateClasses(context, classes) {
        styling_1.updateStylingMap(context, classes, null);
    }
    function updateStyles(context, styles) {
        styling_1.updateStylingMap(context, null, styles);
    }
    function cleanStyle(a, b) {
        if (a === void 0) { a = 0; }
        if (b === void 0) { b = 0; }
        return _clean(a, b, false, false);
    }
    function cleanStyleWithSanitization(a, b) {
        if (a === void 0) { a = 0; }
        if (b === void 0) { b = 0; }
        return _clean(a, b, false, true);
    }
    function cleanClass(a, b) { return _clean(a, b, true); }
    function _clean(a, b, isClassBased, sanitizable) {
        if (a === void 0) { a = 0; }
        if (b === void 0) { b = 0; }
        var num = 0;
        if (a) {
            num |= a << 3 /* BitCountSize */;
        }
        if (b) {
            num |= b << (3 /* BitCountSize */ + 14 /* BitCountSize */);
        }
        if (isClassBased) {
            num |= 2 /* Class */;
        }
        if (sanitizable) {
            num |= 4 /* Sanitize */;
        }
        return num;
    }
    function _dirty(a, b, isClassBased, sanitizable) {
        if (a === void 0) { a = 0; }
        if (b === void 0) { b = 0; }
        return _clean(a, b, isClassBased, sanitizable) | 1 /* Dirty */;
    }
    function dirtyStyle(a, b) {
        if (a === void 0) { a = 0; }
        if (b === void 0) { b = 0; }
        return _dirty(a, b, false) | 1 /* Dirty */;
    }
    function dirtyStyleWithSanitization(a, b) {
        if (a === void 0) { a = 0; }
        if (b === void 0) { b = 0; }
        return _dirty(a, b, false, true);
    }
    function dirtyClass(a, b) { return _dirty(a, b, true); }
    describe('styles', function () {
        describe('createStylingContextTemplate', function () {
            it('should initialize empty template', function () {
                var template = initContext();
                expect(template).toEqual([element, null, [null], cleanStyle(0, 6), 0, null]);
            });
            it('should initialize static styles', function () {
                var template = initContext([1 /* VALUES_MODE */, 'color', 'red', 'width', '10px']);
                expect(template).toEqual([
                    element,
                    null,
                    [null, 'red', '10px'],
                    dirtyStyle(0, 12),
                    0,
                    null,
                    // #6
                    cleanStyle(1, 12),
                    'color',
                    null,
                    // #9
                    cleanStyle(2, 15),
                    'width',
                    null,
                    // #12
                    dirtyStyle(1, 6),
                    'color',
                    null,
                    // #15
                    dirtyStyle(2, 9),
                    'width',
                    null,
                ]);
            });
        });
        describe('instructions', function () {
            it('should handle a combination of initial, multi and singular style values (in that order)', function () {
                function Template(rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'span');
                        instructions_1.elementStyling([], [
                            'width', 'height', 'opacity',
                            1 /* VALUES_MODE */, 'width', '100px', 'height', '100px', 'opacity',
                            '0.5'
                        ]);
                        instructions_1.elementEnd();
                    }
                    if (rf & 2 /* Update */) {
                        instructions_1.elementStylingMap(0, ctx.myStyles);
                        instructions_1.elementStyleProp(0, 0, ctx.myWidth);
                        instructions_1.elementStylingApply(0);
                    }
                }
                expect(render_util_1.renderToHtml(Template, {
                    myStyles: { width: '200px', height: '200px' },
                    myWidth: '300px'
                })).toEqual('<span style="height: 200px; opacity: 0.5; width: 300px;"></span>');
                expect(render_util_1.renderToHtml(Template, { myStyles: { width: '200px', height: null }, myWidth: null }))
                    .toEqual('<span style="height: 100px; opacity: 0.5; width: 200px;"></span>');
            });
        });
        describe('helper functions', function () {
            it('should build a list of multiple styling values', function () {
                var getStyles = trackStylesFactory();
                var stylingContext = initContext();
                updateStyles(stylingContext, {
                    width: '100px',
                    height: '100px',
                });
                updateStyles(stylingContext, { height: '200px' });
                expect(getStyles(stylingContext)).toEqual({ width: null, height: '200px' });
            });
            it('should evaluate the delta between style changes when rendering occurs', function () {
                var stylingContext = initContext(['width', 'height', 1 /* VALUES_MODE */, 'width', '100px']);
                updateStyles(stylingContext, {
                    height: '200px',
                });
                expect(renderStyles(stylingContext)).toEqual({ width: '100px', height: '200px' });
                expect(renderStyles(stylingContext)).toEqual({});
                updateStyles(stylingContext, {
                    width: '100px',
                    height: '100px',
                });
                expect(renderStyles(stylingContext)).toEqual({ height: '100px' });
                styling_1.updateStyleProp(stylingContext, 1, '100px');
                expect(renderStyles(stylingContext)).toEqual({});
                updateStyles(stylingContext, {
                    width: '100px',
                    height: '100px',
                });
                expect(renderStyles(stylingContext)).toEqual({});
            });
            it('should update individual values on a set of styles', function () {
                var getStyles = trackStylesFactory();
                var stylingContext = initContext(['width', 'height']);
                updateStyles(stylingContext, {
                    width: '100px',
                    height: '100px',
                });
                styling_1.updateStyleProp(stylingContext, 1, '200px');
                expect(getStyles(stylingContext)).toEqual({ width: '100px', height: '200px' });
            });
            it('should only mark itself as updated when one or more properties have been applied', function () {
                var stylingContext = initContext();
                expect(styling_1.isContextDirty(stylingContext)).toBeFalsy();
                updateStyles(stylingContext, {
                    width: '100px',
                    height: '100px',
                });
                expect(styling_1.isContextDirty(stylingContext)).toBeTruthy();
                styling_1.setContextDirty(stylingContext, false);
                updateStyles(stylingContext, {
                    width: '100px',
                    height: '100px',
                });
                expect(styling_1.isContextDirty(stylingContext)).toBeFalsy();
                updateStyles(stylingContext, {
                    width: '200px',
                    height: '100px',
                });
                expect(styling_1.isContextDirty(stylingContext)).toBeTruthy();
            });
            it('should only mark itself as updated when any single properties have been applied', function () {
                var stylingContext = initContext(['height']);
                updateStyles(stylingContext, {
                    width: '100px',
                    height: '100px',
                });
                styling_1.setContextDirty(stylingContext, false);
                styling_1.updateStyleProp(stylingContext, 0, '100px');
                expect(styling_1.isContextDirty(stylingContext)).toBeFalsy();
                styling_1.setContextDirty(stylingContext, false);
                styling_1.updateStyleProp(stylingContext, 0, '200px');
                expect(styling_1.isContextDirty(stylingContext)).toBeTruthy();
            });
            it('should prioritize multi and single styles over initial styles', function () {
                var getStyles = trackStylesFactory();
                var stylingContext = initContext([
                    'width', 'height', 'opacity', 1 /* VALUES_MODE */, 'width', '100px', 'height',
                    '100px', 'opacity', '0'
                ]);
                expect(getStyles(stylingContext)).toEqual({
                    width: '100px',
                    height: '100px',
                    opacity: '0',
                });
                updateStyles(stylingContext, { width: '200px', height: '200px' });
                expect(getStyles(stylingContext)).toEqual({
                    width: '200px',
                    height: '200px',
                    opacity: '0',
                });
                styling_1.updateStyleProp(stylingContext, 0, '300px');
                expect(getStyles(stylingContext)).toEqual({
                    width: '300px',
                    height: '200px',
                    opacity: '0',
                });
                styling_1.updateStyleProp(stylingContext, 0, null);
                expect(getStyles(stylingContext)).toEqual({
                    width: '200px',
                    height: '200px',
                    opacity: '0',
                });
                updateStyles(stylingContext, {});
                expect(getStyles(stylingContext)).toEqual({
                    width: '100px',
                    height: '100px',
                    opacity: '0',
                });
            });
            it('should cleanup removed styles from the context once the styles are built', function () {
                var stylingContext = initContext(['width', 'height']);
                var getStyles = trackStylesFactory();
                updateStyles(stylingContext, { width: '100px', height: '100px' });
                expect(stylingContext).toEqual([
                    element,
                    null,
                    [null],
                    dirtyStyle(0, 12),
                    2,
                    null,
                    // #6
                    cleanStyle(0, 12),
                    'width',
                    null,
                    // #9
                    cleanStyle(0, 15),
                    'height',
                    null,
                    // #12
                    dirtyStyle(0, 6),
                    'width',
                    '100px',
                    // #15
                    dirtyStyle(0, 9),
                    'height',
                    '100px',
                ]);
                getStyles(stylingContext);
                updateStyles(stylingContext, { width: '200px', opacity: '0' });
                expect(stylingContext).toEqual([
                    element,
                    null,
                    [null],
                    dirtyStyle(0, 12),
                    2,
                    null,
                    // #6
                    cleanStyle(0, 12),
                    'width',
                    null,
                    // #9
                    cleanStyle(0, 18),
                    'height',
                    null,
                    // #12
                    dirtyStyle(0, 6),
                    'width',
                    '200px',
                    // #15
                    dirtyStyle(),
                    'opacity',
                    '0',
                    // #18
                    dirtyStyle(0, 9),
                    'height',
                    null,
                ]);
                getStyles(stylingContext);
                expect(stylingContext).toEqual([
                    element,
                    null,
                    [null],
                    cleanStyle(0, 12),
                    2,
                    null,
                    // #6
                    cleanStyle(0, 12),
                    'width',
                    null,
                    // #9
                    cleanStyle(0, 18),
                    'height',
                    null,
                    // #12
                    cleanStyle(0, 6),
                    'width',
                    '200px',
                    // #15
                    cleanStyle(),
                    'opacity',
                    '0',
                    // #18
                    cleanStyle(0, 9),
                    'height',
                    null,
                ]);
                updateStyles(stylingContext, { width: null });
                styling_1.updateStyleProp(stylingContext, 0, '300px');
                expect(stylingContext).toEqual([
                    element,
                    null,
                    [null],
                    dirtyStyle(0, 12),
                    2,
                    null,
                    // #6
                    dirtyStyle(0, 12),
                    'width',
                    '300px',
                    // #9
                    cleanStyle(0, 18),
                    'height',
                    null,
                    // #12
                    cleanStyle(0, 6),
                    'width',
                    null,
                    // #15
                    dirtyStyle(),
                    'opacity',
                    null,
                    // #18
                    cleanStyle(0, 9),
                    'height',
                    null,
                ]);
                getStyles(stylingContext);
                styling_1.updateStyleProp(stylingContext, 0, null);
                expect(stylingContext).toEqual([
                    element,
                    null,
                    [null],
                    dirtyStyle(0, 12),
                    2,
                    null,
                    // #6
                    dirtyStyle(0, 12),
                    'width',
                    null,
                    // #9
                    cleanStyle(0, 18),
                    'height',
                    null,
                    // #12
                    cleanStyle(0, 6),
                    'width',
                    null,
                    // #15
                    cleanStyle(),
                    'opacity',
                    null,
                    // #18
                    cleanStyle(0, 9),
                    'height',
                    null,
                ]);
            });
            it('should find the next available space in the context when data is added after being removed before', function () {
                var stylingContext = initContext(['lineHeight']);
                var getStyles = trackStylesFactory();
                updateStyles(stylingContext, { width: '100px', height: '100px', opacity: '0.5' });
                expect(stylingContext).toEqual([
                    element,
                    null,
                    [null],
                    dirtyStyle(0, 9),
                    1,
                    null,
                    // #6
                    cleanStyle(0, 18),
                    'lineHeight',
                    null,
                    // #9
                    dirtyStyle(),
                    'width',
                    '100px',
                    // #12
                    dirtyStyle(),
                    'height',
                    '100px',
                    // #15
                    dirtyStyle(),
                    'opacity',
                    '0.5',
                    // #18
                    cleanStyle(0, 6),
                    'lineHeight',
                    null,
                ]);
                getStyles(stylingContext);
                updateStyles(stylingContext, {});
                expect(stylingContext).toEqual([
                    element,
                    null,
                    [null],
                    dirtyStyle(0, 9),
                    1,
                    null,
                    // #6
                    cleanStyle(0, 18),
                    'lineHeight',
                    null,
                    // #9
                    dirtyStyle(),
                    'width',
                    null,
                    // #12
                    dirtyStyle(),
                    'height',
                    null,
                    // #15
                    dirtyStyle(),
                    'opacity',
                    null,
                    // #18
                    cleanStyle(0, 6),
                    'lineHeight',
                    null,
                ]);
                getStyles(stylingContext);
                updateStyles(stylingContext, {
                    borderWidth: '5px',
                });
                expect(stylingContext).toEqual([
                    element,
                    null,
                    [null],
                    dirtyStyle(0, 9),
                    1,
                    null,
                    // #6
                    cleanStyle(0, 21),
                    'lineHeight',
                    null,
                    // #9
                    dirtyStyle(),
                    'borderWidth',
                    '5px',
                    // #12
                    cleanStyle(),
                    'width',
                    null,
                    // #15
                    cleanStyle(),
                    'height',
                    null,
                    // #18
                    cleanStyle(),
                    'opacity',
                    null,
                    // #21
                    cleanStyle(0, 6),
                    'lineHeight',
                    null,
                ]);
                styling_1.updateStyleProp(stylingContext, 0, '200px');
                expect(stylingContext).toEqual([
                    element,
                    null,
                    [null],
                    dirtyStyle(0, 9),
                    1,
                    null,
                    // #6
                    dirtyStyle(0, 21),
                    'lineHeight',
                    '200px',
                    // #9
                    dirtyStyle(),
                    'borderWidth',
                    '5px',
                    // #12
                    cleanStyle(),
                    'width',
                    null,
                    // #15
                    cleanStyle(),
                    'height',
                    null,
                    // #18
                    cleanStyle(),
                    'opacity',
                    null,
                    // #21
                    cleanStyle(0, 6),
                    'lineHeight',
                    null,
                ]);
                updateStyles(stylingContext, { borderWidth: '15px', borderColor: 'red' });
                expect(stylingContext).toEqual([
                    element,
                    null,
                    [null],
                    dirtyStyle(0, 9),
                    1,
                    null,
                    // #6
                    dirtyStyle(0, 24),
                    'lineHeight',
                    '200px',
                    // #9
                    dirtyStyle(),
                    'borderWidth',
                    '15px',
                    // #12
                    dirtyStyle(),
                    'borderColor',
                    'red',
                    // #15
                    cleanStyle(),
                    'width',
                    null,
                    // #18
                    cleanStyle(),
                    'height',
                    null,
                    // #21
                    cleanStyle(),
                    'opacity',
                    null,
                    // #24
                    cleanStyle(0, 6),
                    'lineHeight',
                    null,
                ]);
            });
            it('should render all data as not being dirty after the styles are built', function () {
                var getStyles = trackStylesFactory();
                var stylingContext = initContext(['height']);
                updateStyles(stylingContext, {
                    width: '100px',
                });
                styling_1.updateStyleProp(stylingContext, 0, '200px');
                expect(stylingContext).toEqual([
                    element,
                    null,
                    [null],
                    dirtyStyle(0, 9),
                    1,
                    null,
                    // #6
                    dirtyStyle(0, 12),
                    'height',
                    '200px',
                    // #6
                    dirtyStyle(),
                    'width',
                    '100px',
                    // #12
                    cleanStyle(0, 6),
                    'height',
                    null,
                ]);
                getStyles(stylingContext);
                expect(stylingContext).toEqual([
                    element,
                    null,
                    [null],
                    cleanStyle(0, 9),
                    1,
                    null,
                    // #6
                    cleanStyle(0, 12),
                    'height',
                    '200px',
                    // #6
                    cleanStyle(),
                    'width',
                    '100px',
                    // #12
                    cleanStyle(0, 6),
                    'height',
                    null,
                ]);
            });
            it('should mark styles that may contain url values as being sanitizable (when a sanitizer is passed in)', function () {
                var getStyles = trackStylesFactory();
                var initialStyles = ['border-image', 'border-width'];
                var styleSanitizer = sanitization_1.defaultStyleSanitizer;
                var stylingContext = initContext(initialStyles, null, styleSanitizer);
                styling_1.updateStyleProp(stylingContext, 0, 'url(foo.jpg)');
                styling_1.updateStyleProp(stylingContext, 1, '100px');
                expect(stylingContext).toEqual([
                    element,
                    styleSanitizer,
                    [null],
                    dirtyStyle(0, 12),
                    2,
                    null,
                    // #6
                    dirtyStyleWithSanitization(0, 12),
                    'border-image',
                    'url(foo.jpg)',
                    // #9
                    dirtyStyle(0, 15),
                    'border-width',
                    '100px',
                    // #12
                    cleanStyleWithSanitization(0, 6),
                    'border-image',
                    null,
                    // #15
                    cleanStyle(0, 9),
                    'border-width',
                    null,
                ]);
                updateStyles(stylingContext, { 'background-image': 'unsafe' });
                expect(stylingContext).toEqual([
                    element,
                    styleSanitizer,
                    [null],
                    dirtyStyle(0, 12),
                    2,
                    null,
                    // #6
                    dirtyStyleWithSanitization(0, 15),
                    'border-image',
                    'url(foo.jpg)',
                    // #9
                    dirtyStyle(0, 18),
                    'border-width',
                    '100px',
                    // #12
                    dirtyStyleWithSanitization(0, 0),
                    'background-image',
                    'unsafe',
                    // #15
                    cleanStyleWithSanitization(0, 6),
                    'border-image',
                    null,
                    // #18
                    cleanStyle(0, 9),
                    'border-width',
                    null,
                ]);
                getStyles(stylingContext);
                expect(stylingContext).toEqual([
                    element,
                    styleSanitizer,
                    [null],
                    cleanStyle(0, 12),
                    2,
                    null,
                    // #6
                    cleanStyleWithSanitization(0, 15),
                    'border-image',
                    'url(foo.jpg)',
                    // #9
                    cleanStyle(0, 18),
                    'border-width',
                    '100px',
                    // #12
                    cleanStyleWithSanitization(0, 0),
                    'background-image',
                    'unsafe',
                    // #15
                    cleanStyleWithSanitization(0, 6),
                    'border-image',
                    null,
                    // #18
                    cleanStyle(0, 9),
                    'border-width',
                    null,
                ]);
            });
        });
    });
    describe('classes', function () {
        it('should initialize with the provided classes', function () {
            var template = initContext(null, [1 /* VALUES_MODE */, 'one', true, 'two', true]);
            expect(template).toEqual([
                element, null, [null, true, true], dirtyStyle(0, 12),
                0, null,
                // #6
                cleanClass(1, 12), 'one', null,
                // #9
                cleanClass(2, 15), 'two', null,
                // #12
                dirtyClass(1, 6), 'one', null,
                // #15
                dirtyClass(2, 9), 'two', null
            ]);
        });
        it('should update multi class properties against the static classes', function () {
            var getClasses = trackClassesFactory();
            var stylingContext = initContext(null, ['bar']);
            expect(getClasses(stylingContext)).toEqual({});
            updateClasses(stylingContext, { foo: true, bar: false });
            expect(getClasses(stylingContext)).toEqual({ 'foo': true, 'bar': false });
            updateClasses(stylingContext, 'bar');
            expect(getClasses(stylingContext)).toEqual({ 'foo': false, 'bar': true });
        });
        it('should update single class properties against the static classes', function () {
            var getClasses = trackClassesFactory();
            var stylingContext = initContext(null, ['bar', 'foo', 1 /* VALUES_MODE */, 'bar', true]);
            expect(getClasses(stylingContext)).toEqual({ 'bar': true });
            styling_1.updateClassProp(stylingContext, 0, true);
            styling_1.updateClassProp(stylingContext, 1, true);
            expect(getClasses(stylingContext)).toEqual({ 'bar': true, 'foo': true });
            styling_1.updateClassProp(stylingContext, 0, false);
            styling_1.updateClassProp(stylingContext, 1, false);
            expect(getClasses(stylingContext)).toEqual({ 'bar': true, 'foo': false });
        });
        it('should understand updating multi-classes using a string-based value while respecting single class-based props', function () {
            var getClasses = trackClassesFactory();
            var stylingContext = initContext(null, ['guy']);
            expect(getClasses(stylingContext)).toEqual({});
            styling_1.updateStylingMap(stylingContext, 'foo bar guy');
            expect(getClasses(stylingContext)).toEqual({ 'foo': true, 'bar': true, 'guy': true });
            styling_1.updateStylingMap(stylingContext, 'foo man');
            styling_1.updateClassProp(stylingContext, 0, true);
            expect(getClasses(stylingContext))
                .toEqual({ 'foo': true, 'man': true, 'bar': false, 'guy': true });
        });
        it('should house itself inside the context alongside styling in harmony', function () {
            var getStylesAndClasses = trackStylesAndClasses();
            var initialStyles = ['width', 'height', 1 /* VALUES_MODE */, 'width', '100px'];
            var initialClasses = ['wide', 'tall', 1 /* VALUES_MODE */, 'wide', true];
            var stylingContext = initContext(initialStyles, initialClasses);
            expect(stylingContext).toEqual([
                element,
                null,
                [null, '100px', true],
                dirtyStyle(0, 18),
                2,
                null,
                // #6
                cleanStyle(1, 18),
                'width',
                null,
                // #9
                cleanStyle(0, 21),
                'height',
                null,
                // #12
                cleanClass(2, 24),
                'wide',
                null,
                // #15
                cleanClass(0, 27),
                'tall',
                null,
                // #18
                dirtyStyle(1, 6),
                'width',
                null,
                // #21
                cleanStyle(0, 9),
                'height',
                null,
                // #24
                dirtyClass(2, 12),
                'wide',
                null,
                // #27
                cleanClass(0, 15),
                'tall',
                null,
            ]);
            expect(getStylesAndClasses(stylingContext)).toEqual([{ width: '100px' }, { wide: true }]);
            styling_1.updateStylingMap(stylingContext, 'tall round', { width: '200px', opacity: '0.5' });
            expect(stylingContext).toEqual([
                element,
                null,
                [null, '100px', true],
                dirtyStyle(0, 18),
                2,
                'tall round',
                // #6
                cleanStyle(1, 18),
                'width',
                null,
                // #9
                cleanStyle(0, 33),
                'height',
                null,
                // #12
                cleanClass(2, 30),
                'wide',
                null,
                // #15
                cleanClass(0, 24),
                'tall',
                null,
                // #18
                dirtyStyle(1, 6),
                'width',
                '200px',
                // #21
                dirtyStyle(0, 0),
                'opacity',
                '0.5',
                // #24
                dirtyClass(0, 15),
                'tall',
                true,
                // #27
                dirtyClass(0, 0),
                'round',
                true,
                // #30
                cleanClass(2, 12),
                'wide',
                null,
                // #33
                cleanStyle(0, 9),
                'height',
                null,
            ]);
            expect(getStylesAndClasses(stylingContext)).toEqual([
                { width: '200px', opacity: '0.5' }, { tall: true, round: true, wide: true }
            ]);
            styling_1.updateStylingMap(stylingContext, { tall: true, wide: true }, { width: '500px' });
            styling_1.updateStyleProp(stylingContext, 0, '300px');
            expect(stylingContext).toEqual([
                element,
                null,
                [null, '100px', true],
                dirtyStyle(0, 18),
                2,
                null,
                // #6
                dirtyStyle(1, 18),
                'width',
                '300px',
                // #9
                cleanStyle(0, 33),
                'height',
                null,
                // #12
                cleanClass(2, 24),
                'wide',
                null,
                // #15
                cleanClass(0, 21),
                'tall',
                null,
                // #18
                cleanStyle(1, 6),
                'width',
                '500px',
                // #21
                cleanClass(0, 15),
                'tall',
                true,
                // #24
                cleanClass(2, 12),
                'wide',
                true,
                // #27
                dirtyClass(0, 0),
                'round',
                null,
                // #30
                dirtyStyle(0, 0),
                'opacity',
                null,
                // #33
                cleanStyle(0, 9),
                'height',
                null,
            ]);
            expect(getStylesAndClasses(stylingContext)).toEqual([
                { width: '300px', opacity: null }, { tall: true, round: false, wide: true }
            ]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGluZ19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3JlbmRlcjMvc3R5bGluZ19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsK0RBQWtKO0FBSWxKLHFEQUE4UDtBQUM5UCxvRUFBMEU7QUFHMUUsNkNBQTJDO0FBRTNDLFFBQVEsQ0FBQyxTQUFTLEVBQUU7SUFDbEIsSUFBSSxPQUFPLEdBQXNCLElBQUksQ0FBQztJQUN0QyxVQUFVLENBQUMsY0FBUSxPQUFPLEdBQUcsRUFBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFM0MscUJBQ0ksTUFBbUMsRUFBRSxPQUE4QyxFQUNuRixTQUFrQztRQUNwQyxPQUFPLDZCQUFtQixDQUFDLE9BQU8sRUFBRSxzQ0FBNEIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDaEcsQ0FBQztJQUVELHNCQUFzQixPQUF1QixFQUFFLFFBQW9CO1FBQ2pFLElBQU0sTUFBTSxHQUF5QixFQUFFLENBQUM7UUFDeEMsdUJBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFjLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDL0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVEO1FBQ0UsSUFBTSxNQUFNLEdBQXlCLEVBQUUsQ0FBQztRQUN4QyxPQUFPLFVBQVMsT0FBdUIsRUFBRSxRQUFvQjtZQUMzRCx1QkFBYyxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMvRCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQ7UUFDRSxJQUFNLE9BQU8sR0FBbUMsRUFBRSxDQUFDO1FBQ25ELE9BQU8sVUFBUyxPQUF1QixFQUFFLFFBQW9CO1lB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