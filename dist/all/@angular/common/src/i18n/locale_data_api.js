"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var locale_en_1 = require("./locale_en");
var locale_data_1 = require("./locale_data");
var currencies_1 = require("./currencies");
/**
 * The different format styles that can be used to represent numbers.
 * Used by the function {@link getLocaleNumberFormat}.
 *
 * @experimental i18n support is experimental.
 */
var NumberFormatStyle;
(function (NumberFormatStyle) {
    NumberFormatStyle[NumberFormatStyle["Decimal"] = 0] = "Decimal";
    NumberFormatStyle[NumberFormatStyle["Percent"] = 1] = "Percent";
    NumberFormatStyle[NumberFormatStyle["Currency"] = 2] = "Currency";
    NumberFormatStyle[NumberFormatStyle["Scientific"] = 3] = "Scientific";
})(NumberFormatStyle = exports.NumberFormatStyle || (exports.NumberFormatStyle = {}));
/** @experimental */
var Plural;
(function (Plural) {
    Plural[Plural["Zero"] = 0] = "Zero";
    Plural[Plural["One"] = 1] = "One";
    Plural[Plural["Two"] = 2] = "Two";
    Plural[Plural["Few"] = 3] = "Few";
    Plural[Plural["Many"] = 4] = "Many";
    Plural[Plural["Other"] = 5] = "Other";
})(Plural = exports.Plural || (exports.Plural = {}));
/**
 * Some languages use two different forms of strings (standalone and format) depending on the
 * context.
 * Typically the standalone version is the nominative form of the word, and the format version is in
 * the genitive.
 * See [the CLDR website](http://cldr.unicode.org/translation/date-time) for more information.
 *
 * @experimental i18n support is experimental.
 */
var FormStyle;
(function (FormStyle) {
    FormStyle[FormStyle["Format"] = 0] = "Format";
    FormStyle[FormStyle["Standalone"] = 1] = "Standalone";
})(FormStyle = exports.FormStyle || (exports.FormStyle = {}));
/**
 * Multiple widths are available for translations: narrow (1 character), abbreviated (3 characters),
 * wide (full length), and short (2 characters, only for days).
 *
 * For example the day `Sunday` will be:
 * - Narrow: `S`
 * - Short: `Su`
 * - Abbreviated: `Sun`
 * - Wide: `Sunday`
 *
 * @experimental i18n support is experimental.
 */
var TranslationWidth;
(function (TranslationWidth) {
    TranslationWidth[TranslationWidth["Narrow"] = 0] = "Narrow";
    TranslationWidth[TranslationWidth["Abbreviated"] = 1] = "Abbreviated";
    TranslationWidth[TranslationWidth["Wide"] = 2] = "Wide";
    TranslationWidth[TranslationWidth["Short"] = 3] = "Short";
})(TranslationWidth = exports.TranslationWidth || (exports.TranslationWidth = {}));
/**
 * Multiple widths are available for formats: short (minimal amount of data), medium (small amount
 * of data), long (complete amount of data), full (complete amount of data and extra information).
 *
 * For example the date-time formats for the english locale will be:
 *  - `'short'`: `'M/d/yy, h:mm a'` (e.g. `6/15/15, 9:03 AM`)
 *  - `'medium'`: `'MMM d, y, h:mm:ss a'` (e.g. `Jun 15, 2015, 9:03:01 AM`)
 *  - `'long'`: `'MMMM d, y, h:mm:ss a z'` (e.g. `June 15, 2015 at 9:03:01 AM GMT+1`)
 *  - `'full'`: `'EEEE, MMMM d, y, h:mm:ss a zzzz'` (e.g. `Monday, June 15, 2015 at
 * 9:03:01 AM GMT+01:00`)
 *
 * @experimental i18n support is experimental.
 */
