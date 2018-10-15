"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var format_number_1 = require("../../i18n/format_number");
var locale_data_api_1 = require("../../i18n/locale_data_api");
var invalid_pipe_argument_error_1 = require("../invalid_pipe_argument_error");
var intl_1 = require("./intl");
function formatNumber(pipe, locale, value, style, digits, currency, currencyAsSymbol) {
    if (currency === void 0) { currency = null; }
    if (currencyAsSymbol === void 0) { currencyAsSymbol = false; }
    if (value == null)
        return null;
    // Convert strings to numbers
    value = typeof value === 'string' && !isNaN(+value - parseFloat(value)) ? +value : value;
    if (typeof value !== 'number') {
        throw invalid_pipe_argument_error_1.invalidPipeArgumentError(pipe, value);
    }
    var minInt;
    var minFraction;
    var maxFraction;
    if (style !== locale_data_api_1.NumberFormatStyle.Currency) {
        // rely on Intl default for currency
        minInt = 1;
        minFraction = 0;
        maxFraction = 3;
    }
    if (digits) {
        var parts = digits.match(format_number_1.NUMBER_FORMAT_REGEXP);
        if (parts === null) {
            throw new Error(digits + " is not a valid digit info for number pipes");
        }
        if (parts[1] != null) { // min integer digits
            minInt = format_number_1.parseIntAutoRadix(parts[1]);
        }
        if (parts[3] != null) { // min fraction digits
            minFraction = format_number_1.parseIntAutoRadix(parts[3]);
        }
        if (parts[5] != null) { // max fraction digits
            maxFraction = format_number_1.parseIntAutoRadix(parts[5]);
        }
    }
    return intl_1.NumberFormatter.format(value, locale, style, {
        minimumIntegerDigits: minInt,
        minimumFractionDigits: minFraction,
        maximumFractionDigits: maxFraction,
        currency: currency,
        currencyAsSymbol: currencyAsSymbol,
    });
}
/**
 * Formats a number as text. Group sizing and separator and other locale-specific
 * configurations are based on the active locale.
 *
 * where `expression` is a number:
 *  - `digitInfo` is a `string` which has a following format: <br>
 *     <code>{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}</code>
 *   - `minIntegerDigits` is the minimum number of integer digits to use. Defaults to `1`.
 *   - `minFractionDigits` is the minimum number of digits after fraction. Defaults to `0`.
 *   - `maxFractionDigits` is the maximum number of digits after fraction. Defaults to `3`.
 *
 * For more information on the acceptable range for each of these numbers and other
 * details see your native internationalization library.
 *
 * WARNING: this pipe uses the Internationalization API which is not yet available in all browsers
 * and may require a polyfill. See [Browser Support](guide/browser-support) for details.
 *
 * @usageNotes
 *
 * ### Example
 *
 * {@example common/pipes/ts/number_pipe.ts region='DeprecatedNumberPipe'}
 *
 * @ngModule CommonModule
 */
var DeprecatedDecimalPipe = /** @class */ (function () {
    function DeprecatedDecimalPipe(_locale) {
        this._locale = _locale;
    }
    DeprecatedDecimalPipe_1 = DeprecatedDecimalPipe;
    DeprecatedDecimalPipe.prototype.transform = function (value, digits) {
        return formatNumber(DeprecatedDecimalPipe_1, this._locale, value, locale_data_api_1.NumberFormatStyle.Decimal, digits);
    };
    var DeprecatedDecimalPipe_1;
    DeprecatedDecimalPipe = DeprecatedDecimalPipe_1 = __decorate([
        core_1.Pipe({ name: 'number' }),
        __param(0, core_1.Inject(core_1.LOCALE_ID)),
        __metadata("design:paramtypes", [String])
    ], DeprecatedDecimalPipe);
    return DeprecatedDecimalPipe;
}());
exports.DeprecatedDecimalPipe = DeprecatedDecimalPipe;
/**
 * @ngModule CommonModule
 *
 * @description
 *
 * Formats a number as percentage according to locale rules.
 *
 * - `digitInfo` See {@link DecimalPipe} for detailed description.
 *
 * WARNING: this pipe uses the Internationalization API which is not yet available in all browsers
 * and may require a polyfill. See [Browser Support](guide/browser-support) for details.
 *
 * @usageNotes
 *
 * ### Example
 *
 * {@example common/pipes/ts/percent_pipe.ts region='DeprecatedPercentPipe'}
 *
 *
 */
