"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var DASH_CASE_REGEXP = /-+([a-z0-9])/g;
function dashCaseToCamelCase(input) {
    return input.replace(DASH_CASE_REGEXP, function () {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            m[_i] = arguments[_i];
        }
        return m[1].toUpperCase();
    });
}
exports.dashCaseToCamelCase = dashCaseToCamelCase;
function splitAtColon(input, defaultValues) {
    return _splitAt(input, ':', defaultValues);
}
exports.splitAtColon = splitAtColon;
function splitAtPeriod(input, defaultValues) {
    return _splitAt(input, '.', defaultValues);
}
exports.splitAtPeriod = splitAtPeriod;
function _splitAt(input, character, defaultValues) {
    var characterIndex = input.indexOf(character);
    if (characterIndex == -1)
        return defaultValues;
    return [input.slice(0, characterIndex).trim(), input.slice(characterIndex + 1).trim()];
}
function visitValue(value, visitor, context) {
    if (Array.isArray(value)) {
        return visitor.visitArray(value, context);
    }
    if (isStrictStringMap(value)) {
        return visitor.visitStringMap(value, context);
    }
    if (value == null || typeof value == 'string' || typeof value == 'number' ||
        typeof value == 'boolean') {
        return visitor.visitPrimitive(value, context);
    }
    return visitor.visitOther(value, context);
}
exports.visitValue = visitValue;
function isDefined(val) {
    return val !== null && val !== undefined;
}
exports.isDefined = isDefined;
function noUndefined(val) {
    return val === undefined ? null : val;
}
exports.noUndefined = noUndefined;
var ValueTransformer = /** @class */ (function () {
    function ValueTransformer() {
    }
    ValueTransformer.prototype.visitArray = function (arr, context) {
        var _this = this;
        return arr.map(function (value) { return visitValue(value, _this, context); });
    };
    ValueTransformer.prototype.visitStringMap = function (map, context) {
        var _this = this;
        var result = {};
        Object.keys(map).forEach(function (key) { result[key] = visitValue(map[key], _this, context); });
        return result;
    };
    ValueTransformer.prototype.visitPrimitive = function (value, context) { return value; };
    ValueTransformer.prototype.visitOther = function (value, context) { return value; };
    return ValueTransformer;
}());
exports.ValueTransformer = ValueTransformer;
exports.SyncAsync = {
    assertSync: function (value) {
        if (isPromise(value)) {
            throw new Error("Illegal state: value cannot be a promise");
        }
        return value;
    },
    then: function (value, cb) { return isPromise(value) ? value.then(cb) : cb(value); },
    all: function (syncAsyncValues) {
        return syncAsyncValues.some(isPromise) ? Promise.all(syncAsyncValues) : syncAsyncValues;
    }
};
function error(msg) {
    throw new Error("Internal Error: " + msg);
}
exports.error = error;
function syntaxError(msg, parseErrors) {
    var error = Error(msg);
    error[ERROR_SYNTAX_ERROR] = true;
    if (parseErrors)
        error[ERROR_PARSE_ERRORS] = parseErrors;
    return error;
}
exports.syntaxError = syntaxError;
var ERROR_SYNTAX_ERROR = 'ngSyntaxError';
var ERROR_PARSE_ERRORS = 'ngParseErrors';
function isSyntaxError(error) {
    return error[ERROR_SYNTAX_ERROR];
}
exports.isSyntaxError = isSyntaxError;
function getParseErrors(error) {
    return error[ERROR_PARSE_ERRORS] || [];
}
exports.getParseErrors = getParseErrors;
// Escape characters that have a special meaning in Regular Expressions
function escapeRegExp(s) {
    return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}
