"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var metadata_1 = require("../metadata");
var util_1 = require("./util");
function createMetadataReaderCache() {
    var data = new Map();
    return { data: data };
}
exports.createMetadataReaderCache = createMetadataReaderCache;
function readMetadata(filePath, host, cache) {
    var metadatas = cache && cache.data.get(filePath);
    if (metadatas) {
        return metadatas;
    }
    if (host.fileExists(filePath)) {
        // If the file doesn't exists then we cannot return metadata for the file.
        // This will occur if the user referenced a declared module for which no file
        // exists for the module (i.e. jQuery or angularjs).
        if (util_1.DTS.test(filePath)) {
            metadatas = readMetadataFile(host, filePath);
            if (!metadatas) {
                // If there is a .d.ts file but no metadata file we need to produce a
                // metadata from the .d.ts file as metadata files capture reexports
                // (starting with v3).
                metadatas = [upgradeMetadataWithDtsData(host, { '__symbolic': 'module', 'version': 1, 'metadata': {} }, filePath)];
            }
        }
        else {
            var metadata = host.getSourceFileMetadata(filePath);
            metadatas = metadata ? [metadata] : [];
        }
    }
    if (cache && (!host.cacheMetadata || host.cacheMetadata(filePath))) {
        cache.data.set(filePath, metadatas);
    }
    return metadatas;
}
exports.readMetadata = readMetadata;
function readMetadataFile(host, dtsFilePath) {
    var metadataPath = dtsFilePath.replace(util_1.DTS, '.metadata.json');
    if (!host.fileExists(metadataPath)) {
        return undefined;
    }
    try {
        var metadataOrMetadatas = JSON.parse(host.readFile(metadataPath));
        var metadatas = metadataOrMetadatas ?
            (Array.isArray(metadataOrMetadatas) ? metadataOrMetadatas : [metadataOrMetadatas]) :
            [];
        if (metadatas.length) {
            var maxMetadata = metadatas.reduce(function (p, c) { return p.version > c.version ? p : c; });
            if (maxMetadata.version < metadata_1.METADATA_VERSION) {
                metadatas.push(upgradeMetadataWithDtsData(host, maxMetadata, dtsFilePath));
            }
        }
        return metadatas;
    }
    catch (e) {
        console.error("Failed to read JSON file " + metadataPath);
        throw e;
    }
}
function upgradeMetadataWithDtsData(host, oldMetadata, dtsFilePath) {
    // patch v1 to v3 by adding exports and the `extends` clause.
    // patch v3 to v4 by adding `interface` symbols for TypeAlias
    var newMetadata = {
        '__symbolic': 'module',
        'version': metadata_1.METADATA_VERSION,
        'metadata': __assign({}, oldMetadata.metadata),
    };
    if (oldMetadata.exports) {
        newMetadata.exports = oldMetadata.exports;
    }
    if (oldMetadata.importAs) {
        newMetadata.importAs = oldMetadata.importAs;
    }
    if (oldMetadata.origins) {
        newMetadata.origins = oldMetadata.origins;
    }
    var dtsMetadata = host.getSourceFileMetadata(dtsFilePath);
    if (dtsMetadata) {
        for (var prop in dtsMetadata.metadata) {
            if (!newMetadata.metadata[prop]) {
                newMetadata.metadata[prop] = dtsMetadata.metadata[prop];
            }
        }
        if (dtsMetadata['importAs'])
            newMetadata['importAs'] = dtsMetadata['importAs'];
        // Only copy exports from exports from metadata prior to version 3.
        // Starting with version 3 the collector began collecting exports and
        // this should be redundant. Also, with bundler will rewrite the exports
        // which will hoist the exports from modules referenced indirectly causing
        // the imports to be different than the .d.ts files and using the .d.ts file
        // exports would cause the StaticSymbolResolver to redirect symbols to the
        // incorrect location.
        if ((!oldMetadata.version || oldMetadata.version < 3) && dtsMetadata.exports) {
            newMetadata.exports = dtsMetadata.exports;
        }
    }
    return newMetadata;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGFfcmVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy90cmFuc2Zvcm1lcnMvbWV0YWRhdGFfcmVhZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7QUFJSCx3Q0FBNkQ7QUFFN0QsK0JBQTJCO0FBZ0IzQjtJQUNFLElBQU0sSUFBSSxHQUFHLElBQUksR0FBRyxFQUFzQyxDQUFDO0lBQzNELE9BQU8sRUFBQyxJQUFJLE1BQUEsRUFBQyxDQUFDO0FBQ2hCLENBQUM7QUFIRCw4REFHQztBQUVELHNCQUNJLFFBQWdCLEVBQUUsSUFBd0IsRUFBRSxLQUEyQjtJQUV6RSxJQUFJLFNBQVMsR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEQsSUFBSSxTQUFTLEVBQUU7UUFDYixPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUNELElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUM3QiwwRUFBMEU7UUFDMUUsNkVBQTZFO1FBQzdFLG9EQUFvRDtRQUNwRCxJQUFJLFVBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDdEIsU0FBUyxHQUFHLGdCQUFnQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNkLHFFQUFxRTtnQkFDckUsbUVBQW1FO2dCQUNuRSxzQkFBc0I7Z0JBQ3RCLFNBQVMsR0FBRyxDQUFDLDBCQUEwQixDQUNuQyxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7YUFDOUU7U0FDRjthQUFNO1lBQ0wsSUFBTSxR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