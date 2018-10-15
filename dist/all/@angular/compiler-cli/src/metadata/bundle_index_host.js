"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var ts = require("typescript");
var bundler_1 = require("./bundler");
var index_writer_1 = require("./index_writer");
var DTS = /\.d\.ts$/;
var JS_EXT = /(\.js|)$/;
function createSyntheticIndexHost(delegate, syntheticIndex) {
    var normalSyntheticIndexName = path.normalize(syntheticIndex.name);
    var newHost = Object.create(delegate);
    newHost.fileExists = function (fileName) {
        return path.normalize(fileName) == normalSyntheticIndexName || delegate.fileExists(fileName);
    };
    newHost.readFile = function (fileName) {
        return path.normalize(fileName) == normalSyntheticIndexName ? syntheticIndex.content :
            delegate.readFile(fileName);
    };
    newHost.getSourceFile =
        function (fileName, languageVersion, onError) {
            if (path.normalize(fileName) == normalSyntheticIndexName) {
                var sf = ts.createSourceFile(fileName, syntheticIndex.content, languageVersion, true);
                if (delegate.fileNameToModuleName) {
                    sf.moduleName = delegate.fileNameToModuleName(fileName);
                }
                return sf;
            }
            return delegate.getSourceFile(fileName, languageVersion, onError);
        };
    newHost.writeFile =
        function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
            delegate.writeFile(fileName, data, writeByteOrderMark, onError, sourceFiles);
            if (fileName.match(DTS) && sourceFiles && sourceFiles.length == 1 &&
                path.normalize(sourceFiles[0].fileName) === normalSyntheticIndexName) {
                // If we are writing the synthetic index, write the metadata along side.
                var metadataName = fileName.replace(DTS, '.metadata.json');
                var indexMetadata = syntheticIndex.getMetadata();
                delegate.writeFile(metadataName, indexMetadata, writeByteOrderMark, onError, []);
            }
        };
    return newHost;
}
function createBundleIndexHost(ngOptions, rootFiles, host, getMetadataCache) {
    var files = rootFiles.filter(function (f) { return !DTS.test(f); });
    var indexFile;
    if (files.length === 1) {
        indexFile = files[0];
    }
    else {
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var f = files_1[_i];
            // Assume the shortest file path called index.ts is the entry point
            if (f.endsWith(path.sep + 'index.ts')) {
                if (!indexFile || indexFile.length > f.length) {
                    indexFile = f;
                }
            }
        }
    }
    if (!indexFile) {
        return {
            host: host,
            errors: [{
                    file: null,
                    start: null,
                    length: null,
                    messageText: 'Angular compiler option "flatModuleIndex" requires one and only one .ts file in the "files" field.',
                    category: ts.DiagnosticCategory.Error,
                    code: 0
                }]
        };
    }
    var indexModule = indexFile.replace(/\.ts$/, '');
    // The operation of producing a metadata bundle happens twice - once during setup and once during
    // the emit phase. The first time, the bundle is produced without a metadata cache, to compute the
    // contents of the flat module index. The bundle produced during emit does use the metadata cache
    // with associated transforms, so the metadata will have lowered expressions, resource inlining,
    // etc.
    var getMetadataBundle = function (cache) {
        var bundler = new bundler_1.MetadataBundler(indexModule, ngOptions.flatModuleId, new bundler_1.CompilerHostAdapter(host, cache, ngOptions), ngOptions.flatModulePrivateSymbolPrefix);
        return bundler.getMetadataBundle();
    };
    // First, produce the bundle with no MetadataCache.
    var metadataBundle = getMetadataBundle(/* MetadataCache */ null);
    var name = path.join(path.dirname(indexModule), ngOptions.flatModuleOutFile.replace(JS_EXT, '.ts'));
    var libraryIndex = "./" + path.basename(indexModule);
    var content = index_writer_1.privateEntriesToIndex(libraryIndex, metadataBundle.privates);
    host = createSyntheticIndexHost(host, {
        name: name,
        content: content,
        getMetadata: function () {
            // The second metadata bundle production happens on-demand, and uses the getMetadataCache
            // closure to retrieve an up-to-date MetadataCache which is configured with whatever metadata
            // transforms were used to produce the JS output.
            var metadataBundle = getMetadataBundle(getMetadataCache());
            return JSON.stringify(metadataBundle.metadata);
        }
    });
    return { host: host, indexName: name };
}
exports.createBundleIndexHost = createBundleIndexHost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlX2luZGV4X2hvc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL21ldGFkYXRhL2J1bmRsZV9pbmRleF9ob3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsMkJBQTZCO0FBQzdCLCtCQUFpQztBQUtqQyxxQ0FBK0Q7QUFDL0QsK0NBQXFEO0FBRXJELElBQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQztBQUN2QixJQUFNLE1BQU0sR0FBRyxVQUFVLENBQUM7QUFFMUIsa0NBQ0ksUUFBVyxFQUFFLGNBQTBFO0lBQ3pGLElBQU0sd0JBQXdCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFckUsSUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN4QyxPQUFPLENBQUMsVUFBVSxHQUFHLFVBQUMsUUFBZ0I7UUFDcEMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLHdCQUF3QixJQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDL0YsQ0FBQyxDQUFDO0lBRUYsT0FBTyxDQUFDLFFBQVEsR0FBRyxVQUFDLFFBQWdCO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3hCLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUYsQ0FBQyxDQUFDO0lBRUYsT0FBTyxDQUFDLGFBQWE7UUFDakIsVUFBQyxRQUFnQixFQUFFLGVBQWdDLEVBQUUsT0FBbUM7WUFDdEYsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLHdCQUF3QixFQUFF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