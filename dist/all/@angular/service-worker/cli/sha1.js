"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Compute the SHA1 of the given string
 *
 * see http://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf
 *
 * WARNING: this function has not been designed not tested with security in mind.
 *          DO NOT USE IT IN A SECURITY SENSITIVE CONTEXT.
 *
 * Borrowed from @angular/compiler/src/i18n/digest.ts
 */
function sha1(str) {
    var utf8 = str;
    var words32 = stringToWords32(utf8, Endian.Big);
    return _sha1(words32, utf8.length * 8);
}
exports.sha1 = sha1;
function sha1Binary(buffer) {
    var words32 = arrayBufferToWords32(buffer, Endian.Big);
    return _sha1(words32, buffer.byteLength * 8);
}
exports.sha1Binary = sha1Binary;
function _sha1(words32, len) {
    var _a, _b;
    var w = new Array(80);
    var _c = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0], a = _c[0], b = _c[1], c = _c[2], d = _c[3], e = _c[4];
    words32[len >> 5] |= 0x80 << (24 - len % 32);
    words32[((len + 64 >> 9) << 4) + 15] = len;
    for (var i = 0; i < words32.length; i += 16) {
        var _d = [a, b, c, d, e], h0 = _d[0], h1 = _d[1], h2 = _d[2], h3 = _d[3], h4 = _d[4];
        for (var j = 0; j < 80; j++) {
            if (j < 16) {
                w[j] = words32[i + j];
            }
            else {
                w[j] = rol32(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            }
            var _e = fk(j, b, c, d), f = _e[0], k = _e[1];
            var temp = [rol32(a, 5), f, e, k, w[j]].reduce(add32);
            _a = [d, c, rol32(b, 30), a, temp], e = _a[0], d = _a[1], c = _a[2], b = _a[3], a = _a[4];
        }
        _b = [add32(a, h0), add32(b, h1), add32(c, h2), add32(d, h3), add32(e, h4)], a = _b[0], b = _b[1], c = _b[2], d = _b[3], e = _b[4];
    }
    return byteStringToHexString(words32ToByteString([a, b, c, d, e]));
}
function add32(a, b) {
    return add32to64(a, b)[1];
}
function add32to64(a, b) {
    var low = (a & 0xffff) + (b & 0xffff);
    var high = (a >>> 16) + (b >>> 16) + (low >>> 16);
    return [high >>> 16, (high << 16) | (low & 0xffff)];
}
function add64(_a, _b) {
    var ah = _a[0], al = _a[1];
    var bh = _b[0], bl = _b[1];
    var _c = add32to64(al, bl), carry = _c[0], l = _c[1];
    var h = add32(add32(ah, bh), carry);
    return [h, l];
}
function sub32(a, b) {
    var low = (a & 0xffff) - (b & 0xffff);
    var high = (a >> 16) - (b >> 16) + (low >> 16);
    return (high << 16) | (low & 0xffff);
}
// Rotate a 32b number left `count` position
function rol32(a, count) {
    return (a << count) | (a >>> (32 - count));
}
// Rotate a 64b number left `count` position
function rol64(_a, count) {
    var hi = _a[0], lo = _a[1];
    var h = (hi << count) | (lo >>> (32 - count));
    var l = (lo << count) | (hi >>> (32 - count));
    return [h, l];
}
var Endian;
(function (Endian) {
    Endian[Endian["Little"] = 0] = "Little";
    Endian[Endian["Big"] = 1] = "Big";
})(Endian || (Endian = {}));
function fk(index, b, c, d) {
    if (index < 20) {
        return [(b & c) | (~b & d), 0x5a827999];
    }
    if (index < 40) {
        return [b ^ c ^ d, 0x6ed9eba1];
    }
    if (index < 60) {
        return [(b & c) | (b & d) | (c & d), 0x8f1bbcdc];
    }
    return [b ^ c ^ d, 0xca62c1d6];
}
function stringToWords32(str, endian) {
    var words32 = Array((str.length + 3) >>> 2);
    for (var i = 0; i < words32.length; i++) {
        words32[i] = wordAt(str, i * 4, endian);
    }
    return words32;
}
function arrayBufferToWords32(buffer, endian) {
    var words32 = Array((buffer.byteLength + 3) >>> 2);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < words32.length; i++) {
        words32[i] = wordAt(view, i * 4, endian);
    }
    return words32;
}
function byteAt(str, index) {
    if (typeof str === 'string') {
        return index >= str.length ? 0 : str.charCodeAt(index) & 0xff;
    }
    else {
        return index >= str.byteLength ? 0 : str[index] & 0xff;
    }
}
function wordAt(str, index, endian) {
    var word = 0;
    if (endian === Endian.Big) {
        for (var i = 0; i < 4; i++) {
            word += byteAt(str, index + i) << (24 - 8 * i);
        }
    }
    else {
        for (var i = 0; i < 4; i++) {
            word += byteAt(str, index + i) << 8 * i;
        }
    }
    return word;
}
function words32ToByteString(words32) {
    return words32.reduce(function (str, word) { return str + word32ToByteString(word); }, '');
}
function word32ToByteString(word) {
    var str = '';
    for (var i = 0; i < 4; i++) {
        str += String.fromCharCode((word >>> 8 * (3 - i)) & 0xff);
    }
    return str;
}
function byteStringToHexString(str) {
    var hex = '';
    for (var i = 0; i < str.length; i++) {
        var b = byteAt(str, i);
        hex += (b >>> 4).toString(16) + (b & 0x0f).toString(16);
    }
    return hex.toLowerCase();
}
// based on http://www.danvk.org/hex2dec.html (JS can not handle more than 56b)
function byteStringToDecString(str) {
    var decimal = '';
    var toThePower = '1';
    for (var i = str.length - 1; i >= 0; i--) {
        decimal = addBigInt(decimal, numberTimesBigInt(byteAt(str, i), toThePower));
        toThePower = numberTimesBigInt(256, toThePower);
    }
    return decimal.split('').reverse().join('');
}
// x and y decimal, lowest significant digit first
function addBigInt(x, y) {
    var sum = '';
    var len = Math.max(x.length, y.length);
    for (var i = 0, carry = 0; i < len || carry; i++) {
        var tmpSum = carry + +(x[i] || 0) + +(y[i] || 0);
        if (tmpSum >= 10) {
            carry = 1;
            sum += tmpSum - 10;
        }
        else {
            carry = 0;
            sum += tmpSum;
        }
    }
    return sum;
}
function numberTimesBigInt(num, b) {
    var product = '';
    var bToThePower = b;
    for (; num !== 0; num = num >>> 1) {
        if (num & 1)
            product = addBigInt(product, bToThePower);
        bToThePower = addBigInt(bToThePower, bToThePower);
    }
    return product;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhMS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL2NsaS9zaGExLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUg7Ozs7Ozs7OztHQVNHO0FBRUgsY0FBcUIsR0FBVztJQUM5QixJQUFNLElBQUksR0FBRyxHQUFHLENBQUM7SUFDakIsSUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEQsT0FBTyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDekMsQ0FBQztBQUpELG9CQUlDO0FBRUQsb0JBQTJCLE1BQW1CO0lBQzVDLElBQU0sT0FBTyxHQUFHLG9CQUFvQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekQsT0FBTyxLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDL0MsQ0FBQztBQUhELGdDQUdDO0FBRUQsZUFBZSxPQUFpQixFQUFFLEdBQVc7O0lBQzNDLElBQU0sQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3BCLElBQUEsaUVBQXdGLEVBQXZGLFNBQUMsRUFBRSxTQUFDLEVBQUUsU0FBQyxFQUFFLFNBQUMsRUFBRSxTQUFDLENBQTJFO0lBRTdGLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM3QyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBRTNDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDckMsSUFBQSxvQkFBZ0QsRUFBL0MsVUFBRSxFQUFFLFVBQUUsRUFBRSxVQUFFLEVBQUUsVUFBRSxFQUFFLFVBQUUsQ0FBOEI7UUFFdkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQixJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ1YsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDdkI7aUJBQU07Z0JBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQzlEO1lBRUssSUFBQSxtQkFBdUIsRUFBdEIsU0FBQyxFQUFFLFNBQUMsQ0FBbUI7WUFDOUIsSUFBTSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4RCxrQ0FBK0MsRUFBOUMsU0FBQyxFQUFFLFNBQUMsRUFBRSxTQUFDLEVBQUUsU0FBQyxFQUFFLFNBQUMsQ0FBa0M7U0FDakQ7UUFFRCwyRUFBd0YsRUFBdkYsU0FBQyxFQUFFLFNBQUMsRUFBRSxTQUFDLEVBQUUsU0FBQyxFQUFFLFNBQUMsQ0FBMkU7S0FDMUY7SUFFRCxPQUFPLHFCQUFxQixDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRSxDQUFDO0FBRUQsZUFBZSxDQUFTLEVBQUUsQ0FBUztJQUNqQyxPQUFPLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUIsQ0FBQztBQUVELG1CQUFtQixDQUFTLEVBQUUsQ0FBUztJQUNyQyxJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztJQUN4QyxJQUFNLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUNwRCxPQUFPLENBQUMsSUFBSSxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3RELENBQUM7QUFFRCxlQUFlLEVBQTBCLEVBQUUsRUFBMEI7UUFBckQsVUFBRSxFQUFFLFVBQUU7UUFBc0IsVUFBRSxFQUFFLFVBQUU7SUFDMUMsSUFBQSxzQkFBOEIsRUFBN0IsYUFBSyxFQUFFLFNBQUMsQ0FBc0I7SUFDckMsSUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNoQixDQUFDO0FBRUQsZUFBZSxDQUFTLEVBQUUsQ0FBUztJQUNqQyxJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztJQUN4QyxJQUFNLElBQUksR0FBRyxDQUFDLENBQUMs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