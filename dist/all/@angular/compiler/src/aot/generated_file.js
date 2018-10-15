"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var output_ast_1 = require("../output/output_ast");
var ts_emitter_1 = require("../output/ts_emitter");
var GeneratedFile = /** @class */ (function () {
    function GeneratedFile(srcFileUrl, genFileUrl, sourceOrStmts) {
        this.srcFileUrl = srcFileUrl;
        this.genFileUrl = genFileUrl;
        if (typeof sourceOrStmts === 'string') {
            this.source = sourceOrStmts;
            this.stmts = null;
        }
        else {
            this.source = null;
            this.stmts = sourceOrStmts;
        }
    }
    GeneratedFile.prototype.isEquivalent = function (other) {
        if (this.genFileUrl !== other.genFileUrl) {
            return false;
        }
        if (this.source) {
            return this.source === other.source;
        }
        if (other.stmts == null) {
            return false;
        }
        // Note: the constructor guarantees that if this.source is not filled,
        // then this.stmts is.
        return output_ast_1.areAllEquivalent(this.stmts, other.stmts);
    };
    return GeneratedFile;
}());
exports.GeneratedFile = GeneratedFile;
function toTypeScript(file, preamble) {
    if (preamble === void 0) { preamble = ''; }
    if (!file.stmts) {
        throw new Error("Illegal state: No stmts present on GeneratedFile " + file.genFileUrl);
    }
    return new ts_emitter_1.TypeScriptEmitter().emitStatements(file.genFileUrl, file.stmts, preamble);
}
exports.toTypeScript = toTypeScript;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkX2ZpbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvYW90L2dlbmVyYXRlZF9maWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsbURBQWlFO0FBQ2pFLG1EQUF1RDtBQUV2RDtJQUlFLHVCQUNXLFVBQWtCLEVBQVMsVUFBa0IsRUFBRSxhQUFpQztRQUFoRixlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQVMsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUN0RCxJQUFJLE9BQU8sYUFBYSxLQUFLLFFBQVEsRUFBRTtZQUNyQyxJQUFJLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQztZQUM1QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztTQUNuQjthQUFNO1lBQ0wsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUM7U0FDNUI7SUFDSCxDQUFDO0lBRUQsb0NBQVksR0FBWixVQUFhLEtBQW9CO1FBQy9CLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsVUFBVSxFQUFFO1lBQ3hDLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDZixPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssS0FBSyxDQUFDLE1BQU0sQ0FBQztTQUNyQztRQUNELElBQUksS0FBSyxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUU7WUFDdkIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELHNFQUFzRTtRQUN0RSxzQkFBc0I7UUFDdEIsT0FBTyw2QkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBTyxFQUFFLEtBQUssQ0FBQyxLQUFPLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBN0JELElBNkJDO0FBN0JZLHNDQUFhO0FBK0IxQixzQkFBNkIsSUFBbUIsRUFBRSxRQUFxQjtJQUFyQix5QkFBQSxFQUFBLGFBQXFCO0lBQ3JFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1FBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQyxzREFBb0QsSUFBSSxDQUFDLFVBQVksQ0FBQyxDQUFDO0tBQ3hGO0lBQ0QsT0FBTyxJQUFJLDhCQUFpQixFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN2RixDQUFDO0FBTEQsb0NBS0MifQ==