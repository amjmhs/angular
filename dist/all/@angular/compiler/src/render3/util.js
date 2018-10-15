"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var static_symbol_1 = require("../aot/static_symbol");
var o = require("../output/output_ast");
/**
 * Convert an object map with `Expression` values into a `LiteralMapExpr`.
 */
function mapToMapExpression(map) {
    var result = Object.keys(map).map(function (key) { return ({ key: key, value: map[key], quoted: false }); });
    return o.literalMap(result);
}
exports.mapToMapExpression = mapToMapExpression;
/**
 * Convert metadata into an `Expression` in the given `OutputContext`.
 *
 * This operation will handle arrays, references to symbols, or literal `null` or `undefined`.
 */
function convertMetaToOutput(meta, ctx) {
    if (Array.isArray(meta)) {
        return o.literalArr(meta.map(function (entry) { return convertMetaToOutput(entry, ctx); }));
    }
    if (meta instanceof static_symbol_1.StaticSymbol) {
        return ctx.importExpr(meta);
    }
    if (meta == null) {
        return o.literal(meta);
    }
    throw new Error("Internal error: Unsupported or unknown metadata: " + meta);
}
exports.convertMetaToOutput = convertMetaToOutput;
function typeWithParameters(type, numParams) {
    var params = null;
    if (numParams > 0) {
        params = [];
        for (var i = 0; i < numParams; i++) {
            params.push(o.DYNAMIC_TYPE);
        }
    }
    return o.expressionType(type, null, params);
}
exports.typeWithParameters = typeWithParameters;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9yZW5kZXIzL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzREFBa0Q7QUFDbEQsd0NBQTBDO0FBRzFDOztHQUVHO0FBQ0gsNEJBQW1DLEdBQWtDO0lBQ25FLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsQ0FBQyxFQUFDLEdBQUcsS0FBQSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQXZDLENBQXVDLENBQUMsQ0FBQztJQUNwRixPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUIsQ0FBQztBQUhELGdEQUdDO0FBRUQ7Ozs7R0FJRztBQUNILDZCQUFvQyxJQUFTLEVBQUUsR0FBa0I7SUFDL0QsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3ZCLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsbUJBQW1CLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxFQUEvQixDQUErQixDQUFDLENBQUMsQ0FBQztLQUN6RTtJQUNELElBQUksSUFBSSxZQUFZLDRCQUFZLEVBQUU7UUFDaEMsT0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzdCO0lBQ0QsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO1FBQ2hCLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4QjtJQUVELE1BQU0sSUFBSSxLQUFLLENBQUMsc0RBQW9ELElBQU0sQ0FBQyxDQUFDO0FBQzlFLENBQUM7QUFaRCxrREFZQztBQUVELDRCQUFtQyxJQUFrQixFQUFFLFNBQWlCO0lBQ3RFLElBQUksTUFBTSxHQUFrQixJQUFJLENBQUM7SUFDakMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxFQUFFO1FBQ2pCLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDWixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQzdCO0tBQ0Y7SUFDRCxPQUFPLENBQUMsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM5QyxDQUFDO0FBVEQsZ0RBU0MifQ==