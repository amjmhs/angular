"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var summary_serializer_1 = require("./summary_serializer");
var util_1 = require("./util");
var AotSummaryResolver = /** @class */ (function () {
    function AotSummaryResolver(host, staticSymbolCache) {
        this.host = host;
        this.staticSymbolCache = staticSymbolCache;
        // Note: this will only contain StaticSymbols without members!
        this.summaryCache = new Map();
        this.loadedFilePaths = new Map();
        // Note: this will only contain StaticSymbols without members!
        this.importAs = new Map();
        this.knownFileNameToModuleNames = new Map();
    }
    AotSummaryResolver.prototype.isLibraryFile = function (filePath) {
        // Note: We need to strip the .ngfactory. file path,
        // so this method also works for generated files
        // (for which host.isSourceFile will always return false).
        return !this.host.isSourceFile(util_1.stripGeneratedFileSuffix(filePath));
    };
    AotSummaryResolver.prototype.toSummaryFileName = function (filePath, referringSrcFileName) {
        return this.host.toSummaryFileName(filePath, referringSrcFileName);
    };
    AotSummaryResolver.prototype.fromSummaryFileName = function (fileName, referringLibFileName) {
        return this.host.fromSummaryFileName(fileName, referringLibFileName);
    };
    AotSummaryResolver.prototype.resolveSummary = function (staticSymbol) {
        var rootSymbol = staticSymbol.members.length ?
            this.staticSymbolCache.get(staticSymbol.filePath, staticSymbol.name) :
            staticSymbol;
        var summary = this.summaryCache.get(rootSymbol);
        if (!summary) {
            this._loadSummaryFile(staticSymbol.filePath);
            summary = this.summaryCache.get(staticSymbol);
        }
        return (rootSymbol === staticSymbol && summary) || null;
    };
    AotSummaryResolver.prototype.getSymbolsOf = function (filePath) {
        if (this._loadSummaryFile(filePath)) {
            return Array.from(this.summaryCache.keys()).filter(function (symbol) { return symbol.filePath === filePath; });
        }
        return null;
    };
    AotSummaryResolver.prototype.getImportAs = function (staticSymbol) {
        staticSymbol.assertNoMembers();
        return this.importAs.get(staticSymbol);
    };
    /**
     * Converts a file path to a module name that can be used as an `import`.
     */
    AotSummaryResolver.prototype.getKnownModuleName = function (importedFilePath) {
        return this.knownFileNameToModuleNames.get(importedFilePath) || null;
    };
    AotSummaryResolver.prototype.addSummary = function (summary) { this.summaryCache.set(summary.symbol, summary); };
    AotSummaryResolver.prototype._loadSummaryFile = function (filePath) {
        var _this = this;
        var hasSummary = this.loadedFilePaths.get(filePath);
        if (hasSummary != null) {
            return hasSummary;
        }
        var json = null;
        if (this.isLibraryFile(filePath)) {
            var summaryFilePath = util_1.summaryFileName(filePath);
            try {
                json = this.host.loadSummary(summaryFilePath);
            }
            catch (e) {
                console.error("Error loading summary file " + summaryFilePath);
                throw e;
            }
        }
        hasSummary = json != null;
        this.loadedFilePaths.set(filePath, hasSummary);
        if (json) {
            var _a = summary_serializer_1.deserializeSummaries(this.staticSymbolCache, this, filePath, json), moduleName = _a.moduleName, summaries = _a.summaries, importAs = _a.importAs;
            summaries.forEach(function (summary) { return _this.summaryCache.set(summary.symbol, summary); });
            if (moduleName) {
                this.knownFileNameToModuleNames.set(filePath, moduleName);
            }
            importAs.forEach(function (importAs) { _this.importAs.set(importAs.symbol, importAs.importAs); });
        }
        return hasSummary;
    };
    return AotSummaryResolver;
}());
exports.AotSummaryResolver = AotSummaryResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VtbWFyeV9yZXNvbHZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9hb3Qvc3VtbWFyeV9yZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUtILDJEQUEwRDtBQUMxRCwrQkFBaUU7QUE2QmpFO0lBUUUsNEJBQW9CLElBQTRCLEVBQVUsaUJBQW9DO1FBQTFFLFNBQUksR0FBSixJQUFJLENBQXdCO1FBQVUsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQVA5Riw4REFBOEQ7UUFDdEQsaUJBQVksR0FBRyxJQUFJLEdBQUcsRUFBdUMsQ0FBQztRQUM5RCxvQkFBZSxHQUFHLElBQUksR0FBRyxFQUFtQixDQUFDO1FBQ3JELDhEQUE4RDtRQUN0RCxhQUFRLEdBQUcsSUFBSSxHQUFHLEVBQThCLENBQUM7UUFDakQsK0JBQTBCLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7SUFFa0MsQ0FBQztJQUVsRywwQ0FBYSxHQUFiLFVBQWMsUUFBZ0I7UUFDNUIsb0RBQW9EO1FBQ3BELGdEQUFnRDtRQUNoRCwwREFBMEQ7UUFDMUQsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLCtCQUF3QixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUVELDhDQUFpQixHQUFqQixVQUFrQixRQUFnQixFQUFFLG9CQUE0QjtRQUM5RCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLG9CQUFvQixDQUFDLENBQUM7SUFDckUsQ0FBQztJQUVELGdEQUFtQixHQUFuQixVQUFvQixRQUFnQixFQUFFLG9CQUE0QjtRQUNoRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLG9CQUFvQixDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVELDJDQUFjLEdB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