"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Implementation of `CompilerHost` which delegates to a native TypeScript host in most cases.
 */
var NgtscCompilerHost = /** @class */ (function () {
    function NgtscCompilerHost(delegate) {
        this.delegate = delegate;
        if (delegate.resolveTypeReferenceDirectives) {
            this.resolveTypeReferenceDirectives = function (names, containingFile) {
                return delegate.resolveTypeReferenceDirectives(names, containingFile);
            };
        }
    }
    NgtscCompilerHost.prototype.getSourceFile = function (fileName, languageVersion, onError, shouldCreateNewSourceFile) {
        return this.delegate.getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile);
    };
    NgtscCompilerHost.prototype.getDefaultLibFileName = function (options) {
        return this.delegate.getDefaultLibFileName(options);
    };
    NgtscCompilerHost.prototype.writeFile = function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
        return this.delegate.writeFile(fileName, data, writeByteOrderMark, onError, sourceFiles);
    };
    NgtscCompilerHost.prototype.getCurrentDirectory = function () { return this.delegate.getCurrentDirectory(); };
    NgtscCompilerHost.prototype.getDirectories = function (path) { return this.delegate.getDirectories(path); };
    NgtscCompilerHost.prototype.getCanonicalFileName = function (fileName) {
        return this.delegate.getCanonicalFileName(fileName);
    };
    NgtscCompilerHost.prototype.useCaseSensitiveFileNames = function () { return this.delegate.useCaseSensitiveFileNames(); };
    NgtscCompilerHost.prototype.getNewLine = function () { return this.delegate.getNewLine(); };
    NgtscCompilerHost.prototype.fileExists = function (fileName) { return this.delegate.fileExists(fileName); };
    NgtscCompilerHost.prototype.readFile = function (fileName) { return this.delegate.readFile(fileName); };
    NgtscCompilerHost.prototype.loadResource = function (file) { throw new Error('Method not implemented.'); };
    NgtscCompilerHost.prototype.preloadResource = function (file) { throw new Error('Method not implemented.'); };
    return NgtscCompilerHost;
}());
exports.NgtscCompilerHost = NgtscCompilerHost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXJfaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvY29tcGlsZXJfaG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQTBCSDs7R0FFRztBQUNIO0lBQ0UsMkJBQW9CLFFBQXlCO1FBQXpCLGFBQVEsR0FBUixRQUFRLENBQWlCO1FBQzNDLElBQUksUUFBUSxDQUFDLDhCQUE4QixFQUFFO1lBTTNDLElBQUksQ0FBQyw4QkFBOEIsR0FBRyxVQUFDLEtBQWUsRUFBRSxjQUFzQjtnQkFDMUUsT0FBQyxRQUFRLENBQUMsOEJBQXNFLENBQzVFLEtBQUssRUFBRSxjQUFjLENBQUM7WUFEMUIsQ0FDMEIsQ0FBQztTQUNoQztJQUNILENBQUM7SUFLRCx5Q0FBYSxHQUFiLFVBQ0ksUUFBZ0IsRUFBRSxlQUFnQyxFQUNsRCxPQUErQyxFQUMvQyx5QkFBNkM7UUFDL0MsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FDOUIsUUFBUSxFQUFFLGVBQWUsRUFBRSxPQUFPLEVBQUUseUJBQXlCLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBRUQsaURBQXFCLEdBQXJCLFVBQXNCLE9BQTJCO1FBQy9DLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQscUNBQVMsR0FBVCxVQUNJLFFBQWdCLEVBQUUsSUFBWSxFQUFFLGtCQUEyQixFQUMzRCxPQUE4QyxFQUM5QyxXQUF5QztRQUMzQyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQzNGLENBQUM7SUFFRCwrQ0FBbUIsR0FBbkIsY0FBZ0MsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRTdFLDBDQUFjLEdBQWQsVUFBZSxJQUFZLElBQWMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFckYsZ0RBQW9CLEdBQXBCLFVBQXFCLFFBQWdCO1FBQ25DLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQscURBQXlCLEdBQXpCLGNBQXVDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUUxRixzQ0FBVSxHQUFWLGNBQXVCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFM0Qsc0NBQVUsR0FBVixVQUFXLFFBQWdCLElBQWEsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFcEYsb0NBQVEsR0FBUixVQUFTLFFBQWdCLElBQXNCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXpGLHdDQUFZLEdBQVosVUFBYSxJQUFZLElBQXNCLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFNUYsMkNBQWUsR0FBZixVQUFnQixJQUFZLElBQW1CLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUYsd0JBQUM7QUFBRCxDQUFDLEFBdkRELElBdURDO0FBdkRZLDhDQUFpQiJ9