"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var locale_data_api_1 = require("../../i18n/locale_data_api");
var NumberFormatter = /** @class */ (function () {
    function NumberFormatter() {
    }
    NumberFormatter.format = function (num, locale, style, opts) {
        if (opts === void 0) { opts = {}; }
        var minimumIntegerDigits = opts.minimumIntegerDigits, minimumFractionDigits = opts.minimumFractionDigits, maximumFractionDigits = opts.maximumFractionDigits, currency = opts.currency, _a = opts.currencyAsSymbol, currencyAsSymbol = _a === void 0 ? false : _a;
        var options = {
            minimumIntegerDigits: minimumIntegerDigits,
            minimumFractionDigits: minimumFractionDigits,
            maximumFractionDigits: maximumFractionDigits,
            style: locale_data_api_1.NumberFormatStyle[style].toLowerCase()
        };
        if (style == locale_data_api_1.NumberFormatStyle.Currency) {
            options.currency = typeof currency == 'string' ? currency : undefined;
            options.currencyDisplay = currencyAsSymbol ? 'symbol' : 'code';
        }
        return new Intl.NumberFormat(locale, options).format(num);
    };
    return NumberFormatter;
}());
exports.NumberFormatter = NumberFormatter;
var DATE_FORMATS_SPLIT = /((?:[^yMLdHhmsazZEwGjJ']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|J+|j+|m+|s+|a|z|Z|G+|w+))(.*)/;
var PATTERN_ALIASES = {
    // Keys are quoted so they do not get renamed during closure compilation.
    'yMMMdjms': datePartGetterFactory(combine([
        digitCondition('year', 1),
        nameCondition('month', 3),
        digitCondition('day', 1),
        digitCondition('hour', 1),
        digitCondition('minute', 1),
        digitCondition('second', 1),
    ])),
    'yMdjm': datePartGetterFactory(combine([
        digitCondition('year', 1), digitCondition('month', 1), digitCondition('day', 1),
        digitCondition('hour', 1), digitCondition('minute', 1)
    ])),
    'yMMMMEEEEd': datePartGetterFactory(combine([
        digitCondition('year', 1), nameCondition('month', 4), nameCondition('weekday', 4),
        digitCondition('day', 1)
    ])),
    'yMMMMd': datePartGetterFactory(combine([digitCondition('year', 1), nameCondition('month', 4), digitCondition('day', 1)])),
    'yMMMd': datePartGetterFactory(combine([digitCondition('year', 1), nameCondition('month', 3), digitCondition('day', 1)])),
    'yMd': datePartGetterFactory(combine([digitCondition('year', 1), digitCondition('month', 1), digitCondition('day', 1)])),
    'jms': datePartGetterFactory(combine([digitCondition('hour', 1), digitCondition('second', 1), digitCondition('minute', 1)])),
    'jm': datePartGetterFactory(combine([digitCondition('hour', 1), digitCondition('minute', 1)]))
};
var DATE_FORMATS = {
    // Keys are quoted so they do not get renamed.
    'yyyy': datePartGetterFactory(digitCondition('year', 4)),
    'yy': datePartGetterFactory(digitCondition('year', 2)),
    'y': datePartGetterFactory(digitCondition('year', 1)),
    'MMMM': datePartGetterFactory(nameCondition('month', 4)),
    'MMM': datePartGetterFactory(nameCondition('month', 3)),
    'MM': datePartGetterFactory(digitCondition('month', 2)),
    'M': datePartGetterFactory(digitCondition('month', 1)),
    'LLLL': datePartGetterFactory(nameCondition('month', 4)),
    'L': datePartGetterFactory(nameCondition('month', 1)),
    'dd': datePartGetterFactory(digitCondition('day', 2)),
    'd': datePartGetterFactory(digitCondition('day', 1)),
    'HH': digitModifier(hourExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 2), false)))),
    'H': hourExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 1), false))),
    'hh': digitModifier(hourExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 2), true)))),
    'h': hourExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 1), true))),
    'jj': datePartGetterFactory(digitCondition('hour', 2)),
    'j': datePartGetterFactory(digitCondition('hour', 1)),
    'mm': digitModifier(datePartGetterFactory(digitCondition('minute', 2))),
    'm': datePartGetterFactory(digitCondition('minute', 1)),
    'ss': digitModifier(datePartGetterFactory(digitCondition('second', 2))),
    's': datePartGetterFactory(digitCondition('second', 1)),
    // while ISO 8601 requires fractions to be prefixed with `.` or `,`
    // we can be just safely rely on using `sss` since we currently don't support single or two digit
    // fractions
    'sss': datePartGetterFactory(digitCondition('second', 3)),
    'EEEE': datePartGetterFactory(nameCondition('weekday', 4)),
    'EEE': datePartGetterFactory(nameCondition('weekday', 3)),
    'EE': datePartGetterFactory(nameCondition('weekday', 2)),
    'E': datePartGetterFactory(nameCondition('weekday', 1)),
    'a': hourClockExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 1), true))),
    'Z': timeZoneGetter('short'),
    'z': timeZoneGetter('long'),
    'ww': datePartGetterFactory({}),
    // first Thursday of the year. not support ?
    'w': datePartGetterFactory({}),
    // of the year not support ?
    'G': datePartGetterFactory(nameCondition('era', 1)),
    'GG': datePartGetterFactory(nameCondition('era', 2)),
    'GGG': datePartGetterFactory(nameCondition('era', 3)),
    'GGGG': datePartGetterFactory(nameCondition('era', 4))
};
function digitModifier(inner) {
    return function (date, locale) {
        var result = inner(date, locale);
        return result.length == 1 ? '0' + result : result;
    };
}
function hourClockExtractor(inner) {
    return function (date, locale) { return inner(date, locale).split(' ')[1]; };
}
function hourExtractor(inner) {
    return function (date, locale) { return inner(date, locale).split(' ')[0]; };
}
function intlDateFormat(date, locale, options) {
    return new Intl.DateTimeFormat(locale, options).format(date).replace(/[\u200e\u200f]/g, '');
}
function timeZoneGetter(timezone) {
    // To workaround `Intl` API restriction for single timezone let format with 24 hours
    var options = { hour: '2-digit', hour12: false, timeZoneName: timezone };
    return function (date, locale) {
        var result = intlDateFormat(date, locale, options);
        // Then extract first 3 letters that related to hours
        return result ? result.substring(3) : '';
    };
}
function hour12Modify(options, value) {
    options.hour12 = value;
    return options;
}
function digitCondition(prop, len) {
    var result = {};
    result[prop] = len === 2 ? '2-digit' : 'numeric';
    return result;
}
function nameCondition(prop, len) {
    var result = {};
    if (len < 4) {
        result[prop] = len > 1 ? 'short' : 'narrow';
    }
    else {
        result[prop] = 'long';
    }
    return result;
}
function combine(options) {
    return options.reduce(function (merged, opt) { return (__assign({}, merged, opt)); }, {});
}
function datePartGetterFactory(ret) {
    return function (date, locale) { return intlDateFormat(date, locale, ret); };
}
var DATE_FORMATTER_CACHE = new Map();
function dateFormatter(format, date, locale) {
    var fn = PATTERN_ALIASES[format];
    if (fn)
        return fn(date, locale);
    var cacheKey = format;
    var parts = DATE_FORMATTER_CACHE.get(cacheKey);
    if (!parts) {
        parts = [];
        var match = void 0;
        DATE_FORMATS_SPLIT.exec(format);
        var _format = format;
        while (_format) {
            match = DATE_FORMATS_SPLIT.exec(_format);
            if (match) {
                parts = parts.concat(match.slice(1));
                _format = parts.pop();
            }
            else {
                parts.push(_format);
                _format = null;
            }
        }
        DATE_FORMATTER_CACHE.set(cacheKey, parts);
    }
    return parts.reduce(function (text, part) {
        var fn = DATE_FORMATS[part];
        return text + (fn ? fn(date, locale) : partToTime(part));
    }, '');
}
function partToTime(part) {
    return part === '\'\'' ? '\'' : part.replace(/(^'|'$)/g, '').replace(/''/g, '\'');
}
var DateFormatter = /** @class */ (function () {
    function DateFormatter() {
    }
    DateFormatter.format = function (date, locale, pattern) {
        return dateFormatter(pattern, date, locale);
    };
    return DateFormatter;
}());
exports.DateFormatter = DateFormatter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50bC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi9zcmMvcGlwZXMvZGVwcmVjYXRlZC9pbnRsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCw4REFBNkQ7QUFFN0Q7SUFBQTtJQXVCQSxDQUFDO0lBdEJRLHNCQUFNLEdBQWIsVUFBYyxHQUFXLEVBQUUsTUFBYyxFQUFFLEtBQXdCLEVBQUUsSUFNL0Q7UUFOK0QscUJBQUEsRUFBQSxTQU0vRDtRQUNHLElBQUEsZ0RBQW9CLEVBQUUsa0RBQXFCLEVBQUUsa0RBQXFCLEVBQUUsd0JBQVEsRUFDNUUsMEJBQXdCLEVBQXhCLDZDQUF3QixDQUFTO1FBQ3hDLElBQU0sT0FBTyxHQUE2QjtZQUN4QyxvQkFBb0Isc0JBQUE7WUFDcEIscUJBQXFCLHVCQUFBO1lBQ3JCLHFCQUFxQix1QkFBQTtZQUNyQixLQUFLLEVBQUUsbUNBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFO1NBQzlDLENBQUM7UUFFRixJQUFJLEtBQUssSUFBSSxtQ0FBaUIsQ0FBQyxRQUFRLEVBQUU7WUFDdkMsT0FBTyxDQUFDLFFBQVEsR0FBRyxPQUFPLFFBQVEsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQ3RFLE9BQU8sQ0FBQyxlQUFlLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1NBQ2hFO1FBQ0QsT0FBTyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQUFDLEFBdkJELElBdUJDO0FBdkJZLDBDQUFlO0FBMkI1QixJQUFNLGtCQUFrQixHQUNwQixx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