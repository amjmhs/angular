"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ro_1 = require("@angular/common/locales/ro");
var sr_1 = require("@angular/common/locales/sr");
var zgh_1 = require("@angular/common/locales/zgh");
var fr_1 = require("@angular/common/locales/fr");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var localization_1 = require("../../src/i18n/localization");
var locale_data_1 = require("../../src/i18n/locale_data");
{
    describe('l10n', function () {
        beforeAll(function () {
            locale_data_1.registerLocaleData(ro_1.default);
            locale_data_1.registerLocaleData(sr_1.default);
            locale_data_1.registerLocaleData(zgh_1.default);
            locale_data_1.registerLocaleData(fr_1.default);
        });
        describe('NgLocalization', function () {
            function roTests() {
                it('should return plural cases for the provided locale', testing_1.inject([localization_1.NgLocalization], function (l10n) {
                    expect(l10n.getPluralCategory(0)).toEqual('few');
                    expect(l10n.getPluralCategory(1)).toEqual('one');
                    expect(l10n.getPluralCategory(1212)).toEqual('few');
                    expect(l10n.getPluralCategory(1223)).toEqual('other');
                }));
            }
            describe('ro', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({
                        providers: [{ provide: core_1.LOCALE_ID, useValue: 'ro' }],
                    });
                });
                roTests();
            });
            describe('ro with v4 plurals', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({
                        providers: [
                            { provide: core_1.LOCALE_ID, useValue: 'ro' },
                            { provide: localization_1.DEPRECATED_PLURAL_FN, useValue: localization_1.getPluralCase }
                        ],
                    });
                });
                roTests();
            });
            function srTests() {
                it('should return plural cases for the provided locale', testing_1.inject([localization_1.NgLocalization], function (l10n) {
                    expect(l10n.getPluralCategory(1)).toEqual('one');
                    expect(l10n.getPluralCategory(2.1)).toEqual('one');
                    expect(l10n.getPluralCategory(3)).toEqual('few');
                    expect(l10n.getPluralCategory(0.2)).toEqual('few');
                    expect(l10n.getPluralCategory(2.11)).toEqual('other');
                    expect(l10n.getPluralCategory(2.12)).toEqual('other');
                }));
            }
            describe('sr', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({
                        providers: [{ provide: core_1.LOCALE_ID, useValue: 'sr' }],
                    });
                });
                srTests();
            });
            describe('sr with v4 plurals', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({
                        providers: [
                            { provide: core_1.LOCALE_ID, useValue: 'sr' },
                            { provide: localization_1.DEPRECATED_PLURAL_FN, useValue: localization_1.getPluralCase }
                        ],
                    });
                });
                srTests();
            });
        });
        describe('NgLocaleLocalization', function () {
            function ngLocaleLocalizationTests(getPluralCase) {
                it('should return the correct values for the "en" locale', function () {
                    var l10n = new localization_1.NgLocaleLocalization('en-US', getPluralCase);
                    expect(l10n.getPluralCategory(0)).toEqual('other');
                    expect(l10n.getPluralCategory(1)).toEqual('one');
                    expect(l10n.getPluralCategory(2)).toEqual('other');
                });
                it('should return the correct values for the "ro" locale', function () {
                    var l10n = new localization_1.NgLocaleLocalization('ro', getPluralCase);
                    expect(l10n.getPluralCategory(0)).toEqual('few');
                    expect(l10n.getPluralCategory(1)).toEqual('one');
                    expect(l10n.getPluralCategory(2)).toEqual('few');
                    expect(l10n.getPluralCategory(12)).toEqual('few');
                    expect(l10n.getPluralCategory(23)).toEqual('other');
                    expect(l10n.getPluralCategory(1212)).toEqual('few');
                    expect(l10n.getPluralCategory(1223)).toEqual('other');
                });
                it('should return the correct values for the "sr" locale', function () {
                    var l10n = new localization_1.NgLocaleLocalization('sr', getPluralCase);
                    expect(l10n.getPluralCategory(1)).toEqual('one');
                    expect(l10n.getPluralCategory(31)).toEqual('one');
                    expect(l10n.getPluralCategory(0.1)).toEqual('one');
                    expect(l10n.getPluralCategory(1.1)).toEqual('one');
                    expect(l10n.getPluralCategory(2.1)).toEqual('one');
                    expect(l10n.getPluralCategory(3)).toEqual('few');
                    expect(l10n.getPluralCategory(33)).toEqual('few');
                    expect(l10n.getPluralCategory(0.2)).toEqual('few');
                    expect(l10n.getPluralCategory(0.3)).toEqual('few');
                    expect(l10n.getPluralCategory(0.4)).toEqual('few');
                    expect(l10n.getPluralCategory(2.2)).toEqual('few');
                    expect(l10n.getPluralCategory(2.11)).toEqual('other');
                    expect(l10n.getPluralCategory(2.12)).toEqual('other');
                    expect(l10n.getPluralCategory(2.13)).toEqual('other');
                    expect(l10n.getPluralCategory(2.14)).toEqual('other');
                    expect(l10n.getPluralCategory(2.15)).toEqual('other');
                    expect(l10n.getPluralCategory(0)).toEqual('other');
                    expect(l10n.getPluralCategory(5)).toEqual('other');
                    expect(l10n.getPluralCategory(10)).toEqual('other');
                    expect(l10n.getPluralCategory(35)).toEqual('other');
                    expect(l10n.getPluralCategory(37)).toEqual('other');
                    expect(l10n.getPluralCategory(40)).toEqual('other');
                    expect(l10n.getPluralCategory(0.0)).toEqual('other');
                    expect(l10n.getPluralCategory(0.5)).toEqual('other');
                    expect(l10n.getPluralCategory(0.6)).toEqual('other');
                    expect(l10n.getPluralCategory(2)).toEqual('few');
                    expect(l10n.getPluralCategory(2.1)).toEqual('one');
                    expect(l10n.getPluralCategory(2.2)).toEqual('few');
                    expect(l10n.getPluralCategory(2.3)).toEqual('few');
                    expect(l10n.getPluralCategory(2.4)).toEqual('few');
                    expect(l10n.getPluralCategory(2.5)).toEqual('other');
                    expect(l10n.getPluralCategory(20)).toEqual('other');
                    expect(l10n.getPluralCategory(21)).toEqual('one');
                    expect(l10n.getPluralCategory(22)).toEqual('few');
                    expect(l10n.getPluralCategory(23)).toEqual('few');
                    expect(l10n.getPluralCategory(24)).toEqual('few');
                    expect(l10n.getPluralCategory(25)).toEqual('other');
                });
                it('should return the default value for a locale with no rule', function () {
                    var l10n = new localization_1.NgLocaleLocalization('zgh', getPluralCase);
                    expect(l10n.getPluralCategory(0)).toEqual('other');
                    expect(l10n.getPluralCategory(1)).toEqual('other');
                    expect(l10n.getPluralCategory(3)).toEqual('other');
                    expect(l10n.getPluralCategory(5)).toEqual('other');
                    expect(l10n.getPluralCategory(10)).toEqual('other');
                });
            }
            ngLocaleLocalizationTests(null);
            ngLocaleLocalizationTests(localization_1.getPluralCase);
        });
        function pluralCategoryTests(getPluralCase) {
            it('should return plural category', function () {
                var l10n = new localization_1.NgLocaleLocalization('fr', getPluralCase);
                expect(localization_1.getPluralCategory(0, ['one', 'other'], l10n)).toEqual('one');
                expect(localization_1.getPluralCategory(1, ['one', 'other'], l10n)).toEqual('one');
                expect(localization_1.getPluralCategory(5, ['one', 'other'], l10n)).toEqual('other');
            });
            it('should return discrete cases', function () {
                var l10n = new localization_1.NgLocaleLocalization('fr', getPluralCase);
                expect(localization_1.getPluralCategory(0, ['one', 'other', '=0'], l10n)).toEqual('=0');
                expect(localization_1.getPluralCategory(1, ['one', 'other'], l10n)).toEqual('one');
                expect(localization_1.getPluralCategory(5, ['one', 'other', '=5'], l10n)).toEqual('=5');
                expect(localization_1.getPluralCategory(6, ['one', 'other', '=5'], l10n)).toEqual('other');
            });
            it('should fallback to other when the case is not present', function () {
                var l10n = new localization_1.NgLocaleLocalization('ro', getPluralCase);
                expect(localization_1.getPluralCategory(1, ['one', 'other'], l10n)).toEqual('one');
                // 2 -> 'few'
                expect(localization_1.getPluralCategory(2, ['one', 'other'], l10n)).toEqual('other');
            });
            describe('errors', function () {
                it('should report an error when the "other" category is not present', function () {
                    expect(function () {
                        var l10n = new localization_1.NgLocaleLocalization('ro', getPluralCase);
                        // 2 -> 'few'
                        localization_1.getPluralCategory(2, ['one'], l10n);
                    }).toThrowError('No plural message found for value "2"');
                });
            });
        }
        describe('getPluralCategory', function () {
            pluralCategoryTests(null);
            pluralCategoryTests(localization_1.getPluralCase);
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemF0aW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vdGVzdC9pMThuL2xvY2FsaXphdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsaURBQWtEO0FBQ2xELGlEQUFrRDtBQUNsRCxtREFBb0Q7QUFDcEQsaURBQWtEO0FBQ2xELHNDQUF3QztBQUN4QyxpREFBc0Q7QUFDdEQsNERBQXlJO0FBRXpJLDBEQUE4RDtBQUU5RDtJQUNFLFFBQVEsQ0FBQyxNQUFNLEVBQUU7UUFDZixTQUFTLENBQUM7WUFDUixnQ0FBa0IsQ0FBQyxZQUFRLENBQUMsQ0FBQztZQUM3QixnQ0FBa0IsQ0FBQyxZQUFRLENBQUMsQ0FBQztZQUM3QixnQ0FBa0IsQ0FBQyxhQUFTLENBQUMsQ0FBQztZQUM5QixnQ0FBa0IsQ0FBQyxZQUFRLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtZQUN6QjtnQkFDRSxFQUFFLENBQUMsb0RBQW9ELEVBQ3BELGdCQUFNLENBQUMsQ0FBQyw2QkFBYyxDQUFDLEVBQUUsVUFBQyxJQUFvQjtvQkFDNUMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDcEQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8s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QUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDdEQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDdEQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDdEQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDdEQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFFdEQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDcEQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDcEQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDcEQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDcEQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDckQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDckQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFFckQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxD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