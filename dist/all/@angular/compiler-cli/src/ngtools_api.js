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
var compiler_host_1 = require("./transformers/compiler_host");
var entry_points_1 = require("./transformers/entry_points");
/**
 * @internal
 * @deprecatd Use ngtools_api2 instead!
 */
var NgTools_InternalApi_NG_2 = /** @class */ (function () {
    function NgTools_InternalApi_NG_2() {
    }
    /**
     * @internal
     */
    NgTools_InternalApi_NG_2.codeGen = function (options) {
        throw throwNotSupportedError();
    };
    /**
     * @internal
     */
    NgTools_InternalApi_NG_2.listLazyRoutes = function (options) {
        // TODO(tbosch): Also throwNotSupportedError once Angular CLI 1.5.1 ships,
        // as we only needed this to support Angular CLI 1.5.0 rc.*
        var ngProgram = entry_points_1.createProgram({
            rootNames: options.program.getRootFileNames(),
            options: __assign({}, options.angularCompilerOptions, { collectAllErrors: true }),
            host: options.host
        });
        var lazyRoutes = ngProgram.listLazyRoutes(options.entryModule);
        // reset the referencedFiles that the ng.Program added to the SourceFiles
        // as the host might be caching the source files!
        for (var _i = 0, _a = options.program.getSourceFiles(); _i < _a.length; _i++) {
            var sourceFile = _a[_i];
            var originalReferences = compiler_host_1.getOriginalReferences(sourceFile);
            if (originalReferences) {
                sourceFile.referencedFiles = originalReferences;
            }
        }
        var result = {};
        lazyRoutes.forEach(function (lazyRoute) {
            var route = lazyRoute.route;
            var referencedFilePath = lazyRoute.referencedModule.filePath;
            if (result[route] && result[route] != referencedFilePath) {
                throw new Error("Duplicated path in loadChildren detected: \"" + route + "\" is used in 2 loadChildren, " +
                    ("but they point to different modules \"(" + result[route] + " and ") +
                    ("\"" + referencedFilePath + "\"). Webpack cannot distinguish on context and would fail to ") +
                    'load the proper one.');
            }
            result[route] = referencedFilePath;
        });
        return result;
    };
    /**
     * @internal
     */
    NgTools_InternalApi_NG_2.extractI18n = function (options) {
        throw throwNotSupportedError();
    };
    return NgTools_InternalApi_NG_2;
}());
exports.NgTools_InternalApi_NG_2 = NgTools_InternalApi_NG_2;
function throwNotSupportedError() {
    throw new Error("Please update @angular/cli. Angular 5+ requires at least Angular CLI 1.5+");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd0b29sc19hcGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndG9vbHNfYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7QUFrQkgsOERBQW1FO0FBQ25FLDREQUEwRDtBQTZDMUQ7OztHQUdHO0FBQ0g7SUFBQTtJQXNEQSxDQUFDO0lBckRDOztPQUVHO0lBQ0ksZ0NBQU8sR0FBZCxVQUFlLE9BQWdEO1FBQzdELE1BQU0sc0JBQXNCLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBRUQ7O09BRUc7SUFDSSx1Q0FBYyxHQUFyQixVQUFzQixPQUF1RDtRQUUzRSwwRUFBMEU7UUFDMUUsMkRBQTJEO1FBQzNELElBQU0sU0FBUyxHQUFHLDRCQUFhLENBQUM7WUFDOUIsU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUU7WUFDN0MsT0FBTyxlQUFNLE9BQU8sQ0FBQyxzQkFBc0IsSUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEdBQUM7WUFDcEUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO1NBQ25CLENBQUMsQ0FBQztRQUNILElBQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRWpFLHlFQUF5RTtRQUN6RSxpREFBaUQ7UUFDakQsS0FBeUIsVUFBZ0MsRUFBaEMsS0FBQSxPQUFPLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxFQUFoQyxjQUFnQyxFQUFoQyxJQUFnQyxFQUFFO1lBQXRELElBQU0sVUFBVSxTQUFBO1lBQ25CLElBQU0sa0JBQWtCLEdBQUcscUNBQXFCLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDN0QsSUFBSSxrQkFBa0IsRUFBRTtnQkFDdEIsVUFBVSxDQUFDLGVBQWUsR0FBRyxrQkFBa0IsQ0FBQzthQUNqRDtTQUNGO1FBRUQsSUFBTSxNQUFNLEdBQTBDLEVBQUUsQ0FBQztRQUN6RCxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUEsU0FBUztZQUMxQixJQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDO1lBQzlCLElBQU0sa0JBQWtCLEdBQUcsU0FBUyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQztZQUMvRCxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksa0JBQWtCLEVBQUU7Z0JBQ3hELE1BQU0sSUFBSSxLQUFLLENBQ1gsaURBQThDLEtBQUssbUNBQStCO3FCQUNsRiw0Q0FBeUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFPLENBQUE7cUJBQzdELE9BQUksa0JBQWtCLGtFQUE4RCxDQUFBO29CQUNwRixzQkFBc0IsQ0FBQyxDQUFDO2FBQzdCO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLGtCQUFrQixDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVEOztPQUVHO0lBQ0ksb0NBQVcsR0FBbEIsVUFBbUIsT0FBb0Q7UUFDckUsTUFBTSxzQkFBc0IsRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFDSCwrQkFBQztBQUFELENBQUMsQUF0REQsSUFzREM7QUF0RFksNERBQXdCO0FBd0RyQztJQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsMkVBQTJFLENBQUMsQ0FBQztBQUMvRixDQUFDIn0=