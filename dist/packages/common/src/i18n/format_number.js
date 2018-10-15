/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NumberFormatStyle, NumberSymbol, getLocaleNumberFormat, getLocaleNumberSymbol, getNumberOfCurrencyDigits } from './locale_data_api';
/** @type {?} */
export const NUMBER_FORMAT_REGEXP = /^(\d+)?\.((\d+)(-(\d+))?)?$/;
/** @type {?} */
const MAX_DIGITS = 22;
/** @type {?} */
const DECIMAL_SEP = '.';
/** @type {?} */
const ZERO_CHAR = '0';
/** @type {?} */
const PATTERN_SEP = ';';
/** @type {?} */
const GROUP_SEP = ',';
/** @type {?} */
const DIGIT_CHAR = '#';
/** @type {?} */
const CURRENCY_CHAR = '¤';
/** @type {?} */
const PERCENT_CHAR = '%';
/**
 * Transforms a number to a locale string based on a style and a format
 * @param {?} value
 * @param {?} pattern
 * @param {?} locale
 * @param {?} groupSymbol
 * @param {?} decimalSymbol
 * @param {?=} digitsInfo
 * @param {?=} isPercent
 * @return {?}
 */
function formatNumberToLocaleString(value, pattern, locale, groupSymbol, decimalSymbol, digitsInfo, isPercent = false) {
    /** @type {?} */
    let formattedText = '';
    /** @type {?} */
    let isZero = false;
    if (!isFinite(value)) {
        formattedText = getLocaleNumberSymbol(locale, NumberSymbol.Infinity);
    }
    else {
        /** @type {?} */
        let parsedNumber = parseNumber(value);
        if (isPercent) {
            parsedNumber = toPercent(parsedNumber);
        }
        /** @type {?} */
        let minInt = pattern.minInt;
        /** @type {?} */
        let minFraction = pattern.minFrac;
        /** @type {?} */
        let maxFraction = pattern.maxFrac;
        if (digitsInfo) {
            /** @type {?} */
            const parts = digitsInfo.match(NUMBER_FORMAT_REGEXP);
            if (parts === null) {
                throw new Error(`${digitsInfo} is not a valid digit info`);
            }
            /** @type {?} */
            const minIntPart = parts[1];
            /** @type {?} */
            const minFractionPart = parts[3];
            /** @type {?} */
            const maxFractionPart = parts[5];
            if (minIntPart != null) {
                minInt = parseIntAutoRadix(minIntPart);
            }
            if (minFractionPart != null) {
                minFraction = parseIntAutoRadix(minFractionPart);
            }
            if (maxFractionPart != null) {
                maxFraction = parseIntAutoRadix(maxFractionPart);
            }
            else if (minFractionPart != null && minFraction > maxFraction) {
                maxFraction = minFraction;
            }
        }
        roundNumber(parsedNumber, minFraction, maxFraction);
        /** @type {?} */
        let digits = parsedNumber.digits;
        /** @type {?} */
        let integerLen = parsedNumber.integerLen;
        /** @type {?} */
        const exponent = parsedNumber.exponent;
        /** @type {?} */
        let decimals = [];
        isZero = digits.every(d => !d);
        // pad zeros for small numbers
        for (; integerLen < minInt; integerLen++) {
            digits.unshift(0);
        }
        // pad zeros for small numbers
        for (; integerLen < 0; integerLen++) {
            digits.unshift(0);
        }
        // extract decimals digits
        if (integerLen > 0) {
            decimals = digits.splice(integerLen, digits.length);
        }
        else {
            decimals = digits;
            digits = [0];
        }
        /** @type {?} */
        const groups = [];
        if (digits.length >= pattern.lgSize) {
            groups.unshift(digits.splice(-pattern.lgSize, digits.length).join(''));
        }
        while (digits.length > pattern.gSize) {
            groups.unshift(digits.splice(-pattern.gSize, digits.length).join(''));
        }
        if (digits.length) {
            groups.unshift(digits.join(''));
        }
        formattedText = groups.join(getLocaleNumberSymbol(locale, groupSymbol));
        // append the decimal digits
        if (decimals.length) {
            formattedText += getLocaleNumberSymbol(locale, decimalSymbol) + decimals.join('');
        }
        if (exponent) {
            formattedText += getLocaleNumberSymbol(locale, NumberSymbol.Exponential) + '+' + exponent;
        }
    }
    if (value < 0 && !isZero) {
        formattedText = pattern.negPre + formattedText + pattern.negSuf;
    }
    else {
        formattedText = pattern.posPre + formattedText + pattern.posSuf;
    }
    return formattedText;
}
/**
 * \@ngModule CommonModule
 * \@description
 *
 * Formats a number as currency using locale rules.
 *
 * Use `currency` to format a number as currency.
 *
 * Where:
 * - `value` is a number.
 * - `locale` is a `string` defining the locale to use.
 * - `currency` is the string that represents the currency, it can be its symbol or its name.
 * - `currencyCode` is the [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code, such
 *    as `USD` for the US dollar and `EUR` for the euro.
 * - `digitInfo` See {\@link DecimalPipe} for more details.
 *
 *
 * @param {?} value
 * @param {?} locale
 * @param {?} currency
 * @param {?=} currencyCode
 * @param {?=} digitsInfo
 * @return {?}
 */
