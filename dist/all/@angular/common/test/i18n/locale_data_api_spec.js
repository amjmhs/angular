"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ca_ES_VALENCIA_1 = require("@angular/common/locales/ca-ES-VALENCIA");
var en_1 = require("@angular/common/locales/en");
var fr_1 = require("@angular/common/locales/fr");
var zh_1 = require("@angular/common/locales/zh");
var fr_CA_1 = require("@angular/common/locales/fr-CA");
var en_AU_1 = require("@angular/common/locales/en-AU");
var locale_data_1 = require("../../src/i18n/locale_data");
var locale_data_api_1 = require("../../src/i18n/locale_data_api");
{
    describe('locale data api', function () {
        beforeAll(function () {
            locale_data_1.registerLocaleData(ca_ES_VALENCIA_1.default);
            locale_data_1.registerLocaleData(en_1.default);
            locale_data_1.registerLocaleData(fr_1.default);
            locale_data_1.registerLocaleData(fr_CA_1.default);
            locale_data_1.registerLocaleData(fr_1.default, 'fake-id');
            locale_data_1.registerLocaleData(fr_CA_1.default, 'fake_Id2');
            locale_data_1.registerLocaleData(zh_1.default);
            locale_data_1.registerLocaleData(en_AU_1.default);
        });
        describe('findLocaleData', function () {
            it('should throw if the LOCALE_DATA for the chosen locale or its parent locale is not available', function () {
                expect(function () { return locale_data_api_1.findLocaleData('pt-AO'); })
                    .toThrowError(/Missing locale data for the locale "pt-AO"/);
            });
            it('should return english data if the locale is en-US', function () { expect(locale_data_api_1.findLocaleData('en-US')).toEqual(en_1.default); });
            it('should return the exact LOCALE_DATA if it is available', function () { expect(locale_data_api_1.findLocaleData('fr-CA')).toEqual(fr_CA_1.default); });
            it('should return the parent LOCALE_DATA if it exists and exact locale is not available', function () { expect(locale_data_api_1.findLocaleData('fr-BE')).toEqual(fr_1.default); });
            it("should find the LOCALE_DATA even if the locale id is badly formatted", function () {
                expect(locale_data_api_1.findLocaleData('ca-ES-VALENCIA')).toEqual(ca_ES_VALENCIA_1.default);
                expect(locale_data_api_1.findLocaleData('CA_es_Valencia')).toEqual(ca_ES_VALENCIA_1.default);
            });
            it("should find the LOCALE_DATA if the locale id was registered", function () {
                expect(locale_data_api_1.findLocaleData('fake-id')).toEqual(fr_1.default);
                expect(locale_data_api_1.findLocaleData('fake_iD')).toEqual(fr_1.default);
                expect(locale_data_api_1.findLocaleData('fake-id2')).toEqual(fr_CA_1.default);
            });
        });
        describe('getting currency symbol', function () {
            it('should return the correct symbol', function () {
                expect(locale_data_api_1.getCurrencySymbol('USD', 'wide')).toEqual('$');
                expect(locale_data_api_1.getCurrencySymbol('USD', 'narrow')).toEqual('$');
                expect(locale_data_api_1.getCurrencySymbol('AUD', 'wide')).toEqual('A$');
                expect(locale_data_api_1.getCurrencySymbol('AUD', 'narrow')).toEqual('$');
                expect(locale_data_api_1.getCurrencySymbol('CRC', 'wide')).toEqual('CRC');
                expect(locale_data_api_1.getCurrencySymbol('CRC', 'narrow')).toEqual('₡');
                expect(locale_data_api_1.getCurrencySymbol('unexisting_ISO_code', 'wide')).toEqual('unexisting_ISO_code');
                expect(locale_data_api_1.getCurrencySymbol('unexisting_ISO_code', 'narrow')).toEqual('unexisting_ISO_code');
                expect(locale_data_api_1.getCurrencySymbol('USD', 'wide', 'en-AU')).toEqual('USD');
                expect(locale_data_api_1.getCurrencySymbol('USD', 'narrow', 'en-AU')).toEqual('$');
                expect(locale_data_api_1.getCurrencySymbol('AUD', 'wide', 'en-AU')).toEqual('$');
                expect(locale_data_api_1.getCurrencySymbol('AUD', 'narrow', 'en-AU')).toEqual('$');
                expect(locale_data_api_1.getCurrencySymbol('USD', 'wide', 'fr')).toEqual('$US');
            });
        });
        describe('getNbOfCurrencyDigits', function () {
            it('should return the correct value', function () {
                expect(locale_data_api_1.getNumberOfCurrencyDigits('USD')).toEqual(2);
                expect(locale_data_api_1.getNumberOfCurrencyDigits('IDR')).toEqual(0);
                expect(locale_data_api_1.getNumberOfCurrencyDigits('BHD')).toEqual(3);
                expect(locale_data_api_1.getNumberOfCurrencyDigits('unexisting_ISO_code')).toEqual(2);
            });
        });
        describe('getLastDefinedValue', function () {
            it('should find the last defined date format when format not defined', function () { expect(locale_data_api_1.getLocaleDateFormat('zh', locale_data_api_1.FormatWidth.Long)).toEqual('y年M月d日'); });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxlX2RhdGFfYXBpX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vdGVzdC9pMThuL2xvY2FsZV9kYXRhX2FwaV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgseUVBQXdFO0FBQ3hFLGlEQUFrRDtBQUNsRCxpREFBa0Q7QUFDbEQsaURBQWtEO0FBQ2xELHVEQUF1RDtBQUN2RCx1REFBdUQ7QUFDdkQsMERBQThEO0FBQzlELGtFQUE4STtBQUU5STtJQUNFLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtRQUMxQixTQUFTLENBQUM7WUFDUixnQ0FBa0IsQ0FBQyx3QkFBa0IsQ0FBQyxDQUFDO1lBQ3ZDLGdDQUFrQixDQUFDLFlBQVEsQ0FBQyxDQUFDO1lBQzdCLGdDQUFrQixDQUFDLFlBQVEsQ0FBQyxDQUFDO1lBQzdCLGdDQUFrQixDQUFDLGVBQVUsQ0FBQyxDQUFDO1lBQy9CLGdDQUFrQixDQUFDLFlBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN4QyxnQ0FBa0IsQ0FBQyxlQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDM0MsZ0NBQWtCLENBQUMsWUFBUSxDQUFDLENBQUM7WUFDN0IsZ0NBQWtCLENBQUMsZUFBVSxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7WUFDekIsRUFBRSxDQUFDLDZGQUE2RixFQUM3RjtnQkFDRSxNQUFNLENBQUMsY0FBTSxPQUFBLGdDQUFjLENBQUMsT0FBTyxDQUFDLEVBQXZCLENBQXVCLENBQUM7cUJBQ2hDLFlBQVksQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1lBQ2xFLENBQUMsQ0FBQyxDQUFDO1lBRU4sRUFBRSxDQUFDLG1EQUFtRCxFQUNuRCxjQUFRLE1BQU0sQ0FBQyxnQ0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFD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