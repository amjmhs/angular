"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var INDEX_HEADER = "/**\n * Generated bundle index. Do not edit.\n */\n";
function privateEntriesToIndex(index, privates) {
    var results = [INDEX_HEADER];
    // Export all of the index symbols.
    results.push("export * from '" + index + "';", '');
    // Simplify the exports
    var exports = new Map();
    for (var _i = 0, privates_1 = privates; _i < privates_1.length; _i++) {
        var entry = privates_1[_i];
        var entries = exports.get(entry.module);
        if (!entries) {
            entries = [];
            exports.set(entry.module, entries);
        }
        entries.push(entry);
    }
    var compareEntries = compare(function (e) { return e.name; });
    var compareModules = compare(function (e) { return e[0]; });
    var orderedExports = Array.from(exports)
        .map(function (_a) {
        var module = _a[0], entries = _a[1];
        return [module, entries.sort(compareEntries)];
    })
        .sort(compareModules);
    for (var _a = 0, orderedExports_1 = orderedExports; _a < orderedExports_1.length; _a++) {
        var _b = orderedExports_1[_a], module_1 = _b[0], entries = _b[1];
        var symbols = entries.map(function (e) { return e.name + " as " + e.privateName; });
        results.push("export {" + symbols + "} from '" + module_1 + "';");
    }
    return results.join('\n');
}
exports.privateEntriesToIndex = privateEntriesToIndex;
function compare(select) {
    return function (a, b) {
        var ak = select(a);
        var bk = select(b);
        return ak > bk ? 1 : ak < bk ? -1 : 0;
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfd3JpdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9tZXRhZGF0YS9pbmRleF93cml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFJSCxJQUFNLFlBQVksR0FBRyxxREFHcEIsQ0FBQztBQUlGLCtCQUFzQyxLQUFhLEVBQUUsUUFBOEI7SUFDakYsSUFBTSxPQUFPLEdBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUV6QyxtQ0FBbUM7SUFDbkMsT0FBTyxDQUFDLElBQUksQ0FBQyxvQkFBa0IsS0FBSyxPQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFOUMsdUJBQXVCO0lBQ3ZCLElBQU0sT0FBTyxHQUFHLElBQUksR0FBRyxFQUFnQyxDQUFDO0lBRXhELEtBQW9CLFVBQVEsRUFBUixxQkFBUSxFQUFSLHNCQUFRLEVBQVIsSUFBUSxFQUFFO1FBQXpCLElBQU0sS0FBSyxpQkFBQTtRQUNkLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3BDO1FBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNyQjtJQUdELElBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxVQUFDLENBQXFCLElBQUssT0FBQSxDQUFDLENBQUMsSUFBSSxFQUFOLENBQU0sQ0FBQyxDQUFDO0lBQ2xFLElBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxVQUFDLENBQVcsSUFBSyxPQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBSixDQUFJLENBQUMsQ0FBQztJQUN0RCxJQUFNLGNBQWMsR0FDaEIsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDZCxHQUFHLENBQUMsVUFBQyxFQUFpQjtZQUFoQixjQUFNLEVBQUUsZUFBTztRQUFNLE9BQVUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUFoRCxDQUFnRCxDQUFDO1NBQzVFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUU5QixLQUFnQyxVQUFjLEVBQWQsaUNBQWMsRUFBZCw0QkFBYyxFQUFkLElBQWMsRUFBRTtRQUFyQyxJQUFBLHlCQUFpQixFQUFoQixnQkFBTSxFQUFFLGVBQU87UUFDekIsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFHLENBQUMsQ0FBQyxJQUFJLFlBQU8sQ0FBQyxDQUFDLFdBQWEsRUFBL0IsQ0FBK0IsQ0FBQyxDQUFDO1FBQ2hFLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBVyxPQUFPLGdCQUFXLFFBQU0sT0FBSSxDQUFDLENBQUM7S0FDdkQ7SUFFRCxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUIsQ0FBQztBQWhDRCxzREFnQ0M7QUFFRCxpQkFBdUIsTUFBbUI7SUFDeEMsT0FBTyxVQUFDLENBQUMsRUFBRSxDQUFDO1FBQ1YsSUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLElBQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4QyxDQUFDLENBQUM7QUFDSixDQUFDIn0=