export function formatCurrency(value, locale, currency, currencyCode, digitsInfo) {
    /** @type {?} */
    const format = getLocaleNumberFormat(locale, NumberFormatStyle.Currency);
    /** @type {?} */
    const pattern = parseNumberFormat(format, getLocaleNumberSymbol(locale, NumberSymbol.MinusSign));
    pattern.minFrac = getNumberOfCurrencyDigits(/** @type {?} */ ((currencyCode)));
    pattern.maxFrac = pattern.minFrac;
    /** @type {?} */
    const res = formatNumberToLocaleString(value, pattern, locale, NumberSymbol.CurrencyGroup, NumberSymbol.CurrencyDecimal, digitsInfo);
    return res
        .replace(CURRENCY_CHAR, currency)
        // if we have 2 time the currency character, the second one is ignored
        .replace(CURRENCY_CHAR, '');
}
/**
 * \@ngModule CommonModule
 * \@description
 *
 * Formats a number as a percentage according to locale rules.
 *
 * Where:
 * - `value` is a number.
 * - `locale` is a `string` defining the locale to use.
 * - `digitInfo` See {\@link DecimalPipe} for more details.
 *
 *
 * @param {?} value
 * @param {?} locale
 * @param {?=} digitsInfo
 * @return {?}
 */
export function formatPercent(value, locale, digitsInfo) {
    /** @type {?} */
    const format = getLocaleNumberFormat(locale, NumberFormatStyle.Percent);
    /** @type {?} */
    const pattern = parseNumberFormat(format, getLocaleNumberSymbol(locale, NumberSymbol.MinusSign));
    /** @type {?} */
    const res = formatNumberToLocaleString(value, pattern, locale, NumberSymbol.Group, NumberSymbol.Decimal, digitsInfo, true);
    return res.replace(new RegExp(PERCENT_CHAR, 'g'), getLocaleNumberSymbol(locale, NumberSymbol.PercentSign));
}
/**
 * \@ngModule CommonModule
 * \@description
 *
 * Formats a number as text. Group sizing and separator and other locale-specific
 * configurations are based on the locale.
 *
 * Where:
 * - `value` is a number.
 * - `locale` is a `string` defining the locale to use.
 * - `digitInfo` See {\@link DecimalPipe} for more details.
 *
 *
 * @param {?} value
 * @param {?} locale
 * @param {?=} digitsInfo
 * @return {?}
 */
export function formatNumber(value, locale, digitsInfo) {
    /** @type {?} */
    const format = getLocaleNumberFormat(locale, NumberFormatStyle.Decimal);
    /** @type {?} */
    const pattern = parseNumberFormat(format, getLocaleNumberSymbol(locale, NumberSymbol.MinusSign));
    return formatNumberToLocaleString(value, pattern, locale, NumberSymbol.Group, NumberSymbol.Decimal, digitsInfo);
}
/**
 * @record
 */
function ParsedNumberFormat() { }
/** @type {?} */
ParsedNumberFormat.prototype.minInt;
/** @type {?} */
ParsedNumberFormat.prototype.minFrac;
/** @type {?} */
ParsedNumberFormat.prototype.maxFrac;
/** @type {?} */
ParsedNumberFormat.prototype.posPre;
/** @type {?} */
ParsedNumberFormat.prototype.posSuf;
/** @type {?} */
ParsedNumberFormat.prototype.negPre;
/** @type {?} */
ParsedNumberFormat.prototype.negSuf;
/** @type {?} */
ParsedNumberFormat.prototype.gSize;
/** @type {?} */
ParsedNumberFormat.prototype.lgSize;
/**
 * @param {?} format
 * @param {?=} minusSign
 * @return {?}
 */
