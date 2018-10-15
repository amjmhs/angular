"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var placeholder_1 = require("../../../src/i18n/serializers/placeholder");
{
    describe('PlaceholderRegistry', function () {
        var reg;
        beforeEach(function () { reg = new placeholder_1.PlaceholderRegistry(); });
        describe('tag placeholder', function () {
            it('should generate names for well known tags', function () {
                expect(reg.getStartTagPlaceholderName('p', {}, false)).toEqual('START_PARAGRAPH');
                expect(reg.getCloseTagPlaceholderName('p')).toEqual('CLOSE_PARAGRAPH');
            });
            it('should generate names for custom tags', function () {
                expect(reg.getStartTagPlaceholderName('my-cmp', {}, false)).toEqual('START_TAG_MY-CMP');
                expect(reg.getCloseTagPlaceholderName('my-cmp')).toEqual('CLOSE_TAG_MY-CMP');
            });
            it('should generate the same name for the same tag', function () {
                expect(reg.getStartTagPlaceholderName('p', {}, false)).toEqual('START_PARAGRAPH');
                expect(reg.getStartTagPlaceholderName('p', {}, false)).toEqual('START_PARAGRAPH');
            });
            it('should be case sensitive for tag name', function () {
                expect(reg.getStartTagPlaceholderName('p', {}, false)).toEqual('START_PARAGRAPH');
                expect(reg.getStartTagPlaceholderName('P', {}, false)).toEqual('START_PARAGRAPH_1');
                expect(reg.getCloseTagPlaceholderName('p')).toEqual('CLOSE_PARAGRAPH');
                expect(reg.getCloseTagPlaceholderName('P')).toEqual('CLOSE_PARAGRAPH_1');
            });
            it('should generate the same name for the same tag with the same attributes', function () {
                expect(reg.getStartTagPlaceholderName('p', { foo: 'a', bar: 'b' }, false))
                    .toEqual('START_PARAGRAPH');
                expect(reg.getStartTagPlaceholderName('p', { foo: 'a', bar: 'b' }, false))
                    .toEqual('START_PARAGRAPH');
                expect(reg.getStartTagPlaceholderName('p', { bar: 'b', foo: 'a' }, false))
                    .toEqual('START_PARAGRAPH');
            });
            it('should generate different names for the same tag with different attributes', function () {
                expect(reg.getStartTagPlaceholderName('p', { foo: 'a', bar: 'b' }, false))
                    .toEqual('START_PARAGRAPH');
                expect(reg.getStartTagPlaceholderName('p', { foo: 'a' }, false)).toEqual('START_PARAGRAPH_1');
            });
            it('should be case sensitive for attributes', function () {
                expect(reg.getStartTagPlaceholderName('p', { foo: 'a', bar: 'b' }, false))
                    .toEqual('START_PARAGRAPH');
                expect(reg.getStartTagPlaceholderName('p', { fOo: 'a', bar: 'b' }, false))
                    .toEqual('START_PARAGRAPH_1');
                expect(reg.getStartTagPlaceholderName('p', { fOo: 'a', bAr: 'b' }, false))
                    .toEqual('START_PARAGRAPH_2');
            });
            it('should support void tags', function () {
                expect(reg.getStartTagPlaceholderName('p', {}, true)).toEqual('PARAGRAPH');
                expect(reg.getStartTagPlaceholderName('p', {}, true)).toEqual('PARAGRAPH');
                expect(reg.getStartTagPlaceholderName('p', { other: 'true' }, true)).toEqual('PARAGRAPH_1');
            });
        });
        describe('arbitrary placeholders', function () {
            it('should generate the same name given the same name and content', function () {
                expect(reg.getPlaceholderName('name', 'content')).toEqual('NAME');
                expect(reg.getPlaceholderName('name', 'content')).toEqual('NAME');
            });
            it('should generate a different name given different content', function () {
                expect(reg.getPlaceholderName('name', 'content1')).toEqual('NAME');
                expect(reg.getPlaceholderName('name', 'content2')).toEqual('NAME_1');
                expect(reg.getPlaceholderName('name', 'content3')).toEqual('NAME_2');
            });
            it('should generate a different name given different names', function () {
                expect(reg.getPlaceholderName('name1', 'content')).toEqual('NAME1');
                expect(reg.getPlaceholderName('name2', 'content')).toEqual('NAME2');
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhY2Vob2xkZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvaTE4bi9zZXJpYWxpemVycy9wbGFjZWhvbGRlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgseUVBQThFO0FBRTlFO0lBQ0UsUUFBUSxDQUFDLHFCQUFxQixFQUFFO1FBQzlCLElBQUksR0FBd0IsQ0FBQztRQUU3QixVQUFVLENBQUMsY0FBUSxHQUFHLEdBQUcsSUFBSSxpQ0FBbUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdkQsUUFBUSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtnQkFDOUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ2xGLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUN6RSxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRTtnQkFDMUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBQ3hGLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUMvRSxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxnREFBZ0QsRUFBRTtnQkFDbkQsTUFBTSxDQUFDLEdBQUcsQ0FBQywwQkFB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