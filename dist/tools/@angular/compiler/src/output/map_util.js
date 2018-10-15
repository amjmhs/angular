"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var o = require("./output_ast");
function mapEntry(key, value) {
    return { key: key, value: value, quoted: false };
}
exports.mapEntry = mapEntry;
function mapLiteral(obj) {
    return o.literalMap(Object.keys(obj).map(function (key) { return ({
        key: key,
        quoted: false,
        value: obj[key],
    }); }));
}
exports.mapLiteral = mapLiteral;
//# sourceMappingURL=map_util.js.map