function parseNumberFormat(format, minusSign = '-') {
    /** @type {?} */
    const p = {
        minInt: 1,
        minFrac: 0,
        maxFrac: 0,
        posPre: '',
        posSuf: '',
        negPre: '',
        negSuf: '',
        gSize: 0,
        lgSize: 0
    };
    /** @type {?} */
    const patternParts = format.split(PATTERN_SEP);
    /** @type {?} */
    const positive = patternParts[0];
    /** @type {?} */
    const negative = patternParts[1];
    /** @type {?} */
    const positiveParts = positive.indexOf(DECIMAL_SEP) !== -1 ?
        positive.split(DECIMAL_SEP) :
        [
            positive.substring(0, positive.lastIndexOf(ZERO_CHAR) + 1),
            positive.substring(positive.lastIndexOf(ZERO_CHAR) + 1)
        ];
    /** @type {?} */
    const integer = positiveParts[0];
    /** @type {?} */
    const fraction = positiveParts[1] || '';
    p.posPre = integer.substr(0, integer.indexOf(DIGIT_CHAR));
    for (let i = 0; i < fraction.length; i++) {
        /** @type {?} */
        const ch = fraction.charAt(i);
        if (ch === ZERO_CHAR) {
            p.minFrac = p.maxFrac = i + 1;
        }
        else if (ch === DIGIT_CHAR) {
            p.maxFrac = i + 1;
        }
        else {
            p.posSuf += ch;
        }
    }
    /** @type {?} */
    const groups = integer.split(GROUP_SEP);
    p.gSize = groups[1] ? groups[1].length : 0;
    p.lgSize = (groups[2] || groups[1]) ? (groups[2] || groups[1]).length : 0;
    if (negative) {
        /** @type {?} */
        const trunkLen = positive.length - p.posPre.length - p.posSuf.length;
        /** @type {?} */
        const pos = negative.indexOf(DIGIT_CHAR);
        p.negPre = negative.substr(0, pos).replace(/'/g, '');
        p.negSuf = negative.substr(pos + trunkLen).replace(/'/g, '');
    }
    else {
        p.negPre = minusSign + p.posPre;
        p.negSuf = p.posSuf;
    }
    return p;
}
/**
 * @record
 */
function ParsedNumber() { }
/** @type {?} */
ParsedNumber.prototype.digits;
/** @type {?} */
ParsedNumber.prototype.exponent;
/** @type {?} */
ParsedNumber.prototype.integerLen;
/**
 * @param {?} parsedNumber
 * @return {?}
 */
function toPercent(parsedNumber) {
    // if the number is 0, don't do anything
    if (parsedNumber.digits[0] === 0) {
        return parsedNumber;
    }
    /** @type {?} */
    const fractionLen = parsedNumber.digits.length - parsedNumber.integerLen;
    if (parsedNumber.exponent) {
        parsedNumber.exponent += 2;
    }
    else {
        if (fractionLen === 0) {
            parsedNumber.digits.push(0, 0);
        }
        else if (fractionLen === 1) {
            parsedNumber.digits.push(0);
        }
        parsedNumber.integerLen += 2;
    }
    return parsedNumber;
}
/**
 * Parses a number.
 * Significant bits of this parse algorithm came from https://github.com/MikeMcl/big.js/
 * @param {?} num
 * @return {?}
 */
function parseNumber(num) {
    /** @type {?} */
    let numStr = Math.abs(num) + '';
    /** @type {?} */
    let exponent = 0;
    /** @type {?} */
    let digits;
    /** @type {?} */
    let integerLen;
    /** @type {?} */
    let i;
    /** @type {?} */
    let j;
    /** @type {?} */
    let zeros;
    // Decimal point?
    if ((integerLen = numStr.indexOf(DECIMAL_SEP)) > -1) {
        numStr = numStr.replace(DECIMAL_SEP, '');
    }
    // Exponential form?
    if ((i = numStr.search(/e/i)) > 0) {
        // Work out the exponent.
        if (integerLen < 0)
            integerLen = i;
        integerLen += +numStr.slice(i + 1);
        numStr = numStr.substring(0, i);
    }
    else if (integerLen < 0) {
        // There was no decimal point or exponent so it is an integer.
        integerLen = numStr.length;
    }
    // Count the number of leading zeros.
    for (i = 0; numStr.charAt(i) === ZERO_CHAR; i++) { /* empty */
        /* empty */
    }
    if (i === (zeros = numStr.length)) {
        // The digits are all zero.
        digits = [0];
        integerLen = 1;
    }
    else {
        // Count the number of trailing zeros
        zeros--;
        while (numStr.charAt(zeros) === ZERO_CHAR)
            zeros--;
        // Trailing zeros are insignificant so ignore them
        integerLen -= i;
        digits = [];
        // Convert string to array of digits without leading/trailing zeros.
        for (j = 0; i <= zeros; i++, j++) {
            digits[j] = Number(numStr.charAt(i));
        }
    }
    // If the number overflows the maximum allowed digits then use an exponent.
    if (integerLen > MAX_DIGITS) {
        digits = digits.splice(0, MAX_DIGITS - 1);
        exponent = integerLen - 1;
        integerLen = 1;
    }
    return { digits, exponent, integerLen };
}
/**
 * Round the parsed number to the specified number of decimal places
 * This function changes the parsedNumber in-place
 * @param {?} parsedNumber
 * @param {?} minFrac
 * @param {?} maxFrac
 * @return {?}
 */
function roundNumber(parsedNumber, minFrac, maxFrac) {
    if (minFrac > maxFrac) {
        throw new Error(`The minimum number of digits after fraction (${minFrac}) is higher than the maximum (${maxFrac}).`);
    }
    /** @type {?} */
    let digits = parsedNumber.digits;
    /** @type {?} */
    let fractionLen = digits.length - parsedNumber.integerLen;
    /** @type {?} */
    const fractionSize = Math.min(Math.max(minFrac, fractionLen), maxFrac);
    /** @type {?} */
    let roundAt = fractionSize + parsedNumber.integerLen;
    /** @type {?} */
    let digit = digits[roundAt];
    if (roundAt > 0) {
        // Drop fractional digits beyond `roundAt`
        digits.splice(Math.max(parsedNumber.integerLen, roundAt));
        // Set non-fractional digits beyond `roundAt` to 0
        for (let j = roundAt; j < digits.length; j++) {
            digits[j] = 0;
        }
    }
    else {
        // We rounded to zero so reset the parsedNumber
        fractionLen = Math.max(0, fractionLen);
        parsedNumber.integerLen = 1;
        digits.length = Math.max(1, roundAt = fractionSize + 1);
        digits[0] = 0;
        for (let i = 1; i < roundAt; i++)
            digits[i] = 0;
    }
    if (digit >= 5) {
        if (roundAt - 1 < 0) {
            for (let k = 0; k > roundAt; k--) {
                digits.unshift(0);
                parsedNumber.integerLen++;
            }
            digits.unshift(1);
            parsedNumber.integerLen++;
        }
        else {
            digits[roundAt - 1]++;
        }
    }
    // Pad out with zeros to get the required fraction length
    for (; fractionLen < Math.max(0, fractionSize); fractionLen++)
        digits.push(0);
    /** @type {?} */
    let dropTrailingZeros = fractionSize !== 0;
    /** @type {?} */
    const minLen = minFrac + parsedNumber.integerLen;
    /** @type {?} */
    const carry = digits.reduceRight(function (carry, d, i, digits) {
        d = d + carry;
        digits[i] = d < 10 ? d : d - 10; // d % 10
        if (dropTrailingZeros) {
            // Do not keep meaningless fractional trailing zeros (e.g. 15.52000 --> 15.52)
            if (digits[i] === 0 && i >= minLen) {
                digits.pop();
            }
            else {
                dropTrailingZeros = false;
            }
        }
        return d >= 10 ? 1 : 0; // Math.floor(d / 10);
    }, 0);
    if (carry) {
        digits.unshift(carry);
        parsedNumber.integerLen++;
    }
}
/**
 * @param {?} text
 * @return {?}
 */
export function parseIntAutoRadix(text) {
    /** @type {?} */
    const result = parseInt(text);
    if (isNaN(result)) {
        throw new Error('Invalid integer literal when parsing ' + text);
    }
    return result;
}
//# sourceMappingURL=format_number.js.map