var FormatWidth;
(function (FormatWidth) {
    FormatWidth[FormatWidth["Short"] = 0] = "Short";
    FormatWidth[FormatWidth["Medium"] = 1] = "Medium";
    FormatWidth[FormatWidth["Long"] = 2] = "Long";
    FormatWidth[FormatWidth["Full"] = 3] = "Full";
})(FormatWidth = exports.FormatWidth || (exports.FormatWidth = {}));
/**
 * Number symbol that can be used to replace placeholders in number patterns.
 * The placeholders are based on english values:
 *
 * | Name                   | Example for en-US | Meaning                                     |
 * |------------------------|-------------------|---------------------------------------------|
 * | decimal                | 2,345`.`67        | decimal separator                           |
 * | group                  | 2`,`345.67        | grouping separator, typically for thousands |
 * | plusSign               | `+`23             | the plus sign used with numbers             |
 * | minusSign              | `-`23             | the minus sign used with numbers            |
 * | percentSign            | 23.4`%`           | the percent sign (out of 100)               |
 * | perMille               | 234`‰`            | the permille sign (out of 1000)             |
 * | exponential            | 1.2`E`3           | used in computers for 1.2×10³.              |
 * | superscriptingExponent | 1.2`×`103         | human-readable format of exponential        |
 * | infinity               | `∞`               | used in +∞ and -∞.                          |
 * | nan                    | `NaN`             | "not a number".                             |
 * | timeSeparator          | 10`:`52           | symbol used between time units              |
 * | currencyDecimal        | $2,345`.`67       | decimal separator, fallback to "decimal"    |
 * | currencyGroup          | $2`,`345.67       | grouping separator, fallback to "group"     |
 *
 * @experimental i18n support is experimental.
 */
var NumberSymbol;
(function (NumberSymbol) {
    NumberSymbol[NumberSymbol["Decimal"] = 0] = "Decimal";
    NumberSymbol[NumberSymbol["Group"] = 1] = "Group";
    NumberSymbol[NumberSymbol["List"] = 2] = "List";
    NumberSymbol[NumberSymbol["PercentSign"] = 3] = "PercentSign";
    NumberSymbol[NumberSymbol["PlusSign"] = 4] = "PlusSign";
    NumberSymbol[NumberSymbol["MinusSign"] = 5] = "MinusSign";
    NumberSymbol[NumberSymbol["Exponential"] = 6] = "Exponential";
    NumberSymbol[NumberSymbol["SuperscriptingExponent"] = 7] = "SuperscriptingExponent";
    NumberSymbol[NumberSymbol["PerMille"] = 8] = "PerMille";
    NumberSymbol[NumberSymbol["Infinity"] = 9] = "Infinity";
    NumberSymbol[NumberSymbol["NaN"] = 10] = "NaN";
    NumberSymbol[NumberSymbol["TimeSeparator"] = 11] = "TimeSeparator";
    NumberSymbol[NumberSymbol["CurrencyDecimal"] = 12] = "CurrencyDecimal";
    NumberSymbol[NumberSymbol["CurrencyGroup"] = 13] = "CurrencyGroup";
})(NumberSymbol = exports.NumberSymbol || (exports.NumberSymbol = {}));
/**
 * The value for each day of the week, based on the en-US locale
 *
 * @experimental
 */
var WeekDay;
(function (WeekDay) {
    WeekDay[WeekDay["Sunday"] = 0] = "Sunday";
    WeekDay[WeekDay["Monday"] = 1] = "Monday";
    WeekDay[WeekDay["Tuesday"] = 2] = "Tuesday";
    WeekDay[WeekDay["Wednesday"] = 3] = "Wednesday";
    WeekDay[WeekDay["Thursday"] = 4] = "Thursday";
    WeekDay[WeekDay["Friday"] = 5] = "Friday";
    WeekDay[WeekDay["Saturday"] = 6] = "Saturday";
})(WeekDay = exports.WeekDay || (exports.WeekDay = {}));
/**
 * The locale id for the chosen locale (e.g `en-GB`).
 *
 * @experimental i18n support is experimental.
 */
function getLocaleId(locale) {
    return findLocaleData(locale)[0 /* LocaleId */];
}
exports.getLocaleId = getLocaleId;
/**
 * Periods of the day (e.g. `[AM, PM]` for en-US).
 *
 * @experimental i18n support is experimental.
 */
function getLocaleDayPeriods(locale, formStyle, width) {
    var data = findLocaleData(locale);
    var amPmData = [data[1 /* DayPeriodsFormat */], data[2 /* DayPeriodsStandalone */]];
    var amPm = getLastDefinedValue(amPmData, formStyle);
    return getLastDefinedValue(amPm, width);
}
exports.getLocaleDayPeriods = getLocaleDayPeriods;
/**
 * Days of the week for the Gregorian calendar (e.g. `[Sunday, Monday, ... Saturday]` for en-US).
 *
 * @experimental i18n support is experimental.
 */
