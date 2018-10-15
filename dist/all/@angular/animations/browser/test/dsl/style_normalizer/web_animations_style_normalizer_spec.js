"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var web_animations_style_normalizer_1 = require("../../../src/dsl/style_normalization/web_animations_style_normalizer");
{
    describe('WebAnimationsStyleNormalizer', function () {
        var normalizer = new web_animations_style_normalizer_1.WebAnimationsStyleNormalizer();
        describe('normalizePropertyName', function () {
            it('should normalize CSS property values to camel-case', function () {
                expect(normalizer.normalizePropertyName('width', [])).toEqual('width');
                expect(normalizer.normalizePropertyName('border-width', [])).toEqual('borderWidth');
                expect(normalizer.normalizePropertyName('borderHeight', [])).toEqual('borderHeight');
                expect(normalizer.normalizePropertyName('-webkit-animation', [])).toEqual('WebkitAnimation');
            });
        });
        describe('normalizeStyleValue', function () {
            function normalize(prop, val) {
                var errors = [];
                var result = normalizer.normalizeStyleValue(prop, prop, val, errors);
                if (errors.length) {
                    throw new Error(errors.join('\n'));
                }
                return result;
            }
            it('should normalize number-based dimensional properties to use a `px` suffix if missing', function () {
                expect(normalize('width', 10)).toEqual('10px');
                expect(normalize('height', 20)).toEqual('20px');
            });
            it('should report an error when a string-based dimensional value does not contain a suffix at all', function () {
                expect(function () {
                    normalize('width', '50');
                }).toThrowError(/Please provide a CSS unit value for width:50/);
            });
            it('should not normalize non-dimensional properties with `px` values, but only convert them to string', function () {
                expect(normalize('opacity', 0)).toEqual('0');
                expect(normalize('opacity', '1')).toEqual('1');
                expect(normalize('color', 'red')).toEqual('red');
                expect(normalize('fontWeight', '100')).toEqual('100');
            });
            it('should not normalize dimensional-based values that already contain a dimensional suffix or a non dimensional value', function () {
                expect(normalize('width', '50em')).toEqual('50em');
                expect(normalize('height', '500pt')).toEqual('500pt');
                expect(normalize('borderWidth', 'inherit')).toEqual('inherit');
                expect(normalize('paddingTop', 'calc(500px + 200px)')).toEqual('calc(500px + 200px)');
            });
            it('should allow `perspective` to be a numerical property', function () {
                expect(normalize('perspective', 10)).toEqual('10px');
                expect(normalize('perspective', '100pt')).toEqual('100pt');
                expect(normalize('perspective', 'none')).toEqual('none');
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViX2FuaW1hdGlvbnNfc3R5bGVfbm9ybWFsaXplcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3Rlc3QvZHNsL3N0eWxlX25vcm1hbGl6ZXIvd2ViX2FuaW1hdGlvbnNfc3R5bGVfbm9ybWFsaXplcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsd0hBQWtIO0FBRWxIO0lBQ0UsUUFBUSxDQUFDLDhCQUE4QixFQUFFO1FBQ3ZDLElBQU0sVUFBVSxHQUFHLElBQUksOERBQTRCLEVBQUUsQ0FBQztRQUV0RCxRQUFRLENBQUMsdUJBQXVCLEVBQUU7WUFDaEMsRUFBRSxDQUFDLG9EQUFvRCxFQUFFO2dCQUN2RCxNQUFNLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDdkUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3BGLE1BQU0sQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUNyRixNQUFNLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLG1CQUFtQixFQUFFLEVBQzVELENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ2pDLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMscUJBQXFCLEVBQUU7WUFDOUIsbUJBQW1CLElBQVksRUFBRSxHQUFvQjtnQkFDbkQsSUFBTSxNQUFNLEdBQWEsRUFBRSxD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