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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvb3V0cHV0L21hcF91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsZ0NBQWtDO0FBVWxDLGtCQUF5QixHQUFXLEVBQUUsS0FBbUI7SUFDdkQsT0FBTyxFQUFDLEdBQUcsS0FBQSxFQUFFLEtBQUssT0FBQSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQztBQUNyQyxDQUFDO0FBRkQsNEJBRUM7QUFFRCxvQkFBMkIsR0FBa0M7SUFDM0QsT0FBTyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsQ0FBQztRQUNOLEdBQUcsS0FBQTtRQUNILE1BQU0sRUFBRSxLQUFLO1FBQ2IsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUM7S0FDaEIsQ0FBQyxFQUpLLENBSUwsQ0FBQyxDQUFDLENBQUM7QUFDaEQsQ0FBQztBQU5ELGdDQU1DIn0=