function getLocaleDayNames(locale, formStyle, width) {
    var data = findLocaleData(locale);
    var daysData = [data[3 /* DaysFormat */], data[4 /* DaysStandalone */]];
    var days = getLastDefinedValue(daysData, formStyle);
    return getLastDefinedValue(days, width);
}
exports.getLocaleDayNames = getLocaleDayNames;
/**
 * Months of the year for the Gregorian calendar (e.g. `[January, February, ...]` for en-US).
 *
 * @experimental i18n support is experimental.
 */
function getLocaleMonthNames(locale, formStyle, width) {
    var data = findLocaleData(locale);
    var monthsData = [data[5 /* MonthsFormat */], data[6 /* MonthsStandalone */]];
    var months = getLastDefinedValue(monthsData, formStyle);
    return getLastDefinedValue(months, width);
}
exports.getLocaleMonthNames = getLocaleMonthNames;
/**
 * Eras for the Gregorian calendar (e.g. AD/BC).
 *
 * @experimental i18n support is experimental.
 */
function getLocaleEraNames(locale, width) {
    var data = findLocaleData(locale);
    var erasData = data[7 /* Eras */];
    return getLastDefinedValue(erasData, width);
}
exports.getLocaleEraNames = getLocaleEraNames;
/**
 * First day of the week for this locale, based on english days (Sunday = 0, Monday = 1, ...).
 * For example in french the value would be 1 because the first day of the week is Monday.
 *
 * @experimental i18n support is experimental.
 */
function getLocaleFirstDayOfWeek(locale) {
    var data = findLocaleData(locale);
    return data[8 /* FirstDayOfWeek */];
}
exports.getLocaleFirstDayOfWeek = getLocaleFirstDayOfWeek;
/**
 * Range of days in the week that represent the week-end for this locale, based on english days
 * (Sunday = 0, Monday = 1, ...).
 * For example in english the value would be [6,0] for Saturday to Sunday.
 *
 * @experimental i18n support is experimental.
 */
function getLocaleWeekEndRange(locale) {
    var data = findLocaleData(locale);
    return data[9 /* WeekendRange */];
}
exports.getLocaleWeekEndRange = getLocaleWeekEndRange;
/**
 * Date format that depends on the locale.
 *
 * There are four basic date formats:
 * - `full` should contain long-weekday (EEEE), year (y), long-month (MMMM), day (d).
 *
 *  For example, English uses `EEEE, MMMM d, y`, corresponding to a date like
 *  "Tuesday, September 14, 1999".
 *
 * - `long` should contain year, long-month, day.
 *
 *  For example, `MMMM d, y`, corresponding to a date like "September 14, 1999".
 *
 * - `medium` should contain year, abbreviated-month (MMM), day.
 *
 *  For example, `MMM d, y`, corresponding to a date like "Sep 14, 1999".
 *  For languages that do not use abbreviated months, use the numeric month (MM/M). For example,
 *  `y/MM/dd`, corresponding to a date like "1999/09/14".
 *
 * - `short` should contain year, numeric-month (MM/M), and day.
 *
 *  For example, `M/d/yy`, corresponding to a date like "9/14/99".
 *
 * @experimental i18n support is experimental.
 */
function getLocaleDateFormat(locale, width) {
    var data = findLocaleData(locale);
    return getLastDefinedValue(data[10 /* DateFormat */], width);
}
exports.getLocaleDateFormat = getLocaleDateFormat;
/**
 * Time format that depends on the locale.
 *
 * The standard formats include four basic time formats:
 * - `full` should contain hour (h/H), minute (mm), second (ss), and zone (zzzz).
 * - `long` should contain hour, minute, second, and zone (z)
 * - `medium` should contain hour, minute, second.
 * - `short` should contain hour, minute.
 *
 * Note: The patterns depend on whether the main country using your language uses 12-hour time or
 * not:
 * - For 12-hour time, use a pattern like `hh:mm a` using h to mean a 12-hour clock cycle running
 * 1 through 12 (midnight plus 1 minute is 12:01), or using K to mean a 12-hour clock cycle
 * running 0 through 11 (midnight plus 1 minute is 0:01).
 * - For 24-hour time, use a pattern like `HH:mm` using H to mean a 24-hour clock cycle running 0
 * through 23 (midnight plus 1 minute is 0:01), or using k to mean a 24-hour clock cycle running
 * 1 through 24 (midnight plus 1 minute is 24:01).
 *
 * @experimental i18n support is experimental.
 */