var DeprecatedPercentPipe = /** @class */ (function () {
    function DeprecatedPercentPipe(_locale) {
        this._locale = _locale;
    }
    DeprecatedPercentPipe_1 = DeprecatedPercentPipe;
    DeprecatedPercentPipe.prototype.transform = function (value, digits) {
        return formatNumber(DeprecatedPercentPipe_1, this._locale, value, locale_data_api_1.NumberFormatStyle.Percent, digits);
    };
    var DeprecatedPercentPipe_1;
    DeprecatedPercentPipe = DeprecatedPercentPipe_1 = __decorate([
        core_1.Pipe({ name: 'percent' }),
        __param(0, core_1.Inject(core_1.LOCALE_ID)),
        __metadata("design:paramtypes", [String])
    ], DeprecatedPercentPipe);
    return DeprecatedPercentPipe;
}());
exports.DeprecatedPercentPipe = DeprecatedPercentPipe;
/**
 * @ngModule CommonModule
 * @description
 *
 * Formats a number as currency using locale rules.
 *
 * Use `currency` to format a number as currency.
 *
 * - `currencyCode` is the [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code, such
 *    as `USD` for the US dollar and `EUR` for the euro.
 * - `symbolDisplay` is a boolean indicating whether to use the currency symbol or code.
 *   - `true`: use symbol (e.g. `$`).
 *   - `false`(default): use code (e.g. `USD`).
 * - `digitInfo` See {@link DecimalPipe} for detailed description.
 *
 * WARNING: this pipe uses the Internationalization API which is not yet available in all browsers
 * and may require a polyfill. See [Browser Support](guide/browser-support) for details.
 *
 * @usageNotes
 *
 * ### Example
 *
 * {@example common/pipes/ts/currency_pipe.ts region='DeprecatedCurrencyPipe'}
 *
 *
 */
var DeprecatedCurrencyPipe = /** @class */ (function () {
    function DeprecatedCurrencyPipe(_locale) {
        this._locale = _locale;
    }
    DeprecatedCurrencyPipe_1 = DeprecatedCurrencyPipe;
    DeprecatedCurrencyPipe.prototype.transform = function (value, currencyCode, symbolDisplay, digits) {
        if (currencyCode === void 0) { currencyCode = 'USD'; }
        if (symbolDisplay === void 0) { symbolDisplay = false; }
        return formatNumber(DeprecatedCurrencyPipe_1, this._locale, value, locale_data_api_1.NumberFormatStyle.Currency, digits, currencyCode, symbolDisplay);
    };
    var DeprecatedCurrencyPipe_1;
    DeprecatedCurrencyPipe = DeprecatedCurrencyPipe_1 = __decorate([
        core_1.Pipe({ name: 'currency' }),
        __param(0, core_1.Inject(core_1.LOCALE_ID)),
        __metadata("design:paramtypes", [String])
    ], DeprecatedCurrencyPipe);
    return DeprecatedCurrencyPipe;
}());
exports.DeprecatedCurrencyPipe = DeprecatedCurrencyPipe;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyX3BpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vc3JjL3BpcGVzL2RlcHJlY2F0ZWQvbnVtYmVyX3BpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBMkU7QUFDM0UsMERBQWlGO0FBQ2pGLDhEQUE2RDtBQUM3RCw4RUFBd0U7QUFDeEUsK0JBQXVDO0FBRXZDLHNCQUNJLElBQWUsRUFBRSxNQUFjLEVBQUUsS0FBc0IsRUFBRSxLQUF3QixFQUNqRixNQUFzQixFQUFFLFFBQThCLEVBQ3RELGdCQUFpQztJQURULHlCQUFBLEVBQUEsZUFBOEI7SUFDdEQsaUNBQUEsRUFBQSx3QkFBaUM7SUFDbkMsSUFBSSxLQUFLLElBQUksSUFBSTtRQUFFLE9BQU8sSUFBSSxDQUFDO0lBRS9CLDZCQUE2QjtJQUM3QixLQUFLLEdBQUcsT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ3pGLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1FBQzdCLE1BQU0sc0RBQXdCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzdDO0lBRUQsSUFBSSxNQUF3QixDQUFDO0lBQzdCLElBQUksV0FBNkIsQ0FBQztJQUNsQyxJQUFJLFdBQTZCLENBQUM7SUFDbEMsSUFBSSxLQUFLLEtBQUssbUNBQWlCLENBQUMsUUFBUSxFQUFFO1FBQ3hDLG9DQUFvQztRQUNwQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsV0FBVyxHQUFHLENBQUMsQ0FBQztRQUNoQixXQUFXLEdBQUcsQ0FBQyxDQUFDO0tBQ2pCO0lBRUQsSUFBSSxNQUFN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