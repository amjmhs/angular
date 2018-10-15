"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SummaryResolver = /** @class */ (function () {
    function SummaryResolver() {
    }
    return SummaryResolver;
}());
exports.SummaryResolver = SummaryResolver;
var JitSummaryResolver = /** @class */ (function () {
    function JitSummaryResolver() {
        this._summaries = new Map();
    }
    JitSummaryResolver.prototype.isLibraryFile = function () { return false; };
    JitSummaryResolver.prototype.toSummaryFileName = function (fileName) { return fileName; };
    JitSummaryResolver.prototype.fromSummaryFileName = function (fileName) { return fileName; };
    JitSummaryResolver.prototype.resolveSummary = function (reference) {
        return this._summaries.get(reference) || null;
    };
    JitSummaryResolver.prototype.getSymbolsOf = function () { return []; };
    JitSummaryResolver.prototype.getImportAs = function (reference) { return reference; };
    JitSummaryResolver.prototype.getKnownModuleName = function (fileName) { return null; };
    JitSummaryResolver.prototype.addSummary = function (summary) { this._summaries.set(summary.symbol, summary); };
    return JitSummaryResolver;
}());
exports.JitSummaryResolver = JitSummaryResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VtbWFyeV9yZXNvbHZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9zdW1tYXJ5X3Jlc29sdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBZ0JBO0lBQUE7SUFTQSxDQUFDO0lBQUQsc0JBQUM7QUFBRCxDQUFDLEFBVEQsSUFTQztBQVRxQiwwQ0FBZTtBQVdyQztJQUFBO1FBQ1UsZUFBVSxHQUFHLElBQUksR0FBRyxFQUF1QixDQUFDO0lBWXRELENBQUM7SUFWQywwQ0FBYSxHQUFiLGNBQTJCLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMxQyw4Q0FBaUIsR0FBakIsVUFBa0IsUUFBZ0IsSUFBWSxPQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDaEUsZ0RBQW1CLEdBQW5CLFVBQW9CLFFBQWdCLElBQVksT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLDJDQUFjLEdBQWQsVUFBZSxTQUFlO1FBQzVCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFDO0lBQ2hELENBQUM7SUFDRCx5Q0FBWSxHQUFaLGNBQXlCLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNyQyx3Q0FBVyxHQUFYLFVBQVksU0FBZSxJQUFVLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQztJQUN4RCwrQ0FBa0IsR0FBbEIsVUFBbUIsUUFBZ0IsSUFBSSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDckQsdUNBQVUsR0FBVixVQUFXLE9BQXNCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEYseUJBQUM7QUFBRCxDQUFDLEFBYkQsSUFhQztBQWJZLGdEQUFrQiJ9