exports.escapeRegExp = escapeRegExp;
var STRING_MAP_PROTO = Object.getPrototypeOf({});
function isStrictStringMap(obj) {
    return typeof obj === 'object' && obj !== null && Object.getPrototypeOf(obj) === STRING_MAP_PROTO;
}
function utf8Encode(str) {
    var encoded = '';
    for (var index = 0; index < str.length; index++) {
        var codePoint = str.charCodeAt(index);
        // decode surrogate
        // see https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        if (codePoint >= 0xd800 && codePoint <= 0xdbff && str.length > (index + 1)) {
            var low = str.charCodeAt(index + 1);
            if (low >= 0xdc00 && low <= 0xdfff) {
                index++;
                codePoint = ((codePoint - 0xd800) << 10) + low - 0xdc00 + 0x10000;
            }
        }
        if (codePoint <= 0x7f) {
            encoded += String.fromCharCode(codePoint);
        }
        else if (codePoint <= 0x7ff) {
            encoded += String.fromCharCode(((codePoint >> 6) & 0x1F) | 0xc0, (codePoint & 0x3f) | 0x80);
        }
        else if (codePoint <= 0xffff) {
            encoded += String.fromCharCode((codePoint >> 12) | 0xe0, ((codePoint >> 6) & 0x3f) | 0x80, (codePoint & 0x3f) | 0x80);
        }
        else if (codePoint <= 0x1fffff) {
            encoded += String.fromCharCode(((codePoint >> 18) & 0x07) | 0xf0, ((codePoint >> 12) & 0x3f) | 0x80, ((codePoint >> 6) & 0x3f) | 0x80, (codePoint & 0x3f) | 0x80);
        }
    }
    return encoded;
}
exports.utf8Encode = utf8Encode;
function stringify(token) {
    if (typeof token === 'string') {
        return token;
    }
    if (token instanceof Array) {
        return '[' + token.map(stringify).join(', ') + ']';
    }
    if (token == null) {
        return '' + token;
    }
    if (token.overriddenName) {
        return "" + token.overriddenName;
    }
    if (token.name) {
        return "" + token.name;
    }
    // WARNING: do not try to `JSON.stringify(token)` here
    // see https://github.com/angular/angular/issues/23440
    var res = token.toString();
    if (res == null) {
        return '' + res;
    }
    var newLineIndex = res.indexOf('\n');
    return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
}
exports.stringify = stringify;
/**
 * Lazily retrieves the reference value from a forwardRef.
 */
function resolveForwardRef(type) {
    if (typeof type === 'function' && type.hasOwnProperty('__forward_ref__')) {
        return type();
    }
    else {
        return type;
    }
}
exports.resolveForwardRef = resolveForwardRef;
/**
 * Determine if the argument is shaped like a Promise
 */
function isPromise(obj) {
    // allow any Promise/A+ compliant thenable.
    // It's up to the caller to ensure that obj.then conforms to the spec
    return !!obj && typeof obj.then === 'function';
}
exports.isPromise = isPromise;
var Version = /** @class */ (function () {
    function Version(full) {
        this.full = full;
        var splits = full.split('.');
        this.major = splits[0];
        this.minor = splits[1];
        this.patch = splits.slice(2).join('.');
    }
    return Version;
}());
exports.Version = Version;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBT0gsSUFBTSxnQkFBZ0IsR0FBRyxlQUFlLENBQUM7QUFFekMsNkJBQW9DLEtBQWE7SUFDL0MsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFO1FBQUMsV0FBVzthQUFYLFVBQVcsRUFBWCxxQkFBVyxFQUFYLElBQVc7WUFBWCxzQkFBVzs7UUFBSyxPQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUU7SUFBbEIsQ0FBa0IsQ0FBQyxDQUFDO0FBQzlFLENBQUM7QUFGRCxrREFFQztBQUVELHNCQUE2QixLQUFhLEVBQUUsYUFBdUI7SUFDakUsT0FBTyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBRkQsb0NBRUM7QUFFRCx1QkFBOEIsS0FBYSxFQUFFLGFBQXVCO0lBQ2xFLE9BQU8sUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUZELHNDQUVDO0FBRUQsa0JBQWtCLEtBQWEsRUFBRSxTQUFpQixFQUFFLGFBQXVCO0lBQ3pFLElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDaEQsSUFBSSxjQUFjLElBQUksQ0FBQyxDQUFDO1FBQUUsT0FBTyxhQUFhLENBQUM7SUFDL0MsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDekYsQ0FBQztBQUVELG9CQUEy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