"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var o = require("./output_ast");
exports.QUOTED_KEYS = '$quoted$';
function convertValueToOutputAst(ctx, value, type) {
    if (type === void 0) { type = null; }
    return util_1.visitValue(value, new _ValueOutputAstTransformer(ctx), type);
}
exports.convertValueToOutputAst = convertValueToOutputAst;
var _ValueOutputAstTransformer = /** @class */ (function () {
    function _ValueOutputAstTransformer(ctx) {
        this.ctx = ctx;
    }
    _ValueOutputAstTransformer.prototype.visitArray = function (arr, type) {
        var _this = this;
        return o.literalArr(arr.map(function (value) { return util_1.visitValue(value, _this, null); }), type);
    };
    _ValueOutputAstTransformer.prototype.visitStringMap = function (map, type) {
        var _this = this;
        var entries = [];
        var quotedSet = new Set(map && map[exports.QUOTED_KEYS]);
        Object.keys(map).forEach(function (key) {
            entries.push(new o.LiteralMapEntry(key, util_1.visitValue(map[key], _this, null), quotedSet.has(key)));
        });
        return new o.LiteralMapExpr(entries, type);
    };
    _ValueOutputAstTransformer.prototype.visitPrimitive = function (value, type) { return o.literal(value, type); };
    _ValueOutputAstTransformer.prototype.visitOther = function (value, type) {
        if (value instanceof o.Expression) {
            return value;
        }
        else {
            return this.ctx.importExpr(value);
        }
    };
    return _ValueOutputAstTransformer;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWVfdXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9vdXRwdXQvdmFsdWVfdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILGdDQUFvRTtBQUVwRSxnQ0FBa0M7QUFFckIsUUFBQSxXQUFXLEdBQUcsVUFBVSxDQUFDO0FBRXRDLGlDQUNJLEdBQWtCLEVBQUUsS0FBVSxFQUFFLElBQTBCO0lBQTFCLHFCQUFBLEVBQUEsV0FBMEI7SUFDNUQsT0FBTyxpQkFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLDBCQUEwQixDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3RFLENBQUM7QUFIRCwwREFHQztBQUVEO0lBQ0Usb0NBQW9CLEdBQWtCO1FBQWxCLFFBQUcsR0FBSCxHQUFHLENBQWU7SUFBRyxDQUFDO0lBQzFDLCtDQUFVLEdBQVYsVUFBVyxHQUFVLEVBQUUsSUFBWTtRQUFuQyxpQkFFQztRQURDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsaUJBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSSxFQUFFLElBQUksQ0FBQyxFQUE3QixDQUE2QixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUVELG1EQUFjLEdBQWQsVUFBZSxHQUF5QixFQUFFLElBQWU7UUFBekQsaUJBUUM7UUFQQyxJQUFNLE9BQU8sR0FBd0IsRUFBRSxDQUFDO1FBQ3hDLElBQU0sU0FBUyxHQUFHLElBQUksR0FBRyxDQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsbUJBQVcsQ0FBQyxDQUFDLENBQUM7UUFDM0QsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHO1lBQzFCLE9BQU8sQ0FBQyxJQUFJLENBQ1IsSUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxpQkFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEYsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELG1EQUFjLEdBQWQsVUFBZSxLQUFVLEVBQUUsSUFBWSxJQUFrQixPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV6RiwrQ0FBVSxHQUFWLFVBQVcsS0FBVSxFQUFFLElBQVk7UUFDakMsSUFBSSxLQUFLLFlBQVksQ0FBQyxDQUFDLFVBQVUsRUFBRTtZQUNqQyxPQUFPLEtBQUssQ0FBQztTQUNkO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztJQUNILGlDQUFDO0FBQUQsQ0FBQyxBQXpCRCxJQXlCQyJ9