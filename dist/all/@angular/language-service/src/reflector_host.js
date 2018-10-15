"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var language_services_1 = require("@angular/compiler-cli/src/language_services");
var path = require("path");
var ts = require("typescript");
var ReflectorModuleModuleResolutionHost = /** @class */ (function () {
    function ReflectorModuleModuleResolutionHost(host, getProgram) {
        var _this = this;
        this.host = host;
        this.getProgram = getProgram;
        // Note: verboseInvalidExpressions is important so that
        // the collector will collect errors instead of throwing
        this.metadataCollector = new language_services_1.MetadataCollector({ verboseInvalidExpression: true });
        if (host.directoryExists)
            this.directoryExists = function (directoryName) { return _this.host.directoryExists(directoryName); };
    }
    ReflectorModuleModuleResolutionHost.prototype.fileExists = function (fileName) { return !!this.host.getScriptSnapshot(fileName); };
    ReflectorModuleModuleResolutionHost.prototype.readFile = function (fileName) {
        var snapshot = this.host.getScriptSnapshot(fileName);
        if (snapshot) {
            return snapshot.getText(0, snapshot.getLength());
        }
        // Typescript readFile() declaration should be `readFile(fileName: string): string | undefined
        return undefined;
    };
    ReflectorModuleModuleResolutionHost.prototype.getSourceFileMetadata = function (fileName) {
        var sf = this.getProgram().getSourceFile(fileName);
        return sf ? this.metadataCollector.getMetadata(sf) : undefined;
    };
    ReflectorModuleModuleResolutionHost.prototype.cacheMetadata = function (fileName) {
        // Don't cache the metadata for .ts files as they might change in the editor!
        return fileName.endsWith('.d.ts');
    };
    return ReflectorModuleModuleResolutionHost;
}());
var ReflectorHost = /** @class */ (function () {
    function ReflectorHost(getProgram, serviceHost, options) {
        this.options = options;
        this.metadataReaderCache = language_services_1.createMetadataReaderCache();
        this.hostAdapter = new ReflectorModuleModuleResolutionHost(serviceHost, getProgram);
        this.moduleResolutionCache =
            ts.createModuleResolutionCache(serviceHost.getCurrentDirectory(), function (s) { return s; });
    }
    ReflectorHost.prototype.getMetadataFor = function (modulePath) {
        return language_services_1.readMetadata(modulePath, this.hostAdapter, this.metadataReaderCache);
    };
    ReflectorHost.prototype.moduleNameToFileName = function (moduleName, containingFile) {
        if (!containingFile) {
            if (moduleName.indexOf('.') === 0) {
                throw new Error('Resolution of relative paths requires a containing file.');
            }
            // Any containing file gives the same result for absolute imports
            containingFile = path.join(this.options.basePath, 'index.ts').replace(/\\/g, '/');
        }
        var resolved = ts.resolveModuleName(moduleName, containingFile, this.options, this.hostAdapter)
            .resolvedModule;
        return resolved ? resolved.resolvedFileName : null;
    };
    ReflectorHost.prototype.getOutputName = function (filePath) { return filePath; };
    return ReflectorHost;
}());
exports.ReflectorHost = ReflectorHost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdG9yX2hvc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sYW5ndWFnZS1zZXJ2aWNlL3NyYy9yZWZsZWN0b3JfaG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILGlGQUFpTDtBQUNqTCwyQkFBNkI7QUFDN0IsK0JBQWlDO0FBRWpDO0lBS0UsNkNBQW9CLElBQTRCLEVBQVUsVUFBNEI7UUFBdEYsaUJBR0M7UUFIbUIsU0FBSSxHQUFKLElBQUksQ0FBd0I7UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUFrQjtRQUp0Rix1REFBdUQ7UUFDdkQsd0RBQXdEO1FBQ2hELHNCQUFpQixHQUFHLElBQUkscUNBQWlCLENBQUMsRUFBQyx3QkFBd0IsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBR2xGLElBQUksSUFBSSxDQUFDLGVBQWU7WUFDdEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxVQUFBLGFBQWEsSUFBSSxPQUFBLEtBQUksQ0FBQyxJQUFJLENBQUMsZUFBaUIsQ0FBQyxhQUFhLENBQUMsRUFBMUMsQ0FBMEMsQ0FBQztJQUN2RixDQUFDO0lBRUQsd0RBQVUsR0FBVixVQUFXLFFBQWdCLElBQWEsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFekYsc0RBQVEsR0FBUixVQUFTLFFBQWdCO1FBQ3ZCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckQsSUFBSSxRQUFRLEVBQUU7WUFDWixPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1NBQ2xEO1FBRUQsOEZBQThGO1FBQzlGLE9BQU8sU0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFLRCxtRUFBcUIsR0FBckIsVUFBc0IsUUFBZ0I7UUFDcEMsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyRCxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ2pFLENBQUM7SUFFRCwyREFBYSxHQUFiLFVBQWMsUUFBZ0I7UUFDNUIsNkVBQTZFO1FBQzdFLE9BQU8sUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBQ0gsMENBQUM7QUFBRCxDQUFDLEFBbENELElBa0NDO0FBRUQ7SUFLRSx1QkFDSSxVQUE0QixFQUFFLFdBQW1DLEVBQ3pELE9BQXdCO1FBQXhCLFlBQU8sR0FBUCxPQUFPLENBQWlCO1FBSjVCLHdCQUFtQixHQUFHLDZDQUF5QixFQUFFLENBQUM7UUFLeEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLG1DQUFtQyxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNwRixJQUFJLENBQUMscUJBQXFCO1lBQ3RCLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQyxXQUFXLENBQUMsbUJBQW1CLEVBQUUsRUFBRSxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsRUFBRCxDQUFDLENBQUMsQ0FBQztJQUNsRixDQUFDO0lBRUQsc0NBQWMsR0FBZCxVQUFlLFVBQWtCO1FBQy9CLE9BQU8sZ0NBQVksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBRUQsNENBQW9CLEdBQXBCLFVBQXFCLFVBQWtCLEVBQUUsY0FBdUI7UUFDOUQsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNuQixJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNqQyxNQUFNLElBQUksS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7YUFDN0U7WUFDRCxpRUFBaUU7WUFDakUsY0FBYyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFVLEVBQUUsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztTQUNyRjtRQUNELElBQU0sUUFBUSxHQUNWLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsY0FBZ0IsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUM7YUFDN0UsY0FBYyxDQUFDO1FBQ3hCLE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNyRCxDQUFDO0lBRUQscUNBQWEsR0FBYixVQUFjLFFBQWdCLElBQUksT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3RELG9CQUFDO0FBQUQsQ0FBQyxBQWhDRCxJQWdDQztBQWhDWSxzQ0FBYSJ9