function getLocaleTimeFormat(locale, width) {
    var data = findLocaleData(locale);
    return getLastDefinedValue(data[11 /* TimeFormat */], width);
}
exports.getLocaleTimeFormat = getLocaleTimeFormat;
/**
 * Date-time format that depends on the locale.
 *
 * The date-time pattern shows how to combine separate patterns for date (represented by {1})
 * and time (represented by {0}) into a single pattern. It usually doesn't need to be changed.
 * What you want to pay attention to are:
 * - possibly removing a space for languages that don't use it, such as many East Asian languages
 * - possibly adding a comma, other punctuation, or a combining word
 *
 * For example:
 * - English uses `{1} 'at' {0}` or `{1}, {0}` (depending on date style), while Japanese uses
 *  `{1}{0}`.
 * - An English formatted date-time using the combining pattern `{1}, {0}` could be
 *  `Dec 10, 2010, 3:59:49 PM`. Notice the comma and space between the date portion and the time
 *  portion.
 *
 * There are four formats (`full`, `long`, `medium`, `short`); the determination of which to use
 * is normally based on the date style. For example, if the date has a full month and weekday
 * name, the full combining pattern will be used to combine that with a time. If the date has
 * numeric month, the short version of the combining pattern will be used to combine that with a
 * time. English uses `{1} 'at' {0}` for full and long styles, and `{1}, {0}` for medium and short
 * styles.
 *
 * @experimental i18n support is experimental.
 */
function getLocaleDateTimeFormat(locale, width) {
    var data = findLocaleData(locale);
    var dateTimeFormatData = data[12 /* DateTimeFormat */];
    return getLastDefinedValue(dateTimeFormatData, width);
}
exports.getLocaleDateTimeFormat = getLocaleDateTimeFormat;
/**
 * Number symbol that can be used to replace placeholders in number formats.
 * See {@link NumberSymbol} for more information.
 *
 * @experimental i18n support is experimental.
 */
function getLocaleNumberSymbol(locale, symbol) {
    var data = findLocaleData(locale);
    var res = data[13 /* NumberSymbols */][symbol];
    if (typeof res === 'undefined') {
        if (symbol === NumberSymbol.CurrencyDecimal) {
            return data[13 /* NumberSymbols */][NumberSymbol.Decimal];
        }
        else if (symbol === NumberSymbol.CurrencyGroup) {
            return data[13 /* NumberSymbols */][NumberSymbol.Group];
        }
    }
    return res;
}
exports.getLocaleNumberSymbol = getLocaleNumberSymbol;
/**
 * Number format that depends on the locale.
 *
 * Numbers are formatted using patterns, like `#,###.00`. For example, the pattern `#,###.00`
 * when used to format the number 12345.678 could result in "12'345,67". That would happen if the
 * grouping separator for your language is an apostrophe, and the decimal separator is a comma.
 *
 * <b>Important:</b> The characters `.` `,` `0` `#` (and others below) are special placeholders;
 * they stand for the decimal separator, and so on, and are NOT real characters.
 * You must NOT "translate" the placeholders; for example, don't change `.` to `,` even though in
 * your language the decimal point is written with a comma. The symbols should be replaced by the
 * local equivalents, using the Number Symbols for your language.
 *
 * Here are the special characters used in number patterns:
 *
 * | Symbol | Meaning |
 * |--------|---------|
 * | . | Replaced automatically by the character used for the decimal point. |
 * | , | Replaced by the "grouping" (thousands) separator. |
 * | 0 | Replaced by a digit (or zero if there aren't enough digits). |
 * | # | Replaced by a digit (or nothing if there aren't enough). |
 * | ¤ | This will be replaced by a currency symbol, such as $ or USD. |
 * | % | This marks a percent format. The % symbol may change position, but must be retained. |
 * | E | This marks a scientific format. The E symbol may change position, but must be retained. |
 * | ' | Special characters used as literal characters are quoted with ASCII single quotes. |
 *
 * You can find more information
 * [on the CLDR website](http://cldr.unicode.org/translation/number-patterns)
 *
 * @experimental i18n support is experimental.
 */
function getLocaleNumberFormat(locale, type) {
    var data = findLocaleData(locale);
    return data[14 /* NumberFormats */][type];
}
exports.getLocaleNumberFormat = getLocaleNumberFormat;
/**
 * The symbol used to represent the currency for the main country using this locale (e.g. $ for
 * the locale en-US).
 * The symbol will be `null` if the main country cannot be determined.
 *
 * @experimental i18n support is experimental.
 */
