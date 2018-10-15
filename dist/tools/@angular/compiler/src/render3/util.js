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
//# sourceMappingURL=util.js.map