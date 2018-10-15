"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var util_1 = require("./util");
/**
 * Cache, and potentially transform, metadata as it is being collected.
 */
var MetadataCache = /** @class */ (function () {
    function MetadataCache(collector, strict, transformers) {
        this.collector = collector;
        this.strict = strict;
        this.transformers = transformers;
        this.metadataCache = new Map();
        for (var _i = 0, transformers_1 = transformers; _i < transformers_1.length; _i++) {
            var transformer = transformers_1[_i];
            if (transformer.connect) {
                transformer.connect(this);
            }
        }
    }
    MetadataCache.prototype.getMetadata = function (sourceFile) {
        if (this.metadataCache.has(sourceFile.fileName)) {
            return this.metadataCache.get(sourceFile.fileName);
        }
        var substitute = undefined;
        // Only process transformers on modules that are not declaration files.
        var declarationFile = sourceFile.isDeclarationFile;
        var moduleFile = ts.isExternalModule(sourceFile);
        if (!declarationFile && moduleFile) {
            var _loop_1 = function (transform) {
                var transformSubstitute = transform.start(sourceFile);
                if (transformSubstitute) {
                    if (substitute) {
                        var previous_1 = substitute;
                        substitute = function (value, node) {
                            return transformSubstitute(previous_1(value, node), node);
                        };
                    }
                    else {
                        substitute = transformSubstitute;
                    }
                }
            };
            for (var _i = 0, _a = this.transformers; _i < _a.length; _i++) {
                var transform = _a[_i];
                _loop_1(transform);
            }
        }
        var isTsFile = util_1.TS.test(sourceFile.fileName);
        var result = this.collector.getMetadata(sourceFile, this.strict && isTsFile, substitute);
        this.metadataCache.set(sourceFile.fileName, result);
        return result;
    };
    return MetadataCache;
}());
exports.MetadataCache = MetadataCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGFfY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL3RyYW5zZm9ybWVycy9tZXRhZGF0YV9jYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtCQUFpQztBQUtqQywrQkFBMEI7QUFTMUI7O0dBRUc7QUFDSDtJQUdFLHVCQUNZLFNBQTRCLEVBQW1CLE1BQWUsRUFDOUQsWUFBbUM7UUFEbkMsY0FBUyxHQUFULFNBQVMsQ0FBbUI7UUFBbUIsV0FBTSxHQUFOLE1BQU0sQ0FBUztRQUM5RCxpQkFBWSxHQUFaLFlBQVksQ0FBdUI7UUFKdkMsa0JBQWEsR0FBRyxJQUFJLEdBQUcsRUFBb0MsQ0FBQztRQUtsRSxLQUF3QixVQUFZLEVBQVosNkJBQVksRUFBWiwwQkFBWSxFQUFaLElBQVksRUFBRTtZQUFqQyxJQUFJLFdBQVcscUJBQUE7WUFDbEIsSUFBSSxXQUFXLENBQUMsT0FBTyxFQUFFO2dCQUN2QixXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzNCO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsbUNBQVcsR0FBWCxVQUFZLFVBQXlCO1FBQ25DLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQy9DLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3BEO1FBQ0QsSUFBSSxVQUFVLEdBQTZCLFNBQVMsQ0FBQztRQUVyRCx1RUFBdUU7UUFDdkUsSUFBTSxlQUFlLEdBQUcsVUFBVSxDQUFDLGlCQUFpQixDQUFDO1FBQ3JELElBQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsZUFBZSxJQUFJLFVBQVUsRUFBRTtvQ0FDekIsU0FBUztnQkFDaEIsSUFBTSxtQkFBbUIsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUN4RCxJQUFJLG1CQUFtQixFQUFFO29CQUN2QixJQUFJLFVBQVUsRUFBRTt3QkFDZCxJQUFNLFVBQVEsR0FBbUIsVUFBVSxDQUFDO3dCQUM1QyxVQUFVLEdBQUcsVUFBQyxLQUFvQixFQUFFLElBQWE7NEJBQzdDLE9BQUEsbUJBQW1CLENBQUMsVUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUM7d0JBQWhELENBQWdELENBQUM7cUJBQ3REO3lCQUFNO3dCQUNMLFVBQVUsR0FBRyxtQkFBbUIsQ0FBQztxQkFDbEM7aUJBQ0Y7WUFDSCxDQUFDO1lBWEQsS0FBc0IsVUFBaUIsRUFBakIsS0FBQSxJQUFJLENBQUMsWUFBWSxFQUFqQixjQUFpQixFQUFqQixJQUFpQjtnQkFBbEMsSUFBSSxTQUFTLFNBQUE7d0JBQVQsU0FBUzthQVdqQjtTQUNGO1FBRUQsSUFBTSxRQUFRLEdBQUcsU0FBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUMsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLElBQUksUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzNGLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDcEQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQTFDRCxJQTBDQztBQTFDWSxzQ0FBYSJ9