function getLocaleCurrencySymbol(locale) {
    var data = findLocaleData(locale);
    return data[15 /* CurrencySymbol */] || null;
}
exports.getLocaleCurrencySymbol = getLocaleCurrencySymbol;
/**
 * The name of the currency for the main country using this locale (e.g. USD for the locale
 * en-US).
 * The name will be `null` if the main country cannot be determined.
 *
 * @experimental i18n support is experimental.
 */
function getLocaleCurrencyName(locale) {
    var data = findLocaleData(locale);
    return data[16 /* CurrencyName */] || null;
}
exports.getLocaleCurrencyName = getLocaleCurrencyName;
/**
 * Returns the currency values for the locale
 */
function getLocaleCurrencies(locale) {
    var data = findLocaleData(locale);
    return data[17 /* Currencies */];
}
/**
 * The locale plural function used by ICU expressions to determine the plural case to use.
 * See {@link NgPlural} for more information.
 *
 * @experimental i18n support is experimental.
 */
function getLocalePluralCase(locale) {
    var data = findLocaleData(locale);
    return data[18 /* PluralCase */];
}
exports.getLocalePluralCase = getLocalePluralCase;
function checkFullData(data) {
    if (!data[19 /* ExtraData */]) {
        throw new Error("Missing extra locale data for the locale \"" + data[0 /* LocaleId */] + "\". Use \"registerLocaleData\" to load new data. See the \"I18n guide\" on angular.io to know more.");
    }
}
/**
 * Rules used to determine which day period to use (See `dayPeriods` below).
 * The rules can either be an array or a single value. If it's an array, consider it as "from"
 * and "to". If it's a single value then it means that the period is only valid at this exact
 * value.
 * There is always the same number of rules as the number of day periods, which means that the
 * first rule is applied to the first day period and so on.
 * You should fallback to AM/PM when there are no rules available.
 *
 * Note: this is only available if you load the full locale data.
 * See the ["I18n guide"](guide/i18n#i18n-pipes) to know how to import additional locale
 * data.
 *
 * @experimental i18n support is experimental.
 */
function getLocaleExtraDayPeriodRules(locale) {
    var data = findLocaleData(locale);
    checkFullData(data);
    var rules = data[19 /* ExtraData */][2 /* ExtraDayPeriodsRules */] || [];
    return rules.map(function (rule) {
        if (typeof rule === 'string') {
            return extractTime(rule);
        }
        return [extractTime(rule[0]), extractTime(rule[1])];
    });
}
exports.getLocaleExtraDayPeriodRules = getLocaleExtraDayPeriodRules;
/**
 * Day Periods indicate roughly how the day is broken up in different languages (e.g. morning,
 * noon, afternoon, midnight, ...).
 * You should use the function {@link getLocaleExtraDayPeriodRules} to determine which period to
 * use.
 * You should fallback to AM/PM when there are no day periods available.
 *
 * Note: this is only available if you load the full locale data.
 * See the ["I18n guide"](guide/i18n#i18n-pipes) to know how to import additional locale
 * data.
 *
 * @experimental i18n support is experimental.
 */
function getLocaleExtraDayPeriods(locale, formStyle, width) {
    var data = findLocaleData(locale);
    checkFullData(data);
    var dayPeriodsData = [
        data[19 /* ExtraData */][0 /* ExtraDayPeriodFormats */],
        data[19 /* ExtraData */][1 /* ExtraDayPeriodStandalone */]
    ];
    var dayPeriods = getLastDefinedValue(dayPeriodsData, formStyle) || [];
    return getLastDefinedValue(dayPeriods, width) || [];
}
exports.getLocaleExtraDayPeriods = getLocaleExtraDayPeriods;
/**
 * Returns the first value that is defined in an array, going backwards.
 *
 * To avoid repeating the same data (e.g. when "format" and "standalone" are the same) we only
 * add the first one to the locale data arrays, the other ones are only defined when different.
 * We use this function to retrieve the first defined value.
 *
 * @experimental i18n support is experimental.
 */
function getLastDefinedValue(data, index) {
    for (var i = index; i > -1; i--) {
        if (typeof data[i] !== 'undefined') {
            return data[i];
        }
    }
    throw new Error('Locale data API: locale data undefined');
}
/**
 * Extract the hours and minutes from a string like "15:45"
 */
function extractTime(time) {
    var _a = time.split(':'), h = _a[0], m = _a[1];
    return { hours: +h, minutes: +m };
}
/**
 * Finds the locale data for a locale id
 *
 * @experimental i18n support is experimental.
 */
function findLocaleData(locale) {
    var normalizedLocale = locale.toLowerCase().replace(/_/g, '-');
    var match = locale_data_1.LOCALE_DATA[normalizedLocale];
    if (match) {
        return match;
    }
    // let's try to find a parent locale
    var parentLocale = normalizedLocale.split('-')[0];
    match = locale_data_1.LOCALE_DATA[parentLocale];
    if (match) {
        return match;
    }
    if (parentLocale === 'en') {
        return locale_en_1.default;
    }
    throw new Error("Missing locale data for the locale \"" + locale + "\".");
}
exports.findLocaleData = findLocaleData;
/**
 * Returns the currency symbol for a given currency code, or the code if no symbol available
 * (e.g.: format narrow = $, format wide = US$, code = USD)
 * If no locale is provided, it uses the locale "en" by default
 *
 * @experimental i18n support is experimental.
 */
function getCurrencySymbol(code, format, locale) {
    if (locale === void 0) { locale = 'en'; }
    var currency = getLocaleCurrencies(locale)[code] || currencies_1.CURRENCIES_EN[code] || [];
    var symbolNarrow = currency[1 /* SymbolNarrow */];
    if (format === 'narrow' && typeof symbolNarrow === 'string') {
        return symbolNarrow;
    }
    return currency[0 /* Symbol */] || code;
}
exports.getCurrencySymbol = getCurrencySymbol;
// Most currencies have cents, that's why the default is 2
var DEFAULT_NB_OF_CURRENCY_DIGITS = 2;
/**
 * Returns the number of decimal digits for the given currency.
 * Its value depends upon the presence of cents in that particular currency.
 *
 * @experimental i18n support is experimental.
 */
function getNumberOfCurrencyDigits(code) {
    var digits;
    var currency = currencies_1.CURRENCIES_EN[code];
    if (currency) {
        digits = currency[2 /* NbOfDigits */];
    }
    return typeof digits === 'number' ? digits : DEFAULT_NB_OF_CURRENCY_DIGITS;
}
exports.getNumberOfCurrencyDigits = getNumberOfCurrencyDigits;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxlX2RhdGFfYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL3NyYy9pMThuL2xvY2FsZV9kYXRhX2FwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHlDQUFtQztBQUNuQyw2Q0FBZ0c7QUFDaEcsMkNBQThEO0FBRTlEOzs7OztHQUtHO0FBQ0gsSUFBWSxpQkFLWDtBQUxELFdBQVksaUJBQWlCO0lBQzNCLCtEQUFPLENBQUE7SUFDUCwrREFBTyxDQUFBO0lBQ1AsaUVBQVEsQ0FBQTtJQUNSLHFFQUFVLENBQUE7QUFDWixDQUFDLEVBTFcsaUJBQWlCLEdBQWpCLHlCQUFpQixLQUFqQix5QkFBaUIsUUFLNUI7QUFFRCxvQkFBb0I7QUFDcEIsSUFBWSxNQU9YO0FBUEQsV0FBWSxNQUFNO0lBQ2hCLG1DQUFRLENBQUE7SUFDUixpQ0FBTyxDQUFBO0lBQ1AsaUNBQU8sQ0FBQTtJQUNQLGlDQUFPLENBQUE7SUFDUCxtQ0FBUSxDQUFBO0lBQ1IscUNBQVMsQ0FBQTtBQUNYLENBQUMsRUFQVyxNQUFNLEdBQU4sY0FBTSxLQUFOLGNBQU0sUUFPakI7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILElBQVksU0FHWDtBQUhELFdBQVksU0FBUztJQUNuQiw2Q0FBTSxDQUFBO0lBQ04scURBQVUsQ0FBQTtBQUNaLENBQUMsRUFIVyxTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQUdwQjtBQUVEOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsSUFBWSxnQkFLWDtBQUxELFdBQVksZ0JBQWdCO0lBQzFCLDJEQUFNLENBQUE7SUFDTixxRUFBVyxDQUFBO0lBQ1gsdURBQUksQ0FBQTtJQUNKLHlEQUFLLENBQUE7QUFDUCxDQUFDLEVBTFcsZ0JBQWdCLEdBQWhCLHdCQUFnQixLQUFoQix3QkFBZ0IsUUFLM0I7QUFFRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxJQUFZLFdBS1g7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